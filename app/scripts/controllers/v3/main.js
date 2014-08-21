'use strict';

angular.module('webApp').controller('MainController', ['$scope', 'authenticationService', '$location', function($scope, authenticationService, $location) {

  if (authenticationService.isAuthenticated) {
    $location.path('/home');
  }


}]);