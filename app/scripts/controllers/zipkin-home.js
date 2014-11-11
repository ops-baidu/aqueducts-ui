/*
* @Author: john
* @Date:   2014-09-11 13:20:14
* @Last Modified by:   john
* @Last Modified time: 2014-10-14 16:21:02
*/
'use strict';

angular.module('webApp').controller('ZipkinHomeController', ['$modal','$scope', '$http', 'ApiBaseUrl', 'Restangular', '$filter', function($modal, $scope, $http, ApiBaseUrl, Restangular, $filter) {
  $scope.services  = [];
  $scope.spanNames = [{name: 'ALL'}];
  $scope.traces    = [];
  var orderBy = $filter('orderBy');
  $scope.show = Object();
  $scope.show.show = [];
  $scope.show.timeMarkers = [];
  $scope.show.spans = [];
  $scope.show.query = [];
  $scope.show.qid = [];
  $scope.show.qtime = [];
  $scope.spanName = $scope.spanNames[0];
  $scope.currentValue = 'duration-desc';
  function getServiceNames () {
    // access authority
    // var orgs = [];
    // Restangular.all('orgs').getList().then(function(response) {
    //   for (var i = response.length - 1; i >= 0; i--) {
    //     orgs.push(response[i]["name"]);
    //   };
    // });
    
    $http.get(ApiBaseUrl + "zipkin/get_service_names").success(function (response) {
      $scope.services = response;
      for (var i = $scope.services.length - 1; i >= 0; i--) {
        if ($scope.services[i] == "psop:pr-nginx") {
          $scope.serviceName = $scope.services[i];
          break;
        };
      };
      if (!$scope.serviceName) {
        $scope.serviceName = $scope.services[0];
      };

      // for (var i = response.length - 1; i >= 0; i--) {
      //   var serviceName = response[i];
      //   var org_name = serviceName.split(":");

      //   if (org_name.length === 2) {
      //     if ($.inArray(org_name[0], orgs) >= 0) {
      //       $scope.services.push({name: serviceName});
      //     };
      //   } else{
      //     $scope.services.push({name: response[i]});
      //   };
      // };;
    });

  };
  getServiceNames();

  var now = new Date();
  $scope.endDate = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();
  $scope.endTime = now.getHours() + ':' + now.getMinutes();
  $scope.startTime = $scope.endTime;
  var tmp = new Date();
  tmp.setDate(tmp.getDate() - 7);
  $scope.startDate = (tmp.getMonth() + 1) + '-' + tmp.getDate() + '-' + tmp.getFullYear();
  $scope.endTimestamp = now.getTime() * 1000;
  $scope.startTimestamp = tmp.getTime() * 1000;
  $scope.limit = 100;

  // TODO show count number
  $scope.count = 1;


  $scope.findTraces = function (serviceName, spanName,
                                from, to, limit, annotationQuery, currentValue) {

    var findTracesUrl = ApiBaseUrl + "zipkin/find_traces"
    + "?service_name=" + serviceName
    + "&span_name=" + spanName
    + "&end_ts=" + to
    + "&limit=" + limit
    + "&annotation_query=" + annotationQuery
    + "&start_ts=" + from;

    $http.get(findTracesUrl).success(function (response) {
      $scope.traces = [];
      for (var i = response.length - 1; i >= 0; i--) {
        var timeago = jQuery.timeago(new Date(response[i]['startTime']/1000));
        response[i]['timeago'] = timeago;
        $scope.traces.push(response[i]);
      };
      $scope.order(currentValue);

    });
  };

  $scope.getSpanNames = function(serviceName) {
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
    var url = "zipkin/trace/" + traceId + "/?service_name=" + serviceName;
    $http.get(ApiBaseUrl + url).success(function (response) {
      $scope.show.timeMarkers[traceId] = response['timeMarkers'];
      var spans = response['spans'];
      var span = Object();
      var id = '';
      for (var j = spans.length - 1; j >= 0; j--) {
        span = spans[j];

        for (var i = span.binaryAnnotations.length - 1; i >= 0; i--) {
          if (span.binaryAnnotations[i]['key'] == 'query') {
              $scope.show.query[traceId] = span.binaryAnnotations[i]['value'];
          };
          if (span.binaryAnnotations[i]['key'] == 'qid') {
            $scope.show.qid[traceId] = span.binaryAnnotations[i]['value'];
          }; 
          if (span.binaryAnnotations[i]['key'] == 'time') {
            $scope.show.qtime[traceId] = span.binaryAnnotations[i]['value'];
          };     
        };
      };
      $scope.show.query[traceId] = $scope.show.query[traceId] || "empty query";
      $scope.show.qid[traceId] = $scope.show.qid[traceId] || "empty qid";
      $scope.show.qtime[traceId] = $scope.show.qtime[traceId] || "empty time";
      $scope.show.spans[traceId] = spans;

    });
  };

}]);