DrawingObjectsController.prototype.getTheme = function()
{
    return window["Asc"]["editor"].wbModel.theme;

};
DrawingObjectsController.prototype.getSlide = function()
{
    return null;
};
DrawingObjectsController.prototype.getLayout = function()
{
    return null;
};
DrawingObjectsController.prototype.getMaster = function()
{
    return null;
};
DrawingObjectsController.prototype.updateOverlay = function()
{
    this.drawingObjects.OnUpdateOverlay();
};
DrawingObjectsController.prototype.endTrackNewShape = function()
{
    History.Create_NewPoint();
    var shape = this.arrTrackObjects[0].getShape();
    shape.setDrawingObjects(this.drawingObjects);
    shape.addToDrawingObjects();
    shape.addToRecalculate();
    this.arrTrackObjects.length = 0;
    this.changeCurrentState(new NullState(this));
    this.resetSelection();
    this.selectObject(shape);
    this.startRecalculate();
};
DrawingObjectsController.prototype.recalculate = function()
{
    for(var key in this.objectsForRecalculate)
    {
        this.objectsForRecalculate[key].recalculate();
    }
    this.objectsForRecalculate = {};
};

DrawingObjectsController.prototype.startRecalculate = function()
{
    this.recalculate();
    this.drawingObjects.showDrawingObjects(true);
};

DrawingObjectsController.prototype.getDrawingObjects = function()
{
    //TODO: переделать эту функцию. Нужно где-то паралельно с массивом DrawingBas'ов хранить масси graphicObject'ов.
    var ret = [];
    var drawing_bases = this.drawingObjects.getDrawingObjects();
    for(var i = 0; i < drawing_bases.length; ++i)
    {
        ret.push(drawing_bases[i].graphicObject);
    }
    return ret;
};
DrawingObjectsController.prototype.checkSelectedObjectsForMove = function()
{
    for(var i = 0; i < this.selectedObjects.length; ++i)
    {
        if(this.selectedObjects[i].canMove())
        {
            this.arrPreTrackObjects.push(this.selectedObjects[i].createMoveTrack());
        }
    }
};

DrawingObjectsController.prototype.checkSelectedObjectsAndFireCallback = function(callback, args)
{
    var selection_state = this.getSelectionState();
    this.drawingObjects.objectLocker.reset();
    for(var i = 0; i < this.selectedObjects.length; ++i)
    {
        this.drawingObjects.objectLocker.addObjectId(this.selectedObjects[i].Get_Id());
    }
    var _this = this;
    var callback2 = function(bLock)
    {
        if(bLock)
        {
            _this.setSelectionState(selection_state);
            callback.apply(_this, args);
        }
    };
    this.drawingObjects.objectLocker.checkObjects(callback2);
};
DrawingObjectsController.prototype.onMouseDown = function(e, x, y)
{
    e.ShiftKey = e.shiftKey;
    e.CtrlKey = e.ctrlKey;
    this.curState.onMouseDown(e, x, y);
    if(e.ClickCount < 2)
    {
        this.recalculateCurPos()
    }
};

DrawingObjectsController.prototype.onMouseMove = function(e, x, y)
{
    e.ShiftKey = e.shiftKey;
    e.CtrlKey = e.ctrlKey;
    this.curState.onMouseMove(e, x, y);
};

DrawingObjectsController.prototype.onMouseUp = function(e, x, y)
{
    e.ShiftKey = e.shiftKey;
    e.CtrlKey = e.ctrlKey;
    this.curState.onMouseUp(e, x, y);
};


DrawingObjectsController.prototype.createGroup = function()
{
    History.Create_NewPoint();
    var group = this.getGroup();
    var group_array = this.getArrayForGrouping();
    for(var i = group_array.length - 1; i > -1; --i)
    {
        group_array[i].deleteDrawingBase();
    }
    this.resetSelection();
    group.addToDrawingObjects();
    this.selectObject(group);
    group.addToRecalculate();
};

DrawingObjectsController.prototype.addChartDrawingObject = function(asc_chart, options)
{
    History.Create_NewPoint();
    var chart = this.getChartSpace(asc_chart, options);
    if(chart)
    {
        this.resetSelection();
        var chartLeft = this.drawingObjects.convertMetric(options && options.left ? ptToPx(options.left) : (parseInt($("#ws-canvas").css('width')) / 2) - c_oAscChartDefines.defaultChartWidth / 2, 0, 3);
        var chartTop = this.drawingObjects.convertMetric(options && options.top ? ptToPx(options.top) : (parseInt($("#ws-canvas").css('height')) / 2) - c_oAscChartDefines.defaultChartHeight / 2, 0, 3);
        var w, h;
        if(isRealObject(options) && isRealNumber(options.width) && isRealNumber(options.height))
        {
            w = this.drawingObjects.convertMetric(options.width, 0, 3);
            h = this.drawingObjects.convertMetric(options.height, 0, 3);
        }
        else
        {
            w = this.drawingObjects.convertMetric(c_oAscChartDefines.defaultChartWidth, 0, 3);
            h = this.drawingObjects.convertMetric(c_oAscChartDefines.defaultChartHeight, 0, 3);
        }
        chart.setSpPr(new CSpPr());
        chart.spPr.setParent(chart);
        chart.spPr.setXfrm(new CXfrm());
        chart.spPr.xfrm.setParent(chart.spPr);
        chart.spPr.xfrm.setOffX(chartLeft);
        chart.spPr.xfrm.setOffY(chartTop);
        chart.spPr.xfrm.setExtX(w);
        chart.spPr.xfrm.setExtY(h);

        chart.setDrawingObjects(this.drawingObjects);
        chart.addToDrawingObjects();
        this.selectObject(chart);
        chart.addToRecalculate();
        this.startRecalculate();
    }
};