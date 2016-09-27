/* 
 * TIFF file header.
 */
var UTILS = require('./../utils'),
        TIFFTAGS = require('./TiffTag').TIFFTAGS,
        binstruct = require('binstruct');

class Header {

    constructor(first8Bytes) {
        let order = UTILS.bin2String([first8Bytes[0], first8Bytes[1]]);
        if (order === 'II') {
            this._bin_structure_definition = binstruct.def().int8('byteOrder1').int8('byteOrder2').int16le('magicNumber').uint32le('ifdOffset1').wrap(first8Bytes);
        } else {
            this._bin_structure_definition = binstruct.def().int8('byteOrder1').int8('byteOrder2').int16be('magicNumber').uint32be('ifdOffset1').wrap(first8Bytes);
        }
        //char
        this.byteOrder = UTILS.bin2String([this._bin_structure_definition.byteOrder1, this._bin_structure_definition.byteOrder2]);
        //word
        this.magicNumber = this._bin_structure_definition.magicNumber;
        //dword
        this.ifdOffset = parseInt([this._bin_structure_definition.ifdOffset1, this._bin_structure_definition.ifdOffset2, this._bin_structure_definition.ifdOffset3, this._bin_structure_definition.ifdOffset4]);
    }

    toString() {
        let string = `[TiffHeader] Order: ${this.byteOrder} Magic: ${this.magicNumber} Offset: ${this.ifdOffset}`;
        return string;
    }

}

module.exports.Header = Header;


