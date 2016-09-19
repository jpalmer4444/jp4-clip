/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

bin2String = (array) => {
        var result = "";
        for (var i = 0; i < array.length; i++) {
            result += String.fromCharCode(parseInt(array[i]));
        }
        console.log('Bin: '+result);
        return result;
    };

module.exports.bin2String = bin2String;


