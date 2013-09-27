
/*
 * It's good and simple route defenition for tests.
 */


var good = function(req, res){
    res.send("It's good route");
};

module.exports = {
    '/good': function(argument){
        res.send("Seems ok, but file `good.js` may throw error in mixedFiles.");
    },
    '/error1': 3,
    '/error2': {
    },
    '/g2': {
        fn: good,
        methods: ['post']
    },
    '/error4': [{
        methods: ['gett'],
        fn: function(argument){
            res.send("Seems ok, but method is wrong.");
        }
    },{
        fn: null
    }]
};