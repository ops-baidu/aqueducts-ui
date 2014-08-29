'use strict';

var aqueductsApp = angular.module('webApp');

aqueductsApp.controller('UserStaticChartController', [ '$scope','$http', '$q', 'Restangular', 'EventsApiBaseUrl' , function ($scope,$http,$q,Restangular,EventsApiBaseUrl) {  

  $scope.initConfig=function(config,username,service_name,job) {
    
    var promises = [
      Restangular.one('items', job.item_id).get(),
      Restangular.one('calculations', job.calculation_id).get()
    ];
    $q.all(promises).then(function(results) {
      var item = results[0] ;
      var calc = results[1] ;
      var series = [
        EventsApiBaseUrl + 'events?product=' + username + '&service=' + service_name + '&item=' + item.name + '&calculation=' + calc.name + '&from=-24h&to=now&period=60&name=today&diff=0',
        EventsApiBaseUrl + 'events?product=' + username + '&service=' + service_name + '&item=' + item.name + '&calculation=' + calc.name + '&from=-48h&to=-24h&period=60&name=yesterday&diff=86400',
        EventsApiBaseUrl + 'events?product=' + username + '&service=' + service_name + '&item=' + item.name + '&calculation=' + calc.name + '&from=-168h&to=-144h&period=60&name=lastweek&diff=518400',
      ] ;
      function getJsonFromUrl(url) {
        var query = url ;
        var data = query.split("&");
        var result = {};
        for(var i=0; i<data.length; i++) {
            var item = data[i].split("=");
            result[item[0]] = item[1];
          }
        return result;
      }
      $scope.config=angular.copy(config);
      for (var i = 0 ; i< series.length; i++) {
        var request = series[i];
        $http.get(request).success(function (data, status, headers, config) {
          var name = getJsonFromUrl(config.url).name;
          var diff = getJsonFromUrl(config.url).diff;
          for ( var j = 0 ; j< data.length ; j ++ ) {
            data[j][0] = data[j][0] + diff * 1000 ;
          }
          $scope.config.series.push({
            name: name,
            data: data
          });
        });
      }
      $scope.config.title.text=item.name + " [" +calc.name + "]";
    });
  };
}]);
