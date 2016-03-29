'use strict';

/**
 * @ngdoc service
 * @name climbingReportApp.tag
 * @description
 * # tag
 * Service in the climbingReportApp.
 */
angular.module('climbingReportApp')
  .service('Tag', function ($resource, API_URL, REST_PATH) {

    return $resource(
      API_URL + REST_PATH + 'tags/:id',
      { id: '@id' },
      {
        query: { method: 'GET' },
        update: { method:'PUT' },
        reports: {
          url: API_URL + REST_PATH + 'tags/:id/reports',
          method: 'GET'
        }
      }
    );
  });
