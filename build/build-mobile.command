#!/bin/bash

echo "----------------------------------------"
echo "Building for mobile"
echo "----------------------------------------"

BASEDIR="$(cd "$(dirname "$0")" && pwd)"

npm install
grunt --level=WHITESPACE_ONLY --mobile=true --formatting=PRETTY_PRINT
cp -v "../cell/sdk-all.js" "../../mobile-apps/ios/Vendor/ONLYOFFICE/SDKData/spreadsheets/script.bin"