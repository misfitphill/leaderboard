angular.module('LeaderboardModule').controller('ChartCtrl', ['$scope','UserService', function($scope, UserService){

	var userData;
	var attr;
	var username;

	UserService.setScope('chart',$scope);

	$scope.chartObject = {};

	$scope.$on('userSelectEvent', function(event,args){
		
		userData = args.data;
		attr = args.attr;
		username = args.username;
		var filtered = getAttrData(userData,attr);
	    $scope.updateChart(userData,attr);
	});

	$scope.$on('updateAttrEvent', function(event,args){
		attr = args.attr;
		$scope.updateChart(userData,attr);
	});

	$scope.updateChart = function(userData,attr){
		var filtered = getAttrData(userData,attr);
		$scope.chartObject.data = {"cols": [
	        {id: "d", label: "Date", type: "string"},
	        {id: "a", label: 'Points', type: "number"}
	    ], "rows": filtered};
	        $scope.chartObject.type = 'ColumnChart';

	    var title = 'Daily ' + (attr.charAt(0).toUpperCase() + attr.slice(1)) + ' Breakdown for ' + username;
	    if(attr === 'distance')
	    	title += ' (in miles)'
	    $scope.chartObject.options = {
	        'title': title,
	        legend: { position: "none" }
	    }
	};
}]);



var getAttrData = function(data, attr){
	var filtered = [];
	for(var i = 0; i < data.length; i++){
		var dataPoint = {};
		var c = [];
		var v1 = {};
		var v2 = {};

		v1.v = data[i]['date'];
		v2.v = data[i][attr];
		c.push(v1);
		c.push(v2);
		dataPoint.c = c;
		filtered.push(dataPoint);
	}

	return filtered;
};

