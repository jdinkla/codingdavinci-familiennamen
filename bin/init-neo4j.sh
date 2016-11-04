#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#


. env.sh

# create the docker instance for Neo4J
docker run -d --name ${FAM_NEO4J_NAME} --publish=7474:7474 --publish=7687:7687 --volume=${FAM_DATA_NEO4J_DIR}:/data --volume=${FAM_IMPORT_DIR}:/import neo4j:3.0.6
sleep 10
docker stop ${FAM_NEO4J_NAME}





