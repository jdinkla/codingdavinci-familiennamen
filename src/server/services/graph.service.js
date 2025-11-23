/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import graphRepository from '../models/repositories/graph.repository.js';
import { decodeListOfNames } from '../../shared/utils/encoding.js';
import _ from 'lodash';

export const getGraph1 = async (familyname) => {
    const records = await graphRepository.findGraph1(familyname);
    
    const nodes = [familyname];
    const edges = [];
    
    records.forEach(record => {
        Object.values(record).forEach(value => {
            if (Array.isArray(value)) {
                nodes.push(value[0]);
                edges.push({ source: familyname, target: value[0] });
            }
        });
    });
    
    const nodes2 = _.uniq(nodes).map(n => ({ id: n, group: 1 }));
    return { nodes: nodes2, links: edges };
};

export const getGraph2 = async (familyname) => {
    const records = await graphRepository.findGraph2(familyname);
    
    const nodes = [familyname];
    const edges = [];
    
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
    return { nodes: nodes2, links: edges };
};

export const getGraphs1 = async (encodedNames) => {
    const decoded = decodeListOfNames(encodedNames);
    const records = await graphRepository.findGraphs1(decoded);
    
    const nodes = [...decoded];
    const edges = [];
    
    records.forEach(record => {
        Object.values(record).forEach(value => {
            if (Array.isArray(value)) {
                nodes.push(value[1]);
                edges.push({ source: value[0], target: value[1] });
            }
        });
    });
    
    const nodes2 = _.uniq(nodes).map(n => ({ id: n, group: 1 }));
    return { nodes: nodes2, links: edges };
};

export const getGraphs2 = async (encodedNames) => {
    const decoded = decodeListOfNames(encodedNames);
    const records = await graphRepository.findGraphs2(decoded);
    
    const nodes = [...decoded];
    const edges = [];
    
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
    return { nodes: nodes2, links: edges };
};

export default {
    getGraph1,
    getGraph2,
    getGraphs1,
    getGraphs2
};

