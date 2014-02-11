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
        this.Native["put_GlobalAlpha"](enable, alpha);
    },
    Start_GlobalAlpha : function()
    {
        // nothing
    },
    End_GlobalAlpha : function()
    {
        this.Native["End_GlobalAlpha"]();
    },
    // pen methods
    p_color : function(r,g,b,a)
    {
        this.Native["p_color"](r,g,b,a);
    },
    p_width : function(w)
    {
        this.Native["p_width"](w);
    },
    // brush methods
    b_color1 : function(r,g,b,a)
    {
        this.Native["b_color1"](r,g,b,a);
    },
    b_color2 : function(r,g,b,a)
    {
        this.Native["b_color2"](r,g,b,a);
    },

    transform : function(sx,shy,shx,sy,tx,ty)
    {
        this.Native["transform"](sx,shy,shx,sy,tx,ty);
    },
    CalculateFullTransform : function(isInvertNeed)
    {
        this.Native["CalculateFullTransform"](isInvertNeed);
    },
    // path commands
    _s : function()
    {
        this.Native["_s"]();
    },
    _e : function()
    {
        this.Native["_e"]();
    },
    _z : function()
    {
        this.Native["_z"]();
    },
    _m : function(x,y)
    {
        this.Native["_m"](x,y);
    },
    _l : function(x,y)
    {
        this.Native["_l"](x,y);
    },
    _c : function(x1,y1,x2,y2,x3,y3)
    {
        this.Native["_c"](x1,y1,x2,y2,x3,y3);
    },
    _c2 : function(x1,y1,x2,y2)
    {
        this.Native["_c2"](x1,y1,x2,y2);
    },
    ds : function()
    {
        this.Native["ds"]();
    },
    df : function()
    {
        this.Native["df"]();
    },

    // canvas state
    save : function()
    {
        this.Native["save"]();
    },
    restore : function()
    {
        this.Native["restore"]();
    },
    clip : function()
    {
        this.Native["clip"]();
    },

    reset : function()
    {
        this.Native["reset"]();
    },

    transform3 : function(m, isNeedInvert)
    {
        this.Native["transform3"](m.sx,m.shy,m.shx,m.sy,m.tx,m.ty,isNeedInvert);
    },

    FreeFont : function()
    {
        this.Native["FreeFont"]();
    },

    // images
    drawImage : function(img,x,y,w,h,alpha,srcRect)
    {
        if (!srcRect)
            return this.Native["drawImage"](img,x,y,w,h,alpha);

        return this.Native["drawImage"](img,x,y,w,h,alpha,srcRect.l,srcRect.t,srcRect.r,srcRect.b);
    },

    // text
    GetFont : function()
    {
        return this.m_oCurFont;
    },
    font : function(font_id,font_size)
    {
        this.Native["font"](font_id, font_size);
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

        this.Native["LoadFont"](_info.Path, _info.FaceIndex, font.FontSize, flag);
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

            var _info = GetLoadInfoForMeasurer(window.g_font_infos[_lastFont.SetUpIndexx], _style);
            var flag = 0;
            if (_info.NeedBold)     flag |= 0x01;
            if (_info.NeedItalic)   flag |= 0x02;
            if (_info.SrcBold)      flag |= 0x04;
            if (_info.SrcItalic)    flag |= 0x08;

            this.Native["LoadFont"](_info.Path, _info.FaceIndex, font.FontSize, flag);
        }
    },

    FillText : function(x,y,text)
    {
        this.Native["FillText"](x,y,text.charCodeAt(0));
    },
    t : function(text,x,y)
    {
        var _arr = [];
        var _len = text.length;
        for (var i = 0; i < _len; i++)
            _arr.push(text.charCodeAt(i));
        this.Native["Text"](x,y,_arr);
    },
    FillText2 : function(x,y,text,cropX,cropW)
    {
        this.Native["FillText2"](x,y,text.charCodeAt(0),cropX,cropW);
    },
    t2 : function(text,x,y,cropX,cropW)
    {
        var _arr = [];
        var _len = text.length;
        for (var i = 0; i < _len; i++)
            _arr.push(text.charCodeAt(i));
        this.Native["Text2"](x,y,_arr,cropX,cropW);
    },
    FillTextCode : function(x,y,lUnicode)
    {
        this.Native["FillText"](x,y,lUnicode);
    },

    tg : function(text,x,y)
    {
        this.Native["FillTextG"](x,y,text);
    },
    charspace : function(space)
    {
        // nothing
    },

    SetIntegerGrid : function(param)
    {
        this.m_bIntegerGrid = param;
        this.Native["SetIntegerGrid"](param);
    },
    GetIntegerGrid : function()
    {
        return this.m_bIntegerGrid;
    },

    DrawHeaderEdit : function(yPos, lock_type)
    {
        this.Native["DrawHeaderEdit"](yPos, lock_type);
    },

    DrawFooterEdit : function(yPos, lock_type)
    {
        this.Native["DrawFooterEdit"](yPos, lock_type);
    },

    DrawLockParagraph : function(lock_type, x, y1, y2)
    {
        this.Native["DrawLockParagraph"](lock_type, x, y1, y2);
    },

    DrawLockObjectRect : function(lock_type, x, y, w, h)
    {
        this.Native["DrawLockObjectRect"](lock_type, x, y, w, h);
    },

    DrawEmptyTableLine : function(x1,y1,x2,y2)
    {
        this.Native["DrawEmptyTableLine"](x1,y1,x2,y2);
    },

    DrawSpellingLine : function(y0, x0, x1, w)
    {
        this.Native["DrawSpellingLine"](y0, x0, x1, w);
    },

    // smart methods for horizontal / vertical lines
    drawHorLine : function(align, y, x, r, penW)
    {
        this.Native["drawHorLine"](align, y, x, r, penW);
    },
    drawHorLine2 : function(align, y, x, r, penW)
    {
        this.Native["drawHorLine2"](align, y, x, r, penW);
    },
    drawVerLine : function(align, x, y, b, penW)
    {
        this.Native["drawVerLine"](align, x, y, b, penW);
    },

    // мега крутые функции для таблиц
    drawHorLineExt : function(align, y, x, r, penW, leftMW, rightMW)
    {
        this.Native["drawHorLineExt"](align, y, x, r, penW, leftMW, rightMW);
    },

    rect : function(x,y,w,h)
    {
        this.Native["rect"](x,y,w,h);
    },

    TableRect : function(x,y,w,h)
    {
        this.Native["TableRect"](x,y,w,h);
    },

    // функции клиппирования
    AddClipRect : function(x, y, w, h)
    {
        this.Native["AddClipRect"](x,y,w,h);
    },
    RemoveClipRect : function()
    {
        // nothing
    },

    SetClip : function(r)
    {
        this.Native["SetClip"](r.x, r.y, r.w, r.h);
    },

    RemoveClip : function()
    {
        this.Native["RemoveClip"]();
    },

    drawCollaborativeChanges : function(x, y, w, h)
    {
        this.Native["drawCollaborativeChanges"](x, y, w, h);
    },

    drawSearchResult : function(x, y, w, h)
    {
        this.Native["drawSearchResult"](x, y, w, h);
    },

    drawFlowAnchor : function(x, y)
    {
        this.Native["drawFlowAnchor"](x, y);
    },

    SavePen : function()
    {
        this.Native["SavePen"]();
    },
    RestorePen : function()
    {
        this.Native["RestorePen"]();
    },

    SaveBrush : function()
    {
        this.Native["SaveBrush"]();
    },
    RestoreBrush : function()
    {
        this.Native["RestoreBrush"]();
    },

    SavePenBrush : function()
    {
        this.Native["SavePenBrush"]();
    },
    RestorePenBrush : function()
    {
        this.Native["RestorePenBrush"]();
    },

    SaveGrState : function()
    {
        this.Native["SaveGrState"]();
    },
    RestoreGrState : function()
    {
        this.Native["RestoreGrState"]();
    },

    StartClipPath : function()
    {
        // nothing
    },

    EndClipPath : function()
    {
        this.Native["Clip"]();
    },

    StartCheckTableDraw : function()
    {
        return this.Native["StartCheckTableDraw"]();
    },

    EndCheckTableDraw : function(bIsRestore)
    {
        return this.Native["EndCheckTableDraw"](bIsRestore);
    },

    SetTextClipRect : function(_l, _t, _r, _b)
    {
        return this.Native["SetTextClipRect"](_l, _t, _r, _b);
    },

    AddSmartRect : function(x, y, w, h, pen_w)
    {
        return this.Native["SetTextClipRect"](x, y, w, h, pen_w);
    },

    CheckUseFonts2 : function(m)
    {
        this.IsUseFonts2 = this.Native["CheckUseFonts2"](m.sx,m.shy,m.shx,m.sy,m.tx,m.ty);
        if (this.IsUseFonts2)
        {
            if (null == this.m_oLastFont2)
                this.m_oLastFont2 = new CFontSetup();
        }
    },

    UncheckUseFonts2 : function()
    {
        this.IsUseFonts2 = false;
    },

    Drawing_StartCheckBounds : function(x, y, w, h)
    {

    },

    Drawing_EndCheckBounds : function()
    {

    },

    DrawPresentationComment : function(type, x, y, w, h)
    {
        return this.Native["DrawPresentationComment"](type, x, y, w, h);
    }
};