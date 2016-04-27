CD /D %~dp0
call npm install -g grunt-cli
call npm install
rem call grunt --level=WHITESPACE_ONLY --desktop=true --formatting=PRETTY_PRINT
call grunt --level=ADVANCED --desktop=true
copy ..\word\sdk-all.js ..\..\core\build\jsdesktop\sdkjs\word\sdk-all.js
copy ..\slide\sdk-all.js ..\..\core\build\jsdesktop\sdkjs\slide\sdk-all.js
copy ..\cell\sdk-all.js ..\..\core\build\jsdesktop\sdkjs\cell\sdk-all.js
copy ..\common\Native\native.js ..\..\core\build\jsdesktop\sdkjs\common\Native\native.js
pause