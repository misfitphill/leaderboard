angular.module('LeaderboardModule').controller('LeaderboardController', ['$scope', '$http','UserService','uiGridConstants', function($scope,$http, UserService, uiGridConstants){
	var userData;
	$scope.gridOptions = {data:[]};

	UserService.setScope('leaderboard',$scope);

	//call the misfitAPI to get ALL of the user data when this controller is loaded
	UserService.getSummary().then(function(data){
		$scope.users = data;
		$scope.setLeaderboardData('points');
		console.log(Object.keys(data)[0]);
		var dateRange = data[ Object.keys(data)[0] ][0]['date'] + " to " + data[Object.keys(data)[0]][data[Object.keys(data)[0]].length-1]['date'];
		$scope.dateRange = dateRange;
  	});

	//updates the leaderboard grid when the attribute has been changed by the
	//dropdown menu
	$scope.setLeaderboardData = function(attr){
		var filtered = getAttrDataTotal($scope.users,attr);
		
		var colDefs = [{field:'username'}];
		var colObj = {};
		colObj['field'] = attr;
		colDefs.push(colObj);

		$scope.gridOptions.columnDefs = colDefs;
		$scope.gridOptions.data = filtered;
		$scope.selectedItems = [];
		$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
	}

	$scope.$on('updateAttrEvent', function(event, args){
		$scope.setLeaderboardData(args['attr']);
	});

	
}]);

/*
Takes a JSON object containing the user data (both misfit and test users) and
returns an array of objects mapping user name to the value of the given attribute.
The resulting array will be sorted by attribute value (greatest to least).	

ONLY WORKS FOR SINGLE DATE

@param date (string) - a date in the form 'yyyy-mm-dd'. MUST BE IN A VALID RANGE
@param data (JSON) - a JSON object containing the misfit and test user data
@param attr (string) - the attribute to get values for (points, steps, etc)
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
	Object.keys(data).forEach(function(key){
		console.log(key);
		var obj = {}
		obj['username'] = key;
		obj[attr] = data[key][dateIdx][attr];
		vals.push(obj);
	});		

	//sort in decreasing order
	vals.sort(function(a,b){
		a = a[attr];
		b = b[attr];
		return a < b ? 1 : (a > b ? -1 : 0);
	});

	console.log(JSON.stringify(vals));
	return vals;
};

/*
Takes a JSON object containing the user data (both misfit and test users) and
returns an array of objects mapping user name to the TOTAL SUMMED value of the given
attribute over the range of all dates provided in date.
The resulting array will be sorted by attribute value (greatest to least).	

@param data (JSON) - a JSON object containing the misfit and test user data
@param attr (string) - the attribute to get values for (points, steps, etc)
*/
var getAttrDataTotal = function(data, attr){
	var vals = [];
	Object.keys(data).forEach(function(key){
		var obj = {};
		obj['username'] = key;
		obj[attr] = sumUserAttr(data[key],attr);
		vals.push(obj);
	});		

	//sort in decreasing order
	vals.sort(function(a,b){
		a = a[attr];
		b = b[attr];
		return a < b ? 1 : (a > b ? -1 : 0);
	});

	var misfitUser = vals[0];
	vals.shift();
	var inserted = false;
	for(var i = 0; i < vals.length; i++){
		if(parseFloat(vals[i][attr]) < parseFloat(misfitUser[attr])){
			vals.splice(i,0,misfitUser);
			inserted = true;
			break;
		}
	}
	if(!inserted)
		vals.push(misfitUser);

	return vals;
}


var sumUserAttr = function(data, attr){
	var sum = 0;
	for(var i = 0; i < data.length; i++){
		var val = data[i][attr];
		sum += val;
	}
	if(attr !== 'steps')
		sum = sum.toFixed(2);
	return sum;
}



