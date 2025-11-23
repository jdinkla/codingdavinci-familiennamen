/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

export const sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

export const error = (res, err) => {
    return sendJsonResponse(res, 404, err);
};

export const success = (res, rows) => {
    return sendJsonResponse(res, 200, rows);
};

export const handle = (res, err, rows) => {
    if (err) {
        error(res, err);
    } else {
        success(res, rows);
    }
};

export default {
    sendJsonResponse,
    error,
    success,
    handle
};

