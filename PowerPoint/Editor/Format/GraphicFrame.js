/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 8/20/13
 * Time: 7:27 PM
 * To change this template use File | Settings | File Templates.
 */
function CGraphicFrame(parent)
{
    this.parent = parent;
    this.graphicObject = null;
    this.nvGraphicFramePr = null;
    this.spPr = new CSpPr();

    this.recalcInfo =
    {
        recalculateTransform: true,
        recalculateSizes: false
};

    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.transform = new CMatrix();

    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);

}

CGraphicFrame.prototype =
{

    setGraphicObject: function(graphicObject)
    {
        History.Add(this, {Type: historyitem_SetGraphicObject, oldPr: this.graphicObject, newPr: graphicObject});
        this.graphicObject = graphicObject;
    },

    Get_Id: function()
    {
        return this.Id;
    },
    recalculate: function()
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Recalculate_Page(0);
            this.graphicObject.X = 0;
            this.graphicObject.Y = 0;
        }
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

    getTransformMatrix: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.transform;
    },

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

    getTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return {x: this.x, y: this.y, extX: this.extX, extY: this.extY, rot: this.rot, flipH: this.flipH, flipV: this.flipV};
    },

    setXfrm: function(offX, offY, extX, extY, rot, flipH, flipV)
    {
        if(this.spPr.xfrm.isNotNull())
        {
            if(isRealNumber(offX) && isRealNumber(offY))
                this.setOffset(offX, offY);

            if(isRealNumber(extX) && isRealNumber(extY))
                this.setExtents(extX, extY);

            if(isRealNumber(rot))
                this.setRotate(rot);

            if(isRealBool(flipH) && isRealBool(flipV))
                this.setFlips(flipH, flipV);
        }
        else
        {
            var transform = this.getTransform();
            if(isRealNumber(offX) && isRealNumber(offY))
                this.setOffset(offX, offY);
            else
                this.setOffset(transform.x, transform.y);

            if(isRealNumber(extX) && isRealNumber(extY))
                this.setExtents(extX, extY);
            else
                this.setExtents(transform.extX, transform.extY);

            if(isRealNumber(rot))
                this.setRotate(rot);
            else
                this.setRotate(transform.rot);
            if(isRealBool(flipH) && isRealBool(flipV))
                this.setFlips(flipH, flipV);
            else
                this.setFlips(transform.flipH, transform.flipV);
        }
    },

    setRotate: function(rot)
    {
        var xfrm = this.spPr.xfrm;
        History.Add(this, {Type: historyitem_SetShapeRot, oldRot: xfrm.rot, newRot: rot});

        this.recalcInfo.recalculateTransform = true;
        xfrm.rot = rot;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;

    },

    setOffset: function(offX, offY)
    {
        History.Add(this, {Type: historyitem_SetShapeOffset, oldOffsetX: this.spPr.xfrm.offX, newOffsetX: offX, oldOffsetY: this.spPr.xfrm.offY, newOffsetY: offY});
        this.spPr.xfrm.offX = offX;
        this.spPr.xfrm.offY = offY;
        this.recalcInfo.recalculateTransform = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },


    setExtents: function(extX, extY)
    {
        History.Add(this, {Type: historyitem_SetShapeExtents, oldExtentX: this.spPr.xfrm.extX, newExtentX: extX, oldExtentY: this.spPr.xfrm.extY, newExtentY: extY});
        this.spPr.xfrm.extX = extX;
        this.spPr.xfrm.extY = extY;
        this.recalcInfo.recalculateTransform = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },

    setFlips: function(flipH, flipV)
    {
        History.Add(this, {Type: historyitem_SetShapeFlips, oldFlipH: this.spPr.xfrm.flipH, newFlipH: flipH, oldFlipV: this.spPr.xfrm.flipV, newFlipV: flipV});
        this.spPr.xfrm.flipH = flipH;
        this.spPr.xfrm.flipV = flipV;
        this.recalcInfo.recalculateTransform = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },

    canRotate: function()
    {
        return false;
    },

    canResize: function()
    {
        return true;//TODO
    },

    canMove: function()
    {
        return true;//TODO
    },

    canGroup: function()
    {
        return true;//TODO
    },


    canChangeAdjustments: function()
    {
        return true;//TODO
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


    createRotateInGroupTrack: function()
    {
        return new RotateTrackShapeImageInGroup(this);
    },

    createResizeInGroupTrack: function(cardDirection)
    {
        return new ResizeTrackShapeImageInGroup(this, cardDirection);
    },

    createMoveInGroupTrack: function()
    {
        return new MoveShapeImageTrackInGroup(this);
    },

    hitInInnerArea: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
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
            this.graphicObject.Selection_SetStart(tx, ty, 0, e);
        }
    },

    selectionSetEnd: function(e, x, y, slideIndex)
    {
        if(isRealObject(this.graphicObject))
        {
            var tx, ty;
            tx = this.invertTransform.TransformPointX(x, y);
            ty = this.invertTransform.TransformPointY(x, y);
            this.graphicObject.Selection_SetEnd(tx, ty, 0, e);
            this.recalcInfo.recalculateTransform = true;
            this.recalcInfo.recalculateSizes = true;
            this.recalculate();
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
    },

    draw: function(graphics)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && this.graphicObject.Draw)
        {
            graphics.transform3(this.transform);
            graphics.SetIntegerGrid(true);
            this.graphicObject.Draw(0, graphics);
            graphics.SetIntegerGrid(true);
            graphics.reset();
        }
    },

    Select: function()
    {},

    OnContentRecalculate: function()
    {
        this.recalcInfo.recalculateSizes = true;
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
            var layoutShape = null, masterShape = null;
            if(layout!=null)
            {
                layoutShape = layout.getMatchingShape(phType, phId);
            }
            if(master != null)
            {
                masterShape = master.getMatchingShape(phType, phId);
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
                    if(defaultStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                    {
                        defaultStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        defaultStyle.TextPr.Color = new CDocumentColor( defaultStyle.TextPr.unifill.fill.color.RGBA.R, defaultStyle.TextPr.unifill.fill.color.RGBA.G,  defaultStyle.TextPr.unifill.fill.color.RGBA.B);
                    }
                    if(defaultStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                    {

                        defaultStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        defaultStyle.TextPr.Color= new CDocumentColor( defaultStyle.TextPr.unifill.fill.color.RGBA.R, defaultStyle.TextPr.unifill.fill.color.RGBA.G,  defaultStyle.TextPr.unifill.fill.color.RGBA.B);
                    }
                    if(defaultStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                    {
                        defaultStyle.TextPr.Color = new CDocumentColor( 0, 0, 0);
                    }
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
                    if(masterStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                    {
                        masterStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        masterStyle.TextPr.Color = new CDocumentColor( masterStyle.TextPr.unifill.fill.color.RGBA.R, masterStyle.TextPr.unifill.fill.color.RGBA.G,  masterStyle.TextPr.unifill.fill.color.RGBA.B);
                    }
                    if(masterStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                    {

                        masterStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        masterStyle.TextPr.Color = new CDocumentColor( masterStyle.TextPr.unifill.fill.color.RGBA.R, masterStyle.TextPr.unifill.fill.color.RGBA.G,  masterStyle.TextPr.unifill.fill.color.RGBA.B);
                    }
                    if(masterStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                    {
                        masterStyle.TextPr.Color =  new CDocumentColor( 0, 0, 0);
                    }
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
                        if(masterShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                        {
                            masterShapeStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                            masterShapeStyle.TextPr.Color = new CDocumentColor( masterShapeStyle.TextPr.unifill.fill.color.RGBA.R, masterShapeStyle.TextPr.unifill.fill.color.RGBA.G,  masterShapeStyle.TextPr.unifill.fill.color.RGBA.B);
                        }
                        if(masterShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                        {

                            masterShapeStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                            masterShapeStyle.TextPr.Color = new CDocumentColor( masterShapeStyle.TextPr.unifill.fill.color.RGBA.R, masterShapeStyle.TextPr.unifill.fill.color.RGBA.G,  masterShapeStyle.TextPr.unifill.fill.color.RGBA.B);
                        }
                        if(masterShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                        {
                            masterShapeStyle.TextPr.Color = new CDocumentColor(0,0,0);
                        }
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
                    if(layoutShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                    {
                        layoutShapeStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        layoutShapeStyle.TextPr.Color =  new CDocumentColor( layoutShapeStyle.TextPr.unifill.fill.color.RGBA.R, layoutShapeStyle.TextPr.unifill.fill.color.RGBA.G,  layoutShapeStyle.TextPr.unifill.fill.color.RGBA.B);
                    }
                    if(layoutShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                    {

                        layoutShapeStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        layoutShapeStyle.TextPr.Color =  new CDocumentColor( layoutShapeStyle.TextPr.unifill.fill.color.RGBA.R, layoutShapeStyle.TextPr.unifill.fill.color.RGBA.G,  layoutShapeStyle.TextPr.unifill.fill.color.RGBA.B);
                    }
                    if(layoutShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                    {
                        layoutShapeStyle.TextPr.Color =  new CDocumentColor( 0, 0,  0);
                    }
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
                if(slideShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                {
                    slideShapeStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                    slideShapeStyle.TextPr.Color = {
                        r : slideShapeStyle.TextPr.unifill.fill.color.RGBA.R,
                        g : slideShapeStyle.TextPr.unifill.fill.color.RGBA.G,
                        b : slideShapeStyle.TextPr.unifill.fill.color.RGBA.B,
                        a : slideShapeStyle.TextPr.unifill.fill.color.RGBA.A
                    }
                }
                if(slideShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                {

                    slideShapeStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                    slideShapeStyle.TextPr.Color = {
                        r : slideShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.R,
                        g : slideShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.G,
                        b : slideShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.B,
                        a : slideShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.A
                    }
                }
                if(slideShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                {
                    slideShapeStyle.TextPr.Color = {
                        r : 0,
                        g : 0,
                        b : 0,
                        a : 0
                    }
                }
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

    setParent: function(parent)
    {
        History.Add(this, {Type:historyitem_SetShapeParent, Old: this.parent, New: parent});
        this.parent = parent;
    },


    paragraphAdd: function(paraItem, bRecalculate)
    {
        this.graphicObject.Paragraph_Add(paraItem, false);
        this.graphicObject.RecalculateCurPos();
        this.recalcInfo.recalculateSizes = true;
        this.recalcInfo.recalculateTransform = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },

    remove: function(Count, bOnlyText, bRemoveOnlySelection)
    {
        this.graphicObject.Remove(Count, bOnlyText, bRemoveOnlySelection);
        this.graphicObject.RecalculateCurPos();
        this.recalcInfo.recalculateSizes = true;
        this.recalcInfo.recalculateTransform = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },

    addNewParagraph: function()
    {
        this.graphicObject.Add_NewParagraph(false);
        this.graphicObject.RecalculateCurPos();
        this.recalcInfo.recalculateContent = true;
        this.recalcInfo.recalculateTransformText = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },

    setParagraphAlign: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ParagraphAlign(val);
            this.graphicObject.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransform = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },

    applyAllAlign: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphAlign(val);
            this.graphicObject.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },

    setParagraphSpacing: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ParagraphSpacing(val);
            this.graphicObject.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },

    applyAllSpacing: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphSpacing(val);
            this.graphicObject.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },

    setParagraphNumbering: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ParagraphNumbering(val);
            this.graphicObject.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },

    applyAllNumbering: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphNumbering(val);
            this.graphicObject.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },


    setParagraphIndent: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ParagraphIndent(val);
            this.txBody.bRecalculateNumbering = true;
            this.graphicObject.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },

    applyAllIndent: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphIndent(val);
            this.graphicObject.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },

    Paragraph_IncDecFontSize: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Paragraph_IncDecFontSize(val);
            this.graphicObject.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },

    Paragraph_IncDecFontSizeAll: function(val)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Paragraph_IncDecFontSize(val);
            this.graphicObject.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },

    Cursor_MoveLeft : function(AddToSelect, Word)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Cursor_MoveLeft(AddToSelect, Word);
            this.graphicObject.RecalculateCurPos();

        }
    },

    Cursor_MoveRight : function(AddToSelect, Word)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Cursor_MoveRight(AddToSelect, Word);
            this.graphicObject.RecalculateCurPos();

        }
    },

    Cursor_MoveUp : function(AddToSelect)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Cursor_MoveUp(AddToSelect);
            this.graphicObject.RecalculateCurPos();

        }
    },

    Cursor_MoveDown : function(AddToSelect)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Cursor_MoveDown(AddToSelect);
            this.graphicObject.RecalculateCurPos();

        }
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Cursor_MoveEndOfLine(AddToSelect);
            this.graphicObject.RecalculateCurPos();

        }
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Cursor_MoveStartOfLine(AddToSelect);
            this.graphicObject.RecalculateCurPos();

        }
    },

    Cursor_MoveAt : function( X, Y, AddToSelect )
    {
        if(isRealObject(this.graphicObject))
        {
            this.graphicObject.Cursor_MoveAt(X, Y, AddToSelect);
            this.graphicObject.RecalculateCurPos();

        }
    },
    
    Get_Styles: function(level, bTablesStyleId, bParagraph)
    {
        if(level == undefined)
        {
            level  = 0;
        }

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

        if(bParagraph && false)
        {
            var isPlaceholder = this.isPlaceholder();
            if(isPlaceholder)
            {
                var phId = this.nvGraphicFramePr.nvPr.ph.idx, phType = this.nvGraphicFramePr.nvPr.ph.type;
                var layoutShape = null, masterShape = null;
                if(layout!=null)
                {
                    layoutShape = layout.getMatchingShape(phType, phId);
                }
                if(master != null)
                {
                    masterShape = master.getMatchingShape(phType, phId);
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
                        if(defaultStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                        {
                            defaultStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                            defaultStyle.TextPr.Color = {
                                r : defaultStyle.TextPr.unifill.fill.color.RGBA.R,
                                g : defaultStyle.TextPr.unifill.fill.color.RGBA.G,
                                b : defaultStyle.TextPr.unifill.fill.color.RGBA.B,
                                a : defaultStyle.TextPr.unifill.fill.color.RGBA.A
                            }
                        }
                        if(defaultStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                        {

                            defaultStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                            defaultStyle.TextPr.Color = {
                                r : defaultStyle.TextPr.unifill.fill.colors[0].color.RGBA.R,
                                g : defaultStyle.TextPr.unifill.fill.colors[0].color.RGBA.G,
                                b : defaultStyle.TextPr.unifill.fill.colors[0].color.RGBA.B,
                                a : defaultStyle.TextPr.unifill.fill.colors[0].color.RGBA.A
                            }
                        }
                        if(defaultStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                        {
                            defaultStyle.TextPr.Color = {
                                r : 0,
                                g : 0,
                                b : 0,
                                a : 0
                            }
                        }
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
                        if(masterStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                        {
                            masterStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                            masterStyle.TextPr.Color = {
                                r : masterStyle.TextPr.unifill.fill.color.RGBA.R,
                                g : masterStyle.TextPr.unifill.fill.color.RGBA.G,
                                b : masterStyle.TextPr.unifill.fill.color.RGBA.B,
                                a : masterStyle.TextPr.unifill.fill.color.RGBA.A
                            }
                        }
                        if(masterStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                        {

                            masterStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                            masterStyle.TextPr.Color = {
                                r : masterStyle.TextPr.unifill.fill.colors[0].color.RGBA.R,
                                g : masterStyle.TextPr.unifill.fill.colors[0].color.RGBA.G,
                                b : masterStyle.TextPr.unifill.fill.colors[0].color.RGBA.B,
                                a : masterStyle.TextPr.unifill.fill.colors[0].color.RGBA.A
                            }
                        }
                        if(masterStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                        {
                            masterStyle.TextPr.Color = {
                                r : 0,
                                g : 0,
                                b : 0,
                                a : 0
                            }
                        }
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
                            if(masterShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                            {
                                masterShapeStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                                masterShapeStyle.TextPr.Color = {
                                    r : masterShapeStyle.TextPr.unifill.fill.color.RGBA.R,
                                    g : masterShapeStyle.TextPr.unifill.fill.color.RGBA.G,
                                    b : masterShapeStyle.TextPr.unifill.fill.color.RGBA.B,
                                    a : masterShapeStyle.TextPr.unifill.fill.color.RGBA.A
                                }
                            }
                            if(masterShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                            {

                                masterShapeStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                                masterShapeStyle.TextPr.Color = {
                                    r : masterShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.R,
                                    g : masterShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.G,
                                    b : masterShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.B,
                                    a : masterShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.A
                                }
                            }
                            if(masterShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                            {
                                masterShapeStyle.TextPr.Color = {
                                    r : 0,
                                    g : 0,
                                    b : 0,
                                    a : 0
                                }
                            }
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
                        if(layoutShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                        {
                            layoutShapeStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                            layoutShapeStyle.TextPr.Color = {
                                r : layoutShapeStyle.TextPr.unifill.fill.color.RGBA.R,
                                g : layoutShapeStyle.TextPr.unifill.fill.color.RGBA.G,
                                b : layoutShapeStyle.TextPr.unifill.fill.color.RGBA.B,
                                a : layoutShapeStyle.TextPr.unifill.fill.color.RGBA.A
                            }
                        }
                        if(layoutShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                        {

                            layoutShapeStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                            layoutShapeStyle.TextPr.Color = {
                                r : layoutShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.R,
                                g : layoutShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.G,
                                b : layoutShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.B,
                                a : layoutShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.A
                            }
                        }
                        if(layoutShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                        {
                            layoutShapeStyle.TextPr.Color = {
                                r : 0,
                                g : 0,
                                b : 0,
                                a : 0
                            }
                        }
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
                    if(slideShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_SOLID)
                    {
                        slideShapeStyle.TextPr.unifill.fill.color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        slideShapeStyle.TextPr.Color = {
                            r : slideShapeStyle.TextPr.unifill.fill.color.RGBA.R,
                            g : slideShapeStyle.TextPr.unifill.fill.color.RGBA.G,
                            b : slideShapeStyle.TextPr.unifill.fill.color.RGBA.B,
                            a : slideShapeStyle.TextPr.unifill.fill.color.RGBA.A
                        }
                    }
                    if(slideShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_GRAD)
                    {

                        slideShapeStyle.TextPr.unifill.fill.colors[0].color.Calculate(theme, this.parent, layout, master, {R:0, G:0, B:0, A:0});
                        slideShapeStyle.TextPr.Color = {
                            r : slideShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.R,
                            g : slideShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.G,
                            b : slideShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.B,
                            a : slideShapeStyle.TextPr.unifill.fill.colors[0].color.RGBA.A
                        }
                    }
                    if(slideShapeStyle.TextPr.unifill.fill.type == FILL_TYPE_NOFILL)
                    {
                        slideShapeStyle.TextPr.Color = {
                            r : 0,
                            g : 0,
                            b : 0,
                            a : 0
                        }
                    }
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


    } ,

    getParagraphParaPr: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object"
            && typeof this.graphicObject.Set_ApplyToAll === "function"
            && typeof this.graphicObject.Get_Paragraph_ParaPr === "function")
        {
            var _ret_para_pr;
            this.graphicObject.Set_ApplyToAll(true);
            _ret_para_pr =  this.graphicObject.Get_Paragraph_ParaPr();
            this.graphicObject.Set_ApplyToAll(false);
            return _ret_para_pr;
        }
    },

    getParagraphTextPr: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object"
            && typeof this.graphicObject.Set_ApplyToAll === "function"
            && typeof this.graphicObject.Get_Paragraph_TextPr === "function")
        {
            var _ret_para_pr;
            this.graphicObject.Set_ApplyToAll(true);
            _ret_para_pr =  this.graphicObject.Get_Paragraph_TextPr();
            this.graphicObject.Set_ApplyToAll(false);
            return _ret_para_pr;
        }
    },

    getTextPr: function()
    {
        return this.graphicObject.Get_Paragraph_TextPr();
    },

    getParaPr: function()
    {
        return this.graphicObject.Get_Paragraph_ParaPr();
    },

    hitToHandles: function()
    {
        return -1;
    },

    hitToAdjustment: function()
    {
        return {hit:false};
    },

    setGroup: function(group)
    {
        History.Add(this, {Type: historyitem_SetSpGroup, oldPr: this.group, newPr: group});
        this.group = group;
    },


    Refresh_RecalcData: function()
    {
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SetGraphicObject:
            {
                this.graphicObject = data.oldPr;
                break;
            }

            case historyitem_SetShapeRot:
            {
                this.spPr.xfrm.rot = data.oldRot;
                this.recalcInfo.recalculateTransform = true;
                this.recalcInfo.recalculateTransformText = true;
                break;
            }
            case historyitem_SetShapeOffset:
            {
                this.spPr.xfrm.offX = data.oldOffsetX;
                this.spPr.xfrm.offY = data.oldOffsetY;
                this.recalcInfo.recalculateTransform = true;
                this.recalcInfo.recalculateTransformText = true;
                break;
            }

            case historyitem_SetShapeExtents:
            {
                this.spPr.xfrm.extX = data.oldExtentX;
                this.spPr.xfrm.extY = data.oldExtentY;
                this.recalcInfo.recalculateTransform = true;
                this.recalcInfo.recalculateTransformText = true;
                this.recalcInfo.recalculateContent = true;
                this.recalcInfo.recalculateGeometry = true;
                break;
            }
            case historyitem_SetShapeFlips:
            {
                this.spPr.xfrm.flipH = data.oldFlipH;
                this.spPr.xfrm.flipV = data.oldFlipV;
                this.recalcInfo.recalculateTransform = true;
                this.recalcInfo.recalculateTransformText = true;
                this.recalcInfo.recalculateContent = true;
                break;
            }
            case historyitem_SetShapeSetFill:
            {
                if(isRealObject(data.oldFill))
                {
                    this.spPr.Fill = data.oldFill.createDuplicate();
                }
                else
                {
                    this.spPr.Fill = null;
                }
                this.recalcInfo.recalculateFill = true;
                this.recalcInfo.recalculateBrush = true;
                this.recalcInfo.recalculateTransparent = true;

                break;
            }
            case historyitem_SetShapeSetLine:
            {
                if(isRealObject(data.oldLine))
                {
                    this.spPr.ln = data.oldLine.createDuplicate();
                }
                else
                {
                    this.spPr.ln = null;
                }

                this.recalcInfo.recalculateLine = true;
                this.recalcInfo.recalculatePen = true;
                editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
                break;
            }
            case historyitem_SetShapeSetGeometry:
            {
                if(isRealObject(data.oldGeometry))
                {
                    this.spPr.geometry = data.oldGeometry.createDuplicate();
                    this.spPr.geometry.Init(5, 5);
                }
                else
                {
                    this.spPr.geometry = null;
                }
                this.recalcInfo.recalculateGeometry = true;
                break;
            }
            case historyitem_SetShapeBodyPr:
            {
                this.txBody.bodyPr = data.oldBodyPr.createDuplicate();
                this.txBody.recalcInfo.recalculateBodyPr = true;
                this.recalcInfo.recalculateContent = true;
                this.recalcInfo.recalculateTransformText = true;
                break;
            }
            case historyitem_SetSpGroup:
            {
                this.group = data.oldPr;
                break;
            }
            case historyitem_SetShapeParent:
            {
                this.parent = data.Old;
                break;
            }
        }
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },

    Redo: function(data)
    {

        switch(data.Type)
        {
            case historyitem_SetGraphicObject:
            {
                this.graphicObject = data.newPr;
                break;
            }
            case historyitem_SetShapeRot:
            {
                this.spPr.xfrm.rot = data.newRot;
                this.recalcInfo.recalculateTransform = true;
                this.recalcInfo.recalculateTransformText = true;
                break;
            }
            case historyitem_SetShapeOffset:
            {
                this.spPr.xfrm.offX = data.newOffsetX;
                this.spPr.xfrm.offY = data.newOffsetY;
                this.recalcInfo.recalculateTransform = true;
                this.recalcInfo.recalculateTransformText = true;
                break;
            }

            case historyitem_SetShapeExtents:
            {
                this.spPr.xfrm.extX = data.newExtentX;
                this.spPr.xfrm.extY = data.newExtentY;
                this.recalcInfo.recalculateTransform = true;
                this.recalcInfo.recalculateTransformText = true;
                this.recalcInfo.recalculateContent = true;
                this.recalcInfo.recalculateGeometry = true;
                break;
            }
            case historyitem_SetShapeFlips:
            {
                this.spPr.xfrm.flipH = data.newFlipH;
                this.spPr.xfrm.flipV = data.newFlipV;
                this.recalcInfo.recalculateTransform = true;
                this.recalcInfo.recalculateTransformText = true;
                this.recalcInfo.recalculateContent = true;
                break;
            }
            case historyitem_SetShapeSetFill:
            {
                if(isRealObject(data.newFill))
                {
                    this.spPr.Fill = data.newFill.createDuplicate();
                }
                this.recalcInfo.recalculateFill = true;
                this.recalcInfo.recalculateBrush = true;
                this.recalcInfo.recalculateTransparent = true;

                break;
            }
            case historyitem_SetShapeSetLine:
            {
                if(isRealObject(data.newLine))
                {
                    this.spPr.ln = data.newLine.createDuplicate();
                }
                else
                {
                    this.spPr.ln = null;
                }

                this.recalcInfo.recalculateLine = true;
                this.recalcInfo.recalculatePen = true;
                break;
            }
            case historyitem_SetShapeSetGeometry:
            {
                if(isRealObject(data.newGeometry))
                {
                    this.spPr.geometry = data.newGeometry.createDuplicate();
                    this.spPr.geometry.Init(5, 5);
                }
                else
                {
                    this.spPr.geometry = null;
                }
                this.recalcInfo.recalculateGeometry = true;
                break;
            }
            case historyitem_SetShapeBodyPr:
            {
                this.txBody.bodyPr = data.newBodyPr.createDuplicate();
                this.txBody.recalcInfo.recalculateBodyPr = true;
                this.recalcInfo.recalculateContent = true;
                this.recalcInfo.recalculateTransformText = true;
                break;
            }
            case historyitem_SetSpGroup:
            {
                this.group = data.newPr;
                break;
            }
            case historyitem_SetShapeParent:
            {
                this.parent = data.New;
                break;
            }
        }
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(historyitem_type_Shape);
        w.WriteLong(data.Type);
        var bool;
        switch(data.Type)
        {
            case historyitem_SetGraphicObject:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id());
                }
                break;
            }
            case historyitem_SetShapeRot:
            {
                w.WriteDouble(data.newRot);
                break;
            }
            case historyitem_SetShapeOffset:
            {
                w.WriteDouble(data.newOffsetX);
                w.WriteDouble(data.newOffsetY);
                break;
            }

            case historyitem_SetShapeExtents:
            {
                w.WriteDouble(data.newExtentX);
                w.WriteDouble(data.newExtentY);
                break;
            }
            case historyitem_SetShapeFlips:
            {
                w.WriteBool(data.newFlipH);
                w.WriteBool(data.newFlipV);
                break;
            }
            case historyitem_SetShapeSetFill:
            {
                w.WriteBool(isRealObject(data.newFill));
                if(isRealObject(data.newFill))
                {
                    data.newFill.Write_ToBinary2(w);
                }
                break;
            }

            case historyitem_SetShapeSetLine:
            {
                w.WriteBool(isRealObject(data.newLine));
                if(isRealObject(data.newLine))
                {
                    data.newLine.Write_ToBinary2(w);
                }
                break;
            }

            case historyitem_SetShapeSetGeometry:
            {
                w.WriteBool(isRealObject(data.newGeometry));
                if(isRealObject(data.newGeometry))
                {
                    data.newGeometry.Write_ToBinary2(w);
                }
                break;
            }
            case historyitem_SetShapeBodyPr:
            {
                data.newBodyPr.Write_ToBinary2(w);
                break;
            }
            case historyitem_SetSpGroup:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id());
                }
                break;
            }
            case historyitem_SetShapeParent:
            {
                w.WriteBool(isRealObject(data.New));
                if(isRealObject(data.New))
                {
                    w.WriteString2(data.New.Id);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        if(r.GetLong() === historyitem_type_Shape)
        {
            switch(r.GetLong())
            {
                case historyitem_SetGraphicObject:
                {
                    if(r.GetBool())
                    {
                        this.graphicObject = g_oTableId.Get_ById(r.GetString2());
                    }
                    else
                    {
                        this.graphicObject = null;
                    }
                    break;
                }
                case historyitem_SetShapeRot:
                {
                    this.spPr.xfrm.rot = r.GetDouble();
                    this.recalcInfo.recalculateTransform = true;
                    this.recalcInfo.recalculateTransformText = true;
                    break;
                }
                case historyitem_SetShapeOffset:
                {
                    this.spPr.xfrm.offX = r.GetDouble();
                    this.spPr.xfrm.offY = r.GetDouble();
                    this.recalcInfo.recalculateTransform = true;
                    this.recalcInfo.recalculateTransformText = true;
                    break;
                }

                case historyitem_SetShapeExtents:
                {
                    this.spPr.xfrm.extX = r.GetDouble();
                    this.spPr.xfrm.extY = r.GetDouble();
                    this.recalcInfo.recalculateTransform = true;
                    this.recalcInfo.recalculateTransformText = true;
                    this.recalcInfo.recalculateContent = true;
                    this.recalcInfo.recalculateGeometry = true;

                    break;
                }
                case historyitem_SetShapeFlips:
                {
                    this.spPr.xfrm.flipH = r.GetBool();
                    this.spPr.xfrm.flipV = r.GetBool();
                    this.recalcInfo.recalculateTransform = true;
                    this.recalcInfo.recalculateTransformText = true;
                    this.recalcInfo.recalculateContent = true;
                    break;
                }

                case historyitem_SetShapeSetFill:
                {
                    if(r.GetBool())
                    {
                        this.spPr.Fill = new CUniFill();
                        this.spPr.Fill.Read_FromBinary2(r);
                    }
                    this.recalcInfo.recalculateFill = true;
                    this.recalcInfo.recalculateBrush = true;
                    this.recalcInfo.recalculateTransparent = true;
                    break;
                }
                case historyitem_SetShapeSetLine:
                {
                    if(r.GetBool())
                    {
                        this.spPr.ln = new CLn();
                        this.spPr.ln.Read_FromBinary2(r);
                    }
                    this.recalcInfo.recalculateLine = true;
                    this.recalcInfo.recalculatePen = true;
                    break;
                }
                case historyitem_SetShapeSetGeometry:
                {
                    if(r.GetBool())
                    {
                        this.spPr.geometry = new Geometry();
                        this.spPr.geometry.Read_FromBinary2(r);
                        this.spPr.geometry.Init(5, 5);
                    }
                    else
                    {
                        this.spPr.geometry = null;
                    }
                    this.recalcInfo.recalculateGeometry = true;
                    break;
                }
                case historyitem_SetShapeBodyPr:
                {
                    this.txBody.bodyPr = new CBodyPr();
                    this.txBody.bodyPr.Read_FromBinary2(r);
                    this.txBody.recalcInfo.recalculateBodyPr = true;
                    this.recalcInfo.recalculateContent = true;
                    this.recalcInfo.recalculateTransformText = true;
                    break;
                }

                case historyitem_SetSpGroup:
                {
                    if(r.GetBool())
                    {
                        this.group = g_oTableId.Get_ById(r.GetString2());
                    }
                    else
                    {
                        this.group = null;
                    }
                    break;
                }
                case historyitem_SetShapeParent:
                {
                    if(r.GetBool())
                    {
                        this.parent = g_oTableId.Get_ById(r.GetString2());
                    }
                    break;
                }

            }
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(historyitem_type_Chart);
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    }
};