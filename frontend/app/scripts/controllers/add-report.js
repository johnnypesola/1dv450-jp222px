'use strict';

/**
 * @ngdoc function
 * @name climbingReportApp.controller:AddreportCtrl
 * @description
 * # AddreportCtrl
 * Controller of the climbingReportApp
 */
angular.module('climbingReportApp')
  .controller('AddReportCtrl', function ($scope, $rootScope, $routeParams, $location, $q, AuthService, Report, Location, Tag, MIN_MAP_ZOOM) {
    // Init vars START

    var isLoggedIn = AuthService.isLoggedInCheck();
    var locationsData;

    $scope.pageNum = 1;
    $scope.locationsPerPage = 50;
    $scope.newReport = {};
    $scope.mapValues = {
      center: {},
      zoom: MIN_MAP_ZOOM
    };

    // Init vars END

    // Private methods START

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


    };

    var addTagToReport = function(tag){


    };

    // Private methods END

    // Public methods START

    $scope.selectTag = function(selectedTag) {

      selectedTag.selected = !selectedTag.selected;

      if(selectedTag.selected) {

      } else {

      }
    };

    $scope.saveReport = function(report){

      if(isLoggedIn){

        report.isSaving = true;

        var reportToSave = new Report(
          {
            id: report.id,
            route_name: report.route_name,
            route_grade: report.route_grade
          }
        );

        Report.update({ id: report.id }, reportToSave).$promise
          .then(function(){
            report.isEditMode = false;
            report.isSaving = false;

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'success',
              message: 'Succesfully saved report.'
            };
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

    $scope.deleteReport = function(report){

      if(isLoggedIn){

        report.isBusy = true;

        var reportToDelete = new Report(
          {
            id: report.id
          }
        );

        reportToDelete.$delete()

          .then(function(){

            var reportToRemoveIndex;

            // Find index of report to remove
            reportToRemoveIndex = $scope.reportData.items.findIndex(function(otherReport){
              return report.id === otherReport.id;
            });

            // Remove report from array.
            $scope.reportData.items.splice(reportToRemoveIndex, 1);

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'success',
              message: 'Succesfully removed report.'
            };
          })

          // If report could not be deleted.
          .catch(function(response) {

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'danger',
              message: response.data.error,
              reasons: response.data.reasons
            };
          })

          .finally(function(){
            report.isBusy = false;
          });
      }
    };

    $scope.addReport = function(report){

      if(isLoggedIn){

        report.isBusy = true;

        var reportToAdd = new Report(
          {
            name: report.name,
            color: report.color
          }
        );

        reportToAdd.$save()

          .then(function(response){

            $scope.isAddMode = false;
            $scope.reportData.items.push(response.items[0]);

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'success',
              message: 'Succesfully added report.'
            };
          })

          // If report could not be added.
          .catch(function(response) {

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'danger',
              message: response.data.error,
              reasons: response.data.reasons
            };
          })

          .finally(function(){
            report.isBusy = false;
          });

      }
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
        });
    }

    // Init code END
  });

