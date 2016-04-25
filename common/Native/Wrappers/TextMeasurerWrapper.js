function CTextMeasurerWrapper()
{
    this.Measurer = CreateNativeTextMeasurer();

    this.m_oFont        = null;

    // RFonts
    this.m_oTextPr      = null;
    this.m_oGrFonts     = new AscCommon.CGrRFonts();
    this.m_oLastFont    = new AscCommon.CFontSetup();

    this.LastFontOriginInfo = { Name : "", Replace : null };

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
        this.Measurer["Initialize"](window["native"]);
    },

    SetFont : function(font)
    {
        if (!font)
            return;

        this.m_oFont = font;

        var bItalic = true === font.Italic;
        var bBold   = true === font.Bold;

        var oFontStyle = AscFonts.FontStyle.FontStyleRegular;
        if ( !bItalic && bBold )
            oFontStyle = AscFonts.FontStyle.FontStyleBold;
        else if ( bItalic && !bBold )
            oFontStyle = AscFonts.FontStyle.FontStyleItalic;
        else if ( bItalic && bBold )
            oFontStyle = AscFonts.FontStyle.FontStyleBoldItalic;

        this.SetFontInternal(font.FontFamily.Name, font.FontSize, oFontStyle);
    },

    SetFontInternal : function(_name, _size, _style)
    {
        var _lastSetUp = this.m_oLastFont;
        if (_lastSetUp.SetUpName != _name || _lastSetUp.SetUpSize != _size || _lastSetUp.SetUpStyle != _style)
        {
            _lastSetUp.SetUpName = _name;
            _lastSetUp.SetUpSize = _size;
            _lastSetUp.SetUpStyle = _style;

            var _fontinfo = AscFonts.g_fontApplication.GetFontInfo(_lastSetUp.SetUpName, _lastSetUp.SetUpStyle, this.LastFontOriginInfo);
            var _info = GetLoadInfoForMeasurer(_fontinfo, _lastSetUp.SetUpStyle);

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

    SetTextPr : function(textPr, theme)
    {
        this.m_oTextPr = textPr;
        if (theme)
            this.m_oGrFonts.checkFromTheme(theme.themeElements.fontScheme, this.m_oTextPr.RFonts);
        else
            this.m_oGrFonts = this.m_oTextPr.RFonts;
    },

    SetFontSlot : function(slot, fontSizeKoef)
    {
        var _rfonts = this.m_oGrFonts;
        var _lastFont = this.m_oLastFont;

        switch (slot)
        {
            case fontslot_ASCII:
            {
                _lastFont.Name   = _rfonts.Ascii.Name;
                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
            case fontslot_CS:
            {
                _lastFont.Name   = _rfonts.CS.Name;
                _lastFont.Size = this.m_oTextPr.FontSizeCS;
                _lastFont.Bold = this.m_oTextPr.BoldCS;
                _lastFont.Italic = this.m_oTextPr.ItalicCS;

                break;
            }
            case fontslot_EastAsia:
            {
                _lastFont.Name   = _rfonts.EastAsia.Name;
                _lastFont.Index  = _rfonts.EastAsia.Index;
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

        this.SetFontInternal(_lastFont.Name, _lastFont.Size, _style);
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
        var _code = text.charCodeAt(0);
        if (null != this.LastFontOriginInfo.Replace)
            _code = AscFonts.g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);

        var _width = this.Measurer["MeasureChar"](_code);
        return { Width : _width, Height : 0 };
    },
    Measure2 : function(text)
    {
        var _code = text.charCodeAt(0);
        if (null != this.LastFontOriginInfo.Replace)
            _code = AscFonts.g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);

        var _bounds = this.Measurer["GetDrawingBox"](_code);

        return {
            Width  : _bounds[0],
            Ascent : _bounds[4],
            Height : _bounds[4] - _bounds[3],
            WidthG : _bounds[2] - _bounds[1],
            rasterOffsetX: 0,
            rasterOffsetY: 0
        };
    },

    MeasureCode : function(lUnicode)
    {
        if (null != this.LastFontOriginInfo.Replace)
            lUnicode = AscFonts.g_fontApplication.GetReplaceGlyph(lUnicode, this.LastFontOriginInfo.Replace);

        var _bounds = this.Measurer["GetDrawingBox"](lUnicode);

        return {
            Width  : _bounds[0],
            Ascent : _bounds[4],
            Height : _bounds[4] - _bounds[3]
        };
    },
    Measure2Code : function(lUnicode)
    {
        if (null != this.LastFontOriginInfo.Replace)
            lUnicode = AscFonts.g_fontApplication.GetReplaceGlyph(lUnicode, this.LastFontOriginInfo.Replace);

        var _bounds = this.Measurer["GetDrawingBox"](lUnicode);

        return {
            Width  : _bounds[0],
            Ascent : _bounds[4],
            Height : _bounds[4] - _bounds[3],
            WidthG : _bounds[2] - _bounds[1],
            rasterOffsetX: 0,
            rasterOffsetY: 0
        };
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

    Flush : function()
    {
        this.m_oFont = null;
        this.m_oTextPr = null;
        this.m_oGrFonts = new AscCommon.CGrRFonts();
        this.m_oLastFont = new AscCommon.CFontSetup();
        this.LastFontOriginInfo = { Name : "", Replace : null };
        this.Ascender  = 0;
        this.Descender = 0;
        this.Height = 0;
        this.UnitsPerEm = 0;
    }
};

function GetLoadInfoForMeasurer(info, lStyle)
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
        case AscFonts.FontStyle.FontStyleBoldItalic:
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
        case AscFonts.FontStyle.FontStyleBold:
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
        case AscFonts.FontStyle.FontStyleItalic:
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
        case AscFonts.FontStyle.FontStyleRegular:
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

CTextMeasurerWrapper.prototype["Init"] = CTextMeasurerWrapper.prototype.Init;

window["CreateTextMeasurerWrapper"] = function()
{
	return new CTextMeasurerWrapper();
};
window["CreateMainTextMeasurerWrapper"] = function()
{
	g_oTextMeasurer = new CTextMeasurerWrapper();
	g_oTextMeasurer.Init();
    window['AscCommon'].g_oTextMeasurer = g_oTextMeasurer;
};
