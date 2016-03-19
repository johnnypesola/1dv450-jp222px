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
  .controller('HeaderCtrl', ['$scope', '$rootScope', '$location', 'authService', function($scope, $rootScope, $location, authService){

    var isLoggedIn = authService.isLoggedIn();

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
        isVisible: isLoggedIn
      },
      {
        title: "Reports",
        location: "#/reports",
        isVisible: isLoggedIn
      },
      {
        title: "Locations",
        location: "#/locations",
        isVisible: isLoggedIn
      },
      {
        title: "Users",
        location: "#/users",
        isVisible: isLoggedIn
      },
      {
        title: "About",
        location: "#/about",
        isVisible: isLoggedIn
      }
    ];

    /* Object methods START */

    /* Object methods END */

    /* Public methods START */

    /* Public methods END */

    /* Initialization START */

    /* Initialization END */
  }])

  // Flash Message Controller
  .controller('FlashMessageCtrl', ["$rootScope", "$scope", "appSettings", function($rootScope, $scope, appSettings){

    var messageObj;

    $scope.hideMessage = function(){
      $scope.messageVisible = false;
    };

    $rootScope.$watch('FlashMessage', function(newValue, oldValue) {

      // Check that the value contains data
      if ((typeof(newValue) !== 'undefined') && (newValue !== null) && (typeof newValue.type !== 'undefined')) {

        // Add class
        $scope.messageClass = newValue.type;

        // Add message
        $scope.messageText = newValue.message;
        $scope.messageVisible = true;
      }
    });

    /* Initialization START */

    messageObj = appSettings.getPersistentFlashMessage();

    if(messageObj) {
      // Add class
      $scope.messageClass = messageObj.type;

      // Add message
      $scope.messageText = messageObj.message;
      $scope.messageVisible = true;
    }

    /* Initialization END */
  }]);


