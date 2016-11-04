/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var express = require('express');
var router = express.Router();

var ctrlAlive = require('../controllers/alive');
router.get('/alive/neo4j', ctrlAlive.neo4j);
router.get('/alive/mariadb', ctrlAlive.mariadb);

var ctrlData = require('../controllers/data');
router.get('/foko/:names', ctrlData.foko);

var ctrlGraph = require('../controllers/graph');
router.get('/graph1/:familyname', ctrlGraph.graph1);
router.get('/graph2/:familyname', ctrlGraph.graph2);
router.get('/graphs1/:names', ctrlGraph.graphs1);
router.get('/graphs2/:names', ctrlGraph.graphs2);

var ctrlMap = require('../controllers/map');
router.get('/map/:names', ctrlMap.many);

var ctrlName = require('../controllers/name');
router.get('/name/:familyname', ctrlName.exact);
router.get('/name/like/:pattern', ctrlName.like);
router.get('/name/regexp/:pattern', ctrlName.regexp);

var ctrlTimeLine = require('../controllers/timeline');
router.get('/timeline/:names', ctrlTimeLine.many);

module.exports = router;

