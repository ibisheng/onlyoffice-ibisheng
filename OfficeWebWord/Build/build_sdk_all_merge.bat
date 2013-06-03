@ECHO OFF

SET BUILD_DIR=%CD%



SET SOURCE_MAP_NAME=SourceMap.js

SET OUTPUT_SCRIPT_NAME=sdk-all-merge.js
SET OUTPUT_FOLDER=../Build/deploy/merge

SET LOG_FOLDER=Log

CD ..\WebWord

SET TEXT_ENGINE=.
SET FONT_ENGINE=..\FontsFreeType
SET COMMON_FOLDER=..\..\OfficeWebCommon



SET EDITOR_API_EXPORT_FILE=%LOG_FOLDER%\apiExport.js

SET VARIABLE_MAP_FILE=%LOG_FOLDER%\variable.map
SET PROPERTY_MAP_FILE=%LOG_FOLDER%\property.map

SET OUTVAL_MAP_FILE=%LOG_FOLDER%\out_val.map
SET OUTOBF_MAP_FILE=%LOG_FOLDER%\out_obf.map

SET CLOSURE_COMPILER=com.google.javascript.jscomp.CommandLineRunner

ECHO Make output folder: %LOG_FOLDER%
MKDIR %LOG_FOLDER%


rem --formatting PRETTY_PRINT ^

SET EDITOR_API_FILE=%TEXT_ENGINE%\merge\api_merge.js
SET EDITOR_APIDEFINE_FILE=%TEXT_ENGINE%\apiDefines.js

java %CLOSURE_COMPILER% ^
--compilation_level SIMPLE_OPTIMIZATIONS ^
--js ^
	"%TEXT_ENGINE%\merge\utils.js" ^
	"%TEXT_ENGINE%\Editor\CollaborativeEditing.js" ^
	"%TEXT_ENGINE%\Editor\History.js" ^
	"%TEXT_ENGINE%\Editor\Styles.js" ^
	"%TEXT_ENGINE%\Editor\DrawingObjects.js" ^
	"%TEXT_ENGINE%\Editor\FlowObjects.js" ^
	"%TEXT_ENGINE%\Editor\ParagraphContent.js" ^
	"%TEXT_ENGINE%\Editor\Paragraph.js" ^
	"%TEXT_ENGINE%\Editor\Sections.js" ^
	"%TEXT_ENGINE%\Editor\Numbering.js" ^
	"%TEXT_ENGINE%\Editor\HeaderFooter.js" ^
	"%TEXT_ENGINE%\Editor\Document.js" ^
	"%TEXT_ENGINE%\Editor\Common.js" ^
	"%TEXT_ENGINE%\Editor\DocumentContent.js" ^
	"%TEXT_ENGINE%\Editor\Table.js" ^
	"%TEXT_ENGINE%\Editor\Serialize2.js" ^
	"%EDITOR_APIDEFINE_FILE%" ^
	"%EDITOR_API_FILE%" ^
	--js_output_file "%OUTPUT_SCRIPT_NAME%" ^
	--warning_level QUIET ^
	--variable_map_output_file "%VARIABLE_MAP_FILE%" ^
	--property_map_output_file "%PROPERTY_MAP_FILE%" ^
	--create_source_map "%OUTPUT_SCRIPT_NAME%.map" ^
	--source_map_format=V3

@if NOT "%ERRORLEVEL%"=="0" goto error

SET OUTPUT_APIDEFINE_FILE=%EDITOR_APIDEFINE_FILE%.tmp

java %CLOSURE_COMPILER% ^
	--compilation_level SIMPLE_OPTIMIZATIONS ^
	--js "%EDITOR_APIDEFINE_FILE%" ^
	--js_output_file "%OUTPUT_APIDEFINE_FILE%"

@if NOT "%ERRORLEVEL%"=="0" goto error

COPY /Y /B "%OUTPUT_SCRIPT_NAME%"+"%OUTPUT_APIDEFINE_FILE%" "%OUTPUT_SCRIPT_NAME%"
MOVE /Y "%OUTPUT_SCRIPT_NAME%" "%OUTPUT_FOLDER%"
DEL /Q "%OUTPUT_APIDEFINE_FILE%"

COPY /Y /B "%TEXT_ENGINE%\merge\merge.js" "%OUTPUT_FOLDER%"

@ECHO off

cd "%BUILD_DIR%"
exit /b 0


:check_compiler
java -classpath %CLASSPATH% %CLOSURE_COMPILER% --help >nul 2>&1
if "%ERRORLEVEL%"=="-1" exit /b 0
if NOT EXIST google-cc-path.txt echo %cd% > google-cc-path.txt
:_1
set /p gccpath=<google-cc-path.txt
call :check_gccpath "%gccpath%" && exit /b 0
echo Please enter correct path to Google Closure Complier directory in "google-cc-path.txt" file
echo.
start "" /wait notepad google-cc-path.txt
goto _1

:check_gccpath
if EXIST "%~1\compiler.jar" (
  if "%CLASSPATH%"=="" (
    set CLASSPATH="%~1\compiler.jar"
  ) else (
    set CLASSPATH=%CLASSPATH%;"%~1\compiler.jar"
  )
  exit /b 0
)
exit /b 1


:error
@exit /b 1