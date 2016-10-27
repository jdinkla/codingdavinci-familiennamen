#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. env.sh

# uncompress the data in the import directory
cd ${FAM_IMPORT_DIR}
gunzip *.tsv.gz

# create the directories for the databases
cd ${FAM_DATA_DIR}
mkdir -p ${FAM_DATA_NEO4J_DIR}
mkdir -p ${FAM_DATA_MARIADB_DIR}
