/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import express from 'express';
import namesController from '../../controllers/names.controller.js';

const router = express.Router();

router.get('/name/:familyname', namesController.exact);
router.get('/name/like/:pattern', namesController.like);
router.get('/name/regexp/:pattern', namesController.regexp);

export default router;

