/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let LOG = require('./../../../logging').getLogger();
let UTILS = require('./../../../utils');
let UnicodeString = require('./../../UnicodeString').UnicodeString;

class Descriptor{
    
    constructor(bytes, endianness, index){
        this._index = index;
        let unicodeString = new UnicodeString(bytes, endianness, index);
        this._unicode = unicodeString.string;
        this._index = unicodeString.index;
        let classIdVariable = new IDVariable(bytes, endianness, index);
        this._items = new Set();
        
        
        
    }
    
    get index(){return this._index;}
    set index(index){this._index = index;}
    get unicode(){return this._unicode;}
    set unicode(unicode){this._unicode = unicode;}
    get items(){return this._items;}
    set items(items){this._items = items;}
    
}

module.exports.Descriptor=Descriptor;

/*
 * DESCRIPTOR STRUCTURE
 * 
 *  Length                              Description
 *  ----------------------------------------------------------------------------
 *  
 *  Variable                            Unicode string: name from classID
 *  
 *  Variable                            classID: 4 bytes (length), followed either 
 *                                      by string or (if length is zero) 4-byte 
 *                                      classID
 *                                      
 *  4                                   Number of items in descriptor
 *  ----------------------------------------------------------------------------
 *  The following is repeated for each item in descriptor
 *  ----------------------------------------------------------------------------
 *  
 *  Variable                            Key: 4 bytes ( length) followed either 
 *                                      by string or (if length is zero) 4-byte 
 *                                      key
 *                                      
 *  4                                   Type: OSType key
 *                                      'obj ' = Reference
 *                                      'Objc' = Descriptor
 *                                      'VlLs' = List
 *                                      'doub' = Double
 *                                      'UntF' = Unit float
 *                                      'TEXT' = String
 *                                      'enum' = Enumerated
 *                                      'long' = Integer
 *                                      'comp' = Large Integer
 *                                      'bool' = Boolean
 *                                      'GlbO' = GlobalObject same as Descriptor
 *                                      'type' = Class
 *                                      'GlbC' = Class
 *                                      'alis' = Alias
 *                                      'tdta' = Raw Data
 *                                      
 *  Variable                            Item type: see the tables below for 
 *                                      each possible type
 *  ----------------------------------------------------------------------------
 *  ----------------------------------------------------------------------------
 */

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

/*
 * PASCAL STRINGS
 * All values deined as pascal string consist of:
 * A 1-byte length field, representing the number of characters/bytes in the string.
 * The string of values, 1 byte per character.
 */



/* UNICODE STRINGS
 * All values defined as Unicode string consist of:
 * A 4-byte length field, representing the number of characters in the string (not bytes).
 * The string of Unicode values, two bytes per character.
 */




