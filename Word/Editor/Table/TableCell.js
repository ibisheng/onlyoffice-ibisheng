"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 28.12.2015
 * Time: 12:11
 */

//----------------------------------------------------------------------------------------------------------------------
// Класс CTableCell
//----------------------------------------------------------------------------------------------------------------------
function CTableCell(Row, ColW)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Row = Row;

    this.Prev = null;
    this.Next = null;
    this.Content = new CDocumentContent(this, (undefined !== this.Row ? this.Row.Table.DrawingDocument : undefined), 0, 0, 0, 0, false, false, undefined !== this.Row ? this.Row.Table.bPresentation : undefined);
    this.Content.Set_StartPage( ( Row ? this.Row.Table.PageNum : 0 ) );

    this.CompiledPr =
    {
        Pr         : null, // настройки ячейки
        TextPr     : null, // настройки текста
        ParaPr     : null, // настройки параграфа
        NeedRecalc : true
    };
    this.Pr = new CTableCellPr();

    if ( undefined != ColW )
        this.Pr.TableCellW = new CTableMeasurement(tblwidth_Mm, ColW);

    // Массивы с рассчитанными стилями для границ данной ячейки.
    // В каждом элементе лежит массив стилей.
    this.BorderInfo =
    {
        Top    : null,
        Left   : null,
        Right  : null,
        Bottom : null,            // Используется для последней строки таблицы,
        Bottom_BeforeCount : -1,  // когда Spacing = null(у последней строки) или когда в следущей строке
        Bottom_AfterCount  : -1,  // GridBefore и/или GridAfter отлично от 0.
        MaxLeft  : 0,
        MaxRight : 0
    };

    // Метрики данной ячейки(они все относительные, а не абсолютные). Абсолютные хранятся в строке
    this.Metrics =
    {
        StartGridCol    : 0,
        X_grid_start    : 0,
        X_grid_end      : 0,
        X_cell_start    : 0,
        X_cell_end      : 0,
        X_content_start : 0,
        X_content_end   : 0
    };


    this.Temp =
    {
        Y       : 0,
        CurPage : 0,
        Y_VAlign_offset : [] // Сдвиг, который нужно сделать из-за VAlign (массив по страницам)
    };

    this.Index = 0;

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

CTableCell.prototype =
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


    Get_Theme : function()
    {
        return this.Row.Table.Get_Theme();
    },

    Get_ColorMap: function()
    {
        return this.Row.Table.Get_ColorMap();
    },


    Copy : function(Row)
    {
        var Cell = new CTableCell(Row);

        // Копируем настройки ячейки
        Cell.Copy_Pr( this.Pr.Copy(), false );

        // Копируем содержимое ячейки
        Cell.Content.Copy2( this.Content );

        // Скопируем BorderInfo и метрики, чтобы при копировании строки целиком не надо было их пересчитывать
        Cell.BorderInfo.Top                = this.BorderInfo.Top;
        Cell.BorderInfo.Left               = this.BorderInfo.Left;
        Cell.BorderInfo.Right              = this.BorderInfo.Right;
        Cell.BorderInfo.Bottom             = this.BorderInfo.Bottom;
        Cell.BorderInfo.Bottom_BeforeCount = this.BorderInfo.Bottom_BeforeCount;
        Cell.BorderInfo.Bottom_AfterCount  = this.BorderInfo.Bottom_AfterCount;
        Cell.BorderInfo.MaxLeft            = this.BorderInfo.MaxLeft;
        Cell.BorderInfo.MaxRight           = this.BorderInfo.MaxRight;

        Cell.Metrics.StartGridCol    = this.Metrics.StartGridCol;
        Cell.Metrics.X_grid_start    = this.Metrics.X_grid_start;
        Cell.Metrics.X_grid_end      = this.Metrics.X_grid_end;
        Cell.Metrics.X_cell_start    = this.Metrics.X_cell_start;
        Cell.Metrics.X_cell_end      = this.Metrics.X_cell_end;
        Cell.Metrics.X_content_start = this.Metrics.X_content_start;
        Cell.Metrics.X_content_end   = this.Metrics.X_content_end;

        return Cell;
    },

    Set_Index : function(Index)
    {
        if ( Index != this.Index )
        {
            this.Index = Index;
            this.Recalc_CompiledPr();
        }
    },

    Set_Metrics : function(StartGridCol, X_grid_start, X_grid_end, X_cell_start, X_cell_end, X_content_start, X_content_end )
    {
        this.Metrics.StartGridCol    = StartGridCol;
        this.Metrics.X_grid_start    = X_grid_start;
        this.Metrics.X_grid_end      = X_grid_end;
        this.Metrics.X_cell_start    = X_cell_start;
        this.Metrics.X_cell_end      = X_cell_end;
        this.Metrics.X_content_start = X_content_start;
        this.Metrics.X_content_end   = X_content_end;
    },

    Get_EndInfo : function()
    {
        return this.Content.Get_EndInfo();
    },

    Get_PrevElementEndInfo : function(CurElement)
    {
        return this.Row.Get_PrevElementEndInfo( this.Index );
    },

    Save_RecalculateObject : function()
    {
        var RecalcObj = new CTableCellRecalculateObject();
        RecalcObj.Save( this );
        return RecalcObj;
    },

    Load_RecalculateObject : function(RecalcObj)
    {
        RecalcObj.Load(this);
    },

    Prepare_RecalculateObject : function()
    {
        this.BorderInfo =
        {
            Top    : null,
            Left   : null,
            Right  : null,
            Bottom : null,            // Используется для последней строки таблицы,
            Bottom_BeforeCount : -1,  // когда Spacing = null(у последней строки) или когда в следущей строке
            Bottom_AfterCount  : -1,  // GridBefore и/или GridAfter отлично от 0.
            MaxLeft  : 0,
            MaxRight : 0
        };

        // Метрики данной ячейки(они все относительные, а не абсолютные). Абсолютные хранятся в строке
        this.Metrics =
        {
            StartGridCol    : 0,
            X_grid_start    : 0,
            X_grid_end      : 0,
            X_cell_start    : 0,
            X_cell_end      : 0,
            X_content_start : 0,
            X_content_end   : 0
        };

        this.Temp =
        {
            Y       : 0,
            CurPage : 0,
            Y_VAlign_offset : [] // Сдвиг, который нужно сделать из-за VAlign (массив по страницам)
        };

        this.Content.Prepare_RecalculateObject();
    },
    //-----------------------------------------------------------------------------------
    // Работаем с стилем ячейки
    //-----------------------------------------------------------------------------------
    Recalc_CompiledPr : function()
    {
        this.CompiledPr.NeedRecalc = true;
        this.Content.Recalc_AllParagraphs_CompiledPr();
    },

    // Формируем конечные свойства параграфа на основе стиля и прямых настроек.
    Get_CompiledPr : function(bCopy)
    {
        if ( true === this.CompiledPr.NeedRecalc )
        {
            // TODO: Возможно стоит разделить рассчет стиля для ячейки и для текста
            var FullPr = this.Internal_Compile_Pr();
            this.CompiledPr.Pr         = FullPr.CellPr;
            this.CompiledPr.ParaPr     = FullPr.ParaPr;
            this.CompiledPr.TextPr     = FullPr.TextPr;
            this.CompiledPr.NeedRecalc = false;
        }

        if ( false === bCopy )
            return this.CompiledPr.Pr;
        else
            return this.CompiledPr.Pr.Copy(); // Отдаем копию объекта, чтобы никто не поменял извне настройки стиля
    },

    Internal_Compile_Pr : function()
    {
        var Table     = this.Row.Table;
        var TablePr   = Table.Get_CompiledPr(false);
        var TableLook = Table.Get_TableLook();
        var CellIndex = this.Index;
        var RowIndex  = this.Row.Index;

        // Сначала возьмем настройки по умолчанию для всей таблицы
        var CellPr = TablePr.TableCellPr.Copy();
        var ParaPr = TablePr.ParaPr.Copy();
        var TextPr;
        if(!Table.bPresentation)
        {
            TextPr = TablePr.TextPr.Copy();
        }
        else
        {
            TextPr = TablePr.TableWholeTable.TextPr.Copy();
        }

        // Совместим настройки с настройками для групп строк. Сначала группы строк, потом группы колонок.
        if ( true === TableLook.Is_BandHor() )
        {
            var RowBandSize = TablePr.TablePr.TableStyleRowBandSize;
            var __RowIndex  = ( true != TableLook.Is_FirstRow() ? RowIndex : RowIndex - 1 )
            var _RowIndex = ( 1 != RowBandSize ? Math.floor( __RowIndex / RowBandSize ) : __RowIndex );
            var TableBandStyle = null;
            if ( 0 === _RowIndex % 2 )
                TableBandStyle = TablePr.TableBand1Horz;
            else
                TableBandStyle = TablePr.TableBand2Horz;

            CellPr.Merge( TableBandStyle.TableCellPr );
            TextPr.Merge( TableBandStyle.TextPr );
            ParaPr.Merge( TableBandStyle.ParaPr );
        }

        // Совместим с настройками для групп колонок
        // Согласно спецификации DOCX, совмещать надо всегда, но для первой и последней колонок Word
        // не совмещает, поэтому делаем также.
        if ( true === TableLook.Is_BandVer() && !( (true === TableLook.Is_LastCol() && this.Row.Get_CellsCount() - 1 === CellIndex) || (true === TableLook.Is_FirstCol() && 0 === CellIndex) ) )
        {
            var ColBandSize = TablePr.TablePr.TableStyleColBandSize;
            var _ColIndex   = ( true != TableLook.Is_FirstCol() ? CellIndex : CellIndex - 1 )
            var ColIndex = ( 1 != ColBandSize ? Math.floor( _ColIndex / ColBandSize ) : _ColIndex );
            var TableBandStyle = null;
            if ( 0 === ColIndex % 2 )
                TableBandStyle = TablePr.TableBand1Vert;
            else
                TableBandStyle = TablePr.TableBand2Vert;

            CellPr.Merge( TableBandStyle.TableCellPr );
            TextPr.Merge( TableBandStyle.TextPr );
            ParaPr.Merge( TableBandStyle.ParaPr );
        }


        // Совместим настройки с настройками для последней колонки
        if ( true === TableLook.Is_LastCol() && this.Row.Get_CellsCount() - 1 === CellIndex )
        {
            CellPr.Merge( TablePr.TableLastCol.TableCellPr );
            TextPr.Merge( TablePr.TableLastCol.TextPr );
            ParaPr.Merge( TablePr.TableLastCol.ParaPr );
        }

        // Совместим настройки с настройками для первой колонки
        if ( true === TableLook.Is_FirstCol() && 0 === CellIndex )
        {
            CellPr.Merge( TablePr.TableFirstCol.TableCellPr );
            TextPr.Merge( TablePr.TableFirstCol.TextPr );
            ParaPr.Merge( TablePr.TableFirstCol.ParaPr );
        }

        // Совместим настройки с настройками для последней строки
        if ( true === TableLook.Is_LastRow() && Table.Content.length - 1 === RowIndex )
        {
            CellPr.Merge( TablePr.TableLastRow.TableCellPr );
            TextPr.Merge( TablePr.TableLastRow.TextPr );
            ParaPr.Merge( TablePr.TableLastRow.ParaPr );
        }

        // Совместим настройки с настройками для первой строки
        if ( true === TableLook.Is_FirstRow() && ( 0 === RowIndex || true === this.Row.Pr.TableHeader )  )
        {
            CellPr.Merge( TablePr.TableFirstRow.TableCellPr );
            TextPr.Merge( TablePr.TableFirstRow.TextPr );
            ParaPr.Merge( TablePr.TableFirstRow.ParaPr );
        }

        // Совместим настройки с настройками для правой нижней ячейки
        if ( this.Row.Get_CellsCount() - 1 === CellIndex && Table.Content.length - 1 === RowIndex && (!Table.bPresentation || true === TableLook.Is_LastRow() && true === TableLook.Is_LastCol()))
        {
            CellPr.Merge( TablePr.TableBRCell.TableCellPr );
            TextPr.Merge( TablePr.TableBRCell.TextPr );
            ParaPr.Merge( TablePr.TableBRCell.ParaPr );
        }

        // Совместим настройки с настройками для левой нижней ячейки
        if ( 0 === CellIndex && Table.Content.length - 1 === RowIndex && (!Table.bPresentation || true === TableLook.Is_LastRow() && true === TableLook.Is_FirstCol()))
        {
            CellPr.Merge( TablePr.TableBLCell.TableCellPr );
            TextPr.Merge( TablePr.TableBLCell.TextPr );
            ParaPr.Merge( TablePr.TableBLCell.ParaPr );
        }

        // Совместим настройки с настройками для правой верхней ячейки
        if ( this.Row.Get_CellsCount() - 1 === CellIndex && 0 === RowIndex && (!Table.bPresentation || true === TableLook.Is_FirstRow() && true === TableLook.Is_LastCol()) )
        {
            CellPr.Merge( TablePr.TableTRCell.TableCellPr );
            TextPr.Merge( TablePr.TableTRCell.TextPr );
            ParaPr.Merge( TablePr.TableTRCell.ParaPr );
        }

        // Совместим настройки с настройками для левой верхней ячейки
        if ( 0 === CellIndex && 0 === RowIndex && (!Table.bPresentation || true === TableLook.Is_FirstRow() && true === TableLook.Is_FirstCol()))
        {
            CellPr.Merge( TablePr.TableTLCell.TableCellPr );
            TextPr.Merge( TablePr.TableTLCell.TextPr );
            ParaPr.Merge( TablePr.TableTLCell.ParaPr );
        }

        if ( null === CellPr.TableCellMar && undefined != this.Pr.TableCellMar && null != this.Pr.TableCellMar )
            CellPr.TableCellMar = {};
        // Полученные настройки совместим с прямыми настройками ячейки
        CellPr.Merge( this.Pr );

        if(Table.bPresentation)
        {
            CellPr.Check_PresentationPr(Table.Get_Theme())
        }

        return { CellPr : CellPr, ParaPr : ParaPr, TextPr : TextPr };
    },

    //-----------------------------------------------------------------------------------
    // Функции, к которым идет обращение из контента
    //-----------------------------------------------------------------------------------
    OnContentRecalculate : function(bChange, bForceRecalc)
    {
        this.Row.Table.Internal_RecalculateFrom( this.Row.Index, this.Index, bChange, false );
    },

    OnContentReDraw : function(StartPage, EndPage)
    {
        this.Row.Table.Parent.OnContentReDraw( StartPage, EndPage );
    },

    Get_Styles : function(Lvl)
    {
        return this.Row.Table.Get_Styles(Lvl);
    },

    Get_TableStyleForPara : function()
    {
        this.Get_CompiledPr(false);

        var TextPr = this.CompiledPr.TextPr.Copy();
        var ParaPr = this.CompiledPr.ParaPr.Copy();

        return { TextPr : TextPr, ParaPr : ParaPr };
    },


    Get_ShapeStyleForPara: function()
    {
        return this.Row.Table.Get_ShapeStyleForPara();
    },


    Get_TextBackGroundColor : function()
    {
        // Сначала проверим заливку данной ячейки, если ее нет, тогда спрашиваем у таблицы
        var Shd = this.Get_Shd();

        if ( shd_Nil !== Shd.Value )
            return Shd.Get_Color2(this.Get_Theme(), this.Get_ColorMap());

        return this.Row.Table.Get_TextBackGroundColor();
    },

    Get_Numbering : function()
    {
        return this.Row.Table.Get_Numbering();
    },

    Is_Cell : function()
    {
        return true;
    },

    Check_AutoFit : function()
    {
        return false;
    },

    Is_DrawingShape : function(bRetShape)
    {
        return this.Row.Table.Parent.Is_DrawingShape(bRetShape);
    },

    Is_HdrFtr : function(bReturnHdrFtr)
    {
        return this.Row.Table.Parent.Is_HdrFtr(bReturnHdrFtr);
    },

    Is_TopDocument : function(bReturnTopDocument)
    {
        if ( true === bReturnTopDocument )
            return this.Row.Table.Parent.Is_TopDocument( bReturnTopDocument );

        return false;
    },

    Is_InTable : function(bReturnTopTable)
    {
        if ( true === bReturnTopTable )
        {
            var CurTable = this.Row.Table;
            var TopTable = CurTable.Parent.Is_InTable(true);
            if ( null === TopTable )
                return CurTable;
            else
                return TopTable;
        }

        return true;
    },

    Is_UseInDocument : function(Id)
    {
        if ( null != this.Row )
            return this.Row.Is_UseInDocument(this.Get_Id());

        return false;
    },

    Get_PageContentStartPos : function(PageNum)
    {
        return this.Row.Table.Get_PageContentStartPos(PageNum + this.Content.StartPage, this.Row.Index, this.Index, true );
    },

    Set_CurrentElement : function(bUpdateStates)
    {
        var Table = this.Row.Table;

        // Делаем данную ячейку текущей в таблице
        Table.Selection.Start = false;
        Table.Selection.Type  = table_Selection_Text;
        Table.Selection.Use   = this.Content.Is_SelectionUse();

        Table.Selection.StartPos.Pos = { Row : this.Row.Index, Cell : this.Index };
        Table.Selection.EndPos.Pos   = { Row : this.Row.Index, Cell : this.Index };

        Table.Markup.Internal.RowIndex  = 0;
        Table.Markup.Internal.CellIndex = 0;
        Table.Markup.Internal.PageNum   = 0;

        Table.CurCell = this;

        // Делаем таблицу текущим элементом в документе
        Table.Document_SetThisElementCurrent(bUpdateStates);
    },

    Is_ThisElementCurrent : function()
    {
        var Table = this.Row.Table;
        if ( false === Table.Selection.Use && this === Table.CurCell )
        {
            var Parent = Table.Parent;
            if ( docpostype_Content === Parent.CurPos.Type && false === Parent.Selection.Use && this.Index === Parent.CurPos.ContentPos )
                return Table.Parent.Is_ThisElementCurrent();
        }

        return false;
    },

    Check_TableCoincidence : function(Table)
    {
        var CurTable = this.Row.Table;
        if ( Table === CurTable )
            return true;
        else
            return CurTable.Parent.Check_TableCoincidence(Table);
    },

    Get_LastParagraphPrevCell : function()
    {
        if ( undefined === this.Row || null === this.Row )
            return null;

        var CellIndex = this.Index;
        var Row = this.Row;

        // TODO: Разобраться, что делать в данном случае
        if ( 0 === CellIndex )
        {
            if ( 0 === this.Row.Index && undefined !== this.Row.Table && null !== this.Row.Table )
            {
                var Prev = this.Row.Table.Get_DocumentPrev();
                if ( null !== Prev && type_Paragraph === Prev.GetType() )
                    return Prev;
            }

            return null;
        }

        var PrevCell = Row.Get_Cell( CellIndex );

        var Count = PrevCell.Content.Content.length;
        if ( Count <= 0 )
            return null;

        var Element = PrevCell.Content.Content[Count - 1];
        if ( type_Paragraph !== Element.GetType() )
            return null;

        return Element;
    },

    Get_FirstParagraphNextCell : function()
    {
        if ( undefined === this.Row || null === this.Row )
            return null;

        var CellIndex = this.Index;
        var Row = this.Row;

        // TODO: Разобраться, что делать в данном случае
        if ( CellIndex >= this.Row.Get_CellsCount() - 1 )
            return null;

        var NextCell = Row.Get_Cell( CellIndex );

        return NextCell.Content.Get_FirstParagraph();
    },
    //-----------------------------------------------------------------------------------
    // Функции для работы с номерами страниц
    //-----------------------------------------------------------------------------------
    Get_StartPage_Absolute : function()
    {
        return this.Row.Table.Get_StartPage_Absolute();
    },

    Get_StartPage_Relative : function()
    {
        return this.Row.Table.Get_StartPage_Relative();
    },

    Get_AbsolutePage : function(CurPage)
    {
        return this.Row.Table.Get_AbsolutePage(CurPage);
    },

    Get_AbsoluteColumn : function(CurPage)
    {
        return this.Row.Table.Get_AbsoluteColumn(CurPage);
    },
    //-----------------------------------------------------------------------------------
    // Работаем с содержимым ячейки
    //-----------------------------------------------------------------------------------
    Content_Reset : function(X, Y, XLimit, YLimit)
    {
        this.Content.Reset( X, Y, XLimit, YLimit );
        this.Content.Set_CurPosXY( X, Y );
    },

    Content_Get_PageBounds : function(PageIndex)
    {
        return this.Content.Get_PageBounds(PageIndex);
    },

    Content_Get_PagesCount : function()
    {
        return this.Content.Get_PagesCount();
    },

    Content_Draw : function(PageIndex, pGraphics)
    {
        this.Content.Draw(PageIndex, pGraphics);
    },

    Recalculate : function()
    {
        this.Content.Recalculate(false);
    },

    Content_Merge : function(OtherContent)
    {
        this.Content.Add_Content( OtherContent );
    },

    Content_Is_ContentOnFirstPage : function()
    {
        return this.Content.Is_ContentOnFirstPage();
    },

    Content_Set_StartPage : function(PageNum)
    {
        this.Content.Set_StartPage(PageNum);
    },

    Content_Document_CreateFontMap : function(FontMap)
    {
        this.Content.Document_CreateFontMap( FontMap );
    },

    Content_Cursor_MoveToStartPos : function()
    {
        this.Content.Cursor_MoveToStartPos();
    },

    Content_Cursor_MoveToEndPos : function()
    {
        this.Content.Cursor_MoveToEndPos();
    },
    //-----------------------------------------------------------------------------------
    // Работаем с настройками ячейки
    //-----------------------------------------------------------------------------------
    Clear_DirectFormatting : function(bClearMerge)
    {
        // Очищаем все строки и всех ее ячеек

        this.Set_Shd( undefined );
        this.Set_Margins( undefined );
        this.Set_Border( undefined, 0 );
        this.Set_Border( undefined, 1 );
        this.Set_Border( undefined, 2 );
        this.Set_Border( undefined, 3 );

        if ( true === bClearMerge )
        {
            this.Set_GridSpan( undefined );
            this.Set_VMerge( undefined );
        }
    },

    Set_Pr : function(CellPr)
    {
        History.Add( this, { Type : historyitem_TableCell_Pr, Old : this.Pr, New : CellPr } );
        this.Pr = CellPr;
        this.Recalc_CompiledPr();
    },

    Copy_Pr : function(OtherPr, bCopyOnlyVisualProps)
    {
        if ( true != bCopyOnlyVisualProps )
        {
            // GridSpan
            if ( undefined === OtherPr.GridSpan )
                this.Set_GridSpan( undefined );
            else
                this.Set_GridSpan( OtherPr.GridSpan );
        }

        // Shd
        if ( undefined === OtherPr.Shd )
            this.Set_Shd( undefined );
        else
        {
            var Shd_new =
                {
                    Value : OtherPr.Shd.Value,
                    Color : { r : OtherPr.Shd.Color.r, g : OtherPr.Shd.Color.g, b : OtherPr.Shd.Color.b },
                    Unifill : OtherPr.Shd.Unifill ? OtherPr.Shd.Unifill.createDuplicate() : undefined
                };

            this.Set_Shd( Shd_new );
        }

        if ( true != bCopyOnlyVisualProps )
        {
            // VMerge
            this.Set_VMerge(OtherPr.VMerge);
        }

        // Border Top
        if ( undefined === OtherPr.TableCellBorders.Top )
            this.Set_Border( undefined, 0 );
        else
        {
            var Border_top_new = ( null === OtherPr.TableCellBorders.Top ? null : OtherPr.TableCellBorders.Top.Copy() );

            this.Set_Border( Border_top_new, 0 );
        }

        // Border bottom
        if ( undefined === OtherPr.TableCellBorders.Bottom )
            this.Set_Border( undefined, 2 );
        else
        {
            var Border_bottom_new = ( null === OtherPr.TableCellBorders.Bottom ? null : OtherPr.TableCellBorders.Bottom.Copy() );

            this.Set_Border( Border_bottom_new, 2 );
        }

        // Border left
        if ( undefined === OtherPr.TableCellBorders.Left )
            this.Set_Border( undefined, 3 );
        else
        {
            var Border_left_new = ( null === OtherPr.TableCellBorders.Left ? null : OtherPr.TableCellBorders.Left.Copy() );

            this.Set_Border( Border_left_new, 3 );
        }

        // Border right
        if ( undefined === OtherPr.TableCellBorders.Right )
            this.Set_Border( undefined, 1 );
        else
        {
            var Border_right_new = ( null === OtherPr.TableCellBorders.Right ? null : OtherPr.TableCellBorders.Right.Copy() );

            this.Set_Border( Border_right_new, 1 );
        }

        // Margins
        if ( undefined === OtherPr.TableCellMar )
            this.Set_Margins( undefined );
        else
        {
            var Margins_new = ( null === OtherPr.TableCellMar ? null :
            {
                Top :
                {
                    W    : OtherPr.TableCellMar.Top.W,
                    Type : OtherPr.TableCellMar.Top.Type
                },
                Left :
                {
                    W    : OtherPr.TableCellMar.Left.W,
                    Type : OtherPr.TableCellMar.Left.Type
                },

                Bottom :
                {
                    W    : OtherPr.TableCellMar.Bottom.W,
                    Type : OtherPr.TableCellMar.Bottom.Type
                },

                Right :
                {
                    W    : OtherPr.TableCellMar.Right.W,
                    Type : OtherPr.TableCellMar.Right.Type
                }
            } );

            this.Set_Margins( Margins_new, -1 );
        }

        // W
        if ( undefined === OtherPr.TableCellW )
            this.Set_W( undefined );
        else
            this.Set_W( OtherPr.TableCellW.Copy() );

        // VAlign
        this.Set_VAlign(OtherPr.VAlign);
    },

    Get_W : function()
    {
        var W = this.Get_CompiledPr(false).TableCellW;
        return W.Copy();
    },

    Set_W : function(CellW)
    {
        if ( undefined === CellW )
        {
            History.Add( this, { Type : historyitem_TableCell_W, Old : this.Pr.TableCellW, New : undefined } );
            this.Pr.TableCellW = undefined;
        }
        else
        {
            History.Add( this, { Type : historyitem_TableCell_W, Old : this.Pr.TableCellW, New : CellW } );
            this.Pr.TableCellW = CellW;
        }

        this.Recalc_CompiledPr();
    },

    Get_GridSpan : function()
    {
        var GridSpan = this.Get_CompiledPr(false).GridSpan;
        return GridSpan;
    },

    Set_GridSpan : function(Value)
    {
        if ( undefined === Value && undefined === this.Pr.GridSpan )
            return;

        if ( undefined === Value && undefined != this.Pr.GridSpan )
        {
            History.Add( this, { Type : historyitem_TableCell_GridSpan, Old : this.Pr.GridSpan, New : undefined } );
            this.Pr.GridSpan = undefined;

            this.Recalc_CompiledPr();
        }
        else if ( Value != this.Pr.GridSpan )
        {
            History.Add( this, { Type : historyitem_TableCell_GridSpan, Old : ( undefined === this.Pr.GridSpan ? undefined : this.Pr.GridSpan ), New : Value } );
            this.Pr.GridSpan = Value;

            this.Recalc_CompiledPr();
        }
    },

    Get_Margins : function()
    {
        var TableCellMar = this.Get_CompiledPr(false).TableCellMar;

        if ( null === TableCellMar )
        {
            return this.Row.Table.Get_TableCellMar();
        }
        else
        {
            var TableCellDefMargins = this.Row.Table.Get_TableCellMar();

            var Margins =
                {
                    Top    : undefined != TableCellMar.Top    ? TableCellMar.Top    : TableCellDefMargins.Top,
                    Bottom : undefined != TableCellMar.Bottom ? TableCellMar.Bottom : TableCellDefMargins.Bottom,
                    Left   : undefined != TableCellMar.Left   ? TableCellMar.Left   : TableCellDefMargins.Left,
                    Right  : undefined != TableCellMar.Right  ? TableCellMar.Right  : TableCellDefMargins.Right
                };

            return Margins;
        }
    },

    Is_TableMargins : function()
    {
        var TableCellMar = this.Get_CompiledPr(false).TableCellMar;

        if ( null === TableCellMar )
            return true;
        else
            return false;
    },

    Set_Margins : function(Margin, Type)
    {
        var OldValue = ( undefined === this.Pr.TableCellMar ? undefined : this.Pr.TableCellMar );

        if ( undefined === Margin )
        {
            if ( undefined != this.Pr.TableCellMar )
            {
                History.Add( this, { Type : historyitem_TableCell_Margins, Old : OldValue, New : undefined } );
                this.Pr.TableCellMar = undefined;

                this.Recalc_CompiledPr();
            }

            return;
        }

        if ( null === Margin )
        {
            if ( null != this.Pr.TableCellMar )
            {
                History.Add( this, { Type : historyitem_TableCell_Margins, Old : OldValue, New : null } );
                this.Pr.TableCellMar = null;

                this.Recalc_CompiledPr();
            }

            return;
        }

        var Margins_new = this.Pr.TableCellMar;

        var bNeedChange  = false;
        var TableMargins = this.Row.Table.Get_TableCellMar();
        if ( null === Margins_new || undefined === Margins_new )
        {
            Margins_new =
            {
                Left   : TableMargins.Left.Copy(),
                Right  : TableMargins.Right.Copy(),
                Top    : TableMargins.Top.Copy(),
                Bottom : TableMargins.Bottom.Copy()
            };

            bNeedChange = true;
        }

        switch ( Type )
        {
            case -1 :
            {
                bNeedChange = true;

                Margins_new.Top.W       = Margin.Top.W;
                Margins_new.Top.Type    = Margin.Top.Type;
                Margins_new.Right.W     = Margin.Right.W;
                Margins_new.Right.Type  = Margin.Right.Type;
                Margins_new.Bottom.W    = Margin.Bottom.W;
                Margins_new.Bottom.Type = Margin.Bottom.Type;
                Margins_new.Left.W      = Margin.Left.W;
                Margins_new.Left.Type   = Margin.Left.Type;

                break;
            }
            case 0:
            {
                if ( true != bNeedChange && Margins_new.Top.W != Margin.W || Margins_new.Top.Type != Margin.Type )
                    bNeedChange = true;

                Margins_new.Top.W    = Margin.W;
                Margins_new.Top.Type = Margin.Type;
                break;
            }
            case 1:
            {
                if ( true != bNeedChange && Margins_new.Right.W != Margin.W || Margins_new.Right.Type != Margin.Type )
                    bNeedChange = true;

                Margins_new.Right.W    = Margin.W;
                Margins_new.Right.Type = Margin.Type;
                break;
            }
            case 2:
            {
                if ( true != bNeedChange && Margins_new.Bottom.W != Margin.W || Margins_new.Bottom.Type != Margin.Type )
                    bNeedChange = true;

                Margins_new.Bottom.W    = Margin.W;
                Margins_new.Bottom.Type = Margin.Type;
                break;
            }
            case 3:
            {
                if ( true != bNeedChange && Margins_new.Left.W != Margin.W || Margins_new.Left.Type != Margin.Type )
                    bNeedChange = true;

                Margins_new.Left.W    = Margin.W;
                Margins_new.Left.Type = Margin.Type;
                break;
            }
        }

        if ( true === bNeedChange )
        {
            History.Add( this, { Type : historyitem_TableCell_Margins, Old : OldValue, New : Margins_new } );
            this.Pr.TableCellMar = Margins_new;

            this.Recalc_CompiledPr();
        }
    },

    Get_Shd : function()
    {
        var Shd = this.Get_CompiledPr(false).Shd;
        return Shd;
    },

    Set_Shd : function(Shd)
    {
        if ( undefined === Shd && undefined === this.Pr.Shd )
            return;

        if ( undefined === Shd )
        {
            History.Add( this, { Type : historyitem_TableCell_Shd, Old : this.Pr.Shd, New : undefined } );
            this.Pr.Shd = undefined;

            this.Recalc_CompiledPr();
        }
        else if ( undefined === this.Pr.Shd || false === this.Pr.Shd.Compare(Shd) )
        {
            var _Shd = new CDocumentShd();
            _Shd.Set_FromObject( Shd );
            History.Add( this, { Type : historyitem_TableCell_Shd, Old : ( undefined === this.Pr.Shd ? undefined : this.Pr.Shd ), New : _Shd } );
            this.Pr.Shd = _Shd;

            this.Recalc_CompiledPr();
        }
    },

    Get_VMerge : function()
    {
        var VMerge = this.Get_CompiledPr(false).VMerge;
        return VMerge;
    },

    Set_VMerge : function(Value)
    {
        if ( undefined === Value && undefined === this.Pr.VMerge )
            return;

        if ( undefined === Value )
        {
            History.Add( this, { Type : historyitem_TableCell_VMerge, Old : this.Pr.VMerge, New : undefined } );
            this.Pr.VMerge = undefined;
            this.Recalc_CompiledPr();
        }
        else if ( Value != this.Pr.VMerge )
        {
            History.Add( this, { Type : historyitem_TableCell_VMerge, Old : ( undefined === this.Pr.VMerge ? undefined : this.Pr.VMerge ), New : Value } );
            this.Pr.VMerge = Value;
            this.Recalc_CompiledPr();
        }
    },

    Get_VAlign : function()
    {
        var VAlign = this.Get_CompiledPr(false).VAlign;
        return VAlign;
    },

    Set_VAlign : function(Value)
    {
        if ( undefined === Value && undefined === this.Pr.VAlign )
            return;

        if ( undefined === Value )
        {
            History.Add( this, { Type : historyitem_TableCell_VAlign, Old : this.Pr.VAlign, New : undefined } );
            this.Pr.VMerge = undefined;
            this.Recalc_CompiledPr();
        }
        else if ( Value != this.Pr.VAlign )
        {
            History.Add( this, { Type : historyitem_TableCell_VAlign, Old : ( undefined === this.Pr.VAlign ? undefined : this.Pr.VAlign ), New : Value } );
            this.Pr.VAlign = Value;
            this.Recalc_CompiledPr();
        }
    },

    Get_Borders : function()
    {
        var CellBorders =
            {
                Top    : this.Get_Border( 0 ),
                Right  : this.Get_Border( 1 ),
                Bottom : this.Get_Border( 2 ),
                Left   : this.Get_Border( 3 )
            };

        return CellBorders;
    },

    // 0 - Top, 1 - Right, 2- Bottom, 3- Left
    Get_Border : function(Type)
    {
        var TableBorders = this.Row.Table.Get_TableBorders();
        var Borders = this.Get_CompiledPr(false).TableCellBorders;
        var Border = null;
        switch (Type)
        {
            case 0 :
            {
                if ( null != Borders.Top )
                    Border = Borders.Top;
                else
                {
                    if ( 0 != this.Row.Index || null != this.Row.Get_CellSpacing() )
                        Border = TableBorders.InsideH;
                    else
                        Border = TableBorders.Top;
                }

                break;
            }
            case 1 :
            {
                if ( null != Borders.Right )
                    Border = Borders.Right;
                else
                {
                    if ( this.Row.Content.length - 1 != this.Index || null != this.Row.Get_CellSpacing() )
                        Border = TableBorders.InsideV;
                    else
                        Border = TableBorders.Right;
                }

                break;
            }
            case 2 :
            {
                if ( null != Borders.Bottom )
                    Border = Borders.Bottom;
                else
                {
                    if ( this.Row.Table.Content.length - 1 != this.Row.Index || null != this.Row.Get_CellSpacing() )
                        Border = TableBorders.InsideH;
                    else
                        Border = TableBorders.Bottom;
                }

                break;
            }
            case 3 :
            {
                if ( null != Borders.Left )
                    Border = Borders.Left;
                else
                {
                    if ( 0 != this.Index || null != this.Row.Get_CellSpacing() )
                        Border = TableBorders.InsideV;
                    else
                        Border = TableBorders.Left;
                }

                break;
            }
        }

        return Border;
    },

    // 0 - Top, 1 - Right, 2- Bottom, 3- Left
    Set_Border : function(Border, Type)
    {
        var DstBorder   = this.Pr.TableCellBorders.Top;
        var HistoryType = historyitem_TableCell_Border_Left;
        switch (Type)
        {
            case 0 : DstBorder = this.Pr.TableCellBorders.Top;    HistoryType = historyitem_TableCell_Border_Top;    break;
            case 1 : DstBorder = this.Pr.TableCellBorders.Right;  HistoryType = historyitem_TableCell_Border_Right;  break;
            case 2 : DstBorder = this.Pr.TableCellBorders.Bottom; HistoryType = historyitem_TableCell_Border_Bottom; break;
            case 3 : DstBorder = this.Pr.TableCellBorders.Left;   HistoryType = historyitem_TableCell_Border_Left;   break;
        }

        if ( undefined === Border )
        {
            if ( undefined === DstBorder )
                return;
            else
            {
                History.Add( this, { Type : HistoryType, Old : DstBorder, New : undefined } );

                switch (Type)
                {
                    case 0 : this.Pr.TableCellBorders.Top    = undefined; break;
                    case 1 : this.Pr.TableCellBorders.Right  = undefined; break;
                    case 2 : this.Pr.TableCellBorders.Bottom = undefined; break;
                    case 3 : this.Pr.TableCellBorders.Left   = undefined; break;
                }

                this.Recalc_CompiledPr();
            }
        }
        else if ( null === Border )
        {
            if ( null === DstBorder )
                return;
            else
            {
                History.Add( this, { Type : HistoryType, Old : DstBorder, New : null } );

                switch (Type)
                {
                    case 0 : this.Pr.TableCellBorders.Top    = null; break;
                    case 1 : this.Pr.TableCellBorders.Right  = null; break;
                    case 2 : this.Pr.TableCellBorders.Bottom = null; break;
                    case 3 : this.Pr.TableCellBorders.Left   = null; break;
                }

                this.Recalc_CompiledPr();
            }
        }
        else if ( null === DstBorder )
        {
            // Нам вернется граница из таблицы
            var NewBorder = this.Get_Border(Type).Copy();
            NewBorder.Value   = ( null != Border.Value ? Border.Value   : NewBorder.Value );
            NewBorder.Size    = ( null != Border.Size  ? Border.Size    : NewBorder.Size  );
            NewBorder.Color.r = ( null != Border.Color ? Border.Color.r : NewBorder.Color.r );
            NewBorder.Color.g = ( null != Border.Color ? Border.Color.g : NewBorder.Color.g );
            NewBorder.Color.b = ( null != Border.Color ? Border.Color.b : NewBorder.Color.b );
            NewBorder.Unifill = ( null != Border.Unifill ? Border.Unifill : NewBorder.Unifill);
            History.Add( this, { Type : HistoryType, Old : null, New : NewBorder } );

            switch (Type)
            {
                case 0 : this.Pr.TableCellBorders.Top    = NewBorder; break;
                case 1 : this.Pr.TableCellBorders.Right  = NewBorder; break;
                case 2 : this.Pr.TableCellBorders.Bottom = NewBorder; break;
                case 3 : this.Pr.TableCellBorders.Left   = NewBorder; break;
            }

            this.Recalc_CompiledPr();
        }
        else
        {
            var NewBorder = new CDocumentBorder();

            var DefBorder = DstBorder;
            if ( undefined === DefBorder )
                DefBorder = new CDocumentBorder();

            NewBorder.Value   = ( null != Border.Value   ? Border.Value   : DefBorder.Value );
            NewBorder.Size    = ( null != Border.Size    ? Border.Size    : DefBorder.Size  );
            NewBorder.Color.r = ( null != Border.Color   ? Border.Color.r : DefBorder.Color.r );
            NewBorder.Color.g = ( null != Border.Color   ? Border.Color.g : DefBorder.Color.g );
            NewBorder.Color.b = ( null != Border.Color   ? Border.Color.b : DefBorder.Color.b );
            NewBorder.Unifill = ( null != Border.Unifill ? Border.Unifill : DefBorder.Unifill);

            History.Add( this, { Type : HistoryType, Old : DstBorder, New : NewBorder } );

            switch (Type)
            {
                case 0 : this.Pr.TableCellBorders.Top    = NewBorder; break;
                case 1 : this.Pr.TableCellBorders.Right  = NewBorder; break;
                case 2 : this.Pr.TableCellBorders.Bottom = NewBorder; break;
                case 3 : this.Pr.TableCellBorders.Left   = NewBorder; break;
            }

            this.Recalc_CompiledPr();
        }
    },

    Set_BorderInfo_Top : function( TopInfo )
    {
        this.BorderInfo.Top = TopInfo;
    },

    Set_BorderInfo_Bottom : function(BottomInfo, BeforeCount, AfterCount)
    {
        this.BorderInfo.Bottom = BottomInfo;
        this.BorderInfo.Bottom_BeforeCount = BeforeCount;
        this.BorderInfo.Bottom_AfterCount  = AfterCount;
    },

    Set_BorderInfo_Left : function(LeftInfo, Max)
    {
        this.BorderInfo.Left = LeftInfo;
        this.BorderInfo.MaxLeft = Max;
    },

    Set_BorderInfo_Right : function(RightInfo, Max)
    {
        this.BorderInfo.Right = RightInfo;
        this.BorderInfo.MaxRight = Max;
    },

    Get_BorderInfo : function()
    {
        return this.BorderInfo;
    },

    //-----------------------------------------------------------------------------------
    // Undo/Redo функции
    //-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_TableCell_GridSpan:
            {
                if ( undefined === Data.Old )
                    this.Pr.GridSpan = undefined;
                else
                    this.Pr.GridSpan = Data.Old;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Margins:
            {
                if ( undefined === Data.Old )
                    this.Pr.TableCellMar = undefined;
                else
                    this.Pr.TableCellMar = Data.Old;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Shd:
            {
                if ( undefined === Data.Old )
                    this.Pr.Shd = undefined;
                else
                    this.Pr.Shd = Data.Old;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_VMerge:
            {
                if ( undefined === Data.Old )
                    this.Pr.VMerge = undefined;
                else
                    this.Pr.VMerge = Data.Old;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Border_Left:
            {
                if ( undefined === Data.Old )
                    this.Pr.TableCellBorders.Left = undefined;
                else
                    this.Pr.TableCellBorders.Left = Data.Old;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Border_Right:
            {
                if ( undefined === Data.Old )
                    this.Pr.TableCellBorders.Right = undefined;
                else
                    this.Pr.TableCellBorders.Right = Data.Old;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Border_Top:
            {
                if ( undefined === Data.Old )
                    this.Pr.TableCellBorders.Top = undefined;
                else
                    this.Pr.TableCellBorders.Top = Data.Old;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Border_Bottom:
            {
                if ( undefined === Data.Old )
                    this.Pr.TableCellBorders.Bottom = undefined;
                else
                    this.Pr.TableCellBorders.Bottom = Data.Old;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_VAlign:
            {
                if ( undefined === Data.Old )
                    this.Pr.VAlign = undefined;
                else
                    this.Pr.VAlign = Data.Old;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_W:
            {
                if ( undefined === Data.Old )
                    this.Pr.TableCellW = undefined;
                else
                    this.Pr.TableCellW = Data.Old;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Pr:
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
            case historyitem_TableCell_GridSpan:
            {
                if ( undefined === Data.New )
                    this.Pr.GridSpan = undefined;
                else
                    this.Pr.GridSpan = Data.New;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Margins:
            {
                if ( undefined === Data.New )
                    this.Pr.TableCellMar = undefined;
                else
                    this.Pr.TableCellMar = Data.New;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Shd:
            {
                if ( undefined === Data.New )
                    this.Pr.Shd = undefined;
                else
                    this.Pr.Shd = Data.New;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_VMerge:
            {
                if ( undefined === Data.New )
                    this.Pr.VMerge = undefined;
                else
                    this.Pr.VMerge = Data.New;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Border_Left:
            {
                if ( undefined === Data.New )
                    this.Pr.TableCellBorders.Left = undefined;
                else
                    this.Pr.TableCellBorders.Left = Data.New;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Border_Right:
            {
                if ( undefined === Data.New )
                    this.Pr.TableCellBorders.Right = undefined;
                else
                    this.Pr.TableCellBorders.Right = Data.New;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Border_Top:
            {
                if ( undefined === Data.New )
                    this.Pr.TableCellBorders.Top = undefined;
                else
                    this.Pr.TableCellBorders.Top = Data.New;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Border_Bottom:
            {
                if ( undefined === Data.New )
                    this.Pr.TableCellBorders.Bottom = undefined;
                else
                    this.Pr.TableCellBorders.Bottom = Data.New;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_VAlign:
            {
                if ( undefined === Data.New )
                    this.Pr.VAlign = undefined;
                else
                    this.Pr.VAlign = Data.New;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_W:
            {
                if ( undefined === Data.New )
                    this.Pr.TableCellW = undefined;
                else
                    this.Pr.TableCellW = Data.New;

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Pr:
            {
                this.Pr = Data.New;
                this.Recalc_CompiledPr();
                break;
            }
        }
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        return this.Row.Table.Get_ParentObject_or_DocumentPos(this.Row.Table.Index);
    },

    Refresh_RecalcData : function(Data)
    {
        var bNeedRecalc = false;

        var Type = Data.Type;
        switch ( Type )
        {
            case historyitem_TableCell_GridSpan:
            case historyitem_TableCell_Margins:
            case historyitem_TableCell_VMerge:
            case historyitem_TableCell_Border_Left:
            case historyitem_TableCell_Border_Right:
            case historyitem_TableCell_Border_Top:
            case historyitem_TableCell_Border_Bottom:
            case historyitem_TableCell_VAlign:
            case historyitem_TableCell_W:
            case historyitem_TableCell_Pr:
            {
                bNeedRecalc = true;
                break;
            }
            case historyitem_TableCell_Shd:
            {
                // Пересчитывать этот элемент не надо при таких изменениях
                break;
            }
        }

        this.Row.Table.RecalcInfo.Recalc_Borders();

        this.Refresh_RecalcData2( 0, 0 );
    },

    Refresh_RecalcData2 : function(Page_Rel)
    {
        this.Row.Table.RecalcInfo.Add_Cell( this );

        var Table   = this.Row.Table;
        var TablePr = Table.Get_CompiledPr(false).TablePr;
        if (tbllayout_AutoFit === TablePr.TableLayout)
        {
            if (this.Row.Table.Parent.Pages.length > 0)
            {
                // Если изменение внутри ячейки влечет за собой изменение сетки таблицы, тогда
                // пересчитывать таблицу надо с самого начала.
                History.Add_RecalcTableGrid(Table.Get_Id());
            }
            else
                return Table.Refresh_RecalcData2(0, 0);
        }

        this.Row.Refresh_RecalcData2( this.Index, Page_Rel );
    },
    //-----------------------------------------------------------------------------------
    // Функции для работы с совместным редактирования
    //-----------------------------------------------------------------------------------
    Save_Changes : function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_TableCell );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_TableCell_GridSpan:
            {
                // Bool : Is undefined
                // Если false
                //   Long : GridSpan

                if ( undefined === Data.New )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Writer.WriteLong( Data.New );
                }

                break;
            }

            case historyitem_TableCell_Margins:
            {
                // Bool : IsUndefined
                // Если false
                //
                //   Bool : IsNull
                //   Если false
                //
                //     Variable : Top    (CTableMeasure)
                //     Variable : Left   (CTableMeasure)
                //     Variable : Bottom (CTableMeasure)
                //     Variable : Right  (CTableMeasure)

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
                        Data.New.Top.Write_ToBinary( Writer );
                        Data.New.Left.Write_ToBinary( Writer );
                        Data.New.Bottom.Write_ToBinary( Writer );
                        Data.New.Right.Write_ToBinary( Writer );
                    }
                }

                break;
            }

            case historyitem_TableCell_Shd:
            {
                // Bool : IsUndefined
                // Если  false
                //   Variable : Shd (CDocumentShd)

                if ( undefined === Data.New )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary( Writer );
                }

                break;
            }

            case historyitem_TableCell_VMerge:
            {
                // Bool : IsUndefined
                // Если false
                //   Long : VMerge

                if ( undefined === Data.New )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Writer.WriteLong( Data.New );
                }


                break;
            }

            case historyitem_TableCell_Border_Left:
            case historyitem_TableCell_Border_Right:
            case historyitem_TableCell_Border_Top:
            case historyitem_TableCell_Border_Bottom:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : IsNull
                //   Если false
                //     Variable : Border (CDocumentBorder)

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
                        Data.New.Write_ToBinary( Writer );
                    }
                }

                break;
            }

            case historyitem_TableCell_VAlign:
            {
                // Bool : IsUndefined
                // Если false
                //   Long : VAlign

                if ( undefined === Data.New )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Writer.WriteLong( Data.New );
                }


                break;
            }

            case historyitem_TableCell_W:
            {
                // Bool : IsUndefined
                // Если false
                //   Variable : TableCellW

                if ( undefined === Data.New )
                    Writer.WriteBool( true );
                else
                {
                    Writer.WriteBool( false );
                    Data.New.Write_ToBinary(Writer);
                }

                break;
            }

            case historyitem_TableCell_Pr:
            {
                // CTableCellPr
                Data.New.Write_ToBinary( Writer );
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
        if ( historyitem_type_TableCell != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_TableCell_GridSpan:
            {
                // Bool : Is undefined
                // Если false
                //   Long : GridSpan

                var bUndefined = Reader.GetBool();
                if ( true === bUndefined )
                    this.Pr.GridSpan = undefined;
                else
                    this.Pr.GridSpan = Reader.GetLong();

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Margins:
            {
                // Bool : IsUndefined
                // Если false
                //
                //   Bool : IsNull
                //   Если false
                //
                //     Variable : Top    (CTableMeasure)
                //     Variable : Left   (CTableMeasure)
                //     Variable : Bottom (CTableMeasure)
                //     Variable : Right  (CTableMeasure)

                var bUndefined = Reader.GetBool();

                if ( true === bUndefined )
                    this.Pr.TableCellMar = undefined;
                else
                {
                    var bNull = Reader.GetBool();

                    if ( true === bNull )
                        this.Pr.TableCellMar = null;
                    else
                    {
                        this.Pr.TableCellMar =
                        {
                            Top    : new CTableMeasurement(tblwidth_Auto, 0),
                            Left   : new CTableMeasurement(tblwidth_Auto, 0),
                            Bottom : new CTableMeasurement(tblwidth_Auto, 0),
                            Right  : new CTableMeasurement(tblwidth_Auto, 0)
                        };

                        this.Pr.TableCellMar.Top.Read_FromBinary( Reader );
                        this.Pr.TableCellMar.Left.Read_FromBinary( Reader );
                        this.Pr.TableCellMar.Bottom.Read_FromBinary( Reader );
                        this.Pr.TableCellMar.Right.Read_FromBinary( Reader );
                    }
                }

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Shd:
            {
                // Bool : IsUndefined
                // Если  false
                //   Variable : Shd (CDocumentShd)

                var bUndefined = Reader.GetBool();
                if ( true === bUndefined )
                    this.Pr.Shd = undefined;
                else
                {
                    this.Pr.Shd = new CDocumentShd();
                    this.Pr.Shd.Read_FromBinary( Reader );
                }

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_VMerge:
            {
                // Bool : IsUndefined
                // Если false
                //   Long : VMerge

                var bUndefined = Reader.GetBool();
                if ( true === bUndefined )
                    delete this.Pr.VMerge;
                else
                    this.Pr.VMerge = Reader.GetLong();

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Border_Left:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : IsNull
                //   Если false
                //     Variable : Border (CDocumentBorder)

                var bUndefined = Reader.GetBool();
                if ( true === bUndefined )
                    this.Pr.TableCellBorders.Left = undefined;
                else
                {
                    var bNull = Reader.GetBool();

                    if ( true === bNull )
                        this.Pr.TableCellBorders.Left = null;
                    else
                    {
                        this.Pr.TableCellBorders.Left = new CDocumentBorder();
                        this.Pr.TableCellBorders.Left.Read_FromBinary( Reader );
                    }
                }

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Border_Right:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : IsNull
                //   Если false
                //     Variable : Border (CDocumentBorder)

                var bUndefined = Reader.GetBool();
                if ( true === bUndefined )
                    this.Pr.TableCellBorders.Right = undefined;
                else
                {
                    var bNull = Reader.GetBool();

                    if ( true === bNull )
                        this.Pr.TableCellBorders.Right = null;
                    else
                    {
                        this.Pr.TableCellBorders.Right = new CDocumentBorder();
                        this.Pr.TableCellBorders.Right.Read_FromBinary( Reader );
                    }
                }

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Border_Top:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : IsNull
                //   Если false
                //     Variable : Border (CDocumentBorder)

                var bUndefined = Reader.GetBool();
                if ( true === bUndefined )
                    this.Pr.TableCellBorders.Top = undefined;
                else
                {
                    var bNull = Reader.GetBool();

                    if ( true === bNull )
                        this.Pr.TableCellBorders.Top = null;
                    else
                    {
                        this.Pr.TableCellBorders.Top = new CDocumentBorder();
                        this.Pr.TableCellBorders.Top.Read_FromBinary( Reader );
                    }
                }

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Border_Bottom:
            {
                // Bool : IsUndefined
                // Если false
                //   Bool : IsNull
                //   Если false
                //     Variable : Border (CDocumentBorder)

                var bUndefined = Reader.GetBool();
                if ( true === bUndefined )
                    this.Pr.TableCellBorders.Bottom = undefined;
                else
                {
                    var bNull = Reader.GetBool();

                    if ( true === bNull )
                        this.Pr.TableCellBorders.Bottom = null;
                    else
                    {
                        this.Pr.TableCellBorders.Bottom = new CDocumentBorder();
                        this.Pr.TableCellBorders.Bottom.Read_FromBinary( Reader );
                    }
                }

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_VAlign:
            {
                // Bool : IsUndefined
                // Если false
                //   Long : VAlign

                var bUndefined = Reader.GetBool();
                if ( true === bUndefined )
                    delete this.Pr.VAlign;
                else
                    this.Pr.VAlign = Reader.GetLong();

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_W:
            {
                // Bool : IsUndefined
                // Если false
                //   Variable : TableCellW

                if ( true === Reader.GetBool() )
                    delete this.Pr.TableCellW;
                else
                {
                    this.Pr.TableCellW = new CTableMeasurement(tblwidth_Auto, 0);
                    this.Pr.TableCellW.Read_FromBinary( Reader );
                }

                this.Recalc_CompiledPr();
                break;
            }

            case historyitem_TableCell_Pr:
            {
                // CTableCellPr

                this.Pr = new CTableCellPr();
                this.Pr.Read_FromBinary( Reader );

                this.Recalc_CompiledPr();
                break;
            }
        }
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_TableCell );

        // String   : Id ячейки
        // Variable : TableCell.Pr
        // String   : Id DocumentContent

        Writer.WriteString2( this.Id );
        this.Pr.Write_ToBinary( Writer );
        Writer.WriteString2( this.Content.Get_Id() );
    },

    Read_FromBinary2 : function(Reader)
    {
        // String   : Id ячейки
        // Variable : TableCell.Pr
        // String   : Id DocumentContent

        this.Id = Reader.GetString2();
        this.Pr = new CTableCellPr();
        this.Pr.Read_FromBinary( Reader );
        this.Recalc_CompiledPr();

        this.Content = g_oTableId.Get_ById( Reader.GetString2() );

        CollaborativeEditing.Add_NewObject( this );
    },

    Load_LinkData : function(LinkData)
    {
    }
};

CTableCell.prototype.Get_TopElement = function()
{
    if (this.Row && this.Row.Table)
        return this.Row.Table.Get_TopElement();

    return null;
};
CTableCell.prototype.Is_EmptyFirstPage = function()
{
    if (!this.Row || !this.Row.Table || !this.Row.Table.RowsInfo[this.Row.Index] || true === this.Row.Table.RowsInfo[this.Row.Index].FirstPage)
        return true;

    return false;
};
CTableCell.prototype.Get_SectPr = function()
{
    if (this.Row && this.Row.Table && this.Row.Table)
        return this.Row.Table.Get_SectPr();

    return null;
};
CTableCell.prototype.Get_DocumentPositionFromObject = function(PosArray)
{
    if (!PosArray)
        PosArray = [];

    if (this.Row)
    {
        PosArray.splice(0, 0, {Class : this.Row, Position : this.Index});
        this.Row.Get_DocumentPositionFromObject(PosArray);
    }

    return PosArray;
};
CTableCell.prototype.Get_Table = function()
{
    var Row = this.Row;
    if (!Row)
        return null;

    var Table = Row.Table;
    if (!Table)
        return null;

    return Table;
};

function CTableCellRecalculateObject()
{
    this.BorderInfo = null;
    this.Metrics    = null;
    this.Temp       = null;

    this.Content    = null;
}

CTableCellRecalculateObject.prototype =
{
    Save : function(Cell)
    {
        this.BorderInfo = Cell.BorderInfo;
        this.Metrics    = Cell.Metrics;
        this.Temp       = Cell.Temp;

        this.Content = Cell.Content.Save_RecalculateObject();
    },

    Load : function(Cell)
    {
        Cell.BorderInfo = this.BorderInfo;
        Cell.Metrics    = this.Metrics;
        Cell.Temp       = this.Temp;

        Cell.Content.Load_RecalculateObject( this.Content );
    },

    Get_DrawingFlowPos : function(FlowPos)
    {
        this.Content.Get_DrawingFlowPos( FlowPos );
    }

};