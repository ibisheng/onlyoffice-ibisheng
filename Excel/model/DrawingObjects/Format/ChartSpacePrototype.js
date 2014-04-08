"use strict";

CChartSpace.prototype.addToDrawingObjects =  CShape.prototype.addToDrawingObjects;
CChartSpace.prototype.setDrawingObjects = CShape.prototype.setDrawingObjects;
CChartSpace.prototype.setDrawingBase = CShape.prototype.setDrawingBase;
CChartSpace.prototype.deleteDrawingBase = CShape.prototype.deleteDrawingBase;

CChartSpace.prototype.recalculateTransform = CShape.prototype.recalculateTransform;
CChartSpace.prototype.recalculateBounds = CShape.prototype.recalculateBounds;
CChartSpace.prototype.deselect = CShape.prototype.deselect;
CChartSpace.prototype.hitToHandles = CShape.prototype.hitToHandles;
CChartSpace.prototype.hitInBoundingRect = CShape.prototype.hitInBoundingRect;
CChartSpace.prototype.getRotateAngle = CShape.prototype.getRotateAngle;
CChartSpace.prototype.getInvertTransform = CShape.prototype.getInvertTransform;
CChartSpace.prototype.hit = CShape.prototype.hit;
CChartSpace.prototype.hitInInnerArea = CShape.prototype.hitInInnerArea;
CChartSpace.prototype.hitInPath = CShape.prototype.hitInPath;
CChartSpace.prototype.hitInTextRect = CShape.prototype.hitInTextRect;
CChartSpace.prototype.getNumByCardDirection = CShape.prototype.getNumByCardDirection;
CChartSpace.prototype.getCardDirectionByNum = CShape.prototype.getCardDirectionByNum;
CChartSpace.prototype.getResizeCoefficients = CShape.prototype.getResizeCoefficients;
CChartSpace.prototype.check_bounds = CShape.prototype.check_bounds;
CChartSpace.prototype.normalize = CShape.prototype.normalize;
CChartSpace.prototype.getFullFlipH = CShape.prototype.getFullFlipH;
CChartSpace.prototype.getFullFlipV = CShape.prototype.getFullFlipV;

CChartSpace.prototype.setRecalculateInfo = function()
{
    this.recalcInfo =
    {
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
        recalculateLegend: true
    };
    this.baseColors = [];
    this.bounds = {l: 0, t: 0, r: 0, b:0, w: 0, h:0};
    this.chartObj = null;
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
    this.recalcDLbls();
    this.setRecalculateInfo();
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateExtents = function()
{
    this.recalcChart();
    this.recalcBounds();
    this.recalcDLbls();
    this.setRecalculateInfo();
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateFlip = function()
{
    this.recalcTransform();
    this.setRecalculateInfo();
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateChart = function()
{
    this.recalcChart();
    this.setRecalculateInfo();
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateStyle = function()
{
    this.setRecalculateInfo();
    this.addToRecalculate();
};
CChartSpace.prototype.canGroup = CShape.prototype.canGroup;
CChartSpace.prototype.convertPixToMM = CShape.prototype.convertPixToMM;
CChartSpace.prototype.getCanvasContext = CShape.prototype.getCanvasContext;
CChartSpace.prototype.getHierarchy = CShape.prototype.getHierarchy;
CChartSpace.prototype.getParentObjects = CShape.prototype.getParentObjects;
CChartSpace.prototype.recalculateTransform = CShape.prototype.recalculateTransform;
CChartSpace.prototype.recalculateChart = function()
{
    if(this.chartObj == null)
        this.chartObj =  new CChartsDrawer();
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
};

CChartSpace.prototype.recalculate = function()
{
    ExecuteNoHistory(function()
    {
        this.updateLinks();

        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        if(this.recalcInfo.recalculateBounds)
        {
            this.recalculateBounds();
            this.recalcInfo.recalculateBounds = false;
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
            this.recalcInfo.recalculateAxisTickMark = true;
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

        if(this.recalcInfo.recalculateLegend)
        {
            this.recalculateLegend();
            //this.recalcInfo.recalculateLegend = false;
        }

        if(this.recalcInfo.recalculateAxisLabels)
        {
            this.recalculateAxisLabels();
            this.recalcInfo.recalculateAxisLabels = false;
        }



        if(this.recalcInfo.recalculateAxisVal)
        {
            this.recalculateAxis();
            //this.recalcInfo.recalculateAxisVal = false;
        }

        if(this.recalcInfo.recalculateChart)
        {
            this.recalculateChart();
            this.recalcInfo.recalculateChart = false;
        }

        for(var i = 0; i < this.recalcInfo.dataLbls.length; ++i)
        {
            if(this.recalcInfo.dataLbls[i].series && this.recalcInfo.dataLbls[i].pt)
            {
                var pos = this.chartObj.reCalculatePositionText("dlbl", this, this.recalcInfo.dataLbls[i].series.idx, this.recalcInfo.dataLbls[i].pt.idx);
                this.recalcInfo.dataLbls[i].setPosition(pos.x, pos.y);
            }
        }
        this.recalcInfo.dataLbls.length = 0;

        if(this.chart && this.chart.title)
        {
            var pos = this.chartObj.reCalculatePositionText("title", this, this.chart.title);
            this.chart.title.setPosition(pos.x, pos.y);
        }

        if(this.chart && this.chart.plotArea && this.chart.plotArea)
        {
            var hor_axis = this.chart.plotArea.getHorizontalAxis();
            if(hor_axis && hor_axis.title)
            {
                var old_cat_ax = this.chart.plotArea.catAx;
                this.chart.plotArea.catAx = hor_axis;
                var pos = this.chartObj.reCalculatePositionText("catAx", this, hor_axis.title);
                hor_axis.title.setPosition(pos.x, pos.y);

                this.chart.plotArea.catAx = old_cat_ax;
            }
            var vert_axis = this.chart.plotArea.getVerticalAxis();
            if(vert_axis && vert_axis.title)
            {
                var old_val_ax = this.chart.plotArea.valAx;
                this.chart.plotArea.valAx = vert_axis;
                var pos = this.chartObj.reCalculatePositionText("valAx", this, vert_axis.title);
                vert_axis.title.setPosition(pos.x, pos.y);
                this.chart.plotArea.valAx = old_val_ax;
            }
        }
        if(this.chart && this.chart.legend)
        {
            var pos = this.chartObj.reCalculatePositionText("legend", this, this.chart.legend);
            this.chart.legend.setPosition(pos.x, pos.y);
        }
        this.recalcInfo.axisLabels.length = 0;

    }, this, []);
};

CChartSpace.prototype.deselect = CShape.prototype.deselect;
CChartSpace.prototype.getDrawingDocument = CShape.prototype.getDrawingDocument;
CChartSpace.prototype.recalculateLocalTransform = CShape.prototype.recalculateLocalTransform;
