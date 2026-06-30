# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A web app visualizing the distribution of German family names (created for "Coding da Vinci Nord"
2016, fully rewritten in 2026). See `AGENTS.md` for a detailed narrative description of the domain
and architecture, and `README.md` for the project description and feature list — this file focuses
on commands and the structural "why" needed to navigate the code.

npm workspaces monorepo:

```
packages/shared/   Shared TypeScript API types + query-string helpers (no build step)
server/            Express + better-sqlite3 backend
client/            React + Vite frontend
import/            Source data (*.tsv.gz) the SQLite database is built from
```

## Commands

Prefer `just <recipe>` (run `just --list` to see all); each wraps the equivalent `npm` script.

```bash
just install              # npm install (root, hoists all 3 workspaces)
just dev                  # server (PORT=3001) + client (Vite) concurrently, watch mode
just build                # build -w server && build -w client
just test                 # vitest run --coverage, across all 3 workspace projects
just test-watch           # vitest (watch mode)
just lint / lint-fix      # eslint . [--fix]
just typecheck            # tsc --noEmit in shared, server, client (in that order)
just check                # lint + typecheck
just import               # (re)build server/data/familiennamen.db from import/*.tsv.gz
just up / down / open     # docker-compose build+start / stop / open in browser
```

**Run a single test file** (works from repo root — Vitest resolves it to the right workspace project):
```bash
npx vitest run server/test/name.service.test.ts
npx vitest run client/src/lib/color.test.ts
```

**Run only one workspace's tests:**
```bash
npx vitest run --project server   # project names: shared, server, client
```

Each workspace enforces its own **coverage threshold gate** (`vitest.config.ts` per workspace) — a
failing build is more often a coverage drop than a test failure:
- `packages/shared`: 100% lines/branches/functions/statements
- `server`: 90% lines/functions/statements, 85% branches
- `client`: 75% lines/functions/statements, 70% branches

There is no separate `fmt`/formatter — code style is eslint-enforced only.

## Architecture

### Server: routes → controllers → services, with a thin validation layer

`server/src/app.ts` mounts one router per concern under `/api` (`health`, `name`, `map`, `timeline`,
`foko`, `graph`). Each route file builds a controller closure over the injected `db` handle
(`createXController(db)` — this is why `server/src/index.ts` opens the SQLite connection once and
passes it down, and why tests can inject a seeded `:memory:` database instead).

**Layering contract:** controllers are thin (parse/validate request → call service → send JSON);
services are pure functions (`db` handle in, plain data out) with no Express types, which is what
makes them unit-testable without spinning up HTTP — see `server/test/*.service.test.ts` vs.
`*.api.test.ts` (the latter use Supertest against `createApp(db)`).

**Validation:** `server/src/validation/*.ts` are zod-backed `require*`/`parse*` helpers that throw
`ValidationError` on bad input — never zod's throwing `.parse()`, only `safeParse`. Controllers don't
hand-roll try/catch; `server/src/middleware/errorHandler.ts` is the single place that maps
`ValidationError` / `InvalidRegexpError` → HTTP 400, anything else → 500.

**List-of-names query convention:** every multi-name endpoint (`/api/map`, `/api/timeline`,
`/api/foko`, `/api/graph`) takes a repeated `?names=a&names=b` param, normalized by
`packages/shared/src/namesQuery.ts#parseNamesParam` (Express gives `undefined` / `string` / `string[]`
depending on count — this is the one place that distinction is handled).

### Database: a single embedded SQLite file, with two MariaDB/Neo4j gaps patched in JS

`server/src/db/connection.ts` builds the connection and registers custom SQL functions:
- `LIKE`/`REGEXP` operators are **overridden** (not SQLite's built-ins) to support Unicode-aware,
  case-insensitive matching consistent with the rest of the app.
- German phonebook sort order (ä≈ae, ö≈oe, ü≈ue) **cannot** be done via `COLLATE` —
  `better-sqlite3` doesn't expose `sqlite3_create_collation` — so `compareGerman()` sorts
  already-fetched rows in JS instead. This only works because every query needing this order
  returns a small, user-bounded result set.

Schema (`server/src/db/schema.ts`) is an inlined SQL string (not a `.sql` asset file) so it bundles
identically under `tsx` (dev) and the `tsup` production build. Three tables: `foko_geo` (genealogy/geo
records), `names` + `edges` (the precomputed Levenshtein-1 similarity graph, replacing the original's
separate Neo4j store).

The DB file itself (`server/data/familiennamen.db`) is **never committed** — `just import` /
`server/src/scripts/import.ts` builds it from the committed `import/*.tsv.gz` TSVs (streamed
gzip → line reader, so the ~21 MB `family_foko_d_geo.tsv.gz` is never fully buffered). The Docker
build runs this import at image-build time, so the runtime container ships a baked-in, read-only DB
(`index.ts` opens it with `{ readonly: true }`).

### `packages/shared`: the API contract, enforced both directions

`packages/shared/src/types.ts` is the frozen camelCase response shape for every endpoint, imported by
both `server` (controllers/services return these types) and `client` (`lib/api.ts` fetch wrapper
types every response). Consumed as raw `.ts`, no build step — `packages/shared/package.json`'s
`exports` field points straight at `./src/index.ts`, resolved via npm workspace linking. Changing a
field name here is a single edit that breaks the build in both places if you only update one side.

### Client: Context-based shared selection state, D3 for math only

`client/src/features/names/NamesProvider.tsx` holds the "selected family names" list (with assigned
colors, `client/src/lib/color.ts`) as React Context + `useReducer` — this is the one piece of cross-
cutting state every analysis panel (search/table/graph/timeline/map) reads and writes via
`useNamesList()`.

D3 (`d3` package) is used for math only — scales, geo projections, force-simulation physics — React
renders all SVG output. The one sanctioned exception to "React owns the DOM" is
`features/timeline/TimelinePanel.tsx`, which draws a D3 axis imperatively against a ref'd `<g>` in a
`useEffect`.

Routing is `react-router-dom` (`client/src/router.tsx`), all routes nested under one `<Layout>`. Note
`/impressum` is a redirect to `/imprint`, not a duplicate page.

### Docker

Multi-stage `Dockerfile`: `deps` (npm ci with devDeps) → `build` (compile server+client, **and run the
DB import**, baking `familiennamen.db` into the image) → `runtime` (npm ci `--omit=dev`, copies only
the built artifacts + baked DB, runs as non-root `famvis` user). `docker-compose.yml` has no database
sidecar — everything the original MariaDB/Neo4j containers did now lives in the one baked-in SQLite
file. Port 3000 on the host maps to port 80 in the container.
