/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var host = process.env.FAMVIS_MARIADB_HOST || "127.0.0.1";
var user = process.env.FAMVIS_MARIADB_USER || "family";
var pwd = process.env.FAMVIS_MARIADB_PWD || "family";

mockExports = {
    query: function (statement, callback) {
        callback(null, [])
    },
    prepare: function (statement) {
        return (params) => statement
    }
}
module.exports = mockExports

var useMariaSQL = true

if (useMariaSQL) {
    const mdb = require('mariadb/callback');
    console.log("using mariadb host '" + host + "'");
    var connection;
    try {
        connection = mdb.createConnection({
            host: host,
            user: user,
            password: pwd,
            db: 'family',
            charset :'utf8'
        });
    
        connection.on('error', function(err){
            console.error(err);
            return { status: "error", error: err };
        });
    
        connection.on('connect', function(){
            console.log("connected to mariadb");
        });
    
    } catch (err) {
        console.error(err);
    }

    var mariaSqlExports = {
        query: function (statement, callback) {
            console.log('query ', statement)
            connection.query(statement, callback)
        }, 
        prepare: function (statement) {
            return (params) => statement
        }
    }
    
    module.exports = mariaSqlExports
}






