/*
 * (c) Copyright Ascensio System SIA 2010-2017
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
var GLOBAL_PATH_COUNT = 0;
(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {

// Import
    var oNonSpaceRegExp = new RegExp('' + String.fromCharCode(0x00A0),'g');
var c_oAscChartType = AscCommon.c_oAscChartType;
var c_oAscChartSubType = AscCommon.c_oAscChartSubType;
var parserHelp = AscCommon.parserHelp;
var g_oIdCounter = AscCommon.g_oIdCounter;
var g_oTableId = AscCommon.g_oTableId;
var oNumFormatCache = AscCommon.oNumFormatCache;
var CellAddress = AscCommon.CellAddress;
var isRealObject = AscCommon.isRealObject;
    var History = AscCommon.History;
    var global_MatrixTransformer = AscCommon.global_MatrixTransformer;

var CShape = AscFormat.CShape;
var Ax_Counter = AscFormat.Ax_Counter;
var checkTxBodyDefFonts = AscFormat.checkTxBodyDefFonts;

var c_oAscNumFormatType = Asc.c_oAscNumFormatType;
var c_oAscTickLabelsPos = Asc.c_oAscTickLabelsPos;
var c_oAscChartLegendShowSettings = Asc.c_oAscChartLegendShowSettings;
var c_oAscTickMark = Asc.c_oAscTickMark;

var EFFECT_NONE = 0;
var EFFECT_SUBTLE = 1;
var EFFECT_MODERATE = 2;
var EFFECT_INTENSE = 3;

var CHART_STYLE_MANAGER = null;
var SKIP_LBL_LIMIT = 100;

    var BAR_SHAPE_CONE = 0;
    var BAR_SHAPE_CONETOMAX = 1;
    var BAR_SHAPE_BOX = 2;
    var BAR_SHAPE_CYLINDER = 3;
    var BAR_SHAPE_PYRAMID = 4;
    var BAR_SHAPE_PYRAMIDTOMAX = 5;

    var DISP_BLANKS_AS_GAP = 0;
    var DISP_BLANKS_AS_SPAN = 1;
    var DISP_BLANKS_AS_ZERO = 2;

    function removePtsFromLit(lit)
    {
        var i;
        var start_idx = Array.isArray(lit.pts) ? lit.pts.length - 1 : -1;
        for(i = start_idx; i > -1; --i)
        {
            lit.removeDPt(i);
        }
    }
    function removeAllSeriesFromChart(chart)
    {
        for(var i = chart.series.length-1; i > -1; --i)
            chart.removeSeries(i);
    }

    function checkVerticalTitle(title)
    {
        return false;
    }



    function GetTextPrFormArrObjects(aObjects, bFirstBreak, bLbl)
    {
        var oResultTextPr;
        for(var i = 0; i < aObjects.length; ++i)
        {
            var oContent = aObjects[i];
            oContent = bLbl ? oContent.compiledDlb && oContent.compiledDlb.txBody && oContent.compiledDlb.txBody.content : oContent.txBody && oContent.txBody.content;
            if(!oContent)
                continue;
            oContent.Set_ApplyToAll(true);
            var oTextPr = oContent.Get_Paragraph_TextPr();
            oContent.Set_ApplyToAll(false);
            if(!oResultTextPr)
            {
                oResultTextPr = oTextPr;
                if(bFirstBreak)
                {
                    return oResultTextPr;
                }
            }
            else
            {
                oResultTextPr.Compare(oTextPr);
            }
        }
        return oResultTextPr;
    }


    function checkBlackUnifill(unifill, bLines)
{
    if(unifill && unifill.fill && unifill.fill.color)
    {
        var RGBA = unifill.fill.color.RGBA;
        if(RGBA.R === 0 && RGBA.G === 0 && RGBA.B === 0)
        {
            if(bLines)
            {
                RGBA.R = 134;
                RGBA.G = 134;
                RGBA.B = 134;
            }
            else
            {
                RGBA.R = 255;
                RGBA.G = 255;
                RGBA.B = 255;
            }
        }
    }
}

function BBoxInfo(worksheet, bbox)
{
    this.worksheet = worksheet;
    if(window["Asc"] && typeof window["Asc"].Range === "function")
    {
        this.bbox = window["Asc"].Range(bbox.c1, bbox.r1, bbox.c2, bbox.r2, false);
    }
    else
    {
        this.bbox = bbox;
    }
}

BBoxInfo.prototype =
{
    checkIntersection: function(bboxInfo)
    {
        if(this.worksheet !== bboxInfo.worksheet)
        {
            return false;
        }
        return this.bbox.isIntersect(bboxInfo.bbox);
    }
};

function CreateUnifillSolidFillSchemeColorByIndex(index)
{
    var ret =  new AscFormat.CUniFill();
    ret.setFill(new AscFormat.CSolidFill());
    ret.fill.setColor(new AscFormat.CUniColor());
    ret.fill.color.setColor(new AscFormat.CSchemeColor());
    ret.fill.color.color.setId(index);
    return ret;
}

function CChartStyleManager()
{
    this.styles = [];
}

CChartStyleManager.prototype =
{
    init: function() {
        AscFormat.ExecuteNoHistory(
          function()
          {
              var DefaultDataPointPerDataPoint =
                [
                    [
                        CreateUniFillSchemeColorWidthTint(8, 0.885),
                        CreateUniFillSchemeColorWidthTint(8, 0.55),
                        CreateUniFillSchemeColorWidthTint(8, 0.78),
                        CreateUniFillSchemeColorWidthTint(8, 0.925),
                        CreateUniFillSchemeColorWidthTint(8, 0.7),
                        CreateUniFillSchemeColorWidthTint(8, 0.3)
                    ],
                    [
                        CreateUniFillSchemeColorWidthTint(0, 0),
                        CreateUniFillSchemeColorWidthTint(1, 0),
                        CreateUniFillSchemeColorWidthTint(2, 0),
                        CreateUniFillSchemeColorWidthTint(3, 0),
                        CreateUniFillSchemeColorWidthTint(4, 0),
                        CreateUniFillSchemeColorWidthTint(5, 0)
                    ],
                    [
                        CreateUniFillSchemeColorWidthTint(0, -0.5),
                        CreateUniFillSchemeColorWidthTint(1, -0.5),
                        CreateUniFillSchemeColorWidthTint(2, -0.5),
                        CreateUniFillSchemeColorWidthTint(3, -0.5),
                        CreateUniFillSchemeColorWidthTint(4, -0.5),
                        CreateUniFillSchemeColorWidthTint(5, -0.5)
                    ],
                    [
                        CreateUniFillSchemeColorWidthTint(8, 0.05),
                        CreateUniFillSchemeColorWidthTint(8, 0.55),
                        CreateUniFillSchemeColorWidthTint(8, 0.78),
                        CreateUniFillSchemeColorWidthTint(8, 0.15),
                        CreateUniFillSchemeColorWidthTint(8, 0.7),
                        CreateUniFillSchemeColorWidthTint(8, 0.3)
                    ]
                ];
              var s = DefaultDataPointPerDataPoint;
              var f = CreateUniFillSchemeColorWidthTint;
              this.styles[0] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, s[0], EFFECT_SUBTLE, EFFECT_NONE, [], 3, s[0], 7);
              this.styles[1] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, s[1], EFFECT_SUBTLE, EFFECT_NONE, [], 3, s[1], 7);
              for(var i = 2; i < 8; ++i)
              {
                  this.styles[i] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, [f(i - 2,0)], EFFECT_SUBTLE, EFFECT_NONE, [], 3, [f(i - 2,0)], 7);
              }
              this.styles[8] = new CChartStyle(EFFECT_SUBTLE, EFFECT_SUBTLE, s[0], EFFECT_SUBTLE, EFFECT_SUBTLE,  [f(12,0)], 5, s[0], 9);
              this.styles[9] = new CChartStyle(EFFECT_SUBTLE, EFFECT_SUBTLE, s[1], EFFECT_SUBTLE, EFFECT_SUBTLE,  [f(12,0)], 5, s[1], 9);
              for(i = 10; i < 16; ++i)
              {
                  this.styles[i] = new CChartStyle(EFFECT_SUBTLE, EFFECT_SUBTLE, [f(i-10,0)], EFFECT_SUBTLE, EFFECT_SUBTLE,  [f(12,0)], 5, [f(i-10,0)], 9);
              }
              this.styles[16] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, s[0], EFFECT_SUBTLE, EFFECT_NONE,  [], 5, s[0], 9);
              this.styles[17] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, s[1], EFFECT_INTENSE, EFFECT_NONE,  [], 5, s[1], 9);
              for(i = 18; i < 24; ++i)
              {
                  this.styles[i] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, [f(i-18,0)], EFFECT_SUBTLE, EFFECT_NONE,  [], 5, [f(i-18,0)], 9);
              }
              this.styles[24] = new CChartStyle(EFFECT_INTENSE, EFFECT_INTENSE, s[0], EFFECT_SUBTLE, EFFECT_NONE,  [], 7, s[0], 13);
              this.styles[25] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, s[1], EFFECT_SUBTLE, EFFECT_NONE,  [], 7, s[1], 13);
              for(i = 26; i < 32; ++i)
              {
                  this.styles[i] = new CChartStyle(EFFECT_MODERATE, EFFECT_INTENSE, [f(i-26,0)], EFFECT_SUBTLE, EFFECT_NONE,  [], 7, [f(i-26,0)], 13);
              }
              this.styles[32] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, s[0], EFFECT_SUBTLE, EFFECT_SUBTLE,  [f(8, -0.5)], 5, s[0], 9);
              this.styles[33] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, s[1], EFFECT_SUBTLE, EFFECT_SUBTLE,  s[2], 5, s[1], 9);
              for(i = 34; i < 40; ++i)
              {
                  this.styles[i] = new CChartStyle(EFFECT_NONE, EFFECT_SUBTLE, [f(i - 34, 0)], EFFECT_SUBTLE, EFFECT_SUBTLE, [f(i-34, -0.5)], 5, [f(i-34, 0)], 9);
              }
              this.styles[40] = new CChartStyle(EFFECT_INTENSE, EFFECT_INTENSE, s[3], EFFECT_SUBTLE, EFFECT_NONE, [], 5, s[3], 9);
              this.styles[41] = new CChartStyle(EFFECT_INTENSE, EFFECT_INTENSE, s[1], EFFECT_INTENSE, EFFECT_NONE, [], 5, s[1], 9);
              for(i = 42; i < 48; ++i)
              {
                  this.styles[i] = new CChartStyle(EFFECT_INTENSE, EFFECT_INTENSE, [f(i-42, 0)], EFFECT_SUBTLE, EFFECT_NONE, [], 5, [f(i-42, 0)], 9);
              }

              this.defaultLineStyles = [];
              this.defaultLineStyles[0] = new ChartLineStyle(f(15, 0.75), f(15, 0.5), f(15, 0.75), f(15, 0), EFFECT_SUBTLE);
              for(i = 0; i < 32; ++i)
              {
                  this.defaultLineStyles[i] = this.defaultLineStyles[0];
              }
              this.defaultLineStyles[32] = new ChartLineStyle(f(8, 0.75), f(8, 0.5), f(8, 0.75), f(8, 0), EFFECT_SUBTLE);
              this.defaultLineStyles[33] = this.defaultLineStyles[32];
              this.defaultLineStyles[34] = new ChartLineStyle(f(8, 0.75), f(8, 0.5), f(8, 0.75), f(8, 0), EFFECT_SUBTLE);
              for(i = 35; i < 40; ++i)
              {
                  this.defaultLineStyles[i] = this.defaultLineStyles[34];
              }
              this.defaultLineStyles[40] = new ChartLineStyle(f(8, 0.75), f(8, 0.9), f(12, 0), f(12, 0), EFFECT_NONE);
              for(i = 41; i < 48; ++i)
              {
                  this.defaultLineStyles[i] = this.defaultLineStyles[40];
              }
          },
          this, []);
    },
    getStyleByIndex: function(index)
    {
        if(AscFormat.isRealNumber(index))
        {
            return this.styles[(index - 1) % 48];
        }
        return this.styles[1];
    },

    getDefaultLineStyleByIndex: function(index)
    {
        if(AscFormat.isRealNumber(index))
        {
            return this.defaultLineStyles[(index - 1) % 48];
        }
        return this.defaultLineStyles[2];
    }
};

CHART_STYLE_MANAGER = new CChartStyleManager();

function ChartLineStyle(axisAndMajorGridLines, minorGridlines, chartArea, otherLines, floorChartArea)
{
    this.axisAndMajorGridLines = axisAndMajorGridLines;
    this.minorGridlines = minorGridlines;
    this.chartArea = chartArea;
    this.otherLines = otherLines;
    this.floorChartArea = floorChartArea;
}

function CChartStyle(effect, fill1, fill2, fill3, line1, line2, line3, line4, markerSize)
{
    this.effect = effect;
    this.fill1 = fill1;
    this.fill2 = fill2;
    this.fill3 = fill3;

    this.line1 = line1;
    this.line2 = line2;
    this.line3 = line3;
    this.line4 = line4;

    this.markerSize = markerSize;
}


function CreateUniFillSchemeColorWidthTint(schemeColorId, tintVal)
{
    return AscFormat.ExecuteNoHistory(
        function(schemeColorId, tintVal)
        {
            return CreateUniFillSolidFillWidthTintOrShade(CreateUnifillSolidFillSchemeColorByIndex(schemeColorId), tintVal);
        },
        this, [schemeColorId, tintVal]);
}


function checkFiniteNumber(num)
{
    if(AscFormat.isRealNumber(num) && isFinite(num))
    {
        return num;
    }
    return 0;
}

var G_O_VISITED_HLINK_COLOR = CreateUniFillSolidFillWidthTintOrShade(CreateUnifillSolidFillSchemeColorByIndex(10), 0);
var G_O_NO_ACTIVE_COMMENT_BRUSH = AscFormat.CreateUniFillByUniColor(AscFormat.CreateUniColorRGB(248, 231, 195));
var G_O_ACTIVE_COMMENT_BRUSH = AscFormat.CreateUniFillByUniColor(AscFormat.CreateUniColorRGB(240, 200, 120));
/*function addPointToMap(map, worksheet, row, col, pt)
{
    if(!Array.isArray(map[worksheet.getId()+""]))
    {
        map[worksheet.getId()+""] = [];
    }
    if(!Array.isArray(map[worksheet.getId()+""][row]))
    {
        map[worksheet.getId()+""][row] = [];
    }
    if(!Array.isArray(map[worksheet.getId()+""][row][col]))
    {
        map[worksheet.getId()+""][row][col] = [];
    }
    map[worksheet.getId()+""][row][col].push(pt);
}


function checkPointInMap(map, worksheet, row, col)
{
    if(map[worksheet.getId() + ""] && map[worksheet.getId() + ""][row] && map[worksheet.getId() + ""][row][col])
    {
        var cell = worksheet.getCell3(row, col);
        var pts = map[worksheet.getId() + ""][row][col];
        for(var i = 0; i < pts.length; ++i)
        {
            pts[i].setVal(cell.getValue());
        }
        return true;
    }
    else
    {
        return false;
    }
}*/


    var CChangesDrawingsBool = AscDFH.CChangesDrawingsBool;
    var CChangesDrawingsLong = AscDFH.CChangesDrawingsLong;
    var CChangesDrawingsDouble = AscDFH.CChangesDrawingsDouble;
    var CChangesDrawingsString = AscDFH.CChangesDrawingsString;
    var CChangesDrawingsObject = AscDFH.CChangesDrawingsObject;


    var drawingsChangesMap = window['AscDFH'].drawingsChangesMap;



    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetNvGrFrProps          ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetThemeOverride        ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ShapeSetBDeleted                     ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetParent               ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetChart                ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetClrMapOvr        ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetDate1904               ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetExternalData         ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetLang                 ] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetPivotSource          ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetPrintSettings        ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetProtection           ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetRoundedCorners         ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetSpPr                 ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetStyle                  ] = CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetTxPr                 ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetUserShapes           ] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetGroup                ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ExternalData_SetAutoUpdate           ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_ExternalData_SetId                 ] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PivotSource_SetFmtId                 ] = CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PivotSource_SetName                ] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Protection_SetChartObject            ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Protection_SetData                   ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Protection_SetFormatting             ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Protection_SetSelection              ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Protection_SetUserInterface          ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_PrintSettingsSetHeaderFooter       ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PrintSettingsSetPageMargins        ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PrintSettingsSetPageSetup          ] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooterChartSetAlignWithMargins ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooterChartSetDifferentFirst   ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooterChartSetDifferentOddEven ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooterChartSetEvenFooter     ] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooterChartSetEvenHeader     ] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooterChartSetFirstFooter    ] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooterChartSetFirstHeader    ] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooterChartSetOddFooter      ] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooterChartSetOddHeader      ] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageMarginsSetB                    ] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_PageMarginsSetFooter               ] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_PageMarginsSetHeader               ] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_PageMarginsSetL                    ] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_PageMarginsSetR                    ] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_PageMarginsSetT                    ] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetupSetBlackAndWhite            ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetupSetCopies                   ] = CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetupSetDraft                    ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetupSetFirstPageNumber          ] = CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetupSetHorizontalDpi            ] = CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetupSetOrientation              ] = CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetupSetPaperHeight            ] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetupSetPaperSize                ] = CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetupSetPaperWidth             ] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetupSetUseFirstPageNumb         ] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetupSetVerticalDpi              ] = CChangesDrawingsLong;
    
    

    function CheckParagraphTextPr(oParagraph, oTextPr)
    {
        var oParaPr = oParagraph.Pr.Copy();
        var oParaPr2 = new CParaPr();
        var oCopyTextPr = oTextPr.Copy();
        if(oCopyTextPr.FontFamily)
        {
            oCopyTextPr.RFonts.Set_FromObject(
                {
                    Ascii: {
                        Name: oCopyTextPr.FontFamily.Name,
                        Index: -1
                    },
                    EastAsia: {
                        Name: oCopyTextPr.FontFamily.Name,
                        Index: -1
                    },
                    HAnsi: {
                        Name: oCopyTextPr.FontFamily.Name,
                        Index: -1
                    },
                    CS: {
                        Name: oCopyTextPr.FontFamily.Name,
                        Index: -1
                    }
                }
            );
        }
        oParaPr2.DefaultRunPr = oCopyTextPr;
        oParaPr.Merge(oParaPr2);
        oParagraph.Set_Pr(oParaPr);
    }

    function CheckObjectTextPr(oElement, oTextPr, oDrawingDocument)
    {
        if(oElement)
        {
            if(!oElement.txPr)
            {
                oElement.setTxPr(AscFormat.CreateTextBodyFromString("", oDrawingDocument, oElement));
            }
            oElement.txPr.content.Content[0].Set_DocumentIndex(0);

            CheckParagraphTextPr(oElement.txPr.content.Content[0], oTextPr);
            if(oElement.tx && oElement.tx.rich)
            {
                var aContent = oElement.tx.rich.content.Content;
                for(var i = 0; i < aContent.length; ++i)
                {
                    CheckParagraphTextPr(aContent[i], oTextPr);
                }

                oElement.tx.rich.content.Set_ApplyToAll(true);
                var oParTextPr = new AscCommonWord.ParaTextPr(oTextPr);
                oElement.tx.rich.content.Paragraph_Add(oParTextPr);
                oElement.tx.rich.content.Set_ApplyToAll(false);
            }
            CheckParagraphTextPr(oElement.txPr.content.Content[0], oTextPr);
        }
    }

    function CheckIncDecFontSize(oElement, bIncrease, oDrawingDocument,nDefaultSize)
    {
        if(oElement)
        {
            if(!oElement.txPr)
            {
                oElement.setTxPr(AscFormat.CreateTextBodyFromString("", oDrawingDocument, oElement));
            }
            var oParaPr = oElement.txPr.content.Content[0].Pr.Copy();
            oElement.txPr.content.Content[0].Set_DocumentIndex(0);
            var oCopyTextPr;
            if(oParaPr.DefaultRunPr)
            {
                oCopyTextPr = oParaPr.DefaultRunPr.Copy();
            }
            else
            {
                oCopyTextPr = new CTextPr();
            }
            oCopyTextPr.FontSize = FontSize_IncreaseDecreaseValue( bIncrease, AscFormat.isRealNumber(oCopyTextPr.FontSize) ? oCopyTextPr.FontSize : nDefaultSize);
            oParaPr.DefaultRunPr = oCopyTextPr;
            oElement.txPr.content.Content[0].Set_Pr(oParaPr);
            if(oElement.tx && oElement.tx.rich)
            {
                oElement.tx.rich.content.Set_ApplyToAll(true);
                oElement.tx.rich.content.Paragraph_IncDecFontSize(bIncrease);
                oElement.tx.rich.content.Set_ApplyToAll(false);

            }
        }
    }


    function CPathMemory(){
        this.size = 1000;
        this.ArrPathCommand = new Float64Array(this.size);
        this.curPos = -1;

        this.path = new AscFormat.Path2(this);
 }

    CPathMemory.prototype.AllocPath = function(){

        if(this.curPos + 1 >= this.ArrPathCommand.length){
            var aNewArray = new Float64Array((((3/2)*(this.curPos + 1)) >> 0) + 1);
            for(var i = 0; i < this.ArrPathCommand.length; ++i){
                aNewArray[i] = this.ArrPathCommand[i];
            }
            this.ArrPathCommand = aNewArray;
            this.path.ArrPathCommand = aNewArray;
        }

        this.path.startPos = ++this.curPos;
        this.path.curLen = 0;
        this.ArrPathCommand[this.curPos] = 0;
        return this.path;
    };

    CPathMemory.prototype.GetPath = function(index){
        this.path.startPos = index;
        this.path.curLen = 0;
        return this.path;
    };


    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetNvGrFrProps                ] = function(oClass, value){oClass.nvGraphicFramePr   = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetThemeOverride              ] = function(oClass, value){oClass.themeOverride = value;};
    drawingsChangesMap[AscDFH.historyitem_ShapeSetBDeleted                         ] = function(oClass, value){oClass.bDeleted = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetParent                     ] = function(oClass, value){oClass.parent         = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetChart                      ] = function(oClass, value){oClass.chart          = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetClrMapOvr                  ] = function(oClass, value){oClass.clrMapOvr      = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetDate1904                   ] = function(oClass, value){oClass.date1904       = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetExternalData               ] = function(oClass, value){oClass.externalData   = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetLang                       ] = function(oClass, value){oClass.lang           = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetPivotSource                ] = function(oClass, value){oClass.pivotSource    = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetPrintSettings              ] = function(oClass, value){oClass.printSettings  = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetProtection                 ] = function(oClass, value){oClass.protection     = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetRoundedCorners             ] = function(oClass, value){oClass.roundedCorners = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetSpPr                       ] = function(oClass, value){oClass.spPr           = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetStyle                      ] = function(oClass, value){oClass.style          = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetTxPr                       ] = function(oClass, value){oClass.txPr           = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetUserShapes                 ] = function(oClass, value){oClass.userShapes     = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetGroup                      ] = function(oClass, value){oClass.group          = value;};
    drawingsChangesMap[AscDFH.historyitem_ExternalData_SetAutoUpdate               ] = function(oClass, value){oClass.autoUpdate     = value;};
    drawingsChangesMap[AscDFH.historyitem_ExternalData_SetId                       ] = function(oClass, value){oClass.id             = value;};
    drawingsChangesMap[AscDFH.historyitem_PivotSource_SetFmtId                     ] = function(oClass, value){oClass.fmtId = value;};
    drawingsChangesMap[AscDFH.historyitem_PivotSource_SetName                      ] = function(oClass, value){oClass.name  = value;};
    drawingsChangesMap[AscDFH.historyitem_Protection_SetChartObject                ] = function(oClass, value){oClass.chartObject      = value;};
    drawingsChangesMap[AscDFH.historyitem_Protection_SetData                       ] = function(oClass, value){oClass.data             = value;};
    drawingsChangesMap[AscDFH.historyitem_Protection_SetFormatting                 ] = function(oClass, value){oClass.formatting       = value;};
    drawingsChangesMap[AscDFH.historyitem_Protection_SetSelection                  ] = function(oClass, value){oClass.selection        = value;};
    drawingsChangesMap[AscDFH.historyitem_Protection_SetUserInterface              ] = function(oClass, value){oClass.userInterface    = value;};
    drawingsChangesMap[AscDFH.historyitem_PrintSettingsSetHeaderFooter             ] = function(oClass, value){oClass.headerFooter = value;};
    drawingsChangesMap[AscDFH.historyitem_PrintSettingsSetPageMargins              ] = function(oClass, value){oClass.pageMargins  = value;};
    drawingsChangesMap[AscDFH.historyitem_PrintSettingsSetPageSetup                ] = function(oClass, value){oClass.pageSetup    = value;};
    drawingsChangesMap[AscDFH.historyitem_HeaderFooterChartSetAlignWithMargins     ] = function(oClass, value){oClass.alignWithMargins = value;};
    drawingsChangesMap[AscDFH.historyitem_HeaderFooterChartSetDifferentFirst       ] = function(oClass, value){oClass.differentFirst   = value;};
    drawingsChangesMap[AscDFH.historyitem_HeaderFooterChartSetDifferentOddEven     ] = function(oClass, value){oClass.differentOddEven = value;};
    drawingsChangesMap[AscDFH.historyitem_HeaderFooterChartSetEvenFooter           ] = function(oClass, value){oClass.evenFooter       = value;};
    drawingsChangesMap[AscDFH.historyitem_HeaderFooterChartSetEvenHeader           ] = function(oClass, value){oClass.evenHeader       = value;};
    drawingsChangesMap[AscDFH.historyitem_HeaderFooterChartSetFirstFooter          ] = function(oClass, value){oClass.firstFooter      = value;};
    drawingsChangesMap[AscDFH.historyitem_HeaderFooterChartSetFirstHeader          ] = function(oClass, value){oClass.firstHeader      = value;};
    drawingsChangesMap[AscDFH.historyitem_HeaderFooterChartSetOddFooter            ] = function(oClass, value){oClass.oddFooter        = value;};
    drawingsChangesMap[AscDFH.historyitem_HeaderFooterChartSetOddHeader            ] = function(oClass, value){oClass.oddHeader        = value;};
    drawingsChangesMap[AscDFH.historyitem_PageMarginsSetB                          ] = function(oClass, value){oClass.b        = value;};
    drawingsChangesMap[AscDFH.historyitem_PageMarginsSetFooter                     ] = function(oClass, value){oClass.footer   = value;};
    drawingsChangesMap[AscDFH.historyitem_PageMarginsSetHeader                     ] = function(oClass, value){oClass.header   = value;};
    drawingsChangesMap[AscDFH.historyitem_PageMarginsSetL                          ] = function(oClass, value){oClass.l        = value;};
    drawingsChangesMap[AscDFH.historyitem_PageMarginsSetR                          ] = function(oClass, value){oClass.r        = value;};
    drawingsChangesMap[AscDFH.historyitem_PageMarginsSetT                          ] = function(oClass, value){oClass.t        = value;};
    drawingsChangesMap[AscDFH.historyitem_PageSetupSetBlackAndWhite                ] = function(oClass, value){oClass.blackAndWhite    = value;};
    drawingsChangesMap[AscDFH.historyitem_PageSetupSetCopies                       ] = function(oClass, value){oClass.copies           = value;};
    drawingsChangesMap[AscDFH.historyitem_PageSetupSetDraft                        ] = function(oClass, value){oClass.draft            = value;};
    drawingsChangesMap[AscDFH.historyitem_PageSetupSetFirstPageNumber              ] = function(oClass, value){oClass.firstPageNumber  = value;};
    drawingsChangesMap[AscDFH.historyitem_PageSetupSetHorizontalDpi                ] = function(oClass, value){oClass.horizontalDpi    = value;};
    drawingsChangesMap[AscDFH.historyitem_PageSetupSetOrientation                  ] = function(oClass, value){oClass.orientation      = value;};
    drawingsChangesMap[AscDFH.historyitem_PageSetupSetPaperHeight                  ] = function(oClass, value){oClass.paperHeight      = value;};
    drawingsChangesMap[AscDFH.historyitem_PageSetupSetPaperSize                    ] = function(oClass, value){oClass.paperSize        = value;};
    drawingsChangesMap[AscDFH.historyitem_PageSetupSetPaperWidth                   ] = function(oClass, value){oClass.paperWidth       = value;};
    drawingsChangesMap[AscDFH.historyitem_PageSetupSetUseFirstPageNumb             ] = function(oClass, value){oClass.useFirstPageNumb = value;};
    drawingsChangesMap[AscDFH.historyitem_PageSetupSetVerticalDpi                  ] = function(oClass, value){oClass.verticalDpi      = value;};

function CChartSpace()
{
    CChartSpace.superclass.constructor.call(this);

    this.nvGraphicFramePr = null;
    this.chart = null;
    this.clrMapOvr = null;
    this.date1904 = null;
    this.externalData = null;
    this.lang = null;
    this.pivotSource = null;
    this.printSettings = null;
    this.protection = null;
    this.roundedCorners = null;
    this.spPr = null;
    this.style = 2;
    this.txPr = null;
    this.userShapes = null;
    this.themeOverride = null;

    this.pathMemory = new CPathMemory();


    this.bbox = null;

    this.selection =
    {
        title:         null,
        legend:        null,
        legendEntry:   null,
        axisLbls:      null,
        dataLbls:      null,
        dataLbl:       null,
        plotArea:      null,
        rotatePlotArea: null,
        gridLines:     null,
        series:        null,
        datPoint:      null,
        textSelection: null
    };

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
AscCommon.extendClass(CChartSpace, AscFormat.CGraphicObjectBase);


    CChartSpace.prototype.AllocPath = function(){
        return this.pathMemory.AllocPath().startPos;
    };

    CChartSpace.prototype.GetPath = function(index){
        return this.pathMemory.GetPath(index);
    };

        CChartSpace.prototype.select = CShape.prototype.select;
CChartSpace.prototype.checkDrawingBaseCoords = CShape.prototype.checkDrawingBaseCoords;
CChartSpace.prototype.setDrawingBaseCoords = CShape.prototype.setDrawingBaseCoords;
CChartSpace.prototype.deleteBFromSerialize = CShape.prototype.deleteBFromSerialize;
CChartSpace.prototype.setBFromSerialize = CShape.prototype.setBFromSerialize;
CChartSpace.prototype.checkTypeCorrect = function(){
    if(!this.chart){
        return false;
    }
    if(!this.chart.plotArea){
        return false
    }
    if(this.chart.plotArea.charts.length === 0){
        return false;
    }
    if(this.chart.plotArea.charts[0].series.length === 0){
        return false;
    }
    return true;
};
CChartSpace.prototype.drawSelect = function(drawingDocument, nPageIndex)
    {
        var i;
        if(this.selectStartPage === nPageIndex)
        {
            drawingDocument.DrawTrack(AscFormat.TYPE_TRACK.SHAPE, this.getTransformMatrix(), 0, 0, this.extX, this.extY, false, this.canRotate());
			if(window["NATIVE_EDITOR_ENJINE"]){
				return;
			}
            if(this.selection.textSelection)
            {
                drawingDocument.DrawTrack(AscFormat.TYPE_TRACK.CHART_TEXT, this.selection.textSelection.transform, 0, 0, this.selection.textSelection.extX, this.selection.textSelection.extY, false, false, false);
            }
            else if(this.selection.title)
            {
                drawingDocument.DrawTrack(AscFormat.TYPE_TRACK.CHART_TEXT, this.selection.title.transform, 0, 0, this.selection.title.extX, this.selection.title.extY, false, false, false);
            }
            else if(AscFormat.isRealNumber(this.selection.dataLbls))
            {
                var series = this.chart.plotArea.charts[0].series;
                var ser = series[this.selection.dataLbls];
                if(ser)
                {
                    var pts = AscFormat.getPtsFromSeries(ser);
                    if(!AscFormat.isRealNumber(this.selection.dataLbl))
                    {
                        for(i = 0; i < pts.length; ++i)
                        {
                            if(pts[i] && pts[i].compiledDlb && !pts[i].compiledDlb.bDelete)
                            {
                                drawingDocument.DrawTrack(AscFormat.TYPE_TRACK.CHART_TEXT, pts[i].compiledDlb.transform, 0, 0, pts[i].compiledDlb.extX, pts[i].compiledDlb.extY, false, false);
                            }
                        }
                    }
                    else
                    {
                        if(pts[this.selection.dataLbl] && pts[this.selection.dataLbl].compiledDlb)
                        {
                            drawingDocument.DrawTrack(AscFormat.TYPE_TRACK.CHART_TEXT, pts[this.selection.dataLbl].compiledDlb.transform, 0, 0, pts[this.selection.dataLbl].compiledDlb.extX, pts[this.selection.dataLbl].compiledDlb.extY, false, false);
                        }
                    }
                }

            }
            else if(this.selection.dataLbl)
            {
                drawingDocument.DrawTrack(AscFormat.TYPE_TRACK.CHART_TEXT, this.selection.dataLbl.transform, 0, 0, this.selection.dataLbl.extX, this.selection.dataLbl.extY, false, false);
            }
            else if(this.selection.legend)
            {
                if(AscFormat.isRealNumber(this.selection.legendEntry))
                {
                    var oEntry = this.chart.legend.findCalcEntryByIdx(this.selection.legendEntry);
                    if(oEntry){
                        drawingDocument.DrawTrack(AscFormat.TYPE_TRACK.CHART_TEXT, oEntry.transformText, 0, 0, oEntry.contentWidth, oEntry.contentHeight, false, false);
                    }
                }
                else
                {
                    drawingDocument.DrawTrack(AscFormat.TYPE_TRACK.CHART_TEXT, this.selection.legend.transform, 0, 0, this.selection.legend.extX, this.selection.legend.extY, false, false);
                }
            }
            else if(this.selection.axisLbls)
            {
                var oLabels = this.selection.axisLbls.labels;
                drawingDocument.DrawTrack(AscFormat.TYPE_TRACK.CHART_TEXT, this.transform, oLabels.x, oLabels.y, oLabels.extX, oLabels.extY, false, false);
            }
            else if(this.selection.plotArea)
            {

                var oChartSize = this.getChartSizes();
                drawingDocument.DrawTrack(AscFormat.TYPE_TRACK.CHART_TEXT, this.transform, oChartSize.startX, oChartSize.startY, oChartSize.w, oChartSize.h, false, false);
                /*if(!this.selection.rotatePlotArea)
                {
                    drawingDocument.DrawTrack(AscFormat.TYPE_TRACK.CHART_TEXT, this.transform, oChartSize.startX, oChartSize.startY, oChartSize.w, oChartSize.h, false, false);
                }
                else
                {
                    var arr = [
                        {x: oChartSize.startX, y: oChartSize.startY},
                        {x: oChartSize.startX + oChartSize.w/2, y: oChartSize.startY},
                        {x: oChartSize.startX + oChartSize.w, y: oChartSize.startY},
                        {x: oChartSize.startX + oChartSize.w, y: oChartSize.startY + oChartSize.h/2},
                        {x: oChartSize.startX + oChartSize.w, y: oChartSize.startY + oChartSize.h},
                        {x: oChartSize.startX + oChartSize.w/2, y: oChartSize.startY + oChartSize.h},
                        {x: oChartSize.startX, y: oChartSize.startY + oChartSize.h},
                        {x: oChartSize.startX, y: oChartSize.startY + oChartSize.h/2},
                        {x: oChartSize.startX, y: oChartSize.startY}
                    ];
                    drawingDocument.AutoShapesTrack.DrawEditWrapPointsPolygon(arr, this.transform);
                }*/
            }
        }
    };
CChartSpace.prototype.recalculateTextPr = function()
{
    if(this.txPr && this.txPr.content)
    {
        this.txPr.content.Reset(0, 0, 10, 10);
        this.txPr.content.Recalculate_Page(0, true);
    }
};
CChartSpace.prototype.getSelectionState = function()
{
    var content_selection = null;
    if(this.selection.textSelection)
    {
        var content = this.selection.textSelection.getDocContent();
        if(content)
            content_selection = content.Get_SelectionState();
    }
    return {
        title:            this.selection.title,
        legend:           this.selection.legend,
        legendEntry:      this.selection.legendEntry,
        axisLbls:         this.selection.axisLbls,
        dataLbls:         this.selection.dataLbls,
        dataLbl:          this.selection.dataLbl,
        textSelection:    this.selection.textSelection,
        plotArea:         this.selection.plotArea,
        rotatePlotArea:         this.selection.rotatePlotArea,
        contentSelection: content_selection,
        recalcTitle: this.recalcInfo.recalcTitle,
        bRecalculatedTitle: this.recalcInfo.bRecalculatedTitle
    }
};
CChartSpace.prototype.setSelectionState = function(state)
{
   this.selection.title          = state.title;
   this.selection.legend         = state.legend;
   this.selection.legendEntry    = state.legendEntry;
   this.selection.axisLbls       = state.axisLbls;
   this.selection.dataLbls       = state.dataLbls;
   this.selection.dataLbl        = state.dataLbl;
   this.selection.rotatePlotArea        = state.rotatePlotArea;
   this.selection.textSelection  = state.textSelection;
   this.selection.plotArea       = state.plotArea;
   if(isRealObject(state.recalcTitle))
   {
       this.recalcInfo.recalcTitle = state.recalcTitle;
       this.recalcInfo.bRecalculatedTitle = state.bRecalculatedTitle;
   }
    if(state.contentSelection)
   {
       if(this.selection.textSelection)
       {
           var content = this.selection.textSelection.getDocContent();
           if(content)
               content.Set_SelectionState(state.contentSelection, state.contentSelection.length - 1);
       }
   }
};
CChartSpace.prototype.loadDocumentStateAfterLoadChanges = function(state)
{
     this.selection.title =    null;
     this.selection.legend =        null;
     this.selection.legendEntry =   null;
     this.selection.axisLbls =      null;
     this.selection.dataLbls =      null;
     this.selection.dataLbl =       null;
     this.selection.plotArea =      null;
     this.selection.rotatePlotArea =  null;
     this.selection.gridLine =     null;
     this.selection.series =        null;
     this.selection.datPoint =      null;
     this.selection.textSelection = null;
    return false;
};
CChartSpace.prototype.resetInternalSelection = function(noResetContentSelect)
{
    if(this.selection.title)
    {
        this.selection.title.selected = false;
    }
    if(this.selection.textSelection)
    {
        if(!(noResetContentSelect === true))
        {
            var content = this.selection.textSelection.getDocContent();
            content && content.Selection_Remove();
        }
        this.selection.textSelection = null;
    }
};
CChartSpace.prototype.getDocContent = function()
{
    return null;
};
CChartSpace.prototype.resetSelection = function(noResetContentSelect)
{
    this.resetInternalSelection(noResetContentSelect);
    this.selection.title = null;
    this.selection.legend = null;
    this.selection.legendEntry = null;
    this.selection.axisLbls = null;
    this.selection.dataLbls = null;
    this.selection.dataLbl = null;
    this.selection.textSelection = null;
    this.selection.plotArea = null;
    this.selection.rotatePlotArea = null;
};
CChartSpace.prototype.getStyles = function()
{
    return AscFormat.ExecuteNoHistory(function(){

        //todo: доработать
        var styles = new CStyles();
        var style = new CStyle("dataLblStyle", null, null, null);
        var text_pr = new CTextPr();
        text_pr.FontSize = 10;
        text_pr.Unifill = CreateUnfilFromRGB(0,0,0);
        var parent_objects = this.getParentObjects();
        var theme = parent_objects.theme;

        var para_pr = new CParaPr();
        para_pr.Jc = AscCommon.align_Center;
        para_pr.Spacing.Before = 0.0;
        para_pr.Spacing.After = 0.0;
        para_pr.Spacing.Line = 1;
        para_pr.Spacing.LineRule = Asc.linerule_Auto;
        style.ParaPr = para_pr;

        var minor_font = theme.themeElements.fontScheme.minorFont;


        if(minor_font)
        {
            if(typeof minor_font.latin === "string" && minor_font.latin.length > 0)
            {
                text_pr.RFonts.Ascii = {Name: minor_font.latin, Index: -1};
            }
            if(typeof minor_font.ea === "string" && minor_font.ea.length > 0)
            {
                text_pr.RFonts.EastAsia = {Name: minor_font.ea, Index: -1};
            }
            if(typeof minor_font.cs === "string" && minor_font.cs.length > 0)
            {
                text_pr.RFonts.CS = {Name: minor_font.cs, Index: -1};
            }

            if(typeof minor_font.sym === "string" && minor_font.sym.length > 0)
            {
                text_pr.RFonts.HAnsi = {Name: minor_font.sym, Index: -1};
            }
        }
        style.TextPr = text_pr;

        var chart_text_pr;

        if(this.txPr
            && this.txPr.content
            && this.txPr.content.Content[0]
            && this.txPr.content.Content[0].Pr)
        {
            style.ParaPr.Merge(this.txPr.content.Content[0].Pr);
            if(this.txPr.content.Content[0].Pr.DefaultRunPr)
            {
                chart_text_pr = this.txPr.content.Content[0].Pr.DefaultRunPr;
                style.TextPr.Merge(chart_text_pr);
            }

        }

        if(this.txPr
            && this.txPr.content
            && this.txPr.content.Content[0]
            && this.txPr.content.Content[0].Pr)
        {
            style.ParaPr.Merge(this.txPr.content.Content[0].Pr);
            if(this.txPr.content.Content[0].Pr.DefaultRunPr)
                style.TextPr.Merge(this.txPr.content.Content[0].Pr.DefaultRunPr);
        }
        styles.Add(style);
        return {lastId: style.Id, styles: styles};
    }, this, []);
};

CChartSpace.prototype.getParagraphTextPr = function()
{
    if(this.selection.title && !this.selection.textSelection)
    {
        return  GetTextPrFormArrObjects([this.selection.title]);
    }
    else if(this.selection.legend)
    {
        if(!AscFormat.isRealNumber(this.selection.legendEntry))
        {
            if(AscFormat.isRealNumber(this.legendLength))
            {
                var arrForProps = [];
                for(var i = 0; i < this.legendLength; ++i)
                {
                    arrForProps.push(this.chart.legend.getCalcEntryByIdx(i, this.getDrawingDocument()))
                }
                return GetTextPrFormArrObjects(arrForProps);
            }
            return GetTextPrFormArrObjects(this.chart.legend.calcEntryes);
        }
        else
        {
            var calcLegendEntry = this.chart.legend.getCalcEntryByIdx(this.selection.legendEntry, this.getDrawingDocument());
            if(calcLegendEntry)
            {
                return GetTextPrFormArrObjects([calcLegendEntry]);
            }
        }
    }
    else  if(this.selection.textSelection)
    {
        return this.selection.textSelection.txBody.content.Get_Paragraph_TextPr();
    }
    else if(this.selection.axisLbls && this.selection.axisLbls.labels)
    {
        return GetTextPrFormArrObjects(this.selection.axisLbls.labels.arrLabels, true);
    }
    else if(AscFormat.isRealNumber(this.selection.dataLbls))
    {
        var ser = this.chart.plotArea.charts[0].series[this.selection.dataLbls];
        if(ser)
        {
            var pts = AscFormat.getPtsFromSeries(ser);
            if(!AscFormat.isRealNumber(this.selection.dataLbl))
            {
                return GetTextPrFormArrObjects(pts, undefined , true);
            }
            else
            {
                var pt = pts[this.selection.dataLbl];
                if(pt)
                {
                    return GetTextPrFormArrObjects([pt], undefined , true);
                }
            }
        }
    }
    if(this.txPr && this.txPr.content && this.txPr.content.Content[0] && this.txPr.content.Content[0].Pr.DefaultRunPr)
    {
        this.txPr.content.Content[0].Pr.DefaultRunPr.Copy();
    }
    return new AscCommonWord.CTextPr();
};


CChartSpace.prototype.applyLabelsFunction = function(fCallback, value)
{
    if(this.selection.title)
    {
        var DefaultFontSize = 18;
        if(this.selection.title !== this.chart.title)
        {
            DefaultFontSize = 10;
        }
        fCallback(this.selection.title, value, this.getDrawingDocument(), DefaultFontSize);
    }
    else if(this.selection.legend)
    {
        if(!AscFormat.isRealNumber(this.selection.legendEntry))
        {
            fCallback(this.selection.legend, value, this.getDrawingDocument(), 10);
            for(var i = 0; i < this.selection.legend.legendEntryes.length; ++i)
            {
                fCallback(this.selection.legend.legendEntryes[i], value, this.getDrawingDocument(), 10);
            }
        }
        else
        {
            var entry = this.selection.legend.findLegendEntryByIndex(this.selection.legendEntry);
            if(!entry)
            {
                entry = new AscFormat.CLegendEntry();
                entry.setIdx(this.selection.legendEntry);
                if(this.selection.legend.txPr)
                {
                    entry.setTxPr(this.selection.legend.txPr.createDuplicate());
                }

                this.selection.legend.addLegendEntry(entry);
            }
            if(entry)
            {
                fCallback(entry, value, this.getDrawingDocument(), 10);
            }
        }
    }
    else if(this.selection.axisLbls)
    {
        fCallback(this.selection.axisLbls, value, this.getDrawingDocument(), 10);
    }
    else if(AscFormat.isRealNumber(this.selection.dataLbls))
    {
        var ser = this.chart.plotArea.charts[0].series[this.selection.dataLbls];
        if(ser)
        {
            var pts = AscFormat.getPtsFromSeries(ser);
            if(!ser.dLbls)
            {
                var oDlbls;
                if(this.chart.plotArea.charts[0].dLbls)
                {
                    oDlbls = this.chart.plotArea.charts[0].dLbls.createDuplicate();
                }
                else
                {
                    oDlbls = new AscFormat.CDLbls();
                }
                ser.setDLbls(oDlbls);
            }
            if(!AscFormat.isRealNumber(this.selection.dataLbl))
            {
                fCallback(ser.dLbls, value, this.getDrawingDocument(), 10);
                for(var i = 0; i < pts.length; ++i)
                {
                    var dLbl  = ser.dLbls.findDLblByIdx(pts[i].idx);
                    if(dLbl)
                    {
                        if(ser.dLbls.txPr && !dLbl.txPr)
                        {
                            dLbl.setTxPr(ser.dLbls.txPr.createDuplicate());
                        }
                        fCallback(dLbl, value, this.getDrawingDocument(), 10);
                    }
                }
            }
            else
            {
                var pt = pts[this.selection.dataLbl];
                if(pt)
                {
                    var dLbl  = ser.dLbls.findDLblByIdx(pt.idx);
                    if(!dLbl)
                    {
                        dLbl = new AscFormat.CDLbl();
                        dLbl.setIdx(pt.idx);
                        if(ser.dLbls.txPr)
                        {
                            dLbl.merge(ser.dLbls);
                        }
                        ser.dLbls.addDLbl(dLbl);

                    }
                    fCallback(dLbl, value, this.getDrawingDocument(), 10);
                }
            }
        }
    }
};

CChartSpace.prototype.paragraphIncDecFontSize = function(bIncrease)
{
    if(this.selection.textSelection)
    {
        this.selection.textSelection.checkDocContent();
        var content = this.selection.textSelection.getDocContent();
        if(content)
        {
            content.Paragraph_IncDecFontSize(bIncrease);
        }
        return;
    }
    this.applyLabelsFunction(CheckIncDecFontSize, bIncrease);
};

CChartSpace.prototype.paragraphAdd = function(paraItem, bRecalculate)
{
    if(paraItem.Type === para_TextPr)
    {
        var _paraItem;
        if(paraItem.Value.Unifill && paraItem.Value.Unifill.checkWordMods())
        {
            _paraItem = paraItem.Copy();
            _paraItem.Value.Unifill.convertToPPTXMods();
        }
        else
        {
            _paraItem = paraItem;
        }
        if(this.selection.textSelection)
        {
            this.selection.textSelection.checkDocContent();
            this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
            return;
        }
        /*if(this.selection.title)
        {
            this.selection.title.checkDocContent();
            CheckObjectTextPr(this.selection.title, _paraItem.Value, this.getDrawingDocument(), 18);
            if(this.selection.title.tx && this.selection.title.tx.rich && this.selection.title.tx.rich.content)
            {
                this.selection.title.tx.rich.content.Set_ApplyToAll(true);
                this.selection.title.tx.rich.content.Paragraph_Add(_paraItem);
                this.selection.title.tx.rich.content.Set_ApplyToAll(false);
            }
            return;
        }*/
        this.applyLabelsFunction(CheckObjectTextPr, _paraItem.Value);
    }
    else if(paraItem.Type === para_Text || paraItem.Type === para_Space){
        if(this.selection.title){
            this.selection.textSelection = this.selection.title;
            this.selection.textSelection.checkDocContent();
            this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
        }
    }
};
CChartSpace.prototype.applyTextFunction = function(docContentFunction, tableFunction, args)
{
    if(docContentFunction === CDocumentContent.prototype.Paragraph_Add && !this.selection.textSelection)
    {
        this.paragraphAdd(args[0], args[1]);
        return;
    }
    if(this.selection.textSelection)
    {
        this.selection.textSelection.checkDocContent();

        var bTrackRevision = false;
        if(typeof editor !== "undefined" && editor && editor.WordControl && editor.WordControl.m_oLogicDocument.TrackRevisions === true){
            bTrackRevision = true;
            editor.WordControl.m_oLogicDocument.TrackRevisions = false;
        }
        this.selection.textSelection.applyTextFunction(docContentFunction, tableFunction, args);
        if(bTrackRevision){
            editor.WordControl.m_oLogicDocument.TrackRevisions = true;
        }
    }
};
CChartSpace.prototype.selectTitle = function(title, pageIndex)
{
    title.select(this, pageIndex);
    this.resetInternalSelection();
    this.selection.legend = null;
    this.selection.legendEntry = null;
    this.selection.axisLbls = null;
    this.selection.dataLbls = null;
    this.selection.dataLbl = null;
    this.selection.textSelection = null;
    this.selection.plotArea = null;
    this.selection.rotatePlotArea = null;
};
CChartSpace.prototype.recalculateCurPos = AscFormat.DrawingObjectsController.prototype.recalculateCurPos;
CChartSpace.prototype.documentUpdateSelectionState = function()
{
    if(this.selection.textSelection)
    {
        this.selection.textSelection.updateSelectionState();
    }
};

CChartSpace.prototype.getLegend = function()
{
    if(this.chart)
    {
        return this.chart.legend;
    }
    return null;
};

CChartSpace.prototype.getAllTitles = function()
{
    var ret = [];
    if(this.chart)
    {
        if(this.chart.title)
        {
            ret.push(this.chart.title);
        }
        if(this.chart.plotArea)
        {
            if(this.chart.plotArea.catAx && this.chart.plotArea.catAx.title)
            {
                ret.push(this.chart.plotArea.catAx.title);
            }
            if(this.chart.plotArea.valAx && this.chart.plotArea.valAx.title)
            {
                ret.push(this.chart.plotArea.valAx.title);
            }
        }
    }
    return ret;
};
CChartSpace.prototype.getMainGroup = function()
{
    if(!isRealObject(this.group))
        return this;
    return this.group.getMainGroup();
};
CChartSpace.prototype.getFill = CShape.prototype.getFill;
CChartSpace.prototype.getStroke = CShape.prototype.getStroke;
CChartSpace.prototype.changeSize = CShape.prototype.changeSize;
CChartSpace.prototype.changeFill = function (unifill)
{
    if(this.recalcInfo.recalculatePenBrush)
    {
        this.recalculatePenBrush();
    }
    var unifill2 = AscFormat.CorrectUniFill(unifill, this.brush);
    unifill2.convertToPPTXMods();
    this.spPr.setFill(unifill2);
};
CChartSpace.prototype.setFill = function (fill) {

    this.spPr.setFill(fill);
};

CChartSpace.prototype.setNvSpPr = function(pr) {
    History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartSpace_SetNvGrFrProps, this.nvGraphicFramePr, pr));
    this.nvGraphicFramePr = pr;
};

CChartSpace.prototype.changeLine = function (line)
{
    if(this.recalcInfo.recalculatePenBrush)
    {
        this.recalculatePenBrush();
    }
    var stroke = AscFormat.CorrectUniStroke(line, this.pen);
    if(stroke.Fill)
    {
        stroke.Fill.convertToPPTXMods();
    }
    this.spPr.setLn(stroke);
};
CChartSpace.prototype.parseChartFormula = function(sFormula)
{
    if(this.worksheet && typeof sFormula === "string" && sFormula.length > 0){
        return AscCommonExcel.getRangeByRef(sFormula, this.worksheet);
    }
    return [];
};
CChartSpace.prototype.checkBBoxIntersection = function(bbox1, bbox2)
{
    return !(bbox1.r1 > bbox2.r2 || bbox2.r1 > bbox1.r2 || bbox1.c1 > bbox2.c2 || bbox2.c1 > bbox1.c2)
};
CChartSpace.prototype.checkSeriesIntersection = function(val, bbox, worksheet)
{
    if(val && bbox && worksheet)
    {
        var parsed_formulas = val.parsedFormulas;
        for(var i = 0; i < parsed_formulas.length; ++i)
        {
            if(parsed_formulas[i].worksheet === worksheet && this.checkBBoxIntersection(parsed_formulas[i].bbox, bbox))
            {
                return true;
            }
        }
    }
    return false;
};
CChartSpace.prototype.checkVal = function(val)
{
    if(val)
    {
        if(val.numRef)
        {
            val.numRef.parsedFormulas = this.parseChartFormula(val.numRef.f);
        }
        if(val.strRef)
        {
            val.strRef.parsedFormulas = this.parseChartFormula(val.strRef.f);
        }
    }
};
CChartSpace.prototype.recalculateSeriesFormulas = function()
{
    this.checkSeriesRefs(this.checkVal);
};
CChartSpace.prototype.checkChartIntersection = function(bbox, worksheet)
{
    return this.checkSeriesRefs(this.checkSeriesIntersection, bbox, worksheet);
};
CChartSpace.prototype.changeListName = function(val, oldName, newName)
{
    if(val)
    {
        if(val.numRef && typeof val.numRef.f === "string")
        {
            if(val.numRef.f.indexOf(newName) > -1)
                return;
        }
        if(val.strRef && typeof val.strRef.f === "string")
        {
            if(val.strRef.f.indexOf(newName) > -1)
                return;
        }
        if(val.numRef && typeof val.numRef.f === "string" || val.strRef && typeof val.strRef.f === "string")
        {
            var checkString = oldName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,  "\\$&");
            if(val.numRef && typeof val.numRef.f === "string")
            {
                val.numRef.setF(val.numRef.f.replace(new RegExp(checkString,'g'), newName));
            }
            if(val.strRef && typeof val.strRef.f === "string")
            {
                val.strRef.setF(val.strRef.f.replace(new RegExp(checkString,'g'), newName));
            }
        }
    }
};
CChartSpace.prototype.checkListName = function(val, oldName)
{
    if(val)
    {
        if(val.numRef && typeof val.numRef.f === "string")
        {
            if(val.numRef.f.indexOf(oldName) > -1)
                return true;
        }
        if(val.strRef && typeof val.strRef.f === "string")
        {
            if(val.strRef.f.indexOf(oldName) > -1)
                return true;
        }
    }
    return false;
};
CChartSpace.prototype.changeChartReferences = function(oldWorksheetName, newWorksheetName)
{
    this.checkSeriesRefs(this.changeListName, oldWorksheetName, newWorksheetName);
};
CChartSpace.prototype.checkChartReferences = function(oldWorksheetName)
{
    return this.checkSeriesRefs(this.checkListName, oldWorksheetName);
};
CChartSpace.prototype.updateChartReferences = function(oldWorksheetName, newWorksheetName, bNoRebuildCache)
{
    if(this.checkChartReferences(oldWorksheetName))
    {
        if(bNoRebuildCache === true)
        {
            this.bNoHandleRecalc = true;
        }
        this.changeChartReferences(oldWorksheetName, newWorksheetName);
        if(!(bNoRebuildCache === true))
        {
            this.rebuildSeries();
        }
        this.bNoHandleRecalc = false;
    }
};
CChartSpace.prototype.updateChartReferences2 = function(oldWorksheetName, newWorksheetName)
{
    if(this.checkChartReferences(oldWorksheetName))
    {
        this.changeChartReferences(oldWorksheetName, newWorksheetName);
    }
};
CChartSpace.prototype.checkSeriesRefs = function(callback, bbox, worksheet)
{
    if(this.chart && this.chart.plotArea)
    {
        var charts = this.chart.plotArea.charts, i, j, series, ser;
        for(i = 0; i < charts.length; ++i)
        {
            series = charts[i].series;
            if(charts[i].getObjectType() === AscDFH.historyitem_type_ScatterChart)
            {
                for(j = 0; j < series.length; ++j)
                {
                    ser = series[j];
                    if(callback(ser.xVal, bbox, worksheet))
                        return true;
                    if(callback(ser.yVal, bbox, worksheet))
                        return true;
                    if(callback(ser.tx, bbox, worksheet))
                        return true;
                }
            }
            else
            {
                for(j = 0; j < series.length; ++j)
                {
                    ser = series[j];
                    if(callback(ser.val, bbox, worksheet))
                        return true;
                    if(callback(ser.cat, bbox, worksheet))
                        return true;
                    if(callback(ser.tx, bbox, worksheet))
                        return true;
                }
            }

        }
    }
    return false;
};
CChartSpace.prototype.clearCacheVal = function(val)
{
    if(!val)
        return;
    if(val.numRef)
    {
        if(val.numRef.numCache)
        {
            removePtsFromLit(val.numRef.numCache);
        }
    }
    if(val.strRef)
    {
        if(val.strRef.strCache)
        {
            val.strRef.setStrCache(null);
        }
    }
};
CChartSpace.prototype.checkIntersectionChangedRange = function(data)
{
    if(!data)
        return true;
    var i, j;
    if(this.seriesBBoxes)
    {
        for(i = 0; i < this.seriesBBoxes.length; ++i)
        {
            for(j = 0; j < data.length; ++j)
            {
                if(this.seriesBBoxes[i].checkIntersection(data[j]))
                    return true;
            }
        }
    }
    if(this.seriesTitlesBBoxes)
    {
        for(i = 0; i < this.seriesTitlesBBoxes.length; ++i)
        {
            for(j = 0; j < data.length; ++j)
            {
                if(this.seriesTitlesBBoxes[i].checkIntersection(data[j]))
                    return true;
            }
        }
    }
    if(this.catTitlesBBoxes)
    {
        for(i = 0; i < this.catTitlesBBoxes.length; ++i)
        {
            for(j = 0; j < data.length; ++j)
            {
                if(this.catTitlesBBoxes[i].checkIntersection(data[j]))
                    return true;
            }
        }
    }
    return false;
};
CChartSpace.prototype.rebuildSeries = function(data)
{
    if( this.checkIntersectionChangedRange(data))
    {
        AscFormat.ExecuteNoHistory(function(){
            this.checkRemoveCache();
            this.recalculateReferences();
            this.recalcInfo.recalculateReferences = false;
            // this.recalculate();
        }, this, [])

    }
};
CChartSpace.prototype.checkRemoveCache = function()
{
    this.handleUpdateInternalChart();
    this.recalcInfo.recalculateReferences = true;
    this.checkSeriesRefs(this.clearCacheVal);
};
CChartSpace.prototype.getTypeSubType = function()
{
    var type = null, subtype = null;
    if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0])
    {
        switch (this.chart.plotArea.charts[0].getObjectType())
        {
            case AscDFH.historyitem_type_LineChart:
            {
                type = c_oAscChartType.line;
                break;
            }
            case AscDFH.historyitem_type_AreaChart:
            {
                type = c_oAscChartType.area;
                break;
            }
            case AscDFH.historyitem_type_DoughnutChart:
            {
                type = c_oAscChartType.doughnut;
                break;
            }
            case AscDFH.historyitem_type_PieChart:
            {
                type = c_oAscChartType.pie;
                break;
            }
            case AscDFH.historyitem_type_ScatterChart:
            {
                type = c_oAscChartType.scatter;
                break;
            }
            case AscDFH.historyitem_type_StockChart:
            {
                type = c_oAscChartType.stock;
                break;
            }
            case AscDFH.historyitem_type_BarChart:
            {
                if(this.chart.plotArea.charts[0].barDir === AscFormat.BAR_DIR_BAR)
                    type = c_oAscChartType.hbar;
                else
                    type = c_oAscChartType.bar;
                break;
            }
        }

        if(AscFormat.isRealNumber(this.chart.plotArea.charts[0].grouping))
        {
            if(!this.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_BarChart)
            {
                switch(this.chart.plotArea.charts[0].grouping)
                {
                    case AscFormat.GROUPING_STANDARD:
                    {
                        subtype = c_oAscChartSubType.normal;
                        break;
                    }
                    case AscFormat.GROUPING_STACKED:
                    {
                        subtype = c_oAscChartSubType.stacked;
                        break;
                    }
                    case AscFormat.GROUPING_PERCENT_STACKED:
                    {
                        subtype = c_oAscChartSubType.stackedPer;
                        break;
                    }
                }
            }
            else
            {
                switch(this.chart.plotArea.charts[0].grouping)
                {
                    case AscFormat.BAR_GROUPING_CLUSTERED:
                    case AscFormat.BAR_GROUPING_STANDARD:
                    {
                        subtype = c_oAscChartSubType.normal;
                        break;
                    }
                    case AscFormat.BAR_GROUPING_STACKED:
                    {
                        subtype = c_oAscChartSubType.stacked;
                        break;
                    }
                    case AscFormat.BAR_GROUPING_PERCENT_STACKED:
                    {
                        subtype = c_oAscChartSubType.stackedPer;
                        break;
                    }
                }
            }
        }

    }
    return {type: type, subtype: subtype};
};
CChartSpace.prototype.clearFormatting = function(bNoClearShapeProps)
{
    if(this.spPr && !(bNoClearShapeProps === true))
    {
        this.spPr.Fill && this.spPr.setFill(null);
        this.spPr.ln && this.spPr.setLn(null);
    }
    if(this.chart)
    {
        if(this.chart.plotArea)
        {
            if(this.chart.plotArea.spPr)
            {
                this.chart.plotArea.spPr.Fill && this.chart.plotArea.spPr.setFill(null);
                this.chart.plotArea.spPr.ln && this.chart.plotArea.spPr.setLn(null);
            }
            var i, j, k, series, pts, chart, ser;
            for(i = this.chart.plotArea.charts.length-1; i > -1; --i)
            {
                chart = this.chart.plotArea.charts[i];
                if(chart.upDownBars /*&& chart.getObjectType() !== AscDFH.historyitem_type_StockChart*/)
                {
                    if(chart.upDownBars.upBars)
                    {
                        if(chart.upDownBars.upBars.Fill)
                        {
                            chart.upDownBars.upBars.setFill(null);
                        }

                        if(chart.upDownBars.upBars.ln)
                        {
                            chart.upDownBars.upBars.setLn(null);
                        }
                    }

                    if(chart.upDownBars.downBars)
                    {
                        if(chart.upDownBars.downBars.Fill)
                        {
                            chart.upDownBars.downBars.setFill(null);
                        }

                        if(chart.upDownBars.downBars.ln)
                        {
                            chart.upDownBars.downBars.setLn(null);
                        }
                    }
                }
                series = chart.series;
                for(j = series.length - 1; j > -1; --j)
                {
                    ser = series[j];
                    if(ser.spPr && chart.getObjectType() !== AscDFH.historyitem_type_StockChart)
                    {
                        if(ser.spPr.Fill)
                        {
                            ser.spPr.setFill(null);
                        }
                        if(ser.spPr.ln)
                        {
                            ser.spPr.setLn(null);
                        }
                    }
                    AscFormat.removeDPtsFromSeries(ser)
                }
            }
        }
    }
};
    CChartSpace.prototype.remove = function()
    {
        if(this.selection.title)
        {
            if(this.selection.title.parent)
            {
                this.selection.title.parent.setTitle(null);
            }
        }
        else if(this.selection.legend)
        {
            if(!AscFormat.isRealNumber(this.selection.legendEntry))
            {
                if(this.selection.legend.parent && this.selection.legend.parent.setLegend)
                {
                    this.selection.legend.parent.setLegend(null);
                }
            }
            else
            {
                var entry = this.selection.legend.findLegendEntryByIndex(this.selection.legendEntry);
                if(!entry)
                {
                    entry = new AscFormat.CLegendEntry();
                    entry.setIdx(this.selection.legendEntry);
                    this.selection.legend.addLegendEntry(entry);
                }
                entry.setDelete(true);
            }
        }
        else if(this.selection.axisLbls)
        {
            if(this.selection.axisLbls && this.selection.axisLbls.setDelete)
            {
                this.selection.axisLbls.setDelete(true);
            }
        }
        else if(AscFormat.isRealNumber(this.selection.dataLbls))
        {
            var ser = this.chart.plotArea.charts[0].series[this.selection.dataLbls];
            if(ser)
            {
                var oDlbls = ser.dLbls;
                if(!ser.dLbls)
                {

                    if(this.chart.plotArea.charts[0].dLbls)
                    {
                        oDlbls = this.chart.plotArea.charts[0].dLbls.createDuplicate();
                    }
                    else
                    {
                        oDlbls = new AscFormat.CDLbls();
                    }

                    ser.setDLbls(oDlbls);
                }
                if(!AscFormat.isRealNumber(this.selection.dataLbl))
                {
                    oDlbls.setDelete(true);
                }
                else
                {
                    var pts = AscFormat.getPtsFromSeries(ser);
                    var pt = pts[this.selection.dataLbl];
                    if(pt)
                    {
                        var dLbl  = ser.dLbls.findDLblByIdx(pt.idx);
                        if(!dLbl)
                        {
                            dLbl = new AscFormat.CDLbl();
                            dLbl.setIdx(pt.idx);
                            if(ser.dLbls.txPr)
                            {
                                dLbl.merge(ser.dLbls);
                            }
                            ser.dLbls.addDLbl(dLbl);

                        }
                        dLbl.setDelete(true);
                    }
                }
            }
        }

        this.selection.title =    null;
        this.selection.legend =        null;
        this.selection.legendEntry =   null;
        this.selection.axisLbls =      null;
        this.selection.dataLbls =      null;
        this.selection.dataLbl =       null;
        this.selection.plotArea =      null;
        this.selection.rotatePlotArea = null;
        this.selection.gridLine =     null;
        this.selection.series =        null;
        this.selection.datPoint =      null;
        this.selection.textSelection = null;
    };

CChartSpace.prototype.copy = function(drawingDocument)
{
    var copy = new CChartSpace();
    if(this.chart)
    {
        copy.setChart(this.chart.createDuplicate(drawingDocument));
    }
    if(this.clrMapOvr)
    {
        copy.setClrMapOvr(this.clrMapOvr.createDuplicate());
    }
    copy.setDate1904(this.date1904);
    if(this.externalData)
    {
        copy.setExternalData(this.externalData.createDuplicate());
    }
    copy.setLang(this.lang);
    if(this.pivotSource)
    {
        copy.setPivotSource(this.pivotSource.createDuplicate());
    }
    if(this.printSettings)
    {
        copy.setPrintSettings(this.printSettings.createDuplicate());
    }
    if(this.protection)
    {
        copy.setProtection(this.protection.createDuplicate());
    }
    copy.setRoundedCorners(this.roundedCorners);
    if(this.spPr)
    {
        copy.setSpPr(this.spPr.createDuplicate());
        copy.spPr.setParent(copy);
    }
    copy.setStyle(this.style);
    if(this.txPr)
    {
        copy.setTxPr(this.txPr.createDuplicate(drawingDocument))
    }
    copy.setUserShapes(this.userShapes);
    copy.setThemeOverride(this.themeOverride);
    copy.setBDeleted(this.bDeleted);
    copy.setLocks(this.locks);
    copy.cachedImage = this.getBase64Img();
    copy.cachedPixH = this.cachedPixH;
    copy.cachedPixW = this.cachedPixW;
    if(this.fromSerialize)
    {
        copy.setBFromSerialize(true);
    }
    return copy;
};
CChartSpace.prototype.convertToWord = function(document)
{
    this.setBDeleted(true);
    var oCopy = this.copy();
    oCopy.setBDeleted(false);
    return oCopy;
};
CChartSpace.prototype.convertToPPTX = function(drawingDocument, worksheet)
{
    var copy = this.copy(drawingDocument);
    copy.setBDeleted(false);
    copy.setWorksheet(worksheet);
    copy.setParent(null);
    return copy;
};
CChartSpace.prototype.rebuildSeriesFromAsc = function(asc_chart)
{
    if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0])
    {
        var  asc_series = asc_chart.series;
        var chart_type = this.chart.plotArea.charts[0];
        var first_series = chart_type.series[0] ? chart_type.series[0] : chart_type.getSeriesConstructor();

        var bAccent1Background = false;
        if(this.spPr && this.spPr.Fill && this.spPr.Fill.fill && this.spPr.Fill.fill.color && this.spPr.Fill.fill.color.color
            && this.spPr.Fill.fill.color.color.type === window['Asc'].c_oAscColor.COLOR_TYPE_SCHEME &&  this.spPr.Fill.fill.color.color.id === 0){
            bAccent1Background = true;
        }

        var oFirstSpPrPreset = 0;
        if(chart_type.getObjectType() === AscDFH.historyitem_type_PieChart || chart_type.getObjectType() === AscDFH.historyitem_type_DoughnutChart){
            if(chart_type.series[0].dPt[0] && chart_type.series[0].dPt[0].spPr){
                oFirstSpPrPreset = AscFormat.CollectSettingsSpPr(chart_type.series[0].dPt[0].spPr);
            }
        }
        else{
            oFirstSpPrPreset = AscFormat.CollectSettingsSpPr(chart_type.series[0].spPr);
        }

        if(first_series.spPr){
            first_series.spPr.setFill(null);
            first_series.spPr.setLn(null);
        }

        var style = AscFormat.CHART_STYLE_MANAGER.getStyleByIndex(this.style);
        var base_fills = AscFormat.getArrayFillsFromBase(style.fill2, asc_series.length);
        if(chart_type.getObjectType() !== AscDFH.historyitem_type_ScatterChart)
        {

            if(asc_series.length < chart_type.series.length){
                for(var i = chart_type.series.length - 1; i >= asc_series.length; --i){
                    chart_type.removeSeries(i);
                }
            }
            for(var i = 0; i < asc_series.length; ++i)
            {
                var series = null, bNeedAdd = false;
                if(chart_type.series[i])
                {
                    series = chart_type.series[i];
                }
                else
                {
                    bNeedAdd = true;
                    series = first_series.createDuplicate();
                }

                series.setIdx(i);
                series.setOrder(i);
                series.setVal(new AscFormat.CYVal());




                FillValNum(series.val, asc_series[i].Val, true, false);

                if(chart_type.getObjectType() === AscDFH.historyitem_type_PieChart || chart_type.getObjectType() === AscDFH.historyitem_type_DoughnutChart){
                    if(oFirstSpPrPreset){
                        var pts = AscFormat.getPtsFromSeries(series);
                        for(var j = 0; j < pts.length; ++j){
                            var oDPt = new AscFormat.CDPt();
                            oDPt.setBubble3D(false);
                            oDPt.setIdx(j);
                            ApplySpPr(oFirstSpPrPreset, oDPt, j, base_fills, bAccent1Background);
                            series.series[i].addDPt(oDPt);
                        }
                    }
                }
                else{
                    AscFormat.ApplySpPr(oFirstSpPrPreset, series, i, base_fills, bAccent1Background);
                }
                if(asc_series[i].Cat && asc_series[i].Cat.NumCache && typeof asc_series[i].Cat.Formula === "string" && asc_series[i].Cat.Formula.length > 0)
                {
                    series.setCat(new AscFormat.CCat());
                    FillCatStr(series.cat, asc_series[i].Cat, true, false);
                }
                else
                {
                    series.setCat(null);
                }
                if(asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
                {
                    FillSeriesTx(series, asc_series[i].TxCache, true, false);
                }
                else
                {
                    series.setTx(null);
                }
                if(bNeedAdd)
                {
                    chart_type.addSer(series);
                }

            }
        }
        else
        {
            for(var i = chart_type.series.length - 1; i > -1; --i){
                chart_type.removeSeries(i);
            }
            var oXVal;
            var start_index = 0;
            var minus = 0;
            if(asc_series[0].xVal && asc_series[0].xVal.NumCache && typeof asc_series[0].xVal.Formula === "string" && asc_series[0].xVal.Formula.length > 0)
            {
                oXVal = new AscFormat.CXVal();
                FillCatStr(oXVal, asc_series[0].xVal, true, false);
            }
            else if(asc_series[0].Cat && asc_series[0].Cat.NumCache && typeof asc_series[0].Cat.Formula === "string" && asc_series[0].Cat.Formula.length > 0)
            {
                oXVal = new AscFormat.CXVal();
                FillCatStr(oXVal, asc_series[0].Cat, true, false);
            }
            for(var i = start_index; i < asc_series.length; ++i)
            {
                var series = new AscFormat.CScatterSeries();
                series.setIdx(i - minus);
                series.setOrder(i - minus);
                if(oXVal)
                {
                    series.setXVal(oXVal.createDuplicate());
                }
                series.setYVal(new AscFormat.CYVal());
                FillValNum(series.yVal, asc_series[i].Val, true, false);
                if(asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
                {
                    FillSeriesTx(series, asc_series[i].TxCache, true, false);
                }
                chart_type.addSer(series);
            }
        }
        this.recalculateReferences();
    }
};
CChartSpace.prototype.Write_ToBinary2 = function (w)
{
    w.WriteLong(this.getObjectType());
    w.WriteString2(this.Id);
};
CChartSpace.prototype.Read_FromBinary2 = function (r)
{
    this.Id = r.GetString2();
};
CChartSpace.prototype.handleUpdateType = function()
{
    if(this.bNoHandleRecalc === true)
    {
        return;
    }
    this.recalcInfo.recalculateChart =  true;
    this.recalcInfo.recalculateSeriesColors = true;
    this.recalcInfo.recalculateMarkers = true;
    this.recalcInfo.recalculateGridLines = true;
    this.recalcInfo.recalculateDLbls = true;
    this.recalcInfo.recalculateAxisLabels = true;
    //this.recalcInfo.dataLbls.length = 0;
    //this.recalcInfo.axisLabels.length = 0;
    this.recalcInfo.recalculateAxisVal = true;
    this.recalcInfo.recalculateAxisTickMark = true;
    this.recalcInfo.recalculateHiLowLines = true;
    this.recalcInfo.recalculateUpDownBars = true;
    this.recalcInfo.recalculateLegend = true;
    this.recalcInfo.recalculateReferences = true;
    this.recalcInfo.recalculateBBox = true;
    this.recalcInfo.recalculateFormulas = true;
    this.chartObj = null;
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateInternalChart = function()
{
    if(this.bNoHandleRecalc === true)
    {
        return;
    }
    this.recalcInfo.recalculateChart =  true;
    this.recalcInfo.recalculateSeriesColors = true;
    this.recalcInfo.recalculateDLbls = true;
    this.recalcInfo.recalculateAxisLabels = true;
    this.recalcInfo.recalculateMarkers = true;
    this.recalcInfo.recalculatePlotAreaBrush = true;
    this.recalcInfo.recalculatePlotAreaPen   = true;
    this.recalcInfo.recalculateAxisTickMark  = true;
    //this.recalcInfo.dataLbls.length = 0;
    //this.recalcInfo.axisLabels.length = 0;
    this.recalcInfo.recalculateAxisVal = true;
    this.recalcInfo.recalculateLegend = true;
    this.recalcInfo.recalculateBBox = true;
    this.chartObj = null;
    this.addToRecalculate();

};
CChartSpace.prototype.handleUpdateGridlines = function()
{
    this.recalcInfo.recalculateGridLines = true;
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateDataLabels = function()
{
    this.recalcInfo.recalculateDLbls = true;
    this.addToRecalculate();
};
CChartSpace.prototype.updateChildLabelsTransform = function(posX, posY)
{

    if(this.localTransformText)
    {
        this.transformText = this.localTransformText.CreateDublicate();
        global_MatrixTransformer.TranslateAppend(this.transformText, posX, posY);
        this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
    }

    if(this.chart)
    {
        if(this.chart.plotArea)
        {
            if(this.chart.plotArea.charts[0] && this.chart.plotArea.charts[0].series)
            {
                var series = this.chart.plotArea.charts[0].series;
                for(var i = 0; i < series.length; ++i)
                {
                    var ser = series[i];
                    var pts = AscFormat.getPtsFromSeries(ser);
                    for(var j = 0; j < pts.length; ++j)
                    {
                        if(pts[j].compiledDlb)
                        {
                            pts[j].compiledDlb.updatePosition(posX, posY);
                        }
                    }
                }
            }
            if(this.chart.plotArea.catAx)
            {
                if(this.chart.plotArea.catAx.title)
                    this.chart.plotArea.catAx.title.updatePosition(posX, posY);
                if(this.chart.plotArea.catAx.labels)
                    this.chart.plotArea.catAx.labels.updatePosition(posX, posY);
            }
            if(this.chart.plotArea.valAx)
            {
                if(this.chart.plotArea.valAx.title)
                    this.chart.plotArea.valAx.title.updatePosition(posX, posY);
                if(this.chart.plotArea.valAx.labels)
                    this.chart.plotArea.valAx.labels.updatePosition(posX, posY);
            }

        }
        if(this.chart.title)
        {
            this.chart.title.updatePosition(posX, posY);
        }
        if(this.chart.legend)
        {
            this.chart.legend.updatePosition(posX, posY);
        }
    }
};
CChartSpace.prototype.recalcTitles = function()
{
    if(this.chart && this.chart.title)
    {
        this.chart.title.recalcInfo.recalculateContent = true;
        this.chart.title.recalcInfo.recalcTransform = true;
        this.chart.title.recalcInfo.recalcTransformText = true;
    }
    if(this.chart && this.chart.plotArea)
    {
        var hor_axis = this.chart.plotArea.getHorizontalAxis();
        if(hor_axis && hor_axis.title)
        {
            hor_axis.title.recalcInfo.recalculateContent = true;
            hor_axis.title.recalcInfo.recalcTransform = true;
            hor_axis.title.recalcInfo.recalcTransformText = true;
        }
        var vert_axis = this.chart.plotArea.getVerticalAxis();
        if(vert_axis && vert_axis.title)
        {
            vert_axis.title.recalcInfo.recalculateContent = true;
            vert_axis.title.recalcInfo.recalcTransform = true;
            vert_axis.title.recalcInfo.recalcTransformText = true;
        }
    }
};
CChartSpace.prototype.recalcTitles2 = function()
{
    if(this.chart && this.chart.title)
    {
        this.chart.title.recalcInfo.recalculateContent = true;
        this.chart.title.recalcInfo.recalcTransform = true;
        this.chart.title.recalcInfo.recalcTransformText = true;
        this.chart.title.recalcInfo.recalculateTxBody = true;
    }
    if(this.chart && this.chart.plotArea)
    {
        var hor_axis = this.chart.plotArea.getHorizontalAxis();
        if(hor_axis && hor_axis.title)
        {
            hor_axis.title.recalcInfo.recalculateContent = true;
            hor_axis.title.recalcInfo.recalcTransform = true;
            hor_axis.title.recalcInfo.recalcTransformText = true;
            hor_axis.title.recalcInfo.recalculateTxBody = true;
        }
        var vert_axis = this.chart.plotArea.getVerticalAxis();
        if(vert_axis && vert_axis.title)
        {
            vert_axis.title.recalcInfo.recalculateContent = true;
            vert_axis.title.recalcInfo.recalcTransform = true;
            vert_axis.title.recalcInfo.recalcTransformText = true;
            vert_axis.title.recalcInfo.recalculateTxBody = true;
        }
    }
};
CChartSpace.prototype.Refresh_RecalcData2 = function(pageIndex, object)
{
    if(object && object.getObjectType && object.getObjectType() === AscDFH.historyitem_type_Title && this.selection.title === object)
    {
        this.recalcInfo.recalcTitle = object;
    }
    else
    {
        this.setRecalculateInfo();
    }
    this.addToRecalculate();
};
CChartSpace.prototype.Refresh_RecalcData = function(data)
{
    switch(data.Type)
    {
        case AscDFH.historyitem_ChartSpace_SetStyle:
        {
            this.handleUpdateStyle();
            break;
        }
        case AscDFH.historyitem_ChartSpace_SetTxPr:
        {
            this.recalcInfo.recalculateChart = true;
            this.recalcInfo.recalculateLegend = true;
            this.recalcInfo.recalculateDLbls = true;
            this.recalcInfo.recalculateAxisVal = true;
            this.recalcInfo.recalculateAxisCat = true;
            this.recalcInfo.recalculateAxisLabels = true;
            this.addToRecalculate();
            break;
        }
        case AscDFH.historyitem_ChartSpace_SetChart:
        {
            this.handleUpdateType();
            break;
        }
        case AscDFH.historyitem_ShapeSetBDeleted:{
            if(!this.bDeleted){
                this.handleUpdateType();
            }
            break;
        }
    }
};
CChartSpace.prototype.getObjectType = function()
{
    return AscDFH.historyitem_type_ChartSpace;
};
CChartSpace.prototype.getAllRasterImages = function(images)
{
    if(this.spPr)
    {
        this.spPr.checkBlipFillRasterImage(images);
    }
    var chart = this.chart;
    if(chart)
    {
        chart.backWall && chart.backWall.spPr && chart.backWall.spPr.checkBlipFillRasterImage(images);
        chart.floor && chart.floor.spPr && chart.floor.spPr.checkBlipFillRasterImage(images);
        chart.legend && chart.legend.spPr && chart.legend.spPr.checkBlipFillRasterImage(images);
        chart.sideWall && chart.sideWall.spPr && chart.sideWall.spPr.checkBlipFillRasterImage(images);
        chart.title && chart.title.spPr && chart.title.spPr.checkBlipFillRasterImage(images);
        //plotArea
        var plot_area = this.chart.plotArea;
        if(plot_area)
        {
            plot_area.spPr && plot_area.spPr.checkBlipFillRasterImage(images);
            var i;
            for(i = 0; i < plot_area.axId.length; ++i)
            {
                var axis = plot_area.axId[i];
                if(axis)
                {
                    axis.spPr && axis.spPr.checkBlipFillRasterImage(images);
                    axis.title && axis.title && axis.title.spPr && axis.title.spPr.checkBlipFillRasterImage(images);
                }
            }
            for(i = 0; i < plot_area.charts.length; ++i)
            {
                plot_area.charts[i].getAllRasterImages(images);
            }
        }
    }
};
CChartSpace.prototype.getAllContents = function()
{

};
CChartSpace.prototype.documentGetAllFontNames = function(allFonts)
{
    allFonts["+mn-lt"] = 1;
    allFonts["+mn-ea"] = 1;
    allFonts["+mn-cs"] = 1;
    checkTxBodyDefFonts(allFonts, this.txPr);
    var chart = this.chart, i;
    if(chart)
    {
        for(i = 0; i < chart.pivotFmts.length; ++i)
        {
            chart.pivotFmts[i] &&  checkTxBodyDefFonts(allFonts, chart.pivotFmts[i].txPr);
        }
        if(chart.legend)
        {
            checkTxBodyDefFonts(allFonts, chart.legend.txPr);
            for(i = 0;  i < chart.legend.legendEntryes.length; ++i)
            {
                chart.legend.legendEntryes[i] && checkTxBodyDefFonts(allFonts, chart.legend.legendEntryes[i].txPr);
            }
        }
        if(chart.title)
        {
            checkTxBodyDefFonts(allFonts, chart.title.txPr);
            if(chart.title.tx && chart.title.tx.rich)
            {
                checkTxBodyDefFonts(allFonts, chart.title.tx.rich);
                chart.title.tx.rich.content && chart.title.tx.rich.content.Document_Get_AllFontNames(allFonts);
            }
        }
        var plot_area = chart.plotArea;
        if(plot_area)
        {
            for(i = 0; i < plot_area.charts.length; ++i)
            {
                plot_area.charts[i] && plot_area.charts[i].documentCreateFontMap(allFonts);/*TODO надо бы этот метод переименовать чтоб название не вводило в заблуждение*/
            }
            var cur_axis;
            for(i = 0; i < plot_area.axId.length; ++i)
            {
                cur_axis = plot_area.axId[i];
                checkTxBodyDefFonts(allFonts, cur_axis.txPr);
                if(cur_axis.title)
                {
                    checkTxBodyDefFonts(allFonts, cur_axis.title.txPr);
                    if(cur_axis.title.tx && cur_axis.title.tx.rich)
                    {
                        checkTxBodyDefFonts(allFonts, cur_axis.title.tx.rich);
                        cur_axis.title.tx.rich.content && cur_axis.title.tx.rich.content.Document_Get_AllFontNames(allFonts);
                    }
                }
            }
        }
    }
};
CChartSpace.prototype.documentCreateFontMap = function(allFonts)
{
    if(this.chart)
    {
        this.chart.title && this.chart.title.txBody && this.chart.title.txBody.content.Document_CreateFontMap(allFonts);
        var i, j, k;
        if(this.chart.legend)
        {
            var calc_entryes = this.chart.legend.calcEntryes;
            for(i = 0; i < calc_entryes.length; ++i)
            {
                calc_entryes[i].txBody.content.Document_CreateFontMap(allFonts);
            }
        }
        var axis = this.chart.plotArea.axId, cur_axis;
        for(i = axis.length-1; i > -1 ; --i)
        {
            cur_axis = axis[i];
            if(cur_axis)
            {
                cur_axis && cur_axis.title && cur_axis.title.txBody && cur_axis.title.txBody.content.Document_CreateFontMap(allFonts);
                if(cur_axis.labels)
                {
                    for(j = cur_axis.labels.arrLabels.length - 1; j > -1; --j)
                    {
                        cur_axis.labels.arrLabels[j] && cur_axis.labels.arrLabels[j].txBody && cur_axis.labels.arrLabels[j].txBody.content.Document_CreateFontMap(allFonts);
                    }
                }
            }
        }

        var series, pts;
        for(i = this.chart.plotArea.charts.length-1; i > -1; --i)
        {
            series = this.chart.plotArea.charts[i].series;
            for(j = series.length -1; j > -1; --j)
            {
                pts = AscFormat.getPtsFromSeries(series[i]);
                if(Array.isArray(pts))
                {
                    for(k = pts.length - 1; k > -1; --k)
                    {
                        pts[k].compiledDlb && pts[k].compiledDlb.txBody && pts[k].compiledDlb.txBody.content.Document_CreateFontMap(allFonts);
                    }
                }
            }
        }
    }
};
CChartSpace.prototype.setThemeOverride = function(pr)
{
    History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartSpace_SetThemeOverride, this.themeOverride,  pr));
    this.themeOverride = pr;
};
CChartSpace.prototype.setParent = function (parent)
{
    History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartSpace_SetParent, this.parent, parent ));
    this.parent = parent;
};
CChartSpace.prototype.setChart = function(chart)
{
    History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartSpace_SetChart, this.chart,  chart));
    this.chart = chart;
    if(chart)
    {
        chart.setParent(this);
    }
};
CChartSpace.prototype.setClrMapOvr = function(clrMapOvr)
{
    History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartSpace_SetClrMapOvr,  this.clrMapOvr, clrMapOvr));
    this.clrMapOvr = clrMapOvr;
};
CChartSpace.prototype.setDate1904 = function(date1904)
{
    History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_ChartSpace_SetDate1904, this.date1904, date1904));
    this.date1904 = date1904;
};
CChartSpace.prototype.setExternalData = function(externalData)
{
    History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartSpace_SetExternalData, this.externalData, externalData));
    this.externalData = externalData;
};
CChartSpace.prototype.setLang = function(lang)
{
    History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartSpace_SetLang, this.lang, lang));
    this.lang = lang;
};
CChartSpace.prototype.setPivotSource = function(pivotSource)
{
    History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartSpace_SetPivotSource, this.pivotSource, pivotSource));
    this.pivotSource = pivotSource;
};
CChartSpace.prototype.setPrintSettings = function(printSettings)
{
    History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartSpace_SetPrintSettings, this.printSettings, printSettings));
    this.printSettings = printSettings;
};
CChartSpace.prototype.setProtection = function(protection)
{
    History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartSpace_SetProtection, this.protection, protection));
    this.protection = protection;
};
CChartSpace.prototype.setRoundedCorners = function(roundedCorners)
{
    History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_ChartSpace_SetRoundedCorners, this.roundedCorners, roundedCorners));
    this.roundedCorners = roundedCorners;
};
CChartSpace.prototype.setSpPr = function(spPr)
{
    History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartSpace_SetSpPr, this.spPr, spPr));
    this.spPr = spPr;
};
CChartSpace.prototype.setStyle = function(style)
{
    History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ChartSpace_SetStyle, this.style, style));
    this.style = style;
    this.handleUpdateStyle();
};
CChartSpace.prototype.setTxPr = function(txPr)
{
    History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartSpace_SetTxPr, this.txPr, txPr));
    this.txPr = txPr;
    if(txPr)
    {
        txPr.setParent(this);
    }
};
CChartSpace.prototype.setUserShapes = function(userShapes)
{
    History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartSpace_SetUserShapes, this.userShapes, userShapes));
    this.userShapes = userShapes;
};
CChartSpace.prototype.getTransformMatrix = function()
{
    return this.transform;
};
CChartSpace.prototype.canRotate = function()
{
    return false;
};
CChartSpace.prototype.drawAdjustments = function()
{};
CChartSpace.prototype.isChart = function()
{
    return true;
};
CChartSpace.prototype.isShape = function()
{
    return false;
};
CChartSpace.prototype.isImage = function()
{
    return false;
};
CChartSpace.prototype.isGroup = function()
{
    return false;
};
CChartSpace.prototype.isPlaceholder = CShape.prototype.isPlaceholder;
CChartSpace.prototype.setGroup = function (group)
{
    History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartSpace_SetGroup, this.group, group ));
    this.group = group;
};

CChartSpace.prototype.getBase64Img = CShape.prototype.getBase64Img;

CChartSpace.prototype.getRangeObjectStr = function()
{
    if(this.recalcInfo.recalculateBBox)
    {
        this.recalculateBBox();
        this.recalcInfo.recalculateBBox = false;
    }
    var ret = {range: null, bVert: null};
    if(this.bbox && this.bbox.seriesBBox)
    {
        var r1 = this.bbox.seriesBBox.r1, r2 = this.bbox.seriesBBox.r2, c1 = this.bbox.seriesBBox.c1, c2 = this.bbox.seriesBBox.c2;
        ret.bVert = this.bbox.seriesBBox.bVert;
       if(this.bbox.seriesBBox.bVert)
       {
           if(this.bbox.catBBox)
           {
               if(r1 > 0)
               {
                   --r1;
               }
           }
           if(this.bbox.serBBox)
           {
               if(c1 > 0)
               {
                   --c1;
               }
           }
       }
       else
       {
           if(this.bbox.catBBox)
           {
               if(c1 > 0)
               {
                   --c1;
               }
           }
           if(this.bbox.serBBox)
           {
               if(r1 > 0)
               {
                   --r1;
               }
           }
       }
        var startCell = new CellAddress(r1, c1, 0);
        var endCell = new CellAddress(r2, c2, 0);

        var sStartCellId, sEndCellId;
        if (this.bbox.worksheet) {
            sStartCellId = startCell.getIDAbsolute();
            sEndCellId = endCell.getIDAbsolute();
            ret.range = parserHelp.get3DRef(this.bbox.worksheet.sName, sStartCellId === sEndCellId ?
                sStartCellId : sStartCellId + ':' + sEndCellId);
        }
    }
    return ret;
};

CChartSpace.prototype.recalculateBBox = function()
{
    this.bbox = null;
    this.seriesBBoxes = [];
    this.seriesTitlesBBoxes = [];
    this.catTitlesBBoxes = [];


    var series_bboxes = [], cat_bboxes = [], ser_titles_bboxes = [];

    var series_sheet, cur_bbox, parsed_formulas;

    if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0] && this.worksheet)
    {
        var series = this.chart.plotArea.charts[0].series;
        if(Array.isArray(series) && series.length > 0)
        {
            var series_title_f = [], cat_title_f, series_f = [], i, range1;
            var ref;

            var b_vert/*флаг означает, что значения в серии идут по горизонтали, а сами серии по вертикали сверху вниз*/
                , b_titles_vert;
            var first_series_sheet;
            for(i = 0; i < series.length; ++i)
            {
                var numRef = null;
                if(series[i].val)
                    numRef = series[i].val.numRef;
                else if(series[i].yVal)
                    numRef = series[i].yVal.numRef;
                if(numRef)
                {
                    parsed_formulas = this.parseChartFormula(numRef.f);
                    if(parsed_formulas && parsed_formulas.length > 0 && parsed_formulas[0].worksheet)
                    {
                        series_bboxes = series_bboxes.concat(parsed_formulas);
                        if(series_f !== null && parsed_formulas.length === 1)
                        {
                            series_sheet = parsed_formulas[0].worksheet;
                            if(!first_series_sheet)
                                first_series_sheet = series_sheet;
                            if(series_sheet !== first_series_sheet)
                                series_f = null;
                            if(parsed_formulas[0].bbox)
                            {
                                cur_bbox = parsed_formulas[0].bbox;
                                if(cur_bbox.r1 !== cur_bbox.r2 && cur_bbox.c1 !== cur_bbox.c2)
                                    series_f = null;
                                if(series_f && series_f.length > 0)
                                {
                                    if(!AscFormat.isRealBool(b_vert))
                                    {
                                        if(series_f[0].c1 === cur_bbox.c1 && series_f[0].c2 === cur_bbox.c2)
                                        {
                                            b_vert = true;
                                        }
                                        else if(series_f[0].r1 === cur_bbox.r1 && series_f[0].r2 === cur_bbox.r2)
                                        {
                                            b_vert = false;
                                        }
                                        else
                                        {
                                            series_f = null;
                                        }
                                    }
                                    else
                                    {
                                        if(b_vert)
                                        {
                                            if(!(series_f[0].c1 === cur_bbox.c1 && series_f[0].c2 === cur_bbox.c2))
                                            {
                                                series_f = null;
                                            }
                                        }
                                        else
                                        {
                                            if(!(series_f[0].r1 === cur_bbox.r1 && series_f[0].r2 === cur_bbox.r2))
                                            {
                                                series_f = null;
                                            }
                                        }
                                    }
                                    if(series_f)
                                    {
                                        if(b_vert )
                                        {
                                            if(cur_bbox.r1 - series_f[series_f.length-1].r1 !== 1)
                                                series_f = null;
                                        }
                                        else
                                        {
                                            if(cur_bbox.c1 - series_f[series_f.length-1].c1 !== 1)
                                                series_f = null;
                                        }
                                    }
                                }
                                if(series_f !== null)
                                    series_f.push(cur_bbox);
                            }
                            else
                                series_f = null;
                        }
                    }
                }
                else
                    series_f = null;
                if(series[i].tx && series[i].tx.strRef)
                {
                    parsed_formulas = this.parseChartFormula(series[i].tx.strRef.f);
                    if(parsed_formulas && parsed_formulas.length > 0 && parsed_formulas[0].worksheet)
                    {
                        ser_titles_bboxes = ser_titles_bboxes.concat(parsed_formulas);
                    }
                    if(series_title_f !== null)
                    {
                        if(!parsed_formulas || parsed_formulas.length !== 1 || !parsed_formulas[0].worksheet)
                        {
                            series_title_f = null;
                            continue;
                        }
                        var series_cat_sheet = parsed_formulas[0].worksheet;
                        if(series_cat_sheet !== first_series_sheet)
                        {
                            series_title_f = null;
                            continue;
                        }
                        cur_bbox = parsed_formulas[0].bbox;
                        if(cur_bbox)
                        {
                            if(cur_bbox.r1 !== cur_bbox.r2 || cur_bbox.c1 !== cur_bbox.c2)
                            {
                                series_title_f = null;
                                continue;
                            }
                            if(!AscFormat.isRealBool(b_titles_vert))
                            {
                                if(series_title_f.length > 0)
                                {
                                    if( cur_bbox.r1 - series_title_f[0].r1 === 1)
                                        b_titles_vert = true;
                                    else if(cur_bbox.c1 - series_title_f[0].c1 === 1)
                                        b_titles_vert = false;
                                    else
                                    {
                                        series_title_f = null;
                                        continue;
                                    }
                                }
                            }
                            else
                            {
                                if(b_titles_vert)
                                {
                                    if( cur_bbox.r1 - series_title_f[series_title_f.length-1].r1 !== 1)
                                    {
                                        series_title_f = null;
                                        continue;
                                    }
                                }
                                else
                                {
                                    if( cur_bbox.c1 - series_title_f[series_title_f.length-1].c1 !== 1)
                                    {
                                        series_title_f = null;
                                        continue;
                                    }
                                }
                            }
                            series_title_f.push(cur_bbox);
                        }
                        else
                        {
                            series_title_f = null;
                            continue;
                        }
                    }
                }
                else
                {
                    series_title_f = null;
                }
            }

            if(series[0].cat)
            {
                if(series[0].cat.strRef)
                {
                    ref = series[0].cat.strRef;
                }
                else if(series[0].cat.numRef)
                {
                    ref = series[0].cat.numRef;
                }
            }
            else if(series[0].xVal)
            {
                if(series[0].xVal.strRef)
                {
                    ref = series[0].xVal.strRef;
                }
                else if(series[0].xVal.numRef)
                {
                    ref = series[0].xVal.numRef;
                }
            }
            if(ref)
            {
                parsed_formulas = this.parseChartFormula(ref.f);
                if(parsed_formulas && parsed_formulas.length === 1 && parsed_formulas[0].worksheet)
                {
                    cat_bboxes = cat_bboxes.concat(parsed_formulas);
                    if(parsed_formulas.length === 1)
                    {
                        var cat_title_sheet = parsed_formulas[0].worksheet;
                        if(cat_title_sheet === first_series_sheet)
                        {
                            if(parsed_formulas[0].bbox)
                            {
                                cat_title_f = parsed_formulas[0].bbox;
                            }
                        }
                    }
                }
            }

            if(series_f !== null && series_f.length === 1)
            {
                if(series_f[0].r1 === series_f[0].r2 && series_f[0].c1 !== series_f[0].c2)
                {
                    b_vert = true;
                }
                else if(series_f[0].c1 === series_f[0].c2 && series_f[0].r1 !== series_f[0].r2)
                {
                    b_vert = false;
                }

                if(!AscFormat.isRealBool(b_vert) && Array.isArray(series_title_f) )
                {
                    if(series_f[0].r1 === series_f[0].r2 && series_title_f[0].r1 === series_f[0].r1)
                    {
                        b_vert = true;
                    }
                    else if(series_f[0].c1 === series_f[0].c2 && series_title_f[0].c1 === series_f[0].c1)
                    {
                        b_vert = false;
                    }
                }
                if(!AscFormat.isRealBool(b_vert))
                {
                    if(cat_title_f)
                    {
                        if(series_f[0].r1 === series_f[0].r2 && cat_title_f.c1 === series_f[0].c1 && cat_title_f.c2 === series_f[0].c2)
                        {
                            b_vert = true;
                        }
                        else if(series_f[0].c1 === series_f[0].c2 && cat_title_f.r1 === series_f[0].r1 && cat_title_f.r2 === series_f[0].r2)
                        {
                            b_vert = false;
                        }
                    }
                    if(!AscFormat.isRealBool(b_vert))
                    {
                        b_vert = true;
                    }
                }
            }

            if(series_f !== null && series_f.length > 0)
            {
                this.bbox =  {
                    seriesBBox: null,
                    catBBox: null,
                    serBBox: null,
                    worksheet: first_series_sheet
                };


                this.bbox.seriesBBox = {
                    r1: series_f[0].r1,
                    r2: series_f[series_f.length-1].r2,
                    c1: series_f[0].c1,
                    c2: series_f[series_f.length-1].c2,
                    bVert: b_vert
                };


                this.seriesBBoxes.push(new BBoxInfo(first_series_sheet, this.bbox.seriesBBox));

                if(cat_title_f)
                {
                    if(b_vert)
                    {
                        if(cat_title_f.c1 !== this.bbox.seriesBBox.c1
                            || cat_title_f.c2 !== this.bbox.seriesBBox.c2
                            || cat_title_f.r1 !== cat_title_f.r1)
                        {
                            cat_title_f = null;
                        }
                    }
                    else
                    {
                        if(cat_title_f.c1 !== cat_title_f.c2
                            || cat_title_f.r1 !== this.bbox.seriesBBox.r1
                            || cat_title_f.r2 !== this.bbox.seriesBBox.r2)
                        {
                            cat_title_f = null;
                        }
                    }
                    this.bbox.catBBox = cat_title_f;

                    if(cat_title_f)
                    {
                        this.catTitlesBBoxes.push(new BBoxInfo(first_series_sheet, cat_title_f));
                    }
                }
                if(Array.isArray(series_title_f))
                {
                    this.bbox.serBBox = {
                        r1: series_title_f[0].r1,
                        r2: series_title_f[series_title_f.length-1].r2,
                        c1: series_title_f[0].c1,
                        c2: series_title_f[series_title_f.length-1].c2
                    };
                    this.seriesTitlesBBoxes.push(new BBoxInfo(first_series_sheet, this.bbox.serBBox));
                }
            }
            else
            {
                for(i = 0;  i < series_bboxes.length; ++i)
                {
                    this.seriesBBoxes.push(new BBoxInfo(series_bboxes[i].worksheet, series_bboxes[i].bbox));
                }

                for(i = 0;  i < cat_bboxes.length; ++i)
                {
                    this.catTitlesBBoxes.push(new BBoxInfo(cat_bboxes[i].worksheet, cat_bboxes[i].bbox));
                }

                for(i = 0;  i < ser_titles_bboxes.length; ++i)
                {
                    this.seriesTitlesBBoxes.push(new BBoxInfo(ser_titles_bboxes[i].worksheet, ser_titles_bboxes[i].bbox));
                }
            }
        }
    }
};

CChartSpace.prototype.getCommonBBox = function()
{
    if(this.recalcInfo.recalculateBBox)
    {
        this.recalculateBBox();
        this.recalcInfo.recalculateBBox = false;
    }
    var oRet = null;
    if(this.bbox && this.bbox.seriesBBox && AscFormat.isRealBool(this.bbox.seriesBBox.bVert))
    {
        oRet = {r1: this.bbox.seriesBBox.r1, r2: this.bbox.seriesBBox.r2, c1: this.bbox.seriesBBox.c1, c2: this.bbox.seriesBBox.c2};
        if(this.bbox.seriesBBox.bVert)
        {
            if(this.bbox.catBBox )
            {
                if(this.bbox.catBBox.r1 === this.bbox.catBBox.r2 && this.bbox.catBBox.r1 === this.bbox.seriesBBox.r1 - 1)
                {
                    --oRet.r1;
                }
                else
                {
                    oRet = null;
                }
            }
            if(oRet)
            {
                if(this.bbox.serBBox)
                {
                    if(this.bbox.serBBox.c1 === this.bbox.serBBox.c2 && this.bbox.serBBox.c1 === this.bbox.seriesBBox.c1 - 1)
                    {
                        --oRet.c1;
                    }
                    else
                    {
                        oRet = null;
                    }
                }
            }
        }
        else
        {
            if(this.bbox.catBBox )
            {
                if(this.bbox.catBBox.c1 === this.bbox.catBBox.c2 && this.bbox.catBBox.c1 === this.bbox.seriesBBox.c1 - 1)
                {
                    --oRet.c1;
                }
                else
                {
                    oRet = null;
                }
            }
            if(oRet)
            {
                if(this.bbox.serBBox)
                {
                    if(this.bbox.serBBox.r1 === this.bbox.serBBox.r2 && this.bbox.serBBox.r1 === this.bbox.seriesBBox.r1 - 1)
                    {
                        --oRet.r1;
                    }
                    else
                    {
                        oRet = null;
                    }
                }
            }
        }
    }
    return oRet;

};

CChartSpace.prototype.checkValByNumRef = function(workbook, ser, val, bVertical)
{
    if(val && val.numRef && typeof val.numRef.f === "string"/*(!val.numRef.numCache || val.numRef.numCache.pts.length === 0)*/)
    {
        var aParsedRef = this.parseChartFormula(val.numRef.f);
        var num_cache;
        if(!val.numRef.numCache )
        {
            num_cache = new AscFormat.CNumLit();
            num_cache.setFormatCode("General");
        }
        else
        {
            num_cache = val.numRef.numCache;
            removePtsFromLit(num_cache);
        }
        var lit_format_code = typeof num_cache.formatCode === "string" && num_cache.formatCode.length > 0 ? num_cache.formatCode : "General";
        var pt_index = 0, i, j, cell, pt,  hidden = true, row_hidden, col_hidden, nPtCount, t;
        for(i = 0; i < aParsedRef.length; ++i)
        {
            var oCurRef = aParsedRef[i];
            var source_worksheet = oCurRef.worksheet;
            if(source_worksheet)
            {
                var range = oCurRef.bbox;
                var nLastNoEmptyIndex = null, dLastNoEmptyVal = null, aSpanPoints = [], nSpliceIndex = null;
                if(range.r1 === range.r2 || bVertical === true)
                {
                    row_hidden = source_worksheet.getRowHidden(range.r1);
                    for(j = range.c1;  j <= range.c2; ++j)
                    {
                        if(!row_hidden && !source_worksheet.getColHidden(j) || (this.displayHidden === true))
                        {
                            cell = source_worksheet.getCell3(range.r1, j);
                            var sCellValue = cell.getValue();
                            var value = parseFloat(sCellValue);
                            if(AscFormat.isRealNumber(value))
                            {
                                hidden = false;
                                pt = new AscFormat.CNumericPoint();
                                pt.setIdx(pt_index);
                                pt.setVal(value);
                                if(cell.getNumFormatStr() !== lit_format_code)
                                {
                                    pt.setFormatCode(cell.getNumFormatStr())
                                }
                                num_cache.addPt(pt);

                                if(aSpanPoints.length > 0 )
                                {
                                    if(AscFormat.isRealNumber(nLastNoEmptyIndex))
                                    {
                                        var oStartPoint = num_cache.getPtByIndex(nLastNoEmptyIndex);
                                        for(t = 0; t < aSpanPoints.length; ++t)
                                        {
                                            aSpanPoints[t].val = oStartPoint.val + ((pt.val - oStartPoint.val)/(aSpanPoints.length + 1))*(t+1);
                                            num_cache.pts.splice(nSpliceIndex + t, 0, aSpanPoints[t]);
                                        }
                                    }
                                    aSpanPoints.length = 0;
                                }
                                nLastNoEmptyIndex = pt_index;
                                nSpliceIndex = num_cache.pts.length;
                                dLastNoEmptyVal = pt.val;
                            }
                            else
                            {
                                if(AscFormat.isRealNumber(this.displayEmptyCellsAs) && this.displayEmptyCellsAs !== 1)
                                {
                                    if(this.displayEmptyCellsAs === 2 || ((typeof sCellValue === "string") && sCellValue.length > 0))
                                    {
                                        pt = new AscFormat.CNumericPoint();
                                        pt.setIdx(pt_index);
                                        pt.setVal(0);
                                        num_cache.addPt(pt);
                                        if(aSpanPoints.length > 0 )
                                        {
                                            if(AscFormat.isRealNumber(nLastNoEmptyIndex))
                                            {
                                                var oStartPoint = num_cache.getPtByIndex(nLastNoEmptyIndex);
                                                for(t = 0; t < aSpanPoints.length; ++t)
                                                {
                                                    aSpanPoints[t].val = oStartPoint.val + ((pt.val - oStartPoint.val)/(aSpanPoints.length + 1))*(t+1);
                                                    num_cache.pts.splice(nSpliceIndex + t, 0, aSpanPoints[t]);
                                                }
                                            }
                                            aSpanPoints.length = 0;
                                        }
                                        nLastNoEmptyIndex = pt_index;
                                        nSpliceIndex = num_cache.pts.length;
                                        dLastNoEmptyVal = pt.val;
                                    }
                                    else if(this.displayEmptyCellsAs === 0 && ser.getObjectType() === AscDFH.historyitem_type_LineSeries)
                                    {
                                        pt = new AscFormat.CNumericPoint();
                                        pt.setIdx(pt_index);
                                        pt.setVal(0);
                                        aSpanPoints.push(pt);
                                    }
                                }
                            }
                        }
                        pt_index++;
                    }
                }
                else
                {
                    col_hidden = source_worksheet.getColHidden(range.c1);
                    for(j = range.r1; j <= range.r2; ++j)
                    {
                        if(!col_hidden && !source_worksheet.getRowHidden(j) || (this.displayHidden === true))
                        {
                            cell = source_worksheet.getCell3(j, range.c1);
                            var value = parseFloat(cell.getValue());
                            if(AscFormat.isRealNumber(value))
                            {
                                hidden = false;
                                pt = new AscFormat.CNumericPoint();
                                pt.setIdx(pt_index);
                                pt.setVal(value);
                                if(cell.getNumFormatStr() !== lit_format_code)
                                {
                                    pt.setFormatCode(cell.getNumFormatStr());
                                }
                                num_cache.addPt(pt);

                            }
                        }
                        pt_index++;
                    }
                }

            }
            else{
                pt_index = 0;
                var fCollectArray = function(oRef, oNumCache){
                    if(Array.isArray(oRef)){
                        for(var i = 0; i < oRef.length; ++i){
                            if(Array.isArray(oRef[i])){
                                fCollectArray(oRef[i], oNumCache);
                            }
                            else{
                                cell = source_worksheet.getCell3(j, range.c1);
                                var value = parseFloat(cell.getValue());
                                if(AscFormat.isRealNumber(value))
                                {
                                    hidden = false;
                                    pt = new AscFormat.CNumericPoint();
                                    pt.setIdx(pt_index);
                                    pt.setVal(value);
                                    if(cell.getNumFormatStr() !== lit_format_code)
                                    {
                                        pt.setFormatCode(cell.getNumFormatStr());
                                    }
                                    num_cache.addPt(pt);

                                }
                            }
                        }
                    }

                }
                for(j = 0; j < oCurRef.length; ++j){
                    for(var k = 0; k < oCurRef[j].length; ++k){

                    }
                }
            }
        }
        num_cache.setPtCount(pt_index);
        val.numRef.setNumCache(num_cache);
        if(!(val instanceof AscFormat.CCat))
        {
            ser.isHidden = hidden;
            ser.isHiddenForLegend = hidden;
        }
    }
};

CChartSpace.prototype.checkCatByNumRef = function(oThis, ser, cat, bVertical)
{

    if(cat && cat.strRef && typeof cat.strRef.f === "string" /*(!cat.strRef.strCache || cat.strRef.strCache.pt.length === 0)*/)
    {
        var aParsedRef = this.parseChartFormula(cat.strRef.f);
        var str_cache = new AscFormat.CStrCache();
        //str_cache.setFormatCode("General");
        var pt_index = 0, i, j, cell, pt, value_width_format, row_hidden, col_hidden;

        var fParseTableDataString = function(oRef, oCache){
            if(Array.isArray(oRef)){
                for(var i = 0; i < oRef.length; ++i){
                    if(Array.isArray(oRef[i])){
                        fParseTableDataString(oRef, oCache);
                    }
                    else{
                        pt = new AscFormat.CStringPoint();
                        pt.setIdx(pt_index);
                        pt.setVal(oRef[i].value);
                        str_cache.addPt(pt);
                        ++pt_index;
                    }
                }
            }
        };
        for(i = 0; i < aParsedRef.length; ++i)
        {
            var oCurRef = aParsedRef[i];
            var source_worksheet = oCurRef.worksheet;
            if(source_worksheet)
            {
                var range = oCurRef.bbox;
                if(range.r1 === range.r2 || bVertical === true)
                {
                    row_hidden = source_worksheet.getRowHidden(range.r1);
                    for(j = range.c1;  j <= range.c2; ++j)
                    {
                        if(!row_hidden && !source_worksheet.getColHidden(j))
                        {
                            cell = source_worksheet.getCell3(range.r1, j);
                            value_width_format = cell.getValueWithFormat();
                            if(typeof value_width_format === "string" && value_width_format.length > 0)
                            {
                                pt = new AscFormat.CStringPoint();
                                pt.setIdx(pt_index);
                                pt.setVal(value_width_format);

                                str_cache.addPt(pt);
                                //addPointToMap(oThis.pointsMap, source_worksheet, range.r1, j, pt);
                            }
                        }
                        pt_index++;
                    }
                }
                else
                {
                    col_hidden = source_worksheet.getColHidden(range.c1);
                    for(j = range.r1;  j <= range.r2; ++j)
                    {
                        if(!col_hidden && !source_worksheet.getRowHidden(j))
                        {
                            cell = source_worksheet.getCell3(j, range.c1);
                            value_width_format = cell.getValueWithFormat();
                            if(typeof value_width_format === "string" && value_width_format.length > 0)
                            {
                                pt = new AscFormat.CStringPoint();
                                pt.setIdx(pt_index);
                                pt.setVal(cell.getValueWithFormat());
                                str_cache.addPt(pt);
                                //addPointToMap(oThis.pointsMap, source_worksheet, j, range.c1,  pt);
                            }
                        }
                        pt_index++;
                    }
                }
            }
            else{
                fParseTableDataString(oCurRef);
            }
        }
        str_cache.setPtCount(pt_index);
        cat.strRef.setStrCache(str_cache);
    }
};

CChartSpace.prototype.recalculateReferences = function()
{
    var worksheet = this.worksheet;
    //this.pointsMap = {};
    if(!worksheet)
        return;

    if(this.recalcInfo.recalculateBBox)
    {
        this.recalculateBBox();
        this.recalcInfo.recalculateBBox = false;
    }



    var charts, series, i, j, ser;
    charts = this.chart.plotArea.charts;
    var bVert = undefined;
    if(this.bbox && this.bbox.seriesBBox && AscFormat.isRealBool(this.bbox.seriesBBox.bVert))
    {
        bVert = this.bbox.seriesBBox.bVert;
    }
    for(i = 0; i < charts.length; ++i)
    {
        series = charts[i].series;
        var bHaveHidden = false, bHaveNoHidden = false;
        var bCheckFormatCode = false;
        if(charts[i].getObjectType() !== AscDFH.historyitem_type_ScatterChart)
        {
            for(j = 0; j < series.length; ++j)
            {
                ser = series[j];
                //val
                this.checkValByNumRef(this.worksheet.workbook, ser, ser.val);
                //cat
                this.checkValByNumRef(this.worksheet.workbook, ser, ser.cat, bVert);
                this.checkCatByNumRef(this, ser, ser.cat, bVert);
                //tx
                this.checkCatByNumRef(this, ser, ser.tx, AscFormat.isRealBool(bVert) ? !bVert : undefined);

                if(ser.isHidden)
                {
                    bHaveHidden = true;
                }
                else
                {
                    bHaveNoHidden = true;
                    if(!bCheckFormatCode &&
                        !((charts[i].getObjectType() === AscDFH.historyitem_type_BarChart && charts[i].grouping === AscFormat.BAR_GROUPING_PERCENT_STACKED)
                        || (charts[i].getObjectType() !== AscDFH.historyitem_type_BarChart && charts[i].grouping === AscFormat.GROUPING_PERCENT_STACKED))){
                        bCheckFormatCode = true;
                        var aAxId = charts[i].axId;
                        if(aAxId){
                            for(var s = 0; s < aAxId.length; ++s){
                                if(aAxId[s].getObjectType() === AscDFH.historyitem_type_ValAx){
                                    if(aAxId[s].numFmt && aAxId[s].numFmt.sourceLinked){
                                        var aPoints = AscFormat.getPtsFromSeries(ser);
                                        if(aPoints[0] && typeof aPoints[0].formatCode === "string" && aPoints[0].formatCode.length > 0){
                                            aAxId[s].numFmt.setFormatCode(aPoints[0].formatCode);
                                        }
                                        else{
                                            aAxId[s].numFmt.setFormatCode("General");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }
        else
        {
            for(j = 0; j < series.length; ++j)
            {
                ser = series[j];
                this.checkValByNumRef(this.worksheet.workbook, ser, ser.xVal, bVert);
                this.checkValByNumRef(this.worksheet.workbook, ser, ser.yVal);
                this.checkCatByNumRef(this, ser, ser.tx, AscFormat.isRealBool(bVert) ? !bVert : undefined);

                if(ser.isHidden)
                {
                    bHaveHidden = true;
                }
                else
                {
                    bHaveNoHidden = true;

                    if(!bCheckFormatCode){
                        bCheckFormatCode = true;
                        var aAxId = charts[i].axId;
                        if(aAxId){
                            for(var s = 0; s < aAxId.length; ++s){
                                if(aAxId[s].getObjectType() === AscDFH.historyitem_type_ValAx){
                                    if((aAxId[s].axPos === AscFormat.AX_POS_L || aAxId[s].axPos === AscFormat.AX_POS_R) && aAxId[s].numFmt && aAxId[s].numFmt.sourceLinked){
                                        var aPoints = AscFormat.getPtsFromSeries(ser);
                                        if(aPoints[0] && typeof aPoints[0].formatCode === "string" && aPoints[0].formatCode.length > 0){
                                            aAxId[s].numFmt.setFormatCode(aPoints[0].formatCode);
                                        }
                                        else{
                                            aAxId[s].numFmt.setFormatCode("General");
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            }
        }
        if(bHaveHidden && bHaveNoHidden)
        {
            for(j = 0; j < series.length; ++j)
            {
                series[j].isHidden = false;
            }
        }
    }
};

CChartSpace.prototype.checkEmptySeries = function()
{
    var chart_type = this.chart.plotArea.charts[0];
    var series = chart_type.series;
    var checkEmptyVal = function(val)
    {
        if(val.numRef)
        {
            if(!val.numRef.numCache)
                return true;
            if(val.numRef.numCache.pts.length === 0)
                return true;
        }
        else if(val.numLit)
        {
            if(val.numLit.pts.length === 0)
                return true;
        }
        else
        {
            return true;
        }
        return false;
    };
    for(var i = 0; i < series.length; ++i)
    {
        var ser = series[i];
        if(ser.val)
        {
            if(!checkEmptyVal(ser.val))
                return false;
        }
        if(ser.yVal)
        {
            if(!checkEmptyVal(ser.yVal))
                return false;
        }
    }
    return true;
};

CChartSpace.prototype.getNeedReflect = function()
{
    if(!this.chartObj)
    {
        this.chartObj = new AscFormat.CChartsDrawer();
    }
    return this.chartObj.calculatePositionLabelsCatAxFromAngle(this);
};

CChartSpace.prototype.getValAxisCrossType = function()
{
    if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0]){
        var chartType = this.chart.plotArea.charts[0].getObjectType();
        var valAx = this.chart.plotArea.valAx;
        if(chartType === AscDFH.historyitem_type_ScatterChart){
            return null;
        }
        else if(chartType !== AscDFH.historyitem_type_BarChart && (chartType !== AscDFH.historyitem_type_PieChart && chartType !== AscDFH.historyitem_type_DoughnutChart)
            || (chartType === AscDFH.historyitem_type_BarChart && this.chart.plotArea.charts[0].barDir !== AscFormat.BAR_DIR_BAR)){
            if(valAx){
                if(AscFormat.CChartsDrawer.prototype._isSwitchCurrent3DChart(this)){
                    if(chartType === AscDFH.historyitem_type_AreaChart || chartType === AscDFH.historyitem_type_SurfaceChart ){
                        return AscFormat.isRealNumber(valAx.crossBetween) ? valAx.crossBetween : AscFormat.CROSS_BETWEEN_MID_CAT;
                    }
                    else if(chartType === AscDFH.historyitem_type_LineChart){
                        return AscFormat.isRealNumber(valAx.crossBetween) ? valAx.crossBetween : AscFormat.CROSS_BETWEEN_BETWEEN;
                    }
                    else{
                        return AscFormat.CROSS_BETWEEN_BETWEEN;
                    }
                }
                else{
                    return AscFormat.isRealNumber(valAx.crossBetween) ? valAx.crossBetween :  ((chartType === AscDFH.historyitem_type_AreaChart|| chartType === AscDFH.historyitem_type_SurfaceChart ) ? AscFormat.CROSS_BETWEEN_MID_CAT : AscFormat.CROSS_BETWEEN_BETWEEN);
                }
            }
        }
        else if(chartType === AscDFH.historyitem_type_BarChart && this.chart.plotArea.charts[0].barDir === AscFormat.BAR_DIR_BAR){
            return AscFormat.isRealNumber(valAx.crossBetween) && !AscFormat.CChartsDrawer.prototype._isSwitchCurrent3DChart(this) ? valAx.crossBetween : AscFormat.CROSS_BETWEEN_BETWEEN;
        }
    }
    return null;
};

    CChartSpace.prototype.calculatePosByLayout = function(fPos, nLayoutMode, fLayoutValue, fSize, fChartSize){
        if(!AscFormat.isRealNumber(fLayoutValue)){
            return fPos;
        }
        var fRetPos = 0;
        if(nLayoutMode === AscFormat.LAYOUT_MODE_EDGE){
            fRetPos = fChartSize*fLayoutValue;
        }
        else{
            fRetPos = fPos + fChartSize*fLayoutValue;
        }
        if(fRetPos < 0){
            fRetPos = 0;
        }
        return fRetPos;
    };
    CChartSpace.prototype.calculateSizeByLayout = function(fPos, fChartSize, fLayoutSize, fSizeMode ){
        if(!AscFormat.isRealNumber(fLayoutSize)){
            return -1;
        }
        var fRetSize = Math.min(fChartSize*fLayoutSize, fChartSize);
        if(fSizeMode === AscFormat.LAYOUT_MODE_EDGE){
            fRetSize = fRetSize - fPos;
        }
        return fRetSize;
    };

    CChartSpace.prototype.calculateLabelsPositions = function(b_recalc_labels, b_recalc_legend)
    {
        var layout;
        for(var i = 0; i < this.recalcInfo.dataLbls.length; ++i)
        {
            var series = this.chart.plotArea.charts[0].series;
            if(this.recalcInfo.dataLbls[i].series && this.recalcInfo.dataLbls[i].pt)
            {

                var ser_idx = this.recalcInfo.dataLbls[i].series.idx; //сделаем проверку лежит ли серия с индексом this.recalcInfo.dataLbls[i].series.idx в сериях первой диаграммы
                for(var j = 0;  j < series.length; ++j)
                {
                    if(series[j].idx === this.recalcInfo.dataLbls[i].series.idx)
                    {
                        var bLayout = AscCommon.isRealObject(this.recalcInfo.dataLbls[i].layout) && (AscFormat.isRealNumber(this.recalcInfo.dataLbls[i].layout.x) || AscFormat.isRealNumber(this.recalcInfo.dataLbls[i].layout.y));
                        var pos = this.chartObj.reCalculatePositionText("dlbl", this, /*this.recalcInfo.dataLbls[i].series.idx todo здесь оставить как есть в chartDrawere выбирать серии по индексу*/j, this.recalcInfo.dataLbls[i].pt.idx, bLayout);//
                        if(this.recalcInfo.dataLbls[i].layout){
                            layout = this.recalcInfo.dataLbls[i].layout;
                            if(AscFormat.isRealNumber(layout.x)){
                                pos.x = this.calculatePosByLayout(pos.x, layout.xMode, layout.x, this.recalcInfo.dataLbls[i].extX, this.extX);
                            }
                            if(AscFormat.isRealNumber(layout.y)){
                                pos.y = this.calculatePosByLayout(pos.y, layout.yMode, layout.y, this.recalcInfo.dataLbls[i].extY, this.extY);
                            }
                        }
                        this.recalcInfo.dataLbls[i].setPosition(pos.x, pos.y);
                        break;
                    }
                }
            }
        }
        this.recalcInfo.dataLbls.length = 0;

        if(b_recalc_labels)
        {
            if(this.chart && this.chart.title)
            {
                var pos = this.chartObj.reCalculatePositionText("title", this, this.chart.title);
                if(this.chart.title.layout){
                    layout = this.chart.title.layout;
                    if(AscFormat.isRealNumber(layout.x)){
                        pos.x = this.calculatePosByLayout(pos.x, layout.xMode, layout.x, this.chart.title.extX, this.extX);
                    }if(AscFormat.isRealNumber(layout.y)){
                        pos.y = this.calculatePosByLayout(pos.y, layout.yMode, layout.y, this.chart.title.extY, this.extY);
                    }
                }
                this.chart.title.setPosition(pos.x, pos.y);
            }

            if(this.chart && this.chart.plotArea)
            {
                var hor_axis = this.chart.plotArea.getHorizontalAxis();
                if(hor_axis && hor_axis.title)
                {
                    var old_cat_ax = this.chart.plotArea.catAx;
                    this.chart.plotArea.catAx = hor_axis;
                    var pos = this.chartObj.reCalculatePositionText("catAx", this, hor_axis.title);

                    if(hor_axis.title.layout){
                        layout = hor_axis.title.layout;
                        if(AscFormat.isRealNumber(layout.x)){
                            pos.x = this.calculatePosByLayout(pos.x, layout.xMode, layout.x, hor_axis.title.extX, this.extX);
                        }if(AscFormat.isRealNumber(layout.y)){
                            pos.y = this.calculatePosByLayout(pos.y, layout.yMode, layout.y, hor_axis.title.extY, this.extY);
                        }
                    }

                    hor_axis.title.setPosition(pos.x, pos.y);

                    this.chart.plotArea.catAx = old_cat_ax;
                }
                var vert_axis = this.chart.plotArea.getVerticalAxis();
                if(vert_axis && vert_axis.title)
                {
                    var old_val_ax = this.chart.plotArea.valAx;
                    this.chart.plotArea.valAx = vert_axis;
                    var pos = this.chartObj.reCalculatePositionText("valAx", this, vert_axis.title);
                    if(vert_axis.title.layout){
                        layout = vert_axis.title.layout;
                        if(AscFormat.isRealNumber(layout.x)){
                            pos.x = this.calculatePosByLayout(pos.x, layout.xMode, layout.x, vert_axis.title.extX, this.extX);
                        }if(AscFormat.isRealNumber(layout.y)){
                            pos.y = this.calculatePosByLayout(pos.y, layout.yMode, layout.y, vert_axis.title.extY, this.extY);
                        }
                    }
                    vert_axis.title.setPosition(pos.x, pos.y);
                    this.chart.plotArea.valAx = old_val_ax;
                }
            }
        }

        if(b_recalc_legend && this.chart && this.chart.legend)
        {
            var bResetLegendPos = false;
            if(!AscFormat.isRealNumber(this.chart.legend.legendPos))
            {
                this.chart.legend.legendPos = Asc.c_oAscChartLegendShowSettings.bottom;
                bResetLegendPos = true;
            }
            var pos = this.chartObj.reCalculatePositionText("legend", this, this.chart.legend);
            if(this.chart.legend.layout){
                layout = this.chart.legend.layout;
                if(AscFormat.isRealNumber(layout.x)){
                    pos.x = this.calculatePosByLayout(pos.x, layout.xMode, layout.x, this.chart.legend.extX, this.extX);
                }if(AscFormat.isRealNumber(layout.y)){
                    pos.y = this.calculatePosByLayout(pos.y, layout.yMode, layout.y, this.chart.legend.extY, this.extY);
                }
            }
            this.chart.legend.setPosition(pos.x, pos.y);
            if(bResetLegendPos)
            {
                this.chart.legend.legendPos = null;
            }
        }
    };
    
CChartSpace.prototype.recalculateAxis = function()
{
    if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0])
    {
        var b_checkEmpty = this.checkEmptySeries();
        this.bEmptySeries = b_checkEmpty;

        var plot_area = this.chart.plotArea;
        var chart_object = plot_area.chart;
        var i;
        var chart_type = chart_object.getObjectType();
        var bWithoutLabels = false;
        if(plot_area.layout && plot_area.layout.layoutTarget === AscFormat.LAYOUT_TARGET_INNER){
            bWithoutLabels = true;
        }

        this.plotAreaRect = null;
        var rect;
        var bCorrectedLayoutRect = false;
        if(b_checkEmpty)
        {
            if(chart_type === AscDFH.historyitem_type_ScatterChart)
            {
                var x_ax, y_ax;
                y_ax = this.chart.plotArea.valAx;
                x_ax = this.chart.plotArea.catAx;
                y_ax.labels  = null;
                x_ax.labels  = null;

                y_ax.posX  = null;
                x_ax.posY  = null;
                y_ax.posY  = null;
                x_ax.posX  = null;


                y_ax.xPoints = null;
                x_ax.yPoints = null;
                y_ax.yPoints = null;
                x_ax.xPoints = null;
            }
            else if(chart_type !== AscDFH.historyitem_type_BarChart && (chart_type !== AscDFH.historyitem_type_PieChart && chart_type !== AscDFH.historyitem_type_DoughnutChart)
                || (chart_type === AscDFH.historyitem_type_BarChart && chart_object.barDir !== AscFormat.BAR_DIR_BAR))
            {
                var cat_ax, val_ax;
                val_ax = this.chart.plotArea.valAx;
                cat_ax = this.chart.plotArea.catAx;
                if(val_ax && cat_ax)
                {
                    val_ax.labels  = null;
                    cat_ax.labels  = null;

                    val_ax.posX  = null;
                    cat_ax.posY  = null;
                    val_ax.posY  = null;
                    cat_ax.posX  = null;

                    val_ax.xPoints  = null;
                    cat_ax.yPoints  = null;
                    val_ax.yPoints  = null;
                    cat_ax.xPoints  = null;
                    val_ax.transformYPoints  = null;
                    cat_ax.transformXPoints  = null;
                    val_ax.transformXPoints  = null;
                    cat_ax.transformYPoints  = null;
                }
            }
            else if(chart_type === AscDFH.historyitem_type_BarChart && chart_object.barDir === AscFormat.BAR_DIR_BAR)
            {
                var cat_ax, val_ax;
                var axis_by_types = chart_object.getAxisByTypes();
                cat_ax = axis_by_types.catAx[0];
                val_ax = axis_by_types.valAx[0];
                if(cat_ax && val_ax)
                {
                    val_ax.labels  = null;
                    cat_ax.labels  = null;

                    val_ax.posX  = null;
                    cat_ax.posY  = null;
                    val_ax.posY  = null;
                    cat_ax.posX  = null;

                    val_ax.xPoints  = null;
                    cat_ax.yPoints  = null;
                    val_ax.yPoints  = null;
                    cat_ax.xPoints  = null;
                    val_ax.transformYPoints  = null;
                    cat_ax.transformXPoints  = null;
                    val_ax.transformXPoints  = null;
                    cat_ax.transformYPoints  = null;
                }
            }
            return;
        }

        var bNeedReflect =  this.getNeedReflect();
        if(chart_type === AscDFH.historyitem_type_ScatterChart)
        {
            var x_ax, y_ax;
            y_ax = this.chart.plotArea.valAx;
            x_ax = this.chart.plotArea.catAx;
            if(x_ax && y_ax)
            {
                /*new recalc*/
                y_ax.labels  = null;
                x_ax.labels  = null;
                y_ax.posX  = null;
                x_ax.posY  = null;
                y_ax.posY  = null;
                x_ax.posX  = null;

                y_ax.xPoints = null;
                x_ax.yPoints  = null;
                y_ax.yPoints  = null;
                x_ax.xPoints  = null;
                var sizes = this.getChartSizes();
                rect = {x: sizes.startX, y:sizes.startY, w:sizes.w, h: sizes.h};
                var arr_val =  this.getValAxisValues();
                var arr_strings = [];
                var multiplier;
                if(y_ax.dispUnits)
                    multiplier = y_ax.dispUnits.getMultiplier();
                else
                    multiplier = 1;
                var num_fmt = y_ax.numFmt;
                if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                {
                    var num_format = oNumFormatCache.get(num_fmt.formatCode);
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        var calc_value = arr_val[i]*multiplier;
                        var rich_value = num_format.formatToChart(calc_value);
                        arr_strings.push(rich_value);
                    }
                }
                else
                {
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        var calc_value = arr_val[i]*multiplier;
                        arr_strings.push(calc_value + "");
                    }
                }

                //расчитаем подписи для вертикальной оси найдем ширину максимальной и возьмем её удвоенную за ширину подписей верт оси
                var left_align_labels = true;
                y_ax.labels = new AscFormat.CValAxisLabels(this, y_ax);
                y_ax.yPoints = [];
                var max_width = 0;
                for(i = 0; i < arr_strings.length; ++i)
                {
                    var dlbl = new AscFormat.CDLbl();
                    dlbl.parent = y_ax;
                    dlbl.chart = this;
                    dlbl.spPr = y_ax.spPr;
                    dlbl.txPr = y_ax.txPr;
                    dlbl.tx = new AscFormat.CChartText();
                    dlbl.tx.rich = AscFormat.CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                    if(i > 0)
                    {
                        dlbl.lastStyleObject = y_ax.labels.arrLabels[0].lastStyleObject;
                    }
                    var oRecalculateByMaxWord =  dlbl.tx.rich.recalculateByMaxWord();
                    var cur_width = oRecalculateByMaxWord.w;
                    if(i === arr_strings.length-1){
                        rect.y += oRecalculateByMaxWord.h/2;
                    }
                    if(cur_width > max_width)
                        max_width = cur_width;
                    y_ax.labels.arrLabels.push(dlbl);
                }


                //пока расстояние между подписями и краем блока с подписями берем размер шрифта.
                var hor_gap = y_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72);
                y_ax.labels.extX = max_width + hor_gap;

                /*расчитаем надписи в блоке для горизонтальной оси*/
                var arr_x_val = this.getXValAxisValues();
                var num_fmt = x_ax.numFmt;
                var string_pts = [];
                if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                {
                    var num_format = oNumFormatCache.get(num_fmt.formatCode);
                    for(i = 0; i < arr_x_val.length; ++i)
                    {
                        var calc_value = arr_x_val[i]*multiplier;
                        var rich_value = num_format.formatToChart(calc_value);
                        string_pts.push({val:rich_value});
                    }
                }
                else
                {
                    for(i = 0; i < arr_x_val.length; ++i)
                    {
                        var calc_value = arr_x_val[i]*multiplier;
                        string_pts.push({val:calc_value + ""});
                    }
                }

                x_ax.labels = new AscFormat.CValAxisLabels(this, x_ax);
                var bottom_align_labels = true;
                var max_height = 0;
                for(i = 0; i < string_pts.length; ++i)
                {
                    var dlbl = new AscFormat.CDLbl();
                    dlbl.parent = x_ax;
                    dlbl.chart = this;
                    dlbl.spPr = x_ax.spPr;
                    dlbl.txPr = x_ax.txPr;
                    dlbl.tx = new AscFormat.CChartText();
                    dlbl.tx.rich = AscFormat.CreateTextBodyFromString(string_pts[i].val.replace(oNonSpaceRegExp,  ' '), this.getDrawingDocument(), dlbl);
                    if(x_ax.labels.arrLabels[0])
                    {
                        dlbl.lastStyleObject = x_ax.labels.arrLabels[0].lastStyleObject;
                    }

                    var oWH = dlbl.tx.rich.recalculateByMaxWord();
                    var cur_height = oWH.h;
                    if(cur_height > max_height)
                        max_height = cur_height;
                    if(i === string_pts.length - 1){
                        rect.w -= oWH.w/2;
                    }
                    x_ax.labels.arrLabels.push(dlbl);
                }
                var vert_gap = x_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72);
                x_ax.labels.extY = max_height + vert_gap;


                /*расчитаем позицию блока с подпиясями вертикальной оси*/
                var x_ax_orientation = isRealObject(x_ax.scaling) && AscFormat.isRealNumber(x_ax.scaling.orientation) ? x_ax.scaling.orientation : AscFormat.ORIENTATION_MIN_MAX;
                var crosses;//точка на горизонтальной оси где её пересекает вертикальная
                if(y_ax.crosses === AscFormat.CROSSES_AUTO_ZERO)
                {
                    if(arr_x_val[0] <=0 && arr_x_val[arr_x_val.length -1] >= 0)
                        crosses = 0;
                    else if(arr_x_val[0] > 0)
                        crosses = arr_x_val[0];
                    else
                        crosses = arr_x_val[arr_x_val.length-1];
                }
                else if(y_ax.crosses === AscFormat.CROSSES_MAX)
                    crosses =  arr_x_val[arr_x_val.length-1];
                else if(y_ax.crosses === AscFormat.CROSSES_MIN)
                    crosses = arr_x_val[0];
                else if(AscFormat.isRealNumber(y_ax.crossesAt) && arr_val[0] <= y_ax.crossesAt && arr_val[arr_val.length-1] >= y_ax.crossesAt)
                {
                    crosses = y_ax.crossesAt;
                }
                else
                {
                    //в кайнем случае ведем себя как с AUTO_ZERO
                    if(arr_x_val[0] <=0 && arr_x_val[arr_x_val.length -1] >= 0)
                        crosses = 0;
                    else if(arr_x_val[0] > 0)
                        crosses = arr_x_val[0];
                    else
                        crosses = arr_x_val[arr_x_val.length-1];
                }


                var hor_interval_width = checkFiniteNumber(rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));
                var vert_interval_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length-1] - arr_val[0]));
                var arr_x_points = [], arr_y_points = [];
                var labels_pos = y_ax.tickLblPos;

                var first_hor_label_half_width = (x_ax.tickLblPos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE || x_ax.bDelete) ? 0 : x_ax.labels.arrLabels[0].tx.rich.content.XLimit/2;
                var last_hor_label_half_width = (x_ax.tickLblPos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE || x_ax.bDelete) ? 0 : x_ax.labels.arrLabels[x_ax.labels.arrLabels.length-1].tx.rich.content.XLimit/2;
                var left_gap = 0, right_gap = 0;
                if(x_ax_orientation === AscFormat.ORIENTATION_MIN_MAX)
                {
                    switch(labels_pos)
                    {
                        case c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH:
                        {
                            left_align_labels = false;

                            if(bNeedReflect)
                            {
                                right_gap = Math.max(last_hor_label_half_width, 0);
                            }
                            else
                            {
                                right_gap = Math.max(last_hor_label_half_width, y_ax.labels.extX);
                            }
                            if(!bWithoutLabels){
                                hor_interval_width = checkFiniteNumber((rect.w - right_gap - first_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = rect.x + first_hor_label_half_width + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                }
                                y_ax.labels.x = rect.x + first_hor_label_half_width + hor_interval_width*(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                y_ax.posX = rect.x + first_hor_label_half_width + (crosses-arr_x_val[0])*hor_interval_width;
                            }
                            else{
                                hor_interval_width = checkFiniteNumber(rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = rect.x + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                }
                                y_ax.labels.x = rect.x + hor_interval_width*(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                y_ax.posX = rect.x + (crosses-arr_x_val[0])*hor_interval_width;

                                if(y_ax.labels.x < 0 && !bNeedReflect){
                                    rect.x -= y_ax.labels.x;
                                    rect.w += y_ax.labels.x;
                                    bCorrectedLayoutRect = true;
                                }
                                if(y_ax.labels.x + y_ax.labels.extX > this.extX && !bNeedReflect){
                                    rect.w -= (y_ax.labels.x + y_ax.labels.extX - this.extX);
                                    bCorrectedLayoutRect = true;
                                }
                                if(bCorrectedLayoutRect){
                                    hor_interval_width = checkFiniteNumber(rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));
                                    for(i = 0; i < arr_x_val.length; ++i)
                                    {
                                        arr_x_points[i] = rect.x + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                    }
                                    y_ax.labels.x = rect.x + hor_interval_width*(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                    y_ax.posX = rect.x + (crosses-arr_x_val[0])*hor_interval_width;
                                }
                            }
                            break;
                        }
                        case c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW:
                        {
                            if(bNeedReflect)
                            {
                                left_gap = Math.max(first_hor_label_half_width, 0);
                            }
                            else
                            {
                                left_gap = Math.max(first_hor_label_half_width, y_ax.labels.extX);
                            }

                            if(!bWithoutLabels){
                                hor_interval_width = checkFiniteNumber((rect.w-left_gap - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = rect.x + left_gap + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                }
                                y_ax.labels.x = rect.x - y_ax.labels.extX;
                                y_ax.posX = rect.x + (crosses-arr_x_val[0])*hor_interval_width;
                            }
                            else{
                                hor_interval_width = checkFiniteNumber(rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = rect.x + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                }
                                y_ax.labels.x = rect.x - y_ax.labels.extX;
                                y_ax.posX = rect.x + (crosses-arr_x_val[0])*hor_interval_width;


                                if(y_ax.labels.x < 0 && !bNeedReflect){
                                    rect.x -= y_ax.labels.x;
                                    rect.w += y_ax.labels.x;
                                    bCorrectedLayoutRect = true;
                                }
                                if(y_ax.labels.x + y_ax.labels.extX > this.extX && !bNeedReflect){
                                    rect.w -= (y_ax.labels.x + y_ax.labels.extX - this.extX);
                                    bCorrectedLayoutRect = true;
                                }
                                if(bCorrectedLayoutRect){
                                    hor_interval_width = checkFiniteNumber(rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));
                                    for(i = 0; i < arr_x_val.length; ++i)
                                    {
                                        arr_x_points[i] = rect.x + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                    }
                                    y_ax.labels.x = rect.x - y_ax.labels.extX;
                                    y_ax.posX = rect.x + (crosses-arr_x_val[0])*hor_interval_width;
                                }

                            }

                            break;
                        }
                        case c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE:
                        {
                            if(!bWithoutLabels) {
                                y_ax.labels = null;
                                hor_interval_width = checkFiniteNumber((rect.w - first_hor_label_half_width - last_hor_label_half_width) / (arr_x_val[arr_x_val.length - 1] - arr_x_val[0]));
                                for (i = 0; i < arr_x_val.length; ++i) {
                                    arr_x_points[i] = rect.x + first_hor_label_half_width + hor_interval_width * (arr_x_val[i] - arr_x_val[0]);
                                }
                                y_ax.posX = rect.x + first_hor_label_half_width + hor_interval_width * (crosses - arr_x_val[0]);
                            }
                            else{
                                y_ax.labels = null;
                                hor_interval_width = checkFiniteNumber(rect.w/ (arr_x_val[arr_x_val.length - 1] - arr_x_val[0]));
                                for (i = 0; i < arr_x_val.length; ++i) {
                                    arr_x_points[i] = rect.x + first_hor_label_half_width + hor_interval_width * (arr_x_val[i] - arr_x_val[0]);
                                }
                                y_ax.posX = rect.x + hor_interval_width * (crosses - arr_x_val[0]);
                            }
                            break;
                        }
                        default :
                        {//c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO рядом с осью
                            if(y_ax.crosses === AscFormat.CROSSES_MAX)
                            {
                                left_align_labels = false;
                                if(bNeedReflect)
                                {
                                    right_gap = Math.max(right_gap, 0);
                                }
                                else
                                {
                                    right_gap = Math.max(right_gap, y_ax.labels.extX);
                                }

                                if(!bWithoutLabels){
                                    y_ax.labels.x = rect.x + rect.w - right_gap;
                                    y_ax.posX = rect.x + rect.w - right_gap;
                                    hor_interval_width = checkFiniteNumber((rect.w - right_gap - first_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));
                                    for(i = 0; i < arr_x_val.length; ++i)
                                    {
                                        arr_x_points[i] = rect.x + first_hor_label_half_width + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                    }
                                }
                                else{

                                    y_ax.labels.x = rect.x + rect.w;
                                    y_ax.posX = rect.x + rect.w;
                                    hor_interval_width = checkFiniteNumber(rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));
                                    for(i = 0; i < arr_x_val.length; ++i)
                                    {
                                        arr_x_points[i] = rect.x + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                    }

                                    if(y_ax.labels.x < 0 && !bNeedReflect){
                                        rect.x -= y_ax.labels.x;
                                        rect.w += y_ax.labels.x;
                                        bCorrectedLayoutRect = true;
                                    }
                                    if(y_ax.labels.x + y_ax.labels.extX > this.extX && !bNeedReflect){
                                        rect.w -= (y_ax.labels.x + y_ax.labels.extX - this.extX);
                                        bCorrectedLayoutRect = true;
                                    }
                                    if(bCorrectedLayoutRect){
                                        y_ax.labels.x = rect.x + rect.w;
                                        y_ax.posX = rect.x + rect.w;
                                        hor_interval_width = checkFiniteNumber(rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));
                                        for(i = 0; i < arr_x_val.length; ++i)
                                        {
                                            arr_x_points[i] = rect.x + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                        }
                                    }

                                }
                            }
                            else
                            {

                                if(!bWithoutLabels) {
                                    hor_interval_width = checkFiniteNumber((rect.w - first_hor_label_half_width - last_hor_label_half_width) / (arr_x_val[arr_x_val.length - 1] - arr_x_val[0]));
                                    if (!bNeedReflect && first_hor_label_half_width + (crosses - arr_x_val[0]) * hor_interval_width < y_ax.labels.extX) {
                                        hor_interval_width = checkFiniteNumber((rect.w - y_ax.labels.extX - last_hor_label_half_width) / (arr_x_val[arr_x_val.length - 1] - crosses));
                                    }
                                    y_ax.posX = rect.x + rect.w - last_hor_label_half_width - (arr_x_val[arr_x_val.length - 1] - crosses) * hor_interval_width;
                                    for (i = 0; i < arr_x_val.length; ++i) {
                                        arr_x_points[i] = y_ax.posX + (arr_x_val[i] - crosses) * hor_interval_width;
                                    }
                                    y_ax.labels.x = y_ax.posX - y_ax.labels.extX;
                                }
                                else{
                                    hor_interval_width = checkFiniteNumber(rect.w/ (arr_x_val[arr_x_val.length - 1] - arr_x_val[0]));
                                    y_ax.posX = rect.x + rect.w - (arr_x_val[arr_x_val.length - 1] - crosses) * hor_interval_width;
                                    for (i = 0; i < arr_x_val.length; ++i) {
                                        arr_x_points[i] = y_ax.posX + (arr_x_val[i] - crosses) * hor_interval_width;
                                    }
                                    y_ax.labels.x = y_ax.posX - y_ax.labels.extX;

                                    if(y_ax.labels.x < 0 && !bNeedReflect){
                                        rect.x -= y_ax.labels.x;
                                        rect.w += y_ax.labels.x;
                                        bCorrectedLayoutRect = true;
                                    }
                                    if(y_ax.labels.x + y_ax.labels.extX > this.extX && !bNeedReflect){
                                        rect.w -= (y_ax.labels.x + y_ax.labels.extX - this.extX);
                                        bCorrectedLayoutRect = true;
                                    }
                                    if(bCorrectedLayoutRect){
                                        hor_interval_width = checkFiniteNumber(rect.w/ (arr_x_val[arr_x_val.length - 1] - arr_x_val[0]));
                                        y_ax.posX = rect.x + rect.w - (arr_x_val[arr_x_val.length - 1] - crosses) * hor_interval_width;
                                        for (i = 0; i < arr_x_val.length; ++i) {
                                            arr_x_points[i] = y_ax.posX + (arr_x_val[i] - crosses) * hor_interval_width;
                                        }
                                        y_ax.labels.x = y_ax.posX - y_ax.labels.extX;
                                    }

                                }
                            }
                            break;
                        }
                    }
                }
                else
                {
                    switch(labels_pos)
                    {
                        case c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH:
                        {
                            if(bNeedReflect)
                            {
                                left_gap = Math.max(0, last_hor_label_half_width);
                            }
                            else
                            {
                                left_gap = Math.max(y_ax.labels.extX, last_hor_label_half_width);
                            }
                            if(!bWithoutLabels){
                                hor_interval_width = checkFiniteNumber((rect.w - left_gap - first_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));

                                y_ax.posX = rect.x + rect.w - (crosses - arr_x_val[0])*hor_interval_width - first_hor_label_half_width;
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = y_ax.posX - (arr_x_val[i]-crosses)*hor_interval_width;
                                }
                                y_ax.labels.x = y_ax.posX - (arr_x_val[arr_x_val.length-1]-crosses)*hor_interval_width - y_ax.labels.extX;
                            }
                            else{
                                hor_interval_width = checkFiniteNumber(rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));

                                y_ax.posX = rect.x + rect.w - (crosses - arr_x_val[0])*hor_interval_width;
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = y_ax.posX - (arr_x_val[i]-crosses)*hor_interval_width;
                                }
                                y_ax.labels.x = y_ax.posX - (arr_x_val[arr_x_val.length-1]-crosses)*hor_interval_width - y_ax.labels.extX;

                                if(y_ax.labels.x < 0 && !bNeedReflect){
                                    rect.x -= y_ax.labels.x;
                                    rect.w += y_ax.labels.x;
                                    bCorrectedLayoutRect = true;
                                }
                                if(y_ax.labels.x + y_ax.labels.extX > this.extX && !bNeedReflect){
                                    rect.w -= (y_ax.labels.x + y_ax.labels.extX - this.extX);
                                    bCorrectedLayoutRect = true;
                                }
                                if(bCorrectedLayoutRect){
                                    hor_interval_width = checkFiniteNumber(rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));

                                    y_ax.posX = rect.x + rect.w - (crosses - arr_x_val[0])*hor_interval_width;
                                    for(i = 0; i < arr_x_val.length; ++i)
                                    {
                                        arr_x_points[i] = y_ax.posX - (arr_x_val[i]-crosses)*hor_interval_width;
                                    }
                                    y_ax.labels.x = y_ax.posX - (arr_x_val[arr_x_val.length-1]-crosses)*hor_interval_width - y_ax.labels.extX;
                                }


                            }
                            break;
                        }
                        case c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW:
                        {
                            left_align_labels = false;

                            if(bNeedReflect)
                            {
                                right_gap = Math.max(0, first_hor_label_half_width);
                            }
                            else
                            {
                                right_gap = Math.max(y_ax.labels.extX, first_hor_label_half_width);
                            }

                            if(!bWithoutLabels){
                                hor_interval_width = checkFiniteNumber((rect.w - right_gap - last_hor_label_half_width)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));
                                y_ax.posX = rect.x + rect.w - right_gap - (crosses - arr_x_val[0])*hor_interval_width;
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = y_ax.posX - (arr_x_val[i]-crosses)*hor_interval_width;
                                }
                                y_ax.labels.x = rect.x + rect.w - right_gap;
                            }
                            else{
                                hor_interval_width = checkFiniteNumber(rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));
                                y_ax.posX = rect.x + rect.w - (crosses - arr_x_val[0])*hor_interval_width;
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = y_ax.posX - (arr_x_val[i]-crosses)*hor_interval_width;
                                }
                                y_ax.labels.x = rect.x + rect.w;

                                if(y_ax.labels.x < 0 && !bNeedReflect){
                                    rect.x -= y_ax.labels.x;
                                    rect.w += y_ax.labels.x;
                                    bCorrectedLayoutRect = true;
                                }
                                if(y_ax.labels.x + y_ax.labels.extX > this.extX && !bNeedReflect){
                                    rect.w -= (y_ax.labels.x + y_ax.labels.extX - this.extX);
                                    bCorrectedLayoutRect = true;
                                }
                                if(bCorrectedLayoutRect){
                                    hor_interval_width = checkFiniteNumber(rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]));
                                    y_ax.posX = rect.x + rect.w - (crosses - arr_x_val[0])*hor_interval_width;
                                    for(i = 0; i < arr_x_val.length; ++i)
                                    {
                                        arr_x_points[i] = y_ax.posX - (arr_x_val[i]-crosses)*hor_interval_width;
                                    }
                                    y_ax.labels.x = rect.x + rect.w;
                                }

                            }
                            break;
                        }
                        case c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE:
                        {
                            y_ax.labels = null;

                            if(!bWithoutLabels) {
                                hor_interval_width = checkFiniteNumber((rect.w - first_hor_label_half_width - last_hor_label_half_width) / (arr_x_val[arr_x_val.length - 1] - arr_x_val[0]));
                                y_ax.posX = rect.x + rect.w - first_hor_label_half_width - (crosses - arr_x_val[0]) * hor_interval_width;
                                for (i = 0; i < arr_x_val.length; ++i) {
                                    arr_x_points[i] = y_ax.posX - (arr_x_val[i] - crosses) * hor_interval_width;
                                }
                            }
                            else{
                                hor_interval_width = checkFiniteNumber(rect.w / (arr_x_val[arr_x_val.length - 1] - arr_x_val[0]));
                                y_ax.posX = rect.x + rect.w - (crosses - arr_x_val[0]) * hor_interval_width;
                                for (i = 0; i < arr_x_val.length; ++i) {
                                    arr_x_points[i] = y_ax.posX - (arr_x_val[i] - crosses) * hor_interval_width;
                                }
                            }
                            break;
                        }
                        default :
                        {//c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO рядом с осью

                            if(y_ax.crosses === AscFormat.CROSSES_MAX)
                            {
                                if(bNeedReflect)
                                {
                                    left_gap = Math.max(0, last_hor_label_half_width);
                                }
                                else
                                {
                                    left_gap = Math.max(y_ax.labels.extX, last_hor_label_half_width);
                                }
                                if(!bWithoutLabels) {
                                    hor_interval_width = checkFiniteNumber((rect.w - left_gap - first_hor_label_half_width) / (arr_x_val[arr_x_val.length - 1] - arr_x_val[0]));
                                    y_ax.posX = rect.x + rect.w - first_hor_label_half_width - (crosses - arr_x_val[0]) * hor_interval_width;
                                    y_ax.labels.x = y_ax.posX - ((arr_x_val[arr_x_val.length - 1] - crosses) * hor_interval_width) - y_ax.labels.extX;
                                }
                                else{
                                    hor_interval_width = checkFiniteNumber(rect.w/ (arr_x_val[arr_x_val.length - 1] - arr_x_val[0]));
                                    y_ax.posX = rect.x + rect.w  - (crosses - arr_x_val[0]) * hor_interval_width;
                                    y_ax.labels.x = y_ax.posX - ((arr_x_val[arr_x_val.length - 1] - crosses) * hor_interval_width) - y_ax.labels.extX;



                                    if(y_ax.labels.x < 0 && !bNeedReflect){
                                        rect.x -= y_ax.labels.x;
                                        rect.w += y_ax.labels.x;
                                        bCorrectedLayoutRect = true;
                                    }
                                    if(y_ax.labels.x + y_ax.labels.extX > this.extX && !bNeedReflect){
                                        rect.w -= (y_ax.labels.x + y_ax.labels.extX - this.extX);
                                        bCorrectedLayoutRect = true;
                                    }
                                    if(bCorrectedLayoutRect){
                                        hor_interval_width = checkFiniteNumber(rect.w/ (arr_x_val[arr_x_val.length - 1] - arr_x_val[0]));
                                        y_ax.posX = rect.x + rect.w  - (crosses - arr_x_val[0]) * hor_interval_width;
                                        y_ax.labels.x = y_ax.posX - ((arr_x_val[arr_x_val.length - 1] - crosses) * hor_interval_width) - y_ax.labels.extX;
                                    }

                                }
                            }
                            else
                            {
                                left_align_labels = false;
                                if(!bWithoutLabels) {
                                    hor_interval_width = checkFiniteNumber((rect.w - first_hor_label_half_width - last_hor_label_half_width) / (arr_x_val[arr_x_val.length - 1] - arr_x_val[0]));
                                    if (!bNeedReflect && first_hor_label_half_width + (crosses - arr_x_val[0]) * hor_interval_width < y_ax.labels.extX) {
                                        hor_interval_width = checkFiniteNumber((rect.w - y_ax.labels.extX - last_hor_label_half_width) / (arr_x_val[arr_x_val.length - 1] - crosses));
                                    }
                                    left_align_labels = false;
                                    y_ax.posX = rect.x + last_hor_label_half_width + hor_interval_width * (arr_x_val[arr_x_val.length - 1] - crosses);
                                    y_ax.labels.x = y_ax.posX;
                                }
                                else{
                                    hor_interval_width = checkFiniteNumber(rect.w / (arr_x_val[arr_x_val.length - 1] - arr_x_val[0]));
                                    left_align_labels = false;
                                    y_ax.posX = rect.x + hor_interval_width * (arr_x_val[arr_x_val.length - 1] - crosses);
                                    y_ax.labels.x = y_ax.posX;



                                    if(y_ax.labels.x < 0 && !bNeedReflect){
                                        rect.x -= y_ax.labels.x;
                                        rect.w += y_ax.labels.x;
                                        bCorrectedLayoutRect = true;
                                    }
                                    if(y_ax.labels.x + y_ax.labels.extX > this.extX && !bNeedReflect){
                                        rect.w -= (y_ax.labels.x + y_ax.labels.extX - this.extX);
                                        bCorrectedLayoutRect = true;
                                    }
                                    if(bCorrectedLayoutRect){
                                        hor_interval_width = checkFiniteNumber(rect.w / (arr_x_val[arr_x_val.length - 1] - arr_x_val[0]));
                                        left_align_labels = false;
                                        y_ax.posX = rect.x + hor_interval_width * (arr_x_val[arr_x_val.length - 1] - crosses);
                                        y_ax.labels.x = y_ax.posX;
                                    }

                                }
                            }
                            for(i = 0;  i < arr_x_val.length; ++i)
                            {
                                arr_x_points[i] = y_ax.posX - (arr_x_val[i] - crosses)*hor_interval_width;
                            }
                            break;
                        }
                    }
                }
                x_ax.interval = hor_interval_width;

                /*рассчитаем позицию блока с подписями горизонтальной оси*/
                var y_ax_orientation = isRealObject(y_ax.scaling) && AscFormat.isRealNumber(y_ax.scaling.orientation) ? y_ax.scaling.orientation : AscFormat.ORIENTATION_MIN_MAX;
                var crosses_x;
                if(x_ax.crosses === AscFormat.CROSSES_AUTO_ZERO)
                {
                    if(arr_val[0] <= 0 && arr_val[arr_val.length-1] >=0)
                    {
                        crosses_x = 0;
                    }
                    else if(arr_val[0] > 0)
                        crosses_x = arr_val[0];
                    else
                        crosses_x = arr_val[arr_val.length-1];
                }
                else if(x_ax.crosses === AscFormat.CROSSES_MAX)
                {
                    crosses_x = arr_val[arr_val.length-1];
                }
                else if(x_ax.crosses === AscFormat.CROSSES_MIN)
                {
                    crosses_x = arr_val[0];
                }
                else if(AscFormat.isRealNumber(x_ax.crossesAt) && arr_val[0] <= x_ax.crossesAt && arr_val[arr_val.length-1] >= x_ax.crossesAt)
                {
                    crosses_x = x_ax.crossesAt;
                }
                else
                {   //как с AUTO_ZERO
                    if(arr_val[0] <= 0 && arr_val[arr_val.length-1] >=0)
                    {
                        crosses_x = 0;
                    }
                    else if(arr_val[0] > 0)
                        crosses_x = arr_val[0];
                    else
                        crosses_x = arr_val[arr_val.length-1];
                }

                var tick_labels_pos_x = x_ax.tickLblPos;

                var first_vert_label_half_height = 0; //TODO (y_ax.tickLblPos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE || y_ax.bDelete) ? 0 :  y_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;
                var last_vert_label_half_height =  0; //(y_ax.tickLblPos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE || y_ax.bDelete) ? 0 :  y_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;

                var bottom_gap = 0, top_height = 0;
                if(y_ax_orientation === AscFormat.ORIENTATION_MIN_MAX)
                {
                    switch(tick_labels_pos_x)
                    {
                        case c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH:
                        {
                            bottom_align_labels = false;
                            var bottom_start_point = rect.y + rect.h - first_vert_label_half_height;


                            top_height = Math.max(x_ax.labels.extY, last_vert_label_half_height);
                            if(!bWithoutLabels){
                                vert_interval_height = checkFiniteNumber((rect.h - top_height - first_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]));

                                x_ax.labels.y = bottom_start_point - (arr_val[arr_val.length - 1] - arr_val[0])*vert_interval_height - x_ax.labels.extY;

                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = bottom_start_point - (arr_val[i] - arr_val[0])*vert_interval_height;
                                }
                                x_ax.posY = bottom_start_point - (crosses_x - arr_val[0])*vert_interval_height;
                            }
                            else{
                                vert_interval_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length-1] - arr_val[0]));

                                x_ax.labels.y = rect.y + rect.h - (arr_val[arr_val.length - 1] - arr_val[0])*vert_interval_height - x_ax.labels.extY;

                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0])*vert_interval_height;
                                }
                                x_ax.posY = rect.y + rect.h - (crosses_x - arr_val[0])*vert_interval_height;

                                var bCheckXLabels = false;
                                if(x_ax.labels.y < 0){
                                    bCheckXLabels = true;
                                    rect.y -= x_ax.labels.y;
                                    rect.h -= x_ax.labels.h;
                                }
                                if(x_ax.labels.y + x_ax.labels.extY > this.extY){
                                    bCheckXLabels = true;
                                    rect.h -= (x_ax.labels.y + x_ax.labels.extY - this.extY)
                                }
                                if(bCheckXLabels){
                                    vert_interval_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length-1] - arr_val[0]));
                                    x_ax.labels.y = rect.y + rect.h - (arr_val[arr_val.length - 1] - arr_val[0])*vert_interval_height - x_ax.labels.extY;
                                    for(i = 0; i < arr_val.length; ++i)
                                    {
                                        arr_y_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0])*vert_interval_height;
                                    }
                                    x_ax.posY = rect.y + rect.h - (crosses_x - arr_val[0])*vert_interval_height;
                                }
                            }
                            break;
                        }
                        case c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW:
                        {
                            bottom_gap = Math.max(x_ax.labels.extY, first_vert_label_half_height);
                            if(!bWithoutLabels){
                                x_ax.labels.y = rect.y + rect.h - bottom_gap;
                                vert_interval_height = checkFiniteNumber((rect.h - bottom_gap - last_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]));

                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = rect.y + rect.h - bottom_gap -  (arr_val[i] - arr_val[0])*vert_interval_height;
                                }
                                x_ax.posY = rect.y + rect.h - bottom_gap - (crosses_x - arr_val[0])*vert_interval_height;
                            }
                            else{
                                x_ax.labels.y = rect.y + rect.h;
                                vert_interval_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length-1] - arr_val[0]));

                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0])*vert_interval_height;
                                }
                                x_ax.posY = rect.y + rect.h - (crosses_x - arr_val[0])*vert_interval_height;

                                var bCheckXLabels = false;
                                if(x_ax.labels.y < 0){
                                    bCheckXLabels = true;
                                    rect.y -= x_ax.labels.y;
                                    rect.h -= x_ax.labels.h;
                                }
                                if(x_ax.labels.y + x_ax.labels.extY > this.extY){
                                    bCheckXLabels = true;
                                    rect.h -= (x_ax.labels.y + x_ax.labels.extY - this.extY)
                                }
                                if(bCheckXLabels){

                                    x_ax.labels.y = rect.y + rect.h;
                                    vert_interval_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length-1] - arr_val[0]));

                                    for(i = 0; i < arr_val.length; ++i)
                                    {
                                        arr_y_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0])*vert_interval_height;
                                    }
                                    x_ax.posY = rect.y + rect.h - (crosses_x - arr_val[0])*vert_interval_height;
                                }
                            }
                            break;
                        }
                        case c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE:
                        {
                            x_ax.labels = null;
                            if(!bWithoutLabels){
                                vert_interval_height = checkFiniteNumber((rect.h - first_vert_label_half_height - last_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]));
                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = rect.y + rect.h - first_vert_label_half_height - (arr_val[i] - arr_val[0])*vert_interval_height;
                                }
                                x_ax.posY = rect.y + rect.h - first_vert_label_half_height - (crosses_x - arr_val[0])*vert_interval_height;
                            }
                            else{
                                vert_interval_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length-1] - arr_val[0]));
                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0])*vert_interval_height;
                                }
                                x_ax.posY = rect.y + rect.h - (crosses_x - arr_val[0])*vert_interval_height;
                            }
                            break;
                        }
                        default :
                        {//c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO рядом с осью
                            if(x_ax.crosses === AscFormat.CROSSES_MAX)
                            {
                                bottom_align_labels = false;
                                top_height = Math.max(x_ax.labels.extY, last_vert_label_half_height);


                                if(!bWithoutLabels) {
                                    vert_interval_height = checkFiniteNumber((rect.h - top_height - first_vert_label_half_height) / (arr_val[arr_val.length - 1] - arr_val[0]));
                                    for (i = 0; i < arr_val.length; ++i) {
                                        arr_y_points[i] = rect.y + rect.h - first_vert_label_half_height - (arr_val[i] - arr_val[0]) * vert_interval_height;
                                    }
                                    x_ax.posY = rect.y + rect.h - first_vert_label_half_height - (arr_val[arr_val.length - 1] - arr_val[0]) * vert_interval_height;
                                    x_ax.labels.y = x_ax.posY - x_ax.labels.extY;
                                }
                                else{
                                    vert_interval_height = checkFiniteNumber(rect.h / (arr_val[arr_val.length - 1] - arr_val[0]));
                                    for (i = 0; i < arr_val.length; ++i) {
                                        arr_y_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0]) * vert_interval_height;
                                    }
                                    x_ax.posY = rect.y + rect.h - (arr_val[arr_val.length - 1] - arr_val[0]) * vert_interval_height;
                                    x_ax.labels.y = x_ax.posY - x_ax.labels.extY;



                                    var bCheckXLabels = false;
                                    if(x_ax.labels.y < 0){
                                        bCheckXLabels = true;
                                        rect.y -= x_ax.labels.y;
                                        rect.h -= x_ax.labels.h;
                                    }
                                    if(x_ax.labels.y + x_ax.labels.extY > this.extY){
                                        bCheckXLabels = true;
                                        rect.h -= (x_ax.labels.y + x_ax.labels.extY - this.extY)
                                    }
                                    if(bCheckXLabels){
                                        vert_interval_height = checkFiniteNumber(rect.h / (arr_val[arr_val.length - 1] - arr_val[0]));
                                        for (i = 0; i < arr_val.length; ++i) {
                                            arr_y_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0]) * vert_interval_height;
                                        }
                                        x_ax.posY = rect.y + rect.h - (arr_val[arr_val.length - 1] - arr_val[0]) * vert_interval_height;
                                        x_ax.labels.y = x_ax.posY - x_ax.labels.extY;
                                    }

                                }
                            }
                            else
                            {
                                if(!bWithoutLabels) {
                                    vert_interval_height = checkFiniteNumber((rect.h - first_vert_label_half_height - last_vert_label_half_height) / (arr_val[arr_val.length - 1] - arr_val[0]));
                                    if (first_vert_label_half_height + (crosses_x - arr_val[0]) * vert_interval_height < x_ax.labels.extY) {
                                        vert_interval_height = checkFiniteNumber((rect.h - x_ax.labels.extY - last_vert_label_half_height) / (arr_val[arr_val.length - 1] - crosses_x));
                                    }

                                    x_ax.posY = rect.y + last_vert_label_half_height + (arr_val[arr_val.length - 1] - crosses_x) * vert_interval_height;
                                    x_ax.labels.y = x_ax.posY;
                                    for (i = 0; i < arr_val.length; ++i) {
                                        arr_y_points[i] = x_ax.posY - (arr_val[i] - crosses_x) * vert_interval_height;
                                    }
                                }
                                else{
                                    vert_interval_height = checkFiniteNumber(rect.h / (arr_val[arr_val.length - 1] - arr_val[0]));


                                    x_ax.posY = rect.y + (arr_val[arr_val.length - 1] - crosses_x) * vert_interval_height;
                                    x_ax.labels.y = x_ax.posY;
                                    for (i = 0; i < arr_val.length; ++i) {
                                        arr_y_points[i] = x_ax.posY - (arr_val[i] - crosses_x) * vert_interval_height;
                                    }


                                    var bCheckXLabels = false;
                                    if(x_ax.labels.y < 0){
                                        bCheckXLabels = true;
                                        rect.y -= x_ax.labels.y;
                                        rect.h -= x_ax.labels.h;
                                    }
                                    if(x_ax.labels.y + x_ax.labels.extY > this.extY){
                                        bCheckXLabels = true;
                                        rect.h -= (x_ax.labels.y + x_ax.labels.extY - this.extY)
                                    }
                                    if(bCheckXLabels){
                                        vert_interval_height = checkFiniteNumber(rect.h / (arr_val[arr_val.length - 1] - arr_val[0]));
                                        x_ax.posY = rect.y + (arr_val[arr_val.length - 1] - crosses_x) * vert_interval_height;
                                        x_ax.labels.y = x_ax.posY;
                                        for (i = 0; i < arr_val.length; ++i) {
                                            arr_y_points[i] = x_ax.posY - (arr_val[i] - crosses_x) * vert_interval_height;
                                        }
                                    }

                                }
                            }
                            break;
                        }
                    }
                }
                else
                {
                    switch(tick_labels_pos_x)
                    {
                        case c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH:
                        {
                            bottom_gap = Math.max(last_vert_label_half_height, x_ax.labels.extY);
                            if(!bWithoutLabels) {
                                vert_interval_height = checkFiniteNumber((rect.h - bottom_gap - first_vert_label_half_height) / (arr_val[arr_val.length - 1] - arr_val[0]));
                                x_ax.posY = rect.y + first_vert_label_half_height + (crosses_x - arr_val[0]) * vert_interval_height;
                                for (i = 0; i < arr_val.length; ++i) {
                                    arr_y_points[i] = x_ax.posY + vert_interval_height * (arr_val[i] - crosses_x);
                                }
                                x_ax.labels.y = x_ax.posY + vert_interval_height * (arr_val[arr_val.length - 1] - crosses_x);
                            }
                            else{
                                vert_interval_height = checkFiniteNumber(rect.h / (arr_val[arr_val.length - 1] - arr_val[0]));
                                x_ax.posY = rect.y + (crosses_x - arr_val[0]) * vert_interval_height;
                                for (i = 0; i < arr_val.length; ++i) {
                                    arr_y_points[i] = x_ax.posY + vert_interval_height * (arr_val[i] - crosses_x);
                                }
                                x_ax.labels.y = x_ax.posY + vert_interval_height * (arr_val[arr_val.length - 1] - crosses_x);


                                var bCheckXLabels = false;
                                if(x_ax.labels.y < 0){
                                    bCheckXLabels = true;
                                    rect.y -= x_ax.labels.y;
                                    rect.h -= x_ax.labels.h;
                                }
                                if(x_ax.labels.y + x_ax.labels.extY > this.extY){
                                    bCheckXLabels = true;
                                    rect.h -= (x_ax.labels.y + x_ax.labels.extY - this.extY)
                                }
                                if(bCheckXLabels){
                                    vert_interval_height = checkFiniteNumber(rect.h / (arr_val[arr_val.length - 1] - arr_val[0]));
                                    x_ax.posY = rect.y + (crosses_x - arr_val[0]) * vert_interval_height;
                                    for (i = 0; i < arr_val.length; ++i) {
                                        arr_y_points[i] = x_ax.posY + vert_interval_height * (arr_val[i] - crosses_x);
                                    }
                                    x_ax.labels.y = x_ax.posY + vert_interval_height * (arr_val[arr_val.length - 1] - crosses_x);
                                }

                            }
                            break;
                        }
                        case c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW:
                        {
                            top_height = Math.max(x_ax.labels.extY, first_vert_label_half_height);

                            bottom_align_labels = false;
                            if(!bWithoutLabels) {
                                vert_interval_height = checkFiniteNumber((rect.h - top_height - last_vert_label_half_height) / (arr_val[arr_val.length - 1] - arr_val[0]));
                                x_ax.posY = rect.y + top_height + (crosses_x - arr_val[0]) * vert_interval_height;
                                for (i = 0; i < arr_val.length; ++i) {
                                    arr_y_points[i] = rect.y + top_height + vert_interval_height * (arr_val[i] - arr_val[0]);
                                }
                                x_ax.labels.y = rect.y + top_height - x_ax.labels.extY;
                            }
                            else{
                                vert_interval_height = checkFiniteNumber(rect.h / (arr_val[arr_val.length - 1] - arr_val[0]));
                                x_ax.posY = rect.y + (crosses_x - arr_val[0]) * vert_interval_height;
                                for (i = 0; i < arr_val.length; ++i) {
                                    arr_y_points[i] = rect.y + vert_interval_height * (arr_val[i] - arr_val[0]);
                                }
                                x_ax.labels.y = rect.y - x_ax.labels.extY;


                                var bCheckXLabels = false;
                                if(x_ax.labels.y < 0){
                                    bCheckXLabels = true;
                                    rect.y -= x_ax.labels.y;
                                    rect.h -= x_ax.labels.h;
                                }
                                if(x_ax.labels.y + x_ax.labels.extY > this.extY){
                                    bCheckXLabels = true;
                                    rect.h -= (x_ax.labels.y + x_ax.labels.extY - this.extY)
                                }
                                if(bCheckXLabels){
                                    vert_interval_height = checkFiniteNumber(rect.h / (arr_val[arr_val.length - 1] - arr_val[0]));
                                    x_ax.posY = rect.y + (crosses_x - arr_val[0]) * vert_interval_height;
                                    for (i = 0; i < arr_val.length; ++i) {
                                        arr_y_points[i] = rect.y + vert_interval_height * (arr_val[i] - arr_val[0]);
                                    }
                                    x_ax.labels.y = rect.y - x_ax.labels.extY;
                                }
                            }
                            break;
                        }
                        case c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE:
                        {
                            x_ax.labels = null;
                            if(!bWithoutLabels){
                                vert_interval_height = checkFiniteNumber((rect.h - first_vert_label_half_height - last_vert_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]));
                                x_ax.posY = rect.y + first_vert_label_half_height + (crosses_x-arr_val[0])*vert_interval_height;
                                for(i = 0; i < arr_val.length;++i)
                                {
                                    arr_y_points[i] = rect.y + first_vert_label_half_height + vert_interval_height*(arr_val[i] - arr_val[0]);
                                }
                            }
                            else{
                                vert_interval_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length-1] - arr_val[0]));
                                x_ax.posY = rect.y + (crosses_x-arr_val[0])*vert_interval_height;
                                for(i = 0; i < arr_val.length;++i)
                                {
                                    arr_y_points[i] = rect.y + vert_interval_height*(arr_val[i] - arr_val[0]);
                                }
                            }
                            break;
                        }
                        default :
                        {//c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO рядом с осью
                            if(x_ax.crosses === AscFormat.CROSSES_MAX)
                            {
                                bottom_gap = Math.max(x_ax.labels.extY, last_vert_label_half_height);


                                if(!bWithoutLabels) {
                                    vert_interval_height = checkFiniteNumber((rect.h - bottom_gap - first_vert_label_half_height) / (arr_val[arr_val.length - 1] - arr_val[0]));
                                    x_ax.posY = rect.y + first_vert_label_half_height + (crosses_x - arr_val[0]) * vert_interval_height;
                                    for (i = 0; i < arr_val.length; ++i) {
                                        arr_y_points[i] = rect.y + first_vert_label_half_height + vert_interval_height * (arr_val[i] - arr_val[0]);
                                    }
                                    x_ax.labels.y = rect.y + rect.extY - bottom_gap;
                                }
                                else{
                                    vert_interval_height = checkFiniteNumber(rect.h / (arr_val[arr_val.length - 1] - arr_val[0]));
                                    x_ax.posY = rect.y + (crosses_x - arr_val[0]) * vert_interval_height;
                                    for (i = 0; i < arr_val.length; ++i) {
                                        arr_y_points[i] = rect.y + vert_interval_height * (arr_val[i] - arr_val[0]);
                                    }
                                    x_ax.labels.y = rect.y + rect.extY;


                                    var bCheckXLabels = false;
                                    if(x_ax.labels.y < 0){
                                        bCheckXLabels = true;
                                        rect.y -= x_ax.labels.y;
                                        rect.h -= x_ax.labels.h;
                                    }
                                    if(x_ax.labels.y + x_ax.labels.extY > this.extY){
                                        bCheckXLabels = true;
                                        rect.h -= (x_ax.labels.y + x_ax.labels.extY - this.extY)
                                    }
                                    if(bCheckXLabels){
                                        vert_interval_height = checkFiniteNumber(rect.h / (arr_val[arr_val.length - 1] - arr_val[0]));
                                        x_ax.posY = rect.y + (crosses_x - arr_val[0]) * vert_interval_height;
                                        for (i = 0; i < arr_val.length; ++i) {
                                            arr_y_points[i] = rect.y + vert_interval_height * (arr_val[i] - arr_val[0]);
                                        }
                                        x_ax.labels.y = rect.y + rect.extY;
                                    }
                                }
                            }
                            else
                            {
                                bottom_align_labels = false;

                                if(!bWithoutLabels) {

                                    vert_interval_height = checkFiniteNumber((rect.h - last_vert_label_half_height - first_vert_label_half_height) / (arr_val[arr_val.length - 1] - arr_val[0]));
                                    if (first_vert_label_half_height + (crosses_x - arr_val[0]) * vert_interval_height < x_ax.labels.extY) {
                                        x_ax.posY = rect.y + x_ax.labels.extY;
                                        vert_interval_height = checkFiniteNumber((rect.h - x_ax.labels.extY - last_vert_label_half_height) / (arr_val[arr_val.length - 1] - crosses_x));
                                    }
                                    else {
                                        x_ax.posY = rect.y + rect.h - vert_interval_height * (arr_val[arr_val.length - 1] - crosses_x) - last_vert_label_half_height;
                                    }
                                    x_ax.labels.y = x_ax.posY - x_ax.labels.extY;
                                    for (i = 0; i < arr_val.length; ++i) {
                                        arr_y_points[i] = x_ax.posY + vert_interval_height * (arr_val[i] - crosses_x);
                                    }
                                }
                                else{
                                    vert_interval_height = checkFiniteNumber(rect.h / (arr_val[arr_val.length - 1] - arr_val[0]));
                                    x_ax.posY = rect.y + rect.h - vert_interval_height * (arr_val[arr_val.length - 1] - crosses_x);
                                    x_ax.labels.y = x_ax.posY - x_ax.labels.extY;
                                    for (i = 0; i < arr_val.length; ++i) {
                                        arr_y_points[i] = x_ax.posY + vert_interval_height * (arr_val[i] - crosses_x);
                                    }

                                    var bCheckXLabels = false;
                                    if(x_ax.labels.y < 0){
                                        bCheckXLabels = true;
                                        rect.y -= x_ax.labels.y;
                                        rect.h -= x_ax.labels.h;
                                    }
                                    if(x_ax.labels.y + x_ax.labels.extY > this.extY){
                                        bCheckXLabels = true;
                                        rect.h -= (x_ax.labels.y + x_ax.labels.extY - this.extY)
                                    }
                                    if(bCheckXLabels){
                                        vert_interval_height = checkFiniteNumber(rect.h / (arr_val[arr_val.length - 1] - arr_val[0]));
                                        x_ax.posY = rect.y + rect.h - vert_interval_height * (arr_val[arr_val.length - 1] - crosses_x);
                                        x_ax.labels.y = x_ax.posY - x_ax.labels.extY;
                                        for (i = 0; i < arr_val.length; ++i) {
                                            arr_y_points[i] = x_ax.posY + vert_interval_height * (arr_val[i] - crosses_x);
                                        }
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                y_ax.interval = vert_interval_height;

                y_ax.yPoints = [];
                for(i = 0; i < arr_val.length; ++i)
                {
                    y_ax.yPoints.push({pos: arr_y_points[i], val: arr_val[i]});
                }


                x_ax.xPoints = [];
                for(i = 0; i < arr_x_val.length; ++i)
                {
                    x_ax.xPoints.push({pos: arr_x_points[i], val: arr_x_val[i]});
                }

                var arr_labels;
                var text_transform;
                var local_text_transform;
                if(x_ax.bDelete)
                {
                    x_ax.labels = null;
                }
                if(y_ax.bDelete)
                {
                    y_ax.labels = null;
                }
                if(x_ax.labels)
                {
                    arr_labels = x_ax.labels.arrLabels;
                    x_ax.labels.align = bottom_align_labels;
                    if(bottom_align_labels)
                    {
                        var top_line = x_ax.labels.y + vert_gap;
                        for(i = 0; i < arr_labels.length; ++i)
                        {
                            if(arr_labels[i])
                            {
                                arr_labels[i].txBody = arr_labels[i].tx.rich;
                                text_transform = arr_labels[i].transformText;


                                text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(text_transform, arr_x_points[i] - arr_labels[i].tx.rich.content.XLimit/2, top_line);
                               // global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());


                                local_text_transform = arr_labels[i].localTransformText;
                                local_text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(local_text_transform, arr_x_points[i] - arr_labels[i].tx.rich.content.XLimit/2, top_line);
                            }
                        }
                    }
                    else
                    {
                        for(i = 0; i < arr_labels.length; ++i)
                        {
                            if(arr_labels[i])
                            {
                                arr_labels[i].txBody = arr_labels[i].tx.rich;
                                text_transform = arr_labels[i].transformText;
                                text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(text_transform, arr_x_points[i] - arr_labels[i].tx.rich.content.XLimit/2, x_ax.labels.y + x_ax.labels.extY - vert_gap - arr_labels[i].tx.rich.content.Get_SummaryHeight());
                              //  global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());

                                local_text_transform = arr_labels[i].localTransformText;
                                local_text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(local_text_transform, arr_x_points[i] - arr_labels[i].tx.rich.content.XLimit/2, x_ax.labels.y + x_ax.labels.extY - vert_gap - arr_labels[i].tx.rich.content.Get_SummaryHeight());

                            }
                        }
                    }
                }


                if(y_ax.labels)
                {
                    if(bNeedReflect)
                    {
                        if(left_align_labels)
                        {
                            left_align_labels = false;
                            y_ax.labels.x += y_ax.labels.extX;
                        }
                        else
                        {
                            left_align_labels = true;
                            y_ax.labels.x -= y_ax.labels.extX;
                        }
                    }
                    y_ax.labels.align = left_align_labels;
                    arr_labels = y_ax.labels.arrLabels;
                    if(left_align_labels)
                    {
                        for(i = 0; i < arr_labels.length; ++i)
                        {
                            if(arr_labels[i])
                            {
                                arr_labels[i].txBody = arr_labels[i].tx.rich;
                                text_transform = arr_labels[i].transformText;
                                text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(text_transform, y_ax.labels.x + y_ax.labels.extX - hor_gap - arr_labels[i].tx.rich.content.XLimit, arr_y_points[i] - arr_labels[i].tx.rich.content.Get_SummaryHeight()/2);
                           //     global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());

                                local_text_transform = arr_labels[i].localTransformText;
                                local_text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(local_text_transform, y_ax.labels.x + y_ax.labels.extX - hor_gap - arr_labels[i].tx.rich.content.XLimit, arr_y_points[i] - arr_labels[i].tx.rich.content.Get_SummaryHeight()/2);
                            }
                        }
                    }
                    else
                    {
                        for(i = 0; i < arr_labels.length; ++i)
                        {
                            if(arr_labels[i])
                            {
                                arr_labels[i].txBody = arr_labels[i].tx.rich;
                                text_transform = arr_labels[i].transformText;
                                text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(text_transform, y_ax.labels.x + hor_gap, arr_y_points[i] - arr_labels[i].tx.rich.content.Get_SummaryHeight()/2);
                           //     global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());

                                local_text_transform = arr_labels[i].transformText;
                                local_text_transform.Reset();
                                global_MatrixTransformer.TranslateAppend(local_text_transform, y_ax.labels.x + hor_gap, arr_y_points[i] - arr_labels[i].tx.rich.content.Get_SummaryHeight()/2);

                            }
                        }
                    }
                }

                if(y_ax.labels)
                {
                    if(y_ax_orientation === AscFormat.ORIENTATION_MIN_MAX)
                    {
                        var t = y_ax.labels.arrLabels[y_ax.labels.arrLabels.length-1].tx.rich.content.Get_SummaryHeight()/2;
                        y_ax.labels.y = arr_y_points[arr_y_points.length-1] - t;
                        y_ax.labels.extY = arr_y_points[0] - arr_y_points[arr_y_points.length-1] + t + y_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;
                    }
                    else
                    {
                        var t = y_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;
                        y_ax.labels.y = arr_y_points[0] - t;
                        y_ax.labels.extY = arr_y_points[arr_y_points.length-1] - arr_y_points[0] + t + y_ax.labels.arrLabels[y_ax.labels.arrLabels.length-1].tx.rich.content.Get_SummaryHeight()/2;
                    }
                }

                if(x_ax.labels)
                {
                    if(x_ax_orientation === AscFormat.ORIENTATION_MIN_MAX)
                    {
                        var t = x_ax.labels.arrLabels[0].tx.rich.content.XLimit/2;
                        x_ax.labels.x = arr_x_points[0] - t;
                        x_ax.labels.extX = arr_x_points[arr_x_points.length-1] + x_ax.labels.arrLabels[x_ax.labels.arrLabels.length-1].tx.rich.content.XLimit/2 - x_ax.labels.x;
                    }
                    else
                    {
                        var t = x_ax.labels.arrLabels[x_ax.labels.arrLabels.length-1].tx.rich.content.XLimit/2;
                        x_ax.labels.x = arr_x_points[arr_x_points.length-1] - t;
                        x_ax.labels.extX = arr_x_points[0] + x_ax.labels.arrLabels[0].tx.rich.content.XLimit/2 - x_ax.labels.x;
                    }
                }
                /*new recalc*/
            }
        }
        else if(chart_type !== AscDFH.historyitem_type_BarChart && (chart_type !== AscDFH.historyitem_type_PieChart && chart_type !== AscDFH.historyitem_type_DoughnutChart)
            || (chart_type === AscDFH.historyitem_type_BarChart && chart_object.barDir !== AscFormat.BAR_DIR_BAR))
        {
            var cat_ax, val_ax;
            val_ax = this.chart.plotArea.valAx;
            cat_ax = this.chart.plotArea.catAx;
            if(val_ax && cat_ax)
            {
                val_ax.labels  = null;
                cat_ax.labels  = null;

                val_ax.posX  = null;
                cat_ax.posY  = null;
                val_ax.posY  = null;
                cat_ax.posX  = null;

                val_ax.xPoints = null;
                cat_ax.yPoints = null;
                val_ax.yPoints = null;
                cat_ax.xPoints = null;
                var sizes = this.getChartSizes();
                rect = {x: sizes.startX, y:sizes.startY, w:sizes.w, h: sizes.h};
                var arr_val =  this.getValAxisValues();
                //Получим строки для оси значений с учетом формата и единиц
                var arr_strings = [];
                var multiplier;
                if(val_ax.dispUnits)
                    multiplier = val_ax.dispUnits.getMultiplier();
                else
                    multiplier = 1;
                var num_fmt = val_ax.numFmt;
                if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                {
                    var num_format = oNumFormatCache.get(num_fmt.formatCode);
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        var calc_value = arr_val[i]*multiplier;
                        var rich_value = num_format.formatToChart(calc_value);
                        arr_strings.push(rich_value);
                    }
                }
                else
                {
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        var calc_value = arr_val[i]*multiplier;
                        arr_strings.push(calc_value + "");
                    }
                }


                /*если у нас шкала логарифмическая то будем вместо полученных значений использовать логарифм*/

                val_ax.labels = new AscFormat.CValAxisLabels(this, val_ax);
                var max_width = 0;
                val_ax.yPoints = [];

                var max_val_labels_text_height = 0;
                var lastStyleObject = null;
                for(i = 0; i < arr_strings.length; ++i)
                {
                    var dlbl = new AscFormat.CDLbl();
                    if(lastStyleObject)
                    {
                        dlbl.lastStyleObject = lastStyleObject;
                    }
                    dlbl.parent = val_ax;
                    dlbl.chart = this;
                    dlbl.spPr = val_ax.spPr;
                    dlbl.txPr = val_ax.txPr;
                    dlbl.tx = new AscFormat.CChartText();
                    dlbl.tx.rich = AscFormat.CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                    var t = dlbl.tx.rich.recalculateByMaxWord();
                    if(!lastStyleObject)
                    {
                        lastStyleObject = dlbl.lastStyleObject;
                    }
                    var cur_width = t.w;
                    if(cur_width > max_width)
                        max_width = cur_width;
                    if(t.h > max_val_labels_text_height)
                        max_val_labels_text_height = t.h;
                    val_ax.labels.arrLabels.push(dlbl);
                    val_ax.yPoints.push({val: arr_val[i], pos: null});

                }
                var val_axis_labels_gap = val_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*25.4/72;
                val_ax.labels.extX = max_width + val_axis_labels_gap;

                //расчитаем подписи для горизонтальной оси
                var ser = chart_object.series[0];
                var string_pts = [], pts_len = 0;

                /*string_pts  pts_len*/
                if(ser && ser.cat)
                {
                    var  lit, b_num_lit = true;
                    if(ser.cat.strRef && ser.cat.strRef.strCache)
                    {
                        lit = ser.cat.strRef.strCache;
                    }
                    else if(ser.cat.strLit)
                    {
                        lit = ser.cat.strLit;
                    }
                    else if(ser.cat.numRef && ser.cat.numRef.numCache)
                    {
                        lit = ser.cat.numRef.numCache;
                        b_num_lit = true;
                    }
                    else if(ser.cat.numLit)
                    {
                        lit = ser.cat.numLit;
                        b_num_lit = true;
                    }
                    if(lit)
                    {
                        var lit_format = null, pt_format = null;
                        if(b_num_lit && typeof lit.formatCode === "string" && lit.formatCode.length > 0)
                        {
                            lit_format = oNumFormatCache.get(lit.formatCode);
                        }
                        pts_len = lit.ptCount;
                        for(i = 0; i < pts_len; ++i)
                        {
                            var pt = lit.getPtByIndex(i);
                            if(pt)
                            {
                                var str_pt;
                                if(b_num_lit)
                                {
                                    if(typeof pt.formatCode === "string" && pt.formatCode.length > 0)
                                    {
                                        pt_format = oNumFormatCache.get(pt.formatCode);
                                        if(pt_format)
                                        {
                                            str_pt = pt_format.formatToChart(pt.val);
                                        }
                                        else
                                        {
                                            str_pt = pt.val;
                                        }
                                    }
                                    else if(lit_format)
                                    {
                                        str_pt = lit_format.formatToChart(pt.val);
                                    }
                                    else
                                    {
                                        str_pt = pt.val;
                                    }
                                }
                                else
                                {
                                    str_pt = pt.val;
                                }
                                string_pts.push({val: str_pt + ""});
                            }
                            else
                            {
                                string_pts.push({val: i + ""});
                            }
                        }
                    }
                }
                //if(string_pts.length === 0)
                {
                    pts_len = 0;
                    for(i = 0; i < chart_object.series.length; ++i)
                    {
                        var cur_pts= null;
                        ser = chart_object.series[i];
                        if(ser.val)
                        {
                            if(ser.val.numRef && ser.val.numRef.numCache)
                                cur_pts = ser.val.numRef.numCache;
                            else if(ser.val.numLit)
                                cur_pts = ser.val.numLit;
                            if(cur_pts)
                            {
                                pts_len = Math.max(pts_len, cur_pts.ptCount);
                            }
                        }
                    }
                    if(pts_len > string_pts.length)
                    {
                        for(i = string_pts.length; i < pts_len; ++i)
                        {
                            string_pts.push({val:i+1 + ""});
                        }
                    }
                    else
                    {
                        string_pts.splice(pts_len, string_pts.length - pts_len);
                    }
                }
                /*---------------------расчет позиции блока с подписями вертикальной оси-----------------------------------------------------------------------------*/
                //расчитаем ширину интервала без учета горизонтальной оси;
                var crosses;//номер категории в которой вертикалная ось пересекает горизонтальную;
                if(val_ax.crosses === AscFormat.CROSSES_AUTO_ZERO || val_ax.crosses === AscFormat.CROSSES_MIN)
                    crosses = 1;
                else if(val_ax.crosses === AscFormat.CROSSES_MAX)
                    crosses = string_pts.length;
                else if(AscFormat.isRealNumber(val_ax.crossesAt))
                {
                    if(val_ax.crossesAt <= string_pts.length + 1 && val_ax.crossesAt > 0)
                        crosses = val_ax.crossesAt;
                    else if(val_ax.crossesAt <= 0)
                        crosses = 1;
                    else
                        crosses = string_pts.length;
                }
                else
                    crosses = 1;

                cat_ax.maxCatVal = string_pts.length;

                var cat_ax_orientation = cat_ax.scaling && AscFormat.isRealNumber(cat_ax.scaling.orientation) ?  cat_ax.scaling.orientation : AscFormat.ORIENTATION_MIN_MAX;
                var point_width = rect.w/string_pts.length;
                var labels_pos = val_ax.tickLblPos;
                if(val_ax.bDelete)
                {
                    labels_pos = c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE;
                }
                var cross_between = this.getValAxisCrossType();
                if(cross_between === null){
                    cross_between = AscFormat.CROSS_BETWEEN_BETWEEN;
                }
                var left_val_ax_labels_align = true;//приленгание подписей оси значений к левому краю.

                var intervals_count = cross_between === AscFormat.CROSS_BETWEEN_MID_CAT ? string_pts.length - 1 : string_pts.length;
                var point_interval  = rect.w/intervals_count;//интервал между точками. Зависит от crossBetween, а также будет потом корректироваться в зависимости от подписей вертикальной и горизонтальной оси.

                if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                    point_interval = checkFiniteNumber(rect.w/(string_pts.length - 1));
                else
                    point_interval = checkFiniteNumber(rect.w/string_pts.length);

                var left_points_width, right_point_width;
                var arr_cat_labels_points = [];//массив середин подписей горизонтальной оси; i-й элемент - x-координата центра подписи категории с номером i;
                if(cat_ax_orientation === AscFormat.ORIENTATION_MIN_MAX)
                {
                    if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO || !AscFormat.isRealNumber(labels_pos)) //подписи рядом с осью
                    {
                        if(val_ax.crosses === AscFormat.CROSSES_MAX)
                        {
                            left_val_ax_labels_align = false;
                            if(!bWithoutLabels){
                                val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;
                                if(!bNeedReflect)
                                {
                                    point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                                }
                                else
                                {
                                    point_interval = rect.w/intervals_count;
                                }
                                val_ax.posX = val_ax.labels.x;
                                if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = point_interval/2 + rect.x + point_interval*i;
                                }
                            }
                            else{
                                val_ax.labels.x = rect.x + rect.w;
                                if(val_ax.labels.x < 0 && !bNeedReflect){
                                    rect.x -= val_ax.labels.x;
                                    rect.w += val_ax.labels.x;
                                    val_ax.labels.x = 0;
                                    bCorrectedLayoutRect = true;
                                }
                                if(rect.x + rect.w > this.extX){
                                    rect.w -= (rect.x + rect.w - this.extX);
                                    bCorrectedLayoutRect = true;
                                }

                                point_interval = rect.w/intervals_count;
                                val_ax.posX = val_ax.labels.x;
                                if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = point_interval/2 + rect.x + point_interval*i;
                                }
                            }
                        }
                        else
                        {
                            left_points_width = point_interval*(crosses-1);//общая ширина левых точек если считать что точки занимают все пространство
                            if(!bWithoutLabels) {
                                if (!bNeedReflect && left_points_width < val_ax.labels.extX)//подписи верт. оси выходят за пределы области построения
                                {
                                    var right_intervals_count = intervals_count - (crosses - 1);//количесво интервалов правее вертикальной оси
                                    //скорректируем point_interval, поделив расстояние, которое осталось справа от подписей осей на количество интервалов справа
                                    point_interval = (rect.w - val_ax.labels.extX) / right_intervals_count;
                                    val_ax.labels.x = rect.x;
                                    var start_point = val_ax.labels.x + val_ax.labels.extX - (crosses - 1) * point_interval;//x-координата точки, где начинается собственно область диаграммы
                                    if (cross_between === AscFormat.CROSS_BETWEEN_MID_CAT) {
                                        for (i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = start_point + point_interval * i;
                                    }
                                    else {
                                        for (i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = point_interval / 2 + start_point + point_interval * i;
                                    }
                                }
                                else {
                                    val_ax.labels.x = rect.x + left_points_width - val_ax.labels.extX;
                                    if (cross_between === AscFormat.CROSS_BETWEEN_MID_CAT) {
                                        for (i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = rect.x + point_interval * i;
                                    }
                                    else {
                                        for (i = 0; i < string_pts.length; ++i)
                                            arr_cat_labels_points[i] = point_interval / 2 + rect.x + point_interval * i;
                                    }

                                }
                                val_ax.posX = val_ax.labels.x + val_ax.labels.extX;
                            }
                            else{
                                val_ax.labels.x = rect.x + left_points_width - val_ax.labels.extX;
                                if(val_ax.labels.x < 0 && !bNeedReflect){
                                    rect.x -= val_ax.labels.x;
                                    rect.w += val_ax.labels.x;
                                    val_ax.labels.x = 0;
                                    bCorrectedLayoutRect = true;
                                }
                                if(rect.x + rect.w > this.extX){
                                    rect.w -= (rect.x + rect.w - this.extX);
                                    bCorrectedLayoutRect = true;
                                }

                                point_interval = rect.w/intervals_count;

                                if (cross_between === AscFormat.CROSS_BETWEEN_MID_CAT) {
                                    for (i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + point_interval * i;
                                }
                                else {
                                    for (i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = point_interval / 2 + rect.x + point_interval * i;
                                }
                                val_ax.posX = val_ax.labels.x + val_ax.labels.extX;
                            }
                        }
                    }
                    else if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW)//подписи слева от области построения
                    {
                        if(!bNeedReflect)
                        {
                            point_interval = (rect.w -  val_ax.labels.extX)/intervals_count;
                        }
                        else
                        {
                            point_interval = rect.w/intervals_count;
                        }
                        val_ax.labels.x = rect.x;
                        if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                        {
                            if(!bNeedReflect)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + val_ax.labels.extX + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + point_interval*i;
                            }
                        }
                        else
                        {
                            if(!bNeedReflect)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + val_ax.labels.extX + point_interval/2 + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + point_interval/2 + point_interval*i;
                            }
                        }
                        val_ax.posX = val_ax.labels.x + val_ax.labels.extX + point_interval*(crosses-1);
                    }
                    else if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH)//подписи справа от области построения
                    {
                        if(!bNeedReflect)
                        {
                            point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                        }
                        else
                        {
                            point_interval = rect.w/intervals_count;
                        }

                        val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;
                        left_val_ax_labels_align = false;
                        if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.x + point_interval*i;
                        }
                        else
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = point_interval/2 + rect.x + point_interval*i;
                        }
                        val_ax.posX = rect.x + point_interval*(crosses-1);
                    }
                    else
                    {
                        val_ax.labels = null;
                        if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.x + point_interval*i;
                        }
                        else
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = point_interval/2 + rect.x + point_interval*i;
                        }
                        val_ax.posX = rect.x + point_interval*(crosses-1);
                    }
                }
                else
                {//то же самое, только зеркально отраженное
                    if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO || !AscFormat.isRealNumber(labels_pos)) //подписи рядом с осью
                    {
                        if(val_ax.crosses === AscFormat.CROSSES_MAX)
                        {
                            if(!bWithoutLabels){
                                val_ax.labels.x = rect.x;
                                if(!bNeedReflect)
                                {
                                    point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                                }
                                else
                                {
                                    point_interval = rect.w/intervals_count;
                                }
                                if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                                }
                                if(!bNeedReflect)
                                {
                                    val_ax.posX = val_ax.labels.x + val_ax.labels.extX;
                                }
                                else
                                {
                                    val_ax.posX = val_ax.labels.x;
                                }
                            }
                            else{
                                val_ax.labels.x = rect.x - val_ax.labels.extX;
                                if(val_ax.labels.x < 0 && !bNeedReflect){
                                    rect.x -= val_ax.labels.x;
                                    rect.w += val_ax.labels.x;
                                    val_ax.labels.x = 0;
                                    bCorrectedLayoutRect = true;
                                }
                                if(rect.x + rect.w > this.extX){
                                    rect.w -= (rect.x + rect.w - this.extX);
                                    bCorrectedLayoutRect = true;
                                }

                                point_interval = rect.w/intervals_count;
                                if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                                }
                                if(!bNeedReflect)
                                {
                                    val_ax.posX = val_ax.labels.x + val_ax.labels.extX;
                                }
                                else
                                {
                                    val_ax.posX = val_ax.labels.x;
                                }
                            }

                        }
                        else
                        {
                            left_val_ax_labels_align = false;
                            right_point_width = point_interval*(crosses-1);
                            if(!bNeedReflect && right_point_width < val_ax.labels.extX && !bWithoutLabels)
                            {
                                val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;
                                var left_points_interval_count = intervals_count - (crosses - 1);
                                point_interval = (val_ax.labels.x - rect.x)/left_points_interval_count;
                                var start_point_right = rect.x + point_interval*intervals_count;
                                if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = start_point_right - point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = start_point_right - point_interval/2 - point_interval*i;
                                }
                            }
                            else
                            {
                                val_ax.labels.x = rect.x + rect.w - right_point_width;
                                if(val_ax.labels.x < 0 && !bNeedReflect){
                                    rect.x -= val_ax.labels.x;
                                    rect.w += val_ax.labels.x;
                                    val_ax.labels.x = 0;
                                    bCorrectedLayoutRect = true;
                                }
                                if(rect.x + rect.w > this.extX){
                                    rect.w -= (rect.x + rect.w - this.extX);
                                    bCorrectedLayoutRect = true;
                                }

                                point_interval = rect.w/intervals_count;
                                if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                                }
                            }
                            val_ax.posX = val_ax.labels.x;
                        }
                    }
                    else if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW)//подписи справа от области построения
                    {
                        left_val_ax_labels_align = false;
                        if(!bNeedReflect && !bWithoutLabels)
                        {
                            point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                        }
                        else
                        {
                            point_interval = rect.w/intervals_count;
                        }
                        if(!bWithoutLabels){
                            val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;

                            if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.x - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.x - point_interval/2 - point_interval*i;
                            }
                            if(!bNeedReflect)
                            {
                                val_ax.posX = rect.x + rect.w - point_interval*(crosses-1) - val_ax.labels.extX;
                            }
                            else
                            {
                                val_ax.posX = rect.x + rect.w - point_interval*(crosses-1);
                            }

                        }
                        else{
                            val_ax.labels.x = rect.x + rect.w;

                            if(val_ax.labels.x < 0 && !bNeedReflect){
                                rect.x -= val_ax.labels.x;
                                rect.w += val_ax.labels.x;
                                val_ax.labels.x = 0;
                                bCorrectedLayoutRect = true;
                            }
                            if(rect.x + rect.w > this.extX){
                                rect.w -= (rect.x + rect.w - this.extX);
                                bCorrectedLayoutRect = true;
                            }

                            point_interval = rect.w/intervals_count;


                            if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.x - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = val_ax.labels.x - point_interval/2 - point_interval*i;
                            }
                            if(!bNeedReflect)
                            {
                                val_ax.posX = rect.x + rect.w - point_interval*(crosses-1) - val_ax.labels.extX;
                            }
                            else
                            {
                                val_ax.posX = rect.x + rect.w - point_interval*(crosses-1);
                            }
                        }

                    }
                    else if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH)//подписи слева от области построения
                    {
                        if(!bNeedReflect && !bWithoutLabels)
                        {
                            point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                        }
                        else
                        {
                            point_interval = rect.w/intervals_count;
                        }
                        if(!bWithoutLabels){
                            val_ax.labels.x = rect.x;

                            if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                            }
                            val_ax.posX = rect.x + rect.w - point_interval*(crosses-1);
                        }
                        else{
                            val_ax.labels.x = rect.x - val_ax.labels.extX;
                            if(val_ax.labels.x < 0 && !bNeedReflect){
                                rect.x -= val_ax.labels.x;
                                rect.w += val_ax.labels.x;
                                val_ax.labels.x = 0;
                                bCorrectedLayoutRect = true;
                            }
                            if(rect.x + rect.w > this.extX){
                                rect.w -= (rect.x + rect.w - this.extX);
                                bCorrectedLayoutRect = true;
                            }

                            point_interval = rect.w/intervals_count;
                            if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                            }
                            val_ax.posX = rect.x + rect.w - point_interval*(crosses-1);
                        }
                    }
                    else
                    {
                        val_ax.labels = null;
                        if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;
                        }
                        else
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                        }
                        val_ax.posX = rect.x + rect.w - point_interval*(crosses-1);
                    }
                }

                cat_ax.interval = point_interval;

                var diagram_width = point_interval*intervals_count;//размер области с самой диаграммой позже будет корректироватся;
                var tick_lbl_skip = AscFormat.isRealNumber(cat_ax.tickLblSkip) ? cat_ax.tickLblSkip :  (string_pts.length < SKIP_LBL_LIMIT ?  1 :  Math.floor(string_pts.length/SKIP_LBL_LIMIT));
                var max_cat_label_width = diagram_width / string_pts.length; // максимальная ширина подписи горизонтальной оси;


                cat_ax.labels = null;
                var b_rotated = false;//флаг означает, что водписи не уместились в отведенное для них пространство и их пришлось перевернуть.
                //проверим умещаются ли подписи горизонтальной оси в point_interval
                if(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE !== cat_ax.tickLblPos && !(cat_ax.bDelete === true)) //будем корректировать вертикальные подписи только если есть горизонтальные
                {
                    cat_ax.labels = new AscFormat.CValAxisLabels(this, cat_ax);

                    var max_min_width = 0;
                    var max_max_width = 0;
                    var arr_max_contents = [];
                    for(i = 0; i < string_pts.length; ++i)
                    {
                        var dlbl = null;
                        if(i%tick_lbl_skip === 0)
                        {
                            dlbl = new AscFormat.CDLbl();
                            dlbl.parent = cat_ax;
                            dlbl.chart = this;
                            dlbl.spPr = cat_ax.spPr;
                            dlbl.txPr = cat_ax.txPr;
                            dlbl.tx = new AscFormat.CChartText();
                            dlbl.tx.rich = AscFormat.CreateTextBodyFromString(string_pts[i].val.replace(oNonSpaceRegExp, ' '), this.getDrawingDocument(), dlbl);
                            //dlbl.recalculate();

                            var content = dlbl.tx.rich.content;
                            content.Set_ApplyToAll(true);
                            content.Set_ParagraphAlign(AscCommon.align_Center);
                            content.Set_ApplyToAll(false);
                            dlbl.txBody = dlbl.tx.rich;
                            if(cat_ax.labels.arrLabels.length > 0)
                            {
                                dlbl.lastStyleObject = cat_ax.labels.arrLabels[0].lastStyleObject;
                            }
                            var min_max =  dlbl.tx.rich.content.Recalculate_MinMaxContentWidth();
                            var max_min_content_width = min_max.Min;
                            if(max_min_content_width > max_min_width)
                                max_min_width = max_min_content_width;
                            if(min_max.Max > max_max_width)
                                max_max_width = min_max.Max;
                        }
                        cat_ax.labels.arrLabels.push(dlbl);
                    }
                    var stake_offset = AscFormat.isRealNumber(cat_ax.lblOffset) ? cat_ax.lblOffset/100 : 1;
                    var labels_offset = cat_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72)*stake_offset;
                    if(max_min_width < max_cat_label_width)//значит текст каждой из точек умещается в point_width
                    {
                        var max_height = 0;
                        for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                        {
                            if(cat_ax.labels.arrLabels[i])
                            {
                                var content = cat_ax.labels.arrLabels[i].tx.rich.content;
                                content.Reset(0, 0, max_cat_label_width, 20000);
                                content.Recalculate_Page(0, true);
                                var cur_height = content.Get_SummaryHeight();
                                if(cur_height > max_height)
                                    max_height = cur_height;
                            }
                        }

                        cat_ax.labels.extY = max_height + labels_offset;
                        if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT) //корректируем позиции центров подписей горизонтальной оси, положение  вертикальной оси и её подписей
                        {
                            var left_gap_point, right_gap_point;
                            if(cat_ax_orientation === AscFormat.ORIENTATION_MIN_MAX)
                            {
                                var first_label_left_gap = cat_ax.labels.arrLabels[0].tx.rich.getMaxContentWidth(max_cat_label_width)/2;//на сколько вправа выходит первая подпись
                                var last_labels_right_gap = cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1] ? cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1].tx.rich.getMaxContentWidth(max_cat_label_width)/2 : 0;

                                //смотрим, выходит ли подпись первой категориии выходит за пределы области построения
                                left_gap_point = arr_cat_labels_points[0] - first_label_left_gap;
                                if(rect.x > left_gap_point && !bWithoutLabels)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                    //скорректируем arr_cat_labels_points
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                    }
                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX =  rect.x + (val_ax.posX - left_gap_point)*checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                }

                                //смотри выходит ли подпись последней категории за пределы области построения
                                right_gap_point = arr_cat_labels_points[arr_cat_labels_points.length - 1] + last_labels_right_gap;
                                if(right_gap_point > rect.x + rect.w && !bWithoutLabels)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*checkFiniteNumber((rect.w/(right_gap_point - rect.x)));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= checkFiniteNumber((rect.w/(right_gap_point - rect.x)));
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)*checkFiniteNumber((rect.w/(right_gap_point - rect.x)));
                                    }
                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - rect.x)*checkFiniteNumber((rect.w/(right_gap_point - rect.x)));

                                }
                            }
                            else
                            {
                                var last_label_left_gap = cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1] ? cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1].tx.rich.getMaxContentWidth(max_cat_label_width)/2 : 0;
                                var first_label_right_gap = cat_ax.labels.arrLabels[0].tx.rich.getMaxContentWidth(max_cat_label_width)/2;
                                left_gap_point = arr_cat_labels_points[arr_cat_labels_points.length - 1] - last_label_left_gap;
                                right_gap_point = arr_cat_labels_points[0] + first_label_right_gap;
                                if(rect.x > left_gap_point && !bWithoutLabels)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                    //скорректируем arr_cat_labels_points
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                    }

                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - left_gap_point)*checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                }
                                if(right_gap_point > rect.x + rect.w && !bWithoutLabels)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*checkFiniteNumber((rect.w/(right_gap_point - rect.x)));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= checkFiniteNumber((rect.w/(right_gap_point - rect.x)));
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)*checkFiniteNumber((rect.w/(right_gap_point - rect.x)));
                                    }
                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - rect.x)*checkFiniteNumber((rect.w/(right_gap_point - rect.x)));
                                }
                            }
                        }
                    }
                    else
                    {
                        b_rotated = true;
                        //пока сделаем без обрезки
                        var arr_left_points = [];
                        var arr_right_points = [];

                        var max_rotated_height = 0;
                        cat_ax.labels.bRotated = true;
                        //смотрим на сколько подписи горизонтальной оси выходят влево за пределы области построения
                        for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                        {
                            if(cat_ax.labels.arrLabels[i])
                            {
                                //сначала расчитаем высоту и ширину подписи так чтобы она умещалась в одну строку
                                var wh = cat_ax.labels.arrLabels[i].tx.rich.getContentOneStringSizes();
                                arr_left_points[i] = arr_cat_labels_points[i] - (wh.w*Math.cos(Math.PI/4) + wh.h*Math.sin(Math.PI/4) - wh.h*Math.sin(Math.PI/4)/2);//вычитаем из точки привязки ширину получившейся подписи
                                arr_right_points[i] = arr_cat_labels_points[i] + wh.h*Math.sin(Math.PI/4)/2;
                                var h2 = wh.w*Math.sin(Math.PI/4) + wh.h*Math.cos(Math.PI/4);
                                if(h2 > max_rotated_height)
                                    max_rotated_height = h2;

                                cat_ax.labels.arrLabels[i].widthForTransform = wh.w;
                            }
                            else
                            {//подписи нет
                                arr_left_points[i] = arr_cat_labels_points[i];
                                arr_right_points[i] = arr_cat_labels_points[i];
                            }
                        }

                        cat_ax.labels.extY = max_rotated_height + labels_offset;
                        //
                        left_gap_point = Math.min.apply(Math, arr_left_points);
                        right_gap_point = Math.max.apply(Math, arr_right_points);

                        if(!bWithoutLabels){
                            if(AscFormat.ORIENTATION_MIN_MAX === cat_ax_orientation)
                            {
                                if(rect.x > left_gap_point)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= checkFiniteNumber(rect.w/(rect.x + rect.w - left_gap_point));
                                    //скорректируем arr_cat_labels_points
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                    }

                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - left_gap_point)*checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                }
                                //смотри выходит ли подпись последней категории за пределы области построения
                                if(right_gap_point > rect.x + rect.w)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*checkFiniteNumber((rect.w/(right_gap_point - rect.x)));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= checkFiniteNumber((right_gap_point - rect.x)/(rect.x + rect.w - rect.x));
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)*checkFiniteNumber((rect.w/(right_gap_point - rect.x)));
                                    }


                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - rect.x)*checkFiniteNumber((rect.w/(right_gap_point - rect.x)));
                                }
                            }
                            else
                            {
                                if(rect.x > left_gap_point)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= (rect.w)/checkFiniteNumber((rect.x + rect.w - left_gap_point));
                                    //скорректируем arr_cat_labels_points
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                    }

                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - left_gap_point)*checkFiniteNumber((rect.w/(rect.x + rect.w - left_gap_point)));
                                }
                                if(right_gap_point > rect.x + rect.w)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*checkFiniteNumber((rect.w/(right_gap_point - rect.x)));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= checkFiniteNumber((right_gap_point - rect.x)/(rect.x + rect.w - rect.x));
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)*checkFiniteNumber((rect.w/(right_gap_point - rect.x)));
                                    }

                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - rect.x)*checkFiniteNumber((rect.w/(right_gap_point - rect.x)));
                                }
                            }
                        }
                    }
                }

                //расчет позиции блока с подписями горизонтальной оси
                var cat_labels_align_bottom = true;
                /*-----------------------------------------------------------------------*/
                var crosses_val_ax;//значение на ветикальной оси в котором её пересекает горизонтальная

                if(cat_ax.crosses === AscFormat.CROSSES_AUTO_ZERO)
                {
                    if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                        crosses_val_ax = 0;
                    else if(arr_val[arr_val.length-1] < 0)
                        crosses_val_ax = arr_val[arr_val.length-1];
                    else
                        crosses_val_ax = arr_val[0];
                }
                else if(cat_ax.crosses === AscFormat.CROSSES_MIN)
                {
                    crosses_val_ax = arr_val[0];
                }
                else if(cat_ax.crosses === AscFormat.CROSSES_MAX)
                {
                    crosses_val_ax = arr_val[arr_val.length - 1];
                }
                else if(AscFormat.isRealNumber(cat_ax.crossesAt) && cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                {
                    //сделаем провеку на попадание в интервал
                    if(cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                        crosses_val_ax = cat_ax.crossesAt;
                }
                else
                { //ведем себя как в случае (cat_ax.crosses === AscFormat.CROSSES_AUTO_ZERO)
                    if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                        crosses_val_ax = 0;
                    else if(arr_val[arr_val.length-1] < 0)
                        crosses_val_ax = arr_val[arr_val.length-1];
                    else
                        crosses_val_ax = arr_val[0];
                }
                var val_ax_orientation = val_ax.scaling && AscFormat.isRealNumber(val_ax.scaling.orientation) ? val_ax.scaling.orientation : AscFormat.ORIENTATION_MIN_MAX;
                var hor_labels_pos = cat_ax.tickLblPos;

                var arr_val_labels_points = [];//массив середин подписей вертикальной оси; i-й элемент - y-координата центра подписи i-огто значения;
                var top_val_axis_gap, bottom_val_axis_gap;
                var first_val_axis_label_half_height = 0; //TODO  (val_ax.bDelete || val_ax.tickLblPos ===c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE) ? 0 :val_ax.labels.arrLabels[0].tx.rich.content.Get_SummaryHeight()/2;
                var last_val_axis_label_half_height = 0; //TODO (val_ax.bDelete || val_ax.tickLblPos ===c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE) ? 0 : val_ax.labels.arrLabels[val_ax.labels.arrLabels.length-1].tx.rich.content.Get_SummaryHeight()/2;

                var unit_height;
                if(!bWithoutLabels){
                    unit_height = checkFiniteNumber((rect.h - first_val_axis_label_half_height - last_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]));//высота единицы измерения на вертикальной оси
                }
                else{
                    unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length - 1] - arr_val[0]));
                }

                
                var cat_ax_ext_y = cat_ax.labels ? cat_ax.labels.extY : 0;
                if(val_ax_orientation === AscFormat.ORIENTATION_MIN_MAX)
                {
                    if(hor_labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO || !AscFormat.isRealNumber(hor_labels_pos))
                    {
                        if(cat_ax.crosses === AscFormat.CROSSES_MAX)
                        {
                            cat_labels_align_bottom = false;
                            top_val_axis_gap = Math.max(last_val_axis_label_half_height, cat_ax_ext_y);
                            if(!bWithoutLabels){
                                unit_height = checkFiniteNumber((rect.h - top_val_axis_gap - first_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]));
                                cat_labels_align_bottom = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                                cat_ax.posY = rect.y + rect.h - first_val_axis_label_half_height - (crosses_val_ax - arr_val[0])*unit_height;
                                if(cat_ax.labels)
                                    cat_ax.labels.y = cat_ax.posY - cat_ax_ext_y;
                            }
                            else{

                                unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length - 1] - arr_val[0]));
                                cat_labels_align_bottom = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                                cat_ax.posY = rect.y + rect.h - (crosses_val_ax - arr_val[0])*unit_height;
                                if(cat_ax.labels){
                                    cat_ax.labels.y = cat_ax.posY - cat_ax_ext_y;

                                    if(true){
                                        var bCorrectedCat = false;
                                        if(cat_ax.labels.y < 0){
                                            rect.y -= cat_ax.labels.y;
                                            rect.h += cat_ax.labels.y;
                                            cat_ax.labels.y = 0;
                                            bCorrectedCat = true;
                                        }
                                        if(cat_ax.labels.y + cat_ax.labels.extY > this.extY){
                                            rect.h -= (cat_ax.labels.y + cat_ax.labels.extY - this.extY);
                                            bCorrectedCat = true;
                                        }
                                        if(bCorrectedCat){
                                            unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length - 1] - arr_val[0]));
                                            cat_labels_align_bottom = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                                            cat_ax.posY = rect.y + rect.h - (crosses_val_ax - arr_val[0])*unit_height;
                                        }
                                    }
                                }

                            }
                        }
                        else
                        {
                            if(!bWithoutLabels){
                                var bottom_points_height = first_val_axis_label_half_height + (crosses_val_ax - arr_val[0])*unit_height;//высота области под горизонтальной осью
                                if(bottom_points_height < cat_ax_ext_y)
                                {
                                    unit_height = checkFiniteNumber((rect.h - last_val_axis_label_half_height - cat_ax_ext_y)/(arr_val[arr_val.length-1] - crosses_val_ax));
                                }
                                cat_ax.posY = rect.y + last_val_axis_label_half_height + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                                if(cat_ax.labels)
                                    cat_ax.labels.y = cat_ax.posY;
                            }
                            else{
                                cat_ax.posY = rect.y + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                                if(cat_ax.labels){
                                    cat_ax.labels.y = cat_ax.posY;

                                    if(true){
                                        var bCorrectedCat = false;
                                        if(cat_ax.labels.y < 0){
                                            rect.y -= cat_ax.labels.y;
                                            rect.h += cat_ax.labels.y;
                                            cat_ax.labels.y = 0;
                                            bCorrectedCat = true;
                                        }
                                        if(cat_ax.labels.y + cat_ax.labels.extY > this.extY){
                                            rect.h -= (cat_ax.labels.y + cat_ax.labels.extY - this.extY);
                                            bCorrectedCat = true;
                                        }
                                        if(bCorrectedCat){
                                            unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length - 1] - arr_val[0]));
                                            cat_ax.posY = rect.y + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                                            cat_ax.labels.y = cat_ax.posY;
                                        }
                                    }
                                }
                            }
                        }
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = cat_ax.posY - (arr_val[i] - crosses_val_ax)*unit_height;
                    }
                    else if(hor_labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW)
                    {
                        if(!bWithoutLabels){
                            bottom_val_axis_gap = Math.max(cat_ax_ext_y, first_val_axis_label_half_height);
                            unit_height = checkFiniteNumber((rect.h - bottom_val_axis_gap - last_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]));
                            cat_ax.posY = rect.y + last_val_axis_label_half_height + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                            if(cat_ax.labels)
                                cat_ax.labels.y = rect.y + rect.h - bottom_val_axis_gap;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY - (arr_val[i] - crosses_val_ax)*unit_height;
                        }
                        else{
                            unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length - 1] - arr_val[0]));
                            cat_ax.posY = rect.y + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                            if(cat_ax.labels){
                                cat_ax.labels.y = rect.y + rect.h;
                                if(true){
                                    var bCorrectedCat = false;
                                    if(cat_ax.labels.y < 0){
                                        rect.y -= cat_ax.labels.y;
                                        rect.h += cat_ax.labels.y;
                                        cat_ax.labels.y = 0;
                                        bCorrectedCat = true;
                                    }
                                    if(cat_ax.labels.y + cat_ax.labels.extY > this.extY){
                                        rect.h -= (cat_ax.labels.y + cat_ax.labels.extY - this.extY);
                                        bCorrectedCat = true;
                                    }
                                    if(bCorrectedCat){
                                        unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length - 1] - arr_val[0]));
                                        cat_ax.posY = rect.y + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                                        cat_ax.labels.y = rect.y + rect.h;
                                    }
                                }
                            }
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY - (arr_val[i] - crosses_val_ax)*unit_height;
                        }
                    }
                    else if(hor_labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH)
                    {
                        if(!bWithoutLabels){
                            top_val_axis_gap = Math.max(last_val_axis_label_half_height, cat_ax_ext_y);
                            unit_height = checkFiniteNumber((rect.h - top_val_axis_gap - first_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]));
                            cat_labels_align_bottom = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                            cat_ax.posY = rect.y + rect.h - first_val_axis_label_half_height - (crosses_val_ax - arr_val[0])*unit_height;
                            if(cat_ax.labels)
                                cat_ax.labels.y = rect.y + top_val_axis_gap  - cat_ax_ext_y;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY - (arr_val[i] - crosses_val_ax)*unit_height;
                        }
                        else{
                            unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length - 1] - arr_val[0]));
                            cat_labels_align_bottom = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                            cat_ax.posY = rect.y + rect.h - (crosses_val_ax - arr_val[0])*unit_height;
                            if(cat_ax.labels){
                                cat_ax.labels.y = rect.y - cat_ax_ext_y;
                                if(true){
                                    var bCorrectedCat = false;
                                    if(cat_ax.labels.y < 0){
                                        rect.y -= cat_ax.labels.y;
                                        rect.h += cat_ax.labels.y;
                                        cat_ax.labels.y = 0;
                                        bCorrectedCat = true;
                                    }
                                    if(cat_ax.labels.y + cat_ax.labels.extY > this.extY){
                                        rect.h -= (cat_ax.labels.y + cat_ax.labels.extY - this.extY);
                                        bCorrectedCat = true;
                                    }
                                    if(bCorrectedCat){
                                        unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length - 1] - arr_val[0]));
                                        cat_ax.posY = rect.y + rect.h - (crosses_val_ax - arr_val[0])*unit_height;
                                        cat_ax.labels.y = rect.y - cat_ax_ext_y;
                                    }
                                }
                            }

                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY - (arr_val[i] - crosses_val_ax)*unit_height;
                        }
                    }
                    else
                    {
                        //подписей осей нет
                        cat_ax.labels = null;
                        if(!bWithoutLabels){
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = rect.y + rect.h - first_val_axis_label_half_height - (arr_val[i] - arr_val[0])*unit_height;
                            cat_ax.posY = rect.y + rect.h - first_val_axis_label_half_height -  (crosses_val_ax - arr_val[0])*unit_height;
                        }
                        else{
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0])*unit_height;
                            cat_ax.posY = rect.y + rect.h - (crosses_val_ax - arr_val[0])*unit_height;
                        }
                    }
                }
                else
                {//зеркально отражаем
                    if(hor_labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO || !AscFormat.isRealNumber(hor_labels_pos))
                    {
                        if(cat_ax.crosses === AscFormat.CROSSES_MAX)
                        {
                            if(!bWithoutLabels){
                                bottom_val_axis_gap = Math.max(cat_ax_ext_y, last_val_axis_label_half_height);
                                unit_height = checkFiniteNumber((rect.h - bottom_val_axis_gap - first_val_axis_label_half_height)/(arr_val[arr_val.length - 1] - arr_val[0]));
                                cat_ax.posY = rect.y + first_val_axis_label_half_height + (crosses_val_ax - arr_val[0])*unit_height;
                                if(cat_ax.labels)
                                    cat_ax.labels.y = rect.y + rect.h - bottom_val_axis_gap;
                            }
                            else{

                                unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length - 1] - arr_val[0]));
                                cat_ax.posY = rect.y + (crosses_val_ax - arr_val[0])*unit_height;
                                if(cat_ax.labels){
                                    cat_ax.labels.y = rect.y + rect.h;
                                    if(true){
                                        var bCorrectedCat = false;
                                        if(cat_ax.labels.y < 0){
                                            rect.y -= cat_ax.labels.y;
                                            rect.h += cat_ax.labels.y;
                                            cat_ax.labels.y = 0;
                                            bCorrectedCat = true;
                                        }
                                        if(cat_ax.labels.y + cat_ax.labels.extY > this.extY){
                                            rect.h -= (cat_ax.labels.y + cat_ax.labels.extY - this.extY);
                                            bCorrectedCat = true;
                                        }
                                        if(bCorrectedCat){
                                            unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length - 1] - arr_val[0]));
                                            cat_ax.posY = rect.y + (crosses_val_ax - arr_val[0])*unit_height;
                                            cat_ax.labels.y = rect.y + rect.h;
                                        }
                                    }
                                }

                            }
                        }
                        else
                        {
                            cat_labels_align_bottom = false;
                            if(!bWithoutLabels){
                                var top_points_height = first_val_axis_label_half_height + (crosses_val_ax - arr_val[0])*unit_height;
                                if(top_points_height < cat_ax_ext_y)
                                {
                                    unit_height = checkFiniteNumber((rect.h - cat_ax_ext_y - last_val_axis_label_half_height)/(arr_val[arr_val.length-1] - crosses_val_ax));
                                }
                                cat_ax.posY = rect.y + rect.h - last_val_axis_label_half_height - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                                if(cat_ax.labels)
                                    cat_ax.labels.y = cat_ax.posY - cat_ax_ext_y;
                            }
                            else{
                                cat_ax.posY = rect.y + rect.h - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                                if(cat_ax.labels){
                                    cat_ax.labels.y = cat_ax.posY - cat_ax_ext_y;
                                    if(true){
                                        var bCorrectedCat = false;
                                        if(cat_ax.labels.y < 0){
                                            rect.y -= cat_ax.labels.y;
                                            rect.h += cat_ax.labels.y;
                                            cat_ax.labels.y = 0;
                                            bCorrectedCat = true;
                                        }
                                        if(cat_ax.labels.y + cat_ax.labels.extY > this.extY){
                                            rect.h -= (cat_ax.labels.y + cat_ax.labels.extY - this.extY);
                                            bCorrectedCat = true;
                                        }
                                        if(bCorrectedCat){
                                            unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length - 1] - arr_val[0]));
                                            cat_ax.posY = rect.y + rect.h - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                                            cat_ax.labels.y = cat_ax.posY - cat_ax_ext_y;
                                        }
                                    }
                                }

                            }
                        }
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = cat_ax.posY + (arr_val[i] - crosses_val_ax)*unit_height;
                    }
                    else if(hor_labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW)
                    {
                        cat_labels_align_bottom = false;
                        if(!bWithoutLabels){
                            top_val_axis_gap = Math.max(first_val_axis_label_half_height, cat_ax_ext_y);
                            unit_height = checkFiniteNumber((rect.h  - top_val_axis_gap - last_val_axis_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]));
                            cat_ax.posY = rect.y + rect.h - last_val_axis_label_half_height - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;


                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY + (arr_val[i] - crosses_val_ax)*unit_height;
                            if(cat_ax.labels)
                                cat_ax.labels.y = cat_ax.posY + (arr_val[0] - crosses_val_ax)*unit_height - cat_ax_ext_y;
                        }
                        else{
                            unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length-1] - arr_val[0]));
                            cat_ax.posY = rect.y + rect.h - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;


                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY + (arr_val[i] - crosses_val_ax)*unit_height;
                            if(cat_ax.labels)
                            {
                                cat_ax.labels.y = cat_ax.posY + (arr_val[0] - crosses_val_ax)*unit_height - cat_ax_ext_y;
                                if(true){
                                    var bCorrectedCat = false;
                                    if(cat_ax.labels.y < 0){
                                        rect.y -= cat_ax.labels.y;
                                        rect.h += cat_ax.labels.y;
                                        cat_ax.labels.y = 0;
                                        bCorrectedCat = true;
                                    }
                                    if(cat_ax.labels.y + cat_ax.labels.extY > this.extY){
                                        rect.h -= (cat_ax.labels.y + cat_ax.labels.extY - this.extY);
                                        bCorrectedCat = true;
                                    }
                                    if(bCorrectedCat){
                                        unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length-1] - arr_val[0]));
                                        cat_ax.posY = rect.y + rect.h - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;

                                        for(i = 0; i < arr_val.length; ++i)
                                            arr_val_labels_points[i] = cat_ax.posY + (arr_val[i] - crosses_val_ax)*unit_height;
                                        cat_ax.labels.y = cat_ax.posY + (arr_val[0] - crosses_val_ax)*unit_height - cat_ax_ext_y;
                                    }
                                }
                            }

                        }
                    }
                    else if(hor_labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH)
                    {

                        if(!bWithoutLabels){
                            bottom_val_axis_gap = Math.max(cat_ax_ext_y, last_val_axis_label_half_height);
                            unit_height = checkFiniteNumber((rect.h  - bottom_val_axis_gap - first_val_axis_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]));
                            cat_ax.posY = rect.y + first_val_axis_label_half_height + (crosses_val_ax - arr_val[0])*unit_height;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY + (arr_val[i] - crosses_val_ax)*unit_height;
                            if(cat_ax.labels)
                                cat_ax.labels.y = rect.y + rect.h - bottom_val_axis_gap;
                        }
                        else{

                            unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length-1] - arr_val[0]));
                            cat_ax.posY = rect.y + (crosses_val_ax - arr_val[0])*unit_height;
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = cat_ax.posY + (arr_val[i] - crosses_val_ax)*unit_height;
                            if(cat_ax.labels){
                                cat_ax.labels.y = rect.y + rect.h;
                                if(true){
                                    var bCorrectedCat = false;
                                    if(cat_ax.labels.y < 0){
                                        rect.y -= cat_ax.labels.y;
                                        rect.h += cat_ax.labels.y;
                                        cat_ax.labels.y = 0;
                                        bCorrectedCat = true;
                                    }
                                    if(cat_ax.labels.y + cat_ax.labels.extY > this.extY){
                                        rect.h -= (cat_ax.labels.y + cat_ax.labels.extY - this.extY);
                                        bCorrectedCat = true;
                                    }
                                    if(bCorrectedCat){
                                        unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length-1] - arr_val[0]));
                                        cat_ax.posY = rect.y + (crosses_val_ax - arr_val[0])*unit_height;
                                        for(i = 0; i < arr_val.length; ++i)
                                            arr_val_labels_points[i] = cat_ax.posY + (arr_val[i] - crosses_val_ax)*unit_height;
                                        cat_ax.labels.y = rect.y + rect.h;
                                    }
                                }
                            }

                        }
                    }
                    else
                    {//подписей осей нет
                        cat_ax.labels = null;
                        if(!bWithoutLabels){
                            unit_height = checkFiniteNumber((rect.h  - last_val_axis_label_half_height - first_val_axis_label_half_height)/(arr_val[arr_val.length-1] - arr_val[0]));
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = rect.y + first_val_axis_label_half_height + (arr_val[i] - arr_val[0])*unit_height;
                        }
                        else{
                            unit_height = checkFiniteNumber(rect.h/(arr_val[arr_val.length-1] - arr_val[0]));
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = rect.y + (arr_val[i] - arr_val[0])*unit_height;
                        }
                    }
                }

                cat_ax.interval = unit_height;
                //запишем в оси необходимую информацию для отрисовщика plotArea  и выставим окончательные позиции для подписей
                var arr_labels, transform_text, local_text_transform;
                if(val_ax.labels)
                {
                    if(bNeedReflect)
                    {
                        if(left_val_ax_labels_align)
                        {
                            left_val_ax_labels_align = false;
                            val_ax.labels.x += val_ax.labels.extX;
                        }
                        else
                        {
                            left_val_ax_labels_align = true;
                            val_ax.labels.x -= val_ax.labels.extX;
                        }
                    }
                    val_ax.labels.align = left_val_ax_labels_align;
                    val_ax.labels.y = Math.min.apply(Math, arr_val_labels_points) - max_val_labels_text_height/2;
                    val_ax.labels.extY = Math.max.apply(Math, arr_val_labels_points) - Math.min.apply(Math, arr_val_labels_points) + max_val_labels_text_height;
                    arr_labels = val_ax.labels.arrLabels;
                    if(left_val_ax_labels_align)
                    {
                        for(i = 0; i < arr_labels.length; ++i)
                        {
                            arr_labels[i].txBody = arr_labels[i].tx.rich;
                            transform_text = arr_labels[i].transformText;
                            transform_text.Reset();
                            global_MatrixTransformer.TranslateAppend(transform_text, val_ax.labels.x + val_ax.labels.extX - val_axis_labels_gap - arr_labels[i].tx.rich.content.XLimit, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                          //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                            local_text_transform = arr_labels[i].localTransformText;
                            local_text_transform.Reset();
                            global_MatrixTransformer.TranslateAppend(local_text_transform, val_ax.labels.x + val_ax.labels.extX - val_axis_labels_gap - arr_labels[i].tx.rich.content.XLimit, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);


                        }
                    }
                    else
                    {
                        var left_line = val_ax.labels.x + val_axis_labels_gap;
                        for(i = 0; i < arr_labels.length; ++i)
                        {
                            arr_labels[i].txBody = arr_labels[i].tx.rich;
                            transform_text = arr_labels[i].transformText;
                            transform_text.Reset();
                            global_MatrixTransformer.TranslateAppend(transform_text, left_line, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                          //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                            local_text_transform = arr_labels[i].localTransformText;
                            local_text_transform.Reset();
                            global_MatrixTransformer.TranslateAppend(local_text_transform, left_line, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                        }
                    }
                }
                val_ax.yPoints = [];
                for(i = 0; i < arr_val_labels_points.length; ++i)
                {
                    val_ax.yPoints[i] = {val:arr_val[i], pos: arr_val_labels_points[i]};
                }
                cat_ax.xPoints = [];
                for(i = 0; i <arr_cat_labels_points.length; ++i)
                {
                    cat_ax.xPoints[i] = {val: i, pos: arr_cat_labels_points[i]};
                }
                if(cat_ax.labels)
                {
                    cat_ax.labels.align = cat_labels_align_bottom;
                    if(!b_rotated)//подписи не повернутые
                    {
                        if(cat_ax_orientation === AscFormat.ORIENTATION_MIN_MAX)
                        {
                            cat_ax.labels.x = arr_cat_labels_points[0] - max_cat_label_width/2;
                        }
                        else
                        {
                            cat_ax.labels.x = arr_cat_labels_points[arr_cat_labels_points.length-1] - max_cat_label_width/2;
                        }
                        cat_ax.labels.extX = arr_cat_labels_points[arr_cat_labels_points.length-1] + max_cat_label_width/2 - cat_ax.labels.x;
                        if(cat_labels_align_bottom)
                        {
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    var label_text_transform = cat_ax.labels.arrLabels[i].transformText;
                                    label_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(label_text_transform, arr_cat_labels_points[i] - max_cat_label_width/2, cat_ax.labels.y + labels_offset);
                                 //   global_MatrixTransformer.MultiplyAppend(label_text_transform, this.getTransformMatrix());

                                    local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, arr_cat_labels_points[i] - max_cat_label_width/2, cat_ax.labels.y + labels_offset);

                                }
                            }
                        }
                        else
                        {
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    var label_text_transform = cat_ax.labels.arrLabels[i].transformText;
                                    label_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(label_text_transform, arr_cat_labels_points[i] - max_cat_label_width/2, cat_ax.labels.y + cat_ax.labels.extY - labels_offset - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight());
                                  //  global_MatrixTransformer.MultiplyAppend(label_text_transform, this.getTransformMatrix());

                                    local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, arr_cat_labels_points[i] - max_cat_label_width/2, cat_ax.labels.y + cat_ax.labels.extY - labels_offset - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight());

                                }
                            }
                        }
                    }
                    else
                    {
                        var left_x, right_x;
                        var w2, h2, x1, xc, yc, y0;
                        if(cat_labels_align_bottom)
                        {
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    var label_text_transform = cat_ax.labels.arrLabels[i].transformText;
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(true);
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(AscCommon.align_Left);
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(false);
                                    var wh = cat_ax.labels.arrLabels[i].tx.rich.getContentOneStringSizes();//Todo: не расчитывать больше контент
                                    w2 = wh.w*Math.cos(Math.PI/4) + wh.h*Math.sin(Math.PI/4);
                                    h2 = wh.w*Math.sin(Math.PI/4) + wh.h*Math.cos(Math.PI/4);
                                    x1 = arr_cat_labels_points[i] + wh.h*Math.sin(Math.PI/4);

                                    y0 = cat_ax.labels.y + labels_offset;

                                    xc = x1 - w2/2;
                                    yc = y0 + h2/2;
                                    label_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(label_text_transform, -wh.w/2, -wh.h/2);
                                    global_MatrixTransformer.RotateRadAppend(label_text_transform, Math.PI/4);//TODO
                                    global_MatrixTransformer.TranslateAppend(label_text_transform, xc, yc);
                                    global_MatrixTransformer.MultiplyAppend(label_text_transform,this.transform);
                                    if(!AscFormat.isRealNumber(left_x))
                                    {
                                        left_x = xc - w2/2;
                                        right_x = xc + w2/2;
                                    }
                                    else
                                    {
                                        if(xc - w2/2 < left_x)
                                            left_x = xc - w2/2;
                                        if(xc + w2/2 > right_x)
                                            right_x = xc + w2/2;
                                    }

                                    local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, -wh.w/2, -wh.h/2);
                                    global_MatrixTransformer.RotateRadAppend(local_text_transform, Math.PI/4);//TODO
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, xc, yc);
                                }
                            }
                        }
                        else
                        {
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    var label_text_transform = cat_ax.labels.arrLabels[i].transformText;
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(true);
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(AscCommon.align_Left);
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(false);
                                    var wh = cat_ax.labels.arrLabels[i].tx.rich.getContentOneStringSizes();//Todo: не расчитывать больше контент
                                    w2 = wh.w*Math.cos(Math.PI/4) + wh.h*Math.sin(Math.PI/4);
                                    h2 = wh.w*Math.sin(Math.PI/4) + wh.h*Math.cos(Math.PI/4);
                                    x1 = arr_cat_labels_points[i] - wh.h*Math.sin(Math.PI/4);

                                    y0 = cat_ax.labels.y + cat_ax.labels.extY - labels_offset;

                                    xc = x1 + w2/2;
                                    yc = y0 - h2/2;
                                    label_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(label_text_transform, -wh.w/2, -wh.h/2);
                                    global_MatrixTransformer.RotateRadAppend(label_text_transform, Math.PI/4);//TODO
                                    global_MatrixTransformer.TranslateAppend(label_text_transform, xc, yc);
                                    global_MatrixTransformer.MultiplyAppend(label_text_transform,this.transform);

                                    if(!AscFormat.isRealNumber(left_x))
                                    {
                                        left_x = xc - w2/2;
                                        right_x = xc + w2/2;
                                    }
                                    else
                                    {
                                        if(xc - w2/2 < left_x)
                                            left_x = xc - w2/2;
                                        if(xc + w2/2 > right_x)
                                            right_x = xc + w2/2;
                                    }

                                    local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, -wh.w/2, -wh.h/2);
                                    global_MatrixTransformer.RotateRadAppend(local_text_transform, Math.PI/4);//TODO
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, xc, yc);
                                }
                            }
                        }
                        cat_ax.labels.x = left_x;
                        cat_ax.labels.extX = right_x - left_x;
                    }
                }
                cat_ax.xPoints.sort(function(a, b){return a.val - b.val});
                val_ax.yPoints.sort(function(a, b){return a.val - b.val});
            }
        }
        else if(chart_type === AscDFH.historyitem_type_BarChart && chart_object.barDir === AscFormat.BAR_DIR_BAR)
        {
            var cat_ax, val_ax;
            var axis_by_types = chart_object.getAxisByTypes();
            cat_ax = axis_by_types.catAx[0];
            val_ax = axis_by_types.valAx[0];
            if(cat_ax && val_ax)
            {
                /*---------------------new version---------------------------------------*/
                val_ax.labels  = null;
                cat_ax.labels  = null;

                val_ax.posX  = null;
                cat_ax.posY  = null;
                val_ax.posY  = null;
                cat_ax.posX  = null;

                val_ax.xPoints  = null;
                cat_ax.yPoints  = null;
                val_ax.yPoints  = null;
                cat_ax.xPoints  = null;


                val_ax.transformYPoints  = null;
                cat_ax.transformXPoints  = null;
                val_ax.transformXPoints  = null;
                cat_ax.transformYPoints  = null;
                var sizes = this.getChartSizes();
                rect = {x: sizes.startX, y:sizes.startY, w:sizes.w, h: sizes.h};
                var arr_val =  this.getValAxisValues();
                //Получим строки для оси значений с учетом формата и единиц
                var arr_strings = [];
                var multiplier;
                if(val_ax.dispUnits)
                    multiplier = val_ax.dispUnits.getMultiplier();
                else
                    multiplier = 1;
                var num_fmt = val_ax.numFmt;
                if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                {
                    var num_format = oNumFormatCache.get(num_fmt.formatCode);
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        var calc_value = arr_val[i]*multiplier;
                        var rich_value = num_format.formatToChart(calc_value);
                        arr_strings.push(rich_value);
                    }
                }
                else
                {
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        var calc_value = arr_val[i]*multiplier;
                        arr_strings.push(calc_value + "");
                    }
                }



                //расчитаем подписи горизонтальной оси значений
                val_ax.labels = new AscFormat.CValAxisLabels(this, val_ax);
                var max_height = 0;
                val_ax.xPoints = [];
                var max_val_ax_label_width = 0;
                for(i = 0; i < arr_strings.length; ++i)
                {
                    var dlbl = new AscFormat.CDLbl();
                    dlbl.parent = val_ax;
                    dlbl.chart = this;
                    dlbl.spPr = val_ax.spPr;
                    dlbl.txPr = val_ax.txPr;
                    dlbl.tx = new AscFormat.CChartText();
                    dlbl.tx.rich = AscFormat.CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                    dlbl.txBody = dlbl.tx.rich;
                    if(val_ax.labels.arrLabels[0])
                    {
                        dlbl.lastStyleObject = val_ax.labels.arrLabels[0].lastStyleObject;
                    }
                    var t = dlbl.tx.rich.recalculateByMaxWord();
                    var h = t.h;
                    if(t.w > max_val_ax_label_width)
                        max_val_ax_label_width = t.w;
                    if(h > max_height)
                        max_height = h;
                    val_ax.labels.arrLabels.push(dlbl);
                    val_ax.xPoints.push({val: arr_val[i], pos: null});
                }

                var val_axis_labels_gap = val_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*25.4/72;
                val_ax.labels.extY = max_height + val_axis_labels_gap;

                //расчитаем подписи для горизонтальной оси
                var ser = chart_object.series[0];
                var string_pts = [], pts_len = 0;

                /*string_pts  pts_len*/
                if(ser && ser.cat)
                {
                    var  lit, b_num_lit = true;
                    if(ser.cat.strRef && ser.cat.strRef.strCache)
                    {
                        lit = ser.cat.strRef.strCache;
                    }
                    else if(ser.cat.strLit)
                    {
                        lit = ser.cat.strLit;
                    }
                    else if(ser.cat.numRef && ser.cat.numRef.numCache)
                    {
                        lit = ser.cat.numRef.numCache;
                        b_num_lit = true;
                    }
                    else if(ser.cat.numLit)
                    {
                        lit = ser.cat.numLit;
                        b_num_lit = true;
                    }
                    if(lit)
                    {
                        var lit_format = null, pt_format = null;
                        if(b_num_lit && typeof lit.formatCode === "string" && lit.formatCode.length > 0)
                        {
                            lit_format = oNumFormatCache.get(lit.formatCode);
                        }
                        pts_len = lit.ptCount;
                        for(i = 0; i < pts_len; ++i)
                        {
                            var pt = lit.getPtByIndex(i);
                            if(pt)
                            {
                                var str_pt;
                                if(b_num_lit)
                                {
                                    if(typeof pt.formatCode === "string" && pt.formatCode.length > 0)
                                    {
                                        pt_format = oNumFormatCache.get(pt.formatCode);
                                        if(pt_format)
                                        {
                                            str_pt = pt_format.formatToChart(pt.val);
                                        }
                                        else
                                        {
                                            str_pt = pt.val;
                                        }
                                    }
                                    else if(lit_format)
                                    {
                                        str_pt = lit_format.formatToChart(pt.val);
                                    }
                                    else
                                    {
                                        str_pt = pt.val;
                                    }
                                }
                                else
                                {
                                    str_pt = pt.val;
                                }
                                string_pts.push({val: str_pt + ""});
                            }
                            else
                            {
                                string_pts.push({val: i + ""});
                            }
                        }
                    }
                }
                //if(string_pts.length === 0)
                {
                    pts_len = 0;
                    for(i = 0; i < chart_object.series.length; ++i)
                    {
                        var cur_pts= null;
                        ser = chart_object.series[i];
                        if(ser.val)
                        {
                            if(ser.val.numRef && ser.val.numRef.numCache)
                                cur_pts = ser.val.numRef.numCache;
                            else if(ser.val.numLit)
                                cur_pts = ser.val.numLit;
                            if(cur_pts)
                            {
                                pts_len = Math.max(pts_len, cur_pts.ptCount);
                            }
                        }
                    }
                    if(pts_len > string_pts.length)
                    {
                        for(i = string_pts.length; i < pts_len; ++i)
                        {
                            string_pts.push({val:i+1 + ""});
                        }
                    }
                    else
                    {
                        string_pts.splice(pts_len, string_pts.length - pts_len);
                    }
                }
                /*---------------------расчет позиции блока с подписями вертикальной оси-----------------------------------------------------------------------------*/
                //расчитаем ширину интервала без учета горизонтальной оси;
                var crosses;//номер категории в которой вертикалная ось пересекает горизонтальную;
                if(val_ax.crosses === AscFormat.CROSSES_AUTO_ZERO || val_ax.crosses === AscFormat.CROSSES_MIN)
                    crosses = 1;
                else if(val_ax.crosses === AscFormat.CROSSES_MAX)
                    crosses = string_pts.length;
                else if(AscFormat.isRealNumber(val_ax.crossesAt))
                {
                    if(val_ax.crossesAt <= string_pts.length + 1 && val_ax.crossesAt > 0)
                        crosses = val_ax.crossesAt;
                    else if(val_ax.crossesAt <= 0)
                        crosses = 1;
                    else
                        crosses = string_pts.length;
                }
                else
                    crosses = 1;


                cat_ax.maxCatVal = string_pts.length;

                var cat_ax_orientation = cat_ax.scaling && AscFormat.isRealNumber(cat_ax.scaling.orientation) ?  cat_ax.scaling.orientation : AscFormat.ORIENTATION_MIN_MAX;
                var labels_pos = val_ax.tickLblPos;
                var cross_between = this.getValAxisCrossType();
                if(cross_between === null){
                    cross_between = AscFormat.CROSS_BETWEEN_BETWEEN;
                }


                var bottom_val_ax_labels_align = true;//приленгание подписей оси значений к левому краю.

                var intervals_count = cross_between === AscFormat.CROSS_BETWEEN_MID_CAT ? string_pts.length - 1 : string_pts.length;
                var point_interval  = rect.h/intervals_count;//интервал между точками. Зависит от crossBetween, а также будет потом корректироваться в зависимости от подписей вертикальной и горизонтальной оси.


                var bottom_points_height, top_point_height;
                var arr_cat_labels_points = [];//массив середин подписей горизонтальной оси; i-й элемент - x-координата центра подписи категории с номером i;
                if(cat_ax_orientation === AscFormat.ORIENTATION_MIN_MAX)
                {
                    if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE || val_ax.bDelete === true)
                    {
                        val_ax.labels = null;
                        if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                        }
                        else
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.y + rect.h - (point_interval/2 + point_interval*i);
                        }
                        val_ax.posY = rect.y + rect.h - point_interval*(crosses-1);
                    }
                    else if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO || !AscFormat.isRealNumber(labels_pos)) //подписи рядом с осью
                    {
                        if(val_ax.crosses === AscFormat.CROSSES_MAX)
                        {
                            if(!bWithoutLabels){
                                val_ax.labels.y = rect.y;
                                point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                            }
                            else{
                                val_ax.labels.y = rect.y - val_ax.labels.extY;
                            }
                            bottom_val_ax_labels_align = false;
                            val_ax.posY = val_ax.labels.y + val_ax.labels.extY;
                            if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = point_interval/2 + rect.y + rect.h - point_interval*i;
                            }
                        }
                        else
                        {
                            bottom_points_height = point_interval*(crosses-1);//общая ширина левых точек если считать что точки занимают все пространство
                            if(bottom_points_height < val_ax.labels.extY && !bWithoutLabels)//подписи верт. оси выходят за пределы области построения
                            {
                                var top_intervals_count = intervals_count - (crosses - 1);//количесво интервалов выше горизонтальной оси
                                //скорректируем point_interval, поделив расстояние, которое осталось справа от подписей осей на количество интервалов справа
                                point_interval = (rect.h - val_ax.labels.extY)/top_intervals_count;
                                val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
                                var start_point = val_ax.labels.y + (crosses-1)*point_interval;//y-координата точки низа области постоения

                                if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = start_point - point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = start_point - point_interval/2 - point_interval*i;
                                }
                            }
                            else
                            {
                                val_ax.labels.y = rect.y + rect.h - bottom_points_height;
                                if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.y + rect.h - (point_interval/2 + point_interval*i);
                                }
                            }
                            val_ax.posY = val_ax.labels.y;
                        }
                    }
                    else if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW)//подписи снизу от области построения
                    {
						if(!bWithoutLabels){
							point_interval = (rect.h -  val_ax.labels.extY)/intervals_count;
							val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;	
						}
						else{
							val_ax.labels.y = rect.y + rect.h;	
						}
                        if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = val_ax.labels.y - point_interval*i;
                        }
                        else
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.y + rect.h  - val_ax.labels.extY - point_interval/2 - point_interval*i;
                        }
                        val_ax.posY = val_ax.labels.y - point_interval*(crosses-1);
                    }
                    else if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH)//подписи сверху от области построения
                    {
						if(!bWithoutLabels){
							point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
							val_ax.labels.y = rect.y;
						}
						else{
							val_ax.labels.y = rect.y - val_ax.labels.extY;
						}
                        point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                        val_ax.labels.y = rect.y;
                        bottom_val_ax_labels_align = false;
                        if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                        }
                        else
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] =rect.y + rect.h - (point_interval/2 + point_interval*i);
                        }
                        val_ax.posY = rect.y + rect.h - point_interval*(crosses-1);
                    }
                    else
                    {
                        val_ax.labels = null;
                        if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.y + rect.h - point_interval*i;
                        }
                        else
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.y + rect.h - (point_interval/2 + point_interval*i);
                        }
                        val_ax.posY = rect.y + rect.h - point_interval*(crosses-1);
                    }
                }
                else
                {//то же самое, только зеркально отраженное
                    if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE || val_ax.bDelete === true)
                    {
                        val_ax.labels = null;
                        if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.y + point_interval*i;
                        }
                        else
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                        }
                        val_ax.posY = rect.y + point_interval*(crosses-1);
                    }
                    else if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO || !AscFormat.isRealNumber(labels_pos)) //подписи рядом с осью
                    {
                        if(val_ax.crosses === AscFormat.CROSSES_MAX)
                        {
							if(!bWithoutLabels){
								val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
								point_interval = (rect.h - val_ax.labels.extY)/intervals_count;	
							}
							else{
								val_ax.labels.y = rect.y + rect.h;								
							}
                            if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                            }
                            val_ax.posY = val_ax.labels.y;
                        }
                        else
                        {
                            bottom_val_ax_labels_align = false;
                            top_point_height = point_interval*(crosses-1);
                            if(top_point_height < val_ax.labels.extY && !bWithoutLabels)
                            {
                                val_ax.labels.y = rect.y;
                                var bottom_points_interval_count = intervals_count - (crosses - 1);
                                point_interval = (rect.h - val_ax.labels.extY)/bottom_points_interval_count;
                                var start_point_bottom = rect.y + rect.h - point_interval*intervals_count;
                                if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = start_point_bottom + point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = start_point_bottom + point_interval/2 + point_interval*i;
                                }
                            }
                            else
                            {
                                val_ax.labels.y = rect.y +  point_interval*(crosses-1) - val_ax.labels.extY;
                                if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.y + point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                                }
                            }
                            val_ax.posY = val_ax.labels.y + val_ax.labels.extY;
                        }
                    }
                    else if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW)//подписи сверху от области построения
                    {
                        bottom_val_ax_labels_align = false;
						if(!bWithoutLabels){
							point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
							val_ax.labels.y = rect.y;	
						}
						else{
							val_ax.labels.y = rect.y - val_ax.labels.extY;	
						}
                        if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = val_ax.labels.y + val_ax.labels.extY + point_interval*i;
                        }
                        else
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = val_ax.labels.y + val_ax.labels.extY + point_interval/2 + point_interval*i;
                        }
                        val_ax.posY = rect.y + val_ax.labels.extY + point_interval*(crosses-1);
                    }
                    else if(labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH)//подписи снизу от области построения
                    {
						if(!bWithoutLabels){
							point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
							val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
						}
						else{
							val_ax.labels.y = rect.y + rect.h;
						}
                        if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.y + point_interval*i;
                        }
                        else
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                        }
                        val_ax.posY = rect.y + point_interval*(crosses-1);
                    }
                    else
                    {
                        val_ax.labels = null;
                        if(cross_between === AscFormat.CROSS_BETWEEN_MID_CAT)
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.y + point_interval*i;
                        }
                        else
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.y + point_interval/2 + point_interval*i;
                        }
                        val_ax.posY = rect.y + point_interval*(crosses-1);
                    }
                }

                cat_ax.interval = point_interval;

                var diagram_height = point_interval*intervals_count;//размер области с самой диаграммой позже будет корректироватся;
                var max_cat_label_height = diagram_height / string_pts.length; // максимальная высота подписи горизонтальной оси;

                cat_ax.labels = null;
                var max_cat_labels_block_width = rect.w/2;
                if(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE !== cat_ax.tickLblPos && !(cat_ax.bDelete === true)) //будем корректировать вертикальные подписи только если есть горизонтальные
                {
                    cat_ax.labels = new AscFormat.CValAxisLabels(this, cat_ax);
                    var tick_lbl_skip = AscFormat.isRealNumber(cat_ax.tickLblSkip) ? cat_ax.tickLblSkip : (string_pts.length < SKIP_LBL_LIMIT ?  1 :  Math.floor(string_pts.length/SKIP_LBL_LIMIT));
                    var max_min_width = 0;
                    var max_max_width = 0;
                    var max_content_width = 0;
                    var arr_min_max_min = [];
                    for(i = 0; i < string_pts.length; ++i)
                    {
                        var dlbl = null;
                        if(i%tick_lbl_skip === 0)
                        {
                            dlbl = new AscFormat.CDLbl();
                            dlbl.parent = cat_ax;
                            dlbl.chart = this;
                            dlbl.spPr = cat_ax.spPr;
                            dlbl.txPr = cat_ax.txPr;
                            dlbl.tx = new AscFormat.CChartText();
                            dlbl.tx.rich = AscFormat.CreateTextBodyFromString(string_pts[i].val.replace(oNonSpaceRegExp, ' '), this.getDrawingDocument(), dlbl);
                            if(cat_ax.labels.arrLabels[0])
                            {
                                dlbl.lastStyleObject = cat_ax.labels.arrLabels[0].lastStyleObject;
                            }
                            dlbl.tx.rich.content.Set_ApplyToAll(true);
                            dlbl.tx.rich.content.Set_ParagraphAlign(AscCommon.align_Center);
                            dlbl.tx.rich.content.Set_ApplyToAll(false);
                            var min_max =  dlbl.tx.rich.content.Recalculate_MinMaxContentWidth();
                            var max_min_content_width = min_max.Min;
                            if(min_max.Max > max_max_width)
                                max_max_width = min_max.Max;

                            if(min_max.Min > max_min_width)
                                max_min_width = min_max.Min;

                            arr_min_max_min[i] = min_max.Min;

                            dlbl.getMaxWidth = function(){return 20000};
                            dlbl.recalcInfo.recalculatePen = false;
                            dlbl.recalcInfo.recalculateBrush = false;
                            dlbl.recalculate();
                            delete dlbl.getMaxWidth;
                            if(dlbl.tx.rich.content.XLimit > max_content_width)
                                max_content_width = dlbl.tx.rich.content.XLimit;
                        }
                        cat_ax.labels.arrLabels.push(dlbl);
                    }
                    var stake_offset = AscFormat.isRealNumber(cat_ax.lblOffset) ? cat_ax.lblOffset/100 : 1;
                    var labels_offset = cat_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72)*stake_offset;
                    //сначала посмотрим убираются ли в максимальную допустимую ширину подписей подписи расчитанные в одну строку

                    var width_flag;
                    if(max_content_width + labels_offset < max_cat_labels_block_width)
                    {
                        width_flag = 0;
                        cat_ax.labels.extX = max_content_width + labels_offset;
                    }
                    else if(max_min_width + labels_offset < max_cat_labels_block_width)//ситуация, когда возможно разместить подписи без переноса слов
                    {
                        width_flag = 1;
                        cat_ax.labels.extX = max_min_width + labels_offset;
                    }
                    else //выставляем максимально возможную ширину
                    {
                        width_flag = 2;
                        cat_ax.labels.extX = max_cat_labels_block_width;
                    }
                }
                var cat_labels_align_left = true;//выравнивание подписей в блоке сподписями по левому краю(т. е. зазор находится справа)
                /*-----------------------------------------------------------------------*/
                var crosses_val_ax;//значение на горизонтальной оси значений в котором её пересекает горизонтальная
                if(cat_ax.crosses === AscFormat.CROSSES_AUTO_ZERO)
                {
                    if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                        crosses_val_ax = 0;
                    else if(arr_val[arr_val.length-1] < 0)
                        crosses_val_ax = arr_val[arr_val.length-1];
                    else
                        crosses_val_ax = arr_val[0];
                }
                else if(cat_ax.crosses === AscFormat.CROSSES_MIN)
                {
                    crosses_val_ax = arr_val[0];
                }
                else if(cat_ax.crosses === AscFormat.CROSSES_MAX)
                {
                    crosses_val_ax = arr_val[arr_val.length - 1];
                }
                else if(AscFormat.isRealNumber(cat_ax.crossesAt) && cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                {
                    //сделаем провеку на попадание в интервал
                    if(cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                        crosses_val_ax = cat_ax.crossesAt;
                }
                else
                { //ведем себя как в случае (cat_ax.crosses === AscFormat.CROSSES_AUTO_ZERO)
                    if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                        crosses_val_ax = 0;
                    else if(arr_val[arr_val.length-1] < 0)
                        crosses_val_ax = arr_val[arr_val.length-1];
                    else
                        crosses_val_ax = arr_val[0];
                }
                var val_ax_orientation = val_ax.scaling && AscFormat.isRealNumber(val_ax.scaling.orientation) ? val_ax.scaling.orientation : AscFormat.ORIENTATION_MIN_MAX;
                var hor_labels_pos = cat_ax.tickLblPos;



                var first_val_lbl_half_width = (val_ax.tickLblPos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE || val_ax.bDelete) ? 0 : val_ax.labels.arrLabels[0].tx.rich.content.XLimit/2;
                var last_val_lbl_half_width = (val_ax.tickLblPos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE || val_ax.bDelete) ? 0 : val_ax.labels.arrLabels[val_ax.labels.arrLabels.length-1].tx.rich.content.XLimit/2;
                var right_gap, left_gap;

                var arr_val_labels_points = [];//массив середин подписей вертикальной оси; i-й элемент - x-координата центра подписи i-огто значения;
                var unit_width = checkFiniteNumber((rect.w - first_val_lbl_half_width - last_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]));//ширина единицы измерения на вертикальной оси
                var cat_ax_ext_x = cat_ax.labels && !bWithoutLabels ? cat_ax.labels.extX : 0;
                if(val_ax_orientation === AscFormat.ORIENTATION_MIN_MAX)
                {
                    if(hor_labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO || !AscFormat.isRealNumber(hor_labels_pos))
                    {
                        if(cat_ax.crosses === AscFormat.CROSSES_MAX)
                        {
                            if(!bNeedReflect)
                            {
                                right_gap = Math.max(last_val_lbl_half_width, cat_ax_ext_x);
                            }
                            else
                            {
                                right_gap = Math.max(last_val_lbl_half_width, 0);
                            }
                            cat_labels_align_left = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                            if(cat_ax.labels)
                                cat_ax.labels.x = rect.x + rect.w - right_gap;
                            unit_width = checkFiniteNumber((rect.w - right_gap - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]));
                            cat_ax.posX = rect.x + first_val_lbl_half_width + (crosses_val_ax - arr_val[0])*unit_width;
                        }
                        else
                        {
                            if(!bNeedReflect && (crosses_val_ax - arr_val[0])*unit_width + first_val_lbl_half_width  < cat_ax_ext_x)
                            {
                                unit_width = checkFiniteNumber((rect.w -  cat_ax_ext_x - last_val_lbl_half_width)/(arr_val[arr_val.length-1] - crosses_val_ax));
                            }
                            cat_ax.posX = rect.x + rect.w - last_val_lbl_half_width - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_width;
                            if(cat_ax.labels)
                                cat_ax.labels.x = cat_ax.posX - cat_ax.labels.extX;
                        }
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width;
                    }
                    else if(hor_labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW)
                    {
                        if(!bNeedReflect)
                        {
                            left_gap = Math.max(first_val_lbl_half_width, cat_ax_ext_x);
                        }
                        else
                        {
                            left_gap = Math.max(first_val_lbl_half_width, 0);
                        }


                        unit_width = checkFiniteNumber((rect.w - left_gap - last_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]));

                        cat_ax.posX = rect.x + rect.w - (arr_val[arr_val.length-1] - crosses_val_ax )*unit_width - last_val_lbl_half_width;

                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width;
                        if(cat_ax.labels)
                            cat_ax.labels.x = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width - cat_ax.labels.extX;
                    }
                    else if(hor_labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH)
                    {
                        cat_labels_align_left = false;

                        if(!bNeedReflect)
                        {
                            right_gap = Math.max(last_val_lbl_half_width, cat_ax_ext_x);
                        }
                        else
                        {
                            right_gap = Math.max(last_val_lbl_half_width, 0);
                        }

                        unit_width = checkFiniteNumber((rect.w - right_gap - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]));
                        cat_ax.posX = rect.x +  first_val_lbl_half_width + (crosses_val_ax - arr_val[0])*unit_width;

                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width;
                    }
                    else
                    {
                        //подписей осей нет
                        cat_ax.labels = null;
                        unit_width = checkFiniteNumber((rect.w - last_val_lbl_half_width - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]));
                        cat_ax.posX = rect.x +  first_val_lbl_half_width + (crosses_val_ax - arr_val[0])*unit_width;
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = cat_ax.posX + (arr_val[i] - crosses_val_ax)*unit_width;
                    }
                }
                else
                {//зеркально отражаем
                    if(hor_labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO || !AscFormat.isRealNumber(hor_labels_pos))
                    {
                        if(cat_ax.crosses === AscFormat.CROSSES_MAX)
                        {
                            if(!bNeedReflect)
                            {
                                left_gap = Math.max(cat_ax_ext_x, last_val_lbl_half_width);
                            }
                            else
                            {
                                left_gap = Math.max(0, last_val_lbl_half_width);
                            }
                            unit_width = checkFiniteNumber((rect.w - left_gap - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]));
                            cat_ax.posX = rect.x + rect.w - first_val_lbl_half_width - (crosses_val_ax - arr_val[0])*unit_width;
                            if(cat_ax.labels)
                                cat_ax.labels.x = cat_ax.posX - cat_ax.labels.extX;
                        }
                        else
                        {
                            cat_labels_align_left = false;
                            if(!bNeedReflect && first_val_lbl_half_width < cat_ax_ext_x)
                            {
                                unit_width = checkFiniteNumber((rect.w - cat_ax_ext_x - last_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]));
                            }
                            cat_ax.posX = rect.x + last_val_lbl_half_width + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_width;
                            if(cat_ax.labels)
                                cat_ax.labels.x = cat_ax.posX;
                        }
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = cat_ax.posX - (arr_val[i] - crosses_val_ax)*unit_width;
                    }
                    else if(hor_labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW)
                    {
                        cat_labels_align_left = false;
                        if(!bNeedReflect)
                        {
                            right_gap = Math.max(first_val_lbl_half_width, cat_ax_ext_x);
                        }
                        else
                        {
                            right_gap = Math.max(first_val_lbl_half_width, 0);
                        }

                        unit_width = checkFiniteNumber((rect.w - last_val_lbl_half_width - right_gap)/(arr_val[arr_val.length-1] - arr_val[0]));
                        cat_ax.posX = rect.x + last_val_lbl_half_width + (arr_val[arr_val.length-1] - crosses_val_ax)*crosses_val_ax;
                        if(cat_ax.labels)
                            cat_ax.labels.x = cat_ax.posX - (arr_val[0] - crosses_val_ax)*unit_width;
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = cat_ax.posX - (arr_val[i] - crosses_val_ax)*unit_width;

                    }
                    else if(hor_labels_pos === c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH)
                    {
                        if(!bNeedReflect)
                        {
                            left_gap = Math.max(cat_ax_ext_x, last_val_lbl_half_width);
                        }
                        else
                        {
                            left_gap = Math.max(0, last_val_lbl_half_width);
                        }

                        unit_width = checkFiniteNumber((rect.w - left_gap - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]));
                        cat_ax.posX = rect.x + rect.w - first_val_lbl_half_width - (crosses_val_ax - arr_val[0])*unit_width;
                        if(cat_ax.labels)
                            cat_ax.labels.x = cat_ax.posX - (arr_val[arr_val.length-1] - crosses_val_ax)*unit_width - cat_ax.labels.extX;
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = cat_ax.posX - (arr_val[i] - crosses_val_ax)*unit_width;
                    }
                    else
                    {//подписей осей нет
                        cat_ax.labels = null;
                        unit_width = checkFiniteNumber((rect.w - last_val_lbl_half_width - first_val_lbl_half_width)/(arr_val[arr_val.length - 1] - arr_val[0]));
                        cat_ax.posX = rect.x + rect.w - first_val_lbl_half_width - (crosses_val_ax - arr_val[0])*unit_width;
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = cat_ax.posX - (arr_val[i] - crosses_val_ax)*unit_width;
                    }
                }
                val_ax.interval = unit_width;
                //запишем в оси необходимую информацию для отрисовщика plotArea  и выставим окончательные позиции для подписей
                var local_transform_text;
                if(val_ax.labels)
                {
                    val_ax.labels.x = Math.min.apply(Math, arr_val_labels_points) - max_val_ax_label_width/2;
                    val_ax.labels.extX = Math.max.apply(Math, arr_val_labels_points) - Math.min.apply(Math, arr_val_labels_points) + max_val_ax_label_width;
                    //val_axis_labels_gap - вертикальный зазор

                    val_ax.labels.align = bottom_val_ax_labels_align;
                    if(bottom_val_ax_labels_align)
                    {
                        var y_pos = val_ax.labels.y + val_axis_labels_gap;
                        for(i = 0;  i < val_ax.labels.arrLabels.length; ++i)
                        {
                            var text_transform = val_ax.labels.arrLabels[i].transformText;
                            text_transform.Reset();
                            global_MatrixTransformer.TranslateAppend(text_transform, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit/2, y_pos);
                           // global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());

                            var local_transform_text = val_ax.labels.arrLabels[i].localTransformText;
                            local_transform_text.Reset();
                            global_MatrixTransformer.TranslateAppend(local_transform_text, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit/2, y_pos);
                        }
                    }
                    else
                    {
                        for(i = 0;  i < val_ax.labels.arrLabels.length; ++i)
                        {
                            var text_transform = val_ax.labels.arrLabels[i].transformText;
                            text_transform.Reset();
                            global_MatrixTransformer.TranslateAppend(text_transform, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit/2, val_ax.labels.y + val_ax.labels.extY - val_axis_labels_gap - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight());
                        //    global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());


                            var local_transform_text = val_ax.labels.arrLabels[i].localTransformText;
                            local_transform_text.Reset();
                            global_MatrixTransformer.TranslateAppend(local_transform_text, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit/2, val_ax.labels.y + val_ax.labels.extY - val_axis_labels_gap - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight());
                        }
                    }
                }
                val_ax.xPoints = [];


                for(i = 0; i < arr_val_labels_points.length; ++i)
                {
                    val_ax.xPoints[i] = {val:arr_val[i], pos: arr_val_labels_points[i]};
                }

                cat_ax.yPoints = [];
                for(i = 0; i <arr_cat_labels_points.length; ++i)
                {
                    cat_ax.yPoints[i] = {val: i, pos: arr_cat_labels_points[i]};
                }
                if(cat_ax.labels)
                {
                    cat_ax.labels.y = rect.y;
                    cat_ax.labels.extY = point_interval*intervals_count;

                    if(bNeedReflect)
                    {
                        if(cat_labels_align_left)
                        {
                            cat_labels_align_left = false;
                            cat_ax.labels.x += cat_ax.labels.extX;
                        }
                        else
                        {
                            cat_labels_align_left = true;
                            cat_ax.labels.x -= cat_ax.labels.extX;
                        }
                    }
                    if(cat_labels_align_left)
                    {


                        if(width_flag === 0)
                        {
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                    transform_text.Reset();
                                    global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                               //     global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                    local_transform_text = cat_ax.labels.arrLabels[i].localTransformText;
                                    local_transform_text.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                }
                            }
                        }
                        else if(width_flag === 1)
                        {
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, arr_min_max_min[i], 20000);
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);

                                    var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                    transform_text.Reset();
                                    global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                  //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                    local_transform_text = cat_ax.labels.arrLabels[i].localTransformText;
                                    local_transform_text.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                }
                            }
                        }
                        else
                        {
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, cat_ax.labels.extX - labels_offset, 20000);
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);

                                    var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                    transform_text.Reset();
                                    global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                  //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                    local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, cat_ax.labels.x + cat_ax.labels.extX - cat_ax.labels.arrLabels[i].tx.rich.content.XLimit - labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                }
                            }
                        }



                        /*for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                         {
                         if(cat_ax.labels.arrLabels[i])
                         {
                         cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(true);
                         cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(align_Center);
                         cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(false);
                         cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, cat_ax.labels.extX - labels_offset, 2000);
                         cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);
                         cat_ax.labels.arrLabels[i].setPosition(cat_ax.labels.x, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                         }
                         }    */
                    }
                    else
                    {
                        if(width_flag === 0)
                        {
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                    transform_text.Reset();
                                    global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                 //   global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                    local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                }
                            }
                        }
                        else if(width_flag === 1)
                        {
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, arr_min_max_min[i], 20000);
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);

                                    var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                    transform_text.Reset();
                                    global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                  //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                    local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);

                                }
                            }
                        }
                        else
                        {
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, cat_ax.labels.extX - labels_offset, 20000);
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);
                                    var transform_text = cat_ax.labels.arrLabels[i].transformText;
                                    transform_text.Reset();
                                    global_MatrixTransformer.TranslateAppend(transform_text, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                  //  global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());

                                    local_text_transform = cat_ax.labels.arrLabels[i].localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                                }
                            }
                        }
                    }
                }

                cat_ax.yPoints.sort(function(a, b){return a.val - b.val});
                val_ax.xPoints.sort(function(a, b){return a.val - b.val});
            }
        }
        this.plotAreaRect = rect;
    }
};

CChartSpace.prototype.checkAxisLabelsTransform = function()
{
    if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0] && this.chart.plotArea.charts[0].getAxisByTypes)
    {
        var oAxisByTypes = this.chart.plotArea.charts[0].getAxisByTypes();
        var oCatAx = oAxisByTypes.catAx[0], oValAx = oAxisByTypes.valAx[0], deltaX, deltaY, i, oAxisLabels, oLabel, oNewPos;
        var oProcessor3D = this.chartObj && this.chartObj.processor3D;
        var aXPoints = [], aYPoints = [];
        if(oCatAx && oValAx && oProcessor3D)
        {
            if(( (oCatAx.axPos === AscFormat.AX_POS_B || oCatAx.axPos === AscFormat.AX_POS_T) && oCatAx.xPoints) &&
                ((oValAx.axPos === AscFormat.AX_POS_L || oValAx.axPos === AscFormat.AX_POS_R) && oValAx.yPoints))
            {
                oAxisLabels = oCatAx.labels;
                
                if(oAxisLabels)
                {
                    var dZPositionCatAxis = oProcessor3D.calculateZPositionCatAxis();
                    var dPosY, dPosY2
                    if(oAxisLabels.align)
                    {
                        dPosY = oAxisLabels.y*this.chartObj.calcProp.pxToMM;
                        dPosY2 = oAxisLabels.y;
                    }
                    else
                    {

                        dPosY = (oAxisLabels.y + oAxisLabels.extY)*this.chartObj.calcProp.pxToMM;
                        dPosY2 = oAxisLabels.y + oAxisLabels.extY;
                    }
                    var fBottomLabels = -100;
                    if(!oAxisLabels.bRotated)
                    {
                        for(i = 0; i < oAxisLabels.arrLabels.length; ++i)
                        {
                            oLabel = oAxisLabels.arrLabels[i];
                            if(oLabel)
                            {
                                var oCPosLabelX;
                                oCPosLabelX = oLabel.localTransformText.TransformPointX(oLabel.txBody.content.XLimit/2, 0);
                                oNewPos = oProcessor3D.convertAndTurnPoint(oCPosLabelX*this.chartObj.calcProp.pxToMM, dPosY, dZPositionCatAxis);
                                oLabel.setPosition2(oNewPos.x/this.chartObj.calcProp.pxToMM + oLabel.localTransformText.tx - oCPosLabelX, oLabel.localTransformText.ty - dPosY2 + oNewPos.y/this.chartObj.calcProp.pxToMM );
                                var fBottomContent = oLabel.y + oLabel.tx.rich.content.Get_SummaryHeight();
                                if(fBottomContent > fBottomLabels){
                                    fBottomLabels = fBottomContent;
                                }

                            }
                        }
                    }
                    else
                    {
                        if(oAxisLabels.align)
                        {
                            var stake_offset = AscFormat.isRealNumber(oCatAx.lblOffset) ? oCatAx.lblOffset/100 : 1;
                            var labels_offset = oCatAx.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72)*stake_offset;
                            for(i = 0; i < oAxisLabels.arrLabels.length; ++i)
                            {
                                if(oAxisLabels.arrLabels[i])
                                {
                                    oLabel = oAxisLabels.arrLabels[i];
                                    var wh = {w: oLabel.widthForTransform, h: oLabel.tx.rich.content.Get_SummaryHeight()}, w2, h2, x1, y0, xc, yc;
                                    w2 = wh.w*Math.cos(Math.PI/4) + wh.h*Math.sin(Math.PI/4);
                                    h2 = wh.w*Math.sin(Math.PI/4) + wh.h*Math.cos(Math.PI/4);
                                    x1 = oCatAx.xPoints[i].pos + wh.h*Math.sin(Math.PI/4);
                                    y0 = oAxisLabels.y + labels_offset;
                                    var x1t, y0t;
                                    var oRes = oProcessor3D.convertAndTurnPoint(x1*this.chartObj.calcProp.pxToMM, y0*this.chartObj.calcProp.pxToMM, dZPositionCatAxis);
                                    x1t = oRes.x/this.chartObj.calcProp.pxToMM;
                                    y0t = oRes.y/this.chartObj.calcProp.pxToMM;
                                    xc = x1t - w2/2;
                                    yc = y0t + h2/2;
                                    var local_text_transform = oLabel.localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, -wh.w/2, -wh.h/2);
                                    global_MatrixTransformer.RotateRadAppend(local_text_transform, Math.PI/4);
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, xc, yc);

                                    var fBottomContent = y0t + h2;
                                    if(fBottomContent > fBottomLabels){
                                        fBottomLabels = fBottomContent;
                                    }
                                }
                            }
                        }
                        else
                        {
                            var stake_offset = AscFormat.isRealNumber(oCatAx.lblOffset) ? oCatAx.lblOffset/100 : 1;
                            var labels_offset = oCatAx.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72)*stake_offset;
                            for(i = 0; i < oAxisLabels.arrLabels.length; ++i)
                            {
                                if(oAxisLabels.arrLabels[i])
                                {
                                    oLabel = oAxisLabels.arrLabels[i];
                                    var wh = {w: oLabel.widthForTransform, h: oLabel.tx.rich.content.Get_SummaryHeight()}, w2, h2, x1, y0, xc, yc;
                                    w2 = wh.w*Math.cos(Math.PI/4) + wh.h*Math.sin(Math.PI/4);
                                    h2 = wh.w*Math.sin(Math.PI/4) + wh.h*Math.cos(Math.PI/4);
                                    x1 = oCatAx.xPoints[i].pos - wh.h*Math.sin(Math.PI/4);
                                    y0 =  oAxisLabels.y +  oAxisLabels.extY - labels_offset;
                                    var x1t, y0t;
                                    var oRes = oProcessor3D.convertAndTurnPoint(x1*this.chartObj.calcProp.pxToMM, y0*this.chartObj.calcProp.pxToMM, dZPositionCatAxis);
                                    x1t = oRes.x/this.chartObj.calcProp.pxToMM;
                                    y0t = oRes.y/this.chartObj.calcProp.pxToMM;
                                    xc = x1t + w2/2;
                                    yc = y0t - h2/2;
                                    local_text_transform = oLabel.localTransformText;
                                    local_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, -wh.w/2, -wh.h/2);
                                    global_MatrixTransformer.RotateRadAppend(local_text_transform, Math.PI/4);//TODO
                                    global_MatrixTransformer.TranslateAppend(local_text_transform, xc, yc);
                                }
                            }
                        }
                    }

                    oNewPos = oProcessor3D.convertAndTurnPoint(oAxisLabels.x*this.chartObj.calcProp.pxToMM, oAxisLabels.y*this.chartObj.calcProp.pxToMM, dZPositionCatAxis);
                    aXPoints.push(oNewPos.x/this.chartObj.calcProp.pxToMM);
                    aYPoints.push(oNewPos.y/this.chartObj.calcProp.pxToMM);
                    oNewPos = oProcessor3D.convertAndTurnPoint((oAxisLabels.x + oAxisLabels.extX)*this.chartObj.calcProp.pxToMM, oAxisLabels.y*this.chartObj.calcProp.pxToMM, dZPositionCatAxis);
                    aXPoints.push(oNewPos.x/this.chartObj.calcProp.pxToMM);
                    aYPoints.push(oNewPos.y/this.chartObj.calcProp.pxToMM);
                    oNewPos = oProcessor3D.convertAndTurnPoint((oAxisLabels.x + oAxisLabels.extX)*this.chartObj.calcProp.pxToMM, (oAxisLabels.y + oAxisLabels.extY)*this.chartObj.calcProp.pxToMM, dZPositionCatAxis);
                    aXPoints.push(oNewPos.x/this.chartObj.calcProp.pxToMM);
                    aYPoints.push(oNewPos.y/this.chartObj.calcProp.pxToMM);
                    oNewPos = oProcessor3D.convertAndTurnPoint((oAxisLabels.x)*this.chartObj.calcProp.pxToMM, (oAxisLabels.y + oAxisLabels.extY)*this.chartObj.calcProp.pxToMM, dZPositionCatAxis);
                    aXPoints.push(oNewPos.x/this.chartObj.calcProp.pxToMM);
                    aYPoints.push(oNewPos.y/this.chartObj.calcProp.pxToMM);
                    oAxisLabels.x = Math.min.apply(Math, aXPoints);
                    oAxisLabels.y = Math.min.apply(Math, aYPoints);
                    oAxisLabels.extX = Math.max.apply(Math, aXPoints) - oAxisLabels.x;
                    oAxisLabels.extY = Math.max(Math.max.apply(Math, aYPoints), fBottomLabels) - oAxisLabels.y;
                }
                oAxisLabels = oValAx.labels;
                if(oAxisLabels)
                {
                    var dZPositionCatAxis = oProcessor3D.calculateZPositionValAxis();

                    var dPosX, dPosX2;
                    if(!oAxisLabels.align)
                    {
                        dPosX2 = oAxisLabels.x;
                        dPosX =  oAxisLabels.x*this.chartObj.calcProp.pxToMM;
                    }
                    else
                    {
                        dPosX2 = oAxisLabels.x + oAxisLabels.extX;
                        dPosX = (oAxisLabels.x + oAxisLabels.extX)*this.chartObj.calcProp.pxToMM;
                    }
                    aXPoints.length = 0;
                    aYPoints.length = 0;
                    for(i = 0; i < oAxisLabels.arrLabels.length; ++i)
                    {
                        oLabel = oAxisLabels.arrLabels[i];
                        if(oLabel)
                        {
                            oNewPos =  oProcessor3D.convertAndTurnPoint(dPosX, oLabel.localTransformText.ty*this.chartObj.calcProp.pxToMM, dZPositionCatAxis);
                            oLabel.setPosition2(oLabel.localTransformText.tx - dPosX2 + oNewPos.x/this.chartObj.calcProp.pxToMM, oNewPos.y/this.chartObj.calcProp.pxToMM);
                            aXPoints.push(oLabel.x);
                            aYPoints.push(oLabel.y);
                            aXPoints.push(oLabel.x + oLabel.txBody.content.XLimit);
                            aYPoints.push(oLabel.y + oLabel.txBody.content.Get_SummaryHeight());
                        }
                    }
                    if(aXPoints.length > 0 && aYPoints.length > 0)
                    {
                        oAxisLabels.x = Math.min.apply(Math, aXPoints);
                        oAxisLabels.y = Math.min.apply(Math, aYPoints);
                        oAxisLabels.extX = Math.max.apply(Math, aXPoints) - oAxisLabels.x;
                        oAxisLabels.extY = Math.max.apply(Math, aYPoints) - oAxisLabels.y;
                    }
                }
            }
            else if(((oCatAx.axPos === AscFormat.AX_POS_L || oCatAx.axPos === AscFormat.AX_POS_R) && oCatAx.yPoints) &&
                ((oValAx.axPos === AscFormat.AX_POS_T || oValAx.axPos === AscFormat.AX_POS_B) && oValAx.xPoints))
            {
                oAxisLabels = oValAx.labels;

                if(oAxisLabels)
                {
                    var dZPositionValAxis = oProcessor3D.calculateZPositionValAxis();
                    var dPosY, dPosY2
                    if(oAxisLabels.align)
                    {
                        dPosY = oAxisLabels.y*this.chartObj.calcProp.pxToMM;
                        dPosY2 = oAxisLabels.y;
                    }
                    else
                    {
                        dPosY = (oAxisLabels.y + oAxisLabels.extY)*this.chartObj.calcProp.pxToMM;
                        dPosY2 = oAxisLabels.y + oAxisLabels.extY;
                    }

                    for(i = 0; i < oAxisLabels.arrLabels.length; ++i)
                    {
                        oLabel = oAxisLabels.arrLabels[i];
                        if(oLabel)
                        {

                            var oCPosLabelX = oLabel.localTransformText.TransformPointX(oLabel.txBody.content.XLimit/2, 0);
                            var oCPosLabelY = oLabel.localTransformText.TransformPointY(oLabel.txBody.content.XLimit/2, 0);
                            oNewPos = oProcessor3D.convertAndTurnPoint(oCPosLabelX*this.chartObj.calcProp.pxToMM, dPosY, dZPositionValAxis);

                            oLabel.setPosition2(oNewPos.x/this.chartObj.calcProp.pxToMM + oLabel.localTransformText.tx - oCPosLabelX, oLabel.localTransformText.ty - dPosY2 + oNewPos.y/this.chartObj.calcProp.pxToMM );


                            //oNewPos = oProcessor3D.convertAndTurnPoint(oLabel.localTransformText.tx*this.chartObj.calcProp.pxToMM, oLabel.localTransformText.ty*this.chartObj.calcProp.pxToMM, dZPositionValAxis);;
                           //oLabel.setPosition2(oNewPos.x/this.chartObj.calcProp.pxToMM, oNewPos.y/this.chartObj.calcProp.pxToMM);
                        }
                    }
                    oNewPos = oProcessor3D.convertAndTurnPoint(oAxisLabels.x*this.chartObj.calcProp.pxToMM, oAxisLabels.y*this.chartObj.calcProp.pxToMM, dZPositionValAxis);
                    aXPoints.push(oNewPos.x/this.chartObj.calcProp.pxToMM);
                    aYPoints.push(oNewPos.y/this.chartObj.calcProp.pxToMM);
                    oNewPos = oProcessor3D.convertAndTurnPoint((oAxisLabels.x + oAxisLabels.extX)*this.chartObj.calcProp.pxToMM, oAxisLabels.y*this.chartObj.calcProp.pxToMM, dZPositionValAxis);
                    aXPoints.push(oNewPos.x/this.chartObj.calcProp.pxToMM);
                    aYPoints.push(oNewPos.y/this.chartObj.calcProp.pxToMM);
                    oNewPos = oProcessor3D.convertAndTurnPoint((oAxisLabels.x + oAxisLabels.extX)*this.chartObj.calcProp.pxToMM, (oAxisLabels.y + oAxisLabels.extY)*this.chartObj.calcProp.pxToMM, dZPositionValAxis);
                    aXPoints.push(oNewPos.x/this.chartObj.calcProp.pxToMM);
                    aYPoints.push(oNewPos.y/this.chartObj.calcProp.pxToMM);
                    oNewPos = oProcessor3D.convertAndTurnPoint((oAxisLabels.x)*this.chartObj.calcProp.pxToMM, (oAxisLabels.y + oAxisLabels.extY)*this.chartObj.calcProp.pxToMM, dZPositionValAxis);
                    aXPoints.push(oNewPos.x/this.chartObj.calcProp.pxToMM);
                    aYPoints.push(oNewPos.y/this.chartObj.calcProp.pxToMM);
                    oAxisLabels.x = Math.min.apply(Math, aXPoints);
                    oAxisLabels.y = Math.min.apply(Math, aYPoints);
                    oAxisLabels.extX = Math.max.apply(Math, aXPoints) - oAxisLabels.x;
                    oAxisLabels.extY = Math.max.apply(Math, aYPoints) - oAxisLabels.y;
                }


                oAxisLabels = oCatAx.labels;

                aXPoints.length = 0;
                aYPoints.length = 0;
                if(oAxisLabels)
                {
                    var dZPositionCatAxis = oProcessor3D.calculateZPositionCatAxis();
                    var dPosX, dPosX2;
                    if(oAxisLabels.align)
                    {
                        dPosX2 = oAxisLabels.x;
                        dPosX =  oAxisLabels.x*this.chartObj.calcProp.pxToMM;
                    }
                    else
                    {
                        dPosX2 = oAxisLabels.x + oAxisLabels.extX;
                        dPosX = (oAxisLabels.x + oAxisLabels.extX)*this.chartObj.calcProp.pxToMM;
                    }

                    for(i = 0; i < oAxisLabels.arrLabels.length; ++i)
                    {
                        oLabel = oAxisLabels.arrLabels[i];

                        if(oLabel)
                        {
                            oNewPos =  oProcessor3D.convertAndTurnPoint(dPosX, oLabel.localTransformText.ty*this.chartObj.calcProp.pxToMM, dZPositionCatAxis);
                            oLabel.setPosition2(oLabel.localTransformText.tx - dPosX2 + oNewPos.x/this.chartObj.calcProp.pxToMM, oNewPos.y/this.chartObj.calcProp.pxToMM);
                            aXPoints.push(oLabel.x);
                            aYPoints.push(oLabel.y);
                            aXPoints.push(oLabel.x + oLabel.txBody.content.XLimit);
                            aYPoints.push(oLabel.y + oLabel.txBody.content.Get_SummaryHeight());
                        }
                    }
                    if(aXPoints.length > 0 && aYPoints.length > 0)
                    {
                        oAxisLabels.x = Math.min.apply(Math, aXPoints);
                        oAxisLabels.y = Math.min.apply(Math, aYPoints);
                        oAxisLabels.extX = Math.max.apply(Math, aXPoints) - oAxisLabels.x;
                        oAxisLabels.extY = Math.max.apply(Math, aYPoints) - oAxisLabels.y;
                    }
                }
            }
        }
    }
};

CChartSpace.prototype.hitInTextRect = function()
{
    return false;
};

    CChartSpace.prototype.recalculateLegend = function()
    {
        if(this.chart && this.chart.legend)
        {
            var parents = this.getParentObjects();
            var RGBA = {R:0, G:0, B: 0, A:255};
            var legend = this.chart.legend;
            var arr_str_labels = [], i;
            var calc_entryes = legend.calcEntryes;
            calc_entryes.length = 0;
            var series = this.getAllSeries();
            var calc_entry, union_marker, entry;
            var max_width = 0, cur_width, max_font_size = 0, cur_font_size, ser, b_line_series;
            var max_word_width = 0;
            this.chart.legend.chart = this;
            var b_scatter_no_line = false;/*(this.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_ScatterChart &&
         (this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_MARKER || this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_NONE));  */
            this.legendLength = null;
            if( !this.chart.plotArea.charts[0].varyColors
                || (this.chart.plotArea.charts[0].getObjectType() !== AscDFH.historyitem_type_PieChart && this.chart.plotArea.charts[0].getObjectType() !== AscDFH.historyitem_type_DoughnutChart) && series.length !== 1
                || this.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_SurfaceChart)
            {
                var bSurfaceChart = false;
                if(this.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_SurfaceChart){
                    this.legendLength = this.chart.plotArea.charts[0].compiledBandFormats.length;
                    ser = series[0];
                    bSurfaceChart = true;
                }
                else {
                    this.legendLength = series.length;
                }
                for(i = 0; i < this.legendLength; ++i)
                {
                    if(!bSurfaceChart){
                        ser = series[i];

                        if(ser.isHiddenForLegend)
                            continue;
                        entry = legend.findLegendEntryByIndex(i);
                        if(entry && entry.bDelete)
                            continue;
                        arr_str_labels.push(ser.getSeriesName());
                    }
                    else{
                        entry = legend.findLegendEntryByIndex(i);
                        if(entry && entry.bDelete)
                            continue;
                        var oBandFmt = this.chart.plotArea.charts[0].compiledBandFormats[i];
                        arr_str_labels.push(oBandFmt.startValue + "-" + oBandFmt.endValue);
                    }
                    calc_entry = new AscFormat.CalcLegendEntry(legend, this, i);
                    calc_entry.txBody = AscFormat.CreateTextBodyFromString(arr_str_labels[arr_str_labels.length - 1], this.getDrawingDocument(), calc_entry);

                    //if(entry)
                    //    calc_entry.txPr = entry.txPr;

                    /*if(calc_entryes[0])
                     {
                     calc_entry.lastStyleObject = calc_entryes[0].lastStyleObject;
                     }*/
                    calc_entryes.push(calc_entry);
                    cur_width = calc_entry.txBody.getRectWidth(2000);
                    if(cur_width > max_width)
                        max_width = cur_width;

                    cur_font_size = calc_entry.txBody.content.Content[0].CompiledPr.Pr.TextPr.FontSize;
                    if(cur_font_size > max_font_size)
                        max_font_size = cur_font_size;

                    calc_entry.calcMarkerUnion = new AscFormat.CUnionMarker();
                    union_marker = calc_entry.calcMarkerUnion;
                    var pts = AscFormat.getPtsFromSeries(ser);
                    switch(ser.getObjectType())
                    {
                        case AscDFH.historyitem_type_BarSeries:
                        case AscDFH.historyitem_type_BubbleSeries:
                        case AscDFH.historyitem_type_AreaSeries:
                        case AscDFH.historyitem_type_PieSeries:
                        {
                            union_marker.marker = AscFormat.CreateMarkerGeometryByType(AscFormat.SYMBOL_SQUARE, null);
                            union_marker.marker.pen = ser.compiledSeriesPen;
                            union_marker.marker.brush = ser.compiledSeriesBrush;
                            break;
                        }
                        case AscDFH.historyitem_type_SurfaceSeries:{

                            var oBandFmt = this.chart.plotArea.charts[0].compiledBandFormats[i];
                            union_marker.marker = AscFormat.CreateMarkerGeometryByType(AscFormat.SYMBOL_SQUARE, null);
                            union_marker.marker.pen = oBandFmt.spPr.ln;
                            union_marker.marker.brush = oBandFmt.spPr.Fill;
                            break;
                        }
                        case AscDFH.historyitem_type_LineSeries:
                        case AscDFH.historyitem_type_ScatterSer:
                        case AscDFH.historyitem_type_SurfaceSeries:
                        {
                            if(AscFormat.CChartsDrawer.prototype._isSwitchCurrent3DChart(this))
                            {
                                union_marker.marker = AscFormat.CreateMarkerGeometryByType(AscFormat.SYMBOL_SQUARE, null);
                                union_marker.marker.pen = ser.compiledSeriesPen;
                                union_marker.marker.brush = ser.compiledSeriesBrush;
                                break;
                            }
                            if(ser.compiledSeriesMarker)
                            {
                                var pts = AscFormat.getPtsFromSeries(ser);
                                union_marker.marker = AscFormat.CreateMarkerGeometryByType(ser.compiledSeriesMarker.symbol, null);
                                if(pts[0] && pts[0].compiledMarker)
                                {
                                    union_marker.marker.brush = pts[0].compiledMarker.brush;
                                    union_marker.marker.pen = pts[0].compiledMarker.pen;

                                }
                            }

                            if(ser.compiledSeriesPen && !b_scatter_no_line)
                            {
                                union_marker.lineMarker = AscFormat.CreateMarkerGeometryByType(AscFormat.SYMBOL_DASH, null);
                                union_marker.lineMarker.pen = ser.compiledSeriesPen.createDuplicate(); //Копируем, так как потом возможно придется изменять толщину линии;
                            }
                            if(!b_scatter_no_line && !AscFormat.CChartsDrawer.prototype._isSwitchCurrent3DChart(this))
                                b_line_series = true;
                            break;
                        }
                    }
                    if(union_marker.marker)
                    {
                        union_marker.marker.pen && union_marker.marker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        union_marker.marker.brush && union_marker.marker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    union_marker.lineMarker && union_marker.lineMarker.pen && union_marker.lineMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                }
            }
            else
            {
                ser = series[0];
                i = 1;
                while(ser && ser.isHiddenForLegend)
                {
                    ser = series[i];
                    ++i;
                }
                var pts = AscFormat.getPtsFromSeries(ser), pt;
                var cat_str_lit = getCatStringPointsFromSeries(ser);
                this.legendLength = pts.length;
                for(i = 0; i < pts.length; ++i)
                {
                    entry = legend.findLegendEntryByIndex(i);
                    if(entry && entry.bDelete)
                        continue;
                    pt = pts[i];
                    var str_pt = cat_str_lit ? cat_str_lit.getPtByIndex(pt.idx) : null;
                    if(str_pt)
                        arr_str_labels.push(str_pt.val);
                    else
                        arr_str_labels.push((pt.idx + 1) + "");

                    calc_entry = new AscFormat.CalcLegendEntry(legend, this, pt.idx);
                    calc_entry.txBody = AscFormat.CreateTextBodyFromString(arr_str_labels[arr_str_labels.length - 1], this.getDrawingDocument(), calc_entry);

                    //if(entry)
                    //    calc_entry.txPr = entry.txPr;
                    //if(calc_entryes[0])
                    //{
                    //    calc_entry.lastStyleObject = calc_entryes[0].lastStyleObject;
                    //}
                    calc_entryes.push(calc_entry);

                    cur_width = calc_entry.txBody.getRectWidth(2000);
                    if(cur_width > max_width)
                        max_width = cur_width;

                    cur_font_size = calc_entry.txBody.content.Content[0].CompiledPr.Pr.TextPr.FontSize;
                    if(cur_font_size > max_font_size)
                        max_font_size = cur_font_size;

                    calc_entry.calcMarkerUnion = new AscFormat.CUnionMarker();
                    union_marker = calc_entry.calcMarkerUnion;
                    if(ser.getObjectType() === AscDFH.historyitem_type_LineSeries && !AscFormat.CChartsDrawer.prototype._isSwitchCurrent3DChart(this) || ser.getObjectType() === AscDFH.historyitem_type_ScatterSer)
                    {
                        if(pt.compiledMarker)
                        {
                            union_marker.marker = AscFormat.CreateMarkerGeometryByType(pt.compiledMarker.symbol, null);
                            union_marker.marker.brush = pt.compiledMarker.pen.Fill;
                            union_marker.marker.pen = pt.compiledMarker.pen;
                        }
                        if(pt.pen)
                        {
                            union_marker.lineMarker = AscFormat.CreateMarkerGeometryByType(AscFormat.SYMBOL_DASH, null);
                            union_marker.lineMarker.pen = pt.pen;
                        }
                        if(!b_scatter_no_line && !AscFormat.CChartsDrawer.prototype._isSwitchCurrent3DChart(this))
                            b_line_series = true;
                    }
                    else
                    {
                        union_marker.marker = AscFormat.CreateMarkerGeometryByType(AscFormat.SYMBOL_SQUARE, null);
                        union_marker.marker.pen = pt.pen;
                        union_marker.marker.brush = pt.brush;
                    }
                    if(union_marker.marker)
                    {
                        union_marker.marker.pen && union_marker.marker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        union_marker.marker.brush && union_marker.marker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    union_marker.lineMarker && union_marker.lineMarker.pen && union_marker.lineMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                }
            }
            var marker_size;
            var distance_to_text;
            var line_marker_width;
            if(b_line_series)
            {
                marker_size = 2.5;
                line_marker_width = 7.7;//Пока так
                for(i = 0; i < calc_entryes.length; ++i)
                {
                    calc_entry = calc_entryes[i];
                    if(calc_entry.calcMarkerUnion.lineMarker)
                    {
                        calc_entry.calcMarkerUnion.lineMarker.spPr.geometry.Recalculate(line_marker_width, 1);
                        /*Excel не дает сделать толщину линии для маркера легенды больше определенной. Считаем, что это толщина равна 133000emu*/
                        if(calc_entry.calcMarkerUnion.lineMarker.pen
                            && AscFormat.isRealNumber(calc_entry.calcMarkerUnion.lineMarker.pen.w) && calc_entry.calcMarkerUnion.lineMarker.pen.w > 133000)
                        {
                            calc_entry.calcMarkerUnion.lineMarker.pen.w = 133000;
                        }
                        calc_entry.calcMarkerUnion.lineMarker.penWidth = calc_entry.calcMarkerUnion.lineMarker.pen && AscFormat.isRealNumber(calc_entry.calcMarkerUnion.lineMarker.pen.w) ? calc_entry.calcMarkerUnion.lineMarker.pen.w/36000 : 0;
                    }
                    if(calc_entryes[i].calcMarkerUnion.marker)
                    {
                        calc_entryes[i].calcMarkerUnion.marker.spPr.geometry.Recalculate(marker_size, marker_size);
                        calc_entryes[i].calcMarkerUnion.marker.extX = marker_size;
                        calc_entryes[i].calcMarkerUnion.marker.extY = marker_size;
                    }
                }
                distance_to_text = marker_size;
            }
            else
            {
                marker_size = 0.2*max_font_size;
                for(i = 0; i < calc_entryes.length; ++i)
                {
                    calc_entryes[i].calcMarkerUnion.marker.spPr.geometry.Recalculate(marker_size, marker_size);
                }
                distance_to_text = marker_size*0.8;
            }
            var left_inset = marker_size + 3*distance_to_text;
            var legend_pos = c_oAscChartLegendShowSettings.right;
            if(AscFormat.isRealNumber(legend.legendPos))
            {
                legend_pos = legend.legendPos;
            }
            var legend_width, legend_height;
            var fFixedWidth = null, fFixedHeight = null;
            var bFixedSize = false;
            if(legend.layout){
                fFixedWidth = this.calculateSizeByLayout(0, this.extX, legend.layout.w, legend.layout.wMode);
                fFixedHeight = this.calculateSizeByLayout(0, this.extY, legend.layout.h, legend.layout.hMode);
                bFixedSize = AscFormat.isRealNumber(fFixedWidth) && fFixedWidth > 0 && AscFormat.isRealNumber(fFixedHeight) && fFixedHeight > 0;
                if(bFixedSize){
                    var oOldLayout = legend.layout;
                    legend.layout = null;
                    this.recalculateLegend();
                    legend.naturalWidth = legend.extX;
                    legend.naturalHeight = legend.extY;
                    legend.layout = oOldLayout;
                }
            }
            if(AscFormat.isRealNumber(legend_pos))
            {
                var max_legend_width, max_legend_height;
                var cut_index;
                if ((legend_pos === c_oAscChartLegendShowSettings.left ||
                    legend_pos === c_oAscChartLegendShowSettings.leftOverlay ||
                    legend_pos === c_oAscChartLegendShowSettings.right ||
                    legend_pos === c_oAscChartLegendShowSettings.rightOverlay || legend_pos === c_oAscChartLegendShowSettings.topRight) && !bFixedSize)
                {
                    max_legend_width = this.extX/3;//Считаем, что ширина легенды не больше трети ширины всей диаграммы;
                    var sizes = this.getChartSizes();
                    max_legend_height = sizes.h;
                    if(b_line_series)
                    {
                        left_inset = line_marker_width + 3*distance_to_text;
                        var content_width = max_legend_width - left_inset;
                        if(content_width <= 0)
                            content_width = 0.01;
                        var cur_content_width, max_content_width = 0;
                        var arr_heights = [];
                        for(i = 0; i < calc_entryes.length; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            cur_content_width = calc_entry.txBody.getMaxContentWidth(content_width, true);
                            if(cur_content_width > max_content_width)
                                max_content_width = cur_content_width;
                            arr_heights.push(calc_entry.txBody.getSummaryHeight());
                        }
                        if(max_content_width < max_legend_width - left_inset)
                        {
                            legend_width = max_content_width + left_inset;
                        }
                        else
                        {
                            legend_width = max_legend_width;
                        }

                        var max_entry_height2 = Math.max.apply(Math, arr_heights);
                        for(i = 0; i < arr_heights.length; ++i)
                            arr_heights[i] = max_entry_height2;

                        var height_summ = 0;
                        for(i = 0;  i < arr_heights.length; ++i)
                        {
                            height_summ+=arr_heights[i];
                            if(height_summ > max_legend_height)
                            {
                                cut_index = i;
                                break;
                            }
                        }
                        if(AscFormat.isRealNumber(cut_index))
                        {
                            if(cut_index > 0)
                            {
                                legend_height = height_summ - arr_heights[cut_index];
                            }
                            else
                            {
                                legend_height = max_legend_height;
                            }
                        }
                        else
                        {
                            cut_index = arr_heights.length;
                            legend_height = height_summ;
                        }
                        legend.x = 0;
                        legend.y = 0;
                        legend.extX = legend_width;
                        legend.extY = legend_height;
                        var summ_h = 0;
                        calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                        for(i = 0; i <  cut_index && i < calc_entryes.length; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            if(calc_entry.calcMarkerUnion.marker)
                            {
                                calc_entry.calcMarkerUnion.marker.localX = distance_to_text + line_marker_width/2 - calc_entry.calcMarkerUnion.marker.extX/2;
                                calc_entry.calcMarkerUnion.marker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2 - marker_size/2;
                            }

                            if(calc_entry.calcMarkerUnion.lineMarker)
                            {
                                calc_entry.calcMarkerUnion.lineMarker.localX = distance_to_text;
                                calc_entry.calcMarkerUnion.lineMarker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2;// - calc_entry.calcMarkerUnion.lineMarker.penWidth/2;
                                calc_entry.localX = calc_entry.calcMarkerUnion.lineMarker.localX + line_marker_width + distance_to_text;
                                calc_entry.localY = summ_h;
                            }


                            summ_h+=arr_heights[i];
                        }
                        legend.setPosition(0, 0);
                    }
                    else
                    {
                        var content_width = max_legend_width - left_inset;
                        if(content_width <= 0)
                            content_width = 0.01;
                        var cur_content_width, max_content_width = 0;
                        var arr_heights = [];
                        for(i = 0; i < calc_entryes.length; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            cur_content_width = calc_entry.txBody.getMaxContentWidth(content_width, true);
                            if(cur_content_width > max_content_width)
                                max_content_width = cur_content_width;
                            arr_heights.push(calc_entry.txBody.getSummaryHeight());
                        }


                        var chart_object;
                        if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0])
                        {
                            chart_object = this.chart.plotArea.charts[0];
                        }
                        var b_reverse_order = false;
                        if(chart_object && chart_object.getObjectType() === AscDFH.historyitem_type_BarChart && chart_object.barDir === AscFormat.BAR_DIR_BAR &&
                            (cat_ax && cat_ax.scaling && AscFormat.isRealNumber(cat_ax.scaling.orientation) ?  cat_ax.scaling.orientation : AscFormat.ORIENTATION_MIN_MAX) === AscFormat.ORIENTATION_MIN_MAX
                            || chart_object && chart_object.getObjectType() === AscDFH.historyitem_type_SurfaceChart)
                        {
                            b_reverse_order = true;
                        }

                        var max_entry_height2 = Math.max.apply(Math, arr_heights);
                        for(i = 0; i < arr_heights.length; ++i)
                            arr_heights[i] = max_entry_height2;
                        if(max_content_width < max_legend_width - left_inset)
                        {
                            legend_width = max_content_width + left_inset;
                        }
                        else
                        {
                            legend_width = max_legend_width;
                        }
                        var height_summ = 0;
                        for(i = 0;  i < arr_heights.length; ++i)
                        {
                            height_summ+=arr_heights[i];
                            if(height_summ > max_legend_height)
                            {
                                cut_index = i;
                                break;
                            }
                        }


                        if(AscFormat.isRealNumber(cut_index))
                        {
                            if(cut_index > 0)
                            {
                                legend_height = height_summ - arr_heights[cut_index];
                            }
                            else
                            {
                                legend_height = max_legend_height;
                            }
                        }
                        else
                        {
                            cut_index = arr_heights.length;
                            legend_height = height_summ;
                        }
                        legend.x = 0;
                        legend.y = 0;
                        legend.extX = legend_width;
                        legend.extY = legend_height;
                        var summ_h = 0;


                        var b_reverse_order = false;
                        var chart_object, cat_ax, start_index, end_index;
                        if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0])
                        {
                            chart_object = this.chart.plotArea.charts[0];
                            if(chart_object && chart_object.getAxisByTypes)
                            {
                                var axis_by_types = chart_object.getAxisByTypes();
                                cat_ax = axis_by_types.catAx[0];
                            }
                        }
                        if(chart_object && chart_object.getObjectType() === AscDFH.historyitem_type_BarChart && chart_object.barDir === AscFormat.BAR_DIR_BAR &&
                            (cat_ax && cat_ax.scaling && AscFormat.isRealNumber(cat_ax.scaling.orientation) ?  cat_ax.scaling.orientation : AscFormat.ORIENTATION_MIN_MAX) === AscFormat.ORIENTATION_MIN_MAX)
                        {
                            b_reverse_order = true;
                        }


                        if(!b_reverse_order)
                        {
                            calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                            for(i = 0; i <  cut_index && i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                if(calc_entry.calcMarkerUnion.marker)
                                {
                                    calc_entry.calcMarkerUnion.marker.localX = distance_to_text;
                                    calc_entry.calcMarkerUnion.marker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2 - marker_size/2;
                                }
                                calc_entry.localX = 2*distance_to_text + marker_size;
                                calc_entry.localY = summ_h;
                                summ_h+=arr_heights[i];
                            }
                        }
                        else
                        {
                            calc_entryes.splice(0, calc_entryes.length - cut_index);
                            for(i = calc_entryes.length-1; i > -1; --i)
                            {
                                calc_entry = calc_entryes[i];
                                if(calc_entry.calcMarkerUnion.marker)
                                {
                                    calc_entry.calcMarkerUnion.marker.localX = distance_to_text;
                                    calc_entry.calcMarkerUnion.marker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2 - marker_size/2;
                                }
                                calc_entry.localX = 2*distance_to_text + marker_size;
                                calc_entry.localY = summ_h;
                                summ_h+=arr_heights[i];
                            }
                        }

                        legend.setPosition(0, 0);
                    }
                }
                else
                {
                    /*пока сделаем так: максимальная ширимна 0.9 от ширины дмаграммы
                     без заголовка  максимальная высота легенды 0.6 от высоты диаграммы,
                     с заголовком 0.6 от высоты за вычетом высоты заголовка*/
                    if(bFixedSize){
                        max_legend_width = fFixedWidth;
                        max_legend_height = fFixedHeight;
                    }
                    else{
                        max_legend_width = 0.9*this.extX;
                        max_legend_height = (this.extY - (this.chart.title ? this.chart.title.extY : 0))*0.6;
                    }
                    if(b_line_series)
                    {
                        //сначала найдем максимальную ширину записи. ширина записи получается как отступ слева от маркера + ширина маркера + отступ справа от маркера + ширина текста
                        var max_entry_width = 0, cur_entry_width, cur_entry_height;
                        //найдем максимальную ширину надписи
                        var left_width = line_marker_width + 3*distance_to_text;
                        var arr_width = [], arr_height = []; //массив ширин записей
                        var summ_width = 0;//сумма ширин всех подписей
                        for(i = 0; i < calc_entryes.length; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            cur_entry_width = calc_entry.txBody.getMaxContentWidth(20000/*ставим большое число чтобы текст расчитался в одну строчку*/, true);
                            if(cur_entry_width > max_entry_width)
                                max_entry_width = cur_entry_width;
                            arr_height.push(calc_entry.txBody.getSummaryHeight());
                            arr_width.push(cur_entry_width+left_width);
                            summ_width+=arr_width[arr_width.length-1];
                        }

                        var max_entry_height = Math.max.apply(Math, arr_height);
                        var cur_left_x = 0;

                        if(summ_width < max_legend_width)//значит все надписи убираются в одну строчку
                        {
                            if(bFixedSize){
                                cur_left_x = max_legend_width - summ_width;
                            }
                            /*прибавим справа ещё боковой зазаор и посмотрим уберется ли новая ширина в максимальную ширину*/
                            if(summ_width + distance_to_text < max_legend_width && !bFixedSize)
                                legend_width = summ_width + distance_to_text;
                            else
                                legend_width = max_legend_width;
                            legend_height = max_entry_height;
                            if(bFixedSize){
                                legend_height = max_legend_height;
                            }
                            for(i = 0; i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                if(calc_entry.calcMarkerUnion.marker)
                                    calc_entry.calcMarkerUnion.marker.localX = cur_left_x + distance_to_text + line_marker_width/2 - marker_size/2;
                                calc_entry.calcMarkerUnion.lineMarker.localX = cur_left_x + distance_to_text;
                                calc_entry.calcMarkerUnion.lineMarker.localY = Math.max(0, legend_height/2);
                                cur_left_x += arr_width[i];
                                if(calc_entry.calcMarkerUnion.marker)
                                    calc_entry.calcMarkerUnion.marker.localY = Math.max(0, legend_height/2 - marker_size/2);
                                calc_entry.localX = calc_entry.calcMarkerUnion.lineMarker.localX+line_marker_width+distance_to_text;
                                calc_entry.localY = 0;
                            }
                            legend.extX = legend_width;
                            legend.extY = legend_height;
                            legend.setPosition(0, 0);
                        }
                        else if(max_legend_width >= max_entry_width + left_width)
                        {
                            var hor_count = (max_legend_width/(max_entry_width + left_width)) >> 0;//количество записей в одной строке
                            var vert_count;//количество строк
                            var t = calc_entryes.length / hor_count;
                            if(t - (t >> 0) > 0)
                                vert_count = t+1;
                            else
                                vert_count = t;
                            //посмотрим убираются ли все эти строки в максимальную высоту. те которые не убираются обрежем, кроме первой.
                            legend_width = hor_count*(max_legend_width + left_width);
                            if(legend_width + distance_to_text <= max_legend_width && !bFixedSize)
                                legend_width += distance_to_text;
                            else
                                legend_width = max_legend_width;

                            if(bFixedSize){
                                max_legend_height = fFixedHeight;
                            }
                            var max_line_count = (max_legend_height/max_entry_height)>>0; //максимальное количество строчек в легенде;
                            if(vert_count <= max_line_count)
                            {
                                cut_index = calc_entryes.length;
                                legend_height = vert_count*max_entry_height;
                            }
                            else
                            {
                                if(max_line_count === 0)
                                {
                                    cut_index = hor_count + 1;
                                    legend_height = max_entry_height;
                                }
                                else
                                {
                                    cut_index = max_line_count*hor_count+1;
                                    legend_height = max_entry_height*max_line_count;
                                }
                            }

                            var fStartH = 0;
                            if(bFixedSize){
                                fStartH = Math.max(0, (fFixedHeight - legend_height)/2);
                                legend_height = fFixedHeight;
                            }
                            legend.extX = legend_width;
                            legend.extY = legend_height;
                            calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                            for(i = 0; i < cut_index && i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                calc_entry.calcMarkerUnion.lineMarker.localX = (i - hor_count*((i/hor_count) >> 0))*(max_entry_width + line_marker_width + 2*distance_to_text)  + distance_to_text;
                                calc_entry.calcMarkerUnion.lineMarker.localY = fStartH + ((i/hor_count) >> 0)*(max_entry_height) + max_entry_height/2;

                                if(calc_entry.calcMarkerUnion.marker)
                                {
                                    calc_entry.calcMarkerUnion.marker.localX = calc_entry.calcMarkerUnion.lineMarker.localX + line_marker_width/2 - marker_size/2;
                                    calc_entry.calcMarkerUnion.marker.localY = calc_entry.calcMarkerUnion.lineMarker.localY - marker_size/2;
                                }

                                calc_entry.localX = calc_entry.calcMarkerUnion.lineMarker.localX + line_marker_width + distance_to_text;
                                calc_entry.localY = fStartH + ((i/hor_count) >> 0)*(max_entry_height);
                            }
                            legend.setPosition(0, 0);
                        }
                        else
                        {
                            //значит максималная по ширине надпись не убирается в рект для легенды
                            var content_width = max_legend_width - 2*distance_to_text - marker_size;
                            if(content_width <= 0)
                                content_width = 0.01;
                            var cur_content_width, max_content_width = 0;
                            var arr_heights = [];
                            for(i = 0; i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                cur_content_width = calc_entry.txBody.getMaxContentWidth(content_width, true);
                                if(cur_content_width > max_content_width)
                                    max_content_width = cur_content_width;
                                arr_heights.push(calc_entry.txBody.getSummaryHeight());
                            }
                            if(max_content_width < max_legend_width - left_inset && !bFixedSize)
                            {
                                legend_width = max_content_width + left_inset;
                            }
                            else
                            {
                                legend_width = max_legend_width;
                            }
                            var height_summ = 0;
                            for(i = 0;  i < arr_heights.length; ++i)
                            {
                                height_summ+=arr_heights[i];
                                if(height_summ > max_legend_height)
                                {
                                    cut_index = i;
                                    break;
                                }
                            }
                            if(AscFormat.isRealNumber(cut_index))
                            {
                                if(cut_index > 0)
                                {
                                    legend_height = height_summ - arr_heights[cut_index];
                                }
                                else
                                {
                                    legend_height = max_legend_height;
                                }
                            }
                            else
                            {
                                cut_index = arr_heights.length;
                                legend_height = height_summ;
                            }
                            if(bFixedSize){
                                legend_height = max_legend_height;
                            }
                            legend.x = 0;
                            legend.y = 0;
                            legend.extX = legend_width;
                            legend.extY = legend_height;
                            var summ_h = 0;
                            if(bFixedSize){
                                summ_h = (legend_height - height_summ)/2;
                            }

                            calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                            for(i = 0; i <  cut_index && i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];

                                calc_entry.calcMarkerUnion.lineMarker.localX = distance_to_text;
                                calc_entry.calcMarkerUnion.lineMarker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2;// - calc_entry.calcMarkerUnion.lineMarker.penWidth/2;
                                calc_entry.localX = calc_entry.calcMarkerUnion.lineMarker.localX + line_marker_width + distance_to_text;
                                calc_entry.localY = summ_h;
                                if(calc_entry.calcMarkerUnion.marker)
                                {
                                    calc_entry.calcMarkerUnion.marker.localX = calc_entry.calcMarkerUnion.lineMarker.localX + line_marker_width/2 - marker_size/2;
                                    calc_entry.calcMarkerUnion.marker.localY = calc_entry.calcMarkerUnion.lineMarker.localY - marker_size/2;
                                }
                                //calc_entry.localX = 2*distance_to_text + marker_size;
                                //calc_entry.localY = summ_h;
                                summ_h+=arr_heights[i];
                            }
                            legend.setPosition(0, 0);
                        }
                    }
                    else
                    {
                        //сначала найдем максимальную ширину записи. ширина записи получается как отступ слева от маркера + ширина маркера + отступ справа от маркера + ширина текста
                        var max_entry_width = 0, cur_entry_width, cur_entry_height;
                        //найдем максимальную ширину надписи
                        var left_width = marker_size + 2*distance_to_text;
                        var arr_width = [], arr_height = []; //массив ширин записей
                        var summ_width = 0;//сумма ширин всех подписей
                        for(i = 0; i < calc_entryes.length; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            cur_entry_width = calc_entry.txBody.getMaxContentWidth(20000/*ставим большое число чтобы текст расчитался в одну строчку*/, true);
                            if(cur_entry_width > max_entry_width)
                                max_entry_width = cur_entry_width;
                            arr_height.push(calc_entry.txBody.getSummaryHeight());
                            arr_width.push(cur_entry_width+left_width);
                            summ_width += arr_width[arr_width.length-1];
                        }

                        var max_entry_height = Math.max.apply(Math, arr_height);
                        var cur_left_x = 0;
                        if(summ_width < max_legend_width)//значит все надписи убираются в одну строчку
                        {
                            /*прибавим справа ещё боковой зазаор и посмотрим уберется ли новая ширина в максимальную ширину*/
                            if(summ_width + distance_to_text < max_legend_width && !bFixedSize)
                                legend_width = summ_width + distance_to_text;
                            else
                                legend_width = max_legend_width;
                            legend_height = max_entry_height;

                            if(bFixedSize){
                                cur_left_x = (max_legend_width - summ_width)/2;
                                legend_height = max_legend_height;
                            }
                            for(i = 0; i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                calc_entry.calcMarkerUnion.marker.localX = cur_left_x + distance_to_text;
                                cur_left_x += arr_width[i];
                                calc_entry.calcMarkerUnion.marker.localY = legend_height/2 - marker_size/2;
                                calc_entry.localX = calc_entry.calcMarkerUnion.marker.localX+marker_size+distance_to_text;
                                calc_entry.localY = calc_entry.calcMarkerUnion.marker.localY - marker_size/2;
                            }
                            legend.extX = legend_width;
                            legend.extY = legend_height;
                            legend.setPosition(0, 0);
                        }
                        else if(max_legend_width >= max_entry_width + left_width)
                        {
                            var hor_count = (max_legend_width/(max_entry_width + left_width)) >> 0;//количество записей в одной строке
                            var vert_count;//количество строк
                            var t = calc_entryes.length / hor_count;
                            if(t - (t >> 0) > 0)
                                vert_count = (t+1) >> 0;
                            else
                                vert_count = t >> 0;
                            //посмотрим убираются ли все эти строки в максимальную высоту. те которые не убираются обрежем, кроме первой.
                            var fStartHorPos = 0;
                            legend_width = hor_count*(max_entry_width + left_width);
                            if(legend_width + distance_to_text <= max_legend_width && !bFixedSize)
                                legend_width += distance_to_text;
                            else{
                                if(bFixedSize){
                                    fStartHorPos = (max_legend_width - legend_width)/2;
                                }
                                legend_width = max_legend_width;
                            }


                            var max_line_count = (max_legend_height/max_entry_height)>>0; //максимальное количество строчек в легенде;
                            if(vert_count <= max_line_count)
                            {
                                cut_index = calc_entryes.length;
                                legend_height = vert_count*max_entry_height;
                            }
                            else
                            {
                                if(max_line_count === 0)
                                {
                                    cut_index = hor_count + 1;
                                    legend_height = max_entry_height;
                                }
                                else
                                {
                                    cut_index = max_line_count*hor_count+1;
                                    legend_height = max_entry_height*max_line_count;
                                }
                            }

                            var fStartH = 0;
                            var fDistance = 0;
                            if(bFixedSize){
                                fDistance = Math.max(0,(max_legend_height - max_entry_height*vert_count)/vert_count);
                                fStartH = Math.max(0, fDistance/2);
                                legend_height = max_legend_height;
                            }
                            legend.extX = legend_width;
                            legend.extY = legend_height;

                            calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                            for(i = 0; i <cut_index && i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                calc_entry.calcMarkerUnion.marker.localX = fStartHorPos + (i - hor_count*((i/hor_count) >> 0))*(max_entry_width + marker_size + 2*distance_to_text)  + distance_to_text;
                                var nHorCount = (i/hor_count) >> 0;
                                calc_entry.calcMarkerUnion.marker.localY = fStartH + (nHorCount)*(max_entry_height) + max_entry_height/2 - marker_size/2 + nHorCount*fDistance;
                                calc_entry.localX = calc_entry.calcMarkerUnion.marker.localX + marker_size + distance_to_text;
                                calc_entry.localY = fStartH + nHorCount*(max_entry_height) + nHorCount*fDistance;
                            }
                            legend.setPosition(0, 0);
                        }
                        else
                        {
                            //значит максималная по ширине надпись не убирается в рект для легенды
                            var content_width = max_legend_width - 2*distance_to_text - marker_size;
                            if(content_width <= 0)
                                content_width = 0.01;
                            var cur_content_width, max_content_width = 0;
                            var arr_heights = [];
                            for(i = 0; i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                cur_content_width = calc_entry.txBody.getMaxContentWidth(content_width, true);
                                if(cur_content_width > max_content_width)
                                    max_content_width = cur_content_width;
                                arr_heights.push(calc_entry.txBody.getSummaryHeight());
                            }
                            max_entry_height = Math.max.apply(Math, arr_heights);
                            if(max_content_width < max_legend_width - left_inset && !bFixedSize)
                            {
                                legend_width = max_content_width + left_inset;
                            }
                            else
                            {
                                legend_width = max_legend_width;
                            }
                            var height_summ = 0;
                            for(i = 0;  i < arr_heights.length; ++i)
                            {
                                height_summ+=arr_heights[i];
                                if(height_summ > max_legend_height)
                                {
                                    cut_index = i;
                                    break;
                                }
                            }
                            if(AscFormat.isRealNumber(cut_index))
                            {
                                if(cut_index > 0)
                                {
                                    legend_height = height_summ - arr_heights[cut_index];
                                }
                                else
                                {
                                    legend_height = max_legend_height;
                                }
                            }
                            else
                            {
                                cut_index = arr_heights.length;
                                legend_height = height_summ;
                            }
                            var fStartH = 0;
                            var fDistance = 0;
                            if(bFixedSize){
                                fDistance = Math.max(0,(max_legend_height - max_entry_height*cut_index)/cut_index);
                                fStartH = Math.max(0, fDistance/2);
                                legend_height = max_legend_height;
                            }
                            legend.x = 0;
                            legend.y = 0;
                            legend.extX = legend_width;
                            legend.extY = legend_height;

                            calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                            for(i = 0; i <  cut_index && i < calc_entryes.length; ++i)
                            {
                                calc_entry = calc_entryes[i];
                                calc_entry.localX = 2*distance_to_text + marker_size;
                                calc_entry.localY = fStartH + i*max_entry_height + i*fDistance;
                                calc_entry.calcMarkerUnion.marker.localX = distance_to_text;
                                calc_entry.calcMarkerUnion.marker.localY = calc_entry.localY + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2 - marker_size/2;
                            }
                            legend.setPosition(0, 0);
                        }
                    }
                }
            }
            else
            {
                //TODO
            }
            legend.recalcInfo = {recalculateLine: true, recalculateFill: true, recalculateTransparent: true};
            legend.recalculatePen();
            legend.recalculateBrush();
            for(var i = 0; i < calc_entryes.length; ++i)
            {
                calc_entryes[i].checkWidhtContent();
            }
        }
    };

CChartSpace.prototype.internalCalculatePenBrushFloorWall = function(oSide, nSideType)
{
    if(!oSide)
    {
        return;
    }

    var parent_objects = this.getParentObjects();
    if(oSide.spPr && oSide.spPr.ln)
    {
        oSide.pen = oSide.spPr.ln.createDuplicate();
    }
    else
    {
        var oCompiledPen = null;
        if(this.style >= 1 && this.style <= 40 && 2 === nSideType)
        {
            if(parent_objects.theme  && parent_objects.theme.themeElements
                && parent_objects.theme.themeElements.fmtScheme
                && parent_objects.theme.themeElements.fmtScheme.lnStyleLst
                && parent_objects.theme.themeElements.fmtScheme.lnStyleLst[0])
            {
                oCompiledPen = parent_objects.theme.themeElements.fmtScheme.lnStyleLst[0].createDuplicate();
                if(this.style >= 1 && this.style <= 32)
                {
                    oCompiledPen.Fill = CreateUnifillSolidFillSchemeColor(15, 0.75);
                }
                else
                {
                    oCompiledPen.Fill = CreateUnifillSolidFillSchemeColor(8, 0.75);
                }
            }
        }
        oSide.pen = oCompiledPen;
    }
    if(this.style >= 1 && this.style <= 32)
    {
        if(oSide.spPr && oSide.spPr.Fill)
        {
            oSide.brush = oSide.spPr.Fill.createDuplicate();
            if(nSideType === 0 || nSideType === 2)
            {
                var cColorMod = new AscFormat.CColorMod;
                if(nSideType === 2)
                    cColorMod.val = 45000;
                else
                    cColorMod.val = 35000;
                cColorMod.name = "shade";
                oSide.brush.addColorMod(cColorMod);
            }
        }
        else
        {
            oSide.brush = null;
        }
    }
    else
    {
        var oSubtleFill;
        if(parent_objects.theme  && parent_objects.theme.themeElements
            && parent_objects.theme.themeElements.fmtScheme
            && parent_objects.theme.themeElements.fmtScheme.fillStyleLst)
        {
            oSubtleFill = parent_objects.theme.themeElements.fmtScheme.fillStyleLst[0];
        }

        var oDefaultBrush;
        var tint = 0.20000;
        if(this.style >=33 && this.style <= 34)
            oDefaultBrush = CreateUnifillSolidFillSchemeColor(8, 0.20000);
        else if(this.style >=35 && this.style <=40)
            oDefaultBrush = CreateUnifillSolidFillSchemeColor(this.style - 35, tint);
        else
            oDefaultBrush = CreateUnifillSolidFillSchemeColor(8, 0.95000);

        if(oSide.spPr)
        {
            oDefaultBrush.merge(oSide.spPr.Fill);
        }

        if(nSideType === 0 || nSideType === 2)
        {
            var cColorMod = new AscFormat.CColorMod;
            if(nSideType === 0)
                cColorMod.val = 45000;
            else
                cColorMod.val = 35000;
            cColorMod.name = "shade";
            oDefaultBrush.addColorMod(cColorMod);
        }
        oSide.brush = oDefaultBrush;
    }

    if(oSide.brush)
    {
        oSide.brush.calculate(parent_objects.theme, parent_objects.slide, parent_objects.layout, parent_objects.master, {R: 0, G: 0, B: 0, A: 255});
    }
    if(oSide.pen)
    {
        oSide.pen.calculate(parent_objects.theme, parent_objects.slide, parent_objects.layout, parent_objects.master, {R: 0, G: 0, B: 0, A: 255});
    }
};

CChartSpace.prototype.recalculateWalls = function()
{
    if(this.chart)
    {
        this.internalCalculatePenBrushFloorWall(this.chart.sideWall, 0);
        this.internalCalculatePenBrushFloorWall(this.chart.backWall, 1);
        this.internalCalculatePenBrushFloorWall(this.chart.floor, 2);
    }
};

CChartSpace.prototype.recalculateUpDownBars = function()
{
    if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0] && this.chart.plotArea.charts[0].upDownBars)
    {
        var bars = this.chart.plotArea.charts[0].upDownBars;
        var up_bars = bars.upBars;
        var down_bars = bars.downBars;
        var parents = this.getParentObjects();
        bars.upBarsBrush = null;
        bars.upBarsPen = null;
        bars.downBarsBrush = null;
        bars.downBarsPen = null;
        if(up_bars || down_bars)
        {
            var default_bar_line = new AscFormat.CLn();
            if(parents.theme  && parents.theme.themeElements
                && parents.theme.themeElements.fmtScheme
                && parents.theme.themeElements.fmtScheme.lnStyleLst)
            {
                default_bar_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[0]);
            }
            if(this.style >= 1 && this.style <= 16)
                default_bar_line.setFill(CreateUnifillSolidFillSchemeColor(15, 0));
            else if(this.style >= 17 && this.style <= 32 ||
                this.style >= 41 && this.style <= 48)
                default_bar_line = CreateNoFillLine();
            else if(this.style === 33 || this.style === 34)
                default_bar_line.setFill(CreateUnifillSolidFillSchemeColor(8, 0));
            else if(this.style >= 35 && this.style <= 40)
                default_bar_line.setFill(CreateUnifillSolidFillSchemeColor(this.style - 35, -0.25000));
        }
        if(up_bars)
        {
            var default_up_bars_fill;
            if(this.style === 1 || this.style === 9 || this.style === 17 || this.style === 25 || this.style === 41)
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(8, 0.25000);
            }
            else if(this.style === 2 || this.style === 10 || this.style === 18 || this.style === 26)
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(8, 0.05000);
            }
            else if(this.style >= 3 && this.style <= 8)
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 3, 0.25000);
            }
            else if(this.style >= 11 && this.style <= 16)
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 11, 0.25000);
            }
            else if(this.style >=19 && this.style <= 24)
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 19, 0.25000);
            }
            else if(this.style >= 27 && this.style <= 32 )
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 27, 0.25000);
            }
            else if(this.style >= 33 && this.style <= 40 || this.style === 42)
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(12, 0);
            }
            else
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 43, 0.25000);
            }
            if(up_bars.Fill)
            {
                default_up_bars_fill.merge(up_bars.Fill);
            }
            default_up_bars_fill.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
            this.chart.plotArea.charts[0].upDownBars.upBarsBrush = default_up_bars_fill;
            var up_bars_line = default_bar_line.createDuplicate();
            if(up_bars.ln)
                up_bars_line.merge(up_bars.ln);
            up_bars_line.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
            this.chart.plotArea.charts[0].upDownBars.upBarsPen = up_bars_line;

        }
        if(down_bars)
        {
            var default_down_bars_fill;
            if(this.style === 1 || this.style === 9 || this.style === 17 || this.style === 25 || this.style === 41 || this.style === 33)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(8, 0.85000);
            }
            else if(this.style === 2 || this.style === 10 || this.style === 18 || this.style === 26 || this.style === 34)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(8, 0.95000);
            }
            else if(this.style >= 3 && this.style <= 8)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 3, -0.25000);
            }
            else if(this.style >= 11 && this.style <= 16)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 11, -0.25000);
            }
            else if(this.style >=19 && this.style <= 24)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 19, -0.25000);
            }
            else if(this.style >= 27 && this.style <= 32 )
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 27, -0.25000);
            }
            else if(this.style >= 35 && this.style <= 40)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 35, -0.25000);
            }
            else if(this.style === 42)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(8, 0);
            }
            else
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 43, -0.25000);
            }
            if(down_bars.Fill)
            {
                default_down_bars_fill.merge(down_bars.Fill);
            }
            default_down_bars_fill.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
            this.chart.plotArea.charts[0].upDownBars.downBarsBrush = default_down_bars_fill;
            var down_bars_line = default_bar_line.createDuplicate();
            if(down_bars.ln)
                down_bars_line.merge(down_bars.ln);
            down_bars_line.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
            this.chart.plotArea.charts[0].upDownBars.downBarsPen = down_bars_line;
        }
    }
};

CChartSpace.prototype.recalculatePlotAreaChartPen = function()
{
    if(this.chart && this.chart.plotArea)
    {
        if(this.chart.plotArea.spPr && this.chart.plotArea.spPr.ln)
        {
            this.chart.plotArea.pen = this.chart.plotArea.spPr.ln;
            var parents = this.getParentObjects();
            this.chart.plotArea.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
        }
        else
        {
            this.chart.plotArea.pen = null;
        }
    }
};

CChartSpace.prototype.recalculatePenBrush = function()
{
    var parents = this.getParentObjects(), RGBA = {R: 0, G: 0, B: 0, A: 255};
    if(this.brush)
    {
        this.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
    }
    if(this.pen)
    {
        this.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
        checkBlackUnifill(this.pen.Fill, true);
    }
    if(this.chart)
    {
        if(this.chart.title)
        {
            if(this.chart.title.brush)
            {
                this.chart.title.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
            }
            if(this.chart.title.pen)
            {
                this.chart.title.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
            }
        }
        if(this.chart.plotArea)
        {
            if(this.chart.plotArea.brush)
            {
                this.chart.plotArea.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
            }
            if(this.chart.plotArea.pen)
            {
                this.chart.plotArea.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
            }
            if(this.chart.plotArea.valAx)
            {
                if(this.chart.plotArea.valAx.compiledTickMarkLn)
                {
                    this.chart.plotArea.valAx.compiledTickMarkLn.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    checkBlackUnifill(this.chart.plotArea.valAx.compiledTickMarkLn.Fill, true);
                }
                if(this.chart.plotArea.valAx.compiledMajorGridLines)
                {
                    this.chart.plotArea.valAx.compiledMajorGridLines.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    checkBlackUnifill(this.chart.plotArea.valAx.compiledMajorGridLines.Fill, true);
                }
                if(this.chart.plotArea.valAx.compiledMinorGridLines)
                {
                    this.chart.plotArea.valAx.compiledMinorGridLines.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    checkBlackUnifill(this.chart.plotArea.valAx.compiledMinorGridLines.Fill, true);
                }
                if(this.chart.plotArea.valAx.title)
                {

                    if(this.chart.plotArea.valAx.title.brush)
                    {
                        this.chart.plotArea.valAx.title.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    if(this.chart.plotArea.valAx.title.pen)
                    {
                        this.chart.plotArea.valAx.title.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                }

            }
            if(this.chart.plotArea.catAx)
            {
                if(this.chart.plotArea.catAx.compiledTickMarkLn)
                {
                    this.chart.plotArea.catAx.compiledTickMarkLn.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    checkBlackUnifill(this.chart.plotArea.catAx.compiledTickMarkLn.Fill, true);
                }
                if(this.chart.plotArea.catAx.compiledMajorGridLines)
                {
                    this.chart.plotArea.catAx.compiledMajorGridLines.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    checkBlackUnifill(this.chart.plotArea.catAx.compiledMajorGridLines.Fill, true);
                }
                if(this.chart.plotArea.catAx.compiledMinorGridLines)
                {
                    this.chart.plotArea.catAx.compiledMinorGridLines.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    checkBlackUnifill(this.chart.plotArea.catAx.compiledMinorGridLines.Fill, true);
                }
                if(this.chart.plotArea.catAx.title)
                {
                    if(this.chart.plotArea.catAx.title.brush)
                    {
                        this.chart.plotArea.catAx.title.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    if(this.chart.plotArea.catAx.title.pen)
                    {
                        this.chart.plotArea.catAx.title.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                }
            }

            if(this.chart.plotArea.charts[0])
            {
                var series = this.chart.plotArea.charts[0].series;
                for(var i = 0; i < series.length; ++i)
                {
                    var pts = AscFormat.getPtsFromSeries(series[i]);
                    for(var j = 0; j < pts.length; ++j)
                    {
                        var pt = pts[j];
                        if(pt.brush)
                        {
                            pt.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);

                        }
                        if(pt.pen)
                        {
                            pt.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }
                        if(pt.compiledMarker)
                        {
                            if(pt.compiledMarker.brush)
                            {
                                pt.compiledMarker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            }
                            if(pt.compiledMarker.pen)
                            {
                                pt.compiledMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            }
                        }
                        if(pt.compiledDlb)
                        {
                            if(pt.compiledDlb.brush)
                            {
                                pt.compiledDlb.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            }
                            if(pt.compiledDlb.pen)
                            {
                                pt.compiledDlb.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            }

                        }
                    }
                }
                if(this.chart.plotArea.charts[0].calculatedHiLowLines)
                {
                    this.chart.plotArea.charts[0].calculatedHiLowLines.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                }
                if( this.chart.plotArea.charts[0].upDownBars)
                {
                    if(this.chart.plotArea.charts[0].upDownBars.upBarsBrush)
                    {
                        this.chart.plotArea.charts[0].upDownBars.upBarsBrush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    if(this.chart.plotArea.charts[0].upDownBars.upBarsPen)
                    {
                        this.chart.plotArea.charts[0].upDownBars.upBarsPen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    if(this.chart.plotArea.charts[0].upDownBars.downBarsBrush)
                    {
                        this.chart.plotArea.charts[0].upDownBars.downBarsBrush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                    if(this.chart.plotArea.charts[0].upDownBars.downBarsPen)
                    {
                        this.chart.plotArea.charts[0].upDownBars.downBarsPen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                }
            }
        }
        if(this.chart.legend)
        {
            if(this.chart.legend.brush)
            {
                this.chart.legend.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
            }
            if(this.chart.legend.pen)
            {
                this.chart.legend.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
            }

            var legend = this.chart.legend;
            for(var i = 0; i < legend.calcEntryes.length; ++i)
            {
                var union_marker = legend.calcEntryes[i].calcMarkerUnion;
                if(union_marker)
                {
                    if(union_marker.marker)
                    {
                        if(union_marker.marker.pen)
                        {
                            union_marker.marker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }
                        if(union_marker.marker.brush)
                        {
                            union_marker.marker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }
                    }
                    if(union_marker.lineMarker)
                    {
                        if(union_marker.lineMarker.pen)
                        {
                            union_marker.lineMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }
                        if(union_marker.lineMarker.brush)
                        {
                            union_marker.lineMarker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }
                    }
                }
            }
        }
        if(this.chart.floor)
        {
            if(this.chart.floor.brush)
            {
                this.chart.floor.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
            }
            if(this.chart.floor.pen)
            {
                this.chart.floor.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
            }
        }
        if(this.chart.sideWall)
        {
            if(this.chart.sideWall.brush)
            {
                this.chart.sideWall.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
            }
            if(this.chart.sideWall.pen)
            {
                this.chart.sideWall.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
            }
        }
        if(this.chart.backWall)
        {
            if(this.chart.backWall.brush)
            {
                this.chart.backWall.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
            }
            if(this.chart.backWall.pen)
            {
                this.chart.backWall.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
            }
        }
    }
};

CChartSpace.prototype.getChartSizes = function()
{
    if(this.plotAreaRect && !this.recalcInfo.recalculateAxisVal){
        return {startX: this.plotAreaRect.x, startY: this.plotAreaRect.y, w : this.plotAreaRect.w, h: this.plotAreaRect.h};
    }
    if(!this.chartObj)
        this.chartObj = new AscFormat.CChartsDrawer();
    var oChartSize = this.chartObj.calculateSizePlotArea(this);
    var oLayout = this.chart.plotArea.layout;
    if(oLayout){

        oChartSize.startX = this.calculatePosByLayout(oChartSize.startX, oLayout.xMode, oLayout.x, oChartSize.w, this.extX);
        oChartSize.startY = this.calculatePosByLayout(oChartSize.startY, oLayout.yMode, oLayout.y, oChartSize.h, this.extY);
        var fSize = this.calculateSizeByLayout(oChartSize.startX, this.extX, oLayout.w, oLayout.wMode );
        if(AscFormat.isRealNumber(fSize) && fSize > 0){
            var fSize2 = this.calculateSizeByLayout(oChartSize.startY, this.extY, oLayout.h, oLayout.hMode );
            if(AscFormat.isRealNumber(fSize2) && fSize2 > 0){
                oChartSize.w = fSize;
                oChartSize.h = fSize2;
            }
        }
    }
    return oChartSize;
};

CChartSpace.prototype.getAllSeries =  function()
{
    //TODO:Переделать когда будем поддерживать насколько вложенных чартов
    return this.chart.plotArea.charts[0].series;
};

CChartSpace.prototype.recalculatePlotAreaChartBrush = function()
{
    if(this.chart && this.chart.plotArea)
    {
        var plot_area = this.chart.plotArea;
        var default_brush;
        if(AscFormat.CChartsDrawer.prototype._isSwitchCurrent3DChart(this))
        {
            default_brush = CreateNoFillUniFill();
        }
        else
        {
            if(this.chart.plotArea && this.chart.plotArea.charts[0] &&
                (this.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_PieChart
                || this.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_DoughnutChart))
            {
                default_brush = CreateNoFillUniFill();
            }
            else {
                var tint = 0.20000;
                if(this.style >=1 && this.style <=32)
                    default_brush = CreateUnifillSolidFillSchemeColor(6, tint);
                else if(this.style >=33 && this.style <= 34)
                    default_brush = CreateUnifillSolidFillSchemeColor(8, 0.20000);
                else if(this.style >=35 && this.style <=40)
                    default_brush = CreateUnifillSolidFillSchemeColor(this.style - 35, tint);
                else
                    default_brush = CreateUnifillSolidFillSchemeColor(8, 0.95000);
            }
        }
        if(plot_area.spPr && plot_area.spPr.Fill)
        {
            default_brush.merge(plot_area.spPr.Fill);
        }
        var parents = this.getParentObjects();
        default_brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
        plot_area.brush = default_brush;
    }
};

CChartSpace.prototype.recalculateChartPen = function()
{
    var parent_objects = this.getParentObjects();
    var default_line = new AscFormat.CLn();
    if(parent_objects.theme  && parent_objects.theme.themeElements
        && parent_objects.theme.themeElements.fmtScheme
        && parent_objects.theme.themeElements.fmtScheme.lnStyleLst)
    {
        default_line.merge(parent_objects.theme.themeElements.fmtScheme.lnStyleLst[0]);
    }

    var fill;
    if(this.style >= 1 && this.style <= 32)
        fill = CreateUnifillSolidFillSchemeColor(15, 0.75000);
    else if(this.style >= 33 && this.style <= 40)
        fill = CreateUnifillSolidFillSchemeColor(8, 0.75000);
    else
        fill = CreateUnifillSolidFillSchemeColor(12, 0);
    default_line.setFill(fill);
    if(this.spPr && this.spPr.ln)
        default_line.merge(this.spPr.ln);
    var parents = this.getParentObjects();
    default_line.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
    this.pen = default_line;
    checkBlackUnifill(this.pen.Fill, true);
};

CChartSpace.prototype.recalculateChartBrush = function()
{
    var default_brush;
    if(this.style >=1 && this.style <=32)
        default_brush = CreateUnifillSolidFillSchemeColor(6, 0);
    else if(this.style >=33 && this.style <= 40)
        default_brush = CreateUnifillSolidFillSchemeColor(12, 0);
    else
        default_brush = CreateUnifillSolidFillSchemeColor(8, 0);

    if(this.spPr && this.spPr.Fill)
    {
        default_brush.merge(this.spPr.Fill);
    }
    var parents = this.getParentObjects();
    default_brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
    this.brush = default_brush;

};

CChartSpace.prototype.recalculateAxisTickMark = function()
{
    if(this.chart && this.chart.plotArea)
    {
        var calcMajorMinorGridLines = function (axis, defaultStyle, subtleLine, parents)
        {
            function calcGridLine(defaultStyle, spPr, subtleLine, parents)
            {
                var compiled_grid_lines = new AscFormat.CLn();
                compiled_grid_lines.merge(subtleLine);
                // if(compiled_grid_lines.Fill && compiled_grid_lines.Fill.fill && compiled_grid_lines.Fill.fill.color && compiled_grid_lines.Fill.fill.color.Mods)
                // {
                //     compiled_grid_lines.Fill.fill.color.Mods.Mods.length = 0;
                // }
                if(!compiled_grid_lines.Fill)
                {
                    compiled_grid_lines.setFill(new AscFormat.CUniFill());
                }
                //if(compiled_grid_lines.Fill && compiled_grid_lines.Fill.fill && compiled_grid_lines.Fill.fill.color && compiled_grid_lines.Fill.fill.color.Mods)
                //{
                //    compiled_grid_lines.Fill.fill.color.Mods.Mods.length = 0;
                //}
                compiled_grid_lines.Fill.merge(defaultStyle);

                if(subtleLine.Fill && subtleLine.Fill.fill && subtleLine.Fill.fill.color && subtleLine.Fill.fill.color.Mods
                    && compiled_grid_lines.Fill && compiled_grid_lines.Fill.fill && compiled_grid_lines.Fill.fill.color)
                {
                    compiled_grid_lines.Fill.fill.color.Mods =  subtleLine.Fill.fill.color.Mods.createDuplicate();
                }

                compiled_grid_lines.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
                checkBlackUnifill(compiled_grid_lines.Fill, true);
                if(spPr && spPr.ln)
                {
                    compiled_grid_lines.merge(spPr.ln);
                    compiled_grid_lines.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
                }

                return compiled_grid_lines;
            }
            axis.compiledLn = calcGridLine(defaultStyle.axisAndMajorGridLines, axis.spPr, subtleLine, parents);
            axis.compiledTickMarkLn = axis.compiledLn.createDuplicate();
            if(AscFormat.isRealNumber(axis.compiledTickMarkLn.w))
                axis.compiledTickMarkLn.w/=2;
            axis.compiledTickMarkLn.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255})
        };
        var default_style = CHART_STYLE_MANAGER.getDefaultLineStyleByIndex(this.style);
        var parent_objects = this.getParentObjects();
        var subtle_line;
        if(parent_objects.theme  && parent_objects.theme.themeElements
            && parent_objects.theme.themeElements.fmtScheme
            && parent_objects.theme.themeElements.fmtScheme.lnStyleLst)
        {
            subtle_line = parent_objects.theme.themeElements.fmtScheme.lnStyleLst[0];
        }
        if(this.chart.plotArea.valAx)
            calcMajorMinorGridLines(this.chart.plotArea.valAx, default_style, subtle_line, parent_objects);
        if(this.chart.plotArea.catAx)
            calcMajorMinorGridLines(this.chart.plotArea.catAx, default_style, subtle_line, parent_objects);
    }
};

CChartSpace.prototype.getXValAxisValues = function()
{
    if(!this.chartObj)
    {
        this.chartObj = new AscFormat.CChartsDrawer()
    }
    this.chartObj.preCalculateData(this);
    return [].concat(this.chartObj.calcProp.xScale);
};

CChartSpace.prototype.getValAxisValues = function()
{
    if(!this.chartObj)
    {
        this.chartObj = new AscFormat.CChartsDrawer()
    }
    this.chartObj.preCalculateData(this);
    return [].concat(this.chartObj.calcProp.scale);
};

CChartSpace.prototype.getCalcProps = function()
{
    if(!this.chartObj)
    {
        this.chartObj = new AscFormat.CChartsDrawer()
    }
    this.chartObj.preCalculateData(this);
    return this.chartObj.calcProp;
};

CChartSpace.prototype.recalculateDLbls = function()
{
    if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0] && this.chart.plotArea.charts[0].series)
    {
        var series = this.chart.plotArea.charts[0].series;
        var nDefaultPosition;
        if(this.chart.plotArea.charts[0].getDefaultDataLabelsPosition)
        {
            nDefaultPosition = this.chart.plotArea.charts[0].getDefaultDataLabelsPosition();
        }

        var default_lbl = new AscFormat.CDLbl();
        default_lbl.initDefault(nDefaultPosition);
        for(var i = 0; i < series.length; ++i)
        {
            var ser = series[i];
            var pts = AscFormat.getPtsFromSeries(ser);
            for(var j = 0; j < pts.length; ++j)
            {
                var pt = pts[j];
                var compiled_dlb = new AscFormat.CDLbl();
                compiled_dlb.merge(default_lbl);
                compiled_dlb.merge(this.chart.plotArea.charts[0].dLbls);
                if(this.chart.plotArea.charts[0].dLbls)
                    compiled_dlb.merge(this.chart.plotArea.charts[0].dLbls.findDLblByIdx(pt.idx), false);
                compiled_dlb.merge(ser.dLbls);
                if(ser.dLbls)
                    compiled_dlb.merge(ser.dLbls.findDLblByIdx(pt.idx));

                if(compiled_dlb.checkNoLbl())
                {
                    pt.compiledDlb = null;
                }
                else
                {
                    pt.compiledDlb = compiled_dlb;
                    pt.compiledDlb.chart = this;
                    pt.compiledDlb.series = ser;
                    pt.compiledDlb.pt = pt;
                    pt.compiledDlb.recalculate();
                }
            }
        }
    }
};

CChartSpace.prototype.recalculateHiLowLines = function()
{
    if(this.chart && this.chart.plotArea && (this.chart.plotArea.charts[0] instanceof AscFormat.CStockChart || this.chart.plotArea.charts[0] instanceof AscFormat.CLineChart) && this.chart.plotArea.charts[0].hiLowLines)
    {
        var parents = this.getParentObjects();
        var default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0].createDuplicate();
        if(this.style >=1 && this.style <= 32)
            default_line.setFill(CreateUnifillSolidFillSchemeColor(15, 0));
        else if(this.style >= 33 && this.style <= 34)
            default_line.setFill(CreateUnifillSolidFillSchemeColor(8, 0));
        else if(this.style >= 35 && this.style <= 40)
            default_line.setFill(CreateUnifillSolidFillSchemeColor(8, -0.25000));
        else
            default_line.setFill(CreateUnifillSolidFillSchemeColor(12, 0));
        default_line.merge(this.chart.plotArea.charts[0].hiLowLines.ln);
        this.chart.plotArea.charts[0].calculatedHiLowLines = default_line;
        default_line.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R:0, G:0, B:0, A:255});
    }
    else
    {
        this.chart.plotArea.charts[0].calculatedHiLowLines = null;
    }
};

CChartSpace.prototype.recalculateSeriesColors = function()
{
    if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0] && this.chart.plotArea.charts[0].series)
    {
        var style = CHART_STYLE_MANAGER.getStyleByIndex(this.style);
        var series = this.chart.plotArea.charts[0].series;
        var parents = this.getParentObjects();
        var RGBA = {R: 0, G: 0, B: 0, A: 255};
        if(this.chart.plotArea.charts[0].varyColors && (series.length === 1 || this.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_PieChart || this.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_DoughnutChart))
        {
            for(var ii = 0; ii < series.length; ++ ii)
            {
                var ser = series[ii];
                var pts = AscFormat.getPtsFromSeries(ser);
                if(!(this.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_LineChart || this.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_ScatterChart))
                {
                    var base_fills = getArrayFillsFromBase(style.fill2, getMaxIdx(pts));
                    for(var i = 0; i < pts.length; ++i)
                    {
                        var compiled_brush = new AscFormat.CUniFill();
                        compiled_brush.merge(base_fills[pts[i].idx]);
                        if(ser.spPr && ser.spPr.Fill)
                        {
                            compiled_brush.merge(ser.spPr.Fill);
                        }
                        if(Array.isArray(ser.dPt))
                        {
                            for(var j = 0; j < ser.dPt.length; ++j)
                            {
                                if(ser.dPt[j].idx === pts[i].idx)
                                {
                                    if(ser.dPt[j].spPr)
                                    {
                                        compiled_brush.merge(ser.dPt[j].spPr.Fill);
                                    }
                                    break;
                                }
                            }
                        }
                        pts[i].brush = compiled_brush;
                        pts[i].brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }

                    default_line =  new AscFormat.CLn();
                    if(style.line1 === EFFECT_NONE)
                    {
                        default_line.w = 0;
                    }
                    else if(style.line1 === EFFECT_SUBTLE)
                    {
                        default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[0]);
                    }
                    else if(style.line1 === EFFECT_MODERATE)
                    {
                        default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[1]);
                    }
                    else if(style.line1 === EFFECT_INTENSE)
                    {
                        default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[2]);
                    }
                    var base_line_fills;
                    if(this.style === 34)
                        base_line_fills = getArrayFillsFromBase(style.line2, getMaxIdx(pts));
                    for(i = 0; i < pts.length; ++i)
                    {
                        var compiled_line = new AscFormat.CLn();
                        compiled_line.merge(default_line);
                        compiled_line.Fill = new AscFormat.CUniFill();
                        if(this.style !== 34)
                        {
                            compiled_line.Fill.merge(style.line2[0]);
                        }
                        else
                        {
                            compiled_line.Fill.merge(base_line_fills[pts[i].idx]);
                        }
                        if(ser.spPr && ser.spPr.ln)
                            compiled_line.merge(ser.spPr.ln);
                        if(Array.isArray(ser.dPt) && !(ser.getObjectType && ser.getObjectType() === AscDFH.historyitem_type_AreaSeries))
                        {
                            for(var j = 0; j < ser.dPt.length; ++j)
                            {
                                if(ser.dPt[j].idx === pts[i].idx)
                                {
                                    if(ser.dPt[j].spPr)
                                    {
                                        compiled_line.merge(ser.dPt[j].spPr.ln);
                                    }
                                    break;
                                }
                            }
                        }
                        pts[i].pen = compiled_line;
                        pts[i].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                }
                else
                {
                    var default_line;
                    if(this.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_ScatterChart && this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_MARKER || this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_NONE)
                    {
                        default_line = new AscFormat.CLn();
                        default_line.setFill(new AscFormat.CUniFill());
                        default_line.Fill.setFill(new AscFormat.CNoFill());
                    }
                    else
                    {
                        default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0];
                    }
                    var base_line_fills = getArrayFillsFromBase(style.line4, getMaxIdx(pts));
                    for(var i = 0; i < pts.length; ++i)
                    {
                        var compiled_line = new AscFormat.CLn();
                        compiled_line.merge(default_line);
                        if(!(this.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_ScatterChart && this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_MARKER || this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_NONE))
                            compiled_line.Fill.merge(base_line_fills[pts[i].idx]);
                        compiled_line.w *= style.line3;
                        if(ser.spPr && ser.spPr.ln)
                        {
                            compiled_line.merge(ser.spPr.ln);
                        }
                        if(Array.isArray(ser.dPt))
                        {
                            for(var j = 0; j < ser.dPt.length; ++j)
                            {
                                if(ser.dPt[j].idx === pts[i].idx)
                                {
                                    if(ser.dPt[j].spPr)
                                    {
                                        compiled_line.merge(ser.dPt[j].spPr.ln);
                                    }
                                    break;
                                }
                            }
                        }
                        pts[i].brush = null;
                        pts[i].pen = compiled_line;
                        pts[i].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    }
                }
                for(var j = 0; j < pts.length; ++j)
                {
                    if(pts[j].compiledMarker)
                    {
                        pts[j].compiledMarker.pen &&  pts[j].compiledMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        pts[j].compiledMarker.brush &&  pts[j].compiledMarker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);

                    }
                }

            }
        }
        else
        {
            switch(this.chart.plotArea.charts[0].getObjectType())
            {
                case AscDFH.historyitem_type_LineChart:
                case AscDFH.historyitem_type_RadarChart:
                {
                    var base_line_fills = getArrayFillsFromBase(style.line4, getMaxIdx(series));
                    if(!AscFormat.CChartsDrawer.prototype._isSwitchCurrent3DChart(this))
                    {
                        for(var i = 0; i < series.length; ++i)
                        {
                            var default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0];
                            var ser = series[i];
                            var pts = AscFormat.getPtsFromSeries(ser);
                            var compiled_line = new AscFormat.CLn();
                            compiled_line.merge(default_line);
                            compiled_line.Fill.merge(base_line_fills[ser.idx]);
                            compiled_line.w *= style.line3;
                            if(ser.spPr && ser.spPr.ln)
                                compiled_line.merge(ser.spPr.ln);
                            ser.compiledSeriesPen = compiled_line.createDuplicate();
                            for(var j = 0; j < pts.length; ++j)
                            {
                                var compiled_line = new AscFormat.CLn();
                                compiled_line.merge(default_line);
                                compiled_line.Fill.merge(base_line_fills[ser.idx]);
                                compiled_line.w *= style.line3;
                                if(ser.spPr && ser.spPr.ln)
                                    compiled_line.merge(ser.spPr.ln);
                                if(Array.isArray(ser.dPt))
                                {
                                    for(var k = 0; k < ser.dPt.length; ++k)
                                    {
                                        if(ser.dPt[k].idx === pts[j].idx)
                                        {
                                            if(ser.dPt[k].spPr)
                                            {
                                                compiled_line.merge(ser.dPt[k].spPr.ln);
                                            }
                                            break;
                                        }
                                    }
                                }
                                pts[j].brush = null;
                                pts[j].pen = compiled_line;
                                pts[j].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                if(pts[j].compiledMarker)
                                {

                                    pts[j].compiledMarker.pen &&  pts[j].compiledMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                    pts[j].compiledMarker.brush &&  pts[j].compiledMarker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);

                                }
                            }
                        }
                    }
                    else
                    {
                        var base_fills = getArrayFillsFromBase(style.fill2, getMaxIdx(series));
                        var base_line_fills = null;
                        if(style.line1 === EFFECT_SUBTLE && this.style === 34)
                            base_line_fills	= getArrayFillsFromBase(style.line2, getMaxIdx(series));
                        for(var i = 0; i < series.length; ++i)
                        {
                            var ser = series[i];
                            var compiled_brush = new AscFormat.CUniFill();
                            compiled_brush.merge(base_fills[ser.idx]);
                            if(ser.spPr && ser.spPr.Fill)
                            {
                                compiled_brush.merge(ser.spPr.Fill);
                            }
                            ser.compiledSeriesBrush = compiled_brush.createDuplicate();
                            var pts = AscFormat.getPtsFromSeries(ser);
                            for(var j = 0; j < pts.length; ++j)
                            {
                                var compiled_brush = new AscFormat.CUniFill();
                                compiled_brush.merge(base_fills[ser.idx]);
                                if(ser.spPr && ser.spPr.Fill)
                                {
                                    compiled_brush.merge(ser.spPr.Fill);
                                }
                                if(Array.isArray(ser.dPt) && !(ser.getObjectType && ser.getObjectType() === AscDFH.historyitem_type_AreaSeries))
                                {
                                    for(var k = 0; k < ser.dPt.length; ++k)
                                    {
                                        if(ser.dPt[k].idx === pts[j].idx)
                                        {
                                            if(ser.dPt[k].spPr)
                                            {
                                                compiled_brush.merge(ser.dPt[k].spPr.Fill);
                                            }
                                            break;
                                        }
                                    }
                                }
                                pts[j].brush = compiled_brush;
                                pts[j].brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            }


                            //
                            {
                                default_line =  new AscFormat.CLn();
                                if(style.line1 === EFFECT_NONE)
                                {
                                    default_line.w = 0;
                                }
                                else if(style.line1 === EFFECT_SUBTLE)
                                {
                                    default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[0]);
                                }
                                else if(style.line1 === EFFECT_MODERATE)
                                {
                                    default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[1]);
                                }
                                else if(style.line1 === EFFECT_INTENSE)
                                {
                                    default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[2]);
                                }
                                var base_line_fills;
                                if(this.style === 34)
                                    base_line_fills = getArrayFillsFromBase(style.line2, getMaxIdx(pts));


                                var compiled_line = new AscFormat.CLn();
                                compiled_line.merge(default_line);
                                compiled_line.Fill = new AscFormat.CUniFill();
                                if(this.style !== 34)
                                    compiled_line.Fill.merge(style.line2[0]);
                                else
                                    compiled_line.Fill.merge(base_line_fills[ser.idx]);
                                if(ser.spPr && ser.spPr.ln)
                                {
                                    compiled_line.merge(ser.spPr.ln);
                                }
                                ser.compiledSeriesPen = compiled_line.createDuplicate();
                                for(var j = 0; j < pts.length; ++j)
                                {
                                    var compiled_line = new AscFormat.CLn();
                                    compiled_line.merge(default_line);
                                    compiled_line.Fill = new AscFormat.CUniFill();
                                    if(this.style !== 34)
                                        compiled_line.Fill.merge(style.line2[0]);
                                    else
                                        compiled_line.Fill.merge(base_line_fills[ser.idx]);
                                    if(ser.spPr && ser.spPr.ln)
                                    {
                                        compiled_line.merge(ser.spPr.ln);
                                    }
                                    if(Array.isArray(ser.dPt) && !(ser.getObjectType && ser.getObjectType() === AscDFH.historyitem_type_AreaSeries))
                                    {
                                        for(var k = 0; k < ser.dPt.length; ++k)
                                        {
                                            if(ser.dPt[k].idx === pts[j].idx)
                                            {
                                                if(ser.dPt[k].spPr)
                                                {
                                                    compiled_line.merge(ser.dPt[k].spPr.ln);
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    pts[j].pen = compiled_line;
                                    pts[j].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                    if(pts[j].compiledMarker)
                                    {
                                        pts[j].compiledMarker.pen &&  pts[j].compiledMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                        pts[j].compiledMarker.brush &&  pts[j].compiledMarker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
                case AscDFH.historyitem_type_ScatterChart:
                {
                    var base_line_fills = getArrayFillsFromBase(style.line4, getMaxIdx(series));
                    for(var i = 0; i < series.length; ++i)
                    {
                        var default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0];
                        var ser = series[i];
                        var pts = AscFormat.getPtsFromSeries(ser);
                        if(this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_SMOOTH || this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_SMOOTH_MARKER)
                        {
                            if(!AscFormat.isRealBool(ser.smooth))
                            {
                                ser.smooth = true;
                            }
                        }
                        if(this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_MARKER || this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_NONE)
                        {
                            default_line = new AscFormat.CLn();
                            default_line.setFill(new AscFormat.CUniFill());
                            default_line.Fill.setFill(new AscFormat.CNoFill());
                        }

                        var compiled_line = new AscFormat.CLn();
                        compiled_line.merge(default_line);
                        if(!(this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_MARKER || this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_NONE))
                            compiled_line.Fill.merge(base_line_fills[ser.idx]);
                        compiled_line.w *= style.line3;
                        if(ser.spPr && ser.spPr.ln)
                            compiled_line.merge(ser.spPr.ln);
                        ser.compiledSeriesPen = compiled_line.createDuplicate();
                        for(var j = 0; j < pts.length; ++j)
                        {
                            var compiled_line = new AscFormat.CLn();
                            compiled_line.merge(default_line);
                            if(!(this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_MARKER || this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_NONE))
                                compiled_line.Fill.merge(base_line_fills[ser.idx]);
                            compiled_line.w *= style.line3;
                            if(ser.spPr && ser.spPr.ln)
                                compiled_line.merge(ser.spPr.ln);
                            if(Array.isArray(ser.dPt))
                            {
                                for(var k = 0; k < ser.dPt.length; ++k)
                                {
                                    if(ser.dPt[k].idx === pts[j].idx)
                                    {
                                        if(ser.dPt[k].spPr)
                                        {
                                            compiled_line.merge(ser.dPt[k].spPr.ln);
                                        }
                                        break;
                                    }
                                }
                            }
                            pts[j].brush = null;
                            pts[j].pen = compiled_line;
                            pts[j].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            if(pts[j].compiledMarker)
                            {

                                pts[j].compiledMarker.pen &&  pts[j].compiledMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                pts[j].compiledMarker.brush &&  pts[j].compiledMarker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);

                            }
                        }
                    }
                    break;
                }
                case AscDFH.historyitem_type_SurfaceChart:
                {
                    var oSurfaceChart = this.chart.plotArea.charts[0];
                    var aValAxArray = this.getValAxisValues();
                    var nFmtsCount = aValAxArray.length - 1;
                    var oSpPr, oBandFmt, oCompiledBandFmt;
                    oSurfaceChart.compiledBandFormats.length = 0;
                    var multiplier;
                    var axis_by_types = oSurfaceChart.getAxisByTypes();
                    var val_ax = axis_by_types.valAx[0];
                    if(val_ax.dispUnits)
                        multiplier = val_ax.dispUnits.getMultiplier();
                    else
                        multiplier = 1;
                    var num_fmt = val_ax.numFmt, num_format = null, calc_value, rich_value;
                    if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                    {
                        num_format = oNumFormatCache.get(num_fmt.formatCode);
                    }
                    var oParentObjects = this.getParentObjects();
                    var RGBA = {R: 255, G: 255, B: 255, A: 255};
                    if(oSurfaceChart.isWireframe()){
                        var base_line_fills = getArrayFillsFromBase(style.line4, nFmtsCount);
                        var default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0];
                        for(var i = 0; i < nFmtsCount; ++i)
                        {
                            oBandFmt = oSurfaceChart.getBandFmtByIndex(i);
                            oSpPr = new AscFormat.CSpPr();
                            oSpPr.setFill(AscFormat.CreateNoFillUniFill());
                            var compiled_line = new AscFormat.CLn();
                            compiled_line.merge(default_line);
                            compiled_line.Fill.merge(base_line_fills[i]);
                            //compiled_line.w *= style.line3;
                            compiled_line.Join = new AscFormat.LineJoin();
                            compiled_line.Join.type = AscFormat.LineJoinType.Bevel;
                            if(oBandFmt && oBandFmt.spPr){
                                compiled_line.merge(oBandFmt.spPr.ln);
                            }
                            compiled_line.calculate(oParentObjects.theme, oParentObjects.slide, oParentObjects.layout, oParentObjects.master, RGBA);
                            oSpPr.setLn(compiled_line);
                            oCompiledBandFmt = new AscFormat.CBandFmt();
                            oCompiledBandFmt.setIdx(i);
                            oCompiledBandFmt.setSpPr(oSpPr);



                            if(num_format){
                                oCompiledBandFmt.startValue = num_format.formatToChart(aValAxArray[i]*multiplier);
                                oCompiledBandFmt.endValue = num_format.formatToChart(aValAxArray[i+1]*multiplier);

                            }
                            else{
                                oCompiledBandFmt.startValue = '' + (aValAxArray[i]*multiplier);
                                oCompiledBandFmt.endValue = '' + (aValAxArray[i+1]*multiplier);
                            }
                            oCompiledBandFmt.setSpPr(oSpPr);
                            oSurfaceChart.compiledBandFormats.push(oCompiledBandFmt);
                        }
                    }
                    else{
                        var base_fills = getArrayFillsFromBase(style.fill2, nFmtsCount);
                        var base_line_fills = null;
                        if(style.line1 === EFFECT_SUBTLE && this.style === 34)
                            base_line_fills	= getArrayFillsFromBase(style.line2, nFmtsCount);

                        var default_line =  new AscFormat.CLn();
                        if(style.line1 === EFFECT_NONE)
                        {
                            default_line.w = 0;
                        }
                        else if(style.line1 === EFFECT_SUBTLE)
                        {
                            default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[0]);
                        }
                        else if(style.line1 === EFFECT_MODERATE)
                        {
                            default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[1]);
                        }
                        else if(style.line1 === EFFECT_INTENSE)
                        {
                            default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[2]);
                        }

                        for(var i = 0; i < nFmtsCount; ++i) {
                            oBandFmt = oSurfaceChart.getBandFmtByIndex(i);
                            var compiled_brush = new AscFormat.CUniFill();
                            oSpPr = new AscFormat.CSpPr();
                            compiled_brush.merge(base_fills[i]);
                            if (oBandFmt && oBandFmt.spPr) {
                                compiled_brush.merge(oBandFmt.spPr.Fill);
                            }
                            oSpPr.setFill(compiled_brush);

                            var compiled_line = new AscFormat.CLn();
                            compiled_line.merge(default_line);
                            compiled_line.Fill = new AscFormat.CUniFill();
                            if(this.style !== 34)
                                compiled_line.Fill.merge(style.line2[0]);
                            else
                                compiled_line.Fill.merge(base_line_fills[i]);
                            if(oBandFmt && oBandFmt.spPr && oBandFmt.spPr.ln)
                            {
                                compiled_line.merge(oBandFmt.spPr.ln);
                            }
                            oSpPr.setLn(compiled_line);
                            compiled_line.calculate(oParentObjects.theme, oParentObjects.slide, oParentObjects.layout, oParentObjects.master, RGBA);
                            compiled_brush.calculate(oParentObjects.theme, oParentObjects.slide, oParentObjects.layout, oParentObjects.master, RGBA);
                            oCompiledBandFmt = new AscFormat.CBandFmt();
                            oCompiledBandFmt.setIdx(i);
                            oCompiledBandFmt.setSpPr(oSpPr);
                            if(num_format){
                                oCompiledBandFmt.startValue = num_format.formatToChart(aValAxArray[i]*multiplier);
                                oCompiledBandFmt.endValue = num_format.formatToChart(aValAxArray[i+1]*multiplier);

                            }
                            else{
                                oCompiledBandFmt.startValue = '' + (aValAxArray[i]*multiplier);
                                oCompiledBandFmt.endValue = '' + (aValAxArray[i+1]*multiplier);
                            }
                            oSurfaceChart.compiledBandFormats.push(oCompiledBandFmt);
                        }
                    }
                    break;
                }
                default :
                {
                    var base_fills = getArrayFillsFromBase(style.fill2, getMaxIdx(series));
                    var base_line_fills = null;
                    if(style.line1 === EFFECT_SUBTLE && this.style === 34)
                        base_line_fills	= getArrayFillsFromBase(style.line2, getMaxIdx(series));
                    for(var i = 0; i < series.length; ++i)
                    {
                        var ser = series[i];
                        var compiled_brush = new AscFormat.CUniFill();
                        compiled_brush.merge(base_fills[ser.idx]);
                        if(ser.spPr && ser.spPr.Fill)
                        {
                            compiled_brush.merge(ser.spPr.Fill);
                        }
                        ser.compiledSeriesBrush = compiled_brush.createDuplicate();
                        var pts = AscFormat.getPtsFromSeries(ser);
                        for(var j = 0; j < pts.length; ++j)
                        {
                            var compiled_brush = new AscFormat.CUniFill();
                            compiled_brush.merge(base_fills[ser.idx]);
                            if(ser.spPr && ser.spPr.Fill)
                            {
                                compiled_brush.merge(ser.spPr.Fill);
                            }
                            if(Array.isArray(ser.dPt) && !(ser.getObjectType && ser.getObjectType() === AscDFH.historyitem_type_AreaSeries))
                            {
                                for(var k = 0; k < ser.dPt.length; ++k)
                                {
                                    if(ser.dPt[k].idx === pts[j].idx)
                                    {
                                        if(ser.dPt[k].spPr)
                                        {
                                            compiled_brush.merge(ser.dPt[k].spPr.Fill);
                                        }
                                        break;
                                    }
                                }
                            }
                            pts[j].brush = compiled_brush;
                            pts[j].brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                        }


                        //
                        {
                            default_line =  new AscFormat.CLn();
                            if(style.line1 === EFFECT_NONE)
                            {
                                default_line.w = 0;
                            }
                            else if(style.line1 === EFFECT_SUBTLE)
                            {
                                default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[0]);
                            }
                            else if(style.line1 === EFFECT_MODERATE)
                            {
                                default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[1]);
                            }
                            else if(style.line1 === EFFECT_INTENSE)
                            {
                                default_line.merge(parents.theme.themeElements.fmtScheme.lnStyleLst[2]);
                            }
                            var base_line_fills;
                            if(this.style === 34)
                                base_line_fills = getArrayFillsFromBase(style.line2, getMaxIdx(pts));


                            var compiled_line = new AscFormat.CLn();
                            compiled_line.merge(default_line);
                            compiled_line.Fill = new AscFormat.CUniFill();
                            if(this.style !== 34)
                                compiled_line.Fill.merge(style.line2[0]);
                            else
                                compiled_line.Fill.merge(base_line_fills[ser.idx]);
                            if(ser.spPr && ser.spPr.ln)
                            {
                                compiled_line.merge(ser.spPr.ln);
                            }
                            ser.compiledSeriesPen = compiled_line.createDuplicate();
                            for(var j = 0; j < pts.length; ++j)
                            {
                                var compiled_line = new AscFormat.CLn();
                                compiled_line.merge(default_line);
                                compiled_line.Fill = new AscFormat.CUniFill();
                                if(this.style !== 34)
                                    compiled_line.Fill.merge(style.line2[0]);
                                else
                                    compiled_line.Fill.merge(base_line_fills[ser.idx]);
                                if(ser.spPr && ser.spPr.ln)
                                {
                                    compiled_line.merge(ser.spPr.ln);
                                }
                                if(Array.isArray(ser.dPt) && !(ser.getObjectType && ser.getObjectType() === AscDFH.historyitem_type_AreaSeries))
                                {
                                    for(var k = 0; k < ser.dPt.length; ++k)
                                    {
                                        if(ser.dPt[k].idx === pts[j].idx)
                                        {
                                            if(ser.dPt[k].spPr)
                                            {
                                                compiled_line.merge(ser.dPt[k].spPr.ln);
                                            }
                                            break;
                                        }
                                    }
                                }
                                pts[j].pen = compiled_line;
                                pts[j].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                if(pts[j].compiledMarker)
                                {
                                    pts[j].compiledMarker.pen &&  pts[j].compiledMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                    pts[j].compiledMarker.brush &&  pts[j].compiledMarker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
    }
};

CChartSpace.prototype.recalculateChartTitleEditMode = function(bWord)
{
    var old_pos_x, old_pos_y, old_pos_cx, old_pos_cy;
    var pos_x, pos_y;
    old_pos_x = this.recalcInfo.recalcTitle.x;
    old_pos_y = this.recalcInfo.recalcTitle.y;
    old_pos_cx = this.recalcInfo.recalcTitle.x + this.recalcInfo.recalcTitle.extX/2;
    old_pos_cy = this.recalcInfo.recalcTitle.y + this.recalcInfo.recalcTitle.extY/2;

    this.recalculateAxisLabels();
    if(checkVerticalTitle(this.recalcInfo.recalcTitle))
    {
        pos_x = old_pos_x;
        pos_y = old_pos_cy - this.recalcInfo.recalcTitle.extY/2;
    }
    else
    {
        pos_x = old_pos_cx - this.recalcInfo.recalcTitle.extX/2;
        pos_y = old_pos_y;
    }
    this.recalcInfo.recalcTitle.setPosition(pos_x, pos_y);
    if(bWord)
    {
        this.recalcInfo.recalcTitle.updatePosition(this.posX, this.posY);
    }
};

CChartSpace.prototype.recalculateMarkers = function()
{
    if(this.chart && this.chart.plotArea && this.chart.plotArea.charts[0])
    {
        var series = this.chart.plotArea.charts[0].series, pts;
        for(var i = 0; i < series.length; ++i)
        {
            var ser = series[i];
            ser.compiledSeriesMarker = null;
            pts =  AscFormat.getPtsFromSeries(ser);
            for(var j = 0; j < pts.length; ++j)
            {
                pts[j].compiledMarker = null;
            }
        }

        var oThis = this;
        var recalculateMarkers2 = function()
        {
            var chart_style = CHART_STYLE_MANAGER.getStyleByIndex(oThis.style);
            var effect_fill = chart_style.fill1;
            var fill = chart_style.fill2;
            var line = chart_style.line4;
            var masrker_default_size = AscFormat.isRealNumber(oThis.style) ? chart_style.markerSize : 5;
            var default_marker = new AscFormat.CMarker();
            default_marker.setSize(masrker_default_size);
            var parent_objects = oThis.getParentObjects();

            if(parent_objects.theme  && parent_objects.theme.themeElements
                && parent_objects.theme.themeElements.fmtScheme
                && parent_objects.theme.themeElements.fmtScheme.lnStyleLst)
            {
                default_marker.setSpPr(new AscFormat.CSpPr());
                default_marker.spPr.setLn(new AscFormat.CLn());
                default_marker.spPr.ln.merge(parent_objects.theme.themeElements.fmtScheme.lnStyleLst[0]);
            }
            var RGBA = {R:0, G:0, B:0, A: 255};
            if(oThis.chart.plotArea.charts[0].varyColors && (oThis.chart.plotArea.charts[0].series.length === 1 || oThis.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_PieChart || oThis.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_DoughnutChart))
            {
                var ser = oThis.chart.plotArea.charts[0].series[0], pts;
                if(ser.marker && ser.marker.symbol === AscFormat.SYMBOL_NONE && (!Array.isArray(ser.dPt) || ser.dPt.length === 0))
                    return;
                pts = AscFormat.getPtsFromSeries(ser);
                var series_marker = ser.marker;
                var brushes = getArrayFillsFromBase(fill, getMaxIdx(pts));
                var pens_fills = getArrayFillsFromBase(line, getMaxIdx(pts));
                var compiled_markers = [];

                for(var i = 0;  i < pts.length; ++i)
                {
                    var compiled_marker = new AscFormat.CMarker();
                    compiled_marker.merge(default_marker);
                    if(!compiled_marker.spPr)
                    {
                        compiled_marker.setSpPr(new AscFormat.CSpPr());
                    }
                    compiled_marker.spPr.setFill(brushes[pts[i].idx]);
                    compiled_marker.spPr.Fill.merge(pts[i].brush);
                    if(!compiled_marker.spPr.ln)
                        compiled_marker.spPr.setLn(new AscFormat.CLn());
                    compiled_marker.spPr.ln.merge(pts[i].pen);
                    compiled_marker.setSymbol(GetTypeMarkerByIndex(i));
                    compiled_marker.merge(ser.marker);

                    if(Array.isArray(ser.dPt))
                    {
                        for(var j = 0; j < ser.dPt.length; ++j)
                        {
                            if(ser.dPt[j].idx === pts[i].idx)
                            {

                                var d_pt = ser.dPt[j];
                                if(d_pt.spPr && (d_pt.spPr.Fill || d_pt.spPr.ln))
                                {
                                    if(!compiled_marker.spPr)
                                    {
                                        compiled_marker.setSpPr(new AscFormat.CSpPr());
                                    }
                                    if(d_pt.spPr.Fill)
                                    {
                                        compiled_marker.spPr.setFill(d_pt.spPr.Fill.createDuplicate());
                                    }
                                    if(d_pt.spPr.ln)
                                    {
                                        if(!compiled_marker.spPr.ln)
                                        {
                                            compiled_marker.spPr.setLn(new AscFormat.CLn());
                                        }
                                        compiled_marker.spPr.ln.merge(d_pt.spPr.ln);
                                    }
                                }

                                compiled_marker.merge(ser.dPt[j].marker);
                                break;
                            }
                        }
                    }
                    pts[i].compiledMarker = compiled_marker;
                    pts[i].compiledMarker.pen = compiled_marker.spPr.ln;
                    pts[i].compiledMarker.brush = compiled_marker.spPr.Fill;
                    pts[i].compiledMarker.brush.calculate(parent_objects.theme, parent_objects.slide, parent_objects.layout, parent_objects.master, RGBA);
                    pts[i].compiledMarker.pen.calculate(parent_objects.theme, parent_objects.slide, parent_objects.layout, parent_objects.master, RGBA);
                }
            }
            else
            {
                var series = oThis.chart.plotArea.charts[0].series;
                var brushes = getArrayFillsFromBase(fill, getMaxIdx(series));
                var pens_fills = getArrayFillsFromBase(line, getMaxIdx(series));
                for(var i = 0; i < series.length; ++i)
                {
                    var ser = series[i];
                    if(ser.marker && ser.marker.symbol === AscFormat.SYMBOL_NONE && (!Array.isArray(ser.dPt) || ser.dPt.length === 0))
                        continue;
                    pts = AscFormat.getPtsFromSeries(ser);
                    for(var j = 0; j < pts.length; ++j)
                    {
                        var compiled_marker = new AscFormat.CMarker();
                        compiled_marker.merge(default_marker);
                        if(!compiled_marker.spPr)
                        {
                            compiled_marker.setSpPr(new AscFormat.CSpPr());
                        }
                        compiled_marker.spPr.setFill(brushes[series[i].idx]);
                        if(!compiled_marker.spPr.ln)
                            compiled_marker.spPr.setLn(new AscFormat.CLn());
                        compiled_marker.spPr.ln.setFill(pens_fills[series[i].idx]);
                        compiled_marker.setSymbol(GetTypeMarkerByIndex(series[i].idx));
                        compiled_marker.merge(ser.marker);
                        if(j === 0)
                            ser.compiledSeriesMarker = compiled_marker.createDuplicate();
                        if(Array.isArray(ser.dPt))
                        {
                            for(var k = 0; k < ser.dPt.length; ++k)
                            {
                                if(ser.dPt[k].idx === pts[j].idx)
                                {
                                    compiled_marker.merge(ser.dPt[k].marker);
                                    break;
                                }
                            }
                        }
                        pts[j].compiledMarker = compiled_marker;
                        pts[j].compiledMarker.pen = compiled_marker.spPr.ln;
                        pts[j].compiledMarker.brush = compiled_marker.spPr.Fill;
                        pts[j].compiledMarker.brush.calculate(parent_objects.theme, parent_objects.slide, parent_objects.layout, parent_objects.master, RGBA);
                        pts[j].compiledMarker.pen.calculate(parent_objects.theme, parent_objects.slide, parent_objects.layout, parent_objects.master, RGBA);
                    }
                }
            }
        };
        switch (this.chart.plotArea.charts[0].getObjectType())
        {
            case AscDFH.historyitem_type_LineChart:
            case AscDFH.historyitem_type_RadarChart:
            {
                if(this.chart.plotArea.charts[0].marker !== false)
                {
                    recalculateMarkers2();
                }
                break;
            }
            case AscDFH.historyitem_type_ScatterChart:
            {
                if(this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_MARKER || this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_LINE_MARKER || this.chart.plotArea.charts[0].scatterStyle === AscFormat.SCATTER_STYLE_SMOOTH_MARKER)
                {
                    recalculateMarkers2();
                }
                break;
            }
            default:
            {
                recalculateMarkers2();
                break;
            }
        }
    }
};

CChartSpace.prototype.calcGridLine = function(defaultStyle, spPr, subtleLine, parents)
{
    if(spPr)
    {
        var compiled_grid_lines = new AscFormat.CLn();
        compiled_grid_lines.merge(subtleLine);
        // if(compiled_grid_lines.Fill && compiled_grid_lines.Fill.fill && compiled_grid_lines.Fill.fill.color && compiled_grid_lines.Fill.fill.color.Mods)
        // {
        //     compiled_grid_lines.Fill.fill.color.Mods.Mods.length = 0;
        // }
        if(!compiled_grid_lines.Fill)
        {
            compiled_grid_lines.setFill(new AscFormat.CUniFill());
        }
        //if(compiled_grid_lines.Fill && compiled_grid_lines.Fill.fill && compiled_grid_lines.Fill.fill.color && compiled_grid_lines.Fill.fill.color.Mods)
        //{
        //    compiled_grid_lines.Fill.fill.color.Mods.Mods.length = 0;
        //}
        compiled_grid_lines.Fill.merge(defaultStyle);

        if(subtleLine.Fill && subtleLine.Fill.fill && subtleLine.Fill.fill.color && subtleLine.Fill.fill.color.Mods
            && compiled_grid_lines.Fill && compiled_grid_lines.Fill.fill && compiled_grid_lines.Fill.fill.color)
        {
            compiled_grid_lines.Fill.fill.color.Mods =  subtleLine.Fill.fill.color.Mods.createDuplicate();
        }
        compiled_grid_lines.merge(spPr.ln);
        compiled_grid_lines.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
        checkBlackUnifill(compiled_grid_lines.Fill, true);
        return compiled_grid_lines;
    }
    return null;
};

CChartSpace.prototype.calcMajorMinorGridLines = function (axis, defaultStyle, subtleLine, parents)
{
    if(!axis)
        return;
    axis.compiledMajorGridLines = this.calcGridLine(defaultStyle.axisAndMajorGridLines, axis.majorGridlines, subtleLine, parents);
    axis.compiledMinorGridLines = this.calcGridLine(defaultStyle.minorGridlines, axis.minorGridlines, subtleLine, parents);
};

CChartSpace.prototype.handleTitlesAfterChangeTheme = function()
{
    if(this.chart && this.chart.title)
    {
        this.chart.title.checkAfterChangeTheme();
    }
    if(this.chart && this.chart.plotArea)
    {
        var hor_axis = this.chart.plotArea.getHorizontalAxis();
        if(hor_axis && hor_axis.title)
        {
            hor_axis.title.checkAfterChangeTheme();
        }
        var vert_axis = this.chart.plotArea.getVerticalAxis();
        if(vert_axis && vert_axis.title)
        {
            vert_axis.title.checkAfterChangeTheme();
        }
    }
};

CChartSpace.prototype.recalculateGridLines = function()
{
    if(this.chart && this.chart.plotArea)
    {
        var default_style = CHART_STYLE_MANAGER.getDefaultLineStyleByIndex(this.style);
        var parent_objects = this.getParentObjects();
        var subtle_line;
        if(parent_objects.theme  && parent_objects.theme.themeElements
            && parent_objects.theme.themeElements.fmtScheme
            && parent_objects.theme.themeElements.fmtScheme.lnStyleLst)
        {
            subtle_line = parent_objects.theme.themeElements.fmtScheme.lnStyleLst[0];
        }
        this.calcMajorMinorGridLines(this.chart.plotArea.valAx, default_style, subtle_line, parent_objects);
        this.calcMajorMinorGridLines(this.chart.plotArea.catAx, default_style, subtle_line, parent_objects);
    }
};

CChartSpace.prototype.hitToAdjustment = function()
{
    return {hit: false};
};

CChartSpace.prototype.recalculateAxisLabels = function()
{
    if(this.chart && this.chart.title)
    {
        var title = this.chart.title;
        //title.parent = this.chart;
        title.chart = this;
        title.recalculate();
    }
    if(this.chart && this.chart.plotArea)
    {
        var hor_axis = this.chart.plotArea.getHorizontalAxis();
        if(hor_axis && hor_axis.title)
        {
            var title = hor_axis.title;
            //title.parent = hor_axis;
            title.chart = this;
            title.recalculate();
        }
        var vert_axis = this.chart.plotArea.getVerticalAxis();
        if(vert_axis && vert_axis.title)
        {
            var title = vert_axis.title;
            //title.parent = vert_axis;
            title.chart = this;
            title.recalculate();
        }
    }
};

CChartSpace.prototype.recalculateBaseColors = function()
{
    if ( this.style && (typeof(this.style) == 'number') )
    {
        if ( this.style % 8 === 0 )
            this.baseColors = CreateColorMapByIndex(8);
        else
            this.baseColors = CreateColorMapByIndex(this.style % 8);
    }
    else
        this.baseColors = CreateColorMapByIndex(2);
};

CChartSpace.prototype.updateLinks = function()
{
    //Этот метод нужен, т. к. мы не полностью поддерживаем формат в котором в одном plotArea может быть несколько разных диаграмм(конкретных типов).
    // Здесь мы берем первую из диаграмм лежащих в массиве plotArea.charts, а также выставляем ссылки для осей ;
    if(this.chart && this.chart.plotArea)
    {
        this.chart.plotArea.chart = this.chart.plotArea.charts[0];
        if(this.chart.plotArea.charts[0].getAxisByTypes)
        {
            var axis_by_types = this.chart.plotArea.charts[0].getAxisByTypes();
            if(axis_by_types.valAx.length > 0 && axis_by_types.catAx.length > 0)
            {
                for(var i = 0; i < axis_by_types.valAx.length; ++i)
                {
                    if(axis_by_types.valAx[i].crossAx)
                    {
                        for(var j = 0; j < axis_by_types.catAx.length; ++j)
                        {
                            if(axis_by_types.catAx[j] === axis_by_types.valAx[i].crossAx)
                            {

                                this.chart.plotArea.valAx = axis_by_types.valAx[i];
                                this.chart.plotArea.catAx = axis_by_types.catAx[j];
                                break;
                            }
                        }
                        if(j < axis_by_types.catAx.length)
                        {
                            break;
                        }
                    }
                }
                if(i ===  axis_by_types.valAx.length)
                {
                    this.chart.plotArea.valAx = axis_by_types.valAx[0];
                    this.chart.plotArea.catAx = axis_by_types.catAx[0];
                }
            }
            else
            {
                if(axis_by_types.valAx.length > 1)
                {//TODO: выставлять оси исходя из настроек
                    this.chart.plotArea.valAx = axis_by_types.valAx[1];
                    this.chart.plotArea.catAx = axis_by_types.valAx[0];
                }
            }
        }
        else
        {
            this.chart.plotArea.valAx = null;
            this.chart.plotArea.catAx = null;
        }
    }
};

CChartSpace.prototype.draw = function(graphics)
{
    if(graphics.IsSlideBoundsCheckerType)
    {
        graphics.transform3(this.transform);
        graphics._s();
        graphics._m(0, 0);
        graphics._l(this.extX, 0);
        graphics._l(this.extX, this.extY);
        graphics._l(0, this.extY);
        graphics._e();
        return;
    }
    if(graphics.updatedRect)
    {
        var rect = graphics.updatedRect;
        var bounds = this.bounds;
        if(bounds.x > rect.x + rect.w
            || bounds.y > rect.y + rect.h
            || bounds.x + bounds.w < rect.x
            || bounds.y + bounds.h < rect.y)
            return;
    }
    graphics.SaveGrState();
    graphics.SetIntegerGrid(false);
    graphics.transform3(this.transform, false);

    var ln_width;
    if(this.pen && AscFormat.isRealNumber(this.pen.w))
    {
        ln_width = this.pen.w/36000;
    }
    else
    {
        ln_width = 0;
    }
    graphics.AddClipRect(-ln_width, -ln_width, this.extX+2*ln_width, this.extY+2*ln_width);

    if(this.chartObj)
    {
        this.chartObj.draw(this, graphics);
    }
    if(this.chart && !this.bEmptySeries)
    {
        if(this.chart.plotArea)
        {
            if(this.chart.plotArea.charts[0] && this.chart.plotArea.charts[0].series)
            {
                var series = this.chart.plotArea.charts[0].series;
                var _len = this.chart.plotArea.charts[0].getObjectType() === AscDFH.historyitem_type_PieChart ? 1 : series.length;
                for(var i = 0; i < _len; ++i)
                {
                    var ser = series[i];
                    var pts = AscFormat.getPtsFromSeries(ser);
                    for(var j = 0; j < pts.length; ++j)
                    {
                        if(pts[j].compiledDlb)
                            pts[j].compiledDlb.draw(graphics);
                    }
                }
            }
            if(this.chart.plotArea.catAx)
            {
                if(this.chart.plotArea.catAx.title)
                    this.chart.plotArea.catAx.title.draw(graphics);
                if(this.chart.plotArea.catAx.labels)
                    this.chart.plotArea.catAx.labels.draw(graphics);
            }
            if(this.chart.plotArea.valAx)
            {
                if(this.chart.plotArea.valAx.title)
                    this.chart.plotArea.valAx.title.draw(graphics);
                if(this.chart.plotArea.valAx.labels)
                    this.chart.plotArea.valAx.labels.draw(graphics);
            }
        }
        if(this.chart.title)
        {
            this.chart.title.draw(graphics);
        }
        if(this.chart.legend)
        {
            this.chart.legend.draw(graphics);
        }
    }
    graphics.RestoreGrState();
    if(!this.group)
    {
        var oLock;
        if(this.parent instanceof ParaDrawing)
        {
            oLock = this.parent.Lock;
        }
        else if(this.Lock)
        {
            oLock = this.Lock;
        }
        if(oLock && AscCommon.locktype_None != oLock.Get_Type())
        {
            graphics.SaveGrState();
            var bCoMarksDraw = true;
            if(typeof editor !== "undefined" && editor && AscFormat.isRealBool(editor.isCoMarksDraw)){
                bCoMarksDraw = editor.isCoMarksDraw;
            }
            if(bCoMarksDraw){
                graphics.transform3(this.transform);
                graphics.DrawLockObjectRect(oLock.Get_Type(), 0, 0, this.extX, this.extY);
            }
            graphics.RestoreGrState();
        }
    }
};

CChartSpace.prototype.addToSetPosition = function(dLbl)
{
    if(dLbl instanceof AscFormat.CDLbl)
        this.recalcInfo.dataLbls.push(dLbl);
    else if(dLbl instanceof AscFormat.CTitle)
        this.recalcInfo.axisLabels.push(dLbl);
};

CChartSpace.prototype.recalculateChart = function()
{
    this.pathMemory.curPos = -1;
    if(this.chartObj == null)
        this.chartObj =  new AscFormat.CChartsDrawer();
    this.chartObj.reCalculate(this);
};



CChartSpace.prototype.Get_RevisionsChangeParagraph = function(SearchEngine){
    var titles = this.getAllTitles(), i;
    if(titles.length === 0){
        return;
    }
    var oSelectedTitle = this.selection.title || this.selection.textSelection;
    if(oSelectedTitle){
        for(i = 0; i < titles.length; ++i){
            if(oSelectedTitle === titles[i]){
                break;
            }
        }
        if(i === titles.length){
            return;
        }
    }
    else{
        if(SearchEngine.Get_Direction() > 0){
            i = 0;
        }
        else{
            i = titles.length - 1;
        }
    }
    while(!SearchEngine.Is_Found()){
        titles[i].Get_RevisionsChangeParagraph(SearchEngine);
        if(SearchEngine.Get_Direction() > 0){
            if(i === titles.length - 1){
                break;
            }
            ++i;
        }
        else{
            if(i === 0){
                break;
            }
            --i;
        }
    }
};

CChartSpace.prototype.Search  = function(Str, Props, SearchEngine, Type)
{
    var titles = this.getAllTitles();
    for(var i = 0; i < titles.length; ++i)
    {
        titles[i].Search(Str, Props, SearchEngine, Type)
    }
};

CChartSpace.prototype.Search_GetId  = function(bNext, bCurrent)
{
    var Current = -1;
    var titles = this.getAllTitles();
    var Len = titles.length;

    var Id = null;
    if ( true === bCurrent )
    {
        for(var i = 0; i < Len; ++i)
        {
            if(titles[i] === this.selection.textSelection)
            {
                Current = i;
                break;
            }
        }
    }

    if ( true === bNext )
    {
        var Start = ( -1 !== Current ? Current : 0 );

        for ( var i = Start; i < Len; i++ )
        {
            if ( titles[i].Search_GetId )
            {
                Id = titles[i].Search_GetId(true, i === Current ? true : false);
                if ( null !== Id )
                    return Id;
            }
        }
    }
    else
    {
        var Start = ( -1 !== Current ? Current : Len - 1 );

        for ( var i = Start; i >= 0; i-- )
        {
            if (titles[i].Search_GetId )
            {
                Id = titles[i].Search_GetId(false, i === Current ? true : false);
                if ( null !== Id )
                    return Id;
            }
        }
    }
    return null;
};
    
function getPtsFromSeries(ser)
{
    if(ser)
    {
        if(ser.val)
        {
            if(ser.val.numRef && ser.val.numRef.numCache)
                return ser.val.numRef.numCache.pts;
            else if(ser.val.numLit)
                return ser.val.numLit.pts
        }
        else if(ser.yVal)
        {
            if(ser.yVal.numRef && ser.yVal.numRef.numCache)
                return ser.yVal.numRef.numCache.pts;
            else if(ser.yVal.numLit)
                return ser.yVal.numLit.pts
        }
    }
    return [];
}
    
function getCatStringPointsFromSeries(ser)
{
    if(ser && ser.cat)
    {
        if(ser.cat.strRef && ser.cat.strRef.strCache)
        {
            return ser.cat.strRef.strCache;
        }
        else if(ser.cat.strLit)
        {
            return ser.cat.strLit;
        }
    }
    return null;
}

function getMaxIdx(arr)
{
    var max_idx = 0;
    for(var i = 0; i < arr.length;++i)
        arr[i].idx > max_idx && (max_idx = arr[i].idx);
    return max_idx+1;
}
    
function getArrayFillsFromBase(arrBaseFills, needFillsCount)
{
    var ret = [];
    var nMaxCycleIdx = parseInt((needFillsCount - 1)/arrBaseFills.length);
    for(var i = 0;  i <  needFillsCount; ++i)
    {
        var nCycleIdx = ( i / arrBaseFills.length ) >> 0;
        var fShadeTint = ( nCycleIdx + 1 ) / (nMaxCycleIdx + 2) * 1.4 - 0.7;

        if(fShadeTint < 0)
        {
            fShadeTint = -(1 + fShadeTint);
        }
        else
        {
            fShadeTint = (1 - fShadeTint);
        }
        var color = CreateUniFillSolidFillWidthTintOrShade(arrBaseFills[i % arrBaseFills.length], fShadeTint);
        ret.push(color);
    }
    return ret;
}

function GetTypeMarkerByIndex(index)
{
    return AscFormat.MARKER_SYMBOL_TYPE[index % 9];
}

function CreateUnfilFromRGB(r, g, b)
{
    var ret =  new AscFormat.CUniFill();
    ret.setFill(new AscFormat.CSolidFill());
    ret.fill.setColor(new AscFormat.CUniColor());
    ret.fill.color.setColor(new AscFormat.CRGBColor());
    ret.fill.color.color.setColor(r, g, b);
    return ret;
}

function CreateColorMapByIndex(index)
{
    var ret = [];
    switch(index)
    {
        case 1:
        {
            ret.push(CreateUnfilFromRGB(85, 85, 85));
            ret.push(CreateUnfilFromRGB(158, 158, 158));
            ret.push(CreateUnfilFromRGB(114, 114, 114));
            ret.push(CreateUnfilFromRGB(70, 70, 70));
            ret.push(CreateUnfilFromRGB(131, 131, 131));
            ret.push(CreateUnfilFromRGB(193, 193, 193));
            break;
        }
        case 2:
        {
            for(var i = 0;  i < 6; ++i)
            {
                ret.push(CreateUnifillSolidFillSchemeColorByIndex(i));
            }
            break;
        }
        default:
        {
            ret.push(CreateUnifillSolidFillSchemeColorByIndex(index - 3));
            break;
        }
    }
    return ret;
}


function CreateUniFillSolidFillWidthTintOrShade(unifill, effectVal)
{
    var ret = unifill.createDuplicate();
    var unicolor = ret.fill.color;
    if(effectVal !== 0)
    {
        effectVal*=100000.0;
        if(!unicolor.Mods)
            unicolor.setMods(new AscFormat.CColorModifiers());
        var mod = new AscFormat.CColorMod();
        if(effectVal > 0)
        {
            mod.setName("tint");
            mod.setVal(effectVal);
        }
        else
        {
            mod.setName("shade");
            mod.setVal(Math.abs(effectVal));
        }
        unicolor.Mods.addMod(mod);
    }
    return ret;
}
    
function CreateUnifillSolidFillSchemeColor(colorId, tintOrShade)
{
    var unifill = new AscFormat.CUniFill();
    unifill.setFill(new AscFormat.CSolidFill());
    unifill.fill.setColor(new AscFormat.CUniColor());
    unifill.fill.color.setColor(new AscFormat.CSchemeColor());
    unifill.fill.color.color.setId(colorId);
    return CreateUniFillSolidFillWidthTintOrShade(unifill, tintOrShade);
}

function CreateNoFillLine()
{
    var ret = new AscFormat.CLn();
    ret.setFill(CreateNoFillUniFill());
    return ret;
}

function CreateNoFillUniFill()
{
    var ret = new AscFormat.CUniFill();
    ret.setFill(new AscFormat.CNoFill());
    return ret;
}

function CExternalData()
{
    this.autoUpdate = null;
    this.id  = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CExternalData.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_ExternalData;
    },

    setAutoUpdate: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_ExternalData_SetAutoUpdate, this.autoUpdate,  pr));
        this.autoUpdate = pr;
    },

    setId: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ExternalData_SetId, this.id,  pr));
        this.id = pr;
    }
};

function CPivotSource()
{
    this.fmtId = null;
    this.name  = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPivotSource.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_PivotSource;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setFmtId: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PivotSource_SetFmtId, this.fmtId,  pr));
        this.fmtId = pr;
    },

    setName: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PivotSource_SetName, this.name,  pr));
        this.name = pr;
    },


    createDuplicate: function()
    {
        var copy = new CPivotSource();
        if(AscFormat.isRealNumber(this.fmtId))
        {
            copy.setFmtId(this.fmtId);
        }
        if(typeof  this.name === "string")
        {
            copy.setName(this.name);
        }
        return copy;
    }
};


function CProtection()
{
    this.chartObject   = null;
    this.data          = null;
    this.formatting    = null;
    this.selection     = null;
    this.userInterface = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CProtection.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_Protection;
    },
    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setChartObject: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Protection_SetChartObject, this.chartObject, pr));
        this.chartObject = pr;
    },
    setData: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Protection_SetData, this.data, pr));
        this.data = pr;
    },
    setFormatting: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Protection_SetFormatting, this.formatting, pr));
        this.formatting = pr;
    },
    setSelection: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Protection_SetSelection, this.selection, pr));
        this.selection = pr;
    },
    setUserInterface: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Protection_SetUserInterface, this.userInterface, pr));
        this.userInterface = pr;
    },

    createDuplicate: function()
    {
        var c = new CProtection();
        if(this.chartObject !== null)
            c.setChartObject(this.chartObject);
        if(this.data !== null)
            c.setData(this.data);
        if(this.formatting !== null)
            c.setFormatting(this.formatting);
        if(this.selection !== null)
            c.setSelection(this.selection);
        if(this.userInterface !== null)
            c.setUserInterface(this.userInterface);
        return c;
    }
};


function CPrintSettings()
{
    this.headerFooter = null;
    this.pageMargins  = null;
    this.pageSetup    = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPrintSettings.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    createDuplicate : function()
    {
        var oPS = new CPrintSettings();
        
        if ( this.headerFooter )
            oPS.setHeaderFooter(this.headerFooter.createDuplicate());
        
        if ( this.pageMargins )
            oPS.setPageMargins(this.pageMargins.createDuplicate());
        
        if ( this.pageSetup )
            oPS.setPageSetup(this.pageSetup.createDuplicate());
        
        return oPS;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_PrintSettings;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setHeaderFooter: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PrintSettingsSetHeaderFooter, this.headerFooter,  pr));
        this.headerFooter = pr;
    },
    setPageMargins: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PrintSettingsSetPageMargins, this.pageMargins,  pr));
        this.pageMargins = pr;
    },
    setPageSetup: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PrintSettingsSetPageSetup, this.pageSetup,  pr));
        this.pageSetup = pr;
    }
};


function CHeaderFooterChart()
{
    this.alignWithMargins = null;
    this.differentFirst   = null;
    this.differentOddEven = null;
    this.evenFooter       = null;
    this.evenHeader       = null;
    this.firstFooter      = null;
    this.firstHeader      = null;
    this.oddFooter        = null;
    this.oddHeader        = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CHeaderFooterChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    createDuplicate : function()
    {
        var oHFC = new CHeaderFooterChart();

        if(this.alignWithMargins !== null)
            oHFC.setAlignWithMargins(this.alignWithMargins);
        if(this.differentFirst !== null)
            oHFC.setDifferentFirst(this.differentFirst);

        if(this.differentOddEven !== null)
            oHFC.setDifferentOddEven(this.differentOddEven);

        if ( this.evenFooter !== null )
            oHFC.setEvenFooter(this.evenFooter);

        if ( this.evenHeader !== null)
            oHFC.setEvenHeader(this.evenHeader);

        if ( this.firstFooter !== null)
            oHFC.setFirstFooter(this.firstFooter);

        if ( this.firstHeader !== null)
            oHFC.setFirstHeader(this.firstHeader);

        if ( this.oddFooter !== null)
            oHFC.setOddFooter(this.oddFooter);

        if ( this.oddHeader !== null)
            oHFC.setOddHeader(this.oddHeader);

        return oHFC;
    },


    Refresh_RecalcData: function()
    {},

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_HeaderFooterChart;
    },


    setAlignWithMargins: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_HeaderFooterChartSetAlignWithMargins, this.alignWithMargins,  pr));
        this.alignWithMargins = pr;
    },
    setDifferentFirst: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_HeaderFooterChartSetDifferentFirst, this.differentFirst,  pr));
        this.differentFirst = pr;
    },
    setDifferentOddEven: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_HeaderFooterChartSetDifferentOddEven, this.differentOddEven,  pr));
        this.differentOddEven = pr;
    },
    setEvenFooter: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooterChartSetEvenFooter, this.evenFooter,  pr));
        this.evenFooter = pr;
    },
    setEvenHeader: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooterChartSetEvenHeader, this.evenHeader,  pr));
        this.evenHeader = pr;
    },
    setFirstFooter: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooterChartSetFirstFooter, this.firstFooter,  pr));
        this.firstFooter = pr;
    },
    setFirstHeader: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooterChartSetFirstHeader, this.firstHeader,  pr));
        this.firstHeader = pr;
    },
    setOddFooter: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooterChartSetOddFooter, this.oddFooter,  pr));
        this.oddFooter = pr;
    },
    setOddHeader: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooterChartSetOddHeader, this.oddHeader,  pr));
        this.oddHeader = pr;
    }
};

function CPageMarginsChart()
{
    this.b      = null;
    this.footer = null;
    this.header = null;
    this.l      = null;
    this.r      = null;
    this.t      = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPageMarginsChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    createDuplicate : function()
    {
        var oPMC = new CPageMarginsChart();

        if(this.b !== null)
            oPMC.setB(this.b);
        if(this.footer !== null)
            oPMC.setFooter(this.footer);
        if(this.header !== null)
            oPMC.setHeader(this.header);
        if(this.l !== null)
            oPMC.setL(this.l);
        if(this.r !== null)
            oPMC.setR(this.r);
        if(this.t !== null)
            oPMC.setT(this.t);

        return oPMC;
    },

    Refresh_RecalcData: function()
    {},

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_PageMarginsChart;
    },

    setB: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_PageMarginsSetB, this.b,  pr));
        this.b = pr;
    },
    setFooter: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_PageMarginsSetFooter, this.footer,  pr));
        this.footer = pr;
    },
    setHeader: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_PageMarginsSetHeader, this.header,  pr));
        this.header = pr;
    },
    setL: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_PageMarginsSetL, this.l,  pr));
        this.l = pr;
    },
    setR: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_PageMarginsSetR, this.r,  pr));
        this.r = pr;
    },
    setT: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_PageMarginsSetT, this.t,  pr));
        this.t = pr;
    }
};

function CPageSetup()
{
    this.blackAndWhite     = null;
    this.copies            = null;
    this.draft             = null;
    this.firstPageNumber   = null;
    this.horizontalDpi     = null;
    this.orientation       = null;
    this.paperHeight       = null;
    this.paperSize         = null;
    this.paperWidth        = null;
    this.useFirstPageNumb  = null;
    this.verticalDpi       = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPageSetup.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    
    createDuplicate : function()
    {
        var oPS = new CPageSetup();

        if(this.blackAndWhite !== null)
            oPS.setBlackAndWhite(this.blackAndWhite);
        if(this.copies !== null)
            oPS.setCopies(this.copies);
        if(this.draft !== null)
            oPS.setDraft(this.draft);
        if(this.firstPageNumber !== null)
            oPS.setFirstPageNumber(this.firstPageNumber);
        if(this.horizontalDpi !== null)
            oPS.setHorizontalDpi(this.horizontalDpi);
        if(this.orientation !== null)
            oPS.setOrientation(this.orientation);
        if(this.paperHeight !== null)
            oPS.setPaperHeight(this.paperHeight);
        if(this.paperSize !== null)
            oPS.setPaperSize(this.paperSize);
        if(this.paperWidth !== null)
            oPS.setPaperWidth(this.paperWidth);
        if(this.useFirstPageNumb !== null)
            oPS.setUseFirstPageNumb(this.useFirstPageNumb);
        if(this.verticalDpi !== null)
            oPS.setVerticalDpi(this.verticalDpi);
                
        return oPS;
    },

    Refresh_RecalcData: function()
    {},

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_PageSetup;
    },
    setBlackAndWhite: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_PageSetupSetBlackAndWhite, this.blackAndWhite,  pr));
        this.blackAndWhite = pr;
    },
    setCopies: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PageSetupSetCopies, this.copies,  pr));
        this.copies = pr;
    },
    setDraft: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_PageSetupSetDraft, this.draft,  pr));
        this.draft = pr;
    },
    setFirstPageNumber: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PageSetupSetFirstPageNumber, this.firstPageNumber,  pr));
        this.firstPageNumber = pr;
    },
    setHorizontalDpi: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PageSetupSetHorizontalDpi, this.horizontalDpi,  pr));
        this.horizontalDpi = pr;
    },
    setOrientation: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PageSetupSetOrientation, this.orientation,  pr));
        this.orientation = pr;
    },
    setPaperHeight: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_PageSetupSetPaperHeight, this.paperHeight,  pr));
        this.paperHeight = pr;
    },
    setPaperSize: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PageSetupSetPaperSize, this.paperSize,  pr));
        this.paperSize = pr;
    },
    setPaperWidth: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_PageSetupSetPaperWidth, this.paperWidth,  pr));
        this.paperWidth = pr;
    },
    setUseFirstPageNumb: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_PageSetupSetUseFirstPageNumb, this.useFirstPageNumb,  pr));
        this.useFirstPageNumb = pr;
    },
    setVerticalDpi: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PageSetupSetVerticalDpi, this.verticalDpi,  pr));
        this.verticalDpi = pr;
    }
};


function CreateView3d(nRotX, nRotY, bRAngAx, nDepthPercent)
{
    var oView3d = new AscFormat.CView3d();
    AscFormat.isRealNumber(nRotX) && oView3d.setRotX(nRotX);
    AscFormat.isRealNumber(nRotY) && oView3d.setRotY(nRotY);
    AscFormat.isRealBool(bRAngAx) && oView3d.setRAngAx(bRAngAx);
    AscFormat.isRealNumber(nDepthPercent) && oView3d.setDepthPercent(nDepthPercent);
    return oView3d;
}

function GetNumFormatFromSeries(aAscSeries){
    if(aAscSeries &&
        aAscSeries[0] &&
        aAscSeries[0].Val &&
        aAscSeries[0].Val.NumCache &&
        aAscSeries[0].Val.NumCache[0]){
        if(typeof (aAscSeries[0].Val.NumCache[0].numFormatStr) === "string" && aAscSeries[0].Val.NumCache[0].numFormatStr.length > 0){
            return aAscSeries[0].Val.NumCache[0].numFormatStr;
        }
    }
    return "General";
}

function CreateLineChart(chartSeries, type, bUseCache, oOptions, b3D)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new AscFormat.CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    if(b3D)
    {
        chart.setView3D(CreateView3d(15, 20, true, 100));
        chart.setDefaultWalls();
    }
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new AscFormat.CPlotArea());
    chart.setPlotVisOnly(true);
    var disp_blanks_as;
    if(type === AscFormat.GROUPING_STANDARD)
    {
        disp_blanks_as = DISP_BLANKS_AS_GAP;
    }
    else
    {
        disp_blanks_as = DISP_BLANKS_AS_ZERO;
    }
    chart.setDispBlanksAs(disp_blanks_as);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new AscFormat.CLayout());
    plot_area.addChart(new AscFormat.CLineChart());

    var cat_ax = new AscFormat.CCatAx();
    var val_ax = new AscFormat.CValAx();
    cat_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    plot_area.addAxis(cat_ax);
    plot_area.addAxis(val_ax);

    var line_chart = plot_area.charts[0];
    line_chart.setGrouping(type);
    line_chart.setVaryColors(false);
    line_chart.setMarker(true);
    line_chart.setSmooth(false);
    line_chart.addAxId(cat_ax);
    line_chart.addAxId(val_ax);
    val_ax.setCrosses(2);
    var parsedHeaders = chartSeries.parsedHeaders;
    var bInCols;
    if(isRealObject(oOptions))
    {
        bInCols = oOptions.inColumns === true;
    }
    else
    {
        bInCols = false;
    }
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new AscFormat.CLineSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setMarker(new AscFormat.CMarker());
        series.marker.setSymbol(AscFormat.SYMBOL_NONE);
        series.setSmooth(false);
        series.setVal(new AscFormat.CYVal());
        FillValNum(series.val, asc_series[i].Val, bUseCache);
        if(parsedHeaders.bTop && !bInCols || bInCols && parsedHeaders.bLeft)
        {
            series.setCat(new AscFormat.CCat());
            FillCatStr(series.cat, asc_series[i].Cat, bUseCache);
        }
        if((parsedHeaders.bLeft && !bInCols || bInCols && parsedHeaders.bTop) && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            FillSeriesTx(series, asc_series[i].TxCache, bUseCache);
        }
        line_chart.addSer(series);
    }
    cat_ax.setScaling(new AscFormat.CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AscFormat.AX_POS_B);
    cat_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    cat_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    cat_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(AscFormat.LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    val_ax.setScaling(new AscFormat.CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AscFormat.AX_POS_L);
    val_ax.setMajorGridlines(new AscFormat.CSpPr());
    val_ax.setNumFmt(new AscFormat.CNumFmt());
    val_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    val_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    val_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(AscFormat.CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code;
    if(type === AscFormat.GROUPING_PERCENT_STACKED)
    {
        format_code = "0%";
    }
    else
    {
        format_code = GetNumFormatFromSeries(asc_series);
    }
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);


    if(asc_series.length > 1)
    {
        chart.setLegend(new AscFormat.CLegend());
        var legend = chart.legend;
        legend.setLegendPos(c_oAscChartLegendShowSettings.right);
        legend.setLayout(new AscFormat.CLayout());
        legend.setOverlay(false);
    }


    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateBarChart(chartSeries, type, bUseCache, oOptions, b3D, bDepth)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new AscFormat.CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    if(b3D)
    {
        chart.setView3D(CreateView3d(15, 20, true, bDepth ? 100 : undefined));
        chart.setDefaultWalls();
    }
    chart.setPlotArea(new AscFormat.CPlotArea());
    chart.setPlotVisOnly(true);
    chart.setDispBlanksAs(DISP_BLANKS_AS_GAP);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new AscFormat.CLayout());
    plot_area.addChart(new AscFormat.CBarChart());

    var bInCols;
    if(isRealObject(oOptions))
    {
        bInCols = oOptions.inColumns === true;
    }
    else
    {
        bInCols = false;
    }


    var cat_ax = new AscFormat.CCatAx();
    var val_ax = new AscFormat.CValAx();
    cat_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    plot_area.addAxis(cat_ax);
    plot_area.addAxis(val_ax);

    var bar_chart = plot_area.charts[0];
    if(b3D)
    {
        bar_chart.set3D(true);
    }
    bar_chart.setBarDir(AscFormat.BAR_DIR_COL);
    bar_chart.setGrouping(type);
    bar_chart.setVaryColors(false);
    var parsedHeaders = chartSeries.parsedHeaders;
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new AscFormat.CBarSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setInvertIfNegative(false);
        series.setVal(new AscFormat.CYVal());
        FillValNum(series.val, asc_series[i].Val, bUseCache);
        if(parsedHeaders.bTop && !bInCols || bInCols && parsedHeaders.bLeft)
        {
            series.setCat(new AscFormat.CCat());
            FillCatStr(series.cat, asc_series[i].Cat, bUseCache);
        }
        if((parsedHeaders.bLeft && !bInCols || bInCols && parsedHeaders.bTop) && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            FillSeriesTx(series, asc_series[i].TxCache, bUseCache);
        }
        bar_chart.addSer(series);
    }
    bar_chart.setGapWidth(150);
    if(AscFormat.BAR_GROUPING_PERCENT_STACKED === type || AscFormat.BAR_GROUPING_STACKED === type)
        bar_chart.setOverlap(100);
    if(b3D)
    {
        bar_chart.setShape(BAR_SHAPE_BOX);
    }
    bar_chart.addAxId(cat_ax);
    bar_chart.addAxId(val_ax);
    cat_ax.setScaling(new AscFormat.CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AscFormat.AX_POS_B);
    cat_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    cat_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    cat_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(AscFormat.LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    val_ax.setScaling(new AscFormat.CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AscFormat.AX_POS_L);
    val_ax.setMajorGridlines(new AscFormat.CSpPr());
    val_ax.setNumFmt(new AscFormat.CNumFmt());
    var num_fmt = val_ax.numFmt;
    var format_code;
    if(type === AscFormat.BAR_GROUPING_PERCENT_STACKED)
    {
        format_code = "0%";
    }
    else
    {
        format_code = GetNumFormatFromSeries(asc_series);
    }
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    val_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    val_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    val_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(AscFormat.CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    if(asc_series.length > 1)
    {
        chart.setLegend(new AscFormat.CLegend());
        var legend = chart.legend;
        legend.setLegendPos(c_oAscChartLegendShowSettings.right);
        legend.setLayout(new AscFormat.CLayout());
        legend.setOverlay(false);
    }
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateHBarChart(chartSeries, type, bUseCache, oOptions, b3D)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new AscFormat.CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    if(b3D)
    {
        chart.setView3D(CreateView3d(15, 20, true, undefined));
        chart.setDefaultWalls();
    }
    chart.setPlotArea(new AscFormat.CPlotArea());
    chart.setPlotVisOnly(true);
    chart.setDispBlanksAs(DISP_BLANKS_AS_GAP);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new AscFormat.CLayout());
    plot_area.addChart(new AscFormat.CBarChart());


    var cat_ax = new AscFormat.CCatAx();
    var val_ax = new AscFormat.CValAx();
    cat_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    plot_area.addAxis(cat_ax);
    plot_area.addAxis(val_ax);

    var bar_chart = plot_area.charts[0];
    bar_chart.setBarDir(AscFormat.BAR_DIR_BAR);
    bar_chart.setGrouping(type);
    bar_chart.setVaryColors(false);
    var parsedHeaders = chartSeries.parsedHeaders;

    var bInCols;
    if(isRealObject(oOptions))
    {
        bInCols = oOptions.inColumns === true;
    }
    else
    {
        bInCols = false;
    }

    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new AscFormat.CBarSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setInvertIfNegative(false);
        series.setVal(new AscFormat.CYVal());
        FillValNum(series.val, asc_series[i].Val, bUseCache);
        if((parsedHeaders.bTop && !bInCols || bInCols && parsedHeaders.bLeft))
        {
            series.setCat(new AscFormat.CCat());
            FillCatStr(series.cat, asc_series[i].Cat, bUseCache);
        }
        if((parsedHeaders.bLeft && !bInCols || bInCols && parsedHeaders.bTop) && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            FillSeriesTx(series, asc_series[i].TxCache, bUseCache);
        }
        bar_chart.addSer(series);
        if(b3D)
        {
            bar_chart.setShape(BAR_SHAPE_BOX);
        }
    }
    //bar_chart.setDLbls(new CDLbls());
    //var d_lbls = bar_chart.dLbls;
    //d_lbls.setShowLegendKey(false);
    //d_lbls.setShowVal(true);
    bar_chart.setGapWidth(150);
    if(AscFormat.BAR_GROUPING_PERCENT_STACKED === type || AscFormat.BAR_GROUPING_STACKED === type)
        bar_chart.setOverlap(100);
    bar_chart.addAxId(cat_ax);
    bar_chart.addAxId(val_ax);
    cat_ax.setScaling(new AscFormat.CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AscFormat.AX_POS_L);
    cat_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    cat_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    cat_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(AscFormat.LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    val_ax.setScaling(new AscFormat.CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AscFormat.AX_POS_B);
    val_ax.setMajorGridlines(new AscFormat.CSpPr());
    val_ax.setNumFmt(new AscFormat.CNumFmt());
    val_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    val_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    val_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(AscFormat.CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code;
    /*if(type === GROUPING_PERCENT_STACKED)
     {
     format_code = "0%";
     }
     else */
    {
        format_code = GetNumFormatFromSeries(asc_series);
    }
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);

    if(asc_series.length > 1)
    {
        chart.setLegend(new AscFormat.CLegend());
        var legend = chart.legend;
        legend.setLegendPos(c_oAscChartLegendShowSettings.right);
        legend.setLayout(new AscFormat.CLayout());
        legend.setOverlay(false);
    }
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateAreaChart(chartSeries, type, bUseCache, oOptions)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new AscFormat.CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new AscFormat.CPlotArea());
    chart.setPlotVisOnly(true);
    chart.setDispBlanksAs(DISP_BLANKS_AS_ZERO);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new AscFormat.CLayout());
    plot_area.addChart(new AscFormat.CAreaChart());

    var cat_ax = new AscFormat.CCatAx();
    var val_ax = new AscFormat.CValAx();
    cat_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    plot_area.addAxis(cat_ax);
    plot_area.addAxis(val_ax);

    var bInCols;
    if(isRealObject(oOptions))
    {
        bInCols = oOptions.inColumns === true;
    }
    else
    {
        bInCols = false;
    }

    var area_chart = plot_area.charts[0];
    area_chart.setGrouping(type);
    area_chart.setVaryColors(false);
    var parsedHeaders = chartSeries.parsedHeaders;
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new AscFormat.CAreaSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setVal(new AscFormat.CYVal());
        FillValNum(series.val, asc_series[i].Val, bUseCache);
        if(parsedHeaders.bTop && !bInCols || bInCols && parsedHeaders.bLeft)
        {
            series.setCat(new AscFormat.CCat());
            FillCatStr(series.cat, asc_series[i].Cat, bUseCache);
        }
        if((parsedHeaders.bLeft && !bInCols || bInCols && parsedHeaders.bTop) && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            FillSeriesTx(series, asc_series[i].TxCache, bUseCache);
        }

        area_chart.addSer(series);
    }
    //area_chart.setDLbls(new CDLbls());
    area_chart.addAxId(cat_ax);
    area_chart.addAxId(val_ax);
    //var d_lbls = area_chart.dLbls;
    //d_lbls.setShowLegendKey(false);
    //d_lbls.setShowVal(true);
    cat_ax.setScaling(new AscFormat.CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AscFormat.AX_POS_B);
    cat_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    cat_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    cat_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(AscFormat.LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    cat_ax.scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    val_ax.setScaling(new AscFormat.CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AscFormat.AX_POS_L);
    val_ax.setMajorGridlines(new AscFormat.CSpPr());
    val_ax.setNumFmt(new AscFormat.CNumFmt());
    val_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    val_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    val_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(AscFormat.CROSS_BETWEEN_MID_CAT);
    var scaling = val_ax.scaling;
    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code;
    if(type === AscFormat.GROUPING_PERCENT_STACKED)
    {
        format_code = "0%";
    }
    else
    {
        format_code = GetNumFormatFromSeries(asc_series);
    }
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);

    if(asc_series.length > 1)
    {
        chart.setLegend(new AscFormat.CLegend());
        var legend = chart.legend;
        legend.setLegendPos(c_oAscChartLegendShowSettings.right);
        legend.setLayout(new AscFormat.CLayout());
        legend.setOverlay(false);
    }
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreatePieChart(chartSeries, bDoughnut, bUseCache, oOptions, b3D)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setStyle(2);
    chart_space.setChart(new AscFormat.CChart());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    if(b3D)
    {
        chart.setView3D(CreateView3d(30, 0, true, 100));
        chart.setDefaultWalls();
    }
    chart.setPlotArea(new AscFormat.CPlotArea());
    var plot_area = chart.plotArea;
    plot_area.setLayout(new AscFormat.CLayout());
    plot_area.addChart(bDoughnut ? new AscFormat.CDoughnutChart() : new AscFormat.CPieChart());
    var pie_chart = plot_area.charts[0];
    pie_chart.setVaryColors(true);
    var parsedHeaders = chartSeries.parsedHeaders;
    var bInCols;
    if(isRealObject(oOptions))
    {
        bInCols = oOptions.inColumns === true;
    }
    else
    {
        bInCols = false;
    }
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new AscFormat.CPieSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setVal(new AscFormat.CYVal());
        var val = series.val;
        FillValNum(series.val, asc_series[i].Val, bUseCache);
        if(parsedHeaders.bTop && !bInCols || bInCols && parsedHeaders.bLeft)
        {
            series.setCat(new AscFormat.CCat());
            FillCatStr(series.cat, asc_series[i].Cat, bUseCache);
        }
        if((parsedHeaders.bLeft && !bInCols || bInCols && parsedHeaders.bTop) && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            FillSeriesTx(series, asc_series[i].TxCache, bUseCache);
        }

        pie_chart.addSer(series);
    }
    pie_chart.setFirstSliceAng(0);
    if(bDoughnut)
        pie_chart.setHoleSize(50);
    chart.setLegend(new AscFormat.CLegend());
    var legend = chart.legend;
    legend.setLegendPos(c_oAscChartLegendShowSettings.right);
    legend.setLayout(new AscFormat.CLayout());
    legend.setOverlay(false);
    chart.setPlotVisOnly(true);
    chart.setDispBlanksAs(DISP_BLANKS_AS_GAP);
    chart.setShowDLblsOverMax(false);
    chart_space.setPrintSettings(new CPrintSettings());
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function FillCatStr(oCat, oCatCache, bUseCache, bFillCache)
{
    oCat.setStrRef(new AscFormat.CStrRef());
    var str_ref = oCat.strRef;
    str_ref.setF(oCatCache.Formula);
    if(bUseCache)
    {
        str_ref.setStrCache(new AscFormat.CStrCache());
        var str_cache = str_ref.strCache;
        var cat_num_cache = oCatCache.NumCache;
        str_cache.setPtCount(cat_num_cache.length);
        if(!(bFillCache === false))
        {

            for(var j = 0; j < cat_num_cache.length; ++j)
            {
                var string_pt = new AscFormat.CStringPoint();
                string_pt.setIdx(j);
                string_pt.setVal(cat_num_cache[j].val);
                str_cache.addPt(string_pt);
            }
        }
    }
}

function FillValNum(oVal, oValCache, bUseCache, bFillCache)
{
    oVal.setNumRef(new AscFormat.CNumRef());
    var num_ref = oVal.numRef;
    num_ref.setF(oValCache.Formula);
    if(bUseCache)
    {
        num_ref.setNumCache(new AscFormat.CNumLit());
        var num_cache = num_ref.numCache;
        num_cache.setPtCount(oValCache.NumCache.length);
        if(!(bFillCache === false))
        {
            for(var j = 0; j < oValCache.NumCache.length; ++j)
            {
                var pt = new AscFormat.CNumericPoint();
                pt.setIdx(j);
                pt.setFormatCode(oValCache.NumCache[j].numFormatStr);
                pt.setVal(oValCache.NumCache[j].val);
                num_cache.addPt(pt);
            }
        }
    }
}

function FillSeriesTx(oSeries, oTxCache, bUseCache, bFillCache)
{
    oSeries.setTx(new AscFormat.CTx());
    var tx= oSeries.tx;
    tx.setStrRef(new AscFormat.CStrRef());
    var str_ref = tx.strRef;
    str_ref.setF(oTxCache.Formula);
    if(bUseCache)
    {
        str_ref.setStrCache(new AscFormat.CStrCache());
        var str_cache = str_ref.strCache;
        str_cache.setPtCount(1);
        if(!(bFillCache === false))
        {
            str_cache.addPt(new AscFormat.CStringPoint());
            var pt = str_cache.pts[0];
            pt.setIdx(0);
            pt.setVal(oTxCache.Tx);
        }
    }
}


function CreateScatterChart(chartSeries, bUseCache, oOptions)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setStyle(2);
    chart_space.setChart(new AscFormat.CChart());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new AscFormat.CPlotArea());
    var plot_area = chart.plotArea;
    plot_area.setLayout(new AscFormat.CLayout());
    plot_area.addChart(new AscFormat.CScatterChart());
    var scatter_chart = plot_area.charts[0];
    scatter_chart.setScatterStyle(AscFormat.SCATTER_STYLE_MARKER);
    scatter_chart.setVaryColors(false);

    var bInCols;
    if(isRealObject(oOptions))
    {
        bInCols = oOptions.inColumns === true;
    }
    else
    {
        bInCols = false;
    }

    var parsedHeaders = chartSeries.parsedHeaders;

    var cat_ax = new AscFormat.CValAx();
    var val_ax = new AscFormat.CValAx();
    cat_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);
    plot_area.addAxis(cat_ax);
    plot_area.addAxis(val_ax);
    var oXVal;
    var first_series = null;
    var start_index = 0;
    var minus = 0;
    if(parsedHeaders.bTop && !bInCols || bInCols && parsedHeaders.bLeft)
    {
        oXVal = new AscFormat.CXVal();
        FillCatStr(oXVal, asc_series[0].xVal, bUseCache);
    }
    else
    {
        first_series = asc_series.length > 1 ? asc_series[0] : null;
        start_index = asc_series.length > 1 ? 1 : 0;
        minus = start_index === 1 ? 1 : 0;
        oXVal = new AscFormat.CXVal();
        if(first_series)
        {
            FillValNum(oXVal, first_series.Val, bUseCache);
        }
    }
    for(var i = start_index; i < asc_series.length; ++i)
    {
        var series = new AscFormat.CScatterSeries();
        series.setIdx(i - minus);
        series.setOrder(i - minus);
        if(oXVal)
        {
            series.setXVal(oXVal.createDuplicate());
        }
        series.setYVal(new AscFormat.CYVal());
        FillValNum(series.yVal, asc_series[i].Val, bUseCache);
        if((parsedHeaders.bLeft && !bInCols || bInCols && parsedHeaders.bTop) && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            FillSeriesTx(series, asc_series[i].TxCache, bUseCache)
        }
        scatter_chart.addSer(series);
    }
    scatter_chart.addAxId(cat_ax);
    scatter_chart.addAxId(val_ax);
    cat_ax.setScaling(new AscFormat.CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AscFormat.AX_POS_B);
    cat_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    cat_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    cat_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    cat_ax.scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    val_ax.setScaling(new AscFormat.CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AscFormat.AX_POS_L);
    val_ax.setMajorGridlines(new AscFormat.CSpPr());
    val_ax.setNumFmt(new AscFormat.CNumFmt());
    val_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    val_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    val_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(AscFormat.CROSS_BETWEEN_BETWEEN);
    var scaling = val_ax.scaling;
    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code = GetNumFormatFromSeries(asc_series);
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    if(scatter_chart.series.length > 1)
    {
        chart.setLegend(new AscFormat.CLegend());
        var legend = chart.legend;
        legend.setLegendPos(c_oAscChartLegendShowSettings.right);
        legend.setLayout(new AscFormat.CLayout());
        legend.setOverlay(false);
    }
    chart_space.setPrintSettings(new CPrintSettings());
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}

function CreateStockChart(chartSeries, bUseCache, oOptions)
{
    var asc_series = chartSeries.series;
    var chart_space = new CChartSpace();
    chart_space.setDate1904(false);
    chart_space.setLang("en-US");
    chart_space.setRoundedCorners(false);
    chart_space.setChart(new AscFormat.CChart());
    chart_space.setPrintSettings(new CPrintSettings());
    var chart = chart_space.chart;
    chart.setAutoTitleDeleted(false);
    chart.setPlotArea(new AscFormat.CPlotArea());
    chart.setLegend(new AscFormat.CLegend());
    chart.setPlotVisOnly(true);
    var disp_blanks_as;
    disp_blanks_as = DISP_BLANKS_AS_GAP;
    chart.setDispBlanksAs(disp_blanks_as);
    chart.setShowDLblsOverMax(false);
    var plot_area = chart.plotArea;
    plot_area.setLayout(new AscFormat.CLayout());
    plot_area.addChart(new AscFormat.CStockChart());

    var bInCols;
    if(isRealObject(oOptions))
    {
        bInCols = oOptions.inColumns === true;
    }
    else
    {
        bInCols = false;
    }


    var cat_ax = new AscFormat.CCatAx();
    var val_ax = new AscFormat.CValAx();
    cat_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    plot_area.addAxis(cat_ax);
    plot_area.addAxis(val_ax);

    var line_chart = plot_area.charts[0];
    line_chart.addAxId(cat_ax);
    line_chart.addAxId(val_ax);
    line_chart.setHiLowLines(new AscFormat.CSpPr());
    line_chart.setUpDownBars(new AscFormat.CUpDownBars());
    line_chart.upDownBars.setGapWidth(150);
    line_chart.upDownBars.setUpBars(new AscFormat.CSpPr());
    line_chart.upDownBars.setDownBars(new AscFormat.CSpPr());
    var parsedHeaders = chartSeries.parsedHeaders;
    for(var i = 0; i < asc_series.length; ++i)
    {
        var series = new AscFormat.CLineSeries();
        series.setIdx(i);
        series.setOrder(i);
        series.setMarker(new AscFormat.CMarker());
        series.setSpPr(new AscFormat.CSpPr());
        series.spPr.setLn(new AscFormat.CLn());
        series.spPr.ln.setW(28575);
        series.spPr.ln.setFill(CreateNoFillUniFill());
        series.marker.setSymbol(AscFormat.SYMBOL_NONE);
        series.setSmooth(false);
        series.setVal(new AscFormat.CYVal());
        var val = series.val;
        FillValNum(val, asc_series[i].Val, bUseCache);
        if((parsedHeaders.bTop && !bInCols || bInCols && parsedHeaders.bLeft))
        {
            series.setCat(new AscFormat.CCat());
            var cat = series.cat;
            if(typeof asc_series[i].Cat.formatCode === "string" && asc_series[i].Cat.formatCode.length > 0)
            {
                cat.setNumRef(new AscFormat.CNumRef());
                var num_ref = cat.numRef;
                num_ref.setF(asc_series[i].Cat.Formula);
                if(bUseCache)
                {
                    num_ref.setNumCache(new AscFormat.CNumLit());
                    var num_cache = num_ref.numCache;
                    var cat_num_cache = asc_series[i].Cat.NumCache;
                    num_cache.setPtCount(cat_num_cache.length);
                    num_cache.setFormatCode(asc_series[i].Cat.formatCode);
                    for(var j= 0; j < cat_num_cache.length; ++j)
                    {
                        var pt = new AscFormat.CNumericPoint();
                        pt.setIdx(j);
                        pt.setVal(cat_num_cache[j].val);
                        if(cat_num_cache[j].numFormatStr !== asc_series[i].Cat.formatCode)
                        {
                            pt.setFormatCode(cat_num_cache[j].numFormatStr);
                        }
                        num_cache.addPt(pt);
                    }
                }
            }
            else
            {
                FillCatStr(cat, asc_series[i].Cat, bUseCache);
            }

        }
        if((parsedHeaders.bLeft && !bInCols || bInCols && parsedHeaders.bTop) && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
        {
            FillSeriesTx(series, asc_series[i].TxCache, bUseCache);
        }
        line_chart.addSer(series);
    }
    cat_ax.setScaling(new AscFormat.CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AscFormat.AX_POS_B);
    cat_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    cat_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    cat_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(AscFormat.LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    val_ax.setScaling(new AscFormat.CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AscFormat.AX_POS_L);
    val_ax.setMajorGridlines(new AscFormat.CSpPr());
    val_ax.setNumFmt(new AscFormat.CNumFmt());
    val_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    val_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    val_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(AscFormat.CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code;
    format_code = GetNumFormatFromSeries(asc_series);
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    var legend = chart.legend;
    legend.setLegendPos(c_oAscChartLegendShowSettings.right);
    legend.setLayout(new AscFormat.CLayout());
    legend.setOverlay(false);
    var print_settings = chart_space.printSettings;
    print_settings.setHeaderFooter(new CHeaderFooterChart());
    print_settings.setPageMargins(new CPageMarginsChart());
    print_settings.setPageSetup(new CPageSetup());
    var page_margins = print_settings.pageMargins;
    page_margins.setB(0.75);
    page_margins.setL(0.7);
    page_margins.setR(0.7);
    page_margins.setT(0.75);
    page_margins.setHeader(0.3);
    page_margins.setFooter(0.3);
    return chart_space;
}


    function CreateSurfaceChart(chartSeries, bUseCache, oOptions, bContour, bWireFrame){
        var asc_series = chartSeries.series;
        var oChartSpace = new AscFormat.CChartSpace();
        oChartSpace.setDate1904(false);
        oChartSpace.setLang("en-Us");
        oChartSpace.setRoundedCorners(false);
        oChartSpace.setStyle(2);
        oChartSpace.setChart(new AscFormat.CChart());
        var oChart = oChartSpace.chart;
        oChart.setAutoTitleDeleted(false);
        var oView3D = new AscFormat.CView3d();
        oChart.setView3D(oView3D);
        if(!bContour){
            oView3D.setRotX(15);
            oView3D.setRotY(20);
            oView3D.setRAngAx(false);
            oView3D.setPerspective(30);
        }
        else{
            oView3D.setRotX(90);
            oView3D.setRotY(0);
            oView3D.setRAngAx(false);
            oView3D.setPerspective(0);
        }
        oChart.setFloor(new AscFormat.CChartWall());
        oChart.floor.setThickness(0);
        oChart.setSideWall(new AscFormat.CChartWall());
        oChart.sideWall.setThickness(0);
        oChart.setBackWall(new AscFormat.CChartWall());
        oChart.backWall.setThickness(0);
        oChart.setPlotArea(new AscFormat.CPlotArea());
        oChart.plotArea.setLayout(new AscFormat.CLayout());
        var oSurfaceChart;
        //if(bContour){
        oSurfaceChart = new AscFormat.CSurfaceChart();
        //}
        if(bWireFrame){
            oSurfaceChart.setWireframe(true);
        }
        else{
            oSurfaceChart.setWireframe(false);
        }

        oChart.plotArea.addChart(oSurfaceChart);
        var bInCols;
        if(isRealObject(oOptions))
        {
            bInCols = oOptions.inColumns === true;
        }
        else
        {
            bInCols = false;
        }

        var parsedHeaders = chartSeries.parsedHeaders;
        for(var i = 0; i < asc_series.length; ++i)
        {
            var series = new AscFormat.CSurfaceSeries();
            series.setIdx(i);
            series.setOrder(i);
            series.setVal(new AscFormat.CYVal());
            FillValNum(series.val, asc_series[i].Val, bUseCache);
            if(parsedHeaders.bTop && !bInCols || bInCols && parsedHeaders.bLeft)
            {
                series.setCat(new AscFormat.CCat());
                FillCatStr(series.cat, asc_series[i].Cat, bUseCache);
            }
            if((parsedHeaders.bLeft && !bInCols || bInCols && parsedHeaders.bTop) && asc_series[i].TxCache && typeof asc_series[i].TxCache.Formula === "string" && asc_series[i].TxCache.Formula.length > 0)
            {
                FillSeriesTx(series, asc_series[i].TxCache, bUseCache);
            }
            oSurfaceChart.addSer(series);
        }
        var oCatAx = new AscFormat.CCatAx();
        oCatAx.setAxId(++AscFormat.Ax_Counter.GLOBAL_AX_ID_COUNTER);
        var oScaling = new AscFormat.CScaling();
        oScaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
        oCatAx.setScaling(oScaling);
        oCatAx.setDelete(false);
        oCatAx.setAxPos(AscFormat.AX_POS_B);
        oCatAx.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
        oCatAx.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
        oCatAx.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
        oCatAx.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
        oCatAx.setAuto(true);
        oCatAx.setLblAlgn(AscFormat.LBL_ALG_CTR);
        oCatAx.setLblOffset(100);
        oCatAx.setNoMultiLvlLbl(false);
        var oValAx = new AscFormat.CValAx();
        oValAx.setAxId(++AscFormat.Ax_Counter.GLOBAL_AX_ID_COUNTER);
        var oValScaling = new AscFormat.CScaling();
        oValScaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
        oValAx.setScaling(oValScaling);
        oValAx.setDelete(false);
        oValAx.setAxPos(AscFormat.AX_POS_L);
        oValAx.setMajorGridlines(new AscFormat.CSpPr());
        var oNumFmt = new AscFormat.CNumFmt();
        oNumFmt.setFormatCode(GetNumFormatFromSeries(asc_series));
        oNumFmt.setSourceLinked(true);
        oValAx.setNumFmt(oNumFmt);
        oValAx.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
        oValAx.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
        oValAx.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
        oCatAx.setCrossAx(oValAx);
        oValAx.setCrossAx(oCatAx);
        oValAx.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
        oValAx.setCrossBetween(AscFormat.CROSS_BETWEEN_MID_CAT);
        var oSerAx =  new AscFormat.CSerAx();
        oSerAx.setAxId(++AscFormat.Ax_Counter.GLOBAL_AX_ID_COUNTER);
        var oSerScaling = new AscFormat.CScaling();
        oSerScaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
        oSerAx.setScaling(oSerScaling);
        oSerAx.setDelete(false);
        oSerAx.setAxPos(AscFormat.AX_POS_B);
        oSerAx.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
        oSerAx.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
        oSerAx.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
        oSerAx.setCrossAx(oCatAx);
        oSerAx.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
        oChart.plotArea.addAxis(oCatAx);
        oChart.plotArea.addAxis(oValAx);
        oChart.plotArea.addAxis(oSerAx);
        oSurfaceChart.addAxId(oCatAx);
        oSurfaceChart.addAxId(oValAx);
        oSurfaceChart.addAxId(oSerAx);
        var oLegend = new AscFormat.CLegend();
        oLegend.setLegendPos(c_oAscChartLegendShowSettings.right);
        oLegend.setLayout(new AscFormat.CLayout());
        oLegend.setOverlay(false);
        //oLegend.setTxPr(AscFormat.CreateTextBodyFromString("", oDrawingDocument, oElement));
        oChart.setLegend(oLegend);
        oChart.setPlotVisOnly(true);
        oChart.setDispBlanksAs(DISP_BLANKS_AS_ZERO);
        oChart.setShowDLblsOverMax(false);
        var oPrintSettings = new AscFormat.CPrintSettings();
        oPrintSettings.setHeaderFooter(new AscFormat.CHeaderFooterChart());
        var oPageMargins = new AscFormat.CPageMarginsChart();
        oPageMargins.setB(0.75);
        oPageMargins.setL(0.7);
        oPageMargins.setR(0.7);
        oPageMargins.setT(0.75);
        oPageMargins.setHeader(0.3);
        oPageMargins.setFooter(0.3);
        oPrintSettings.setPageMargins(oPageMargins);
        oPrintSettings.setPageSetup(new AscFormat.CPageSetup());
        oChartSpace.setPrintSettings(oPrintSettings);
        return oChartSpace;
    }


function CreateDefaultAxises(valFormatCode)
{
    var cat_ax = new AscFormat.CCatAx();
    var val_ax = new AscFormat.CValAx();
    cat_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);


    cat_ax.setScaling(new AscFormat.CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AscFormat.AX_POS_B);
    cat_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    cat_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    cat_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    cat_ax.setAuto(true);
    cat_ax.setLblAlgn(AscFormat.LBL_ALG_CTR);
    cat_ax.setLblOffset(100);
    cat_ax.setNoMultiLvlLbl(false);
    var scaling = cat_ax.scaling;
    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    val_ax.setScaling(new AscFormat.CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AscFormat.AX_POS_L);
    val_ax.setMajorGridlines(new AscFormat.CSpPr());
    val_ax.setNumFmt(new AscFormat.CNumFmt());
    var num_fmt = val_ax.numFmt;
    num_fmt.setFormatCode(valFormatCode);
    num_fmt.setSourceLinked(true);
    val_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    val_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    val_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(AscFormat.CROSS_BETWEEN_BETWEEN);
    scaling = val_ax.scaling;
    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    //cat_ax.setTitle(new CTitle());
    //val_ax.setTitle(new CTitle());
   // var title = val_ax.title;
   // title.setTxPr(new CTextBody());
   // title.txPr.setBodyPr(new AscFormat.CBodyPr());
   // title.txPr.bodyPr.setVert(AscFormat.nVertTTvert);
    return {valAx: val_ax, catAx: cat_ax};
}

function CreateScatterAxis()
{
    var cat_ax = new AscFormat.CValAx();
    var val_ax = new AscFormat.CValAx();
    cat_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    val_ax.setAxId(++Ax_Counter.GLOBAL_AX_ID_COUNTER);
    cat_ax.setCrossAx(val_ax);
    val_ax.setCrossAx(cat_ax);

    cat_ax.setScaling(new AscFormat.CScaling());
    cat_ax.setDelete(false);
    cat_ax.setAxPos(AscFormat.AX_POS_B);
    cat_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    cat_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    cat_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    cat_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    cat_ax.scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    val_ax.setScaling(new AscFormat.CScaling());
    val_ax.setDelete(false);
    val_ax.setAxPos(AscFormat.AX_POS_L);
    val_ax.setMajorGridlines(new AscFormat.CSpPr());
    val_ax.setNumFmt(new AscFormat.CNumFmt());
    val_ax.setMajorTickMark(c_oAscTickMark.TICK_MARK_OUT);
    val_ax.setMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
    val_ax.setTickLblPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);
    val_ax.setCrosses(AscFormat.CROSSES_AUTO_ZERO);
    val_ax.setCrossBetween(AscFormat.CROSS_BETWEEN_BETWEEN);
    var scaling = val_ax.scaling;
    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
    var num_fmt = val_ax.numFmt;
    var format_code = "General";
    num_fmt.setFormatCode(format_code);
    num_fmt.setSourceLinked(true);
    return {valAx: val_ax, catAx: cat_ax};
}


function parseSeriesHeaders (ws, rangeBBox) {
	var cntLeft = 0, cntTop = 0;
	var headers = { bLeft: false, bTop: false };
	var i, cell, value, numFormatType, j;

    var bLeftOnlyDateTime = true, bTopOnlyDateTime = true;
    var nStartIndex;
	if (rangeBBox) {
		if (rangeBBox.c2 - rangeBBox.c1 > 0) {
			for (i = rangeBBox.r1 + 1; i <= rangeBBox.r2; i++) {
				cell = ws.getCell3(i, rangeBBox.c1);
				value = cell.getValue();
                numFormatType = cell.getNumFormatType();
                if(!AscCommon.isNumber(value) && (value != ""))
                {
                    bLeftOnlyDateTime = false;
                    headers.bLeft = true;
                }
                else if(numFormatType === c_oAscNumFormatType.Time || numFormatType === c_oAscNumFormatType.Date )
                {
                    headers.bLeft = true;
                }
			}
		}

		if (rangeBBox.r2 - rangeBBox.r1 > 0) {
			for (i = rangeBBox.c1 + 1; i <= rangeBBox.c2; i++) {

				cell = ws.getCell3(rangeBBox.r1, i);
				value = cell.getValue();
                numFormatType= cell.getNumFormatType();
                if(!AscCommon.isNumber(value) && value != "")
                {
                    bTopOnlyDateTime = false;
                    headers.bTop = true;
                }
                else if(numFormatType === c_oAscNumFormatType.Time || numFormatType === c_oAscNumFormatType.Date )
                {
                    headers.bTop = true;
                }
			}
		}
        if(headers.bTop || headers.bLeft)
        {
            var nRowStart = headers.bTop ? rangeBBox.r1 + 1 : rangeBBox.r1, nColStart = headers.bLeft ? rangeBBox.c1 + 1 : rangeBBox.c1;
            for(i = nRowStart; i <= rangeBBox.r2; ++i)
            {
                for(j = nColStart; j <= rangeBBox.c2; ++j)
                {
                    cell = ws.getCell3(i, j);
                    value = cell.getValue();
                    numFormatType= cell.getNumFormatType();
                    if (numFormatType !== c_oAscNumFormatType.Time && numFormatType !== c_oAscNumFormatType.Date && value !== "")
                    {
                        break;
                    }
                }
                if(j <= rangeBBox.c2)
                {
                    break;
                }
            }
            if(i === rangeBBox.r2 + 1)
            {
                if(headers.bLeft && bLeftOnlyDateTime)
                {
                    headers.bLeft = false;
                }
                if(headers.bTop && bTopOnlyDateTime)
                {
                    headers.bTop = false;
                }
            }
        }
	}
	else
		headers = { bLeft: true, bTop: true };

	return headers;
}

function getChartSeries (worksheet, options, catHeadersBBox, serHeadersBBox) {
	var api = window["Asc"]["editor"];
	var ws = null;
	var range = null;
	var result = parserHelp.parse3DRef(options.range);
	if (null !== result) {
		ws = worksheet.workbook.getWorksheetByName(result.sheet);
		if (ws)
			range = ws.getRange2(result.range);
	}

	if (null === range)
		return null;

	var bbox = range.getBBox0();
	var nameIndex = 1;

	var i, series = [];

	function getNumCache(c1, c2, r1, r2) {

		// (c1 == c2) || (r1 == r2)
		var cache = [], cell, item;

		if ( c1 == c2 ) {		// vertical cache
			for (var row = r1; row <= r2; row++) {
				cell = ws.getCell3(row, c1);

				item = {};
				item.numFormatStr = cell.getNumFormatStr();
				item.isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
				item.val = cell.getValue();
				item.isHidden = ws.getColHidden(c1) || ws.getRowHidden(row);
				cache.push(item);
			}
		} else /*r1 == r2*/ {		// horizontal cache
			for (var col = c1; col <= c2; col++) {
				cell = ws.getCell3(r1, col, 0);
				item = {};
				item.numFormatStr = cell.getNumFormatStr();
				item.isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
				item.val = cell.getValue();
				item.isHidden = ws.getColHidden || ws.getRowHidden(r1);
				cache.push(item);
			}
		}

		return cache;
	}

	var parsedHeaders = parseSeriesHeaders(ws, bbox);

    var data_bbox = {r1: bbox.r1, r2: bbox.r2, c1: bbox.c1, c2: bbox.c2};
    if(parsedHeaders.bTop)
    {
        ++data_bbox.r1;
    }
    else
    {
        if(!options.getInColumns())
        {
            if(catHeadersBBox && catHeadersBBox.c1 === data_bbox.c1 && catHeadersBBox.c2 === data_bbox.c2 && catHeadersBBox.r1 === catHeadersBBox.r2 && catHeadersBBox.r1 === data_bbox.r1)
            {
                ++data_bbox.r1;
            }
        }
        else
        {
            if(serHeadersBBox && serHeadersBBox.c1 === data_bbox.c1 && serHeadersBBox.c2 === data_bbox.c2 && serHeadersBBox.r1 === serHeadersBBox.r2 && serHeadersBBox.r1 === data_bbox.r1)
            {
                ++data_bbox.r1;
            }
        }
    }

    if(parsedHeaders.bLeft)
    {
        ++data_bbox.c1;
    }
    else
    {
        if(!options.getInColumns())
        {
            if(serHeadersBBox && serHeadersBBox.c1 === serHeadersBBox.c2 && serHeadersBBox.r1 === data_bbox.r1 && serHeadersBBox.r2 === data_bbox.r2 && serHeadersBBox.c1 === data_bbox.c1)
            {
                ++data_bbox.c1;
            }
        }
        else
        {
            if(catHeadersBBox && catHeadersBBox.c1 === catHeadersBBox.c2 && catHeadersBBox.r1 === data_bbox.r1 && catHeadersBBox.r2 === data_bbox.r2 && catHeadersBBox.c1 === data_bbox.c1)
            {
                ++data_bbox.c1;
            }
        }
    }

	var bIsScatter = (Asc.c_oAscChartTypeSettings.scatter <= options.type && options.type <= Asc.c_oAscChartTypeSettings.scatterSmoothMarker);
	var top_header_bbox, left_header_bbox, ser, startCell, endCell, formulaCell, seriaName, start, end, formula, numCache, sStartCellId, sEndCellId;
	if (!options.getInColumns()) {
		if(parsedHeaders.bTop)
			top_header_bbox = {r1: bbox.r1, c1: data_bbox.c1, r2: bbox.r1, c2: data_bbox.c2};
		else if(catHeadersBBox && catHeadersBBox.c1 === data_bbox.c1 && catHeadersBBox.c2 === data_bbox.c2 && catHeadersBBox.r1 === catHeadersBBox.r2)
			top_header_bbox = {r1: catHeadersBBox.r1, c1: catHeadersBBox.c1, r2: catHeadersBBox.r1, c2:catHeadersBBox.c2};

		if(parsedHeaders.bLeft)
			left_header_bbox = {r1: data_bbox.r1, r2: data_bbox.r2, c1: bbox.c1, c2: bbox.c1};
		else if(serHeadersBBox && serHeadersBBox.c1 === serHeadersBBox.c2 && serHeadersBBox.r1 === data_bbox.r1 && serHeadersBBox.r2 === data_bbox.r2)
			left_header_bbox = {r1: serHeadersBBox.r1, c1: serHeadersBBox.c1, r2: serHeadersBBox.r1, c2: serHeadersBBox.c2};

		for (i = data_bbox.r1; i <= data_bbox.r2; ++i) {
			ser = new AscFormat.asc_CChartSeria();
			startCell = new CellAddress(i, data_bbox.c1, 0);
			endCell = new CellAddress(i, data_bbox.c2, 0);

			ser.isHidden = !!ws.getRowHidden(i);

			// Val
            sStartCellId = startCell.getIDAbsolute();
            sEndCellId = endCell.getIDAbsolute();
            ser.Val.Formula = parserHelp.get3DRef(ws.sName, sStartCellId === sEndCellId ?
                sStartCellId : sStartCellId + ':' + sEndCellId);
			ser.Val.NumCache = getNumCache(data_bbox.c1, data_bbox.c2, i, i);

			if(left_header_bbox)
			{
				formulaCell = new CellAddress( i, left_header_bbox.c1, 0 );
				ser.TxCache.Formula = parserHelp.get3DRef(ws.sName, formulaCell.getIDAbsolute());
			}
			// xVal

			if(top_header_bbox)
			{
				start = new CellAddress(top_header_bbox.r1, top_header_bbox.c1, 0);
				end = new CellAddress(top_header_bbox.r1, top_header_bbox.c2, 0);

				formula = parserHelp.get3DRef(ws.sName, start.getIDAbsolute() + ':' + end.getIDAbsolute());
				numCache = getNumCache(top_header_bbox.c1, top_header_bbox.c2, top_header_bbox.r1, top_header_bbox.r1 );

				if (bIsScatter)
				{
					ser.xVal.Formula = formula;
					ser.xVal.NumCache = numCache;
				}
				else
				{
					ser.Cat.Formula = formula;
					ser.Cat.NumCache = numCache;
				}
			}

			seriaName = left_header_bbox ? (ws.getCell3(i, left_header_bbox.c1).getValue()) : (api.chartTranslate.series + " " + nameIndex);
			ser.TxCache.Tx = seriaName;
			series.push(ser);
			nameIndex++;
		}
	} else {
		if(parsedHeaders.bTop)
			top_header_bbox = {r1: bbox.r1, c1: data_bbox.c1, r2: bbox.r1, c2: data_bbox.c2};
		else if(serHeadersBBox && serHeadersBBox.r1 === serHeadersBBox.r2 && serHeadersBBox.c1 === data_bbox.c1 && serHeadersBBox.c2 === data_bbox.c2)
			top_header_bbox = {r1: serHeadersBBox.r1, c1: serHeadersBBox.c1, r2: serHeadersBBox.r2, c2: serHeadersBBox.c2};

		if(parsedHeaders.bLeft)
			left_header_bbox = {r1: data_bbox.r1, c1: bbox.c1, r2: data_bbox.r2, c2: bbox.c1};
		else if(catHeadersBBox && catHeadersBBox.c1 === catHeadersBBox.c2 && catHeadersBBox.r1 === data_bbox.r1 && catHeadersBBox.r2 === data_bbox.r2)
			left_header_bbox = {r1: catHeadersBBox.r1, c1: catHeadersBBox.c1, r2: catHeadersBBox.r2, c2: catHeadersBBox.c2};


		for (i = data_bbox.c1; i <= data_bbox.c2; i++) {

			ser = new AscFormat.asc_CChartSeria();
			startCell = new CellAddress(data_bbox.r1, i, 0);
			endCell = new CellAddress(data_bbox.r2, i, 0);

			ser.isHidden = !!ws.getColHidden(i);

			// Val
            sStartCellId = startCell.getIDAbsolute();
            sEndCellId = endCell.getIDAbsolute();
            if (sStartCellId == sEndCellId)
                ser.Val.Formula =  parserHelp.get3DRef(ws.sName, sStartCellId);
            else
                ser.Val.Formula = parserHelp.get3DRef(ws.sName, sStartCellId + ':' + sEndCellId);
			ser.Val.NumCache = getNumCache(i, i, data_bbox.r1, bbox.r2);


			if ( left_header_bbox )
			{
				start = new CellAddress(left_header_bbox.r1, left_header_bbox.c1, 0);
				end = new CellAddress(left_header_bbox.r2, left_header_bbox.c1, 0);

				formula = parserHelp.get3DRef(ws.sName, start.getIDAbsolute() + ':' + end.getIDAbsolute());
				numCache = getNumCache( left_header_bbox.c1, left_header_bbox.c1, left_header_bbox.r1, left_header_bbox.r2 );

				if (bIsScatter) {
					ser.xVal.Formula = formula;
					ser.xVal.NumCache = numCache;
				}
				else {
					ser.Cat.Formula = formula;
					ser.Cat.NumCache = numCache;
				}
			}

			if (top_header_bbox)
			{
				formulaCell = new CellAddress( top_header_bbox.r1, i, 0 );
				ser.TxCache.Formula = parserHelp.get3DRef(ws.sName, formulaCell.getIDAbsolute());
			}

			seriaName = top_header_bbox ? (ws.getCell3(top_header_bbox.r1, i).getValue()) : (api.chartTranslate.series + " " + nameIndex);
			ser.TxCache.Tx = seriaName;
			series.push(ser);
			nameIndex++;
		}
	}

	return {series: series, parsedHeaders: parsedHeaders};
}

function checkSpPrRasterImages(spPr)
{
    if(spPr && spPr.Fill && spPr.Fill && spPr.Fill.fill && spPr.Fill.fill.type === Asc.c_oAscFill.FILL_TYPE_BLIP)
    {
        var copyBlipFill = spPr.Fill.createDuplicate();
        copyBlipFill.fill.setRasterImageId(spPr.Fill.fill.RasterImageId);
        spPr.setFill(copyBlipFill);
    }
}
function checkBlipFillRasterImages(sp)
{
    switch (sp.getObjectType())
    {
        case AscDFH.historyitem_type_Shape:
        {
            checkSpPrRasterImages(sp.spPr);
            break;
        }
        case AscDFH.historyitem_type_ImageShape:
        case AscDFH.historyitem_type_OleObject:
        {
            if(sp.blipFill)
            {
                var newBlipFill = sp.blipFill.createDuplicate();
                newBlipFill.setRasterImageId(sp.blipFill.RasterImageId);
                sp.setBlipFill(newBlipFill);
            }
            break;
        }
        case AscDFH.historyitem_type_ChartSpace:
        {
            checkSpPrRasterImages(sp.spPr);
            var chart = sp.chart;
            if(chart)
            {
                chart.backWall && checkSpPrRasterImages(chart.backWall.spPr);
                chart.floor && checkSpPrRasterImages(chart.floor.spPr);
                chart.legend && checkSpPrRasterImages(chart.legend.spPr);
                chart.sideWall && checkSpPrRasterImages(chart.sideWall.spPr);
                chart.title && checkSpPrRasterImages(chart.title.spPr);
                //plotArea
                var plot_area = sp.chart.plotArea;
                if(plot_area)
                {
                    checkSpPrRasterImages(plot_area.spPr);
                    for(var j = 0; j < plot_area.axId.length; ++j)
                    {
                        var axis = plot_area.axId[j];
                        if(axis)
                        {
                            checkSpPrRasterImages(axis.spPr);
                            axis.title && axis.title && checkSpPrRasterImages(axis.title.spPr);
                        }
                    }
                    for(j = 0; j < plot_area.charts.length; ++j)
                    {
                        plot_area.charts[j].checkSpPrRasterImages();
                    }
                }
            }
            break;
        }
        case AscDFH.historyitem_type_GroupShape:
        {
            for(var i = 0; i < sp.spTree.length; ++i)
            {
                checkBlipFillRasterImages(sp.spTree[i]);
            }
            break;
        }
        case AscDFH.historyitem_type_GraphicFrame:
        {
            break;
        }
    }
}
    
    function initStyleManager() {
        CHART_STYLE_MANAGER.init();
    }

    //--------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].BAR_SHAPE_CONE = BAR_SHAPE_CONE;
    window['AscFormat'].BAR_SHAPE_CONETOMAX = BAR_SHAPE_CONETOMAX;
    window['AscFormat'].BAR_SHAPE_BOX = BAR_SHAPE_BOX;
    window['AscFormat'].BAR_SHAPE_CYLINDER = BAR_SHAPE_CYLINDER;
    window['AscFormat'].BAR_SHAPE_PYRAMID = BAR_SHAPE_PYRAMID;
    window['AscFormat'].BAR_SHAPE_PYRAMIDTOMAX = BAR_SHAPE_PYRAMIDTOMAX;
    window['AscFormat'].DISP_BLANKS_AS_GAP = DISP_BLANKS_AS_GAP;
    window['AscFormat'].DISP_BLANKS_AS_SPAN = DISP_BLANKS_AS_SPAN;
    window['AscFormat'].DISP_BLANKS_AS_ZERO = DISP_BLANKS_AS_ZERO;
    window['AscFormat'].checkBlackUnifill = checkBlackUnifill;
    window['AscFormat'].BBoxInfo = BBoxInfo;
    window['AscFormat'].CreateUnifillSolidFillSchemeColorByIndex = CreateUnifillSolidFillSchemeColorByIndex;
    window['AscFormat'].CreateUniFillSchemeColorWidthTint = CreateUniFillSchemeColorWidthTint;
    window['AscFormat'].G_O_VISITED_HLINK_COLOR = G_O_VISITED_HLINK_COLOR;
    window['AscFormat'].G_O_NO_ACTIVE_COMMENT_BRUSH = G_O_NO_ACTIVE_COMMENT_BRUSH;
    window['AscFormat'].G_O_ACTIVE_COMMENT_BRUSH = G_O_ACTIVE_COMMENT_BRUSH;
    window['AscFormat'].CChartSpace = CChartSpace;
    window['AscFormat'].getPtsFromSeries = getPtsFromSeries;
    window['AscFormat'].CreateUnfilFromRGB = CreateUnfilFromRGB;
    window['AscFormat'].CreateUniFillSolidFillWidthTintOrShade = CreateUniFillSolidFillWidthTintOrShade;
    window['AscFormat'].CreateUnifillSolidFillSchemeColor = CreateUnifillSolidFillSchemeColor;
    window['AscFormat'].CreateNoFillLine = CreateNoFillLine;
    window['AscFormat'].CreateNoFillUniFill = CreateNoFillUniFill;
    window['AscFormat'].CExternalData = CExternalData;
    window['AscFormat'].CPivotSource = CPivotSource;
    window['AscFormat'].CProtection = CProtection;
    window['AscFormat'].CPrintSettings = CPrintSettings;
    window['AscFormat'].CHeaderFooterChart = CHeaderFooterChart;
    window['AscFormat'].CPageMarginsChart = CPageMarginsChart;
    window['AscFormat'].CPageSetup = CPageSetup;
    window['AscFormat'].CreateView3d = CreateView3d;
    window['AscFormat'].CreateLineChart = CreateLineChart;
    window['AscFormat'].CreateBarChart = CreateBarChart;
    window['AscFormat'].CreateHBarChart = CreateHBarChart;
    window['AscFormat'].CreateAreaChart = CreateAreaChart;
    window['AscFormat'].CreatePieChart = CreatePieChart;
    window['AscFormat'].CreateScatterChart = CreateScatterChart;
    window['AscFormat'].CreateStockChart = CreateStockChart;
    window['AscFormat'].CreateDefaultAxises = CreateDefaultAxises;
    window['AscFormat'].CreateScatterAxis = CreateScatterAxis;
    window['AscFormat'].getChartSeries = getChartSeries;
    window['AscFormat'].checkSpPrRasterImages = checkSpPrRasterImages;
    window['AscFormat'].checkBlipFillRasterImages = checkBlipFillRasterImages;

    window['AscFormat'].PAGE_SETUP_ORIENTATION_DEFAULT = 0;
    window['AscFormat'].PAGE_SETUP_ORIENTATION_LANDSCAPE = 1;
    window['AscFormat'].PAGE_SETUP_ORIENTATION_PORTRAIT = 2;

    window['AscFormat'].initStyleManager = initStyleManager;
    window['AscFormat'].CHART_STYLE_MANAGER = CHART_STYLE_MANAGER;
    window['AscFormat'].CheckParagraphTextPr = CheckParagraphTextPr;
    window['AscFormat'].CheckObjectTextPr = CheckObjectTextPr;
    window['AscFormat'].CreateColorMapByIndex = CreateColorMapByIndex;
    window['AscFormat'].getArrayFillsFromBase = getArrayFillsFromBase;
    window['AscFormat'].getMaxIdx = getMaxIdx;
})(window);
