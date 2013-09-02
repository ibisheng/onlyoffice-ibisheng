function CGroupShape(parent)
{
    this.parent = parent;
    this.group = null;
    this.drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;

    this.spLocks = null;
    this.useBgFill = null;
    this.nvSpPr = null;
    this.spPr = new CSpPr();
    this.spTree = [];

    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.rot = null;
    this.flipH = null;
    this.flipV = null;
    this.transform = new CMatrix();

    this.brush  = null;
    this.pen = null;

    this.selected = false;

    this.arrGraphicObjects = [];
    this.selectionArray = [];

    this.recalcInfo =
    {
        recalculateBrush: true,
        recalculatePen: true,
        recalculateTransform: true,
        recalculateSpTree: true,
        recalculateCursorTypes: true,
        recalculateScaleCoefficients: true
    };

    this.scaleCoefficients =
    {
        cx: 1,
        cy: 1
    };

    this.Lock = new CLock();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CGroupShape.prototype =
{

    recalcAll: function()
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
    },
    Get_Id: function()
    {
        return this.Id;
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
    },

    getArrGraphicObjects: function()
    {
        return this.arrGraphicObjects;
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

        if(recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            recalcInfo.recalculateTransform = false;
        }
        for(var i = 0;  i < this.spTree.length; ++i)
            this.spTree[i].recalculate();
    },

    recalculateBrush: function()
    {},

    recalculatePen: function()
    {},

    recalculateArrGraphicObjects: function()
    {},


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
    },

    getTransformMatrix: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
        }
        return this.transform;
    },

    getCompiledFill: function()
    {
        return null;
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
        for(var _shape_index = 0; _shape_index < this.ArrGlyph.length; ++_shape_index)
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
            return null;

        var cur_group = this.group;
        while(isRealObject(cur_group.group))
            cur_group = cur_group.group;
        return cur_group;
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

    resetSelection: function(graphicObjects)
    {
        for(var i = this.selectionArray.length - 1; i > -1; --i)
        {
            this.selectionArray[i].deselect(graphicObjects);
        }
    },

    hitToAdj: function(x, y)
    {
        return {hit: false, num: -1, polar: false};
    },

    hitToHandles: function(x, y)
    {
        var px = this.invertTransform.TransformPointX(x, y);
        var py = this.invertTransform.TransformPointY(x, y);
        var distance = this.drawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
        var dx, dy;
        dx = px;
        dy = py;
        if(Math.sqrt(dx*dx + dy*dy) < distance)
            return 0;

        var width = this.extX;
        var height = this.extY;
        var hc = width*0.5;
        var vc = height*0.5;

        dx = px - hc;
        if(Math.sqrt(dx*dx + dy*dy) < distance)
            return 1;

        dx = px - width;
        if(Math.sqrt(dx*dx + dy*dy) < distance)
            return 2;

        dy = py - vc;
        if(Math.sqrt(dx*dx + dy*dy) < distance)
            return 3;

        dy = py - height;
        if(Math.sqrt(dx*dx + dy*dy) < distance)
            return 4;

        dx = px - hc;
        if(Math.sqrt(dx*dx + dy*dy) < distance)
            return 5;

        dx = px;
        if(Math.sqrt(dx*dx + dy*dy) < distance)
            return 6;

        dy = py - vc;
        if(Math.sqrt(dx*dx + dy*dy) < distance)
            return 7;

        return -1;
    }
};