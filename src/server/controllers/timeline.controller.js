/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import timelineService from '../services/timeline.service.js';
import { sendJsonResponse } from '../utils/response.js';

export const many = async (req, res) => {
    try {
        const names = req.params.names;
        const data = await timelineService.getTimelineData(names);
        sendJsonResponse(res, 200, data);
    } catch (err) {
        console.error('Timeline controller error:', err);
        if (err.message.includes('Missing parameter')) {
            sendJsonResponse(res, 400, err.message);
        } else {
            sendJsonResponse(res, 500, { error: 'Internal server error' });
        }
    }
};

export default {
    many
};

