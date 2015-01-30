"use strict";

/**
 * User: Ilja.Kirillov
 * Date: 19.01.15
 * Time: 12:13
 */

var fieldtype_UNKNOWN    = 0x0000;
var fieldtype_MERGEFIELD = 0x0001;

function ParaField(FieldType, Arguments, Switches)
{
    ParaField.superclass.constructor.call(this);

    this.Id = g_oIdCounter.Get_NewId();

    this.Type    = para_Field;

    this.FieldType = (undefined === FieldType ? fieldtype_UNKNOWN : FieldType);
    this.Arguments = (undefined === Arguments ? []                : Arguments);
    this.Switches  = (undefined === Switches  ? []                : Switches);

    this.TemplateContent = this.Content;

    this.Bounds = {};

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

Asc.extendClass(ParaField, CParagraphContentWithParagraphLikeContent);

ParaField.prototype.Get_Id = function()
{
    return this.Id;
};
ParaField.prototype.Copy = function(Selected)
{
    var NewField = ParaHyperlink.superclass.Copy.apply(this, arguments);
    return NewField;
};
ParaField.prototype.Get_SelectedElementsInfo = function(Info)
{
    Info.Set_Field(this);
    ParaField.superclass.Get_SelectedElementsInfo.apply(this, arguments);
};
ParaField.prototype.Get_Bounds = function()
{
    var aBounds = [];
    for (var Place in this.Bounds)
    {
        aBounds.push(this.Bounds[Place]);
    }

    return aBounds;
};
ParaField.prototype.Add_ToContent = function(Pos, Item, UpdatePosition)
{
    History.Add( this, { Type : historyitem_Field_AddItem, Pos : Pos, EndPos : Pos, Items : [ Item ] } );
    ParaField.superclass.Add_ToContent.apply(this, arguments);
};
ParaField.prototype.Remove_FromContent = function(Pos, Count, UpdatePosition)
{
    // Получим массив удаляемых элементов
    var DeletedItems = this.Content.slice( Pos, Pos + Count );
    History.Add( this, { Type : historyitem_Field_RemoveItem, Pos : Pos, EndPos : Pos + Count - 1, Items : DeletedItems } );

    ParaHyperlink.superclass.Remove_FromContent.apply(this, arguments);
};
ParaField.prototype.Add = function(Item)
{
    switch (Item.Type)
    {
        case para_Run :
        {
            var CurItem = this.Content[this.State.ContentPos];

            switch ( CurItem.Type )
            {
                case para_Run :
                {
                    var NewRun = CurItem.Split2(CurItem.State.ContentPos);

                    this.Internal_Content_Add( CurPos + 1, Item );
                    this.Internal_Content_Add( CurPos + 2, NewRun );
                    this.State.ContentPos = CurPos + 1;
                    break;
                }

                default:
                {
                    this.Content[this.State.ContentPos].Add( Item );
                    break;
                }
            }

            break;
        }

        default :
        {
            this.Content[this.State.ContentPos].Add( Item );
            break;
        }
    }
};
ParaField.prototype.Split = function (ContentPos, Depth)
{
    var NewField = ParaField.superclass.Split.apply(this, arguments);
    return NewField;
};
ParaField.prototype.Recalculate_Range_Spaces = function(PRSA, _CurLine, _CurRange, _CurPage)
{
    var CurLine  = _CurLine - this.StartLine;
    var CurRange = (0 === _CurLine ? _CurRange - this.StartRange : _CurRange);

    if (0 === CurLine && 0 === CurRange && true !== PRSA.RecalcFast)
        this.Bounds = {};

    var X0 = PRSA.X;
    var Y0 = PRSA.Y0;
    var Y1 = PRSA.Y1;

    ParaField.superclass.Recalculate_Range_Spaces.apply(this, arguments);

    var X1 = PRSA.X;
    this.Bounds[((CurLine << 16) & 0xFFFF0000) | (CurRange & 0x0000FFFF)] = {X0 : X0, X1 : X1, Y0: Y0, Y1 : Y1, PageIndex : _CurPage + PRSA.Paragraph.Get_StartPage_Absolute()};
};
//----------------------------------------------------------------------------------------------------------------------
// Работа с данными поля
//----------------------------------------------------------------------------------------------------------------------
ParaField.prototype.Get_Argument = function(Index)
{
    return this.Arguments[Index];
};
ParaField.prototype.Get_FieldType = function()
{
    return this.FieldType;
};
ParaField.prototype.Map_MailMerge = function(Value)
{
    // Пока у нас в Value может быть только текст, в будущем планируется, чтобы могли быть картинки.

    var bHistory = History.Is_On();

    if (bHistory)
        History.TurnOff();

    // Создаем ран и набиваем в него заданный текст.
    var oRun = new ParaRun();

    for (var Index = 0, Count = Value.length; Index < Count; Index++)
    {
        var Char = Value[Index], oText;
        if (0x20 === Char)
            oText = new ParaSpace();
        else
            oText = new ParaText(Value[Index]);

        oRun.Add_ToContent(Index, oText);
    }

    // Подменяем содержимое поля
    this.Content = [];
    this.Content[0] = oRun;

    // В контенте ищем первый ран и копируем его настройки

    if (bHistory)
        History.TurnOn();
};
ParaField.prototype.Restore_Template = function()
{
    // Восстанавливаем содержимое поля.
    this.Content = this.TemplateContent;
};
//----------------------------------------------------------------------------------------------------------------------
// Undo/Redo функции
//----------------------------------------------------------------------------------------------------------------------
ParaField.prototype.Undo = function(Data)
{
    var Type = Data.Type;
    switch(Type)
    {
        case historyitem_Field_AddItem :
        {
            this.Content.splice( Data.Pos, Data.EndPos - Data.Pos + 1 );

            this.protected_UpdateSpellChecking();
            break;
        }

        case historyitem_Field_RemoveItem :
        {
            var Pos = Data.Pos;

            var Array_start = this.Content.slice( 0, Pos );
            var Array_end   = this.Content.slice( Pos );

            this.Content = Array_start.concat( Data.Items, Array_end );

            this.protected_UpdateSpellChecking();
            break;
        }
    }
};
ParaField.prototype.Redo = function(Data)
{
    var Type = Data.Type;
    switch(Type)
    {
        case historyitem_Field_AddItem :
        {
            var Pos = Data.Pos;

            var Array_start = this.Content.slice( 0, Pos );
            var Array_end   = this.Content.slice( Pos );

            this.Content = Array_start.concat( Data.Items, Array_end );

            this.protected_UpdateSpellChecking();
            break;
        }

        case historyitem_Field_RemoveItem :
        {
            this.Content.splice( Data.Pos, Data.EndPos - Data.Pos + 1 );

            this.protected_UpdateSpellChecking();
            break;
        }
    }
};
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
ParaField.prototype.Save_Changes = function(Data, Writer)
{
    // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
    // Long : тип класса
    // Long : тип изменений

    Writer.WriteLong(historyitem_type_Field);

    var Type = Data.Type;

    // Пишем тип
    Writer.WriteLong( Type );

    switch(Type)
    {
        case historyitem_Field_AddItem :
        {
            // Long     : Количество элементов
            // Array of :
            //  {
            //    Long     : Позиция
            //    Variable : Id элемента
            //  }

            var bArray = Data.UseArray;
            var Count  = Data.Items.length;

            Writer.WriteLong( Count );

            for ( var Index = 0; Index < Count; Index++ )
            {
                if ( true === bArray )
                    Writer.WriteLong( Data.PosArray[Index] );
                else
                    Writer.WriteLong( Data.Pos + Index );

                Writer.WriteString2( Data.Items[Index].Get_Id() );
            }

            break;
        }

        case historyitem_Field_RemoveItem :
        {
            // Long          : Количество удаляемых элементов
            // Array of Long : позиции удаляемых элементов

            var bArray = Data.UseArray;
            var Count  = Data.Items.length;

            var StartPos = Writer.GetCurPosition();
            Writer.Skip(4);
            var RealCount = Count;

            for ( var Index = 0; Index < Count; Index++ )
            {
                if ( true === bArray )
                {
                    if ( false === Data.PosArray[Index] )
                        RealCount--;
                    else
                        Writer.WriteLong( Data.PosArray[Index] );
                }
                else
                    Writer.WriteLong( Data.Pos );
            }

            var EndPos = Writer.GetCurPosition();
            Writer.Seek( StartPos );
            Writer.WriteLong( RealCount );
            Writer.Seek( EndPos );

            break;
        }
    }
};
ParaField.prototype.Load_Changes = function(Reader)
{
    // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
    // Long : тип класса
    // Long : тип изменений

    var ClassType = Reader.GetLong();
    if ( historyitem_type_Field != ClassType )
        return;

    var Type = Reader.GetLong();

    switch ( Type )
    {
        case historyitem_Field_AddItem :
        {
            // Long     : Количество элементов
            // Array of :
            //  {
            //    Long     : Позиция
            //    Variable : Id Элемента
            //  }

            var Count = Reader.GetLong();

            for ( var Index = 0; Index < Count; Index++ )
            {
                var Pos     = this.m_oContentChanges.Check( contentchanges_Add, Reader.GetLong() );
                var Element = g_oTableId.Get_ById( Reader.GetString2() );

                if ( null != Element )
                {
                    this.Content.splice( Pos, 0, Element );
                }
            }

            this.protected_UpdateSpellChecking();
            break;
        }

        case historyitem_Field_RemoveItem:
        {
            // Long          : Количество удаляемых элементов
            // Array of Long : позиции удаляемых элементов

            var Count = Reader.GetLong();

            for ( var Index = 0; Index < Count; Index++ )
            {
                var ChangesPos = this.m_oContentChanges.Check( contentchanges_Remove, Reader.GetLong() );

                // действие совпало, не делаем его
                if ( false === ChangesPos )
                    continue;

                this.Content.splice( ChangesPos, 1 );
            }

            this.protected_UpdateSpellChecking();
            break;
        }
    }
};
ParaField.prototype.Write_ToBinary2 = function(Writer)
{
    Writer.WriteLong(historyitem_type_Field);

    // String : Id
    // Long   : Количество элементов
    // Array of Strings : массив с Id элементов

    Writer.WriteString2( this.Id );


    var Count = this.Content.length;
    Writer.WriteLong( Count );

    for ( var Index = 0; Index < Count; Index++ )
    {
        Writer.WriteString2( this.Content[Index].Get_Id() );
    }
};
ParaField.prototype.Read_FromBinary2 = function(Reader)
{
    // String : Id
    // Long   : Количество элементов
    // Array of Strings : массив с Id элементов

    this.Id      = Reader.GetString2();

    var Count = Reader.GetLong();
    this.Content = [];

    for ( var Index = 0; Index < Count; Index++ )
    {
        var Element = g_oTableId.Get_ById( Reader.GetString2() );
        if ( null !== Element )
            this.Content.push( Element );
    }
};
