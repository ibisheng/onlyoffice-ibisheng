//     SectPr  : Настройки секци (размеры, поля)
//               PgSz : размеры страницы
//                     W, H, Orient
//               PgMar: отступы страницы
//                      Top, Left, Right, Bottom, Header, Footer
//

var section_type_NextPage   = 0x00;
var section_type_OddPage    = 0x01;
var section_type_EvenPage   = 0x02;
var section_type_Continuous = 0x03;
var section_type_Column     = 0x04;

var section_borders_DisplayAllPages     = 0x00;
var section_borders_DisplayFirstPage    = 0x01;
var section_borders_DisplayNotFirstPage = 0x02;

var section_borders_OffsetFromPage = 0x00;
var section_borders_OffsetFromText = 0x01;

var section_borders_ZOrderBack  = 0x00;
var section_borders_ZOrderFront = 0x01;

function CSectionPr(LogicDocument)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Type          = section_type_NextPage;
    this.PageSize      = new CSectionPageSize();
    this.PageMargins   = new CSectionPageMargins();

    this.LogicDocument = LogicDocument;

    this.Borders       = new CSectionBorders();

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

CSectionPr.prototype =
{
    Get_Id : function()
    {
        return this.Id;
    },

    Copy : function(Other)
    {
        // Тип
        this.Set_Type( Other.Type );

        // Настройки страницы
        this.Set_PageSize( Other.PageSize.W, Other.PageSize.H );
        this.Set_Orientation( Other.PageSize.Orient );

        // Настройки отступов
        this.Set_PageMargins( Other.PageMargins.L, Other.PageMargins.T, Other.PageMargins.R, Other.PageMargins.B );

        // Настройки границ
        this.Set_Borders_Left( Other.Borders.Left );
        this.Set_Borders_Top( Other.Borders.Top );
        this.Set_Borders_Right( Other.Borders.Right );
        this.Set_Borders_Bottom( Other.Borders.Bottom );
        this.Set_Borders_Display( Other.Borders.Display );
        this.Set_Borders_OffsetFrom( Other.Borders.OffsetFrom );
        this.Set_Borders_ZOrder( Other.Borders.ZOrder );
    },

    Compare_PageSize : function(OtherSectionPr)
    {
        var ThisPS = this.PageSize;
        var OtherPS = OtherSectionPr.PageSize;

        if ( Math.abs( ThisPS.W - OtherPS.W ) > 0.001 || Math.abs( ThisPS.H - OtherPS.H ) > 0.001 || ThisPS.Orient !== OtherPS.Orient )
            return false;

        return true;
    },

    Set_Type : function(Type)
    {
        if ( this.Type !== Type )
        {
            History.Add(this, { Type: historyitem_Section_Type, Old: this.Type, New: Type });
            this.Type = Type;
        }
    },

    Get_Type : function()
    {
        return this.Type;
    },

    Set_PageSize : function(W, H)
    {
        if ( Math.abs( W - this.PageSize.W ) > 0.001 || Math.abs( H - this.PageSize.H ) > 0.001 )
        {
            History.Add(this, { Type: historyitem_Section_PageSize_Size, Old: { W : this.PageSize.W, H : this.PageSize.H }, New: { W : W, H : H } });

            this.PageSize.W = W;
            this.PageSize.H = H;
        }
    },

    Get_PageWidth : function()
    {
        return this.PageSize.W;
    },

    Get_PageHeight : function()
    {
        return this.PageSize.H;
    },

    Set_PageMargins : function(_L, _T, _R, _B)
    {
        // Значения могут прийти как undefined, в этом случае мы поля со значением undefined не меняем
        var L = ( undefined !== _L ? _L : this.PageMargins.Left );
        var T = ( undefined !== _T ? _T : this.PageMargins.Top );
        var R = ( undefined !== _R ? _R : this.PageMargins.Right );
        var B = ( undefined !== _B ? _B : this.PageMargins.Bottom );

        if ( Math.abs( L - this.PageMargins.Left ) > 0.001 || Math.abs( T - this.PageMargins.Top ) > 0.001 || Math.abs( R - this.PageMargins.Right ) > 0.001 || Math.abs( B - this.PageMargins.Bottom ) > 0.001 )
        {
            History.Add( this, { Type : historyitem_Section_PageMargins, Old : { L : this.PageMargins.Left, T : this.PageMargins.Top, R : this.PageMargins.Right, B : this.PageMargins.Bottom }, New : { L : L, T : T, R : R, B : B }  } );

            this.PageMargins.Left   = L;
            this.PageMargins.Top    = T;
            this.PageMargins.Right  = R;
            this.PageMargins.Bottom = B;
        }
    },

    Get_PageMargin_Left : function()
    {
        return this.PageMargins.Left;
    },

    Get_PageMargin_Right : function()
    {
        return this.PageMargins.Right;
    },

    Get_PageMargin_Top : function()
    {
        return this.PageMargins.Top;
    },

    Get_PageMargin_Bottom : function()
    {
        return this.PageMargins.Bottom;
    },

    Set_Orientation : function(Orient)
    {
        if ( this.PageSize.Orient !== Orient )
        {
            History.Add(this, { Type: historyitem_Section_PageSize_Orient, Old: this.PageSize.Orient, New: Orient });
            this.PageSize.Orient = Orient;
        }
    },

    Get_Orientation : function()
    {
        return this.PageSize.Orient;
    },

    Set_Borders_Left : function(Border)
    {
        if ( true !== this.Borders.Left.Compare( Border ) )
        {
            History.Add( this, { Type : historyitem_Section_Borders_Left, Old : this.Borders.Left, New : Border } );
            this.Borders.Left = Border;
        }
    },

    Get_Borders_Left : function()
    {
        return this.Borders.Left;
    },

    Set_Borders_Top : function(Border)
    {
        if ( true !== this.Borders.Top.Compare( Border ) )
        {
            History.Add( this, { Type : historyitem_Section_Borders_Top, Old : this.Borders.Top, New : Border } );
            this.Borders.Top = Border;
        }
    },

    Get_Borders_Top : function()
    {
        return this.Borders.Top;
    },

    Set_Borders_Right : function(Border)
    {
        if ( true !== this.Borders.Right.Compare( Border ) )
        {
            History.Add( this, { Type : historyitem_Section_Borders_Right, Old : this.Borders.Right, New : Border } );
            this.Borders.Right = Border;
        }
    },

    Get_Borders_Right : function()
    {
        return this.Borders.Right;
    },

    Set_Borders_Bottom : function(Border)
    {
        if ( true !== this.Borders.Bottom.Compare( Border ) )
        {
            History.Add( this, { Type : historyitem_Section_Borders_Bottom, Old : this.Borders.Bottom, New : Border } );
            this.Borders.Bottom = Border;
        }
    },

    Get_Borders_Bottom : function()
    {
        return this.Borders.Bottom;
    },

    Set_Borders_Display : function(Display)
    {
        if ( Display !== this.Borders.Display )
        {
            History.Add( this, { Type : historyitem_Section_Borders_Display, Old : this.Borders.Display, New : Display } );
            this.Borders.Display = Display;
        }
    },

    Get_Borders_Display : function()
    {
        return this.Borders.Display;
    },

    Set_Borders_OffsetFrom : function(OffsetFrom)
    {
        if ( OffsetFrom !== this.Borders.OffsetFrom )
        {
            History.Add( this, { Type : historyitem_Section_Borders_OffsetFrom, Old : this.Borders.OffsetFrom, New : OffsetFrom } );
            this.Borders.OffsetFrom = OffsetFrom;
        }
    },

    Get_Borders_OffsetFrom : function()
    {
        return this.Borders.OffsetFrom;
    },

    Set_Borders_ZOrder : function(ZOrder)
    {
        if ( ZOrder !== this.Borders.ZOrder )
        {
            History.Add( this, { Type : historyitem_Section_Borders_ZOrder, Old : this.Borders.ZOrder, New : ZOrder } );
            this.Borders.ZOrder = ZOrder;
        }
    },

    Get_Borders_ZOrder : function()
    {
        return this.Borders.ZOrder;
    },
//----------------------------------------------------------------------------------------------------------------------
// Undo/Redo функции
//----------------------------------------------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch (Type)
        {
            case historyitem_Section_PageSize_Orient :
            {
                this.PageSize.Orient = Data.Old;

                break;
            }

            case  historyitem_Section_PageSize_Size:
            {
                this.PageSize.W = Data.Old.W;
                this.PageSize.H = Data.Old.H;

                break;
            }

            case historyitem_Section_PageMargins:
            {
                this.PageMargins.Left   = Data.Old.L;
                this.PageMargins.Top    = Data.Old.T;
                this.PageMargins.Right  = Data.Old.R;
                this.PageMargins.Bottom = Data.Old.B;

                break;
            }

            case historyitem_Section_Type:
            {
                this.Type = Data.Old;

                break;
            }

            case historyitem_Section_Borders_Left:
            {
                this.Borders.Left = Data.Old;
                break;
            }

            case historyitem_Section_Borders_Top:
            {
                this.Borders.Top = Data.Old;
                break;
            }

            case historyitem_Section_Borders_Right:
            {
                this.Borders.Right = Data.Old;
                break;
            }

            case historyitem_Section_Borders_Bottom:
            {
                this.Borders.Bottom = Data.Old;
                break;
            }

            case historyitem_Section_Borders_Display:
            {
                this.Borders.Display = Data.Old;
                break;
            }

            case historyitem_Section_Borders_OffsetFrom:
            {
                this.Borders.OffsetFrom = Data.Old;
                break;
            }

            case historyitem_Section_Borders_ZOrder:
            {
                this.Borders.ZOrder = Data.Old;
                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch (Type)
        {
            case historyitem_Section_PageSize_Orient :
            {
                this.PageSize.Orient = Data.New;

                break;
            }

            case  historyitem_Section_PageSize_Size:
            {
                this.PageSize.W = Data.New.W;
                this.PageSize.H = Data.New.H;

                break;
            }

            case historyitem_Section_PageMargins:
            {
                this.PageMargins.Left   = Data.New.L;
                this.PageMargins.Top    = Data.New.T;
                this.PageMargins.Right  = Data.New.R;
                this.PageMargins.Bottom = Data.New.B;

                break;
            }

            case historyitem_Section_Type:
            {
                this.Type = Data.New;

                break;
            }

            case historyitem_Section_Borders_Left:
            {
                this.Borders.Left = Data.New;
                break;
            }

            case historyitem_Section_Borders_Top:
            {
                this.Borders.Top = Data.New;
                break;
            }

            case historyitem_Section_Borders_Right:
            {
                this.Borders.Right = Data.New;
                break;
            }

            case historyitem_Section_Borders_Bottom:
            {
                this.Borders.Bottom = Data.New;
                break;
            }

            case historyitem_Section_Borders_Display:
            {
                this.Borders.Display = Data.New;
                break;
            }

            case historyitem_Section_Borders_OffsetFrom:
            {
                this.Borders.OffsetFrom = Data.New;
                break;
            }

            case historyitem_Section_Borders_ZOrder:
            {
                this.Borders.ZOrder = Data.New;
                break;
            }

        }
    },

    Refresh_RecalcData : function(Data)
    {
        // Найдем данную секцию в документе
        var Index = this.LogicDocument.SectionsInfo.Find( this );

        if ( -1 === Index )
            return;

        if ( 0 === Index )
        {
            // Первая секция, значит мы должны пересчитать начиная с самого начала документа
            this.LogicDocument.Refresh_RecalcData2(0, 0);
        }
        else
        {
            // Ищем номер элемента, на котором закончилась предыдущая секция, начиная со следующего после него элемента
            // и пересчитываем документ.
            var DocIndex = this.LogicDocument.SectionsInfo.Elements[Index - 1].Index + 1;
            this.LogicDocument.Refresh_RecalcData2( DocIndex, 0 );
        }
    },
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_Section );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_Section_PageSize_Orient:
            {
                // Byte : Orient
                Writer.WriteByte( Data.New );

                break;
            }

            case  historyitem_Section_PageSize_Size:
            {
                // Double : W
                // Double : H
                Writer.WriteDouble(Data.New.W);
                Writer.WriteDouble(Data.New.H);

                break;
            }

            case historyitem_Section_PageMargins:
            {
                // Double : Left
                // Double : Top
                // Double : Right
                // Double : Bottom

                Writer.WriteDouble( Data.New.L );
                Writer.WriteDouble( Data.New.T );
                Writer.WriteDouble( Data.New.R );
                Writer.WriteDouble( Data.New.B );

                break;
            }

            case historyitem_Section_Type:
            {
                // Byte : Type
                Writer.WriteByte( Data.New );

                break;
            }

            case historyitem_Section_Borders_Left:
            case historyitem_Section_Borders_Top:
            case historyitem_Section_Borders_Right:
            case historyitem_Section_Borders_Bottom:
            {
                // Variable : CDocumentBorder
                Data.New.Write_ToBinary( Writer );
                break;
            }

            case historyitem_Section_Borders_Display:
            case historyitem_Section_Borders_OffsetFrom:
            case historyitem_Section_Borders_ZOrder:
            {
                // Byte : Value
                Writer.WriteByte( Data.New );
                break;
            }
        }

    },

    Load_Changes : function(Reader)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_Section != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case  historyitem_Section_PageSize_Orient:
            {
                // Byte : Orient
                this.PageSize.Orient = Reader.GetByte();

                break;
            }

            case  historyitem_Section_PageSize_Size:
            {
                // Double : W
                // Double : H
                this.PageSize.W = Reader.GetDouble();
                this.PageSize.H = Reader.GetDouble();

                break;
            }

            case historyitem_Section_PageMargins:
            {
                // Double : Left
                // Double : Top
                // Double : Right
                // Double : Bottom

                this.PageMargins.Left   = Reader.GetDouble();
                this.PageMargins.Top    = Reader.GetDouble();
                this.PageMargins.Right  = Reader.GetDouble();
                this.PageMargins.Bottom = Reader.GetDouble();

                break;
            }

            case historyitem_Section_Type:
            {
                // Byte : Type
                this.Type = Reader.GetByte();

                break;
            }

            case historyitem_Section_Borders_Left:
            {
                // Variable : CDocumentBorder
                this.Borders.Left.Read_FromBinary(Reader);
                break;
            }

            case historyitem_Section_Borders_Top:
            {
                // Variable : CDocumentBorder
                this.Borders.Top.Read_FromBinary(Reader);
                break;
            }

            case historyitem_Section_Borders_Right:
            {
                // Variable : CDocumentBorder
                this.Borders.Right.Read_FromBinary(Reader);
                break;
            }

            case historyitem_Section_Borders_Bottom:
            {
                // Variable : CDocumentBorder
                this.Borders.Bottom.Read_FromBinary(Reader);
                break;
            }

            case historyitem_Section_Borders_Display:
            {
                // Byte : Value
                this.Borders.Display = Reader.GetByte();
                break;
            }

            case historyitem_Section_Borders_OffsetFrom:
            {
                // Byte : Value
                this.Borders.OffsetFrom = Reader.GetByte();
                break;
            }

            case historyitem_Section_Borders_ZOrder:
            {
                // Byte : Value
                this.Borders.ZOrder = Reader.GetByte();
                break;
            }
        }
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_Section );

        // String2  : Id
        // String2  : Id LogicDocument
        // Variable : PageSize
        // Variable : PageMargins
        // Byte     : Type
        // Variable : Borders

        Writer.WriteString2( "" + this.Id );
        Writer.WriteString2( "" + this.LogicDocument.Get_Id() );
        this.PageSize.Write_ToBinary( Writer );
        this.PageMargins.Write_ToBinary( Writer );
        Writer.WriteByte( this.Type );
        this.Borders.Write_ToBinary( Writer );
    },

    Read_FromBinary2 : function(Reader)
    {
        // String2  : Id
        // String2  : Id LogicDocument
        // Variable : PageSize
        // Variable : PageMargins
        // Byte     : Type
        // Variable : Borders

        this.Id = Reader.GetString2();
        this.LogicDocument = g_oTable.Id.Get_ById( Reader.GetString2() );
        this.PageSize.Read_FromBinary( Reader );
        this.PageMargins.Read_FromBinary( Reader );
        this.Type = Reader.GetByte();
        this.Borders.Read_FromBinary( Reader );
    }
}

function CSectionPageSize()
{
    this.W      = 210;
    this.H      = 297;
    this.Orient = orientation_Portrait;
}

CSectionPageSize.prototype =
{
    Write_ToBinary : function(Writer)
    {
        // Double : W
        // Double : H
        // Byte   : Orient

        Writer.WriteDouble( this.W );
        Writer.WriteDouble( this.H );
        Writer.WriteByte( this.Orient );
    },

    Read_FromBinary : function(Reader)
    {
        // Double : W
        // Double : H
        // Byte   : Orient

        this.W      = Reader.GetDouble();
        this.H      = Reader.GetDouble();
        this.Orient = Reader.GetByte();
    }
};

function CSectionPageMargins()
{
    this.Left   = 30; // 3 cm
    this.Top    = 20; // 2 cm
    this.Right  = 15; // 1.5 cm
    this.Bottom = 20; // 2 cm
}

CSectionPageMargins.prototype =
{
    Write_ToBinary : function(Writer)
    {
        // Double : Left
        // Double : Top
        // Double : Right
        // Double : Bottom

        Writer.WriteDouble( this.Left );
        Writer.WriteDouble( this.Top );
        Writer.WriteDouble( this.Right );
        Writer.WriteDouble( this.Bottom );
    },

    Read_FromBinary : function(Reader)
    {
        // Double : Left
        // Double : Top
        // Double : Right
        // Double : Bottom

        this.Left   = Reader.GetDouble();
        this.Top    = Reader.GetDouble();
        this.Right  = Reader.GetDouble();
        this.Bottom = Reader.GetDouble();
    }
}

function CSectionBorders()
{
    this.Top        = new CDocumentBorder();
    this.Bottom     = new CDocumentBorder();
    this.Left       = new CDocumentBorder();
    this.Right      = new CDocumentBorder();

    this.Display    = section_borders_DisplayAllPages;
    this.OffsetFrom = section_borders_OffsetFromPage;
    this.ZOrder     = section_borders_ZOrderFront;
}

CSectionBorders.prototype =
{
    Write_ToBinary : function(Writer)
    {
        // Variable : Left
        // Variable : Top
        // Variable : Right
        // Variable : Bottom
        // Byte     : Display
        // Byte     : OffsetFrom
        // Byte     : ZOrder

        this.Left.Write_ToBinary(Writer);
        this.Top.Write_ToBinary(Writer);
        this.Right.Write_ToBinary(Writer);
        this.Bottom.Write_ToBinary(Writer);
        Writer.WriteByte(this.Display);
        Writer.WriteByte(this.OffsetFrom);
        Writer.WriteByte(this.ZOrder);
    },

    Read_FromBinary : function(Reader)
    {
        // Variable : Left
        // Variable : Top
        // Variable : Right
        // Variable : Bottom
        // Byte     : Display
        // Byte     : OffsetFrom
        // Byte     : ZOrder

        this.Left.Read_FromBinary(Reader);
        this.Top.Read_FromBinary(Reader);
        this.Right.Read_FromBinary(Reader);
        this.Bottom.Read_FromBinary(Reader);

        this.Display    = Reader.GetByte();
        this.OffsetFrom = Reader.GetByte();
        this.ZOrder     = Reader.GetByte();
    }
}