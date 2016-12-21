/* 
 * Responsible for logging.
 */

var logger = require('tracer').console();

module.exports.getLogger = function () {
    return logger;
};



