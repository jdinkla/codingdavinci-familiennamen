import { Router } from 'express';
import type Database from 'better-sqlite3';
import { createNameController } from '../controllers/nameController.js';

export const createNameRoutes = (db: Database.Database): Router => {
  const router = Router();
  const controller = createNameController(db);
  router.get('/name/like/:pattern', controller.like);
  router.get('/name/regexp/:pattern', controller.regexp);
  router.get('/name/:familyname', controller.exact);
  return router;
};

export default createNameRoutes;
