#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#
# this has to run in the docker IMAGE

NEO4JDIR=/var/lib/neo4j

cp /import/familiennamen.tsv ${NEO4JDIR}/import
cp /import/edges.tsv ${NEO4JDIR}/import

${NEO4JDIR}/bin/cypher-shell -u neo4j -p neo4jLocalPwd -f /import/import-neo4j.cypher
