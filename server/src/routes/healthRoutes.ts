import { Router } from 'express';
import type Database from 'better-sqlite3';
import { createHealthController } from '../controllers/healthController.js';

export const createHealthRoutes = (db: Database.Database): Router => {
  const router = Router();
  const controller = createHealthController(db);
  router.get('/health', controller.health);
  return router;
};

export default createHealthRoutes;
