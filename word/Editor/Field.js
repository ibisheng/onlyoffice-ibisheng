"use strict";

/**
 * User: Ilja.Kirillov
 * Date: 19.01.15
 * Time: 12:13
 */

var fieldtype_UNKNOWN    = 0x0000;
var fieldtype_MERGEFIELD = 0x0001;

/**
 *
 * @param FieldType
 * @param Arguments
 * @param Switches
 * @constructor
 * @extends {CParagraphContentWithParagraphLikeContent}
 */
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
    var NewField = ParaField.superclass.Copy.apply(this, arguments);

    // TODO: Сделать функциями с иторией
    NewField.FieldType = this.FieldType;
    NewField.Arguments = this.Arguments;
    NewField.Switches  = this.Switches;

    if (editor)
        editor.WordControl.m_oLogicDocument.Register_Field(NewField);

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

    ParaField.superclass.Remove_FromContent.apply(this, arguments);
};
ParaField.prototype.Add = function(Item)
{
    switch (Item.Type)
    {
        case para_Run      :
        case para_Hyperlink:
        {
            var TextPr = this.Get_FirstTextPr();
            Item.Select_All();
            Item.Apply_TextPr(TextPr);
            Item.Selection_Remove();

            var CurPos = this.State.ContentPos;
            var CurItem = this.Content[CurPos];
            if (para_Run === CurItem.Type)
            {
                var NewRun = CurItem.Split2(CurItem.State.ContentPos);
                this.Add_ToContent(CurPos + 1, Item);
                this.Add_ToContent(CurPos + 2, NewRun);

                this.State.ContentPos = CurPos + 2;
                this.Content[this.State.ContentPos].Cursor_MoveToStartPos();
            }
            else
                CurItem.Add(Item);

            break;
        }
        case para_Math :
        {
            var ContentPos = new CParagraphContentPos();
            this.Get_ParaContentPos(false, false, ContentPos);
            var CurPos = ContentPos.Get(0);

            // Ран формула делит на части, а в остальные элементы добавляется целиком
            if (para_Run === this.Content[CurPos].Type)
            {
                // Разделяем текущий элемент (возвращается правая часть)
                var NewElement = this.Content[CurPos].Split(ContentPos, 1);

                if (null !== NewElement)
                    this.Add_ToContent(CurPos + 1, NewElement, true);

                var Elem = new ParaMath();
                Elem.Root.Load_FromMenu(Item.Menu, this.Get_Paragraph());
                Elem.Root.Correct_Content(true);
                this.Add_ToContent(CurPos + 1, Elem, true);

                // Перемещаем кусор в конец формулы
                this.State.ContentPos = CurPos + 1;
                this.Content[this.State.ContentPos].Cursor_MoveToEndPos(false);
            }
            else
                this.Content[CurPos].Add(Item);

            break;
        }
        case para_Field:
        {
            // Вместо добавления самого элемента добавляем его содержимое
            var Count = Item.Content.length;

            if (Count > 0)
            {
                var CurPos  = this.State.ContentPos;
                var CurItem = this.Content[CurPos];

                var CurContentPos = new CParagraphContentPos();
                CurItem.Get_ParaContentPos(false, false, CurContentPos);

                var NewItem = CurItem.Split(CurContentPos, 0);
                for (var Index = 0; Index < Count; Index++)
                {
                    this.Add_ToContent(CurPos + Index + 1, Item.Content[Index], false);
                }
                this.Add_ToContent(CurPos + Count + 1, NewItem, false);
                this.State.ContentPos = CurPos + Count;
                this.Content[this.State.ContentPos].Cursor_MoveToEndPos();
            }

            break;
        }
        default :
        {
            this.Content[this.State.ContentPos].Add(Item);
            break;
        }
    }
};
ParaField.prototype.Split = function (ContentPos, Depth)
{
    // Не даем разделять поле
    return null;
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
ParaField.prototype.Draw_HighLights = function(PDSH)
{
    var X0 = PDSH.X;
    var Y0 = PDSH.Y0;
    var Y1 = PDSH.Y1;

    ParaField.superclass.Draw_HighLights.apply(this, arguments);

    var X1 = PDSH.X;

    if (Math.abs(X0 - X1) > 0.001 && true === PDSH.DrawMMFields)
    {
        PDSH.MMFields.Add(Y0, Y1, X0, X1, 0, 0, 0, 0  );
    }
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
ParaField.prototype.Map_MailMerge = function(_Value)
{
    // Пока у нас в Value может быть только текст, в будущем планируется, чтобы могли быть картинки.
    var Value = _Value;
    if (undefined === Value || null === Value)
        Value = "";

    History.TurnOff();

    var oRun = this.private_GetMappedRun(Value);

    // Подменяем содержимое поля
    this.Content = [];
    this.Content[0] = oRun;

    this.Cursor_MoveToStartPos();

    History.TurnOn();
};
ParaField.prototype.Restore_StandardTemplate = function()
{
    // В любом случае сначала восстанавливаем исходное содержимое.
    this.Restore_Template();

    if (fieldtype_MERGEFIELD === this.FieldType && true === CollaborativeEditing.Is_SingleUser() && 1 === this.Arguments.length)
    {
        var oRun = this.private_GetMappedRun("«" + this.Arguments[0] + "»");
        this.Remove_FromContent(0, this.Content.length);
        this.Add_ToContent(0, oRun);
        this.Cursor_MoveToStartPos();

        this.TemplateContent = this.Content;
    }
};
ParaField.prototype.Restore_Template = function()
{
    // Восстанавливаем содержимое поля.
    this.Content = this.TemplateContent;
    this.Cursor_MoveToStartPos();
};
ParaField.prototype.Is_NeedRestoreTemplate = function()
{
    if (1 !== this.TemplateContent.length)
        return true;

    var oRun = this.TemplateContent[0];
    if (fieldtype_MERGEFIELD === this.FieldType)
    {
        var sStandardText = "«" + this.Arguments[0] + "»";

        var oRunText = new CParagraphGetText();
        oRun.Get_Text(oRunText);

        if (sStandardText === oRunText.Text)
            return false;

        return true;
    }

    return false;
};
ParaField.prototype.Replace_MailMerge = function(_Value)
{
    // Пока у нас в Value может быть только текст, в будущем планируется, чтобы могли быть картинки.
    var Value = _Value;
    if (undefined === Value || null === Value)
        Value = "";

    var Paragraph = this.Paragraph;

    if (!Paragraph)
        return false;

    // Получим ран, на который мы подменяем поле
    var oRun = this.private_GetMappedRun(Value);

    // Ищем расположение данного поля в параграфе
    var ParaContentPos = Paragraph.Get_PosByElement(this);

    if (null === ParaContentPos)
        return false;

    var Depth    = ParaContentPos.Get_Depth();
    var FieldPos = ParaContentPos.Get(Depth);

    if (Depth < 0)
        return false;

    ParaContentPos.Decrease_Depth(1);
    var FieldContainer = Paragraph.Get_ElementByPos(ParaContentPos);
    if (!FieldContainer || !FieldContainer.Content || FieldContainer.Content[FieldPos] !== this)
        return false;

    FieldContainer.Remove_FromContent(FieldPos, 1);
    FieldContainer.Add_ToContent(FieldPos, oRun);

    return true;
};
ParaField.prototype.private_GetMappedRun = function(Value)
{
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

    oRun.Set_Pr(this.Get_FirstTextPr());

    return oRun;
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
            this.private_UpdateTrackRevisions();
            break;
        }

        case historyitem_Field_RemoveItem :
        {
            var Pos = Data.Pos;

            var Array_start = this.Content.slice( 0, Pos );
            var Array_end   = this.Content.slice( Pos );

            this.Content = Array_start.concat( Data.Items, Array_end );
            this.protected_UpdateSpellChecking();
            this.private_UpdateTrackRevisions();
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
            this.private_UpdateTrackRevisions();
            this.protected_UpdateSpellChecking();
            break;
        }

        case historyitem_Field_RemoveItem :
        {
            this.Content.splice( Data.Pos, Data.EndPos - Data.Pos + 1 );
            this.private_UpdateTrackRevisions();
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
                    CollaborativeEditing.Update_DocumentPositionsOnAdd(this, Pos);
                }
            }
            this.private_UpdateTrackRevisions();
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
                CollaborativeEditing.Update_DocumentPositionsOnRemove(this, ChangesPos, 1);
            }
            this.private_UpdateTrackRevisions();
            this.protected_UpdateSpellChecking();
            break;
        }
    }
};
ParaField.prototype.Write_ToBinary2 = function(Writer)
{
    Writer.WriteLong(historyitem_type_Field);

    // String : Id
    // Long   : FieldType
    // Long   : Количество аргументов
    // Array of Strings : массив аргументов
    // Long   : Количество переключателей
    // Array of Strings : массив переключателей
    // Long   : Количество элементов
    // Array of Strings : массив с Id элементов

    Writer.WriteString2(this.Id);
    Writer.WriteLong(this.FieldType);

    var ArgsCount = this.Arguments.length;
    Writer.WriteLong(ArgsCount);
    for (var Index = 0; Index < ArgsCount; Index++)
        Writer.WriteString2(this.Arguments[Index]);

    var SwitchesCount = this.Switches.length;
    Writer.WriteLong(SwitchesCount);
    for (var Index = 0; Index < SwitchesCount; Index++)
        Writer.WriteString2(this.Switches[Index]);

    var Count = this.Content.length;
    Writer.WriteLong(Count);
    for (var Index = 0; Index < Count; Index++)
        Writer.WriteString2(this.Content[Index].Get_Id());
};
ParaField.prototype.Read_FromBinary2 = function(Reader)
{
    // String : Id
    // Long   : FieldType
    // Long   : Количество аргументов
    // Array of Strings : массив аргументов
    // Long   : Количество переключателей
    // Array of Strings : массив переключателей
    // Long   : Количество элементов
    // Array of Strings : массив с Id элементов

    this.Id = Reader.GetString2();
    this.FieldType = Reader.GetLong();

    var Count = Reader.GetLong();
    this.Arguments = [];
    for (var Index = 0; Index < Count; Index++)
        this.Arguments.push(Reader.GetString2());

    Count = Reader.GetLong();
    this.Switches = [];
    for (var Index = 0; Index < Count; Index++)
        this.Switches.push(Reader.GetString2());

    Count = Reader.GetLong();
    this.Content = [];
    for (var Index = 0; Index < Count; Index++)
    {
        var Element = g_oTableId.Get_ById(Reader.GetString2());
        if (null !== Element)
            this.Content.push(Element);
    }

    this.TemplateContent = this.Content;

    if (editor)
        editor.WordControl.m_oLogicDocument.Register_Field(this);
};
