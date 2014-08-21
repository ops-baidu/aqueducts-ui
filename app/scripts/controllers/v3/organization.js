'use strict';

angular.module('webApp').controller('OrganizationController', ['$route','$scope', '$routeParams', '$location', 'Restangular', 'tokenService', function($route, $scope, $routeParams, $location, Restangular, tokenService) {
  $scope.create = function (name, desc) {
    var orgs = Restangular.all('orgs');

    var an_org = {
      name: name,
      desc: desc,
    };
    orgs.post(an_org).then(function() {

      $location.path('/home');
    }, function(response) {
      $scope.addOrgFailed = true;
      $scope.message = response.data.message;
    });

  };

}]);