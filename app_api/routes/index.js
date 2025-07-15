/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import express from 'express';
import ctrlAlive from '../controllers/alive.js';
import ctrlData from '../controllers/data.js';
import ctrlGraph from '../controllers/graph.js';
import ctrlMap from '../controllers/map.js';
import ctrlName from '../controllers/name.js';
import ctrlTimeLine from '../controllers/timeline.js';

const router = express.Router();

router.get('/alive/neo4j', ctrlAlive.neo4j);
router.get('/alive/mariadb', ctrlAlive.mariadb);

router.get('/foko/:names', ctrlData.foko);

router.get('/graph1/:familyname', ctrlGraph.graph1);
router.get('/graph2/:familyname', ctrlGraph.graph2);
router.get('/graphs1/:names', ctrlGraph.graphs1);
router.get('/graphs2/:names', ctrlGraph.graphs2);

router.get('/map/:names', ctrlMap.many);

router.get('/name/:familyname', ctrlName.exact);
router.get('/name/like/:pattern', ctrlName.like);
router.get('/name/regexp/:pattern', ctrlName.regexp);

router.get('/timeline/:names', ctrlTimeLine.many);

export default router;

