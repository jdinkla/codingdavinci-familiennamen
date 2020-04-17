/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var mdb = require('../models/db_maria');
var utils = require('../../public/javascripts/node_utils')
var butils = require('../../public/javascripts/browser_utils')
var _ = require('underscore');

var preparedStatementData = mdb.prepare('\
SELECT id, familyName, begin, end, submitter, denomination, country, region, postalCode, placeName, placeURI, TRUNCATE(lon, 3) as lon, TRUNCATE(lat, 3) as lat, ort \
FROM foko_d_geo \
WHERE familyName IN (:names) \
AND begin >= 1000 \
ORDER BY familyName COLLATE utf8_german2_ci, begin, end, submitter;');

function foko(req, res) {
    if (!req.params || !req.params.names) {
        return utils.sendJsonResponse(res, 400, "Missing parameter 'names'");
    }
    var names = req.params.names;
    var decoded = butils.decodeListOfNames(names);
    mdb.query(preparedStatementData({ names: decoded }), function (err, rows) {
        // work around the umlaut problems in MariaDB
        var rows2 = _.filter(rows, x => _.contains(decoded, x.familyName));
        utils.handle(res, err, rows2);
    });
};

module.exports = {
    foko: foko
}
