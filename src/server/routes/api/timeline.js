/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import express from 'express';
import timelineController from '../../controllers/timeline.controller.js';

const router = express.Router();

router.get('/timeline/:names', timelineController.many);

export default router;

