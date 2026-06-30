import type { RequestHandler } from 'express';
import type Database from 'better-sqlite3';
import { searchExact, searchLike, searchRegexp } from '../services/nameService.js';
import { requirePattern } from '../validation/patternValidation.js';

export const createNameController = (
  db: Database.Database
): { exact: RequestHandler; like: RequestHandler; regexp: RequestHandler } => ({
  // `:familyname`/`:pattern` are single (non-wildcard) route segments, so Express
  // always supplies a plain string here, never an array or undefined; the
  // `string | string[] | undefined` widening on req.params.* is just
  // @types/express's generic ParamsDictionary index signature plus
  // noUncheckedIndexedAccess, not a real runtime possibility for these routes.
  exact: (req, res) => {
    res.status(200).json(searchExact(db, req.params.familyname as string));
  },
  like: (req, res) => {
    const pattern = requirePattern(req.params.pattern as string);
    res.status(200).json(searchLike(db, pattern));
  },
  regexp: (req, res) => {
    const pattern = requirePattern(req.params.pattern as string);
    res.status(200).json(searchRegexp(db, pattern));
  },
});
