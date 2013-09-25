var path   = require('path');
var fs     = require('fs');
var should = require('should');
var assert = require('assert');

var inspectError = require('../lib/inspectError');

describe('Test inspectError function', function() {

    it("should exists", function() {
        should.exist(inspectError);
    });

    describe('errCode is `0`:', function() {
        it('should throw error "The first parameter is required and must be an express application."', function() {
            var invalid = [];
            var reError = /The first parameter is required and must be an express application/;
            var invalidIgnore = true;

            (function(){
                inspectError(0);
            }).should.throw(reError);
            
            (function(){
                inspectError(0, null, null, null, invalidIgnore, invalid);
            }).should.throw(reError);
            
            invalid.should.have.lengthOf(0);
        });
    });

    describe('errCode is `1`', function() {
        var invalid = [];
        var errCode = 1;
        var reError = /It must be a function or an object with `fn` property/;
        var file = "file1";
        var route = "route1";
        var method = "method1";

        describe('and invalidIgnore is `false`:', function() {
            var invalidIgnore = false;
            
            it('should throw error "It must be a function or an object with `fn` property"', function() {
                (function(){
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                }).should.throw(reError);
            });

            it('with filename', function() {
                (function(){
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                }).should.throw(new RegExp(file, "i"));
            });

            it('and with route', function() {
                (function(){
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                }).should.throw(new RegExp(route, "i"));
            });
        });

        describe('and invalidIgnore is `true`:', function() {
            var invalidIgnore = true;
            var err;
            
            it('should add error objects into array', function() {
                var len = invalid.length;
                for (var i = 0; i < 10; i++) {
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                    len++;
                }
                invalid.should.have.lengthOf(len);
            });

            it('should not throw any error', function() {
                (function(){
                    err = inspectError(errCode, file, route, method, invalid, invalidIgnore);
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
        var invalid = [];
        var errCode = 2;
        var reError = /unknown HTTP method/;
        var file = "file2";
        var route = "route2";
        var method = "method2";

        describe('and invalidIgnore is `false`:', function() {
            var invalidIgnore = false;
            
            it('should throw error "The configuration of the route has unknown HTTP method"', function() {
                (function(){
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                }).should.throw(reError);
            });

            it('with filename', function() {
                (function(){
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                }).should.throw(new RegExp(file, "i"));
            });

            it('and with route', function() {
                (function(){
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                }).should.throw(new RegExp(route, "i"));
            });

            it('and with method', function() {
                (function(){
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                }).should.throw(new RegExp(method, "i"));
            });
        });

        describe('and invalidIgnore is `true`:', function() {
            var invalidIgnore = true;
            var err;
            
            it('should add error objects into array', function() {
                var len = invalid.length;
                for (var i = 0; i < 10; i++) {
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                    len++;
                }
                invalid.should.have.lengthOf(len);
            });

            it('should not throw any error', function() {
                (function(){
                    err = inspectError(errCode, file, route, method, invalid, invalidIgnore);
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
        var invalid = [];
        var errCode = 3;
        var reError = /has been already applied to application/;
        var file = "file2";
        var route = "route2";
        var method = "method2";

        describe('and invalidIgnore is `false`:', function() {
            var invalidIgnore = false;
            
            it('should throw error that route "has been already applied to application"', function() {
                (function(){
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                }).should.throw(reError);
            });

            it('with filename', function() {
                (function(){
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                }).should.throw(new RegExp(file, "i"));
            });

            it('and with route', function() {
                (function(){
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                }).should.throw(new RegExp(route, "i"));
            });

            it('and with method', function() {
                (function(){
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                }).should.throw(new RegExp(method, "i"));
            });
        });

        describe('and invalidIgnore is `true`:', function() {
            var invalidIgnore = true;
            var err;
            
            it('should add error objects into array', function() {
                var len = invalid.length;
                for (var i = 0; i < 10; i++) {
                    inspectError(errCode, file, route, method, invalid, invalidIgnore);
                    len++;
                }
                invalid.should.have.lengthOf(len);
            });

            it('should not throw any error', function() {
                (function(){
                    err = inspectError(errCode, file, route, method, invalid, invalidIgnore);
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
});