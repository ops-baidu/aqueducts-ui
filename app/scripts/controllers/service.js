'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('ServiceController', ['$modal', '$route','$log','$scope', '$routeParams', '$location','Restangular', function($modal, $route, $log, $scope, $routeParams, $location, Restangular, service) {
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
	console.log(jobs.length);
        $scope.job_number = jobs.length ;  
      });
    };

    // destroy service
    $scope.destroy = function(service) {
      service.remove().then(function() {
        console.log($route);
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
      if (service == 'new') {
         $scope.newService = true;
         $scope.service = { name: ''};
      }
      else {
        $scope.newService = false;
        $scope.service = service;
      } 
   
      var modalInstance = $modal.open({
        templateUrl: 'views/service_detail.html',
        controller: ModalInstanceCtrl,
        resolve: {
          newService: function () {
            return $scope.newService;
          },
          services: function () {
            return $scope.base_services;
          },
          service: function () {
            return $scope.service;
          }
        }
      });
  
      modalInstance.result.then(function (scope) {
        var name = scope.service.name ; 
        var services = scope.services ; 
        if ( scope.newService ) {
          service.name = name ; 
          var a_service = {
            name: name,
          };
          services.post(a_service).then(function() {
            $route.reload();
          });
        } else {
          service.get().then(function(service) {
            service.name = name ; 
            service.put().then(function() {
              $route.reload();
            }) ; 
          });
        }
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    var ModalInstanceCtrl = function ($scope, $modalInstance, newService, service, services) {
      $scope.newService = newService;
      $scope.service = service ; 
      $scope.services = services ; 
     
      $scope.ok = function () {
        $modalInstance.close($scope);
      };
    
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };
}]);
