/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/27/13
 * Time: 4:35 PM
 * To change this template use File | Settings | File Templates.
 */
function ResizeTrackShapeImage(originalObject, cardDirection)
{
    this.originalObject = originalObject;
    this.cardDirection = cardDirection;

    this.transform = new CMatrix();
    this.x = originalObject.x;
    this.y = originalObject.y;
    this.extX = originalObject.extX;
    this.extY = originalObject.extY;
    this.flipH = originalObject.flipH;
    this.flipV = originalObject.flipV;
    this.geometry = originalObject.spPr.geometry.createDuplicate();
    this.overlayObject = new OverlayObject(this.geometry, this.extX, this.extY, originalObject.brush, originalObject.pen, this.transform);

    this.track = function(kd1, kd2, e)
    {
        //TODO
    };

    this.draw = function(overlay)
    {
        this.overlayObject.draw(overlay);
    };

    this.trackEnd = function()
    {
        this.originalObject.setPosition(this.x, this.y);
        this.originalObject.setExtents(this.extX, this.extY);
        this.originalObject.setFlips(this.flipH, this.flipV);
    }
}