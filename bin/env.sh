#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

# Directories

export FAM_INSTALL_DIR=$PWD/install

export FAM_SRC_IMPORT_DIR=import
export FAM_IMPORT_DIR=${FAM_INSTALL_DIR}/import

# DATA
export FAM_DATA_DIR=${FAM_INSTALL_DIR}/data
export FAM_DATA_MARIADB_DIR=${FAM_DATA_DIR}/docker-mariadb-data
export FAM_DATA_NEO4J_DIR=${FAM_DATA_DIR}/docker-neo4j-data

export FAM_MARIADB_NAME=m1
export FAM_NEO4J_NAME=n1

# FamVis
export FAM_APP_NAME=famvis
export FAM_APP=${FAM_INSTALL_DIR}/app
