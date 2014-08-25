/* jslint node: true */
'use strict';

/**
 * Function which prints into console information about valid, invalid and ignored routes.
 */
module.exports = function printAll(global) {

    /**
     * Function which prints into console array information about valid routes.
     */
    function printValid() {
        if (Object.keys(global.valid).length > 0) {
            var counter = 1;
            console.log('[routed]:');
            for (var route in global.valid) {
                for (var method in global.valid[route]) {
                    var f = global.valid[route][method];
                    var forced = f.forced ? 'forced' : '';
                    var locked = f.locked ? 'locked' : '';
                    var extra = [forced, locked].join(' ').trim();
                    console.log(counter++ + '.', f.file, '\t', method.toUpperCase(), '\t', route, '\t', extra);
                }
            }
            // console.log('[routed]: ' + JSON.stringify(valid, null, '\t'));
        }
    }

    /**
     * Function which prints into console error messages about invalid routes.
     */
    function printInvalid() {
        if (global.invalid.length > 0) {
            console.log('\n[invalid]:');
            for (var i = 0, l = global.invalid.length; i < l; i++) {
                console.log(i+1 + '. ' + global.invalid[i].msg);
            }

        }
        // console.log(JSON.stringify(invalid, null, '\t'));
    }

    /**
     * Function which prints into console array of ignored files.
     */
    function printIgnored() {
        if (global.ignored.length > 0) {
            console.log('\n[ignored]:');
            for (var i = 0, l = global.ignored.length; i < l; i++) {
                console.log(i+1 + '. ' + global.ignored[i]);
            }
        }
    }

    /**
     * Function which prints into console array of overridden files.
     */
    function printOverridden() {
        if (Object.keys(global.overridden).length > 0) {
            var counter = 1;
            console.log('\n[overridden]:');
            for (var prev in global.overridden) {
                var next = global.overridden[prev];
                console.log(counter++ + '.', prev, ' <-- ', next);
            }
        }
    }

    console.log('\nStatistic info:');
    printValid();
    printInvalid();
    printIgnored();
    printOverridden();

};
