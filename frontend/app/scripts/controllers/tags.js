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
    $scope.pageNum = 1;
    $scope.tagsPerPage = 4;

    // Init vars END

    // Private methods START

    var getTags = function(){

      if(isLoggedIn){

        $scope.tagsData = Tag.query({
          page_num: $scope.pageNum,
          per_page: $scope.tagsPerPage
        });

        $scope.tagsData.$promise

          // If tags could not be fetched.
          .catch(function(){

            // Set Flash message
            $rootScope.FlashMessage = {
              type: 'danger',
              message: 'Something strange happened. Could not get tags.'
            };
          });
      }
    };

    // Private methods END

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

    $scope.deleteTag = function(tag){

      tag.isBusy = true;

      var tagToDelete = new Tag(
        {
          id: tag.id,
          name: tag.name,
          color: tag.color
        }
      );

      tagToDelete.$delete()

        .then(function(response){

          var tagToRemoveIndex;

          // Find index of tag to remove
          tagToRemoveIndex = $scope.tagsData.items.findIndex(function(otherTag){
            return tag.id === otherTag.id;
          });

          // Remove tag from array.
          $scope.tagsData.items.splice(tagToRemoveIndex, 1);

          tag.isBusy = false;

        })

        // If tag could not be added.
        .catch(function() {

          // Set Flash message
          $rootScope.FlashMessage = {
            type: 'danger',
            message: 'Something strange happened. Tag could not be deleted.'
          };
        });
    };

    $scope.addTag = function(tag){

      tag.isBusy = true;

      var tagToAdd = new Tag(
        {
          name: tag.name,
          color: tag.color
        }
      );

      tagToAdd.$save()

        .then(function(response){

          $scope.isAddMode = false;
          tag.isBusy = false;

          $scope.tagsData.items.push(response.items[0]);
        })

        // If tag could not be added.
        .catch(function() {

          // Set Flash message
          $rootScope.FlashMessage = {
            type: 'danger',
            message: 'Something strange happened. Tag could not be added.'
          };
        });
    };

    $scope.nextPage = function(){

      if($scope.pageNum !== $scope.tagsData.pagination.total_pages) {
        $scope.pageNum += 1;

        getTags();
      }
    };

    $scope.previousPage = function(){

      if($scope.pageNum !== 1) {
        $scope.pageNum -= 1;

        getTags();
      }
    };

    // Public methods END

    // Init code START

    getTags();

    // Init code END

  });
