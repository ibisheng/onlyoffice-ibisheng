function CTextMeasurerWrapper()
{
    this.Measurer = CreateNativeTextMeasurer();

    this.m_oFont        = null;

    // RFonts
    this.m_oTextPr      = null;
    this.m_oLastFont    = new CFontSetup();

    // font params
    this.Ascender       = 0;
    this.Descender      = 0;
    this.Height         = 0;
    this.UnitsPerEm     = 0;
}

CTextMeasurerWrapper.prototype =
{
    Init : function()
    {
        this.Measurer["Initialize"](window.native);
    },

    SetFont : function(font)
    {
        if (!font)
            return;

        this.m_oFont = font;

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

        var _lastSetUp = this.m_oLastFont;
        if (_lastSetUp.SetUpIndex != font.FontFamily.Index || _lastSetUp.SetUpSize != font.FontSize || _lastSetUp.SetUpStyle != oFontStyle)
        {
            _lastSetUp.SetUpIndex = font.FontFamily.Index;
            _lastSetUp.SetUpSize = font.FontSize;
            _lastSetUp.SetUpStyle = oFontStyle;

            var _info = this.GetLoadInfoForMeasurer(window.g_font_infos[_lastSetUp.SetUpIndex], _lastSetUp.SetUpStyle);
            var flag = 0;
            if (_info.NeedBold)     flag |= 0x01;
            if (_info.NeedItalic)   flag |= 0x02;
            if (_info.SrcBold)      flag |= 0x04;
            if (_info.SrcItalic)    flag |= 0x08;

            var _bounds = this.Measurer["LoadFont"](_info.Path, _info.FaceIndex, _lastSetUp.SetUpSize, flag);

            this.UnitsPerEm = _bounds[3];
            var dKoef = g_dKoef_pt_to_mm * _lastSetUp.SetUpSize / this.UnitsPerEm;
            this.Ascender   = _bounds[0] * dKoef;
            this.Descender  = _bounds[1] * dKoef;
            this.Height     = _bounds[2] * dKoef;
        }
    },

    SetTextPr : function(textPr)
    {
        this.m_oTextPr = textPr.Copy();
    },

    SetFontSlot : function(slot, fontSizeKoef)
    {
        var _rfonts = this.m_oTextPr.RFonts;
        var _lastFont = this.m_oLastFont;

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

            var _info = this.GetLoadInfoForMeasurer(window.g_font_infos[_lastFont.SetUpIndex], _lastFont.SetUpStyle);
            var flag = 0;
            if (_info.NeedBold)     flag |= 0x01;
            if (_info.NeedItalic)   flag |= 0x02;
            if (_info.SrcBold)      flag |= 0x04;
            if (_info.SrcItalic)    flag |= 0x08;

            var _bounds = this.Measurer["LoadFont"](_info.Path, _info.FaceIndex, _lastFont.SetUpSize, flag);

            this.UnitsPerEm = _bounds[3];
            var dKoef = g_dKoef_pt_to_mm * _lastFont.SetUpSize / this.UnitsPerEm;
            this.Ascender   = _bounds[0] * dKoef;
            this.Descender  = _bounds[1] * dKoef;
            this.Height     = _bounds[2] * dKoef;
        }
    },

    GetTextPr : function()
    {
        return this.m_oTextPr;
    },

    GetFont : function()
    {
        return this.m_oFont;
    },

    Measure : function(text)
    {
        var _width = this.Measurer["MeasureChar"](text.charCodeAt(0));
        return { Width : _width, Height : 0 };
    },
    Measure2 : function(text)
    {
        var _bounds = this.Measurer["GetDrawingBox"](text.charCodeAt(0));

        return { Width : _bounds[0], Ascent : _bounds[4], Height : (_bounds[4] - _bounds[3]), WidthG: (_bounds[2] - _bounds[1]) };
    },

    MeasureCode : function(lUnicode)
    {
        var _width = this.Measurer["MeasureChar"](lUnicode);
        return { Width : _width, Height : 0 };
    },
    Measure2Code : function(lUnicode)
    {
        var _bounds = this.Measurer["GetDrawingBox"](lUnicode);

        return { Width : _bounds[0], Ascent : _bounds[4], Height : (_bounds[4] - _bounds[3]), WidthG: (_bounds[2] - _bounds[1]) };
    },

    GetAscender : function()
    {
        return this.Ascender;
    },
    GetDescender : function()
    {
        return this.Descender;
    },
    GetHeight : function()
    {
        return this.Height;
    },

    GetLoadInfoForMeasurer : function(info, lStyle)
    {
        // подбираем шрифт по стилю
        var sReturnName = info.Name;
        var bNeedBold   = false;
        var bNeedItalic = false;

        var index       = -1;
        var faceIndex   = 0;

        var bSrcItalic  = false;
        var bSrcBold    = false;

        switch (lStyle)
        {
            case FontStyle.FontStyleBoldItalic:
            {
                bSrcItalic  = true;
                bSrcBold    = true;

                bNeedBold   = true;
                bNeedItalic = true;
                if (-1 != info.indexBI)
                {
                    index = info.indexBI;
                    faceIndex = info.faceIndexBI;
                    bNeedBold   = false;
                    bNeedItalic = false;
                }
                else if (-1 != info.indexB)
                {
                    index = info.indexB;
                    faceIndex = info.faceIndexB;
                    bNeedBold = false;
                }
                else if (-1 != info.indexI)
                {
                    index = info.indexI;
                    faceIndex = info.faceIndexI;
                    bNeedItalic = false;
                }
                else
                {
                    index = info.indexR;
                    faceIndex = info.faceIndexR;
                }
                break;
            }
            case FontStyle.FontStyleBold:
            {
                bSrcBold    = true;

                bNeedBold   = true;
                bNeedItalic = false;
                if (-1 != info.indexB)
                {
                    index = info.indexB;
                    faceIndex = info.faceIndexB;
                    bNeedBold = false;
                }
                else if (-1 != info.indexR)
                {
                    index = info.indexR;
                    faceIndex = info.faceIndexR;
                }
                else if (-1 != info.indexBI)
                {
                    index = info.indexBI;
                    faceIndex = info.faceIndexBI;
                    bNeedBold = false;
                }
                else
                {
                    index = info.indexI;
                    faceIndex = info.faceIndexI;
                }
                break;
            }
            case FontStyle.FontStyleItalic:
            {
                bSrcItalic  = true;

                bNeedBold   = false;
                bNeedItalic = true;
                if (-1 != info.indexI)
                {
                    index = info.indexI;
                    faceIndex = info.faceIndexI;
                    bNeedItalic = false;
                }
                else if (-1 != info.indexR)
                {
                    index = info.indexR;
                    faceIndex = info.faceIndexR;
                }
                else if (-1 != info.indexBI)
                {
                    index = info.indexBI;
                    faceIndex = info.faceIndexBI;
                    bNeedItalic = false;
                }
                else
                {
                    index = info.indexB;
                    faceIndex = info.faceIndexB;
                }
                break;
            }
            case FontStyle.FontStyleRegular:
            {
                bNeedBold   = false;
                bNeedItalic = false;
                if (-1 != info.indexR)
                {
                    index = info.indexR;
                    faceIndex = info.faceIndexR;
                }
                else if (-1 != info.indexI)
                {
                    index = info.indexI;
                    faceIndex = info.faceIndexI;
                }
                else if (-1 != info.indexB)
                {
                    index = info.indexB;
                    faceIndex = info.faceIndexB;
                }
                else
                {
                    index = info.indexBI;
                    faceIndex = info.faceIndexBI;
                }
            }
        }

        return {
            Path        : window.g_font_files[index].Id,
            FaceIndex   : faceIndex,
            NeedBold    : bNeedBold,
            NeedItalic  : bNeedItalic,
            SrcBold     : bSrcBold,
            SrcItalic   : bSrcItalic
        };
    }
};