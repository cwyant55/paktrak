<?php
include 'DB.php';
$db = new DB();

// for default getRecords
if (isset($_REQUEST['table'])) {
    $tblName = $_REQUEST['table'];
}

// for new queryRecords
if (isset($_REQUEST['conditions'])) {
  $cond = json_decode($_REQUEST['conditions'], true);
  $conditions = array('where' => array($cond['where'] => $cond['value']));

  // debug: log conditions variable to file
  $txt = 'From action.php - ' . $_REQUEST['conditions'];
  $myfile = file_put_contents('logs.txt', $txt.PHP_EOL , FILE_APPEND | LOCK_EX);
} // if



// below working example
//$conditions = array('where' => array('id' => '40'));

if(isset($_REQUEST['type']) && !empty($_REQUEST['type'])){
    $type = $_REQUEST['type'];
    switch($type){
        case "view":
            $records = $db->getRows($tblName);
            if($records){
                $data['records'] = $db->getRows($tblName);
                $data['status'] = 'OK';
            }else{
                $data['records'] = array();
                $data['status'] = 'ERR';
            }
            echo json_encode($data);
            break;
          case "query":
                $records = $db->getRows($tblName,$conditions);
                if($records){
                    $data['records'] = $db->getRows($tblName,$conditions);
                    $data['status'] = 'OK';
                }else{
                    $data['records'] = array();
                    $data['status'] = 'ERR';
                }
                echo json_encode($data);
            break;
        case "adduser":
            if(!empty($_POST['data'])){
                $userData = array(
                    'name' => $_POST['data']['name'],
                    'email' => $_POST['data']['email']
                );
                $insert = $db->insert($tblName,$userData);
                if($insert){
                    $data['data'] = $insert;
                    $data['status'] = 'OK';
                    $data['msg'] = 'User data has been added successfully.';
                }else{
                    $data['status'] = 'ERR';
                    $data['msg'] = 'Some problem occurred, please try again.';
                }
            }else{
                $data['status'] = 'ERR';
                $data['msg'] = 'Some problem occurred, please try again.';
            }
            echo json_encode($data);
            break;
		case "ark":
            if(!empty($_POST['data'])){
				// generate random ARK ID
				$rando = rand(4000, 5000);
				$arkid = '80444/xv' . $rando;

                $arkData = array(
                    'inst' => $_POST['data']['inst'],
					'arkid' => $arkid
                );
                $insert = $db->insert($tblName,$arkData);
                if($insert){
                    $data['data'] = $insert;
                    $data['status'] = 'OK';
                    $data['msg'] = 'Ark ID generated: ' .$arkid;
                }else{
                    $data['status'] = 'ERR';
                    $data['msg'] = 'Some problem occurred, please try again.';
                }
            }else{
                $data['status'] = 'ERR';
                $data['msg'] = 'Some problem occurred, please try again.';
            }
            echo json_encode($data);
            break;
        case "edituser":
            if(!empty($_POST['data'])){
                $userData = array(
                    'name' => $_POST['data']['name'],
                    'email' => $_POST['data']['email']
                );
                $condition = array('id' => $_POST['data']['id']);
                $update = $db->update($tblName,$userData,$condition);
                if($update){
                    $data['status'] = 'OK';
                    $data['msg'] = 'User data has been updated successfully.';
                }else{
                    $data['status'] = 'ERR';
                    $data['msg'] = 'Some problem occurred, please try again.';
                }
            }else{
                $data['status'] = 'ERR';
                $data['msg'] = 'Some problem occurred, please try again.';
            }
            echo json_encode($data);
            break;
        case "delete":
            if(!empty($_POST['id'])){
                $condition = array('id' => $_POST['id']);
                $delete = $db->delete($tblName,$condition);
                if($delete){
                    $data['status'] = 'OK';
                    $data['msg'] = 'Record has been deleted successfully.';
                }else{
                    $data['status'] = 'ERR';
                    $data['msg'] = 'Some problem occurred, please try again.';
                }
            }else{
                $data['status'] = 'ERR';
                $data['msg'] = 'Some problem occurred, please try again.';
            }
            echo json_encode($data);
            break;
        default:
            echo '{"status":"INVALID"}';
    }
}
