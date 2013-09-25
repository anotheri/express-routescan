/* jslint node: true */
"use strict";

var util = require('util');
var inspectError = require('./inspectError');

/**
 * Function which returns array of valid HTTP methods.
 * @param {Array} methods — array of HTTP methods
 * @param {String} file — full path of route file
 * @param {String} route — route path
 * @return {Array} result — array of valid HTTP methods
 * @param {Array} invalid — array of invalid route objects
 * @param {Boolean} ignoreInvalid — key for ignoring route errors
 */

module.exports = function getValidMethods(methods, file, route, invalid, ignoreInvalid) {
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

    var result = [];
    if (methods && util.isArray(methods)) {
        for (var i = 0, l = methods.length; i < l; i++) {
            var _m = methods[i];
            var m = _m && _m.toLowerCase && _m.toLowerCase();
            if (m && HTTPMETHODS[m]) {
                result.push(m);
            } else {
                inspectError(2, file, route, _m, invalid, ignoreInvalid);
            }
        }
    } else {
        if (methods !== undefined) inspectError(2, file, route, methods, invalid, ignoreInvalid);
    }

    return (result.length > 0) ? result : ['get'];
};