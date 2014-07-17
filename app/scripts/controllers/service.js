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
        controller: ServiceModalInstanceCtrl,
      });



      modalInstance.result.then(function (scope) {
        var name = scope.service.name ;
        var flows = new Object();
        var services = scope.services ;
        var huabei = scope.service.huabei ;
        var huadong = scope.service.huadong ;
        if(huabei === true){
          flows['huabei'] = scope.service.selectFlow_huabei.level;
        }
        if(huadong === true){
          flows['huadong'] = scope.service.selectFlow_huadong.level;
        }

        service.name = name ;
        service.flows = flows ;

        var a_service = {
          name: name,
          flows: flows,
        };
        services.post(a_service).then(function() {
          $route.reload();
        });
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

      

    var ServiceModalInstanceCtrl = function ($scope, $modalInstance, $routeParams, Restangular) {
      var product_id = $routeParams.product ;
      $scope.service = { name: '', huabei: true, huadong: false};

      $scope.flowOptions = [
      {
          level: 1,
          label: '流量小于1000 queries/s',
      }, {
          level: 2,
          label: '流量介于1000与5000之间',
      }, {
          level: 3,
          label: '流量介于5000与10,000之间',
      }, {
          level: 4,
          label: '流量介于10,000与50,000之间',
      }, {
          level: 5,
          label: '流量介于50,000与100,000之间',
      }, {
          level: 6,
          label: '流量大于100,000',
      }];

      $scope.service.selectFlow_huabei = $scope.flowOptions[0];
      $scope.service.selectFlow_huadong = $scope.flowOptions[0];

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
    ServiceModalInstanceCtrl.$inject = ['$scope','$modalInstance','$routeParams','Restangular'];
}]);


