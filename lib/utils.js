/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let LOG = require('./logging').getLogger();

let bin2String = (array) => {
        var result = "";
        for (var i = 0; i < array.length; i++) {
            result += String.fromCharCode(parseInt(array[i]));
        }
        //console.log('Bin: '+result);
        return result;
    };
    
let close = function (binaryReader, error, callback) {
    if (error)
        LOG.error(JSON.stringify(error));

    binaryReader.close(function (error) {
        if (error)
            LOG.error(JSON.stringify(error));
        if(callback)
        callback(error);
    });
};

module.exports.close = close;

module.exports.bin2String = bin2String;


