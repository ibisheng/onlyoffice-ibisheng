CD /D %~dp0
call npm install -g grunt-cli
call npm install
call grunt --level=WHITESPACE_ONLY --nomap=true --mobile=true --formatting=PRETTY_PRINT
move ..\slide\sdk-all.js ..\..\core\test_mobile\sdk-all.js
copy ..\common\Native\native.js  ..\..\core\test_mobile\native.js
copy ..\common\Native\jquery_native.js  ..\..\core\test_mobile\jquery_native.js
pause