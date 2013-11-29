/**
 * Chilean RUT module for angular
 * @version v0.1.0 - 2013-11-29
 * @link https://github.com/angular-platanus/rut
 * @author Jaime Bunzli <jpbunzli@gmail.com>, Ignacio Baixas <ignacio@platan.us>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function(angular, undefined) {
'use strict';
// Rut cleaning, preserves numbers and Ks
function cleanRut(_value) {
  return _value.replace(/[^0-9kK]+/g,'').toUpperCase();
}

// Rut formatting, ignores black values.
function formatRut(_value, _default) {
  if(!_value) return _default || ''; // Ignore blank values.

  _value = cleanRut(_value);
  if(_value.length <= 1) return _value;

  var result = _value.slice(-4,-1) + '-' + _value.substr(_value.length-1);
  for(var i = 4; i < _value.length; i+=3) result = _value.slice(-3-i,-i) + '.' + result;
  return result;
}

// Rut validation, returns true if value is empty or valid rut, expects a clean rut
function validateRut(_value) {
  var t = parseInt(_value.slice(0,-1), 10), m = 0, s = 1;
  while(t > 0) {
    s = (s + t%10 * (9 - m++%6)) % 11;
    t = Math.floor(t / 10);
  }
  var v = (s > 0) ? (s-1)+'' : 'K';
  return (v === _value.slice(-1));
}

angular.module('platanus.rut', [])
/**
 * @name formatRut
 * @description Rut formatting filter, adds dots and dashes.
 */
.filter('formatRut', function() {
  return formatRut;
})
/**
 * @name validRut
 * @description Rut validation parser, validates and clean a user input rut value.
 *
 * Usage:
 *
 * ```html
 * <input type="text" name="rut" valid-rut/>
 * ```
 */
.directive('validRut', function() {
  return {
    require: 'ngModel',
    restrict: 'AC',
    link: function(_scope, _element, _attrs, _ctrl) {
      _ctrl.$parsers.unshift(function(_value) {
        _value = cleanRut(_value);
        _ctrl.$setValidity('rut', _value === '' || validateRut(_value));
        return _value;
      });
    }
  };
})
/**
 * @name rutInput
 * @description Rut text input control, adds validation and formatting hooks.
 *
 * Usage:
 *
 * ```html
 * <rut-input name="rut"/>
 * ```
 */
.directive('rutInput', function() {
  return {
    template: '<input type="text" valid-rut/>',
    restrict: 'EAC',
    replace: true,
    link: function (_scope, _element) {
      _element.on('blur', function() {
        _element.val(formatRut(_element.val()));
      });

      _element.on('focus', function() {
        _element.val(cleanRut(_element.val()));
      });
    }
  };
});
})(angular);