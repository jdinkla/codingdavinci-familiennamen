/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import mariadb from '../models/database/mariadb.js';
import neo4j from '../models/database/neo4j.js';
import { sendJsonResponse } from '../utils/response.js';

const statement = 'SELECT COUNT(*) as NUM FROM foko_d_geo';

export const mariadbCheck = async (req, res) => {
    try {
        const rows = await mariadb.queryAsync(statement);
        const count = Number(rows[0].NUM);
        sendJsonResponse(res, 200, { status: "ok", rows: count });
    } catch (err) {
        console.error('MariaDB health check error:', err);
        sendJsonResponse(res, 404, { status: "error", error: err.message });
    }
};

export const neo4jCheck = async (req, res) => {
    try {
        const records = await neo4j.runQuery("MATCH (n) RETURN count(n) AS n");
        const count = records.length > 0 ? records[0].n : 0;
        sendJsonResponse(res, 200, { status: "ok", rows: count });
    } catch (err) {
        console.error('Neo4j health check error:', err);
        sendJsonResponse(res, 404, { status: "error", error: err.message });
    }
};

export default {
    mariadb: mariadbCheck,
    neo4j: neo4jCheck
};

