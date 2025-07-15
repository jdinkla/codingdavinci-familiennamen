/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import mdb from '../models/db_maria.js';
import utils from '../../public/javascripts/node_utils.js';
import _ from 'lodash';

const handle = (res, err, rows) => {
    if (err) {
        utils.error(res, err);
    } else {
        const names = _.map(rows, e => e.familyname);
        utils.success(res, names);
    }
};

const preparedStatement = mdb.prepare(`
SELECT DISTINCT familyname 
FROM foko_d_geo 
WHERE familyname = (:familyname COLLATE utf8_bin) 
AND begin > 1000`);

export const exact = async (req, res) => {
    try {
        const pattern = req.params.familyname;
        if (pattern) {
            const statement = preparedStatement({ familyname: pattern });
            const rows = await mdb.queryAsync(statement.sql, statement.params);
            const names = _.map(rows, e => e.familyname);
            utils.success(res, names);
        } else {
            utils.sendJsonResponse(res, 400, "Pattern ist undefined");
        }
    } catch (err) {
        console.error('Name exact search error:', err);
        utils.error(res, err);
    }
};

const preparedStatementLike = mdb.prepare(`
SELECT DISTINCT familyname 
FROM foko_d_geo 
WHERE familyName LIKE :pattern 
AND begin > 1000 
ORDER BY familyname COLLATE utf8_german2_ci`);

export const like = async (req, res) => {
    try {
        const pattern = req.params.pattern;
        if (pattern.length < 4) {
            utils.sendJsonResponse(res, 400, "Pattern has to have a minimal length of 4 characters");
        } else {
            const statement = preparedStatementLike({ pattern: pattern });
            const rows = await mdb.queryAsync(statement.sql, statement.params);
            const names = _.map(rows, e => e.familyname);
            utils.success(res, names);
        }
    } catch (err) {
        console.error('Name like search error:', err);
        utils.error(res, err);
    }
};

const preparedStatementRegExp = mdb.prepare(`
SELECT DISTINCT familyname 
FROM foko_d_geo 
WHERE familyName REGEXP :pattern 
AND begin > 1000 
ORDER BY familyname COLLATE utf8_german2_ci`);

export const regexp = async (req, res) => {
    try {
        const pattern = req.params.pattern;
        if (pattern.length < 4) {
            utils.sendJsonResponse(res, 400, "Pattern has to have a minimal length of 4 characters");
        } else {
            const statement = preparedStatementRegExp({ pattern: pattern });
            const rows = await mdb.queryAsync(statement.sql, statement.params);
            const names = _.map(rows, e => e.familyname);
            utils.success(res, names);
        }
    } catch (err) {
        console.error('Name regexp search error:', err);
        utils.error(res, err);
    }
};

export default {
    exact,
    like,
    regexp
};
