/* 
 * TIFF_Directory sub-class
 */

let Directory = require('./Directory').Directory;
let PSImageResourceBlock = require('./PSImageResourceBlock').PSImageResourceBlock;
let IFDEntry = require('./IFDEntry').IFDEntry;
let reader = require('buffered-reader');
let TIFFTAGS = require('../TiffTag').TIFFTAGS;
let async = require('async');
let LOG = require('../../logging').getLogger();
let BinaryReader = reader.BinaryReader;

class IFD extends Directory {

    constructor(bytes, endianness) {
        super(endianness);
        this._endianness = endianness;
        this._entries = new Set();
        this._count = IFD.count(bytes, endianness);
        this._index = 0;
        this._index += 2;
        let tagbytes;

        for (let i = 0; i < ((this._count)); i++) {

            //each iteration creates a 12 byte TIFF_IFD_Entry
            tagbytes = bytes.slice(this._index, this._index + 2);
            let tag = Buffer.alloc(tagbytes.length, tagbytes)['readUInt16' + endianness](0, false);
            this._index += 2;
            tagbytes = bytes.slice(this._index, this._index + 2);
            let type = Buffer.alloc(tagbytes.length, tagbytes)['readUInt16' + endianness](0, false);
            this._index += 2;
            tagbytes = bytes.slice(this._index, this._index + 4);
            let count = Buffer.alloc(tagbytes.length, tagbytes)['readUInt32' + endianness](0, false);
            this._index += 4;
            tagbytes = bytes.slice(this._index, this._index + 4);
            let valueoffset = Buffer.alloc(tagbytes.length, tagbytes)['readUInt32' + endianness](0, false);
            this._index += 4;
            this._entries.add(new IFDEntry(tag, type, count, valueoffset, endianness, i));

        }

        tagbytes = bytes.slice(this._index, bytes.length);
        this._ifdOffset = Buffer.alloc(tagbytes.length, tagbytes)['readUInt32' + endianness](0, false);
        this._index += 4;
    }

    get entries() {
        return this._entries;
    }

    set entries(ents) {
        this._entries = ents;
    }

    get count() {
        return this._count;
    }

    set count(cnt) {
        this._count = cnt;
    }

    get endianness() {
        return this._endianness;
    }

    set endianness(endianness) {
        this._endianness = endianness;
    }

    get ifdOffset() {
        return this._ifdOffset;
    }

    set ifdOffset(ifdoff) {
        this._ifdOffset = ifdoff;
    }

    getEntry(t) {
        for (let tiffentry of this.entries.values()) {
            if (tiffentry.tag === t) {
                return tiffentry;
            }
        }
    }

    static fill(tiff_IFD, callback, file, reader) {
        let seeks = new Array();
        for (let ifdentry of tiff_IFD.entries) {
            let totalValueBytes = TIFFTAGS.TYPE_BYTES(ifdentry.type, ifdentry.count);
            (function (ifdentry) {
                seeks.push((callback) => {
                    if (totalValueBytes <= 4) {
                        switch (TIFFTAGS.TYPE_DESC(ifdentry.type)) {
                            case 'SHORT':
                            {
                                //needed because we parsed valueOffset as a 32 bit Integer, but the value needs
                                //to be parsed as a 16 bit Short
                                
                                let buf = Buffer.alloc(4);
                                buf['writeUInt32' + tiff_IFD.endianness](ifdentry.valueOffset);
                                ifdentry.value = buf['readUInt16' + tiff_IFD.endianness](0, false);
                                break;
                            }
                            default :
                            {
                                //do nothing for now
                            }
                        }

                        switch (TIFFTAGS.getTagName(ifdentry.tag)) {
                            //Compression
                            case TIFFTAGS.TagMap()[259]:
                            {
                                ifdentry.value = TIFFTAGS.CompressionMap()[ifdentry.valueOffset];
                                break;
                            }

                            //ImageWidth
                            case TIFFTAGS.TagMap()[256]:
                            //ImageHeight
                            case TIFFTAGS.TagMap()[257]:
                            {
                                let buf = Buffer.alloc(4);
                                buf['writeUInt32' + tiff_IFD.endianness](ifdentry.valueOffset);
                                ifdentry.value = buf['readUInt16' + tiff_IFD.endianness](0, false);
                                break;
                            }

                            default :
                            {
                                ifdentry.value = ifdentry.valueOffset;
                            }
                        }
                        callback(null, ifdentry.value);
                    } else {
                        //must seek to value offset here.
                        new BinaryReader(file)
                                .seek(ifdentry.valueOffset, function (error) {
                                    if (error) {
                                        close(this, error, callback);
                                    } else {
                                        this.read(totalValueBytes, function (error, bytes, bytesRead) {
                                            if (error) {
                                                close(this, error, callback);
                                            } else {
                                                ifdentry.parseValue(bytes, reader);
                                                if (ifdentry.tag === 34377) {
                                                    ifdentry.value = new PSImageResourceBlock(bytes, reader);
                                                }
                                                callback(null, bytes);
                                            }
                                        });
                                    }
                                });
                    }
                });
            })(ifdentry);
        }
        async.parallel(seeks, function (err, results) {
            if (err) {
                LOG.error(JSON.stringify(err));
                callback(err);
            } else {
                callback(null, results);
            }
        });
    }

    static count(bytes, endianness) {
        return Buffer.alloc(2, bytes.slice(0, 2))['readUInt16' + endianness](0, false);
    }

    toString() {
        let string = `  [IFD0 directory with ${this.count} entries]\n`;
        for (let item of this.entries) {
            string += item.toString();
            string += `\n`;
        }
        string += `  [IFD0 END OffsetIFD1 ${this.ifdOffset}]`;
        return string;
    }

}

module.exports.IFD = IFD;


