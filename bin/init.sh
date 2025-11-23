#!/bin/bash
#
# (c) 2016, Jörn Dinkla, http://www.dinkla.net
#
# see the file LICENSE in the root directory for license information
#

. bin/env.sh

echo "Step 1. create directories"
bin/init-dirs.sh

echo "Step 4. create web app"
bin/init-famvis.sh

echo "Created. Now start with run-all.sh"
