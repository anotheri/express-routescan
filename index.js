/* jslint node: true */
"use strict";

var fs   = require('fs');
var path = require('path');
var util = require('util');

var valid   = {};
var invalid = [];
var ignored = [];


var HTTPMETHODS = {
    "all":     true,
    "options": true,
    "get":     true,
    "head":    true,
    "post":    true,
    "put":     true,
    "delete":  true,
    "trace":   true,
    "connect": false /* HTTP CONNECT method is unknown function for Express */
};

var defaultExt     = ['.js'];
var extentions     = [];
var defaultFolder  = path.join(__dirname, '../../routes');
var ignoreFileName = './.routeignore';
var ignoreFiles    = [];
var ignoreInvalid  = false;

//regexp
var reIgnoreFiles      = null;
var reEscComments      = /\\#/g;
var reUnescapeComments = /\^\^/g; /* note that '^^' is used in place of escaped comments */
var reComments         = /#.*$/;
var reTrim             = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
var reEscapeChars      = /[.|\-[\]()\\]/g;
var reAsterisk         = /\*/g;


/**
 * Function for initialisation rules of '.routeignore' file.
 * @param {String} dir — full path of routes folder
 */
function initIgnore(dir) {
    var ignoreFile = path.join(dir, ignoreFileName);
    if (fs.existsSync(ignoreFile)) {
        var ignore = fs.readFileSync(ignoreFile).toString().split(/\n/);
        
        for (var i = 0; i < ignore.length; i++) {
            var rule = ignore[i];
            if(rule){
                var noEscape = rule.substr(0,1) === ':';
                if (noEscape) {
                    rule = rule.substr(1);
                }
                addIgnoreRule(rule, noEscape);
            }
        }
    }
}

/**
 * Function which adds a single rule of '.routeignore' file.
 * @param {String} line — single line of '.routeignore' file
 * @param {Boolean} noEscape — boolean for noEscape
 */
function addIgnoreRule(line, noEscape) {
    if (!noEscape) {
        if (line = line.replace(reEscComments, '^^').replace(reComments, '').replace(reUnescapeComments, '#').replace(reTrim, '')) {
            ignoreFiles.push(line.replace(reEscapeChars, '\\$&').replace(reAsterisk, '.*'));
        }
    } else if (line = line.replace(reTrim, '')) {
        ignoreFiles.push(line);
    }
    reIgnoreFiles = new RegExp(ignoreFiles.join('|'));
}

/**
 * Function which inspects invalid files.

 * @param {Int} errCode — code of throwed error
 * @param {String} file — full path of route file
 * @param {String} route — route path
 * @param {String} method — unknown HTTP method
 */
function inspectError(errCode, file, route, method) {
    var inspMsg = file + '\twith route: ' + route;
    var errMsg = 'File "' + file + '" has wrong definition of the route: "' + route + '".';
    var noFnMsg = '\n\t' + 'It must be a function or an object with `fn` property.';
    var methodMsg = (method) ? '\n\t' + 'The configuration of the one has unknown HTTP method \"' + method + '\".\n': '';
    var existMsg = 'File "' + file + '" has definition of the route: "' + route + '" for the "' + method.toUpperCase() + '" method that has been already applied to application.';


    var error = {
        code: 3,
        msg: null,
        file: file,
        route: route,
        method: method
    };

    if (errCode === 0) {
        error.msg = ' The first parameter is required and must be an express application.';
        throw new Error(error.msg);
    } else {
        if (errCode === 1) {
            error.msg = errMsg + noFnMsg;
        } else if (errCode === 2) {
            error.msg = errMsg + methodMsg;
        } else if (errCode === 3) {
            error.msg = existMsg;
        }

        invalid.push(error);
        if (!ignoreInvalid) throw new Error(error.msg);
    }
}

/**
 * Function for recursively scan and initializing of route files inside 'dir' folder and subfolders.
 * @param {Object} app — express application object
 * @param {String} dir — full path of scanned directory
 */
function initRoutes(app, dir) {
    var allFiles = fs.readdirSync(dir);
    var subdirs = [];

    for (var i = 0, l = allFiles.length; i < l; i++) {
        var p = path.join(dir, allFiles[i]);

        if (reIgnoreFiles && reIgnoreFiles.test(p)) {
            ignored.push(p);
        } else {
            if (fs.statSync(p).isDirectory()) {
                subdirs.push(p);
            } else {
                if (extentions.some(function (ext) { return ext === path.extname(p); })) {
                    addRoute(app, p);
                } else {
                    ignored.push(p);
                }
            }
        }
    }

    for (var j = 0, len = subdirs.length; j < len; j++) {
        initRoutes(app, subdirs[j]);
    }
}

/**
 * Function which returns array of valid HTTP methods.
 * @param {Array} methods — array of HTTP methods
 * @return {Array} result — array of valid HTTP methods
 */
function getValidMethods(methods, route, file) {
    var result = [];
    if (methods && util.isArray(methods)) {
        for (var i = 0, l = methods.length; i < l; i++) {
            var m = methods[i].toLowerCase();
            if (HTTPMETHODS[m]) {
                result.push(m);
            } else {
                inspectError(2, file, route, m);
            }
        }
    } else {
        result = ['get'];
    }

    return result;
}


/**
 * Function which validates route parameters.
 * @param {String} route — route path
 * @param {Function} fn — a callback function for route
 * @param {Array} methods — array of HTTP methods for route
 * @param {String} file — full path of route file
 * @return {Boolean} isValid — validation result
 */
function isRouteValid(route, fn, method, file) {
    var validRt = typeof route === 'string' || util.isRegExp(route);
    var validEx = !(valid[route] && valid[route][method]);
    
    var isValid = validRt && validEx;

    if (isValid) {
        var validObj = {};
        validObj[method] = file;

        if(!valid[route]) {
            valid[route] = validObj;
        } else {
            valid[route][method] = file;
        }
    } else inspectError(3, file, route, method);

    return isValid;
}

/**
 * Function which requires route-file and run 'applyRoute' function for every valid route into the file.
 * @param {Object} app — express application object
 * @param {String} file — full path of route file
 */
function addRoute(app, file) {
    var r = require(file);
    var methods;
    if (r !== undefined && typeof r === 'object') {
        for (var route in r) {
            var actions = util.isArray(r[route]) ? r[route] : [r[route]];
            
            for (var i = 0, l = actions.length; i < l; i++) {
                var action = actions[i];

                if (typeof action === 'function') {
                    methods = ['get'];
                    applyRoute(app, file, route, action, methods);
                } else if (typeof action.fn === 'function') {
                    methods = getValidMethods(action.methods, route, file);
                    var _route = (action.regexp && util.isRegExp(action.regexp)) ? action.regexp : route;
                    applyRoute(app, file, _route, action.fn, methods, action.middleware);
                } else inspectError(1, file, route);
            }
        }
    }
}

/**
 * Function which applies a single route for express application object.
 * @param {Object} app — express application object
 * @param {String} file — full path of route file
 * @param {String} route — route path or RegExp
 * @param {Function} fn — a callback function for route
 * @param {Array} methods — array of HTTP methods for route
 * @param {Function|Array} middleware — middleware function of array of middleware functions
 */
function applyRoute(app, file, route, fn, methods, middleware) {
    for (var i = 0, l = methods.length; i < l; i++) {
        var method = methods[i];
        if(isRouteValid(route, fn, method, file)){
            app[method](route, middleware || [], fn);
            console.log(' #', method.toUpperCase(), route);
        }
    }
}

/**
 * Function which prints into console array information about valid routes.
 */
function printValid() {
    if (Object.keys(valid).length > 0) {
        var counter = 1;
        console.log('[routed]:');
        for (var route in valid) {
            for (var method in valid[route]) {
                var file = valid[route][method];
                console.log(counter++ + '.', file, '\t', method.toUpperCase(), '\t', route);
            }
        }
        // console.log('[routed]: ' + JSON.stringify(valid, null, '\t'));
    }
}

/**
 * Function which prints into console error messages about invalid routes.
 */
function printInvalid() {
    if (invalid.length > 0) {
        console.log('\n[invalid]:');
        for (var i = 0, l = invalid.length; i < l; i++) {
            console.log(i+1 + ". " + invalid[i].msg);
        }
        
    }
    // console.log(JSON.stringify(invalid, null, '\t'));
}

/**
 * Function which prints into console array of ignored files.
 */
function printIgnored() {
    if (ignored.length > 0) {
        console.log('\n[ignored]:');
        for (var i = 0, l = ignored.length; i < l; i++) {
            console.log(i+1 + ". " + ignored[i]);
        }
    }
}

/**
 * Function which initialises configuration, .routeignore file and route files. Main function of module.
 * @param {Object} app — express application object
 * @param {Object} opts — object with extra options
 */
module.exports = function router(app, opts) {
    if (!app) inspectError(0);
    
    if (!opts) opts = {};
    
    var dir       = opts.directory || defaultFolder;
    ignoreInvalid = opts.ignoreInvalid || false;
    extentions    = (!util.isArray(opts.ext)) ? opts.ext ? [opts.ext] : defaultExt : opts.ext;

    initIgnore(dir);
    
    console.log('Initialized routes:');
    initRoutes(app, dir);
    
    if (opts.verbose) {
        console.log('\nStatistic info:');
        printValid();
        printInvalid();
        printIgnored();
    }
    console.log('Done.');
};