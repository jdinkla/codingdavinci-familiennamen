/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import express from 'express';
import ctrlMain from '../controllers/main.js';
import ctrlCsv from '../controllers/csv.js';

const router = express.Router();

router.get('/', ctrlMain.index);
router.get('/admin', ctrlMain.admin);
router.get('/analysis', ctrlMain.analysis);
router.get('/data', ctrlCsv.index);
router.get('/data/konfession.html', ctrlCsv.konfession);
router.get('/data/staat.html', ctrlCsv.staat);
router.get('/data/territorium.html', ctrlCsv.territorium);
router.get('/data/foko.html', ctrlCsv.foko);
router.get('/docs', ctrlMain.docs);
router.get('/imprint', ctrlMain.imprint);
router.get('/impressum', ctrlMain.imprint);

export default router;

