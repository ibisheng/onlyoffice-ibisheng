/*
 * (c) Copyright Ascensio System SIA 2010-2016
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {

// Import
var c_oAscCellAnchorType = AscCommon.c_oAscCellAnchorType;
var c_oAscLockTypes = AscCommon.c_oAscLockTypes;
var parserHelp = AscCommon.parserHelp;
var gc_nMaxRow = AscCommon.gc_nMaxRow;
var gc_nMaxCol = AscCommon.gc_nMaxCol;
    var History = AscCommon.History;

var BBoxInfo = AscFormat.BBoxInfo;
var MOVE_DELTA = AscFormat.MOVE_DELTA;

var c_oAscError = Asc.c_oAscError;
var c_oAscChartTypeSettings = Asc.c_oAscChartTypeSettings;
var c_oAscChartTitleShowSettings = Asc.c_oAscChartTitleShowSettings;
var c_oAscGridLinesSettings = Asc.c_oAscGridLinesSettings;
var c_oAscValAxisRule = Asc.c_oAscValAxisRule;
var c_oAscInsertOptions = Asc.c_oAscInsertOptions;
var c_oAscDeleteOptions = Asc.c_oAscDeleteOptions;
var c_oAscSelectionType = Asc.c_oAscSelectionType;

var aSparklinesStyles =
[
    [
        [4, -0.499984740745262],
        [5, 0],
        [4, -0.499984740745262],
        [4,  0.39997558519241921],
        [4, 0.39997558519241921],
        [4, 0],
        [4, 0]
    ],
    [
        [5, -0.499984740745262],
        [6, 0],
        [5,  -0.499984740745262],
        [5, 0.39997558519241921],
        [5, 0.39997558519241921],
        [5, 0],
        [5, 0]
    ],
    [
        [6, -0.499984740745262],
        [7, 0],
        [6, -0.499984740745262],
        [6, 0.39997558519241921],
        [6, 0.39997558519241921],
        [6, 0],
        [6, 0]
    ],
    [
        [7, -0.499984740745262],
        [8, 0],
        [7, -0.499984740745262],
        [7, 0.39997558519241921],
        [7, 0.39997558519241921],
        [7, 0],
        [7, 0]
    ],
    [
        [8, -0.499984740745262],
        [9, 0],
        [8, -0.499984740745262],
        [8, 0.39997558519241921],
        [8, 0.39997558519241921],
        [8, 0],
        [8, 0]
    ],
    [
        [9, -0.499984740745262],
        [4, 0],

        [9, -0.499984740745262],
        [9, 0.39997558519241921],
        [9, 0.39997558519241921],
        [9, 0],
        [9, 0]
    ],
    [
        [4, -0.249977111117893],
        [5, 0],
        [5, -0.249977111117893],
        [5, -0.249977111117893],
        [5, -0.249977111117893],
        [5, -0.249977111117893],
        [5, -0.249977111117893]
    ],
    [
        [5, -0.249977111117893],
        [6, 0],
        [6, -0.249977111117893],
        [6, -0.249977111117893],
        [6, -0.249977111117893],
        [6, -0.249977111117893],
        [6, -0.249977111117893]
    ],
    [
        [6, -0.249977111117893],
        [7, 0],
        [7, -0.249977111117893],
        [7, -0.249977111117893],
        [7, -0.249977111117893],
        [7, -0.249977111117893],
        [7, -0.249977111117893]
    ],
    [
        [7, -0.249977111117893],
        [8, 0],
        [8, -0.249977111117893],
        [8, -0.249977111117893],
        [8, -0.249977111117893],
        [8, -0.249977111117893],
        [8, -0.249977111117893]
    ],
    [
        [8, -0.249977111117893],
        [9, 0],
        [9, -0.249977111117893],
        [9, -0.249977111117893],
        [9, -0.249977111117893],
        [9, -0.249977111117893],
        [9, -0.249977111117893]
    ],
    [
        [9, -0.249977111117893],
        [4, 0],
        [4, -0.249977111117893],
        [4, -0.249977111117893],
        [4, -0.249977111117893],
        [4, -0.249977111117893],
        [4, -0.249977111117893]
    ],
    [
        [4, 0],
        [5, 0],
        [4, -0.249977111117893],
        [4, -0.249977111117893],
        [4, -0.249977111117893],
        [4, -0.249977111117893],
        [4, -0.249977111117893]
    ],
    [
        [5, 0],
        [6, 0],
        [5, -0.249977111117893],
        [5, -0.249977111117893],
        [5, -0.249977111117893],
        [5, -0.249977111117893],
        [5, -0.249977111117893]
    ],
    [
        [6, 0],
        [7, 0],
        [6, -0.249977111117893],
        [6, -0.249977111117893],
        [6, -0.249977111117893],
        [6, -0.249977111117893],
        [6, -0.249977111117893]
    ],
    [
        [7, 0],
        [8, 0],
        [7, -0.249977111117893],
        [7, -0.249977111117893],
        [7, -0.249977111117893],
        [7, -0.249977111117893],
        [7, -0.249977111117893]
    ],
    [
        [8, 0],
        [9, 0],
        [8, -0.249977111117893],
        [8, -0.249977111117893],
        [8, -0.249977111117893],
        [8, -0.249977111117893],
        [8, -0.249977111117893]
    ],
    [
        [9, 0],
        [4, 0],
        [9, -0.249977111117893],
        [9, -0.249977111117893],
        [9, -0.249977111117893],
        [9, -0.249977111117893],
        [9, -0.249977111117893]
    ],
    [
        [4, 0.39997558519241921],
        [0, -0.499984740745262],
        [4, 0.79998168889431442],
        [4, -0.249977111117893],
        [4, -0.249977111117893],
        [4, -0.499984740745262],
        [4, -0.499984740745262]
    ],
    [
        [5, 0.39997558519241921],
        [0, -0.499984740745262],
        [5, 0.79998168889431442],
        [5, -0.249977111117893],
        [5, -0.249977111117893],
        [5, -0.499984740745262],
        [5, -0.499984740745262]
    ],
    [
        [6, 0.39997558519241921],
        [0, -0.499984740745262],
        [6, 0.79998168889431442],
        [6, -0.249977111117893],
        [6, -0.249977111117893],
        [6, -0.499984740745262],
        [6, -0.499984740745262]
    ],
    [
        [7, 0.39997558519241921],
        [0, -0.499984740745262],
        [7, 0.79998168889431442],
        [7, -0.249977111117893],
        [7, -0.249977111117893],
        [7, -0.499984740745262],
        [7, -0.499984740745262]
    ],
    [
        [8, 0.39997558519241921],
        [0, -0.499984740745262],
        [8, 0.79998168889431442],
        [8, -0.249977111117893],
        [8, -0.249977111117893],
        [8, -0.499984740745262],
        [8, -0.499984740745262]
    ],
    [
        [9, 0.39997558519241921],
        [0, -0.499984740745262],
        [9, 0.79998168889431442],
        [9, -0.249977111117893],
        [9, -0.249977111117893],
        [9, -0.499984740745262],
        [9, -0.499984740745262]
    ],
    [
        [1, 0.499984740745262],
        [1, 0.249977111117893],
        [1, 0.249977111117893],
        [1, 0.249977111117893],
        [1, 0.249977111117893],
        [1, 0.249977111117893],
        [1, 0.249977111117893]
    ],
    [
        [1, 0.34998626667073579],
        [0, -0.249977111117893],
        [0, -0.249977111117893],
        [0, -0.249977111117893],
        [0, -0.249977111117893],
        [0, -0.249977111117893],
        [0, -0.249977111117893]
    ],
    [
        [0xFF323232],
        [0xFFD00000],
        [0xFFD00000],
        [0xFFD00000],
        [0xFFD00000],
        [0xFFD00000],
        [0xFFD00000]
    ],
    [
        [0xFF000000],
        [0xFF0070C0],
        [0xFF0070C0],
        [0xFF0070C0],
        [0xFF0070C0],
        [0xFF0070C0],
        [0xFF0070C0]
    ],
    [
        [0xFF376092],
        [0xFFD00000],
        [0xFFD00000],
        [0xFFD00000],
        [0xFFD00000],
        [0xFFD00000],
        [0xFFD00000]
    ],
    [
        [0xFF0070C0],
        [0xFF000000],
        [0xFF000000],
        [0xFF000000],
        [0xFF000000],
        [0xFF000000],
        [0xFF000000]
    ],
    [
        [0xFF5F5F5F],
        [0xFFFFB620],
        [0xFFD70077],
        [0xFF5687C2],
        [0xFF359CEB],
        [0xFF56BE79],
        [0xFFFF5055]
    ],
    [
        [0xFF5687C2],
        [0xFFFFB620],
        [0xFFD70077],
        [0xFF777777],
        [0xFF359CEB],
        [0xFF56BE79],
        [0xFFFF5055]
    ],
    [
        [0xFFC6EFCE],
        [0xFFFFC7CE],
        [0xFF8CADD6],
        [0xFFFFDC47],
        [0xFFFFEB9C],
        [0xFF60D276],
        [0xFFFF5367]
    ],
    [
        [0xFF00B050],
        [0xFFFF0000],
        [0xFF0070C0],
        [0xFFFFC000],
        [0xFFFFC000],
        [0xFF00B050],
        [0xFFFF0000]
    ],
    [
        [3, 0],
        [9, 0],
        [8, 0],
        [4, 0],
        [5, 0],
        [6, 0],
        [7, 0]
    ],
    [
        [1, 0],
        [9, 0],
        [8, 0],
        [4, 0],
        [5, 0],
        [6, 0],
        [7, 0]
    ]
];

function isObject(what) {
    return ( (what != null) && (typeof(what) == "object") );
}

function DrawingBounds(minX, maxX, minY, maxY)
{
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
}

function getCurrentTime() {
    var currDate = new Date();
    return currDate.getTime();
}

function roundPlus(x, n) { //x - число, n - количество знаков 
    if ( isNaN(x) || isNaN(n) ) return false;
    var m = Math.pow(10,n);
    return Math.round(x * m) / m;
}

// Класс для информации о ячейке для объектов ToDo возможно стоит поправить
function CCellObjectInfo () {
	this.col = 0;
	this.row = 0;
	this.colOff = 0;
	this.rowOff = 0;
	this.colOffPx = 0;
	this.rowOffPx = 0;
}

/** @constructor */
function asc_CChartStyle() {
    this.style = null;
    this.imageUrl = null;
}

asc_CChartStyle.prototype = {
    asc_getStyle: function() { return this.style; },
    asc_setStyle: function(style) { this.style = style; },

    asc_getImageUrl: function() { return this.imageUrl; },
    asc_setImageUrl: function(imageUrl) { this.imageUrl = imageUrl; }
};

/** @constructor */
function asc_CChartBinary(chart) {

    this["binary"] = null;
    if (chart && chart.getObjectType() === AscDFH.historyitem_type_ChartSpace)
    {
        var writer = new AscCommon.BinaryChartWriter(new AscCommon.CMemory(false)), pptx_writer;
        writer.WriteCT_ChartSpace(chart);
        this["binary"] = writer.memory.pos + ";" + writer.memory.GetBase64Memory();
        if(chart.theme)
        {
            pptx_writer = new AscCommon.CBinaryFileWriter();
            pptx_writer.WriteTheme(chart.theme);
            this["themeBinary"] = pptx_writer.pos + ";" + pptx_writer.GetBase64Memory();
        }
        if(chart.colorMapOverride)
        {
            pptx_writer = new AscCommon.CBinaryFileWriter();
            pptx_writer.WriteRecord1(1, chart.colorMapOverride, pptx_writer.WriteClrMap);
            this["colorMapBinary"] = pptx_writer.pos + ";" + pptx_writer.GetBase64Memory();
        }
        this["urls"] = JSON.stringify(AscCommon.g_oDocumentUrls.getUrls());
    }
}

asc_CChartBinary.prototype = {

    asc_getBinary: function() { return this["binary"]; },
    asc_setBinary: function(val) { this["binary"] = val; },
    asc_getThemeBinary: function() { return this["themeBinary"]; },
    asc_setThemeBinary: function(val) { this["themeBinary"] = val; },
    asc_setColorMapBinary: function(val){this["colorMapBinary"] = val;},
    asc_getColorMapBinary: function(){return this["colorMapBinary"];},
    getChartSpace: function(workSheet)
    {
        var binary = this["binary"];
        var stream = AscFormat.CreateBinaryReader(this["binary"], 0, this["binary"].length);
        //надо сбросить то, что остался после открытия документа
        AscCommon.pptx_content_loader.Clear();
        var oNewChartSpace = new AscFormat.CChartSpace();
        var oBinaryChartReader = new AscCommon.BinaryChartReader(stream);
        oBinaryChartReader.ExternalReadCT_ChartSpace(stream.size , oNewChartSpace, workSheet);
        return oNewChartSpace;
    },

    getTheme: function()
    {
        var binary = this["themeBinary"];
        if(binary)
        {
            var stream = AscFormat.CreateBinaryReader(binary, 0, binary.length);
            var oBinaryReader = new AscCommon.BinaryPPTYLoader();

            oBinaryReader.stream = new AscCommon.FileStream();
            oBinaryReader.stream.obj    = stream.obj;
            oBinaryReader.stream.data   = stream.data;
            oBinaryReader.stream.size   = stream.size;
            oBinaryReader.stream.pos    = stream.pos;
            oBinaryReader.stream.cur    = stream.cur;
            return oBinaryReader.ReadTheme();
        }
        return null;
    },

    getColorMap: function()
    {
        var binary = this["colorMapBinary"];
        if(binary)
        {
            var stream = AscFormat.CreateBinaryReader(binary, 0, binary.length);
            var oBinaryReader = new AscCommon.BinaryPPTYLoader();

            oBinaryReader.stream = new AscCommon.FileStream();
            oBinaryReader.stream.obj    = stream.obj;
            oBinaryReader.stream.data   = stream.data;
            oBinaryReader.stream.size   = stream.size;
            oBinaryReader.stream.pos    = stream.pos;
            oBinaryReader.stream.cur    = stream.cur;
            var _rec = oBinaryReader.stream.GetUChar();
            var ret = new AscFormat.ClrMap();
            oBinaryReader.ReadClrMap(ret);
            return ret;
        }
        return null;
    }

};

/** @constructor */
function asc_CChartSeria() {
    this.Val = { Formula: "", NumCache: [] };
    this.xVal = { Formula: "", NumCache: [] };
    this.Cat = { Formula: "", NumCache: [] };
    this.TxCache = { Formula: "", Tx: "" };
    this.Marker = { Size: 0, Symbol: "" };
    this.FormatCode = "";
    this.isHidden = false;
}

asc_CChartSeria.prototype = {

    asc_getValFormula: function() { return this.Val.Formula; },
    asc_setValFormula: function(formula) { this.Val.Formula = formula; },

    asc_getxValFormula: function() { return this.xVal.Formula; },
    asc_setxValFormula: function(formula) { this.xVal.Formula = formula; },

    asc_getCatFormula: function() { return this.Cat.Formula; },
    asc_setCatFormula: function(formula) { this.Cat.Formula = formula; },

    asc_getTitle: function() { return this.TxCache.Tx; },
    asc_setTitle: function(title) { this.TxCache.Tx = title; },

    asc_getTitleFormula: function() { return this.TxCache.Formula; },
    asc_setTitleFormula: function(val) { this.TxCache.Formula = val; },

    asc_getMarkerSize: function() { return this.Marker.Size; },
    asc_setMarkerSize: function(size) { this.Marker.Size = size; },

    asc_getMarkerSymbol: function() { return this.Marker.Symbol; },
    asc_setMarkerSymbol: function(symbol) { this.Marker.Symbol = symbol; },

    asc_getFormatCode: function() { return this.FormatCode; },
    asc_setFormatCode: function(format) { this.FormatCode = format; }
};

var nSparklineMultiplier = 3.75;

function CSparklineView()
{
    this.col = null;
    this.row = null;
    this.ws = null;
    this.extX = null;
    this.extY = null;
    this.chartSpace = null;
}

function CreateSparklineMarker(oUniFill)
{
    var oMarker = new AscFormat.CMarker();
    oMarker.symbol = AscFormat.SYMBOL_DIAMOND;
    oMarker.size = 10;
    oMarker.spPr = new AscFormat.CSpPr();
    oMarker.spPr.Fill = oUniFill;
    oMarker.spPr.ln = AscFormat.CreateNoFillLine();
    return oMarker;
}

function CreateUniFillFromExcelColor(oExcelColor)
{
    var oUnifill;
    if(oExcelColor instanceof AscCommonExcel.ThemeColor)
    {

        oUnifill = AscFormat.CreateUnifillSolidFillSchemeColorByIndex(AscCommonExcel.map_themeExcel_to_themePresentation[oExcelColor.theme]);
        if(oExcelColor.tint != null)
        {
            var unicolor = oUnifill.fill.color;
            if(!unicolor.Mods)
                unicolor.setMods(new AscFormat.CColorModifiers());
            var mod = new AscFormat.CColorMod();
            if(oExcelColor.tint > 0)
            {
                mod.setName("wordTint");
                mod.setVal(Math.round(oExcelColor.tint*255));
            }
            else
            {
                mod.setName("wordShade");
                mod.setVal(Math.round(255 + oExcelColor.tint*255));
            }
            unicolor.Mods.addMod(mod);
        }

        //oUnifill = AscFormat.CreateUniFillSchemeColorWidthTint(map_themeExcel_to_themePresentation[oExcelColor.theme], oExcelColor.tint != null ? oExcelColor.tint : 0);
    }
    else
    {
        oUnifill = AscFormat.CreateUnfilFromRGB(oExcelColor.getR(), oExcelColor.getG(), oExcelColor.getB())
    }
    return oUnifill;
}

CSparklineView.prototype.initFromSparkline = function(oSparkline, oSparklineGroup, worksheetView, bNoLine)
{
    AscFormat.ExecuteNoHistory(function(){
        this.ws = worksheetView;
        var settings = new AscCommon.asc_ChartSettings();
        switch(oSparklineGroup.type)
        {
            case Asc.c_oAscSparklineType.Column:
            {
                settings.type = c_oAscChartTypeSettings.barNormal;
                break;
            }
            case Asc.c_oAscSparklineType.Stacked:
            {
                settings.type = c_oAscChartTypeSettings.barStackedPer;
                break;
            }
            default:
            {
                settings.type = c_oAscChartTypeSettings.lineNormal;
                break;
            }
        }
        var ser = new asc_CChartSeria();
        ser.Val.Formula = oSparkline.f;
        if(oSparkline.oCache){
            ser.Val.NumCache = oSparkline.oCache;
        }
        var chartSeries = {series: [ser], parsedHeaders: {bLeft: false, bTop: false}};
        var chart_space = AscFormat.DrawingObjectsController.prototype._getChartSpace(chartSeries, settings, true);
        chart_space.setBDeleted(false);
        if(worksheetView){
            chart_space.setWorksheet(worksheetView.model);
        }


        chart_space.displayHidden = oSparklineGroup.displayHidden;
        chart_space.displayEmptyCellsAs = oSparklineGroup.displayEmptyCellsAs;


        if(AscFormat.isRealNumber(oSparklineGroup.displayEmptyCellsAs))
        {
            switch(oSparklineGroup.displayEmptyCellsAs)
            {
                case Asc.c_oAscEDispBlanksAs.Span:
                {
                    chart_space.displayEmptyCellsAs = 0;
                    break;
                }
                case Asc.c_oAscEDispBlanksAs.Gap:
                {
                    chart_space.displayEmptyCellsAs = 1;
                    break;
                }
                case Asc.c_oAscEDispBlanksAs.Zero:
                {
                    chart_space.displayEmptyCellsAs = 2;
                    break;
                }
            }
        }
        chart_space.displayHidden = oSparklineGroup.displayHidden;
        settings.putTitle(c_oAscChartTitleShowSettings.none);
        settings.putHorAxisLabel(c_oAscChartTitleShowSettings.none);
        settings.putVertAxisLabel(c_oAscChartTitleShowSettings.none);
        settings.putLegendPos(Asc.c_oAscChartLegendShowSettings.none);
        settings.putHorGridLines(c_oAscGridLinesSettings.none);
        settings.putVertGridLines(c_oAscGridLinesSettings.none);

        var val_ax_props = new AscCommon.asc_ValAxisSettings();
        if(settings.type !== c_oAscChartTypeSettings.barStackedPer)
        {
            if(oSparklineGroup.minAxisType === Asc.c_oAscSparklineAxisMinMax.Custom && oSparklineGroup.manualMin !== null)
            {
                val_ax_props.putMinValRule(c_oAscValAxisRule.fixed);
                val_ax_props.putMinVal(oSparklineGroup.manualMin);
            }
            else
            {
                val_ax_props.putMinValRule(c_oAscValAxisRule.auto);
            }
            if(oSparklineGroup.maxAxisType === Asc.c_oAscSparklineAxisMinMax.Custom && oSparklineGroup.manualMax !== null)
            {
                val_ax_props.putMinValRule(c_oAscValAxisRule.fixed);
                val_ax_props.putMinVal(oSparklineGroup.manualMax);
            }
            else
            {
                val_ax_props.putMaxValRule(c_oAscValAxisRule.auto);
            }
        }
        else
        {
            val_ax_props.putMinValRule(c_oAscValAxisRule.fixed);
            val_ax_props.putMinVal(-1);

            val_ax_props.putMaxValRule(c_oAscValAxisRule.fixed);
            val_ax_props.putMaxVal(1);
        }



        val_ax_props.putTickLabelsPos(Asc.c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE);
        val_ax_props.putInvertValOrder(false);
        val_ax_props.putDispUnitsRule(Asc.c_oAscValAxUnits.none);
        val_ax_props.putMajorTickMark(Asc.c_oAscTickMark.TICK_MARK_NONE);
        val_ax_props.putMinorTickMark(Asc.c_oAscTickMark.TICK_MARK_NONE);
        val_ax_props.putCrossesRule(Asc.c_oAscCrossesRule.auto);



        var cat_ax_props = new AscCommon.asc_CatAxisSettings();
        cat_ax_props.putIntervalBetweenLabelsRule(Asc.c_oAscBetweenLabelsRule.auto);
        cat_ax_props.putLabelsPosition(Asc.c_oAscLabelsPosition.betweenDivisions);
        cat_ax_props.putTickLabelsPos(Asc.c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE);
        cat_ax_props.putLabelsAxisDistance(100);
        cat_ax_props.putMajorTickMark(Asc.c_oAscTickMark.TICK_MARK_NONE);
        cat_ax_props.putMinorTickMark(Asc.c_oAscTickMark.TICK_MARK_NONE);
        cat_ax_props.putIntervalBetweenTick(1);
        cat_ax_props.putCrossesRule(Asc.c_oAscCrossesRule.auto);
        if(oSparklineGroup.rightToLeft)
        {
            cat_ax_props.putInvertCatOrder(true);
        }
        settings.putVertAxisProps(val_ax_props);
        settings.putHorAxisProps(cat_ax_props);

        AscFormat.DrawingObjectsController.prototype.applyPropsToChartSpace(settings, chart_space);
        var i;
        if(!chart_space.spPr)
            chart_space.setSpPr(new AscFormat.CSpPr());

        var new_line = new AscFormat.CLn();
        new_line.setFill(AscFormat.CreateNoFillUniFill());
        chart_space.spPr.setLn(new_line);
        chart_space.spPr.setFill(AscFormat.CreateNoFillUniFill());
        var dLineWidthSpaces = 500;
        if(!chart_space.chart.plotArea.spPr)
        {
            chart_space.chart.plotArea.setSpPr(new AscFormat.CSpPr());
            chart_space.chart.plotArea.spPr.setFill(AscFormat.CreateNoFillUniFill());
        }
        var oAxis = chart_space.chart.plotArea.getAxisByTypes();
        oAxis.valAx[0].setDelete(true);

        var oSerie = chart_space.chart.plotArea.charts[0].series[0];
        if(!oSerie.spPr)
        {
            oSerie.setSpPr(new AscFormat.CSpPr());
        }
        chart_space.recalculateReferences();
        chart_space.recalcInfo.recalculateReferences = false;
        var fCallbackSeries = null;
        if(oSparklineGroup.type === Asc.c_oAscSparklineType.Line)
        {
            var oLn = new AscFormat.CLn();
            oLn.setW(36000*nSparklineMultiplier*25.4*(oSparklineGroup.lineWidth != null ? oSparklineGroup.lineWidth : 0.75)/72);
            oSerie.spPr.setLn(oLn);
            if(oSparklineGroup.markers && oSparklineGroup.colorMarkers)
            {
                oSerie.marker = CreateSparklineMarker(CreateUniFillFromExcelColor(oSparklineGroup.colorMarkers));
            }

            fCallbackSeries = function(oSeries, nIdx, oExcelColor)
            {
                for(var t = 0; t < oSeries.dPt.length; ++t)
                {
                    if(oSeries.dPt[t].idx === nIdx)
                    {
                        if(oSeries.dPt[t].marker && oSeries.dPt[t].marker.spPr)
                        {
                            oSeries.dPt[t].marker.spPr.Fill = CreateUniFillFromExcelColor(oExcelColor);
                        }
                        return;
                    }
                }
                var oDPt = new AscFormat.CDPt();
                oDPt.idx = nIdx;
                oDPt.marker = CreateSparklineMarker(CreateUniFillFromExcelColor(oExcelColor));
                oSeries.addDPt(oDPt);
            }
        }
        else
        {
            chart_space.chart.plotArea.charts[0].setGapWidth(30);
            chart_space.chart.plotArea.charts[0].setOverlap(50);
            fCallbackSeries = function(oSeries, nIdx, oExcelColor)
            {
                for(var t = 0; t < oSeries.dPt.length; ++t)
                {
                    if(oSeries.dPt[t].idx === nIdx)
                    {
                        if(oSeries.dPt[t].spPr)
                        {
                            if(oExcelColor && !(bNoLine === true)){
                                oSeries.dPt[t].spPr.Fill = CreateUniFillFromExcelColor(oExcelColor);
                                oSeries.dPt[t].spPr.ln = new AscFormat.CLn();
                                oSeries.dPt[t].spPr.ln.Fill = oSeries.dPt[t].spPr.Fill.createDuplicate();
                                oSeries.dPt[t].spPr.ln.w = dLineWidthSpaces;
                            }
                            else{
                                oSeries.dPt[t].spPr.Fill = AscFormat.CreateNoFillUniFill();
                                oSeries.dPt[t].spPr.ln = AscFormat.CreateNoFillLine();
                            }
                        }
                        return;
                    }
                }

                var oDPt = new AscFormat.CDPt();
                oDPt.idx = nIdx;
                oDPt.spPr = new AscFormat.CSpPr();
                if(oExcelColor && !(bNoLine === true)) {
                    oDPt.spPr.Fill = CreateUniFillFromExcelColor(oExcelColor);
                    oDPt.spPr.ln = new AscFormat.CLn();
                    oDPt.spPr.ln.Fill = oDPt.spPr.Fill.createDuplicate();
                    oDPt.spPr.ln.w = dLineWidthSpaces;
                }
                else{
                    oDPt.spPr.Fill = AscFormat.CreateNoFillUniFill();
                    oDPt.spPr.ln = AscFormat.CreateNoFillLine();
                }
                oSeries.addDPt(oDPt);
            }
        }
        var aSeriesPoints = AscFormat.getPtsFromSeries(oSerie);
        var aMaxPoints = null, aMinPoints = null;
        if(aSeriesPoints.length > 0)
        {
            if(fCallbackSeries)
            {

                if(oSparklineGroup.type !== Asc.c_oAscSparklineType.Line){
                    for(i = 0; i < aSeriesPoints.length; ++i)
                    {
                        if(AscFormat.fApproxEqual(aSeriesPoints[i].val,  0))
                        {
                            fCallbackSeries(oSerie, aSeriesPoints[i].idx, null);
                        }
                    }
                }

                if(oSparklineGroup.negative && oSparklineGroup.colorNegative)
                {
                    for(i = 0; i < aSeriesPoints.length; ++i)
                    {
                        if(aSeriesPoints[i].val < 0)
                        {
                            fCallbackSeries(oSerie, aSeriesPoints[i].idx, oSparklineGroup.colorNegative);
                        }
                    }
                }
                if(oSparklineGroup.last && oSparklineGroup.colorLast)
                {
                    fCallbackSeries(oSerie, aSeriesPoints[aSeriesPoints.length - 1].idx, oSparklineGroup.colorLast);
                }
                if(oSparklineGroup.first && oSparklineGroup.colorFirst)
                {
                    fCallbackSeries(oSerie, aSeriesPoints[0].idx, oSparklineGroup.colorFirst);
                }
                if(oSparklineGroup.high && oSparklineGroup.colorHigh)
                {
                    aMaxPoints = [aSeriesPoints[0]];
                    for(i = 1; i < aSeriesPoints.length; ++i)
                    {
                        if(aSeriesPoints[i].val > aMaxPoints[0].val)
                        {
                            aMaxPoints.length = 0;
                            aMaxPoints.push(aSeriesPoints[i]);
                        }
                        else if(aSeriesPoints[i].val === aMaxPoints[0].val)
                        {
                            aMaxPoints.push(aSeriesPoints[i]);
                        }
                    }
                    for(i = 0; i < aMaxPoints.length; ++i)
                    {
                        fCallbackSeries(oSerie, aMaxPoints[i].idx, oSparklineGroup.colorHigh);
                    }
                }
                if(oSparklineGroup.low && oSparklineGroup.colorLow)
                {
                    aMinPoints = [aSeriesPoints[0]];
                    for(i = 1; i < aSeriesPoints.length; ++i)
                    {
                        if(aSeriesPoints[i].val < aMinPoints[0].val)
                        {
                            aMinPoints.length = 0;
                            aMinPoints.push(aSeriesPoints[i]);
                        }
                        else if(aSeriesPoints[i].val === aMinPoints[0].val)
                        {
                            aMinPoints.push(aSeriesPoints[i]);
                        }
                    }
                    for(i = 0; i < aMinPoints.length; ++i)
                    {
                        fCallbackSeries(oSerie, aMinPoints[i].idx, oSparklineGroup.colorLow);
                    }
                }
            }
        }


        if(!oSparklineGroup.displayXAxis)
        {
            oAxis.catAx[0].setDelete(true);
        }
        else if(aSeriesPoints.length > 1)
        {
            aSeriesPoints = [].concat(aSeriesPoints);
            var dMinVal, dMaxVal, bSorted = false;
            if(val_ax_props.minVal == null)
            {
                if(aMinPoints)
                {
                    dMinVal = aMinPoints[0].val;
                }
                else
                {

                    aSeriesPoints.sort(function(a, b){return a.val - b.val;});
                    bSorted = true;
                    dMinVal = aSeriesPoints[0].val;
                }
            }
            else
            {
                dMinVal = val_ax_props.minVal;
            }

            if(val_ax_props.maxVal == null)
            {
                if(aMaxPoints)
                {
                    dMaxVal = aMaxPoints[0].val;
                }
                else
                {
                    if(!bSorted)
                    {
                        aSeriesPoints.sort(function(a, b){return a.val - b.val;});
                        bSorted = true;
                    }
                    dMaxVal = aSeriesPoints[aSeriesPoints.length - 1].val;
                }
            }
            else
            {
                dMaxVal = val_ax_props.maxVal;
            }
            if(dMaxVal < 0 || dMinVal > 0)
            {
                oAxis.catAx[0].setDelete(true);
            }
        }
        if(oSparklineGroup.colorSeries)
        {
            var oUnifill = CreateUniFillFromExcelColor(oSparklineGroup.colorSeries);
            var oSerie = chart_space.chart.plotArea.charts[0].series[0];
            if(oSparklineGroup.type === Asc.c_oAscSparklineType.Line)
            {
                var oLn = oSerie.spPr.ln;
                oLn.setFill(oUnifill);
                oSerie.spPr.setLn(oLn);
            }
            else
            {
                if(!(bNoLine === true))
                {
                    oSerie.spPr.setFill(oUnifill);
                    oSerie.spPr.ln = new AscFormat.CLn();
                    oSerie.spPr.ln.Fill = oSerie.spPr.Fill.createDuplicate();
                    oSerie.spPr.ln.w = dLineWidthSpaces;
                }
            }
        }

        this.chartSpace = chart_space;
        if(worksheetView){

            var oBBox = oSparkline.sqref;
            this.col = oBBox.c1;
            this.row = oBBox.r1;
            this.x = worksheetView.getCellLeft(oBBox.c1, 3);
            this.y = worksheetView.getCellTop(oBBox.r1, 3);
            this.extX = worksheetView.getColumnWidth(oBBox.c1, 3);
            this.extY = worksheetView.getRowHeight(oBBox.r1, 3);
            AscFormat.CheckSpPrXfrm(this.chartSpace);
            this.chartSpace.spPr.xfrm.setOffX(this.x*nSparklineMultiplier);
            this.chartSpace.spPr.xfrm.setOffY(this.y*nSparklineMultiplier);
            this.chartSpace.spPr.xfrm.setExtX(this.extX*nSparklineMultiplier);
            this.chartSpace.spPr.xfrm.setExtY(this.extY*nSparklineMultiplier);
            this.chartSpace.recalculate();
        }
    }, this, []);
};

CSparklineView.prototype.draw = function(graphics, offX, offY)
{
    var x = this.ws.getCellLeft(this.col, 3) - offX;
    var y = this.ws.getCellTop(this.row, 3) - offY;
    var extX = this.ws.getColumnWidth(this.col, 3);
    var extY = this.ws.getRowHeight(this.row, 3);

    var bExtent = Math.abs(this.extX - extX) > 0.01 || Math.abs(this.extY - extY) > 0.01;
    var bPosition = Math.abs(this.x - x) > 0.01 || Math.abs(this.y - y) > 0.01;
    if(bExtent || bPosition)
    {
        AscFormat.ExecuteNoHistory(function(){
            if(bPosition)
            {
                this.chartSpace.spPr.xfrm.setOffX(x*nSparklineMultiplier);
                this.chartSpace.spPr.xfrm.setOffY(y*nSparklineMultiplier);
            }
            if(bExtent)
            {
                this.chartSpace.spPr.xfrm.setExtX(extX*nSparklineMultiplier);
                this.chartSpace.spPr.xfrm.setExtY(extY*nSparklineMultiplier);
            }
        }, this, []);
        this.x = x;
        this.y = y;
        this.extX = extX;
        this.extY = extY;
        if(bExtent)
        {
            this.chartSpace.handleUpdateExtents();
            this.chartSpace.recalculate();
        }
        else
        {
            this.chartSpace.x = x*nSparklineMultiplier;
            this.chartSpace.y = y*nSparklineMultiplier;
            this.chartSpace.transform.tx = this.chartSpace.x;
            this.chartSpace.transform.ty = this.chartSpace.y;
        }
    }

    var tx, ty, sx, sy, oldExtX, oldExtY;

    var _true_height = this.chartSpace.chartObj.calcProp.trueHeight;
    var _true_width = this.chartSpace.chartObj.calcProp.trueWidht;


	this.chartSpace.chartObj.calcProp.trueWidht = this.chartSpace.extX * this.chartSpace.chartObj.calcProp.pxToMM;
	this.chartSpace.chartObj.calcProp.trueHeight = this.chartSpace.extY * this.chartSpace.chartObj.calcProp.pxToMM;

    this.chartSpace.draw(graphics);

	this.chartSpace.chartObj.calcProp.trueWidht = _true_width;
	this.chartSpace.chartObj.calcProp.trueHeight = _true_height;


};


CSparklineView.prototype.setMinMaxValAx = function(minVal, maxVal, oSparklineGroup)
{
    var oAxis = this.chartSpace.chart.plotArea.getAxisByTypes();
    var oValAx = oAxis.valAx[0];
    if(oValAx)
    {
        if(minVal !== null)
        {
            if(!oValAx.scaling)
            {
                oValAx.setScaling(new AscFormat.CScaling());
            }
            oValAx.scaling.setMin(minVal);
        }
        if(maxVal !== null)
        {
            if(!oValAx.scaling)
            {
                oValAx.setScaling(new AscFormat.CScaling());
            }
            oValAx.scaling.setMax(maxVal);
        }


        if(oSparklineGroup.displayXAxis)
        {
             var  aSeriesPoints = AscFormat.getPtsFromSeries(this.chartSpace.chart.plotArea.charts[0].series[0]);
            if(aSeriesPoints.length > 1)
            {
                aSeriesPoints = [].concat(aSeriesPoints);
                var dMinVal, dMaxVal, bSorted = false;
                if(minVal == null)
                {
                    aSeriesPoints.sort(function(a, b){return a.val - b.val;});
                    bSorted = true;
                    dMinVal = aSeriesPoints[0].val;
                }
                else
                {
                    dMinVal = minVal;
                }

                if(maxVal == null)
                {
                    if(!bSorted)
                    {
                        aSeriesPoints.sort(function(a, b){return a.val - b.val;});
                        bSorted = true;
                    }
                    dMaxVal = aSeriesPoints[aSeriesPoints.length - 1].val;
                }
                else
                {
                    dMaxVal = maxVal;
                }
                if(dMaxVal < 0 || dMinVal > 0)
                {
                    oAxis.catAx[0].setDelete(true);
                }
                else
                {
                    oAxis.catAx[0].setDelete(false);
                }
            }
        }


        this.chartSpace.recalcInfo.recalculateAxisVal = true;
        this.chartSpace.recalculate();
    }
};
//-----------------------------------------------------------------------------------
// Manager
//-----------------------------------------------------------------------------------


function CChangeTableData(changedRange, added, hided, removed, arrChanged)
{
    this.changedRange = changedRange;
    this.added = added;
    this.hided = hided;
    this.removed = removed;
    this.arrChanged = arrChanged;
}

function GraphicOption(ws, type, range, offset) {
    this.ws = ws;
	this.type = type;
	this.range = range;

	this.offset = offset;
}

GraphicOption.prototype.isScrollType = function() {
	return ((this.type === AscCommonExcel.c_oAscGraphicOption.ScrollVertical) || (this.type === AscCommonExcel.c_oAscGraphicOption.ScrollHorizontal));
};

GraphicOption.prototype.getUpdatedRange = function() {
	return this.range;
};
GraphicOption.prototype.getOffset = function () {
	return this.offset;
};

function DrawingObjects() {

    //-----------------------------------------------------------------------------------
    // Scroll offset
    //-----------------------------------------------------------------------------------

    var ScrollOffset = function() {

        this.getX = function() {
            return -ptToPx((worksheet.cols[worksheet.getFirstVisibleCol(true)].left - worksheet.cellsLeft)) + worksheet.getCellLeft(0, 0);
        };

        this.getY = function() {
            return -ptToPx((worksheet.rows[worksheet.getFirstVisibleRow(true)].top - worksheet.cellsTop)) + worksheet.getCellTop(0, 0);
        }
    };

    //-----------------------------------------------------------------------------------
    // Private
    //-----------------------------------------------------------------------------------

    var _this = this;
    var asc = window["Asc"];
    var api = asc["editor"];
    var worksheet = null;
    var asc_Range = asc.Range;

    var drawingCtx = null;
    var overlayCtx = null;
    var shapeCtx = null;
    var shapeOverlayCtx = null;

    var trackOverlay = null;
    var autoShapeTrack = null;
    var scrollOffset = new ScrollOffset();

    var aObjects = [];
    var aImagesSync = [];


    var oStateBeforeLoadChanges = null;

    _this.zoom = { last: 1, current: 1 };
    _this.isViewerMode = null;
    _this.objectLocker = null;
    _this.drawingArea = null;
    _this.coordsManager = null;
    _this.drawingDocument = null;
    _this.asyncImageEndLoaded = null;
    _this.asyncImagesDocumentEndLoaded = null;
    _this.CompositeInput = null;


    _this.nCurPointItemsLength = -1;
    // Task timer
    var aDrawTasks = [];

    function drawTaskFunction() {

        // При скролах нужно выполнить все задачи

        _this.drawingDocument.CheckTargetShow();
        var taskLen = aDrawTasks.length;
        if ( taskLen ) {
            var lastTask = aDrawTasks[taskLen - 1];
            _this.showDrawingObjectsEx(lastTask.params.clearCanvas, lastTask.params.graphicOption, lastTask.params.printOptions);
            aDrawTasks.splice(0, (taskLen - 1 > 0) ? taskLen - 1 : 1);
        }

		api._autoSave();
    }

    //-----------------------------------------------------------------------------------
    // Create drawing
    //-----------------------------------------------------------------------------------

    function DrawingBase(ws) {
        this.worksheet = ws;

		this.imageUrl = "";
		this.Type = c_oAscCellAnchorType.cellanchorTwoCell;
		this.Pos = { X: 0, Y: 0 };

		this.from = new CCellObjectInfo();
		this.to = new CCellObjectInfo();
		this.ext = { cx: 0, cy: 0 };
		this.size = { width: 0, height: 0 };

		this.graphicObject = null; // CImage, CShape, GroupShape or CChartAsGroup

        this.boundsFromTo =
        {
            from: new CCellObjectInfo(),
            to  : new CCellObjectInfo()
        };

		this.flags = {
            anchorUpdated: false,
            lockState: c_oAscLockTypes.kLockTypeNone
        };
    }

    //{ prototype


    DrawingBase.prototype.isUseInDocument = function() {
        if(worksheet && worksheet.model){
            var aDrawings = worksheet.model.Drawings;
            for(var i = 0; i < aDrawings.length; ++i){
                if(aDrawings[i] === this){
                    return true;
                }
            }
        }
        return false;
    };

    DrawingBase.prototype.getAllFonts = function(AllFonts) {
        var _t = this;
        _t.graphicObject && _t.graphicObject.documentGetAllFontNames && _t.graphicObject.documentGetAllFontNames(AllFonts);
    };

    DrawingBase.prototype.isImage = function() {
        var _t = this;
        return _t.graphicObject ? _t.graphicObject.isImage() : false;
    };

    DrawingBase.prototype.isShape = function() {
        var _t = this;
        return _t.graphicObject ? _t.graphicObject.isShape() : false;
    };

    DrawingBase.prototype.isGroup = function() {
        var _t = this;
        return _t.graphicObject ? _t.graphicObject.isGroup() : false;
    };

    DrawingBase.prototype.isChart = function() {
        var _t = this;
        return _t.graphicObject ? _t.graphicObject.isChart() : false;
    };

    DrawingBase.prototype.isGraphicObject = function() {
        var _t = this;
        return _t.graphicObject != null;
    };

    DrawingBase.prototype.isLocked = function() {
        var _t = this;
        return ( (_t.graphicObject.lockType != c_oAscLockTypes.kLockTypeNone) && (_t.graphicObject.lockType != c_oAscLockTypes.kLockTypeMine) )
    };

    DrawingBase.prototype.getCanvasContext = function() {
        return _this.drawingDocument.CanvasHitContext;
    };

    // GraphicObject: x, y, extX, extY
    DrawingBase.prototype.getGraphicObjectMetrics = function() {
        var _t = this;
        var metrics = { x: 0, y: 0, extX: 0, extY: 0 };

        var coordsFrom, coordsTo;
        switch(_t.Type)
        {
            case c_oAscCellAnchorType.cellanchorAbsolute:
            {
                metrics.x = this.Pos.X;
                metrics.y = this.Pos.Y;
                metrics.extX = this.ext.cx;
                metrics.extY = this.ext.cy;
                break;
            }
            case c_oAscCellAnchorType.cellanchorOneCell:
            {
                if(_this.coordsManager)
                {
                    coordsFrom = _this.coordsManager.calculateCoords(_t.from);
                    metrics.x = pxToMm( coordsFrom.x );
                    metrics.y = pxToMm( coordsFrom.y );
                    metrics.extX = this.ext.cx;
                    metrics.extY = this.ext.cy;
                }
                break;
            }
            case c_oAscCellAnchorType.cellanchorTwoCell:
            {
                if(_this.coordsManager)
                {
                    coordsFrom = _this.coordsManager.calculateCoords(_t.from);
                    metrics.x = pxToMm( coordsFrom.x );
                    metrics.y = pxToMm( coordsFrom.y );

                    coordsTo = _this.coordsManager.calculateCoords(_t.to);
                    metrics.extX = pxToMm( coordsTo.x - coordsFrom.x );
                    metrics.extY = pxToMm( coordsTo.y - coordsFrom.y );
                }
                break;
            }
        }


        return metrics;
    };

    // Считаем From/To исходя из graphicObject
    DrawingBase.prototype.setGraphicObjectCoords = function() {
        var _t = this;

        if ( _t.isGraphicObject() ) {

            var rot = AscFormat.isRealNumber(_t.graphicObject.rot) ? _t.graphicObject.rot : 0;
            rot = AscFormat.normalizeRotate(rot);

            var fromX, fromY, toX, toY;
            if (AscFormat.checkNormalRotate(rot))
            {
                fromX =  mmToPt(_t.graphicObject.x);
                fromY =  mmToPt(_t.graphicObject.y);
                toX = mmToPt(_t.graphicObject.x + _t.graphicObject.extX);
                toY = mmToPt(_t.graphicObject.y + _t.graphicObject.extY);
                this.Pos.X = _t.graphicObject.x;
                this.Pos.Y = _t.graphicObject.y;
                this.ext.cx = _t.graphicObject.extX;
                this.ext.cy = _t.graphicObject.extY;
            }
            else
            {
                var _xc, _yc;
                _xc = _t.graphicObject.x + _t.graphicObject.extX/2;
                _yc = _t.graphicObject.y + _t.graphicObject.extY/2;
                fromX =  mmToPt(_xc - _t.graphicObject.extY/2);
                fromY =  mmToPt(_yc - _t.graphicObject.extX/2);
                toX = mmToPt(_xc + _t.graphicObject.extY/2);
                toY = mmToPt(_yc + _t.graphicObject.extX/2);
                this.Pos.X = _xc - _t.graphicObject.extY/2;
                this.Pos.Y = _yc - _t.graphicObject.extX/2;
                this.ext.cx = _t.graphicObject.extY;
                this.ext.cy = _t.graphicObject.extX;
            }


           // var fromX =  mmToPt(_t.graphicObject.x), fromY =  mmToPt(_t.graphicObject.y),
           //     toX = mmToPt(_t.graphicObject.x + _t.graphicObject.extX), toY = mmToPt(_t.graphicObject.y + _t.graphicObject.extY);
            var bReinitHorScroll = false, bReinitVertScroll = false;

            var fromColCell = worksheet.findCellByXY(fromX, fromY, true, false, true);
            while(fromColCell.col === null && worksheet.cols.length < gc_nMaxCol)
            {
                worksheet.expandColsOnScroll(true);
                fromColCell = worksheet.findCellByXY(fromX, fromY, true, false, true);
                bReinitHorScroll = true;
            }
            if(fromColCell.col === null)
            {
                fromColCell.col = gc_nMaxCol;
            }
            var fromRowCell = worksheet.findCellByXY(fromX, fromY, true, true, false);

            while(fromRowCell.row === null && worksheet.rows.length < gc_nMaxRow)
            {
                worksheet.expandRowsOnScroll(true);
                fromRowCell = worksheet.findCellByXY(fromX, fromY, true, true, false);
                bReinitVertScroll = true;
            }
            if(fromRowCell.row === null)
            {
                fromRowCell.row = gc_nMaxRow;
            }


            var toColCell = worksheet.findCellByXY(toX, toY, true, false, true);
            while(toColCell.col === null && worksheet.cols.length < gc_nMaxCol)
            {
                worksheet.expandColsOnScroll(true);
                toColCell = worksheet.findCellByXY(toX, toY, true, false, true);
                bReinitHorScroll = true;
            }
            if(toColCell.col === null)
            {
                toColCell.col = gc_nMaxCol;
            }
            var toRowCell = worksheet.findCellByXY(toX, toY, true, true, false);

            while(toRowCell.row === null && worksheet.rows.length < gc_nMaxRow)
            {
                worksheet.expandRowsOnScroll(true);
                toRowCell = worksheet.findCellByXY(toX, toY, true, true, false);
                bReinitVertScroll = true;
            }
            if(toRowCell.row === null)
            {
                toRowCell.row = gc_nMaxRow;
            }

            _t.from.col = fromColCell.col;
            _t.from.colOff = ptToMm(fromColCell.colOff);
            _t.from.row = fromRowCell.row;
            _t.from.rowOff = ptToMm(fromRowCell.rowOff);

            _t.to.col = toColCell.col;
            _t.to.colOff = ptToMm(toColCell.colOff);
            _t.to.row = toRowCell.row;
            _t.to.rowOff = ptToMm(toRowCell.rowOff);
            if(bReinitHorScroll)
            {
                worksheet.handlers.trigger("reinitializeScrollX");
            }
            if(bReinitVertScroll)
            {
                worksheet.handlers.trigger("reinitializeScrollY");
            }
        }
    };


    DrawingBase.prototype.checkBoundsFromTo = function() {
        var _t = this;

        if ( _t.isGraphicObject() && _t.graphicObject.bounds) {


            var bounds = _t.graphicObject.bounds;


            var fromX =  mmToPt(bounds.x > 0 ? bounds.x : 0), fromY =  mmToPt(bounds.y > 0 ? bounds.y : 0),
                toX = mmToPt(bounds.x + bounds.w), toY = mmToPt(bounds.y + bounds.h);
            if(toX < 0)
            {
                toX = 0;
            }
            if(toY < 0)
            {
                toY = 0;
            }
            var bReinitHorScroll = false, bReinitVertScroll = false;

            var fromColCell = worksheet.findCellByXY(fromX, fromY, true, false, true);
            while(fromColCell.col === null && worksheet.cols.length < gc_nMaxCol)
            {
                worksheet.expandColsOnScroll(true);
                fromColCell = worksheet.findCellByXY(fromX, fromY, true, false, true);
                bReinitHorScroll = true;
            }
            if(fromColCell.col === null)
            {
                fromColCell.col = gc_nMaxCol;
            }
            var fromRowCell = worksheet.findCellByXY(fromX, fromY, true, true, false);

            while(fromRowCell.row === null && worksheet.rows.length < gc_nMaxRow)
            {
                worksheet.expandRowsOnScroll(true);
                fromRowCell = worksheet.findCellByXY(fromX, fromY, true, true, false);
                bReinitVertScroll = true;
            }
            if(fromRowCell.row === null)
            {
                fromRowCell.row = gc_nMaxRow;
            }


            var toColCell = worksheet.findCellByXY(toX, toY, true, false, true);
            while(toColCell.col === null && worksheet.cols.length < gc_nMaxCol)
            {
                worksheet.expandColsOnScroll(true);
                toColCell = worksheet.findCellByXY(toX, toY, true, false, true);
                bReinitHorScroll = true;
            }
            if(toColCell.col === null)
            {
                toColCell.col = gc_nMaxCol;
            }
            var toRowCell = worksheet.findCellByXY(toX, toY, true, true, false);

            while(toRowCell.row === null && worksheet.rows.length < gc_nMaxRow)
            {
                worksheet.expandRowsOnScroll(true);
                toRowCell = worksheet.findCellByXY(toX, toY, true, true, false);
                bReinitVertScroll = true;
            }
            if(toRowCell.row === null)
            {
                toRowCell.row = gc_nMaxRow;
            }

            _t.boundsFromTo.from.col = fromColCell.col;
            _t.boundsFromTo.from.colOff = ptToMm(fromColCell.colOff);
            _t.boundsFromTo.from.row = fromRowCell.row;
            _t.boundsFromTo.from.rowOff = ptToMm(fromRowCell.rowOff);

            _t.boundsFromTo.to.col = toColCell.col;
            _t.boundsFromTo.to.colOff = ptToMm(toColCell.colOff);
            _t.boundsFromTo.to.row = toRowCell.row;
            _t.boundsFromTo.to.rowOff = ptToMm(toRowCell.rowOff);
            if(bReinitHorScroll)
            {
                worksheet.handlers.trigger("reinitializeScrollX");
            }
            if(bReinitVertScroll)
            {
                worksheet.handlers.trigger("reinitializeScrollY");
            }
        }
    };

    // Реальное смещение по высоте
    DrawingBase.prototype.getRealTopOffset = function() {
        var _t = this;
        var val = _t.worksheet.getCellTop(_t.from.row, 0) + mmToPx(_t.from.rowOff);
        return asc.round(val);
    };

    // Реальное смещение по ширине
    DrawingBase.prototype.getRealLeftOffset = function() {
        var _t = this;
        var val = _t.worksheet.getCellLeft(_t.from.col, 0) + mmToPx(_t.from.colOff);
        return asc.round(val);
    };

    // Ширина по координатам
    DrawingBase.prototype.getWidthFromTo = function() {
        return (this.worksheet.getCellLeft(this.to.col, 0) + mmToPx(this.to.colOff) -
			this.worksheet.getCellLeft(this.from.col, 0) - mmToPx(this.from.colOff));
    };

    // Высота по координатам
    DrawingBase.prototype.getHeightFromTo = function() {
        return this.worksheet.getCellTop(this.to.row, 0) + mmToPx(this.to.rowOff) -
			this.worksheet.getCellTop(this.from.row, 0) - mmToPx(this.from.rowOff);
    };

    // Видимое смещение объекта от первой видимой строки
    DrawingBase.prototype.getVisibleTopOffset = function(withHeader) {
        var _t = this;
        var headerRowOff = _t.worksheet.getCellTop(0, 0);
        var fvr = _t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(true), 0);
        var off = _t.getRealTopOffset() - fvr;
        off = (off > 0) ? off : 0;
        return withHeader ? headerRowOff + off : off;
    };

    // Видимое смещение объекта от первой видимой колонки
    DrawingBase.prototype.getVisibleLeftOffset = function(withHeader) {
        var _t = this;
        var headerColOff = _t.worksheet.getCellLeft(0, 0);
        var fvc = _t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(true), 0);
        var off = _t.getRealLeftOffset() - fvc;
        off = (off > 0) ? off : 0;
        return withHeader ? headerColOff + off : off;
    };

    DrawingBase.prototype.getDrawingObjects = function() {
        return _this;
    };

    //}

    //-----------------------------------------------------------------------------------
    // Constructor
    //-----------------------------------------------------------------------------------

    _this.getScrollOffset = function()
    {
        return scrollOffset;
    };

    _this.saveStateBeforeLoadChanges = function(){
        if(this.controller){
            oStateBeforeLoadChanges = {};
            this.controller.Save_DocumentStateBeforeLoadChanges(oStateBeforeLoadChanges);
        }
        else{
            oStateBeforeLoadChanges = null;
        }
        return oStateBeforeLoadChanges;
    };

    _this.loadStateAfterLoadChanges = function(){
        if(_this.controller){
            _this.controller.clearPreTrackObjects();
            _this.controller.clearTrackObjects();
            _this.controller.resetSelection();
            _this.controller.changeCurrentState(new AscFormat.NullState(this.controller));
            if(oStateBeforeLoadChanges){
                _this.controller.loadDocumentStateAfterLoadChanges(oStateBeforeLoadChanges);
            }
        }
        oStateBeforeLoadChanges = null;
        return oStateBeforeLoadChanges;
    };

    _this.getStateBeforeLoadChanges = function(){
        return oStateBeforeLoadChanges;
    };

    _this.createDrawingObject = function(type) {
        var drawingBase = new DrawingBase(worksheet);
        if(AscFormat.isRealNumber(type))
        {
            drawingBase.Type = type;
        }
        return drawingBase;
    };

    _this.cloneDrawingObject = function(object) {

        var copyObject = _this.createDrawingObject();

        copyObject.Type = object.Type;
        copyObject.Pos.X = object.Pos.X;
        copyObject.Pos.Y = object.Pos.Y;
        copyObject.ext.cx = object.ext.cx;
        copyObject.ext.cy = object.ext.cy;

        copyObject.from.col = object.from.col;
        copyObject.from.colOff = object.from.colOff;
        copyObject.from.row = object.from.row;
        copyObject.from.rowOff = object.from.rowOff;

        copyObject.to.col = object.to.col;
        copyObject.to.colOff = object.to.colOff;
        copyObject.to.row = object.to.row;
        copyObject.to.rowOff = object.to.rowOff;

        copyObject.graphicObject = object.graphicObject;
        return copyObject;
    };

    //-----------------------------------------------------------------------------------
    // Public methods
    //-----------------------------------------------------------------------------------

    _this.init = function(currentSheet) {
 
        if (!window['IS_NATIVE_EDITOR']) {
            setInterval(drawTaskFunction, 5);
        }

        var api = window["Asc"]["editor"];
        worksheet = currentSheet;

        drawingCtx = currentSheet.drawingGraphicCtx;
        overlayCtx = currentSheet.overlayGraphicCtx;
        shapeCtx = currentSheet.shapeCtx;
        shapeOverlayCtx = currentSheet.shapeOverlayCtx;

        trackOverlay = new AscCommon.COverlay();
        trackOverlay.init( shapeOverlayCtx.m_oContext, "ws-canvas-graphic-overlay", 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );

        autoShapeTrack = new AscCommon.CAutoshapeTrack();
        autoShapeTrack.init( trackOverlay, 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );
        shapeCtx.m_oAutoShapesTrack = autoShapeTrack;


        _this.objectLocker = new ObjectLocker(worksheet);
        _this.drawingArea = currentSheet.drawingArea;
        _this.drawingArea.init();
        _this.coordsManager = new CoordsManager(worksheet, true);
        _this.drawingDocument = currentSheet.model.DrawingDocument ? currentSheet.model.DrawingDocument : new AscCommon.CDrawingDocument(this);
        _this.drawingDocument.drawingObjects = this;
        _this.drawingDocument.AutoShapesTrack = autoShapeTrack;
        _this.drawingDocument.TargetHtmlElement = document.getElementById('id_target_cursor');
        _this.drawingDocument.InitGuiCanvasShape(api.shapeElementId);
        _this.controller = new AscFormat.DrawingObjectsController(_this);

        _this.isViewerMode = function() { return worksheet.handlers.trigger("getViewerMode"); };

        aImagesSync = [];

		var i;
        aObjects = currentSheet.model.Drawings;
        for (i = 0; currentSheet.model.Drawings && (i < currentSheet.model.Drawings.length); i++)
        {
            aObjects[i] = _this.cloneDrawingObject(aObjects[i]);
            var drawingObject = aObjects[i];
            // Check drawing area
            drawingObject.drawingArea = _this.drawingArea;
            drawingObject.worksheet = currentSheet;
            if ( !worksheet.cols[drawingObject.to.col] ) {
                while ( !worksheet.cols[drawingObject.to.col] ) {
                    worksheet.expandColsOnScroll(true);
                }
                worksheet.expandColsOnScroll(true); 	// для colOff
            }
            if ( !worksheet.rows[drawingObject.to.row] ) {
                while ( !worksheet.rows[drawingObject.to.row] ) {
                    worksheet.expandRowsOnScroll(true);
                }
                worksheet.expandRowsOnScroll(true); 	// для rowOff
            }
            var metrics = drawingObject.getGraphicObjectMetrics();


            drawingObject.graphicObject.drawingBase = aObjects[i];
            drawingObject.graphicObject.drawingObjects = _this;
            drawingObject.graphicObject.getAllRasterImages(aImagesSync);
        }

        for(i = 0; i < aImagesSync.length; ++i)
        {
			var localUrl = aImagesSync[i];
			if(api.DocInfo && api.DocInfo.asc_getOfflineApp()) {
          AscCommon.g_oDocumentUrls.addImageUrl(localUrl, "/sdkjs/cell/document/media/" + localUrl);
			}
            aImagesSync[i] = AscCommon.getFullImageSrc2(localUrl);
        }

        // Загружаем все картинки листа
        _this.asyncImagesDocumentEndLoaded = function()
        {
            _this.showDrawingObjects(true);
        };

        if(aImagesSync.length > 0)
        {
            var old_val = api.ImageLoader.bIsAsyncLoadDocumentImages;
            api.ImageLoader.bIsAsyncLoadDocumentImages = true;
            api.ImageLoader.LoadDocumentImages(aImagesSync, null);
            api.ImageLoader.bIsAsyncLoadDocumentImages = old_val;
        }

		_this.recalculate(true);

        _this.shiftMap = {};
        worksheet.model.Drawings = aObjects;
    };


    _this.getSelectedDrawingsRange = function()
    {
        var i, rmin=gc_nMaxRow, rmax = 0, cmin = gc_nMaxCol, cmax = 0, selectedObjects = this.controller.selectedObjects, drawingBase;
        for(i = 0; i < selectedObjects.length; ++i)
        {

            drawingBase = selectedObjects[i].drawingBase;
            if(drawingBase)
            {
                if(drawingBase.from.col < cmin)
                {
                    cmin = drawingBase.from.col;
                }
                if(drawingBase.from.row < rmin)
                {
                    rmin = drawingBase.from.row;
                }
                if(drawingBase.to.col > cmax)
                {
                    cmax = drawingBase.to.col;
                }
                if(drawingBase.to.row > rmax)
                {
                    rmax = drawingBase.to.row;
                }
            }
        }
        return new AscCommonExcel.ActiveRange(cmin, rmin, cmax, rmax, true);
    };

    _this.recalculate =  function(all)
    {
        _this.controller.recalculate2(all);
    };

    _this.preCopy = function() {
        _this.shiftMap = {};
        var selected_objects = _this.controller.selectedObjects;
        if(selected_objects.length > 0)
        {
            var min_x, min_y, i;
            min_x = selected_objects[0].x;
            min_y = selected_objects[0].y;
            for(i = 1; i < selected_objects.length; ++i)
            {
                if(selected_objects[i].x < min_x)
                    min_x = selected_objects[i].x;

                if(selected_objects[i].y < min_y)
                    min_y = selected_objects[i].y;
            }
            for(i = 0; i < selected_objects.length; ++i)
            {
                _this.shiftMap[selected_objects[i].Get_Id()] = {x: selected_objects[i].x - min_x, y: selected_objects[i].y - min_y};
            }
        }

    };

    _this.getAllFonts = function(AllFonts) {

    };

    _this.getOverlay = function() {
        return trackOverlay;
    };

    _this.OnUpdateOverlay = function() {
        _this.drawingArea.drawSelection(_this.drawingDocument);
    };

    _this.changeZoom = function(factor) {

        _this.zoom.last = _this.zoom.current;
        _this.zoom.current = factor;

        _this.resizeCanvas();
    };

    _this.resizeCanvas = function() {
		_this.drawingArea.init();

        var canvasWidth = drawingCtx.canvas.width;
        var canvasHeight = drawingCtx.canvas.height;

        shapeCtx.init( drawingCtx.ctx, canvasWidth, canvasHeight, (canvasWidth*25.4/drawingCtx.ppiX), (canvasHeight*25.4/drawingCtx.ppiY));
        shapeCtx.CalculateFullTransform();




        var overlayWidth = overlayCtx.canvas.width;
        var overlayHeight = overlayCtx.canvas.height;

        shapeOverlayCtx.init( overlayCtx.ctx, overlayWidth, overlayHeight, (overlayWidth*25.4/overlayCtx.ppiX), (overlayHeight*25.4/overlayCtx.ppiY));
        shapeOverlayCtx.CalculateFullTransform();

        trackOverlay.init( shapeOverlayCtx.m_oContext, "ws-canvas-graphic-overlay", 0, 0, overlayWidth, overlayHeight, (overlayWidth*25.4/overlayCtx.ppiX), (overlayHeight*25.4/overlayCtx.ppiY));
        autoShapeTrack.init( trackOverlay, 0, 0,  overlayWidth, overlayHeight, (overlayWidth*25.4/overlayCtx.ppiX), (overlayHeight*25.4/overlayCtx.ppiY) );
        autoShapeTrack.Graphics.CalculateFullTransform();
    };

    _this.getCanvasContext = function() {
        return _this.drawingDocument.CanvasHitContext;
    };

    _this.getDrawingObjects = function() {
        return aObjects;
    };

    _this.getWorksheet = function() {
        return worksheet;
    };

	_this.getContextWidth = function () {
		return drawingCtx.getWidth();
	};
	_this.getContextHeight = function () {
		return drawingCtx.getHeight();
	};
    _this.getContext = function () {
        return drawingCtx;
    };

    _this.getWorksheetModel = function() {
        return worksheet.model;
    };

    _this.callTrigger = function(triggerName, param) {
        if ( triggerName )
            worksheet.model.workbook.handlers.trigger(triggerName, param);
    };

    _this.getDrawingObjectsBounds = function()
    {
        var arr_x = [], arr_y = [], bounds;
        for(var i = 0; i < aObjects.length; ++i)
        {
            bounds = aObjects[i].graphicObject.bounds;
            arr_x.push(bounds.l);
            arr_x.push(bounds.r);
            arr_y.push(bounds.t);
            arr_y.push(bounds.b);
        }
        return new DrawingBounds(Math.min.apply(Math, arr_x), Math.max.apply(Math, arr_x), Math.min.apply(Math, arr_y), Math.max.apply(Math, arr_y));
    };

    //-----------------------------------------------------------------------------------
    // Drawing objects
    //-----------------------------------------------------------------------------------

    _this.showDrawingObjects = function(clearCanvas, graphicOption, printOptions) {

        var currTime = getCurrentTime();
        if ( aDrawTasks.length ) {

            var lastTask = aDrawTasks[aDrawTasks.length - 1];

			// ToDo не всегда грамотно так делать, т.к. в одном scroll я могу прислать 2 области (и их объединять не нужно)
            if ( lastTask.params.graphicOption && lastTask.params.graphicOption.isScrollType() && graphicOption && (lastTask.params.graphicOption.type === graphicOption.type) ) {
                lastTask.params.graphicOption.range.c1 = Math.min(lastTask.params.graphicOption.range.c1, graphicOption.range.c1);
                lastTask.params.graphicOption.range.r1 = Math.min(lastTask.params.graphicOption.range.r1, graphicOption.range.r1);
                lastTask.params.graphicOption.range.c2 = Math.max(lastTask.params.graphicOption.range.c2, graphicOption.range.c2);
                lastTask.params.graphicOption.range.r2 = Math.max(lastTask.params.graphicOption.range.r2, graphicOption.range.r2);
                return;
            }
            if ( (currTime - lastTask.time < 40) )
                return;
        }

        aDrawTasks.push({ time: currTime, params: { clearCanvas: clearCanvas, graphicOption: graphicOption, printOptions: printOptions} });
    };

    _this.showDrawingObjectsEx = function(clearCanvas, graphicOption, printOptions) {

        /*********** Print Options ***************
         printOptions : {
			ctx,
			printPagesData
		}
         *****************************************/

        // Undo/Redo
        if ( (worksheet.model.index != api.wb.model.getActive()) && !printOptions )
            return;

        if ( drawingCtx ) {
            if ( clearCanvas ) {
                _this.drawingArea.clear();
            }

            if ( aObjects.length ) {
                if (graphicOption) {
                    // Выставляем нужный диапазон для отрисовки
                    var updatedRect = { x: 0, y: 0, w: 0, h: 0 };
                    var updatedRange = graphicOption.getUpdatedRange();

					var x1 = worksheet.getCellLeft(updatedRange.c1, 1);// - offsetX;
                    var y1 = worksheet.getCellTop(updatedRange.r1, 1) ;//- offsetY;
                    var x2 = worksheet.getCellLeft(updatedRange.c2, 1) + worksheet.getColumnWidth(updatedRange.c2, 1);// - offsetX;
                    var y2 = worksheet.getCellTop(updatedRange.r2, 1) + worksheet.getRowHeight(updatedRange.r2, 1);//- offsetY;
                    var w = x2 - x1;
                    var h = y2 - y1;
					var offset = worksheet.getCellsOffset(1);

                    updatedRect.x = ptToMm(x1 - offset.left);//ptToMm(x1);
                    updatedRect.y = ptToMm(y1 - offset.top);//ptToMm(y1);
                    updatedRect.w = ptToMm(w);
                    updatedRect.h = ptToMm(h);

					var offsetScroll = graphicOption.getOffset();
					shapeCtx.m_oContext.save();
					shapeCtx.m_oContext.beginPath();
					shapeCtx.m_oContext.rect(ptToPx(x1 - offsetScroll.offsetX), ptToPx(y1 - offsetScroll.offsetY), ptToPx(w), ptToPx(h));
                    shapeCtx.m_oContext.clip();

                    shapeCtx.updatedRect = updatedRect;
                } else
                    shapeCtx.updatedRect = null;


                for (var i = 0; i < aObjects.length; i++) {
                    var drawingObject = aObjects[i];

                    // Shape render (drawForPrint)
                    if ( drawingObject.isGraphicObject() ) {
                        if ( printOptions ) {

                            var range = printOptions.printPagesData.pageRange;
                            var printPagesData = printOptions.printPagesData;
                            var offsetCols = printPagesData.startOffsetPt;

                            var left = worksheet.getCellLeft(range.c1, 3) - worksheet.getCellLeft(0, 3) - ptToMm(printPagesData.leftFieldInPt);
                            var top = worksheet.getCellTop(range.r1, 3) - worksheet.getCellTop(0, 3) - ptToMm(printPagesData.topFieldInPt);

                            _this.printGraphicObject(drawingObject.graphicObject, printOptions.ctx.DocumentRenderer, top, left);

                            if ( printPagesData.pageHeadings ) {
                                worksheet._drawColumnHeaders(printOptions.ctx, range.c1, range.c2, /*style*/ undefined, worksheet.cols[range.c1].left - printPagesData.leftFieldInPt + offsetCols, printPagesData.topFieldInPt - worksheet.cellsTop);
                                worksheet._drawRowHeaders(printOptions.ctx, range.r1, range.r2, /*style*/ undefined, printPagesData.leftFieldInPt - worksheet.cellsLeft, worksheet.rows[range.r1].top - printPagesData.topFieldInPt);
                            }
                        }
                        else {
                            _this.drawingArea.drawObject(drawingObject);
                        }
                    }
                }

				if (graphicOption)
                {
                    shapeCtx.m_oContext.restore();
                }
            }
            worksheet.model.Drawings = aObjects;
        }

        if ( !printOptions ) {
            if ( aObjects.length ) {
                if ( _this.controller.selectedObjects.length )
                {
                    _this.OnUpdateOverlay();
                    _this.controller.updateSelectionState(true);
                }
            }
        }
    };

    _this.getDrawingDocument = function()
    {
        return _this.drawingDocument;
    };

    _this.printGraphicObject = function(graphicObject, ctx, top, left) {

        if ( graphicObject && ctx ) {
            // Image
            if ( graphicObject instanceof AscFormat.CImageShape )
                printImage(graphicObject, ctx, top, left);
            // Shape
            else if ( graphicObject instanceof AscFormat.CShape )
                printShape(graphicObject, ctx, top, left);
            // Chart
            else if (graphicObject instanceof AscFormat.CChartSpace)
                printChart(graphicObject, ctx, top, left);
            // Group
            else if ( graphicObject instanceof AscFormat.CGroupShape )
                printGroup(graphicObject, ctx, top, left);
        }

        // Print functions
        function printImage(graphicObject, ctx, top, left) {

            if ( (graphicObject instanceof AscFormat.CImageShape) && graphicObject && ctx ) {
                // Save
                var tx = graphicObject.transform.tx;
                var ty = graphicObject.transform.ty;
                graphicObject.transform.tx -= left;
                graphicObject.transform.ty -= top;
                // Print
                graphicObject.draw( ctx );
                // Restore
                graphicObject.transform.tx = tx;
                graphicObject.transform.ty = ty;
            }
        }

        function printShape(graphicObject, ctx, top, left) {

            if ( (graphicObject instanceof AscFormat.CShape) && graphicObject && ctx ) {
                // Save
                var tx = graphicObject.transform.tx;
                var ty = graphicObject.transform.ty;
                graphicObject.transform.tx -= left;
                graphicObject.transform.ty -= top;
                var txTxt, tyTxt, txWA, tyWA;
                if ( graphicObject.txBody && graphicObject.transformText ) {
                    txTxt = graphicObject.transformText.tx;
                    tyTxt = graphicObject.transformText.ty;
                    graphicObject.transformText.tx -= left;
                    graphicObject.transformText.ty -= top;
                }

                if(graphicObject.transformTextWordArt)
                {
                    graphicObject.transformTextWordArt.tx -= left;
                    graphicObject.transformTextWordArt.ty -= top;
                }
                // Print
                graphicObject.draw( ctx );
                // Restore
                graphicObject.transform.tx = tx;
                graphicObject.transform.ty = ty;
                if ( graphicObject.txBody && graphicObject.transformText ) {
                    graphicObject.transformText.tx = txTxt;
                    graphicObject.transformText.ty = tyTxt;
                }
                if(graphicObject.transformTextWordArt)
                {
                    graphicObject.transformTextWordArt.tx += left;
                    graphicObject.transformTextWordArt.ty += top;
                }
            }
        }

        function printChart(graphicObject, ctx, top, left) {

            if ( (graphicObject instanceof AscFormat.CChartSpace) && graphicObject && ctx ) {

                // Save
                var tx = graphicObject.transform.tx;
                var ty = graphicObject.transform.ty;
                graphicObject.transform.tx -= left;
                graphicObject.transform.ty -= top;

                graphicObject.updateChildLabelsTransform(graphicObject.transform.tx, graphicObject.transform.ty);
                // Print
                graphicObject.draw( ctx );
                // Restore
                graphicObject.transform.tx = tx;
                graphicObject.transform.ty = ty;
                graphicObject.updateChildLabelsTransform(graphicObject.transform.tx, graphicObject.transform.ty);

            }
        }

        function printGroup(graphicObject, ctx, top, left) {

            if ( (graphicObject instanceof AscFormat.CGroupShape) && graphicObject && ctx ) {
                for ( var i = 0; i < graphicObject.arrGraphicObjects.length; i++ ) {
                    var graphicItem = graphicObject.arrGraphicObjects[i];

                    if ( graphicItem instanceof AscFormat.CImageShape )
                        printImage(graphicItem, ctx, top, left);

                    else if ( graphicItem instanceof AscFormat.CShape )
                        printShape(graphicItem, ctx, top, left);

                    else if (graphicItem instanceof AscFormat.CChartSpace )
                        printChart(graphicItem, ctx, top, left);
                }
            }
        }
    };

    _this.getDrawingAreaMetrics = function() {

        /*
         *	Объект, определяющий max колонку и строчку для отрисовки объектов листа
         */

        var metrics = {
            maxCol: 0,
            maxRow: 0
        };

        for (var i = 0; aObjects && (i < aObjects.length); i++) {

            var drawingObject = aObjects[i];
            if ( drawingObject.to.col >= metrics.maxCol )
                metrics.maxCol = drawingObject.to.col + 1; // учитываем colOff
            if ( drawingObject.to.row >= metrics.maxRow )
                metrics.maxRow = drawingObject.to.row + 1; // учитываем rowOff
        }
        return metrics;
    };

    _this.clipGraphicsCanvas = function(canvas, graphicOption) {
        if ( canvas instanceof AscCommon.CGraphics ) {

            var x, y, w, h;

            if ( graphicOption ) {
                var updatedRange = graphicOption.getUpdatedRange();

                var offsetX = worksheet.cols[worksheet.getFirstVisibleCol(true)].left - worksheet.cellsLeft;
                var offsetY = worksheet.rows[worksheet.getFirstVisibleRow(true)].top - worksheet.cellsTop;

                var vr = worksheet.visibleRange;
                var borderOffsetX = (updatedRange.c1 <= vr.c1) ? 0 : 3;
                var borderOffsetY = (updatedRange.r1 <= vr.r1) ? 0 : 3;

                x = ptToPx(worksheet.getCellLeft(updatedRange.c1, 1) - offsetX) - borderOffsetX;
                y = ptToPx(worksheet.getCellTop(updatedRange.r1, 1) - offsetY) - borderOffsetY;
                w = worksheet.getCellLeft(updatedRange.c2, 0) - worksheet.getCellLeft(updatedRange.c1, 0) + 3;
                h = worksheet.getCellTop(updatedRange.r2, 0) - worksheet.getCellTop(updatedRange.r1, 0) + 3;

                /*canvas.m_oContext.beginPath();
                 canvas.m_oContext.strokeStyle = "#FF0000";
                 canvas.m_oContext.rect(x + 0.5, y + 0.5, w, h);
                 canvas.m_oContext.stroke();*/
            }
            else {
                x = worksheet.getCellLeft(0, 0);
                y = worksheet.getCellTop(0, 0);
                w = shapeCtx.m_lWidthPix - x;
                h = shapeCtx.m_lHeightPix - y;
            }

            canvas.m_oContext.save();
            canvas.m_oContext.beginPath();
            canvas.m_oContext.rect(x, y, w, h);
            canvas.m_oContext.clip();

            // этот сэйв нужен для восстановления сложных вложенных клипов
            canvas.m_oContext.save();
        }
    };

    _this.restoreGraphicsCanvas = function(canvas) {
        if ( canvas instanceof AscCommon.CGraphics ) {
            canvas.m_oContext.restore();

            // этот рестор нужен для восстановления сложных вложенных клипов
            canvas.m_oContext.restore();
        }
    };

    //-----------------------------------------------------------------------------------
    // For object type
    //-----------------------------------------------------------------------------------


    _this.calculateObjectMetrics = function (object, width, height) {
        // Обработка картинок большого разрешения
        var metricCoeff = 1;

        var coordsFrom = _this.coordsManager.calculateCoords(object.from);
        var realTopOffset = coordsFrom.y;
        var realLeftOffset = coordsFrom.x;

        var areaWidth = worksheet.getCellLeft(worksheet.getLastVisibleCol(), 0) - worksheet.getCellLeft(worksheet.getFirstVisibleCol(true), 0); 	// по ширине
        if (areaWidth < width) {
            metricCoeff = width / areaWidth;

            width = areaWidth;
            height /= metricCoeff;
        }

        var areaHeight = worksheet.getCellTop(worksheet.getLastVisibleRow(), 0) - worksheet.getCellTop(worksheet.getFirstVisibleRow(true), 0); 	// по высоте
        if (areaHeight < height) {
            metricCoeff = height / areaHeight;

            height = areaHeight;
            width /= metricCoeff;
        }

        var findVal = pxToPt(realLeftOffset + width);
        var toCell = worksheet.findCellByXY(findVal, 0, true, false, true);
        while (toCell.col === null && worksheet.cols.length < gc_nMaxCol) {
            worksheet.expandColsOnScroll(true);
            toCell = worksheet.findCellByXY(findVal, 0, true, false, true);
        }
        object.to.col = toCell.col;
        object.to.colOff = ptToMm(toCell.colOff);

        findVal = pxToPt(realTopOffset + height);
        toCell = worksheet.findCellByXY(0, findVal, true, true, false);
        while (toCell.row === null && worksheet.rows.length < gc_nMaxRow) {
            worksheet.expandRowsOnScroll(true);
            toCell = worksheet.findCellByXY(0, findVal, true, true, false);
        }
        object.to.row = toCell.row;
        object.to.rowOff = ptToMm(toCell.rowOff);

        worksheet.handlers.trigger("reinitializeScroll");
    };

    _this.addImageDrawingObject = function(imageUrl, options) {
        if (imageUrl && !_this.isViewerMode()) {

            var _image = api.ImageLoader.LoadImage(imageUrl, 1);
            var isOption = options && options.cell;



            var addImageObject = function (_image) {

                if (!_image.Image) {
                    worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
                } else {

                    var drawingObject = _this.createDrawingObject();
                    drawingObject.worksheet = worksheet;

                    var activeCell = worksheet.model.selectionRange.activeCell;
                    drawingObject.from.col = isOption ? options.cell.col : activeCell.col;
                    drawingObject.from.row = isOption ? options.cell.row : activeCell.row;

                    // Проверяем начальные координаты при вставке
                    while (!worksheet.cols[drawingObject.from.col]) {
                        worksheet.expandColsOnScroll(true);
                    }
                    worksheet.expandColsOnScroll(true); 	// для colOff

                    while (!worksheet.rows[drawingObject.from.row]) {
                        worksheet.expandRowsOnScroll(true);
                    }
                    worksheet.expandRowsOnScroll(true); 	// для rowOff

                    _this.calculateObjectMetrics(drawingObject, isOption ? options.width : _image.Image.width, isOption ? options.height : _image.Image.height);

                    var coordsFrom = _this.coordsManager.calculateCoords(drawingObject.from);
                    var coordsTo = _this.coordsManager.calculateCoords(drawingObject.to);

                    // CImage
                    _this.objectLocker.reset();
                    _this.objectLocker.addObjectId(AscCommon.g_oIdCounter.Get_NewId());
                    _this.objectLocker.checkObjects(function (bLock) {
                        if (bLock !== true)
                            return;
                        _this.controller.resetSelection();
                        _this.controller.addImageFromParams(_image.src, pxToMm(coordsFrom.x) + MOVE_DELTA, pxToMm(coordsFrom.y) + MOVE_DELTA, pxToMm(coordsTo.x - coordsFrom.x), pxToMm(coordsTo.y - coordsFrom.y));
                    });
                }

                worksheet.setSelectionShape(true);
            };

            if (null != _image) {
                addImageObject(_image);
            } else {
                _this.asyncImageEndLoaded = function (_image) {
                    addImageObject(_image);
                    _this.asyncImageEndLoaded = null;
                }
            }
        }
    };

    _this.addTextArt = function(nStyle)
    {
        if (!_this.isViewerMode()) {

            var oVisibleRange = worksheet.getVisibleRange();

            _this.objectLocker.reset();
            _this.objectLocker.addObjectId(AscCommon.g_oIdCounter.Get_NewId());
            _this.objectLocker.checkObjects(function (bLock) {
                if (bLock !== true)
                    return;
                _this.controller.resetSelection();
                var dLeft = worksheet.getCellLeft(oVisibleRange.c1, 3);
                var dTop = worksheet.getCellTop(oVisibleRange.r1, 3);
                var dRight = worksheet.getCellLeft(oVisibleRange.c2, 3) + worksheet.getColumnWidth(oVisibleRange.c2, 3);
                var dBottom = worksheet.getCellTop(oVisibleRange.r2, 3) + worksheet.getRowHeight(oVisibleRange.r2, 3);
                _this.controller.addTextArtFromParams(nStyle, dLeft, dTop, dRight - dLeft, dBottom - dTop, worksheet.model);
                worksheet.setSelectionShape(true);
            });
        }

    };

    _this.addMath = function(Type){
        if (!_this.isViewerMode() && _this.controller) {

            var oTargetContent = _this.controller.getTargetDocContent();
            if(oTargetContent){

                _this.controller.checkSelectedObjectsAndCallback(function(){
                    var MathElement = new AscCommonWord.MathMenu(Type);
                    _this.controller.paragraphAdd(MathElement, false);
                }, [], false, AscDFH.historydescription_Spreadsheet_CreateGroup);
                return;
            }
            var oVisibleRange = worksheet.getVisibleRange();

            _this.objectLocker.reset();
            _this.objectLocker.addObjectId(AscCommon.g_oIdCounter.Get_NewId());
            _this.objectLocker.checkObjects(function (bLock) {
                if (bLock !== true)
                    return;
                _this.controller.resetSelection();

                var activeCell = worksheet.model.selectionRange.activeCell;
                var dLeft = worksheet.getCellLeft(activeCell.col, 3);
                var dTop = worksheet.getCellTop(activeCell.row, 3);
                var dRight = worksheet.getCellLeft(oVisibleRange.c2, 3) + worksheet.getColumnWidth(oVisibleRange.c2, 3);
                var dBottom = worksheet.getCellTop(oVisibleRange.r2, 3) + worksheet.getRowHeight(oVisibleRange.r2, 3);



                var coordsFrom = _this.coordsManager.calculateCoords({col: activeCell.col, row: activeCell.row, colOff: 0, rowOff: 0});


                History.Create_NewPoint();
                var oTextArt = _this.controller.createTextArt(0, false, worksheet.model, "");
                _this.controller.resetSelection();
                oTextArt.setWorksheet(_this.controller.drawingObjects.getWorksheetModel());
                oTextArt.setDrawingObjects(_this.controller.drawingObjects);
                oTextArt.addToDrawingObjects();

                var oContent = oTextArt.getDocContent();
                if(oContent){
                    oContent.Cursor_MoveToStartPos(false);
                    oContent.Paragraph_Add(new AscCommonWord.MathMenu(Type), false);
                }
                oTextArt.checkExtentsByDocContent();
                oTextArt.spPr.xfrm.setOffX(pxToMm(coordsFrom.x) + MOVE_DELTA);
                oTextArt.spPr.xfrm.setOffY(pxToMm(coordsFrom.y) + MOVE_DELTA);

                oTextArt.checkDrawingBaseCoords();
                _this.controller.selectObject(oTextArt, 0);
                var oContent = oTextArt.getDocContent();
                _this.controller.selection.textSelection = oTextArt;
                oContent.Select_All();
                oTextArt.addToRecalculate();
                _this.controller.startRecalculate();
                worksheet.setSelectionShape(true);
            });
        }
    };


    _this.setMathProps = function(MathProps)
    {
        _this.controller.setMathProps(MathProps);
    }

    _this.editImageDrawingObject = function(imageUrl) {

        if ( imageUrl ) {
            var _image = api.ImageLoader.LoadImage(imageUrl, 1);

            var addImageObject = function (_image) {

                if ( !_image.Image ) {
                    worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
                }
                else {
                    if ( api.isImageChangeUrl ) {
                        var imageProp = new Asc.asc_CImgProperty();
                        imageProp.ImageUrl = _image.src;
                        _this.setGraphicObjectProps(imageProp);
                        api.isImageChangeUrl = false;
                    }
                    else if ( api.isShapeImageChangeUrl ) {
                        var imgProps = new Asc.asc_CImgProperty();
                        var shapeProp = new Asc.asc_CShapeProperty();
                        imgProps.ShapeProperties = shapeProp;
                        shapeProp.fill = new Asc.asc_CShapeFill();
                        shapeProp.fill.type = Asc.c_oAscFill.FILL_TYPE_BLIP;
                        shapeProp.fill.fill = new Asc.asc_CFillBlip();
                        shapeProp.fill.fill.asc_putUrl(_image.src);
                        _this.setGraphicObjectProps(imgProps);
                        api.isShapeImageChangeUrl = false;
                    }
                    else if(api.isTextArtChangeUrl)
                    {

                        var imgProps = new Asc.asc_CImgProperty();
                        var AscShapeProp = new Asc.asc_CShapeProperty();
                        imgProps.ShapeProperties = AscShapeProp;
                        var oFill = new Asc.asc_CShapeFill();
                        oFill.type = Asc.c_oAscFill.FILL_TYPE_BLIP;
                        oFill.fill = new Asc.asc_CFillBlip();
                        oFill.fill.asc_putUrl(imageUrl);
                        AscShapeProp.textArtProperties = new Asc.asc_TextArtProperties();
                        AscShapeProp.textArtProperties.asc_putFill(oFill);
                        _this.setGraphicObjectProps(imgProps);
                        api.isTextArtChangeUrl = false;
                    }

                    _this.showDrawingObjects(true);
                }
            };

            if (null != _image) {
                addImageObject(_image);
            }
            else {
                _this.asyncImageEndLoaded = function(_image) {
                    addImageObject(_image);
                    _this.asyncImageEndLoaded = null;
                }
            }
        }
    };

    _this.addChartDrawingObject = function(chart) {

        if ( _this.isViewerMode() )
            return;

        worksheet.setSelectionShape(true);

        if ( chart instanceof AscCommon.asc_ChartSettings )
        {
            if(api.isChartEditor)
            {
				_this.controller.selectObject(aObjects[0].graphicObject, 0);
				_this.controller.editChartDrawingObjects(chart);
                return;
            }

            _this.objectLocker.reset();
            _this.objectLocker.addObjectId(AscCommon.g_oIdCounter.Get_NewId());
            _this.objectLocker.checkObjects(function(bLock){
                if(bLock)
                {
                    _this.controller.addChartDrawingObject(chart);
                }
            });
        }
        else if ( isObject(chart) && chart["binary"] )
        {
            for (var i = 0; i < aObjects.length; i++) {
                aObjects[i].graphicObject.deleteDrawingBase();
            }
            var listRange = new AscCommonExcel.Range(worksheet.model, 0, 0, worksheet.nRowsCount - 1, worksheet.nColsCount - 1);
            listRange.cleanAll();
            worksheet._clean();
            History.Clear();

            History.TurnOff();
            aObjects.length = 0;
            var listRange = new AscCommonExcel.Range(worksheet.model, 0, 0, worksheet.nRowsCount - 1, worksheet.nColsCount - 1);
            listRange.cleanAll();
            worksheet.endEditChart();
            var asc_chart_binary = new Asc.asc_CChartBinary();
            asc_chart_binary.asc_setBinary(chart["binary"]);
            asc_chart_binary.asc_setThemeBinary(chart["themeBinary"]);
            asc_chart_binary.asc_setColorMapBinary(chart["colorMapBinary"]);
            var oNewChartSpace = asc_chart_binary.getChartSpace(worksheet.model);
            var theme = asc_chart_binary.getTheme();
            if(theme)
            {
                worksheet.model.workbook.theme = theme;
            }
            var colorMapOverride = asc_chart_binary.getColorMap();
            if(colorMapOverride)
            {
                AscFormat.DEFAULT_COLOR_MAP = colorMapOverride;
            }

            if(typeof chart["urls"] === "string") {
                AscCommon.g_oDocumentUrls.addUrls(JSON.parse(chart["urls"]));
            }
            var font_map = {};
            oNewChartSpace.documentGetAllFontNames(font_map);
            AscFormat.checkThemeFonts(font_map, worksheet.model.workbook.theme.themeElements.fontScheme);
            window["Asc"]["editor"]._loadFonts(font_map,
                function()
                {
                    var max_r = 0, max_c = 0;

                    var series = oNewChartSpace.chart.plotArea.charts[0].series, ser;
					
					function fFillCell(oCell, sNumFormat, value)
					{
						var oCellValue = new AscCommonExcel.CCellValue();
						if(AscFormat.isRealNumber(value))
						{
							oCellValue.number = value;
							oCellValue.type = AscCommon.CellValueType.Number;
						}
						else
						{
							oCellValue.text = value;
							oCellValue.type = AscCommon.CellValueType.String;
						}
						oCell.setNumFormat(sNumFormat);
						oCell.setValueData(new AscCommonExcel.UndoRedoData_CellValueData(null, oCellValue));
					}
					
                    function fillTableFromRef(ref)
                    {
                        var cache = ref.numCache ? ref.numCache : (ref.strCache ? ref.strCache : null);
                        var lit_format_code;
                        var bNum = AscCommon.isRealObject(ref.numCache);
                        var sValue = "";
                        if(cache)
                        {

                            if(typeof cache.formatCode === "string" && cache.formatCode.length > 0)
                            {
                                lit_format_code = cache.formatCode;
                            }
                            else
                            {
                                lit_format_code = "General"
                            }
                            var sFormula = ref.f + "";
                            if(sFormula[0] === '(')
                                sFormula = sFormula.slice(1);
                            if(sFormula[sFormula.length-1] === ')')
                                sFormula = sFormula.slice(0, -1);
                            var f1 = sFormula;

                            var arr_f = f1.split(",");
                            var pt_index = 0, i, j, cell, pt, nPtCount, k;
                            for(i = 0; i < arr_f.length; ++i)
                            {
                                var parsed_ref = parserHelp.parse3DRef(arr_f[i]);
                                if(parsed_ref)
                                {
                                    var source_worksheet = worksheet.model.workbook.getWorksheetByName(parsed_ref.sheet);
                                    if(source_worksheet === worksheet.model)
                                    {
                                        var range1 = source_worksheet.getRange2(parsed_ref.range);
                                        if(range1)
                                        {
                                            var range = range1.bbox;
                                            while ( worksheet.cols.length < range.c2 ) {
                                                worksheet.expandColsOnScroll(true);
                                            }
                                            while ( worksheet.rows.length < range.r2 ) {
                                                worksheet.expandRowsOnScroll(true);
                                            }

                                            if(range.r1 > max_r)
                                                max_r = range.r1;
                                            if(range.r2 > max_r)
                                                max_r = range.r2;

                                            if(range.c1 > max_c)
                                                max_c = range.c1;
                                            if(range.c2 > max_c)
                                                max_c = range.c2;

                                            if(i === arr_f.length - 1)
                                            {
                                                nPtCount = cache.getPtCount();
                                                if((nPtCount - pt_index) <=(range.r2 - range.r1 + 1))
                                                {
                                                    for(k = range.c1; k <= range.c2; ++k)
                                                    {
                                                        for(j = range.r1; j <= range.r2; ++j)
                                                        {
                                                            cell = source_worksheet._getCell(j, k);
                                                            pt = cache.getPtByIndex(pt_index + j - range.r1);
                                                            if(pt)
                                                            {
																fFillCell(cell, typeof pt.formatCode === "string" && pt.formatCode.length > 0 ? pt.formatCode : lit_format_code, pt.val);
                                                            }
                                                        }
                                                    }
                                                    pt_index += (range.r2 - range.r1 + 1);
                                                }
                                                else if((nPtCount - pt_index) <= (range.c2 - range.c1 + 1))
                                                {
                                                    for(k = range.r1; k <= range.r2; ++k)
                                                    {
                                                        for(j = range.c1;  j <= range.c2; ++j)
                                                        {
                                                            cell = source_worksheet._getCell(k, j);
                                                            pt = cache.getPtByIndex(pt_index + j - range.c1);
                                                            if(pt)
                                                            {
																fFillCell(cell, typeof pt.formatCode === "string" && pt.formatCode.length > 0 ? pt.formatCode : lit_format_code, pt.val);																
                                                            }
                                                        }
                                                    }
                                                    pt_index += (range.c2 - range.c1 + 1);
                                                }
                                            }
                                            else
                                            {
                                                if(range.r1 === range.r2)
                                                {
                                                    for(j = range.c1;  j <= range.c2; ++j)
                                                    {
                                                        cell = source_worksheet._getCell(range.r1, j);
                                                        pt = cache.getPtByIndex(pt_index);
                                                        if(pt)
                                                        {
															fFillCell(cell, typeof pt.formatCode === "string" && pt.formatCode.length > 0 ? pt.formatCode : lit_format_code, pt.val);														
                                                        }
                                                        ++pt_index;
                                                    }
                                                }
                                                else
                                                {
                                                    for(j = range.r1; j <= range.r2; ++j)
                                                    {
                                                        cell = source_worksheet._getCell(j, range.c1);
                                                        pt = cache.getPtByIndex(pt_index);
                                                        if(pt)
                                                        {
															fFillCell(cell, typeof pt.formatCode === "string" && pt.formatCode.length > 0 ? pt.formatCode : lit_format_code, pt.val);	
                                                        }
                                                        ++pt_index;
                                                    }
                                                }

                                            }
                                        }
                                    }
                                }
                            }
                        }


                    }

                    var first_num_ref;
                    if(series[0])
                    {
                        if(series[0].val)
                            first_num_ref = series[0].val.numRef;
                        else if(series[0].yVal)
                            first_num_ref = series[0].yVal.numRef;
                    }
                    if(first_num_ref)
                    {
                        var resultRef = parserHelp.parse3DRef(first_num_ref.f);
                        if(resultRef)
                        {
                            worksheet.model.workbook.aWorksheets[0].sName = resultRef.sheet;
                            if(series[0] && series[0].xVal && series[0].xVal.numRef)
                            {
                                fillTableFromRef(series[0].xVal.numRef);
                            }
                            if(series[0].cat && series[0].cat.strRef)
                            {
                                fillTableFromRef(series[0].cat.strRef);
                            }
                            for(var i = 0; i < series.length; ++i)
                            {
                                ser = series[i];
                                if(ser.val && ser.val.numRef)
                                {
                                    fillTableFromRef(ser.val.numRef);
                                }
                                if(ser.yVal && ser.yVal.numRef)
                                {
                                    fillTableFromRef(ser.yVal.numRef);
                                }
                                if(ser.cat && ser.cat.numRef)
                                {
                                    fillTableFromRef(ser.cat.numRef);
                                }
                                if(ser.cat && ser.cat.strRef)
                                {
                                    fillTableFromRef(ser.cat.strRef);
                                }
                                if(ser.tx && ser.tx.strRef)
                                {
                                    fillTableFromRef(ser.tx.strRef);
                                }
                            }
                        }
                    }
                    worksheet._updateCellsRange(new asc_Range(0, 0, Math.max(worksheet.nColsCount - 1, max_c),  Math.max(worksheet.nRowsCount - 1, max_r)));
                    aImagesSync.length = 0;
                    oNewChartSpace.getAllRasterImages(aImagesSync);
                    oNewChartSpace.setBDeleted(false);
                    oNewChartSpace.setWorksheet(worksheet.model);
                    oNewChartSpace.addToDrawingObjects();
                    oNewChartSpace.recalcInfo.recalculateReferences = false;
                    oNewChartSpace.recalculate();
                    AscFormat.CheckSpPrXfrm(oNewChartSpace);

                    var canvas_height = worksheet.drawingCtx.getHeight(3);
                    var pos_y = (canvas_height - oNewChartSpace.spPr.xfrm.extY)/2;
                    if(pos_y < 0)
                    {
                        pos_y = 0;
                    }

                    var canvas_width = worksheet.drawingCtx.getWidth(3);
                    var pos_x = (canvas_width - oNewChartSpace.spPr.xfrm.extX)/2;
                    if(pos_x < 0)
                    {
                        pos_x = 0;
                    }
                    oNewChartSpace.spPr.xfrm.setOffX(pos_x);
                    oNewChartSpace.spPr.xfrm.setOffY(pos_y);
                    oNewChartSpace.checkDrawingBaseCoords();
                    oNewChartSpace.recalculate();
                    var d = worksheet._calcActiveCellOffset(_this.getSelectedDrawingsRange());
                    window["Asc"]["editor"].wb.controller.scroll(d);
                    _this.showDrawingObjects(false);
                    _this.controller.resetSelection();
                    _this.controller.selectObject(oNewChartSpace, 0);
                    _this.controller.updateSelectionState();
                    _this.sendGraphicObjectProps();
                    History.TurnOn();
                    if(aImagesSync.length > 0)
                    {
                        window["Asc"]["editor"].ImageLoader.LoadDocumentImages(aImagesSync, null, function(){_this.showDrawingObjects(true)});
                    }
                });


        }
    };

    _this.editChartDrawingObject = function(chart)
    {
        if ( chart )
        {
            if(api.isChartEditor)
            {
				_this.controller.selectObject(aObjects[0].graphicObject, 0);
            }
            _this.controller.editChartDrawingObjects(chart);
            _this.showDrawingObjects(false);
        }
    };

    _this.checkSparklineGroupMinMaxVal = function(oSparklineGroup)
    {
        var maxVal = null, minVal = null, i, j;
        if(oSparklineGroup.type !== Asc.c_oAscSparklineType.Stacked &&
            (Asc.c_oAscSparklineAxisMinMax.Group === oSparklineGroup.minAxisType || Asc.c_oAscSparklineAxisMinMax.Group === oSparklineGroup.maxAxisType))
        {
            for(i = 0; i < oSparklineGroup.arrSparklines.length; ++i)
            {
                if (!oSparklineGroup.arrCachedSparklines[i]) {
                    var oSparklineView = new CSparklineView();
                    oSparklineView.initFromSparkline(oSparklineGroup.arrSparklines[i], oSparklineGroup, worksheet);
                    oSparklineGroup.addView(oSparklineView, i);
                }
                var aPoints = AscFormat.getPtsFromSeries(oSparklineGroup.arrCachedSparklines[i].chartSpace.chart.plotArea.charts[0].series[0]);
                for(j = 0; j < aPoints.length; ++j)
                {
                    if(Asc.c_oAscSparklineAxisMinMax.Group === oSparklineGroup.maxAxisType)
                    {
                        if(maxVal === null)
                        {
                            maxVal = aPoints[j].val;
                        }
                        else
                        {
                            if(maxVal < aPoints[j].val)
                            {
                                maxVal = aPoints[j].val;
                            }
                        }
                    }
                    if(Asc.c_oAscSparklineAxisMinMax.Group === oSparklineGroup.minAxisType)
                    {
                        if(minVal === null)
                        {
                            minVal = aPoints[j].val;
                        }
                        else
                        {
                            if(minVal > aPoints[j].val)
                            {
                                minVal = aPoints[j].val;
                            }
                        }
                    }
                }
            }
            if(maxVal !== null || minVal !== null)
            {
                for(i = 0; i < oSparklineGroup.arrSparklines.length; ++i)
                {
                    oSparklineGroup.arrCachedSparklines[i].setMinMaxValAx(minVal, maxVal, oSparklineGroup);
                }
            }
        }
    };

    _this.drawSparkLineGroups = function(oDrawingContext, aSparklineGroups, range, offsetX, offsetY)
    {

        var graphics, i, j;
        if(oDrawingContext instanceof AscCommonExcel.CPdfPrinter)
        {
            graphics = oDrawingContext.DocumentRenderer;
        }
        else
        {
            graphics = new AscCommon.CGraphics();
            graphics.init(oDrawingContext.ctx, oDrawingContext.getWidth(0), oDrawingContext.getHeight(0),
                oDrawingContext.getWidth(3)*nSparklineMultiplier, oDrawingContext.getHeight(3)*nSparklineMultiplier);
            graphics.m_oFontManager = AscCommon.g_fontManager;
        }

        var _offX = offsetX* Asc.getCvtRatio(1, 3, oDrawingContext.getPPIX());
        var _offY = offsetY* Asc.getCvtRatio(1, 3, oDrawingContext.getPPIY());
        for(i = 0; i < aSparklineGroups.length; ++i) {
            var oSparklineGroup = aSparklineGroups[i];

            if(oSparklineGroup.type !== Asc.c_oAscSparklineType.Stacked &&
                (Asc.c_oAscSparklineAxisMinMax.Group === oSparklineGroup.minAxisType || Asc.c_oAscSparklineAxisMinMax.Group === oSparklineGroup.maxAxisType))
            {
                _this.checkSparklineGroupMinMaxVal(oSparklineGroup);
            }
            for(j = 0; j < oSparklineGroup.arrSparklines.length; ++j) {
                if (!oSparklineGroup.arrCachedSparklines[j]) {
                    var oSparklineView = new CSparklineView();
                    oSparklineView.initFromSparkline(oSparklineGroup.arrSparklines[j], oSparklineGroup, worksheet);
                    oSparklineGroup.addView(oSparklineView, j);
                }
                if (!oSparklineGroup.arrSparklines[j].checkInRange(range)) {
                    continue;
                }

                if(oDrawingContext instanceof AscCommonExcel.CPdfPrinter)
                {
                    graphics.SaveGrState();
                    var _baseTransform = new AscCommon.CMatrix();
                    _baseTransform.sx /= nSparklineMultiplier;
                    _baseTransform.sy /= nSparklineMultiplier;

                    graphics.SetBaseTransform(_baseTransform);
                }

                oSparklineGroup.arrCachedSparklines[j].draw(graphics, _offX, _offY);

                if(oDrawingContext instanceof AscCommonExcel.CPdfPrinter)
                {
                    graphics.SetBaseTransform(null);
                    graphics.RestoreGrState();
                }
            }
        }
        if(oDrawingContext instanceof AscCommonExcel.CPdfPrinter)
        {
        }
        else
        {
            oDrawingContext.restore();
        }
    };

    _this.rebuildChartGraphicObjects = function(data)
    {
        if(!worksheet)
            return;
        AscFormat.ExecuteNoHistory(function(){
            var i;
            var wsViews = Asc["editor"].wb.wsViews;
            var changedArr = [];
            if(data.changedRange)
            {
                changedArr.push(new BBoxInfo(worksheet.model, asc_Range(data.changedRange.c1, data.changedRange.r1, data.changedRange.c2, data.changedRange.r2)))
            }
            if(data.added)
            {
                changedArr.push(new BBoxInfo(worksheet.model, asc_Range(data.added.c1, data.added.r1, gc_nMaxCol, gc_nMaxRow)))
            }

            if(data.hided)
            {
                changedArr.push(new BBoxInfo(worksheet.model, asc_Range(data.hided.c1, data.hided.r1, data.hided.c2, data.hided.r2)))
            }

            if(data.removed)
            {
                changedArr.push(new BBoxInfo(worksheet.model, asc_Range(data.removed.c1, data.removed.r1, gc_nMaxCol, gc_nMaxRow)))
            }
            if(Array.isArray(data.arrChanged))
            {
                for(i = 0; i < data.arrChanged.length; ++i)
                {
                    changedArr.push(new BBoxInfo(worksheet.model, asc_Range(data.arrChanged[i].c1, data.arrChanged[i].r1, data.arrChanged[i].c2, data.arrChanged[i].r2)))
                }
            }

            for(i = 0; i < wsViews.length; ++i)
            {
                if(wsViews[i] && wsViews[i].objectRender)
                {
                    wsViews[i].objectRender.rebuildCharts(changedArr);
                    wsViews[i].objectRender.recalculate(true);
                }
            }
        }, _this, []);


    };

    _this.pushToAObjects = function(aDrawing)
    {
        aObjects = [];
        for(var i = 0; i < aDrawing.length; ++i)
        {
            aObjects.push(aDrawing[i]);
        }
    };

    _this.rebuildCharts = function(data)
    {
        for(var i = 0; i < aObjects.length; ++i)
        {
            if(aObjects[i].graphicObject.rebuildSeries)
            {
                aObjects[i].graphicObject.rebuildSeries(data);
            }
        }
    };

    _this.updateDrawingObject = function(bInsert, operType, updateRange) {

        if(!History.Is_On())
            return;

        var metrics = null;
		var count, bNeedRedraw = false, offset;
       //this.controller.checkObjectsAndCallback(
       //    function()
       //    {
            for (var i = 0; i < aObjects.length; i++)
            {
                var obj = aObjects[i];
                    metrics = { from: {}, to: {} };
                    metrics.from.col = obj.from.col; metrics.to.col = obj.to.col;
                    metrics.from.colOff = obj.from.colOff; metrics.to.colOff = obj.to.colOff;
                    metrics.from.row = obj.from.row; metrics.to.row = obj.to.row;
                    metrics.from.rowOff = obj.from.rowOff; metrics.to.rowOff = obj.to.rowOff;

                    if (bInsert)
                    {		// Insert
                        switch (operType)
                        {
                            case c_oAscInsertOptions.InsertColumns:
                            {
                                count = updateRange.c2 - updateRange.c1 + 1;
                                // Position
                                if (updateRange.c1 <= obj.from.col) {
                                    metrics.from.col += count;
                                    metrics.to.col += count;
                                }
                                else if ((updateRange.c1 > obj.from.col) && (updateRange.c1 <= obj.to.col)) {
                                    metrics.to.col += count;
                                }
                                else
                                    metrics = null;

                            }
                                break;
                            case c_oAscInsertOptions.InsertCellsAndShiftRight:

                                break;

                            case c_oAscInsertOptions.InsertRows:
                            {
                                // Position
                                count = updateRange.r2 - updateRange.r1 + 1;

                                if (updateRange.r1 <= obj.from.row) {
                                    metrics.from.row += count;
                                    metrics.to.row += count;
                                }
                                else if ((updateRange.r1 > obj.from.row) && (updateRange.r1 <= obj.to.row)) {
                                    metrics.to.row += count;
                                }
                                else
                                    metrics = null;
                            }
                                break;
                            case c_oAscInsertOptions.InsertCellsAndShiftDown:

                                break;
                        }
                    }
                    else {				// Delete
                        switch (operType)
                        {
                            case c_oAscDeleteOptions.DeleteColumns:
                            {

                                // Position
                                count = updateRange.c2 - updateRange.c1 + 1;

                                if (updateRange.c1 <= obj.from.col) {

                                    // outside
                                    if (updateRange.c2 < obj.from.col) {
                                        metrics.from.col -= count;
                                        metrics.to.col -= count;
                                    }
                                    // inside
                                    else {
                                        metrics.from.col = updateRange.c1;
                                        metrics.from.colOff = 0;

                                        offset = 0;
                                        if (obj.to.col - updateRange.c2 - 1 > 0)
                                            offset = obj.to.col - updateRange.c2 - 1;
                                        else {
                                            offset = 1;
                                            metrics.to.colOff = 0;
                                        }
                                        metrics.to.col = metrics.from.col + offset;
                                    }
                                }

                                else if ((updateRange.c1 > obj.from.col) && (updateRange.c1 <= obj.to.col)) {

                                    // outside
                                    if (updateRange.c2 >= obj.to.col) {
                                        metrics.to.col = updateRange.c1;
                                        metrics.to.colOff = 0;
                                    }
                                    else
                                        metrics.to.col -= count;
                                }
                                else
                                    metrics = null;


                            }
                                break;
                            case c_oAscDeleteOptions.DeleteCellsAndShiftLeft:
                                // Range

                                break;

                            case c_oAscDeleteOptions.DeleteRows:
                            {

                                // Position
                                count = updateRange.r2 - updateRange.r1 + 1;

                                if (updateRange.r1 <= obj.from.row) {

                                    // outside
                                    if (updateRange.r2 < obj.from.row) {
                                        metrics.from.row -= count;
                                        metrics.to.row -= count;
                                    }
                                    // inside
                                    else {
                                        metrics.from.row = updateRange.r1;
                                        metrics.from.colOff = 0;

                                        offset = 0;
                                        if (obj.to.row - updateRange.r2 - 1 > 0)
                                            offset = obj.to.row - updateRange.r2 - 1;
                                        else {
                                            offset = 1;
                                            metrics.to.colOff = 0;
                                        }
                                        metrics.to.row = metrics.from.row + offset;
                                    }
                                }

                                else if ((updateRange.r1 > obj.from.row) && (updateRange.r1 <= obj.to.row)) {

                                    // outside
                                    if (updateRange.r2 >= obj.to.row) {
                                        metrics.to.row = updateRange.r1;
                                        metrics.to.colOff = 0;
                                    }
                                    else
                                        metrics.to.row -= count;
                                }
                                else
                                    metrics = null;

                            }
                                break;
                            case c_oAscDeleteOptions.DeleteCellsAndShiftTop:
                                // Range

                                break;
                        }
                    }

                    // Normalize position
                    if (metrics)
                    {
                        if (metrics.from.col < 0)
                        {
                            metrics.from.col = 0;
                            metrics.from.colOff = 0;
                        }

                        if (metrics.to.col <= 0) {
                            metrics.to.col = 1;
                            metrics.to.colOff = 0;
                        }

                        if (metrics.from.row < 0) {
                            metrics.from.row = 0;
                            metrics.from.rowOff = 0;
                        }

                        if (metrics.to.row <= 0) {
                            metrics.to.row = 1;
                            metrics.to.rowOff = 0;
                        }

                        if (metrics.from.col == metrics.to.col) {
                            metrics.to.col++;
                            metrics.to.colOff = 0;
                        }
                        if (metrics.from.row == metrics.to.row) {
                            metrics.to.row++;
                            metrics.to.rowOff = 0;
                        }

                        /*obj.from.col = metrics.from.col;
                        obj.from.colOff = metrics.from.colOff;
                        obj.from.row = metrics.from.row;
                        obj.from.rowOff = metrics.from.rowOff;

                        obj.to.col = metrics.to.col;
                        obj.to.colOff = metrics.to.colOff;
                        obj.to.row = metrics.to.row;
                        obj.to.rowOff = metrics.to.rowOff;
                        */

                        var coords = _this.coordsManager.calculateCoords(metrics.from);


                        var rot = AscFormat.isRealNumber(obj.graphicObject.spPr.xfrm.rot) ? obj.graphicObject.spPr.xfrm.rot : 0;
                        rot = AscFormat.normalizeRotate(rot);
                        if (AscFormat.checkNormalRotate(rot))
                        {
                            obj.graphicObject.spPr.xfrm.setOffX(pxToMm(coords.x));
                            obj.graphicObject.spPr.xfrm.setOffY(pxToMm(coords.y));
                        }
                        else
                        {
                            obj.graphicObject.spPr.xfrm.setOffX(pxToMm(coords.x) - obj.graphicObject.spPr.xfrm.extX/2 + obj.graphicObject.spPr.xfrm.extY/2);
                            obj.graphicObject.spPr.xfrm.setOffY(pxToMm(coords.y) - obj.graphicObject.spPr.xfrm.extY/2 + obj.graphicObject.spPr.xfrm.extX/2);
                        }
                        obj.graphicObject.checkDrawingBaseCoords();
                        obj.graphicObject.recalculate();
                        bNeedRedraw = true;
                    }
                }

        //    },  []);
        bNeedRedraw && _this.showDrawingObjects(true);
    };


    _this.updateSizeDrawingObjects = function(target, bNoChangeCoords) {

        if(!History.Is_On() || true === bNoChangeCoords){
            if (target.target === AscCommonExcel.c_oTargetType.RowResize) {
                for (i = 0; i < aObjects.length; i++) {
                    drawingObject = aObjects[i];
                    if (drawingObject.from.row >= target.row) {
                        if(drawingObject.graphicObject){
                            if(drawingObject.graphicObject.recalculateTransform){
                                drawingObject.graphicObject.recalculateTransform();
                            }
                            if(drawingObject.graphicObject.recalculateBounds){
                                drawingObject.graphicObject.recalculateBounds();
                            }
                        }
                    }
                }
            } else {
                for (i = 0; i < aObjects.length; i++) {
                    drawingObject = aObjects[i];
                    if (drawingObject.from.col >= target.col) {
                        if(drawingObject.graphicObject){
                            if(drawingObject.graphicObject.recalculateTransform){
                                drawingObject.graphicObject.recalculateTransform();
                            }
                            if(drawingObject.graphicObject.recalculateBounds){
                                drawingObject.graphicObject.recalculateBounds();
                            }
                        }
                    }
                }
            }
            return;
        }

        var i, bNeedRecalc = false, drawingObject, coords;
        if (target.target === AscCommonExcel.c_oTargetType.RowResize) {
            for (i = 0; i < aObjects.length; i++) {
                drawingObject = aObjects[i];

                if (drawingObject.from.row >= target.row) {
                    coords = _this.coordsManager.calculateCoords(drawingObject.from);
                    AscFormat.CheckSpPrXfrm(drawingObject.graphicObject);

                    var rot = AscFormat.isRealNumber(drawingObject.graphicObject.spPr.xfrm.rot) ? drawingObject.graphicObject.spPr.xfrm.rot : 0;
                    rot = AscFormat.normalizeRotate(rot);
                    if (AscFormat.checkNormalRotate(rot)) {
                        drawingObject.graphicObject.spPr.xfrm.setOffX(pxToMm(coords.x));
                        drawingObject.graphicObject.spPr.xfrm.setOffY(pxToMm(coords.y));
                    } else {
                        drawingObject.graphicObject.spPr.xfrm.setOffX(pxToMm(coords.x) - drawingObject.graphicObject.spPr.xfrm.extX / 2 + drawingObject.graphicObject.spPr.xfrm.extY / 2);
                        drawingObject.graphicObject.spPr.xfrm.setOffY(pxToMm(coords.y) - drawingObject.graphicObject.spPr.xfrm.extY / 2 + drawingObject.graphicObject.spPr.xfrm.extX / 2);
                    }
                    drawingObject.graphicObject.checkDrawingBaseCoords();
                    bNeedRecalc = true;
                }
            }
        } else {
            for (i = 0; i < aObjects.length; i++) {
                drawingObject = aObjects[i];

                if (drawingObject.from.col >= target.col) {
                    coords = _this.coordsManager.calculateCoords(drawingObject.from);
                    AscFormat.CheckSpPrXfrm(drawingObject.graphicObject);

                    var rot = AscFormat.isRealNumber(drawingObject.graphicObject.spPr.xfrm.rot) ? drawingObject.graphicObject.spPr.xfrm.rot : 0;
                    rot = AscFormat.normalizeRotate(rot);
                    if (AscFormat.checkNormalRotate(rot)) {
                        drawingObject.graphicObject.spPr.xfrm.setOffX(pxToMm(coords.x));
                        drawingObject.graphicObject.spPr.xfrm.setOffY(pxToMm(coords.y));
                    } else {
                        drawingObject.graphicObject.spPr.xfrm.setOffX(pxToMm(coords.x) - drawingObject.graphicObject.spPr.xfrm.extX / 2 + drawingObject.graphicObject.spPr.xfrm.extY / 2);
                        drawingObject.graphicObject.spPr.xfrm.setOffY(pxToMm(coords.y) - drawingObject.graphicObject.spPr.xfrm.extY / 2 + drawingObject.graphicObject.spPr.xfrm.extX / 2);
                    }

                    drawingObject.graphicObject.checkDrawingBaseCoords();
                    bNeedRecalc = true;
                }
            }
        }
        if (bNeedRecalc) {
            _this.controller.recalculate2();
            _this.showDrawingObjects(true);
        }
    };


    _this.moveRangeDrawingObject = function(oBBoxFrom, oBBoxTo) {

        if ( oBBoxFrom && oBBoxTo )
        {
            var selected_objects = _this.controller.selection.groupSelection ? _this.controller.selection.groupSelection.selectedObjects : _this.controller.selectedObjects;
            var chart;
            if(selected_objects.length === 1 && selected_objects[0].getObjectType() === AscDFH.historyitem_type_ChartSpace)
            {
                chart = selected_objects[0];
            }
            var object_to_check  = _this.controller.selection.groupSelection ? _this.controller.selection.groupSelection : chart;

            if(chart && !(!chart.bbox || !chart.bbox.seriesBBox || oBBoxTo.isEqual(chart.bbox.seriesBBox)))
            {
                var editChart = function (drawingObject)
                {
					var options = new AscCommon.asc_ChartSettings();
					var catHeadersBBox, serHeadersBBox;
                    var final_bbox = oBBoxTo.clone();
                    if(chart.bbox.seriesBBox.bVert)
                    {
						options.putInColumns(false);
                        if(chart.bbox.catBBox && chart.bbox.catBBox.r1 === chart.bbox.catBBox.r2 && oBBoxTo.r1 > chart.bbox.catBBox.r1)
                        {
							catHeadersBBox = {
                                r1: chart.bbox.catBBox.r1,
                                r2: chart.bbox.catBBox.r1,
                                c1: oBBoxTo.c1,
                                c2: oBBoxTo.c2
                            };
                        }


                        if(chart.bbox.serBBox && chart.bbox.serBBox && chart.bbox.serBBox.c1 === chart.bbox.serBBox.c2 && chart.bbox.serBBox.c1 < oBBoxTo.c1)
                        {
                            serHeadersBBox = {
                                r1: oBBoxTo.r1,
                                r2: oBBoxTo.r2,
                                c1: chart.bbox.serBBox.c1,
                                c2: chart.bbox.serBBox.c2
                            };
                        }
                      //
                      //  if(chart.bbox.catBBox && oBBoxTo.r1 === chart.bbox.seriesBBox.r1)
                      //  {
                      //      --final_bbox.r1;
                      //  }
                      //  if(chart.bbox.serBBox && oBBoxTo.c1 === chart.bbox.seriesBBox.c1)
                      //  {
                      //      --final_bbox.c1;
                      //  }
                    }
                    else
                    {
						options.putInColumns(true);

                        if(chart.bbox.catBBox && chart.bbox.catBBox.c1 === chart.bbox.catBBox.c2 && oBBoxTo.c1 > chart.bbox.catBBox.c1)
                        {
                            catHeadersBBox = {
                                r1: oBBoxTo.r1,
                                r2: oBBoxTo.r2,
                                c1: chart.bbox.catBBox.c1,
                                c2: chart.bbox.catBBox.c2
                            };
                        }


                        if(chart.bbox.serBBox && chart.bbox.serBBox && chart.bbox.serBBox.r1 === chart.bbox.serBBox.r2 && chart.bbox.serBBox.r1 < oBBoxTo.r1)
                        {
                            serHeadersBBox = {
                                r1: chart.bbox.serBBox.r1,
                                r2: chart.bbox.serBBox.r2,
                                c1: oBBoxTo.c1,
                                c2: oBBoxTo.c2
                            };
                        }


                        //if(chart.bbox.catBBox && oBBoxTo.c1 === chart.bbox.seriesBBox.c1)
                        //{
                        //    --final_bbox.c1;
                        //}
                        //if(chart.bbox.serBBox && oBBoxTo.r1 === chart.bbox.seriesBBox.r1)
                        //{
                        //    --final_bbox.r1;
                        //}
                    }

                    var startCell = new AscCommon.CellAddress(final_bbox.r1, final_bbox.c1, 0);
                    var endCell = new AscCommon.CellAddress(final_bbox.r2, final_bbox.c2, 0);


                    if (startCell && endCell)
                    {
                        var sStartCellId = startCell.getIDAbsolute(), sEndCellId = endCell.getIDAbsolute();
						options.range = parserHelp.get3DRef(worksheet.model.sName,
                            sStartCellId === sEndCellId ? sStartCellId :
                                sStartCellId + ':' + sEndCellId);
                    }
					var chartSeries = AscFormat.getChartSeries(worksheet.model, options, catHeadersBBox, serHeadersBBox);
					drawingObject.rebuildSeriesFromAsc(chartSeries);
                    _this.controller.startRecalculate();
                    _this.sendGraphicObjectProps();
                };
                var callbackCheck = function (result) {
                    if(result)
                    {
                        History.Create_NewPoint(AscDFH.historydescription_ChartDrawingObjects);
                        editChart(chart);
                        _this.showDrawingObjects(true);
                    }
                    else
                    {
                        _this.selectDrawingObjectRange(chart);
                    }
                };
                _this.objectLocker.reset();
                _this.objectLocker.addObjectId(object_to_check.Get_Id());
                _this.objectLocker.checkObjects(callbackCheck);
            }
        }
    };

    //-----------------------------------------------------------------------------------
    // Chart
    //-----------------------------------------------------------------------------------

    _this.updateChartReferences = function(oldWorksheet, newWorksheet, bNoRedraw)
    {
        AscFormat.ExecuteNoHistory(function(){
            for (var i = 0; i < aObjects.length; i++) {
                var graphicObject = aObjects[i].graphicObject;
                if ( graphicObject.updateChartReferences )
                {
                    graphicObject.updateChartReferences(oldWorksheet, newWorksheet);
                }
            }
        }, this, []);

    };
    _this.updateChartReferences2 = function(oldWorksheet, newWorksheet)
    {
        for (var i = 0; i < aObjects.length; i++) {
            var graphicObject = aObjects[i].graphicObject;
            if ( graphicObject.updateChartReferences2 )
            {
                graphicObject.updateChartReferences2(oldWorksheet, newWorksheet);
            }
        }
    };

    //-----------------------------------------------------------------------------------
    // Graphic object
    //-----------------------------------------------------------------------------------

    _this.addGraphicObject = function(graphic, position, lockByDefault) {

        worksheet.cleanSelection();
        var drawingObject = _this.createDrawingObject();
        drawingObject.graphicObject = graphic;
        graphic.setDrawingBase(drawingObject);

        var ret;
        if (AscFormat.isRealNumber(position)) {
            aObjects.splice(position, 0, drawingObject);
            ret = position;
        }
        else {
            ret = aObjects.length;
            aObjects.push(drawingObject);
        }

        if ( lockByDefault ) {
            _this.objectLocker.reset();
            _this.objectLocker.addObjectId(drawingObject.graphicObject.Id);
            _this.objectLocker.checkObjects( function(result) {} );
        }
        worksheet.setSelectionShape(true);

        return ret;
    };


    _this.addOleObject = function(fWidth, fHeight, nWidthPix, nHeightPix, sLocalUrl, sData, sApplicationId){
        var drawingObject = _this.createDrawingObject();
        drawingObject.worksheet = worksheet;

        var activeCell = worksheet.model.selectionRange.activeCell;
        drawingObject.from.col = activeCell.col;
        drawingObject.from.row = activeCell.row;

        // Проверяем начальные координаты при вставке
        while (!worksheet.cols[drawingObject.from.col]) {
            worksheet.expandColsOnScroll(true);
        }
        worksheet.expandColsOnScroll(true); 	// для colOff

        while (!worksheet.rows[drawingObject.from.row]) {
            worksheet.expandRowsOnScroll(true);
        }
        worksheet.expandRowsOnScroll(true); 	// для rowOff

        _this.calculateObjectMetrics(drawingObject, nWidthPix, nHeightPix);

        var coordsFrom = _this.coordsManager.calculateCoords(drawingObject.from);

        _this.objectLocker.reset();
        _this.objectLocker.addObjectId(AscCommon.g_oIdCounter.Get_NewId());
        _this.objectLocker.checkObjects(function (bLock) {
            if (bLock !== true)
                return;
            _this.controller.resetSelection();
            _this.controller.addOleObjectFromParams(pxToMm(coordsFrom.x), pxToMm(coordsFrom.y), fWidth, fHeight, nWidthPix, nHeightPix, sLocalUrl, sData, sApplicationId);
            worksheet.setSelectionShape(true);
        });
    };

    _this.editOleObject = function(oOleObject, sData, sImageUrl, nPixWidth, nPixHeight, bResize){
        this.controller.editOleObjectFromParams(oOleObject, sData, sImageUrl, nPixWidth, nPixHeight, bResize);
    };

    _this.groupGraphicObjects = function() {

        if ( _this.controller.canGroup() ) {
            _this.controller.checkSelectedObjectsAndCallback(_this.controller.createGroup, [], false, AscDFH.historydescription_Spreadsheet_CreateGroup);
            worksheet.setSelectionShape(true);
        }
    };

    _this.unGroupGraphicObjects = function() {

        if ( _this.controller.canUnGroup() ) {
            _this.controller.unGroup();
            worksheet.setSelectionShape(true);
            api.isStartAddShape = false;
        }
    };

    _this.getDrawingBase = function(graphicId) {
        for (var i = 0; i < aObjects.length; i++) {
            if ( aObjects[i].graphicObject.Id == graphicId )
                return aObjects[i];
        }
        return null;
    };

    _this.deleteDrawingBase = function(graphicId) {

        var position = null;
        var bRedraw = false;
        for (var i = 0; i < aObjects.length; i++) {
            if ( aObjects[i].graphicObject.Id == graphicId ) {
                aObjects[i].graphicObject.deselect(_this.controller);
                if ( aObjects[i].isChart() )
                    worksheet.endEditChart();
                aObjects.splice(i, 1);
                bRedraw = true;
                position = i;
                break;
            }
        }

        /*if ( bRedraw ) {
         worksheet._checkSelectionShape();
         _this.sendGraphicObjectProps();
         _this.showDrawingObjects(true);
         }*/

        return position;
    };

    _this.checkGraphicObjectPosition = function(x, y, w, h) {

        /*	Принцип:
         true - если перемещение в области или требуется увеличить лист вправо/вниз
         false - наезд на хидеры
         */

        var response = { result: true, x: 0, y: 0 };

        var bottom = worksheet.getCellTop(worksheet.rows.length - 1, 3) + worksheet.getRowHeight(worksheet.rows.length - 1, 3) - worksheet.getCellTop(0, 3);
        var right = worksheet.getCellLeft(worksheet.cols.length - 1, 3) + worksheet.getColumnWidth(worksheet.cols.length - 1, 3) - worksheet.getCellLeft(0, 3);

        // выход за границу слева или сверху
        if ( y < 0 ) {
            response.result = false;
            response.y = Math.abs(y);
        }
        if ( x < 0 ) {
            response.result = false;
            response.x = Math.abs(x);
        }

        // выход за границу справа
        if ( x + w > right ) {
            var scrollX = scrollOffset.getX();
            var foundCol = worksheet._findColUnderCursor(mmToPt(x + w) + scrollX, true);
            while ( foundCol == null ) {
                if ( worksheet.isMaxCol() )
                {
                    var lastCol = worksheet.cols[worksheet.nColsCount - 1];
                    if ( mmToPt(x + w) + scrollX > lastCol.left ) {
                        response.result = false;
                        response.x = ptToMm( lastCol.left - (mmToPt(x + w) + scrollX) );
                    }
                    break;
                }
                worksheet.expandColsOnScroll(true);
                worksheet.handlers.trigger("reinitializeScrollX");
                foundCol = worksheet._findColUnderCursor(mmToPt(x + w) + scrollX, true);
            }
        }
        // выход за границу снизу
        if ( y + h > bottom ) {
            var scrollY = scrollOffset.getY();
            var foundRow = worksheet._findRowUnderCursor(mmToPt(y + h) + scrollY, true);
            while ( foundRow == null ) {
                if ( worksheet.isMaxRow() )
                {
                    var lastRow = worksheet.rows[worksheet.nRowsCount - 1];
                    if ( mmToPt(y + h) + scrollY > lastRow.top ) {
                        response.result = false;
                        response.y = ptToMm( lastRow.top - (mmToPt(y + h) + scrollY) );
                    }
                    break;
                }
                worksheet.expandRowsOnScroll(true);
                worksheet.handlers.trigger("reinitializeScrollY");
                foundRow = worksheet._findRowUnderCursor(mmToPt(y + h) + scrollY, true);
            }
        }

        return response;
    };

    _this.resetLockedGraphicObjects = function() {

        for (var i = 0; i < aObjects.length; i++) {
            aObjects[i].graphicObject.lockType = c_oAscLockTypes.kLockTypeNone;
        }
    };

    _this.tryResetLockedGraphicObject = function(id) {

        var bObjectFound = false;
        for (var i = 0; i < aObjects.length; i++) {
            if ( aObjects[i].graphicObject.Id == id ) {
                aObjects[i].graphicObject.lockType = c_oAscLockTypes.kLockTypeNone;
                bObjectFound = true;
                break;
            }
        }
        return bObjectFound;
    };

    _this.getDrawingCanvas = function() {
        return { shapeCtx: shapeCtx, shapeOverlayCtx: shapeOverlayCtx, autoShapeTrack: autoShapeTrack, trackOverlay: trackOverlay };
    };

    _this.convertMetric = function(val, from, to) {
        /* Параметры конвертирования (from/to)
         0 - px, 1 - pt, 2 - in, 3 - mm
         */
        return val * ascCvtRatio(from, to);
    };

    _this.convertPixToMM = function(pix)
    {
        return _this.convertMetric(pix, 0, 3);
    };
    _this.getSelectedGraphicObjects = function() {
        return _this.controller.selectedObjects;
    };

    _this.selectedGraphicObjectsExists = function() {
        return _this.controller && _this.controller.selectedObjects.length > 0;
    };

    _this.loadImageRedraw = function(imageUrl) {

        var _image = api.ImageLoader.LoadImage(imageUrl, 1);

        if (null != _image) {
            imageLoaded(_image);
        }
        else {
            _this.asyncImageEndLoaded = function(_image) {
                imageLoaded(_image);
                _this.asyncImageEndLoaded = null;
            }
        }

        function imageLoaded(_image) {
            if ( !_image.Image ) {
                worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
            }
            else
                _this.showDrawingObjects(true);
        }
    };

    _this.getOriginalImageSize = function() {

        var selectedObjects = _this.controller.selectedObjects;
        if ( (selectedObjects.length == 1) ) {

            if(AscFormat.isRealNumber(selectedObjects[0].m_fDefaultSizeX) && AscFormat.isRealNumber(selectedObjects[0].m_fDefaultSizeY)){
                return new AscCommon.asc_CImageSize( selectedObjects[0].m_fDefaultSizeX, selectedObjects[0].m_fDefaultSizeY, true);
            }
            if(selectedObjects[0].isImage()){
                var imageUrl = selectedObjects[0].getImageUrl();

                var _image = api.ImageLoader.map_image_index[AscCommon.getFullImageSrc2(imageUrl)];
                if (_image != undefined && _image.Image != null && _image.Status == AscFonts.ImageLoadStatus.Complete) {

                    var _w = 1, _h = 1;
                    var bIsCorrect = false;
                    if (_image.Image != null) {

                        bIsCorrect = true;
                        _w = Math.max( pxToMm(_image.Image.width), 1 );
                        _h = Math.max( pxToMm(_image.Image.height), 1 );
                    }

                    return new AscCommon.asc_CImageSize( _w, _h, bIsCorrect);
                }
            }
        }
        return new AscCommon.asc_CImageSize( 50, 50, false );
    };

    _this.sendGraphicObjectProps = function () {
        if (worksheet) {
            worksheet.handlers.trigger("selectionChanged");
        }
    };

    _this.setGraphicObjectProps = function(props) {

        var objectProperties = props;

		var _img;
        if ( !AscCommon.isNullOrEmptyString(objectProperties.ImageUrl) ) {
            _img = api.ImageLoader.LoadImage(objectProperties.ImageUrl, 1);

            if (null != _img) {
                _this.controller.setGraphicObjectProps( objectProperties );
            }
            else {
                _this.asyncImageEndLoaded = function(_image) {
                    _this.controller.setGraphicObjectProps( objectProperties );
                    _this.asyncImageEndLoaded = null;
                }
            }
        }
        else if ( objectProperties.ShapeProperties && objectProperties.ShapeProperties.fill && objectProperties.ShapeProperties.fill.fill &&
            !AscCommon.isNullOrEmptyString(objectProperties.ShapeProperties.fill.fill.url) ) {

            if (window['IS_NATIVE_EDITOR']) {
                _this.controller.setGraphicObjectProps( objectProperties );
            } else {
                _img = api.ImageLoader.LoadImage(objectProperties.ShapeProperties.fill.fill.url, 1);
                if ( null != _img ) {
                    _this.controller.setGraphicObjectProps( objectProperties );
                }
                else {
                    _this.asyncImageEndLoaded = function(_image) {
                        _this.controller.setGraphicObjectProps( objectProperties );
                        _this.asyncImageEndLoaded = null;
                    }
                }
            }
        }
        else {
            objectProperties.ImageUrl = null;

            if(!api.noCreatePoint || api.exucuteHistory)
            {
                if( !api.noCreatePoint && !api.exucuteHistory && api.exucuteHistoryEnd)
                {
                    if(_this.nCurPointItemsLength === -1){
                        _this.controller.setGraphicObjectProps( props );
                    }
                    else{
                        _this.controller.setGraphicObjectPropsCallBack(props);
                        _this.controller.startRecalculate();
                        _this.sendGraphicObjectProps();
                    }
                    api.exucuteHistoryEnd = false;
                    _this.nCurPointItemsLength = -1;
                }
                else
                {
                    _this.controller.setGraphicObjectProps( props );
                }
                if(api.exucuteHistory)
                {

                    var Point =  History.Points[History.Index];
                    if(Point)
                    {
                        _this.nCurPointItemsLength = Point.Items.length;
                    }
                    else
                    {
                        _this.nCurPointItemsLength = -1;
                    }
                    api.exucuteHistory = false;
                }
            }
            else
            {

                var Point =  History.Points[History.Index];
                if(Point && Point.Items.length > 0)
                {
                    if(this.nCurPointItemsLength > -1){
                        var nBottomIndex = - 1;
                        for ( var Index = Point.Items.length - 1; Index > nBottomIndex; Index-- )
                        {
                            var Item = Point.Items[Index];
                            if(!Item.Class.Read_FromBinary2)
                                Item.Class.Undo( Item.Type, Item.Data, Item.SheetId );
                            else
                                Item.Class.Undo(Item.Data);
                        }
                        _this.controller.setSelectionState(Point.SelectionState);
                        Point.Items.length = 0;

                        _this.controller.setGraphicObjectPropsCallBack(props);
                        _this.controller.startRecalculate();
                    }
                    else{
                        _this.controller.setGraphicObjectProps( props );
                        var Point =  History.Points[History.Index];
                        if(Point)
                        {
                            _this.nCurPointItemsLength = Point.Items.length;
                        }
                        else
                        {
                            _this.nCurPointItemsLength = -1;
                        }
                    }
                }
            }
        }

    };

    _this.showChartSettings = function() {
        api.wb.handlers.trigger("asc_onShowChartDialog", true);
    };

    _this.setDrawImagePlaceParagraph = function(element_id, props) {
        _this.drawingDocument.InitGuiCanvasTextProps(element_id);
        _this.drawingDocument.DrawGuiCanvasTextProps(props);
    };

    //-----------------------------------------------------------------------------------
    // Graphic object mouse & keyboard events
    //-----------------------------------------------------------------------------------

    _this.graphicObjectMouseDown = function(e, x, y) {
        var offsets = _this.drawingArea.getOffsets(x, y, true);
        if ( offsets )
            _this.controller.onMouseDown( e, pxToMm(x - offsets.x), pxToMm(y - offsets.y) );
    };

    _this.graphicObjectMouseMove = function(e, x, y) {
        e.IsLocked = e.isLocked;

        var offsets = _this.drawingArea.getOffsets(x, y, true);
        if ( offsets )
            _this.controller.onMouseMove( e, pxToMm(x - offsets.x), pxToMm(y - offsets.y) );
    };

    _this.graphicObjectMouseUp = function(e, x, y) {
        var offsets = _this.drawingArea.getOffsets(x, y, true);
        if ( offsets )
            _this.controller.onMouseUp( e, pxToMm(x - offsets.x), pxToMm(y - offsets.y) );
    };

    // keyboard

    _this.graphicObjectKeyDown = function(e) {
        return _this.controller.onKeyDown( e );
    };

    _this.graphicObjectKeyPress = function(e) {

        e.KeyCode = e.keyCode;
        e.CtrlKey = e.metaKey || e.ctrlKey;
        e.AltKey = e.altKey;
        e.ShiftKey = e.shiftKey;
        e.Which = e.which;
        return _this.controller.onKeyPress( e );
    };

    //-----------------------------------------------------------------------------------
    // Asc
    //-----------------------------------------------------------------------------------

    _this.cleanWorksheet = function() {
    };

    _this.getWordChartObject = function() {
        for (var i = 0; i < aObjects.length; i++) {
            var drawingObject = aObjects[i];

            if ( drawingObject.isChart() ) {
                return new asc_CChartBinary(drawingObject.graphicObject);
            }
        }
        return null;
    };

    _this.getAscChartObject = function() {

        var settings;
        if(api.isChartEditor)
        {
            return _this.controller.getPropsFromChart(aObjects[0].graphicObject);
        }
        settings = _this.controller.getChartProps();
        if ( !settings )
        {
            settings = new AscCommon.asc_ChartSettings();
            var selectedRange = worksheet.getSelectedRange();
            if (selectedRange)
            {
                var box = selectedRange.getBBox0();
                settings.putInColumns(!(box.r2 - box.r1 < box.c2 - box.c1));
            }
            settings.putRange(worksheet.getSelectionRangeValue());
            settings.putStyle(2);
            settings.putType(Asc.c_oAscChartTypeSettings.lineNormal);
            settings.putTitle(Asc.c_oAscChartTitleShowSettings.noOverlay);
            settings.putShowHorAxis(true);
            settings.putShowVerAxis(true);
            var series = AscFormat.getChartSeries(worksheet.model, settings);
            if(series && series.series.length > 1)
            {
                settings.putLegendPos(Asc.c_oAscChartLegendShowSettings.right);
            }
            else
            {
                settings.putLegendPos(Asc.c_oAscChartLegendShowSettings.none);
            }
            settings.putHorAxisLabel(Asc.c_oAscChartHorAxisLabelShowSettings.none);
            settings.putVertAxisLabel(Asc.c_oAscChartVertAxisLabelShowSettings.none);
            settings.putDataLabelsPos(Asc.c_oAscChartDataLabelsPos.none);
            settings.putHorGridLines(Asc.c_oAscGridLinesSettings.major);
            settings.putVertGridLines(Asc.c_oAscGridLinesSettings.none);
            //settings.putInColumns(false);
            settings.putSeparator(",");
            settings.putLine(true);
            settings.putShowMarker(false);

            var vert_axis_settings = new AscCommon.asc_ValAxisSettings();
            settings.putVertAxisProps(vert_axis_settings);
            vert_axis_settings.setDefault();

            var hor_axis_settings = new AscCommon.asc_CatAxisSettings();
            settings.putHorAxisProps(hor_axis_settings);
            hor_axis_settings.setDefault();
        }
        else{
            this.controller.checkSelectedObjectsAndFireCallback(function(){});
        }
        return settings;
    };

    //-----------------------------------------------------------------------------------
    // Selection
    //-----------------------------------------------------------------------------------

    _this.selectDrawingObjectRange = function(drawing) {

		worksheet.cleanSelection();
        worksheet.endEditChart();

        if(!drawing.bbox || drawing.bbox.worksheet !== worksheet.model)
            return;

        if(drawing.bbox.serBBox)
        {
            worksheet._drawElements(worksheet._drawSelectionElement,
              asc.Range(drawing.bbox.serBBox.c1, drawing.bbox.serBBox.r1, drawing.bbox.serBBox.c2,
                drawing.bbox.serBBox.r2, true), AscCommonExcel.selectionLineType.Selection | AscCommonExcel.selectionLineType.Resize,
              AscCommonExcel.c_oAscFormulaRangeBorderColor[1]);
        }
        if(drawing.bbox.catBBox)
        {
            worksheet._drawElements(worksheet._drawSelectionElement,
              asc.Range(drawing.bbox.catBBox.c1, drawing.bbox.catBBox.r1, drawing.bbox.catBBox.c2,
                drawing.bbox.catBBox.r2, true), AscCommonExcel.selectionLineType.Selection | AscCommonExcel.selectionLineType.Resize,
              AscCommonExcel.c_oAscFormulaRangeBorderColor[2]);
        }
        var BB = drawing.bbox.seriesBBox;
        var range = asc.Range(BB.c1, BB.r1, BB.c2, BB.r2, true);
        worksheet.setChartRange(range);
        worksheet._drawSelection();
    };

    _this.unselectDrawingObjects = function() {

        worksheet.endEditChart();
        _this.controller.resetSelectionState();
        _this.OnUpdateOverlay();
    };

    _this.getDrawingObject = function(id) {

        for (var i = 0; i < aObjects.length; i++) {
            if (aObjects[i].graphicObject.Id == id)
                return aObjects[i];
        }
        return null;
    };

    _this.getGraphicSelectionType = function(id) {

        var selected_objects, selection, controller = _this.controller;
        if(controller.selection.groupSelection)
        {
            selected_objects = controller.selection.groupSelection.selectedObjects;
            selection = controller.selection.groupSelection.selection;
        }
        else
        {
            selected_objects = controller.selectedObjects;
            selection = controller.selection;
        }
        if(selection.chartSelection && selection.chartSelection.selection.textSelection)
        {
            return c_oAscSelectionType.RangeChartText;
        }
        if(selection.textSelection)
        {
            return c_oAscSelectionType.RangeShapeText;
        }
        if(selected_objects[0] )
        {
            if(selected_objects[0].getObjectType() === AscDFH.historyitem_type_ChartSpace && selected_objects.length === 1)
                return c_oAscSelectionType.RangeChart;

            if(selected_objects[0].getObjectType() === AscDFH.historyitem_type_ImageShape)
                return c_oAscSelectionType.RangeImage;

            return c_oAscSelectionType.RangeShape;

        }
        return undefined;
    };

    //-----------------------------------------------------------------------------------
    // Position
    //-----------------------------------------------------------------------------------

    _this.setGraphicObjectLayer = function(layerType) {
        _this.controller.setGraphicObjectLayer(layerType);
    };

    _this.saveSizeDrawingObjects = function() {

        for (var i = 0; i < aObjects.length; i++) {
            var obj = aObjects[i];

            obj.size.width = obj.getWidthFromTo();
            obj.size.height = obj.getHeightFromTo();
        }
    };

    _this.checkCursorDrawingObject = function(x, y) {

        var offsets = _this.drawingArea.getOffsets(x, y);
       // console.log('getOffsets: ' + x + ':' + y);
        if ( offsets ) {
            var objectInfo = { cursor: null, id: null, object: null };
            var graphicObjectInfo = _this.controller.isPointInDrawingObjects( pxToMm(x - offsets.x), pxToMm(y - offsets.y) );
           // console.log('isPointInDrawingObjects: ' + pxToMm(x - offsets.x) + ':' + pxToMm(y - offsets.y));
            if ( graphicObjectInfo && graphicObjectInfo.objectId ) {
                objectInfo.id = graphicObjectInfo.objectId;
                objectInfo.object = _this.getDrawingBase(graphicObjectInfo.objectId);
                objectInfo.cursor = graphicObjectInfo.cursorType;
                objectInfo.hyperlink = graphicObjectInfo.hyperlink;

                return objectInfo;
            }
        }
        return null;
    };

    _this.getPositionInfo = function(x, y) {

        var info = new CCellObjectInfo();

        var tmp = worksheet._findColUnderCursor(pxToPt(x), true);
        if (tmp) {
            info.col = tmp.col;
            info.colOff = pxToMm(x - worksheet.getCellLeft(info.col, 0));
        }
        tmp = worksheet._findRowUnderCursor(pxToPt(y), true);
        if (tmp) {
            info.row = tmp.row;
            info.rowOff = pxToMm(y - worksheet.getCellTop(info.row, 0));
        }

        return info;
    };


    _this.beginCompositeInput = function(){
        History.Create_NewPoint(AscDFH.historydescription_Document_CompositeInput);
        _this.controller.CreateDocContent();
        _this.drawingDocument.TargetStart();
        _this.drawingDocument.TargetShow();
        var oContent = _this.controller.getTargetDocContent(true);
        if (!oContent) {
            return false;
        }
        var oPara = oContent.Get_CurrentParagraph();
        if (!oPara) {
            return false;
        }
        if (true === oContent.Is_SelectionUse())
            oContent.Remove(1, true, false, true);
        var oRun = oPara.Get_ElementByPos(oPara.Get_ParaContentPos(false, false));
        if (!oRun || !(oRun instanceof ParaRun)) {
            return false;
        }

        _this.CompositeInput = {
            Run    : oRun,
            Pos    : oRun.State.ContentPos,
            Length : 0
        };

        oRun.Set_CompositeInput(_this.CompositeInput);
        _this.controller.startRecalculate();
        _this.sendGraphicObjectProps();
        return true;
    };

    _this.Begin_CompositeInput = function(){
        if(_this.controller){
            if(window['Asc']['editor'].collaborativeEditing.getFast()){
                _this.controller.checkSelectedObjectsAndCallbackNoCheckLock(_this.beginCompositeInput,  [], false, AscDFH.historydescription_Document_CompositeInput);
            }
            else{
                _this.controller.checkSelectedObjectsAndCallback(_this.beginCompositeInput, [], false, AscDFH.historydescription_Document_CompositeInput);
            }
        }
        _this.beginCompositeInput();
    };


    _this.addCompositeText = function(nCharCode){

        if (null === _this.CompositeInput)
            return;

        var oRun = _this.CompositeInput.Run;
        var nPos = _this.CompositeInput.Pos + _this.CompositeInput.Length;
        var oChar;
        if (32 == nCharCode || 12288 == nCharCode)
        {
            oChar = new ParaSpace();
        }
        else
        {
            oChar = new ParaText();
            oChar.Set_CharCode(nCharCode);
        }
        oRun.Add_ToContent(nPos, oChar, true);
        _this.CompositeInput.Length++;
    };
    _this.Add_CompositeText = function(nCharCode)
    {

        if (null === _this.CompositeInput)
            return;
        History.Create_NewPoint(AscDFH.historydescription_Document_CompositeInputReplace);
        _this.addCompositeText(nCharCode);
        _this.controller.recalculate();
        _this.controller.recalculateCurPos();
        _this.controller.updateSelectionState();
    };

    _this.removeCompositeText = function(nCount){
        if (null === _this.CompositeInput)
            return;

        var oRun = _this.CompositeInput.Run;
        var nPos = _this.CompositeInput.Pos + _this.CompositeInput.Length;

        var nDelCount = Math.max(0, Math.min(nCount, _this.CompositeInput.Length, oRun.Content.length, nPos));
        oRun.Remove_FromContent(nPos - nDelCount, nDelCount, true);
        _this.CompositeInput.Length -= nDelCount;
    };

    _this.Remove_CompositeText = function(nCount){
        _this.removeCompositeText(nCount);
        _this.controller.recalculate();
        _this.controller.updateSelectionState();
    };
    _this.Replace_CompositeText = function(arrCharCodes)
    {
        if (null === _this.CompositeInput)
            return;
        History.Create_NewPoint(AscDFH.historydescription_Document_CompositeInputReplace);
        _this.removeCompositeText(_this.CompositeInput.Length);
        for (var nIndex = 0, nCount = arrCharCodes.length; nIndex < nCount; ++nIndex)
        {
            _this.addCompositeText(arrCharCodes[nIndex]);
        }
        _this.controller.recalculate();
        _this.controller.updateSelectionState();
    };
    _this.Set_CursorPosInCompositeText = function(nPos)
    {
        if (null === _this.CompositeInput)
            return;
        var oRun = _this.CompositeInput.Run;

        var nInRunPos = Math.max(Math.min(_this.CompositeInput.Pos + nPos, _this.CompositeInput.Pos + _this.CompositeInput.Length, oRun.Content.length), _this.CompositeInput.Pos);
        oRun.State.ContentPos = nInRunPos;
        _this.controller.updateSelectionState();
    };
    _this.Get_CursorPosInCompositeText = function()
    {
        if (null === _this.CompositeInput)
            return 0;

        var oRun = _this.CompositeInput.Run;
        var nInRunPos = oRun.State.ContentPos;
        var nPos = Math.min(_this.CompositeInput.Length, Math.max(0, nInRunPos - _this.CompositeInput.Pos));
        return nPos;
    };
    _this.End_CompositeInput = function()
    {
        if (null === _this.CompositeInput)
            return;

        var oRun = _this.CompositeInput.Run;
        oRun.Set_CompositeInput(null);
        _this.CompositeInput = null;
        _this.sendGraphicObjectProps();
        _this.showDrawingObjects(true);
    };
    _this.Get_MaxCursorPosInCompositeText = function()
    {
        if (null === _this.CompositeInput)
            return 0;

        return _this.CompositeInput.Length;
    };


    //-----------------------------------------------------------------------------------
    // Private Misc Methods
    //-----------------------------------------------------------------------------------

    function ascCvtRatio(fromUnits, toUnits) {
        return asc.getCvtRatio( fromUnits, toUnits, drawingCtx.getPPIX() );
    }

    function emuToPx(emu) {
        return emu * 20 * 96 / 2.54 / 72 / 100 / 1000;
    }

    function pxToEmu(px) {
        return px * 2.54 * 72 * 100 * 1000 / 20 / 96;
    }

    function pxToPt(val) {
        return val * ascCvtRatio(0, 1);
    }

    function ptToPx(val) {
        return val * ascCvtRatio(1, 0);
    }

    function ptToMm(val) {
        return val * ascCvtRatio(1, 3);
    }

    function mmToPx(val) {
        return val * ascCvtRatio(3, 0);
    }

    function mmToPt(val) {
        return val * ascCvtRatio(3, 1);
    }

    function pxToMm(val) {
        return val * ascCvtRatio(0, 3);
    }
}

//-----------------------------------------------------------------------------------
// Universal object locker/checker
//-----------------------------------------------------------------------------------

function ObjectLocker(ws) {
    var asc_applyFunction = AscCommonExcel.applyFunction;

    var _t = this;
    _t.bLock = true;
    var aObjectId = [];
    var worksheet = ws;

    _t.reset = function() {
        _t.bLock = true;
        aObjectId = [];
    };

    _t.addObjectId = function(id) {
        aObjectId.push(id);
    };

    // For array of objects -=Use reset before use=-
    _t.checkObjects = function(callback) {

        function callbackEx(result, sync) {
            //if ( worksheet )
            //	worksheet._drawCollaborativeElements(true);
            if ( callback )
                callback(result, sync);
        }

        var bRet = true;
        if (!aObjectId.length) {
            // Запрещено совместное редактирование
            asc_applyFunction(callbackEx, true, true);
            return bRet;
        }

        var sheetId = worksheet.model.getId();
        worksheet.collaborativeEditing.onStartCheckLock();
        for ( var i = 0; i < aObjectId.length; i++ ) {

            var lockInfo = worksheet.collaborativeEditing.getLockInfo( AscCommonExcel.c_oAscLockTypeElem.Object, /*subType*/null, sheetId, aObjectId[i] );

            if ( false === worksheet.collaborativeEditing.getCollaborativeEditing() ) {
                // Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
                asc_applyFunction(callbackEx, true, true);
                callback = undefined;
            }
            if ( false !== worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine) ) {
                // Редактируем сами, проверяем дальше
                continue;
            }
            else if ( false !== worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther) ) {
                // Уже ячейку кто-то редактирует
                asc_applyFunction(callbackEx, false);
                return false;
            }
            if ( _t.bLock )
                worksheet.collaborativeEditing.addCheckLock(lockInfo);
        }
        if ( _t.bLock )
            worksheet.collaborativeEditing.onEndCheckLock(callbackEx);
        else
            asc_applyFunction(callbackEx, true, true);
        return bRet;
    }
}

function ClickCounter() {
    this.x = 0;
    this.y = 0;
    this.button = 0;
    this.time = 0;
    this.clickCount = 0;
    this.log = false;
}
ClickCounter.prototype.mouseDownEvent = function(x, y, button) {
    var currTime = getCurrentTime();
    if (this.button === button && this.x === x && this.y === y && (currTime - this.time < 500)) {
        ++this.clickCount;
    } else {
        this.clickCount = 1;
    }

    if (this.log) {
        console.log("-----");
        console.log("x-> " + this.x + " : " + x);
        console.log("y-> " + this.y + " : " + y);
        console.log("Time: " + (currTime - this.time));
        console.log("Count: " + this.clickCount);
        console.log("");
    }
    this.time = currTime;
};
ClickCounter.prototype.mouseMoveEvent = function(x, y) {
    if (this.x !== x || this.y !== y) {
        this.x = x;
        this.y = y;
        this.clickCount = 0;

        if (this.log) {
            console.log("Reset counter");
        }
    }
};
ClickCounter.prototype.getClickCount = function() {
    return this.clickCount;
};

function CoordsManager(ws) {

    var _t = this;
    var worksheet = ws;

    _t.calculateCell = function(x, y) {

        var cell = new CCellObjectInfo();

        var _x = x + worksheet.getCellLeft(0, 0);
        var _y = y + worksheet.getCellTop(0, 0);

        var xPt = worksheet.objectRender.convertMetric(_x, 0, 1);
        var yPt = worksheet.objectRender.convertMetric(_y, 0, 1);

        var offsetX = worksheet.cols[worksheet.getFirstVisibleCol(true)].left - worksheet.cellsLeft;
        var offsetY = worksheet.rows[worksheet.getFirstVisibleRow(true)].top - worksheet.cellsTop;

        /* Проверки на максимум в листе */
        function isMaxCol() {
            var result = false;
            if ( worksheet.cols.length >= gc_nMaxCol )
                result = true;
            return result;
        }

        function isMaxRow() {
            var result = false;
            if ( worksheet.rows.length >= gc_nMaxRow )
                result = true;
            return result;
        }
        //

        var delta = 0;
        var what = roundPlus(xPt - offsetX, 3);
        var col = worksheet._findColUnderCursor( what, true );
        while (col == null) {
            if ( isMaxCol() ) {
                col = worksheet._findColUnderCursor( worksheet.cols[gc_nMaxCol - 1].left - 1, true );
                break;
            }
            worksheet.expandColsOnScroll(true);
            worksheet.handlers.trigger("reinitializeScrollX");
            col = worksheet._findColUnderCursor( what + delta, true );
            if ( what < 0 )
                delta++;
        }
        cell.col = col.col;
        cell.colOffPx = Math.max(0, _x - worksheet.getCellLeft(cell.col, 0));
        cell.colOff = worksheet.objectRender.convertMetric(cell.colOffPx, 0, 3);

        delta = 0;
        what = roundPlus(yPt - offsetY, 3);
        var row = worksheet._findRowUnderCursor( what, true );
        while (row == null) {
            if ( isMaxRow() ) {
                row = worksheet._findRowUnderCursor( worksheet.rows[gc_nMaxRow - 1].top - 1, true );
                break;
            }
            worksheet.expandRowsOnScroll(true);
            worksheet.handlers.trigger("reinitializeScrollY");
            row = worksheet._findRowUnderCursor( what + delta, true );
            if ( what < 0 )
                delta++;
        }
        cell.row = row.row;
        cell.rowOffPx = Math.max(0, _y - worksheet.getCellTop(cell.row, 0));
        cell.rowOff = worksheet.objectRender.convertMetric(cell.rowOffPx, 0, 3);

        return cell;
    };

    _t.calculateCoords = function(cell) {

        var coords = { x: 0, y: 0 };
        //0 - px, 1 - pt, 2 - in, 3 - mm
        if ( cell ) {
            var rowHeight = worksheet.getRowHeight(cell.row, 3);
            var colWidth = worksheet.getColumnWidth(cell.col, 3);
            var resultRowOff = cell.rowOff > rowHeight ? rowHeight : cell.rowOff;
            var resultColOff = cell.colOff > colWidth ? colWidth : cell.colOff;
            coords.y = worksheet.getCellTop(cell.row, 0) + worksheet.objectRender.convertMetric(resultRowOff, 3, 0) - worksheet.getCellTop(0, 0);
            coords.x = worksheet.getCellLeft(cell.col, 0) + worksheet.objectRender.convertMetric(resultColOff, 3, 0) - worksheet.getCellLeft(0, 0);
        }
        return coords;
    }
}



//--------------------------------------------------------export----------------------------------------------------
    var prot;
    window['AscFormat'] = window['AscFormat'] || {};
    window['Asc'] = window['Asc'] || {};
    window['AscFormat'].isObject = isObject;
    window['AscFormat'].CCellObjectInfo = CCellObjectInfo;

    window["AscFormat"].asc_CChartStyle = asc_CChartStyle;
    prot = asc_CChartStyle.prototype;
    prot["asc_getStyle"] = prot.asc_getStyle;
    prot["asc_setStyle"] = prot.asc_setStyle;
    prot["asc_getImageUrl"] = prot.asc_getImageUrl;
    prot["asc_setImageUrl"] = prot.asc_setImageUrl;

    window["Asc"]["asc_CChartBinary"] = window["Asc"].asc_CChartBinary = asc_CChartBinary;
    prot = asc_CChartBinary.prototype;
    prot["asc_getBinary"] = prot.asc_getBinary;
    prot["asc_setBinary"] = prot.asc_setBinary;
    prot["asc_getThemeBinary"] = prot.asc_getThemeBinary;
    prot["asc_setThemeBinary"] = prot.asc_setThemeBinary;
    prot["asc_setColorMapBinary"] = prot.asc_setColorMapBinary;
    prot["asc_getColorMapBinary"] = prot.asc_getColorMapBinary;

    window["AscFormat"].asc_CChartSeria = asc_CChartSeria;
    prot = asc_CChartSeria.prototype;
    prot["asc_getValFormula"] = prot.asc_getValFormula;
    prot["asc_setValFormula"] = prot.asc_setValFormula;
    prot["asc_getxValFormula"] = prot.asc_getxValFormula;
    prot["asc_setxValFormula"] = prot.asc_setxValFormula;
    prot["asc_getCatFormula"] = prot.asc_getCatFormula;
    prot["asc_setCatFormula"] = prot.asc_setCatFormula;
    prot["asc_getTitle"] = prot.asc_getTitle;
    prot["asc_setTitle"] = prot.asc_setTitle;
    prot["asc_getTitleFormula"] = prot.asc_getTitleFormula;
    prot["asc_setTitleFormula"] = prot.asc_setTitleFormula;
    prot["asc_getMarkerSize"] = prot.asc_getMarkerSize;
    prot["asc_setMarkerSize"] = prot.asc_setMarkerSize;
    prot["asc_getMarkerSymbol"] = prot.asc_getMarkerSymbol;
    prot["asc_setMarkerSymbol"] = prot.asc_setMarkerSymbol;
    prot["asc_getFormatCode"] = prot.asc_getFormatCode;
    prot["asc_setFormatCode"] = prot.asc_setFormatCode;

    window["AscFormat"].CChangeTableData = CChangeTableData;
    window["AscFormat"].GraphicOption = GraphicOption;
    window["AscFormat"].DrawingObjects = DrawingObjects;
    window["AscFormat"].ClickCounter = ClickCounter;
    window["AscFormat"].aSparklinesStyles = aSparklinesStyles;
    window["AscFormat"].CSparklineView = CSparklineView;
})(window);
