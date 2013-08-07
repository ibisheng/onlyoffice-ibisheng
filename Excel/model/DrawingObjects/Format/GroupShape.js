/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/27/13
 * Time: 12:06 PM
 * To change this template use File | Settings | File Templates.
 */
function CGroupShape(drawingBase, drawingObjects)
{
    this.drawingBase = drawingBase;
    this.drawingObjects = drawingObjects;

    this.nvSpPr = null;
    this.spPr = new CSpPr();

    this.spTree = [];
    this.arrGraphicObjects = [];
    this.selectedObjects = [];

    this.group = null;


    this.recalcInfo =
    {
        recalculateTransform: true,
        recalculateArrGraphicObjects: true
    };

    this.x = null;
    this.y = null;
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.rot = null;
    this.flipH = null;
    this.flipV = null;
    this.transform = new CMatrix();
    this.invertTransform = null;
    this.transformText = null;
    this.invertTransformText = null;
    this.cursorTypes = [];

    this.brush  = null;
    this.pen = null;

    this.selected = false;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    if(isRealObject(drawingObjects))
        this.setDrawingObjects(drawingObjects);
}

CGroupShape.prototype =
{

    Get_Id: function()
    {
        return this.Id;
    },
    getObjectType: function()
    {
        return CLASS_TYPE_GROUP;
    },


    setDrawingObjects: function(drawingObjects)
    {
        var newValue = isRealObject(drawingObjects) ? drawingObjects.getWorksheet().model.getId() : null;
        var oldValue = isRealObject(this.drawingObjects) ? this.drawingObjects.getWorksheet().model.getId() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetDrawingObjects, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.drawingObjects = drawingObjects;

    },

    isShape: function()
    {
        return false;
    },

    isGroup: function()
    {
        return true;
    },

    isImage: function()
    {
        return false;
    },

    isChart: function()
    {
        return false;
    },


    isSimpleObject: function()
    {
        return false;
    },

    /*setDrawingObjects: function(drawingObjects)
    {
        this.drawingObjects = drawingObjects;
        for(var i = 0; i < this.spTree.length; ++i)
        {
            this.spTree[i].setDrawingObjects(drawingObjects);
        }
    },       */

    setXfrmObject: function(xfrm)
    {
        var oldId = isRealObject(this.spPr.xfrm) ? this.spPr.xfrm.Get_Id() : null;
        var newId = isRealObject(xfrm) ? xfrm.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetXfrm, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.spPr.xfrm = xfrm;

    },

    setDrawingBase: function(drawingBase)
    {
        this.drawingBase = drawingBase;
    },

    setPosition: function(x, y)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setPosition(x, y, model_id);
    },

    setExtents: function(extX, extY)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setExtents(extX, extY, model_id);
    },

    setFlips: function(flipH, flipV)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setFlips(flipH, flipV, model_id);
    },

    setRotate: function(rot)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setRotate(rot, model_id);
    },

    setChildExtents: function(chExtX, chExtY)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setChildExtents(chExtX, chExtY, model_id);
    },

    setChildOffsets: function(chOffX, chOffY)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setChildOffsets(chOffX, chOffY, model_id);
    },

    updateDrawingBaseCoordinates: function()
    {
        if(isRealObject(this.drawingBase))
            this.drawingBase.setGraphicObjectCoords();
    },

    setGroup: function(group)
    {
        this.group = group;
    },

    addToSpTree: function(grObject)
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddToSpTree, null, null,
            new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(grObject.Get_Id(), null)));
        this.spTree.push(grObject);
        this.recalcInfo.recalculateArrGraphicObjects = true;
    },

    getMainGroup: function()
    {
        if(!isRealObject(this.group))
            return this;
        return this.group.getMainGroup();
    },

    getResultScaleCoefficients: function()
    {
        var cx, cy;
        if(this.spPr.xfrm.chExtX > 0)
            cx = this.spPr.xfrm.extX/this.spPr.xfrm.chExtX;
        else
            cx = 1;

        if(this.spPr.xfrm.chExtY > 0)
            cy = this.spPr.xfrm.extY/this.spPr.xfrm.chExtY;
        else
            cy = 1;
        if(isRealObject(this.group))
        {
            var group_scale_coefficients = this.group.getResultScaleCoefficients();
            cx *= group_scale_coefficients.cx;
            cy *= group_scale_coefficients.cy;
        }
        return {cx: cx, cy: cy};
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

    getArrGraphicObjects: function()
    {
        if(this.recalcInfo.recalculateArrGraphicObjects)
            this.recalculateArrGraphicObjects();
        return this.arrGraphicObjects;
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

    getFullOffset: function()
    {
        if(!isRealObject(this.group))
            return {offX: this.x, offY: this.y};
        var group_offset = this.group.getFullOffset();
        return {offX: this.x + group_offset.offX, offY: this.y + group_offset.offY};
    },


    transformPointRelativeShape: function(x, y)
    {
        var _horizontal_center = this.extX*0.5;
        var _vertical_enter = this.extY*0.5;
        var _sin = Math.sin(this.rot);
        var _cos = Math.cos(this.rot);


        var _temp_x = x - (-_horizontal_center*_cos + _vertical_enter*_sin +this.x + _horizontal_center);
        var _temp_y = y - (-_horizontal_center*_sin - _vertical_enter*_cos +this.y + _vertical_enter);

        var _relative_x = _temp_x*_cos + _temp_y*_sin;
        var _relative_y = -_temp_x*_sin + _temp_y*_cos;

        if(this.absFlipH)
            _relative_x = this.extX - _relative_x;

        if(this.absFlipV)
            _relative_y = this.extY - _relative_y;

        return {x: _relative_x, y: _relative_y};
    },

    getRectBounds: function()
    {
        var transform = this.getTransform();
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

    getBoundsInGroup: function()
    {
        var r = this.rot;
        if((r >= 0 && r < Math.PI*0.25)
            || (r > 3*Math.PI*0.25 && r < 5*Math.PI*0.25)
            || (r > 7*Math.PI*0.25 && r < 2*Math.PI))
        {
            return {minX: this.x, minY: this.y, maxX: this.x + this.extX, maxY: this.y + this.extY};
        }
        else
        {
            var hc = this.extX*0.5;
            var vc = this.extY*0.5;
            var xc = this.x + hc;
            var yc = this.y + vc;
            return {minX: xc - vc, minY: yc - hc, maxX: xc + vc, maxY: yc + hc};
        }
    },

    getRotateAngle: function(x, y)
    {
        var transform = this.getTransform();
        var rotate_distance = this.drawingObjects.convertMetric(TRACK_DISTANCE_ROTATE, 0, 3);
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

    draw: function(graphics)
    {
        for(var i = 0; i < this.spTree.length; ++i)
            this.spTree[i].draw(graphics);
    },

    recalculate: function()
    {
        //if(this.recalcInfo.recalculateTransform)
            this.recalculateTransform();
       // if(this.recalcInfo.recalculateArrGraphicObjects)
            this.recalculateArrGraphicObjects();
    },

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



    recalculateTransform: function()
    {
        var xfrm = this.spPr.xfrm;
        if(!isRealObject(this.group))
        {
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
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            this.x = scale_scale_coefficients.cx*(xfrm.offX - this.group.spPr.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy*(xfrm.offY - this.group.spPr.xfrm.chOffY);
            this.extX = scale_scale_coefficients.cx*xfrm.extX;
            this.extY = scale_scale_coefficients.cy*xfrm.extY;
            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = xfrm.flipH === true;
            this.flipV = xfrm.flipV === true;
        }
        if(isRealObject(this.spPr.geometry))
            this.spPr.geometry.Recalculate(this.extX, this.extY);
        this.transform.Reset();
        var hc, vc;
        hc = this.extX*0.5;
        vc = this.extY*0.5;
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(this.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(this.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);

        global_MatrixTransformer.RotateRadAppend(this.transform, -this.rot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
        if(isRealObject(this.group))
        {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransform());
        }
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        for(var i = 0; i < this.spTree.length; ++i)
        {
            this.spTree[i].recalculateTransform();
            if(typeof this.spTree[i].calculateContent === "function")
                this.spTree[i].calculateContent();
            if(typeof this.spTree[i].calculateTransformTextMatrix === "function")
                this.spTree[i].calculateTransformTextMatrix();
        }
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
        this.setPosition(new_off_x, new_off_y);
        this.setExtents(new_ext_x, new_ext_y);
        this.setChildExtents(new_ext_x, new_ext_y);
        this.setChildOffsets(0, 0);
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

        this.setPosition(pos_x, pos_y);
        this.setExtents(Math.abs(max_x - min_x), Math.abs(max_y - min_y));
        this.setChildExtents(Math.abs(max_x - min_x), Math.abs(max_y - min_y));
        for(i = 0; i < sp_tree.length; ++i)
        {
            sp_tree[i].setPosition(sp_tree[i].spPr.xfrm.offX - x_min_clear, sp_tree[i].spPr.xfrm.offY - y_min_clear);
        }
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

    canUnGroup: function()
    {
        return true;
    },

    hitInBoundingRect: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);

        var _hit_context = this.drawingObjects.getCanvasContext();

        return (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) ||
            HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY)||
            HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY)||
            HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0) /*||
         HitInLine(_hit_context, x_t, y_t, this.extX*0.5, 0, this.extX*0.5, -this.drawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE))*/);
    },

    hitToAdjustment: function()
    {
        return {hit: false};
    },

    hitToHandles: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        var radius = this.drawingObjects.convertMetric(TRACK_CIRCLE_RADIUS, 0, 3);

        var sqr_x = t_x*t_y, sqr_y = t_y*t_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 0;

        var hc = this.extX*0.5;
        var dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 1;

        dist_x = t_x - this.extX;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 2;

        var vc = this.extY*0.5;
        var dist_y = t_y - vc;
        sqr_y = dist_y*dist_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 3;

        dist_y = t_y - this.extY;
        sqr_y = dist_y*dist_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 4;

        dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 5;

        dist_x = t_x;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 6;

        dist_y = t_y - vc;
        sqr_y = dist_y*dist_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 7;

        var rotate_distance = this.drawingObjects.convertMetric(TRACK_DISTANCE_ROTATE, 0, 3);
        dist_y = t_y + rotate_distance;
        sqr_y = dist_y*dist_y;
        dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 8;

        return -1;

    },

    setCellBackgroundColor: function(color)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].setCellBackgroundColor === "function")
                this.spTree[i].setCellBackgroundColor(color);
        }
    },

    setCellAllFontName: function(fontName)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].setCellAllFontName === "function")
                this.spTree[i].setCellAllFontName(fontName);
        }
    },

    setCellAllFontSize: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].setCellAllFontSize === "function")
                this.spTree[i].setCellAllFontSize(val);
        }
    },

    setCellAllBold: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].setCellAllBold === "function")
                this.spTree[i].setCellAllBold(val);
        }
    },

    setCellAllItalic: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].setCellAllItalic === "function")
                this.spTree[i].setCellAllItalic(val);
        }
    },

    setCellAllUnderline: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].setCellAllUnderline === "function")
                this.spTree[i].setCellAllUnderline(val);
        }
    },

    setCellAllStrikeout: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].setCellAllStrikeout === "function")
                this.spTree[i].setCellAllStrikeout(val);
        }
    },

    setCellAllSubscript: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].setCellAllSubscript === "function")
                this.spTree[i].setCellAllSubscript(val);
        }
    },

    setCellAllSuperscript: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].setCellAllSuperscript === "function")
                this.spTree[i].setCellAllSuperscript(val);
        }
    },

    setCellAllAlign: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].setCellAllAlign === "function")
                this.spTree[i].setCellAllAlign(val);
        }
    },

    setCellAllVertAlign: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].setCellAllVertAlign === "function")
                this.spTree[i].setCellAllVertAlign(val);
        }
    },

    setCellAllTextColor:  function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].setCellAllTextColor === "function")
                this.spTree[i].setCellAllTextColor(val);
        }
    },
    setCellAllAngle: function(val)
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].setCellAllAngle === "function")
                this.spTree[i].setCellAllAngle(val);
        }
    },

    increaseAllFontSize: function()
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].increaseAllFontSize === "function")
                this.spTree[i].increaseAllFontSize();
        }
    },

    decreaseAllFontSize: function()
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].decreaseAllFontSize === "function")
                this.spTree[i].decreaseAllFontSize();
        }
    },

    drawAdjustments: function(drawingDocument)
    {
    },

    getTransform: function()
    {
        //if(this.recalcInfo.recalculateTransform)
         //   this.recalculateTransform();
        return this.transform;
    },

    getInvertTransform: function()
    {
        //if(this.recalcInfo.recalculateTransform)
        //this.recalculateTransform();
        return this.invertTransform;
    } ,

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
            sp.setGroup(null);
            sp.setPosition(xc - hc, yc - vc);
            sp.setFlips(full_flip_h, full_flip_v);
            sp.setRotate(normalizeRotate(sp.getFullRotate()));
            ret.push(sp);
        }
        return ret;
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
        var transform = this.getTransform();
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



    recalculateColors: function()
    {
        for(var i = 0; i < this.spTree.length; ++i)
        {
            if(typeof this.spTree[i].recalculateColors==="function")
                this.spTree[i].recalculateColors();
        }
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

    resetSelection: function(drawingObjectsController)
    {
        while(this.selectedObjects.length > 0)
            this.selectedObjects[0].deselect(drawingObjectsController);
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

    deleteDrawingBase: function()
    {
        var position = this.drawingObjects.deleteDrawingBase(this.Get_Id());
        if(isRealNumber(position))
        {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_DeleteDrawingBase, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(position, null)), null);
        }
    },

    addToDrawingObjects: function(pos)
    {
        var position = this.drawingObjects.addGraphicObject(this, pos);
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Add_To_Drawing_Objects, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(position, null)), null);
    },

    changePresetGeometry: function(preset)
    {
        for(var i =0; i < this.arrGraphicObjects.length; ++i)
        {
            if(typeof this.arrGraphicObjects[i].changePresetGeometry === "function")
                this.arrGraphicObjects[i].changePresetGeometry(preset);
        }
    },

    Get_Props: function(OtherProps)
    {
        var Props = new Object();
        Props.Width  = this.extX;
        Props.Height = this.extY;

        if(!isRealObject(OtherProps))
            return Props;


        OtherProps.Width = OtherProps.Width === Props.Width ? Props.Width : undefined;
        OtherProps.Height = OtherProps.Height === Props.Height ? Props.Height : undefined;

        return OtherProps;
    },

    getFill: function()
    {
        var _ret = null;
        var _shapes = this.arrGraphicObjects;
        var _shape_index;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            if(_shapes[_shape_index].isShape())
            {
                _ret = _shapes[_shape_index].getFill();
                if(_ret == null)
                {
                    return null;
                }
                break;
            }
        }
        if(_shape_index < _shapes.length)
        {
            ++_shape_index;
            var _cur_fill;
            for(;_shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].isShape())
                {
                    _cur_fill = _shapes[_shape_index].getFill();
                    _ret = CompareUniFill(_ret, _cur_fill);
                }
            }
        }
        return _ret;
    },

    getStroke: function()
    {
        var _ret = null;
        var _shapes = this.arrGraphicObjects;
        var _shape_index;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            if(_shapes[_shape_index].isShape())
            {
                _ret = _shapes[_shape_index].getStroke();
                if(_ret == null)
                {
                    return null;
                }
                break;
            }
        }
        if(_shape_index < _shapes.length)
        {
            ++_shape_index;
            var _cur_line;
            for(;_shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].isShape())
                {
                    _cur_line = _shapes[_shape_index].getStroke();
                    if(_cur_line == null)
                    {
                        return null;
                    }
                    else
                    {
                        _ret = _ret.compare(_cur_line);
                    }
                }
            }
        }
        return _ret;
    },

    canChangeArrows: function()
    {
        var _ret = false;
        var _shapes = this.spTree;
        var _shape_index;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            if(_shapes[_shape_index].canChangeArrows)
            {
                _ret = _shapes[_shape_index].canChangeArrows();
                if(_ret == false)
                {
                    return false;
                }
                break;
            }
        }
        if(_shape_index < _shapes.length)
        {
            ++_shape_index;
            var _cur_line;
            for(;_shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].canChangeArrows)
                {
                    if(_shapes[_shape_index].canChangeArrows() == false)
                    {
                        return false;
                    }
                }
            }
        }
        return _ret;
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

    haveImages: function()
    {
        for(var i = 0; i < this.arrGraphicObjects.length; ++i)
        {
            if(this.arrGraphicObjects[i].isImage())
                return true;
        }
        return false;
    },

    haveChart: function()
    {
        for(var i = 0; i < this.arrGraphicObjects.length; ++i)
        {
            if(this.arrGraphicObjects[i].isChart())
                return true;
        }
        return false;
    },


    getImageUrl: function()
    {
        var ret = null;
        for(var i = 0; i < this.arrGraphicObjects.length; ++i)
        {
            if(this.arrGraphicObjects[i].isImage())
            {
                if(ret === null)
                {
                    ret = this.arrGraphicObjects[i].getImageUrl();
                }
                else
                {
                    if(ret !== this.arrGraphicObjects[i].getImageUrl())
                        return undefined;
                }
            }
        }
        return ret;
    },

    getPresetGeom: function()
    {
        var _ret = null;
        var _shapes = this.arrGraphicObjects;
        var _shape_index;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            if(_shapes[_shape_index].isShape())
            {
                _ret = _shapes[_shape_index].getPresetGeom();
                if(_ret == null)
                {
                    return null;
                }
                break;
            }
        }
        if(_shape_index < _shapes.length)
        {
            ++_shape_index;
            var _cur_preset;
            for(;_shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].isShape())
                {
                    _cur_preset = _shapes[_shape_index].getPresetGeom();
                    if(_cur_preset == null || _cur_preset != _ret)
                    {
                        return null;
                    }
                }
            }
        }
        return _ret;
    },

    getImageProps: function()
    {
        var _objects = this.arrGraphicObjects;
        var _cur_object;
        var _object_index;
        var _object_count = _objects.length;
        var _cur_image_props;
        var _result_image_props = null;
        for(_object_index = 0; _object_index < _object_count; ++_object_index)
        {
            _cur_object = _objects[_object_index];
            if(_cur_object.isImage())
            {
                _cur_image_props = _cur_object.getImageProps();
                if(_cur_image_props !== null)
                {
                    if(_result_image_props === null)
                    {
                        _result_image_props = _cur_image_props;
                    }
                    else
                    {
                        _result_image_props = CompareImageProperties(_result_image_props, _cur_image_props);
                    }
                }
            }
        }
        return _result_image_props;
    },


    changeFill: function(fill)
    {
        for(var i = 0; i < this.arrGraphicObjects.length; ++i)
        {
            if(typeof this.arrGraphicObjects[i].changeFill ==="function")
                this.arrGraphicObjects[i].changeFill(fill);
        }
    },


    changeLine: function(line)
    {
        for(var i = 0; i < this.arrGraphicObjects.length; ++i)
        {
            if(typeof this.arrGraphicObjects[i].changeLine ==="function")
                this.arrGraphicObjects[i].changeLine(line);
        }
    },

    getShapeProps: function()
    {
        if(this.haveShapes())
        {
            var shape_props = new asc_CShapeProperty();
            shape_props.type = this.getPresetGeom();
            shape_props.fill = this.getFill();
            shape_props.stroke = this.getStroke();
            shape_props.canChangeArrows = this.canChangeArrows();
            return {ShapeProperties : shape_props}
        }
        return null;
    },

    getImageProps2: function()
    {
        if(this.haveImages())
        {
            var img_pr = new asc_CImgProperty();
            img_pr.ImageUrl = this.getImageUrl();
        }
            return img_pr;
        return null;
    },

    getChartProps: function()
    {
        var ret = null;
        for(var i = 0; i < this.arrGraphicObjects.length; ++i)
        {
            if(this.arrGraphicObjects[i].isChart())
            {
                if(!isRealObject(ret))
                {
                    ret = new asc_CImgProperty();
                    ret.ChartProperties = this.arrGraphicObjects[i].chart;
                }
                else
                {
                    ret.severalCharts = true;
                    if(ret.severalChartTypes !== true)
                    {
                        if(!(ret.ChartProperties.type === this.arrGraphicObjects[i].chart.type && ret.ChartProperties.subType === this.arrGraphicObjects[i].chart.subType) )
                            ret.severalChartTypes = true;
                    }
                    if(ret.severalChartStyles !== true)
                    {
                        if(ret.ChartProperties.styleId !== this.arrGraphicObjects[i].chart.styleId )
                            ret.severalChartStyles = true;
                    }
                }
            }
        }
        return ret;
    },




    Undo: function(type, data)
    {
        switch(type)
        {
            case  historyitem_AutoShapes_AddToSpTree:
            {
                for(var i = this.spTree.length -1; i > -1; --i)
                {
                    if(this.spTree[i].Get_Id() === data.oldValue)
                    {
                        this.spTree.splice(i, 1);
                        break;
                    }
                }
                break;
            }
            case historyitem_AutoShapes_SetXfrm:
            {
                this.spPr.xfrm = g_oTableId.Get_ById(data.oldValue);
                break;
            }
            case historyitem_AutoShapes_GroupRecalculateUndo:
            {
                this.recalculate();
                break;
            }
            case historyitem_AutoShapes_Add_To_Drawing_Objects:
            {
                this.drawingObjects.deleteDrawingBase(this.Id);
                break;
            }


            case historyitem_AutoShapes_DeleteDrawingBase:
            {
                this.drawingObjects.addGraphicObject(this, data.oldValue);
                break;
            }
            case historyitem_AutoShapes_SetDrawingObjects:
            {
                if(data.newValue !== null)
                {
                    var api = window["Asc"]["editor"];
                    if ( api.wb )
                    {
                        var ws = api.wb.getWorksheetById(data.oldValue);
                        this.drawingObjects = ws.objectRender;
                    }
                }
                break;
            }
        }
    },

    Redo: function(type, data)
    {
        switch(type)
        {
            case  historyitem_AutoShapes_AddToSpTree:
            {
                this.spTree.push(g_oTableId.Get_ById(data.oldValue));
                break;
            }
            case historyitem_AutoShapes_GroupRecalculateRedo:
            {
                this.recalculate();
                break;
            }
            case historyitem_AutoShapes_Add_To_Drawing_Objects:
            {
                this.drawingObjects.addGraphicObject(this, data.oldValue);
                break;
            }

            case historyitem_AutoShapes_SetXfrm:
            {
                this.spPr.xfrm = g_oTableId.Get_ById(data.newValue);
                break;
            }
            case historyitem_AutoShapes_DeleteDrawingBase:
            {
                this.drawingObjects.deleteDrawingBase(this.Id);
                break;
            }
            case historyitem_AutoShapes_SetDrawingObjects:
            {
                if(data.newValue !== null)
                {
                    var api = window["Asc"]["editor"];
                    if ( api.wb )
                    {
                        var ws = api.wb.getWorksheetById(data.newValue);
                        this.drawingObjects = ws.objectRender;
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