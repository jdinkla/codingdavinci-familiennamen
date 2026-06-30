import type Database from 'better-sqlite3';
import type { MapPoint } from '@familiennamen/shared';
import { compareGerman, compareNullableAsc, truncate3 } from '../db/connection.js';

interface MapRow {
  id: number;
  familyName: string;
  begin: number | null;
  end: number | null;
  plz: string | null;
  placeName: string | null;
  lon: number;
  lat: number;
}

/**
 * Ports the original `map.js` `many` query.
 *
 * Two deliberate deviations from the foko/timeline groups, both preserved
 * from the original rather than "fixed":
 *  - `begin > 1000` (strictly greater), not `>= 1000`.
 *  - Drops the original's post-query lodash umlaut workaround entirely —
 *    it only compensated for MariaDB's accent-insensitive default
 *    collation; SQLite's `IN (...)` is binary-exact already.
 *
 * `TRUNCATE(lon/lat, 3)` has no SQLite equivalent, so it's applied in JS via
 * `truncate3` on each returned row. Ordering (`ORDER BY familyName COLLATE
 * utf8_german2_ci, begin`) likewise has no SQL-level equivalent here (no
 * working collation support in better-sqlite3), so rows are fetched
 * unordered and sorted in JS: German-phonebook order on familyName, then
 * numeric `begin` ascending.
 */
export const getMapPoints = (db: Database.Database, names: string[]): MapPoint[] => {
  if (names.length === 0) return [];

  const placeholders = names.map(() => '?').join(',');
  const rows = db
    .prepare(
      `SELECT id, family_name as familyName, begin, end, postal_code as plz, place_name as placeName, lon, lat
       FROM foko_geo
       WHERE family_name IN (${placeholders}) AND begin > 1000`
    )
    .all(...names) as MapRow[];

  return rows
    .map((row) => ({ ...row, lon: truncate3(row.lon), lat: truncate3(row.lat) }))
    .sort((a, b) => compareGerman(a.familyName, b.familyName) || compareNullableAsc(a.begin, b.begin));
};
