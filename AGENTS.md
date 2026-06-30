# Repository Overview

## Project Description
Web application for visualizing family name distribution in Germany.
Created during Coding da Vinci Nord 2016 cultural hackathon, fully
modernized in 2026 (TypeScript/React/Vite/SQLite, migrated from the
original AngularJS/MariaDB/Neo4j stack).
Analyzes and visualizes genealogical data about German family names.

## Technology Stack

npm workspaces monorepo: `packages/shared/`, `server/`, `client/`.

### Shared (`packages/shared/`)
Plain TypeScript, no build step (consumed as raw `.ts` by both Vite and
`tsx`/`tsup`). API response DTOs (`packages/shared/src/types.ts`) and the
`?names=a&names=b` query-string helpers (`namesQuery.ts`) used by both
server and client — the single source of truth for the API contract.

### Backend (`server/`)
Node.js 22, TypeScript, Express 5, `better-sqlite3` (synchronous SQLite
driver). Route → controller → service → validation layering; services are
pure (DB handle in, plain data out), which is what makes branch-level unit
testing tractable. `zod`-backed validation (`src/validation/`) throws a
shared `ValidationError`, mapped to HTTP 400 by one central error-handling
middleware (`src/middleware/errorHandler.ts`) — controllers don't hand-roll
try/catch.

### Frontend (`client/`)
TypeScript, React 19, Vite, React Router 7, Tailwind CSS v4. D3 v7 supplies
math only (scales, geo projections, force-simulation physics) — React/JSX
renders every SVG element; the one sanctioned exception is drawing a
d3-axis imperatively against a ref'd `<g>` in a `useEffect` (see
`features/timeline/TimelinePanel.tsx`).

### Database
A single embedded **SQLite** file (`better-sqlite3`), holding both the
relational genealogy/geo data (`foko_geo`) and the precomputed
Levenshtein-1 name-similarity graph (`names`/`edges` tables) — replacing
the original's separate MariaDB + Neo4j services. Built from the committed
`import/*.tsv.gz` source files via `server/src/scripts/import.ts` (run with
`just import`), not checked into git.

Note: `better-sqlite3` does **not** expose SQLite's `sqlite3_create_collation`
(verified — no such method exists on its `Database` prototype in the
installed version). German-phonebook-style sort order
(`server/src/db/connection.ts`'s `compareGerman`, via `Intl.Collator`) is
therefore applied in JS on already-fetched rows, not via a SQL `ORDER BY
... COLLATE`. Custom `LIKE`/`REGEXP` SQL functions (also in
`connection.ts`) ARE registered and used directly in SQL.

### Infrastructure
Single-service Docker deployment (`Dockerfile`, multi-stage: build client +
server, bake the SQLite DB from the committed `.tsv.gz` files at image-build
time, slim `node:22-slim` runtime). `docker-compose.yml` has no database
sidecars — everything the original's MariaDB/Neo4j containers did now lives
in one baked-in SQLite file. `justfile` for task running.

## Architecture

### API
RESTful JSON endpoints under `/api`, one route group per concern
(`server/src/routes/`): `health`, `name` (exact/like/regexp search), `map`,
`timeline`, `foko` (+ `foko-sample`), `graph` (depth 1 or 2, replacing the
original's four separate `graph1/graph2/graphs1/graphs2` routes). List-of-names
endpoints take a repeated `?names=` query parameter (not the original's
custom tab-separated/URI-encoded path segment).

### Frontend routes
`/` (home), `/analysis` (the explorer — search panel + data table + graph +
timeline + map panels, each collapsible), `/data` (+ 4 sub-pages: foko,
konfession, staat, territorium), `/docs`, `/imprint`.

### Data flow
The "selected family names" list (port of the original's `ListOfNames`) is
shared app state via `client/src/features/names/NamesProvider.tsx`
(React Context + `useReducer`), consumed by every analysis panel.

## Key Features

### Search Functionality
Exact name matching, LIKE pattern search, regular-expression search,
similar-name search via the precomputed similarity graph (1-hop).

### Visualizations
Geographic map of Germany, timeline, force-directed similarity-network
graph. Color-coded per selected name (golden-ratio HSL generator,
`client/src/lib/color.ts`).

### Data pages
Raw-data sample, enrichment-data documentation, data-quality
documentation (preserved verbatim — the underlying data hasn't changed).

## Data Sources
German Working Group of Genealogical Associations (DAGV) dataset.
Approximately 260,000 family names, ~1,042,290 geo/genealogy records for
Germany. Creative Commons Attribution-ShareAlike 4.0 International license.
Precomputed Levenshtein-distance-1 similarity edges come from a separate
Java project (https://github.com/jdinkla/codingdavinci-familiennamen-graph)
— recomputing them is out of scope for this app; it only imports the
precomputed edge list.

## Development Status
Fully modernized in 2026: TypeScript throughout, React replacing AngularJS,
SQLite replacing MariaDB+Neo4j, Vite replacing the unbundled script-tag
frontend. 270+ tests (Vitest + Supertest + React Testing Library), ~87%
branch coverage gate enforced via `npm test`.

## Setup
Docker-based single-container deployment (DB baked in at image-build time).
`just import` (re)builds the local dev SQLite DB from the committed
`import/*.tsv.gz` files. `just dev` runs server + client concurrently in
watch mode. See `README.md` for the full command list.
