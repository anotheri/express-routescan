/* jslint node: true */
'use strict';

/**
 * Function which inspects invalid files.
 * @param {Int} errCode — code of throwed error
 * @param {String} file — full path of route file
 * @param {String} route — route path
 * @param {String} method — unknown HTTP method
 * @param {Object} global — object of global variables and config options
 */

module.exports = function inspectError(errCode, file, route, method, global) {
    var errMsg;
    var error = {
        code: errCode,
        msg: null,
        file: file,
        route: route,
        method: method
    };

    if (errCode === 0) {
        error.msg = 'The first parameter is required and must be an express application.';
        throw new Error(error.msg);
    } else {
        errMsg = 'File "' + file + '" has wrong definition of the route: "' + route + '".';

        if (errCode === 1) {
            var noFnMsg = '\n\t' + 'It must be a function or an object with `fn` property (in this case `fn` should be a function).';
            error.msg = errMsg + noFnMsg;
        } else if (errCode === 2) {
            var methodMsg = (method) ? '\n\t' + 'The configuration of the one has unknown HTTP method ' + JSON.stringify(method) + '.\n': ' Methods is ' + JSON.stringify(method) + '.';
            error.msg = errMsg + methodMsg;
        } else if (errCode === 3) {
            error.msg = 'File "' + file + '" has definition of the route: ' + JSON.stringify(route) + ' for the ' + JSON.stringify(method)  + ' method that has been already applied to application.';
        } else if (errCode === 4) {
            error.msg = 'File "' + file + '" hasn\'t `module.exports` of the defined route or has a wrong one, e.g. `module.exports = {}`. Use `module.exports` for export the correct route object.';
        } else if (errCode === 5) {
            error.msg = 'Routes directory is wrong. Use correct directory instead of: "' + file + '".';
        }

        if (global.invalid) {
            global.invalid.push(error);
        }
        if (!global.ignoreInvalid) {
            throw new Error(error.msg);
        }

    }

    return error;
};
