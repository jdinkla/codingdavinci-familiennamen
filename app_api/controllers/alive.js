/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var mdb = require('../models/db_maria');
var neo4j = require('../models/db_neo4j');
var utils = require('../../public/javascripts/node_utils');

var c = mdb.connection;

var preparedStatement = c.prepare('SELECT COUNT(*) as NUM FROM foko_d_geo');

module.exports.mariadb = function(req, res) {
    c.query(preparedStatement(), function (err, rows) {
        if (err) {
            return utils.sendJsonResponse(res, 404, { status: "error", error: err });
        } else {
            return utils.sendJsonResponse(res, 200, { status: "ok", rows: rows[0].NUM });
        }
    });

};

module.exports.neo4j = function(req, res) {
    var rows = [];
    var session = neo4j.session();
    session
        .run("MATCH (n) RETURN count(n) AS n")
        .subscribe({
            onNext: function(record) {
                rows += record.get("n");
            },
            onCompleted: function() {
                session.close();
                neo4j.driver.close();
                return utils.sendJsonResponse(res, 200, { status: "ok", rows: rows });
            },
            onError: function(err) {
                session.close();
                neo4j.driver.close();
                utils.sendJsonResponse(res, 404, { status: "error", error: err });
            }
        });

};

