import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type Database from 'better-sqlite3';
import { createApp } from '../src/app.js';
import { applySchema, createConnection } from '../src/db/connection.js';
import { seedTestDb } from './fixtures/seed.js';

describe('GET /api/name', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createConnection(':memory:');
    applySchema(db);
    seedTestDb(db);
  });

  afterEach(() => {
    db.close();
  });

  describe('GET /api/name/:familyname (exact)', () => {
    it('returns the matching distinct name', async () => {
      const app = createApp(db);
      const res = await request(app).get(`/api/name/${encodeURIComponent('müller')}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(['müller']);
    });

    it('returns 200 with an empty array when nothing matches', async () => {
      const app = createApp(db);
      const res = await request(app).get('/api/name/nonexistent');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('is binary-exact: "mueller" does not return "müller" or "muller"', async () => {
      const app = createApp(db);
      const res = await request(app).get(`/api/name/${encodeURIComponent('mueller')}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(['mueller']);
    });

    it('is binary-exact: "muller" does not return "müller" or "mueller"', async () => {
      const app = createApp(db);
      const res = await request(app).get(`/api/name/${encodeURIComponent('muller')}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(['muller']);
    });
  });

  describe('GET /api/name/like/:pattern', () => {
    it('400s when the pattern is shorter than 4 characters', async () => {
      const app = createApp(db);
      const res = await request(app).get('/api/name/like/abc');
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/minimal length of 4/i);
    });

    it('falls through to the exact-match route on a trailing slash, rather than 404ing', async () => {
      // An empty :pattern segment can't match /name/like/:pattern (Express
      // never matches an empty path segment) — but /api/name/like/ collapses
      // to /api/name/like (strict routing is off by default), which DOES
      // match the single-segment /name/:familyname route, treating "like"
      // as a literal (if unusual) family name to search for exactly.
      const app = createApp(db);
      const res = await request(app).get('/api/name/like/');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('allows a pattern of exactly length 4 through to the query', async () => {
      const app = createApp(db);
      const res = await request(app).get(`/api/name/like/${encodeURIComponent('müll%')}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(['müller']);
    });

    it('matches "müller" via a wildcard pattern, but not "mueller"/"muller"', async () => {
      const app = createApp(db);
      const res = await request(app).get(`/api/name/like/${encodeURIComponent('müll%')}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(['müller']);
    });

    it('matches "mueller" via a wildcard pattern, but not "müller"/"muller"', async () => {
      const app = createApp(db);
      const res = await request(app).get(`/api/name/like/${encodeURIComponent('muel%')}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(['mueller']);
    });

    it('returns 200 with an empty array when nothing matches', async () => {
      const app = createApp(db);
      const res = await request(app).get('/api/name/like/xyz%25');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /api/name/regexp/:pattern', () => {
    it('400s when the pattern is shorter than 4 characters', async () => {
      const app = createApp(db);
      const res = await request(app).get('/api/name/regexp/abc');
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/minimal length of 4/i);
    });

    it('allows a pattern of exactly length 4 through to the query', async () => {
      const app = createApp(db);
      const res = await request(app).get(`/api/name/regexp/${encodeURIComponent('müll')}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(['müller']);
    });

    it('matches "müller" specifically via a literal substring pattern', async () => {
      const app = createApp(db);
      const res = await request(app).get(`/api/name/regexp/${encodeURIComponent('müll')}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(['müller']);
    });

    it('matches "mueller" specifically, not "müller"/"muller"', async () => {
      const app = createApp(db);
      const res = await request(app).get(`/api/name/regexp/${encodeURIComponent('muel')}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(['mueller']);
    });

    it('returns 200 with an empty array when nothing matches', async () => {
      const app = createApp(db);
      const res = await request(app).get('/api/name/regexp/xyz1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('400s on GET /api/name/regexp/( (single open paren; here this is caught by the length-4 check, but the status is still 400 either way)', async () => {
      const app = createApp(db);
      const res = await request(app).get(`/api/name/regexp/${encodeURIComponent('(')}`);
      expect(res.status).toBe(400);
    });

    it('400s on a malformed but length>=4 regular expression via InvalidRegexpError, not the length check', async () => {
      // '(abc' is an unbalanced group (length 4, so it clears requirePattern)
      // and reaches the registered SQL regexp() function, which throws
      // InvalidRegexpError -> mapped to 400 by the central error handler.
      const app = createApp(db);
      const res = await request(app).get(`/api/name/regexp/${encodeURIComponent('(abc')}`);
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid regular expression/i);
    });
  });
});
