#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. bin/env.sh

DATE=`date +"%Y%m%d%H%M%S"`
LOGFILE=${FAM_LOG_DIR}/${DATE}_famvis.log

docker logs ${FAM_APP_NAME} > ${LOGFILE}
