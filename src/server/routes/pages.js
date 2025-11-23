/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import express from 'express';
import pagesController from '../controllers/pages.controller.js';
import csvController from '../controllers/csv.controller.js';

const router = express.Router();

router.get('/', pagesController.index);
router.get('/admin', pagesController.admin);
router.get('/analysis', pagesController.analysis);
router.get('/data', csvController.index);
router.get('/data/konfession.html', csvController.konfession);
router.get('/data/staat.html', csvController.staat);
router.get('/data/territorium.html', csvController.territorium);
router.get('/data/foko.html', csvController.foko);
router.get('/docs', pagesController.docs);
router.get('/imprint', pagesController.imprint);
router.get('/impressum', pagesController.imprint);

export default router;

