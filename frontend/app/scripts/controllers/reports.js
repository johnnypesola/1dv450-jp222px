'use strict';

/**
 * @ngdoc function
 * @name climbingReportApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the climbingReportApp
 */
angular.module('climbingReportApp')
  .controller('ReportsCtrl', function ($scope, $rootScope, AuthService, Report) {
    // Init vars START

    var isLoggedIn = AuthService.isLoggedInCheck();
    $scope.pageNum = 1;
    $scope.reportsPerPage = 4;
    $scope.newReport = {};

    // Init vars END

    // Private methods START

    var getReports = function(){

      if(isLoggedIn){

        $scope.reportsData = Report.query({
          page_num: $scope.pageNum,
          per_page: $scope.reportsPerPage
        });

        $scope.reportsData.$promise

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

    // Private methods END

    // Public methods START

    $scope.saveReport = function(report){

      if(isLoggedIn){

        report.isSaving = true;

        var reportToSave = new Report(
          {
            id: report.id,
            name: report.name,
            color: report.color
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
            id: report.id,
            name: report.name,
            color: report.color
          }
        );

        reportToDelete.$delete()

          .then(function(){

            var reportToRemoveIndex;

            // Find index of report to remove
            reportToRemoveIndex = $scope.reportsData.items.findIndex(function(otherReport){
              return report.id === otherReport.id;
            });

            // Remove report from array.
            $scope.reportsData.items.splice(reportToRemoveIndex, 1);

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
            $scope.reportsData.items.push(response.items[0]);

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

    $scope.nextPage = function(){

      if(isLoggedIn){

        if($scope.pageNum !== $scope.reportsData.pagination.total_pages) {
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

    // Init code END
  });
