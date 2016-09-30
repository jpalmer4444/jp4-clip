/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let UTILS = require('../../utils');

class Header{

    constructor(first8Bytes, filename, directory) {
        let buf = Buffer.alloc(first8Bytes.length, first8Bytes);
        this._filename = filename;
        this._directory = directory;
        //char
        this._byteOrder = UTILS.bin2String([buf.readInt8(0, false), buf.readInt8(1, false)]);
        this._endianness = this.byteOrder === 'II' ? 'LE' : 'BE';
        //word
        this._magicNumber = buf['readUInt16' + this.endianness](2, false);
        //dword
        this._ifdOffset = buf['readUInt32' + this.endianness](4, false);
    }
    
    get byteOrder(){
        return this._byteOrder;
    }
    
    set byteOrder(bo){
        this._byteOrder = bo;
    }
    
    get filename(){
        return this._filename;
    }
    
    set filename(fn){
        this._filename = fn;
    }
    
    get directory(){
        return this._directory;
    }
    
    set directory(d){
        this._directory = d;
    }
    
    get endianness(){
        return this._endianness;
    }
    
    set endianness(e){
        this._endianness = e;
    }
    
    get magicNumber(){
        return this._magicNumber;
    }
    
    set magicNumber(mn){
        this._magicNumber = mn;
    }
    
    get ifdOffset(){
        return this._ifdOffset;
    }
    
    set ifdOffset(ifdOffset){
        this._ifdOffset = ifdOffset;
    }
    
    /*
     * ExifToolVersion = 10.20
  FileName = 6e23dac9-3572-40d1-8b2a-a880f49d1027.tif
  Directory = /u/local/jpalmer/jp4-clip/resources
  FileSize = 6273937
  FileModifyDate = 1475026281
  FileAccessDate = 1475033599
  FileInodeChangeDate = 1475026289
  FilePermissions = 33188
  FileType = TIFF
  FileTypeExtension = TIF
  MIMEType = image/tiff
  ExifByteOrder = II

     */

    toString() {
        let string =    `\n  MagicNumber = ${this.magicNumber}\n`;
            string +=   `  Filename = ${this.filename}\n`;
            string +=   `  Endianness = ${this.endianness}\n`;
            string +=   `  Directory = ${this.directory}\n`;
            string +=   `  MIMEType = image/tiff\n`;
            string +=   `  ExifByteOrder = ${this.byteOrder}`;
        return string;
    }

}

module.exports.Header = Header;

