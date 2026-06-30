import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { applySchema, createConnection } from '../src/db/connection.js';
import { seedTestDb } from './fixtures/seed.js';

describe('GET /api/foko', () => {
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
    const res = await request(app).get('/api/foko');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/names/i);
  });

  it('400s when names is an empty string', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/foko').query({ names: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/names/i);
  });

  it('returns 200 with matching records for a found name', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/foko').query({ names: 'müller' });
    expect(res.status).toBe(200);
    expect(res.body.map((r: { id: number }) => r.id)).toEqual([1, 2]);
  });

  it('returns 200 with an empty array (never 404) for a not-found name', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/foko').query({ names: 'nonexistent' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('excludes the pre-1000 fixture row (id 6, begin=900)', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/foko').query({ names: 'müller' });
    expect(res.status).toBe(200);
    expect(res.body.find((r: { id: number }) => r.id === 6)).toBeUndefined();
  });

  it('truncates lon/lat to 3 decimal places', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/foko').query({ names: 'müller' });
    expect(res.status).toBe(200);
    const munich = res.body.find((r: { id: number }) => r.id === 1);
    expect(munich.lon).toBe(11.576);
    expect(munich.lat).toBe(48.137);
  });

  it('is binary-exact: müller/mueller/muller do not bleed into each other', async () => {
    const app = createApp(db);

    const umlaut = await request(app).get('/api/foko').query({ names: 'müller' });
    expect(umlaut.body.every((r: { familyName: string }) => r.familyName === 'müller')).toBe(true);

    const mueller = await request(app).get('/api/foko').query({ names: 'mueller' });
    expect(mueller.body.map((r: { id: number }) => r.id)).toEqual([3]);

    const muller = await request(app).get('/api/foko').query({ names: 'muller' });
    expect(muller.body.map((r: { id: number }) => r.id)).toEqual([4]);
  });

  it('round-trips the comma-containing fixture name (id 5, "meier, von") through ?names=', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/foko').query({ names: 'meier, von' });
    expect(res.status).toBe(200);
    expect(res.body.map((r: { id: number }) => r.id)).toEqual([5]);
    expect(res.body[0].familyName).toBe('meier, von');
  });

  it('accepts multiple repeated names= params', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/foko').query({ names: ['müller', 'schmidt'] });
    expect(res.status).toBe(200);
    expect(res.body.map((r: { id: number }) => r.id).sort((a: number, b: number) => a - b)).toEqual([1, 2, 7]);
  });
});

describe('GET /api/foko-sample', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createConnection(':memory:');
    applySchema(db);
    seedTestDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('always returns 200 with no params', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/foko-sample');
    expect(res.status).toBe(200);
  });

  it('returns all 7 fixture rows ordered by id ascending (well under the 1000-row LIMIT)', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/foko-sample');
    expect(res.status).toBe(200);
    expect(res.body.map((r: { id: number }) => r.id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('includes the pre-1000 row (id 6) -- no begin-year filter on this endpoint', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/foko-sample');
    expect(res.body.find((r: { id: number }) => r.id === 6)).toBeDefined();
  });

  it('truncates lon/lat to 3 decimal places', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/foko-sample');
    const munich = res.body.find((r: { id: number }) => r.id === 1);
    expect(munich.lon).toBe(11.576);
    expect(munich.lat).toBe(48.137);
  });
});
