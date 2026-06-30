import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type Database from 'better-sqlite3';
import { applySchema, createConnection } from '../src/db/connection.js';
import { getGraph } from '../src/services/graphService.js';
import { seedTestDb } from './fixtures/seed.js';

describe('getGraph', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createConnection(':memory:');
    applySchema(db);
    seedTestDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('depth 1: returns the 1-hop neighborhood of a single name', () => {
    const result = getGraph(db, ['müller'], 1);
    expect(result.nodes.map((n) => n.id).sort()).toEqual(['amüller', 'müller']);
    expect(result.links).toEqual([{ source: 'müller', target: 'amüller' }]);
  });

  it('depth 2: includes the 2nd-hop neighbor', () => {
    const result = getGraph(db, ['müller'], 2);
    expect(result.nodes.map((n) => n.id).sort()).toEqual(['ameise', 'amüller', 'müller']);
    expect(result.links).toContainEqual({ source: 'müller', target: 'amüller' });
    expect(result.links).toContainEqual({ source: 'amüller', target: 'ameise', value: 1 });
  });

  it('depth 2: a 1-hop target with no outgoing edges of its own contributes no 2nd-hop links (terminal node among several hop-1 targets)', () => {
    const id = (name: string): number => (db.prepare('SELECT id FROM names WHERE name = ?').get(name) as { id: number }).id;
    // müller now has two 1-hop targets: 'amüller' (which has a further edge to 'ameise')
    // and 'schmidt' (a terminal node with no outgoing edges of its own).
    db.prepare('INSERT INTO edges (source_id, target_id) VALUES (?, ?)').run(id('müller'), id('schmidt'));

    const result = getGraph(db, ['müller'], 2);
    expect(result.nodes.map((n) => n.id).sort()).toEqual(['ameise', 'amüller', 'müller', 'schmidt']);
    expect(result.links).toContainEqual({ source: 'müller', target: 'schmidt' });
    expect(result.links).toContainEqual({ source: 'amüller', target: 'ameise', value: 1 });
    expect(result.links.filter((link) => link.source === 'schmidt')).toEqual([]);
  });

  it('a name with no edges returns just itself as an isolated node', () => {
    const result = getGraph(db, ['schmidt'], 1);
    expect(result.nodes).toEqual([{ id: 'schmidt', group: 1 }]);
    expect(result.links).toEqual([]);
  });

  it('a name absent from the names table entirely returns itself with no links', () => {
    const result = getGraph(db, ['nonexistent'], 2);
    expect(result.nodes).toEqual([{ id: 'nonexistent', group: 1 }]);
    expect(result.links).toEqual([]);
  });

  it('excludes a 2nd-hop edge that loops back to its own origin (n1 <> n3)', () => {
    // amüller -> müller would loop back to the depth-1 origin; add it and confirm it's filtered.
    const id = (name: string): number => (db.prepare('SELECT id FROM names WHERE name = ?').get(name) as { id: number }).id;
    db.prepare('INSERT INTO edges (source_id, target_id) VALUES (?, ?)').run(id('amüller'), id('müller'));

    const result = getGraph(db, ['müller'], 2);
    expect(result.links).not.toContainEqual({ source: 'amüller', target: 'müller', value: 1 });
  });

  it('the n1 <> n3 exclusion is per-origin, not global: a 2nd-hop edge back to a DIFFERENT input name still appears', () => {
    // names = ['müller', 'schmidt']. müller -> amüller -> schmidt (new edge) is a depth-2
    // path whose n3 ('schmidt') is one of the overall input names, but not THIS path's
    // origin ('müller') — so it must NOT be excluded, unlike a path that loops back to its
    // own origin (covered by the previous test).
    const id = (name: string): number => (db.prepare('SELECT id FROM names WHERE name = ?').get(name) as { id: number }).id;
    db.prepare('INSERT INTO edges (source_id, target_id) VALUES (?, ?)').run(id('amüller'), id('schmidt'));

    const result = getGraph(db, ['müller', 'schmidt'], 2);
    expect(result.links).toContainEqual({ source: 'amüller', target: 'schmidt', value: 1 });
  });
});
