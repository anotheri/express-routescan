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
 * @param {Object} global — object of global variables and config options
 * @param {Boolean} forced — key for the overriding already existed routes
 */

module.exports = function isRouteValid(route, method, file, global, forced) {
    var validRt = (typeof route === 'string' && route.trim().length > 0) || util.isRegExp(route);
    var validMt = typeof method === 'string' && method.trim().length > 0;
    var validFl = typeof file === 'string' && file.trim().length > 0;
    var validEx = typeof global.valid === 'object' && (!(global.valid[route] && global.valid[route][method]) || forced === true);
    
    var isValid = validRt && validEx && validMt && validFl;

    if (isValid) {
        var validObj = {};
        validObj[method] = file;

        if(!global.valid[route]) {
            global.valid[route] = validObj;
        } else {
            global.valid[route][method] = file;
        }
    } else inspectError(3, file, route, method, global);

    return isValid;
};