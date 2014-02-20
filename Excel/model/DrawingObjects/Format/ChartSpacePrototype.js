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
        recalculateAxisCat: true ,
        recalculateAxisTickMark: true,
        recalculateBrush: true,
        recalculatePen: true,
        recalculatePlotAreaBrush: true,
        recalculatePlotAreaPen: true,
        recalculateHiLowLines: true,
        recalculateUpDownBars: true
    };
    this.baseColors = [];
    this.bounds = {l: 0, t: 0, r: 0, b:0, w: 0, h:0};
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

CChartSpace.prototype.addToSetPosition = function(dLbl)
{
    if(dLbl instanceof CDLbl)
        this.recalcInfo.dataLbls.push(dLbl);
    else if(dLbl instanceof CTitle)
        this.recalcInfo.axisLabels.push(dLbl);
};

CChartSpace.prototype.addToRecalculate = CShape.prototype.addToRecalculate;

CChartSpace.prototype.handleUpdatePosition = function()
{
    this.recalcTransform();
    this.recalcBounds();
    this.recalcDLbls();
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateExtents = function()
{
    this.recalcChart();
    this.recalcBounds();
    this.recalcDLbls();
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateFlip = function()
{
    this.recalcTransform();
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateChart = function()
{
    this.recalcChart();
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

CChartSpace.prototype.draw = function(graphics)
{
    var intGrid = graphics.GetIntegerGrid();
    graphics.SetIntegerGrid(false);
    graphics.transform3(this.transform, false);

    this.chartObj.draw(this, graphics);
    graphics.reset();
    graphics.SetIntegerGrid(intGrid);

    if(this.chart)
    {
        if(this.chart.plotArea)
        {
            if(this.chart.plotArea.chart && this.chart.plotArea.chart.series)
            {
                var series = this.chart.plotArea.chart.series;
                for(var i = 0; i < series.length; ++i)
                {
                    var ser = series[i];
                    var pts = getPtsFromSeries(ser);
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
    }

};
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
        if(this.chart && this.chart.plotArea && this.chart.plotArea.valAx && this.chart.plotArea.valAx.title)
        {
            var pos = this.chartObj.reCalculatePositionText("valAx", this, this.chart.plotArea.valAx.title);
            this.chart.plotArea.valAx.title.setPosition(pos.x, pos.y);
        }
        if(this.chart && this.chart.plotArea && this.chart.plotArea.catAx && this.chart.plotArea.catAx.title)
        {
            var pos = this.chartObj.reCalculatePositionText("catAx", this, this.chart.plotArea.catAx.title);
            this.chart.plotArea.catAx.title.setPosition(pos.x, pos.y);
        }
        this.recalcInfo.axisLabels.length = 0;

    }, this, []);
};

CChartSpace.prototype.recalculateAxisLabels = function()
{
    if(this.chart && this.chart.title)
    {
        var title = this.chart.title;
        title.parent = this.chart;
        title.chart = this;
        title.recalculate();
    }
    if(this.chart && this.chart.plotArea)
    {
        if(this.chart.plotArea.catAx && this.chart.plotArea.catAx.title)
        {
            var title = this.chart.plotArea.catAx.title;
            title.parent = this.chart.plotArea.catAx;
            title.chart = this;
            title.recalculate();
        }
        if(this.chart.plotArea.valAx && this.chart.plotArea.valAx.title)
        {
            var title = this.chart.plotArea.valAx.title;
            title.parent = this.chart.plotArea.valAx;
            title.chart = this;
            title.recalculate();
        }
    }
};
CChartSpace.prototype.deselect = CShape.prototype.deselect;
CChartSpace.prototype.hitInWorkArea = function()
{
    return false;
};

function CreateUnfilFromRGB(r, g, b)
{
    var ret =  new CUniFill();
    ret.setFill(new CSolidFill());
    ret.fill.setColor(new CUniColor());
    ret.fill.color.setColor(new CRGBColor());
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
        unicolor.setMods(new CColorModifiers());
        var mod = new CColorMod();
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

CChartSpace.prototype.recalculateBaseColors = function()
{
    var is_on = History.Is_On();
    if(is_on)
    {
        History.TurnOff();
    }
    if ( this.style && (typeof(this.style) == 'number') )
    {
        if ( this.style % 8 === 0 )
            this.baseColors = CreateColorMapByIndex(8);
        else
            this.baseColors = CreateColorMapByIndex(this.style % 8);
    }
    else
        this.baseColors = CreateColorMapByIndex(2);

    if(is_on)
    {
        History.TurnOn();
    }
};

CChartSpace.prototype.getDrawingDocument = CShape.prototype.getDrawingDocument;

function GetTypeMarkerByIndex(index)
{
    return MARKER_SYMBOL_TYPE[index % 9];
}
CChartSpace.prototype.hitToAdjustment = function()
{
    return {hit: false};
};

CChartSpace.prototype.getNeedColorCount = function()
{
    var b_vary_markers = this.chart.plotArea.chart instanceof CPieChart || (this.chart.plotArea.chart.varyColors && this.chart.plotArea.chart.series.length === 1);
    var need_colors;
    if(!b_vary_markers)
    {
        return this.chart.plotArea.chart.series.length;
    }
    else
    {
        if(this.chart.plotArea.chart.series[0].val)
        {
            return this.chart.plotArea.chart.series[0].val.numRef.numCache.pts.length;
        }
        else
        {
            if(this.chart.plotArea.chart.series[0].yVal)
            {
                return this.chart.plotArea.chart.series[0].yVal.numRef.numCache.pts.length;
            }
            else
            {
                return 0;
            }
        }
    }
};


function getArrayFillsFromBase(arrBaseFills, needFillsCount)
{
    var ret = [];
    var count_base = arrBaseFills.length;

    var need_create = parseInt(needFillsCount / count_base) + 1;

    for (var i = 0; i < need_create; i++)
    {
        for (var j = 0; j < count_base; j++)
        {
            var percent = (-70 + 140 * ( (i + 1) / (need_create + 1) )) * 1000;
            var color = CreateUniFillSolidFillWidthTintOrShade(arrBaseFills[j], 100000 - percent);
            ret.push( color );
        }
    }
    ret.splice(needFillsCount, ret.length - needFillsCount);
    return ret;
}


CChartSpace.prototype.recalculateGridLines = function()
{
    if(this.chart && this.chart.plotArea)
    {
        var calcMajorMinorGridLines = function (axis, defaultStyle, subtleLine, parents)
        {
            function calcGridLine(defaultStyle, spPr, subtleLine, parents)
            {
                if(spPr)
                {
                    var compiled_grid_lines = new CLn();
                    compiled_grid_lines.merge(subtleLine);
                    if(!compiled_grid_lines.Fill)
                    {
                        compiled_grid_lines.setFill(new CUniFill());
                    }
                    compiled_grid_lines.Fill.merge(defaultStyle);
                    compiled_grid_lines.merge(spPr.ln);
                    compiled_grid_lines.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
                    return compiled_grid_lines;
                }
                return null;
            }
            axis.compiledMajorGridLines = calcGridLine(defaultStyle.axisAndMajorGridLines, axis.majorGridlines, subtleLine, parents);
            axis.compiledMinorGridLines = calcGridLine(defaultStyle.minorGridlines, axis.minorGridlines, subtleLine, parents);
        };
        var default_style = CHART_STYLE_MANAGER.getDefaultLineStyleByIndex(this.style);
        var parent_objects = this.getParentObjects();
        var RGBA = {R:0, G:0, B:0, A: 255};
        var subtle_line;
        if(parent_objects.theme  && parent_objects.theme.themeElements
            && parent_objects.theme.themeElements.fmtScheme
            && parent_objects.theme.themeElements.fmtScheme.lnStyleLst)
        {
            subtle_line = parent_objects.theme.themeElements.fmtScheme.lnStyleLst[0];
        }
        calcMajorMinorGridLines(this.chart.plotArea.valAx, default_style, subtle_line, parent_objects);
        calcMajorMinorGridLines(this.chart.plotArea.catAx, default_style, subtle_line, parent_objects);
    }
};

CChartSpace.prototype.recalculateMarkers = function()
{
    if(this.chart && this.chart.plotArea && this.chart.plotArea.chart
        && ((this.chart.plotArea.chart instanceof CLineChart && this.chart.plotArea.chart.marker)
        || this.chart.plotArea.chart instanceof CScatterChart
        || this.chart.plotArea.chart instanceof CStockChart)
        && this.chart.plotArea.chart.series)
    {
        var chart_style = CHART_STYLE_MANAGER.getStyleByIndex(this.style);
        var effect_fill = chart_style.fill1;
        var fill = chart_style.fill2;
        var line = chart_style.line4;
        var masrker_default_size = chart_style.markerSize;
        var default_marker = new CMarker();
        default_marker.setSize(masrker_default_size);
        var parent_objects = this.getParentObjects();

        if(parent_objects.theme  && parent_objects.theme.themeElements
            && parent_objects.theme.themeElements.fmtScheme
            && parent_objects.theme.themeElements.fmtScheme.lnStyleLst)
        {
            default_marker.setSpPr(new CSpPr());
            default_marker.spPr.setLn(new CLn());
            default_marker.spPr.ln.merge(parent_objects.theme.themeElements.fmtScheme.lnStyleLst[0]);
        }
        var RGBA = {R:0, G:0, B:0, A: 255};
        if(this.chart.plotArea.chart.varyColors && this.chart.plotArea.chart.series.length === 1)
        {
            var ser = this.chart.plotArea.chart.series[0], pts;
            if(ser.val)
            {
                pts = ser.val.numRef.numCache.pts;
            }
            else if(ser.yVal)
            {
                pts = ser.yVal.numRef.numCache.pts;
            }
            else
            {
                pts = [];
            }
            var series_marker = ser.marker;

            var brushes = getArrayFillsFromBase(fill, pts.length);
            var pens_fills = getArrayFillsFromBase(line, pts.length);
            var compiled_markers = [];
            for(var i = 0;  i < pts.length; ++i)
            {
                var compiled_marker = new CMarker();
                compiled_marker.merge(default_marker);
                if(!compiled_marker.spPr)
                {
                    compiled_marker.setSpPr(new CSpPr());
                }
                compiled_marker.spPr.setFill(brushes[i]);
                if(!compiled_marker.spPr.ln)
                    compiled_marker.spPr.setLn(new CLn());
                compiled_marker.spPr.ln.setFill(pens_fills[i]);
                compiled_marker.merge(ser.marker);
                compiled_marker.setSymbol(GetTypeMarkerByIndex(j));
                if(Array.isArray(ser.dPt))
                {
                    for(var j = 0; j < ser.dPt.length; ++j)
                    {
                        if(ser.dPt[j].idx === pts[i].idx)
                        {
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
            var series = this.chart.plotArea.chart.series;
            var brushes = getArrayFillsFromBase(fill, series.length);
            var pens_fills = getArrayFillsFromBase(line, series.length);
            for(var i = 0; i < series.length; ++i)
            {
                var ser = series[i];
                if(ser.val)
                {
                    pts = ser.val.numRef.numCache.pts;
                }
                else if(ser.yVal)
                {
                    pts = ser.yVal.numRef.numCache.pts;
                }
                else
                {
                    pts = [];
                }
                for(var j = 0; j < pts.length; ++j)
                {
                    var compiled_marker = new CMarker();
                    compiled_marker.merge(default_marker);
                    if(!compiled_marker.spPr)
                    {
                        compiled_marker.setSpPr(new CSpPr());
                    }
                    compiled_marker.spPr.setFill(brushes[i]);
                    if(!compiled_marker.spPr)
                        compiled_marker.spPr.setLn(new CLn());
                    compiled_marker.spPr.ln.setFill(pens_fills[i]);
                    compiled_marker.merge(ser.marker);
                    compiled_marker.setSymbol(GetTypeMarkerByIndex(i));
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
    }
};

CChartSpace.prototype.recalculateSeriesColors = function()
{
    ExecuteNoHistory(function()
    {
        if(this.chart && this.chart.plotArea && this.chart.plotArea.chart && this.chart.plotArea.chart.series)
        {
            var style = CHART_STYLE_MANAGER.getStyleByIndex(this.style);
            var series = this.chart.plotArea.chart.series;


            var parents = this.getParentObjects();
            var RGBA = {R: 0, G: 0, B: 0, A: 255};
            if(this.chart.plotArea.chart.varyColors && series.length === 1 || this.chart.plotArea.chart instanceof CPieChart)
            {
                var pts;
                var ser = series[0];
                if(ser.val)
                {
                    pts = ser.val.numRef.numCache.pts;
                }
                else if(ser.yVal)
                {
                    pts = ser.yVal.numRef.numCache.pts;
                }
                else
                {
                    pts = [];
                }

                if(!(this.chart.plotArea.chart instanceof CLineChart))
                {
                    var base_fills = getArrayFillsFromBase(style.fill2, pts.length);
                    for(var i = 0; i < pts.length; ++i)
                    {
                        var compiled_brush = new CUniFill();
                        compiled_brush.merge(base_fills[i]);
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

                    if(style.line1 === EFFECT_SUBTLE)
                    {
                        var default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0];

                        var base_line_fills = [];
                        if(this.style !== 34)
                        {
                            for(i = 0; i < pts.length; ++i)
                            {
                                var compiled_line = new CLn();
                                compiled_line.merge(default_line);
                                compiled_line.Fill.merge(style.line2[0]);
                                if(ser.spPr && spPr.ln)
                                {
                                    compiled_line.merge(spPr.ln);
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
                                pts[i].pen = compiled_line;
                                pts[i].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            }
                        }
                        else
                        {
                            var base_line_fills = getArrayFillsFromBase(style.line2, pts.length);
                            for(i = 0; i < pts.length; ++i)
                            {
                                var compiled_line = new CLn();
                                compiled_line.merge(default_line);
                                compiled_line.Fill.merge(base_line_fills[i]);
                                if(ser.spPr && spPr.ln)
                                {
                                    compiled_line.merge(spPr.ln);
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
                                pts[i].pen = compiled_line;
                                pts[i].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                            }
                        }
                    }
                }
                else
                {
                    var default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0];
                    var base_line_fills = getArrayFillsFromBase(style.line4, pts.length);
                    for(var i = 0; i < pts.length; ++i)
                    {
                        var compiled_line = new CLn();
                        compiled_line.merge(default_line);
                        compiled_line.Fill.merge(base_line_fills[i]);
                        compiled_line.w *= style.line3;
                        if(ser.spPr && spPr.ln)
                        {
                            compiled_line.merge(spPr.ln);
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
            }
            else
            {
                if(!(this.chart.plotArea.chart instanceof CLineChart || this.chart.plotArea.chart instanceof  CScatterChart))
                {
                    var base_fills = getArrayFillsFromBase(style.fill2, series.length);
                    var base_line_fills = null;
                    if(style.line1 === EFFECT_SUBTLE && this.style === 34)
                        base_line_fills	= getArrayFillsFromBase(style.line2, series.length);
                    for(var i = 0; i < series.length; ++i)
                    {
                        var ser = series[i];
                        var pts;
                        if(ser.val)
                        {
                            pts = ser.val.numRef.numCache.pts;
                        }
                        else if(ser.yVal)
                        {
                            pts = ser.yVal.numRef.numCache.pts;
                        }
                        else
                        {
                            pts = [];
                        }

                        for(var j = 0; j < pts.length; ++j)
                        {
                            var compiled_brush = new CUniFill();
                            compiled_brush.merge(base_fills[i]);
                            if(ser.spPr && ser.spPr.Fill)
                            {
                                compiled_brush.merge(ser.spPr.Fill);
                            }
                            if(Array.isArray(ser.dPt))
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


                        if(style.line1 === EFFECT_SUBTLE)
                        {
                            var default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0];

                            if(this.style !== 34)
                            {
                                for(var j = 0; j < pts.length; ++j)
                                {
                                    var compiled_line = new CLn();
                                    compiled_line.merge(default_line);
                                    compiled_line.Fill.merge(style.line2[0]);
                                    if(ser.spPr && spPr.ln)
                                    {
                                        compiled_line.merge(spPr.ln);
                                    }
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
                                    pts[j].pen = compiled_line;
                                    pts[j].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                }
                            }
                            else
                            {
                                for(i = 0; i < pts.length; ++i)
                                {
                                    var compiled_line = new CLn();
                                    compiled_line.merge(default_line);
                                    compiled_line.Fill.merge(base_line_fills[i]);
                                    if(ser.spPr && spPr.ln)
                                    {
                                        compiled_line.merge(spPr.ln);
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
                                    pts[i].pen = compiled_line;
                                    pts[i].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                                }
                            }
                        }
                    }
                }
                else
                {

                    var base_line_fills = getArrayFillsFromBase(style.line4, series.length);
                    for(var i = 0; i < series.length; ++i)
                    {
                        var default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0];
                        var ser = series[i];
                        var pts;
                        if(ser.val)
                        {
                            pts = ser.val.numRef.numCache.pts;
                        }
                        else if(ser.yVal)
                        {
                            pts = ser.yVal.numRef.numCache.pts;
                        }
                        else
                        {
                            pts = [];
                        }
                        for(var j = 0; j < pts.length; ++j)
                        {
                            var compiled_line = new CLn();
                            compiled_line.merge(default_line);
                            compiled_line.Fill.merge(base_line_fills[i]);
                            compiled_line.w *= style.line3;
                            if(ser.spPr && spPr.ln)
                            {
                                compiled_line.merge(spPr.ln);
                            }
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
                        }
                    }
                }
            }
        }
    }, this, []);
};

CChartSpace.prototype.recalculateHiLowLines = function()
{
    if(this.chart && this.chart.plotArea && (this.chart.plotArea.chart instanceof CStockChart || this.chart.plotArea.chart instanceof CLineChart) && this.chart.plotArea.chart.hiLowLines)
    {
        var parents = this.getParentObjects();
        var default_line = parents.theme.themeElements.fmtScheme.lnStyleLst[0].createDuplicate();
        if(this.style >=1 && this.style <= 32)
            default_line.setFill(CreateUnifillSolidFillSchemeColor(15, 0));
        else if(this.style >= 33 && this.style <= 34)
            default_line.setFill(CreateUnifillSolidFillSchemeColor(8, 0));
        else if(this.style >= 35 && this.style <= 40)
            default_line.setFill(CreateUnifillSolidFillSchemeColor(8, -25000));
        else
            default_line.setFill(CreateUnifillSolidFillSchemeColor(12, 0));
        default_line.merge(this.chart.plotArea.chart.hiLowLines.ln);
        this.chart.plotArea.chart.calculatedHiLowLines = default_line;
        default_line.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R:0, G:0, B:0, A:255});
    }
    else
    {
        this.chart.plotArea.chart.calculatedHiLowLines = null;
    }
};

function getPtsFromSeries(ser)
{
    if(ser)
    {
        if(ser.val)
        {
            return ser.val.numRef.numCache.pts;
        }
        else if(ser.yVal)
        {
            return ser.yVal.numRef.numCache.pts;
        }
    }
    return [];
}
CChartSpace.prototype.recalculateDLbls = function()
{
    if(this.chart && this.chart.plotArea && this.chart.plotArea.chart && this.chart.plotArea.chart.series)
    {
        var default_lbl = new CDLbl();
        default_lbl.initDefault();
        var series = this.chart.plotArea.chart.series;
        for(var i = 0; i < series.length; ++i)
        {
            var ser = series[i];
            var pts = getPtsFromSeries(ser);
            for(var j = 0; j < pts.length; ++j)
            {
                var pt = pts[j];
                var compiled_dlb = new CDLbl();
                compiled_dlb.merge(default_lbl);
                compiled_dlb.merge(this.chart.plotArea.chart.dLbls);
                if(this.chart.plotArea.chart.dLbls)
                    compiled_dlb.merge(this.chart.plotArea.chart.dLbls.findDLblByIdx(pt.idx), false);
                compiled_dlb.merge(ser.dLbls);
                if(ser.dLbls)
                    compiled_dlb.merge(ser.dLbls.findDLblByIdx(pt.idx), true);

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

CChartSpace.prototype.getCalcProps = function()
{
    if(!this.chartObj)
    {
        this.chartObj = new CChartsDrawer()
    }
    this.chartObj.preCalculateData(this);
    return this.chartObj.calcProp;
};

CChartSpace.prototype.getValAxisValues = function()
{
    if(!this.chartObj)
    {
        this.chartObj = new CChartsDrawer()
    }
    this.chartObj.preCalculateData(this);
    var ret = [];
    ret = ret.concat(this.chartObj.calcProp.scale);
    return ret;
};




CChartSpace.prototype.recalculateValAxLine = function()
{};

CChartSpace.prototype.recalculateAxisValLabels = function()
{

    if(this.chart && this.chart.plotArea && this.chart.plotArea)
    {
        var plot_area = this.chart.plotArea;
        var chart = plot_area.chart;
        var i;
        if(!(chart instanceof CScatterChart))
        {
            var val_ax, cat_ax;
            if(plot_area.valAx)
            {
                val_ax = this.chart.plotArea.valAx;
                var arr_val =  this.getValAxisValues();
                var arr_strings = [];
                var multiplier;
                if(val_ax.dispUnits)
                    multiplier = val_ax.dispUnits.getMultiplier;
                else
                    multiplier = 1;
                var num_fmt = val_ax.numFmt;
                if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                {
                    var num_format = oNumFormatCache.get(num_fmt.formatCode);
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        var calc_value = arr_val[i]*multiplier;
                        var rich_value = num_format.format(calc_value, CellValueType.number, 15);
                        arr_strings.push(rich_value[0].text);
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
                val_ax.labels = new CValAxisLabels(this);
                for(i = 0; i < arr_val.length; ++i)
                {
                    var dlbl = new CDLbl();
                    dlbl.parent = val_ax;
                    dlbl.chart = this;
                    dlbl.spPr = val_ax.spPr;
                    dlbl.txPr = val_ax.txPr;
                    dlbl.tx = new CChartText();
                    dlbl.tx.rich = CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                    dlbl.recalculate();
                    val_ax.labels.arrLabels.push(dlbl);
                }
                val_ax.labels.recalculateExtX();
            }

            var string_pts = [];
            var pts_len = 0;
            if(plot_area.catAx)
            {
                cat_ax = plot_area.catAx;
                var ser = chart.series[0];
                if(ser && ser.cat)
                {
                    if(ser.cat.strRef && ser.cat.strRef.strCache)
                    {
                        string_pts = ser.cat.strRef.strCache.pt;
                        pts_len = string_pts.length;
                    }
                    else if(ser.cat.strLit)
                    {
                        string_pts = ser.cat.strLit.pt;
                        pts_len = string_pts.length;
                    }
                }
                if(string_pts.length === 0)
                {
                    if(ser.val)
                    {
                        if(ser.val.numRef && ser.val.numRef.numCache)
                            pts_len = ser.val.numRef.numCache.pts.length;
                        else if(ser.val.numLit)
                            pts_len = ser.val.numLit.pts.length;
                    }
                    for(i = 0; i < pts_len; ++i)
                    {
                        string_pts.push({val:i+1 + ""});
                    }
                }
            }
            if(val_ax && cat_ax)
            {
                cat_ax.labels = new CValAxisLabels(this);
                var t = this.getChartSizes();
                var common_width = t.w;
                var common_height = t.h;
                var plot_area_width = common_width - val_ax.labels.extX;
                var max_sect_width = plot_area_width/string_pts.length;
                var tick_lbl_skip = isRealNumber(cat_ax.tickLblSkip) ? cat_ax.tickLblSkip : 1;
                for(i = 0; i < string_pts.length; ++i)
                {
                    var dlbl = null;
                    if(i%tick_lbl_skip === 0)
                    {
                        dlbl = new CDLbl();
                        dlbl.parent = cat_ax;
                        dlbl.chart = this;
                        dlbl.spPr = cat_ax.spPr;
                        dlbl.txPr = cat_ax.txPr;
                        dlbl.tx = new CChartText();
                        dlbl.tx.rich = CreateTextBodyFromString(string_pts[i].val, this.getDrawingDocument(), dlbl);
                        dlbl.recalculate();
                    }
                    cat_ax.labels.arrLabels.push(dlbl);
                }
                var lbls = cat_ax.labels.arrLabels;
                var rot = null;
                var w0 = val_ax.labels.extX;
                var w1 = (common_width - val_ax.labels.extX)/pts_len;
                var max_text_height = 0;
                if(!(cat_ax.txPr && cat_ax.txPr.bodyPr && isRealNumber(cat_ax.txPr.bodyPr.rot)))
                {
                    var max_min_text_width = cat_ax.labels.getMinWidth();
                    for(i = 0; i < lbls.length; ++i)
                    {
                        if(lbls[i])
                        {
                            if(lbls[i].extY > max_text_height)
                                max_text_height = lbls[i].extY;
                        }
                    }
                    if(max_min_text_width <= max_sect_width)
                    {
                        for(i = 0; i < lbls.length; ++i)
                        {
                            if(lbls[i])
                            {
                                lbls[i].x = w0 + w1/2 + w1*(i) - lbls[i].extX/2;
                                lbls[i].y = max_text_height;
                            }
                        }
                    }
                    else
                    {
                        rot = -Math.PI/4;
                    }
                }

                var _rot = isRealNumber(rot) ? rot : 0;
                var _cos = Math.cos(_rot);
                var _sin = Math.sin(_rot);
                if(isRealNumber(rot))
                {
                    var max_height = 0;
                    for(i = 0; i < lbls.length; ++i)
                    {
                        if(lbls[i])
                        {
                            var cur_height = lbls[i].extX*_sin;
                            if(cur_height > max_height)
                                max_height = cur_height;
                            if(lbls[i].extY > max_text_height)
                                max_text_height = lbls[i].extY;
                        }
                    }
                    if(max_height + max_text_height <= common_height/2) //TODO:пока так. надо разобраться(зависит от шрифта подписей)
                    {
                        var min_x = w1/2 + w0;
                        for(i = 0; i < lbls.length; ++i)
                        {
                            if(lbls[i])
                            {
                                var point_cx = w1/2 + w0 + (i)*w1;
                                if(lbls[i].extX*_cos <= point_cx)
                                {
                                    lbls[i].pX = point_cx - lbls[i].extX*_cos;
                                    if(point_cx - lbls[i].extX*_cos<= min_x)
                                    {
                                        min_x = point_cx - lbls[i].extX;
                                    }
                                }
                                else
                                {
                                    break;
                                }
                            }
                        }
                        if(i === lbls.length)
                        {//Значит слева мы не вылезли за пределы подписей значений
                            if(rot < 0)
                            {
                                for(i = 0; i < lbls.length; ++i)
                                {
                                    if(lbls[i])
                                    {
                                        var point_cx = w1/2 + w0 + (i)*w1;
                                        var x = point_cx - lbls[i].extX*_cos - lbls[i].extX;
                                        var y = max_text_height + lbls[i].extX*(Math.abs(_sin));
                                        lbls[i].setPositionRelative(x, y);
                                    }
                                }
                            }
                            else
                            {
                                for(i = 0; i < lbls.length; ++i)
                                {
                                    if(lbls[i])
                                    {
                                        var point_cx = w1/2 + w0 + (i)*w1;
                                        var x = point_cx + lbls[i].extX*_cos - lbls[i].extX;
                                        var y = max_text_height + lbls[i].extX*(Math.abs(_sin));
                                        lbls[i].setPositionRelative(x, y);
                                    }
                                }
                            }
                        }
                        else
                        {}
                    }
                }
                else
                {
                    for(i = 0; i < lbls.length; ++i)
                    {
                        if(lbls[i])
                        {
                            var cx = w1/2 + w1*i;
                            lbls[i].setPositionRelative(cx - lbls[i].extX/2, max_text_height);
                        }
                    }
                }
                var rot_matrix = new CMatrix();
                global_MatrixTransformer.RotateRadAppend(rot_matrix, -_rot);
                if(!cat_ax.txPr)
                {
                    cat_ax.setTxPr(new CTextBody());
                }
                if(!cat_ax.txPr.bodyPr)
                {
                    cat_ax.txPr.setBodyPr(new CBodyPr());
                }
                if(!isRealNumber( cat_ax.txPr.bodyPr.rot))
                {
                    cat_ax.txPr.bodyPr.rot = _rot;
                }
                for(i = 0; i < lbls.length; ++i)
                {
                    var lbl = lbls[i];
                    var hc = lbl.extX/2;
                    var vc = lbl.extY/2;
                    var xc = lbl.x + hc, yc = lbl.y + vc;
                    var x_0 = xc + rot_matrix.TransformPointX(-hc - vc);
                    var y_0 = yc + rot_matrix.TransformPointY(-hc - vc);
                    var x_1 = xc + rot_matrix.TransformPointX(hc, -vc);
                    var y_1 = yc + rot_matrix.TransformPointY(hc, -vc);
                    var x_2 = xc + rot_matrix.TransformPointX(hc, vc);
                    var y_2 = yc + rot_matrix.TransformPointY(hc, vc);
                    var x_3 = xc + rot_matrix.TransformPointX(-hc, vc);
                    var y_3 = yc + rot_matrix.TransformPointY(-hc, vc);
                    lbls[i].recalculate();
                }



                var val_labels = val_ax.labels;
                val_labels.extY =  common_height - cat_ax.labels.extY;
                for(i = 0; i < val_labels.length; ++i)
                {

                }
            }
        }
    }
};




CChartSpace.prototype.recalculateAxisCat = function()
{};

CChartSpace.prototype.recalculateAxisTickMark = function()
{
    if(this.chart && this.chart.plotArea)
    {
        var calcMajorMinorGridLines = function (axis, defaultStyle, subtleLine, parents)
        {
            function calcGridLine(defaultStyle, spPr, subtleLine, parents)
            {
                var compiled_grid_lines = new CLn();
                compiled_grid_lines.merge(subtleLine);

                if(!compiled_grid_lines.Fill)

                {
                    compiled_grid_lines.setFill(new CUniFill());
                }
                compiled_grid_lines.Fill.merge(defaultStyle);
                if(spPr)
                {
                    compiled_grid_lines.merge(spPr.ln);
                }
                compiled_grid_lines.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
                return compiled_grid_lines;
            }
            axis.compiledLn = calcGridLine(defaultStyle.axisAndMajorGridLines, axis.spPr, subtleLine, parents);
            axis.compiledTickMarkLn = axis.compiledLn.createDuplicate();
            if(isRealNumber(axis.compiledTickMarkLn.w))
                axis.compiledTickMarkLn.w/=2;
            axis.compiledTickMarkLn.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255})
        };
        var default_style = CHART_STYLE_MANAGER.getDefaultLineStyleByIndex(this.style);
        var parent_objects = this.getParentObjects();
        var RGBA = {R:0, G:0, B:0, A: 255};
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

CChartSpace.prototype.recalculateAxisCat = function()
{
};


CChartSpace.prototype.recalculateVerticalAxis = function()
{

};

CChartSpace.prototype.recalculateHorizontalAxis = function()
{

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

CChartSpace.prototype.recalculateChartPen = function()
{
    var parent_objects = this.getParentObjects();
    var default_line = new CLn();
    if(parent_objects.theme  && parent_objects.theme.themeElements
        && parent_objects.theme.themeElements.fmtScheme
        && parent_objects.theme.themeElements.fmtScheme.lnStyleLst)
    {
        default_line.merge(parent_objects.theme.themeElements.fmtScheme.lnStyleLst[0]);
    }

    var fill;
    if(this.style >= 1 && this.style <= 32)
        fill = CreateUnifillSolidFillSchemeColor(15, 75000);
    else if(this.style >= 33 && this.style <= 40)
        fill = CreateUnifillSolidFillSchemeColor(8, 75000);
    else
        fill = CreateUnifillSolidFillSchemeColor(12, 0);
    default_line.setFill(fill);
    if(this.spPr && this.spPr.ln)
        default_line.merge(this.spPr.ln);
    var parents = this.getParentObjects();
    default_line.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
    this.pen = default_line;
};

CChartSpace.prototype.recalculatePlotAreaChartBrush = function()
{
    if(this.chart && this.chart.plotArea)
    {
        var plot_area = this.chart.plotArea;
        var default_brush;
        if(this.style >=1 && this.style <=32)
            default_brush = CreateUnifillSolidFillSchemeColor(6, 0);
        else if(this.style >=33 && this.style <= 34)
            default_brush = CreateUnifillSolidFillSchemeColor(8, 20000);
        else if(this.style >=35 && this.style <=40)
            default_brush = CreateUnifillSolidFillSchemeColor(this.style - 35, 0);
        else
            default_brush = CreateUnifillSolidFillSchemeColor(8, 95000);

        if(plot_area.spPr && plot_area.spPr.Fill)
        {
            default_brush.merge(this.spPr.Fill);
        }
        var parents = this.getParentObjects();
        default_brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
        plot_area.brush = default_brush;
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

CChartSpace.prototype.recalculateUpDownBars = function()
{
    if(this.chart && this.chart.plotArea && this.chart.plotArea.chart && this.chart.plotArea.chart.upDownBars)
    {
        var bars = this.chart.plotArea.chart.upDownBars;
        var up_bars = bars.upBars;
        var down_bars = bars.downBars;
        var parents = this.getParentObjects();
        bars.upBarsBrush = null;
        bars.upBarsPen = null;
        bars.downBarsBrush = null;
        bars.downBarsPen = null;
        if(up_bars || down_bars)
        {
            var default_bar_line = new CLn();
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
                default_bar_line.setFill(CreateUnifillSolidFillSchemeColor(this.style - 35, -25000));
        }
        if(up_bars)
        {
            var default_up_bars_fill;
            if(this.style === 1 || this.style === 9 || this.style === 17 || this.style === 25 || this.style === 41)
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(8, 25000);
            }
            else if(this.style === 2 || this.style === 10 || this.style === 18 || this.style === 26)
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(8, 5000);
            }
            else if(this.style >= 3 && this.style <= 8)
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 3, 25000);
            }
            else if(this.style >= 11 && this.style <= 16)
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 11, 25000);
            }
            else if(this.style >=19 && this.style <= 24)
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 19, 25000);
            }
            else if(this.style >= 27 && this.style <= 32 )
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 27, 25000);
            }
            else if(this.style >= 33 && this.style <= 40 || this.style === 42)
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(12, 0);
            }
            else
            {
                default_up_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 43, 25000);
            }
            if(up_bars.Fill)
            {
                default_up_bars_fill.merge(up_bars.Fill);
            }
            default_up_bars_fill.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
            this.chart.plotArea.chart.upDownBars.upBarsBrush = default_up_bars_fill;
            var up_bars_line = default_bar_line.createDuplicate();
            if(up_bars.ln)
                up_bars_line.merge(up_bars.ln);
            up_bars_line.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
            this.chart.plotArea.chart.upDownBars.upBarsPen = up_bars_line;

        }
        if(down_bars)
        {
            var default_down_bars_fill;
            if(this.style === 1 || this.style === 9 || this.style === 17 || this.style === 25 || this.style === 41 || this.style === 33)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(8, 85000);
            }
            else if(this.style === 2 || this.style === 10 || this.style === 18 || this.style === 26 || this.style === 34)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(8, 95000);
            }
            else if(this.style >= 3 && this.style <= 8)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 3, -25000);
            }
            else if(this.style >= 11 && this.style <= 16)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 11, -25000);
            }
            else if(this.style >=19 && this.style <= 24)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 19, -25000);
            }
            else if(this.style >= 27 && this.style <= 32 )
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 27, -25000);
            }
            else if(this.style >= 35 && this.style <= 40)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 35, -25000);
            }
            else if(this.style === 42)
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(8, 0);
            }
            else
            {
                default_down_bars_fill = CreateUnifillSolidFillSchemeColor(this.style - 43, -25000);
            }
            if(down_bars.Fill)
            {
                default_down_bars_fill.merge(down_bars.Fill);
            }
            default_down_bars_fill.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
            this.chart.plotArea.chart.upDownBars.downBarsBrush = default_down_bars_fill;
            var down_bars_line = default_bar_line.createDuplicate();
            if(down_bars.ln)
                down_bars_line.merge(down_bars.ln);
            down_bars_line.calculate(parents.theme, parents.slide, parents.layout, parents.master, {R: 0, G: 0, B: 0, A: 255});
            this.chart.plotArea.chart.upDownBars.downBarsPen = down_bars_line;
        }
    }
};


CChartSpace.prototype.getChartSizes = function()
{
    if(!this.chartObj)
        this.chartObj = new CChartsDrawer();
    return this.chartObj.calculateSizePlotArea(this);
};


CChartSpace.prototype.recalculateAxis = function()
{
    if(this.chart && this.chart.plotArea && this.chart.plotArea.chart)
    {
        var plot_area = this.chart.plotArea;
        var chart_object = plot_area.chart;
        var i;
        switch(chart_object.getObjectType())
        {
            case historyitem_type_ScatterChart:
            {
                //TODO
                break;
            }
            case historyitem_type_PieChart:
            {
                break;
            }
            default :
            {
                var gap_hor_axis = 4;
                var axis = chart_object.axId;
                var cat_ax, val_ax;
                for(i = 0; i < axis.length; ++i)
                {
                    if(!cat_ax && axis[i].getObjectType() === historyitem_type_CatAx)
                        cat_ax = axis[i];
                    if(!val_ax && axis[i].getObjectType() === historyitem_type_ValAx)
                        val_ax = axis[i];
                    if(cat_ax && val_ax)
                        break;
                }
                if(val_ax && cat_ax)
                {

                    val_ax.labels  = null;
                    cat_ax.labels  = null;
                    var sizes = this.getChartSizes();
                    var rect = {x: sizes.startX, y:sizes.startY,w:sizes.w, h: sizes.h};
                    var arr_val =  this.getValAxisValues();
                    //Получим строки для оси значений с учетом формата и единиц
                    var arr_strings = [];
                    var multiplier;
                    if(val_ax.dispUnits)
                        multiplier = val_ax.dispUnits.getMultiplier;
                    else
                        multiplier = 1;
                    var num_fmt = val_ax.numFmt;
                    if(num_fmt && typeof num_fmt.formatCode === "string" /*&& !(num_fmt.formatCode === "General")*/)
                    {
                        var num_format = oNumFormatCache.get(num_fmt.formatCode);
                        for(i = 0; i < arr_val.length; ++i)
                        {
                            var calc_value = arr_val[i]*multiplier;
                            var rich_value = num_format.format(calc_value, CellValueType.number, 15);
                            arr_strings.push(rich_value[0].text);
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
                    for(i = 0; i < arr_strings.length; ++i)
                    {
                        val_ax.labels = new CValAxisLabels(this);
                        var max_width = 0;
                        val_ax.yPoints = [];
                        for(i = 0; i < arr_strings.length; ++i)
                        {
                            var dlbl = new CDLbl();
                            dlbl.parent = val_ax;
                            dlbl.chart = this;
                            dlbl.spPr = val_ax.spPr;
                            dlbl.txPr = val_ax.txPr;
                            dlbl.tx = new CChartText();
                            dlbl.tx.rich = CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                            dlbl.recalculate();
                            if(dlbl.tx.rich.content.XLimit > max_width)
                                max_width = dlbl.tx.rich.content.XLimit;
                            val_ax.labels.arrLabels.push(dlbl);
                            val_ax.yPoints.push({val: arr_val[i], pos: null});

                        }
                    }
                    for(i = 0; i < arr_strings.length; ++i)
                    {
                        val_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(true);
                        val_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(align_Right);
                        val_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(false);
                        val_ax.labels.arrLabels[i].tx.rich.content.Reset(0,0, max_width, 20000);
                        val_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);
                    }
                    val_ax.labels.extX = max_width*2;

                    //расчитаем подписи для горизонтальной оси
                    var ser = chart_object.series[0];
                    var string_pts = [], pts_len = 0;
                    if(ser && ser.cat)
                    {
                        if(ser.cat.strRef && ser.cat.strRef.strCache)
                        {
                            string_pts = ser.cat.strRef.strCache.pt;
                            pts_len = string_pts.length;
                        }
                        else if(ser.cat.strLit)
                        {
                            string_pts = ser.cat.strLit.pt;
                            pts_len = string_pts.length;
                        }
                    }
                    if(string_pts.length === 0)
                    {
                        if(ser.val)
                        {
                            if(ser.val.numRef && ser.val.numRef.numCache)
                                pts_len = ser.val.numRef.numCache.pts.length;
                            else if(ser.val.numLit)
                                pts_len = ser.val.numLit.pts.length;
                        }
                        for(i = 0; i < pts_len; ++i)
                        {
                            string_pts.push({val:i+1 + ""});
                        }
                    }

                    //расчитаем ширину интервала без учета горизонтальной оси;
                    var crosses = val_ax.crosses;
                    if(crosses === CROSSES_AUTO_ZERO)
                    {
                        crosses = 0;
                    }
                    else
                    {
                        crosses -=1;
                    }
                    var point_width = rect.w/string_pts.length;
                    //смотрим выходят ли подписи верт. оси влево: TODO:вправо нужно потом рассмотреть
                    var left_points_width = point_width*crosses;//общая ширина левых точек если считать что точки занимают все пространство
                    if(left_points_width < val_ax.labels.extX)//подписи верт. оси выходят за пределы области построения
                    {
                        point_width = (rect.w - val_ax.labels.extX)/(string_pts.length - crosses);//делим ширину оставшуюся после вычета ширины на количество оставшихся справа точек
                        val_ax.labels.x = rect.x;
                    }
                    else
                    {
                        point_width = rect.w/string_pts.length;
                        val_ax.labels.x = rect.x + left_points_width - val_ax.labels.extX;
                    }

                    //проверим умещаются ли подписи горизонтальной оси в point_width
                    cat_ax.labels = new CValAxisLabels(this);
                    var tick_lbl_skip = isRealNumber(cat_ax.tickLblSkip) ? cat_ax.tickLblSkip : 1;
                    var max_min_width = 0;
                    var max_max_width = 0;
                    for(i = 0; i < string_pts.length; ++i)
                    {
                        var dlbl = null;
                        if(i%tick_lbl_skip === 0)
                        {
                            dlbl = new CDLbl();
                            dlbl.parent = cat_ax;
                            dlbl.chart = this;
                            dlbl.spPr = cat_ax.spPr;
                            dlbl.txPr = cat_ax.txPr;
                            dlbl.tx = new CChartText();
                            dlbl.tx.rich = CreateTextBodyFromString(string_pts[i].val, this.getDrawingDocument(), dlbl);
                            dlbl.recalculate();
                            var min_max =  dlbl.tx.rich.content.Recalculate_MinMaxContentWidth();
                            var max_min_content_width = min_max.Min;
                            if(max_min_content_width > max_min_width)
                                max_min_width = max_min_content_width;
                            if(min_max.Max > max_max_width)
                                max_max_width = min_max.Max;
                        }
                        cat_ax.labels.arrLabels.push(dlbl);
                    }
                    if(max_min_width < point_width)//значит текст каждой из точек умещается в point_width
                    {
                        var max_height = 0;
                        for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                        {
                            var content = cat_ax.labels.arrLabels[i].tx.rich.content;
                            content.Set_ApplyToAll(true);
                            content.Set_ParagraphAlign(align_Center);
                            content.Set_ApplyToAll(false);
                            content.Reset(0, 0, point_width, 20000);
                            content.Recalculate_Page(0, true);
                            var cur_height = content.Get_SummaryHeight();
                            if(cur_height > max_height)
                                max_height = cur_height;
                        }
                        val_ax.labels.y = rect.y;
                        val_ax.labels.extY = rect.h;

                        cat_ax.labels.extY = max_height + gap_hor_axis;
                        cat_ax.labels.x = val_ax.labels.x+val_ax.labels.extX - left_points_width;
                        cat_ax.labels.extX = point_width*string_pts.length;

                        var crosses_at = isRealNumber(cat_ax.crossesAt) ? cat_ax.crossesAt : arr_val[arr_val.length-1];
                        var interval = arr_val[arr_val.length-1] - arr_val[0];
                        cat_ax.labels.y = val_ax.labels.y + val_ax.labels.extY - ((arr_val[arr_val.length-1] - crosses_at)/interval)*val_ax.labels.extY;
                        //посмотрим на сколько выходят подписи вниз за пределы ректа
                        var gap = cat_ax.labels.y + cat_ax.labels.extY - (rect.y + rect.h);
                        if(gap > 0)
                        {
                            val_ax.labels.extY *=((rect.h - gap)/rect.h);
                            cat_ax.labels.y = val_ax.labels.y + val_ax.labels.extY - ((arr_val[arr_val.length-1] - crosses_at)/interval)*val_ax.labels.extY;
                        }

                        cat_ax.xPoints = [];
                        for(i = 0; i <cat_ax.labels.arrLabels.length; ++i)
                        {
                            cat_ax.labels.arrLabels[i].setPosition(cat_ax.labels.x + point_width*i, cat_ax.labels.y + gap_hor_axis);
                            cat_ax.xPoints.push({pos: cat_ax.labels.x + point_width*(i+0.5), val: i});
                        }

                        var dist = val_ax.labels.extY/(val_ax.labels.arrLabels.length-1);
                        for(i = 0; i < val_ax.labels.arrLabels.length; ++i)
                        {
                            val_ax.labels.arrLabels[i].setPosition(val_ax.labels.x, val_ax.labels.y + dist*(val_ax.labels.arrLabels.length - i -1)
                                -val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                            val_ax.yPoints[i].pos = val_ax.labels.y + dist*(val_ax.labels.arrLabels.length - i -1);
                        }
                    }
                    else
                    {
                        //Пока сделаем без обрезки текста
                        var min_x = rect.x + rect.w;
                        var max_height = 0;
                        var cur_height;
                        for(i = cat_ax.labels.arrLabels.length - 1; i > -1; --i)
                        {
                            cur_height = cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_MinMaxContentWidth().Max/Math.sqrt(2);
                            var cur_left = + rect.x + rect.w - cur_height - (cat_ax.labels.arrLabels.length - 1 - i)*point_width - point_width/2;
                            if(cur_left < min_x)
                                min_x = cur_left;

                            if(cur_height > max_height)
                                max_height = cur_height;
                        }
                        if(min_x < rect.x)
                        {
                            point_width += (rect.x + min_x)/string_pts.length;
                            left_points_width = point_width*crosses;
                            val_ax.labels.x = rect.x + rect.w - point_width*(string_pts.length - crosses) - val_ax.labels.extX;
                            cat_ax.labels.x = rect.x;
                        }
                        else
                        {
                            cat_ax.labels.x = min_x > rect.x + rect.w - point_width*string_pts.length ? rect.x + rect.w - point_width*string_pts.length : min_x;
                        }
                        val_ax.labels.y = rect.y;
                        val_ax.labels.extY = rect.h;

                        var crosses_at = isRealNumber(cat_ax.crossesAt) ? cat_ax.crossesAt : arr_val[arr_val.length-1];
                        var interval = arr_val[arr_val.length-1] - arr_val[0];
                        cat_ax.labels.y = val_ax.labels.y + val_ax.labels.extY - ((arr_val[arr_val.length-1] - crosses_at)/interval)*val_ax.labels.extY;

                        cat_ax.labels.extX = rect.x + rect.w - cat_ax.labels.x;
                        cat_ax.labels.extY = max_height + gap_hor_axis;

                        //посмотрим на сколько выходят подписи вниз за пределы ректа
                        var gap = cat_ax.labels.y + cat_ax.labels.extY - (rect.y + rect.h);
                        if(gap > 0)
                        {
                            val_ax.labels.extY *=((rect.h - gap)/rect.h);
                            cat_ax.labels.y = val_ax.labels.y + val_ax.labels.extY - ((arr_val[arr_val.length-1] - crosses_at)/interval)*val_ax.labels.extY;
                        }

                        var dist = val_ax.labels.extY/(val_ax.labels.arrLabels.length-1);
                        for(i = 0; i < val_ax.labels.arrLabels.length; ++i)
                        {
                            val_ax.labels.arrLabels[i].setPosition(val_ax.labels.x, val_ax.labels.y + dist*(val_ax.labels.arrLabels.length - i -1)
                                -val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                            val_ax.yPoints[i].y = val_ax.labels.y + dist*(val_ax.labels.arrLabels.length - i -1);
                        }

                        cat_ax.xPoints = [];
                        for(i = cat_ax.labels.arrLabels.length - 1; i > -1 ; --i)
                        {
                            var max_width = cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_MinMaxContentWidth().Max;
                            cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, max_width, 20000);
                            cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);
                            var x1 = rect.x + rect.w - (cat_ax.labels.arrLabels.length - 1 - i)*point_width - gap_hor_axis/Math.sqrt(2)- point_width/2;
                            var y1 = cat_ax.labels.y + gap_hor_axis/Math.sqrt(2);
                            var xc = x1 - max_width/(2*Math.sqrt(2));
                            var yc = y1 - max_width/(2*Math.sqrt(2));
                            var t = cat_ax.labels.arrLabels[i].transformText;
                            t.Reset();
                            global_MatrixTransformer.TranslateAppend(t, -max_width/2, 0);
                            global_MatrixTransformer.RotateRadAppend(t, Math.PI/4);
                            global_MatrixTransformer.TranslateAppend(t, xc, yc + max_width/2);
                            global_MatrixTransformer.MultiplyAppend(t, this.getTransformMatrix());
                            cat_ax.xPoints.push({pos:rect.x + rect.w - (cat_ax.labels.arrLabels.length - 1 - i)*point_width - point_width/2, val: i});
                        }
                    }
                    val_ax.posX = val_ax.labels.x + val_ax.labels.extX;
                    cat_ax.posY = cat_ax.labels.y;
                }
                break;
            }
        }
    }
};

function CreateUnifillSolidFillSchemeColor(colorId, tintOrShade)
{
    var unifill = new CUniFill();
    unifill.setFill(new CSolidFill());
    unifill.fill.setColor(new CUniColor());
    unifill.fill.color.setColor(new CSchemeColor());
    unifill.fill.color.color.setId(colorId);
    return CreateUniFillSolidFillWidthTintOrShade(unifill, tintOrShade);
}

function CreateNoFillLine()
{
    var ret = new CLn();
    ret.setFill(CreateNoFillUniFill());
    return ret;
}

function CreateNoFillUniFill()
{
    var ret = new CUniFill();
    ret.setFill(new CNoFill());
    return ret;
}