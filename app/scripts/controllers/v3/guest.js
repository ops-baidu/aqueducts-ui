'use strict';


angular.module('webApp').controller('GuestController', ['$scope', '$location', 'userService', 'authenticationService',
    'tokenService', function ($scope, $location, userService, authenticationService, tokenService) {
  $scope.key = "guest";
  $scope.password = "guest";
  $scope.guest = true;
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
}]);