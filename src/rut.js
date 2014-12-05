// Rut cleaning, preserves numbers and Ks
function cleanRut(_value) {
  return typeof _value === 'string' ? _value.replace(/[^0-9kK]+/g,'').toUpperCase() : '';
}

// Rut formatting, ignores black values.
function formatRut(_value, _default) {
  _value = cleanRut(_value);

  if(!_value) return _default;
  if(_value.length <= 1) return _value;

  var result = _value.slice(-4,-1) + '-' + _value.substr(_value.length-1);
  for(var i = 4; i < _value.length; i+=3) result = _value.slice(-3-i,-i) + '.' + result;
  return result;
}

// Rut validation, returns true if value is empty or valid rut, expects a clean rut
function validateRut(_value) {
  if(typeof _value !== 'string') return false;
  var t = parseInt(_value.slice(0,-1), 10), m = 0, s = 1;
  while(t > 0) {
    s = (s + t%10 * (9 - m++%6)) % 11;
    t = Math.floor(t / 10);
  }
  var v = (s > 0) ? (s-1)+'' : 'K';
  return (v === _value.slice(-1));
}

// Cleans and validates a rut value.
function cleanAndValidate(_value) {
  return validateRut(cleanRut(_value));
}

function addValidatorToNgModel(ngModel){
  var validate = function(value) {
    var valid = true; // inocent until proven guilty

    if (value) {
      value = cleanRut(value);
      valid = validateRut(value);
    }

    ngModel.$setValidity('rut', valid);

    return value;
  };

  ngModel.$parsers.unshift(validate);
  ngModel.$formatters.unshift(validate);
}

function formatRutOnWatch(ngModel) {
  ngModel.$viewChangeListeners.push(function(){
    ngModel.$setViewValue(formatRut(ngModel.$viewValue));
    ngModel.$render();
  });
}

function formatRutOnBlur($element, ngModel) {
  $element.on('blur', function(){
    ngModel.$setViewValue(formatRut(ngModel.$viewValue));
    ngModel.$render();
  });
}

angular.module('platanus.rut', [])

  .directive('ngRut', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $element, $attrs, ngModel) {
        if ( typeof $attrs.rutFormat == 'undefined' ) {
          $attrs.rutFormat = 'live';
        }

        addValidatorToNgModel(ngModel);

        switch($attrs.rutFormat) {
          case 'live':
            formatRutOnWatch(ngModel);
            break;
          case 'blur':
            formatRutOnBlur($element, ngModel);
            break;
        }  
      }
    }
  })

  .filter('rut', function() {
    return formatRut;
  })

  .constant('RutHelper', {
    format: formatRut,
    clean: cleanRut,
    validate: function(value) {
      return validateRut(cleanRut(value));
    }
  });
