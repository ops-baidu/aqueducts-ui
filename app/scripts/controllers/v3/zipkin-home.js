/*
* @Author: john
* @Date:   2014-09-11 13:20:14
* @Last Modified by:   john
* @Last Modified time: 2014-09-15 19:23:46
*/
'use strict';

angular.module('webApp').controller('ZipkinHomeController', ['$scope', '$http', function($scope, $http) {
  $scope.services  = [];
  $scope.spanNames = [];
  $scope.traces    = [];

  function getServiceNames () {
    // TODO
    // change http url to config
    $http.get("http://127.0.0.1:3000/v3/zipkin/get_service_names").success(function (response) {
      $scope.services = [];
      for (var i = response.length - 1; i >= 0; i--) {
        $scope.services.push({name: response[i]});
      };;
    });
  };
  getServiceNames();

  var now = new Date();
  $scope.endDate = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
  $scope.endTime = now.getHours() + ':' + now.getMinutes();
  $scope.timestamp = now.getTime() * 1000;
  $scope.limit = 100;

  // TODO show count number
  $scope.count = 1;


  $scope.findTraces = function (serviceName, spanName,
                                timestamp, limit, annotationQuery) {
    // TODO
    // get trace summaries over api
    var findTracesUrl = "http://127.0.0.1:3000/v3/zipkin/find_traces"
    + "?service_name=" + serviceName
    + "&span_name=" + spanName
    + "&end_ts=" + timestamp
    + "&limit=" + limit
    + "&annotation_query=" + annotationQuery;

    $http.get(findTracesUrl).success(function (response) {
      // body...
      $scope.traces = [];
      for (var i = response.length - 1; i >= 0; i--) {
        $scope.traces.push(response[i])
      };
    });
  };

  $scope.getSpanNames = function(serviceName) {
    $http.get("http://127.0.0.1:3000/v3/zipkin/get_span_names?service_name=" + serviceName)
    .success(function (response) {
      $scope.spanNames = [];
      for (var i = response.length - 1; i >= 0; i--) {
        $scope.spanNames.push({name: response[i]});
      };;
    });
  };



}]);