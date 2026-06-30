import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { applySchema, createConnection } from '../src/db/connection.js';
import { seedTestDb } from './fixtures/seed.js';

describe('GET /api/health', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createConnection(':memory:');
    applySchema(db);
    seedTestDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('returns 200 with the row count when the database is reachable', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', rows: 7 });
  });

  it('returns 503 when the database query fails', async () => {
    db.close();
    const app = createApp(db);
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('error');
  });
});

describe('unknown /api routes', () => {
  it('returns a JSON 404', async () => {
    const db = createConnection(':memory:');
    applySchema(db);
    const app = createApp(db);
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not Found' });
    db.close();
  });
});
