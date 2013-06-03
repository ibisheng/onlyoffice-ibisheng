@ECHO OFF

SET MENU_FOLDER=C:\Hg

SET FONT_ENGINE=..\FontsFreeType
SET TEXT_ENGINE=..\WebWord
SET COMMON=..\..\OfficeWebCommon

SET DEPLOY_FOLDER=deploy
SET OUTPUT_FOLDER=%DEPLOY_FOLDER%\sdk\OfficeWebWord

SET OUTPUT_FONT_FOLDER=%OUTPUT_FOLDER%\FontsFreeType\FontFiles

SET RESULT_SCRIPT_NAME=%OUTPUT_FOLDER%\WebWord\sdk-all.js

ECHO ----------------------------------
ECHO Make output folder: %OUTPUT_FOLDER%
ECHO ----------------------------------

MKDIR %OUTPUT_FOLDER%

rem Build site structure
ECHO ----------------------------------
ECHO Copy fonts files
ECHO ----------------------------------
XCOPY "%FONT_ENGINE%\FontFiles" "%OUTPUT_FONT_FOLDER%" /Y /I /Q

rem ECHO Copy scroll resources
ECHO ----------------------------------
ECHO Copy common resorses
ECHO ----------------------------------
XCOPY "%COMMON%\MobileDownloader" "%OUTPUT_FOLDER%\..\OfficeWebCommon\MobileDownloader" /Y /I /Q
XCOPY "%COMMON%\docscoapisettings.js" "%OUTPUT_FOLDER%\..\OfficeWebCommon\" /Y /I /Q

ECHO ----------------------------------
ECHO Copy cursor resources
ECHO ----------------------------------
XCOPY "%TEXT_ENGINE%\Images\copy_format.cur" "%OUTPUT_FOLDER%\WebWord\Images\" /Y /I /Q
XCOPY "%TEXT_ENGINE%\Images\copy_format.png" "%OUTPUT_FOLDER%\WebWord\Images\" /Y /I /Q

XCOPY "%TEXT_ENGINE%\Images\marker_format.cur" "%OUTPUT_FOLDER%\WebWord\Images\" /Y /I /Q
XCOPY "%TEXT_ENGINE%\Images\marker_format.png" "%OUTPUT_FOLDER%\WebWord\Images\" /Y /I /Q

rem XCOPY "%TEXT_ENGINE%\apiDefines.js" "%OUTPUT_FOLDER%\apiDefines.js" /Y /I /Q

rem --formatting PRETTY_PRINT ^

SET EDITOR_API_FILE=%TEXT_ENGINE%\api.js
SET EDITOR_APIDEFINE_FILE=%TEXT_ENGINE%\apiDefines.js

SET BUIL_LOG_DIR=Log

SET EDITOR_API_EXPORT_FILE=%BUIL_LOG_DIR%\apiExport.js

SET VARIABLE_MAP_FILE=%BUIL_LOG_DIR%\variable.map
SET PROPERTY_MAP_FILE=%BUIL_LOG_DIR%\property.map

SET OUTVAL_MAP_FILE=%BUIL_LOG_DIR%\out_val.map
SET OUTOBF_MAP_FILE=%BUIL_LOG_DIR%\out_obf.map

ECHO ----------------------------------
ECHO Generate api exports
ECHO ----------------------------------
ExtractJSApi.exe "%EDITOR_API_FILE%" "%EDITOR_API_EXPORT_FILE%"

CALL build_sdk_all.bat %RESULT_SCRIPT_NAME%  %BUIL_LOG_DIR% "ASC_DOCS_API_DEBUG=false"

rem GOTO Sucsess

CALL %MENU_FOLDER%\Build\build.bat


ECHO ----------------------------------
ECHO Copy menu
ECHO ----------------------------------
rem XCOPY /S %MENU_FOLDER%\3rdparty %DEPLOY_FOLDER%\3rdparty\ /Y
XCOPY /S %MENU_FOLDER%\deploy\api %DEPLOY_FOLDER%\apps\api\ /Y
XCOPY /S %MENU_FOLDER%\deploy\documenteditor %DEPLOY_FOLDER%\apps\documenteditor\ /Y

SET MENU_DEPLOY_FOLDER=%DEPLOY_FOLDER%\apps
SET EDITOR_MENU=%MENU_DEPLOY_FOLDER%\documenteditor
set EDITOR_MENU_JS_FILE=%EDITOR_MENU%\main\app-all.js
set TOUCH_EDITOR_MENU_JS_FILE=%EDITOR_MENU%\mobile\app-all.js

set API_TEST_JS_FILE=api_functions.js
set OUTPUT_API_TEST_JS_FILE=%BUIL_LOG_DIR%\%API_TEST_JS_FILE%

ECHO ----------------------------------
ECHO Obfuscate JS API
ECHO ----------------------------------
ObfuscateJSApi.exe -verbose -ccvars "%VARIABLE_MAP_FILE%" ^
	-ccprops "%PROPERTY_MAP_FILE%" ^
	-api "%EDITOR_API_EXPORT_FILE%" ^
	-clientjs "%EDITOR_MENU_JS_FILE%" "%EDITOR_MENU_JS_FILE%" ^
	-clientjs "%TOUCH_EDITOR_MENU_JS_FILE%" "%TOUCH_EDITOR_MENU_JS_FILE%" ^
	-clientjs "%API_TEST_JS_FILE%" "%OUTPUT_API_TEST_JS_FILE%" ^
	-ccres "%RESULT_SCRIPT_NAME%" "%RESULT_SCRIPT_NAME%"

ECHO ----------------------------------
ECHO Obfuscate callback name
ECHO ----------------------------------
ObfuscateStrings.exe ^
 -api "%RESULT_SCRIPT_NAME%" ^
 -pat "\"On[A-Z]+\w*\"" -exp se -outmap "%OUTVAL_MAP_FILE%" "%OUTOBF_MAP_FILE%" ^
 -apply "%EDITOR_MENU_JS_FILE%" "%EDITOR_MENU_JS_FILE%" ^
 -apply "%TOUCH_EDITOR_MENU_JS_FILE%" "%TOUCH_EDITOR_MENU_JS_FILE%" ^
 -apply "%OUTPUT_API_TEST_JS_FILE%" "%OUTPUT_API_TEST_JS_FILE%" ^
 -apply "%RESULT_SCRIPT_NAME%" "%RESULT_SCRIPT_NAME%"

 
:Sucsess
	
pause
