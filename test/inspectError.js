var libpath = process.env['ROUTESCAN_COV'] ? '../lib-cov' : '../lib';

var path   = require('path');
var fs     = require('fs');
var should = require('should');
var assert = require('assert');

var inspectError = require(libpath + '/inspectError');

describe('Test inspectError function', function() {

    it("should exists", function() {
        should.exist(inspectError);
    });

    describe('errCode is `0`:', function() {
        var txt1 = 'should throw error "The first parameter is required and must be an express application."';
        var fn1 = function() {
            var reError = /The first parameter is required and must be an express application/;
            
            (function(){
                inspectError(0);
            }).should.throw(reError);
            
            (function(){
                inspectError(0, null, null, null, global);
            }).should.throw(reError);
        };

        describe('and ignoreInvalid is `true`:', function() {
            var global = {
                ignoreInvalid: true,
                invalid: []
            };

            it(txt1, fn1);
        });

        describe('and ignoreInvalid is `false`:', function() {
            var global = {
                ignoreInvalid: false,
                invalid: []
            };
            
            it(txt1, fn1);
        });
    });

    describe('errCode is `1`', function() {
        var errCode = 1;
        var reError = /It must be a function or an object with `fn` property/;
        var file = "file1";
        var route = "route1";
        var method = "method1";

        describe('and ignoreInvalid is `false`:', function() {
            var global = {
                ignoreInvalid: false,
                invalid: []
            };
            
            it('should throw error "It must be a function or an object with `fn` property"', function() {
                (function(){
                    inspectError(errCode, file, route, method, global);
                }).should.throw(reError);
            });

            it('with filename', function() {
                (function(){
                    inspectError(errCode, file, route, method, global);
                }).should.throw(new RegExp(file, "i"));
            });

            it('and with route', function() {
                (function(){
                    inspectError(errCode, file, route, method, global);
                }).should.throw(new RegExp(route, "i"));
            });
        });

        describe('and ignoreInvalid is `true`:', function() {
            var err;
            var global = {
                ignoreInvalid: true,
                invalid: []
            };
            
            it('should add error objects into `global.invalid` array', function() {
                var len = global.invalid.length;

                for (var i = 0; i < 10; i++) {
                    inspectError(errCode, file, route, method, global);
                    len++;
                }
                global.invalid.should.have.lengthOf(len);
            });
            

            it('should not throw any error', function() {
                (function(){
                    err = inspectError(errCode, file, route, method, global);
                }).should.not.throw();
            });


            it('should return an object', function() {
                err.should.be.a('object');
            });

            it('returned object should have correct error code', function() {
                err.should.have.property('code', errCode);
            });

            it('returned object should have correct error message', function() {
                err.should.have.property('msg');
                err.msg.should.match(reError);
            });

            it('returned object should have correct file name', function() {
                err.should.have.property('file', file);
            });

            it('returned object should have correct route', function() {
                err.should.have.property('route', route);
            });

            it('returned object should have correct method', function() {
                err.should.have.property('method', method);
            });
        });
    });

    describe('errCode is `2`', function() {
        var errCode = 2;
        var reError = /unknown HTTP method/;
        var file = "file2";
        var route = "route2";
        var method = "method2";

        describe('and ignoreInvalid is `false`:', function() {
            var global = {
                ignoreInvalid: false,
                invalid: []
            };
            
            it('should throw error "The configuration of the route has unknown HTTP method"', function() {
                (function(){
                    inspectError(errCode, file, route, method, global);
                }).should.throw(reError);
            });

            it('with filename', function() {
                (function(){
                    inspectError(errCode, file, route, method, global);
                }).should.throw(new RegExp(file, "i"));
            });

            it('and with route', function() {
                (function(){
                    inspectError(errCode, file, route, method, global);
                }).should.throw(new RegExp(route, "i"));
            });

            it('and with method', function() {
                (function(){
                    inspectError(errCode, file, route, method, global);
                }).should.throw(new RegExp(method, "i"));
            });
        });

        describe('and ignoreInvalid is `true`:', function() {
            var err;
            var global = {
                ignoreInvalid: true,
                invalid: []
            };
            
            it('should add error objects into `global.invalid` array', function() {
                var len = global.invalid.length;
                for (var i = 0; i < 10; i++) {
                    inspectError(errCode, file, route, method, global);
                    len++;
                }
                global.invalid.should.have.lengthOf(len);
            });

            it('should not throw any error', function() {
                (function(){
                    err = inspectError(errCode, file, route, method, global);
                }).should.not.throw();
            });


            it('should return an object', function() {
                err.should.be.a('object');
            });

            it('returned object should have correct error code', function() {
                err.should.have.property('code', errCode);
            });

            it('returned object should have correct error message', function() {
                err.should.have.property('msg');
                err.msg.should.match(reError);
            });

            it('returned object should have correct file name', function() {
                err.should.have.property('file', file);
            });

            it('returned object should have correct route', function() {
                err.should.have.property('route', route);
            });

            it('returned object should have correct method', function() {
                err.should.have.property('method', method);
            });
        });
    });

    describe('errCode is `3`', function() {
        var errCode = 3;
        var reError = /has been already applied to application/;
        var file = "file3";
        var route = "route3";
        var method = "method3";


        describe('and ignoreInvalid is `false`:', function() {
            var global = {
                ignoreInvalid: false,
                invalid: []
            };
            
            it('should throw error that route "has been already applied to application"', function() {
                (function(){
                    inspectError(errCode, file, route, method, global);
                }).should.throw(reError);
            });

            it('with filename', function() {
                (function(){
                    inspectError(errCode, file, route, method, global);
                }).should.throw(new RegExp(file, "i"));
            });

            it('and with route', function() {
                (function(){
                    inspectError(errCode, file, route, method, global);
                }).should.throw(new RegExp(route, "i"));
            });

            it('and with method', function() {
                (function(){
                    inspectError(errCode, file, route, method, global);
                }).should.throw(new RegExp(method, "i"));
            });
        });

        describe('and ignoreInvalid is `true`:', function() {
            var err;
            var global = {
                ignoreInvalid: true,
                invalid: []
            };

            it('should add error objects into `global.invalid` array', function() {
                var len = global.invalid.length;
                for (var i = 0; i < 10; i++) {
                    inspectError(errCode, file, route, method, global);
                    len++;
                }
                global.invalid.should.have.lengthOf(len);
            });

            it('should not throw any error', function() {
                (function(){
                    err = inspectError(errCode, file, route, method, global);
                }).should.not.throw();
            });


            it('should return an object', function() {
                err.should.be.a('object');
            });

            it('returned object should have correct error code', function() {
                err.should.have.property('code', errCode);
            });

            it('returned object should have correct error message', function() {
                err.should.have.property('msg');
                err.msg.should.match(reError);
            });

            it('returned object should have correct file name', function() {
                err.should.have.property('file', file);
            });

            it('returned object should have correct route', function() {
                err.should.have.property('route', route);
            });

            it('returned object should have correct method', function() {
                err.should.have.property('method', method);
            });
        });
    });

    describe('errCode is `4`', function() {
        var errCode = 4;
        var reError = /hasn\'t `module.exports` of the defined route or has a wrong one/;
        var file = "file4";
        var route = null;
        var method = null;

        describe('and ignoreInvalid is `false`:', function() {
            var global = {
                ignoreInvalid: false,
                invalid: []
            };
            
            it('should throw error that route "hasn\'t `module.exports` of the defined route or has a wrong one"', function() {
                (function(){
                    inspectError(errCode, file, route, method, global);
                }).should.throw(reError);
            });

            it('with filename', function() {
                (function(){
                    inspectError(errCode, file, route, method, global);
                }).should.throw(new RegExp(file, "i"));
            });
        });

        describe('and ignoreInvalid is `true`:', function() {
            var err;
            var global = {
                ignoreInvalid: true,
                invalid: []
            };

            it('should add error objects into `global.invalid` array', function() {
                var len = global.invalid.length;
                for (var i = 0; i < 10; i++) {
                    inspectError(errCode, file, route, method, global);
                    len++;
                }
                global.invalid.should.have.lengthOf(len);
            });

            it('should not throw any error', function() {
                (function(){
                    err = inspectError(errCode, file, route, method, global);
                }).should.not.throw();
            });


            it('should return an object', function() {
                err.should.be.a('object');
            });

            it('returned object should have correct error code', function() {
                err.should.have.property('code', errCode);
            });

            it('returned object should have correct error message', function() {
                err.should.have.property('msg');
                err.msg.should.match(reError);
            });

            it('returned object should have correct file name', function() {
                err.should.have.property('file', file);
            });

            it('returned object should have correct route', function() {
                err.should.have.property('route', route);
            });

            it('returned object should have correct method', function() {
                err.should.have.property('method', method);
            });
        });
    });

    describe('errCode is `5`:', function() {
        var txt5 = 'Routes directory is wrong.';
        var fn5 = function() {
            var reError = /Routes directory is wrong/;

            (function(){
                inspectError(5);
            }).should.throw(reError);
            
            (function(){
                inspectError(5, null, null, null, global);
            }).should.throw(reError);
        };

        describe('and ignoreInvalid is `true`:', function() {
            var global = {
                ignoreInvalid: true,
                invalid: []
            };

            it(txt5, fn5);
        });

        describe('and ignoreInvalid is `false`:', function() {
            var global = {
                ignoreInvalid: false,
                invalid: []
            };

            it(txt5, fn5);
        });

    });
});