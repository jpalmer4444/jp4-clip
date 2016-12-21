/* 
 * IDVariable
 *  Variable
 *  classID: 4 bytes (length), followed either by string or (if length is zero) 4-byte classID
 */

let UTILS = require('../../utils');
let LOG = require('../../logging').getLogger();

class IDVariable {

    constructor(bytes, endianness, index) {
        //
        this._index = index;
        this._length = Buffer.alloc(4, bytes.slice(this._index, this._index + 4))['readUInt32' + endianness](0, false);
        this._index += 4;
        //if length is zero - then we expect to find 4 more bytes with the ID (Class or Key)
        if (this._length > 0) {
            let chars = [];
            for (let i = 0; i < this._length; i ++, this._index ++) {
                //read 2 bytes for each Unicode String
                let character = Buffer.alloc(1, bytes.slice(this._index, this._index + 1))['readUInt' + endianness](0, 1, false);
                chars.push(character);
            }
            if (chars.length) {
                this._string = UTILS.bin2String(chars);
            }
        } else {
            //here we have no length and expect to find a 4 byte ID
            this._id = Buffer.alloc(4, bytes.slice(this._index, this._index + 4))['readUInt32' + endianness](0, false);
            this._index += 4;
        }
    }

    toString() {
        let string = `IDVariable length: ${this.length}`;
        if(!this.length){
            
        }else{
            
        }
        return string;
    }

}

module.exports.IDVariable = IDVariable;



