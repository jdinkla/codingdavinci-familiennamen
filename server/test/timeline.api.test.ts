import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { applySchema, createConnection } from '../src/db/connection.js';
import { seedTestDb } from './fixtures/seed.js';

/**
 * NOTE: GET /api/timeline is not yet mounted into createApp() — that wiring
 * happens centrally once every endpoint group is done, to avoid file
 * conflicts between parallel agents. Until then every request below 404s
 * via app.ts's catch-all `/api` handler. These tests assert the intended
 * final behavior; the 404 failures are expected and are NOT a logic bug.
 */
describe('GET /api/timeline', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createConnection(':memory:');
    applySchema(db);
    seedTestDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('400s when names is missing entirely', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/timeline');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/names/i);
  });

  it('400s when names is present but an empty string (requireNames rejects empty name entries, not just an empty list)', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/timeline').query({ names: '' });
    expect(res.status).toBe(400);
  });

  it('returns 200 with matching entries for a known name', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/timeline').query({ names: ['schmidt'] });
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: 7,
        name: 'schmidt',
        begin: 1500,
        end: 1600,
        country: 'D',
        plz: '60311',
        ort: 'Frankfurt',
        placeUri: 'http://example.org/frankfurt',
      },
    ]);
  });

  it('returns 200 with an empty array when nothing matches (never 404)', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/timeline').query({ names: ['nonexistent'] });
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('excludes the begin=900 row (fixture id 6) via the begin >= 1000 cutoff', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/timeline').query({ names: ['müller'] });
    expect(res.status).toBe(200);
    expect(res.body.map((r: { id: number }) => r.id)).not.toContain(6);
  });

  it('is binary-exact between müller/mueller/muller', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/timeline').query({ names: ['müller'] });
    expect(res.status).toBe(200);
    expect(res.body.map((r: { name: string }) => r.name)).toEqual(['müller', 'müller']);
  });

  it('orders results by name then begin then end (id 1 before id 2)', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/timeline').query({ names: ['müller'] });
    expect(res.status).toBe(200);
    expect(res.body.map((r: { id: number }) => r.id)).toEqual([1, 2]);
  });

  it('accepts a single names= param (string, not array)', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/timeline').query({ names: 'schmidt' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});
