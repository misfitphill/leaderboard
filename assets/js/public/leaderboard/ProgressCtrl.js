angular.module('LeaderboardModule').controller('ProgressCtrl', ['$scope', function($scope){
	
	$scope.getUserData = function(){
		$http.get('/user/getsummary').success(function(response){
			var userData = JSON.stringify(response);
			var misfitUser = userData["MisfitUser"];
			$scope.testUsers = userData["TestUsers"];
			$scope.max = 5000;
			$scope.dynamic = 500;

		})
	}


}]);