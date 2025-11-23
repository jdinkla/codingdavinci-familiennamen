/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import dataService from '../services/data.service.js';
import { sendJsonResponse } from '../utils/response.js';

export const foko = async (req, res) => {
    try {
        const names = req.params.names;
        const data = await dataService.getFokoData(names);
        sendJsonResponse(res, 200, data);
    } catch (err) {
        console.error('Error in foko controller:', err);
        if (err.message.includes('Missing parameter')) {
            sendJsonResponse(res, 400, err.message);
        } else {
            sendJsonResponse(res, 500, { error: 'Internal server error' });
        }
    }
};

export default {
    foko
};

