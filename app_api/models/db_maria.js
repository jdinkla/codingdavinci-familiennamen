/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var mdb = require( 'mariasql' );

var host = process.env.FAMVIS_MARIADB_HOST || "127.0.0.1";
var user = process.env.FAMVIS_MARIADB_USER || "family";
var pwd = process.env.FAMVIS_MARIADB_PWD || "family";

var connection;

console.log("using mariadb host '" + host + "'");

try {
    connection = new mdb({
        host: host,
        user: user,
        password: pwd,
        db: 'family',
        charset :'utf8'
    });

} catch (err) {
    console.error("Can't connect to MariaDB " + err);
}

module.exports.connection = connection




