/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import express from 'express';
import graphController from '../../controllers/graph.controller.js';

const router = express.Router();

router.get('/graph1/:familyname', graphController.graph1);
router.get('/graph2/:familyname', graphController.graph2);
router.get('/graphs1/:names', graphController.graphs1);
router.get('/graphs2/:names', graphController.graphs2);

export default router;

