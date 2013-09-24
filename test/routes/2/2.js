
/*
 * GET home page.
 */

var index = function(req, res, next){
    console.log('2');
    res.send("2");
};

module.exports = {
    '/': index
};