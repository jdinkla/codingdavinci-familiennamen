import { Router } from 'express';
import type Database from 'better-sqlite3';
import { createGraphController } from '../controllers/graphController.js';

export const createGraphRoutes = (db: Database.Database): Router => {
  const router = Router();
  const controller = createGraphController(db);
  router.get('/graph', controller.graph);
  return router;
};

export default createGraphRoutes;
