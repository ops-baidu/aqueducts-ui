'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('UserServiceController', ['$modal', '$route','$log','$scope', '$routeParams', '$location','Restangular', '$window', function($modal, $route, $log, $scope, $routeParams, $location, Restangular, $window) {
  $scope.create = function () {
    var services = Restangular.all('user').all('services');
    var name = $scope.service.name ;
    var flows = new Object();

    var huabei = $scope.service.huabei ;
    var huadong = $scope.service.huadong ;
    if(huabei === true){
      flows['huabei'] = $scope.service.selectFlow_huabei;
    }
    if(huadong === true){
      flows['huadong'] = $scope.service.selectFlow_huadong;
    }

    var a_service = {
      name: name,
      flows: flows,
    };

    services.post(a_service).then(function() {
      $location.path('/home').replace();

    }, function(response) {
      $scope.addServiceFailed = true;
      $scope.message = response.data.message;
    });
  };
  $scope.initService = function(){
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

    $scope.service = { demo: false, label: 'New Service', name: '', huabei: true, huadong: false, selectFlow_huadong: 1, selectFlow_huabei: 1};
  };

}]);


