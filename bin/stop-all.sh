#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. env.sh

docker stop ${FAM_APP_NAME}
docker stop ${FAM_MARIADB_NAME}
docker stop ${FAM_NEO4J_NAME}
