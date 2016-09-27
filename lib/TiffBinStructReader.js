/* 
 * 
 */
var binstruct = require('binstruct'),
        TIFFTAGS = require('./tiff/TiffTag').TIFFTAGS,
        UTILS = require('./utils');

class BSHeader {

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

class BSIFDCount {

    constructor(twoBytes, byteOrder) {
        if (byteOrder === 'II') {
            this._bin_structure_definition = binstruct.def().uint16le('count1').wrap(new Buffer(twoBytes));
        } else {
            this._bin_structure_definition = binstruct.def().uint16be('count1').wrap(new Buffer(twoBytes));
        }
        this.count = this._bin_structure_definition.count1;
    }

    toString() {
        let string = `[IFDCount] Count: ${this.count}`;
        return string;
    }

}

class BSIFDEntry {

    constructor(tag, type, count, valueOffset) {
        this.tag = tag;
        this.type = type;
        this.count = count;
        this.valueOffset = valueOffset;
    }

    toString() {
        let string = `[IFDEntry] Tag: ${TIFFTAGS.getTagName(this.tag)} Type: ${TIFFTAGS.TYPE_DESC(this.type)} Count: ${this.count}`;
        return string;
    }

}

class BSIFD {

    constructor(ifdBytes, byteOrder) {
        //console.log('Length: '+ifdBytes.length)
        this.entries = new Array();
        let struct = binstruct.def().uint8('count1').uint8('count2');
        let littleEndian = (byteOrder === 'II');
        let count = (ifdBytes.length - 6) / 12;
        for (let i = 1; i < (count + 1); i++) {
            if (byteOrder === 'II') {
                struct.uint16le('tag_a_' + i).uint16le('type_a_' + i)
                        .uint32le('count_a_' + i)
                        .uint32le('valueoffset_a_' + i);
            } else {
                struct.uint16be('tag_a_' + i).uint16be('type_a_' + i)
                        .uint32be('count_a_' + i)
                        .uint32be('valueoffset_a_' + i);
            }
        }
        //console.log(struct);
        //next IFD offset
        (byteOrder === 'II') ? struct.uint32le('ifdoffset_a') : struct.uint32be('ifdoffset_a');
        this._bin_structure_definition = struct.wrap(ifdBytes);

        //now parse into values on this model object
        this.count = count;
        //PARSING IFDEntries
        for (let i = 1; i < (count + 1); i++) {
            //word UINT16
            let tag = this._bin_structure_definition['tag_a_' + i];
            //word UINT16
            let type = this._bin_structure_definition['type_a_' + i];
            //dword UINT32
            let count = this._bin_structure_definition['count_a_' + i];
            //dword UINT32
            let valueoffset = this._bin_structure_definition['valueoffset_a_' + i];
            this.entries.push(new BSIFDEntry(tag, type, count, valueoffset));
        }
        //dword UINT32
        this.ifdoffset = this._bin_structure_definition.ifdoffset_a;
    }

    toString() {
        let string = `[IFD BEGIN] Count: ${this.count} `;
        for (let i = 0; i < this.entries.length; i++) {
            string += '\n';
            string += this.entries[i].toString();
        }
        string += '\n';
        string += `[offset-to-next-ifd: ${this.ifdoffset}]`;
        string += '\n';
        string += '[IFD END]';
        return string;
    }

}

module.exports.BSHeader = BSHeader;
module.exports.BSIFDCount = BSIFDCount;
module.exports.BSIFD = BSIFD;


