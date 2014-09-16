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
  'perfect_scrollbar',
  'dialogs.main',
  'pascalprecht.translate'
])
  .config(function($httpProvider){
    $httpProvider.interceptors.push('tokenInterceptor');
  })
  .config(['$translateProvider',function($translateProvider){
    $translateProvider.translations('en-US',{
        DIALOGS_ERROR: "Error",
        DIALOGS_ERROR_MSG: "An unknown error has occurred.",
        DIALOGS_CLOSE: "Close",
        DIALOGS_PLEASE_WAIT: "Please Wait",
        DIALOGS_PLEASE_WAIT_ELIPS: "Please Wait...",
        DIALOGS_PLEASE_WAIT_MSG: "Waiting on operation to complete.",
        DIALOGS_PERCENT_COMPLETE: "% Complete",
        DIALOGS_NOTIFICATION: "Notification",
        DIALOGS_NOTIFICATION_MSG: "Unknown application notification.",
        DIALOGS_CONFIRMATION: "Confirmation",
        DIALOGS_CONFIRMATION_MSG: "Confirmation required.",
        DIALOGS_OK: "OK",
        DIALOGS_YES: "Yes",
        DIALOGS_NO: "No"
    });

    $translateProvider.preferredLanguage('en-US');
  }])

  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController',
        access: { requiredLogin: false }
      })
      .when('/wait', {
        templateUrl: 'views/v3/wait.html',
        controller: 'AuthController',
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


      .when('/about', {
        templateUrl: 'views/v3/about.html',
        access: { requiredAuthentication: false }
      })
      .when('/guide', {
        templateUrl: 'views/v3/guide.html',
        access: { requiredAuthentication: false }
      })


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

      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  })
  .run(['$rootScope', '$location', 'authenticationService', 'tokenService', function($rootScope, $location, authenticationService, tokenService) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute) {
      //redirect only if both isAuthenticated is false and no token is set
      if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication && !authenticationService.isAuthenticated && !tokenService.getToken()) {
        $location.path('/login');
      }
    });
  }])
  .run(['$rootScope', '$location', '$anchorScroll', '$routeParams', function($rootScope, $location, $anchorScroll, $routeParams) {
    //when the route is changed scroll to the proper element.
    $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
      $location.hash($routeParams.scrollTo);
      $anchorScroll();  
    });
  }]);

