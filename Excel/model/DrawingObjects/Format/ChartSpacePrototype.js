CChartSpace.prototype.addToDrawingObjects =  CShape.prototype.addToDrawingObjects;
CChartSpace.prototype.setDrawingObjects = CShape.prototype.setDrawingObjects;
CChartSpace.prototype.setDrawingBase = CShape.prototype.setDrawingBase;
CChartSpace.prototype.deleteDrawingBase = CShape.prototype.deleteDrawingBase;
CChartSpace.prototype.setRecalculateInfo = function()
{
    this.recalcInfo =
    {
        recalculateTransform: true,
        recalculateBounds:    true,
        recalculateChart:     true,
		recalculateStyle: true
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
CChartSpace.prototype.getHierarchy = CShape.prototype.getParentObjects;
CChartSpace.prototype.getParentObjects = CShape.prototype.getParentObjects;
CChartSpace.prototype.recalculateTransform = CShape.prototype.recalculateTransform;
CChartSpace.prototype.recalculateChart = function()
{
};
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
    if(this.recalcInfo.recalculateChart)
    {
        this.recalculateChart();
        this.recalcInfo.recalculateChart = false;
    }
    if(this.recalcInfo.recalculateBounds)
    {
        this.recalculateBounds();
        this.recalcInfo.recalculateBounds = false;
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

CChartSpace.prototype.recalculateStyle = function()
{
	var is_on = History.Is_On();
	if(is_on)
	{
		History.TurnOff();
	}
	
	if ( styleId && (typeof(styleId) == 'number') ) {
			if ( styleId % 8 === 0 )		
				this.baseColors = CreateColorMapByIndex(8);
			else
				this.baseColors = CreateColorMapByIndex(styleId % 8);
		}
		else
			this.baseColors = CreateColorMapByIndex(2);
	if(is_on)
	{
		History.TurnOn();
	}
};
