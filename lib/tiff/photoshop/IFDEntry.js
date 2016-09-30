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
        super(endianness);
        this._tag = tag;
        this._type = type;
        this._count = count;
        this._valueOffset = valueoffset;
        this._entryIndex = entryIndex;
        this._value;
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

    get entryIndex() {
        return this._entryIndex;
    }

    set entryIndex(entryindex) {
        this._entryIndex = entryindex;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }
    
    getTagName(){
        return TIFFTAGS.getTagName(this.tag);
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
                for(let i = 0;i < (this.count * 2);i+=2){
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

};

module.exports.IFDEntry = IFDEntry;


