//change FontSize
// api 2003: asc_docs_api.prototype.put_TextPrFontSize
//Document: Paragraph_Add

//api 2215: asc_docs_api.prototype.sync_TextPrFontSizeCallBack
// возвращает размер шрифта

//api 2212: asc_docs_api.prototype.sync_TextPrFontFamilyCallBack
// возвращает название шрифта


var DIV_CENT = 0.1386;

var StartTextElement = 0x2B1A; // Cambria Math

// TODO
// убрать CMathTextPrp

function CMathTextPrp()
{
    this.FontFamily = undefined;
    this.FontSize   = undefined;
    this.Bold       = undefined;
    this.Italic     = undefined;
    this.RFonts     = {};
    this.Lang       = {};
}
CMathTextPrp.prototype =
{
    Merge: function(prp)
    {
        if(prp.FontFamily !== undefined)
            this.FontFamily = Common_CopyObj(prp.FontFamily);

        if(prp.FontSize !== undefined)
            this.FontSize = prp.FontSize;

        if(prp.Bold !== undefined)
            this.Bold = prp.Bold;

        if(prp.Italic !== undefined)
            this.Italic = prp.Italic;

    },
    Set: function(prp)
    {
        this.FontFamily = Common_CopyObj(prp.FontFamily);
        this.FontSize = prp.FontSize;
        this.Bold = prp.Bold;
        this.Italic = prp.Italic;
    }
}

function CMathText(bJDraw)
{
    this.typeObj = MATH_TEXT;

    this.pos = null;
    this.size = null;
    this.value = null;

    this.bJDraw = false;

    if(bJDraw === false || bJDraw === true)
        this.bJDraw = bJDraw;

    this.type  = TXT_ROMAN;

    this.rasterOffsetX = 0;
    this.rasterOffsetY = 0;
    this.GapLeft = 0;
    this.GapRight = 0;
    this.WidthVisible = 0;

    // для Para_Run
    this.Type = para_Math_Text;

    // TO DO
    // убрать

    /*this.transform =
    {
        sx:  1,
        shy: 0,
        shx: 0,
        sy:  1
    };*/

}
CMathText.prototype =
{
    add: function(code)
    {
        if(code == 0x2A)      // "*"
            code = 0x2217;
        else if(code == 0x2D) // "-"
            code = 0x2212;

        this.value = code;
    },
	addTxt: function(txt)
	{
		var code = txt.charCodeAt(0);
        this.add(code);
	},
    getCode: function()
    {
        var code = this.value;

        if(this.typeObj === MATH_PLACEHOLDER || this.bJDraw)
            return code;

        var bCapitale = (code > 0x0040 && code < 0x005B),
            bSmall = (code > 0x0060 && code < 0x007b);

        var Type = this.Parent.Math_GetTypeText();


        if(Type == TXT_ROMAN )
        {
            var bDigit = (code > 0x002F && code < 0x003A),
                bCapGreek = (code > 0x0390 && code < 0x03AA ),
                bSmallGreek = (code > 0x03B0 && code < 0x03CA);

            if(code == 0x68) // h
                code = 0x210E;
            else if(bCapitale)
                code  = code + 0x1D3F3;
            else if(bSmall)
                code  = code + 0x1D3ED;
            else if(bCapGreek)
                code = code + 0x1D351;
            else if(bSmallGreek)
                code = code + 0x1D34B;

            if(code == 0x131) // "i" without dot
                code = 0x1D6A4;
            else if(code == 0x237) // "j" without dot
                code = 0x1D6A5;
        }
        else if(Type == TXT_DOUBLE_STRUCK)
        {
            if(code == 0x43)
                code = 0x2102;
            else if(code == 0x48)
                code = 0x210D;
            else if(code == 0x4E)
                code = 0x2115;
            else if(code == 0x50)
                code = 0x2119;
            else if(code == 0x51)
                code = 0x211A;
            else if(code == 0x52)
                code = 0x211D;
            else if(code == 0x5A)
                code = 0x2124;
            else if(bCapitale)
                code  = code + 0x1D4F7;
            else if(bSmall)
                code  = code + 0x1D4F1;
        }
        else if(Type == TXT_MONOSPACE)
        {
            if(bCapitale)
                code  = code + 0x1D62F;
            else if(bSmall)
                code  = code + 0x1D629;
        }
        else if(Type == TXT_FRAKTUR)
        {
            if(code == 0x43)
                code = 0x212D;
            else if(code == 0x48)
                code = 0x210C;
            else if(code == 0x49)
                code = 0x2111;
            else if(code == 0x52)
                code = 0x211C;
            else if(code == 0x5A)
                code = 0x2128;
            else if(bCapitale)
                code  = code + 0x1D4C3;
            else if(bSmall)
                code  = code + 0x1D4BD;
        }
        else if(Type == TXT_SANS_SERIF)
        {
            if(bCapitale)
                code  = code + 0x1D5C7;
            else if(bSmall)
                code  = code + 0x1D5C1;
        }
        else if(Type == TXT_SCRIPT)
        {
            if(code == 0x42)
                code = 0x212C;
            else if(code == 0x45)
                code = 0x2130;
            else if(code == 0x46)
                code = 0x2131;
            else if(code == 0x48)
                code = 0x210B;
            else if(code == 0x49)
                code = 0x2110;
            else if(code == 0x4C)
                code = 0x2112;
            else if(code == 0x4D)
                code = 0x2133;
            else if(code == 0x52)
                code = 0x211B;
            else if(code == 0x65)
                code = 0x212F;
            else if(code == 0x67)
                code = 0x210A;
            else if(code == 0x6F)
                code = 0x2134;
            else if(bCapitale)
                code  = code + 0x1D45B;
            else if(bSmall)
                code  = code + 0x1D455;
        }

        return code;
    },
    getCodeChr: function()
    {
        return this.value;
    },
    fillPlaceholders: function()
    {
        this.typeObj = MATH_PLACEHOLDER;
        this.value = StartTextElement;
    },
    setLIterator: function(bIterator)
    {
        this.bIterator = bIterator; // символы другие , чуть толще
    },
    Resize: function(oMeasure)
    {
        /*
         var metricsTxt = g_oTextMeasurer.Measure2Code(letter);
         var _width = metricsTxt.Width;
         height = g_oTextMeasurer.GetHeight();
        */

        var letter = this.getCode();

        var metricsTxt;

        if(this.bJDraw)
            metricsTxt = oMeasure.Measure2Code(letter);
        else
            metricsTxt = oMeasure.MeasureCode(letter);

        //  смещения
        this.rasterOffsetX = metricsTxt.rasterOffsetX;
        this.rasterOffsetY = metricsTxt.rasterOffsetY;

        var ascent  =  metricsTxt.Ascent;
        var descent = (metricsTxt.Height - metricsTxt.Ascent);
        var height  =  ascent + descent;

        var width;

        if(this.bJDraw)
            width = metricsTxt.WidthG + this.GapLeft + this.GapRight;
        else
            width = metricsTxt.Width + this.GapLeft + this.GapRight;

        this.WidthVisible = width;

        this.size = {width: width, widthG: width, height: height, ascent: ascent};
    },
    draw: function(x, y, pGraphics)
    {

        var X = this.pos.x + x,
            Y = this.pos.y + y;


        /*var tx = 0;
         var ty = 0;

         var x = (X*sy  - Y*shx - tx*sy)/(sx*sy- shy*shx);
         var y = (Y - x*shy - ty*shx)/sy;*/

        /*var invert = new CMatrix();
        invert.sx = this.transform.sx;
        invert.sy = this.transform.sy;
        invert.shx = this.transform.shx;
        invert.shy = this.transform.shy;
        invert.tx = 0;
        invert.ty = 0;
        invert.Invert();

        var xx = invert.TransformPointX(X, Y);
        var yy = invert.TransformPointY(X, Y);


        var sx = this.transform.sx, shx = this.transform.shx,
            shy = this.transform.shy, sy = this.transform.sy;

        pGraphics.transform(sx, shy, shx, sy, 0, 0);*/

        pGraphics.FillTextCode(X, Y, this.getCode());    //на отрисовку символа отправляем положение baseLine

    },
    setPosition: function(pos)
    {
        if( ! this.bJDraw)                      // for text
            this.pos = {x : pos.x + this.GapLeft, y: pos.y};
        else                                    // for symbol only drawing
        {
            var x = pos.x - this.rasterOffsetX,
                y = pos.y - this.rasterOffsetY;

            this.pos = {x: x, y: y};
        }
    },
    setCoeffTransform: function(sx, shx, shy, sy)
    {
        this.transform = {sx: sx, shx: shx, shy: shy, sy: sy};

        //здесь надо будет по-другому считать размер, после трансформации размер будет выставляться в g_oTextMeasurer
        //
        //MathControl.pGraph.transform(sx, shy, shx, sy, 0, 0);
        this.applyTransformation();

    },
    applyTransformation: function()
    {
        var sx = this.transform.sx, shx = this.transform.shx,
            shy = this.transform.shy, sy = this.transform.sy;
        sy = (sy < 0) ? -sy : sy;

        this.size.width = this.size.width*sx + (-1)*this.size.width*shx;
        this.size.height = this.size.height*sy + this.size.height*shy;
        this.size.ascent = this.size.ascent*(sy + shy);
        this.size.descent = this.size.descent*(sy + shy);
        this.size.center = this.size.center*(sy + shy);

    },
    IsJustDraw: function()
    {
        return this.bJDraw;
    },
    relate: function(parent) // for symbol only drawing
    {
        this.Parent = parent;
    },
    IsIncline: function()
    {
        // возвращаем не Italic, т.к. могут быть мат. текст, но буквы без наклона (placeholder и т.п.)

        var bIncline = false;

        bIncline = bIncline || (this.value == 0x210E);
        bIncline = bIncline || (this.value == 0x1D6A4);
        bIncline = bIncline || (this.value == 0x1D6A5);

        bIncline = bIncline || (this.value > 0x0040 && this.value < 0x005B);
        bIncline = bIncline || (this.value > 0x0060 && this.value < 0x007b);

        return bIncline;
    },
    setJustDraw: function(bJustDraw)
    {
        this.bJDraw = bJustDraw;
    },
    SetTypeText: function(type)
    {
        this.type = type;
    },

    // for Para Math
    // for placeholder
    Set_SelectionContentPos: function(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag)
    {
        if(StartFlag == 0)
            StartContentPos.Update2(0, Depth);


        if(EndFlag == 0)
            EndContentPos.Update2(1, Depth);
    },
    Selection_DrawRange : function(_CurLine, _CurRange, SelectionDraw)
    {
        SelectionDraw.W += this.size.width;
        SelectionDraw.FindStart = false;
    },
    Get_ParaContentPos: function(bSelection, bStart, ContentPos)
    {
        if(bSelection)
        {
            var pos = bStart ? 0 : 1;
            ContentPos.Add(pos);
        }
        else
            ContentPos.Add(0);


    },
    Get_ParaContentPosByXY: function(SearchPos, Depth)
    {
        SearchPos.Pos.Update(0, Depth);
        SearchPos.Pos.bPlaceholder = true;
    },


    // заглушка для текста (для n-арных операторов, когда выставляется текст вместо оператора)
    setComposition: function() // заглушка
    {},
    setReferenceComposition: function() // заглушка
    {},
    Write_ToBinary: function()
    {}

}

