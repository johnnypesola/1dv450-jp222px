'use strict';

/**
 * @ngdoc function
 * @name climbingReportApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the climbingReportApp
 */
angular.module('climbingReportApp')
  .controller('EditReportCtrl', function ($scope, $rootScope, $routeParams, $location, $q, AuthService, Report, Tag, MIN_MAP_ZOOM, MAX_MAP_ZOOM, DEFAULT_MAP_ZOOM) {
    // Init vars START

    var isLoggedIn = AuthService.isLoggedInCheck();
    var reportData;

    $scope.newReport = {};

    $scope.mapValues = {
      center: {},
      zoom: DEFAULT_MAP_ZOOM
    };

    // Init vars END

    // Private methods START

    var markSelectedTags = function(){

      var allTags = $scope.tagsData.items;
      var reportTags = reportData.items[0].tags;

      allTags.forEach(function(tag){

        reportTags.forEach(function(tagInReport){

          if(tag.id === tagInReport.id){

            tag.selected = true;
          }
        });
      });
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

    var getReport = function(){

      if(isLoggedIn){

        var reportId = $routeParams.id;

        reportData = Report.get({id: reportId});

        reportData.$promise

          .then(function(response){

            $scope.reportData = response.items[0];

          })

          // If reports could not be fetched.
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

      $scope.isSavingTag = true;

      Report.removeTag({
        id: $scope.reportData.id,
        tagId: tag.id
      }).$promise

        .catch(function(response){
          // Set Flash message
          $rootScope.FlashMessage = {
            type: 'danger',
            message: response.data.error,
            reasons: response.data.reasons
          };
        })

        .finally(function(){

          $scope.isSavingTag = false;
        });

    };

    var addTagToReport = function(tag){

      $scope.isSavingTag = true;

      Report.addTag({
        id: $scope.reportData.id,
        tagId: tag.id
      }).$promise

        .catch(function(response){
          // Set Flash message
          $rootScope.FlashMessage = {
            type: 'danger',
            message: response.data.error,
            reasons: response.data.reasons
          };
        })

        .finally(function(){

          $scope.isSavingTag = false;
        });
    };

    // Private methods END

    // Public methods START

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

    // Public methods END

    // Init code START

    getReport();

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

            // getLocationsNear(latitude, longitude);

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

    // When all promises have resolved, (all data is fetched)
    $q.all([
        reportData.$promise,
        $scope.tagsData.$promise
      ])
      .then(function() {
        markSelectedTags();
      });

    $scope.$on('mapInitialized', function(evt, evtMap) {
      var map = evtMap;
      map.setOptions({maxZoom: MAX_MAP_ZOOM, minZoom: MIN_MAP_ZOOM});

    });

    // Init code END
  });
