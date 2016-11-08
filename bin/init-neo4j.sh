#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. bin/env.sh

IMAGE=neo4j:3.0.6

# remove old
docker stop ${FAM_NEO4J_NAME}  > /dev/null
docker rm ${FAM_NEO4J_NAME} > /dev/null

# delete the old databases
rm -rf ${FAM_DATA_NEO4J_DIR}
mkdir ${FAM_DATA_NEO4J_DIR}

# create new
docker run -d --name ${FAM_NEO4J_NAME} --publish=7474:7474 --publish=7687:7687 --volume=${FAM_DATA_NEO4J_DIR}:/data --volume=${FAM_IMPORT_DIR}:/import ${IMAGE}

# change password
echo "Sleep until database is constructed ... "
sleep 5
curl -X POST http://neo4j:neo4j@localhost:7474/user/neo4j/password -d 'password=gra91PH'

sleep 30
docker exec -it ${FAM_NEO4J_NAME} /import/import-neo4j.sh

docker stop ${FAM_NEO4J_NAME}
