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

    // JUST TEST SOME SHIT! OK???
    if($scope.isLoggedIn) {

      var tags = tagService.query();

      // In case tags cannot be fetched, display an error to user.
      tags.$promise.catch(function(){

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Tags could not be found. And its all your fault! You idiot!'
        };
      });

      $scope.tags = tags;
    }

    // Init code END

  // .controller('BookingShowCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "Booking", function($scope, $routeParams, $location, $rootScope, Booking){

  });
