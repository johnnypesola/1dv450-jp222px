'use strict';

/**
 * @ngdoc service
 * @name climbingReportApp.location
 * @description
 * # location
 * Service in the climbingReportApp.
 */
angular.module('climbingReportApp')
  .service('Location', function ($resource, API_URL, REST_PATH) {

    // http://192.168.1.12:3000/api/v1/locations?key=abcd1234&page_num=1&per_page=5&sort_by=created_at&sort_order=asc

    return $resource(
      API_URL + REST_PATH + 'locations/:id',
      { id: '@id' },
      {
        query: { method: 'GET' },
        update: { method:'PUT' }
      }
    );
  });
