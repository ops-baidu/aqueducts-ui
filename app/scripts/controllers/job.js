'use strict';

var aqueductsApp = angular.module('webApp');
aqueductsApp.controller('JobController', ['$modal', '$route','$log','$scope', '$routeParams', '$location','Restangular', function($modal, $route, $log, $scope, $routeParams, $location, Restangular, service) {
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
    var product_id = $routeParams.product ; 
    var service_id = $routeParams.service ; 
    var jobs = Restangular.one('products', product_id).one('services', service_id).all('jobs');
    var product = Restangular.one('products', product_id);
    var service = Restangular.one('products', product_id).one('services', service_id);
    $scope.product = product.get().$object ; 
    $scope.service = service.get().$object ; 

    Restangular.all('items').getList().then(function(items) {
      $scope.items = items ;  
    });
    Restangular.all('calculations').getList().then(function(calcs) {
      $scope.calcs = calcs ;  
    });
    Restangular.all('tags').getList().then(function(tags) {
      $scope.tags = tags ;  
    });

    jobs.getList().then(function(jobs) {
      $scope.jobs = jobs;
    });

    $scope.destroy = function(job) {
      job.remove().then(function() {
        console.log($route);
        $route.reload();
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

      $scope.job = {
        name: $scope.product.name + "_" + $scope.service.name,
	product_id: '',
	service_id: '',
        item_id: '',
        calculation_id: '',
        tag_ids: ''	
      };
      var modalInstance = $modal.open({
        templateUrl: 'views/job_detail.html' ,
	controller: ModalInstanceCtrl,
	resolve: {
	  product: function() {
	    return $scope.product ;  
	  },
	  service: function() {
	    return $scope.service ;  
	  },
	  job: function() {
	    return $scope.job;  
	  },
	  items: function() {
	    return $scope.items;  
	  },
	  tags: function() {
	    return $scope.tags;  
	  }
	}
      });

      modalInstance.result.then(function(scope) {
	var product_id = scope.product.id ; 
	var service_id = scope.service.id ; 
	var job = scope.job ; 
        var ids = scope.ids ; 

	var ids_index = [];
	for ( var id in ids ) {
          if ( ids[id] == true ) {
	    ids_index.push(id) ;
	  }	
	}

	console.log(ids_index);

	job.calculation_id = job.calc.id ; 
	job.item_id = job.item.id ; 
	job.product_id = product_id;
	job.service_id = service_id;
	job.tag_ids = ids_index ; 
	job.name = scope.product.name 
	         + "_" + scope.service.name 
	         + "_" + job.item.name 
	         + "_" + job.calc.name ; 
	console.log(job);


	var jobs = Restangular.one('products', product_id).one('services', service_id).all('jobs') ; 
        jobs.post(job).then(function() {
          $route.reload(); 
        });
      });
   };

   var ModalInstanceCtrl = function($scope,$modalInstance,product,service,job,items,tags) {
     $scope.product = product ; 
     $scope.service = service ;  
     $scope.job = job;  
     $scope.items = items ; 
     $scope.tags = tags ; 

     var ids = {};
     for ( var i=0; i<tags.length ; i++ ) {
       var id = tags[i].id ; 
       ids[id] = false ;
     }
     $scope.ids = ids ; 
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
}]);
