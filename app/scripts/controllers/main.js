'use strict';

var aqueductsApp = angular.module('webApp');

aqueductsApp.config(function($routeProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('http://127.0.0.1:3000/v2/');
    RestangularProvider.setRequestInterceptor(function(elem, operation) {
      if (operation === 'remove') {
        return null;
      }
      return elem;
    });
});
