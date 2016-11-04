/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

function getPandP(scale, width, height, json) {
    // create a first guess for the projection

    var center = d3.geoCentroid(json);
    //var scale  = 150;
    var offset = [width/2, height/2];
    var projection = d3.geoMercator()
        .scale(scale)
        .center(center)
        .translate(offset);

    //Define path generator
    var path = d3.geoPath().projection(projection);

    // using the path determine the bounds of the current map and use
    // these to determine better values for the scale and translation
    var bounds  = path.bounds(json);
    var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
    var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
    var scale   = (hscale < vscale) ? hscale : vscale;
    var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
        height - (bounds[0][1] + bounds[1][1])/2];

    // new projection
    projection = d3.geoMercator().center(center)
        .scale(scale/1.1).translate(offset);
    path = path.projection(projection);

    return { path: path, projection: projection };
}

// returns the century years between start and end
function getYears(start, end) {
    var result = [];

    result.push(+start);
    var current = Math.ceil(start / 100);
    var endI = end / 100;

    while (current < endI) {
        result.push(current*100);
        current++;
    }
    if (current*100 - end  < 50) {
        result.push(+end);
    }
    return result;
}

function encode(str) {
    return encodeURI(str).replace(/\(/g, "%28").replace(/\)/g, "%29");
}

function decode(str) {
    return decodeURI(str).replace(/%28/g, '(').replace(/%29/g, ')')
}

// returns a string with tab separated names
function encodeListOfNames(arr) {
    var str = arr.join('\t');
    return encode(str);
}

// turns a string of tab separated names into a list
function decodeListOfNames(str) {
    var dec = decode(str);
    return dec.split('\t');
}

function deleteAllChilds(parentId) {
    var parent = document.getElementById(parentId);
    var cs = parent.childNodes;
    for (c = 0; c < cs.length; c++) {
        parent.removeChild(cs[c]);
    }
}

function detag(tag ) {
    return tag.substring(1, tag.length);
}

if (typeof module != 'undefined') {
    module.exports = {
        getYears: getYears,
        encode: encode,
        decode: decode,
        encodeListOfNames: encodeListOfNames,
        decodeListOfNames: decodeListOfNames,
        deleteAllChilds: deleteAllChilds,
        detag: detag
    };
}
