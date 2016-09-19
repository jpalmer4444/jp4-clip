/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var LOG = require('./logging').getLogger(),
        TiffReader = require("./TiffReader").TiffReader,
        reader = require ("buffered-reader"),
        DataReader = reader.DataReader;

module.exports.read_file = function(filename, cb){
    
    var tiffreader = new TiffReader();
    
    //Open the file -->
    //Read Header -->
    //Seek to first IFD 
    //the idea is that we read in the first 8 bytes - then seek to whatever offset is found --> 
    //Then read the IFD -->
    //Then seek to image data or next IFD -->
    //Close the file.
    
    
    new DataReader(filename)
            
            .on("error", function(error){
        
                        LOG.error(JSON.stringify(error));
                        cb(error, error.stack);
    
            }).on("byte", function(b){
        
                        tiffreader.read(b);
    
            }).on("end", function(){
        
                        LOG.info('Image Loaded');
                        
                       LOG.info(tiffreader.toString());
                           
                            cb(null, 'Done!');
                            
                    
    
            }).read();
    
};


