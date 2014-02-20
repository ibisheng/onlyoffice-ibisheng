function CAutoshapeTrack()
{
    this.IsTrack = true;

    this.PageIndex = -1;
    this.CurrentPageInfo = null;

    this.Native = window.native;
}

CAutoshapeTrack.prototype =
{
    SetFont : function(font)
    {
    },

    SetCurrentPage : function(nPageIndex)
    {
        if (nPageIndex == this.PageIndex)
            return;

        this.Native["AST_SetCurrentPage"]();
    },

    /*************************************************************************/
    /******************************** TRACKS *********************************/
    /*************************************************************************/
    DrawTrack : function(type, matrix, left, top, width, height, isLine, isCanRotate)
    {
        if (!matrix)
            this.Native["AST_DrawTrackTransform"]();
        else
            this.Native["AST_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["AST_DrawTrack"](type, matrix, left, top, width, height, isLine, isCanRotate);
    },

    DrawTrackSelectShapes : function(x, y, w, h)
    {
        this.Native["AST_DrawTrackSelectShapes"](x, y, w, h);
    },

    DrawAdjustment : function(matrix, x, y)
    {
        if (!matrix)
            this.Native["AST_DrawTrackTransform"]();
        else
            this.Native["AST_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["AST_DrawAdjustment"](x, y);
    },

    DrawEditWrapPointsPolygon : function(points, matrix)
    {
        // TODO:
    },

    DrawEditWrapPointsTrackLines : function(points, matrix)
    {
        // TODO:
    },

    DrawInlineMoveCursor : function(x, y, h, matrix)
    {
        // TODO:
    },

    drawFlowAnchor : function(x, y)
    {
        this.Native["AST_drawFlowAnchor"](x, y);
    },

    DrawPresentationComment : function(type, x, y, w, h)
    {
        this.Native["AST_DrawPresentationComment"](type, x, y, w, h);
    }
};