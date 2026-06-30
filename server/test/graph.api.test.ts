import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { applySchema, createConnection } from '../src/db/connection.js';
import { seedTestDb } from './fixtures/seed.js';

describe('GET /api/graph', () => {
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
    const res = await request(app).get('/api/graph');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/names/i);
  });

  it('defaults depth to 1 when omitted', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/graph?names=müller');
    expect(res.status).toBe(200);
    expect(res.body.nodes.map((n: { id: string }) => n.id).sort()).toEqual(['amüller', 'müller']);
  });

  it('depth=2 returns the 2nd-hop neighborhood', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/graph?names=müller&depth=2');
    expect(res.status).toBe(200);
    expect(res.body.nodes.map((n: { id: string }) => n.id).sort()).toEqual(['ameise', 'amüller', 'müller']);
  });

  it('400s on an invalid depth value', async () => {
    const app = createApp(db);
    const res = await request(app).get('/api/graph?names=müller&depth=3');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/depth/i);
  });

  it('accepts a single names= param (string, not array) and a multi-name list alike', async () => {
    const app = createApp(db);
    const single = await request(app).get('/api/graph?names=schmidt');
    expect(single.status).toBe(200);
    expect(single.body.nodes).toEqual([{ id: 'schmidt', group: 1 }]);

    const multi = await request(app).get('/api/graph?names=müller&names=schmidt');
    expect(multi.status).toBe(200);
    expect(multi.body.nodes.map((n: { id: string }) => n.id).sort()).toEqual(['amüller', 'müller', 'schmidt']);
  });
});
