/* 
 * Image Resource Block. 
 */

var UTILS = require('./../utils'),
        PathPoint = require('./PathPoint').PathPoint,
        TiffTag = require('./TiffTag'),
        LOG = require('./../logging').getLogger();

let readPascalString = function (pInput, endianness) {

    let length = pInput.readUInt8(6);

    if (length === 0) {
        return "";
    }

    let nameArr = [];
    let index = 7;
    for (let i = 0; i < length; i++) {
        nameArr.push(pInput['readInt' + endianness](this.index++, 1));
    }
    return UTILS.bin2String(nameArr);
};

let parser = (bytes, idx, pos, method) => {
    switch (pos) {
        case 'SIG' :
        {
            let sig = '';
            for (let i = 0; i < bytes.length; i++) {
                sig += String.fromCharCode(parseInt(bytes[i]));
            }
            return sig;
        }
        case 'IDEN' :
        {
            return bytes[method](idx, 2);
        }
    }
};

let clippingpath = (buffer, length, index, reader, irb) => {
    //must be a multiple of 26
    if ((length - index) % 26 !== 0) { //remaining must be a multiple of 26
        throw new Error('PathPoint records not a multiple of 26!');//something is wrong!
    } else {
        //build out the PathPoints.
        for (; index < length; index += 26) {
            let point = new PathPoint(buffer.slice(index, index + 26), reader);
            irb.resources.push(point);
        }

    }
};

let little = (val) => {
    return val === TiffTag.LITTLE_ENDIAN_MARK_TIF;
};

class IRB {

    constructor(bytes, reader) {
        this.resources = [];
        let index;
        let opts = {};
        function readIt(input, endianness, opts) {
            let index = 0;
            while (true && opts.identifier !== 2000) {
                try {
                    opts.signature = UTILS.binToString([input['readInt8' + endianness](index++), input['readInt8' + endianness](index++), input['readInt8' + endianness](index++), input['readInt8' + endianness](index++)]);
                    if (opts.type !== '8BIM') {
                        throw new Error("Wrong image resource type expected 8BIM got " + opts.signature);
                    }
                    opts.identifier = input['readUInt16' + endianness](index);
                    index += 2;
                } catch (e) {
                    break;
                }
            }
            return index;
        }
        function readSub(resourceId, input, endianness, opts) {
            opts.name = readPascalString(input, endianness);

            // Skip pad
            let nameSize = opts.name.length + 1;
            if (nameSize % 2 !== 0) {
                opts.index++;
            }
            opts.size = input['readUInt32' + endianness](index);
            opts.index += 4;
        }
        let littleEndian = little(reader.header.byteOrder);
        let endianness = littleEndian ? 'LE' : 'BE';
        this.resources = [];
        let buf = Buffer.alloc(bytes.length, bytes);
        readIt(buf, endianness, opts);
        readSub(this.identifier, buf, endianness, opts);
        this.index = opts.index;
        this.name = opts.name;
        this.size = opts.size;
        this.signature = opts.signature;
        this.identifier = opts.identifier;

        if (this.identifier === 2000) {
            LOG.info('Found Clipping Path.');
            //(buffer, length, index, reader, irb)
            clippingpath(Buffer.alloc(bytes.length, bytes), bytes.length, this.index, reader, this);
        } else {
            LOG.info('No Clipping Path: ' + opts.identifier);
            //PUT BYTES IN RESOURCES???????????
        }

    }

    toString() {
        let string = `[IRB BEGIN] Count: ${this.resources.length}`;
        for (let i = 0; i < this.resources.length; i++) {
            string += '\n';
            string += this.resources[i].toString();
        }
        string += '\n';
        string += '[IRB END]';
        return string;
    }

}

module.exports.IRB = IRB;

class PSDReader {

    constructor(input, endianness, irb) {
        this.resource;
        let index = 0;
        while (true) {
            try {
                irb.signature = UTILS.binToString([input['readInt8' + endianness](index++), input['readInt8' + endianness](index++), input['readInt8' + endianness](index++), input['readInt8' + endianness](index++)]);
                if (irb.type !== '8BIM') {
                    throw new Error("Wrong image resource type expected 8BIM got " + irb.signature);
                }
                irb.identifier = input['readUInt16' + endianness](index);
                index += 2;
            } catch (e) {
                break;
            }
        }
    }

}

class PSDResource {

    constructor(resourceId, input, endianness, irb) {
        this.index;


        this.id = resourceId;

        irb.name = readPascalString(input, endianness);

        // Skip pad
        let nameSize = irb.name.length + 1;
        if (nameSize % 2 !== 0) {
            this.index++;
        }

        this.size = input['readUInt32' + endianness](index);
        this.index += 4;

    }
}


