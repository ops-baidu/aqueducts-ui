'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('OrgConsoleController', ['$modal', '$route','$log','$scope', '$routeParams',
  '$location','Restangular', 'userService', '$interval', function($modal, $route, $log, $scope, $routeParams, $location, Restangular, userService, $interval) {
  $scope.init = function(){
    var orgname = $routeParams.orgname;
    $scope.orgname = orgname;
    var services = Restangular.one('orgs', orgname).all('services');
    services.getList().then(function(services){
      $scope.services = services;

    });



  };

  
  $scope.stopEvents = function(){
    $interval.cancel($scope.intervalPromise);
  };

  $scope.consume = function(service_name){
    $scope.stopEvents();
    $scope.msg = [];
    var consuming = function(){
      Restangular.all('kafka').customGET('consume', {product: $scope.orgname, service: service_name, area: 'HB'}).then(function(msg){
        $scope.msg.push(msg);
        // console.log(msg);
      });
    };

    $scope.intervalPromise = $interval(consuming, 1000);

  };



}]);


