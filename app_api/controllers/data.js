/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import mdb from '../models/db_maria.js';
import utils from '../../public/javascripts/node_utils.js';
import butils from '../../public/javascripts/browser_utils.js';
import _ from 'lodash';

const preparedStatementData = mdb.prepare(`
SELECT id, familyName, begin, end, submitter, denomination, country, region, postalCode, placeName, placeURI, TRUNCATE(lon, 3) as lon, TRUNCATE(lat, 3) as lat, ort 
FROM foko_d_geo 
WHERE familyName IN (:names) 
AND begin >= 1000 
ORDER BY familyName COLLATE utf8_german2_ci, begin, end, submitter;`);

export const foko = async (req, res) => {
    try {
        if (!req.params || !req.params.names) {
            return utils.sendJsonResponse(res, 400, "Missing parameter 'names'");
        }
        
        const names = req.params.names;
        const decoded = butils.decodeListOfNames(names);
        const statement = preparedStatementData({ names: decoded });
        
        const rows = await mdb.queryAsync(statement.sql, statement.params);
        
        // work around the umlaut problems in MariaDB
        const filteredRows = _.filter(rows, x => _.includes(decoded, x.familyName));
        
        utils.sendJsonResponse(res, 200, filteredRows);
    } catch (err) {
        console.error('Error in foko controller:', err);
        utils.sendJsonResponse(res, 500, { error: 'Internal server error' });
    }
};

// Legacy callback version for backward compatibility
export const fokoLegacy = (req, res) => {
    if (!req.params || !req.params.names) {
        return utils.sendJsonResponse(res, 400, "Missing parameter 'names'");
    }
    const names = req.params.names;
    const decoded = butils.decodeListOfNames(names);
    mdb.query(preparedStatementData({ names: decoded }), (err, rows) => {
        // work around the umlaut problems in MariaDB
        const rows2 = _.filter(rows, x => _.includes(decoded, x.familyName));
        utils.handle(res, err, rows2);
    });
};

export default {
    foko,
    fokoLegacy
};
