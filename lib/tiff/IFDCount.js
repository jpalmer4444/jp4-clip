/* 
 * Responsible for reading number of directory entries for an IFD.
 */
var binstruct = require('binstruct');


class IFDCount{
    
    constructor(twoBytes, byteOrder) {
        if (byteOrder === 'II') {
            this._bin_structure_definition = binstruct.def().uint16le('count1').wrap(new Buffer(twoBytes));
        } else {
            this._bin_structure_definition = binstruct.def().uint16be('count1').wrap(new Buffer(twoBytes));
        }
        this.count = this._bin_structure_definition.count1;
    }

    toString() {
        let string = `[IFDCount] Count: ${this.count}`;
        return string;
    }
    
}

module.exports.IFDCount = IFDCount;