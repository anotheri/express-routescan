var path   = require('path');
var fs     = require('fs');
var should = require('should');
var assert = require('assert');

var initIgnore = require('../lib/initIgnore');

describe('Test initIgnore function', function() {
    var dir = __dirname + '/routes';
    var reIgnoreFiles = initIgnore(dir);
    var ignoreFile = path.join(dir, './.routeignore');

    var toIgnore = [
        './routes/temp/1.js'
    ];

    var notToIgnore = [
        './routes/index.js'
    ];

    if (fs.existsSync(ignoreFile) && fs.readFileSync(ignoreFile).toString().trim().length > 0) {
        it("should exist reIgnoreFiles", function() {
            should.exist(reIgnoreFiles);
        });
        
        for (var i = 0; i < toIgnore.length; i++) {
            var file = toIgnore[i];
            it("should be ignored file: " + file, function() {
                var isIgnore = reIgnoreFiles && reIgnoreFiles.test(file);
                isIgnore.should.be.true;
            });
        }
        
        for (var j = 0; j < notToIgnore.length; j++) {
            var notIgn = notToIgnore[j];
            it("shouldn't be ignored file: " + notIgn, function() {
                var isIgnore = reIgnoreFiles && reIgnoreFiles.test(notIgn);
                isIgnore.should.be.false;
            });
        }

    } else {
        it("should not exist reIgnoreFiles", function() {
            should.not.exist(reIgnoreFiles);
        });
    }
});