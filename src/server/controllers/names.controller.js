/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import nameService from '../services/name.service.js';
import { success, error, sendJsonResponse } from '../utils/response.js';

export const exact = async (req, res) => {
    try {
        const familyname = req.params.familyname;
        if (familyname) {
            const names = await nameService.searchExact(familyname);
            success(res, names);
        } else {
            sendJsonResponse(res, 400, "Pattern ist undefined");
        }
    } catch (err) {
        console.error('Name exact search error:', err);
        error(res, err);
    }
};

export const like = async (req, res) => {
    try {
        const pattern = req.params.pattern;
        const names = await nameService.searchLike(pattern);
        success(res, names);
    } catch (err) {
        console.error('Name like search error:', err);
        if (err.message.includes('minimal length')) {
            sendJsonResponse(res, 400, err.message);
        } else {
            error(res, err);
        }
    }
};

export const regexp = async (req, res) => {
    try {
        const pattern = req.params.pattern;
        const names = await nameService.searchRegexp(pattern);
        success(res, names);
    } catch (err) {
        console.error('Name regexp search error:', err);
        if (err.message.includes('minimal length')) {
            sendJsonResponse(res, 400, err.message);
        } else {
            error(res, err);
        }
    }
};

export default {
    exact,
    like,
    regexp
};

