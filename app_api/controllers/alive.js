/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import mdb from '../models/db_maria.js';
import neo4j from '../models/db_neo4j.js';
import utils from '../../public/javascripts/node_utils.js';

const statement = 'SELECT COUNT(*) as NUM FROM foko_d_geo';

export const mariadb = async (req, res) => {
    try {
        const rows = await mdb.queryAsync(statement);
        utils.sendJsonResponse(res, 200, { status: "ok", rows: rows[0].NUM });
    } catch (err) {
        console.error('MariaDB health check error:', err);
        utils.sendJsonResponse(res, 404, { status: "error", error: err.message });
    }
};

export const neo4jCheck = async (req, res) => {
    try {
        const records = await neo4j.runQuery("MATCH (n) RETURN count(n) AS n");
        const count = records.length > 0 ? records[0].n : 0;
        utils.sendJsonResponse(res, 200, { status: "ok", rows: count });
    } catch (err) {
        console.error('Neo4j health check error:', err);
        utils.sendJsonResponse(res, 404, { status: "error", error: err.message });
    }
};

// Legacy callback version for backward compatibility
export const mariadbLegacy = (req, res) => {
    mdb.query(statement, (err, rows) => {
        if (err) {
            return utils.sendJsonResponse(res, 404, { status: "error", error: err });
        } else {
            return utils.sendJsonResponse(res, 200, { status: "ok", rows: rows[0].NUM });
        }
    });
};

export default {
    mariadb,
    neo4j: neo4jCheck,
    mariadbLegacy
};

