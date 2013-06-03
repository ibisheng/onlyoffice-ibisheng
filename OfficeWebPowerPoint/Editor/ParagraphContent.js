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

var para_Unknown                   =     -1; //
var para_Empty                     = 0x0000; // Пустой элемент (таким элементом должен заканчиваться каждый параграф)
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
var para_PresentationNumbering     = 0x0025;// Элемент, обозначающий нумерацию для списков в презентациях

var break_Line = 0x01;
var break_Page = 0x02;

var nbsp_string = String.fromCharCode( 0x00A0 );
var   sp_string = String.fromCharCode( 0x0032 );

var g_aPunctuation =
[
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0
];

// Класс ParaText
function ParaText(value)
{
    this.Value = value;
    this.Type  = para_Text;

    this.SpaceAfter = false;
    if ( "-" === this.Value )
        this.SpaceAfter = true;

    this.createDuplicate = function()
    {
        var d = new ParaText(this.Value);
        d.SpaceAfter = this.SpaceAfter;
        return d;
    }
}
ParaText.prototype =
{
    Draw : function(X,Y,Context, Height)
    {
        try
        {
            if(Context.IsNoSupportTextDraw !== true)
            {
                if ( true === this.Is_NBSP() && editor.ShowParaMarks )
                    Context.FillText( X, Y, String.fromCharCode( 0x00B0 ) );
                else
                    Context.FillText( X, Y, this.Value );
            }
            else
            {
                Context.rect(X, Y, this.Width, Height);
            }
        }
        catch(e)
        {

        }
    },

    Measure : function(Context)
    {
        try
        {
            var Temp = Context.Measure( this.Value );
            this.Width        = Temp.Width;
            this.Height       = Temp.Height;
            this.WidthVisible = Temp.Width;
        }
        catch(e)
        {
            this.Width        = 0;
            this.Height       = 0;
            this.WidthVisible = 0;
        }
        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return true;
    },

    Is_NBSP : function()
    {
        return (this.Value === nbsp_string ? true : false);
    },

    Is_Punctuation : function()
    {
        var CharCode = this.Value.charCodeAt(0);
        if ( 1 === this.Value.length && 1 === g_aPunctuation[this.Value.charCodeAt(0)] )
            return true;

        return false;
    },

    Write_ToBinary : function(Writer)
    {
        // Long : Type
        // Long : Value
        // Bool : SpaceAfter

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Value );
        Writer.WriteBool( this.SpaceAfter );
    },

    Read_FromBinary : function(Reader)
    {
        this.Value      = Reader.GetString2();
        this.SpaceAfter = Reader.GetBool();
    }
};

// Класс ParaSpace
function ParaSpace(Count)
{
    if ( "number" != typeof(Count) )
        this.Value = 1;
    else
        this.Value = Count;

    this.Type = para_Space;
    this.createDuplicate = function()
    {
        return new ParaSpace(this.Value);
    }
}
ParaSpace.prototype =
{
    Draw : function(X,Y, Context, Height)
    {

        var sString = "";
        if ( 1 == this.Value )
            sString = String.fromCharCode( 0x00B7 );
        else
        {
            for ( var Index = 0; Index < this.Value; Index++ )
            {
                sString += String.fromCharCode( 0x00B7 );
            }
        }

        if(Context.IsNoSupportTextDraw !== true)
        {
            try
            {
                if ( editor.ShowParaMarks )
                    Context.FillText( X, Y, sString );
            }
            catch(e)
            {

            }
        }
        else
        {
            Context.rect(X, Y, this.Width, Height);
        }

    },

    Measure : function(Context)
    {
        var sString = "";
        if ( 1 == this.Value )
            sString = " ";
        else
        {
            for ( var Index = 0; Index < this.Value; Index++ )
            {
                sString += " ";
            }
        }

        try
        {
            var Temp = Context.Measure( sString );
            this.Width        = Temp.Width;
            this.Height       = Temp.Height;
            this.WidthVisible = Temp.Width;
        }
        catch(e)
        {
            this.Width        = 0;
            this.Height       = 0;
            this.WidthVisible = 0;
        }

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return true;
    },

    Write_ToBinary : function(Writer)
    {
        // Long : Type
        // Long : Value

        Writer.WriteLong( this.Type );
        Writer.WriteLong( this.Value );
    },

    Read_FromBinary : function(Reader)
    {
        this.Value = Reader.GetLong();
    }
};

// Класс ParaTextPr
function ParaTextPr(Props)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Type   = para_TextPr;
    this.Value  = new CTextPr();
    this.Parent = null;

    if ( Props !== null && "object" === typeof Props )
    {
        this.Value.Set_FromObject(Props)
    }
    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );

    this.createDuplicate = function()
    {
        return new ParaTextPr(this.Value);
    }
}
ParaTextPr.prototype =
{
    Draw : function()//(X,Y,Context)
    {
        // Ничего не делаем
    },

    Measure : function()//(Context)
    {
        this.Width  = 0;
        this.Height = 0;
        this.WidthVisible = 0;

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return true;
    },

    Copy : function()
    {
        return new ParaTextPr( this.Value );
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

        if ( undefined != TextPr.Color )
            this.Set_Color( TextPr.Color );

        if ( undefined != TextPr.VertAlign )
            this.Set_VertAlign( TextPr.VertAlign );

        if ( undefined != TextPr.HighLight )
            this.Set_HighLight( TextPr.HighLight );

        if ( undefined != TextPr.RStyle )
            this.Set_RStyle( TextPr.RStyle );

        if ( undefined != TextPr.unifill )
            this.Set_Unifill( TextPr.unifill );
    },

    Set_VertAlign : function(Value)
    {
        var OldValue = ( undefined != this.Value.VertAlign ? this.Value.VertAlign : undefined );

        if ( undefined != Value )
            this.Value.VertAlign = Value;
        else
            this.Value.VertAlign = undefined;

        History.Add( this, { Type : historyitem_TextPr_VertAlign, New : Value, Old : OldValue } );
    },

    Set_Prop : function(Prop, Value)
    {
        var OldValue = ( undefined != this.Value[Prop] ? this.Value[Prop] : undefined );

        this.Value[Prop] = Value;

        History.Add( this, { Type : historyitem_TextPr_Change, Prop : Prop, New : Value, Old : OldValue } );
    },

    Set_Unifill : function(unifill)
    {
        var oldUnifill = this.Value.unifill;
        var newUnifill = unifill;
        this.Value.unifill = unifill;
        History.Add( this, { Type : historyitem_TextPr_Unifill, New : newUnifill, Old : oldUnifill } );

    },

    Delete_Prop : function(Prop)
    {
        if ( undefined === this.Value[Prop] )
            return;

        var OldValue = this.Value[Prop];

        this.Value[Prop] = undefined;

        History.Add( this, { Type : historyitem_TextPr_Change, Prop : Prop, New : null, Old : OldValue } );
    },

    Set_Bold : function(Value)
    {
        var OldValue = ( undefined != this.Value.Bold ? this.Value.Bold : undefined );

        if ( undefined != Value )
            this.Value.Bold = Value;
        else
            this.Value.Bold = undefined;

        History.Add( this, { Type : historyitem_TextPr_Bold, New : Value, Old : OldValue } );
    },

    Set_Italic : function(Value)
    {
        var OldValue = ( undefined != this.Value.Italic ? this.Value.Italic : undefined );

        if ( undefined != Value )
            this.Value.Italic = Value;
        else
            this.Value.Italic = undefined;

        History.Add( this, { Type : historyitem_TextPr_Italic, New : Value, Old : OldValue } );
    },

    Set_Strikeout : function(Value)
    {
        var OldValue = ( undefined != this.Value.Strikeout ? this.Value.Strikeout : undefined );

        if ( undefined != Value )
            this.Value.Strikeout = Value;
        else
            this.Value.Strikeout = undefined;

        History.Add( this, { Type : historyitem_TextPr_Strikeout, New : Value, Old : OldValue } );
    },

    Set_Underline : function(Value)
    {
        var OldValue = ( undefined != this.Value.Underline ? this.Value.Underline : undefined );

        if ( undefined != Value )
            this.Value.Underline = Value;
        else
            this.Value.Underline = undefined;

        History.Add( this, { Type : historyitem_TextPr_Underline, New : Value, Old : OldValue } );
    },


    Set_FontFamily : function(Value)
    {
        var OldValue = ( undefined != this.Value.FontFamily ? this.Value.FontFamily : undefined );

        if ( undefined != Value )
            this.Value.FontFamily = Value;
        else
            this.Value.FontFamily = undefined;

        History.Add( this, { Type : historyitem_TextPr_FontFamily, New : Value, Old : OldValue } );
    },

    Set_FontSize : function(Value)
    {
        var OldValue = ( undefined != this.Value.FontSize ? this.Value.FontSize : undefined );
        if ( undefined != Value )
            this.Value.FontSize = Value;
        else
            this.Value.FontSize = undefined;

        History.Add( this, { Type : historyitem_TextPr_FontSize, New : Value, Old : OldValue } );
    },

    Set_Color : function(Value)
    {
        var OldValue = ( undefined != this.Value.Color ? this.Value.Color : undefined );

        if ( undefined != Value )
            this.Value.Color = Value;
        else
            this.Value.Color = undefined;

        History.Add( this, { Type : historyitem_TextPr_Color, New : Value, Old : OldValue } );
    },

    Set_HighLight : function(Value)
    {
        var OldValue = ( undefined != this.Value.HighLight ? this.Value.HighLight : undefined );

        if ( undefined != Value )
            this.Value.HighLight = Value;
        else
            this.Value.HighLight = undefined;

        History.Add( this, { Type : historyitem_TextPr_HighLight, New : Value, Old : OldValue } );
    },

    Set_RStyle : function(Value)
    {
        var OldValue = ( undefined != this.Value.RStyle ? this.Value.RStyle : undefined );

        if ( undefined != Value )
            this.Value.RStyle = Value;
        else
            this.Value.RStyle = undefined;

        History.Add( this, { Type : historyitem_TextPr_RStyle, New : Value, Old : OldValue } );
    },

//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_TextPr_Unifill:
            {
                if ( undefined != Data.Old )
                    this.Value.unifill = Data.Old;
                else
                    this.Value.unifill = undefined;
                break;
            }
            case historyitem_TextPr_Change:
            {

                if ( undefined != Data.Old )
                    this.Value[Data.Prop] = Data.Old;
                else
                    this.Value[Data.Prop] = undefined;

                break;
            }

            case historyitem_TextPr_Bold:
            {
                if ( undefined != Data.Old )
                    this.Value.Bold = Data.Old;
                else
                    this.Value.Bold = undefined;

                break;
            }

            case historyitem_TextPr_Italic:
            {
                if ( undefined != Data.Old )
                    this.Value.Italic = Data.Old;
                else
                    this.Value.Italic = undefined;

                break;
            }

            case historyitem_TextPr_Strikeout:
            {
                if ( undefined != Data.Old )
                    this.Value.Strikeout = Data.Old;
                else
                    this.Value.Strikeout = undefined;

                break;
            }

            case historyitem_TextPr_Underline:
            {
                if ( undefined != Data.Old )
                    this.Value.Underline = Data.Old;
                else
                    this.Value.Underline = undefined;

                break;
            }

            case historyitem_TextPr_FontFamily:
            {
                if ( undefined != Data.Old )
                    this.Value.FontFamily = Data.Old;
                else
                    this.Value.FontFamily = undefined;

                break;
            }

            case historyitem_TextPr_FontSize:
            {
                if ( undefined != Data.Old )
                    this.Value.FontSize = Data.Old;
                else
                    this.Value.FontSize = undefined;

                break;
            }

            case historyitem_TextPr_Color:
            {
                if ( undefined != Data.Old )
                    this.Value.Color = Data.Old;
                else
                    this.Value.Color = undefined;

                break;
            }

            case historyitem_TextPr_VertAlign:
            {
                if ( undefined != Data.Old )
                    this.Value.VertAlign = Data.Old;
                else
                    this.Value.VertAlign = undefined;

                break;
            }

            case historyitem_TextPr_HighLight:
            {
                if ( undefined != Data.Old )
                    this.Value.HighLight = Data.Old;
                else
                    this.Value.HighLight = undefined;

                break;
            }

            case historyitem_TextPr_RStyle:
            {
                if ( undefined != Data.Old )
                    this.Value.RStyle = Data.Old;
                else
                    this.Value.RStyle = undefined;

                break;
            }

        }

        History.RecalcData_Add( this.Get_ParentObject_or_DocumentPos() );
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_TextPr_Unifill:
            {
                if ( undefined != Data.New )
                    this.Value.unifill = Data.New;
                else
                    this.Value.unifill = undefined;
                break;
            }
            case historyitem_TextPr_Change:
            {
                if ( null != Data.New )
                    this.Value[Data.Prop] = Data.New;
                else
                    delete this.Value[Data.Prop];

                break;
            }

            case historyitem_TextPr_Bold:
            {
                if ( undefined != Data.New )
                    this.Value.Bold = Data.New;
                else
                    this.Value.Bold = undefined;

                break;
            }

            case historyitem_TextPr_Italic:
            {
                if ( undefined != Data.New )
                    this.Value.Italic = Data.New;
                else
                    this.Value.Italic = undefined;

                break;
            }

            case historyitem_TextPr_Strikeout:
            {
                if ( undefined != Data.New )
                    this.Value.Strikeout = Data.New;
                else
                    this.Value.Strikeout = undefined;

                break;
            }

            case historyitem_TextPr_Underline:
            {
                if ( undefined != Data.New )
                    this.Value.Underline = Data.New;
                else
                    this.Value.Underline = undefined;

                break;
            }

            case historyitem_TextPr_FontFamily:
            {
                if ( undefined != Data.New )
                    this.Value.FontFamily = Data.New;
                else
                    this.Value.FontFamily = undefined;

                break;
            }

            case historyitem_TextPr_FontSize:
            {
                if ( undefined != Data.New )
                    this.Value.FontSize = Data.New;
                else
                    this.Value.FontSize = undefined;

                break;
            }

            case historyitem_TextPr_Color:
            {
                if ( undefined != Data.New )
                    this.Value.Color = Data.New;
                else
                    this.Value.Color = undefined;

                break;
            }

            case historyitem_TextPr_VertAlign:
            {
                if ( undefined != Data.New )
                    this.Value.VertAlign = Data.New;
                else
                    this.Value.VertAlign = undefined;

                break;
            }

            case historyitem_TextPr_HighLight:
            {
                if ( undefined != Data.New )
                    this.Value.HighLight = Data.New;
                else
                    this.Value.HighLight = undefined;

                break;
            }

            case historyitem_TextPr_RStyle:
            {
                if ( undefined != Data.New )
                    this.Value.RStyle = Data.New;
                else
                    this.Value.RStyle = undefined;

                break;
            }
        }

        History.RecalcData_Add( this.Get_ParentObject_or_DocumentPos() );
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        if ( null != this.Parent )
            return this.Parent.Get_ParentObject_or_DocumentPos();
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
        Writer.WriteLong( historyitem_type_TextPr );

        // Long   : Type
        // String : Id
        // Long   : Value

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
        Styles_Write_TextPr_ToBinary( this.Value, Writer );
    },

    Read_FromBinary2 : function(Reader)
    {
        this.Type = Reader.GetLong();
        this.Id   = Reader.GetString2();

        this.Value = new Object();
        Styles_Read_TextPr_FromBinary( this.Value, Reader );
    },

    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_TextPr );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_TextPr_Change:
            {
                // Variable : TextPr
                Styles_Write_TextPr_ToBinary( Data.New, Writer );

                break;
            }

            case historyitem_TextPr_FontSize:
            {
                // Bool   : null?
                // Double : FontSize

                if ( null != Data.New )
                {
                    Writer.WriteBool(false);
                    Writer.WriteDouble( Data.New );
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case historyitem_TextPr_Color:
            {
                // Bool : null?
                // Byte : Color.r
                // Byte : Color.g
                // Byte : Color.b

                if ( null != Data.New )
                {
                    Writer.WriteBool(false);
                    Writer.WriteByte(Data.New.r);
                    Writer.WriteByte(Data.New.g);
                    Writer.WriteByte(Data.New.b);
                }
                else
                    Writer.WriteBool(true);

                break;
            }

            case historyitem_TextPr_Underline:
            {
                // Bool   : null?
                // Bool   : Underline

                if ( null != Data.New )
                {
                    Writer.WriteBool(false);
                    Writer.WriteBool(Data.New);
                }
                else
                    Writer.WriteBool(true);

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
        if ( historyitem_type_TextPr != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_TextPr_Change:
            {
                // Variable : TextPr
                this.Value = new Object();
                Styles_Read_TextPr_FromBinary( this.Value, Reader );

                break;
            }

            case historyitem_TextPr_FontSize:
            {
                // Bool   : null?
                // Double : FontSize

                var bNull = Reader.GetBool();

                if ( true != bNull )
                    this.Value.FontSize = Reader.GetDouble();
                else
                    delete this.Value.FontSize;

                break;
            }

            case historyitem_TextPr_Color:
            {
                // Bool : null?
                // Byte : Color.r
                // Byte : Color.g
                // Byte : Color.b

                var bNull = Reader.GetBool();
                if ( true != bNull )
                {
                    this.Value.Color = new Object();
                    this.Value.Color.r = Reader.GetByte();
                    this.Value.Color.g = Reader.GetByte();
                    this.Value.Color.b = Reader.GetByte();
                }
                else
                    delete this.Value.Color;

                break;
            }

            case historyitem_TextPr_Underline:
            {
                // Bool   : null?
                // Bool   : Underline

                var bNull = Reader.GetBool();
                if ( true != bNull )
                    this.Value.Underline = Reader.GetBool();
                else
                    delete this.Value.Underline;

                break;
            }
        }
    }
};

// Класс окончание параграфа ParaEnd
function ParaEnd()
{
    this.Type = para_End;
    this.createDuplicate = function()
    {
        return new ParaEnd();
    }
}

ParaEnd.prototype =
{
    Draw : function(X,Y,Context, bEndCell, Height)
    {
        if(Context.IsNoSupportTextDraw !== true)
        {
            if ( editor.ShowParaMarks )
            {

                if ( true === bEndCell )
                    Context.FillText( X, Y, String.fromCharCode( 0x00A4 ) );
                else
                    Context.FillText( X, Y, String.fromCharCode( 0x00B6 ) );
            }
        }
        else
        {
            Context.rect( X, Y, this.WidthVisible, Height);
        }
    },

    Measure : function(Context, bEndCell)
    {
        this.Width  = 0;
        this.Height = 0;

        if ( true === bEndCell )
            this.WidthVisible = Context.Measure( String.fromCharCode( 0x00A4 ) ).Width;
        else
            this.WidthVisible = Context.Measure( String.fromCharCode( 0x00B6 ) ).Width;

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return true;
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

// Класс ParaNewLine
function ParaNewLine(BreakType)
{
    this.Type = para_NewLine;
    this.BreakType = BreakType;

    this.Flags = new Object(); // специальные флаги для разных break

    if ( break_Page === this.BreakType )
        this.Flags.NewLine = true;

    this.createDuplicate = function()
    {
        var d = new ParaNewLine(this.BreakType);
        d.Flags = clone(this.Flags);
        return d;
    }
}

ParaNewLine.prototype =
{
    Draw : function(X,Y,Context, Height)
    {
        if(Context.IsNoSupportTextDraw !== true)
        {
            if ( editor.ShowParaMarks )
            {

                switch( this.BreakType )
                {
                    case break_Line:
                    {
                        var oldFont = Context.GetFont();
                        Context.SetFont( {FontFamily: { Name : "Wingdings 3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
                        Context.FillText( X, Y, String.fromCharCode( 0x0038/*0x21B5*/ ) );
                        Context.SetFont( oldFont );
                        break;
                    }
                    case break_Page:
                    {
                        var PageBreak_String = "";
                        for ( var Index = 0; Index < 41; Index++ )
                        {
                            if ( 20 != Index )
                                PageBreak_String += String.fromCharCode("0x00B7");
                            else
                                PageBreak_String += "PageBreak";
                        }

                        var oldFont = Context.GetFont();

                        var OldColor = Common_CopyObj( Context.m_oBrush.Color1 );
                        Context.b_color1( 0, 0 , 0, 255);

                        g_oTextMeasurer.SetFont( {FontFamily: { Name : "Arial", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
                        Context.SetFont( {FontFamily: { Name : "Arial", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
                        for ( var Index = 0; Index < PageBreak_String.length; Index++ )
                        {
                            Context.FillText( X, Y, PageBreak_String[Index] );
                            X += g_oTextMeasurer.Measure( PageBreak_String[Index] ).Width;
                        }
                        Context.SetFont( oldFont );
                        Context.b_color1( OldColor.R, OldColor.G, OldColor.B, OldColor.A);
                        g_oTextMeasurer.SetFont( oldFont );
                        break;
                    }
                }
            }
        }
        else
        {
            Context.rect(X, Y, this.WidthVisible, Height);
        }

    },

    Measure : function(Context)
    {
        switch( this.BreakType )
        {
            case break_Line:
            {
                this.Width  = 0;
                this.Height = 0;

                var oldFont = Context.GetFont();
                Context.SetFont( {FontFamily: { Name : "Wingdings 3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
                var Temp = Context.Measure( String.fromCharCode( 0x0038 ) );
                Context.SetFont( oldFont );

                // Почему-то в шрифте Wingding 3 символ 0x0038 имеет неправильную ширину
                this.WidthVisible = Temp.Width * 1.7;

                break;
            }
            case break_Page:
            {
                this.Width        = 0;
                this.Height       = 0;

                var PageBreak_String = "";
                for ( var Index = 0; Index < 41; Index++ )
                {
                    if ( 20 != Index )
                        PageBreak_String += String.fromCharCode("0x00B7");
                    else
                        PageBreak_String += "PageBreak";
                }

                var oldFont = g_oTextMeasurer.GetFont();
                g_oTextMeasurer.SetFont( {FontFamily: { Name : "Arial", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
                var W = 0;
                for ( var Index = 0; Index < PageBreak_String.length; Index++ )
                    W += g_oTextMeasurer.Measure( PageBreak_String[Index] ).Width;
                g_oTextMeasurer.SetFont( oldFont );


                this.WidthVisible = W;
                break;
            }
        }

        return { Width : this.Width, Height : this.Height , WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return true;
    },

    // Функция проверяет особый случай, когда у нас PageBreak, после которого в параграфе ничего не идет
    Is_NewLine : function()
    {
        if ( break_Line === this.BreakType || ( break_Page === this.BreakType && true === this.Flags.NewLine ) )
            return true;

        return false;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // Long   : BreakType
        // Optional :
        // Long   : Flags (breakPage)
        Writer.WriteLong( this.Type );
        Writer.WriteLong( this.BreakType );

        if ( break_Page === this.BreakType )
        {
            Writer.WriteBool( this.Flags.NewLine );
        }
    },

    Read_FromBinary : function(Reader)
    {
        this.BreakType = Reader.GetLong();

        if ( break_Page === this.BreakType )
            this.Flags = { NewLine : Reader.GetBool() };
    }
};

// Класс ParaNewLineRendered
function ParaNewLineRendered()
{
    this.Type = para_NewLineRendered;
    this.createDuplicate = function()
    {
        return new ParaNewLineRendered();
    }

}

ParaNewLineRendered.prototype =
{
    Draw : function()//(X,Y,Context)
    {
        // Ничего не делаем
    },

    Measure : function()//(Context)
    {
        this.Width  = 0;
        this.Height = 0;
        this.WidthVisible = 0;

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return false;
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

// Класс ParaInlineBreak
function ParaInlineBreak()
{
    this.Type = para_InlineBreak;
    this.createDuplicate = function()
    {
        return new ParaInlineBreak();
    }
}

ParaInlineBreak.prototype =
{
    Draw : function()
    {
        // Ничего не делаем
    },

    Measure : function()
    {
        this.Width  = 0;
        this.Height = 0;
        this.WidthVisible = 0;

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return false;
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

// Класс ParaPageBreakRenderer
function ParaPageBreakRenderer()
{
    this.Type = para_PageBreakRendered;
    this.createDuplicate = function()
    {
        return new ParaPageBreakRenderer();
    }
}

ParaPageBreakRenderer.prototype =
{
    Draw : function()
    {

    },

    Measure : function()
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return false;
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

// Класс ParaEmpty
function ParaEmpty(bDelete)
{
    this.Type = para_Empty;

    this.NeedToDelete = false; // Нужно ли удалить данный элемент при пересчете параграфа

    if ( "undefined" != typeof(bDelete) && null != bDelete )
        this.NeedToDelete = bDelete;

    this.createDuplicate = function()
    {
        return new ParaEmpty(this.NeedToDelete);
    }
}

ParaEmpty.prototype =
{
    Draw : function()
    {

    },

    Measure : function()
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return true;
    },

    Check_Delete : function()
    {
        return this.NeedToDelete;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // Bool   : NeedToDelete
        Writer.WriteLong( this.Type );
        Writer.WriteBool( this.NeedToDelete );
    },

    Read_FromBinary : function(Reader)
    {
        this.NeedToDelete = Reader.GetBool();
    }
};


// Класс ParaNumbering
function ParaNumbering(NumPr)
{
    this.Type = para_Numbering;

    this.NumPr =
    {
        NumId : 0,
        Lvl   : 0
    };

    if ( NumPr && NumPr.NumId )
        this.NumPr.NumId = NumPr.NumId;

    if ( NumPr && NumPr.Lvl )
        this.NumPr.Lvl = NumPr.Lvl;

    this.createDuplicate = function()
    {
        return new ParaNumbering(this.NumPr);
    }
}

ParaNumbering.prototype =
{
    Draw : function(X,Y,Context, Numbering, NumInfo, TextPr)
    {
        Numbering.Draw( this.NumPr.NumId, this.NumPr.Lvl, X, Y, Context, NumInfo, TextPr );
    },

    Measure : function (Context, Numbering, NumInfo, TextPr)
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;
        this.WidthNum     = 0;
        this.WidthSuff    = 0;

        if ( "undefined" === typeof(Numbering) )
            return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };

        var Temp = Numbering.Measure( this.NumPr.NumId, this.NumPr.Lvl, Context, NumInfo, TextPr );
        this.Width        = Temp.Width;
        this.WidthVisible = Temp.Width;
        this.WidthNum     = Temp.Width;
        this.WidthSuff    = 0;
        this.Height       = Temp.Ascent; // Это не вся высота, а только высота над BaseLine

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return true;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // String : NumId
        // Long   : NumLvl
        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.NumPr.NumId );
        Writer.WriteLong( this.NumPr.Lvl );
    },

    Read_FromBinary : function(Reader)
    {
        this.NumPr.NumId = Reader.GetString2();
        this.NumPr.Lvl   = Reader.GetLong();
    }
};

// TODO: Реализовать табы правые, центральные, по точке и с чертой.
var tab_Left   = 0x01;
var tab_Right  = 0x02;
var tab_Center = 0x03;

var tab_Symbol = 0x0022;//0x2192;

// Класс ParaTab
function ParaTab()
{
    this.Type = para_Tab;

    this.TabType = tab_Left;

    this.createDuplicate = function()
    {
        var d = new ParaTab();
        d.TabType = this.TabType;
        return d;
    }
}

ParaTab.prototype =
{
    Draw : function(X,Y,Context, H)
    {
        if(Context.IsNoSupportTextDraw !== true)
        {
            if ( editor.ShowParaMarks )
            {
                var X0 = this.Width / 2 - this.RealWidth / 2;

                var oldFont = Context.GetFont();
                Context.SetFont( {FontFamily: { Name : "Wingdings 3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );

                if ( X0 > 0 )
                    Context.FillText2( X + X0, Y, String.fromCharCode( tab_Symbol ), 0, this.Width );
                else
                    Context.FillText2( X, Y, String.fromCharCode( tab_Symbol ), this.RealWidth - this.Width, this.Width );

                Context.SetFont( oldFont );
            }
        }
        else
        {
            Context.rect(X, Y, this.WidthVisible, H);
        }

    },

    Measure : function (Context)
    {
        var oldFont = Context.GetFont();
        Context.SetFont( {FontFamily: { Name : "Wingdings 3", Index : -1 }, FontSize: 10, Italic: false, Bold : false} );
        this.RealWidth = Context.Measure( String.fromCharCode( tab_Symbol ) ).Width;
        Context.SetFont( oldFont );

        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return true;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // Long   : TabType
        Writer.WriteLong( this.Type );
        Writer.WriteLong( this.TabType );
    },

    Read_FromBinary : function(Reader)
    {
        this.TabType = Reader.GetLong();
    }
};

var drawing_Inline = 0x01;
var drawing_Anchor = 0x02;

// Класс ParaDrawing
function ParaDrawing(W, H, GraphicObj, DrawingDocument, DocumentContent, Parent)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Type = para_Drawing;

    this.Distance =
    {
        T : 0,
        B : 0,
        L : 0,
        R : 0
    };

    this.Lock = new CLock();
    if ( false === g_oIdCounter.m_bLoad )
    {
        this.Lock.Set_Type( locktype_Mine, false );
        CollaborativeEditing.Add_Unlock2( this );
    }


    this.DrawingType = drawing_Inline;
    this.GraphicObj  = GraphicObj;

    this.X = 0;
    this.Y = 0;
    this.W = W;
    this.H = H;
    this.PageNum = 0;

    this.DocumentContent = DocumentContent;
    this.DrawingDocument = DrawingDocument;
    this.Parent          = Parent;

    this.Focused = false;

    this.ImageTrackType = 1;

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
    this.createDuplicate = function()
    {
        return new ParaDrawing(0, 0, this.GraphicObj, this.DrawingDocument, this.DocumentContent, this.Parent);
    }
}

ParaDrawing.prototype =
{
    Draw : function(X,Y,Context)
    {
        // координаты графического объекта должны обновляться через функцию
        // Update_Position, а приходящие здесь координаты мы не учитываем
        this.GraphicObj.Draw( Context, this.X, this.Y, this.W, this.H );
    },

    Measure : function(Context)
    {
        this.Width        = this.W;
        this.Height       = this.H;
        this.WidthVisible = this.W;

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return true;
    },

    //--------------------------------------------
    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Get_Id : function()
    {
        return this.Id;
    },

    Update_Position : function(X,Y, PageNum)
    {
        this.X = X;
        this.Y = Y;
        this.PageNum = PageNum;

        if ( true === this.Focused )
            this.DrawingDocument.StartTrackImage( this, this.X, this.Y, this.W, this.H, this.ImageTrackType, this.PageNum );
    },

    Update_Size : function(W,H)
    {
        History.Add( this, { Type : historyitem_Drawing_Size, New : { W : W, H : H }, Old : { W : this.W, H : this.H } } );
        this.W = W;
        this.H = H;
    },

    Set_Url : function(Img)
    {
        History.Add( this, { Type : historyitem_Drawing_Url, New : Img, Old : this.GraphicObj.Img } );
        this.GraphicObj.Img = Img;
    },

    IsPointIn : function(X, Y, PageIndex)
    {
        if ( X >= this.X && X <= this.X + this.W && Y >= this.Y && Y <= this.Y + this.H && PageIndex === this.Parent.Get_DrawingObject_Page( this.Id ) )
            return true;

        return false;
    },

    Get_DrawingType : function()
    {
        return this.DrawingType;
    },

    // Устанавливаем фокус на данном объекте
    Focus : function()
    {
        this.Focused = true;
        this.DrawingDocument.StartTrackImage( this, this.X, this.Y, this.W, this.H, this.ImageTrackType );
    },

    // Убираем фокус с данного объекта
    Blur : function()
    {
        if ( true === this.Focused )
        {
            this.Focused = false;
            this.DrawingDocument.EndTrack();
        }
    },

    // Интерфейс для треков
    Track_Draw : function(Left, Top, Right, Bottom)
    {
        this.DrawingDocument.m_oTrackObject.DrawImageInTrack( this.GraphicObj.Img, Left, Top, Right, Bottom );
    },

    // Трек закончил работу на странице PageNum, c новыми координатами X, Y, W, H
    Track_End : function(PageNum, X, Y, W, H)
    {
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        if ( W < 0 || H < 0 )
        {
            if ( false === LogicDocument.Document_Is_SelectionLocked(changestype_Image_Properties, { Type : changestype_2_InlineObjectMove, PageNum : PageNum, X : X, Y : Y } ) )
            {
                LogicDocument.Create_NewHistoryPoint();
                this.DocumentContent.InlineObject_Move( this.Id, X, Y, PageNum );
            }
            else
            {
                LogicDocument.Document_UpdateSelectionState();
            }
        }
        else
        {
            // Проверяем, залочено ли данное изображение
            if ( false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Image_Properties) )
            {
                LogicDocument.Create_NewHistoryPoint();
                this.DocumentContent.InlineObject_Resize( this.Id, W, H );
            }
            else
            {
                LogicDocument.Document_UpdateSelectionState();
            }
        }
    },

    Update_CursorType : function(X, Y, PageIndex)
    {
        this.DrawingDocument.SetCursorType( "move", new CMouseMoveData() );

        if ( null != this.Parent )
        {
            var Lock = this.Parent.Lock;
            if ( true === Lock.Is_Locked() )
            {
                var PNum = Math.max( 0, Math.min( PageIndex - this.Parent.PageNum, this.Parent.Pages.length - 1 ) );
                var _X = this.Parent.Pages[PNum].X;
                var _Y = this.Parent.Pages[PNum].Y;

                var MMData = new CMouseMoveData();
                var Coords = this.DrawingDocument.ConvertCoordsToCursorWR( _X, _Y, this.Parent.Get_StartPage_Absolute() + ( PageIndex - this.Parent.PageNum ) );
                MMData.X_abs       = Coords.X - 5;
                MMData.Y_abs       = Coords.Y;
                MMData.Type        = c_oAscMouseMoveDataTypes.LockedObject;
                MMData.UserId      = Lock.Get_UserId();
                MMData.HaveChanges = Lock.Have_Changes();

                editor.sync_MouseMoveCallback( MMData );
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
            case historyitem_Drawing_Size:
            {
                this.W = Data.Old.W;
                this.H = Data.Old.H;

                break;
            }

            case historyitem_Drawing_Url:
            {
                this.GraphicObj.Img = Data.Old;
                break;
            }
        }

        History.RecalcData_Add( this.Get_ParentObject_or_DocumentPos() );
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_Drawing_Size:
            {
                this.W = Data.New.W;
                this.H = Data.New.H;

                break;
            }

            case historyitem_Drawing_Url:
            {
                this.GraphicObj.Img = Data.New;
                break;
            }
        }

        History.RecalcData_Add( this.Get_ParentObject_or_DocumentPos() );
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        return this.Parent.Get_ParentObject_or_DocumentPos();
    },
//-----------------------------------------------------------------------------------
// Функции для совместного редактирования
//-----------------------------------------------------------------------------------
    Document_Is_SelectionLocked : function(CheckType)
    {
    },

    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_Drawing );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_Drawing_Size:
            {
                // Double : W
                // Double : H

                Writer.WriteDouble( Data.New.W );
                Writer.WriteDouble( Data.New.H );

                break;
            }

            case historyitem_Drawing_Url:
            {
                // String : указатель на картинку

                Writer.WriteString2( Data.New );
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
        if ( historyitem_type_Drawing != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_Drawing_Size:
            {
                // Double : W
                // Double : H

                this.W = Reader.GetDouble();
                this.H = Reader.GetDouble();

                break;
            }

            case historyitem_Drawing_Url:
            {
                // String : указатель на картинку

                this.GraphicObj.Img = Reader.GetString2();

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
        Writer.WriteLong( historyitem_type_Drawing );

        // Long   : Type
        // String : Id
        // Byte   : DrawingType
        // Long   : W
        // Long   : H
        // Long   : Distance.T
        // Long   : Distance.B
        // Long   : Distance.L
        // Long   : Distance.R
        // String : Указатель на картинку

        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Id );
        Writer.WriteByte( this.DrawingType );
        Writer.WriteDouble( this.W );
        Writer.WriteDouble( this.H );
        Writer.WriteDouble( this.Distance.T );
        Writer.WriteDouble( this.Distance.B );
        Writer.WriteDouble( this.Distance.L );
        Writer.WriteDouble( this.Distance.R );
        Writer.WriteString2( this.GraphicObj.Img );
    },

    Read_FromBinary2 : function(Reader)
    {
        this.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;

        this.Type        = Reader.GetLong();
        this.Id          = Reader.GetString2();
        this.DrawingType = Reader.GetByte();
        this.W           = Reader.GetDouble();
        this.H           = Reader.GetDouble();
        this.Distance.T  = Reader.GetDouble();
        this.Distance.B  = Reader.GetDouble();
        this.Distance.L  = Reader.GetDouble();
        this.Distance.R  = Reader.GetDouble();
        this.GraphicObj  = new GraphicPicture( Reader.GetString2() );

        CollaborativeEditing.Add_NewImage( this.GraphicObj.Img );
    },

    Load_LinkData : function(LinkData)
    {
    }
};

// Класс GraphicPicture
function GraphicPicture(Img)
{
    this.Img = Img;
    this.createDuplicate = function()
    {
        return new  GraphicPicture(this.Img);
    }
}

GraphicPicture.prototype =
{
    Draw : function(Context, X, Y, W, H)
    {
        Context.drawImage( this.Img, X, Y, W, H );
    }
};

// Класс ParaPageNum
function ParaPageNum()
{
    this.Type = para_PageNum;
    this.createDuplicate = function()
    {
        return new  ParaPageNum();
    }
}

ParaPageNum.prototype =
{
    Draw : function(X,Y,Context, Value, Align)
    {
        // Value - реальное значение, которое должно быть отрисовано.
        // Align - прилегание параграфа, в котором лежит данный номер страницы.

        var sValue = "" + (Value + 1);

        var oldFont = g_oTextMeasurer.GetFont();
        g_oTextMeasurer.SetFont( Context.GetFont() );
        var RealWidth = 0;
        for ( var Index = 0; Index < sValue.length; Index++ )
        {
            var Char = sValue.charAt(Index);
            RealWidth += g_oTextMeasurer.Measure( Char ).Width;
        }

        var _X = X;
        var _Y = Y;

        switch(Align)
        {
            case align_Left:
            {
                _X = X;
                break;
            }
            case align_Right:
            {
                _X = X + this.Width - RealWidth;
                break;
            }
            case align_Center:
            {
                _X = X + (this.Width - RealWidth) / 2;
                break;
            }
        }

        for ( var Index = 0; Index < sValue.length; Index++ )
        {
            var Char = sValue.charAt(Index);
            Context.FillText( _X, _Y, Char );
            _X += g_oTextMeasurer.Measure( Char ).Width;
        }

        g_oTextMeasurer.SetFont( oldFont );
    },

    Measure : function (Context)
    {
        var Width = 0;
        for ( var Index = 0; Index < 10; Index++ )
        {
            var TempW = Context.Measure( "" + Index ).Width;
            if ( Width < TempW )
                Width = TempW;
        }

        // Выделяем место под 4 знака
        Width *= 4;

        this.Width        = Width;
        this.Height       = 0;
        this.WidthVisible = Width;

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return true;
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


// Класс ParaFlowObjectAnchor
function ParaFlowObjectAnchor(FlowObject)
{
    this.Type = para_FlowObjectAnchor;

    this.FlowObject = FlowObject;
    this.createDuplicate = function()
    {
        return new  ParaFlowObjectAnchor(this.FlowObject);
    }
}

ParaFlowObjectAnchor.prototype =
{
    Draw : function(X,Y,Context, Value, Align)
    {
    },

    Measure : function (Context)
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

        return { Width : 0, Height : 0, WidthVisible : 0 };
    },

    Is_RealContent : function()
    {
        return false;
    },

    Set_FlowObject : function(Object)
    {
        this.FlowObject = Object;
    },

    Get_FlowObject : function()
    {
        return this.FlowObject;
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

// Класс начало гиперссылки
function ParaHyperlinkStart()
{
    this.Type = para_HyperlinkStart;

    this.Value = "";

    this.Visited = false;
    this.ToolTip = null;

    this.createDuplicate = function()
    {
        var d =  new  ParaHyperlinkStart();
        d.Value = this.Value;
        d.Visited = this.Visited;
        d.ToolTip = this.ToolTip;
        return d;
    }
}

ParaHyperlinkStart.prototype =
{
    Draw : function(X, Y, Context)
    {

    },

    Measure : function(Context)
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

        return { Width : 0, Height : 0, WidthVisible : 0 };
    },

    Is_RealContent : function()
    {
        return true;
    },

    Set_Visited : function(Value)
    {
        this.Visited = Value;
    },

    Get_Visited : function()
    {
        return this.Visited;
    },

    Set_ToolTip : function(ToolTip)
    {
        this.ToolTip = ToolTip;
    },

    Get_ToolTip : function()
    {
        if ( null === this.ToolTip )
        {
            if ( "string" === typeof(this.Value) )
                return this.Value;
            else
                return "";
        }
        else
            return this.ToolTip;
    },

    Get_Value : function()
    {
        return this.Value;
    },

    Set_Value : function(Value)
    {
        this.Value = Value;
    },

    Copy : function()
    {
        var Hyperlink_new = new ParaHyperlinkStart();

        Hyperlink_new.Value   = this.Value;
        Hyperlink_new.Visited = this.Visited;
        Hyperlink_new.ToolTip = this.ToolTip;

        return Hyperlink_new;
    },

    Write_ToBinary : function(Writer)
    {
        // Long   : Type
        // String : Value
        // String : ToolTip
        Writer.WriteLong( this.Type );
        Writer.WriteString2( this.Value );
        Writer.WriteString2( this.ToolTip == null ? "" : this.ToolTip );
    },

    Read_FromBinary : function(Reader)
    {
        this.Value   = Reader.GetString2();
        this.ToolTip = Reader.GetString2();

        if ( "" == this.ToolTip )
            this.ToolTip = null;
    }
};

// Класс конец гиперссылки
function ParaHyperlinkEnd()
{
    this.Type = para_HyperlinkEnd;
    this.createDuplicate = function()
    {
        return new  ParaHyperlinkEnd();
    }
}

ParaHyperlinkEnd.prototype =
{
    Draw : function(X, Y, Context)
    {

    },

    Measure : function(Context)
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

        return { Width : 0, Height : 0, WidthVisible : 0 };
    },

    Is_RealContent : function()
    {
        return true;
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

// Класс ParaCollaborativeChangesStart
function ParaCollaborativeChangesStart()
{
    this.Type = para_CollaborativeChangesStart;
    this.createDuplicate = function()
    {
        return new  ParaCollaborativeChangesStart();
    }
}

ParaCollaborativeChangesStart.prototype =
{
    Draw : function()
    {

    },

    Measure : function()
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return false;
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

// Класс ParaCollaborativeChangesEnd
function ParaCollaborativeChangesEnd()
{
    this.Type = para_CollaborativeChangesEnd;

    this.createDuplicate = function()
    {
        return new  ParaCollaborativeChangesEnd();
    }
}

ParaCollaborativeChangesEnd.prototype =
{
    Draw : function()
    {
    },

    Measure : function()
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return false;
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

// Класс ParaPresentationNumbering
function ParaPresentationNumbering(Bullet)
{
    this.Type = para_PresentationNumbering;

    // Эти данные заполняются во время пересчета, перед вызовом Measure
    this.Bullet    = Bullet == undefined ? null : Bullet;
    this.BulletNum = null;

    this.createDuplicate = function()
    {
        var _duplicate = new ParaPresentationNumbering();
        if(this.Bullet !== null)
        {
            _duplicate.Bullet = this.Bullet.Copy();
        }
        if(this.BulletNum!==null)
        {
            _duplicate.BulletNum = this.BulletNum;
        }
        return _duplicate;
    };
}

ParaPresentationNumbering.prototype =
{
    Draw : function(X, Y, Context, FirstTextPr, Heght)
    {
        this.Bullet.Draw( X, Y, Context, FirstTextPr, Heght );
    },

    Measure : function (Context, FirstTextPr)
    {
        this.Width        = 0;
        this.Height       = 0;
        this.WidthVisible = 0;

        var Temp = this.Bullet.Measure( Context, FirstTextPr, this.BulletNum );

        this.Width        = Temp.Width;
        this.WidthVisible = Temp.Width;

        return { Width : this.Width, Height : this.Height, WidthVisible : this.WidthVisible };
    },

    Is_RealContent : function()
    {
        return true;
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

function ParagraphContent_Read_FromBinary(Reader)
{
    var ElementType = Reader.GetLong();

    var Element = null;
    switch ( ElementType )
    {
        case para_TextPr            :
        case para_Drawing           :
        {
            var ElementId = Reader.GetString2();
            Element = g_oTableId.Get_ById( ElementId );
            return Element;
        }
        case para_Text              : Element = new ParaText();              break;
        case para_Space             : Element = new ParaSpace();             break;
        case para_End               : Element = new ParaEnd();               break;
        case para_NewLine           : Element = new ParaNewLine();           break;
        case para_NewLineRendered   : Element = new ParaNewLineRendered();   break;
        case para_InlineBreak       : Element = new ParaInlineBreak();       break;
        case para_PageBreakRendered : Element = new ParaPageBreakRenderer(); break;
        case para_Empty             : Element = new ParaEmpty();             break;
        case para_Numbering         : Element = new ParaNumbering();         break;
        case para_Tab               : Element = new ParaTab();               break;
        case para_PageNum           : Element = new ParaPageNum();           break;
        case para_FlowObjectAnchor  : Element = new ParaFlowObjectAnchor();  break;
        case para_HyperlinkStart    : Element = new ParaHyperlinkStart();    break;
        case para_HyperlinkEnd      : Element = new ParaHyperlinkEnd();      break;
        case para_CommentStart      : Element = new ParaCommentStart();      break;
        case para_CommentEnd        : Element = new ParaCommentEnd();        break;
        case para_PresentationNumbering : Element = new ParaPresentationNumbering(); break;
    }

    if ( null != Element )
        Element.Read_FromBinary(Reader);

    return Element;
}





