'use strict';

angular.module('webApp').factory('tokenInterceptor', ['$q', '$location', 'authenticationService', 'tokenService', function ($q, $location, authenticationService, tokenService) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if (tokenService.getToken()) {
        config.headers.Authorization = 'Token ' + tokenService.getToken();
      }
      return config;
    },

    requestError: function(rejection) {
      return $q.reject(rejection);
    },

    /* Set authenticationService.isAuthenticated to true if 200 received */
    response: function (response) {
      if (response != null && response.status == 200 && tokenService.getToken() && !authenticationService.isAuthenticated) {
        authenticationService.isAuthenticated = true;
      }
      return response || $q.when(response);
    },

    /* Revoke client authentication if 401 is received */
    responseError: function(rejection) {
      if (rejection != null && rejection.status === 401 && (tokenService.getToken() || authenticationService.isAuthenticated)) {
        tokenService.removeToken();
        authenticationService.isAuthenticated = false;
        $location.path('/login');
      }

      return $q.reject(rejection);
    }
  };
}]);