angular.module('LeaderboardModule').controller('LeaderboardController', ['$scope', '$http', function($scope,$http){
	$scope.getUserData = function(){
		$scope.dataMsg = 'getting user data!';
		$scope.msg1 = req.session.authenticated;
		$scope.msg2 = req.session.user; 

		$http.get('/user/testdata').success(function(response){
			$scope.users = response['users'];
		})
	}
	
}]);
