/* jslint node: true */
'use strict';

var fs              = require('fs');
var path            = require('path');
var inspectError    = require('./inspectError');
var getValidMethods = require('./getValidMethods');
var isRouteValid    = require('./isRouteValid');
var addRoute        = require('./addRoute');

/**
 * Function for recursively scan and initializing of route files inside 'dir' folder and subfolders.
 * @param {Object} app — express application object
 * @param {String} dir — full path of scanned directory
 * @param {Object} global — object of global variables and config options
 */

module.exports = function initRoutes(app, dir, global) {
    function initR(app, dir) {

        var allFiles = fs.readdirSync(dir);
        var subdirs = [];

        for (var i = 0, l = allFiles.length; i < l; i++) {
            var p = path.join(dir, allFiles[i]);

            if (reIgnoreFiles && reIgnoreFiles.test(p)) {
                global.ignored.push(p);
            } else {
                if (fs.statSync(p).isDirectory()) {
                    subdirs.push(p);
                } else {
                    if (global.extentions.some(function (ext) { return ext === path.extname(p); })) {
                        addRoute(app, p, global);
                    } else {
                        global.ignored.push(p);
                    }
                }
            }
        }

        for (var j = 0, len = subdirs.length; j < len; j++) {
            initR(app, subdirs[j]);
        }
    }

    if(typeof dir === 'string' && fs.existsSync(dir)) {
        var initIgnore    = require('./initIgnore');
        var reIgnoreFiles = initIgnore(dir);


        initR(app, dir);
    } else {
        return inspectError(5, dir, null, null, global);
    }
};
