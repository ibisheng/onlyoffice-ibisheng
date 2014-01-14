CGroupShape.prototype.addToRecalculate = function()
{
    if(this.drawingObjects && this.drawingObjects.controller)
    {
        this.drawingObjects.controller.objectsForRecalculate[this.Id] = this;
    }
};


CGroupShape.prototype.setRecalculateInfo = function()
{
    var recalcInfo = this.recalcInfo;
    this.recalcInfo =
    {
        recalculateBrush: true,
        recalculatePen: true,
        recalculateTransform: true,
        recalculateArrGraphicObjects: true,
        recalculateBounds: true,
		recalculateScaleCoefficients: true
    };
    this.bounds = {l: 0, t: 0, r: 0, b:0, w: 0, h:0};
};

CGroupShape.prototype.recalcTransform = function()
{
	this.recalcInfo.recalculateTransform = true;
};

CGroupShape.prototype.recalcBounds = function()
{
	this.recalcInfo.recalculateBounds = true;
};

CGroupShape.prototype.addToDrawingObjects =  CShape.prototype.addToDrawingObjects;
CGroupShape.prototype.setDrawingObjects = CShape.prototype.setDrawingObjects;
CGroupShape.prototype.setDrawingBase = CShape.prototype.setDrawingBase;
CGroupShape.prototype.deleteDrawingBase = CShape.prototype.deleteDrawingBase;
CGroupShape.prototype.addToRecalculate = CShape.prototype.addToRecalculate;
CGroupShape.prototype.convertPixToMM = CShape.prototype.convertPixToMM;
CGroupShape.prototype.getCanvasContext = CShape.prototype.getCanvasContext;
CGroupShape.prototype.getHierarchy = CShape.prototype.getParentObjects;
CGroupShape.prototype.getParentObjects = CShape.prototype.getParentObjects;
CGroupShape.prototype.recalculateTransform = CShape.prototype.recalculateTransform;
CGroupShape.prototype.recalculateBounds = CShape.prototype.recalculateBounds;
CGroupShape.prototype.deselect = CShape.prototype.deselect;
CGroupShape.prototype.hitToHandles = CShape.prototype.hitToHandles;
CGroupShape.prototype.hitInBoundingRect = CShape.prototype.hitInBoundingRect;
CGroupShape.prototype.getRotateAngle = CShape.prototype.getRotateAngle;
CGroupShape.prototype.handleUpdatePosition = function()
{
    this.recalcTransform();
    this.addToRecalculate();
	for(var i = 0; i < this.spTree.length; ++i)
	{
		if(this.spTree[i].recalcTransform)
		{
			this.spTree[i].recalcTransform();
		}
	}
};
CGroupShape.prototype.handleUpdateExtents = CGroupShape.prototype.handleUpdatePosition;
CGroupShape.prototype.handleUpdateRot = CGroupShape.prototype.handleUpdatePosition;
CGroupShape.prototype.handleUpdateFlip = CGroupShape.prototype.handleUpdatePosition;
CGroupShape.prototype.handleUpdateChildOffset = CGroupShape.prototype.handleUpdatePosition;
CGroupShape.prototype.handleUpdateChildExtents = CGroupShape.prototype.handleUpdatePosition;


