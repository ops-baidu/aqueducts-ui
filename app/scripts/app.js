'use strict';

angular.module('webApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'restangular',
  'ui.bootstrap',
  'ui.dashboard',
  'highcharts-ng',
  'headroom',
  'perfect_scrollbar'
])
  .config(function($httpProvider){
    $httpProvider.interceptors.push('tokenInterceptor');
  })

  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController',
        access: { requiredLogin: false }
      })

      .when('/login', {
        templateUrl: 'views/v3/login.html',
        controller: 'UserController',
        access: { requiredAuthentication: false }
      })
      .when('/guest', {
        templateUrl: 'views/v3/login.html',
        controller: 'GuestController',
        access: { requiredAuthentication: false }
      })
      .when('/join', {
        templateUrl: 'views/v3/join.html',
        controller: 'UserController',
        access: { requiredAuthentication: false }
      })
      // .when('/forgot_password', {
      //   templateUrl: 'views/forgot_password.html',
      //   controller: 'UserController',
      //   access: { requiredAuthentication: false }
      // })
      // .when('/logout', {
      //   templateUrl: 'views/logout.html',
      //   controller: 'UserController',
      //   access: { requiredAuthentication: true }
      // })


      // .when('/about', {
      //   templateUrl: 'views/about.html',
      //   controller: 'AboutController',
      //   access: { requiredAuthentication: false }
      // })
      // .when('/tour', {
      //   templateUrl: 'views/tour.html',
      //   controller: 'TourController',
      //   access: { requiredAuthentication: false }
      // })
      // .when('/live_demo', {
      //   templateUrl: 'views/live_demo.html',
      //   controller: 'LiveDemoController',
      //   access: { requiredAuthentication: false }
      // })


      .when('/users/:username', {
        templateUrl: 'views/v3/user_home.html',
        controller: 'UserHomeController',
        access: { requiredAuthentication: true }
      })
      .when('/home', {
        templateUrl: 'views/v3/user_home.html',
        controller: 'UserHomeController',
        access: { requiredAuthentication: true }
      })

      .when('/users/:username/:service_name', {
        templateUrl: 'views/v3/user_job_list.html',
        controller: 'UserJobController',
        access: { requiredAuthentication: true }
      })

      .when('/console', {
        templateUrl: 'views/v3/console.html',
        controller: 'UserConsoleController',
        access: { requiredAuthentication: true }
      })
      .when('/console/:orgname', {
        templateUrl: 'views/v3/console.html',
        controller: 'OrgConsoleController',
        access: { requiredAuthentication: true }
      })
      .when('/charts', {
        templateUrl: 'views/v3/user_charts.html',
        controller: 'UserChartController',
        access: { requiredAuthentication: true }
      })
      .when('/charts/:orgname', {
        templateUrl: 'views/v3/org_charts.html',
        controller: 'OrgChartController',
        access: { requiredAuthentication: true }
      })

      // .when('/demo/new', {
      //   templateUrl: 'views/new-service.html',
      //   controller: 'DemoController',
      //   access: { requiredAuthentication: true }
      // })

      .when('/orgs/:orgname', {
        templateUrl: 'views/v3/org_home.html',
        controller: 'OrgHomeController',
        access: { requiredAuthentication: true }
      })
      .when('/orgs/:orgname/:service_name', {
        templateUrl: 'views/v3/org_job_list.html',
        controller: 'OrgJobController',
        access: { requiredAuthentication: true }
      })


      .when('/orgs/:orgname/services/new', {
        templateUrl: 'views/v3/new_service.html',
        controller: 'OrgServiceController',
        access: { requiredAuthentication: true }
      })
      .when('/new/org', {
        templateUrl: 'views/v3/new_org.html',
        controller: 'OrganizationController',
        access: { requiredAuthentication: true }
      })
      .when('/new', {
        templateUrl: 'views/v3/new_service.html',
        controller: 'UserServiceController',
        access: { requiredAuthentication: true }
      })
      .when('/settings', {
        templateUrl: 'views/v3/settings.html',
        controller: 'SettingsController',
        access: { requiredAuthentication: true }
      })
      .when('/zipkin', {
        templateUrl: 'views/v3/zipkin_home.html',
        controller: 'ZipkinHomeController',
        access: { requiredAuthentication: false }
      })





      .otherwise({
        redirectTo: '/'
      });
    // $locationProvider.html5Mode(true);
  })
  .run(['$rootScope', '$location', 'authenticationService', 'tokenService', function($rootScope, $location, authenticationService, tokenService) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute) {
      //redirect only if both isAuthenticated is false and no token is set
      if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication && !authenticationService.isAuthenticated && !tokenService.getToken()) {
        $location.path('/login');
      }
    });
  }]);

