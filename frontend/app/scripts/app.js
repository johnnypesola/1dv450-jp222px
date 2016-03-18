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
        template: ' ',
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

    // Add API key to every http request
    $httpProvider.interceptors.push(function ($q, API_KEY) {
      return {
        request: function (config) {
          config.url = config.url + '?key=' + API_KEY;

          // config.params = config.params || {};
          // config.params.key = API_KEY;

          return config;

        }
      };
    });
  });