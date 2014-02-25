function CAutoshapeTrack()
{
    this.IsTrack            = true;

    this.PageIndex          = -1;
    this.CurrentPageInfo    = null;

    this.Native = window.native["CreateAutoShapesTrackControl"]();
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

        this.Native["DD_SetCurrentPage"](nPageIndex);
    },

    /*************************************************************************/
    /******************************** TRACKS *********************************/
    /*************************************************************************/
    DrawTrack : function(type, matrix, left, top, width, height, isLine, isCanRotate)
    {
        if (!matrix)
            this.Native["DD_DrawTrackTransform"]();
        else
            this.Native["DD_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["DD_DrawTrack"](type, matrix, left, top, width, height, isLine, isCanRotate);
    },

    DrawTrackSelectShapes : function(x, y, w, h)
    {
        this.Native["DD_DrawTrackSelectShapes"](x, y, w, h);
    },

    DrawAdjustment : function(matrix, x, y)
    {
        if (!matrix)
            this.Native["DD_DrawTrackTransform"]();
        else
            this.Native["DD_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["DD_DrawAdjustment"](x, y);
    },

    DrawEditWrapPointsPolygon : function(points, matrix)
    {
        if (!matrix)
            this.Native["DD_DrawTrackTransform"]();
        else
            this.Native["DD_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["DD_DrawEditWrapPointsPolygon"](points);
    },

    DrawEditWrapPointsTrackLines : function(points, matrix)
    {
        if (!matrix)
            this.Native["DD_DrawTrackTransform"]();
        else
            this.Native["DD_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["DD_DrawEditWrapPointsTrackLines"](points);
    },

    DrawInlineMoveCursor : function(x, y, h, matrix)
    {
        if (!matrix)
            this.Native["DD_DrawTrackTransform"]();
        else
            this.Native["DD_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["DD_DrawInlineMoveCursor"](x, y, h);
    },

    drawFlowAnchor : function(x, y)
    {
        this.Native["DD_drawFlowAnchor"](x, y);
    },

    DrawPresentationComment : function(type, x, y, w, h)
    {
        this.Native["DD_DrawPresentationComment"](type, x, y, w, h);
    }
};