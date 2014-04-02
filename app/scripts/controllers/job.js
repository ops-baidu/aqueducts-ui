'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('JobController', ['$modal', '$route','$log','$scope', '$routeParams', '$location','Restangular', function($modal, $route, $log, $scope, $routeParams, $location, Restangular, service) {
    $scope.chartConfig = {
       useHighStocks : true,
       credits : true,
       rangeSelector : {
         selected : 1
       },
       title : {
         text : 'placeholder'
       },
       series : [],
    };
    var product_id = $routeParams.product ; 
    var service_id = $routeParams.service ; 
    var jobs = Restangular.one('products', product_id).one('services', service_id).all('jobs');
    var product = Restangular.one('products', product_id);
    var service = Restangular.one('products', product_id).one('services', service_id);
    $scope.product = product.get().$object ; 
    $scope.service = service.get().$object ; 

    jobs.getList().then(function(jobs) {
      $scope.jobs = jobs;
      //$scope.product = Restangular.one('products', product_id)
    });

    $scope.destroy = function(job) {
      job.remove().then(function() {
        console.log($route);
        $route.reload();
      });
    };
}]);
