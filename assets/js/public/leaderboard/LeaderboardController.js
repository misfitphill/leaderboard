angular.module('LeaderboardModule').controller('LeaderboardController', ['$scope', '$http','UserService','uiGridConstants', function($scope,$http, UserService, uiGridConstants){
	var userData;
	$scope.gridOptions = {data:[]};

	UserService.setScope('leaderboard',$scope);

	UserService.getSummary().then(function(data){
		$scope.users = data;
		$scope.setLeaderboardData('points');
  	});

	$scope.setLeaderboardData = function(attr){
		var filtered = getAttrData($scope.users,attr);
		
		var colDefs = [{field:'username'}];
		var colObj = {};
		colObj['field'] = attr;
		colDefs.push(colObj);

		$scope.gridOptions.columnDefs = colDefs;
		$scope.gridOptions.data = filtered;
		$scope.gridOptions.selectedItems = [];
		$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );

	}

	$scope.$on('updateAttrEvent', function(event, args){
		//console.log(args['attr']);
		$scope.setLeaderboardData(args['attr']);
	});


	//$scope.showChart = function(){
					/*$scope.acConfig = {
				title: 'User Data',
				tooltips: false,
				labels: false,
				mouseover: function(){},
				mouseout: function(){},
				click: function(){},
				legend: {
					display: false
				}
			};

			var data = [];
			Object.keys(filtered).forEach(function(key){
				var obj = {};
				obj['x'] = key;
				obj['y'] = [filtered[key]];
				data.push(obj);
			});

			$scope.chartData = {
				series: Object.keys(filtered),
				data: data
			};

			$scope.loadedData = true;
			console.log("http.get");*/
	//}
	
}]);

/*
Takes a JSON object containing the user data (both misfit and test users) and
returns an array of objects mapping user name to the value of the given attribute.
The resulting array will be sorted by attribute value (greatest to least).	

ONLY WORKS FOR SINGLE DATE RIGHT NOW

@param data (JSON) - a JSON object containing the misfit and test user data
@param attr (string) - a string
*/   
var getAttrData = function(data, attr){
	var vals = [];
	var obj = {}
	obj['username'] = "MisfitUser";
	obj[attr] = data['MisfitUser'][0][attr];
	vals.push(obj);

	var testUsers = data['TestUsers'];

	for(var i = 0; i < testUsers.length; i++){
		Object.keys(testUsers[i]).forEach(function(key){
			var obj = {}
			obj['username'] = key;
			obj[attr] = testUsers[i][key][0][attr];
			vals.push(obj);
		});		
	}

	console.log(JSON.stringify(vals));
	return vals;
};

/*
var tuples = [];

for (var key in obj) tuples.push([key, obj[key]]);

tuples.sort(function(a, b) {
    a = a[1];
    b = b[1];

    return a < b ? -1 : (a > b ? 1 : 0);
});

for (var i = 0; i < tuples.length; i++) {
    var key = tuples[i][0];
    var value = tuples[i][1];

    // do something with key and value
}*/



