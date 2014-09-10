'use strict';

angular.module('webApp').controller('UserHomeController', ['$modal', '$scope', 'Restangular', '$route', function($modal, $scope, Restangular, $route) {

  var randomImgArray = [];
  randomImgArray.push("/images/banners/" + Math.floor(Math.random() * 7 + 1) + ".jpg");
  Restangular.all('user').customGET('info').then(function(user){
    $scope.user = user;
    if (user.sign_in_count == 0) {
      //modal
      var modalInstance = $modal.open({
        templateUrl: 'views/v3/pick_username.html' ,
        controller: ModalInstanceCtrl,
      });
      modalInstance.result.then(function($scope) {
        $route.reload();
       
      });


    };
    Restangular.all('orgs').getList().then(function(orgs) {
      $scope.user.orgs = orgs;
      for (var i = orgs.length - 1; i >= 0; i--) {
        randomImgArray.push("/images/banners/" + Math.floor(Math.random() * 7 + 1) + ".jpg");
      };
      $scope.randomImgArray = randomImgArray;

    });
    Restangular.all('user').all('services').getList().then(function(services) {

      $scope.user.services = services;

    });
  });


  $scope.getJobNum = function(name){
    Restangular.all('user').one('services', name).all('jobs').getList().then(function(jobs){
      $scope.jobNum = jobs.length;
    });
  };


  var ModalInstanceCtrl = function($scope,$modalInstance,$routeParams,Restangular,$q) {
    $scope.ok = function(username) {
      Restangular.all('user').customPOST({name: username}, "change_name", {}, {}).then(function(){
        $modalInstance.close($scope);
      }, function(response) {
        $scope.changeUsernameFailed = true;
        $scope.changeUsernameFailedMsg = response.data.message;
      });
    };
  };

  ModalInstanceCtrl.$inject = ['$scope','$modalInstance','$routeParams','Restangular','$q'];

}]);