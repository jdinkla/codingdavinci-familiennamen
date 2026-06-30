import { Router } from 'express';
import type Database from 'better-sqlite3';
import { createMapController } from '../controllers/mapController.js';

export const createMapRoutes = (db: Database.Database): Router => {
  const router = Router();
  const controller = createMapController(db);
  router.get('/map', controller.map);
  return router;
};

export default createMapRoutes;
