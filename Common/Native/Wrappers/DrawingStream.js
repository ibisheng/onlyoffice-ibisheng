function CDrawingStream()
{
    this.Native = null;

    this.m_oTextPr      = null;
    this.m_oLastFont    = new CFontSetup();

    this.IsUseFonts2    = false;
    this.m_oLastFont2   = null;

    this.m_bIntegerGrid = true;
}

CDrawingStream.prototype =
{
    EndDraw : function()
    {
        // not used
    },

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
        this.Native["PD_FreeFont"]();
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
        return this.m_oCurFont;
    },
    font : function(font_id,font_size)
    {
        this.Native["PD_font"](font_id, font_size);
    },
    SetFont : function(font)
    {
        if (null == font)
            return;

        this.m_oCurFont =
        {
            FontFamily :
            {
                Index : font.FontFamily.Index,
                Name  : font.FontFamily.Name
            },

            FontSize : font.FontSize,
            Bold     : font.Bold,
            Italic   : font.Italic
        };

        if (-1 == font.FontFamily.Index || undefined === font.FontFamily.Index || null == font.FontFamily.Index)
            font.FontFamily.Index = window.g_map_font_index[font.FontFamily.Name];

        if (font.FontFamily.Index == undefined || font.FontFamily.Index == -1)
            return;

        var bItalic = true === font.Italic;
        var bBold   = true === font.Bold;

        var oFontStyle = FontStyle.FontStyleRegular;
        if ( !bItalic && bBold )
            oFontStyle = FontStyle.FontStyleBold;
        else if ( bItalic && !bBold )
            oFontStyle = FontStyle.FontStyleItalic;
        else if ( bItalic && bBold )
            oFontStyle = FontStyle.FontStyleBoldItalic;

        var _info = GetLoadInfoForMeasurer(window.g_font_infos[font.FontFamily.Index], oFontStyle);
        var flag = 0;
        if (_info.NeedBold)     flag |= 0x01;
        if (_info.NeedItalic)   flag |= 0x02;
        if (_info.SrcBold)      flag |= 0x04;
        if (_info.SrcItalic)    flag |= 0x08;

        this.Native["PD_LoadFont"](_info.Path, _info.FaceIndex, font.FontSize, flag);
    },

    SetTextPr : function(textPr)
    {
        this.m_oTextPr = textPr;
    },
    GetTextPr : function()
    {
        return this.m_oTextPr;
    },

    SetFontSlot : function(slot, fontSizeKoef)
    {
        var _rfonts = this.m_oTextPr.RFonts;
        var _lastFont = this.IsUseFonts2 ? this.m_oLastFont2 : this.m_oLastFont;

        switch (slot)
        {
            case fontslot_ASCII:
            {
                _lastFont.Name   = _rfonts.Ascii.Name;
                _lastFont.Index  = _rfonts.Ascii.Index;

                if (_lastFont.Index == -1 || _lastFont.Index === undefined)
                {
                    _lastFont.Index = window.g_map_font_index[_lastFont.Name];
                }

                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
            case fontslot_CS:
            {
                _lastFont.Name   = _rfonts.CS.Name;
                _lastFont.Index  = _rfonts.CS.Index;

                if (_lastFont.Index == -1 || _lastFont.Index === undefined)
                {
                    _lastFont.Index = window.g_map_font_index[_lastFont.Name];
                }

                _lastFont.Size = this.m_oTextPr.FontSizeCS;
                _lastFont.Bold = this.m_oTextPr.BoldCS;
                _lastFont.Italic = this.m_oTextPr.ItalicCS;

                break;
            }
            case fontslot_EastAsia:
            {
                _lastFont.Name   = _rfonts.EastAsia.Name;
                _lastFont.Index  = _rfonts.EastAsia.Index;

                if (_lastFont.Index == -1 || _lastFont.Index === undefined)
                {
                    _lastFont.Index = window.g_map_font_index[_lastFont.Name];
                }

                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
            case fontslot_HAnsi:
            default:
            {
                _lastFont.Name   = _rfonts.HAnsi.Name;
                _lastFont.Index  = _rfonts.HAnsi.Index;

                if (_lastFont.Index == -1 || _lastFont.Index === undefined)
                {
                    _lastFont.Index = window.g_map_font_index[_lastFont.Name];
                }

                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
        }

        if (undefined !== fontSizeKoef)
            _lastFont.Size *= fontSizeKoef;

        var _style = 0;
        if (_lastFont.Italic)
            _style += 2;
        if (_lastFont.Bold)
            _style += 1;

        if (_lastFont.Index != _lastFont.SetUpIndex || _lastFont.Size != _lastFont.SetUpSize || _style != _lastFont.SetUpStyle)
        {
            _lastFont.SetUpIndex = _lastFont.Index;
            _lastFont.SetUpSize = _lastFont.Size;
            _lastFont.SetUpStyle = _style;

            var _info = GetLoadInfoForMeasurer(window.g_font_infos[_lastFont.SetUpIndex], _style);
            var flag = 0;
            if (_info.NeedBold)     flag |= 0x01;
            if (_info.NeedItalic)   flag |= 0x02;
            if (_info.SrcBold)      flag |= 0x04;
            if (_info.SrcItalic)    flag |= 0x08;

            this.Native["PD_LoadFont"](_info.Path, _info.FaceIndex, _lastFont.SetUpSize, flag);
        }
    },

    FillText : function(x,y,text)
    {
        this.Native["PD_FillText"](x,y,text.charCodeAt(0));
    },
    t : function(text,x,y)
    {
        var _arr = [];
        var _len = text.length;
        for (var i = 0; i < _len; i++)
            _arr.push(text.charCodeAt(i));
        this.Native["PD_Text"](x,y,_arr);
    },
    FillText2 : function(x,y,text,cropX,cropW)
    {
        this.Native["PD_FillText2"](x,y,text.charCodeAt(0),cropX,cropW);
    },
    t2 : function(text,x,y,cropX,cropW)
    {
        var _arr = [];
        var _len = text.length;
        for (var i = 0; i < _len; i++)
            _arr.push(text.charCodeAt(i));
        this.Native["PD_Text2"](x,y,_arr,cropX,cropW);
    },
    FillTextCode : function(x,y,lUnicode)
    {
        this.Native["PD_FillText"](x,y,lUnicode);
    },

    tg : function(text,x,y)
    {
        this.Native["PD_FillTextG"](x,y,text);
    },
    charspace : function(space)
    {
        // nothing
    },

    SetIntegerGrid : function(param)
    {
        this.m_bIntegerGrid = param;
        this.Native["PD_SetIntegerGrid"](param);
    },
    GetIntegerGrid : function()
    {
        return this.m_bIntegerGrid;
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

    drawFlowAnchor : function(x, y)
    {
        this.Native["PD_drawFlowAnchor"](x, y);
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

    },

    DrawPresentationComment : function(type, x, y, w, h)
    {
        return this.Native["PD_DrawPresentationComment"](type, x, y, w, h);
    }
};