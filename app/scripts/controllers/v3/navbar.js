'use strict';

angular.module('webApp').controller('NavbarController', ['$scope', 'authenticationService', 'tokenService', '$location','$routeParams', function ($scope, authenticationService, tokenService, $location, $routeParams) {
  $scope.isLoggedIn = function(){
    return authenticationService.isAuthenticated;
  };
  $scope.logout = function(){
    if (authenticationService.isAuthenticated) {
      authenticationService.isAuthenticated = false;
      tokenService.removeToken();
      $location.path('/');
    }
    else {
      $location.path('/login');
    }
  };
  
  $scope.redirectToConsole = function(){
    if ($routeParams.orgname != undefined) {
      $scope.orgname = $routeParams.orgname;
      $location.path('/console/' + $scope.orgname);
    }
    else{
      $location.path('/console');

    }
  }
  

}]);