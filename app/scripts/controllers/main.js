'use strict';

var aqueductsApp = angular.module('webApp');

aqueductsApp.config(function($routeProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('http://api.aqueducts.baidu.com/v2/');
    RestangularProvider.setRequestInterceptor(function(elem, operation) {
      if (operation === 'remove') {
        return null;
      }
      return elem;
    });
});
