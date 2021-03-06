/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var mdb = require('../models/db_maria');
var utils = require('../../public/javascripts/node_utils')
var butils = require('../../public/javascripts/browser_utils')
var _ = require('underscore');

var preparedStatementMany = mdb.prepare('\
SELECT id, familyName, begin, end, postalCode as plz, placeName, TRUNCATE(lon, 3) as lon, TRUNCATE(lat, 3) as lat \
FROM foko_d_geo \
WHERE familyname IN (:names) AND begin > 1000 \
ORDER BY familyName COLLATE utf8_german2_ci, begin;');

module.exports.many = function(req, res) {
    if (!req.params || !req.params.names) {
        return utils.sendJsonResponse(res, 400, "Missing parameter 'names'");
    }
    var names = req.params.names;
    var decoded = butils.decodeListOfNames(names);
    mdb.query(preparedStatementMany({ names: decoded }), function (err, rows) {
        // work around the umlaut problems in MariaDB
        var rows2 = _.filter(rows, x => _.contains(decoded, x.familyName));
        utils.handle(res, err, rows2);
    });

};

