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
    this.transform = null;
    this.invertTransform = null;
    this.transformText = null;
    this.invertTransformText = null;
    this.cursorTypes = [];

    this.brush  = null;
    this.pen = null;

    this.selected = false;

}

CGroupShape.prototypr =
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
            return this.flipH;
        else
            return this.group.getFullFlipH() ? !this.flipH : this.flipH;
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
                    this.arrGraphicObjects.push(arr_graphic_objects[i]);
            }
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

        var _hit_context = this.drawingDocument.CanvasHitContext;

        return (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) ||
            HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY)||
            HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY)||
            HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0) ||
            HitInLine(_hit_context, x_t, y_t, this.extX*0.5, 0, this.extX*0.5, -this.drawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE)));
    },

    drawAdjustments: function(drawingDocument)
    {
    }
};