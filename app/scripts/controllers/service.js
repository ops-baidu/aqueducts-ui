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

    $scope.destroy = function(service) {
      service.remove().then(function() {
        console.log($route);
        $route.reload();
      });
    };
  
    $scope.edit = function (product, service) {

      var items = Restangular.all('items').getList();
      var services = Restangular.one('products', product.id).all('services');
      $scope.items = items ;  

      $scope.base_services = services ; 
      if (service == 'new') {
         $scope.newService = true;
         $scope.service = { name: '' , item_ids: [] };
	 $scope.select_items = [];
      }
      else {
        var select_items = Restangular.one('products', product.id).one('services',service.id).all('jobs').getList();
        $scope.select_items = select_items ;  
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
          items: function () {
            return $scope.items;
          },
          select_items: function () {
            return $scope.select_items;
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
        var ids = scope.ids ; 
        var services = scope.services ; 
        if ( scope.newService ) {
          console.log(scope.newService);
            var ids_array = [];
            for ( var index in ids ) {
              if ( ids[index] = true )  {
                ids_array.push(index) ;
              }
            }
          // todo : create new service 
          service.name = name ; 
          service.item_ids = ids_array ; 
          console.log(name);
          console.log(ids_array);
          console.log(service);
          var a_service = {
            name: name,
            item_ids: ids_array
          };
          console.log(a_service);
          services.post(a_service).then(function() {
            console.log($route);
            $route.reload();
          });
        } else {
          service.get().then(function(service) {
            var ids_array = [];
            for ( var index in ids ) {
              if ( ids[index] = true )  {
                ids_array.push(index) ;
              }
            }
            service.name = name ; 
            service.item_ids = ids_array ; 
            service.put().then(function() {
              console.log($route);
              $route.reload();
            }) ; 
          });
        }
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    var ModalInstanceCtrl = function ($scope, $modalInstance, newService, service, services, select_items, items) {
      $scope.newService = newService;
      $scope.items = items;
      $scope.selection = select_items;
      $scope.service = service ; 
      $scope.services = services ; 
      var ids = {} ; 
      for ( var i=0; i< select_items.length ; i++ ) {
        for ( var j=0; j< items.length; j++ ) {
          if ( items[j].name == select_items[i].name ) {
            var id = items[j].id ; 
            ids[id] = true ;
            break ; 
          } 
        }
      }
      $scope.ids = ids;
     
      $scope.check = function(item) {
        for ( var i=0; i < $scope.selection.length ; i++ ) {
          if ( item.name == $scope.selection[i].name ) {
            return true ;  
          }
        } 
            return false ; 
      };

      $scope.ok = function () {
        $modalInstance.close($scope);
      };
    
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };
}]);
