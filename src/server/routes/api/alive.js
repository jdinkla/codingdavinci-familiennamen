/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import express from 'express';
import aliveController from '../../controllers/alive.controller.js';

const router = express.Router();

router.get('/alive/neo4j', aliveController.neo4j);
router.get('/alive/mariadb', aliveController.mariadb);

export default router;

