/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let LOG = require('./lib/logging').getLogger();
        //TiffByteReader = require("./lib/TiffByteReader").TiffByteReader,
        let TiffPSByteReader = require("./lib/TiffPSByteReader").TiffPSByteReader;
        let LOCAL = require("./lib/local");

let localize = function(event, context, CALLBACK){
    return LOCAL.handler(event, context, CALLBACK);
};

let iterationLimit = 5;//maximum anticipated number of IFDs expected. Increase for multipage tiffs.
let iterations = 0;

exports.handler = function (event, context, CALLBACK) {
    let local = localize(event, context, CALLBACK);
    event = local.event;
    context = local.context;
    CALLBACK = local.CALLBACK;
    
    let path = local.event['TEST_RESIZE_3_TIF'];
    let filename = path.substring(path.lastIndexOf('/')+1, path.length);
    let directory = path.substring(0, path.lastIndexOf('/')+1);
    
    //let tiffByteReader = new TiffByteReader();
    let tiffByteReader = new TiffPSByteReader(filename, directory);
    let ifdOffset = event.ifdOffset ? ifdOffset : 0;
    tiffByteReader.read(ifdOffset, path, function(err, ifd0){
        if(err){
            LOG.error(JSON.stringify(err), err.stack);
            CALLBACK(err, err.stack);
            process.exit();
        }else{
            let photoshopImageResourceBlock = ifd0.getEntry(34377);
            if(photoshopImageResourceBlock){
                let clippingPathPoints = photoshopImageResourceBlock.value.getPhotoshopEntry(2000).resources;
                
                LOG.info('Found Points!');
            }
            if(ifd0.ifdOffset){
                event.ifdOffset = ifd0.ifdOffset;
                iterations++;
                if(iterations < iterationLimit){
                    
                    LOG.info('Reading next IFD');
                    exports.handler(event, context, CALLBACK);
                }
            }else{
                LOG.info('Finished reading TIF');
                process.exit();
            }
        }
    });
    
    
};

//to run from command line.
exports.handler();