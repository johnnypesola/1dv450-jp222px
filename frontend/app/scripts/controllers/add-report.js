'use strict';

/**
 * @ngdoc function
 * @name climbingReportApp.controller:AddreportCtrl
 * @description
 * # AddreportCtrl
 * Controller of the climbingReportApp
 */
angular.module('climbingReportApp')
  .controller('AddReportCtrl', function ($scope, $rootScope, $routeParams, $location, $q, AuthService, Report, Location, Tag, MIN_MAP_ZOOM, MAX_MAP_ZOOM, DEFAULT_MAP_ZOOM, DEFAULT_LATITUDE, DEFAULT_LONGITUDE) {
    // Init vars START

    var isLoggedIn = AuthService.isLoggedInCheck();
    var locationsData;

    $scope.pageNum = 1;
    $scope.locationsPerPage = 50;
    $scope.reportData = {
      tags: []
    };
    $scope.mapValues = {
      center: {
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE
      },
      zoom: DEFAULT_MAP_ZOOM
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

    var increaseLocationCount = function(locationId) {

      $scope.visibleLocations.forEach(function(location){
        if(location.id === locationId) {
          location.reports_count += 1;
        }
      });
    };

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

    var getTags = function(){

      if(isLoggedIn){

        $scope.tagsData = Tag.query({
          page_num: 1,
          per_page: 1000
        });

        $scope.tagsData.$promise

          // If tags could not be fetched.
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

    var removeTagFromReport = function(tag){

      var index = $scope.reportData.tags.indexOf(tag.name);

      if (index > -1) {
        $scope.reportData.tags.splice(index, 1);
      }
    };

    var addTagToReport = function(tag){

      $scope.reportData.tags.push(tag.name);
    };

    // Private methods END

    // Public methods START

    $scope.isAbleToSave = function() {

      return (
        $scope.reportData.route_name !== undefined &&
        $scope.reportData.route_grade !== undefined &&
        $scope.reportData.route_grade !== undefined &&
        $scope.reportData.tags !== undefined &&
        $scope.reportData.location_id !== undefined
      );
    };

    $scope.selectTag = function(selectedTag) {

      selectedTag.selected = !selectedTag.selected;

      if(selectedTag.selected) {

        addTagToReport(selectedTag);

      } else {

        removeTagFromReport(selectedTag);

      }
    };

    $scope.saveReport = function(report){

      if(isLoggedIn){

        report.isSaving = true;

        var reportToSave = new Report(
          {
            id: report.id,
            route_name: report.route_name,
            route_grade: report.route_grade,
            location_id: report.location_id,
            tags: report.tags
          }
        );

        reportToSave.$save()

          .then(function(){

            report.isEditMode = false;
            report.isSaving = false;

            // Reset report data
            $scope.reportData = {
              tags: []
            };

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'success',
              message: 'Succesfully saved report.'
            };

            // Increase count on map
            increaseLocationCount(report.location_id);
          })

          // If report could not be saved.
          .catch(function(response) {

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'danger',
              message: response.data.error,
              reasons: response.data.reasons
            };
          })

          .finally(function() {
            report.isSaving = false;
          });
      }
    };

    $scope.selectLocation = function(location){

      $scope.reportData.location_id = location.id;

    };

    $scope.addTag = function(tag){

      if(!tag) {
        return;
      }

      // Clone object, break reference
      var newTag = JSON.parse(JSON.stringify(tag));

      var tagExists = $scope.tagsData.items.find(function(oldTag){
        return oldTag.name.toLowerCase() === tag.name.toLowerCase();
      });

      if (tagExists === undefined) {
        $scope.tagsData.items.push(newTag);
      }

      // Reset tag input
      $scope.newTag.name = '';
    };

    // Public methods END

    // Init code START

    getTags();

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

          // Set Flash message
          $rootScope.FlashMessage = {
            type: 'warning',
            message: 'Could not get current geolocation from browser.'
          };

          getLocations();
        });
    }

    $scope.$on('mapInitialized', function(evt, evtMap) {
      var map = evtMap;
      map.setOptions({maxZoom: MAX_MAP_ZOOM, minZoom: MIN_MAP_ZOOM});
    });

    // Init code END
  });

