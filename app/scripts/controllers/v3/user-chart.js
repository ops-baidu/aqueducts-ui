'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('UserChartController', [ '$scope','$http', '$q', 'Restangular', 'EventsApiBaseUrl' , function ($scope,$http,$q,Restangular,EventsApiBaseUrl) {

  $scope.serviceContext = "Services";
  Restangular.all('user').customGET('info').then(function(user){
    $scope.username = user.name;
  });
  $scope.data = { chart: {} };
  var services = Restangular.all('user').all('services');
  services.getList().then(function(services){
    $scope.services = services;
  });

  $scope.chartConfig = {
    useHighStocks : true,
    credits : true,
    rangeSelector : {
      selected : 1
    },
    title : {
      text : 'placeholder'
    },
    series : [],
  };



  
  $scope.showCharts = function(service_name){
    
    clearInterval($scope.intervalId);
    $scope.serviceContext = service_name;
    var username = $scope.username;

    var jobs = Restangular.all('user').one('services', service_name).all('jobs');
    jobs.getList().then(function(jobs) {
      $scope.jobs = jobs;
      $scope.show = true;


      var credits =  {
        enabled: true,
        href: "http://7.genius.in.baidu.com:8080",
        style: {
          color: 'blue',
        },
        text: "Aqueducts"
      };

      var promise = [ $http.get(EventsApiBaseUrl + 'events?product=' + username + '&service=' + service_name + '&item=page_view&calculation=count&from=-16s&to=now')] ;
      $q.all(promise).then(function (response) {
        var result = [];
        var o_data = response[0].data ;
        for ( var i = 0; i < o_data.length ; i++ ) {
          var value = o_data[i];
          result.push({
            x: value[0],
            y: value[1]
          });
        }
        Highcharts.setOptions({
          global: {
            useUTC: false
          }
        });
        $scope.data = {
          title: {
            text: 'Realtime Page View'
          },
          xAxis: {
            type: 'datetime',
            tickPixelInterval: 75
          },
          yAxis: {
            min: 0,
            title: {
                text: 'query / s'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
          },
          credits: credits,
          plotOptions: {
            areaspline: {
              fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, Highcharts.getOptions().colors[0]],
                  [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')],
                ],
              },
            },
            lineWidth: 1,
            marker: {
              enabled: true,
              radius: 1
            },
            shadow: false,
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            threshold: null,
          },

          tooltip: {
            crosshairs: {
              enable: true,
              width: 2,
            },
          },
          legend: {
              enabled: false
          },
          exporting: {
              enabled: false
          },
          series: [{
              name: 'query',
              marker: {
                enabled: false,
              },
              data: result,
          }],
          chart: {
            type: 'areaspline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
              load: function() {
                // set up the updating of the chart each second
                var series = this.series[0];
                $scope.intervalId = setInterval(function() {
                  var request = EventsApiBaseUrl + 'events?product=' + username + '&service=' + service_name + '&item=page_view&calculation=count&from=-16s&to=now' ;
                  $http.get(request).success(function (data, status, headers, config) {
                    if ( data[data.length - 1] != series[series.length - 1]) {
                      series.addPoint( [data[data.length -1][0], data[data.length -1][1] ], true, true) ;
                    }
                  });
                }, 1000);
              }
            }
          }
        }
      });
    });
  };
}]);
