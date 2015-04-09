angular.module('LeaderboardModule').controller('LeaderboardController', ['$scope', '$http', function($scope,$http){
	$scope.getUserData = function(){
		$scope.dataMsg = 'getting user data!';

		$http.get('/user/testdata').success(function(response){
			$scope.users = response['users'];
		})
	}
	
}]);
