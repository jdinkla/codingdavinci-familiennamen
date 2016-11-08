#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. bin/env.sh

IMAGE=mariadb:10.1.18

# remove old
docker stop ${FAM_MARIADB_NAME} > /dev/null 2>&1
docker rm ${FAM_MARIADB_NAME} > /dev/null 2>&1

# delete the old databases
rm -rf ${FAM_DATA_MARIADB_DIR}
mkdir ${FAM_DATA_MARIADB_DIR}

# create new
docker run -d --name ${FAM_MARIADB_NAME} --publish=3306:3306 --volume=${FAM_DATA_MARIADB_DIR}:/var/lib/mysql --volume=${FAM_IMPORT_DIR}:/import -e MYSQL_ROOT_PASSWORD=mariadb ${IMAGE}

echo "Sleep until database is constructed ... "
sleep 60

docker exec -it ${FAM_MARIADB_NAME} /import/import-mariadb.sh

docker stop ${FAM_MARIADB_NAME}
