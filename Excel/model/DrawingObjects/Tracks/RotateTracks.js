/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/27/13
 * Time: 3:29 PM
 * To change this template use File | Settings | File Templates.
 */



function OverlayObject(geometry, extX, extY, brush, pen, transform)
    //({check_bounds: function(){},brush: this.originalShape.brush, pen: this.originalShape.pen, ext:{cx:this.originalShape.absExtX, cy:this.originalShape.absExtY}, geometry: this.geometry, TransformMatrix: this.originalShape.transform})
{
    this.geometry = geometry;
    this.ext = {};
    this.ext.cx = extX;
    this.ext.cy = extY;
    this.brush = brush;
    this.pen = pen;
    this.TransformMatrix = transform;
    this.shapeDrawer = new CShapeDrawer();

    this.updateTransform = function(extX, extY, transform)
    {
        this.ext.cx = extX;
        this.ext.cy = extY;
        this.transform = transform;
    };

    this.updateExtents = function(extX, extY)
    {
        this.ext.cx = extX;
        this.ext.cy = extY;
        this.geometry.Recalculate(extX, extY);
    };

    this.updateTransformMatrix = function(transform)
    {
        this.TransformMatrix = transform;
    };


    this.draw = function(overlay)
    {
        overlay.SaveGrState();
        overlay.SetIntegerGrid(false);
        overlay.transform3(this.TransformMatrix, false);
        this.shapeDrawer.fromShape(this, overlay);
        this.shapeDrawer.draw(this.geometry);
        overlay.RestoreGrState();
    };

    this.check_bounds = function(boundsChecker)
    {
        if(this.geometry)
        {
            this.geometry.check_bounds(boundsChecker);
        }
        else
        {
            boundsChecker._s();
            boundsChecker._m(0, 0);
            boundsChecker._l(this.ext.cx, 0);
            boundsChecker._l(this.ext.cx, this.ext.cy);
            boundsChecker._l(0, this.ext.cy);
            boundsChecker._z();
            boundsChecker._e();
        }
    }
}

function RotateTrackShapeImage(originalObject)
{
    this.originalObject = originalObject;
    this.transform = new CMatrix();
    this.overlayObject = new OverlayObject(originalObject.spPr.geometry, originalObject.extX, originalObject.extY, originalObject.brush, originalObject.pen, this.transform);

    this.angle = originalObject.rot;

    this.draw = function(overlay)
    {
        this.overlayObject.draw(overlay);
    };

    this.track = function(angle, e)
    {
        var new_rot = angle + this.originalObject.rot;
        while(new_rot < 0)
            new_rot += 2*Math.PI;
        while(new_rot >= 2*Math.PI)
            new_rot -= 2*Math.PI;

        if(new_rot < MIN_ANGLE || new_rot > 2*Math.PI - MIN_ANGLE)
            new_rot = 0;

        if(Math.abs(new_rot-Math.PI*0.5) < MIN_ANGLE)
            new_rot = Math.PI*0.5;

        if(Math.abs(new_rot-Math.PI) < MIN_ANGLE)
            new_rot = Math.PI;

        if(Math.abs(new_rot-1.5*Math.PI) < MIN_ANGLE)
            new_rot = 1.5*Math.PI;

        if(e.shiftKey)
            new_rot = (Math.PI/12)*Math.floor(12*new_rot/(Math.PI));
        this.angle = new_rot;

        var hc, vc;
        hc = this.originalObject.extX*0.5;
        vc = this.originalObject.extY*0.5;
        this.transform.Reset();
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(this.originalObject.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(this.originalObject.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(this.transform, -this.angle);
        global_MatrixTransformer.TranslateAppend(this.transform, this.originalObject.x + hc, this.originalObject.y + vc);
    };

    this.trackEnd = function()
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.originalObject.Id, new UndoRedoDataShapeRecalc()), null);
        this.originalObject.setRotate(this.angle);
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.originalObject.Id, new UndoRedoDataShapeRecalc()), null);
        this.originalObject.recalculateTransform();
        this.originalObject.calculateContent();
        this.originalObject.calculateTransformTextMatrix();
    }
}

function RotateTrackShapeImageInGroup(originalObject)
{
    this.originalObject = originalObject;
    this.transform = new CMatrix();
    this.overlayObject = new OverlayObject(originalObject.spPr.geometry, originalObject.extX, originalObject.extY, originalObject.brush, originalObject.pen, this.transform);

    this.angle = originalObject.rot;
    var full_flip_h = this.originalObject.getFullFlipH();
    var full_flip_v = this.originalObject.getFullFlipV();
    this.signum = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v ? 1 : -1;
    this.draw = function(overlay)
    {
        this.overlayObject.draw(overlay);
    };

    this.track = function(angle, e)
    {
        var new_rot = this.signum*angle + this.originalObject.rot;
        while(new_rot < 0)
            new_rot += 2*Math.PI;
        while(new_rot >= 2*Math.PI)
            new_rot -= 2*Math.PI;

        if(new_rot < MIN_ANGLE || new_rot > 2*Math.PI - MIN_ANGLE)
            new_rot = 0;

        if(Math.abs(new_rot-Math.PI*0.5) < MIN_ANGLE)
            new_rot = Math.PI*0.5;

        if(Math.abs(new_rot-Math.PI) < MIN_ANGLE)
            new_rot = Math.PI;

        if(Math.abs(new_rot-1.5*Math.PI) < MIN_ANGLE)
            new_rot = 1.5*Math.PI;

        if(e.shiftKey)
            new_rot = (Math.PI/12)*Math.floor(12*new_rot/(Math.PI));
        this.angle = new_rot;

        var hc, vc;
        hc = this.originalObject.extX*0.5;
        vc = this.originalObject.extY*0.5;
        this.transform.Reset();
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(this.originalObject.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(this.originalObject.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(this.transform, -this.angle);
        global_MatrixTransformer.TranslateAppend(this.transform, this.originalObject.x + hc, this.originalObject.y + vc);
        global_MatrixTransformer.MultiplyAppend(this.transform, this.originalObject.group.getTransform());
    };

    this.trackEnd = function()
    {
        this.originalObject.setRotate(this.angle);
        this.originalObject.recalculateTransform();
        this.originalObject.calculateContent();
        this.originalObject.calculateTransformTextMatrix();
    }
}


function RotateTrackGroup(originalObject)
{
    this.originalObject = originalObject;
    this.transform = new CMatrix();

    this.overlayObjects = [];


    this.arrTransforms = [];
    this.arrTransforms2 = [];
    var arr_graphic_objects = originalObject.getArrGraphicObjects();
    var group_invert_transform = originalObject.getInvertTransform();
    for(var i = 0; i < arr_graphic_objects.length; ++i)
    {
        var gr_obj_transform_copy = arr_graphic_objects[i].getTransform().CreateDublicate();
        global_MatrixTransformer.MultiplyAppend(gr_obj_transform_copy, group_invert_transform);
        this.arrTransforms2[i] = gr_obj_transform_copy;
        this.overlayObjects[i] = new OverlayObject(arr_graphic_objects[i].spPr.geometry, arr_graphic_objects[i].extX, arr_graphic_objects[i].extY,
            arr_graphic_objects[i].brush,  arr_graphic_objects[i].pen, new CMatrix());
    }


    this.angle = originalObject.rot;

    this.draw = function(overlay)
    {
        for(var i = 0; i < this.overlayObjects.length; ++i)
        {
            this.overlayObjects[i].draw(overlay);
        }
    };

    this.track = function(angle, e)
    {
        var new_rot = angle + this.originalObject.rot;
        while(new_rot < 0)
            new_rot += 2*Math.PI;
        while(new_rot >= 2*Math.PI)
            new_rot -= 2*Math.PI;

        if(new_rot < MIN_ANGLE || new_rot > 2*Math.PI - MIN_ANGLE)
            new_rot = 0;

        if(Math.abs(new_rot-Math.PI*0.5) < MIN_ANGLE)
            new_rot = Math.PI*0.5;

        if(Math.abs(new_rot-Math.PI) < MIN_ANGLE)
            new_rot = Math.PI;

        if(Math.abs(new_rot-1.5*Math.PI) < MIN_ANGLE)
            new_rot = 1.5*Math.PI;

        if(e.shiftKey)
            new_rot = (Math.PI/12)*Math.floor(12*new_rot/(Math.PI));
        this.angle = new_rot;

        var hc, vc;
        hc = this.originalObject.extX*0.5;
        vc = this.originalObject.extY*0.5;
        this.transform.Reset();
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(this.originalObject.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(this.originalObject.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        global_MatrixTransformer.RotateRadAppend(this.transform, -this.angle);
        global_MatrixTransformer.TranslateAppend(this.transform, this.originalObject.x + hc, this.originalObject.y + vc);
        for(var i = 0; i < this.overlayObjects.length; ++i)
        {
            var new_transform = this.arrTransforms2[i].CreateDublicate();
            global_MatrixTransformer.MultiplyAppend(new_transform, this.transform);
            this.overlayObjects[i].updateTransformMatrix(new_transform);
        }
    };

    this.trackEnd = function()
    {
        this.originalObject.setRotate(this.angle);
        this.originalObject.recalculateTransform();
    }
}