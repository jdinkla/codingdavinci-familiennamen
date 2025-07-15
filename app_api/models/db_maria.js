/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import mariadb from 'mariadb';

const host = process.env.FAMVIS_MARIADB_HOST || "127.0.0.1";
const user = process.env.FAMVIS_MARIADB_USER || "family";
const password = process.env.FAMVIS_MARIADB_PWD || "family";

console.log(`using mariadb host '${host}'`);

// Create connection pool
const pool = mariadb.createPool({
    host: host,
    user: user,
    password: password,
    database: 'family',
    charset: 'utf8mb4',
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000
});

// Modern async/await wrapper for queries
export const query = async (sql, params = []) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql, params);
        return rows;
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
};

// Callback-style wrapper for backward compatibility
export const queryCallback = (sql, params, callback) => {
    if (typeof params === 'function') {
        callback = params;
        params = [];
    }

    query(sql, params)
        .then(rows => callback(null, rows))
        .catch(err => callback(err));
};

// Prepare statement helper
export const prepare = (sql) => {
    return (params) => {
        // Simple parameter replacement for named parameters
        let preparedSql = sql;
        if (params && typeof params === 'object') {
            for (const [key, value] of Object.entries(params)) {
                const placeholder = `:${key}`;
                if (Array.isArray(value)) {
                    const placeholders = value.map(() => '?').join(',');
                    preparedSql = preparedSql.replace(placeholder, placeholders);
                } else {
                    preparedSql = preparedSql.replace(placeholder, '?');
                }
            }
        }
        return { sql: preparedSql, params: Object.values(params || {}).flat() };
    };
};

// Legacy callback-style query method for backward compatibility
export const legacyQuery = (statement, callback) => {
    if (typeof statement === 'object' && statement.sql) {
        queryCallback(statement.sql, statement.params, callback);
    } else {
        queryCallback(statement, [], callback);
    }
};

export default {
    query: legacyQuery,
    queryAsync: query,
    prepare,
    pool
};






