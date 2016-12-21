/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let LOG = require('../../../../logging').getLogger();
let UTILS = require('../../../../utils');

class S__EnumeratedDescriptor{
    
    constructor(){  
    }
    
}

module.exports.S__EnumeratedDescriptor=S__EnumeratedDescriptor;

/*
 * Reference Structure

        Length          Description

 *      4               Number of items
 *
 * The following is repeated for each item in reference
 *
 *      4               OSType key for type to use:
 *                      'prop' = Property
 *                      'Clss' = Class
 *                      'Enmr' = Enumerated Reference
 *                      'rele' = Offset
 *                      'Idnt' = Identifier
 *                      'indx' = Index
 *                      'name' =Name
 *
 *   Variable        Item type: see the tables below for each possible Reference type
 */


