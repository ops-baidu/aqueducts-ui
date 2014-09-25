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
    var orgname = $routeParams.orgname;
    var service_name = $routeParams.service_name;

    if (orgname != undefined) {
      if (service_name != undefined) {
        $location.path('/console/orgs/' + orgname + '/' + service_name);
      } else{
        $location.path('/console/orgs/' + orgname);
      };
    }
    else{
      if (service_name != undefined) {
        $location.path('/console/' + service_name);
      } else{
        $location.path('/console');
      };

    }
  };
  $scope.redirectToCharts = function(){
    var orgname = $routeParams.orgname;
    var service_name = $routeParams.service_name;

    if (orgname != undefined) {
      if (service_name != undefined) {
        $location.path('/charts/orgs/' + orgname + '/' + service_name);
      } else{
        $location.path('/charts/orgs/' + orgname);
      };
    }
    else{
      if (service_name != undefined) {
        $location.path('/charts/' + service_name);
      } else{
        $location.path('/charts');
      };

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