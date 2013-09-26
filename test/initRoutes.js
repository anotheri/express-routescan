var libpath = process.env['ROUTESCAN_COV'] ? '../lib-cov' : '../lib';

var path    = require('path');
var fs      = require('fs');
var should  = require('should');
var assert  = require('assert');
var express = require('express');

var initRoutes = require(libpath + '/initRoutes');

describe('Test initRoutes function', function() {
    var wrongValues = [undefined, null, NaN, '', '  ', ' \n', 12, 3, {"a": 1}];
    

    it("should exists", function() {
        should.exist(initRoutes);
    });
    
    describe('if ignoreInvalid is `false`', function() {

        var global = {
            ignoreInvalid: false,
            valid: {},
            invalid: [],
            ignored: []
        };

    });

    describe('if ignoreInvalid is `true`', function() {

    });

});