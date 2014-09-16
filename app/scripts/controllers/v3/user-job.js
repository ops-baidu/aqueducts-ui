'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('UserJobController', ['$modal', '$route', '$scope', '$routeParams', '$location','Restangular', 'dialogs',function($modal, $route, $scope, $routeParams, $location, Restangular, dialogs) {

    var username = $routeParams.username;
    var service_name = $routeParams.service_name ;

    $scope.username = username;
    $scope.service_name = service_name;

    var jobs = Restangular.all('user').one('services', service_name).all('jobs');
    jobs.getList().then(function(jobs) {
      $scope.jobs = jobs;
    });

    Restangular.all('items').getList().then(function(items) {
      $scope.items = items ;
    });
    Restangular.all('calculations').getList().then(function(calcs) {
      $scope.calcs = calcs ;
    });
    Restangular.all('tags').getList().then(function(tags) {
      $scope.tags = tags ;
    });

    $scope.apply = function(service_name) {
       Restangular.all('user').one('services',service_name).customPOST({}, 'apply').then(function(){
          $scope.jobApplySuccess = true;
       }, function(response){
          $scope.jobApplyFailed = true;
          $scope.jobApplyFailedMsg = response.data.message;
       });
    };

    $scope.deleteService = function(username, service_name) {
      var dlg = dialogs.confirm('Delete Service','This will delete all the jobs. Are you sure?');
      dlg.result.then(function(btn){
      
        Restangular.all('user').one('services', service_name).remove().then(function(){
          $location.path('/home');
         }, function(response){
          $scope.serviceDeleteFailed = true;
          $scope.serviceDeleteFailedMsg = response.data.message;
        });
      },function(btn){

      });
        
    };

    $scope.destroy = function(job) {
      job.remove().then(function() {
        $route.reload();
      }, function (response) {
        $scope.jobRemoveFailed = true;
        $scope.jobRemoveFailedMsg = response.data.message;
      });
    };

    $scope.initJob = function(job) {
      Restangular.one('items', job.item_id).get().then(function(item) {
        $scope.item = item ;
      });
      Restangular.one('calculations', job.calculation_id).get().then(function(calculation) {
        $scope.calculation = calculation;
      });
      job.all('tags').getList().then(function(tags) {
        var tag_names = [];
        for(var i=0; i< tags.length; i++) {
          tag_names.push(tags[i].name);
        }
        $scope.tag_names = tag_names;
      });
    };
    // create job
    $scope.new = function() {

      var modalInstance = $modal.open({
        templateUrl: 'views/v3/job_detail.html' ,
        controller: ModalInstanceCtrl,
      });

      modalInstance.result.then(function($scope) {
        var service_name =  $routeParams.service_name ;
        var job = $scope.job ;
        var ids = $scope.ids ;

        var ids_index = [];
        for ( var id in ids ) {
                if ( ids[id] == true ) {
            ids_index.push(id) ;
          }
        }

       job.calculation_id = job.calc.id ;
       job.item_id = job.item.id ;
       job.tag_ids = ids_index ;
       job.name =  $routeParams.username
                + "_" +  $routeParams.service_name
                + "_" + job.item.name
                + "_" + job.calc.name ;


       var jobs = Restangular.all('user').one('services', service_name).all('jobs') ;
       // jobs.customPOST({name: job.name, calculation_id: job.calculation_id, item_id:job.item_id, tag_ids:job.tag_ids}, '').then(function() {
       jobs.post(job).then(function() {

         $route.reload();
       }, function(response){
         $scope.jobCreateFailed = true;
         $scope.jobCreatFailedMsg = response.data.message;
       });
     });
   };

   var ModalInstanceCtrl = function($scope,$modalInstance,$routeParams,Restangular,$q) {
     var service_name = $routeParams.service_name ;
     var username = $routeParams.username;
     Restangular.all('items').getList().then(function(items) {
       $scope.items = items ;
     });
     Restangular.all('tags').getList().then(function(tags) {
       $scope.tags = tags ;
       var ids = {};
       for ( var i=0; i<tags.length ; i++ ) {
         var id = tags[i].id ;
         ids[id] = false ;
       }
       $scope.ids = ids ;
     });
     $scope.job = {
       name: username + "_" + service_name,
       item_id: '',
       calculation_id: '',
       tag_ids: ''
     };

     $scope.ok = function() {
       $modalInstance.close($scope);
     };

     $scope.change_calc = function() {
       $scope.job.calc = null;
       Restangular.one('items', $scope.job.item.id).all('calculations').getList().then(function(calcs) {
         $scope.calcs = calcs;
       });
     };

     $scope.require = function() {
       if ( $scope.job.item && $scope.job.calc ) return false;
       return true ;
     };
     $scope.cancel = function() {
       $modalInstance.dismiss('cancel');
     };
   };
   ModalInstanceCtrl.$inject = ['$scope','$modalInstance','$routeParams','Restangular','$q'];
}]);

