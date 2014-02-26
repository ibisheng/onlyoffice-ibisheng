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
    init2 : function()
    {
    },
    
    CorrectOverlayBounds : function()
    {
        this.Native["DD_CorrectOverlayBounds"]();
    },

    SetCurrentPage : function(nPageIndex)
    {
        if (nPageIndex == this.PageIndex)
            return;

        this.Native["DD_SetCurrentPage"](nPageIndex);
    },
    
    transform3 : function(m)
    {
        this.Native["PD_transform3"](m.sx,m.shy,m.shx,m.sy,m.tx,m.ty);
    },
    
    reset : function()
    {
        this.Native["PD_reset"]();
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

        this.Native["DD_DrawTrack"](type, left, top, width, height, isLine, isCanRotate);
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
        this.Native["PD_drawFlowAnchor"](x, y);
    },

    DrawPresentationComment : function(type, x, y, w, h)
    {
        this.Native["PD_DrawPresentationComment"](type, x, y, w, h);
    }
};