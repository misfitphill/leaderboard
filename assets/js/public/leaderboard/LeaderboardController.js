angular.module('LeaderboardModule').controller('LeaderboardController', ['$scope', '$http','UserService','uiGridConstants', function($scope,$http, UserService, uiGridConstants){
	var userData;
	$scope.gridOptions = {data:[]};

	UserService.setScope('leaderboard',$scope);

	UserService.getSummary().then(function(data){
		$scope.users = data;
		$scope.setLeaderboardData('points');
  	});

	$scope.setLeaderboardData = function(attr){
		var filtered = getAttrDataTotal($scope.users,attr);
		
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
var getAttrData = function(date, data, attr){
	var dateIdx = -1; //the given date will be at the same index for each user

	//find the index of the given date
	//THIS CAN BE DONE MORE EFFICEINTLY...later
	for(var i = 0; i < data['MisfitUser'].length; i++){
		if(data['MisfitUser'][i]['date'] == date){
			dateIdx = i;
			break;
		}
	}
	if(dateIdx == -1){
		console.log("ERROR: GIVEN DATE NOT IN RANGE");
		return
	}

	var vals = [];
	var obj = {}
	obj['username'] = "MisfitUser";
	obj[attr] = data['MisfitUser'][dateIdx][attr];
	vals.push(obj);

	var testUsers = data['TestUsers'];

	for(var i = 0; i < testUsers.length; i++){
		Object.keys(testUsers[i]).forEach(function(key){
			var obj = {}
			obj['username'] = key;
			obj[attr] = testUsers[i][key][dateIdx][attr];
			vals.push(obj);
		});		
	}

	console.log(JSON.stringify(vals));
	return vals;
};

var getAttrDataTotal = function(data, attr){
	var vals = [];
	var obj = {}
	obj['username'] = "MisfitUser";
	obj[attr] = sumUserAttr(data['MisfitUser'],attr);
	vals.push(obj);

	var testUsers = data['TestUsers'];

	for(var i = 0; i < testUsers.length; i++){
		Object.keys(testUsers[i]).forEach(function(key){
			var obj = {}
			obj['username'] = key;
			obj[attr] = sumUserAttr(testUsers[i][key],attr);
			vals.push(obj);
		});		
	}

	console.log(JSON.stringify(vals));
	return vals;
}

var sumUserAttr = function(data, attr){
	var sum = 0;
	for(var i = 0; i < data.length; i++){
		var val = data[i][attr];
		sum += val;
	}
	return (sum * 1000) / 1000;
}

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



