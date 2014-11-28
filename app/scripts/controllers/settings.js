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
  $scope.orgTab.open = false;
  $scope.page = Object();
  $scope.page.alerts = [];

  Restangular.all('orgs').getList().then(function(orgs) {
    $scope.orgs = orgs;
  });


  Restangular.all('user').customGET('info').then(function(user){
    $scope.user = user;
    if (user.name == "guest") {$scope.guest = true;};
  });
  $scope.closeAlert = function(index) {
    $scope.page.alerts.splice(index, 1);
  };

  $scope.addModule = function(name, desc){
    var module = Object();
    module.name = name;
    module.desc = desc;
    module.sequence = 0;
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
        $scope.getOrgModules(orgname);

      }, function(response){
        $scope.page.alerts.push({type: 'danger', msg: response.data.message});
      });
    // }

  };
  $scope.getAnnotations = function(module) {
    module.all('annotations').getList().then(function(annotations){
      $scope.annotations = annotations.sort(function(a ,b) {return (a.weight > b.weight) ? -1: 1});
    });
  };
  $scope.removeModule = function(module, index) {
    module.remove().then(function() {
      $scope.modules.splice(index, 1);
      $scope.page.alerts.push({type: 'success', msg: 'success'});
    }, function (response) {
      $scope.page.alerts.push({type: 'danger', msg: 'failed'});
    });
  };
  $scope.removeAnnotation = function(annotation, index) {
    annotation.remove().then(function() {
      $scope.annotations.splice(index, 1);
      $scope.page.alerts.push({type: 'success', msg: 'success'});
    }, function (response) {
      $scope.page.alerts.push({type: 'danger', msg: 'failed'});
    });
  };
  $scope.addAnnotation = function(name, desc, module){
    var anno = Object();
    anno.name = name;
    anno.desc = desc;
    anno.weight = 0;
    var orgname = $scope.tab.context;
    module.all('annotations').post(anno).then(function(){
      $scope.page.alerts.push({type: 'success', msg: 'success'});
      $scope.getAnnotations(module);
    }, function(response){
      $scope.page.alerts.push({type: 'danger', msg: response.data.message});
    });
    
  };

  $scope.getOrgModules = function(orgname){
    Restangular.one('orgs', orgname).all('modules').getList().then(function(modules){
      $scope.modules = modules.sort(function(a ,b) {return (a.sequence < b.sequence) ?  -1: 1});
    });
  };

  $scope.resetToken = function(){
    Restangular.all('user').customPOST({}, "reset_token", {}, {}).then(function(token){
      tokenService.setToken(token.token);
      $scope.user.authentication_token = token.token;
    });
  };
  $scope.saveModuleOrder = function(modules){
    for (var i = modules.length - 1; i >= 0; i--) {
      modules[i].put();
    };
    $scope.page.alerts.push({type: 'success', msg: 'success'});

  };
  $scope.sortableOptionsModule = {
    update: function(e, ui) {
      
    },
    stop: function(e, ui) {
      // this callback has the changed model
      $scope.modules.map(function(i){
        i.sequence = $scope.modules.indexOf(i) + 1;
        return;
      });
    }

  };

  $scope.highlightAnnotationOnFrontPage = function(anno){
    anno.highlight1 = !anno.highlight1;
    anno.put();
  };

  $scope.highlightAnnotationOnDetailPage = function(anno){
    anno.highlight2 = !anno.highlight2;
    anno.put();

  };

  $scope.sortableOptionsAnnotation = {
    update: function(e, ui) {
      
    },
    stop: function(e, ui) {
      // this callback has the changed model
      $scope.annotations.map(function(i){
        i.weight = $scope.annotations.length - $scope.annotations.indexOf(i);
        return;
      });
    }

  };
  $scope.saveAnnoOrder = function(annotations){
    for (var i = annotations.length - 1; i >= 0; i--) {
      annotations[i].put();
    };
    $scope.page.alerts.push({type: 'success', msg: 'success'});


  };
  $scope.changePassword = function(old, new_pass){
    Restangular.all('user').customPOST({old: old, 'new': new_pass}, "change_password", {}, {}).then(function(){
      $route.reload();
    }, function() {
      $scope.changePasswordFailed = true;
    });
  };
  $scope.changeEmail = function(email){
    Restangular.all('user').customPOST({email: email}, "change_email", {}, {}).then(function(){
      $route.reload();
    }, function() {
      $scope.changeEmailFailed = true;
    });
  };
  $scope.changeUsername = function(name) {
    Restangular.all('user').customPOST({name: name}, "change_name", {}, {}).then(function(){
      $route.reload();
    }, function() {
      $scope.changeUsernameFailed = true;
    });
  };

}]);
