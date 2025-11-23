/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import mariadb from '../database/mariadb.js';

const preparedStatement = mariadb.prepare(`
SELECT DISTINCT familyname 
FROM foko_d_geo 
WHERE familyname = (:familyname COLLATE utf8_bin) 
AND begin > 1000`);

const preparedStatementLike = mariadb.prepare(`
SELECT DISTINCT familyname 
FROM foko_d_geo 
WHERE familyName LIKE :pattern 
AND begin > 1000 
ORDER BY familyname COLLATE utf8_german2_ci`);

const preparedStatementRegExp = mariadb.prepare(`
SELECT DISTINCT familyname 
FROM foko_d_geo 
WHERE familyName REGEXP :pattern 
AND begin > 1000 
ORDER BY familyname COLLATE utf8_german2_ci`);

export const findExact = async (familyname) => {
    const statement = preparedStatement({ familyname });
    return await mariadb.queryAsync(statement.sql, statement.params);
};

export const findLike = async (pattern) => {
    const statement = preparedStatementLike({ pattern });
    return await mariadb.queryAsync(statement.sql, statement.params);
};

export const findRegexp = async (pattern) => {
    const statement = preparedStatementRegExp({ pattern });
    return await mariadb.queryAsync(statement.sql, statement.params);
};

export default {
    findExact,
    findLike,
    findRegexp
};

