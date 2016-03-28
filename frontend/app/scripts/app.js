'use strict';

/**
 * @ngdoc overview
 * @name climbingReportApp
 * @description
 * # climbingReportApp
 *
 * Main module of the application.
 */

var climbingReportApp;

climbingReportApp = angular
  .module('climbingReportApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule',
    'colorpicker.module',
    'ngMap'
  ]);

climbingReportApp.constant('APP_URL', 'http://localhost:9000/');
climbingReportApp.constant('API_URL', 'http://192.168.1.12:3000/');
climbingReportApp.constant('REST_PATH', 'api/v1/');
climbingReportApp.constant('API_KEY', 'e22450efdfdf8c464ad31465931bf7b2dd1000d58f6e5afafa85044ecadbdabd');
climbingReportApp.constant('AUTH_TOKEN_STR', 'X-auth-token');
climbingReportApp.constant('GET_LOCATION_DISTANCE', 200);
climbingReportApp.constant('MAX_MAP_ZOOM', 18);
climbingReportApp.constant('MIN_MAP_ZOOM', 5);

climbingReportApp.config(function ($routeProvider, $httpProvider) {

    // App routes
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/auth/github', {
        template: '<img src="images/loader_animation.gif" />',
        controller: 'AuthCtrl',
        controllerAs: 'auth'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/tags', {
        templateUrl: 'views/tags.html',
        controller: 'TagsCtrl',
        controllerAs: 'tags'
      })
      .when('/locations', {
        templateUrl: 'views/locations.html',
        controller: 'LocationsCtrl',
        controllerAs: 'locations'
      })
      .when('/reports', {
        templateUrl: 'views/reports.html',
        controller: 'ReportsCtrl',
        controllerAs: 'reports'
      })
      .otherwise({
        redirectTo: '/'
      });

    // Do stuff in every http request
    $httpProvider.interceptors.push(function ($q, $rootScope, AppSettings, AUTH_TOKEN_STR) {
      return {
        // Only use API Key and Auth if we are connecting to the REST API.
        request: function (config) {

          // If the base url of the request is the same as the API url
          if ( AppSettings.apiUrlEqualsUrl(config.url) ) {

            // Use API key
            config.url = config.url + AppSettings.getApiKeyUrl();

            // Use Authentication headers
            config.headers[AUTH_TOKEN_STR] = AppSettings.getToken();
          }

          return config;
        },

        // Check if we have been logged out from REST API for some reason.
        responseError: function(rejection) {

          if (
            AppSettings.apiUrlEqualsUrl(rejection.config.url) &&
            rejection.status === 401
          ) {
            // Remove token from local storage
            AppSettings.destroyToken();

            $rootScope.isLoggedIn = false;
          }

          return $q.reject(rejection);
        }
      };
    });
  });