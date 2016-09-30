/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var LOG = require('./lib/logging').getLogger(),
        //TiffByteReader = require("./lib/TiffByteReader").TiffByteReader,
        TiffPSByteReader = require("./lib/TiffPSByteReader").TiffPSByteReader,
        LOCAL = require("./lib/local");

var localize = function(event, context, CALLBACK){
    return LOCAL.handler(event, context, CALLBACK);
};

exports.handler = function (event, context, CALLBACK) {
    
    var local = localize(event, context, CALLBACK);
    event = local.event;
    context = local.context;
    CALLBACK = local.CALLBACK;
    
    let path = local.event['TEST_RESIZE_3_TIF'];
    let filename = path.substring(path.lastIndexOf('/')+1, path.length);
    let directory = path.substring(0, path.lastIndexOf('/')+1);
    
    //let tiffByteReader = new TiffByteReader();
    let tiffByteReader = new TiffPSByteReader(filename, directory);
    tiffByteReader.read(0, path, function(err, headers){
        if(err){
            LOG.error(JSON.stringify(err), err.stack);
            CALLBACK(err, err.stack);
            process.exit();
        }else{
            
            process.exit();
        }
    });
    
    
};

//to run from command line.
exports.handler();