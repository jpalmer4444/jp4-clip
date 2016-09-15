/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var LOG = require('./logging').getLogger(),
        ImageHeaders = require("image-headers"),
        reader = require ("buffered-reader"),
        DataReader = reader.DataReader;

module.exports.read_file = function(filename, cb){
    
    var image_headers = new ImageHeaders();
    
    new DataReader(filename)
            
            .on("error", function(error){
        
                        LOG.error(JSON.stringify(error));
                        cb(error, error.stack);
    
            }).on("byte", function(b){
        
            if(!image_headers.finished)
                        image_headers.add_bytes(b);
    
            }).on("end", function(){
        
                        LOG.info('Image Loaded');
                        //image_headers.finish (err, image_headers) ->
                        //return callback(err, image_headers)
                        image_headers.finish(function(err, image_headers){
                           
                            cb(err, image_headers);
                            
                        });
    
            }).read();
    
};


