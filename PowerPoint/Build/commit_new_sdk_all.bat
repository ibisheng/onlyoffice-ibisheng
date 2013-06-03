@echo off

SET STABLE_API_FOLDER=..\..\..\..\..\ASC\Redist\WEB\sdk\OfficeWebPowerPoint
SET STABLE_API_FOLDER=C:\hg.default\sdk\OfficeWebPowerPoint
SET STABLE_SDK_FOLDER=%STABLE_API_FOLDER%
SET STABLE_SDK_JS=%STABLE_SDK_FOLDER%\sdk-all.js
SET STABLE_SDK_LOG_FOLDER=Log
SET SDK_SOURCE_FOLDER=..

call :check_svn || exit /b 1

cd /D "%~dp0" || exit /b 1

echo Update OfficeWebWord svn repository
svn update %SDK_SOURCE_FOLDER%

echo Copy API script.
XCOPY "%SDK_SOURCE_FOLDER%\api.js" "%STABLE_API_FOLDER%\" /Y /I /Q
XCOPY "%SDK_SOURCE_FOLDER%\apiCommon.js" "%STABLE_API_FOLDER%\" /Y /I /Q
XCOPY "%SDK_SOURCE_FOLDER%\apiDefines.js" "%STABLE_API_FOLDER%\" /Y /I /Q
XCOPY "%SDK_SOURCE_FOLDER%\EditorSettings.js" "%STABLE_API_FOLDER%\" /Y /I /Q

XCOPY "%SDK_SOURCE_FOLDER%\Images\*.*" "%STABLE_API_FOLDER%\Images\" /Y /I /Q /E
XCOPY "%SDK_SOURCE_FOLDER%\menu\*.*" "%STABLE_API_FOLDER%\menu\" /Y /I /Q /E
XCOPY "%SDK_SOURCE_FOLDER%\MenuIcons\*.*" "%STABLE_API_FOLDER%\MenuIcons\" /Y /I /Q /E
XCOPY "%SDK_SOURCE_FOLDER%\index.html.deploy" "%STABLE_API_FOLDER%\index.html" /Y /I /Q

XCOPY  /S "%SDK_SOURCE_FOLDER%\document" "%STABLE_API_FOLDER%\document\" /Y 
XCOPY  /S "%SDK_SOURCE_FOLDER%\themes" "%STABLE_API_FOLDER%\themes\" /Y 

echo Build new version 
CALL build_sdk_all.bat %STABLE_SDK_JS% %STABLE_SDK_LOG_FOLDER% "ASC_DOCS_API_DEBUG=true"

XCOPY "%STABLE_SDK_LOG_FOLDER%\property.map" "%STABLE_API_FOLDER%\property.map" /Y /I /Q
XCOPY "%STABLE_SDK_LOG_FOLDER%\variable.map" "%STABLE_API_FOLDER%\variable.map" /Y /I /Q
XCOPY "%STABLE_SDK_LOG_FOLDER%\apiExport.js" "%STABLE_API_FOLDER%\apiExport.js" /Y /I /Q

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
