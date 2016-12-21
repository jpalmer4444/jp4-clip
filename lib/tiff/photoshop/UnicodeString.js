/* 
 * Represents a Unicode String.
 */

let UTILS = require('../../utils');
let LOG = require('../../logging').getLogger();

class UnicodeString{
    
    constructor(bytes, endianness, index){
        //4 bytes for unicode length
        this._index = index;
        this._length = Buffer.alloc(4, bytes.slice(this._index, this._index + 4))['readUInt32' + endianness](0, false);
        this._index += 4;
        let chars = [];
        for(let i = 0;i < this._length;i+=2,this._index+=2){
            //read 2 bytes for each Unicode String
            let character = Buffer.alloc(2, bytes.slice(this._index, this._index + 2))['readUInt16' + endianness](0, false);
            chars.push(character);
        }
        if(chars.length){
            this._string = UTILS.bin2String(chars);
        }
    }
    
    get index(){return this._index;}
    set index(index){this._index = index;}
    get length(){return this._length;}
    set length(length){this._length = length;}
    get string(){return this._string;}
    set string(string){this._string = string;}
    
    toString() {
        let string = `(Unicode) Length: ${this.length}`;
        if(this.string){
            string += `String: ${this.string}`;
        }
        return string;
    }
    
}

module.exports.UnicodeString=UnicodeString;

/* UNICODE STRINGS
 * All values defined as Unicode string consist of:
 * A 4-byte length field, representing the number of characters in the string (not bytes).
 * The string of Unicode values, two bytes per character.
 */


