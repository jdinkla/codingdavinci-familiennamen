#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#


. env.sh

# create dir
mkdir -p ${FAM_TMP}

# copy necessary files to tmp dir
cd ${APP_DIR}

cp Dockerfile ${FAM_TMP}
cp -r app_api ${FAM_TMP}
cp -r app_server ${FAM_TMP}
cp -r bin ${FAM_TMP}
cp -r public ${FAM_TMP}
cp app.js package.json ${FAM_TMP}

# build docker image
cd ${FAM_TMP}
docker build -t ${FAM_APP_NAME} .

# remove tmp dir
# rm -rf ${FAM_TMP}
