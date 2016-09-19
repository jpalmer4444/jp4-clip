/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var UTILS = require('./../utils');

const T_BYTE = 1;
const T_ASCII = 2;
const T_SHORT = 3;
const T_LONG = 4;
const T_RATIONAL = 5;
const T_SBYTE = 6;
const T_UNDEFINED = 7;
const T_SSHORT = 8;
const T_SLONG = 9;
const T_SRATIONAL = 10;
const T_FLOAT = 11;
const T_DOUBLE = 12;



class IFDEntry {

    //12 bytes

    constructor() {
        this.bytes = new Array();
        this._tag;
        this._count;
        this._type;
        this._valueoffset;
    }

    get _tag() {
        return this.tag();
    }

    get _count() {
        return this.count();
    }

    get _type() {
        return this.type();
    }

    get _valueoffset() {
        return this.valueoffset();
    }

    tag() {
        if (this.bytes.length > 1)
            return parseInt(this.bytes.slice(0, 1));
    }

    count() {
        if (this.bytes.length > 6)
            return parseInt(this.bytes.slice(4, 7));
    }

    valueoffset() {
        if (this.bytes.length > 10)
            return parseInt(this.bytes.slice(8, 11));
    }

    /**
     *  Bytes at indices 2 and 3.
     The field Type.
     * @returns {unresolved}
     */
    type() {
        if (this.bytes.length > 2)
            return parseInt(this.bytes.slice(2, 3));
    }

    holdsvalue() {
        return this.typebytes() < 5;
    }

    addByte(b) {
        this.bytes.push(b);
    }

    done() {
        return this.bytes.length === 12;
    }

    toString() {
        let string = `[IFDEntry] Tag: ${this.tag()} Type: ${IFDEntry.TYPE_DESC(this.type())} Count: ${this.count()} Done: ${this.done()}`;
        return string;
    }

////////////////////////////////////////////////////////
//
// STATIC METHODS
//
////////////////////////////////////////////////////////
    static TYPE_BYTES(t) {
        if (typeof t === 'string' || typeof t === 'object') {
            t = new Number(t);
        }
        switch (t) {
            case T_SBYTE:
            case T_UNDEFINED :
            case T_BYTE :
            case T_ASCII :
            {
                return 1 * count();
            }
            case T_SSHORT :
            case T_SHORT :
            {
                return 2 * count();
            }
            case T_DOUBLE :
            case T_SRATIONAL :
            case T_RATIONAL :
            {
                return 8 * count();
            }
            case T_LONG :
            case T_SLONG :
            case T_FLOAT :
            {
                return 4 * count();
            }
            //NOT FOUND
            default :
            {
                return t + '';
            }
        }
    }

    static TYPE_DESC(t) {
        if (typeof t === 'string' || typeof t === 'object') {
            t = new Number(t);
        }
        switch (t) {
            case T_SBYTE:
            {
                return 'SBYTE';
            }
            case T_UNDEFINED :
            {
                return 'UNDEFINED';
            }
            case T_BYTE :
            {
                return 'BYTE';
            }
            case T_ASCII :
            {
                return 'ASCII';
            }
            case T_SSHORT :
            {
                return 'SSHORT';
            }
            case T_SHORT :
            {
                return 'SHORT';
            }
            case T_DOUBLE :
            {
                return 'DOUBLE';
            }
            case T_SRATIONAL :
            {
                return 'SRATIONAL';
            }
            case T_RATIONAL :
            {
                return 'RATIONAL';
            }
            case T_LONG :
            {
                return 'LONG';
            }
            case T_SLONG :
            {
                return 'SLONG';
            }
            case T_FLOAT :
            {
                return 'FLOAT';
            }
            //NOT FOUND
            default :
            {
                return t + '';
            }
        }
    }

}

module.exports.IFDEntry = IFDEntry;


/*
 
 Bytes 0-1
 The Tag that identifies the field.
 
 Bytes 2-3
 The field Type.
 
 Bytes 4-7
 The number of values, Count of the indicated Type
 
 Bytes 8-11
 The Value Offset, the file offset (in bytes) of the Value for the field.
 The Value is expected to begin on a word boundary; the corresponding 
 Value Offset will thus be an even number. This file offset may
 point anywhere in the file, even after the image data
 
 IFD Terminology
 A TIFF field is a logical entity consisting of TIFF tag and its value. This logical 
 concept is implemented as an IFD Entry, plus the actual value if it doesn’t fit into
 the value/offset part, the last 4 bytes of the IFD Entry. The terms TIFF field and
 IFD entry are interchangeable in most contexts.
 
 Value/Offset
 To save time and space the Value Offset contains the Value instead of pointing to the Value 
 if and only if the Value fits into 4 bytes. If the Value is shorter than 4
 bytes, it is left-justified within the 4-byte Value Offset, i.e., stored in the lower-
 numbered bytes. Whether the Value fits within 4 bytes is determined by the Type
 and Count of the field.
 Count
 Count—called Length in previous versions of the specification—is the number of
 values. Note that Count is not the total number of bytes. For example, a single 16-
 bit word (SHORT) has a Count of 1; not 2.
 Types
 The field types and their sizes are:
 1 = BYTE 8-bit unsigned integer.
 2 = ASCII 8-bit byte that contains a 7-bit ASCII code; the last byte must be NUL (binary zero).
 3 = SHORT 16-bit (2-byte) unsigned integer.
 4 = LONG 32-bit (4-byte) unsigned integer.
 5 = RATIONAL Two LONGs:  the first represents the numerator of a fraction; the second, the denominator.
 
 The value of the Count part of an ASCII field entry includes the NUL. 
 If padding is necessary, the Count does not include the pad byte. 
 *Note that there is no initial "count byte" as in Pascal-style strings.
 
 Any ASCII field can contain multiple strings, each terminated with a NUL. A
 single string is preferred whenever possible. The Count for multi-string fields is
 the number of bytes in all the strings in that field plus their terminating NUL
 bytes. Only one NUL is allowed between strings, so that the strings following the
 first string will often begin on an odd byte.
 The reader must check the type to verify that it contains an expected value. TIFF
 currently allows more than 1 valid type for some fields. For example, ImageWidth
 and ImageLength are usually specified as having type SHORT. But images with
 more than 64K rows or columns must use the LONG field type.
 TIFF readers should accept BYTE, SHORT, or LONG values for any unsigned
 integer field. This allows a single procedure to retrieve any integer value, makes
 reading more robust, and saves disk space in some situations.
 In TIFF 6.0, some new field types have been defined:
 
 6 = SBYTE An 8-bit signed (twos-complement) integer.
 7 = UNDEFINED An 8-bit byte that may contain anything, depending on the definition of the field.
 8 = SSHORT A 16-bit (2-byte) signed (twos-complement) integer.
 9 = SLONG A 32-bit (4-byte) signed (twos-complement) integer.
 10 = SRATIONAL Two SLONG’s:  the first represents the numerator of a fraction, the second the denominator.
 11 = FLOAT Single precision (4-byte) IEEE format.
 12 = DOUBLE Double precision (8-byte) IEEE format.
 These new field types are also governed by the byte order (II or MM) in the TIFF
 header.
 
 Fields are arrays
 Each TIFF field has an associated  Count. This means that all fields are actually
 one-dimensional arrays, even though most fields contain only a single value.
 For example, to store a complicated data structure in a single private field, use
 the UNDEFINED field type and set the Count to the number of bytes required to
 hold the data structure.
 
 */












