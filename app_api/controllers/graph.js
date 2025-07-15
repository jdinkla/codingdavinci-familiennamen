/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import neo4j from '../models/db_neo4j.js';
import utils from '../../public/javascripts/node_utils.js';
import butils from '../../public/javascripts/browser_utils.js';
import _ from 'lodash';

// Get the subgraph centered at node familyname with a distance of 1 edge
const query1 = 'MATCH (n1:Familyname)-[e1]->(n2) WHERE n1.name = $name return [ n2.name ]';

export const graph1 = async (req, res) => {
    try {
        const familyname = req.params.familyname;
        const nodes = [familyname];
        const edges = [];
        
        const records = await neo4j.runQuery(query1, { name: familyname });
        
        records.forEach(record => {
            Object.values(record).forEach(value => {
                if (Array.isArray(value)) {
                    nodes.push(value[0]);
                    edges.push({ source: familyname, target: value[0] });
                }
            });
        });
        
        const nodes2 = _.uniq(nodes).map(n => ({ id: n, group: 1 }));
        const json = { nodes: nodes2, links: edges };
        
        utils.sendJsonResponse(res, 200, json);
    } catch (err) {
        console.error('Graph1 error:', err);
        utils.sendJsonResponse(res, 404, { error: err.message });
    }
};

// Get the subgraph centered at node familyname with a distance of 1 or 2 edges
const query2 = 'MATCH (n1:Familyname)-[e1]->(n2)-[e2*0..1]->(n3) WHERE n1.name = $name AND n1 <> n3 return [ n2.name, n3.name ]';

export const graph2 = async (req, res) => {
    try {
        const familyname = req.params.familyname;
        const nodes = [familyname];
        const edges = [];
        
        const records = await neo4j.runQuery(query2, { name: familyname });
        
        records.forEach(record => {
            Object.values(record).forEach(value => {
                if (Array.isArray(value)) {
                    nodes.push(value[0]);
                    edges.push({ source: familyname, target: value[0] });
                    if (value[0] !== value[1]) {
                        nodes.push(value[1]);
                        edges.push({ source: value[0], target: value[1], value: 1 });
                    }
                }
            });
        });
        
        const nodes2 = _.uniq(nodes).map(n => ({ id: n, group: 1 }));
        const json = { nodes: nodes2, links: edges };
        
        utils.sendJsonResponse(res, 200, json);
    } catch (err) {
        console.error('Graph2 error:', err);
        utils.sendJsonResponse(res, 404, { error: err.message });
    }
};

// Get the subgraph centered at node familyname with a distance of 1 edge
const queryMany1 = 'MATCH (n1:Familyname)-[e1]->(n2) WHERE n1.name IN $names return [ n1.name, n2.name ]';

export const graphs1 = async (req, res) => {
    try {
        const names = req.params.names;
        const decoded = butils.decodeListOfNames(names);
        const nodes = [...decoded];
        const edges = [];
        
        const records = await neo4j.runQuery(queryMany1, { names: decoded });
        
        records.forEach(record => {
            Object.values(record).forEach(value => {
                if (Array.isArray(value)) {
                    nodes.push(value[1]);
                    edges.push({ source: value[0], target: value[1] });
                }
            });
        });
        
        const nodes2 = _.uniq(nodes).map(n => ({ id: n, group: 1 }));
        const json = { nodes: nodes2, links: edges };
        
        utils.sendJsonResponse(res, 200, json);
    } catch (err) {
        console.error('Graphs1 error:', err);
        utils.sendJsonResponse(res, 404, { error: err.message });
    }
};

// Get the subgraph centered at node familyname with a distance of 1 or 2 edges
const queryMany2 = 'MATCH (n1:Familyname)-[e1]->(n2)-[e2*0..1]->(n3) WHERE n1.name IN $names AND n1 <> n3 return [ n1.name, n2.name, n3.name ]';

export const graphs2 = async (req, res) => {
    try {
        const names = req.params.names;
        const decoded = butils.decodeListOfNames(names);
        const nodes = [...decoded];
        const edges = [];
        
        const records = await neo4j.runQuery(queryMany2, { names: decoded });
        
        records.forEach(record => {
            Object.values(record).forEach(value => {
                if (Array.isArray(value)) {
                    nodes.push(value[1]);
                    edges.push({ source: value[0], target: value[1] });
                    if (value[1] !== value[2]) {
                        nodes.push(value[2]);
                        edges.push({ source: value[1], target: value[2], value: 1 });
                    }
                }
            });
        });
        
        const nodes2 = _.uniq(nodes).map(n => ({ id: n, group: 1 }));
        const json = { nodes: nodes2, links: edges };
        
        utils.sendJsonResponse(res, 200, json);
    } catch (err) {
        console.error('Graphs2 error:', err);
        utils.sendJsonResponse(res, 404, { error: err.message });
    }
};

export default {
    graph1,
    graph2,
    graphs1,
    graphs2
};
