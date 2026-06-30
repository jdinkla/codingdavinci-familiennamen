import type Database from 'better-sqlite3';
import type { GraphDepth, GraphLink, GraphNode, GraphResponse } from '@familiennamen/shared';

interface HopRow {
  source: string;
  target: string;
}

// Both call sites below only ever invoke this with a non-empty array (the
// controller's requireNames() guarantees the first; the `hop1.length > 0`
// check guards the second), and SQLite's `IN ()` is valid SQL matching zero
// rows regardless — so no empty-array guard is needed here for correctness.
const queryHop = (db: Database.Database, sourceNames: string[]): HopRow[] => {
  const placeholders = sourceNames.map(() => '?').join(',');
  return db
    .prepare(
      `SELECT n1.name AS source, n2.name AS target
       FROM edges e
       JOIN names n1 ON n1.id = e.source_id
       JOIN names n2 ON n2.id = e.target_id
       WHERE n1.name IN (${placeholders})`
    )
    .all(...sourceNames) as HopRow[];
};

/**
 * Precomputed-Levenshtein-1-edge neighborhood of `names`, 1 or 2 hops out.
 *
 * Ports the original Neo4j `(n1)-[e1]->(n2)-[e2*0..1]->(n3) WHERE n1 IN
 * $names AND n1 <> n3` query. Two plain queries instead of one recursive
 * one: depth is fixed at 1 or 2, never arbitrary, so a self-join is enough.
 *
 * Two original behaviors preserved deliberately (not bugs to fix):
 *  - the `n1 <> n3` exclusion is checked per *origin* n1, not globally — a
 *    second-hop edge back to one origin name can still appear if reached
 *    from a different origin name in the input list.
 *  - links are not deduplicated (only nodes are, via the Set below) — the
 *    original only ever deduped nodes (`_.uniq(nodes)`), not edges.
 */
export const getGraph = (db: Database.Database, names: string[], depth: GraphDepth): GraphResponse => {
  const nodeIds = new Set<string>(names);
  const links: GraphLink[] = [];

  const hop1 = queryHop(db, names);
  for (const { source, target } of hop1) {
    nodeIds.add(source);
    nodeIds.add(target);
    links.push({ source, target });
  }

  if (depth === 2 && hop1.length > 0) {
    const hop1Targets = [...new Set(hop1.map((row) => row.target))];
    const hop2 = queryHop(db, hop1Targets);
    const hop2BySource = new Map<string, HopRow[]>();
    for (const row of hop2) {
      const list = hop2BySource.get(row.source) ?? [];
      list.push(row);
      hop2BySource.set(row.source, list);
    }

    for (const { source: origin, target: n2 } of hop1) {
      for (const { target: n3 } of hop2BySource.get(n2) ?? []) {
        if (n3 === origin) continue; // mirrors the original's `n1 <> n3` filter
        nodeIds.add(n3);
        links.push({ source: n2, target: n3, value: 1 });
      }
    }
  }

  const nodes: GraphNode[] = [...nodeIds].map((id) => ({ id, group: 1 }));
  return { nodes, links };
};
