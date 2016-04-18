"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 28.12.2015
 * Time: 12:12
 */

//----------------------------------------------------------------------------------------------------------------------
// Класс CTableRow
//----------------------------------------------------------------------------------------------------------------------
function CTableRow(Table, Cols, TableGrid)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Table = Table; // Родительский класс таблицы

    this.Next = null;
    this.Prev = null;

    this.Content = [];
    for ( var Index = 0; Index < Cols; Index++ )
    {
        var ColW = ( undefined != TableGrid && undefined != TableGrid[Index] ? TableGrid[Index] : undefined );
        this.Content[Index] = new CTableCell( this, ColW );
    }

    this.Internal_ReIndexing();

    // Информация о рассчитанных метриках ячеек
    this.CellsInfo = [];

    // Метрика строки
    this.Metrics =
    {
        X_min : 0,
        X_max : 0
    };

    // Информация о spacing до и после текущей строки
    this.SpacingInfo = { Top : false, Bottom : false };

    this.CompiledPr =
    {
        Pr         : null,
        NeedRecalc : true
    };

    this.Pr = new CTableRowPr();

    // Данные два параметра нужны для контроля кардинальности изменений, которые
    // происходят внутри ячеек данной строки.
    this.Height     = 0;
    this.PagesCount = 1;

    // Добавляем данный класс в список DocumentContent'ов
    if (typeof CollaborativeEditing !== "undefined")
        CollaborativeEditing.Add_NewDC(this);
    this.m_oContentChanges = new CContentChanges(); // список изменений(добавление/удаление элементов)

    this.Index = 0;

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

CTableRow.prototype =
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

    // Создаем копию данного объекта
    Copy : function(Table)
    {
        var Row = new CTableRow(Table, 0);

        // Копируем настройки строки
        Row.Set_Pr( this.Pr.Copy() );

        // Копируем ячейки
        var CellsCount = this.Content.length;
        for ( var Index = 0; Index < CellsCount; Index++ )
        {
            Row.Content[Index] = this.Content[Index].Copy(Row);
            History.Add( Row, { Type : historyitem_TableRow_AddCell, Pos : Index, Item : { Cell : Row.Content[Index], CellInfo : {}  } } );
        }

        Row.Internal_ReIndexing();

        return Row;
    },

    Is_UseInDocument : function(Id)
    {
        var bUse = false;
        if ( null != Id )
        {
            var Count = this.Content.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                if ( Id === this.Content[Index].Get_Id() )
                {
                    bUse = true;
                    break;
                }
            }
        }
        else
            bUse = true;

        if ( true === bUse && null != this.Table )
            return this.Table.Is_UseInDocument(this.Get_Id());

        return false;
    },

    Set_Index : function(Index)
    {
        if ( Index != this.Index )
        {
            this.Index = Index;
            this.Recalc_CompiledPr();
        }
    },

    Set_Metrics_X : function(x_min, x_max)
    {
        this.Metrics.X_min = x_min;
        this.Metrics.X_max = x_max;
    },

    Get_EndInfo : function()
    {
        var CellsCount = this.Content.length;
        if ( CellsCount > 0 )
            return this.Content[CellsCount - 1].Get_EndInfo();
        else
            return null;
    },

    Get_PrevElementEndInfo : function(CellIndex)
    {
        if ( 0 === CellIndex )
            return this.Table.Get_PrevElementEndInfo( this.Index );
        else
            return this.Content[CellIndex - 1].Get_EndInfo();
    },

    Save_RecalculateObject : function()
    {
        var RecalcObj = new CTableRowRecalculateObject();
        RecalcObj.Save( this );
        return RecalcObj;
    },

    Load_RecalculateObject : function(RecalcObj)
    {
        RecalcObj.Load(this);
    },

    Prepare_RecalculateObject : function()
    {
        this.CellsInfo   = [];
        this.Metrics     = { X_min : 0, X_max : 0 };
        this.SpacingInfo = { Top : false, Bottom : false };

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.Content[Index].Prepare_RecalculateObject();
        }
    },

    PreDelete : function()
    {
        var CellsCount = this.Get_CellsCount();
        for ( var CurCell = 0; CurCell < CellsCount; CurCell++ )
        {
            var Cell = this.Get_Cell( CurCell );

            var CellContent = Cell.Content.Content;
            var ContentCount = CellContent.length;
            for ( var Pos = 0; Pos < ContentCount; Pos++ )
            {
                CellContent[Pos].PreDelete();
            }
        }
    },
    //-----------------------------------------------------------------------------------
    // Работаем с стилем строки
    //-----------------------------------------------------------------------------------
    Recalc_CompiledPr : function()
    {
        this.CompiledPr.NeedRecalc = true;
    },

    // Формируем конечные свойства параграфа на основе стиля и прямых настроек.
    Get_CompiledPr : function(bCopy)
    {
        if ( true === this.CompiledPr.NeedRecalc )
        {
            if (true === g_oIdCounter.m_bLoad || true === g_oIdCounter.m_bRead)
            {
                this.CompiledPr.Pr         = g_oDocumentDefaultTableRowPr;
                this.CompiledPr.NeedRecalc = true;
            }
            else
            {
                this.CompiledPr.Pr         = this.Internal_Compile_Pr();
                this.CompiledPr.NeedRecalc = false;
            }
        }

        if ( false === bCopy )
            return this.CompiledPr.Pr;
        else
            return this.CompiledPr.Pr.Copy(); // Отдаем копию объекта, чтобы никто не поменял извне настройки стиля
    },

    Internal_Compile_Pr : function()
    {
        var TablePr   = this.Table.Get_CompiledPr(false);
        var TableLook = this.Table.Get_TableLook();
        var CurIndex  = this.Index;

        // Сначала возьмем настройки по умолчанию для строки
        var RowPr = TablePr.TableRowPr.Copy();

        // Совместим настройки с настройками для групп строк
        if ( true === TableLook.Is_BandHor() )
        {
            var RowBandSize = TablePr.TablePr.TableStyleRowBandSize;
            var _CurIndex   = ( true != TableLook.Is_FirstRow() ? CurIndex : CurIndex - 1 )
            var GroupIndex = ( 1 != RowBandSize ? Math.floor( _CurIndex / RowBandSize ) : _CurIndex );
            if ( 0 === GroupIndex % 2 )
                RowPr.Merge(TablePr.TableBand1Horz.TableRowPr);
            else
                RowPr.Merge(TablePr.TableBand2Horz.TableRowPr);
        }

        // Совместим настройки с настройками для последней строки
        if ( true === TableLook.Is_LastRow() && this.Table.Content.length - 1 === CurIndex )
        {
            RowPr.Merge(TablePr.TableLastRow.TableRowPr);
        }

        // Совместим настройки с настройками для первой строки
        if ( true === TableLook.Is_FirstRow() && ( 0 === CurIndex || true === this.Pr.TableHeader )  )
        {
            RowPr.Merge(TablePr.TableFirstRow.TableRowPr);
        }

        // Полученные настройки совместим с прямыми настройками
        RowPr.Merge(this.Pr);

        return RowPr;
    },
    //-----------------------------------------------------------------------------------
    // Работаем с настройками строки
    //-----------------------------------------------------------------------------------
    Clear_DirectFormatting : function(bClearMerge)
    {
        // Очищаем все строки и всех ее ячеек
        if (true === bClearMerge)
        {
            this.Set_After(undefined, undefined);
            this.Set_Before(undefined, undefined);
            this.Set_Height(undefined, undefined);
        }

        this.Set_CellSpacing(undefined);

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.Content[Index].Clear_DirectFormatting(bClearMerge);
        }
    },

    Set_Pr : function(RowPr)
    {
        History.Add( this, { Type : historyitem_TableRow_Pr, Old : this.Pr, New : RowPr } );
        this.Pr = RowPr;
    },

    Get_Before : function()
    {
        var RowPr = this.Get_CompiledPr( false );

        var Before =
            {
                WBefore    : RowPr.WBefore.Copy(),
                GridBefore : RowPr.GridBefore
            };

        return Before;
    },

    Set_Before : function(GridBefore, WBefore)
    {
        // Если парметр WBefore === false, значит значение WBefore мы не меняем
        if ( this.Pr.GridBefore !== GridBefore || this.Pr.WBefore !== WBefore )
        {
            var OldBefore =
                {
                    GridBefore : ( undefined != this.Pr.GridBefore ? this.Pr.GridBefore : undefined ),
                    WBefore    : ( undefined != this.Pr.WBefore    ? this.Pr.WBefore    : undefined )
                };

            var NewBefore =
                {
                    GridBefore : ( undefined != GridBefore ? GridBefore : undefined ),
                    WBefore    : ( undefined != WBefore    ? WBefore    : undefined )
                };

            if ( false === WBefore )
                NewBefore.WBefore = OldBefore.WBefore;
            else if ( undefined != WBefore )
            {
                NewBefore.WBefore = new CTableMeasurement(tblwidth_Auto, 0);
                NewBefore.WBefore.Set_FromObject(WBefore);
            }

            History.Add( this, { Type : historyitem_TableRow_Before, Old : OldBefore, New : NewBefore } );

            if ( undefined != NewBefore.GridBefore )
                this.Pr.GridBefore = GridBefore;
            else
                this.Pr.GridBefore = undefined;

            if ( undefined != NewBefore.WBefore )
                this.Pr.WBefore = NewBefore.WBefore;
            else
                this.Pr.WBefore = undefined;

            this.Recalc_CompiledPr();
        }
    },

    Get_After : function()
    {
        var RowPr = this.Get_CompiledPr( false );

        var After =
            {
                WAfter    : RowPr.WAfter.Copy(),
                GridAfter : RowPr.GridAfter
            };

        return After;
    },

    Set_After : function(GridAfter, WAfter)
    {
        // Если парметр WAfter === false, значит значение WAfter мы не меняем
        if ( this.Pr.GridAfter !== GridAfter || this.Pr.WAfter !== WAfter )
        {
            var OldAfter =
                {
                    GridAfter : ( undefined != this.Pr.GridAfter ? this.Pr.GridAfter : undefined ),
                    WAfter    : ( undefined != this.Pr.WAfter    ? this.Pr.WAfter    : undefined )
                };

            var NewAfter =
                {
                    GridAfter : ( undefined != GridAfter ? GridAfter : undefined ),
                    WAfter    : ( undefined != WAfter    ? WAfter    : undefined )
                };

            if ( false === WAfter )
                NewAfter.WAfter = OldAfter.WAfter;
            else if ( undefined != WAfter )
            {
                NewAfter.WAfter = new CTableMeasurement(tblwidth_Auto, 0);
                NewAfter.WAfter.Set_FromObject(WAfter);
            }

            History.Add( this, { Type : historyitem_TableRow_After, Old : OldAfter, New : NewAfter } );

            if ( undefined != NewAfter.GridAfter )
                this.Pr.GridAfter = GridAfter;
            else
                this.Pr.GridAfter = undefined;

            if ( undefined != NewAfter.WAfter )
                this.Pr.WAfter = NewAfter.WAfter;
            else
                this.Pr.WAfter = undefined;

            this.Recalc_CompiledPr();
        }
    },

    Get_CellSpacing : function()
    {
        var RowPr = this.Get_CompiledPr( false );
        return RowPr.TableCellSpacing;
    },

    Set_CellSpacing : function(Value)
    {
        if ( undefined === Value )
        {
            if ( undefined === this.Pr.TableCellSpacing )
                return;

            History.Add( this, { Type : historyitem_TableRow_CellSpacing, Old : this.Pr.TableCellSpacing, New : undefined } );
            this.Pr.TableCellSpacing = undefined;

            this.Recalc_CompiledPr();
        }
        else if ( undefined === this.Pr.TableCellSpacing )
        {
            History.Add( this, { Type : historyitem_TableRow_CellSpacing, Old : undefined, New : Value } );
            this.Pr.TableCellSpacing = Value;

            this.Recalc_CompiledPr();
        }
        else if ( Value != this.Pr.TableCellSpacing )
        {
            History.Add( this, { Type : historyitem_TableRow_CellSpacing, Old : this.Pr.TableCellSpacing, New : Value } );
            this.Pr.TableCellSpacing = Value;

            this.Recalc_CompiledPr();
        }
    },

    Get_Height : function()
    {
        var RowPr = this.Get_CompiledPr( false );
        return RowPr.Height;
    },

    Set_Height : function( Value, HRule )
    {
        if ( (undefined === this.Pr.Height && undefined === Value) || (undefined != this.Pr.Height && HRule === this.Pr.Height.HRule && Math.abs(Value - this.Pr.Height.Value) < 0.001 ) )
            return;

        var OldHeight = undefined != this.Pr.Height ? this.Pr.Height : undefined;
        var NewHeight = undefined != Value  ? new CTableRowHeight( Value, HRule ): undefined;

        History.Add( this, { Type : historyitem_TableRow_Height, Old : OldHeight, New : NewHeight } );

        if ( undefined === NewHeight )
            this.Pr.Height = undefined;
        else
            this.Pr.Height = NewHeight;

        this.Recalc_CompiledPr();
    },

    Is_Header : function()
    {
        var RowPr = this.Get_CompiledPr(false);
        return RowPr.TableHeader;
    },

    Set_Header : function(Value)
    {
        if ( (undefined === this.Pr.TableHeader && undefined === Value) || (undefined != this.Pr.TableHeader && Value === this.Pr.TableHeader ) )
            return;

        var OldHeader = undefined != this.Pr.TableHeader ? this.Pr.TableHeader : undefined;
        var NewHeader = undefined != Value  ? Value : undefined;

        History.Add( this, { Type : historyitem_TableRow_TableHeader, Old : OldHeader, New : NewHeader } );

        if ( undefined === Value )
            this.Pr.TableHeader = undefined;
        else
            this.Pr.TableHeader = Value;

        this.Recalc_CompiledPr();
    },

    Copy_Pr : function(OtherPr)
    {
        // Before
        if ( undefined === OtherPr.WBefore )
            this.Set_Before( OtherPr.GridBefore, undefined );
        else
            this.Set_Before( OtherPr.GridBefore, { W : OtherPr.WBefore.W, Type : OtherPr.WBefore.Type } );

        // After
        if ( undefined === OtherPr.WAfter )
            this.Set_After( OtherPr.GridAfter, undefined );
        else
            this.Set_After( OtherPr.GridAfter, { W : OtherPr.WAfter.W, Type : OtherPr.WAfter.Type } );

        // Height
        if ( undefined === OtherPr.Height )
            this.Set_Height( undefined, undefined );
        else
            this.Set_Height( OtherPr.Height.Value, OtherPr.Height.HRule );

        // CellSpacing
        if ( undefined != OtherPr.TableCellSpacing )
            this.Set_CellSpacing( OtherPr.TableCellSpacing );
        else
            this.Set_CellSpacing( undefined );

        // TableHeader
        if ( undefined != OtherPr.TableHeader )
            this.Set_Header( OtherPr.TableHeader );
        else
            this.Set_Header( undefined );
    },

    Set_SpacingInfo : function(bSpacingTop, bSpacingBot)
    {
        this.SpacingInfo =
        {
            Top    : bSpacingTop,
            Bottom : bSpacingBot
        };
    },

    Get_SpacingInfo : function()
    {
        return this.SpacingInfo;
    },

    //-----------------------------------------------------------------------------------
    // Работаем с ячейками строки
    //-----------------------------------------------------------------------------------
    Get_Cell : function(Index)
    {
        if ( Index < 0 || Index >= this.Content.length )
            return null;

        return this.Content[Index];
    },

    Get_CellsCount : function()
    {
        return this.Content.length;
    },

    Set_CellInfo : function(Index,  StartGridCol, X_grid_start, X_grid_end, X_cell_start, X_cell_end, X_content_start, X_content_end)
    {
        this.CellsInfo[Index] =
        {
            StartGridCol    : StartGridCol,
            X_grid_start    : X_grid_start,
            X_grid_end      : X_grid_end,
            X_cell_start    : X_cell_start,
            X_cell_end      : X_cell_end,
            X_content_start : X_content_start,
            X_content_end   : X_content_end
        };
    },

    Update_CellInfo : function(Index)
    {
        var Cell = this.Content[Index];

        var StartGridCol    = Cell.Metrics.StartGridCol;
        var X_grid_start    = Cell.Metrics.X_grid_start;
        var X_grid_end      = Cell.Metrics.X_grid_end;
        var X_cell_start    = Cell.Metrics.X_cell_start;
        var X_cell_end      = Cell.Metrics.X_cell_end;
        var X_content_start = Cell.Metrics.X_content_start;
        var X_content_end   = Cell.Metrics.X_content_end;

        this.Set_CellInfo(Index, StartGridCol, X_grid_start, X_grid_end, X_cell_start, X_cell_end, X_content_start, X_content_end);
    },

    Get_CellInfo : function(Index)
    {
        return this.CellsInfo[Index];
    },

    Get_StartGridCol : function(Index)
    {
        var Max = Math.min( this.Content.length - 1, Index - 1);
        var CurGridCol = this.Get_Before().GridBefore;
        for ( var CurCell = 0; CurCell <= Max; CurCell++ )
        {
            var Cell = this.Get_Cell( CurCell );
            var GridSpan = Cell.Get_GridSpan();

            CurGridCol += GridSpan;
        }

        return CurGridCol;
    },

    Remove_Cell : function(Index)
    {
        History.Add( this, { Type : historyitem_TableRow_RemoveCell, Pos : Index, Item : { Cell : this.Content[Index], CellInfo : this.CellsInfo[Index] } } );

        this.Content.splice( Index, 1 );
        this.CellsInfo.splice( Index, 1 );

        this.Internal_ReIndexing( Index );
    },

    Add_Cell : function(Index, Row, Cell, bReIndexing)
    {
        if ( "undefined" === typeof(Cell) || null === Cell )
            Cell = new CTableCell( Row );

        History.Add( this, { Type : historyitem_TableRow_AddCell, Pos : Index, Item : { Cell : Cell, CellInfo : {}  } } );

        this.Content.splice( Index, 0, Cell );
        this.CellsInfo.splice( Index, 0, {} );

        if ( true === bReIndexing )
        {
            this.Internal_ReIndexing(Index);
        }
        else
        {
            if ( Index > 0 )
            {
                this.Content[Index - 1].Next = Cell;
                Cell.Prev = this.Content[Index - 1];
            }
            else
                Cell.Prev = null;

            if ( Index < this.Content.length - 1 )
            {
                this.Content[Index + 1].Prev = Cell;
                Cell.Next = this.Content[Index + 1];
            }
            else
                Cell.Next = null;
        }

        return Cell;
    },

    Clear_ContentChanges : function()
    {
        this.m_oContentChanges.Clear();
    },

    Add_ContentChanges : function(Changes)
    {
        this.m_oContentChanges.Add( Changes );
    },

    Refresh_ContentChanges : function()
    {
        this.m_oContentChanges.Refresh();
    },
    //-----------------------------------------------------------------------------------
    // Внутренние функции
    //-----------------------------------------------------------------------------------
    Internal_ReIndexing : function(StartIndex)
    {
        if ( "undefined" === typeof(StartIndex) )
            StartIndex = 0;

        for ( var Ind = StartIndex; Ind < this.Content.length; Ind++ )
        {
            this.Content[Ind].Set_Index( Ind );
            this.Content[Ind].Prev = ( Ind > 0 ? this.Content[Ind - 1] : null );
            this.Content[Ind].Next = ( Ind < this.Content.length - 1 ? this.Content[Ind + 1] : null );
            this.Content[Ind].Row  = this;
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
            case historyitem_TableRow_Before:
            {
                if ( undefined != Data.Old.GridBefore )
                    this.Pr.GridBefore = Data.Old.GridBefore;
                else
                    this.Pr.GridBefore = undefined;

                if ( undefined != Data.Old.WBefore )
                    this.Pr.WBefore = Data.Old.WBefore;
                else
                    this.Pr.WBefore = undefined;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_After:
            {
                if ( undefined != Data.Old.GridAfter )
                    this.Pr.GridAfter = Data.Old.GridAfter;
                else
                    this.Pr.GridAfter = undefined;

                if ( undefined != Data.Old.WAfter )
                    this.Pr.WAfter = Data.Old.WAfter;
                else
                    this.Pr.WAfter = undefined;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_CellSpacing:
            {
                if ( undefined != Data.Old )
                    this.Pr.TableCellSpacing = Data.Old;
                else
                    this.Pr.TableCellSpacing = undefined;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_Height:
            {
                if ( undefined != Data.Old )
                    this.Pr.Height = Data.Old;
                else
                    this.Pr.Height = undefined;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_AddCell:
            {
                this.Content.splice( Data.Pos, 1 );
                this.CellsInfo.splice( Data.Pos, 1 );

                this.Internal_ReIndexing( Data.Pos );

                break;
            }

            case historyitem_TableRow_RemoveCell:
            {
                this.Content.splice( Data.Pos, 0, Data.Item.Cell );
                this.CellsInfo.splice( Data.Pos, 0, Data.Item.CellInfo );

                this.Internal_ReIndexing( Data.Pos );

                break;
            }

            case historyitem_TableRow_TableHeader:
            {
                if ( undefined != Data.Old )
                    this.Pr.TableHeader = Data.Old;
                else
                    this.Pr.TableHeader = undefined;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_Pr:
            {
                this.Pr = Data.Old;

                this.Recalc_CompiledPr();
                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_TableRow_Before:
            {
                if ( undefined != Data.New.GridBefore )
                    this.Pr.GridBefore = Data.New.GridBefore;
                else
                    this.Pr.GridBefore = undefined;

                if ( undefined != Data.New.WBefore )
                    this.Pr.WBefore = Data.New.WBefore;
                else
                    this.Pr.WBefore = undefined;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_After:
            {
                if ( undefined != Data.New.GridAfter )
                    this.Pr.GridAfter = Data.New.GridAfter;
                else
                    this.Pr.GridAfter = undefined;

                if ( undefined != Data.New.WAfter )
                    this.Pr.WAfter = Data.New.WAfter;
                else
                    this.Pr.WAfter = undefined;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_CellSpacing:
            {
                if ( undefined != Data.New )
                    this.Pr.TableCellSpacing = Data.New;
                else
                    this.Pr.TableCellSpacing = undefined;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_Height:
            {
                if ( undefined != Data.New )
                    this.Pr.Height = Data.New;
                else
                    this.Pr.Height = undefined;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_AddCell:
            {
                this.Content.splice( Data.Pos, 0, Data.Item.Cell );
                this.CellsInfo.splice( Data.Pos, 0, Data.Item.CellInfo );

                this.Internal_ReIndexing( Data.Pos );

                break;
            }

            case historyitem_TableRow_RemoveCell:
            {
                this.Content.splice( Data.Pos, 1 );
                this.CellsInfo.splice( Data.Pos, 1 );

                this.Internal_ReIndexing( Data.Pos );

                break;
            }

            case historyitem_TableRow_TableHeader:
            {
                if ( undefined != Data.New )
                    this.Pr.TableHeader = Data.New;
                else
                    this.Pr.TableHeader = undefined;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_Pr:
            {
                this.Pr = Data.New;

                this.Recalc_CompiledPr();
                break;
            }
        }
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        return this.Table.Get_ParentObject_or_DocumentPos(this.Table.Index);
    },

    Refresh_RecalcData : function(Data)
    {
        var bNeedRecalc = false;

        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_TableRow_Before:
            case historyitem_TableRow_After:
            case historyitem_TableRow_CellSpacing:
            case historyitem_TableRow_Height:
            case historyitem_TableRow_AddCell:
            case historyitem_TableRow_RemoveCell:
            case historyitem_TableRow_TableHeader:
            case historyitem_TableRow_Pr:
            {
                bNeedRecalc = true;
                break;
            }
        }

        // Добавляем все ячейки для пересчета
        var CellsCount = this.Get_CellsCount();
        for ( var CurCell = 0; CurCell < CellsCount; CurCell++ )
        {
            this.Table.RecalcInfo.Add_Cell( this.Get_Cell(CurCell) );
        }

        this.Table.RecalcInfo.Recalc_Borders();

        if ( true === bNeedRecalc )
            this.Refresh_RecalcData2( 0, 0 );
    },

    Refresh_RecalcData2 : function(CellIndex, Page_rel)
    {
        this.Table.Refresh_RecalcData2( this.Index, Page_rel );
    },
    //-----------------------------------------------------------------------------------
    // Функции для работы с совместным редактирования
    //-----------------------------------------------------------------------------------
    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_TableRow );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_TableRow_Before:
            {
                // Bool : IsUndefined
                //   Если предыдущее значение false
                //   Long   : GridBefore
                // Bool : IsUndefined
                //   Если предыдущее значение false
                //   Variable : WBefore (CTableMeasurement)

                if ( undefined === Data.New.GridBefore )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Writer.WriteLong( Data.New.GridBefore );
                }

                if ( undefined === Data.New.WBefore )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Data.New.WBefore.Write_ToBinary( Writer );
                }

                break;
            }

            case historyitem_TableRow_After:
            {
                // Bool : IsUndefined
                //   Если предыдущее значение false
                //   Long   : GridAfter
                // Bool : IsUndefined
                //   Если предыдущее значение false
                //   Variable : WAfter (CTableMeasurement)

                if ( undefined === Data.New.GridAfter )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Writer.WriteLong( Data.New.GridAfter );
                }

                if ( undefined === Data.New.WAfter )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Data.New.WAfter.Write_ToBinary( Writer );
                }

                break;
            }

            case historyitem_TableRow_CellSpacing:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : IsNull
                //   Если false
                //     Double : значение

                if ( undefined === Data.New )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );

                    if ( null === Data.New )
                        Writer.WriteBool( true );
                    else
                    {
                        Writer.WriteBool( false );
                        Writer.WriteDouble( Data.New );
                    }
                }

                break;
            }

            case historyitem_TableRow_Height:
            {
                // Bool   : IsUndefined
                // Если предыдущее значение false
                //   Variable : Height (CTableRowHeight)

                if ( undefined === Data.New )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }

                break;
            }

            case historyitem_TableRow_AddCell:
            {
                // Long     : Количество элементов
                // Array of :
                //  {
                //    Long   : Позиция
                //    String : Id элемента
                //  }

                var bArray = Data.UseArray;
                var Count  = 1;

                Writer.WriteLong( Count );

                for ( var Index = 0; Index < Count; Index++ )
                {
                    if ( true === bArray )
                        Writer.WriteLong( Data.PosArray[Index] );
                    else
                        Writer.WriteLong( Data.Pos + Index );

                    Writer.WriteString2( Data.Item.Cell.Get_Id() );
                }

                break;
            }

            case historyitem_TableRow_RemoveCell:
            {
                // Long          : Количество удаляемых элементов
                // Array of Long : позиции удаляемых элементов

                var bArray = Data.UseArray;
                var Count  = 1;

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

            case historyitem_TableRow_TableHeader:
            {
                // Bool   : IsUndefined
                // Если предыдущее значение false
                //   Bool : TableHeader

                if ( undefined === Data.New )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Writer.WriteBool( Data.New )
                }

                break;
            }

            case historyitem_TableRow_Pr:
            {
                // CTableRowPr
                Data.New.Write_ToBinary( Writer );

                break;
            }
        }

        return Writer;
    },

    Save_Changes2 : function(Data, Writer)
    {
        var bRetValue = false;
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_TableRow_Before:
            case historyitem_TableRow_After:
            case historyitem_TableRow_CellSpacing:
            case historyitem_TableRow_Height:
            {
                break;
            }

            case historyitem_TableRow_AddCell:
            {
                break;
            }

            case historyitem_TableRow_RemoveCell:
            {
                break;
            }
        }

        return bRetValue;
    },

    Load_Changes : function(Reader, Reader2)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_TableRow != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_TableRow_Before:
            {
                // Bool : IsUndefined
                //   Если предыдущее значение false
                //   Long   : GridBefore
                // Bool : IsUndefined
                //   Если предыдущее значение false
                //   Variable : WBefore (CTableMeasurement)

                var bUndefinedGB = Reader.GetBool();
                if ( true === bUndefinedGB )
                    this.Pr.GridBefore = undefined;
                else
                    this.Pr.GridBefore = Reader.GetLong();

                var bUndefinedWB = Reader.GetBool();
                if ( true === bUndefinedWB )
                    this.Pr.WBefore = undefined;
                else
                {
                    this.Pr.WBefore = new CTableMeasurement(tblwidth_Auto, 0);
                    this.Pr.WBefore.Read_FromBinary( Reader );
                }

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_After:
            {
                // Bool : IsUndefined
                //   Если предыдущее значение false
                //   Long   : GridAfter
                // Bool : IsUndefined
                //   Если предыдущее значение false
                //   Variable : WAfter (CTableMeasurement)

                var bUndefinedGA = Reader.GetBool();
                if ( true === bUndefinedGA )
                    this.Pr.GridAfter = undefined;
                else
                    this.Pr.GridAfter = Reader.GetLong();

                var bUndefinedWA = Reader.GetBool();
                if ( true === bUndefinedWA )
                    this.Pr.WAfter = undefined;
                else
                {
                    this.Pr.WAfter = new CTableMeasurement(tblwidth_Auto, 0);
                    this.Pr.WAfter.Read_FromBinary( Reader );
                }

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_CellSpacing:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : IsNull
                //   Если false
                //     Double : значение

                var bUndefined = Reader.GetBool();
                if ( true === bUndefined )
                    this.Pr.TableCellSpacing = undefined;
                else
                {
                    var bNull = Reader.GetBool();
                    if ( true === bNull )
                        this.Pr.TableCellSpacing = null;
                    else
                        this.Pr.TableCellSpacing = Reader.GetDouble();;
                }

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_Height:
            {
                // Bool : IsUndefined
                // Если предыдущее значение false
                //   Variable : Height (CTableRowHeight)
                var bUndefined = Reader.GetBool();
                if ( true === bUndefined )
                    this.Pr.Height = undefined;
                else
                {
                    this.Pr.Height = new CTableRowHeight(0, Asc.linerule_Auto);
                    this.Pr.Height.Read_FromBinary( Reader );
                }

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_AddCell:
            {
                // Long     : Количество элементов
                // Array of :
                //  {
                //    Long   : Позиция
                //    String : Id элемента
                //  }

                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Pos     = this.m_oContentChanges.Check(AscCommon.contentchanges_Add, Reader.GetLong());
                    var Element = g_oTableId.Get_ById(Reader.GetString2());

                    if (null != Element)
                    {
                        this.Content.splice(Pos, 0, Element);
                        CollaborativeEditing.Update_DocumentPositionsOnAdd(this, Pos);
                    }
                }

                this.Internal_ReIndexing();

                break;
            }

            case historyitem_TableRow_RemoveCell:
            {
                // Long          : Количество удаляемых элементов
                // Array of Long : позиции удаляемых элементов

                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Pos = this.m_oContentChanges.Check(AscCommon.contentchanges_Remove, Reader.GetLong());

                    // действие совпало, не делаем его
                    if (false === Pos)
                        continue;

                    this.Content.splice(Pos, 1);
                    CollaborativeEditing.Update_DocumentPositionsOnRemove(this, Pos, 1);
                }

                this.Internal_ReIndexing();

                break;
            }

            case historyitem_TableRow_TableHeader:
            {
                // Bool : IsUndefined
                // Если предыдущее значение false
                //   Bool : Height (TableHeader)
                var bUndefined = Reader.GetBool();
                if ( true === bUndefined )
                    this.Pr.TableHeader = undefined;
                else
                    this.Pr.TableHeader = Reader.GetBool();

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableRow_Pr:
            {
                // CTableRowPr
                this.Pr = new CTableRowPr();
                this.Pr.Read_FromBinary( Reader );

                this.Recalc_CompiledPr();
                break;
            }
        }

        return true;
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_TableRow );

        // String          : Id строки
        // Variable        : свойства строки
        // Long            : количество ячеек
        // Array strings   : Id ячеек

        Writer.WriteString2(this.Id);
        this.Pr.Write_ToBinary( Writer );

        var Count = this.Content.length;
        Writer.WriteLong( Count );
        for ( var Index = 0; Index < Count; Index++ )
            Writer.WriteString2( this.Content[Index].Get_Id() );
    },

    Read_FromBinary2 : function(Reader)
    {
        // String          : Id строки
        // Variable        : свойства строки
        // Long            : количество ячеек
        // Array variables : сами ячейки

        this.Id = Reader.GetString2();
        this.Pr = new CTableRowPr()
        this.Pr.Read_FromBinary( Reader );
        this.Recalc_CompiledPr();

        var Count = Reader.GetLong();
        this.Content = [];
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Cell = g_oTableId.Get_ById( Reader.GetString2() );
            this.Content.push(Cell);
        }

        this.Internal_ReIndexing();

        CollaborativeEditing.Add_NewObject(this);
    },

    Load_LinkData : function(LinkData)
    {
    }
};
CTableRow.prototype.Get_DocumentPositionFromObject = function(PosArray)
{
    if (!PosArray)
        PosArray = [];

    if (this.Table)
    {
        PosArray.splice(0, 0, {Class : this.Table, Position : this.Index});
        this.Table.Get_DocumentPositionFromObject(PosArray);
    }

    return PosArray;
};

function CTableRowRecalculateObject()
{
    this.CellsInfo   = [];
    this.Metrics     = {};
    this.SpacingInfo = {};

    this.Height      = 0;
    this.PagesCount  = 0;

    this.Content = [];
}

CTableRowRecalculateObject.prototype =
{
    Save : function(Row)
    {
        this.CellsInfo   = Row.CellsInfo;
        this.Metrics     = Row.Metrics;
        this.SpacingInfo = Row.SpacingInfo;

        this.Height      = Row.Height;
        this.PagesCount  = Row.PagesCount;

        var Count = Row.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.Content[Index] = Row.Content[Index].Save_RecalculateObject();
        }
    },

    Load : function(Row)
    {
        Row.CellsInfo   = this.CellsInfo;
        Row.Metrics     = this.Metrics;
        Row.SpacingInfo = this.SpacingInfo;

        Row.Height      = this.Height;
        Row.PagesCount  = this.PagesCount;

        var Count = Row.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            Row.Content[Index].Load_RecalculateObject( this.Content[Index] );
        }
    },

    Get_DrawingFlowPos : function(FlowPos)
    {
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.Content[Index].Get_DrawingFlowPos( FlowPos );
        }
    }
};