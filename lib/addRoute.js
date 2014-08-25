/* jslint node: true */
"use strict";

var util            = require('util');
var inspectError    = require('./inspectError');
var getValidMethods = require('./getValidMethods');
var isRouteValid    = require('./isRouteValid');

var isntTest = !process.env['ROUTESCAN_TEST'];

/**
 * Function which requires route-file and run 'applyRoute' function for every valid route into the file.
 * @param {Object} app — express application object
 * @param {String} file — full path of route file
 * @param {Object} valid — hash object of valid route objects
 * @param {Object} global — object of global variables and config options
 */
module.exports = function addRoute(app, file, global) {
    /**
     * Function which cleans existed routes.
     * @param {Array} arr — array of existed routes which should be cleaned
     * @param {String} prop — property name which should be checked with 'route'
     * @param {String} route — route path or RegExp
     * @param {Boolean} forced — it shows should be route applied with overriting or not
     * @param {String} previous — already existed valid route with same method
     */
    function cleanExisted (arr, prop, route, forced, previous) {
        //clear existed routes
        if (forced === true) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[j][prop] === route){
                    arr.splice(j, 1);
                    if (previous) global.overridden[previous] = file;
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
     * @param {Object} action — route object (with middleware, forced, locked options)
     * @param {Object} global — object of global variables and config options
     */
    function applyRoute(app, file, route, fn, methods, action, global) {
        var middleware = (action && action.middleware) ? action.middleware : [];
        var forced     = (action && action.forced)   ? action.forced   : false;
        var locked     = (action && action.locked)   ? action.locked   : false;
        var deferred   = (action && action.deferred) ? action.deferred : false;

        for (var i = 0, l = methods.length; i < l; i++) {
            var method = methods[i];
            var vr = global.valid[route];
            var previous = (vr && vr[method]) ? vr[method].file : null;
            if (isRouteValid(route, method, file, global, forced, locked)) {

                if (method === 'use') {
                    if (deferred) {
                        if (!global.deferreds) global.deferreds = [];
                        cleanExisted(global.deferreds, 'route', route, forced, previous);
                        global.deferreds.push({
                            route:  route,
                            method: method,
                            forced: forced,
                            fn:     fn
                        });
                    } else {
                        app[method](fn);
                    }
                } else {
                    if (app.routes) {
                        cleanExisted(app.routes[method], 'path', route, forced, previous);
                    }
                    app[method](route, middleware || [], fn);
                }

                if (isntTest && forced !== true && deferred !== true) {
                    console.log(' #', method.toUpperCase(), route);
                }
            }
        }
    }

    var r = require(file);
    var methods;
    if (r !== undefined && typeof r === 'object' && Object.keys(r).length > 0) {
        for (var route in r) {
            var actions = util.isArray(r[route]) ? r[route] : [r[route]];

            for (var i = 0, l = actions.length; i < l; i++) {
                var action = actions[i];

                if (action && typeof action === 'function') {
                    methods = ['get'];
                    applyRoute(app, file, route, action, methods, null, global);
                } else if (action && typeof action.fn === 'function') {
                    methods = getValidMethods(action.methods, file, route, global);
                    var _route = (action.regexp && util.isRegExp(action.regexp)) ? action.regexp : route;
                    applyRoute(app, file, _route, action.fn, methods, action, global);
                } else inspectError(1, file, route, null, global);
            }
        }
    } else {
        inspectError(4, file, null, null, global);
    }
};
