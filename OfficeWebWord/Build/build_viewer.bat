@ECHO OFF

SET FONT_ENGINE=..\FontsFreeType
SET TEXT_ENGINE=..\WebWord
SET VIEW_ENGINE=%TEXT_ENGINE%\Viewer
SET MENU_ENGINE=%TEXT_ENGINE%\menu

set CLOSURE_COMPILER=com.google.javascript.jscomp.CommandLineRunner

SET OUTPUT_SCRIPT_NAME=%VIEW_ENGINE%\viewer.js

rem --formatting PRETTY_PRINT ^

ECHO ON
ExtractJSApi.exe "%VIEW_ENGINE%\api.js" "apiViewerExport.js"

java %CLOSURE_COMPILER% ^
--compilation_level ADVANCED_OPTIMIZATIONS ^
--js ^
	"%TEXT_ENGINE%\common\downloaderfiles.js" ^
	"%TEXT_ENGINE%\..\FontEngine\font_engine.js" ^
	"%FONT_ENGINE%\FontFile.js" ^
	"%FONT_ENGINE%\FontManager.js" ^
	"%TEXT_ENGINE%\Drawing\Externals.js" ^
	"%TEXT_ENGINE%\Drawing\AllFonts.js" ^
	"%TEXT_ENGINE%\Drawing\GlobalLoaders.js" ^
	"%FONT_ENGINE%\FontExport.js" ^
	"%TEXT_ENGINE%\Drawing\Graphics.js" ^
	"%TEXT_ENGINE%\Drawing\Metafile.js" ^
	"%VIEW_ENGINE%\scripts\HtmlPage.js" ^
	"%VIEW_ENGINE%\scripts\DrawingDocument.js" ^
	"%VIEW_ENGINE%\scripts\documentrenderer.js" ^
	"%TEXT_ENGINE%\Drawing\GraphicsEvents.js" ^
	"%TEXT_ENGINE%\Drawing\Controls.js" ^
	"%TEXT_ENGINE%\Drawing\WorkEvents.js" ^
	"%MENU_ENGINE%\Statusbar.js" ^
	"%TEXT_ENGINE%\Drawing\scrolls\scroll.js" ^
	"%TEXT_ENGINE%\apiDefines.js" ^
	"%VIEW_ENGINE%\api.js" ^
	"apiViewerExport.js" ^
	"%VIEW_ENGINE%\loader.js" ^
	--js_output_file "%OUTPUT_SCRIPT_NAME%" ^
	--warning_level QUIET ^
	--variable_map_output_file "variable.map" ^
	--property_map_output_file "property.map"

	pause
@ECHO off