function CGraphicObjects(slide)
{
    this.slide = slide;
    this.State = new NullState(this, this.slide);

    this.selectedObjects = [];
    this.arrPreTrackObjects = [];
    this.arrTrackObjects = [];
    this.selectionRect = null;
}

CGraphicObjects.prototype = {

    showComment: function(id, x, y)
    {
        editor.sync_HideComment();
        editor.sync_ShowComment(id, x, y );
    },

    hideComment: function()
    {
        editor.sync_HideComment();
    },

    resetSelectionState: function()
    {
        var count = this.selectedObjects.length;
        while(count > 0)
        {
            this.selectedObjects[0].deselect(this);
            --count;
        }
        this.changeCurrentState(new NullState(this, this.slide));
    },

    resetSelection: function()
    {
        var count = this.selectedObjects.length;
        while(count > 0)
        {
            this.selectedObjects[0].deselect(this);
            --count;
        }
    },

    Select_All : function()
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            case STATES_ID_CHART_TEXT_ADD:

            {
                if(this.State.textObject.txBody)
                {
                    this.State.textObject.txBody.content.Select_All();
                }
                else if(this.State.textObject instanceof  CGraphicFrame)
                {
                    this.State.textObject.graphicObject.Select_All();
                }
                break;
            }
            case STATES_ID_NULL:
            {
                this.resetSelection();
                for(var i = 0; i < this.slide.cSld.spTree.length; ++i)
                {
                    this.slide.cSld.spTree[i].select(this);
                }
                break;
            }
        }
        editor.WordControl.OnUpdateOverlay();
    },

    paragraphAdd: function(paraItem, bRecalculate)
    {
        var b_rulers = false;
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            case STATES_ID_CHART_TEXT_ADD:

            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
                {
                    History.Create_NewPoint();
                    this.State.textObject.paragraphAdd(paraItem, bRecalculate);
                    //this.State.textObject.recalculate();
                    //this.updateSelectionState();
                }
                break;
            }
            case STATES_ID_NULL:
            {
                if(paraItem.Type === para_TextPr)
                {
                    if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false)
                    {
                        History.Create_NewPoint();
                        for(var i = 0; i < this.selectedObjects.length; ++i)
                        {
                            if(typeof this.selectedObjects[i].applyAllTextProps === "function")
                            {
                                this.selectedObjects[i].applyAllTextProps(paraItem);
                            }
                        }
                    }
                }
                else
                {
                    if(this.selectedObjects.length === 1)
                    {
                        if(typeof this.selectedObjects[0].paragraphAdd === "function")
                        {
                            if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
                            {
                                History.Create_NewPoint();
                                this.selectedObjects[0].paragraphAdd(paraItem, bRecalculate);
                                //this.selectedObjects[0].recalculate();
                                this.changeCurrentState(new TextAddState(this, this.slide, this.selectedObjects[0]));
                                b_rulers = true;
                                //this.updateSelectionState();
                            }
                        }
                    }
                }
                break;
            }
            case STATES_ID_GROUP:
            {
                if(paraItem.Type === para_TextPr)
                {
                    if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false)
                    {
                        History.Create_NewPoint();
                        for(var i = 0; i < this.State.group.selectedObjects.length; ++i)
                        {
                            if(typeof this.State.group.selectedObjects[i].applyAllTextProps === "function")
                            {
                                this.State.group.selectedObjects[i].applyAllTextProps(paraItem);
                            }
                        }
                    }
                }
                else
                {
                    if(this.State.group.selectedObjects.length === 1)
                    {
                        if(typeof this.State.group.selectedObjects[0].paragraphAdd === "function")
                        {
                            if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
                            {
                                History.Create_NewPoint();
                                this.State.group.selectedObjects[0].paragraphAdd(paraItem, bRecalculate);
                                //this.selectedObjects[0].recalculate();
                                this.changeCurrentState(new TextAddInGroup(this, this.slide,this.State.group, this.State.group.selectedObjects[0]));
                                b_rulers = true;
                                //this.updateSelectionState();
                            }
                        }
                    }
                }
                break;
            }
        }
        editor.WordControl.m_oLogicDocument.Recalculate();
        if(b_rulers)
        {
            editor.WordControl.m_oLogicDocument.Document_UpdateRulersState();
        }
    },


    Paragraph_ClearFormatting: function()
    {
        if(this.State.textObject && this.State.textObject.Paragraph_ClearFormatting)
        {
            this.State.textObject.Paragraph_ClearFormatting();
        }
    },
    Update_CursorType: function(x, y,  e )
    {
        switch(this.State.id)
        {
            case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                break;
            }
            default :
            {
                var selected_objects = this.selectedObjects;
                var drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                if(selected_objects.length === 1)
                {
                    var hit_to_adj = selected_objects[0].hitToAdjustment(x, y);
                    if(hit_to_adj.hit)
                    {
                        if(selected_objects[0].canChangeAdjustments())
                        {
                            drawingDocument.SetCursorType("crosshair");
                            selected_objects[0].sendMouseData();
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
                            selected_objects[0].sendMouseData();
                            drawingDocument.SetCursorType("crosshair");
                        }
                        else
                        {
                            if(!selected_objects[i].canResize())
                                return;
                            var card_direction = selected_objects[i].getCardDirectionByNum(hit_to_handles);
                            drawingDocument.SetCursorType(CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]);
                            selected_objects[i].sendMouseData();

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
                        drawingDocument.SetCursorType("move");
                        selected_objects[i].sendMouseData();
                        return;
                    }
                }

                var arr_drawing_objects = this.slide.getDrawingObjects();
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

                            drawingDocument.SetCursorType("move");
                            cur_drawing.sendMouseData();
                            return;
                        }
                        else if(hit_in_text_rect)
                        {
                            cur_drawing.updateCursorType(x, y, e);
                            cur_drawing.sendMouseData();

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

                                cur_drawing.sendMouseData();

                                drawingDocument.SetCursorType("move");
                                return;
                            }
                            else if(hit_in_text_rect)
                            {
                                cur_drawing.sendMouseData();

                                grouped_objects[j].txBody.updateCursorType(x, y, e);
                                return;
                            }
                        }
                    }
                    else if(cur_drawing.isChart())
                    {
                        /*if(cur_drawing.hitInWorkArea(x, y))
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



                        }  */
                    }
                    else if(cur_drawing.isTable && cur_drawing.isTable())
                    {
                        var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                        var hit_in_bounding_rect = cur_drawing.hitInBoundingRect(x, y);
                        if(hit_in_bounding_rect || hit_in_inner_area)
                        {
                            if(hit_in_bounding_rect)
                            {
                                cur_drawing.sendMouseData();

                                drawingDocument.SetCursorType("move");
                                return;
                            }
                            else
                            {
                                cur_drawing.updateCursorType(x, y, e);
                                return;

                            }
                        }
                    }
                }
                drawingDocument.SetCursorType("default");
                break;
            }
        }

    },

    setParagraphAlign: function(val)
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
                {
                    this.State.textObject.setParagraphAlign(val);
                    //this.State.textObject.recalculate();
                    //this.updateSelectionState();
                }
                break;
            }
            case STATES_ID_NULL:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false)
                {
                    for(var i = 0; i < this.selectedObjects.length; ++i)
                    {
                        if(typeof this.selectedObjects[i].applyAllAlign === "function")
                        {
                            this.selectedObjects[i].applyAllAlign(val);
                        }
                    }
                }
                break;
            }
        }
    },


    setParagraphTabs: function(val)

    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
                {
                    this.State.textObject.setParagraphTabs(val);
                    //this.State.textObject.recalculate();
                    //this.updateSelectionState();
                }
                break;
            }
            case STATES_ID_NULL:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false)
                {
                    for(var i = 0; i < this.selectedObjects.length; ++i)
                    {
                        if(typeof this.selectedObjects[i].applyAllSpacing === "function")
                        {
                            this.selectedObjects[i].applyAllSpacing(val);
                        }
                    }
                }
                break;
            }
        }
    },

    setParagraphSpacing: function(val)
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
                {
                    this.State.textObject.setParagraphSpacing(val);
                    //this.State.textObject.recalculate();
                    //this.updateSelectionState();
                }
                break;
            }
            case STATES_ID_NULL:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false)
                {
                    for(var i = 0; i < this.selectedObjects.length; ++i)
                    {
                        if(typeof this.selectedObjects[i].applyAllSpacing === "function")
                        {
                            this.selectedObjects[i].applyAllSpacing(val);
                        }
                    }
                }
                break;
            }
        }
    },

    setParagraphIndent: function(val)
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
                {
                    this.State.textObject.setParagraphIndent(val);
                    //this.State.textObject.recalculate();
                    //this.updateSelectionState();
                }
                break;
            }
            case STATES_ID_NULL:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false)
                {
                    for(var i = 0; i < this.selectedObjects.length; ++i)
                    {
                        if(typeof this.selectedObjects[i].applyAllIndent === "function")
                        {
                            this.selectedObjects[i].applyAllIndent(val);
                        }
                    }
                }
                break;
            }
        }
    },

    setParagraphNumbering: function(val)
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
                {
                    this.State.textObject.setParagraphNumbering(val);
                }
                break;
            }
            case STATES_ID_NULL:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false)
                {
                    for(var i = 0; i < this.selectedObjects.length; ++i)
                    {
                        if(typeof this.selectedObjects[i].applyAllNumbering === "function")
                        {
                            this.selectedObjects[i].applyAllNumbering(val);
                        }
                    }
                }
                break;
            }
        }
    },

    Paragraph_IncDecFontSize: function(val)
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
                {
                    this.State.textObject.Paragraph_IncDecFontSize(val);
                }
                break;
            }
            case STATES_ID_NULL:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false)
                {
                    for(var i = 0; i < this.selectedObjects.length; ++i)
                    {
                        if(typeof this.selectedObjects[i].Paragraph_IncDecFontSizeAll === "function")
                        {
                            this.selectedObjects[i].Paragraph_IncDecFontSizeAll(val);
                        }
                    }
                }
                break;
            }
        }
    },

    Set_ImageProps: function(Props)
    {

    },

    getSelectedArraysByTypes: function()
    {
        var selected_objects = this.selectedObjects;
        var tables = [], charts = [], shapes = [], images = [], groups = [];
        for(var i = 0; i < selected_objects.length; ++i)
        {
            var selected_object = selected_objects[i];
            if(typeof  selected_object.isTable === "function" && selected_object.isTable())
            {
                tables.push(selected_object);
            }
            else if(typeof  selected_object.isChart === "function" && selected_object.isChart())
            {
                charts.push(selected_object);
            }
            else if(selected_object.isShape())
            {
                shapes.push(selected_object);
            }
            else if(selected_object.isImage())
            {
                images.push(selected_object);
            }
            else if(typeof  selected_object.isGroup())
            {
                groups.push(selected_object);
            }
        }
        return {tables: tables, charts: charts, shapes: shapes, images: images, groups: groups};
    },


    setTableProps: function(props)
    {
        if(this.selectedObjects.length ===1 && this.selectedObjects[0].isTable && this.selectedObjects[0].isTable())
        {
            this.selectedObjects[0].Set_Props(props);
        }
    },

    Document_UpdateInterfaceState: function()
    {
        var text_props = null, para_props = null, shape_props = null, image_props = null, chart_props = null, table_props = null;
        var selected_objects = this.selectedObjects;
        var by_types = this.getSelectedArraysByTypes();
        switch(this.State.id)
        {
            case STATES_ID_NULL:
            case STATES_ID_TEXT_ADD:
            case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD_IN_GROUP:
           // case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if(this.State.id === STATES_ID_GROUP || this.State.id === STATES_ID_TEXT_ADD_IN_GROUP)
                {
                    by_types = this.State.group.getSelectedArraysByTypes();
                }
                var images = by_types.images;
                for(var i = 0; i < images.length; ++i)
                {
                    var _cur_image_prop = images[i].getImageProps();
                    if(_cur_image_prop !== null)
                    {
                        if(image_props === null)
                        {
                            image_props = _cur_image_prop;
                        }
                        else
                        {
                            image_props = CompareImageProperties(image_props, _cur_image_prop);
                        }
                    }
                }
                var shapes = by_types.shapes;
                for(var i = 0; i < shapes.length; ++i)
                {
                    var _current_object = shapes[i];
                    var _cur_shape_prop =
                    {
                        type: _current_object.getPresetGeom(),
                        fill: _current_object.getFill(),
                        stroke: _current_object.getStroke(),
                        canChangeArrows: _current_object.canChangeArrows(),
                        IsLocked: !(_current_object.Lock.Type === locktype_None || _current_object.Lock.Type === locktype_Mine),
                        verticalTextAlign: _current_object.txBody ? _current_object.txBody.getCompiledBodyPr().anchor : undefined,
                        paddings: _current_object.getPaddings(),
                        w:_current_object.extX,
                        h:_current_object.extY
                    };

                    if(shape_props === null)
                    {
                        shape_props = _cur_shape_prop;
                    }
                    else
                    {
                        shape_props = CompareShapeProperties(shape_props, _cur_shape_prop);
                        shape_props.verticalTextAlign = undefined;
                    }

                    var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                    if(_current_object.Lock.Is_Locked() && _cur_paragraph_para_pr)
                    {
                        _cur_paragraph_para_pr.Locked = true;
                    }
                    if(_cur_paragraph_para_pr != null)
                    {
                        if(para_props === null)
                        {
                            para_props = _cur_paragraph_para_pr;
                        }
                        else
                        {
                            para_props = para_props.Compare(_cur_paragraph_para_pr)
                        }
                    }
                    var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                    if(_cur_paragraph_text_pr != null)
                    {
                        if(text_props === null)
                        {
                            text_props = _cur_paragraph_text_pr;
                        }
                        else
                        {
                            text_props = text_props.Compare(_cur_paragraph_text_pr)
                        }
                    }
                }

                var groups = by_types.groups;
                for(var i = 0; i < groups.length; ++i)
                {
                    var cur_group = groups[i];
                    var arr_by_types = cur_group.getArraysByTypes();
                    var images = arr_by_types.images;
                    for(var i = 0; i < images.length; ++i)
                    {
                        var _cur_image_prop = images[i].getImageProps();
                        if(_cur_image_prop !== null)
                        {
                            if(image_props === null)
                            {
                                image_props = _cur_image_prop;
                            }
                            else
                            {
                                image_props = CompareImageProperties(image_props, _cur_image_prop);
                            }
                        }
                    }

                    var shapes = arr_by_types.shapes;
                    for(var i = 0; i < shapes.length; ++i)
                    {
                        var _current_object = shapes[i];
                        var _cur_shape_prop =
                        {
                            type: _current_object.getPresetGeom(),
                            fill: _current_object.getFill(),
                            stroke: _current_object.getStroke(),
                            canChangeArrows: _current_object.canChangeArrows(),
                            IsLocked: cur_group.Lock.Is_Locked(),
                            verticalTextAlign: _current_object.txBody ? _current_object.txBody.getCompiledBodyPr().anchor : undefined,
                            paddings: _current_object.getPaddings(),
                            w:_current_object.extX,
                            h:_current_object.extY
                        };

                        if(shape_props === null)
                        {
                            shape_props = _cur_shape_prop;
                        }
                        else
                        {
                            shape_props = CompareShapeProperties(shape_props, _cur_shape_prop);
                            shape_props.verticalTextAlign = undefined;
                        }

                        var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                        if(_cur_paragraph_para_pr != null)
                        {
                            if(para_props === null)
                            {
                                para_props = _cur_paragraph_para_pr;
                            }
                            else
                            {
                                para_props = para_props.Compare(_cur_paragraph_para_pr)
                            }
                        }
                        var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                        if(_cur_paragraph_text_pr != null)
                        {
                            if(text_props === null)
                            {
                                text_props = _cur_paragraph_text_pr;
                            }
                            else
                            {
                                text_props = text_props.Compare(_cur_paragraph_text_pr)
                            }
                        }
                    }

                    if(image_props)
                    {
                        if(cur_group.Lock.Is_Locked())
                        {
                            image_props.IsLocked = true;
                        }
                    }
                    if(shape_props)
                    {
                        if(cur_group.Lock.Is_Locked())
                        {
                            shape_props.IsLocked = true;
                        }
                    }
                    if(para_props)
                    {
                        if(cur_group.Lock.Is_Locked())
                        {
                            para_props.Locked = true;
                        }
                    }
                }

                var tables = by_types.tables;
                if(tables.length === 1)
                {
                    editor.sync_TblPropCallback(tables[0].graphicObject.Get_Props());
                    this.slide.presentation.DrawingDocument.CheckTableStyles(tables[0].graphicObject.Get_TableLook(), tables[0]);
                    var _cur_paragraph_para_pr = tables[0].getParagraphParaPr();
                    if(_cur_paragraph_para_pr != null)
                    {
                        if(para_props === null)
                        {
                            para_props = _cur_paragraph_para_pr;
                        }
                        else
                        {
                            para_props = para_props.Compare(_cur_paragraph_para_pr)
                        }
                    }
                    var _cur_paragraph_text_pr = tables[0].getParagraphTextPr();
                    if(_cur_paragraph_text_pr != null)
                    {
                        if(text_props === null)
                        {
                            text_props = _cur_paragraph_text_pr;
                        }
                        else
                        {
                            text_props = text_props.Compare(_cur_paragraph_text_pr)
                        }
                    }
                }

                var charts = by_types.charts;
                for(var i = 0; i < charts.length; ++i)
                {
                    if(!isRealObject(chart_props))
                    {
                        chart_props = {fromGroup: this.State.id === STATES_ID_GROUP || this.State.id === STATES_ID_TEXT_ADD_IN_GROUP};
                        chart_props.ChartProperties = charts[i].chart;
                        chart_props.Width = charts[i].extX;
                        chart_props.Height = charts[i].extY;
                    }
                    else
                    {
                        chart_props.chart = null;
                        chart_props.severalCharts = true;
                        if(chart_props.severalChartTypes !== true)
                        {
                            if(!(chart_props.ChartProperties.type === charts[i].chart.type && chart_props.ChartProperties.subType === charts[i].chart.subType) )
                                chart_props.severalChartTypes = true;
                        }
                        if(chart_props.severalChartStyles !== true)
                        {
                            if(chart_props.ChartProperties.styleId !== charts[i].chart.styleId )
                                chart_props.severalChartStyles = true;
                        }
                        if(chart_props.Width !== charts[i].extX || chart_props.Height !== charts[i].extY)
                        {
                            chart_props.Width = null;
                            chart_props.Height = null;
                        }
                    }
                }
                break;
            }
        }

        editor.sync_slidePropCallback(this.slide);
        if(this.State.id === STATES_ID_TEXT_ADD || this.State.id === STATES_ID_TEXT_ADD_IN_GROUP)
        {

            if(image_props !== null)
            {
                editor.sync_ImgPropCallback(image_props);
            }

            if(shape_props !== null)
            {
                editor.sync_shapePropCallback(shape_props);
            }

            if(chart_props)
            {

                editor.sync_ImgPropCallback(chart_props);
            }

            this.State.textObject.updateInterfaceTextState();
            if(this.State.textObject.isTable && this.State.textObject.isTable())
            {
                editor.sync_TblPropCallback(this.State.textObject.graphicObject.Get_Props());
                this.slide.presentation.DrawingDocument.CheckTableStyles(this.State.textObject.graphicObject.Get_TableLook(), this.State.textObject);
            }
        }
        else
        {
            if(para_props != null)
            {
                editor.UpdateParagraphProp( para_props );

                editor.sync_PrLineSpacingCallBack(para_props.Spacing);
                if(selected_objects.length === 1 )
                {
                    if ( "undefined" != typeof(para_props.Tabs) && null != para_props.Tabs )
                        editor.Update_ParaTab( Default_Tab_Stop, para_props.Tabs );//TODO:
                }
            }
            else
            {
                //editor.sync_PrLineSpacingCallBack(_empty_para_pr.Spacing);
                //editor.UpdateParagraphProp(_empty_para_pr);
            }

            if(text_props != null)
            {
                if(text_props.Bold === undefined)
                    text_props.Bold = false;
                if(text_props.Italic === undefined)
                    text_props.Italic = false;
                if(text_props.Underline === undefined)
                    text_props.Underline = false;
                if(text_props.Strikeout === undefined)
                    text_props.Strikeout = false;
                if(text_props.FontFamily === undefined)
                    text_props.FontFamily = {Index : 0, Name : ""};
                if(text_props.FontSize === undefined)
                    text_props.FontSize = "";
                editor.UpdateTextPr(text_props);
            }
            else
            {
                //   editor.UpdateTextPr(_empty_text_pr);
            }

            if(image_props !== null)
            {
                editor.sync_ImgPropCallback(image_props);
            }

            if(shape_props !== null)
            {
                editor.sync_shapePropCallback(shape_props);
            }

            if(chart_props)
            {

                editor.sync_ImgPropCallback(chart_props);
            }
        }

       // editor.sync_VerticalTextAlign(this.getVerticalAlign());
    },


    Get_Paragraph_ParaPr : function()
    {

        var text_props = null, para_props = null, shape_props = null, image_props = null, chart_props = null, table_props = null;
        var selected_objects = this.selectedObjects;
        var by_types = this.getSelectedArraysByTypes();
        switch(this.State.id)
        {
            case STATES_ID_NULL:
            //case STATES_ID_TEXT_ADD:
                // case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                var shapes = by_types.shapes;
                for(var i = 0; i < shapes.length; ++i)
                {
                    var _current_object = shapes[i];
                    var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                    if(_current_object.Lock.Is_Locked() && _cur_paragraph_para_pr)
                    {
                        _cur_paragraph_para_pr.Locked = true;
                    }
                    if(_cur_paragraph_para_pr != null)
                    {
                        if(para_props === null)
                        {
                            para_props = _cur_paragraph_para_pr;
                        }
                        else
                        {
                            para_props = para_props.Compare(_cur_paragraph_para_pr)
                        }
                    }
                    var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                    if(_cur_paragraph_text_pr != null)
                    {
                        if(text_props === null)
                        {
                            text_props = _cur_paragraph_text_pr;
                        }
                        else
                        {
                            text_props = text_props.Compare(_cur_paragraph_text_pr)
                        }
                    }
                }

                var groups = by_types.groups;
                for(var i = 0; i < groups.length; ++i)
                {
                    var cur_group = groups[i];
                    var arr_by_types = cur_group.getArraysByTypes();


                    var shapes = arr_by_types.shapes;
                    for(var i = 0; i < shapes.length; ++i)
                    {
                        var _current_object = shapes[i];


                        var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                        if(_cur_paragraph_para_pr != null)
                        {
                            if(para_props === null)
                            {
                                para_props = _cur_paragraph_para_pr;
                            }
                            else
                            {
                                para_props = para_props.Compare(_cur_paragraph_para_pr)
                            }
                        }
                        var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                        if(_cur_paragraph_text_pr != null)
                        {
                            if(text_props === null)
                            {
                                text_props = _cur_paragraph_text_pr;
                            }
                            else
                            {
                                text_props = text_props.Compare(_cur_paragraph_text_pr)
                            }
                        }
                    }


                    if(para_props)
                    {
                        if(cur_group.Lock.Is_Locked())
                        {
                            para_props.Locked = true;
                        }
                    }
                }

                var tables = by_types.tables;
                if(tables.length === 1)
                {
                    this.slide.presentation.DrawingDocument.CheckTableStyles(tables[0].graphicObject.Get_TableLook(), tables[0]);
                    var _cur_paragraph_para_pr = tables[0].getParagraphParaPr();
                    if(_cur_paragraph_para_pr != null)
                    {
                        if(para_props === null)
                        {
                            para_props = _cur_paragraph_para_pr;
                        }
                        else
                        {
                            para_props = para_props.Compare(_cur_paragraph_para_pr)
                        }
                    }
                    var _cur_paragraph_text_pr = tables[0].getParagraphTextPr();
                    if(_cur_paragraph_text_pr != null)
                    {
                        if(text_props === null)
                        {
                            text_props = _cur_paragraph_text_pr;
                        }
                        else
                        {
                            text_props = text_props.Compare(_cur_paragraph_text_pr)
                        }
                    }
                }
                break;
            }
            case STATES_ID_TEXT_ADD:
            {
                return this.State.textObject.getParaPr();
                break;
            }
        }
        return para_props ? para_props : new CParaPr();

    },

    Get_Paragraph_TextPr : function()
    {
        var text_props = null, para_props = null, shape_props = null, image_props = null, chart_props = null, table_props = null;
        var selected_objects = this.selectedObjects;
        var by_types = this.getSelectedArraysByTypes();
        switch(this.State.id)
        {
            case STATES_ID_NULL:
                // case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                var shapes = by_types.shapes;
                for(var i = 0; i < shapes.length; ++i)
                {
                    var _current_object = shapes[i];
                    var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                    if(_current_object.Lock.Is_Locked() && _cur_paragraph_para_pr)
                    {
                        _cur_paragraph_para_pr.Locked = true;
                    }
                    if(_cur_paragraph_para_pr != null)
                    {
                        if(para_props === null)
                        {
                            para_props = _cur_paragraph_para_pr;
                        }
                        else
                        {
                            para_props = para_props.Compare(_cur_paragraph_para_pr)
                        }
                    }
                    var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                    if(_cur_paragraph_text_pr != null)
                    {
                        if(text_props === null)
                        {
                            text_props = _cur_paragraph_text_pr;
                        }
                        else
                        {
                            text_props = text_props.Compare(_cur_paragraph_text_pr)
                        }
                    }
                }

                var groups = by_types.groups;
                for(var i = 0; i < groups.length; ++i)
                {
                    var cur_group = groups[i];
                    var arr_by_types = cur_group.getArraysByTypes();


                    var shapes = arr_by_types.shapes;
                    for(var i = 0; i < shapes.length; ++i)
                    {
                        var _current_object = shapes[i];


                        var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                        if(_cur_paragraph_para_pr != null)
                        {
                            if(para_props === null)
                            {
                                para_props = _cur_paragraph_para_pr;
                            }
                            else
                            {
                                para_props = para_props.Compare(_cur_paragraph_para_pr)
                            }
                        }
                        var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                        if(_cur_paragraph_text_pr != null)
                        {
                            if(text_props === null)
                            {
                                text_props = _cur_paragraph_text_pr;
                            }
                            else
                            {
                                text_props = text_props.Compare(_cur_paragraph_text_pr)
                            }
                        }
                    }


                    if(para_props)
                    {
                        if(cur_group.Lock.Is_Locked())
                        {
                            para_props.Locked = true;
                        }
                    }
                }

                var tables = by_types.tables;
                if(tables.length === 1)
                {
                    this.slide.presentation.DrawingDocument.CheckTableStyles(tables[0].graphicObject.Get_TableLook(), tables[0]);
                    var _cur_paragraph_para_pr = tables[0].getParagraphParaPr();
                    if(_cur_paragraph_para_pr != null)
                    {
                        if(para_props === null)
                        {
                            para_props = _cur_paragraph_para_pr;
                        }
                        else
                        {
                            para_props = para_props.Compare(_cur_paragraph_para_pr)
                        }
                    }
                    var _cur_paragraph_text_pr = tables[0].getParagraphTextPr();
                    if(_cur_paragraph_text_pr != null)
                    {
                        if(text_props === null)
                        {
                            text_props = _cur_paragraph_text_pr;
                        }
                        else
                        {
                            text_props = text_props.Compare(_cur_paragraph_text_pr)
                        }
                    }
                }
                break;
            }
            case STATES_ID_TEXT_ADD:
            {
                return this.State.textObject.getTextPr();
                break;
            }
        }
        return text_props ? text_props : new CParaPr();
    },

    getPropsArrays: function()
    {
        var text_props = null, para_props = null, shape_props = null, image_props = null, chart_props = null, table_props = null;
        var selected_objects = this.selectedObjects;
        var by_types = this.getSelectedArraysByTypes();
        switch(this.State.id)
        {
            case STATES_ID_NULL:
            {
                var images = by_types.images;
                for(var i = 0; i < images.length; ++i)
                {
                    var _cur_image_prop = images[i].getImageProps();
                    if(_cur_image_prop !== null)
                    {
                        if(image_props === null)
                        {
                            image_props = _cur_image_prop;
                        }
                        else
                        {
                            image_props = CompareImageProperties(image_props, _cur_image_prop);
                        }
                    }
                }
                var shapes = by_types.shapes;
                for(var i = 0; i < shapes.length; ++i)
                {
                    var _current_object = shapes[i];
                    var _cur_shape_prop =
                    {
                        type: _current_object.getPresetGeom(),
                        fill: _current_object.getFill(),
                        stroke: _current_object.getStroke(),
                        canChangeArrows: _current_object.canChangeArrows()
                    };

                    if(shape_props === null)
                    {
                        shape_props = _cur_shape_prop;
                    }
                    else
                    {
                        shape_props = CompareShapeProperties(shape_props, _cur_shape_prop);
                    }

                    var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                    if(_cur_paragraph_para_pr != null)
                    {
                        if(para_props === null)
                        {
                            para_props = _cur_paragraph_para_pr;
                        }
                        else
                        {
                            para_props = para_props.Compare(_cur_paragraph_para_pr)
                        }
                    }
                    var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                    if(_cur_paragraph_text_pr != null)
                    {
                        if(text_props === null)
                        {
                            text_props = _cur_paragraph_text_pr;
                        }
                        else
                        {
                            text_props = text_props.Compare(_cur_paragraph_text_pr)
                        }
                    }
                }

                var groups = by_types.groups;
                for(var i = 0; i < groups.length; ++i)
                {
                    var cur_group = groups[i];
                    var arr_by_types = cur_group.getArraysByTypes();
                    var images = cur_group.images;
                    for(var i = 0; i < images.length; ++i)
                    {
                        var _cur_image_prop = images[i].getImageProps();
                        if(_cur_image_prop !== null)
                        {
                            if(image_props === null)
                            {
                                image_props = _cur_image_prop;
                            }
                            else
                            {
                                image_props = CompareImageProperties(image_props, _cur_image_prop);
                            }
                        }
                    }
                    var shapes = cur_group.shapes;
                    for(var i = 0; i < shapes.length; ++i)
                    {
                        var _current_object = shapes[i];
                        var _cur_shape_prop =
                        {
                            type: _current_object.getPresetGeom(),
                            fill: _current_object.getFill(),
                            stroke: _current_object.getStroke(),
                            canChangeArrows: _current_object.canChangeArrows()
                        };

                        if(shape_props === null)
                        {
                            shape_props = _cur_shape_prop;
                        }
                        else
                        {
                            shape_props = CompareShapeProperties(shape_props, _cur_shape_prop);
                        }

                        var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                        if(_cur_paragraph_para_pr != null)
                        {
                            if(para_props === null)
                            {
                                para_props = _cur_paragraph_para_pr;
                            }
                            else
                            {
                                para_props = para_props.Compare(_cur_paragraph_para_pr)
                            }
                        }
                        var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                        if(_cur_paragraph_text_pr != null)
                        {
                            if(text_props === null)
                            {
                                text_props = _cur_paragraph_text_pr;
                            }
                            else
                            {
                                text_props = text_props.Compare(_cur_paragraph_text_pr)
                            }
                        }
                    }
                }
                break;
            }
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                this.State.textObject.updateInterfaceTextState();
                break;
            }
        }

        if(text_props != null)
        {
            if(text_props.Bold === undefined)
                text_props.Bold = false;
            if(text_props.Italic === undefined)
                text_props.Italic = false;
            if(text_props.Underline === undefined)
                text_props.Underline = false;
            if(text_props.Strikeout === undefined)
                text_props.Strikeout = false;
            if(text_props.FontFamily === undefined)
                text_props.FontFamily = {Index : 0, Name : ""};
            if(text_props.FontSize === undefined)
                text_props.FontSize = "";
            editor.UpdateTextPr(text_props);
        }
        else
        {
            //   editor.UpdateTextPr(_empty_text_pr);
        }

        return {textPr: text_props, paraPr: para_props, shapePr: shape_props, imagePr: image_props, chartPr: chart_props, tablePr: table_props};

    },

    getVerticalAlign: function()
    {
        switch(this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if(this.State.textObject && this.State.textObject)
                {
                    if(this.State.textObject.txBody && this.State.textObject.txBody.compiledBodyPr && typeof (this.State.textObject.txBody.compiledBodyPr.anchor) == "number")
                    {
                        return this.State.textObject.txBody.compiledBodyPr.anchor;
                    }
                }
                return null;
            }
            case STATES_ID_NULL:
            {
                var _result_align = null;
                var _cur_align;
                var _shapes = this.selectedObjects;
                var _shape_index;
                var _shape;
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    if(_shape.selected)
                    {
                        if(_shape instanceof  CShape)
                        {
                            if(_shape.txBody && _shape.txBody.compiledBodyPr && typeof (_shape.txBody.compiledBodyPr.anchor) == "number")
                            {
                                _cur_align = _shape.txBody.compiledBodyPr.anchor;
                                if(_result_align === null)
                                {
                                    _result_align = _cur_align;
                                }
                                else
                                {
                                    if(_result_align !== _cur_align)
                                    {
                                        return null;
                                    }
                                }
                            }
                            else
                            {
                                return null;
                            }
                        }

                        if(_shape instanceof  CGroupShape)
                        {
                            _cur_align = _shape.calculateCompiledVerticalAlign();
                            if(_cur_align === null)
                            {
                                return null;
                            }
                            if(_result_align === null)
                            {
                                _result_align = _cur_align;
                            }
                            else
                            {
                                if(_result_align !== _cur_align)
                                {
                                    return null;
                                }
                            }
                        }
                    }
                }
                return _result_align;
            }
        }

        return null;
    },

    setVerticalAlign: function(align)
    {
        switch(this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if(this.State.textObject && this.State.textObject)
                {
                    this.State.textObject.setVerticalAlign(align);
                }
                return null;
            }
            case STATES_ID_NULL:
            {
                var _result_align = null;
                var _shapes = this.selectedObjects;
                var _shape_index;
                var _shape;
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    if(_shape.selected)
                    {
                        if(typeof _shape.setVerticalAlign === "function")
                            _shape.setVerticalAlign(align);
                    }
                }
                return _result_align;
            }
        }

    },

    getChartObject: function()
    {
        var selected_arr = this.selectedObjects;
        for(var  i = 0;  i < selected_arr.length; ++i)
        {
            if(selected_arr[i].chart != null)
                return selected_arr[i];
        }

        var ret = new CChartAsGroup();
        var options = {};
        options.slide =  this.slide;
        options.layout = this.slide.Layout;
        options.master = this.slide.Layout.Master;
        options.theme = this.slide.Layout.Master.Theme;
        editor.chartStyleManager.init(options);

        ret.chart.initDefault();
        ret.spPr.xfrm.offX = 0;
        ret.spPr.xfrm.offY = 0;
        ret.spPr.xfrm.extX = this.slide.Width*2/3;//ditor.WordControl.m_oDrawingDocument.GetMMPerDot(c_oAscChartDefines.defaultChartWidth);
        ret.spPr.xfrm.extY = 0.593*this.slide.Height;//ditor.WordControl.m_oDrawingDocument.GetMMPerDot(c_oAscChartDefines.defaultChartHeight);
        return ret;
    },

    Hyperlink_CanAdd: function(bCheck)
    {
        if(this.State.textObject && this.State.textObject.Hyperlink_CanAdd)
        {
            return this.State.textObject.Hyperlink_CanAdd(bCheck);
        }
        return  false;
    },

    Hyperlink_Check : function(bCheck)
    {
        if(this.State.textObject && this.State.textObject.Hyperlink_Check)
        {
            return this.State.textObject.Hyperlink_Check(bCheck);
        }
        return  false;
    },


    Hyperlink_Add : function(HyperProps)
    {
        if(this.State.textObject && this.State.textObject.Hyperlink_Add)
        {
            this.State.textObject.Hyperlink_Add(HyperProps);
        }
    },

    Hyperlink_Modify : function(HyperProps)
    {
        if(this.State.textObject && this.State.textObject.Hyperlink_Modify)
        {
            this.State.textObject.Hyperlink_Modify(HyperProps);
        }
    },

    Hyperlink_Remove : function()
    {
        if(this.State.textObject && this.State.textObject.Hyperlink_Remove)
        {
            this.State.textObject.Hyperlink_Remove();
        }
    },

    Get_SelectedText: function(bClearText)
    {
        if(this.State.textObject && this.State.textObject.Get_SelectedText)
        {
            return this.State.textObject.Get_SelectedText(bClearText);
        }
        return null;
    },

    shapeApply: function(properties)
    {

        switch(this.State.id)
        {
            case STATES_ID_NULL:
            case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {

                var selectedObjects = this.State.id === STATES_ID_NULL  || this.State.id === STATES_ID_TEXT_ADD ? this.selectedObjects : this.State.group.selectedObjects;
                for(var i = 0; i < selectedObjects.length; ++i)
                {

                    if(properties.type != undefined && properties.type != -1 && typeof selectedObjects[i].changePresetGeom === "function")
                    {
                        selectedObjects[i].changePresetGeom(properties.type);
                    }
                    if(properties.fill && typeof selectedObjects[i].changeFill === "function")
                    {
                        selectedObjects[i].changeFill(properties.fill);
                    }
                    if(properties.stroke && typeof selectedObjects[i].changeLine === "function")
                    {
                        selectedObjects[i].changeLine(properties.stroke);
                    }
                    if(properties.paddings && typeof selectedObjects[i].setPaddings === "function")
                    {
                        selectedObjects[i].setPaddings(properties.paddings);
                    }
                }
                if(typeof properties.verticalTextAlign === "number")
                {

                    if(this.State.id === STATES_ID_TEXT_ADD)
                    {
                        if(typeof this.State.textObject.setVerticalAlign === "function")
                            this.State.textObject.setVerticalAlign(properties.verticalTextAlign);
                    }

                    if(this.State.id === STATES_ID_TEXT_ADD_IN_GROUP)
                    {
                        if(typeof this.State.setVerticalAlign === "function")
                            this.State.textObject.setVerticalAlign(properties.verticalTextAlign);
                    }
                }
                if(isRealNumber(properties.w) && isRealNumber(properties.h))
                {
                    for(var i = 0; i < selectedObjects.length; ++i)
                    {

                        if(this.State.group)
                        {
                            this.State.group.normalize();
                        }
                        if(selectedObjects[i].setXfrm)
                        {
                            selectedObjects[i].setXfrm(null, null, properties.w, properties.h, null, null, null);
                        }
                        if(this.State.group)
                        {
                            this.State.group.updateCoordinatesAfterInternalResize();
                        }
                    }
                }
                break;
            }
        }
        editor.WordControl.m_oLogicDocument.Recalculate();
    },

    setImageProps: function(properties)
    {
        switch(this.State.id)
        {
            case STATES_ID_NULL:
            case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {

                var selectedObjects = this.State.id === STATES_ID_NULL  || this.State.id === STATES_ID_TEXT_ADD ? this.selectedObjects : this.State.group.selectedObjects;
                for(var i = 0; i < selectedObjects.length; ++i)
                {

                    if(properties.type != undefined && properties.type != -1 && typeof selectedObjects[i].changePresetGeom === "function")
                    {
                        selectedObjects[i].changePresetGeom(properties.type);
                    }
                    if(properties.fill && typeof selectedObjects[i].changeFill === "function")
                    {
                        selectedObjects[i].changeFill(properties.fill);
                    }
                    if(properties.stroke && typeof selectedObjects[i].changeLine === "function")
                    {
                        selectedObjects[i].changeLine(properties.stroke);
                    }
                    if(properties.paddings && typeof selectedObjects[i].setPaddings === "function")
                    {
                        selectedObjects[i].setPaddings(properties.paddings);
                    }
                }
                if(typeof properties.verticalTextAlign === "number")
                {

                    if(this.State.id === STATES_ID_TEXT_ADD)
                    {
                        if(typeof this.State.textObject.setVerticalAlign === "function")
                            this.State.textObject.setVerticalAlign(properties.verticalTextAlign);
                    }

                    if(this.State.id === STATES_ID_TEXT_ADD_IN_GROUP)
                    {
                        if(typeof this.State.setVerticalAlign === "function")
                            this.State.textObject.setVerticalAlign(properties.verticalTextAlign);
                    }
                }
                if(this.State.id !==STATES_ID_GROUP && this.State.id !==STATES_ID_TEXT_ADD_IN_GROUP && isRealNumber(properties.w) && isRealNumber(properties.h))
                {
                    for(var i = 0; i < selectedObjects.length; ++i)
                    {

                        if(selectedObjects[i].setXfrm)
                        {
                            selectedObjects[i].setXfrm(null, null, properties.w, properties.h, null, null, null);
                        }
                    }
                }
                break;
            }
        }
        editor.WordControl.m_oLogicDocument.Recalculate();
    },

    imageApply: function(properties)
    {
        switch(this.State.id)
        {
            case STATES_ID_NULL:
            case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {

                var selectedObjects = this.State.id === STATES_ID_NULL  || this.State.id === STATES_ID_TEXT_ADD ? this.selectedObjects : this.State.group.selectedObjects;

                if(isRealNumber(properties.Width) && isRealNumber(properties.Height))
                {
                    if(this.State.group)
                    {
                        this.State.group.normalize();
                    }
                    for(var i = 0; i < selectedObjects.length; ++i)
                    {

                        if(selectedObjects[i].isImage && selectedObjects[i].isImage() && selectedObjects[i].setXfrm)
                        {
                            selectedObjects[i].setXfrm(null, null, properties.Width, properties.Height, null, null, null);
                        }
                    }
                    if(this.State.group)
                    {
                        this.State.group.updateCoordinatesAfterInternalResize();
                    }
                }

                var pos = properties.Position;
                if( pos && isRealNumber(pos.X) && isRealNumber(pos.X))
                {
                    if(this.State.group)
                    {
                        this.State.group.normalize();
                    }
                    for(var i = 0; i < selectedObjects.length; ++i)
                    {

                        if(selectedObjects[i].isImage && selectedObjects[i].isImage() && selectedObjects[i].setXfrm)
                        {
                            selectedObjects[i].setXfrm( pos.X, pos.Y, null, null, null, null, null);
                        }
                    }
                    if(this.State.group)
                    {
                        this.State.group.updateCoordinatesAfterInternalResize();
                    }
                }
                if(typeof properties.ImageUrl === "string")
                {
                    for(var i = 0; i < selectedObjects.length; ++i)
                    {

                        if(selectedObjects[i].isImage && selectedObjects[i].isImage() && selectedObjects[i].setBlipFill)
                        {
                            var b_f = selectedObjects[i].blipFill.createDuplicate();
                            b_f.fill.RasterImageId = properties.ImageUrl
                            selectedObjects[i].setBlipFill(b_f);
                        }
                    }
                }
                break;
            }
        }
    },

    chartApply: function(properties)
    {
        switch(this.State.id)
        {
            case STATES_ID_NULL:
            case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {

                var selectedObjects = this.State.id === STATES_ID_NULL  || this.State.id === STATES_ID_TEXT_ADD ? this.selectedObjects : this.State.group.selectedObjects;
                if(this.State.group)
                {
                    this.State.group.normalize();
                }
                for(var i = 0; i < selectedObjects.length; ++i)
                {
                    if(selectedObjects[i].isChart && selectedObjects[i].isChart())
                    {
                        selectedObjects[i].setDiagram(properties);
                    }
                }
                break;
            }
        }
    },

    canGroup: function()
    {
        if(this.selectedObjects.length < 2)
            return false;
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            if(typeof  this.selectedObjects[i].isTable === "function" && this.selectedObjects[i].isTable())
                return false;
            if(this.selectedObjects[i].isPlaceholder())
                return false;
        }
        return true;
    },

    canUnGroup: function()
    {
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            if(this.selectedObjects[i].isGroup())
                return true;
        }
        return false;
    },

    Add_FlowImage: function(W, H, Img)
    {
        var image = new CImageShape(this.slide);
        image.blipFill = new CUniFill();
        image.blipFill.fill = new CBlipFill();
        image.blipFill.fill.RasterImageId = Img;
        image.spPr.geometry = CreateGeometry("rect");
        image.spPr.geometry.Init(5, 5);
        image.spPr.xfrm.offX = (this.slide.presentation.Width - W)/2;
        image.spPr.xfrm.offY = (this.slide.presentation.Height - H)/2;
        image.spPr.xfrm.extX = W;
        image.spPr.xfrm.extY = H;
        this.slide.addToSpTreeToPos(this.slide.cSld.spTree.length, image);
        editor.WordControl.m_oLogicDocument.recalcMap[image.Id] = image;
    },

    groupShapes: function(drawingBase)
    {
        History.Create_NewPoint();
        var sp_tree = this.slide.cSld.spTree;
        var grouped_objects = [];
        for(var i =0; i < sp_tree.length; ++i)
        {
            if(sp_tree[i].selected)
            {
                grouped_objects.push(sp_tree[i]);
            }
        }
        this.slide.removeSelectedObjects();

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
        var group = new CGroupShape(this.slide);
        group.setOffset(min_x, min_y);
        group.setExtents(max_x - min_x, max_y - min_y);
        group.setChildExtents(max_x - min_x, max_y - min_y);
        group.setChildOffset(0, 0);
        for(i = 0; i < grouped_objects.length; ++i)
        {
            group.addToSpTree(group.spTree.length, grouped_objects[i]);
            grouped_objects[i].setOffset(grouped_objects[i].x - min_x, grouped_objects[i].y - min_y);
            grouped_objects[i].setGroup(group);
        }
       // group.setNvSpPr(new UniNvPr());
        group.recalcAll();
        group.select(this);
        this.slide.addToSpTreeToPos(this.slide.cSld.spTree.length, group);
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

        var drawing_bases = this.slide.cSld.spTree;
        for(i = 0; i < ungrouped_objects.length; ++i)
        {
            var cur_group = ungrouped_objects[i];
            var start_position = null;
            for(var j = 0; j < drawing_bases.length; ++j)
            {
                if(drawing_bases[j] === cur_group)
                {
                    start_position = j;
                    break;
                }
            }

            var ungrouped_sp_tree = ungrouped_objects[i].getUnGroupedSpTree();

            for(var j = 0; j < ungrouped_sp_tree.length; ++j)
            {
                ungrouped_sp_tree[j].recalcAll();
                this.slide.addToSpTreeToPos(start_position + j, ungrouped_sp_tree[j]);
            }
        }
        this.slide.removeSelectedObjects();
        this.resetSelectionState();
    },

    startSearchText : function(str, scanForward) //
    {
        if(typeof(str) != "string")
            return null;
        if(scanForward === undefined)
        {
            scanForward = true;
        }

        var _cur_glyph_num;
        var _arr_sel_states = null;
        var NumSelected = this.selectedObjects.length;
        var ArrGlyph = this.slide.cSld.spTree;
        if(this.State.id == STATES_ID_NULL)
        {
            if(NumSelected == 0 || NumSelected == ArrGlyph.length)
            {
                if(scanForward == true)
                {
                    for(_cur_glyph_num = 0; _cur_glyph_num < ArrGlyph.length; ++_cur_glyph_num)
                    {
                        if((_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num))!= null)
                        {
                            return _arr_sel_states[0];
                        }
                    }
                }
                else
                {
                    for(_cur_glyph_num = ArrGlyph.length - 1; _cur_glyph_num > -1; --_cur_glyph_num)
                    {
                        if((_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num))!= null)
                        {
                            return _arr_sel_states[_arr_sel_states.length-1];
                        }
                    }
                }
                return null;
            }
            else
            {
                if(scanForward == true)
                {
                    for(_cur_glyph_num = 0; _cur_glyph_num < ArrGlyph.length; ++_cur_glyph_num)
                    {
                        if(ArrGlyph[_cur_glyph_num].selected && (_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num))!= null)
                        {
                            return _arr_sel_states[0];
                        }
                    }
                    for(_cur_glyph_num = 0; _cur_glyph_num < ArrGlyph.length; ++_cur_glyph_num)
                    {
                        if(!ArrGlyph[_cur_glyph_num].selected && (_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num))!= null)
                        {
                            return _arr_sel_states[0];
                        }
                    }
                }
                else
                {
                    for(_cur_glyph_num = ArrGlyph.length - 1; _cur_glyph_num > -1; --_cur_glyph_num)
                    {
                        if(ArrGlyph[_cur_glyph_num].selected && (_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num)) != null)
                        {
                            return _arr_sel_states[_arr_sel_states.length - 1];
                        }
                    }
                    for(_cur_glyph_num = ArrGlyph.length - 1; _cur_glyph_num > -1; --_cur_glyph_num)
                    {
                        if(!ArrGlyph[_cur_glyph_num].selected && (_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num)) != null)
                        {
                            return _arr_sel_states[_arr_sel_states.length - 1];
                        }
                    }
                }

                return null;
            }
        }
        else if(this.State.id == STATES_ID_TEXT_ADD || this.State.id === STATES_ID_TEXT_ADD_IN_GROUP)
        {
            var _cur_doc_content;
            _cur_glyph_num = 0;
            var obj = this.State.id == STATES_ID_TEXT_ADD ? this.State.textObject : this.State.group;
            if( obj && (_cur_doc_content = obj.getCurDocumentContent()) != null )
            {
                for(_cur_glyph_num = 0; _cur_glyph_num < ArrGlyph.length; ++_cur_glyph_num)
                {
                    if(ArrGlyph[_cur_glyph_num] == obj)
                    {
                        break;
                    }
                }
                if(_cur_glyph_num < ArrGlyph.length)
                {
                    if((_arr_sel_states = obj.getSearchResults(str, _cur_glyph_num)) != null)
                    {
                        var b_table = obj instanceof CGraphicFrame;
                        var b_group = obj instanceof CGroupShape;
                        var _cur_pos_doc, _cur_pos_par, cur_row, cur_cell, cur_shape;
                        var _pos_sel_state;
                        var _tmp_sel_state;
                        var _prev_sel_state;
                        if(scanForward == true)
                        {
                            if(!_cur_doc_content.Selection.Use)
                            {
                                _cur_pos_doc = _cur_doc_content.CurPos.ContentPos;
                                _cur_pos_par = _cur_doc_content.Content[_cur_pos_doc].CurPos.ContentPos;
                            }
                            else
                            {
                                _cur_pos_doc = _cur_doc_content.Selection.EndPos;
                                _cur_pos_par = _cur_doc_content.Content[_cur_pos_doc].Selection.EndPos;
                            }

                            if(obj instanceof CGraphicFrame && obj.graphicObject instanceof  CTable)
                            {
                                var  table = obj.graphicObject;
                                for(var i = 0; i < table.Content.length; ++i)
                                {
                                    var row = table.Content[i];
                                    for(var j = 0; j < row.Content.length; ++j)
                                    {
                                        if(table.CurCell === row.Content[j])
                                        {
                                            cur_row = i;
                                            cur_cell = j;
                                            break;
                                        }
                                    }
                                }
                            }
                            if(b_group)
                            {
                                for(var t = 0; t < obj.arrGraphicObjects.length; ++t)
                                {
                                    if(obj.arrGraphicObjects[t] === this.State.textObject)
                                    {
                                        cur_shape = t;
                                        break;
                                    }
                                }
                            }

                            for(_pos_sel_state = 0; _pos_sel_state < _arr_sel_states.length; ++_pos_sel_state)
                            {
                                _tmp_sel_state = _arr_sel_states[_pos_sel_state];


                                if(_tmp_sel_state.textSelectionState != undefined)
                                {
                                    /*if(_prev_sel_state != undefined && _tmp_sel_state.textObject != _prev_sel_state.textObject)
                                    {
                                        return _arr_sel_states[_pos_sel_state];
                                    }*/
                                    var _text_sel_state = _tmp_sel_state.textSelectionState;
                                    if(b_table && isRealNumber(cur_row) && isRealNumber(cur_cell))
                                    {
                                        if(_text_sel_state[_text_sel_state.length - 1].CurCell.Row > cur_row)
                                        {
                                            return _arr_sel_states[_pos_sel_state];
                                        }
                                        if(_text_sel_state[_text_sel_state.length - 1].CurCell.Row === cur_row)
                                        {
                                            if(_text_sel_state[_text_sel_state.length - 1].CurCell.Cell > cur_cell)
                                                return _arr_sel_states[_pos_sel_state];
                                            if(_text_sel_state[_text_sel_state.length - 1].CurCell.Cell === cur_cell)
                                            {
                                                var ind1 = 2;
                                                if(_text_sel_state[_text_sel_state.length - ind1].Selection.StartPos > _cur_pos_doc)
                                                {
                                                    return _arr_sel_states[_pos_sel_state];
                                                }
                                                if(_text_sel_state[_text_sel_state.length - ind1].Selection.StartPos == _cur_pos_doc)
                                                {
                                                    if(_text_sel_state[_text_sel_state.length -ind1 -1][0][0].Selection.StartPos >= _cur_pos_par)
                                                    {
                                                        return _arr_sel_states[_pos_sel_state];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else if(b_group && isRealNumber(cur_shape))
                                    {
                                        if(_tmp_sel_state.shapeIndex > cur_shape)
                                        {
                                            return _arr_sel_states[_pos_sel_state];
                                        }
                                        if(_tmp_sel_state.shapeIndex === cur_shape)
                                        {
                                            var ind1 =  1;
                                            if(_text_sel_state[_text_sel_state.length - ind1].Selection.StartPos > _cur_pos_doc)
                                            {
                                                return _arr_sel_states[_pos_sel_state];
                                            }
                                            if(_text_sel_state[_text_sel_state.length - ind1].Selection.StartPos == _cur_pos_doc)
                                            {
                                                if(_text_sel_state[_text_sel_state.length -ind1 -1][0][0].Selection.StartPos >= _cur_pos_par)
                                                {
                                                    return _arr_sel_states[_pos_sel_state];
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        var ind1 =  1;
                                        if(_text_sel_state[_text_sel_state.length - ind1].Selection.StartPos > _cur_pos_doc)
                                        {
                                            return _arr_sel_states[_pos_sel_state];
                                        }
                                        if(_text_sel_state[_text_sel_state.length - ind1].Selection.StartPos == _cur_pos_doc)
                                        {
                                            if(_text_sel_state[_text_sel_state.length -ind1 -1][0][0].Selection.StartPos >= _cur_pos_par)
                                            {
                                                return _arr_sel_states[_pos_sel_state];
                                            }
                                        }
                                    }


                                }
                                _prev_sel_state = _tmp_sel_state;
                            }
                            for(++_cur_glyph_num; _cur_glyph_num < ArrGlyph.length; ++_cur_glyph_num)
                            {
                                if((_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num))!= null)
                                {
                                    return _arr_sel_states[0];
                                }
                            }
                        }
                        else
                        {
                            if(obj instanceof CGraphicFrame && obj.graphicObject instanceof  CTable)
                            {
                                var  table = obj.graphicObject;
                                for(var i = 0; i < table.Content.length; ++i)
                                {
                                    var row = table.Content[i];
                                    for(var j = 0; j < row.Content.length; ++j)
                                    {
                                        if(table.CurCell === row.Content[j])
                                        {
                                            cur_row = i;
                                            cur_cell = j;
                                            break;
                                        }
                                    }
                                }
                            }
                            if(b_group)
                            {
                                for(var t = 0; t < obj.arrGraphicObjects.length; ++t)
                                {
                                    if(obj.arrGraphicObjects[t] === this.State.textObject)
                                    {
                                        cur_shape = t;
                                        break;
                                    }
                                }
                            }

                            if(!_cur_doc_content.Selection.Use)
                            {
                                _cur_pos_doc = _cur_doc_content.CurPos.ContentPos;
                                _cur_pos_par = _cur_doc_content.Content[_cur_pos_doc].CurPos.ContentPos;
                            }
                            else
                            {
                                _cur_pos_doc = _cur_doc_content.Selection.StartPos;
                                _cur_pos_par = _cur_doc_content.Content[_cur_pos_doc].Selection.StartPos;
                            }

                            for(_pos_sel_state = _arr_sel_states.length - 1; _pos_sel_state > -1; --_pos_sel_state)
                            {
                                _tmp_sel_state = _arr_sel_states[_pos_sel_state];
                                if(_tmp_sel_state.textSelectionState != undefined)
                                {

                                    _text_sel_state = _tmp_sel_state.textSelectionState;
                                    if(b_table && isRealNumber(cur_row) && isRealNumber(cur_cell))
                                    {
                                        if(_text_sel_state[_text_sel_state.length - 1].CurCell.Row < cur_row)
                                        {
                                            return _arr_sel_states[_pos_sel_state];
                                        }
                                        if(_text_sel_state[_text_sel_state.length - 1].CurCell.Row === cur_row)
                                        {
                                            if(_text_sel_state[_text_sel_state.length - 1].CurCell.Cell < cur_cell)
                                                return _arr_sel_states[_pos_sel_state];
                                            if(_text_sel_state[_text_sel_state.length - 1].CurCell.Cell === cur_cell)
                                            {
                                                var ind1 = 2;
                                                if(_text_sel_state[_text_sel_state.length - ind1].Selection.EndPos < _cur_pos_doc)
                                                {
                                                    return _arr_sel_states[_pos_sel_state];
                                                }
                                                if(_text_sel_state[_text_sel_state.length - ind1].Selection.EndPos == _cur_pos_doc)
                                                {
                                                    if(_text_sel_state[_text_sel_state.length -ind1 -1][0][0].Selection.EndPos <= _cur_pos_par)
                                                    {
                                                        return _arr_sel_states[_pos_sel_state];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else if(b_group && isRealNumber(cur_shape))
                                    {
                                        if(_tmp_sel_state.shapeIndex < cur_shape)
                                        {
                                            return _arr_sel_states[_pos_sel_state];
                                        }
                                        if(_tmp_sel_state.shapeIndex === cur_shape)
                                        {
                                            var ind1 =  1;
                                            if(_text_sel_state[_text_sel_state.length - ind1].Selection.EndPos < _cur_pos_doc)
                                            {
                                                return _arr_sel_states[_pos_sel_state];
                                            }
                                            if(_text_sel_state[_text_sel_state.length - ind1].Selection.EndPos == _cur_pos_doc)
                                            {
                                                if(_text_sel_state[_text_sel_state.length -ind1 -1][0][0].Selection.EndPos <= _cur_pos_par)
                                                {
                                                    return _arr_sel_states[_pos_sel_state];
                                                }
                                            }
                                        }
                                    }
                                    else{

                                        if(_text_sel_state[_text_sel_state.length - 1].Selection.EndPos < _cur_pos_doc)
                                        {
                                            return _arr_sel_states[_pos_sel_state];
                                        }
                                        if(_text_sel_state[_text_sel_state.length - 1].Selection.EndPos == _cur_pos_doc)
                                        {
                                            if(_text_sel_state[_text_sel_state.length -2][0][0].Selection.EndPos <= _cur_pos_par)
                                            {
                                                return _arr_sel_states[_pos_sel_state];
                                            }
                                        }
                                    }
                                    }


                                _prev_sel_state = _tmp_sel_state;
                            }
                            for(--_cur_glyph_num; _cur_glyph_num > -1; --_cur_glyph_num)
                            {
                                if((_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num))!= null)
                                {
                                    return _arr_sel_states[_arr_sel_states.length - 1];
                                }
                            }
                        }
                    }
                    return null;
                }
            }
        }
        return null;
    },

    addChart: function(binary)
    {
        var chart = new CChartAsGroup(this.slide);
        chart.initFromBinary(binary);
        this.slide.addToSpTreeToPos(this.slide.cSld.spTree, chart);
        editor.WordControl.m_oLogicDocument.recalcMap[chart.Id] = chart;
    },

    editChart: function(binary)
    {
        switch(this.State.id)
        {
            case STATES_ID_GROUP:
            {
                break;
            }
            case STATES_ID_NULL:
            {
                if(this.selectedObjects.length === 1 && this.selectedObjects[0].chart)
                {
                    this.selectedObjects[0].initFromBinary(binary);
                    editor.WordControl.m_oLogicDocument.recalcMap[this.selectedObjects[0].Id] = this.selectedObjects[0];
                }
                break;
            }
        }
    },

    addNewParagraph: function(bRecalc)
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
                {
                    this.State.textObject.addNewParagraph(bRecalc);
                    //this.State.textObject.recalculate();
                    //this.updateSelectionState();
                }
                break;
            }
        }
    },

    Cursor_MoveLeft : function(AddToSelect, Word)
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                this.State.textObject.Cursor_MoveLeft(AddToSelect, Word);
                break;
            }
        }
    },

    Cursor_MoveRight : function(AddToSelect, Word)
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                this.State.textObject.Cursor_MoveRight(AddToSelect, Word);
                break;
            }
        }
    },

    Cursor_MoveUp : function(AddToSelect)
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                this.State.textObject.Cursor_MoveUp(AddToSelect);
                break;
            }
        }
    },

    Cursor_MoveDown : function(AddToSelect)
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                this.State.textObject.Cursor_MoveDown(AddToSelect);
                break;
            }
        }
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                this.State.textObject.Cursor_MoveDown(AddToSelect);
                break;
            }
        }
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                this.State.textObject.Cursor_MoveDown(AddToSelect);
                break;
            }
        }
    },

    Cursor_MoveAt : function( X, Y, AddToSelect )
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                this.State.textObject.Cursor_MoveAt(X, Y, AddToSelect );
                break;
            }
        }
    },

    Cursor_MoveToCell : function(bNext)
    {

    },


    remove: function(Count, bOnlyText, bRemoveOnlySelection)
    {
        switch (this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
                {
                    this.State.textObject.remove(Count, bOnlyText, bRemoveOnlySelection);
                    this.State.textObject.recalculate();
                    this.updateSelectionState();
                }
                break;
            }
            case STATES_ID_NULL:
            {
                if(editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)
                {
                    this.slide.removeSelectedObjects();
                }
                break;
            }

        }
    },

    getSelectionState: function()
    {
        var s = {};
        switch(this.State.id)
        {
            case STATES_ID_TEXT_ADD:
            {
                s.id = STATES_ID_TEXT_ADD;
                s.textObject = this.State.textObject;
                s.textSelectionState = this.State.textObject.getTextSelectionState();
                break;
            }
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                s.id = STATES_ID_TEXT_ADD_IN_GROUP;
                s.group = this.State.group;
                s.textObject = this.State.textObject;
                s.textSelectionState = this.State.textObject.getTextSelectionState();
                break;
            }
            default :
            {
                s.id = STATES_ID_NULL;
                s.selectedObjects = [];
                for(var i = 0; i < this.selectedObjects.length; ++i)
                {
                    s.selectedObjects.push(this.selectedObjects[i]);
                }
                break;
            }
        }
        return s;
    },

    setSelectionState: function(s)
    {
        this.resetSelectionState();
        switch(s.id)
        {
            case STATES_ID_TEXT_ADD:
            {
                s.textObject.select(this);
                s.textObject.addTextFlag = true;
                s.textObject.setTextSelectionState(s.textSelectionState);
                this.changeCurrentState(new TextAddState(this, this.slide, s.textObject));
                break;
            }
            case STATES_ID_TEXT_ADD_IN_GROUP:
            {
                s.group.select(this);
                s.textObject.addTextFlag = true;
                s.textObject.select(s.group);
                s.textObject.setTextSelectionState(s.textSelectionState);
                this.changeCurrentState(new TextAddInGroup(this, this.slide, s.group, s.textObject));

                break;
            }
            default :
            {
                for(var i = 0; i < s.selectedObjects.length; ++i)
                {
                    s.selectedObjects[i].select(this);
                }
                break;
            }
        }
        this.updateSelectionState()
    },

    recalculateCurPos: function()
    {
        if(isRealObject(this.State.textObject))
        {
            this.State.textObject.recalculateCurPos();
        }
    },


    onMouseDown: function(e, x, y)
    {
        this.State.onMouseDown(e, x, y);
        editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
        editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
    },

    onMouseDown2: function(e, x, y)
    {
        this.State.onMouseDown(e, x, y);
    },

    onMouseMove: function(e, x, y)
    {
        this.State.onMouseMove(e, x, y);
    },

    onMouseUp: function(e, x, y)
    {
        this.State.onMouseUp(e, x, y);
    },


    onMouseUp2: function(e, x, y)
    {
        this.State.onMouseUp(e, x, y);
        this.slide.presentation.Document_UpdateInterfaceState();
       /* if(this.State.id === STATES_ID_NULL)
        { */
            if(this.selectedObjects.length > 0)
            {
                var _data = new CContextMenuData();
                _data.Type = c_oAscContextMenuTypes.Main;
                _data.X_abs = e.X;
                _data.Y_abs = e.Y;
                editor.sync_ContextMenuCallback(_data);
            }
        //}
    },

    updateCursorType: function(e, x, y)
    {
        this.State.updateCursorType(e, x, y);
    },


    updateSelectionState: function()
    {
        if(isRealObject(this.State.textObject))
        {
            this.State.textObject.updateSelectionState();
        }
        else
        {
            this.slide.presentation.DrawingDocument.UpdateTargetTransform(null);
            this.slide.presentation.DrawingDocument.TargetEnd();
            this.slide.presentation.DrawingDocument.SelectEnabled(false);
            this.slide.presentation.DrawingDocument.SelectClear();
            this.slide.presentation.DrawingDocument.SelectShow();
        }

    },

    changeCurrentState: function(newState)
    {
        this.State = newState;
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
    },


    drawSelect: function(drawingDocument)
    {
        this.State.drawSelection(drawingDocument)
    },


    DrawOnOverlay: function(overlay)
    {
        for(var i = 0; i < this.arrTrackObjects.length; ++i)
            this.arrTrackObjects[i].draw(overlay);
    },

    drawTracks: function(overlay)
    {},



    hitToBoundsRect: function(x, y)
    {
        return false;
    }
};

function isRealObject(object)
{
    return object !== null && typeof object === "object" ;
}

function isRealNumber(number)
{
    return typeof number === "number" && !isNaN(number);
}

function isRealBool(bool)
{
    return bool === true || bool === false;
}