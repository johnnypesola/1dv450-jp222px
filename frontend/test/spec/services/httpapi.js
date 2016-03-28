'use strict';

describe('Service: httpApi', function () {

  // load the service's module
  beforeEach(module('climbingReportApp'));

  // instantiate service
  var httpApi;
  beforeEach(inject(function (_httpApi_) {
    httpApi = _httpApi_;
  }));

  it('should do something', function () {
    expect(!!httpApi).toBe(true);
  });

});
