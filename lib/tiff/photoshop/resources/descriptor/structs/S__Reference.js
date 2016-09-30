/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let LOG = require('../../../../logging').getLogger();
let UTILS = require('../../../../utils');

class S__Reference{
    
    constructor(bytes, index, endianness){  
        
        this._index = index;
        //number of items in this descriptor...
        this._count = Buffer.alloc(4, bytes.slice(this._index, this._index + 4))['readUInt32' + endianness](0, false);
        this._index += 4;
        this._type = Buffer.alloc(4, bytes.slice(this._index, this._index + 4))['readUInt32' + endianness](0, false);
        this._index += 4;
        //switch on type to find out what we are referencing and what the sturcture is to read it.
        switch(this._type){
            case '' : {}
        }
        
    }
    
}

module.exports.S__Reference=S__Reference;

////////////////////////////////////////////////////////////////////////////////
// REFERENCE
////////////////////////////////////////////////////////////////////////////////

/*
 * Reference Structure
 *
 *      Length          Description
 *      ------------------------------------------------------------------------
 *
 *      4               Number of items
 *      ------------------------------------------------------------------------
 *      The following is repeated for each item in reference
 *      ------------------------------------------------------------------------
 *
 *      4               OSType key for type to use:
 *                      'prop' = Property
 *                      'Clss' = Class
 *                      'Enmr' = Enumerated Reference
 *                      'rele' = Offset
 *                      'Idnt' = Identifier
 *                      'indx' = Index
 *                      'name' = Name
 *                      
 *      Variable        Item type: see the tables below for each possible 
 *                      Reference type
 *      ------------------------------------------------------------------------
 *      ------------------------------------------------------------------------
 */


