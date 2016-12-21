/* 
 * Resource Model Class
 * Holds:
 * Path Point Components as bezier curves.
 */

let LOG = require('../../../logging').getLogger();

const ENDIANNESS = 'BE';

function readScaledInt(fourbytes, dimension) {
        return (fourbytes / 0x1000000) * dimension;
    }

class PathResource{
    
    constructor(bytes, reader){
        //call super 
        let buf = Buffer.alloc(bytes.length, bytes);
        this._selector = buf['readUInt16' + ENDIANNESS](0, false);
        let width = reader.IFDS[0].getEntry(256).value;
        let height = reader.IFDS[0].getEntry(257).value;
        let selectorname = PathResource.PathPointMap()[this._selector];
        if(selectorname){
            this._selector = selectorname;
        }
        switch(this._selector){
            case 'Closed subpath length record' : 
            case 'Open subpath length record' : {
                    this._knots = buf['readUInt16' + ENDIANNESS](2, false); 
                    this._index += 24;
                    break;
            }
            case 'Closed subpath Bezier knot, linked' :
            case 'Closed subpath Bezier knot, unlinked' : 
            case 'Open subpath Bezier knot, linked' : 
            case 'Open subpath Bezier knot, unlinked' : {
                    //the control point for the Bezier segment preceding the knot (vertical component first)
                    this._point1a = readScaledInt(buf['readUInt32' + ENDIANNESS](2, false), height);
                    //same control point (horizontal component)
                    this._point1b = readScaledInt(buf['readUInt32' + ENDIANNESS](6, false), width);
                    //the anchor point for the knot (vertical component first)
                    this._point2a = readScaledInt(buf['readUInt32' + ENDIANNESS](10, false), height);
                    //same anchor point (horizontal component)
                    this._point2b = readScaledInt(buf['readUInt32' + ENDIANNESS](14, false), width);
                    //the control point for the Bezier segment leaving the knot (vertical component first)
                    this._point3a = readScaledInt(buf['readUInt32' + ENDIANNESS](18, false), height);
                    //same control point (horizontal component)
                    this._point3b = readScaledInt(buf['readUInt32' + ENDIANNESS](22, false), width);
                    this._index += 24;
                    break;
            }
            case 'Path fill rule record' : {
                    //do nothing
                    this._index += 24;
                    break;
            }
            case 'Clipboard record' : {
                    this._top = buf['readUInt16' + ENDIANNESS](2, false);
                    this._left = buf['readUInt16' + ENDIANNESS](4, false);
                    this._bottom = buf['readUInt16' + ENDIANNESS](6, false);
                    this._right = buf['readUInt16' + ENDIANNESS](8, false);
                    this._resolution = buf['readUInt16' + ENDIANNESS](10, false);
                    this._index += 24;
                    break;
            }
            case 'Initial fill rule record' : {
                this._fillrule = buf['readUInt16' + ENDIANNESS](2, false);
                break;
            }
            default : {
                    break;
            }
        }
        
    }
    
    //accessors and mutators
    get selector(){return this._selector;}
    set selector(selector){this._selector = selector;}
    get knots(){return this._knots;}
    set knots(knots){this._knots = knots;}
    get point1a(){return this._point1a;}
    set point1a(point1a){this._point1a = point1a;}
    get point1b(){return this._point1b;}
    set point1b(point1b){this._point1b = point1b;}
    get point2a(){return this._point2a;}
    set point2a(point2a){this._point2a = point2a;}
    get point2b(){return this._point2b;}
    set point2b(point2b){this._point2b = point2b;}
    get point3a(){return this._point3a;}
    set point3a(point3a){this._point3a = point3a;}
    get point3b(){return this._point3b;}
    set point3b(point3b){this._point3b = point3b;}
    get top(){return this._top;}
    set top(top){this._top = top;}
    get left(){return this._left;}
    set left(top){this._left = left;}
    get bottom(){return this._bottom;}
    set bottom(bottom){this._bottom = bottom;}
    get right(){return this._right;}
    set right(right){this._right = right;}
    get resolution(){return this._resolution;}
    set resolution(resolution){this._resolution = resolution;}
    get fillrule(){return this._fillrule;}
    set fillrule(fillrule){this._fillrule = fillrule;}
    
    toString(){
        
        switch(this.selector){
            case 'Closed subpath length record' : 
            case 'Open subpath length record' : {
                let string = `  |   |   |        (LGTH)   ${this.selector} Knots: ${this.knots}`;
                return string;
            }
            case 'Closed subpath Bezier knot, linked' :
            case 'Closed subpath Bezier knot, unlinked' : 
            case 'Open subpath Bezier knot, linked' : 
            case 'Open subpath Bezier knot, unlinked' : {
                let string = `  |   |   |        (CRVE)   ${this.selector} Before: (v:${PathResource.formatPoint(this.point1a)}, h:${PathResource.formatPoint(this.point1b)}) Anchor: (v:${PathResource.formatPoint(this.point2a)}, h:${PathResource.formatPoint(this.point2b)})  After: (v:${PathResource.formatPoint(this.point3a)}, h:${PathResource.formatPoint(this.point3b)})`;
                return string;
            }
            case 'Path fill rule record' : {
                let string = `  |   |   |        (PFIL)   ${this.selector}`;
                return string;
            }
            case 'Clipboard record' : {
                let string = `  |   |   |        (CLIP)   ${this.selector} (Bounding Box) Top: ${this.top} Left: ${this.left} Bottom: ${this.bottom} Right: ${this.right}  resolution: ${this.resolution}`;
                return string;
            }
            case 'Initial fill rule record' : {
                let string = `  |   |   |        (IFIL)   ${this.selector} fill: ${this.fillrule}`;
                return string;
            }
            default : {
                let string = `  |   |   |        (ERR!)   ${this.selector}: ${this.fillrule} <-- Selector not found!`;
                return string;
            }
        }
    }
    
    static formatPoint(int){
        return new Number(int.toString().match(/^\d+(?:\.\d{0,3})?/));
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

module.exports.PathResource = PathResource;


