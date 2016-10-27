#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

# Directories^

export FAM_HOME=$PWD/..
export FAM_IMPORT_DIR=../import
export FAM_DATA_DIR=../data

# MariaDB
export FAM_MARIADB_NAME=mariadb
export FAM_DATA_MARIADB_DIR=${FAM_DATA_DIR}/docker-mariadb-data

# Neo4J
export FAM_NEO4J_NAME=neo4j
export FAM_DATA_NEO4J_DIR=${FAM_DATA_DIR}/docker-neo4j-data

# FamVis
export FAM_APP_NAME=famvis
export FAM_TMP=tmp

