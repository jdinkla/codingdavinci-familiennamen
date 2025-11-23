
# print this help
help:
    @just --list



up:
    @docker compose up -d

down:
    @docker compose down

install:
    @npm install

test:
    @npm test

lint:
    @npm run lint

dev:
    @npm run dev

import-mariadb:
    @docker exec -it mariadb /import/import-mariadb.sh

import-neo4j:
    @docker exec -it neo4j /import/import-neo4j.sh

delete-neo4j NEO4J_PWD:
    @docker exec -it neo4j cypher-shell -u neo4j -p {{NEO4J_PWD}} "MATCH (n:Familyname) DETACH DELETE n"

web:
    open http://localhost:3000

neo4j:
    open http://localhost:7474

mariadb:
    open http://localhost:3306
