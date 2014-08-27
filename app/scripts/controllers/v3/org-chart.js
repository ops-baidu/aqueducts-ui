'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('OrgChartController', [ '$scope','$http', '$q', '$routeParams', 'Restangular', 'EventsApiBaseUrl' , function ($scope,$http,$q,$routeParams,Restangular,EventsApiBaseUrl) {
    $scope.page = Object();
    $scope.page.serviceContext = "Services";
    var orgname = $routeParams.orgname;
    $scope.orgname = orgname;
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
    clearInterval($scope.page.intervalId);
    $scope.show = true;
    $scope.page.serviceContext = service_name;

    var jobs = Restangular.one('orgs', orgname).one('services', service_name).all('jobs');
    jobs.getList().then(function(jobs) {
      $scope.jobs = jobs;
    });


  };

}]);
