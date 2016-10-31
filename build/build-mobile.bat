CD /D %~dp0
call npm install -g grunt-cli
call npm install
rem call grunt --level=WHITESPACE_ONLY --mobile=true --formatting=PRETTY_PRINT
call grunt --level=ADVANCED --mobile=true

copy /b ..\word\sdk-all-min.js + ..\word\sdk-all.js ..\..\core\build\jsnative\word\script.bin
copy /b ..\cell\sdk-all-min.js + ..\cell\sdk-all.js ..\..\core\build\jsnative\cell\script.bin
copy /b ..\slide\sdk-all-min.js + ..\slide\sdk-all.js ..\..\core\build\jsnative\slide\script.bin

xcopy /s ..\..\core\build\jsnative ..\..\core-ext\resources_native\jsnative\

pause