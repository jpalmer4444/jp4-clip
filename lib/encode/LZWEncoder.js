/* 
 * Simple LZW Encoder enhanced for large strings.
 */

class LZWEncoder {

    constructor(str) {
        let encode = (s) => {
            var dict = {};
            var data = (s + "").split("");
            var out = [];
            var currChar;
            var phrase = data[0];
            var code = 256;
            for (var i = 1; i < data.length; i++) {
                currChar = data[i];
                if (dict['_' + phrase + currChar] !== null) {
                    phrase += currChar;
                } else {
                    out.push(phrase.length > 1 ? dict['_' + phrase] : phrase.charCodeAt(0));
                    dict['_' + phrase + currChar] = code;
                    code++;
                    phrase = currChar;
                }
            }
            out.push(phrase.length > 1 ? dict['_' + phrase] : phrase.charCodeAt(0));
            for (var i = 0; i < out.length; i++) {
                out[i] = String.fromCharCode(out[i]);
            }
            return out.join("");
        };
        this._encoded = encode(str);
    }

    get encoded() {
        return this._encoded;
    }

    toString() {
        return encoded;
    }

}


module.exports.LZWEncoder = LZWEncoder;