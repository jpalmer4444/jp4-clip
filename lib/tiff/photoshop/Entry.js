/* 
 * Base Entry class.
 * sub-classes:
 *      TIFF_IFD
 */

let TiffTag = require('../TiffTag');
let TIFFTAGS = TiffTag.TIFFTAGS;

class Entry{
    constructor(tag, type, count, valueoffset, endianness){
        this._tag = tag;
        this._type = type;
        this._count = count;
        this._valueOffset = valueoffset;
        this._endianness = endianness;
    }
    
    get tag() {
        return this._tag;
    }

    set tag(tag) {
        this._tag = tag;
    }

    get type() {
        return this._type;
    }

    set type(type) {
        this._type = type;
    }

    get count() {
        return this._count;
    }

    set count(count) {
        this._count = count;
    }

    get valueOffset() {
        return this._valueOffset;
    }

    set valueOffset(valueoffset) {
        this._valueOffset = valueoffset;
    }
    
    get endianness(){
        return this._endianness;
    }
    
    set endianness(e){
        this._endianness = e;
    }
    
    getTagName(){
        return TIFFTAGS.getTagName(this.tag);
    }
    
}

module.exports.Entry = Entry;


