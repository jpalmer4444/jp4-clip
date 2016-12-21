/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let LOG = require('../../../logging').getLogger();

class UnsupportedResource{
    
    constructor(bytes, reader){
        this._value = bytes;
        this._index = 0;
    }
    
    get value(){return this._value;}
    set value(value){this._value = value;}
    get index(){return this._index;}
    set index(index){this._index = index;}
    
    toString(){
        return `Unsupported`;
    }
    
}

module.exports.UnsupportedResource = UnsupportedResource;


