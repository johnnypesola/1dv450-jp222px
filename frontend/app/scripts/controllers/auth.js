'use strict';

/**
 * @ngdoc function
 * @name climbingReportApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the climbingReportApp
 */
angular.module('climbingReportApp')
  .controller('AuthCtrl', function (authService, $location) {

    // Git hub has logged in user, extract token from get parameters
    authService.getAndSaveTokenDataFromUrlParams();

    // Redirect to start
    // $location.path('/');

  });
