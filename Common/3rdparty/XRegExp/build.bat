@ECHO OFF
set YUI_COMPRESSOR=com.yahoo.platform.yui.compressor.Bootstrap

SET XREGEXP_SRC_FOLDER=.\src
SET XREGEXP_INPUT_FILES=^
%XREGEXP_SRC_FOLDER%\xregexp.js ^
%XREGEXP_SRC_FOLDER%\addons\prototypes.js ^
%XREGEXP_SRC_FOLDER%\addons\matchrecursive.js ^
%XREGEXP_SRC_FOLDER%\addons\unicode\unicode-base.js ^
%XREGEXP_SRC_FOLDER%\addons\unicode\unicode-categories.js

SET XREGEXP_OUTPUT_FILE=".\xregexp-all-min.js"

if exist %XREGEXP_OUTPUT_FILE% (
	DEL %XREGEXP_OUTPUT_FILE% /Q || exit /b 1
)

for %%i in (%XREGEXP_INPUT_FILES%) do (
    java %YUI_COMPRESSOR% "%%~i" >> "%XREGEXP_OUTPUT_FILE%"
        
    if errorlevel 1 (
        echo CSS compression failed^^!
        exit /b 1
    )
)
ECHO Script finished successfuly!
pause
