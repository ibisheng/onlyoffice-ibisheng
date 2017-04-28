/*
 * (c) Copyright Ascensio System SIA 2010-2017
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

// Import
var History = AscCommon.History;
var global_MatrixTransformer = AscCommon.global_MatrixTransformer;

//----------------------------------------------------------------------------------------------------------------------
// Класс CTableCell
//----------------------------------------------------------------------------------------------------------------------
function CTableCell(Row, ColW)
{
    this.Id = AscCommon.g_oIdCounter.Get_NewId();

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

        X_start : 0,
        Y_start : 0,
        X_end   : 0,
        Y_end   : 0,

        X_cell_start : 0,
        X_cell_end   : 0,
        Y_cell_start : 0,
        Y_cell_end   : 0,

        Y_VAlign_offset : [] // Сдвиг, который нужно сделать из-за VAlign (массив по страницам)
    };

    this.Index = 0;

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    AscCommon.g_oTableId.Add( this, this.Id );
}

CTableCell.prototype =
{
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

	SaveRecalculateObject : function()
    {
        var RecalcObj = new CTableCellRecalculateObject();
        RecalcObj.Save( this );
        return RecalcObj;
    },

	LoadRecalculateObject : function(RecalcObj)
    {
        RecalcObj.Load(this);
    },

	PrepareRecalculateObject : function()
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

        this.Content.PrepareRecalculateObject();
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
            if (true === AscCommon.g_oIdCounter.m_bLoad || true === AscCommon.g_oIdCounter.m_bRead)
            {
                this.CompiledPr.Pr     = g_oDocumentDefaultTableCellPr;
                this.CompiledPr.ParaPr = g_oDocumentDefaultParaPr;
                this.CompiledPr.TextPr = g_oDocumentDefaultTextPr;
                this.CompiledPr.NeedRecalc = true;
            }
            else
            {
                // TODO: Возможно стоит разделить рассчет стиля для ячейки и для текста
                var FullPr                 = this.Internal_Compile_Pr();
                this.CompiledPr.Pr         = FullPr.CellPr;
                this.CompiledPr.ParaPr     = FullPr.ParaPr;
                this.CompiledPr.TextPr     = FullPr.TextPr;
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
            var __RowIndex  = ( true != TableLook.Is_FirstRow() ? RowIndex : RowIndex - 1 );
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
		// Согласно спецификации DOCX, совмещать надо всегда. Word проверяет наличие первой колонки не только
		// через флаг TableLook.Is_FirstCol(), но и самим наличием непустого стиля для первой колонки.
		if (true === TableLook.Is_BandVer())
		{
			var bFirstCol = false;
			if (true === TableLook.Is_FirstCol())
			{
				var oTableStyle = this.Get_Styles().Get(this.Row.Table.Get_TableStyle());
				if (oTableStyle && styletype_Table === oTableStyle.Get_Type() && oTableStyle.TableFirstCol)
				{
					var oCondStyle = oTableStyle.TableFirstCol;
					if (true !== oCondStyle.TableCellPr.Is_Empty()
						|| true !== oCondStyle.ParaPr.Is_Empty()
						|| true !== oCondStyle.TextPr.Is_Empty())
					{
						bFirstCol = true;
					}
				}
			}

			var ColBandSize    = TablePr.TablePr.TableStyleColBandSize;
			var _ColIndex      = ( true != bFirstCol ? CellIndex : CellIndex - 1 );
			var ColIndex       = ( 1 != ColBandSize ? Math.floor(_ColIndex / ColBandSize) : _ColIndex );
			var TableBandStyle = null;
			if (0 === ColIndex % 2)
				TableBandStyle = TablePr.TableBand1Vert;
			else
				TableBandStyle = TablePr.TableBand2Vert;

			CellPr.Merge(TableBandStyle.TableCellPr);
			TextPr.Merge(TableBandStyle.TextPr);
			ParaPr.Merge(TableBandStyle.ParaPr);
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

        if ( Asc.c_oAscShdNil !== Shd.Value )
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

    Is_TableFirstRowOnNewPage : function()
    {
        return this.Row.Table.Is_TableFirstRowOnNewPage(this.Row.Index);
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

	GetNumberingInfo : function(NumPr)
    {
        var Parent = this.Row.Table.Parent;
        if (Parent && Parent.Internal_GetNumInfo)
            return Parent.Internal_GetNumInfo(this.Row.Table.Get_Id(), NumPr);

        return null;
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
        Table.Selection.Use   = this.Content.IsSelectionUse();

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
            if ((Parent instanceof AscFormat.CGraphicFrame) || docpostype_Content === Parent.Get_DocPosType() && false === Parent.Selection.Use && this.Index === Parent.CurPos.ContentPos )
                return Table.Parent.Is_ThisElementCurrent();
        }

        return false;
    },

	CheckTableCoincidence : function(Table)
	{
		var CurTable = this.Row.Table;
		if (Table === CurTable)
			return true;
		else
			return CurTable.Parent.CheckTableCoincidence(Table);
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

    Get_ParentTextTransform: function()
    {
        var oParentTransform = this.Row.Table.Get_ParentTextTransform();
        var oOwnTransform = this.private_GetTextDirectionTransform();
        if(oOwnTransform && oParentTransform)
        {
            global_MatrixTransformer.MultiplyAppend(oOwnTransform, oParentTransform);
            return oOwnTransform;
        }
        return oParentTransform || oOwnTransform;
    },

    Content_Reset : function(X, Y, XLimit, YLimit)
    {
        this.Content.Reset( X, Y, XLimit, YLimit );
        this.Content.SetCurPosXY( X, Y );
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
        var TextDirection = this.Get_TextDirection();
        var bNeedRestore = false;
        var _transform = undefined;
        if (textdirection_BTLR === TextDirection || textdirection_TBRL === TextDirection)
        {
            bNeedRestore = true;
            pGraphics.SaveGrState();
            pGraphics.AddClipRect(this.Temp.X_cell_start, this.Temp.Y_cell_start, this.Temp.X_cell_end - this.Temp.X_cell_start, this.Temp.Y_cell_end - this.Temp.Y_cell_start);

            _transform = this.Get_ParentTextTransform();
            if (pGraphics.CheckUseFonts2 !== undefined)
                pGraphics.CheckUseFonts2(_transform);
            pGraphics.transform3(_transform);
        }

        this.Content.Draw(PageIndex, pGraphics);
        if (bNeedRestore)
        {
            pGraphics.RestoreGrState();
            if (pGraphics.UncheckUseFonts2 !== undefined && _transform)
                pGraphics.UncheckUseFonts2(_transform);
        }
    },

    Content_Selection_SetStart : function(X, Y, CurPage, MouseEvent)
    {
        var _X = X, _Y = Y;
        var Transform = this.private_GetTextDirectionTransform();
        if (null !== Transform)
        {
            Transform = global_MatrixTransformer.Invert(Transform);
            _X = Transform.TransformPointX(X, Y);
            _Y = Transform.TransformPointY(X, Y);
        }

        this.Content.Selection_SetStart(_X, _Y, CurPage, MouseEvent);
    },

    Content_Selection_SetEnd : function(X, Y, CurPage, MouseEvent)
    {
        var _X = X, _Y = Y;
        var Transform = this.private_GetTextDirectionTransform();
        if (null !== Transform)
        {
            Transform = global_MatrixTransformer.Invert(Transform);
            _X = Transform.TransformPointX(X, Y);
            _Y = Transform.TransformPointY(X, Y);
        }

        this.Content.Selection_SetEnd(_X, _Y, CurPage, MouseEvent);
    },

    Content_Selection_Stop : function()
    {
        return this.Content.Selection_Stop();
    },

    Content_CheckPosInSelection : function(X, Y, CurPage, NearPos)
    {
        var _X = X, _Y = Y;
        var Transform = this.private_GetTextDirectionTransform();
        if (null !== Transform)
        {
            Transform = global_MatrixTransformer.Invert(Transform);
            _X = Transform.TransformPointX(X, Y);
            _Y = Transform.TransformPointY(X, Y);
        }
        return this.Content.CheckPosInSelection(_X, _Y, CurPage, NearPos);
    },

    Content_MoveCursorToXY : function(X, Y, bLine, bDontChangeRealPos, CurPage)
    {
        var _X = X, _Y = Y;
        var Transform = this.private_GetTextDirectionTransform();
        if (null !== Transform)
        {
            Transform = global_MatrixTransformer.Invert(Transform);
            _X = Transform.TransformPointX(X, Y);
            _Y = Transform.TransformPointY(X, Y);
        }

        this.Content.MoveCursorToXY(_X, _Y, bLine, bDontChangeRealPos, CurPage);
    },

    Content_UpdateCursorType : function(X, Y, CurPage)
    {
        var _X = X, _Y = Y;
        var Transform = this.private_GetTextDirectionTransform();
        if (null !== Transform)
        {
            Transform = global_MatrixTransformer.Invert(Transform);
            _X = Transform.TransformPointX(X, Y);
            _Y = Transform.TransformPointY(X, Y);
        }

        this.Content.UpdateCursorType(_X, _Y, CurPage);
    },

	Content_DrawSelectionOnPage : function(CurPage)
	{
		var Transform       = this.private_GetTextDirectionTransform();
		var DrawingDocument = this.Row.Table.DrawingDocument;
		if (null !== Transform && DrawingDocument)
			DrawingDocument.MultiplyTargetTransform(Transform);

		this.Content.DrawSelectionOnPage(CurPage);
	},

    Content_RecalculateCurPos : function()
    {
        var Transform = this.private_GetTextDirectionTransform();
        var DrawingDocument = this.Row.Table.DrawingDocument;
        if (null !== Transform && DrawingDocument)
            DrawingDocument.MultiplyTargetTransform(Transform);

        return this.Content.RecalculateCurPos();
    },

    Content_Get_NearestPos : function(CurPage, X, Y, bAnchor, Drawing)
    {
        var _X = X, _Y = Y;
        var Transform = this.private_GetTextDirectionTransform();
        if (null !== Transform)
        {
            Transform = global_MatrixTransformer.Invert(Transform);
            _X = Transform.TransformPointX(X, Y);
            _Y = Transform.TransformPointY(X, Y);
        }

        return this.Content.Get_NearestPos(CurPage, _X, _Y, bAnchor, Drawing);
    },

    Content_Is_TableBorder : function(X, Y, CurPage)
    {
        var _X = X, _Y = Y;
        var Transform = this.private_GetTextDirectionTransform();
        if (null !== Transform)
        {
            Transform = global_MatrixTransformer.Invert(Transform);
            _X = Transform.TransformPointX(X, Y);
            _Y = Transform.TransformPointY(X, Y);
        }
        return this.Content.IsTableBorder(_X, _Y, CurPage);
    },

    Content_Is_InText : function(X, Y, CurPage)
    {
        var _X = X, _Y = Y;
        var Transform = this.private_GetTextDirectionTransform();
        if (null !== Transform)
        {
            Transform = global_MatrixTransformer.Invert(Transform);
            _X = Transform.TransformPointX(X, Y);
            _Y = Transform.TransformPointY(X, Y);
        }
        return this.Content.IsInText(_X, _Y, CurPage);
    },

    Content_Is_InDrawing : function(X, Y, CurPage)
    {
        var _X = X, _Y = Y;
        var Transform = this.private_GetTextDirectionTransform();
        if (null !== Transform)
        {
            Transform = global_MatrixTransformer.Invert(Transform);
            _X = Transform.TransformPointX(X, Y);
            _Y = Transform.TransformPointY(X, Y);
        }
        return this.Content.IsInDrawing(_X, _Y, CurPage);
    },

    Content_GetCurPosXY : function()
    {
        return this.Content.GetCurPosXY();
    },

    Content_SetCurPosXY : function(X, Y)
    {
        var _X = X, _Y = Y;
        var Transform = this.private_GetTextDirectionTransform();
        if (null !== Transform)
        {
            Transform = global_MatrixTransformer.Invert(Transform);
            _X = Transform.TransformPointX(X, Y);
            _Y = Transform.TransformPointY(X, Y);
        }
        return this.Content.SetCurPosXY(_X, _Y);
    },

    Content_MoveCursorUpToLastRow : function(X, Y, AddToSelect)
    {
        var _X = X, _Y = Y;
        var Transform = this.private_GetTextDirectionTransform();
        if (null !== Transform)
        {
            Transform = global_MatrixTransformer.Invert(Transform);
            _X = Transform.TransformPointX(X, Y);
            _Y = Transform.TransformPointY(X, Y);
        }
        return this.Content.MoveCursorUpToLastRow(_X, _Y, AddToSelect);
    },

    Content_MoveCursorDownToFirstRow : function(X, Y, AddToSelect)
    {
        var _X = X, _Y = Y;
        var Transform = this.private_GetTextDirectionTransform();
        if (null !== Transform)
        {
            Transform = global_MatrixTransformer.Invert(Transform);
            _X = Transform.TransformPointX(X, Y);
            _Y = Transform.TransformPointY(X, Y);
        }
        return this.Content.MoveCursorDownToFirstRow(_X, _Y, AddToSelect);
    },

    Content_RecalculateMinMaxContentWidth : function(isRotated)
    {
        if (undefined === isRotated)
            isRotated = false;

        if (true === this.Is_VerticalText())
            isRotated = true === isRotated ? false : true;

        var Result = this.Content.RecalculateMinMaxContentWidth(isRotated);

        if (true !== isRotated && true === this.Get_NoWrap())
            Result.Min = Math.max(Result.Min, Result.Max);

        return Result;
    },

    Content_Shift : function(CurPage, dX, dY)
    {
        if (true === this.Is_VerticalText())
        {
            this.Temp.X_start += dX;
            this.Temp.Y_start += dY;
            this.Temp.X_end   += dX;
            this.Temp.Y_end   += dY;

            this.Temp.X_cell_start += dX;
            this.Temp.Y_cell_start += dY;
            this.Temp.X_cell_end   += dX;
            this.Temp.Y_cell_end   += dY;

            this.Temp.Y += dY;
        }
        else
        {
            this.Content.Shift(CurPage, dX, dY);
        }
    },

    private_GetTextDirectionTransform : function()
    {
        var Transform = null;
        var TextDirection = this.Get_TextDirection();

        if (textdirection_BTLR === TextDirection)
        {
            Transform = new AscCommon.CMatrix();
            global_MatrixTransformer.RotateRadAppend(Transform, 0.5 *  Math.PI);
            global_MatrixTransformer.TranslateAppend(Transform, this.Temp.X_start, this.Temp.Y_end);
        }
        else if (textdirection_TBRL === TextDirection)
        {
            var Transform = new AscCommon.CMatrix();
            global_MatrixTransformer.RotateRadAppend(Transform, -0.5 *  Math.PI);
            global_MatrixTransformer.TranslateAppend(Transform, this.Temp.X_end, this.Temp.Y_start);
        }

        return Transform;
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

    Content_MoveCursorToStartPos : function()
    {
        this.Content.MoveCursorToStartPos();
    },

    Content_MoveCursorToEndPos : function()
    {
        this.Content.MoveCursorToEndPos();
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
		History.Add(new CChangesTableCellPr(this, this.Pr, CellPr));
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

        // TextDirection
        this.Set_TextDirection(OtherPr.TextDirection);

        // NoWrap
        this.Set_NoWrap(OtherPr.NoWrap);
    },

    Get_W : function()
    {
        var W = this.Get_CompiledPr(false).TableCellW;
        return W.Copy();
    },

	Set_W : function(CellW)
	{
		History.Add(new CChangesTableCellW(this, this.Pr.TableCellW, CellW));
		this.Pr.TableCellW = CellW;
		this.Recalc_CompiledPr();
	},

    Get_GridSpan : function()
    {
        var GridSpan = this.Get_CompiledPr(false).GridSpan;
        return GridSpan;
    },

	Set_GridSpan : function(Value)
	{
		if (this.Pr.GridSpan === Value)
			return;

		History.Add(new CChangesTableCellGridSpan(this, this.Pr.GridSpan, Value));
		this.Pr.GridSpan = Value;
		this.Recalc_CompiledPr();
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

		if (undefined === Margin || null === Margin)
		{
			if (Margin !== this.Pr.TableCellMar)
			{
				History.Add(new CChangesTableCellMargins(this, OldValue, Margin));
				this.Pr.TableCellMar = undefined;
				this.Recalc_CompiledPr();
			}

			return;
		}

		var Margins_new = this.Pr.TableCellMar;

		var bNeedChange  = false;
		var TableMargins = this.Row.Table.Get_TableCellMar();
		if (null === Margins_new || undefined === Margins_new)
		{
			Margins_new = {
				Left   : TableMargins.Left.Copy(),
				Right  : TableMargins.Right.Copy(),
				Top    : TableMargins.Top.Copy(),
				Bottom : TableMargins.Bottom.Copy()
			};

			bNeedChange = true;
		}

		switch (Type)
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
				if (true != bNeedChange && Margins_new.Top.W != Margin.W || Margins_new.Top.Type != Margin.Type)
					bNeedChange = true;

				Margins_new.Top.W    = Margin.W;
				Margins_new.Top.Type = Margin.Type;
				break;
			}
			case 1:
			{
				if (true != bNeedChange && Margins_new.Right.W != Margin.W || Margins_new.Right.Type != Margin.Type)
					bNeedChange = true;

				Margins_new.Right.W    = Margin.W;
				Margins_new.Right.Type = Margin.Type;
				break;
			}
			case 2:
			{
				if (true != bNeedChange && Margins_new.Bottom.W != Margin.W || Margins_new.Bottom.Type != Margin.Type)
					bNeedChange = true;

				Margins_new.Bottom.W    = Margin.W;
				Margins_new.Bottom.Type = Margin.Type;
				break;
			}
			case 3:
			{
				if (true != bNeedChange && Margins_new.Left.W != Margin.W || Margins_new.Left.Type != Margin.Type)
					bNeedChange = true;

				Margins_new.Left.W    = Margin.W;
				Margins_new.Left.Type = Margin.Type;
				break;
			}
		}

		if (true === bNeedChange)
		{
			History.Add(new CChangesTableCellMargins(this, OldValue, Margins_new));
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
		if (undefined === Shd && undefined === this.Pr.Shd)
			return;

		if (undefined === Shd)
		{
			History.Add(new CChangesTableCellShd(this, this.Pr.Shd, undefined));
			this.Pr.Shd = undefined;
			this.Recalc_CompiledPr();
		}
		else if (undefined === this.Pr.Shd || false === this.Pr.Shd.Compare(Shd))
		{
			var _Shd = new CDocumentShd();
			_Shd.Set_FromObject(Shd);
			History.Add(new CChangesTableCellShd(this, this.Pr.Shd, _Shd));
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
		if (Value === this.Pr.VMerge)
			return;

		History.Add(new CChangesTableCellVMerge(this, this.Pr.VMerge, Value));
		this.Pr.VMerge = Value;
		this.Recalc_CompiledPr();
	},

    Get_VAlign : function()
    {
        var VAlign = this.Get_CompiledPr(false).VAlign;
        return VAlign;
    },

	Set_VAlign : function(Value)
	{
		if (Value === this.Pr.VAlign)
			return;

		History.Add(new CChangesTableCellVAlign(this, this.Pr.VAlign, Value));
		this.Pr.VAlign = Value;
		this.Recalc_CompiledPr();
	},

    Get_NoWrap : function()
    {
        return this.Get_CompiledPr(false).NoWrap;
    },

	Set_NoWrap : function(Value)
	{
		if (this.Pr.NoWrap !== Value)
		{
			History.Add(new CChangesTableCellNoWrap(this, this.Pr.NoWrap, Value));
			this.Pr.NoWrap = Value;
			this.Recalc_CompiledPr();
		}
	},

    Is_VerticalText : function()
    {
        var TextDirection = this.Get_TextDirection();
        if (textdirection_BTLR === TextDirection || textdirection_TBRL === TextDirection)
            return true;

        return false;
    },

    Get_TextDirection : function()
    {
        return this.Get_CompiledPr(false).TextDirection;
    },

	Set_TextDirection : function(Value)
	{
		if (Value !== this.Pr.TextDirection)
		{
			History.Add(new CChangesTableCellTextDirection(this, this.Pr.TextDirection, Value));
			this.Pr.TextDirection = Value;
			this.Recalc_CompiledPr();
		}
	},

    Set_TextDirectionFromApi : function(TextDirection)
    {
        var isVerticalText = (textdirection_BTLR === TextDirection || textdirection_TBRL === TextDirection) ? true : false;

        // Во время изменения направления текста меняем высоту строки, если надо и отступы и параграфов внутри ячейки.
        var OldTextDirection = this.Get_TextDirection();
        this.Set_TextDirection(TextDirection);

        if (OldTextDirection !== TextDirection)
        {
            if (true === isVerticalText)
            {
                var Row  = this.Row;
                var RowH = this.Row.Get_Height();

                if (Asc.linerule_Auto === RowH.HRule)
                    Row.Set_Height(20, Asc.linerule_AtLeast);
                else if (RowH.Value < 20)
                    Row.Set_Height(20, RowH.HRule);
            }

            this.Content.Set_ParaPropsForVerticalTextInCell(isVerticalText);
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
		var DstBorder = this.Pr.TableCellBorders.Top;
		switch (Type)
		{
			case 0 :
				DstBorder = this.Pr.TableCellBorders.Top;
				break;
			case 1 :
				DstBorder = this.Pr.TableCellBorders.Right;
				break;
			case 2 :
				DstBorder = this.Pr.TableCellBorders.Bottom;
				break;
			case 3 :
				DstBorder = this.Pr.TableCellBorders.Left;
				break;
		}

		if (undefined === Border || null === Border)
		{
			if (Border === DstBorder)
				return;

			switch (Type)
			{
				case 0:
				{
					History.Add(new CChangesTableCellBorderTop(this, this.Pr.TableCellBorders.Top, Border));
					this.Pr.TableCellBorders.Top = undefined;
					break;
				}
				case 1 :
				{
					History.Add(new CChangesTableCellBorderRight(this, this.Pr.TableCellBorders.Right, Border));
					this.Pr.TableCellBorders.Right = undefined;
					break;
				}
				case 2 :
				{
					History.Add(new CChangesTableCellBorderBottom(this, this.Pr.TableCellBorders.Bottom, Border));
					this.Pr.TableCellBorders.Bottom = undefined;
					break;
				}
				case 3 :
				{
					History.Add(new CChangesTableCellBorderLeft(this, this.Pr.TableCellBorders.Left, Border));
					this.Pr.TableCellBorders.Left = undefined;
					break;
				}
			}

			this.Recalc_CompiledPr();
		}
		else if (null === DstBorder)
		{
			var NewBorder = this.Get_Border(Type).Copy();

			NewBorder.Value   = null != Border.Value ? Border.Value : NewBorder.Value;
			NewBorder.Size    = null != Border.Size ? Border.Size : NewBorder.Size;
			NewBorder.Color.r = null != Border.Color ? Border.Color.r : NewBorder.Color.r;
			NewBorder.Color.g = null != Border.Color ? Border.Color.g : NewBorder.Color.g;
			NewBorder.Color.b = null != Border.Color ? Border.Color.b : NewBorder.Color.b;
			NewBorder.Unifill = null != Border.Unifill ? Border.Unifill : NewBorder.Unifill;

			switch (Type)
			{
				case 0:
				{
					History.Add(new CChangesTableCellBorderTop(this, this.Pr.TableCellBorders.Top, NewBorder));
					this.Pr.TableCellBorders.Top = NewBorder;
					break;
				}
				case 1 :
				{
					History.Add(new CChangesTableCellBorderRight(this, this.Pr.TableCellBorders.Right, NewBorder));
					this.Pr.TableCellBorders.Right = NewBorder;
					break;
				}
				case 2 :
				{
					History.Add(new CChangesTableCellBorderBottom(this, this.Pr.TableCellBorders.Bottom, NewBorder));
					this.Pr.TableCellBorders.Bottom = NewBorder;
					break;
				}
				case 3 :
				{
					History.Add(new CChangesTableCellBorderLeft(this, this.Pr.TableCellBorders.Left, NewBorder));
					this.Pr.TableCellBorders.Left = NewBorder;
					break;
				}
			}

			this.Recalc_CompiledPr();
		}
		else
		{
			var NewBorder = new CDocumentBorder();

			var DefBorder = DstBorder;
			if (undefined === DefBorder)
				DefBorder = new CDocumentBorder();

			NewBorder.Value   = null != Border.Value ? Border.Value : DefBorder.Value;
			NewBorder.Size    = null != Border.Size ? Border.Size : DefBorder.Size;
			NewBorder.Color.r = null != Border.Color ? Border.Color.r : DefBorder.Color.r;
			NewBorder.Color.g = null != Border.Color ? Border.Color.g : DefBorder.Color.g;
			NewBorder.Color.b = null != Border.Color ? Border.Color.b : DefBorder.Color.b;
			NewBorder.Unifill = null != Border.Unifill ? Border.Unifill : DefBorder.Unifill;

			switch (Type)
			{
				case 0:
				{
					History.Add(new CChangesTableCellBorderTop(this, this.Pr.TableCellBorders.Top, NewBorder));
					this.Pr.TableCellBorders.Top = NewBorder;
					break;
				}
				case 1 :
				{
					History.Add(new CChangesTableCellBorderRight(this, this.Pr.TableCellBorders.Right, NewBorder));
					this.Pr.TableCellBorders.Right = NewBorder;
					break;
				}
				case 2 :
				{
					History.Add(new CChangesTableCellBorderBottom(this, this.Pr.TableCellBorders.Bottom, NewBorder));
					this.Pr.TableCellBorders.Bottom = NewBorder;
					break;
				}
				case 3 :
				{
					History.Add(new CChangesTableCellBorderLeft(this, this.Pr.TableCellBorders.Left, NewBorder));
					this.Pr.TableCellBorders.Left = NewBorder;
					break;
				}
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
            case AscDFH.historyitem_TableCell_GridSpan:
            case AscDFH.historyitem_TableCell_Margins:
            case AscDFH.historyitem_TableCell_VMerge:
            case AscDFH.historyitem_TableCell_Border_Left:
            case AscDFH.historyitem_TableCell_Border_Right:
            case AscDFH.historyitem_TableCell_Border_Top:
            case AscDFH.historyitem_TableCell_Border_Bottom:
            case AscDFH.historyitem_TableCell_VAlign:
            case AscDFH.historyitem_TableCell_W:
            case AscDFH.historyitem_TableCell_Pr:
            case AscDFH.historyitem_TableCell_TextDirection:
            case AscDFH.historyitem_TableCell_NoWrap:
            {
                bNeedRecalc = true;
                break;
            }
            case AscDFH.historyitem_TableCell_Shd:
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
    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( AscDFH.historyitem_type_TableCell );

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

        this.Content = AscCommon.g_oTableId.Get_ById( Reader.GetString2() );

        AscCommon.CollaborativeEditing.Add_NewObject( this );
    },

    Load_LinkData : function(LinkData)
    {
    }
};
CTableCell.prototype.private_TransformXY = function(X, Y)
{
	// TODO: Везде, где идет такой код заменить на данную функцию

	var _X = X, _Y = Y;
	var Transform = this.private_GetTextDirectionTransform();
	if (null !== Transform)
	{
		Transform = global_MatrixTransformer.Invert(Transform);
		_X = Transform.TransformPointX(X, Y);
		_Y = Transform.TransformPointY(X, Y);
	}

	return {X : _X, Y : _Y};
};
CTableCell.prototype.GetTopElement = function()
{
    if (this.Row && this.Row.Table)
        return this.Row.Table.GetTopElement();

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
CTableCell.prototype.Get_TopDocumentContent = function()
{
    if (this.Row && this.Row.Table && this.Row.Table.Parent)
        return this.Row.Table.Parent.Get_TopDocumentContent();

    return null;
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

        this.Content = Cell.Content.SaveRecalculateObject();
    },

    Load : function(Cell)
    {
        Cell.BorderInfo = this.BorderInfo;
        Cell.Metrics    = this.Metrics;
        Cell.Temp       = this.Temp;

        Cell.Content.LoadRecalculateObject( this.Content );
    },

    Get_DrawingFlowPos : function(FlowPos)
    {
        this.Content.Get_DrawingFlowPos( FlowPos );
    }

};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CTableCell = CTableCell;
