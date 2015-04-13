var app = angular.module('LeaderboardModule', ['ui.bootstrap','angularCharts','ui.grid']);

app.factory("UserService", function($http) {
  	var userData;
  	var fields = [];
  	var lastGET;
  	var scopes = {};
  	return {
  		setScope: function(controller, scope){
	  		scopes[controller] = scope;
	  	},

	  	getSummary: function(){
	  		scopes['leaderboard'].gridOptions = {
            	enableSorting: false,
            	enableRowSelection: true,
            	enableHighlighting: true,
            	pinSelectionCheckbox: true,
            	multiSelect: false,
            	afterSelectionChange: function() {
            		alert("changed");
        		},
            	onRegisterApi: function(gridApi) {
      				scopes['leaderboard'].gridApi = gridApi;
    			}
       		};
	  		if(lastGET !== "summary"){
				var promise = $http.get('/user/getsummary').then(function(response){
					 userData = response.data;
					 lastGET = "summary";

				     //inform DropdownCtrl that the user data has been retrieved and
				     //send the fields to populate the dropdown
				     var fields = [];
					Object.keys(userData["MisfitUser"][0]).forEach(function(key){
						if(key !== 'date')
							fields.push(key.charAt(0).toUpperCase() + key.slice(1));
					});
					scopes['dropdown'].$emit('dropdownEvent',{fields:fields});

					//return the user data
					 return userData;
				});
				return promise;
			}else{
				return userData;
			}
	  	},

	    updateAttr: function(attr){
	    	console.log("in service attr");
	    	scopes['leaderboard'].$emit('updateAttrEvent',{attr:attr});
	    }
    };
});

/*app.controller("LeaderboardController", function($scope, UserService) {
  UserService.getSummary().then(function(data){
  	$scope.users = JSON.stringify(data);
  })
});

app.controller("DropdownCtrl", function($scope, UserService) {
  $scope.users = UserService.getSummary();
});
*/

/*var sharedServicesModule = angular.module('sharedServices',[]);
sharedServices.service('UserService', function($http){
	getSummary: function(){
		var promise = $http.get('/user/getsummary').then(function(response){
			 return response;
		});
		return promise;
  	}
});

var leaderboardModule = angular.module('leaderboard',['sharedServices']);
leaderboardModule.service('leaderboardService', function(UserService){UserService.getSummary()});
leaderboardModule.controller('leaderboardCtrl', function($scope, leaderboardService){

});

var app = angular.module('app', ['sharedServices', 'login']);*/

