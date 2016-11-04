/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

function sendJsonResponse(res, status, content) {
    res.status(status);
    res.json(content);
};

function error(res, err) {
    return sendJsonResponse(res, 404, err);
};

function success(res, rows) {
    return sendJsonResponse(res, 200, rows);
}

function handle(res, err, rows) {
    if (err) {
        error(res, err);
    } else {
        success(res, rows);
    }
}

module.exports = {
    sendJsonResponse: sendJsonResponse,
    error: error,
    success: success,
    handle: handle
};
