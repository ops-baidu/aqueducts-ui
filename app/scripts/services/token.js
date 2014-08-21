'use strict';

angular.module('webApp').service('tokenService', function(){
  this.getToken = function(){
    return localStorage.getItem('token');
  };

  this.setToken = function(token){
    localStorage.setItem('token', token);
  };

  this.removeToken = function(){
    localStorage.removeItem('token');
  };


  // this.validateToken = function(token){
  //   var promise = $http.post('/v3/validate_token', {token: token});
  //   promise.then(success, error);

  // };

  // this.resetToken = function(token){

  // };

  // var success = function(response){
  //   setToken(response.data.token);
  //   $location.path('/');
  // };

  // var error = function(response){
  //   $scope.wrongCredentials = true;
  // };


});
