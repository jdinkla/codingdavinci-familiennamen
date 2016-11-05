#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. bin/env.sh

docker start ${FAM_MARIADB_NAME}
docker start ${FAM_NEO4J_NAME}
# this container is not persistent and always starting new, see the --rm flag

DATE=`date +"%Y%m%d%H%M%S"`
LOGFILE=${FAM_LOG_DIR}/${DATE}_famvis.log

docker run -it -p 80:80 --link ${FAM_NEO4J_NAME}:neo4j --link ${FAM_MARIADB_NAME}:mariadb --rm --name ${FAM_APP_NAME} ${FAM_APP_NAME} > ${LOGFILE} &


