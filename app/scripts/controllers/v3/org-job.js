'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('OrgJobController', ['$modal', '$route','$scope', '$routeParams', '$location','Restangular', 'dialogs', function($modal, $route, $scope, $routeParams, $location, Restangular, dialogs) {
  
  var orgname = $routeParams.orgname;
  var service_name = $routeParams.service_name ;

  $scope.orgname = orgname;
  $scope.service_name = service_name;

  var jobs = Restangular.one('orgs', orgname).one('services', service_name).all('jobs');
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


  $scope.apply = function(orgname, service_name) {
    Restangular.one('orgs',orgname).one('services', service_name).customPOST({}, 'apply').then(function(){
      $scope.jobApplySuccess = true;
    }, function(response){
      $scope.jobApplyFailed = true;
    });
  };

  $scope.deleteService = function(orgname, service_name) {
    var dlg = dialogs.confirm('Delete Service','This will delete all the jobs. Are you sure?');
    dlg.result.then(function(btn){
    
      Restangular.one('orgs',orgname).one('services', service_name).remove().then(function(){
        $location.path('/orgs/' + orgname);
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
    $scope.j = Object();
    Restangular.one('items', job.item_id).get().then(function(item) {
      $scope.j.item = item ;
    });
    Restangular.one('calculations', job.calculation_id).get().then(function(calculation) {
      $scope.j.calculation = calculation;
    });
    job.all('tags').getList().then(function(tags) {
      var tag_names = [];
      for(var i=0; i< tags.length; i++) {
        tag_names.push(tags[i].name);
      }
      $scope.j.tag_names = tag_names;
    });
  };
  // create job
  $scope.new = function() {

    var modalInstance = $modal.open({
      templateUrl: 'views/v3/job_detail.html' ,
      controller: ModalInstanceCtrl,
    });

    modalInstance.result.then(function($scope) {
      var service_name =  $routeParams.service_name;
      var job = $scope.job;
      var tag_indexes = $scope.tagSelected;
      var tags = $scope.tags;
      var tag_ids = [];
      var tag = [];
      for (var i = tag_indexes.length - 1; i >= 0; i--) {
        tag = [];
        for (var j = tag_indexes[i].length - 1; j >= 0; j--) {
          var index = tag_indexes[i][j];
          tag.push(tags[index].id);
        };          
        tag_ids.push(tag);
      };

      job.calculation_id = job.calc.id ;
      job.item_id = job.item.id ;
      job.tag_ids = tag_ids;
      job.name =  $routeParams.orgname
              + "_" +  $routeParams.service_name
              + "_" + job.item.name
              + "_" + job.calc.name ;

      var jobs = Restangular.one('orgs', $routeParams.orgname).one('services', service_name).all('jobs') ;
      jobs.post(job).then(function() {
        $route.reload();
      }, function(response){
        $scope.jobCreateFailed = true;
        $scope.jobCreateFailedMsg = response.data.message;

      });
    });
  };

  var ModalInstanceCtrl = function($scope,$modalInstance,$routeParams,Restangular,$q) {
    $scope.tagSelected = [];

    var service_name = $routeParams.service_name ;
    var orgname = $routeParams.orgname;
    Restangular.all('items').getList().then(function(items) {
      $scope.items = items ;
    });
    Restangular.all('tags').getList().then(function(defaultTags) {
      Restangular.one('orgs', orgname).all('tags').getList().then(function(orgTags){
      
        var tags = defaultTags.concat(orgTags);
        $scope.tags = tags;
        $scope.ids = [];
      });
    });
    $scope.job = {
      name: orgname + "_" + service_name,
      item_id: '',
      calculation_id: '',
      tag_ids: ''
    };


    $scope.addTags = function(ids) {
      var tags = [];      
      if (ids.length != 0) {
        for (var id in ids) {
          if (ids[id] == true) {
            tags.push(id) ;
          }
        }
        var duplicate = false;
        for (var index in $scope.tagSelected){
          if($(tags).not($scope.tagSelected[index]).length == 0 && $($scope.tagSelected[index]).not(tags).length == 0){
            duplicate = true;
            break;
          }
        }
        if (!duplicate) {
          $scope.tagSelected.push(tags);
        };
        
        $scope.ids = [];
      };
      
    };
    $scope.removeTag = function(index) {
      $scope.tagSelected.splice(index, 1);
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
     if ( $scope.job.item && $scope.job.calc ){
      return false;
    }
      return true ;
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  };
  ModalInstanceCtrl.$inject = ['$scope','$modalInstance','$routeParams','Restangular','$q'];
}]);

