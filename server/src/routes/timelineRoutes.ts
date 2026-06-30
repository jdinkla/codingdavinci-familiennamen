import { Router } from 'express';
import type Database from 'better-sqlite3';
import { createTimelineController } from '../controllers/timelineController.js';

export const createTimelineRoutes = (db: Database.Database): Router => {
  const router = Router();
  const controller = createTimelineController(db);
  router.get('/timeline', controller.timeline);
  return router;
};

export default createTimelineRoutes;
