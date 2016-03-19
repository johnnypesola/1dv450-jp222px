'use strict';

/**
 * @ngdoc service
 * @name climbingReportApp.auth
 * @description
 * # auth
 * Service in the climbingReportApp.
 */

angular.module('climbingReportApp')

  .service('authService', function ($q, $window, $http, $location, appSettings, API_URL, APP_URL) {

    // Init vars
    var that = this;

    // Private Methods START

    var isTokenOld = function() {

      if ( appSettings.getTokenExpires() < Date.now()) {

        appSettings.destroyToken();

        return true;
      }

      return false;
    };

    /*
    var checkIfIsLoggedInOnServer = function() {

      that.addTokenToHttpHeaders();

      // Create promise
      var deferred = $q.defer();

      // Fetch api result
      $http.get(API_URL + 'is_logged_in')

        // We are logged in
        .success(function () {

          // Resolve promise
          deferred.resolve();
        })

        // We are not logged in
        .error(function () {

          deferred.reject();
        });

      // Return promise
      return deferred.promise;
    };
    */

    // Private Methods END

    // Public Methods START

    that.isLoggedIn = function() {

      var tokenExists = appSettings.getToken() !== null;

      // If auth token is valid
      return tokenExists && !isTokenOld();
    };

    that.login = function () {

      $window.location.href = API_URL + 'authenticate?callback=' + APP_URL + '#/auth/github';

    };

    that.logout = function () {

      // Create promise
      var deferred = $q.defer();

      // Use auth token and api key in next request
      appSettings.setIsTokenEnabled(true);
      appSettings.setIsApiKeyEnabled(true);

      console.log('authsettings getIsApiKeyEnabled', appSettings.getIsApiKeyEnabled());
      console.log('authsettings getIsTokenEnabled', appSettings.getIsTokenEnabled());

      // Fetch api result
      $http.get(API_URL + 'signout')

      // TODO: Add functionality if logout fails

        .success(function () {
          deferred.resolve();
        })

        .error(function () {
          deferred.reject();
        });

      deferred.promise.finally(function(){

        // Remove token from local storage
        appSettings.destroyToken();

      });

      return deferred.promise;
    };

    that.getAndSaveTokenDataFromUrlParams = function () {

      var url, authTokenStart, authTokenEnd, authTokenStr, tokenExpiresStart, tokenExpiresEnd, tokenExpiresStr;

      // Parse absolute url
      url = $location.absUrl();

      // Check that we have got url data
      if(url.indexOf('auth_token=') !== -1 && url.indexOf('token_expires=') !== -1) {

        // Parse Auth token
        authTokenStart = url.indexOf('auth_token=') + 11;
        authTokenEnd = url.indexOf('&', authTokenStart + 1);

        authTokenStr = url.substring(authTokenStart, authTokenEnd);

        // Parse Token expires
        tokenExpiresStart = url.indexOf('token_expires=') + 14;
        tokenExpiresEnd = url.indexOf('#', authTokenEnd + 1);

        // URI decode time string
        tokenExpiresStr = decodeURIComponent(url.substring(tokenExpiresStart, tokenExpiresEnd));

        // Replace + with space in tokenExpiresStr time string
        tokenExpiresStr = tokenExpiresStr.replace(/\+/g, " ");

        // Save auth token in local storage.
        appSettings.setToken(authTokenStr);
        appSettings.setTokenExpires(tokenExpiresStr);

      } else {

        // TODO: Redirect with error message
        $window.location.href = API_URL;

      }
    };

    // Public Methods END

  });
