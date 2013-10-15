angular.module('platanus.rut')
  .directive('rut', function() {
    return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {
        var clean = function(value) {
          if(!value) return '';

          return value.toString().replace(/[^0-9kK]+/g,'').toUpperCase();
        };

        var validate = function(value) {
          if(!value) return true;
          value = clean(value);

          var t = parseInt(value.slice(0,-1), 10), m = 0, s = 1;
          while(t > 0) {
            s = (s + t%10 * (9 - m++%6)) % 11;
            t = Math.floor(t / 10);
          }
          var v = (s > 0) ? (s-1)+'' : 'K';

          return (v == value.slice(-1));
        };

        var format = function(value) {
          var formatValue = [];
          value = clean(value);

          var reverseValue = value.split('').reverse();

          for(var i = 0; i < reverseValue.length; i++) {

            if(i === 1)
              formatValue.push("-");
            else if((i-1) % 3 === 0)
              formatValue.push(".");

            formatValue.push(reverseValue[i]);
          }

          return formatValue.reverse().join('');
        };

        //For DOM -> model validation
        ngModel.$parsers.unshift(function(value) {
          var valid = validate(value);
          ngModel.$setValidity('rut', valid);

          return valid ? clean(value) : undefined;
        });

        //For model -> DOM validation
        ngModel.$formatters.unshift(function(value) {
          var valid = validate(value);
          //ngModel.$setValidity('rut', valid);

          return format(value);
        });

        elem.bind('blur', function() {
          ngModel.$viewValue = format(ngModel.$modelValue);
          ngModel.$render();
       });
      }
    }
  });
