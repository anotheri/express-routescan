//it's file with wrong route defifition for tests

function itCouldContainAnyFunctions (argument) {
    return true;
}

var andVariables = true;

//but `module.export` is absent as in `bad.js`
//or `module.exports` is a JSON without any key as in `wrong.js`
module.export = {};