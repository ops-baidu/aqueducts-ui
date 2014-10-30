'use strict';


angular.module('webApp').controller('GuestController', ['Restangular','$scope', '$location', 'authenticationService',
    'tokenService', function (Restangular, $scope, $location, authenticationService, tokenService) {
  $scope.key = "guest";
  $scope.password = "guest";
  $scope.guest = true;
  $scope.login = function login(key, password) {
    if (key != null && password != null) {

      Restangular.all('user').customPOST({key: key, password: password}, "login").then(function(data){
        authenticationService.isAuthenticated = true;
        tokenService.setToken(data.token);
        $location.path('/users/' + data.name);
      }, function(data){
        $scope.wrongCredentials = true;
      });
    }
  };
}]);