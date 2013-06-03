@ECHO OFF

SET BUILD_DIR=%CD%



SET SOURCE_MAP_NAME=SourceMap.js

SET OUTPUT_SCRIPT_NAME=%~nx1
SET OUTPUT_FOLDER=%~dp1

SET LOG_FOLDER=%~f2

CD ..\WebWord

SET TEXT_ENGINE=.
SET FONT_ENGINE=..\FontsFreeType
SET COMMON_FOLDER=..\..\OfficeWebCommon



SET EDITOR_API_EXPORT_FILE=%LOG_FOLDER%\apiExport.js

SET VARIABLE_MAP_FILE=%LOG_FOLDER%\variable.map
SET PROPERTY_MAP_FILE=%LOG_FOLDER%\property.map

SET OUTVAL_MAP_FILE=%LOG_FOLDER%\out_val.map
SET OUTOBF_MAP_FILE=%LOG_FOLDER%\out_obf.map

SET GCC_DEFINE=%3

SET CLOSURE_COMPILER=com.google.javascript.jscomp.CommandLineRunner

ECHO Make output folder: %LOG_FOLDER%
MKDIR %LOG_FOLDER%


rem --formatting PRETTY_PRINT ^

SET EDITOR_API_FILE=%TEXT_ENGINE%\api.js
SET EDITOR_APIDEFINE_FILE=%TEXT_ENGINE%\apiDefines.js



ECHO ON
%BUILD_DIR%\ExtractJSApi.exe "%EDITOR_API_FILE%" "%EDITOR_API_EXPORT_FILE%"

java %CLOSURE_COMPILER% ^
--compilation_level ADVANCED_OPTIMIZATIONS ^
--externs "%TEXT_ENGINE%\Drawing\scrolls\jquery.min.js" ^
--externs "%COMMON_FOLDER%\3rdparty\Underscore\underscore-min.js" ^
--externs "%COMMON_FOLDER%\3rdparty\Sockjs\sockjs-0.3.min.js" ^
--externs "%BUILD_DIR%\apiExtern.js" ^
--js ^
	"%COMMON_FOLDER%\License.js" ^
	"%COMMON_FOLDER%\docscoapicommon.js" ^
	"%COMMON_FOLDER%\docscoapi.js" ^
	"%COMMON_FOLDER%\downloaderfiles.js" ^
	"%FONT_ENGINE%\font_engine.js" ^
	"%FONT_ENGINE%\FontFile.js" ^
	"%FONT_ENGINE%\FontManager.js" ^
	"%TEXT_ENGINE%\Drawing\Externals.js" ^
	"%TEXT_ENGINE%\Drawing\AllFonts.js" ^
	"%TEXT_ENGINE%\Drawing\GlobalLoaders.js" ^
	"%FONT_ENGINE%\FontExport.js" ^
	"%TEXT_ENGINE%\Editor\CollaborativeEditing.js" ^
	"%TEXT_ENGINE%\Editor\Comments.js" ^
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
	"%TEXT_ENGINE%\Drawing\translations.js" ^
	"%TEXT_ENGINE%\Drawing\documentrenderer.js" ^
	"%TEXT_ENGINE%\Drawing\Graphics.js" ^
	"%TEXT_ENGINE%\Drawing\Metafile.js" ^
	"%TEXT_ENGINE%\Drawing\DrawingDocument.js" ^
	"%TEXT_ENGINE%\Drawing\GraphicsEvents.js" ^
	"%TEXT_ENGINE%\Drawing\WorkEvents.js" ^
	"%TEXT_ENGINE%\Drawing\Controls.js" ^
	"%TEXT_ENGINE%\Drawing\Rulers.js" ^
	"%TEXT_ENGINE%\Drawing\HtmlPage.js" ^
	"%TEXT_ENGINE%\Drawing\scrolls\scroll.js" ^
	"%EDITOR_APIDEFINE_FILE%" ^
	"%EDITOR_API_FILE%" ^
	"%EDITOR_API_EXPORT_FILE%" ^
	--define=%GCC_DEFINE% ^
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

ECHO //@ sourceMappingURL=http://localhost:8080/sdk/OfficeWebWord/WebWord/%OUTPUT_SCRIPT_NAME%.map>"%SOURCE_MAP_NAME%"

COPY /Y /B "%OUTPUT_SCRIPT_NAME%"+"%OUTPUT_APIDEFINE_FILE%"+"%SOURCE_MAP_NAME%" "%OUTPUT_SCRIPT_NAME%"
MOVE /Y "%OUTPUT_SCRIPT_NAME%" "%OUTPUT_FOLDER%"
COPY /Y "%OUTPUT_SCRIPT_NAME%.map" "%OUTPUT_FOLDER%"
DEL /Q "%OUTPUT_APIDEFINE_FILE%"
DEL /Q "%SOURCE_MAP_NAME%"

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