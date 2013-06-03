SET TABLE_ENGINE=..

SET DEPLOY_FOLDER=..\..\OfficeWebWord\Build\deploy
SET OUTPUT_FOLDER=%DEPLOY_FOLDER%\sdk\OfficeWebExcel

SET OUTPUT_SCRIPT_NAME=sdk-all.js
SET RESULT_SCRIPT=%OUTPUT_FOLDER%\%OUTPUT_SCRIPT_NAME%

ECHO Make output folder: %OUTPUT_FOLDER%
MKDIR %OUTPUT_FOLDER%

ECHO Copy resources
XCOPY "%TABLE_ENGINE%\css\*.css" "%OUTPUT_FOLDER%\css\" /Y /I /Q

SET BUILD_LOG_DIR=Log

call build_sdk_all.bat %RESULT_SCRIPT% %BUILD_LOG_DIR%

SET MENU_FOLDER=C:\Hg
CALL %MENU_FOLDER%\Build\build-se.bat

XCOPY /S %MENU_FOLDER%\deploy\api %DEPLOY_FOLDER%\apps\api\ /Y
XCOPY /S %MENU_FOLDER%\deploy\spreadsheeteditor %DEPLOY_FOLDER%\apps\spreadsheeteditor\ /Y

SET MENU_DEPLOY_FOLDER=%DEPLOY_FOLDER%\apps
SET EDITOR_MENU=%MENU_DEPLOY_FOLDER%\spreadsheeteditor
set EDITOR_MENU_JS_FILE=%EDITOR_MENU%\main\app-all.js
set TOUCH_EDITOR_MENU_JS_FILE=%EDITOR_MENU%\mobile\app-all.js

set API_TEST_JS_FILE=api_functions.js
set OUTPUT_API_TEST_JS_FILE=%BUILD_LOG_DIR%\%API_TEST_JS_FILE%

ECHO ON
ECHO Obfuscate callback name

SET OUTVAL_MAP_FILE=%BUILD_LOG_DIR%\out_val.map
SET OUTOBF_MAP_FILE=%BUILD_LOG_DIR%\out_obf.map

rem asc_\w*

ObfuscateStrings.exe ^
 -api "%RESULT_SCRIPT%" ^
 -pat "asc_\w+" -exp se -use-for-name -outmap "%OUTVAL_MAP_FILE%" "%OUTOBF_MAP_FILE%" ^
 -apply "%RESULT_SCRIPT%" "%RESULT_SCRIPT%" ^
 -apply "%EDITOR_MENU_JS_FILE%" "%EDITOR_MENU_JS_FILE%" ^
 -apply "%TOUCH_EDITOR_MENU_JS_FILE%" "%TOUCH_EDITOR_MENU_JS_FILE%" ^
 -apply "%API_TEST_JS_FILE%" "%OUTPUT_API_TEST_JS_FILE%"
 
pause