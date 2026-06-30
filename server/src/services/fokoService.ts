import type Database from 'better-sqlite3';
import type { FokoRecord } from '@familiennamen/shared';
import { compareGerman, compareNullableAsc, truncate3 } from '../db/connection.js';

interface FokoRow {
  id: number;
  familyName: string;
  begin: number | null;
  end: number | null;
  submitter: string | null;
  denomination: string | null;
  country: string | null;
  region: string | null;
  postalCode: string | null;
  placeName: string | null;
  placeURI: string | null;
  lon: number;
  lat: number;
  ort: string;
}

const toFokoRecord = (row: FokoRow): FokoRecord => ({
  ...row,
  lon: truncate3(row.lon),
  lat: truncate3(row.lat),
});

/** Tiebreaker chain mirroring the original's `ORDER BY familyName COLLATE ..., begin, end, submitter`. */
const compareFokoRows = (a: FokoRow, b: FokoRow): number => {
  const byName = compareGerman(a.familyName, b.familyName);
  if (byName !== 0) return byName;

  const byBegin = compareNullableAsc(a.begin, b.begin);
  if (byBegin !== 0) return byBegin;

  const byEnd = compareNullableAsc(a.end, b.end);
  if (byEnd !== 0) return byEnd;

  // submitter is a plain string field in the original -- straight string comparison, not compareGerman.
  return (a.submitter ?? '').localeCompare(b.submitter ?? '');
};

/**
 * Ports the original `foko` controller (app_api/controllers/data.js): full genealogy
 * records for the given family names, restricted to `begin >= 1000`.
 *
 * The original's post-query lodash `_.filter` ("umlaut workaround" for MariaDB's
 * accent/case-insensitive default collation) is deliberately dropped -- SQLite's
 * `IN (...)` is binary-exact, so it already returns only exact matches.
 */
export const getFokoRecords = (db: Database.Database, names: string[]): FokoRecord[] => {
  if (names.length === 0) return [];

  const placeholders = names.map(() => '?').join(',');
  const rows = db
    .prepare(
      `SELECT id, family_name as familyName, begin, end, submitter, denomination, country, region,
              postal_code as postalCode, place_name as placeName, place_uri as placeURI, lon, lat, ort
       FROM foko_geo
       WHERE family_name IN (${placeholders}) AND begin >= 1000`
    )
    .all(...names) as FokoRow[];

  return rows.sort(compareFokoRows).map(toFokoRecord);
};

/**
 * NEW endpoint (no original equivalent): a flat first-1000-rows sample, ordered by id.
 * Replaces app_server/controllers/csv.js's "/data/foko.html" page, which used to ship
 * an entire 100MB CSV to the browser just to display the first 1000 rows.
 */
export const getFokoSample = (db: Database.Database): FokoRecord[] => {
  const rows = db
    .prepare(
      `SELECT id, family_name as familyName, begin, end, submitter, denomination, country, region,
              postal_code as postalCode, place_name as placeName, place_uri as placeURI, lon, lat, ort
       FROM foko_geo
       ORDER BY id
       LIMIT 1000`
    )
    .all() as FokoRow[];

  return rows.map(toFokoRecord);
};
