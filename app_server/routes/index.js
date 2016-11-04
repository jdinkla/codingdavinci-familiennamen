/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlCsv = require('../controllers/csv');

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

module.exports = router;

