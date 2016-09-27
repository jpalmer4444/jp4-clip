/* 
 * TIFF IFD (Image File Directory)
 */

IFDEntry = require('./IFDEntry').IFDEntry,
        TIFFTAGS = require('./TiffTag').TIFFTAGS,
        PhotoshopImageResourceBlock = require('./PhotoshopImageResourceBlock').PhotoshopImageResourceBlock,
        async = require('async'),
        LOG = require('./../logging').getLogger();

var close = function (binaryReader, error, callback) {
    if (error)
        LOG.error(JSON.stringify(error));

    binaryReader.close(function (error) {
        if (error)
            LOG.error(JSON.stringify(error));
        callback(error);
    });
};

class IFD {

    constructor(ifdBytes, byteOrder) {
        //console.log('Length: '+ifdBytes.length)
        this.entries = new Array();
        let littleEndian = byteOrder === 'II', index = 0;
        //count of entries
        let buf = Buffer.alloc(ifdBytes.length, ifdBytes);
        let numberOfEntries = buf.readUInt8(index++, (index + ++index), false);
        this.count = numberOfEntries;
        let finishedIndex;
        for (let i = 1, argv = 0; i < (this.count + 1); i++, argv += 12) {
            //word UINT16
            let tag = littleEndian ? buf.readUInt16LE(argv + index, false) :
                    buf.readUInt16BE(argv + index, false);
            //word UINT16
            let type = littleEndian ? buf.readUInt16LE((2 + argv + index), false) :
                    buf.readUInt16BE((2 + argv + index), false);
            //dword UINT32
            let count = littleEndian ? buf.readUInt32LE((4 + argv + index), false) :
                    buf.readUInt32BE((4 + argv + index), false);
            //dword UINT32
            let valueoffset = littleEndian ? buf.readUInt32LE((8 + argv + index), false) :
                    buf.readUInt32BE((8 + argv + index), false);
            this.entries.push(new IFDEntry(tag, type, count, valueoffset));
            finishedIndex = (8 + argv + index + 2);
        }

        //dword UINT32
        this.ifdoffset = littleEndian ? buf.readUInt32LE(finishedIndex, 4, false) :
                buf.readUInt32BE(finishedIndex, 4, false);
    }

    getEntry(tag) {

        for (let i = 0; i < this.entries.length; i++) {
            let entry = this.entries[i];
            if (entry.tag === tag) {
                return entry;
            }
        }

    }

    toString() {
        let string = `[IFD BEGIN] Count: ${this.count}`;
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

    static fillResources(IFD, callback, file, BinaryReader, _TiffByteReader) {
        //check if the value fits and is present - if so fill it, if not seek to and fill it.
        var seeks = [];
        for (let i = 0; i < IFD.entries.length; i++) {
            let ifdentry = IFD.entries[i];
            let totalValueBytes = TIFFTAGS.TYPE_BYTES(ifdentry.type, ifdentry.count);
            (function (ifdentry) {
                seeks.push((callback) => {
                    if (totalValueBytes <= 4) {
                        //here the value fits in the valueOffset and can be filled directly.
                        //switch on tag

                        switch (TIFFTAGS.getTagName(ifdentry.tag)) {
                            //deals with case Compression tag
                            case TIFFTAGS.TagMap()[259]:
                            {
                                ifdentry.value = TIFFTAGS.CompressionMap()[ifdentry.valueOffset];
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
                                        //if (ifdentry.tag === 34377) {
                                        //LOG.error('Reading ' + totalValueBytes);
                                        //}
                                        this.read(totalValueBytes, function (error, bytes, bytesRead) {
                                            if (error) {
                                                close(this, error, callback);
                                            } else {
                                                //if (ifdentry.tag === 34377) {
                                                //LOG.error('Found ' + bytes.length);
                                                //}
                                                //we need to parse value based on type
                                                //ifdentry.value = bytes;
                                                //console.log('Bytes Read:'+bytesRead)
                                                ifdentry._parseValue(bytes, _TiffByteReader);
                                                //if (ifdentry.tag === 34377) {
                                                    //LOG.error('Filled ' + ifdentry.value.length);
                                                //}
                                                //IF its Photoshop specific - deal with it.
                                                if (ifdentry.tag === 34377) {
                                                    
                                                    ifdentry.value = new PhotoshopImageResourceBlock(ifdentry.value, _TiffByteReader);
                                                    //if (ifdentry.tag === 34377) {
                                                        //LOG.error('Filled Again ' + ifdentry.value.toString());
                                                    //}
                                                    //LOG.info(ifdentry.toString());

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
    ;
}

module.exports.IFD = IFD;


