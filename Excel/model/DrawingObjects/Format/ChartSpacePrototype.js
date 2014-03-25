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

CChartSpace.prototype.draw = function(graphics)
{
    /*this.setRecalculateInfo();
     this.recalculate();*/
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
        if(this.chart.legend)
        {
            this.chart.legend.draw(graphics);
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
        if(this.chart && this.chart.legend)
        {
            var pos = this.chartObj.reCalculatePositionText("legend", this, this.chart.legend);
            this.chart.legend.setPosition(pos.x, pos.y);
        }
        this.recalcInfo.axisLabels.length = 0;

    }, this, []);
};


CChartSpace.prototype.updateLinks = function()
{
    //Этот метод нужен, т. к. мы не полностью поддерживаем формат в котором в одном plotArea может быть несколько разных диаграмм(конкретных типов).
    // Здесь мы берем первую из диаграмм лежащих в массиве plotArea.charts, а также выставляем ссылки для осей ;
    if(this.chart && this.chart.plotArea)
    {
        this.chart.plotArea.chart = this.chart.plotArea.charts[0];
        if(this.chart.plotArea.chart.getAxisByTypes)
        {
            var axis_by_types = this.chart.plotArea.chart.getAxisByTypes();
            if(axis_by_types.valAx.length === 1 && axis_by_types.catAx.length === 1)
            {
                this.chart.plotArea.valAx = axis_by_types.valAx[0];
                this.chart.plotArea.catAx = axis_by_types.catAx[0];
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
        effectVal*=100000.0;
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
    var b_vary_markers = this.chart.plotArea.chart instanceof CDoughnutChart || this.chart.plotArea.chart instanceof CPieChart || (this.chart.plotArea.chart.varyColors && this.chart.plotArea.chart.series.length === 1);
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
            var percent = (-70 + 140 * ( (i + 1) / (need_create + 1) )) /100;
            var color = CreateUniFillSolidFillWidthTintOrShade(arrBaseFills[j], 1 - percent);
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
            if(!axis)
                return;
            function calcGridLine(defaultStyle, spPr, subtleLine, parents)
            {
                if(spPr)
                {
                    var compiled_grid_lines = new CLn();
                    compiled_grid_lines.merge(subtleLine);
                    if(compiled_grid_lines.Fill && compiled_grid_lines.Fill.fill && compiled_grid_lines.Fill.fill.color && compiled_grid_lines.Fill.fill.color.Mods)
                    {
                        compiled_grid_lines.Fill.fill.color.Mods.Mods.length = 0;
                    }
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
    if(this.chart.plotArea.chart.getObjectType() !== historyitem_type_LineChart && this.chart.plotArea.chart.getObjectType() !== historyitem_type_RadarChart  || this.chart.plotArea.chart.marker)
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
        if(this.chart.plotArea.chart.varyColors && (this.chart.plotArea.chart.series.length === 1 || this.chart.plotArea.chart.getObjectType() === historyitem_type_PieChart || this.chart.plotArea.chart.getObjectType() === historyitem_type_DoughnutChart))
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
    }
    else
    {
        var series = this.chart.plotArea.chart.series;
        for(var i = 0; i < series.length; ++i)
        {
            var ser = series[i];
            ser.compiledSeriesMarker = null;
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
                pts[j].compiledMarker = null;
            }
        }
    }

};

CChartSpace.prototype.recalculateSeriesColors = function()
{

    if(this.chart && this.chart.plotArea && this.chart.plotArea.chart && this.chart.plotArea.chart.series)
    {
        var style = CHART_STYLE_MANAGER.getStyleByIndex(this.style);
        var series = this.chart.plotArea.chart.series;
        var parents = this.getParentObjects();
        var RGBA = {R: 0, G: 0, B: 0, A: 255};
        if(this.chart.plotArea.chart.varyColors && series.length === 1 || ((this.chart.plotArea.chart instanceof CPieChart || this.chart.plotArea.chart instanceof CDoughnutChart)  && this.chart.plotArea.chart.varyColors))
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
                            if(ser.spPr && ser.spPr.ln)
                                compiled_line.merge(ser.spPr.ln);
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
                            if(ser.spPr && ser.spPr.ln)
                                compiled_line.merge(ser.spPr.ln);
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
        }
        else
        {
            if(!(this.chart.plotArea.chart instanceof CLineChart || this.chart.plotArea.chart instanceof  CScatterChart || this.chart.plotArea.chart instanceof CRadarChart))
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
                        if(j === 0)
                            ser.compiledSeriesBrush = compiled_brush.createDuplicate();
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
                                if(j === 0)
                                    ser.compiledSeriesPen = compiled_line.createDuplicate();
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
                            for(var j = 0; j < pts.length; ++j)
                            {
                                var compiled_line = new CLn();
                                compiled_line.merge(default_line);
                                compiled_line.Fill.merge(base_line_fills[i]);
                                if(ser.spPr && ser.spPr.ln)
                                {
                                    compiled_line.merge(ser.spPr.ln);
                                }
                                if(j === 0)
                                    ser.compiledSeriesPen = compiled_line.createDuplicate();
                                if(Array.isArray(ser.dPt))
                                {
                                    for(var j = 0; j < ser.dPt.length; ++j)
                                    {
                                        if(ser.dPt[j].idx === pts[j].idx)
                                        {
                                            if(ser.dPt[j].spPr)
                                            {
                                                compiled_line.merge(ser.dPt[j].spPr.ln);
                                            }
                                            break;
                                        }
                                    }
                                }
                                pts[j].pen = compiled_line;
                                pts[j].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
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
                        if(ser.spPr && ser.spPr.ln)
                            compiled_line.merge(ser.spPr.ln);
                        if(j === 0)
                            ser.compiledSeriesPen = compiled_line.createDuplicate();
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
    return [].concat(this.chartObj.calcProp.scale);
};

CChartSpace.prototype.getXValAxisValues = function()
{
    if(!this.chartObj)
    {
        this.chartObj = new CChartsDrawer()
    }
    this.chartObj.preCalculateData(this);
    return [].concat(this.chartObj.calcProp.xScale);
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
        var chart_type = chart_object.getObjectType();
        if(chart_type === historyitem_type_ScatterChart)
        {
            var gap_hor_axis = 4;
            var axis = chart_object.axId;
            var x_ax, y_ax;
            for(i = 0; i < axis.length; ++i)
            {
                if(!x_ax && axis[i].axPos === AX_POS_B)
                {
                    x_ax = axis[i];
                }
                if(!y_ax && axis[i].axPos === AX_POS_L)
                {
                    y_ax = axis[i];
                }
                if(x_ax && y_ax)
                    break;
            }
            if(x_ax && y_ax)
            {
                /*new recalc*/
                y_ax.labels  = null;
                x_ax.labels  = null;
                var sizes = this.getChartSizes();
                var rect = {x: sizes.startX, y:sizes.startY, w:sizes.w, h: sizes.h};
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
                var left_align_labels = true;
                y_ax.labels = new CValAxisLabels(this);
                y_ax.yPoints = [];
                var max_width = 0;
                for(i = 0; i < arr_strings.length; ++i)
                {
                    var dlbl = new CDLbl();
                    dlbl.parent = y_ax;
                    dlbl.chart = this;
                    dlbl.spPr = y_ax.spPr;
                    dlbl.txPr = y_ax.txPr;
                    dlbl.tx = new CChartText();
                    dlbl.tx.rich = CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                    var cur_width = dlbl.tx.rich.recalculateByMaxWord().w;
                    if(cur_width > max_width)
                        max_width = cur_width;
                    y_ax.labels.arrLabels.push(dlbl);
                }

                if(isRealObject(y_ax.scaling) && isRealNumber(y_ax.scaling.logBase) && y_ax.scaling.logBase >= 2 && y_ax.scaling.logBase <= 1000)
                {
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        arr_val[i] = Math.log(arr_val[i])/Math.log(y_ax.scaling.logBase);
                    }
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
                        var rich_value = num_format.format(calc_value, CellValueType.number, 15);
                        string_pts.push({val:rich_value[0].text});
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

                if(isRealObject(x_ax.scaling) && isRealNumber(x_ax.scaling.logBase) && x_ax.scaling.logBase >= 2 && x_ax.scaling.logBase <= 1000)
                {
                    for(i = 0; i < arr_x_val.length; ++i)
                    {
                        arr_x_val[i] = Math.log(arr_x_val[i])/Math.log(x_ax.scaling.logBase);
                    }
                }

                x_ax.labels = new CValAxisLabels(this);
                var bottom_align_labels = true;
                var max_height = 0;
                for(i = 0; i < string_pts.length; ++i)
                {
                    var dlbl = new CDLbl();
                    dlbl.parent = x_ax;
                    dlbl.chart = this;
                    dlbl.spPr = x_ax.spPr;
                    dlbl.txPr = x_ax.txPr;
                    dlbl.tx = new CChartText();
                    dlbl.tx.rich = CreateTextBodyFromString(string_pts[i].val, this.getDrawingDocument(), dlbl);
                    var cur_height = dlbl.tx.rich.recalculateByMaxWord().h;
                    if(cur_height > max_height)
                        max_height = cur_height;
                    x_ax.labels.arrLabels.push(dlbl);
                }
                var vert_gap = x_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72);
                x_ax.labels.extY = max_height + vert_gap;


                /*расчитаем позицию блока с подпиясями вертикальной оси*/
                var x_ax_orientation = isRealObject(x_ax.scaling) && isRealNumber(x_ax.scaling.orientation) ? x_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                var crosses;//точка на горизонтальной оси где её пересекает вертикальная
                if(y_ax.crosses === CROSSES_AUTO_ZERO)
                {
                    if(arr_x_val[0] <=0 && arr_x_val[arr_x_val.length -1] >= 0)
                        crosses = 0;
                    else if(arr_x_val[0] > 0)
                        crosses = arr_x_val[0];
                    else
                        crosses = arr_x_val[arr_x_val.length-1];
                }
                else if(y_ax.crosses === CROSSES_MAX)
                    crosses =  arr_x_val[arr_x_val.length-1];
                else if(y_ax.crosses === CROSSES_MIN)
                    crosses = arr_x_val[0];
                else if(isRealNumber(y_ax.crossesAt) && arr_val[0] <= y_ax.crossesAt && arr_val[arr_val.length-1] >= y_ax.crossesAt)
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


                var hor_interval_width = rect.w/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                var vert_interval_height = rect.h/(arr_val[arr_val.length-1] - arr_val[0]);
                var arr_x_points = [], arr_y_points = [];
                var labels_pos = y_ax.tickLabelsPos;

                if(x_ax_orientation === ORIENTATION_MIN_MAX)
                {
                    switch(labels_pos)
                    {
                        case TICK_LABEL_POSITION_HIGH:
                        {
                            left_align_labels = false;
                            y_ax.labels.x = rect.x + rect.w - y_ax.labels.extX;
                            hor_interval_width = (rect.w-y_ax.labels.extX)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                            for(i = 0; i < arr_x_val.length; ++i)
                            {
                                arr_x_points[i] = rect.x + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                            }
                            y_ax.xPos = rect.x + (crosses-arr_x_val[0])*hor_interval_width;
                            break;
                        }
                        case TICK_LABEL_POSITION_LOW:
                        {
                            y_ax.labels.x = rect.x;
                            hor_interval_width = (rect.w-y_ax.labels.extX)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                            for(i = 0; i < arr_x_val.length; ++i)
                            {
                                arr_x_points[i] = rect.x + y_ax.labels.extX + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                            }
                            y_ax.xPos = rect.x + y_ax.labels.extX + (crosses-arr_x_val[0])*hor_interval_width;
                            break;
                        }
                        case TICK_LABEL_POSITION_NONE:
                        {
                            y_ax.labels = null;
                            for(i = 0; i < arr_x_val.length; ++i)
                            {
                                arr_x_points[i] = rect.x + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                            }
                            y_ax.xPos = rect.x + (crosses-arr_x_val[0])*hor_interval_width;
                            break;
                        }
                        default :
                        {//TICK_LABEL_POSITION_NEXT_TO рядом с осью
                            if(y_ax.crosses === CROSSES_MAX)
                            {
                                left_align_labels = false;
                                y_ax.labels.x = rect.x + rect.w - y_ax.labels.extX;
                                y_ax.xPos = rect.x + rect.w - y_ax.labels.extX;
                                hor_interval_width = (rect.w-y_ax.labels.extX)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = rect.x + hor_interval_width*(arr_x_val[i] - arr_x_val[0]);
                                }
                            }
                            else
                            {
                                if((crosses-arr_x_val[0])*hor_interval_width < y_ax.labels.extX)
                                {
                                    y_ax.labels.x = rect.x;
                                    hor_interval_width = (rect.w - y_ax.labels.extX)/(arr_x_val[arr_x_val.length-1] - crosses);
                                }
                                else
                                {
                                    y_ax.labels.x = rect.x + hor_interval_width*(crosses-arr_x_val[0]) - y_ax.labels.extX;
                                }
                                y_ax.xPos = y_ax.labels.x + y_ax.labels.extX;
                                for(i = 0; i < arr_x_val.length; ++i)
                                {
                                    arr_x_points[i] = y_ax.xPos + (arr_x_val[i] - crosses)*hor_interval_width;
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
                        case TICK_LABEL_POSITION_HIGH:
                        {
                            y_ax.labels.x = rect.x;
                            hor_interval_width = (rect.w - y_ax.labels.extX)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                            y_ax.xPos = rect.x + rect.w - (crosses - arr_x_val[0])*hor_interval_width;
                            for(i = 0; i < arr_x_val.length; ++i)
                            {
                                arr_x_points[i] = y_ax.xPos - (arr_x_val[i]-crosses)*hor_interval_width;
                            }
                            break;
                        }
                        case TICK_LABEL_POSITION_LOW:
                        {
                            left_align_labels = false;
                            y_ax.labels.x = rect.x + rect.w - y_ax.labels.extX;
                            hor_interval_width = (rect.w - y_ax.labels.extX)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                            y_ax.xPos = rect.x + rect.w - y_ax.labels.extX - (crosses - arr_x_val[0])*hor_interval_width;
                            for(i = 0; i < arr_x_val.length; ++i)
                            {
                                arr_x_points[i] = y_ax.xPos - (arr_x_val[i]-crosses)*hor_interval_width;
                            }
                            break;
                        }
                        case TICK_LABEL_POSITION_NONE:
                        {
                            y_ax.labels = null;
                            y_ax.xPos = rect.x + rect.w - (crosses - arr_x_val[0])*hor_interval_width;
                            for(i = 0; i < arr_x_val.length; ++i)
                            {
                                arr_x_points[i] = y_ax.xPos - (arr_x_val[i]-crosses)*hor_interval_width;
                            }
                            break;
                        }
                        default :
                        {//TICK_LABEL_POSITION_NEXT_TO рядом с осью

                            if(y_ax.crosses === CROSSES_MAX)
                            {
                                y_ax.labels.x = rect.x;
                                hor_interval_width = (rect.w - y_ax.labels.extX)/(arr_x_val[arr_x_val.length-1] - arr_x_val[0]);
                                y_ax.xPos = rect.x + rect.w - (crosses-arr_x_val[0])*hor_interval_width;
                            }
                            else
                            {
                                if((crosses-arr_x_val[0])*hor_interval_width < y_ax.labels.extX)
                                {
                                    y_ax.labels.x = rect.x + rect.w - y_ax.labels.extX;
                                    hor_interval_width = (rect.w - y_ax.labels.extX)/(arr_x_val[arr_x_val.length-1] - crosses);
                                }
                                else
                                {
                                    y_ax.labels.x = rect.x + rect.w - (crosses - arr_x_val[0])*hor_interval_width;
                                }
                                left_align_labels = false;
                                y_ax.xPos = rect.x + hor_interval_width*(arr_x_val[arr_x_val.length-1] - crosses);
                            }
                            for(i = 0;  i < arr_x_val.length; ++i)
                            {
                                arr_x_points[i] = y_ax.xPos - (arr_x_val[i] - crosses)*hor_interval_width;
                            }
                            break;
                        }
                    }
                }

                /*рассчитаем позицию блока с подписями горизонтальной оси*/
                var y_ax_orientation = isRealObject(y_ax.scaling) && isRealNumber(y_ax.scaling.orientation) ? y_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                var crosses_x;
                if(x_ax.crosses === CROSSES_AUTO_ZERO)
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
                else if(x_ax.crosses === CROSSES_MAX)
                {
                    crosses_x = arr_val[arr_val.length-1];
                }
                else if(x_ax.crosses === CROSSES_MIN)
                {
                    crosses_x = arr_val[0];
                }
                else if(isRealNumber(x_ax.crossesAt) && arr_val[0] <= x_ax.crossesAt && arr_val[arr_val.length-1] >= x_ax.crossesAt)
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
                if(y_ax_orientation === ORIENTATION_MIN_MAX)
                {
                    switch(tick_labels_pos_x)
                    {
                        case TICK_LABEL_POSITION_HIGH:
                        {
                            bottom_align_labels = false;
                            x_ax.labels.y = rect.y;
                            vert_interval_height = (rect.h - x_ax.labels.extY)/(arr_val[arr_val.length-1] - arr_val[0]);
                            for(i = 0; i < arr_val.length; ++i)
                            {
                                arr_y_points[i] = rect.y +x_ax.labels.extY + (arr_val[i] - arr_val[0])*vert_interval_height;
                            }
                            x_ax.yPos = rect.y + rect.h - (crosses_x - arr_val[0])*vert_interval_height;
                            break;
                        }
                        case TICK_LABEL_POSITION_LOW:
                        {
                            x_ax.labels.y = rect.y + rect.h - x_ax.labels.extY;
                            vert_interval_height = (rect.h - x_ax.labels.extY)/(arr_val[arr_val.length-1] - arr_val[0]);
                            for(i = 0; i < arr_val.length; ++i)
                            {
                                arr_y_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0])*vert_interval_height;
                            }
                            x_ax.yPos = rect.y + rect.h - x_ax.labels.extY - (crosses_x - arr_val[0])*vert_interval_height;
                            break;
                        }
                        case TICK_LABEL_POSITION_NONE:
                        {
                            x_ax.labels = null;
                            for(i = 0; i < arr_val.length; ++i)
                            {
                                arr_y_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0])*vert_interval_height;
                            }
                            x_ax.yPos = rect.y + rect.h - (crosses_x - arr_val[0])*vert_interval_height;
                            break;
                        }
                        default :
                        {//TICK_LABEL_POSITION_NEXT_TO рядом с осью
                            if(x_ax.crosses === CROSSES_MAX)
                            {
                                bottom_align_labels = false;
                                x_ax.labels.y = rect.y;
                                vert_interval_height = (rect.h - x_ax.labels.extY)/(arr_val[arr_val.length-1] - arr_val[0]);
                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0])*vert_interval_height;
                                }
                                x_ax.yPos = rect.y + rect.h - (crosses_x - arr_val[0])*vert_interval_height;
                            }
                            else
                            {
                                if((crosses_x-arr_val[0])*vert_interval_height < x_ax.labels.extY)
                                {
                                    x_ax.labels.y = rect.y + rect.h - x_ax.labels.extY;
                                    vert_interval_height = (rect.h - x_ax.labels.extY)/(arr_val[arr_val.length-1] - crosses_x);
                                }
                                else
                                {
                                    x_ax.labels.y = rect.y + rect.h - (crosses_x - arr_val[0])*vert_interval_height;
                                }
                                x_ax.yPos = x_ax.labels.y;
                                for(i = 0;i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = x_ax.yPos - (arr_val[i] - crosses_x)*vert_interval_height;
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
                        case TICK_LABEL_POSITION_HIGH:
                        {
                            x_ax.labels.y = rect.y + rect.h - x_ax.labels.extY;
                            vert_interval_height = (rect.h - x_ax.labels.extY)/(arr_val[arr_val.length-1] - arr_val[0]);
                            x_ax.yPos = rect.y + (crosses_x - arr_val[0])*vert_interval_height;
                            for(i = 0; i < arr_val.length; ++i)
                            {
                                arr_y_points[i] = rect.y + vert_interval_height*(arr_val[i] - arr_val[0]);
                            }
                            break;
                        }
                        case TICK_LABEL_POSITION_LOW:
                        {
                            bottom_align_labels = false;
                            x_ax.labels.y = rect.y;
                            vert_interval_height = (rect.h - x_ax.labels.extY)/(arr_val[arr_val.length-1] - arr_val[0]);
                            x_ax.yPos = rect.y + x_ax.labels.extY + (crosses_x- arr_val[0])*vert_interval_height;
                            for(i = 0; i < arr_val.length; ++i)
                            {
                                arr_y_points[i] = rect.y + x_ax.labels.extY + vert_interval_height*(arr_val[i] - arr_val[0]);
                            }
                            break;
                        }
                        case TICK_LABEL_POSITION_NONE:
                        {
                            x_ax.labels = null;
                            x_ax.yPos = rect.y + (crosses_x-arr_val[0])*vert_interval_height;
                            for(i = 0; i < arr_val.length;++i)
                            {
                                arr_y_points[i] = rect.y + vert_interval_height*(arr_val[i] - arr_val[0]);
                            }
                            break;
                        }
                        default :
                        {//TICK_LABEL_POSITION_NEXT_TO рядом с осью
                            if(x_ax.crosses === CROSSES_MAX)
                            {
                                x_ax.labels.y = rect.y + rect.extY - x_ax.labels.extY;
                                vert_interval_height = (rect.h - x_ax.labels.extY)/(arr_val[arr_val.length-1] - arr_val[0]);
                                x_ax.yPos = rect.y + (crosses_x-arr_val[0])*vert_interval_height;
                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = rect.y + vert_interval_height*(arr_val[i] - arr_val[0]);
                                }
                            }
                            else
                            {
                                bottom_align_labels = false;
                                if((crosses_x-arr_val[0])*vert_interval_height < x_ax.labels.extY)
                                {
                                    x_ax.labels.y = rect.y;
                                    x_ax.yPos = rect.y + x_ax.labels.extY;
                                    vert_interval_height = (rect.h-x_ax.labels.extY)/(arr_val[arr_val.length-1] - crosses_x);
                                }
                                else
                                {
                                    x_ax.labels.y = rect.y + vert_interval_height*(crosses_x - arr_val[0]) - x_ax.labels.extY;
                                    x_ax.yPos = rect.y + vert_interval_height*(crosses_x - arr_val[0]);
                                }
                                for(i = 0; i < arr_val.length; ++i)
                                {
                                    arr_y_points[i] = x_ax.yPos + vert_interval_height*(arr_val[i] - crosses_x);
                                }
                            }
                            break;
                        }
                    }
                }


                if(isRealObject(y_ax.scaling) && isRealNumber(y_ax.scaling.logBase) && y_ax.scaling.logBase >= 2 && y_ax.scaling.logBase <= 1000)
                {
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        arr_val[i] = Math.pow(y_ax.scaling.logBase, arr_val[i]);
                    }
                }


                y_ax.yPoints = [];
                for(i = 0; i < arr_val.length; ++i)
                {
                    y_ax.yPoints.push({pos: arr_y_points[i], val: arr_val[i]});
                }



                if(isRealObject(x_ax.scaling) && isRealNumber(x_ax.scaling.logBase) && x_ax.scaling.logBase >= 2 && x_ax.scaling.logBase <= 1000)
                {
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        arr_x_val[i] = Math.pow(x_ax.scaling.logBase, arr_x_val[i]);
                    }
                }

                x_ax.xPoints = [];
                for(i = 0; i < arr_x_val.length; ++i)
                {
                    x_ax.xPoints.push({pos: arr_x_points[i], val: arr_x_val[i]});
                }

                var arr_labels;
                var text_transform;
                if(x_ax.labels)
                {
                    arr_labels = x_ax.labels.arrLabels;
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
                                global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());
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
                                global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());
                            }
                        }
                    }
                }


                if(y_ax.labels)
                {
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
                               global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());
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
                                global_MatrixTransformer.MultiplyAppend(text_transform, this.getTransformMatrix());
                            }
                        }
                    }
                }

                /*new recalc*/


            }
        }
        else if(chart_type === historyitem_type_RadarChart)
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
                var rect = {x: sizes.startX, y:sizes.startY, w:sizes.w, h: sizes.h};
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
                        val_ax.labels.extY *= ((rect.h - gap)/rect.h);
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
                        point_width -= (rect.x - min_x)/string_pts.length;
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
                        val_ax.yPoints[i].pos = val_ax.labels.y + dist*(val_ax.labels.arrLabels.length - i -1);
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


                cat_ax.xPoints.sort(function(a, b){return a.val - b.val});
                val_ax.yPoints.sort(function(a, b){return a.val - b.val});
            }
        }
        else if(chart_type !== historyitem_type_BarChart && (chart_type !== historyitem_type_PieChart && chart_type !== historyitem_type_DoughnutChart)
            || (chart_type === historyitem_type_BarChart && chart_object.barDir === BAR_DIR_COL))
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
                var rect = {x: sizes.startX, y:sizes.startY, w:sizes.w, h: sizes.h};
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


                /*если у нас шкала логарифмическая то будем вместо полученных значений использовать логарифм*/
                if(isRealObject(val_ax.scaling) && isRealNumber(val_ax.scaling.logBase) && val_ax.scaling.logBase >= 2 && val_ax.scaling.logBase <= 1000)
                {
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        arr_val[i] = Math.log(arr_val[i])/Math.log(val_ax.scaling.logBase);
                    }
                }

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
                    var cur_width = dlbl.tx.rich.recalculateByMaxWord().w;
                    if(cur_width > max_width)
                        max_width = cur_width;
                    val_ax.labels.arrLabels.push(dlbl);
                    val_ax.yPoints.push({val: arr_val[i], pos: null});

                }
                var val_axis_labels_gap = val_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*25.4/72;
                val_ax.labels.extX = max_width + val_axis_labels_gap;

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
                /*---------------------расчет позиции блока с подписями вертикальной оси-----------------------------------------------------------------------------*/
                //расчитаем ширину интервала без учета горизонтальной оси;
                var crosses;//номер категории в которой вертикалная ось пересекает горизонтальную;
                if(val_ax.crosses === CROSSES_AUTO_ZERO || val_ax.crosses === CROSSES_MIN)
                    crosses = 1;
                else if(val_ax.crosses === CROSSES_MAX)
                    crosses = string_pts.length;
                else if(isRealNumber(val_ax.crossesAt))
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

                var cat_ax_orientation = cat_ax.scaling && isRealNumber(cat_ax.scaling.orientation) ?  cat_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                var point_width = rect.w/string_pts.length;
                var labels_pos = val_ax.tickLblPos;
                var cross_between = isRealNumber(val_ax.crossBetween) ? val_ax.crossBetween : CROSS_BETWEEN_MID_CAT;

                var left_val_ax_labels_align = true;//приленгание подписей оси значений к левому краю.

                var intervals_count = cross_between === CROSS_BETWEEN_MID_CAT ? string_pts.length - 1 : string_pts.length;
                var point_interval  = rect.w/intervals_count;//интервал между точками. Зависит от crossBetween, а также будет потом корректироваться в зависимости от подписей вертикальной и горизонтальной оси.

                if(cross_between === CROSS_BETWEEN_MID_CAT)
                    point_interval = rect.w/(string_pts.length - 1);
                else
                    point_interval = rect.w/string_pts.length;

                var left_points_width, right_point_width;
                var arr_cat_labels_points = [];//массив середин подписей горизонтальной оси; i-й элемент - x-координата центра подписи категории с номером i;
                if(cat_ax_orientation === ORIENTATION_MIN_MAX)
                {
                    if(labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(labels_pos)) //подписи рядом с осью
                    {
                        if(val_ax.crosses === CROSSES_MAX)
                        {
                            left_val_ax_labels_align = false;
                            val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;
                            point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                            val_ax.posX = val_ax.labels.x;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                        else
                        {
                            left_points_width = point_interval*(crosses-1);//общая ширина левых точек если считать что точки занимают все пространство
                            if(left_points_width < val_ax.labels.extX)//подписи верт. оси выходят за пределы области построения
                            {
                                var right_intervals_count = intervals_count - (crosses-1);//количесво интервалов правее вертикальной оси
                                //скорректируем point_interval, поделив расстояние, которое осталось справа от подписей осей на количество интервалов справа
                                point_interval = (rect.w - val_ax.labels.extX)/right_intervals_count;
                                val_ax.labels.x = rect.x;
                                var start_point = val_ax.labels.x + val_ax.labels.extX - (crosses-1)*point_interval;//x-координата точки, где начинается собственно область диаграммы
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = start_point + point_interval*i;
                                }
                                else
                                {
                                    for(i = 0; i < string_pts.length; ++i)
                                        arr_cat_labels_points[i] = point_interval/2 + start_point + point_interval*i;
                                }
                            }
                            else
                            {
                                val_ax.labels.x = rect.x + left_points_width - val_ax.labels.extX;
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                            val_ax.posX = val_ax.labels.x + val_ax.labels.extX;
                        }
                    }
                    else if(labels_pos === TICK_LABEL_POSITION_LOW)//подписи слева от области построения
                    {
                        point_interval = (rect.w -  val_ax.labels.extX)/intervals_count;
                        val_ax.labels.x = rect.x;
                        if(cross_between === CROSS_BETWEEN_MID_CAT)
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.x + val_ax.labels.extX + point_interval*i;
                        }
                        else
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = rect.x + val_ax.labels.extX + point_interval/2 + point_interval*i;
                        }
                        val_ax.posX = val_ax.labels.x + val_ax.labels.extX + point_interval*(crosses-1);;
                    }
                    else if(labels_pos === TICK_LABEL_POSITION_HIGH)//подписи справа от области построения
                    {
                        point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                        val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;
                        left_val_ax_labels_align = false;
                        if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                        if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                    if(labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(labels_pos)) //подписи рядом с осью
                    {
                        if(val_ax.crosses === CROSSES_MAX)
                        {
                            val_ax.labels.x = rect.x;
                            point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval*i;
                            }
                            else
                            {
                                for(i = 0; i < string_pts.length; ++i)
                                    arr_cat_labels_points[i] = rect.x + rect.w - point_interval/2 - point_interval*i;
                            }
                            val_ax.posX = val_ax.labels.x + val_ax.labels.extX;
                        }
                        else
                        {
                            left_val_ax_labels_align = false;
                            right_point_width = point_interval*(crosses-1);
                            if(right_point_width < val_ax.labels.extX)
                            {
                                val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;
                                var left_points_interval_count = intervals_count - (crosses - 1);
                                point_interval = (val_ax.labels.x - rect.x)/left_points_interval_count;
                                var start_point_right = rect.x + point_interval*intervals_count;
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                    else if(labels_pos === TICK_LABEL_POSITION_LOW)//подписи справа от области построения
                    {
                        left_val_ax_labels_align = false;
                        point_interval = (rect.w -  val_ax.labels.extX)/intervals_count;
                        val_ax.labels.x = rect.x + rect.w - val_ax.labels.extX;

                        if(cross_between === CROSS_BETWEEN_MID_CAT)
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = val_ax.labels.x - point_interval*i;
                        }
                        else
                        {
                            for(i = 0; i < string_pts.length; ++i)
                                arr_cat_labels_points[i] = val_ax.labels.x - point_interval/2 - point_interval*i;
                        }
                        val_ax.posX = rect.x + rect.w - point_interval*(crosses-1) - val_ax.labels.extX;
                    }
                    else if(labels_pos === TICK_LABEL_POSITION_HIGH)//подписи слева от области построения
                    {
                        point_interval = (rect.w - val_ax.labels.extX)/intervals_count;
                        val_ax.labels.x = rect.x;

                        if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                    else
                    {
                        val_ax.labels = null;
                        if(cross_between === CROSS_BETWEEN_MID_CAT)
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

                var diagram_width = point_interval*intervals_count;//размер области с самой диаграммой позже будет корректироватся;
                var max_cat_label_width = diagram_width / string_pts.length; // максимальная ширина подписи горизонтальной оси;


                cat_ax.labels = null;
                var b_rotated = false;//флаг означает, что водписи не уместились в отведенное для них пространство и их пришлось перевернуть.
                //проверим умещаются ли подписи горизонтальной оси в point_interval
                if(TICK_LABEL_POSITION_NONE !== cat_ax.tickLblPos) //будем корректировать вертикальные подписи только если есть горизонтальные
                {
                    cat_ax.labels = new CValAxisLabels(this);
                    var tick_lbl_skip = isRealNumber(cat_ax.tickLblSkip) ? cat_ax.tickLblSkip : 1;
                    var max_min_width = 0;
                    var max_max_width = 0;
                    var arr_max_contents = [];
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
                            //dlbl.recalculate();

                            var content = dlbl.tx.rich.content;
                            content.Set_ApplyToAll(true);
                            content.Set_ParagraphAlign(align_Center);
                            content.Set_ApplyToAll(false);
                            dlbl.txBody = dlbl.tx.rich;

                            var min_max =  dlbl.tx.rich.content.Recalculate_MinMaxContentWidth();
                            var max_min_content_width = min_max.Min;
                            if(max_min_content_width > max_min_width)
                                max_min_width = max_min_content_width;
                            if(min_max.Max > max_max_width)
                                max_max_width = min_max.Max;
                        }
                        cat_ax.labels.arrLabels.push(dlbl);
                    }
                    var stake_offset = isRealNumber(cat_ax.lblOffset) ? cat_ax.lblOffset/100 : 1;
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
                        if(cross_between === CROSS_BETWEEN_MID_CAT) //корректируем позиции центров подписей горизонтальной оси, положение  вертикальной оси и её подписей
                        {
                            var left_gap_point, right_gap_point;
                            if(cat_ax_orientation === ORIENTATION_MIN_MAX)
                            {
                                var first_label_left_gap = cat_ax.labels.arrLabels[0].tx.rich.getMaxContentWidth(max_cat_label_width)/2;//на сколько вправа выходит первая подпись
                                var last_labels_right_gap = cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1] ? cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1].tx.rich.getMaxContentWidth(max_cat_label_width)/2 : 0;

                                //смотрим, выходит ли подпись первой категориии выходит за пределы области построения
                                left_gap_point = arr_cat_labels_points[0] - first_label_left_gap;
                                if(rect.x > left_gap_point)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= (rect.w/(rect.x + rect.w - left_gap_point));
                                    //скорректируем arr_cat_labels_points
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }
                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX =  rect.x + (val_ax.posX - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                }

                                //смотри выходит ли подпись последней категории за пределы области построения
                                right_gap_point = arr_cat_labels_points[arr_cat_labels_points.length - 1] + last_labels_right_gap;
                                if(right_gap_point > rect.x + rect.w)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*(rect.w/(right_gap_point - rect.x));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= (rect.w/(right_gap_point - rect.x));
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)*(rect.w/(right_gap_point - rect.x));
                                    }
                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - rect.x)*(rect.w/(right_gap_point - rect.x));

                                }
                            }
                            else
                            {
                                var last_label_left_gap = cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1] ? cat_ax.labels.arrLabels[cat_ax.labels.arrLabels.length - 1].tx.rich.getMaxContentWidth(max_cat_label_width)/2 : 0;
                                var first_label_right_gap = cat_ax.labels.arrLabels[0].tx.rich.getMaxContentWidth(max_cat_label_width)/2;
                                left_gap_point = arr_cat_labels_points[arr_cat_labels_points.length - 1] - last_label_left_gap;
                                right_gap_point = arr_cat_labels_points[0] + first_label_right_gap;
                                if(rect.x > left_gap_point)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= (rect.w/(rect.x + rect.w - left_gap_point));
                                    //скорректируем arr_cat_labels_points
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                    }

                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                }
                                if(right_gap_point > rect.x + rect.w)
                                {
                                    if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                    {
                                        val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*(rect.w/(right_gap_point - rect.x));
                                    }
                                    //скорректируем point_interval
                                    point_interval *= (rect.w/(right_gap_point - rect.x));
                                    for(i = 0; i < arr_cat_labels_points.length; ++i)
                                    {
                                        arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)*(rect.w/(right_gap_point - rect.x));
                                    }
                                    //скорректируем позицию вертикальной оси
                                    val_ax.posX = rect.x + (val_ax.posX - rect.x)*(rect.w/(right_gap_point - rect.x));
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

                        if(ORIENTATION_MIN_MAX === cat_ax_orientation)
                        {
                            if(rect.x > left_gap_point)
                            {
                                if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                {
                                    val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                }
                                //скорректируем point_interval
                                point_interval *= rect.w/(rect.x + rect.w - left_gap_point);
                                //скорректируем arr_cat_labels_points
                                for(i = 0; i < arr_cat_labels_points.length; ++i)
                                {
                                    arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                }

                                //скорректируем позицию вертикальной оси
                                val_ax.posX = rect.x + (val_ax.posX - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                            }
                            //смотри выходит ли подпись последней категории за пределы области построения
                            if(right_gap_point > rect.x + rect.w)
                            {
                                if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                {
                                    val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*(rect.w/(right_gap_point - rect.x));
                                }
                                //скорректируем point_interval
                                point_interval *= (right_gap_point - rect.x)/(rect.x + rect.w - rect.x);
                                for(i = 0; i < arr_cat_labels_points.length; ++i)
                                {
                                    arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)*(rect.w/(right_gap_point - rect.x));
                                }


                                //скорректируем позицию вертикальной оси
                                val_ax.posX = rect.x + (val_ax.posX - rect.x)*(rect.w/(right_gap_point - rect.x));
                            }
                        }
                        else
                        {
                            if(rect.x > left_gap_point)
                            {
                                if(val_ax.labels)//скорректируем позицию подписей вертикальной оси, если они есть
                                {
                                    val_ax.labels.x = rect.x + (val_ax.labels.x - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                }
                                //скорректируем point_interval
                                point_interval *= (rect.w)/(rect.x + rect.w - left_gap_point);
                                //скорректируем arr_cat_labels_points
                                for(i = 0; i < arr_cat_labels_points.length; ++i)
                                {
                                    arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                                }

                                //скорректируем позицию вертикальной оси
                                val_ax.posX = rect.x + (val_ax.posX - left_gap_point)*(rect.w/(rect.x + rect.w - left_gap_point));
                            }
                            if(right_gap_point > rect.x + rect.w)
                            {
                                if(val_ax.labels)//скорректируем позицию подписей вертикальной оси
                                {
                                    val_ax.labels.x = rect.x + (val_ax.labels.x - rect.x)*(rect.w/(right_gap_point - rect.x));
                                }
                                //скорректируем point_interval
                                point_interval *= (right_gap_point - rect.x)/(rect.x + rect.w - rect.x);
                                for(i = 0; i < arr_cat_labels_points.length; ++i)
                                {
                                    arr_cat_labels_points[i] = rect.x + (arr_cat_labels_points[i] - rect.x)(rect.w/(right_gap_point - rect.x));
                                }

                                //скорректируем позицию вертикальной оси
                                val_ax.posX = rect.x + (val_ax.posX - rect.x)*(rect.w/(right_gap_point - rect.x));
                            }
                        }
                    }
                }
                //расчет позиции блока с подписями горизонтальной оси
                var cat_labels_align_bottom = true;
                /*-----------------------------------------------------------------------*/
                var crosses_val_ax;//значение на ветикальной оси в котором её пересекает горизонтальная

                if(cat_ax.crosses === CROSSES_AUTO_ZERO)
                {
                    if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                        crosses_val_ax = 0;
                    else if(arr_val[arr_val.length-1] < 0)
                        crosses_val_ax = arr_val[arr_val.length-1];
                    else
                        crosses_val_ax = arr_val[0];
                }
                else if(cat_ax.crosses === CROSSES_MIN)
                {
                    crosses_val_ax = arr_val[0];
                }
                else if(cat_ax.crosses === CROSSES_MAX)
                {
                    crosses_val_ax = arr_val[arr_val.length - 1];
                }
                else if(isRealNumber(cat_ax.crossesAt) && cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                {
                    //сделаем провеку на попадание в интервал
                    if(cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                        crosses_val_ax = cat_ax.crossesAt;
                }
                else
                { //ведем себя как в случае (cat_ax.crosses === CROSSES_AUTO_ZERO)
                    if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                        crosses_val_ax = 0;
                    else if(arr_val[arr_val.length-1] < 0)
                        crosses_val_ax = arr_val[arr_val.length-1];
                    else
                        crosses_val_ax = arr_val[0];
                }
                var val_ax_orientation = val_ax.scaling && isRealNumber(val_ax.scaling.orientation) ? val_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                var hor_labels_pos = cat_ax.tickLblPos;

                var arr_val_labels_points = [];//массив середин подписей вертикальной оси; i-й элемент - y-координата центра подписи i-огто значения;
                var unit_height = rect.h/(arr_val[arr_val.length - 1] - arr_val[0]);//высота единицы измерения на вертикальной оси
                if(val_ax_orientation === ORIENTATION_MIN_MAX)
                {
                    if(hor_labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(hor_labels_pos))
                    {
                        if(cat_ax.crosses === CROSSES_MAX)
                        {
                            cat_labels_align_bottom = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                            cat_ax.labels.y = rect.y;
                            unit_height = (rect.h - cat_ax.labels.extY)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0])*unit_height;
                            cat_ax.posY = cat_ax.labels.y + cat_ax.labels.extY;
                        }
                        else
                        {
                            var bottom_points_height = (crosses_val_ax - arr_val[0])*unit_height;//высота области под горизонтальной осью
                            if(bottom_points_height < cat_ax.labels.extY)
                            {
                                var top_points_height = rect.h - cat_ax.labels.extY;
                                cat_ax.labels.y = rect.y + rect.h - cat_ax.labels.extY;
                                unit_height = (cat_ax.labels.y - rect.y)/(arr_val[arr_val.length-1]-crosses_val_ax);

                                var bottom_point = rect.y + unit_height*(arr_val[arr_val.length - 1] - arr_val[0]);
                                for(i = 0; i < arr_val.length; ++i)
                                    arr_val_labels_points[i] = bottom_point - (arr_val[i] - arr_val[0])*unit_height;
                            }
                            else
                            {
                                cat_ax.labels.y = rect.y + (arr_val[arr_val.length-1] - crosses_val_ax)*unit_height;
                                for(i = 0; i < arr_val.length; ++i)
                                    arr_val_labels_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0])*unit_height;
                            }
                            cat_ax.posY = cat_ax.labels.y;
                        }
                    }
                    else if(hor_labels_pos === TICK_LABEL_POSITION_LOW)
                    {
                        cat_ax.labels.y = rect.y + rect.h - cat_ax.labels.extY;
                        unit_height = (rect.h - cat_ax.labels.extY)/(arr_val[arr_val.length - 1] - arr_val[0]);

                        var bottom_point = rect.y + unit_height*(arr_val[arr_val.length - 1] - arr_val[0]);
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = bottom_point - (arr_val[i] - arr_val[0])*unit_height;

                        cat_ax.posY = cat_ax.labels.y - (crosses_val_ax - arr_val[0])*unit_height;
                    }
                    else if(hor_labels_pos === TICK_LABEL_POSITION_HIGH)
                    {
                        cat_labels_align_bottom = false;
                        cat_ax.labels.y = rect.y;
                        unit_height = (rect.h - cat_ax.labels.extY)/(arr_val[arr_val.length - 1] - arr_val[0]);
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0])*unit_height;


                        cat_ax.posY = rect.y + rect.h + cat_ax.labels.extY - (crosses_val_ax - arr_val[0])*unit_height;
                    }
                    else
                    {
                        //подписей осей нет
                        cat_ax.labels = null;
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = rect.y + rect.h - (arr_val[i] - arr_val[0])*unit_height;
                        cat_ax.posY = rect.y + rect.h - (crosses_val_ax - arr_val[0])*unit_height;
                    }
                }
                else
                {//зеркально отражаем
                    if(hor_labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(hor_labels_pos))
                    {
                        if(cat_ax.crosses === CROSSES_MAX)
                        {
                            cat_ax.labels.y = rect.y + rect.h - cat_ax.labels.extY;
                            unit_height = (rect.h - cat_ax.labels.extY)/(arr_val[arr_val.length - 1] - arr_val[0]);

                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = rect.y + (arr_val[i] - arr_val[0])*unit_height;

                        }
                        else
                        {
                            cat_labels_align_bottom = false;
                            var top_points_height = (crosses_val_ax - arr_val[0])*unit_height;
                            if(top_points_height < cat_ax.labels.extY)
                            {
                                cat_ax.labels.y = rect.y;
                                var bottom_points_height = rect.h - cat_ax.labels.extY;
                                unit_height = bottom_points_height/(arr_val[arr_val.length - 1] - crosses_val_ax);

                                var top_point = rect.y + rect.h - unit_height*(arr_val[arr_val.length-1] - arr_val[0]);
                                for(i = 0; i < arr_val.length; ++i)
                                    arr_val_labels_points[i] = top_point + (arr_val[i] - arr_val[0])*unit_height;
                            }
                            else
                            {
                                cat_ax.labels.y = rect.y + unit_height*(crosses_val_ax - arr_val[0]) - cat_ax.labels.extY;

                                for(i = 0; i < arr_val.length; ++i)
                                    arr_val_labels_points[i] = rect.y + (arr_val[i] - arr_val[0])*unit_height;
                            }
                        }
                    }
                    else if(hor_labels_pos === TICK_LABEL_POSITION_LOW)
                    {
                        cat_labels_align_bottom = false;
                        cat_ax.labels.y = rect.y;
                        unit_height = (rect.h - cat_ax.labels.extY)/(arr_val[arr_val.length-1] - arr_val[0]);
                        var top_point = rect.y + rect.h - unit_height*(arr_val[arr_val.length-1] - arr_val[0]);
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = top_point + (arr_val[i] - arr_val[0])*unit_height;

                    }
                    else if(hor_labels_pos === TICK_LABEL_POSITION_HIGH)
                    {
                        cat_ax.labels.y = rect.y + rect.h - cat_ax.labels.extY;
                        unit_height = (rect.h - cat_ax.labels.extY)/(arr_val[arr_val.length-1] - arr_val[0]);
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = rect.y + (arr_val[i] - arr_val[0])*unit_height;
                    }
                    else
                    {//подписей осей нет
                        cat_ax.labels = null;
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = rect.y + (arr_val[i] - arr_val[0])*unit_height;
                    }
                }
                //запишем в оси необходимую информацию для отрисовщика plotArea  и выставим окончательные позиции для подписей
                var arr_labels, transform_text;
                if(val_ax.labels)
                {
                    val_ax.labels.y = Math.min.apply(Math, arr_val_labels_points);
                    val_ax.labels.extY = Math.max.apply(Math, arr_val_labels_points) - Math.min.apply(Math, arr_val_labels_points);
                    arr_labels = val_ax.labels.arrLabels;
                    if(left_val_ax_labels_align)
                    {
                        for(i = 0; i < arr_labels.length; ++i)
                        {
                            arr_labels[i].txBody = arr_labels[i].tx.rich;
                            transform_text = arr_labels[i].transformText;
                            transform_text.Reset();
                            global_MatrixTransformer.TranslateAppend(transform_text, val_ax.labels.x + val_ax.labels.extX - val_axis_labels_gap - arr_labels[i].tx.rich.content.XLimit, arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                            global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());
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
                            global_MatrixTransformer.MultiplyAppend(transform_text, this.getTransformMatrix());
                        }
                    }
                }
                val_ax.yPoints = [];
                if(isRealObject(val_ax.scaling) && isRealNumber(val_ax.scaling.logBase) && val_ax.scaling.logBase >= 2 && val_ax.scaling.logBase <= 1000)
                {
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        arr_val[i] = Math.pow(val_ax.scaling.logBase, arr_val[i]);
                    }
                }
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
                    if(!b_rotated)//подписи не повернутые
                    {
                        if(cat_ax_orientation === ORIENTATION_MIN_MAX)
                        {
                            cat_ax.labels.x = arr_cat_labels_points[0] - max_cat_label_width/2;
                        }
                        else
                        {
                            cat_ax.labels.x = arr_cat_labels_points[arr_cat_labels_points.length-1] - max_cat_label_width/2;
                        }
                        cat_ax.labels.extX = max_cat_label_width*string_pts.length;

                        if(cat_labels_align_bottom)
                        {
                            for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                            {
                                if(cat_ax.labels.arrLabels[i])
                                {
                                    var label_text_transform = cat_ax.labels.arrLabels[i].transformText;
                                    label_text_transform.Reset();
                                    global_MatrixTransformer.TranslateAppend(label_text_transform, arr_cat_labels_points[i] - max_cat_label_width/2, cat_ax.labels.y + labels_offset);
                                    global_MatrixTransformer.MultiplyAppend(label_text_transform, this.getTransformMatrix());
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
                                    global_MatrixTransformer.MultiplyAppend(label_text_transform, this.getTransformMatrix());
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
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(align_Left);
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
                                    if(!isRealNumber(left_x))
                                    {
                                        left_x = xc - w2;
                                        right_x = xc + w2;
                                    }
                                    else
                                    {
                                        if(xc - w2 < left_x)
                                            left_x = xc - w2;
                                        if(xc + w2 > right_x)
                                            right_x = xc + w2;
                                    }
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
                                    cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(align_Left);
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

                                    if(!isRealNumber(left_x))
                                    {
                                        left_x = xc - w2;
                                        right_x = xc + w2;
                                    }
                                    else
                                    {
                                        if(xc - w2 < left_x)
                                            left_x = xc - w2;
                                        if(xc + w2 > right_x)
                                            right_x = xc + w2;
                                    }
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
        else if(chart_type === historyitem_type_BarChart && chart_object.barDir === BAR_DIR_BAR)
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
                var sizes = this.getChartSizes();
                var rect = {x: sizes.startX, y:sizes.startY, w:sizes.w, h: sizes.h};
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

                /*если у нас шкала логарифмическая то будем вместо полученных значений использовать логарифм*/
                if(isRealObject(val_ax.scaling) && isRealNumber(val_ax.scaling.logBase) && val_ax.scaling.logBase >= 2 && val_ax.scaling.logBase <= 1000)
                {
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        arr_val[i] = Math.log(arr_val[i])/Math.log(val_ax.scaling.logBase);
                    }
                }

                //расчитаем подписи горизонтальной оси значений
                val_ax.labels = new CValAxisLabels(this);
                var max_height = 0;
                val_ax.xPoints = [];
                for(i = 0; i < arr_strings.length; ++i)
                {
                    var dlbl = new CDLbl();
                    dlbl.parent = val_ax;
                    dlbl.chart = this;
                    dlbl.spPr = val_ax.spPr;
                    dlbl.txPr = val_ax.txPr;
                    dlbl.tx = new CChartText();
                    dlbl.tx.rich = CreateTextBodyFromString(arr_strings[i], this.getDrawingDocument(), dlbl);
                    dlbl.txBody = dlbl.tx.rich;
                    var h = dlbl.tx.rich.recalculateByMaxWord().h;
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
                /*---------------------расчет позиции блока с подписями вертикальной оси-----------------------------------------------------------------------------*/
                //расчитаем ширину интервала без учета горизонтальной оси;
                var crosses;//номер категории в которой вертикалная ось пересекает горизонтальную;
                if(val_ax.crosses === CROSSES_AUTO_ZERO || val_ax.crosses === CROSSES_MIN)
                    crosses = 1;
                else if(val_ax.crosses === CROSSES_MAX)
                    crosses = string_pts.length;
                else if(isRealNumber(val_ax.crossesAt))
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

                var cat_ax_orientation = cat_ax.scaling && isRealNumber(cat_ax.scaling.orientation) ?  cat_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                var labels_pos = val_ax.tickLblPos;
                var cross_between = isRealNumber(val_ax.crossBetween) ? val_ax.crossBetween : CROSS_BETWEEN_MID_CAT;

                var bottom_val_ax_labels_align = true;//приленгание подписей оси значений к левому краю.

                var intervals_count = cross_between === CROSS_BETWEEN_MID_CAT ? string_pts.length - 1 : string_pts.length;
                var point_interval  = rect.h/intervals_count;//интервал между точками. Зависит от crossBetween, а также будет потом корректироваться в зависимости от подписей вертикальной и горизонтальной оси.


                var bottom_points_height, top_point_height;
                var arr_cat_labels_points = [];//массив середин подписей горизонтальной оси; i-й элемент - x-координата центра подписи категории с номером i;
                if(cat_ax_orientation === ORIENTATION_MIN_MAX)
                {
                    if(labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(labels_pos)) //подписи рядом с осью
                    {
                        if(val_ax.crosses === CROSSES_MAX)
                        {
                            bottom_val_ax_labels_align = false;
                            val_ax.labels.y = rect.y;
                            point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                            val_ax.posY = val_ax.labels.y + val_ax.labels.extY;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                            if(bottom_points_height < val_ax.labels.extY)//подписи верт. оси выходят за пределы области построения
                            {
                                var top_intervals_count = intervals_count - (crosses - 1);//количесво интервалов выше горизонтальной оси
                                //скорректируем point_interval, поделив расстояние, которое осталось справа от подписей осей на количество интервалов справа
                                point_interval = (rect.h - val_ax.labels.extY)/top_intervals_count;
                                val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
                                var start_point = val_ax.labels.y + (crosses-1)*point_interval;//y-координата точки низа области постоения

                                if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                    else if(labels_pos === TICK_LABEL_POSITION_LOW)//подписи снизу от области построения
                    {
                        point_interval = (rect.h -  val_ax.labels.extY)/intervals_count;
                        val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
                        if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                    else if(labels_pos === TICK_LABEL_POSITION_HIGH)//подписи сверху от области построения
                    {
                        point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                        val_ax.labels.y = rect.y;
                        bottom_val_ax_labels_align = false;
                        if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                        if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                    if(labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(labels_pos)) //подписи рядом с осью
                    {
                        if(val_ax.crosses === CROSSES_MAX)
                        {
                            val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
                            point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                            if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                            if(top_point_height < val_ax.labels.extY)
                            {
                                val_ax.labels.y = rect.y;
                                var bottom_points_interval_count = intervals_count - (crosses - 1);
                                point_interval = (rect.h - val_ax.labels.extY)/bottom_points_interval_count;
                                var start_point_bottom = rect.y + rect.h - point_interval*intervals_count;
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                                if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                    else if(labels_pos === TICK_LABEL_POSITION_LOW)//подписи сверху от области построения
                    {
                        bottom_val_ax_labels_align = false;
                        point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                        val_ax.labels.y = rect.y;

                        if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                    else if(labels_pos === TICK_LABEL_POSITION_HIGH)//подписи снизу от области построения
                    {
                        point_interval = (rect.h - val_ax.labels.extY)/intervals_count;
                        val_ax.labels.y = rect.y + rect.h - val_ax.labels.extY;
                        if(cross_between === CROSS_BETWEEN_MID_CAT)
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
                        if(cross_between === CROSS_BETWEEN_MID_CAT)
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

                var diagram_height = point_interval*intervals_count;//размер области с самой диаграммой позже будет корректироватся;
                var max_cat_label_height = diagram_height / string_pts.length; // максимальная высота подписи горизонтальной оси;

                cat_ax.labels = null;
                var max_cat_labels_block_width = rect.w/2;
                if(TICK_LABEL_POSITION_NONE !== cat_ax.tickLblPos) //будем корректировать вертикальные подписи только если есть горизонтальные
                {
                    cat_ax.labels = new CValAxisLabels(this);
                    var tick_lbl_skip = isRealNumber(cat_ax.tickLblSkip) ? cat_ax.tickLblSkip : 1;
                    var max_min_width = 0;
                    var max_max_width = 0;
                    var max_content_width = 0;
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
                            if(min_max.Max > max_max_width)
                                max_max_width = min_max.Max;

                            if(dlbl.tx.rich.content.XLimit > max_content_width)
                                max_content_width = dlbl.tx.rich.content.XLimit;
                        }
                        cat_ax.labels.arrLabels.push(dlbl);
                    }
                    var stake_offset = isRealNumber(cat_ax.lblOffset) ? cat_ax.lblOffset/100 : 1;
                    var labels_offset = cat_ax.labels.arrLabels[0].tx.rich.content.Content[0].CompiledPr.Pr.TextPr.FontSize*(25.4/72)*stake_offset;
                    //сначала посмотрим убираются ли в максимальную допустимую ширину подписей подписи расчитанные в одну строку
                    if(max_content_width + labels_offset < max_cat_labels_block_width)
                    {
                        cat_ax.labels.extX = max_content_width + labels_offset;
                    }
                    else if(max_max_width + labels_offset < max_cat_labels_block_width)//ситуация, когда возможно разместить подписи без переноса слов
                    {
                        cat_ax.labels.extX = max_max_width + labels_offset;
                    }
                    else //выставляем максимально возможную ширину
                    {
                        cat_ax.labels.extX = max_cat_labels_block_width;
                    }
                }
                var cat_labels_align_left = true;//выравнивание подписей в блоке сподписями по левому краю(т. е. зазор находится справа)
                /*-----------------------------------------------------------------------*/
                var crosses_val_ax;//значение на горизонтальной оси значений в котором её пересекает горизонтальная
                if(cat_ax.crosses === CROSSES_AUTO_ZERO)
                {
                    if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                        crosses_val_ax = 0;
                    else if(arr_val[arr_val.length-1] < 0)
                        crosses_val_ax = arr_val[arr_val.length-1];
                    else
                        crosses_val_ax = arr_val[0];
                }
                else if(cat_ax.crosses === CROSSES_MIN)
                {
                    crosses_val_ax = arr_val[0];
                }
                else if(cat_ax.crosses === CROSSES_MAX)
                {
                    crosses_val_ax = arr_val[arr_val.length - 1];
                }
                else if(isRealNumber(cat_ax.crossesAt) && cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                {
                    //сделаем провеку на попадание в интервал
                    if(cat_ax.crossesAt >= arr_val[0] && cat_ax.crossesAt <= arr_val[arr_val.length - 1])
                        crosses_val_ax = cat_ax.crossesAt;
                }
                else
                { //ведем себя как в случае (cat_ax.crosses === CROSSES_AUTO_ZERO)
                    if(arr_val[0] <=0 && arr_val[arr_val.length-1] >= 0)
                        crosses_val_ax = 0;
                    else if(arr_val[arr_val.length-1] < 0)
                        crosses_val_ax = arr_val[arr_val.length-1];
                    else
                        crosses_val_ax = arr_val[0];
                }
                var val_ax_orientation = val_ax.scaling && isRealNumber(val_ax.scaling.orientation) ? val_ax.scaling.orientation : ORIENTATION_MIN_MAX;
                var hor_labels_pos = cat_ax.tickLblPos;

                var arr_val_labels_points = [];//массив середин подписей вертикальной оси; i-й элемент - x-координата центра подписи i-огто значения;
                var unit_width = rect.w/(arr_val[arr_val.length - 1] - arr_val[0]);//ширина единицы измерения на вертикальной оси
                if(val_ax_orientation === ORIENTATION_MIN_MAX)
                {
                    if(hor_labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(hor_labels_pos))
                    {
                        if(cat_ax.crosses === CROSSES_MAX)
                        {
                            cat_labels_align_left = false;//в данном случае подписи будут выравниваться по верхнему краю блока с подписями
                            cat_ax.labels.x = rect.x + rect.w - cat_ax.labels.extX;
                            unit_width = (rect.w - cat_ax.labels.extX)/(arr_val[arr_val.length - 1] - arr_val[0]);
                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = rect.x + (arr_val[i] - arr_val[0])*unit_width;
                            cat_ax.posX = cat_ax.labels.x;
                        }
                        else
                        {
                            var left_points_width = (crosses_val_ax - arr_val[0])*unit_width;//высота области под горизонтальной осью
                            if(left_points_width < cat_ax.labels.extX)
                            {
                                var right_points_width = rect.w - cat_ax.labels.extX;
                                cat_ax.labels.x = rect.x;
                                unit_width = (rect.w - cat_ax.labels.extX)/(arr_val[arr_val.length-1]-crosses_val_ax);

                                var left_point = rect.x + rect.w - unit_width*(arr_val[arr_val.length - 1] - arr_val[0]);
                                for(i = 0; i < arr_val.length; ++i)
                                    arr_val_labels_points[i] = left_point + (arr_val[i] - arr_val[0])*unit_width;
                            }
                            else
                            {
                                cat_ax.labels.x = rect.x + left_points_width - cat_ax.labels.extX;
                                for(i = 0; i < arr_val.length; ++i)
                                    arr_val_labels_points[i] = rect.x + (arr_val[i] - arr_val[0])*unit_width;
                            }
                            cat_ax.posX = cat_ax.labels.x + cat_ax.labels.extX;
                        }
                    }
                    else if(hor_labels_pos === TICK_LABEL_POSITION_LOW)
                    {
                        cat_ax.labels.x = rect.x;
                        unit_width = (rect.w - cat_ax.labels.extX)/(arr_val[arr_val.length - 1] - arr_val[0]);

                        var left_point = rect.x + cat_ax.labels.extX;
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = left_point + (arr_val[i] - arr_val[0])*unit_width;

                        cat_ax.posX = cat_ax.labels.x + cat_ax.labels.extX + (crosses_val_ax - arr_val[0])*unit_width;
                    }
                    else if(hor_labels_pos === TICK_LABEL_POSITION_HIGH)
                    {
                        cat_labels_align_left = false;
                        cat_ax.labels.x = rect.x + rect.w - cat_ax.labels.extX;
                        unit_width = (rect.w - cat_ax.labels.extX)/(arr_val[arr_val.length - 1] - arr_val[0]);
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = rect.x + (arr_val[i] - arr_val[0])*unit_width;
                        cat_ax.posX = rect.x + (crosses_val_ax - arr_val[0])*unit_width;
                    }
                    else
                    {
                        //подписей осей нет
                        cat_ax.labels = null;
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = rect.x + (arr_val[i] - arr_val[0])*unit_width;
                        cat_ax.posX = rect.x + (crosses_val_ax - arr_val[0])*unit_width;
                    }
                }
                else
                {//зеркально отражаем
                    if(hor_labels_pos === TICK_LABEL_POSITION_NEXT_TO || !isRealNumber(hor_labels_pos))
                    {
                        if(cat_ax.crosses === CROSSES_MAX)
                        {
                            cat_ax.labels.x = rect.x;
                            unit_width = (rect.w - cat_ax.labels.extX)/(arr_val[arr_val.length - 1] - arr_val[0]);

                            for(i = 0; i < arr_val.length; ++i)
                                arr_val_labels_points[i] = rect.x + rect.w - (arr_val[i] - arr_val[0])*unit_width;
                        }
                        else
                        {
                            cat_labels_align_left = false;
                            var right_points_width = (crosses_val_ax - arr_val[0])*unit_width;
                            if(right_points_width < cat_ax.labels.extX)
                            {
                                cat_ax.labels.x = rect.x + rect.w - cat_ax.labels.extX;

                                var left_points_width = rect.w - cat_ax.labels.extX;
                                unit_width = left_points_width/(arr_val[arr_val.length - 1] - crosses_val_ax);

                                var right_point = rect.x + unit_width*(arr_val[arr_val.length-1] - arr_val[0]);
                                for(i = 0; i < arr_val.length; ++i)
                                    arr_val_labels_points[i] = right_point - (arr_val[i] - arr_val[0])*unit_width;
                            }
                            else
                            {
                                cat_ax.labels.x = rect.x + rect.w - unit_width*(crosses_val_ax - arr_val[0]);
                                for(i = 0; i < arr_val.length; ++i)
                                    arr_val_labels_points[i] = rect.x + rect.w - (arr_val[i] - arr_val[0])*unit_width;
                            }
                        }
                    }
                    else if(hor_labels_pos === TICK_LABEL_POSITION_LOW)
                    {
                        cat_labels_align_left = false;
                        cat_ax.labels.x = rect.x + rect.w - cat_ax.labels.extX;
                        unit_width = (rect.w - cat_ax.labels.extX)/(arr_val[arr_val.length-1] - arr_val[0]);
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = cat_ax.labels.x - (arr_val[i] - arr_val[0])*unit_width;

                    }
                    else if(hor_labels_pos === TICK_LABEL_POSITION_HIGH)
                    {
                        cat_ax.labels.x = rect.x;
                        unit_width = (rect.w - cat_ax.labels.extX)/(arr_val[arr_val.length-1] - arr_val[0]);
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = rect.x + rect.w - (arr_val[i] - arr_val[0])*unit_width;
                    }
                    else
                    {//подписей осей нет
                        cat_ax.labels = null;
                        for(i = 0; i < arr_val.length; ++i)
                            arr_val_labels_points[i] = rect.x + rect.w - (arr_val[i] - arr_val[0])*unit_width;
                    }
                }
                //запишем в оси необходимую информацию для отрисовщика plotArea  и выставим окончательные позиции для подписей
                if(val_ax.labels)
                {
                    val_ax.labels.x = Math.min.apply(Math, arr_val_labels_points);
                    val_ax.labels.extX = Math.max.apply(Math, arr_val_labels_points) - Math.min.apply(Math, arr_val_labels_points);

                    //val_axis_labels_gap - вертикальный зазор
                    if(bottom_val_ax_labels_align)
                    {
                        var y_pos = val_ax.labels.y + val_axis_labels_gap;
                        for(i = 0;  i < val_ax.labels.arrLabels.length; ++i)
                        {

                            //var text_transform = val_ax.labels.arrLabels[i].transformText;
                            //text_transform.Reset();
                            //global_MatrixTransformer.TranslateAppend(text_transform, )
                            val_ax.labels.arrLabels[i].setPosition(arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit, y_pos);
                        }
                    }
                    else
                    {
                        for(i = 0;  i < val_ax.labels.arrLabels.length; ++i)
                        {
                            val_ax.labels.arrLabels[i].setPosition(arr_val_labels_points[i] - val_ax.labels.arrLabels[i].tx.rich.content.XLimit,
                                val_ax.labels.y + val_ax.labels.extY - val_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight() - val_axis_labels_gap);
                        }
                    }
                }
                val_ax.xPoints = [];

                if(isRealObject(val_ax.scaling) && isRealNumber(val_ax.scaling.logBase) && val_ax.scaling.logBase >= 2 && val_ax.scaling.logBase <= 1000)
                {
                    for(i = 0; i < arr_val.length; ++i)
                    {
                        arr_val[i] = Math.pow(val_ax.scaling.logBase, arr_val[i]);
                    }
                }
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
                    if(cat_labels_align_left)
                    {
                        for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
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
                        }
                    }
                    else
                    {
                        for(i = 0; i < cat_ax.labels.arrLabels.length; ++i)
                        {
                            if(cat_ax.labels.arrLabels[i])
                            {
                                cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(true);
                                cat_ax.labels.arrLabels[i].tx.rich.content.Set_ParagraphAlign(align_Center);
                                cat_ax.labels.arrLabels[i].tx.rich.content.Set_ApplyToAll(false);
                                cat_ax.labels.arrLabels[i].tx.rich.content.Reset(0, 0, cat_ax.labels.extX - labels_offset, 2000);
                                cat_ax.labels.arrLabels[i].tx.rich.content.Recalculate_Page(0, true);
                                cat_ax.labels.arrLabels[i].setPosition(cat_ax.labels.x + labels_offset, arr_cat_labels_points[i] - cat_ax.labels.arrLabels[i].tx.rich.content.Get_SummaryHeight()/2);
                            }
                        }
                    }
                }

                cat_ax.yPoints.sort(function(a, b){return a.val - b.val});
                val_ax.xPoints.sort(function(a, b){return a.val - b.val});
            }
        }
    }
};

CChartSpace.prototype.getAllSeries =  function()
{
    //TODO:Переделать когда будем поддерживать насколько вложенных чартов
    return this.chart.plotArea.chart.series;
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
        if( !this.chart.plotArea.chart.varyColors || (this.chart.plotArea.chart.getObjectType() !== historyitem_type_PieChart && this.chart.plotArea.chart.getObjectType() !== historyitem_type_DoughnutChart) && series.length !== 1)
        {
            for(i = 0; i < series.length; ++i)
            {
                ser = series[i];
                arr_str_labels.push(ser.getSeriesName());
                calc_entry = new CalcLegendEntry(legend, this);
                calc_entry.txBody = CreateTextBodyFromString(arr_str_labels[i], this.getDrawingDocument(), calc_entry);
                entry = legend.findLegendEntryByIndex(i);
                if(entry)
                    calc_entry.txPr = entry.txPr;
                calc_entryes.push(calc_entry);

                cur_width = calc_entry.txBody.getRectWidth(2000);
                if(cur_width > max_width)
                    max_width = cur_width;

                cur_font_size = calc_entry.txBody.content.Content[0].CompiledPr.Pr.TextPr.FontSize;
                if(cur_font_size > max_font_size)
                    max_font_size = cur_font_size;

                calc_entry.calcMarkerUnion = new CUnionMarker();
                union_marker = calc_entry.calcMarkerUnion;
                switch(ser.getObjectType())
                {
                    case historyitem_type_BarSeries:
                    case historyitem_type_BubbleSeries:
                    case historyitem_type_AreaSeries:
                    case historyitem_type_PieSeries:
                    {
                        union_marker.marker = CreateMarkerGeometryByType(SYMBOL_SQUARE, null);
                        union_marker.marker.pen = ser.compiledSeriesPen;
                        union_marker.marker.brush = ser.compiledSeriesBrush;
                        break;
                    }
                    case historyitem_type_LineSeries:
                    case historyitem_type_ScatterSer:
                    {
                        if(ser.compiledSeriesMarker)
                        {
                            union_marker.marker = CreateMarkerGeometryByType(ser.compiledSeriesMarker.symbol, null);
                            union_marker.marker.brush = ser.compiledSeriesPen.Fill;
                        }
                        if(ser.compiledSeriesPen)
                        {
                            union_marker.lineMarker = CreateMarkerGeometryByType(SYMBOL_DASH, null);
                            union_marker.lineMarker.pen = ser.compiledSeriesPen.createDuplicate(); //Копируем, так как потом возможно придется изменять толщину линии;
                        }
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
            var pts = getPtsFromSeries(ser), pt;
            var cat_str_lit = getCatStringPointsFromSeries(ser);
            for(i = 0; i < pts.length; ++i)
            {
                pt = pts[i];
                var str_pt = cat_str_lit ? cat_str_lit.getPtByIndex(pt.idx) : null;
                if(str_pt)
                    arr_str_labels.push(str_pt.val);
                else
                    arr_str_labels.push(pt.idx+"");

                calc_entry = new CalcLegendEntry(legend, this);
                calc_entry.txBody = CreateTextBodyFromString(arr_str_labels[i], this.getDrawingDocument(), calc_entry);
                entry = legend.findLegendEntryByIndex(i);
                if(entry)
                    calc_entry.txPr = entry.txPr;
                calc_entryes.push(calc_entry);

                cur_width = calc_entry.txBody.getRectWidth(2000);
                if(cur_width > max_width)
                    max_width = cur_width;

                cur_font_size = calc_entry.txBody.content.Content[0].CompiledPr.Pr.TextPr.FontSize;
                if(cur_font_size > max_font_size)
                    max_font_size = cur_font_size;

                calc_entry.calcMarkerUnion = new CUnionMarker();
                union_marker = calc_entry.calcMarkerUnion;
                if(ser.getObjectType() === historyitem_type_LineSeries || ser.getObjectType() === historyitem_type_ScatterSer)
                {
                    if(pt.compiledMarker)
                    {
                        union_marker.marker = CreateMarkerGeometryByType(pt.compiledMarker.symbol, null);
                        union_marker.marker.brush = pt.compiledMarker.pen.Fill;
                    }
                    if(pt.pen)
                    {
                        union_marker.lineMarker = CreateMarkerGeometryByType(SYMBOL_DASH, null);
                        union_marker.lineMarker.pen = pt.pen;
                    }
                    b_line_series = true;
                }
                else
                {
                    union_marker.marker = CreateMarkerGeometryByType(SYMBOL_SQUARE, null);
                    union_marker.marker.pen = pt.compiledMarker.pen;
                    union_marker.marker.brush = pt.compiledMarker.brush;
                }
                if(union_marker.marker)
                {
                    union_marker.marker.pen && union_marker.marker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                    union_marker.marker.brush && union_marker.marker.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
                }
                union_marker.marker.lineMarker && union_marker.marker.lineMarker.pen && union_marker.marker.lineMarker.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
            }
        }
        var marker_size;
        var distance_to_text;
        var line_marker_width;
        if(b_line_series)
        {
            marker_size = 2;
            line_marker_width = 7.7;//Пока так
            for(i = 0; i < calc_entryes.length; ++i)
            {
                calc_entry = calc_entryes[i];
                if(calc_entry.calcMarkerUnion.lineMarker)
                {
                    calc_entry.calcMarkerUnion.lineMarker.spPr.geometry.Recalculate(line_marker_width, 0);
                    /*Excel не дает сделать толщину линии для маркера легенды больше определенной. Считаем, что это толщина равна 133000emu*/
                    if(calc_entry.calcMarkerUnion.lineMarker.pen
                        && isRealNumber(calc_entry.calcMarkerUnion.lineMarker.pen.w) && calc_entry.calcMarkerUnion.lineMarker.pen.w > 133000)
                    {
                        calc_entry.calcMarkerUnion.lineMarker.pen.w = 133000;
                    }
                    calc_entry.calcMarkerUnion.lineMarker.penWidth = calc_entry.calcMarkerUnion.lineMarker.pen && isRealNumber(calc_entry.calcMarkerUnion.lineMarker.pen.w) ? calc_entry.calcMarkerUnion.lineMarker.pen.w/36000 : 0;
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
            distance_to_text = marker_size;
        }
        var left_inset = marker_size + 3*distance_to_text;
        var legend_pos;
        if(isRealNumber(legend.legendPos))
        {
            legend_pos = legend.legendPos;
        }
        else if(!isRealObject(legend.layout) || !isRealObject(legend.layout.manualLayout))
        {
            legend_pos = LEGEND_POS_L;
        }
        var legend_width, legend_height;
        if(isRealNumber(legend_pos)
            && (!legend.layout || !legend.layout.manualLayout
            || !isRealNumber(legend.layout.manualLayout.w) || !isRealNumber(legend.layout.manualLayout.h)
            || !isRealNumber(legend.layout.manualLayout.x) || !isRealNumber(legend.layout.manualLayout.y)
            || !isRealNumber(legend.layout.manualLayout.wMode) || !isRealNumber(legend.layout.manualLayout.hMode)
            || !isRealNumber(legend.layout.manualLayout.xMode) || !isRealNumber(legend.layout.manualLayout.yMode)))
        {
            var max_legend_width, max_legend_height;
            var cut_index;
            if(legend_pos === LEGEND_POS_L || legend_pos === LEGEND_POS_R || legend_pos === LEGEND_POS_TR)
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
                        cur_content_width = calc_entry.txBody.getMaxContentWidth(content_width);
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
                    if(isRealNumber(cut_index))
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
                    for(i = 0; i <  cut_index; ++i)
                    {
                        calc_entry = calc_entryes[i];
                        if(calc_entry.calcMarkerUnion.marker)
                        {
                            calc_entry.calcMarkerUnion.marker.localX = distance_to_text + line_marker_width/2 - calc_entry.calcMarkerUnion.marker.extX/2;
                            calc_entry.calcMarkerUnion.marker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2 - marker_size/2;
                        }
                        calc_entry.calcMarkerUnion.lineMarker.localX = distance_to_text;
                        calc_entry.calcMarkerUnion.lineMarker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2;// - calc_entry.calcMarkerUnion.lineMarker.penWidth/2;
                        calc_entry.localX = calc_entry.calcMarkerUnion.lineMarker.localX + line_marker_width + distance_to_text;
                        calc_entry.localY = summ_h;
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
                        cur_content_width = calc_entry.txBody.getMaxContentWidth(content_width);
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
                    if(isRealNumber(cut_index))
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
                    for(i = 0; i <  cut_index; ++i)
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
                    legend.setPosition(0, 0);
                }
            }
            else
            {
                /*пока сделаем так: максимальная ширимна 0.9 от ширины дмаграммы
                 без заголовка  максимальная высота легенды 0.6 от высоты диаграммы,
                 с заголовком 0.6 от высоты за вычетом высоты заголовка*/
                max_legend_width = 0.9*this.extX;
                max_legend_height = (this.extY - (this.chart.title ? this.chart.title.extY : 0))*0.6;
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
                        cur_entry_width = calc_entry.txBody.getMaxContentWidth(20000/*ставим большое число чтобы текст расчитался в одну строчку*/);
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
                        /*прибавим справа ещё боковой зазаор и посмотрим уберется ли новая ширина в максимальную ширину*/
                        if(summ_width + distance_to_text < max_legend_width)
                            legend_width = summ_width + distance_to_text;
                        else
                            legend_width = max_legend_width;
                        legend_height = max_entry_height;
                        for(i = 0; i < calc_entryes.length; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            calc_entry.calcMarkerUnion.marker.localX = cur_left_x + distance_to_text + line_marker_width/2 - marker_size/2;
                            calc_entry.calcMarkerUnion.lineMarker.localX = cur_left_x + distance_to_text;
                            calc_entry.calcMarkerUnion.lineMarker.localY = legend_height/2;
                            cur_left_x += arr_width[i];
                            calc_entry.calcMarkerUnion.marker.localY = legend_height/2 - marker_size/2;
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
                        if(legend_width + distance_to_text <= max_legend_width)
                            legend_width += distance_to_text;
                        else
                            legend_width = max_legend_width;

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
                        legend.extX = legend_width;
                        legend.extY = legend_height;
                        calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                        for(i = 0; i <cut_index; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            calc_entry.calcMarkerUnion.lineMarker.localX = (i - hor_count*((i/hor_count) >> 0))*(max_entry_width + line_marker_width + 2*distance_to_text)  + distance_to_text;
                            calc_entry.calcMarkerUnion.lineMarker.localY = ((i/hor_count) >> 0)*(max_entry_height) + max_entry_height/2;
                            calc_entry.calcMarkerUnion.marker.localX = calc_entry.calcMarkerUnion.lineMarker.localX + line_marker_width/2 - marker_size/2;
                            calc_entry.calcMarkerUnion.marker.localY = calc_entry.calcMarkerUnion.lineMarker.localY - marker_size/2;



                            calc_entry.localX = calc_entry.calcMarkerUnion.lineMarker.localX + line_marker_width + distance_to_text;
                            calc_entry.localY = ((i/hor_count) >> 0)*(max_entry_height);
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
                            cur_content_width = calc_entry.txBody.getMaxContentWidth(content_width);
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
                        if(isRealNumber(cut_index))
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
                        for(i = 0; i <  cut_index; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            calc_entry.calcMarkerUnion.marker.localX = distance_to_text;
                            calc_entry.calcMarkerUnion.marker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2 - marker_size/2;
                            calc_entry.localX = 2*distance_to_text + marker_size;
                            calc_entry.localY = summ_h;
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
                    var left_width = marker_size + 3*distance_to_text;
                    var arr_width = [], arr_height = []; //массив ширин записей
                    var summ_width = 0;//сумма ширин всех подписей
                    for(i = 0; i < calc_entryes.length; ++i)
                    {
                        calc_entry = calc_entryes[i];
                        cur_entry_width = calc_entry.txBody.getMaxContentWidth(20000/*ставим большое число чтобы текст расчитался в одну строчку*/);
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
                        /*прибавим справа ещё боковой зазаор и посмотрим уберется ли новая ширина в максимальную ширину*/
                        if(summ_width + distance_to_text < max_legend_width)
                            legend_width = summ_width + distance_to_text;
                        else
                            legend_width = max_legend_width;
                        legend_height = max_entry_height;

                        for(i = 0; i < calc_entryes.length; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            calc_entry.calcMarkerUnion.marker.localX = cur_left_x + distance_to_text;
                            cur_left_x += arr_width[i];
                            calc_entry.calcMarkerUnion.marker.localY = legend_height/2 - marker_size/2;
                            calc_entry.localX = calc_entry.calcMarkerUnion.marker.localX+marker_size+distance_to_text;
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
                        if(legend_width + distance_to_text <= max_legend_width)
                            legend_width += distance_to_text;
                        else
                            legend_width = max_legend_width;

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
                        legend.extX = legend_width;
                        legend.extY = legend_height;

                        calc_entryes.splice(cut_index, calc_entryes.length - cut_index);
                        for(i = 0; i <cut_index; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            calc_entry.calcMarkerUnion.marker.localX = (i - hor_count*((i/hor_count) >> 0))*(max_entry_width + marker_size + 2*distance_to_text)  + distance_to_text;
                            calc_entry.calcMarkerUnion.marker.localY = ((i/hor_count) >> 0)*(max_entry_height) + max_entry_height/2 - marker_size/2;
                            calc_entry.localX = calc_entry.calcMarkerUnion.marker.localX + marker_size + distance_to_text;
                            calc_entry.localY = ((i/hor_count) >> 0)*(max_entry_height);
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
                            cur_content_width = calc_entry.txBody.getMaxContentWidth(content_width);
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
                        if(isRealNumber(cut_index))
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
                        for(i = 0; i <  cut_index; ++i)
                        {
                            calc_entry = calc_entryes[i];
                            calc_entry.calcMarkerUnion.marker.localX = distance_to_text;
                            calc_entry.calcMarkerUnion.marker.localY = summ_h + (calc_entry.txBody.content.Content[0].Lines[0].Bottom - calc_entry.txBody.content.Content[0].Lines[0].Top)/2 - marker_size/2;
                            calc_entry.localX = 2*distance_to_text + marker_size;
                            calc_entry.localY = summ_h;
                            summ_h+=arr_heights[i];
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