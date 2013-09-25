var path   = require('path');
var fs     = require('fs');
var should = require('should');
var assert = require('assert');

var isRouteValid = require('../lib/isRouteValid');

describe('Test isRouteValid function', function() {
    var validMethods = ['all', 'options', 'get', 'head', 'post', 'put', 'delete', 'trace'];
    var wrongValues  = [undefined, null, NaN, '', '  ', ' \n', 12, 3, {"a": 1}];
    var file         = "/path/to/file";
    var method       = 'get';

    it("should exists", function() {
        should.exist(isRouteValid);
    });

    describe('if ignoreInvalid is `true`', function() {
        var ignoreInvalid = true;
        var valid = {};
        var invalid = [];

        it("should return `true` if types of `route` and `method` are Strings with some characters", function() {
            var valid = {};
            var invalid = [];

            var route = "/";
            var method = 'get';
            isRouteValid(route, method, file, valid, invalid, ignoreInvalid).should.be.true;

            Object.keys(valid).should.have.lengthOf(1);
            invalid.should.have.lengthOf(0);
        });

        it("should return `true` if type of route is RegExp", function() {
            var valid = {};
            var invalid = [];

            var route = /abc/;
            isRouteValid(route, method, file, valid, invalid, ignoreInvalid).should.be.true;

            Object.keys(valid).should.have.lengthOf(1);
            invalid.should.have.lengthOf(0);
        });

        it("should return `false` if route is wrong value", function() {
            var valid = {};
            var invalid = [];

            for (var i = 0; i < wrongValues.length; i++) {
                isRouteValid(wrongValues[i], method, file, valid, invalid, ignoreInvalid).should.be.false;
            }

            Object.keys(valid).should.have.lengthOf(0);
            invalid.should.have.lengthOf(wrongValues.length);
        });

        it("should return `false` if method is wrong value", function() {
            var valid = {};
            var invalid = [];
            var route = '/';

            for (var i = 0; i < wrongValues.length; i++) {
                isRouteValid(route, wrongValues[0], file, valid, invalid, ignoreInvalid).should.be.false;
            }

            Object.keys(valid).should.have.lengthOf(0);
            invalid.should.have.lengthOf(wrongValues.length);
        });

        it("should return `false` if file is wrong value", function() {
            var valid = {};
            var invalid = [];
            var route = '/';
            var method = 'get';


            for (var i = 0; i < wrongValues.length; i++) {
                isRouteValid(route, method, wrongValues[0], valid, invalid, ignoreInvalid).should.be.false;
            }

            Object.keys(valid).should.have.lengthOf(0);
            invalid.should.have.lengthOf(wrongValues.length);
        });

        it("should return `false` if route is already applied to app", function() {
            var valid = {};
            var invalid = [];

            var route = "/";
            var method = 'get';
            isRouteValid(route, method, file, valid, invalid, ignoreInvalid).should.be.true;
            isRouteValid(route, method, file, valid, invalid, ignoreInvalid).should.be.false;
            isRouteValid(route, method, file, valid, invalid, ignoreInvalid).should.be.false;
            
            Object.keys(valid).should.have.lengthOf(1);
            invalid.should.have.lengthOf(2);
        });

    });
    
    //TODO
    /*describe('if ignoreInvalid is `false`', function() {
        var ignoreInvalid = false;

    });*/
});