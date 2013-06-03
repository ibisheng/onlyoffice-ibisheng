@echo off

SET STABLE_API_FOLDER=..\..\..\..\..\ASC\Redist\WEB\sdk\OfficeWebWord
SET STABLE_SDK_FOLDER=%STABLE_API_FOLDER%\WebWord
SET STABLE_SDK_JS=%STABLE_SDK_FOLDER%\sdk-all.js
SET STABLE_SDK_LOG_FOLDER=Log
SET SDK_SOURCE_FOLDER=..
SET SDK_COMMON_SOURCE_FOLDER=..\..\OfficeWebCommon
SET COMMIT_MESSAGE_FILE=info.log

call :check_svn || exit /b 1

cd /D "%~dp0" || exit /b 1

echo Update OfficeWebWord svn repository
svn update %SDK_COMMON_SOURCE_FOLDER%
svn update %SDK_SOURCE_FOLDER%

echo Copy API script.
XCOPY /S "%SDK_SOURCE_FOLDER%\WebWord\document" "%STABLE_API_FOLDER%\document\" /Y
XCOPY "%SDK_SOURCE_FOLDER%\WebWord\api.js" "%STABLE_API_FOLDER%\api.js" /Y /I /Q
XCOPY "%SDK_SOURCE_FOLDER%\WebWord\apiDefines.js" "%STABLE_API_FOLDER%\apiDefines.js" /Y /I /Q

echo "sdk-all.js was build from svn repository (see log below):"  > %COMMIT_MESSAGE_FILE%
svn info %SDK_SOURCE_FOLDER% >> %COMMIT_MESSAGE_FILE%

echo Build new version 
CALL build_sdk_all.bat %STABLE_SDK_JS% %STABLE_SDK_LOG_FOLDER% "ASC_DOCS_API_DEBUG=true"

XCOPY "%STABLE_SDK_LOG_FOLDER%\property.map" "%STABLE_API_FOLDER%\WebWord\property.map" /Y /I /Q
XCOPY "%STABLE_SDK_LOG_FOLDER%\variable.map" "%STABLE_API_FOLDER%\WebWord\variable.map" /Y /I /Q
XCOPY "%STABLE_SDK_LOG_FOLDER%\apiExport.js" "%STABLE_API_FOLDER%\WebWord\apiExport.js" /Y /I /Q

echo Update putput svn repository
svn update %STABLE_API_FOLDER%

echo Commit changes
@echo on
svn commit %STABLE_API_FOLDER% -F %COMMIT_MESSAGE_FILE%
@echo off

del %COMMIT_MESSAGE_FILE%

echo Script finished successfully!
pause
exit /b 0

:check_svn
svn help > nul 2>&1
if errorlevel 1 (
	echo Cannot find subversion command-line client.
	pause
    exit /b 1
)
exit /b 0
