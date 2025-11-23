/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import mariadb from '../database/mariadb.js';

const preparedStatementMany = mariadb.prepare(`
SELECT id, familyName, begin, end, postalCode as plz, placeName, TRUNCATE(lon, 3) as lon, TRUNCATE(lat, 3) as lat 
FROM foko_d_geo 
WHERE familyname IN (:names) AND begin > 1000 
ORDER BY familyName COLLATE utf8_german2_ci, begin;`);

export const findByNames = async (names) => {
    const statement = preparedStatementMany({ names });
    return await mariadb.queryAsync(statement.sql, statement.params);
};

export default {
    findByNames
};

