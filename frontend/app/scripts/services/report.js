'use strict';

/**
 * @ngdoc service
 * @name climbingReportApp.report
 * @description
 * # report
 * Service in the climbingReportApp.
 */
angular.module('climbingReportApp')
  .service('Report', function($resource, API_URL, REST_PATH) {

    return $resource(
      API_URL + REST_PATH + 'reports/:id',
      { id: '@id' },
      {
        query: { method: 'GET' },
        update: { method:'PUT' }
      }
    );
  });
