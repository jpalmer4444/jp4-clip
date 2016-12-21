/* 
 * Base Resource class.
 */
let TiffTag = require('./tiff/TiffTag');
let TIFFTAGS = TiffTag.TIFFTAGS;
let reader = require('buffered-reader');
let BinaryReader = reader.BinaryReader;
let LOG = require('./logging').getLogger();
let UTILS = require('./utils');
let fs = require('fs');
let async = require('async');
let close = UTILS.close;

class PSTiffImageWriter {

    /*
     * TIFF Structure
     * {
     *      Header
     * }
     *  -------------
     *  image data
     *  -------------
     *  offset values
     *  -------------
     * {
     *      IFD0
     * }
     */

    constructor(header, ifd0, inputfilename, outputfilename, CALLBACK) {

        LOG.info('Starting to write...outputfilename: ' + outputfilename);
        //get a write stream
        let wstream = fs.createWriteStream(outputfilename);
        let endianness = ifd0.endianness;
        let updateIFD0Offset; //<-- later updated to point to new IFD Offset

        wstream.on('finish', function () {
            LOG.info('file has been written successfully! (apparently anyway...)');
            //wstream.end();
            CALLBACK(null, 'Finished writing file.');
        });

        wstream.on('error', function (err) {
            LOG.error('oh shit, Houston - we have a problem...');
            CALLBACK(err);
        });

        wstream.on('open', function () {
            LOG.info('File Open for writing');
            //write header -
            //LOG.info('Header: '+buf)
            //header ALWAYS written at offset 0
            header.write(wstream, 0);


            //header.write(wstream);
            let sourceStripOffsets = ifd0.getEntry(273).value;
            let sourceStripByteCounts = ifd0.getEntry(279).value;

            let writtenStripOffsets = [];
            let writtenStripByteCounts = [];

            let writeCalls = [];

            writeCalls.push(function (callback) {
                LOG.info('writing image data...');
                //(function(callback){
                PSTiffImageWriter.writeImageData(endianness, wstream, 8, inputfilename, sourceStripOffsets, sourceStripByteCounts, callback);
                //})(callback);
            });

            //next function will receive results of first when using waterfall.
            writeCalls.push(function (offsetCountObjs, startOffset, callback) {
                //offsetCountObjs are objects with offset and count representing our new stripOffsets and stripByteCounts
                //these values need to be updated in the existing metadata so when we later write the IFD and values - the 
                //values are correct.
                LOG.info('updating offsets...');
                for (let obj of offsetCountObjs) {
                    writtenStripOffsets.push(obj.offset);
                    writtenStripByteCounts.push(obj.count);
                }

                //now we must update the source IFDEntry for these 2 new properties
                ifd0.getEntry(273).value = writtenStripOffsets;
                ifd0.getEntry(279).value = writtenStripByteCounts;

                //now write the offset values for any entry that needs value written at offset
                for (let entry of ifd0.entries) {

                    if (entry.needsOffset()) {
                        LOG.info('writing entry offsets...at offset: ' + startOffset);
                        if (startOffset % 2 !== 0) {
                            wstream.write(new Buffer([0x00]), startOffset);
                            startOffset++;
                        }
                        //write the offsetValue then update the offsetValue in the entry itself.
                        entry.offsetValue = startOffset;
                        wstream.write(entry.rawBytes, startOffset);
                        startOffset += entry.rawBytes.length;

                    }

                }

                //now write the IFD itself last.
                LOG.info('writing IFD...at offset: ' + startOffset);
                updateIFD0Offset = startOffset;
                if (startOffset % 2 !== 0) {
                    wstream.write(new Buffer([0x00]), startOffset);
                    startOffset++;
                }
                //if you provide a callback - this method will end the file writing when it finishes writing the IFD
                //if you DO NOT provide a callback - it will just append it's content to the stream and you can keep writing.
                ifd0.write(wstream, startOffset, callback);
                

            });

            async.waterfall(writeCalls, function (err, results) {
                LOG.info('Finished with calls - waiting for file to finish being written...');
                //CALLBACK(err, results);
                wstream.end();
            });

        });
    }

    /**
     * 
     * @param {string} endianness 
     * @param {object} writer used to write the data to the filesystem
     * @param {number} startingOffset start offset to write image data in output file (should always be 8 if we are always writing the image data directly after the header)
     * @param {string} file full file path to source image file
     * @param {array} stripOffsets offsets to image strips in source image file
     * @param {array} stripByteCounts byte counts of image strips
     * @param {function} cb callback function to be called when finished writing all of the image data
     * @returns {undefined}
     */
    static writeImageData(endianness, writer, startingOffset, file, stripOffsets, stripByteCounts, cb) {
        //startingOffset at this scope should only be incremented when the functions are called
        var calls = new Array();
        //iterate strip offsets and seek to and find those strips.
        for (let i = 0; i < stripOffsets.length; i++) {
            let offset = stripOffsets[i];
            let byteCount = stripByteCounts[i];
            LOG.info('Offset: ' + offset);
            LOG.info('bytecount: ' + byteCount);
            //calls.push(function (callback) {
            ((offset, byteCount) => {
                calls.push((callback) => {
                    try {
                        LOG.info('file: ' + file);
                        let br = new BinaryReader(file);
                        LOG.info('new reader: ' + br.toString());
                        br.seek(offset, function (error) {
                            LOG.info('seeked');
                            if (error) {
                                LOG.error(error);
                                close(br, error, callback);
                            } else {
                                br.read(byteCount, function (error, bytes, bytesRead) {
                                    if (error) {
                                        LOG.error(error);
                                        close(br, error, callback);
                                    } else {
                                        LOG.info('about to write strip.');
                                        if (startingOffset % 2 !== 0) {
                                            writer.write(new Buffer([0x00]), startingOffset);
                                            startingOffset++;
                                        }
                                        writer.write(bytes, startingOffset);
                                        LOG.info('wrote strip.');
                                        let newStripOffset = startingOffset;
                                        startingOffset += bytes.length;
                                        callback(
                                                    null, {
                                                    offset: newStripOffset, 
                                                    count: bytes.length
                                                    }
                                                );
                                    }
                                });
                                close(br);
                            }
                        });
                    } catch (ex) {
                        LOG.error(ex);
                        callback(ex);
                    }
                });
            })(offset, byteCount);

            //});
        }
        //now read the strips (MUST be done in series)
        async.series(calls, function (err, results) {
            if (err) {
                cb(err);
            } else {
                cb(null, results, startingOffset);
            }
        });
    }
}

module.exports.PSTiffImageWriter = PSTiffImageWriter;


