/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import mdb from '../models/db_maria.js';
import utils from '../../public/javascripts/node_utils.js';
import butils from '../../public/javascripts/browser_utils.js';
import _ from 'lodash';

const preparedStatementMany = mdb.prepare(`
SELECT id, familyName name, begin, end, country, postalCode plz, ort, placeUri 
FROM foko_d_geo 
WHERE familyName IN (:names) 
AND begin >= 1000 
ORDER BY familyName COLLATE utf8_german2_ci, begin, end;`);

export const many = async (req, res) => {
    try {
        if (!req.params || !req.params.names) {
            return utils.sendJsonResponse(res, 400, "Missing parameter 'names'");
        }
        
        const names = req.params.names;
        const decoded = butils.decodeListOfNames(names);
        const statement = preparedStatementMany({ names: decoded });
        
        const rows = await mdb.queryAsync(statement.sql, statement.params);
        
        // work around the umlaut problems in MariaDB
        const filteredRows = _.filter(rows, x => _.includes(decoded, x.name));
        
        utils.sendJsonResponse(res, 200, filteredRows);
    } catch (err) {
        console.error('Timeline controller error:', err);
        utils.sendJsonResponse(res, 500, { error: 'Internal server error' });
    }
};

export default {
    many
};


