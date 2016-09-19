/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var UTILS = require('./../utils');

class Header {

    order() {
        if (this.done() || this.bytes.length > 1)
            return UTILS.bin2String([this.bytes[0], this.bytes[1]]);
    }

    magic() {
        if (this.done() || this.bytes.length > 3)
            return parseInt(this.bytes.slice(2,3));
    }
    
    offset() {
        if(this.done())
            return parseInt([this.bytes[4], this.bytes[5], this.bytes[6], this.bytes[7]]);
    }
    
    done() {
        return this.bytes.length === 8;
    }

    constructor() {
        this.bytes = new Array();
    }

    addByte(b) {
        this.bytes.push(b);
    }
    
    toString(){
            let string = `[TiffHeader] Order: ${this.order()} Magic: ${this.magic()} Offset: ${this.offset()}`;
            return string;
    }

}

module.exports.Header = Header;


