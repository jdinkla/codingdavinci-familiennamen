import type { RequestHandler } from 'express';
import type Database from 'better-sqlite3';
import { getGraph } from '../services/graphService.js';
import { requireNames } from '../validation/namesValidation.js';
import { parseDepth } from '../validation/graphValidation.js';

export const createGraphController = (db: Database.Database): { graph: RequestHandler } => ({
  graph: (req, res) => {
    const names = requireNames(req.query.names);
    const depth = parseDepth(req.query.depth);
    res.status(200).json(getGraph(db, names, depth));
  },
});
