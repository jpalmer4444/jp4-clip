/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var UTILS = require('./utils'),
        IFD = require('./tiff/IFD').IFD,
        Header = require('./tiff/Header').Header;

const IN_HEAD = 1;
const OFFSET_BEFORE_IFD1 = 2;
const IN_IFD = 3;
const SEEKING = 4;

let printed = false;


class TiffReader {

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
        this.seekedbytes = 0;
        this.seeking = false;
        this.header = new Header();
        this.state = IN_HEAD;
    }
    
    read(b){
        if(Array.isArray(b)){
            for(let i = 0;i < b.length;i++){
                this.read_byte(b[i]);
            }
        }else{
            this.read_byte(b);
        }
    }
    
    read_byte(b){
        switch(this.state){
            case IN_HEAD : {
                    //add byte to header, then check if we need to switch state or not
                   this.header.addByte(b);
                   if(this.header.done()){
                       this.state = OFFSET_BEFORE_IFD1;
                   }
                break;
            }
            case OFFSET_BEFORE_IFD1 : {
                    //check if we have hit the first IFD or
                    if(this.header.offset() + 8 > this.offset){
                        //here we do nothing because we haven't hit the first IFD yet.
                        //console.log('Skipping byte');
                    }else{
                        let next = new IFD();
                        next.addByte(b);
                        this.IFDS.push(next);
                        this.state = IN_IFD;
                    }
                    break;
            }
            case IN_IFD : {
                    if(!printed){
                        console.log('In IFD offset: '+this.offset);
                        printed = true;
                    }
                    let ifd = this.IFDS[this.IFDS.length - 1];
                    ifd.addByte(b);
                    if(ifd.done()){
                        this.state = SEEKING;
                    }
                    break;
            }
            case SEEKING : {
                    let ifd = this.IFDS[this.IFDS.length - 1];
                    let nextIfdOffset = ifd.ifdoffset();
                    if(this.offset === nextIfdOffset){
                        let another = new IFD();
                        another.addByte(b);
                        this.IFDS.push(another);
                        this.state = IN_IFD;
                    }
                    break;
            }
        }
        this.offset++;
    }

    isDone() {
        let isDone = this.header.done();
        this.IFDS.forEach(function(ifd){
              if(!ifd.done())
                    isDone = false;
            });
        return isDone;
    }

    toString() {
        let string = this.header.toString() + '\n';
        for (let i = 0; i < this.IFDS.length; i++) {
            string += this.IFDS[i].toString();
        }
        return string;
    }

}

module.exports.TiffReader = function () {
    return new TiffReader();
};


