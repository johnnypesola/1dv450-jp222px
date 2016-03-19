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
  .service('appSettings', function (API_KEY, localStorageService, $location) {


    // Token START

    this.setToken = function(value){
      localStorageService.set('authTokenStr', value);
    };

    this.getToken = function(){
      return localStorageService.get('authTokenStr');
    };

    this.setIsTokenEnabled = function(value){

      console.log('setIsTokenEnabled', value, typeof value);

      if(typeof value === 'boolean') {
        localStorageService.set('isTokenEnabled', value);
      } else {
        localStorageService.set('isTokenEnabled', false);
      }
    };

    this.getIsTokenEnabled = function(){
      return localStorageService.get('isTokenEnabled');
    };

    this.setTokenExpires = function(value){
      localStorageService.set('tokenExpiresStr', value);
    };

    this.getTokenExpires = function(){
      return localStorageService.get('tokenExpiresStr');
    };

    this.destroyToken = function(){
      localStorageService.remove('authTokenStr');
      localStorageService.remove('tokenExpiresStr');
    };

    // Token END

    // ApiKey START

    this.setIsApiKeyEnabled = function(value) {

      console.log('setIsApiKeyEnabled', value);

      if(typeof value === 'boolean') {
        localStorageService.set('isApiKeyEnabled', value);
      } else {
        localStorageService.set('isApiKeyEnabled', false);
      }
    };

    this.getIsApiKeyEnabled = function(){

      console.log('getIsApiKeyEnabled');

      return localStorageService.get('isApiKeyEnabled');
    };

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
      localStorageService.set('persistentFlashMessageMessage', messageObj.message);
      localStorageService.set('persistentFlashMessageType', messageObj.type);
    };

    this.getPersistentFlashMessage = function(){
      var message, type;

      message = localStorageService.get('persistentFlashMessageMessage');
      type = localStorageService.get('persistentFlashMessageType');

      if(message && type) {

        // Remove old message
        localStorageService.remove('persistentFlashMessageMessage', 'persistentFlashMessageType');

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
