#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. env.sh

echo "Step 1. create directories"
./init-dirs.sh

cd ${FAM_HOME}

echo "Step 2. create MariaDB"
./init-mariadb.sh

echo "Step 3. create Neo4J"
./init-neo4j.sh

echo "Step 4. create web app"
./init-famvis.sh

echo "Done. Now stopping all services"

./stop-all.sh
