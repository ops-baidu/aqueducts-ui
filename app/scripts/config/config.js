'use strict';

var aqueductsApp = angular.module('webApp');

aqueductsApp.value('EventsApiBaseUrl', 'http://api.aqueducts.baidu.com/v1/');
aqueductsApp.config(['$routeProvider', 'RestangularProvider', function($routeProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('http://api.aqueducts.baidu.com/v2/');
    RestangularProvider.setDefaultHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
    RestangularProvider.setDefaultHttpFields({
      'withCredentials': true
    });
    RestangularProvider.setRequestInterceptor(function(elem, operation) {
      if (operation === 'remove') {
        return null;
      }
      return elem;
    });
}]);
