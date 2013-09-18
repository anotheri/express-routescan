/* jslint node: true */
"use strict";

var fs   = require('fs');
var path = require('path');

var HTTPMETHODS = {
    "OPTIONS": true,
    "GET": true,
    "HEAD": true,
    "POST": true,
    "PUT": true,
    "DELETE": true,
    "TRACE": true,
    "CONNECT": true
};

var valides   = [];
var ignored   = [];
var invalides = [];

var ignoreFileName = './.routeignore';
var ignoreFiles    = [];

//regexp
var reIgnoreFiles      = null;
var reEscComments      = /\\#/g;
var reUnescapeComments = /\^\^/g; // note that '^^' is used in place of escaped comments
var reComments         = /#.*$/;
var reTrim             = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
var reEscapeChars      = /[.|\-[\]()\\]/g;
var reAsterisk         = /\*/g;

function initIgnore (dir) {
    var ignoreFile = path.join(dir, ignoreFileName);
    if (fs.existsSync(ignoreFile)) {
        var ignore = fs.readFileSync(ignoreFile).toString().split(/\n/);
        
        for (var i = 0; i < ignore.length; i++) {
            var rule = ignore[i];
            if(rule){
                var noEscape = rule.substr(0,1) === ':';
                if (noEscape) {
                    rule = rule.substr(1);
                }
                addIgnoreRule(rule, noEscape);
            }
        }
    }
}

function addIgnoreRule(line, noEscape) {
    // remove comments and trim lines
    // this mess of replace methods is escaping "\#" to allow for emacs temp files
    if (!noEscape) {
        if (line = line.replace(reEscComments, '^^').replace(reComments, '').replace(reUnescapeComments, '#').replace(reTrim, '')) {
            ignoreFiles.push(line.replace(reEscapeChars, '\\$&').replace(reAsterisk, '.*'));
        }
    } else if (line = line.replace(reTrim, '')) {
        ignoreFiles.push(line);
    }
    reIgnoreFiles = new RegExp(ignoreFiles.join('|'));
}

function initRoutes(app, dir) {
    var routeFiles = fs.readdirSync(dir);
    for (var i = 0, l = routeFiles.length; i < l; i++) {
        var filename = routeFiles[i];
        var pth = path.join(dir, filename);

        var isIgnored = reIgnoreFiles && reIgnoreFiles.test(pth);
        if (isIgnored) {
            ignored.push(pth);
        } else {
            if (fs.statSync(pth).isDirectory()) {
                initRoutes(app, pth);
            } else {
                if (path.extname(filename) === '.js') {
                    addRoute(app, pth);
                } else {
                    ignored.push(pth);
                }
            }
        }
    }
}

function addRoute (app, file) {
    var r = require(file);
    var method = (r && r.method) ? r.method.toLowerCase() : 'get';
    var valid = r !== undefined &&
            typeof r.route === 'string' &&
            typeof r.callback === 'function' &&
            HTTPMETHODS[method.toUpperCase()];

    if (valid) {
        app[method](r.route, r.middleware || [], r.callback);
        valides.push(file);
        
        console.log(' #', method.toUpperCase(), r.route);
    } else {
        invalides.push(file);
    }
}

function printArray (array, before, after) {
    for (var i = 0, l = array.length; i < l; i++) {
        console.log(before || "", array[i], after || "");
    }
}

function printStatInfo(){
    var ROUTED  = ' -> [ROUTED]\t';
    var IGNORED = ' -> [IGNORED]\t';
    var INVALID = ' -> [INVALID]\t';

    printArray(valides, ROUTED);
    printArray(invalides, INVALID);
    printArray(ignored, IGNORED);
}

module.exports = function router (app, directory) {
    console.log('Initializing routes');
    var dir = directory || path.join(__dirname, 'routes');
    
    initIgnore(dir);

    initRoutes(app, dir);

    console.log('Done.');
    
    // printStatInfo();
};