/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 6:09 PM
 * To change this template use File | Settings | File Templates.
 */
function CShape(drawingBase)
{
    this.drawingBase = drawingBase;
    this.nvSpPr = null;
    this.spPr = new CSpPr();
    this.style = null;
    this.txBody = null;

    this.group = null;

    this.recalcInfo =
    {
        recalculateTransform: true,
        recalculateBrush: true,
        recalculatePen: true
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
    this.transform = null;
    this.invertTransform = null;
    this.transformText = null;
    this.invertTransformText = null;
    this.cursorTypes = [];

    this.brush  = null;
    this.pen = null;

    this.selected = false;
}


CShape.prototype =
{
    isShape: function()
    {
        return true;
    },

    isGroup: function()
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

    isSimpleObject: function()
    {
        return true;
    },


    initDefault: function(x, y, extX, extY, flipH, flipV, presetGeom)
    {
        this.setPosition(x, y);
        this.setExtents(extX, extY);
        this.setFlips(flipH, flipV);
        this.setPresetGeometry(presetGeom);
        this.setStyle(CreateDefaultShapeStyle());
        this.recalculate();
    },

    initDefaultTextRect: function()
    {},

    setGroup: function(group)
    {
        this.group = group;
    },

    recalculate: function()
    {
        if(this.recalcInfo.recalculateTransform)
            this.recalculateTransform();
        if(this.recalcInfo.recalculateBrush)
            this.recalculateBrush();
        if(this.recalcInfo.recalculatePen)
            this.recalculatePen()
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

    setPresetGeometry: function(presetGeom)
    {
        this.spPr.geometry = CreateGeometry(presetGeom);
    },

    setStyle: function(style)
    {
        this.style = style;
    },

    setFill: function(fill)
    {
        this.spPr.Fill = fill;
    },

    setLine: function(line)
    {
        this.spPr.ln = line;
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
            this.x = scale_scale_coefficients.cx*(xfrm.offX - this.group.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy*(xfrm.offY - this.group.xfrm.chOffY);
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

        global_MatrixTransformer.RotateAppend(this.transform, -this.rot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
        if(isRealObject(this.group))
        {
            global_MatrixTransformer.MultiplyAppend(t, this.group.getTransform());
        }
    },

    recalculateBrush: function()
    {
        var brush;
        var wb = this.drawingBase.getWorkbook();

        var theme = wb.theme;
        var colorMap = GenerateDefaultColorMap().color_map;
        var RGBA = {R: 0, G: 0, B: 0, A: 255};
        if (theme && this.style != null && this.style.fillRef!=null)
        {
            brush = theme.getFillStyle(this.style.fillRef.idx);
            this.style.fillRef.Color.Calculate(theme, colorMap, {R:0, G:0, B:0, A:255});
            RGBA = this.style.fillRef.Color.RGBA;

            if (this.style.fillRef.Color.color != null)
            {
                if (brush.fill != null && (brush.fill.type == FILL_TYPE_SOLID || brush.fill.type == FILL_TYPE_GRAD))
                {
                    brush.fill.color = this.style.fillRef.Color.createDuplicate();
                }
            }
        }
        else
        {
            brush = new CUniFill();
        }

        brush.merge(this.spPr.Fill);
        this.brush = brush;
        this.brush.calculate(theme, colorMap, RGBA);
    },

    recalculatePen: function()
    {
        var _calculated_line;
        var _theme = this.drawingBase.getWorkbook().theme;
        var colorMap = GenerateDefaultColorMap().color_map;
        var RGBA = {R: 0, G: 0, B: 0, A: 255};
        if(_theme !== null && typeof _theme === "object" && typeof _theme.getLnStyle === "function"
            && this.style !== null && typeof  this.style === "object"
            && this.style.lnRef !== null && typeof this.style.lnRef === "object" && typeof  this.style.lnRef.idx === "number"
            && this.style.lnRef.Color !== null && typeof  this.style.lnRef.Color.Calculate === "function")
        {
            _calculated_line = _theme.getLnStyle(this.style.lnRef.idx);
            this.style.lnRef.Color.Calculate(_theme, colorMap, {R: 0 , G: 0, B: 0, A: 255});
            RGBA = this.style.lnRef.Color.RGBA;
        }
        else
        {
            _calculated_line = new CLn();
        }

        _calculated_line.merge(this.spPr.ln);

        if(_calculated_line.Fill!=null)
        {
            _calculated_line.Fill.calculate(_theme, colorMap, RGBA) ;
        }

        this.pen = _calculated_line;
    },

    draw: function(graphics)
    {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform, false);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape(this, graphics);
        shape_drawer.draw(this.spPr.geometry);
        graphics.reset();
        graphics.SetIntegerGrid(true);
    },

    getTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
            this.recalculateTransform();
        return this.transform;
    },

    getInvertTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
            this.recalculateTransform();
        return this.invertTransform;
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
            return this.flipH;
        else
            return this.group.getFullFlipH() ? !this.flipH : this.flipH;
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

    hitToAdjustment: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.recalculateGeometry.hitToAdj(t_x, t_y, /*TODO*/ 5);
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

        var rotate_distance = 5;/*TODO*/
        dist_y = t_y - rotate_distance;
        sqr_y = dist_y*dist_y;
        dist_x = t_x - hc;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 8;

        return -1;

    },

    hit: function(x, y)
    {
        return this.hitInInnerArea(x, y) || this.hitInPath(x, y) || this.hitInTextRect(x, y);
    },

    hitInPath: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitInPath({}, x_t, y_t);
        return false;
    },

    hitInInnerArea: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitInInnerArea({}, x_t, y_t);
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
    },

    hitInTextRect: function(x, y)
    {
        return false;
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
    }

};