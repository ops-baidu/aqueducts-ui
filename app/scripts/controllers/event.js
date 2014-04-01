'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('EventsController', ['$scope', '$routeParams', '$location','Restangular','$http', '$q', function($scope, $routeParams, $location, Restangular, $http, $q, product) {
    var product_id = $routeParams.product ; 
    var service_id = $routeParams.service ; 
    var items = Restangular.one('products', product_id).one('services', service_id).all('items');
    var service = Restangular.one('products',product_id).one('services', service_id).get().$object ; 
    var product = Restangular.one('products',product_id).get().$object ; 
    $scope.service = service; 
    $scope.product = product; 
    console.log(service);

    items.getList().then(function(items) {
      $scope.items = items ;
      console.log(items);
    });

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

}]);

