"use strict";

function CGroupShape(parent)
{

    this.nvGrpSpPr = null;
    this.spPr      = new CSpPr();
    this.spTree    = [];
    this.parent   = null;
    this.group     = null;


    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.rot = null;
    this.flipH = null;
    this.flipV = null;
    this.transform = new CMatrix();
    this.localTransform = new CMatrix();
    this.invertTransform = null;
    this.brush  = null;
    this.pen = null;
    this.scaleCoefficients = {cx: 1, cy: 1};

    this.selected = false;
    this.arrGraphicObjects = [];
    this.selectedObjects = [];

    this.selection =
    {
        groupSelection: null,
        chartSelection: null,
        textSelection: null
    };


    this.setRecalculateInfo();
    this.Lock = new CLock();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CGroupShape.prototype =
{

    getObjectType: function()
    {
        return historyitem_type_GroupShape;
    },

    Get_Id: function()
    {
        return this.Id;
    },

    documentUpdateSelectionState: function()
    {
        if(this.selection.textSelection)
        {
            this.selection.textSelection.updateSelectionState();
        }
        else if(this.selection.groupSelection)
        {
            this.selection.groupSelection.documentUpdateSelectionState();
        }
        else if(this.selection.chartSelection)
        {
            this.selection.chartSelection.documentUpdateSelectionState();
        }
        else
        {
            this.getDrawingDocument().SelectClear();
            this.getDrawingDocument().TargetEnd();
        }
    },


    drawSelectionPage: function(pageIndex)
    {
        if(this.selection.textSelection)
        {
            this.getDrawingDocument().UpdateTargetTransform(this.selection.textSelection.transformText);
            this.selection.textSelection.getDocContent().Selection_Draw_Page(pageIndex);
        }
        else if(this.selection.chartSelection)
        {}
    },
    Write_ToBinary2: function(w)
    {
        w.WriteLong(historyitem_type_GroupShape);
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setNvGrpSpPr: function(pr)
    {
        History.Add(this, {Type:historyitem_GroupShapeSetNvGrpSpPr, oldPr: this.nvGrpSpPr, newPr: pr});
        this.nvGrpSpPr = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(this, {Type:historyitem_GroupShapeSetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },


    addToSpTree: function(pos, item)
    {
        History.Add(this, {Type: historyitem_GroupShapeAddToSpTree, pos: pos, item: item});
        this.spTree.splice(pos, 0, item);
    },

    setParent: function(pr)
    {
        History.Add(this, {Type: historyitem_GroupShapeSetParent, oldPr: this.parent, newPr: pr});
        this.parent = pr;
    },

    setGroup: function(group)
    {
        History.Add(this, {Type: historyitem_GroupShapeSetGroup, oldPr: this.group, newPr: group});
        this.group = group;
    },

    removeFromSpTree: function(id)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].Get_Id() === id)
            {
                History.Add(this,{Type:historyitem_GroupShapeRemoveFromSpTree, pos: i, item:this.spTree[i]});
                this.spTree.splice(i, 1);
            }
        }
    },

    handleUpdateSpTree: function()
    {
        if(!this.group)
        {
            this.recalcInfo.recalculateArrGraphicObjects = true;
            this.addToRecalculate();
        }
        else
        {
            this.group.handleUpdateSpTree();
        }
    },


    copy: function(sp)
    {
        if(!(sp instanceof CGroupShape))
            sp = new CGroupShape();
        sp.setSpPr(this.spPr.createDuplicate());
        if(this.nvGrpSpPr)
        {
            sp.setNvSpPr(this.nvGrpSpPr.createDuplicate());
        }
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].copy)
            {
                sp.addToSpTree(sp.spTree.length, this.spTree[i].copy())
                sp.spTree[sp.spTree.length - 1].setGroup(sp);
            }
        }
        return sp;
    },

    getAllImages: function(images)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].getAllImages === "function")
            {
                this.spTree[i].getAllImages(images);
            }
        }
    },

    getSearchResults : function(str, num)
    {
        var commonSearchResults = [];
        for(var i = 0; i< this.arrGraphicObjects.length; ++i)
        {
            var searchResults;
            if((searchResults = this.arrGraphicObjects[i].getSearchResults(str, i))!=null)
            {
                for(var j = 0; j < searchResults.length; ++j)
                {
                    searchResults[j].shapeIndex = i;
                }
                commonSearchResults = commonSearchResults.concat(searchResults)
            }
        }
        return commonSearchResults.length > 0 ? commonSearchResults : null;
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

    getCurDocumentContent: function()
    {
        if(this.parent.graphicObjects.State instanceof TextAddInGroup && this.parent.graphicObjects.State.group === this)
        {
            for(var i = 0; i < this.arrGraphicObjects.length; ++i)
            {
                if(this.arrGraphicObjects[i] === this.parent.graphicObjects.State.textObject)
                {
                    return this.arrGraphicObjects[i].getCurDocumentContent();
                }
            }
        }
        return null;
    },

    getBoundsInGroup: function()
    {
        return getBoundsInGroup(this);
    },

    getBase64Img: function()
    {
        return ShapeToImageConverter(this, this.pageIndex).ImageUrl;
    },

    isSimpleObject: function()
    {
        return false;
    },

    setDiagram: function(chartPr)
    {
        var bRecalc = false;
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].setDiagram)
            {
                this.spTree[i].setDiagram(chartPr);
            }
        }
    },

    recalcAll: function()
    {
        this.recalcInfo =
        {
            recalculateBrush: true,
            recalculatePen: true,
            recalculateTransform: true,
            recalculateSpTree: true,
            recalculateCursorTypes: true,
            recalculateScaleCoefficients: true,
            recalculateArrGraphicObjects: true
        };
        for(var i = 0; i < this.spTree.length; ++i)
        {
            this.spTree[i].recalcAll();
        }
    },

    recalcAllColors: function()
    {
        this.recalcInfo =
        {
            recalculateBrush: true,
            recalculatePen: true,
            recalculateTransform: true,
            recalculateSpTree: true,
            recalculateCursorTypes: true,
            recalculateScaleCoefficients: true
        };
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].recalcAllColors)
                this.spTree[i].recalcAllColors();
        }
    },

    getAllFonts: function(fonts)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof  this.spTree[i].getAllFonts === "function")
                this.spTree[i].getAllFonts(fonts);
        }
    },

    sendMouseData: function()
    {
        if ( true === this.Lock.Is_Locked() )
        {

            var MMData = new CMouseMoveData();
            var Coords = editor.WordControl.m_oLogicDocument.DrawingDocument.ConvertCoordsToCursorWR(this.x, this.y, this.parent.num, null);
            MMData.X_abs            = Coords.X - 5;
            MMData.Y_abs            = Coords.Y;
            MMData.Type             = c_oAscMouseMoveDataTypes.LockedObject;
            MMData.UserId           = this.Lock.Get_UserId();
            MMData.HaveChanges      = this.Lock.Have_Changes();
            MMData.LockedObjectType = 0;
            editor.sync_MouseMoveCallback( MMData );
        }
    },

    isShape: function()
    {
        return false;
    },

    isImage: function()
    {
        return false;
    },


    isChart: function()
    {
        return false;
    },


    isGroup: function()
    {
        return true;
    },

    isPlaceholder : function()
    {
        return this.nvGrpSpPr != null && this.nvGrpSpPr.nvPr != undefined && this.nvGrpSpPr.nvPr.ph != undefined;
    },

    draw: function(graphics)
    {
        for(var i = 0; i < this.spTree.length; ++i)
            this.spTree[i].draw(graphics);


        if(locktype_None != this.Lock.Get_Type())
        {
            graphics.transform3(this.transform);

            graphics.SetIntegerGrid(false);

            if(locktype_None != this.Lock.Get_Type())
                graphics.DrawLockObjectRect(this.Lock.Get_Type() , 0, 0, this.extX, this.extY);

            graphics.reset();
            graphics.SetIntegerGrid(true);
        }
    },

    getLocalTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.localTransform;
    },

    getArrGraphicObjects: function()
    {
        if(this.recalcInfo.recalculateArrGraphicObjects)
            this.recalculateArrGraphicObjects();
        return this.arrGraphicObjects;
    },

    getInvertTransform: function()
    {
        return this.invertTransform;
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


    getResultScaleCoefficients: function()
    {
        if(this.recalcInfo.recalculateScaleCoefficients)
        {
            var cx, cy;
            if(this.spPr.xfrm.isNotNullForGroup())
            {
                if(this.spPr.xfrm.chExtX > 0)
                    cx = this.spPr.xfrm.extX/this.spPr.xfrm.chExtX;
                else
                    cx = 1;

                if(this.spPr.xfrm.chExtY > 0)
                    cy = this.spPr.xfrm.extY/this.spPr.xfrm.chExtY;
                else
                    cy = 1;
            }
            else
            {
                cx = 1;
                cy = 1;
            }
            if(isRealObject(this.group))
            {
                var group_scale_coefficients = this.group.getResultScaleCoefficients();
                cx *= group_scale_coefficients.cx;
                cy *= group_scale_coefficients.cy;
            }
            this.scaleCoefficients.cx = cx;
            this.scaleCoefficients.cy = cy;
            this.recalcInfo.recalculateScaleCoefficients = false;
        }
        return this.scaleCoefficients;
    },

    getType: function()
    {
        return DRAWING_OBJECT_TYPE_GROUP;
    },

    getCompiledTransparent: function()
    {
        return null;
    },

    selectObject: function(object, pageIndex)
    {
        object.select(this, pageIndex);
    },


    recalculate: function()
    {
        var recalcInfo = this.recalcInfo;

        if(recalcInfo.recalculateBrush)
        {
            this.recalculateBrush();
            recalcInfo.recalculateBrush = false;
        }
        if(recalcInfo.recalculatePen)
        {
            this.recalculatePen();
            recalcInfo.recalculatePen = false;
        }
        if(recalcInfo.recalculateScaleCoefficients)
        {
            this.getResultScaleCoefficients();
            recalcInfo.recalculateScaleCoefficients = false;
        }

        if(recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            recalcInfo.recalculateTransform = false;
        }
        if(recalcInfo.recalculateArrGraphicObjects)
            this.recalculateArrGraphicObjects();
        for(var i = 0;  i < this.spTree.length; ++i)
            this.spTree[i].recalculate();
        if(recalcInfo.recalculateBounds)
        {
            this.recalculateBounds();
            recalcInfo.recalculateBounds = false;
        }
    },

    recalcTransform:function()
    {
        this.recalcInfo.recalculateTransform = true;
        this.recalcInfo.recalculateScaleCoefficients = true;
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].recalcTransform)
                this.spTree[i].recalcTransform();
            else
            {
                this.spTree[i].recalcInfo.recalculateTransform = true;
                this.spTree[i].recalcInfo.recalculateTransformText = true;
            }
        }
    },


    canRotate: function()
    {
        //TODO: сделать еще проверку SpLock
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(!this.spTree[i].canRotate || !this.spTree[i].canRotate())
                return false;
        }
        return true;
    },

    canResize: function()
    {
        //TODO: сделать еще проверку SpLock
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(!this.spTree[i].canResize || !this.spTree[i].canResize())
                return false
        }
        return true;
    },

    canMove: function()
    {
        //TODO: сделать еще проверку SpLock
        return true;//TODO
    },

    canGroup: function()
    {
        //TODO: сделать еще проверку SpLock
        return true;//TODO
    },


    canChangeAdjustments: function()
    {
        return false;
    },
    drawAdjustments: function()
    {},

    hitToAdjustment: function()
    {
        return {hit: false};
    },

    recalculateBrush: function()
    {},

    recalculatePen: function()
    {},

    recalculateArrGraphicObjects: function()
    {
        this.arrGraphicObjects.length = 0;
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(!this.spTree[i].isGroup())
                this.arrGraphicObjects.push(this.spTree[i]);
            else
            {
                var arr_graphic_objects = this.spTree[i].getArrGraphicObjects();
                for(var j = 0; j < arr_graphic_objects.length; ++j)
                    this.arrGraphicObjects.push(arr_graphic_objects[j]);
            }
        }
    },


    paragraphAdd: function(paraItem, bRecalculate)
    {
        if(this.selection.textSelection)
        {
            this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
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
                for(i = 0; i < this.selectedObjects.length; ++i)
                {
                    this.selectedObjects[i].applyTextPr(paraItem, bRecalculate);
                }
            }
            else if(this.selectedObjects.length === 1
                && this.selectedObjects[0].getObjectType() === historyitem_type_Shape
                &&  !CheckLinePreset(this.selectedObjects[0].getPresetGeom()))
            {
                this.selection.textSelection = this.selectedObjects[0];
                this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
            }
            else if(this.selectedObjects.length > 0)
            {
                this.parent.GoTo_Text();
                this.resetSelection();
            }
        }
    },



    applyAllAlign: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].applyAllAlign === "function")
            {
                this.spTree[i].applyAllAlign(val);
            }
        }
    },

    applyAllSpacing: function(val)
    {

        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].applyAllSpacing === "function")
            {
                this.spTree[i].applyAllSpacing(val);
            }
        }
    },


    applyAllNumbering: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].applyAllNumbering === "function")
            {
                this.spTree[i].applyAllNumbering(val);
            }
        }
    },



    applyAllIndent: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].applyAllIndent === "function")
            {
                this.spTree[i].applyAllIndent(val);
            }
        }
    },


    Paragraph_IncDecFontSizeAll: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].Paragraph_IncDecFontSizeAll === "function")
            {
                this.spTree[i].Paragraph_IncDecFontSizeAll(val);
            }
        }
    },

    haveShapes: function()
    {
        for(var i = 0; i < this.arrGraphicObjects.length; ++i)
        {
            if(this.arrGraphicObjects[i].isShape())
                return true;
        }
        return false;
    },


    applyAllTextProps: function(textPr)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].applyAllTextProps === "function")
                this.spTree[i].applyAllTextProps(textPr);
        }
    },


    changeSize: function(kw, kh)
    {

        if(this.spPr.xfrm.isNotNullForGroup())
        {
            var xfrm = this.spPr.xfrm;
            this.setOffset(xfrm.offX*kw, xfrm.offY*kh);
            this.setExtents(xfrm.extX*kw, xfrm.extY*kh);
            this.setChildOffset(xfrm.chOffX*kw, xfrm.chOffY*kh);
            this.setChildExtents(xfrm.chExtX*kw, xfrm.chExtY*kh);
        }
        for(var i = 0; i < this.spTree.length; ++i)
        {
            this.spTree[i].changeSize(kw, kh);
        }
    },

    recalculateTransform: function()
    {
        var xfrm;
        if(this.spPr.xfrm.isNotNullForGroup())
            xfrm = this.spPr.xfrm;
        else
        {
            xfrm = new CXfrm();
            xfrm.offX = 0;
            xfrm.offY = 0;
            xfrm.extX = 5;
            xfrm.extY = 5;
            xfrm.chOffX = 0;
            xfrm.chOffY = 0;
            xfrm.chExtX = 5;
            xfrm.chExtY = 5;
        }

        if(!isRealObject(this.group))
        {
            this.x = xfrm.offX;
            this.y = xfrm.offY;
            this.extX = xfrm.extX;
            this.extY = xfrm.extY;
            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = this.flipH === true;
            this.flipV = this.flipV === true;
        }
        else
        {
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
        if(this.drawingBase)
        {
            this.drawingBase.setGraphicObjectCoords();
        }
    },

    getTransformMatrix: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
        }
        return this.transform;
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
        for(var i = 0; i < this.arrGraphicObjects.length; ++i)
        {
            if(this.arrGraphicObjects[i].getSnapArrays)
            {
                this.arrGraphicObjects[i].getSnapArrays(snapX, snapY);
            }
        }
    },

    getPlaceholderType: function()
    {
        return this.isPlaceholder() ? this.nvGrpSpPr.nvPr.ph.type : null;
    },

    getPlaceholderIndex: function()
    {
        return this.isPlaceholder() ? this.nvGrpSpPr.nvPr.ph.idx : null;
    },

    getPhType: function()
    {
        return this.isPlaceholder() ? this.nvGrpSpPr.nvPr.ph.type : null;
    },

    getPhIndex: function()
    {
        return this.isPlaceholder() ? this.nvGrpSpPr.nvPr.ph.idx : null;
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
        if(this.spPr.xfrm && this.spPr.xfrm.isNotNullForGroup())
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
                    if(placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNullForGroup())
                        return true;
                    placeholder = this.parent.Layout.Master.getMatchingShape(ph_type, ph_index, b_is_single_body);
                    return placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNullForGroup();
                }

                case LAYOUT_KIND:
                {
                    var placeholder = this.parent.Master.getMatchingShape(ph_type, ph_index, b_is_single_body);
                    return placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNullForGroup();
                }
            }
        }
        return false;
    },

    getHierarchy: function()
    {
        this.compiledHierarchy = [];
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
        return this.compiledHierarchy;
    },

    isEmptyPlaceholder: function ()
    {
        return false;
    },

    getCompiledFill: function()
    {
        this.compiledFill = null;
        if(isRealObject(this.spPr) && isRealObject(this.spPr.Fill) && isRealObject(this.spPr.Fill.fill))
        {
            this.compiledFill = this.spPr.Fill.createDuplicate();
        }
        else if(isRealObject(this.group))
        {
            var group_compiled_fill = this.group.getCompiledFill();
            if(isRealObject(group_compiled_fill) && isRealObject(group_compiled_fill.fill))
            {
                this.compiledFill = group_compiled_fill.createDuplicate();
            }
            else
            {
                var hierarchy = this.getHierarchy();
                for(var i = 0; i < hierarchy.length; ++i)
                {
                    if(isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealObject(hierarchy[i].spPr.Fill.fill))
                    {
                        this.compiledFill = hierarchy[i].spPr.Fill.createDuplicate();
                        break;
                    }
                }
            }
        }
        else
        {
            var hierarchy = this.getHierarchy();
            for(var i = 0; i < hierarchy.length; ++i)
            {
                if(isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealObject(hierarchy[i].spPr.Fill.fill))
                {
                    this.compiledFill = hierarchy[i].spPr.Fill.createDuplicate();
                    break;
                }
            }
        }
        return this.compiledFill;
    },


    getCompiledLine: function()
    {
        return null;
    },

    getArraysByTypes: function()
    {
        var selected_objects = this.arrGraphicObjects;
        var tables = [], charts = [], shapes = [], images = [];
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
            else if(typeof  selected_object.isImage())
            {
                images.push(selected_object);
            }
        }
        return {tables: tables, charts: charts, shapes: shapes, images: images};
    },

    calculateCompiledVerticalAlign: function()
    {
        var _shapes = this.spTree;
        var _shape_index;
        var _result_align = null;
        var _cur_align;
        for(_shape_index = 0; _shape_index < _shapes.length; ++ _shape_index)
        {
            var _shape = _shapes[_shape_index];
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
            if(_shape instanceof CGroupShape)
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
        return _result_align;
    },


    setVerticalAlign : function(align)
    {
        for(var _shape_index = 0; _shape_index < this.arrGraphicObjects.length; ++_shape_index)
        {
            if(this.arrGraphicObjects[_shape_index].setVerticalAlign)
            {
                this.arrGraphicObjects[_shape_index].setVerticalAlign(align);
            }
        }
    },

    getResizeCoefficients: function(numHandle, x, y)
    {
        var cx, cy;
        cx= this.extX > 0 ? this.extX : 0.01;
        cy= this.extY > 0 ? this.extY : 0.01;

        var invert_transform = this.getInvertTransform();
        var t_x = invert_transform.TransformPointX(x, y);
        var t_y = invert_transform.TransformPointY(x, y);

        switch(numHandle)
        {
            case 0:
                return {kd1: (cx-t_x)/cx, kd2: (cy-t_y)/cy};
            case 1:
                return {kd1: (cy-t_y)/cy, kd2: 0};
            case 2:
                return {kd1: (cy-t_y)/cy, kd2: t_x/cx};
            case 3:
                return {kd1: t_x/cx, kd2: 0};
            case 4:
                return {kd1: t_x/cx, kd2: t_y/cy};
            case 5:
                return {kd1: t_y/cy, kd2: 0};
            case 6:
                return {kd1: t_y/cy, kd2:(cx-t_x)/cx};
            case 7:
                return {kd1:(cx-t_x)/cx, kd2: 0};
        }
        return {kd1: 1, kd2: 1};
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

        this.recalcTransform();
        this.recalcInfo.recalculateTransformText = true;
        xfrm.rot = rot;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;

    },

    setOffset: function(offX, offY)
    {
        History.Add(this, {Type: historyitem_SetShapeOffset, oldOffsetX: this.spPr.xfrm.offX, newOffsetX: offX, oldOffsetY: this.spPr.xfrm.offY, newOffsetY: offY});
        this.spPr.xfrm.offX = offX;
        this.spPr.xfrm.offY = offY;
        this.recalcTransform();
        this.recalcInfo.recalculateTransformText = true;
        this.recalcInfo.recalculateScaleCoefficients = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },


    setExtents: function(extX, extY)
    {
        History.Add(this, {Type: historyitem_SetShapeExtents, oldExtentX: this.spPr.xfrm.extX, newExtentX: extX, oldExtentY: this.spPr.xfrm.extY, newExtentY: extY});
        this.spPr.xfrm.extX = extX;
        this.spPr.xfrm.extY = extY;
        this.recalcTransform();
        this.recalcInfo.recalculateTransformText = true;
        this.recalcInfo.recalculateGeometry = true;
        this.recalcInfo.recalculateScaleCoefficients = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },

    setChildOffset: function(offX, offY)
    {
        History.Add(this, {Type: historyitem_SetShapeChildOffset, oldOffsetX: this.spPr.xfrm.chOffX, newOffsetX: offX, oldOffsetY: this.spPr.xfrm.chOffY, newOffsetY: offY});
        this.spPr.xfrm.chOffX = offX;
        this.spPr.xfrm.chOffY = offY;
        this.recalcTransform();
        this.recalcInfo.recalculateTransformText = true;
        this.recalcInfo.recalculateScaleCoefficients = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },


    setChildExtents: function(extX, extY)
    {
        History.Add(this, {Type: historyitem_SetShapeChildExtents, oldExtentX: this.spPr.xfrm.chExtX, newExtentX: extX, oldExtentY: this.spPr.xfrm.chExtY, newExtentY: extY});
        this.spPr.xfrm.chExtX = extX;
        this.spPr.xfrm.chExtY = extY;
        this.recalcTransform();
        this.recalcInfo.recalculateTransformText = true;
        this.recalcInfo.recalculateGeometry = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },


    setFlips: function(flipH, flipV)
    {
        History.Add(this, {Type: historyitem_SetShapeFlips, oldFlipH: this.spPr.xfrm.flipH, newFlipH: flipH, oldFlipV: this.spPr.xfrm.flipV, newFlipV: flipV});
        this.spPr.xfrm.flipH = flipH;
        this.spPr.xfrm.flipV = flipV;
        this.recalcTransform();
        this.recalcInfo.recalculateTransformText = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },


    changePresetGeom: function(preset)
    {
        for(var _shape_index = 0; _shape_index < this.arrGraphicObjects.length; ++_shape_index)
        {
            if(this.arrGraphicObjects[_shape_index].changePresetGeom)
            {
                this.arrGraphicObjects[_shape_index].changePresetGeom(preset);
            }
        }
    },

    changeFill: function(fill)
    {
        for(var _shape_index = 0; _shape_index < this.arrGraphicObjects.length; ++_shape_index)
        {
            if(this.arrGraphicObjects[_shape_index].changeFill)
            {
                this.arrGraphicObjects[_shape_index].changeFill(fill);
            }
        }
    },


    changeLine: function(line)
    {
        for(var _shape_index = 0; _shape_index < this.arrGraphicObjects.length; ++_shape_index)
        {
            if(this.arrGraphicObjects[_shape_index].changeLine)
            {
                this.arrGraphicObjects[_shape_index].changeLine(line);
            }
        }
    },

    getMainGroup: function()
    {
        if(!isRealObject(this.group))
            return this;
        return this.group.getMainGroup();
    },

    canUnGroup: function()
    {
        return true;
    },

    getUnGroupedSpTree: function()
    {
        this.normalize();
        this.recalculateTransform();
        var sp_tree = this.spTree;
        var ret = [];
        for(var i = 0; i < sp_tree.length; ++i)
        {
            var sp = sp_tree[i];
            var full_flip_h = sp.getFullFlipH();
            var full_flip_v = sp.getFullFlipV();
            var full_rotate = sp.getFullRotate();
            var hc = sp.spPr.xfrm.extX*0.5;
            var vc = sp.spPr.xfrm.extY*0.5;
            var xc = sp.transform.TransformPointX(hc, vc);
            var yc = sp.transform.TransformPointY(hc, vc);

            sp.setRotate(normalizeRotate(sp.getFullRotate()));
            sp.setGroup(null);
            sp.setOffset(xc - hc, yc - vc);
            sp.setFlips(full_flip_h, full_flip_v);
            ret.push(sp);
        }
        return ret;
    },

    normalize: function()
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            this.spTree[i].normalize();
        }
        var new_off_x, new_off_y, new_ext_x, new_ext_y;
        var xfrm = this.spPr.xfrm;
        if(!isRealObject(this.group))
        {
            new_off_x = xfrm.offX;
            new_off_y = xfrm.offY;
            new_ext_x = xfrm.extX;
            new_ext_y = xfrm.extY;
        }
        else
        {
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            new_off_x = scale_scale_coefficients.cx*(xfrm.offX - this.group.spPr.xfrm.chOffX);
            new_off_y = scale_scale_coefficients.cy*(xfrm.offY - this.group.spPr.xfrm.chOffY);
            new_ext_x = scale_scale_coefficients.cx*xfrm.extX;
            new_ext_y = scale_scale_coefficients.cy*xfrm.extY;
        }
        var xfrm = this.spPr.xfrm;
        xfrm.setOffX(new_off_x);
        xfrm.setOffY(new_off_y);
        xfrm.setExtX(new_ext_x);
        xfrm.setExtY(new_ext_y);
        xfrm.setChExtX(new_ext_x);
        xfrm.setChExtY(new_ext_y);
        xfrm.setChOffX(0);
        xfrm.setChOffY(0);
    },

    updateCoordinatesAfterInternalResize: function()
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].isGroup())
                this.spTree[i].updateCoordinatesAfterInternalResize();
        }

        var sp_tree = this.spTree;

        var min_x, max_x, min_y, max_y;
        var sp = sp_tree[0];
        var xfrm  = sp.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var xc, yc;
        if(rot < Math.PI*0.25 || rot>Math.PI*1.75 || (rot>Math.PI*0.75 && rot<Math.PI*1.25))
        {
            min_x = xfrm.offX;
            min_y = xfrm.offY;
            max_x = xfrm.offX + xfrm.extX;
            max_y = xfrm.offY + xfrm.extY;
        }
        else
        {
            xc = xfrm.offX + xfrm.extX*0.5;
            yc = xfrm.offY + xfrm.extY*0.5;
            min_x = xc - xfrm.extY*0.5;
            min_y = yc - xfrm.extX*0.5;
            max_x = xc + xfrm.extY*0.5;
            max_y = yc + xfrm.extX*0.5;
        }
        var cur_max_x, cur_min_x, cur_max_y, cur_min_y;
        for(i = 1; i < sp_tree.length; ++i)
        {
            sp = sp_tree[i];
            xfrm  = sp.spPr.xfrm;
            rot = xfrm.rot == null ? 0 : xfrm.rot;

            if(rot < Math.PI*0.25 || rot>Math.PI*1.75 || (rot>Math.PI*0.75 && rot<Math.PI*1.25))
            {
                cur_min_x = xfrm.offX;
                cur_min_y = xfrm.offY;
                cur_max_x = xfrm.offX + xfrm.extX;
                cur_max_y = xfrm.offY + xfrm.extY;
            }
            else
            {
                xc = xfrm.offX + xfrm.extX*0.5;
                yc = xfrm.offY + xfrm.extY*0.5;
                cur_min_x = xc - xfrm.extY*0.5;
                cur_min_y = yc - xfrm.extX*0.5;
                cur_max_x = xc + xfrm.extY*0.5;
                cur_max_y = yc + xfrm.extX*0.5;
            }
            if(cur_max_x > max_x)
                max_x = cur_max_x;
            if(cur_min_x < min_x)
                min_x = cur_min_x;

            if(cur_max_y > max_y)
                max_y = cur_max_y;
            if(cur_min_y < min_y)
                min_y = cur_min_y;
        }

        var temp;
        var x_min_clear = min_x;
        var y_min_clear = min_y;
        if(this.spPr.xfrm.flipH === true)
        {
            temp = max_x;
            max_x = this.spPr.xfrm.extX - min_x;
            min_x = this.spPr.xfrm.extX - temp;
        }

        if(this.spPr.xfrm.flipV === true)
        {
            temp = max_y;
            max_y = this.spPr.xfrm.extY - min_y;
            min_y = this.spPr.xfrm.extY - temp;
        }

        var old_x0, old_y0;
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var hc = xfrm.extX*0.5;
        var vc = xfrm.extY*0.5;
        old_x0 = this.spPr.xfrm.offX + hc - (hc*Math.cos(rot) - vc*Math.sin(rot));
        old_y0 = this.spPr.xfrm.offY  + vc - (hc*Math.sin(rot) + vc*Math.cos(rot));
        var t_dx = min_x*Math.cos(rot) - min_y*Math.sin(rot);
        var t_dy = min_x*Math.sin(rot) + min_y*Math.cos(rot);
        var new_x0, new_y0;
        new_x0 = old_x0 + t_dx;
        new_y0 = old_y0 + t_dy;
        var new_hc = Math.abs(max_x - min_x)*0.5;
        var new_vc = Math.abs(max_y - min_y)*0.5;
        var new_xc = new_x0 + (new_hc*Math.cos(rot) - new_vc*Math.sin(rot));
        var new_yc = new_y0 + (new_hc*Math.sin(rot) + new_vc*Math.cos(rot));

        var pos_x, pos_y;
        pos_x = new_xc - new_hc;
        pos_y = new_yc - new_vc;

        var xfrm = this.spPr.xfrm;
        xfrm.setOffX(pos_x);
        xfrm.setOffY(pos_y);
        xfrm.setExtX(Math.abs(max_x - min_x));
        xfrm.setExtY(Math.abs(max_y - min_y));
        xfrm.setChExtX(Math.abs(max_x - min_x));
        xfrm.setChExtY(Math.abs(max_y - min_y));
        for(i = 0; i < sp_tree.length; ++i)
        {
            sp_tree[i].spPr.xfrm.setOffX(sp_tree[i].spPr.xfrm.offX - x_min_clear);
            sp_tree[i].spPr.xfrm.setOffY(sp_tree[i].spPr.xfrm.offY - y_min_clear);
        }
    },


    select: CShape.prototype.select,

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
        return this;
    },

    getParentObjects: function()
    {
        var parents = {slide: null, layout: null, master: null, theme: null};
        return parents;
    },


    getCardDirectionByNum: function(num)
    {
        var num_north = this.getNumByCardDirection(CARD_DIRECTION_N);
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;
        if(same_flip)
            return ((num - num_north) + CARD_DIRECTION_N + 8)%8;

        return (CARD_DIRECTION_N - (num - num_north)+ 8)%8;
    },


    getNumByCardDirection: function(cardDirection)
    {
        var hc = this.extX*0.5;
        var vc = this.extY*0.5;
        var transform = this.getTransformMatrix();
        var y1, y3, y5, y7;
        y1 = transform.TransformPointY(hc, 0);
        y3 = transform.TransformPointY(this.extX, vc);
        y5 = transform.TransformPointY(hc, this.extY);
        y7 = transform.TransformPointY(0, vc);

        var north_number;
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        switch(Math.min(y1, y3, y5, y7))
        {
            case y1:
            {
                north_number = !full_flip_v ? 1 : 5;
                break;
            }
            case y3:
            {
                north_number = !full_flip_h ? 3 : 7;
                break;
            }
            case y5:
            {
                north_number = !full_flip_v ? 5 : 1;
                break;
            }
            default:
            {
                north_number = !full_flip_h ? 7 : 3;
                break;
            }
        }
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;

        if(same_flip)
            return (north_number + cardDirection)%8;
        return (north_number - cardDirection + 8)%8;
    },

    getAspect: function(num)
    {
        var _tmp_x = this.extX != 0 ? this.extX : 0.1;
        var _tmp_y = this.extY != 0 ? this.extY : 0.1;
        return num === 0 || num === 4 ? _tmp_x/_tmp_y : _tmp_y/_tmp_x;
    },


    getFullFlipH: function()
    {
        if(!isRealObject(this.group))
            return this.flipH;
        else
            return this.group.getFullFlipH() ? !this.flipH : this.flipH;
    },

    getFullFlipV: function()
    {
        if(!isRealObject(this.group))
            return this.flipV;
        else
            return this.group.getFullFlipV() ? !this.flipV : this.flipV;
    },

    getFullRotate: function()
    {
        return !isRealObject(this.group) ? this.rot : this.rot + this.group.getFullRotate();
    },




    createRotateTrack: function()
    {
        return new RotateTrackGroup(this);
    },

    createMoveTrack: function()
    {
        return new MoveGroupTrack(this);
    },
    createResizeTrack: function(cardDirection)
    {
        return new ResizeTrackGroup(this, cardDirection);
    },

    resetSelection: function(graphicObjects)
    {
        this.selection.textSelection = null;
        this.selection.chartSelection = null;
        for(var i = this.selectedObjects.length - 1; i > -1; --i)
        {
            this.selectedObjects[i].deselect(graphicObjects);
        }
    },

    resetInternalSelection: DrawingObjectsController.prototype.resetInternalSelection,
    recalculateCurPos: DrawingObjectsController.prototype.recalculateCurPos,

    hitToAdj: function(x, y)
    {
        return {hit: false, num: -1, polar: false};
    },

    setNvSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_SetSetNvSpPr, oldPr: this.nvGrpSpPr, newPr: pr});
        this.nvGrpSpPr = pr;
        if(this.parent && pr && pr.cNvPr && isRealNumber(pr.cNvPr.id))
        {
            if(pr.cNvPr.id > this.parent.maxId)
            {
                this.parent.maxId = pr.cNvPr.id+1;
            }
        }
    },

    swapGraphicObject: function(idRemove, idAdd)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(this.spTree[i].Get_Id() === idRemove)
            {
                this.spTree.splice(i, 1)[0].setGroup(null);
                var sp = g_oTableId.Get_ById(idAdd);
                sp.setGroup(this);
                this.spTree.splice(i, 0, sp);
                History.Add(this, {Type:historyitem_AutoShapes_SwapGraphicObjects, pos: i, idRemove: idRemove, idAdd: idAdd});
                break;
            }
        }
    },

    bringToFront : function()//перемещаем заселекченые объекты наверх
    {
        var i;
        for(i = this.spTree.length - 1;  i > -1; --i)
        {
            if(this.spTree[i].getObjectType() === historyitem_type_GroupShape)
            {
                this.spTree[i].bringToFront();
            }

        }
    },

    bringForward : function()
    {
    },

    sendToBack : function()
    {
    },

    bringBackward : function()
    {
    },



    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_GroupShapeAddToSpTree:
            {
                for(var i = this.spTree.length - 1; i > -1; --i)
                {
                    if(this.spTree[i] === data.item)
                    {
                        this.spTree.splice(i, 1);
                        break;
                    }
                }
                this.handleUpdateSpTree();
                break;
            }
            case historyitem_GroupShapeSetGroup:
            {
                this.group = data.oldPr;
                break;
            }
            case historyitem_GroupShapeSetNvGrpSpPr:
            {
                this.nvGrpSpPr = data.oldPr;
                break;
            }
            case historyitem_GroupShapeSetParent:
            {
                this.parent = data.oldPr;
                break;
            }
            case historyitem_GroupShapeRemoveFromSpTree:
            {
                this.spTree.splice(data.pos, 0, data.item);
                this.handleUpdateSpTree();
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_GroupShapeAddToSpTree:
            {
                this.spTree.splice(data.pos, 0, data.item);
                this.handleUpdateSpTree();
                break;
            }
            case historyitem_GroupShapeSetGroup:
            {
                this.group = data.newPr;
                break;
            }
            case historyitem_GroupShapeSetNvGrpSpPr:
            {
                this.nvGrpSpPr = data.newPr;
                break;
            }
            case historyitem_GroupShapeSetParent:
            {
                this.parent = data.newPr;
                break;
            }
            case historyitem_GroupShapeRemoveFromSpTree:
            {
                for(var i = this.spTree.length; i > -1; --i)
                {
                    if(this.spTree[i] === data.item)
                    {
                        this.spTree.splice(i, 1);
                        this.handleUpdateSpTree();
                        break;
                    }
                }
                break;
            }
        }
    },






    Refresh_RecalcData: function()
    {},

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_GroupShapeAddToSpTree:
            case historyitem_GroupShapeRemoveFromSpTree:
            {
                writeLong(w, data.pos);
                writeObject(w, data.item);
                break;
            }
            case historyitem_GroupShapeSetGroup:
            case historyitem_GroupShapeSetNvGrpSpPr:
            case historyitem_GroupShapeSetParent:
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type  = r.GetLong();
        switch (type)
        {
            case historyitem_GroupShapeAddToSpTree:
            {
                var pos = readLong(r);
                var item = readObject(r);
                if(isRealObject(item) && isRealNumber(pos))
                {
                    this.spTree.splice(pos, 0, data.item);
                }
                break;
            }
            case historyitem_GroupShapeSetGroup:
            {
                this.group = readObject(r);
                break;
            }
            case historyitem_GroupShapeSetNvGrpSpPr:
            {
                this.nvGrpSpPr = readObject(r);
                break;
            }
            case historyitem_GroupShapeSetParent:
            {
                this.parent = readObject(r);
                break;
            }
            case historyitem_GroupShapeRemoveFromSpTree:
            {
                var pos = readLong(r);
                var item = readObject(r);
                if(isRealNumber(pos) && isRealObject(item))
                {
                    if(this.spTree[pos] === item)
                    {
                        this.spTree.splice(i, 1);
                    }
                }
                break;
            }
        }
    }
};

function normalizeRotate(rot)
{
    var new_rot = rot;
    if(isRealNumber(new_rot))
    {
        while(new_rot >= 2*Math.PI)
            new_rot -= Math.PI;
        while(new_rot < 0)
            new_rot += Math.PI;
        return new_rot;
    }
    return new_rot;
}