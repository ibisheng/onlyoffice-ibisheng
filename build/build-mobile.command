#!/bin/bash

echo "----------------------------------------"
echo "Building for mobile"
echo "----------------------------------------"

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
cd $BASEDIR

npm install
grunt --level=WHITESPACE_ONLY --mobile=true --formatting=PRETTY_PRINT --noclosure=true
cat "../cell/sdk-all-min.js" "../cell/sdk-all.js" > "../../mobile-apps/ios/Vendor/ONLYOFFICE/SDKData/spreadsheets/script.bin"
