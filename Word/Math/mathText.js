"use strict";

//change FontSize
// api 2003: asc_docs_api.prototype.put_TextPrFontSize
//Document: Paragraph_Add

//api 2215: asc_docs_api.prototype.sync_TextPrFontSizeCallBack
// возвращает размер шрифта

//api 2212: asc_docs_api.prototype.sync_TextPrFontFamilyCallBack
// возвращает название шрифта

// Таблица соответствия кодов ASCII (десятичные, соответствующие восьмеричные, шестнадцатиричные, двоичные, ASCII коды )
// http://www.dpva.info/Guide/GuideMathematics/GuideMathematicsNumericalSystems/TableCodeEquivalent/

var DIV_CENT = 0.1386;

var StartTextElement = 0x2B1A; // Cambria Math

function CMathSize()
{
    this.Type   = MATH_SIZE;
    this.width  = 0;
    this.height = 0;
    this.ascent = 0;
}
CMathSize.prototype.SetZero = function()
{
    this.width  = 0;
    this.descent = 0;
    this.ascent = 0;
}
CMathSize.prototype.Set = function(size)
{
    this.width  = size.width;
    this.height = size.height;
    this.ascent = size.ascent;
};

function CMathBaseText()
{
    this.Type           = null;
    this.bJDraw         = false;
    this.value          = null;

    this.bEmptyGapLeft  = false;
    this.bEmptyGapRight = false;

    this.ParaMath       = null;
    this.Parent         = null;
    this.Flags          = 0;
    this.size           = new CMathSize();
    this.Width          = 0; // special for Run размер буквы без Gaps
                             // в действительности это поле не должно использоваться, нужно использовать функциии Get_Width, Get_Width_2 ,Get_WidthVisible

    this.pos = new CMathPosition();

    this.GapLeft        = 0;
    this.GapRight       = 0;
}
CMathBaseText.prototype.Get_Width = function() // работаем через функцию, т.к. поля  GapLeft и GapRight могут измениться из-за изменения переноса, а пересчет (Measure) в этом случае не прийдет
{
    var Width = this.size.width;

    if(this.bEmptyGapLeft == false)
        Width += this.GapLeft;

    if(this.bEmptyGapRight == false)
        Width += this.GapRight;

    return (Width*TEXTWIDTH_DIVIDER) | 0;
};
CMathBaseText.prototype.Get_Width2 = function() // работаем через функцию, т.к. поля  GapLeft и GapRight могут измениться из-за изменения переноса, а пересчет (Measure) в этом случае не прийдет
{
    return ( (this.size.width + this.GapLeft + this.GapRight)* TEXTWIDTH_DIVIDER ) | 0;
};
CMathBaseText.prototype.Get_WidthVisible = function()
{
    var Width = this.size.width;

    if(this.bEmptyGapLeft == false)
        Width += this.GapLeft;

    if(this.bEmptyGapRight == false)
        Width += this.GapRight;

    return Width;
};
CMathBaseText.prototype.Update_StateGapLeft = function(bState)
{
    this.bEmptyGapLeft = bState;
};
CMathBaseText.prototype.Update_StateGapRight = function(bState)
{
    this.bEmptyGapRight = bState;
};
CMathBaseText.prototype.GetLocationOfLetter = function()
{
    var pos = new CMathPosition();

    pos.x = this.pos.x;
    pos.y = this.pos.y;

    return pos;
};
CMathBaseText.prototype.IsPlaceholder = function()
{
    return this.Type == para_Math_Placeholder;
};
CMathBaseText.prototype.IsJustDraw = function()
{
    return false;
};
// For ParaRun
CMathBaseText.prototype.Is_Punctuation = function()
{
    var bPunc     = 1 === g_aPunctuation[this.value],
        bMathSign = this.value ==  0x2217 || this.value == 0x2212;

    return bPunc || bMathSign;
};
CMathBaseText.prototype.Is_NBSP = function()
{
    return false;
};
CMathBaseText.prototype.Can_AddNumbering = function()
{
    return true;
};
CMathBaseText.prototype.Draw_Elements = function(PDSE)  // эта функция необходима для Draw_Elements основания Nary, когда в основании находится только JustDraw элемент
{
    var PosLine = this.ParaMath.GetLinePosition(PDSE.Line);
    this.Draw(PosLine.x, PosLine.y, PDSE.Graphics);
};

function CMathText(bJDraw)
{
    CMathText.superclass.constructor.call(this);

    this.Type           = para_Math_Text;
    this.bJDraw         = (undefined === bJDraw ? false : bJDraw);

    this.RecalcInfo =
    {
        StyleCode:        null,
        bAccentIJ:        false,
        bSpaceSpecial:    false,
        bApostrophe:      false,
        bSpecialOperator: false
    };

    this.rasterOffsetX  = 0;
    this.rasterOffsetY  = 0;

    this.FontSlot       = fontslot_ASCII;

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
Asc.extendClass(CMathText, CMathBaseText);
CMathText.prototype.add = function(code)
{
    this.value = code;

    if( this.private_Is_BreakOperator(code) )
        this.Type = para_Math_BreakOperator;
};
CMathText.prototype.addTxt = function(txt)
{
    var code = txt.charCodeAt(0);
    this.add(code);
};
CMathText.prototype.getCodeChr = function()
{
    return this.value;
};
CMathText.prototype.private_getCode = function()
{
    var code = this.value;

    var bNormal = this.bJDraw ? null : this.Parent.IsNormalText();

    if(this.Type === para_Math_Placeholder || this.bJDraw || bNormal)
        return code;

    var Compiled_MPrp = this.Parent.GetCompiled_ScrStyles();
    var bAccent = this.Parent.IsAccent();

    var bCapitale = (code > 0x0040 && code < 0x005B),
        bSmall = (code > 0x0060 && code < 0x007b),
        bDigit = (code > 0x002F && code < 0x003A);

    var bCapGreek   = (code > 0x0390 && code < 0x03AA),
        bSmallGreek = (code > 0x03B0 && code < 0x03CA);

    var Scr = Compiled_MPrp.scr,
        Sty = Compiled_MPrp.sty;

    // Mathematical Alphanumeric Characters
    // http://www.w3.org/TR/2014/REC-xml-entity-names-20140410/Overview.html#alphabets

    if(code == 0x2A)      // "*"
        code = 0x2217;
    else if(code == 0x2D) // "-"
        code = 0x2212;

    else if(Scr == TXT_ROMAN)
    {
        if(Sty == STY_ITALIC)
        {
            if(code == 0x68)            // h
                code = 0x210E;
            /*else if((code == 0x69 && bAccent) || code == 0x131) // "i" with dot || "i" dotless plain => "i" dotless italic
                code = 0x1D6A4;
            else if((code == 0x6A && bAccent) ||code == 0x237)   // "j" with dot || "j" dotless plain => "j" dotless italic
                code = 0x1D6A5;*/
            else if(code == 0x69 && bAccent)
                code = 2835;
            else if(code == 0x6A && bAccent)
                code = 2836;
            else if(bCapitale)
                code  = code + 0x1D3F3;
            else if(bSmall)
                code  = code + 0x1D3ED;
            else if(code == 0x3F4)      // Capital THETA special
                code = 0x1D6F3;
            else if(code == 0x2207)     // Capital NABLA
                code = 0x1D6FB;
            else if(bCapGreek)
                code = code + 0x1D351;
            else if(bSmallGreek)
                code = code + 0x1D34B;
            else if(code == 0x2202)     //  PARTIAL DIFFERENTIAL
                code = 0x1D715;
            else if(code == 0x3F5)      //  small EPSILON
                code = 0x1D716;
            else if(code == 0x3D1)      //  small THETA
                code = 0x1D717;
            else if(code == 0x3F0)      //  small KAPPA
                code = 0x1D718;
            else if(code == 0x3D5)      //  small PHI
                code = 0x1D719;
            else if(code == 0x3F1)      //  small RHO
                code = 0x1D71A;
            else if(code == 0x3D6)      //  small PI
                code = 0x1D71B;

        }
        else if(Sty == STY_BI)
        {
            if(code == 0x69 && bAccent)
                code = 2841;
            else if(code == 0x6A && bAccent)
                code = 2842;
            else if(bCapitale)
                code = code + 0x1D427;
            else if(bSmall)
                code = code + 0x1D421;
            else if(bDigit)
                code  = code + 0x1D79E;
            else if(code == 0x3F4)      // Capital THETA special
                code = 0x1D72D;
            else if(code == 0x2207)     // Capital NABLA
                code = 0x1D735;
            else if(bCapGreek)
                code = code + 0x1D38B;
            else if(bSmallGreek)
                code = code + 0x1D385;
            else if(code == 0x2202)     //  PARTIAL DIFFERENTIAL
                code = 0x1D74F;
            else if(code == 0x3F5)      //  small EPSILON
                code = 0x1D750;
            else if(code == 0x3D1)      //  small THETA
                code = 0x1D751;
            else if(code == 0x3F0)      //  small KAPPA
                code = 0x1D752;
            else if(code == 0x3D5)      //  small PHI
                code = 0x1D753;
            else if(code == 0x3F1)      //  small RHO
                code = 0x1D754;
            else if(code == 0x3D6)      //  small PI
                code = 0x1D755;
        }
        else if(Sty == STY_BOLD)
        {
            if(code == 0x69 && bAccent)
                code = 2829;
            else if(code == 0x6A && bAccent)
                code = 2830;
            else if(bCapitale)
                code = code + 0x1D3BF;
            else if(bSmall)
                code = code + 0x1D3B9;
            else if(bDigit)
                code  = code + 0x1D79E;
            else if(code == 0x3F4)      // Capital THETA special
                code = 0x1D6B9;
            else if(code == 0x2207)     // Capital NABLA
                code = 0x1D6C1;
            else if(bCapGreek)
                code = code + 0x1D317;
            else if(bSmallGreek)
                code = code + 0x1D311;
            else if(code == 0x2202)     //  PARTIAL DIFFERENTIAL
                code = 0x1D6DB;
            else if(code == 0x3F5)      //  small EPSILON
                code = 0x1D6DC;
            else if(code == 0x3D1)      //  small THETA
                code = 0x1D6DD;
            else if(code == 0x3F0)      //  small KAPPA
                code = 0x1D6DE;
            else if(code == 0x3D5)      //  small PHI
                code = 0x1D6DF;
            else if(code == 0x3F1)      //  small RHO
                code = 0x1D6E0;
            else if(code == 0x3D6)      //  small PI
                code = 0x1D6E1;
            else if(code == 0x3DC)      //  CAPITAL DIGAMMA
                code = 0x1D7CA;
            else if(code == 0x3DD)      //  SMALL DIGAMMA
                code = 0x1D7CB;
        }
        else // PLAIN
        {
            if(bAccent)
            {
                /*if(code == 0x69)    // "i" with dot  => "i" dotless plain
                    code = 0x131;
                else if(code == 0x6A)      //  "j" with dot => "j" dotless plain
                    code = 0x237;*/

                if(code == 0x69 && bAccent)
                    code = 199;
                else if(code == 0x6A && bAccent)
                    code = 2828;

            }
        }
    }
    else if(Scr == TXT_DOUBLE_STRUCK)
    {
        if(code == 0x69 && bAccent)
            code = 2851;
        else if(code == 0x6A && bAccent)
            code = 2852;
        else if(code == 0x43)   // C
            code = 0x2102;
        else if(code == 0x48)   // H
            code = 0x210D;
        else if(code == 0x4E)   // N
            code = 0x2115;
        else if(code == 0x50)   // P
            code = 0x2119;
        else if(code == 0x51)   // Q
            code = 0x211A;
        else if(code == 0x52)   // R
            code = 0x211D;
        else if(code == 0x5A)   // Z
            code = 0x2124;
        else if(bCapitale)
            code  = code + 0x1D4F7;
        else if(bSmall)
            code  = code + 0x1D4F1;

        else if(bDigit)
            code = code + 0x1D7A8;

        // arabic mathematical symbols

        else if(code == 0x628)
            code = 0x1EEA1;
        else if(code == 0x062C)
            code = 0x1EEA2;
        else if(code == 0x062F)
            code = 0x1EEA3;
        else if(code == 0x0648)
            code = 0x1EEA5;
        else if(code == 0x0632)
            code = 0x1EEA6;
        else if(code == 0x062D)
            code = 0x1EEA7;
        else if(code == 0x0637)
            code = 0x1EEA8;
        else if(code == 0x064A)
            code = 0x1EEA9;

        else if(code == 0x0644)
            code = 0x1EEAB;
        else if(code == 0x0645)
            code = 0x1EEAC;
        else if(code == 0x0646)
            code = 0x1EEAD;
        else if(code == 0x0633)
            code = 0x1EEAE;
        else if(code == 0x0639)
            code = 0x1EEAF;
        else if(code == 0x0641)
            code = 0x1EEB0;
        else if(code == 0x0635)
            code = 0x1EEB1;
        else if(code == 0x0642)
            code = 0x1EEB2;
        else if(code == 0x0631)
            code = 0x1EEB3;
        else if(code == 0x0634)
            code = 0x1EEB4;
        else if(code == 0x062A)
            code = 0x1EEB5;
        else if(code == 0x062B)
            code = 0x1EEB6;
        else if(code == 0x062E)
            code = 0x1EEB7;
        else if(code == 0x0630)
            code = 0x1EEB8;
        else if(code == 0x0636)
            code = 0x1EEB9;
        else if(code == 0x0638)
            code = 0x1EEBA;
        else if(code == 0x063A)
            code = 0x1EEBB;

    }
    else if(Scr == TXT_MONOSPACE)
    {
        if(code == 0x69 && bAccent)
            code = 4547;
        else if(code == 0x6A && bAccent)
            code = 4548;
        else if(bCapitale)
            code  = code + 0x1D62F;
        else if(bSmall)
            code  = code + 0x1D629;
        else if(bDigit)
            code  = code + 0x1D7C6;
    }
    else if(Scr == TXT_FRAKTUR)
    {
        if(Sty == STY_BOLD ||Sty == STY_BI)
        {
            if(code == 0x69 && bAccent)
                code = 2849;
            else if(code == 0x6A && bAccent)
                code = 2850;
            else if(bCapitale)
                code = code + 0x1D52B;
            else if(bSmall)
                code = code + 0x1D525;
        }
        else
        {
            if(code == 0x69 && bAccent)
                code = 2847;
            else if(code == 0x6A && bAccent)
                code = 2848;
            else if(code == 0x43)   // C
                code = 0x212D;
            else if(code == 0x48)   // H
                code = 0x210C;
            else if(code == 0x49)   // I
                code = 0x2111;
            else if(code == 0x52)   // R
                code = 0x211C;
            else if(code == 0x5A)   // Z
                code = 0x2128;
            else if(bCapitale)
                code = code + 0x1D4C3;
            else if(bSmall)
                code = code + 0x1D4BD;
        }

    }
    else if(Scr == TXT_SANS_SERIF)
    {
        if(Sty == STY_ITALIC)
        {
            if(code == 0x69 && bAccent)
                code = 2857;
            else if(code == 0x6A && bAccent)
                code = 2858;
            else if(bCapitale)
                code = code + 0x1D5C7;
            else if(bSmall)
                code = code + 0x1D5C1;
            else if(bDigit)
                code = code + 0x1D7B2;
        }
        else if(Sty == STY_BOLD)
        {
            if(code == 0x69 && bAccent)
                code = 2855;
            else if(code == 0x6A && bAccent)
                code = 2856;
            else if(bCapitale)
                code = code + 0x1D593;
            else if(bSmall)
                code = code + 0x1D58D;
            else if(bDigit)
                code = code + 0x1D7BC;
            else if(code == 0x3F4)      // Capital THETA special
                code = 0x1D767;
            else if(code == 0x2207)     // Capital NABLA
                code = 0x1D76F;
            else if(bCapGreek)
                code = code + 0x1D3C5;
            else if(bSmallGreek)
                code = code + 0x1D3BF;
            else if(code == 0x2202)     //  PARTIAL DIFFERENTIAL
                code = 0x1D789;
            else if(code == 0x3F5)      //  small EPSILON
                code = 0x1D78A;
            else if(code == 0x3D1)      //  small THETA
                code = 0x1D78B;
            else if(code == 0x3F0)      //  small KAPPA
                code = 0x1D78C;
            else if(code == 0x3D5)      //  small PHI
                code = 0x1D78D;
            else if(code == 0x3F1)      //  small RHO
                code = 0x1D78E;
            else if(code == 0x3D6)      //  small PI
                code = 0x1D78F;
        }
        else if(Sty == STY_BI)
        {
            if(code == 0x69 && bAccent)
                code = 2859;
            else if(code == 0x6A && bAccent)
                code = 2860;
            else if(bCapitale)
                code = code + 0x1D5FB;
            else if(bSmall)
                code = code + 0x1D5F5;
            else if(bDigit)
                code = code + 0x1D7BC;
            else if(code == 0x3F4)      // Capital THETA special
                code = 0x1D7A1;
            else if(code == 0x2207)     // Capital NABLA
                code = 0x1D7A9;
            else if(bCapGreek)
                code = code + 0x1D3FF;
            else if(bSmallGreek)
                code = code + 0x1D3F9;
            else if(code == 0x2202)     //  PARTIAL DIFFERENTIAL
                code = 0x1D7C3;
            else if(code == 0x3F5)      //  small EPSILON
                code = 0x1D7C4;
            else if(code == 0x3D1)      //  small THETA
                code = 0x11D7C5;
            else if(code == 0x3F0)      //  small KAPPA
                code = 0x1D7C6;
            else if(code == 0x3D5)      //  small PHI
                code = 0x1D7C7;
            else if(code == 0x3F1)      //  small RHO
                code = 0x1D7C8;
            else if(code == 0x3D6)      //  small PI
                code = 0x1D7C9;
        }
        else
        {
            if(code == 0x69 && bAccent)
                code = 2853;
            else if(code == 0x6A && bAccent)
                code = 2854;
            else if(bCapitale)
                code = code + 0x1D55F;
            else if(bSmall)
                code = code + 0x1D559;
            else if(bDigit)
                code = code + 0x1D7B2;
        }

    }
    else if(Scr == TXT_SCRIPT)
    {
        if(Sty == STY_ITALIC || Sty == STY_PLAIN)
        {
            if(code == 0x69 && bAccent)
                code = 2843;
            else if(code == 0x6A && bAccent)
                code = 2844;
            else if(code == 0x42)   // B
                code = 0x212C;
            else if(code == 0x45)   // E
                code = 0x2130;
            else if(code == 0x46)   // F
                code = 0x2131;
            else if(code == 0x48)   // H
                code = 0x210B;
            else if(code == 0x49)   // I
                code = 0x2110;
            else if(code == 0x4C)   // L
                code = 0x2112;
            else if(code == 0x4D)   // M
                code = 0x2133;
            else if(code == 0x52)   // R
                code = 0x211B;
            else if(code == 0x65)   // e
                code = 0x212F;
            else if(code == 0x67)   // g
                code = 0x210A;
            else if(code == 0x6F)   // o
                code = 0x2134;
            else if(bCapitale)
                code  = code + 0x1D45B;
            else if(bSmall)
                code  = code + 0x1D455;
        }
        else
        {
            if(code == 0x69 && bAccent)
                code = 2845;
            else if(code == 0x6A && bAccent)
                code = 2846;
            else if(bCapitale)
                code = code + 0x1D48F;
            else if(bSmall)
                code = code + 0x1D489;

        }
    }

    /*if(!bNormal && code == 0x27)
    {
        // рисовать в Calibri
        code = 3;  GID
        this.RecalcInfo.bApostrophe = true;
    }*/

    return code;
};
CMathText.prototype.fillPlaceholders = function()
{
    this.Type = para_Math_Placeholder;
    this.value = StartTextElement;
};
CMathText.prototype.Measure = function(oMeasure, TextPr, InfoMathText)
{
    /*
     var metricsTxt = g_oTextMeasurer.Measure2Code(letter);
     var _width = metricsTxt.Width;
     height = g_oTextMeasurer.GetHeight();
    */

    var metricsTxt;

    // measure
    if(this.bJDraw)
    {
        // Font выставляется на соответствующей функции SetFont в родительском классе (в общем случае в CMathBase)

        this.RecalcInfo.StyleCode = this.value;
        metricsTxt = oMeasure.Measure2Code(this.value);
}
    else
    {
        var ascent, width, height, descent;

        this.FontSlot = InfoMathText.GetFontSlot(this.value); // возвращает fontslot_ASCII || fontslot_EastAsia || fontslot_CS || fontslot_HAnsi

        var letter = this.private_getCode();

        // в не математическом тексте i и j не подменяются на i и j без точек
        var bAccentIJ = !InfoMathText.bNormalText && this.Parent.IsAccent() && (this.value == 0x69 || this.value == 0x6A);

        this.RecalcInfo.StyleCode = letter;
        this.RecalcInfo.bAccentIJ = bAccentIJ;

        if(bAccentIJ || this.RecalcInfo.bApostrophe)
            oMeasure.SetStringGid(true);

        if( InfoMathText.NeedUpdateFont(this.value, this.FontSlot, this.IsPlaceholder()) )
        {
            g_oTextMeasurer.SetFont(InfoMathText.Font);
            //g_oTextMeasurer.SetTextPr(InfoTextPr.CurrentTextPr, InfoTextPr.Theme);
        }
        else if(InfoMathText.CurrType == MathTextInfo_NormalText)
        {
            var FontKoef = InfoMathText.GetFontKoef(this.FontSlot);

            g_oTextMeasurer.SetFontSlot(this.FontSlot, FontKoef);
        }

        metricsTxt = oMeasure.MeasureCode(letter);

        if(bAccentIJ || this.RecalcInfo.bApostrophe)
            oMeasure.SetStringGid(false);
    }

    if(letter == 0x2061)
    {
        width = 0;
        height = 0;
        ascent = 0;

        this.RecalcInfo.bSpaceSpecial = true;
    }
    else
    {
        //  смещения
        this.rasterOffsetX = metricsTxt.rasterOffsetX;
        this.rasterOffsetY = metricsTxt.rasterOffsetY;

        ascent  =  metricsTxt.Ascent;
        descent = (metricsTxt.Height - metricsTxt.Ascent);
        height  =  ascent + descent;


        if(this.bJDraw)
            width = metricsTxt.WidthG;
        else
            width = metricsTxt.Width;
    }

    this.size.width  = width;
    this.size.height = height;
    this.size.ascent = ascent;

    this.Width = (this.size.width * TEXTWIDTH_DIVIDER) | 0;

};
CMathText.prototype.PreRecalc = function(Parent, ParaMath, ArgSize, RPI)
{
    this.ParaMath = ParaMath;
    if(!this.bJDraw)
        this.Parent = Parent;
    else
        this.Parent = null;
};
CMathText.prototype.Draw = function(x, y, pGraphics, InfoTextPr)
{
    var X = this.pos.x + x,
        Y = this.pos.y + y;

    if(this.bEmptyGapLeft == false)
        X += this.GapLeft;

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

    if(this.bJDraw)
    {
        pGraphics.FillTextCode(X, Y, this.RecalcInfo.StyleCode);    //на отрисовку символа отправляем положение baseLine
    }
    else if(this.RecalcInfo.bSpaceSpecial == false)
    {
        if( InfoTextPr.NeedUpdateFont(this.value, this.FontSlot, this.IsPlaceholder()) )
        {
            pGraphics.SetFont(InfoTextPr.Font);
            //pGraphics.SetTextPr(InfoTextPr.CurrentTextPr, InfoTextPr.Theme);
        }
        else if(InfoTextPr.CurrType == MathTextInfo_NormalText)
        {
            var FontKoef = InfoTextPr.GetFontKoef(this.FontSlot);
            pGraphics.SetFontSlot(this.FontSlot, FontKoef);
        }


        if(this.RecalcInfo.bAccentIJ ||  this.RecalcInfo.bApostrophe)
            pGraphics.tg(this.RecalcInfo.StyleCode, X, Y);
        else
            pGraphics.FillTextCode(X, Y, this.RecalcInfo.StyleCode);    //на отрисовку символа отправляем положение baseLine

    }
};
CMathText.prototype.setPosition = function(pos)
{
    if (!this.bJDraw)                      // for text
    {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
    }
    else                                    // for symbol only drawing
    {
        this.pos.x = pos.x - this.rasterOffsetX;
        this.pos.y = pos.y - this.rasterOffsetY + this.size.ascent;
    }
};
CMathText.prototype.Is_InclineLetter = function()
{
    var code = this.value;

    var bCapitale = (code > 0x0040 && code < 0x005B),
        bSmall = (code > 0x0060 && code < 0x007b) || code == 0x131 || code == 0x237;

    var bCapGreek   = (code > 0x0390 && code < 0x03AA),
        bSmallGreek = (code > 0x03B0 && code < 0x03CA);

    var bAlphabet    = bCapitale || bSmall || bCapGreek || bSmallGreek;

    var MPrp = this.Parent.GetCompiled_ScrStyles();

    var bRomanSerif  = (MPrp.sty == STY_BI || MPrp.sty == STY_ITALIC) && (MPrp.scr == TXT_ROMAN || MPrp.scr == TXT_SANS_SERIF),
        bScript      = MPrp.scr == TXT_SCRIPT;

    return bAlphabet && (bRomanSerif || bScript);
};
CMathText.prototype.IsJustDraw = function()
{
    return this.bJDraw;
};
CMathText.prototype.relate = function(Parent)
{
    this.Parent = Parent;
};
CMathText.prototype.IsAlignPoint = function()
{
    return false;
};
CMathText.prototype.IsText = function()
{
    return true;
};
CMathText.prototype.private_Is_BreakOperator = function(val)
{
    var bSimpleOper   = val == 0x2D || val == 0x2B || val == 0x3D || val == 0x2A || val == 0x2F || val == 0x5C || val == 0x3C || val == 0x3E || val == 0xB1 || val == 0x2213 || val == 0x2219,
        bArrows       = (val >= 0x2190 && val <= 0x21B3) || val == 0x21B6 || val == 0x21B7 || (val >= 0x21BA && val <= 0x21E9) || (val >= 0x21F4 && val <= 0x21FF),
        bOtherSymbols = (val >= 0x2234 && val <= 0x2237) || val == 0x2239 || (val >= 0x223B && val <= 0x228B) || (val >= 0x228F && val <= 0x2292) || (val >= 0x22A2 && val <= 0x22B9),
        bFishes       = (val >= 0x22C8 && val <= 0x22CD) || val == 0x22D0 ||val == 0x22D1 || (val >= 0x22D5 && val <= 0x22EE) || (val >= 0x22F0 && val <= 0x22FF) || (val >= 0x27F0 && val <= 0x297F ) || ( val >= 0x29CE && val <= 0x29D5);

    return bSimpleOper || bArrows || bOtherSymbols || bFishes;
};
CMathText.prototype.Is_CompareOperator = function()
{
    return this.value == 0x3C || this.value  == 0x3D || this.value  == 0x3E;
};
CMathText.prototype.Is_SpecilalOperator = function()
{
    var val = this.value,
        bSpecialOperator = val == 0x21 || val == 0x23 || (val >= 0x28 && val <= 0x2F) || (val >= 0x3A && val <= 0x3F) || (val >=0x5B && val <= 0x5F) || (val >= 0x7B && val <= 0xA1) || val == 0xAC || val == 0xB1 || val == 0xB7 || val == 0xBF || val == 0xD7 || val == 0xF7 || (val >= 0x2010 && val <= 0x2014) || val == 0x2016 || (val >= 0x2020 && val <= 0x2022) || val == 0x2026,
        bSpecialArrow    = val >= 0x2190 && val <= 0x21FF,
        bSpecialSymbols  = val == 0x2200 || val == 0x2201 || val == 0x2203 || val == 0x2204 || val == 0x2206|| (val >= 0x2208 && val <= 0x220D) || (val >= 0x220F && val <= 0x221E) || (val >= 0x2223 && val <= 0x223E) || (val >= 0x223F && val <= 0x22BD) || (val >= 0x22C0 && val <= 0x22FF) || val == 0x2305 || val == 0x2306 || (val >= 0x2308 && val <= 0x230B) || (val >= 0x231C && val <= 0x231F) || val == 0x2322 || val == 0x2323 || val == 0x2329 || val == 0x232A ||val == 0x233F || val == 0x23B0 || val == 0x23B1,
        bOtherArrows     = (val >= 0x27D1 && val <= 0x2980) || (val >= 0x2982 && val <= 0x299A) || (val >= 0x29B6 &&  val <= 0x29B9) || val == 0x29C0 || val == 0x29C1 || (val >= 0x29C4 && val <= 0x29C8) || (val >= 0x29CE && val <= 0x29DB) || val == 0x29DF || (val >= 0x29E1 && val <= 0x29E6) || val == 0x29EB || (val >= 0x29F4 && val <= 0x2AFF && val !== 0x2AE1 && val !== 0x2AF1) || (val >= 0x3014 && val <= 0x3017);

    // apostrophe
    // отдельно Cambria Math 0x27

    return bSpecialOperator || bSpecialArrow || bSpecialSymbols || bOtherArrows;
};
////
CMathText.prototype.setCoeffTransform = function(sx, shx, shy, sy)
{
    this.transform = {sx: sx, shx: shx, shy: shy, sy: sy};

    //здесь надо будет по-другому считать размер, после трансформации размер будет выставляться в g_oTextMeasurer
    //
    //MathControl.pGraph.transform(sx, shy, shx, sy, 0, 0);
    this.applyTransformation();

};
CMathText.prototype.applyTransformation = function()
{
    var sx = this.transform.sx, shx = this.transform.shx,
        shy = this.transform.shy, sy = this.transform.sy;
    sy = (sy < 0) ? -sy : sy;

    this.size.width = this.size.width*sx + (-1)*this.size.width*shx;
    this.size.height = this.size.height*sy + this.size.height*shy;
    this.size.ascent = this.size.ascent*(sy + shy);
    this.size.descent = this.size.descent*(sy + shy);
    this.size.center = this.size.center*(sy + shy);

};
CMathText.prototype.Copy = function()
{
    var NewLetter = new CMathText(this.bJDraw);
    NewLetter.Type  = this.Type;
    NewLetter.value = this.value;
    return NewLetter;
};
CMathText.prototype.Write_ToBinary = function(Writer)
{
    // Пишем тип дла раза, 1 раз для общей функции чтения, второй раз
    // для разделения обычного MathText от PlaceHolder
    Writer.WriteLong(this.Type);

    // Long : Type
    // Long : value
    Writer.WriteLong(this.Type);
    Writer.WriteLong(this.value) ;
};
CMathText.prototype.Read_FromBinary = function(Reader)
{
    this.Type  = Reader.GetLong();
    this.value = Reader.GetLong();
};


function CMathAmp()
{
    CMathAmp.superclass.constructor.call(this);

    this.bEqArray = false;
    this.Type = para_Math_Ampersand;

    this.value = 0x26;

    this.AmpText = new CMathText(false);
    this.AmpText.add(this.value);
}
Asc.extendClass(CMathAmp, CMathBaseText);
CMathAmp.prototype.Measure = function(oMeasure, TextPr, InfoMathText)
{
    this.bEqArray = InfoMathText.bEqArray;
    this.AmpText.Measure(oMeasure, TextPr, InfoMathText);

    if(this.bEqArray)
    {
        this.size.width  = 0;
        this.size.ascent = 0;
        this.size.height = 0;
    }
    else
    {
        this.size.width   = this.AmpText.size.width;
        this.size.height  = this.AmpText.size.height;
        this.size.ascent  = this.AmpText.size.ascent;
    }

    this.Width = (this.size.width * TEXTWIDTH_DIVIDER) | 0;
};
CMathAmp.prototype.PreRecalc = function(Parent, ParaMath, ArgSize, RPI)
{
    this.Parent = Parent;
    this.AmpText.PreRecalc(Parent, ParaMath, ArgSize, RPI);
};
CMathAmp.prototype.getCodeChr = function()
{
    var code = null;
    if(!this.bEqArray)
        code = this.AmpText.getCodeChr();

    return code;
};
CMathAmp.prototype.IsText = function()
{
    return !this.bEqArray;
};
CMathAmp.prototype.setPosition = function(pos)
{
    this.pos.x = pos.x;
    this.pos.y = pos.y;

    if(this.bEqArray == false)
        this.AmpText.setPosition(pos);
};
CMathAmp.prototype.relate = function(Parent)
{
    this.Parent = Parent;
    this.AmpText.relate(Parent);
};
CMathAmp.prototype.Draw = function(x, y, pGraphics, InfoTextPr)
{
    if(this.bEqArray==false)
        this.AmpText.Draw(x + this.GapLeft, y, pGraphics, InfoTextPr);
    else if(editor.ShowParaMarks) // показать метки выравнивания, если включена отметка о знаках параграфа
    {
        var X  = x + this.pos.x + this.Get_Width(),
            Y  = y + this.pos.y,
            Y2 = y + this.pos.y - this.AmpText.size.height;

        pGraphics.drawVerLine(0, X, Y, Y2, 0.1);
    }
};
CMathAmp.prototype.Is_InclineLetter = function()
{
    return false;
};
CMathAmp.prototype.IsAlignPoint = function()
{
    return this.bEqArray;
};
CMathAmp.prototype.Copy = function()
{
    return new CMathAmp();
};
CMathAmp.prototype.Write_ToBinary = function(Writer)
{
    // Long : Type
    Writer.WriteLong( this.Type );
};
CMathAmp.prototype.Read_FromBinary = function(Reader)
{
};

var MathTextInfo_MathText        = 1;
var MathTextInfo_SpecialOperator = 2;
var MathTextInfo_NormalText      = 3;

function CMathInfoTextPr(TextPr, ArgSize, bNormalText, bEqArray)
{
    this.CurrType         = -1; // в первый раз Font всегда выставляем
    this.TextPr           = TextPr;
    this.ArgSize          = ArgSize;
    this.Font =
    {
        FontFamily:     {Name:  "Cambria Math", Index : -1},
        FontSize:       TextPr.FontSize,
        Italic:         false,
        Bold:           false
    };

    this.bNormalText      = bNormalText;
    this.bEqArray        = bEqArray;

    this.RFontsCompare = [];

    // скопируем эти свойства для SetFontSlot
    // для SpecialOperator нужны уже скомпилированные для мат текста текстовые настройки, поэтому важно эи свойства скопировать именно здесь, а не передавать в MathText обычные текст. настройки

    this.RFontsCompare[fontslot_ASCII]    = undefined !== this.TextPr.RFonts.Ascii && this.TextPr.RFonts.Ascii.Name == "Cambria Math";
    this.RFontsCompare[fontslot_HAnsi]    = undefined !== this.TextPr.RFonts.HAnsi && this.TextPr.RFonts.HAnsi.Name == "Cambria Math";
    this.RFontsCompare[fontslot_CS]       = undefined !== this.TextPr.RFonts.CS && this.TextPr.RFonts.CS.Name == "Cambria Math";
    this.RFontsCompare[fontslot_EastAsia] = undefined !== this.TextPr.RFonts.EastAsia && this.TextPr.RFonts.EastAsia.Name == "Cambria Math";

}
CMathInfoTextPr.prototype.NeedUpdateFont = function(code, fontSlot, IsPlaceholder)
{
    var NeedUpdateFont = false;
    var bMathText = this.bNormalText == false || IsPlaceholder;
    var Type;

    if(bMathText && (this.RFontsCompare[fontSlot] == true || IsPlaceholder))
        Type = MathTextInfo_MathText;
    else if(bMathText && this.RFontsCompare[fontSlot] == false && this.IsSpecilalOperator(code))
        Type = MathTextInfo_SpecialOperator;
    else
        Type = MathTextInfo_NormalText;

    var bChangeType = this.CurrType !== MathTextInfo_MathText && this.CurrType !== MathTextInfo_SpecialOperator; // -1 or MathTextInfo_NormalText

    if(bChangeType && Type !== MathTextInfo_NormalText)
    {
        this.Font.FontSize = fontSlot !== fontslot_CS ? this.TextPr.FontSize : this.TextPr.FontSizeCS;
        this.Font.FontSize *= this.GetFontKoef(fontSlot);

        NeedUpdateFont = true;
    }

    this.CurrType = Type;

    return NeedUpdateFont;
};
CMathInfoTextPr.prototype.GetFontKoef = function(fontSlot)
{
    var FontSize = fontSlot == fontslot_CS ? this.TextPr.FontSizeCS : this.TextPr.FontSize;

    return MatGetKoeffArgSize(FontSize, this.ArgSize);
};
CMathInfoTextPr.prototype.GetFontSlot = function(code)
{
    var Hint = this.TextPr.RFonts.Hint;
    var bCS  = this.TextPr.CS;
    var bRTL = this.TextPr.RTL;
    var lcid = this.TextPr.Lang.EastAsia;

    return g_font_detector.Get_FontClass(code, Hint, lcid, bCS, bRTL);
};
CMathInfoTextPr.prototype.IsSpecilalOperator = function(val)
{
    var bSpecialOperator = val == 0x21 || val == 0x23 || (val >= 0x28 && val <= 0x2F) || (val >= 0x3A && val <= 0x3F) || (val >=0x5B && val <= 0x5F) || (val >= 0x7B && val <= 0xA1) || val == 0xAC || val == 0xB1 || val == 0xB7 || val == 0xBF || val == 0xD7 || val == 0xF7 || (val >= 0x2010 && val <= 0x2014) || val == 0x2016 || (val >= 0x2020 && val <= 0x2022) || val == 0x2026,
        bSpecialArrow    = val >= 0x2190 && val <= 0x21FF,
        bSpecialSymbols  = val == 0x2200 || val == 0x2201 || val == 0x2203 || val == 0x2204 || val == 0x2206|| (val >= 0x2208 && val <= 0x220D) || (val >= 0x220F && val <= 0x221E) || (val >= 0x2223 && val <= 0x223E) || (val >= 0x223F && val <= 0x22BD) || (val >= 0x22C0 && val <= 0x22FF) || val == 0x2305 || val == 0x2306 || (val >= 0x2308 && val <= 0x230B) || (val >= 0x231C && val <= 0x231F) || val == 0x2322 || val == 0x2323 || val == 0x2329 || val == 0x232A ||val == 0x233F || val == 0x23B0 || val == 0x23B1,
        bOtherArrows     = (val >= 0x27D1 && val <= 0x2980) || (val >= 0x2982 && val <= 0x299A) || (val >= 0x29B6 &&  val <= 0x29B9) || val == 0x29C0 || val == 0x29C1 || (val >= 0x29C4 && val <= 0x29C8) || (val >= 0x29CE && val <= 0x29DB) || val == 0x29DF || (val >= 0x29E1 && val <= 0x29E6) || val == 0x29EB || (val >= 0x29F4 && val <= 0x2AFF && val !== 0x2AE1 && val !== 0x2AF1) || (val >= 0x3014 && val <= 0x3017);

    // apostrophe GetMathModifiedFont
    // отдельно Cambria Math 0x27

    return bSpecialOperator || bSpecialArrow || bSpecialSymbols || bOtherArrows;
};