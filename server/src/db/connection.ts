import Database from 'better-sqlite3';
import { SCHEMA_SQL } from './schema.js';

/** Thrown by the registered `regexp` SQL function on an invalid pattern (e.g. unbalanced parens). */
export class InvalidRegexpError extends Error {
  constructor(pattern: string, cause: unknown) {
    super(`invalid regular expression: ${pattern}`);
    this.name = 'InvalidRegexpError';
    this.cause = cause;
  }
}

const germanPhonebookCollator = new Intl.Collator('de-DE-u-co-phonebk', { sensitivity: 'base' });

/**
 * Mirrors MariaDB's `ORDER BY ... COLLATE utf8_german2_ci` (German phonebook
 * sort: ä≈ae, ö≈oe, ü≈ue, case-insensitive). better-sqlite3 does not expose
 * SQLite's `sqlite3_create_collation` (verified: no such method exists on
 * its Database prototype), so this is applied in JS via `Array.prototype.sort`
 * on already-fetched rows rather than in SQL — every query that needs this
 * ordering returns a small, user-bounded result set (matches for a handful
 * of selected names), so sorting client-side of the DB is cheap and simple.
 */
export const compareGerman = (a: string, b: string): number => germanPhonebookCollator.compare(a, b);

/** Translates a SQL LIKE pattern (`%`, `_`) into an equivalent RegExp source. */
export const likePatternToRegExpSource = (pattern: string): string => {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return `^${escaped.replace(/%/g, '.*').replace(/_/g, '.')}$`;
};

/**
 * Opens (or creates) the SQLite database at `path` and registers the
 * custom functions the queries rely on. `path` may be `:memory:` for tests.
 */
export const createConnection = (path: string, options: { readonly?: boolean } = {}): Database.Database => {
  const db = new Database(path, { readonly: options.readonly ?? false });
  if (!options.readonly) db.pragma('journal_mode = WAL');

  // Overrides SQLite's operator-level LIKE/REGEXP dispatch: `X LIKE Y` calls
  // like(Y, X) and `X REGEXP Y` calls regexp(Y, X) (SQLite's documented
  // (pattern, value) argument order for both).
  db.function('like', { deterministic: true }, (pattern: unknown, value: unknown) => {
    const re = new RegExp(likePatternToRegExpSource(String(pattern)), 'iu');
    return re.test(String(value ?? '')) ? 1 : 0;
  });

  db.function('regexp', { deterministic: true }, (pattern: unknown, value: unknown) => {
    let re: RegExp;
    try {
      re = new RegExp(String(pattern), 'iu');
    } catch (cause) {
      throw new InvalidRegexpError(String(pattern), cause);
    }
    return re.test(String(value ?? '')) ? 1 : 0;
  });

  return db;
};

/** Creates the schema on a fresh database file. Only called by the import script and test fixtures. */
export const applySchema = (db: Database.Database): void => {
  db.exec(SCHEMA_SQL);
};

/** `Math.trunc`-based equivalent of MariaDB's `TRUNCATE(n, 3)` (toward zero, not rounded). */
export const truncate3 = (n: number): number => Math.trunc(n * 1000) / 1000;

/**
 * Ascending numeric compare with SQL's default `ORDER BY ... ASC` NULLS-FIRST
 * semantics. Shared by foko/map/timeline's begin/end tiebreakers. In
 * practice every caller's SQL already filters out `begin IS NULL` rows (the
 * `begin > 1000` / `begin >= 1000` cutoffs), so the null branches here are
 * unreachable through the app's own queries today — but this is a small,
 * general-purpose comparator, not single-purpose validation, so it's worth
 * getting the null contract right and testing it directly rather than
 * special-casing it away.
 */
export const compareNullableAsc = (a: number | null, b: number | null): number => {
  if (a === b) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  return a - b;
};
