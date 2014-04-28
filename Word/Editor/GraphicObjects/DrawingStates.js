var MOVE_DELTA = 1/100000;

var STATES_ID_NULL = 0x00;
var STATES_ID_PRE_CHANGE_ADJ = 0x01;
var STATES_ID_PRE_MOVE = 0x02;
var STATES_ID_PRE_MOVE_INLINE_OBJECT = 0x03;
var STATES_ID_PRE_ROTATE = 0x04;
var STATES_ID_PRE_RESIZE = 0x05;
var STATES_ID_CHANGE_ADJ = 0x06;
var STATES_ID_MOVE = 0x07;
var STATES_ID_START_ADD_NEW_SHAPE = 0x08;
var STATES_ID_START_TRACK_NEW_SHAPE = 0x09;
var STATES_ID_TRACK_NEW_SHAPE = 0x09;
var STATES_ID_ROTATE = 0x10;
var STATES_ID_RESIZE = 0x11;
var STATES_ID_GROUP = 0x12;
var STATES_ID_TEXT_ADD = 0x13;
var STATES_ID_PRE_CHANGE_ADJ_GROUPED = 0x14;
var STATES_ID_CHANGE_ADJ_GROUPED = 0x15;
var STATES_ID_TEXT_ADD_IN_GROUP = 0x16;
var STATES_ID_START_CHANGE_WRAP = 0x17;
var STATES_ID_PRE_CHANGE_WRAP = 0x18;
var STATES_ID_PRE_CHANGE_WRAP_ADD = 0x19;
var STATES_ID_PRE_CHANGE_WRAP_CONTOUR = 0x19;
var STATES_ID_SPLINE_BEZIER = 0x20;
var STATES_ID_SPLINE_BEZIER33 = 0x21;
var STATES_ID_SPLINE_BEZIER2 = 0x22;
var STATES_ID_SPLINE_BEZIER3 = 0x23;
var STATES_ID_SPLINE_BEZIER4 = 0x24;
var STATES_ID_SPLINE_BEZIER5 = 0x25;
var STATES_ID_MOVE_INLINE_OBJECT = 0x26;
var STATES_ID_NULL_HF = 0x27;
var STATES_ID_START_ADD_TEXT_RECT = 0x28;
var STATES_ID_START_TRACK_TEXT_RECT = 0x29;
var STATES_ID_TRACK_TEXT_RECT = 0x30;
var STATES_ID_PRE_RESIZE_GROUPED = 0x31;
var STATES_ID_RESIZE_GROUPED = 0x32;
var STATES_ID_PRE_MOVE_IN_GROUP = 0x33;
var STATES_ID_MOVE_IN_GROUP = 0x34;
var STATES_ID_PRE_ROTATE_IN_GROUP = 0x35;
var STATES_ID_ROTATE_IN_GROUP = 0x36;
var STATES_ID_PRE_CH_ADJ_IN_GROUP = 0x37;
var STATES_ID_CH_ADJ_IN_GROUP = 0x38;
var STATES_ID_PRE_RESIZE_IN_GROUP = 0x39;
var STATES_ID_RESIZE_IN_GROUP = 0x40;
var STATES_ID_PRE_ROTATE_IN_GROUP2 = 0x41;
var STATES_ID_ROTATE_IN_GROUP2 = 0x42;
var STATES_ID_CHART = 0x43;
var STATES_ID_CHART_TITLE_TEXT = 0x44;
var STATES_ID_PRE_MOVE_CHART_TITLE = 0x45;
var STATES_ID_MOVE_CHART_TITLE = 0x46;
var STATES_ID_PRE_MOVE_CHART_TITLE_GROUP = 0x47;
var STATES_ID_MOVE_CHART_TITLE_GROUP = 0x48;
var STATES_ID_CHART_GROUP = 0x49;
var STATES_ID_CHART_TITLE_TEXT_GROUP = 0x50;

var SNAP_DISTANCE = 1.27;

function CheckCoordsNeedPage(x, y, pageIndex, needPageIndex, drawingDocument)
{
    if(pageIndex === needPageIndex)
        return {x:x, y:y};
    else
    {
        var  t = drawingDocument.ConvertCoordsToAnotherPage(x,y, pageIndex, needPageIndex);
        return {x: t.X, y: t.Y};
    }
}


function StartAddNewShape(drawingObjects, preset)
{
    this.drawingObjects = drawingObjects;
    this.preset = preset;

    this.bStart = false;
    this.bMoved = false;//отошли ли мы от начальной точки

    this.pageIndex = null;
    this.startX = null;
    this.startY = null;

}

StartAddNewShape.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {
        if(this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR)
            return {objectId: null, bMarker: true};
        this.pageIndex = pageIndex;
        this.startX = x;
        this.startY = y;
        this.drawingObjects.arrPreTrackObjects.length = 0;
        this.drawingObjects.arrPreTrackObjects.push(new NewShapeTrack(this.preset, x, y, this.drawingObjects.document.theme, null, null, null, pageIndex));
        this.bStart = true;
        this.drawingObjects.swapTrackObjects();
    },

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(this.bStart && e.IsLocked)
        {
            if(!this.bMoved && (Math.abs(this.startX - x) > MOVE_DELTA || Math.abs(this.startY - y) > MOVE_DELTA || this.pageIndex !== pageIndex))
                this.bMoved = true;
            var tx, ty;
            if(this.pageIndex !== pageIndex)
            {
                var t = this.drawingObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.pageIndex);
                tx = t.X;
                ty = t.Y;
            }
            else
            {
                tx = x;
                ty = y;
            }
            this.drawingObjects.arrTrackObjects[0].track(e, tx, ty);
            this.drawingObjects.updateOverlay();
        }
    },

    onMouseUp: function(e, x, y, pageIndex)
    {
        if(this.bStart)
        {
            History.Create_NewPoint();
            var bounds = this.drawingObjects.arrTrackObjects[0].getBounds();
            var shape = this.drawingObjects.arrTrackObjects[0].getShape(true);
            var drawing = new ParaDrawing(bounds.max_x - bounds.min_x, bounds.max_y - bounds.min_y, shape, this.drawingObjects.drawingDocument, this.drawingObjects.document, null);
            var nearest_pos = this.drawingObjects.document.Get_NearestPos(this.pageIndex, bounds.min_x, bounds.min_y, true, drawing);
            if(false === editor.isViewMode && nearest_pos!= null && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_None, {Type : changestype_2_Element_and_Type , Element : nearest_pos.Paragraph, CheckType : changestype_Paragraph_Content} ) && false === editor.isViewMode)
            {
                drawing.Set_DrawingType(drawing_Anchor);
                drawing.Set_GraphicObject(shape);
                shape.setParent(drawing);
                drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
                drawing.Set_Distance( 3.2,  0,  3.2, 0 );
                nearest_pos.Page = this.pageIndex;
                drawing.Set_XYForAdd(bounds.min_x, bounds.min_y, nearest_pos, this.pageIndex);
                drawing.Add_ToDocument(nearest_pos, false);
                this.drawingObjects.resetSelection();
                shape.select(this.drawingObjects, this.pageIndex);
                this.drawingObjects.document.Recalculate()
            }
            else
            {
                this.drawingObjects.document.Document_Undo();
            }
        }
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.updateOverlay();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
        editor.sync_StartAddShapeCallback( false );
        editor.sync_EndAddShape();
    }
};


function NullState(drawingObjects)
{
    this.drawingObjects = drawingObjects;
}

NullState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex, bTextFlag)
    {
        var ret;
        var selection = this.drawingObjects.selection;
        var b_no_handle_selected = false;
        if(selection.wrapPolygonSelection)
        {
            b_no_handle_selected = true;
            var  object_page_x, object_page_y;
            var coords = CheckCoordsNeedPage(x, y, pageIndex, selection.wrapPolygonSelection.selectStartPage, this.drawingObjects.drawingDocument);
            object_page_x = coords.x;
            object_page_y = coords.y;
            var hit_to_wrap_polygon = selection.wrapPolygonSelection.parent.hitToWrapPolygonPoint(object_page_x, object_page_y);
            var wrap_polygon = selection.wrapPolygonSelection.parent.wrappingPolygon;
            if(hit_to_wrap_polygon.hit)
            {
                if(this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
                {
                    if(hit_to_wrap_polygon.hitType === WRAP_HIT_TYPE_POINT)
                    {
                        if(!e.CtrlKey)
                        {
                            this.drawingObjects.changeCurrentState(new PreChangeWrapContour(this.drawingObjects, selection.wrapPolygonSelection, hit_to_wrap_polygon.pointNum));
                        }
                        else
                        {
                            if(wrap_polygon.relativeArrPoints.length > 3)
                            {
                                if(false === editor.isViewMode && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_Element_and_Type , Element : selection.wrapPolygonSelection.parent.Get_ParentParagraph(), CheckType : changestype_Paragraph_Content}))
                                {
                                    History.Create_NewPoint();
                                    var new_rel_array = [].concat(wrap_polygon.relativeArrPoints);
                                    new_rel_array.splice(hit_to_wrap_polygon.pointNum, 1);
                                    wrap_polygon.setEdited(true);
                                    wrap_polygon.setArrRelPoints(new_rel_array);
                                    this.drawingObjects.document.Recalculate();
                                    this.drawingObjects.updateOverlay();
                                }
                            }
                        }
                        return true;
                    }
                    else
                    {
                        this.drawingObjects.changeCurrentState(new PreChangeWrapContourAddPoint(this.drawingObjects, selection.wrapPolygonSelection, Math.min(hit_to_wrap_polygon.pointNum1, hit_to_wrap_polygon.pointNum2), object_page_x, object_page_y));
                        return true;
                    }
                }
                else
                {
                    return {objectId: selection.wrapPolygonSelection.Get_Id(), cursorType: "default"};
                }
            }
        }
        else if(selection.groupSelection)
        {
            ret = handleSelectedObjects(this.drawingObjects, e, x, y, selection.groupSelection, pageIndex, true);
            if(ret)
                return ret;
            ret = handleFloatObjects(this.drawingObjects, selection.groupSelection.arrGraphicObjects, e, x, y, selection.groupSelection, pageIndex, true);
            if(ret)
                return ret;
        }
        else if(selection.chartSelection)
        {}
        if(this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            this.drawingObjects.resetInternalSelection();
            this.drawingObjects.updateOverlay();
        }
        if(!b_no_handle_selected)
        {
            ret = handleSelectedObjects(this.drawingObjects, e, x, y, null, pageIndex, true);
            if(ret)
                return ret;
        }

        var drawing_page;
        if(this.drawingObjects.document.CurPos.Type !== docpostype_HdrFtr)
        {
            drawing_page = this.drawingObjects.graphicPages[pageIndex];
        }
        else
        {
            drawing_page = this.drawingObjects.getHdrFtrObjectsByPageIndex(pageIndex);
        }
        ret = handleFloatObjects(this.drawingObjects, drawing_page.beforeTextObjects, e, x, y, null, pageIndex, true);
        if(ret)
            return ret;

        var no_shape_child_array = [];
        for(var i = 0; i < drawing_page.inlineObjects.length; ++i)
        {
            if(!drawing_page.inlineObjects[i].parent.isShapeChild())
                no_shape_child_array.push(drawing_page.inlineObjects[i]);
        }
        ret = handleInlineObjects(this.drawingObjects, no_shape_child_array, e, x, y, pageIndex, true);
        if(ret)
            return ret;

        if(!bTextFlag)
        {
            ret = handleFloatObjects(this.drawingObjects, drawing_page.wrappingObjects, e, x, y, null, pageIndex, true);
            if(ret)
                return ret;

            ret = handleFloatObjects(this.drawingObjects, drawing_page.behindDocObjects, e, x, y, null, pageIndex, true);
            if(ret)
                return ret;
        }
        return null;

    },

    onMouseMove: function(e, x, y, pageIndex)
    {},

    onMouseUp: function(e, x, y, pageIndex)
    {}
};


function PreChangeAdjState(drawingObjects, majorObject)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}

PreChangeAdjState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},

    onMouseMove: function(e, x, y, pageIndex)
    {
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new ChangeAdjState(this.drawingObjects, this.majorObject));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },

    onMouseUp: function(e, x, y, pageIndex)
    {
        this.drawingObjects.clearPreTrackObjects();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};

function PreMoveInlineObject(drawingObjects, majorObject)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}

PreMoveInlineObject.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {
        if(this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR)
            return {cursorType: "default", objectId: this.majorObject.Get_Id()};
    },

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(!e.IsLocked)
        {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.drawingObjects.changeCurrentState(new MoveInlineObject(this.drawingObjects, this.majorObject));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },

    onMouseUp: function(e, x,y,pageIndex)
    {
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};


function MoveInlineObject(drawingObjects, majorObject)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.InlinePos = null;
}

MoveInlineObject.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {
        if(this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR)
            return {cursorType: "default", objectId: this.majorObject.Get_Id()};
    },

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(!e.IsLocked)
        {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.InlinePos = this.drawingObjects.document.Get_NearestPos(pageIndex, x, y, false, this.majorObject.parent);
        this.InlinePos.Page = pageIndex;
        this.drawingObjects.updateOverlay();
    },

    onMouseUp: function(e, x,y,pageIndex)
    {
        var check_paragraphs = [];
        if(!e.CtrlKey)
        {
            var parent_paragraph = this.majorObject.parent.checkShapeChildAndGetTopParagraph();
            check_paragraphs.push(parent_paragraph);
            var new_check_paragraph = this.majorObject.parent.checkShapeChildAndGetTopParagraph(this.InlinePos.Paragraph);
            if(parent_paragraph !== new_check_paragraph)
                check_paragraphs.push(new_check_paragraph);
            if(false === editor.isViewMode &&  false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_ElementsArray_and_Type , Elements : check_paragraphs, CheckType : changestype_Paragraph_Content}))
            {
                History.Create_NewPoint();
                this.majorObject.parent.OnEnd_MoveInline(this.InlinePos);
            }
        }
        else
        {
            check_paragraphs.push(this.majorObject.parent.checkShapeChildAndGetTopParagraph(this.InlinePos.Paragraph));
            if(false === editor.isViewMode && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_ElementsArray_and_Type , Elements : check_paragraphs, CheckType : changestype_Paragraph_Content}))
            {
                History.Create_NewPoint();
                var new_para_drawing = new ParaDrawing(this.majorObject.parent.W, this.majorObject.parent.H, null, this.drawingObjects.drawingDocument, null, null);
                var drawing = this.majorObject.createDuplicate();
                drawing.setParent(new_para_drawing);
                new_para_drawing.Set_GraphicObject(drawing);
                new_para_drawing.Add_ToDocument(this.InlinePos);
                this.drawingObjects.document.Recalculate();
            }
        }
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};


function ChangeAdjState(drawingObjects, majorObject)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}

ChangeAdjState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(!e.IsLocked)
        {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        var t = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage, this.drawingObjects.drawingDocument);
        this.drawingObjects.arrTrackObjects[0].track(t.x, t.y);
        this.drawingObjects.updateOverlay();
    },

    onMouseUp: function(e, x, y, pageIndex)
    {
        if(editor.isViewMode === false)
        {
            var bounds = this.drawingObjects.arrTrackObjects[0].getBounds();
            var check_paragraphs = [];
            var nearest_pos = this.drawingObjects.document.Get_NearestPos(this.majorObject.parent.pageIndex, bounds.min_x, bounds.min_y, !this.majorObject.parent.Is_Inline(), this.majorObject.parent);
            check_paragraphs.push(nearest_pos.Paragraph);
            var parent_paragraph = this.majorObject.parent.Get_ParentParagraph();
            if(isRealObject(parent_paragraph) && parent_paragraph !== nearest_pos.Paragraph)
            {
                check_paragraphs.push(parent_paragraph);
            }
            if(false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_ElementsArray_and_Type , Elements : check_paragraphs, CheckType : changestype_Paragraph_Content}))
            {
                History.Create_NewPoint();
                this.drawingObjects.arrTrackObjects[0].trackEnd();
                if(!this.majorObject.parent.Is_Inline())
                {
                    this.majorObject.parent.OnEnd_ChangeFlow(bounds.min_x, bounds.min_y, this.majorObject.parent.pageIndex, bounds.max_x - bounds.min_x, bounds.max_y - bounds.min_y, nearest_pos, true, true);
                }
                else
                {
                    this.majorObject.parent.OnEnd_ResizeInline(bounds.max_x - bounds.min_x, bounds.max_y - bounds.min_y);
                }
                this.drawingObjects.document.Recalculate();
            }
        }
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.updateOverlay();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};


function PreRotateState(drawingObjects, majorObject)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}

PreRotateState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(!e.IsLocked)
        {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new RotateState(this.drawingObjects, this.majorObject));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },

    onMouseUp: function(e, x, y, pageIndex)
    {
        this.drawingObjects.clearPreTrackObjects();
    }
};

function RotateState(drawingObjects, majorObject)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}

RotateState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(!e.IsLocked)
        {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        var coords = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage, this.drawingObjects.drawingDocument);
        this.drawingObjects.handleRotateTrack(e, coords.x, coords.y);
    },

    onMouseUp: function(e, x, y, pageIndex)
    {
        if(editor.isViewMode === false)
        {
            var bounds;
            if(this.majorObject.parent.Is_Inline())
            {
                if(this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_Element_and_Type , Element : this.majorObject.parent.checkShapeChildAndGetTopParagraph(), CheckType : changestype_Paragraph_Content}) === false)
                {
                    History.Create_NewPoint();
                    bounds = this.drawingObjects.arrTrackObjects[0].getBounds();
                    this.drawingObjects.arrTrackObjects[0].trackEnd(true);
                    this.majorObject.parent.OnEnd_ResizeInline(bounds.max_x - bounds.min_x, bounds.max_y - bounds.min_y);
                }
            }
            else
            {
                var arr_bounds = [];
                var arr_nearest_pos = [];
                var check_paragraphs = [];
                var nearest_pos;
                var i, j, page_index;
                for(i = 0; i < this.drawingObjects.arrTrackObjects.length; ++i)
                {
                    bounds = this.drawingObjects.arrTrackObjects[i].getBounds();
                    arr_bounds.push(bounds);
                    page_index = isRealNumber(this.drawingObjects.arrTrackObjects[i].pageIndex) ? this.drawingObjects.arrTrackObjects[i].pageIndex : this.drawingObjects.arrTrackObjects[i].originalObject.parent.pageIndex;
                    nearest_pos = this.drawingObjects.document.Get_NearestPos(page_index, bounds.min_x, bounds.min_y, true, this.drawingObjects.arrTrackObjects[i].originalObject.parent);
                    arr_nearest_pos.push(nearest_pos);
                    for(j = 0; j < check_paragraphs.length; ++j)
                    {
                        if(check_paragraphs[j] === nearest_pos.Paragraph)
                            break;
                    }
                    if(j === check_paragraphs.length)
                        check_paragraphs.push(nearest_pos.Paragraph);
                }
                if(false === editor.isViewMode && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_ElementsArray_and_Type , Elements : check_paragraphs, CheckType : changestype_Paragraph_Content}))
                {
                    History.Create_NewPoint();
                    for(i = 0; i < this.drawingObjects.arrTrackObjects.length; ++i)
                    {
                        bounds = arr_bounds[i];
                        this.drawingObjects.arrTrackObjects[i].trackEnd(true);
                        this.drawingObjects.arrTrackObjects[i].originalObject.parent.OnEnd_ChangeFlow(bounds.min_x, bounds.min_y,this.drawingObjects.arrTrackObjects[i].originalObject.parent, bounds.max_x - bounds.min_x, bounds.max_y - bounds.min_y, arr_nearest_pos[i], true, false);
                    }
                    this.drawingObjects.document.Recalculate();
                }
            }
        }
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.updateOverlay();
    }
};


function PreResizeState(drawingObjects, majorObject, cardDirection)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.cardDirection = cardDirection;
    this.handleNum = this.majorObject.getNumByCardDirection(cardDirection);
}

PreResizeState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(!e.IsLocked)
        {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new ResizeState(this.drawingObjects, this.majorObject, this.handleNum));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },

    onMouseUp: function(e, x, y, pageIndex)
    {

    }
};

function ResizeState(drawingObjects, majorObject, handleNum)
{
    this.drawingObjects = drawingObjects;
    this.majorObject  = majorObject;
    this.handleNum = handleNum;
}

ResizeState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(!e.IsLocked)
        {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        var coords = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage, this.drawingObjects.drawingDocument);
        var resize_coef = this.majorObject.getResizeCoefficients(this.handleNum, coords.x, coords.y);
        this.drawingObjects.trackResizeObjects(resize_coef.kd1, resize_coef.kd2, e);
        this.drawingObjects.updateOverlay();
    },

    onMouseUp: RotateState.prototype.onMouseUp
};


function PreMoveState(drawingObjects,  startX, startY, shift, ctrl, majorObject, majorObjectIsSelected, bInside)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.startX = startX;
    this.startY = startY;
    this.shift = shift;
    this.ctrl = ctrl;
    this.majorObjectIsSelected = majorObjectIsSelected;
    this.bInside = bInside;
}

PreMoveState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(!e.IsLocked)
        {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        if(Math.abs(this.startX - x) > MOVE_DELTA || Math.abs(this.startY - y) > MOVE_DELTA || pageIndex !== this.majorObject.parent.pageIndex)
        {
            this.drawingObjects.swapTrackObjects();
            this.drawingObjects.changeCurrentState(new MoveState(this.drawingObjects, this.majorObject, this.startX, this.startY));
            this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
        }
    },

    onMouseUp: function(e, x, y, pageIndex)
    {
        return handleMouseUpPreMoveState(this.drawingObjects, e, x, y, pageIndex, true)
    }
};

function MoveState(drawingObjects, majorObject, startX, startY)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;

    this.startX = startX;
    this.startY = startY;
}

MoveState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(!e.IsLocked)
        {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        var _arr_track_objects = this.drawingObjects.arrTrackObjects;
        var _objects_count = _arr_track_objects.length;
        var _object_index;

        var result_x, result_y;
        if(!e.ShiftKey)
        {
            result_x = x;
            result_y = y;
        }
        else
        {
            var abs_dist_x = Math.abs(this.startX - x);
            var abs_dist_y = Math.abs(this.startY - y);
            if(abs_dist_x > abs_dist_y)
            {
                result_x = x;
                result_y = this.startY;
            }
            else
            {
                result_x = this.startX;
                result_y = y;
            }
        }

        var tr_to_start_page_x;
        var tr_to_start_page_y;

        var t = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.parent.pageIndex, this.drawingObjects.drawingDocument);

        var startPage = this.drawingObjects.graphicPages[this.majorObject.parent.pageIndex];
        var startPos = {x: this.startX, y: this.startY};
        var start_arr = startPage.beforeTextObjects.concat(startPage.wrappingObjects, startPage.inlineObjects, startPage.behindDocObjects);
        var min_dx = null, min_dy = null;
        var dx, dy;
        var snap_x = null, snap_y = null;

        var snapHorArray = [], snapVerArray = [];
        snapHorArray.push(X_Left_Field);
        snapHorArray.push(X_Right_Field);
        snapHorArray.push(Page_Width/2);
        snapVerArray.push(Y_Top_Field);
        snapVerArray.push(Y_Bottom_Field);
        snapVerArray.push(Page_Height/2);
        if(result_x === this.startX)
        {
            min_dx = 0;
        }
        else
        {
            for(var track_index = 0; track_index < _arr_track_objects.length; ++track_index)
            {
                var cur_track_original_shape = _arr_track_objects[track_index].originalObject;
                var trackSnapArrayX = cur_track_original_shape.snapArrayX;
                var curDX =  result_x - startPos.x;


                for(snap_index = 0; snap_index < trackSnapArrayX.length; ++snap_index)
                {
                    var snap_obj = GetMinSnapDistanceXObjectByArrays(trackSnapArrayX[snap_index] + curDX, snapHorArray);
                    if(isRealObject(snap_obj))
                    {
                        dx = snap_obj.dist;
                        if(dx !== null)
                        {
                            if(min_dx === null)
                            {
                                min_dx = dx;
                                snap_x = snap_obj.pos;
                            }
                            else
                            {
                                if(Math.abs(min_dx) > Math.abs(dx))
                                {
                                    min_dx = dx;
                                    snap_x = snap_obj.pos;
                                }
                            }
                        }
                    }
                }

                if(start_arr.length > 0)
                {
                    for(var snap_index = 0; snap_index < trackSnapArrayX.length; ++snap_index)
                    {
                        var snap_obj = GetMinSnapDistanceXObject(trackSnapArrayX[snap_index] + curDX, start_arr);
                        if(isRealObject(snap_obj))
                        {
                            dx = snap_obj.dist;
                            if(dx !== null)
                            {
                                if(min_dx === null)
                                {
                                    snap_x = snap_obj.pos;
                                    min_dx = dx;
                                }
                                else
                                {
                                    if(Math.abs(min_dx) > Math.abs(dx))
                                    {
                                        min_dx = dx;
                                        snap_x = snap_obj.pos;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if(result_y === this.startY)
        {
            min_dy = 0;
        }
        else
        {
            for(track_index = 0; track_index < _arr_track_objects.length; ++track_index)
            {
                cur_track_original_shape = _arr_track_objects[track_index].originalObject;
                var trackSnapArrayY = cur_track_original_shape.snapArrayY;
                var curDY =  result_y - startPos.y;


                for(snap_index = 0; snap_index < trackSnapArrayY.length; ++snap_index)
                {
                    var snap_obj = GetMinSnapDistanceYObjectByArrays(trackSnapArrayY[snap_index] + curDY, snapVerArray);
                    if(isRealObject(snap_obj))
                    {
                        dy = snap_obj.dist;
                        if(dy !== null)
                        {
                            if(min_dy === null)
                            {
                                min_dy = dy;
                                snap_y = snap_obj.pos;
                            }
                            else
                            {
                                if(Math.abs(min_dy) > Math.abs(dy))
                                {
                                    min_dy = dy;
                                    snap_y = snap_obj.pos;
                                }
                            }
                        }
                    }
                }

                if(start_arr.length > 0)
                {
                    for(snap_index = 0; snap_index < trackSnapArrayY.length; ++snap_index)
                    {
                        var snap_obj = GetMinSnapDistanceYObject(trackSnapArrayY[snap_index] + curDY, start_arr);
                        if(isRealObject(snap_obj))
                        {
                            dy = snap_obj.dist;
                            if(dy !== null)
                            {
                                if(min_dy === null)
                                {
                                    min_dy = dy;
                                    snap_y = snap_obj.pos;
                                }
                                else
                                {
                                    if(Math.abs(min_dy) > Math.abs(dy))
                                    {
                                        min_dy = dy;
                                        snap_y = snap_obj.pos;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }



        if(min_dx === null || Math.abs(min_dx) > SNAP_DISTANCE)
            min_dx = 0;
        else
        {
            if(isRealNumber(snap_x))
            {
                this.drawingObjects.drawingDocument.DrawVerAnchor(pageIndex, snap_x);
            }
        }

        if(min_dy === null || Math.abs(min_dy) > SNAP_DISTANCE)
            min_dy = 0;
        else
        {
            if(isRealNumber(snap_y))
            {
                this.drawingObjects.drawingDocument.DrawHorAnchor(pageIndex, snap_y);
            }
        }

        for(_object_index = 0; _object_index < _objects_count; ++_object_index)
            _arr_track_objects[_object_index].track(result_x - this.startX + min_dx, result_y - this.startY + min_dy, pageIndex);
        this.drawingObjects.updateOverlay();
    },

    onMouseUp: RotateState.prototype.onMouseUp
};

function PreMoveInGroupState(drawingObjects, group, startX, startY, ShiftKey, CtrlKey, majorObject,  majorObjectIsSelected)
{
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.startX = startX;
    this.startY = startY;
    this.ShiftKey = ShiftKey;
    this.CtrlKey  = CtrlKey;
    this.majorObject = majorObject;
    this.majorObjectIsSelected = majorObjectIsSelected;
}

PreMoveInGroupState.prototype =
{
    onMouseDown: function(e, x,y,pageIndex)
    {},

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(!e.IsLocked)
        {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        if(Math.abs(this.startX - x) > MOVE_DELTA || Math.abs(this.startY - y) > MOVE_DELTA || pageIndex !== this.majorObject.parent.pageIndex)
        {
            this.drawingObjects.swapTrackObjects();
            this.drawingObjects.changeCurrentState(new MoveInGroupState(this.drawingObjects, this.majorObject, this.group, this.startX, this.startY));
            this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
        }
    },

    onMouseUp: function(e, x, y, pageIndex)
    {
        this.drawingObjects.clearPreTrackObjects();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};

function MoveInGroupState(drawingObjects, majorObject, group, startX, startY)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.group = group;
    this.startX = startX;
    this.startY = startY;
}

MoveInGroupState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},

    onMouseMove: MoveState.prototype.onMouseMove,

    onMouseUp: function(e, x, y, pageIndex)
    {
        History.Create_NewPoint();
        var old_x = this.group.bounds.x;
        var old_y = this.group.bounds.y;
        var i;
        for(i = 0; i < this.drawingObjects.arrTrackObjects.length; ++i)
        {
            this.drawingObjects.arrTrackObjects[i].trackEnd(true);
        }
        this.group.updateCoordinatesAfterInternalResize();
        this.group.recalculate();
        var bounds = this.group.bounds;
        var check_paragraphs = [];
        check_paragraphs.push(this.group.parent.Get_ParentParagraph());
        this.group.spPr.xfrm.setOffX(0);
        this.group.spPr.xfrm.setOffY(0);
        if(this.group.parent.Is_Inline())
        {
            this.group.parent.OnEnd_ResizeInline(bounds.w, bounds.h);
        }
        else
        {
            var nearest_pos = this.drawingObjects.document.Get_NearestPos(this.group.parent.pageIndex, this.group.parent.X + (bounds.x - old_x), this.group.parent.Y + (bounds.y - old_y), true, this.group.parent);
            if(nearest_pos.Paragraph !== check_paragraphs[0])
                check_paragraphs.push(nearest_pos.Paragraph);

            this.group.parent.OnEnd_ChangeFlow(this.group.parent.X + (bounds.x - old_x), this.group.parent.Y + (bounds.y - old_y), this.group.parent.pageIndex, bounds.w, bounds.h, nearest_pos, true, false);
        }
        if(false === editor.isViewMode && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_ElementsArray_and_Type , Elements : check_paragraphs, CheckType : changestype_Paragraph_Content}))
        {
            this.drawingObjects.document.Recalculate();
        }
        else
        {
            this.drawingObjects.document.Document_Undo();
        }
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};


function PreRotateInGroupState(drawingObjects, group, majorObject)
{
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
}

PreRotateInGroupState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(!e.IsLocked)
        {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new RotateInGroupState(this.drawingObjects, this.group, this.majorObject))
    },

    onMouseUp: PreMoveInGroupState.onMouseUp
};

function RotateInGroupState(drawingObjects, group, majorObject)
{
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
}

RotateInGroupState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},

    onMouseMove: RotateState.prototype.onMouseMove,

    onMouseUp: MoveInGroupState.prototype.onMouseUp
};

function PreResizeInGroupState(drawingObjects, group, majorObject, cardDirection)
{
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.cardDirection = cardDirection;
}

PreResizeInGroupState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},

    onMouseMove: function(e, x, y, pageIndex)
    {
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new ResizeInGroupState(this.drawingObjects, this.group, this.majorObject, this.majorObject.getNumByCardDirection(this.cardDirection), this.cardDirection));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },

    onMouseUp: PreMoveInGroupState.prototype.onMouseUp
};

function ResizeInGroupState(drawingObjects, group, majorObject, handleNum, cardDirection)
{
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.handleNum = handleNum;
    this.cardDirection = cardDirection;
}

ResizeInGroupState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},
    onMouseMove: ResizeState.prototype.onMouseMove,
    onMouseUp: MoveInGroupState.prototype.onMouseUp
};

function PreChangeAdjInGroupState(drawingObjects, group)
{
    this.drawingObjects = drawingObjects;
    this.group = group;
}

PreChangeAdjInGroupState.prototype =
{
    onMouseDown: function(e, x, y,pageIndex)
    {},

    onMouseMove: function(e, x, y, pageIndex)
    {
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new ChangeAdjInGroupState(this.drawingObjects, this.group));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },

    onMouseUp: PreMoveInGroupState.prototype.onMouseUp
};

function ChangeAdjInGroupState(drawingObjects, group)
{
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = drawingObjects.arrTrackObjects[0].originalShape;
}

ChangeAdjInGroupState.prototype =
{
    onMouseDown: function(e, x, y,pageIndex)
    {},

    onMouseMove: ChangeAdjState.prototype.onMouseMove,

    onMouseUp: MoveInGroupState.prototype.onMouseUp
};

function TextAddState(drawingObjects, majorObject)
{
    this.drawingObjects =drawingObjects;
    this.majorObject = majorObject;
}

TextAddState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},
    onMouseMove: function(e, x, y, pageIndex)
    {
        if(!e.IsLocked)
        {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.majorObject.selectionSetEnd(e, x, y, pageIndex);
    },
    onMouseUp: function(e, x, y, pageIndex)
    {
        this.majorObject.selectionSetEnd(e, x, y, pageIndex);
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }

};



function StartChangeWrapContourState(drawingObjects, majorObject)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}

StartChangeWrapContourState.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {

    },

    onMouseMove: function(e, x, y, pageIndex)
    {},

    onMouseUp: function(e, x, y, pageIndex)
    {}
};

function PreChangeWrapContour(drawingObjects, majorObject, pointNum)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.pointNum = pointNum;
}

PreChangeWrapContour.prototype.onMouseDown = function(e, x, y, pageIndex)
{};
PreChangeWrapContour.prototype.onMouseMove = function(e, x, y, pageIndex)
{
    this.drawingObjects.clearPreTrackObjects();
    this.drawingObjects.addPreTrackObject(new TrackPointWrapPointWrapPolygon(this.majorObject, this.pointNum));
    this.drawingObjects.swapTrackObjects();
    this.drawingObjects.changeCurrentState(new ChangeWrapContour(this.drawingObjects, this.majorObject));
};
PreChangeWrapContour.prototype.onMouseUp =  function(e, x, y, pageIndex)
{
    this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
};



function ChangeWrapContour(drawingObjects, majorObject)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}



ChangeWrapContour.prototype.onMouseDown = function(e, x, y, pageIndex)
{};
ChangeWrapContour.prototype.onMouseMove = function(e, x, y, pageIndex)
{
    var coords = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage);
    var tr_x, tr_y;
    tr_x = coords.x;
    tr_y = coords.y;
    this.drawingObjects.arrTrackObjects[0].track(tr_x, tr_y);
    this.drawingObjects.updateOverlay();
};
ChangeWrapContour.prototype.onMouseUp = function(e, x, y, pageIndex)
{
    if(false === editor.isViewMode && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_Element_and_Type , Element : this.drawingObjects.selection.wrapPolygonSelection.parent.Get_ParentParagraph(), CheckType : changestype_Paragraph_Content}))
    {
        History.Create_NewPoint();
        var calc_points = [], calc_points2 = [], i;
        for(i = 0; i < this.majorObject.parent.wrappingPolygon.calculatedPoints.length; ++i)
        {
            calc_points[i] = {x: this.majorObject.parent.wrappingPolygon.calculatedPoints[i].x, y: this.majorObject.parent.wrappingPolygon.calculatedPoints[i].y};
        }
        calc_points[this.drawingObjects.arrTrackObjects[0].point].x = this.drawingObjects.arrTrackObjects[0].pointCoord.x;
        calc_points[this.drawingObjects.arrTrackObjects[0].point].y = this.drawingObjects.arrTrackObjects[0].pointCoord.y;
        var invert_transform = this.majorObject.invertTransform;
        for(i = 0; i < calc_points.length; ++i)
        {
            calc_points2[i] =
            {
                x: (invert_transform.TransformPointX(calc_points[i].x, calc_points[i].y)/this.majorObject.extX)*21600 >> 0,
                y: (invert_transform.TransformPointY(calc_points[i].x, calc_points[i].y)/this.majorObject.extY)*21600 >> 0
            }
        }
        this.majorObject.parent.wrappingPolygon.setEdited(true);
        this.majorObject.parent.wrappingPolygon.setArrRelPoints(calc_points2);
        this.drawingObjects.document.Recalculate();
    }
    this.drawingObjects.clearTrackObjects();
    this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
};

function PreChangeWrapContourAddPoint(drawingObjects, majorObject, pointNum1, startX, startY)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.pointNum1 = pointNum1;
    this.startX = startX;
    this.startY = startY;
}

PreChangeWrapContourAddPoint.prototype =
{
    onMouseDown: function(e, x, y, pageIndex)
    {},

    onMouseMove: function(e, x, y, pageIndex)
    {
        if(!e.IsLocked)
        {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.drawingObjects.clearPreTrackObjects();
        this.drawingObjects.addPreTrackObject(new TrackNewPointWrapPolygon(this.majorObject, this.pointNum1));
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new ChangeWrapContourAddPoint(this.drawingObjects, this.majorObject));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },

    onMouseUp: function(e, x, y, pageIndex)
    {
        this.drawingObjects.clearPreTrackObjects();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};



function ChangeWrapContourAddPoint(drawingObjects, majorObject)
{
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}



ChangeWrapContourAddPoint.prototype.onMouseDown = function(e, x, y, pageIndex)
{};
ChangeWrapContourAddPoint.prototype.onMouseMove = function(e, x, y, pageIndex)
{
    var coords = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage);
    var tr_x, tr_y;
    tr_x = coords.x;
    tr_y = coords.y;
    this.drawingObjects.arrTrackObjects[0].track(tr_x, tr_y);
    this.drawingObjects.updateOverlay();
};
ChangeWrapContourAddPoint.prototype.onMouseUp = function(e, x, y, pageIndex)
{
    if(false === editor.isViewMode && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_Element_and_Type , Element : this.drawingObjects.selection.wrapPolygonSelection.parent.Get_ParentParagraph(), CheckType : changestype_Paragraph_Content}))
    {
        History.Create_NewPoint();
        var calc_points = [], calc_points2 = [], i;
        for(i = 0; i < this.drawingObjects.arrTrackObjects[0].arrPoints.length; ++i)
        {
            calc_points[i] = {x: this.drawingObjects.arrTrackObjects[0].arrPoints[i].x, y: this.drawingObjects.arrTrackObjects[0].arrPoints[i].y};
        }
        //calc_points.splice(this.drawingObjects.arrTrackObjects[0].point1, 0, )
        var invert_transform = this.majorObject.invertTransform;
        for(i = 0; i < calc_points.length; ++i)
        {
            calc_points2[i] =
            {
                x: (invert_transform.TransformPointX(calc_points[i].x, calc_points[i].y)/this.majorObject.extX)*21600 >> 0,
                y: (invert_transform.TransformPointY(calc_points[i].x, calc_points[i].y)/this.majorObject.extY)*21600 >> 0
            }
        }
        this.majorObject.parent.wrappingPolygon.setEdited(true);
        this.majorObject.parent.wrappingPolygon.setArrRelPoints(calc_points2);
        this.drawingObjects.document.Recalculate();
    }
    this.drawingObjects.clearTrackObjects();
    this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
};