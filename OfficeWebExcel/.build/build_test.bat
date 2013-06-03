SET TABLE_ENGINE=..

SET DEPLOY_FOLDER=..\..\OfficeWebWord\Build\deploy
SET OUTPUT_FOLDER=%DEPLOY_FOLDER%\sdk\OfficeWebExcel_menu

SET OUTPUT_SCRIPT_NAME=%OUTPUT_FOLDER%\sdk-all.js

ECHO Make output folder: %OUTPUT_FOLDER%
MKDIR %OUTPUT_FOLDER%

ECHO Copy resources
XCOPY "%TABLE_ENGINE%\css\*.*" "%OUTPUT_FOLDER%\css\" /Y /I /Q /E
XCOPY "%TABLE_ENGINE%\menu\*.*" "%OUTPUT_FOLDER%\menu\" /Y /I /Q /E
XCOPY "%TABLE_ENGINE%\jquery\*.*" "%OUTPUT_FOLDER%\jquery\" /Y /I /Q /E
XCOPY "%TABLE_ENGINE%\SpreadsheetTestMenu.deploy" "%OUTPUT_FOLDER%\SpreadsheetTestMenu.html" /Y /I /Q

SET BUIL_LOG_DIR=Log

call build_sdk_all.bat %OUTPUT_SCRIPT_NAME% %BUIL_LOG_DIR% SIMPLE_OPTIMIZATIONS

pause