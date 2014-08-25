'use strict';

angular.module('webApp').controller('NavbarController', ['$scope', 'authenticationService', 'tokenService',
  '$location', '$routeParams', 'Restangular',function ($scope, authenticationService, tokenService, $location, $routeParams, Restangular) {
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
  };
  $scope.redirectToCharts = function(){
    if ($routeParams.orgname != undefined) {
      $scope.orgname = $routeParams.orgname;
      $location.path('/charts/' + $scope.orgname);
    }
    else{
      $location.path('/charts');

    }
  };
  $scope.getContext = function(){
    Restangular.all('user').customGET('info').then(function(user){
      $scope.username = user.name;
      if ($routeParams.orgname != undefined) {
        $scope.context = $routeParams.orgname;
      }else{
        $scope.context = user.name;

      }

    });
    Restangular.all('orgs').getList().then(function(orgs) {
      $scope.orgs = orgs;
    });
  };
  $scope.setContext = function(name){
    $scope.context = name;
  };

}]);