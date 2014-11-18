'use strict';

// var host = 'http://api.dtrace.aqueducts.baidu.com';
// var host = 'http://10.38.137.32:8082';
var host = 'http://127.0.0.1:3000';
// var host = 'http://10.81.37.247:8128';

// var host = 'http://10.36.52.55:8080';

var aqueductsApp = angular.module('webApp');

aqueductsApp.value('ApiBaseUrl', host + '/v3/');

aqueductsApp.config(['$routeProvider', 'RestangularProvider', function($routeProvider, RestangularProvider) {
    var token = 'Token ' + localStorage.getItem('token');
    RestangularProvider.setBaseUrl(host + '/v3/');
    RestangularProvider.setDefaultHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': token
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
