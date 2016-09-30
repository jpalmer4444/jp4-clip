/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let bin2String = (array) => {
        var result = "";
        for (var i = 0; i < array.length; i++) {
            result += String.fromCharCode(parseInt(array[i]));
        }
        //console.log('Bin: '+result);
        return result;
    };
    
    let read8BIM = (buf, index, endianness) => {
        return bin2String(
                        [
                            buf['readInt' + endianness](index, 1, false),
                            buf['readInt' + endianness](index + 1, 1, false),
                            buf['readInt' + endianness](index + 2, 1, false),
                            buf['readInt' + endianness](index + 3, 1, false)
                        ]
                        );
    };
    
    let is8BIM = (buf, index, endianness) => {
        return read8BIM(buf, index, endianness) === '8BIM';
    };
    
    let scanTo8BIMIndex = (buf, start, endianness) => {
        let eightBim;
        do{
            eightBim = is8BIM(buf,start,endianness)
            start+=1;
        }while(!eightBim && (start + 4) < buf.length);
        return eightBim ? start : 0;
    };

module.exports.bin2String = bin2String;
/**
 * @param {Buffer} buf 
 * @param {Number} index 
 * @param {string} endianness 
 */
module.exports.read8BIM = read8BIM;
/**
 * @param {Buffer} buf 
 * @param {Number} index 
 * @param {string} endianness 
 */
module.exports.is8BIM = is8BIM;
/**
 * @param {Buffer} buf 
 * @param {Number} start 
 * @param {string} endianness 
 */
module.exports.scanTo8BIMIndex = scanTo8BIMIndex;


