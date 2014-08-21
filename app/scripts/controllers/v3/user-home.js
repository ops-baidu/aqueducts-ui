'use strict';

angular.module('webApp').controller('UserHomeController', ['$scope', '$routeParams', '$location', 'Restangular', 'tokenService', 'authenticationService', function($scope, $routeParams, $location, Restangular, tokenService, authenticationService) {
  // $scope.getRandomImg = function(){
  //     return "/images/banners/" + Math.floor(Math.random() * 7 + 1).toString() + ".jpg";
  // };
  $scope.init = function(){
    var randomImgArray = [];
    randomImgArray.push("/images/banners/"+ Math.floor(Math.random() * 7 + 1) + ".jpg");
    Restangular.all('user').customGET('info').then(function(user){
      $scope.user = user;
      Restangular.all('orgs').getList().then(function(orgs) {
        $scope.user.orgs = orgs;
        for (var i = orgs.length - 1; i >= 0; i--) {
          randomImgArray.push("/images/banners/"+ Math.floor(Math.random() * 7 + 1) + ".jpg");
        };
        $scope.randomImgArray = randomImgArray;

      });
      Restangular.all('user').all('services').getList().then(function(services) {

        $scope.user.services = services;

      });
    });


  };
  $scope.getJobNum = function(name){
    Restangular.all('user').one('services', name).all('jobs').getList().then(function(jobs){
      $scope.jobNum = jobs.length;
    });
  };


}]);