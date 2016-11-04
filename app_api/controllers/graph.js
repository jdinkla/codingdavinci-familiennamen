/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var neo4j = require('../models/db_neo4j');
var utils = require('../../public/javascripts/node_utils')
var butils = require('../../public/javascripts/browser_utils')
var _ = require('underscore')

// Get the subgraph centered at node familyname with a distance of 1 edge
var query1 = '\
MATCH (n1:Familyname)-[e1]->(n2) WHERE n1.name = {name} return [ n2.name ] \
';

module.exports.graph1 = function(req, res) {
    var familyname = req.params.familyname;
    var nodes = [familyname];
    var edges = [];
    var session = neo4j.session();
    session
        .run(query1, {name: familyname})
        .subscribe({
            onNext: function (record) {
                record.forEach(function(value, key) {
                    nodes.push(value[0]);
                    edges.push({source: familyname, target: value[0]});
                });
            },
            onCompleted: function () {
                session.close();
                var nodes2 = _.uniq(nodes).map(function(n) {
                   return {id: n, group: 1};
                });
                var json = { nodes: nodes2, links: edges };
                return utils.sendJsonResponse(res, 200, json);
            },
            onError: function (err) {
                session.close();
                return utils.sendJsonResponse(res, 404, err);
            }
        });

};

// Get the subgraph centered at node familyname with a distance of 1 or 2 edges
var query2 = '\
MATCH (n1:Familyname)-[e1]->(n2)-[e2*0..1]->(n3) WHERE n1.name = {name} AND n1 <> n3 return [ n2.name, n3.name ] \
';

module.exports.graph2 = function(req, res) {
    var familyname = req.params.familyname;
    var accum = [];
    var nodes = [familyname];
    var edges = [];
    var session = neo4j.session();
    session
        .run(query2, {name: familyname})
        .subscribe({
            onNext: function (record) {
                record.forEach(function(value, key) {
                    nodes.push(value[0]);
                    edges.push({source: familyname, target: value[0]});
                    if (value[0] != value[1]) {
                        nodes.push(value[1]);
                        edges.push({source: value[0], target: value[1], value: 1});
                    }
                });
            },
            onCompleted: function () {
                session.close();
                var nodes2 = _.uniq(nodes).map(function(n) {
                    return {id: n, group: 1};
                });
                var json = { nodes: nodes2, links: edges };
                return utils.sendJsonResponse(res, 200, json);
            },
            onError: function (err) {
                session.close();
                return utils.sendJsonResponse(res, 404, err);
            }
        });

};



// Get the subgraph centered at node familyname with a distance of 1 edge
var queryMany1 = '\
MATCH (n1:Familyname)-[e1]->(n2) WHERE n1.name IN {names} return [ n1.name, n2.name ] \
';

module.exports.graphs1 = function(req, res) {
    var names = req.params.names;
    var decoded = butils.decodeListOfNames(names);
    var nodes = decoded;
    var edges = [];
    var session = neo4j.session();
    session
        .run(queryMany1, {names: decoded})
        .subscribe({
            onNext: function (record) {
                record.forEach(function(value, key) {
                    nodes.push(value[1]);
                    edges.push({source: value[0], target: value[1]});
                });
            },
            onCompleted: function () {
                session.close();
                var nodes2 = _.uniq(nodes).map(function(n) {
                    return {id: n, group: 1};
                });
                var json = { nodes: nodes2, links: edges };
                return utils.sendJsonResponse(res, 200, json);
            },
            onError: function (err) {
                session.close();
                return utils.sendJsonResponse(res, 404, err);
            }
        });

};

// Get the subgraph centered at node familyname with a distance of 1 or 2 edges
var queryMany2 = '\
MATCH (n1:Familyname)-[e1]->(n2)-[e2*0..1]->(n3) WHERE n1.name IN {names} AND n1 <> n3 return [ n1.name, n2.name, n3.name ] \
';

module.exports.graphs2 = function(req, res) {
    var names = req.params.names;
    var decoded = butils.decodeListOfNames(names);
    var accum = [];
    var nodes = decoded;
    var edges = [];
    var session = neo4j.session();
    session
        .run(queryMany2, {names: decoded})
        .subscribe({
            onNext: function (record) {
                record.forEach(function(value, key) {
                    nodes.push(value[1]);
                    edges.push({source: value[0], target: value[1]});
                    if (value[1] != value[2]) {
                        nodes.push(value[2]);
                        edges.push({source: value[1], target: value[2], value: 1});
                    }
                });
            },
            onCompleted: function () {
                session.close();
                var nodes2 = _.uniq(nodes).map(function(n) {
                    return {id: n, group: 1};
                });
                var json = { nodes: nodes2, links: edges };
                return utils.sendJsonResponse(res, 200, json);
            },
            onError: function (err) {
                session.close();
                return utils.sendJsonResponse(res, 404, err);
            }
        });

};
