#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. env.sh

docker start ${FAM_MARIADB_NAME}
docker start ${FAM_NEO4J_NAME}
docker run -it -p 80:80 --link neo4j:neo4j --link mariadb:mariadb --rm --name ${FAM_APP_NAME} ${FAM_APP_NAME}
