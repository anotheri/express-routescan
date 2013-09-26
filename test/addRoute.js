var libpath = process.env['ROUTESCAN_COV'] ? '../lib-cov' : '../lib';

var path    = require('path');
var fs      = require('fs');
var should  = require('should');
var assert  = require('assert');
var express = require('express');

var addRoute = require(libpath + '/addRoute');

describe('Test addRoute function', function() {
    var validFiles = [
        path.join(__dirname, './routes/good.simple.js'),
        path.join(__dirname, './routes/good.complex.js')
    ];
    var wrongValues = [undefined, null, NaN, '', '  ', ' \n', 12, 3, {"a": 1}];
    var wrongFiles = [
        path.join(__dirname, './routes/has.error1.js'),
        path.join(__dirname, './routes/has.error2.js'),
        path.join(__dirname, './routes/has.error4.js'),
        path.join(__dirname, './routes/has.error4too.js'),
        path.join(__dirname, './routes/has.errors.js')
    ];
    var existsFiles = [
        path.join(__dirname, './routes/good.simple.js'),
        path.join(__dirname, './routes/good.double.js')
    ];
    

    it("should exists", function() {
        should.exist(addRoute);
    });
    
    describe('if ignoreInvalid is `false`', function() {

        it("should throw an error for wrong file values", function() {
            var global = {
                ignoreInvalid: false,
                valid: {},
                invalid: [],
                ignored: []
            };
            var app  = express();
            var fn = function() {
                addRoute(app, wrongValues[i], global);
            };
            for (var i = 0; i < wrongValues.length; i++) {
                (fn).should.throw();
            }
        });

        it("should throw an error for wrong files", function() {
            var global = {
                ignoreInvalid: false,
                valid: {},
                invalid: [],
                ignored: []
            };
            var app  = express();
            var fn = function() {
                addRoute(app, wrongFiles[i], global);
            };
            for (var i = 0; i < wrongFiles.length; i++) {
                (fn).should.throw();
            }

            (function() {
                addRoute(app, path.join(__dirname, './routes/has.error4.js'), global);
            }).should.throw(/Use `module.exports` for export/);

            (function() {
                addRoute(app, path.join(__dirname, './routes/has.error1.js'), global);
            }).should.throw(/`fn` property/);

            (function() {
                addRoute(app, path.join(__dirname, './routes/has.error2.js'), global);
            }).should.throw(/unknown HTTP method/);
        });

        it("should throw an error for files with already applied routes (route/method)", function() {
            var global = {
                ignoreInvalid: false,
                valid: {},
                invalid: [],
                ignored: []
            };
            var app  = express();
            var fn = function() {
                addRoute(app, existsFiles[i], global);
            };

            for (var i = 0; i < existsFiles.length; i++) {
                if (i === 0) (fn).should.not.throw();
                else (fn).should.throw(/already applied to application/);
            }
        });

        it("should not throw any error for valid files and applies routes correct", function() {
            var global = {
                ignoreInvalid: false,
                valid: {},
                invalid: [],
                ignored: []
            };
            var app  = express();
            var fn = function() {
                addRoute(app, validFiles[i], global);
            };
            for (var i = 0; i < validFiles.length; i++) {
                (fn).should.not.throw();
            }
            app.routes.get.should.lengthOf(3);
            app.routes.post.should.lengthOf(1);
            global.invalid.should.lengthOf(0);
            Object.keys(global.valid).should.lengthOf(3);
        });

    });

    describe('if ignoreInvalid is `true`', function() {

        it("should not throw any errors and push invalides to array", function() {
            var global = {
                ignoreInvalid: true,
                valid: {},
                invalid: [],
                ignored: []
            };
            var app  = express();

            var fn1 = function() {
                addRoute(app, validFiles[i], global);
            };
            for (var i = 0; i < validFiles.length; i++) {
                (fn1).should.not.throw();
            }
            global.invalid.should.lengthOf(0);

            var fn2 = function() {
                addRoute(app, wrongFiles[i], global);
            };
            for (var i = 0; i < wrongFiles.length; i++) {
                (fn2).should.not.throw();
            }
            global.invalid.should.lengthOf(10);

            var fn3 = function() {
                addRoute(app, existsFiles[i], global);
            };
            for (var i = 0; i < existsFiles.length; i++) {
                (fn3).should.not.throw();
            }
            global.invalid.should.lengthOf(12);
        });

        it("should apply routes correct", function() {
            var global = {
                ignoreInvalid: true,
                valid: {},
                invalid: [],
                ignored: []
            };
            var app  = express();

            var fn = function() {
                addRoute(app, validFiles[i], global);
            };
            for (var i = 0; i < validFiles.length; i++) {
                (fn).should.not.throw();
            }

            app.routes.get.should.lengthOf(3);
            app.routes.post.should.lengthOf(1);
            global.invalid.should.lengthOf(0);
            Object.keys(global.valid).should.lengthOf(3);
        });

        it("should apply apply route only first time if it's the same", function() {
            var global = {
                ignoreInvalid: true,
                valid: {},
                invalid: [],
                ignored: []
            };
            var app  = express();


            (function() {
                addRoute(app, existsFiles[0], global);
            }).should.not.throw();

            app.routes.get.should.lengthOf(1);
            var r = app.routes;
            global.invalid.should.lengthOf(0);
            Object.keys(global.valid).should.lengthOf(1);


            var fn = function() {
                addRoute(app, existsFiles[1], global);
            };
            for (var i = 0; i < 5; i++) {
                (fn).should.not.throw();

                app.routes.get.should.lengthOf(1);
                global.invalid.should.lengthOf(i+1);
                Object.keys(global.valid).should.lengthOf(1);
            }

            app.routes.should.equal(r);
        });

    });

});