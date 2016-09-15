/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var LOG = require('./logging');

exports.handler = function (event, context, CALLBACK) {
    if(!event){
        event = require('../event');
    }
    if (!context) {
        context = event;
    }
    if (!CALLBACK) {
        CALLBACK = function(err, data){
            if(err){
                LOG.error(JSON.stringify(err));
                process.exit();
            }else{
                LOG.info('Finished.');
                LOG.info(JSON.stringify(data));
                process.exit();
            }
        };
    }
    return {
        event: event,
        context: context,
        CALLBACK: CALLBACK
    };
};


