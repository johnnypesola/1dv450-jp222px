'use strict';

describe('Controller: EditReportCtrl', function () {

  // load the controller's module
  beforeEach(module('climbingReportApp'));

  var ReportCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportCtrl = $controller('EditReportCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditReportCtrl.awesomeThings.length).toBe(3);
  });
});
