import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type Database from 'better-sqlite3';
import { applySchema, createConnection } from '../src/db/connection.js';
import { getTimelineEntries } from '../src/services/timelineService.js';
import { seedTestDb } from './fixtures/seed.js';

describe('getTimelineEntries', () => {
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
    expect(getTimelineEntries(db, [])).toEqual([]);
  });

  it('returns an empty array (not an error) when nothing matches', () => {
    expect(getTimelineEntries(db, ['nonexistent'])).toEqual([]);
  });

  it('finds matching rows for a known name', () => {
    const result = getTimelineEntries(db, ['schmidt']);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 7,
      name: 'schmidt',
      begin: 1500,
      end: 1600,
      country: 'D',
      plz: '60311',
      ort: 'Frankfurt',
      placeUri: 'http://example.org/frankfurt',
    });
  });

  it('excludes rows before the begin >= 1000 cutoff (fixture id 6, begin=900)', () => {
    const result = getTimelineEntries(db, ['müller']);
    expect(result.map((r) => r.id)).not.toContain(6);
  });

  it('includes a row whose begin is exactly 1000 (cutoff is >=, not >)', () => {
    db.prepare(
      `INSERT INTO foko_geo
        (id, family_name, begin, end, submitter, denomination, country, region, postal_code, place_name, place_uri, lon, lat, ort)
       VALUES (100, 'müller', 1000, 1050, '99', 'ev', 'D', 'BY', '80331', 'München', 'http://example.org/muenchen', 11.5761, 48.1372, 'München (1000)')`
    ).run();

    const result = getTimelineEntries(db, ['müller']);
    expect(result.map((r) => r.id)).toContain(100);
    const entry = result.find((r) => r.id === 100);
    expect(entry?.begin).toBe(1000);
  });

  it('is binary-exact: querying for müller does not return mueller or muller', () => {
    const result = getTimelineEntries(db, ['müller']);
    expect(result.map((r) => r.name)).toEqual(['müller', 'müller']);
    expect(result.map((r) => r.id).sort()).toEqual([1, 2]);
  });

  it('is binary-exact: querying for mueller does not return müller or muller', () => {
    const result = getTimelineEntries(db, ['mueller']);
    expect(result.map((r) => r.id)).toEqual([3]);
  });

  it('is binary-exact: querying for muller does not return müller or mueller', () => {
    const result = getTimelineEntries(db, ['muller']);
    expect(result.map((r) => r.id)).toEqual([4]);
  });

  it('orders rows by name (German phonebook), then begin, then end, ascending', () => {
    const result = getTimelineEntries(db, ['müller', 'meier, von', 'schmidt']);
    // German phonebook order: 'meier, von' < 'müller' (ü ~ ue) < 'schmidt'.
    expect(result.map((r) => r.name)).toEqual(['meier, von', 'müller', 'müller', 'schmidt']);
    // Within the two 'müller' rows: id 1 (begin=1500) must sort before id 2 (begin=1700).
    const muellerRows = result.filter((r) => r.name === 'müller');
    expect(muellerRows.map((r) => r.id)).toEqual([1, 2]);
    expect(muellerRows.map((r) => r.begin)).toEqual([1500, 1700]);
  });

  it('supports a name containing a comma (passed through as a single normalized name)', () => {
    const result = getTimelineEntries(db, ['meier, von']);
    expect(result.map((r) => r.id)).toEqual([5]);
  });
});
