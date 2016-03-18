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

    $scope.doLogOut = function(){
      authService.logout();
    };

    // Public methods END

    // Private methods START

    // Private methods END

    // Init code START
    $scope.isLoggedIn = authService.isLoggedIn();

      if($scope.isLoggedIn){

        var tags;

        console.log('Logged in');

        tags = tagService.query({ page_num: 0, per_page: 5 });

        $scope.tags = tags;

      } else {

        // In case tags cannot be fetched, display an error to user.
        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Tags could not be found. And its all your fault! You idiot!'
        };

        console.log('Not logged in');
      }


    // Init code END

  // .controller('BookingShowCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "Booking", function($scope, $routeParams, $location, $rootScope, Booking){

  });
