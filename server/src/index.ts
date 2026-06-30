import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createApp } from './app.js';
import { createConnection } from './db/connection.js';
import { resolveClientDist } from './resolvePaths.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.FAMVIS_SQLITE_PATH ?? path.resolve(currentDir, '../data/familiennamen.db');
const clientDist = resolveClientDist(process.env.FAMVIS_CLIENT_DIST, path.resolve(currentDir, '../../client/dist'));
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

const db = createConnection(dbPath, { readonly: true });
const app = createApp(db);

app.use(express.static(clientDist));
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(port, () => {
  console.log(`familiennamen server listening on port ${port}`);
});
