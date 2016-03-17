'use strict';

/**
 * @ngdoc service
 * @name climbingReportApp.tag
 * @description
 * # tag
 * Service in the climbingReportApp.
 */
angular.module('climbingReportApp')
  .service('tagService', function ($resource, API_URL, REST_PATH ) {

    return $resource(
      API_URL + REST_PATH + 'tags/:tagId',
      {
        tagId: '@tagId'
      }
    );

    // Fetch api result
    /*
    $http.get(API_URL + '', {
        params: {
          lat: latLongObj.lat,
          lon: latLongObj.lng,
          dis: distance,
          src: "8a"
        }
      })

      // All went good.
      .success(function (response) {

        response.forEach(function (marker) {

          // Parse date variables
          marker.obj.date = parseDate(marker.obj.date);


          console.log("DATE::: -> ", marker.obj.date);

          // Push DbMarker object to array
          markersToReturnArray.push(

            new DbMarker(
              0,
              marker.obj._id, // Becomes "eid" property
              marker.obj.location.coordinates[1], // lat
              marker.obj.location.coordinates[0], // lng
              marker.obj.name,
              marker.obj.href,
              marker.obj.source,
              marker.obj.date,
              marker.dis,
              "climbing"
            )
          );
        });

        // Return parsed array
        deferred.resolve(markersToReturnArray);
      })

      // In case data cannot be fetched
      .error(function () {

        console.log("DID NOT WORK!");

        deferred.reject("Could not get 8a markers");
      });


    // Return promise
    return deferred.promise;
  };
  */

  });
