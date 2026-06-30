/**
 * Inlined (not read from a .sql file) so it bundles correctly under both
 * tsx (dev) and the tsup-bundled production build without extra asset-copy
 * config.
 */
export const SCHEMA_SQL = `
CREATE TABLE foko_geo (
  id           INTEGER PRIMARY KEY,
  family_name  TEXT NOT NULL,
  begin        INTEGER,
  end          INTEGER,
  submitter    TEXT,
  denomination TEXT,
  country      TEXT,
  region       TEXT,
  postal_code  TEXT,
  place_name   TEXT,
  place_uri    TEXT,
  lon          REAL NOT NULL,
  lat          REAL NOT NULL,
  ort          TEXT NOT NULL
);

CREATE INDEX idx_foko_geo_family_name        ON foko_geo(family_name);
CREATE INDEX idx_foko_geo_family_name_begin  ON foko_geo(family_name, begin);

CREATE TABLE names (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE edges (
  id        INTEGER PRIMARY KEY,
  source_id INTEGER NOT NULL REFERENCES names(id),
  target_id INTEGER NOT NULL REFERENCES names(id)
);

CREATE INDEX idx_edges_source ON edges(source_id);
CREATE INDEX idx_edges_target ON edges(target_id);
`;
