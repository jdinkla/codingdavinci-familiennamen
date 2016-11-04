/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var neo4j = require('neo4j-driver').v1;

var con = process.env.FAMVIS_NEO4J_CONNECTION || "localhost:7687";
var user = process.env.FAMVIS_NEO4J_USER || "neo4j";
var pwd = process.env.FAMVIS_NEO4J_PWD || "gra91PH";

console.log("using neo4j connection: '" + con + "'");

var driver = neo4j.driver("bolt://" + con, neo4j.auth.basic(user, pwd), {
    trust: "TRUST_ON_FIRST_USE",
    encrypted:true
});

module.exports = {
    driver: driver,
    session: function() {
        return driver.session();
    }
};


