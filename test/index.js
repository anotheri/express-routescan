var libpath = process.env['ROUTESCAN_COV'] ? '../lib-cov' : '../lib';

var fs      = require('fs');
var should  = require('should');
var assert  = require('assert');
var express = require('express');

var router = require(libpath + '/index');

var global, app;

describe('Test router function', function() {
    var wrongValues = [undefined, null, NaN, '', '  ', ' \n', 12, {"a": 1}];
    
    it("should exists", function() {
        should.exist(router);
    });

    describe('if ignoreInvalid doesn\'t mater', function() {

        beforeEach(function(){
            app = express();
        });

        it('should throw if `opts` second parameter is wrong', function () {
            for (var i = 0; i < wrongValues.length; i++) {
                (function() {
                    router(app, wrongValues[i]);
                }).should.throw();
            }
        });
    });
    
    describe('if ignoreInvalid is `false`', function() {

        beforeEach(function(){
            app = express();
        });

        it('should throw if `app` (first parameter) is wrong', function () {
            for (var i = 0; i < wrongValues.length; i++) {
                (function() {
                    router(wrongValues[i]);
                }).should.throw();
            }
        });

        it('should not throw any errors for [\'.rt\'] extentions', function () {
            (function() {
                router(app, {
                    ext: ['.rt']
                });
            }).should.not.throw();

            Object.keys(app.routes).should.lengthOf(1);
            app.routes.get.should.lengthOf(2);
        });

        it('should throw if have been used not existed directory', function () {
            global = {
                directory: './iamWrongFolder/'
            };
            
            (function() {
                router(app, global);
            }).should.throw(/Routes directory is wrong/);

            Object.keys(app.routes).should.lengthOf(0);
        });

    });

    describe('if ignoreInvalid is `true`', function() {

        beforeEach(function(){
            app = express();
        });

        it('should throw if `app` (first parameter) is wrong', function () {
            global = {
                ignoreInvalid: true
            };

            for (var i = 0; i < wrongValues.length; i++) {
                (function() {
                    router(wrongValues[i], global);
                }).should.throw();
            }
        });

        it('should not throw if have been used not existed directory', function () {
            global = {
                ignoreInvalid: true,
                directory: './iamWrongFolder/'
            };
            
            (function() {
                router(app, global);
            }).should.not.throw();

            Object.keys(app.routes).should.lengthOf(0);
        });

        it('should not throw if have been used alternative existed directory', function () {
            global = {
                ignoreInvalid: true,
                directory: './alternativeRoutes/'
            };
            
            (function() {
                router(app, global);
            }).should.not.throw();

            Object.keys(app.routes).should.lengthOf(2);
            app.routes.get.should.lengthOf(5);
            app.routes.post.should.lengthOf(2);
        });

        it('should apply an array of directories for scan', function() {
            global = {
                ignoreInvalid: true,
                directory: ['./empty', './alternativeRoutes/', './routes']
            };
            
            (function() {
                router(app, global);
            }).should.not.throw();

            Object.keys(app.routes).should.lengthOf(2);
            app.routes.get.should.lengthOf(5);
            app.routes.post.should.lengthOf(2);
        });

        it('should not throw if have been used empty existed directory', function () {
            global = {
                ignoreInvalid: true,
                directory: './empty/'
            };
            
            (function() {
                router(app, global);
            }).should.not.throw();

            Object.keys(app.routes).should.lengthOf(0);
        });

        it('should not throw if have been used alternative existed directory for another ext', function () {
            global = {
                ignoreInvalid: true,
                ext: ['.rt'],
                directory: './alternativeRoutes/'
            };
            
            (function() {
                router(app, global);
            }).should.not.throw();

            Object.keys(app.routes).should.lengthOf(1);
            app.routes.get.should.lengthOf(2);
        });

        it('should not throw if have been used correct directory', function () {
            global = {
                ignoreInvalid: true,
                verbose: true
            };
            
            (function() {
                router(app, global);
            }).should.not.throw();

            Object.keys(app.routes).should.lengthOf(2);
            app.routes.get.should.lengthOf(5);
            app.routes.post.should.lengthOf(2);
        });


    });

});