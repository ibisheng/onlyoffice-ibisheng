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

}

CGroupShape.prototype =
{
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

    setDrawingBase: function(drawingBase)
    {
        this.drawingBase = drawingBase;
    },

    setPosition: function(x, y)
    {
        this.spPr.xfrm.offX = x;
        this.spPr.xfrm.offY = y;
    },

    setExtents: function(extX, extY)
    {
        this.spPr.xfrm.extX = extX;
        this.spPr.xfrm.extY = extY;
    },

    setFlips: function(flipH, flipV)
    {
        this.spPr.xfrm.flipH = flipH;
        this.spPr.xfrm.flipV = flipV;
    },

    setRotate: function(rot)
    {
        this.spPr.xfrm.rot = rot;
    },

    setChildExtents: function(chExtX, chExtY)
    {
        this.spPr.xfrm.chExtX = chExtX;
        this.spPr.xfrm.chExtY = chExtY;
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
        var t_x, t_y;
        var cx, cy;
        cx= this.extX > 0 ? this.extX : 0.01;
        cy= this.extY > 0 ? this.extY : 0.01;
        var p = this.transformPointRelativeShape(x, y);

        switch(numHandle)
        {
            case 0:
                return {kd1: (cx-p.x)/cx, kd2: (cy-p.y)/cy};
            case 1:
                return {kd1: (cy-p.y)/cy, kd2: 0};
            case 2:
                return {kd1: (cy-p.y)/cy, kd2: p.x/cx};
            case 3:
                return {kd1: p.x/cx, kd2: 0};
            case 4:
                return {kd1: p.x/cx, kd2: p.y/cy};
            case 5:
                return {kd1: p.y/cy, kd2: 0};
            case 6:
                return {kd1: p.y/cy, kd2:(cx-p.x)/cx};
            case 7:
                return {kd1:(cx-p.x)/cx, kd2: 0};
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
        var rotate_distance = 5;/*TODO*/
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
        if(this.recalcInfo.recalculateTransform)
            this.recalculateTransform();
        if(this.recalcInfo.recalculateArrGraphicObjects)
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
        var radius = 5;/*TODO*/

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

        var rotate_distance = 10;/*TODO*/
        dist_y = t_y + rotate_distance;
        sqr_y = dist_y*dist_y;
        dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 8;

        return -1;

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
        if(this.recalcInfo.recalculateTransform)
            this.recalculateTransform();
        return this.invertTransform;
    } ,

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
    }
};