"use strict";

/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/28/13
 * Time: 4:14 PM
 * To change this template use File | Settings | File Templates.
 */

function MoveShapeImageTrack(originalObject)
{
    this.originalObject = originalObject;
    this.transform = new CMatrix();
    this.x = null;
    this.y = null;
	
	if(!originalObject.isChart())
	{
		this.brush = originalObject.brush;
		this.pen = originalObject.pen;
	}
	else
	{
		var pen_brush = CreatePenBrushForChartTrack();
		this.brush = pen_brush.brush;
		this.pen = pen_brush.pen;
	}
    this.overlayObject = new OverlayObject(this.originalObject.spPr.geometry, this.originalObject.extX, this.originalObject.extY, this.brush, this.pen, this.transform);


    this.getOriginalBoundsRect = function()
    {
        return this.originalObject.getRectBounds();
    };

    this.track = function(dx, dy)
    {
        var original = this.originalObject;
        this.x = original.x + dx;
        this.y = original.y + dy;
        this.transform.Reset();
        var hc = original.extX*0.5;
        var vc = original.extY*0.5;

        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(original.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(original.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(this.transform, -original.rot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
		if(this.originalObject.group)
		{
			global_MatrixTransformer.MultiplyAppend(this.transform, this.originalObject.group.transform);
		}
    };

    this.draw = function(overlay)
    {
        this.overlayObject.draw(overlay);
    };

    this.trackEnd = function()
    {
		var scale_coefficients, ch_off_x, ch_off_y;
		if(this.originalObject.group)
		{
			scale_coefficients = this.originalObject.group.getResultScaleCoefficients();
			ch_off_x = this.originalObject.group.spPr.xfrm.chOffX;
			ch_off_y = this.originalObject.group.spPr.xfrm.chOffY;
		}
		else
		{
			scale_coefficients = {cx: 1, cy: 1};
			ch_off_x = 0;
			ch_off_y = 0;
		}
		this.originalObject.spPr.xfrm.setOffX(this.x/scale_coefficients.cx + ch_off_x);
        this.originalObject.spPr.xfrm.setOffY(this.y/scale_coefficients.cy + ch_off_y);
    };
}

function MoveShapeImageTrackInGroup(originalObject)
{
    this.originalObject = originalObject;
    this.x = null;
    this.y = null;
    this.transform = new CMatrix();
	if(!originalObject.isChart())
	{
		this.brush = originalObject.brush;
		this.pen = originalObject.pen;
	}
	else
	{
		var pen_brush = CreatePenBrushForChartTrack();
		this.brush = pen_brush.brush;
		this.pen = pen_brush.pen;
	}
    this.overlayObject = new OverlayObject(this.originalObject.spPr.geometry, this.originalObject.extX, this.originalObject.extY, this.brush, this.pen, this.transform);
    this.inv = global_MatrixTransformer.Invert(originalObject.group.transform);
    this.inv.tx = 0;
    this.inv.ty = 0;
    this.draw = function(overlay)
    {
        this.overlayObject.draw(overlay);
    };

    this.track = function(dx, dy)
    {
        var dx_t = this.inv.TransformPointX(dx, dy);
        var dy_t = this.inv.TransformPointY(dx, dy);
        this.x = this.originalObject.x + dx_t;
        this.y = this.originalObject.y + dy_t;
        this.calculateTransform();
    };

    this.getOriginalBoundsRect = function()
    {
        return this.originalObject.getRectBounds();
    };

    this.calculateTransform = function()
    {
        var t = this.transform;
        t.Reset();
        global_MatrixTransformer.TranslateAppend(t, -this.originalObject.extX*0.5, -this.originalObject.extY*0.5);
        if(this.originalObject.flipH)
        {
            global_MatrixTransformer.ScaleAppend(t, -1, 1);
        }
        if(this.originalObject.flipV)
        {
            global_MatrixTransformer.ScaleAppend(t, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(t, -this.originalObject.rot);
        global_MatrixTransformer.TranslateAppend(t, this.x + this.originalObject.extX*0.5, this.y + this.originalObject.extY*0.5);
        global_MatrixTransformer.MultiplyAppend(t, this.originalObject.group.getTransformMatrix());
    };

    this.trackEnd = function()
    {
        var scale_scale_coefficients = this.originalObject.group.getResultScaleCoefficients();
        var xfrm = this.originalObject.group.spPr.xfrm;

        var shape_xfrm = this.originalObject.spPr.xfrm;
        shape_xfrm.setOffX(this.x/scale_scale_coefficients.cx + xfrm.chOffX);
        shape_xfrm.setOffY(this.y/scale_scale_coefficients.cy + xfrm.chOffY);
    }
}

function MoveGroupTrack(originalObject)
{
    this.x = null;
    this.y = null;
    this.originalObject = originalObject;
    this.transform = new CMatrix();

    this.overlayObjects = [];

    this.arrTransforms2 = [];
    var arr_graphic_objects = originalObject.getArrGraphicObjects();
    var group_invert_transform = originalObject.getInvertTransform();
    for(var i = 0; i < arr_graphic_objects.length; ++i)
    {
        var gr_obj_transform_copy = arr_graphic_objects[i].getTransformMatrix().CreateDublicate();
        global_MatrixTransformer.MultiplyAppend(gr_obj_transform_copy, group_invert_transform);
        this.arrTransforms2[i] = gr_obj_transform_copy;
        this.overlayObjects[i] = new OverlayObject(arr_graphic_objects[i].spPr.geometry, arr_graphic_objects[i].extX, arr_graphic_objects[i].extY,
            arr_graphic_objects[i].brush,  arr_graphic_objects[i].pen, new CMatrix());
    }


    this.getOriginalBoundsRect = function()
    {
        return this.originalObject.getRectBounds();
    };

    this.track = function(dx, dy)
    {
        var original = this.originalObject;
        this.x = original.x + dx;
        this.y = original.y + dy;
        this.transform.Reset();
        var hc = original.extX*0.5;
        var vc = original.extY*0.5;

        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(original.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(original.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(this.transform, -original.rot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);

        for(var i = 0; i < this.overlayObjects.length; ++i)
        {
            var new_transform = this.arrTransforms2[i].CreateDublicate();
            global_MatrixTransformer.MultiplyAppend(new_transform, this.transform);
            this.overlayObjects[i].updateTransformMatrix(new_transform);
        }
    };

    this.draw = function(overlay)
    {
        for(var i = 0; i < this.overlayObjects.length; ++i)
        {
            this.overlayObjects[i].draw(overlay);
        }
    };

    this.trackEnd = function()
    {
        var xfrm = this.originalObject.spPr.xfrm;
        xfrm.setOffX(this.x);
        xfrm.setOffY(this.y);
    };
}

function MoveComment(comment)
{
    this.comment = comment;
    this.x = comment.x;
    this.y = comment.y;

    this.getOriginalBoundsRect = function()
    {
    };

    this.track = function(dx, dy)
    {
        var original = this.comment;
        this.x = original.x + dx;
        this.y = original.y + dy;
    };

    this.draw = function(overlay)
    {

        var Flags = 0;
        Flags |= 1;
        if(this.comment.Data.m_aReplies.length > 0)
        {
            Flags |= 2;
        }
        var dd = editor.WordControl.m_oDrawingDocument;
        overlay.DrawPresentationComment(Flags, this.x, this.y, dd.GetCommentWidth(Flags), dd.GetCommentHeight(Flags))
    };

    this.trackEnd = function()
    {
        this.comment.setPosition(this.x, this.y);
    };
}

