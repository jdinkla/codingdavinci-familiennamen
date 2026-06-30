
# print this help
help:
    @just --list

install:
    @npm install

dev:
    @npm run dev

build:
    @npm run build

test:
    @npm test

test-watch:
    @npm run test:watch

lint:
    @npm run lint

lint-fix:
    @npm run lint:fix

typecheck:
    @npm run typecheck

# (re)build the SQLite database from the committed import/*.tsv.gz files
import:
    @npm run import

# Build and start the container (uses the standalone docker-compose binary, for colima setups)
up:
    @docker-compose up -d --build

down:
    @docker-compose down

# Ensures the container is up, then opens it in the browser.
open: up
    open http://localhost:3000
