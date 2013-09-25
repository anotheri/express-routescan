/* jslint node: true */
"use strict";

/**
 * Function which inspects invalid files.
 * @param {Int} errCode — code of throwed error
 * @param {String} file — full path of route file
 * @param {String} route — route path
 * @param {String} method — unknown HTTP method
 * @param {Array} invalid — array of invalid route objects
 * @param {Boolean} ignoreInvalid — key for ignoring route errors
 */

module.exports = function inspectError(errCode, file, route, method, invalid, ignoreInvalid) {
    var errMsg = 'File "' + file + '" has wrong definition of the route: "' + route + '".';

    var error = {
        code: errCode,
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
            var noFnMsg = '\n\t' + 'It must be a function or an object with `fn` property.';
            error.msg = errMsg + noFnMsg;
        } else if (errCode === 2) {
            var methodMsg = (method) ? '\n\t' + 'The configuration of the one has unknown HTTP method ' + JSON.stringify(method) + '.\n': ' Methods is ' + JSON.stringify(method) + '.';
            error.msg = errMsg + methodMsg;
        } else if (errCode === 3) {
            error.msg = 'File "' + file + '" has definition of the route: ' + JSON.stringify(route) + ' for the ' + JSON.stringify(method)  + ' method that has been already applied to application.';
        }

        if (invalid) invalid.push(error);
        if (!ignoreInvalid) throw new Error(error.msg);
    }

    return error;
};