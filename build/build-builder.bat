CD /D %~dp0
call npm install -g grunt-cli
call npm install
call grunt --level=WHITESPACE_ONLY --mobile=true --formatting=PRETTY_PRINT
copy ..\slide\sdk-all.js ..\..\core\test_mobile\sdk-all.js
pause