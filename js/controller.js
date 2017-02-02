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

}); // userController

// searchController for Apache Solr
angular.module("awApp").controller("searchController", function($scope,$http){
    $scope.results = [];
    // function to get search results
    $scope.getResults = function(){
		var query = 'http://awjs.local/solr/awjs/select?q=' + $scope.keywords + '&wt=json';
        $http.get(query).success(function(response){
                $scope.results = response.response.docs;
				console.log($scope.results);
        });
    };
});	// Apache Solr controller

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
// ARK controller
//
angular.module("awApp").controller("arkController", function($scope,$http,dbService,$location){

	// get records
	$scope.getRecords = function(table) {
		$scope.records = dbService.getRecords(table);
	};

// function to generate ARK request
    $scope.arkRequest = function(){
			var data = $.param({
            'data': $scope.temp,
            'type':'ark',
			'table':'docs'
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post("/php/action.php", data, config).success(function(response){
            if(response.status == 'OK'){
                messageSuccess(response.msg);
            }else{
                messageError(response.msg);
            }
        });
    };

	// function to view document on tools page
    $scope.viewDoc = function(){
		console.log($scope.temp);
		var docpath = '/upload/' + $scope.temp.ark.docname;
        $http.get(docpath).success(function(response){
			$('#docview > pre').html(response);
			$('#docview').show();
        });
    };

	// view doc with xsl
	$scope.viewXML = function() {
	   var docpath = '/upload/' + $scope.temp.ark.docname;
        $http.get('/php/xml.php', {
            params:{
                'file': docpath
				}
        }).success(function(response){
        $('#docview > pre').html(response);
    		$('#docview').show();
        });
	};

  // function to view document in search results
    $scope.viewResult = function(){
      var ark = "= " + "'" + $location.search()['ark'] + "'";
          var table = 'docs';
          var conditions = {'where': 'arkid', 'value': ark};
          $scope.records = dbService.getXML(table,conditions);
      }; // viewResult

}); // ARK controller

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
