Platanus Angular RUT [![Build Status](https://travis-ci.org/platanus/angular-rut.svg?branch=master)](https://travis-ci.org/platanus/angular-rut)
===============

A couple of angular components to handle chilean rut validation and formatting.

## Installation:

**Optional** Use bower to retrieve package

```
bower install angular-rut --save
```

Include angular module

```javascript
angular.module('platanus.rut')
```

## Usage

### Filter

```html
<div ng-bind="rut | formatRut"></div>
```

The filter optionally accepts a default display value that is shown if value is _empty_ or _null_.

```html
<div ng-bind="rut | formatRut: 'NA'"></div>
```

### Parser - Validator

The `valid-rut` parser can be used as an attribute or class, it will also output a clean rut value (only numbers and Ks)

```html
<input type="text" valid-rut/>
```

### Control

The `rut-input` control can be used as an element, an attribute or a class, it will replace the element. It provides automatic validation and formatting.

```html
<rut-input name="rut" ng-model="model.rut"/>
```

## TODO

* Expose `validateRut` utility function


