/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var LOG = require('./lib/logging').getLogger(),
        TiffByteReader = require("./lib/TiffByteReader").TiffByteReader,
        LOCAL = require("./lib/local");

var localize = function(event, context, CALLBACK){
    return LOCAL.handler(event, context, CALLBACK);
};

exports.handler = function (event, context, CALLBACK) {
    
    var local = localize(event, context, CALLBACK);
    event = local.event;
    context = local.context;
    CALLBACK = local.CALLBACK;
    
    /*readImageFile.read_file(local.event['TEST_RESIZE_2_TIF'], function(err, headers){
        if(err){
            LOG.error(JSON.stringify(err), err.stack);
            CALLBACK(err, err.stack);
        }else{
            LOG.info('We have metadata!');
            console.log(JSON.stringify(headers));
        }
    });*/
    
    let tiffByteReader = new TiffByteReader();
    tiffByteReader.read(0, local.event['TEST_RESIZE_2_TIF'], function(err, headers){
        if(err){
            LOG.error(JSON.stringify(err), err.stack);
            CALLBACK(err, err.stack);
            process.exit();
        }else{
            
            /**
             * Could continue to read any more IFDs found by checking if one exists...
             * let anotherIfd = tiffByteReader.nextIfdOffset > 0
             * if(anotherIfd){
             *  tiffByteReader(tiffByteReader.nextIfdOffset, local.event['TEST_RESIZE_2_TIF'], (err, results)=>{
             *      if(err){
                        LOG.error(JSON.stringify(err), err.stack);
                        CALLBACK(err, err.stack);
                    }else{
                        //repeatamente...
                    }
             *  });
             * }
             */
            
            process.exit();
        }
    });
    
    
};

//to run from command line.
exports.handler();