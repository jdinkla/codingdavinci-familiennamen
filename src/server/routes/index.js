/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import express from 'express';
import pagesRoutes from './pages.js';
import namesRoutes from './api/names.js';
import mapRoutes from './api/map.js';
import timelineRoutes from './api/timeline.js';
import graphRoutes from './api/graph.js';
import dataRoutes from './api/data.js';
import aliveRoutes from './api/alive.js';

const router = express.Router();

// Page routes
router.use('/', pagesRoutes);

// API routes
router.use('/api', namesRoutes);
router.use('/api', mapRoutes);
router.use('/api', timelineRoutes);
router.use('/api', graphRoutes);
router.use('/api', dataRoutes);
router.use('/api', aliveRoutes);

export default router;

