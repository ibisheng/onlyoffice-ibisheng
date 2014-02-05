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
        recalculatePlotAreaPen: true
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
            if(this.chart.plotArea.catAx && this.chart.plotArea.catAx.title)
            {
                this.chart.plotArea.catAx.title.draw(graphics);
            }
            if(this.chart.plotArea.valAx && this.chart.plotArea.valAx.title)
            {
                this.chart.plotArea.valAx.title.draw(graphics);
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
        if(this.recalcInfo.recalculateAxisLabels)
        {
            this.recalculateAxisLabels();
            this.recalcInfo.recalculateAxisLabels = false;
        }
		if(this.recalcInfo.recalculateChart)
		{
			this.recalculateChart();
			this.recalcInfo.recalculateChart = false;
		}
        if(this.recalcInfo.recalculateAxisVal)
        {
            this.recalculateAxisVal();
            this.recalcInfo.recalculateAxisVal = false;
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
		|| this.chart.plotArea.chart instanceof CScatterChart) 
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
				if(!(this.chart.plotArea.chart instanceof CLineChart))
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

CChartSpace.prototype.getValAxisValues = function()
{
    if(!this.chartObj)
    {
        this.chartObj = new CChartsDrawer()
    }
    this.chartObj.preCalculateData(this);
    var ret = [];
    ret = ret.concat(this.chartObj.calcProp);
    return ret;
};


CChartSpace.prototype.recalculateValAxLine = function()
{};

CChartSpace.prototype.recalculateAxisVal = function()
{
    if(this.chart && this.chart.plotArea && this.chart.plotArea.valAx)
    {
        var val_ax = this.chart.plotArea.valAx;
        val_ax.axisLabels = [];
        var arr_val =  this.getValAxisValues();
        var i;
        for(i = 0; i < arr_val.length; ++i)
        {
            var dlbl = new CDLbl();
            dlbl.parent = val_ax;
            dlbl.chart = this;
            dlbl.spPr = val_ax.spPr;
            dlbl.txPr = val_ax.txPr;
            dlbl.tx = new CChartText();
            dlbl.tx.rich = CreateTextBodyFromString(arr_val[i]+"", this.getDrawingDocument(), dlbl);
            dlbl.recalculate();
            val_ax.axisLabels.push(dlbl);
        }
    }
};

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

function CreateUnifillSolidFillSchemeColor(colorId, tintOrShade)
{
    var unifill = new CUniFill();
    unifill.setFill(new CSolidFill());
    unifill.fill.setColor(new CUniColor());
    unifill.fill.color.setColor(new CSchemeColor());
    unifill.fill.color.color.setId(colorId);
    return CreateUniFillSolidFillWidthTintOrShade(unifill, tintOrShade);
}



