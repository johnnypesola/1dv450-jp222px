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
    'LocalStorageModule'
  ]);

climbingReportApp.constant('APP_URL', 'http://localhost:9000/');
climbingReportApp.constant('API_URL', 'http://192.168.1.12:3000/');
climbingReportApp.constant('REST_PATH', 'api/v1/');
climbingReportApp.constant('API_KEY', '4f67454c0a0aaa329b74f863880a90afc16807a909770faa0d44c359c636f943');

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
      .otherwise({
        redirectTo: '/'
      });

    // Do stuff in every http request
    $httpProvider.interceptors.push(function ($q, appSettings) {
      return {
        request: function (config) {

          // Only use API key for every http request if configured to do se.
          console.log('appSettings.getIsApiKeyEnabled()', appSettings.getIsApiKeyEnabled(), config.url);

          if(appSettings.getIsApiKeyEnabled()) {
            config.url = config.url + appSettings.getApiKeyUrl();

            appSettings.setIsApiKeyEnabled(false);
          }

          console.log('appSettings.getIsTokenEnabled()', appSettings.getIsTokenEnabled(), config.url);

          // Only use token if configured to do so.
          if(appSettings.getIsTokenEnabled()) {
            config.headers['X-auth-token'] = appSettings.getToken();

            appSettings.setIsTokenEnabled(false);
          }

          return config;
        }
      };
    });
  });