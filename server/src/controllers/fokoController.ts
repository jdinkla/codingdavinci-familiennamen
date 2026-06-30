import type { RequestHandler } from 'express';
import type Database from 'better-sqlite3';
import { getFokoRecords, getFokoSample } from '../services/fokoService.js';
import { requireNames } from '../validation/namesValidation.js';

export const createFokoController = (
  db: Database.Database
): { foko: RequestHandler; fokoSample: RequestHandler } => ({
  foko: (req, res) => {
    const names = requireNames(req.query.names);
    res.status(200).json(getFokoRecords(db, names));
  },
  fokoSample: (_req, res) => {
    res.status(200).json(getFokoSample(db));
  },
});
