/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 6:24 PM
 * To change this template use File | Settings | File Templates.
 */
function CImage(drawingBase)
{
    this.drawingBase = drawingBase;

    this.blipFill = new CBlipFill();
    this.spPr = new CSpPr();
    this.nvSpPr = null;
    this.style = null;

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
    this.cursorTypes = [];

    this.brush  = null;
    this.pen = null;

    this.selected = false;
}

CImage.prototype =
{

};