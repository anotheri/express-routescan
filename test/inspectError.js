var path   = require('path');
var fs     = require('fs');
var should = require('should');
var assert = require('assert');

var inspectError = require('../lib/inspectError');
// inspectError(errCode, file, route, method)

var invalid = [];

describe('Test inspectError function', function() {
    var e1 = inspectError(1, "file1", "route1", "method1", true, invalid);
    console.log(e1);

    it("should not exist reIgnoreFiles", function() {
        should.not.exist(reIgnoreFiles);
    });

});