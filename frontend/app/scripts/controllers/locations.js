'use strict';

/**
 * @ngdoc function
 * @name climbingReportApp.controller:LocationsCtrl
 * @description
 * # LocationsCtrl
 * Controller of the climbingReportApp
 */
angular.module('climbingReportApp')
  .controller('LocationsCtrl', function ($scope, $rootScope, Location, AuthService) {

    // Init vars START

    var isLoggedIn = AuthService.isLoggedIn();
    $scope.pageNum = 1;
    $scope.locationsPerPage = 4;

    $scope.mapValues = {
      center: {},
      zoom: 5
    };

    // Init vars END

    // Private methods START

    var getLocations = function(){

      if(isLoggedIn){

        $scope.locationsData = Location.query({
          page_num: $scope.pageNum,
          per_page: $scope.locationsPerPage,
          sort_by: 'created_at',
          sort_order: 'asc'
        });

        $scope.locationsData.$promise

          // If locations could not be fetched.
          .catch(function(){

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'danger',
              message: 'Something strange happened. Could not get locations.'
            };
          });
      }
    };

    var getLocationsNear = function(latitude, longitude){

      $scope.locationsData = Location.near({
        latitude: latitude,
        longitude: longitude
      });

      $scope.locationsData.$promise

        // If locations could not be fetched.
        .catch(function(){

          // Set Flash message
          $rootScope.FlashMessage = {
            type: 'danger',
            message: 'Something strange happened. Could not get locations near (latitude = ' + latitude + ') (longitude = ' + longitude + ')'
          };
        });
    };

    // Private methods END

    // Init code START

    getLocations();

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        function (position) {

          $scope.$apply(function () {

            $scope.mapValues.center = {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude
            };
          });
        },
        function () {
          console.log('Could not get current geolocation from browser');
        });
    }
    // Init code END

  });
