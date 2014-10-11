/*
* @Author: john
* @Date:   2014-09-28 11:37:44
* @Last Modified by:   john
* @Last Modified time: 2014-10-10 13:54:14
*/

'use strict';

angular.module('webApp').controller('TracesController', ['$scope', '$http', 'ApiBaseUrl', '$routeParams', function($scope, $http, ApiBaseUrl, $routeParams) {

  var traceId = $routeParams.traceId;
  var serviceName = $routeParams.serviceName;

  function getTrace () {
    var url = "zipkin/trace/" + traceId + "/?service_name=" + serviceName;
    $http.get(ApiBaseUrl + url).success(function (response) {
      $scope.duration = response['duration'];
      $scope.servicesNumber = response['services'];
      $scope.depth = response['depth'];
      $scope.totalSpans = response['totalSpans'];
      $scope.serviceCounts = response['serviceCounts'];
      $scope.timeMarkers = response['timeMarkers'];

      $scope.spans = response['spans']
    });
  };

  getTrace();



}]);