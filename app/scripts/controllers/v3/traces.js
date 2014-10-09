/*
* @Author: john
* @Date:   2014-09-28 11:37:44
* @Last Modified by:   john
* @Last Modified time: 2014-09-28 15:15:56
*/

'use strict';

angular.module('webApp').controller('TracesController', ['$scope', '$http', 'ApiBaseUrl', '$routeParams', function($scope, $http, ApiBaseUrl, $routeParams) {

  traceId = $routeParams.traceId;
  serviceName = $routeParams.traceId;
}]);