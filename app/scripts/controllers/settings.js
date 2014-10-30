'use strict';

angular.module('webApp').controller('SettingsController', ['$scope','Restangular', 'tokenService', '$route', function($scope, Restangular, tokenService, $route) {
  $scope.account = false;
  $scope.changePasswordFailed = false;
  $scope.changeEmailFailed = false;
  $scope.changeUsernameFailed = false;
  $scope.guest = false;
  Restangular.all('user').customGET('info').then(function(user){
    $scope.user = user;
    if (user.name == "guest") {$scope.guest = true;};
  });
  $scope.resetToken = function(){
    Restangular.all('').customGET('reset_token').then(function(token){
      tokenService.setToken(token.token);
      $scope.user.authentication_token = token.token;
    });
  };

  $scope.changePassword = function(old, new_pass){
    Restangular.all('user').customPOST({old: old, 'new': new_pass}, "change_password", {}, {}).then(function(){
      $route.reload();
    }, function() {
      $scope.changePasswordFailed = true;
    });
  };
  $scope.changeEmail = function(email){
    Restangular.all('user').customPOST({email: email}, "change_email", {}, {}).then(function(){
      $route.reload();
    }, function() {
      $scope.changeEmailFailed = true;
    });
  };
  $scope.changeUsername = function(name) {
    Restangular.all('user').customPOST({name: name}, "change_name", {}, {}).then(function(){
      $route.reload();
    }, function() {
      $scope.changeUsernameFailed = true;
    });
  };

}]);