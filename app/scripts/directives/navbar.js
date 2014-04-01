'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.directive('navBar', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/navbar.html'
  };
});

