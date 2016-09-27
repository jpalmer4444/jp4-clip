/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var UTILS = require('./../utils'),
        PathPoint = require('./PathPoint').PathPoint,
        TiffTag = require('./TiffTag'),
        TIFFTAGS = TiffTag.TIFFTAGS,
        LOG = require('./../logging').getLogger();

function decimalToHexString(number)
{
    if (number < 0)
    {
    	number = 0xFFFFFFFF + number + 1;
    }

    return number.toString(16).toUpperCase();
}

let pascal = {
    length(buffer, offset) {
        return buffer.readInt8(offset ? offset : 0, false);
    },
    string(buf, idx, endianness) {
        let lgth = this.length(buf.slice(idx, idx + 1), 0);
        idx++;
        if (lgth === 0) {
            return {
                buffer: buf,
                string: '',
                index: idx,
                length: lgth
            };
        }
        let nameArr = [];
        for (let i = 0; i < lgth; i++, idx++) {
            nameArr.push(buf['readUInt' + endianness](idx, 1));
        }
        if ((lgth + 1) % 2 !== 0) {
            idx++;
        }
        return {
            buffer: buf,
            string: UTILS.bin2String(nameArr),
            index: idx,
            length: lgth
        };
    }
};

class Resource {
    
    constructor(identifier, pascalstring, reader) {
        let index = pascalstring.index;
        let buffer = pascalstring.buffer;
        let pstring = pascalstring.string;
        this.identifier = identifier;
        this.points = [];
        this.name = pstring;
        this.nameLength = pascalstring.length;
        this.size = Resource.readSize(buffer, index);
        index += 4;
        this.value = buffer.slice(index, index + this.size, false);
        switch(this.identifier){
            case 2000 : {
                    Resource.populatePathPoints(reader, this);
                    break;
            }
            default : {
                    //do nothing here - leave value unparsed.
            }
        }
        // Data is even-padded (word aligned)
        if (this.size % 2 !== 0) {
            index++;
        }
        this.index = index;
    }

    toString() {
        let string = `[ResourceEntry Begin] identifier: ${this.identifier} name: ${this.name} value: ${this.value} size: ${this.size}`;
        string += '\n';
        for(let i = 0;i < this.points.length;i++){
            string+=this.points[i].toString();
            string += '\n';
        }
        string += '\n';
        string += '[ResourceEntry End]';
        return string;
    }
    
    static populatePathPoints(reader, resource){
        for(let i = 0;i < resource.value.length;i+=26){
            let pathpoint = new PathPoint(resource.value.slice(i, i+26), reader);
            resource.points.push(pathpoint);
        }
    }

    static readSize(buffer, index) {
        //Path Points are written in BigEndian format regardless.
        let size = buffer.slice(index, index + 4)['readUInt32BE'](0, false);
        return size;
    }
};

class PhotoshopImageResourceBlock {

    constructor(bytes, reader) {
        let endianness = reader.header.byteOrder === 'II' ? 'LE' : 'BE';
        this.index = 0;
        let buf = Buffer.alloc(bytes.length, bytes);
        this.resources = [];
        while (true) {
            try {
                let id = UTILS.bin2String(
                        [
                            bytes[this.index],
                            bytes[this.index + 1],
                            bytes[this.index + 2],
                            bytes[this.index + 3]
                        ]
                        );
                this.index += 4;


                if (id !== '8BIM') {
                    LOG.info('NOT 8BIM: ' + id + ' INDEX: ' + this.index + ' LENGTH: ' + bytes.length);
                    throw new Error();
                } else {
                    //Path Points always written in Big-Endian ByteOrder.
                    let type = buf.readUInt16BE(this.index, false);
                    this.index+=2;
                    let pascalstring = pascal.string(buf, this.index, endianness);
                    this.index = pascalstring.index;
                    let buffer = pascalstring.buffer;
                    let pstring = pascalstring.string;
                    let resource = new Resource(type, pascalstring, reader);
                    this.resources.push(resource); //resourceId, name, value
                    this.index = resource.index;
                }
            } catch (e) {
                //catch the error we just threw and break out
                break;
            }
        }
    }

    toString() {
        let string = `[PHIRB BEGIN] Count: ${this.resources.length}`;
        for (let i = 0; i < this.resources.length; i++) {
            string += '\n';
            string += this.resources[i].toString();
        }
        string += '\n';
        string += '[PHIRB END]';
        return string;
    }

}

module.exports.PhotoshopImageResourceBlock = PhotoshopImageResourceBlock;