
# print this help
help:
    @just --list

import-mariadb:
    @docker exec -it mariadb /import/import-mariadb.sh

import-neo4j:
    @docker exec -it neo4j /import/import-neo4j.sh

delete-neo4j NEO4J_PWD:
    @docker exec -it neo4j cypher-shell -u neo4j -p {{NEO4J_PWD}} "MATCH (n:Familyname) DETACH DELETE n"
