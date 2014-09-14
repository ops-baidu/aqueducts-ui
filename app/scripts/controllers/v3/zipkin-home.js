/*
* @Author: john
* @Date:   2014-09-11 13:20:14
* @Last Modified by:   john
* @Last Modified time: 2014-09-14 15:20:01
*/
'use strict';

angular.module('webApp').controller('ZipkinHomeController', ['$scope', 'Restangular', '$routeParams','$route', function($scope, Restangular, $routeParams, $route) {
  var now = new Date();
  $scope.endDate = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
  $scope.endTime = now.getHours() + ':' + now.getMinutes();

  $scope.services = [{name: 'zipkin'}, {name: 'test'}];
  $scope.spanNames = [{name: 'get'}];
  $scope.timestamp = now.getTime() * 1000;
  $scope.limit = 100;

  $scope.count = 1;
  $scope.serviceName = 'zipkin'

  $scope.traces = [];

  $scope.findTraces = function() {
    $scope.traces = [
      {traceId: 1, duration: 10, timestamp: 100, serviceName: 'zipkin', width: 100, durationStr: '123', spanCount: 1, startTime: 1410364800000000, serviceCounts: [{name: 'zipkin', count: 1}] },
      {traceId: 2, duration: 10, timestamp: 100, serviceName: 'zipkin', width: 100, durationStr: '12', spanCount: 1, startTime: 1410364800000000, serviceCounts: [{name: 'zipkin', count: 1}] }
    ];
    // TODO
    // get trace summaries over api
  };
}]);