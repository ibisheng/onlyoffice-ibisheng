"use strict";


DrawingObjectsController.prototype.getTheme = function()
{
    return this.drawingObjects.Layout.Master.Theme;
};

DrawingObjectsController.prototype.getDrawingArray = function()
{
    return this.drawingObjects.cSld.spTree;
};

DrawingObjectsController.prototype.checkSelectedObjectsAndCallback = function(callback, args)
{
    History.Create_NewPoint();
    callback.apply(this, args);
    this.startRecalculate();
};
DrawingObjectsController.prototype.startRecalculate = function()
{
    editor.WordControl.m_oLogicDocument.Recalculate();
    this.drawingObjects.showDrawingObjects(true);
    editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
};

DrawingObjectsController.prototype.getDrawingObjects = function()
{
    return this.drawingObjects.cSld.spTree;
};

DrawingObjectsController.prototype.paragraphFormatPaste = function( CopyTextPr, CopyParaPr, Bool )
{
    var _this = this;
    this.checkSelectedObjectsAndCallback(function()
    {
        var content = _this.getTargetDocContent();
        content && content.Paragraph_Format_Paste(CopyTextPr, CopyParaPr, Bool );
    }, [CopyTextPr, CopyParaPr, Bool]);
};


DrawingObjectsController.prototype.paragraphFormatPaste2 = function()
{
    return this.paragraphFormatPaste(editor.WordControl.m_oLogicDocument.CopyTextPr, editor.WordControl.m_oLogicDocument.CopyParaPr, true);
};
DrawingObjectsController.prototype.getDrawingDocument = function()
{
    return editor.WordControl.m_oDrawingDocument;
};
DrawingObjectsController.prototype.getTheme = function()
{
    return this.drawingObjects.Layout.Master.Theme;
};


DrawingObjectsController.prototype.onMouseDown = function(e, x, y)
{
    var ret = this.curState.onMouseDown(e, x, y, 0);
    if(e.ClickCount < 2)
    {
        this.updateOverlay();
        this.updateSelectionState();
    }
    return ret;
};

DrawingObjectsController.prototype.OnMouseDown = DrawingObjectsController.prototype.onMouseDown;

DrawingObjectsController.prototype.onMouseMove = function(e, x, y)
{
    this.curState.onMouseMove(e, x, y, 0);
};
DrawingObjectsController.prototype.OnMouseMove = DrawingObjectsController.prototype.onMouseMove;


DrawingObjectsController.prototype.onMouseUp = function(e, x, y)
{
    this.curState.onMouseUp(e, x, y, 0);
};
DrawingObjectsController.prototype.OnMouseUp = DrawingObjectsController.prototype.onMouseUp;


DrawingObjectsController.prototype.convertPixToMM = function(pix)
{
    return editor.WordControl.m_oDrawingDocument.GetMMPerDot(pix);
};
DrawingObjectsController.prototype.checkSelectedObjectsAndFireCallback  =  DrawingObjectsController.prototype.checkSelectedObjectsAndCallback;
DrawingObjectsController.prototype.showChartSettings  =  function()
{
    editor.asc_doubleClickOnChart(this.getChartObject());
    this.changeCurrentState(new NullState(this));
};
DrawingObjectsController.prototype.editChart = function(binary)
{
    var bin_object = {"binary":binary};
    var chart_space = this.getChartSpace2(bin_object, null);
    chart_space.setParent(this.drawingObjects);
    if(this.selection.groupSelection && this.selection.groupSelection.selectedObjects.length === 1 && this.selection.groupSelection.selectedObjects[0].getObjectType() === historyitem_type_ChartSpace)
    {
        var parent_group = this.selection.groupSelection.selectedObjects[0].group;
        var major_group = this.selection.groupSelection;
        for(var i = parent_group.spTree.length -1; i > -1; --i)
        {
            if(parent_group.spTree[i] === this.selection.groupSelection.selectedObjects[0])
            {
                parent_group.removeFromSpTreeByPos(i);
                chart_space.setGroup(parent_group);
                chart_space.spPr.xfrm.setOffX(this.selection.groupSelection.selectedObjects[0].spPr.xfrm.offX);
                chart_space.spPr.xfrm.setOffY(this.selection.groupSelection.selectedObjects[0].spPr.xfrm.offY);
                parent_group.addToSpTree(i, chart_space);
                parent_group.updateCoordinatesAfterInternalResize();
                major_group.recalculate();
                this.selection.groupSelection.resetSelection();
                this.selection.groupSelection.selectObject(chart_space, this.drawingObjects.num);
                this.startRecalculate();
                this.sendGraphicObjectProps();
                return;
            }
        }
    }
    else if(this.selectedObjects.length === 1 && this.selectedObjects[0].getObjectType() === historyitem_type_ChartSpace)
    {
        chart_space.spPr.xfrm.setOffX(this.selectedObjects[0].x);
        chart_space.spPr.xfrm.setOffY(this.selectedObjects[0].y);
        var pos = this.selectedObjects[0].deleteDrawingBase();
        chart_space.addToDrawingObjects(pos);
        this.startRecalculate();
        this.sendGraphicObjectProps();
    }
};

DrawingObjectsController.prototype.handleSlideComments  =  function(e, x, y, pageIndex)
{

    var comments = this.drawingObjects.slideComments.comments, i;
    if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
    {
        editor.asc_hideComments();
        for(i = comments.length - 1; i > -1; --i)
        {
            comments[i].selected = false;
        }
    }

    for(i = comments.length - 1; i > -1; --i)
    {
        if(comments[i].hit(x, y))
        {
            if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
            {
                comments[i].selected = true;
                this.addPreTrackObject(new MoveComment(comments[i]));
                this.changeCurrentState(new PreMoveCommentState(this, x, y, comments[i]));
                this.drawingObjects.showDrawingObjects(true);
                return true;
            }
            else
            {
                return {objectId: comments[i], cursorType: "move"}
            }
        }
    }
    if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
    {
        this.drawingObjects.showDrawingObjects(true);
        return false;
    }
    else
    {
        return null;
    }

};

function PreMoveCommentState(drawingObjects, startX, startY, comment)
{
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.comment = comment;
}

PreMoveCommentState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            return true;
        }
        else
        {
            return {objectId: this.comment, cursorType: "move"}
        }
    },

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(Math.abs(this.startX - x) < MOVE_DELTA && Math.abs(this.startY - y) < MOVE_DELTA)
            return;
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new MoveCommentState(this.drawingObjects, this.startX, this.startY, this.comment));
        this.drawingObjects.onMouseMove(e, x, y);
    },

    onMouseUp: function(e, x, y, pageIndex)
    {
        var Coords = editor.WordControl.m_oDrawingDocument.ConvertCoordsToCursorWR_Comment( this.comment.x, this.comment.y, this.drawingObjects.num);
        editor.sync_HideComment();
        editor.sync_ShowComment(this.comment.Id, Coords.X, Coords.Y );
        this.drawingObjects.clearPreTrackObjects();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};

function MoveCommentState(drawingObjects, startX, startY, comment)
{
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.comment = comment;
}

MoveCommentState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            return true;
        }
        else
        {
            return {objectId: this.comment, cursorType: "move"}
        }
    },

    onMouseMove: function(e, x, y, pageIndex)
    {
        var dx = x - this.startX;
        var dy = y - this.startY;
        this.drawingObjects.arrTrackObjects[0].track(dx, dy);
        this.drawingObjects.updateOverlay();
    },

    onMouseUp: function(e, x, y, pageIndex)
    {
        if(!this.drawingObjects.isViewMode() && editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_MoveComment, this.comment.Get_Id()) === false)
        {
            History.Create_NewPoint();
            this.drawingObjects.trackEnd();
            this.drawingObjects.startRecalculate();
        }
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.updateOverlay();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));

    }
};