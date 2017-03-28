/*
 * (c) Copyright Ascensio System SIA 2010-2017
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

// Содержимое параграфа должно иметь:
//
// 1. Type    - тип
// 2. Draw    - рисуем на контексте
// 3. Measure  - измеряем
// 4. Is_RealContent - является ли данный элемент реальным элементом параграфа
//---- после использования Measure -----
// 1. Width        - ширина (для рассчетов)
// 2. Height       - высота
// 3. WidthVisible - видимая ширина
// ------- после пересчета -------------
// 1. CurPage
// 2. CurLine
// 3. CurRange

// TODO: Добавить во все элементы функции типа Is_RealContent, чтобы при добавлении
//       нового элемента не надо было бы просматривать каждый раз все функции класса
//       CParagraph.

// Import
var g_fontApplication = AscFonts.g_fontApplication;

var g_oTableId      = AscCommon.g_oTableId;
var g_oTextMeasurer = AscCommon.g_oTextMeasurer;
var isRealObject    = AscCommon.isRealObject;
var History         = AscCommon.History;

var HitInLine  = AscFormat.HitInLine;
var MOVE_DELTA = AscFormat.MOVE_DELTA;

var c_oAscRelativeFromH = Asc.c_oAscRelativeFromH;
var c_oAscRelativeFromV = Asc.c_oAscRelativeFromV;

var para_Unknown                   = -1; //
var para_RunBase                   = 0x0000; // Базовый элемент, он не должен использоваться как самостоятельный объект
var para_Text                      = 0x0001; // Текст
var para_Space                     = 0x0002; // Пробелы
var para_TextPr                    = 0x0003; // Свойства текста
var para_End                       = 0x0004; // Конец параграфа
var para_NewLine                   = 0x0010; // Новая строка
var para_NewLineRendered           = 0x0011; // Рассчитанный перенос строки
var para_InlineBreak               = 0x0012; // Перенос внутри строки (для обтекания)
var para_PageBreakRendered         = 0x0013; // Рассчитанный перенос страницы
var para_Numbering                 = 0x0014; // Элемент, обозначающий нумерацию для списков
var para_Tab                       = 0x0015; // Табуляция
var para_Drawing                   = 0x0016; // Графика (картинки, автофигуры, диаграммы, графики)
var para_PageNum                   = 0x0017; // Нумерация страницы
var para_FlowObjectAnchor          = 0x0018; // Привязка для "плавающих" объектов
var para_HyperlinkStart            = 0x0019; // Начало гиперссылки
var para_HyperlinkEnd              = 0x0020; // Конец гиперссылки
var para_CollaborativeChangesStart = 0x0021; // Начало изменений другого редактора
var para_CollaborativeChangesEnd   = 0x0022; // Конец изменений другого редактора
var para_CommentStart              = 0x0023; // Начало комментария
var para_CommentEnd                = 0x0024; // Начало комментария
var para_PresentationNumbering     = 0x0025; // Элемент, обозначающий нумерацию для списков в презентациях
var para_Math                      = 0x0026; // Формула
var para_Run                       = 0x0027; // Текстовый элемент
var para_Sym                       = 0x0028; // Символ
var para_Comment                   = 0x0029; // Метка начала или конца комментария
var para_Hyperlink                 = 0x0030; // Гиперссылка
var para_Math_Run                  = 0x0031; // Run в формуле
var para_Math_Placeholder          = 0x0032; // Плейсхолдер
var para_Math_Composition          = 0x0033; // Математический объект (дробь, степень и т.п.)
var para_Math_Text                 = 0x0034; // Текст в формуле
var para_Math_Ampersand            = 0x0035; // &
var para_Field                     = 0x0036; // Поле
var para_Math_BreakOperator        = 0x0037; // break operator в формуле
var para_Math_Content              = 0x0038; // math content
var para_FootnoteReference         = 0x0039; // Ссылка на сноску
var para_FootnoteRef               = 0x0040; // Номер сноски (должен быть только внутри сноски)
var para_Separator                 = 0x0041; // Разделить, который используется для сносок
var para_ContinuationSeparator     = 0x0042; // Большой разделитель, который используется для сносок
var para_PageCount                 = 0x0043; // Количество страниц

var break_Line   = 0x01;
var break_Page   = 0x02;
var break_Column = 0x03;

var nbsp_charcode = 0x00A0;

var nbsp_string = String.fromCharCode(0x00A0);
var sp_string   = String.fromCharCode(0x0032);

var g_aPunctuation =
[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0
];

g_aPunctuation[0x002D] = 1; // символ -
g_aPunctuation[0x00AB] = 1; // символ «
g_aPunctuation[0x00BB] = 1; // символ »
g_aPunctuation[0x2013] = 1; // символ –
g_aPunctuation[0x201C] = 1; // символ “
g_aPunctuation[0x201D] = 1; // символ ”
g_aPunctuation[0x2026] = 1; // символ ...


var g_aNumber     = [];
g_aNumber[0x0030] = 1;
g_aNumber[0x0031] = 1;
g_aNumber[0x0032] = 1;
g_aNumber[0x0033] = 1;
g_aNumber[0x0034] = 1;
g_aNumber[0x0035] = 1;
g_aNumber[0x0036] = 1;
g_aNumber[0x0037] = 1;
g_aNumber[0x0038] = 1;
g_aNumber[0x0039] = 1;


var g_aSpecialSymbols     = [];
g_aSpecialSymbols[0x00AE] = 1;

var PARATEXT_FLAGS_MASK               = 0xFFFFFFFF; // 4 байта
var PARATEXT_FLAGS_FONTKOEF_SCRIPT    = 0x00000001; // 0 бит
var PARATEXT_FLAGS_FONTKOEF_SMALLCAPS = 0x00000002; // 1 бит
var PARATEXT_FLAGS_SPACEAFTER         = 0x00010000; // 16 бит
var PARATEXT_FLAGS_CAPITALS           = 0x00020000; // 17 бит

var PARATEXT_FLAGS_NON_FONTKOEF_SCRIPT    = PARATEXT_FLAGS_MASK ^ PARATEXT_FLAGS_FONTKOEF_SCRIPT;
var PARATEXT_FLAGS_NON_FONTKOEF_SMALLCAPS = PARATEXT_FLAGS_MASK ^ PARATEXT_FLAGS_FONTKOEF_SMALLCAPS;
var PARATEXT_FLAGS_NON_SPACEAFTER         = PARATEXT_FLAGS_MASK ^ PARATEXT_FLAGS_SPACEAFTER;
var PARATEXT_FLAGS_NON_CAPITALS           = PARATEXT_FLAGS_MASK ^ PARATEXT_FLAGS_CAPITALS;

var TEXTWIDTH_DIVIDER = 16384;

/**
 * Базовый класс для элементов, лежащих внутри рана.
 * @constructor
 */
function CRunElementBase()
{
	this.Width        = 0x00000000 | 0;
	this.WidthVisible = 0x00000000 | 0;
}
CRunElementBase.prototype.Type             = para_RunBase;
CRunElementBase.prototype.Get_Type         = function()
{
	return para_RunBase;
};
CRunElementBase.prototype.Draw             = function(X, Y, Context, PDSE)
{
};
CRunElementBase.prototype.Measure          = function(Context, TextPr)
{
	this.Width        = 0x00000000 | 0;
	this.WidthVisible = 0x00000000 | 0;
};
CRunElementBase.prototype.Get_Width        = function()
{
	return (this.Width / TEXTWIDTH_DIVIDER);
};
CRunElementBase.prototype.Get_WidthVisible = function()
{
	return (this.WidthVisible / TEXTWIDTH_DIVIDER);
};
CRunElementBase.prototype.Set_WidthVisible = function(WidthVisible)
{
	this.WidthVisible = (WidthVisible * TEXTWIDTH_DIVIDER) | 0;
};
CRunElementBase.prototype.Is_RealContent   = function()
{
	return true;
};
CRunElementBase.prototype.Can_AddNumbering = function()
{
	return true;
};
CRunElementBase.prototype.Copy             = function()
{
	return new CRunElementBase();
};
CRunElementBase.prototype.Write_ToBinary   = function(Writer)
{
	// Long : Type
	Writer.WriteLong(this.Type);
};
CRunElementBase.prototype.Read_FromBinary  = function(Reader)
{
};
CRunElementBase.prototype.GetType = function()
{
	return this.Type;
};

// Класс ParaText
function ParaText(value)
{
    this.Value        = (undefined !== value ? value.charCodeAt(0) : 0x00);    
    this.Width        = 0x00000000 | 0;
    this.WidthVisible = 0x00000000 | 0;
    this.Flags        = 0x00000000 | 0;
    
    this.Set_SpaceAfter(45 === this.Value); // charCode символа "-"
}

ParaText.prototype =
{
    Type : para_Text,

    Get_Type : function()
    {
        return para_Text;
    },

    Set_CharCode : function(CharCode)
    {
        this.Value = CharCode;
        this.Set_SpaceAfter(45 === this.Value); // charCode символа "-"
    },
    
    Draw : function(X, Y, Context)
    {
        var CharCode = this.Value;

        var FontKoef = 1;
        if ( this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT && this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS )
            FontKoef = smallcaps_and_script_koef;
        else if ( this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT )
            FontKoef = vertalign_Koef_Size;
        else if ( this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS )
            FontKoef = smallcaps_Koef;

        Context.SetFontSlot(((this.Flags >> 8) & 0xFF), FontKoef);
        
        var ResultCharCode = (this.Flags & PARATEXT_FLAGS_CAPITALS ? (String.fromCharCode(CharCode).toUpperCase()).charCodeAt(0) : CharCode);

        if ( true === this.Is_NBSP() && editor && editor.ShowParaMarks )
        {
            Context.FillText(X, Y, String.fromCharCode(0x00B0));
        }
        else
            Context.FillTextCode(X, Y, ResultCharCode);
    },

    Measure : function(Context, TextPr)
    {
        var bCapitals = false;
        var CharCode = this.Value;
        var ResultCharCode = CharCode;
        
        if (true === TextPr.Caps || true === TextPr.SmallCaps)
        {
            this.Flags |= PARATEXT_FLAGS_CAPITALS;
            ResultCharCode = (String.fromCharCode(CharCode).toUpperCase()).charCodeAt(0);
            bCapitals = (ResultCharCode === CharCode ? true : false);
        }
        else
        {
            this.Flags &= PARATEXT_FLAGS_NON_CAPITALS;
            bCapitals = false;
        }

        if (TextPr.VertAlign !== AscCommon.vertalign_Baseline)
            this.Flags |= PARATEXT_FLAGS_FONTKOEF_SCRIPT;
        else
            this.Flags &= PARATEXT_FLAGS_NON_FONTKOEF_SCRIPT;

        if (true != TextPr.Caps && true === TextPr.SmallCaps && false === bCapitals)
            this.Flags |= PARATEXT_FLAGS_FONTKOEF_SMALLCAPS;
        else
            this.Flags &= PARATEXT_FLAGS_NON_FONTKOEF_SMALLCAPS;

        var Hint = TextPr.RFonts.Hint;
        var bCS  = TextPr.CS;
        var bRTL = TextPr.RTL;
        var lcid = TextPr.Lang.EastAsia;

        var FontSlot = g_font_detector.Get_FontClass(ResultCharCode, Hint, lcid, bCS, bRTL);

        var Flags_0Byte = (this.Flags >>  0) & 0xFF;
        var Flags_2Byte = (this.Flags >> 16) & 0xFF;

        this.Flags = Flags_0Byte | ((FontSlot & 0xFF) << 8) | (Flags_2Byte << 16);

        var FontKoef = 1;
        if ( this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT && this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS )
            FontKoef = smallcaps_and_script_koef;
        else if ( this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT )
            FontKoef = vertalign_Koef_Size;
        else if ( this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS )
            FontKoef = smallcaps_Koef;

        // Разрешенные размеры шрифта только либо целое, либо целое/2. Даже после применения FontKoef, поэтому
        // мы должны подкрутить коэффициент так, чтобы после домножения на него, у на получался разрешенный размер.
        var FontSize = TextPr.FontSize;
        if (1 !== FontKoef)
            FontKoef = (((FontSize * FontKoef * 2 + 0.5) | 0) / 2) / FontSize;

        Context.SetFontSlot(FontSlot, FontKoef);
        var Temp = Context.MeasureCode(ResultCharCode);
        
        var ResultWidth   = (Math.max((Temp.Width + TextPr.Spacing), 0) * TEXTWIDTH_DIVIDER) | 0;
                
        this.Width        = ResultWidth;
        this.WidthVisible = ResultWidth;
    },

    Get_Width : function()
    {
        return (this.Width / TEXTWIDTH_DIVIDER);
    },
    
    Get_WidthVisible : function()
    {
        return (this.WidthVisible / TEXTWIDTH_DIVIDER);
    },
    
    Set_WidthVisible : function(WidthVisible)
    {
        this.WidthVisible = (WidthVisible * TEXTWIDTH_DIVIDER) | 0;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Can_AddNumbering : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaText(String.fromCharCode(this.Value));
    },

    Is_NBSP : function()
    {
        return ( this.Value === nbsp_charcode ? true : false);
    },

    Is_Punctuation : function()
    {
        if ( 1 === g_aPunctuation[this.Value] )
            return true;

        return false;
    },

    Is_Number : function()
    {
        if ( 1 === g_aNumber[this.Value] )
            return true;

        return false;
    },

    Is_SpecialSymbol : function()
    {
        if ( 1 === g_aSpecialSymbols[this.Value] )
            return true;

        return false;
    },
    
    Is_SpaceAfter : function()
    {
        return (this.Flags & PARATEXT_FLAGS_SPACEAFTER ? true : false); 
    },

    Get_CharForSpellCheck : function(bCaps)
    {
        // Закрывающуюся кавычку (0x2019), посылаем как апостроф

        if (0x2019 === this.Value)
            return String.fromCharCode(0x0027);
        else
        {
            if (true === bCaps)
                return (String.fromCharCode(this.Value)).toUpperCase();
            else
                return String.fromCharCode(this.Value);
        }
    },
    
    Set_SpaceAfter : function(bSpaceAfter)
    {
        if (bSpaceAfter )
            this.Flags |= PARATEXT_FLAGS_SPACEAFTER;
        else
            this.Flags &= PARATEXT_FLAGS_NON_SPACEAFTER;
    },

    Is_NoBreakHyphen : function()
    {
        if (false === this.Is_SpaceAfter() && (this.Value === 0x002D || this.Value === 0x2013))
            return true;

        return false;
    },

    Write_ToBinary : function(Writer)
    {
        // Long : Type
        // Long : Value

        Writer.WriteLong( para_Text );
        Writer.WriteLong( this.Value );
    },

    Read_FromBinary : function(Reader)
    {
        this.Value = Reader.GetLong();
        this.Set_SpaceAfter(45 === this.Value);
    }
};

// Класс ParaSpace
function ParaSpace()
{
    this.Flags        = 0x00000000 | 0;
    this.Width        = 0x00000000 | 0;
    this.WidthVisible = 0x00000000 | 0;
}
ParaSpace.prototype =
{
    Type : para_Space,

    Get_Type : function()
    {
        return para_Space;
    },
    
    Draw : function(X,Y, Context)
    {
        if ( undefined !== editor && editor.ShowParaMarks )
        {
            Context.SetFontSlot( fontslot_ASCII, this.Get_FontKoef() );
            Context.FillText(X, Y, String.fromCharCode(0x00B7));
        }
    },

    Measure : function(Context, TextPr)
    {
        this.Set_FontKoef_Script( TextPr.VertAlign !== AscCommon.vertalign_Baseline ? true : false );
        this.Set_FontKoef_SmallCaps( true != TextPr.Caps && true === TextPr.SmallCaps ? true : false );

        // Разрешенные размеры шрифта только либо целое, либо целое/2. Даже после применения FontKoef, поэтому
        // мы должны подкрутить коэффициент так, чтобы после домножения на него, у на получался разрешенный размер.
        var FontKoef = this.Get_FontKoef();
        var FontSize = TextPr.FontSize;
        if (1 !== FontKoef)
            FontKoef = (((FontSize * FontKoef * 2 + 0.5) | 0) / 2) / FontSize;

        Context.SetFontSlot(fontslot_ASCII, FontKoef);

        var Temp = Context.MeasureCode(0x20);

        var ResultWidth = (Math.max((Temp.Width + TextPr.Spacing), 0) * 16384) | 0;
        this.Width      = ResultWidth;
        // Не меняем здесь WidthVisible, это значение для пробела высчитывается отдельно, и не должно меняться при пересчете
    },

    Get_FontKoef : function()
    {
        if ( this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT && this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS )
            return smallcaps_and_script_koef;
        else if ( this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT )
            return vertalign_Koef_Size;
        else if ( this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS )
            return smallcaps_Koef;
        else
            return 1;
    },

    Set_FontKoef_Script : function(bScript)
    {
        if (bScript)
            this.Flags |= PARATEXT_FLAGS_FONTKOEF_SCRIPT;
        else
            this.Flags &= PARATEXT_FLAGS_NON_FONTKOEF_SCRIPT;
    },

    Set_FontKoef_SmallCaps : function(bSmallCaps)
    {
        if (bSmallCaps)
            this.Flags |= PARATEXT_FLAGS_FONTKOEF_SMALLCAPS;
        else
            this.Flags &= PARATEXT_FLAGS_NON_FONTKOEF_SMALLCAPS;
    },

    Get_Width : function()
    {
        return (this.Width / TEXTWIDTH_DIVIDER);
    },
    
    Get_WidthVisible : function()
    {
        return (this.WidthVisible / TEXTWIDTH_DIVIDER);
    },
    
    Set_WidthVisible : function(WidthVisible)
    {
        this.WidthVisible = (WidthVisible * TEXTWIDTH_DIVIDER) | 0;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Can_AddNumbering : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaSpace();
    },

    Write_ToBinary : function(Writer)
    {
        // Long : Type
        // Long : Value

        Writer.WriteLong( para_Space );
        Writer.WriteLong( this.Value );
    },

    Read_FromBinary : function(Reader)
    {
        this.Value = Reader.GetLong();
    }
};

function ParaSym(Char, FontFamily)
{
    this.Type       = para_Sym;
    this.FontFamily = FontFamily;
    this.Char       = Char;

    this.FontSlot   = fontslot_ASCII;
    this.FontKoef   = 1;

    this.Width        = 0;
    this.Height       = 0;
    this.WidthVisible = 0;
}

ParaSym.prototype =
{
    Draw : function(X,Y,Context, TextPr)
    {
        var CurTextPr = TextPr.Copy();

        switch ( this.FontSlot )
        {
            case fontslot_ASCII:    CurTextPr.RFonts.Ascii    = { Name : this.FontFamily, Index : -1 }; break;
            case fontslot_CS:       CurTextPr.RFonts.CS       = { Name : this.FontFamily, Index : -1 }; break;
            case fontslot_EastAsia: CurTextPr.RFonts.EastAsia = { Name : this.FontFamily, Index : -1 }; break;
            case fontslot_HAnsi:    CurTextPr.RFonts.HAnsi    = { Name : this.FontFamily, Index : -1 }; break;
        }

        Context.SetTextPr( CurTextPr );
        Context.SetFontSlot( this.FontSlot, this.FontKoef );

        Context.FillText( X, Y, String.fromCharCode( this.Char ) );
        Context.SetTextPr( TextPr );
    },

    Measure : function(Context, TextPr)
    {
        this.FontKoef = TextPr.Get_FontKoef();

        var Hint = TextPr.RFonts.Hint;
        var bCS  = TextPr.CS;
        var bRTL = TextPr.RTL;
        var lcid = TextPr.Lang.EastAsia;

        this.FontSlot = g_font_detector.Get_FontClass( this.CalcValue.charCodeAt(0), Hint, lcid, bCS, bRTL );

        var CurTextPr = TextPr.Copy();

        switch ( this.FontSlot )
        {
            case fontslot_ASCII:    CurTextPr.RFonts.Ascii    = { Name : this.FontFamily, Index : -1 }; break;
            case fontslot_CS:       CurTextPr.RFonts.CS       = { Name : this.FontFamily, Index : -1 }; break;
            case fontslot_EastAsia: CurTextPr.RFonts.EastAsia = { Name : this.FontFamily, Index : -1 }; break;
            case fontslot_HAnsi:    CurTextPr.RFonts.HAnsi    = { Name : this.FontFamily, Index : -1 }; break;
        }

        Context.SetTextPr( CurTextPr );
        Context.SetFontSlot( this.FontSlot, this.FontKoef );

        var Temp = Context.Measure( this.CalcValue );
        Context.SetTextPr( TextPr );

        Temp.Width = Math.max( Temp.Width + TextPr.Spacing, 0 );

        this.Width        = Temp.Width;
        this.Height       = Temp.Height;
        this.WidthVisible = Temp.Width;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Can_AddNumbering : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaSym( this.Char, this.FontFamily );
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // String : FontFamily
        // Long   : Char

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.FontFamily );
        Writer.WriteLong( this.Char );
    },

    Read_FromBinary : function(Reader)
    {
        // String : FontFamily
        // Long   : Char

        this.FontFamily = Reader.GetString2();
        this.Char = Reader.GetLong();
    }
};

// Класс окончание параграфа ParaEnd
function ParaEnd()
{
    this.SectionPr    = null;
    this.WidthVisible = 0x00000000 | 0; 
}

ParaEnd.prototype =
{
    Type : para_End,

    Get_Type : function()
    {
        return para_End;
    },
    
    Draw : function(X, Y, Context, bEndCell, bForceDraw)
    {
        if ((undefined !== editor && editor.ShowParaMarks) || true === bForceDraw)
        {
            Context.SetFontSlot( fontslot_ASCII );

            if ( null !== this.SectionPr )
            {
                Context.b_color1( 0, 0, 0, 255);
                Context.p_color( 0, 0, 0, 255);
                
                Context.SetFont( {FontFamily: { Name : "Courier New", Index : -1 }, FontSize: 8, Italic: false, Bold : false} );
                var Widths          = this.SectionPr.Widths;
                var strSectionBreak = this.SectionPr.Str;

                var Len = strSectionBreak.length;

                for ( var Index = 0; Index < Len; Index++ )
                {
                    Context.FillText( X, Y, strSectionBreak[Index] );
                    X += Widths[Index];
                }
            }
            else if ( true === bEndCell )
                Context.FillText(X, Y, String.fromCharCode(0x00A4));
            else
                Context.FillText(X, Y, String.fromCharCode(0x00B6));
        }
    },

    Measure : function(Context, bEndCell)
    {
        Context.SetFontSlot(fontslot_ASCII);

        if ( true === bEndCell )
            this.WidthVisible = (Context.Measure(String.fromCharCode(0x00A4)).Width * TEXTWIDTH_DIVIDER) | 0;
        else
            this.WidthVisible = (Context.Measure(String.fromCharCode(0x00B6)).Width * TEXTWIDTH_DIVIDER) | 0;
    },

    Get_Width : function()
    {
        return 0;
    },

    Get_WidthVisible : function()
    {
        return (this.WidthVisible / TEXTWIDTH_DIVIDER);
    },

    Set_WidthVisible : function(WidthVisible)
    {
        this.WidthVisible = (WidthVisible * TEXTWIDTH_DIVIDER) | 0;
    },

    Update_SectionPr : function(SectionPr, W)
    {
        var Type = SectionPr.Type;

        var strSectionBreak = "";
        switch ( Type )
        {
            case c_oAscSectionBreakType.Column     : strSectionBreak = " End of Section "; break;
            case c_oAscSectionBreakType.Continuous : strSectionBreak = " Section Break (Continuous) "; break;
            case c_oAscSectionBreakType.EvenPage   : strSectionBreak = " Section Break (Even Page) "; break;
            case c_oAscSectionBreakType.NextPage   : strSectionBreak = " Section Break (Next Page) "; break;
            case c_oAscSectionBreakType.OddPage    : strSectionBreak = " Section Break (Odd Page) "; break;
        }

        g_oTextMeasurer.SetFont( {FontFamily: { Name : "Courier New", Index : -1 }, FontSize: 8, Italic: false, Bold : false} );

        var Widths = [];

        var nStrWidth = 0;
        var Len = strSectionBreak.length;
        for ( var Index = 0; Index < Len; Index++ )
        {
            var Val = g_oTextMeasurer.Measure( strSectionBreak[Index] ).Width;
            nStrWidth += Val;
            Widths[Index] = Val;
        }

        var strSymbol = ":";
        var nSymWidth = g_oTextMeasurer.Measure( strSymbol ).Width * 2/3;

        var strResult = "";
        if ( W - 6 * nSymWidth >= nStrWidth )
        {
            var Count = parseInt( (W - nStrWidth) / ( 2 * nSymWidth ) );
            var strResult = strSectionBreak;
            for ( var Index = 0; Index < Count; Index++ )
            {
                strResult = strSymbol + strResult + strSymbol;
                Widths.splice( 0, 0, nSymWidth );
                Widths.splice( Widths.length, 0, nSymWidth );
            }
        }
        else
        {
            var Count = parseInt( W / nSymWidth );
            for ( var Index = 0; Index < Count; Index++ )
            {
                strResult += strSymbol;
                Widths[Index] = nSymWidth;
            }
        }

        var ResultW = 0;
        var Count = Widths.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            ResultW += Widths[Index];
        }

        var AddW = 0;
        if ( ResultW < W && Count > 1 )
        {
            AddW = (W - ResultW) / (Count - 1);
        }

        for ( var Index = 0; Index < Count - 1; Index++ )
        {
            Widths[Index] += AddW;
        }

        this.SectionPr = {};
        this.SectionPr.OldWidth = this.Width;
        this.SectionPr.Str      = strResult;
        this.SectionPr.Widths   = Widths;

        var _W = (W * TEXTWIDTH_DIVIDER) | 0;
        this.WidthVisible = _W;
    },

    Clear_SectionPr : function()
    {
        this.SectionPr = null;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Can_AddNumbering : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaEnd();
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( para_End );
    },

    Read_FromBinary : function(Reader)
    {
    }
};

// Класс ParaNewLine
function ParaNewLine(BreakType)
{
    this.BreakType = BreakType;

    this.Flags = {}; // специальные флаги для разных break
    this.Flags.Use = true;

    if (break_Page === this.BreakType || break_Column === this.BreakType)
        this.Flags.NewLine = true;

    this.Height       = 0;
    this.Width        = 0;
    this.WidthVisible = 0;
}

ParaNewLine.prototype =
{
    Type : para_NewLine,

    Get_Type : function()
    {
        return para_NewLine;
    },
    
    Draw : function(X, Y, Context)
    {
        if ( false === this.Flags.Use )
            return;
        
        if ( undefined !== editor && editor.ShowParaMarks )
        {
            // Цвет и шрифт можно не запоминать и не выставлять старый, т.к. на данном элемента всегда заканчивается
            // отрезок обтекания или целая строка. 

            switch( this.BreakType )
            {
                case break_Line:
                {
                    Context.b_color1(0, 0, 0, 255);
                    Context.SetFont( {FontFamily: { Name : "ASCW3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
                    Context.FillText( X, Y, String.fromCharCode( 0x0038/*0x21B5*/ ) );
                    break;
                }
                case break_Page:
                case break_Column:
                {
                    var strPageBreak = this.Flags.BreakPageInfo.Str;
                    var Widths       = this.Flags.BreakPageInfo.Widths;

                    Context.b_color1( 0, 0 , 0, 255);
                    Context.SetFont( {FontFamily: { Name : "Courier New", Index : -1 }, FontSize: 8, Italic: false, Bold : false} );

                    var Len = strPageBreak.length;
                    for ( var Index = 0; Index < Len; Index++ )
                    {
                        Context.FillText( X, Y, strPageBreak[Index] );
                        X += Widths[Index];
                    }

                    break;
                }
            }

        }
    },

    Measure : function(Context)
    {
        if ( false === this.Flags.Use )
        {
            this.Width        = 0;
            this.WidthVisible = 0;
            this.Height       = 0;
            return;
        }

        switch( this.BreakType )
        {
            case break_Line:
            {
                this.Width  = 0;
                this.Height = 0;

                Context.SetFont( {FontFamily: { Name : "ASCW3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
                var Temp = Context.Measure( String.fromCharCode( 0x0038 ) );

                // Почему-то в шрифте Wingding 3 символ 0x0038 имеет неправильную ширину
                this.WidthVisible = Temp.Width * 1.7;

                break;
            }
            case break_Page:
            case break_Column:
            {
                this.Width  = 0;
                this.Height = 0;

                break;
            }
        }
    },

    Get_Width : function()
    {
        return this.Width;
    },

    Get_WidthVisible : function()
    {
        return this.WidthVisible;
    },

    Set_WidthVisible : function(WidthVisible)
    {
        this.WidthVisible = WidthVisible;
    },    

    Update_String : function(_W)
    {
        if ( false === this.Flags.Use )
        {
            this.Width        = 0;
            this.WidthVisible = 0;
            this.Height       = 0;
            return;
        }
        
        if (break_Page === this.BreakType || break_Column === this.BreakType)
        {
            var W = ( false === this.Flags.NewLine ? 50 : _W );

            g_oTextMeasurer.SetFont({FontFamily: { Name: "Courier New", Index: -1 }, FontSize: 8, Italic: false, Bold: false});

            var Widths = [];

            var nStrWidth = 0;
            var strBreakPage = break_Page === this.BreakType ? " Page Break " : " Column Break ";
            var Len = strBreakPage.length;
            for (var Index = 0; Index < Len; Index++)
            {
                var Val = g_oTextMeasurer.Measure(strBreakPage[Index]).Width;
                nStrWidth += Val;
                Widths[Index] = Val;
            }

            var strSymbol = String.fromCharCode("0x00B7");
            var nSymWidth = g_oTextMeasurer.Measure(strSymbol).Width * 2 / 3;

            var strResult = "";
            if (W - 6 * nSymWidth >= nStrWidth)
            {
                var Count = parseInt((W - nStrWidth) / ( 2 * nSymWidth ));
                var strResult = strBreakPage;
                for (var Index = 0; Index < Count; Index++)
                {
                    strResult = strSymbol + strResult + strSymbol;
                    Widths.splice(0, 0, nSymWidth);
                    Widths.splice(Widths.length, 0, nSymWidth);
                }
            }
            else
            {
                var Count = parseInt(W / nSymWidth);
                for (var Index = 0; Index < Count; Index++)
                {
                    strResult += strSymbol;
                    Widths[Index] = nSymWidth;
                }
            }

            var ResultW = 0;
            var Count = Widths.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                ResultW += Widths[Index];
            }

            var AddW = 0;
            if ( ResultW < W && Count > 1 )
            {
                AddW = (W - ResultW) / (Count - 1);
            }

            for ( var Index = 0; Index < Count - 1; Index++ )
            {
                Widths[Index] += AddW;
            }

            this.Flags.BreakPageInfo = {};
            this.Flags.BreakPageInfo.Str = strResult;
            this.Flags.BreakPageInfo.Widths = Widths;

            this.Width        = W;
            this.WidthVisible = W;
        }
    },

    Is_RealContent : function()
    {
        return true;
    },

    Can_AddNumbering : function()
    {
        if ( break_Line === this.BreakType )
            return true;

        return false;
    },

    Copy : function()
    {
        return new ParaNewLine(this.BreakType);
    },

    // Функция проверяет особый случай, когда у нас PageBreak, после которого в параграфе ничего не идет
    Is_NewLine : function()
    {
        if (break_Line === this.BreakType || ((break_Page === this.BreakType || break_Column === this.BreakType) && true === this.Flags.NewLine))
            return true;

        return false;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // Long   : BreakType
        // Optional :
        // Long   : Flags (breakPage)
        Writer.WriteLong( para_NewLine );
        Writer.WriteLong( this.BreakType );

        if (break_Page === this.BreakType || break_Column === this.BreakType)
        {
            Writer.WriteBool( this.Flags.NewLine );
        }
    },

    Read_FromBinary : function(Reader)
    {
        this.BreakType = Reader.GetLong();

        if (break_Page === this.BreakType || break_Column === this.BreakType)
            this.Flags = { NewLine : Reader.GetBool() };
    },

    Is_PageOrColumnBreak : function()
    {
        if (break_Page === this.BreakType || break_Column === this.BreakType)
            return true;

        return false;
    }
};

// Класс ParaNumbering
function ParaNumbering()
{
    this.Type = para_Numbering;

    this.Item = null; // Элемент в ране, к которому привязана нумерация
    this.Run  = null; // Ран, к которому привязана нумерация

    this.Line  = 0;
    this.Range = 0;

    this.Internal =
    {
        NumInfo : undefined
    };
}

ParaNumbering.prototype =
{
    Type : para_Numbering,

    Draw : function(X,Y,Context, Numbering, TextPr, NumPr, Theme)
    {
        Numbering.Draw( NumPr.NumId, NumPr.Lvl, X, Y, Context, this.Internal.NumInfo, TextPr, Theme );
    },

    Measure : function (Context, Numbering, NumInfo, TextPr, NumPr, Theme)
    {
        this.Internal.NumInfo = NumInfo;

        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;
        this.WidthNum     = 0;
        this.WidthSuff    = 0;

        if ( undefined === Numbering )
            return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };

        var Temp = Numbering.Measure( NumPr.NumId, NumPr.Lvl, Context, NumInfo, TextPr, Theme );
        this.Width        = Temp.Width;
        this.WidthVisible = Temp.Width;
        this.WidthNum     = Temp.Width;
        this.WidthSuff    = 0;
        this.Height       = Temp.Ascent; // Это не вся высота, а только высота над BaseLine
    },

    Check_Range : function(Range, Line)
    {
        if ( null !== this.Item && null !== this.Run && Range === this.Range && Line === this.Line )
            return true;

        return false;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Can_AddNumbering : function()
    {
        return false;
    },

    Copy : function()
    {
        return new ParaNumbering();
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
    }
};

// TODO: Реализовать табы по точке и с чертой.
var tab_Clear  = 0x00;
var tab_Left   = 0x01;
var tab_Right  = 0x02;
var tab_Center = 0x03;

var tab_Symbol = 0x0022;//0x2192;

// Класс ParaTab
function ParaTab()
{
    this.TabType = tab_Left;

    this.Width        = 0;
    this.WidthVisible = 0;
    this.RealWidth    = 0;
}

ParaTab.prototype =
{
    Type : para_Tab,

    Get_Type : function()
    {
        return para_Tab;
    },
    
    Draw : function(X,Y,Context)
    {
        if ( typeof (editor) !== "undefined" && editor.ShowParaMarks )
        {
            var X0 = this.Width / 2 - this.RealWidth / 2;

            Context.SetFont( {FontFamily: { Name : "ASCW3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );

            if ( X0 > 0 )
                Context.FillText2( X + X0, Y, String.fromCharCode( tab_Symbol ), 0, this.Width );
            else
                Context.FillText2( X, Y, String.fromCharCode( tab_Symbol ), this.RealWidth - this.Width, this.Width );

        }
    },

    Measure : function (Context)
    {
        Context.SetFont( {FontFamily: { Name : "ASCW3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
        this.RealWidth = Context.Measure( String.fromCharCode( tab_Symbol ) ).Width;
    },

    Get_Width : function()
    {
        return this.Width;
    },

    Get_WidthVisible : function()
    {
        return this.WidthVisible;
    },

    Set_WidthVisible : function(WidthVisible)
    {
        this.WidthVisible = WidthVisible;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Can_AddNumbering : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaTab();
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // Long   : TabType
        Writer.WriteLong( para_Tab );
        Writer.WriteLong( this.TabType );
    },

    Read_FromBinary : function(Reader)
    {
        this.TabType = Reader.GetLong();
    }
};

// Класс ParaPageNum
function ParaPageNum()
{
    this.FontKoef = 1;

    this.NumWidths = [];

    this.Widths = [];
    this.String = [];

    this.Width        = 0;
    this.WidthVisible = 0;
}

ParaPageNum.prototype =
{
    Type : para_PageNum,

    Get_Type : function()
    {
        return para_PageNum;
    },
    
    Draw : function(X, Y, Context)
    {
        // Value - реальное значение, которое должно быть отрисовано.
        // Align - прилегание параграфа, в котором лежит данный номер страницы.

        var Len = this.String.length;

        var _X = X;
        var _Y = Y;

        Context.SetFontSlot( fontslot_ASCII, this.FontKoef );
        for ( var Index = 0; Index < Len; Index++ )
        {
            var Char = this.String.charAt(Index);
            Context.FillText( _X, _Y, Char );
            _X += this.Widths[Index];
        }
    },

    Measure : function (Context, TextPr)
    {
        this.FontKoef = TextPr.Get_FontKoef();
        Context.SetFontSlot( fontslot_ASCII, this.FontKoef );

        for ( var Index = 0; Index < 10; Index++ )
        {
            this.NumWidths[Index] = Context.Measure( "" + Index ).Width;
        }

        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;
    },

    Get_Width : function()
    {
        return this.Width;
    },

    Get_WidthVisible : function()
    {
        return this.WidthVisible;
    },

    Set_WidthVisible : function(WidthVisible)
    {
        this.WidthVisible = WidthVisible;
    },

    Set_Page : function(PageNum)
    {
        this.String = "" + PageNum;
        var Len = this.String.length;

        var RealWidth = 0;
        for ( var Index = 0; Index < Len; Index++ )
        {
            var Char = parseInt(this.String.charAt(Index));

            this.Widths[Index] = this.NumWidths[Char];
            RealWidth         += this.NumWidths[Char];
        }

        this.Width        = RealWidth;
        this.WidthVisible = RealWidth;
    },

    Save_RecalculateObject : function(Copy)
    {
        return new CPageNumRecalculateObject(this.Type, this.Widths, this.String, this.Width, Copy);
    },

    Load_RecalculateObject : function(RecalcObj)
    {
        this.Widths = RecalcObj.Widths;
        this.String = RecalcObj.String;

        this.Width  = RecalcObj.Width;
        this.WidthVisible = this.Width;
    },

    Prepare_RecalculateObject : function()
    {
        this.Widths = [];
        this.String = "";
    },

    Document_CreateFontCharMap : function(FontCharMap)
    {
        var sValue = "1234567890";
        for ( var Index = 0; Index < sValue.length; Index++ )
        {
            var Char = sValue.charAt(Index);
            FontCharMap.AddChar( Char );
        }
    },

    Is_RealContent : function()
    {
        return true;
    },

    Can_AddNumbering : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaPageNum();
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( para_PageNum );
    },

    Read_FromBinary : function(Reader)
    {
    }
};
ParaPageNum.prototype.GetPageNumValue = function()
{
	var nPageNum = parseInt(this.String);
	if (isNaN(nPageNum))
		return 1;

	return nPageNum;
};
ParaPageNum.prototype.GetType = function()
{
	return this.Type;
};

function CPageNumRecalculateObject(Type, Widths, String, Width, Copy)
{
    this.Type   = Type;
    this.Widths = Widths;
    this.String = String;
    this.Width  = Width;

    if ( true === Copy )
    {
        this.Widths = [];
        var Len = Widths.length;
        for ( var Index = 0; Index < Len; Index++ )
            this.Widths[Index] = Widths[Index];
    }
}

// Класс ParaPresentationNumbering
function ParaPresentationNumbering()
{
    // Эти данные заполняются во время пересчета, перед вызовом Measure
    this.Bullet    = null;
    this.BulletNum = null;
}

ParaPresentationNumbering.prototype =
{
    Type : para_PresentationNumbering,

    Draw : function(X, Y, Context, FirstTextPr, PDSE)
    {
        this.Bullet.Draw( X, Y, Context, FirstTextPr, PDSE );
    },

    Measure : function (Context, FirstTextPr, Theme)
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

        var Temp = this.Bullet.Measure( Context, FirstTextPr, this.BulletNum, Theme );

        this.Width        = Temp.Width;
        this.WidthVisible = Temp.Width;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Can_AddNumbering : function()
    {
        return false;
    },


    Copy : function()
    {
        return new ParaPresentationNumbering();
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        Writer.WriteLong( this.Type );
    },

    Read_FromBinary : function(Reader)
    {
    },

    Check_Range : function(Range, Line)
    {
        if ( null !== this.Item && null !== this.Run && Range === this.Range && Line === this.Line )
            return true;

        return false;
    }
};


/**
 * Класс представляющий ссылку на сноску.
 * @param {CFootEndnote} Footnote - Ссылка на сноску.
 * @param {string} CustomMark
 * @constructor
 * @extends {CRunElementBase}
 */
function ParaFootnoteReference(Footnote, CustomMark)
{
	this.Footnote   = Footnote;
	this.CustomMark = CustomMark ? CustomMark : undefined;

	this.Width        = 0;
	this.WidthVisible = 0;
	this.Number       = 1;
	this.NumFormat    = numbering_numfmt_Decimal;

	this.Run          = null;
	this.Widths       = [];
}
ParaFootnoteReference.prototype = Object.create(CRunElementBase.prototype);
ParaFootnoteReference.prototype.constructor = ParaFootnoteReference;
ParaFootnoteReference.prototype.Type = para_FootnoteReference;
ParaFootnoteReference.prototype.Get_Type = function()
{
	return para_FootnoteReference;
};
ParaFootnoteReference.prototype.Draw = function(X, Y, Context, PDSE)
{
	if (true === this.IsCustomMarkFollows())
		return;

	var TextPr = this.Run.Get_CompiledPr(false);

	var FontKoef = 1;
	if (TextPr.VertAlign !== AscCommon.vertalign_Baseline)
		FontKoef = vertalign_Koef_Size;

	Context.SetFontSlot(fontslot_ASCII, FontKoef);

	var _X = X;
	var T  = this.private_GetString();
	if (this.Widths.length !== T.length)
		return;

	for (var nPos = 0; nPos < T.length; ++nPos)
	{
		var Char = T.charAt(nPos);
		Context.FillText(_X, Y, Char);
		_X += this.Widths[nPos];
	}

	if (editor && editor.ShowParaMarks && Context.DrawFootnoteRect)
	{
	    Context.p_color(0, 0, 0, 255);
	    Context.DrawFootnoteRect(X, PDSE.LineTop, this.Get_Width(), PDSE.BaseLine - PDSE.LineTop);
	}
};
ParaFootnoteReference.prototype.Measure = function(Context, TextPr, MathInfo, Run)
{
	this.Run = Run;
	this.private_Measure();
};
ParaFootnoteReference.prototype.Copy = function()
{
	var oFootnote = this.Footnote.Parent.CreateFootnote();
	oFootnote.Copy2(this.Footnote);
	return new ParaFootnoteReference(oFootnote);
};
ParaFootnoteReference.prototype.Write_ToBinary = function(Writer)
{
	// Long   : Type
	// String : FootnoteId
	// Bool : is undefined mark ?
	// false -> String2 : CustomMark
	Writer.WriteLong(this.Type);
	Writer.WriteString2(this.Footnote.Get_Id());

	if (undefined === this.CustomMark)
	{
		Writer.WriteBool(true);
	}
	else
	{
		Writer.WriteBool(false);
		Writer.WriteString2(this.CustomMark);
	}
};
ParaFootnoteReference.prototype.Read_FromBinary = function(Reader)
{
	// String : FootnoteId
	// Bool : is undefined mark ?
	// false -> String2 : CustomMark
	this.Footnote = g_oTableId.Get_ById(Reader.GetString2());

	if (false === Reader.GetBool())
		this.CustomMark = Reader.GetString2();
};
ParaFootnoteReference.prototype.Get_Footnote = function()
{
	return this.Footnote;
};
ParaFootnoteReference.prototype.UpdateNumber = function(PRS)
{
	if (this.Footnote && true !== PRS.IsFastRecalculate() && PRS.TopDocument instanceof CDocument)
	{
		var nPageAbs    = PRS.GetPageAbs();
		var nColumnAbs  = PRS.GetColumnAbs();
		var nAdditional = PRS.GetFootnoteReferencesCount(this);
		var oSectPr     = PRS.GetSectPr();
		var nNumFormat  = oSectPr.GetFootnoteNumFormat();

		var oLogicDocument       = this.Footnote.Get_LogicDocument();
		var oFootnotesController = oLogicDocument.GetFootnotesController();

		this.NumFormat = nNumFormat;
		this.Number    = oFootnotesController.GetFootnoteNumberOnPage(nPageAbs, nColumnAbs, oSectPr) + nAdditional;

		// Если данная сноска не участвует в нумерации, просто уменьшаем ей номер на 1, для упрощения работы
		if (this.IsCustomMarkFollows())
			this.Number--;

		this.private_Measure();
		this.Footnote.SetNumber(this.Number, oSectPr, this.IsCustomMarkFollows());
	}
	else
	{
		this.Number    = 1;
		this.NumFormat = numbering_numfmt_Decimal;
		this.private_Measure();
	}
};
ParaFootnoteReference.prototype.private_Measure = function()
{
	if (!this.Run)
		return;

	if (this.IsCustomMarkFollows())
	{
		this.Width        = 0;
		this.WidthVisible = 0;
		return;
	}

	var oMeasurer = g_oTextMeasurer;

	var TextPr = this.Run.Get_CompiledPr(false);
	var Theme  = this.Run.Get_Paragraph().Get_Theme();

    var FontKoef = 1;
    if (TextPr.VertAlign !== AscCommon.vertalign_Baseline)
        FontKoef = vertalign_Koef_Size;

	oMeasurer.SetTextPr(TextPr, Theme);
	oMeasurer.SetFontSlot(fontslot_ASCII, FontKoef);

	var X = 0;
	var T = this.private_GetString();
	this.Widths = [];
	for (var nPos = 0; nPos < T.length; ++nPos)
	{
		var Char  = T.charAt(nPos);
		var CharW = oMeasurer.Measure(Char).Width
		this.Widths.push(CharW);
		X += CharW;
	}


	var ResultWidth   = (Math.max((X + TextPr.Spacing), 0) * TEXTWIDTH_DIVIDER) | 0;
	this.Width        = ResultWidth;
	this.WidthVisible = ResultWidth;
};
ParaFootnoteReference.prototype.private_GetString = function()
{
	if (numbering_numfmt_Decimal === this.NumFormat)
		return Numbering_Number_To_String(this.Number);
	if (numbering_numfmt_LowerRoman === this.NumFormat)
		return Numbering_Number_To_Roman(this.Number, true);
	else if (numbering_numfmt_UpperRoman === this.NumFormat)
		return Numbering_Number_To_Roman(this.Number, false);
	else if (numbering_numfmt_LowerLetter === this.NumFormat)
		return Numbering_Number_To_Alpha(this.Number, true);
	else if (numbering_numfmt_UpperLetter === this.NumFormat)
		return Numbering_Number_To_Alpha(this.Number, false);
	else// if (numbering_numfmt_Decimal === this.NumFormat)
		return Numbering_Number_To_String(this.Number);
};
ParaFootnoteReference.prototype.IsCustomMarkFollows = function()
{
	return (undefined !== this.CustomMark ? true : false);
};
ParaFootnoteReference.prototype.GetCustomText = function()
{
	return this.CustomMark;
};

/**
 * Класс представляющий номер сноски внутри сноски.
 * @param {CFootEndnote} Footnote - Ссылка на сноску.
 * @constructor
 * @extends {ParaFootnoteReference}
 */
function ParaFootnoteRef(Footnote)
{
	ParaFootnoteReference.call(this, Footnote);
}
ParaFootnoteRef.prototype = Object.create(ParaFootnoteReference.prototype);
ParaFootnoteRef.prototype.constructor = ParaFootnoteRef;
ParaFootnoteRef.prototype.Type = para_FootnoteRef;
ParaFootnoteRef.prototype.Get_Type = function()
{
	return para_FootnoteRef;
};
ParaFootnoteRef.prototype.Copy = function()
{
	return new ParaFootnoteRef(this.Get_Footnote());
};
ParaFootnoteRef.prototype.UpdateNumber = function(oFootnote)
{
	this.Footnote = oFootnote;
	if (this.Footnote && this.Footnote instanceof CFootEndnote)
	{
		this.Number    = this.Footnote.GetNumber();
		this.NumFormat = this.Footnote.GetReferenceSectPr().GetFootnoteNumFormat();
		this.private_Measure();
	}
	else
	{
		this.Number    = 1;
		this.NumFormat = numbering_numfmt_Decimal;
		this.private_Measure();
	}
};

/**
 * Класс представляющий собой разделитель (который в основном используется для сносок).
 * @constructor
 * @extends {CRunElementBase}
 */
function ParaSeparator()
{
	CRunElementBase.call(this);
	this.LineW = 0;
}
ParaSeparator.prototype = Object.create(CRunElementBase.prototype);
ParaSeparator.prototype.constructor = ParaSeparator;
ParaSeparator.prototype.Type     = para_Separator;
ParaSeparator.prototype.Get_Type = function()
{
	return para_Separator;
};
ParaSeparator.prototype.Draw     = function(X, Y, Context, PDSE)
{
	var l = X, t = PDSE.LineTop, r = X + this.Get_Width(), b = PDSE.BaseLine;

    Context.p_color(0, 0, 0, 255);
	Context.drawHorLineExt(c_oAscLineDrawingRule.Center, (t + b) / 2, l, r, this.LineW, 0, 0);

	if (editor && editor.ShowParaMarks && Context.DrawFootnoteRect)
    {
        Context.DrawFootnoteRect(X, PDSE.LineTop, this.Get_Width(), PDSE.BaseLine - PDSE.LineTop);
    }
};
ParaSeparator.prototype.Measure  = function(Context, TextPr)
{
	this.Width        = (50 * TEXTWIDTH_DIVIDER) | 0;
	this.WidthVisible = (50 * TEXTWIDTH_DIVIDER) | 0;

	this.LineW = (TextPr.FontSize / 18) * g_dKoef_pt_to_mm;
};
ParaSeparator.prototype.Copy     = function()
{
	return new ParaSeparator();
};
ParaSeparator.prototype.UpdateWidth = function(PRS)
{
	var oPara    = PRS.Paragraph;
	var nCurPage = PRS.Page;

	oPara.Parent.Update_ContentIndexing();
	var oLimits = oPara.Parent.Get_PageContentStartPos2(oPara.PageNum, oPara.ColumnNum, nCurPage, oPara.Index);

	var nWidth = (Math.min(50, (oLimits.XLimit - oLimits.X)) * TEXTWIDTH_DIVIDER) | 0;

	this.Width        = nWidth;
	this.WidthVisible = nWidth;
};

/**
 * Класс представляющий собой длинный разделитель (который в основном используется для сносок).
 * @constructor
 * @extends {CRunElementBase}
 */
function ParaContinuationSeparator()
{
	CRunElementBase.call(this);
	this.LineW = 0;
}
ParaContinuationSeparator.prototype = Object.create(CRunElementBase.prototype);
ParaContinuationSeparator.prototype.constructor = ParaContinuationSeparator;
ParaContinuationSeparator.prototype.Type         = para_ContinuationSeparator;
ParaContinuationSeparator.prototype.Get_Type     = function()
{
	return para_ContinuationSeparator;
};
ParaContinuationSeparator.prototype.Draw         = function(X, Y, Context, PDSE)
{
	var l = X, t = PDSE.LineTop, r = X + this.Get_Width(), b = PDSE.BaseLine;

    Context.p_color(0, 0, 0, 255);
	Context.drawHorLineExt(c_oAscLineDrawingRule.Center, (t + b) / 2, l, r, this.LineW, 0, 0);

	if (editor && editor.ShowParaMarks && Context.DrawFootnoteRect)
    {
        Context.DrawFootnoteRect(X, PDSE.LineTop, this.Get_Width(), PDSE.BaseLine - PDSE.LineTop);
    }
};
ParaContinuationSeparator.prototype.Measure      = function(Context, TextPr)
{
	this.Width        = (50 * TEXTWIDTH_DIVIDER) | 0;
	this.WidthVisible = (50 * TEXTWIDTH_DIVIDER) | 0;

	this.LineW = (TextPr.FontSize / 18) * g_dKoef_pt_to_mm;
};
ParaContinuationSeparator.prototype.Copy         = function()
{
	return new ParaContinuationSeparator();
};
ParaContinuationSeparator.prototype.UpdateWidth = function(PRS)
{
	var oPara    = PRS.Paragraph;
	var nCurPage = PRS.Page;

	oPara.Parent.Update_ContentIndexing();
	var oLimits = oPara.Parent.Get_PageContentStartPos2(oPara.PageNum, oPara.ColumnNum, nCurPage, oPara.Index);

	var nWidth = ((oLimits.XLimit - oLimits.X) * TEXTWIDTH_DIVIDER) | 0;

	this.Width        = nWidth;
	this.WidthVisible = nWidth;
};

function ParaPageCount(PageCount)
{
	this.FontKoef  = 1;
	this.NumWidths = [];
	this.Widths    = [];
	this.String    = "";
	this.PageCount = undefined !== PageCount ? PageCount : 1;
}
ParaPageCount.prototype = Object.create(CRunElementBase.prototype);
ParaPageCount.prototype.constructor = ParaPageCount;
ParaPageCount.prototype.Type = para_PageCount;
ParaPageCount.prototype.Copy = function()
{
	return new ParaPageCount();
};
ParaPageCount.prototype.Is_RealContent = function()
{
	return true;
};
ParaPageCount.prototype.Can_AddNumbering = function()
{
	return true;
};
ParaPageCount.prototype.Measure = function(Context, TextPr)
{
	this.FontKoef = TextPr.Get_FontKoef();
	Context.SetFontSlot(fontslot_ASCII, this.FontKoef);

	for (var Index = 0; Index < 10; Index++)
	{
		this.NumWidths[Index] = Context.Measure("" + Index).Width;
	}

	this.private_UpdateWidth();
};
ParaPageCount.prototype.Draw = function(X, Y, Context)
{
	var Len = this.String.length;

	var _X = X;
	var _Y = Y;

	Context.SetFontSlot(fontslot_ASCII, this.FontKoef);
	for (var Index = 0; Index < Len; Index++)
	{
		var Char = this.String.charAt(Index);
		Context.FillText(_X, _Y, Char);
		_X += this.Widths[Index];
	}
};
ParaPageCount.prototype.Document_CreateFontCharMap = function(FontCharMap)
{
	var sValue = "1234567890";
	for (var Index = 0; Index < sValue.length; Index++)
	{
		var Char = sValue.charAt(Index);
		FontCharMap.AddChar(Char);
	}
};
ParaPageCount.prototype.Update_PageCount = function(nPageCount)
{
	this.PageCount = nPageCount;
	this.private_UpdateWidth();
};
ParaPageCount.prototype.private_UpdateWidth = function()
{
	this.String = "" + this.PageCount;

	var RealWidth = 0;
	for (var Index = 0, Len = this.String.length; Index < Len; Index++)
	{
		var Char = parseInt(this.String.charAt(Index));

		this.Widths[Index] = this.NumWidths[Char];
		RealWidth += this.NumWidths[Char];
	}

	RealWidth = (RealWidth * TEXTWIDTH_DIVIDER) | 0;

	this.Width        = RealWidth;
	this.WidthVisible = RealWidth;
};
ParaPageCount.prototype.Write_ToBinary = function(Writer)
{
	// Long : Type
	// Long : PageCount
	Writer.WriteLong(this.Type);
	Writer.WriteLong(this.PageCount);
};
ParaPageCount.prototype.Read_FromBinary = function(Reader)
{
	this.PageCount = Reader.GetLong();
};
ParaPageCount.prototype.GetPageCountValue = function()
{
	return this.PageCount;
};

function ParagraphContent_Read_FromBinary(Reader)
{
	var ElementType = Reader.GetLong();

	var Element = null;
	switch (ElementType)
	{
		case para_TextPr                :
		case para_Drawing               :
		case para_HyperlinkStart        :
		{
			var ElementId = Reader.GetString2();
			Element       = g_oTableId.Get_ById(ElementId);
			return Element;
		}
		case para_RunBase               : Element = new CRunElementBase(); break;
		case para_Text                  : Element = new ParaText(); break;
		case para_Space                 : Element = new ParaSpace(); break;
		case para_End                   : Element = new ParaEnd(); break;
		case para_NewLine               : Element = new ParaNewLine(); break;
		case para_Numbering             : Element = new ParaNumbering(); break;
		case para_Tab                   : Element = new ParaTab(); break;
		case para_PageNum               : Element = new ParaPageNum(); break;
		case para_Math_Placeholder      : Element = new CMathText(); break;
		case para_Math_Text             : Element = new CMathText(); break;
		case para_Math_BreakOperator    : Element = new CMathText(); break;
		case para_Math_Ampersand        : Element = new CMathAmp(); break;
		case para_PresentationNumbering : Element = new ParaPresentationNumbering(); break;
		case para_FootnoteReference     : Element = new ParaFootnoteReference(); break;
		case para_FootnoteRef           : Element = new ParaFootnoteRef(); break;
		case para_Separator             : Element = new ParaSeparator(); break;
		case para_ContinuationSeparator : Element = new ParaContinuationSeparator(); break;
		case para_PageCount             : Element = new ParaPageCount(); break;
	}

	if (null != Element)
		Element.Read_FromBinary(Reader);

	return Element;
}

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].ParaNewLine = ParaNewLine;

window['AscCommonWord'].break_Page = break_Page;
window['AscCommonWord'].break_Column = break_Column;
