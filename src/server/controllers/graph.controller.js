/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import graphService from '../services/graph.service.js';
import { sendJsonResponse } from '../utils/response.js';

export const graph1 = async (req, res) => {
    try {
        const familyname = req.params.familyname;
        const json = await graphService.getGraph1(familyname);
        sendJsonResponse(res, 200, json);
    } catch (err) {
        console.error('Graph1 error:', err);
        sendJsonResponse(res, 404, { error: err.message });
    }
};

export const graph2 = async (req, res) => {
    try {
        const familyname = req.params.familyname;
        const json = await graphService.getGraph2(familyname);
        sendJsonResponse(res, 200, json);
    } catch (err) {
        console.error('Graph2 error:', err);
        sendJsonResponse(res, 404, { error: err.message });
    }
};

export const graphs1 = async (req, res) => {
    try {
        const names = req.params.names;
        const json = await graphService.getGraphs1(names);
        sendJsonResponse(res, 200, json);
    } catch (err) {
        console.error('Graphs1 error:', err);
        sendJsonResponse(res, 404, { error: err.message });
    }
};

export const graphs2 = async (req, res) => {
    try {
        const names = req.params.names;
        const json = await graphService.getGraphs2(names);
        sendJsonResponse(res, 200, json);
    } catch (err) {
        console.error('Graphs2 error:', err);
        sendJsonResponse(res, 404, { error: err.message });
    }
};

export default {
    graph1,
    graph2,
    graphs1,
    graphs2
};

