import express, { type Express } from 'express';
import type Database from 'better-sqlite3';
import type { ApiErrorBody } from '@familiennamen/shared';
import { createHealthRoutes } from './routes/healthRoutes.js';
import { createGraphRoutes } from './routes/graphRoutes.js';
import { createNameRoutes } from './routes/nameRoutes.js';
import { createMapRoutes } from './routes/mapRoutes.js';
import { createTimelineRoutes } from './routes/timelineRoutes.js';
import { createFokoRoutes } from './routes/fokoRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

/**
 * Builds the API-only Express app (no static client serving — that's added
 * on top in index.ts for production). Takes an already-open `db` handle so
 * tests can inject a seeded `:memory:` database.
 */
export const createApp = (db: Database.Database): Express => {
  const app = express();
  app.disable('x-powered-by');

  app.use('/api', createHealthRoutes(db));
  app.use('/api', createNameRoutes(db));
  app.use('/api', createMapRoutes(db));
  app.use('/api', createTimelineRoutes(db));
  app.use('/api', createFokoRoutes(db));
  app.use('/api', createGraphRoutes(db));

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not Found' } satisfies ApiErrorBody);
  });

  app.use(errorHandler);

  return app;
};
