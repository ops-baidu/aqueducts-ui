'use strict';

angular.module('webApp').factory('authenticationService', function(){

  var auth = {
    isAuthenticated: false,
    isAdmin: false
  };

  return auth;

});




