import type { RequestHandler } from 'express';
import type Database from 'better-sqlite3';
import { getHealthStatus } from '../services/healthService.js';

export const createHealthController = (db: Database.Database): { health: RequestHandler } => ({
  health: (_req, res) => {
    const result = getHealthStatus(db);
    res.status(result.status === 'ok' ? 200 : 503).json(result);
  },
});
