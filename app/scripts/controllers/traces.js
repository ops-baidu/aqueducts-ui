/*
* @Author: john
* @Date:   2014-09-28 11:37:44
* @Last Modified by:   john
* @Last Modified time: 2014-10-14 15:02:37
*/

'use strict';

angular.module('webApp')
    .controller('TracesController', ['Restangular', '$scope', '$location', '$http', 'ApiBaseUrl', '$routeParams', '$modal', function(Restangular, $scope, $location, $http, ApiBaseUrl, $routeParams, $modal) {

  var traceId = $routeParams.traceId;
  $scope.traceId = traceId;
  var serviceName = $routeParams.serviceName;
  var moduleId = $routeParams.moduleId;
  var orgname = $routeParams.orgname;
  var annotations = {};
  $scope.show = Object();
  $scope.show.show = [];
  $scope.show.annos = [];
  $scope.show.binaAnnos = [];
  $scope.show.serviceNames = [];
  $scope.show.durationStr = [];
  $scope.show.openAll = false;

  function getModuleAnnotations() {
    Restangular.one('orgs', orgname).one('modules', moduleId).all('annotations').getList().then(function(annos){
      for (var i = annos.length - 1; i >= 0; i--) {
        annotations[annos[i].name] = annos[i].weight;
      };
    });
  };
  getModuleAnnotations();

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
    var url = "zipkin/trace/" + traceId + "/?service_name=" + serviceName; //+ '&force_format=1';
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
          span.binaryAnnotations[i]['weight'] = annotations[span.binaryAnnotations[i]['key']] || 0;
        };
        id = span.spanId;
        $scope.show.annos[id] = span.annotations;
        $scope.show.binaAnnos[id] = span.binaryAnnotations.sort(function(a ,b) {
            if (a.weight > b.weight) {
              return -1;
            }else if (a.key === b.key) {
              return 0;
            }else{
              return 1;
            };
          });
        $scope.show.serviceNames[id] = span.serviceNames;
        $scope.show.durationStr[id] = span.durationStr;
      };
      $scope.spans = spans;

    });
  };
  function getTraceHighlight(moduleId){
    Restangular.all('zipkin').customPOST({traces_ids: [traceId], module_id:moduleId}, "traces").then(function(spans) {
      $scope.highlight = spans[traceId]['highlight2'];
    });
  };

  getTrace();
  getTraceHighlight(moduleId);

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










