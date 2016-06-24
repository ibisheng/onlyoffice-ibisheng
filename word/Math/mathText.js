/*
 * (c) Copyright Ascensio System SIA 2010-2016
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

// Import
var g_oTextMeasurer = AscCommon.g_oTextMeasurer;

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

var MathTextInfo_MathText        = 1;
var MathTextInfo_SpecialOperator = 2;
var MathTextInfo_NormalText      = 3;

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
    this.bUpdateGaps    = true;

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
    var PosLine = this.ParaMath.GetLinePosition(PDSE.Line, PDSE.Range);
    this.Draw(PosLine.x, PosLine.y, PDSE.Graphics);
};
CMathBaseText.prototype.SetUpdateGaps = function(bUpd)
{
    this.bUpdateGaps = bUpd;
};
CMathBaseText.prototype.IsNeedUpdateGaps = function()
{
    return this.bUpdateGaps;
};

/**
 *
 * @param bJDraw
 * @constructor
 * @extends {CMathBaseText}
 */
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
AscCommon.extendClass(CMathText, CMathBaseText);
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
    else if(!bNormal && code == 0x27) // " ' "
        code = 0x2032;
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

        var letter = this.private_getCode();

        this.FontSlot = InfoMathText.GetFontSlot(letter); // возвращает fontslot_ASCII || fontslot_EastAsia || fontslot_CS || fontslot_HAnsi

        // в не математическом тексте i и j не подменяются на i и j без точек
        var bAccentIJ = !InfoMathText.bNormalText && this.Parent.IsAccent() && (this.value == 0x69 || this.value == 0x6A);

        this.RecalcInfo.StyleCode   = letter;
        this.RecalcInfo.bAccentIJ   = bAccentIJ;

        var bApostrophe = 1 == q_Math_Apostrophe[letter] && this.bJDraw == false;

        if(bAccentIJ)
            oMeasure.SetStringGid(true);

        if( InfoMathText.NeedUpdateFont(letter, this.FontSlot, this.IsPlaceholder(), bApostrophe) )
        {
            g_oTextMeasurer.SetFont(InfoMathText.Font);
            //g_oTextMeasurer.SetTextPr(InfoTextPr.CurrentTextPr, InfoTextPr.Theme);
        }
        else if(InfoMathText.CurrType == MathTextInfo_NormalText)
        {
            var FontKoef = InfoMathText.GetFontKoef(this.FontSlot);

            g_oTextMeasurer.SetFontSlot(this.FontSlot, FontKoef);
        }

        this.RecalcInfo.bApostrophe   = InfoMathText.bApostrophe;
        this.RecalcInfo.bSpaceSpecial = letter == 0x2061;

        metricsTxt = oMeasure.MeasureCode(letter);

        if(bAccentIJ)
            oMeasure.SetStringGid(false);
    }

    if(this.RecalcInfo.bApostrophe)
    {
        width   =  metricsTxt.Width;
        height  = metricsTxt.Height;

        InfoMathText.NeedUpdateFont(0x1D44E, this.FontSlot, false, false);  // a
        g_oTextMeasurer.SetFont(InfoMathText.Font);

        var metricsA = oMeasure.MeasureCode(0x1D44E);   // a
        this.rasterOffsetY = metricsA.Height - metricsTxt.Ascent; // смещение для позиции

        ascent  =  metricsA.Height;
    }
    else if(this.RecalcInfo.bSpaceSpecial)
    {
        width = 0;
        height = 0;
        ascent = 0;
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
CMathText.prototype.PreRecalc = function(Parent, ParaMath)
{
    this.ParaMath = ParaMath;
    if(!this.bJDraw)
        this.Parent = Parent;
    else
        this.Parent = null;

    this.bUpdateGaps = false;
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
        if( InfoTextPr.NeedUpdateFont(this.RecalcInfo.StyleCode, this.FontSlot, this.IsPlaceholder(), this.RecalcInfo.bApostrophe) )
        {
            pGraphics.SetFont(InfoTextPr.Font);
            //pGraphics.SetTextPr(InfoTextPr.CurrentTextPr, InfoTextPr.Theme);
        }
        else if(InfoTextPr.CurrType == MathTextInfo_NormalText)
        {
            var FontKoef = InfoTextPr.GetFontKoef(this.FontSlot);
            pGraphics.SetFontSlot(this.FontSlot, FontKoef);
        }

        if(this.RecalcInfo.bAccentIJ)
            pGraphics.tg(this.RecalcInfo.StyleCode, X, Y);
        else
            pGraphics.FillTextCode(X, Y, this.RecalcInfo.StyleCode);    //на отрисовку символа отправляем положение baseLine
    }
};
CMathText.prototype.setPosition = function(pos)
{
    if(this.RecalcInfo.bApostrophe == true)
    {
        this.pos.x = pos.x;
        this.pos.y = pos.y - this.rasterOffsetY;
    }
    else if (this.bJDraw == false)                      // for text
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
CMathText.prototype.GetLocationOfLetter = function()
{
    var pos = new CMathPosition();

    if(this.RecalcInfo.bApostrophe)
    {
        pos.x = this.pos.x;
        pos.y = this.pos.y - this.size.ascent;
    }
    else
    {
        pos.x = this.pos.x;
        pos.y = this.pos.y;
    }

    return pos;
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
    var rOper = q_Math_BreakOperators[val];

    return rOper == 1 || rOper == 2;
};
CMathText.prototype.Is_CompareOperator = function()
{
    return q_Math_BreakOperators[this.value] == 2;
};
CMathText.prototype.Is_LeftBracket = function()
{
    return this.value == 0x28 || this.value == 0x7B || this.value == 0x5B || this.value == 0x27E8 || this.value == 0x230A || this.value == 0x2308 || this.value == 0x27E6 || this.value == 0x2329;
};
CMathText.prototype.Is_RightBracket = function()
{
    return this.value == 0x29 || this.value == 0x7D || this.value == 0x5D || this.value == 0x27E9 || this.value == 0x230B || this.value == 0x2309 || this.value == 0x27E7 || this.value == 0x232A;
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
CMathText.prototype.Is_LetterCS = function()
{
    return this.FontSlot == fontslot_CS;
};
/*CMathText.prototype.Recalculate_Reset = function(StartRange, StartLine, PRS)
{
    var bNotUpdate = PRS !== null && PRS!== undefined && PRS.bFastRecalculate == true;
    if(bNotUpdate == false)
    {
        this.StartLine   = StartLine;
        this.StartRange  = StartRange;

        this.protected_ClearLines();
    }
};
CMathText.prototype.Recalculate_Range = function(PRS, ParaPr, Depth)
{
    var CurLine  = PRS.Line - this.StartLine;
    var CurRange = ( 0 === CurLine ? PRS.Range - this.StartRange : PRS.Range );

    var RangeStartPos = this.protected_AddRange(CurLine, CurRange);
    this.protected_FillRange(CurLine, CurRange, RangeStartPos, RangeEndPos);
};*/

/**
 *
 * @constructor
 * @extends {CMathBaseText}
 */
function CMathAmp()
{
    CMathAmp.superclass.constructor.call(this);

    this.bAlignPoint = false;
    this.Type = para_Math_Ampersand;

    this.value = 0x26;

    this.AmpText = new CMathText(false);
    this.AmpText.add(this.value);
}
AscCommon.extendClass(CMathAmp, CMathBaseText);
CMathAmp.prototype.Measure = function(oMeasure, TextPr, InfoMathText)
{
    this.bAlignPoint = InfoMathText.bEqArray == true && InfoMathText.bNormalText == false;
    this.AmpText.Measure(oMeasure, TextPr, InfoMathText);

    if(this.bAlignPoint)
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

    this.bUpdateGaps = false;
};
CMathAmp.prototype.getCodeChr = function()
{
    var code = null;
    if(!this.bAlignPoint)
        code = this.AmpText.getCodeChr();

    return code;
};
CMathAmp.prototype.IsText = function()
{
    return !this.bAlignPoint;
};
CMathAmp.prototype.setPosition = function(pos)
{
    this.pos.x = pos.x;
    this.pos.y = pos.y;

    if(this.bAlignPoint == false)
        this.AmpText.setPosition(pos);
};
CMathAmp.prototype.relate = function(Parent)
{
    this.Parent = Parent;
    this.AmpText.relate(Parent);
};
CMathAmp.prototype.Draw = function(x, y, pGraphics, InfoTextPr)
{
    if(this.bAlignPoint == false)
        this.AmpText.Draw(x + this.GapLeft, y, pGraphics, InfoTextPr);
    else if(editor.ShowParaMarks) // показать метки выравнивания, если включена отметка о знаках параграфа
    {
        var X  = x + this.pos.x + this.Get_WidthVisible(),
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
    return this.bAlignPoint;
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

function CMathInfoTextPr(InfoTextPr)
{
    this.CurrType         = -1; // в первый раз Font всегда выставляем

    this.TextPr           = InfoTextPr.TextPr;
    this.ArgSize          = InfoTextPr.ArgSize;
    this.bApostrophe      = false;
    this.Font =
    {
        FontFamily:     {Name:  "Cambria Math", Index : -1},
        FontSize:       this.TextPr.FontSize,
        Italic:         false,
        Bold:           false
    };

    this.bNormalText     = InfoTextPr.bNormalText;
    this.bEqArray        = InfoTextPr.bEqArray;

    this.RFontsCompare = [];

    // скопируем эти свойства для SetFontSlot
    // для SpecialOperator нужны уже скомпилированные для мат текста текстовые настройки, поэтому важно эи свойства скопировать именно здесь, а не передавать в MathText обычные текст. настройки

    this.RFontsCompare[fontslot_ASCII]    = undefined !== this.TextPr.RFonts.Ascii && this.TextPr.RFonts.Ascii.Name == "Cambria Math";
    this.RFontsCompare[fontslot_HAnsi]    = undefined !== this.TextPr.RFonts.HAnsi && this.TextPr.RFonts.HAnsi.Name == "Cambria Math";
    this.RFontsCompare[fontslot_CS]       = undefined !== this.TextPr.RFonts.CS && this.TextPr.RFonts.CS.Name == "Cambria Math";
    this.RFontsCompare[fontslot_EastAsia] = undefined !== this.TextPr.RFonts.EastAsia && this.TextPr.RFonts.EastAsia.Name == "Cambria Math";
}
CMathInfoTextPr.prototype.NeedUpdateFont = function(code, fontSlot, IsPlaceholder, IsApostrophe)
{
    var NeedUpdateFont = false;
    var bMathText = this.bNormalText == false || IsPlaceholder === true;
    var Type;

    if(bMathText && (this.RFontsCompare[fontSlot] == true || IsPlaceholder))
        Type = MathTextInfo_MathText;
    else if(bMathText && this.RFontsCompare[fontSlot] == false && true === this.IsSpecilalOperator(code))
        Type = MathTextInfo_SpecialOperator;
    else
        Type = MathTextInfo_NormalText;

    var ArgSize = this.ArgSize;

    // CurrType -1 or MathTextInfo_NormalText
    if(this.CurrType !== MathTextInfo_MathText && this.CurrType !== MathTextInfo_SpecialOperator && Type !== MathTextInfo_NormalText)
    {
        NeedUpdateFont = true;
    }

    this.CurrType = Type;

    if(this.bApostrophe !== IsApostrophe && this.ArgSize < 0 && Type !== MathTextInfo_NormalText)
    {
        ArgSize = IsApostrophe == true ? 1 : this.ArgSize;
        this.bApostrophe = IsApostrophe;

        NeedUpdateFont = true;
    }

    if(NeedUpdateFont == true)
    {
        var FontSize = this.private_GetFontSize(fontSlot);
        var coeff = MatGetKoeffArgSize(FontSize, ArgSize);

        this.Font.FontSize = FontSize*coeff;
    }

    return NeedUpdateFont;
};
CMathInfoTextPr.prototype.private_GetFontSize = function(fontSlot)
{
    return fontSlot == fontslot_CS ? this.TextPr.FontSizeCS : this.TextPr.FontSize;
};
CMathInfoTextPr.prototype.GetFontKoef = function(fontSlot)
{
    var FontSize = this.private_GetFontSize(fontSlot);
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
    var bSpecialOperator = false;

    // символы из интервала val >= 0x2E2 && val <= 0x36F есть, как правило, в шрифтах и используют именно их, а не заменяют символами из Cambria Math
    if(val >= 0x2190 && val <= 0x21E9)
    {
        bSpecialOperator = q_Math_Arrows[val] !== 0;
    }
    else if(val >= 0x21F4 && val <= 0x22FF)
    {
        bSpecialOperator = q_Math_SpecialEquals[val] !== 0;
    }
    else if(val >= 0x2701 && val <= 0x299A)
    {
        bSpecialOperator = val !== 0x2981;
    }
    else if(val >= 0x29F4 && val <= 0x2AFF)
    {
        bSpecialOperator = val !== 0x2AE1 && val !== 0x2AF1;
    }
    else
    {
        bSpecialOperator = q_Math_SpecialSymbols[val] == 1;
    }

    return bSpecialOperator;

};

var q_Math_Arrows =
{
    0x21B4: 0, 0x21B5: 0, 0x21B8: 0, 0x21B9: 0
};
var q_Math_SpecialEquals =
{
    0x2205: 0, 0x220E: 0, 0x221F: 0, 0x2220: 0, 0x2221: 0, 0x2222: 0, 0x223F: 0, 0x22BE: 0, 0x22BF: 0, 0x22A4: 0
};
var q_Math_SpecialSymbols =
{
    0x0021: 1, 0x0023: 1, 0x0028: 1, 0x0029: 1, 0x002A: 1, 0x002B: 1, 0x002C: 1, 0x002D: 1, 0x002E: 1, 0x002F: 1,
    0x003A: 1, 0x003B: 1, 0x003C: 1, 0x003D: 1, 0x003E: 1, 0x003F: 1, 0x005B: 1, 0x005C: 1, 0x005D: 1, 0x005E: 1,
    0x005F: 1, 0x007B: 1, 0x007C: 1, 0x007D: 1, 0x007E: 1, 0x00A1: 1, 0x00AC: 1, 0x00B1: 1, 0x00B7: 1, 0X00BF: 1,
    0x00D7: 1, 0x00F7: 1, 0x2010: 1, 0x2012: 1, 0x2013: 1, 0x2014: 1, 0x2016: 1, 0x2020: 1, 0x2021: 1, 0x2022: 1,
    0x2026: 1, 0x2140: 1, 0x2145: 1, 0x2146: 1, 0x2147: 1, 0x2148: 1, 0x2149: 1,
    0x2305: 1, 0x2306: 1, 0x2308: 1, 0x2309: 1, 0x230A: 1, 0x230B: 1, 0x231C: 1, 0x231D: 1, 0x231E: 1, 0x231F: 1,
    0x2322: 1, 0x2323: 1, 0x2329: 1, 0x232A: 1, 0x233D: 1, 0x233F: 1, 0x23B0: 1, 0x23B1: 1,
    0x29B6: 1, 0x29B7: 1, 0x29B8: 1, 0x29B9: 1, 0x29C0: 1, 0x29C1: 1, 0x29C4: 1, 0x29C5: 1, 0x29C6: 1, 0x29C7: 1,
    0x29C8: 1, 0x29CE: 1, 0x29CF: 1, 0x29D0: 1, 0x29D1: 1, 0x29D2: 1, 0x29D3: 1, 0x29D4: 1, 0x29D5: 1, 0x29D6: 1,
    0x29D7: 1, 0x29D8: 1, 0x29D9: 1, 0x29DA: 1, 0x29DB: 1, 0x29DF: 1, 0x29E1: 1, 0x29E2: 1, 0x29E3: 1, 0x29E4: 1,
    0x29E5: 1, 0x29E6: 1, 0x29EB: 1, 0x3014: 1, 0x3015: 1, 0x3016: 1, 0x3017: 1,
    0x1DC0: 1, 0x1DC1: 1, 0x1DC2: 1, 0x1DC3: 1
};
var q_Math_Apostrophe =
{
    0x2032: 1, 0x2033: 1,  0x2034 : 1, 0x2057: 1
};
var q_Math_BreakOperators =
{
    0x002A:	1, 0x002B:	1, 0x002D:	1, 0x002F:	1,0x003C:	2, 0x003D:	2,
    0x003E:	2, 0x005C:	1, 0x00B1:  1, 0x2190:	2, 0x2191:	2, 0x2192:	2,
    0x2193:	2,
    0x2194:	2, 0x2195:	2, 0x2196:	2, 0x2197:	2,0x2198:	2, 0x2199:	2,
    0x219A:	2, 0x219B:	2, 0x219C:	2, 0x219D:	2,0x219E:	2, 0x219F:	2,
    0x21A0:	2, 0x21A1:	2, 0x21A2:	2, 0x21A3:	2, 0x21A4:	2, 0x21A5:	2,
    0x21A6:	2, 0x21A7:	2, 0x21A8:	2, 0x21A9:	2, 0x21AA:	2, 0x21AB:	2,
    0x21AC:	2, 0x21AD:	2, 0x21AE:	2, 0x21AF:	2, 0x21B0:	2, 0x21B1:	2,
    0x21B2:	2, 0x21B3:	2,
    // check
    0x21B6:	2, 0x21B7:	2, 0x21BA:	2, 0x21BB:	2, 0x21BC:	2, 0x21BD:	2,
    0x21BE:	2, 0x21BF:	2, 0x21C0:	2, 0x21C1:	2, 0x21C2:	2, 0x21C3:	2,
    0x21C4:	2, 0x21C5:	2, 0x21C6:	2, 0x21C7:	2, 0x21C8:	2, 0x21C9:	2,
    0x21CA:	2, 0x21CB:	2, 0x21CC:	2, 0x21CD:	2, 0x21CE:	2, 0x21CF:	2,
    0x21D0:	2, 0x21D1:	2, 0x21D2:	2, 0x21D3:	2, 0x21D4:	2, 0x21D5:	2,
    0x21D6:	2, 0x21D7:	2, 0x21D8:	2, 0x21D9:	2, 0x21DA:	2, 0x21DB:	2,
    0x21DC:	2, 0x21DD:	2, 0x21DE:	2, 0x21DF:	2, 0x21E0:	2, 0x21E1:	2,
    0x21E2:	2, 0x21E3:	2, 0x21E4:	2, 0x21E5:	2, 0x21E6:	2, 0x21E7:	2,
    0x21E8:	2, 0x21E9:	2, 0x21F4:	2, 0x21F5:	2, 0x21F6:	2, 0x21F7:	2,
    0x21F8:	2, 0x21F9:	2, 0x21FA:	2, 0x21FB:	2, 0x21FC:	2, 0x21FD:	2,
    0x21FE:	2, 0x21FF:	2, 0x2208:	2, 0x2209:	2, 0x220A:	2, 0x220B:	2,
    0x220C:	2, 0x220D:	2, 0x2212:	1, 0x2213:	1, 0x2214:	1, 0x2215:	1,
    0x2216:	1, 0x2217:	1, 0x2218:	1, 0x2219:	1, 0x221D:	2, 0x2223:	2,
    0x2224:	2, 0x2225:	2, 0x2226:	2, 0x2227:	1, 0x2228:	1, 0x2229:	1,
    0x222A:	1, 0x2234:	2, 0x2235:	2, 0x2236:	2, 0x2237:	2, 0x2238:	1,
    0x2239:	2, 0x223A:	1, 0x223B:	2, 0x223C:	2, 0x223D:	2, 0x223E:	2,
    0x2240:	1, 0x2241:	2, 0x2242:	2, 0x2243:	2, 0x2244:	2, 0x2245:	2,
    0x2246:	2, 0x2247:	2, 0x2248:	2, 0x2249:	2, 0x224A:	2, 0x224B:	2,
    0x224C:	2, 0x224D:	2, 0x224E:	2, 0x224F:	2, 0x2250:	2, 0x2251:	2,
    0x2252:	2, 0x2253:	2, 0x2254:	2, 0x2255:	2, 0x2256:	2, 0x2257:	2,
    0x2258:	2, 0x2259:	2, 0x225A:	2, 0x225B:	2, 0x225C:	2, 0x225D:	2,
    0x225E:	2, 0x225F:	2, 0x2260:	2, 0x2261:	2, 0x2262:	2, 0x2263:	2,
    0x2264:	2, 0x2265:	2, 0x2266:	2, 0x2267:	2, 0x2268:	2, 0x2269:	2,
    0x226A:	2, 0x226B:	2, 0x226C:	2, 0x226D:	2, 0x226E:	2, 0x226F:	2,
    0x2270:	2, 0x2271:	2, 0x2272:	2, 0x2273:	2, 0x2274:	2, 0x2275:	2,
    0x2276:	2, 0x2277:	2, 0x2278:	2, 0x2279:	2, 0x227A:	2, 0x227B:	2,
    0x227C:	2, 0x227D:	2, 0x227E:	2, 0x227F:	2, 0x2280:	2, 0x2281:	2,
    0x2282:	2, 0x2283:	2, 0x2284:	2, 0x2285:	2, 0x2286:	2, 0x2287:	2,
    0x2288:	2, 0x2289:	2, 0x228A:	2, 0x228B:	2, 0x228C:	1, 0x228D:	1,
    0x228E:	1, 0x228F:	2, 0x2290:	2, 0x2291:	2, 0x2292:	2, 0x2293:	1,
    0x2294:	1, 0x2295:  1, 0x2296:  1, 0x2297:  1, 0x2298:  1, 0x2299:  1,
    0x229A: 1, 0x229B:  1, 0x229C:  1, 0x229D:  1, 0x229E:  1, 0x229F:  1,
    0x22A0: 1, 0x22A1:  1, 0x22A2:  2, 0x22A3:  2, 0x22A5:  2, 0x22A6:  2,
    0x22A7: 2, 0x22A8:  2, 0x22A9:  2, 0x22AA:  2, 0x22AB:  2, 0x22AC:  2,
    0x22AD: 2, 0x22AE:  2, 0x22AF:  2, 0x22B0:  2, 0x22B1:  2, 0x22B2:  2,
    0x22B3: 2, 0x22B4:  2, 0x22B5:  2, 0x22B6:  2, 0x22B7:  2, 0x22B8:  2,
    0x22B9: 2, 0x22BA:  1, 0x22BB:  1, 0x22BC:  1, 0x22BD:  1, 0x22C4:  1,
    0x22C5: 1, 0x22C6:  1, 0x22C7:  1, 0x22C8:  2, 0x22C9:  1, 0x22CA:  1,
    0x22CB: 1, 0x22CC:  1, 0x22CD:  2, 0x22CE:  1, 0x22CF:  1, 0x22D0:	2,
    0x22D1:	2, 0x22D2:	1, 0x22D3:	1, 0x22D4:	2,
    0x22D5:	2, 0x22D6:	2, 0x22D7:	2, 0x22D8:	2, 0x22D9:	2, 0x22DA:	2,
    0x22DB:	2, 0x22DC:	2, 0x22DD:	2, 0x22DE:	2, 0x22DF:	2, 0x22E0:	2,
    0x22E1:	2, 0x22E2:	2, 0x22E3:	2, 0x22E4:	2, 0x22E5:	2, 0x22E6:	2,
    0x22E7:	2, 0x22E8:	2, 0x22E9:	2, 0x22EA:	2, 0x22EB:	2, 0x22EC:  2,
    0x22ED: 2, 0x22EE:  2, 0x22EF:  2, 0x22F0:  2, 0x22F1:  2, 0x22F2:  2,
    0x22F3: 2, 0x22F4:  2, 0x22F5:  2, 0x22F6:  2, 0x22F7:  2, 0x22F8:  2,
    0x22F9: 2, 0x22FA:  2, 0x22FB:  2, 0x22FC:  2, 0x22FD:  2, 0x22FE:  2,
    0x22FF: 2, 0x2305:  1, 0x2306:  1, 0x2322:  2, 0x2323:  2, 0x233D:  1,
    0x233F: 2, 0x23B0:  2, 0x23B1:  2, 0x25B3:  1, 0x25CA:  1, 0x25CB:  1,
    0x27D1: 1, 0x27D2:  2, 0x27D3:  2, 0x27D4:  2, 0x27DA:  2, 0x27DB:  2,
    0x27DC:	2, 0x27DD:	2, 0x27DE:	2, 0x27DF:  2, 0x27E0:  1, 0x27E1:  1,
    0x27E2: 1, 0x27E3:  1, 0x27E4:  1, 0x27E5:  1, 0x27F0:  2, 0x27F1:  2,
    0x27F2: 2, 0x27F3:  2, 0x27F4:  2,
    //end check
    0x27F5:	2, 0x27F6:	2, 0x27F7:	2, 0x27F8:	2, 0x27F9:	2, 0x27FA:	2,
    0x27FB:	2, 0x27FC:	2, 0x27FD:	2, 0x27FE:	2, 0x27FF:	2, 0x2900:	2,
    0x2901:	2, 0x2902:	2, 0x2903:	2, 0x2904:	2, 0x2905:	2, 0x2906:	2,
    0x2907:	2, 0x2908:	2, 0x2909:	2, 0x290A:	2, 0x290B:	2, 0x290C:	2,
    0x290D:	2, 0x290E:	2, 0x290F:	2, 0x2910:	2, 0x2911:	2, 0x2912:	2,
    0x2913:	2, 0x2914:	2, 0x2915:	2, 0x2916:	2, 0x2917:	2, 0x2918:	2,
    0x2919:	2, 0x291A:	2, 0x291B:	2, 0x291C:	2, 0x291D:	2, 0x291E:	2,
    0x291F:	2, 0x2920:	2, 0x2921:	2, 0x2922:	2, 0x2923:	2, 0x2924:	2,
    0x2925:	2, 0x2926:	2, 0x2927:	2, 0x2928:	2, 0x2929:	2, 0x292A:	2,
    0x292B:	2, 0x292C:	2, 0x292D:	2, 0x292E:	2, 0x292F:	2, 0x2930:	2,
    0x2931:	2, 0x2932:	2, 0x2933:	2, 0x2934:	2, 0x2935:	2, 0x2936:	2,
    0x2937:	2, 0x2938:	2, 0x2939:	2, 0x293A:	2, 0x293B:	2, 0x293C:	2,
    0x293D:	2, 0x293E:	2, 0x293F:	2, 0x2940:	2, 0x2941:	2, 0x2942:	2,
    0x2943:	2, 0x2944:	2, 0x2945:	2, 0x2946:	2, 0x2947:	2, 0x2948:	2,
    0x2949:	2, 0x294A:	2, 0x294B:	2, 0x294C:	2, 0x294D:	2, 0x294E:	2,
    0x294F:	2, 0x2950:	2, 0x2951:	2, 0x2952:	2, 0x2953:	2, 0x2954:	2,
    0x2955:	2, 0x2956:	2, 0x2957:	2, 0x2958:	2, 0x2959:	2, 0x295A:	2,
    0x295B:	2, 0x295C:	2, 0x295D:	2, 0x295E:	2, 0x295F:	2, 0x2960:	2,
    0x2961:	2, 0x2962:	2, 0x2963:	2, 0x2964:	2, 0x2965:	2, 0x2966:	2,
    0x2967:	2, 0x2968:	2, 0x2969:	2, 0x296A:	2, 0x296B:	2, 0x296C:	2,
    0x296D:	2, 0x296E:	2, 0x296F:	2, 0x2970:	2, 0x2971:	2, 0x2972:	2,
    0x2973:	2, 0x2974:	2, 0x2975:	2, 0x2976:	2, 0x2977:	2, 0x2978:	2,
    0x2979:	2, 0x297A:	2, 0x297B:	2, 0x2A52:	1, 0x2A53:	1, 0x2A54:	1,
    0x2A55:	1, 0x2A56:	1, 0x2A57:	1, 0x2A58:	1, 0x2A59:	1, 0x2A5A:	1,
    0x2A5B:	1, 0x2A5C:	1, 0x2A5D:	1, 0x2A5E:	1, 0x2A5F:	1, 0x2A60:	1,
    0x2A61:	1, 0x2A62:	1, 0x2A63:	1, 0x2A64:	1, 0x2A65:	1, 0x2A66:	2,
    0x2A67:	2, 0x2A68:	2, 0x2A69:	2, 0x2A6A:	2, 0x2A6B:	2, 0x2A6C:	2,
    0x2A6D:	2, 0x2A6E:	2, 0x2A6F:	2, 0x2A70:	2, 0x2A71:	1, 0x2A72:	1,
    0x2A73:	2, 0x2A74:	2, 0x2A75:	2, 0x2A76:	2, 0x2A77:	2, 0x2A78:	2,
    0x2A79:	2, 0x2A7A:	2, 0x2A7B:	2, 0x2A7C:	2, 0x2A7D:	2, 0x2A7E:	2,
    0x2A7F:	2, 0x2A80:	2, 0x2A81:	2, 0x2A82:	2, 0x2A83:	2, 0x2A84:	2,
    0x2A85:	2, 0x2A86:	2, 0x2A87:	2, 0x2A88:	2, 0x2A89:	2, 0x2A8A:	2,
    0x2A8B:	2, 0x2A8C:	2, 0x2A8D:	2, 0x2A8E:	2, 0x2A8F:	2, 0x2A90:	2,
    0x2A91:	2, 0x2A92:	2, 0x2A93:	2, 0x2A94:	2, 0x2A95:	2, 0x2A96:	2,
    0x2A97:	2, 0x2A98:	2, 0x2A99:	2, 0x2A9A:	2, 0x2A9B:	2, 0x2A9C:	2,
    0x2A9D:	2, 0x2A9E:	2, 0x2A9F:	2, 0x2AA0:	2, 0x2AA1:	2, 0x2AA2:	2,
    0x2AA3:	2, 0x2AA4:	2, 0x2AA5:	2, 0x2AA6:	2, 0x2AA7:	2, 0x2AA8:	2,
    0x2AA9:	2, 0x2AAA:	2, 0x2AAB:	2, 0x2AAC:	2, 0x2AAD:	2, 0x2AAE:	2,
    0x2AAF:	2, 0x2AB0:	2, 0x2AB1:	2, 0x2AB2:	2, 0x2AB3:	2, 0x2AB4:	2,
    0x2AB5:	2, 0x2AB6:	2, 0x2AB7:	2, 0x2AB8:	2, 0x2AB9:	2, 0x2ABA:	2,
    0x2ABB:	2, 0x2ABC:	2, 0x2ABD:	2, 0x2ABE:	2, 0x2ABF:	2, 0x2AC0:	2,
    0x2AC1:	2, 0x2AC2:	2, 0x2AC3:	2, 0x2AC4:	2, 0x2AC5:	2, 0x2AC6:	2,
    0x2AC7:	2, 0x2AC8:	2, 0x2AC9:	2, 0x2ACA:	2, 0x2ACB:	2, 0x2ACC:	2,
    0x2ACD:	2, 0x2ACE:	2, 0x2ACF:	2, 0x2AD0:	2, 0x2AD1:	2, 0x2AD2:	2,
    0x2AD3:	2, 0x2AD4:	2, 0x2AD5:	2, 0x2AD6:	2, 0x2AD7:	2, 0x2AD8:	2,
    0x2AD9:	2, 0x2ADA:	2, 0x2ADB:	2, 0x2ADC:	2, 0x2ADD:	2,
    0x00D7: 1, 0x00F7:  1
};


