/* 
 * Base Directory class.
 *  sub-classes:
 *      TIFF_IFD
 */

class Directory{
    
    constructor(endianness){
        this._endianness = endianness;
    }
    
}

module.exports.Directory = Directory;


