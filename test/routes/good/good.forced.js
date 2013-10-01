
/*
 * It's good route with `forced` is `true` for override test.
 */


var good = function(req, res){
    res.send("It's good forced route");
};

module.exports = {
    '/good': {
        fn: good,
        locked: true,
        forced: true
    }
};