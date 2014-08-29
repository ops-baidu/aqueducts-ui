'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('OrgChartController', [ '$scope','$http', '$q', '$routeParams', 'Restangular', 'EventsApiBaseUrl' , function ($scope,$http,$q,$routeParams,Restangular,EventsApiBaseUrl) {
  
  $scope.serviceContext = "Services";
  var orgname = $routeParams.orgname;
  $scope.orgname = orgname;
  $scope.data = { chart: {} };
  var services = Restangular.one('orgs', orgname).all('services');
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

    var jobs = Restangular.one('orgs', orgname).one('services', service_name).all('jobs');
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
      var promise = [ $http.get(EventsApiBaseUrl + 'events?product=' + orgname + '&service=' + service_name + '&item=page_view&calculation=count&from=-16s&to=now')] ;
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
                  var request = EventsApiBaseUrl + 'events?product=' + orgname + '&service=' + service_name + '&item=page_view&calculation=count&from=-16s&to=now' ;
                  $http.get(request).success(function (data, status, headers, config) {
                    if ( data[data.length - 1] != series[series.length - 1]) {
                      series.addPoint( [data[data.length -1][0], data[data.length -1][1] ], true, true) ;
                    }
                  });
                }, 1000);
              }
            }
          },
        }
      }); 
    });
  };

}]);
