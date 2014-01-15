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
		recalculateSeriesColors: true
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
CChartSpace.prototype.addToRecalculate = CShape.prototype.addToRecalculate;

CChartSpace.prototype.handleUpdatePosition = function()
{
    this.recalcTransform();
    this.addToRecalculate();
};
CChartSpace.prototype.handleUpdateExtents = function()
{
    this.recalcChart();
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
CChartSpace.prototype.convertPixToMM = CShape.prototype.convertPixToMM;
CChartSpace.prototype.getCanvasContext = CShape.prototype.getCanvasContext;
CChartSpace.prototype.getHierarchy = CShape.prototype.getHierarchy;
CChartSpace.prototype.getParentObjects = CShape.prototype.getParentObjects;
CChartSpace.prototype.recalculateTransform = CShape.prototype.recalculateTransform;
CChartSpace.prototype.recalculateChart = function()
{
};
CChartSpace.prototype.canResize = CShape.prototype.canResize;
CChartSpace.prototype.canMove = CShape.prototype.canMove;
CChartSpace.prototype.canRotate = function()
{
	return false;
}

CChartSpace.prototype.draw = function(graphics)
{

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
    if(this.recalcInfo.recalculateTransform)
    {
       this.recalculateTransform();
       this.recalcInforecalculateTransform = false;
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
	if(this.recalcInfo.recalculateSeriesColors)
	{
		this.recalculateSeriesColors();
        this.recalcInfo.recalculateBaseColors = false;
	}
    if(this.recalcInfo.recalculateChart)
    {
        this.recalculateChart();
        this.recalcInfo.recalculateChart = false;
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

function CreateUnifillSolidFillSchemeColorByIndex(index)
{
	var ret =  new CUniFill();
	ret.setFill(new CSolidFill());
	ret.fill.setColor(new CUniColor());
	ret.fill.color.setColor(new CSchemeColor());
	ret.fill.color.color.setId(index);
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
	
	if ( this.style && (typeof(this.style) == 'number') ) {
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

CChartSpace.prototype.hitToAdjustment = function()
{
	return {hit: false};
}

CChartSpace.prototype.recalculateSeriesColors = function()
{
	var is_on = History.Is_On();
	if(is_on)
	{
		History.TurnOff();
	}
	if(this.chart && this.chart.plotArea && this.chart.plotArea.chart && this.chart.plotArea.chart.series)
	{
		var series = this.chart.plotArea.chart.series;
		var arrayColors = [];
		var countBase = this.baseColors.length;
		
		var need_colors = !(this.chart.plotArea.chart instanceof CPieChart) ? this.chart.plotArea.chart.series.length : this.chart.plotArea.chart.series[0].val.numRef.numCache.pts.length;
		var needCreate = parseInt(need_colors / countBase) + 1;

		for (var i = 0; i < needCreate; i++) 
		{
			for (var j = 0; j < countBase; j++) 
			{
				var percent = (-70 + 140 * ( (i + 1) / (needCreate + 1) )) / 100.0;	
				var color = CreateUniFillSolidFillWidthTintOrShade(this.baseColors[j], percent);
				arrayColors.push( color );
			}
		}
		arrayColors.splice(need_colors, arrayColors.length - need_colors);
		var RGBA = {R: 0, G: 0, B: 0, A:255};
		var parents = this.getParentObjects();
		
		
		for(var i = 0; i < series.length; ++i)
		{
			var ser = series[i];
			if(!(this.chart.plotArea.chart instanceof CPieChart))
			{
				ser.brush = null;
				ser.pen = null;
				if(ser.spPr && ser.spPr.Fill)
				{
					ser.brush = ser.spPr.Fill;
				}
				else
				{
					ser.brush = arrayColors[i];
				}
				
				ser.pen = null;
				if(ser.spPr && ser.spPr.ln)
				{
					ser.pen = ser.spPr.ln;
					ser.pen = ser.spPr.ln.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
				}
				else
				{
					if(ser instanceof CLineSeries)
					{
						ser.pen = new CLn();
						ser.pen.setFill(arrayColors[i]);
						ser.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
					}
				}
				ser.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
				if(ser.val && ser.val.numRef && ser.val.numRef.numCache && ser.val.numRef.numCache.pts)
				{	
					var pts = ser.val.numRef.numCache.pts;
					for(var j = 0; j < pts.length; ++j)
					{
						pts[j].brush = ser.brush;
						pts[j].pen = ser.pen;
					}
					if(Array.isArray(ser.dPt))
					{
						for(j = 0; j < ser.dPt.length; ++j)
						{
							if(ser.dPt[j].spPr && ser.dpt.spPr.Fill)
							{
								pts[ser.dpt.idx].brush = ser.dpt.spPr.Fill;
								pts[ser.dpt.idx].brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
							}
							if(ser.dPt[j].spPr && ser.dpt.spPr.ln)
							{
								pts[ser.dpt.idx].pen = ser.dpt.spPr.pen;
								pts[ser.dpt.idx].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
							}
						}				
					}
				}
				if(ser.yVal && ser.yVal.numRef && ser.yVal.numRef.numCache && ser.yVal.numRef.numCache.pts)//Точечная диаграмма
				{
					var ptsY = ser.yVal.numRef.numCache.pts;
					var ptsX;
					if(ser.xVal && ser.xVal.numRef && ser.xVal.numRef.numCache && ser.xVal.numRef.numCache.pts)
					{
						ptsX = ser.xVal.numRef.numCache.pts;
					}
					else
					{
						ptsX = null;
					}
					
					if(Array.isArray(ptsX))
					{
						for(var j = 0; j < ptsX.length; ++j)
						{
							ptsX[j].brush = ser.brush;
							ptsX[j].pen = ser.pen;
						}				
					}
					for(var j = 0; j < ptsY.length; ++j)
					{
						ptsY[j].brush = ser.brush;
						ptsY[j].pen = ser.pen;
					}
					if(Array.isArray(ser.dPt))
					{
						for(j = 0; j < ser.dPt.length; ++j)
						{
							if(ser.dPt[j].spPr && ser.dpt.spPr.Fill)
							{
								if(Array.isArray(ptsX))
								{
									ptsX[ser.dpt.idx].brush = ser.dpt.spPr.Fill;
									ptsX[ser.dpt.idx].brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
								}
								ptsY[ser.dpt.idx].brush = ser.dpt.spPr.Fill;
								ptsY[ser.dpt.idx].brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
							}
							if(ser.dPt[j].spPr && ser.dpt.spPr.ln)
							{
								if(Array.isArray(ptsX))
								{
									ptsX[ser.dpt.idx].pen = ser.dpt.spPr.pen;
									ptsX[ser.dpt.idx].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
								}
								ptsY[ser.dpt.idx].pen = ser.dpt.spPr.pen;
								ptsY[ser.dpt.idx].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
							}
						}				
					}
				}
			}
			else
			{
				var pts = ser.val.numRef.numCache.pts;
				for(var j = 0; j < pts.length; ++j)
				{
					pts[j].brush = arrayColors[j];
					pts[j].brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
					pts[j].pen = ser.pen;
				}
				
				if(Array.isArray(ser.dPt))
				{
					for(j = 0; j < ser.dPt.length; ++j)
					{
						if(ser.dPt[j].spPr && ser.dpt.spPr.Fill)
						{
							pts[ser.dpt.idx].brush = ser.dpt.spPr.Fill;
							pts[ser.dpt.idx].brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
						}
						if(ser.dPt[j].spPr && ser.dpt.spPr.ln)
						{
							pts[ser.dpt.idx].pen = ser.dpt.spPr.pen;
							pts[ser.dpt.idx].pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
						}
					}				
				}
			}
		}
	}
	
	if(is_on)
	{
		History.TurnOn();
	}
};

