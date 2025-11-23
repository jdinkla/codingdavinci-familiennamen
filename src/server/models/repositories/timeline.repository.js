/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import mariadb from '../database/mariadb.js';

const preparedStatementMany = mariadb.prepare(`
SELECT id, familyName name, begin, end, country, postalCode plz, ort, placeUri 
FROM foko_d_geo 
WHERE familyName IN (:names) 
AND begin >= 1000 
ORDER BY familyName COLLATE utf8_german2_ci, begin, end;`);

export const findByNames = async (names) => {
    const statement = preparedStatementMany({ names });
    return await mariadb.queryAsync(statement.sql, statement.params);
};

export default {
    findByNames
};

