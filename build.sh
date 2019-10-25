#!/bin/bash

PUBLIC_PATH="public"
MAIN_JS="$PUBLIC_PATH/js/live-current.js"

npm install

if [ ! -f $MAIN_JS ]; then
    echo "not found  $MAIN_JS"
    exit 1
fi

gzip -c public/js/live-current.js > public/js/live-current.js.gz

tar -czf lives.tar.gz -C public . 
