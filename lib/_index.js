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