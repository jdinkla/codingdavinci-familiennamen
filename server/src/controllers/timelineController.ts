import type { RequestHandler } from 'express';
import type Database from 'better-sqlite3';
import { getTimelineEntries } from '../services/timelineService.js';
import { requireNames } from '../validation/namesValidation.js';

export const createTimelineController = (db: Database.Database): { timeline: RequestHandler } => ({
  timeline: (req, res) => {
    const names = requireNames(req.query.names);
    res.status(200).json(getTimelineEntries(db, names));
  },
});
