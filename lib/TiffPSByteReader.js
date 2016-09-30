/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var IFD = require('./tiff/photoshop/IFD').IFD,
        LOG = require('./logging').getLogger(),
        async = require('async'),
        reader = require('buffered-reader'),
        BinaryReader = reader.BinaryReader,
        IFD = require('./tiff/photoshop/IFD').IFD,
        Header = require('./tiff/photoshop/Header').Header;

var close = function (binaryReader, error, callback) {
    if (error)
        LOG.error(JSON.stringify(error));

    binaryReader.close(function (error) {
        if (error)
            LOG.error(JSON.stringify(error));
        callback(error);
    });
};

class TiffPSByteReader {

    /*
     * Sort Order
     The entries in an IFD must be sorted in ascending order by Tag. Note that this is
     not the order in which the fields are described in this document. The Values to
     which directory entries point need not be in any particular order in the file.
     */

    constructor(filename, directory) {
        //holds IFDs which holds array of IFDEntry
        this.IFDS = [];
        this.filename = filename;
        this.directory = directory;
        //offset in bytes to first IFD
        this.offset = 0;
        this.header;
        this.nextIfdOffset;
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
        
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // STAGE 1 :: Read the 8 byte tif header. 
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        
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
                                        _TiffByteReader.header = new Header(bytes, _TiffByteReader.filename, _TiffByteReader.directory);
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
        
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // STAGE 2 :: Scan to first ifdOffset that was discovered in the 8 byte tif header. Then, read the 
        // first 2 bytes of the IFD0 to know how many total bytes must be read.
        // Move on to scanning and filling values next. (Can be done asynchromousy in parallel)
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////

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
                                    let bsifdcount = IFD.count(bytes, _TiffByteReader.header.endianness);
                                    callback(null, ifdOffset, bsifdcount);
                                }
                            });
                        });
            })(_TiffByteReader);
        });

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // STAGE 3 :: Read IFD0 and all IFDEntries. (withstanding values that are at random offsets [parallel]) 
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////

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
                                    let bsifd = new IFD(bytes, _TiffByteReader.header.endianness);
                                    let bsifdoffset = bsifd.ifdOffset;
                                    _TiffByteReader.IFDS.push(bsifd);
                                    _TiffByteReader.nextIfdOffset = bsifdoffset;
                                    callback(null, bsifdoffset);
                                }
                            });
                        });
            })(_TiffByteReader);
        });
        
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // STAGE 4 :: Finish the synchronous Waterfall method in order to take advantage of parallel
        // processing and V8. IFDEntries will now have raw valueOffsets - which means they might only
        // need to be read to find length and know that valueOffset already contains the value.
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        async.waterfall(reads, function (err, data) {
            if (err) {
                LOG.error(JSON.stringify(err));
                cb(err);
            } else {

                //////////////////////////////////////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////////////
                //
                // STAGE NReads :: Fill each IFDEntry that contains a value at a random offset within the tif file.
                //
                //////////////////////////////////////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////////////

                let fillIFDs = [];

                for (let i = 0; i < _TiffByteReader.IFDS.length; i++) {
                    let _IFD = _TiffByteReader.IFDS[i];
                    (function (_IFD) {
                        fillIFDs.push((callback) => {
                            IFD.fill(_IFD, callback, file, _TiffByteReader);
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

module.exports.TiffPSByteReader = TiffPSByteReader;


