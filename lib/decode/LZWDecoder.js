/* 
 * Simple LZW Decoder enhanced for large strings.
 */

class LZWDecoder {

    constructor(str) {
        let decode = (s) => {
            var dictionary = {};
            var data = (s + "").split("");
            var currentCharacter = data[0];
            var oldPhrase = currentCharacter;
            var out = [currentCharacter];
            var code = 256;
            var phrase;
            for (var i = 1; i < data.length; i++) {
                var currentCode = data[i].charCodeAt(0);
                if (currentCode < 256) {
                    phrase = data[i];
                } else {
                    phrase = dictionary['_' + currentCode] ? dictionary['_' + currentCode] : (oldPhrase + currentCharacter);
                }
                out.push(phrase);
                currentCharacter = phrase.charAt(0);
                dictionary['_' + code] = oldPhrase + currentCharacter;
                code++;
                oldPhrase = phrase;
            }
            return out.join("");
        };
        this._decoded = decode(str);
    }
    
    get decoded(){
        return this._decoded;
    }

    toString() {

    }

}

module.exports.LZWDecoder = LZWDecoder;


