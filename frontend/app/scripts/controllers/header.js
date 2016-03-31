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
  .controller('HeaderCtrl', ['$scope', '$rootScope', '$location', 'AuthService', function($scope, $rootScope, $location, AuthService){

    var isLoggedIn = AuthService.isLoggedInCheck();

    /* Private methods START */

    var generateMenu = function(){

      // Declare Menu
      $scope.menus = [
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

    $scope.$watch('isLoggedIn', function() {
      generateMenu();
    });

    /* Initialization END */
  }])

  // Flash Message Controller
  .controller('FlashMessageCtrl', ["$rootScope", "$scope", "AppSettings", "$timeout", function($rootScope, $scope, AppSettings, $timeout){

    var messageObj;

    $rootScope.$watch('FlashMessage', function(newValue, oldValue) {

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

        // Start animation after 50 ms
        $timeout(function(){
          $scope.messageAnimation = true;
        }, 500);

        // Start animation after 50 ms
        $timeout(function(){
          $scope.messageVisible = false;
        }, 5000);
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
  }]);


