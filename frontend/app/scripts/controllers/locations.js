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

    var locationsData = {};
    var editedLocationByReference;
    var isLoggedIn = AuthService.isLoggedIn();
    $scope.pageNum = 1;
    $scope.locationsPerPage = 50;

    $scope.mapValues = {
      center: {},
      zoom: 5
    };

    // Init vars END

    // Private methods START

    var getLocations = function(){

      if(isLoggedIn){

        locationsData = Location.query({
          page_num: $scope.pageNum,
          per_page: $scope.locationsPerPage,
          sort_by: 'created_at',
          sort_order: 'asc'
        });

        locationsData.$promise

          .then(function(response){
            $scope.visibleLocations = response.items;
          })

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

    // Public methods START

    $scope.setAddMode = function(isAddMode){

      $scope.isAddMode = isAddMode;
      $scope.isEditMode = false;

      if(isAddMode) {

        $scope.visibleLocations = [];
        $scope.newLocation = [
          {
            name: '',
            latitude: $scope.mapValues.center.latitude,
            longitude: $scope.mapValues.center.longitude
          }
        ];

      } else {

        $scope.visibleLocations = locationsData.items;
        $scope.newLocation = [];
      }
    };

    $scope.editLocation = function(location){

      // Store reference
      editedLocationByReference = location;

      // Clone object, break reference
      var locationToEdit =  JSON.parse(JSON.stringify(location));

      $scope.isAddMode = false;
      $scope.isEditMode = true;
      $scope.editedLocation = locationToEdit;
    };

    $scope.saveLocation = function(location){

      location.isBusy = true;

      var locationToSave = new Location(
        {
          id: location.id,
          name: location.name,
          latitude: location.latitude,
          longitude: location.longitude
        }
      );

      Location.update({ id: location.id }, locationToSave).$promise
        .then(function(){

          // Update location name on map
          editedLocationByReference.name = location.name;

          $scope.isEditMode = false;

          location.isBusy = false;
        })

        // If location could not be saved.
        .catch(function() {

          // Set Flash message
          $rootScope.FlashMessage = {
            type: 'danger',
            message: 'Something strange happened. Location could not be saved.'
          };
        });
    };

    $scope.deleteLocation = function(location){

      location.isBusy = true;

      var locationToDelete = new Location(
        {
          id: location.id,
          name: location.name
        }
      );

      locationToDelete.$delete()

        .then(function(response){

          var locationToRemoveIndex;

          // Find index of location to remove
          locationToRemoveIndex = locationsData.items.findIndex(function(otherLocation){
            return location.id === otherLocation.id;
          });

          // Remove location from array.
          locationsData.items.splice(locationToRemoveIndex, 1);

          location.isBusy = false;
          $scope.isEditMode = false;

        })

        // If location could not be deleted.
        .catch(function() {

          // Set Flash message
          $rootScope.FlashMessage = {
            type: 'danger',
            message: 'Something strange happened. Location could not be deleted.'
          };
        });
    };

    $scope.addLocation = function(location){

      location.isBusy = true;

      var locationToAdd = new Location(
        {
          name: location.name,
          latitude: location.latitude,
          longitude: location.longitude
        }
      );

      locationToAdd.$save()

        .then(function(){

          $scope.isAddMode = false;
          location.isBusy = false;
          location.reports_count = 0;

          locationsData.items.push(location);

          $scope.visibleLocations = locationsData.items;
          $scope.newLocation = [];
        })

        // If location could not be added.
        .catch(function() {

          location.isBusy = false;

          // Set Flash message
          $rootScope.FlashMessage = {
            type: 'danger',
            message: 'Something strange happened. Location could not be added.'
          };
        });
    };

    $scope.onDragUpdateLocationPosition = function(){

      $scope.newLocation[0].latitude = this.getPosition().lat();
      $scope.newLocation[0].longitude = this.getPosition().lng();
    };

    // Public methods END

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
