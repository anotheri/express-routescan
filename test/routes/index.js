
/*
 * GET home page.
 */

var index = function(req, res){
    res.render('index', { title: 'MyApp' });
};

module.exports = {
    '/': index
};