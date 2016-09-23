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

(function(window, undefined){

// Import
var CShape = AscFormat.CShape;
var CChartSpace = AscFormat.CChartSpace;

    // ToDo перенести в один файл!
function getChartTranslateManager()
{
    return window["Asc"]["editor"].chartTranslate;
}


CChartSpace.prototype.addToDrawingObjects =  CShape.prototype.addToDrawingObjects;
CChartSpace.prototype.setDrawingObjects = CShape.prototype.setDrawingObjects;
CChartSpace.prototype.setDrawingBase = CShape.prototype.setDrawingBase;
CChartSpace.prototype.deleteDrawingBase = CShape.prototype.deleteDrawingBase;
CChartSpace.prototype.getDrawingObjectsController = CShape.prototype.getDrawingObjectsController;
CChartSpace.prototype.Is_UseInDocument = CShape.prototype.Is_UseInDocument;

CChartSpace.prototype.recalculateTransform = function()
{
    CShape.prototype.recalculateTransform.call(this);
    this.localTransform.Reset();
};
CChartSpace.prototype.recalcText = function()
{
    this.recalcInfo.recalculateAxisLabels = true;
    this.recalcTitles2();
    this.handleUpdateInternalChart();
};

CChartSpace.prototype.recalculateBounds = CShape.prototype.recalculateBounds;
CChartSpace.prototype.deselect = CShape.prototype.deselect;
CChartSpace.prototype.hitToHandles = CShape.prototype.hitToHandles;
CChartSpace.prototype.hitInBoundingRect = CShape.prototype.hitInBoundingRect;
CChartSpace.prototype.getRotateAngle = CShape.prototype.getRotateAngle;
CChartSpace.prototype.getInvertTransform = CShape.prototype.getInvertTransform;
CChartSpace.prototype.hit = CShape.prototype.hit;
CChartSpace.prototype.hitInInnerArea = CShape.prototype.hitInInnerArea;
CChartSpace.prototype.hitInPath = CShape.prototype.hitInPath;
CChartSpace.prototype.getNumByCardDirection = CShape.prototype.getNumByCardDirection;
CChartSpace.prototype.getCardDirectionByNum = CShape.prototype.getCardDirectionByNum;
CChartSpace.prototype.getResizeCoefficients = CShape.prototype.getResizeCoefficients;
CChartSpace.prototype.check_bounds = CShape.prototype.check_bounds;
CChartSpace.prototype.getFullFlipH = CShape.prototype.getFullFlipH;
CChartSpace.prototype.getFullFlipV = CShape.prototype.getFullFlipV;
CChartSpace.prototype.setWorksheet = CShape.prototype.setWorksheet;
CChartSpace.prototype.handleUpdateLn = function()
{
    this.recalcInfo.recalculatePenBrush = true;
    this.addToRecalculate();
};
CChartSpace.prototype.setRecalculateInfo = function()
{
    this.recalcInfo =
    {
        recalcTitle: null,
        bRecalculatedTitle: false,
        recalculateTransform: true,
        recalculateBounds:    true,
        recalculateChart:     true,
        recalculateBaseColors: true,
        recalculateSeriesColors: true,
        recalculateMarkers: true,
        recalculateGridLines: true,
        recalculateDLbls: true,
        recalculateAxisLabels: true,
        dataLbls:[],
        axisLabels: [],
        recalculateAxisVal: true,
        recalculateAxisTickMark: true,
        recalculateBrush: true,
        recalculatePen: true,
        recalculatePlotAreaBrush: true,
        recalculatePlotAreaPen: true,
        recalculateHiLowLines: true,
        recalculateUpDownBars: true,
        recalculateLegend: true,
        recalculateReferences: true,
        recalculateBBox: true,
        recalculateFormulas: true,
        recalculatePenBrush: true,
        recalculateTextPr : true,
        recalculateBBoxRange: true
    };
    this.baseColors = [];
    this.chartObj = null;
    this.rectGeometry = AscFormat.ExecuteNoHistory(function(){return  AscFormat.CreateGeometry("rect");},  this, []);
    this.lockType = AscCommon.c_oAscLockTypes.kLockTypeNone;
};
CChartSpace.prototype.recalcTransform = function()
{
    this.recalcInfo.recalculateTransform = true;
};
CChartSpace.prototype.recalcBounds = function()
{
    this.recalcInfo.recalculateBounds = true;
};
CChartSpace.prototype.recalcChart = function()
{
    this.recalcInfo.recalculateChart = true;
};
CChartSpace.prototype.recalcBaseColors = function()
{
    this.recalcInfo.recalculateBaseColors = true;
};
CChartSpace.prototype.recalcSeriesColors = function()
{
    this.recalcInfo.recalculateSeriesColors = true;
};

CChartSpace.prototype.recalcDLbls = function()
{
    this.recalcInfo.recalculateDLbls = true;
};

CChartSpace.prototype.addToRecalculate = CShape.prototype.addToRecalculate;

CChartSpace.prototype.handleUpdatePosition = function()
{
    this.recalcTransform();
    this.recalcBounds();
  //  this.recalcDLbls();
    //this.setRecalculateInfo();
    this.addToRecalculate();
    //delete this.fromSerialize;
};
CChartSpace.prototype.handleUpdateExtents = function()
{
    this.recalcChart();
    this.recalcBounds();
    this.recalcTransform();
    this.recalcTitles();
    this.handleUpdateInternalChart();
    //delete this.fromSerialize;
};
CChartSpace.prototype.handleUpdateFlip = function()
{
    this.recalcTransform();
    //this.setRecalculateInfo();
    this.addToRecalculate();
    //delete this.fromSerialize;
};
CChartSpace.prototype.handleUpdateChart = function()
{
    this.recalcChart();
    this.setRecalculateInfo();
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateStyle = function()
{
    this.recalcInfo.recalculateSeriesColors = true;
    this.recalcInfo.recalculateLegend = true;
    this.recalcInfo.recalculatePlotAreaBrush = true;
    this.recalcInfo.recalculatePlotAreaPen = true;
    this.recalcInfo.recalculateBrush = true;
    this.recalcInfo.recalculatePen = true;
    this.recalcInfo.recalculateHiLowLines = true;
    this.recalcInfo.recalculateUpDownBars = true;
    this.handleTitlesAfterChangeTheme();
    this.recalcInfo.recalculateAxisLabels = true;
    this.recalcInfo.recalculateAxisVal = true;
    this.addToRecalculate();
};

CChartSpace.prototype.handleUpdateFill = function()
{
    this.recalcInfo.recalculatePenBrush = true;
    this.recalcInfo.recalculateBrush = true;
    this.recalcInfo.recalculateChart = true;
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateLn = function()
{
    this.recalcInfo.recalculatePenBrush = true;
    this.recalcInfo.recalculatePen = true;
    this.recalcInfo.recalculateChart = true;
    this.addToRecalculate();
};
CChartSpace.prototype.canGroup = CShape.prototype.canGroup;
CChartSpace.prototype.convertPixToMM = CShape.prototype.convertPixToMM;
CChartSpace.prototype.getCanvasContext = CShape.prototype.getCanvasContext;
CChartSpace.prototype.getHierarchy = CShape.prototype.getHierarchy;
CChartSpace.prototype.getParentObjects = function()
{
    var parents = { slide: null, layout: null, master: null, theme: this.themeOverride ? this.themeOverride : window["Asc"]["editor"].wbModel.theme };
    if(this.clrMapOvr)
    {
        parents.slide = {clrMap: this.clrMapOvr};
    }
    return parents;
};
CChartSpace.prototype.recalculateTransform = CShape.prototype.recalculateTransform;
CChartSpace.prototype.recalculateChart = function()
{
    if(this.chartObj == null)
        this.chartObj =  new AscFormat.CChartsDrawer();
    this.chartObj.reCalculate(this);
};
CChartSpace.prototype.canResize = CShape.prototype.canResize;
CChartSpace.prototype.canMove = CShape.prototype.canMove;
CChartSpace.prototype.canRotate = function()
{
    return false;
};


CChartSpace.prototype.createResizeTrack = CShape.prototype.createResizeTrack;
CChartSpace.prototype.createMoveTrack = CShape.prototype.createMoveTrack;
CChartSpace.prototype.getAspect = CShape.prototype.getAspect;
CChartSpace.prototype.getRectBounds = CShape.prototype.getRectBounds;

CChartSpace.prototype.recalculateBounds = function()
{
    var transform = this.transform;
    var a_x = [];
    var a_y = [];
    a_x.push(transform.TransformPointX(0, 0));
    a_y.push(transform.TransformPointY(0, 0));
    a_x.push(transform.TransformPointX(this.extX, 0));
    a_y.push(transform.TransformPointY(this.extX, 0));
    a_x.push(transform.TransformPointX(this.extX, this.extY));
    a_y.push(transform.TransformPointY(this.extX, this.extY));
    a_x.push(transform.TransformPointX(0, this.extY));
    a_y.push(transform.TransformPointY(0, this.extY));
    this.bounds.l = Math.min.apply(Math, a_x);
    this.bounds.t = Math.min.apply(Math, a_y);
    this.bounds.r = Math.max.apply(Math, a_x);
    this.bounds.b = Math.max.apply(Math, a_y);
    this.bounds.w = this.bounds.r - this.bounds.l;
    this.bounds.h = this.bounds.b - this.bounds.t;
    this.bounds.x = this.bounds.l;
    this.bounds.y = this.bounds.t;
    if(this.drawingBase && !this.group)
    {
        this.drawingBase.checkBoundsFromTo();
    }
};




CChartSpace.prototype.recalculate = function()
{
    if(this.bDeleted)
        return;
    AscFormat.ExecuteNoHistory(function()
    {
        this.updateLinks();

        if(this.recalcInfo.recalcTitle)
        {
            this.recalculateChartTitleEditMode();
            this.recalcInfo.recalcTitle.updatePosition(this.transform.tx, this.transform.ty);
            this.recalcInfo.recalcTitle = null;
            this.recalcInfo.bRecalculatedTitle = true;
        }
        var b_transform = false;
        var bCheckLabels = false;
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalculateSnapArrays();
            this.rectGeometry.Recalculate(this.extX, this.extY);
            this.recalcInfo.recalculateTransform = false;
            b_transform = true;
        }
        if(this.recalcInfo.recalculateReferences)
        {
            this.recalculateReferences();
            this.recalcInfo.recalculateReferences = false;
        }
        if(this.recalcInfo.recalculateBBox)
        {
            this.recalculateBBox();
            this.recalcInfo.recalculateBBox = false;
        }
        if(this.recalcInfo.recalculateBaseColors)
        {
            this.recalculateBaseColors();
            this.recalcInfo.recalculateBaseColors = false;
        }
        if(this.recalcInfo.recalculateMarkers)
        {
            this.recalculateMarkers();
            this.recalcInfo.recalculateMarkers = false;
        }
        if(this.recalcInfo.recalculateSeriesColors)
        {
            this.recalculateSeriesColors();
            this.recalcInfo.recalculateSeriesColors = false;
        }
        if(this.recalcInfo.recalculateGridLines)
        {
            this.recalculateGridLines();
            this.recalcInfo.recalculateGridLines = false;
        }
        if(this.recalcInfo.recalculateAxisTickMark)
        {
            this.recalculateAxisTickMark();
            this.recalcInfo.recalculateAxisTickMark = false;
        }
        if(this.recalcInfo.recalculateDLbls)
        {
            this.recalculateDLbls();
            this.recalcInfo.recalculateDLbls = false;
        }

        if(this.recalcInfo.recalculateBrush)
        {
            this.recalculateChartBrush();
            this.recalcInfo.recalculateBrush = false;
        }

        if(this.recalcInfo.recalculatePen)
        {
            this.recalculateChartPen();
            this.recalcInfo.recalculatePen = false;
        }

        if(this.recalcInfo.recalculateHiLowLines)
        {
            this.recalculateHiLowLines();
            this.recalcInfo.recalculateHiLowLines = false;
        }
        if(this.recalcInfo.recalculatePlotAreaBrush)
        {
            this.recalculatePlotAreaChartBrush();
            this.recalculateWalls();
            this.recalcInfo.recalculatePlotAreaBrush = false;
        }
        if(this.recalcInfo.recalculatePlotAreaPen)
        {
            this.recalculatePlotAreaChartPen();
            this.recalcInfo.recalculatePlotAreaPen = false;
        }
        if(this.recalcInfo.recalculateUpDownBars)
        {
            this.recalculateUpDownBars();
            this.recalcInfo.recalculateUpDownBars = false;
        }


        var b_recalc_legend = false;
        if(this.recalcInfo.recalculateLegend)
        {
            this.recalculateLegend();
            this.recalcInfo.recalculateLegend = false;
            b_recalc_legend = true;
        }

        var b_recalc_labels = false;
        if(this.recalcInfo.recalculateAxisLabels)
        {
            this.recalculateAxisLabels();
            this.recalcInfo.recalculateAxisLabels = false;
            b_recalc_labels = true;
        }

        if(this.recalcInfo.recalculateAxisVal)
        {
            this.recalculateAxis();
            this.recalcInfo.recalculateAxisVal = false;
            bCheckLabels = true;
        }



        if(this.recalcInfo.recalculatePenBrush)
        {
            this.recalculatePenBrush();
            this.recalcInfo.recalculatePenBrush = false;
        }

        if(this.recalcInfo.recalculateChart)
        {
            this.recalculateChart();
            this.recalcInfo.recalculateChart = false;
            if(bCheckLabels && this.chartObj.nDimensionCount === 3)
            {
                this.checkAxisLabelsTransform();
            }
        }


        this.calculateLabelsPositions(b_recalc_labels, b_recalc_legend);

        if(this.recalcInfo.recalculateBounds)
        {
            this.recalculateBounds();
            this.recalcInfo.recalculateBounds = false;
        }

        if(this.recalcInfo.recalculateTextPr)
        {
            this.recalculateTextPr();
            this.recalcInfo.recalculateTextPr = false;
        }
       // if(b_transform)
        {
            this.updateChildLabelsTransform(this.transform.tx, this.transform.ty);
        }
        this.recalcInfo.dataLbls.length = 0;
        this.recalcInfo.axisLabels.length = 0;
        this.bNeedUpdatePosition = true;

    }, this, []);
};



CChartSpace.prototype.deselect = CShape.prototype.deselect;
CChartSpace.prototype.getDrawingDocument = CShape.prototype.getDrawingDocument;
CChartSpace.prototype.recalculateLocalTransform = CShape.prototype.recalculateLocalTransform;

CChartSpace.prototype.Get_Theme = CShape.prototype.Get_Theme;
CChartSpace.prototype.Get_ColorMap = CShape.prototype.Get_ColorMap;

    //----------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].getChartTranslateManager = getChartTranslateManager;
})(window);
