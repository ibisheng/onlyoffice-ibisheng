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
            grouped_objects[i].setPosition(grouped_objects[i].x - min_x, grouped_objects[i].y - min_y);
            grouped_objects[i].setGroup(group);
            group.addToSpTree(grouped_objects[i]);
        }
        group.recalculate();
        group.select(this);
        return group;
    },

    canGroup: function()
    {
        return this.selectedObjects.length > 1;//TODO: сделать нормальную проверку
    },

    canUnGroup: function()
    {
        return false;
    },

    startTrackNewShape: function(presetGeom)
    {
        this.changeCurrentState(new StartTrackNewShapeState(this, this.drawingObjects, presetGeom));
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
        var selected_objects = this.selectedObjects;
        if(selected_objects.length === 1)
        {
            var hit_to_adj = selected_objects[0].hitToAdjustment(x, y);
            if(hit_to_adj.hit)
            {
                return {objectId: selected_objects[0].drawingBase.id, cursorType: "crosshair"};
            }
        }

        for(var i = selected_objects.length - 1; i > -1; --i)
        {
            var hit_to_handles = selected_objects[i].hitToHandles(x, y);
            var cursor_type;
            if(hit_to_handles > -1)
            {
                if(hit_to_handles === 8)
                {
                    if(!selected_objects[i].canRotate())
                        return null;
                    cursor_type = "crosshair";
                }
                else
                {
                    if(!selected_objects[i].canResize())
                        return null;
                    cursor_type = CURSOR_TYPES_BY_CARD_DIRECTION[selected_objects[i].getCardDirectionByNum(hit_to_handles)];

                }
                return {objectId: selected_objects[i].drawingBase.id, cursorType: cursor_type};
            }
        }

        for(i = selected_objects.length - 1; i > -1; --i)
        {
            if(selected_objects[i].hitInBoundingRect(x, y))
            {
                return {objectId: selected_objects[i].drawingBase.id,  cursorType: "move"};
            }
        }

        var arr_drawing_objects = this.drawingObjects.getDrawingObjects();
        for(i = arr_drawing_objects.length-1; i > -1; --i)
        {
            var cur_drawing_base = arr_drawing_objects[i];
            if(cur_drawing_base.isGraphicObject())
            {
                var cur_drawing = cur_drawing_base.graphicObject;
                if(cur_drawing.isSimpleObject())
                {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                    {
                        return {objectId: cur_drawing_base.id ,  cursorType: "move"};
                    }
                    else if(hit_in_text_rect)
                    {
                        return null;//TODO
                    }
                }
                else
                {
                    //TODO
                }
            }
        }
        return null;
    }
};