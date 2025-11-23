/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import mariadb from '../database/mariadb.js';

const preparedStatementData = mariadb.prepare(`
SELECT id, familyName, begin, end, submitter, denomination, country, region, postalCode, placeName, placeURI, TRUNCATE(lon, 3) as lon, TRUNCATE(lat, 3) as lat, ort 
FROM foko_d_geo 
WHERE familyName IN (:names) 
AND begin >= 1000 
ORDER BY familyName COLLATE utf8_german2_ci, begin, end, submitter;`);

export const findFoko = async (names) => {
    const statement = preparedStatementData({ names });
    return await mariadb.queryAsync(statement.sql, statement.params);
};

export default {
    findFoko
};

