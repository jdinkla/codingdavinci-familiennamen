#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. bin/env.sh

# create dir
mkdir -p ${FAM_APP}

# copy necessary files to tmp dir
cd ${APP_DIR}

cp Dockerfile ${FAM_APP}
cp -r app_api ${FAM_APP}
cp -r app_server ${FAM_APP}
cp -r bin ${FAM_APP}
cp -r public ${FAM_APP}
cp app.js package.json ${FAM_APP}

# build docker image
cd ${FAM_APP}
docker build -t ${FAM_APP_NAME} .
