/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var UTILS = require('./utils'),
        IFD = require('./tiff/IFD').IFD,
        LOG = require('./logging').getLogger(),
        async = require('async'),
        reader = require('buffered-reader'),
        BinaryReader = reader.BinaryReader,
        BSIFDCount = require('./TiffBinStructReader').BSIFDCount,
        BSIFD = require('./TiffBinStructReader').BSIFD,
        BSHeader = require('./TiffBinStructReader').BSHeader;

var close = function (binaryReader, error, callback) {
    if (error)
        LOG.error(JSON.stringify(error));

    binaryReader.close(function (error) {
        if (error)
            LOG.error(JSON.stringify(error));
        callback(error);
    });
};

class TiffByteReader {

    /*
     * Sort Order
     The entries in an IFD must be sorted in ascending order by Tag. Note that this is
     not the order in which the fields are described in this document. The Values to
     which directory entries point need not be in any particular order in the file.
     */

    constructor() {
        //holds IFDs which holds array of IFDEntry
        this.IFDS = [];
        //offset in bytes to first IFD
        this.offset = 0;
        this.header;
    }

    _isDone() {
        let isDone = this.header.done();
        this.IFDS.forEach(function (ifd) {
            if (!ifd.done())
                isDone = false;
        });
        return isDone;
    }

    read(file, cb) {

        var reads = [];
        var _TiffByteReader = this;

        //read the first 8 bytes. (BSHeader)
        reads.push((callback) => {
                ((_TiffByteReader)=>{
                    new BinaryReader(file)
                        .seek(0, function (error) {
                            if (error) {
                                close(this, error, callback);
                            }
                            this.read(8, function (error, bytes, bytesRead) {
                                if (error) {
                                    close(this, error, callback);
                                } else {
                                    
                                    _TiffByteReader.header = new BSHeader(bytes);
                                    
                                    callback(null, _TiffByteReader.header.ifdOffset);
                                }
                            });
                        });
                })(_TiffByteReader);
        });
        
        
        //read the length of the first IFD
        reads.push((ifdOffset, callback) => {
                ((_TiffByteReader)=>{
                    new BinaryReader(file)
                        .seek(ifdOffset, function (error) {
                            if (error) {
                                close(this, error, callback);
                            }
                            this.read(2, function (error, bytes, bytesRead) {
                                if (error) {
                                    close(this, error, callback);
                                } else {
                                    
                                    
                                    let bsifdcount = new BSIFDCount(bytes, _TiffByteReader.header.byteOrder).count;
                                    //console.log('Count: '+bsifdcount)
                                    callback(null, ifdOffset, bsifdcount);
                                }
                            });
                        });
                })(_TiffByteReader);
        });
        
        
        //now read the first IFD
        reads.push((ifdOffset, ifdcount, callback) => {
                ((_TiffByteReader)=>{
                    new BinaryReader(file)
                        .seek(ifdOffset, function (error) {
                            if (error) {
                                close(this, error, callback);
                            }
                            //read 2 bytes for ifdcount plus 12 bytes for each IFDEntry and 4 bytes for OFFSET to next IFD.
                            this.read((2 + (ifdcount * 12)) + 4, function (error, bytes, bytesRead) {
                                if (error) {
                                    close(this, error, callback);
                                } else {
                                    
                                    let bsifd = new BSIFD(bytes, _TiffByteReader.header.byteOrder);
                                    let bsifdoffset = bsifd.ifdoffset;
                                    _TiffByteReader.IFDS.push(bsifd);
                                    
                                    callback(null, bsifdoffset);
                                }
                            });
                        });
                })(_TiffByteReader);
        });
        


        async.waterfall(reads, function (err, data) {
            if (err) {
                LOG.error(JSON.stringify(err));
            } else {
                LOG.info(_TiffByteReader.toString());
                cb(null, 'Finished!');
            }
        });


    }

    toString() {
        let string = this.header.toString() + '\n';
        for (let i = 0; i < this.IFDS.length; i++) {
            string += this.IFDS[i].toString();
        }
        return string;
    }

}

module.exports.TiffByteReader = TiffByteReader;


