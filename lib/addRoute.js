/* jslint node: true */
"use strict";

var util            = require('util');
var inspectError    = require('./inspectError');
var getValidMethods = require('./getValidMethods');
var isRouteValid    = require('./isRouteValid');

/**
 * Function which requires route-file and run 'applyRoute' function for every valid route into the file.
 * @param {Object} app — express application object
 * @param {String} file — full path of route file
 * @param {Object} valid — hash object of valid route objects
 * @param {Array} invalid — array of invalid route objects
 * @param {Boolean} ignoreInvalid — key for ignoring route errors
 */
module.exports = function addRoute(app, file, global) {
    /**
     * Function which applies a single route for express application object.
     * @param {Object} app — express application object
     * @param {String} file — full path of route file
     * @param {String} route — route path or RegExp
     * @param {Function} fn — a callback function for route
     * @param {Array} methods — array of HTTP methods for route
     * @param {Function|Array} middleware — middleware function of array of middleware functions
     * @param {Object} valid — hash object of valid route objects
     * @param {Array} invalid — array of invalid route objects
     * @param {Boolean} ignoreInvalid — key for ignoring route errors
     */
    function applyRoute(app, file, route, fn, methods, middleware, global) {
        for (var i = 0, l = methods.length; i < l; i++) {
            var method = methods[i];
            if(isRouteValid(route, method, file, global)){
                app[method](route, middleware, fn);
                console.log(' #', method.toUpperCase(), route);
            }
        }
    }

    var r = require(file);
    var methods;
    if (r !== undefined && typeof r === 'object') {
        for (var route in r) {
            var actions = util.isArray(r[route]) ? r[route] : [r[route]];
            
            for (var i = 0, l = actions.length; i < l; i++) {
                var action = actions[i];

                if (typeof action === 'function') {
                    methods = ['get'];
                    applyRoute(app, file, route, action, methods, [], global);
                } else if (typeof action.fn === 'function') {
                    methods = getValidMethods(action.methods, file, route, global);
                    var _route = (action.regexp && util.isRegExp(action.regexp)) ? action.regexp : route;
                    applyRoute(app, file, _route, action.fn, methods, action.middleware, global);
                } else inspectError(1, file, route, null, global);
            }
        }
    }
};