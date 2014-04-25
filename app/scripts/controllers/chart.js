'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('ChartController', function ($scope,$http,$q,Restangular) {
  $scope.initConfig=function(config,product,service,job) {
    var promises = [
	Restangular.one('items', job.item_id).get(),
	Restangular.one('calculations', job.calculation_id).get()
    ];
    $q.all(promises).then(function(results) {
      var item = results[0] ;
      var calc = results[1] ;
      var series = [  
        'http://api.aqueducts.baidu.com/v1/events?product=' + product.name + '&service=' + service.name + '&item=' + item.name + '&calculation=' + calc.name + '&from=-24h&to=now&period=60&name=today&diff=0', 
        'http://api.aqueducts.baidu.com/v1/events?product=' + product.name + '&service=' + service.name + '&item=' + item.name + '&calculation=' + calc.name + '&from=-48h&to=-24h&period=60&name=yesterday&diff=86400', 
        'http://api.aqueducts.baidu.com/v1/events?product=' + product.name + '&service=' + service.name + '&item=' + item.name + '&calculation=' + calc.name + '&from=-168h&to=-144h&period=60&name=lastweek&diff=518400',
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
  }

  var credits =  {
    enabled: true,
    href: "http://7.genius.in.baidu.com:8080",
    style: {
      color: 'blue',
    }, 
    text: "Aqueducts"
  };
  var promise = [ $http.get('http://api.aqueducts.baidu.com/v1/events?product=' + "im" + '&service=' + "router" + '&item=page_view&calculation=count&from=-16s&to=now')] ;
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
      chart: {
          type: 'areaspline',
          animation: Highcharts.svg, // don't animate in old IE
          marginRight: 10,
          events: {
              load: function() {
                  // set up the updating of the chart each second
                  var series = this.series[0];
                  setInterval(function() {
                      var request = 'http://api.aqueducts.baidu.com/v1/events?product=' + "im" + '&service=' + "router" + '&item=page_view&calculation=count&from=-16s&to=now' ;
                      $http.get(request).success(function (data, status, headers, config) {
                        if ( data[data.length - 1] != series[series.length - 1]) {
                          series.addPoint( [data[data.length -1][0], data[data.length -1][1] ], true, true) ; 
                        }
                      });
                  }, 1000);
              }
          }
      },
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
      }]
    }
  });
});
