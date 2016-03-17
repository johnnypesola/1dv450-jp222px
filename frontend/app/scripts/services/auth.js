'use strict';

/**
 * @ngdoc service
 * @name climbingReportApp.auth
 * @description
 * # auth
 * Service in the climbingReportApp.
 */

angular.module('climbingReportApp')

  .service('authService', function ($window, $http, $location, localStorageService, API_URL, APP_URL) {

    // Init vars
    var that = this;

    // Do login

    that.isLoggedIn = function() {

      console.log('getTokenDataFromUrl', localStorageService.get('authTokenStr'), localStorageService.get('authTokenStr'));

      return localStorageService.get('authTokenStr') !== null;
    };

    that.login = function () {

      $window.location.href = API_URL + 'authenticate?callback=' + APP_URL + '#/auth/github';

    };

    that.logout = function () {
      // Remove token from local storage
      localStorageService.remove('authTokenStr');
      localStorageService.remove('tokenExpiresStr');

      // Redirect to start page
      $window.location.href = API_URL;
    };

    that.getTokenDataFromUrl = function () {

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

        tokenExpiresStr = url.substring(tokenExpiresStart, tokenExpiresEnd);

        // Save auth token in local storage.
        localStorageService.set('authTokenStr', authTokenStr);
        localStorageService.set('tokenExpiresStr', tokenExpiresStr);

        console.log('getTokenDataFromUrl', localStorageService.get('authTokenStr'), localStorageService.get('authTokenStr'));

      } else {

        // TODO: Redirect with error message
        $window.location.href = "";

      }
    };

    that.getToken = function () {

      return localStorageService.get('authTokenStr');
    };

    that.getTokenExpires = function () {

      return localStorageService.get('tokenExpiresStr');

    };

    that.addTokenToHttpHeaders = function() {

      $http.defaults.headers.common['X-auth-token'] = that.getToken();

    };
  });
