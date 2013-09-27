
/*
 * It's a bad route that should throw error 2.
 */


module.exports = {
    '/error2': {
        fn: function function_name (argument) {
            res.send('error 2');
        },
        methods: ['wrong', "meth"]
    }
};