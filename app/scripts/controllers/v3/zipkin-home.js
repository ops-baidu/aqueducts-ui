/*
* @Author: john
* @Date:   2014-09-11 13:20:14
* @Last Modified by:   john
* @Last Modified time: 2014-09-11 16:57:04
*/
'use strict';

angular.module('webApp').controller('ZipkinHomeController', ['$scope', 'Restangular', '$routeParams','$route', function($scope, Restangular, $routeParams, $route) {
  $scope.services = [{name: 'zipkin'}, {name: 'test'}];
  $scope.spanNames = [{name: 'get'}];
  $scope.timestamp = 1410364800000000;
  $scope.limit = 100;

  $scope.count = 1;
  $scope.serviceName = 'zipkin'

  $scope.traces = [
    {traceId: 1, duration: 10, timestamp1: 100, serviceName: 'zipkin', width: 100, durationStr: '123', spanCount: 1, startTime: 1410364800000000, serviceCounts: [{name: 'zipkin', count: 1}] },
    {traceId: 2, duration: 10, timestamp1: 100, serviceName: 'zipkin', width: 100, durationStr: '12', spanCount: 1, startTime: 1410364800000000, serviceCounts: [{name: 'zipkin', count: 1}] }
  ];
}]);