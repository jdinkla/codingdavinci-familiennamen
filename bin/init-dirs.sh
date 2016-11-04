#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. bin/env.sh

rm -rf ${FAM_INSTALL_DIR}
mkdir -p ${FAM_INSTALL_DIR}

# uncompress the data in the import directory
mkdir -p ${FAM_IMPORT_DIR}
cp ${FAM_SRC_IMPORT_DIR}/* ${FAM_IMPORT_DIR}
gunzip -f ${FAM_IMPORT_DIR}/*.tsv.gz

# create the directories for the databases
mkdir -p ${FAM_DATA_DIR}
mkdir -p ${FAM_DATA_NEO4J_DIR}
mkdir -p ${FAM_DATA_MARIADB_DIR}
