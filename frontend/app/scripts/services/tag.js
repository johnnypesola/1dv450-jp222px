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
      null,
      {
        query: { method: 'GET' },
        update: { method:'PUT' }
      }
    );
  });
