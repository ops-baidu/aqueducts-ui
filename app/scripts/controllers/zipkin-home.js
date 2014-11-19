/*
* @Author: john
* @Date:   2014-09-11 13:20:14
* @Last Modified by:   john
* @Last Modified time: 2014-10-14 16:21:02
*/
'use strict';

angular.module('webApp').controller('ZipkinHomeController', ['$routeParams', '$modal','$scope', '$http', 'ApiBaseUrl', 'Restangular', '$filter', function($routeParams, $modal, $scope, $http, ApiBaseUrl, Restangular, $filter) {
  $scope.services  = [];
  $scope.spanNames = [{name: 'ALL'}];
  $scope.traces    = [];
  var orderBy = $filter('orderBy');
  $scope.show = Object();
  $scope.show.show = [];
  $scope.show.timeMarkers = [];
  $scope.show.spans = [];
  $scope.show.query = {};
  $scope.show.qid = {};
  $scope.show.qtime = {};
  $scope.spanName = $scope.spanNames[0];
  $scope.currentValue = 'duration-desc';
  var orgname = $routeParams.orgname;
  $scope.orgname = orgname;
  function getModules () {
    Restangular.one('orgs', orgname).all('modules').getList().then(function(modules) {
      $scope.services = modules;
      $scope.service = modules[0];
    });
  };

  getModules();

  var now = new Date();
  $scope.endDate = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
  $scope.endTime = now.getHours() + ':' + now.getMinutes();
  $scope.startTime = $scope.endTime;
  var tmp = new Date();
  tmp.setDate(tmp.getDate() - 3);
  $scope.startDate = (tmp.getMonth() + 1) + '-' + tmp.getDate() + '-' + tmp.getFullYear();
  $scope.endTimestamp = now.getTime() * 1000;
  $scope.startTimestamp = tmp.getTime() * 1000;
  $scope.limit = 10;

  // TODO show count number
  $scope.count = 1;


  $scope.findTraces = function (serviceName, spanName,
                                from, to, limit, annotationQuery, currentValue) {
    serviceName = orgname + ":" + serviceName;
    var findTracesUrl = ApiBaseUrl + "zipkin/find_traces"
    + "?service_name=" + serviceName
    + "&span_name=" + spanName
    + "&end_ts=" + to
    + "&limit=" + limit
    + "&annotation_query=" + annotationQuery
    + "&start_ts=" + from;

    $http.get(findTracesUrl).success(function (response) {
      $scope.traces = [];
      var ids = [];
      for (var i = response.length - 1; i >= 0; i--) {
        var timeago = jQuery.timeago(new Date(response[i]['startTime']/1000));
        response[i]['timeago'] = timeago;
        $scope.traces.push(response[i]);
        ids.push(response[i].traceId);
      };
      $scope.order(currentValue);
      getAllTracesBrief(ids);
      console.log("123");
    });
  };
  function getAllTracesBrief(ids){
    Restangular.all('zipkin').customPOST({traces_ids: ids}, "traces").then(function(spans) {
      $scope.show.query = spans;
      // var span = Object();
      // var id = '';
      // var traceId;
      // for (var j = spans.length - 1; j >= 0; j--) {
      //   span = spans[j];
      //   traceId = span.trace_id.toString();
        // for (var i = span.binary_annotations.length - 1; i >= 0; i--) {
        //   if (span.binary_annotations[i]['key'] == 'query') {
        //     $scope.show.query[traceId] = span.binary_annotations[i]['value'];
        //   };
        //   if (span.binary_annotations[i]['key'] == 'qid') {
        //     $scope.show.qid[traceId] = span.binary_annotations[i]['value'];
        //   }; 
        //   if (span.binary_annotations[i]['key'] == 'time') {
        //     $scope.show.qtime[traceId] = span.binary_annotations[i]['value'];
        //   };
        // };
        // $scope.show.query[traceId] = $scope.show.query[traceId] || "empty query";
        // $scope.show.qid[traceId] = $scope.show.qid[traceId] || "empty qid";
        // $scope.show.qtime[traceId] = $scope.show.qtime[traceId] || "empty time";
        // for (var i = span.binary_annotations.length - 1; i >= 0; i--) {
        //   if (span.binary_annotations[i]['key'] == 'query'){
        //     $scope.show.query[traceId] = span.binary_annotations[i].value;
        //   }
        //   if (span.binary_annotations[i]['key'] == 'qid') {
        //     $scope.show.qid[traceId] = span.binary_annotations[i].value;
        //   }; 
        //   if (span.binary_annotations[i]['key'] == 'time') {
        //     $scope.show.qtime[traceId] = span.binary_annotations[i].value;
        //   };
        // };
        // $scope.show.query[traceId] = $scope.show.query[traceId] || "empty query";
        // $scope.show.qid[traceId] = $scope.show.qid[traceId] || "empty qid";
        // $scope.show.qtime[traceId] = $scope.show.qtime[traceId] || "empty time";
      // };
      
    });
  };
  $scope.getSpanNames = function(serviceName) {
    serviceName = orgname + ":" + serviceName;
    $scope.spanNames = [{name: 'ALL'}];
    $http.get(ApiBaseUrl + "zipkin/get_span_names?service_name=" + serviceName)
    .success(function (response) {
      for (var i = response.length - 1; i >= 0; i--) {
        $scope.spanNames.push({name: response[i]});
      };;
    });
    $scope.spanName = $scope.spanNames[0];
  };

  $scope.selectChange = function (value) {
    console.log(value);
  };
  $scope.openHelpModal = function(){
    var modalInstance = $modal.open({
      templateUrl: 'views/trace_help.html' ,
    });

  };
  $scope.order = function (predicateReverse) {
    var predicate = predicateReverse.split("-")[0];
    var reverse;
    if (predicateReverse.split("-")[1] === 'desc') {
      reverse = true;
    } else{
      reverse = false;
    };
    $scope.traces = orderBy($scope.traces, predicate, reverse);
  };

  // $scope.order('duration', true);

  $scope.showTraceBrief = function(traceId, serviceName){
    serviceName = orgname + ":" + serviceName;
    $scope.show.show[traceId] = !$scope.show.show[traceId];
    if ($scope.show.show[traceId]) {
      var url = "zipkin/trace/" + traceId + "/?service_name=" + serviceName;
      $http.get(ApiBaseUrl + url).success(function (response) {
        $scope.show.timeMarkers[traceId] = response['timeMarkers'];
        var spans = response['spans'];
        $scope.show.spans[traceId] = spans;  
      });
    };
  };

}]);