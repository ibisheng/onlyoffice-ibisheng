/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 6:29 PM
 * To change this template use File | Settings | File Templates.
 */
function DrawingObjectsController(drawingObjects)
{
    this.drawingObjects = drawingObjects;

    this.curState = new NullState(this, drawingObjects);
    this.selectedObjects = [];
    this.arrPreTrackObjects = [];
    this.arrTrackObjects = [];
}

DrawingObjectsController.prototype =
{
    changeCurrentState: function(newState)
    {
        this.curState = newState;
    },

    onMouseDown: function(e, x, y)
    {
        this.curState.onMouseDown(e, x, y);
    },

    onMouseMove: function(e, x, y)
    {
        this.curState.onMouseMove(e, x, y);
    },

    onMouseUp: function(e, x, y)
    {
        this.curState.onMouseUp(e, x, y);
    },

    onKeyDown: function(e)
    {
        this.curState.onKeyDown(e);
    },

    resetSelectionState: function()
    {
        while(this.selectedObjects.length > 0)
            this.selectedObjects[0].deselect(this);
        this.changeCurrentState(new NullState(this, this.drawingObjects));
    },

    resetSelection: function()
    {
        while(this.selectedObjects.length > 0)
            this.selectedObjects[0].deselect(this);
    },

    clearPreTrackObjects: function()
    {
        this.arrPreTrackObjects.length = 0;
    },

    addPreTrackObject: function(preTrackObject)
    {
        this.arrPreTrackObjects.push(preTrackObject);
    },

    clearTrackObjects: function()
    {
        this.arrTrackObjects.length = 0;
    },

    addTrackObject: function(trackObject)
    {
        this.arrTrackObjects.push(trackObject);
    },

    swapTrackObjects: function()
    {
        this.clearTrackObjects();
        for(var i = 0; i < this.arrPreTrackObjects.length; ++i)
            this.addTrackObject(this.arrPreTrackObjects[i]);
        this.clearPreTrackObjects();
    },

    getTrackObjects: function()
    {
        return this.arrTrackObjects;
    },

    rotateTrackObjects: function(angle, e)
    {
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].track(angle, e);
    },

    trackNewShape: function(e, x, y)
    {
        this.arrTrackObjects[0].track(e, x, y);
    },

    trackMoveObjects: function(dx, dy)
    {
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].track(dx, dy);
    },

    trackAdjObject: function(x, y)
    {
        if(this.arrTrackObjects.length > 0)
            this.arrTrackObjects[0].track(x, y);
    },

    trackResizeObjects: function(kd1, kd2, e)
    {
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].track(kd1, kd2, e);
    },

    trackEnd: function()
    {
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].trackEnd();
        this.drawingObjects.showDrawingObjects(true);
    },

    createGroup: function(drawingBase)
    {
        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var grouped_objects = [];
        for(var i = 0; i < drawing_bases.length; ++i)
        {
            var cur_drawing_base = drawing_bases[i];
            if(cur_drawing_base.isGraphicObject() && cur_drawing_base.graphicObject.selected && cur_drawing_base.graphicObject.canGroup())
            {
                grouped_objects.push(cur_drawing_base.graphicObject);
            }
        }
        if(grouped_objects.length < 2)
            return null;

        this.resetSelection();
        var max_x, min_x, max_y, min_y;
        var bounds = grouped_objects[0].getBoundsInGroup();
        max_x = bounds.maxX;
        max_y = bounds.maxY;
        min_x = bounds.minX;
        min_y = bounds.minY;
        for(i = 1; i < grouped_objects.length; ++i)
        {
            bounds = grouped_objects[i].getBoundsInGroup();
            if(max_x < bounds.maxX)
                max_x = bounds.maxX;
            if(max_y < bounds.maxY)
                max_y = bounds.maxY;
            if(min_x > bounds.minX)
                min_x = bounds.minX;
            if(min_y > bounds.minY)
                min_y = bounds.minY;
        }
        var group = new CGroupShape(drawingBase, this.drawingObjects);
        group.setPosition(min_x, min_y);
        group.setExtents(max_x - min_x, max_y - min_y);
        group.setChildExtents(max_x - min_x, max_y - min_y);
        group.setChildOffsets(0, 0);
        for(i = 0; i < grouped_objects.length; ++i)
        {
            this.drawingObjects.deleteDrawingObjectById(grouped_objects[i].drawingBase.id);
            grouped_objects[i].setDrawingBase(null);
            grouped_objects[i].setPosition(grouped_objects[i].x - min_x, grouped_objects[i].y - min_y);
            grouped_objects[i].setGroup(group);
            group.addToSpTree(grouped_objects[i]);
        }
        group.recalculate();
        group.select(this);
        return group;
    },

    unGroup: function()
    {
        var selected_objects = this.selectedObjects;
        var ungrouped_objects = [];
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(selected_objects[i].isGroup() && selected_objects[i].canUnGroup())
            {
                ungrouped_objects.push(selected_objects[i]);

            }
        }
        for(i = 0; i < ungrouped_objects.length; ++i)
        {
            var ungrouped_sp_tree = ungrouped_objects[i].getUnGroupedSpTree();
            for(var j = 0; j < ungrouped_sp_tree.length; ++j)
            {
                ungrouped_sp_tree[j].recalculateTransform();
            }
            this.drawingObjects.insertUngroupedObjects(ungrouped_objects[i].drawingBase.id, ungrouped_sp_tree);
        }
    },

    canGroup: function()
    {
        return this.selectedObjects.length > 1;//TODO: сделать нормальную проверку
    },

    canUnGroup: function()
    {
        return true;
    },

    startTrackNewShape: function(presetGeom)
    {
        switch (presetGeom)
        {
            case "spline":
            {
                this.changeCurrentState(new SplineBezierState(this, this.drawingObjects));
                break;
            }
            case "polyline1":
            {
                this.changeCurrentState(new PolyLineAddState(this, this.drawingObjects));
                break;
            }
            case "polyline2":
            {
                this.changeCurrentState(new AddPolyLine2State(this, this.drawingObjects));
                break;
            }
            default :
            {
                this.changeCurrentState(new StartTrackNewShapeState(this, this.drawingObjects, presetGeom));
                break;
            }
        }
    },

    drawTracks: function(overlay)
    {
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].draw(overlay);
    },

    drawSelection: function(drawingDocument)
    {
        this.curState.drawSelection(drawingDocument);
    },

    isPointInDrawingObjects: function(x, y)
    {
        return this.curState.isPointInDrawingObjects(x, y);
    }
};