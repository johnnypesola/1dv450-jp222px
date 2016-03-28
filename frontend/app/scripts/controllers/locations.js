'use strict';

/**
 * @ngdoc function
 * @name climbingReportApp.controller:LocationsCtrl
 * @description
 * # LocationsCtrl
 * Controller of the climbingReportApp
 */



angular.module('climbingReportApp')
  .controller('LocationsCtrl', function ($scope, $rootScope, Location, AuthService, MAX_MAP_ZOOM, MIN_MAP_ZOOM) {

    // Init vars START

    var locationsData = {};
    var editedLocationByReference;
    var isLoggedIn = AuthService.isLoggedIn();
    $scope.pageNum = 1;
    $scope.locationsPerPage = 50;

    $scope.mapValues = {
      center: {},
      zoom: MIN_MAP_ZOOM
    };

    // Init vars END

    // Private methods START

    /*
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

          // If location could not be fetched.
          .catch(function(response) {

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'danger',
              message: response.data.error,
              reasons: response.data.reasons
            };
          });
      }
    };
    */

    var getLocationsNear = function(latitude, longitude){

      if(isLoggedIn){

        locationsData = Location.near({
          latitude: latitude,
          longitude: longitude,
          page_num: $scope.pageNum,
          per_page: $scope.locationsPerPage
        });

        locationsData.$promise

          .then(function(response){
            $scope.visibleLocations = response.items;
          })

          // If location could not be fetched.
          .catch(function(response) {

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'danger',
              message: response.data.error,
              reasons: response.data.reasons
            };
          });
      }
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

      if(isLoggedIn){

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
          })

          // If location could not be saved.
          .catch(function(response) {

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'danger',
              message: response.data.error,
              reasons: response.data.reasons
            };
          })

          .finally(function(){
            location.isBusy = false;
            $scope.isEditMode = false;
          });

      }
    };

    $scope.deleteLocation = function(location){

      if(isLoggedIn){

        location.isBusy = true;

        var locationToDelete = new Location(
          {
            id: location.id,
            name: location.name
          }
        );

        locationToDelete.$delete()

          .then(function(){

            var locationToRemoveIndex;

            // Find index of location to remove
            locationToRemoveIndex = locationsData.items.findIndex(function(otherLocation){
              return location.id === otherLocation.id;
            });

            // Remove location from array.
            locationsData.items.splice(locationToRemoveIndex, 1);
          })

          // If location could not be deleted.
          .catch(function(response) {

            location.isBusy = false;

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'danger',
              message: response.data.error,
              reasons: response.data.reasons
            };
          })

          .finally(function(){
            location.isBusy = false;
            $scope.isEditMode = false;
          });
      }
    };

    $scope.addLocation = function(location){

      if(isLoggedIn){

        location.isBusy = true;

        var locationToAdd = new Location(
          {
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude
          }
        );

        locationToAdd.$save()

          .then(function(response){

            var location = response.items[0];

            location.reports_count = 0;

            $scope.isAddMode = false;

            locationsData.items.push(location);

            $scope.visibleLocations = locationsData.items;
            $scope.newLocation = [];
          })

          // If location could not be added.
          .catch(function(response) {

            location.isBusy = false;

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'danger',
              message: response.data.error,
              reasons: response.data.reasons
            };
          });

      }
    };

    $scope.onDragUpdateLocationPosition = function(){

      $scope.newLocation[0].latitude = this.getPosition().lat();
      $scope.newLocation[0].longitude = this.getPosition().lng();
    };

    // Public methods END

    // Init code START

    // getLocations();

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        function (position) {

          var latitude = position.coords.latitude,
              longitude = position.coords.longitude;

          $scope.$apply(function () {

            $scope.mapValues.center = {
              longitude: longitude,
              latitude: latitude
            };

            getLocationsNear(latitude, longitude);

          });
        },
        function () {
          console.log('Could not get current geolocation from browser');
        });
    }

    $scope.$on('mapInitialized', function(evt, evtMap) {
      var map = evtMap;
      map.setOptions({maxZoom: MAX_MAP_ZOOM, minZoom: MIN_MAP_ZOOM});
      // Init code END
    });

  });
