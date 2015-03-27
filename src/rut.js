function cleanRut(_value) {
  return typeof _value === 'string' ? _value.replace(/[^0-9kK]+/g,'').toUpperCase() : '';
}

function formatRut(_value, _default) {
  _value = cleanRut(_value);

  if(!_value) return _default;
  if(_value.length <= 1) return _value;

  var result = _value.slice(-4,-1) + '-' + _value.substr(_value.length-1);
  for(var i = 4; i < _value.length; i+=3) result = _value.slice(-3-i,-i) + '.' + result;
  return result;
}

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

function addValidatorToNgModel(ngModel){
  var validate = function(value) {
    var valid = validateRut(value);
    ngModel.$setValidity('rut', valid);
    return valid;
  };

  var validateAndFilter = function(_value) {
    _value = cleanRut(_value);
    return validate(_value) ? _value : null;
  };

  var validateAndFormat = function(_value) {
    _value = cleanRut(_value);
    validate(_value);
    return formatRut(_value);
  };

  ngModel.$parsers.unshift(validateAndFilter);
  ngModel.$formatters.unshift(validateAndFormat);
}

function formatRutOnWatch($scope, ngModel) {
  $scope.$watch(function() {
    return ngModel.$viewValue;
  }, function() {
    ngModel.$setViewValue(formatRut(ngModel.$viewValue));
    ngModel.$render();
  });
}

function forceCaretPosition($scope, ngModel, $element) {
  $scope.$watch(function() {
    return ngModel.$viewValue;
  }, function() {
    setCaretPosition($element[0], viewValueLength(ngModel)+1);
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
        if ( typeof $attrs.rutFormat === 'undefined' ) {
          $attrs.rutFormat = 'live';
        }

        addValidatorToNgModel(ngModel);

        switch($attrs.rutFormat) {
        case 'live':
          formatRutOnWatch($scope, ngModel);
          forceCaretPosition($scope, ngModel, $element);
          break;
        case 'blur':
          formatRutOnBlur($element, ngModel);
          break;
        }
      }
    };
  })

  .filter('rut', function() {
    return formatRut;
  })

  .constant('RutHelper', {
    format: formatRut,
    clean: cleanRut,
    validate: function(value) {
      return validateRut(cleanRut(value));
    }
  });


  /// private

  function getCaretPosition(element) {
    if ('selectionStart' in element) {
      return element.selectionStart;
    } else if (document.selection) {
      element.focus();
      var sel = document.selection.createRange();
      var selLen = document.selection.createRange().text.length;
      sel.moveStart('character', -element.value.length);
      return sel.text.length - selLen;
    }
  }

  function setCaretPosition(element, position) {
    if (element.createTextRange) {
      var range = element.createTextRange();
      range.move('character', position);
      range.select();
    } else {
      element.focus();
      if (element.selectionStart !== undefined) {
        element.setSelectionRange(position, position);
      }
    }
  }

  function viewValueLength(ngModel) {
    return ngModel.$viewValue ? ngModel.$viewValue.length || 0 : 0;
  }
