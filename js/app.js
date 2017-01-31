// define main CRUD application
//angular.module("awApp", []);

angular.module('awApp', [], function($locationProvider) {
	$locationProvider.html5Mode(true);
});

// global functions for displaying success and error messages
	var messageSuccess = function(msg){
        $('.alert-success > p').html(msg);
        $('.alert-success').show();
        $('.alert-success').delay(5000).slideUp(function(){
        $('.alert-success > p').html('');
        });
    }; // messageSuccess

	var messageError = function(msg){
        $('.alert-danger > p').html(msg);
        $('.alert-danger').show();
        $('.alert-danger').delay(5000).slideUp(function(){
            $('.alert-danger > p').html('');
        });
    };
