/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import express from 'express';
import dataController from '../../controllers/data.controller.js';

const router = express.Router();

router.get('/foko/:names', dataController.foko);

export default router;

