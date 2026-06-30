import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import type Database from 'better-sqlite3';
import { applySchema, createConnection } from '../db/connection.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const defaultImportDir = path.resolve(currentDir, '../../../import');
const defaultDbPath = path.resolve(currentDir, '../../data/familiennamen.db');

/** Streams a gzipped newline-delimited file line by line without buffering the whole file in memory. */
async function forEachLine(gzPath: string, onLine: (line: string) => void): Promise<number> {
  const input = fs.createReadStream(gzPath).pipe(zlib.createGunzip());
  const rl = readline.createInterface({ input, crlfDelay: Infinity });
  let count = 0;
  for await (const line of rl) {
    onLine(line);
    count++;
  }
  return count;
}

const toIntOrNull = (value: string): number | null => (value === '' ? null : Number.parseInt(value, 10));
const toFloat = (value: string): number => Number.parseFloat(value);
const orNull = (value: string): string | null => (value === '' ? null : value);

interface ImportFokoGeoResult {
  count: number;
  skipped: number;
  skippedSamples: string[];
}

/**
 * Skips rows that can't yield a real (lon, lat) pair (the source file has
 * exactly one such truncated row: `560419\triefen`, 2 of the expected 14
 * fields) instead of fabricating a fake (0, 0) coordinate, which would
 * silently plot a "null island" point on the map — worse than omitting the
 * record. Every other row, however dirty otherwise, is imported as-is.
 */
async function importFokoGeo(db: Database.Database, filePath: string): Promise<ImportFokoGeoResult> {
  const insert = db.prepare(`
    INSERT INTO foko_geo
      (id, family_name, begin, end, submitter, denomination, country, region, postal_code, place_name, place_uri, lon, lat, ort)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const skippedSamples: string[] = [];
  const maxSkippedSamples = 10;
  let skipped = 0;

  db.exec('BEGIN');
  try {
    const count = await forEachLine(filePath, (line) => {
      if (line === '') return;
      const cols = line.split('\t');
      const [id, familyName, begin, end, submitter, denomination, country, region, postalCode, placeName, placeURI, lon, lat, ort] =
        cols;
      const lonValue = toFloat(lon ?? '');
      const latValue = toFloat(lat ?? '');
      if (cols.length < 14 || !Number.isFinite(lonValue) || !Number.isFinite(latValue)) {
        skipped++;
        if (skippedSamples.length < maxSkippedSamples) skippedSamples.push(line);
        return;
      }
      insert.run(
        Number.parseInt(id ?? '', 10),
        familyName,
        toIntOrNull(begin ?? ''),
        toIntOrNull(end ?? ''),
        orNull(submitter ?? ''),
        orNull(denomination ?? ''),
        orNull(country ?? ''),
        orNull(region ?? ''),
        orNull(postalCode ?? ''),
        orNull(placeName ?? ''),
        orNull(placeURI ?? ''),
        lonValue,
        latValue,
        ort
      );
    });
    db.exec('COMMIT');
    return { count: count - skipped, skipped, skippedSamples };
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

interface ImportNamesResult {
  count: number;
  dirtySamples: string[];
}

/** Imports every line as-is (including empty/dirty rows) to faithfully mirror the original unconditional `CREATE` import. */
async function importNames(db: Database.Database, filePath: string): Promise<ImportNamesResult> {
  const insert = db.prepare('INSERT OR IGNORE INTO names (name) VALUES (?)');
  const isDirty = (name: string): boolean => name === '' || !/^[\p{L}]/u.test(name);
  const dirtySamples: string[] = [];
  const maxDirtySamples = 10;

  db.exec('BEGIN');
  try {
    const count = await forEachLine(filePath, (line) => {
      insert.run(line);
      if (isDirty(line) && dirtySamples.length < maxDirtySamples) dirtySamples.push(line);
    });
    db.exec('COMMIT');
    return { count, dirtySamples };
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

interface ImportEdgesResult {
  count: number;
  skipped: number;
}

async function importEdges(db: Database.Database, filePath: string): Promise<ImportEdgesResult> {
  const nameRows = db.prepare('SELECT id, name FROM names').all() as { id: number; name: string }[];
  const nameToId = new Map(nameRows.map((row) => [row.name, row.id]));

  const insert = db.prepare('INSERT INTO edges (source_id, target_id) VALUES (?, ?)');
  let inserted = 0;
  let skipped = 0;

  db.exec('BEGIN');
  try {
    await forEachLine(filePath, (line) => {
      if (line === '') return;
      const [source, target] = line.split('\t');
      const sourceId = nameToId.get(source ?? '');
      const targetId = nameToId.get(target ?? '');
      if (sourceId === undefined || targetId === undefined) {
        skipped++;
        return;
      }
      insert.run(sourceId, targetId);
      inserted++;
    });
    db.exec('COMMIT');
    return { count: inserted, skipped };
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

async function main(): Promise<void> {
  const force = process.argv.includes('--force');
  const dbPath = process.env.FAMVIS_SQLITE_PATH ?? defaultDbPath;
  const importDir = process.env.FAMVIS_IMPORT_DIR ?? defaultImportDir;

  if (fs.existsSync(dbPath)) {
    if (!force) {
      console.error(`Database already exists at ${dbPath}. Re-run with --force to recreate it.`);
      process.exit(1);
    }
    for (const suffix of ['', '-wal', '-shm']) {
      fs.rmSync(`${dbPath}${suffix}`, { force: true });
    }
  }
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  console.log(`Creating database at ${dbPath}`);
  const db = createConnection(dbPath);
  applySchema(db);

  console.log('Importing foko_geo from family_foko_d_geo.tsv.gz ...');
  const fokoResult = await importFokoGeo(db, path.join(importDir, 'family_foko_d_geo.tsv.gz'));
  console.log(`  -> ${fokoResult.count} rows, ${fokoResult.skipped} skipped (no usable lon/lat)`);
  if (fokoResult.skippedSamples.length > 0) {
    console.log(`     ${JSON.stringify(fokoResult.skippedSamples)}`);
  }

  console.log('Importing names from familiennamen.tsv.gz ...');
  const { count: namesCount, dirtySamples } = await importNames(db, path.join(importDir, 'familiennamen.tsv.gz'));
  console.log(`  -> ${namesCount} rows (${dirtySamples.length} dirty/empty samples shown below, all imported as-is)`);
  if (dirtySamples.length > 0) {
    console.log(`     ${JSON.stringify(dirtySamples)}`);
  }

  console.log('Importing edges from edges.tsv.gz ...');
  const { count: edgesCount, skipped } = await importEdges(db, path.join(importDir, 'edges.tsv.gz'));
  console.log(`  -> ${edgesCount} rows imported, ${skipped} skipped (endpoint name not found in names table)`);

  db.close();
  console.log('Done.');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
