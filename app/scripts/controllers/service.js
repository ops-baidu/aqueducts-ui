'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('ServiceController', ['$modal', '$route','$log','$scope', '$routeParams', '$location','Restangular', function($modal, $route, $log, $scope, $routeParams, $location, Restangular) {
    var product_id = $routeParams.product ; 
    var services = Restangular.one('products', product_id).all('services');
    var product = Restangular.one('products', product_id);
    product.get().then(function(product) {
      $scope.product = product ;  
    });
    services.getList().then(function(services) {
      $scope.services = services;
    });

    // for job number
    $scope.initService = function(product, service) {
      Restangular.one('products', product.id).one('services', service.id).all('jobs').getList().then(function(jobs) {
        $scope.job_number = jobs.length ;  
      });
    };

    // destroy service
    $scope.destroy = function(service) {
      service.remove().then(function() {
        $route.reload();
      });
    };

    $scope.apply = function(product, service) {
       Restangular.one('products',product.id).one('services',service.id).getList('apply_jobs');
    };
  
    // create and edit service
    $scope.edit = function (product, service) {

      var services = Restangular.one('products', product.id).all('services');
      $scope.base_services = services ; 
   
      var modalInstance = $modal.open({
        templateUrl: 'views/service_detail.html',
        controller: ModalInstanceCtrl,
      });
  
      modalInstance.result.then(function (scope) {
        var name = scope.service.name ; 
        var services = scope.services ; 
        service.name = name ; 
        var a_service = {
          name: name,
        };
        services.post(a_service).then(function() {
          $route.reload();
        });
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    var ModalInstanceCtrl = function ($scope, $modalInstance, $routeParams, Restangular) {
      var product_id = $routeParams.product ; 
      $scope.service = { name: ''};
      Restangular.one('products', product_id).all('services').getList().then(function(services) {
        $scope.services = services ; 
      });
     
      $scope.require = function() {
        if ( $scope.service.name ) return false ; 
	      return true ; 
      };

      $scope.ok = function () {
        $modalInstance.close($scope);
      };
    
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };
    ModalInstanceCtrl.$inject = ['$scope','$modalInstance','$routeParams','Restangular'];
}]);
