/* 
 * 26 byte Photoshop path point record.
 * 
 *  IRB
 *  Signature: (8BIM)                                   Identifier (2999)         Variable Pascal String first unsigned byte determines length                  Size (Length of the data array)
 *  |-----------------------------------------------|   |---------------------|   |---------------------                                                    ?   |-----------------------------------------------|
 *  (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101)
 *  
 *  Path Point in IRB
 *  
 *  (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101) + (01010101)
 *  
 *   All points used in defining a path are stored in eight bytes as a pair of 32-bit components, vertical component first.
 *
 *   The two components are signed, fixed point numbers with 8 bits before the binary point and 24 bits after the binary point. 
 *   Three guard bits are reserved in the points to eliminate most concerns over arithmetic overflow. Hence, the range for each 
 *   component is 0xF0000000 to 0x0FFFFFFF representing a range of -16 to 16. The lower bound is included, but not the upper bound.
 *  
 */
var TIFFTAGS = require('./TiffTag').TIFFTAGS,
        UTILS = require('./../utils');

function readScaledInt(fourbytes, dimension) {
        return (fourbytes / 0x1000000) * dimension;
    }

class PathPoint {

    constructor(bytes26, reader){
        let index = 0;
        let width = reader.IFDS[0].getEntry(256).value;
        let height = reader.IFDS[0].getEntry(257).value;
        this.selector = bytes26['readUInt16BE'](index, 2);
        let selectorname = PathPoint.PathPointMap()[this.selector];
        if(selectorname){
            this.selector = selectorname;
        }
        index += 2;
        
        switch(this.selector){
            case 'Closed subpath length record' : 
            case 'Open subpath length record' : {
                    this.knots = bytes26['readUInt16BE'](index, 2); 
                    index+=24;
                    break;
            }
            case 'Closed subpath Bezier knot, linked' :
            case 'Closed subpath Bezier knot, unlinked' : 
            case 'Open subpath Bezier knot, linked' : 
            case 'Open subpath Bezier knot, unlinked' : {
                    this.point1a = readScaledInt(bytes26['readUInt32BE'](index, 4), height);
                index += 4;
                this.point1b = readScaledInt(bytes26['readUInt32BE'](index, 4), width);
                index += 4;
                this.point2a = readScaledInt(bytes26['readUInt32BE'](index, 4), height);
                index += 4;
                this.point2b = readScaledInt(bytes26['readUInt32BE'](index, 4), width);
                index += 4;
                this.point3a = readScaledInt(bytes26['readUInt32BE'](index, 4), height);
                index += 4;
                this.point3b = readScaledInt(bytes26['readUInt32BE'](index, 4), width);
                index += 4;
                break;
            }
            case 'Path fill rule record' : {
                    //do nothing
                    index+=24;
                    break;
            }
            case 'Clipboard record' : {
                this.top = bytes26['readUInt16BE'](index, 2);
                this.left = bytes26['readUInt16BE'](index + 2, 2);
                this.bottom = bytes26['readUInt16BE'](index + 4, 2);
                this.right = bytes26['readUInt16BE'](index + 6, 2);
                this.resolution = bytes26['readUInt16BE'](index + 8, 2);
                index+=24;
                    break;
            }
            case 'Initial fill rule record' : {
                this.fillrule = bytes26['readUInt16BE'](index, 2);
                index+=24;
                break;
            }
            default : {
                    throw new Error('No case matches!' + this.selector);
            }
        }
    }
    
    toString(){
        
        switch(this.selector){
            case 'Closed subpath length record' : 
            case 'Open subpath length record' : {
                let string = `[PathPoint] selector: ${this.selector} knots: ${this.knots}`;
                return string;
            }
            case 'Closed subpath Bezier knot, linked' :
            case 'Closed subpath Bezier knot, unlinked' : 
            case 'Open subpath Bezier knot, linked' : 
            case 'Open subpath Bezier knot, unlinked' : {
                let string = `[PathPoint] selector: ${this.selector} point1: ${this.point1a},${this.point1b} point2: ${this.point2a},${this.point2b}  point3: ${this.point3a},${this.point3b}`;
                return string;
            }
            case 'Path fill rule record' : {
                let string = `[PathPoint] selector: ${this.selector}`;
                return string;
            }
            case 'Clipboard record' : {
                let string = `[PathPoint] selector: ${this.selector} top: ${this.top} left: ${this.left} bottom: ${this.bottom} right: ${this.right}  resolution: ${this.resolution}`;
                return string;
            }
            case 'Initial fill rule record' : {
                let string = `[PathPoint] selector: ${this.selector} fill: ${this.fillrule}`;
                return string;
            }
            default : {
                    throw new Error('No case matches!' + this.selector);
            }
        }
    }
    
    static PathPointMap(){
        return {
            0: 'Closed subpath length record',
            1: 'Closed subpath Bezier knot, linked',
            2: 'Closed subpath Bezier knot, unlinked',
            3: 'Open subpath length record',
            4: 'Open subpath Bezier knot, linked',
            5: 'Open subpath Bezier knot, unlinked',
            6: 'Path fill rule record',
            7: 'Clipboard record',
            8: 'Initial fill rule record'
        };
    }
    
}

module.exports.PathPoint = PathPoint;


