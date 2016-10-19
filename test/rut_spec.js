'use strict';

describe('', function() {

  var setInputValue = function(element, value) {
    element.val(value);
    element.triggerHandler('change');
  };

  beforeEach(module('platanus.rut'));

  describe('ngRut directive', function() {
    var element, scope;

    beforeEach(inject(function($rootScope, $compile) {
      element = angular.element('<form name="form"><input ng-rut type="text" name="rut" ng-model="inputs.rut"></form>');

      scope = $rootScope.$new();
      $compile(element)(scope);
      scope.$digest();

      element = element.find('input');
      scope.form.rut.$setViewValue('');
    }));

    it('should make input display an empty string if model value is empty', function() {
      scope.inputs = { rut: '' };
      scope.$digest();
      expect(element.val()).toEqual('');
    });

    it('should make input display a formated rut if model value changes', function() {
      scope.inputs = { rut: '999999999' };
      scope.$digest();
      expect(element.val()).toEqual('99.999.999-9');
    });

    it('should set model value to null if view value is invalid', function() {
      setInputValue(element, '1.018.177-6');
      expect(scope.inputs.rut).toEqual(null);
    });

    it('should pass with valid rut', function() {
      setInputValue(element, '99.999.999-9');
      expect(scope.form.rut.$valid).toEqual(true);
    });

    it('should not pass with invalid rut', function() {
      setInputValue(element, '1.018.177-6');
      expect(scope.form.rut.$valid).toEqual(false);
    });

    it('should not pass with invalid rut with a "K" in the middle', function() {
      setInputValue(element, '1.727.k17-2');
      expect(scope.form.rut.$valid).toEqual(false);
    });

    it('should format the rut shown in the input', function() {
      setInputValue(element, '999999999');
      expect(element.val()).toEqual('99.999.999-9');
    });

    it('should format an invalid rut shown in the input', function() {
      setInputValue(element, '153363081');
      expect(element.val()).toEqual('15.336.308-1');
    });

    it('should pass a clean rut to the model', function() {
      setInputValue(element, '11.111.111-1');
      expect(scope.inputs.rut).toEqual('111111111');
    });

  });

  describe('ngRut directive with rutFormat blur', function() {
    var element, scope;

    beforeEach(inject(function($rootScope, $compile) {
      element = angular.element('<form name="form"><input ng-rut rut-format="blur" type="text" name="rut" ng-model="inputs.rut"></form>');

      scope = $rootScope.$new();
      scope.inputs = { rut: '' };
      $compile(element)(scope);
      scope.$digest();

      element = element.find('input');
    }));

    it('should not format the rut in real time', function() {
      setInputValue(element, '999999999');
      expect(element.val()).toEqual('999999999');
    });

    it('should not format the rut in real time', function() {
      setInputValue(element, '999999999');

      element.triggerHandler('blur');

      expect(element.val()).toEqual('99.999.999-9');
    });

  });

  describe('rut filter', function(){
    var rutFilter;

    beforeEach(inject(function($filter) {
      rutFilter = $filter('rut');
    }));

    it('should properly format a rut', function() {
      expect(rutFilter('1')).toEqual('1');
      expect(rutFilter('101818k')).toEqual('101.818-K');
      expect(rutFilter('101818l')).toEqual('10.181-8');
      expect(rutFilter('1018189982')).toEqual('101.818.998-2');
    });

    it('should return default value if no rut is given', function() {
      expect(rutFilter('', '-')).toEqual('-');
      expect(rutFilter(null, 'NA')).toEqual('NA');
      expect(rutFilter(200, 'NA')).toEqual('NA');
    });
  });

  describe('rutHelper', function(){
    var rutHelper;

    beforeEach(inject(function(RutHelper) {
      rutHelper = RutHelper;
    }));

    it('should properly format a rut', function() {
      expect(rutHelper.format('1')).toEqual('1');
      expect(rutHelper.format('101818k')).toEqual('101.818-K');
      expect(rutHelper.format('101818l')).toEqual('10.181-8');
      expect(rutHelper.format('1018189982')).toEqual('101.818.998-2');
    });

    it('should properly validate a rut', function() {
      expect(rutHelper.validate('189783205')).toBeTruthy();
      expect(rutHelper.validate('18978320K')).toBeFalsy();
      expect(rutHelper.validate('11.111.111-1')).toBeTruthy();
      expect(rutHelper.validate('')).toBeFalsy();
    });

    it('should properly clean a rut', function() {
      expect(rutHelper.clean('18A978L3205')).toEqual('189783205');
      expect(rutHelper.clean('18.978.320-5')).toEqual('189783205');
      expect(rutHelper.clean('18978320-5')).toEqual('189783205');
      expect(rutHelper.clean('18-978-320.5')).toEqual('189783205');
    });
  });

});

