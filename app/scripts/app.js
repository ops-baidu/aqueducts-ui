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
      .when('/astream/products/:product/services/:service/jobs', {
        templateUrl: 'views/list_job.html' ,
        controller: 'JobController'
      })
      .when('/astream/products/:product/services/:service/jobs/:job', {
        templateUrl: 'views/job_charts.html' ,
        controller: 'JobController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
