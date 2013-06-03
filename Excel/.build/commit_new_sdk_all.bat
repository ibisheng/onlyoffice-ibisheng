@echo off

if NOT "%~1"=="" SET SIMULATE=1

call check_stable_api.cmd
call check_svn.cmd || goto error

SET STABLE_SDK_JS=%STABLE_API_PATH%\sdk-all.js
SET STABLE_SDK_LOG_FOLDER=Log
SET STABLE_TRDPARTY_PATH=%STABLE_API_PATH%\..\..\3rdparty

SET SDK_SOURCE_FOLDER=..
SET SDK_TRDPARTY_PATH=%SDK_SOURCE_FOLDER%\..\OfficeWebCommon\3rdparty

SET COMMIT_MESSAGE_FILE=info.log

cd /D "%~dp0" || exit /b 1

echo.
echo ----------------------------------------
echo Update STABLE repository
echo ----------------------------------------
svn update %STABLE_API_PATH%
@if NOT "%ERRORLEVEL%"=="0" goto error

echo.
echo ----------------------------------------
echo Update DEV repository
echo ----------------------------------------
svn update "%SDK_SOURCE_FOLDER%"
@if NOT "%ERRORLEVEL%"=="0" goto error
svn update "%SDK_SOURCE_FOLDER%\..\OfficeWebCommon"
@if NOT "%ERRORLEVEL%"=="0" goto error
svn update "%SDK_SOURCE_FOLDER%\..\OfficeWebWord"
@if NOT "%ERRORLEVEL%"=="0" goto error
svn update "%SDK_SOURCE_FOLDER%\..\OfficeWebExcelChart"
@if NOT "%ERRORLEVEL%"=="0" goto error

echo.
echo ----------------------------------------
echo Copy THIRD PARTY scripts
echo ----------------------------------------
XCOPY "%SDK_TRDPARTY_PATH%\underscore\underscore-min.js" "%STABLE_TRDPARTY_PATH%\underscore\underscore-min.js" /Y /I /Q
XCOPY "%SDK_TRDPARTY_PATH%\xregexp\xregexp-all-min.js" "%STABLE_TRDPARTY_PATH%\xregexp\xregexp-all-min.js" /Y /I /Q
XCOPY "%SDK_TRDPARTY_PATH%\sockjs\sockjs-0.3.min.js" "%STABLE_TRDPARTY_PATH%\sockjs\sockjs-min.js" /Y /I /Q

echo.
echo ----------------------------------------
echo Copy API script
echo ----------------------------------------
XCOPY "%SDK_SOURCE_FOLDER%\api.js" "%STABLE_API_PATH%\api.js" /Y /I /Q
XCOPY "%SDK_SOURCE_FOLDER%\apiDefines.js" "%STABLE_API_PATH%\apiDefines.js" /Y /I /Q
XCOPY "%SDK_SOURCE_FOLDER%\view\EventsController.js" "%STABLE_API_PATH%\view\EventsController.js" /Y /I /Q
XCOPY "%SDK_SOURCE_FOLDER%\view\HandlerList.js" "%STABLE_API_PATH%\view\HandlerList.js" /Y /I /Q
XCOPY "%SDK_SOURCE_FOLDER%\model\AdvancedOptions.js" "%STABLE_API_PATH%\model\AdvancedOptions.js" /Y /I /Q
XCOPY "%SDK_SOURCE_FOLDER%\model\CellInfo.js" "%STABLE_API_PATH%\model\CellInfo.js" /Y /I /Q
XCOPY "%SDK_SOURCE_FOLDER%\model\DrawingObjects.js" "%STABLE_API_PATH%\model\DrawingObjects.js" /Y /I /Q
XCOPY "%SDK_SOURCE_FOLDER%\css\*.css" "%STABLE_API_PATH%\css\" /Y /I /Q
XCOPY "%SDK_SOURCE_FOLDER%\offlinedocs\*" "%STABLE_API_PATH%\offlinedocs\" /Y /I /Q /S
XCOPY "%SDK_SOURCE_FOLDER%\Spreadsheet.html.deploy" "%STABLE_API_PATH%\Spreadsheet.html" /Y /I /Q

echo "sdk-all.js was build from svn repository (see log below):"  > %COMMIT_MESSAGE_FILE%
svn info %SDK_SOURCE_FOLDER% >> %COMMIT_MESSAGE_FILE%

echo.
echo ----------------------------------------
echo Build new version 
echo ----------------------------------------
CALL build_sdk_all.bat %STABLE_SDK_JS% %STABLE_SDK_LOG_FOLDER%
@if NOT "%ERRORLEVEL%"=="0" goto error

if DEFINED SIMULATE goto finish
echo.
echo ----------------------------------------
echo Commit changes
echo ----------------------------------------
@echo on
rem svn commit %STABLE_API_PATH% -F %COMMIT_MESSAGE_FILE%
@echo off

:finish
del %COMMIT_MESSAGE_FILE%

echo.
echo Script finished successfully!
pause
exit /b 0

:error
pause
exit /b 1
