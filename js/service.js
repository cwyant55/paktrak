//
// service.js
//

// create, retrieve, update, delete records from database
angular.module("awApp").factory('dbService', function($http) {
	var records = {};

	return {
		// function to return all records from table with no conditions
		getRecords : function(table) {
        $http.get('/php/action.php', {
            params:{
                'type':'view',
								'table':table
            }
        }).success(function(response){
			records.list = response.records;
			console.log(records.list);
        });
		return records;
    }, // getRecords

		// function to return all records with query parameters
		queryRecords : function(type,table,conditions) {
				var cond = JSON.stringify(conditions);
				$http.get('/php/action.php', {
						params:{
								'type': type,
								'table': table,
								'conditions':cond
						}
				}).success(function(response){
			records.list = response.records;
			console.log(records.list);
				});
		return records;
	}, // queryRecords

		deleteRecord : function(record,tableName) {
		var data = $.param({
                'id': record.id,
                'type':'delete',
				'table':tableName
            });
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            $http.post("/php/action.php",data,config).success(function(response){
                if(response.status == 'OK'){
                    var index = records.list.indexOf(record);
                    records.list.splice(index,1);
                    messageSuccess(response.msg);
                }else{
                    messageError(response.msg);
                }
            });
    }, // deleteRecord

		saveRecord : function(tempData,type,tableName,index) {
		var data = $.param({
        'data':tempData,
        'type':type,
				'table':tableName
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post("/php/action.php", data, config).success(function(response){
            if(response.status == 'OK'){
                if(type == 'edituser'){
                    records.list[index].id = tempData.id;
                    records.list[index].name = tempData.name;
                    records.list[index].email = tempData.email;
                }else{
                    //records.list.push({
                    //    id:response.data.id,
                    //    name:response.data.name,
                    //    email:response.data.email,
                    //});
                }
                messageSuccess(response.msg);
            }else{
                messageError(response.msg);
            }
        });
	}, // saveRecord

	} // return

}); // dbService
