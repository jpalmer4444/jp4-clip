/* 
 * Base Resource class.
 */
let TiffTag = require('../TiffTag');
let TIFFTAGS = TiffTag.TIFFTAGS;

class PSResourceFactory {
    
    constructor(bytes, endianness){
        
        
        //PS specific stuff
        this._type = Buffer.alloc(2, this.bytes.slice(4, 6))['readUInt16' + this.endianness](0, false);
        //now read the pascal string.
        
        
    }
    
}

module.exports.PSResourceFactory = PSResourceFactory;


