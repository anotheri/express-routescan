/* jslint node: true */
"use strict";

var util = require('util');
var inspectError = require('./inspectError');

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

/**
 * Function which returns array of valid HTTP methods.
 * @param {Array} methods — array of HTTP methods
 * @param {String} route — route path
 * @param {String} file — full path of route file
 * @return {Array} result — array of valid HTTP methods
 */

module.exports = function getValidMethods(methods, route, file) {
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
};