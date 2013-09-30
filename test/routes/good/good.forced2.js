
/*
 * It's good route with `forced` is `true` for override test.
 */


var good = function(req, res){
    res.send("It's one more good forced route");
};

module.exports = {
    '/good': {
        fn: good,
        forced: true
    }
};