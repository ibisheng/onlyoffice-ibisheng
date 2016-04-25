"use strict";

(function(window, undefined){
    function CTextMeasurer()
    {
        this.m_oManager = new AscFonts.CFontManager();

        this.m_oFont = null;

        // RFonts
        this.m_oTextPr = null;
        this.m_oGrFonts = new AscCommon.CGrRFonts();
        this.m_oLastFont = new AscCommon.CFontSetup();

        this.LastFontOriginInfo = {Name : "", Replace : null};
    }

    CTextMeasurer.prototype =
    {
        Init : function()
        {
            this.m_oManager.Initialize();
        },

        SetStringGid : function(bGID)
        {
            this.m_oManager.SetStringGID(bGID);
        },

        SetFont : function(font)
        {
            if (!font)
                return;

            this.m_oFont = font;

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
            if (_lastSetUp.SetUpName != font.FontFamily.Name || _lastSetUp.SetUpSize != font.FontSize || _lastSetUp.SetUpStyle != oFontStyle)
            {
                _lastSetUp.SetUpName = font.FontFamily.Name;
                _lastSetUp.SetUpSize = font.FontSize;
                _lastSetUp.SetUpStyle = oFontStyle;

                g_fontApplication.LoadFont(_lastSetUp.SetUpName, AscCommon.g_font_loader, this.m_oManager, _lastSetUp.SetUpSize, _lastSetUp.SetUpStyle, 72, 72, undefined, this.LastFontOriginInfo);
            }
        },

        SetFontInternal : function(_name, _size, _style)
        {
            var _lastSetUp = this.m_oLastFont;
            if (_lastSetUp.SetUpName != _name || _lastSetUp.SetUpSize != _size || _lastSetUp.SetUpStyle != _style)
            {
                _lastSetUp.SetUpName = _name;
                _lastSetUp.SetUpSize = _size;
                _lastSetUp.SetUpStyle = _style;

                g_fontApplication.LoadFont(_lastSetUp.SetUpName, AscCommon.g_font_loader, this.m_oManager, _lastSetUp.SetUpSize, _lastSetUp.SetUpStyle, 72, 72, undefined, this.LastFontOriginInfo);
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
                    _lastFont.Index  = _rfonts.Ascii.Index;

                    _lastFont.Size = this.m_oTextPr.FontSize;
                    _lastFont.Bold = this.m_oTextPr.Bold;
                    _lastFont.Italic = this.m_oTextPr.Italic;

                    break;
                }
                case fontslot_CS:
                {
                    _lastFont.Name   = _rfonts.CS.Name;
                    _lastFont.Index  = _rfonts.CS.Index;

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

            if (_lastFont.Name != _lastFont.SetUpName || _lastFont.Size != _lastFont.SetUpSize || _style != _lastFont.SetUpStyle)
            {
                _lastFont.SetUpName = _lastFont.Name;
                _lastFont.SetUpSize = _lastFont.Size;
                _lastFont.SetUpStyle = _style;

                g_fontApplication.LoadFont(_lastFont.SetUpName, AscCommon.g_font_loader, this.m_oManager, _lastFont.SetUpSize, _lastFont.SetUpStyle, 72, 72, undefined, this.LastFontOriginInfo);
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
            var Width  = 0;
            var Height = 0;

            var _code = text.charCodeAt(0);
            if (null != this.LastFontOriginInfo.Replace)
                _code = g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);

            var Temp = this.m_oManager.MeasureChar( _code );

            Width  = Temp.fAdvanceX * 25.4 / 72;
            Height = 0;//Temp.fHeight;

            return { Width : Width, Height : Height };
        },
        Measure2 : function(text)
        {
            var Width  = 0;

            var _code = text.charCodeAt(0);
            if (null != this.LastFontOriginInfo.Replace)
                _code = g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);

            var Temp = this.m_oManager.MeasureChar( _code, true );

            Width  = Temp.fAdvanceX * 25.4 / 72;

            if (Temp.oBBox.rasterDistances == null)
            {
                return {
                    Width  : Width,
                    Ascent : (Temp.oBBox.fMaxY * 25.4 / 72),
                    Height : ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72),
                    WidthG : ((Temp.oBBox.fMaxX - Temp.oBBox.fMinX) * 25.4 / 72),
                    rasterOffsetX: 0,
                    rasterOffsetY: 0
                };
            }

            return {
                Width  : Width,
                Ascent : (Temp.oBBox.fMaxY * 25.4 / 72),
                Height : ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72),
                WidthG : ((Temp.oBBox.fMaxX - Temp.oBBox.fMinX) * 25.4 / 72),
                rasterOffsetX: Temp.oBBox.rasterDistances.dist_l * 25.4 / 72,
                rasterOffsetY: Temp.oBBox.rasterDistances.dist_t * 25.4 / 72
            };
        },

        MeasureCode : function(lUnicode)
        {
            var Width  = 0;
            var Height = 0;

            if (null != this.LastFontOriginInfo.Replace)
                lUnicode = g_fontApplication.GetReplaceGlyph(lUnicode, this.LastFontOriginInfo.Replace);

            var Temp = this.m_oManager.MeasureChar( lUnicode );

            Width  = Temp.fAdvanceX * 25.4 / 72;
            Height = ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72);

            return { Width : Width, Height : Height, Ascent : (Temp.oBBox.fMaxY * 25.4 / 72) };
        },
        Measure2Code : function(lUnicode)
        {
            var Width  = 0;

            if (null != this.LastFontOriginInfo.Replace)
                lUnicode = g_fontApplication.GetReplaceGlyph(lUnicode, this.LastFontOriginInfo.Replace);

            var Temp = this.m_oManager.MeasureChar( lUnicode, true );

            Width  = Temp.fAdvanceX * 25.4 / 72;

            if (Temp.oBBox.rasterDistances == null)
            {
                return {
                    Width  : Width,
                    Ascent : (Temp.oBBox.fMaxY * 25.4 / 72),
                    Height : ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72),
                    WidthG : ((Temp.oBBox.fMaxX - Temp.oBBox.fMinX) * 25.4 / 72),
                    rasterOffsetX: 0,
                    rasterOffsetY: 0
                };
            }

            return {
                Width  : Width,
                Ascent : (Temp.oBBox.fMaxY * 25.4 / 72),
                Height : ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72),
                WidthG : ((Temp.oBBox.fMaxX - Temp.oBBox.fMinX) * 25.4 / 72),
                rasterOffsetX: (Temp.oBBox.rasterDistances.dist_l + Temp.oBBox.fMinX) * 25.4 / 72,
                rasterOffsetY: Temp.oBBox.rasterDistances.dist_t * 25.4 / 72
            };
        },

        GetAscender : function()
        {
            var UnitsPerEm = this.m_oManager.m_lUnits_Per_Em;
            var Ascender   = this.m_oManager.m_lAscender;

            return Ascender * this.m_oLastFont.SetUpSize / UnitsPerEm * g_dKoef_pt_to_mm;
        },
        GetDescender : function()
        {
            var UnitsPerEm = this.m_oManager.m_lUnits_Per_Em;
            var Descender  = this.m_oManager.m_lDescender;

            return Descender * this.m_oLastFont.SetUpSize / UnitsPerEm * g_dKoef_pt_to_mm;
        },
        GetHeight : function()
        {
            var UnitsPerEm = this.m_oManager.m_lUnits_Per_Em;
            var Height     = this.m_oManager.m_lLineHeight;

            return Height * this.m_oLastFont.SetUpSize / UnitsPerEm * g_dKoef_pt_to_mm;
        }
    };
    var g_oTextMeasurer = new CTextMeasurer();
    g_oTextMeasurer.Init();

    //--------------------------------------------------------export----------------------------------------------------
    window['AscCommon'] = window['AscCommon'] || {};
    window['AscCommon'].CTextMeasurer = CTextMeasurer;
    window['AscCommon'].g_oTextMeasurer = g_oTextMeasurer;
})(window);
