'use strict';

angular.module('webApp').controller('MainController', ['authenticationService', '$location', '$routeParams', '$http', function(authenticationService, $location, $routeParams, $http) {

  if (authenticationService.isAuthenticated) {
    $location.path('/home');
  }
  var code = $routeParams.code;
  if (code) {
    $http.post('https://github.com/login/oauth/access_token?client_id=a1e2a7ac67f261d8e534&client_secret=99e92b2f76e22fdc73a840a7d2950b8615b8293f&code=' + code)
    .success(function(data, status, headers, config) {

    })
    .error(function(data, status, headers, config) {
    });
  };

}]);