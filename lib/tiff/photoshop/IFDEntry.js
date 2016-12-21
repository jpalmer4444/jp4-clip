/* 
 * TIFF_Entry sub-class.
 */
let Entry = require('./Entry').Entry;
let TIFFTAGS = require('../TiffTag').TIFFTAGS;
let TAGS = require('./../TiffTag');
let UTILS = require('./../../utils');
let LOG = require('./../../logging').getLogger();

class IFDEntry extends Entry {

    constructor(tag, type, count, valueoffset, endianness, entryIndex) {
        super(tag, type, count, valueoffset, endianness);
        this._entryIndex = entryIndex;
        this._value;
        this._rawBytes;
    }

    get entryIndex() {
        return this._entryIndex;
    }

    set entryIndex(entryindex) {
        this._entryIndex = entryindex;
    }
    
    get rawBytes() {
        return this._rawBytes;
    }

    set rawBytes(rawBytes) {
        this._rawBytes = rawBytes;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    //writes dumb - you must have already changed offsets to match where the values were written.
    write(writer, offset) {
        var buf = Buffer.alloc(12);
        buf['writeUInt16' + this.endianness](this.tag, 0);
        buf['writeUInt16' + this.endianness](this.type, 2);
        buf['writeUInt32' + this.endianness](this.count, 4);
        buf['writeUInt32' + this.endianness](this.valueOffset, 8);
        writer.write(buf, offset, 'UTF-8');
        //LOG.info('Entry length: '+buf.length)
        return 12;
    }

    needsOffset() {
        return TIFFTAGS.TYPE_BYTES(this.type, this.count) > 4;
    }

    parseValue(bytes, reader) {
        let littleEndian = reader.header.byteOrder === 'II';
        let endianness = littleEndian ? 'LE' : 'BE';
        switch (this.type) {
            case TAGS.T_BYTE:
            {
                this.value = new Buffer(bytes).readUInt8(0, bytes.length, false);
                break;
            }
            case TAGS.T_SBYTE:
            case TAGS.T_UNDEFINED :
            {
                //here is where we could find an IRB
                this.value = bytes;
                break;
            }
            case TAGS.T_ASCII :
            {
                this.value = UTILS.bin2String(bytes);
                break;
            }
            case TAGS.T_SSHORT :
            {
                this.value = new Buffer(bytes)['readInt16' + endianness](0, false);
                break;
            }
            case TAGS.T_SHORT :
            {
                let buf = Buffer.alloc(bytes.length, bytes);
                let array = new Array();
                for (let i = 0; i < (this.count * 2); i += 2) {
                    array.push(buf['readUInt16' + endianness](i, false));
                }
                this.value = this.count > 1 ? array : array[0];
                break;
            }
            case TAGS.T_DOUBLE :
            case TAGS.T_SRATIONAL :
            case TAGS.T_RATIONAL :
            case TAGS.T_LONG :
            {
                //1 Long will only be 4 bytes whereas an array of longs should be a multiple of 4?
                if (bytes.length === 4) {
                    this.value = Buffer.alloc(bytes.length, bytes)['readUInt32' + endianness](0, false);
                } else {
                    //bytes.length should be a multiple of 4
                    if (bytes.length % 4 !== 0) {
                        LOG.error('LONG type must have a length of 4 or a multiple of 4! actual length passed: ' + bytes.length);
                    } else {
                        this.value = [];
                        let buf = Buffer.alloc(bytes.length, bytes);
                        for (let i = 0; i < bytes.length; i += 4) {
                            this.value.push(buf['readUInt32' + endianness](i, false));
                        }
                    }
                }
                break;
            }
            case TAGS.T_SLONG :
            case TAGS.T_FLOAT :
            {
                this.value = bytes;
                break;
            }
            //NOT FOUND
            default :
            {
                LOG.info('Type not found: ' + this.type);
                this.value = bytes;
            }
        }
    }

    toString() {
        //let string = `  | ${("00" + this.entryIndex).slice(-2)}) [Type: ${("          " + TIFFTAGS.TYPE_DESC(this.type)).slice(-10)}]`;
        //string += `  ${this.getTagName(this.tag)}`;
        let string = `  | ${("   " + this.entryIndex).slice(-3)})`;
        string += `  ${this.getTagName(this.tag)}`;
        switch (this.getTagName(this.tag)) {
            case 'PhotoshopSettings':
            {
                string += ` (SubDirectory) -->\n`;
                break;
            }
            default :
            {
                string += ` = `;
            }
        }
        if (typeof this.value === 'object') {
            string += this.value.toString();
        } else {
            string += this.value;
        }
        return string;
    }

}
;

module.exports.IFDEntry = IFDEntry;


