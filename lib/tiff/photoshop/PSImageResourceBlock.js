/* 
 * Photoshop IRB
 */
let LOG = require('../../logging').getLogger();
let UTILS = require('../../utils');
let TiffTag = require('../TiffTag');
let Resource = require('./Resource').Resource;
let PascalString = require('./PascalString').PascalString;
let TIFFTAGS = TiffTag.TIFFTAGS;


class PSImageResourceBlock{
    
    constructor(bytes, reader){
        this._resources = new Set();
        this._index = 0;
        this._byteLength = bytes.length;
        finished:
        while(true){
            try{
                this._index = PSImageResourceBlock.scanTo8BIM(this._index, bytes, reader);
                if(this._index !== -1){
                    let sigBuf = Buffer.alloc(4, bytes.slice(this._index, this._index + 4));
                    let signature = UTILS.bin2String(
                        [
                            sigBuf['readInt' + reader.header.endianness](0, 1, false),
                            sigBuf['readInt' + reader.header.endianness](1, 1, false),
                            sigBuf['readInt' + reader.header.endianness](2, 1, false),
                            sigBuf['readInt' + reader.header.endianness](3, 1, false)
                        ]
                        );
                    //sanity check
                    if(!PSImageResourceBlock.is8BIM(signature)){
                        break finished;
                    }
                    this._index += 4;
                    let identifier = Buffer.alloc(2, bytes.slice(this._index, this._index + 2))['readUInt16BE']();
                    this._index+=2;
                    let pascalString = new PascalString(bytes, reader.header.endianness, this._index);
                    this._index = pascalString.index;
                    //(bytes, pascalString, identifier, signature, reader)
                    let resource = new Resource(bytes.slice(this._index, bytes.length), pascalString, identifier, signature, reader);
                    this._resources.add(resource);
                    this._index + resource.index;//update index according to resource length.
                }else{
                    LOG.info('Finished index: '+this._index);
                    break finished;
                }
            }catch(error){
                LOG.error(error);
                break;
            }
        }
        
    }
    
    get resources(){
        return this._resources;
    }
    
    set resources(resources){
        this._resources = resources;
    }
    
    get index(){
        return this._index;
    }
    
    set index(index){
        this._index = index;
    }
    
    get byteLength(){
        return this._byteLength;
    }
    
    set byteLength(byteLength){
        this._byteLength = byteLength;
    }
    
    toString() {
        let string = `  |   +  [Photoshop directory, ${this.byteLength} bytes]`;
        for (let resource of this.resources.values()) {
            string += '\n';
            string += resource.toString();
        }
        return string;
    }
    
    /**
     * Tests whether or not the passed string has
     * 8BIM signature.
     * @param {string} _8bim
     * @returns {Boolean}
     */
    static is8BIM(_8bim){
        return _8bim === '8BIM';
    }
    
    /**
     * Scans byte array until it encounters the end of the array or ASCII characters matching '8BIM';
     * @param {number} pos offset of data
     * @param {array} bytes array of raw bytes
     * @param {object} reader
     * @returns {Number} index of next 8BIM marker or -1 if it doesn't exist.
     */
    static scanTo8BIM(pos, bytes, reader){
        let i = pos, 
            _8BIM, 
            buf = Buffer.alloc(bytes.length, bytes);
        do {
            //console.log('Doing!')
            _8BIM = UTILS.bin2String(
                        [
                            buf['readInt' + reader.header.endianness](i, 1, false),
                            buf['readInt' + reader.header.endianness](i+1, 1, false),
                            buf['readInt' + reader.header.endianness](i+2, 1, false),
                            buf['readInt' + reader.header.endianness](i+3, 1, false)
                        ]
                        );
                i++;
                //console.log(_8BIM);
        } while ( (i + 4) < bytes.length && !PSImageResourceBlock.is8BIM(_8BIM) );
        //return index of 8BIM byte offset
        return i < bytes.length - 4 ? (i-1) : -1;
    }
    
}

module.exports.PSImageResourceBlock = PSImageResourceBlock;


