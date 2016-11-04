#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. bin/env.sh

# create dir
rm -rf ${FAM_APP_DIR}
mkdir -p ${FAM_APP_DIR}

# copy necessary files to tmp dir
cp -r app_api ${FAM_APP_DIR}
cp -r app_server ${FAM_APP_DIR}
mkdir -p ${FAM_APP_DIR}/bin
cp -r bin/www ${FAM_APP_DIR}/bin
cp -r public ${FAM_APP_DIR}
cp Dockerfile app.js package.json ${FAM_APP_DIR}

# build docker image

cd ${FAM_APP_DIR}
docker build -t ${FAM_APP_NAME} .
