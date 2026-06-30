import { Router } from 'express';
import type Database from 'better-sqlite3';
import { createFokoController } from '../controllers/fokoController.js';

export const createFokoRoutes = (db: Database.Database): Router => {
  const router = Router();
  const controller = createFokoController(db);
  router.get('/foko', controller.foko);
  router.get('/foko-sample', controller.fokoSample);
  return router;
};

export default createFokoRoutes;
