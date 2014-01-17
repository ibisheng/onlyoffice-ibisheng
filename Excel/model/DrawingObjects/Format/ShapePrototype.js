CShape.prototype.setDrawingObjects = function(drawingObjects)
{
    if ( isRealObject(drawingObjects) && drawingObjects.getWorksheet() )
    {
        var newValue = drawingObjects.getWorksheet().model.getId();
        var oldValue = isRealObject(this.drawingObjects) ? this.drawingObjects.getWorksheet().model.getId() : null;
       // History.Add(this, {Type: historyitem_AutoShapes_SetDrawingObjects, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.drawingObjects = drawingObjects;
    }
};
CShape.prototype.setDrawingBase = function(drawingBase)
{
    this.drawingBase = drawingBase;
};
CShape.prototype.addToDrawingObjects =  function(pos)
{
    var position = this.drawingObjects.addGraphicObject(this, pos, true);
    var data = new UndoRedoDataGOSingleProp(position, null);
   // History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Add_To_Drawing_Objects, null, null, new UndoRedoDataGraphicObjects(this.Id, data), null);
    this.drawingObjects.controller.addContentChanges(new CContentChangesElement(contentchanges_Add, data.oldValue, 1, data));
};
CShape.prototype.deleteDrawingBase = function()
{
    var position = this.drawingObjects.deleteDrawingBase(this.Get_Id());
    if(isRealNumber(position))
    {
        //var data = new UndoRedoDataGOSingleProp(position, null);
        //History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_DeleteDrawingBase, null, null, new UndoRedoDataGraphicObjects(this.Id, data), null);
        //this.drawingObjects.controller.addContentChanges(new CContentChangesElement(contentchanges_Remove, data.oldValue, 1, data));
    }
    return position;
};

CShape.prototype.setRecalculateInfo = function()
{
    this.recalcInfo =
    {
        recalculateContent:        true,
        recalculateBrush:          true,
        recalculatePen:            true,
        recalculateTransform:      true,
        recalculateTransformText:  true,
        recalculateBounds:         true,
        recalculateGeometry:       true,
        recalculateStyle:          true,
        recalculateFill:           true,
        recalculateLine:           true,
        recalculateTransparent:    true,
        recalculateTextStyles:     [true, true, true, true, true, true, true, true, true]
    };
    this.textPropsForRecalc = [];
    this.bounds = {l: 0, t: 0, r: 0, b:0, w: 0, h:0};
};
CShape.prototype.recalcContent = function()
{
    this.recalcInfo.recalcContent = true;
};

CShape.prototype.recalcBrush = function()
{
    this.recalcInfo.recalculateBrush = true;
};

CShape.prototype.recalcPen = function()
{
    this.recalcInfo.recalculatePen = true;
};
CShape.prototype.recalcTransform = function()
{
    this.recalcInfo.recalculateTransform = true;
};
CShape.prototype.recalcTransformText = function()
{
    this.recalcInfo.recalculateTransformText = true;
};
CShape.prototype.recalcBounds = function()
{
    this.recalcInfo.recalculateBounds = true;
};
CShape.prototype.recalcGeometry = function()
{
    this.recalcInfo.recalculateGeometry = true;
};
CShape.prototype.recalcStyle = function()
{
    this.recalcInfo.recalculateStyle = true;
};
CShape.prototype.recalcFill = function()
{
    this.recalcInfo.recalculateFill = true;
};
CShape.prototype.recalcLine = function()
{
    this.recalcInfo.recalculateLine = true;
};
CShape.prototype.recalcTransparent = function()
{
    this.recalcInfo.recalculateTransparent = true;
};
CShape.prototype.recalcTextStyles = function()
{
    this.recalcInfo.recalculateTextStyles = true;
};
CShape.prototype.addToRecalculate = function()
{
    if(this.drawingObjects && this.drawingObjects.controller)
    {
        this.drawingObjects.controller.objectsForRecalculate[this.Id] = this;
    }
};
CShape.prototype.handleUpdatePosition = function()
{
    this.recalcTransform();
	this.recalcBounds();
    this.recalcTransformText();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateExtents = function()
{
    this.recalcContent();
    this.recalcGeometry();
	this.recalcBounds();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateRot = function()
{
    this.recalcTransform();
    if(this.txBody && this.txBody.bodyPr && this.txBody.bodyPr.upright)
    {
        this.recalcContent();
    }
    this.recalcTransformText();
    this.recalcBounds();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateFlip = function()
{
    this.recalcTransform();
    this.recalcTransformText();
    this.recalcContent();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateFill = function()
{
    this.recalcBrush();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateLn = function()
{
    this.recalcLine();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateGeometry = function()
{
    this.recalcGeometry();
    this.addToRecalculate();
};
CShape.prototype.convertPixToMM = function(pix)
{
    return this.drawingObjects ? this.drawingObjects.convertMetric(pix, 0, 3) : 0;
};
CShape.prototype.getCanvasContext = function()
{
    return this.drawingObjects ? this.drawingObjects.getCanvasContext() : null;
};
CShape.prototype.getCompiledStyle = function()
{
    return this.style;
};
CShape.prototype.getHierarchy = function()
{
    return [];
};
CShape.prototype.getParentObjects = function ()
{
    return { slide: null, layout: null, master: null, theme: window["Asc"]["editor"].wbModel.theme};
};

CShape.prototype.recalculate = function () 
{
    if (this.recalcInfo.recalculateBrush) {
        this.recalculateBrush();
        this.recalcInfo.recalculateBrush = false;
    }

    if (this.recalcInfo.recalculatePen) {
        this.recalculatePen();
        this.recalcInfo.recalculatePen = false;
    }
    if (this.recalcInfo.recalculateTransform) {
        this.recalculateTransform();
        this.recalcInfo.recalculateTransform = false;
    }

    if (this.recalcInfo.recalculateGeometry) {
        this.recalculateGeometry();
        this.recalcInfo.recalculateGeometry = false;
    }

    if (this.recalcInfo.recalculateContent) {
        if (this.txBody)
            this.txBody.recalcInfo.recalculateContent2 = true;
        this.recalculateContent();
    }

    if (this.recalcInfo.recalculateTransformText) {
        this.recalculateTransformText();
    }
    if (this.recalcInfo.recalculateCursorTypes) {
        this.recalculateCursorTypes();
        this.recalcInfo.recalculateCursorTypes = false;
    }
    if(this.recalcInfo.recalculateBounds)
    {
        this.recalculateBounds();
        this.recalcInfo.recalculateBounds = false;
    }
};
CShape.prototype.recalculateBounds = function()
{
    var boundsChecker = new  CSlideBoundsChecker();
    this.draw(boundsChecker);
    boundsChecker.CorrectBounds();

    this.bounds.x = boundsChecker.Bounds.min_x;
    this.bounds.y = boundsChecker.Bounds.min_y;
    this.bounds.l = boundsChecker.Bounds.min_x;
    this.bounds.t = boundsChecker.Bounds.min_y;
    this.bounds.r = boundsChecker.Bounds.max_x;
    this.bounds.b = boundsChecker.Bounds.max_y;
    this.bounds.w = boundsChecker.Bounds.max_x - boundsChecker.Bounds.min_x;
    this.bounds.h = boundsChecker.Bounds.max_y - boundsChecker.Bounds.min_y;
};