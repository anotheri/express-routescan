
/*
 * It's double of a `good.simple.js` route defenition for tests.
 */


var good = function(req, res){
    res.send("It's good route");
};

module.exports = {
    '/good': {
        fn: good,
        methods: ['get']
    }
};