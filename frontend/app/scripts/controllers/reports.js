'use strict';

/**
 * @ngdoc function
 * @name climbingReportApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the climbingReportApp
 */
angular.module('climbingReportApp')
  .controller('ReportsCtrl', function ($scope, $rootScope, $location, AuthService, Report, Tag) {
    // Init vars START

    var isLoggedIn = AuthService.isLoggedInCheck();
    $scope.pageNum = 1;
    $scope.reportsPerPage = 8;

    // Init vars END

    // Private methods START

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

    var getReports = function(){

      if(isLoggedIn){

        $scope.reportData = Report.query({
          page_num: $scope.pageNum,
          per_page: $scope.reportsPerPage
        });

        $scope.reportData.$promise

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

    var deselectTags = function(){

      $scope.tagsData.items.forEach(function(tag){
        tag.selected = false;
      });
    };

    // Private methods END

    // Public methods START

    $scope.showReport = function(report) {

      $location.path('report/' + report.id);
    };

    $scope.searchReports = function(report) {

      report.isBusy = true;

      $scope.reportData = Report.search({
        page_num: $scope.pageNum,
        per_page: $scope.reportsPerPage,
        search_string: report.name
      });

      $scope.reportData.$promise

        .finally(function(){
          report.isBusy = false;

          deselectTags();
        });
    };

    $scope.selectTag = function(selectedTag) {

      // Check that tag is not already selected
      if(selectedTag !== undefined && !selectedTag.selected) {

        deselectTags();

        // Select tag
        selectedTag.selected = true;

        $scope.reportData = Tag.reports({
          page_num: $scope.pageNum,
          per_page: $scope.reportsPerPage,
          id: selectedTag.id
        });

      } else {

        deselectTags();

        getReports();
      }
    };

    $scope.nextPage = function(){

      if(isLoggedIn){

        if($scope.pageNum !== $scope.reportData.pagination.total_pages) {
          $scope.pageNum += 1;

          getReports();
        }
      }
    };

    $scope.previousPage = function(){

      if(isLoggedIn){

        if($scope.pageNum !== 1) {
          $scope.pageNum -= 1;

          getReports();
        }

      }
    };

    // Public methods END

    // Init code START

    getReports();

    getTags();

    // Init code END
  });
