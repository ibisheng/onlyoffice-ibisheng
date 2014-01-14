function CImageShape()
{
    this.nvPicPr  = null;
    this.spPr     = new CSpPr();
    this.blipFill = null;

    this.parent = null;
    this.group = null;

    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.rot = null;
    this.flipH = null;
    this.flipV = null;
    this.transform = new CMatrix();
    this.invertTransform = null;
    this.cursorTypes = [];
    this.brush  = null;
    this.pen = null;

    this.selected = false;

	
    this.setRecalculateInfo();
    this.Lock = new CLock();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add( this, this.Id );
}


CImageShape.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_ImageShape;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },


    setNvPicPr: function(pr)
    {
        History.Add(this, {Type:historyitem_ImageShapeSetNvPicPr, oldPr: this.nvPicPr, newPr: pr});
        this.nvPicPr = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type:historyitem_ImageShapeSetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },
    setBlipFill: function(pr)
    {
        History.Add(this, {Type:historyitem_ImageShapeSetBlipFill, oldPr: this.blipFill, newPr: pr});
        this.blipFill = pr;
    },

    setParent: function(pr)
    {
        History.Add(this, {Type: historyitem_ImageShapeSetParent, oldPr: this.parent, newPr: pr});
        this.parent = pr;
    },

    setGroup: function(pr)
    {
        History.Add(this, {Type: historyitem_ImageShapeSetGroup, oldPr: this.group, newPr: pr});
        this.group = pr;
    },

    copy: function(sp)
    {
        if(!(sp instanceof CImageShape))
            sp = new CImageShape();
        if(this.blipFill)
            sp.setBlipFill(this.blipFill.createDuplicate());
        sp.setSpPr(this.spPr.createDuplicate());
        if(this.nvPicPr)
        {
            sp.setNvSpPr(this.nvPicPr.createDuplicate());
        }
        return sp;
    },

    getImageUrl: function()
    {
        if(isRealObject(this.blipFill) && isRealObject(this.blipFill.fill))
            return this.blipFill.fill.RasterImageId;
        return null;
    },
    getSearchResults: function()
    {
        return null;
    },
    isSimpleObject: function()
    {
        return true;
    },

    recalcAllColors: function()
    {

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

    getBoundsInGroup: function()
    {
        return getBoundsInGroup(this);
    },

    normalize: function()
    {
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
        this.setOffset(new_off_x, new_off_y);
        this.setExtents(new_ext_x, new_ext_y);
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

    recalcAll: function()
    {
        this.recalcInfo =
        {
            recalculateBrush: true,
            recalculatePen: true,
            recalculateTransform: true,
            recalculateCursorTypes: true,
            recalculateGeometry: true,
            recalculateStyle: true,
            recalculateFill: true,
            recalculateLine: true,
            recalculateShapeHierarchy: true,
            recalculateTransparent: true,
            recalculateGroupHierarchy: true
        };
    },

    isPlaceholder : function()
    {
        return this.nvPicPr != null && this.nvPicPr.nvPr != undefined && this.nvPicPr.nvPr.ph != undefined;
    },

    isEmptyPlaceholder: function ()
    {
        return false;
    },



    isShape: function()
    {
        return false;
    },

    isImage: function()
    {
        return true;
    },


    isChart: function()
    {
        return false;
    },


    isGroup: function()
    {
        return false;
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

    hitToAdj: function(x, y)
    {
        return {hit: false, num: -1, polar: false};
    },



    hitToPath: function(x, y)
    {
        if(isRealObject(this.spPr.geometry))
        {
            var px = this.invertTransform.TransformPointX(x, y);
            var py = this.invertTransform.TransformPointY(x, y);
            return this.spPr.geometry.hitInPath(this.getParentObjects().presentation.DrawingDocument.CanvasHitContext, px, py);
        }
        return false;
    },

    hitInPath: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitInPath(this.getParentObjects().presentation.DrawingDocument.CanvasHitContext, x_t, y_t);
        return false;
    },

    hitInInnerArea: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitInInnerArea(this.getParentObjects().presentation.DrawingDocument.CanvasHitContext, x_t, y_t);
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
    },

    changeSize: function(kw, kh)
    {
        if(this.spPr.xfrm.isNotNull())
        {
            var xfrm = this.spPr.xfrm;
            this.setOffset(xfrm.offX*kw, xfrm.offY*kh);
            this.setExtents(xfrm.extX*kw, xfrm.extY*kh);
        }
    },


    getRotateAngle: function(x, y)
    {
        var transform = this.getTransformMatrix();
        var rotate_distance =  this.getParentObjects().presentation.DrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE);
        var hc = this.extX*0.5;
        var vc = this.extY*0.5;
        var xc_t = transform.TransformPointX(hc, vc);
        var yc_t = transform.TransformPointY(hc, vc);
        var rot_x_t = transform.TransformPointX(hc, - rotate_distance);
        var rot_y_t = transform.TransformPointY(hc, - rotate_distance);

        var invert_transform = this.getInvertTransform();
        var rel_x = invert_transform.TransformPointX(x, y);

        var v1_x, v1_y, v2_x, v2_y;
        v1_x = x - xc_t;
        v1_y = y - yc_t;

        v2_x = rot_x_t - xc_t;
        v2_y = rot_y_t - yc_t;

        var flip_h = this.getFullFlipH();
        var flip_v = this.getFullFlipV();
        var same_flip = flip_h && flip_v || !flip_h && !flip_v;
        var angle =  rel_x > this.extX*0.5 ? Math.atan2( Math.abs(v1_x*v2_y - v1_y*v2_x), v1_x*v2_x + v1_y*v2_y) : -Math.atan2( Math.abs(v1_x*v2_y - v1_y*v2_x), v1_x*v2_x + v1_y*v2_y);
        return same_flip ? angle : -angle;
    },


    getFullFlipH: function()
    {
        if(!isRealObject(this.group))
            return this.flipH;
        return this.group.getFullFlipH() ? !this.flipH : this.flipH;
    },


    getFullFlipV: function()
    {
        if(!isRealObject(this.group))
            return this.flipV;
        return this.group.getFullFlipV() ? !this.flipV : this.flipV;
    },

    getAspect: function(num)
    {
        var _tmp_x = this.extX != 0 ? this.extX : 0.1;
        var _tmp_y = this.extY != 0 ? this.extY : 0.1;
        return num === 0 || num === 4 ? _tmp_x/_tmp_y : _tmp_y/_tmp_x;
    },

    getFullRotate: function()
    {
        return !isRealObject(this.group) ? this.rot : this.rot + this.group.getFullRotate();
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

    getImageProps: function()
    {
        var _result_image_props = {};
        _result_image_props.Width = this.extX;
        _result_image_props.Height = this.extY;
        _result_image_props.Position = {X: this.x, Y: this.y};
        _result_image_props.Paddings = {Left: this.x, Top: this.y, Right: this.x + this.extX, Bottom: this.y + this.extY};
        if(this.blipFill && this.blipFill.fill && this.blipFill.fill.RasterImageId)
        {
            _result_image_props.ImageUrl = this.blipFill.fill.RasterImageId;
        }
        if(!isRealObject(this.group))
        {
            _result_image_props.IsLocked = !(this.Lock.Type === locktype_None || this.Lock.Type === locktype_Mine);
        }

        return _result_image_props;
    },

    canRotate: function()
    {
        return true;
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

    getInvertTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = true;
        }
        return this.invertTransform;
    },

    hitInTextRect: function(x, y)
    {
        return false;
    },

    hitToBoundsRect: function(x, y)
    {
        return false;
    },

    getType: function()
    {
        return DRAWING_OBJECT_TYPE_IMAGE;
    },


    getBase64Img: function()
    {
        return ShapeToImageConverter(this, this.pageIndex).ImageUrl;
    },

    recalculateBrush: function()
    {
		var is_on = History.Is_On();
		if(is_on)
			History.TurnOff();
		this.brush = new CUniFill();
		this.brush.setFill(this.blipFill);
		if(is_on)
			History.TurnOn();
    },

    recalculatePen: function()
    {

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
        this.recalcInfo.recalculateTransformText = true;
        xfrm.rot = rot;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },

    Refresh_RecalcData: function()
    {},

    setOffset: function(offX, offY)
    {
        History.Add(this, {Type: historyitem_SetShapeOffset, oldOffsetX: this.spPr.xfrm.offX, newOffsetX: offX, oldOffsetY: this.spPr.xfrm.offY, newOffsetY: offY});
        this.spPr.xfrm.offX = offX;
        this.spPr.xfrm.offY = offY;
        this.recalcInfo.recalculateTransform = true;
        this.recalcInfo.recalculateTransformText = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },


    setExtents: function(extX, extY)
    {
        History.Add(this, {Type: historyitem_SetShapeExtents, oldExtentX: this.spPr.xfrm.extX, newExtentX: extX, oldExtentY: this.spPr.xfrm.extY, newExtentY: extY});
        this.spPr.xfrm.extX = extX;
        this.spPr.xfrm.extY = extY;
        this.recalcInfo.recalculateTransform = true;
        this.recalcInfo.recalculateTransformText = true;
        this.recalcInfo.recalculateGeometry = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },

    setFlips: function(flipH, flipV)
    {
        History.Add(this, {Type: historyitem_SetShapeFlips, oldFlipH: this.spPr.xfrm.flipH, newFlipH: flipH, oldFlipV: this.spPr.xfrm.flipV, newFlipV: flipV});
        this.spPr.xfrm.flipH = flipH;
        this.spPr.xfrm.flipV = flipV;
        this.recalcInfo.recalculateTransform = true;
        this.recalcInfo.recalculateTransformText = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },


    recalculateCursorTypes: function()
    {
        var transform_matrix = this.getTransformMatrix();
        var transform = this.getTransform();
        var hc = transform.extX*0.5;
        var vc = transform.extY*0.5;
        var xc = transform_matrix.TransformPointX(hc, vc);
        var yc = transform_matrix.TransformPointY(hc, vc);
        var xt = transform_matrix.TransformPointX(hc, 0);
        var yt = transform_matrix.TransformPointY(hc, 0);
        var vx = xt-xc;
        var vy = yc-yt;
        var angle = Math.atan2(vy, vx)+Math.PI/8;
        while(angle < 0)
            angle += 2*Math.PI;
        while(angle >= 2*Math.PI)
            angle -= 2*Math.PI;

        var xlt = transform_matrix.TransformPointX(0, 0);
        var ylt = transform_matrix.TransformPointY(0, 0);
        var vx_lt = xlt-xc;
        var vy_lt = yc-ylt;
        var _index = Math.floor(angle/(Math.PI/4));
        var _index2, t;
        if(vx_lt*vy-vx*vy_lt < 0) // нумерация якорьков по часовой стрелке
        {
            for(var i = 0; i<8; ++i)
            {
                t = i- _index + 17;
                _index2 =  t - ((t/8) >> 0)*8;
                this.cursorTypes[i] = DEFAULT_CURSOR_TYPES[_index2];
            }
        }
        else
        {
            for(i = 0; i<8; ++i)
            {
                t = -i-_index+19;
                _index2 = t - ((t/8) >> 0)*8;
                this.cursorTypes[i] = DEFAULT_CURSOR_TYPES[_index2];
            }
        }
        this.recalcInfo.recalculateCursorTypes = false;
    },

    recalculateGeometry: function()
    {
        if(isRealObject(this.spPr.geometry))
        {
            var transform = this.getTransform();
            this.spPr.geometry.Recalculate(transform.extX, transform.extY);
        }
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

    getTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return {x: this.x, y: this.y, extX: this.extX, extY: this.extY, rot: this.rot, flipH: this.flipH, flipV: this.flipV};
    },

    draw: function(graphics)
    {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform, false);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
        shape_drawer.draw(this.spPr.geometry);
        if(locktype_None != this.Lock.Get_Type())
        {
            if(locktype_None != this.Lock.Get_Type())
                graphics.DrawLockObjectRect(this.Lock.Get_Type() , 0, 0, this.extX, this.extY);
        }
        graphics.reset();
        graphics.SetIntegerGrid(true);
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
        return this;
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


    drawAdjustments: function(drawingDocument)
    {
    },

   


    hitToAdjustment: function()
    {
        return {hit:false};
    },

    getPlaceholderType: function()
    {
        return this.isPlaceholder() ? this.nvPicPr.nvPr.ph.type : null;
    },

    getPlaceholderIndex: function()
    {
        return this.isPlaceholder() ? this.nvPicPr.nvPr.ph.idx : null;
    },

    getPhType: function()
    {
        return this.isPlaceholder() ? this.nvPicPr.nvPr.ph.type : null;
    },

    getPhIndex: function()
    {
        return this.isPlaceholder() ? this.nvPicPr.nvPr.ph.idx : null;
    },



   
    setNvSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_SetSetNvSpPr, oldPr: this.nvPicPr, newPr: pr});
        this.nvPicPr = pr;
        if(this.parent && pr && pr.cNvPr && isRealNumber(pr.cNvPr.id))
        {
            if(pr.cNvPr.id > this.parent.maxId)
            {
                this.parent.maxId = pr.cNvPr.id+1;
            }
        }
    },


    setStyle: function(style)
    {
        History.Add(this, {Type:historyitem_SetSetStyle, oldPr: this.style, newPr:style});
        this.style = style;
    },

    getAllImages: function(images)
    {
        if(this.blipFill && this.blipFill.fill instanceof  CBlipFill && typeof this.blipFill.fill.RasterImageId === "string")
        {
            images[_getFullImageSrc(this.blipFill.fill.RasterImageId)] = true;
        }
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_ImageShapeSetNvPicPr:
            {
                this.nvPicPr = data.oldPr;
                break;
            }
            case historyitem_ImageShapeSetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_ImageShapeSetBlipFill:
            {
                this.blipFill = data.oldPr;
                break;
            }
            case historyitem_ImageShapeSetParent:
            {
                this.parent = data.oldPr;
                break;
            }
            case historyitem_ImageShapeSetGroup:
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
            case historyitem_ImageShapeSetNvPicPr:
            {
                this.nvPicPr = data.newPr;
                break;
            }
            case historyitem_ImageShapeSetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_ImageShapeSetBlipFill:
            {
                this.blipFill = data.newPr;
                break;
            }
            case historyitem_ImageShapeSetParent:
            {
                this.parent = data.newPr;
                break;
            }
            case historyitem_ImageShapeSetGroup:
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
            case historyitem_ImageShapeSetNvPicPr:
            case historyitem_ImageShapeSetSpPr:
            case historyitem_ImageShapeSetBlipFill:
            case historyitem_ImageShapeSetParent:
            case historyitem_ImageShapeSetGroup:
            {
                writeObject(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(data.Type)
        {
            case historyitem_ImageShapeSetNvPicPr:
            {
                this.nvPicPr = readObject(r);
                break;
            }
            case historyitem_ImageShapeSetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_ImageShapeSetBlipFill:
            {
                this.blipFill = readObject(r);
                break;
            }
            case historyitem_ImageShapeSetParent:
            {
                this.parent = readObject(r);
                break;
            }
            case historyitem_ImageShapeSetGroup:
            {
                this.group = readObject(r);
                break;
            }
        }
    },


    Load_LinkData: function(linkData)
    {
    }
};