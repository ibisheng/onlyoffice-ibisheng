function CAutoshapeTrack()
{
    this.IsTrack            = true;

    this.PageIndex          = -1;
    this.CurrentPageInfo    = null;

    this.Native = window["native"]["CreateAutoShapesTrackControl"]();
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
        //if (nPageIndex == this.PageIndex)
        //    return;

        this.PageIndex = nPageIndex;
        this.Native["DD_SetCurrentPage"](nPageIndex);
    },
    
    SetPageIndexSimple : function(nPageIndex)
    {
        this.Native["DD_SetPageIndexSimple"](nPageIndex);
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

    DrawInlineMoveCursor : function(x, y, h, m)
    {
        if (!m)
        {
            this.Native["DD_DrawInlineMoveCursor"](this.PageIndex, x, y, h);
        }
        else
        {
            this.Native["DD_DrawInlineMoveCursor"](this.PageIndex, x, y, h, m.sx, m.shy, m.shx, m.sy, m.tx, m.ty);
        }
    },

    drawFlowAnchor : function(x, y)
    {
        this.Native["PD_drawFlowAnchor"](x, y);
    },

    DrawPresentationComment : function(type, x, y, w, h)
    {
        this.Native["PD_DrawPresentationComment"](type, x, y, w, h);
    },
    
    // repeat drawing interface
    put_GlobalAlpha : function(enable, alpha)
    {
        this.Native["PD_put_GlobalAlpha"](enable, alpha);
    },
    Start_GlobalAlpha : function()
    {
        // nothing
    },
    End_GlobalAlpha : function()
    {
        this.Native["PD_End_GlobalAlpha"]();
    },
    // pen methods
    p_color : function(r,g,b,a)
    {
        this.Native["PD_p_color"](r,g,b,a);
    },
    p_width : function(w)
    {
        this.Native["PD_p_width"](w);
    },
    // brush methods
    b_color1 : function(r,g,b,a)
    {
        this.Native["PD_b_color1"](r,g,b,a);
    },
    b_color2 : function(r,g,b,a)
    {
        this.Native["PD_b_color2"](r,g,b,a);
    },

    transform : function(sx,shy,shx,sy,tx,ty)
    {
        this.Native["PD_transform"](sx,shy,shx,sy,tx,ty);
    },
    // path commands
    _s : function()
    {
        this.Native["PD_PathStart"]();
    },
    _e : function()
    {
        this.Native["PD_PathEnd"]();
    },
    _z : function()
    {
        this.Native["PD_PathClose"]();
    },
    _m : function(x,y)
    {
        this.Native["PD_PathMoveTo"](x,y);
    },
    _l : function(x,y)
    {
        this.Native["PD_PathLineTo"](x,y);
    },
    _c : function(x1,y1,x2,y2,x3,y3)
    {
        this.Native["PD_PathCurveTo"](x1,y1,x2,y2,x3,y3);
    },
    _c2 : function(x1,y1,x2,y2)
    {
        this.Native["PD_PathCurveTo2"](x1,y1,x2,y2);
    },
    ds : function()
    {
        this.Native["PD_Stroke"]();
    },
    df : function()
    {
        this.Native["PD_Fill"]();
    },

    // canvas state
    save : function()
    {
        this.Native["PD_Save"]();
    },
    restore : function()
    {
        this.Native["PD_Restore"]();
    },
    clip : function()
    {
        this.Native["PD_clip"]();
    },

    reset : function()
    {
        this.Native["PD_reset"]();
    },

    transform3 : function(m, isNeedInvert)
    {
        this.Native["PD_transform3"](m.sx,m.shy,m.shx,m.sy,m.tx,m.ty,isNeedInvert);
    },

    FreeFont : function()
    {
    },

    // images
    drawImage : function(img,x,y,w,h,alpha,srcRect)
    {
        if (!srcRect)
            return this.Native["PD_drawImage"](img,x,y,w,h,alpha);

        return this.Native["PD_drawImage"](img,x,y,w,h,alpha,srcRect.l,srcRect.t,srcRect.r,srcRect.b);
    },

    // text
    GetFont : function()
    {
    },
    font : function(font_id,font_size)
    {
    },
    SetFont : function(font)
    {
    },

    SetTextPr : function(textPr, theme)
    {
    },
    GetTextPr : function()
    {
    },

    SetFontSlot : function(slot, fontSizeKoef)
    {
    },

    FillText : function(x,y,text)
    {
    },
    t : function(text,x,y)
    {
    },
    FillText2 : function(x,y,text,cropX,cropW)
    {
    },
    t2 : function(text,x,y,cropX,cropW)
    {
    },
    FillTextCode : function(x,y,lUnicode)
    {
    },
    tg : function(text,x,y)
    {
    },
    charspace : function(space)
    {
    },

    SetIntegerGrid : function(param)
    {
        //this.Native["PD_SetIntegerGrid"](param);
    },
    GetIntegerGrid : function()
    {
        //return this.m_bIntegerGrid;
        return false;
    },

    DrawHeaderEdit : function(yPos, lock_type)
    {
        this.Native["PD_DrawHeaderEdit"](yPos, lock_type);
    },

    DrawFooterEdit : function(yPos, lock_type)
    {
        this.Native["PD_DrawFooterEdit"](yPos, lock_type);
    },

    DrawLockParagraph : function(lock_type, x, y1, y2)
    {
        this.Native["PD_DrawLockParagraph"](lock_type, x, y1, y2);
    },

    DrawLockObjectRect : function(lock_type, x, y, w, h)
    {
        this.Native["PD_DrawLockObjectRect"](lock_type, x, y, w, h);
    },

    DrawEmptyTableLine : function(x1,y1,x2,y2)
    {
        this.Native["PD_DrawEmptyTableLine"](x1,y1,x2,y2);
    },

    DrawSpellingLine : function(y0, x0, x1, w)
    {
        this.Native["PD_DrawSpellingLine"](y0, x0, x1, w);
    },

    // smart methods for horizontal / vertical lines
    drawHorLine : function(align, y, x, r, penW)
    {
        this.Native["PD_drawHorLine"](align, y, x, r, penW);
    },
    drawHorLine2 : function(align, y, x, r, penW)
    {
        this.Native["PD_drawHorLine2"](align, y, x, r, penW);
    },
    drawVerLine : function(align, x, y, b, penW)
    {
        this.Native["PD_drawVerLine"](align, x, y, b, penW);
    },

    // мега крутые функции для таблиц
    drawHorLineExt : function(align, y, x, r, penW, leftMW, rightMW)
    {
        this.Native["PD_drawHorLineExt"](align, y, x, r, penW, leftMW, rightMW);
    },

    rect : function(x,y,w,h)
    {
        this.Native["PD_rect"](x,y,w,h);
    },

    TableRect : function(x,y,w,h)
    {
        this.Native["PD_TableRect"](x,y,w,h);
    },

    // функции клиппирования
    AddClipRect : function(x, y, w, h)
    {
        this.Native["PD_AddClipRect"](x,y,w,h);
    },
    RemoveClipRect : function()
    {
        // nothing
    },

    SetClip : function(r)
    {
        this.Native["PD_SetClip"](r.x, r.y, r.w, r.h);
    },

    RemoveClip : function()
    {
        this.Native["PD_RemoveClip"]();
    },

    drawCollaborativeChanges : function(x, y, w, h)
    {
        this.Native["PD_drawCollaborativeChanges"](x, y, w, h);
    },

    drawSearchResult : function(x, y, w, h)
    {
        this.Native["PD_drawSearchResult"](x, y, w, h);
    },

    SavePen : function()
    {
        this.Native["PD_SavePen"]();
    },
    RestorePen : function()
    {
        this.Native["PD_RestorePen"]();
    },

    SaveBrush : function()
    {
        this.Native["PD_SaveBrush"]();
    },
    RestoreBrush : function()
    {
        this.Native["PD_RestoreBrush"]();
    },

    SavePenBrush : function()
    {
        this.Native["PD_SavePenBrush"]();
    },
    RestorePenBrush : function()
    {
        this.Native["PD_RestorePenBrush"]();
    },

    SaveGrState : function()
    {
        this.Native["PD_SaveGrState"]();
    },
    RestoreGrState : function()
    {
        this.Native["PD_RestoreGrState"]();
    },

    StartClipPath : function()
    {
        this.Native["PD_StartClipPath"]();
    },

    EndClipPath : function()
    {
        this.Native["PD_EndClipPath"]();
    },

    StartCheckTableDraw : function()
    {
        return this.Native["PD_StartCheckTableDraw"]();
    },

    EndCheckTableDraw : function(bIsRestore)
    {
        return this.Native["PD_EndCheckTableDraw"](bIsRestore);
    },

    SetTextClipRect : function(_l, _t, _r, _b)
    {
        return this.Native["PD_SetTextClipRect"](_l, _t, _r, _b);
    },

    AddSmartRect : function(x, y, w, h, pen_w)
    {
        return this.Native["PD_AddSmartRect"](x, y, w, h, pen_w);
    },

    Drawing_StartCheckBounds : function(x, y, w, h)
    {

    },

    Drawing_EndCheckBounds : function()
    {

    }
};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommon'] = window['AscCommon'] || {};
window['AscCommon'].CAutoshapeTrack = CAutoshapeTrack;
