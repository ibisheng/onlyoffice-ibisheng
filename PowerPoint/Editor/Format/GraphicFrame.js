"use strict";
function CGraphicFrame()
{
    this.parent = parent;
    this.graphicObject = null;
    this.nvGraphicFramePr = null;
    this.spPr = null;
    this.group = null;

    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.transform = new CMatrix();
    this.compiledHierarchy = [];
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    this.stlesForParagraph = [];
    this.recalcInfo =
    {
        recalculateTransform: true,
        recalculateSizes: true,
        recalculateNumbering: true,
        recalculateShapeHierarchy: true
    };

}

CGraphicFrame.prototype =
{
    addToRecalculate: CShape.prototype.addToRecalculate,

    getDocContent: function()
    {
        if(this.graphicObject && this.graphicObject.CurCell)
        {
            return this.graphicObject.CurCell.Content;
        }
        return null;
    },

    setSpPr: function(spPr)
    {
        History.Add(this, {Type:historyitem_GraphicFrameSetSpPr, oldPr: this.spPr, newPr: spPr});
        this.spPr = spPr;
    },

    setGraphicObject: function(graphicObject)
    {
        History.Add(this, {Type: historyitem_GraphicFrameSetGraphicObject, oldPr: this.graphicObject, newPr: graphicObject});
        this.graphicObject = graphicObject;
    },

    setNvSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_GraphicFrameSetSetNvSpPr, oldPr: this.nvGraphicFramePr, newPr: pr});
        this.nvGraphicFramePr = pr;
    },

    setParent: function(parent)
    {
        History.Add(this, {Type:historyitem_GraphicFrameSetSetParent, oldPr: this.parent, newPr: parent});
        this.parent = parent;
    },

    setGroup: function(group)
    {
        History.Add(this, {Type: historyitem_GraphicFrameSetSetGroup, oldPr: this.group, newPr: group});
        this.group = group;
    },

    getObjectType: function()
    {
        return historyitem_type_GraphicFrame;
    },

    copy: function()
    {
        var ret = new CGraphicFrame();
        if(this.graphicObject)
        {
            ret.setGraphicObject(this.graphicObject.Copy(ret));
        }
        if(this.nvGraphicFramePr)
        {
            ret.setNvSpPr(this.nvGraphicFramePr.createDuplicate());
        }
        if(this.spPr)
        {
            ret.setSpPr(this.spPr.createDuplicate());
            ret.spPr.setParent(ret);
        }
        return ret;
    },


    isEmptyPlaceholder: function()
    {
        return false;
    },

    getAllFonts: function(fonts)
    {
        if(this.graphicObject)
        {
            for(var i = 0; i < this.graphicObject.Content.length; ++i)
            {
                var row = this.graphicObject.Content[i];
                var cells = row.Content;
                for(var j = 0; j < cells.length;++j)
                {
                    cells[j].Content.Document_Get_AllFontNames(fonts);
                }
            }
            delete fonts["+mj-lt"];
            delete fonts["+mn-lt"];
            delete fonts["+mj-ea"];
            delete fonts["+mn-ea"];
            delete fonts["+mj-cs"];
            delete fonts["+mn-cs"];
        }
    },

    isSimpleObject: function()
    {
        return true;
    },

    Cursor_MoveToStartPos : function()
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Cursor_MoveToStartPos();
            this.graphicObject.RecalculateCurPos();

        }
    },

    Cursor_MoveToEndPos : function()
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Cursor_MoveToEndPos();
            this.graphicObject.RecalculateCurPos();

        }
    },

    getSearchResults: function(str)
    {
        if(this.graphicObject instanceof CTable)
        {
            var ret = [];
            var rows = this.graphicObject.Content;
            for(var i = 0; i < rows.length; ++i)
            {
                var cells = rows[i].Content;
                for(var j = 0; j < cells.length; ++j)
                {
                    var cell = cells[j];
                    var s_arr = cell.Content.getSearchResults(str);
                    if(Array.isArray(s_arr) && s_arr.length > 0)
                    {
                        for(var t = 0; t < s_arr.length; ++t)
                        {

                            var s = {};
                            s.id = STATES_ID_TEXT_ADD;
                            s.textObject = this;



                            var TableState = {};
                            TableState.Selection =
                            {
                                Start    : true,
                                Use      : true,
                                StartPos :
                                {
                                    Pos : { Row : i, Cell : j },
                                    X   : this.graphicObject.Selection.StartPos.X,
                                    Y   : this.graphicObject.Selection.StartPos.Y
                                },
                                EndPos   :
                                {
                                    Pos : { Row : i, Cell : j },
                                    X   : this.graphicObject.Selection.EndPos.X,
                                    Y   : this.graphicObject.Selection.EndPos.Y
                                },
                                Type     : table_Selection_Text,
                                Data     : null,
                                Type2    : table_Selection_Common,
                                Data2    : null
                            };
                            TableState.Selection.Data = [];
                            TableState.CurCell = { Row : i, Cell : j};
                            s_arr[t].push( TableState );
                            s.textSelectionState = s_arr[t];
                            ret.push(s);
                        }
                    }

                }
            }
            return ret;
        }
        return [];
    },

    hitInPath: function()
    {
        return false;
    },

    paragraphFormatPaste: function(CopyTextPr, CopyParaPr, Bool)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Paragraph_Format_Paste(CopyTextPr, CopyParaPr, Bool);

            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }

    },

    Paragraph_ClearFormatting: function()
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Paragraph_ClearFormatting();

            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }

    },

    Set_Props: function(props)
    {
        if(this.graphicObject)
        {
            var bApplyToAll = this.parent.graphicObjects.State.textObject !== this;
           // if(bApplyToAll)
           //     this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_Props(props, bApplyToAll);
            //if(bApplyToAll)
            //    this.graphicObject.Set_ApplyToAll(false);
            this.OnContentRecalculate();
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },



    updateCursorType: function(x, y, e)
    {
        var tx = this.invertTransform.TransformPointX(x, y);
        var ty = this.invertTransform.TransformPointY(x, y);
        this.graphicObject.Update_CursorType(tx, ty, 0)
    },
    sendMouseData: function()
    {},

    Get_Id: function()
    {
        return this.Id;
    },



    getIsSingleBody: function()
    {
        if(!this.isPlaceholder())
            return false;
        if(this.getPlaceholderType() !== phType_body)
            return false;
        if(this.parent && this.parent.cSld && Array.isArray(this.parent.cSld.spTree))
        {
            var sp_tree = this.parent.cSld.spTree;
            for(var i = 0; i < sp_tree.length; ++i)
            {
                if(sp_tree[i] !== this && sp_tree[i].getPlaceholderType && sp_tree[i].getPlaceholderType() === phType_body)
                    return true;
            }
        }
        return true;
    },

    checkNotNullTransform: function()
    {
        if(this.spPr.xfrm && this.spPr.xfrm.isNotNull())
            return true;
        if(this.isPlaceholder())
        {
            var ph_type = this.getPlaceholderType();
            var ph_index = this.getPlaceholderIndex();
            var b_is_single_body = this.getIsSingleBody();
            switch (this.parent.kind)
            {
                case SLIDE_KIND:
                {
                    var placeholder = this.parent.Layout.getMatchingShape(ph_type, ph_index, b_is_single_body);
                    if(placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNull())
                        return true;
                    placeholder = this.parent.Layout.Master.getMatchingShape(ph_type, ph_index, b_is_single_body);
                    return placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNull();
                }

                case LAYOUT_KIND:
                {
                    var placeholder = this.parent.Master.getMatchingShape(ph_type, ph_index, b_is_single_body);
                    return placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNull();
                }
            }
        }
        return false;
    },

    getHierarchy: function()
    {
        if(this.recalcInfo.recalculateShapeHierarchy)
        {
            this.compiledHierarchy.length = 0;
            var hierarchy = this.compiledHierarchy;
            if(this.isPlaceholder())
            {
                var ph_type = this.getPlaceholderType();
                var ph_index = this.getPlaceholderIndex();
                var b_is_single_body = this.getIsSingleBody();
                switch (this.parent.kind)
                {
                    case SLIDE_KIND:
                    {
                        hierarchy.push(this.parent.Layout.getMatchingShape(ph_type, ph_index, b_is_single_body));
                        hierarchy.push(this.parent.Layout.Master.getMatchingShape(ph_type, ph_index, b_is_single_body));
                        break;
                    }

                    case LAYOUT_KIND:
                    {
                        hierarchy.push(this.parent.Master.getMatchingShape(ph_type, ph_index, b_is_single_body));
                        break;
                    }
                }
            }
            this.recalcInfo.recalculateShapeHierarchy = true;
        }
        return this.compiledHierarchy;
    },
    recalculate: function()
    {

        if(this.recalcInfo.recalculateSizes)
        {
            this.recalculateSizes();
            this.recalcInfo.recalculateSizes = false;
        }
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }

    },


    recalculateSizes: function()
    {
        this.graphicObject.XLimit -= this.graphicObject.X;
        this.graphicObject.YLimit -= this.graphicObject.Y;
        this.graphicObject.X = 0;
        this.graphicObject.Y = 0;
        this.graphicObject.X_origin = 0;
        var _page_bounds = this.graphicObject.Get_PageBounds(0);
        this.spPr.xfrm.extY = _page_bounds.Bottom - _page_bounds.Top;
        this.spPr.xfrm.extX = _page_bounds.Right - _page_bounds.Left;
    },

    Selection_Is_OneElement : function()
    {
        return true;
    },

    recalculateCurPos: function()
    {
        this.graphicObject.RecalculateCurPos();
    },

    isShape: function()
    {
        return false;
    },


    isImage: function()
    {
        return false;
    },


    isGroup: function()
    {
        return false;
    },


    isChart: function()
    {
        return false;
    },


    isTable: function()
    {
        return this.graphicObject instanceof CTable;
    },

    recalcAllColors: function()
    {
        this.recalcInfo.recalculateNumbering = true;
        this.stlesForParagraph = [];
        this.graphicObject.Recalc_CompiledPr();
    },

    recalcAll: function()
    {
        this.recalcInfo =
        {
            recalculateTransform: true,
            recalculateSizes: true,
            recalculateNumbering: true,
            recalculateShapeHierarchy: true
        };
        this.stlesForParagraph = [];
        this.graphicObject.Recalc_CompiledPr();
    },

    Hyperlink_CanAdd: function(bCheck)
    {
        if(this.graphicObject)
            return this.graphicObject.Hyperlink_CanAdd(bCheck);
        return false;
    },

    Hyperlink_Check: function(bCheck)
    {
        if(this.graphicObject)
            return this.graphicObject.Hyperlink_Check(bCheck);
        return false;
    },

    getTransformMatrix: function()
    {
        return this.transform;
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.transform;
    },

    OnContentReDraw: function()
    {},


    getRectBounds: function()
    {
        var transform = this.getTransformMatrix();
        var w = this.extX;
        var h = this.extY;
        var rect_points = [{x:0, y:0}, {x: w, y: 0}, {x: w, y: h}, {x: 0, y: h}];
        var min_x, max_x, min_y, max_y;
        min_x = transform.TransformPointX(rect_points[0].x, rect_points[0].y);
        min_y = transform.TransformPointY(rect_points[0].x, rect_points[0].y);
        max_x = min_x;
        max_y = min_y;
        var cur_x, cur_y;
        for(var i = 1; i < 4; ++i)
        {
            cur_x = transform.TransformPointX(rect_points[i].x, rect_points[i].y);
            cur_y = transform.TransformPointY(rect_points[i].x, rect_points[i].y);
            if(cur_x < min_x)
                min_x = cur_x;
            if(cur_x > max_x)
                max_x = cur_x;

            if(cur_y < min_y)
                min_y = cur_y;
            if(cur_y > max_y)
                max_y = cur_y;
        }
        return {minX: min_x, maxX: max_x, minY: min_y, maxY: max_y};
    },

    changeSize: function(kw, kh)
    {},

    getTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return {x: this.x, y: this.y, extX: this.extX, extY: this.extY, rot: this.rot, flipH: this.flipH, flipV: this.flipV};
    },

    canRotate: function()
    {
        return false;
    },

    canResize: function()
    {
        return false;
    },

    canMove: function()
    {
        return true;
    },

    canGroup: function()
    {
        return false;
    },


    createRotateTrack: function()
    {
        return new RotateTrackShapeImage(this);
    },

    createResizeTrack: function(cardDirection)
    {
        return new ResizeTrackShapeImage(this, cardDirection);
    },

    createMoveTrack: function()
    {
        return new MoveShapeImageTrack(this);
    },

    getSnapArrays: function(snapX, snapY)
    {
        var transform = this.getTransformMatrix();
        snapX.push(transform.tx);
        snapX.push(transform.tx + this.extX*0.5);
        snapX.push(transform.tx + this.extX);
        snapY.push(transform.ty);
        snapY.push(transform.ty + this.extY*0.5);
        snapY.push(transform.ty + this.extY);
    },


    hitInInnerArea: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
    },

    hitInTextRect: function(x, y)
    {
        return this.hitInInnerArea(x, y);
    },

    getInvertTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
            this.recalculateTransform();
        return this.invertTransform;
    },


    hitInBoundingRect: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);

        var _hit_context = this.getParentObjects().presentation.DrawingDocument.CanvasHitContext;

        return (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) ||
            HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY)||
            HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY)||
            HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0));
    },

    Document_UpdateRulersState : function(margins)
    {
        if(this.graphicObject)
        {
            this.graphicObject.Document_UpdateRulersState(this.parent.num);
        }
    },

    Get_PageLimits : function(PageIndex)
    {
        return { X : 0, Y : 0, XLimit : Page_Width, YLimit : Page_Height };
    },

    getParentObjects: function()
    {
        var parents = {slide: null, layout: null, master: null, theme: null};
        switch (this.parent.kind)
        {
            case SLIDE_KIND:
            {
                parents.slide = this.parent;
                parents.layout = this.parent.Layout;
                parents.master = this.parent.Layout.Master;
                parents.theme = this.parent.Layout.Master.Theme;
                parents.presentation = this.parent.Layout.Master.presentation;
                break;
            }
            case LAYOUT_KIND:
            {
                parents.layout = this.parent;
                parents.master = this.parent.Master;
                parents.theme = this.parent.Master.Theme;
                parents.presentation = this.parent.Master.presentation;
                break;
            }
            case MASTER_KIND:
            {
                parents.master = this.parent;
                parents.theme = this.parent.Theme;
                parents.presentation = this.parent.presentation;
                break;
            }
        }
        return parents;
    },

    Is_HdrFtr: function(bool)
    {
        if(bool) return null;
        return false;
    },

    Is_TableCellContent: function()
    {
        return false;
    },

    Is_InTable: function()
    {
        return null;
    },


    selectionSetStart: function(e, x, y, slideIndex)
    {
        if(isRealObject(this.graphicObject))
        {
            var tx, ty;
            tx = this.invertTransform.TransformPointX(x, y);
            ty = this.invertTransform.TransformPointY(x, y);
            if(g_mouse_event_type_down === e.Type)
            {
                if(this.graphicObject.Is_TableBorder( tx, ty, 0))
                {
                    History.Create_NewPoint();
                }
            }
            this.graphicObject.Selection_SetStart(tx, ty, 0, e);
            this.graphicObject.RecalculateCurPos();
            return

        }
    },

    isTableBorder: function(x, y)
    {
        var tx, ty;
        tx = this.invertTransform.TransformPointX(x, y);
        ty = this.invertTransform.TransformPointY(x, y);
        return this.graphicObject.Is_TableBorder( tx, ty, 0) != null;
    },

    selectionSetEnd: function(e, x, y, slideIndex)
    {
        if(isRealObject(this.graphicObject))
        {
            var tx, ty;
            tx = this.invertTransform.TransformPointX(x, y);
            ty = this.invertTransform.TransformPointY(x, y);
            this.graphicObject.Selection_SetEnd(tx, ty, 0, e);
            if(g_mouse_event_type_up === e.Type)
                editor.WordControl.m_oLogicDocument.Recalculate();
          //  this.recalculate();
        }
    },

    updateSelectionState: function()
    {
        if(isRealObject(this.graphicObject))
        {
            var drawingDocument = this.parent.presentation.DrawingDocument;
            var Doc = this.graphicObject;
            if ( true === Doc.Is_SelectionUse() && !Doc.Selection_IsEmpty()) {
                drawingDocument.UpdateTargetTransform(this.transform);
                drawingDocument.TargetEnd();
                drawingDocument.SelectEnabled(true);
                drawingDocument.SelectClear();
                Doc.Selection_Draw_Page(this.parent.num);
                drawingDocument.SelectShow();
            }
            else /*if(this.parent.elementsManipulator.Document.CurPos.Type == docpostype_FlowObjects ) */
            {
                drawingDocument.UpdateTargetTransform(this.transform);
                drawingDocument.TargetShow();
                drawingDocument.SelectEnabled(false);
            }
        }
        else
        {
            this.parent.presentation.DrawingDocument.UpdateTargetTransform(null);
            this.parent.presentation.DrawingDocument.TargetEnd();
            this.parent.presentation.DrawingDocument.SelectEnabled(false);
            this.parent.presentation.DrawingDocument.SelectClear();
            this.parent.presentation.DrawingDocument.SelectShow();
        }
    },

    updateInterfaceTextState: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Document_UpdateInterfaceState === "function")
        {
            return this.graphicObject.Document_UpdateInterfaceState();
        }
    },

    drawAdjustments: function()
    {},

    recalculateTransform: function()
    {
        if(!isRealObject(this.group))
        {
            if(this.spPr.xfrm.isNotNull())
            {
                var xfrm = this.spPr.xfrm;
                this.x = xfrm.offX;
                this.y = xfrm.offY;
                this.extX = xfrm.extX;
                this.extY = xfrm.extY;
                this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
                this.flipH = xfrm.flipH === true;
                this.flipV = xfrm.flipV === true;
            }
            else
            {
                if(this.isPlaceholder())
                {
                    var hierarchy = this.getHierarchy();
                    for(var i = 0; i < hierarchy.length; ++i)
                    {
                        var hierarchy_sp = hierarchy[i];
                        if(isRealObject(hierarchy_sp) && hierarchy_sp.spPr.xfrm.isNotNull())
                        {
                            var xfrm = hierarchy_sp.spPr.xfrm;
                            this.x = xfrm.offX;
                            this.y = xfrm.offY;
                            this.extX = xfrm.extX;
                            this.extY = xfrm.extY;
                            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
                            this.flipH = xfrm.flipH === true;
                            this.flipV = xfrm.flipV === true;
                            break;
                        }
                    }
                    if(i === hierarchy.length)
                    {
                        this.x = 0;
                        this.y = 0;
                        this.extX = 5;
                        this.extY = 5;
                        this.rot = 0;
                        this.flipH = false;
                        this.flipV = false;
                    }
                }
                else
                {
                    this.x = 0;
                    this.y = 0;
                    this.extX = 5;
                    this.extY = 5;
                    this.rot = 0;
                    this.flipH = false;
                    this.flipV = false;
                }
            }
        }
        else
        {
            var xfrm;
            if(this.spPr.xfrm.isNotNull())
            {
                xfrm = this.spPr.xfrm;
            }
            else
            {
                if(this.isPlaceholder())
                {
                    var hierarchy = this.getHierarchy();
                    for(var i = 0; i < hierarchy.length; ++i)
                    {
                        var hierarchy_sp = hierarchy[i];
                        if(isRealObject(hierarchy_sp) && hierarchy_sp.spPr.xfrm.isNotNull())
                        {
                            xfrm = hierarchy_sp.spPr.xfrm;
                            break;
                        }
                    }
                    if(i === hierarchy.length)
                    {
                        xfrm = new CXfrm();
                        xfrm.offX = 0;
                        xfrm.offX = 0;
                        xfrm.extX = 5;
                        xfrm.extY = 5;
                    }
                }
                else
                {
                    xfrm = new CXfrm();
                    xfrm.offX = 0;
                    xfrm.offY = 0;
                    xfrm.extX = 5;
                    xfrm.extY = 5;
                }
            }
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            this.x = scale_scale_coefficients.cx*(xfrm.offX - this.group.spPr.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy*(xfrm.offY - this.group.spPr.xfrm.chOffY);
            this.extX = scale_scale_coefficients.cx*xfrm.extX;
            this.extY = scale_scale_coefficients.cy*xfrm.extY;
            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = xfrm.flipH === true;
            this.flipV = xfrm.flipV === true;
        }
        this.transform.Reset();
        var hc = this.extX*0.5;
        var vc = this.extY*0.5;
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(this.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(this.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(this.transform, -this.rot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
        if(isRealObject(this.group))
        {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransformMatrix());
        }
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);

    },


    select: function(drawingObjectsController)
    {
        this.selected = true;
        var selected_objects;
        if(!isRealObject(this.group))
            selected_objects = drawingObjectsController.selectedObjects;
        else
            selected_objects = this.group.getMainGroup().selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(selected_objects[i] === this)
                break;
        }
        if(i === selected_objects.length)
            selected_objects.push(this);
    },

    deselect: function(drawingObjectsController)
    {
        this.selected = false;
        var selected_objects;
        if(!isRealObject(this.group))
            selected_objects = drawingObjectsController.selectedObjects;
        else
            selected_objects = this.group.getMainGroup().selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(selected_objects[i] === this)
            {
                selected_objects.splice(i, 1);
                break;
            }
        }
        /*if(this.graphicObject)
            this.graphicObject.Selection_Remove();   */
        return this;
    },

    draw: function(graphics)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && this.graphicObject.Draw)
        {
            graphics.transform3(this.transform);
            graphics.SetIntegerGrid(true);
            this.graphicObject.Draw(0, graphics);
            if(locktype_None != this.Lock.Get_Type())
                graphics.DrawLockObjectRect(this.Lock.Get_Type() , 0, 0, this.extX, this.extY);
            graphics.reset();
            graphics.SetIntegerGrid(true);
        }
    },

    Select: function()
    {},


    Set_CurrentElement: function()
    {},

    OnContentRecalculate: function()
    {
        this.recalcInfo.recalculateSizes = true;
        this.recalcInfo.recalculateTransform = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },


    getTextSelectionState: function()
    {
        return this.graphicObject.Get_SelectionState();
    },


    setTextSelectionState: function(Sate)
    {
        return this.graphicObject.Set_SelectionState(Sate, Sate.length-1);
    },

    getStylesForParagraph: function(level)
    {
        if(level == undefined)
        {
            level  = 0;
        }

        if(this.stlesForParagraph[level])
            return this.stlesForParagraph[level];

        var Styles = new CStyles();

        var theme = null, layout = null, master = null, presentation;

        switch(this.parent.kind)
        {
            case SLIDE_KIND :
            {
                layout = this.parent.Layout;
                if(layout!=null)
                {
                    master = layout.Master;
                    if(master!=null)
                    {
                        theme = master.Theme;
                        presentation = master.presentation;
                    }
                }
                break;
            }
            case LAYOUT_KIND :
            {

                layout = this.parent;
                if(layout!=null)
                {
                    master = layout.Master;
                    if(master!=null)
                    {
                        theme = master.Theme;
                        presentation = master.presentation;
                    }
                }
                break;
            }
            case MASTER_KIND :
            {

                master = this.parent;
                if(master!=null)
                {
                    theme = master.Theme;
                    presentation = master.presentation;
                }
                break;
            }
        }

        var isPlaceholder = this.isPlaceholder();
        if(isPlaceholder)
        {
            var phId = this.nvGraphicFramePr.nvPr.ph.idx, phType = this.nvGraphicFramePr.nvPr.ph.type;
            var b_is_single_body = this.getIsSingleBody();
            var layoutShape = null, masterShape = null;
            if(layout!=null)
            {
                layoutShape = layout.getMatchingShape(phType, phId, b_is_single_body);
            }
            if(master != null)
            {
                masterShape = master.getMatchingShape(phType, phId, b_is_single_body);
            }
        }

        var defaultStyle = null, masterStyle = null, masterShapeStyle = null, layoutShapeStyle = null, slideShapeStyle = null;


        if(presentation != null
            && presentation.defaultTextStyle != null
            && presentation.defaultTextStyle.levels[level] != null)
        {
            defaultStyle = new CStyle("defaultStyle", null, null, null);
            defaultStyle.ParaPr =  clone(presentation.defaultTextStyle.levels[level].pPr);
            defaultStyle.TextPr =  clone(presentation.defaultTextStyle.levels[level].rPr);
            if(defaultStyle.TextPr != undefined)
            {
                if(defaultStyle.TextPr.FontFamily  && defaultStyle.TextPr.FontFamily.Name )
                {
                    if(isThemeFont(defaultStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
                    {
                        defaultStyle.TextPr.FontFamily.themeFont =  defaultStyle.TextPr.FontFamily.Name;
                        defaultStyle.TextPr.FontFamily.Name = getFontInfo(defaultStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                    }
                }
                if(defaultStyle.TextPr.unifill && defaultStyle.TextPr.unifill.fill)
                {
                    defaultStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                    var _rgba =  defaultStyle.TextPr.unifill.getRGBAColor();

                    defaultStyle.TextPr.Color = new CDocumentColor( _rgba.R, _rgba.G, _rgba.B);
                }
                if(defaultStyle.TextPr.FontSize != undefined)
                {
                    defaultStyle.TextPr.themeFontSize = defaultStyle.TextPr.FontSize;
                }
            }

        }


        if(master && master.txStyles)
        {
            if(isPlaceholder)
            {
                switch(phType)
                {
                    case phType_ctrTitle :
                    case phType_title :
                    {
                        if(master.txStyles.titleStyle && master.txStyles.titleStyle.levels[level])
                        {
                            masterStyle = new CStyle("masterStyle", null, null, null);
                            masterStyle.ParaPr =  clone(master.txStyles.titleStyle.levels[level].pPr);
                            masterStyle.TextPr =  clone(master.txStyles.titleStyle.levels[level].rPr);
                        }
                        break;
                    }
                    case phType_body :
                    case phType_subTitle :
                    case phType_obj :
                    //case null :
                    {
                        if(master.txStyles.bodyStyle && master.txStyles.bodyStyle.levels[level])
                        {
                            masterStyle = new CStyle("masterStyle", null, null, null);
                            masterStyle.ParaPr =  clone(master.txStyles.bodyStyle.levels[level].pPr);
                            masterStyle.TextPr =  clone(master.txStyles.bodyStyle.levels[level].rPr);
                        }
                        break;
                    }
                    default :
                    {
                        if(master.txStyles.otherStyle && master.txStyles.otherStyle.levels[level])
                        {
                            masterStyle = new CStyle("masterStyle", null, null, null);
                            masterStyle.ParaPr =  clone(master.txStyles.otherStyle.levels[level].pPr);
                            masterStyle.TextPr =  clone(master.txStyles.otherStyle.levels[level].rPr);
                        }
                        break;
                    }
                }

            }
            else
            {
                if(master.txStyles.otherStyle && master.txStyles.otherStyle.levels[level])
                {
                    masterStyle = new CStyle("masterStyle", null, null, null);
                    masterStyle.ParaPr =  clone(master.txStyles.otherStyle.levels[level].pPr);
                    masterStyle.TextPr =  clone(master.txStyles.otherStyle.levels[level].rPr);
                }
            }

            if(masterStyle && masterStyle.TextPr)
            {
                if( masterStyle.TextPr.FontFamily  && masterStyle.TextPr.FontFamily.Name )
                {
                    if(masterStyle.TextPr.FontFamily && isThemeFont(masterStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
                    {
                        masterStyle.TextPr.FontFamily.themeFont =  masterStyle.TextPr.FontFamily.Name;
                        masterStyle.TextPr.FontFamily.Name = getFontInfo(masterStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                    }
                }

                if(masterStyle.TextPr.unifill && masterStyle.TextPr.unifill.fill)
                {
                    masterStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                    var _rgba = masterStyle.TextPr.unifill.getRGBAColor();
                    masterStyle.TextPr.Color = new CDocumentColor(_rgba.R, _rgba.G, _rgba.B);
                }

                if(masterStyle.TextPr.FontSize != undefined)
                {
                    masterStyle.TextPr.themeFontSize = masterStyle.TextPr.FontSize;
                }
            }

        }

        if(isPlaceholder)
        {
            if(masterShape && masterShape.txBody && masterShape.txBody.lstStyle && masterShape.txBody.lstStyle.levels[level])
            {
                masterShapeStyle = new CStyle("masterShapeStyle", null, null, null);
                masterShapeStyle.ParaPr =  clone(masterShape.txBody.lstStyle.levels[level].pPr);
                masterShapeStyle.TextPr =  clone(masterShape.txBody.lstStyle.levels[level].rPr);
                if(masterShapeStyle.TextPr)
                {
                    if(masterShapeStyle.TextPr.FontFamily && isThemeFont(masterShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
                    {
                        masterShapeStyle.TextPr.FontFamily.themeFont =  masterShapeStyle.TextPr.FontFamily.Name;
                        masterShapeStyle.TextPr.FontFamily.Name = getFontInfo(masterShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                    }

                    if(masterShapeStyle.TextPr.unifill && masterShapeStyle.TextPr.unifill.fill)
                    {
                        masterShapeStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        var _rgba = masterShapeStyle.TextPr.unifill.getRGBAColor();
                        masterShapeStyle.TextPr.Color = new CDocumentColor(_rgba.R, _rgba.G, _rgba.B);
                    }
                }
            }
            if(layoutShape && layoutShape.txBody && layoutShape.txBody.lstStyle && layoutShape.txBody.lstStyle.levels[level])
            {
                layoutShapeStyle = new CStyle("layoutShapeStyle", null, null, null);
                layoutShapeStyle.ParaPr =  clone(layoutShape.txBody.lstStyle.levels[level].pPr);
                layoutShapeStyle.TextPr =  clone(layoutShape.txBody.lstStyle.levels[level].rPr);
                if(layoutShapeStyle.TextPr && layoutShapeStyle.TextPr.FontFamily && isThemeFont(layoutShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
                {
                    layoutShapeStyle.TextPr.FontFamily.themeFont =  layoutShapeStyle.TextPr.FontFamily.Name;
                    layoutShapeStyle.TextPr.FontFamily.Name = getFontInfo(layoutShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                }


                if(layoutShapeStyle && layoutShapeStyle.TextPr && layoutShapeStyle.TextPr.unifill)
                {
                    layoutShapeStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                    var _rgba = layoutShapeStyle.TextPr.unifill.getRGBAColor();
                    layoutShapeStyle.TextPr.Color =  new CDocumentColor(_rgba.R, _rgba.G, _rgba.B);
                }
            }
        }

        if(/*this.parent.kind == SLIDE_KIND &&*/ this.txBody && this.txBody.lstStyle && this.txBody.lstStyle.levels[level])
        {
            slideShapeStyle = new CStyle("slideShapeStyle", null, null, null);
            slideShapeStyle.ParaPr =  clone(this.txBody.lstStyle.levels[level].pPr);
            slideShapeStyle.TextPr =  clone(this.txBody.lstStyle.levels[level].rPr);
            if(slideShapeStyle.TextPr && slideShapeStyle.TextPr.FontFamily && isThemeFont(slideShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
            {
                slideShapeStyle.TextPr.FontFamily.themeFont =  slideShapeStyle.TextPr.FontFamily.Name;
                slideShapeStyle.TextPr.FontFamily.Name = getFontInfo(slideShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
            }

            if(slideShapeStyle && slideShapeStyle.TextPr && slideShapeStyle.TextPr.unifill && slideShapeStyle.TextPr.unifill.fill)
            {
                slideShapeStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                var _rgba = slideShapeStyle.TextPr.unifill.getRGBAColor();
                slideShapeStyle.TextPr.Color = {
                    r : _rgba.R,
                    g : _rgba.G,
                    b : _rgba.B,
                    a : _rgba.A
                };
            }
        }

        if(isPlaceholder)
        {
            if(defaultStyle)
            {
                Styles.Style[Styles.Id] = defaultStyle;
                defaultStyle.BasedOn = null;
                ++Styles.Id;
            }

            if(masterStyle)
            {
                Styles.Style[Styles.Id] = masterStyle;
                masterStyle.BasedOn = Styles.Id-1;
                ++Styles.Id;
            }
        }
        else
        {
            if(masterStyle)
            {
                Styles.Style[Styles.Id] = masterStyle;
                masterStyle.BasedOn = null;
                ++Styles.Id;
            }

            if(defaultStyle)
            {
                Styles.Style[Styles.Id] = defaultStyle;
                defaultStyle.BasedOn = Styles.Id-1;
                ++Styles.Id;
            }
        }

        if(masterShapeStyle)
        {
            Styles.Style[Styles.Id] = masterShapeStyle;
            masterShapeStyle.BasedOn = Styles.Id-1;
            ++Styles.Id;
        }

        if(layoutShapeStyle)
        {
            Styles.Style[Styles.Id] = layoutShapeStyle;
            layoutShapeStyle.BasedOn = Styles.Id-1;
            ++Styles.Id;
        }

        if(slideShapeStyle)
        {
            Styles.Style[Styles.Id] = slideShapeStyle;
            slideShapeStyle.BasedOn = Styles.Id-1;
            ++Styles.Id;
        }

        this.stlesForParagraph[level] = Styles;
        return Styles;
    },

    isPlaceholder: function()
    {
        return this.nvGraphicFramePr &&  this.nvGraphicFramePr.nvPr && this.nvGraphicFramePr.nvPr.ph !== null;
    },

    getPhType: function()
    {
        if(this.isPlaceholder())
        {
            return this.nvGraphicFramePr.nvPr.ph.type;
        }
        return null;
    },


    getPhIndex: function()
    {
        if(this.isPlaceholder())
        {
            return this.nvGraphicFramePr.nvPr.ph.idx;
        }
        return null;
    },

    getPlaceholderType: function()
    {
        return this.getPhType();
    },

    getPlaceholderIndex: function()
    {
        return this.getPhIndex();
    },


    paragraphAdd: function(paraItem, bRecalculate)
    {
        this.graphicObject.Paragraph_Add(paraItem, false);
        this.recalcInfo.recalculateSizes = true;
        this.recalcInfo.recalculateTransform = true;
    },

    remove: function(Count, bOnlyText, bRemoveOnlySelection)
    {
        this.graphicObject.Remove(Count, bOnlyText, bRemoveOnlySelection);
        this.recalcInfo.recalculateSizes = true;
        this.recalcInfo.recalculateTransform = true;
    },

    addNewParagraph: function()
    {
        this.graphicObject.Add_NewParagraph(false);
        this.recalcInfo.recalculateContent = true;
        this.recalcInfo.recalculateTransformText = true;
    },

    setParagraphAlign: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ParagraphAlign(val);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransform = true;
        }
    },

    applyAllAlign: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphAlign(val);
            this.graphicObject.Set_ApplyToAll(false);
        }
    },

    setParagraphSpacing: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ParagraphSpacing(val);
        }
    },

    applyAllSpacing: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphSpacing(val);
            this.graphicObject.Set_ApplyToAll(false);
        }
    },

    setParagraphNumbering: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ParagraphNumbering(val);
        }
    },


    setParagraphIndent: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ParagraphIndent(val);
        }
    },

    
    Get_Styles: function(level, bTablesStyleId, bParagraph)
    {
        if(level == undefined)
        {
            level  = 0;
        }

        var Styles = new CStyles();

        if(!this.parent)
            return Styles;
        var theme = null, layout = null, master = null, presentation;

        switch(this.parent.kind)
        {
            case SLIDE_KIND :
            {
                layout = this.parent.Layout;
                if(layout!=null)
                {
                    master = layout.Master;
                    if(master!=null)
                    {
                        theme = master.Theme;
                        presentation = master.presentation;
                    }
                }
                break;
            }
            case LAYOUT_KIND :
            {

                layout = this.parent;
                if(layout!=null)
                {
                    master = layout.Master;
                    if(master!=null)
                    {
                        theme = master.Theme;
                        presentation = master.presentation;
                    }
                }
                break;
            }
            case MASTER_KIND :
            {

                master = this.parent;
                if(master!=null)
                {
                    theme = master.Theme;
                    presentation = master.presentation;
                }
                break;
            }
        }

        if(bParagraph && false)
        {
            var isPlaceholder = this.isPlaceholder();
            if(isPlaceholder)
            {
                var phId = this.nvGraphicFramePr.nvPr.ph.idx, phType = this.nvGraphicFramePr.nvPr.ph.type;
                var b_is_single_body = this.getIsSingleBody();
                var layoutShape = null, masterShape = null;

                if(layout!=null)
                {
                    layoutShape = layout.getMatchingShape(phType, phId, b_is_single_body);
                }
                if(master != null)
                {
                    masterShape = master.getMatchingShape(phType, phId, b_is_single_body);
                }
            }

            var defaultStyle = null, masterStyle = null, masterShapeStyle = null, layoutShapeStyle = null, slideShapeStyle = null;


            if(presentation != null
                && presentation.defaultTextStyle != null
                && presentation.defaultTextStyle.levels[level] != null)
            {
                defaultStyle = new CStyle("defaultStyle", null, null, null);
                defaultStyle.ParaPr =  clone(presentation.defaultTextStyle.levels[level].pPr);
                defaultStyle.TextPr =  clone(presentation.defaultTextStyle.levels[level].rPr);
                if(defaultStyle.TextPr != undefined)
                {
                    if(defaultStyle.TextPr.FontFamily  && defaultStyle.TextPr.FontFamily.Name )
                    {
                        if(isThemeFont(defaultStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
                        {
                            defaultStyle.TextPr.FontFamily.themeFont =  defaultStyle.TextPr.FontFamily.Name;
                            defaultStyle.TextPr.FontFamily.Name = getFontInfo(defaultStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                        }
                    }
                    if(defaultStyle.TextPr.unifill && defaultStyle.TextPr.unifill.fill)
                    {
                        defaultStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        var _rgba = defaultStyle.TextPr.unifill.getRGBAColor();
                        defaultStyle.TextPr.Color = {
                            r : _rgba.R,
                            g : _rgba.G,
                            b : _rgba.B,
                            a : _rgba.A
                        };
                    }
                    if(defaultStyle.TextPr.FontSize != undefined)
                    {
                        defaultStyle.TextPr.themeFontSize = defaultStyle.TextPr.FontSize;
                    }
                }

            }


            if(master && master.txStyles)
            {
                if(isPlaceholder)
                {
                    switch(phType)
                    {
                        case phType_ctrTitle :
                        case phType_title :
                        {
                            if(master.txStyles.titleStyle && master.txStyles.titleStyle.levels[level])
                            {
                                masterStyle = new CStyle("masterStyle", null, null, null);
                                masterStyle.ParaPr =  clone(master.txStyles.titleStyle.levels[level].pPr);
                                masterStyle.TextPr =  clone(master.txStyles.titleStyle.levels[level].rPr);
                            }
                            break;
                        }
                        case phType_body :
                        case phType_subTitle :
                        case phType_obj :
                        case null :
                        {
                            if(master.txStyles.bodyStyle && master.txStyles.bodyStyle.levels[level])
                            {
                                masterStyle = new CStyle("masterStyle", null, null, null);
                                masterStyle.ParaPr =  clone(master.txStyles.bodyStyle.levels[level].pPr);
                                masterStyle.TextPr =  clone(master.txStyles.bodyStyle.levels[level].rPr);
                            }
                            break;
                        }
                        default :
                        {
                            if(master.txStyles.otherStyle && master.txStyles.otherStyle.levels[level])
                            {
                                masterStyle = new CStyle("masterStyle", null, null, null);
                                masterStyle.ParaPr =  clone(master.txStyles.otherStyle.levels[level].pPr);
                                masterStyle.TextPr =  clone(master.txStyles.otherStyle.levels[level].rPr);
                            }
                            break;
                        }
                    }

                }
                else
                {
                    if(master.txStyles.otherStyle && master.txStyles.otherStyle.levels[level])
                    {
                        masterStyle = new CStyle("masterStyle", null, null, null);
                        masterStyle.ParaPr =  clone(master.txStyles.otherStyle.levels[level].pPr);
                        masterStyle.TextPr =  clone(master.txStyles.otherStyle.levels[level].rPr);
                    }
                }

                if(masterStyle && masterStyle.TextPr)
                {
                    if( masterStyle.TextPr.FontFamily  && masterStyle.TextPr.FontFamily.Name )
                    {
                        if(masterStyle.TextPr.FontFamily && isThemeFont(masterStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
                        {
                            masterStyle.TextPr.FontFamily.themeFont =  masterStyle.TextPr.FontFamily.Name;
                            masterStyle.TextPr.FontFamily.Name = getFontInfo(masterStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                        }
                    }

                    if(masterStyle.TextPr.unifill && masterStyle.TextPr.unifill.fill)
                    {
                        masterStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        var _rgba = masterStyle.TextPr.unifill.getRGBAColor();
                        masterStyle.TextPr.Color = {
                            r : _rgba.R,
                            g : _rgba.G,
                            b : _rgba.B,
                            a : _rgba.A
                        };
                    }

                    if(masterStyle.TextPr.FontSize != undefined)
                    {
                        masterStyle.TextPr.themeFontSize = masterStyle.TextPr.FontSize;
                    }
                }

            }

            if(isPlaceholder)
            {
                if(masterShape && masterShape.txBody && masterShape.txBody.lstStyle && masterShape.txBody.lstStyle.levels[level])
                {
                    masterShapeStyle = new CStyle("masterShapeStyle", null, null, null);
                    masterShapeStyle.ParaPr =  clone(masterShape.txBody.lstStyle.levels[level].pPr);
                    masterShapeStyle.TextPr =  clone(masterShape.txBody.lstStyle.levels[level].rPr);
                    if(masterShapeStyle.TextPr)
                    {
                        if(masterShapeStyle.TextPr.FontFamily && isThemeFont(masterShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
                        {
                            masterShapeStyle.TextPr.FontFamily.themeFont =  masterShapeStyle.TextPr.FontFamily.Name;
                            masterShapeStyle.TextPr.FontFamily.Name = getFontInfo(masterShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                        }

                        if(masterShapeStyle.TextPr.unifill && masterShapeStyle.TextPr.unifill.fill)
                        {
                            masterShapeStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                            var _rgba = masterShapeStyle.TextPr.unifill.getRGBAColor();
                            masterShapeStyle.TextPr.Color = {
                                r : _rgba.R,
                                g : _rgba.G,
                                b : _rgba.B,
                                a : _rgba.A
                            };
                        }
                    }
                }
                if(layoutShape && layoutShape.txBody && layoutShape.txBody.lstStyle && layoutShape.txBody.lstStyle.levels[level])
                {
                    layoutShapeStyle = new CStyle("layoutShapeStyle", null, null, null);
                    layoutShapeStyle.ParaPr =  clone(layoutShape.txBody.lstStyle.levels[level].pPr);
                    layoutShapeStyle.TextPr =  clone(layoutShape.txBody.lstStyle.levels[level].rPr);
                    if(layoutShapeStyle.TextPr && layoutShapeStyle.TextPr.FontFamily && isThemeFont(layoutShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
                    {
                        layoutShapeStyle.TextPr.FontFamily.themeFont =  layoutShapeStyle.TextPr.FontFamily.Name;
                        layoutShapeStyle.TextPr.FontFamily.Name = getFontInfo(layoutShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                    }


                    if(layoutShapeStyle && layoutShapeStyle.TextPr && layoutShapeStyle.TextPr.unifill && layoutShapeStyle.TextPr.unifill.fill)
                    {
                        layoutShapeStyle.unifill.calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        var _rgba = layoutShapeStyle.unifill.getRGBAColor();
                        layoutShapeStyle.TextPr.Color = {
                            r : _rgba.R,
                            g : _rgba.G,
                            b : _rgba.B,
                            a : _rgba.A
                        };
                    }
                }
            }

            if(/*this.parent.kind == SLIDE_KIND &&*/ this.txBody && this.txBody.lstStyle && this.txBody.lstStyle.levels[level])
            {
                slideShapeStyle = new CStyle("slideShapeStyle", null, null, null);
                slideShapeStyle.ParaPr =  clone(this.txBody.lstStyle.levels[level].pPr);
                slideShapeStyle.TextPr =  clone(this.txBody.lstStyle.levels[level].rPr);
                if(slideShapeStyle.TextPr && slideShapeStyle.TextPr.FontFamily && isThemeFont(slideShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme)
                {
                    slideShapeStyle.TextPr.FontFamily.themeFont =  slideShapeStyle.TextPr.FontFamily.Name;
                    slideShapeStyle.TextPr.FontFamily.Name = getFontInfo(slideShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                }

                if(slideShapeStyle && slideShapeStyle.TextPr && slideShapeStyle.TextPr.unifill)
                {
                    slideShapeStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                    var _rgba = slideShapeStyle.TextPr.unifill.getRGBAColor();
                    slideShapeStyle.TextPr.Color = {
                        r : _rgba.R,
                        g : _rgba.G,
                        b : _rgba.B,
                        a : _rgba.A
                    };
                }
            }

            if(isPlaceholder)
            {
                if(defaultStyle)
                {
                    Styles.Style[Styles.Id] = defaultStyle;
                    defaultStyle.BasedOn = null;
                    ++Styles.Id;
                }

                if(masterStyle)
                {
                    Styles.Style[Styles.Id] = masterStyle;
                    masterStyle.BasedOn = Styles.Id-1;
                    ++Styles.Id;
                }
            }
            else
            {
                if(masterStyle)
                {
                    Styles.Style[Styles.Id] = masterStyle;
                    masterStyle.BasedOn = null;
                    ++Styles.Id;
                }

                if(defaultStyle)
                {
                    Styles.Style[Styles.Id] = defaultStyle;
                    defaultStyle.BasedOn = Styles.Id-1;
                    ++Styles.Id;
                }
            }

            if(masterShapeStyle)
            {
                Styles.Style[Styles.Id] = masterShapeStyle;
                masterShapeStyle.BasedOn = Styles.Id-1;
                ++Styles.Id;
            }

            if(layoutShapeStyle)
            {
                Styles.Style[Styles.Id] = layoutShapeStyle;
                layoutShapeStyle.BasedOn = Styles.Id-1;
                ++Styles.Id;
            }

            if(slideShapeStyle)
            {
                Styles.Style[Styles.Id] = slideShapeStyle;
                slideShapeStyle.BasedOn = Styles.Id-1;
                ++Styles.Id;
            }

            if(this.style && this.style.fontRef)
            {
                var refStyle = new CStyle("refStyle", null, null, null);
                refStyle.ParaPr = {};
                refStyle.TextPr = {};
                switch  (this.style.fontRef.idx)
                {
                    case fntStyleInd_major :
                    {
                        refStyle.TextPr.FontFamily = {Name : getFontInfo("+mj-lt")(theme.themeElements.fontScheme) };
                        break;
                    }
                    case fntStyleInd_minor :
                    {
                        refStyle.TextPr.FontFamily = {Name : getFontInfo("+mn-lt")(theme.themeElements.fontScheme) };
                        break;
                    }
                    default :
                    {
                        break;
                    }
                }

                if(this.style.fontRef.Color!=null && this.style.fontRef.Color.color != null)
                {
                    var unifill = new CUniFill();
                    unifill.fill = new CSolidFill();
                    unifill.fill.color = this.style.fontRef.Color;
                    refStyle.TextPr.unifill = unifill;
                }
                else
                {
                    refStyle.TextPr.unifill = null;
                }

                Styles.Style[Styles.Id] = refStyle;
                refStyle.BasedOn = Styles.Id-1;
                ++Styles.Id;
            }
            return Styles;
        }


        if(typeof bTablesStyleId === "number")
        {
            if(presentation !== null && typeof presentation === "object")
            {
                if(Array.isArray(presentation.globalTableStyles) && presentation.globalTableStyles[bTablesStyleId] instanceof CStyle)
                {
                    Styles.Style[Styles.Id] = presentation.globalTableStyles[bTablesStyleId];
                    ++Styles.Id;
                }
            }
        }
        return Styles;
    },

    Get_StartPage_Absolute: function()
    {
        return this.parent.num;
    },
    Get_PageContentStartPos: function()
    {
        if(this.parent.kind == SLIDE_KIND)
        {
            return this.parent.Layout.Master.presentation.Get_PageContentStartPos( this.parent.num );
        }
        return {
            X : this.pH+this.ext.cx,
            XLimit: this.ext.cx,
            Y : this.pV+this.ext.cy,
            YLimit : this.ext.cy,
            MaxTopBorder : 0};


    },

    hitToHandles: function()
    {
        return -1;
    },

    hitToAdjustment: function()
    {
        return {hit:false};
    },



    Refresh_RecalcData: function()
    {
        this.Refresh_RecalcData2();
    },

    Refresh_RecalcData2: function()
    {
        this.addToRecalculate();
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_GraphicFrameSetSpPr         :
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_GraphicFrameSetGraphicObject:
            {
                this.graphicObject = data.oldPr;
                break;
            }
            case historyitem_GraphicFrameSetSetNvSpPr    :
            {
                this.nvGraphicFramePr = data.oldPr;
                break;
            }
            case historyitem_GraphicFrameSetSetParent    :
            {
                this.parent = data.oldPr;
                break;
            }
            case historyitem_GraphicFrameSetSetGroup     :
            {
                this.group = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_GraphicFrameSetSpPr         :
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_GraphicFrameSetGraphicObject:
            {
                this.graphicObject = data.newPr;
                break;
            }
            case historyitem_GraphicFrameSetSetNvSpPr    :
            {
                this.nvGraphicFramePr = data.newPr;
                break;
            }
            case historyitem_GraphicFrameSetSetParent    :
            {
                this.parent = data.newPr;
                break;
            }
            case historyitem_GraphicFrameSetSetGroup     :
            {
                this.group = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_GraphicFrameSetSpPr          :
            case historyitem_GraphicFrameSetGraphicObject :
            case historyitem_GraphicFrameSetSetNvSpPr     :
            case historyitem_GraphicFrameSetSetParent     :
            case historyitem_GraphicFrameSetSetGroup      :
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var  type = r.GetLong();
        switch(type)
        {
            case historyitem_GraphicFrameSetSpPr         :
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_GraphicFrameSetGraphicObject:
            {
                this.graphicObject = readObject(r);
                break;
            }
            case historyitem_GraphicFrameSetSetNvSpPr    :
            {
                this.nvGraphicFramePr = readObject(r);
                break;
            }
            case historyitem_GraphicFrameSetSetParent    :
            {
                this.parent = readObject(r);
                break;
            }
            case historyitem_GraphicFrameSetSetGroup     :
            {
                this.group = readObject(r);
                break;
            }
        }
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(historyitem_type_GraphicFrame);
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    }
};