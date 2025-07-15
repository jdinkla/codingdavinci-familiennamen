/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

/*
 see http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object/14654988
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
function getCenturies(start, end) {
    var s = Math.ceil(start / 100);
    var e = Math.floor(end / 100);

    var result = [];

    for (var i=s; i<=e; i++) {
        result.push(i*100);
    }
    return result;
}

// returns the century years between start and end
function getYears(start, end) {
    var result = [];
    var diffLarge = 25;
    var diffSmall = 10;

    var cs = getCenturies(start, end);

    var sls = [];
    var els = [];

    // start <= cs[0]
    var diff = cs[0] - start;
    if (diff >= diffLarge) {
        sls = [start];
    } else if (diff <= diffSmall) {
        cs[0] = start; // replace first century with year
    }

    // end >= cs[idx]
    var idx = cs.length - 1;
    diff = end - cs[idx];
    if (diff >= diffLarge) {
        els = [end];
    } else if (diff <= diffSmall) {
        cs[idx] = end; // replace last century with year
    }

    var result = sls.concat(cs).concat(els);
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


/*
 see http://www.w3schools.com/jsref/prop_win_innerheight.asp
 */
function getSizes() {

    var width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

    return {
        width: width,
        height: height
    };

}

// used for checking like and regexps
function getAlphaNumChars(str) {
    return str.replace( /[^a-zA-Z0-9]/g , '');
}



// ES Module exports
export {
    getCenturies,
    getYears,
    encode,
    decode,
    encodeListOfNames,
    decodeListOfNames,
    deleteAllChilds,
    detag,
    getAlphaNumChars,
    getPandP,
    getSizes
};

export default {
    getCenturies,
    getYears,
    encode,
    decode,
    encodeListOfNames,
    decodeListOfNames,
    deleteAllChilds,
    detag,
    getAlphaNumChars,
    getPandP,
    getSizes
};
