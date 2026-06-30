# Distribution of Family Names

A project created during the cultural hackathon
["Coding da Vinci Nord" 2016](https://codingdavinci.de). See also the project page [Entry](https://hackdash.org/projects/57dd5ce5d9284f016c04745b)
at [HackDash](https://hackdash.org/dashboards/cdvnord) or the [article in my blog](https://jdinkla.github.io/software-development/2016/11/10/web-app-fuer-die-visualisierung-der-verbreitung-von-familiennamen.html).

Based on data about family names created by the German Working Group of Genealogical Associations (DAGV),
a web application was developed that allows the data to be analyzed and visualized.

The application has the following functional areas:

* Data
    * Display of raw data
    * Description of enrichment data used for maps and postal codes
    * Data issues
        * Description of problems encountered
        * Data quality
* Analysis
    * Search the data by name
        * Exact search
        * Search with LIKE pattern
        * Search with regular expression
        * Search for similar names using the Levenshtein metric
* Visualization
    * Geographic on a map of Germany
    * Temporal on a timeline
    * Similarities between names using a network/graph based on the Levenshtein metric

As an example, you can display all records that contain the string "meier".
For instance, this will also return names like "Bachmeier" and "Meierhof".

In the visualization, you can view the geographic and temporal distribution.

On a map of Germany, names are displayed in different colors and brightness levels.
Using a timeline, you can examine the origin of names.

#### Technology

The application was fully modernized in 2026. Current stack:

* Browser: [React](https://react.dev/), [React Router](https://reactrouter.com/), [Tailwind CSS](https://tailwindcss.com/), [d3.js](https://d3js.org/)
* Web Server: [Node.js](https://nodejs.org), [Express](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/)
* Database: a single embedded [SQLite](https://www.sqlite.org/) database (via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)), holding both the relational data and the precomputed name-similarity graph
* Build tooling: [Vite](https://vite.dev/), [tsup](https://tsup.egoist.dev/), npm workspaces
* Testing: [Vitest](https://vitest.dev/), [Supertest](https://github.com/ladjs/supertest), [React Testing Library](https://testing-library.com/react)

Name similarities are calculated using the [Levenshtein metric](https://en.wikipedia.org/wiki/Levenshtein_distance).
Similarities can be examined using a network/graph.
The calculation of this metric is computationally intensive for the approximately 260,000 names
available for Germany in the dataset. For this reason, the calculation was performed separately using parallel Java 8 Streams.
A calculation with JavaScript would take much longer.

The Java code is located in a [separate project](https://github.com/jdinkla/codingdavinci-familiennamen-graph).
This app imports its precomputed output (a static edge list); it does not recompute it.

#### Data

The [data from the German Working Group of Genealogical Associations e.V. (DAGV)](https://zenodo.org/record/61683#.WBG_hSTrt7I)
is licensed under "Creative Commons Attribution-ShareAlike 4.0 International" according to the LICENSE.txt file.

#### Repository layout

npm workspaces monorepo:

```
packages/shared/   Shared TypeScript API types + query-string helpers (no build step)
server/            Express + better-sqlite3 backend
client/            React + Vite frontend
import/            Source data (*.tsv.gz) the SQLite database is built from
```

#### Installation

Installation works on Linux, Mac, and Windows with Docker.

**Prerequisites:**
* [just](https://github.com/casey/just) - A command runner
* [Node.js 22+](https://nodejs.org) (for local development)
* [Docker](https://www.docker.com/) (for containerized deployment)
* [git](https://git-scm.com/)

**Quick Start with Docker:**

```bash
# Clone repository
git clone https://github.com/jdinkla/codingdavinci-familiennamen.git
cd codingdavinci-familiennamen

# Build and start (the SQLite database is built from the committed
# import/*.tsv.gz files as part of the image build — no separate import step)
just up
```

**Local Development:**

```bash
# Install dependencies
just install

# Build the local SQLite database from import/*.tsv.gz
just import

# Start the dev server (backend + frontend, both in watch mode)
just dev

# Run tests (with coverage)
just test

# Type-check everything
just typecheck

# Lint
just lint
```

**Available Services:**
* Web Application: http://localhost:3000 (open with `just open`)

**Common Commands:**

```bash
# View all available commands
just help

# Build production artifacts (server + client)
just build

# Start the Docker container
just up

# Stop the Docker container
just down

# Open the web application in browser (starts the container first if needed)
just open
```

Remark: This repository was modernized in 2025-2026 with various AI tools — first an ES-modules/Docker
pass in 2025, then a full TypeScript/React/SQLite rewrite in 2026.
