// когда перейдем на автофигуры - нужно убрать этот класс нафик
var g_fontManagerExcel = new CFontManager();
g_fontManagerExcel.Initialize(true);

function CDrawingContextWord()
{
    this.Graphics = null;

    this.scaleFactor = 1;
    this.font = settings !== undefined && settings.font !== undefined ? settings.font : new FontProperties("Arial", 11);
}

CDrawingContextWord.prototype =
{
    initFromGraphics : function(graphics)
    {
        this.Graphics = graphics;
    },

    initFromContext : function(ctx, width_px, height_px, width_mm, height_mm)
    {
        if (undefined === width_mm || undefined === height_mm)
        {
            width_mm = width_px * g_dKoef_pix_to_mm;
            height_mm = height_px * g_dKoef_pix_to_mm;
        }

        this.Graphics = new CGraphics();
        this.Graphics.init(ctx, width_px, height_px, width_mm, height_mm);

        this.Graphics.m_oFontManager = g_fontManagerExcel;
        this.Graphics.transform(1,0,0,1,0,0);
    },

    setCanvas : function(canvas)
    {
        var c = canvas !== undefined ? canvas : null;
        if (c === null) {return;}
        var ctx = c.getContext("2d");

        this.initFromContext(ctx, c.width, c.height);
    },

    setFontManager : function(oManager)
    {
        this.Graphics.m_oFontManager = oManager;
    },

    setFont : function(font, angle)
    {
        var italic, bold, fontStyle, r;

        if (font.FontFamily.Index === undefined ||
            font.FontFamily.Index === null ||
            font.FontFamily.Index === -1) {
            font.FontFamily.Index = g_map_font_index[font.FontFamily.Name];
        }

        italic = true === font.Italic;
        bold   = true === font.Bold;

        this.font.copyFrom(font);

        fontStyle = FontStyle.FontStyleRegular;
        if ( !italic && bold )
            fontStyle = FontStyle.FontStyleBold;
        else if ( italic && !bold )
            fontStyle = FontStyle.FontStyleItalic;
        else if ( italic && bold )
            fontStyle = FontStyle.FontStyleBoldItalic;

        var fm = this.Graphics.m_oFontManager;

        if (angle && 0 != angle)
        {
            r = g_font_infos[ font.FontFamily.Index ].LoadFont(
                g_font_loader, fm, font.FontSize, fontStyle, this.Graphics.m_dDpiX, this.Graphics.m_dDpiY, this.Graphics.m_oTransform);

        }
        else
        {
            r = g_font_infos[ font.FontFamily.Index ].LoadFont(
                g_font_loader, this.fmgrGraphics[0], font.FontSize, fontStyle, this.Graphics.m_dDpiX, this.Graphics.m_dDpiY);
        }

        if (r === false) {
            throw "Can not use " + font.FontFamily.Name + " font. (Check whether font file is loaded)";
        }

        return this;
    },

    measureText : function(text, units)
    {
        var fm = this.Graphics.m_oFontManager;
        var r  = getCvtRatio(0/*px*/, units >= 0 && units <=3 ? units : 1, this.Graphics.m_dDpiX);
        for (var tmp, w = 0, w2 = 0, i = 0; i < text.length; ++i) {
            tmp = fm.MeasureChar( text.charCodeAt(i) );
            w += tmp.fAdvanceX;
        }
        w2 = w - tmp.fAdvanceX + tmp.oBBox.fMaxX - tmp.oBBox.fMinX + 1;
        return this._calcTextMetrics(w * r, w2 * r, fm, r);
    },

    fillText : function(text, x, y, maxWidth, charWidths, angle)
    {
        this.Graphics.t(text, x, y);
    },

    getHeightText : function()
    {
        var fm = this.Graphics.m_oFontManager;
        var UnitsPerEm = fm.m_lUnits_Per_Em;
        var Height     = fm.m_lLineHeight;
        var setUpSize  = this.font.FontSize;
        return Height * setUpSize / UnitsPerEm;
    },

    _calcTextMetrics: function (w, wBB, fm, r) {
        var factor = this.font.FontSize * r / fm.m_lUnits_Per_Em,
            l = fm.m_lLineHeight * factor,
            b = fm.m_lAscender * factor,
            d = Math.abs(fm.m_lDescender * factor);
        return new TextMetrics(w, b + d, l, b, d, this.font.FontSize, 0, wBB);
    }
};