'use strict';

/**
 * @ngdoc function
 * @name climbingReportApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the climbingReportApp
 */
angular.module('climbingReportApp')
  .controller('MainCtrl', function ( $rootScope, $scope, AuthService ) {

    // Init vars START

    // Init vars END

    // Public methods START
    $scope.doLogIn = function(){
      AuthService.login();
    };

    // Public methods END

    // Private methods START

    // Private methods END

    // Init code START

    $scope.isLoggedIn = AuthService.isLoggedIn();

    // Init code END

  // .controller('BookingShowCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "Booking", function($scope, $routeParams, $location, $rootScope, Booking){

  });
