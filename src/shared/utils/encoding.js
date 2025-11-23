/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 *
 * Shared encoding utilities used by both server and client
 */

function encode(str) {
    return encodeURI(str).replace(/\(/g, "%28").replace(/\)/g, "%29");
}

function decode(str) {
    return decodeURI(str).replace(/%28/g, '(').replace(/%29/g, ')');
}

// returns a string with tab separated names
function encodeListOfNames(arr) {
    const str = arr.join('\t');
    return encode(str);
}

// turns a string of tab separated names into a list
function decodeListOfNames(str) {
    const dec = decode(str);
    return dec.split('\t');
}

// ES Module exports
export {
    encode,
    decode,
    encodeListOfNames,
    decodeListOfNames
};

export default {
    encode,
    decode,
    encodeListOfNames,
    decodeListOfNames
};

