/* jslint node: true */
"use strict";

var fs   = require('fs');
var path = require('path');
var util = require('util');

var valid   = {};
var invalid = [];
var ignored = [];

var defaultExt     = ['.js'];
var extentions     = [];
var defaultFolder  = path.join(__dirname, '../../routes');


/**
 * Function for recursively scan and initializing of route files inside 'dir' folder and subfolders.
 * @param {Object} app — express application object
 * @param {String} dir — full path of scanned directory
 */
function initRoutes(app, dir) {
    var allFiles = fs.readdirSync(dir);
    var subdirs = [];

    for (var i = 0, l = allFiles.length; i < l; i++) {
        var p = path.join(dir, allFiles[i]);

        if (reIgnoreFiles && reIgnoreFiles.test(p)) {
            ignored.push(p);
        } else {
            if (fs.statSync(p).isDirectory()) {
                subdirs.push(p);
            } else {
                if (extentions.some(function (ext) { return ext === path.extname(p); })) {
                    addRoute(app, p);
                } else {
                    ignored.push(p);
                }
            }
        }
    }

    for (var j = 0, len = subdirs.length; j < len; j++) {
        initRoutes(app, subdirs[j]);
    }
}


/**
 * Function which initialises configuration, .routeignore file and route files. Main function of module.
 * @param {Object} app — express application object
 * @param {Object} opts — object with extra options
 */
module.exports = function router(app, opts) {
    if (!app) inspectError(0);
    
    if (!opts) opts = {};
    
    var dir       = path.resolve(__dirname, "../../", opts.directory) || defaultFolder;
    ignoreInvalid = opts.ignoreInvalid || false;
    extentions    = (!util.isArray(opts.ext)) ? opts.ext ? [opts.ext] : defaultExt : opts.ext;

    initIgnore(dir);
    
    console.log('Initialized routes:');
    initRoutes(app, dir);
    
    if (opts.verbose) printAll(valid, invalid, ignored);
    console.log('Done.');
};