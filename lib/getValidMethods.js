/* jslint node: true */
'use strict';

var util = require('util');
var inspectError = require('./inspectError');

/**
 * Function which returns array of valid HTTP methods.
 * @param {Array} methods — array of HTTP methods
 * @param {String} file — full path of route file
 * @param {String} route — route path
 * @return {Array} result — array of valid HTTP methods
 * @param {Object} global — object of global variables and config options
 */

module.exports = function getValidMethods(methods, file, route, global) {
    var HTTPMETHODS = {
        'all':         global ? !global.strictMode : true,
        'use':         global ? !global.strictMode : true,

        /*RFC 2616*/
        'get':         true,
        'post':        true,
        'put':         true,
        'head':        true,
        'delete':      true,
        'options':     true,
        'trace':       true,

        /*RFC 2518*/
        'propfind':    true,
        'proppatch':   true,
        'copy':        true,
        'lock':        true,
        'mkcol':       true,
        'move':        true,
        'unlock':      true,

        /*RFC 3253*/
        'report':      true,
        'checkout':    true,
        'mkactivity':  true,
        'merge':       true,

        /*WebDAV*/
        'notify':      true,
        'subscribe':   true,
        'unsubscribe': true,

        /*draft-dusseault-http-patch*/
        'patch':       true,

        /*OTHER*/
        'm-search':    true,
    };

    var result = [];
    if (methods && util.isArray(methods)) {
        for (var i = 0, l = methods.length; i < l; i++) {
            var _m = methods[i];
            var m = _m && _m.toLowerCase && _m.toLowerCase();
            if (m && HTTPMETHODS[m]) {
                result.push(m);
            } else {
                inspectError(2, file, route, _m, global);
            }
        }
    } else if (methods !== undefined) {
        inspectError(2, file, route, methods, global);    
    }

    return (result.length > 0) ? result : ['get'];
};
