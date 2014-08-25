'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('UserConsoleController', ['$scope', '$routeParams',
  'Restangular', '$interval', function($scope, $routeParams, Restangular, $interval) {
  Restangular.all('user').all('services').getList().then(function(services){
    $scope.services = services;
  });
  Restangular.all('user').customGET('info').then(function(user){
    $scope.user = user;
  });
  $scope.serviceContext = "Services";
  $scope.live = false;
  $scope.pause = false;
  $scope.stopEvents = function(){
    $scope.live = true;
    $scope.pause = false;
    $interval.cancel($scope.intervalPromise);
  };

  $scope.consume = function(service_name){
    $scope.serviceContext = service_name;
    $scope.stopEvents();
    $scope.live = false;
    $scope.pause = true;

    $scope.msg = [];
    var consuming = function(){
      Restangular.all('kafka').customGET('consume', {username: $scope.user.name, service: service_name, area: 'HB'}).then(function(msg){
        $scope.msg.push(msg);
      }, function(response){
        $scope.stopEvents();
        $scope.msg.push([{"error": "no events"},]);

      });
    };
    $scope.intervalPromise = $interval(consuming, 1500);
  };

}]);


