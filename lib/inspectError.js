/* jslint node: true */
"use strict";

/**
 * Function which inspects invalid files.
 * @param {Int} errCode — code of throwed error
 * @param {String} file — full path of route file
 * @param {String} route — route path
 * @param {String} method — unknown HTTP method
 */

module.exports = function inspectError(errCode, file, route, method) {
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
};