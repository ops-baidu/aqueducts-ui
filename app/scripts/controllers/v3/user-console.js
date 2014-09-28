'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('UserConsoleController', ['$scope', '$routeParams',
  'Restangular', '$interval', '$location', function($scope, $routeParams, Restangular, $interval, $location) {
  Restangular.all('user').all('services').getList().then(function(services){
    $scope.services = services;
  });
  Restangular.all('user').customGET('info').then(function(user){
    $scope.user = user;
  });
  $scope.serviceContext = "Services";
  $scope.live = false;
  $scope.pause = false;
  var service_name = $routeParams.service_name;
  if (service_name) {
    Restangular.all('user').one('services', service_name).get().then(function(service){
      $scope.consumeControl(service_name, service.flows);
    });
  };
  
  $scope.stopEvents = function(){
    $scope.live = true;
    $scope.pause = false;
    $interval.cancel($scope.intervalPromise);
  };

  $scope.consumeControl = function(service_name, service_flows){
    var default_area = '';
    if (service_flows.huadong) {
      $scope.huadong = true;
      default_area = 'HD';
    }else{
      $scope.huadong = false;
    };
    if (service_flows.huabei) {
      $scope.huabei = true;
      default_area = 'HB';
    }else{
      $scope.huabei = false;
    };
    
    $scope.serviceContext = service_name;
    $location.url('/console/' + service_name);
    $scope.show = true;
    $scope.consume(service_name, default_area);
  };

  $scope.consume = function(service_name, area){
    $scope.area = area;
    $scope.stopEvents();
    $scope.live = false;
    $scope.pause = true;
    $scope.msg = [];
    var consuming = function(){
      Restangular.all('kafka').customGET('consume', {username: $scope.user.name, service: service_name, area: area}).then(function(msg){
        $scope.msg.push(msg);
      }, function(response){
        $scope.stopEvents();
        $scope.msg.push([{"error": "no events"},]);

      });
    };
    $scope.intervalPromise = $interval(consuming, 1500);
  };

}]);


