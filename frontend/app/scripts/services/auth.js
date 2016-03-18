'use strict';

/**
 * @ngdoc service
 * @name climbingReportApp.auth
 * @description
 * # auth
 * Service in the climbingReportApp.
 */

angular.module('climbingReportApp')

  .service('authService', function ($q, $window, $http, $location, localStorageService, API_URL, APP_URL) {

    // Init vars
    var that = this;

    // Private Methods START

    var getTokenExpires = function () {

      return Date.parse(localStorageService.get('tokenExpiresStr'));

    };

    var isTokenOld = function() {

      if (getTokenExpires() < Date.now()) {

        destroyToken();

        return true;
      }

      return false;
    };

    var destroyToken = function() {
      localStorageService.remove('authTokenStr');
      localStorageService.remove('tokenExpiresStr');
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

    that.getToken = function () {

      return localStorageService.get('authTokenStr');
    };

    that.isLoggedIn = function() {

      var tokenExists = that.getToken() !== null;

      // If auth token is valid
      if( tokenExists && !isTokenOld() ){

        // Add tokens to HTTP headers (should follow every request, until page is reloaded.)
        that.addTokenToHttpHeaders();

        return true;
      }

      return false;
    };

    that.login = function () {

      $window.location.href = API_URL + 'authenticate?callback=' + APP_URL + '#/auth/github';

    };

    that.logout = function () {

      // Create promise
      var deferred = $q.defer();

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
        destroyToken();

        // Redirect to start page
        $window.location.href = APP_URL;

      });
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
        localStorageService.set('authTokenStr', authTokenStr);
        localStorageService.set('tokenExpiresStr', tokenExpiresStr);

      } else {

        // TODO: Redirect with error message
        $window.location.href = API_URL;

      }
    };

    that.addTokenToHttpHeaders = function() {

      console.log($http.defaults.headers);

      // $http.defaults.headers.get = { 'X-auth-token':  that.getToken() };

    };

    // Public Methods END

  });
