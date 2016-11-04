#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#
# this has to run in the docker IMAGE

NEO4JDIR=/var/lib/neo4j

curl -H "Content-Type: application/json" -X POST -d '{"password":"gra91PH"}' -u neo4j:neo4j http://localhost:7474/user/neo4j/password

cp /import/familiennamen.tsv ${NEO4JDIR}/import
cp /import/edges.tsv ${NEO4JDIR}/import

${NEO4JDIR}/bin/neo4j-shell < /import/import-neo4j.cypher