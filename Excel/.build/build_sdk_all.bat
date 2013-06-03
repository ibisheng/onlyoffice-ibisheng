@ECHO off

SET BUILD_DIR=%CD%
SET OUTPUT_DIR=%BUILD_DIR%
SET LOG_DIR=%BUILD_DIR%\Log

SET OUTPUT_SCRIPT_NAME=sdk-all.js
SET SOURCE_MAP_NAME=SourceMap.js

call check_google_cc.cmd
SET GOOGLE_CC_LEVEL=ADVANCED_OPTIMIZATIONS

if NOT "%1"=="" (
  SET OUTPUT_DIR=%~dp1
  SET OUTPUT_SCRIPT_NAME=%~nx1
)
if NOT "%2"=="" SET LOG_DIR=%~f2
if NOT "%3"=="" SET GOOGLE_CC_LEVEL=%3

cd ..

SET TABLE_ENGINE=.
SET FONT_ENGINE=../OfficeWebWord
SET COMMON_FOLDER=../OfficeWebCommon
SET CHARTS_ENGINE=%COMMON_FOLDER%/Charts/libraries


SET VARIABLE_MAP_FILE=%LOG_DIR%\variable.map
SET PROPERTY_MAP_FILE=%LOG_DIR%\property.map

SET SRC_FONT_ENGINE=^
 "%FONT_ENGINE%\FontsFreeType\font_engine.js" ^
 "%FONT_ENGINE%\FontsFreeType\FontFile.js" ^
 "%FONT_ENGINE%\FontsFreeType\FontManager.js" ^
 "%FONT_ENGINE%\WebWord\Drawing\Externals.js" ^
 "%FONT_ENGINE%\WebWord\Drawing\Metafile.js" ^
 "%FONT_ENGINE%\WebWord\Drawing\AllFonts.js" ^
 "%FONT_ENGINE%\WebWord\Drawing\GlobalLoaders.js" ^
 "%FONT_ENGINE%\FontsFreeType\FontExport.js"

SET EDITOR_APIDEFINE_FILE=%TABLE_ENGINE%\apiDefines.js
SET OUTPUT_APIDEFINE_FILE=%EDITOR_APIDEFINE_FILE%.tmp

SET SRC_TABLE_EGINE=^
 "%COMMON_FOLDER%\docscoapicommon.js" ^
 "%COMMON_FOLDER%\docscoapi.js" ^
 "%COMMON_FOLDER%\downloaderfiles.js" ^
 "%TABLE_ENGINE%\offlinedocs\test-workbook9\Editor.js" ^
 "%TABLE_ENGINE%\utils\utils.js" ^
 "%TABLE_ENGINE%\clipboard.js" ^
 "%TABLE_ENGINE%\charts.js" ^
 "%TABLE_ENGINE%\graphics\DrawingContext.js" ^
 "%TABLE_ENGINE%\graphics\pdfprinter.js" ^
 "%TABLE_ENGINE%\model\CollaborativeEditing.js" ^
 "%TABLE_ENGINE%\model\parserFormula.js" ^
 "%TABLE_ENGINE%\model\DrawingObjects.js" ^
 "%TABLE_ENGINE%\model\NumFormat.js" ^
 "%TABLE_ENGINE%\model\Serialize.js" ^
 "%TABLE_ENGINE%\model\WorkbookElems.js" ^
 "%TABLE_ENGINE%\model\Workbook.js" ^
 "%TABLE_ENGINE%\model\CellInfo.js" ^
 "%TABLE_ENGINE%\model\AdvancedOptions.js" ^
 "%TABLE_ENGINE%\model\History.js" ^
 "%TABLE_ENGINE%\view\StringRender.js" ^
 "%TABLE_ENGINE%\view\CellTextRender.js" ^
 "%TABLE_ENGINE%\view\CellEditorView.js" ^
 "%TABLE_ENGINE%\view\WorksheetView.js" ^
 "%TABLE_ENGINE%\view\HandlerList.js" ^
 "%TABLE_ENGINE%\view\EventsController.js" ^
 "%TABLE_ENGINE%\view\WorkbookView.js" ^
 "%TABLE_ENGINE%\view\scroll.js" ^
 "%EDITOR_APIDEFINE_FILE%" ^
 "%TABLE_ENGINE%\api.js"

 SET SRC_CHARTS_EGINE=^
 "%CHARTS_ENGINE%\OfficeExcel.common.core.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.common.annotate.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.common.context.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.common.effects.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.common.key.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.common.resizing.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.common.tooltips.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.common.zoom.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.bar.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.bipolar.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.gantt.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.hbar.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.line.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.pie.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.radar.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.rose.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.rscatter.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.scatter.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.waterfall.js" ^
 "%CHARTS_ENGINE%\OfficeExcel.chartProperties.js" ^
 "%CHARTS_ENGINE%\hsv.js" ^
 "%CHARTS_ENGINE%\rgbcolor.js"
 
SET SRC_FILE="%COMMON_FOLDER%\License.js" %SRC_FONT_ENGINE% %SRC_TABLE_EGINE% %SRC_CHARTS_EGINE%

ECHO ON


rem --formatting PRETTY_PRINT ^

java %GOOGLE_CC% ^
 --version ^
 --warning_level QUIET ^
 --compilation_level %GOOGLE_CC_LEVEL% ^
 --externs "%TABLE_ENGINE%\jquery\jquery-1.7.1.js" ^
 --externs "%TABLE_ENGINE%\jquery\jquery.mousewheel-3.0.6.js" ^
 --externs "%COMMON_FOLDER%\3rdparty\XRegExp\xregexp-all-min.js" ^
 --js %SRC_FILE% ^
 --js_output_file "%OUTPUT_SCRIPT_NAME%" ^
 --variable_map_output_file "%VARIABLE_MAP_FILE%" ^
 --property_map_output_file "%PROPERTY_MAP_FILE%" ^
 --create_source_map "%OUTPUT_SCRIPT_NAME%.map" ^
 --source_map_format=V3

@if NOT "%ERRORLEVEL%"=="0" goto error

java %GOOGLE_CC% ^
 --compilation_level SIMPLE_OPTIMIZATIONS ^
 --js "%EDITOR_APIDEFINE_FILE%" ^
 --js_output_file "%OUTPUT_APIDEFINE_FILE%"

@if NOT "%ERRORLEVEL%"=="0" goto error

ECHO //@ sourceMappingURL=http://localhost:8080/sdk/OfficeWebExcel/%OUTPUT_SCRIPT_NAME%.map>"%SOURCE_MAP_NAME%"

COPY /Y /B "%OUTPUT_SCRIPT_NAME%"+"%OUTPUT_APIDEFINE_FILE%"+"%SOURCE_MAP_NAME%" "%OUTPUT_SCRIPT_NAME%"
MOVE /Y "%OUTPUT_SCRIPT_NAME%" "%OUTPUT_DIR%"
COPY /Y "%OUTPUT_SCRIPT_NAME%.map" "%OUTPUT_DIR%"
DEL /Q "%OUTPUT_APIDEFINE_FILE%"
DEL /Q "%SOURCE_MAP_NAME%"

@ECHO off

cd "%BUILD_DIR%"
exit /b 0


:error
@exit /b 1
