CD /D %~dp0
call npm install -g grunt-cli
call npm install
call grunt --level=WHITESPACE_ONLY --mobile=true --formatting=PRETTY_PRINT
copy /b ..\slide\sdk-all-min.js + ..\slide\sdk-all.js  ..\..\core\test_mobile\script.bin
pause