'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('DashboardController', ['$scope', '$interval', '$window', 'widgetDefinitions', 'defaultWidgets', 'Restangular', function($scope, $interval, $window, widgetDefinitions, defaultWidgets, Restangular) {
  $scope.dashboardOptions = {
    widgetButtons: true,
    widgetDefinitions: widgetDefinitions,
    defaultWidgets: defaultWidgets,
    //storage: $window.localStorage,
    //storageId: 'aqueducts-dashboard'
  };
  Restangular.all('products').getList().then(function(products) {
    $scope.products = products.length ; 
  });
  Restangular.one('stats/service_no').get().then(function(result) {
    $scope.services = result.service_no ;  
  });
  Restangular.one('stats/events').get().then(function(result) {
    $scope.events = result.events;  
  });
  $interval(function () {
    Restangular.all('products').getList().then(function(products) {
      $scope.products = products.length ; 
    });
    Restangular.one('stats/service_no').get().then(function(result) {
      $scope.services = result.service_no ;  
    });
    Restangular.one('stats/events').get().then(function(result) {
      $scope.events = result.events;  
    });
  }, 2000);
}])
.factory('widgetDefinitions', function() {
  return [
    {
      name: 'Count',
      directive: 'dashboard-widget',
    }
  ];
})
.value('defaultWidgets', [
   { name: 'Count',
     title: 'Product[接入产品]',
     attrs: {
       value: 'products' 
     },
   },
   { name: 'Count',
     title: 'Service[接入模块]',
     attrs: {
       value: 'services' 
     },
   },
   { name: 'Count',
     title: 'Event[正在处理日志]',
     attrs: {
       value: 'events' 
     },
   },
])
.directive('dashboardWidget', function () {
  return {
    restrict: 'A',
    replace: true,
    template: '<div>Value<div class="alert alert-info"><big><strong>{{value}}</strong></big></div></div>',
    scope: {
      value: '=value'
    }
  };
});
