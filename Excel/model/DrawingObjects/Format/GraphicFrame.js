
function CGraphicFrame(drawingBase, drawingObjects)
{
    this.drawingBase = drawingBase;
    this.drawingObjects = drawingObjects;

    this.obj = null;
    this.spPr = new CSpPr();

    this.transform = new CMatrix();

    this.group = null;
}

CGraphicFrame.prototype =
{
    recalculate: function()
    {},

    recalculateTransform: function()
    {
        var xfrm = this.spPr.xfrm;
        this.transform.Reset();
        global_MatrixTransformer.TranslateAppend(this.transform, xfrm.offX, xfrm.offY);
        if(isRealObject(this.group))
        {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransform());
        }
    },


    draw: function(graphics)
    {
        if(isRealObject(this.obj))
            this.obj.draw(graphics);
    }


}