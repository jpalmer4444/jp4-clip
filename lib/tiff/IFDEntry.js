/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var LOG = require('./../logging').getLogger(),
        UTILS = require('./../utils'),
        TAGS = require('./TiffTag'),
        TIFFTAGS = TAGS.TIFFTAGS;

class IFDEntry {

    constructor(tag, type, count, valueOffset) {
        this.tag = tag;
        this.type = type;
        this.count = count;
        this.valueOffset = valueOffset;
        this.value;
    }

    isPhotoshop(littleEndian) {
        //littleEndian?
        let bim8 = UTILS.bin2String([this.value[0], this.value[1], this.value[2], this.value[3]]);
        return bim8 === '8BIM';
    }

    _parseValue(bytes, _TiffByteReader) {
        let littleEndian = _TiffByteReader.header.byteOrder === 'II';
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
                let buf = Buffer.alloc(bytes.length, bytes);
                let index = 0;
                let signature = UTILS.bin2String([buf['readInt' + endianness](index++, 1), buf['readInt' + endianness](index++, 1), buf['readInt' + endianness](index++, 1), buf['readInt' + endianness](index++, 1)]);
                //console.log('SIGNATURE: '+bytes);
                //if (signature === '8BIM') {
                    //let irb = new PhotoshopImageResourceBlock(bytes, _TiffByteReader);
                    //this.value = irb;
                //} else {
                    //this.value = buf;
                //}
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
        let string = `[IFDEntry] Tag: ${TIFFTAGS.getTagName(this.tag)} Type: ${TIFFTAGS.TYPE_DESC(this.type)} Count: ${this.count} Value: ${typeof this.value === 'object' ? this.value.toString() : this.value}`;
        return string;
    }

}

module.exports.IFDEntry = IFDEntry;