CD /D %~dp0
call npm install -g grunt-cli
call npm install
rem call grunt --level=WHITESPACE_ONLY --mobile=true --formatting=PRETTY_PRINT
call grunt --level=WHITESPACE_ONLY --mobile=true --noclosure=true --formatting=PRETTY_PRINT

echo.> tmp_newline.txt
copy /b/y ..\..\web-apps\vendor\xregexp\xregexp-all-min.js + tmp_newline.txt + ..\..\web-apps\vendor\underscore\underscore-min.js + tmp_newline.txt + ..\common\Native\Wrappers\common.js + tmp_newline.txt + ..\common\Native\jquery_native.js + tmp_newline.txt ..\mobile_banners.js

copy /b/y ..\mobile_banners.js + ..\word\sdk-all-min.js + ..\word\sdk-all.js ..\..\core\build\jsnative\word\script.bin
copy /b/y ..\mobile_banners.js + ..\cell\sdk-all-min.js + ..\cell\sdk-all.js ..\..\core\build\jsnative\cell\script.bin
copy /b/y ..\mobile_banners.js + ..\slide\sdk-all-min.js + ..\slide\sdk-all.js ..\..\core\build\jsnative\slide\script.bin

del ..\mobile_banners.js
del tmp_newline.txt

xcopy /s/y ..\..\core\build\jsnative ..\..\core-ext\resources_native\jsnative\
if exist ..\..\core-ext\resources_native\jsnative\slide\script.cache del ..\..\core-ext\resources_native\jsnative\slide\script.cache
pause