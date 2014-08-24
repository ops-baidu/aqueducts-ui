'use strict';

angular.module('webApp').controller('OrgHomeController', ['$scope', 'Restangular', '$routeParams','$route', function($scope, Restangular, $routeParams, $route) {
  $scope.init = function(){
    $scope.owner = false;
    var otherUsers = [];
    $scope.addMemberFaild = false;
    var orgname = $routeParams.orgname;
    var org = Restangular.one('orgs', orgname);
    org.get().then(function(o){
      $scope.org = o;
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


  };
  $scope.add = function(name){
    var orgname = $routeParams.orgname;
    var org = Restangular.one('orgs', orgname);
    org.customPOST({username: name, role: 2}, "add_member").then(function(){
      $route.reload();
    }, function(){
      $scope.addMemberFailed = true;
    });
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
}]);