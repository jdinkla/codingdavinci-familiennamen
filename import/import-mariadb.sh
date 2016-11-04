#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#
# this has to run in the docker IMAGE

mysql --user=root --password=mariadb < /import/mariadb-create.sql
