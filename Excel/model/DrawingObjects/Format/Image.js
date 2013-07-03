/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 6:24 PM
 * To change this template use File | Settings | File Templates.
 */


var MIN_SHAPE_DIST = 5.08;

var CARD_DIRECTION_N = 0;
var CARD_DIRECTION_NE = 1;
var CARD_DIRECTION_E = 2;
var CARD_DIRECTION_SE = 3;
var CARD_DIRECTION_S = 4;
var CARD_DIRECTION_SW = 5;
var CARD_DIRECTION_W = 6;
var CARD_DIRECTION_NW = 7;

var CURSOR_TYPES_BY_CARD_DIRECTION = [];
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_N]  = "n-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_NE] = "ne-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_E]  = "e-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_SE] = "se-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_S]  = "s-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_SW] = "sw-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_W]  = "w-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_NW] = "nw-resize";


function isRealNumber(number)
{
    return number === number && typeof number === "number";
}

function CImage(drawingBase, drawingObjects)
{
    this.drawingBase = drawingBase;
    this.drawingObjects = drawingObjects;

    this.blipFill = new CBlipFill();
    this.spPr = new CSpPr();
    this.nvSpPr = null;
    this.style = null;

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

    this.recalcInfo =
    {
        recalculateTransform: true,
        recalculateGeometry: true,
        recalculateBrush: true
    };


    this.brush  = null;
    this.pen = null;

    this.selected = false;
}

CImage.prototype =
{

    isShape: function()
    {
        return false;
    },

    isGroup: function()
    {
        return false;
    },

    isImage: function()
    {
        return true;//TODO
    },

    isChart: function()
    {
        return false;/*TODO*/
    },

    isSimpleObject: function()
    {
        return true;
    },

    init: function(x, y, extX, extY, imageId)
    {
        this.setPosition(x, y);
        this.setExtents(extX, extY);
        this.setImageId(imageId);
        this.setPresetGeometry("rect");
        this.recalculate();
    },

    setDrawingBase: function(drawingBase)
    {
        this.drawingBase = drawingBase;
    },

    setPresetGeometry: function(preset)
    {
        this.spPr.geometry = CreateGeometry(preset);
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

    updateDrawingBaseCoordinates: function()
    {
        if(isRealObject(this.drawingBase))
            this.drawingBase.setGraphicObjectCoords();
    },

    setImageId: function(imageId)
    {
        this.blipFill.RasterImageId = imageId;
    },

    recalculate: function()
    {
        if(this.recalcInfo.recalculateTransform)
            this.recalculateTransform();
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
            global_MatrixTransformer.MultiplyAppend(t, this.group.getTransform());
        }
    },

    getTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.transform;
    },

    getInvertTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.invertTransform;
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

    setGroup: function(group)
    {
        this.group = group;
    },

    getFullOffset: function()
    {
        if(!isRealObject(this.group))
            return {offX: this.x, offY: this.y};
        var group_offset = this.group.getFullOffset();
        return {offX: this.x + group_offset.offX, offY: this.y + group_offset.offY};
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


    hitToAdjustment: function(x, y)
    {
        return {hit: false, adjPolarFlag: null, adjNum: null};
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

    hitInBoundingRect: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);

        var _hit_context = this.drawingDocument.CanvasHitContext;

        return (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) ||
            HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY)||
            HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY)||
            HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0) ||
            HitInLine(_hit_context, x_t, y_t, this.extX*0.5, 0, this.extX*0.5, -this.drawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE)));
    },

    canRotate: function()
    {
        return !this.isChart(); //TODO
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
        return new MoveShapeImageInGroupTrack(this);
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

        var v1_x, v1_y, v2_x, v2_y;
        v1_x = x - xc_t;
        v1_y = y - yc_t;

        v2_x = rot_x_t - xc_t;
        v2_y = rot_y_t - yc_t;
        return  Math.atan2( Math.abs(v1_x*v2_y - v1_y*v2_x), v1_x*v2_x + v1_y*v2_y);
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

    getFullRotate: function()
    {
        return !isRealObject(this.group) ? this.rot : this.rot + this.group.getFullRotate();
    },


    drawAdjustments: function(drawingDocument)
    {
    }
};