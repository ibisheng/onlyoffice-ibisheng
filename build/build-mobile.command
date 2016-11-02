#!/bin/bash

echo "----------------------------------------"
echo "Building for mobile"
echo "----------------------------------------"

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
cd $BASEDIR

npm install
grunt --level=WHITESPACE_ONLY --mobile=true --noclosure=true
cat "../word/sdk-all-min.js" "../word/sdk-all.js" > "../../mobile-apps/ios/Vendor/ONLYOFFICE/SDKData/documents/script.bin"
cat "../cell/sdk-all-min.js" "../cell/sdk-all.js" > "../../mobile-apps/ios/Vendor/ONLYOFFICE/SDKData/spreadsheets/script.bin"
