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
        var select_items = Restangular.one('products', product.id).one('services',service.id).all('items').getList();
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


aqueductsApp.directive('navBar', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/navbar.html'
  };
});


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

aqueductsApp.controller('itemController', function($scope,Restangular) {
  $scope.initCalcs = function(item) {
    $scope.calcs = Restangular.one('items', item.id).all('calculations').getList().$object;
    console.log($scope.calcs);
  }; 
});

aqueductsApp.controller('chartController', function ($scope,$http,Restangular) {
  $scope.initConfig=function(config,product,service,item,calc) {
    var series = [  
      'http://127.0.0.1:3000/v1/events?product=' + product.name + '&service=' + service.name + '&item=' + item.name + '&calculation=' + calc.name + '&from=-24h&to=now&period=60&name=today&diff=0', 
      'http://127.0.0.1:3000/v1/events?product=' + product.name + '&service=' + service.name + '&item=' + item.name + '&calculation=' + calc.name + '&from=-48h&to=-24h&period=60&name=yesterday&diff=86400', 
      'http://127.0.0.1:3000/v1/events?product=' + product.name + '&service=' + service.name + '&item=' + item.name + '&calculation=' + calc.name + '&from=-168h&to=-144h&period=60&name=lastweek&diff=518400',
    ] ; 
    function getJsonFromUrl(url) {
      var query = url ; 
      var data = query.split("&");
      var result = {};
      for(var i=0; i<data.length; i++) {
          var item = data[i].split("=");
          result[item[0]] = item[1];
        }
      return result;
    }
    for (var i = 0 ; i< series.length; i++) {
      var request = series[i];
      $http.get(request).success(function (data, status, headers, config) {
        var name = getJsonFromUrl(config.url).name; 
        var diff = getJsonFromUrl(config.url).diff; 
        for ( var j = 0 ; j< data.length ; j ++ ) {
          data[j][0] = data[j][0] + diff * 1000 ; 
        }
        $scope.config.series.push({
          name: name,
          data: data
        });
      });
    }
    $scope.config=angular.copy(config);
    $scope.config.title.text=item.name + " [" +calc.name + "]";
  }
});
