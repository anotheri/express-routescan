# express-routescan

This module is an automatic javascript files scanner for Express JS router.

# Installation	
```
$ npm install express-routescan
```

# Usage
Express-routescan module is the simplest way to configure and maintain router for complex express applications. You just have to create a 'routes' folder (default) inside your project and write your routes.

So app structure will be like this:

- app.js
- routes/
	- index.js
	- users.js
	- transaction/
		- submit.js

For correct working you should pass express application into the module as first argument. Example:

```javascript
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

If you want to use another folder for routes, you should use the full path:

```javascript
var fullPath = path.join(__dirname, './path/for/another/routes/folder/insideMyProject');
routescan(app, fullPath);
```

# Route files
In turn, the route file is a file with module.exports like this:

```javascript
/* GET home page. */

var indexFn = function(req, res){
	res.send("It's main page of my app.");
};

module.exports = {
	route: '/',
	callback: indexFn
};
```

_'route'_ and _'callback'_ keys **are required**. Express-routescan ignore invalid routes.

**GET** is default method for route. But you can set optional another _'method'_ (one of HTTP methods described in RFC 2616) and _'middleware'_ function(s):

```javascript
module.exports = {
	method: 'post',
	route: '/myAwesomeRouteForPostRequest',
	middleware: [myMiddlewareFn1, myMiddlewareFn2],
 	callback: function(req, res){
		res.send("It's my awesome answer for POST request.");
	};
};
```

# .routeignore
As was mentioned above express-routescan ignore invalid route-files. Scanner also ignore all _not .js_ files inside routes folder. If you want to ignore _.js_ files you can use _.routeignore_ file inside your routes folder to add ignore rules for scanner.

For example, if you don't want use routes from _'./routes/temp/'_ folder just create _'./routes/.routeignore'_ file with next content:

```
temp/
```


# License
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
