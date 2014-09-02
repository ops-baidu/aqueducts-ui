'use strict';


angular.module('webApp').controller('UserController', ['$scope', '$location', 'Restangular', 'authenticationService',
    'tokenService', function ($scope, $location, Restangular, authenticationService, tokenService) {
  $scope.login = function login(key, password) {
    if (key != null && password != null) {
      Restangular.all('user').customPOST({key: key, password: password}, "login").then(function(data){
        authenticationService.isAuthenticated = true;
        tokenService.setToken(data.token);
        $location.path('/users/' + data.name);
      }, function(data){
        $scope.loginFailedMsg = data.data.message;
        $scope.loginFailed = true;
      });
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
        password: password,
      };
      Restangular.all('user').customPOST(user, "join").then(function(data){
        tokenService.setToken(data.token);
        authenticationService.isAuthenticated = true;
        $location.path('/users/' + data.name);
      }, function(data){
        $scope.joinFailedMsg = data.data.message;
        $scope.joinFailed = true;
      });

    }
  };
}]);
