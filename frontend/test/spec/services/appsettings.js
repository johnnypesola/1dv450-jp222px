'use strict';

describe('Service: appSettings', function () {

  // load the service's module
  beforeEach(module('climbingReportApp'));

  // instantiate service
  var authSettings;
  beforeEach(inject(function (_appSettings_) {
    authSettings = _appSettings_;
  }));

  it('should do something', function () {
    expect(!!authSettings).toBe(true);
  });

});
