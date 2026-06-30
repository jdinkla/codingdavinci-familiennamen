import type Database from 'better-sqlite3';
import type { TimelineEntry } from '@familiennamen/shared';
import { compareGerman, compareNullableAsc } from '../db/connection.js';

/**
 * Chronological foko_geo records for the timeline visualization.
 *
 * Ports the original `timeline.js`'s
 * `SELECT id, familyName name, begin, end, country, postalCode plz, ort, placeUri
 *  FROM foko_d_geo WHERE familyName IN (:names) AND begin >= 1000
 *  ORDER BY familyName COLLATE utf8_german2_ci, begin, end`.
 *
 * Two deliberate deviations from the original, per migration decisions:
 *  - The `begin >= 1000` cutoff (not `>`) is preserved exactly as-is, even
 *    though it differs from the map group's `begin > 1000` — that's the
 *    original's own inconsistency across controllers, not a bug to fix here.
 *  - better-sqlite3 has no SQL-level COLLATE support, so the German-phonebook
 *    ordering is done in JS via `compareGerman` after fetching, rather than
 *    in the SQL `ORDER BY`.
 *  - The original's post-query lodash `_.filter` "umlaut workaround" (needed
 *    only to compensate for MariaDB's accent-insensitive default collation
 *    making `IN (:names)` over-match) is dropped: SQLite's `IN (...)` is
 *    binary-exact by default, so it's unnecessary here.
 */
export const getTimelineEntries = (db: Database.Database, names: string[]): TimelineEntry[] => {
  if (names.length === 0) return [];

  const placeholders = names.map(() => '?').join(',');
  const rows = db
    .prepare(
      `SELECT id, family_name as name, begin, end, country, postal_code as plz, ort, place_uri as placeUri
       FROM foko_geo
       WHERE family_name IN (${placeholders}) AND begin >= 1000`
    )
    .all(...names) as TimelineEntry[];

  return rows.sort((a, b) => {
    const byName = compareGerman(a.name, b.name);
    if (byName !== 0) return byName;
    const byBegin = compareNullableAsc(a.begin, b.begin);
    if (byBegin !== 0) return byBegin;
    return compareNullableAsc(a.end, b.end);
  });
};
