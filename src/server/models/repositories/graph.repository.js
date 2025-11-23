/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import neo4j from '../database/neo4j.js';

// Get the subgraph centered at node familyname with a distance of 1 edge
const query1 = 'MATCH (n1:Familyname)-[e1]->(n2) WHERE n1.name = $name return [ n2.name ]';

// Get the subgraph centered at node familyname with a distance of 1 or 2 edges
const query2 = 'MATCH (n1:Familyname)-[e1]->(n2)-[e2*0..1]->(n3) WHERE n1.name = $name AND n1 <> n3 return [ n2.name, n3.name ]';

// Get the subgraph centered at node familyname with a distance of 1 edge
const queryMany1 = 'MATCH (n1:Familyname)-[e1]->(n2) WHERE n1.name IN $names return [ n1.name, n2.name ]';

// Get the subgraph centered at node familyname with a distance of 1 or 2 edges
const queryMany2 = 'MATCH (n1:Familyname)-[e1]->(n2)-[e2*0..1]->(n3) WHERE n1.name IN $names AND n1 <> n3 return [ n1.name, n2.name, n3.name ]';

export const findGraph1 = async (familyname) => {
    return await neo4j.runQuery(query1, { name: familyname });
};

export const findGraph2 = async (familyname) => {
    return await neo4j.runQuery(query2, { name: familyname });
};

export const findGraphs1 = async (names) => {
    return await neo4j.runQuery(queryMany1, { names });
};

export const findGraphs2 = async (names) => {
    return await neo4j.runQuery(queryMany2, { names });
};

export default {
    findGraph1,
    findGraph2,
    findGraphs1,
    findGraphs2
};

