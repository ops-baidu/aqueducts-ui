'use strict';

angular.module('webApp').controller('MainController', ['authenticationService', '$location',
  '$routeParams', '$http', 'ApiBaseUrl', 'tokenService',
  function(authenticationService, $location, $routeParams, $http, ApiBaseUrl,
    tokenService) {

  if (authenticationService.isAuthenticated) {
    $location.path('/home');
  } else {
    var code = $routeParams.code;
    if (code) {
    $http.post(ApiBaseUrl + 'auth/github?code=' + code) 
    .success(function(data, status, headers, config) {
      authenticationService.isAuthenticated = true;
      tokenService.setToken(data.token);
      $location.url($location.path());
      $location.path('/home');
    })
    .error(function(data, status, headers, config) {
      $location.url($location.path());
      $location.path('/login')
    });
  };

  }
  
}]);