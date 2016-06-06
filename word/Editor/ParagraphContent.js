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

// Класс ParaTextPr
function ParaTextPr(Props)
{
    this.Id = AscCommon.g_oIdCounter.Get_NewId();

    this.Type   = para_TextPr;
    this.Value  = new CTextPr();
    this.Parent = null;
    this.CalcValue = this.Value;

    this.Width        = 0;
    this.Height       = 0;
    this.WidthVisible = 0;

    if ( "object" == typeof(Props) )
    {
        this.Value.Set_FromObject( Props );
    }

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}
ParaTextPr.prototype =
{
    Type : para_TextPr,

    Get_Type : function()
    {
        return para_TextPr;
    },
    
    Draw : function()//(X,Y,Context)
    {
        // Ничего не делаем
    },

    Measure : function()//(Context)
    {
        this.Width  = 0;
        this.Height = 0;
        this.WidthVisible = 0;
    },

    Copy : function()
    {
        var ParaTextPr_new = new ParaTextPr( );
        ParaTextPr_new.Set_Value( this.Value );
        return ParaTextPr_new;
    },

    Is_RealContent : function()
    {
        return true;
    },

    Can_AddNumbering : function()
    {
        return false;
    },

    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Get_Id : function()
    {
        return this.Id;
    },
//-----------------------------------------------------------------------------------
// Функции для изменения свойств
//-----------------------------------------------------------------------------------
    Apply_TextPr : function(TextPr)
    {
        if ( undefined != TextPr.Bold )
            this.Set_Bold( TextPr.Bold );

        if ( undefined != TextPr.Italic )
            this.Set_Italic( TextPr.Italic );

        if ( undefined != TextPr.Strikeout )
            this.Set_Strikeout( TextPr.Strikeout );

        if ( undefined != TextPr.Underline )
            this.Set_Underline( TextPr.Underline );

        if ( undefined != TextPr.FontFamily )
            this.Set_FontFamily( TextPr.FontFamily );

        if ( undefined != TextPr.FontSize )
            this.Set_FontSize( TextPr.FontSize );
        
        if ( undefined != TextPr.FontSizeCS )
            this.Set_FontSizeCS( TextPr.FontSizeCS );

        if ( undefined != TextPr.Color )
        {
            this.Set_Color(TextPr.Color);
            if(undefined != this.Value.Unifill)
            {
                this.Set_Unifill(undefined);
            }
            if(undefined != this.Value.TextFill)
            {
                this.Set_TextFill(undefined);
            }
        }

        if ( undefined != TextPr.VertAlign )
            this.Set_VertAlign( TextPr.VertAlign );

        if ( undefined != TextPr.HighLight )
            this.Set_HighLight( TextPr.HighLight );

        if ( undefined != TextPr.RStyle )
            this.Set_RStyle( TextPr.RStyle );

        if ( undefined != TextPr.Spacing )
            this.Set_Spacing( TextPr.Spacing );

        if ( undefined != TextPr.DStrikeout )
            this.Set_DStrikeout( TextPr.DStrikeout );

        if ( undefined != TextPr.Caps )
            this.Set_Caps( TextPr.Caps );

        if ( undefined != TextPr.SmallCaps )
            this.Set_SmallCaps( TextPr.SmallCaps );

        if ( undefined != TextPr.Position )
            this.Set_Position( TextPr.Position );

        if ( undefined != TextPr.RFonts )
            this.Set_RFonts2( TextPr.RFonts );

        if ( undefined != TextPr.Lang )
            this.Set_Lang( TextPr.Lang );

        if(undefined != TextPr.Unifill)
        {
            this.Set_Unifill(TextPr.Unifill.createDuplicate());
            if(undefined != this.Value.Color)
            {
                this.Set_Color(undefined);
            }
            if(undefined != this.Value.TextFill)
            {
                this.Set_TextFill(undefined);
            }
        }
        if(undefined != TextPr.TextOutline)
        {
            this.Set_TextOutline(TextPr.TextOutline);
        }
        if(undefined != TextPr.TextFill)
        {
            this.Set_TextFill(TextPr.TextFill);
            if(undefined != this.Value.Color)
            {
                this.Set_Color(undefined);
            }
            if(undefined != this.Value.Unifill)
            {
                this.Set_Unifill(undefined);
            }
        }
    },

    Clear_Style : function()
    {
        // Пока удаляем все кроме настроек языка
        if ( undefined != this.Value.Bold )
            this.Set_Bold( undefined );

        if ( undefined != this.Value.Italic )
            this.Set_Italic( undefined );

        if ( undefined != this.Value.Strikeout )
            this.Set_Strikeout( undefined );

        if ( undefined != this.Value.Underline )
            this.Set_Underline( undefined );

        if ( undefined != this.Value.FontSize )
            this.Set_FontSize( undefined );

        if ( undefined != this.Value.Color )
            this.Set_Color( undefined );

        if ( undefined != this.Value.Unifill )
            this.Set_Unifill( undefined );

        if ( undefined != this.Value.VertAlign )
            this.Set_VertAlign( undefined );

        if ( undefined != this.Value.HighLight )
            this.Set_HighLight( undefined );

        if ( undefined != this.Value.RStyle )
            this.Set_RStyle( undefined );

        if ( undefined != this.Value.Spacing )
            this.Set_Spacing( undefined );

        if ( undefined != this.Value.DStrikeout )
            this.Set_DStrikeout( undefined );

        if ( undefined != this.Value.Caps )
            this.Set_Caps( undefined );

        if ( undefined != this.Value.SmallCaps )
            this.Set_SmallCaps( undefined );

        if ( undefined != this.Value.Position )
            this.Set_Position( undefined );

        if ( undefined != this.Value.RFonts.Ascii )
            this.Set_RFonts_Ascii( undefined );

        if ( undefined != this.Value.RFonts.HAnsi )
            this.Set_RFonts_HAnsi( undefined );

        if ( undefined != this.Value.RFonts.CS )
            this.Set_RFonts_CS( undefined );

        if ( undefined != this.Value.RFonts.EastAsia )
            this.Set_RFonts_EastAsia( undefined );

        if ( undefined != this.Value.RFonts.Hint )
            this.Set_RFonts_Hint( undefined );

        if(undefined != this.Value.TextFill)
            this.Set_TextFill( undefined );

        if(undefined != this.Value.TextOutline)
            this.Set_TextOutline( undefined );
    },

    Set_Prop : function(Prop, Value)
    {
        var OldValue = ( undefined != this.Value[Prop] ? this.Value[Prop] : undefined );
        this.Value[Prop] = Value;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Change, Prop : Prop, New : Value, Old : OldValue } );
    },

    Delete_Prop : function(Prop)
    {
        if ( undefined === this.Value[Prop] )
            return;

        var OldValue = this.Value[Prop];

        this.Value[Prop] = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Change, Prop : Prop, New : null, Old : OldValue } );
    },

    Set_Bold : function(Value)
    {
        var OldValue = ( undefined != this.Value.Bold ? this.Value.Bold : undefined );

        if ( undefined != Value )
            this.Value.Bold = Value;
        else
            this.Value.Bold = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Bold, New : Value, Old : OldValue } );
    },

    Set_Italic : function(Value)
    {
        var OldValue = ( undefined != this.Value.Italic ? this.Value.Italic : undefined );

        if ( undefined != Value )
            this.Value.Italic = Value;
        else
            this.Value.Italic = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Italic, New : Value, Old : OldValue } );
    },

    Set_Strikeout : function(Value)
    {
        var OldValue = ( undefined != this.Value.Strikeout ? this.Value.Strikeout : undefined );

        if ( undefined != Value )
            this.Value.Strikeout = Value;
        else
            this.Value.Strikeout = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Strikeout, New : Value, Old : OldValue } );
    },

    Set_Underline : function(Value)
    {
        var OldValue = ( undefined != this.Value.Underline ? this.Value.Underline : undefined );

        if ( undefined != Value )
            this.Value.Underline = Value;
        else
            this.Value.Underline = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Underline, New : Value, Old : OldValue } );
    },

    Set_FontFamily : function(Value)
    {
        var OldValue = ( undefined != this.Value.FontFamily ? this.Value.FontFamily : undefined );

        if ( undefined != Value )
            this.Value.FontFamily = Value;
        else
            this.Value.FontFamily = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_FontFamily, New : Value, Old : OldValue } );
    },

    Set_FontSize : function(Value)
    {
        var OldValue = ( undefined != this.Value.FontSize ? this.Value.FontSize : undefined );

        if ( undefined != Value )
            this.Value.FontSize = Value;
        else
            this.Value.FontSize = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_FontSize, New : Value, Old : OldValue } );
    },
    
    Set_FontSizeCS : function(Value)
    {
        var OldValue = ( undefined != this.Value.FontSizeCS ? this.Value.FontSizeCS : undefined );

        if ( undefined != Value )
            this.Value.FontSizeCS = Value;
        else
            this.Value.FontSizeCS = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_FontSizeCS, New : Value, Old : OldValue } );
    },

    Set_Color : function(Value)
    {
        var OldValue = ( undefined != this.Value.Color ? this.Value.Color : undefined );

        if ( undefined != Value )
            this.Value.Color = Value;
        else
            this.Value.Color = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Color, New : Value, Old : OldValue } );
    },

    Set_VertAlign : function(Value)
    {
        var OldValue = ( undefined != this.Value.VertAlign ? this.Value.VertAlign : undefined );

        if ( undefined != Value )
            this.Value.VertAlign = Value;
        else
            this.Value.VertAlign = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_VertAlign, New : Value, Old : OldValue } );
    },

    Set_HighLight : function(Value)
    {
        var OldValue = ( undefined != this.Value.HighLight ? this.Value.HighLight : undefined );

        if ( undefined != Value )
            this.Value.HighLight = Value;
        else
            this.Value.HighLight = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_HighLight, New : Value, Old : OldValue } );
    },

    Set_RStyle : function(Value)
    {
        var OldValue = ( undefined != this.Value.RStyle ? this.Value.RStyle : undefined );

        if ( undefined != Value )
            this.Value.RStyle = Value;
        else
            this.Value.RStyle = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_RStyle, New : Value, Old : OldValue } );
    },

    Set_Spacing : function(Value)
    {
        var OldValue = ( undefined != this.Value.Spacing ? this.Value.Spacing : undefined );

        if ( undefined != Value )
            this.Value.Spacing = Value;
        else
            this.Value.Spacing = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Spacing, New : Value, Old : OldValue } );
    },

    Set_DStrikeout : function(Value)
    {
        var OldValue = ( undefined != this.Value.DStrikeout ? this.Value.DStrikeout : undefined );

        if ( undefined != Value )
            this.Value.DStrikeout = Value;
        else
            this.Value.DStrikeout = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_DStrikeout, New : Value, Old : OldValue } );
    },

    Set_Caps : function(Value)
    {
        var OldValue = ( undefined != this.Value.Caps ? this.Value.Caps : undefined );

        if ( undefined != Value )
            this.Value.Caps = Value;
        else
            this.Value.Caps = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Caps, New : Value, Old : OldValue } );
    },

    Set_SmallCaps : function(Value)
    {
        var OldValue = ( undefined != this.Value.SmallCaps ? this.Value.SmallCaps : undefined );

        if ( undefined != Value )
            this.Value.SmallCaps = Value;
        else
            this.Value.SmallCaps = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_SmallCaps, New : Value, Old : OldValue } );
    },

    Set_Position : function(Value)
    {
        var OldValue = ( undefined != this.Value.Position ? this.Value.Position : undefined );

        if ( undefined != Value )
            this.Value.Position = Value;
        else
            this.Value.Position = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Position, New : Value, Old : OldValue } );
    },

    Set_Value : function(Value)
    {
        var OldValue = this.Value;
        this.Value = Value;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Value, New : Value, Old : OldValue } );
    },

    Set_RFonts : function(Value)
    {
        var OldValue = this.RFonts.Value;
        if ( undefined != Value )
            this.Value.RFonts = Value;
        else
            this.Value.RFonts = new CRFonts();

        History.Add( this, { Type : AscDFH.historyitem_TextPr_RFonts, New : Value, Old : OldValue } );
    },

    Set_RFonts2 : function(RFonts)
    {
        if ( undefined != RFonts )
        {
            if ( undefined != RFonts.Ascii )
                this.Set_RFonts_Ascii( RFonts.Ascii );

            if ( undefined != RFonts.HAnsi )
                this.Set_RFonts_HAnsi( RFonts.HAnsi );

            if ( undefined != RFonts.CS )
                this.Set_RFonts_CS( RFonts.CS );

            if ( undefined != RFonts.EastAsia )
                this.Set_RFonts_EastAsia( RFonts.EastAsia );

            if ( undefined != RFonts.Hint )
                this.Set_RFonts_Hint( RFonts.Hint );
        }
    },

    Set_RFonts_Ascii : function(Value)
    {
        var OldValue = this.Value.RFonts.Ascii;

        if ( undefined != Value )
            this.Value.RFonts.Ascii = Value;
        else
            this.Value.RFonts.Ascii = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_RFonts_Ascii, New : Value, Old : OldValue } );
    },

    Set_RFonts_HAnsi : function(Value)
    {
        var OldValue = this.Value.RFonts.HAnsi;

        if ( undefined != Value )
            this.Value.RFonts.HAnsi = Value;
        else
            this.Value.RFonts.HAnsi = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_RFonts_HAnsi, New : Value, Old : OldValue } );
    },

    Set_RFonts_CS : function(Value)
    {
        var OldValue = this.Value.RFonts.CS;

        if ( undefined != Value )
            this.Value.RFonts.CS = Value;
        else
            this.Value.RFonts.CS = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_RFonts_CS, New : Value, Old : OldValue } );
    },

    Set_RFonts_EastAsia : function(Value)
    {
        var OldValue = this.Value.RFonts.EastAsia;

        if ( undefined != Value )
            this.Value.RFonts.EastAsia = Value;
        else
            this.Value.RFonts.EastAsia = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_RFonts_EastAsia, New : Value, Old : OldValue } );
    },

    Set_RFonts_Hint : function(Value)
    {
        var OldValue = this.Value.RFonts.Hint;

        if ( undefined != Value )
            this.Value.RFonts.Hint = Value;
        else
            this.Value.RFonts.Hint = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_RFonts_Hint, New : Value, Old : OldValue } );
    },

    Set_Lang : function(Value)
    {
        var OldValue = this.Value.Lang;

        var NewValue = new CLang();
        if ( undefined != Value )
            NewValue.Set_FromObject( Value );

        this.Value.Lang = NewValue;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Lang, New : NewValue, Old : OldValue } );
    },

    Set_Lang_Bidi : function(Value)
    {
        var OldValue = this.Value.Lang.Bidi;

        if ( undefined != Value )
            this.Value.Lang.Bidi = Value;
        else
            this.Value.Lang.Bidi = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Lang_Bidi, New : Value, Old : OldValue } );
    },

    Set_Lang_EastAsia : function(Value)
    {
        var OldValue = this.Value.Lang.EastAsia;

        if ( undefined != Value )
            this.Value.Lang.EastAsia = Value;
        else
            this.Value.Lang.EastAsia = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Lang_EastAsia, New : Value, Old : OldValue } );
    },

    Set_Lang_Val : function(Value)
    {
        var OldValue = this.Value.Lang.Val;

        if ( undefined != Value )
            this.Value.Lang.Val = Value;
        else
            this.Value.Lang.Val = undefined;

        History.Add( this, { Type : AscDFH.historyitem_TextPr_Lang_Val, New : Value, Old : OldValue } );
    },


    Set_Unifill : function(Value)
    {
        var OldValue = this.Value.Unifill;

        if ( undefined != Value )
            this.Value.Unifill = Value;
        else
            this.Value.Unifill = undefined;
        History.Add(this, {Type: AscDFH.historyitem_TextPr_Unifill, New: Value, Old: OldValue});
    },

    Set_TextOutline : function(Value)
    {
        var OldValue = this.Value.TextOutline;

        if ( undefined != Value )
            this.Value.TextOutline = Value;
        else
            this.Value.TextOutline = undefined;
        History.Add(this, {Type: AscDFH.historyitem_TextPr_Outline, New: Value, Old: OldValue});
    },

    Set_TextFill : function(Value)
    {
        var OldValue = this.Value.TextFill;

        if ( undefined != Value )
            this.Value.TextFill = Value;
        else
            this.Value.TextFill = undefined;
        History.Add(this, {Type: AscDFH.historyitem_TextPr_Fill, New: Value, Old: OldValue});
    },
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case AscDFH.historyitem_TextPr_Change:
            {
                if ( undefined != Data.Old )
                    this.Value[Data.Prop] = Data.Old;
                else
                    this.Value[Data.Prop] = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Bold:
            {
                if ( undefined != Data.Old )
                    this.Value.Bold = Data.Old;
                else
                    this.Value.Bold = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Italic:
            {
                if ( undefined != Data.Old )
                    this.Value.Italic = Data.Old;
                else
                    this.Value.Italic = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Strikeout:
            {
                if ( undefined != Data.Old )
                    this.Value.Strikeout = Data.Old;
                else
                    this.Value.Strikeout = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Underline:
            {
                if ( undefined != Data.Old )
                    this.Value.Underline = Data.Old;
                else
                    this.Value.Underline = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_FontFamily:
            {
                if ( undefined != Data.Old )
                    this.Value.FontFamily = Data.Old;
                else
                    this.Value.FontFamily = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_FontSize:
            {
                if ( undefined != Data.Old )
                    this.Value.FontSize = Data.Old;
                else
                    this.Value.FontSize = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_FontSizeCS:
            {
                if ( undefined != Data.Old )
                    this.Value.FontSizeCS = Data.Old;
                else
                    this.Value.FontSizeCS = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Color:
            {
                if ( undefined != Data.Old )
                    this.Value.Color = Data.Old;
                else
                    this.Value.Color = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_VertAlign:
            {
                if ( undefined != Data.Old )
                    this.Value.VertAlign = Data.Old;
                else
                    this.Value.VertAlign = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_HighLight:
            {
                if ( undefined != Data.Old )
                    this.Value.HighLight = Data.Old;
                else
                    this.Value.HighLight = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_RStyle:
            {
                if ( undefined != Data.Old )
                    this.Value.RStyle = Data.Old;
                else
                    this.Value.RStyle = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Spacing:
            {
                if ( undefined != Data.Old )
                    this.Value.Spacing = Data.Old;
                else
                    this.Value.Spacing = undefined;

                break;
            }
            case AscDFH.historyitem_TextPr_DStrikeout:
            {
                if ( undefined != Data.Old )
                    this.Value.DStrikeout = Data.Old;
                else
                    this.Value.DStrikeout = undefined;

                break;
            }
            case AscDFH.historyitem_TextPr_Caps:
            {
                if ( undefined != Data.Old )
                    this.Value.Caps = Data.Old;
                else
                    this.Value.Caps = undefined;

                break;
            }
            case AscDFH.historyitem_TextPr_SmallCaps:
            {
                if ( undefined != Data.Old )
                    this.Value.SmallCaps = Data.Old;
                else
                    this.Value.SmallCaps = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Position:
            {
                if ( undefined != Data.Old )
                    this.Value.Position = Data.Old;
                else
                    this.Value.Position = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Value:
            {
                this.Value = Data.Old;

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts:
            {
                if ( undefined != Data.Old )
                    this.Value.RFonts = Data.Old;
                else
                    this.Value.RFonts = new CRFonts();

                break;
            }

            case AscDFH.historyitem_TextPr_Lang:
            {
                if ( undefined != Data.Old )
                    this.Value.Lang = Data.Old;
                else
                    this.Value.Lang = new CLang();

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_Ascii:
            {
                if ( undefined != Data.Old )
                    this.Value.RFonts.Ascii = Data.Old;
                else
                    this.Value.RFonts.Ascii = undefined;
                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_HAnsi:
            {
                if ( undefined != Data.Old )
                    this.Value.RFonts.Ascii = Data.Old;
                else
                    this.Value.RFonts.Ascii = undefined;
                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_CS:
            {
                if ( undefined != Data.Old )
                    this.Value.RFonts.Ascii = Data.Old;
                else
                    this.Value.RFonts.Ascii = undefined;
                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_EastAsia:
            {
                if ( undefined != Data.Old )
                    this.Value.RFonts.Ascii = Data.Old;
                else
                    this.Value.RFonts.Ascii = undefined;
                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_Hint:
            {
                if ( undefined != Data.Old )
                    this.Value.RFonts.Ascii = Data.Old;
                else
                    this.Value.RFonts.Ascii = undefined;
                break;
            }

            case AscDFH.historyitem_TextPr_Lang_Bidi:
            {
                if ( undefined != Data.Old )
                    this.Value.Lang.Bidi = Data.Old;
                else
                    this.Value.Lang.Bidi = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Lang_EastAsia:
            {
                if ( undefined != Data.Old )
                    this.Value.Lang.EastAsia = Data.Old;
                else
                    this.Value.Lang.EastAsia = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Lang_Val:
            {
                if ( undefined != Data.Old )
                    this.Value.Lang.Val = Data.Old;
                else
                    this.Value.Lang.Val = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Unifill:
            {
                if ( undefined != Data.Old )
                    this.Value.Unifill = Data.Old;
                else
                    this.Value.Unifill = undefined;
                break;
            }
            case AscDFH.historyitem_TextPr_Outline:
            {
                if ( undefined != Data.Old )
                    this.Value.TextOutline = Data.Old;
                else
                    this.Value.TextOutline = undefined;
                break;
            }
            case AscDFH.historyitem_TextPr_Fill:
            {
                if ( undefined != Data.Old )
                    this.Value.TextFill = Data.Old;
                else
                    this.Value.TextFill = undefined;
                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {

            case AscDFH.historyitem_TextPr_Change:
            {
                if ( undefined != Data.New )
                    this.Value[Data.Prop] = Data.New;
                else
                    this.Value[Data.Prop] = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Bold:
            {
                if ( undefined != Data.New )
                    this.Value.Bold = Data.New;
                else
                    this.Value.Bold = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Italic:
            {
                if ( undefined != Data.New )
                    this.Value.Italic = Data.New;
                else
                    this.Value.Italic = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Strikeout:
            {
                if ( undefined != Data.New )
                    this.Value.Strikeout = Data.New;
                else
                    this.Value.Strikeout = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Underline:
            {
                if ( undefined != Data.New )
                    this.Value.Underline = Data.New;
                else
                    this.Value.Underline = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_FontFamily:
            {
                if ( undefined != Data.New )
                    this.Value.FontFamily = Data.New;
                else
                    this.Value.FontFamily = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_FontSize:
            {
                if ( undefined != Data.New )
                    this.Value.FontSize = Data.New;
                else
                    this.Value.FontSize = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_FontSizeCS:
            {
                if ( undefined != Data.New )
                    this.Value.FontSizeCS = Data.New;
                else
                    this.Value.FontSizeCS = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Color:
            {
                if ( undefined != Data.New )
                    this.Value.Color = Data.New;
                else
                    this.Value.Color = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_VertAlign:
            {
                if ( undefined != Data.New )
                    this.Value.VertAlign = Data.New;
                else
                    this.Value.VertAlign = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_HighLight:
            {
                if ( undefined != Data.New )
                    this.Value.HighLight = Data.New;
                else
                    this.Value.HighLight = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_RStyle:
            {
                if ( undefined != Data.New )
                    this.Value.RStyle = Data.New;
                else
                    this.Value.RStyle = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Spacing:
            {
                if ( undefined != Data.New )
                    this.Value.Spacing = Data.New;
                else
                    this.Value.Spacing = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_DStrikeout:
            {
                if ( undefined != Data.New )
                    this.Value.DStrikeout = Data.New;
                else
                    this.Value.DStrikeout = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Caps:
            {
                if ( undefined != Data.New )
                    this.Value.Caps = Data.New;
                else
                    this.Value.Caps = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_SmallCaps:
            {
                if ( undefined != Data.New )
                    this.Value.SmallCaps = Data.New;
                else
                    this.Value.SmallCaps = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Position:
            {
                if ( undefined != Data.New )
                    this.Value.Position = Data.New;
                else
                    this.Value.Position = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Value:
            {
                this.Value = Data.New;

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts:
            {
                if ( undefined != Data.New )
                    this.Value.RFonts = Data.New;
                else
                    this.Value.RFonts = new CRFonts();

                break;
            }

            case AscDFH.historyitem_TextPr_Lang:
            {
                if ( undefined != Data.New )
                    this.Value.Lang = Data.New;
                else
                    this.Value.Lang = new CLang();

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_Ascii:
            {
                if ( undefined != Data.New )
                    this.Value.RFonts.Ascii = Data.New;
                else
                    this.Value.RFonts.Ascii = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_HAnsi:
            {
                if ( undefined != Data.New )
                    this.Value.RFonts.Ascii = Data.New;
                else
                    this.Value.RFonts.Ascii = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_CS:
            {
                if ( undefined != Data.New )
                    this.Value.RFonts.Ascii = Data.New;
                else
                    this.Value.RFonts.Ascii = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_EastAsia:
            {
                if ( undefined != Data.New )
                    this.Value.RFonts.Ascii = Data.New;
                else
                    this.Value.RFonts.Ascii = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_Hint:
            {
                if ( undefined != Data.New )
                    this.Value.RFonts.Ascii = Data.New;
                else
                    this.Value.RFonts.Ascii = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Lang_Bidi:
            {
                if ( undefined != Data.New )
                    this.Value.Lang.Bidi = Data.New;
                else
                    this.Value.Lang.Bidi = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Lang_EastAsia:
            {
                if ( undefined != Data.New )
                    this.Value.Lang.EastAsia = Data.New;
                else
                    this.Value.Lang.EastAsia = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Lang_Val:
            {
                if ( undefined != Data.New )
                    this.Value.Lang.Val = Data.New;
                else
                    this.Value.Lang.Val = undefined;

                break;
            }
            case AscDFH.historyitem_TextPr_Unifill:
            {
                if ( undefined != Data.New )
                    this.Value.Unifill = Data.New;
                else
                    this.Value.Unifill = undefined;

                break;
            }
            case AscDFH.historyitem_TextPr_Outline:
            {
                if ( undefined != Data.New )
                    this.Value.TextOutline = Data.New;
                else
                    this.Value.TextOutline = undefined;
                break;
            }
            case AscDFH.historyitem_TextPr_Fill:
            {
                if ( undefined != Data.New )
                    this.Value.TextFill = Data.New;
                else
                    this.Value.TextFill = undefined;
                break;
            }
        }
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        if ( null != this.Parent )
            return this.Parent.Get_ParentObject_or_DocumentPos();
    },

    Refresh_RecalcData : function(Data)
    {
        if ( undefined !== this.Parent && null !== this.Parent )
            this.Parent.Refresh_RecalcData2();
    },
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------
    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // String : Id

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( AscDFH.historyitem_type_TextPr );

        // Long   : Type
        // String : Id
        // Long   : Value

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
        this.Value.Write_ToBinary( Writer );
    },

    Read_FromBinary2 : function(Reader)
    {
        this.Type = Reader.GetLong();
        this.Id   = Reader.GetString2();

        this.Value.Clear();
        this.Value.Read_FromBinary( Reader );
    },

    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( AscDFH.historyitem_type_TextPr );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case AscDFH.historyitem_TextPr_Change:
            {
                // Variable : TextPr

                var TextPr = new CTextPr();
                TextPr[Data.Prop] = Data.New;
                TextPr.Write_ToBinary( Writer );

                break;
            }

            case AscDFH.historyitem_TextPr_Bold:
            case AscDFH.historyitem_TextPr_Italic:
            case AscDFH.historyitem_TextPr_Strikeout:
            case AscDFH.historyitem_TextPr_Underline:
            {
                // Bool : IsUndefined
                // Bool : Value

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteBool( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case AscDFH.historyitem_TextPr_FontFamily:
            {
                // Bool   : IsUndefined
                // String : FontName

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    Writer.WriteString2( Data.New.Name );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case AscDFH.historyitem_TextPr_FontSize:
            case AscDFH.historyitem_TextPr_FontSizeCS:
            {
                // Bool   : IsUndefined
                // Double : FontSize

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    Writer.WriteDouble( Data.New );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case AscDFH.historyitem_TextPr_Color:
            case AscDFH.historyitem_TextPr_Unifill:
            case AscDFH.historyitem_TextPr_Outline:
            case AscDFH.historyitem_TextPr_Fill   :
            {
                // Bool     : IsUndefined
                // Variable : Color (CDocumentColor)

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case AscDFH.historyitem_TextPr_VertAlign:
            {
                // Bool  : IsUndefined
                // Long  : VertAlign

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    Writer.WriteLong(Data.New);
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case AscDFH.historyitem_TextPr_HighLight:
            {
                // Bool  : IsUndefined
                // Если false
                //   Bool  : IsNone
                //   Если false
                //     Variable : Color (CDocumentColor)

                if ( undefined != Data.New )
                {
                    Writer.WriteBool(false);
                    if ( highlight_None != Data.New )
                    {
                        Writer.WriteBool( false );
                        Data.New.Write_ToBinary( Writer );
                    }
                    else
                        Writer.WriteBool( true );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case AscDFH.historyitem_TextPr_RStyle:
            {
                // Bool : IsUndefined
                // Если false
                //   String : RStyle

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteString2( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case AscDFH.historyitem_TextPr_Spacing:
            case AscDFH.historyitem_TextPr_Position:
            {
                // Bool : IsUndefined
                // Если false
                //   Double : Spacing

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteDouble( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case AscDFH.historyitem_TextPr_DStrikeout:
            case AscDFH.historyitem_TextPr_Caps:
            case AscDFH.historyitem_TextPr_SmallCaps:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : value

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteBool( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case AscDFH.historyitem_TextPr_Value:
            {
                // CTextPr
                Data.New.Write_ToBinary(Writer);

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts:
            {
                // Bool : undefined ?
                // false -> CRFonts
                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case AscDFH.historyitem_TextPr_Lang:
            {
                // Bool : undefined ?
                // false -> CLang
                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_Ascii:
            case AscDFH.historyitem_TextPr_RFonts_HAnsi:
            case AscDFH.historyitem_TextPr_RFonts_CS:
            case AscDFH.historyitem_TextPr_RFonts_EastAsia:
            {
                // Bool : undefined?
                // false -> String

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteString2( Data.New.Name );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_Hint:
            {
                // Bool : undefined?
                // false -> Long

                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteLong( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }

            case AscDFH.historyitem_TextPr_Lang_Bidi:
            case AscDFH.historyitem_TextPr_Lang_EastAsia:
            case AscDFH.historyitem_TextPr_Lang_Val:
            {
                // Bool : undefined ?
                // false -> Long
                if ( undefined != Data.New )
                {
                    Writer.WriteBool( false );
                    Writer.WriteLong( Data.New );
                }
                else
                    Writer.WriteBool( true );

                break;
            }
        }

        return Writer;
    },

    Load_Changes : function(Reader)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( AscDFH.historyitem_type_TextPr != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case AscDFH.historyitem_TextPr_Change:
            {
                // Variable : TextPr

                var TextPr = new CTextPr();
                TextPr.Read_FromBinary( Reader );
                this.Value.Merge( TextPr );

                break;
            }

            case AscDFH.historyitem_TextPr_Bold:
            {
                // Bool : IsUndefined
                // Bool : Bold

                if ( true === Reader.GetBool() )
                    this.Value.Bold = undefined;
                else
                    this.Value.Bold = Reader.GetBool();

                break;
            }

            case AscDFH.historyitem_TextPr_Italic:
            {
                // Bool : IsUndefined
                // Bool : Italic

                if ( true === Reader.GetBool() )
                    this.Value.Italic = undefined;
                else
                    this.Value.Italic = Reader.GetBool();

                break;
            }

            case AscDFH.historyitem_TextPr_Strikeout:
            {
                // Bool : IsUndefined
                // Bool : Strikeout

                if ( true === Reader.GetBool() )
                    this.Value.Strikeout = undefined;
                else
                    this.Value.Strikeout = Reader.GetBool();

                break;
            }

            case AscDFH.historyitem_TextPr_Underline:
            {
                // Bool   : IsUndefined?
                // Bool   : Underline

                if ( true != Reader.GetBool() )
                    this.Value.Underline = Reader.GetBool();
                else
                    this.Value.Underline = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_FontFamily:
            {
                // Bool   : IsUndefined
                // String : FontName

                if ( true != Reader.GetBool() )
                {
                    this.Value.FontFamily =
                    {
                        Name  : Reader.GetString2(),
                        Index : -1
                    };
                }
                else
                    this.Value.FontFamily = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_FontSize:
            {
                // Bool   : IsUndefined
                // Double : FontSize

                if ( true != Reader.GetBool() )
                    this.Value.FontSize = Reader.GetDouble();
                else
                    this.Value.FontSize = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_FontSizeCS:
            {
                // Bool   : IsUndefined
                // Double : FontSize

                if ( true != Reader.GetBool() )
                    this.Value.FontSizeCS = Reader.GetDouble();
                else
                    this.Value.FontSizeCS = undefined;

                break;
            }                

            case AscDFH.historyitem_TextPr_Color:
            {
                // Bool     : IsUndefined
                // Variable : Color (CDocumentColor)

                if ( true != Reader.GetBool() )
                {
                    var r = Reader.GetByte();
                    var g = Reader.GetByte();
                    var b = Reader.GetByte();
                    this.Value.Color = new CDocumentColor( r, g, b );
                }
                else
                    this.Value.Color = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Unifill:
            {
                if ( true != Reader.GetBool() )
                {
                    var unifill = new AscFormat.CUniFill();
                    unifill.Read_FromBinary(Reader);
                    this.Value.Unifill = unifill;

                    if(typeof AscCommon.CollaborativeEditing !== "undefined")
                    {
                        if(unifill.fill && unifill.fill.type === Asc.c_oAscFill.FILL_TYPE_BLIP && typeof unifill.fill.RasterImageId === "string" && unifill.fill.RasterImageId.length > 0)
                        {
                            AscCommon.CollaborativeEditing.Add_NewImage(AscCommon.getFullImageSrc2(unifill.fill.RasterImageId));
                        }
                    }
                }
                else
                    this.Value.Unifill = undefined;
                break;
            }
            case AscDFH.historyitem_TextPr_Fill:
            {
                if ( true != Reader.GetBool() )
                {
                    var unifill = new AscFormat.CUniFill();
                    unifill.Read_FromBinary(Reader);
                    this.Value.TextFill = unifill;
                }
                else
                    this.Value.TextFill = undefined;
                break;
            }
            case AscDFH.historyitem_TextPr_Outline:
            {
                if ( true != Reader.GetBool() )
                {
                    var line = new AscFormat.CLn();
                    line.Read_FromBinary(Reader);
                    this.Value.TextOutline = line;
                }
                else
                    this.Value.TextOutline = undefined;
                break;
            }

            case AscDFH.historyitem_TextPr_VertAlign:
            {
                // Bool  : IsUndefined
                // Long  : VertAlign

                if ( true != Reader.GetBool() )
                    this.Value.VertAlign = Reader.GetLong();
                else
                    this.Value.VertAlign = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_HighLight:
            {
                // Bool  : IsUndefined
                // Если false
                //   Bool  : IsNull
                //   Если false
                //     Variable : Color (CDocumentColor)

                if ( true != Reader.GetBool() )
                {
                    if ( true != Reader.GetBool() )
                    {
                        this.Value.HighLight = new CDocumentColor(0,0,0);
                        this.Value.HighLight.Read_FromBinary(Reader);
                    }
                    else
                        this.Value.HighLight = highlight_None;
                }
                else
                    this.Value.HighLight = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_RStyle:
            {
                // Bool : IsUndefined
                // Если false
                //   String : RStyle

                if ( true != Reader.GetBool() )
                    this.Value.RStyle = Reader.GetString2();
                else
                    this.Value.RStyle = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Spacing:
            {
                // Bool : IsUndefined
                // Если false
                //   Double : Spacing

                if ( true != Reader.GetBool() )
                    this.Value.Spacing = Reader.GetDouble();
                else
                    this.Value.Spacing = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_DStrikeout:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : DStrikeout

                if ( true != Reader.GetBool() )
                    this.Value.DStrikeout = Reader.GetBool();
                else
                    this.Value.DStrikeout = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Caps:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : Caps

                if ( true != Reader.GetBool() )
                    this.Value.Caps = Reader.GetBool();
                else
                    this.Value.Caps = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_SmallCaps:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : SmallCaps

                if ( true != Reader.GetBool() )
                    this.Value.SmallCaps = Reader.GetBool();
                else
                    this.Value.SmallCaps = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Position:
            {
                // Bool : IsUndefined
                // Если false
                //   Double : Position

                if ( true != Reader.GetBool() )
                    this.Value.Position = Reader.GetDouble();
                else
                    this.Value.Position = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Value:
            {
                // CTextPr
                this.Value = new CTextPr();
                this.Value.Read_FromBinary( Reader );

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts:
            {
                // Bool : undefined ?
                // false -> CRFonts
                if ( false === Reader.GetBool() )
                {
                    this.Value.RFonts = new CRFonts();
                    this.Value.RFonts.Read_FromBinary( Reader );
                }
                else
                    this.Value.RFonts = new CRFonts();

                break;
            }

            case AscDFH.historyitem_TextPr_Lang:
            {
                // Bool : undefined ?
                // false -> Lang
                if ( false === Reader.GetBool() )
                {
                    this.Value.Lang = new CLang();
                    this.Value.Lang.Read_FromBinary( Reader );
                }
                else
                    this.Value.Lang = new CLang();

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_Ascii:
            {
                // Bool : undefined ?
                // false -> String
                if ( false === Reader.GetBool() )
                {
                    this.Value.RFonts.Ascii =
                    {
                        Name  : Reader.GetString2(),
                        Index : -1
                    };
                }
                else
                    this.Value.RFonts.Ascii = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_HAnsi:
            {
                // Bool : undefined ?
                // false -> String
                if ( false === Reader.GetBool() )
                {
                    this.Value.RFonts.HAnsi =
                    {
                        Name  : Reader.GetString2(),
                        Index : -1
                    };
                }
                else
                    this.Value.RFonts.HAnsi = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_CS:
            {
                // Bool : undefined ?
                // false -> String
                if ( false === Reader.GetBool() )
                {
                    this.Value.RFonts.CS =
                    {
                        Name  : Reader.GetString2(),
                        Index : -1
                    };
                }
                else
                    this.Value.RFonts.CS = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_EastAsia:
            {
                // Bool : undefined ?
                // false -> String
                if ( false === Reader.GetBool() )
                {
                    this.Value.RFonts.EastAsia =
                    {
                        Name  : Reader.GetString2(),
                        Index : -1
                    };
                }
                else
                    this.Value.RFonts.Ascii = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_RFonts_Hint:
            {
                // Bool : undefined ?
                // false -> Long
                if ( false === Reader.GetBool() )
                    this.Value.RFonts.Hint = Reader.GetLong();
                else
                    this.Value.RFonts.Hint = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Lang_Bidi:
            {
                // Bool : undefined ?
                // false -> Long

                if ( false === Reader.GetBool() )
                    this.Value.Lang.Bidi = Reader.GetLong();
                else
                    this.Value.Lang.Bidi = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Lang_EastAsia:
            {
                // Bool : undefined ?
                // false -> Long

                if ( false === Reader.GetBool() )
                    this.Value.Lang.EastAsia = Reader.GetLong();
                else
                    this.Value.Lang.EastAsia = undefined;

                break;
            }

            case AscDFH.historyitem_TextPr_Lang_Val:
            {
                // Bool : undefined ?
                // false -> Long

                if ( false === Reader.GetBool() )
                    this.Value.Lang.Val = Reader.GetLong();
                else
                    this.Value.Lang.Val = undefined;

                break;
            }

        }
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

var drawing_Inline = 0x01;
var drawing_Anchor = 0x02;

function CParagraphLayout(X, Y, PageNum, LastItemW, ColumnStartX, ColumnEndX, Left_Margin, Right_Margin, Page_W, Top_Margin, Bottom_Margin, Page_H, MarginH, MarginV, LineTop, ParagraphTop)
{
    this.X             = X;
    this.Y             = Y;
    this.PageNum       = PageNum;
    this.LastItemW     = LastItemW;
    this.ColumnStartX  = ColumnStartX;
    this.ColumnEndX    = ColumnEndX;
    this.Left_Margin   = Left_Margin;
    this.Right_Margin  = Right_Margin;
    this.Page_W        = Page_W;
    this.Top_Margin    = Top_Margin;
    this.Bottom_Margin = Bottom_Margin;
    this.Page_H        = Page_H;
    this.Margin_H      = MarginH;
    this.Margin_V      = MarginV;
    this.LineTop       = LineTop;
    this.ParagraphTop  = ParagraphTop;
}

function CAnchorPosition()
{
    // Рассчитанные координаты
    this.CalcX         = 0;
    this.CalcY         = 0;

    // Данные для Inline-объектов
    this.YOffset       = 0;

    // Данные для Flow-объектов
    this.W             = 0;
    this.H             = 0;
    this.X             = 0;
    this.Y             = 0;
    this.PageNum       = 0;
    this.LastItemW     = 0;
    this.ColumnStartX  = 0;
    this.ColumnEndX    = 0;
    this.Left_Margin   = 0;
    this.Right_Margin  = 0;
    this.Page_W        = 0;
    this.Top_Margin    = 0;
    this.Bottom_Margin = 0;
    this.Page_H        = 0;
    this.Margin_H      = 0;
    this.Margin_V      = 0;
    this.LineTop       = 0;
    this.ParagraphTop  = 0;
    this.Page_X        = 0;
    this.Page_Y        = 0;
}

CAnchorPosition.prototype =
{
    Set : function(W, H, YOffset, ParaLayout, PageLimits)
    {
        this.W             = W;
        this.H             = H;

        this.YOffset       = YOffset;

        this.X             = ParaLayout.X;
        this.Y             = ParaLayout.Y;
        this.PageNum       = ParaLayout.PageNum;
        this.LastItemW     = ParaLayout.LastItemW;
        this.ColumnStartX  = ParaLayout.ColumnStartX;
        this.ColumnEndX    = ParaLayout.ColumnEndX;
        this.Left_Margin   = ParaLayout.Left_Margin;
        this.Right_Margin  = ParaLayout.Right_Margin;
        this.Page_W        = PageLimits.XLimit - PageLimits.X;// ParaLayout.Page_W;
        this.Top_Margin    = ParaLayout.Top_Margin;
        this.Bottom_Margin = ParaLayout.Bottom_Margin;
        this.Page_H        = PageLimits.YLimit - PageLimits.Y;// ParaLayout.Page_H;
        this.Margin_H      = ParaLayout.Margin_H;
        this.Margin_V      = ParaLayout.Margin_V;
        this.LineTop       = ParaLayout.LineTop;
        this.ParagraphTop  = ParaLayout.ParagraphTop;
        this.Page_X        = PageLimits.X;
        this.Page_Y        = PageLimits.Y;
    },

    Calculate_X : function(bInline, RelativeFrom, bAlign, Value, bPercent)
    {
        if ( true === bInline )
        {
            this.CalcX = this.X;
        }
        else
        {
            // Вычисляем координату по X
            switch(RelativeFrom)
            {
                case c_oAscRelativeFromH.Character:
                {
                    // Почему то Word при позиционировании относительно символа использует не
                    // текущуюю позицию, а позицию предыдущего элемента (именно для этого мы
                    // храним параметр LastItemW).

                    var _X = this.X - this.LastItemW;

                    if ( true === bAlign )
                    {
                        switch ( Value )
                        {
                            case c_oAscAlignH.Center:
                            {
                                this.CalcX = _X - this.W / 2;
                                break;
                            }

                            case c_oAscAlignH.Inside:
                            case c_oAscAlignH.Outside:
                            case c_oAscAlignH.Left:
                            {
                                this.CalcX = _X;
                                break;
                            }

                            case c_oAscAlignH.Right:
                            {
                                this.CalcX = _X - this.W;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcX = _X + Value;

                    break;
                }

                case c_oAscRelativeFromH.Column:
                {
                    if ( true === bAlign )
                    {
                        switch ( Value )
                        {
                            case c_oAscAlignH.Center:
                            {
                                this.CalcX = (this.ColumnEndX + this.ColumnStartX - this.W) / 2;
                                break;
                            }

                            case c_oAscAlignH.Inside:
                            case c_oAscAlignH.Outside:
                            case c_oAscAlignH.Left:
                            {
                                this.CalcX = this.ColumnStartX;
                                break;
                            }

                            case c_oAscAlignH.Right:
                            {
                                this.CalcX = this.ColumnEndX - this.W;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcX = this.ColumnStartX + Value;

                    break;
                }

                case c_oAscRelativeFromH.InsideMargin:
                case c_oAscRelativeFromH.LeftMargin:
                case c_oAscRelativeFromH.OutsideMargin:
                {
                    if ( true === bAlign )
                    {
                        switch ( Value )
                        {
                            case c_oAscAlignH.Center:
                            {
                                this.CalcX = (this.Left_Margin - this.W) / 2;
                                break;
                            }

                            case c_oAscAlignH.Inside:
                            case c_oAscAlignH.Outside:
                            case c_oAscAlignH.Left:
                            {
                                this.CalcX = 0;
                                break;
                            }

                            case c_oAscAlignH.Right:
                            {
                                this.CalcX = this.Left_Margin - this.W;
                                break;
                            }
                        }
                    }
                    else if (true === bPercent)
                    {
                        this.CalcX = this.Page_X + this.Left_Margin * Value / 100;
                    }
                    else
                    {
                        this.CalcX = Value;
                    }

                    break;
                }

                case c_oAscRelativeFromH.Margin:
                {
                    var X_s = this.Page_X + this.Left_Margin;
                    var X_e = this.Page_X + this.Page_W - this.Right_Margin;

                    if ( true === bAlign )
                    {
                        switch ( Value )
                        {
                            case c_oAscAlignH.Center:
                            {
                                this.CalcX = (X_e + X_s - this.W) / 2;
                                break;
                            }

                            case c_oAscAlignH.Inside:
                            case c_oAscAlignH.Outside:
                            case c_oAscAlignH.Left:
                            {
                                this.CalcX = X_s;
                                break;
                            }

                            case c_oAscAlignH.Right:
                            {
                                this.CalcX = X_e - this.W;
                                break;
                            }
                        }
                    }
                    else if (true === bPercent)
                    {
                        this.CalcX = X_s + (X_e - X_s) * Value / 100;
                    }
                    else
                    {
                        this.CalcX = this.Margin_H + Value;
                    }

                    break;
                }

                case c_oAscRelativeFromH.Page:
                {
                    if ( true === bAlign )
                    {
                        switch ( Value )
                        {
                            case c_oAscAlignH.Center:
                            {
                                this.CalcX = (this.Page_W - this.W) / 2;
                                break;
                            }

                            case c_oAscAlignH.Inside:
                            case c_oAscAlignH.Outside:
                            case c_oAscAlignH.Left:
                            {
                                this.CalcX = 0;
                                break;
                            }

                            case c_oAscAlignH.Right:
                            {
                                this.CalcX = this.Page_W - this.W;
                                break;
                            }
                        }
                    }
                    else if (true === bPercent)
                    {
                        this.CalcX = this.Page_X + this.Page_W * Value / 100;
                    }
                    else
                    {
                        this.CalcX = Value + this.Page_X;
                    }

                    break;
                }

                case c_oAscRelativeFromH.RightMargin:
                {
                    var X_s = this.Page_X + this.Page_W - this.Right_Margin;
                    var X_e = this.Page_X + this.Page_W;

                    if ( true === bAlign )
                    {
                        switch ( Value )
                        {
                            case c_oAscAlignH.Center:
                            {
                                this.CalcX = (X_e + X_s - this.W) / 2;
                                break;
                            }

                            case c_oAscAlignH.Inside:
                            case c_oAscAlignH.Outside:
                            case c_oAscAlignH.Left:
                            {
                                this.CalcX = X_s;
                                break;
                            }

                            case c_oAscAlignH.Right:
                            {
                                this.CalcX = X_e - this.W;
                                break;
                            }
                        }
                    }
                    else if (true === bPercent)
                    {
                        this.CalcX = X_s + (X_e - X_s) * Value / 100;
                    }
                    else
                    {
                        this.CalcX = X_s + Value;
                    }

                    break;
                }
            }
        }

        return this.CalcX;
    },

    Calculate_Y : function(bInline, RelativeFrom, bAlign, Value, bPercent)
    {
        if ( true === bInline )
        {
            this.CalcY = this.Y - this.H - this.YOffset;
        }
        else
        {
            // Вычисляем координату по Y
            switch(RelativeFrom)
            {
                case c_oAscRelativeFromV.BottomMargin:
                case c_oAscRelativeFromV.InsideMargin:
                case c_oAscRelativeFromV.OutsideMargin:
                {
                    var _Y = this.Page_H - this.Bottom_Margin;

                    if ( true === bAlign )
                    {
                        switch(Value)
                        {
                            case c_oAscAlignV.Bottom:
                            case c_oAscAlignV.Outside:
                            {
                                this.CalcY = this.Page_H - this.H;
                                break;
                            }
                            case c_oAscAlignV.Center:
                            {
                                this.CalcY = (_Y + this.Page_H - this.H) / 2;
                                break;
                            }

                            case c_oAscAlignV.Inside:
                            case c_oAscAlignV.Top:
                            {
                                this.CalcY = _Y;
                                break;
                            }
                        }
                    }
                    else if (true === bPercent)
                    {
                        if (Math.abs(this.Page_Y) > 0.001)
                            this.CalcY = this.Margin_V;
                        else
                            this.CalcY = _Y + this.Bottom_Margin * Value / 100;
                    }
                    else
                    {
                        this.CalcY = _Y + Value;
                    }

                    break;
                }

                case c_oAscRelativeFromV.Line:
                {
                    var _Y = this.LineTop;

                    if ( true === bAlign )
                    {
                        switch(Value)
                        {
                            case c_oAscAlignV.Bottom:
                            case c_oAscAlignV.Outside:
                            {
                                this.CalcY = _Y - this.H;
                                break;
                            }
                            case c_oAscAlignV.Center:
                            {
                                this.CalcY = _Y - this.H / 2;
                                break;
                            }

                            case c_oAscAlignV.Inside:
                            case c_oAscAlignV.Top:
                            {
                                this.CalcY = _Y;
                                break;
                            }
                        }
                    }
                    else
                        this.CalcY = _Y + Value;

                    break;
                }

                case c_oAscRelativeFromV.Margin:
                {
                    var Y_s = this.Top_Margin;
                    var Y_e = this.Page_H - this.Bottom_Margin;

                    if ( true === bAlign )
                    {
                        switch(Value)
                        {
                            case c_oAscAlignV.Bottom:
                            case c_oAscAlignV.Outside:
                            {
                                this.CalcY = Y_e - this.H;
                                break;
                            }
                            case c_oAscAlignV.Center:
                            {
                                this.CalcY = (Y_s + Y_e - this.H) / 2;
                                break;
                            }

                            case c_oAscAlignV.Inside:
                            case c_oAscAlignV.Top:
                            {
                                this.CalcY = Y_s;
                                break;
                            }
                        }
                    }
                    else if (true === bPercent)
                    {
                        if (Math.abs(this.Page_Y) > 0.001)
                            this.CalcY = this.Margin_V;
                        else
                            this.CalcY = Y_s + (Y_e - Y_s) * Value / 100;
                    }
                    else
                    {
                        this.CalcY = this.Margin_V + Value;
                    }

                    break;
                }

                case c_oAscRelativeFromV.Page:
                {
                    if ( true === bAlign )
                    {
                        switch(Value)
                        {
                            case c_oAscAlignV.Bottom:
                            case c_oAscAlignV.Outside:
                            {
                                this.CalcY = this.Page_H - this.H;
                                break;
                            }
                            case c_oAscAlignV.Center:
                            {
                                this.CalcY = (this.Page_H - this.H) / 2;
                                break;
                            }

                            case c_oAscAlignV.Inside:
                            case c_oAscAlignV.Top:
                            {
                                this.CalcY = 0;
                                break;
                            }
                        }
                    }
                    else if (true === bPercent)
                    {
                        if (Math.abs(this.Page_Y) > 0.001)
                            this.CalcY = this.Margin_V;
                        else
                            this.CalcY = this.Page_H * Value / 100;
                    }
                    else
                    {
                        this.CalcY = Value + this.Page_Y;
                    }

                    break;
                }

                case c_oAscRelativeFromV.Paragraph:
                {
                    // Почему то Word не дает возможности использовать прилегание
                    // относительно абзаца, только абсолютные позиции
                    var _Y = this.ParagraphTop;

                    if ( true === bAlign )
                        this.CalcY = _Y;
                    else
                        this.CalcY = _Y + Value;

                    break;
                }

                case c_oAscRelativeFromV.TopMargin:
                {
                    var Y_s = 0;
                    var Y_e = this.Top_Margin;

                    if ( true === bAlign )
                    {
                        switch(Value)
                        {
                            case c_oAscAlignV.Bottom:
                            case c_oAscAlignV.Outside:
                            {
                                this.CalcY = Y_e - this.H;
                                break;
                            }
                            case c_oAscAlignV.Center:
                            {
                                this.CalcY = (Y_s + Y_e - this.H) / 2;
                                break;
                            }

                            case c_oAscAlignV.Inside:
                            case c_oAscAlignV.Top:
                            {
                                this.CalcY = Y_s;
                                break;
                            }
                        }
                    }
                    else if (true === bPercent)
                    {
                        if (Math.abs(this.Page_Y) > 0.001)
                            this.CalcY = this.Margin_V;
                        else
                            this.CalcY = this.Top_Margin * Value / 100;
                    }
                    else
                        this.CalcY = Y_s + Value;

                    break;
                }
            }
        }

        return this.CalcY;
    },

    Update_PositionYHeaderFooter : function(TopMarginY, BottomMarginY)
    {
        var TopY    = Math.max(this.Page_Y, Math.min(TopMarginY, this.Page_H));
        var BottomY = Math.max(this.Page_Y, Math.min(BottomMarginY, this.Page_H));

        this.Top_Margin    = TopY;
        this.Bottom_Margin = this.Page_H - BottomY;
    },

    Correct_Values : function(bInline, PageLimits, AllowOverlap, UseTextWrap, OtherFlowObjects)
    {
        if ( true != bInline )
        {
            var X_min = PageLimits.X;
            var Y_min = PageLimits.Y;
            var X_max = PageLimits.XLimit;
            var Y_max = PageLimits.YLimit;

            var W = this.W;
            var H = this.H;

            var CurX = this.CalcX;
            var CurY = this.CalcY;

            var bBreak = false;
            while ( true != bBreak )
            {
                bBreak = true;
                for ( var Index = 0; Index < OtherFlowObjects.length; Index++ )
                {
                    var Drawing = OtherFlowObjects[Index];
                    if ( ( false === AllowOverlap || false === Drawing.AllowOverlap ) && true === Drawing.Use_TextWrap() && true === UseTextWrap && ( CurX <= Drawing.X + Drawing.W && CurX + W >= Drawing.X && CurY <= Drawing.Y + Drawing.H && CurY + H >= Drawing.Y ) )
                    {
                        // Если убирается справа, размещаем справа от картинки
                        if ( Drawing.X + Drawing.W < X_max - W - 0.001 )
                            CurX = Drawing.X + Drawing.W + 0.001;
                        else
                        {
                            CurX = this.CalcX;
                            CurY = Drawing.Y + Drawing.H + 0.001;
                        }

                        bBreak = false;
                    }
                }
            }

            // Автофигуры с обтеканием за/перед текстом могут лежать где угодно
            if ( true === UseTextWrap )
            {
                // Скорректируем рассчитанную позицию, так чтобы объект не выходил за заданные пределы
                if ( CurX + W > X_max )
                    CurX = X_max - W;

                if ( CurX < X_min )
                    CurX = X_min;

                // Скорректируем рассчитанную позицию, так чтобы объект не выходил за заданные пределы
                if ( CurY + H > Y_max )
                    CurY = Y_max - H;

                if ( CurY < Y_min )
                    CurY = Y_min;
            }

            this.CalcX = CurX;
            this.CalcY = CurY;
        }
    },

    // По значению CalcX получем Value
    Calculate_X_Value : function(RelativeFrom)
    {
        var Value = 0;
        switch(RelativeFrom)
        {
            case c_oAscRelativeFromH.Character:
            {
                // Почему то Word при позиционировании относительно символа использует не
                // текущуюю позицию, а позицию предыдущего элемента (именно для этого мы
                // храним параметр LastItemW).

                Value = this.CalcX - this.X + this.LastItemW;

                break;
            }

            case c_oAscRelativeFromH.Column:
            {
                Value = this.CalcX - this.ColumnStartX;

                break;
            }

            case c_oAscRelativeFromH.InsideMargin:
            case c_oAscRelativeFromH.LeftMargin:
            case c_oAscRelativeFromH.OutsideMargin:
            {
                Value = this.CalcX;

                break;
            }

            case c_oAscRelativeFromH.Margin:
            {
                Value = this.CalcX - this.Margin_H;

                break;
            }

            case c_oAscRelativeFromH.Page:
            {
                Value = this.CalcX - this.Page_X;

                break;
            }

            case c_oAscRelativeFromH.RightMargin:
            {
                Value = this.CalcX - this.Page_W + this.Right_Margin;

                break;
            }
        }

        return Value;
    },

    // По значению CalcY и заданному RelativeFrom получем Value
    Calculate_Y_Value : function(RelativeFrom)
    {
        var Value = 0;

        switch(RelativeFrom)
        {
            case c_oAscRelativeFromV.BottomMargin:
            case c_oAscRelativeFromV.InsideMargin:
            case c_oAscRelativeFromV.OutsideMargin:
            {
                Value = this.CalcY - this.Page_H + this.Bottom_Margin;

                break;
            }

            case c_oAscRelativeFromV.Line:
            {
                Value = this.CalcY - this.LineTop;

                break;
            }

            case c_oAscRelativeFromV.Margin:
            {
                Value = this.CalcY - this.Margin_V;

                break;
            }

            case c_oAscRelativeFromV.Page:
            {
                Value = this.CalcY - this.Page_Y;

                break;
            }

            case c_oAscRelativeFromV.Paragraph:
            {
                Value = this.CalcY - this.ParagraphTop;

                break;
            }

            case c_oAscRelativeFromV.TopMargin:
            {
                Value = this.CalcY;

                break;
            }
        }

        return Value;
    }
};

var WRAPPING_TYPE_NONE = 0x00;
var WRAPPING_TYPE_SQUARE = 0x01;
var WRAPPING_TYPE_THROUGH = 0x02;
var WRAPPING_TYPE_TIGHT = 0x03;
var WRAPPING_TYPE_TOP_AND_BOTTOM = 0x04;

//Horizontal Relative Positioning Types
var HOR_REL_POS_TYPE_CHAR = 0x00;
var HOR_REL_POS_TYPE_COLUMN = 0x01;
var HOR_REL_POS_TYPE_INSIDE_MARGIN = 0x02;
var HOR_REL_POS_TYPE_LEFT_MARGIN = 0x03;
var HOR_REL_POS_TYPE_MARGIN = 0x04;
var HOR_REL_POS_TYPE_OUTSIDE_MARGIN = 0x05;
var HOR_REL_POS_TYPE_PAGE = 0x06;
var HOR_REL_POS_TYPE_RIGHT_MARGIN = 0x07;

//Verical Relative Positioning Types
var VER_REL_POS_TYPE_BOTTOM_MARGIN = 0x00;
var VER_REL_POS_TYPE_INSIDE_MARGIN = 0x01;
var VER_REL_POS_TYPE_LINE = 0x02;
var VER_REL_POS_TYPE_MARGIN = 0x03;
var VER_REL_POS_TYPE_OUTSIDE_MARGIN = 0x04;
var VER_REL_POS_TYPE_PAGE = 0x05;
var VER_REL_POS_TYPE_PARAGRAPH = 0x06;
var VER_REL_POS_TYPE_TOP_MARGIN = 0x07;

//POSITIONING TYPES
var POSITIONING_TYPE_ALIGN = 0x00;
var POSITIONING_TYPE_OFF = 0x01;

var WRAP_HIT_TYPE_POINT = 0x00;
var WRAP_HIT_TYPE_SECTION = 0x01;

// Класс ParaDrawing
function ParaDrawing(W, H, GraphicObj, DrawingDocument, DocumentContent, Parent)
{
    this.Id = AscCommon.g_oIdCounter.Get_NewId();
    this.DrawingType = drawing_Inline;
    this.GraphicObj  = GraphicObj;

    this.X = 0;
    this.Y = 0;
    this.Width = 0;
    this.Height = 0;

    this.PageNum = 0;
    this.LineNum = 0;
    this.YOffset = 0;

    this.DocumentContent = DocumentContent;
    this.DrawingDocument = DrawingDocument;
    this.Parent          = Parent;

    this.LogicDocument   = DrawingDocument ? DrawingDocument.m_oLogicDocument : null;

    // Расстояние до окружающего текста
    this.Distance =
    {
        T : 0,
        B : 0,
        L : 0,
        R : 0
    };

    // Расположение в таблице
    this.LayoutInCell = true;

    // Z-order
    this.RelativeHeight = undefined;

    //
    this.SimplePos =
    {
        Use : false,
        X   : 0,
        Y   : 0
    };

    // Ширина и высота
    this.Extent =
    {
        W : W,
        H : H
    };

    this.EffectExtent =
    {
        L: 0,
        T: 0,
        R: 0,
        B: 0
    };

    this.SizeRelH = undefined;
    this.SizeRelV = undefined;
    //{RelativeFrom      : c_oAscRelativeFromH.Column, Percent: ST_PositivePercentage}

    this.AllowOverlap = true;

    //привязка к параграфу
    this.Locked = null;

    //скрытые drawing'и
    this.Hidden = null;

    // Позиция по горизонтали
    this.PositionH =
    {
        RelativeFrom      : c_oAscRelativeFromH.Column, // Относительно чего вычисляем координаты
        Align             : false,                      // true : В поле Value лежит тип прилегания, false - в поле Value лежит точное значени
        Value             : 0,                          //
        Percent           : false                       // Значение Valuе задано в процентах
    };

    // Позиция по горизонтали
    this.PositionV =
    {
        RelativeFrom      : c_oAscRelativeFromV.Paragraph, // Относительно чего вычисляем координаты
        Align             : false,                         // true : В поле Value лежит тип прилегания, false - в поле Value лежит точное значени
        Value             : 0,                             //
        Percent           : false                          // Значение Valuе задано в процентах
    };

    // Данный поля используются для перемещения Flow-объекта
    this.PositionH_Old = undefined;
    this.PositionV_Old = undefined;

    this.Internal_Position = new CAnchorPosition();

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    //--------------------------------------------------------
    this.selectX = 0;
    this.selectY = 0;
    this.wrappingType = WRAPPING_TYPE_THROUGH;
    this.useWrap      = true;
	
	if(typeof CWrapPolygon !== "undefined")
		this.wrappingPolygon = new CWrapPolygon(this);

    this.document = editor.WordControl.m_oLogicDocument;
    this.drawingDocument = DrawingDocument;
    this.graphicObjects = editor.WordControl.m_oLogicDocument.DrawingObjects;
    this.selected = false;

    this.behindDoc = false;
    this.bNoNeedToAdd = false;

    this.pageIndex = -1;
    this.Lock = new AscCommon.CLock();
//------------------------------------------------------------
    g_oTableId.Add( this, this.Id );

	if(this.graphicObjects)
    {
        this.Set_RelativeHeight(this.graphicObjects.getZIndex());
        if(History.Is_On() && !g_oTableId.m_bTurnOff)
        {
            this.graphicObjects.addGraphicObject(this);
        }
    }
}


ParaDrawing.prototype =
{
    Type : para_Drawing,

    Get_Type : function()
    {
        return para_Drawing;
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

    Get_SelectedContent: function(SelectedContent)
    {
        if(this.GraphicObj && this.GraphicObj.Get_SelectedContent)
        {
            this.GraphicObj.Get_SelectedContent(SelectedContent);
        }
    },
    Search_GetId : function(bNext, bCurrent)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.Search_GetId === "function")
            return this.GraphicObj.Search_GetId(bNext, bCurrent);
        return null;
    },

    Get_AllDrawingObjects: function(DrawingObjects)
    {
        if(null == DrawingObjects)
        {
            DrawingObjects = [];
        }
        if(this.GraphicObj.Get_AllDrawingObjects)
        {
            this.GraphicObj.Get_AllDrawingObjects(DrawingObjects);
        }
    },

    canRotate: function()
    {
        return isRealObject(this.GraphicObj) && typeof this.GraphicObj.canRotate == "function" && this.GraphicObj.canRotate();
    },

    Get_Paragraph : function()
    {
        return this.Parent;
    },

    Get_Run : function()
    {
        if (this.Parent)
            return this.Parent.Get_DrawingObjectRun(this.Id);

        return null;
    },

    Get_Props : function(OtherProps)
    {
        // Сначала заполняем свойства

        var Props = {};
        Props.Width  = this.GraphicObj.extX;
        Props.Height = this.GraphicObj.extY;
        if ( drawing_Inline === this.DrawingType )
            Props.WrappingStyle = c_oAscWrapStyle2.Inline;
        else if ( WRAPPING_TYPE_NONE === this.wrappingType )
            Props.WrappingStyle = ( this.behindDoc === true ? c_oAscWrapStyle2.Behind : c_oAscWrapStyle2.InFront );
        else
        {
            switch ( this.wrappingType )
            {
                case WRAPPING_TYPE_SQUARE         : Props.WrappingStyle = c_oAscWrapStyle2.Square; break;
                case WRAPPING_TYPE_TIGHT          : Props.WrappingStyle = c_oAscWrapStyle2.Tight; break;
                case WRAPPING_TYPE_THROUGH        : Props.WrappingStyle = c_oAscWrapStyle2.Through; break;
                case WRAPPING_TYPE_TOP_AND_BOTTOM : Props.WrappingStyle = c_oAscWrapStyle2.TopAndBottom; break;
                default                           : Props.WrappingStyle = c_oAscWrapStyle2.Inline; break;
            }
        }

        if ( drawing_Inline === this.DrawingType )
        {
            Props.Paddings =
            {
                Left   : AscFormat.DISTANCE_TO_TEXT_LEFTRIGHT,
                Right  : AscFormat.DISTANCE_TO_TEXT_LEFTRIGHT,
                Top    : 0,
                Bottom : 0
            };
        }
        else
        {
            var oDistance = this.Get_Distance();
            Props.Paddings =
            {
                Left   : oDistance.L,
                Right  : oDistance.R,
                Top    : oDistance.T,
                Bottom : oDistance.B
            };
        }

        Props.AllowOverlap = this.AllowOverlap;

        Props.Position =
        {
            X : this.X,
            Y : this.Y
        };

        Props.PositionH =
        {
            RelativeFrom : this.PositionH.RelativeFrom,
            UseAlign     : this.PositionH.Align,
            Align        : ( true === this.PositionH.Align ? this.PositionH.Value : undefined ),
            Value        : ( true === this.PositionH.Align ? 0 : this.PositionH.Value ),
            Percent      : this.PositionH.Percent
        };

        Props.PositionV =
        {
            RelativeFrom : this.PositionV.RelativeFrom,
            UseAlign     : this.PositionV.Align,
            Align        : ( true === this.PositionV.Align ? this.PositionV.Value : undefined ),
            Value        : ( true === this.PositionV.Align ? 0 : this.PositionV.Value ),
            Percent      : this.PositionV.Percent
        };



        if(this.SizeRelH && this.SizeRelH.Percent > 0)
        {
            Props.SizeRelH =
            {
                RelativeFrom: AscFormat.ConvertRelSizeHToRelPosition(this.SizeRelH.RelativeFrom),
                Value: (this.SizeRelH.Percent*100) >> 0
            };
        }

        if(this.SizeRelV && this.SizeRelV.Percent > 0)
        {
            Props.SizeRelV =
            {
                RelativeFrom: AscFormat.ConvertRelSizeVToRelPosition(this.SizeRelV.RelativeFrom),
                Value: (this.SizeRelV.Percent*100) >> 0
            };
        }

        Props.Internal_Position = this.Internal_Position;

        Props.Locked = this.Lock.Is_Locked();
        var ParentParagraph = this.Get_ParentParagraph();
        if(ParentParagraph)
        {
            if(ParentParagraph)
            {
                if (undefined != ParentParagraph.Parent && true === ParentParagraph.Parent.Is_DrawingShape() )
                    Props.CanBeFlow = false;
            }
        }

        if ( null != OtherProps && undefined != OtherProps )
        {
            // Соединяем
            if ( undefined === OtherProps.Width || 0.001 > Math.abs( Props.Width - OtherProps.Width ) )
                Props.Width = undefined;

            if ( undefined === OtherProps.Height || 0.001 > Math.abs( Props.Height - OtherProps.Height ) )
                Props.Height = undefined;

            if ( undefined === OtherProps.WrappingStyle || Props.WrappingStyle != OtherProps.WrappingStyle )
                Props.WrappingStyle = undefined;

            if ( undefined === OtherProps.ImageUrl || Props.ImageUrl != OtherProps.ImageUrl )
                Props.ImageUrl = undefined;

            if ( undefined === OtherProps.Paddings.Left || 0.001 > Math.abs( Props.Paddings.Left - OtherProps.Paddings.Left ) )
                Props.Paddings.Left = undefined;

            if ( undefined === OtherProps.Paddings.Right || 0.001 > Math.abs( Props.Paddings.Right - OtherProps.Paddings.Right ) )
                Props.Paddings.Right = undefined;

            if ( undefined === OtherProps.Paddings.Top || 0.001 > Math.abs( Props.Paddings.Top - OtherProps.Paddings.Top ) )
                Props.Paddings.Top = undefined;

            if ( undefined === OtherProps.Paddings.Bottom || 0.001 > Math.abs( Props.Paddings.Bottom - OtherProps.Paddings.Bottom ) )
                Props.Paddings.Bottom = undefined;

            if ( undefined === OtherProps.AllowOverlap || Props.AllowOverlap != OtherProps.AllowOverlap )
                Props.AllowOverlap = undefined;

            if ( undefined === OtherProps.Position.X || 0.001 > Math.abs( Props.Position.X - OtherProps.Position.X ) )
                Props.Position.X = undefined;

            if ( undefined === OtherProps.Position.Y || 0.001 > Math.abs( Props.Position.Y - OtherProps.Position.Y ) )
                Props.Position.Y = undefined;

            if ( undefined === OtherProps.PositionH.RelativeFrom || Props.PositionH.RelativeFrom != OtherProps.PositionH.RelativeFrom )
                Props.PositionH.RelativeFrom = undefined;

            if ( undefined === OtherProps.PositionH.UseAlign || Props.PositionH.UseAlign != OtherProps.PositionH.UseAlign )
                Props.PositionH.UseAlign = undefined;

            if ( Props.PositionH.RelativeFrom === OtherProps.PositionH.RelativeFrom && Props.PositionH.UseAlign === OtherProps.PositionH.UseAlign )
            {
                if ( true != Props.PositionH.UseAlign && 0.001 > Math.abs(Props.PositionH.Value - OtherProps.PositionH.Value) )
                    Props.PositionH.Value = undefined;

                if ( true === Props.PositionH.UseAlign && Props.PositionH.Align != OtherProps.PositionH.Align )
                    Props.PositionH.Align = undefined;
            }

            if ( undefined === OtherProps.PositionV.RelativeFrom || Props.PositionV.RelativeFrom != OtherProps.PositionV.RelativeFrom )
                Props.PositionV.RelativeFrom = undefined;

            if ( undefined === OtherProps.PositionV.UseAlign || Props.PositionV.UseAlign != OtherProps.PositionV.UseAlign )
                Props.PositionV.UseAlign = undefined;

            if ( Props.PositionV.RelativeFrom === OtherProps.PositionV.RelativeFrom && Props.PositionV.UseAlign === OtherProps.PositionV.UseAlign )
            {
                if ( true != Props.PositionV.UseAlign && 0.001 > Math.abs(Props.PositionV.Value - OtherProps.PositionV.Value) )
                    Props.PositionV.Value = undefined;

                if ( true === Props.PositionV.UseAlign && Props.PositionV.Align != OtherProps.PositionV.Align )
                    Props.PositionV.Align = undefined;
            }


            if ( false === OtherProps.Locked )
                Props.Locked = false;

            if ( false === OtherProps.CanBeFlow || false === Props.CanBeFlow )
                Props.CanBeFlow = false;
            else
                Props.CanBeFlow = true;
        }

        return Props;
    },

    Is_UseInDocument : function()
    {
        if(this.Parent)
        {
            var Run = this.Parent.Get_DrawingObjectRun( this.Id );
            if(Run)
            {
                return Run.Is_UseInDocument(this.Get_Id());
            }
        }
        return false;
    },


    CheckGroupSizes : function()
    {
        if(this.GraphicObj && this.GraphicObj.CheckGroupSizes)
        {
            this.GraphicObj.CheckGroupSizes();
        }
    },

    SetSizeRelH : function(oSize)
    {
        History.Add(this, {Type: AscDFH.historyitem_Drawing_SetSizeRelH, Old: this.SizeRelH, New: oSize});
        this.SizeRelH = oSize;
    },


    SetSizeRelV : function(oSize)
    {
        History.Add(this, {Type: AscDFH.historyitem_Drawing_SetSizeRelV, Old: this.SizeRelV, New: oSize});
        this.SizeRelV = oSize;
    },

    getXfrmExtX: function()
    {
        if(isRealObject(this.GraphicObj) && isRealObject(this.GraphicObj.spPr) && isRealObject(this.GraphicObj.spPr.xfrm))
            return this.GraphicObj.spPr.xfrm.extX;
        if(AscFormat.isRealNumber(this.Extent.W))
            return this.Extent.W;
        return 0;
    },

    getXfrmExtY: function()
    {
        if(isRealObject(this.GraphicObj) && isRealObject(this.GraphicObj.spPr) && isRealObject(this.GraphicObj.spPr.xfrm))
            return this.GraphicObj.spPr.xfrm.extY;
        if(AscFormat.isRealNumber(this.Extent.H))
            return this.Extent.H;
        return 0;
    },

    Get_Bounds : function()
    {
        return {Left : this.X, Top : this.Y, Bottom : this.Y + this.getXfrmExtY(), Right : this.X + this.getXfrmExtX()};
    },

    Search : function(Str, Props, SearchEngine, Type)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.Search === "function")
        {
            this.GraphicObj.Search(Str, Props, SearchEngine, Type)
        }
    },

    Set_Props : function(Props) {
        var bCheckWrapPolygon = false;
        if (undefined != Props.WrappingStyle) {
            if (drawing_Inline === this.DrawingType && c_oAscWrapStyle2.Inline != Props.WrappingStyle && undefined === Props.Paddings) {
                this.Set_Distance(3.2, 0, 3.2, 0);
            }

            this.Set_DrawingType(c_oAscWrapStyle2.Inline === Props.WrappingStyle ? drawing_Inline : drawing_Anchor);
            if (c_oAscWrapStyle2.Inline === Props.WrappingStyle) {
                if (isRealObject(this.GraphicObj.bounds) && AscFormat.isRealNumber(this.GraphicObj.bounds.w) && AscFormat.isRealNumber(this.GraphicObj.bounds.h)) {
                    this.setExtent(this.GraphicObj.bounds.w, this.GraphicObj.bounds.h);
                }
            }
            if (c_oAscWrapStyle2.Behind === Props.WrappingStyle || c_oAscWrapStyle2.InFront === Props.WrappingStyle) {
                this.Set_WrappingType(WRAPPING_TYPE_NONE);
                this.Set_BehindDoc(c_oAscWrapStyle2.Behind === Props.WrappingStyle ? true : false);
            }
            else {
                switch (Props.WrappingStyle) {
                    case c_oAscWrapStyle2.Square      :
                        this.Set_WrappingType(WRAPPING_TYPE_SQUARE);
                        break;
                    case c_oAscWrapStyle2.Tight       :
                    {
                        bCheckWrapPolygon = true;
                        this.Set_WrappingType(WRAPPING_TYPE_TIGHT);
                        break;
                    }
                    case c_oAscWrapStyle2.Through     :
                    {
                        this.Set_WrappingType(WRAPPING_TYPE_THROUGH);
                        bCheckWrapPolygon = true;
                        break;
                    }
                    case c_oAscWrapStyle2.TopAndBottom:
                        this.Set_WrappingType(WRAPPING_TYPE_TOP_AND_BOTTOM);
                        break;
                    default                           :
                        this.Set_WrappingType(WRAPPING_TYPE_SQUARE);
                        break;
                }

                this.Set_BehindDoc(false);
            }
        }

        if (undefined != Props.Paddings)
            this.Set_Distance(Props.Paddings.Left, Props.Paddings.Top, Props.Paddings.Right, Props.Paddings.Bottom);

        if (undefined != Props.AllowOverlap)
            this.Set_AllowOverlap(Props.AllowOverlap);

        if (undefined != Props.PositionH) {
            this.Set_PositionH(Props.PositionH.RelativeFrom, Props.PositionH.UseAlign, ( true === Props.PositionH.UseAlign ? Props.PositionH.Align : Props.PositionH.Value ), Props.PositionH.Percent);
        }
        if (undefined != Props.PositionV) {
            this.Set_PositionV(Props.PositionV.RelativeFrom, Props.PositionV.UseAlign, ( true === Props.PositionV.UseAlign ? Props.PositionV.Align : Props.PositionV.Value ), Props.PositionV.Percent);
        }
        if (undefined != Props.SizeRelH) {
            this.SetSizeRelH({
                RelativeFrom: AscFormat.ConvertRelPositionHToRelSize(Props.SizeRelH.RelativeFrom),
                Percent: Props.SizeRelH.Value / 100.0
            });
        }

        if (undefined != Props.SizeRelV) {
            this.SetSizeRelV({
                RelativeFrom: AscFormat.ConvertRelPositionVToRelSize(Props.SizeRelV.RelativeFrom),
                Percent: Props.SizeRelV.Value / 100.0
            });
        }

        if (this.SizeRelH && !this.SizeRelV)
        {
            this.SetSizeRelV({RelativeFrom: AscCommon.c_oAscSizeRelFromV.sizerelfromvPage, Percent: 0});
        }

        if (this.SizeRelV && !this.SizeRelH)
        {
            this.SetSizeRelH({RelativeFrom: AscCommon.c_oAscSizeRelFromH.sizerelfromhPage, Percent: 0})
        }

        if(bCheckWrapPolygon)
        {
            this.Check_WrapPolygon();
        }
    },

    CheckWH: function()
    {
        if(!this.GraphicObj)
            return;
        var dW, dH, bInline = this.Is_Inline();
        this.GraphicObj.recalculate();
        var extX, extY;
        if(this.GraphicObj.spPr.xfrm && AscFormat.isRealNumber(this.GraphicObj.spPr.xfrm.extX) && AscFormat.isRealNumber(this.GraphicObj.spPr.xfrm.extY))
        {
            extX = this.GraphicObj.spPr.xfrm.extX;
            extY = this.GraphicObj.spPr.xfrm.extY;
        }
        else
        {
            extX = 5;
            extY = 5;
        }
        if(AscFormat.checkNormalRotate(AscFormat.isRealNumber(this.GraphicObj.rot) ? this.GraphicObj.rot : 0))
        {
            dW = extX;
            dH = extY;
        }
        else
        {
            dH = extX;
            dW = extY;
        }
        this.setExtent(extX, extY);
        var xc = this.GraphicObj.localTransform.TransformPointX(this.GraphicObj.extX/2, this.GraphicObj.extY/2);
        var yc = this.GraphicObj.localTransform.TransformPointY(this.GraphicObj.extX/2, this.GraphicObj.extY/2);
        var oBounds = this.GraphicObj.bounds;
        var LineCorrect = 0;
        if(this.GraphicObj.pen)
        {
            LineCorrect = (this.GraphicObj.pen.w == null) ? 12700 : parseInt(this.GraphicObj.pen.w);
            LineCorrect /= 72000.0;
        }
        var EEL = (xc - dW/2) - oBounds.l - LineCorrect;
        var EET = (yc - dH/2) - oBounds.t - LineCorrect;
        var EER = oBounds.r + LineCorrect - (xc + dW/2);
        var EEB = oBounds.b + LineCorrect - (yc + dH/2);
        this.setEffectExtent(EEL > 0 ? EEL : 0, EET > 0 ? EET : 0, EER > 0 ? EER : 0, EEB > 0 ? EEB : 0);
        this.Check_WrapPolygon();
    },

    Check_WrapPolygon: function()
    {
        if((this.wrappingType === WRAPPING_TYPE_TIGHT || this.wrappingType === WRAPPING_TYPE_THROUGH) && this.wrappingPolygon && !this.wrappingPolygon.edited)
        {
            this.GraphicObj.recalculate();
            this.wrappingPolygon.setArrRelPoints(this.wrappingPolygon.calculate(this.GraphicObj));
        }
    },

    Draw : function( X, Y, pGraphics, pageIndex, align)
    {
        if(pGraphics.Start_Command)
        {
            pGraphics.m_aDrawings.push(new AscFormat.ParaDrawingStruct(pageIndex, this));
            return;
        }
        if ( this.Is_Inline() )
        {
            pGraphics.shapePageIndex = pageIndex;
            this.draw(pGraphics, pageIndex);
            pGraphics.shapePageIndex = null;
        }
        if(pGraphics.End_Command)
        {
            pGraphics.End_Command();
        }
    },

    Measure : function()
    {
        if(!this.GraphicObj)
        {
            this.Width = 0;
            this.Height = 0;
            return;
        }
        if(AscFormat.isRealNumber(this.Extent.W) && AscFormat.isRealNumber(this.Extent.H) && (!this.GraphicObj.checkAutofit || !this.GraphicObj.checkAutofit()) && !this.SizeRelH && !this.SizeRelV)
        {
            var oEffectExtent = this.EffectExtent;
            var dW, dH;
            if(AscFormat.checkNormalRotate(AscFormat.isRealNumber(this.GraphicObj.rot) ? this.GraphicObj.rot : 0))
            {
                dW = this.Extent.W;
                dH = this.Extent.H;
            }
            else
            {
                dH = this.Extent.W;
                dW = this.Extent.H;
            }

            this.Width        = dW + AscFormat.getValOrDefault(oEffectExtent.L, 0) + AscFormat.getValOrDefault(oEffectExtent.R, 0);
            this.Height       = dH + AscFormat.getValOrDefault(oEffectExtent.T, 0) + AscFormat.getValOrDefault(oEffectExtent.B, 0);
            this.WidthVisible = this.Width;
        }
        else
        {
            this.GraphicObj.recalculate();
            if(this.GraphicObj.recalculateText)
            {
                this.GraphicObj.recalculateText();
            }
            if(this.PositionH.UseAlign || this.Is_Inline())
            {
                this.Width = this.GraphicObj.bounds.w;
            }
            else
            {
                this.Width = this.GraphicObj.extX;
            }
            this.WidthVisible = this.Width;
            if(this.PositionV.UseAlign || this.Is_Inline())
            {
                this.Height = this.GraphicObj.bounds.h;
            }
            else
            {
                this.Height = this.GraphicObj.extY;
            }
        }
    },

    Save_RecalculateObject : function(Copy)
    {
        var DrawingObj = {};

        DrawingObj.Type         = this.Type;
        DrawingObj.DrawingType  = this.DrawingType;
        DrawingObj.WrappingType = this.wrappingType;

        if ( drawing_Anchor === this.Get_DrawingType() && true === this.Use_TextWrap() )
        {
            var oDistance = this.Get_Distance();
            DrawingObj.FlowPos =
            {
                X : this.X - oDistance.L,
                Y : this.Y - oDistance.T,
                W : this.Width +  oDistance.R,
                H : this.Height + oDistance.B
            }
        }
        DrawingObj.PageNum = this.PageNum;
        DrawingObj.X = this.X;
        DrawingObj.Y = this.Y;
        DrawingObj.spRecaclcObject = this.GraphicObj.getRecalcObject();

        return DrawingObj;
    },

    Load_RecalculateObject : function(RecalcObj)
    {
        this.updatePosition3(RecalcObj.PageNum, RecalcObj.X, RecalcObj.Y);
        this.GraphicObj.setRecalcObject(RecalcObj.spRecaclcObject);
    },

    Reassign_ImageUrls : function(mapUrls){
        if(this.GraphicObj){
            this.GraphicObj.Reassign_ImageUrls(mapUrls);
        }  
    },

    Prepare_RecalculateObject : function()
    {
    },

    Is_RealContent : function()
    {
        return true;
    },

    Can_AddNumbering : function()
    {
        if ( drawing_Inline === this.DrawingType )
            return true;

        return false;
    },

    Copy : function()
    {
        var c = new ParaDrawing(this.Extent.W,  this.Extent.H, null, editor.WordControl.m_oLogicDocument.DrawingDocument, null, null);
        c.Set_DrawingType(this.DrawingType);
        if(isRealObject(this.GraphicObj))
        {
            c.Set_GraphicObject( this.GraphicObj.copy());
            c.GraphicObj.setParent(c);
        }

        var d = this.Distance;
        c.Set_PositionH(this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value, this.PositionH.Percent);
        c.Set_PositionV(this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value, this.PositionV.Percent);
        c.Set_Distance(d.L, d.T, d.R, d.B);
        c.Set_AllowOverlap(this.AllowOverlap);
        c.Set_WrappingType(this.wrappingType);
        if(this.wrappingPolygon)
        {
            c.wrappingPolygon.fromOther(this.wrappingPolygon);
        }
        c.Set_BehindDoc(this.behindDoc);
        c.Set_RelativeHeight(this.RelativeHeight);
        if(this.SizeRelH)
        {
            c.SetSizeRelH({RelativeFrom: this.SizeRelH.RelativeFrom, Percent: this.SizeRelH.Percent});
        }
        if(this.SizeRelV)
        {
            c.SetSizeRelV({RelativeFrom: this.SizeRelV.RelativeFrom, Percent: this.SizeRelV.Percent});
        }
        if(AscFormat.isRealNumber(this.Extent.W) && AscFormat.isRealNumber(this.Extent.H))
        {
            c.setExtent(this.Extent.W, this.Extent.H);
        }
        var EE = this.EffectExtent;
        if(EE.L > 0 || EE.T > 0 || EE.R > 0 || EE.B > 0)
        {
            c.setEffectExtent(EE.L, EE.T, EE.R, EE.B);
        }
        if (this.ParaMath)
            c.Set_ParaMath(this.ParaMath.Copy());
        return c;
    },

    //--------------------------------------------
    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Set_GraphicObject: function(graphicObject)
    {
        var data = {Type: AscDFH.historyitem_Drawing_SetGraphicObject};
        if(isRealObject(this.GraphicObj))
        {
            data.oldId = this.GraphicObj.Get_Id();
        }
        else
        {
            data.oldId = null;
        }
        if(isRealObject(graphicObject))
        {
            data.newId = graphicObject.Get_Id();
        }
        else
        {
            data.newId = null;
        }
        History.Add(this, data);
        if(graphicObject.handleUpdateExtents)
            graphicObject.handleUpdateExtents();
        this.GraphicObj = graphicObject;

    },

    Get_Id : function()
    {
        return this.Id;
    },

    setParagraphTabs: function(tabs)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphTabs === "function")
            this.GraphicObj.setParagraphTabs(tabs);
    },

    Selection_Is_TableBorderMove: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.Selection_Is_TableBorderMove === "function")
            return this.GraphicObj.Selection_Is_TableBorderMove();
        return false;
    },

    Set_Parent : function(oParent)
    {
        History.Add(this, {Type: AscDFH.historyitem_Drawing_SetParent, oldPr: this.Parent, newPr: oParent});
        this.Parent = oParent;
    },

    Update_Position : function(Paragraph, ParaLayout, PageLimits, PageLimitsOrigin, LineNum)
    {
        if ( undefined != this.PositionH_Old )
        {
            this.PositionH.RelativeFrom = this.PositionH_Old.RelativeFrom2;
            this.PositionH.Align        = this.PositionH_Old.Align2;
            this.PositionH.Value        = this.PositionH_Old.Value2;
            this.PositionH.Percent      = this.PositionH_Old.Percent2;
        }

        if ( undefined != this.PositionV_Old )
        {
            this.PositionV.RelativeFrom = this.PositionV_Old.RelativeFrom2;
            this.PositionV.Align        = this.PositionV_Old.Align2;
            this.PositionV.Value        = this.PositionV_Old.Value2;
            this.PositionV.Percent      = this.PositionV_Old.Percent2;
        }

        this.Parent          = Paragraph;
        this.DocumentContent = this.Parent.Parent;
        var PageNum = ParaLayout.PageNum;

        var OtherFlowObjects = editor.WordControl.m_oLogicDocument.DrawingObjects.getAllFloatObjectsOnPage( PageNum, this.Parent.Parent );
        var bInline = this.Is_Inline();
        var W, H;
        if(this.Is_Inline())
        {
            W = this.GraphicObj.bounds.w;
            H = this.GraphicObj.bounds.h;
        }
        else
        {
            if(this.PositionH.Align)
                W = this.GraphicObj.bounds.w;
            else
                W = this.getXfrmExtX();

            if(this.PositionV.Align)
                H = this.GraphicObj.bounds.h;
            else
                H = this.getXfrmExtY();
        }
        this.Internal_Position.Set( W, H, this.YOffset, ParaLayout, PageLimitsOrigin);
        this.Internal_Position.Calculate_X(bInline, this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value, this.PositionH.Percent);
        this.Internal_Position.Calculate_Y(bInline, this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value, this.PositionV.Percent);
        this.Internal_Position.Correct_Values(bInline, PageLimits, this.AllowOverlap, this.Use_TextWrap(), OtherFlowObjects);

        var OldPageNum = this.PageNum;
        this.PageNum = PageNum;
        this.LineNum = LineNum;
        this.X       = this.Internal_Position.CalcX;
        this.Y       = this.Internal_Position.CalcY;

        if ( undefined != this.PositionH_Old )
        {
            // Восстанови старые значения, чтобы в историю изменений все нормально записалось
            this.PositionH.RelativeFrom = this.PositionH_Old.RelativeFrom;
            this.PositionH.Align        = this.PositionH_Old.Align;
            this.PositionH.Value        = this.PositionH_Old.Value;
            this.PositionH.Percent      = this.PositionH_Old.Percent;

            // Рассчитаем сдвиг с учетом старой привязки
            var Value = this.Internal_Position.Calculate_X_Value(this.PositionH_Old.RelativeFrom);
            this.Set_PositionH(this.PositionH_Old.RelativeFrom, false, Value, false);
            // На всякий случай пересчитаем заново координату
            this.X = this.Internal_Position.Calculate_X(bInline, this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value, this.PositionH.Percent);
        }

        if ( undefined != this.PositionV_Old )
        {
            // Восстанови старые значения, чтобы в историю изменений все нормально записалось
            this.PositionV.RelativeFrom = this.PositionV_Old.RelativeFrom;
            this.PositionV.Align        = this.PositionV_Old.Align;
            this.PositionV.Value        = this.PositionV_Old.Value;
            this.PositionV.Percent      = this.PositionV_Old.Percent;

            // Рассчитаем сдвиг с учетом старой привязки
            var Value = this.Internal_Position.Calculate_Y_Value(this.PositionV_Old.RelativeFrom);
            this.Set_PositionV(this.PositionV_Old.RelativeFrom, false, Value, false);
            // На всякий случай пересчитаем заново координату
            this.Y = this.Internal_Position.Calculate_Y(bInline, this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value, this.PositionV.Percent);
        }

        this.updatePosition3( this.PageNum, this.X, this.Y, OldPageNum );
        this.useWrap = this.Use_TextWrap();
    },

    Update_PositionYHeaderFooter : function(TopMarginY, BottomMarginY)
    {
        this.Internal_Position.Update_PositionYHeaderFooter(TopMarginY, BottomMarginY);
        this.Internal_Position.Calculate_Y(this.Is_Inline(), this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value, this.PositionV.Percent);
        this.Y = this.Internal_Position.CalcY;
        this.updatePosition3(this.PageNum, this.X, this.Y, this.PageNum);
    },

    Reset_SavedPosition : function()
    {
        this.PositionV_Old = undefined;
        this.PositionH_Old = undefined;
    },

    setParagraphBorders: function(val)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphBorders === "function")
            this.GraphicObj.setParagraphBorders(val);
    },

    deselect: function()
    {
        this.selected = false;
        if(this.GraphicObj && this.GraphicObj.deselect)
            this.GraphicObj.deselect();
    },

    updatePosition3: function(pageIndex, x, y, oldPageNum)
    {
        this.graphicObjects.removeById(pageIndex, this.Get_Id());
        if(AscFormat.isRealNumber(oldPageNum))
        {
            this.graphicObjects.removeById(oldPageNum, this.Get_Id());
        }
        this.setPageIndex(pageIndex);
        if(typeof this.GraphicObj.setStartPage === "function")
        {
            var bIsHfdFtr = this.DocumentContent && this.DocumentContent.Is_HdrFtr();
            this.GraphicObj.setStartPage(pageIndex, bIsHfdFtr, bIsHfdFtr);
        }
        var bInline = this.Is_Inline();
        var _x = (this.PositionH.Align || bInline) ? x - this.GraphicObj.bounds.x : x;
        var _y = (this.PositionV.Align || bInline) ? y - this.GraphicObj.bounds.y : y;

        if(!(this.DocumentContent && this.DocumentContent.Is_HdrFtr() && this.DocumentContent.Get_StartPage_Absolute() !== pageIndex))
        {
            this.graphicObjects.addObjectOnPage(pageIndex, this.GraphicObj);
            this.bNoNeedToAdd = false;
        }
        else
        {
            this.bNoNeedToAdd = true;
        }

        this.selectX = x;
        this.selectY = y;


        if( this.GraphicObj.bNeedUpdatePosition || !(AscFormat.isRealNumber(this.GraphicObj.posX) && AscFormat.isRealNumber(this.GraphicObj.posY)) ||
            !(Math.abs(this.GraphicObj.posX-_x) < MOVE_DELTA && Math.abs(this.GraphicObj.posY-_y) < MOVE_DELTA))
            this.GraphicObj.updatePosition(_x, _y);
        if( this.GraphicObj.bNeedUpdatePosition || !(AscFormat.isRealNumber(this.wrappingPolygon.posX) && AscFormat.isRealNumber(this.wrappingPolygon.posY)) ||
            !(Math.abs(this.wrappingPolygon.posX -_x) < MOVE_DELTA && Math.abs(this.wrappingPolygon.posY-_y) < MOVE_DELTA))
            this.wrappingPolygon.updatePosition(_x, _y);
        this.calculateSnapArrays();
    },

    calculateAfterChangeTheme: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.calculateAfterChangeTheme === "function")
        {
            this.GraphicObj.calculateAfterChangeTheme();
        }
    },

    selectionIsEmpty: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionIsEmpty === "function")
            return this.GraphicObj.selectionIsEmpty();
        return false;
    },

    recalculateDocContent: function()
    {
        //if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.recalculateDocContent === "function")
        //    return this.GraphicObj.recalculateDocContent();
    },

    Shift : function(Dx, Dy)
    {
        this.X += Dx;
        this.Y += Dy;

        this.updatePosition3( this.PageNum, this.X, this.Y );
    },

    Set_DrawingType : function(DrawingType)
    {
        History.Add( this, { Type : AscDFH.historyitem_Drawing_DrawingType, New : DrawingType, Old : this.DrawingType } );
        this.DrawingType = DrawingType;
        /*if(typeof this.graphicObjects.curState.updateAnchorPos === "function")
         this.graphicObjects.curState.updateAnchorPos();      */
        //this.updateWidthHeight();
    },

    Set_WrappingType : function(WrapType)
    {
        History.Add( this, { Type : AscDFH.historyitem_Drawing_WrappingType, New : WrapType, Old : this.wrappingType } );
        this.wrappingType = WrapType;

    },

    Set_BehindDoc : function(BehindDoc)
    {
        History.Add( this, { Type : AscDFH.historyitem_Drawing_BehindDoc, New : BehindDoc, Old : this.behindDoc } );
        this.behindDoc = BehindDoc;
    },

    Set_Distance : function(L, T, R, B)
    {
        var oDistance = this.Get_Distance();
        if (!AscFormat.isRealNumber(L))
        {
            L = oDistance.L;
        }
        if (!AscFormat.isRealNumber(T))
        {
            T = oDistance.T;
        }
        if(!AscFormat.isRealNumber(R))
        {
            R = oDistance.R;
        }
        if (!AscFormat.isRealNumber(B))
        {
            B = oDistance.B;
        }

        History.Add( this, { Type : AscDFH.historyitem_Drawing_Distance, Old : { Left : this.Distance.L, Top : this.Distance.T, Right : this.Distance.R, Bottom : this.Distance.B }, New : { Left : L, Top : T, Right : R, Bottom : B } } );
        this.Distance.L = L;
        this.Distance.R = R;
        this.Distance.T = T;
        this.Distance.B = B;
    },

    Set_LayoutInCell : function(LayoutInCell)
    {
        if (this.LayoutInCell === LayoutInCell)
            return;

        History.Add(this, {Type : AscDFH.historyitem_Drawing_LayoutInCell, Old : this.LayoutInCell, New : LayoutInCell});
        this.LayoutInCell = LayoutInCell;
    },

    Is_LayoutInCell : function()
    {
        return this.LayoutInCell;
    },

    Get_Distance : function()
    {
        var oDist = this.Distance;
        return new AscFormat.CDistance(AscFormat.getValOrDefault(oDist.L, AscFormat.DISTANCE_TO_TEXT_LEFTRIGHT), AscFormat.getValOrDefault(oDist.T, 0), AscFormat.getValOrDefault(oDist.R, AscFormat.DISTANCE_TO_TEXT_LEFTRIGHT), AscFormat.getValOrDefault(oDist.B, 0));
    },

    Set_AllowOverlap : function(AllowOverlap)
    {
        History.Add( this, { Type : AscDFH.historyitem_Drawing_AllowOverlap, Old : this.AllowOverlap, New : AllowOverlap } );
        this.AllowOverlap = AllowOverlap;
    },

    Set_PositionH : function(RelativeFrom, Align, Value, Percent)
    {
        History.Add( this, { Type : AscDFH.historyitem_Drawing_PositionH, Old : { RelativeFrom : this.PositionH.RelativeFrom, Align : this.PositionH.Align, Value : this.PositionH.Value, Percent : this.PositionH.Percent }, New : { RelativeFrom : RelativeFrom, Align : Align, Value : Value, Percent : Percent }  } );
        this.PositionH.RelativeFrom = RelativeFrom;
        this.PositionH.Align        = Align;
        this.PositionH.Value        = Value;
        this.PositionH.Percent      = Percent;
    },

    Set_PositionV : function(RelativeFrom, Align, Value, Percent)
    {
        History.Add( this, { Type : AscDFH.historyitem_Drawing_PositionV, Old : { RelativeFrom : this.PositionV.RelativeFrom, Align : this.PositionV.Align, Value : this.PositionV.Value, Percent : this.PositionV.Percent }, New : { RelativeFrom : RelativeFrom, Align : Align, Value : Value, Percent : Percent }  } );
        this.PositionV.RelativeFrom = RelativeFrom;
        this.PositionV.Align        = Align;
        this.PositionV.Value        = Value;
        this.PositionV.Percent      = Percent;
    },

    Set_Locked : function(bLocked)
    {
        History.Add(this, {Type: AscDFH.historyitem_Drawing_SetLocked, OldPr: this.Locked, NewPr: bLocked });
        this.Locked = bLocked;
    },

    Set_RelativeHeight : function(nRelativeHeight)
    {
        History.Add(this, {Type: AscDFH.historyitem_Drawing_SetRelativeHeight, OldPr: this.RelativeHeight, NewPr: nRelativeHeight});
        this.Set_RelativeHeight2(nRelativeHeight);
    },

    Set_RelativeHeight2 : function(nRelativeHeight)
    {
        this.RelativeHeight = nRelativeHeight;
        if(this.graphicObjects && AscFormat.isRealNumber(nRelativeHeight) && nRelativeHeight > this.graphicObjects.maximalGraphicObjectZIndex)
        {
            this.graphicObjects.maximalGraphicObjectZIndex = nRelativeHeight;
        }
    },

    Set_XYForAdd : function(X, Y, NearPos, PageNum)
    {
        if ( null !== NearPos )
        {
            var Layout = NearPos.Paragraph.Get_Layout(NearPos.ContentPos, this);
            this.private_SetXYByLayout(X, Y, PageNum, Layout, true, true);
        }
    },

    Set_XY : function(X, Y, Paragraph, PageNum, bResetAlign)
    {
        if (Paragraph)
        {
            var ContentPos = Paragraph.Get_DrawingObjectContentPos(this.Get_Id());
            if (null === ContentPos)
                return;

            var Layout = Paragraph.Get_Layout(ContentPos, this);
            this.private_SetXYByLayout(X, Y, PageNum, Layout, (bResetAlign || true !== this.PositionH.Align ? true : false), (bResetAlign || true !== this.PositionV.Align ? true : false));
        }
    },

    private_SetXYByLayout : function(X, Y, PageNum, Layout, bChangeX, bChangeY)
    {
        this.PageNum = PageNum;

        var _W = (this.PositionH.Align ? this.Extent.W : this.getXfrmExtX() );
        var _H = (this.PositionV.Align ? this.Extent.H : this.getXfrmExtY() );

        this.Internal_Position.Set(_W, _H, this.YOffset, Layout.ParagraphLayout, Layout.PageLimits);
        this.Internal_Position.Calculate_X(false, c_oAscRelativeFromH.Page, false, X - Layout.PageLimits.X, false);
        this.Internal_Position.Calculate_Y(false, c_oAscRelativeFromV.Page, false, Y - Layout.PageLimits.Y, false);
        this.Internal_Position.Correct_Values(false, Layout.PageLimits, this.AllowOverlap, this.Use_TextWrap(), []);

        if (true === bChangeX)
        {
            this.X = this.Internal_Position.CalcX;

            // Рассчитаем сдвиг с учетом старой привязки
            var ValueX = this.Internal_Position.Calculate_X_Value(this.PositionH.RelativeFrom);
            this.Set_PositionH(this.PositionH.RelativeFrom, false, ValueX, false);

            // На всякий случай пересчитаем заново координату
            this.X = this.Internal_Position.Calculate_X(false, this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value, this.PositionH.Percent);
        }

        if (true === bChangeY)
        {
            this.Y = this.Internal_Position.CalcY;

            // Рассчитаем сдвиг с учетом старой привязки
            var ValueY = this.Internal_Position.Calculate_Y_Value(this.PositionV.RelativeFrom);
            this.Set_PositionV(this.PositionV.RelativeFrom, false, ValueY, false);

            // На всякий случай пересчитаем заново координату
            this.Y = this.Internal_Position.Calculate_Y(false, this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value, this.PositionV.Percent);
        }
    },

    Get_DrawingType : function()
    {
        return this.DrawingType;
    },

    Is_Inline : function()
    {
        if (!this.Parent || !this.Parent.Get_ParentTextTransform || null !== this.Parent.Get_ParentTextTransform())
            return true;

        return ( drawing_Inline === this.DrawingType ? true : false );
    },

    Use_TextWrap : function()
    {
        // Если автофигура привязана к параграфу с рамкой, обтекание не делается
        if (!this.Parent || !this.Parent.Get_FramePr || (null !== this.Parent.Get_FramePr() && undefined !== this.Parent.Get_FramePr()))
            return false;

        // здесь должна быть проверка, нужно ли использовать обтекание относительно данного объекта,
        // или он просто лежит над или под текстом.
        return ( drawing_Anchor === this.DrawingType && !(this.wrappingType === WRAPPING_TYPE_NONE) );
    },

    Draw_Selection : function()
    {
        var Padding = this.DrawingDocument.GetMMPerDot( 6 );
        this.DrawingDocument.AddPageSelection( this.PageNum, this.selectX - Padding, this.selectY - Padding, this.Width + 2 * Padding, this.Height + 2 * Padding );
    },

    OnEnd_MoveInline : function(NearPos)
    {
        NearPos.Paragraph.Check_NearestPos( NearPos );

        var RunPr = this.Remove_FromDocument( false );

        if (this.LogicDocument && this.DocumentContent && true === this.LogicDocument.Is_TrackRevisions())
        {
            var NewParaDrawing = this.Copy();
            NewParaDrawing.Add_ToDocument(NearPos, true, RunPr);
            this.DocumentContent.Select_DrawingObject(NewParaDrawing.Get_Id());
        }
        else
        {
            this.Add_ToDocument(NearPos, true, RunPr);
        }
    },

    Get_ParentTextTransform: function()
    {
        if(this.Parent)
        {
            return this.Parent.Get_ParentTextTransform();
        }
        return null;
    },

    GoTo_Text : function(bBefore, bUpdateStates)
    {                
        if ( undefined != this.Parent && null != this.Parent )
        {
            this.Parent.Cursor_MoveTo_Drawing( this.Id, bBefore );
            this.Parent.Document_SetThisElementCurrent(undefined === bUpdateStates? true : bUpdateStates);
        }
    },

    Remove_FromDocument : function(bRecalculate)
    {
        var Result = null;
        var Run = this.Parent.Get_DrawingObjectRun(this.Id);

        if (null !== Run)
        {
            Run.Remove_DrawingObject(this.Id);

            if (true === Run.Is_InHyperlink())
                Result = new CTextPr();
            else
                Result = Run.Get_TextPr();
        }

        if (false != bRecalculate)
            editor.WordControl.m_oLogicDocument.Recalculate();

        return Result;
    },

    Get_ParentParagraph: function()
    {
        if(this.Parent instanceof Paragraph )
            return this.Parent;
        if(this.Parent instanceof ParaRun)
            return this.Parent.Paragraph;
        return null;
    },

    Add_ToDocument : function(NearPos, bRecalculate, RunPr)
    {
        NearPos.Paragraph.Check_NearestPos( NearPos );

        var LogicDocument = this.DrawingDocument.m_oLogicDocument;

        var Para = new Paragraph(this.DrawingDocument, LogicDocument);
        var DrawingRun = new ParaRun( Para );
        DrawingRun.Add_ToContent( 0, this );

        if ( undefined !== RunPr )
            DrawingRun.Set_Pr( RunPr.Copy() );

        Para.Add_ToContent( 0, DrawingRun );

        var SelectedElement = new CSelectedElement(Para, false);
        var SelectedContent = new CSelectedContent();
        SelectedContent.Add( SelectedElement );
        SelectedContent.Set_MoveDrawing( true );        

        NearPos.Paragraph.Parent.Insert_Content( SelectedContent, NearPos );
        NearPos.Paragraph.Clear_NearestPosArray();
        NearPos.Paragraph.Correct_Content();

        if ( false != bRecalculate )
            LogicDocument.Recalculate();
    },

    Add_ToDocument2 : function(Paragraph)
    {
        var DrawingRun = new ParaRun( Paragraph );
        DrawingRun.Add_ToContent( 0, this );

        Paragraph.Add_ToContent( 0, DrawingRun );
    },

    Update_CursorType : function(X, Y, PageIndex)
    {
        this.DrawingDocument.SetCursorType( "move", new AscCommon.CMouseMoveData() );

        if ( null != this.Parent )
        {
            var Lock = this.Parent.Lock;
            if ( true === Lock.Is_Locked() )
            {
                var PNum = Math.max( 0, Math.min( PageIndex - this.Parent.PageNum, this.Parent.Pages.length - 1 ) );
                var _X = this.Parent.Pages[PNum].X;
                var _Y = this.Parent.Pages[PNum].Y;

                var MMData = new AscCommon.CMouseMoveData();
                var Coords = this.DrawingDocument.ConvertCoordsToCursorWR( _X, _Y, this.Parent.Get_StartPage_Absolute() + ( PageIndex - this.Parent.PageNum ) );
                MMData.X_abs            = Coords.X - 5;
                MMData.Y_abs            = Coords.Y;
                MMData.Type             = AscCommon.c_oAscMouseMoveDataTypes.LockedObject;
                MMData.UserId           = Lock.Get_UserId();
                MMData.HaveChanges      = Lock.Have_Changes();
                MMData.LockedObjectType = c_oAscMouseMoveLockedObjectType.Common;

                editor.sync_MouseMoveCallback( MMData );
            }
        }
    },

    Get_AnchorPos : function()
    {
        return this.Parent.Get_AnchorPos(this);
    },

    CheckRecalcAutoFit : function(oSectPr)
    {
        if(this.GraphicObj && this.GraphicObj.CheckNeedRecalcAutoFit)
        {
            if(this.GraphicObj.CheckNeedRecalcAutoFit(oSectPr))
            {
                if(this.GraphicObj)
                {
                    this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
                }
                this.Measure();
            }
        }
    },
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case AscDFH.historyitem_Drawing_SetSizeRelH:
            {
                this.SizeRelH = Data.Old;
                break;
            }
            case AscDFH.historyitem_Drawing_SetSizeRelV:
            {
                this.SizeRelV = Data.Old;
                break;
            }
            case AscDFH.historyitem_Drawing_SetEffectExtent:
            {
                this.EffectExtent.L = Data.OldEE.L;
                this.EffectExtent.T = Data.OldEE.T;
                this.EffectExtent.R = Data.OldEE.R;
                this.EffectExtent.B = Data.OldEE.B;
                break;
            }
            case AscDFH.historyitem_Drawing_SetRelativeHeight:
            {
                this.Set_RelativeHeight2(Data.OldPr);
                break;
            }
            case AscDFH.historyitem_Drawing_DrawingType:
            {
                this.DrawingType = Data.Old;
                if(Data.Old === WRAPPING_TYPE_TIGHT || Data.Old === WRAPPING_TYPE_THROUGH)
                {
                    if(this.GraphicObj)
                    {
                        this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
                    }
                }
                break;
            }

            case AscDFH.historyitem_Drawing_WrappingType:
            {
                this.wrappingType = Data.Old;
                //this.updateWidthHeight();
                break;
            }

            case AscDFH.historyitem_Drawing_Distance:
            {
                this.Distance.L = Data.Old.Left;
                this.Distance.T = Data.Old.Top;
                this.Distance.R = Data.Old.Right;
                this.Distance.B = Data.Old.Bottom;

                this.GraphicObj && this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
                break;
            }

            case AscDFH.historyitem_Drawing_LayoutInCell:
            {
                this.LayoutInCell = Data.Old;
                break;
            }

            case AscDFH.historyitem_Drawing_AllowOverlap:
            {
                this.AllowOverlap = Data.Old;
                break;
            }

            case AscDFH.historyitem_Drawing_PositionH:
            {
                this.PositionH.RelativeFrom = Data.Old.RelativeFrom;
                this.PositionH.Align        = Data.Old.Align;
                this.PositionH.Value        = Data.Old.Value;
                this.PositionH.Percent      = Data.Old.Percent;

                break;
            }

            case AscDFH.historyitem_Drawing_PositionV:
            {
                this.PositionV.RelativeFrom = Data.Old.RelativeFrom;
                this.PositionV.Align        = Data.Old.Align;
                this.PositionV.Value        = Data.Old.Value;
                this.PositionV.Percent      = Data.Old.Percent;

                break;
            }
            case AscDFH.historyitem_Drawing_BehindDoc:
            {
                this.behindDoc = Data.Old;

                break;
            }


            case AscDFH.historyitem_Drawing_SetGraphicObject:
            {
                if(this.GraphicObj != null)
                {
                    //this.GraphicObj.parent = null;
                }
                if(Data.oldId != null)
                {
                    this.GraphicObj = g_oTableId.Get_ById(Data.oldId);
                }
                else
                {
                    this.GraphicObj = null;
                }
                if(isRealObject(this.GraphicObj))
                {
                    //this.GraphicObj.parent = this;
                    this.GraphicObj.handleUpdateExtents && this.GraphicObj.handleUpdateExtents();
                }
                break;
            }

            case AscDFH.historyitem_SetSimplePos:
            {
                this.SimplePos.Use = Data.oldUse;
                this.SimplePos.X = Data.oldX;
                this.SimplePos.Y = Data.oldY;
                break;
            }
            case AscDFH.historyitem_SetExtent:
            {
                this.Extent.W = Data.oldW;
                this.Extent.H = Data.oldH;
                break;
            }
            case AscDFH.historyitem_SetWrapPolygon:
            {
                this.wrappingPolygon = Data.oldW;
                break;
            }
            case AscDFH.historyitem_Drawing_SetLocked:
            {
                this.Locked = Data.OldPr;
                break;
            }
            case AscDFH.historyitem_Drawing_SetParent:
            {
                this.Parent = Data.oldPr;
                break;
            }
            case AscDFH.historyitem_Drawing_SetParaMath:
            {
                this.ParaMath = Data.Old;
                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case AscDFH.historyitem_Drawing_SetSizeRelH:
            {
                this.SizeRelH = Data.New;
                break;
            }
            case AscDFH.historyitem_Drawing_SetSizeRelV:
            {
                this.SizeRelV = Data.New;
                break;
            }
            case AscDFH.historyitem_Drawing_SetEffectExtent:
            {
                this.EffectExtent.L = Data.NewEE.L;
                this.EffectExtent.T = Data.NewEE.T;
                this.EffectExtent.R = Data.NewEE.R;
                this.EffectExtent.B = Data.NewEE.B;
                break;
            }
            case AscDFH.historyitem_Drawing_SetRelativeHeight:
            {
                this.Set_RelativeHeight2(Data.NewPr);
                break;
            }

            case AscDFH.historyitem_Drawing_DrawingType:
            {
                this.DrawingType = Data.New;
                break;
            }

            case AscDFH.historyitem_Drawing_WrappingType:
            {
                this.wrappingType = Data.New;
                if(Data.New === WRAPPING_TYPE_TIGHT || Data.New === WRAPPING_TYPE_THROUGH)
                {
                    if(this.GraphicObj)
                    {
                        this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
                    }
                }
                break;
            }

            case AscDFH.historyitem_Drawing_Distance:
            {
                this.Distance.L = Data.New.Left;
                this.Distance.T = Data.New.Top;
                this.Distance.R = Data.New.Right;
                this.Distance.B = Data.New.Bottom;
                this.GraphicObj && this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
                break;
            }

            case AscDFH.historyitem_Drawing_LayoutInCell:
            {
                this.LayoutInCell = Data.New;
                break;
            }

            case AscDFH.historyitem_Drawing_AllowOverlap :
            {
                this.AllowOverlap = Data.New;
                break;
            }

            case AscDFH.historyitem_Drawing_PositionH:
            {
                this.PositionH.RelativeFrom = Data.New.RelativeFrom;
                this.PositionH.Align        = Data.New.Align;
                this.PositionH.Value        = Data.New.Value;
                this.PositionH.Percent      = Data.New.Percent;
                break;
            }

            case AscDFH.historyitem_Drawing_PositionV:
            {
                this.PositionV.RelativeFrom = Data.New.RelativeFrom;
                this.PositionV.Align        = Data.New.Align;
                this.PositionV.Value        = Data.New.Value;
                this.PositionV.Percent      = Data.New.Percent;
                break;
            }

            case AscDFH.historyitem_Drawing_BehindDoc:
            {
                this.behindDoc = Data.New;
                break;
            }

            case AscDFH.historyitem_Drawing_SetGraphicObject:
            {

                if(Data.newId != null)
                {
                    this.GraphicObj = g_oTableId.Get_ById(Data.newId);
                }
                else
                {
                    this.GraphicObj = null;
                }

                if(isRealObject(this.GraphicObj))
                {
                    this.GraphicObj.handleUpdateExtents && this.GraphicObj.handleUpdateExtents();
                }

                break;
            }

            case AscDFH.historyitem_SetSimplePos:
            {
                this.SimplePos.Use = Data.newUse;
                this.SimplePos.X = Data.newX;
                this.SimplePos.Y = Data.newY;
                break;
            }

            case AscDFH.historyitem_SetExtent:
            {
                this.Extent.W = Data.newW;
                this.Extent.H = Data.newH;
                break;
            }

            case AscDFH.historyitem_SetWrapPolygon:
            {
                this.wrappingPolygon = Data.newW;
                break;
            }

            case AscDFH.historyitem_Drawing_SetLocked:
            {
                this.Locked = Data.NewPr;
                break;
            }
            case AscDFH.historyitem_Drawing_SetParent:
            {
                this.Parent = Data.newPr;
                break;
            }
            case AscDFH.historyitem_Drawing_SetParaMath:
            {
                this.ParaMath = Data.New;
                break;
            }

        }
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        if(this.Parent != null)
            return this.Parent.Get_ParentObject_or_DocumentPos();
    },

    Refresh_RecalcData : function(Data)
    {
        if ( undefined != this.Parent && null != this.Parent )
        {
            if(isRealObject(Data))
            {
                switch(Data.Type)
                {
                    case AscDFH.historyitem_Drawing_Distance:
                    {
                        if( this.GraphicObj)
                        {
                            this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
                            this.GraphicObj.addToRecalculate();
                        }
                        break;
                    }

                    case AscDFH.historyitem_SetExtent:
                    {
                        var Run = this.Parent.Get_DrawingObjectRun( this.Id );
                        if(Run)
                        {
                            Run.RecalcInfo.Measure = true;
                        }
                        break;
                    }

                    case AscDFH.historyitem_Drawing_SetSizeRelH:
                    case AscDFH.historyitem_Drawing_SetSizeRelV:
                    {
                        if( this.GraphicObj)
                        {
                            this.GraphicObj.handleUpdateExtents && this.GraphicObj.handleUpdateExtents();
                            this.GraphicObj.addToRecalculate();
                        }
                        var Run = this.Parent.Get_DrawingObjectRun( this.Id );
                        if(Run)
                        {
                            Run.RecalcInfo.Measure = true;
                        }
                        break;
                    }
                    case AscDFH.historyitem_Drawing_WrappingType:
                    {
                        if(this.GraphicObj)
                        {
                            this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
                            this.GraphicObj.addToRecalculate()
                        }
                        break;
                    }
                    case AscDFH.historyitem_Drawing_SetRelativeHeight:
                    {
                        //TODO
                        break;
                    }
                }
            }
            return this.Parent.Refresh_RecalcData2();
        }
    },
//-----------------------------------------------------------------------------------
// Функции для совместного редактирования
//-----------------------------------------------------------------------------------
    hyperlinkCheck: function(bCheck)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkCheck === "function")
            return this.GraphicObj.hyperlinkCheck(bCheck);
        return null;
    },

    hyperlinkCanAdd: function(bCheckInHyperlink)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkCanAdd === "function")
            return this.GraphicObj.hyperlinkCanAdd(bCheckInHyperlink);
        return false;
    },

    hyperlinkRemove: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkCanAdd === "function")
            return this.GraphicObj.hyperlinkRemove();
        return false;
    },

    hyperlinkModify: function( HyperProps )
    {

        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkModify === "function")
            return this.GraphicObj.hyperlinkModify(HyperProps);
    },

    hyperlinkAdd: function( HyperProps )
    {

        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.hyperlinkAdd === "function")
            return this.GraphicObj.hyperlinkAdd(HyperProps);
    },

    documentStatistics: function(stat)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.documentStatistics === "function")
            this.GraphicObj.documentStatistics(stat);
    },

    documentCreateFontCharMap: function(fontMap)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.documentCreateFontCharMap === "function")
            this.GraphicObj.documentCreateFontCharMap(fontMap);
    },

    documentCreateFontMap: function(fontMap)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.documentCreateFontMap === "function")
            this.GraphicObj.documentCreateFontMap(fontMap);
    },

    tableCheckSplit: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableCheckSplit === "function")
            return this.GraphicObj.tableCheckSplit();
        return false;
    },

    tableCheckMerge: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableCheckMerge === "function")
            return this.GraphicObj.tableCheckMerge();
        return false;
    },

    tableSelect: function( Type )
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableSelect === "function")
            return this.GraphicObj.tableSelect(Type);
    },

    tableRemoveTable: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableRemoveTable === "function")
            return this.GraphicObj.tableRemoveTable();
    },

    tableSplitCell: function(Cols, Rows)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableSplitCell === "function")
            return this.GraphicObj.tableSplitCell(Cols, Rows);
    },

    tableMergeCells: function(Cols, Rows)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableMergeCells === "function")
            return this.GraphicObj.tableMergeCells(Cols, Rows);
    },

    tableRemoveCol: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableRemoveCol === "function")
            return this.GraphicObj.tableRemoveCol();
    },

    tableAddCol: function(bBefore)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableAddCol === "function")
            return this.GraphicObj.tableAddCol(bBefore);
    },

    tableRemoveRow: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableRemoveRow === "function")
            return this.GraphicObj.tableRemoveRow();
    },

    tableAddRow: function(bBefore)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.tableAddRow === "function")
            return this.GraphicObj.tableAddRow(bBefore);
    },

    getCurrentParagraph: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getCurrentParagraph === "function")
            return this.GraphicObj.getCurrentParagraph();

        if (this.Parent instanceof Paragraph)
            return this.Parent;
    },
    getSelectedText: function(bClearText)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getSelectedText === "function")
            return this.GraphicObj.getSelectedText(bClearText);
        return "";
    },

    getCurPosXY: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getCurPosXY === "function")
            return this.GraphicObj.getCurPosXY();
        return {X:0, Y:0};
    },

    setParagraphKeepLines: function(Value)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphKeepLines === "function")
            return this.GraphicObj.setParagraphKeepLines(Value);
    },

    setParagraphKeepNext: function(Value)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphKeepNext === "function")
            return this.GraphicObj.setParagraphKeepNext(Value);
    },

    setParagraphWidowControl: function(Value)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphWidowControl === "function")
            return this.GraphicObj.setParagraphWidowControl(Value);
    },

    setParagraphPageBreakBefore: function(Value)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphPageBreakBefore === "function")
            return this.GraphicObj.setParagraphPageBreakBefore(Value);
    },

    isTextSelectionUse: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.isTextSelectionUse === "function")
            return this.GraphicObj.isTextSelectionUse();
        return false;
    },

    paragraphFormatPaste: function( CopyTextPr, CopyParaPr, Bool )
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.isTextSelectionUse === "function")
            return this.GraphicObj.paragraphFormatPaste(CopyTextPr, CopyParaPr, Bool);
    },

    getNearestPos: function(x, y, pageIndex)
    {

        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getNearestPos === "function")
            return this.GraphicObj.getNearestPos(x, y, pageIndex);
        return null;
    },

    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( AscDFH.historyitem_type_Drawing );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case AscDFH.historyitem_Drawing_SetSizeRelH:
            case AscDFH.historyitem_Drawing_SetSizeRelV:
            {
                if(Data.New)
                {
                    Writer.WriteBool(true);
                    Writer.WriteLong(Data.New.RelativeFrom);
                    Writer.WriteDouble(Data.New.Percent);
                }
                else
                {
                    Writer.WriteBool(false);
                }
                break;
            }
            case AscDFH.historyitem_Drawing_SetEffectExtent:
            {
                AscFormat.writeDouble(Writer, Data.NewEE.L);
                AscFormat.writeDouble(Writer, Data.NewEE.T);
                AscFormat.writeDouble(Writer, Data.NewEE.R);
                AscFormat.writeDouble(Writer, Data.NewEE.B);
                break;
            }
            case AscDFH.historyitem_Drawing_SetRelativeHeight:
            {
                AscFormat.writeLong(Writer, Data.NewPr);
                break;
            }
            case AscDFH.historyitem_Drawing_DrawingType:
            {
                // Long : тип обтекания
                Writer.WriteLong( Data.New );
                break;
            }

            case AscDFH.historyitem_Drawing_WrappingType:
            {
                // Long : тип обтекания
                Writer.WriteLong( Data.New );
                break;
            }

            case AscDFH.historyitem_Drawing_Distance:
            {
                // Double : Left
                // Double : Top
                // Double : Right
                // Double : Bottom

                Writer.WriteDouble( Data.New.Left );
                Writer.WriteDouble( Data.New.Top );
                Writer.WriteDouble( Data.New.Right );
                Writer.WriteDouble( Data.New.Bottom );

                break;
            }

            case AscDFH.historyitem_Drawing_LayoutInCell:
            {
                // Bool : LayoutInCell
                Writer.WriteBool(Data.New);
                break;
            }

            case AscDFH.historyitem_Drawing_AllowOverlap:
            {
                // Bool : AllowOverlap
                Writer.WriteBool( Data.New );
                break;
            }

            case AscDFH.historyitem_Drawing_PositionH:
            case AscDFH.historyitem_Drawing_PositionV:
            {
                // Long : RelativeFrom
                // Bool : Align
                //   true  -> Long   : Value
                //   false -> Double : Value
                // Bool : Percent

                Writer.WriteLong( Data.New.RelativeFrom );
                Writer.WriteBool( Data.New.Align );
                if ( true === Data.New.Align )
                    Writer.WriteLong( Data.New.Value );
                else
                    Writer.WriteDouble( Data.New.Value );
                Writer.WriteBool(Data.New.Percent === true);

                break;
            }

            case AscDFH.historyitem_Drawing_BehindDoc:
            {
                // Bool
                Writer.WriteBool( Data.New );

                break;
            }

            case AscDFH.historyitem_Drawing_SetGraphicObject:
            {
                Writer.WriteBool(Data.newId != null);
                if(Data.newId != null)
                {
                    Writer.WriteString2(Data.newId);
                }
                break;
            }
            case  AscDFH.historyitem_SetSimplePos:
            {
                Writer.WriteBool(Data.newUse);
                Writer.WriteBool(typeof Data.newX === "number");
                if(typeof Data.newX === "number")
                {
                    Writer.WriteDouble(Data.newX);
                }
                Writer.WriteBool(typeof Data.newY === "number");
                if(typeof Data.newY === "number")
                {
                    Writer.WriteDouble(Data.newY);
                }
                break;
            }
            case AscDFH.historyitem_SetExtent:
            {
                Writer.WriteBool(typeof Data.newW === "number");
                if(typeof Data.newW === "number")
                {
                    Writer.WriteDouble(Data.newW);
                }
                Writer.WriteBool(typeof Data.newH === "number");
                if(typeof Data.newH === "number")
                {
                    Writer.WriteDouble(Data.newH);
                }
                break;
            }
            case AscDFH.historyitem_SetWrapPolygon:
            {
                AscFormat.writeObject(Writer, Data.newW);
               // Writer.WriteBool(Data.newW !== null && typeof Data.newW === "object");
               // if(Data.newW !== null && typeof Data.newW === "object")
               // {
               //     Writer.WriteString2(Data.newW);
               // }
                break;
            }
            case AscDFH.historyitem_Drawing_SetLocked:
            {
                AscFormat.writeBool(Writer, Data.NewPr);
                break;
            }

            case AscDFH.historyitem_Drawing_SetParent:
            {
                AscFormat.writeObject(Writer, Data.newPr);
                break;
            }
            case AscDFH.historyitem_Drawing_SetParaMath:
            {
                // Bool    : isUndefined
                // String2 : ParaMath.Id

                if (Data.New instanceof ParaMath)
                {
                    Writer.WriteBool(false);
                    Writer.WriteString2(Data.New.Get_Id());
                }
                else
                {
                    Writer.WriteBool(true);
                }

                break;
            }
        }

        return Writer;
    },

    Load_Changes : function(Reader)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( AscDFH.historyitem_type_Drawing != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case AscDFH.historyitem_Drawing_SetSizeRelH:
            {
                if(Reader.GetBool())
                {
                    this.SizeRelH = {};
                    this.SizeRelH.RelativeFrom = Reader.GetLong();
                    this.SizeRelH.Percent = Reader.GetDouble();
                }
                else
                {
                    this.SizeRelH = undefined;
                }
                break;
            }
            case AscDFH.historyitem_Drawing_SetSizeRelV:
            {
                if(Reader.GetBool())
                {
                    this.SizeRelV = {};
                    this.SizeRelV.RelativeFrom = Reader.GetLong();
                    this.SizeRelV.Percent = Reader.GetDouble();
                }
                else
                {
                    this.SizeRelV = undefined;
                }
                break;
            }
            case AscDFH.historyitem_Drawing_SetEffectExtent:
            {
                this.EffectExtent.L = AscFormat.readDouble(Reader);
                this.EffectExtent.T = AscFormat.readDouble(Reader);
                this.EffectExtent.R = AscFormat.readDouble(Reader);
                this.EffectExtent.B = AscFormat.readDouble(Reader);
                break;
            }
            case AscDFH.historyitem_Drawing_SetRelativeHeight:
            {
                this.Set_RelativeHeight2(AscFormat.readLong(Reader));
                break;
            }
            case AscDFH.historyitem_Drawing_DrawingType:
            {
                // Long : тип обтекания
                this.DrawingType = Reader.GetLong();
                break;
            }


            case AscDFH.historyitem_Drawing_WrappingType:
            {
                // Long : тип обтекания
                this.wrappingType = Reader.GetLong();
                break;
            }

            case AscDFH.historyitem_Drawing_Distance:
            {
                // Double : Left
                // Double : Top
                // Double : Right
                // Double : Bottom

                this.Distance.L = Reader.GetDouble();
                this.Distance.T = Reader.GetDouble();
                this.Distance.R = Reader.GetDouble();
                this.Distance.B = Reader.GetDouble();

                this.GraphicObj && this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
                break;
            }

            case AscDFH.historyitem_Drawing_LayoutInCell:
            {
                // Bool : LayoutInCell
                this.LayoutInCell = Reader.GetBool();
                break;
            }

            case AscDFH.historyitem_Drawing_AllowOverlap:
            {
                // Bool : AllowOverlap
                this.AllowOverlap = Reader.GetBool();
                break;
            }

            case AscDFH.historyitem_Drawing_PositionH:
            {
                // Long : RelativeFrom
                // Bool : Align
                //   true  -> Long   : Value
                //   false -> Double : Value

                this.PositionH.RelativeFrom = Reader.GetLong();
                this.PositionH.Align        = Reader.GetBool();

                if ( true === this.PositionH.Align )
                    this.PositionH.Value = Reader.GetLong();
                else
                    this.PositionH.Value = Reader.GetDouble();

                this.PositionH.Percent = Reader.GetBool();

                break;
            }

            case AscDFH.historyitem_Drawing_PositionV:
            {
                // Long : RelativeFrom
                // Bool : Align
                //   true  -> Long   : Value
                //   false -> Double : Value

                this.PositionV.RelativeFrom = Reader.GetLong();
                this.PositionV.Align        = Reader.GetBool();

                if ( true === this.PositionV.Align )
                    this.PositionV.Value = Reader.GetLong();
                else
                    this.PositionV.Value = Reader.GetDouble();

                this.PositionV.Percent = Reader.GetBool();

                break;
            }

            case AscDFH.historyitem_Drawing_BehindDoc:
            {
                // Bool
                this.behindDoc = Reader.GetBool();
                break;
            }

            case AscDFH.historyitem_Drawing_SetGraphicObject:
            {
                if(Reader.GetBool())
                {
                    this.GraphicObj = g_oTableId.Get_ById(Reader.GetString2());
                }
                else
                {
                    this.GraphicObj = null;
                }
                if(isRealObject(this.GraphicObj))
                {
                    this.GraphicObj.handleUpdateExtents && this.GraphicObj.handleUpdateExtents();
                }
                break;
            }
            case  AscDFH.historyitem_SetSimplePos:
            {
                this.SimplePos.Use = Reader.GetBool();
                if(Reader.GetBool())
                {
                    this.SimplePos.X = Reader.GetDouble();
                }
                if(Reader.GetBool())
                {
                    this.SimplePos.Y = Reader.GetDouble();
                }
                break;
            }
            case  AscDFH.historyitem_SetExtent:
            {
                if(Reader.GetBool())
                {
                    this.Extent.W = Reader.GetDouble();
                }
                if(Reader.GetBool())
                {
                    this.Extent.H = Reader.GetDouble();
                }

                if(this.Parent)
                {
                    var Run = this.Parent.Get_DrawingObjectRun( this.Id );
                    if(Run)
                    {
                        Run.RecalcInfo.Measure = true;
                    }
                }
                break;
            }
            case AscDFH.historyitem_SetWrapPolygon:
            {
                this.wrappingPolygon = AscFormat.readObject(Reader);
                break;
            }
            case AscDFH.historyitem_Drawing_SetLocked:
            {
                this.Locked = AscFormat.readBool(Reader);
                break;
            }

            case AscDFH.historyitem_Drawing_SetParent:
            {
                this.Parent = AscFormat.readObject(Reader);
                break;
            }
            case AscDFH.historyitem_Drawing_SetParaMath:
            {
                // Bool    : isUndefined
                // String2 : ParaMath.Id

                this.ParaMath = undefined;
                if (false === Reader.GetBool())
                {
                    var paraMath = g_oTableId.Get_ById(Reader.GetString2());
                    if (paraMath instanceof ParaMath)
                        this.ParaMath = paraMath;
                }

                break;
            }

        }
    },
//-----------------------------------------------------------------------------------
// Функции для записи/чтения в поток
//-----------------------------------------------------------------------------------
    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // String : Id

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( AscDFH.historyitem_type_Drawing );
        Writer.WriteString2(this.Id);
        AscFormat.writeDouble(Writer, this.Extent.W);
        AscFormat.writeDouble(Writer, this.Extent.H);
        AscFormat.writeObject(Writer, this.GraphicObj);
        AscFormat.writeObject(Writer, this.DocumentContent);
        AscFormat.writeObject(Writer, this.Parent);
        AscFormat.writeObject(Writer, this.wrappingPolygon);
        AscFormat.writeLong(Writer, this.RelativeHeight);

    },

    Read_FromBinary2 : function(Reader)
    {
        this.Id = Reader.GetString2();
        this.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
        this.LogicDocument   = this.DrawingDocument ? this.DrawingDocument.m_oLogicDocument : null;

        this.Extent.W = AscFormat.readDouble(Reader);
        this.Extent.H = AscFormat.readDouble(Reader);
        this.GraphicObj      = AscFormat.readObject(Reader);
        this.DocumentContent = AscFormat.readObject(Reader);
        this.Parent          = AscFormat.readObject(Reader);
        this.wrappingPolygon = AscFormat.readObject(Reader);
        this.RelativeHeight  = AscFormat.readLong(Reader);
        if(this.wrappingPolygon)
        {
            this.wrappingPolygon.wordGraphicObject = this;
        }

        this.drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
        this.document = editor.WordControl.m_oLogicDocument;
        this.graphicObjects = editor.WordControl.m_oLogicDocument.DrawingObjects;
        this.graphicObjects.addGraphicObject(this);
        g_oTableId.Add(this, this.Id);
    },

    Load_LinkData : function()
    {
    },

    draw: function(graphics, pageIndex)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.draw === "function")
        {
            graphics.SaveGrState();
            this.GraphicObj.draw(graphics);
            graphics.RestoreGrState();
        }
    },

    drawAdjustments: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.drawAdjustments === "function")
        {
            this.GraphicObj.drawAdjustments();
        }
    },

    getTransformMatrix: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getTransformMatrix === "function")
        {
            return this.GraphicObj.getTransformMatrix();
        }
        return null;
    },

    getExtensions: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getExtensions === "function")
        {
            return this.GraphicObj.getExtensions();
        }
        return null;
    },

    isGroup: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.isGroup === "function")
            return this.GraphicObj.isGroup();
        return false;
    },

    isShapeChild: function(bRetShape)
    {
        if(!this.Is_Inline() || !this.DocumentContent)
            return bRetShape ? null : false;

        var cur_doc_content = this.DocumentContent;
        while(cur_doc_content.Is_TableCellContent())
        {
            cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
        }

        if(isRealObject(cur_doc_content.Parent) && typeof cur_doc_content.Parent.getObjectType === "function" && cur_doc_content.Parent.getObjectType() === AscDFH.historyitem_type_Shape)
            return bRetShape ? cur_doc_content.Parent : true;

        return bRetShape ? null : false;
    },

    checkShapeChildAndGetTopParagraph: function(paragraph)
    {
        var parent_paragraph = !paragraph ? this.Get_ParentParagraph() : paragraph;
        var parent_doc_content = parent_paragraph.Parent;
        if(parent_doc_content.Parent instanceof AscFormat.CShape)
        {
            if(!parent_doc_content.Parent.group)
            {
                return parent_doc_content.Parent.parent.Get_ParentParagraph();
            }
            else
            {
                var top_group = parent_doc_content.Parent.group;
                while(top_group.group)
                    top_group = top_group.group;
                return top_group.parent.Get_ParentParagraph();
            }
        }
        else if(parent_doc_content.Is_TableCellContent())
        {
            var top_doc_content = parent_doc_content;
            while(top_doc_content.Is_TableCellContent())
            {
                top_doc_content = top_doc_content.Parent.Row.Table.Parent;
            }
            if(top_doc_content.Parent instanceof AscFormat.CShape)
            {
                if(!top_doc_content.Parent.group)
                {
                    return top_doc_content.Parent.parent.Get_ParentParagraph();
                }
                else
                {
                    var top_group = top_doc_content.Parent.group;
                    while(top_group.group)
                        top_group = top_group.group;
                    return top_group.parent.Get_ParentParagraph();
                }
            }
            else
            {
                return parent_paragraph;
            }

        }
        return parent_paragraph;
    },


    hit: function(x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.hit === "function")
        {
            return this.GraphicObj.hit(x, y);
        }
        return false;
    },

    hitToTextRect: function(x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.hitToTextRect === "function")
        {
            return this.GraphicObj.hitToTextRect(x, y);
        }
        return false;
    },

    cursorGetPos: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorGetPos === "function")
        {
            return this.GraphicObj.cursorGetPos();
        }
        return {X: 0, Y: 0};
    },

    getResizeCoefficients: function(handleNum, x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getResizeCoefficients === "function")
        {
            return this.GraphicObj.getResizeCoefficients(handleNum, x, y);
        }
        return {kd1: 1, kd2: 1};
    },

    getParagraphParaPr: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getParagraphParaPr === "function")
        {
            return this.GraphicObj.getParagraphParaPr();
        }
        return null;
    },

    getParagraphTextPr: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getParagraphTextPr === "function")
        {
            return this.GraphicObj.getParagraphTextPr();
        }
        return null;
    },

    getAngle: function(x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.getAngle === "function")
            return this.GraphicObj.getAngle(x, y);
        return 0;
    },

    calculateSnapArrays: function()
    {
        this.GraphicObj.snapArrayX.length = 0;
        this.GraphicObj.snapArrayY.length = 0;
        if(this.GraphicObj)
            this.GraphicObj.recalculateSnapArrays();

    },

    recalculateCurPos: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.recalculateCurPos === "function")
        {
            this.GraphicObj.recalculateCurPos();
        }
    },

    setPageIndex: function(newPageIndex)
    {
        this.pageIndex = newPageIndex;
        this.PageNum = newPageIndex;
    },

    Get_PageNum : function()
    {
        return this.PageNum;
    },


    Get_AllParagraphs : function(Props, ParaArray)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.Get_AllParagraphs === "function" )
            this.GraphicObj.Get_AllParagraphs(Props, ParaArray);
    },


    getTableProps: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.getTableProps === "function")
            return this.GraphicObj.getTableProps();
        return null;
    },

    canGroup: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.canGroup === "function")
            return this.GraphicObj.canGroup();
        return false;
    },

    canUnGroup: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.canGroup === "function")
            return this.GraphicObj.canUnGroup();
        return false;
    },


    select: function(pageIndex)
    {
        this.selected = true;
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.select === "function")
            this.GraphicObj.select(pageIndex);

    },

    paragraphClearFormatting: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.paragraphAdd === "function")
            this.GraphicObj.paragraphClearFormatting();
    },
    paragraphAdd: function(paraItem, bRecalculate)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.paragraphAdd === "function")
            this.GraphicObj.paragraphAdd(paraItem, bRecalculate);
    },

    setParagraphShd: function(Shd)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.setParagraphShd === "function")
            this.GraphicObj.setParagraphShd(Shd);
    },

    getArrayWrapPolygons: function()
    {
        if((isRealObject(this.GraphicObj) && typeof this.GraphicObj.getArrayWrapPolygons === "function"))
            return this.GraphicObj.getArrayWrapPolygons();

        return [];
    },

    getArrayWrapIntervals: function(x0,y0, x1, y1, Y0Sp, Y1Sp, LeftField, RightField, arr_intervals, bMathWrap)
    {
        if(this.wrappingType === WRAPPING_TYPE_THROUGH || this.wrappingType === WRAPPING_TYPE_TIGHT)
        {
            y0 = Y0Sp;
            y1 = Y1Sp;
        }

        this.wrappingPolygon.wordGraphicObject = this;
        return this.wrappingPolygon.getArrayWrapIntervals(x0,y0, x1, y1, LeftField, RightField, arr_intervals, bMathWrap);
    },


    setAllParagraphNumbering: function(numInfo)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.addInlineTable === "function")
            this.GraphicObj.setAllParagraphNumbering(numInfo);
    },

    addNewParagraph: function(bRecalculate)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.addNewParagraph === "function")
            this.GraphicObj.addNewParagraph(bRecalculate);
    },

    addInlineTable: function(cols, rows)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.addInlineTable === "function")
            this.GraphicObj.addInlineTable(cols, rows);
    },

    applyTextPr: function(paraItem, bRecalculate)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.applyTextPr === "function")
            this.GraphicObj.applyTextPr(paraItem, bRecalculate);
    },

    allIncreaseDecFontSize: function(bIncrease)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.allIncreaseDecFontSize === "function")
            this.GraphicObj.allIncreaseDecFontSize(bIncrease);
    },

    setParagraphNumbering: function(NumInfo)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.allIncreaseDecFontSize === "function")
            this.GraphicObj.setParagraphNumbering(NumInfo);
    },

    allIncreaseDecIndent: function(bIncrease)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.allIncreaseDecIndent === "function")
            this.GraphicObj.allIncreaseDecIndent(bIncrease);
    },

    allSetParagraphAlign: function(align)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.allSetParagraphAlign === "function")
            this.GraphicObj.allSetParagraphAlign(align);
    },

    paragraphIncreaseDecFontSize: function(bIncrease)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.paragraphIncreaseDecFontSize === "function")
            this.GraphicObj.paragraphIncreaseDecFontSize(bIncrease);
    },

    paragraphIncreaseDecIndent: function(bIncrease)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.paragraphIncreaseDecIndent === "function")
            this.GraphicObj.paragraphIncreaseDecIndent(bIncrease);
    },

    setParagraphAlign: function(align)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphAlign === "function")
            this.GraphicObj.setParagraphAlign(align);
    },

    setParagraphSpacing: function(Spacing)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphSpacing === "function")
            this.GraphicObj.setParagraphSpacing(Spacing);
    },

    updatePosition: function(x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.updatePosition === "function")
        {
            this.GraphicObj.updatePosition(x, y);
        }
    },

    updatePosition2: function(x, y)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.updatePosition === "function")
        {
            this.GraphicObj.updatePosition2(x, y);
        }
    },

    addInlineImage: function(W, H, Img, chart, bFlow)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.addInlineImage === "function")
            this.GraphicObj.addInlineImage(W, H, Img, chart, bFlow);
    },

    canAddComment: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.canAddComment === "function")
            return this.GraphicObj.canAddComment();
        return false;
    },

    addComment: function(commentData)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.addComment === "function")
            return this.GraphicObj.addComment(commentData);
    },

    selectionSetStart: function(x, y, event, pageIndex)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionSetStart === "function")
            this.GraphicObj.selectionSetStart(x, y, event, pageIndex);
    },


    selectionSetEnd: function(x, y, event, pageIndex)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionSetEnd === "function")
            this.GraphicObj.selectionSetEnd(x, y, event, pageIndex);
    },

    selectionRemove: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionRemove === "function")
            this.GraphicObj.selectionRemove();
    },

    updateSelectionState: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.updateSelectionState === "function")
            this.GraphicObj.updateSelectionState();
    },

    cursorMoveLeft: function(AddToSelect, Word)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveLeft === "function")
            this.GraphicObj.cursorMoveLeft(AddToSelect, Word);
    },

    cursorMoveRight: function(AddToSelect, Word)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveRight === "function")
            this.GraphicObj.cursorMoveRight(AddToSelect, Word);
    },


    cursorMoveUp: function(AddToSelect)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveUp === "function")
            this.GraphicObj.cursorMoveUp(AddToSelect);
    },

    cursorMoveDown: function(AddToSelect)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveDown === "function")
            this.GraphicObj.cursorMoveDown(AddToSelect);
    },

    cursorMoveEndOfLine: function(AddToSelect)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveEndOfLine === "function")
            this.GraphicObj.cursorMoveEndOfLine(AddToSelect);
    },

    cursorMoveStartOfLine: function(AddToSelect)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveStartOfLine === "function")
            this.GraphicObj.cursorMoveStartOfLine(AddToSelect);
    },

    remove: function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.remove === "function")
            this.GraphicObj.remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
    },

    hitToWrapPolygonPoint: function(x, y)
    {
        if(this.wrappingPolygon && this.wrappingPolygon.arrPoints.length > 0)
        {
            var radius = this.drawingDocument.GetMMPerDot(AscCommon.TRACK_CIRCLE_RADIUS);
            var arr_point = this.wrappingPolygon.calculatedPoints;
            var point_count = arr_point.length;
            var dx, dy;

            var previous_point;
            for(var i = 0; i < arr_point.length; ++i)
            {
                var cur_point = arr_point[i];
                dx = x - cur_point.x;
                dy = y - cur_point.y;
                if(Math.sqrt(dx*dx + dy*dy) < radius)
                    return {hit: true, hitType: WRAP_HIT_TYPE_POINT, pointNum: i};
            }

            cur_point = arr_point[0];
            previous_point = arr_point[arr_point.length - 1];
            var vx, vy;
            vx = cur_point.x - previous_point.x;
            vy = cur_point.y - previous_point.y;
            if(Math.abs(vx) > 0 || Math.abs(vy) > 0)
            {
                if(HitInLine(this.drawingDocument.CanvasHitContext, x, y, previous_point.x, previous_point.y, cur_point.x, cur_point.y))
                    return {hit: true, hitType: WRAP_HIT_TYPE_SECTION, pointNum1: arr_point.length - 1, pointNum2: 0};
            }

            for(var point_index = 1; point_index < point_count; ++point_index)
            {
                cur_point = arr_point[point_index];
                previous_point = arr_point[point_index - 1];

                vx = cur_point.x - previous_point.x;
                vy = cur_point.y - previous_point.y;

                if(Math.abs(vx) > 0 || Math.abs(vy) > 0)
                {
                    if(HitInLine(this.drawingDocument.CanvasHitContext, x, y, previous_point.x, previous_point.y, cur_point.x, cur_point.y))
                        return {hit: true, hitType: WRAP_HIT_TYPE_SECTION, pointNum1: point_index-1, pointNum2: point_index};
                }
            }
        }
        return {hit: false};
    },

    documentGetAllFontNames: function(AllFonts)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.documentGetAllFontNames === "function")
            this.GraphicObj.documentGetAllFontNames(AllFonts);
    },

    isCurrentElementParagraph: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.isCurrentElementParagraph === "function")
            return this.GraphicObj.isCurrentElementParagraph();
        return false;
    },
    isCurrentElementTable: function()
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.isCurrentElementTable === "function")
            return this.GraphicObj.isCurrentElementTable();
        return false;
    },

    canChangeWrapPolygon: function()
    {
        if(this.Is_Inline() )
            return false;
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.canChangeWrapPolygon === "function")
            return this.GraphicObj.canChangeWrapPolygon();
        return false;
    },

    init: function()
    {
    },

    calculateAfterOpen: function()
    {
    },


    getBounds: function()
    {

        return this.GraphicObj.bounds;
    },



    getWrapContour: function()
    {
        if(isRealObject(this.wrappingPolygon))
        {
            var kw = 1/36000;
            var kh = 1/36000;
            var rel_points = this.wrappingPolygon.relativeArrPoints;
            var ret = [];
            for(var i = 0; i < rel_points.length; ++i)
            {
                ret[i] = {x: rel_points[i].x *kw, y: rel_points[i].y * kh};
            }
            return ret;
        }
        return [];
    },


    getDrawingArrayType: function()
    {
        if(this.Is_Inline())
            return DRAWING_ARRAY_TYPE_INLINE;
        if(this.behindDoc === true && this.wrappingType === WRAPPING_TYPE_NONE)
            return DRAWING_ARRAY_TYPE_BEHIND;
        if(this.wrappingType === WRAPPING_TYPE_NONE)
            return DRAWING_ARRAY_TYPE_BEFORE;
        return DRAWING_ARRAY_TYPE_WRAPPING;
    },


    documentSearch: function(String, search_Common)
    {
        if(isRealObject(this.GraphicObj) && typeof this.GraphicObj.documentSearch === "function")
            this.GraphicObj.documentSearch(String, search_Common)
    },


    setParagraphContextualSpacing: function(Value)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.setParagraphContextualSpacing === "function")
            this.GraphicObj.setParagraphContextualSpacing(Value);
    },

    setParagraphStyle: function(style)
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.setParagraphStyle === "function")
            this.GraphicObj.setParagraphStyle(style);
    },


    setSimplePos: function(use, x, y)
    {
        History.Add(this,  {Type: AscDFH.historyitem_SetSimplePos, oldX: this.SimplePos.X, oldY: this.SimplePos.Y, oldUse: this.SimplePos.Use, newX:x, newY: y, newUse: use});
        this.SimplePos.Use = use;
        this.SimplePos.X = x;
        this.SimplePos.Y = y;
    },

    setExtent: function(extX, extY)
    {
        History.Add(this,  {Type: AscDFH.historyitem_SetExtent, oldW: this.Extent.W, oldH: this.Extent.H, newW: extX, newH: extY});
        this.Extent.W = extX;
        this.Extent.H = extY;
    },

    setEffectExtent: function(L, T, R, B)
    {
        var oEE = this.EffectExtent;
        History.Add(this, {Type: AscDFH.historyitem_Drawing_SetEffectExtent, OldEE: {L: oEE.L, T: oEE.T, R: oEE.R, B: oEE.B}, NewEE:  {L: L, T: T, R: R, B: B}});
        this.EffectExtent.L = L;
        this.EffectExtent.T = T;
        this.EffectExtent.R = R;
        this.EffectExtent.B = B;
    },

    addWrapPolygon: function(wrapPolygon)
    {
        History.Add(this,  {Type: AscDFH.historyitem_SetWrapPolygon, oldW: this.wrappingPolygon, newW: wrapPolygon});
        this.wrappingPolygon = wrapPolygon;
    },

    copy: function()
    {
        var c = new ParaDrawing(this.Extent.W,  this.Extent.H, null, editor.WordControl.m_oLogicDocument.DrawingDocument, null, null);
        c.Set_DrawingType(this.DrawingType);
        if(isRealObject(this.GraphicObj))
        {
            var g = this.GraphicObj.copy(c);
            c.Set_GraphicObject(g);
            g.setParent(c);
        }
        var d = this.Distance;
        c.Set_PositionH( this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value, this.PositionH.Percent);
        c.Set_PositionV( this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value, this.PositionV.Percent);
        c.Set_Distance(d.L, d.T, d.R, d.B);
        c.Set_AllowOverlap(this.AllowOverlap);
        c.Set_WrappingType(this.wrappingType);
        c.Set_BehindDoc(this.behindDoc);
        var EE = this.EffectExtent;
        c.setEffectExtent(EE.L, EE.T, EE.R, EE.B);
        return c;
    },

    OnContentReDraw: function()
    {
        if(this.Parent && this.Parent.Parent)
            this.Parent.Parent.OnContentReDraw(this.PageNum, this.PageNum);
    },

    getBase64Img: function()
    {
        if(isRealObject(this.GraphicObj) && typeof  this.GraphicObj.getBase64Img === "function")
            return this.GraphicObj.getBase64Img();
        return null;
    },

    isPointInObject: function(x, y, pageIndex)
    {
        if(this.pageIndex === pageIndex)
        {
            if(isRealObject(this.GraphicObj))
            {
                var hit = (typeof  this.GraphicObj.hit === "function") ? this.GraphicObj.hit(x, y) : false;
                var hit_to_text = (typeof  this.GraphicObj.hitToTextRect === "function") ? this.GraphicObj.hitToTextRect(x, y) : false;
                return hit || hit_to_text;
            }
        }
        return false;
    },

    Restart_CheckSpelling : function()
    {
        this.GraphicObj && this.GraphicObj.Restart_CheckSpelling && this.GraphicObj.Restart_CheckSpelling();
    },

    Is_MathEquation : function()
    {
        if (undefined !== this.ParaMath && null !== this.ParaMath)
            return true;

        return false;
    },

    Get_ParaMath : function()
    {
        return this.ParaMath;
    },

    Set_ParaMath : function(ParaMath)
    {
        History.Add(this, {Type : AscDFH.historyitem_Drawing_SetParaMath, New : ParaMath, Old : this.ParaMath});
        this.ParaMath = ParaMath;
    },

    Convert_ToMathObject : function()
    {
        // TODO: Вообще здесь нужно запрашивать шрифты, которые использовались в старой формуле,
        //      но пока это только 1 шрифт "Cambria Math".
        var loader = AscCommon.g_font_loader;
        var fontinfo = g_fontApplication.GetFontInfo("Cambria Math");
        var isasync = loader.LoadFont(fontinfo, ConvertEquationToMathCallback, this);
        if (false === isasync)
        {
            this.private_ConvertToMathObject();
        }
    },

    private_ConvertToMathObject : function()
    {
        var Para = this.Get_Paragraph();
        if (undefined === Para || null === Para || !(Para instanceof Paragraph))
            return;

        var ParaContentPos = Para.Get_PosByDrawing(this.Get_Id());
        if (null === ParaContentPos)
            return;

        var Depth = ParaContentPos.Get_Depth();
        var TopElementPos = ParaContentPos.Get(0);
        var BotElementPos = ParaContentPos.Get(Depth);

        var TopElement = Para.Content[TopElementPos];

        // Уменьшаем глубину на 1, чтобы получить позицию родительского класса
        var RunPos = ParaContentPos.Copy();
        RunPos.Decrease_Depth(1);
        var Run = Para.Get_ElementByPos(RunPos);

        if (undefined === TopElement || undefined === TopElement.Content || !(Run instanceof ParaRun))
            return;

        var LogicDocument = editor.WordControl.m_oLogicDocument;
        if (false === LogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_None, {Type : AscCommon.changestype_2_Element_and_Type, Element : Para, CheckType : AscCommon.changestype_Paragraph_Content}))
        {
            LogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_ConvertOldEquation);

            // Коректируем формулу после конвертации
            this.ParaMath.Correct_AfterConvertFromEquation();

            // Сначала удаляем Drawing из рана
            Run.Remove_FromContent(BotElementPos, 1);

            // TODO: Тут возможно лучше взять настройки предыдущего элемента, но пока просто удалим самое неприятное свойство.
            if (true === Run.Is_Empty())
                Run.Set_Position(undefined);

            // Теперь разделяем параграф по заданной позиции и добавляем туда новую формулу.
            var RightElement = TopElement.Split(ParaContentPos, 1);
            Para.Add_ToContent(TopElementPos + 1, RightElement);
            Para.Add_ToContent(TopElementPos + 1, this.ParaMath);
            Para.Correct_Content(TopElementPos, TopElementPos + 2);

            // Устанавливаем курсор в начало правого элемента, полученного после Split
            LogicDocument.Selection_Remove();
            RightElement.Cursor_MoveToStartPos();
            Para.CurPos.ContentPos = TopElementPos + 2;
            Para.Document_SetThisElementCurrent(false);

            LogicDocument.Recalculate();
            LogicDocument.Document_UpdateSelectionState();
            LogicDocument.Document_UpdateInterfaceState();
        }
    },

    Get_RevisionsChangeParagraph : function(SearchEngine)
    {
        if (this.GraphicObj && this.GraphicObj.Get_RevisionsChangeParagraph)
            this.GraphicObj.Get_RevisionsChangeParagraph(SearchEngine);
    },

    Get_ObjectType : function()
    {
        if (this.GraphicObj)
            return this.GraphicObj.getObjectType();

        return AscDFH.historyitem_type_Drawing;
    }
};

function ConvertEquationToMathCallback(ParaDrawing)
{
    ParaDrawing.private_ConvertToMathObject();
}

// Класс GraphicPicture
function GraphicPicture(Img)
{
    this.Img = Img;
}

GraphicPicture.prototype =
{
    Draw : function(Context, X, Y, W, H)
    {
        Context.drawImage( this.Img, X, Y, W, H );
    },

    Copy : function()
    {
        return new GraphicPicture(this.Img);
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
 * @constructor
 * @extends {CRunElementBase}
 */
function ParaFootnoteReference(Footnote)
{
	this.Footnote = Footnote;

	this.Width        = 0;
	this.WidthVisible = 0;
	this.Number       = 1;
}
AscCommon.extendClass(ParaFootnoteReference, CRunElementBase);
ParaFootnoteReference.prototype.Type            = para_FootnoteReference;
ParaFootnoteReference.prototype.Get_Type        = function()
{
	return para_FootnoteReference;
};
ParaFootnoteReference.prototype.Draw            = function(X, Y, Context, PDSE)
{
	Context.SetFontSlot(fontslot_ASCII, vertalign_Koef_Size);
	g_oTextMeasurer.SetFontSlot(fontslot_ASCII, vertalign_Koef_Size);

	// TODO: Пока делаем обычный вариант с типом Decimal
	var _X = X;
	var T  = Numbering_Number_To_String(this.Number);
	for (var nPos = 0; nPos < T.length; ++nPos)
	{
		var Char = T.charAt(nPos);
		Context.FillText(_X, Y, Char);
		_X += g_oTextMeasurer.Measure(Char).Width;
	}

	// TODO: Надо переделать в отдельную функцию отрисовщика
	if (editor && editor.ShowParaMarks)
	{
		if (Context.m_oContext && Context.m_oContext.setLineDash)
			Context.m_oContext.setLineDash([1, 1]);

		var l = X, t = PDSE.LineTop, r = X + this.Get_Width(), b = PDSE.BaseLine;
		Context.drawHorLineExt(c_oAscLineDrawingRule.Top, t, l, r, 0, 0, 0);
		Context.drawVerLine(c_oAscLineDrawingRule.Right, l, t, b, 0);
		Context.drawVerLine(c_oAscLineDrawingRule.Left, r, t, b, 0);
		Context.drawHorLineExt(c_oAscLineDrawingRule.Top, b, l, r, 0, 0, 0);

		if (Context.m_oContext && Context.m_oContext.setLineDash)
			Context.m_oContext.setLineDash([]);
	}
};
ParaFootnoteReference.prototype.Measure         = function(Context, TextPr)
{
	Context.SetFontSlot(fontslot_ASCII, vertalign_Koef_Size);

	// TODO: Пока делаем обычный вариант с типом Decimal
	var X = 0;
	var T = Numbering_Number_To_String(this.Number);
	for (var nPos = 0; nPos < T.length; ++nPos)
	{
		var Char = T.charAt(nPos);
		X += Context.Measure(Char).Width;
	}

	var ResultWidth   = (Math.max((X + TextPr.Spacing), 0) * TEXTWIDTH_DIVIDER) | 0;
	this.Width        = ResultWidth;
	this.WidthVisible = ResultWidth;
};
ParaFootnoteReference.prototype.Copy            = function()
{
	return new ParaFootnoteReference(this.Footnote);
};
ParaFootnoteReference.prototype.Write_ToBinary  = function(Writer)
{
	// Long   : Type
	// String : FootnoteId
	Writer.WriteLong(this.Type);
	Writer.WriteString2(this.Footnote.Get_Id());
};
ParaFootnoteReference.prototype.Read_FromBinary = function(Reader)
{
	// String : FootnoteId
	this.Footnote = g_oTableId.Get_ById(Reader.GetString2());
};
ParaFootnoteReference.prototype.Get_Footnote    = function()
{
	return this.Footnote;
};

/**
 * Класс представляющий номер сноски внутри сноски.
 * @param {CFootEndnote} Footnote - Ссылка на сноску.
 * @constructor
 * @extends {ParaFootnoteReference}
 */
function ParaFootnoteRef(Footnote)
{
	ParaFootnoteRef.superclass.constructor.call(this, Footnote);
}
AscCommon.extendClass(ParaFootnoteRef, ParaFootnoteReference);
ParaFootnoteRef.prototype.Type     = para_FootnoteRef;
ParaFootnoteRef.prototype.Get_Type = function()
{
	return para_FootnoteRef;
};
ParaFootnoteRef.prototype.Copy     = function()
{
	return new ParaFootnoteRef(this.Get_Footnote());
};

/**
 * Класс представляющий собой разделитель (который в основном используется для сносок).
 * @constructor
 * @extends {CRunElementBase}
 */
function ParaSeparator()
{
	ParaSeparator.superclass.constructor.call(this);
	this.LineW = 0;
}
AscCommon.extendClass(ParaSeparator, CRunElementBase);
ParaSeparator.prototype.Type     = para_Separator;
ParaSeparator.prototype.Get_Type = function()
{
	return para_Separator;
};
ParaSeparator.prototype.Draw     = function(X, Y, Context, PDSE)
{
	var l = X, t = PDSE.LineTop, r = X + this.Get_Width(), b = PDSE.BaseLine;

	Context.drawHorLineExt(c_oAscLineDrawingRule.Center, (t + b) / 2, l, r, this.LineW, 0, 0);

	// TODO: Надо переделать в отдельную функцию отрисовщика
	if (editor && editor.ShowParaMarks)
	{
		if (Context.m_oContext && Context.m_oContext.setLineDash)
			Context.m_oContext.setLineDash([1, 1]);

		Context.drawHorLineExt(c_oAscLineDrawingRule.Top, t, l, r, 0, 0, 0);
		Context.drawVerLine(c_oAscLineDrawingRule.Right, l, t, b, 0);
		Context.drawVerLine(c_oAscLineDrawingRule.Left, r, t, b, 0);
		Context.drawHorLineExt(c_oAscLineDrawingRule.Top, b, l, r, 0, 0, 0);

		if (Context.m_oContext && Context.m_oContext.setLineDash)
			Context.m_oContext.setLineDash([]);
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

/**
 * Класс представляющий собой длинный разделитель (который в основном используется для сносок).
 * @constructor
 * @extends {CRunElementBase}
 */
function ParaContinuationSeparator()
{
	ParaContinuationSeparator.superclass.constructor.call(this);
	this.LineW = 0;
}
AscCommon.extendClass(ParaContinuationSeparator, CRunElementBase);
ParaContinuationSeparator.prototype.Type         = para_ContinuationSeparator;
ParaContinuationSeparator.prototype.Get_Type     = function()
{
	return para_ContinuationSeparator;
};
ParaContinuationSeparator.prototype.Draw         = function(X, Y, Context, PDSE)
{
	var l = X, t = PDSE.LineTop, r = X + this.Get_Width(), b = PDSE.BaseLine;

	Context.drawHorLineExt(c_oAscLineDrawingRule.Center, (t + b) / 2, l, r, this.LineW, 0, 0);

	// TODO: Надо переделать в отдельную функцию отрисовщика
	if (editor && editor.ShowParaMarks)
	{
		if (Context.m_oContext && Context.m_oContext.setLineDash)
			Context.m_oContext.setLineDash([1, 1]);

		Context.drawHorLineExt(c_oAscLineDrawingRule.Top, t, l, r, 0, 0, 0);
		Context.drawVerLine(c_oAscLineDrawingRule.Right, l, t, b, 0);
		Context.drawVerLine(c_oAscLineDrawingRule.Left, r, t, b, 0);
		Context.drawHorLineExt(c_oAscLineDrawingRule.Top, b, l, r, 0, 0, 0);

		if (Context.m_oContext && Context.m_oContext.setLineDash)
			Context.m_oContext.setLineDash([]);
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
ParaContinuationSeparator.prototype.Update_Width = function(PRS)
{
	var oPara    = PRS.Paragraph;
	var nCurPage = PRS.Page;

	oPara.Parent.Update_ContentIndexing();
	var oLimits = oPara.Parent.Get_PageContentStartPos2(oPara.PageNum, oPara.ColumnNum, nCurPage, oPara.Index);

	var nWidth = ((oLimits.XLimit - oLimits.X) * TEXTWIDTH_DIVIDER) | 0;

	this.Width        = nWidth;
	this.WidthVisible = nWidth;
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
	}

	if (null != Element)
		Element.Read_FromBinary(Reader);

	return Element;
}

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].ParaNewLine = ParaNewLine;
window['AscCommonWord'].ParaTextPr = ParaTextPr;
window['AscCommonWord'].ParaDrawing = ParaDrawing;

window['AscCommonWord'].break_Page = break_Page;
window['AscCommonWord'].break_Column = break_Column;
