/* 
 * Responsible for logging.
 */

/*
 * Add a global to the V8 stack.
 */
var logger = require('tracer').console();

module.exports.getLogger = function () {
    return logger;
};



