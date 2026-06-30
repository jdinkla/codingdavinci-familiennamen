import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type Database from 'better-sqlite3';
import { applySchema, createConnection } from '../src/db/connection.js';
import { getHealthStatus } from '../src/services/healthService.js';

describe('getHealthStatus', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createConnection(':memory:');
    applySchema(db);
  });

  afterEach(() => {
    db.close();
  });

  it('returns ok with the row count when the query succeeds', () => {
    expect(getHealthStatus(db)).toEqual({ status: 'ok', rows: 0 });
  });

  it('returns an error status with the message when the thrown value is an Error', () => {
    db.close();
    const result = getHealthStatus(db);
    expect(result.status).toBe('error');
    expect(result).toHaveProperty('error');
  });

  it('stringifies a non-Error thrown value rather than crashing', () => {
    const fakeDb = {
      prepare: () => {
        throw 'not an Error instance';
      },
    } as unknown as Database.Database;

    expect(getHealthStatus(fakeDb)).toEqual({ status: 'error', error: 'not an Error instance' });
  });
});
