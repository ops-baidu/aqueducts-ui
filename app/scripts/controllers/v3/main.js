'use strict';

angular.module('webApp').controller('MainController', ['authenticationService', '$location', function(authenticationService, $location) {

  if (authenticationService.isAuthenticated) {
    $location.path('/home');
  }

}]);