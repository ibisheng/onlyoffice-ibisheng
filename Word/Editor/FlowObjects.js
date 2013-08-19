/**
 * User: Ilja.Kirillov
 * Date: 25.10.11
 * Time: 13:56
 */

var flowobject_Image     = 0x01;
var flowobject_Table     = 0x02;
var flowobject_Paragraph = 0x03;

// Сортируем объекты {X0, X1} по X0
function Sort_Ranges_X0(A,B)
{
    if ( !A.X0 || !B.X0  )
        return 0;

    if( A.X0 < B.X0 )
        return -1;
    else if( A.X0 > B.X0 )
        return 1;

    return 0;
}

// Сравниваем, вложено ли множество первых отрезков во второе
// (множество отрезков здесь - это дизъюнктное объединение отрезков)
function FlowObjects_CheckInjection(Range1, Range2)
{
    for ( var Index = 0; Index < Range1.length; Index++ )
    {
        var R1 = Range1[Index];
        var bInject = false;
        for ( var Index2 = 0; Index2 < Range2.length; Index2++ )
        {
            var R2 = Range2[Index2];

            if ( R1.X0 >= R2.X0 && R1.X0 <= R2.X1 && R1.X1 >= R2.X0 && R1.X1 <= R2.X1 )
                bInject = true;
        }

        if ( !bInject )
            return false;
    }

    return true;
}

// Сравниваем, совпали ли множества отрезков
function FlowObjects_CompareRanges(Range1, Range2)
{
    if ( Range1.length < Range2.length )
        return -1;
    else if ( Range1.length > Range2.length )
        return -1;

    for ( var Index = 0; Index < Range1.length; Index++ )
    {
        if ( Math.abs( Range1[Index].X0 - Range2[Index].X0 ) > 0.001 || Math.abs( Range1[Index].X1 - Range2[Index].X1 ) )
            return -1;
    }

    return 0;
}

function FlowObjects_Read_FromBinary(Reader)
{
    var Type = Reader.GetLong();
    var Element = null;
    switch( Type )
    {
        case flowobject_Image : Element = new FlowImage(); break;
        case flowobject_Table : Element = new FlowTable(); break;
    }

    if ( null != Element )
    {
        Element.Read_FromBinary( Reader );
        Element.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
    }

    return Element;
}


//
// Класс FlowObjects
//
// Objects : массив с "плавающими" объектами
//           у каждого объекта должны быть заданы следующие параметры
//           X, Y, Width, Height
//           и функции Show, Hide

function FlowObjects(Parent, PageNum)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Objects = new Array();

    this.Parent  = Parent;
    this.PageNum = PageNum;

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

FlowObjects.prototype =
{
    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Get_Id : function()
    {
        return this.Id;
    },

    Add : function(Item)
    {
        //if ( flowobject_Table != Item.Get_Type() || 0 === Item.PageController )
        //    History.Add( this, { Type : historyitem_FlowObjects_AddItem, Pos : this.Internal_Get_ClearPos(this.Objects.length), Item : Item } );

        this.Objects.push( Item );
        return this.Objects.length - 1;
    },

    Remove_ByPos : function(Pos)
    {
        //var Object = this.Objects[Pos];
        //if ( flowobject_Table != Object.Get_Type() || 0 === Object.PageController )
        //{
        //    var ClearPos = this.Internal_Get_ClearPos(Pos);
        //    History.Add( this, { Type : historyitem_FlowObjects_RemoveItem, Pos : ClearPos, EndPos : ClearPos, Items : [ this.Objects[Pos] ] } );
        //}

        this.Objects.splice( Pos, 1 );
    },

    // Проверяем попала ли точка в один из плавающих объектов.
    // Возвращаем его номер, если попала, либо -1, если не попала.
    IsPointIn : function (X,Y)
    {
        // TODO: надо ввести zIndex для таких объектов, и определятять попадание курсора
        //       в верхний элемент.
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( true === this.Objects[Index].IsPointIn( X, Y ) )
                return Index;
        }

        return -1;
    },

    IsPointIn_Tables : function(X,Y)
    {
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( flowobject_Table === this.Objects[Index].Get_Type() && true === this.Objects[Index].IsPointIn( X, Y ) )
                return Index;
        }

        return -1;
    },

    CheckRange : function(X0, Y0, X1, Y1, StartArray)
    {
        var Ranges = new Array();
        if ( "undefined" != typeof(StartArray) && null != StartArray )
            Ranges = StartArray;

        // Отберем все промежутки, которые попали по Y и X
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            var Object = this.Objects[Index];
            var ObjX = Object.X;
            var ObjY = Object.Y;

            var Paddings = Object.Paddings;

            if ( undefined === Object.Paddings )
            {
                Paddings =
                {
                    Bottom : Object.Distance.B,
                    Left   : Object.Distance.L,
                    Right  : Object.Distance.R,
                    Top    : Object.Distance.T
                };
            }

            //if ( flowobject_Table === Object.Get_Type() && false === Object.CheckRange_OnFirstPage() )
            //    continue;

            if ( ObjY - Paddings.Top <= Y1  && ObjY + Object.H + Paddings.Bottom >= Y0  && ObjX - Paddings.Left <= X1  && ObjX + Object.W + Paddings.Right >= X0 )
                Ranges.push( { X0 : ObjX - Paddings.Left, X1: ObjX + Object.W + Paddings.Right, Y1 : ObjY + Object.H + Paddings.Bottom } );

        }

        // Отсоритруем Ranges по X0
        Ranges.sort( Sort_Ranges_X0 );

        // Объединим пересекающиеся промежутки
        var Pos = 1;
        while ( Pos < Ranges.length )
        {
            if ( Ranges[Pos].X0 <= Ranges[Pos - 1].X1 )
            {
                var TempX0 = Ranges[Pos - 1].X0;
                var TempX1 = Math.max( Ranges[Pos].X1, Ranges[Pos-1].X1 );
                var TempY1 = Math.min( Ranges[Pos].Y1, Ranges[Pos-1].Y1 );
                Ranges.splice( Pos - 1, 2, {X0: TempX0, X1: TempX1, Y1 : TempY1} );
            }
            else
                Pos++;
        }

        while ( Ranges.length > 0 )
        {
            if ( Ranges[0].X1 < X0 )
            {
                Ranges.splice( 0, 1 );
                continue;
            }
            else if ( Ranges[0].X0 < X0 )
                Ranges[0].X0 = X0;

            break;
        }

        while ( Ranges.length > 0 )
        {
            if ( Ranges[Ranges.length - 1].X0 > X1 )
            {
                Ranges.splice( Ranges.length - 1, 1 );
                continue;
            }
            else if ( Ranges[Ranges.length - 1].X1 > X1 )
                Ranges[Ranges.length - 1].X1 = X1;

            break;
        }

        return Ranges;
    },

    Hide : function()
    {
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( this.Objects[Index].Hide )
                this.Objects[Index].Hide();
        }
    },

    Show : function(Context)
    {
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( this.Objects[Index].Draw )
                this.Objects[Index].Draw(0,0,Context);
        }
    },

    Find : function(Id, Remove)
    {
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( Id === this.Objects[Index].Get_Id() )
            {
                var FlowObj = this.Objects[Index];
                if ( true === Remove )
                    this.Remove_ByPos( Index );

                return FlowObj;
            }
        }

        return null;
    },

    Get_ByIndex :function (Index)
    {
        if ( Index < 0 || Index >= this.Objects.length )
            return null;

        return this.Objects[Index];
    },

    Get_Index_ById : function(Id)
    {
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( Id === this.Objects[Index].Get_Id() )
            {
                return Index;
            }
        }

        return -1;
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
            History.Add( this, { Type : historyitem_FlowObjects_RemoveItem, Pos : this.Internal_Get_ClearPos( 0 ), EndPos : this.Internal_Get_ClearPos( this.Objects.length - 1 ), Items : this.Objects } );
            this.Objects = new Array();
        }
    },

    DocumentSearch : function(Str, Type)
    {
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( flowobject_Table === this.Objects[Index].Get_Type() )
            {
                this.Objects[Index].DocumentSearch( Str, Type );
            }
        }
    },

    DocumentStatistics : function(Stats)
    {
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( flowobject_Table === this.Objects[Index].Get_Type() )
            {
                this.Objects[Index].Table.DocumentStatistics( Stats );
            }
        }
    },

    Document_CreateFontMap : function(FontMap)
    {
        /*
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( flowobject_Table === this.Objects[Index].Get_Type() )
            {
                this.Objects[Index].Document_CreateFontMap( FontMap );
            }
        }
        */
    },

    Get_Count : function()
    {
        return this.Objects.length;
    },
//-----------------------------------------------------------------------------------
// Вспомогательные функции
//-----------------------------------------------------------------------------------

    // Позиция без учета таблицчных элементов, у которых PageController > 0
    Internal_Get_ClearPos : function(Pos)
    {
        var Counter = 0;
        for ( var Index = 0; Index <= Math.min(Pos, this.Objects.length - 1); Index++ )
        {
            var Object = this.Objects[Index];
            if ( flowobject_Table === Object.Get_Type() && 0 != Object.PageController )
                Counter++;
        }
        return Pos - Counter;
    },

    Internal_Get_RealPos : function(Pos)
    {
        var Counter = Pos;
        for ( var Index = 0; Index <= Math.min(Counter, this.Objects.length - 1); Index++ )
        {
            var Object = this.Objects[Index];
            if ( flowobject_Table === Object.Get_Type() && 0 != Object.PageController )
                Counter++;
        }

        return Counter;
    },
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_FlowObjects_AddItem:
            {
                var Pos = this.Internal_Get_RealPos( Data.Pos );

                if ( flowobject_Table === this.Objects[Pos].Get_Type() )
                {
                    History.TurnOff();
                    this.Objects[Pos].DeleteThis();
                    History.TurnOn();
                }
                else
                    this.Objects.splice( Pos, 1 );

                break;
            }

            case historyitem_FlowObjects_RemoveItem:
            {
                var Pos = this.Internal_Get_RealPos( Data.Pos );
                var Array_start = this.Objects.slice( 0, Pos );
                var Array_end   = this.Objects.slice( Pos );

                this.Objects = Array_start.concat( Data.Items, Array_end );

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
            case historyitem_FlowObjects_AddItem:
            {
                var Pos = this.Internal_Get_RealPos( Data.Pos );
                this.Objects.splice( Pos, 0, Data.Item );
                break;
            }

            case historyitem_FlowObjects_RemoveItem:
            {
                var StartPos = this.Internal_Get_RealPos( Data.Pos );
                var EndPos   = this.Internal_Get_RealPos( Data.EndPos );

                for ( var Pos = StartPos; Pos <= EndPos; Pos++  )
                {
                    if ( flowobject_Table === this.Objects[Pos].Get_Type() )
                    {
                        History.TurnOff();
                        this.Objects[Pos].DeleteThis();
                        History.TurnOn();
                    }
                    else
                        this.Objects.splice( Pos, 1 );
                }

                break;
            }
        }

        History.RecalcData_Add( this.Get_ParentObject_or_DocumentPos() );
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        var Pos = 0;
        if ( this.Parent != null && this.PageNum != null )
            Pos = this.Parent.Pages[this.PageNum].Pos;

        return { Type : historyrecalctype_Inline, Data : Pos };
    },
//-----------------------------------------------------------------------------------
// Функции для совместного редактирования
//-----------------------------------------------------------------------------------
    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long   : тип класса
        // Long   : тип изменений

        // String : Id родительского класса
        // Long   : PageNum


        Writer.WriteLong( historyitem_type_FlowObjects );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        Writer.WriteString2( this.Parent.Get_Id() );
        Writer.WriteLong( this.PageNum );

        switch ( Type )
        {
            case historyitem_FlowObjects_AddItem:
            {
                // String : Сохраняем Id объекта

                Writer.WriteString2( Data.Item.Get_Id() );

                break;
            }

            case historyitem_FlowObjects_RemoveItem:
            {
                // Long : количество
                // Array of strings : массив Id

                var Count = Data.Items.length;
                Writer.WriteLong( Count );
                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Id = Data.Items[Index].Get_Id();
                    Writer.WriteString2( Id );
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
        // String : Id родительского класса
        // Long   : PageNum

        var ClassType = Reader.GetLong();
        if ( historyitem_type_FlowObjects != ClassType )
            return;

        var Type = Reader.GetLong();

        Reader.GetString2();
        Reader.GetLong();

        switch ( Type )
        {
            case historyitem_FlowObjects_AddItem:
            {
                // String : Id объекта
                var ElementId = Reader.GetString2();
                var Element = g_oTableId.Get_ById( ElementId );

                if ( null != Element )
                    this.Objects.splice( 0, 0, Element );

                break;
            }

            case historyitem_FlowObjects_RemoveItem:
            {
                // Long : количество
                // Array of strings : массив Id

                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Id = Reader.GetString2();
                    var ObjectIndex = this.Get_Index_ById(Id);

                    if ( -1 != ObjectIndex )
                        this.Objects.splice( ObjectIndex, 1 );
                }

                break;
            }
        }
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_FlowObjects );

        // String : Id
        // String : Parent Id
        // Long   : PageNum

        Writer.WriteString2( this.Id );
        Writer.WriteString2( this.Parent.Get_Id() );
        Writer.WriteLong( this.PageNum );
    },

    Read_FromBinary2 : function(Reader)
    {
        // String : Id
        // String : Parent Id
        // Long   : PageNum

        var LinkData = new Object();
        LinkData.Id      = Reader.GetString2()
        LinkData.Parent  = Reader.GetString2()
        LinkData.PageNum = Reader.GetLong();
        CollaborativeEditing.Add_LinkData( this, LinkData );
    },

    Load_LinkData : function(LinkData)
    {
        // Возможны два варианта:
        // 1. у родительского класса нет либо заданной страницы, либо объекта FlowObjects
        //    на заданной странице, тогда создаем страницу(если надо) и выставляем объект
        //    FlowObjects = this
        // 2. У родительского объекта уже есть заданная страница с объектом FlowObjects,
        //    тогда мы копируем в таблицу g_oTableId ссылку c новым Id, чтобы в будущем
        //    ссылались на правильный объект.

        var Parent = g_oTableId.Get_ById( LinkData.Parent );
        if ( null != Parent )
        {
            if ( "undefined" === typeof(Parent.Pages[LinkData.PageNum]) || "undefined" === typeof(Parent.Pages[LinkData.PageNum].FlowObjects) )
            {
                if ( "undefined" === typeof(Parent.Pages[LinkData.PageNum]) )
                {
                    Parent.Pages[LinkData.PageNum] = new Object();

                    Parent.Pages[LinkData.PageNum].Width   = Page_Width;
                    Parent.Pages[LinkData.PageNum].Height  = Page_Height;
                    Parent.Pages[LinkData.PageNum].Margins =
                    {
                        Left   : X_Left_Field,
                        Right  : X_Right_Field,
                        Top    : Y_Top_Field,
                        Bottom : Y_Bottom_Field
                    };

                    Parent.Pages[LinkData.PageNum].Bounds  =
                    {
                        Left   : X_Left_Field,
                        Top    : Y_Top_Field,
                        Right  : X_Right_Field,
                        Bottom : Y_Top_Field
                    }
                    Parent.Pages[LinkData.PageNum].Pos = 0;
                }

                Parent.Pages[LinkData.PageNum].FlowObjects = this;

                this.Id      = LinkData.Id;
                this.Parent  = Parent;
                this.PageNum = LinkData.PageNum;
            }
            else
            {
                var FlowId = Parent.Pages[LinkData.PageNum].FlowObjects.Get_Id();
                g_oTableId.m_aPairs[LinkData.Id] = g_oTableId.Get_ById(FlowId);
            }
        }
    }
};

function FlowImage(X, Y, W, H, Img, DrawingDocument, PageNum, Parent)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.X = X;
    this.Y = Y;

    this.H = H;
    this.W = W;

    this.Paddings =
    {
        Left   : 0,
        Right  : 0,
        Top    : 0,
        Bottom : 0
    };

    this.PageNum         = PageNum;
    this.Img             = Img;
    this.DrawingDocument = DrawingDocument;
    this.Parent          = Parent;

    this.ImageTrackType = 0;

    this.Lock = new CLock();
    if ( false === g_oIdCounter.m_bLoad )
    {
        this.Lock.Set_Type( locktype_Mine, false );
        CollaborativeEditing.Add_Unlock2( this );
    }


    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

FlowImage.prototype =
{
    Get_Type : function()
    {
        return flowobject_Image;
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

    Get_PageNum : function()
    {
        return this.PageNum;
    },

    IsPointIn : function(X,Y)
    {
        if ( this.Y <= Y && this.Y + this.H >= Y && this.X <= X && this.X + this.W >= X  )
            return true;

        return false;
    },

    Draw : function(Context)
    {
        Context.drawImage( this.Img, this.X, this.Y, this.W, this.H );
        Context.DrawLockObjectRect(this.Lock.Get_Type(), this.X, this.Y, this.W, this.H);
    },

    Focus : function ()
    {
        this.DrawingDocument.StartTrackImage( this, this.X, this.Y, this.W, this.H, this.ImageTrackType, this.PageNum );
    },

    Blur : function()
    {
        this.DrawingDocument.EndTrack();
    },

    Move_Start : function (X,Y)
    {
    },

    Move : function(X,Y)
    {
    },

    Move_End : function(X,Y)
    {
    },

    Update : function()
    {
        this.DrawingDocument.StartTrackImage( this, this.X, this.Y, this.W, this.H, this.ImageTrackType, this.PageNum );
    },

    // Интерфейс для треков
    Track_Draw : function(Left, Top, Right, Bottom)
    {

    },

    // Трек закончил работу на странице PageNum, c новыми координатами X, Y, W, H
    Track_End : function(PageNum, X, Y, W, H)
    {
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        if ( false === LogicDocument.Document_Is_SelectionLocked(changestype_Image_Properties) )
        {
            LogicDocument.Create_NewHistoryPoint();

            this.Set_Position( X, Y );
            this.Set_Size( W, H );
            this.DrawingDocument.SetCurrentPage( PageNum );
            this.DrawingDocument.StartTrackImage( this, this.X, this.Y, this.W, this.H, this.ImageTrackType, PageNum );
            this.Parent.FlowImage_Move( this.Id, this.PageNum, PageNum );
            this.Set_PageNum( PageNum );
        }
        else
        {
            LogicDocument.Document_UpdateSelectionState();
        }
    },

    Select_This : function()
    {
        var Padding = this.DrawingDocument.GetMMPerDot( 6 );
        this.DrawingDocument.AddPageSelection( this.PageNum, this.X - Padding, this.Y - Padding, this.W + 2 * Padding, this.H + 2 * Padding );
    },

    Update_CursorType : function(X, Y, PageNum)
    {
        this.DrawingDocument.SetCursorType( "move", new CMouseMoveData() );

        if ( true === this.Lock.Is_Locked() )
        {
            var MMData = new CMouseMoveData();
            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR( this.X, this.Y, this.PageNum );
            MMData.X_abs            = Coords.X - 5;
            MMData.Y_abs            = Coords.Y - 5;
            MMData.Type             = c_oAscMouseMoveDataTypes.LockedObject;
            MMData.UserId           = this.Lock.Get_UserId();
            MMData.HaveChanges      = this.Lock.Have_Changes();
            MMData.LockedObjectType = c_oAscMouseMoveLockedObjectType.Common;

            editor.sync_MouseMoveCallback( MMData );
        }
    },
//-----------------------------------------------------------------------------------
// Функции для работы с параметрами
//-----------------------------------------------------------------------------------
    Set_Position : function(X, Y)
    {
        History.Add( this, { Type : historyitem_FlowImage_Position, New : { X : X, Y : Y }, Old : { X : this.X, Y : this.Y } } );
        this.X = X;
        this.Y = Y;
    },

    Set_Size : function(W, H)
    {
        History.Add( this, { Type : historyitem_FlowImage_Size, New : { W : W, H : H }, Old : { W : this.W, H : this.H } } );
        this.W = W;
        this.H = H;
    },

    Set_Paddings : function(Left, Right, Top, Bottom)
    {
        History.Add( this,
            {
                Type : historyitem_FlowImage_Paddings,
                New  :
                {
                    Left   : null != Left   ? Left   : this.Paddings.Left,
                    Right  : null != Right  ? Right  : this.Paddings.Right,
                    Top    : null != Top    ? Top    : this.Paddings.Top,
                    Bottom : null != Bottom ? Bottom : this.Paddings.Bottom
                },
                Old :
                {
                    Left   : this.Paddings.Left,
                    Right  : this.Paddings.Right,
                    Top    : this.Paddings.Top,
                    Bottom : this.Paddings.Bottom
                }
            } );
        this.Paddings.Left   = Left;
        this.Paddings.Right  = Right;
        this.Paddings.Top    = Top;
        this.Paddings.Bottom = Bottom;
    },

    Set_PageNum : function(PageNum)
    {
        History.Add( this, { Type : historyitem_FlowImage_PageNum, New : PageNum, Old : this.PageNum } );
        this.PageNum = PageNum;
    },

    Set_Url : function(Img)
    {
        History.Add( this, { Type : historyitem_FlowImage_Url, New : Img, Old : this.Img } );
        this.Img = Img;
    },

    Set_Parent : function(Parent)
    {
        History.Add( this, { Type : historyitem_FlowImage_Parent, New : Parent, Old : Parent } );
        this.Parent = Parent;
    },

//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_FlowImage_Position:
            {
                this.X = Data.Old.X;
                this.Y = Data.Old.Y;
                break;
            }

            case historyitem_FlowImage_Size:
            {
                this.W = Data.Old.W;
                this.H = Data.Old.H;
                break;
            }

            case historyitem_FlowImage_Paddings:
            {
                this.Paddings.Left   = Data.Old.Left;
                this.Paddings.Right  = Data.Old.Right;
                this.Paddings.Top    = Data.Old.Top;
                this.Paddings.Bottom = Data.Old.Bottom;
                break;
            }

            case historyitem_FlowImage_PageNum:
            {
                this.PageNum = Data.Old;
                break;
            }

            case historyitem_FlowImage_Url:
            {
                this.Img = Data.Old;
                break;
            }

            case historyitem_FlowImage_Parent:
            {
                this.Parent = Data.Old;
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
            case historyitem_FlowImage_Position:
            {
                this.X = Data.New.X;
                this.Y = Data.New.Y;
                break;
            }

            case historyitem_FlowImage_Size:
            {
                this.W = Data.New.W;
                this.H = Data.New.H;
                break;
            }

            case historyitem_FlowImage_Paddings:
            {
                this.Paddings.Left   = Data.New.Left;
                this.Paddings.Right  = Data.New.Right;
                this.Paddings.Top    = Data.New.Top;
                this.Paddings.Bottom = Data.New.Bottom;
                break;
            }

            case historyitem_FlowImage_PageNum:
            {
                this.PageNum = Data.New;
                break;
            }

            case historyitem_FlowImage_Url:
            {
                this.Img = Data.New;
                break;
            }

            case historyitem_FlowImage_Parent:
            {
                this.Parent = Data.New;
                break;
            }
        }

        History.RecalcData_Add( this.Get_ParentObject_or_DocumentPos() );
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        return { Type : historyrecalctype_Flow, Data : this };
    },
//-----------------------------------------------------------------------------------
// Функции для совместного редактирования
//-----------------------------------------------------------------------------------
    Document_Is_SelectionLocked : function(CheckType)
    {
        // Запрещаем любое действие, кроме действий с картинкой

        if ( changestype_Image_Properties === CheckType || changestype_Delete === CheckType || changestype_Remove === CheckType )
            this.Lock.Check( this.Get_Id() );
        else
            CollaborativeEditing.Add_CheckLock(true);
    },

    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_FlowImage );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_FlowImage_Position:
            {
                // Double : X
                // Double : Y
                Writer.WriteDouble(Data.New.X);
                Writer.WriteDouble(Data.New.Y);
                break;
            }

            case historyitem_FlowImage_Size:
            {
                // Double : W
                // Double : H
                Writer.WriteDouble(Data.New.W);
                Writer.WriteDouble(Data.New.H);
                break;
            }

            case historyitem_FlowImage_Paddings:
            {
                // Double : Left
                // Double : Right
                // Double : Top
                // Double : Bottom
                Writer.WriteDouble(Data.New.Left);
                Writer.WriteDouble(Data.New.Right);
                Writer.WriteDouble(Data.New.Top);
                Writer.WriteDouble(Data.New.Bottom);
                break;
            }

            case historyitem_FlowImage_PageNum:
            {
                // Long : PageNum
                Writer.WriteLong(Data.New);
                break;
            }

            case historyitem_FlowImage_Url:
            {
                // String : Url
                Writer.WriteString2(Data.New);
                break;
            }

            case historyitem_FlowImage_Parent:
            {
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
        if ( historyitem_type_FlowImage != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_FlowImage_Position:
            {
                // Double : X
                // Double : Y
                this.X = Reader.GetDouble();
                this.Y = Reader.GetDouble();
                break;
            }

            case historyitem_FlowImage_Size:
            {
                // Double : W
                // Double : H
                this.W = Reader.GetDouble();
                this.H = Reader.GetDouble();
                break;
            }

            case historyitem_FlowImage_Paddings:
            {
                // Double : Left
                // Double : Right
                // Double : Top
                // Double : Bottom
                this.Paddings.Left   = Reader.GetDouble();
                this.Paddings.Right  = Reader.GetDouble();
                this.Paddings.Top    = Reader.GetDouble();
                this.Paddings.Bottom = Reader.GetDouble();
                break;
            }

            case historyitem_FlowImage_PageNum:
            {
                // Long : PageNum
                this.PageNum = Reader.GetLong();
                break;
            }

            case historyitem_FlowImage_Url:
            {
                // String : Url
                this.Img = Reader.GetString2();
                break;
            }

            case historyitem_FlowImage_Parent:
            {
                break;
            }
        }
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_FlowImage );

        // Long     : flowobject_image
        // String   : Id
        // Double   : X
        // Double   : Y
        // Double   : W
        // Double   : H
        // Double   : Paddings.Left
        // Double   : Paddings.Right
        // Double   : Paddings.Top
        // Double   : Paddings.Bottom
        // Long     : PageNum
        // String   : Url
        // Long     : ImageTrackType
        // ParentId : Id родительского класса

        Writer.WriteLong(flowobject_Image);
        Writer.WriteString2( this.Id );
        Writer.WriteDouble( this.X );
        Writer.WriteDouble( this.Y );
        Writer.WriteDouble( this.W );
        Writer.WriteDouble( this.H );
        Writer.WriteDouble( this.Paddings.Left );
        Writer.WriteDouble( this.Paddings.Right );
        Writer.WriteDouble( this.Paddings.Top );
        Writer.WriteDouble( this.Paddings.Bottom );
        Writer.WriteLong(this.PageNum);
        Writer.WriteString2(this.Img);
        Writer.WriteLong(this.ImageTrackType);
        Writer.WriteString2(this.Parent.Get_Id());
    },

    Read_FromBinary2 : function(Reader)
    {
        // Long     : flowobject_image (это читается вне данной функции)
        // String   : Id
        // Double   : X
        // Double   : Y
        // Double   : W
        // Double   : H
        // Double   : Paddings.Left
        // Double   : Paddings.Right
        // Double   : Paddings.Top
        // Double   : Paddings.Bottom
        // Long     : PageNum
        // String   : Url
        // Long     : ImageTrackType
        // ParentId : Id родительского класса

        Reader.GetLong();
        this.Id   = Reader.GetString2();
        this.X    = Reader.GetDouble();
        this.Y    = Reader.GetDouble();

        this.W    = Reader.GetDouble();
        this.H    = Reader.GetDouble();

        this.Paddings.Left   = Reader.GetDouble();
        this.Paddings.Right  = Reader.GetDouble();
        this.Paddings.Top    = Reader.GetDouble();
        this.Paddings.Bottom = Reader.GetDouble();

        this.PageNum         = Reader.GetLong();
        this.Img             = Reader.GetString2();
        this.ImageTrackType  = Reader.GetLong();

        var LinkData = new Object();
        LinkData.Parent = Reader.GetString2();
        CollaborativeEditing.Add_LinkData( this, LinkData );

        CollaborativeEditing.Add_NewImage( this.Img );

        this.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
    },

    Load_LinkData : function(LinkData)
    {
        this.Parent = g_oTableId.Get_ById(LinkData.Parent);
    }
};


function FlowTable(PageController, Table, DrawingDocument, LogicDocument, X, Y, XLimit, YLimit, PageNum, Rows, Cols, TableGrid, bRecalculate)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.DrawingDocument = DrawingDocument;
    this.LogicDocument   = LogicDocument;
    this.Parent          = LogicDocument; // переделать

    this.PageNum = PageNum;

    this.Paddings =
    {
        Left   : 0,
        Right  : 0,
        Top    : 0,
        Bottom : 0
    };

    if ( "undefined" === typeof(Table) || null === Table )
        this.Table = new CTable(DrawingDocument, this, false, PageNum, X, Y, XLimit, YLimit, Rows, Cols, TableGrid );
    else
        this.Table = Table;

    this.X = X;
    this.Y = Y;

    this.XLimit = XLimit;
    this.YLimit = YLimit;

    this.H = this.YLimit - this.Y;
    this.W = this.XLimit - this.X;

    this.TopObject = this;
    this.PageController = PageController;

    this.TurnOffRecalc = false;

    if ( 0 === PageController )
    {
        // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
        g_oTableId.Add( this, this.Id );
    }

    if ( 0 === PageController )
    {
        this.Pages = new Array();
        this.Pages[0] = this.Id;

        this.TurnOffRecalc = true;
        if ( true === bRecalculate )
            this.Table.Recalculate();
        this.TurnOffRecalc = false;

        this.Internal_UpdatePages( 0 );
    }
}

FlowTable.prototype =
{
    Get_Type : function()
    {
        return flowobject_Table;
    },

    Get_Id : function()
    {
        return this.Id;
    },

    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Get_PageNum : function()
    {
        return this.PageNum;
    },

    Get_Styles : function()
    {
        return this.LogicDocument.Get_Styles();
    },

    Get_Numbering : function()
    {
        return this.LogicDocument.Get_Numbering();
    },

    Set_CurrentElement : function(Index)
    {
        if ( 0 != this.PageController )
            return this.TopObject.Set_CurrentElement( Index );

        var Doc = this.LogicDocument;
        var FlowPos = Doc.Pages[this.PageNum].FlowObjects.Get_Index_ById( this.Id );
        if ( -1 === FlowPos )
            return;
        
        if ( Doc.CurPos.Type == docpostype_FlowObjects )
            Doc.Selection.Data.FlowObject.Blur();

        Doc.Selection_Remove();
        Doc.CurPos.Type       = docpostype_FlowObjects;
        Doc.CurPos.ContentPos = FlowPos;
        Doc.CurPage = this.PageNum;

        Doc.Selection.Start = false;
        Doc.Selection.Use   = true;
        Doc.Selection.Flag  = selectionflag_Common;

        Doc.Selection.Data  =
        {
            PageNum    : Doc.CurPage,
            FlowObject : this,
            Pos        : FlowPos
        };

        Doc.Document_UpdateInterfaceState();
        Doc.Document_UpdateRulersState();
        Doc.Document_UpdateSelectionState();
    },

    DeleteThis : function()
    {
        if ( 0 != this.PageController )
            return this.TopObject.DeleteThis();

        // Удаляем записи о данной таблице
        for ( var Index = 0; Index < this.Pages.length; Index++ )
        {
            var PageFlowObjects = this.LogicDocument.Pages[this.PageNum + Index].FlowObjects;
            PageFlowObjects.Remove_ById( this.Pages[Index] );
        }

        return this.PageNum;
    },

    Recalculate : function(bFromUndoRedo)
    {
        this.Table.Recalculate();
        if ( true != bFromUndoRedo )
            this.Internal_UpdatePages( 0 );
    },

    // PageNum - номер страницы, на которой произошли изменения
    // (номер относительно текущего элемента, т.е. первая страница,
    // где расположен данный элеменет - 0)
    OnContentRecalculate : function ( bNeedDocumentRecalc, PageNum, DocumentIndex )
    {
        if ( true === this.TurnOffRecalc )
            return;

        if ( 0 != this.PageController )
            return this.TopObject.OnContentRecalculate( bNeedDocumentRecalc, PageNum );

        this.Internal_UpdatePages( PageNum );

        this.LogicDocument.NeedUpdateTarget = true;

        if ( bNeedDocumentRecalc )
        {
            this.LogicDocument.ContentLastChangePos = this.LogicDocument.Pages[this.PageNum + PageNum].Pos;
            this.LogicDocument.Recalculate();
        }
        else
        {
            // TODO: Сделать перерисовку только измененных страниц
            for ( var Index = PageNum; Index < this.Pages.length; Index++ )
                this.DrawingDocument.OnRecalculatePage( this.PageNum + Index, this.LogicDocument.Pages[this.PageNum + Index] );

            this.DrawingDocument.OnEndRecalculate(false, true);
        }
    },

    OnContentReDraw : function(StartPage, EndPage)
    {
        this.LogicDocument.ReDraw( StartPage, EndPage );
    },

    RecalculateCurPos : function()
    {
        this.Table.RecalculateCurPos();
    },

    Get_NearestPos : function( PageNum, X, Y )
    {
        return this.Table.Get_NearestPos( PageNum, X, Y );
    },

    Get_PageContentStartPos : function(PageNum)
    {
        return this.LogicDocument.Get_PageContentStartPos( this.PageNum + PageNum );
    },

    Update_Position : function(X,Y)
    {
        //this.X = X;
        //this.Y = Y;

        this.Set_Position( X, Y );
    },

    Update_Position2 : function(X,Y,PageNum)
    {
        this.Set_Position( X, Y );

        var PageNum_old = this.PageNum;

        var ContentLastChangePos = this.LogicDocument.Pages[Math.min( PageNum, PageNum_old)].Pos;

        // Удалим со старой страницы запись о таблице
        for ( var Index = 0; Index < this.Pages.length; Index++ )
        {
            var PageFlowObjects = this.LogicDocument.Pages[this.PageNum + Index].FlowObjects;
            PageFlowObjects.Remove_ById( this.Pages[Index] );
        }
        this.Pages.length = 1;

        // Добавим на новую страницу запись о таблицу
        this.Set_PageNum( PageNum );
        var PageFlowObjects = this.LogicDocument.Pages[PageNum].FlowObjects;
        var FlowPos = PageFlowObjects.Add( this );

        // Обновляем страницы

        this.LogicDocument.Set_CurPage( PageNum );
        if ( this.LogicDocument.CurPos.Type == docpostype_FlowObjects && this.LogicDocument.Selection.Data.Pos != FlowPos )
        {
            this.LogicDocument.Selection.Data.FlowObject.Blur();
        }

        this.LogicDocument.CurPos.Type       = docpostype_FlowObjects;
        this.LogicDocument.CurPos.ContentPos = FlowPos;

        // Прячем курсор
        this.DrawingDocument.SetCurrentPage( this.LogicDocument.Get_CurPage() );

        this.LogicDocument.Selection.Start = false;
        this.LogicDocument.Selection.Use   = true;
        this.LogicDocument.Selection.Flag  = selectionflag_Common;

        this.LogicDocument.Selection.Data  =
        {
            PageNum    : this.LogicDocument.Get_CurPage(), // Номер страницы, на которой находится выделенный объект
            FlowObject : this,                             // Указатель на выделенный объект
            Pos        : FlowPos                           // Номер выделенного объекта в списке объектов страницы
        };

        this.Internal_UpdatePages( 0 );

        this.LogicDocument.NeedUpdateTarget = true;

        this.LogicDocument.ContentLastChangePos = ContentLastChangePos;
        this.LogicDocument.Recalculate();

    },

    Update_CursorType : function(X, Y, PageNum)
    {
        return this.Table.Update_CursorType( X, Y, PageNum );
    },

    DocumentSearch : function(Str, Type)
    {
        this.Table.DocumentSearch(Str, Type);
    },

    Document_CreateFontMap : function(FontMap)
    {
        this.Table.Document_CreateFontMap(FontMap);
    },

    Document_UpdateInterfaceState : function()
    {
        this.Table.Document_UpdateInterfaceState();
    },

    Document_UpdateSelectionState : function()
    {
        if ( true === this.Table.Is_SelectionUse() )
        {
            if ( table_Selection_Border === this.Table.Selection.Type2 || table_Selection_Border_InnerTable === this.Table.Selection.Type2 )
            {
                // Убираем курсор, если он был
                this.DrawingDocument.TargetEnd();
            }
            else
            {
                if ( false === this.Table.Selection_IsEmpty() )
                {
                    this.DrawingDocument.TargetEnd();
                    this.DrawingDocument.SelectEnabled(true);
                    this.DrawingDocument.SelectClear();

                    this.Table.Selection_Draw();

                    this.DrawingDocument.SelectShow();
                }
                else
                {
                    this.Table.RecalculateCurPos();
                    this.DrawingDocument.SelectEnabled(false);
                    this.DrawingDocument.TargetStart();
                    this.DrawingDocument.TargetShow();
                }
            }
        }
        else
        {
            this.Table.RecalculateCurPos();
            this.DrawingDocument.SelectEnabled(false);
            this.DrawingDocument.TargetStart();
            this.DrawingDocument.TargetShow();
        }
    },

    Is_TopDocument : function()
    {
        return true;
    },

    Is_UseInDocument : function(Id)
    {
        if ( this.LogicDocument != null )
        {
            var FlowObjects = this.LogicDocument.Pages[this.PageNum].FlowObjects;
            if ( -1 != FlowObjects.Get_Index_ById(this.Get_Id() ) )
                return true;

            return false;
        }

        return false;
    },

//-----------------------------------------------------------------------------------
// Функции для работы с номерами страниц
//-----------------------------------------------------------------------------------
    Get_StartPage_Absolute : function()
    {
        return this.Parent.Get_StartPage_Absolute();
    },

//-----------------------------------------------

    CheckRange_OnFirstPage : function()
    {
        if ( 0 != this.PageController || 1 === this.Table.Pages.length || ( this.Table.Pages.length > 1 && ( 0 != this.Table.Pages[1].FirstRow || true === this.Table.RowsInfo[0].FirstPage ) ) )
        {
            return true;
        }

        return false;
    },

    // Функция проверяет лежит ли данная точка внутри таблицы
    IsPointIn : function(X,Y)
    {
        if ( true === this.CheckRange_OnFirstPage() )
        {
            if ( this.Y <= Y && this.Y + this.H >= Y && this.X <= X && this.X + this.W >= X  )
                return true;
        }

        return false;
    },

    // Отрисовка таблицы
    Draw : function(pGraphics)
    {
        this.Table.Draw(this.PageNum + this.PageController, pGraphics);
    },

    // Ставим фокус на таблице
    Focus : function(X,Y)
    {
    },

    // Убираем фокус с таблицы
    Blur : function()
    {
        this.Table.Selection_Remove();
    },

    // Обработка mousedown
    Move_Start : function(X,Y, MouseEvent)
    {
        this.Table.Selection_SetStart( X, Y, this.PageController + this.PageNum, MouseEvent );
    },

    // Обработка mousemove (при зажатой mousedown)
    Move : function(X,Y, PageNum, MouseEvent)
    {
        this.Table.Selection_SetEnd( X, Y, PageNum, MouseEvent );
    },

    // Обработка mouseup
    Move_End : function(X,Y, PageNum, MouseEvent)
    {
        this.Table.Selection_SetEnd( X, Y, PageNum, MouseEvent );
        this.Table.Selection_Stop( X, Y, PageNum, MouseEvent );
    },

    Selection_Draw : function()
    {
        this.Table.Selection_Draw();
    },

    Selection_Remove : function()
    {
        this.Table.Selection_Remove();
    },

    Selection_Is_OneElement : function()
    {
        return true;
    },

    Internal_Update : function()
    {
        this.Table.Recalculate();
        this.Internal_UpdateBounds();
    },

    Internal_UpdateBounds : function()
    {
        var Bounds = this.Table.Get_PageBounds( this.PageController );
        this.W = Bounds.Right - Bounds.Left;
        this.H = Bounds.Bottom - Bounds.Top;

        if ( 0 === this.PageController )
        {
            for ( var Index = 1; Index < this.Pages.length; Index++ )
            {
                var PageFlowObjects = this.LogicDocument.Pages[this.PageNum + Index].FlowObjects;
                var FlowObject = PageFlowObjects.Get_ById( this.Pages[Index] );
                FlowObject.Internal_UpdateBounds();
            }
        }
    },

    Internal_UpdatePages : function(PageNum)
    {
        // Сначала удалим записи в родительском классе о переносе данной таблицы на страницы
        // начиная с PageNum
        for ( var Index = (PageNum > 0 ? PageNum : 1); Index < this.Pages.length; Index++ )
        {
            var PageFlowObjects = this.LogicDocument.Pages[this.PageNum + Index].FlowObjects;
            PageFlowObjects.Remove_ById( this.Pages[Index] );
        }

        this.Pages.length = ( PageNum > 0 ? PageNum : 1 );

        var PagesCount = this.Table.Get_PagesCount();
        for ( var Index = PageNum; Index < PagesCount; Index++ )
        {
            var Bounds = this.Table.Get_PageBounds(Index);
            if ( 0 === Index )
            {
                // Просто обновляем границы
                this.W = Bounds.Right - Bounds.Left;
                this.H = Bounds.Bottom - Bounds.Top;
            }
            else
            {
                // Добавляем в родительском класс новые записи о переносе таблицы
                var NewFlowTable = new FlowTable( Index, this.Table, this.DrawingDocument, this.LogicDocument, Bounds.Left, Bounds.Top, Bounds.Right, Bounds.Bottom, this.PageNum, 0, 0, null, true );
                NewFlowTable.TopObject = this;
                if ( "undefined" === typeof(this.LogicDocument.Pages[this.PageNum + Index]) )
                {
                    this.LogicDocument.Pages[this.PageNum + Index] = new Object();
                    this.LogicDocument.Pages[this.PageNum + Index].FlowObjects = new FlowObjects(this.LogicDocument, this.PageNum + Index);

                    this.LogicDocument.Pages[this.PageNum + Index].Width   = Page_Width;
                    this.LogicDocument.Pages[this.PageNum + Index].Height  = Page_Height;
                    this.LogicDocument.Pages[this.PageNum + Index].Margins =
                    {
                        Left   : X_Left_Field,
                        Right  : X_Right_Field,
                        Top    : Y_Top_Field,
                        Bottom : Y_Bottom_Field
                    };
                    this.LogicDocument.Pages[this.PageNum + Index].Pos = 0;
                }
                
                this.LogicDocument.Pages[this.PageNum + Index].FlowObjects.Add( NewFlowTable );
                this.Pages[Index] = NewFlowTable.Get_Id();
            }
        }
    },

//-----------------------------------------------------------------------------------
// Работаем с содержимым таблицы
//-----------------------------------------------------------------------------------

    Add_NewParagraph : function()
    {
        this.Table.Add_NewParagraph();
    },

    Add_FlowImage : function(W, H, Img)
    {
        this.Table.Add_FlowImage(W,H,Img);
    },

    Add_InlineImage : function(W, H, Img)
    {
        this.Table.Add_InlineImage(W,H,Img);
    },

    Paragraph_Add : function( ParaItem, bRecalculate )
    {
        // PageBreak убираем из таблицы
        if ( para_NewLine === ParaItem.Type && break_Page === ParaItem.BreakType )
            return;

        this.Table.Paragraph_Add( ParaItem, bRecalculate );
    },

    Remove : function(Count, bOnlyText, bRemoveOnlySelection)
    {
        this.Table.Remove(Count, bOnlyText, bRemoveOnlySelection);
    },

    Cursor_MoveAt : function(X, Y, PageNum)
    {
        return this.Table.Cursor_MoveAt( X, Y, false, false, PageNum );
    },

    Cursor_MoveLeft : function(AddToSelect, Word)
    {
        return this.Table.Cursor_MoveLeft( 1, AddToSelect, Word );
    },

    Cursor_MoveRight : function(AddToSelect, Word)
    {
        return this.Table.Cursor_MoveRight( 1, AddToSelect, Word );
    },

    Cursor_MoveUp : function(AddToSelect)
    {
        return this.Table.Cursor_MoveUp( 1, AddToSelect );
    },

    Cursor_MoveDown : function(AddToSelect)
    {
        return this.Table.Cursor_MoveDown( 1, AddToSelect );
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        return this.Table.Cursor_MoveEndOfLine( AddToSelect );
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        return this.Table.Cursor_MoveStartOfLine( AddToSelect );
    },

    Set_ParagraphAlign : function(Align)
    {
        return this.Table.Set_ParagraphAlign( Align );
    },

    Set_ParagraphSpacing : function(Spacing)
    {
        return this.Table.Set_ParagraphSpacing( Spacing );
    },

    Set_ParagraphIndent : function(Ind)
    {
        return this.Table.Set_ParagraphIndent( Ind );
    },

    Set_ParagraphNumbering : function(NumInfo)
    {
        return this.Table.Set_ParagraphNumbering( NumInfo );
    },

    Set_ParagraphShd : function(Shd)
    {
        return this.Table.Set_ParagraphShd( Shd );
    },

    Set_ParagraphStyle : function(Name)
    {
        return this.Table.Set_ParagraphStyle( Name );
    },

    Set_ParagraphTabs : function(Tabs)
    {
        return this.Table.Set_ParagraphTabs( Tabs );
    },

    Set_ParagraphContextualSpacing : function(Value)
    {
        return this.Table.Set_ParagraphContextualSpacing( Value );
    },

    Set_ParagraphPageBreakBefore : function(Value)
    {
        return this.Table.Set_ParagraphPageBreakBefore( Value );
    },

    Set_ParagraphKeepLines : function(Value)
    {
        return this.Table.Set_ParagraphKeepLines( Value );
    },

    Get_CurrentParagraph : function()
    {
        return this.Table.Get_CurrentParagraph();
    },

//-----------------------------------------------------------------------------------
// Функции для работы с параметрами
//-----------------------------------------------------------------------------------
    Set_Position : function(X, Y)
    {
        History.Add( this, { Type : historyitem_FlowTable_Position, New : { X : X, Y : Y }, Old : { X : this.X, Y : this.Y } } );
        this.X = X;
        this.Y = Y;
    },

    Set_Paddings : function(Left, Right, Top, Bottom)
    {
        History.Add( this,
            {
                Type : historyitem_FlowTable_Paddings,
                New  :
                {
                    Left   : null != Left   ? Left   : this.Paddings.Left,
                    Right  : null != Right  ? Right  : this.Paddings.Right,
                    Top    : null != Top    ? Top    : this.Paddings.Top,
                    Bottom : null != Bottom ? Bottom : this.Paddings.Bottom
                },
                Old :
                {
                    Left   : this.Paddings.Left,
                    Right  : this.Paddings.Right,
                    Top    : this.Paddings.Top,
                    Bottom : this.Paddings.Bottom
                }
            } );

        this.Paddings.Left   = Left;
        this.Paddings.Right  = Right;
        this.Paddings.Top    = Top;
        this.Paddings.Bottom = Bottom;
    },

    Set_PageNum : function(PageNum)
    {
        History.Add( this, { Type : historyitem_FlowTable_PageNum, New : PageNum, Old : this.PageNum } );
        this.PageNum = PageNum;
    },

    Set_Parent : function(Parent)
    {
        History.Add( this, { Type : historyitem_FlowTable_Parent, New : Parent, Old : Parent } );
        this.Parent = Parent;
    },

//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_FlowTable_Position:
            {
                this.X = Data.Old.X;
                this.Y = Data.Old.Y;

                this.Table.X = this.X;
                this.Table.Y = this.Y;

                this.Pages[0].X = this.X;
                this.Pages[0].Y = this.Y;

                break;
            }

            case historyitem_FlowTable_Paddings:
            {
                this.Paddings.Left   = Data.Old.Left;
                this.Paddings.Right  = Data.Old.Right;
                this.Paddings.Top    = Data.Old.Top;
                this.Paddings.Bottom = Data.Old.Bottom;
                break;
            }

            case historyitem_FlowTable_PageNum:
            {
                this.PageNum = Data.Old;
                this.Table.PageNum = Data.Old;
                break;
            }

            case historyitem_FlowTable_Parent:
            {
                this.Parent = Data.Old;
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
            case historyitem_FlowTable_Position:
            {
                this.X = Data.New.X;
                this.Y = Data.New.Y;

                this.Table.X = this.X;
                this.Table.Y = this.Y;

                this.Pages[0].X = this.X;
                this.Pages[0].Y = this.Y;

                break;
            }

            case historyitem_FlowTable_Paddings:
            {
                this.Paddings.Left   = Data.New.Left;
                this.Paddings.Right  = Data.New.Right;
                this.Paddings.Top    = Data.New.Top;
                this.Paddings.Bottom = Data.New.Bottom;
                break;
            }

            case historyitem_FlowTable_PageNum:
            {
                this.PageNum = Data.New;
                this.Table.PageNum = Data.New;
                break;
            }

            case historyitem_FlowTable_Parent:
            {
                this.Parent = Data.New;
                break;
            }
        }

        History.RecalcData_Add( this.Get_ParentObject_or_DocumentPos() );
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        if ( 0 != this.PageController )
            return this.TopObject.Get_ParentObject_or_DocumentPos();
        else
            return { Type : historyrecalctype_Flow, Data : this };
    },
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------
    Document_Is_SelectionLocked : function(CheckType)
    {
        this.Table.Document_Is_SelectionLocked(CheckType);
    },

    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_FlowTable );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_FlowTable_Position:
            {
                // Double : X
                // Double : Y

                Writer.WriteDouble( Data.New.X );
                Writer.WriteDouble( Data.New.Y );

                break;
            }

            case historyitem_FlowTable_Paddings:
            {
                // Double : Left
                // Double : Right
                // Double : Top
                // Double : Bottom

                Writer.WriteDouble( Data.New.Left );
                Writer.WriteDouble( Data.New.Right );
                Writer.WriteDouble( Data.New.Top );
                Writer.WriteDouble( Data.New.Bottom );

                break;
            }

            case historyitem_FlowTable_PageNum:
            {
                // Long : PageNum

                Writer.WriteLong( Data.New );

                break;
            }

            case historyitem_FlowTable_Parent:
            {
                // String : Id

                Writer.WriteString2( Data.New );

                break;
            }
        }

        return Writer;
    },

    Save_Changes2 : function(Data, Writer)
    {
        return false;
    },

    Load_Changes : function(Reader, Reader2)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_FlowTable != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_FlowTable_Position:
            {
                // Double : X
                // Double : Y

                var _X = Reader.GetDouble();
                var _Y = Reader.GetDouble();

                this.X = _X;
                this.Y = _Y;

                this.Table.X = _X;
                this.Table.Y = _Y;

                this.Pages[0].X = _X;
                this.Pages[0].Y = _Y;

                break;
            }

            case historyitem_FlowTable_Paddings:
            {
                // Double : Left
                // Double : Right
                // Double : Top
                // Double : Bottom

                this.Paddings.Left   = Reader.GetDouble();
                this.Paddings.Right  = Reader.GetDouble();
                this.Paddings.Top    = Reader.GetDouble();
                this.Paddings.Bottom = Reader.GetDouble();

                break;
            }

            case historyitem_FlowTable_PageNum:
            {
                // Long : PageNum

                var _PageNum = Reader.GetLong();

                this.PageNum       = _PageNum;
                this.Table.PageNum = _PageNum;
                break;
            }

            case historyitem_FlowTable_Parent:
            {
                // String : Id

                var LinkData = new Object();
                LinkData.Parent = Reader.GetString2();
                CollaborativeEditing.Add_LinkData( this, LinkData );

                break;
            }
        }
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_FlowTable );

        // Long     : flowobject_Table
        // String   : Id
        // String   : Id родительского класса
        // Long     : PageNum
        // Double   : Paddings.Left
        // Double   : Paddings.Right
        // Double   : Paddings.Top
        // Double   : Paddings.Bottom
        // Double   : X
        // Double   : Y
        // Double   : XLimit
        // Double   : YLimit
        // String   : Id Table

        Writer.WriteLong( flowobject_Table );
        Writer.WriteString2( this.Id );
        Writer.WriteString2( this.Parent.Get_Id() );
        Writer.WriteLong( this.PageNum );
        Writer.WriteDouble( this.Paddings.Left );
        Writer.WriteDouble( this.Paddings.Right );
        Writer.WriteDouble( this.Paddings.Top );
        Writer.WriteDouble( this.Paddings.Bottom );
        Writer.WriteDouble( this.X );
        Writer.WriteDouble( this.Y );
        Writer.WriteDouble( this.XLimit );
        Writer.WriteDouble( this.YLimit );
        Writer.WriteString2( this.Table.Get_Id() );
    },

    Read_FromBinary2 : function(Reader)
    {
        // Long     : flowobject_Table (это читается вне данной функции)
        // String   : Id
        // String   : Id родительского класса
        // Long     : PageNum
        // Double   : Paddings.Left
        // Double   : Paddings.Right
        // Double   : Paddings.Top
        // Double   : Paddings.Bottom
        // Double   : X
        // Double   : Y
        // Double   : XLimit
        // Double   : YLimit
        // String   : Id Table

        Reader.GetLong();

        this.Id = Reader.GetString2();

        var LinkData = new Object();
        LinkData.Parent = Reader.GetString2();

        this.PageNum = Reader.GetLong();        this.Paddings.Left   = Reader.GetDouble();
        this.Paddings.Right  = Reader.GetDouble();
        this.Paddings.Top    = Reader.GetDouble();
        this.Paddings.Bottom = Reader.GetDouble();

        this.X      = Reader.GetDouble();
        this.Y      = Reader.GetDouble();
        this.XLimit = Reader.GetDouble();
        this.YLimit = Reader.GetDouble();

        this.H = this.YLimit - this.Y;
        this.W = this.XLimit - this.X;

        LinkData.Table = Reader.GetString2();

        CollaborativeEditing.Add_LinkData( this, LinkData );

        this.PageController = 0;

        this.Pages = new Array();
        this.Pages[0] = this.Id;
        this.Internal_UpdatePages( 0 );

        this.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
        this.LogicDocument   = editor.WordControl.m_oLogicDocument;
    },

    Load_LinkData : function(LinkData)
    {
        if ( "undefined" != typeof(LinkData.Parent) )
            this.Parent = g_oTableId.Get_ById( LinkData.Parent );

        if ( "undefined" != typeof(LinkData.Table) )
        {
            this.Table = g_oTableId.Get_ById( LinkData.Table );

            // Код взят из CTable.Move
            this.Table.X_origin = this.X;
            var Dx = this.Table.Get_TableOffsetCorrection();

            this.Table.X = this.X + Dx;
            this.Table.Y = this.Y;
            this.Table.XLimit = this.XLimit;
            this.Table.YLimit = this.YLimit;

            this.Table.PageNum = this.PageNum;

            this.Table.Pages.length = 1;
            this.Table.Pages[0] =
            {
                X         : this.Table.X,
                Y         : this.Table.Y,
                XLimit    : this.Table.XLimit,
                YLimit    : this.Table.YLimit
            };
        }
    }
}


function CFlowTable2(Table, PageIndex)
{
    this.Table          = Table;
    this.Id             = Table.Get_Id();
    this.PageNum        = Table.PageNum;
    this.PageController = PageIndex - this.PageNum;
    this.Distance       = Table.Distance;

    var Bounds = Table.Get_PageBounds(this.PageController);
    this.X = Bounds.Left;
    this.Y = Bounds.Top;
    this.W = Bounds.Right  - Bounds.Left;
    this.H = Bounds.Bottom - Bounds.Top;
};

CFlowTable2.prototype =
{

    Get_Type : function()
    {
        return flowobject_Table;
    },

    IsPointIn : function(X,Y)
    {
        if ( X <= this.X + this.W && X >= this.X && Y >= this.Y && Y <= this.Y + this.H )
            return true;

        return false;
    },

    Update_CursorType : function(X, Y, PageIndex)
    {

    }

};

function CFlowParagraph(Paragraph, X, Y, W, H, Dx, Dy)
{
    this.Table     = Paragraph;
    this.Paragraph = Paragraph;
    this.Id        = Paragraph.Get_Id();

    this.PageNum   = Paragraph.PageNum;
    this.PageController = 0;

    this.Distance =
    {
        T : Dy,
        B : Dy,
        L : Dx,
        R : Dx
    };

    this.X = X;
    this.Y = Y;
    this.W = W;
    this.H = H;
}

CFlowParagraph.prototype =
{
    Get_Type : function()
    {
        return flowobject_Paragraph;
    },

    IsPointIn : function(X,Y)
    {
        if ( X <= this.X + this.W && X >= this.X && Y >= this.Y && Y <= this.Y + this.H )
            return true;

        return false;
    },

    Update_CursorType : function(X, Y, PageIndex)
    {

    }
};