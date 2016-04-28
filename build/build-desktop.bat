CD /D %~dp0
call npm install -g grunt-cli
call npm install
rem call grunt --level=WHITESPACE_ONLY --desktop=true --formatting=PRETTY_PRINT
call grunt --level=ADVANCED --desktop=true
copy ..\word\sdk-all.js ..\..\core\build\jsdesktop\word\sdk-all.js
copy ..\slide\sdk-all.js ..\..\core\build\jsdesktop\slide\sdk-all.js
copy ..\cell\sdk-all.js ..\..\core\build\jsdesktop\cell\sdk-all.js
copy ..\common\Native\native.js ..\..\core\build\jsdesktop\common\Native\native.js

copy ..\word\sdk-all.js ..\..\core\DesktopEditor\ChromiumBasedEditors2\app\test\src\build\win_64\Debug\Local\editors\sdkjs\word\sdk-all.js
copy ..\slide\sdk-all.js ..\..\core\DesktopEditor\ChromiumBasedEditors2\app\test\src\build\win_64\Debug\Local\editors\sdkjs\slide\sdk-all.js
copy ..\cell\sdk-all.js ..\..\core\DesktopEditor\ChromiumBasedEditors2\app\test\src\build\win_64\Debug\Local\editors\sdkjs\cell\sdk-all.js
copy ..\common\Native\native.js ..\..\core\DesktopEditor\ChromiumBasedEditors2\app\test\src\build\win_64\Debug\Local\editors\sdkjs\common\Native\native.js

copy ..\word\sdk-all.js ..\..\core\DesktopEditor\ChromiumBasedEditors2\app\test\src\build\win_64\Release\Local\editors\sdkjs\word\sdk-all.js
copy ..\slide\sdk-all.js ..\..\core\DesktopEditor\ChromiumBasedEditors2\app\test\src\build\win_64\Release\Local\editors\sdkjs\slide\sdk-all.js
copy ..\cell\sdk-all.js ..\..\core\DesktopEditor\ChromiumBasedEditors2\app\test\src\build\win_64\Release\Local\editors\sdkjs\cell\sdk-all.js
copy ..\common\Native\native.js ..\..\core\DesktopEditor\ChromiumBasedEditors2\app\test\src\build\win_64\Release\Local\editors\sdkjs\common\Native\native.js

pause