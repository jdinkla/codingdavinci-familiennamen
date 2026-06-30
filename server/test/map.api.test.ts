import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { applySchema, createConnection } from '../src/db/connection.js';
import { seedTestDb } from './fixtures/seed.js';

describe('GET /api/map', () => {
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
    const res = await request(app).get('/api/map');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/names/i);
  });

  it('400s when names is given but empty', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/map').query({ names: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/names/i);
  });

  it('returns 200 with matching points for a known name', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/map').query({ names: ['müller'] });
    expect(res.status).toBe(200);
    expect(res.body.map((r: { id: number }) => r.id).sort()).toEqual([1, 2]);
  });

  it('returns 200 with an empty array (never 404) for a name with no matches', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/map').query({ names: ['nonexistent'] });
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('the begin > 1000 cutoff excludes fixture id 6 (München, begin=900)', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/map').query({ names: ['müller'] });
    expect(res.status).toBe(200);
    expect(res.body.map((r: { id: number }) => r.id)).not.toContain(6);
  });

  it('truncates lon/lat to 3 decimals (München fixture: 11.5761 -> 11.576)', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/map').query({ names: ['müller'] });
    expect(res.status).toBe(200);
    const munich = res.body.find((r: { id: number }) => r.id === 1);
    expect(munich.lon).toBe(11.576);
    expect(munich.lat).toBe(48.137);
  });

  it('is binary-exact: querying müller alone does not also return mueller or muller', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/map').query({ names: ['müller'] });
    expect(res.status).toBe(200);
    const ids = res.body.map((r: { id: number }) => r.id);
    expect(ids).not.toContain(3);
    expect(ids).not.toContain(4);
  });

  it('sorts a multi-name query German-phonebook by familyName', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/map').query({ names: ['schmidt', 'müller'] });
    expect(res.status).toBe(200);
    expect(res.body.map((r: { id: number }) => r.id)).toEqual([1, 2, 7]);
  });
});
