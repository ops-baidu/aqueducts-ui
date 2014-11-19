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
  'dialogs.main',
  'pascalprecht.translate',
  'dialogs.default-translations',
  'ui.sortable'
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
      // .when('/wait', {
      //   templateUrl: 'views/wait.html',
      //   controller: 'AuthController',
      //   access: { requiredLogin: false }
      // })

      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'UserController',
        access: { requiredAuthentication: false }
      })
      // .when('/guest', {
      //   templateUrl: 'views/login.html',
      //   controller: 'GuestController',
      //   access: { requiredAuthentication: false }
      // })
      .when('/join', {
        templateUrl: 'views/join.html',
        controller: 'UserController',
        access: { requiredAuthentication: false }
      })

      .when('/about', {
        templateUrl: 'views/about.html',
        access: { requiredAuthentication: false }
      })
      // .when('/guide', {
      //   templateUrl: 'views/guide.html',
      //   access: { requiredAuthentication: false }
      // })


      .when('/home', {
        templateUrl: 'views/user_home.html',
        controller: 'UserHomeController',
        access: { requiredAuthentication: true }
      })

      // .when('/users/:username/:service_name', {
      //   templateUrl: 'views/user_job_list.html',
      //   controller: 'UserJobController',
      //   access: { requiredAuthentication: true }
      // })

    
      .when('/orgs/:orgname', {
        templateUrl: 'views/zipkin_home.html',
        controller: 'ZipkinHomeController',
        access: { requiredAuthentication: false }
      })
      
      .when('/new/org', {
        templateUrl: 'views/new_org.html',
        controller: 'OrganizationController',
        access: { requiredAuthentication: true }
      })

      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsController',
        access: { requiredAuthentication: true }
      })
      
      .when('/traces/:traceId', {
        templateUrl: 'views/traces.html',
        controller: 'TracesController',
        access: { requiredAuthentication: false }
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

  angular.module('dialogs.default-translations',['pascalprecht.translate'])
 /**
   * Default translations in English.
   *
   * Use angular-translate's $translateProvider to provide translations in an
   * alternate language.
   *
   * $translateProvider.translations('[lang]',{[translations]});
   * To use alternate translations set the preferred language to your desired
   * language.
   * $translateProvider.preferredLanguage('[lang]');
   */
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
  }]); // end config


