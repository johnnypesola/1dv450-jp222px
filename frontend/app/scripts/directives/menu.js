'use strict';

/**
 * @ngdoc directive
 * @name climbingReportApp.directive:menu
 * @description
 * # menu
 */
angular.module('climbingReportApp')
  .directive('mainMenu', function($route, $routeParams, $location, $rootScope, AuthService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/directives/menu.html',

      controller: function($scope) {

        var that = this,
          currentLocation,
          menuLocation,
          i,
          menu;

        /* Initialization START */
        $scope.isLoggedIn = $rootScope.isLoggedIn;

        $scope.isLoggedInCheck = AuthService.isLoggedInCheck();

        // Detect when location / route / url is changed. For example when a <a> link is pressed.
        $rootScope.$on("$routeChangeStart", function () {

          // Select correct menu
          that.selectCurrentLocationMenus();
        });

        /* Initialization END */

        /* Object methods START */

        that.disableAllButOne = function(menuItems, property, targetMenu){
          menuItems.forEach(function(menu){
            menu[property] = (targetMenu === menu);
          });
        };

        // Find out selected main menu from url location and select them
        that.selectCurrentLocationMenus = function(){

          // Check if we are on the index page
          if($location.path === undefined || $location.path().length === 1) {

            // Activate first menu
            if($rootScope.menus !== undefined) {

              that.disableAllButOne($rootScope.menus, 'isMenuActive', $rootScope.menus[0]);
            }
          }

          // We aren't on the index page.
          else {

            currentLocation = $location.path().split('/')[1];

            // Loop through main menu items
            for(i = 0; i < $rootScope.menus.length; i+=1) {

              // Get main menu
              menu = $rootScope.menus[i];

              // Get location url string from menu
              menuLocation = menu.location.split('/')[1];

              // If this menus location string matches with location url string
              if(menuLocation === currentLocation){

                // Activate selected menu, deactivate the other siblings.
                that.disableAllButOne($rootScope.menus, 'isMenuActive', menu);

                // Avoid unnecessary iterations
                break;
              }
            }
          }
        };

        /* Object methods END */

        /* Public methods START */

        // Method for when a main menu is selected
        $scope.selectMainMenu = function(menu) {
          $scope.selectedMainMenu = menu;

          // Toggle active main menu. (which is shown)
          that.disableAllButOne($rootScope.menus, 'isMenuActive', $scope.selectedMainMenu);

        };

        /* Public methods END */

        /* Initialization START */

        that.selectCurrentLocationMenus();

        $rootScope.$watch('isLoading', function(isLoading) {
          $scope.isLoading = isLoading;
        });

        $rootScope.$watch('isLoggedIn', function(isLoggedIn) {
          $scope.isLoggedIn = isLoggedIn;
        });

        $rootScope.$watch('menus', function(menus) {
          $scope.menus = menus;
        });

        /* Initialization END */
      }
    };
  });
