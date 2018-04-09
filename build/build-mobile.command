#!/bin/bash

PRODUCT_VERSION="5.1.1"
BUILD_NUMBER="83"

echo "----------------------------------------"
echo "Building for mobile"
echo "----------------------------------------"

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
cd $BASEDIR

npm install

PRODUCT_VERSION=$PRODUCT_VERSION BUILD_NUMBER=$BUILD_NUMBER grunt --level=WHITESPACE_ONLY --mobile=true --noclosure=true --formatting=PRETTY_PRINT
echo grunt --level=ADVANCED --mobile=true  --noclosure=true

printf $'\r' > temp.txt

cat "../../web-apps/vendor/xregexp/xregexp-all-min.js" "temp.txt" "../../web-apps/vendor/underscore/underscore-min.js" "temp.txt" "../common/native/wrappers/common.js" "temp.txt" "../common/native/jquery_native.js" "temp.txt" > "banners.js"

cat "banners.js" "../word/sdk-all-min.js" "../word/sdk-all.js" > "../../mobile-apps/ios/Vendor/ONLYOFFICE/SDKData/documents/script.bin"

rm -f -r "banners.js"

cat "../../web-apps/vendor/xregexp/xregexp-all-min.js" "temp.txt" "../../web-apps/vendor/underscore/underscore-min.js" "temp.txt" "../cell/native/common.js" "temp.txt" "../common/native/jquery_native.js" "temp.txt" > "banners.js"

cat "banners.js" "../cell/sdk-all-min.js" "../cell/sdk-all.js" > "../../mobile-apps/ios/Vendor/ONLYOFFICE/SDKData/spreadsheets/script.bin"

rm -f -r "banners.js"

cat "../../web-apps/vendor/xregexp/xregexp-all-min.js" "temp.txt" "../../web-apps/vendor/underscore/underscore-min.js" "temp.txt" "../common/native/wrappers/common.js" "temp.txt" "../common/native/jquery_native.js" "temp.txt" > "banners.js"

cat "banners.js" "../slide/sdk-all-min.js" "../slide/sdk-all.js" > "../../mobile-apps/ios/Vendor/ONLYOFFICE/SDKData/presentations/script.bin"

rm -f -r "banners.js"
rm -f -r "temp.txt"

printf $PRODUCT_VERSION.$BUILD_NUMBER > "../../mobile-apps/ios/Vendor/ONLYOFFICE/SDKData/documents/sdk.version"

printf $PRODUCT_VERSION.$BUILD_NUMBER > "../../mobile-apps/ios/Vendor/ONLYOFFICE/SDKData/spreadsheets/sdk.version"

printf $PRODUCT_VERSION.$BUILD_NUMBER > "../../mobile-apps/ios/Vendor/ONLYOFFICE/SDKData/presentations/sdk.version"
