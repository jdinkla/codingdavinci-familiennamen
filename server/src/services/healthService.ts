import type Database from 'better-sqlite3';
import type { HealthStatus } from '@familiennamen/shared';

export const getHealthStatus = (db: Database.Database): HealthStatus => {
  try {
    const row = db.prepare('SELECT COUNT(*) as n FROM foko_geo').get() as { n: number };
    return { status: 'ok', rows: row.n };
  } catch (err) {
    return { status: 'error', error: err instanceof Error ? err.message : String(err) };
  }
};
