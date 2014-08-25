'use strict';


angular.module('webApp').controller('UserController', ['$scope', '$location', 'userService', 'authenticationService',
    'tokenService', function ($scope, $location, userService, authenticationService, tokenService) {
  $scope.login = function login(key, password) {
    if (key != null && password != null) {

      userService.login(key, password).success(function(data) {
        authenticationService.isAuthenticated = true;
        tokenService.setToken(data.token);
        $location.path('/users/' + data.name);
      }).error(function(status, data) {
        $scope.wrongCredentials = true;
      });
    }
  };



  $scope.join = function join(email, name, password) {
    if (authenticationService.isAuthenticated) {
      $location.path('/');
    }
    else {
      userService.join(email, name, password).success(function(data) {
        tokenService.setToken(data.token);
        authenticationService.isAuthenticated = true;
        $location.path('/users/' + data.name);
      }).error(function(status, data) {
        $scope.wrongCredentials = true;

      });
    }
  };
}]);
