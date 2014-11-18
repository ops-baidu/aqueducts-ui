'use strict';

angular.module('webApp').controller('SettingsController', ['$scope','Restangular', 'tokenService', '$route',
    function($scope, Restangular, tokenService, $route) {

  $scope.changePasswordFailed = false;
  $scope.changeEmailFailed = false;
  $scope.changeUsernameFailed = false;
  $scope.guest = false;
  $scope.tab = Object();
  $scope.tab.context = 'User';
  $scope.userTab = Object();
  $scope.userTab.open = true;
  $scope.userTab.active = 2;
  $scope.active = true;
  $scope.orgTab = Object();
  $scope.page = Object();
  $scope.page.alerts = [];

  Restangular.all('orgs').getList().then(function(orgs) {
    $scope.orgs = orgs;
  });


  Restangular.all('user').customGET('info').then(function(user){
    $scope.user = user;
    if (user.name == "guest") {$scope.guest = true;};
  });
  // $scope.getUserTags = function(){
  //   Restangular.all('user').all('tags').getList().then(function(tags){
  //     $scope.customTags = tags;
  //   });
  // };

  $scope.closeAlert = function(index) {
    $scope.page.alerts.splice(index, 1);
  };

  $scope.addModule = function(name, desc){
    var module = Object();
    module.name = name;
    tag.desc = desc;
    // if ($scope.tab.context == 'User') {
    //   Restangular.all('user').all('modules').post(tag).then(function(){
    //     $scope.page.alerts.push({type: 'success', msg: 'success'});
    //     $scope.customTags.push(tag);
    //   }, function(response){
    //     $scope.page.alerts.push({type: 'danger', msg: response.data.message});
    //   });
    // } else {
      var orgname = $scope.tab.context;
      Restangular.one('orgs', orgname).all('modules').post(module).then(function(){
        $scope.page.alerts.push({type: 'success', msg: 'success'});
        $scope.modules.push(module);
      }, function(response){
        $scope.page.alerts.push({type: 'danger', msg: response.data.message});
      });
    // }

  };

  $scope.addAnnotation = function(name, desc, moduleName){
    var anno = Object();
    anno.name = name;
    anno.desc = desc;
    var orgname = $scope.tab.context;
    Restangular.one('orgs', orgname).one('modules', moduleName).all()post(tag).then(function(){
      $scope.page.alerts.push({type: 'success', msg: 'success'});
      $scope.customTags.push(tag);
    }, function(response){
      $scope.page.alerts.push({type: 'danger', msg: response.data.message});
    });
    
  };

  $scope.getOrgModules = function(orgname){
    Restangular.one('orgs', orgname).all('modules').getList().then(function(modules){
      $scope.modules = modules;
    });
  };

  $scope.getOrgAnnotations = function(orgname){
    Restangular.one('orgs', orgname).all('annotations').getList().then(function(annotations){
      $scope.annotations = annotations;
    });
  };
  // $scope.resetToken = function(){
  //   Restangular.all('user').customPOST({}, "reset_token", {}, {}).then(function(token){
  //     tokenService.setToken(token.token);
  //     $scope.user.authentication_token = token.token;
  //   });
  // };

  // $scope.changePassword = function(old, new_pass){
  //   Restangular.all('user').customPOST({old: old, 'new': new_pass}, "change_password", {}, {}).then(function(){
  //     $route.reload();
  //   }, function() {
  //     $scope.changePasswordFailed = true;
  //   });
  // };
  // $scope.changeEmail = function(email){
  //   Restangular.all('user').customPOST({email: email}, "change_email", {}, {}).then(function(){
  //     $route.reload();
  //   }, function() {
  //     $scope.changeEmailFailed = true;
  //   });
  // };
  // $scope.changeUsername = function(name) {
  //   Restangular.all('user').customPOST({name: name}, "change_name", {}, {}).then(function(){
  //     $route.reload();
  //   }, function() {
  //     $scope.changeUsernameFailed = true;
  //   });
  // };

}]);
