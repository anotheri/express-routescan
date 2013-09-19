# express-routescan

This [nodejs module](https://npmjs.org/package/express-routescan) is an automatic javascript files
scanner for Express JS router.

## Installation

```
$ npm install express-routescan
```

## Usage

_Express-routescan_ module is the simplest way to configure and maintain router for complex express
applications. You just have to create a 'routes/' folder (default) inside your project and write there
your routes.

So folder structure of your app will be like this:

- app.js
- routes/
	- index.js
	- users.js
	- transaction/
		- submit.js

For correct working you should require _express-routescan_ module and pass _express application_ into
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
- directory – full path to the folder with the routes;
- verbose – key for enable logging information;
- ext – array of valid file extentions.

###### Directory

Directory is a full path to the your routes folder. If you want to use another folder, you should
routescan with needed value of `directory` option _(use only the full path)_. Default value is
`path.join(__dirname, './routes/')`, so it's `./routes/` folder inside your project.

```javascript
routescan(app, {
	directory: path.join(__dirname, './path/for/another/routes/folder/insideMyProject')
});
```

###### Verbose

The `verbose` option is for logging information about scanned files (ignored, invalid, routed). Default
value is `false`.

```javascript
routescan(app, {
	verbose: true
});
```

###### Extentions

Use `ext` key if you want to define an array with valid file extensions, e.g. `['.rt']`. Default value
is `['.js']`.

```javascript
routescan(app, {
	ext: ['.rt', '.js'] // is for enable scanning for all *.rt and *.js files
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

_Express-routescan_ ignore invalid routes by default.

#### More complicated example

['get'] is default methods array for route. But you can set optional another `methods` (array
of HTTP methods described in RFC 2616) and `middleware` function(s):

```javascript
'use strict';

module.exports = {

	'/': function(req, res){
		res.send("It's main page of my app. It use GET method.");
	}


	'/myAwesomeRouteForGetAndPost': {
		methods: ['get', 'post'],
		middleware: [myMiddlewareFnOne, myMiddlewareFnTwo],
	 	callback: function(req, res){
			res.send("It's my awesome answer for GET and POST requests.");
		}
	},

	'/myAnotherAwesomeRouteForPostRequest': {
		methods: ['post'],
		middleware: [myMiddlewareFnThree],
	 	callback: function(req, res){
			res.send("It's my another awesome answer only for POST request.");
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
		callback: function(req, res){
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

Copyright (c) 2013 Alexander Bykhov

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
