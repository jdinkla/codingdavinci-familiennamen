import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type Database from 'better-sqlite3';
import { applySchema, createConnection } from '../src/db/connection.js';
import { getFokoRecords, getFokoSample } from '../src/services/fokoService.js';
import { seedTestDb } from './fixtures/seed.js';

describe('getFokoRecords', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createConnection(':memory:');
    applySchema(db);
    seedTestDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('returns an empty array when given an empty names list', () => {
    expect(getFokoRecords(db, [])).toEqual([]);
  });

  it('returns an empty array (never throws) for a name with no matches', () => {
    expect(getFokoRecords(db, ['nonexistent'])).toEqual([]);
  });

  it('finds matching records, sorted by familyName (German phonebook), begin, end, submitter', () => {
    const result = getFokoRecords(db, ['müller']);
    // id 6 (begin=900) must be excluded by the begin >= 1000 cutoff.
    expect(result.map((r) => r.id)).toEqual([1, 2]);
    expect(result[0]?.begin).toBe(1500);
    expect(result[1]?.begin).toBe(1700);
  });

  it('excludes the pre-1000 fixture row (id 6, begin=900)', () => {
    const result = getFokoRecords(db, ['müller']);
    expect(result.find((r) => r.id === 6)).toBeUndefined();
  });

  it('truncates lon/lat to 3 decimal places', () => {
    const result = getFokoRecords(db, ['müller']);
    const munich = result.find((r) => r.id === 1)!;
    expect(munich.lon).toBe(11.576);
    expect(munich.lat).toBe(48.137);
  });

  it('is binary-exact: querying müller does not also return mueller or muller', () => {
    const result = getFokoRecords(db, ['müller']);
    expect(result.every((r) => r.familyName === 'müller')).toBe(true);
    expect(result.some((r) => r.familyName === 'mueller')).toBe(false);
    expect(result.some((r) => r.familyName === 'muller')).toBe(false);
  });

  it('is binary-exact: querying mueller does not also return müller or muller', () => {
    const result = getFokoRecords(db, ['mueller']);
    expect(result.map((r) => r.id)).toEqual([3]);
  });

  it('is binary-exact: querying muller does not also return müller or mueller', () => {
    const result = getFokoRecords(db, ['muller']);
    expect(result.map((r) => r.id)).toEqual([4]);
  });

  it('returns the comma-containing name (id 5, "meier, von") correctly', () => {
    const result = getFokoRecords(db, ['meier, von']);
    expect(result.map((r) => r.id)).toEqual([5]);
    expect(result[0]?.familyName).toBe('meier, von');
  });

  it('supports querying multiple names at once', () => {
    const result = getFokoRecords(db, ['müller', 'schmidt']);
    expect(result.map((r) => r.id).sort((a, b) => a - b)).toEqual([1, 2, 7]);
  });

  it('matches the full FokoRecord shape', () => {
    const result = getFokoRecords(db, ['schmidt']);
    expect(result).toEqual([
      {
        id: 7,
        familyName: 'schmidt',
        begin: 1500,
        end: 1600,
        submitter: '16',
        denomination: 'ev',
        country: 'D',
        region: 'HE',
        postalCode: '60311',
        placeName: 'Frankfurt',
        placeURI: 'http://example.org/frankfurt',
        lon: 8.682,
        lat: 50.11,
        ort: 'Frankfurt',
      },
    ]);
  });

  it('falls through the full tiebreaker chain to end, then submitter, when familyName and begin are equal', () => {
    // Two ad-hoc rows sharing familyName+begin with id 1 ('müller', begin=1500) so the
    // sort must fall past `byName`/`byBegin` to `byEnd` and finally `submitter`.
    db.prepare(
      `INSERT INTO foko_geo (id, family_name, begin, end, submitter, denomination, country, region, postal_code, place_name, place_uri, lon, lat, ort)
       VALUES (101, 'müller', 1500, 1550, 'z-submitter', 'ev', 'D', 'BY', '80331', 'München', 'http://example.org/m', 11.5, 48.1, 'München'),
              (102, 'müller', 1500, 1550, 'a-submitter', 'ev', 'D', 'BY', '80331', 'München', 'http://example.org/m', 11.5, 48.1, 'München')`
    ).run();

    const result = getFokoRecords(db, ['müller']);
    const ids = result.map((r) => r.id);
    // id 1 (end=1600) sorts after both new rows (end=1550); among the two new
    // rows (same familyName, begin, end), 'a-submitter' (102) sorts before 'z-submitter' (101).
    expect(ids.indexOf(102)).toBeLessThan(ids.indexOf(101));
    expect(ids.indexOf(101)).toBeLessThan(ids.indexOf(1));
  });
});

describe('getFokoSample', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createConnection(':memory:');
    applySchema(db);
    seedTestDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('returns all fixture rows (well below the 1000-row LIMIT), ordered by id ascending', () => {
    const result = getFokoSample(db);
    expect(result.map((r) => r.id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('includes the pre-1000 row (id 6) -- no begin-year filter on this endpoint', () => {
    const result = getFokoSample(db);
    expect(result.find((r) => r.id === 6)).toBeDefined();
  });

  it('truncates lon/lat to 3 decimal places', () => {
    const result = getFokoSample(db);
    const munich = result.find((r) => r.id === 1)!;
    expect(munich.lon).toBe(11.576);
    expect(munich.lat).toBe(48.137);
  });
});
