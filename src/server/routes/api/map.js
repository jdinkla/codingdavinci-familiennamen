/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import express from 'express';
import mapController from '../../controllers/map.controller.js';

const router = express.Router();

router.get('/map/:names', mapController.many);

export default router;

