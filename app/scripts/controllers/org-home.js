'use strict';

angular.module('webApp').controller('OrgHomeController', ['$scope', '$location', '$modal','Restangular', '$routeParams','$route', 'dialogs', function($scope, $location, $modal, Restangular, $routeParams, $route, dialogs) {
  $scope.owner = false;
  var otherUsers = [];
  $scope.addMemberFailed = false;
  var orgname = $routeParams.orgname;
  var org = Restangular.one('orgs', orgname);
  org.get().then(function(o){
    $scope.org = o;
    $scope.owner_id = o.owner_id;
    Restangular.all('user').customGET('info').then(function(user) {
      if (user.id == o.owner_id) {
        $scope.owner = true;
      };
    });
    org.customGET('people').then(function(people){
      $scope.org.people = people;
      Restangular.all('user').customGET('all').then(function(users) {
        for (var i = users.length - 1; i >= 0; i--) {
          var flag = true;
          for (var j = people.length - 1; j >= 0; j--) {
            if (people[j].name == users[i].name) {
              flag = false;
              break;
            };
          };
          if (flag) {
            otherUsers.push(users[i]) ;

          };

        };
        $scope.users = otherUsers;

      });
    });
    org.getList('services').then(function(services){
      $scope.org.services = services;

    });

  });
  $scope.destroyOrg = function(orgname){

    var dlg = dialogs.confirm('Delete Organization','This will delete all the services. Are you sure?');
    dlg.result.then(function(btn){
      Restangular.one('orgs', orgname).remove().then(function(){
        $location.path('/home');
      }, function(response){
        $scope.destroyOrgFailed = true;
        $scope.destroyOrgFailedMsg = response.data.message;
      });
    },function(btn){
    });
    
  }
  $scope.getRole = function(person){
    $scope.isOwner = false;
    $scope.isAdmin = false;
    $scope.isNormal = false;
    $scope.isGuest = false;
    if (person.id == $scope.owner_id) {
      $scope.isOwner = true;
    }else{
      Restangular.one('orgs', $routeParams.orgname).customGET('get_member', {username: person.name}).then(function(user){
        var role = user.role;
        switch(role){
          case 1:
            $scope.isAdmin = true;
            break;
          case 2:
            $scope.isNormal = true;
            break;
          case 3:
            $scope.isGuest = true;
            break;
          default:
            // $scope.isOwner = true;
        }
      });

    }
  };

  $scope.remove = function(name){
    var orgname = $routeParams.orgname;
    var org = Restangular.one('orgs', orgname);
    org.customPOST({username: name}, "remove_member").then(function(){
      $route.reload();
    }, function(){
      $scope.removeMemberFailed = true;
    });
  };
  $scope.getJobNum = function(name){
    var orgname = $routeParams.orgname;

    Restangular.one('orgs', orgname).one('services', name).all('jobs').getList().then(function(jobs){
      $scope.jobNum = jobs.length;
    });
  };




  $scope.add = function(name) {
    var modalInstance = $modal.open({
      templateUrl: 'views/v3/add_member.html' ,
      controller: ModalInstanceCtrl,
    });

    modalInstance.result.then(function($scope) {
      var orgname = $routeParams.orgname;
      var org = Restangular.one('orgs', orgname);
      org.customPOST({username: name, role: $scope.member.role}, "add_member").then(function(){
        $route.reload();
      }, function(){
        $scope.addMemberFailed = true;
      });
    });
  };

  var ModalInstanceCtrl = function($scope,$modalInstance) {
    $scope.member = Object();

    $scope.member.role = '2';

    $scope.ok = function() {
      $modalInstance.close($scope);
    };
 
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  };
  ModalInstanceCtrl.$inject = ['$scope','$modalInstance'];
}]);