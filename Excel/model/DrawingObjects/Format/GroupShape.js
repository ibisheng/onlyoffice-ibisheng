/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/27/13
 * Time: 12:06 PM
 * To change this template use File | Settings | File Templates.
 */
function CGroupShape(drawingBase)
{
    this.drawingBase = drawingBase;

    this.nvSpPr = null;
    this.spPr = new CSpPr();

    this.spTree = [];
    this.arrGraphicObjects = [];
    this.selectedObjects = [];

    this.group = null;

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
    setGroup: function(group)
    {
        this.group = group;
    },

    getMainGroup: function()
    {
        if(!isRealObject(this.group))
            return this;
        return this.group.getMainGroup();
    }
};