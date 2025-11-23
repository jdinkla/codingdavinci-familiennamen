/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import neo4j from 'neo4j-driver';

const con = process.env.FAMVIS_NEO4J_CONNECTION || "localhost:7687";
const user = process.env.FAMVIS_NEO4J_USER || "neo4j";
const pwd = process.env.FAMVIS_NEO4J_PWD || "neo4jLocalPwd";

console.log(`using neo4j connection: '${con}'`);

const driver = neo4j.driver(`bolt://${con}`, neo4j.auth.basic(user, pwd), {
    encrypted: false, // Updated for modern Neo4j
    trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES'
});

// Modern async session wrapper
export const runQuery = async (cypher, params = {}) => {
    const session = driver.session();
    try {
        const result = await session.run(cypher, params);
        return result.records.map(record => record.toObject());
    } catch (error) {
        console.error('Neo4j query error:', error);
        throw error;
    } finally {
        await session.close();
    }
};

// Legacy callback wrapper for backward compatibility
export const runQueryCallback = (cypher, params, callback) => {
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }
    
    runQuery(cypher, params)
        .then(records => callback(null, records))
        .catch(err => callback(err));
};

export default {
    driver,
    session: () => driver.session(),
    runQuery,
    runQueryCallback
};

