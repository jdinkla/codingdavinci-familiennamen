/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var mdb = require('../models/db_maria');
var utils = require('../../public/javascripts/node_utils')
var _ = require('underscore');

function handle(res, err, rows) {
    console.log('handle ', res, err, rows)
    if (err) {
        utils.error(res, err);
    } else {
        var names = _.map(rows, function(e) { return e.familyname ;});
        utils.success(res, names);
    }
}

var statement = '\
SELECT DISTINCT familyname \
FROM foko_d_geo \
WHERE familyname = ? \
AND begin > 1000';

function exact(req, res) {
    var pattern = req.params.familyname
    console.log('exact', pattern);
    if (pattern) {
        mdb.query(statement, [pattern], function (err, rows) {
            console.log('exact handle', rows);
            handle(res, err, rows);
        });
    } else {
        utils.sendJsonResponse(res, 400, "Pattern ist undefined");
    }
};

var likeStatement = '\
SELECT DISTINCT familyname \
FROM foko_d_geo \
WHERE familyName LIKE ? \
AND begin > 1000 \
ORDER BY familyname COLLATE utf8_german2_ci';

function like(req, res) {
    var pattern = req.params.pattern;
    if (pattern.length < 4) {
        utils.sendJsonResponse(res, 400, "Pattern has to have a minimal length of 4 characters");
    } else {
        mdb.query(likeStatement, [pattern], function (err, rows) {
            handle(res, err, rows);
        });
    }
};

var regexpStatement = '\
SELECT DISTINCT familyname \
FROM foko_d_geo \
WHERE familyName REGEXP :pattern \
AND begin > 1000 \
ORDER BY familyname COLLATE utf8_german2_ci';

function regexp(req, res) {
    var pattern = req.params.pattern;
    if (pattern.length < 4) {
        utils.sendJsonResponse(res, 400, "Pattern has to have a minimal length of 4 characters");
    } else {
        mdb.query(regexpStatement, [pattern], function (err, rows) {
            handle(res, err, rows);
        });
    }
};


module.exports = {
    exact: exact,
    like: like,
    regexp: regexp
};
