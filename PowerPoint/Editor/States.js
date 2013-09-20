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
var STATES_ID_SPLINE_BEZIER = 0x21;
var STATES_ID_SPLINE_BEZIER33 = 0x22;
var STATES_ID_SPLINE_BEZIER2 = 0x23;
var STATES_ID_SPLINE_BEZIER3 = 0x24;
var STATES_ID_SPLINE_BEZIER4 = 0x25;
var STATES_ID_SPLINE_BEZIER5 = 0x26;
var STATES_ID_POLY_LINE_ADD = 0x27;
var STATES_ID_POLY_LINE_ADD2 = 0x28;
var STATES_ID_ADD_PPOLY_LINE2 = 0x29;
var STATES_ID_ADD_PPOLY_LINE22 = 0x30;
var STATES_ID_ADD_PPOLY_LINE23 = 0x31;
var STATES_ID_TEXT_ADD = 0x32;
var STATES_ID_PRE_MOVE_INTERNAL_CHART_OBJECT = 0x33;
var STATES_ID_MOVE_INTERNAL_CHART_OBJECT = 0x34;
var STATES_ID_CHART = 0x35;
var STATES_ID_CHART_TEXT_ADD = 0x36;
var STATES_ID_TEXT_ADD_IN_GROUP = 0x37;
var STATES_ID_PRE_MOVE_COMMENT = 0x38;
var STATES_ID_MOVE_COMMENT = 0x39;


function NullState(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_NULL;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;

    this.onMouseDown = function(e, x, y)
    {
        for(var i = drawingObjects.comments.length - 1; i > -1; --i)
        {
            if(drawingObjects.comments[i].hit(x, y))
            {
                this.drawingObjectsController.changeCurrentState(new PreMoveCommentState(this.drawingObjectsController, this.drawingObjects, x, y));
                return;
            }
        }
        this.drawingObjectsController.hideComment();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        if(selected_objects.length === 1)
        {
            var hit_to_adj = selected_objects[0].hitToAdjustment(x, y);
            if(hit_to_adj.hit)
            {
                if(selected_objects[0].canChangeAdjustments())
                {
                    this.drawingObjectsController.clearPreTrackObjects();
                    if(hit_to_adj.adjPolarFlag === false)
                        this.drawingObjectsController.addPreTrackObject(new XYAdjustmentTrack(selected_objects[0], hit_to_adj.adjNum));
                    else
                        this.drawingObjectsController.addPreTrackObject(new PolarAdjustmentTrack(selected_objects[0], hit_to_adj.adjNum));
                    this.drawingObjectsController.changeCurrentState(new PreChangeAdjState(this.drawingObjectsController, this.drawingObjects, selected_objects[0]));
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
                this.drawingObjectsController.clearPreTrackObjects();
                for(var j = 0; j < selected_objects.length; ++j)
                {
                    this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                }
                this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects, x, y, e.ShiftKey, e.ctrl, selected_objects[i], true, false));
                return;
            }
        }

        var arr_drawing_objects = this.drawingObjects.getDrawingObjects();
        for(i = arr_drawing_objects.length-1; i > -1; --i)
        {
            var cur_drawing_base = arr_drawing_objects[i];
            var cur_drawing = cur_drawing_base;
            if(cur_drawing.isShape() || cur_drawing.isImage())
            {
                var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                var hit_in_path = cur_drawing.hitInPath(x, y);
                var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                {
                    this.drawingObjectsController.clearPreTrackObjects();
                    var is_selected = cur_drawing.selected;
                    if(!(e.CtrlKey || e.ShiftKey) && !is_selected)
                        this.drawingObjectsController.resetSelection();
                    cur_drawing.select(this.drawingObjectsController);
                    this.drawingObjects.OnUpdateOverlay();
                    for(var j = 0; j < selected_objects.length; ++j)
                    {
                        this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                    }
                    this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.ShiftKey, e.ctrl, cur_drawing, is_selected, true));
                    return;
                }
                else if(hit_in_text_rect)
                {
                    if(e.Button !== g_mouse_button_right || this.drawingObjectsController.State === this || (this.drawingObjectsController.State.textObject !== cur_drawing))
                    {
                        this.drawingObjectsController.resetSelection();
                        cur_drawing.select(this.drawingObjectsController);
                        cur_drawing.selectionSetStart(e, x, y);
                        this.drawingObjectsController.changeCurrentState(new TextAddState(this.drawingObjectsController, this.drawingObjects, cur_drawing));
                        if(e.ClickCount < 2)
                            this.drawingObjectsController.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
                    }
                    else
                    {
                        if(e.Button === g_mouse_button_right && this.drawingObjectsController.State.textObject && this.drawingObjectsController.State.textObject === cur_drawing && !(cur_drawing.pointInSelectedText(x, y)))
                        {
                            this.drawingObjectsController.resetSelection();
                            cur_drawing.select(this.drawingObjectsController);
                            cur_drawing.selectionSetStart(e, x, y);
                            this.drawingObjectsController.changeCurrentState(new TextAddState(this.drawingObjectsController, this.drawingObjects, cur_drawing));
                            if(e.ClickCount < 2)
                                this.drawingObjectsController.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
                        }
                    }
                    return;
                }
            }
            else if(cur_drawing.isGroup())
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
                        this.drawingObjectsController.clearPreTrackObjects();
                        var is_selected = cur_drawing.selected;
                        if(!(e.CtrlKey || e.ShiftKey))
                            this.drawingObjectsController.resetSelection();
                        cur_drawing.select(this.drawingObjectsController);
                        this.drawingObjects.OnUpdateOverlay();
                        for(var j = 0; j < selected_objects.length; ++j)
                        {
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                        }
                        this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.ShiftKey, e.ctrl, cur_drawing, is_selected, true));
                        return;
                    }
                    else if(hit_in_text_rect)
                    {
                        this.drawingObjectsController.resetSelection();
                        cur_grouped_object.select(this.drawingObjectsController);
                        grouped_objects[j].select(cur_grouped_object);
                        grouped_objects[j].selectionSetStart(e, x, y);
                        this.drawingObjectsController.changeCurrentState(new TextAddInGroup(this.drawingObjectsController, this.drawingObjects, cur_drawing, grouped_objects[j]));
                        if(e.ClickCount < 2)
                            grouped_objects[j].updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
                        return;
                    }
                }
            }
            else if(cur_drawing.isChart())
            {
                if(cur_drawing.hitInWorkArea(x, y))
                {

                    if(!e.ShiftKey && !e.CtrlKey)
                    {
                        var object_for_move_in_chart = null;
                        if(isRealObject(cur_drawing.chartTitle))
                        {
                            if(cur_drawing.chartTitle.hit(x, y))
                            {
                                object_for_move_in_chart = cur_drawing.chartTitle;
                            }
                        }

                        if(isRealObject(cur_drawing.hAxisTitle) && !isRealObject(object_for_move_in_chart))
                        {
                            if(cur_drawing.hAxisTitle.hit(x, y))
                            {
                                object_for_move_in_chart = cur_drawing.hAxisTitle;
                            }
                        }

                        if(isRealObject(cur_drawing.vAxisTitle) && !isRealObject(object_for_move_in_chart))
                        {
                            if(cur_drawing.vAxisTitle.hit(x, y))
                            {
                                object_for_move_in_chart = cur_drawing.vAxisTitle;
                            }
                        }
                        if(isRealObject(object_for_move_in_chart))
                        {
                            this.drawingObjectsController.resetSelection();
                            cur_drawing.select(this.drawingObjectsController);
                            object_for_move_in_chart.select();
                            this.drawingObjectsController.clearPreTrackObjects();
                            this.drawingObjectsController.addPreTrackObject(new MoveTitleInChart(object_for_move_in_chart));
                            this.drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectState(this.drawingObjectsController, this.drawingObjects, x, y, object_for_move_in_chart));
                            this.drawingObjects.OnUpdateOverlay();
                            return;
                        }
                        this.drawingObjectsController.clearPreTrackObjects();
                        var is_selected = cur_drawing.selected;
                        if(!(e.CtrlKey || e.ShiftKey) && !is_selected)
                            this.drawingObjectsController.resetSelection();
                        cur_drawing.select(this.drawingObjectsController);
                        this.drawingObjects.OnUpdateOverlay();
                        for(var j = 0; j < selected_objects.length; ++j)
                        {
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                        }
                        this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.ShiftKey, e.ctrl, cur_drawing, is_selected, true));
                        return;
                    }



                }
            }
            else if(cur_drawing.isTable && cur_drawing.isTable())
            {
                var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                var hit_in_bounding_rect = cur_drawing.hitInBoundingRect(x, y);
                if(hit_in_bounding_rect || hit_in_inner_area)
                {
                    if(e.CtrlKey && this.drawingObjectsController.selectedObjects.length > 0)
                    {
                        var b_selected = cur_drawing.selected;
                        cur_drawing.select(this.drawingObjectsController);
                        for(var j = 0; j < this.drawingObjectsController.selectedObjects.length; ++j)
                        {
                            this.drawingObjectsController.addPreTrackObject(this.drawingObjectsController.selectedObjects[j].createMoveTrack());
                        }
                        this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects, x, y, e.ShiftKey, e.CtrlKey, cur_drawing, b_selected, true));
                        this.drawingObjects.OnUpdateOverlay();
                        return;
                    }
                    else
                    {
                        this.drawingObjectsController.resetSelection();
                        cur_drawing.select(this.drawingObjectsController);
                        cur_drawing.selectionSetStart(e, x, y);
                        this.drawingObjectsController.changeCurrentState(new TextAddState(this.drawingObjectsController, this.drawingObjects, cur_drawing));
                        this.drawingObjects.presentation.Document_UpdateSelectionState();
                        this.drawingObjects.OnUpdateOverlay();
                        return;

                    }
                }

            }
        }
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjects.OnUpdateOverlay();
        editor.sync_BeginCatchSelectedElements();
        editor.sync_slidePropCallback(drawingObjects);
        editor.sync_EndCatchSelectedElements();
    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.Update_CursorType(x, y, e);
    };

    this.onMouseUp = function(e, x, y)
    {};

    this.onKeyDown = function(e)
    {
        return  DefaultKeyDownHandle(this.drawingObjectsController, e);
        var b_prevent_default = false;

        var selected_objects = this.drawingObjectsController.selectedObjects;
        switch (e.keyCode)
        {
            case 9:		// Tab (селект объектов)
            {
                /*var aObjects = this.drawingObjectsController.drawingObjects.getDrawingObjects();

                 if ( aObjects.length > 1 ) {
                 var lastSelectedId = selected_objects[selected_objects.length - 1].Id;
                 this.drawingObjectsController.resetSelectionState();

                 for (var i = 0; i < aObjects.length; i++) {
                 if ( aObjects[i].graphicObject.Id == lastSelectedId ) {

                 var index = i;
                 if ( e.ShiftKey ) 	// назад
                 index = (i > 0) ? i - 1 : aObjects.length - 1;
                 else
                 index = (i < aObjects.length - 1) ? i + 1 : 0;

                 aObjects[index].graphicObject.select(this.drawingObjectsController);
                 this.drawingObjectsController.drawingObjects.showDrawingObjects(true);
                 break;
                 }
                 }
                 } */
                var a_drawing_bases = this.drawingObjects.getDrawingObjects();
                if(!e.ShiftKey)
                {
                    var last_selected = null, last_selected_index = null;
                    for(var i = a_drawing_bases.length - 1;  i > -1; --i)
                    {
                        if(a_drawing_bases[i].graphicObject.selected)
                        {
                            last_selected = a_drawing_bases[i].graphicObject;
                            last_selected_index = i;
                            break;
                        }
                    }
                    if(isRealObject(last_selected))
                    {
                        b_prevent_default = true;
                        this.drawingObjectsController.resetSelection();
                        if(!last_selected.isGroup() || last_selected.arrGraphicObjects.length === 0)
                        {
                            if(last_selected_index < a_drawing_bases.length - 1)
                            {
                                a_drawing_bases[last_selected_index+1].graphicObject.select(this.drawingObjectsController);
                            }
                            else
                            {
                                a_drawing_bases[0].graphicObject.select(this.drawingObjectsController);
                            }
                        }
                        else
                        {
                            last_selected.select(this.drawingObjectsController);
                            last_selected.arrGraphicObjects[0].select(last_selected);
                            this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, last_selected));
                        }
                    }
                }
                else
                {
                    var first_selected = null, first_selected_index = null;
                    for(var i = 0; i < a_drawing_bases.length; ++i)
                    {
                        if(a_drawing_bases[i].graphicObject.selected)
                        {
                            first_selected = a_drawing_bases[i].graphicObject;
                            first_selected_index = i;
                            break;
                        }
                    }
                    if(isRealObject(first_selected))
                    {
                        b_prevent_default = true;
                        this.drawingObjectsController.resetSelection();
                        if(!first_selected.isGroup() || first_selected.arrGraphicObjects.length === 0)
                        {
                            if(first_selected_index > 0)
                            {
                                a_drawing_bases[first_selected_index - 1].graphicObject.select(this.drawingObjectsController);
                            }
                            else
                            {
                                a_drawing_bases[a_drawing_bases.length - 1].graphicObject.select(this.drawingObjectsController);
                            }
                        }
                        else
                        {
                            first_selected.select(this.drawingObjectsController);
                            first_selected.arrGraphicObjects[first_selected.arrGraphicObjects.length - 1].select(first_selected);
                            this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, first_selected));
                        }
                    }
                }
                this.drawingObjects.OnUpdateOverlay();
                break;
            }
            case 46:// Backspace
            case 8:	// Delete
            {
                History.Create_NewPoint();
                DeleteSelectedObjects(this.drawingObjectsController);
                this.drawingObjects.showDrawingObjects(true);
                b_prevent_default = true;
            }
        }
        if(b_prevent_default)
            e.preventDefault();
    };

    this.onKeyPress = function(e)
    {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        if(selected_objects.length === 1 && selected_objects[0].isShape())
        {
            if(isRealNumber(e.charCode))
            {
                selected_objects[0].paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
                this.drawingObjectsController.changeCurrentState(new TextAddState(this.drawingObjectsController, this.drawingObjects, selected_objects[0]));
                this.drawingObjects.showDrawingObjects(true);
                this.drawingObjects.OnUpdateOverlay();
            }
        }

    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        if(selected_objects.length === 1)
        {
            var hit_to_adj = selected_objects[0].hitToAdjustment(x, y);
            if(hit_to_adj.hit)
            {
                if(selected_objects[0].canChangeAdjustments())
                {
                    return {objectId: selected_objects[0].Id, cursorType: "crosshair"};
                }
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
                        return null;
                    return {objectId: selected_objects[i].Id, cursorType: "crosshair"};
                }
                else
                {
                    if(!selected_objects[i].canResize())
                        return null;
                    var card_direction = selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    return {objectId: selected_objects[i].Id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]};
                }
            }
        }

        for(i = selected_objects.length - 1; i > -1; --i)
        {
            if(selected_objects[i].hitInBoundingRect(x, y))
            {
                if(!selected_objects[i].canMove())
                    return null;
                return {objectId: selected_objects[i].Id, cursorType: "move"};
            }
        }

        var arr_drawing_objects = this.drawingObjects.getDrawingObjects();
        for(i = arr_drawing_objects.length-1; i > -1; --i)
        {
            var cur_drawing_base = arr_drawing_objects[i];
            if(cur_drawing_base.isGraphicObject())
            {
                var cur_drawing = cur_drawing_base.graphicObject;
                if(cur_drawing.isShape() || cur_drawing.isImage())
                {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                    {
                        return {objectId: cur_drawing.Id, cursorType: "move"};
                    }
                    else if(hit_in_text_rect)
                    {
                        return {objectId: cur_drawing.Id, cursorType: "move"};
                    }
                }
                else if(cur_drawing.isGroup())
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
                            return {objectId: cur_drawing.Id, cursorType: "move"};
                        }
                        else if(hit_in_text_rect)
                        {
                            return {objectId: cur_drawing.Id, cursorType: "text"};
                        }
                    }
                }
                else if(cur_drawing.isChart())
                {
                    if(cur_drawing.hitInWorkArea(x, y))
                    {
                        return {objectId: cur_drawing.Id, cursorType:"move"};
                    }
                }
            }
        }
        return null;
    };

    this.setCellBackgroundColor = function (color) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof selected_objects[i].setCellBackgroundColor === "function")
                selected_objects[i].setCellBackgroundColor(color);

        }
        this.drawingObjects.showDrawingObjects(true);
    };

    // Уменьшение размера шрифта
    this.setCellFontName = function (fontName)
    {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].setCellAllFontName === "function")
            {
                selected_objects[i].setCellAllFontName(fontName);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };

    // Уменьшение размера шрифта
    this.setCellFontSize = function (fontSize) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].setCellAllFontSize === "function")
            {
                selected_objects[i].setCellAllFontSize(fontSize);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };

    // Уменьшение размера шрифта
    this.setCellBold = function (isBold) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].setCellAllBold === "function")
            {
                selected_objects[i].setCellAllBold(isBold);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };

    // Уменьшение размера шрифта
    this.setCellItalic = function (isItalic) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].setCellAllItalic === "function")
            {
                selected_objects[i].setCellAllItalic(isItalic);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };

    // Уменьшение размера шрифта
    this.setCellUnderline = function (isUnderline) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].setCellAllUnderline === "function")
            {
                selected_objects[i].setCellAllUnderline(isUnderline);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };

    // Уменьшение размера шрифта
    this.setCellStrikeout = function (isStrikeout) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].setCellAllStrikeout === "function")
            {
                selected_objects[i].setCellAllStrikeout(isStrikeout);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };

    // Уменьшение размера шрифта
    this.setCellSubscript = function (isSubscript) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].setCellAllSubscript === "function")
            {
                selected_objects[i].setCellAllSubscript(isSubscript);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };

    // Уменьшение размера шрифта
    this.setCellSuperscript = function (isSuperscript) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].setCellAllSuperscript === "function")
            {
                selected_objects[i].setCellAllSuperscript(isSuperscript);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };

    // Уменьшение размера шрифта
    this.setCellAlign = function (align) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].setCellAllAlign === "function")
            {
                selected_objects[i].setCellAllAlign(align);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };

    // Уменьшение размера шрифта
    this.setCellVertAlign = function (align) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].setCellAllVertAlign === "function")
            {
                selected_objects[i].setCellAllVertAlign(align);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };


    // Уменьшение размера шрифта
    this.setCellTextColor = function (color) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].setCellAllTextColor === "function")
            {
                selected_objects[i].setCellAllTextColor(color);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };

    // Уменьшение размера шрифта
    /*this.setCellBackgroundColor = function (color) {
     if(typeof this.textObject.setCellBackgroundColor === "function")
     {
     this.textObject.setCellBackgroundColor(color);
     this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
     }
     };    */

    // Уменьшение размера шрифта
    this.setCellAngle = function (angle) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].setCellAllAngle === "function")
            {
                selected_objects[i].setCellAllAngle(angle);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };

    // Уменьшение размера шрифта
    this.increaseFontSize = function () {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].increaseAllFontSize === "function")
            {
                selected_objects[i].increaseAllFontSize();
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };

    // Уменьшение размера шрифта
    this.decreaseFontSize = function () {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(typeof  selected_objects[i].decreaseAllFontSize === "function")
            {
                selected_objects[i].decreaseAllFontSize();
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };


    this.insertHyperlink = function (options) {
        if(typeof this.textObject.insertHyperlink === "function")
        {
            this.textObject.insertHyperlink(options);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    }
}

function PreMoveCommentState(drawingObjectsController, drawingObjects, startX, startY)
{
    this.id = STATES_ID_PRE_MOVE_COMMENT;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        if(this.startX === x && this.startY === y)
            return;
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new MoveCommentState(this.drawingObjectsController, this.drawingObjects, this.startX, this.startY));
        this.drawingObjectsController.onMouseMove(e, x, y);
    };

    this.onMouseUp = function(e, x, y)
    {
        var Coords = editor.WordControl.m_oDrawingDocument.ConvertCoordsToCursorWR( x, Y, this.drawingObjects.num);
        this.drawingObjectsController.showComment(this.drawingObjectsController.arrTrackObjects[0].comment.Get_Id(), Coords.X, Coords.Y);
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId:this.majorObject.Id, cursorType: "move"}
    };
}

function MoveCommentState(drawingObjectsController, drawingObjects, startX, startY)
{
    this.id = STATES_ID_MOVE_COMMENT;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        var dx = x - this.startX;
        var dy = y - this.startY;
        this.drawingObjectsController.trackMoveObjects(dx, dy);
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseUp = function(e, x, y)
    {
        if(this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props, this.drawingObjectsController.arrTrackObjects[0].comment) === false)
        {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId:this.majorObject.Id, cursorType: "move"}
    };
}


function PreMoveInternalChartObjectState(drawingObjectsController, drawingObjects, startX, startY, chartElement)
{
    this.id = STATES_ID_PRE_MOVE_INTERNAL_CHART_OBJECT;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.chartElement = chartElement;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new MoveInternalChartObjectState(this.drawingObjectsController, this.drawingObjects, this.startX, this.startY, this.chartElement))
        this.drawingObjectsController.onMouseMove(e, x, y);
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new ChartState(this.drawingObjectsController, this.drawingObjects, this.chartElement.chartGroup));
    };

    this.onKeyDown = function(e)
    {};

    this.onKeyPress = function(e)
    {};

    this.drawSelection = function(drawingDocument)
    {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.chartElement.chartGroup.transform, 0, 0, this.chartElement.chartGroup.extX, this.chartElement.chartGroup.extY, false);
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.chartElement.transform, 0, 0, this.chartElement.extX, this.chartElement.extY, false);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectsId: this.chartElement.chartGroup.Id, cursorType:"move"};
    };
}


function MoveInternalChartObjectState(drawingObjectsController, drawingObjects, startX, startY, chartElement)
{
    this.id = STATES_ID_MOVE_INTERNAL_CHART_OBJECT;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.chartElement = chartElement;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        var dx = x - this.startX;
        var dy = y - this.startY;
        this.drawingObjectsController.trackMoveObjects(dx, dy);
        this.drawingObjects.OnUpdateOverlay();

    };

    this.onMouseUp = function(e, x, y)
    {
        History.Create_NewPoint();
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        editor.WordControl.m_oLogicDocument.Recalculate();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new ChartState(this.drawingObjectsController, this.drawingObjects, this.chartElement.chartGroup));

    };

    this.onKeyDown = function(e)
    {};

    this.onKeyPress = function(e)
    {};

    this.drawSelection = function(drawingDocument)
    {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.chartElement.chartGroup.transform, 0, 0, this.chartElement.chartGroup.extX, this.chartElement.chartGroup.extY, false);
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.chartElement.transform, 0, 0, this.chartElement.extX, this.chartElement.extY, false);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectsId: this.chartElement.chartGroup.Id, cursorType:"move"};

    };
}


function ChartState(drawingObjectsController, drawingObjects, chart)
{
    this.id = STATES_ID_CHART;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.chart = chart;

    this.onMouseDown = function(e, x, y)
    {

        var titles = [];
        titles.push(this.chart.chartTitle);
        titles.push(this.chart.hAxisTitle);
        titles.push(this.chart.vAxisTitle);
        if(!e.CtrlKey)
        {

            for(var i = 0; i < titles.length; ++i)
            {
                if(isRealObject(titles[i]) && titles[i].selected && titles[i].hitInBoundingRect(x, y))
                {
                    var title = titles[i];
                    for(var j = 0; j < titles.length; ++j)
                    {
                        if(isRealObject(titles[j]))
                            titles[j].deselect();
                    }
                    title.select();
                    this.drawingObjectsController.clearPreTrackObjects();
                    this.drawingObjectsController.addPreTrackObject(new MoveTitleInChart(title));
                    this.drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectState(this.drawingObjectsController, this.drawingObjects, x, y, title));
                    this.drawingObjects.OnUpdateOverlay();
                    return;
                }
            }
        }

        if(this.chart.canResize())
        {
            var hit_to_handles = this.chart.hitToHandles(x, y);
            if(hit_to_handles > -1 && hit_to_handles < 8)
            {
                for(var j = 0; j < titles.length; ++j)
                {
                    if(isRealObject(titles[j]))
                        titles[j].deselect();
                }
                this.drawingObjectsController.clearPreTrackObjects();
                var card_direction = this.chart.getCardDirectionByNum(hit_to_handles);

                this.drawingObjectsController.addPreTrackObject(this.chart.createResizeTrack(card_direction));
                this.drawingObjectsController.changeCurrentState(new PreResizeState(this.drawingObjectsController, this.drawingObjects, this.chart, card_direction));
                this.drawingObjects.OnUpdateOverlay();
                return;
            }
        }

        if(this.chart.hitInBoundingRect(x, y))
        {
            for(var j = 0; j < titles.length; ++j)
            {
                if(isRealObject(titles[j]))
                    titles[j].deselect();
            }
            this.drawingObjectsController.clearPreTrackObjects();

            this.drawingObjectsController.addPreTrackObject(this.chart.createMoveTrack());
            this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects, x, y, e.ShiftKey, e.CtrlKey, this.chart, true, false));
            this.drawingObjects.OnUpdateOverlay();
            return;
        }

        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = drawing_bases.length - 1; i > -1; --i)
        {
            var cur_drawing_base = drawing_bases[i];

            var cur_drawing = cur_drawing_base;
            if(cur_drawing.isShape() || cur_drawing.isImage())
            {
                var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                var hit_in_path = cur_drawing.hitInPath(x, y);
                var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                {
                    this.chart.resetSelection(this.drawingObjectsController);
                    if(!(e.CtrlKey || e.ShiftKey))
                        this.drawingObjectsController.resetSelection();
                    cur_drawing.select(this.drawingObjectsController);
                    for(var j = 0; j < selected_objects.length; ++j)
                    {
                        this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                    }
                    this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.ShiftKey, e.ctrl, cur_drawing, false, true));
                    this.drawingObjects.OnUpdateOverlay();
                    return;
                }
                else if(hit_in_text_rect)
                {
                    //TODO
                }
            }
            if(cur_drawing.isGroup())
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
                        this.drawingObjectsController.clearPreTrackObjects();
                        var is_selected = cur_drawing.selected;
                        if(!(e.CtrlKey || e.ShiftKey))
                            this.drawingObjectsController.resetSelection();
                        cur_drawing.select(this.drawingObjectsController);
                        this.drawingObjects.OnUpdateOverlay();
                        for(var j = 0; j < selected_objects.length; ++j)
                        {
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                        }
                        this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.ShiftKey, e.ctrl, cur_drawing, is_selected, true));
                        return;
                    }
                    else if(hit_in_text_rect)
                    {
                        this.drawingObjectsController.resetSelection();
                        cur_grouped_object.select(this.drawingObjectsController);
                        grouped_objects[j].select(cur_grouped_object);
                        grouped_objects[j].selectionSetStart(e, x, y);
                        this.drawingObjectsController.changeCurrentState(new TextAddInGroup(this.drawingObjectsController, this.drawingObjects, cur_drawing, grouped_objects[j]));
                        if(e.ClickCount < 2)
                            grouped_objects[j].updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
                        return;
                    }
                }
            }
            else if(cur_drawing.isChart())
            {
                if(cur_drawing === this.chart)
                {
                    for(var j = 0; j < titles.length; ++j)
                    {
                        title = titles[j];
                        if(isRealObject(title))
                        {
                            if(!title.selected)
                            {
                                if(title.hit(x, y))
                                {
                                    this.chart.resetSelection();
                                    title.select();
                                    this.drawingObjectsController.clearPreTrackObjects();
                                    this.drawingObjectsController.addPreTrackObject(new MoveTitleInChart(title));
                                    this.drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectState(this.drawingObjectsController, this.drawingObjects, x, y, title));
                                    this.drawingObjects.OnUpdateOverlay();
                                    return;
                                }
                            }
                            else
                            {
                                if(title.hit(x, y))
                                {
                                    if(title.hitInTextRect(x, y))
                                    {
                                        title.selectionSetStart(e, x, y);
                                        this.drawingObjectsController.changeCurrentState(new ChartTextAdd(this.drawingObjectsController, this.drawingObjects,  this.chart, title));
                                        if(e.ClickCount < 2)
                                            title.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
                                        return;
                                    }
                                    else
                                    {

                                        this.drawingObjectsController.clearPreTrackObjects();
                                        this.drawingObjectsController.addPreTrackObject(new MoveTitleInChart(title));
                                        this.drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectState(this.drawingObjectsController, this.drawingObjects, x, y, title));
                                        this.drawingObjects.OnUpdateOverlay();
                                    }
                                    return;
                                }
                            }
                        }
                    }
                    if(cur_drawing.hitInWorkArea(x, y))
                    {
                        this.drawingObjectsController.clearPreTrackObjects();
                        var is_selected = cur_drawing.selected;
                        this.chart.resetSelection();
                        if(!(e.CtrlKey || e.ShiftKey) && !is_selected)
                            this.drawingObjectsController.resetSelection();
                        cur_drawing.select(this.drawingObjectsController);
                        this.drawingObjects.OnUpdateOverlay();
                        for(var j = 0; j < selected_objects.length; ++j)
                        {
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                        }
                        this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.ShiftKey, e.ctrl, cur_drawing, is_selected, true));
                        return;
                    }
                }
                else
                {
                    if(cur_drawing.hitInWorkArea(x, y))
                    {

                        if(!e.ShiftKey && !e.CtrlKey)
                        {

                            if(isRealObject(cur_drawing.chartLegend))
                            {
                                //TODO
                            }

                            var object_for_move_in_chart = null;
                            if(isRealObject(cur_drawing.chartTitle))
                            {
                                if(cur_drawing.chartTitle.hit(x, y))
                                {
                                    object_for_move_in_chart = cur_drawing.chartTitle;
                                }
                            }

                            if(isRealObject(cur_drawing.hAxisTitle) && !isRealObject(object_for_move_in_chart))
                            {
                                if(cur_drawing.hAxisTitle.hit(x, y))
                                {
                                    object_for_move_in_chart = cur_drawing.hAxisTitle;
                                }
                            }

                            if(isRealObject(cur_drawing.vAxisTitle) && !isRealObject(object_for_move_in_chart))
                            {
                                if(cur_drawing.vAxisTitle.hit(x, y))
                                {
                                    object_for_move_in_chart = cur_drawing.vAxisTitle;
                                }
                            }
                            if(isRealObject(object_for_move_in_chart))
                            {
                                this.chart.resetSelection();
                                this.drawingObjectsController.resetSelection();
                                cur_drawing.select(this.drawingObjectsController);
                                object_for_move_in_chart.select();
                                this.drawingObjectsController.clearPreTrackObjects();
                                this.drawingObjectsController.addPreTrackObject(new MoveTitleInChart(object_for_move_in_chart));
                                this.drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectState(this.drawingObjectsController, this.drawingObjects, x, y, object_for_move_in_chart));
                                this.drawingObjects.OnUpdateOverlay();
                                return;
                            }
                            this.drawingObjectsController.clearPreTrackObjects();
                            var is_selected = cur_drawing.selected;
                            this.chart.resetSelection();
                            if(!(e.CtrlKey || e.ShiftKey) && !is_selected)
                                this.drawingObjectsController.resetSelection();
                            cur_drawing.select(this.drawingObjectsController);
                            this.drawingObjects.OnUpdateOverlay();
                            for(var j = 0; j < selected_objects.length; ++j)
                            {
                                this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                            }
                            this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.ShiftKey, e.ctrl, cur_drawing, is_selected, true));
                            return;
                        }



                    }
                }
            }

        }
        this.chart.resetSelection(this.drawingObjectsController);
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseMove = function(e, x, y)
    {
    };

    this.onMouseUp = function(e, x, y)
    {};

    this.onKeyDown = function(e)
    {};

    this.onKeyPress = function(e)
    {};

    this.drawSelection = function(drawingDocument)
    {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.chart.transform, 0, 0, this.chart.extX, this.chart.extY, false);
    };

    this.isPointInDrawingObjects = function(x, y)
    {

        var titles = [];
        titles.push(this.chart.chartTitle);
        titles.push(this.chart.hAxisTitle);
        titles.push(this.chart.vAxisTitle);
        if(/*!e.CtrlKey*/true)
        {
            for(var i = 0; i < titles.length; ++i)
            {
                if(isRealObject(titles[i]) && titles[i].selected && titles[i].hitInBoundingRect(x, y))
                {
                    return {objectId: this.chart.Id, cursorType: "move"};
                }
            }
        }

        if(this.chart.canResize())
        {
            var hit_to_handles = this.chart.hitToHandles(x, y);
            if(hit_to_handles > -1 && hit_to_handles < 8)
            {
                var card_direction = this.chart.getCardDirectionByNum(hit_to_handles);
                return {objectId: this.chart.Id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]};
            }
        }

        if(this.chart.hitInBoundingRect(x, y))
        {
            return {objectId: this.chart.Id, cursorType: "move"};

        }

        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(var i = drawing_bases.length - 1; i > -1; --i)
        {
            var cur_drawing_base = drawing_bases[i];
            if(cur_drawing_base.isGraphicObject())
            {
                var cur_drawing = cur_drawing_base.graphicObject;
                if(cur_drawing.isShape() || cur_drawing.isImage())
                {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                    {
                        return {objectId: cur_drawing.Id, cursorType: "move"};
                    }
                    else if(hit_in_text_rect)
                    {
                        return {objectId: cur_drawing.Id, cursorType: "move"};
                    }
                }
                else if(cur_drawing.isGroup())
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
                            return {objectId: cur_drawing.Id, cursorType: "move"};
                        }
                        else if(hit_in_text_rect)
                        {
                            return {objectId: cur_drawing.Id, cursorType: "move"};
                        }
                    }
                }
                else if(cur_drawing.isChart())
                {
                    if(cur_drawing === this.chart)
                    {
                        for(var j = 0; j < titles.length; ++j)
                        {
                            var title = titles[j];
                            if(isRealObject(title))
                            {
                                if(!title.selected)
                                {
                                    if(title.hit(x, y))
                                    {
                                        return {objectId: this.chart.Id, cursorType: "move"};
                                    }

                                }
                                else
                                {
                                    if(title.hit(x, y))
                                    {
                                        if(title.hitInTextRect(x, y))
                                        {
                                            return {objectId: this.chart.Id, cursorType: "move"};
                                        }
                                        else
                                        {

                                            return {objectId: this.chart.Id, cursorType: "move"};
                                        }
                                    }
                                }
                            }
                        }

                        if(cur_drawing.hitInWorkArea(x, y))
                        {
                            return {objectId: this.chart.Id, cursorType: "move"};
                        }

                    }
                    else
                    {
                        if(cur_drawing.hitInWorkArea(x, y))
                        {

                            if(!e.ShiftKey && !e.CtrlKey)
                            {

                                if(isRealObject(cur_drawing.chartLegend))
                                {
                                    //TODO
                                }

                                var object_for_move_in_chart = null;
                                if(isRealObject(cur_drawing.chartTitle))
                                {
                                    if(cur_drawing.chartTitle.hit(x, y))
                                    {
                                        object_for_move_in_chart = cur_drawing.chartTitle;
                                    }
                                }

                                if(isRealObject(cur_drawing.hAxisTitle) && !isRealObject(object_for_move_in_chart))
                                {
                                    if(cur_drawing.hAxisTitle.hit(x, y))
                                    {
                                        object_for_move_in_chart = cur_drawing.hAxisTitle;
                                    }
                                }

                                if(isRealObject(cur_drawing.vAxisTitle) && !isRealObject(object_for_move_in_chart))
                                {
                                    if(cur_drawing.vAxisTitle.hit(x, y))
                                    {
                                        object_for_move_in_chart = cur_drawing.vAxisTitle;
                                    }
                                }
                                if(isRealObject(object_for_move_in_chart))
                                {
                                    return {objectId: this.chart.Id, cursorType: "move"};
                                }

                                return {objectId: this.chart.Id, cursorType: "move"};

                            }
                        }
                    }
                }
            }
        }
        return null;
    };


}


function ChartTextAdd(drawingObjectsController, drawingObjects, chart, textObject)
{
    this.id = STATES_ID_CHART_TEXT_ADD;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.textObject = textObject;
    this.chartState = new ChartState(drawingObjectsController, drawingObjects, chart);
    this.chart = chart;

    this.onMouseDown = function(e, x, y)
    {
        this.chartState.onMouseDown(e, x, y);
        if(this.drawingObjectsController.State.id !== STATES_ID_CHART_TEXT_ADD || this.drawingObjectsController.State.textObject !== this.textObject)
            this.chart.recalculate();
    };

    this.onMouseMove = function(e, x, y)
    {
        if(e.IsLocked)
        {
            this.textObject.selectionSetEnd(e, x, y);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    this.onMouseUp = function(e, x, y)
    {
        this.textObject.selectionSetEnd(e, x, y);
        this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
    };

    this.onKeyDown = function(e)
    {
        var b_prevent_default = false;
        switch (e.keyCode)
        {
            case 8:
            {
                b_prevent_default = true;
            }
        }
        if(b_prevent_default)
            e.preventDefault();
    };

    this.onKeyPress = function(e)
    {
        this.textObject.paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
        this.drawingObjects.showDrawingObjects(true);
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
        //this.textObject.updateSelectionState(drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return this.chartState.isPointInDrawingObjects(x, y);
    };
}

function TextAddState(drawingObjectsController, drawingObjects, textObject)
{
    this.id = STATES_ID_TEXT_ADD;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.textObject = textObject;
    this.nullState = new NullState(drawingObjectsController, drawingObjects);

    this.onMouseDown = function(e, x, y)
    {
        this.nullState.onMouseDown(e, x, y);
        if(this.drawingObjectsController.State.id !== STATES_ID_TEXT_ADD || this.drawingObjectsController.State.id !== STATES_ID_TEXT_ADD_IN_GROUP)
        {
            this.drawingObjectsController.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        if(e.IsLocked)
        {
            this.textObject.selectionSetEnd(e, x, y);
            this.drawingObjectsController.updateSelectionState();
            this.drawingObjectsController.slide.OnUpdateOverlay();
        }
    };

    this.onMouseUp = function(e, x, y)
    {
        if(!(e.Button === g_mouse_button_right && this.textObject.pointInSelectedText(x, y)))
        {
            this.textObject.selectionSetEnd(e, x, y);
            this.drawingObjectsController.updateSelectionState();
        }
    };

    this.onKeyDown = function(e)
    {
        return DefaultKeyDownHandle(drawingObjectsController, e);
    };

    this.onKeyPress = function(e)
    {
        //var worksheet = this.drawingObjects.getWorksheet();
        //worksheet.collaborativeEditing.onStartCheckLock();
        this.drawingObjects.objectLocker.reset();
        this.drawingObjects.objectLocker.addObjectId(this.textObject.Get_Id());

        var drawingObjects = this.drawingObjects;
        var text_object = this.textObject;
        var callback = function(bLock)
        {
            if(bLock)
            {
                History.Create_NewPoint();
                text_object.paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
                drawingObjects.showDrawingObjects(true);
                text_object.updateSelectionState(drawingObjects.drawingDocument);
            }
        };

        //worksheet.collaborativeEditing.onEndCheckLock(callback);
        this.drawingObjects.objectLocker.checkObjects(callback);
        // this.textObject.paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
        // this.drawingObjects.showDrawingObjects(true);
        // this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
    };

    this.drawSelection = function(drawingDocument)
    {
        drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.textObject.getTransformMatrix(), 0, 0, this.textObject.extX, this.textObject.extY, false, this.textObject.canRotate());
        this.textObject.drawAdjustments(drawingDocument);
        //this.textObject.updateSelectionState(drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return this.nullState.isPointInDrawingObjects(x, y);
    };

    // Уменьшение размера шрифта
    this.setCellFontName = function (fontName) {
        if(typeof this.textObject.setCellFontName === "function")
        {
            this.textObject.setCellFontName(fontName);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellFontSize = function (fontSize) {
        if(typeof this.textObject.setCellFontSize === "function")
        {
            this.textObject.setCellFontSize(fontSize);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellBold = function (isBold) {
        if(typeof this.textObject.setCellBold === "function")
        {
            this.textObject.setCellBold(isBold);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellItalic = function (isItalic) {
        if(typeof this.textObject.setCellItalic === "function")
        {
            this.textObject.setCellItalic(isItalic);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellUnderline = function (isUnderline) {
        if(typeof this.textObject.setCellUnderline === "function")
        {
            this.textObject.setCellUnderline(isUnderline);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellStrikeout = function (isStrikeout) {
        if(typeof this.textObject.setCellStrikeout === "function")
        {
            this.textObject.setCellStrikeout(isStrikeout);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellSubscript = function (isSubscript) {
        if(typeof this.textObject.setCellSubscript === "function")
        {
            this.textObject.setCellSubscript(isSubscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellSuperscript = function (isSuperscript) {
        if(typeof this.textObject.setCellSuperscript === "function")
        {
            this.textObject.setCellSuperscript(isSuperscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellAlign = function (align) {
        if(typeof this.textObject.setCellAlign === "function")
        {
            this.textObject.setCellAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellVertAlign = function (align) {
        if(typeof this.textObject.setCellVertAlign === "function")
        {
            this.textObject.setCellVertAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellTextColor = function (color) {
        if(typeof this.textObject.setCellTextColor === "function")
        {
            this.textObject.setCellTextColor(color);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }

    };

    // Уменьшение размера шрифта
    this.setCellBackgroundColor = function (color) {
        if(typeof this.textObject.setCellBackgroundColor === "function")
        {
            this.textObject.setCellBackgroundColor(color);
            this.drawingObjects.showDrawingObjects(true);
        }
    };

    // Уменьшение размера шрифта
    this.setCellAngle = function (angle) {
        if(typeof this.textObject.setCellAngle === "function")
        {
            this.textObject.setCellAngle(angle);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };


    // Уменьшение размера шрифта
    this.increaseFontSize = function () {
        if(typeof this.textObject.increaseFontSize === "function")
        {
            this.textObject.increaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.decreaseFontSize = function () {
        if(typeof this.textObject.decreaseFontSize === "function")
        {
            this.textObject.decreaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };


    this.insertHyperlink = function (options) {
        if(typeof this.textObject.insertHyperlink === "function")
        {
            this.textObject.insertHyperlink(options);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    }

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

    this.onKeyDown = function(e)
    {

    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.majorObject.Id, cursorType: "crosshair"};
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
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseUp = function(e, x, y)
    {
        if(this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
        {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();

            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };

    this.onKeyPress = function(e)
    {
    };

    this.onKeyDown = function(e)
    {

    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.majorObject.Id, cursorType: "crosshair"};
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

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {

        return {objectId: this.majorObject.Id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[this.cardDirection]};
    };
}

function ResizeState(drawingObjectsController, drawingObjects, majorObject, cardDirection)
{
    this.id = STATES_ID_RESIZE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.handleNum = this.majorObject.getNumByCardDirection(cardDirection);
    this.cardDirection = cardDirection;

    this.onMouseDown = function(e, x, y)
    {};

    this.onMouseMove = function(e, x, y)
    {
        var resize_coefficients = this.majorObject.getResizeCoefficients(this.handleNum, x, y);
        this.drawingObjectsController.trackResizeObjects(resize_coefficients.kd1, resize_coefficients.kd2, e);
        this.drawingObjects.OnUpdateOverlay();

    };

    this.onMouseUp = function(e, x, y)
    {

        if(this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
        {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.majorObject.Id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[this.cardDirection]};
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

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
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
        this.drawingObjectsController.changeCurrentState(new TrackNewShapeState(this.drawingObjectsController, this.drawingObjects, this.presetGeom));

    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };

    this.onKeyDown = function(e)
    {

    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        if(selected_objects.length === 1)
        {
            var hit_to_adj = selected_objects[0].hitToAdjustment(x, y);
            if(hit_to_adj.hit)
            {
                if(selected_objects[0].canChangeAdjustments())
                {
                    return {objectId: selected_objects[0].Id, cursorType: "crosshair"};
                }
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
                        return null;
                    return {objectId: selected_objects[i].Id, cursorType: "crosshair"};
                }
                else
                {
                    if(!selected_objects[i].canResize())
                        return null;
                    this.drawingObjectsController.clearPreTrackObjects();
                    var card_direction = selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    for(var j = 0; j < selected_objects.length; ++j)
                    {
                        if(selected_objects[j].canResize())
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createResizeTrack(card_direction));
                    }
                    return {objectId: selected_objects[i].Id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]};
                }
            }
        }

        for(i = selected_objects.length - 1; i > -1; --i)
        {
            if(selected_objects[i].hitInBoundingRect(x, y))
            {
                if(!selected_objects[i].canMove())
                    return null;
                return {objectId: selected_objects[i].Id, cursorType: "move"};
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
                        return {objectId: cur_drawing.Id, cursorType: "move"};
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
                            return {objectId: cur_drawing.Id, cursorType: "move"};
                        }
                        else if(hit_in_text_rect)
                        {
                            //TODO
                        }
                    }
                }
            }
        }
        return null;
    };
}

function TrackNewShapeState(drawingObjectsController, drawingObjects, presetGeom)
{
    this.id = STATES_ID_TRACK_NEW_SHAPE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.presetGeom = presetGeom;
    this.resultObject = null;

    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.trackNewShape(e, x, y);
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.resetSelection();


        if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
        {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            if(this.presetGeom != "textRect")
            {
                this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            }
            else if(isRealObject(this.resultObject))
            {
                this.drawingObjectsController.changeCurrentState(new TextAddState(this.drawingObjectsController, this.drawingObjects, this.resultObject));
            }
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        else
        {
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        }
        editor.sync_EndAddShape();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
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
        if(this.startX === x && this.startY === y)
            return;
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
        this.drawingObjectsController.changeCurrentState(new MoveState(this.drawingObjectsController, this.drawingObjects, this.startX, this.startY, min_x, min_y, max_x - min_x, max_y - min_y, this.majorObject));
        this.drawingObjectsController.onMouseMove(e, x, y);
    };

    this.onMouseUp = function(e, x, y)
    {

        if(!this.ctrl && !this.shift)
        {

            if(e.ClickCount > 1)
            {
                var gr_obj = this.majorObject;
                if(gr_obj.chart)
                {
                    if(false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props, undefined )) {
                        var graphicObject = gr_obj;
                        graphicObject.chart.themeColors = [];
                        for (var i = 0; i < editor.WordControl.m_oDrawingDocument.GuiControlColorsMap.length; i++) {
                            graphicObject.chart.themeColors.push( editor.WordControl.m_oDrawingDocument.GuiControlColorsMap[i].get_hex() );
                        }
                        editor.asc_fireCallback("asc_doubleClickOnChart", graphicObject);
                    }
                }
            }
        }
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

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId:this.majorObject.Id, cursorType: "move"}
    };
}

function ExtpectDoubleClickState(drawingObjectsController, drawingObjects)
{
    this.id = null;
    this.drawingObjects = drawingObjects;
    this.drawingObjectsController = drawingObjectsController;
    this.nullState = new NullState(drawingObjectsController, drawingObjects);

    this.onMouseDown = function(e, x, y)
    {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        if(e.ClickCount > 1)
        {
            this.drawingObjects.showChartSettings();
        }
        else
        {
            this.drawingObjectsController.onMouseDown(e, x, y);
        }

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjectsController.onMouseMove(e, x, y);
    };


    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjectsController.onMouseUp(e, x, y);
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return this.nullState.isPointInDrawingObjects(x, y);
    };
}

function MoveState(drawingObjectsController, drawingObjects, startX, startY, rectX, rectY, rectW, rectH, majorObject)
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
    this.majorObject = majorObject;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        var dx = x - this.startX;
        var dy = y - this.startY;
        this.drawingObjectsController.trackMoveObjects(dx, dy);
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseUp = function(e, x, y)
    {
        if(this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
        {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId:this.majorObject.Id, cursorType: "move"}
    };
}


function PreChangeAdjState(drawingObjectsController, drawingObjects, majorObject)
{
    this.id = STATES_ID_PRE_CHANGE_ADJ;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;

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

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId:this.majorObject.Id, cursorType: "crosshair"}
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
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseUp = function(e, x, y)
    {
        if(this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
        {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId:this.drawingObjectsController.arrTrackObjects[0].originalShape.Id, cursorType: "crosshair"}
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
                    var card_direction = group_selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    for(var j = 0; j < group_selected_objects.length; ++j)
                    {
                        this.drawingObjectsController.addPreTrackObject(group_selected_objects[j].createResizeInGroupTrack(card_direction))
                    }
                    this.drawingObjectsController.changeCurrentState(new PreResizeInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, group_selected_objects[i], card_direction));
                }
                return;
            }
        }

        var hit_to_handles = this.group.hitToHandles(x, y);
        if(hit_to_handles > -1)
        {
            if(hit_to_handles === 8)
            {
                if(!this.group.canRotate())
                    return;
                this.group.resetSelection(this.drawingObjectsController);
                this.drawingObjectsController.addPreTrackObject(this.group.createRotateTrack());
                this.drawingObjectsController.changeCurrentState(new PreRotateState(this.drawingObjectsController, this.drawingObjects, this.group));
                return;
            }
            else
            {
                if(!this.group.canResize())
                    return;
                this.group.resetSelection(this.drawingObjectsController);
                var card_direction = this.group.getCardDirectionByNum(hit_to_handles);
                this.drawingObjectsController.addPreTrackObject(this.group.createResizeTrack(card_direction));
                this.drawingObjectsController.changeCurrentState(new PreResizeState(this.drawingObjectsController, this.drawingObjects, this.group, card_direction));
                return;
            }
        }


        for(i = group_selected_objects.length - 1; i  > -1; --i)
        {
            if(group_selected_objects[i].hitInBoundingRect(x, y))
            {
                this.drawingObjectsController.clearPreTrackObjects();
                for(var j = 0; j < group_selected_objects.length; ++j)
                {
                    this.drawingObjectsController.addPreTrackObject(group_selected_objects[j].createMoveInGroupTrack());
                }
                this.drawingObjectsController.changeCurrentState(new PreMoveInGroupState(this.drawingObjectsController, this.drawingObjects, this.group,
                    x, y, e.ShiftKey, e.CtrlKey, group_selected_objects[i], true));
            }
        }

        if(this.group.hitInBoundingRect(x, y))
        {
            this.group.resetSelection();
            this.drawingObjectsController.addPreTrackObject(this.group.createMoveTrack());
            this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects, x, y, e.ShiftKey, e.CtrlKey, this.group, true, false));
            return;
        }

        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(i = drawing_bases.length - 1; i > -1; --i)
        {
            var cur_drawing_base = drawing_bases[i];
            var cur_drawing = cur_drawing_base;
            if(cur_drawing.isSimpleObject())
            {
                var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                var hit_in_path = cur_drawing.hitInPath(x, y);
                var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                {
                    this.group.resetSelection(this.drawingObjectsController);
                    if(!(e.CtrlKey || e.ShiftKey))
                        this.drawingObjectsController.resetSelection();
                    cur_drawing.select(this.drawingObjectsController);
                    for(var j = 0; j < selected_objects.length; ++j)
                    {
                        this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                    }
                    this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.ShiftKey, e.ctrl, cur_drawing, false, true));
                    this.drawingObjects.OnUpdateOverlay();
                    return;
                }
                else if(hit_in_text_rect)
                {
                    //TODO
                }
            }
            else
            {
                if(this.group === cur_drawing)
                {
                    var arr_graphic_objects = this.group.getArrGraphicObjects();
                    for(i = arr_graphic_objects.length - 1; i > -1; --i)
                    {
                        var cur_drawing = arr_graphic_objects[i];
                        var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                        var hit_in_path = cur_drawing.hitInPath(x, y);
                        var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                        if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                        {
                            var is_selected = cur_drawing.selected;
                            if(!(e.CtrlKey || e.ShiftKey) && !is_selected)
                                this.group.resetSelection();
                            cur_drawing.select(this.drawingObjectsController);
                            this.drawingObjects.OnUpdateOverlay();
                            for(var j = 0; j < group_selected_objects.length; ++j)
                            {
                                this.drawingObjectsController.addPreTrackObject(group_selected_objects[j].createMoveInGroupTrack());
                            }
                            this.drawingObjectsController.changeCurrentState(new PreMoveInGroupState(this.drawingObjectsController, this.drawingObjects,this.group,  x, y, e.ShiftKey, e.ctrl, cur_drawing, is_selected));
                            this.drawingObjects.OnUpdateOverlay();
                            return;
                        }
                        else if(hit_in_text_rect)
                        {
                            this.drawingObjectsController.resetSelection();
                            this.group.select(this.drawingObjectsController);
                            cur_drawing.select(this.group);
                            cur_drawing.selectionSetStart(e, x, y);
                            this.drawingObjectsController.changeCurrentState(new TextAddInGroup(this.drawingObjectsController, this.drawingObjects, this.group, cur_drawing));
                            if(e.ClickCount < 2)
                                cur_drawing.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
                            return;
                        }
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
                            this.group.resetSelection(this.drawingObjectsController);
                            if(!(e.CtrlKey || e.ShiftKey))
                                this.drawingObjectsController.resetSelection();
                            cur_drawing.select(this.drawingObjectsController);
                            this.drawingObjects.OnUpdateOverlay();
                            for(var j = 0; j < selected_objects.length; ++j)
                            {
                                this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                            }
                            this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects,x, y, e.ShiftKey, e.ctrl, cur_drawing, false, true));
                            this.drawingObjectsController.OnUpdateOverlay();
                            return;
                        }
                        else if(hit_in_text_rect)
                        {
                            this.drawingObjectsController.resetSelection();
                            cur_drawing.select(this.drawingObjectsController);
                            cur_grouped_object.select(this.group);
                            cur_grouped_object.selectionSetStart(e, x, y);
                            this.drawingObjectsController.changeCurrentState(new TextAddInGroup(this.drawingObjectsController, this.drawingObjects, this.group, cur_drawing));
                            if(e.ClickCount < 2)
                                cur_drawing.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
                            return;
                        }
                    }
                }
            }

        }

        this.group.resetSelection(this.drawingObjectsController);
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjects.OnUpdateOverlay();

    };

    this.onMouseMove = function(e, x, y)
    {};

    this.onMouseUp = function(e, x, y)
    {};

    this.onKeyDown = function(e)
    {
        return DefaultKeyDownHandle(this.drawingObjectsController, e);
    };

    this.onKeyPress = function(e)
    {
        var selected_objects = this.group.selectedObjects;
        if(selected_objects.length === 1 && selected_objects[0].isShape())
        {
            if(isRealNumber(e.charCode))
            {
                selected_objects[0].paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
                this.drawingObjectsController.changeCurrentState(new TextAddInGroup(this.drawingObjectsController, this.drawingObjects, this.group, selected_objects[0]));
                this.drawingObjects.showDrawingObjects(true);
                this.drawingObjects.OnUpdateOverlay();
            }
        }

    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        var group_selected_objects = this.group.selectedObjects;
        if(group_selected_objects.length === 1)
        {
            var hit_to_adj = group_selected_objects[0].hitToAdjustment(x, y);
            if(hit_to_adj.hit)
            {
                return {objectId: this.group.Id, cursorType: "crosshair"};
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
                        return null;
                    return {objectId: this.group.Id, cursorType: "crosshair"};
                }
                else
                {
                    if(!group_selected_objects[i].canResize())
                        return null;
                    var card_direction = group_selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    return {objectId: this.group.Id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]};

                }
            }
        }

        var hit_to_handles = this.group.hitToHandles(x, y);
        if(hit_to_handles > -1)
        {
            if(hit_to_handles === 8)
            {
                if(!this.group.canRotate())
                    return null;
                return {objectId: this.group.Id, cursorType: "crosshair"};
            }
            else
            {
                var card_direction = this.group.getCardDirectionByNum(hit_to_handles);
                return {objectId: this.group.Id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]};
            }
        }


        for(i = group_selected_objects.length - 1; i  > -1; --i)
        {
            if(group_selected_objects[i].hitInBoundingRect(x, y))
            {
                return {objectId: this.group.Id, cursorType:"move"};
            }
        }

        if(this.group.hitInBoundingRect(x, y))
        {
            return {objectId: this.group.Id, cursorType: "move"};
        }

        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for(i = drawing_bases.length - 1; i > -1; --i)
        {
            var cur_drawing_base = drawing_bases[i];
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
                        return {objectId: cur_drawing.Id, cursorType: "move"};
                    }
                    else if(hit_in_text_rect)
                    {
                        return {objectId: cur_drawing.Id, cursorType: "text"};
                    }
                }
                else
                {
                    if(this.group === cur_drawing)
                    {
                        var arr_graphic_objects = this.group.getArrGraphicObjects();
                        for(i = arr_graphic_objects.length - 1; i > -1; --i)
                        {
                            var cur_drawing = arr_graphic_objects[i];
                            var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                            var hit_in_path = cur_drawing.hitInPath(x, y);
                            var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                            if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
                            {
                                return {objectId: this.group.Id, cursorType: "move"};
                            }
                            else if(hit_in_text_rect)
                            {
                                return {objectId: this.group.Id, cursorType: "text"};
                            }
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
                                return {objectId: cur_drawing.Id, cursorType: "move"};
                            }
                            else if(hit_in_text_rect)
                            {
                                return {objectId: cur_drawing.Id, cursorType: "text"};
                            }
                        }
                    }
                }
            }
        }

        return null;
    };
}


function TextAddInGroup(drawingObjectsController, drawingObjects, group, textObject)
{
    this.id = STATES_ID_TEXT_ADD_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.groupState = new GroupState(drawingObjectsController, drawingObjects, group);
    this.textObject = textObject;
    this.group = group;
    this.onMouseDown = function(e, x, y)
    {
        this.groupState.onMouseDown(e, x, y);
        if(this.drawingObjectsController.State.id !== STATES_ID_TEXT_ADD || this.drawingObjectsController.State.id !== STATES_ID_TEXT_ADD_IN_GROUP)
        {
            this.drawingObjectsController.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        if(e.IsLocked)
        {
            this.textObject.selectionSetEnd(e, x, y);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    this.onMouseUp = function(e, x, y)
    {
        this.textObject.selectionSetEnd(e, x, y);
        this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
    };
    this.drawSelection = function(drawingDocument)
    {
        drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.group.getTransformMatrix(), 0, 0, this.group.extX, this.group.extY, false, this.group.canRotate());
        drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.textObject.getTransformMatrix(), 0, 0, this.textObject.extX, this.textObject.extY, false, this.textObject.canRotate());
        this.textObject.drawAdjustments(drawingDocument);
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
        this.drawingObjects.objectLocker.reset();
        this.drawingObjects.objectLocker.addObjectId(this.group.Get_Id());

        var drawingObjects = this.drawingObjects;
        var text_object = this.textObject;
        var callback = function(bLock)
        {
            if(bLock)
            {
                History.Create_NewPoint();
                text_object.paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
                drawingObjects.showDrawingObjects(true);
                text_object.updateSelectionState(drawingObjects.drawingDocument);
            }
        };

        //worksheet.collaborativeEditing.onEndCheckLock(callback);
        this.drawingObjects.objectLocker.checkObjects(callback);
        // this.textObject.paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
        // this.drawingObjects.showDrawingObjects(true);
        // this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        //this.textObject.paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
        //this.drawingObjectsController.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        //this.drawingObjects.showDrawingObjects(true);
        //this.drawingObjects.OnUpdateOverlay();
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return this.groupState.isPointInDrawingObjects(x, y);
    };
    // Уменьшение размера шрифта
    this.setCellFontName = function (fontName) {
        if(typeof this.textObject.setCellFontName === "function")
        {
            this.textObject.setCellFontName(fontName);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellFontSize = function (fontSize) {
        if(typeof this.textObject.setCellFontSize === "function")
        {
            this.textObject.setCellFontSize(fontSize);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellBold = function (isBold) {
        if(typeof this.textObject.setCellBold === "function")
        {
            this.textObject.setCellBold(isBold);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellItalic = function (isItalic) {
        if(typeof this.textObject.setCellItalic === "function")
        {
            this.textObject.setCellItalic(isItalic);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellUnderline = function (isUnderline) {
        if(typeof this.textObject.setCellUnderline === "function")
        {
            this.textObject.setCellUnderline(isUnderline);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellStrikeout = function (isStrikeout) {
        if(typeof this.textObject.setCellStrikeout === "function")
        {
            this.textObject.setCellStrikeout(isStrikeout);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellSubscript = function (isSubscript) {
        if(typeof this.textObject.setCellSubscript === "function")
        {
            this.textObject.setCellSubscript(isSubscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellSuperscript = function (isSuperscript) {
        if(typeof this.textObject.setCellSuperscript === "function")
        {
            this.textObject.setCellSuperscript(isSuperscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellAlign = function (align) {
        if(typeof this.textObject.setCellAlign === "function")
        {
            this.textObject.setCellAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellVertAlign = function (align) {
        if(typeof this.textObject.setCellVertAlign === "function")
        {
            this.textObject.setCellVertAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.setCellTextColor = function (color) {
        if(typeof this.textObject.setCellTextColor === "function")
        {
            this.textObject.setCellTextColor(color);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }

    };

    // Уменьшение размера шрифта
    this.setCellBackgroundColor = function (color) {
        if(typeof this.textObject.setCellBackgroundColor === "function")
        {
            this.textObject.setCellBackgroundColor(color);
            this.drawingObjects.showDrawingObjects(true);
        }
    };

    // Уменьшение размера шрифта
    this.setCellAngle = function (angle) {
        if(typeof this.textObject.setCellAngle === "function")
        {
            this.textObject.setCellAngle(angle);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };


    // Уменьшение размера шрифта
    this.increaseFontSize = function () {
        if(typeof this.textObject.increaseFontSize === "function")
        {
            this.textObject.increaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };

    // Уменьшение размера шрифта
    this.decreaseFontSize = function () {
        if(typeof this.textObject.decreaseFontSize === "function")
        {
            this.textObject.decreaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };


    this.insertHyperlink = function (options) {
        if(typeof this.textObject.insertHyperlink === "function")
        {
            this.textObject.insertHyperlink(options);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
}

function PreMoveInGroupState(drawingObjectsController, drawingObjects, group, startX, startY, ShiftKey, CtrlKey, majorObject,  majorObjectIsSelected)
{
    this.id = STATES_ID_PRE_MOVE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.startX = startX;
    this.startY = startY;
    this.ShiftKey = ShiftKey;
    this.CtrlKey = CtrlKey;
    this.majorObject = majorObject;
    this.majorObjectIsSelected = majorObjectIsSelected;

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
        this.drawingObjectsController.changeCurrentState(new MoveInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, this.startX, this.startY, min_x, min_y, max_x - min_x, max_y - min_y))
        this.drawingObjectsController.onMouseMove(e, x, y);
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.clearPreTrackObjects();
        if(this.shift || this.ctrl)
        {
            if(this.majorObjectIsSelected)
                this.majorObject.deselect(this.drawingObjectsController);
        }
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.Id, cursorType: "move"};
    };
}

function MoveInGroupState(drawingObjectsController, drawingObjects, group, startX, startY, rectX, rectY, rectW, rectH)
{
    this.id = STATES_ID_MOVE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
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
        this.drawingObjectsController.trackMoveObjects(dx, dy);
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseUp = function(e, x, y)
    {


        if(this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
        {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            this.group.normalize();
            this.group.updateCoordinatesAfterInternalResize();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));


    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.Id, cursorType: "move"};
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

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.Id, cursorType: "crosshair"};
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
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseUp = function(e, x, y)
    {


        var worksheet = this.drawingObjects.getWorksheet();
        this.drawingObjects.objectLocker.reset();
        this.drawingObjects.objectLocker.addObjectId(this.group.Get_Id());
        var track_objects2 = [];
        for(var i = 0; i < this.drawingObjectsController.arrTrackObjects.length; ++i)
        {
            track_objects2.push(this.drawingObjectsController.arrTrackObjects[i]);
        }

        var drawingObjects = this.drawingObjects;
        var group = this.group;
        var callback = function(bLock)
        {
            if(bLock)
            {
                History.Create_NewPoint();
                for(var i = 0; i < track_objects2.length; ++i)
                    track_objects2[i].trackEnd();
                group.recalculateTransform();
                drawingObjects.showDrawingObjects(true);
            }
        };
        this.drawingObjects.objectLocker.checkObjects(callback);

        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.Id, cursorType: "crosshair"};
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

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.Id, cursorType: "crosshair"};
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
        var angle = this.majorObject.getRotateAngle(x, y);
        this.drawingObjectsController.rotateTrackObjects(angle, e);
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseUp = function(e, x, y)
    {
        if(this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
        {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            group.normalize();
            group.updateCoordinatesAfterInternalResize();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));


    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.Id, cursorType: "crosshair"};
    };
}


function PreResizeInGroupState(drawingObjectsController, drawingObjects, group, majorObject, cardDirection)
{
    this.id = STATES_ID_PRE_RESIZE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.cardDirection = cardDirection;
    this.onMouseDown = function(e, x, y)
    {

    };

    this.onMouseMove = function(e, x, y)
    {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new ResizeInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, this.majorObject, this.majorObject.getNumByCardDirection(this.cardDirection), this.cardDirection))
    };

    this.onMouseUp = function(e, x, y)
    {};

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.Id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[this.cardDirection]};
    };
}

function ResizeInGroupState(drawingObjectsController, drawingObjects, group, majorObject, handleNum, cardDirection)
{
    this.id = STATES_ID_RESIZE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.handleNum = handleNum;
    this.cardDirection = cardDirection;
    this.onMouseDown = function(e, x, y)
    {};

    this.onMouseMove = function(e, x, y)
    {
        var resize_coefficients = this.majorObject.getResizeCoefficients(this.handleNum, x, y);
        this.drawingObjectsController.trackResizeObjects(resize_coefficients.kd1, resize_coefficients.kd2, e);
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseUp = function(e, x, y)
    {
        if(this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
        {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            group.normalize();
            group.updateCoordinatesAfterInternalResize();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };

    this.onKeyDown = function(e)
    {};

    this.onKeyPress = function(e)
    {
    };

    this.drawSelection = function(drawingDocument)
    {
        DrawGroupSelection(this.group, drawingDocument);
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return {objectId: this.group.Id, cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[this.cardDirection]};
    };
}

function SplineBezierState(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_SPLINE_BEZIER;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.onMouseDown = function(e, x, y)
    {
        this.drawingObjectsController.clearTrackObjects();
        var spline = new Spline(this.drawingObjects);
        this.drawingObjectsController.addTrackObject(spline);
        spline.addPathCommand(new SplineCommandMoveTo(x, y));
        this.drawingObjectsController.changeCurrentState(new SplineBezierState33(this.drawingObjectsController, this.drawingObjects, x, y, spline));
        this.drawingObjectsController.resetSelection();
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseMove = function(e, x, y)
    {
    };

    this.onMouseUp = function(e, X, Y, pageIndex)
    {

        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
       

    };

    this.onKeyDown = function(e)
    {

    };


    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}


function SplineBezierState33(drawingObjectsController, drawingObjects, startX, startY, spline)
{

    this.id = STATES_ID_SPLINE_BEZIER33;

    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.spline = spline;
    this.onMouseDown = function(e, x, y)
    {
    };

    this.onMouseMove = function(e, x, y)
    {
        if(this.startX === x && this.startY === y)
            return;
        this.spline.addPathCommand(new SplineCommandLineTo(x, y));
        this.drawingObjectsController.changeCurrentState(new SplineBezierState2(this.drawingObjectsController, this.drawingObjects, this.startX, this.startY, this.spline));
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseUp = function(e, x, y)
    {
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}

function SplineBezierState2(drawingObjectsController, drawingObjects, startX, startY, spline)
{
    this.id = STATES_ID_SPLINE_BEZIER2;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.spline = spline;
    this.onMouseDown = function(e, x, y)
    {
        if(e.ClickCount >= 2)
        {
            this.spline.createShape(null, this.drawingObjects);
           

            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
           

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        this.spline.path[1].changeLastPoint(x, y);
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.changeCurrentState(new SplineBezierState3(this.drawingObjectsController, this.drawingObjects, x, y, this.spline));
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}

function SplineBezierState3(drawingObjectsController, drawingObjects, startX, startY, spline)
{
    this.id = STATES_ID_SPLINE_BEZIER3;

    this.drawingObjects = drawingObjects;
    this.drawingObjectsController = drawingObjectsController;
    this.spline = spline;

    this.startX = startX;
    this.startY = startY;
    this.onMouseDown = function(e, x, y)
    {
        if(e.ClickCount >= 2)
        {
            this.spline.createShape(this.drawingObjects);
           

            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
           

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        if(x === this.startX && y === this.startY)
        {
            return;
        }

        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
        var spline = this.spline;
        x0 = spline.path[0].x;
        y0 = spline.path[0].y;
        x3 = spline.path[1].x;
        y3 = spline.path[1].y;
        x6 = x;
        y6 = y;

        var vx = (x6 - x0)/6;
        var vy = (y6 - y0)/6;

        x2 = x3 - vx;
        y2 = y3 - vy;

        x4 = x3 + vx;
        y4 = y3 + vy;

        x1 = (x0 + x2)*0.5;
        y1 = (y0 + y2)*0.5;

        x5 = (x4 + x6)*0.5;
        y5 = (y4 + y6)*0.5;


        spline.path.length = 1;
        spline.path.push(new SplineCommandBezier(x1, y1, x2, y2, x3, y3));
        spline.path.push(new SplineCommandBezier(x4, y4, x5, y5, x6, y6));
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new SplineBezierState4(this.drawingObjectsController, this.drawingObjects, this.spline));
    };

    this.onMouseUp = function(e, x, y)
    {
        /* if(e.ClickCount >= 2)
         {
         this.spline.createShape(this.drawingObjects);
        
         this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
         }  */
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}

function SplineBezierState4(drawingObjectsController, drawingObjects, spline)
{
    this.id = STATES_ID_SPLINE_BEZIER4;
    this.drawingObjects = drawingObjects;
    this.drawingObjectsController = drawingObjectsController;
    this.spline = spline;
    this.onMouseDown = function(e, x, y)
    {
        if(e.ClickCount >= 2)
        {
            this.spline.createShape(this.drawingObjects);
           

            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
           

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        var spline = this.spline;
        var lastCommand = spline.path[spline.path.length-1];
        var preLastCommand = spline.path[spline.path.length-2];
        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
        if(spline.path[spline.path.length-3].id == 0)
        {
            x0 = spline.path[spline.path.length-3].x;
            y0 = spline.path[spline.path.length-3].y;
        }
        else
        {
            x0 = spline.path[spline.path.length-3].x3;
            y0 = spline.path[spline.path.length-3].y3;
        }

        x3 = preLastCommand.x3;
        y3 = preLastCommand.y3;

        x6 = x;
        y6 = y;

        var vx = (x6 - x0)/6;
        var vy = (y6 - y0)/6;

        x2 = x3 - vx;
        y2 = y3 - vy;

        x4 = x3 + vx;
        y4 = y3 + vy;

        x5 = (x4 + x6)*0.5;
        y5 = (y4 + y6)*0.5;

        if(spline.path[spline.path.length-3].id == 0)
        {
            preLastCommand.x1 = (x0 + x2)*0.5;
            preLastCommand.y1 = (y0 + y2)*0.5;
        }

        preLastCommand.x2 = x2;
        preLastCommand.y2 = y2;
        preLastCommand.x3 = x3;
        preLastCommand.y3 = y3;

        lastCommand.x1 = x4;
        lastCommand.y1 = y4;
        lastCommand.x2 = x5;
        lastCommand.y2 = y5;
        lastCommand.x3 = x6;
        lastCommand.y3 = y6;

        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseUp = function(e, x, y)
    {
        //if(e.ClickCount < 2 )
        {
            this.drawingObjectsController.changeCurrentState(new SplineBezierState5(this.drawingObjectsController, this.drawingObjects, x, y, this.spline));
        }
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}

function SplineBezierState5(drawingObjectsController, drawingObjects, startX, startY, spline)
{
    this.id = STATES_ID_SPLINE_BEZIER5;

    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.spline = spline;

    this.onMouseDown = function(e, x, y)
    {
        if(e.ClickCount >= 2)
        {
            this.spline.createShape(this.drawingObjects);
           
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
           

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        if(x === this.startX && y === this.startY)
        {
            return;
        }
        var spline = this.spline;
        var lastCommand = spline.path[spline.path.length-1];
        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;

        if(spline.path[spline.path.length-2].id == 0)
        {
            x0 = spline.path[spline.path.length-2].x;
            y0 = spline.path[spline.path.length-2].y;
        }
        else
        {
            x0 = spline.path[spline.path.length-2].x3;
            y0 = spline.path[spline.path.length-2].y3;
        }

        x3 = lastCommand.x3;
        y3 = lastCommand.y3;



        x6 = x;
        y6 = y;

        var vx = (x6 - x0)/6;
        var vy = (y6 - y0)/6;


        x2 = x3 - vx;
        y2 = y3 - vy;

        x1 = (x2+x1)*0.5;
        y1 = (y2+y1)*0.5;

        x4 = x3 + vx;
        y4 = y3 + vy;

        x5 = (x4 + x6)*0.5;
        y5 = (y4 + y6)*0.5;

        if(spline.path[spline.path.length-2].id == 0)
        {
            lastCommand.x1 = x1;
            lastCommand.y1 = y1;
        }
        lastCommand.x2 = x2;
        lastCommand.y2 = y2;


        spline.path.push(new SplineCommandBezier(x4, y4, x5, y5, x6, y6));
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new SplineBezierState4(this.drawingObjectsController, this.drawingObjects, this.spline));
    };

    this.onMouseUp = function(e, x, y)
    {
        /*  if(e.ClickCount >= 2)
         {
         this.spline.createShape(this.drawingObjects);
        
         this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
         }  */
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}

//Состояния прия работе с полилиниями
function PolyLineAddState(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_POLY_LINE_ADD;

    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.onMouseDown = function(e, x, y)
    {
        var polyline = new PolyLine(this.drawingObjects);
        polyline.arrPoint.push({x : x, y: y});
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjectsController.addTrackObject(polyline);
        this.drawingObjects.OnUpdateOverlay();

        var _min_distance = this.drawingObjects.convertMetric(1, 0, 3);
        this.drawingObjectsController.changeCurrentState(new PolyLineAddState2(this.drawingObjectsController, this.drawingObjects, _min_distance, polyline));
    };

    this.onMouseMove = function(e, x, y)
    {

    };
    this.onMouseUp = function(e, x, y)
    {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
       

    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}


function PolyLineAddState2(drawingObjectsController, drawingObjects, minDistance, polyline)
{
    this.id = STATES_ID_POLY_LINE_ADD2;

    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.minDistance = minDistance;
    this.polyline = polyline;

    this.onMouseDown = function(e, x, y)
    {
    };
    this.onMouseMove = function(e, x, y)
    {
        var _last_point = this.polyline.arrPoint[this.polyline.arrPoint.length - 1];

        var dx = x - _last_point.x;
        var dy = y - _last_point.y;

        if(Math.sqrt(dx*dx + dy*dy) >= this.minDistance)
        {
            this.polyline.arrPoint.push({x : x, y : y});
            this.drawingObjects.OnUpdateOverlay();
        }
    };
    this.onMouseUp = function(e, x, y)
    {
        if(this.polyline.arrPoint.length > 1)
        {
            this.polyline.createShape();
        }

        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
       


    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}



function AddPolyLine2State(drawingObjectsController, drawingObjects)
{
    this.id = STATES_ID_ADD_PPOLY_LINE2;

    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.onMouseDown = function(e, x, y)
    {
        this.drawingObjectsController.resetSelection();
        this.drawingObjects.OnUpdateOverlay();

        var polyline = new PolyLine(this.drawingObjects);
        polyline.arrPoint.push({x : x, y: y});
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjectsController.addTrackObject(polyline);
        this.drawingObjectsController.changeCurrentState(new AddPolyLine2State2(this.drawingObjectsController, this.drawingObjects, x, y, polyline));
    };

    this.onMouseMove = function(AutoShapes, e, X, Y)
    {};

    this.onMouseUp = function(AutoShapes, e, X, Y)
    {
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}


function AddPolyLine2State2(drawingObjectsController, drawingObjects, x, y, polyline)
{
    this.id = STATES_ID_ADD_PPOLY_LINE22;

    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.X = x;
    this.Y = y;
    this.polyline = polyline;

    this.onMouseDown = function(e, x, y)
    {
        if(e.ClickCount > 1)
        {
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
           

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        if(this.X !== x || this.Y !== y)
        {
            this.polyline.arrPoint.push({x : x, y: y});
            this.drawingObjectsController.changeCurrentState(new AddPolyLine2State3(this.drawingObjectsController, this.drawingObjects, this.polyline));
        }
    };

    this.onMouseUp = function(e, x, y)
    {
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {
    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}

function AddPolyLine2State3(drawingObjectsController, drawingObjects, polyline)
{
    this.id = STATES_ID_ADD_PPOLY_LINE23;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.minDistance = this.drawingObjects.convertMetric(1, 0, 3);
    this.polyline = polyline;
    this.onMouseDown = function(e, x, y)
    {
        this.polyline.arrPoint.push({x: x, y: y});
        if(e.ClickCount > 1)
        {
            this.polyline.createShape();
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
           

        }
    };

    this.onMouseMove = function(e, x, y)
    {
        if(e.which > 0 && e.type === "mousemove")
        {
            this.polyline.arrPoint[this.polyline.arrPoint.length - 1] = {x: x, y: y};
        }
        else
        {
            var _last_point = this.polyline.arrPoint[this.polyline.arrPoint.length - 1];
            var dx = x - _last_point.x;
            var dy = y - _last_point.y;

            if(Math.sqrt(dx*dx + dy*dy) >= this.minDistance)
            {
                this.polyline.arrPoint.push({x: x, y: y});
            }
        }
        this.drawingObjects.OnUpdateOverlay();
    };

    this.onMouseUp = function(e, x, y)
    {
        /*if(e.ClickCount > 1)
         {

         var lt = this.graphicObjects.polyline.getLeftTopPoint();
         var near_pos =  this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, lt.x, lt.y);
         near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
         if(false === isViewMode && near_pos != null &&
         false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {Type : changestype_2_Element_and_Type , Element : near_pos.Paragraph, CheckType : changestype_Paragraph_Content} ))
         {
         History.Create_NewPoint();
         var _new_word_graphic_object = this.graphicObjects.polyline.createShape(this.graphicObjects.document);
         this.graphicObjects.arrTrackObjects.length = 0;
         //   this.graphicObjects.resetSelection();
         _new_word_graphic_object.select(this.graphicObjects.startTrackPos.pageIndex);
         _new_word_graphic_object.recalculateWrapPolygon();
         this.graphicObjects.selectionInfo.selectionArray.push(_new_word_graphic_object);
         _new_word_graphic_object.Set_DrawingType(drawing_Anchor);
         _new_word_graphic_object.Set_WrappingType(WRAPPING_TYPE_NONE);
         _new_word_graphic_object.Set_XYForAdd(_new_word_graphic_object.absOffsetX, _new_word_graphic_object.absOffsetY);
         _new_word_graphic_object.Add_ToDocument(near_pos);
         }
         editor.sync_StartAddShapeCallback(false);
         editor.sync_EndAddShape();
         this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
         this.graphicObjects.State.updateAnchorPos();
         this.graphicObjects.polyline = null;
         } */
    };

    this.onKeyDown = function(e)
    {

    };

    this.onKeyPress = function(e)
    {

    };

    this.isPointInDrawingObjects = function(x, y)
    {
        return null/*TODO*/;
    };

    this.drawSelection = function(drawingDocument)
    {
    };
}

function DrawDefaultSelection(drawingObjectsController, drawingDocument)
{
    var selected_objects = drawingObjectsController.selectedObjects;
    for(var i = 0; i < selected_objects.length; ++i)
    {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, selected_objects[i].getTransformMatrix(), 0, 0, selected_objects[i].extX, selected_objects[i].extY, false, selected_objects[i].canRotate());
    }
    if(selected_objects.length === 1)
    {
        selected_objects[0].drawAdjustments(drawingDocument);
    }
}

function DrawGroupSelection(group, drawingDocument)
{
    drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, group.getTransformMatrix(), 0, 0, group.extX, group.extY, false, group.canRotate());
    var group_selected_objects = group.selectedObjects;
    for(var i = 0; i < group_selected_objects.length; ++i)
    {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, group_selected_objects[i].getTransformMatrix(), 0, 0, group_selected_objects[i].extX, group_selected_objects[i].extY, false, group_selected_objects[i].canRotate())
    }
    if(group_selected_objects.length === 1)
    {
        group_selected_objects[0].drawAdjustments(drawingDocument);
    }
}

function DefaultKeyDownHandle(drawingObjectsController, e)
{
    var bRetValue = false;
    var state = drawingObjectsController.State;
    var isViewMode = drawingObjectsController.drawingObjects.isViewerMode();
    if ( e.keyCode == 8 && false === isViewMode ) // BackSpace
    {

        switch(state.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                drawingObjectsController.drawingObjects.objectLocker.reset();
                if(state.id === STATES_ID_TEXT_ADD)
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.textObject.Get_Id());
                else
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.group.Get_Id());

                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);
                        var state = drawingObjectsController.State;
                        state.textObject.remove(-1, true);
                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        state.textObject.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                break;
            }
            case STATES_ID_GROUP:
            {
                drawingObjectsController.drawingObjects.objectLocker.reset();
                drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.group.Get_Id());

                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);

                        var state = drawingObjectsController.State;
                        var group = state.group;
                        var selected_objects = [];
                        for(var i = 0; i < group.selectedObjects.length; ++i)
                        {
                            selected_objects.push(group.selectedObjects[i]);
                        }
                        group.resetSelection();
                        drawingObjectsController.resetSelectionState();
                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateUndo, null, null,
                            new UndoRedoDataGraphicObjects(group.Id, new UndoRedoDataGOSingleProp(null, null)), null);
                        var groups = [];
                        for(i = 0; i < selected_objects.length; ++i)
                        {
                            var parent_group = selected_objects[i].group;
                            parent_group.removeFromSpTree(selected_objects[i].Get_Id());
                            for(var j = 0; j < groups.length; ++j)
                            {
                                if(groups[i] === parent_group)
                                    break;
                            }
                            if(j === groups.length)
                                groups.push(parent_group);
                        }
                        groups.sort(CompareGroups);
                        for(i  = 0; i < groups.length; ++i)
                        {
                            var parent_group = groups[i];
                            if(parent_group !== group)
                            {
                                if(parent_group.spTree.length === 0)
                                {
                                    parent_group.group.removeFromSpTree(parent_group.Get_Id());
                                }
                                if(parent_group.spTree.length === 1)
                                {
                                    var sp = parent_group.spTree[0];
                                    sp.setRotate(normalizeRotate(isRealNumber(sp.spPr.xfrm.rot) ? sp.spPr.xfrm.rot : 0 + isRealNumber(parent_group.spPr.xfrm.rot) ? parent_group.spPr.xfrm.rot : 0 ));
                                    sp.setFlips(sp.spPr.xfrm.flipH === true ? !(parent_group.spPr.xfrm.flipH === true) : parent_group.spPr.xfrm.flipH === true,
                                        sp.spPr.xfrm.flipV === true ? !(parent_group.spPr.xfrm.flipV === true) : parent_group.spPr.xfrm.flipV === true);
                                    sp.setPosition(sp.spPr.xfrm.x + parent_group.spPr.xfrm.x, sp.spPr.xfrm.y + parent_group.spPr.xfrm.y);
                                    parent_group.group.swapGraphicObject(parent_group.Get_Id(), sp.Get_Id());
                                }
                            }
                            else
                            {
                                switch (parent_group.spTree.length)
                                {
                                    case 0:
                                    {
                                        parent_group.deleteDrawingBase();
                                        break;
                                    }
                                    case 1:
                                    {
                                        var sp = parent_group.spTree[0];
                                        sp.setRotate(normalizeRotate(isRealNumber(sp.spPr.xfrm.rot) ? sp.spPr.xfrm.rot : 0 + isRealNumber(parent_group.spPr.xfrm.rot) ? parent_group.spPr.xfrm.rot : 0 ));
                                        sp.setFlips(sp.spPr.xfrm.flipH === true ? !(parent_group.spPr.xfrm.flipH === true) : parent_group.spPr.xfrm.flipH === true,
                                            sp.spPr.xfrm.flipV === true ? !(parent_group.spPr.xfrm.flipV === true) : parent_group.spPr.xfrm.flipV === true);
                                        sp.setPosition(sp.spPr.xfrm.offX + parent_group.spPr.xfrm.offX, sp.spPr.xfrm.offY + parent_group.spPr.xfrm.offY);
                                        sp.setGroup(null);
                                        var pos = parent_group.deleteDrawingBase();
                                        sp.addToDrawingObjects(pos);
                                        sp.select(drawingObjectsController);
                                        sp.recalculateTransform();
                                        sp.calculateTransformTextMatrix();
                                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null,
                                            new UndoRedoDataGraphicObjects(sp.Id, new UndoRedoDataGOSingleProp(null, null)), null);
                                        break;
                                    }
                                    default:
                                    {
                                        parent_group.normalize();
                                        parent_group.updateCoordinatesAfterInternalResize();
                                        parent_group.select(drawingObjectsController);
                                        parent_group.recalculate();
                                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateRedo, null, null,
                                            new UndoRedoDataGraphicObjects(parent_group.Id, new UndoRedoDataGOSingleProp(null, null)), null);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                break;
            }
            case STATES_ID_NULL:
            {
                drawingObjectsController.drawingObjects.objectLocker.reset();
                for(var i = 0; i < drawingObjectsController.selectedObjects.length; ++i)
                {
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.selectedObjects[i].Get_Id());
                }

                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);

                        for(var i = 0; i < drawingObjectsController.selectedObjects.length; ++i)
                        {
                            drawingObjectsController.selectedObjects[i].deleteDrawingBase();
                        }
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);

                break;
            }
            default :
            {
                break;
            }
        }
        bRetValue = true;
    }
    else if ( e.keyCode == 9 && false === isViewMode ) // Tab
    {
        switch(state.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {

                drawingObjectsController.drawingObjects.objectLocker.reset();
                if(state.id === STATES_ID_TEXT_ADD)
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.textObject.Get_Id());
                else
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.group.Get_Id());


                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);
                        state.textObject.paragraphAdd( new ParaTab() );
                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        state.textObject.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                bRetValue = true;
                break;
            }
            case STATES_ID_NULL:
            {
                var a_drawing_bases = drawingObjectsController.drawingObjects.getDrawingObjects();
                if(!e.ShiftKey)
                {
                    var last_selected = null, last_selected_index = null;
                    for(var i = a_drawing_bases.length - 1;  i > -1; --i)
                    {
                        if(a_drawing_bases[i].graphicObject.selected)
                        {
                            last_selected = a_drawing_bases[i].graphicObject;
                            last_selected_index = i;
                            break;
                        }
                    }
                    if(isRealObject(last_selected))
                    {
                        bRetValue = true;
                        drawingObjectsController.resetSelection();
                        if(!last_selected.isGroup() || last_selected.arrGraphicObjects.length === 0)
                        {
                            if(last_selected_index < a_drawing_bases.length - 1)
                            {
                                a_drawing_bases[last_selected_index+1].graphicObject.select(drawingObjectsController);
                            }
                            else
                            {
                                a_drawing_bases[0].graphicObject.select(drawingObjectsController);
                            }
                        }
                        else
                        {
                            last_selected.select(drawingObjectsController);
                            last_selected.arrGraphicObjects[0].select(last_selected);
                            drawingObjectsController.changeCurrentState(new GroupState(drawingObjectsController, drawingObjectsController.drawingObjects, last_selected));
                        }
                    }
                }
                else
                {
                    var first_selected = null, first_selected_index = null;
                    for(var i = 0; i < a_drawing_bases.length; ++i)
                    {
                        if(a_drawing_bases[i].graphicObject.selected)
                        {
                            first_selected = a_drawing_bases[i].graphicObject;
                            first_selected_index = i;
                            break;
                        }
                    }
                    if(isRealObject(first_selected))
                    {
                        bRetValue = true;
                        drawingObjectsController.resetSelection();
                        if(first_selected_index > 0)
                        {
                            a_drawing_bases[first_selected_index - 1].graphicObject.select(drawingObjectsController);
                        }
                        else
                        {
                            a_drawing_bases[a_drawing_bases.length - 1].graphicObject.select(drawingObjectsController);
                        }
                    }
                }
                drawingObjectsController.drawingObjects.OnUpdateOverlay();
                break;
            }
            case STATES_ID_GROUP:
            {
                var group = state.group;
                var arr_graphic_objects = group.arrGraphicObjects;
                if(!e.ShiftKey)
                {
                    for(var i = arr_graphic_objects.length - 1; i > -1; --i)
                    {
                        if(arr_graphic_objects[i].selected)
                        {
                            break;
                        }
                    }
                    group.resetSelection();
                    if(i < arr_graphic_objects.length - 1)
                    {
                        arr_graphic_objects[i+1].select(group);
                    }
                    else
                    {
                        drawingObjectsController.resetSelectionState();
                        var a_drawing_bases = drawingObjectsController.drawingObjects.getDrawingObjects();
                        for(var i = 0; i < a_drawing_bases.length; ++i)
                        {
                            if(a_drawing_bases.graphicObject === group)
                            {
                                break;
                            }
                        }
                        if(i < a_drawing_bases.length)
                        {
                            a_drawing_bases[i+1].graphicObject.select(drawingObjectsController);
                        }
                        else
                        {
                            a_drawing_bases[0].graphicObject.select(drawingObjectsController);
                        }
                    }
                }
                else
                {
                    for(var i = 0; i < arr_graphic_objects.length; ++i)
                    {
                        if(arr_graphic_objects[i].selected)
                        {
                            break;
                        }
                    }
                    group.resetSelection();
                    if(i > 0)
                    {
                        arr_graphic_objects[i - 1].select(group);
                    }
                    else
                    {
                        drawingObjectsController.resetSelectionState();
                        group.select(drawingObjectsController);
                    }
                }
                drawingObjectsController.drawingObjects.OnUpdateOverlay();
                break;
            }
        }
    }
    else if ( e.keyCode == 13 && false === isViewMode ) // Enter
    {
        /*var Hyperlink = this.Hyperlink_Check(false);
         if ( null != Hyperlink && false === e.ShiftKey )
         {
         editor.sync_HyperlinkClickCallback( Hyperlink.Get_Value() )
         Hyperlink.Set_Visited(true);

         // TODO: Пока сделаем так, потом надо будет переделать
         this.DrawingDocument.ClearCachePages();
         this.DrawingDocument.FirePaint();
         }
         else
         {
         var CheckType = ( e.ShiftKey || e.CtrlKey ? changestype_Paragraph_Content : changestype_Document_Content_Add );
         if ( false === this.Document_Is_SelectionLocked(CheckType) )
         {
         this.Create_NewHistoryPoint();
         if ( e.ShiftKey )
         {
         this.Paragraph_Add( new ParaNewLine( break_Line ) );
         }
         else if ( e.CtrlKey )
         {
         this.Paragraph_Add( new ParaNewLine( break_Page ) );
         }
         else
         {
         this.Add_NewParagraph();
         }
         }
         }  */
        switch(state.id)
        {
            case STATES_ID_NULL:
            {
                if(drawingObjectsController.selectedObjects.length === 1 && drawingObjectsController.selectedObjects[0].isShape())
                {
                    drawingObjectsController.drawingObjects.objectLocker.reset();
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.selectedObjects[0].Get_Id());

                    var selection_state =  drawingObjectsController.getSelectionState();
                    var callback = function(bLock)
                    {
                        if(bLock)
                        {
                            History.Create_NewPoint();
                            drawingObjectsController.resetSelectionState();
                            drawingObjectsController.setSelectionState(selection_state);
                            var sp = drawingObjectsController.selectedObjects[0];
                            drawingObjectsController.changeCurrentState(new TextAddState(drawingObjectsController, drawingObjectsController.drawingObjects, sp));
                            if(isRealObject(sp.txBody))
                            {
                                sp.txBody.content.Select_All();
                            }
                            else
                            {
                                sp.addTextBody(new CTextBody(sp));
                                sp.calculateContent();
                                sp.calculateTransformTextMatrix();
                            }
                            sp.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                            drawingObjectsController.drawingObjects.OnUpdateOverlay();
                        }
                    };
                    drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);

                }
                bRetValue = true;
                break;
            }
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                drawingObjectsController.drawingObjects.objectLocker.reset();
                drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.textObject.Get_Id());

                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);
                        var state = drawingObjectsController.State;
                        state.textObject.addNewParagraph();
                        state.textObject.calculateContent();
                        state.textObject.calculateTransformTextMatrix();
                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        state.textObject.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);


                bRetValue = true;
                break;
            }
        }
        bRetValue = true;
    }
    else if ( e.keyCode == 27 ) // Esc
    {
        switch(state.id)
        {
            case STATES_ID_NULL:
            {
                bRetValue = true;
                break;
            }
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                state.textObject.txBody.content.Selection_Remove();
                drawingObjectsController.changeCurrentState(new NullState(drawingObjectsController, drawingObjectsController.drawingObjects));
                drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                drawingObjectsController.drawingObjects.OnUpdateOverlay();
                bRetValue = true;
                break;
            }
        }
    }
    else if ( e.keyCode == 32 && false === isViewMode ) // Space
    {

        switch(state.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if(!e.CtrlKey)
                {
                    drawingObjectsController.drawingObjects.objectLocker.reset();
                    if(state.id === STATES_ID_TEXT_ADD)
                        drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.textObject.Get_Id());
                    else
                        drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.group.Get_Id());

                    var selection_state =  drawingObjectsController.getSelectionState();
                    var callback = function(bLock)
                    {
                        if(bLock)
                        {
                            History.Create_NewPoint();
                            drawingObjectsController.resetSelectionState();
                            drawingObjectsController.setSelectionState(selection_state);
                            var state = drawingObjectsController.State;
                            state.textObject.paragraphAdd(new ParaSpace(1));
                            drawingObjectsController.drawingObjects.showDrawingObjects(true);
                            state.textObject.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                            drawingObjectsController.drawingObjects.OnUpdateOverlay();
                        }
                    };
                    drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                }
                break;
            }
            case STATES_ID_GROUP:
            {
                if(!e.CtrlKey && state.group.selectedObjects.length === 1)
                {
                    drawingObjectsController.drawingObjects.objectLocker.reset();
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.group.Get_Id());

                    var selection_state =  drawingObjectsController.getSelectionState();
                    var callback = function(bLock)
                    {
                        if(bLock)
                        {
                            History.Create_NewPoint();
                            drawingObjectsController.resetSelectionState();
                            drawingObjectsController.setSelectionState(selection_state);
                            var state = drawingObjectsController.State;
                            drawingObjectsController.changeCurrentState(new TextAddInGroup(drawingObjectsController, drawingObjectsController.drawingObjects, state.group, state.group.selectedObjects[0]));
                            drawingObjectsController.state.textObject.paragraphAdd(new ParaSpace(1));
                            drawingObjectsController.showDrawingObjects(true);
                            drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                        }
                    };
                    drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                }
                break;
            }
            case STATES_ID_NULL:
            {
                if(drawingObjectsController.selectedObjects.length === 1 && drawingObjectsController.selectedObjects[0].isShape() && !e.CtrlKey)
                {
                    drawingObjectsController.drawingObjects.objectLocker.reset();
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.selectedObjects[0].Get_Id());
                    var selection_state =  drawingObjectsController.getSelectionState();
                    var callback = function(bLock)
                    {
                        if(bLock)
                        {
                            History.Create_NewPoint();
                            drawingObjectsController.resetSelectionState();
                            drawingObjectsController.setSelectionState(selection_state);
                            drawingObjectsController.changeCurrentState(new TextAddState(drawingObjectsController, drawingObjectsController.drawingObjects, drawingObjectsController.selectedObjects[0]));
                            drawingObjectsController.State.textObject.paragraphAdd(new ParaSpace(1));
                            drawingObjectsController.drawingObjects.showDrawingObjects(true);
                            drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                            drawingObjectsController.drawingObjects.OnUpdateOverlay();
                        }
                    };
                    drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                }
                break;
            }
            default :
            {
                break;
            }
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
        switch(state.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if (e.CtrlKey) // Ctrl + End - переход в конец документа
                {
                    state.textObject.txBody.content.Cursor_MoveToEndPos();
                    drawingObjectsController.updateSelectionState();
                }
                else // Переходим в конец строки
                {
                    state.textObject.txBody.content.Cursor_MoveEndOfLine(e.ShiftKey);
                    drawingObjectsController.updateSelectionState();
                }
                break;
            }
        }

        bRetValue = true;
    }
    else if ( e.keyCode == 36 ) // клавиша Home
    {
        switch(state.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if (e.CtrlKey) // Ctrl + End - переход в конец документа
                {
                    state.textObject.txBody.content.Cursor_MoveToStartPos();
                    drawingObjectsController.updateSelectionState();
                }
                else // Переходим в конец строки
                {
                    state.textObject.txBody.content.Cursor_MoveStartOfLine(e.ShiftKey);
                    drawingObjectsController.updateSelectionState();
                }
                break;
            }
        }

        bRetValue = true;
    }
    else if ( e.keyCode == 37 ) // Left Arrow
    {
        switch(state.id)
        {
            case STATES_ID_NULL:
            {
                //TODO реализовать изменение размеров объектов с ShiftKey
                drawingObjectsController.drawingObjects.objectLocker.reset();
                for(var i = 0; i < drawingObjectsController.selectedObjects.length; ++i)
                {
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId( drawingObjectsController.selectedObjects[i].Get_Id());
                }
                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);
                        var state = drawingObjectsController.State;
                        for(var i = 0; i < drawingObjectsController.selectedObjects.length; ++i)
                        {
                            var xfrm = drawingObjectsController.selectedObjects[i].spPr.xfrm;
                            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                            drawingObjectsController.selectedObjects[i].setPosition(xfrm.offX - 3, xfrm.offY);
                            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                            drawingObjectsController.selectedObjects[i].recalculateTransform();
                            drawingObjectsController.selectedObjects[i].calculateTransformTextMatrix();
                        }

                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                bRetValue = true;
                break;
            }
            case STATES_ID_GROUP:
            {
                drawingObjectsController.drawingObjects.objectLocker.reset();
                drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.State.group.Get_Id());

                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);
                        var state = drawingObjectsController.State;
                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                        for(var i = 0; i < state.group.selectedObjects.length; ++i)
                        {
                            var xfrm =  state.group.selectedObjects[i].spPr.xfrm;
                            state.group.selectedObjects[i].setPosition(xfrm.offX - 3, xfrm.offY);
                        }
                        state.group.normalize();
                        state.group.updateCoordinatesAfterInternalResize();
                        state.group.recalculate();
                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                bRetValue = true;
                break;
            }
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                state.textObject.txBody.content.Cursor_MoveLeft(e.ShiftKey,e.CtrlKey );
                drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                break;
            }
        }
        bRetValue = true;
    }
    else if ( e.keyCode == 38 ) // Top Arrow
    {
        switch(state.id)
        {
            case STATES_ID_NULL:
            {
                //TODO реализовать изменение размеров объектов с ShiftKey
                drawingObjectsController.drawingObjects.objectLocker.reset();
                for(var i = 0; i < drawingObjectsController.selectedObjects.length; ++i)
                {
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId( drawingObjectsController.selectedObjects[i].Get_Id());
                }
                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);
                        var state = drawingObjectsController.State;
                        for(var i = 0; i < drawingObjectsController.selectedObjects.length; ++i)
                        {
                            var xfrm = drawingObjectsController.selectedObjects[i].spPr.xfrm;
                            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                            drawingObjectsController.selectedObjects[i].setPosition(xfrm.offX, xfrm.offY - 3);
                            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                            drawingObjectsController.selectedObjects[i].recalculateTransform();
                            drawingObjectsController.selectedObjects[i].calculateTransformTextMatrix();
                        }

                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                bRetValue = true;
                break;
            }
            case STATES_ID_GROUP:
            {
                drawingObjectsController.drawingObjects.objectLocker.reset();
                drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.State.group.Get_Id());

                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);
                        var state = drawingObjectsController.State;
                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                        for(var i = 0; i < state.group.selectedObjects.length; ++i)
                        {
                            var xfrm =  state.group.selectedObjects[i].spPr.xfrm;
                            state.group.selectedObjects[i].setPosition(xfrm.offX, xfrm.offY - 3);
                        }
                        state.group.normalize();
                        state.group.updateCoordinatesAfterInternalResize();
                        state.group.recalculate();
                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                bRetValue = true;
                break;
            }
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                state.textObject.txBody.content.Cursor_MoveUp(e.ShiftKey,e.CtrlKey );
                drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                break;
            }
        }
        bRetValue = true;
    }
    else if ( e.keyCode == 39 ) // Right Arrow
    {
        switch(state.id)
        {
            case STATES_ID_NULL:
            {
                //TODO реализовать изменение размеров объектов с ShiftKey
                drawingObjectsController.drawingObjects.objectLocker.reset();
                for(var i = 0; i < drawingObjectsController.selectedObjects.length; ++i)
                {
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId( drawingObjectsController.selectedObjects[i].Get_Id());
                }
                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);
                        var state = drawingObjectsController.State;
                        for(var i = 0; i < drawingObjectsController.selectedObjects.length; ++i)
                        {
                            var xfrm = drawingObjectsController.selectedObjects[i].spPr.xfrm;
                            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                            drawingObjectsController.selectedObjects[i].setPosition(xfrm.offX + 3, xfrm.offY);
                            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                            drawingObjectsController.selectedObjects[i].recalculateTransform();
                            drawingObjectsController.selectedObjects[i].calculateTransformTextMatrix();
                        }

                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                bRetValue = true;
                break;
            }
            case STATES_ID_GROUP:
            {
                drawingObjectsController.drawingObjects.objectLocker.reset();
                drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.State.group.Get_Id());

                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);
                        var state = drawingObjectsController.State;
                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                        for(var i = 0; i < state.group.selectedObjects.length; ++i)
                        {
                            var xfrm =  state.group.selectedObjects[i].spPr.xfrm;
                            state.group.selectedObjects[i].setPosition(xfrm.offX + 3, xfrm.offY);
                        }
                        state.group.normalize();
                        state.group.updateCoordinatesAfterInternalResize();
                        state.group.recalculate();
                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                bRetValue = true;
                break;
            }
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                state.textObject.txBody.content.Cursor_MoveRight(e.ShiftKey,e.CtrlKey );
                drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                break;
            }
        }
        bRetValue = true;
    }
    else if ( e.keyCode == 40 ) // Bottom Arrow
    {
        switch(state.id)
        {
            case STATES_ID_NULL:
            {
                //TODO реализовать изменение размеров объектов с ShiftKey
                drawingObjectsController.drawingObjects.objectLocker.reset();
                for(var i = 0; i < drawingObjectsController.selectedObjects.length; ++i)
                {
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId( drawingObjectsController.selectedObjects[i].Get_Id());
                }
                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);
                        var state = drawingObjectsController.State;
                        for(var i = 0; i < drawingObjectsController.selectedObjects.length; ++i)
                        {
                            var xfrm = drawingObjectsController.selectedObjects[i].spPr.xfrm;
                            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                            drawingObjectsController.selectedObjects[i].setPosition(xfrm.offX, xfrm.offY + 3);
                            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                            drawingObjectsController.selectedObjects[i].recalculateTransform();
                            drawingObjectsController.selectedObjects[i].calculateTransformTextMatrix();
                        }

                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                bRetValue = true;
                break;
            }
            case STATES_ID_GROUP:
            {
                drawingObjectsController.drawingObjects.objectLocker.reset();
                drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.State.group.Get_Id());

                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);
                        var state = drawingObjectsController.State;
                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                        for(var i = 0; i < state.group.selectedObjects.length; ++i)
                        {
                            var xfrm =  state.group.selectedObjects[i].spPr.xfrm;
                            state.group.selectedObjects[i].setPosition(xfrm.offX, xfrm.offY + 3);
                        }
                        state.group.normalize();
                        state.group.updateCoordinatesAfterInternalResize();
                        state.group.recalculate();
                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                bRetValue = true;
                break;
            }
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                state.textObject.txBody.content.Cursor_MoveDown(e.ShiftKey,e.CtrlKey );
                drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                break;
            }
        }
        bRetValue = true;
    }
    else if ( e.keyCode == 45 ) // Insert
    {
        //TODO
    }
    else if ( e.keyCode == 46 && false === isViewMode ) // Delete
    {
        switch(state.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                drawingObjectsController.drawingObjects.objectLocker.reset();
                if(state.id === STATES_ID_TEXT_ADD)
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.textObject.Get_Id());
                else
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.group.Get_Id());

                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);
                        var state = drawingObjectsController.State;
                        state.textObject.remove(1, true);
                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        state.textObject.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                break;
            }
            case STATES_ID_GROUP:
            {
                drawingObjectsController.drawingObjects.objectLocker.reset();
                drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.group.Get_Id());

                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);

                        var state = drawingObjectsController.State;
                        var group = state.group;
                        var selected_objects = [];
                        for(var i = 0; i < group.selectedObjects.length; ++i)
                        {
                            selected_objects.push(group.selectedObjects[i]);
                        }
                        group.resetSelection();
                        drawingObjectsController.resetSelectionState();
                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateUndo, null, null,
                            new UndoRedoDataGraphicObjects(group.Id, new UndoRedoDataGOSingleProp(null, null)), null);
                        var groups = [];
                        for(i = 0; i < selected_objects.length; ++i)
                        {
                            var parent_group = selected_objects[i].group;
                            parent_group.removeFromSpTree(selected_objects[i].Get_Id());
                            for(var j = 0; j < groups.length; ++j)
                            {
                                if(groups[i] === parent_group)
                                    break;
                            }
                            if(j === groups.length)
                                groups.push(parent_group);
                        }
                        groups.sort(CompareGroups);
                        for(i  = 0; i < groups.length; ++i)
                        {
                            var parent_group = groups[i];
                            if(parent_group !== group)
                            {
                                if(parent_group.spTree.length === 0)
                                {
                                    parent_group.group.removeFromSpTree(parent_group.Get_Id());
                                }
                                if(parent_group.spTree.length === 1)
                                {
                                    var sp = parent_group.spTree[0];
                                    sp.setRotate(normalizeRotate(isRealNumber(sp.spPr.xfrm.rot) ? sp.spPr.xfrm.rot : 0 + isRealNumber(parent_group.spPr.xfrm.rot) ? parent_group.spPr.xfrm.rot : 0 ));
                                    sp.setFlips(sp.spPr.xfrm.flipH === true ? !(parent_group.spPr.xfrm.flipH === true) : parent_group.spPr.xfrm.flipH === true,
                                        sp.spPr.xfrm.flipV === true ? !(parent_group.spPr.xfrm.flipV === true) : parent_group.spPr.xfrm.flipV === true);
                                    sp.setPosition(sp.spPr.xfrm.x + parent_group.spPr.xfrm.x, sp.spPr.xfrm.y + parent_group.spPr.xfrm.y);
                                    parent_group.group.swapGraphicObject(parent_group.Get_Id(), sp.Get_Id());
                                }
                            }
                            else
                            {
                                switch (parent_group.spTree.length)
                                {
                                    case 0:
                                    {
                                        parent_group.deleteDrawingBase();
                                        break;
                                    }
                                    case 1:
                                    {
                                        var sp = parent_group.spTree[0];
                                        sp.setRotate(normalizeRotate(isRealNumber(sp.spPr.xfrm.rot) ? sp.spPr.xfrm.rot : 0 + isRealNumber(parent_group.spPr.xfrm.rot) ? parent_group.spPr.xfrm.rot : 0 ));
                                        sp.setFlips(sp.spPr.xfrm.flipH === true ? !(parent_group.spPr.xfrm.flipH === true) : parent_group.spPr.xfrm.flipH === true,
                                            sp.spPr.xfrm.flipV === true ? !(parent_group.spPr.xfrm.flipV === true) : parent_group.spPr.xfrm.flipV === true);
                                        sp.setPosition(sp.spPr.xfrm.offX + parent_group.spPr.xfrm.offX, sp.spPr.xfrm.offY + parent_group.spPr.xfrm.offY);
                                        sp.setGroup(null);
                                        var pos = parent_group.deleteDrawingBase();
                                        sp.addToDrawingObjects(pos);
                                        sp.select(drawingObjectsController);
                                        sp.recalculateTransform();
                                        sp.calculateTransformTextMatrix();
                                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null,
                                            new UndoRedoDataGraphicObjects(sp.Id, new UndoRedoDataGOSingleProp(null, null)), null);
                                        break;
                                    }
                                    default:
                                    {
                                        parent_group.normalize();
                                        parent_group.updateCoordinatesAfterInternalResize();
                                        parent_group.select(drawingObjectsController);
                                        parent_group.recalculate();
                                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateRedo, null, null,
                                            new UndoRedoDataGraphicObjects(parent_group.Id, new UndoRedoDataGOSingleProp(null, null)), null);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                break;
            }
            case STATES_ID_NULL:
            {
                drawingObjectsController.drawingObjects.objectLocker.reset();
                for(var i = 0; i < drawingObjectsController.selectedObjects.length; ++i)
                {
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.selectedObjects[i].Get_Id());
                }

                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);

                        for(var i = 0; i < drawingObjectsController.selectedObjects.length; ++i)
                        {
                            drawingObjectsController.selectedObjects[i].deleteDrawingBase();
                        }
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);

                break;
            }
            default :
            {
                break;
            }
        }
        bRetValue = true;
    }
    else if ( e.keyCode == 65 && true === e.CtrlKey ) // Ctrl + A - выделяем все
    {
        switch(state.id)
        {
            case STATES_ID_NULL:
            case STATES_ID_GROUP:
            {
                if(state.id === STATES_ID_GROUP)
                    state.group.resetSelection();
                state.resetSelectionState();
                var drawing_bases = drawingObjectsController.drawingObjects.getDrawingObjects();
                for(var i = 0; i < drawing_bases.length; ++i)
                {
                    drawing_bases.graphicObject.select(drawingObjectsController);
                }
                drawingObjectsController.drawingObjects.OnUpdateOverlay();
                break;
            }
        }

        bRetValue = true;
    }
    else if ( e.keyCode == 66 && false === isViewMode && true === e.CtrlKey ) // Ctrl + B - делаем текст жирным
    {
        var TextPr = drawingObjectsController.getParagraphTextPr();
        if ( isRealObject(TextPr))
        {
            if(typeof state.setCellBold === "function")
            {
                state.setCellBold(TextPr.Bold === true ? false : true );
            }
            bRetValue = true;
        }
    }
    else if ( e.keyCode == 67 && true === e.CtrlKey ) // Ctrl + C + ...
    {
        //TODO
    }
    else if ( e.keyCode == 69 && false === isViewMode && true === e.CtrlKey ) // Ctrl + E - переключение прилегания параграфа между center и left
    {

        var ParaPr = drawingObjectsController.getParagraphParaPr();
        if ( isRealObject(ParaPr))
        {
            if(typeof state.setCellAlign === "function")
            {
                state.setCellAlign(ParaPr.Jc === align_Center ? "left" : "center" );
            }
            bRetValue = true;
        }
    }
    else if ( e.keyCode == 73 && false === isViewMode && true === e.CtrlKey ) // Ctrl + I - делаем текст наклонным
    {
        var TextPr = drawingObjectsController.getParagraphTextPr();
        if ( isRealObject(TextPr))
        {
            if(typeof state.setCellItalic === "function")
            {
                state.setCellItalic(TextPr.Italic === true ? false : true );
            }
            bRetValue = true;
        }
    }
    else if ( e.keyCode == 74 && false === isViewMode && true === e.CtrlKey ) // Ctrl + J переключение прилегания параграфа между justify и left
    {
        var ParaPr = drawingObjectsController.getParagraphParaPr();
        if ( isRealObject(ParaPr))
        {
            if(typeof state.setCellAlign === "function")
            {
                state.setCellAlign(ParaPr.Jc === align_Justify ? "left" : "justify" );
            }
            bRetValue = true;
        }
    }
    else if ( e.keyCode == 75 && false === isViewMode && true === e.CtrlKey ) // Ctrl + K - добавление гиперссылки
    {
        //TODO
        bRetValue = true;
    }
    else if ( e.keyCode == 76 && false === isViewMode && true === e.CtrlKey ) // Ctrl + L + ...
    {

        var ParaPr = drawingObjectsController.getParagraphParaPr();
        if ( isRealObject(ParaPr))
        {
            if(typeof state.setCellAlign === "function")
            {
                state.setCellAlign(ParaPr.Jc === align_Left ? "justify" : "left");
            }
            bRetValue = true;
        }

    }
    else if ( e.keyCode == 77 && false === isViewMode && true === e.CtrlKey ) // Ctrl + M + ...
    {
        bRetValue = true;

    }
    else if ( e.keyCode == 80 && true === e.CtrlKey ) // Ctrl + P + ...
    {
        bRetValue = true;

    }
    else if ( e.keyCode == 82 && false === isViewMode && true === e.CtrlKey ) // Ctrl + R - переключение прилегания параграфа между right и left
    {
        var ParaPr = drawingObjectsController.getParagraphParaPr();
        if ( isRealObject(ParaPr))
        {
            if(typeof state.setCellAlign === "function")
            {
                state.setCellAlign(ParaPr.Jc === align_Right ? "left" : "right");
            }
            bRetValue = true;
        }
    }
    else if ( e.keyCode == 83 && false === isViewMode && true === e.CtrlKey ) // Ctrl + S - save
    {
        bRetValue = true;
    }
    else if ( e.keyCode == 85 && false === isViewMode && true === e.CtrlKey ) // Ctrl + U - делаем текст подчеркнутым
    {
        var TextPr = drawingObjectsController.getParagraphTextPr();
        if ( isRealObject(TextPr))
        {
            if(typeof state.setCellUnderline === "function")
            {
                state.setCellUnderline(TextPr.Underline === true ? false : true );
            }
            bRetValue = true;
        }
    }
    else if ( e.keyCode == 86 && false === isViewMode && true === e.CtrlKey ) // Ctrl + V - paste
    {

    }
    else if ( e.keyCode == 88 && false === isViewMode && true === e.CtrlKey ) // Ctrl + X - cut
    {
        //не возвращаем true чтобы не было preventDefault
    }
    else if ( e.keyCode == 89 && false === isViewMode && true === e.CtrlKey ) // Ctrl + Y - Redo
    {
    }
    else if ( e.keyCode == 90 && false === isViewMode && true === e.CtrlKey ) // Ctrl + Z - Undo
    {
    }
    else if ( e.keyCode == 93 || 57351 == e.keyCode /*в Opera такой код*/ ) // контекстное меню
    {
        bRetValue = true;
    }
    else if ( e.keyCode == 121 && true === e.ShiftKey ) // Shift + F10 - контекстное меню
    {
    }
    else if ( e.keyCode == 144 ) // Num Lock
    {
    }
    else if ( e.keyCode == 145 ) // Scroll Lock
    {
    }
    else if ( e.keyCode == 187 && false === isViewMode && true === e.CtrlKey ) // Ctrl + Shift + +, Ctrl + = - superscript/subscript
    {
        var TextPr = drawingObjectsController.getParagraphTextPr();
        if ( isRealObject(TextPr))
        {
            if(typeof state.setCellSubscript === "function" && typeof state.setCellSuperscript === "function")
            {
                if ( true === e.ShiftKey )
                    state.setCellSuperscript(TextPr.VertAlign === vertalign_SuperScript ? false : true );
                else
                    state.setCellSubscript(TextPr.VertAlign === vertalign_SubScript ? false : true );
            }
            bRetValue = true;
        }
    }
    else if ( e.keyCode == 188 && true === e.CtrlKey ) // Ctrl + ,
    {
        var TextPr = drawingObjectsController.getParagraphTextPr();
        if ( isRealObject(TextPr))
        {
            if(typeof state.setCellSuperscript === "function")
            {
                state.setCellSuperscript(TextPr.VertAlign === vertalign_SuperScript ? false : true );
            }
            bRetValue = true;
        }
    }
    else if ( e.keyCode == 189 && false === isViewMode ) // Клавиша Num-
    {

        var Item = null;
        if ( true === e.CtrlKey && true === e.ShiftKey )
        {
            Item = new ParaText( String.fromCharCode( 0x2013 ) );
            Item.SpaceAfter = false;
        }
        else if ( true === e.ShiftKey )
            Item = new ParaText( "_" );
        else
            Item = new ParaText( "-" );
        switch (state.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                drawingObjectsController.drawingObjects.objectLocker.reset();
                if(state.id === STATES_ID_TEXT_ADD)
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.textObject.Get_Id());
                else
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.group.Get_Id());


                var selection_state =  drawingObjectsController.getSelectionState();
                var callback = function(bLock)
                {
                    if(bLock)
                    {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState();
                        drawingObjectsController.setSelectionState(selection_state);
                        var state = drawingObjectsController.State;
                        state.textObject.paragraphAdd(Item);
                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        state.textObject.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                break;
            }

            case STATES_ID_GROUP:
            {
                if(!e.CtrlKey && state.group.selectedObjects.length === 1)
                {
                    drawingObjectsController.drawingObjects.objectLocker.reset();
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.group.Get_Id());

                    var selection_state =  drawingObjectsController.getSelectionState();
                    var callback = function(bLock)
                    {
                        if(bLock)
                        {
                            History.Create_NewPoint();
                            drawingObjectsController.resetSelectionState();
                            drawingObjectsController.setSelectionState(selection_state);
                            var state = drawingObjectsController.State;
                            drawingObjectsController.changeCurrentState(new TextAddInGroup(drawingObjectsController, drawingObjectsController.drawingObjects, state.group, state.group.selectedObjects[0]));
                            drawingObjectsController.state.textObject.paragraphAdd(Item);
                            drawingObjectsController.showDrawingObjects(true);
                            drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                        }
                    };
                    drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                }
                break;
            }
            case STATES_ID_NULL:
            {
                if(drawingObjectsController.selectedObjects.length === 1 && drawingObjectsController.selectedObjects[0].isShape() && !e.CtrlKey)
                {
                    drawingObjectsController.drawingObjects.objectLocker.reset();
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.selectedObjects[0].Get_Id());
                    var selection_state =  drawingObjectsController.getSelectionState();
                    var callback = function(bLock)
                    {
                        if(bLock)
                        {
                            History.Create_NewPoint();
                            drawingObjectsController.resetSelectionState();
                            drawingObjectsController.setSelectionState(selection_state);
                            drawingObjectsController.changeCurrentState(new TextAddState(drawingObjectsController, drawingObjectsController.drawingObjects, drawingObjectsController.selectedObjects[0]));
                            drawingObjectsController.State.textObject.paragraphAdd(Item);
                            drawingObjectsController.drawingObjects.showDrawingObjects(true);
                            drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                            drawingObjectsController.drawingObjects.OnUpdateOverlay();
                        }
                    };
                    drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                }
                break;
            }
        }
        bRetValue = true;
    }
    else if ( e.keyCode == 190 && true === e.CtrlKey ) // Ctrl + .
    {
        var TextPr = drawingObjectsController.getParagraphTextPr();
        if ( isRealObject(TextPr))
        {
            if(typeof state.setCellSubscript === "function")
            {
                state.setCellSubscript(TextPr.VertAlign === vertalign_SubScript ? false : true );
            }
            bRetValue = true;
        }
    }
    else if ( e.keyCode == 219 && false === isViewMode && true === e.CtrlKey ) // Ctrl + [
    {
        if(typeof state.decreaseFontSize === "function")
        {
            state.decreaseFontSize();
        }
        bRetValue = true;
    }
    else if ( e.keyCode == 221 && false === isViewMode && true === e.CtrlKey ) // Ctrl + ]
    {
        if(typeof state.increaseFontSize === "function")
        {
            state.increaseFontSize();
        }
        bRetValue = true;
    }
    if(bRetValue)
        e.preventDefault();
    return bRetValue;
}

function CompareGroups(a, b)
{
    if(!isRealObject(a.group) && !isRealObject(b.group))
        return 0;
    if(!isRealObject(a.group))
        return 1;
    if(!isRealObject(b.group))
        return -1;

    var count1 = 0;
    var cur_group = a.group;
    while(isRealObject(cur_group))
    {
        ++count1;
        cur_group = cur_group.group;
    }
    var count2 = 0;
    cur_group = b.group;
    while(isRealObject(cur_group))
    {
        ++count2;
        cur_group = cur_group.group;
    }
    return count1 - count2;
}



