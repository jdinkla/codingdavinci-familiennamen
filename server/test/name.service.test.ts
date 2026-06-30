import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type Database from 'better-sqlite3';
import { applySchema, createConnection } from '../src/db/connection.js';
import { searchExact, searchLike, searchRegexp } from '../src/services/nameService.js';
import { seedTestDb } from './fixtures/seed.js';

describe('nameService', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createConnection(':memory:');
    applySchema(db);
    seedTestDb(db);
  });

  afterEach(() => {
    db.close();
  });

  describe('searchExact', () => {
    it('finds an exact match and dedupes multiple matching rows into one name', () => {
      // ids 1 and 2 are both 'müller' (begin 1500, 1700) -> single distinct result.
      expect(searchExact(db, 'müller')).toEqual(['müller']);
    });

    it('is binary-exact: querying "mueller" does not return "müller" or "muller"', () => {
      expect(searchExact(db, 'mueller')).toEqual(['mueller']);
    });

    it('is binary-exact: querying "muller" does not return "müller" or "mueller"', () => {
      expect(searchExact(db, 'muller')).toEqual(['muller']);
    });

    it('returns an empty array (not an error) when nothing matches', () => {
      expect(searchExact(db, 'nonexistent')).toEqual([]);
    });
  });

  describe('searchLike', () => {
    it('matches "müller" via a wildcard prefix pattern, but not "mueller"/"muller"', () => {
      const result = searchLike(db, 'müll%');
      expect(result).toEqual(['müller']);
    });

    it('matches "mueller" via a wildcard prefix pattern, but not "müller"/"muller"', () => {
      const result = searchLike(db, 'muel%');
      expect(result).toEqual(['mueller']);
    });

    it('returns an empty array when nothing matches', () => {
      expect(searchLike(db, 'xyz%')).toEqual([]);
    });

    it('sorts distinct results with the German phonebook comparator, not binary/insertion order', () => {
      // '%' matches every distinct family name in the fixture: 'müller', 'mueller',
      // 'muller', 'meier, von', 'schmidt'. 'müller' and 'mueller' tie under the
      // phonebook collation (compareGerman returns 0 for the pair), so their
      // relative order depends on the underlying (stable) sort's input order;
      // assert the non-tied anchors instead of the full array.
      const result = searchLike(db, '%');
      expect(result[0]).toBe('meier, von');
      expect(result.at(-1)).toBe('schmidt');
      expect(result.at(-2)).toBe('muller');
      expect(new Set(result.slice(1, -2))).toEqual(new Set(['müller', 'mueller']));
    });
  });

  describe('searchRegexp', () => {
    it('matches "müller" specifically via a literal substring pattern', () => {
      const result = searchRegexp(db, 'müll');
      expect(result).toEqual(['müller']);
    });

    it('matches "mueller" specifically via a literal substring pattern', () => {
      const result = searchRegexp(db, 'muel');
      expect(result).toEqual(['mueller']);
    });

    it('returns an empty array when nothing matches', () => {
      expect(searchRegexp(db, 'xyz1')).toEqual([]);
    });

    it('sorts distinct results with the German phonebook comparator, not binary/insertion order', () => {
      // alternation isolates exactly 'meier, von', 'muller', 'schmidt' (no ties),
      // so the expected order is fully deterministic.
      const result = searchRegexp(db, '^(meier|muller|schmidt)');
      expect(result).toEqual(['meier, von', 'muller', 'schmidt']);
    });
  });
});
