/* jslint node: true */
'use strict';

var path = require('path');
var fs   = require('fs');

/**
 * Function for initialisation rules of '.routeignore' file.
 * @param {String} dir — full path of routes folder
 */

module.exports = function initIgnore(dir) {

    var ignoreFileName     = './.routeignore';
    var ignoreFiles        = [];

    var reIgnoreFiles      = null;
    var reEscComments      = /\\#/g;
    var reUnescapeComments = /\^\^/g; /* note that '^^' is used in place of escaped comments */
    var reComments         = /#.*$/;
    var reTrim             = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
    var reEscapeChars      = /[.|\-[\]()\\]/g;
    var reAsterisk         = /\*/g;

    var ignoreFile = path.join(dir, ignoreFileName);

    /**
     * Function which adds a single rule of '.routeignore' file.
     * @param {String} line — single line of '.routeignore' file
     * @param {Boolean} noEscape — boolean for noEscape
     */
    function addIgnoreRule(line, noEscape) {
        if (!noEscape) {
            if (line = line.replace(reEscComments, '^^').replace(reComments, '').replace(reUnescapeComments, '#').replace(reTrim, '')) {
                ignoreFiles.push(line.replace(reEscapeChars, '\\$&').replace(reAsterisk, '.*'));
            }
        } else if (line = line.replace(reTrim, '')) {
            ignoreFiles.push(line);
        }
        reIgnoreFiles = new RegExp(ignoreFiles.join('|'));
    }

    if (fs.existsSync(ignoreFile)) {
        var ignore = fs.readFileSync(ignoreFile).toString().split(/\n/);

        for (var i = 0; i < ignore.length; i++) {
            var rule = ignore[i].trim();
            if(rule){
                var noEscape = rule.substr(0,1) === ':';
                if (noEscape) {
                    rule = rule.substr(1);
                }
                addIgnoreRule(rule, noEscape);
            }
        }
    }

    return reIgnoreFiles;
};
