/**
 * User: Ilja.Kirillov
 * Date: 24.04.12
 * Time: 13:05
 */

function CDrawingObjects()
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Objects = new Array();

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

CDrawingObjects.prototype =
{
    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },

    Get_Id : function()
    {
        return this.Id;
    },

    Add : function(DrawingObj)
    {
        History.Add( this, { Type : historyitem_DrawingObjects_AddItem, Pos : this.Objects.length, Item : DrawingObj } );
        this.Objects.push( DrawingObj );
        return this.Objects.length - 1;
    },

    Remove_ByPos : function(Pos)
    {
        History.Add( this, { Type : historyitem_DrawingObjects_RemoveItem, Pos : Pos, Items : [ this.Objects[Pos] ] } );
        this.Objects.splice( Pos, 1 );
    },

    IsPointIn : function (X,Y, PageIndex)
    {
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( true === this.Objects[Index].IsPointIn( X, Y, PageIndex ) )
                return Index;
        }

        return -1;
    },

    Get_ById : function (Id)
    {
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( Id === this.Objects[Index].Get_Id() )
            {
                return this.Objects[Index];
            }
        }

        return null
    },

    Get_ByIndex :function (Index)
    {
        if ( Index < 0 || Index >= this.Objects.length )
            return null;

        return this.Objects[Index];
    },

    Remove_ById :function (Id)
    {
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( Id === this.Objects[Index].Get_Id() )
            {
                this.Remove_ByPos( Index );
            }
        }
    },

    Remove_All : function()
    {
        if ( this.Objects.length > 0 )
        {
            History.Add( this, { Type : historyitem_DrawingObjects_RemoveItem, Pos : 0, Items : this.Objects } );
            this.Objects = new Array();
        }
    },

    Get_Count : function()
    {
        return this.Objects.length;
    },

//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_DrawingObjects_AddItem:
            {
                this.Objects.splice( Data.Pos, 1 );
                break;
            }

            case historyitem_DrawingObjects_RemoveItem:
            {
                var Array_start = this.Objects.slice( 0, Data.Pos );
                var Array_end   = this.Objects.slice( Data.Pos );

                this.Objects = Array_start.concat( Data.Items, Array_end );

                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_DrawingObjects_AddItem:
            {
                this.Objects.splice( Data.Pos, 0, Data.Item );
                break;
            }

            case historyitem_DrawingObjects_RemoveItem:
            {
                this.Objects.splice( Data.Pos, Data.Items.length );
                break;
            }
        }
    },
//-----------------------------------------------------------------------------------
// Функции для совместного редактирования
//-----------------------------------------------------------------------------------
    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_DrawingObjects );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_DrawingObjects_AddItem:
            {
                // String : Id предыдушего элемента (пустая строка, если элемент надо вставить первым)
                // String : Id объекта

                if ( 0 === Data.Pos )
                    Writer.WriteString2("");
                else
                    Writer.WriteString2( this.Objects[Data.Pos - 1].Get_Id() );

                Writer.WriteString2( Data.Item.Get_Id() );

                break;
            }

            case historyitem_DrawingObjects_RemoveItem:
            {
                // Long : количество
                // Array string : массив Id удаляемых элементов

                var Count = Data.Items.length;
                Writer.WriteLong( Count );

                for ( var Index = 0; Index < Count; Index++ )
                    Writer.WriteString2( Data.Items[Index].Get_Id() );

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
        if ( historyitem_type_DrawingObjects != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_DrawingObjects_AddItem:
            {
                // String : Id предыдушего элемента (пустая строка, если элемент надо вставить первым)
                // String : Id объекта

                var PrevId = Reader.GetString2();

                var PrevPos = 0;
                if ( "" != PrevId )
                {
                    var ObjectCount = this.Objects.length;
                    for ( var Index = 0; Index < ObjectCount; Index++ )
                    {
                        if ( this.Objects[Index].Get_Id() === PrevId )
                        {
                            PrevPos = Index;
                            break;
                        }
                    }
                }

                var LinkData = new Object();
                LinkData.Type = historyitem_DrawingObjects_AddItem;
                LinkData.Pos  = PrevPos;
                LinkData.Id   = Reader.GetString2();

                CollaborativeEditing.Add_LinkData( this, LinkData );

                break;
            }

            case historyitem_DrawingObjects_RemoveItem:
            {
                // Long : количество
                // Array string : массив Id удаляемых элементов

                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Id = Reader.GetString2();
                    var ObjectCount = this.Objects.length;
                    for ( var Index = 0; Index < ObjectCount; Index++ )
                    {
                        if ( this.Objects[Index].Get_Id() === Id )
                        {
                            this.Objects.splice( Index, 1 );
                            break;
                        }
                    }
                }

                break;
            }
        }
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_DrawingObjects );

        // String : Id
        Writer.WriteString2( this.Id );
    },

    Read_FromBinary2 : function(Reader)
    {
        // String : Id
        this.Id = Reader.GetString2();
    },

    Load_LinkData : function(LinkData)
    {
        if ( LinkData.Type === historyitem_DrawingObjects_AddItem )
        {
            var Object = g_oTableId.Get_ById( LinkData.Id );
            this.Objects.splice( LinkData.Pos, 0, Object );
        }
    }
};
