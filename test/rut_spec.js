'use strict';

describe('', function() {

  beforeEach(module('platanus.rut'));

  describe('rutFormat filter', function() {
    it('should properly format a rut', inject(function($filter) {
      expect($filter('formatRut')('101818k')).toEqual('101.818-K');
      expect($filter('formatRut')('101818l')).toEqual('10.181-8');
      expect($filter('formatRut')('1018189982')).toEqual('101.818.998-2');
    }));

    it('should return default value if no rut is given', inject(function($filter) {
      expect($filter('formatRut')('','-')).toEqual('-');
      expect($filter('formatRut')(null,'NA')).toEqual('NA');
    }));
  });

  describe('validRut parser', function() {

    var element, scope;

    beforeEach(inject(function($rootScope, $compile) {
      element = angular.element('<form name="form"><input name="rut" type="text" ng-model="inputs.rut" valid-rut/></form>');
      scope = $rootScope;
      scope.inputs = { rut: '' };
      $compile(element)(scope);
      scope.$digest();
      element = element.find('input');
    }));

    it('should pass with valid rut', function() {
      scope.form.rut.$setViewValue('99.999.999-9');
      expect(scope.form.rut.$valid).toEqual(true);
    });

    it('should not pass with invalid rut', function() {
      scope.form.rut.$setViewValue('1.018.177-6');
      expect(scope.form.rut.$valid).toEqual(false);
    });

    it('should clean model value', function() {
      scope.form.rut.$setViewValue('99.999.999-9');
      expect(scope.inputs.rut).toEqual('999999999');
    });
  });

  describe('rutInput element', function() {

    var element, scope;

    beforeEach(inject(function($rootScope, $compile) {
      element = angular.element('<form name="form"><rut-input name="rut" ng-model="inputs.rut"/></form>');
      scope = $rootScope;
      scope.inputs = { rut: '' };
      $compile(element)(scope);
      scope.$digest();
      element = element.find('input');
    }));

    it('should pass with valid rut', function() {
      scope.form.rut.$setViewValue('99.999.999-9');
      expect(scope.form.rut.$valid).toEqual(true);
    });

    it('should not pass with invalid rut', function() {
      scope.form.rut.$setViewValue('1.018.177-6');
      expect(scope.form.rut.$valid).toEqual(false);
    });

    // TODO: validate on blur/focus behavior.

  });

});

