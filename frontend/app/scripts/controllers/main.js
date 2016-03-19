'use strict';

/**
 * @ngdoc function
 * @name climbingReportApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the climbingReportApp
 */
angular.module('climbingReportApp')
  .controller('MainCtrl', function ( $rootScope, $scope, authService, tagService ) {

    // Init vars START

    // Init vars END

    // Public methods START
    $scope.doLogIn = function(){
      authService.login();
    };

    // Public methods END

    // Private methods START

    // Private methods END

    // Init code START
    $scope.isLoggedIn = authService.isLoggedIn();

      if($scope.isLoggedIn){

        //$scope.tags = tagService.query({ page_num: 0, per_page: 5 });

      }


    // Init code END

  // .controller('BookingShowCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "Booking", function($scope, $routeParams, $location, $rootScope, Booking){

  });
