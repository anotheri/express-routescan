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

        it("should return `true` if types of `route` and `method` are Strings with some characters", function() {
            var global = {
                ignoreInvalid: ignoreInvalid,
                valid: {},
                invalid: []
            };

            var route = "/";
            var method = 'get';
            isRouteValid(route, method, file, global).should.be.true;

            Object.keys(global.valid).should.have.lengthOf(1);
            global.invalid.should.have.lengthOf(0);
        });

        it("should return `true` if type of route is RegExp", function() {
            var global = {
                ignoreInvalid: ignoreInvalid,
                valid: {},
                invalid: []
            };

            var route = /abc/;
            isRouteValid(route, method, file, global).should.be.true;

            Object.keys(global.valid).should.have.lengthOf(1);
            global.invalid.should.have.lengthOf(0);
        });

        it("should return `false` if route is wrong value", function() {
            var global = {
                ignoreInvalid: ignoreInvalid,
                valid: {},
                invalid: []
            };

            for (var i = 0; i < wrongValues.length; i++) {
                isRouteValid(wrongValues[i], method, file, global).should.be.false;
            }

            Object.keys(global.valid).should.have.lengthOf(0);
            global.invalid.should.have.lengthOf(wrongValues.length);
        });

        it("should return `false` if method is wrong value", function() {
            var global = {
                ignoreInvalid: ignoreInvalid,
                valid: {},
                invalid: []
            };
            var route = '/';

            for (var i = 0; i < wrongValues.length; i++) {
                isRouteValid(route, wrongValues[0], file, global).should.be.false;
            }

            Object.keys(global.valid).should.have.lengthOf(0);
            global.invalid.should.have.lengthOf(wrongValues.length);
        });

        it("should return `false` if file is wrong value", function() {
            var global = {
                ignoreInvalid: ignoreInvalid,
                valid: {},
                invalid: []
            };
            var route = '/';
            var method = 'get';


            for (var i = 0; i < wrongValues.length; i++) {
                isRouteValid(route, method, wrongValues[0], global).should.be.false;
            }

            Object.keys(global.valid).should.have.lengthOf(0);
            global.invalid.should.have.lengthOf(wrongValues.length);
        });

        it("should return `false` if route is already applied to app", function() {
            var global = {
                ignoreInvalid: ignoreInvalid,
                valid: {},
                invalid: []
            };

            var route = "/";
            var method = 'get';
            isRouteValid(route, method, file, global).should.be.true;
            isRouteValid(route, method, file, global).should.be.false;
            isRouteValid(route, method, file, global).should.be.false;
            
            Object.keys(global.valid).should.have.lengthOf(1);
            global.invalid.should.have.lengthOf(2);
        });
    });
    
    describe('if ignoreinvalid is `false`', function() {
        var ignoreInvalid = false;

        it("should return `true` if types of `route` and `method` are Strings with some characters", function() {
            var global = {
                ignoreInvalid: ignoreInvalid,
                valid: {},
                invalid: []
            };

            var route = "/";
            var method = 'get';
            isRouteValid(route, method, file, global).should.be.true;

            Object.keys(global.valid).should.have.lengthOf(1);
            global.invalid.should.have.lengthOf(0);
        });

        it("should return `true` if type of route is RegExp", function() {
            var global = {
                ignoreInvalid: ignoreInvalid,
                valid: {},
                invalid: []
            };

            var route = /abc/;
            isRouteValid(route, method, file, global).should.be.true;

            Object.keys(global.valid).should.have.lengthOf(1);
            global.invalid.should.have.lengthOf(0);
        });

        it("should throw an error if route is wrong value", function() {
            var global = {
                ignoreInvalid: ignoreInvalid,
                valid: {},
                invalid: []
            };

            for (var i = 0; i < wrongValues.length; i++) {
                (function(){
                    isRouteValid(wrongValues[i], method, file, global);
                }).should.throw();
            }

            Object.keys(global.valid).should.have.lengthOf(0);
            global.invalid.should.have.lengthOf(wrongValues.length);
        });

        it("should throw an error if method is wrong value", function() {
            var global = {
                ignoreInvalid: ignoreInvalid,
                valid: {},
                invalid: []
            };
            var route = '/';

            for (var i = 0; i < wrongValues.length; i++) {
                (function(){
                    isRouteValid(route, wrongValues[0], file, global);
                }).should.throw();
            }

            for (var i = 0; i < wrongValues.length; i++) {
            }

            Object.keys(global.valid).should.have.lengthOf(0);
            global.invalid.should.have.lengthOf(wrongValues.length);
        });

        it("should throw an error if file is wrong value", function() {
            var global = {
                ignoreInvalid: ignoreInvalid,
                valid: {},
                invalid: []
            };
            var route = '/';
            var method = 'get';


            for (var i = 0; i < wrongValues.length; i++) {
                (function(){
                    isRouteValid(route, method, wrongValues[0], global);
                }).should.throw();
            }

            Object.keys(global.valid).should.have.lengthOf(0);
            global.invalid.should.have.lengthOf(wrongValues.length);
        });

        it("should throw an error if route is already applied to app", function() {
            var global = {
                ignoreInvalid: ignoreInvalid,
                valid: {},
                invalid: []
            };

            var route = "/";
            var method = 'get';
            (function(){
                isRouteValid(route, method, file, global).should.be.true;
            }).should.not.throw();
            (function(){
                isRouteValid(route, method, file, global).should.be.false;
                isRouteValid(route, method, file, global).should.be.false;
            }).should.throw();
            Object.keys(global.valid).should.have.lengthOf(1);
            global.invalid.should.have.lengthOf(1);
        });
    });
});