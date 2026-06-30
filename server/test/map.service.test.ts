import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type Database from 'better-sqlite3';
import { applySchema, createConnection } from '../src/db/connection.js';
import { getMapPoints } from '../src/services/mapService.js';
import { seedTestDb } from './fixtures/seed.js';

describe('getMapPoints', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createConnection(':memory:');
    applySchema(db);
    seedTestDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('returns an empty array when no names are given', () => {
    expect(getMapPoints(db, [])).toEqual([]);
  });

  it('returns an empty array (not an error) when the name has no matches', () => {
    expect(getMapPoints(db, ['nonexistent'])).toEqual([]);
  });

  it('finds points for a known name, truncating lon/lat to 3 decimals', () => {
    const result = getMapPoints(db, ['müller']);
    const munich = result.find((r) => r.id === 1);
    expect(munich).toBeDefined();
    expect(munich!.lon).toBe(11.576);
    expect(munich!.lat).toBe(48.137);
  });

  it('excludes the begin=900 row (id 6) via the begin > 1000 cutoff, returning only ids 1 and 2 for müller', () => {
    const result = getMapPoints(db, ['müller']);
    expect(result.map((r) => r.id).sort()).toEqual([1, 2]);
  });

  it('is binary-exact: querying müller alone does not also return mueller (id 3) or muller (id 4)', () => {
    const result = getMapPoints(db, ['müller']);
    expect(result.map((r) => r.id)).not.toContain(3);
    expect(result.map((r) => r.id)).not.toContain(4);
  });

  it('querying mueller alone returns only id 3, not müller or muller', () => {
    const result = getMapPoints(db, ['mueller']);
    expect(result.map((r) => r.id)).toEqual([3]);
  });

  it('maps fields to the MapPoint shape (id, familyName, begin, end, plz, placeName, lon, lat)', () => {
    const [point] = getMapPoints(db, ['schmidt']);
    expect(point).toEqual({
      id: 7,
      familyName: 'schmidt',
      begin: 1500,
      end: 1600,
      plz: '60311',
      placeName: 'Frankfurt',
      lon: 8.682,
      lat: 50.11,
    });
  });

  it('sorts multi-name results German-phonebook by familyName, then numeric begin ascending', () => {
    const result = getMapPoints(db, ['schmidt', 'müller']);
    // 'müller' sorts before 'schmidt' in German-phonebook order; within müller, begin 1500 before 1700.
    expect(result.map((r) => r.id)).toEqual([1, 2, 7]);
  });

  it('a name with an embedded comma round-trips correctly', () => {
    const result = getMapPoints(db, ['meier, von']);
    expect(result.map((r) => r.id)).toEqual([5]);
  });
});
