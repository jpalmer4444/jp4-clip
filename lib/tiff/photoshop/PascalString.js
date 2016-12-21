/* 
 * Responsible for parsing Pascal Strings
 */

let UTILS = require('../../utils');
let LOG = require('../../logging').getLogger();

class PascalString {

    constructor(bytes, endianness, index) {
        //read length of Pascal string
        this._index = index;
        this._length = Buffer.alloc(1, bytes.slice(this._index, this._index + 1))['readInt8'](0, false);
        this._index++;
        if (this._length <= 0) {
            //pascals are null padded
            this._index++;
            this._string = '';
            //do nothing
        } else {
            let chunks = new Array();
            for (let i = 0; i < this._length; i++) {
                chunks.push(Buffer.alloc(1, bytes[this._index++])['readUInt' + endianness](0, 1));
            }
            if ((this._length + 1) % 2 !== 0) {
                this._index++;
            }
            this._string = UTILS.bin2String(chunks);
        }
    }
    
    get index(){
        return this._index;
    }
    
    set index(index){
        this._index = index;
    }
    
    get length(){
        return this._length;
    }
    
    set length(length){
        this._length = length;
    }
    
    get string(){
        return this._string;
    }
    
    set string(string){
        this._string = string;
    }

}

module.exports.PascalString = PascalString;