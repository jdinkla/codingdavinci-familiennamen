import type Database from 'better-sqlite3';
import type { NameSearchResult } from '@familiennamen/shared';
import { compareGerman } from '../db/connection.js';

interface FamilyNameRow {
  family_name: string;
}

/**
 * Exact family-name search. Original used `familyname = (:familyname
 * COLLATE utf8_bin)` to force a binary-exact comparison against MariaDB's
 * default case/accent-insensitive collation; SQLite's `=` is already
 * binary-exact, so no collation clause is needed here.
 */
export const searchExact = (db: Database.Database, familyName: string): NameSearchResult => {
  const rows = db
    .prepare('SELECT DISTINCT family_name FROM foko_geo WHERE family_name = ? AND begin > 1000')
    .all(familyName) as FamilyNameRow[];
  return rows.map((row) => row.family_name);
};

/**
 * LIKE-pattern family-name search. The original ordered via `ORDER BY
 * familyname COLLATE utf8_german2_ci` in SQL; better-sqlite3 has no working
 * collation support, so the distinct rows are fetched unordered and then
 * sorted in JS with `compareGerman` (see db/connection.ts).
 */
export const searchLike = (db: Database.Database, pattern: string): NameSearchResult => {
  const rows = db
    .prepare('SELECT DISTINCT family_name FROM foko_geo WHERE family_name LIKE ? AND begin > 1000')
    .all(pattern) as FamilyNameRow[];
  return rows.map((row) => row.family_name).sort(compareGerman);
};

/**
 * REGEXP-pattern family-name search. Same shape as `searchLike`, but using
 * the REGEXP SQL operator registered in db/connection.ts. A malformed
 * pattern surfaces as `InvalidRegexpError`, caught centrally by
 * errorHandler.ts and mapped to a 400.
 */
export const searchRegexp = (db: Database.Database, pattern: string): NameSearchResult => {
  const rows = db
    .prepare('SELECT DISTINCT family_name FROM foko_geo WHERE family_name REGEXP ? AND begin > 1000')
    .all(pattern) as FamilyNameRow[];
  return rows.map((row) => row.family_name).sort(compareGerman);
};
