/**
 * Chilean RUT module for angular
 * @version v1.0.2 - 2016-12-16
 * @link https://github.com/angular-platanus/rut
 * @author Jaime Bunzli <jpbunzli@gmail.com>, Ignacio Baixas <ignacio@platan.us>, René Morales <rene.morales.sanchez@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
!function(a,b){"use strict";function c(a){return"string"==typeof a?a.replace(/[^0-9kK]+/g,"").toUpperCase():""}function d(a,b){if(a=c(a),!a)return b;if(a.length<=1)return a;for(var d=a.slice(-4,-1)+"-"+a.substr(a.length-1),e=4;e<a.length;e+=3)d=a.slice(-3-e,-e)+"."+d;return d}function e(a){if("string"!=typeof a)return!1;for(var b=parseInt(a.slice(0,-1),10),c=0,d=1;b>0;)d=(d+b%10*(9-c++%6))%11,b=Math.floor(b/10);var e=d>0?d-1+"":"K";return e===a.slice(-1)}function f(a){var b=function(b){var c=!(b.length>0)||e(b);return a.$setValidity("rut",c),c},f=function(a){return a=c(a),b(a)?a:null},g=function(a){return a=c(a),b(a),d(a)};a.$parsers.unshift(f),a.$formatters.unshift(g)}function g(a,b){a.$watch(function(){return b.$viewValue},function(){b.$setViewValue(d(b.$viewValue)),b.$render()})}function h(a,b){a.on("blur",function(){b.$setViewValue(d(b.$viewValue)),b.$render()})}a.module("platanus.rut",[]).directive("ngRut",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){switch("undefined"==typeof c.rutFormat&&(c.rutFormat="live"),f(d),c.rutFormat){case"live":g(a,d);break;case"blur":h(b,d)}}}}).filter("rut",function(){return d}).constant("RutHelper",{format:d,clean:c,validate:function(a){return e(c(a))}})}(angular);
