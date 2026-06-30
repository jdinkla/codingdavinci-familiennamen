import type { RequestHandler } from 'express';
import type Database from 'better-sqlite3';
import { getMapPoints } from '../services/mapService.js';
import { requireNames } from '../validation/namesValidation.js';

export const createMapController = (db: Database.Database): { map: RequestHandler } => ({
  map: (req, res) => {
    const names = requireNames(req.query.names);
    res.status(200).json(getMapPoints(db, names));
  },
});
