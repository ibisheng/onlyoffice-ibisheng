function handleSelectedObjects(drawingObjectsController, e, x, y, group, pageIndex, bWord)
{
    var selected_objects = group ? group.selectedObjects : drawingObjectsController.getSelectedObjects();
    var tx, ty, t;
    if(selected_objects.length === 1)
    {
        if(bWord && pageIndex !== selected_objects[0].selectStartPage)
        {
            t = drawingObjectsController.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, selected_objects[0].selectStartPage);
            tx = t.X;
            ty = t.Y;
        }
        else
        {
            tx = x;
            ty = y;
        }
        var hit_to_adj = selected_objects[0].hitToAdjustment(tx, ty);
        if(hit_to_adj.hit)
        {
            return drawingObjectsController.handleAdjustmentHit(hit_to_adj, selected_objects[0], group, pageIndex);
        }
    }

    for(var i = selected_objects.length - 1; i > -1; --i)
    {
        if(bWord && pageIndex !== selected_objects[i].selectStartPage)
        {
            t = drawingObjectsController.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, selected_objects[i].selectStartPage);
            tx = t.X;
            ty = t.Y;
        }
        else
        {
            tx = x;
            ty = y;
        }
        var hit_to_handles = selected_objects[i].hitToHandles(tx, ty);
        if(hit_to_handles > -1)
        {
            return drawingObjectsController.handleHandleHit(hit_to_handles, selected_objects[i], group);
        }
    }

    for(i = selected_objects.length - 1; i > -1; --i)
    {
        if(bWord && pageIndex !== selected_objects[i].selectStartPage)
        {
            t = drawingObjectsController.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, selected_objects[i].selectStartPage);
            tx = t.X;
            ty = t.Y;
        }
        else
        {
            tx = x;
            ty = y;
        }
        if(selected_objects[i].hitInBoundingRect(x, y))
        {
            if(bWord && selected_objects[i].parent.Is_Inline())
                return handleInlineHitNoText(selected_objects[i], drawingObjectsController, e, x, y, pageIndex);
            else
                return drawingObjectsController.handleMoveHit(selected_objects[i], e, x, y, group, true, selected_objects[i].selectStartPage, true);
        }
    }
    return false;
}


function handleFloatObjects(drawingObjectsController, drawingArr, e, x, y, group, pageIndex, bWord)
{
    var ret = null, drawing;
    for(var i = drawingArr.length-1; i > -1; --i)
    {
        drawing = drawingArr[i];
        switch(drawing.getObjectType())
        {
            case historyitem_type_Shape:
            case historyitem_type_ImageShape:
            {
                ret = handleShapeImage(drawing, drawingObjectsController, e, x, y, group, pageIndex, bWord);
                if(ret)
                    return ret;
                break;
            }
            case historyitem_type_ChartSpace:
            {
                ret = handleChart(drawing, drawingObjectsController, e, x, y, group, pageIndex, bWord);
                if(ret)
                    return ret;
                break;
            }
            case historyitem_type_GroupShape:
            {
                ret = handleGroup(drawing, drawingObjectsController, e, x, y, group, pageIndex, bWord);
                if(ret)
                    return ret;
                break;
            }
            /*
             TODO сделать обработку для таблиц в презентаиях
             * */
        }
    }
    return ret;
}

function handleShapeImage(drawing, drawingObjectsController, e, x, y, group, pageIndex, bWord)
{
    var hit_in_inner_area = drawing.hitInInnerArea(x, y);
    var hit_in_path = drawing.hitInPath(x, y);
    var hit_in_text_rect = drawing.hitInTextRect(x, y);
    if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
    {
        return drawingObjectsController.handleMoveHit(drawing, e, x, y, group, false, pageIndex, bWord);
    }
    else if(hit_in_text_rect)
    {
        return drawingObjectsController.handleTextHit(drawing, e, x, y, group, pageIndex, bWord);
    }
    return false;
}


function handleGroup(drawing, drawingObjectsController, e, x, y, group, pageIndex, bWord)
{
    var grouped_objects = drawing.getArrGraphicObjects();
    var selected_objects = drawingObjectsController.selectedObjects;
    for(var j = grouped_objects.length - 1; j > -1; --j)
    {
        var cur_grouped_object = grouped_objects[j];
        if(cur_grouped_object instanceof CShape || cur_grouped_object instanceof CImageShape)
        {
            var hit_in_inner_area = cur_grouped_object.hitInInnerArea(x, y);
            var hit_in_path = cur_grouped_object.hitInPath(x, y);
            var hit_in_text_rect = cur_grouped_object.hitInTextRect(x, y);
            if(hit_in_inner_area && !hit_in_text_rect || hit_in_path)
            {
                return drawingObjectsController.handleMoveHit(drawing, e, x, y, null, false, pageIndex, true);
            }
            else if(hit_in_text_rect)
            {
                return drawingObjectsController.handleTextHit(cur_grouped_object, e, x, y, drawing, pageIndex, bWord);
            }
        }
    }
    return false;
}

function handleTable(drawing, drawingObjects, drawingObjectsController, e, x, y, handleState)
{
    var hit_in_inner_area = drawing.hitInInnerArea(x, y);
    var hit_in_bounding_rect = drawing.hitInBoundingRect(x, y);
    if(hit_in_bounding_rect || hit_in_inner_area)
    {
        resetGroupChartSelection(drawingObjectsController.State);
        if(e.CtrlKey && drawingObjectsController.selectedObjects.length > 0)
        {
            var b_selected = drawing.selected;
            drawing.select(drawingObjectsController);
            for(var j = 0; j < drawingObjectsController.selectedObjects.length; ++j)
            {
                drawingObjectsController.addPreTrackObject(drawingObjectsController.selectedObjects[j].createMoveTrack());
            }
            drawingObjectsController.changeCurrentState(new PreMoveState(drawingObjectsController, drawingObjects, x, y, e.ShiftKey, e.CtrlKey, drawing, b_selected, true));
            drawingObjects.OnUpdateOverlay();
            return true;
        }
        else
        {
            drawingObjectsController.resetSelection();
            drawing.select(drawingObjectsController);
            if(!(e.Button === g_mouse_button_right)&&(!drawing.isTableBorder(x, y)
                || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false))
            {
                drawing.selectionSetStart(e, x, y);
                drawingObjectsController.changeCurrentState(new TextAddState(drawingObjectsController, drawingObjects, drawing));
            }
            else if(e.Button === g_mouse_button_right && drawingObjectsController.State.textObject && drawingObjectsController.State.textObject === drawing && !(drawing.pointInSelectedText(x, y)))
            {
                drawing.selectionSetStart(e, x, y);
                drawingObjectsController.changeCurrentState(new TextAddState(drawingObjectsController, drawingObjects, drawing));
            }
            drawingObjects.presentation.Document_UpdateSelectionState();
            drawingObjects.OnUpdateOverlay();
            return true;
        }
    }
    return false;
}


function handleChart(drawing, drawingObjectsController, e, x, y, group, pageIndex, bWord)
{
    var ret = handleShapeImage(drawing, drawingObjectsController, e, x, y, group, pageIndex, bWord);
    if(ret)
        return ret;
    return false;
}


function handleInlineHitNoText(drawing, drawingObjects, e, x, y, pageIndex)
{
    var selected_objects = drawingObjects.selectedObjects;
    if(!(e.CtrlKey || e.ShiftKey)
        || selected_objects.length === 0 ||
        selected_objects.length === 1 && selected_objects[0] === drawing)
    {
        if(drawingObjects.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
        {
            drawingObjects.resetSelection();
            drawing.select(drawingObjects, pageIndex);
            drawingObjects.changeCurrentState(new PreMoveInlineObject(drawingObjects, drawing));
            drawingObjects.updateOverlay();
            return true;
        }
        else
        {
            return {objectId: drawing.Get_Id(), cursorType:"move"};
        }
    }
    if(drawingObjects.handleEventMode === HANDLE_EVENT_MODE_HANDLE)
    {
        return {objectId: drawing.Get_Id(), cursorType:"move"};
    }
    return false;
}
function handleInlineObjects(drawingObjectsController, drawingArr, e, x, y, pageIndex, bWord)
{
    var i;
    var drawing;
    for(i = drawingArr.length-1; i > -1; --i)
    {
        drawing = drawingArr[i];
        switch(drawing.getObjectType())
        {
            case historyitem_type_Shape:
            case historyitem_type_ImageShape:
            {
                var _hit = drawing.hit(x, y);
                var _hit_to_path = drawing.hitToPath(x, y);
                var b_hit_to_text = drawing.hitToTextRect(x, y);
                if((_hit && !b_hit_to_text) || _hit_to_path)
                {
                    return handleInlineHitNoText(drawing, drawingObjectsController, e, x, y, pageIndex);
                }
                else if(b_hit_to_text)
                {
                    return false;
                }
                return false;
            }
            case historyitem_type_ChartSpace:
            {

                break;
            }
            case historyitem_type_GroupShape:
            {
                break;
            }
        }
    }
}

function handleMouseUpPreMoveState(drawingObjects, e, x, y, pageIndex, bWord)
{
    var state = drawingObjects.curState;
    state.drawingObjects.clearPreTrackObjects();
    state.drawingObjects.changeCurrentState(new NullState(state.drawingObjects));
    if(!state.shift && !state.ctrl && state.bInside)
    {
        switch (state.majorObject.getObjectType())
        {
            case historyitem_type_GroupShape:
            {
                state.drawingObjects.resetSelection();
                state.drawingObjects.selectObject(state.majorObject, pageIndex);
                state.drawingObjects.selection.groupSelection = state.majorObject;
                state.drawingObjects.OnMouseDown(e,x, y,pageIndex);
                state.drawingObjects.OnMouseUp(e, x, y, pageIndex);
                break;
            }
            case historyitem_type_ChartSpace:
            {
                break;
            }
        }
    }
}

function handleInlineShapeImage(drawingObjectsController, drawing, e, x, y, pageIndex, bWord)
{
    var selected_objects = drawingObjectsController.selectedObjects;
    var hit = drawing.hit(x, y);
    var hit_to_path = drawing.hitToPath(x, y);
    var b_hit_to_text = drawing.hitToTextRect(x, y);
    if((hit && !b_hit_to_text) || hit_to_path)
    {
        handleInlineHitNoText(drawing, drawingObjectsController, e, x, y, pageIndex, handleState);
        return true;
    }
    else if(b_hit_to_text)
    {

        return true;
    }
    return false;
}
