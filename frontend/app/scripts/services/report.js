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
      {
        id: '@id',
        tagId: '@tagId'
      },
      {
        query: { method: 'GET' },
        update: { method:'PUT' },
        search: {
          url: API_URL + REST_PATH + 'reports/search',
          method: 'GET'
        },
        addTag: {
          url: API_URL + REST_PATH + 'reports/:id/tag/:tagId',
          method: 'POST'
        },
        removeTag: {
          url: API_URL + REST_PATH + 'reports/:id/tag/:tagId',
          method: 'DELETE'
        }
      }
    );
  });
