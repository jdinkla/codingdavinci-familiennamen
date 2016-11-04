/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var mdb = require('../models/db_maria');
var utils = require('../../public/javascripts/node_utils')
var butils = require('../../public/javascripts/browser_utils')

var con = mdb.connection;

var preparedStatementMany = con.prepare('\
SELECT id, familyName, begin, end, postalCode as plz, placeName, TRUNCATE(lon, 3) as lon, TRUNCATE(lat, 3) as lat \
FROM foko_d_geo \
WHERE familyname IN (:names) AND begin > 1000 \
ORDER BY familyName, begin;');

module.exports.many = function(req, res) {
    if (!req.params || !req.params.names) {
        return utils.sendJsonResponse(res, 400, "Missing parameter 'names'");
    }
    var names = req.params.names;
    var decoded = butils.decodeListOfNames(names);
    con.query(preparedStatementMany({ names: decoded }), function (err, rows) {
        utils.handle(res,  err, rows);
    });

};

