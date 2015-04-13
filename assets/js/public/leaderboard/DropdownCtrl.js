angular.module('LeaderboardModule').controller('DropdownCtrl', ['$scope', 'UserService', function($scope, UserService){
	
	UserService.setScope('dropdown',$scope);

	$scope.status = {isopen: false};

	$scope.toggleDropdown = function($event){
		$event.preventDefault();
		$event.stopPropagation();
		$scope.status.isopen = !$scope.status.isopen;
	};

	$scope.dropdownTxt = "Points";
	$scope.setDropdownTxt = function(txt){
		$scope.dropdownTxt = txt;
		console.log("changed dropdown text");
		UserService.updateAttr(txt.toLowerCase());
	};

	$scope.$on("dropdownEvent", function(event, args){
		console.log(args['fields']);
		$scope.fields = args['fields'];
	});

						 
}]);