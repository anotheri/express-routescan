# express-routescan

This [nodejs module](https://npmjs.org/package/express-routescan) is an automatic javascript files
scanner for Express JS router.


## Installation

```
$ npm install express-routescan
```


## Usage

Express-routescan module is the simplest way to configure and maintain router for complex express
applications. You just have to create a 'routes/' folder (default) inside your project and write there
your routes.

So folder structure of your app will be like this:

- app.js
- routes/
	- index.js
	- users.js
	- transaction/
		- submit.js

For correct working you should require express-routescan module and pass _express application_ into
the one as first argument:

```javascript
// app.js

// requires
var express = require('express');
var routescan = require('express-routescan');
// …

var app = express();

// app configuration

// start express-routescan.
routescan(app);

// ...
```


### Options

There are some additional options for express-routesan config:

- `directory` — string or array of strings, default value is `[path.join(__dirname, './routes/')]`, so it's ./routes/ folder inside your project. If you want to use another folder(s), you should start express-routescan module with needed value of `directory` option.

- `ext` – array, default value is `['.js']`. Use `ext` key if you want to redefine an array with valid file extensions.

- `ignoreInvalid` — boolean, default value is `false`. Use `ignoreInvalid: true` if you don't want to get errors about invalid files in your routes folder.

- `verbose` – boolean, default is `false`. This option is using for logging information about scanned files (ignored, invalid, routed).

- `strictMode` – boolean, default is `false`. If it's `true` routes with method `all` and `use` are filtered as invalid.

```javascript
routescan(app, {
	directory: [
		'./path/to/another/routes/folder/inside/my/project',
		'./relative/path/to/folder/that/will/be/scanned/second',
		'/full/path/to/folder/that/will/be/scanned/third'
	],
	ext: ['.rt', '.js'], // is for enable scanning for all *.rt and *.js files
	ignoreInvalid: true, // is for ignoring invalid routes
	verbose: true,
	strictMode: true // is for filtering `all`-method and `use`-method routes.
});
```


## Route files

#### Simple example

In turn, the simplest route file is a file with `module.exports` and should looks like this one:

```javascript
'use strict';

/* GET home page. */

module.exports = {

	'/': function(req, res){
		res.send("It's main page of my app.");
	}

};
```

Express-routescan ignore invalid routes by default.

#### More complicated example

['get'] is default methods array for route. But you can set optional another `methods` (array
of HTTP methods described in RFC 2616) and `middleware` function(s):

```javascript
'use strict';

module.exports = {

	'/': {
		methods: ['get'],
		//callback `fn` function is required
		fn: function(req, res){
			res.send("It's main page of my app. It use GET method.");
		}
	},

	'/myAwesomeRouteForGetAndPost': {
		methods: ['get', 'post'],
		//midleware is optional parameter
		middleware: [myMiddlewareFnOne, myMiddlewareFnTwo],
		//callback `fn` function is required
	 	fn: function(req, res){
			res.send("It's my awesome answer for GET and POST requests.");
		}
	},

	'/myAnotherAwesomeRouteForPostRequest': {
		methods: ['post'],
		middleware: [myMiddlewareFnThree],
	 	fn: function(req, res){
			res.send("It's my another awesome answer only for POST request.");
		}
	}

};
```

#### Middleware with USE method (loggers, error handlers, etc)

The order of the route initialisation is matter. So if you need middleware function that should be done every time _before_ each your routes, you should have the first route defined the next way (it may be defined in file which name start with underscore, e.g. `_logger.js` or '_middleware.js'):

```
'use strict';

/* GET home page. */

module.exports = {
    'logger': {
        methods: [ 'use' ],
        fn: function( req, res, next ){
            // It'll been done before each of your routes
            console.log('It has been logged');
            next();
        }
    }
};
```

In case of using `use` method the route name isn't so important, I'd suggest to name it accordingly to the functionality of the handler. So the previous example will be work like this one:

```
app.use(function( req, res, next ){
    // It'll be done before each of your routes
    console.log('It has been logged');
    next();
}
```

But if you need middleware function that should be defined _after_ all your routes (e.g. error handler) and should be called in case of requested route is undefined (kind of default route), you shouldn't define in the last file of the route folder, or make a new separate file named like last file of the route folder, but it'll work as well. It's much better for maintaining to define your route with `deferred: true` key:

```
'use strict';

/* GET home page. */

module.exports = {
    'error handler': {
        methods: [ 'use' ],
        deferred: true,
        fn: function( req, res, next ){
            // It'll be done in case of requested route is undefined
            res.send('404 Not Found');
        }
    }
};
```

The `deferred` key works only with 'use' method and it's used to define middleware function that should be defined after the routes. 


#### Forced routes (overrides)

If router already has handler for one route path and one method, other files with the same route path and the same method but scanned later will be ignored. It's a default behaviour of express-routescan. But you can use `forced` key into route definition for overrides of routes that already applied to application. So, if you have a route like the one in "Simple example" and you want to override it with another one, just add `forced: true` key into your route definition, e.g.:

```javascript
'use strict';

/* GET overridden home page. */

module.exports = {

	'/': {
		forced: true,
		fn:function(req, res){
			res.send("It's overridden main page of my app.");
		}
	}

};
```

#### Locked routes (not overridable)

If you want to protect your route from overrides you should use `locked: true` key into your route definition, e.g.:

```javascript
'use strict';

/* GET not overridable (even by using forced routes) home page. */

module.exports = {

	'/': {
		locked: true,
		fn:function(req, res){
			res.send("It's not overridable main page of my app.");
		}
	}

};
```


#### Usage RegExp as route

If you want use RegExp with express-routescan, this example is special for you:

```javascript
'use strict';

module.exports = {

	'/commits': {
		regexp: /^\/commits\/(\w+)(?:\.\.(\w+))?$/,
		fn: function(req, res){
			res.send("It's page would match \"GET /commits/71dbb9c\" as well as \"GET /commits/71dbb9c..4c084f9\".");
		}
	}

};
```


## .routeignore

As was mentioned above express-routescan ignore invalid route-files. Scanner also ignore
all files except for valid extention array (by default `['.js']`) inside routes folder.
If you want to ignore some of _.js_ or other valid files you can use _.routeignore_ file
inside your routes folder to add ignore rules for scanner. It's easy!

For example, if you don't want use routes from _'./routes/temp/'_ folder just create
_'./routes/.routeignore'_ file with next content:

```
temp/
```


## License
The MIT License (MIT)

Copyright (c) 2013-2014 Alexander Bykhov

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
