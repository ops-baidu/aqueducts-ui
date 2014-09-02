'use strict';


angular.module('webApp').controller('UserController', ['$scope', '$location', 'Restangular', 'authenticationService',
    'tokenService', function ($scope, $location, Restangular, authenticationService, tokenService) {
  $scope.login = function login(key, password) {
    if (key != null && password != null) {
      // Restangular.customPOST({})
      // userService.login(key, password).success(function(data) {
      //   authenticationService.isAuthenticated = true;
      //   tokenService.setToken(data.token);
      //   $location.path('/users/' + data.name);
      // }).error(function(status, data) {
      //   $scope.wrongCredentials = true;
      // });
    }
  };



  $scope.join = function join(email, name, password) {
    if (authenticationService.isAuthenticated) {
      $location.path('/');
    }
    else {
      var user = {
        email: email,
        name: name,
        password: password
      };
      Restangular.all('', '').customPOST(user, "join").then(function(data){
        tokenService.setToken(data.token);
        authenticationService.isAuthenticated = true;
        $location.path('/users/' + data.name);
      }, function(status, data){
        $scope.wrongCredentials = true;
      });
      // userService.join(email, name, password).success(function(data) {

      // }).error(function(status, data) {

      // });
    }
  };
}]);
