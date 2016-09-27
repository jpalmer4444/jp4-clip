/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var IFD = require('./tiff/IFD').IFD,
        LOG = require('./logging').getLogger(),
        async = require('async'),
        reader = require('buffered-reader'),
        BinaryReader = reader.BinaryReader,
        IFDCount = require('./tiff/IFDCount').IFDCount,
        IFD = require('./tiff/IFD').IFD,
        Header = require('./tiff/Header').Header;

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
        this.nextIfdOffset;
    }

    _isDone() {
        let isDone = this.header.done();
        this.IFDS.forEach(function (ifd) {
            if (!ifd.done())
                isDone = false;
        });
        return isDone;
    }
    
    baselineIFD(){
        return this.IFDS[0];
    }

    read(startOffset, file, cb) {

        var reads = [];
        var _TiffByteReader = this;

        /**
         * read can be called multiple times - only the first time will it read the File header, 
         * otherwise it will read the IFD at the startOffset passed. BUT if startOffset 
         * is zero - then it will read the TIFF file header. read the first 8 bytes. (Only If 
         * Header is not defined - if it is - then simulate the waterfall action)
         */
        if (!startOffset) {
            reads.push((callback) => {
                ((_TiffByteReader) => {
                    new BinaryReader(file)
                            .seek(startOffset, function (error) {
                                if (error) {
                                    close(this, error, callback);
                                }
                                this.read(8, function (error, bytes, bytesRead) {
                                    if (error) {
                                        close(this, error, callback);
                                    } else {
                                        _TiffByteReader.header = new Header(bytes);
                                        callback(null, _TiffByteReader.header.ifdOffset);
                                    }
                                });
                            });
                })(_TiffByteReader);
            });
        } else {
            reads.push((callback) => {
                callback(null, startOffset);
            });
        }

        //read the length of the first IFD
        reads.push((ifdOffset, callback) => {
            ((_TiffByteReader) => {
                new BinaryReader(file)
                        .seek(ifdOffset, function (error) {
                            if (error) {
                                close(this, error, callback);
                            }
                            this.read(2, function (error, bytes, bytesRead) {
                                if (error) {
                                    close(this, error, callback);
                                } else {
                                    let bsifdcount = new IFDCount(bytes, _TiffByteReader.header.byteOrder).count;
                                    //console.log('Count: '+bsifdcount)
                                    callback(null, ifdOffset, bsifdcount);
                                }
                            });
                        });
            })(_TiffByteReader);
        });

        //now read the first IFD
        reads.push((ifdOffset, ifdcount, callback) => {
            ((_TiffByteReader) => {
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
                                    let bsifd = new IFD(bytes, _TiffByteReader.header.byteOrder);
                                    let bsifdoffset = bsifd.ifdoffset;
                                    _TiffByteReader.IFDS.push(bsifd);
                                    _TiffByteReader.nextIfdOffset = bsifdoffset;
                                    callback(null, bsifdoffset);
                                }
                            });
                        });
            })(_TiffByteReader);
        });

        async.waterfall(reads, function (err, data) {
            if (err) {
                LOG.error(JSON.stringify(err));
                cb(err);
            } else {

                //Now fill the values in the IFD...
                //iterate the IFDEntries and make a map 
                //filling values inline then and there - 
                //then push reads onto the stack to read 
                //each value.
                let fillIFDs = [];

                for (let i = 0; i < _TiffByteReader.IFDS.length; i++) {
                    let _IFD = _TiffByteReader.IFDS[i];
                    (function (_IFD) {
                        fillIFDs.push((callback) => {
                            IFD.fillResources(_IFD, callback, file, BinaryReader, _TiffByteReader);
                        });
                    })(_IFD);
                }

                async.parallel(fillIFDs, function (err, results) {
                    if (err) {
                        LOG.error(JSON.stringify(err));
                        cb(err);
                    } else {
                        LOG.info(_TiffByteReader.toString());
                        cb(null, 'Finished!');
                    }
                });


                //cb(null, 'Finished!');
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


