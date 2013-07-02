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
    this.overlayObject = new OverlayObject(this.originalObject.spPr.geometry, this.originalObject.extX, this.originalObject.extY, this.originalObject.brush, this.originalObject.pen, this.transform);


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
    };

    this.draw = function(overlay)
    {
        this.overlayObject.draw(overlay);
    };

    this.trackEnd = function()
    {
        this.originalObject.setPosition(this.x, this.y);
        this.originalObject.recalculateTransform();
        this.originalObject.updateDrawingBaseCoordinates();
    };
}

function MoveShapeImageInGroupTrack(originalObject)
{
    this.originalObject = originalObject;
    this.transform = new CMatrix();
    this.x = null;
    this.y = null;
    this.overlayObject = new OverlayObject(this.originalObject.spPr.geometry, this.originalObject.extX, this.originalObject.extY, this.originalObject.brush, this.originalObject.pen, this.transform);


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
    };

    this.draw = function(overlay)
    {
        this.overlayObject.draw(overlay);
    };

    this.trackEnd = function()
    {
        this.originalObject.setPosition(this.x, this.y);
        this.originalObject.recalculateTransform();
        this.originalObject.updateDrawingBaseCoordinates();
    };
}