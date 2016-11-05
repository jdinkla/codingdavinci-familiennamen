#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. bin/env.sh

docker start ${FAM_MARIADB_NAME}
docker start ${FAM_NEO4J_NAME}

docker rm ${FAM_APP_NAME}
docker run -d -p 80:80 --link ${FAM_NEO4J_NAME}:neo4j --link ${FAM_MARIADB_NAME}:mariadb --name ${FAM_APP_NAME} ${FAM_APP_NAME}



