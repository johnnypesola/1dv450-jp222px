'use strict';

/**
 * @ngdoc service
 * @name climbingReportApp.authSettings
 * @description
 * # appSettings
 * Service in the climbingReportApp. This service exists mainly to give the other services the option to disable the use of
 * token and api key in http request. For example, if a http requests is made to another server than the REST API server,
 * then these credentials should not be in those requests.
 */
angular.module('climbingReportApp')

  // Define string constants for service
  .constant('AUTH_TOKEN_STR', 'authTokenStr')
  .constant('TOKEN_EXPIRES_STR', 'tokenExpiresStr')
  .constant('PERSISTENT_FLASH_MESSAGE', 'persistentFlashMessage')
  .constant('PERSISTENT_FLASH_TYPE', 'persistentFlashType')

  .service('AppSettings', function (
    API_KEY,
    AUTH_TOKEN_STR,
    TOKEN_EXPIRES_STR,
    PERSISTENT_FLASH_MESSAGE,
    PERSISTENT_FLASH_TYPE,
    localStorageService,
    $location
  ) {

    // Define variable names


    // Token START

    this.setToken = function(value){
      localStorageService.set(AUTH_TOKEN_STR, value);
    };

    this.getToken = function(){
      return localStorageService.get(AUTH_TOKEN_STR);
    };

    this.setTokenExpires = function(value){
      localStorageService.set(TOKEN_EXPIRES_STR, value);
    };

    this.getTokenExpires = function(){
      return localStorageService.get(TOKEN_EXPIRES_STR);
    };

    this.destroyToken = function(){
      localStorageService.remove(AUTH_TOKEN_STR);
      localStorageService.remove(TOKEN_EXPIRES_STR);
    };

    // Token END

    // ApiKey START

    this.getApiKeyUrl = function(){
      return '?key=' + API_KEY;
    };

    // ApiKey END

    this.getAppRootUrl = function(){

      var l, redirectUrl;

      l = $location;
      redirectUrl = l.$$protocol + '://' + l.$$host + ( l.$$port !== 80 ? ':' + l.$$port : '' ) + '/';

      return redirectUrl;

    };

    this.setPersistentFlashMessage = function(messageObj){
      localStorageService.set(PERSISTENT_FLASH_MESSAGE, messageObj.message);
      localStorageService.set(PERSISTENT_FLASH_TYPE, messageObj.type);
    };

    this.getPersistentFlashMessage = function(){
      var message, type;

      message = localStorageService.get(PERSISTENT_FLASH_MESSAGE);
      type = localStorageService.get(PERSISTENT_FLASH_TYPE);

      if(message && type) {

        // Remove old message
        localStorageService.remove(PERSISTENT_FLASH_MESSAGE, PERSISTENT_FLASH_TYPE);

        // Return message
        return {
          message: message,
          type: type
        };
      }
      else {
        return false;
      }
    };
  });
