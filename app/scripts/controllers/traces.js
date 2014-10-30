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
  var spanId = $routeParams.spanId;

  

  $scope.showModal = function(span) {

    var modalInstance = $modal.open({
      templateUrl: 'views/trace_detail.html',
      controller: ModalInstanceCtrl,
      resolve: {
        span: function(){
          return span;
      }
    }
    });

    modalInstance.result.then(function() {});
  };

  var ModalInstanceCtrl = function($scope, $location, $routeParams, $modalInstance, span) {
    for (var i = span.binaryAnnotations.length - 1; i >= 0; i--) {
      span.binaryAnnotations[i]['weight'] = getKeyWeight(span.binaryAnnotations[i]['key']);
    };
    $scope.annos = span.annotations;
    $scope.binaAnnos = span.binaryAnnotations;
    $scope.serviceNames = span.serviceNames;
    $scope.durationStr = span.durationStr;
    $scope.url = $location.path() + '?serviceName=' + $routeParams.serviceName + '&spanId=' + span.spanId;

    $scope.ok = function() {
      $modalInstance.close($scope);
    };
    $scope.cancel = function() {
      $modalInstance.close($scope);
    };
  };
  ModalInstanceCtrl.$inject = ['$scope', '$location', '$routeParams', '$modalInstance', 'span'];
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
      $scope.spans = spans;
      if (spanId) {
        for (var i = spans.length - 1; i >= 0; i--) {
          if (spans[i]['spanId'] === spanId) {
            span = spans[i];
            break;
          };
        };
        $scope.showModal(span);
      };
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










