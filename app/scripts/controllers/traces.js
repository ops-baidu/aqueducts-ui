/*
* @Author: john
* @Date:   2014-09-28 11:37:44
* @Last Modified by:   john
* @Last Modified time: 2014-10-14 15:02:37
*/

'use strict';

angular.module('webApp')
    .controller('TracesController', ['$scope', '$http', 'ApiBaseUrl', '$routeParams', '$modal', function($scope, $http, ApiBaseUrl, $routeParams, $modal) {

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

  $scope.showModal = function(span) {

    var modalInstance = $modal.open({
      templateUrl: 'views/v3/trace_detail.html',
      controller: ModalInstanceCtrl,
      resolve: {
        span: function(){
          return span;
      }
    }
    });

    modalInstance.result.then(function() {});
  };

  var ModalInstanceCtrl = function($scope, $modalInstance, span) {

    $scope.annos = span.annotations;
    $scope.binaAnnos = span.binaryAnnotations;
    $scope.serviceNames = span.serviceNames;
    $scope.durationStr = span.durationStr;


    $scope.ok = function() {
      $modalInstance.close($scope);
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  };
  ModalInstanceCtrl.$inject = ['$scope', '$modalInstance', 'span'];




}])
    .directive('finishRenderServiceCounts', function ($timeout) {
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
    })

    .directive('finishRenderOptions', function ($timeout) {
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
    })
;










