'use strict';

angular.module('webApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui',
  'restangular',
  'ui.bootstrap',
  'highcharts-ng'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .when('/astream/products', {
        templateUrl: 'views/list_product.html',
        controller: 'ProductController'
      })
      .when('/astream/products/:product/services', {
        templateUrl: 'views/list_service.html' ,
        controller: 'ServiceController'
      })
      .when('/astream/products/:product/services/:service', {
        templateUrl: 'views/events_charts.html' ,
        controller: 'EventsController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
