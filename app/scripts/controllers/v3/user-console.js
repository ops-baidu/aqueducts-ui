'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('UserConsoleController', ['$modal', '$route','$log','$scope', '$routeParams',
  '$location','Restangular', 'userService', '$interval', function($modal, $route, $log, $scope, $routeParams, $location, Restangular, userService, $interval) {
  $scope.init = function(){
    Restangular.all('user').all('services').getList().then(function(services){
      $scope.services = services;
    });
    Restangular.all('user').customGET('info').then(function(user){
      $scope.user = user;
    });


  };

  
  $scope.stopEvents = function(){
    $interval.cancel($scope.intervalPromise);
  };

  $scope.consume = function(service_name){
    $scope.stopEvents();
    $scope.msg = [];
    var consuming = function(){
      Restangular.all('kafka').customGET('consume', {product: $scope.user.name, service: service_name, area: 'HB'}).then(function(msg){
        $scope.msg.push(msg);
        // console.log(msg);
      });
    };

    $scope.intervalPromise = $interval(consuming, 1000);

  };



}]);


