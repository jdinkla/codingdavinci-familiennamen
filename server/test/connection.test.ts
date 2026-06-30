import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type Database from 'better-sqlite3';
import {
  InvalidRegexpError,
  applySchema,
  compareGerman,
  compareNullableAsc,
  createConnection,
  likePatternToRegExpSource,
  truncate3,
} from '../src/db/connection.js';

describe('truncate3', () => {
  it('truncates toward zero like MariaDB TRUNCATE, not rounds', () => {
    expect(truncate3(1.23456)).toBe(1.234);
    expect(truncate3(1.2399)).toBe(1.239);
  });

  it('truncates negative numbers toward zero', () => {
    expect(truncate3(-1.23456)).toBe(-1.234);
  });

  it('leaves an already-3-decimal value unchanged', () => {
    expect(truncate3(1.234)).toBe(1.234);
  });

  it('handles zero', () => {
    expect(truncate3(0)).toBe(0);
  });
});

describe('compareNullableAsc', () => {
  it('treats two equal values (including two nulls) as equal', () => {
    expect(compareNullableAsc(5, 5)).toBe(0);
    expect(compareNullableAsc(null, null)).toBe(0);
  });

  it('sorts null before any number (NULLS FIRST)', () => {
    expect(compareNullableAsc(null, 5)).toBeLessThan(0);
    expect(compareNullableAsc(5, null)).toBeGreaterThan(0);
  });

  it('compares two non-null numbers numerically', () => {
    expect(compareNullableAsc(1, 2)).toBeLessThan(0);
    expect(compareNullableAsc(2, 1)).toBeGreaterThan(0);
  });
});

describe('likePatternToRegExpSource', () => {
  it('translates % to .*', () => {
    expect(likePatternToRegExpSource('me%er')).toBe('^me.*er$');
  });

  it('translates _ to .', () => {
    expect(likePatternToRegExpSource('me_er')).toBe('^me.er$');
  });

  it('escapes regex-special characters in the literal portion of the pattern', () => {
    expect(likePatternToRegExpSource('a.b(c)')).toBe('^a\\.b\\(c\\)$');
  });
});

describe('compareGerman', () => {
  it('sorts case-insensitively', () => {
    expect(compareGerman('Anton', 'anton')).toBe(0);
  });

  it('treats ü and its "ue" digraph spelling as equivalent (phonebook tailoring)', () => {
    expect(compareGerman('Müller', 'Mueller')).toBe(0);
  });

  it('still distinguishes an unrelated plain-u spelling', () => {
    expect(compareGerman('Müller', 'Muller')).not.toBe(0);
  });
});

describe('createConnection', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createConnection(':memory:');
    applySchema(db);
    db.exec("INSERT INTO names (name) VALUES ('müller'), ('mueller'), ('muller'), ('schmidt')");
  });

  afterEach(() => {
    db.close();
  });

  it('applySchema creates the expected tables', () => {
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
      .all()
      .map((row) => (row as { name: string }).name);
    expect(tables).toEqual(['edges', 'foko_geo', 'names']);
  });

  describe('custom LIKE function', () => {
    it('matches using the _ wildcard (any single character, including ü)', () => {
      const rows = db.prepare("SELECT name FROM names WHERE name LIKE 'm_ller' ORDER BY name").all();
      expect(rows).toEqual([{ name: 'muller' }, { name: 'müller' }]);
    });

    it('matches using the % wildcard (zero or more characters, so "mueller" matches too)', () => {
      const rows = db.prepare("SELECT name FROM names WHERE name LIKE 'm%ller' ORDER BY name").all();
      expect(rows).toEqual([{ name: 'mueller' }, { name: 'muller' }, { name: 'müller' }]);
    });

    it('is case- and umlaut-insensitive (ASCII fold via the i/u regex flags)', () => {
      const rows = db.prepare("SELECT name FROM names WHERE name LIKE 'MÜLLER'").all();
      expect(rows).toEqual([{ name: 'müller' }]);
    });

    it('returns no rows when nothing matches', () => {
      const rows = db.prepare("SELECT name FROM names WHERE name LIKE 'xyz%'").all();
      expect(rows).toEqual([]);
    });
  });

  describe('custom REGEXP function', () => {
    it('matches a valid pattern', () => {
      const rows = db.prepare("SELECT name FROM names WHERE name REGEXP '^m.eller$' ORDER BY name").all();
      expect(rows).toEqual([{ name: 'mueller' }]);
    });

    it('throws InvalidRegexpError for a malformed pattern instead of a generic SQLite error', () => {
      expect(() => db.prepare("SELECT name FROM names WHERE name REGEXP '('").all()).toThrowError(InvalidRegexpError);
    });
  });

  describe('LIKE/REGEXP against a NULL column value', () => {
    // family_name (the only column the app actually searches with LIKE/REGEXP) is
    // NOT NULL, so this can't happen through the app's real queries — but `denomination`
    // is nullable, and the custom functions are general-purpose, so the `value ?? ''`
    // fallback is worth pinning down directly rather than leaving untested.
    beforeEach(() => {
      db.prepare(
        `INSERT INTO foko_geo (id, family_name, begin, end, denomination, lon, lat, ort)
         VALUES (1, 'platzhalter', 1500, 1600, NULL, 0, 0, 'x')`
      ).run();
    });

    it('a NULL value never matches a non-empty LIKE/REGEXP pattern', () => {
      expect(db.prepare("SELECT id FROM foko_geo WHERE denomination LIKE '%a%'").all()).toEqual([]);
      expect(db.prepare("SELECT id FROM foko_geo WHERE denomination REGEXP 'a'").all()).toEqual([]);
    });

    it('a NULL value is coerced to the empty string, so it matches a pattern that accepts an empty match', () => {
      expect(db.prepare("SELECT id FROM foko_geo WHERE denomination LIKE '%'").all()).toEqual([{ id: 1 }]);
      expect(db.prepare("SELECT id FROM foko_geo WHERE denomination REGEXP '^$'").all()).toEqual([{ id: 1 }]);
    });
  });
});

describe('createConnection({ readonly: true })', () => {
  it('opens an existing database for reads but rejects writes (used by the production app, which never mutates the baked-in DB)', () => {
    const dbPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'familiennamen-test-')), 'readonly.db');
    const writable = createConnection(dbPath);
    applySchema(writable);
    writable.exec("INSERT INTO names (name) VALUES ('müller')");
    writable.close();

    const readonlyDb = createConnection(dbPath, { readonly: true });
    try {
      expect(readonlyDb.prepare('SELECT name FROM names').all()).toEqual([{ name: 'müller' }]);
      expect(() => readonlyDb.exec("INSERT INTO names (name) VALUES ('schmidt')")).toThrow();
    } finally {
      readonlyDb.close();
      fs.rmSync(path.dirname(dbPath), { recursive: true, force: true });
    }
  });
});
