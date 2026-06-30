# justfile for codingdavinci-familiennamen — common workflow shortcuts
# Run `just --list` to see all targets

# --- Dev ---

[group('dev')]
[doc("Show available commands")]
default:
    @just --list --unsorted

[group('dev')]
[doc("Print this help")]
help:
    @just --list

[group('dev')]
[doc("Install dependencies")]
install:
    @npm install

[group('dev')]
[doc("Run server + client in watch mode")]
dev:
    @npm run dev

[group('dev')]
[doc("Build production artifacts (server + client)")]
build:
    @npm run build

[group('dev')]
[doc("Run tests with coverage")]
test:
    @npm test

[group('dev')]
[doc("Run tests in watch mode")]
test-watch:
    @npm run test:watch

[group('dev')]
[doc("Lint code")]
lint:
    @npm run lint

[group('dev')]
[doc("Lint and auto-fix code")]
lint-fix:
    @npm run lint:fix

[group('dev')]
[doc("Type-check all workspaces")]
typecheck:
    @npm run typecheck

[group('dev')]
[doc("Run lint and type-check")]
check: lint typecheck

# --- Data ---

[group('data')]
[doc("(Re)build the SQLite database from the committed import/*.tsv.gz files")]
import:
    @npm run import

# --- Docker ---

[group('docker')]
[doc("Build and start the container (uses the standalone docker-compose binary, for colima setups)")]
up:
    @docker-compose up -d --build

[group('docker')]
[doc("Stop the container")]
down:
    @docker-compose down

[group('docker')]
[doc("Ensure the container is up, then open it in the browser")]
open: up
    open http://localhost:3000
