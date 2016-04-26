'use strict';

describe('Controller: AddReportCtrl', function () {

  // load the controller's module
  beforeEach(module('climbingReportApp'));

  var AddReportCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddReportCtrl = $controller('AddReportCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AddReportCtrl.awesomeThings.length).toBe(3);
  });
});
