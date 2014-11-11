/*
* @Author: john
* @Date:   2014-09-28 11:37:44
* @Last Modified by:   john
* @Last Modified time: 2014-10-14 15:02:37
*/

'use strict';

angular.module('webApp')
    .controller('TracesController', ['$scope', '$location', '$http', 'ApiBaseUrl', '$routeParams', '$modal', function($scope, $location, $http, ApiBaseUrl, $routeParams, $modal) {

  var traceId = $routeParams.traceId;
  var serviceName = $routeParams.serviceName;
  $scope.show = Object();
  $scope.show.show = [];
  $scope.show.annos = [];
  $scope.show.binaAnnos = [];
  $scope.show.serviceNames = [];
  $scope.show.durationStr = [];
  $scope.show.openAll = false;


  function getKeyWeight(key){
    switch(key){
      case 'query':
        return 10;
        break;
      case 'qid':
        return 9;
        break;
      case 'modulename':
        return 8;
        break;
      case 'service_name':
        return 7;
        break;
      case 'ip':
        return 6;
        break;
      case 'port':
        return 5;
        break;
      case 'parentip':
        return 4;
        break;
      default:
        return 1;

    }

  };

  $scope.openOrClose = function(action){
    var open = false;
    $scope.show.openAll = false;
    if (action == "open") {
      open = true;
      $scope.show.openAll = true;
    };
    for (var k in $scope.show.show) {
      $scope.show.show[k] = open;
    };
    
  };

  function getTrace () {
    var url = "zipkin/trace/" + traceId + "/?service_name=" + serviceName;
    $http.get(ApiBaseUrl + url).success(function (response) {
      $scope.duration = response['duration'];
      $scope.servicesNumber = response['services'];
      $scope.depth = response['depth'];
      $scope.totalSpans = response['totalSpans'];
      $scope.serviceCounts = response['serviceCounts'];
      $scope.timeMarkers = response['timeMarkers'];
      var spans = response['spans'];
      var span = Object();
      var id = '';
      for (var j = spans.length - 1; j >= 0; j--) {
        span = spans[j];
        

        for (var i = span.binaryAnnotations.length - 1; i >= 0; i--) {
          span.binaryAnnotations[i]['weight'] = getKeyWeight(span.binaryAnnotations[i]['key']);
          if (span.binaryAnnotations[i]['key'] == 'query') {
              $scope.query = span.binaryAnnotations[i]['value'];
          };
          if (span.binaryAnnotations[i]['key'] == 'qid') {
            $scope.qid = span.binaryAnnotations[i]['value'];
          }; 
          if (span.binaryAnnotations[i]['key'] == 'time') {
            $scope.qtime = span.binaryAnnotations[i]['value'];
          };     
        };
        id = span.spanId;
        $scope.show.annos[id] = span.annotations;
        $scope.show.binaAnnos[id] = span.binaryAnnotations;
        $scope.show.serviceNames[id] = span.serviceNames;
        $scope.show.durationStr[id] = span.durationStr;
      };
      $scope.query = $scope.query || "empty query";
      $scope.qid = $scope.qid || "empty qid";
      $scope.qtime = $scope.qtime || "empty time";
      $scope.spans = spans;

    });
  };

  getTrace();

}])
  .directive('finishRenderServiceCounts', ['$timeout', function ($timeout) {
      return {
          restrict: 'A',
          link: function (scope, element, attr) {
              if (scope.$last === true) {
                  $timeout( function () {
                      $('.service-filter-label').click(function () {
                          $(this).toggleClass('service-tag-filtered');
                          var serviceName = $(this).attr('data-service-name');
                          var spans = $('.service-span');

                          $.each(spans, function () {
                              if (serviceName === $(this).attr('data-service-names')) {
                                  $(this).toggleClass('highlight');
                              };
                          });
                      });
                  });
              }
          }
      }
  }]);

  // .directive('finishRenderOptions', ['$timeout', function ($timeout) {
  //     return {
  //         restrict: 'A',
  //         link: function (scope, element, attr) {
  //             if (scope.$last === true) {
  //                 $timeout( function () {
  //                     $('.service-filter-label').click(function () {
  //                         $(this).toggleClass('service-tag-filtered');
  //                         var serviceName = $(this).attr('data-service-name');
  //                         var spans = $('.service-span');

  //                         $.each(spans, function () {
  //                             if (serviceName === $(this).attr('data-service-names')) {
  //                                 $(this).toggleClass('highlight');
  //                             };
  //                         });
  //                     });
  //                 });
  //             }
  //         }
  //     }
  // }]);










