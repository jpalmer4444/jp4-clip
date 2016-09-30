/* 
 * Base Entry class.
 * sub-classes:
 *      TIFF_IFD
 */

class Entry{
    constructor(endianness){
        this._endianness = endianness;
    }
    
    get endianness(){
        return this._endianness;
    }
    
    set endianness(e){
        this._endianness = e;
    }
    
}

module.exports.Entry = Entry;


