/* jslint node: true */
"use strict";

var util = require('util');
var inspectError = require('./inspectError');

/**
 * Function which validates route parameters.
 * @param {String} route — route path
 * @param {Array} methods — array of HTTP methods for route
 * @param {String} file — full path of route file
 * @return {Boolean} isValid — validation result
 * @param {Object} valid — hash object of valid route objects
 * @param {Array} invalid — array of invalid route objects
 * @param {Boolean} ignoreInvalid — key for ignoring route errors
 */

module.exports = function isRouteValid(route, method, file, valid, invalid, ignoreInvalid) {
    var validRt = (typeof route === 'string' && route.trim().length > 0) || util.isRegExp(route);
    var validEx = typeof valid === 'object' && !(valid[route] && valid[route][method]);
    var validMt = typeof method === 'string' && method.trim().length > 0;
    var validFl = typeof file === 'string' && file.trim().length > 0;
    
    var isValid = validRt && validEx && validMt && validFl;

    if (isValid) {
        var validObj = {};
        validObj[method] = file;

        if(!valid[route]) {
            valid[route] = validObj;
        } else {
            valid[route][method] = file;
        }
    } else inspectError(3, file, route, method, invalid, ignoreInvalid);

    return isValid;
};