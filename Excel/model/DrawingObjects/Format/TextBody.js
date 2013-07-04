/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 7/4/13
 * Time: 5:25 PM
 * To change this template use File | Settings | File Templates.
 */
function CTxBody(shape)
{
    this.shape = shape;

    this.bodyPr = new CBodyPr();
    this.lstStyle = null;

    this.content = new CDocumentContent(this, editor.WordControl.m_oLogicDocument.DrawingDocument, 0, 0, 0, 20000, false, false);

}
CTxBody.prototype =
{
    recalculate: function()
    {

    },
    draw: function(graphics)
    {
        this.content.Draw(graphics);
    },

    Get_Styles: function(level)
    {
        return this.shape.Get_Styles(level);
    },

    paragraphAdd: function()
    {}
};