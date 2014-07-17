'use strict';

// var host = 'http://api.aqueducts.baidu.com';
var host = 'http://0.0.0.0:3000';

var aqueductsApp = angular.module('webApp');

aqueductsApp.value('EventsApiBaseUrl', host + '/v1/');
aqueductsApp.config(['$routeProvider', 'RestangularProvider', function($routeProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl(host + '/v2/');
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
