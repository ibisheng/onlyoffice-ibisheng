"use strict";

/**
 * Created by Ilja.Kirillov on 17.02.14.
 */

/**
 *
 * @constructor
 * @extends {CParagraphContentWithParagraphLikeContent}
 */
function ParaHyperlink()
{
    ParaHyperlink.superclass.constructor.call(this);

    this.Id = g_oIdCounter.Get_NewId();

    this.Type    = para_Hyperlink;
    this.Value   = "";
    this.Visited = false;
    this.ToolTip = "";

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

Asc.extendClass(ParaHyperlink, CParagraphContentWithParagraphLikeContent);

ParaHyperlink.prototype.Get_Id = function()
{
    return this.Id;
};

ParaHyperlink.prototype.Copy = function(Selected)
{
    var NewHyperlink = ParaHyperlink.superclass.Copy.apply(this, arguments);
    NewHyperlink.Set_Value(this.Value);
    NewHyperlink.Set_ToolTip(this.ToolTip);
    NewHyperlink.Visited = this.Visited;
    return NewHyperlink;
};

ParaHyperlink.prototype.Get_SelectedElementsInfo = function(Info)
{
    Info.Set_Hyperlink(this);

    ParaHyperlink.superclass.Get_SelectedElementsInfo.apply(this, arguments);
};

ParaHyperlink.prototype.Add_ToContent = function(Pos, Item, UpdatePosition)
{
    if (para_Hyperlink === Item.Type)
    {
        // При добавлении гиперссылки в гиперссылку мы добавляем контент гиперссылки, а не ее целиком
        for (var ItemPos = 0, Count = Item.Content.length; ItemPos < Count; ItemPos++)
        {
            this.Add_ToContent(Pos + ItemPos, Item.Content[ItemPos], UpdatePosition);
        }

        return;
    }

    History.Add( this, { Type : historyitem_Hyperlink_AddItem, Pos : Pos, EndPos : Pos, Items : [ Item ] } );

    ParaHyperlink.superclass.Add_ToContent.apply(this, arguments);
};

ParaHyperlink.prototype.Remove_FromContent = function(Pos, Count, UpdatePosition)
{
    // Получим массив удаляемых элементов
    var DeletedItems = this.Content.slice( Pos, Pos + Count );
    History.Add( this, { Type : historyitem_Hyperlink_RemoveItem, Pos : Pos, EndPos : Pos + Count - 1, Items : DeletedItems } );

    ParaHyperlink.superclass.Remove_FromContent.apply(this, arguments);
};

ParaHyperlink.prototype.Add = function(Item)
{
    switch (Item.Type)
    {
        case para_Run  :
        case para_Field:
        {
            var TextPr = this.Get_FirstTextPr();
            Item.Select_All();
            Item.Apply_TextPr(TextPr);
            Item.Selection_Remove();

            var CurPos = this.State.ContentPos;
            var CurItem = this.Content[CurPos];
            if (para_Run === CurItem.Type || para_Math === CurItem.Type)
            {
                var ContentPos = new CParagraphContentPos();
                this.Content[CurPos].Get_ParaContentPos(false, false, ContentPos);

                // Разделяем текущий элемент (возвращается правая часть)
                var NewElement = this.Content[CurPos].Split(ContentPos, 0);

                if (null !== NewElement)
                    this.Add_ToContent(CurPos + 1, NewElement);

                this.Add_ToContent(CurPos + 1, Item);

                if (para_Field === Item.Type)
                {
                    this.State.ContentPos = CurPos + 2;
                    this.Content[this.State.ContentPos].Cursor_MoveToStartPos(false);
                }
                else
                {
                    this.State.ContentPos = CurPos + 1;
                    this.Content[this.State.ContentPos].Cursor_MoveToEndPos(false);
                }
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
        case para_Hyperlink:
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

ParaHyperlink.prototype.Clear_TextPr = function()
{
    var HyperlinkStyle = null;
    if ( undefined !== this.Paragraph && null !== this.Paragraph )
    {
        var Styles = this.Paragraph.Parent.Get_Styles();
        HyperlinkStyle = Styles.Get_Default_Hyperlink();
    }

    var Count = this.Content.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        var Item = this.Content[Index];
        Item.Clear_TextPr();

        if ( para_Run === Item.Type && null !== HyperlinkStyle )
            Item.Set_RStyle( HyperlinkStyle );
    }
};

ParaHyperlink.prototype.Clear_TextFormatting = function( DefHyper )
{
    var Count = this.Content.length;

    for (var Pos = 0; Pos < Count; Pos++)
    {
        var Item = this.Content[Pos];
        Item.Clear_TextFormatting(DefHyper);

        if (para_Run === Item.Type && null !== DefHyper && undefined !== DefHyper)
            Item.Set_RStyle(DefHyper);
    }
};

ParaHyperlink.prototype.Split = function (ContentPos, Depth)
{
    var NewHyperlink = ParaHyperlink.superclass.Split.apply(this, arguments);
    NewHyperlink.Set_Value(this.Value);
    NewHyperlink.Set_ToolTip(this.ToolTip);
    return NewHyperlink;
};

ParaHyperlink.prototype.CopyContent = function(Selected)
{
    var Content = ParaHyperlink.superclass.CopyContent.apply(this, arguments);

    for (var CurPos = 0, Count = Content.length; CurPos < Count; CurPos++)
    {
        var Item = Content[CurPos];
        Item.Clear_TextFormatting();
    }

    return Content;
};

//-----------------------------------------------------------------------------------
// Функции отрисовки
//-----------------------------------------------------------------------------------
ParaHyperlink.prototype.Draw_Elements = function(PDSE)
{
    PDSE.VisitedHyperlink = this.Visited;
    ParaHyperlink.superclass.Draw_Elements.apply(this, arguments);
    PDSE.VisitedHyperlink = false;
};

ParaHyperlink.prototype.Draw_Lines = function(PDSL)
{
    PDSL.VisitedHyperlink = this.Visited;
    ParaHyperlink.superclass.Draw_Lines.apply(this, arguments);
    PDSL.VisitedHyperlink = false;
};
//-----------------------------------------------------------------------------------
// Работаем со значениями
//-----------------------------------------------------------------------------------
ParaHyperlink.prototype.Set_Visited = function(Value)
{
    this.Visited = Value;
};

ParaHyperlink.prototype.Get_Visited = function()
{
    return this.Visited;
};

ParaHyperlink.prototype.Set_ToolTip = function(ToolTip)
{
    History.Add( this, { Type : historyitem_Hyperlink_ToolTip, New : ToolTip, Old : this.ToolTip } );
    this.ToolTip = ToolTip;
};

ParaHyperlink.prototype.Get_ToolTip = function()
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
};

ParaHyperlink.prototype.Get_Value = function()
{
    return this.Value;
};

ParaHyperlink.prototype.Set_Value = function(Value)
{
    History.Add( this, { Type : historyitem_Hyperlink_Value, New : Value, Old : this.Value } );
    this.Value = Value;
};

//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
ParaHyperlink.prototype.Undo = function(Data)
{
    var Type = Data.Type;
    switch(Type)
    {
        case historyitem_Hyperlink_AddItem :
        {
            this.Content.splice( Data.Pos, Data.EndPos - Data.Pos + 1 );
            this.private_UpdateTrackRevisions();
            this.protected_UpdateSpellChecking();
            break;
        }

        case historyitem_Hyperlink_RemoveItem :
        {
            var Pos = Data.Pos;

            var Array_start = this.Content.slice( 0, Pos );
            var Array_end   = this.Content.slice( Pos );

            this.Content = Array_start.concat( Data.Items, Array_end );
            this.private_UpdateTrackRevisions();
            this.protected_UpdateSpellChecking();
            break;
        }

        case historyitem_Hyperlink_Value :
        {
            this.Value = Data.Old;
            break;
        }

        case historyitem_Hyperlink_ToolTip :
        {
            this.ToolTip = Data.Old;
            break;
        }
    }
};

ParaHyperlink.prototype.Redo = function(Data)
{
    var Type = Data.Type;
    switch(Type)
    {
        case historyitem_Hyperlink_AddItem :
        {
            var Pos = Data.Pos;

            var Array_start = this.Content.slice( 0, Pos );
            var Array_end   = this.Content.slice( Pos );

            this.Content = Array_start.concat( Data.Items, Array_end );
            this.private_UpdateTrackRevisions();
            this.protected_UpdateSpellChecking();
            break;
        }

        case historyitem_Hyperlink_RemoveItem :
        {
            this.Content.splice( Data.Pos, Data.EndPos - Data.Pos + 1 );
            this.private_UpdateTrackRevisions();
            this.protected_UpdateSpellChecking();
            break;
        }

        case historyitem_Hyperlink_Value :
        {
            this.Value = Data.New;
            break;
        }

        case historyitem_Hyperlink_ToolTip :
        {
            this.ToolTip = Data.New;
            break;
        }
    }
};
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
ParaHyperlink.prototype.Save_Changes = function(Data, Writer)
{
    // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
    // Long : тип класса
    // Long : тип изменений

    Writer.WriteLong( historyitem_type_Hyperlink );

    var Type = Data.Type;

    // Пишем тип
    Writer.WriteLong( Type );

    switch(Type)
    {
        case historyitem_Hyperlink_AddItem :
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

        case historyitem_Hyperlink_RemoveItem :
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

        case historyitem_Hyperlink_Value :
        {
            // String : Value
            Writer.WriteString2( Data.New );
            break;
        }

        case historyitem_Hyperlink_ToolTip :
        {
            // String : ToolTip
            Writer.WriteString2( Data.New );

            break;
        }
    }
};

ParaHyperlink.prototype.Load_Changes = function(Reader)
{
    // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
    // Long : тип класса
    // Long : тип изменений

    var ClassType = Reader.GetLong();
    if ( historyitem_type_Hyperlink != ClassType )
        return;

    var Type = Reader.GetLong();

    switch ( Type )
    {
        case historyitem_Hyperlink_AddItem :
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
                var Pos     = this.m_oContentChanges.Check( AscCommon.contentchanges_Add, Reader.GetLong() );
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

        case historyitem_Hyperlink_RemoveItem:
        {
            // Long          : Количество удаляемых элементов
            // Array of Long : позиции удаляемых элементов

            var Count = Reader.GetLong();

            for ( var Index = 0; Index < Count; Index++ )
            {
                var ChangesPos = this.m_oContentChanges.Check( AscCommon.contentchanges_Remove, Reader.GetLong() );

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

        case historyitem_Hyperlink_Value:
        {
            // String : Value
            this.Value = Reader.GetString2();
            break;
        }

        case historyitem_Hyperlink_ToolTip :
        {
            // String : ToolTip
            this.ToolTip = Reader.GetString2();

            break;
        }
    }
};

ParaHyperlink.prototype.Write_ToBinary2 = function(Writer)
{
    Writer.WriteLong( historyitem_type_Hyperlink );

    // String : Id
    // String : Value
    // String : ToolTip
    // Long   : Количество элементов
    // Array of Strings : массив с Id элементов

    Writer.WriteString2( this.Id );
    if(!(editor && editor.isDocumentEditor))
    {
        this.Write_ToBinary2SpreadSheets(Writer);
        return;
    }

    Writer.WriteString2( this.Value );
    Writer.WriteString2( this.ToolTip );

    var Count = this.Content.length;
    Writer.WriteLong( Count );

    for ( var Index = 0; Index < Count; Index++ )
    {
        Writer.WriteString2( this.Content[Index].Get_Id() );
    }
};

ParaHyperlink.prototype.Read_FromBinary2 = function(Reader)
{
    // String : Id
    // String : Value
    // String : ToolTip
    // Long   : Количество элементов
    // Array of Strings : массив с Id элементов

    this.Id      = Reader.GetString2();
    this.Value   = Reader.GetString2();
    this.ToolTip = Reader.GetString2();

    var Count = Reader.GetLong();
    this.Content = [];

    for ( var Index = 0; Index < Count; Index++ )
    {
        var Element = g_oTableId.Get_ById( Reader.GetString2() );
        if ( null !== Element )
            this.Content.push( Element );
    }
};

ParaHyperlink.prototype.Write_ToBinary2SpreadSheets = function(Writer)
{
    Writer.WriteString2("");
    Writer.WriteString2("");
    Writer.WriteLong(0);
};

ParaHyperlink.prototype.Document_UpdateInterfaceState = function()
{
    var HyperText = new CParagraphGetText();
    this.Get_Text( HyperText );

    var HyperProps = new CHyperlinkProperty(this);
    HyperProps.put_Text( HyperText.Text );

    editor.sync_HyperlinkPropCallback(HyperProps);

    ParaHyperlink.superclass.Document_UpdateInterfaceState.apply(this, arguments);
};

function CParaHyperLinkStartState(HyperLink)
{
    this.Value = HyperLink.Value;
    this.ToolTip = HyperLink.ToolTip;
    this.Content = [];
    for(var i = 0; i < HyperLink.Content.length; ++i)
    {
        this.Content.push(HyperLink.Content);
    }
}
