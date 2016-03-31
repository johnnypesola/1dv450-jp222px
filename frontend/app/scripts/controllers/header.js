'use strict';

/**
 * @ngdoc function
 * @name climbingReportApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the climbingReportApp
 */
angular.module('climbingReportApp')

  // Header Controller
  .controller('HeaderCtrl', function($scope, $rootScope){

    /* Private methods START */

    var generateMenu = function(){

      // Declare Menu
      $rootScope.menus = [
        {
          title: "Home",
          location: "#/",
          isVisible: true
        },
        {
          title: "Tags",
          location: "#/tags",
          isVisible: $rootScope.isLoggedIn
        },
        {
          title: "Reports",
          location: "#/reports",
          isVisible: $rootScope.isLoggedIn
        },
        {
          title: "Locations",
          location: "#/locations",
          isVisible: $rootScope.isLoggedIn
        },
        {
          title: "About",
          location: "#/about",
          isVisible: $rootScope.isLoggedIn
        }
      ];
    };

    /* Private methods END */

    /* Public methods START */

    /* Public methods END */

    /* Initialization START */

    generateMenu();

    $scope.$watch('isLoggedIn', function() {
      generateMenu();
    });

    /* Initialization END */
  })

  .constant('FLASH_ANIMATION_START_TIME', 50)
  .constant('FLASH_ANIMATION_END_TIME', 5000)

  // Flash Message Controller
  .controller('FlashMessageCtrl', function($rootScope, $scope, AppSettings, $timeout, FLASH_ANIMATION_END_TIME, FLASH_ANIMATION_START_TIME){

    var messageObj;

    $rootScope.$watch('FlashMessage', function(newValue) {

      $scope.hideMessage = function(){
        $scope.messageVisible = false;
        $scope.messageAnimation = false;
      };

      // Check that the value contains data
      if ((typeof(newValue) !== 'undefined') && (newValue !== null) && (typeof newValue.type !== 'undefined')) {

        // Add class
        $scope.messageClass = newValue.type || 'danger';

        // Add message
        $scope.messageText = newValue.message || 'Something strange happened';

        // Add reasons, if there are any.
        $scope.messageReasons = newValue.reasons;

        $scope.messageVisible = true;
        $scope.messageAnimation = false;

        // Start animation after some time
        $timeout(function(){
          $scope.messageAnimation = true;
        }, FLASH_ANIMATION_START_TIME);

        // Hide message after some time
        $timeout(function(){
          $scope.messageVisible = false;
        }, FLASH_ANIMATION_END_TIME);
      }
    });

    /* Initialization START */

    messageObj = AppSettings.getPersistentFlashMessage();

    if(messageObj) {
      // Add class
      $scope.messageClass = messageObj.type;

      // Add message
      $scope.messageText = messageObj.message;
      $scope.messageVisible = true;
    }

    /* Initialization END */
  });


