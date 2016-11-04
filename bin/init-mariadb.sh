#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#


. env.sh

# create the docker instance for MariaDB
docker run -d --name ${FAM_MARIADB_NAME} --publish=3306:3306 --volume=${FAM_DATA_MARIADB_DIR}:/var/lib/mysql --volume=${FAM_IMPORT_DIR}:/import -e MYSQL_ROOT_PASSWORD=mariadb mariadb:10.1.18

# create the tables, load the data
sleep 10
cd ${FAM_IMPORT_DIR}
docker exec -it ${FAM_MARIADB_NAME} /bin/bash <<EndOfInput
cd /import
mysql --user=family --password=family < ./mariadb-create.sql
EndOfInput

cd ${FAM_HOME}
 
# stop the instance
docker stop ${FAM_MARIADB_NAME}
