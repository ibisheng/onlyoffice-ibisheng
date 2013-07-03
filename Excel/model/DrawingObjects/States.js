/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 7:30 PM
 * To change this template use File | Settings | File Templates.
 */

var STATES_ID_NULL = 0x00;
var STATES_ID_PRE_ROTATE = 0x01;
var STATES_ID_ROTATE = 0x02;
var STATES_ID_PRE_RESIZE = 0x03;
var STATES_ID_RESIZE = 0x04;
var STATES_ID_START_TRACK_NEW_SHAPE = 0x05;
var STATES_ID_BEGIN_TRACK_NEW_SHAPE = 0x06;
var STATES_ID_TRACK_NEW_SHAPE = 0x07;
var STATES_ID_PRE_MOVE = 0x08;
var STATES_ID_MOVE = 0x09;
var STATES_ID_PRE_CHANGE_ADJ = 0x10;
var STATES_ID_CHANGE_ADJ = 0x11;
var STATES_ID_GROUP = 0x12;
var STATES_ID_PRE_CHANGE_ADJ_IN_GROUP = 0x13;
var STATES_ID_CHANGE_ADJ_IN_GROUP = 0x14;
var STATES_ID_PRE_ROTATE_IN_GROUP = 0x15;
var STATES_ID_ROTATE_IN_GROUP = 0x16;
var STATES_ID_PRE_RESIZE_IN_GROUP = 0x17;
var STATES_ID_RESIZE_IN_GROUP = 0x18;
var STATES_ID_PRE_MOVE_IN_GROUP = 0x19;
var STATES_ID_MOVE_IN_GROUP = 0x20;



var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});

function NullState(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_NULL;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;

    this.onMouseDown = function(e, x, y)
    {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        if(selected_objects.length === 1)
        {
            var hit_to_adj = selected_objects[0].hitToAdjustment(x, y);
            if(hit_to_adj.hit)
            {
                if(selected_objects[0].canChangeAdjustments())
                {
                    if(hit_to_adj.adjPolarFlag === false)
                        this.drawingObjectsController.addPreTrackObject(new XYAdjustmentTrack(selected_objects[0], hit_to_adj.adjNum));
                    else
                        this.drawingObjectsController.addPreTrackObject(new PolarAdjustmentTrack(selected_objects[0], hit_to_adj.adjNum));
                    this.drawingObjectsController.changeCurrentState(new PreChangeAdjState(this.drawingObjectsController, this.drawingObjects));
                }
                return;
            }
        }

        for(var i = selected_objects.length - 1; i > -1; --i)
        {
            var hit_to_handles = selected_objects[i].hitToHandles(x, y);
            if(hit_to_handles > -1)
            {
                if(hit_to_handles === 8)
                {
                    if(!selected_objects[i].canRotate())
                        return;

                    this.drawingObjectsController.clearPreTrackObjects();
                    for(var j = 0; j < selected_objects.length; ++j)
                    {
                        if(selected_objects[j].canRotate())
                        {
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createRotateTrack());
                        }
                    }
                    this.drawingObjectsController.changeCurrentState(new PreRotateState(this.drawingObjectsController, this.drawingObjects, selected_objects[i]));
                }
                else
                {
                    if(!selected_objects[i].canResize())
                        return;
                    this.drawingObjectsController.clearPreTrackObjects();
                    var card_direction = selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    for(var j = 0; j < selected_objects.length; ++j)
                    {
                        if(selected_objects[j].canResize())
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createResizeTrack(card_direction));
                    }
                    this.drawingObjectsController.changeCurrentState(new PreResizeState(this.drawingObjectsController, this.drawingObjects, selected_objects[i], card_direction))
                }
                return;
            }
        }

        for(i = selected_objects.length - 1; i > -1; --i)
        {
            if(selected_objects[i].hitInBoundingRect(x, y))
            {
                if(!selected_objects[i].canMove())
                    return;
                for(var j = 0; j < selected_objects.length; ++j)
                {
                    this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                }
                this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects, x, y, e.shiftKey, e.ctrl, selected_objects[i], true, false));
                return;
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
                        var is_selected = cur_drawing.selected;
                        if(!(e.ctrlKey || e.shiftKey) && !is_selected)
                            this.drawingObjectsController.resetSelection();
                        cur_drawing.select(this.drawingObjectsController);
                        this.drawingObjects.selectGraphicObject();
                        for(var j = 0; j < selected_objects.length; ++j)
                        {
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                        }
                        this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.shiftKey, e.ctrl, cur_drawing, is_selected, true));
                        return;
                    }
                    else if(hit_in_text_rect)
                    {
                        //TODO
                    }
                }
                else
                {
                    var grouped_objects = cur_drawing.getArrGraphicObjects();
                    for(var j = grouped_objects.length - 1; j > -1; --j)
                    {
                        var cur_grouped_object = grouped_objects[j];
                        var hit_in_inner_area = cur_grouped_object.hitInInnerArea(x, y);
                        var hit_in_path = cur_grouped_object.hitInPath(x, y);
                        var hit_in_text_rect = cur_grouped_object.hitInTextRect(x, y);
                        if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                        {
                            var is_selected = cur_drawing.selected;
                            if(!(e.ctrlKey || e.shiftKey))
                                this.drawingObjectsController.resetSelection();
                            cur_drawing.select(this.drawingObjectsController);
                            this.drawingObjects.selectGraphicObject();
                            for(var j = 0; j < selected_objects.length; ++j)
                            {
                                this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                            }
                            this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.shiftKey, e.ctrl, cur_drawing, is_selected, true));
                            return;
                        }
                        else if(hit_in_text_rect)
                        {
                            //TODO
                        }
                    }
                }
            }
        }
        this.drawingObjectsController.resetSelection();
    };

    this.onMouseMove = function(e, x, y)
    {};

    this.onMouseUp = function(e, x, y)
    {
	};

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
}

function PreRotateState(drawingObjectsController, drawingObjects, majorObject)
{
    this.id = STATES_ID_PRE_ROTATE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;

    this.onMouseDown = function(e, x, y)
    {
    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new RotateState(this.drawingObjectsController, this.drawingObjects, this.majorObject));
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
}


function RotateState(drawingObjectsController, drawingObjects, majorObject)
{
    this.id = STATES_ID_ROTATE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;

    this.onMouseDown = function(e, x, y)
    {};

    this.onMouseMove = function(e, x, y)
    {
        var angle = this.majorObject.getRotateAngle(x, y);
        this.drawingObjectsController.rotateTrackObjects(angle, e);
        this.drawingObjects.selectGraphicObject();
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
		asc.editor.asc_endAddShape();
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
}

function PreResizeState(drawingObjectsController, drawingObjects, majorObject, cardDirection)
{
    this.id = STATES_ID_PRE_RESIZE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.cardDirection = cardDirection;

    this.onMouseDown = function(e, x, y)
    {};

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new ResizeState(this.drawingObjectsController, this.drawingObjects, this.majorObject, this.cardDirection))
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
}

function ResizeState(drawingObjectsController, drawingObjects, majorObject, cardDirection)
{
    this.id = STATES_ID_RESIZE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.handleNum = this.majorObject.getNumByCardDirection(cardDirection);

    this.onMouseDown = function(e, x, y)
    {};

    this.onMouseMove = function(e, x, y)
    {
        var resize_coefficients = this.majorObject.getResizeCoefficients(this.handleNum, x, y);
        this.drawingObjectsController.trackResizeObjects(resize_coefficients.kd1, resize_coefficients.kd2, e);
        this.drawingObjects.selectGraphicObject();
        this.drawingObjects.showOverlayGraphicObjects();

    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        asc.editor.asc_endAddShape();
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
}

function StartTrackNewShapeState(drawingObjectsController, drawingObjects, presetGeom)
{
    this.id = STATES_ID_START_TRACK_NEW_SHAPE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.presetGeom = presetGeom;

    this.onMouseDown = function(e, x, y)
    {
        this.drawingObjectsController.changeCurrentState(new BeginTrackNewShapeState(this.drawingObjectsController, this.drawingObjects, this.presetGeom, x, y));
    };

    this.onMouseMove = function(e, x, y)
    {
    };

    this.onMouseUp = function(e, x, y)
    {
        //TODO
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
}

function BeginTrackNewShapeState(drawingObjectsController, drawingObjects, presetGeom, startX, startY)
{
    this.id = STATES_ID_BEGIN_TRACK_NEW_SHAPE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.presetGeom = presetGeom;
    this.startX = startX;
    this.startY = startY;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.addTrackObject(new NewShapeTrack(this.drawingObjects, this.presetGeom, this.startX, this.startY));
        this.drawingObjectsController.trackNewShape(e, x, y);
        this.drawingObjectsController.changeCurrentState(new TrackNewShapeState(this.drawingObjectsController, this.drawingObjects));

    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
}

function TrackNewShapeState(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_TRACK_NEW_SHAPE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.trackNewShape(e, x, y);
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        asc.editor.asc_endAddShape();
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
}

function PreMoveState(drawingObjectsController, drawingObjects, startX, startY, shift, ctrl, majorObject, majorObjectIsSelected, bInside)
{
    this.id = STATES_ID_PRE_MOVE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.shift = shift;
    this.ctrl = ctrl;
    this.majorObject = majorObject;
    this.majorObjectIsSelected = majorObjectIsSelected;
    this.bInside = bInside;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        var track_objects = this.drawingObjectsController.getTrackObjects();
        var max_x, min_x, max_y, min_y;
        var cur_rect_bounds = track_objects[0].getOriginalBoundsRect();
        max_x = cur_rect_bounds.maxX;
        min_x = cur_rect_bounds.minX;
        max_y = cur_rect_bounds.maxY;
        min_y = cur_rect_bounds.minY;
        for(var i = 0; i < track_objects.length; ++i)
        {
            cur_rect_bounds = track_objects[i].getOriginalBoundsRect();
            if(max_x < cur_rect_bounds.maxX)
                max_x = cur_rect_bounds.maxX;
            if(min_x > cur_rect_bounds.minX)
                min_x = cur_rect_bounds.minX;
            if(max_y < cur_rect_bounds.maxY)
                max_y = cur_rect_bounds.maxY;
            if(min_y > cur_rect_bounds.minY)
                min_y = cur_rect_bounds.minY;
        }
        this.drawingObjectsController.changeCurrentState(new MoveState(this.drawingObjectsController, this.drawingObjects, this.startX, this.startY, min_x, min_y, max_x - min_x, max_y - min_y));
    };

    this.onMouseUp = function(e, x, y)
    {

        this.drawingObjectsController.clearPreTrackObjects();
        if(!(this.majorObject.isGroup() && this.bInside))
        {
            if(this.shift || this.ctrl)
            {
                if(this.majorObjectIsSelected)
                    this.majorObject.deselect(this.drawingObjectsController);
            }
        }
        else
        {
            if(this.majorObjectIsSelected)
            {
                this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.majorObject));
                this.drawingObjectsController.onMouseDown(e, x, y);
                this.drawingObjectsController.onMouseUp(e, x, y);
                return;
            }
        }
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
}

function MoveState(drawingObjectsController, drawingObjects, startX, startY, rectX, rectY, rectW, rectH)
{
    this.id = STATES_ID_MOVE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.rectX = rectX;
    this.rectY = rectY;
    this.rectW = rectW;
    this.rectH = rectH;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        var dx = x - this.startX;
        var dy = y - this.startY;
        var check_position = this.drawingObjects.checkGraphicObjectPosition(this.rectX + dx, this.rectY + dy, this.rectW, this.rectH);
        this.drawingObjectsController.trackMoveObjects(dx + check_position.x, dy + check_position.y);
        this.drawingObjects.selectGraphicObject();
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
		asc.editor.asc_endAddShape();
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
}


function PreChangeAdjState(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_PRE_CHANGE_ADJ;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.trackAdjObject(x, y);
        this.drawingObjectsController.changeCurrentState(new ChangeAdjState(this.drawingObjectsController, this.drawingObjects))
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
}

function ChangeAdjState(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_CHANGE_ADJ;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.trackAdjObject(x, y);
        this.drawingObjects.selectGraphicObject();
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.selectGraphicObject();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
}


function GroupState(drawingObjectsController, drawingObjects, group)
{
    this.id = STATES_ID_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;

    this.onMouseDown = function(e, x, y)
    {
        var group_selected_objects = this.group.selectedObjects;
        if(group_selected_objects.length === 1)
        {
            var hit_to_adj = group_selected_objects[0].hitToAdjustment(x, y);
            if(hit_to_adj.hit)
            {
                if(group_selected_objects[0].canChangeAdjustments())
                {
                    if(hit_to_adj.adjPolarFlag === false)
                        this.drawingObjectsController.addPreTrackObject(new XYAdjustmentTrack(group_selected_objects[0], hit_to_adj.adjNum));
                    else
                        this.drawingObjectsController.addPreTrackObject(new PolarAdjustmentTrack(group_selected_objects[0], hit_to_adj.adjNum));
                    this.drawingObjectsController.changeCurrentState(new PreChangeAdjInGroupState(this.drawingObjectsController, this.drawingObjects, this.group));
                }
                return;
            }
        }
        for(var i = group_selected_objects.length - 1; i  > -1; --i)
        {
            var hit_to_handles = group_selected_objects[i].hitToHandles(x, y);
            if(hit_to_handles > -1)
            {
                if(hit_to_handles === 8)
                {
                    if(!group_selected_objects[i].canRotate())
                        return;
                    for(var j = 0; j < group_selected_objects.length; ++j)
                    {
                        this.drawingObjectsController.addPreTrackObject(group_selected_objects[j].createRotateInGroupTrack())
                    }
                    this.drawingObjectsController.changeCurrentState(new PreRotateInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, group_selected_objects[i]));
                }
                else
                {
                    if(!group_selected_objects[i].canResize())
                        return;
                    for(var j = 0; j < group_selected_objects.length; ++j)
                    {
                        this.drawingObjectsController.addPreTrackObject(group_selected_objects[j].createResizeInGroupTrack(CARD_DIRECTION_E))
                    }
                    this.drawingObjectsController.changeCurrentState(new PreRotateInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, group_selected_objects[i]));
                }
                return;
            }
            for(i = group_selected_objects.length - 1; i > -1; --i)
            {
                if(group_selected_objects[i].hitInBoundingRect(x, y))
                {
                    if(!group_selected_objects[i].canMove())
                        return;
                    for(var j = 0; j < group_selected_objects.length; ++j)
                    {
                        this.drawingObjectsController.addPreTrackObject(group_selected_objects[j].createMoveInGroupTrack());
                    }
                    this.drawingObjectsController.changeCurrentState(new PreMoveInGroupState(this.drawingObjectsController, this.group, this.drawingObjects, x, y, e.shiftKey, e.ctrl, group_selected_objects[i], true));
                    return;
                }
            }
        }

        for(i = group_selected_objects.length - 1; i  > -1; --i)
        {

        }
    };

    this.onMouseMove = function(e, x, y)
    {};

    this.onMouseUp = function(e, x, y)
    {};

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };
}


function PreMoveInGroupState(drawingObjectsController, drawingObjects, group, startX, startY, shiftKey, ctrlKey, majorObject,  majorObjectIsSelected)
{
    this.id = STATES_ID_PRE_MOVE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.trackAdjObject(x, y);
        this.drawingObjectsController.changeCurrentState(new ChangeAdjInGroupState(this.drawingObjectsController, this.drawingObjects, this.group))
    };

    this.onMouseUp = function(e, x, y)
    {};

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };
}

function MoveInGroupState(drawingObjectsController, drawingObjects, group)
{
    this.id = STATES_ID_MOVE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
    };

    this.onMouseUp = function(e, x, y)
    {
       // this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };
}

function PreChangeAdjInGroupState(drawingObjectsController, drawingObjects, group)
{
    this.id = STATES_ID_PRE_CHANGE_ADJ_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.trackAdjObject(x, y);
        this.drawingObjectsController.changeCurrentState(new ChangeAdjInGroupState(this.drawingObjectsController, this.drawingObjects, this.group))
    };

    this.onMouseUp = function(e, x, y)
    {};

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };
}

function ChangeAdjInGroupState(drawingObjectsController, drawingObjects, group)
{
    this.id = STATES_ID_CHANGE_ADJ_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.trackAdjObject(x, y);
        this.drawingObjects.showOverlayGraphicObjects();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };
}

function PreRotateInGroupState(drawingObjectsController, drawingObjects, group, majorObject)
{
    this.id = STATES_ID_PRE_ROTATE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new RotateInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, this.majorObject))
    };

    this.onMouseUp = function(e, x, y)
    {};

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };
}

function RotateInGroupState(drawingObjectsController, drawingObjects, group, majorObject)
{
    this.id = STATES_ID_ROTATE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.onMouseDown = function(e, x, y)
    {};

    this.onMouseMove = function(e, x, y)
    {
    };

    this.onMouseUp = function(e, x, y)
    {
       // this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };
}


function PreResizeInGroupState(drawingObjectsController, drawingObjects, group, majorObject)
{
    this.id = STATES_ID_PRE_RESIZE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new RotateInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, this.majorObject))
    };

    this.onMouseUp = function(e, x, y)
    {};

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };
}

function ResizeInGroupState(drawingObjectsController, drawingObjects, group, majorObject)
{
    this.id = STATES_ID_RESIZE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.onMouseDown = function(e, x, y)
    {};

    this.onMouseMove = function(e, x, y)
    {
    };

    this.onMouseUp = function(e, x, y)
    {
        // this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };
}


function DrawDefaultSelection(drawingObjectsController, drawingDocument)
{
    var selected_objects = drawingObjectsController.selectedObjects;
    for(var i = 0; i < selected_objects.length; ++i)
    {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, selected_objects[i].getTransform(), 0, 0, selected_objects[i].extX, selected_objects[i].extY, false/*, selected_objects[i].canRotate()TODO*/);
    }
    if(selected_objects.length === 1)
    {
        selected_objects[0].drawAdjustments(drawingDocument);
    }
}

function DrawGroupSelection(group, drawingDocument)
{
    drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, group.getTransform(), 0, 0, group.extX, group.extY, false/*, selected_objects[i].canRotate()TODO*/);
    var group_selected_objects = group.selectedObjects;
    for(var i = 0; i < group_selected_objects.length; ++i)
    {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, group_selected_objects[i].getTransform(), 0, 0, group_selected_objects[i].extX, group_selected_objects[i].extY, false/*, selected_objects[i].canRotate()TODO*/)
    }
}






