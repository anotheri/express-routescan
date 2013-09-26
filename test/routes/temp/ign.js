
/*
 * It's ignored file by .routeignore for tests.
 * As and all files inside `routes/temp` folder.
 */

var ign = function(req, res){
    res.send("It's ignored file by .routeignore");
};

module.exports = {
    "/ign": ign
};