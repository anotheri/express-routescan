
/*
 * It's good and simple route defenition for tests.
 */


var good = function(req, res){
    res.send("It's good route");
};

module.exports = {
    '/good': good
};