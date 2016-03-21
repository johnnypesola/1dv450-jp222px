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

    // Private methods END

    // Init code START

    getLocations();

    if (navigator.geolocation) {

      console.log('yep');
      navigator.geolocation.getCurrentPosition(
        function(position){

          console.log('position', position.coords.longitude, position.coords.latitude);

          $scope.$apply(function(){

            $scope.mapValues.center = {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude
            };
          });
        },
        function(something){
          console.log('error', something);
        }
        );
    } else {
      console.log('nope');
    }

    // Init code END

  });
