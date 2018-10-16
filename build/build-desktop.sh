#!/bin/bash

cd "$(dirname "$0")"
npm install -g grunt-cli
npm install
grunt --level=ADVANCED --desktop=true

mkdir -pv ../../core/build/jsdesktop/sdkjs/{word,slide,cell}
mkdir -pv ../../core/build/jsdesktop/sdkjs/common/Native/

cp ../word/sdk-all.js ../../core/build/jsdesktop/sdkjs/word/sdk-all.js
cp ../slide/sdk-all.js ../../core/build/jsdesktop/sdkjs/slide/sdk-all.js
cp ../cell/sdk-all.js ../../core/build/jsdesktop/sdkjs/cell/sdk-all.js

cp ../word/sdk-all-min.js ../../core/build/jsdesktop/sdkjs/word/sdk-all-min.js
cp ../slide/sdk-all-min.js ../../core/build/jsdesktop/sdkjs/slide/sdk-all-min.js
cp ../cell/sdk-all-min.js ../../core/build/jsdesktop/sdkjs/cell/sdk-all-min.js

cp ../common/Native/native.js ../../core/build/jsdesktop/sdkjs/common/Native/native.js

if [ -d "../../core-ext" ]; then
    mkdir -pv ../../core-ext/desktop-sdk-wrapper/test/build/linux_64/Debug/editors/sdkjs/{word,slide,cell}
    mkdir -pv ../../core-ext/desktop-sdk-wrapper/test/build/linux_64/Debug/editors/sdkjs/common/Native/

    cp ../word/sdk-all.js ../../core-ext/desktop-sdk-wrapper/test/build/linux_64/Debug/editors/sdkjs/word/sdk-all.js
    cp ../slide/sdk-all.js ../../core-ext/desktop-sdk-wrapper/test/build/linux_64/Debug/editors/sdkjs/slide/sdk-all.js
    cp ../cell/sdk-all.js ../../core-ext/desktop-sdk-wrapper/test/build/linux_64/Debug/editors/sdkjs/cell/sdk-all.js

    cp ../word/sdk-all-min.js ../../core-ext/desktop-sdk-wrapper/test/build/linux_64/Debug/editors/sdkjs/word/sdk-all-min.js
    cp ../slide/sdk-all-min.js ../../core-ext/desktop-sdk-wrapper/test/build/linux_64/Debug/editors/sdkjs/slide/sdk-all-min.js
    cp ../cell/sdk-all-min.js ../../core-ext/desktop-sdk-wrapper/test/build/linux_64/Debug/editors/sdkjs/cell/sdk-all-min.js

    cp ../common/Native/native.js ../../core-ext/desktop-sdk-wrapper/test/build/linux_64/Debug/editors/sdkjs/common/Native/native.js
fi
