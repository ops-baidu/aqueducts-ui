'use strict';

angular.module('webApp').factory('userService', ['$http', 'ApiBaseUrl', function($http, ApiBaseUrl){
  return {
    login: function(key, password) {
      return $http.post(ApiBaseUrl + 'login', {key: key, password: password});

    },


    join: function(email, name, password) {
      return $http.post(ApiBaseUrl + 'join', {user[email]: email, user[name]: name, user[password]: password});
    },


  };


}]);