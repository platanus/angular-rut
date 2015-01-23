angular-rut [![Bower version][bower-badge]][bower] [![Build Status][travis-badge]][travis]
===============

[travis]: https://travis-ci.org/platanus/angular-rut
[travis-badge]: https://travis-ci.org/platanus/angular-rut.svg?branch=master
[bower]: http://badge.fury.io/bo/angular-rut
[bower-badge]: https://badge.fury.io/bo/angular-rut.svg

An Angular module with several components to handle Chilean RUT validation, cleaning and formatting. It includes:

- **ngRut**: a directive to easily add validation, cleaning and formatting to any element with an associated ```ng-model``` value
- **rut**: a filter to format valid RUTs with dots and dashes (11.111.111-1) in the view
- **RutHelper**: a constant you can inject in your modules and exposes individual methods for validation, cleaning and formatting.

## Installation

*Just use [Bower](http://bower.io/)*.

```
bower install angular-rut --save
```

Then, inject it into your application:

```javascript
angular.module('MyApp', ['platanus.rut']);
```

## Directive

Add the ```ng-rut``` directive to any element with an associated ```ng-model``` to automatically perform validation, cleaning and formatting.

```html
<input ng-rut type="text" ng-model="model.rut">
```
The directive does the following:

- It **validates** whether the input is a valid RUT (by using ```$setValidity```),
- passes a **clean** RUT (numbers and K only) to the model,
- and **formats** the view by adding dots and dashes (11.111.111-1).

#### Options

You can use the ```rut-format``` attribute to define when should the view be formatted:

- ```live```: Format as the RUT changes (e.g. as a user types into the input):
```html
<input ng-rut rut-format="live" type="text">
```

- ```blur```: Format when the input is blurred:
```html
<input ng-rut rut-format="blur" type="text">
```


## Filter

Use it just like any Angular filter. It takes a (presumably valid) RUT, cleans and formats it.

```html
{{ model.rut | rut }} 
```

## RutHelper

Inject it as a dependency anywhere you like:

```javascript
app.controller('RutCtrl', ['RutHelper', function(RutHelper){ ...
```

Then use it like so:

```javascript
RutHelper.format('111111111'); // returns 11.111.111-1
```

There are three methods available:

- ```RutHelper.clean(rut)``` strips every character except numbers and the letter K.
- ```RutHelper.format(rut)``` cleans and formats the RUT number with dots and dashes (e.g 11.111.111-1).
- ```RutHelper.validate(rut)``` returns a boolean indicating whether the given RUT is valid.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Credits

Thank you [contributors](https://github.com/platanus/angular-rut/graphs/contributors)!

<img src="http://platan.us/gravatar_with_text.png" alt="Platanus" width="250"/>

angular-rut is maintained by [platanus](http://platan.us).

## License

It is free software and may be redistributed under the terms specified in the LICENSE file.
