var libpath = process.env['ROUTESCAN_COV'] ? '../lib-cov' : '../lib';

var path    = require('path');
var fs      = require('fs');
var should  = require('should');
var assert  = require('assert');
var express = require('express');

var initRoutes = require(libpath + '/initRoutes');

describe('Test initRoutes function', function() {
    var wrongValues = [undefined, null, NaN, '', '  ', ' \n', 12, {"a": 1}];    

    it("should exists", function() {
        should.exist(initRoutes);
    });
    
    describe('if ignoreInvalid is `false`', function() {

        it('should throw en error if `dir` is wrong', function () {
            var app = express();
            var global = {
                extentions: ['.js'],
                ignoreInvalid: false,
                valid: {},
                invalid: [],
                ignored: []
            };

            for (var i = 0; i < wrongValues.length; i++) {
                (function() {
                    initRoutes(app, wrongValues[i], global);
                }).should.throw();
            }
        });

        it('should recursively scan `dir` folder and throw en error for first wrong file', function () {
            var app = express();
            var global = {
                extentions: ['.js'],
                ignoreInvalid: false,
                valid: {},
                invalid: [],
                ignored: []
            };

            (function function_name (argument) {
                initRoutes(app, path.join(__dirname, './routes/'), global);
            }).should.throw();


            (function function_name (argument) {
                initRoutes();
            }).should.throw();
        });

    });

    describe('if ignoreInvalid is `true`', function() {

        it('should throw en error  if `dir` is wrong', function () {
            var app = express();
            var global = {
                extentions: ['.js'],
                ignoreInvalid: true,
                valid: {},
                invalid: [],
                ignored: []
            };

            for (var i = 0; i < wrongValues.length; i++) {
                (function function_name (argument) {
                    initRoutes(app, wrongValues[i], global);
                }).should.throw();
            }
        });

        describe('test for [".js"] extentions', function() {

            var app = express();
            var global = {
                extentions: ['.js'],
                ignoreInvalid: true,
                valid: {},
                invalid: [],
                ignored: []
            };

            it('should not throw any error if all arguments is correct', function () {
                (function function_name (argument) {
                    initRoutes(app, path.join(__dirname, './routes/'), global);
                }).should.not.throw();
            });

            it('should correct push into `global.valid`', function () {
                Object.keys(global.valid).should.lengthOf(6);
            });

            it('should correct push into `global.invalid`', function () {
                global.invalid.should.lengthOf(11);
            });

            it('should correct push into `global.ignored`', function () {
                global.ignored.should.lengthOf(5);
            });

        });

        describe('test for [".rt"] extentions', function() {

            var app = express();
            var global = {
                extentions: ['.rt'],
                ignoreInvalid: true,
                valid: {},
                invalid: [],
                ignored: []
            };

            it('should not throw any error if all arguments is correct', function () {
                (function function_name (argument) {
                    initRoutes(app, path.join(__dirname, './routes/'), global);
                }).should.not.throw();
            });

            it('should correct push into `global.valid`', function () {
                Object.keys(global.valid).should.lengthOf(2);
            });

            it('should correct push into `global.invalid`', function () {
                global.invalid.should.lengthOf(0);
            });

            it('should correct push into `global.ignored`', function () {
                global.ignored.should.lengthOf(11);
            });

        });

        describe('test for [".js", ".rt"] extentions', function() {

            var app = express();
            var global = {
                extentions: ['.js', '.rt'],
                ignoreInvalid: true,
                valid: {},
                invalid: [],
                ignored: []
            };

            it('should not throw any error if all arguments is correct', function () {
                (function function_name (argument) {
                    initRoutes(app, path.join(__dirname, './routes/'), global);
                }).should.not.throw();
            });

            it('should correct push into `global.valid`', function () {
                Object.keys(global.valid).should.lengthOf(8);
            });

            it('should correct push into `global.invalid`', function () {
                global.invalid.should.lengthOf(11);
            });

            it('should correct push into `global.ignored`', function () {
                global.ignored.should.lengthOf(3);
            });

        });
    
    });

});