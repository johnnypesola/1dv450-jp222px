'use strict';

/**
 * @ngdoc directive
 * @name climbingReportApp.directive:menu
 * @description
 * # menu
 */
angular.module('climbingReportApp')
  .directive('mainMenu', ["$route", "$routeParams", "$location", "$rootScope", "authService", function($route, $routeParams, $location, $rootScope, authService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/directives/menu.html',
      scope: {
        menuItems: '=menuItems'
      },
      controller: ["$scope", function($scope) {

        var that = this,
          currentLocation,
          menuLocation,
          i,
          menu;

        /* Initialization START */

        $scope.isLoggedIn = authService.isLoggedIn();

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
          if($location.path().length === 1) {

            // Activate first menu
            that.disableAllButOne($scope.menuItems, 'isMenuActive', $scope.menuItems[0]);
          }

          // We aren't on the index page.
          else {

            currentLocation = $location.path().split('/')[1];

            // Loop through main menu items
            for(i = 0; i < $scope.menuItems.length; i+=1) {

              // Get main menu
              menu = $scope.menuItems[i];

              // Get location url string from menu
              menuLocation = menu.location.split('/')[1];

              // If this menus location string matches with location url string
              if(menuLocation === currentLocation){

                // Activate selected menu, deactivate the other siblings.
                that.disableAllButOne($scope.menuItems, 'isMenuActive', menu);

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
          that.disableAllButOne($scope.menuItems, 'isMenuActive', $scope.selectedMainMenu);

        };

        /* Public methods END */

        /* Initialization START */

        that.selectCurrentLocationMenus();

        /* Initialization END */
      }]
    };
  }]);
