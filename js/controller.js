//  controller.js

//
// userController
//
angular.module("awApp").controller("userController", function($scope,$http,dbService){
    $scope.users = [];
    $scope.tempUserData = {};

	$scope.getRecords = function() {
		$scope.users = dbService.getRecords('users');
	}; // getRecords

	$scope.deleteUser = function(user) {
	var conf = confirm('Are you sure to delete the user?');
        if(conf === true){
			// params: record variable, table name string
			dbService.deleteRecord(user,'users')
        }
	}; // deleteUser

	$scope.saveUser = function(type,index){
		var tempData = $scope.tempUserData;
		dbService.saveRecord(tempData,type,'users',index);
		$scope.userForm.$setPristine();
        $scope.tempUserData = {};
        $('.formData').slideUp();
	}; // saveUser

    $scope.addUser = function(){
		// parameter references switch type in action.php
        $scope.saveUser('adduser');
    }; // addUser

    $scope.editUser = function(user){
        $scope.tempUserData = {
            id:user.id,
            name:user.name,
            email:user.email,
        };
        $scope.index = $scope.users.list.indexOf(user);
        $('.formData').slideDown();
    }; // editUser

    $scope.updateUser = function(index){
		// include in function call in html; passes index to saveUser()
        $scope.saveUser('edituser',index);
    }; //

    $scope.getUserLocation = function() {
        var table = 'users';
        var conditions = {'where': 'id', 'value': '= 1'};
        $scope.records = dbService.getUserLocation(table,conditions);
    }; // getUser

}); // userController

// formController
angular.module("awApp").controller("formController", function($scope,$http){
	$scope.upload = function () {
		var file_data = $('#file').prop('files')[0];
		var arkid = $('#arkid').val();
		var form_data = new FormData();
		form_data.append('file', file_data);
		form_data.append('arkid', arkid);
		$.ajax({
                url: '/php/upload.php', // point to server-side PHP script
                dataType: 'text',  // what to expect back from the PHP script
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                type: 'post',
                success: function(response) {
				var msg = 'File sucessfully uploaded.';
				console.log(response);
				messageSuccess(msg);
				}
		});
	};
}); // formController

//
// index controller (or whatever)
//
angular.module("awApp").controller("indexController", function($scope,$http,dbService){

	$scope.getNewDocs = function() {
      var table = 'docs';
      var conditions = {'where': 'created', 'value': 'IS NOT NULL'};
  		$scope.records = dbService.queryRecords(table,conditions);
	}; // getNewDocs

  $scope.getRecords = function(table) {
      $scope.records = dbService.getRecords(table);
  }; // getNewDocs


}); // indexController
