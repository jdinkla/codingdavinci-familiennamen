#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. bin/env.sh

docker run -it -p 80:80 --link ${FAM_NEO4J_NAME}:neo4j --link ${FAM_MARIADB_NAME}:mariadb --rm --name ${FAM_APP_NAME} ${FAM_APP_NAME}
