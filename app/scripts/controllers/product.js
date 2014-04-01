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
aqueductsApp.controller('ProductController', ['$scope', '$routeParams', '$location','Restangular', function($scope, $routeParams, $location, Restangular, product) {
    var product_id = $routeParams.product ; 
    var product = Restangular.one('products', product_id).get();
    $scope.product = product ; 
    var products = Restangular.all('products');

    products.getList().then(function(products) {
      $scope.products = products ;
    });

    $scope.create = function(product){
      products.post(product).then(function(product) {
        $scope.products.push(product);
      });
    };

    $scope.update = function(product){
      product.put();
    };

    $scope.destroy = function(product) {
      product.remove();
    };
}]);
