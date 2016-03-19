'use strict';

/**
 * @ngdoc service
 * @name climbingReportApp.tag
 * @description
 * # tag
 * Service in the climbingReportApp.
 */
angular.module('climbingReportApp')
  .service('tagService', function ($resource, API_URL, REST_PATH, appSettings ) {

    // appSettings.setIsTokenEnabled(true);
    // appSettings.setIsApiKeyEnabled(true);

    return $resource(
      API_URL + REST_PATH + 'tags/:tagId',
      { tagId: '@tagId' },
      { query: { method: 'GET' } }
    );
  });
