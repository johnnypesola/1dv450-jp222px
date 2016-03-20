'use strict';

/**
 * @ngdoc function
 * @name climbingReportApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the climbingReportApp
 */
angular.module('climbingReportApp')
  .controller('AuthCtrl', function (authService, $location, $rootScope, appSettings) {

    if($location.search().logout) {
      authService.logout()

        .then(function(){

          // SetFlash message
          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Successfully logged out!'
          };

          // Redirect to start page
          $location.path('');
        })

        .catch(function(){

          // Set Flash message
          $rootScope.FlashMessage = {
            type: 'danger',
            message: 'Something went wrong while trying to log out on server. This is not a big deal though.'
          };

          // Redirect to start page
          $location.path('');
        });
    }

    else {

      // Github has logged in user, extract token from get parameters
      authService.getAndSaveTokenDataFromUrlParams();

      // Set persistent Flash message
      appSettings.setPersistentFlashMessage({
        type: 'success',
        message: 'Successfully logged in!'
      });

      // Redirect to start page
      window.location = appSettings.getAppRootUrl();
    }
  });
