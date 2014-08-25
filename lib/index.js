/* jslint node: true */
'use strict';

var fs   = require('fs');
var path = require('path');
var util = require('util');

var inspectError = require('./inspectError');
var printAll     = require('./printAll');
var initRoutes   = require('./initRoutes');

var isntTest = !process.env['ROUTESCAN_TEST'];

/**
 * Function which initialises configuration, .routeignore file and route files. Main function of module.
 * @param {Object} app — express application object
 * @param {Object} opts — object with extra options
 */
module.exports = function router(app, opts) {
    if (!app) {
        inspectError(0);
    }

    opts = opts || {};

    var defaultExt = ['.js'],
        projDir = (isntTest) ?
            path.join(__dirname, '../../../') :
            path.join(__dirname, '../test/'),
        defaultDir = path.join(projDir, '/routes'),
        ds = [],
        d  = opts.directory,
        i,
        l;

    opts.valid      = {};
    opts.invalid    = [];
    opts.ignored    = [];
    opts.overridden = [];

    opts.extentions    = (!util.isArray(opts.ext)) ? opts.ext ? [opts.ext] : defaultExt : opts.ext;
    opts.ignoreInvalid = opts.ignoreInvalid || false;

    /* if strictMode is 'true' routes with methods 'all' and 'use' are invalid; */
    opts.strictMode    = opts.strictMode || false;

    if (!util.isArray(d)) {
        ds = (typeof d === 'string') ? [ path.resolve(projDir, d) ] : [ defaultDir ];
    } else {
        for ( i = 0, l = d.length; i < l; i++) {
            if (typeof d[i] === 'string') {
                ds.push(path.resolve(projDir, d[i]));
            }
        }
    }

    if (isntTest) {
        console.log('Initialized routes:');
    }

    for (i = 0, l = ds.length; i < l; i++) {
        initRoutes(app, ds[i], opts);
    }

    if (opts.deferreds) {
        var defs = opts.deferreds;
        for (i = 0, l = defs.length; i < l; i++) {
            var def = defs[i];
            if (def && def.fn && 'function' === typeof def.fn) {
                app[def.method](def.fn);
                if (isntTest) {
                    console.log(' #', def.method.toUpperCase(), def.route);
                }
            }
        }
    }

    if (opts.verbose) {
        printAll(opts);
    }

    if (isntTest) {
        console.log('Done.');
    }
};
