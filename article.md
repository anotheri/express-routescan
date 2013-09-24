# Maintainable routing for Express with express-routescan.

I think everyone who works with Express and Node, knows something about [ express application routing ][1] and how many lines of code it can take. When you write a test server with few routes it seems OK. But what about maintainable routing in complex web applications?

Of course, you can define callback functions in other files, require the ones and use them like this:

```javascript
var express = require('express');
var app = express();
// ...
app.get('/forum/:fid/thread/:tid', require('./routes/myThread').getFn);
app.post('/forum/:fid/thread/:tid', require('./routes/myThread').postFn);
// and so on
```

But it's not the best way to solve this problem. I wrote a node module that helps me (and, I hope, may help you) to organise maintainable routing for Express application. 

### **[ express-routescan ][2]**

In a few words, you create a folder in your project (it can be also a folder with sub-folders structure) with files that contains route configuration (route, methods, callback function, middleware functions) like this one:

```javascript
'use strict';
module.exports = {
    '/': function(req, res){
        res.send("It's main page of application.");
    }
};
```

Also you can set an array of HTTP methods for one route, an array of middleware functions, use RegExp as route path, define several routes inside one file. 
When routes are ready just run express-routescan with your express application as first argument.

```javascript
var express = require('express');
var routescan = require('express-routescan');
var app = express();
routescan(app);
```

By default scanner works with **./routes/** folder of a project and **.js** files, but you can reconfigure this and some other options. For more information read the [ project homepage ][2].

[1]: http://expressjs.com/api.html#app.VERB
[2]: https://github.com/anotheri/express-routescan