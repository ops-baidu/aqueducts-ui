'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.directive('navBar', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/navbar.html'
  };
});
aqueductsApp.directive('hiChart', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
       val: '=' ,
       product: '@',
       service: '@',
    },
    link: function(scope, elm, attrs) {
      scope.$watch('val', function(value) {
        value.chart.renderTo = elm[0] ;
        value.chart.width = 1100;
        new Highcharts.Chart(value);
      });
    }
  };
});
aqueductsApp.directive('footer', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/footer.html'
  };
});


