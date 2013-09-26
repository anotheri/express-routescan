
/*
 * It's good and complex route defenition for tests.
 */

var listGet = function(req, res){
    res.send("respond for GET /users");
};
var listPost = function(req, res){
    res.send("respond for POST /users");
};

module.exports = {
    '/users': [{
        methods: ['get'],
        fn: listGet
    },{
        methods: ['post'],
        fn: listPost
    }],
    '/reUsers': {
        regexp: /^\/user\/(?:([^\/]+?))\/?$/i,
        methods: ['get'],
        fn: listGet
    }
};