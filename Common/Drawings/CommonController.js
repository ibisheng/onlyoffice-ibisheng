"use strict";

var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});

var contentchanges_Add    = 1;
var contentchanges_Remove = 2;


var HANDLE_EVENT_MODE_HANDLE = 0;
var HANDLE_EVENT_MODE_CURSOR = 1;

var global_canvas = null;

function CheckLinePreset(preset)
{
    return preset === "line";
}

function CompareGroups(a, b)
{
    if(a.group == null && b.group == null)
        return 0;
    if(a.group == null)
        return 1;
    if(b.group == null)
        return -1;

    var count1 = 0;
    var cur_group = a.group;
    while(cur_group != null)
    {
        ++count1;
        cur_group = cur_group.group;
    }
    var count2 = 0;
    cur_group = b.group;
    while(cur_group != null)
    {
        ++count2;
        cur_group = cur_group.group;
    }
    return count1 - count2;
}

function CheckSpPrXfrm(object)
{
    if(!object.spPr)
    {
        object.setSpPr(new CSpPr());
        object.spPr.setParent(object);
    }
    if(!object.spPr.xfrm)
    {
        object.spPr.setXfrm(new CXfrm());
        object.spPr.xfrm.setParent(object.spPr);
        object.spPr.xfrm.setOffX(object.x);
        object.spPr.xfrm.setOffY(object.y);
        object.spPr.xfrm.setExtX(object.extX);
        object.spPr.xfrm.setExtY(object.extY);
    }

}

function CheckSpPrXfrm2(object)
{
    if(!object.spPr)
    {
        object.spPr = new CSpPr();
        object.spPr.parent = object;
    }
    if(!object.spPr.xfrm)
    {
        object.spPr.xfrm = new CXfrm();
        object.spPr.xfrm.parent = object.spPr;
        object.spPr.xfrm.offX = 0;//object.x;
        object.spPr.xfrm.offY = 0;//object.y;
        object.spPr.xfrm.extX = object.extX;
        object.spPr.xfrm.extY = object.extY;
    }

}


function getObjectsByTypesFromArr(arr, bGrouped)
{
    var ret = {shapes: [], images: [], groups: [], charts: []};
    var selected_objects = arr;
    for(var i = 0;  i < selected_objects.length; ++i)
    {
        var drawing = selected_objects[i];
        var type = drawing.getObjectType();
        switch(type)
        {
            case historyitem_type_Shape:
            {
                ret.shapes.push(drawing);
                break;
            }
            case historyitem_type_ImageShape:
            {
                ret.images.push(drawing);
                break;
            }
            case historyitem_type_GroupShape:
            {
                ret.groups.push(drawing);
                if(bGrouped)
                {
                    var by_types = getObjectsByTypesFromArr(drawing.spTree, true);
                    ret.shapes = ret.shapes.concat(by_types.shapes);
                    ret.images = ret.images.concat(by_types.images);
                    ret.charts = ret.charts.concat(by_types.charts);
                }
                break;
            }
            case historyitem_type_ChartSpace:
            {
                ret.charts.push(drawing);
                break;
            }
        }
    }
    return ret;
}

function CreateBlipFillUniFillFromUrl(url)
{
    var ret = new CUniFill();
    ret.setFill(new CBlipFill());
    ret.fill.setRasterImageId(url);
    return ret;
}


function getTargetTextObject(controller)
{
    if(controller.selection.textSelection)
    {
        return  controller.selection.textSelection;
    }
    else if(controller.selection.groupSelection )
    {
        if(controller.selection.groupSelection.selection.textSelection)
        {
            return controller.selection.groupSelection.selection.textSelection;
        }
        else if(controller.selection.groupSelection.selection.chartSelection && controller.selection.groupSelection.selection.chartSelection.selection.textSelection)
        {
            return controller.selection.groupSelection.selection.chartSelection.selection.textSelection;
        }
    }
    else if(controller.selection.chartSelection && controller.selection.chartSelection.selection.textSelection)
    {
        return controller.selection.chartSelection.selection.textSelection;
    }
    return null;
}

function DrawingObjectsController(drawingObjects)
{
    this.drawingObjects = drawingObjects;

    this.curState = new NullState(this);

    this.selectedObjects = [];
    this.drawingDocument = drawingObjects.drawingDocument;
    this.selection =
    {
        selectedObjects: [],
        groupSelection: null,
        chartSelection: null,
        textSelection: null
    };
    this.arrPreTrackObjects = [];
    this.arrTrackObjects = [];

    this.objectsForRecalculate = {};

    this.chartForProps = null;

    this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
}



DrawingObjectsController.prototype =
{
    handleAdjustmentHit: function(hit, selectedObject, group, pageIndex, bWord)
    {
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            this.arrPreTrackObjects.length = 0;
            if(hit.adjPolarFlag === false)
            {
                this.arrPreTrackObjects.push(new XYAdjustmentTrack(selectedObject, hit.adjNum));
            }
            else
            {
                this.arrPreTrackObjects.push(new PolarAdjustmentTrack(selectedObject, hit.adjNum));
            }
            if(!isRealObject(group))
            {
                this.changeCurrentState(new PreChangeAdjState(this, selectedObject));
            }
            else
            {
                this.changeCurrentState(new PreChangeAdjInGroupState(this, group));
            }
            return true;
        }
        else
        {
            if(!isRealObject(group))
                return {objectId: selectedObject.Get_Id(), cursorType: "crosshair", bMarker: true};
            else
                return {objectId: selectedObject.Get_Id(), cursorType: "crosshair", bMarker: true};
        }
    },

    checkChartForProps: function()
    {
        if(this.chartForProps)
            return;
        if(this.selection.groupSelection)
        {
            if(this.selection.groupSelection.selectedObjects.length === 1 && this.selection.groupSelection.selectedObjects[0].getObjectType() === historyitem_type_ChartSpace)
            {
                this.chartForProps = this.selection.groupSelection.selectedObjects[0];
            }
        }
        else if(this.selectedObjects.length === 1 && this.selectedObjects[0].getObjectType() === historyitem_type_ChartSpace)
        {
            this.chartForProps = this.selectedObjects[0];
        }
    },

    resetInternalSelection: function()
    {
        if(this.selection.groupSelection)
        {
            this.selection.groupSelection.resetSelection(this);
            this.selection.groupSelection = null;
        }
        if(this.selection.textSelection)
        {
            var content = this.selection.textSelection.getDocContent();
            content && content.Selection_Remove();
            this.selection.textSelection = null;
        }
        if(this.selection.chartSelection)
        {
            this.selection.chartSelection.resetSelection();
            this.selection.chartSelection = null;
        }
        if(this.selection.wrapPolygonSelection)
        {
            this.selection.wrapPolygonSelection = null;
        }
    },

    handleHandleHit: function(hit, selectedObject, group, pageIndex, bWord)
    {
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            var selected_objects = group ? group.selectedObjects : this.selectedObjects;
            this.arrPreTrackObjects.length = 0;
            if(hit === 8)
            {
                if(selectedObject.canRotate())
                {
                    for(var i = 0; i < selected_objects.length; ++i)
                    {
                        if(selected_objects[i].canRotate())
                        {
                            this.arrPreTrackObjects.push(selected_objects[i].createRotateTrack());
                        }
                    }
                    if(!isRealObject(group))
                    {
                        this.resetInternalSelection();
                        this.changeCurrentState(new PreRotateState(this, selectedObject));
                    }
                    else
                    {
                        group.resetInternalSelection();
                        this.changeCurrentState(new PreRotateInGroupState(this, group, selectedObject));
                    }
                }
            }
            else
            {
                if(selectedObject.canResize())
                {
                    var card_direction = selectedObject.getCardDirectionByNum(hit);
                    for(var j = 0; j < selected_objects.length; ++j)
                    {
                        if(selected_objects[j].canResize())
                            this.arrPreTrackObjects.push(selected_objects[j].createResizeTrack(card_direction));
                    }
                    if(!isRealObject(group))
                    {
                        this.resetInternalSelection();
                        this.changeCurrentState(new PreResizeState(this, selectedObject, card_direction));
                    }
                    else
                    {
                        group.resetInternalSelection();
                        this.changeCurrentState(new PreResizeInGroupState(this, group, selectedObject, card_direction));
                    }
                }
            }
            return true;
        }
        else
        {
            var card_direction = selectedObject.getCardDirectionByNum(hit);
            return {objectId: selectedObject.Get_Id(), cursorType: hit === 8 ? "crosshair" : CURSOR_TYPES_BY_CARD_DIRECTION[card_direction], bMarker: true};
        }
    },

    handleMoveHit: function(object, e, x, y, group, bInSelect, pageIndex, bWord)
    {
        var b_is_inline;
        if(isRealObject(group))
        {
            b_is_inline = group.parent && group.parent.Is_Inline();
        }
        else
        {
            b_is_inline = object.parent && object.parent.Is_Inline();
        }
        var b_is_selected_inline = this.selectedObjects.length === 1 && (this.selectedObjects[0].parent && this.selectedObjects[0].parent.Is_Inline());
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            var selector = group ? group : this;
            if(object.canMove())
            {
                this.arrPreTrackObjects.length = 0;
                var is_selected =  object.selected;
                if(!(e.CtrlKey || e.ShiftKey) && !is_selected || b_is_inline || b_is_selected_inline)
                    selector.resetSelection();
                selector.selectObject(object, pageIndex);
                if(!is_selected)
                    this.updateOverlay();
                this.checkSelectedObjectsForMove(group);
                if(!isRealObject(group))
                {
                    this.resetInternalSelection();
                    if(!b_is_inline)
                        this.changeCurrentState(new PreMoveState(this, x, y, e.ShiftKey, e.CtrlKey,  object, is_selected, /*true*/!bInSelect));
                    else
                    {
                        this.changeCurrentState(new PreMoveInlineObject(this, object, is_selected, true));
                    }
                }
                else
                {
                    group.resetInternalSelection();
                    this.changeCurrentState(new PreMoveInGroupState(this, group, x, y, e.ShiftKey, e.CtrlKey, object,  is_selected));
                }
            }
            return true;
        }
        else
        {
            return {objectId: object.Get_Id(), cursorType: "move", bMarker: bInSelect};
        }
    },

    recalculateCurPos: function()
    {
        if(this.selection.textSelection)
        {
            var content = this.selection.textSelection.getDocContent();
            if(content)
            {
                content.RecalculateCurPos();
            }
        }
        else if(this.selection.groupSelection)
        {
            this.selection.groupSelection.recalculateCurPos();
        }
        else if(this.selection.chartSelection)
        {
            this.selection.chartSelection.recalculateCurPos();
        }
    },

    handleEndMoveTrack: function(e)
    {
        if(!e.CtrlKey)
        {
            this.handleEndResizeTrack();
        }
        else
        {
            //TODO: сделать копирование
        }
    },


    handleNoHit: function()
    {
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            this.resetSelectionState();
        }
        else
        {
            return null;
        }
    },

    handleClickOnSelectedGroup: function(group, e, x, y)
    {
        this.changeCurrentState(new GroupState(this, group));
        this.onMouseDown(e, x, y);
        this.onMouseUp(e, x, y);
    },


    checkSelectedObjectsForMove: function(group)
    {
        var selected_object = group ? group.selectedObjects : this.selectedObjects;
        for(var i = 0; i < selected_object.length; ++i)
        {
            if(selected_object[i].canMove())
            {
                this.arrPreTrackObjects.push(selected_object[i].createMoveTrack());
            }
        }
    },

    getSnapArraysTrackObjects: function()
    {
        var snapX = [], snapY = [];
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
        {
            if(this.arrTrackObjects[i].originalObject && this.arrTrackObjects[i].originalObject.getSnapArrays)
            {
                this.arrTrackObjects[i].originalObject.getSnapArrays(snapX, snapY);
            }
        }
        return {snapX: snapX, snapY: snapY};
    },

    handleTextHit: function(object, e, x, y, group, pageIndex, bWord)
    {
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            this.resetSelection();
            (group ? group : this).selectObject(object,pageIndex);
            object.selectionSetStart(e, x, y, pageIndex);
            if(!group)
            {
                this.selection.textSelection = object;
            }
            else
            {
                this.selectObject(group, pageIndex);
                this.selection.groupSelection = group;
                group.selection.textSelection = object;
            }
            this.changeCurrentState(new TextAddState(this, object));
            //if(e.ClickCount < 2)
            this.updateSelectionState();
            return true;
        }
        else
        {
            return {objectId: object.Get_Id(), cursorType: "text"};
        }
    },

    handleTextHitGroup: function(object, group, e, pageIndex)
    {
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            this.resetSelection();
            this.selectObject(group, pageIndex);
            group.selectObject(object, pageIndex);
            object.selectionSetStart(e, x, y);
            this.changeCurrentState(new TextAddInGroup(this, group, object));
            if(e.ClickCount < 2)
                this.updateSelectionState();
            return true;
        }
        else
        {
            return {objectId: object.Get_Id(), cursorType: "text"};
        }
    },

    handleStartTrackAdj: function(e, x, y)
    {
        this.arrTrackObjects.push(this.arrPreTrackObjects[0]);
        this.arrPreTrackObjects.length = 0;
        this.changeCurrentState(new ChangeAdjState(this, this.curState.majorObject));
        this.onMouseMove(e, x, y);
    },

    handleTrackAdj: function(e, x, y)
    {
        this.arrTrackObjects[0].track(x, y);
        this.updateOverlay();
    },

    handleEndTrackAdj: function()
    {
        var track_object = this.arrTrackObjects[0];
        var _this = this;
        var group = this.curState.group;
        function callback()
        {
            History.Create_NewPoint();
            track_object.trackEnd();
            _this.startRecalculate();
        }
        this.checkSelectedObjectsAndFireCallback(callback, []);
        this.arrTrackObjects.length = 0;
        if(group)
            this.changeCurrentState(new GroupState(this, group));
        else
            this.changeCurrentState(new NullState(this));
    },

    handleStartRotateTrack: function(e, x, y)
    {
        this.changeCurrentState(new RotateState(this, this.curState.majorObject));
        this.swapTrackObjects();
        this.onMouseMove(e, x, y);
    },

    handleRotateTrack: function(e, x, y)
    {
        var angle = this.curState.majorObject.getRotateAngle(x, y);
        this.rotateTrackObjects(angle, e);
        this.updateOverlay();
    },

    handleStartResizeTrack: function(e, x, y)
    {
        this.swapTrackObjects();
        this.changeCurrentState(new ResizeState(this, this.curState.majorObject, this.curState.cardDirection));
        this.onMouseMove(e, x, y);
    },

    handleResizeTrack: function(e, x, y)
    {
        var point_x, point_y;
        var snap_object_x = GetSnapObject([x], 0, this.curState.snapX);
        var snap_object_y = GetSnapObject([y], 0, this.curState.snapY);
        if(snap_object_x.point !== null)
        {
            point_x = snap_object_x.point;
        }
        else
        {
            point_x = x;
        }
        if(snap_object_y.point !== null)
        {
            point_y = snap_object_y.point;
        }
        else
        {
            point_y = y;
        }
        var resize_coefficients = this.curState.majorObject.getResizeCoefficients(this.curState.handleNum, point_x, point_y);
        this.trackResizeObjects(resize_coefficients.kd1, resize_coefficients.kd2, e);
        this.updateOverlay();
    },


    handleEndResizeTrack: function()
    {
        var tracks = this.getCopyTrackArray();
        var _this = this;
        var group = this.curState.group;
        function callback()
        {
            History.Create_NewPoint();
            for(var i = 0; i < tracks.length; ++i)
            {
                tracks[i].trackEnd();
            }
            if(isRealObject(group))
            {
                group.updateCoordinatesAfterInternalResize();
            }
            _this.startRecalculate();
        }
        this.checkSelectedObjectsAndFireCallback(callback, []);
        this.arrTrackObjects.length = 0;
        if(!isRealObject(this.curState.group))
            this.changeCurrentState(new NullState(this));
        else
            this.changeCurrentState(new GroupState(this, this.curState.group));
    },


    handleMoveMouseDown: function()
    {
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            return true;
        }
        else
        {
            return {cursorType: "move", objectId: this.curState.majorObject.Get_Id()};
        }
    },


    handleAdjMouseDown: function()
    {
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            return true;
        }
        else
        {
            return {cursorType: "crosshair", objectId: this.curState.majorObject.Get_Id()};
        }
    },

    handleRotateMouseDown: function()
    {
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            return true;
        }
        else
        {
            return {cursorType: "crosshair", objectId: this.curState.majorObject.Get_Id()};
        }
    },

    handleResizeMouseDown: function()
    {
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            return true;
        }
        else
        {
            return {cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[this.curState.cardDirection], objectId: this.curState.majorObject.Get_Id()};
        }
    },

    handleStartTrackNewShape: function(persetGeom, x, y)
    {
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            this.changeCurrentState(new BeginTrackNewShapeState(this, persetGeom, x, y));
            return true;
        }
        else
        {
            return {cursorType: "crosshair", objectId: null/*TODO: выяснить какой Id нужен верхнему классу*/};
        }
    },

    handleTarckNewShapeMouseDown: function()
    {
        if(this.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            return true;
        }
        else
        {
            return {cursorType: "crosshair", objectId: null/*TODO: выяснить какой Id нужен верхнему классу*/};
        }
    },

    getSnapArrays: function()
    {
        var drawing_objects = this.getDrawingObjects();
        var snapX = [];
        var snapY = [];
        for(var i = 0; i < drawing_objects.length; ++i)
        {
            if(drawing_objects[i].getSnapArrays)
            {
                drawing_objects[i].getSnapArrays(snapX, snapY);
            }
        }
        return {snapX: snapX, snapY: snapY};
    },


    getCopyTrackArray: function()
    {
        var ret = [];
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
        {
            ret.push(this.arrTrackObjects[i]);
        }
        return ret;
    },

    drawSelect: function(pageIndex, drawingDocument)
    {
        var i;
        if(this.selection.textSelection)
        {
            if(this.selection.textSelection.selectStartPage === pageIndex)
            {
                drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.selection.textSelection.getTransformMatrix(), 0, 0, this.selection.textSelection.extX, this.selection.textSelection.extY, CheckObjectLine(this.selection.textSelection), this.selection.textSelection.canRotate());
                if(this.selection.textSelection.drawAdjustments)
                    this.selection.textSelection.drawAdjustments(drawingDocument);
            }
        }
        else if(this.selection.groupSelection)
        {
            if(this.selection.groupSelection.selectStartPage === pageIndex)
            {
                drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.selection.groupSelection.getTransformMatrix(), 0, 0, this.selection.groupSelection.extX, this.selection.groupSelection.extY, false, this.selection.groupSelection.canRotate());
                if(this.selection.groupSelection.selection.textSelection)
                {
                    for(i = 0; i < this.selection.groupSelection.selectedObjects.length ; ++i)
                    {
                        drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.selection.groupSelection.selectedObjects[i].transform, 0, 0, this.selection.groupSelection.selectedObjects[i].extX, this.selection.groupSelection.selectedObjects[i].extY, CheckObjectLine(this.selection.groupSelection.selectedObjects[i]), this.selection.groupSelection.selectedObjects[i].canRotate());
                    }
                }
                else if(this.selection.groupSelection.selection.chartSelection)
                {
                    if(this.selection.groupSelection.selection.chartSelection.selectStartPage === pageIndex)
                    {
                        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.getTransformMatrix(), 0, 0, this.selection.groupSelection.selection.chartSelection.extX, this.selection.groupSelection.selection.chartSelection.extY, false, this.selection.groupSelection.selection.chartSelection.canRotate());
                        if(this.selection.groupSelection.selection.chartSelection.selection.textSelection)
                        {
                            drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.selection.groupSelection.selection.chartSelection.selection.textSelection.transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.textSelection.extX, this.selection.groupSelection.selection.chartSelection.selection.textSelection.extY, false, false);
                        }
                        else if(this.selection.groupSelection.selection.chartSelection.selection.title)
                        {
                            drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.selection.title.transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.title.extX, this.selection.groupSelection.selection.chartSelection.selection.title.extY, false, false);
                        }
                        else if(this.selection.groupSelection.selection.chartSelection.selection.dataLbls)
                        {
                            for(i = 0; i < this.selection.groupSelection.selection.chartSelection.selection.dataLbls.length; ++i)
                            {
                                drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.selection.dataLbls[i].transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.dataLbls[i].extX, this.selection.groupSelection.selection.chartSelection.selection.dataLbls[i].extY, false, false);
                            }
                        }
                        else if(this.selection.groupSelection.selection.chartSelection.selection.dataLbl)
                        {
                            drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.selection.dataLbl.transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.dataLbl.extX, this.selection.groupSelection.selection.chartSelection.selection.dataLbl.extY, false, false);
                        }
                        else if(this.selection.groupSelection.selection.chartSelection.selection.legend)
                        {
                            drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.selection.legend.transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.legend.extX, this.selection.groupSelection.selection.chartSelection.selection.legend.extY, false, false);
                        }
                        else if(this.selection.groupSelection.selection.chartSelection.selection.legendEntry)
                        {
                            drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.selection.legendEntry.transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.legendEntry.extX, this.selection.groupSelection.selection.chartSelection.selection.legendEntry.extY, false, false);
                        }
                        else if(this.selection.groupSelection.selection.chartSelection.selection.axisLbls)
                        {
                            drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.selection.axisLbls.transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.axisLbls.extX, this.selection.groupSelection.selection.chartSelection.selection.axisLbls.extY, false, false);
                        }
                    }
                }
                else
                {
                    for(i = 0; i < this.selection.groupSelection.selectedObjects.length ; ++i)
                    {
                        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selectedObjects[i].transform, 0, 0, this.selection.groupSelection.selectedObjects[i].extX, this.selection.groupSelection.selectedObjects[i].extY, CheckObjectLine(this.selection.groupSelection.selectedObjects[i]), this.selection.groupSelection.selectedObjects[i].canRotate());
                    }
                }

                if(this.selection.groupSelection.selectedObjects.length === 1 && this.selection.groupSelection.selectedObjects[0].drawAdjustments)
                {
                    this.selection.groupSelection.selectedObjects[0].drawAdjustments(drawingDocument);
                }
            }
        }
        else if(this.selection.chartSelection)
        {
            if(this.selection.chartSelection.selectStartPage === pageIndex)
            {
                drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.getTransformMatrix(), 0, 0, this.selection.chartSelection.extX, this.selection.chartSelection.extY, false, this.selection.chartSelection.canRotate());
                if(this.selection.chartSelection.selection.textSelection)
                {
                    drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.selection.chartSelection.selection.textSelection.transform, 0, 0, this.selection.chartSelection.selection.textSelection.extX, this.selection.chartSelection.selection.textSelection.extY, false, false);
                }
                else if(this.selection.chartSelection.selection.title)
                {
                    drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.selection.title.transform, 0, 0, this.selection.chartSelection.selection.title.extX, this.selection.chartSelection.selection.title.extY, false, false);
                }
                else if(this.selection.chartSelection.selection.dataLbls)
                {
                    for(i = 0; i < this.selection.chartSelection.selection.dataLbls.length; ++i)
                    {
                        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.selection.dataLbls[i].transform, 0, 0, this.selection.chartSelection.selection.dataLbls[i].extX, this.selection.chartSelection.selection.dataLbls[i].extY, false, false);
                    }
                }
                else if(this.selection.chartSelection.selection.dataLbl)
                {
                    drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.selection.dataLbl.transform, 0, 0, this.selection.chartSelection.selection.dataLbl.extX, this.selection.chartSelection.selection.dataLbl.extY, false, false);
                }
                else if(this.selection.chartSelection.selection.legend)
                {
                    drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.selection.legend.transform, 0, 0, this.selection.chartSelection.selection.legend.extX, this.selection.chartSelection.selection.legend.extY, false, false);
                }
                else if(this.selection.chartSelection.selection.legendEntry)
                {
                    drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.selection.legendEntry.transform, 0, 0, this.selection.chartSelection.selection.legendEntry.extX, this.selection.chartSelection.selection.legendEntry.extY, false, false);
                }
                else if(this.selection.chartSelection.selection.axisLbls)
                {
                    drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.selection.axisLbls.transform, 0, 0, this.selection.chartSelection.selection.axisLbls.extX, this.selection.chartSelection.selection.axisLbls.extY, false, false);
                }
            }
        }
        else if(this.selection.wrapPolygonSelection)
        {
            if(this.selection.wrapPolygonSelection.selectStartPage === pageIndex)
                drawingDocument.AutoShapesTrack.DrawEditWrapPointsPolygon(this.selection.wrapPolygonSelection.parent.wrappingPolygon.calculatedPoints, new CMatrix());
        }
        else
        {
            for(i = 0; i < this.selectedObjects.length; ++i)
            {
                if(this.selectedObjects[i].selectStartPage === pageIndex)
                {
                    drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selectedObjects[i].getTransformMatrix(), 0, 0, this.selectedObjects[i].extX, this.selectedObjects[i].extY, CheckObjectLine(this.selectedObjects[i]), this.selectedObjects[i].canRotate());
                    //if(this.document)
                    //    this.drawingDocument.AutoShapesTrack.DrawEditWrapPointsPolygon(this.selectedObjects[i].parent.wrappingPolygon.calculatedPoints, new CMatrix());
                }

            }
            if(this.selectedObjects.length === 1 && this.selectedObjects[0].drawAdjustments && this.selectedObjects[0].selectStartPage === pageIndex)
            {
                this.selectedObjects[0].drawAdjustments(drawingDocument);
            }
        }
        if(this.document)
        {
            if(this.selectedObjects.length === 1 && this.selectedObjects[0].parent && !this.selectedObjects[0].parent.Is_Inline())
            {
                var anchor_pos;
                if(this.arrTrackObjects.length === 1 && !(this.arrTrackObjects[0] instanceof TrackPointWrapPointWrapPolygon || this.arrTrackObjects[0] instanceof  TrackNewPointWrapPolygon))
                {
                    var page_index = isRealNumber(this.arrTrackObjects[0].pageIndex) ? this.arrTrackObjects[0].pageIndex : (isRealNumber(this.arrTrackObjects[0].selectStartPage) ? this.arrTrackObjects[0].selectStartPage : 0);
                    if(page_index === pageIndex)
                    {
                        var bounds = this.arrTrackObjects[0].getBounds();
                        var nearest_pos = this.document.Get_NearestPos(page_index, bounds.min_x, bounds.min_y, true, this.selectedObjects[0].parent);
                        nearest_pos.Page = page_index;
                        drawingDocument.AutoShapesTrack.drawFlowAnchor(nearest_pos.X, nearest_pos.Y);
                    }
                }
                else
                {
                    var page_index = this.selectedObjects[0].selectStartPage;
                    if(page_index === pageIndex)
                    {
                        var paragraph = this.selectedObjects[0].parent.Get_ParentParagraph();
                        anchor_pos = paragraph.Get_AnchorPos(this.selectedObjects[0].parent);
                        drawingDocument.AutoShapesTrack.drawFlowAnchor(anchor_pos.X, anchor_pos.Y);
                    }
                }
            }
        }
        return;
    },

    handleEndRotateTrack: function()
    {
        var tracks = this.getCopyTrackArray();
        var _this = this;
        var group = this.curState.group;
        function callback()
        {
            History.Create_NewPoint();
            for(var i = 0; i < tracks.length; ++i)
            {
                tracks[i].trackEnd();
            }
            if(isRealObject(group))
            {
                group.updateCoordinatesAfterInternalResize();
            }
            _this.startRecalculate();
        }
        this.checkSelectedObjectsAndCallback(callback, []);
        this.arrTrackObjects.length = 0;
        if(!group)
            this.changeCurrentState(new NullState(this));
        else
            this.changeCurrentState(new GroupState(this, group));
    },

    handleMouseUpCtrlShiftOnSelectedObject: function(object)
    {
        object.deselect(this);
        this.changeCurrentState(new NullState(this));
    },

    selectObject: function(object, pageIndex)
    {
        object.select(this, pageIndex);
//        this.sendDrawingObjectsProps();
    },

    deselectObject: function(object)
    {

    },


    recalculate: function()
    {
        for(var key in this.objectsForRecalculate)
        {
            this.objectsForRecalculate[key].recalculate();
        }
        this.objectsForRecalculate = {};
    },

    addContentChanges: function(changes)
    {
        // this.contentChanges.Add(changes);
    },

    refreshContentChanges: function()
    {
        //this.contentChanges.Refresh();
        //this.contentChanges.Clear();
    },

    getAllFontNames: function()
    {
    },

    getTargetDocContent: function(bCheckChartTitle)
    {
        var text_object = getTargetTextObject(this);
        if(text_object)
        {
            if(bCheckChartTitle && text_object.checkDocContent)
            {
                text_object.checkDocContent();
            }
            return text_object.getDocContent();
        }
        return null;
    },


    addNewParagraph: function(bRecalculate)
    {
        var content = this.getTargetDocContent(true);
        content && content.Add_NewParagraph(bRecalculate);
    },


    paragraphClearFormatting: function()
    {
        var content = this.getTargetDocContent(true);
        content && content.Paragraph_ClearFormatting();
    },

    applyDocContentFunction: function(f, args)
    {
        function applyToArrayDrawings(arr)
        {
            for(var i = 0; i < arr.length; ++i)
            {
                if(arr[i].getObjectType() === historyitem_type_GroupShape)
                {
                    applyToArrayDrawings(arr[i].arrGraphicObjects);
                }
                else if(arr[i].getDocContent)
                {
                    var content = arr[i].getDocContent();
                    if(content)
                    {
                        content.Set_ApplyToAll(true);
                        f.apply(content, args);
                        content.Set_ApplyToAll(false);
                    }
                }
            }
        }
        function applyToChartSelection(chart)
        {
            var content;
            if(chart.selection.textSelection)
            {
                content = chart.selection.textSelection.getDocContent();
                if(content)
                {
                    f.apply(content, args);
                }
            }
            else if(chart.selection.title)
            {
                content = chart.selection.title.getDocContent();
                if(content)
                {
                    content.Set_ApplyToAll(true);
                    f.apply(content, args);
                    content.Set_ApplyToAll(false);
                }
            }
        }
        if(this.selection.textSelection)
        {
            f.apply(this.selection.textSelection.getDocContent(), args);
        }
        else if(this.selection.groupSelection)
        {
            if(this.selection.groupSelection.selection.textSelection)
                f.apply(this.selection.groupSelection.selection.textSelection.getDocContent(), args);
            else if(this.selection.groupSelection.selection.chartSelection)
            {
                applyToChartSelection(this.selection.groupSelection.selection.chartSelection);
            }
            else
                applyToArrayDrawings(this.selection.groupSelection.selectedObjects);
        }
        else if(this.selection.chartSelection)
        {
            applyToChartSelection(this.selection.chartSelection);
        }
        else
        {
            applyToArrayDrawings(this.selectedObjects);
        }
        if(this.document)
        {
            this.document.Recalculate();
        }
    },

    setParagraphSpacing: function(Spacing)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphSpacing, [Spacing]);
    },

    setParagraphTabs: function(Tabs)
    {
        var content = this.getTargetDocContent(true);
        if(content)
        {
            content.Set_ParagraphTabs(Tabs);
        }
    },

    setParagraphNumbering: function(NumInfo)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphNumbering, [NumInfo]);
    },

    setParagraphShd: function(Shd)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphShd, [Shd]);
    },


    setParagraphStyle: function(Style)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphStyle, [Style]);
    },


    setParagraphContextualSpacing: function(Value)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphContextualSpacing, [Value]);
    },

    setParagraphPageBreakBefore: function(Value)
    {
        var content = this.getTargetDocContent(true);
        if(content)
        {
            content.Set_ParagraphPageBreakBefore(Value);
        }
    },
    setParagraphKeepLines: function(Value)
    {
        var content = this.getTargetDocContent(true);
        if(content)
        {
            content.Set_ParagraphKeepLines(Value);
        }
    },

    setParagraphKeepNext: function(Value)
    {
        var content = this.getTargetDocContent(true);
        if(content)
        {
            content.Set_ParagraphKeepNext(Value);
        }
    },

    setParagraphWidowControl: function(Value)
    {
        var content = this.getTargetDocContent(true);
        if(content)
        {
            content.Set_ParagraphWidowControl(Value);
        }
    },

    setParagraphBorders: function(Value)
    {
        var content = this.getTargetDocContent(true);
        if(content)
        {
            content.Set_ParagraphBorders(Value);
        }
    },

    paragraphAdd: function(paraItem, bRecalculate)
    {
        if(this.selection.textSelection)
        {
            this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
        }
        else if(this.selection.groupSelection)
        {
            this.selection.groupSelection.paragraphAdd(paraItem, bRecalculate);
        }
        else if(this.selection.chartSelection)
        {
            this.selection.chartSelection.paragraphAdd(paraItem, bRecalculate);
        }
        else
        {
            var i;
            if(paraItem.Type === para_TextPr)
            {
                this.applyDocContentFunction(CDocumentContent.prototype.Paragraph_Add, [paraItem, bRecalculate]);
            }
            else if(this.selectedObjects.length === 1
                && this.selectedObjects[0].getObjectType() === historyitem_type_Shape
                &&  !CheckLinePreset(this.selectedObjects[0].getPresetGeom()))
            {
                this.selection.textSelection = this.selectedObjects[0];
                this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
                this.selection.textSelection.select(this, this.selection.textSelection.selectStartPage);
            }
            else if(this.selectedObjects.length > 0 && this.selectedObjects[0].parent)
            {
                this.selectedObjects[0].parent.GoTo_Text();
                this.resetSelection();
            }
        }
        //this.document.Recalculate();
    },

    paragraphIncDecFontSize: function(bIncrease)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Paragraph_IncDecFontSize, [bIncrease]);
    },

    paragraphIncDecIndent: function(bIncrease)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Paragraph_IncDecIndent, [bIncrease]);
    },

    setParagraphAlign: function(align)
    {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphAlign, [align]);
    },

    setParagraphIndent: function(indent)
    {
        var content = this.getTargetDocContent(true);
        if(content)
        {
            content.Set_ParagraphIndent(indent);
        }
        else
        {
            if(this.selectedObjects.length ===1)
            {
                content = this.selectedObjects[0].getDocContent ? this.selectedObjects[0].getDocContent() : null;
                if(content)
                {
                    content.Set_ApplyToAll(true);
                    content.Set_ParagraphIndent(indent);
                    content.Set_ApplyToAll(false);
                }
                else
                {
                    this.selectedObjects[0].parent.Get_ParentParagraph().Set_Ind(indent, true)
                }
            }
        }
    },

    setCellFontName: function (fontName) {
        var text_pr = new ParaTextPr({ FontFamily : { Name : fontName , Index : -1 } });
        this.checkSelectedObjectsAndCallback(this.paragraphAdd, [text_pr]);

    },

    setCellFontSize: function (fontSize) {
        var text_pr = new ParaTextPr({ FontSize : fontSize});
        this.checkSelectedObjectsAndCallback(this.paragraphAdd, [text_pr]);
    },

    setCellBold: function (isBold) {
        var text_pr = new ParaTextPr({ Bold : isBold});
        this.checkSelectedObjectsAndCallback(this.paragraphAdd, [text_pr]);

    },

    setCellItalic: function (isItalic) {

        var text_pr = new ParaTextPr({ Italic : isItalic});
        this.checkSelectedObjectsAndCallback(this.paragraphAdd, [text_pr]);
    },

    setCellUnderline: function (isUnderline) {
        var text_pr = new ParaTextPr({ Underline : isUnderline});
        this.checkSelectedObjectsAndCallback(this.paragraphAdd, [text_pr]);
    },

    setCellStrikeout: function (isStrikeout) {
        var text_pr = new ParaTextPr({ Strikeout : isStrikeout});
        this.checkSelectedObjectsAndCallback(this.paragraphAdd, [text_pr]);
    },

    setCellSubscript: function (isSubscript) {
        var text_pr = new ParaTextPr({ VertAlign : isSubscript ? vertalign_SubScript : vertalign_Baseline});
        this.checkSelectedObjectsAndCallback(this.paragraphAdd, [text_pr]);
    },

    setCellSuperscript: function (isSuperscript) {

        var text_pr = new ParaTextPr({ VertAlign : isSuperscript ? vertalign_SubScript : vertalign_Baseline});
        this.checkSelectedObjectsAndCallback(this.paragraphAdd, [text_pr]);
    },

    setCellAlign: function (align) {
        var align_;
        switch (align.toLowerCase())
        {
            case "left":
            {
                align_ = align_Left;
                break;
            }
            case "right":
            {
                align_ = align_Right;
                break;
            }
            case "center":
            {
                align_ = align_Center;
                break;
            }
            case "justify":
            {
                align_ = align_Justify;
            }
        }
        this.checkSelectedObjectsAndCallback(this.setParagraphAlign, [align_]);
    },

    setCellVertAlign: function (align) {

        var vert_align;
        switch (align)
        {
            case "bottom" :
            {
                vert_align = 0;
                break;
            }
            case "center" :
            {
                vert_align = 1;
                break;
            }
            case "distributed":
            {
                vert_align = 1;
                break;
            }
            case "justify" :
            {
                vert_align = 1;
                break;
            }
            case "top" :
            {
                vert_align = 4
            }
        }
        this.checkSelectedObjectsAndCallback(this.applyDrawingProps, [{verticalTextAlign: vert_align}]);
    },

    setCellTextWrap: function (isWrapped) {
        //TODO:this.checkSelectedObjectsAndCallback(this.setCellTextWrapCallBack, [isWrapped]);

    },

    setCellTextShrink: function (isShrinked) {
        //TODO:this.checkSelectedObjectsAndCallback(this.setCellTextShrinkCallBack, [isShrinked]);

    },

    setCellTextColor: function (color) {
        var unifill = new CUniFill();
        unifill.setFill(new CSolidFill());
        unifill.fill.setColor(CorrectUniColor(color, null));
        this.checkSelectedObjectsAndCallback(this.paragraphAdd, [new ParaTextPr({Unifill: unifill})]);
    },

    setCellBackgroundColor: function (color)
    {
        var fill = new CAscFill();
        fill.type = c_oAscFill.FILL_TYPE_SOLID;
        fill.fill = new CAscFillSolid();
        fill.fill.color = color;

        this.checkSelectedObjectsAndCallback(this.applyDrawingProps, [{fill: fill}]);
    },


    setCellAngle: function (angle) {
        //TODO:this.checkSelectedObjectsAndCallback(this.setCellAngleCallBack, [angle]);
    },

    setCellStyle: function (name) {
        //TODO:this.checkSelectedObjectsAndCallback(this.setCellStyleCallBack, [name]);
    },

    // Увеличение размера шрифта
    increaseFontSize: function () {
        this.checkSelectedObjectsAndCallback(this.paragraphIncDecFontSize, [true]);

    },

    // Уменьшение размера шрифта
    decreaseFontSize: function () {
        this.checkSelectedObjectsAndCallback(this.paragraphIncDecFontSize, [false]);

    },

    deleteSelectedObjects: function()
    {
        this.remove(-1);
        /*var drawingObjectsController = this;
         for(var i = drawingObjectsController.selectedObjects.length-1; i > -1 ; --i)
         {
         drawingObjectsController.selectedObjects[i].deleteDrawingBase();
         }
         drawingObjectsController.resetSelectionState();*/
    },


    hyperlinkCheck: function(bCheckEnd)
    {
        var content = this.getTargetDocContent(true);
        if(content)
            return content.Hyperlink_Check(bCheckEnd);
        return null;
    },

    hyperlinkCanAdd: function(bCheckInHyperlink)
    {
        var content = this.getTargetDocContent(true);
        return content && content.Hyperlink_CanAdd(bCheckInHyperlink);
    },

    hyperlinkRemove: function()
    {
        var content = this.getTargetDocContent(true);
        return content && content.Hyperlink_Remove();
    },

    hyperlinkModify: function( HyperProps )
    {
        var content = this.getTargetDocContent(true);
        return content && content.Hyperlink_Modify(HyperProps);
    },

    hyperlinkAdd: function( HyperProps )
    {
        var content = this.getTargetDocContent(true);
        return content && content.Hyperlink_Add(HyperProps);
    },


    insertHyperlink: function (options) {
        //TODO
    },

    removeHyperlink: function () {
        // TODO
    },

    canAddHyperlink: function() {
        //TODO
    },

    getParagraphParaPr: function()
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Get_Paragraph_ParaPr();
        }
        else
        {
            var result, cur_pr, selected_objects, i;
            var getPropsFromArr = function(arr)
            {
                var cur_pr, result_pr, content;
                for(var i = 0; i < arr.length; ++i)
                {
                    cur_pr = null;
                    if(arr[i].getObjectType() === historyitem_type_GroupShape)
                    {
                        cur_pr = getPropsFromArr(arr[i].arrGraphicObjects);
                    }
                    else
                    {
                        if(arr[i].getDocContent)
                        {
                            content = arr[i].getDocContent();
                            if(content)
                            {
                                content.Set_ApplyToAll(true);
                                cur_pr = content.Get_Paragraph_ParaPr();
                                content.Set_ApplyToAll(false);
                            }
                        }
                    }

                    if(cur_pr)
                    {
                        if(!result_pr)
                            result_pr = cur_pr;
                        else
                            result_pr.Compare(cur_pr);
                    }
                }
                return result_pr;
            };

            if(this.selection.groupSelection)
            {
                result = getPropsFromArr(this.selection.groupSelection.selectedObjects);
            }
            else
            {
                result = getPropsFromArr(this.selectedObjects);
            }
            return result ? result : new CParaPr();
        }
    },

    getTheme: function()
    {
        return window["Asc"]["editor"].wbModel.theme;
    },

    getParagraphTextPr: function()
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            var text_pr = content.Get_Paragraph_TextPr();
            return text_pr;
        }
        else
        {
            var result, cur_pr, selected_objects, i;
            var getPropsFromArr = function(arr)
            {
                var cur_pr, result_pr, content;
                for(var i = 0; i < arr.length; ++i)
                {
                    cur_pr = null;
                    if(arr[i].getObjectType() === historyitem_type_GroupShape)
                    {
                        cur_pr = getPropsFromArr(arr[i].arrGraphicObjects);
                    }
                    else
                    {
                        if(arr[i].getDocContent)
                        {
                            content = arr[i].getDocContent();
                            if(content)
                            {
                                content.Set_ApplyToAll(true);
                                cur_pr = content.Get_Paragraph_TextPr();
                                content.Set_ApplyToAll(false);
                            }
                        }
                    }

                    if(cur_pr)
                    {
                        if(!result_pr)
                            result_pr = cur_pr;
                        else
                            result_pr.Compare(cur_pr);
                    }
                }
                return result_pr;
            }

            if(this.selection.groupSelection)
            {
                result = getPropsFromArr(this.selection.groupSelection.selectedObjects);
            }
            else
            {
                result = getPropsFromArr(this.selectedObjects);
            }
            return result ? result : new CTextPr();
        }
    },


    getColorMap: function()
    {
        return this.defaultColorMap;
    },

    getAscChartObject: function()
    {
        //var chart = null;
        //for (var i = 0; i < this.selectedObjects.length; i++) {
        //    if ( this.selectedObjects[i].isChart() )
        //    {
        //        this.selectedObjects[i].drObjects = this;
        //        return this.selectedObjects[i];
        //    }
        //}
        //return chart;
    },

    editChartDrawingObjects: function(chart)
    {

        if(this.chartForProps)
        {
            this.resetSelection();
            if(this.chartForProps.group)
            {
                var main_group = this.chartForProps.getMainGroup();
                this.selectObject(main_group, 0);
                this.selection.groupSelection = main_group;
                main_group.selectObject(this.chartForProps, 0);
            }
            else
            {
                this.selectObject(this.chartForProps);
            }
            this.chartForProps = null;

        }

        if(this.selectedObjects.length === 1
            && (this.selectedObjects[0].isChart()
            || (isRealObject(this.curState.group) && this.curState.group.selectedObjects.length === 1 && this.curState.group.selectedObjects[0].isChart())))
        {

            this.checkSelectedObjectsAndCallback(this.editChartCallback, [chart]);
        }

    },

    applyDrawingProps: function(props)
    {
        var objects_by_type = this.getSelectedObjectsByTypes(true);
        var i;
        if(isRealNumber(props.verticalTextAlign))
        {
            for(i = 0; i < objects_by_type.shapes.length; ++i)
            {
                objects_by_type.shapes[i].setVerticalAlign(props.verticalTextAlign);
            }
            for(i = 0; i < objects_by_type.groups.length; ++i)
            {
                objects_by_type.groups[i].setVerticalAlign(props.verticalTextAlign);
            }
        }
        if(isRealObject(props.paddings))
        {
            for(i = 0; i < objects_by_type.shapes.length; ++i)
            {
                objects_by_type.shapes[i].setPaddings(props.paddings);
            }
            for(i = 0; i < objects_by_type.groups.length; ++i)
            {
                objects_by_type.groups[i].setPaddings(props.paddings);
            }
        }
        if(typeof(props.type) === "string")
        {
            for(i = 0; i < objects_by_type.shapes.length; ++i)
            {
                objects_by_type.shapes[i].changePresetGeom(props.type);
            }
            for(i = 0; i < objects_by_type.groups.length; ++i)
            {
                objects_by_type.groups[i].changePresetGeom(props.type);
            }
        }
        if(isRealObject(props.stroke))
        {
            for(i = 0; i < objects_by_type.shapes.length; ++i)
            {
                objects_by_type.shapes[i].changeLine(props.stroke);
            }
            for(i = 0; i < objects_by_type.groups.length; ++i)
            {
                objects_by_type.groups[i].changeLine(props.stroke);
            }
            for(i = 0; i < objects_by_type.charts.length; ++i)
            {
                objects_by_type.charts[i].changeLine(props.stroke);
            }
        }
        if(isRealObject(props.fill))
        {
            for(i = 0; i < objects_by_type.shapes.length; ++i)
            {
                objects_by_type.shapes[i].changeFill(props.fill);
            }
            for(i = 0; i < objects_by_type.groups.length; ++i)
            {
                objects_by_type.groups[i].changeFill(props.fill);
            }
            for(i = 0; i < objects_by_type.charts.length; ++i)
            {
                objects_by_type.charts[i].changeFill(props.fill);
            }
        }
        if(typeof props.ImageUrl === "string" && props.ImageUrl.length > 0)
        {
            for(i = 0; i < objects_by_type.images.length; ++i)
            {
                objects_by_type.images[i].setBlipFill(CreateBlipFillUniFillFromUrl(props.ImageUrl).fill);
            }
        }
        if(props.ChartProperties)
        {
            for(i = 0; i < objects_by_type.charts.length; ++i)
            {
                this.applyPropsToChartSpace(props.ChartProperties, objects_by_type.charts[i]);
            }
        }
        if(isRealNumber(props.Width) && isRealNumber(props.Height))
        {
            for(i = 0; i < objects_by_type.shapes.length; ++i)
            {
                CheckSpPrXfrm(objects_by_type.shapes[i]);
                objects_by_type.shapes[i].spPr.xfrm.setExtX(props.Width);
                objects_by_type.shapes[i].spPr.xfrm.setExtY(props.Height);
                if(objects_by_type.shapes[i].group)
                {
                    objects_by_type.shapes[i].group.updateCoordinatesAfterInternalResize();
                }
            }
            for(i = 0; i < objects_by_type.images.length; ++i)
            {
                CheckSpPrXfrm(objects_by_type.images[i]);
                objects_by_type.images[i].spPr.xfrm.setExtX(props.Width);
                objects_by_type.images[i].spPr.xfrm.setExtY(props.Height);
                if(objects_by_type.images[i].group)
                {
                    objects_by_type.images[i].group.updateCoordinatesAfterInternalResize();
                }
            }
            for(i = 0; i < objects_by_type.charts.length; ++i)
            {
                CheckSpPrXfrm(objects_by_type.charts[i]);
                objects_by_type.charts[i].spPr.xfrm.setExtX(props.Width);
                objects_by_type.charts[i].spPr.xfrm.setExtY(props.Height);
                if(objects_by_type.charts[i].group)
                {
                    objects_by_type.charts[i].group.updateCoordinatesAfterInternalResize();
                }
            }
            //if(this.selection.groupSelection)
            //{
            //    this.selection.groupSelection.updateCoordinatesAfterInternalResize();
            //}
        }
        return objects_by_type;
    },

    getSelectedObjectsByTypes: function(bGroupedObjects)
    {
        var ret = {shapes: [], images: [], groups: [], charts: []};
        var selected_objects = this.selection.groupSelection ? this.selection.groupSelection.selectedObjects : this.selectedObjects;
        return getObjectsByTypesFromArr(selected_objects, bGroupedObjects);
    },

    editChartCallback: function(chartSettings)
    {
        var objects_by_types = this.getSelectedObjectsByTypes();
        if(objects_by_types.charts.length === 1)
        {
            var chart_space = objects_by_types.charts[0];
            this.applyPropsToChartSpace(chartSettings, chart_space);
        }
    },

    applyPropsToChartSpace: function(chartSettings, chartSpace)
    {
        var chart_space = chartSpace;
        var style_index = chartSettings.getStyle();
        var sRange = chartSettings.getRange();
        if(this.drawingObjects && this.drawingObjects.getWorksheet && typeof sRange === "string" && sRange.length > 0)
        {
            var ws_view = this.drawingObjects.getWorksheet();
            var parsed_formula = parserHelp.parse3DRef(sRange);
            var ws = ws_view.model.workbook.getWorksheetByName(parsed_formula.sheet);
            var new_bbox;
            var range_object = ws.getRange2(parsed_formula.range);
            if(range_object)
            {
                new_bbox = range_object.bbox;
            }
            if( parsed_formula && ws && new_bbox )
            {

                var b_equal_bbox = chart_space.bbox && chart_space.bbox.seriesBBox.r1 === new_bbox.r1
                    && chart_space.bbox.seriesBBox.r2 === new_bbox.r2
                    && chart_space.bbox.seriesBBox.c1 === new_bbox.c1
                    && chart_space.bbox.seriesBBox.c2 === new_bbox.c2;
                var b_equal_ws = chart_space.bbox && chart_space.bbox.worksheet === ws;
                var b_equal_vert = chart_space.bbox && chartSettings.getInColumns() === !chart_space.bbox.seriesBBox.bVert;

                if(!(chart_space.bbox && chart_space.bbox.seriesBBox && b_equal_ws
                    && b_equal_bbox && b_equal_vert))
                {
                    var asc_chart = new asc_CChart();
                    asc_chart.range.interval = sRange;
                    asc_chart.worksheet = this.drawingObjects.getWorksheet();
                    this.drawingObjects.intervalToIntervalObject(asc_chart);
                    if(chart_space.bbox && b_equal_bbox && b_equal_ws && !b_equal_vert)
                    {
                        if(chart_space.bbox.catBBox)
                            asc_chart.range.serHeadersBBox = {r1: chart_space.bbox.catBBox.r1, r2: chart_space.bbox.catBBox.r2, c1: chart_space.bbox.catBBox.c1, c2: chart_space.bbox.catBBox.c2};
                        if(chart_space.bbox.serBBox)
                            asc_chart.range.catHeadersBBox = {r1: chart_space.bbox.serBBox.r1, r2: chart_space.bbox.serBBox.r2, c1: chart_space.bbox.serBBox.c1, c2: chart_space.bbox.serBBox.c2};
                    }
                    if(chartSettings.getInColumns())
                    {
                        asc_chart.range.rows = false;
                        asc_chart.range.columns = true;
                    }
                    else
                    {
                        asc_chart.range.rows = true;
                        asc_chart.range.columns = false;
                    }
                    asc_chart.rebuildSeries();
                    chart_space.rebuildSeriesFromAsc(asc_chart);
                }
            }
        }

        if(isRealNumber(style_index) && style_index > 0 && style_index < 49 && chart_space.style !== style_index)
        {
            chart_space.clearFormatting();
            chart_space.setStyle(style_index);
        }
        //Title Settings
        var chart = chart_space.chart;
        var title_show_settings = chartSettings.getTitle();
        if(title_show_settings === c_oAscChartTitleShowSettings.none)
        {
            if(chart.title)
            {
                chart.setTitle(null);
            }
        }
        else if(title_show_settings === c_oAscChartTitleShowSettings.noOverlay
            || title_show_settings === c_oAscChartTitleShowSettings.overlay)
        {
            if(!chart.title)
            {
                chart.setTitle(new CTitle());
            }
            chart.title.setOverlay(title_show_settings === c_oAscChartTitleShowSettings.overlay);
        }
        var plot_area = chart.plotArea;
        //horAxisLabel

        var hor_axis = plot_area.getHorizontalAxis();
        var hor_axis_label_setting = chartSettings.getHorAxisLabel();
        if(hor_axis)
        {
            if(hor_axis_label_setting !== null)
            {
                switch (hor_axis_label_setting)
                {
                    case c_oAscChartHorAxisLabelShowSettings.none:
                    {
                        if(hor_axis.title)
                            hor_axis.setTitle(null);
                        break;
                    }
                    case c_oAscChartHorAxisLabelShowSettings.noOverlay:
                    {
                        if(!hor_axis.title)
                        {
                            hor_axis.setTitle(new CTitle());
                        }
                        if(!hor_axis.title.txPr)
                        {
                            hor_axis.title.setTxPr(new CTextBody());
                        }
                        if(!hor_axis.title.txPr.bodyPr)
                        {
                            hor_axis.title.txPr.setBodyPr(new CBodyPr());
                            hor_axis.title.txPr.bodyPr.reset();
                        }
                        if(!hor_axis.title.txPr.content)
                        {
                            hor_axis.title.txPr.setContent(new CDocumentContent(hor_axis.title.txPr, chart_space.getDrawingDocument(), 0, 0, 100, 500, false, false, true));
                        }
                        if(hor_axis.title.overlay !== false)
                            hor_axis.title.setOverlay(false);
                        break;
                    }
                }
            }
            hor_axis.setMenuProps(chartSettings.getHorAxisProps());
        }



        //vertAxis
        var vert_axis = plot_area.getVerticalAxis(); //TODO: запрашивать у chart_type
        var vert_axis_labels_settings = chartSettings.getVertAxisLabel();
        if(vert_axis)
        {
            if(vert_axis_labels_settings !== null)
            {
                switch (vert_axis_labels_settings)
                {
                    case c_oAscChartVertAxisLabelShowSettings.none:
                    {
                        if(vert_axis.title)
                        {
                            vert_axis.setTitle(null);
                        }
                        break;
                    }
                    case c_oAscChartVertAxisLabelShowSettings.vertical:
                    {
                        //TODO: пока СDocumentContent не поддерживает вертикальный текст, может быть будет когда-нибудь, хотя вряд ли.
                        break;
                    }
                    default:
                    {
                        if( vert_axis_labels_settings === c_oAscChartVertAxisLabelShowSettings.rotated
                            || vert_axis_labels_settings === c_oAscChartVertAxisLabelShowSettings.horizontal)
                        {
                            if(!vert_axis.title)
                            {
                                vert_axis.setTitle(new CTitle());
                            }
                            if(!vert_axis.title.txPr)
                            {
                                vert_axis.title.setTxPr(new CTextBody());
                            }
                            if(!vert_axis.title.txPr.bodyPr)
                            {
                                vert_axis.title.txPr.setBodyPr(new CBodyPr());
                                vert_axis.title.txPr.bodyPr.reset();
                            }
                            if(!vert_axis.title.txPr.content)
                            {
                                vert_axis.title.txPr.setContent(new CDocumentContent(vert_axis.title.txPr, chart_space.getDrawingDocument(), 0, 0, 100, 500, false, false, true));
                            }
                            if(vert_axis_labels_settings === c_oAscChartVertAxisLabelShowSettings.rotated && vert_axis.title.txPr.bodyPr.vert !== nVertTTvert)
                                vert_axis.title.txPr.bodyPr.setVert(nVertTTvert);
                            if(vert_axis.title.overlay !== false)
                            {
                                vert_axis.title.setOverlay(false);
                            }
                        }
                    }
                }
            }
            vert_axis.setMenuProps(chartSettings.getVertAxisProps())
        }
        //legend
        var legend_pos_settings =  chartSettings.getLegendPos();
        if(legend_pos_settings !== null)
        {
            if(legend_pos_settings === c_oAscChartLegendShowSettings.none)
            {
                if(chart.legend)
                {
                    chart.setLegend(null);
                }
            }
            else
            {
                if(!chart.legend)
                {
                    chart.setLegend(new CLegend());
                }
                if(isRealNumber(LEGEND_POS_MAP[legend_pos_settings]))
                {
                    if(chart.legendPos !== LEGEND_POS_MAP[legend_pos_settings])
                        chart.legend.setLegendPos(LEGEND_POS_MAP[legend_pos_settings]);
                    var b_overlay = c_oAscChartLegendShowSettings.leftOverlay === legend_pos_settings || legend_pos_settings === c_oAscChartLegendShowSettings.rightOverlay;
                    if(chart.legend.overlay !== b_overlay)
                    {
                        chart.legend.setOverlay(b_overlay);
                    }
                }
            }
        }

        //gridLines
        //Hor GridLInes
        var setAxisGridLines = function(axis, gridLinesSettings)
        {
            if(axis)
            {
                switch(gridLinesSettings)
                {
                    case c_oAscGridLinesSettings.none:
                    {
                        if(axis.majorGridlines)
                            axis.setMajorGridlines(null);
                        if(axis.minorGridlines)
                            axis.setMinorGridlines(null);
                        break;
                    }
                    case c_oAscGridLinesSettings.major:
                    {
                        if(!axis.majorGridlines)
                            axis.setMajorGridlines(new CSpPr());
                        if(axis.minorGridlines)
                            axis.setMinorGridlines(null);
                        break;
                    }
                    case c_oAscGridLinesSettings.minor:
                    {
                        if(!axis.minorGridlines)
                            axis.setMinorGridlines(new CSpPr());
                        if(axis.majorGridlines)
                            axis.setMajorGridlines(null);
                        break;
                    }
                    case c_oAscGridLinesSettings.majorMinor:
                    {
                        if(!axis.minorGridlines)
                            axis.setMinorGridlines(new CSpPr());
                        if(!axis.majorGridlines)
                            axis.setMajorGridlines(new CSpPr());
                        break;
                    }
                }
            }
        };

        setAxisGridLines(plot_area.getVerticalAxis(), chartSettings.getHorGridLines());
        setAxisGridLines(plot_area.getHorizontalAxis(), chartSettings.getVertGridLines());

        var chart_type = plot_area.charts[0];
        //Data Labels
        var data_labels_pos_setting = chartSettings.getDataLabelsPos();
        if(isRealNumber(data_labels_pos_setting))
        {
            if(data_labels_pos_setting === c_oAscChartDataLabelsPos.none)
            {
                if(chart_type.dLbls)
                    chart_type.setDLbls(null);
            }
            else
            {
                if(isRealNumber(DLBL_POS_DEFINES_MAP[data_labels_pos_setting]))
                {
                    if(!chart_type.dLbls)
                    {
                        var d_lbls = new CDLbls();
                        d_lbls.setShowVal(true);
                        chart_type.setDLbls(d_lbls);
                    }
                    if(chart_type.dLbls.dLblPos !== DLBL_POS_DEFINES_MAP[data_labels_pos_setting])
                        chart_type.dLbls.setDLblPos(DLBL_POS_DEFINES_MAP[data_labels_pos_setting]);
                }
            }
        }
        var i;
        var type = chartSettings.getType();
        var need_groupping, need_num_fmt, need_bar_dir;
        var val_axis, new_chart_type, object_type, axis_obj ;
        var axis_by_types;
        var val_ax, cat_ax;
        object_type = chart_type.getObjectType();

        var checkSwapAxis = function(plotArea, chartType, newChartType)
        {
            if(chartType.getAxisByTypes )
            {
                var axis_by_types = chartType.getAxisByTypes(), cat_ax, val_ax;
                if(axis_by_types.catAx.length > 0 && axis_by_types.valAx.length > 0)
                {
                    cat_ax = axis_by_types.catAx[0];
                    val_ax = axis_by_types.valAx[0];
                }
            }
            if(!val_ax || !cat_ax)
            {
                var axis_obj = CreateDefaultAxises(need_num_fmt);
                cat_ax = axis_obj.catAx;
                val_ax = axis_obj.valAx;
            }
            newChartType.addAxId(cat_ax);
            newChartType.addAxId(val_ax);
            plotArea.addAxis(cat_ax);
            plotArea.addAxis(val_ax);
        };

        var replaceChart = function(plotArea, chartType, newChartType)
        {
            plotArea.addChart(newChartType, 0);
            plotArea.removeCharts(1, plotArea.charts.length - 1);
            newChartType.setFromOtherChart(chartType);
        };

        switch(type)
        {
            case c_oAscChartTypeSettings.barNormal     :
            case c_oAscChartTypeSettings.barStacked    :
            case c_oAscChartTypeSettings.barStackedPer :
            case c_oAscChartTypeSettings.hBarNormal    :
            case c_oAscChartTypeSettings.hBarStacked   :
            case c_oAscChartTypeSettings.hBarStackedPer:
            {
                if(type === c_oAscChartTypeSettings.barNormal || type === c_oAscChartTypeSettings.hBarNormal)
                    need_groupping = BAR_GROUPING_CLUSTERED;
                else if(type === c_oAscChartTypeSettings.barStacked || type === c_oAscChartTypeSettings.hBarStacked)
                    need_groupping = BAR_GROUPING_STACKED;
                else
                    need_groupping = BAR_GROUPING_PERCENT_STACKED;

                if(type === c_oAscChartTypeSettings.barNormal || type === c_oAscChartTypeSettings.barStacked
                    || type === c_oAscChartTypeSettings.barNormal || type === c_oAscChartTypeSettings.barStacked
                    || type === c_oAscChartTypeSettings.hBarNormal || type === c_oAscChartTypeSettings.hBarStacked
                    || type === c_oAscChartTypeSettings.hBarNormal || type === c_oAscChartTypeSettings.hBarStacked)
                    need_num_fmt = "General";
                else
                    need_num_fmt = "0%";

                if(type === c_oAscChartTypeSettings.barNormal || type === c_oAscChartTypeSettings.barStacked || type === c_oAscChartTypeSettings.barStackedPer)
                    need_bar_dir = BAR_DIR_COL;
                else
                    need_bar_dir = BAR_DIR_BAR;

                if(chart_type.getObjectType() === historyitem_type_BarChart)
                {
                    if(chart_type.grouping !== need_groupping)
                        chart_type.setGrouping(need_groupping);

                    axis_by_types = chart_type.getAxisByTypes();
                    if(chart_type.barDir !== need_bar_dir)
                    {
                        val_axis = axis_by_types.valAx;
                        if(need_bar_dir === BAR_DIR_BAR)
                        {
                            for(i = 0; i < val_axis.length; ++i)
                                val_axis[i].setAxPos(AX_POS_B);

                            for(i = 0; i < axis_by_types.catAx.length; ++i)
                                axis_by_types.catAx[i].setAxPos(AX_POS_L);
                        }
                        chart_type.setBarDir(need_bar_dir);
                    }

                    val_axis = axis_by_types.valAx;
                    for(i = 0; i < val_axis.length; ++i)
                    {
                        if(val_axis[i].numFmt.formatCode !== need_num_fmt)
                            val_axis[i].numFmt.setFormatCode(need_num_fmt);
                    }
                }
                else
                {
                    new_chart_type = new CBarChart();
                    replaceChart(plot_area, chart_type, new_chart_type);
                    checkSwapAxis(plot_area, chart_type, new_chart_type);
                    new_chart_type.setGrouping(need_groupping);
                    new_chart_type.setBarDir(need_bar_dir);
                    new_chart_type.setGapWidth(150);

                    axis_by_types = new_chart_type.getAxisByTypes();
                    val_axis = axis_by_types.valAx;
                    for(i = 0; i < val_axis.length; ++i)
                    {
                        if(val_axis[i].numFmt.formatCode !== need_num_fmt)
                            val_axis[i].numFmt.setFormatCode(need_num_fmt);
                        if(need_bar_dir = BAR_DIR_BAR)
                            val_axis[i].setAxPos(AX_POS_B);
                    }
                    if(need_bar_dir = BAR_DIR_BAR)
                    {
                        for(i = 0; i < axis_by_types.catAx.length; ++i)
                            axis_by_types.catAx[i].setAxPos(AX_POS_L);
                    }
                }
                break;
            }
            case c_oAscChartTypeSettings.lineNormal           :
            case c_oAscChartTypeSettings.lineStacked          :
            case c_oAscChartTypeSettings.lineStackedPer      :
            case c_oAscChartTypeSettings.lineNormalMarker    :
            case c_oAscChartTypeSettings.lineStackedMarker   :
            case c_oAscChartTypeSettings.lineStackedPerMarker:
            {
                if(type === c_oAscChartTypeSettings.lineNormal || type === c_oAscChartTypeSettings.lineNormalMarker)
                    need_groupping = GROUPING_STANDARD;
                else if(type === c_oAscChartTypeSettings.lineStacked || type === c_oAscChartTypeSettings.lineStackedMarker)
                    need_groupping = GROUPING_STACKED;
                else
                    need_groupping = GROUPING_PERCENT_STACKED;

                if(type === c_oAscChartTypeSettings.lineNormal || type === c_oAscChartTypeSettings.lineStacked
                    || type === c_oAscChartTypeSettings.lineNormalMarker || type === c_oAscChartTypeSettings.lineStackedMarker)
                    need_num_fmt = "General";
                else
                    need_num_fmt = "0%";

                var b_marker = type ===  c_oAscChartTypeSettings.lineNormalMarker|| type === c_oAscChartTypeSettings.lineStackedMarker || type === c_oAscChartTypeSettings.lineStackedPerMarker;

                if(chart_type.getObjectType() === historyitem_type_LineChart)
                {
                    if(chart_type.grouping !== need_groupping)
                        chart_type.setGrouping(need_groupping);
                    val_axis = chart_type.getAxisByTypes().valAx;
                    for(i = 0; i < val_axis.length; ++i)
                    {
                        if(val_axis[i].numFmt.formatCode !== need_num_fmt)
                            val_axis[i].numFmt.setFormatCode(need_num_fmt);
                    }

                    if(chart_type.marker !== b_marker)
                        chart_type.setMarker(b_marker);
                }
                else
                {
                    new_chart_type = new CLineChart();
                    replaceChart(plot_area, chart_type, new_chart_type);
                    checkSwapAxis(plot_area, chart_type, new_chart_type);
                    val_axis = new_chart_type.getAxisByTypes().valAx;
                    for(i = 0; i < val_axis.length; ++i)
                    {
                        if(val_axis[i].numFmt.formatCode !== need_num_fmt)
                            val_axis[i].numFmt.setFormatCode(need_num_fmt);
                    }
                    new_chart_type.setMarker(b_marker);
                    new_chart_type.setGrouping(need_groupping);
                }
                break;
            }
            case c_oAscChartTypeSettings.pie:
            {
                if(chart_type.getObjectType() !== historyitem_type_PieChart)
                {
                    new_chart_type = new CPieChart();
                    replaceChart(plot_area, chart_type, new_chart_type);
                    new_chart_type.setVaryColors(true);
                }
                break;
            }
            case c_oAscChartTypeSettings.doughnut:
            {
                if(chart_type.getObjectType() !== historyitem_type_DoughnutChart)
                {
                    new_chart_type = new CDoughnutChart();
                    replaceChart(plot_area, chart_type, new_chart_type);
                    new_chart_type.setVaryColors(true);
                    new_chart_type.setHoleSize(50);
                }
                break;
            }
            case c_oAscChartTypeSettings.areaNormal:
            case c_oAscChartTypeSettings.areaStacked:
            case c_oAscChartTypeSettings.areaStackedPer:
            {

                if(type === c_oAscChartTypeSettings.areaNormal)
                    need_groupping = GROUPING_STANDARD;
                else if(type === c_oAscChartTypeSettings.areaStacked)
                    need_groupping = GROUPING_STACKED;
                else
                    need_groupping = GROUPING_PERCENT_STACKED;

                if(type === c_oAscChartTypeSettings.areaNormal || type === c_oAscChartTypeSettings.areaStacked)
                    need_num_fmt = "General";
                else
                    need_num_fmt = "0%";

                if(chart_type.getObjectType() === historyitem_type_AreaChart)
                {
                    if(chart_type.grouping !== need_groupping)
                        chart_type.setGrouping(need_groupping);
                    val_axis = chart_type.getAxisByTypes().valAx;
                    for(i = 0; i < val_axis.length; ++i)
                    {
                        if(val_axis[i].numFmt.formatCode !== need_num_fmt)
                            val_axis[i].numFmt.setFormatCode(need_num_fmt);
                    }
                }
                else
                {
                    new_chart_type = new CAreaChart();
                    replaceChart(plot_area, chart_type, new_chart_type);
                    checkSwapAxis(plot_area, chart_type, new_chart_type);

                    val_axis = new_chart_type.getAxisByTypes().valAx;
                    for(i = 0; i < val_axis.length; ++i)
                    {
                        if(val_axis[i].numFmt.formatCode !== need_num_fmt)
                            val_axis[i].numFmt.setFormatCode(need_num_fmt);
                    }
                    new_chart_type.setGrouping(need_groupping);
                }
                break;
            }
            case c_oAscChartTypeSettings.scatter:
            case c_oAscChartTypeSettings.scatterLine:
            case c_oAscChartTypeSettings.scatterSmooth:
            {
                if(chart_type.getObjectType() !== historyitem_type_ScatterChart)
                {
                    new_chart_type = new CScatterChart();
                    plot_area.addChart(new_chart_type, 0);
                    plot_area.removeCharts(1, plot_area.charts.length - 1);
                    new_chart_type.setFromOtherChart(chart_type);
                    axis_obj = CreateScatterAxis(); //cat - 0, val - 1
                    new_chart_type.addAxId(axis_obj.catAx);
                    new_chart_type.addAxId(axis_obj.valAx);
                    plot_area.addAxis(axis_obj.catAx);
                    plot_area.addAxis(axis_obj.valAx);
                }
                break;
            }
        }

        chart_type = plot_area.charts[0];
        //подписи данных
        if(typeof chart_type.setDLbls === "function")
        {
            var data_lbls;
            var checkDataLabels = function(chartType)
            {
                chartType.removeDataLabels();
                if(!chartType.dLbls)
                    chartType.setDLbls(new CDLbls());
                return chartType.dLbls;
            };
            if(isRealBool(chartSettings.showCatName))
                checkDataLabels(chart_type).setShowCatName(chartSettings.showCatName);
            if(isRealBool(chartSettings.showSerName))
                checkDataLabels(chart_type).setShowSerName(chartSettings.showSerName);
            if(isRealBool(chartSettings.showVal))
                checkDataLabels(chart_type).setShowVal(chartSettings.showVal);

            if(typeof chartSettings.separator === "string" && chartSettings.separator.length > 0)
                checkDataLabels(chart_type).setSeparator(chartSettings.separator);
        }
    },

    getChartProps: function()
    {
        var objects_by_types = this.getSelectedObjectsByTypes();
        var ret = null;
        if(objects_by_types.charts.length === 1)
        {
            ret = this.getPropsFromChart(objects_by_types.charts[0]);
        }
        return ret;
    },

    getPropsFromChart: function(chart_space)
    {
        var chart = chart_space.chart, plot_area = chart_space.chart.plotArea;
        var ret = new asc_ChartSettings();
        var range_obj = chart_space.getRangeObjectStr();
        if(range_obj)
        {
            if(typeof range_obj.range === "string" && range_obj.range.length > 0)
            {
                ret.putRange(range_obj.range);
                ret.putInColumns(!range_obj.bVert);
            }
        }
        ret.putStyle(isRealNumber(chart_space.style) ? chart_space.style : null);
        ret.putTitle(isRealObject(chart.title) ? (chart.title.overlay ? c_oAscChartTitleShowSettings.overlay : c_oAscChartTitleShowSettings.noOverlay) : c_oAscChartTitleShowSettings.none);
        var hor_axis = plot_area.getHorizontalAxis();
        var vert_axis = plot_area.getVerticalAxis();

        var calc_grid_lines = function(axis)
        {
            if(!axis || (!axis.majorGridlines && !axis.minorGridlines))
                return c_oAscGridLinesSettings.none;
            if(axis.majorGridlines && !axis.minorGridlines)
                return c_oAscGridLinesSettings.major;
            if(axis.minorGridlines && !axis.majorGridlines)
                return c_oAscGridLinesSettings.minor;
            return c_oAscGridLinesSettings.majorMinor;
        };
        if(hor_axis)
            ret.putHorAxisProps(hor_axis.getMenuProps());
        ret.putHorGridLines(calc_grid_lines(vert_axis));

        if(vert_axis)
            ret.putVertAxisProps(vert_axis.getMenuProps());
        ret.putVertGridLines(calc_grid_lines(hor_axis));


        ret.putHorAxisLabel(hor_axis && hor_axis.title ? c_oAscChartHorAxisLabelShowSettings.noOverlay : c_oAscChartTitleShowSettings.none);
        ret.putVertAxisLabel(vert_axis && vert_axis.title ? c_oAscChartVertAxisLabelShowSettings.rotated : c_oAscChartVertAxisLabelShowSettings.none); //TODO

        var data_labels = plot_area.chart.dLbls;
        if(data_labels)
        {
            ret.putShowSerName(data_labels.showSerName === true);
            ret.putShowCatName(data_labels.showCatName === true);
            ret.putShowVal(data_labels.showVal === true);
            ret.putSeparator(data_labels.separator);
            ret.putDataLabelsPos(isRealNumber(REV_DLBL_POS_DEFINES_MAP[data_labels.dLblPos]) ? REV_DLBL_POS_DEFINES_MAP[data_labels.dLblPos] :  c_oAscChartDataLabelsPos.none);
        }


        if(chart.legend)
        {
            if(isRealNumber(chart.legend.legendPos))
            {
                if(chart.legend.legendPos === LEGEND_POS_L)
                {
                    ret.putLegendPos(!chart.legend.overlay ? c_oAscChartLegendShowSettings.left : c_oAscChartLegendShowSettings.leftOverlay);
                }
                else if(chart.legend.legendPos === LEGEND_POS_T)
                {
                    ret.putLegendPos(c_oAscChartLegendShowSettings.top);
                }
                else if(chart.legend.legendPos === LEGEND_POS_R)
                {
                    ret.putLegendPos(!chart.legend.overlay ? c_oAscChartLegendShowSettings.right : c_oAscChartLegendShowSettings.rightOverlay);
                }
                else if(chart.legend.legendPos === LEGEND_POS_B)
                {
                    ret.putLegendPos(c_oAscChartLegendShowSettings.bottom);
                }
                else
                {
                    ret.putLegendPos(c_oAscChartLegendShowSettings.layout);
                }
            }
            else
            {
                ret.putLegendPos(c_oAscChartLegendShowSettings.layout);
            }
        }
        else
        {
            ret.putLegendPos(c_oAscChartLegendShowSettings.none);
        }

        var chart_type = plot_area.charts[0];
        var chart_type_object_type = chart_type.getObjectType();

        var calc_chart_type;
        if(chart_type_object_type === historyitem_type_PieChart)
            calc_chart_type = c_oAscChartTypeSettings.pie;
        else if(chart_type_object_type === historyitem_type_DoughnutChart)
            calc_chart_type = c_oAscChartTypeSettings.doughnut;
        else if(chart_type_object_type === historyitem_type_StockChart)
            calc_chart_type = c_oAscChartTypeSettings.stock;
        else if(chart_type_object_type === historyitem_type_BarChart)
        {
            var b_hbar = chart_type.barDir === BAR_DIR_BAR;
            if(b_hbar)
            {
                switch(chart_type.grouping)
                {
                    case BAR_GROUPING_CLUSTERED:
                    {
                        calc_chart_type = c_oAscChartTypeSettings.hBarNormal;
                        break;
                    }
                    case BAR_GROUPING_STACKED:
                    {
                        calc_chart_type = c_oAscChartTypeSettings.hBarStacked;
                        break;
                    }
                    case BAR_GROUPING_PERCENT_STACKED:
                    {
                        calc_chart_type = c_oAscChartTypeSettings.hBarStackedPer;
                        break;
                    }
                    default:
                    {
                        calc_chart_type = c_oAscChartTypeSettings.hBarNormal;
                        break;
                    }
                }
            }
            else
            {
                switch(chart_type.grouping)
                {
                    case BAR_GROUPING_CLUSTERED:
                    {
                        calc_chart_type = c_oAscChartTypeSettings.barNormal;
                        break;
                    }
                    case BAR_GROUPING_STACKED:
                    {
                        calc_chart_type = c_oAscChartTypeSettings.barStacked;
                        break;
                    }
                    case BAR_GROUPING_PERCENT_STACKED:
                    {
                        calc_chart_type = c_oAscChartTypeSettings.barStackedPer;
                        break;
                    }
                    default:
                    {
                        calc_chart_type = c_oAscChartTypeSettings.barNormal;
                        break;
                    }
                }
            }
        }
        else if(chart_type_object_type === historyitem_type_LineChart)
        {
          //  if(!chart_type.marker)
            {
                switch(chart_type.grouping)
                {
                    case GROUPING_PERCENT_STACKED :
                    {
                        calc_chart_type = c_oAscChartTypeSettings.lineStackedPer;
                        break;
                    }
                    case GROUPING_STACKED         :
                    {
                        calc_chart_type = c_oAscChartTypeSettings.lineStacked;
                        break;
                    }
                    default        :
                    {
                        calc_chart_type = c_oAscChartTypeSettings.lineNormal;
                        break;
                    }
                }
            }
          /*  else
            {
                switch(chart_type.grouping)
                {
                    case GROUPING_PERCENT_STACKED:
                    {
                        calc_chart_type = c_oAscChartTypeSettings.lineStackedPerMarker;
                        break;
                    }
                    case GROUPING_STACKED:
                    {
                        calc_chart_type = c_oAscChartTypeSettings.lineStackedMarker;
                        break;
                    }
                    default:
                    {
                        calc_chart_type = c_oAscChartTypeSettings.lineNormalMarker;
                        break;
                    }
                }
            }  */
        }
        else if(chart_type_object_type === historyitem_type_AreaChart)
        {
            switch(chart_type.grouping)
            {
                case GROUPING_PERCENT_STACKED :
                {
                    calc_chart_type = c_oAscChartTypeSettings.areaStackedPer;
                    break;
                }
                case GROUPING_STACKED         :
                {
                    calc_chart_type = c_oAscChartTypeSettings.areaStacked;
                    break;
                }
                default        :
                {
                    calc_chart_type = c_oAscChartTypeSettings.areaNormal;
                    break;
                }
            }
        }
        else if(chart_type_object_type === historyitem_type_ScatterChart)
        {

            calc_chart_type = c_oAscChartTypeSettings.scatter;
            /*switch (chart_type.scatterStyle)
            {
                case SCATTER_STYLE_LINE:
                {
                    calc_chart_type = c_oAscChartTypeSettings.scatterLine;
                    break;
                }
                case SCATTER_STYLE_LINE_MARKER:
                {
                    calc_chart_type = c_oAscChartTypeSettings.scatterLineMarker;
                    break;
                }
                case SCATTER_STYLE_MARKER:
                {
                    calc_chart_type = c_oAscChartTypeSettings.scatterMarker;
                    break;
                }
                case SCATTER_STYLE_NONE:
                {
                    calc_chart_type = c_oAscChartTypeSettings.scatterNone;
                    break;
                }
                case SCATTER_STYLE_SMOOTH:
                {
                    calc_chart_type = c_oAscChartTypeSettings.scatterSmooth;
                    break;
                }
                case SCATTER_STYLE_SMOOTH_MARKER:
                {
                    calc_chart_type = c_oAscChartTypeSettings.scatterSmoothMarker;
                    break;
                }
                default:
                {
                    calc_chart_type = c_oAscChartTypeSettings.scatterMarker;
                    break;
                }
            }  */
        }
        else
        {
            calc_chart_type = c_oAscChartTypeSettings.unknown;
        }
        ret.type = calc_chart_type;
        return ret;
    },

    getChartSpace: function(chart, options)
    {
        var _type = typeof chart.type === "string" ? chart.type : "Bar";
        switch (_type)
        {
            case "Line":
            {
                switch (chart.subType.toLowerCase())
                {
                    case "normal":
                    {
                        return CreateLineChart(chart, GROUPING_STANDARD);
                    }
                    case "stacked":
                    {
                        return CreateLineChart(chart, GROUPING_STACKED);
                    }
                    case "stackedper":
                    {
                        return CreateLineChart(chart, GROUPING_PERCENT_STACKED);
                    }
                }
                break;
            }
            case "Bar":
            {
                switch (chart.subType.toLowerCase())
                {
                    case "normal":
                    {
                        return CreateBarChart(chart, BAR_GROUPING_CLUSTERED);
                    }
                    case "stacked":
                    {
                        return CreateBarChart(chart, BAR_GROUPING_STACKED);
                    }
                    case "stackedper":
                    {
                        return CreateBarChart(chart, BAR_GROUPING_PERCENT_STACKED);
                    }
                }
                break;
            }
            case "HBar":
            {
                switch(chart.subType.toLowerCase())
                {
                    case "normal":
                    {
                        return CreateHBarChart(chart, BAR_GROUPING_CLUSTERED);
                    }
                    case "stacked":
                    {
                        return CreateHBarChart(chart, BAR_GROUPING_STACKED);
                    }
                    case "stackedper":
                    {
                        return CreateHBarChart(chart, BAR_GROUPING_PERCENT_STACKED);
                    }
                }
                break;
            }
            case "Area":
            {
                switch(chart.subType.toLowerCase())
                {
                    case "normal":
                    {
                        return CreateAreaChart(chart, GROUPING_STANDARD);
                    }
                    case "stacked":
                    {
                        return CreateAreaChart(chart, GROUPING_STACKED);
                    }
                    case "stackedper":
                    {
                        return CreateAreaChart(chart, GROUPING_PERCENT_STACKED);
                    }
                }
                break;
            }
            case "Pie":
            case "Doughnut":
            {
                return CreatePieChart(chart, chart.type === "Doughnut");
            }
            case "Scatter":
            {
                return CreateScatterChart(chart);
            }
            case "Stock":
            {
                return CreateStockChart(chart);
            }
            case "Radar":
            {
                return CreateRadarChart(chart);
            }
        }
        return null;
    },

    changeCurrentState: function(newState)
    {
        this.curState = newState;
        this.sendDrawingObjectsProps();
    },


    sendDrawingObjectsProps: function()
    {
        //var objects_by_types = this.getSelectedObjectsByTypes();
        var ret = {};
        ret.chartProps = this.getChartProps();
        window["Asc"]["editor"].handlers.trigger("asc_onChangeSelectDrawingObjects", ret);
    },


    updateSelectionState: function()
    {
        var text_object;
        if(this.selection.textSelection)
        {
            text_object = this.selection.textSelection;
        }
        else if(this.selection.groupSelection && this.selection.groupSelection.selection.textSelection)
        {
            if(this.selection.groupSelection.selection.textSelection)
            {
                text_object = this.selection.groupSelection.selection.textSelection;
            }
            else if(this.selection.groupSelection.chartSelection && this.selection.groupSelection.chartSelection.textSelection)
            {
                text_object = this.selection.groupSelection.chartSelection.textSelection;
            }
        }
        else if(this.selection.chartSelection && this.selection.chartSelection.selection.textSelection)
        {
            text_object = this.selection.chartSelection.selection.textSelection;
        }
        if(isRealObject(text_object))
        {
            text_object.updateSelectionState(this.drawingObjects.drawingDocument);
        }
        else
        {
            this.drawingObjects.drawingDocument.UpdateTargetTransform(null);
            this.drawingObjects.drawingDocument.TargetEnd();
            this.drawingObjects.drawingDocument.SelectEnabled(false);
            this.drawingObjects.drawingDocument.SelectClear();
            this.drawingObjects.drawingDocument.SelectShow();
        }
    },

    remove: function(dir)
    {
        var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
        if(asc["editor"] && asc["editor"].isChartEditor)
        {
            return;
        }
        this.checkSelectedObjectsAndCallback(this.removeCallback, [dir]);
    },

    removeCallback: function(dir)
    {
        var content = this.getTargetDocContent(true);
        if(content)
        {
            content.Remove(dir, true)
        }
        else if(this.selectedObjects.length > 0)
        {
            if(this.selection.groupSelection)
            {
                if(this.selection.groupSelection.chartSelection)
                {
                    //TODO
                }
                else
                {
                    var group_map = {}, group_arr = [], i, cur_group, sp, xc, yc, hc, vc, rel_xc, rel_yc, j;
                    for(i = 0; i < this.selection.groupSelection.selectedObjects.length; ++i)
                    {
                        this.selection.groupSelection.selectedObjects[i].group.removeFromSpTree(this.selection.groupSelection.selectedObjects[i].Get_Id());
                        group_map[this.selection.groupSelection.selectedObjects[i].group.Get_Id()+""] = this.selection.groupSelection.selectedObjects[i].group;
                    }
                    for(var key in group_map)
                    {
                        if(group_map.hasOwnProperty(key))
                            group_arr.push(group_map[key]);
                    }
                    group_arr.sort(CompareGroups);
                    var a_objects  = [];
                    for(i = 0; i < group_arr.length; ++i)
                    {
                        cur_group = group_arr[i];
                        if(isRealObject(cur_group.group))
                        {
                            if(cur_group.spTree.length === 0)
                            {
                                cur_group.group.removeFromSpTree(cur_group.Get_Id());
                            }
                            else if(cur_group.spTree.length == 1)
                            {
                                sp = cur_group.spTree[0];
                                hc = sp.spPr.xfrm.extX/2;
                                vc = sp.spPr.xfrm.extY/2;
                                xc = sp.transform.TransformPointX(hc, vc);
                                yc = sp.transform.TransformPointY(hc, vc);
                                rel_xc = cur_group.group.invertTransform.TransformPointX(xc, yc);
                                rel_yc = cur_group.group.invertTransform.TransformPointY(xc, yc);
                                sp.spPr.xfrm.setOffX(rel_xc - hc);
                                sp.spPr.xfrm.setOffY(rel_yc - vc);
                                sp.spPr.xfrm.setRot(normalizeRotate(cur_group.rot + sp.rot));
                                sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                                sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                                sp.setGroup(cur_group.group);
                                for(j = 0; j < cur_group.group.spTree.length; ++j)
                                {
                                    if(cur_group.group.spTree[j] === cur_group)
                                    {
                                        cur_group.group.addToSpTreeToPos(j, sp);
                                        cur_group.group.removeFromSpTree(cur_group.Get_Id());
                                    }
                                }
                            }
                        }
                        else
                        {
                            if(cur_group.spTree.length === 0)
                            {
                                this.resetInternalSelection();
                                this.removeCallback();
                                return;
                            }
                            else if(cur_group.spTree.length === 1)
                            {
                                sp = cur_group.spTree[0];
                                sp.spPr.xfrm.setOffX(cur_group.spPr.xfrm.offX + sp.spPr.xfrm.offX);
                                sp.spPr.xfrm.setOffY(cur_group.spPr.xfrm.offY + sp.spPr.xfrm.offY);
                                sp.spPr.xfrm.setRot(normalizeRotate(cur_group.rot + sp.rot));
                                sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                                sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                                sp.setGroup(null);
                                sp.addToDrawingObjects();
                                cur_group.deleteDrawingBase();
                                this.resetSelection();
                                this.selectObject(sp, cur_group.selectStartPage);
                            }
                            else
                            {
                                cur_group.updateCoordinatesAfterInternalResize();
                            }
                            this.recalculate();
                            return;
                        }
                    }
                }
            }
            //else if(this.selection.chartSelection) TODO
            //{}
            else
            {
                for(var i = 0; i < this.selectedObjects.length; ++i)
                {
                    this.selectedObjects[i].deleteDrawingBase();
                }
                this.resetSelection();
                this.recalculate();
            }
        }
        this.drawingObjects.showDrawingObjects(true);
        this.updateOverlay();
    },


    getAllObjectsOnPage: function(pageIndex, bHdrFtr)
    {
        return this.getDrawingArray();
    },

    selectNextObject: function(direction)
    {
        var selection_array = this.selectedObjects;
        if(selection_array.length > 0)
        {
            var i, graphic_page;
            if(direction > 0)
            {
                var selectNext = function (oThis, last_selected_object)
                {
                    var search_array = oThis.getAllObjectsOnPage(last_selected_object.selectStartPage,
                        last_selected_object.parent && last_selected_object.parent.DocumentContent && last_selected_object.parent.DocumentContent.Is_HdrFtr(false));

                    if(search_array.length > 0)
                    {
                        for(var i = search_array.length-1; i > -1; --i)
                        {
                            if(search_array[i] === last_selected_object)
                                break;
                        }
                        if(i > -1)
                        {
                            oThis.resetSelection();
                            oThis.selectObject(search_array[i < search_array.length - 1 ? i+1 : 0], last_selected_object.selectStartPage);
                            return;
                        }
                        else
                        {
                            return;
                        }
                    }

                }

                if(this.selection.groupSelection)
                {
                    for(i = this.selection.groupSelection.arrGraphicObjects.length - 1; i > -1; --i)
                    {
                        if(this.selection.groupSelection.arrGraphicObjects[i].selected)
                            break;
                    }
                    if(i > -1)
                    {
                        if(i < this.selection.groupSelection.arrGraphicObjects.length-1)
                        {
                            this.selection.groupSelection.resetSelection();
                            this.selection.groupSelection.selectObject(this.selection.groupSelection.arrGraphicObjects[i+1], this.selection.groupSelection.selectStartPage);
                        }
                        else
                        {
                            selectNext(this, this.selection.groupSelection);
                        }
                    }
                }
                //else if(this.selection.chartSelection)
                //{}
                else
                {
                    var last_selected_object = this.selectedObjects[this.selectedObjects.length-1];
                    if(last_selected_object.getObjectType() === historyitem_type_GroupShape)
                    {
                        this.resetSelection();
                        this.selectObject(last_selected_object, last_selected_object.selectStartPage);
                        this.selection.groupSelection = last_selected_object;
                        last_selected_object.selectObject(last_selected_object.arrGraphicObjects[0], last_selected_object.selectStartPage);
                    }
                    //else if(last_selected_object.getObjectType() === historyitem_type_ChartSpace)
                    //{TODO}
                    else
                    {
                        selectNext(this, last_selected_object)
                    }
                }
            }
            else
            {
                var selectPrev = function (oThis, first_selected_object)
                {
                    var search_array = oThis.getAllObjectsOnPage(first_selected_object.selectStartPage,
                        first_selected_object.parent && first_selected_object.parent.DocumentContent && first_selected_object.parent.DocumentContent.Is_HdrFtr(false));

                    if(search_array.length > 0)
                    {
                        for(var i = 0; i < search_array.length; ++i)
                        {
                            if(search_array[i] === first_selected_object)
                                break;
                        }
                        if(i < search_array.length)
                        {
                            oThis.resetSelection();
                            oThis.selectObject(search_array[i > 0 ? i-1 : search_array.length-1], first_selected_object.selectStartPage);
                            return;
                        }
                        else
                        {
                            return;
                        }
                    }
                }
                if(this.selection.groupSelection)
                {
                    for(i = 0; i < this.selection.groupSelection.arrGraphicObjects.length; ++i)
                    {
                        if(this.selection.groupSelection.arrGraphicObjects[i].selected)
                            break;
                    }
                    if(i < this.selection.groupSelection.arrGraphicObjects.length)
                    {
                        if(i > 0)
                        {
                            this.selection.groupSelection.resetSelection();
                            this.selection.groupSelection.selectObject(this.selection.groupSelection.arrGraphicObjects[i-1], this.selection.groupSelection.selectStartPage);
                        }
                        else
                        {
                            selectPrev(this, this.selection.groupSelection);
                        }
                    }
                    else
                    {

                        return;
                    }
                }
                //else if(this.selection.chartSelection)
                //{
                //
                //}
                else
                {
                    var first_selected_object = this.selectedObjects[0];
                    if(first_selected_object.getObjectType() === historyitem_type_GroupShape)
                    {
                        this.resetSelection();
                        this.selectObject(first_selected_object, first_selected_object.selectStartPage);
                        this.selection.groupSelection = first_selected_object;
                        first_selected_object.selectObject(first_selected_object.arrGraphicObjects[first_selected_object.arrGraphicObjects.length-1], first_selected_object.selectStartPage);
                    }
                    //else if(last_selected_object.getObjectType() === historyitem_type_ChartSpace)
                    //{TODO}
                    else
                    {
                        selectPrev(this, first_selected_object)
                    }
                }
            }
            this.updateOverlay();
        }
    },



    moveSelectedObjects: function(dx, dy)
    {
        if(!(this.isViewMode() === false))
            return;

        this.checkSelectedObjectsForMove(this.selection.groupSelection ? this.selection.groupSelection : null);
        this.swapTrackObjects();
        var move_state;
        if(!this.selection.groupSelection)
            move_state = new MoveState(this, this.selectedObjects[0], 0, 0);
        else
            move_state = new MoveInGroupState(this, this.selection.groupSelection.selectedObjects[0], this.selection.groupSelection, 0, 0);

        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].track(dx, dy, this.arrTrackObjects[i].originalObject.selectStartPage);
        move_state.onMouseUp({}, 0, 0, 0);
    },

    cursorMoveLeft: function(AddToSelect/*Shift*/, Word/*Ctrl*/)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveLeft(AddToSelect, Word);
            this.updateSelectionState();
        }
        else
        {
            if(this.selectedObjects.length === 0)
                return;
            this.moveSelectedObjects(-this.convertPixToMM(5), 0);
        }
    },

    cursorMoveRight: function(AddToSelect, Word)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveRight(AddToSelect, Word);
            this.updateSelectionState();
        }
        else
        {
            if(this.selectedObjects.length === 0)
                return;
            this.moveSelectedObjects(this.convertPixToMM(5), 0);
        }
    },


    cursorMoveUp: function(AddToSelect)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveUp(AddToSelect);
            this.updateSelectionState();
        }
        else
        {
            if(this.selectedObjects.length === 0)
                return;
            this.moveSelectedObjects(0, -this.convertPixToMM(5));
        }
    },

    cursorMoveDown: function(AddToSelect)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveDown(AddToSelect);
            this.updateSelectionState();
        }
        else
        {
            if(this.selectedObjects.length === 0)
                return;
            this.moveSelectedObjects(0, this.convertPixToMM(5));
        }
    },

    cursorMoveEndOfLine: function(AddToSelect)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveEndOfLine(AddToSelect);
            this.updateSelectionState();
        }
    },


    cursorMoveStartOfLine: function(AddToSelect)
    {

        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveStartOfLine(AddToSelect);
            this.updateSelectionState();
        }
    },

    cursorMoveAt: function( X, Y, AddToSelect )
    {
        var text_object;
        if(this.selection.textSelection)
        {
            text_object = this.selection.textSelection;
        }
        else if(this.selection.groupSelection && this.selection.groupSelection.selection.textSelection)
        {
            text_object = this.selection.groupSelection.selection.textSelection;
        }
        if(text_object)
        {
            text_object.cursorMoveAt( X, Y, AddToSelect );
            this.updateSelectionState();
        }
    },

    selectAll: function()
    {
        var content = this.getTargetDocContent();
        content && content.Select_All();
        this.updateSelectionState();
    },


    onKeyDown: function(e)
    {
        // TODO!!! var ctrlKey = e.metaKey || e.ctrlKey

        var drawingObjectsController = this;
        var bRetValue = false;
        var state = drawingObjectsController.curState;
        var isViewMode = drawingObjectsController.drawingObjects.isViewerMode();
        if ( e.keyCode == 8 && false === isViewMode ) // BackSpace
        {
            drawingObjectsController.remove(-1);
            bRetValue = true;
        }
        else if ( e.keyCode == 9 && false === isViewMode ) // Tab
        {
            if(this.selection.textSelection || this.selection.groupSelection && this.selection.groupSelection.selection.textSelection
                || this.selection.chartSelection && this.selection.chartSelection.textSelection)
            {
                this.checkSelectedObjectsAndCallback(this.paragraphAdd, [new ParaTab()])
            }
            else
            {
                this.selectNextObject(!e.shiftKey ? 1 : -1);
            }
        }
        else if ( e.keyCode == 13 && false === isViewMode ) // Enter
        {
            if(this.selection.textSelection || this.selection.groupSelection && this.selection.groupSelection.selection.textSelection
                || this.selection.chartSelection && this.selection.chartSelection.textSelection)
            {
                this.checkSelectedObjectsAndCallback(this.addNewParagraph, [])
                this.recalculate();
            }
            else
            {
                //TODO: this.selectNextObject(!e.shiftKey ? 1 : -1);
            }
            bRetValue = true;
        }
        else if ( e.keyCode == 27 ) // Esc
        {
            var content = this.getTargetDocContent();
            if(content)
            {
                content.Selection_Remove();
            }

            if(this.selection.textSelection)
            {
                this.selection.textSelection = null;
            }
            else if(this.selection.groupSelection)
            {
                if(this.selection.groupSelection.selection.textSelection)
                {
                    this.selection.groupSelection.selection.textSelection = null;
                }
                else if(this.selection.groupSelection.chartSelection)
                {
                    //TODO
                }
                else
                {
                    this.selection.groupSelection.resetSelection();
                    this.selection.groupSelection = null;
                }
            }
            else if(this.selection.chartSelection)
            {
                //TODO
            }
            else
            {
                this.resetSelection();
                var ws = drawingObjectsController.drawingObjects.getWorksheet();
                var isChangeSelectionShape = ws._checkSelectionShape();
                if (isChangeSelectionShape) {
                    ws._drawSelection();
                    ws._updateSelectionNameAndInfo();
                }
            }
            bRetValue = true;
        }
        else if ( e.keyCode == 32 && false === isViewMode ) // Space
        {
            if(!e.ctrlKey)
            {
                //if(this.selection.textSelection || this.selection.groupSelection && this.selection.groupSelection.selection.textSelection
                //    || this.selection.chartSelection && this.selection.chartSelection.textSelection)
                //{
                    this.checkSelectedObjectsAndCallback(this.paragraphAdd, [new ParaSpace(1)]);
                    this.recalculate();
                //}
               // else
               // {
               //     //TODO: this.selectNextObject(!e.shiftKey ? 1 : -1);
               // }
            }

            bRetValue = true;
        }
        else if ( e.keyCode == 33 ) // PgUp
        {
        }
        else if ( e.keyCode == 34 ) // PgDn
        {
        }
        else if ( e.keyCode == 35 ) // клавиша End
        {
            var content = this.getTargetDocContent();
            if(content)
            {
                if (e.ctrlKey) // Ctrl + End - переход в конец документа
                {
                    content.Cursor_MoveToEndPos();
                    drawingObjectsController.updateSelectionState();
                }
                else // Переходим в конец строки
                {
                    content.Cursor_MoveEndOfLine(e.shiftKey);
                    drawingObjectsController.updateSelectionState();
                }
            }
            bRetValue = true;
        }
        else if ( e.keyCode == 36 ) // клавиша Home
        {
            var content = this.getTargetDocContent();
            if(content)
            {
                if (e.ctrlKey) // Ctrl + End - переход в конец документа
                {
                    content.Cursor_MoveToStartPos();
                    drawingObjectsController.updateSelectionState();
                }
                else // Переходим в конец строки
                {
                    content.Cursor_MoveStartOfLine(e.shiftKey);
                    drawingObjectsController.updateSelectionState();
                }
            }
            bRetValue = true;
        }
        else if ( e.keyCode == 37 ) // Left Arrow
        {
            this.cursorMoveLeft(e.shiftKey,e.ctrlKey );
            bRetValue = true;
        }
        else if ( e.keyCode == 38 ) // Top Arrow
        {
            this.cursorMoveUp(e.shiftKey,e.ctrlKey );
            bRetValue = true;
        }
        else if ( e.keyCode == 39 ) // Right Arrow
        {
            this.cursorMoveRight(e.shiftKey,e.ctrlKey );
            bRetValue = true;
        }
        else if ( e.keyCode == 40 ) // Bottom Arrow
        {
            this.cursorMoveDown(e.shiftKey,e.ctrlKey );
            bRetValue = true;
        }
        else if ( e.keyCode == 45 ) // Insert
        {
            //TODO
        }
        else if ( e.keyCode == 46 && false === isViewMode ) // Delete
        {
            drawingObjectsController.remove(1);
            bRetValue = true;
        }
        else if ( e.keyCode == 65 && true === e.ctrlKey ) // Ctrl + A - выделяем все
        {
            this.selectAll();
            bRetValue = true;
        }
        else if ( e.keyCode == 66 && false === isViewMode && true === e.ctrlKey ) // Ctrl + B - делаем текст жирным
        {
            var TextPr = drawingObjectsController.getParagraphTextPr();
            if ( isRealObject(TextPr))
            {
                this.setCellBold(TextPr.Bold === true ? false : true );
                bRetValue = true;
            }
        }
        else if ( e.keyCode == 67 && true === e.ctrlKey ) // Ctrl + C + ...
        {
            //TODO
        }
        else if ( e.keyCode == 69 && false === isViewMode && true === e.ctrlKey ) // Ctrl + E - переключение прилегания параграфа между center и left
        {

            var ParaPr = drawingObjectsController.getParagraphParaPr();
            if ( isRealObject(ParaPr))
            {
                this.setCellAlign(ParaPr.Jc === align_Center ? "left" : "center" );
                bRetValue = true;
            }
        }
        else if ( e.keyCode == 73 && false === isViewMode && true === e.ctrlKey ) // Ctrl + I - делаем текст наклонным
        {
            var TextPr = drawingObjectsController.getParagraphTextPr();
            if ( isRealObject(TextPr))
            {
                drawingObjectsController.setCellItalic(TextPr.Italic === true ? false : true );
                bRetValue = true;
            }
        }
        else if ( e.keyCode == 74 && false === isViewMode && true === e.ctrlKey ) // Ctrl + J переключение прилегания параграфа между justify и left
        {
            var ParaPr = drawingObjectsController.getParagraphParaPr();
            if ( isRealObject(ParaPr))
            {
                drawingObjectsController.setCellAlign(ParaPr.Jc === align_Justify ? "left" : "justify" );
                bRetValue = true;
            }
        }
        else if ( e.keyCode == 75 && false === isViewMode && true === e.ctrlKey ) // Ctrl + K - добавление гиперссылки
        {
            //TODO
            bRetValue = true;
        }
        else if ( e.keyCode == 76 && false === isViewMode && true === e.ctrlKey ) // Ctrl + L + ...
        {

            var ParaPr = drawingObjectsController.getParagraphParaPr();
            if ( isRealObject(ParaPr))
            {
                drawingObjectsController.setCellAlign(ParaPr.Jc === align_Left ? "justify" : "left");
                bRetValue = true;
            }

        }
        else if ( e.keyCode == 77 && false === isViewMode && true === e.ctrlKey ) // Ctrl + M + ...
        {
            bRetValue = true;

        }
        else if ( e.keyCode == 80 && true === e.ctrlKey ) // Ctrl + P + ...
        {
            bRetValue = true;

        }
        else if ( e.keyCode == 82 && false === isViewMode && true === e.ctrlKey ) // Ctrl + R - переключение прилегания параграфа между right и left
        {
            var ParaPr = drawingObjectsController.getParagraphParaPr();
            if ( isRealObject(ParaPr))
            {
                drawingObjectsController.setCellAlign(ParaPr.Jc === align_Right ? "left" : "right");
                bRetValue = true;
            }
        }
        else if ( e.keyCode == 83 && false === isViewMode && true === e.ctrlKey ) // Ctrl + S - save
        {
            bRetValue = false;
        }
        else if ( e.keyCode == 85 && false === isViewMode && true === e.ctrlKey ) // Ctrl + U - делаем текст подчеркнутым
        {
            var TextPr = drawingObjectsController.getParagraphTextPr();
            if ( isRealObject(TextPr))
            {
                drawingObjectsController.setCellUnderline(TextPr.Underline === true ? false : true );
                bRetValue = true;
            }
        }
        else if ( e.keyCode == 86 && false === isViewMode && true === e.ctrlKey ) // Ctrl + V - paste
        {

        }
        else if ( e.keyCode == 88 && false === isViewMode && true === e.ctrlKey ) // Ctrl + X - cut
        {
            //не возвращаем true чтобы не было preventDefault
        }
        else if ( e.keyCode == 89 && false === isViewMode && true === e.ctrlKey ) // Ctrl + Y - Redo
        {
        }
        else if ( e.keyCode == 90 && false === isViewMode && true === e.ctrlKey ) // Ctrl + Z - Undo
        {
        }
        else if ( e.keyCode == 93 || 57351 == e.keyCode /*в Opera такой код*/ ) // контекстное меню
        {
            bRetValue = true;
        }
        else if ( e.keyCode == 121 && true === e.shiftKey ) // Shift + F10 - контекстное меню
        {
        }
        else if ( e.keyCode == 144 ) // Num Lock
        {
        }
        else if ( e.keyCode == 145 ) // Scroll Lock
        {
        }
        else if ( e.keyCode == 187 && false === isViewMode && true === e.ctrlKey ) // Ctrl + Shift + +, Ctrl + = - superscript/subscript
        {
            var TextPr = drawingObjectsController.getParagraphTextPr();
            if ( isRealObject(TextPr))
            {
                if ( true === e.shiftKey )
                    drawingObjectsController.setCellSuperscript(TextPr.VertAlign === vertalign_SuperScript ? false : true );
                else
                    drawingObjectsController.setCellSubscript(TextPr.VertAlign === vertalign_SubScript ? false : true );
                bRetValue = true;
            }
        }
        else if ( e.keyCode == 188 && true === e.ctrlKey ) // Ctrl + ,
        {
            var TextPr = drawingObjectsController.getParagraphTextPr();
            if ( isRealObject(TextPr))
            {
                drawingObjectsController.setCellSuperscript(TextPr.VertAlign === vertalign_SuperScript ? false : true );
                bRetValue = true;
            }
        }
        else if ( e.keyCode == 189 && false === isViewMode ) // Клавиша Num-
        {

            var Item = null;
            if ( true === e.ctrlKey && true === e.shiftKey )
            {
                Item = new ParaText( String.fromCharCode( 0x2013 ) );
                Item.SpaceAfter = false;
            }
            else if ( true === e.shiftKey )
                Item = new ParaText( "_" );
            else
                Item = new ParaText( "-" );

            this.checkSelectedObjectsAndCallback(this.paragraphAdd, [Item]);
            this.recalculate();
            bRetValue = true;
        }
        else if ( e.keyCode == 190 && true === e.ctrlKey ) // Ctrl + .
        {
            var TextPr = drawingObjectsController.getParagraphTextPr();
            if ( isRealObject(TextPr))
            {
                drawingObjectsController.setCellSubscript(TextPr.VertAlign === vertalign_SubScript ? false : true );
                bRetValue = true;
            }
        }
        else if ( e.keyCode == 219 && false === isViewMode && true === e.ctrlKey ) // Ctrl + [
        {
            drawingObjectsController.decreaseFontSize();
            bRetValue = true;
        }
        else if ( e.keyCode == 221 && false === isViewMode && true === e.ctrlKey ) // Ctrl + ]
        {
            drawingObjectsController.increaseFontSize();
            bRetValue = true;
        }
        if(bRetValue)
            e.preventDefault();
        return bRetValue;
    },

    /*onKeyPress: function(e)
     {
     this.curState.onKeyPress(e);
     return true;
     },*/

    resetSelectionState: function()
    {
        if(this.bNoResetSeclectionState === true)
            return;
        this.checkChartTextSelection();
        this.resetSelection();
        this.changeCurrentState(new NullState(this, this.drawingObjects));
        this.updateSelectionState();
        var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
        asc["editor"].asc_endAddShape();
    },

    resetSelectionState2: function()
    {
        var count = this.selectedObjects.length;
        while(count > 0)
        {
            this.selectedObjects[0].deselect(this);
            --count;
        }
        this.changeCurrentState(new NullState(this, this.drawingObjects));


    },


    checkChartTextSelection: function()
    {
        var chart_selection;
        if(this.selection.chartSelection)
        {
            chart_selection = this.selection.chartSelection;
        }
        else if(this.selection.groupSelection && this.selection.groupSelection.chartSelection)
        {
            chart_selection = this.selection.groupSelection.chartSelection;
        }
        if(chart_selection && chart_selection.selection.textSelection)
        {
            var content = chart_selection.selection.textSelection.getDocContent();
            if(content)
            {
                if(content.Is_Empty())
                {
                    if(chart_selection.selection.title && chart_selection.selection.title.parent)
                    {
                        History.Create_NewPoint();
                        chart_selection.selection.title.parent.setTitle(null);
                    }
                }
            }
            if(chart_selection.recalcInfo.bRecalculatedTitle)
            {
                chart_selection.recalcInfo.recalcTitle = null;
                chart_selection.handleUpdateInternalChart();
                chart_selection.addToRecalculate();
                if(this.document)
                {
                    var para_drawing;
                    if(chart_selection.group)
                    {
                        var cur_group = chart_selection.group;
                        while(cur_group.group)
                            cur_group = cur_group.group;
                        para_drawing = cur_group.parent;
                    }
                    else
                    {
                        para_drawing = chart_selection.parent;
                    }
                    if(para_drawing && para_drawing.GraphicObj)
                    {
                        if(para_drawing.Is_Inline())
                        {
                            para_drawing.OnEnd_ResizeInline(para_drawing.GraphicObj.bounds.w, para_drawing.GraphicObj.bounds.h);
                        }
                        else
                        {

                            var pos_x = para_drawing.GraphicObj.bounds.x + para_drawing.GraphicObj.posX;
                            var pos_y = para_drawing.GraphicObj.bounds.y + para_drawing.GraphicObj.posY;
                            var nearest_pos = this.document.Get_NearestPos(para_drawing.GraphicObj.selectStartPage, pos_x, pos_y, true, para_drawing);
                            para_drawing.Remove_FromDocument(false);
                            para_drawing.Set_XYForAdd(pos_x, pos_y, nearest_pos, para_drawing.GraphicObj.selectStartPage);
                            para_drawing.Add_ToDocument2(para_drawing.Get_ParentParagraph());
                        }
                    }
                    this.document.Recalculate();
                }
                else
                {
                    this.startRecalculate();
                }
                chart_selection.recalcInfo.bRecalculatedTitle = false;
            }
        }
    },

    resetSelection: function()
    {
        if(this.document)
        {
            this.checkChartTextSelection();
        }
        this.resetInternalSelection();
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            this.selectedObjects[i].selected = false;
        }
        this.selectedObjects.length = 0;
        this.selection =
        {
            selectedObjects: [],
            groupSelection: null,
            chartSelection: null,
            textSelection: null
        };
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
        this.updateOverlay();
    },

    trackMoveObjects: function(dx, dy)
    {
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].track(dx, dy);
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

    canGroup: function()
    {
        return this.getArrayForGrouping().length > 1;
    },

    getArrayForGrouping: function()
    {
        var graphic_objects = this.getDrawingObjects();
        var grouped_objects = [];
        for(var i = 0; i < graphic_objects.length; ++i)
        {
            var cur_graphic_object = graphic_objects[i];
            if(cur_graphic_object.selected && cur_graphic_object.canGroup())
            {
                grouped_objects.push(cur_graphic_object);
            }
        }
        return grouped_objects;
    },


    getBoundsForGroup: function(arrDrawings)
    {
        var bounds = arrDrawings[0].getBoundsInGroup();
        var max_x = bounds.maxX;
        var max_y = bounds.maxY;
        var min_x = bounds.minX;
        var min_y = bounds.minY;
        for(var i = 1; i < arrDrawings.length; ++i)
        {
            bounds = arrDrawings[i].getBoundsInGroup();
            if(max_x < bounds.maxX)
                max_x = bounds.maxX;
            if(max_y < bounds.maxY)
                max_y = bounds.maxY;
            if(min_x > bounds.minX)
                min_x = bounds.minX;
            if(min_y > bounds.minY)
                min_y = bounds.minY;
        }
        return {minX: min_x, maxX: max_x, minY: min_y, maxY: max_y};
    },


    getGroup: function(arrDrawings)
    {
        if(!Array.isArray(arrDrawings))
            arrDrawings = this.getArrayForGrouping();
        if(arrDrawings.length < 2)
            return null;
        var bounds = this.getBoundsForGroup(arrDrawings);
        var max_x = bounds.maxX;
        var max_y = bounds.maxY;
        var min_x = bounds.minX;
        var min_y = bounds.minY;
        var group = new CGroupShape();
        group.setSpPr(new CSpPr());
        group.spPr.setParent(group);
        group.spPr.setXfrm(new CXfrm());
        var xfrm = group.spPr.xfrm;
        xfrm.setParent(group.spPr);
        xfrm.setOffX(min_x);
        xfrm.setOffY(min_y);
        xfrm.setExtX(max_x-min_x);
        xfrm.setExtY(max_y-min_y);
        xfrm.setChExtX(max_x-min_x);
        xfrm.setChExtY(max_y-min_y);
        xfrm.setChOffX(0);
        xfrm.setChOffY(0);
        for(var i = 0; i < arrDrawings.length; ++i)
        {
            arrDrawings[i].spPr.xfrm.setOffX(arrDrawings[i].x - min_x);
            arrDrawings[i].spPr.xfrm.setOffY(arrDrawings[i].y - min_y);
            arrDrawings[i].setGroup(group);
            group.addToSpTree(group.spTree.length, arrDrawings[i]);
        }
        group.setBDeleted(false);
        return group;
    },

    unGroup: function()
    {
        this.checkSelectedObjectsAndCallback(this.unGroupCallback, null)
    },

    unGroupCallback: function()
    {
        var ungroup_arr = this.canUnGroup(true);
        if(ungroup_arr.length > 0)
        {
            History.Create_NewPoint();
            this.resetSelection();
            var i, j,   cur_group, sp_tree, sp;
            var a_objects = [];
            for(i = 0; i < ungroup_arr.length; ++i)
            {
                cur_group = ungroup_arr[i];
                cur_group.normalize();
                sp_tree = cur_group.spTree;
                for(j = 0; j < sp_tree.length; ++j)
                {
                    sp = sp_tree[j];
                    sp.spPr.xfrm.setRot(normalizeRotate(sp.rot + cur_group.rot));
                    sp.spPr.xfrm.setOffX(sp.spPr.xfrm.offX + cur_group.spPr.xfrm.offX);
                    sp.spPr.xfrm.setOffY(sp.spPr.xfrm.offY + cur_group.spPr.xfrm.offY);
                    sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                    sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                    sp.setGroup(null);
                    sp.addToDrawingObjects();
                    this.selectObject(sp, 0);
                }
                cur_group.deleteDrawingBase();
            }
            this.startRecalculate();
        }
    },

    canUnGroup: function(bRetArray)
    {
        var _arr_selected_objects = this.selectedObjects;
        var ret_array = [];
        for(var _index = 0; _index < _arr_selected_objects.length; ++_index)
        {
            if(_arr_selected_objects[_index].getObjectType() === historyitem_type_GroupShape
                && (!_arr_selected_objects[_index].parent || _arr_selected_objects[_index].parent && !_arr_selected_objects[_index].parent.Is_Inline()))
            {
                if(!(bRetArray === true))
                    return true;
                ret_array.push(_arr_selected_objects[_index]);

            }
        }
        return bRetArray === true ? ret_array : false;
    },

    startTrackNewShape: function(presetGeom)
    {
        switch (presetGeom)
        {
            case "spline":
            {
                this.changeCurrentState(new SplineBezierState(this));
                break;
            }
            case "polyline1":
            {
                this.changeCurrentState(new PolyLineAddState(this));
                break;
            }
            case "polyline2":
            {
                this.changeCurrentState(new AddPolyLine2State(this));
                break;
            }
            default :
            {
                this.currentPresetGeom = presetGeom;
                this.changeCurrentState(new StartAddNewShape(this, presetGeom));
                break;
            }
        }
    },


    getHyperlinkInfo: function()
    {
        //TODO
        return null;
    },

    setSelectionState: function( state, stateIndex )
    {

        var _state_index = isRealNumber(stateIndex) ? stateIndex : state.length-1;
        var selection_state = state[_state_index];
        this.resetSelection();
        if(selection_state.textObject)
        {
            this.selectObject(selection_state.textObject, selection_state.selectStartPage);
            this.selection.textSelection = selection_state.textObject;
            selection_state.textObject.getDocContent().Set_SelectionState(selection_state.textSelection, selection_state.textSelection.length-1);
        }
        else if(selection_state.groupObject)
        {
            this.selectObject(selection_state.groupObject, selection_state.selectStartPage);
            this.selection.groupSelection = selection_state.groupObject;
            selection_state.groupObject.setSelectionState(selection_state.groupSelection);
        }
        else if(selection_state.chartObject)
        {
            this.selectObject(selection_state.chartObject, selection_state.selectStartPage);
            this.selection.chartSelection = selection_state.chartObject;
            selection_state.chartObject.setSelectionState(selection_state.chartSelection);
        }
        else if(selection_state.wrapObject)
        {
            this.selectObject(selection_state.wrapObject, selection_state.selectStartPage);
            this.selection.wrapPolygonSelection = selection_state.wrapObject;
        }
        else
        {
            for(var i = 0; i < selection_state.selection.length; ++i)
            {
                this.selectObject(selection_state.selection[i].object, selection_state.selection[i].pageIndex);
            }
        }
       //if(this.drawingObjects && this.selectedObjects.length > 0)
       //{
       //    var ws_view = this.drawingObjects.getWorksheet();
       //    if(ws_view)
       //    {
       //        ws_view.isSelectOnShape = true;
       //    }
       //}
    },


    getSelectionState: function()
    {
        var selection_state = {};
        if(this.selection.textSelection)
        {
            selection_state.textObject = this.selection.textSelection;
            selection_state.selectStartPage = this.selection.textSelection.selectStartPage;
            selection_state.textSelection = this.selection.textSelection.getDocContent().Get_SelectionState();
        }
        else if(this.selection.groupSelection)
        {
            selection_state.groupObject = this.selection.groupSelection;
            selection_state.selectStartPage = this.selection.groupSelection.selectStartPage;
            selection_state.groupSelection = this.selection.groupSelection.getSelectionState();
        }
        else if(this.selection.chartSelection)
        {
            selection_state.chartObject = this.selection.chartSelection;
            selection_state.selectStartPage = this.selection.chartSelection.selectStartPage;
            selection_state.chartSelection = this.selection.chartSelection.getSelectionState();
        }
        else if(this.selection.wrapPolygonSelection)
        {
            selection_state.wrapObject = this.selection.wrapPolygonSelection;
            selection_state.selectStartPage = this.selection.wrapPolygonSelection.selectStartPage;
        }
        else
        {
            selection_state.selection = [];
            for(var i = 0; i < this.selectedObjects.length; ++i)
            {
                selection_state.selection.push({object: this.selectedObjects[i], pageIndex: this.selectedObjects[i].selectStartPage});
            }
        }
        return [selection_state];
    },


    drawTracks: function(overlay)
    {
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].draw(overlay);
    },

    needUpdateOverlay: function()
    {
        return this.arrTrackObjects.length > 0;
    },

    drawSelection: function(drawingDocument)
    {
        DrawingObjectsController.prototype.drawSelect.call(this, 0, drawingDocument);
        //this.drawTextSelection();
    },

    getTargetTransform: function()
    {
        if(this.selection.textSelection)
        {
            return this.selection.textSelection.transformText;
        }
        else if(this.selection.groupSelection )
        {
            if(this.selection.groupSelection.selection.textSelection)
                return this.selection.groupSelection.selection.textSelection.transformText;
            else if(this.selection.groupSelection.selection.chartSelection && this.selection.groupSelection.selection.chartSelection.selection.textSelection)
            {
                return this.selection.groupSelection.selection.chartSelection.selection.textSelection.transformText;
            }
        }
        else if(this.selection.chartSelection && this.selection.chartSelection.selection.textSelection)
        {
            return this.selection.chartSelection.selection.textSelection.transformText;
        }
        return new CMatrix();
    },

    drawTextSelection: function()
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            this.drawingObjects.drawingDocument.UpdateTargetTransform(this.getTargetTransform());
            content.Selection_Draw_Page(0);
        }
    },

    getSelectedObjects: function()
    {
        return this.selectedObjects;
    },

    getDrawingPropsFromArray: function(drawings)
    {
        var image_props, shape_props, chart_props, new_image_props, new_shape_props, new_chart_props;
        var drawing;
        for(var i = 0; i < drawings.length; ++i)
        {
            drawing = drawings[i];
            switch(drawing.getObjectType())
            {
                case historyitem_type_Shape:
                {
                    new_shape_props =
                    {
                        canFill: drawing.canFill(),
                        type: drawing.getPresetGeom(),
                        fill: drawing.getFill(),
                        stroke: drawing.getStroke(),
                        paddings: drawing.getPaddings(),
                        verticalTextAlign: drawing.getBodyPr().anchor,
                        w: drawing.extX,
                        h: drawing.extY ,
                        canChangeArrows: drawing.canChangeArrows(),
                        bFromChart: false
                    };
                    if(!shape_props)
                        shape_props = new_shape_props;
                    else
                    {
                        shape_props = CompareShapeProperties(shape_props, new_shape_props);
                    }
                    break;
                }
                case historyitem_type_ImageShape:
                {
                    new_image_props =
                    {
                        imageUrl: drawing.getImageUrl(),
                        w: drawing.extX,
                        h: drawing.extY
                    };
                    if(!image_props)
                        image_props = new_image_props;
                    else
                    {
                        if(image_props.imageUrl !== null && image_props.imageUrl !== new_image_props.imageUrl)
                            image_props.imageUrl = null;
                        if(image_props.w != null && image_props.w !== new_image_props.w)
                            image_props.w = null;
                        if(image_props.h != null && image_props.h !== new_image_props.h)
                            image_props.h = null;
                    }
                    break;
                }
                case historyitem_type_ChartSpace:
                {
                    var type_subtype = drawing.getTypeSubType();
                    new_chart_props =
                    {
                        type: type_subtype.type,
                        subtype: type_subtype.subtype,
                        styleId: drawing.style,
                        w: drawing.extX,
                        h: drawing.extY
                    };
                    if(!chart_props)
                    {
                        chart_props = new_chart_props;
                        chart_props.chartProps = this.getPropsFromChart(drawing);
                        chart_props.severalCharts = false;
                        chart_props.severalChartStyles = false;
                        chart_props.severalChartTypes = false;
                    }
                    else
                    {
                        chart_props.chartProps = null;
                        chart_props.severalCharts = true;
                        if(!chart_props.severalChartStyles)
                        {
                            chart_props.severalChartStyles = (chart_props.styleId !== new_chart_props.styleId);
                        }
                        if(!chart_props.severalChartTypes)
                        {
                            chart_props.severalChartTypes = (chart_props.type !== new_chart_props.type);
                        }

                        if(chart_props.w != null && chart_props.w !== new_chart_props.w)
                            chart_props.w = null;
                        if(chart_props.h != null && chart_props.h !== new_chart_props.h)
                            chart_props.h = null;
                    }

                    new_shape_props =
                    {
                        canFill: true,
                        type: null,
                        fill: drawing.getFill(),
                        stroke: drawing.getStroke(),
                        paddings: null,
                        verticalTextAlign: null,
                        w: drawing.extX,
                        h: drawing.extY ,
                        canChangeArrows: false,
                        bFromChart: true
                    };
                    if(!shape_props)
                        shape_props = new_shape_props;
                    else
                    {
                        shape_props = CompareShapeProperties(shape_props, new_shape_props);
                    }
                    break;
                }
                case historyitem_type_GroupShape:
                {
                    var group_drawing_props = this.getDrawingPropsFromArray(drawing.spTree);
                    if(group_drawing_props.shapeProps)
                    {
                        if(!shape_props)
                            shape_props = group_drawing_props.shapeProps;
                        else
                        {
                            shape_props = CompareShapeProperties(shape_props, group_drawing_props.shapeProps);
                        }
                    }
                    if(group_drawing_props.imageProps)
                    {
                        if(!image_props)
                            image_props = group_drawing_props.imageProps;
                        else
                        {
                            if(image_props.imageUrl !== null && image_props.imageUrl !== group_drawing_props.imageProps.imageUrl)
                                image_props.imageUrl = null;

                            if(image_props.w != null && image_props.w !== group_drawing_props.imageProps.w)
                                image_props.w = null;
                            if(image_props.h != null && image_props.h !== group_drawing_props.imageProps.h)
                                image_props.h = null;
                        }
                    }
                    if(group_drawing_props.chartProps)
                    {
                        if(!chart_props)
                        {
                            chart_props = group_drawing_props.chartProps;
                        }
                        else
                        {
                            chart_props.chartProps = null;
                            chart_props.severalCharts = true;
                            if(!chart_props.severalChartStyles)
                            {
                                chart_props.severalChartStyles = (chart_props.styleId !== group_drawing_props.chartProps.styleId);
                            }
                            if(!chart_props.severalChartTypes)
                            {
                                chart_props.severalChartTypes = (chart_props.type !== group_drawing_props.chartProps.type);
                            }
                            if(chart_props.w != null && chart_props.w !== new_chart_props.w)
                                chart_props.w = null;
                            if(chart_props.h != null && chart_props.h !== new_chart_props.h)
                                chart_props.h = null;
                        }
                    }
                    break;
                }
            }
        }
        return {imageProps: image_props, shapeProps: shape_props, chartProps: chart_props};
    },



    getDrawingProps: function()
    {
        if(this.selection.groupSelection)
        {
            return this.getDrawingPropsFromArray(this.selection.groupSelection.selectedObjects);
        }
        return this.getDrawingPropsFromArray(this.selectedObjects);
    },

    getGraphicObjectProps: function()
    {
        var  props = this.getDrawingProps();

        var api = window["Asc"]["editor"];
        var shape_props, image_props, chart_props;
        var ascSelectedObjects = [];

        var ret = [];
        if (isRealObject(props.shapeProps))
        {
            shape_props = new asc_CImgProperty();
            shape_props.fromGroup = props.shapeProps.fromGroup;
            shape_props.ShapeProperties = new asc_CShapeProperty();
            shape_props.ShapeProperties.type =  props.shapeProps.type;
            shape_props.ShapeProperties.fill = props.shapeProps.fill;
            shape_props.ShapeProperties.stroke = props.shapeProps.stroke;
            shape_props.ShapeProperties.canChangeArrows = props.shapeProps.canChangeArrows;
            shape_props.ShapeProperties.bFromChart = props.shapeProps.bFromChart;

            if(props.shapeProps.paddings)
            {
                shape_props.ShapeProperties.paddings = new asc_CPaddings(props.shapeProps.paddings);
            }
            shape_props.verticalTextAlign = props.shapeProps.verticalTextAlign;
            shape_props.ShapeProperties.canFill = props.shapeProps.canFill;
            shape_props.Width = props.shapeProps.w;
            shape_props.Height = props.shapeProps.h;
            var pr = shape_props.ShapeProperties;
            if (pr.fill != null && pr.fill.fill != null && pr.fill.fill.type == FILL_TYPE_BLIP)
            {
                if(asc && asc["editor"])
                    this.drawingObjects.drawingDocument.InitGuiCanvasShape(asc["editor"].shapeElementId);
                this.drawingObjects.drawingDocument.DrawImageTextureFillShape(pr.fill.fill.RasterImageId);
            }
            else
            {
                if(asc && asc["editor"])
                    this.drawingObjects.drawingDocument.InitGuiCanvasShape(asc["editor"].shapeElementId);
                this.drawingObjects.drawingDocument.DrawImageTextureFillShape(null);
            }
            shape_props.ShapeProperties.fill = CreateAscFillEx(shape_props.ShapeProperties.fill);
            shape_props.ShapeProperties.stroke = CreateAscStrokeEx(shape_props.ShapeProperties.stroke);
            shape_props.ShapeProperties.stroke.canChangeArrows  = shape_props.ShapeProperties.canChangeArrows === true;
            //shape_props.Locked = false;
            ret.push(shape_props);
        }
        if (isRealObject(props.imageProps))
        {
            image_props = new asc_CImgProperty();
            image_props.Width = props.imageProps.w;
            image_props.Height = props.imageProps.h;
            image_props.ImageUrl = props.imageProps.imageUrl;
            //image_props.Locked = false;//TODO!(props.imageProps.lockType === c_oAscLockTypes.kLockTypeNone);
            ret.push(image_props);
        }
        if (isRealObject(props.chartProps) && isRealObject(props.chartProps.chartProps))
        {
            chart_props = new asc_CImgProperty();
            chart_props.Width = props.chartProps.w;
            chart_props.Height = props.chartProps.h;
            chart_props.ChartProperties = props.chartProps.chartProps;
            ret.push(chart_props);
        }
        for (var i = 0; i < ret.length; i++)
        {

            ascSelectedObjects.push(new asc_CSelectedObject( c_oAscTypeSelectElement.Image, new asc_CImgProperty(ret[i]) ));
        }

        // Текстовые свойства объекта
        var ParaPr = this.getParagraphParaPr();
        var TextPr = this.getParagraphTextPr();
        if ( ParaPr && TextPr ) {
            var theme = this.getTheme();
            if(theme && theme.themeElements && theme.themeElements.fontScheme)
            {
                if(TextPr.FontFamily)
                {
                    TextPr.FontFamily.Name =  theme.themeElements.fontScheme.checkFont(TextPr.FontFamily.Name);
                }
                if(TextPr.RFonts)
                {
                    if(TextPr.RFonts.Ascii)
                        TextPr.RFonts.Ascii.Name     = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.Ascii.Name);
                    if(TextPr.RFonts.EastAsia)
                        TextPr.RFonts.EastAsia.Name  = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.EastAsia.Name);
                    if(TextPr.RFonts.HAnsi)
                        TextPr.RFonts.HAnsi.Name     = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.HAnsi.Name);
                    if(TextPr.RFonts.CS)
                        TextPr.RFonts.CS.Name        = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.CS.Name);
                }
            }
            this.prepareParagraphProperties(ParaPr, TextPr, ascSelectedObjects);
        }

        return ascSelectedObjects;
    },

    prepareParagraphProperties: function(ParaPr, TextPr, ascSelectedObjects)
    {
        var _this = this;
        var trigger = this.drawingObjects.callTrigger;

        ParaPr.Subscript   = ( TextPr.VertAlign === vertalign_SubScript   ? true : false );
        ParaPr.Superscript = ( TextPr.VertAlign === vertalign_SuperScript ? true : false );
        ParaPr.Strikeout   = TextPr.Strikeout;
        ParaPr.DStrikeout  = TextPr.DStrikeout;
        ParaPr.AllCaps     = TextPr.Caps;
        ParaPr.SmallCaps   = TextPr.SmallCaps;
        ParaPr.TextSpacing = TextPr.Spacing;
        ParaPr.Position    = TextPr.Position;
        //-----------------------------------------------------------------------------

        if ( true === ParaPr.Spacing.AfterAutoSpacing )
            ParaPr.Spacing.After = spacing_Auto;
        else if ( undefined === ParaPr.Spacing.AfterAutoSpacing )
            ParaPr.Spacing.After = UnknownValue;

        if ( true === ParaPr.Spacing.BeforeAutoSpacing )
            ParaPr.Spacing.Before = spacing_Auto;
        else if ( undefined === ParaPr.Spacing.BeforeAutoSpacing )
            ParaPr.Spacing.Before = UnknownValue;

        if ( -1 === ParaPr.PStyle )
            ParaPr.StyleName = "";

        if ( null == ParaPr.NumPr || 0 === ParaPr.NumPr.NumId )
            ParaPr.ListType = {Type: -1, SubType : -1};

        // ParaPr.Spacing
        if ( true === ParaPr.Spacing.AfterAutoSpacing )
            ParaPr.Spacing.After = spacing_Auto;
        else if ( undefined === ParaPr.Spacing.AfterAutoSpacing )
            ParaPr.Spacing.After = UnknownValue;

        if ( true === ParaPr.Spacing.BeforeAutoSpacing )
            ParaPr.Spacing.Before = spacing_Auto;
        else if ( undefined === ParaPr.Spacing.BeforeAutoSpacing )
            ParaPr.Spacing.Before = UnknownValue;

        trigger("asc_onParaSpacingLine", new asc_CParagraphSpacing( ParaPr.Spacing ));

        // ParaPr.Jc
        trigger("asc_onPrAlign", ParaPr.Jc);

        ascSelectedObjects.push(new asc_CSelectedObject( c_oAscTypeSelectElement.Paragraph, new asc_CParagraphProperty( ParaPr ) ));
    },

    createImage: function(rasterImageId, x, y, extX, extY)
    {
        var image = new CImageShape();
        image.setSpPr(new CSpPr());
        image.spPr.setParent(image);
        image.spPr.setGeometry(CreateGeometry("rect"));
        image.spPr.setXfrm(new CXfrm());
        image.spPr.xfrm.setParent(image.spPr);
        image.spPr.xfrm.setOffX(x);
        image.spPr.xfrm.setOffY(y);
        image.spPr.xfrm.setExtX(extX);
        image.spPr.xfrm.setExtY(extY);

        var blip_fill = new CBlipFill();
        blip_fill.setRasterImageId(rasterImageId);
        blip_fill.setStretch(true);
        image.setBlipFill(blip_fill);
        image.setNvPicPr(new UniNvPr());
        image.setBDeleted(false);
        return image;
    },

    Get_SelectedText: function()
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Get_SelectedText();
        }
    },

    putPrLineSpacing: function(type, value)
    {
        this.checkSelectedObjectsAndCallback(this.setParagraphSpacing, [{ LineRule : type,  Line : value }]);
        //TODO
    },


    putLineSpacingBeforeAfter: function(type, value)
    {
        var arg;
        switch (type)
        {
            case 0:
            {
                if ( spacing_Auto === value )
                    arg = { BeforeAutoSpacing : true };
                else
                    arg = { Before : value, BeforeAutoSpacing : false };

                break;
            }
            case 1:
            {
                if ( spacing_Auto === value )
                    arg = { AfterAutoSpacing : true };
                else
                    arg = { After : value, AfterAutoSpacing : false };

                break;
            }
        }
        if(arg)
        {
            this.checkSelectedObjectsAndCallback(this.setParagraphSpacing, [arg]);
        }
    },



    setGraphicObjectProps: function(props)
    {
        if(typeof asc_CParagraphProperty !== "undefined" && !(props instanceof asc_CParagraphProperty))
        {
            this.checkSelectedObjectsAndCallback(this.setGraphicObjectPropsCallBack, [props]);
        }
        else
        {
            this.checkSelectedObjectsAndCallback(this.paraApplyCallback, [props]);
        }
    },



    checkSelectedObjectsAndCallback: function(callback, args)
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
                History.Create_NewPoint();
                _this.setSelectionState(selection_state);
                callback.apply(_this, args);
                _this.startRecalculate();
                _this.recalculateCurPos();
                _this.drawingObjects.sendGraphicObjectProps();
            }
        };
        this.drawingObjects.objectLocker.checkObjects(callback2);
    },

    setGraphicObjectPropsCallBack: function(props)
    {
        var apply_props;
        if(isRealNumber(props.Width) && isRealNumber(props.Height))
        {
            apply_props = props;
        }
        else
        {
            apply_props = props.ShapeProperties ? props.ShapeProperties : props;
        }
        var objects_by_types = this.applyDrawingProps(apply_props);
    },

    paraApplyCallback: function(Props)
    {
            if ( "undefined" != typeof(Props.ContextualSpacing) && null != Props.ContextualSpacing )
                this.setParagraphContextualSpacing( Props.ContextualSpacing );

            if ( "undefined" != typeof(Props.Ind) && null != Props.Ind )
                this.setParagraphIndent( Props.Ind );

            if ( "undefined" != typeof(Props.Jc) && null != Props.Jc )
                this.setParagraphAlign( Props.Jc );

            if ( "undefined" != typeof(Props.KeepLines) && null != Props.KeepLines )
                this.setParagraphKeepLines( Props.KeepLines );

            if ( undefined != Props.KeepNext && null != Props.KeepNext )
                this.setParagraphKeepNext( Props.KeepNext );

            if ( undefined != Props.WidowControl && null != Props.WidowControl )
                this.setParagraphWidowControl( Props.WidowControl );

            if ( "undefined" != typeof(Props.PageBreakBefore) && null != Props.PageBreakBefore )
                this.setParagraphPageBreakBefore( Props.PageBreakBefore );

            if ( "undefined" != typeof(Props.Spacing) && null != Props.Spacing )
                this.setParagraphSpacing( Props.Spacing );

            if ( "undefined" != typeof(Props.Shd) && null != Props.Shd )
                this.setParagraphShd( Props.Shd );

            if ( "undefined" != typeof(Props.Brd) && null != Props.Brd )
            {
                if(Props.Brd.Left && Props.Brd.Left.Color)
                {
                    Props.Brd.Left.Unifill = CreateUnifillFromAscColor(Props.Brd.Left.Color);
                }
                if(Props.Brd.Top && Props.Brd.Top.Color)
                {
                    Props.Brd.Top.Unifill = CreateUnifillFromAscColor(Props.Brd.Top.Color);
                }
                if(Props.Brd.Right && Props.Brd.Right.Color)
                {
                    Props.Brd.Right.Unifill = CreateUnifillFromAscColor(Props.Brd.Right.Color);
                }
                if(Props.Brd.Bottom && Props.Brd.Bottom.Color)
                {
                    Props.Brd.Bottom.Unifill = CreateUnifillFromAscColor(Props.Brd.Bottom.Color);
                }
                if(Props.Brd.InsideH && Props.Brd.InsideH.Color)
                {
                    Props.Brd.InsideH.Unifill = CreateUnifillFromAscColor(Props.Brd.InsideH.Color);
                }
                if(Props.Brd.InsideV && Props.Brd.InsideV.Color)
                {
                    Props.Brd.InsideV.Unifill = CreateUnifillFromAscColor(Props.Brd.InsideV.Color);
                }

                this.setParagraphBorders( Props.Brd );
            }

            if ( undefined != Props.Tabs )
            {
                var Tabs = new CParaTabs();
                Tabs.Set_FromObject( Props.Tabs.Tabs );
                this.setParagraphTabs( Tabs );
            }

            if ( undefined != Props.DefaultTab )
            {
                //this.setDefa( Props.DefaultTab );
            }


            // TODO: как только разъединят настройки параграфа и текста переделать тут
            var TextPr = new CTextPr();

            if ( true === Props.Subscript )
                TextPr.VertAlign = vertalign_SubScript;
            else if ( true === Props.Superscript )
                TextPr.VertAlign = vertalign_SuperScript;
            else if ( false === Props.Superscript || false === Props.Subscript )
                TextPr.VertAlign = vertalign_Baseline;

            if ( undefined != Props.Strikeout )
            {
                TextPr.Strikeout  = Props.Strikeout;
                TextPr.DStrikeout = false;
            }

            if ( undefined != Props.DStrikeout )
            {
                TextPr.DStrikeout = Props.DStrikeout;
                if ( true === TextPr.DStrikeout )
                    TextPr.Strikeout = false;
            }

            if ( undefined != Props.SmallCaps )
            {
                TextPr.SmallCaps = Props.SmallCaps;
                TextPr.AllCaps   = false;
            }

            if ( undefined != Props.AllCaps )
            {
                TextPr.Caps = Props.AllCaps;
                if ( true === TextPr.AllCaps )
                    TextPr.SmallCaps = false;
            }

            if ( undefined != Props.TextSpacing )
                TextPr.Spacing = Props.TextSpacing;

            if ( undefined != Props.Position )
                TextPr.Position = Props.Position;

            this.paragraphAdd( new ParaTextPr(TextPr) );
        this.startRecalculate();
    },


    applyColorScheme: function()
    {
        // var aObjects = this.drawingObjects.getDrawingObjects();
        // for (var i = 0; i < aObjects.length; i++)
        // {
        //     if(typeof aObjects[i].graphicObject.recalculateColors === "function")
        //         aObjects[i].graphicObject.recalculateColors();
        // }
    },

    // layers
    setGraphicObjectLayer: function(layerType)
    {
        this.checkSelectedObjectsAndCallback(this.setGraphicObjectLayerCallBack, [layerType]);
        //oAscDrawingLayerType
    },


    setGraphicObjectLayerCallBack: function(layerType)
    {
        switch (layerType)
        {
            case 0:
            {
                this.bringToFront();
                break;
            }
            case 1:
            {
                this.sendToBack();
                break;
            }
            case 2:
            {
                this.bringForward();
                break;
            }
            case 3:
            {
                this.bringBackward();
            }
        }
    },



    bringToFront : function()
    {
        var sp_tree = this.drawingObjects.getDrawingObjects();
        if(!(this.selection.groupSelection))
        {
            var selected = [];
            for(var i = 0; i < sp_tree.length; ++i)
            {
                if(sp_tree[i].graphicObject.selected)
                {
                    selected.push(sp_tree[i].graphicObject);
                }
            }
            for(var i = sp_tree.length-1; i > -1 ; --i)
            {
                if(sp_tree[i].graphicObject.selected)
                {
                    sp_tree[i].graphicObject.deleteDrawingBase();
                }
            }
            for(i = 0; i < selected.length; ++i)
            {
                selected[i].addToDrawingObjects(sp_tree.length);
            }
        }
        else
        {
            this.selection.groupSelection.bringToFront();
        }

    },

    bringForward : function()
    {
        var sp_tree = this.drawingObjects.getDrawingObjects();
        if(!(this.selection.groupSelection))
        {
            for(var i = sp_tree.length - 1;i > -1; --i)
            {
                var sp = sp_tree[i].graphicObject;
                if(sp.selected && i < sp_tree.length - 1 && !sp_tree[i+1].graphicObject.selected)
                {
                    sp.deleteDrawingBase();
                    sp.addToDrawingObjects(i+1);
                }
            }
        }
        else
        {
            this.selection.groupSelection.bringForward();
        }
        this.drawingObjects.showDrawingObjects(true);
    },

    sendToBack : function()
    {
        var sp_tree = this.drawingObjects.getDrawingObjects();

        if(!(this.selection.groupSelection))
        {
            var  j = 0;
            for(var i = 0; i < sp_tree.length; ++i)
            {
                if(sp_tree[i].graphicObject.selected)
                {
                    var object = sp_tree[i].graphicObject;
                    object.deleteDrawingBase();
                    object.addToDrawingObjects(j);
                    ++j;
                }
            }
        }
        else
        {
            this.selection.groupSelection.group.sendToBack();
        }

    },


    bringBackward : function()
    {
        var sp_tree = this.drawingObjects.getDrawingObjects();
        if(!(this.selection.groupSelection))
        {
            for(var i = 0;i < sp_tree.length; ++i)
            {
                var sp = sp_tree[i].graphicObject;
                if(sp.selected && i > 0 && !sp_tree[i-1].graphicObject.selected)
                {
                    sp.deleteDrawingBase();
                    sp.addToDrawingObjects(i-1);
                }
            }
        }
        else
        {
            this.selection.groupSelection.bringBackward();
        }
    }
};


//-----------------------------------------------------------------------------------
// ASC Classes
//-----------------------------------------------------------------------------------

function asc_CColor() {
    this.type = c_oAscColor.COLOR_TYPE_SRGB;
    this.value = null;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 255;

    this.Mods = [];
    this.ColorSchemeId = -1;
}

asc_CColor.prototype = {
    asc_getR: function() { return this.r },
    asc_putR: function(v) { this.r = v; this.hex = undefined; },
    asc_getG: function() { return this.g; },
    asc_putG: function(v) { this.g = v; this.hex = undefined; },
    asc_getB: function() { return this.b; },
    asc_putB: function(v) { this.b = v; this.hex = undefined; },
    asc_getA: function() { return this.a; },
    asc_putA: function(v) { this.a = v; this.hex = undefined; },
    asc_getType: function() { return this.type; },
    asc_putType: function(v) { this.type = v; },
    asc_getValue: function() { return this.value; },
    asc_putValue: function(v) { this.value = v; },
    asc_getHex: function() {
        if(!this.hex)
        {
            var a = this.a.toString(16);
            var r = this.r.toString(16);
            var g = this.g.toString(16);
            var b = this.b.toString(16);
            this.hex = ( a.length == 1? "0" + a: a) +
                ( r.length == 1? "0" + r: r) +
                ( g.length == 1? "0" + g: g) +
                ( b.length == 1? "0" + b: b);
        }
        return this.hex;
    },
    asc_getColor: function() {
        var ret = new CColor(this.r, this.g, this.b);
        return ret;
    }
}

//{ asc_CColor export
window["Asc"].asc_CColor = asc_CColor;
window["Asc"]["asc_CColor"] = asc_CColor;
prot = asc_CColor.prototype;

prot["asc_getR"] = prot.asc_getR;
prot["asc_putR"] = prot.asc_putR;
prot["asc_getG"] = prot.asc_getG;
prot["asc_putG"] = prot.asc_putG;
prot["asc_getB"] = prot.asc_getB;
prot["asc_putB"] = prot.asc_putB;
prot["asc_getA"] = prot.asc_getA;
prot["asc_putA"] = prot.asc_putA;
prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;
prot["asc_getValue"] = prot.asc_getValue;
prot["asc_putValue"] = prot.asc_putValue;
prot["asc_getHex"] = prot.asc_getHex;
prot["asc_getColor"] = prot.asc_getColor;
//}

function CreateAscColorCustomEx(r, g, b) {
    var ret = new asc_CColor();
    ret.type = c_oAscColor.COLOR_TYPE_SRGB;
    ret.r = r;
    ret.g = g;
    ret.b = b;
    ret.a = 255;
    return ret;
}

function CreateAscColorEx(unicolor) {
    if (null == unicolor || null == unicolor.color)
        return new asc_CColor();

    var ret = new asc_CColor();
    ret.r = unicolor.RGBA.R;
    ret.g = unicolor.RGBA.G;
    ret.b = unicolor.RGBA.B;
    ret.a = unicolor.RGBA.A;

    var _color = unicolor.color;
    switch (_color.type)
    {
        case COLOR_TYPE_SRGB:
        case COLOR_TYPE_SYS:
        {
            break;
        }
        case COLOR_TYPE_PRST:
        {
            ret.type = c_oAscColor.COLOR_TYPE_PRST;
            ret.value = _color.id;
            break;
        }
        case COLOR_TYPE_SCHEME:
        {
            ret.type = c_oAscColor.COLOR_TYPE_SCHEME;
            ret.value = _color.id;
            break;
        }
        default:
            break;
    }
    return ret;
}

function CorrectUniColorEx(asc_color, unicolor) {
    if (null == asc_color)
        return unicolor;

    var ret = unicolor;
    if (null == ret)
        ret = new CUniColor();

    var _type = asc_color.asc_getType();
    switch (_type)
    {
        case c_oAscColor.COLOR_TYPE_PRST:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_PRST)
            {
                ret.setColor(new CPrstColor());
            }
            ret.color.id = asc_color.asc_getValue();
            break;
        }
        case c_oAscColor.COLOR_TYPE_SCHEME:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_SCHEME)
            {
                ret.setColor(new CSchemeColor());
            }

            // тут выставляется ТОЛЬКО из меню. поэтому:
            var _index = parseInt(asc_color.asc_getValue());
            var _id = (_index / 6) >> 0;
            var _pos = _index - _id * 6;

            var array_colors_types = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
            ret.color.setColorId(array_colors_types[_id]);

            if (ret.Mods.Mods.length != 0)
                ret.Mods.Mods.splice(0, ret.Mods.Mods.length);

            var __mods = null;

            var _editor = window["Asc"]["editor"];
            if (_editor && _editor.wbModel)
            {
                var _theme = _editor.wbModel.theme;
                var _clrMap = _editor.wbModel.clrSchemeMap;

                if (_theme && _clrMap)
                {
                    var _schemeClr = new CSchemeColor();
                    _schemeClr.id = array_colors_types[_id];

                    var _rgba = {R:0, G:0, B:0, A:255};
                    _schemeClr.Calculate(_theme, _clrMap.color_map, _rgba);
					
					__mods = GetDefaultMods(_schemeClr.RGBA.R, _schemeClr.RGBA.G, _schemeClr.RGBA.B, _pos, 0);
                }
            }
			
			if (null != __mods)
			{
				for (var modInd = 0; modInd < __mods.length; modInd++)
					ret.addMod(_create_mod(__mods[modInd]));
			}

            break;
        }
        default:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_SRGB)
            {
                ret.setColor(new CRGBColor());
            }
            ret.color.setColor(((asc_color.asc_getR() << 16) & 0xFF0000) + ((asc_color.asc_getG() << 8) & 0xFF00) + asc_color.asc_getB());
            ret.clearMods();
        }
    }
    return ret;
}

function asc_CShapeFill() {
    this.type = null;
    this.fill = null;
    this.transparent = null;
}

asc_CShapeFill.prototype = {
    asc_getType: function() { return this.type; },
    asc_putType: function(v) { this.type = v; },
    asc_getFill: function() { return this.fill; },
    asc_putFill: function(v) { this.fill = v; },
    asc_getTransparent: function() { return this.transparent; },
    asc_putTransparent: function(v) { this.transparent = v; }
}

//{ asc_CShapeFill export
window["Asc"].asc_CShapeFill = asc_CShapeFill;
window["Asc"]["asc_CShapeFill"] = asc_CShapeFill;
prot = asc_CShapeFill.prototype;

prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;

prot["asc_getFill"] = prot.asc_getFill;
prot["asc_putFill"] = prot.asc_putFill;

prot["asc_getTransparent"] = prot.asc_getTransparent;
prot["asc_putTransparent"] = prot.asc_putTransparent;
//}

function asc_CFillBlip() {
    this.type = c_oAscFillBlipType.STRETCH;
    this.url = "";
    this.texture_id = null;
}

asc_CFillBlip.prototype = {
    asc_getType: function(){return this.type},
    asc_putType: function(v){this.type = v;},
    asc_getUrl: function(){return this.url;},
    asc_putUrl: function(v){this.url = v;},
    asc_getTextureId: function(){return this.texture_id;},
    asc_putTextureId: function(v){this.texture_id = v;}
}

//{ asc_CFillBlip export
window["Asc"].asc_CFillBlip = asc_CFillBlip;
window["Asc"]["asc_CFillBlip"] = asc_CFillBlip;
prot = asc_CFillBlip.prototype;

prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;

prot["asc_getUrl"] = prot.asc_getUrl;
prot["asc_putUrl"] = prot.asc_putUrl;

prot["asc_getTextureId"] = prot.asc_getTextureId;
prot["asc_putTextureId"] = prot.asc_putTextureId;
//}

function asc_CFillHatch() {
    this.PatternType = undefined;
    this.fgClr = undefined;
    this.bgClr = undefined;
}

asc_CFillHatch.prototype = {
    asc_getPatternType: function(){return this.PatternType;},
    asc_putPatternType: function(v){this.PatternType = v;},
    asc_getColorFg: function(){return this.fgClr;},
    asc_putColorFg: function(v){this.fgClr = v;},
    asc_getColorBg: function(){return this.bgClr;},
    asc_putColorBg: function(v){this.bgClr = v;}
}

//{ asc_CFillHatch export
window["Asc"].asc_CFillHatch = asc_CFillHatch;
window["Asc"]["asc_CFillHatch"] = asc_CFillHatch;
prot = asc_CFillHatch.prototype;

prot["asc_getPatternType"] = prot.asc_getPatternType;
prot["asc_putPatternType"] = prot.asc_putPatternType;

prot["asc_getColorFg"] = prot.asc_getColorFg;
prot["asc_putColorFg"] = prot.asc_putColorFg;

prot["asc_getColorBg"] = prot.asc_getColorBg;
prot["asc_putColorBg"] = prot.asc_putColorBg;
//}

function asc_CFillGrad() {
    this.Colors = undefined;
    this.Positions = undefined;
    this.GradType = 0;

    this.LinearAngle = undefined;
    this.LinearScale = true;

    this.PathType = 0;
}

asc_CFillGrad.prototype = {
    asc_getColors: function(){return this.Colors;},
    asc_putColors: function(v){this.Colors = v;},
    asc_getPositions: function(){return this.Positions;},
    asc_putPositions: function(v){this.Positions = v;},
    asc_getGradType: function(){return this.GradType;},
    asc_putGradType: function(v){this.GradType = v;},
    asc_getLinearAngle: function(){return this.LinearAngle;},
    asc_putLinearAngle: function(v){this.LinearAngle = v;},
    asc_getLinearScale: function(){return this.LinearScale;},
    asc_putLinearScale: function(v){this.LinearScale = v;},
    asc_getPathType: function(){return this.PathType;},
    asc_putPathType: function(v){this.PathType = v;}
}

//{ asc_CFillGrad export
window["Asc"].asc_CFillGrad = asc_CFillGrad;
window["Asc"]["asc_CFillGrad"] = asc_CFillGrad;
prot = asc_CFillGrad.prototype;

prot["asc_getColors"] = prot.asc_getColors;
prot["asc_putColors"] = prot.asc_putColors;
prot["asc_getPositions"] = prot.asc_getPositions;
prot["asc_putPositions"] = prot.asc_putPositions;
prot["asc_getGradType"] = prot.asc_getGradType;
prot["asc_putGradType"] = prot.asc_putGradType;
prot["asc_getLinearAngle"] = prot.asc_getLinearAngle;
prot["asc_putLinearAngle"] = prot.asc_putLinearAngle;
prot["asc_getLinearScale"] = prot.asc_getLinearScale;
prot["asc_putLinearScale"] = prot.asc_putLinearScale;
prot["asc_getPathType"] = prot.asc_getPathType;
prot["asc_putPathType"] = prot.asc_putPathType;
//}

function asc_CFillSolid() {
    this.color = new CAscColor();
}

asc_CFillSolid.prototype = {
    asc_getColor: function() { return this.color },
    asc_putColor: function(v) { this.color = v; }
}

//{ asc_CFillSolid export
window["Asc"].asc_CFillSolid = asc_CFillSolid;
window["Asc"]["asc_CFillSolid"] = asc_CFillSolid;
var prot = asc_CFillSolid.prototype;

prot["asc_getColor"] = prot.asc_getColor;
prot["asc_putColor"] = prot.asc_putColor;
//}

function CreateAscFillEx(unifill) {
    if (null == unifill || null == unifill.fill)
        return new asc_CShapeFill();

    var ret = new asc_CShapeFill();

    var _fill = unifill.fill;
    switch (_fill.type)
    {
        case FILL_TYPE_SOLID:
        {
            ret.type = c_oAscFill.FILL_TYPE_SOLID;
            ret.fill = new asc_CFillSolid();
            ret.fill.color = CreateAscColorEx(_fill.color);
            break;
        }
        case FILL_TYPE_PATT:
        {
            ret.type = c_oAscFill.FILL_TYPE_PATT;
            ret.fill = new asc_CFillHatch();
            ret.fill.PatternType = _fill.ftype;
            ret.fill.fgClr = CreateAscColorEx(_fill.fgClr);
            ret.fill.bgClr = CreateAscColorEx(_fill.bgClr);
            break;
        }
        case FILL_TYPE_GRAD:
        {
            ret.type = c_oAscFill.FILL_TYPE_GRAD;
            ret.fill = new asc_CFillGrad();

            for (var i = 0; i < _fill.colors.length; i++)
            {
                if (0 == i)
                {
                    ret.fill.Colors = [];
                    ret.fill.Positions = [];
                }

                ret.fill.Colors.push(CreateAscColorEx(_fill.colors[i].color));
                ret.fill.Positions.push(_fill.colors[i].pos);
            }

            if (_fill.lin)
            {
                ret.fill.GradType = c_oAscFillGradType.GRAD_LINEAR;
                ret.fill.LinearAngle = _fill.lin.angle;
                ret.fill.LinearScale = _fill.lin.scale;
            }
            else
            {
                ret.fill.GradType = c_oAscFillGradType.GRAD_PATH;
                ret.fill.PathType = 0;
            }

            break;
        }
        case FILL_TYPE_BLIP:
        {
            ret.type = c_oAscFill.FILL_TYPE_BLIP;
            ret.fill = new asc_CFillBlip();

            ret.fill.url = _fill.RasterImageId;
            ret.fill.type = (_fill.tile == null) ? c_oAscFillBlipType.STRETCH : c_oAscFillBlipType.TILE;
            break;
        }
        default:
            break;
    }

    ret.transparent = unifill.transparent;
    return ret;
}

function CorrectUniFillEx(asc_fill, unifill) {

    if (null == asc_fill)
        return unifill;

    var ret = unifill;
    if (null == ret)
        ret = new CUniFill();

    var _fill = asc_fill.asc_getFill();
    var _type = asc_fill.asc_getType();

    if (null != _type)
    {
        switch (_type)
        {
            case c_oAscFill.FILL_TYPE_NOFILL:
            {
                ret.setFill(new CNoFill());
                break;
            }
            case c_oAscFill.FILL_TYPE_BLIP:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_BLIP)
                {
                    ret.setFill(new CBlipFill());
                }

                var _url = _fill.asc_getUrl();
                var _tx_id = _fill.asc_getTextureId();
                if (null != _tx_id && (0 <= _tx_id) && (_tx_id < g_oUserTexturePresets.length))
                {
                    _url = g_oUserTexturePresets[_tx_id];
                }

                if (_url != null && _url !== undefined && _url != "")
                    ret.fill.setRasterImageId(_url);

                if (ret.fill.RasterImageId == null)
                    ret.fill.setRasterImageId("");

                var tile = _fill.asc_getType();
                if (tile == c_oAscFillBlipType.STRETCH)
                    ret.fill.setTile(null);
                else if (tile == c_oAscFillBlipType.TILE)
                    ret.fill.setTile(true);

                break;
            }
            case c_oAscFill.FILL_TYPE_PATT:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_PATT)
                {
                    ret.setFill(new CPattFill());
                }

                if (undefined != _fill.PatternType)
                {
                    ret.fill.setFType(_fill.PatternType);
                }
                if (undefined != _fill.fgClr)
                {
                    ret.fill.setFgColor(CorrectUniColorEx(_fill.asc_getColorFg(), ret.fill.fgClr));
                }
                if (undefined != _fill.bgClr)
                {
                    ret.fill.setBgColor(CorrectUniColorEx(_fill.asc_getColorBg(), ret.fill.bgClr));
                }

                break;
            }
            case c_oAscFill.FILL_TYPE_GRAD:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_GRAD)
                {
                    ret.setFill(new CGradFill());
                }

                var _colors     = _fill.asc_getColors();
                var _positions  = _fill.asc_getPositions();
                if (undefined != _colors && undefined != _positions)
                {
                    if (_colors.length == _positions.length)
                    {
                        ret.fill.colors.splice(0, ret.fill.colors.length);

                        for (var i = 0; i < _colors.length; i++)
                        {
                            var _gs = new CGs();
                            _gs.setColor(CorrectUniColorEx(_colors[i], _gs.color));
                            _gs.setPos(_positions[i]);

                            ret.fill.addGS(_gs);
                        }
                    }
                }
                else if (undefined != _colors)
                {
                    if (_colors.length == ret.fill.colors.length)
                    {
                        for (var i = 0; i < _colors.length; i++)
                        {
                            if(!(_colors[i].value == null && _colors[i].type ===c_oAscColor.COLOR_TYPE_SCHEME))
                                ret.fill.colors[i].setColor(CorrectUniColorEx(_colors[i], ret.fill.colors[i].color));
                        }
                    }
                }
                else if (undefined != _positions)
                {
                    if (_positions.length == ret.fill.colors.length)
                    {
                        for (var i = 0; i < _positions.length; i++)
                        {
                            ret.fill.colors[i].setPos(_positions[i]);
                        }
                    }
                }

                var _grad_type = _fill.asc_getGradType();

                if (c_oAscFillGradType.GRAD_LINEAR == _grad_type)
                {
                    var _angle = _fill.asc_getLinearAngle();
                    var _scale = _fill.asc_getLinearScale();

                    if (!ret.fill.lin)
                        ret.fill.setLin(new GradLin());

                    if (undefined != _angle)
                        ret.fill.lin.setAngle(_angle);
                    if (undefined != _scale)
                        ret.fill.lin.setScale(_scale);
                }
                else if (c_oAscFillGradType.GRAD_PATH == _grad_type)
                {
                    ret.fill.setLin(null);
                    ret.fill.setPath(new GradPath());
                }
                break;
            }
            default:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_SOLID)
                {
                    ret.setFill(new CSolidFill());
                }
                ret.fill.setColor(CorrectUniColorEx(_fill.asc_getColor(), ret.fill.color));
            }
        }
    }

    var _alpha = asc_fill.asc_getTransparent();
    if (null != _alpha)
        ret.setTransparent(_alpha);

    return ret;
}

function asc_CStroke() {
    this.type = null;
    this.width = null;
    this.color = null;

    this.LineJoin = null;
    this.LineCap = null;

    this.LineBeginStyle = null;
    this.LineBeginSize = null;

    this.LineEndStyle = null;
    this.LineEndSize = null;

    this.canChangeArrows = false;
}

asc_CStroke.prototype = {
    asc_getType: function(){return this.type;},
    asc_putType: function(v){this.type = v;},
    asc_getWidth: function(){return this.width;},
    asc_putWidth: function(v){this.width = v;},
    asc_getColor: function(){return this.color;},
    asc_putColor: function(v){this.color = v;},

    asc_getLinejoin: function(){return this.LineJoin;},
    asc_putLinejoin: function(v){this.LineJoin = v;},
    asc_getLinecap: function(){return this.LineCap;},
    asc_putLinecap: function(v){this.LineCap = v;},

    asc_getLinebeginstyle: function(){return this.LineBeginStyle;},
    asc_putLinebeginstyle: function(v){this.LineBeginStyle = v;},
    asc_getLinebeginsize: function(){return this.LineBeginSize;},
    asc_putLinebeginsize: function(v){this.LineBeginSize = v;},
    asc_getLineendstyle: function(){return this.LineEndStyle;},
    asc_putLineendstyle: function(v){this.LineEndStyle = v;},
    asc_getLineendsize: function(){return this.LineEndSize;},
    asc_putLineendsize: function(v){this.LineEndSize = v;},

    asc_getCanChangeArrows: function(){return this.canChangeArrows;}
}

//{ asc_CStroke export
window["Asc"].asc_CStroke = asc_CStroke;
window["Asc"]["asc_CStroke"] = asc_CStroke;
prot = asc_CStroke.prototype;

prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;
prot["asc_getWidth"] = prot.asc_getWidth;
prot["asc_putWidth"] = prot.asc_putWidth;
prot["asc_getColor"] = prot.asc_getColor;
prot["asc_putColor"] = prot.asc_putColor;

prot["asc_getLinejoin"] = prot.asc_getLinejoin;
prot["asc_putLinejoin"] = prot.asc_putLinejoin;
prot["asc_getLinecap"] = prot.asc_getLinecap;
prot["asc_putLinecap"] = prot.asc_putLinecap;

prot["asc_getLinebeginstyle"] = prot.asc_getLinebeginstyle;
prot["asc_putLinebeginstyle"] = prot.asc_putLinebeginstyle;
prot["asc_getLinebeginsize"] = prot.asc_getLinebeginsize;
prot["asc_putLinebeginsize"] = prot.asc_putLinebeginsize;
prot["asc_getLineendstyle"] = prot.asc_getLineendstyle;
prot["asc_putLineendstyle"] = prot.asc_putLineendstyle;
prot["asc_getLineendsize"] = prot.asc_getLineendsize;
prot["asc_putLineendsize"] = prot.asc_putLineendsize;

prot["asc_getCanChangeArrows"] = prot.asc_getCanChangeArrows;
//}

function CreateAscStrokeEx(ln, _canChangeArrows) {
    if (null == ln || null == ln.Fill || ln.Fill.fill == null)
        return new asc_CStroke();

    var ret = new asc_CStroke();

    var _fill = ln.Fill.fill;
    if(_fill != null)
    {
        switch (_fill.type)
        {
            case FILL_TYPE_BLIP:
            {
                break;
            }
            case FILL_TYPE_SOLID:
            {
                ret.color = CreateAscColorEx(_fill.color);
                ret.type = c_oAscStrokeType.STROKE_COLOR;
                break;
            }
            case FILL_TYPE_GRAD:
            {
                var _c = _fill.colors;
                if (_c != 0)
                {
                    ret.color = CreateAscColorEx(_fill.colors[0]);
                    ret.type = c_oAscStrokeType.STROKE_COLOR;
                }

                break;
            }
            case FILL_TYPE_PATT:
            {
                ret.color = CreateAscColorEx(_fill.fgClr);
                ret.type = c_oAscStrokeType.STROKE_COLOR;
                break;
            }
            case FILL_TYPE_NOFILL:
            {
                ret.color = null;
                ret.type = c_oAscStrokeType.STROKE_NONE;
                break;
            }
            default:
            {
                break;
            }
        }
    }


    ret.width = (ln.w == null) ? 12700 : (ln.w >> 0);
    ret.width /= 36000.0;

    if (ln.cap != null)
        ret.asc_putLinecap(ln.cap);

    if (ln.LineJoin != null)
        ret.asc_putLinejoin(ln.LineJoin.type);

    if (ln.headEnd != null)
    {
        ret.asc_putLinebeginstyle((ln.headEnd.type == null) ? LineEndType.None : ln.headEnd.type);

        var _len = (null == ln.headEnd.len) ? 1 : (2 - ln.headEnd.len);
        var _w = (null == ln.headEnd.w) ? 1 : (2 - ln.headEnd.w);

        ret.asc_putLinebeginsize(_w * 3 + _len);
    }
    else
    {
        ret.asc_putLinebeginstyle(LineEndType.None);
    }

    if (ln.tailEnd != null)
    {
        ret.asc_putLineendstyle((ln.tailEnd.type == null) ? LineEndType.None : ln.tailEnd.type);

        var _len = (null == ln.tailEnd.len) ? 1 : (2 - ln.tailEnd.len);
        var _w = (null == ln.tailEnd.w) ? 1 : (2 - ln.tailEnd.w);

        ret.asc_putLineendsize(_w * 3 + _len);
    }
    else
    {
        ret.asc_putLineendstyle(LineEndType.None);
    }

    if (true === _canChangeArrows)
        ret.canChangeArrows = true;

    return ret;
}

function CorrectUniStrokeEx(asc_stroke, unistroke) {
    if (null == asc_stroke)
        return unistroke;

    var ret = unistroke;
    if (null == ret)
        ret = new CLn();

    var _type = asc_stroke.asc_getType();
    var _w = asc_stroke.asc_getWidth();

    if (_w != null && _w !== undefined)
        ret.setW(_w * 36000.0);

    var _color = asc_stroke.asc_getColor();
    if (_type == c_oAscStrokeType.STROKE_NONE)
    {
        ret.setFill(new CUniFill());
        ret.Fill.setFill(new CNoFill());
    }
    else if (_type != null)
    {
        if (null != _color && undefined !== _color)
        {
            ret.setFill(new CUniFill());
            ret.Fill.setFill(new CSolidFill());
            ret.Fill.fill.setColor(CorrectUniColorEx(_color, ret.Fill.fill.color));
        }
    }

    var _join = asc_stroke.asc_getLinejoin();
    if (null != _join)
    {
        ret.LineJoin = new LineJoin();
        ret.LineJoin.type = _join;
    }

    var _cap = asc_stroke.asc_getLinecap();
    if (null != _cap)
    {
        ret.cap = _cap;
    }

    var _begin_style = asc_stroke.asc_getLinebeginstyle();
    if (null != _begin_style)
    {
        if (ret.headEnd == null)
            ret.headEnd = new EndArrow();

        ret.headEnd.type = _begin_style;
    }

    var _end_style = asc_stroke.asc_getLineendstyle();
    if (null != _end_style)
    {
        if (ret.tailEnd == null)
            ret.tailEnd = new EndArrow();

        ret.tailEnd.type = _end_style;
    }

    var _begin_size = asc_stroke.asc_getLinebeginsize();
    if (null != _begin_size)
    {
        if (ret.headEnd == null)
            ret.headEnd = new EndArrow();

        ret.headEnd.w = 2 - ((_begin_size/3) >> 0);
        ret.headEnd.len = 2 - (_begin_size % 3);
    }

    var _end_size = asc_stroke.asc_getLineendsize();
    if (null != _end_size)
    {
        if (ret.tailEnd == null)
            ret.tailEnd = new EndArrow();

        ret.tailEnd.w = 2 - ((_end_size/3) >> 0);
        ret.tailEnd.len = 2 - (_end_size % 3);
    }

    return ret;
}


function DeleteSelectedObjects(controller)
{
    var selected_objects = controller.selectedObjects;
    for(var i = selected_objects.length - 1; i > -1; --i)
    {
        selected_objects[i].deleteDrawingBase();
    }
    controller.resetSelection();
}


function CreateImageDrawingObject(imageUrl, options, drawingObjects) {

    var _this = drawingObjects;
    var  worksheet = drawingObjects.getWorksheet();
    if ( imageUrl && !_this.isViewerMode() ) {

        var _image =  asc["editor"].ImageLoader.LoadImage(imageUrl, 1);
        var isOption = options && options.cell;

        var calculateObjectMetrics = function (object, width, height) {
            // Обработка картинок большого разрешения
            var metricCoeff = 1;

            var coordsFrom = _this.coordsManager.calculateCoords(object.from);
            var realTopOffset = coordsFrom.y;
            var realLeftOffset = coordsFrom.x;

            var areaWidth = worksheet.getCellLeft(worksheet.getLastVisibleCol(), 0) - worksheet.getCellLeft(worksheet.getFirstVisibleCol(), 0); 	// по ширине
            if (areaWidth < width) {
                metricCoeff = width / areaWidth;

                width = areaWidth;
                height /= metricCoeff;
            }

            var areaHeight = worksheet.getCellTop(worksheet.getLastVisibleRow(), 0) - worksheet.getCellTop(worksheet.getFirstVisibleRow(), 0); 	// по высоте
            if (areaHeight < height) {
                metricCoeff = height / areaHeight;

                height = areaHeight;
                width /= metricCoeff;
            }

            var cellTo = _this.coordsManager.calculateCell(realLeftOffset + width, realTopOffset + height);
            object.to.col = cellTo.col;
            object.to.colOff = cellTo.colOff;
            object.to.row = cellTo.row;
            object.to.rowOff = cellTo.rowOff;

            worksheet.handlers.trigger("reinitializeScroll");
        }

        var addImageObject = function (_image) {

            if ( !_image.Image ) {
                worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
            }
            else {

                var drawingObject = _this.createDrawingObject();
                drawingObject.worksheet = worksheet;

                drawingObject.from.col = isOption ? options.cell.col : worksheet.getSelectedColumnIndex();
                drawingObject.from.row = isOption ? options.cell.row : worksheet.getSelectedRowIndex();

                // Проверяем начальные координаты при вставке
                while ( !worksheet.cols[drawingObject.from.col] ) {
                    worksheet.expandColsOnScroll(true);
                }
                worksheet.expandColsOnScroll(true); 	// для colOff

                while ( !worksheet.rows[drawingObject.from.row] ) {
                    worksheet.expandRowsOnScroll(true);
                }
                worksheet.expandRowsOnScroll(true); 	// для rowOff

                calculateObjectMetrics(drawingObject, isOption ? options.width : _image.Image.width, isOption ? options.height : _image.Image.height);

                var coordsFrom = _this.coordsManager.calculateCoords(drawingObject.from);
                var coordsTo = _this.coordsManager.calculateCoords(drawingObject.to);
                drawingObject.graphicObject = _this.controller.createImage(_image.src, drawingObjects.convertMetric(coordsFrom.x, 0, 3), drawingObjects.convertMetric(coordsFrom.y, 0, 3), drawingObjects.convertMetric(coordsTo.x - coordsFrom.x, 0, 3), drawingObjects.convertMetric(coordsTo.y - coordsFrom.y, 0, 3));
                drawingObject.graphicObject.setWorksheet(worksheet.model);
                // drawingObject.graphicObject.select(_this.controller);
                //drawingObject.graphicObject.setDrawingObjects(_this);
                //drawingObject.graphicObject.addToDrawingObjects();
                return drawingObject;
            }
        }
        if (null != _image)
        {
            return addImageObject(_image);
        }
    }
    return null;
}