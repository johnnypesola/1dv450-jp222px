'use strict';

/**
 * @ngdoc function
 * @name climbingReportApp.controller:TagsCtrl
 * @description
 * # TagsCtrl
 * Controller of the climbingReportApp
 */
angular.module('climbingReportApp')
  .controller('TagsCtrl', function ($scope, $rootScope, AuthService, Tag) {

    // Init vars START

    var isLoggedIn = AuthService.isLoggedIn();
    $scope.pageNum = 0;
    $scope.tagsPerPage = 10;

    // Init vars END

    // Public methods START

    $scope.saveTag = function(tag){

      tag.isSaving = true;

      var tagToSave = new Tag(
        {
          id: tag.id,
          name: tag.name,
          color: tag.color
        }
      );

      Tag.update({ id: tag.id }, tagToSave).$promise
        .then(function(){
          tag.isEditMode = false;
          tag.isSaving = false;
        });
    };

    // Public methods END

    // Private methods START

    // Private methods END

    // Init code START

    if(isLoggedIn){

      $scope.tagsData = Tag.query({
        page_num: $scope.pageNum,
        per_page: $scope.tagsPerPage
      });
      // If tags could not be fetched.
      $scope.tagsData.$promise.catch(function(tags){

        // Set Flash message
        $rootScope.FlashMessage = {
          type: 'danger',
          message: 'Something strange happened. Could not get tags.'
        };
      });
    }

    // Init code END

  });
