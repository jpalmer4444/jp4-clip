/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

IFDEntry = require('./IFDEntry').IFDEntry;

const IN_COUNT = 1;
const IN_ENTRIES = 2;
const IN_OFFSET = 3;

class IFD {

    //returns number of IFDEntries
    //
    count() {
        if (this.bytes.length === 2)
            return parseInt(this.bytes.slice(0, 1));
        return -1;
    }

    entry(i) {
        return this.entries[i];
    }

    ifdoffset() {
        //if (this.offset.length === 4)
            return parseInt(this.offset.slice(8, 11));
    }

    constructor() {
        this.entries = new Array();
        this.bytes = new Array();
        this.offset = new Array();
        this.state = IN_COUNT;
    }

    addByte(b) {
        switch (this.state) {
            case IN_COUNT:
            {
                this.bytes.push(b);
                if (this.count() !== -1) {
                    this.state = IN_ENTRIES;
                }
                break;
            }
            case IN_ENTRIES :
            {
                let entry = this.entries[this.entries.length - 1];
                if (entry && !entry.done()) {
                    entry.addByte(b);
                    if(entry.done() && this.count() === this.entries.length){
                        this.state = IN_OFFSET;
                    }
                }else {
                    let another = new IFDEntry();
                    another.addByte(b);
                    this.entries.push(another);
                }
                break;
            }
            case IN_OFFSET :
            {
                this.offset.push(b);
                break;
            }
        }
                this.processed++;
    }

    adddByte(b) {
        //here we have to fill entries after filling count
        if (!this.count()) {
            this.bytes.push(b);
        } else {

            let entry = this.entries[this.entries.length - 1];

            //we are always taking the last entry and checking if it is done()
            //if not - then we are adding the byte to the entry
            if (entry && !entry.done()) {

                //add this byte to this entry
                entry.addByte(b);

            } else {

                //here we have to know whether to continue adding bytes to the last IFDEntry or 
                //is it time to fill the offset
                if (this.count() === -1 || this.count() > this.entries.length) {
                    //create a new entry and add it to entries.
                    //console.log('LastEntry: '+(entry ? entry.toString() : 'No Entry.'));
                    let another = new IFDEntry();
                    another.addByte(b);
                    this.entries.push(another);

                } else {
                    //here we are filling valueOffset
                    this.offset.push(b);

                }

            }

        }
        this.processed++;
    }

    //done would mean we have an array of IFDEntry's all full with length matching count
    done() {
        return (this.bytes.length > 2) && ((this.count() * 12) + 4) === this.processed;
    }

    toString() {
        let string = `[IFD BEGIN] Count: ${this.count()} `;
        //for (let i = 0; i < this.entries.length; i++) {
            string += '\n';
            string += this.entries[0].toString();
        //}
        string += '\n';
        string += `[offset-to-next-ifd: ${this.ifdoffset()}]`;
        string += '[IFD END]';
        return string;
    }

}

module.exports.IFD = IFD;


