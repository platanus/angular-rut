Platanus Angular RUT [![Build Status](https://secure.travis-ci.org/platanus/angular-rut.png)](https://travis-ci.org/platanus/angular-rut)
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

### Directive

```html
<input ng-rut type="text" ng-model="model.rut">
```

The ```ng-rut``` directive interacts with the provided ```ng-model``` in three different tasks:

- **Validates** whether the input is a valid RUT,
- passes a **clean** RUT (numbers and K only) to the model,
- and **formats** the view by adding dots and dashes (11.111.111-1).

You can use the ```rut-format``` attribute to define when should the view be formatted:

- ```live```: Format as the RUT changes (e.g. as a user types into the input):
```html
<input ng-rut rut-format="live" type="text">
```

- ```blur```: Format when the input is blurred:
```html
<input ng-rut rut-format="blur" type="text">
```


### Filter

```html
{{ model.rut | rut }}
```

### RutHelper

angular-rut includes a ```RutHelper``` constant that contains three methods:

- RutHelper.format(rut)
- RutHelper.validate(rut)
- RutHelper.clean(rut)