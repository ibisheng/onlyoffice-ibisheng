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

// TODO: При расчете таблиц есть один баг, который надо будет поправить в будущем:
//       при разбиении строки на страницы возможен вариант, когда у каких-то ячеек
//       убирается содержимое на первой странице, а у каких-то - нет. В данном случае
//       надо для всех ячеек содержимое переносить на новую страницу(как в Word).

// TODO: Несовсем правильно(всмысле не как в Word) обрабатывается верхнее поле ячеек:
//       особенно это проявляется в таблицах с ненулевым расстоянием между ячейками.

    
// TODO: Оказалось, что параметр "не отрывать от следующего" влияет и на таблицы, если 
//       после параграфа с таким параметром идет таблица. (см. MSFT_FY11Q3_10Q.docx стр. 3)
    
// TODO: Поскольку, расстояния до/после параграфа для первого и последнего параграфов 
//       в ячейке зависит от следующей и предыдущей ячеек, надо включать их в пересчет

// Import
var align_Left = AscCommon.align_Left;
var CMouseMoveData = AscCommon.CMouseMoveData;
var g_oTableId = AscCommon.g_oTableId;
var History = AscCommon.History;

var linerule_AtLeast = Asc.linerule_AtLeast;
var c_oAscError = Asc.c_oAscError;
var c_oAscHAnchor = Asc.c_oAscHAnchor;
var c_oAscXAlign = Asc.c_oAscXAlign;
var c_oAscYAlign = Asc.c_oAscYAlign;
var c_oAscVAnchor = Asc.c_oAscVAnchor;
var c_oAscCellTextDirection = Asc.c_oAscCellTextDirection;
    

var table_Selection_Cell = 0x00; // Селектим целыми ячейками
var table_Selection_Text = 0x01; // Селектим текст внутри текущей ячейки

var table_Selection_Common            = 0x00;
var table_Selection_Border            = 0x01;
var table_Selection_Border_InnerTable = 0x02;

var type_Table = 0x0002;


/**
 * Класс CTable
 * @constructor
 * @extends {CDocumentContentElementBase}
 */
//----------------------------------------------------------------------------------------------------------------------
// Класс  CTable
//----------------------------------------------------------------------------------------------------------------------
function CTable(DrawingDocument, Parent, Inline, PageNum, X, Y, XLimit, YLimit, Rows, Cols, TableGrid, bPresentation)
{
	CDocumentContentElementBase.call(this, Parent);

    this.Markup = new AscCommon.CTableMarkup(this);

    this.Inline = Inline;

    this.Lock = new AscCommon.CLock();
    // TODO: Когда у g_oIdCounter будет тоже проверка на TurnOff заменить здесь
    if (false === AscCommon.g_oIdCounter.m_bLoad && true === History.Is_On())
    {
        this.Lock.Set_Type(AscCommon.locktype_Mine, false);
        if (AscCommon.CollaborativeEditing)
            AscCommon.CollaborativeEditing.Add_Unlock2(this);
    }
    
    this.DrawingDocument = null;
    this.LogicDocument   = null;
    
    if ( undefined !== DrawingDocument && null !== DrawingDocument )
    {
        this.DrawingDocument = DrawingDocument;
        this.LogicDocument   = this.DrawingDocument.m_oLogicDocument;
    }
    
    this.PageNum      = PageNum;
    this.ColumnNum    = 0;
    this.ColumnsCount = 1;

    this.CompiledPr =
    {
        Pr         : null,  // Скомпилированный (окончательный стиль)
        NeedRecalc : true   // Нужно ли пересчитать скомпилированный стиль
    };

    this.Pr = new CTablePr();
    this.Pr.TableW = new CTableMeasurement(tblwidth_Auto, 0);

    this.TableGridNeedRecalc = true;
    this.bPresentation = bPresentation === true;

    // TODO: TableLook и TableStyle нужно перемесить в TablePr
    this.TableStyle = (undefined !== this.DrawingDocument && null !== this.DrawingDocument && this.DrawingDocument.m_oLogicDocument && this.DrawingDocument.m_oLogicDocument.Styles ? this.DrawingDocument.m_oLogicDocument.Styles.Get_Default_TableGrid() : null);
    this.TableLook  = new CTableLook(true, true, false, false, true, false);

    this.TableSumGrid  = []; // данный массив будет заполнен после private_RecalculateGrid
    this.TableGrid     = TableGrid ? TableGrid : [];
    this.TableGridCalc = this.private_CopyTableGrid();

    this.RecalcInfo = new CTableRecalcInfo();

    this.Rows = Rows;
    this.Cols = Cols;

    // Массив строк
    this.Content = [];
    for ( var Index = 0; Index < Rows; Index++ )
    {
        this.Content[Index] = new CTableRow( this, Cols, TableGrid );
    }

    this.Internal_ReIndexing(0);

    // Информация о строках (расположение, высота и остальные метрики)
    this.RowsInfo = [];
    this.TableRowsBottom = [];
    this.HeaderInfo =
    {
        Count     : 0, // Количество строк, входящих в заголовок
        H         : 0, // Суммарная высота, занимаемая заголовком
        PageIndex : 0, // Страница, на которой лежит исходный заголовок (либо 0, либо 1)
        Pages     : []
    };

    this.Selection =
    {
        Start    : false,
        Use      : false,
        StartPos :
        {
            Pos        : { Row : 0, Cell : 0 },
            X          : 0,
            Y          : 0,
            PageIndex  : 0,
            MouseEvent : { ClickCount : 1, Type : AscCommon.g_mouse_event_type_down, CtrlKey : false }
        },
        EndPos   :
        {
            Pos        : { Row : 0, Cell : 0 },
            X          : 0,
            Y          : 0,
            PageIndex  : 0,
            MouseEvent : { ClickCount : 1, Type : AscCommon.g_mouse_event_type_down, CtrlKey : false }
        },
        Type     : table_Selection_Text,
        Data     : null,
        Type2    : table_Selection_Common,
        Data2    : null,
        CurRow   : 0  // Специальный параметр, используемый для стрелок вправо/влево
    };

    // this.X_origin - точка, которую нам задали как начальную для рисования таблицы
    // this.X        - фактическая начальная точка для рисования и обсчета таблицы

    this.X_origin = X;
    this.X        = X;
    this.Y        = Y;
    this.XLimit   = XLimit;
    this.YLimit   = YLimit;

    this.AllowOverlap = true;

    // Позиция по горизонтали
    this.PositionH =
    {
        RelativeFrom : c_oAscHAnchor.Page, // Относительно чего вычисляем координаты
        Align        : true,               // true : В поле Value лежит тип прилегания, false - в поле Value лежит точное значени
        Value        : c_oAscXAlign.Center //
    };

    this.PositionH_Old = undefined;

    // Позиция по горизонтали
    this.PositionV =
    {
        RelativeFrom : c_oAscVAnchor.Page, // Относительно чего вычисляем координаты
        Align        : true,               // true : В поле Value лежит тип прилегания, false - в поле Value лежит точное значени
        Value        : c_oAscYAlign.Center //
    };

    this.PositionV_Old = undefined;

    // Расстояние до окружающего текста
    this.Distance =
    {
        T : 0,
        B : 0,
        L : 0,
        R : 0
    };

    this.AnchorPosition = new CTableAnchorPosition();
    
    this.Pages    = [];
    this.Pages[0] = new CTablePage(X, Y, XLimit, YLimit, 0, 0 );

    this.MaxTopBorder = [];
    this.MaxBotBorder = [];
    this.MaxBotMargin = [];

    // Выставляем текущую ячейку
    if ( this.Content.length > 0 )
        this.CurCell = this.Content[0].Get_Cell( 0 );
    else
        this.CurCell = null;

    this.TurnOffRecalc = false;
    this.TurnOffRecalcEvent = false;

    this.ApplyToAll = false; // Специальный параметр, используемый в ячейках таблицы.
                             // True, если ячейка попадает в выделение по ячейкам.

    this.m_oContentChanges = new AscCommon.CContentChanges(); // список изменений(добавление/удаление элементов)
    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

CTable.prototype = Object.create(CDocumentContentElementBase.prototype);
CTable.prototype.constructor = CTable;

//----------------------------------------------------------------------------------------------------------------------
// Общие функции
//----------------------------------------------------------------------------------------------------------------------
CTable.prototype.Get_Theme = function()
{
	return this.Parent.Get_Theme();
};
CTable.prototype.Get_ColorMap = function()
{
	return this.Parent.Get_ColorMap();
};
CTable.prototype.Get_Props = function()
{
	var TablePr = this.Get_CompiledPr(false).TablePr;

	var Pr = {};

	if (tblwidth_Auto === TablePr.TableW.Type)
		Pr.TableWidth = null;
	else if (tblwidth_Mm === TablePr.TableW.Type)
		Pr.TableWidth = TablePr.TableW.W;
	else// if (tblwidth_Pct === TablePr.TableW.Type)
		Pr.TableWidth = -TablePr.TableW.W;

	Pr.AllowOverlap = this.AllowOverlap;

	// Пока у нас во всей таблицы одинаковый Spacing
	Pr.TableSpacing = this.Content[0].Get_CellSpacing();

	Pr.TableDefaultMargins = {
		Left   : TablePr.TableCellMar.Left.W,
		Right  : TablePr.TableCellMar.Right.W,
		Top    : TablePr.TableCellMar.Top.W,
		Bottom : TablePr.TableCellMar.Bottom.W
	};

	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		Pr.CellSelect = true;

		var CellMargins    = null;
		var CellMarginFlag = false;

		var Border_left    = null;
		var Border_right   = null;
		var Border_top     = null;
		var Border_bottom  = null;
		var Border_insideH = null;
		var Border_insideV = null;

		var CellShd        = null;
		var CellWidth      = undefined;
		var CellWidthStart = undefined;

		var Prev_row  = -1;
		var bFirstRow = true;

		var VAlign        = null;
		var TextDirection = null;
		var NoWrap        = null;

		for (var Index = 0; Index < this.Selection.Data.length; Index++)
		{
			var Pos          = this.Selection.Data[Index];
			var Row          = this.Content[Pos.Row];
			var Cell         = Row.Get_Cell(Pos.Cell);
			var Cell_borders = Cell.Get_Borders();
			var Cell_margins = Cell.Get_Margins();
			var Cell_shd     = Cell.Get_Shd();
			var Cell_w       = Cell.Get_W();

			if (0 === Index)
			{
				VAlign        = Cell.Get_VAlign();
				TextDirection = Cell.Get_TextDirection();
				NoWrap        = Cell.Get_NoWrap();
			}
			else
			{
				if (VAlign !== Cell.Get_VAlign())
					VAlign = null;

				if (TextDirection !== Cell.Get_TextDirection())
					TextDirection = null;

				if (NoWrap !== Cell.Get_NoWrap())
					NoWrap = null;
			}

			if (0 === Index)
			{
				CellShd = Cell_shd;
			}
			else
			{
				if (null != CellShd && ( CellShd.Value != Cell_shd.Value || CellShd.Color.r != Cell_shd.Color.r || CellShd.Color.g != Cell_shd.Color.g || CellShd.Color.b != Cell_shd.Color.b ))
					CellShd = null;
			}

			if (0 === Index)
			{
				if (tblwidth_Auto === Cell_w.Type)
					CellWidth = null;
				else if (tblwidth_Mm === Cell_w.Type)
					CellWidth = Cell_w.W;
				else// if (tblwidth_Pct === Cell_w.Type)
					CellWidth = -Cell_w.W;

				CellWidthStart = CellWidth;
			}
			else
			{
				var _CellWidth;
				if (tblwidth_Auto === Cell_w.Type)
					_CellWidth = null;
				else if (tblwidth_Mm === Cell_w.Type)
					_CellWidth = Cell_w.W;
				else// if (tblwidth_Pct === Cell_w.Type)
					_CellWidth = -Cell_w.W;

				if ((tblwidth_Auto === Cell_w.Type && null !== CellWidth)
					|| (undefined === CellWidth
					|| null === CellWidth
					|| Math.abs(CellWidth - _CellWidth) > 0.001))
					CellWidth = undefined;
			}

			// Крайняя левая ли данная ячейка в выделении?
			if (0 === Index || this.Selection.Data[Index - 1].Row != Pos.Row)
			{
				if (null === Border_left)
					Border_left = Cell_borders.Left;
				else
					Border_left = this.Internal_CompareBorders2(Border_left, Cell_borders.Left);
			}
			else
			{
				if (null === Border_insideV)
					Border_insideV = Cell_borders.Left;
				else
					Border_insideV = this.Internal_CompareBorders2(Border_insideV, Cell_borders.Left);
			}

			// Крайняя правая ли данная ячейка в выделении?
			if (this.Selection.Data.length - 1 === Index || this.Selection.Data[Index + 1].Row != Pos.Row)
			{
				if (null === Border_right)
					Border_right = Cell_borders.Right;
				else
					Border_right = this.Internal_CompareBorders2(Border_right, Cell_borders.Right);
			}
			else
			{
				if (null === Border_insideV)
					Border_insideV = Cell_borders.Right;
				else
					Border_insideV = this.Internal_CompareBorders2(Border_insideV, Cell_borders.Right);
			}

			if (Prev_row != Pos.Row)
			{
				if (-1 != Prev_row)
					bFirstRow = false;

				if (false === bFirstRow)
				{
					if (null === Border_insideH)
					{
						Border_insideH = Border_bottom;
						Border_insideH = this.Internal_CompareBorders2(Border_insideH, Cell_borders.Top);
					}
					else
					{
						Border_insideH = this.Internal_CompareBorders2(Border_insideH, Border_bottom);
						Border_insideH = this.Internal_CompareBorders2(Border_insideH, Cell_borders.Top);
					}
				}
				else
				{
					if (null === Border_top)
						Border_top = Cell_borders.Top;
				}

				Border_bottom = Cell_borders.Bottom;
				Prev_row      = Pos.Row;
			}
			else
			{
				if (false === bFirstRow)
				{
					if (null === Border_insideH)
						Border_insideH = Cell_borders.Top;
					else
						Border_insideH = this.Internal_CompareBorders2(Border_insideH, Cell_borders.Top);
				}
				else
				{
					if (null === Border_top)
						Border_top = Cell_borders.Top;
					else
						Border_top = this.Internal_CompareBorders2(Border_top, Cell_borders.Top);
				}

				Border_bottom = this.Internal_CompareBorders2(Border_bottom, Cell_borders.Bottom);
			}

			if (true != Cell.Is_TableMargins())
			{
				if (null === CellMargins)
				{
					CellMargins = Common_CopyObj(Cell_margins);
				}
				else
				{
					if (CellMargins.Left.W != Cell_margins.Left.W)
						CellMargins.Left.W = null;

					if (CellMargins.Right.W != Cell_margins.Right.W)
						CellMargins.Right.W = null;

					if (CellMargins.Top.W != Cell_margins.Top.W)
						CellMargins.Top.W = null;

					if (CellMargins.Bottom.W != Cell_margins.Bottom.W)
						CellMargins.Bottom.W = null;
				}
			}
			else
			{
				CellMarginFlag = true;
			}
		}

		Pr.CellsVAlign        = VAlign;
		Pr.CellsTextDirection = TextDirection;
		Pr.CellsNoWrap        = NoWrap;

		if (undefined === CellWidth)
		{
			Pr.CellsWidth         = CellWidthStart;
			Pr.CellsWidthNotEqual = true;
		}
		else
		{
			Pr.CellsWidth         = CellWidthStart;
			Pr.CellsWidthNotEqual = false;
		}


		Pr.CellBorders = {
			Left    : Border_left.Copy(),
			Right   : Border_right.Copy(),
			Top     : Border_top.Copy(),
			Bottom  : Border_bottom.Copy(),
			InsideH : null === Border_insideH ? null : Border_insideH.Copy(),
			InsideV : null === Border_insideV ? null : Border_insideV.Copy()
		};

		if (null === CellShd)
			Pr.CellsBackground = null;
		else
			Pr.CellsBackground = CellShd.Copy();

		if (null === CellMargins)
		{
			Pr.CellMargins = {
				Flag : 0
			};
		}
		else
		{
			var Flag = 2;
			if (true === CellMarginFlag)
				Flag = 1;

			Pr.CellMargins = {
				Left   : CellMargins.Left.W,
				Right  : CellMargins.Right.W,
				Top    : CellMargins.Top.W,
				Bottom : CellMargins.Bottom.W,
				Flag   : Flag
			};
		}
	}
	else
	{
		Pr.CellSelect = false;

		var Cell        = this.CurCell;
		var CellMargins = Cell.Get_Margins();
		var CellBorders = Cell.Get_Borders();
		var CellShd     = Cell.Get_Shd();
		var CellW       = Cell.Get_W();

		if (true === Cell.Is_TableMargins())
		{
			Pr.CellMargins = {
				Flag : 0
			};
		}
		else
		{
			Pr.CellMargins = {
				Left   : CellMargins.Left.W,
				Right  : CellMargins.Right.W,
				Top    : CellMargins.Top.W,
				Bottom : CellMargins.Bottom.W,
				Flag   : 2
			};
		}

		Pr.CellsVAlign        = Cell.Get_VAlign();
		Pr.CellsTextDirection = Cell.Get_TextDirection();
		Pr.CellsNoWrap        = Cell.Get_NoWrap();

		Pr.CellsBackground = CellShd.Copy();

		if (tblwidth_Auto === CellW.Type)
			Pr.CellsWidth = null;
		else if (tblwidth_Mm === CellW.Type)
			Pr.CellsWidth = CellW.W;
		else// if (tblwidth_Pct === CellW.Type)
			Pr.CellsWidth = -CellW.W;

		Pr.CellsWidthNotEqual = false;

		var Spacing = this.Content[0].Get_CellSpacing();

		var Border_left    = null;
		var Border_right   = null;
		var Border_top     = null;
		var Border_bottom  = null;
		var Border_insideH = null;
		var Border_insideV = null;

		var CellShd = null;

		for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
		{
			var Row         = this.Content[CurRow];
			var Cells_Count = Row.Get_CellsCount();

			for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
			{
				var Cell         = Row.Get_Cell(CurCell);
				var Cell_borders = Cell.Get_Borders();
				var Cell_shd     = Cell.Get_Shd();

				if (0 === CurCell && Cells_Count)
				{
					CellShd = Cell_shd;
				}
				else
				{
					if (null != CellShd && ( CellShd.Value != Cell_shd.Value || CellShd.Color.r != Cell_shd.Color.r || CellShd.Color.g != Cell_shd.Color.g || CellShd.Color.b != Cell_shd.Color.b ))
						CellShd = null;
				}

				// Крайняя левая ли данная ячейка в выделении?
				if (0 === CurCell)
				{
					if (null === Border_left)
						Border_left = Cell_borders.Left;
					else
						Border_left = this.Internal_CompareBorders2(Border_left, Cell_borders.Left);
				}
				else
				{
					if (null === Border_insideV)
						Border_insideV = Cell_borders.Left;
					else
						Border_insideV = this.Internal_CompareBorders2(Border_insideV, Cell_borders.Left);
				}

				// Крайняя правая ли данная ячейка в выделении?
				if (Cells_Count - 1 === CurCell)
				{
					if (null === Border_right)
						Border_right = Cell_borders.Right;
					else
						Border_right = this.Internal_CompareBorders2(Border_right, Cell_borders.Right);
				}
				else
				{
					if (null === Border_insideV)
						Border_insideV = Cell_borders.Right;
					else
						Border_insideV = this.Internal_CompareBorders2(Border_insideV, Cell_borders.Right);
				}

				if (0 === CurCell)
				{
					if (0 != CurRow)
					{
						if (null === Border_insideH)
						{
							Border_insideH = Border_bottom;
							Border_insideH = this.Internal_CompareBorders2(Border_insideH, Cell_borders.Top);
						}
						else
						{
							Border_insideH = this.Internal_CompareBorders2(Border_insideH, Border_bottom);
							Border_insideH = this.Internal_CompareBorders2(Border_insideH, Cell_borders.Top);
						}
					}
					else
					{
						if (null === Border_top)
							Border_top = Cell_borders.Top;
					}

					Border_bottom = Cell_borders.Bottom;
				}
				else
				{
					if (0 != CurRow)
					{
						if (null === Border_insideH)
							Border_insideH = Cell_borders.Top;
						else
							Border_insideH = this.Internal_CompareBorders2(Border_insideH, Cell_borders.Top);
					}
					else
					{
						if (null === Border_top)
							Border_top = Cell_borders.Top;
						else
							Border_top = this.Internal_CompareBorders2(Border_top, Cell_borders.Top);
					}

					Border_bottom = this.Internal_CompareBorders2(Border_bottom, Cell_borders.Bottom);
				}
			}
		}

		Pr.CellBorders = {
			Left    : Border_left.Copy(),
			Right   : Border_right.Copy(),
			Top     : Border_top.Copy(),
			Bottom  : Border_bottom.Copy(),
			InsideH : null === Border_insideH ? null : Border_insideH.Copy(),
			InsideV : null === Border_insideV ? null : Border_insideV.Copy()
		};
	}

	switch (Pr.CellsVAlign)
	{
		case vertalignjc_Top    :
			Pr.CellsVAlign = c_oAscVertAlignJc.Top;
			break;
		case vertalignjc_Bottom :
			Pr.CellsVAlign = c_oAscVertAlignJc.Bottom;
			break;
		case vertalignjc_Center :
			Pr.CellsVAlign = c_oAscVertAlignJc.Center;
			break;
		default                 :
			Pr.CellsVAlign = null;
			break;
	}

	switch (Pr.CellsTextDirection)
	{
		case textdirection_LRTB  :
			Pr.CellsTextDirection = c_oAscCellTextDirection.LRTB;
			break;
		case textdirection_TBRL  :
			Pr.CellsTextDirection = c_oAscCellTextDirection.TBRL;
			break;
		case textdirection_BTLR  :
			Pr.CellsTextDirection = c_oAscCellTextDirection.BTLR;
			break;
		default                  :
			Pr.CellsTextDirection = null;
			break;
	}

	Pr.RowsInHeader = 0;
	for (var Index = 0; Index < this.Content.length; Index++)
	{
		if (true === this.Content[Index].Is_Header())
			Pr.RowsInHeader++;
	}

	if (true === this.Is_Inline())
	{
		Pr.TableAlignment     = ( align_Left === TablePr.Jc ? 0 : ( AscCommon.align_Center === TablePr.Jc ? 1 : 2 ) );
		Pr.TableIndent        = TablePr.TableInd;
		Pr.TableWrappingStyle = AscCommon.c_oAscWrapStyle.Inline;

		Pr.Position = {
			X : this.X,
			Y : this.Y
		};

		Pr.TablePaddings = {
			Top    : 0,
			Bottom : 0,
			Left   : 3.2,
			Right  : 3.2
		};
	}
	else
	{
		var LD_PageFields = this.LogicDocument.Get_PageFields(this.Get_StartPage_Absolute());

		Pr.TableAlignment     = 0; // align_Left
		Pr.TableIndent        = this.X_origin - LD_PageFields.X;
		Pr.TableWrappingStyle = AscCommon.c_oAscWrapStyle.Flow;

		Pr.PositionH              = {};
		Pr.PositionH.RelativeFrom = this.PositionH.RelativeFrom;
		Pr.PositionH.UseAlign     = this.PositionH.Align;
		Pr.PositionH.Align        = ( true === Pr.PositionH.UseAlign ? this.PositionH.Value : undefined );
		Pr.PositionH.Value        = ( true === Pr.PositionH.UseAlign ? 0 : this.PositionH.Value );

		Pr.PositionV              = {};
		Pr.PositionV.RelativeFrom = this.PositionV.RelativeFrom;
		Pr.PositionV.UseAlign     = this.PositionV.Align;
		Pr.PositionV.Align        = ( true === Pr.PositionV.UseAlign ? this.PositionV.Value : undefined );
		Pr.PositionV.Value        = ( true === Pr.PositionV.UseAlign ? 0 : this.PositionV.Value );

		Pr.Position = {
			X : this.Parent.X,
			Y : this.Parent.Y
		};

		Pr.TablePaddings = {
			Left   : this.Distance.L,
			Right  : this.Distance.R,
			Top    : this.Distance.T,
			Bottom : this.Distance.B
		};
	}

	Pr.Internal_Position = this.AnchorPosition;

	Pr.TableBorders = Common_CopyObj(TablePr.TableBorders);

	Pr.TableBackground = TablePr.Shd.Copy();

	Pr.TableStyle = this.TableStyle;
	Pr.TableLook  = this.TableLook;

	if (true === this.Parent.Is_DrawingShape())
		Pr.CanBeFlow = false;
	else
		Pr.CanBeFlow = true;

	Pr.Locked = this.Lock.Is_Locked();

	if (true === this.Parent.Is_InTable())
		Pr.TableLayout = undefined;
	else
		Pr.TableLayout = (TablePr.TableLayout === tbllayout_AutoFit ? c_oAscTableLayout.AutoFit : c_oAscTableLayout.Fixed );

	if (!this.bPresentation)
	{
		this.DrawingDocument.CheckTableStyles(new Asc.CTablePropLook(this.TableLook));
	}

	Pr.PercentFullWidth = this.private_RecalculatePercentWidth();
	Pr.TableDescription = this.Get_TableDescription();
	Pr.TableCaption     = this.Get_TableCaption();

	return Pr;
};
CTable.prototype.Set_Props = function(Props)
{
	var TablePr            = this.Get_CompiledPr(false).TablePr;
	var bApplyToInnerTable = false;

	if (true != this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
	{
		bApplyToInnerTable = this.CurCell.Content.Set_TableProps(Props);
	}

	if (true === bApplyToInnerTable)
		return true;

	var bRecalc_All = false;
	var bRedraw     = false;

	// TableStyle (стиль таблицы)
	if (undefined !== Props.TableStyle)
	{
		this.Set_TableStyle(Props.TableStyle);
		bRecalc_All = true;
	}

	// TableLook
	if ("undefined" != typeof(Props.TableLook))
	{
		var NewLook = new CTableLook(Props.TableLook.FirstCol, Props.TableLook.FirstRow, Props.TableLook.LastCol, Props.TableLook.LastRow, Props.TableLook.BandHor, Props.TableLook.BandVer);
		this.Set_TableLook(NewLook);
		bRecalc_All = true;
	}

	// AllowOverlap
	if (undefined != Props.AllowOverlap)
	{
		this.Set_AllowOverlap(Props.AllowOverlap);
		bRecalc_All = true;
	}

	// RowsInHeader
	if (undefined != Props.RowsInHeader)
	{
		var RowsInHeader = Props.RowsInHeader
		for (var Index = 0; Index < this.Content.length; Index++)
		{
			if (Index < RowsInHeader && true != this.Content[Index].Is_Header())
				this.Content[Index].Set_Header(true);
			else if (Index >= RowsInHeader && true === this.Content[Index].Is_Header())
				this.Content[Index].Set_Header(false);
		}
	}

	// TableSpacing (расстояние между ячейками)
	if ("undefined" != typeof(Props.TableSpacing))
	{
		var NeedChange = false;
		for (var Index = 0; Index < this.Content.length; Index++)
		{
			if (Props.TableSpacing != this.Content[Index].Get_CellSpacing())
			{
				NeedChange = true;
				break;
			}
		}

		if (true === NeedChange)
		{
			var OldSpacing = this.Content[0].Get_CellSpacing();
			var Diff       = Props.TableSpacing - ( null === OldSpacing ? 0 : OldSpacing );

			for (var Index = 0; Index < this.Content.length; Index++)
				this.Content[Index].Set_CellSpacing(Props.TableSpacing);

			bRecalc_All = true;

			// При изменении Spacing мы должны изменить сетку таблицы
			var GridKoeff = [];
			var ColsCount = this.TableGridCalc.length;
			for (var Index = 0; Index < ColsCount; Index++)
				GridKoeff.push(1);

			for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
			{
				var Row        = this.Content[CurRow];
				var GridBefore = Row.Get_Before().GridBefore;
				var GridAfter  = Row.Get_After().GridAfter;

				GridKoeff[Math.min(GridBefore, GridKoeff.length - 1)]    = 1.5;
				GridKoeff[Math.max(GridKoeff.length - 1 - GridAfter, 0)] = 1.5;
			}

			var arrNewGrid = [];
			for (var Index = 0; Index < ColsCount; Index++)
			{
				arrNewGrid[Index] = this.TableGridCalc[Index] + GridKoeff[Index] * Diff;
			}
			this.SetTableGrid(arrNewGrid);
		}
	}

	// Определим, есть ли у таблицы Spacing, уже с учетом новых настроек
	var bSpacing = null === this.Content[0].Get_CellSpacing() ? false : true;

	// TableDefaultMargins (отступы в ячейках по умолчанию)
	if ("undefined" != typeof(Props.TableDefaultMargins))
	{
		var UsingDefaultMar = false;
		for (var Index = 0; Index < this.Content.length; Index++)
		{
			var Row        = this.Content[Index];
			var CellsCount = Row.Get_CellsCount();
			for (var CurCell = 0; CurCell < CellsCount; CurCell++)
			{
				var Cell = Row.Get_Cell(CurCell);
				if (null === Cell.Pr.TableCellMar)
				{
					UsingDefaultMar = true;
					break;
				}
			}
		}

		var NeedChange = false;

		var TDM        = Props.TableDefaultMargins;
		var Left_new   = ( "undefined" != typeof(TDM.Left) ? ( null != TDM.Left ? TDM.Left : TablePr.TableCellMar.Left.W   ) : TablePr.TableCellMar.Left.W   );
		var Right_new  = ( "undefined" != typeof(TDM.Right) ? ( null != TDM.Right ? TDM.Right : TablePr.TableCellMar.Right.W  ) : TablePr.TableCellMar.Right.W  );
		var Top_new    = ( "undefined" != typeof(TDM.Top) ? ( null != TDM.Top ? TDM.Top : TablePr.TableCellMar.Top.W    ) : TablePr.TableCellMar.Top.W    );
		var Bottom_new = ( "undefined" != typeof(TDM.Bottom) ? ( null != TDM.Bottom ? TDM.Bottom : TablePr.TableCellMar.Bottom.W ) : TablePr.TableCellMar.Bottom.W );

		if (Left_new != TablePr.TableCellMar.Left.W || Right_new != TablePr.TableCellMar.Right.W || Top_new != TablePr.TableCellMar.Top.W || Bottom_new != TablePr.TableCellMar.Bottom.W)
			NeedChange = true;

		if (true === NeedChange)
		{
			this.Set_TableCellMar(Left_new, Top_new, Right_new, Bottom_new);

			if (true === UsingDefaultMar)
			{
				bRecalc_All = true;
			}
		}
	}

	// CellMargins (отступы в ячейках)
	if ("undefined" != typeof(Props.CellMargins) && null != Props.CellMargins)
	{
		var NeedChange = false;

		switch (Props.CellMargins.Flag)
		{
			case 0:
			{
				if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
				{
					for (var Index = 0; Index < this.Selection.Data.length; Index++)
					{
						var Pos  = this.Selection.Data[Index];
						var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);

						if (null != Cell.Pr.TableCellMar)
						{
							Cell.Set_Margins(null);
							NeedChange = true;
						}
					}
				}
				else
				{
					var Cell = this.CurCell;

					if (null != Cell.Pr.TableCellMar)
					{
						Cell.Set_Margins(null);
						NeedChange = true;
					}
				}

				break;
			}
			case 1:
			{
				if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
				{
					for (var Index = 0; Index < this.Selection.Data.length; Index++)
					{
						var Pos  = this.Selection.Data[Index];
						var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);

						// Ячейки, у которых маргины дефелтовые, мы не трогаем
						if (true != Cell.Is_TableMargins())
						{
							if (null != Props.CellMargins.Left)
								Cell.Set_Margins({W : Props.CellMargins.Left, Type : tblwidth_Mm}, 3);

							if (null != Props.CellMargins.Right)
								Cell.Set_Margins({W : Props.CellMargins.Right, Type : tblwidth_Mm}, 1);

							if (null != Props.CellMargins.Top)
								Cell.Set_Margins({W : Props.CellMargins.Top, Type : tblwidth_Mm}, 0);

							if (null != Props.CellMargins.Bottom)
								Cell.Set_Margins({W : Props.CellMargins.Bottom, Type : tblwidth_Mm}, 2);

							NeedChange = true;
						}
					}
				}
				else
				{
					// Сюда вообще не должны заходить, но на всякий случай реализуем.
					var Cell = this.CurCell;
					if (true != Cell.Is_TableMargins())
					{
						if (null != Props.CellMargins.Left)
							Cell.Set_Margins({W : Props.CellMargins.Left, Type : tblwidth_Mm}, 3);

						if (null != Props.CellMargins.Right)
							Cell.Set_Margins({W : Props.CellMargins.Right, Type : tblwidth_Mm}, 1);

						if (null != Props.CellMargins.Top)
							Cell.Set_Margins({W : Props.CellMargins.Top, Type : tblwidth_Mm}, 0);

						if (null != Props.CellMargins.Bottom)
							Cell.Set_Margins({W : Props.CellMargins.Bottom, Type : tblwidth_Mm}, 2);
					}
					else
					{
						if (null != Props.CellMargins.Left)
							Cell.Set_Margins({W : Props.CellMargins.Left, Type : tblwidth_Mm}, 3);
						else
							Cell.Set_Margins({W : TablePr.TableCellMar.Left.W, Type : tblwidth_Mm}, 3);

						if (null != Props.CellMargins.Right)
							Cell.Set_Margins({W : Props.CellMargins.Right, Type : tblwidth_Mm}, 1);
						else
							Cell.Set_Margins({W : TablePr.TableCellMar.Right.W, Type : tblwidth_Mm}, 1);

						if (null != Props.CellMargins.Top)
							Cell.Set_Margins({W : Props.CellMargins.Top, Type : tblwidth_Mm}, 0);
						else
							Cell.Set_Margins({W : TablePr.TableCellMar.Top.W, Type : tblwidth_Mm}, 0);

						if (null != Props.CellMargins.Bottom)
							Cell.Set_Margins({W : Props.CellMargins.Bottom, Type : tblwidth_Mm}, 2);
						else
							Cell.Set_Margins({W : TablePr.TableCellMar.Bottom.W, Type : tblwidth_Mm}, 2);
					}

					NeedChange = true;
				}

				break;
			}
			case 2:
			{
				NeedChange = true;

				if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
				{
					for (var Index = 0; Index < this.Selection.Data.length; Index++)
					{
						var Pos  = this.Selection.Data[Index];
						var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);

						// Ячейки, у которых маргины дефелтовые, мы не трогаем
						if (true != Cell.Is_TableMargins())
						{
							if (null != Props.CellMargins.Left)
								Cell.Set_Margins({W : Props.CellMargins.Left, Type : tblwidth_Mm}, 3);

							if (null != Props.CellMargins.Right)
								Cell.Set_Margins({W : Props.CellMargins.Right, Type : tblwidth_Mm}, 1);

							if (null != Props.CellMargins.Top)
								Cell.Set_Margins({W : Props.CellMargins.Top, Type : tblwidth_Mm}, 0);

							if (null != Props.CellMargins.Bottom)
								Cell.Set_Margins({W : Props.CellMargins.Bottom, Type : tblwidth_Mm}, 2);
						}
						else
						{
							if (null != Props.CellMargins.Left)
								Cell.Set_Margins({W : Props.CellMargins.Left, Type : tblwidth_Mm}, 3);
							else
								Cell.Set_Margins({W : TablePr.TableCellMar.Left.W, Type : tblwidth_Mm}, 3);

							if (null != Props.CellMargins.Right)
								Cell.Set_Margins({W : Props.CellMargins.Right, Type : tblwidth_Mm}, 1);
							else
								Cell.Set_Margins({W : TablePr.TableCellMar.Right.W, Type : tblwidth_Mm}, 1);

							if (null != Props.CellMargins.Top)
								Cell.Set_Margins({W : Props.CellMargins.Top, Type : tblwidth_Mm}, 0);
							else
								Cell.Set_Margins({W : TablePr.TableCellMar.Top.W, Type : tblwidth_Mm}, 0);

							if (null != Props.CellMargins.Bottom)
								Cell.Set_Margins({W : Props.CellMargins.Bottom, Type : tblwidth_Mm}, 2);
							else
								Cell.Set_Margins({W : TablePr.TableCellMar.Bottom.W, Type : tblwidth_Mm}, 2);
						}
					}
				}
				else
				{
					var Cell = this.CurCell;
					if (true != Cell.Is_TableMargins())
					{
						if (null != Props.CellMargins.Left)
							Cell.Set_Margins({W : Props.CellMargins.Left, Type : tblwidth_Mm}, 3);

						if (null != Props.CellMargins.Right)
							Cell.Set_Margins({W : Props.CellMargins.Right, Type : tblwidth_Mm}, 1);

						if (null != Props.CellMargins.Top)
							Cell.Set_Margins({W : Props.CellMargins.Top, Type : tblwidth_Mm}, 0);

						if (null != Props.CellMargins.Bottom)
							Cell.Set_Margins({W : Props.CellMargins.Bottom, Type : tblwidth_Mm}, 2);
					}
					else
					{
						if (null != Props.CellMargins.Left)
							Cell.Set_Margins({W : Props.CellMargins.Left, Type : tblwidth_Mm}, 3);
						else
							Cell.Set_Margins({W : TablePr.TableCellMar.Left.W, Type : tblwidth_Mm}, 3);

						if (null != Props.CellMargins.Right)
							Cell.Set_Margins({W : Props.CellMargins.Right, Type : tblwidth_Mm}, 1);
						else
							Cell.Set_Margins({W : TablePr.TableCellMar.Right.W, Type : tblwidth_Mm}, 1);

						if (null != Props.CellMargins.Top)
							Cell.Set_Margins({W : Props.CellMargins.Top, Type : tblwidth_Mm}, 0);
						else
							Cell.Set_Margins({W : TablePr.TableCellMar.Top.W, Type : tblwidth_Mm}, 0);

						if (null != Props.CellMargins.Bottom)
							Cell.Set_Margins({W : Props.CellMargins.Bottom, Type : tblwidth_Mm}, 2);
						else
							Cell.Set_Margins({W : TablePr.TableCellMar.Bottom.W, Type : tblwidth_Mm}, 2);
					}

					NeedChange = true;
				}

				break;
			}
		}

		if (true === NeedChange)
			bRecalc_All = true;
	}

	// TableWidth (ширина таблицы)
	if (undefined !== Props.TableWidth)
	{
		if (null === Props.TableWidth)
		{
			if (tblwidth_Auto != TablePr.TableW.Type)
			{
				this.Set_TableW(tblwidth_Auto, 0);
				bRecalc_All = true;
			}
		}
		else if (Props.TableWidth > -0.001)
		{
			this.Set_TableW(tblwidth_Mm, Props.TableWidth);
			bRecalc_All = true;
		}
		else
		{
			this.Set_TableW(tblwidth_Pct, Math.abs(Props.TableWidth));
			bRecalc_All = true;
		}
	}

	// TableLayout
	if (undefined != Props.TableLayout)
	{
		this.Set_TableLayout(( Props.TableLayout === c_oAscTableLayout.AutoFit ? tbllayout_AutoFit : tbllayout_Fixed ));
		bRecalc_All = true;
	}

	// TableWrappingStyle
	if (undefined != Props.TableWrappingStyle)
	{
		// При изменении flow на inline или наоборот, пересчет таблицы будет запущен позже
		if (0 === Props.TableWrappingStyle && true != this.Inline)
		{
			this.Set_Inline(true);
			bRecalc_All = true;
		}
		else if (1 === Props.TableWrappingStyle && false != this.Inline)
		{
			this.Set_Inline(false);

			if (undefined === Props.PositionH)
				this.Set_PositionH(c_oAscHAnchor.Page, false, this.AnchorPosition.Calculate_X_Value(c_oAscHAnchor.Page));

			if (undefined === Props.PositionV)
				this.Set_PositionV(c_oAscVAnchor.Page, false, this.AnchorPosition.Calculate_Y_Value(c_oAscVAnchor.Page));

			if (undefined === Props.TablePaddings)
				this.Set_Distance(3.2, 0, 3.2, 0);

			bRecalc_All = true;
		}
	}

	var _Jc = TablePr.Jc; // Запоминаем, чтобы не пересчитывать стиль
	// TableAlignment (прилегание таблицы)
	if ("undefined" != typeof(Props.TableAlignment) && true === this.Is_Inline())
	{
		var NewJc = ( 0 === Props.TableAlignment ? align_Left : ( 1 === Props.TableAlignment ? AscCommon.align_Center : AscCommon.align_Right ) );
		if (TablePr.Jc != NewJc)
		{
			_Jc = NewJc;
			this.Set_TableAlign(NewJc);
			bRecalc_All = true;
		}
	}

	// TableIndent (отступ слева)
	if ("undefined" != typeof(Props.TableIndent) && true === this.Is_Inline() && align_Left === _Jc)
	{
		if (Props.TableIndent != TablePr.TableInd)
		{
			this.Set_TableInd(Props.TableIndent);
			bRecalc_All = true;
		}
	}

	// Position
	if (undefined != Props.Position)
	{
		this.PositionH.RelativeFrom = c_oAscHAnchor.Page;
		this.PositionH.Align        = true;
		this.PositionV.RelativeFrom = c_oAscVAnchor.Page;
		this.PositionH.Align        = true;

		this.PositionH.Value = c_oAscXAlign.Center;
		this.PositionV.Value = c_oAscYAlign.Center;

		//this.PositionH.Value        = ( "undefined" != typeof(Props.Position.X) ? ( null != Props.Position.X ?
		// Props.Position.X : this.X ) : this.X ); this.PositionV.Value        = ( "undefined" !=
		// typeof(Props.Position.Y) ? ( null != Props.Position.Y ? Props.Position.Y : this.Y ) : this.Y );

		bRecalc_All = true;
	}

	if (undefined != Props.PositionH)
	{
		this.Set_PositionH(Props.PositionH.RelativeFrom, Props.PositionH.UseAlign, (true === Props.PositionH.UseAlign) ? Props.PositionH.Align : Props.PositionH.Value);
	}

	if (undefined != Props.PositionV)
	{
		this.Set_PositionV(Props.PositionV.RelativeFrom, Props.PositionV.UseAlign, (true === Props.PositionV.UseAlign) ? Props.PositionV.Align : Props.PositionV.Value);
	}

	// TablePaddings
	if (undefined != Props.TablePaddings)
	{
		var TP          = Props.TablePaddings;
		var CurPaddings = this.Distance;

		var NewPaggings_left   = ( undefined != TP.Left ? ( null != TP.Left ? TP.Left : CurPaddings.L ) : CurPaddings.L );
		var NewPaggings_right  = ( undefined != TP.Right ? ( null != TP.Right ? TP.Right : CurPaddings.R ) : CurPaddings.R );
		var NewPaggings_top    = ( undefined != TP.Top ? ( null != TP.Top ? TP.Top : CurPaddings.T ) : CurPaddings.T );
		var NewPaggings_bottom = ( undefined != TP.Bottom ? ( null != TP.Bottom ? TP.Bottom : CurPaddings.B ) : CurPaddings.B );

		if (Math.abs(CurPaddings.L - NewPaggings_left) > 0.001 || Math.abs(CurPaddings.R - NewPaggings_right) > 0.001 || Math.abs(CurPaddings.T - NewPaggings_top) > 0.001 || Math.abs(CurPaddings.B - NewPaggings_bottom) > 0.001)
		{
			this.Set_Distance(NewPaggings_left, NewPaggings_top, NewPaggings_right, NewPaggings_bottom);
			bRecalc_All = true;
		}
	}

	// TableBorders(границы таблицы)
	if ("undefined" != typeof(Props.TableBorders) && null != Props.TableBorders)
	{
		if (false === this.Internal_CheckNullBorder(Props.TableBorders.Top) && false === this.Internal_CompareBorders3(Props.TableBorders.Top, TablePr.TableBorders.Top))
		{
			this.Set_TableBorder_Top(Props.TableBorders.Top);
			bRecalc_All = true;

			if (true != bSpacing)
			{
				var Row = this.Content[0];
				for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++)
				{
					var Cell = Row.Get_Cell(CurCell);
					Cell.Set_Border(null, 0);
				}
			}
		}

		if (false === this.Internal_CheckNullBorder(Props.TableBorders.Bottom) && false === this.Internal_CompareBorders3(Props.TableBorders.Bottom, TablePr.TableBorders.Bottom))
		{
			this.Set_TableBorder_Bottom(Props.TableBorders.Bottom);
			bRecalc_All = true;

			if (true != bSpacing)
			{
				var Row = this.Content[this.Content.length - 1];
				for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++)
				{
					var Cell = Row.Get_Cell(CurCell);
					Cell.Set_Border(null, 2);
				}
			}
		}

		if (false === this.Internal_CheckNullBorder(Props.TableBorders.Left) && false === this.Internal_CompareBorders3(Props.TableBorders.Left, TablePr.TableBorders.Left))
		{
			this.Set_TableBorder_Left(Props.TableBorders.Left);
			bRecalc_All = true;

			if (true != bSpacing)
			{
				for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
				{
					var Cell = this.Content[CurRow].Get_Cell(0);
					Cell.Set_Border(null, 3);
				}
			}
		}

		if (false === this.Internal_CheckNullBorder(Props.TableBorders.Right) && false === this.Internal_CompareBorders3(Props.TableBorders.Right, TablePr.TableBorders.Right))
		{
			this.Set_TableBorder_Right(Props.TableBorders.Right);
			bRecalc_All = true;

			if (true != bSpacing)
			{
				for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
				{
					var Cell = this.Content[CurRow].Get_Cell(this.Content[CurRow].Get_CellsCount() - 1);
					Cell.Set_Border(null, 1);
				}
			}
		}

		if (false === this.Internal_CheckNullBorder(Props.TableBorders.InsideH) && false === this.Internal_CompareBorders3(Props.TableBorders.InsideH, TablePr.TableBorders.InsideH))
		{
			this.Set_TableBorder_InsideH(Props.TableBorders.InsideH);
			bRecalc_All = true;

			for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
			{
				var Row         = this.Content[CurRow];
				var Cells_Count = Row.Get_CellsCount();

				for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
				{
					var Cell = Row.Get_Cell(CurCell);

					if ((0 === CurRow && true === bSpacing) || 0 != CurRow)
						Cell.Set_Border(null, 0);

					if (( this.Content.length - 1 === CurRow && true === bSpacing ) || this.Content.length - 1 != CurRow)
						Cell.Set_Border(null, 2);

				}
			}
		}

		if (false === this.Internal_CheckNullBorder(Props.TableBorders.InsideV) && false === this.Internal_CompareBorders3(Props.TableBorders.InsideV, TablePr.TableBorders.InsideV))
		{
			this.Set_TableBorder_InsideV(Props.TableBorders.InsideV);
			bRecalc_All = true;

			for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
			{
				var Row         = this.Content[CurRow];
				var Cells_Count = Row.Get_CellsCount();

				for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
				{
					var Cell = Row.Get_Cell(CurCell);

					if ((0 === CurCell && true === bSpacing) || 0 != CurCell)
						Cell.Set_Border(null, 3);

					if (( Cells_Count - 1 === CurCell && true === bSpacing ) || Cells_Count - 1 != CurCell)
						Cell.Set_Border(null, 1);
				}
			}
		}
	}

	// CellBorders (границы ячеек)
	if ("undefined" != typeof(Props.CellBorders) && null != Props.CellBorders)
	{
		var Cells_array = null;

		// Переделаем идеальный вариант, на новый
		if (true === bSpacing)
		{
			if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
			{
				Cells_array = [];
				for (var Index = 0, Count = this.Selection.Data.length; Index < Count; Index++)
				{
					var RowIndex  = this.Selection.Data[Index].Row;
					var CellIndex = this.Selection.Data[Index].Cell;

					var StartGridCol    = this.Content[RowIndex].Get_CellInfo(CellIndex).StartGridCol;
					var GridSpan        = this.Content[RowIndex].Get_Cell(CellIndex).Get_GridSpan();
					var TempCells_array = this.private_GetCellsPosArrayByCellsArray(this.private_GetMergedCells(RowIndex, StartGridCol, GridSpan));
					Cells_array         = Cells_array.concat(TempCells_array);
				}
			}
			else if (false === Props.CellSelect)
			{
				Cells_array = [];
				for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
				{
					var Row         = this.Content[CurRow];
					var Cells_count = Row.Get_CellsCount();
					for (var CurCell = 0; CurCell < Cells_count; CurCell++)
					{
						var Cell = Row.Get_Cell(CurCell);
						if (vmerge_Continue === Cell.Get_VMerge())
							continue;

						var StartGridCol    = this.Content[CurRow].Get_CellInfo(CurCell).StartGridCol;
						var GridSpan        = this.Content[CurRow].Get_Cell(CurCell).Get_GridSpan();
						var TempCells_array = this.private_GetCellsPosArrayByCellsArray(this.private_GetMergedCells(CurRow, StartGridCol, GridSpan));

						Cells_array = Cells_array.concat(TempCells_array);
					}
				}
			}
			else
			{
				var RowIndex     = this.CurCell.Row.Index;
				var CellIndex    = this.CurCell.Index;
				var StartGridCol = this.Content[RowIndex].Get_CellInfo(CellIndex).StartGridCol;
				var GridSpan     = this.Content[RowIndex].Get_Cell(CellIndex).Get_GridSpan();
				Cells_array      = this.private_GetCellsPosArrayByCellsArray(this.private_GetMergedCells(RowIndex, StartGridCol, GridSpan));
			}
		}
		else
		{
			if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
			{
				Cells_array = [];
				for (var Index = 0, Count = this.Selection.Data.length; Index < Count; Index++)
				{
					var RowIndex  = this.Selection.Data[Index].Row;
					var CellIndex = this.Selection.Data[Index].Cell;

					var StartGridCol    = this.Content[RowIndex].Get_CellInfo(CellIndex).StartGridCol;
					var GridSpan        = this.Content[RowIndex].Get_Cell(CellIndex).Get_GridSpan();
					var TempCells_array = this.private_GetCellsPosArrayByCellsArray(this.private_GetMergedCells(RowIndex, StartGridCol, GridSpan));
					Cells_array         = Cells_array.concat(TempCells_array);
				}
			}
			else
			{
				var RowIndex     = this.CurCell.Row.Index;
				var CellIndex    = this.CurCell.Index;
				var StartGridCol = this.Content[RowIndex].Get_CellInfo(CellIndex).StartGridCol;
				var GridSpan     = this.Content[RowIndex].Get_Cell(CellIndex).Get_GridSpan();
				Cells_array      = this.private_GetCellsPosArrayByCellsArray(this.private_GetMergedCells(RowIndex, StartGridCol, GridSpan));
			}
		}

		//if ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type )
		//    Cells_array = this.Selection.Data;
		//else
		//{
		//    // TODO: Если данная ячейка имеет вертикальное объединение, тогда нам надо добавить
		//    //       все ячейки в него попадающие
		//    Cells_array = [ { Row : this.CurCell.Row.Index, Cell : this.CurCell.Index } ];
		//}

		var Pos_first = Cells_array[0];
		var Pos_last  = Cells_array[Cells_array.length - 1];
		var Row_first = Pos_first.Row;
		var Row_last  = Pos_last.Row;

		var bBorder_top     = ( false === this.Internal_CheckNullBorder(Props.CellBorders.Top) ? true : false );
		var bBorder_bottom  = ( false === this.Internal_CheckNullBorder(Props.CellBorders.Bottom) ? true : false );
		var bBorder_left    = ( false === this.Internal_CheckNullBorder(Props.CellBorders.Left) ? true : false );
		var bBorder_right   = ( false === this.Internal_CheckNullBorder(Props.CellBorders.Right) ? true : false );
		var bBorder_insideh = ( false === this.Internal_CheckNullBorder(Props.CellBorders.InsideH) ? true : false );
		var bBorder_insidev = ( false === this.Internal_CheckNullBorder(Props.CellBorders.InsideV) ? true : false );

		if (true != bSpacing)
		{
			// Узначем GridCol начала и конца первой и последней строк
			var Grid_row_first_start = 0, Grid_row_first_end = 0, Grid_row_last_start = 0, Grid_row_last_end = 0;
			var Pos                  = {Row : 0, Cell : 0};

			var CurRow           = Row_first;
			var Index            = 0;
			Grid_row_first_start = this.Content[Pos_first.Row].Get_CellInfo(Pos_first.Cell).StartGridCol;
			while (Index < Cells_array.length)
			{
				Pos = Cells_array[Index];
				if (Pos.Row != Row_first)
					break;

				var Row  = this.Content[Pos.Row];
				var Cell = Row.Get_Cell(Pos.Cell);

				Grid_row_first_end = Row.Get_CellInfo(Pos.Cell).StartGridCol + Cell.Get_GridSpan() - 1;
				Index++;
			}

			Index = 0;
			while (Index < Cells_array.length)
			{
				Pos = Cells_array[Index];
				if (Pos.Row === Row_last)
					break;

				Index++;
			}

			Grid_row_last_start = this.Content[Pos.Row].Get_CellInfo(Pos.Cell).StartGridCol;
			Grid_row_last_end   = this.Content[Pos_last.Row].Get_CellInfo(Pos_last.Cell).StartGridCol + this.Content[Pos_last.Row].Get_Cell(Pos_last.Cell).Get_GridSpan() - 1;

			if (Row_first > 0 && true === bBorder_top)
			{
				var Cell_start = 0, Cell_end = 0;
				var bStart     = false;
				var bEnd       = false;

				var Row = this.Content[Row_first - 1];
				for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++)
				{
					var StartGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
					var EndGridCol   = StartGridCol + Row.Get_Cell(CurCell).Get_GridSpan() - 1;

					if (false === bStart)
					{
						if (StartGridCol < Grid_row_first_start)
							continue;
						else if (StartGridCol > Grid_row_first_start)
							break;
						else //if ( StartGridCol === Grid_row_first_start )
						{
							Cell_start = CurCell;
							bStart     = true;

							if (EndGridCol < Grid_row_first_end)
								continue;
							else if (EndGridCol > Grid_row_first_end)
								break;
							else
							{
								Cell_end = CurCell;
								bEnd     = true;
								break;
							}
						}
					}

					if (false === bEnd)
					{
						if (EndGridCol < Grid_row_first_end)
							continue;
						else if (EndGridCol > Grid_row_first_end)
							break;
						else //if ( EndGridCol === Grid_row_first_end )
						{
							Cell_end = CurCell;
							bEnd     = true;
							break;
						}
					}
				}

				if (true === bStart && true === bEnd)
				{
					for (var CurCell = Cell_start; CurCell <= Cell_end; CurCell++)
					{
						var Cell = Row.Get_Cell(CurCell);
						Cell.Set_Border(Props.CellBorders.Top, 2);
					}
					bRecalc_All = true;
				}
			}

			if (Row_last < this.Content.length - 1 && true === bBorder_bottom)
			{
				var Cell_start = 0, Cell_end = 0;
				var bStart     = false;
				var bEnd       = false;

				var Row = this.Content[Row_last + 1];
				for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++)
				{
					var StartGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
					var EndGridCol   = StartGridCol + Row.Get_Cell(CurCell).Get_GridSpan() - 1;

					if (false === bStart)
					{
						if (StartGridCol < Grid_row_last_start)
							continue;
						else if (StartGridCol > Grid_row_last_start)
							break;
						else //if ( StartGridCol === Grid_row_last_start )
						{
							Cell_start = CurCell;
							bStart     = true;

							if (EndGridCol < Grid_row_last_end)
								continue;
							else if (EndGridCol > Grid_row_last_end)
								break;
							else
							{
								Cell_end = CurCell;
								bEnd     = true;
								break;
							}
						}
					}

					if (false === bEnd)
					{
						if (EndGridCol < Grid_row_last_end)
							continue;
						else if (EndGridCol > Grid_row_last_end)
							break;
						else //if ( EndGridCol === Grid_row_last_end )
						{
							Cell_end = CurCell;
							bEnd     = true;
							break;
						}
					}
				}

				if (true === bStart && true === bEnd)
				{
					for (var CurCell = Cell_start; CurCell <= Cell_end; CurCell++)
					{
						var Cell = Row.Get_Cell(CurCell);
						Cell.Set_Border(Props.CellBorders.Bottom, 0);
					}
					bRecalc_All = true;
				}
			}
		}

		var PrevRow    = Row_first;
		var Cell_start = Pos_first.Cell, Cell_end = Pos_first.Cell;
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos = Cells_array[Index];
			Row     = this.Content[Pos.Row];
			Cell    = Row.Get_Cell(Pos.Cell);

			if (PrevRow != Pos.Row)
			{
				var Row_temp = this.Content[PrevRow];

				if (true != bSpacing && Cell_start > 0 && true === bBorder_left)
				{
					Row_temp.Get_Cell(Cell_start - 1).Set_Border(Props.CellBorders.Left, 1);
					bRecalc_All = true;
				}

				if (true != bSpacing && Cell_end < Row_temp.Get_CellsCount() - 1 && true === bBorder_right)
				{
					Row_temp.Get_Cell(Cell_end + 1).Set_Border(Props.CellBorders.Right, 3);
					bRecalc_All = true;
				}

				for (var CurCell = Cell_start; CurCell <= Cell_end; CurCell++)
				{
					var Cell_temp = Row_temp.Get_Cell(CurCell);

					if (Row_first === PrevRow && true === bBorder_top)
					{
						Cell_temp.Set_Border(Props.CellBorders.Top, 0);
						bRecalc_All = true;
					}
					else if (Row_first != PrevRow && true === bBorder_insideh)
					{
						Cell_temp.Set_Border(Props.CellBorders.InsideH, 0);
						bRecalc_All = true;
					}

					if (Row_last === PrevRow && true === bBorder_bottom)
					{
						Cell_temp.Set_Border(Props.CellBorders.Bottom, 2);
						bRecalc_All = true;
					}
					else if (Row_last != PrevRow && true === bBorder_insideh)
					{
						Cell_temp.Set_Border(Props.CellBorders.InsideH, 2);
						bRecalc_All = true;
					}

					if (CurCell === Cell_start && true === bBorder_left)
					{
						Cell_temp.Set_Border(Props.CellBorders.Left, 3);
						bRecalc_All = true;
					}
					else if (CurCell != Cell_start && true === bBorder_insidev)
					{
						Cell_temp.Set_Border(Props.CellBorders.InsideV, 3);
						bRecalc_All = true;
					}

					if (CurCell === Cell_end && true === bBorder_right)
					{
						Cell_temp.Set_Border(Props.CellBorders.Right, 1);
						bRecalc_All = true;
					}
					else if (CurCell != Cell_end && true === bBorder_insidev)
					{
						Cell_temp.Set_Border(Props.CellBorders.InsideV, 1);
						bRecalc_All = true;
					}
				}

				Cell_start = Pos.Cell;
				Cell_end   = Pos.Cell;
				PrevRow    = Pos.Row;
			}
			else
				Cell_end = Pos.Cell;


			if (Cells_array.length - 1 === Index)
			{
				var Row_temp = this.Content[PrevRow];
				if (true != bSpacing && Cell_start > 0 && true === bBorder_left)
				{
					Row_temp.Get_Cell(Cell_start - 1).Set_Border(Props.CellBorders.Left, 1);
					bRecalc_All = true;
				}

				if (true != bSpacing && Cell_end < Row_temp.Get_CellsCount() - 1 && true === bBorder_right)
				{
					Row_temp.Get_Cell(Cell_end + 1).Set_Border(Props.CellBorders.Right, 3);
					bRecalc_All = true;
				}

				for (var CurCell = Cell_start; CurCell <= Cell_end; CurCell++)
				{
					var Cell_temp = Row_temp.Get_Cell(CurCell);

					if (Row_first === Pos.Row && true === bBorder_top)
					{
						Cell_temp.Set_Border(Props.CellBorders.Top, 0);
						bRecalc_All = true;
					}
					else if (Row_first != Pos.Row && true === bBorder_insideh)
					{
						Cell_temp.Set_Border(Props.CellBorders.InsideH, 0);
						bRecalc_All = true;
					}

					if (Row_last === Pos.Row && true === bBorder_bottom)
					{
						Cell_temp.Set_Border(Props.CellBorders.Bottom, 2);
						bRecalc_All = true;
					}
					else if (Row_last != Pos.Row && true === bBorder_insideh)
					{
						Cell_temp.Set_Border(Props.CellBorders.InsideH, 2);
						bRecalc_All = true;
					}

					if (CurCell === Cell_start && true === bBorder_left)
					{
						Cell_temp.Set_Border(Props.CellBorders.Left, 3);
						bRecalc_All = true;
					}
					else if (CurCell != Cell_start && true === bBorder_insidev)
					{
						Cell_temp.Set_Border(Props.CellBorders.InsideV, 3);
						bRecalc_All = true;
					}

					if (CurCell === Cell_end && true === bBorder_right)
					{
						Cell_temp.Set_Border(Props.CellBorders.Right, 1);
						bRecalc_All = true;
					}
					else if (CurCell != Cell_end && true === bBorder_insidev)
					{
						Cell_temp.Set_Border(Props.CellBorders.InsideV, 1);
						bRecalc_All = true;
					}
				}
			}
		}
	}

	// TableBackground  (заливка таблицы)
	if ("undefined" != typeof(Props.TableBackground))
	{
		if (Props.TableBackground.Value != TablePr.Shd.Value || Props.TableBackground.Color.r != TablePr.Shd.Color.r || Props.TableBackground.Color.g != TablePr.Shd.Color.g || Props.TableBackground.Color.b != TablePr.Shd.Color.b)
		{
			this.Set_TableShd(Props.TableBackground.Value, Props.TableBackground.Color.r, Props.TableBackground.Color.g, Props.TableBackground.Color.b);
			bRedraw = true;
		}

		// Удаляем собственную заливку ячеек
		if (false === Props.CellSelect && false === bSpacing)
		{
			for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
			{
				var Row = this.Content[CurRow];
				for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++)
				{
					var Cell = Row.Get_Cell(CurCell);
					Cell.Set_Shd({Value : Asc.c_oAscShdNil, Color : {r : 0, g : 0, b : 0}});
				}
			}
		}
	}

	// CellsBackground (заливка ячеек)
	if ("undefined" != typeof(Props.CellsBackground) && null != Props.CellsBackground)
	{
		if (false === Props.CellSelect && true === bSpacing)
		{
			for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
			{
				var Row = this.Content[CurRow];
				for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++)
				{
					var Cell   = Row.Get_Cell(CurCell);
					var NewShd =
							{
								Value : Props.CellsBackground.Value,
								Color : {
									r : Props.CellsBackground.Color.r,
									g : Props.CellsBackground.Color.g,
									b : Props.CellsBackground.Color.b
								},

								Unifill : Props.CellsBackground.Unifill.createDuplicate()
							};

					Cell.Set_Shd(NewShd);

					bRedraw = true;
				}
			}
		}
		else if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		{
			for (var Index = 0; Index < this.Selection.Data.length; Index++)
			{
				var Pos      = this.Selection.Data[Index];
				var Cell     = this.Content[Pos.Row].Get_Cell(Pos.Cell);
				var Cell_shd = Cell.Get_Shd();

				if (Props.CellsBackground.Value != Cell_shd.Value || Props.CellsBackground.Color.r != Cell_shd.Color.r || Props.CellsBackground.Color.g != Cell_shd.Color.g || Props.CellsBackground.Color.b != Cell_shd.Color.b || !AscFormat.CompareUnifillBool(Props.CellsBackground.Unifill, Cell_shd.Unifill))
				{
					var NewShd =
							{
								Value : Props.CellsBackground.Value,
								Color : {
									r : Props.CellsBackground.Color.r,
									g : Props.CellsBackground.Color.g,
									b : Props.CellsBackground.Color.b
								},

								Unifill : Props.CellsBackground.Unifill.createDuplicate()
							};

					Cell.Set_Shd(NewShd);

					bRedraw = true;
				}
			}
		}
		else
		{
			var Cell     = this.CurCell;
			var Cell_shd = Cell.Get_Shd();

			if (Props.CellsBackground.Value != Cell_shd.Value || Props.CellsBackground.Color.r != Cell_shd.Color.r || Props.CellsBackground.Color.g != Cell_shd.Color.g || Props.CellsBackground.Color.b != Cell_shd.Color.b || !AscFormat.CompareUnifillBool(Props.CellsBackground.Unifill, Cell_shd.Unifill))
			{
				var NewShd =
						{
							Value : Props.CellsBackground.Value,
							Color : {
								r : Props.CellsBackground.Color.r,
								g : Props.CellsBackground.Color.g,
								b : Props.CellsBackground.Color.b
							},

							Unifill : Props.CellsBackground.Unifill.createDuplicate()
						};

				Cell.Set_Shd(NewShd);

				bRedraw = true;
			}
		}
	}

	// CellsVAlign (вертикальное выравнивание ячеек)
	if (undefined != Props.CellsVAlign && null != Props.CellsVAlign)
	{
		if (this.Selection.Use === true && table_Selection_Cell === this.Selection.Type)
		{
			var Count = this.Selection.Data.length;
			for (var Index = 0; Index < Count; Index++)
			{
				var Pos  = this.Selection.Data[Index];
				var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
				Cell.Set_VAlign(Props.CellsVAlign);
			}
		}
		else
		{
			this.CurCell.Set_VAlign(Props.CellsVAlign);
		}

		bRecalc_All = true;
	}

	// CellsTextDirection
	if (undefined !== Props.CellsTextDirection && null !== Props.CellsTextDirection)
	{
		var TextDirection = undefined;
		switch (Props.CellsTextDirection)
		{
			case c_oAscCellTextDirection.LRTB:
				TextDirection = textdirection_LRTB;
				break;
			case c_oAscCellTextDirection.TBRL:
				TextDirection = textdirection_TBRL;
				break;
			case c_oAscCellTextDirection.BTLR:
				TextDirection = textdirection_BTLR;
				break;
		}

		if (undefined !== TextDirection)
		{
			if (this.Selection.Use === true && table_Selection_Cell === this.Selection.Type)
			{
				var Count = this.Selection.Data.length;
				for (var Index = 0; Index < Count; ++Index)
				{
					var Pos  = this.Selection.Data[Index];
					var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
					Cell.Set_TextDirectionFromApi(TextDirection);
				}
			}
			else
			{
				this.CurCell.Set_TextDirectionFromApi(TextDirection);
			}
		}
	}

	// CellsNoWrap
	if (undefined !== Props.CellsNoWrap && null !== Props.CellsNoWrap)
	{
		if (this.Selection.Use === true && table_Selection_Cell === this.Selection.Type)
		{
			var Count = this.Selection.Data.length;
			for (var Index = 0; Index < Count; ++Index)
			{
				var Pos  = this.Selection.Data[Index];
				var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
				Cell.Set_NoWrap(Props.CellsNoWrap);
			}
		}
		else
		{
			this.CurCell.Set_NoWrap(Props.CellsNoWrap);
		}
	}

	// CellsWidth
	if (undefined !== Props.CellsWidth)
	{
		var CellsWidth = Props.CellsWidth;
		if (null !== CellsWidth && Math.abs(CellsWidth) < 0.001)
			CellsWidth = null;

		if (this.Selection.Use === true && table_Selection_Cell === this.Selection.Type)
		{
			var Count = this.Selection.Data.length;
			for (var Index = 0; Index < Count; ++Index)
			{
				var Pos  = this.Selection.Data[Index];
				var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);

				if (null === CellsWidth)
					Cell.Set_W(new CTableMeasurement(tblwidth_Auto, 0));
				else if (CellsWidth > -0.001)
					Cell.Set_W(new CTableMeasurement(tblwidth_Mm, CellsWidth));
				else
					Cell.Set_W(new CTableMeasurement(tblwidth_Pct, Math.abs(CellsWidth)));
			}
		}
		else
		{
			if (null === CellsWidth)
				this.CurCell.Set_W(new CTableMeasurement(tblwidth_Auto, 0));
			else if (CellsWidth > -0.001)
				this.CurCell.Set_W(new CTableMeasurement(tblwidth_Mm, CellsWidth));
			else
				this.CurCell.Set_W(new CTableMeasurement(tblwidth_Pct, Math.abs(CellsWidth)));
		}
	}

	// TableDescription
	if (undefined !== Props.TableDescription && null !== Props.TableDescription)
	{
		this.Set_TableDescription(Props.TableDescription);
	}

	// TableCaption
	if (undefined !== Props.TableCaption && null !== Props.TableCaption)
	{
		this.Set_TableCaption(Props.TableCaption);
	}

	return true;
};
CTable.prototype.Get_Styles = function(Lvl)
{
	return this.Parent.Get_Styles(Lvl);
};
CTable.prototype.Get_TextBackGroundColor = function()
{
	// Сначала проверим заливку данной таблицы, если ее нет, тогда спрашиваем у родительского класса
	var Shd = this.Get_Shd();

	if (Asc.c_oAscShdNil !== Shd.Value)
		return Shd.Get_Color2(this.Get_Theme(), this.Get_ColorMap());

	return this.Parent.Get_TextBackGroundColor();
};
CTable.prototype.Get_Numbering = function()
{
	return this.Parent.Get_Numbering();
};
CTable.prototype.Get_PageBounds = function(CurPage)
{
	return this.Pages[CurPage].Bounds;
};
CTable.prototype.Get_PagesCount = function()
{
	return this.Pages.length;
};
CTable.prototype.Get_AllDrawingObjects = function(DrawingObjs)
{
	if (undefined === DrawingObjs)
		DrawingObjs = [];

	var Rows_Count = this.Content.length;
	for (var CurRow = 0; CurRow < Rows_Count; CurRow++)
	{
		var Row         = this.Content[CurRow];
		var Cells_Count = Row.Get_CellsCount();
		for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
		{
			var Cell = Row.Get_Cell(CurCell);
			Cell.Content.Get_AllDrawingObjects(DrawingObjs);
		}
	}

	return DrawingObjs;
};
CTable.prototype.Get_AllComments = function(AllComments)
{
	if (undefined === AllComments)
		AllComments = [];

	var Rows_Count = this.Content.length;
	for (var CurRow = 0; CurRow < Rows_Count; CurRow++)
	{
		var Row         = this.Content[CurRow];
		var Cells_Count = Row.Get_CellsCount();
		for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
		{
			var Cell = Row.Get_Cell(CurCell);
			Cell.Content.Get_AllComments(AllComments);
		}
	}

	return AllComments;
};
CTable.prototype.Get_AllMaths = function(AllMaths)
{
	if (undefined === AllMaths)
		AllMaths = [];

	var Rows_Count = this.Content.length;
	for (var CurRow = 0; CurRow < Rows_Count; CurRow++)
	{
		var Row         = this.Content[CurRow];
		var Cells_Count = Row.Get_CellsCount();
		for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
		{
			var Cell = Row.Get_Cell(CurCell);
			Cell.Content.Get_AllMaths(AllMaths);
		}
	}

	return AllMaths;
};
CTable.prototype.Get_AllFloatElements = function(FloatObjs)
{
	if (undefined === FloatObjs)
		FloatObjs = [];

	var Rows_Count = this.Content.length;
	for (var CurRow = 0; CurRow < Rows_Count; CurRow++)
	{
		var Row         = this.Content[CurRow];
		var Cells_Count = Row.Get_CellsCount();
		for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
		{
			var Cell = Row.Get_Cell(CurCell);
			Cell.Content.Get_AllFloatElements(FloatObjs);
		}
	}

	return FloatObjs;
};
/**
 * Данная функция запрашивает новую позицию для содержимого у ячейки, разбивающейся на несколько страниц
 */
CTable.prototype.Get_PageContentStartPos = function(CurPage, RowIndex, CellIndex)
{
	var Row      = this.Content[RowIndex];
	var Cell     = Row.Get_Cell(CellIndex);
	var CellMar  = Cell.Get_Margins();
	var CellInfo = Row.Get_CellInfo(CellIndex);

	var VMerge_count = this.Internal_GetVertMergeCount(RowIndex, CellInfo.StartGridCol, Cell.Get_GridSpan());

	// Возможно первая ячейка, для которой мы рассчитваем перенос на следующую страницу
	// имеет вертикальное объединение. Поэтому строка, по которой идет перенос не RowIndex,
	// а последняя строка в объединении.
	RowIndex = RowIndex + VMerge_count - 1;
	Row      = this.Content[RowIndex];

	var Pos = this.Parent.Get_PageContentStartPos2(this.PageNum, this.ColumnNum, CurPage, this.Index);

	// На момент обращения к данной функции, у всех ячеек всех строк до текущей (включительно) должны быть
	// просчитаны верхние границы. И также должен быть просчитан заголовок на данной странице, если он есть.

	var bHeader = false;
	var Y       = Pos.Y;
	if (-1 != this.HeaderInfo.PageIndex && this.HeaderInfo.Count > 0 && CurPage > this.HeaderInfo.PageIndex && true === this.HeaderInfo.Pages[CurPage].Draw)
	{
		Y       = this.HeaderInfo.Pages[CurPage].RowsInfo[this.HeaderInfo.Count - 1].TableRowsBottom;
		bHeader = true;
	}

	var CellSpacing = Row.Get_CellSpacing();
	if (null != CellSpacing)
	{
		var Table_Border_Top = this.Get_Borders().Top;
		if (border_Single === Table_Border_Top.Value)
			Y += Table_Border_Top.Size;

		if (true === bHeader || 0 === CurPage || ( 1 === CurPage && true != this.RowsInfo[0].FirstPage ))
			Y += CellSpacing;
		else
			Y += CellSpacing / 2;
	}

	// Далее вычислим маскимальную ширину верхней границы всех ячеек в данной
	// строке, учитывая ячейки, учавствующие в вертикальном объединении.

	var MaxTopBorder = 0;
	var CellsCount   = Row.Get_CellsCount();
	var TableBorders = this.Get_Borders();
	for (var CurCell = 0; CurCell < CellsCount; CurCell++)
	{
		var Cell   = Row.Get_Cell(CurCell);
		var VMerge = Cell.Get_VMerge();

		if (vmerge_Continue === VMerge)
			Cell = this.Internal_Get_StartMergedCell(RowIndex, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());

		var BorderInfo_Top = Cell.Get_BorderInfo().Top;
		if (null === BorderInfo_Top)
			continue;

		for (var Index = 0; Index < BorderInfo_Top.length; Index++)
		{
			var CurBorder = BorderInfo_Top[Index];

			var ResultBorder = this.Internal_CompareBorders(CurBorder, TableBorders.Top, false, true);

			if (border_Single === ResultBorder.Value && MaxTopBorder < ResultBorder.Size)
				MaxTopBorder = ResultBorder.Size;
		}
	}

	Pos.X = this.Pages[CurPage].X;

	Y += MaxTopBorder;

	// Учтем верхнее поле ячейки
	Y += CellMar.Top.W;

	var YLimit = Pos.YLimit;

	YLimit -= this.Pages[CurPage].FootnotesH;

	// TODO: Здесь надо учитывать нижнюю границу ячейки и вычесть ее ширину из YLimit
	return {X        : Pos.X + CellInfo.X_content_start,
		XLimit       : Pos.X + CellInfo.X_content_end,
		Y            : Y,
		YLimit       : YLimit,
		MaxTopBorder : MaxTopBorder
	};
};
CTable.prototype.Get_MaxTopBorder = function(RowIndex)
{
	// Вычислим маскимальную ширину верхней границы всех ячеек в данной
	// строке, учитывая ячейки, учавствующие в вертикальном объединении.

	var Row = this.Content[RowIndex];

	var MaxTopBorder = 0;
	var CellsCount   = Row.Get_CellsCount();
	var TableBorders = this.Get_Borders();
	for (var CurCell = 0; CurCell < CellsCount; CurCell++)
	{
		var Cell   = Row.Get_Cell(CurCell);
		var VMerge = Cell.Get_VMerge();

		if (vmerge_Continue === VMerge)
			Cell = this.Internal_Get_StartMergedCell(RowIndex, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());

		var BorderInfo_Top = Cell.Get_BorderInfo().Top;
		if (null === BorderInfo_Top)
			continue;

		for (var Index = 0; Index < BorderInfo_Top.length; Index++)
		{
			var CurBorder = BorderInfo_Top[Index];

			var ResultBorder = this.Internal_CompareBorders(CurBorder, TableBorders.Top, false, true);

			if (border_Single === ResultBorder.Value && MaxTopBorder < ResultBorder.Size)
				MaxTopBorder = ResultBorder.Size;
		}
	}

	return MaxTopBorder;
};
/**
 * Вычисляем небольшое смещение по X, необходимое для совместимости с Word разных версий
 */
CTable.prototype.Get_TableOffsetCorrection = function()
{
	var X = 0;

	if (true === this.Parent.Is_TableCellContent())
		return 0;

	var Row     = this.Content[0];
	var Cell    = Row.Get_Cell(0);
	var Margins = Cell.Get_Margins();

	var CellSpacing = Row.Get_CellSpacing();
	if (null != CellSpacing)
	{
		var TableBorder_Left = this.Get_Borders().Left;
		if (border_None != TableBorder_Left.Value)
			X += TableBorder_Left.Size / 2;

		X += CellSpacing;

		var CellBorder_Left = Cell.Get_Borders().Left;
		if (border_None != CellBorder_Left.Value)
			X += CellBorder_Left.Size;

		X += Margins.Left.W;
	}
	else
	{
		var TableBorder_Left = this.Get_Borders().Left;
		var CellBorder_Left  = Cell.Get_Borders().Left;
		var Result_Border    = this.Internal_CompareBorders(TableBorder_Left, CellBorder_Left, true, false);

		if (border_None != Result_Border.Value)
			X += Math.max(Result_Border.Size / 2, Margins.Left.W);
		else
			X += Margins.Left.W;
	}

	return -X;
};
CTable.prototype.Get_RightTableOffsetCorrection = function()
{
	var X = 0;

	if (true === this.Parent.Is_TableCellContent())
		return 0;

	var Row         = this.Content[0];
	var Cell        = Row.Get_Cell(Row.Get_CellsCount() - 1);
	var Margins     = Cell.Get_Margins();
	var CellSpacing = Row.Get_CellSpacing();
	if (null != CellSpacing)
	{
		var TableBorder_Right = this.Get_Borders().Right;
		if (border_None != TableBorder_Right.Value)
			X += TableBorder_Right.Size / 2;

		X += CellSpacing;

		var CellBorder_Right = Cell.Get_Borders().Right;
		if (border_None != CellBorder_Right.Value)
			X += CellBorder_Right.Size;

		X += Margins.Right.W;
	}
	else
	{
		var TableBorder_Right = this.Get_Borders().Right;
		var CellBorder_Right  = Cell.Get_Borders().Right;
		var Result_Border     = this.Internal_CompareBorders(TableBorder_Right, CellBorder_Right, true, false);

		if (border_None != Result_Border.Value)
			X += Math.max(Result_Border.Size / 2, Margins.Right.W);
		else
			X += Margins.Right.W;
	}

	return X;
};
/**
 * Получаем первый параграф первой ячейки. (Нужно, например, для контроля ContextualSpacing)
 */
CTable.prototype.Get_FirstParagraph = function()
{
	if (this.Content.length <= 0 || this.Content[0].Content.length <= 0)
		return null;

	return this.Content[0].Content[0].Content.Get_FirstParagraph();
};
CTable.prototype.Get_AllParagraphs = function(Props, ParaArray)
{
	var Count = this.Content.length;
	for (var CurRow = 0; CurRow < Count; CurRow++)
	{
		var Row         = this.Content[CurRow];
		var Cells_Count = Row.Get_CellsCount();
		for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
		{
			var Cell = Row.Get_Cell(CurCell);
			Cell.Content.Get_AllParagraphs(Props, ParaArray);
		}
	}
};
CTable.prototype.Get_EndInfo = function()
{
	var RowsCount = this.Content.length;
	if (RowsCount > 0)
		return this.Content[RowsCount - 1].Get_EndInfo();

	return null;
};
CTable.prototype.Get_PrevElementEndInfo = function(RowIndex)
{
	if (0 === RowIndex)
		return this.Parent.Get_PrevElementEndInfo(this);
	else
		return this.Content[RowIndex - 1].Get_EndInfo();
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с номерами страниц
//----------------------------------------------------------------------------------------------------------------------
CTable.prototype.Get_StartPage_Absolute = function()
{
	return this.Get_AbsolutePage(0);
};
CTable.prototype.Get_StartPage_Relative = function()
{
	return this.PageNum;
};
CTable.prototype.Get_StartColumn = function()
{
	return this.ColumnNum;
};
CTable.prototype.Get_ColumnsCount = function()
{
	return this.ColumnsCount;
};
CTable.prototype.private_GetRelativePageIndex = function(CurPage)
{
	if (!this.ColumnsCount || 0 === this.ColumnsCount)
		return this.PageNum + CurPage;

	return this.PageNum + ((this.ColumnNum + CurPage) / this.ColumnsCount | 0);
};
CTable.prototype.private_GetAbsolutePageIndex = function(CurPage)
{
	return this.Parent.Get_AbsolutePage(this.private_GetRelativePageIndex(CurPage));
};
CTable.prototype.Get_AbsolutePage = function(CurPage)
{
	return this.private_GetAbsolutePageIndex(CurPage);
};
CTable.prototype.Get_AbsoluteColumn = function(CurPage)
{
	if (this.Parent instanceof CDocument)
		return this.private_GetColumnIndex(CurPage);

	return this.Parent.Get_AbsoluteColumn(this.private_GetRelativePageIndex(CurPage));
};
CTable.prototype.private_GetColumnIndex = function(CurPage)
{
	return (this.ColumnNum + CurPage) - (((this.ColumnNum + CurPage) / this.ColumnsCount | 0) * this.ColumnsCount);
};
//----------------------------------------------------------------------------------------------------------------------
// Функции к которым идет обращение из родительского класса
//----------------------------------------------------------------------------------------------------------------------
CTable.prototype.GetType = function()
{
	return type_Table;
};
CTable.prototype.Get_Type = function()
{
	return type_Table;
};
CTable.prototype.Copy = function(Parent)
{
	var TableGrid = this.private_CopyTableGrid();
	var Table     = new CTable(this.DrawingDocument, Parent, this.Inline, 0, 0, 0, 0, 0, 0, 0, TableGrid, this.bPresentation);

	Table.Set_Distance(this.Distance.L, this.Distance.T, this.Distance.R, this.Distance.B);
	Table.Set_PositionH(this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value);
	Table.Set_PositionV(this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value);

	// Копируем настройки
	Table.Set_TableStyle(this.TableStyle);
	Table.Set_TableLook(this.TableLook.Copy());
	Table.Set_Pr(this.Pr.Copy());

	Table.Rows = this.Rows;
	Table.Cols = this.Cols;

	// Копируем строки
	var Rows = this.Content.length;
	for (var Index = 0; Index < Rows; Index++)
	{
		Table.Content[Index] = this.Content[Index].Copy(Table);
		History.Add(new CChangesTableAddRow(Table, Index, [Table.Content[Index]]));
	}

	Table.Internal_ReIndexing(0);

	if (Table.Content.length > 0 && Table.Content[0].Get_CellsCount() > 0)
		Table.CurCell = Table.Content[0].Get_Cell(0);

	return Table;
};
CTable.prototype.Shift = function(CurPage, Dx, Dy)
{
	this.Pages[CurPage].Shift(Dx, Dy);

	if (0 === CurPage)
	{
		this.X_origin += Dx;
		this.X += Dx;
		this.Y += Dy;
		this.XLimit += Dx;
		this.YLimit += Dy;
	}

	var StartRow = this.Pages[CurPage].FirstRow;
	var LastRow  = this.Pages[CurPage].LastRow;
	for (var CurRow = StartRow; CurRow <= LastRow; CurRow++)
	{
		var Row        = this.Content[CurRow];
		var CellsCount = Row.Get_CellsCount();
		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			var Cell          = Row.Get_Cell(CurCell);
			var CellPageIndex = CurPage - Cell.Content.Get_StartPage_Relative();
			if (vmerge_Restart === Cell.Get_VMerge())
			{
				Cell.Content_Shift(CellPageIndex, Dx, Dy);
			}
		}

		this.RowsInfo[CurRow].Y[CurPage] += Dy;
		this.TableRowsBottom[CurRow][CurPage] += Dy;
	}
};
CTable.prototype.Update_EndInfo = function()
{
	for (var RowIndex = 0, RowsCount = this.Content.length; RowIndex < RowsCount; RowIndex++)
	{
		var Row = this.Content[RowIndex];
		for (var CellIndex = 0, CellsCount = Row.Get_CellsCount(); CellIndex < CellsCount; CellIndex++)
		{
			var Cell = Row.Get_Cell(CellIndex);
			Cell.Content.Update_EndInfo();
		}
	}
};
CTable.prototype.Internal_UpdateFlowPosition = function(X, Y)
{
	this.X_origin = X;
	var Dx        = this.Get_TableOffsetCorrection();

	this.X = X + Dx;
	this.Y = Y;

	this.Set_PositionH(c_oAscHAnchor.Page, false, this.X);
	this.Set_PositionV(c_oAscVAnchor.Page, false, this.Y);
};
CTable.prototype.Move = function(X, Y, PageNum, NearestPos)
{
	var oLogicDocument = editor.WordControl.m_oLogicDocument;

	this.Document_SetThisElementCurrent(false);
	this.Cursor_MoveToStartPos();

	var oTargetTable = this;
	if (true != this.Is_Inline())
	{
		if (false === oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Table_Properties, null, true))
		{
			oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_MoveInlineTable);

			// Переносим привязку (если получается, что заносим таблицу саму в себя, тогда привязку не меняем)
			var NewDocContent = NearestPos.Paragraph.Parent;
			var OldDocContent = this.Parent;

			if (true != NewDocContent.Check_TableCoincidence(this))
			{
				var OldIndex = this.Index;
				var NewIndex = NearestPos.Paragraph.Index;

				// Проверим можем ли мы добавить таблицу перед параграфом так, чтобы таблица осталась на данной странице
				if (PageNum > NearestPos.Paragraph.Get_StartPage_Absolute())
				{
					if (NearestPos.Paragraph.Pages.length > 2)
					{
						// Параграф начинается до заданной страницы и заканчивается после. Нам нужно разделить его на
						// 2 параграфа в заданной точке.

						var NewParagraph = new Paragraph(NewDocContent.DrawingDocument, NewDocContent, 0, 0, 0, 0, 0);
						NearestPos.Paragraph.Split(NewParagraph, NearestPos.ContentPos);
						NewDocContent.Internal_Content_Add(NewIndex + 1, NewParagraph);

						// Если все происходило в одном классе-документе, тогда проверяем индексы
						if (NewDocContent === OldDocContent && NewIndex + 1 <= OldIndex)
							OldIndex++;

						NewIndex++;
					}
					else
					{
						// Вставляем таблицу после найденного параграфа. Если параграф последний, тогда
						// в конец добавляем новый пустой параграф
						NewIndex++;
						if (NewIndex >= NewDocContent.Content.length - 1)
							NewDocContent.Internal_Content_Add(NewDocContent.Content.length, new Paragraph(NewDocContent.DrawingDocument, NewDocContent, 0, 0, 0, 0, 0));
					}

				}

				oTargetTable = AscCommon.CollaborativeEditing.Is_SingleUser() ? this : this.Copy(NewDocContent);
				if (NewDocContent != OldDocContent)
				{
					// Сначала добавляем таблицу в новый класс
					NewDocContent.Internal_Content_Add(NewIndex, oTargetTable);

					// Удаляем таблицу из родительского класса
					OldDocContent.Internal_Content_Remove(OldIndex, 1);

					oTargetTable.Parent = NewDocContent;
				}
				else
				{
					if (NearestPos.Paragraph.Index > this.Index)
					{
						NewDocContent.Internal_Content_Add(NewIndex, oTargetTable);
						OldDocContent.Internal_Content_Remove(OldIndex, 1);
					}
					else
					{
						OldDocContent.Internal_Content_Remove(OldIndex, 1);
						NewDocContent.Internal_Content_Add(NewIndex, oTargetTable);
					}
				}
			}

			// Обновляем координаты

			// Здесь мы должны для первого рассчета оставить привязку относительно страницы, а после рассчета
			// изменить привязку на старую, при этом пересчитав координаты так, чтобы картинка не изменила
			// своего положения.

			oTargetTable.PositionH_Old = {
				RelativeFrom : oTargetTable.PositionH.RelativeFrom,
				Align        : oTargetTable.PositionH.Align,
				Value        : oTargetTable.PositionH.Value
			};

			oTargetTable.PositionV_Old = {
				RelativeFrom : oTargetTable.PositionV.RelativeFrom,
				Align        : oTargetTable.PositionV.Align,
				Value        : oTargetTable.PositionV.Value
			};

			oTargetTable.PositionH.RelativeFrom = c_oAscHAnchor.PageInternal;
			oTargetTable.PositionH.Align        = false;
			oTargetTable.PositionH.Value        = X;

			oTargetTable.PositionV.RelativeFrom = c_oAscVAnchor.Page;
			oTargetTable.PositionV.Align        = false;
			oTargetTable.PositionV.Value        = Y;

			oTargetTable.PageNum = PageNum;

			editor.WordControl.m_oLogicDocument.Recalculate();
			oTargetTable.Start_TrackTable();
		}
	}
	else
	{
		// Проверяем, можно ли двигать данную таблицу
		if (false === oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Table_Properties, {
				Type    : AscCommon.changestype_2_InlineObjectMove,
				PageNum : PageNum,
				X       : X,
				Y       : Y
			}, true))
		{
			oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_MoveFlowTable);

			var NewDocContent = NearestPos.Paragraph.Parent;
			var OldDocContent = this.Parent;

			if (true != NewDocContent.Check_TableCoincidence(this))
			{
				var TarParagraph   = NearestPos.Paragraph;
				var ParaContentPos = NearestPos.ContentPos;

				var OldIndex = this.Index;
				var NewIndex = NearestPos.Paragraph.Index;

				// Если позиция в начале параграфа, тогда добавляем таблицу до параграфа, если в конце, тогда
				// после параграфа, в противном случае разделяем параграф.
				if (true === TarParagraph.Cursor_IsEnd(ParaContentPos))
				{
					NewIndex++;
				}
				else if (true != TarParagraph.Cursor_IsStart(ParaContentPos))
				{
					var NewParagraph = new Paragraph(NewDocContent.DrawingDocument, NewDocContent, 0, 0, 0, 0, 0);
					NearestPos.Paragraph.Split(NewParagraph, NearestPos.ContentPos);
					NewDocContent.Internal_Content_Add(NewIndex + 1, NewParagraph);

					// Если все происходило в одном классе-документе, тогда проверяем индексы
					if (NewDocContent === OldDocContent && NewIndex + 1 <= OldIndex)
						OldIndex++;

					NewIndex++;
				}

				var oTargetTable = AscCommon.CollaborativeEditing.Is_SingleUser() ? this : this.Copy(NewDocContent);
				if (NewDocContent != OldDocContent)
				{
					// Сначала добавляем таблицу в новый класс
					NewDocContent.Internal_Content_Add(NewIndex, oTargetTable);

					// Удаляем таблицу из родительского класса
					OldDocContent.Internal_Content_Remove(OldIndex, 1);

					oTargetTable.Parent = NewDocContent;
				}
				else
				{
					if (NearestPos.Paragraph.Index > this.Index)
					{
						NewDocContent.Internal_Content_Add(NewIndex, oTargetTable);
						OldDocContent.Internal_Content_Remove(OldIndex, 1);
					}
					else
					{
						OldDocContent.Internal_Content_Remove(OldIndex, 1);
						NewDocContent.Internal_Content_Add(NewIndex, oTargetTable);
					}
				}

				editor.WordControl.m_oLogicDocument.Recalculate();
			}
			oTargetTable.Start_TrackTable();
		}
	}
	editor.WordControl.m_oLogicDocument.Selection_Remove();
	oTargetTable.Document_SetThisElementCurrent(true);
	oTargetTable.Cursor_MoveToStartPos();
	editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
};
CTable.prototype.Reset = function(X, Y, XLimit, YLimit, PageNum, ColumnNum, ColumnsCount)
{
	if (this.Parent.RecalcInfo.FlowObject === this && c_oAscVAnchor.Text === this.PositionV.RelativeFrom)
	{
		this.Y -= this.PositionV.Value;
		this.YLimit -= this.PositionV.Value;
		return;
	}

	this.X_origin = X;
	this.X        = X;
	this.Y        = Y + 0.001; // Погрешность для Flow-таблиц
	this.XLimit   = XLimit;
	this.YLimit   = YLimit;

	this.PageNum      = PageNum;
	this.ColumnNum    = ColumnNum ? ColumnNum : 0;
	this.ColumnsCount = ColumnsCount ? ColumnsCount : 1;

	this.Pages.length = 1;
	this.Pages[0]     = new CTablePage(X, Y, XLimit, YLimit, 0, 0);
};
CTable.prototype.Recalculate = function()
{
	// Пересчитываем сетку колонок
	this.private_RecalculateGrid();
	this.Internal_Recalculate_1();
};
CTable.prototype.Reset_RecalculateCache = function()
{
	this.RecalcInfo.Reset(true);

	var RowsCount = this.Content.length;
	for (var RowIndex = 0; RowIndex < RowsCount; RowIndex++)
	{
		var Row        = this.Content[RowIndex];
		var CellsCount = Row.Get_CellsCount();
		for (var CellIndex = 0; CellIndex < CellsCount; CellIndex++)
		{
			var Cell = Row.Get_Cell(CellIndex);
			Cell.Content.Reset_RecalculateCache();
		}
	}
};
CTable.prototype.RecalculateCurPos = function()
{
	if (null != this.CurCell)
		return this.CurCell.Content_RecalculateCurPos();

	return null;
};
CTable.prototype.Recalculate_MinMaxContentWidth = function(isRotated)
{
	if (true === isRotated)
	{
		var MinMargin = [], MinContent = [], MaxContent = [];

		var RowsCount = this.Content.length;
		for (var CurRow = 0; CurRow < RowsCount; ++CurRow)
		{
			MinMargin[CurRow]  = 0;
			MinContent[CurRow] = 0;
			MaxContent[CurRow] = 0;
		}

		for (var CurRow = 0; CurRow < RowsCount; CurRow++)
		{
			var Row        = this.Content[CurRow];
			var CellsCount = Row.Get_CellsCount();
			for (var CurCell = 0; CurCell < CellsCount; CurCell++)
			{
				var Cell         = Row.Get_Cell(CurCell);
				var CellMinMax   = Cell.Content_Recalculate_MinMaxContentWidth(isRotated);
				var CellMin      = CellMinMax.Min;
				var CellMax      = CellMinMax.Max;
				var CellMargins  = Cell.Get_Margins();
				var CellMarginsW = CellMargins.Top.W + CellMargins.Bottom.W;

				if (MinMargin[CurRow] < CellMarginsW)
					MinMargin[CurRow] = CellMarginsW;

				if (MinContent[CurRow] < CellMin)
					MinContent[CurRow] = CellMin;

				if (MaxContent[CurRow] < CellMax)
					MaxContent[CurRow] = CellMax;
			}

			var RowH = Row.Get_Height();
			if (Asc.linerule_Exact === RowH.HRule || (linerule_AtLeast === RowH.HRule && MinContent[CurRow] < RowH.Value))
				MinContent[CurRow] = RowH.Value;

			if (Asc.linerule_Exact === RowH.HRule || (linerule_AtLeast === RowH.HRule && MaxContent[CurRow] < RowH.Value))
				MaxContent[CurRow] = RowH.Value;
		}

		var Min = 0;
		var Max = 0;
		for (var CurRow = 0; CurRow < RowsCount; ++CurRow)
		{
			Min += MinMargin[CurRow] + MinContent[CurRow];
			Max += MinMargin[CurRow] + MaxContent[CurRow];
		}

		return {Min : Min, Max : Max};
	}
	else
	{
		var MinMargin = [], MinContent = [], MaxContent = [], MaxFlags = [];

		var GridCount = this.TableGridCalc.length;
		for (var CurCol = 0; CurCol < GridCount; CurCol++)
		{
			MinMargin[CurCol]  = 0;
			MinContent[CurCol] = 0;
			MaxContent[CurCol] = 0;
			MaxFlags[CurCol]   = false; // false - ориентируемся на содержимое ячеек, true - ориентируемся только на
										// ширину ячеек записанную в свойствах
		}

		var RowsCount = this.Content.length;
		for (var CurRow = 0; CurRow < RowsCount; CurRow++)
		{
			var Row = this.Content[CurRow];

			// Смотрим на ширину пропущенных колонок сетки в начале строки
			var BeforeInfo = Row.Get_Before();
			var CurGridCol = BeforeInfo.GridBefore;

			var CellsCount = Row.Get_CellsCount();
			for (var CurCell = 0; CurCell < CellsCount; CurCell++)
			{
				var Cell         = Row.Get_Cell(CurCell);
				var CellMinMax   = Cell.Content_Recalculate_MinMaxContentWidth(isRotated);
				var CellMin      = CellMinMax.Min;
				var CellMax      = CellMinMax.Max;
				var GridSpan     = Cell.Get_GridSpan();
				var CellMargins  = Cell.Get_Margins();
				var CellMarginsW = CellMargins.Left.W + CellMargins.Right.W;
				var CellW        = Cell.Get_W();
				var CellWW       = null;

				if (tblwidth_Mm === CellW.Type)
					CellWW = CellW.W;
				else if (tblwidth_Pct === CellW.Type)
					CellWW = (this.XLimit - this.X) * CellW.W / 100;

				// Если GridSpan > 1, тогда все равно маргины учитываются в первую колоноку спана
				if (MinMargin[CurGridCol] < CellMarginsW)
					MinMargin[CurGridCol] = CellMarginsW;

				// На самом деле, случай 1 === GridSpan нормально обработается и как случай GridSpan > 1,
				// но поскольку он наиболее распространен, делаем его обработку максимально быстрой (без циклов)
				if (1 === GridSpan)
				{
					if (MinContent[CurGridCol] < CellMin)
						MinContent[CurGridCol] = CellMin;

					if (false === MaxFlags[CurGridCol] && MaxContent[CurGridCol] < CellMax)
						MaxContent[CurGridCol] = CellMax;

					if (null !== CellWW)
					{
						if (false === MaxFlags[CurGridCol])
						{
							MaxFlags[CurGridCol]   = true;
							MaxContent[CurGridCol] = Math.max(CellWW, CellMin);
						}
						else
						{
							MaxContent[CurGridCol] = Math.max(MaxContent[CurGridCol], CellWW, CellMin);
						}
					}
				}
				else
				{
					var SumSpanMinContent = 0;
					var SumSpanMaxContent = 0;
					for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridSpan; CurSpan++)
					{
						SumSpanMinContent += MinContent[CurSpan];
						SumSpanMaxContent += MaxContent[CurSpan];
					}

					if (SumSpanMinContent < CellMin)
					{
						var TempAdd = (CellMin - SumSpanMinContent) / GridSpan;
						for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridSpan; CurSpan++)
							MinContent[CurSpan] += TempAdd;
					}

					// Если у нас в объединении несколько колонок, тогда явно записанная ширина ячейки не
					// перекрывает ширину ни одной из колонок, она всего лишь участвует в определении
					// максимальной ширины.
					if (null !== CellWW && CellWW > CellMax)
						CellMax = CellWW;

					if (SumSpanMaxContent < CellMax)
					{
						// TODO: На самом деле, распределение здесь идет в каком-то отношении.
						//       Неплохо было бы выяснить как именно.
						var TempAdd = (CellMax - SumSpanMaxContent) / GridSpan;
						for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridSpan; CurSpan++)
							MaxContent[CurSpan] += TempAdd;
					}
				}

				CurGridCol += GridSpan;
			}
		}

		var Min = 0;
		var Max = 0;
		for (var CurCol = 0; CurCol < GridCount; CurCol++)
		{
			Min += MinMargin[CurCol] + MinContent[CurCol];

			if (false === MaxFlags[CurCol])
				Max += MinMargin[CurCol] + MaxContent[CurCol];
			else
				Max += MaxContent[CurCol];
		}

		return {Min : Min, Max : Max};
	}
};
CTable.prototype.Recalculate_AllTables = function()
{
	this.private_RecalculateGrid();
	this.private_RecalculateBorders();

	var RowsCount = this.Content.length;
	for (var CurRow = 0; CurRow < RowsCount; CurRow++)
	{
		var Row        = this.Content[CurRow];
		var CellsCount = Row.Get_CellsCount();
		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			var Cell = Row.Get_Cell(CurCell);
			Cell.Content.Recalculate_AllTables();
		}
	}
};
CTable.prototype.Get_LastRangeVisibleBounds = function()
{
	var CurPage = this.Pages.length - 1;
	var Page    = this.Pages[CurPage];
	var CurRow  = this.Content.length - 1;
	var Row     = this.Content[CurRow];

	// Ищем границы по горизонтали для последней ячейки
	var CurCell = Row.Get_CellsCount() - 1;

	var Cell     = Row.Get_Cell(CurCell);
	var CellInfo = Row.Get_CellInfo(CurCell);
	var CellMar  = Cell.Get_Margins();

	var X_start = Page.X + CellInfo.X_cell_start;
	var X_end   = Page.X + CellInfo.X_cell_end;

	var Cell_PageRel = CurPage - Cell.Content.Get_StartPage_Relative();

	// Не все ячейки могут иметь страницу с номером Cell_PageRel, но хотя бы одна такая должна быть (иначе переноса
	// на новую страницу не было бы)
	var CellsCount = Row.Get_CellsCount();
	for (CurCell = 0; CurCell < CellsCount; CurCell++)
	{
		Cell = Row.Get_Cell(CurCell);

		if (Cell_PageRel <= Cell.PagesCount - 1)
			break;
	}

	if (CurCell >= CellsCount)
		return {X : X_start, Y : 0, W : X_end - X_start, H : 0, BaseLine : 0, XLimit : Page.XLimit};

	var Bounds   = Cell.Content_Get_PageBounds(Cell_PageRel);
	var Y_offset = Cell.Temp.Y_VAlign_offset[Cell_PageRel];

	var Y = 0;
	var H = 0;
	if (0 != Cell_PageRel)
	{
		// мы должны определить ряд, на котором случился перенос на новую страницу
		var TempRowIndex = this.Pages[CurPage].FirstRow;

		Y = this.RowsInfo[TempRowIndex].Y[CurPage] + this.RowsInfo[TempRowIndex].TopDy[CurPage] + CellMar.Top.W + Y_offset;
		H = this.RowsInfo[TempRowIndex].H[CurPage];
	}
	else
	{
		Y = this.RowsInfo[CurRow].Y[CurPage] + this.RowsInfo[CurRow].TopDy[CurPage] + CellMar.Top.W + Y_offset;
		H = this.RowsInfo[CurRow].H[CurPage];
	}

	return {X : X_start, Y : Y, W : X_end - X_start, H : H, BaseLine : H, XLimit : Page.XLimit};
};
CTable.prototype.Get_NearestPos = function(CurPage, X, Y, bAnchor, Drawing)
{
	var Pos  = this.Internal_GetCellByXY(X, Y, CurPage);
	var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);

	return Cell.Content_Get_NearestPos(CurPage - Cell.Content.Get_StartPage_Relative(), X, Y, bAnchor, Drawing);
};
CTable.prototype.Get_ParentTextTransform = function()
{
	return this.Parent.Get_ParentTextTransform();
};
/**
 * Проверяем начинается ли текущий параграф с новой страницы.
 */
CTable.prototype.Is_StartFromNewPage = function()
{
	if ((this.Pages.length > 1 && true === this.Is_EmptyPage(0)) || (null === this.Get_DocumentPrev() && true === this.Parent.Is_TopDocument()))
		return true;

	return false;
};
CTable.prototype.Is_ContentOnFirstPage = function()
{
	if (this.Pages.length >= 1 && true === this.RowsInfo[0].FirstPage)
		return true;

	return false;
};
CTable.prototype.Is_TableBorder = function(X, Y, CurPage)
{
	if (true === this.DrawingDocument.IsMobileVersion())
		return null;

	CurPage = Math.max(0, Math.min(this.Pages.length - 1, CurPage));

	if (true === this.Is_EmptyPage(CurPage))
		return null;

	var Result = this.Internal_CheckBorders(X, Y, CurPage);
	if (Result.Border != -1)
	{
		return this;
	}
	else
	{
		var Cell = this.Content[Result.Pos.Row].Get_Cell(Result.Pos.Cell);
		return Cell.Content_Is_TableBorder(X, Y, CurPage - Cell.Content.Get_StartPage_Relative());
	}
};
CTable.prototype.Is_InText = function(X, Y, CurPage)
{
	if (CurPage < 0 || CurPage >= this.Pages.length)
		CurPage = 0;

	var Result = this.Internal_CheckBorders(X, Y, CurPage);
	if (Result.Border != -1)
	{
		return null;
	}
	else
	{
		var Cell = this.Content[Result.Pos.Row].Get_Cell(Result.Pos.Cell);
		return Cell.Content_Is_InText(X, Y, CurPage - Cell.Content.Get_StartPage_Relative());
	}
};
CTable.prototype.Is_InDrawing  = function(X, Y, CurPage)
{
	if (CurPage < 0 || CurPage >= this.Pages.length)
		CurPage = 0;

	var Result = this.Internal_CheckBorders(X, Y, CurPage);
	if (Result.Border != -1)
	{
		return null;
	}
	else
	{
		var Cell = this.Content[Result.Pos.Row].Get_Cell(Result.Pos.Cell);
		return Cell.Content_Is_InDrawing(X, Y, CurPage - Cell.Content.Get_StartPage_Relative());
	}
};
CTable.prototype.Is_InnerTable = function()
{
	if (this.Content.length <= 0)
		return false;

	if (false === this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
		return this.CurCell.Content.Is_CurrentElementTable();

	return false;
};
CTable.prototype.Is_UseInDocument = function(Id)
{
	var bUse = false;
	if (null != Id)
	{
		var RowsCount = this.Content.length;
		for (var Index = 0; Index < RowsCount; Index++)
		{
			if (Id === this.Content[Index].Get_Id())
			{
				bUse = true;
				break;
			}
		}
	}
	else
		bUse = true;

	if (true === bUse && null != this.Parent)
		return this.Parent.Is_UseInDocument(this.Get_Id());

	return false;
};
CTable.prototype.Get_CurrentPage_Absolute = function()
{
	if (true === this.Selection.Use)
	{
		var Pos = this.Selection.EndPos.Pos;
		return this.Content[Pos.Row].Get_Cell(Pos.Cell).Content.Get_CurrentPage_Absolute();
	}
	else
		return this.CurCell.Content.Get_CurrentPage_Absolute();
};
CTable.prototype.Get_CurrentPage_Relative = function()
{
	if (true === this.Selection.Use)
		return 0;

	return this.CurCell.Content.Get_CurrentPage_Absolute() - this.Get_StartPage_Absolute();
};
CTable.prototype.Update_CursorType = function(X, Y, CurPage)
{
	if (CurPage < 0 || CurPage >= this.Pages.length)
		CurPage = 0;

	if (true === this.Lock.Is_Locked())
	{
		var _X = this.Pages[CurPage].Bounds.Left;
		var _Y = this.Pages[CurPage].Bounds.Top;

		var MMData              = new CMouseMoveData();
		var Coords              = this.DrawingDocument.ConvertCoordsToCursorWR(_X, _Y, this.Get_AbsolutePage(CurPage));
		MMData.X_abs            = Coords.X - 5;
		MMData.Y_abs            = Coords.Y - 5;
		MMData.Type             = AscCommon.c_oAscMouseMoveDataTypes.LockedObject;
		MMData.UserId           = this.Lock.Get_UserId();
		MMData.HaveChanges      = this.Lock.Have_Changes();
		MMData.LockedObjectType = c_oAscMouseMoveLockedObjectType.Common;

		editor.sync_MouseMoveCallback(MMData);
	}

	if (true === this.Selection.Start || table_Selection_Border === this.Selection.Type2 || table_Selection_Border_InnerTable === this.Selection.Type2)
		return;

	var NewOutline = null;
	if (true === this.Check_EmptyPages(CurPage - 1) && true !== this.Is_EmptyPage(CurPage))
	{
		this.private_StartTrackTable(CurPage);
	}

	var Result = this.Internal_CheckBorders(X, Y, CurPage);
	if (-1 !== Result.Border)
	{
		var Transform = this.Get_ParentTextTransform();
		if (null !== Transform)
		{
			var dX = Math.abs(Transform.TransformPointX(0, 0) - Transform.TransformPointX(0, 1));
			var dY = Math.abs(Transform.TransformPointY(0, 0) - Transform.TransformPointY(0, 1));

			if (Math.abs(dY) > Math.abs(dX))
			{
				switch (Result.Border)
				{
					case 0:
					case 2:
						return this.DrawingDocument.SetCursorType("s-resize", new CMouseMoveData());
					case 1:
					case 3:
						return this.DrawingDocument.SetCursorType("w-resize", new CMouseMoveData());
				}
			}
			else
			{
				switch (Result.Border)
				{
					case 0:
					case 2:
						return this.DrawingDocument.SetCursorType("w-resize", new CMouseMoveData());
					case 1:
					case 3:
						return this.DrawingDocument.SetCursorType("s-resize", new CMouseMoveData());
				}
			}
		}
		else
		{
			switch (Result.Border)
			{
				case 0:
				case 2:
					return this.DrawingDocument.SetCursorType("s-resize", new CMouseMoveData());
				case 1:
				case 3:
					return this.DrawingDocument.SetCursorType("w-resize", new CMouseMoveData());
			}
		}
	}

	var Cell_Pos = this.Internal_GetCellByXY(X, Y, CurPage);
	var Cell     = this.Content[Cell_Pos.Row].Get_Cell(Cell_Pos.Cell);
	Cell.Content_Update_CursorType(X, Y, CurPage - Cell.Content.Get_StartPage_Relative());
};
CTable.prototype.Start_TrackTable = function()
{
	var CurPage = 0;
	while (CurPage < this.Pages.length)
	{
		if (true != this.Is_EmptyPage(CurPage))
			break;

		CurPage++;
	}

	this.private_StartTrackTable(CurPage);
};
CTable.prototype.DocumentStatistics = function(Stats)
{
	for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
	{
		var Row        = this.Content[CurRow];
		var CellsCount = Row.Get_CellsCount();

		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			Row.Get_Cell(CurCell).Content.DocumentStatistics(Stats);
		}
	}
};
CTable.prototype.Document_CreateFontMap = function(FontMap)
{
	for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
	{
		var Row        = this.Content[CurRow];
		var CellsCount = Row.Get_CellsCount();

		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			Row.Get_Cell(CurCell).Content_Document_CreateFontMap(FontMap);
		}
	}
};
CTable.prototype.Document_CreateFontCharMap = function(FontCharMap)
{
	for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
	{
		var Row        = this.Content[CurRow];
		var CellsCount = Row.Get_CellsCount();

		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			Row.Get_Cell(CurCell).Content.Document_CreateFontCharMap(0x00B7);
		}
	}
};
CTable.prototype.Document_Get_AllFontNames = function(AllFonts)
{
	for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
	{
		var Row        = this.Content[CurRow];
		var CellsCount = Row.Get_CellsCount();

		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			Row.Get_Cell(CurCell).Content.Document_Get_AllFontNames(AllFonts);
		}
	}
};
CTable.prototype.Document_UpdateInterfaceState = function()
{
	// Если у нас выделено несколько ячеек, тогда данная таблица - нижний уровень
	if (true != this.Selection.Use || table_Selection_Cell != this.Selection.Type)
	{
		this.CurCell.Content.Document_UpdateInterfaceState();
	}
	else
	{
		var ParaPr         = this.Get_Paragraph_ParaPr();
		ParaPr.CanAddTable = false;
		if (null != ParaPr)
			editor.UpdateParagraphProp(ParaPr);

		var TextPr = this.Get_Paragraph_TextPr();
		if (null != TextPr)
		{
			var theme = this.Get_Theme();
			if (theme && theme.themeElements && theme.themeElements.fontScheme)
			{
				if (TextPr.FontFamily)
				{
					TextPr.FontFamily.Name = theme.themeElements.fontScheme.checkFont(TextPr.FontFamily.Name);
				}
				if (TextPr.RFonts)
				{
					if (TextPr.RFonts.Ascii)
						TextPr.RFonts.Ascii.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.Ascii.Name);
					if (TextPr.RFonts.EastAsia)
						TextPr.RFonts.EastAsia.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.EastAsia.Name);
					if (TextPr.RFonts.HAnsi)
						TextPr.RFonts.HAnsi.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.HAnsi.Name);
					if (TextPr.RFonts.CS)
						TextPr.RFonts.CS.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.CS.Name);
				}
			}
			editor.UpdateTextPr(TextPr);
		}
	}
};
CTable.prototype.Document_UpdateRulersState = function(CurPage)
{
	if (CurPage < 0 || CurPage >= this.Pages.length)
		CurPage = 0;

	if (true == this.Selection.Use && table_Selection_Cell == this.Selection.Type)
	{
		this.Internal_Update_TableMarkup(this.Selection.EndPos.Pos.Row, this.Selection.EndPos.Pos.Cell, CurPage);
	}
	else
	{
		this.Internal_Update_TableMarkup(this.CurCell.Row.Index, this.CurCell.Index, CurPage);
		this.CurCell.Content.Document_UpdateRulersState(CurPage - this.CurCell.Content.Get_StartPage_Relative());
	}
};
CTable.prototype.Document_SetThisElementCurrent = function(bUpdateStates)
{
	this.Parent.Update_ContentIndexing();
	this.Parent.Set_CurrentElement(this.Index, bUpdateStates);
};
CTable.prototype.Can_CopyCut = function()
{
	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		return true;
	else
		return this.CurCell.Content.Can_CopyCut();
};
CTable.prototype.Set_Inline = function(Value)
{
	History.Add(new CChangesTableInline(this, this.Inline, Value));
	this.Inline = Value;
};
CTable.prototype.Is_Inline = function()
{
	if (this.Parent && true === this.Parent.Is_DrawingShape())
		return true;

	return this.Inline;
};
CTable.prototype.TurnOff_RecalcEvent = function()
{
	this.TurnOffRecalcEvent = true;
};
CTable.prototype.TurnOn_RecalcEvent = function()
{
	this.TurnOffRecalcEvent = false;
};
CTable.prototype.Set_ApplyToAll = function(bValue)
{
	this.ApplyToAll = bValue;
};
CTable.prototype.Get_ApplyToAll = function()
{
	return this.ApplyToAll;
};
/**
 * Функция, которую нужно вызвать перед удалением данного элемента
 */
CTable.prototype.PreDelete = function()
{
	this.DrawingDocument.EndTrackTable(this, false);

	var RowsCount = this.Content.length;
	for (var CurRow = 0; CurRow < RowsCount; CurRow++)
	{
		var Row = this.Content[CurRow];
		Row.PreDelete();
	}
};
CTable.prototype.Remove_InnerTable = function()
{
	this.CurCell.Content.Table_RemoveTable();
};
CTable.prototype.Table_Select = function(Type)
{
	if (true === this.Is_InnerTable())
	{
		this.CurCell.Content.Table_Select(Type);
		if (true === this.CurCell.Content.Is_SelectionUse())
		{
			this.Selection.Use   = true;
			this.Selection.Start = false;
			this.Selection.Type  = table_Selection_Text;
			this.Selection.Data  = null;
			this.Selection.Type2 = table_Selection_Common;
			this.Selection.Data2 = null;
		}

		return;
	}

	var NewSelectionData = [];

	switch (Type)
	{
		case c_oAscTableSelectionType.Table :
		{
			for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
			{
				var Row         = this.Content[CurRow];
				var Cells_Count = Row.Get_CellsCount();
				for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
				{
					var Cell   = Row.Get_Cell(CurCell);
					var Vmerge = Cell.Get_VMerge();

					if (vmerge_Continue === Vmerge)
						continue;

					NewSelectionData.push({Row : CurRow, Cell : CurCell});
				}
			}

			break;
		}

		case c_oAscTableSelectionType.Row :
		{
			var Rows_to_select = [];

			if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
			{
				var Row_prev = -1;
				for (var Index = 0; Index < this.Selection.Data.length; Index++)
				{
					var Pos = this.Selection.Data[Index];
					if (-1 === Row_prev || Row_prev != Pos.Row)
					{
						Rows_to_select.push(Pos.Row);
						Row_prev = Pos.Row;
					}
				}
			}
			else
			{
				Rows_to_select.push(this.CurCell.Row.Index);
			}

			for (var Index = 0; Index < Rows_to_select.length; Index++)
			{
				var Row         = this.Content[Rows_to_select[Index]];
				var Cells_Count = Row.Get_CellsCount();
				for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
				{
					var Cell   = Row.Get_Cell(CurCell);
					var Vmerge = Cell.Get_VMerge();
					if (vmerge_Continue === Vmerge)
						continue;

					NewSelectionData.push({Cell : CurCell, Row : Rows_to_select[Index]});
				}
			}

			break;
		}

		case c_oAscTableSelectionType.Column :
		{
			var Grid_start = -1;
			var Grid_end   = -1;

			if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
			{
				for (var Index = 0; Index < this.Selection.Data.length; Index++)
				{
					var Pos  = this.Selection.Data[Index];
					var Row  = this.Content[Pos.Row];
					var Cell = Row.Get_Cell(Pos.Cell);

					var StartGridCol = Row.Get_CellInfo(Pos.Cell).StartGridCol;
					var EndGridCol   = StartGridCol + Cell.Get_GridSpan() - 1;

					if (-1 === Grid_start || Grid_start > StartGridCol)
						Grid_start = StartGridCol;

					if (-1 === Grid_end || Grid_end < EndGridCol)
						Grid_end = EndGridCol;
				}
			}
			else
			{
				Grid_start = this.Content[this.CurCell.Row.Index].Get_CellInfo(this.CurCell.Index).StartGridCol;
				Grid_end   = Grid_start + this.CurCell.Get_GridSpan() - 1;
			}


			for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
			{
				var Row         = this.Content[CurRow];
				var Cells_Count = Row.Get_CellsCount();

				for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
				{
					var Cell   = Row.Get_Cell(CurCell);
					var Vmerge = Cell.Get_VMerge();
					if (vmerge_Continue === Vmerge)
						continue;

					var StartGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
					var EndGridCol   = StartGridCol + Cell.Get_GridSpan() - 1;

					if (EndGridCol >= Grid_start && StartGridCol <= Grid_end)
						NewSelectionData.push({Cell : CurCell, Row : CurRow});
				}
			}

			break;
		}

		case c_oAscTableSelectionType.Cell :
		default :
		{
			if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
				NewSelectionData = this.Selection.Data;
			else
				NewSelectionData.push({Row : this.CurCell.Row.Index, Cell : this.CurCell.Index});
			break;
		}
	}

	this.Selection.Use   = true;
	this.Selection.Start = false;
	this.Selection.Type  = table_Selection_Cell;
	this.Selection.Data  = NewSelectionData;
	this.Selection.Type2 = table_Selection_Common;
	this.Selection.Data2 = null;

	this.Selection.StartPos.Pos = {Row : NewSelectionData[0].Row, Cell : NewSelectionData[0].Cell};
	this.Selection.EndPos.Pos   = {
		Row  : NewSelectionData[NewSelectionData.length - 1].Row,
		Cell : NewSelectionData[NewSelectionData.length - 1].Cell
	};

};
CTable.prototype.Check_Split = function()
{
	if (true === this.Is_InnerTable())
		return this.CurCell.Content.Table_CheckSplit();

	// Разделение ячейки работает, только если выделена ровно одна ячейка.
	if (!( false === this.Selection.Use || ( true === this.Selection.Use && ( table_Selection_Text === this.Selection.Type || ( table_Selection_Cell === this.Selection.Type && 1 === this.Selection.Data.length  ) ) ) ))
		return false;

	return true;
};
CTable.prototype.Check_Merge = function()
{
	if (true === this.Is_InnerTable())
		return this.CurCell.Content.Table_CheckMerge();

	if (true != this.Selection.Use || table_Selection_Cell != this.Selection.Type || this.Selection.Data.length <= 1)
		return false;

	return this.Internal_CheckMerge().bCanMerge;
};
//----------------------------------------------------------------------------------------------------------------------
// Undo/Redo функции
//----------------------------------------------------------------------------------------------------------------------
CTable.prototype.Get_SelectionState = function()
{
	var TableState       = {};
	TableState.Selection = {
		Start    : this.Selection.Start,
		Use      : this.Selection.Use,
		StartPos : {
			Pos        : {Row : this.Selection.StartPos.Pos.Row, Cell : this.Selection.StartPos.Pos.Cell},
			X          : this.Selection.StartPos.X,
			Y          : this.Selection.StartPos.Y,
			PageIndex  : this.Selection.StartPos.PageIndex,
			MouseEvent : {
				// TODO : Если в MouseEvent будет использоваться что-то кроме ClickCount, Type и CtrlKey, добавить
				// здесь
				ClickCount : this.Selection.StartPos.MouseEvent.ClickCount,
				Type       : this.Selection.StartPos.MouseEvent.Type,
				CtrlKey    : this.Selection.StartPos.MouseEvent.CtrlKey
			}
		},
		EndPos   : {
			Pos        : {Row : this.Selection.EndPos.Pos.Row, Cell : this.Selection.EndPos.Pos.Cell},
			X          : this.Selection.EndPos.X,
			Y          : this.Selection.EndPos.Y,
			PageIndex  : this.Selection.EndPos.PageIndex,
			MouseEvent : {
				// TODO : Если в MouseEvent будет использоваться что-то кроме ClickCount, Type и CtrlKey, добавить
				// здесь
				ClickCount : this.Selection.EndPos.MouseEvent.ClickCount,
				Type       : this.Selection.EndPos.MouseEvent.Type,
				CtrlKey    : this.Selection.EndPos.MouseEvent.CtrlKey
			}
		},
		Type     : this.Selection.Type,
		Data     : null,
		Type2    : this.Selection.Type2,
		Data2    : null,
		CurRow   : this.Selection.CurRow
	};

	TableState.Selection.Data = [];
	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		for (var Index = 0; Index < this.Selection.Data.length; Index++)
			TableState.Selection.Data[Index] = {
				Row  : this.Selection.Data[Index].Row,
				Cell : this.Selection.Data[Index].Cell
			};
	}

	TableState.CurCell = {Row : this.CurCell.Row.Index, Cell : this.CurCell.Index};

	var State = this.CurCell.Content.Get_SelectionState()
	State.push(TableState);
	return State;
};
CTable.prototype.Set_SelectionState = function(State, StateIndex)
{
	if (State.length <= 0)
		return;

	var TableState = State[StateIndex];

	this.Selection = {
		Start    : TableState.Selection.Start,
		Use      : TableState.Selection.Use,
		StartPos : {
			Pos        : {
				Row  : TableState.Selection.StartPos.Pos.Row,
				Cell : TableState.Selection.StartPos.Pos.Cell
			},
			X          : TableState.Selection.StartPos.X,
			Y          : TableState.Selection.StartPos.Y,
			PageIndex  : TableState.Selection.StartPos.PageIndex,
			MouseEvent : {
				// TODO : Если в MouseEvent будет использоваться что-то кроме ClickCount, Type и CtrlKey, добавить
				// здесь
				ClickCount : TableState.Selection.StartPos.MouseEvent.ClickCount,
				Type       : TableState.Selection.StartPos.MouseEvent.Type,
				CtrlKey    : TableState.Selection.StartPos.MouseEvent.CtrlKey
			}
		},
		EndPos   : {
			Pos        : {Row : TableState.Selection.EndPos.Pos.Row, Cell : TableState.Selection.EndPos.Pos.Cell},
			X          : TableState.Selection.EndPos.X,
			Y          : TableState.Selection.EndPos.Y,
			PageIndex  : TableState.Selection.EndPos.PageIndex,
			MouseEvent : {
				// TODO : Если в MouseEvent будет использоваться что-то кроме ClickCount, Type и CtrlKey, добавить
				// здесь
				ClickCount : TableState.Selection.EndPos.MouseEvent.ClickCount,
				Type       : TableState.Selection.EndPos.MouseEvent.Type,
				CtrlKey    : TableState.Selection.EndPos.MouseEvent.CtrlKey
			}
		},
		Type     : TableState.Selection.Type,
		Data     : null,
		Type2    : TableState.Selection.Type2,
		Data2    : null,
		CurRow   : TableState.Selection.CurRow
	};

	this.Selection.Data = [];
	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		for (var Index = 0; Index < TableState.Selection.Data.length; Index++)
			this.Selection.Data[Index] = {
				Row  : TableState.Selection.Data[Index].Row,
				Cell : TableState.Selection.Data[Index].Cell
			};
	}

	this.CurCell = this.Content[TableState.CurCell.Row].Get_Cell(TableState.CurCell.Cell);
	this.CurCell.Content.Set_SelectionState(State, StateIndex - 1);
};
CTable.prototype.Get_ParentObject_or_DocumentPos = function()
{
	return this.Parent.Get_ParentObject_or_DocumentPos(this.Index);
};
CTable.prototype.Refresh_RecalcData = function(Data)
{
	var Type = Data.Type;

	var bNeedRecalc = false;
	var nRowIndex   = 0;

	switch (Type)
	{
		case AscDFH.historyitem_Table_TableShd:
		{
			break;
		}

		case AscDFH.historyitem_Table_TableW:
		case AscDFH.historyitem_Table_TableLayout:
		case AscDFH.historyitem_Table_TableCellMar:
		case AscDFH.historyitem_Table_TableAlign:
		case AscDFH.historyitem_Table_TableInd:
		case AscDFH.historyitem_Table_TableBorder_Left:
		case AscDFH.historyitem_Table_TableBorder_Right:
		case AscDFH.historyitem_Table_TableBorder_Top:
		case AscDFH.historyitem_Table_TableBorder_Bottom:
		case AscDFH.historyitem_Table_TableBorder_InsideH:
		case AscDFH.historyitem_Table_TableBorder_InsideV:
		case AscDFH.historyitem_Table_Inline:
		case AscDFH.historyitem_Table_AllowOverlap:
		case AscDFH.historyitem_Table_PositionH:
		case AscDFH.historyitem_Table_PositionV:
		case AscDFH.historyitem_Table_Distance:
		case AscDFH.historyitem_Table_TableStyleColBandSize:
		case AscDFH.historyitem_Table_TableStyleRowBandSize:
		case AscDFH.historyitem_Table_Pr:
		{
			bNeedRecalc = true;
			break;
		}
		case AscDFH.historyitem_Table_AddRow:
		case AscDFH.historyitem_Table_RemoveRow:
		{
			bNeedRecalc = true;
			nRowIndex   = Data.Pos;
			break;
		}
		case AscDFH.historyitem_Table_TableGrid:
		{
			bNeedRecalc = true;
			break;
		}
		case AscDFH.historyitem_Table_TableStyle:
		case AscDFH.historyitem_Table_TableLook:
		{
			var Count = this.Content.length;
			for (var CurRow = 0; CurRow < Count; CurRow++)
			{
				var Row         = this.Content[CurRow];
				var Cells_Count = Row.Get_CellsCount();
				for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
				{
					var Cell = Row.Get_Cell(CurCell);
					Cell.Recalc_CompiledPr();
				}
				Row.Recalc_CompiledPr();
			}
			this.Recalc_CompiledPr();
			bNeedRecalc = true;
			break;
		}
	}

	this.RecalcInfo.Recalc_AllCells();
	this.RecalcInfo.Recalc_Borders();

	if (true === bNeedRecalc)
	{
		History.Add_RecalcTableGrid(this.Get_Id());
		this.Refresh_RecalcData2(nRowIndex, 0);
	}
};
CTable.prototype.Refresh_RecalcData2 = function(RowIndex, Page_rel)
{
	// Если Index < 0, значит данный элемент еще не был добавлен в родительский класс
	if (this.Index >= 0)
	{
		var _RowIndex = Math.min(RowIndex, this.RowsInfo.length - 1);
		var _Page_rel = ( _RowIndex < 0 ? this.PageNum : Page_rel + this.PageNum );
		this.Parent.Refresh_RecalcData2(this.Index, _Page_rel);
	}
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//----------------------------------------------------------------------------------------------------------------------
CTable.prototype.Write_ToBinary2 = function(Writer)
{
	Writer.WriteLong(AscDFH.historyitem_type_Table);

	// Long               : type_Table
	// String             : Id самой таблицы
	// String             : Id стиля (если стока пустая, то null)
	// Bool               : Inline
	// Long               : количество элементов в TableGrid
	// Array of doubles   : массив TableGrid
	// Double             : X_origin
	// Double             : X
	// Double             : Y
	// Double             : XLimit
	// Double             : YLimit
	// Variable           : свойства таблицы (TablePr)
	// Long               : количество строк
	// Array of Strings   : массив Id строк

	Writer.WriteLong(type_Table);
	Writer.WriteString2(this.Id);
	Writer.WriteString2(null === this.TableStyle ? "" : this.TableStyle);
	Writer.WriteBool(this.Inline);

	var GridCount = this.TableGrid.length;
	Writer.WriteLong(GridCount);
	for (var Index = 0; Index < GridCount; Index++)
		Writer.WriteDouble(this.TableGrid[Index]);

	Writer.WriteDouble(this.X_origin);
	Writer.WriteDouble(this.X);
	Writer.WriteDouble(this.Y);
	Writer.WriteDouble(this.XLimit);
	Writer.WriteDouble(this.YLimit);

	this.Pr.Write_ToBinary(Writer);

	var RowsCount = this.Content.length;
	Writer.WriteLong(RowsCount);
	for (var Index = 0; Index < RowsCount; Index++)
		Writer.WriteString2(this.Content[Index].Get_Id());
	Writer.WriteBool(this.bPresentation);
};
CTable.prototype.Read_FromBinary2 = function(Reader)
{
	// Long               : type_Table
	// String             : Id самой таблицы
	// String             : Id стиля (если стока пустая, то null)
	// Bool               : Inline
	// Long               : количество элементов в TableGrid
	// Array of doubles   : массив TableGrid
	// Double             : X_origin
	// Double             : X
	// Double             : Y
	// Double             : XLimit
	// Double             : YLimit
	// Variable           : свойства таблицы (TablePr)
	// Long               : количество строк
	// Array of Strings   : массив Id строк

	this.Prev = null;
	this.Next = null;

	Reader.GetLong();
	this.Id = Reader.GetString2();

	var TableStyleId = Reader.GetString2();
	this.TableStyle  = ( TableStyleId === "" ? null : TableStyleId );

	this.Inline = Reader.GetBool();

	var GridCount  = Reader.GetLong();
	this.TableGrid = [];
	for (var Index = 0; Index < GridCount; Index++)
		this.TableGrid.push(Reader.GetDouble());

	this.X_origin = Reader.GetDouble();
	this.X        = Reader.GetDouble();
	this.Y        = Reader.GetDouble();
	this.XLimit   = Reader.GetDouble();
	this.YLimit   = Reader.GetDouble();

	this.Pr = new CTablePr();
	this.Pr.Read_FromBinary(Reader);
	this.Recalc_CompiledPr();

	var Count    = Reader.GetLong();
	this.Content = [];
	for (var Index = 0; Index < Count; Index++)
	{
		var Row = g_oTableId.Get_ById(Reader.GetString2());
		this.Content.push(Row);
	}
	this.bPresentation = Reader.GetBool();

	this.Internal_ReIndexing();

	AscCommon.CollaborativeEditing.Add_NewObject(this);

	var DrawingDocument = editor.WordControl.m_oDrawingDocument;
	if (undefined !== DrawingDocument && null !== DrawingDocument)
	{
		this.DrawingDocument = DrawingDocument;
		this.LogicDocument   = this.DrawingDocument.m_oLogicDocument;
	}

	// Добавляем, чтобы в конце выставить CurCell
	var LinkData     = {};
	LinkData.CurCell = true;
	AscCommon.CollaborativeEditing.Add_LinkData(this, LinkData);
};
CTable.prototype.Load_LinkData = function(LinkData)
{
	if ("undefined" != typeof(LinkData) && "undefined" != typeof(LinkData.CurCell))
	{
		if (this.Content.length > 0 && this.Content[0].Get_CellsCount() > 0)
			this.CurCell = this.Content[0].Get_Cell(0);
	}
};
CTable.prototype.Get_SelectionState2 = function()
{
	var TableState = {};

	TableState.Id = this.Get_Id();

	TableState.CellId = ( null !== this.CurCell ? this.CurCell.Get_Id() : null );
	TableState.Data   = ( null !== this.CurCell ? this.CurCell.Content.Get_SelectionState2() : null );

	return TableState;
};
CTable.prototype.Set_SelectionState2 = function(TableState)
{
	var CellId = TableState.CellId;

	var CurCell = null;
	var Pos     = {Cell : 0, Row : 0};

	var RowsCount = this.Content.length;
	for (var RowIndex = 0; RowIndex < RowsCount; RowIndex++)
	{
		var Row        = this.Content[RowIndex];
		var CellsCount = Row.Get_CellsCount();
		for (var CellIndex = 0; CellIndex < CellsCount; CellIndex++)
		{
			var Cell = Row.Get_Cell(CellIndex);

			if (Cell.Get_Id() === CellId)
			{
				CurCell = Cell;

				Pos.Cell = CellIndex;
				Pos.Row  = RowIndex;

				break;
			}
		}

		if (null !== CurCell)
			break;
	}

	if (null == CurCell)
	{
		this.Cursor_MoveToStartPos(false);
	}
	else
	{
		this.CurCell = CurCell;

		this.Selection.Start        = false;
		this.Selection.Use          = false;
		this.Selection.StartPos.Pos = {Row : Pos.Row, Cell : Pos.Cell};
		this.Selection.EndPos.Pos   = {Row : Pos.Row, Cell : Pos.Cell};
		this.Selection.Type         = table_Selection_Common;
		this.Selection.Type2        = table_Selection_Common;
		this.Selection.Data         = null;
		this.Selection.Data2        = null;
		this.Selection.CurRow       = 0;

		this.CurCell.Content.Set_SelectionState2(TableState.Data);
	}
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с гиперссылками
//----------------------------------------------------------------------------------------------------------------------
CTable.prototype.Hyperlink_Add = function(HyperProps)
{
	// Выделения по ячейкам быть не должно
	return this.CurCell.Content.Hyperlink_Add(HyperProps);
};
CTable.prototype.Hyperlink_Modify = function(HyperProps)
{
	if (false === this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
		this.CurCell.Content.Hyperlink_Modify(HyperProps);

	return false;
};
CTable.prototype.Hyperlink_Remove = function()
{
	if (false === this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
		this.CurCell.Content.Hyperlink_Remove();
};
CTable.prototype.Hyperlink_CanAdd = function(bCheckInHyperlink)
{
	if (false === this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
		return this.CurCell.Content.Hyperlink_CanAdd(bCheckInHyperlink);

	return false;
};
CTable.prototype.Hyperlink_Check = function(bCheckEnd)
{
	if (false === this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
		return this.CurCell.Content.Hyperlink_Check(bCheckEnd);

	return null;
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с комментариями
//----------------------------------------------------------------------------------------------------------------------
CTable.prototype.Add_Comment = function(Comment, bStart, bEnd)
{
	if (true === this.ApplyToAll)
	{
		var RowsCount  = this.Content.length;
		var CellsCount = this.Content[RowsCount - 1].Get_CellsCount();

		if (true === bStart && true === bEnd && RowsCount <= 1 && CellsCount <= 1)
		{
			var Cell_Content = this.Content[0].Get_Cell(0).Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell_Content.Add_Comment(Comment, true, true);
			Cell_Content.Set_ApplyToAll(false);
		}
		else
		{
			if (true === bStart)
			{
				var Cell_Content = this.Content[0].Get_Cell(0).Content;
				Cell_Content.Set_ApplyToAll(true);
				Cell_Content.Add_Comment(Comment, true, false);
				Cell_Content.Set_ApplyToAll(false);
			}

			if (true === bEnd)
			{
				var Cell_Content = this.Content[RowsCount - 1].Get_Cell(CellsCount - 1).Content;
				Cell_Content.Set_ApplyToAll(true);
				Cell_Content.Add_Comment(Comment, false, true);
				Cell_Content.Set_ApplyToAll(false);
			}

			// TODO: Пока нам приходится пересчитывать ячейки после добавления комментариев. Как только
			//       избавимся от этого, то надо будет переделать здесь.

			var RowsCount = this.Content.length;
			for (var RowIndex = 0; RowIndex < RowsCount; RowIndex++)
			{
				var Row        = this.Content[RowIndex];
				var CellsCount = Row.Get_CellsCount();

				for (var CellIndex = 0; CellIndex < CellsCount; CellIndex++)
				{
					var Cell = Row.Get_Cell(CellIndex);
					this.RecalcInfo.Add_Cell(Cell);
				}
			}
		}
	}
	else
	{
		if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		{
			if (true === bStart && true === bEnd && this.Selection.Data.length <= 1)
			{
				var Pos          = this.Selection.Data[0];
				var Cell_Content = this.Content[Pos.Row].Get_Cell(Pos.Cell).Content;
				Cell_Content.Set_ApplyToAll(true);
				Cell_Content.Add_Comment(Comment, true, true);
				Cell_Content.Set_ApplyToAll(false);
			}
			else
			{
				var StartPos = null, EndPos = null;

				if (true === bStart)
				{
					StartPos         = this.Selection.Data[0];
					var Cell_Content = this.Content[StartPos.Row].Get_Cell(StartPos.Cell).Content;
					Cell_Content.Set_ApplyToAll(true);
					Cell_Content.Add_Comment(Comment, true, false);
					Cell_Content.Set_ApplyToAll(false);
				}

				if (true === bEnd)
				{
					EndPos           = this.Selection.Data[this.Selection.Data.length - 1];
					var Cell_Content = this.Content[EndPos.Row].Get_Cell(EndPos.Cell).Content;
					Cell_Content.Set_ApplyToAll(true);
					Cell_Content.Add_Comment(Comment, false, true);
					Cell_Content.Set_ApplyToAll(false);
				}

				// TODO: Пока нам приходится пересчитывать ячейки после добавления комментариев. Как только
				//       избавимся от этого, то надо будет переделать здесь.

				var StartRow = 0, EndRow = -1, StartCell = 0, EndCell = -1;
				if (null !== StartPos && null !== EndPos)
				{
					StartRow  = StartPos.Row;
					EndRow    = EndPos.Row;
					StartCell = StartPos.Cell;
					EndCell   = EndPos.Cell;
				}
				else if (null !== StartPos)
				{
					StartRow  = StartPos.Row;
					StartCell = StartPos.Cell;
					EndRow    = this.Content.length - 1;
					EndCell   = this.Content[EndRow].Get_CellsCount() - 1;
				}
				else if (null !== EndPos)
				{
					StartRow  = 0;
					StartCell = 0;
					EndRow    = EndPos.Row;
					EndCell   = EndPos.Cell;
				}

				for (var RowIndex = StartRow; RowIndex <= EndRow; RowIndex++)
				{
					var Row = this.Content[RowIndex];

					var _StartCell = ( RowIndex === StartRow ? StartCell : 0 );
					var _EndCell   = ( RowIndex === EndRow ? EndCell : Row.Get_CellsCount() - 1 );

					for (var CellIndex = _StartCell; CellIndex <= _EndCell; CellIndex++)
					{
						var Cell = Row.Get_Cell(CellIndex);
						this.RecalcInfo.Add_Cell(Cell);
					}
				}
			}
		}
		else
		{
			this.CurCell.Content.Add_Comment(Comment, bStart, bEnd);
		}
	}
};
CTable.prototype.CanAdd_Comment = function()
{
	if (true === this.ApplyToAll)
	{
		if (this.Content.length > 1 || this.Content[0].Get_CellsCount() > 1)
			return true;

		this.Content[0].Get_Cell(0).Content.Set_ApplyToAll(true);
		var Result = this.Content[0].Get_Cell(0).Content.CanAdd_Comment();
		this.Content[0].Get_Cell(0).Content.Set_ApplyToAll(false);
		return Result;
	}
	else
	{
		if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		{
			if (this.Selection.Data.length > 1)
				return true;
			else
			{
				var Pos  = this.Selection.Data[0];
				var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
				return Cell.Content.CanAdd_Comment();
			}
		}
		else
			return this.CurCell.Content.CanAdd_Comment();
	}
};
CTable.prototype.Can_IncreaseParagraphLevel = function(bIncrease)
{
	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		if (this.Selection.Data.length > 0)
		{
			var Data = this.Selection.Data;
			for (var i = 0; i < Data.length; ++i)
			{
				var Pos          = Data[i];
				var Cell_Content = this.Content[Pos.Row].Get_Cell(Pos.Cell).Content;
				if (Cell_Content)
				{
					Cell_Content.Set_ApplyToAll(true);
					var bCan = Cell_Content.Can_IncreaseParagraphLevel(bIncrease);
					Cell_Content.Set_ApplyToAll(false);
					if (!bCan)
					{
						return false;
					}
				}
			}
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		this.CurCell.Content.Can_IncreaseParagraphLevel(bIncrease);
	}
};
CTable.prototype.Get_SelectionBounds = function()
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();

		var StartPos = Cells_array[0];

		var Row  = this.Content[StartPos.Row];
		var Cell = Row.Get_Cell(StartPos.Cell);

		var X0 = Cell.Metrics.X_cell_start;
		var X1 = Cell.Metrics.X_cell_end;

		var CurPage = this.RowsInfo[StartPos.Row].StartPage;

		var Y = this.RowsInfo[StartPos.Row].Y[CurPage];
		var H = this.RowsInfo[StartPos.Row].H[CurPage];

		var TableX = this.Pages[CurPage].X + this.RowsInfo[StartPos.Row].X0;

		var BeginRect = {X : TableX + X0, Y : Y, W : X1 - X0, H : H, Page : CurPage + this.Get_StartPage_Absolute()};

		var EndPos = Cells_array[Cells_array.length - 1];

		Row  = this.Content[EndPos.Row];
		Cell = Row.Get_Cell(EndPos.Cell);

		X0 = Cell.Metrics.X_cell_start;
		X1 = Cell.Metrics.X_cell_end;

		CurPage = this.RowsInfo[EndPos.Row].StartPage + this.RowsInfo[EndPos.Row].Pages - 1;

		Y = this.RowsInfo[EndPos.Row].Y[CurPage];
		H = this.RowsInfo[EndPos.Row].H[CurPage];

		var Direction = 1;
		if (this.Selection.StartPos.Pos.Row < this.Selection.EndPos.Pos.Row || (this.Selection.StartPos.Pos.Row === this.Selection.EndPos.Pos.Row && this.Selection.StartPos.Pos.Cell <= this.Selection.EndPos.Pos.Cell))
			Direction = 1;
		else
			Direction = -1;

		var EndRect = {X : TableX + X0, Y : Y, W : X1 - X0, H : H, Page : CurPage + this.Get_StartPage_Absolute()};

		return {Start : BeginRect, End : EndRect, Direction : Direction};
	}
	else
	{
		return this.CurCell.Content.Get_SelectionBounds();
	}
};
CTable.prototype.Get_SelectionAnchorPos = function()
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();

		var Pos  = Cells_array[0];
		var Row  = this.Content[Pos.Row];
		var Cell = Row.Get_Cell(Pos.Cell);

		var X0 = Cell.Metrics.X_cell_start;
		var X1 = Cell.Metrics.X_cell_end;

		var Y    = this.RowsInfo[Pos.Row].Y[this.RowsInfo[Pos.Row].StartPage];
		var Page = this.RowsInfo[Pos.Row].StartPage + this.Get_StartPage_Absolute();

		return {X0 : X0, X1 : X1, Y : Y, Page : Page};
	}
	else
	{
		return this.CurCell.Content.Get_SelectionAnchorPos();
	}
};
//----------------------------------------------------------------------------------------------------------------------
// Работаем с текущей позицией и селектом таблицы
//----------------------------------------------------------------------------------------------------------------------
CTable.prototype.Cursor_MoveAt = function(X, Y, bLine, bDontChangeRealPos, CurPage)
{
	var Pos  = this.Internal_GetCellByXY(X, Y, CurPage);
	var Row  = this.Content[Pos.Row];
	var Cell = Row.Get_Cell(Pos.Cell);

	this.Selection.Type         = table_Selection_Text;
	this.Selection.Type2        = table_Selection_Common;
	this.Selection.StartPos.Pos = {Row : Pos.Row, Cell : Pos.Cell};
	this.Selection.EndPos.Pos   = {Row : Pos.Row, Cell : Pos.Cell};
	this.Selection.CurRow       = Pos.Row;

	// Устанавливаем найденную ячейку текущей и перемещаемся в контент ячейки по координатам X,Y
	this.CurCell = Cell;
	this.DrawingDocument.TargetStart();
	this.DrawingDocument.TargetShow();
	this.CurCell.Content_Cursor_MoveAt(X, Y, false, true, CurPage - this.CurCell.Content.Get_StartPage_Relative());
	if (this.LogicDocument)
	{
		this.LogicDocument.RecalculateCurPos();
	}
};
CTable.prototype.Selection_SetStart = function(X, Y, CurPage, MouseEvent)
{
	if (CurPage < 0 || CurPage >= this.Pages.length)
		CurPage = 0;

	var Page = this.Pages[CurPage];

	var Result = this.Internal_CheckBorders(X, Y, CurPage);

	var Pos = Result.Pos;
	if (-1 === Result.Border)
	{
		var bInnerTableBorder = ( null != this.Is_TableBorder(X, Y, CurPage) ? true : false );
		if (true === bInnerTableBorder)
		{
			// Значит двигается граница внутренней таблицы, мы не должны отменять селект
			var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
			Cell.Content_Selection_SetStart(X, Y, CurPage - Cell.Content.Get_StartPage_Relative(), MouseEvent);

			this.Selection.Type2 = table_Selection_Border_InnerTable;
			this.Selection.Data2 = Cell;
		}
		else
		{
			this.Selection_Remove();

			this.CurCell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
			this.CurCell.Content_Selection_SetStart(X, Y, CurPage - this.CurCell.Content.Get_StartPage_Relative(), MouseEvent);

			this.Selection.Use   = true;
			this.Selection.Start = true;
			this.Selection.Type  = table_Selection_Text;
			this.Selection.Type2 = table_Selection_Common;
			this.Selection.Data2 = null;

			this.Selection.StartPos.Pos        = Pos;
			this.Selection.StartPos.X          = X;
			this.Selection.StartPos.Y          = Y;
			this.Selection.StartPos.PageIndex  = CurPage;
			this.Selection.StartPos.MouseEvent =
				{
					// TODO : Если в MouseEvent будет использоваться что-то кроме ClickCount, Type и CtrlKey, добавить
					// здесь
					ClickCount : MouseEvent.ClickCount,
					Type       : MouseEvent.Type,
					CtrlKey    : MouseEvent.CtrlKey
				};
		}
	}
	else
	{
		this.Internal_Update_TableMarkup(Pos.Row, Pos.Cell, CurPage);
		this.Selection.Type2         = table_Selection_Border;
		this.Selection.Data2         = {};
		this.Selection.Data2.PageNum = CurPage;

		var Row = this.Content[Pos.Row];

		var _X = X;
		var _Y = Y;

		if (0 === Result.Border || 2 === Result.Border)
		{
			var PageH = this.LogicDocument.Get_PageLimits(this.Get_StartPage_Absolute()).YLimit;

			var Y_min = 0;
			var Y_max = PageH;

			this.Selection.Data2.bCol = false;

			var Row_start = this.Pages[CurPage].FirstRow;
			var Row_end   = this.Pages[CurPage].LastRow;
			if (0 === Result.Border)
				this.Selection.Data2.Index = Pos.Row - Row_start;
			else
				this.Selection.Data2.Index = Result.Row - Row_start + 1;

			if (0 != this.Selection.Data2.Index)
			{
				var TempRow = this.Selection.Data2.Index + Row_start - 1;
				Y_min       = this.RowsInfo[TempRow].Y[CurPage];
			}

			// Подправим Y, чтобы первоначально точно по границе проходила линия
			if (this.Selection.Data2.Index !== Row_end - Row_start + 1)
				_Y = this.RowsInfo[this.Selection.Data2.Index + Row_start].Y[CurPage];
			else
				_Y = this.RowsInfo[this.Selection.Data2.Index + Row_start - 1].Y[CurPage] + this.RowsInfo[this.Selection.Data2.Index + Row_start - 1].H[CurPage];

			this.Selection.Data2.Min = Y_min;
			this.Selection.Data2.Max = Y_max;

			this.Selection.Data2.Pos =
				{
					Row  : Pos.Row,
					Cell : Pos.Cell
				};

			if (null != this.Selection.Data2.Min)
				_Y = Math.max(_Y, this.Selection.Data2.Min);

			if (null != this.Selection.Data2.Max)
				_Y = Math.min(_Y, this.Selection.Data2.Max);
		}
		else
		{
			var CellsCount  = Row.Get_CellsCount();
			var CellSpacing = ( null === Row.Get_CellSpacing() ? 0 : Row.Get_CellSpacing() );
			var X_min       = null;
			var X_max       = null;

			this.Selection.Data2.bCol = true;
			if (3 === Result.Border)
				this.Selection.Data2.Index = Pos.Cell;
			else
				this.Selection.Data2.Index = Pos.Cell + 1;

			if (0 != this.Selection.Data2.Index)
			{
				var Margins = Row.Get_Cell(this.Selection.Data2.Index - 1).Get_Margins();
				if (0 != this.Selection.Data2.Index - 1 && this.Selection.Data2.Index != CellsCount)
					X_min = Page.X + Row.Get_CellInfo(this.Selection.Data2.Index - 1).X_grid_start + Margins.Left.W + Margins.Right.W + CellSpacing;
				else
					X_min = Page.X + Row.Get_CellInfo(this.Selection.Data2.Index - 1).X_grid_start + Margins.Left.W + Margins.Right.W + 1.5 * CellSpacing;
			}

			if (CellsCount != this.Selection.Data2.Index)
			{
				var Margins = Row.Get_Cell(this.Selection.Data2.Index).Get_Margins();
				if (CellsCount - 1 != this.Selection.Data2.Index)
					X_max = Page.X + Row.Get_CellInfo(this.Selection.Data2.Index).X_grid_end - (Margins.Left.W + Margins.Right.W + CellSpacing);
				else
					X_max = Page.X + Row.Get_CellInfo(this.Selection.Data2.Index).X_grid_end - (Margins.Left.W + Margins.Right.W + 1.5 * CellSpacing);
			}

			// Подправим значение по X, чтобы первоначально точно по границе проходила линия
			if (CellsCount != this.Selection.Data2.Index)
				_X = Page.X + Row.Get_CellInfo(this.Selection.Data2.Index).X_grid_start;
			else
				_X = Page.X + Row.Get_CellInfo(this.Selection.Data2.Index - 1).X_grid_end;

			this.Selection.Data2.Min = X_min;
			this.Selection.Data2.Max = X_max;

			this.Selection.Data2.Pos =
				{
					Row  : Pos.Row,
					Cell : Pos.Cell
				};

			if (null != this.Selection.Data2.Min)
				_X = Math.max(_X, this.Selection.Data2.Min);

			if (null != this.Selection.Data2.Max)
				_X = Math.min(_X, this.Selection.Data2.Max);
		}

		this.Selection.Data2.X = _X;
		this.Selection.Data2.Y = _Y;

		this.Selection.Data2.StartCX = _X; // Начальная позиция скорректированная относительно положения границы
		this.Selection.Data2.StartCY = _Y;
		this.Selection.Data2.StartX  = X; // Начальная позиция нажатия мыши (без корректировки)
		this.Selection.Data2.StartY  = Y;
		this.Selection.Data2.Start   = true;

		this.DrawingDocument.LockCursorTypeCur();
	}
};
CTable.prototype.Selection_SetEnd = function(X, Y, CurPage, MouseEvent)
{
	var TablePr = this.Get_CompiledPr(false).TablePr;
	if (CurPage < 0 || CurPage >= this.Pages.length)
		CurPage = 0;

	var Page = this.Pages[CurPage];
	if (this.Selection.Type2 === table_Selection_Border)
	{
		if (true === editor.isViewMode || this.Selection.Data2.PageNum != CurPage)
			return;

		var _X = X;
		var _Y = Y;

		// Проверяем, случайное нажатие на границу. (т.е. случайное однократное нажатие или с малым смещением)
		if (true !== this.Selection.Data2.Start || Math.abs(X - this.Selection.Data2.StartX) > 0.05 || Math.abs(Y - this.Selection.Data2.StartY) > 0.05)
		{
			_X                         = this.DrawingDocument.CorrectRulerPosition(X);
			_Y                         = this.DrawingDocument.CorrectRulerPosition(Y);
			this.Selection.Data2.Start = false;
		}
		else
		{
			_X = this.Selection.Data2.X;
			_Y = this.Selection.Data2.Y;
		}

		if (true === this.Selection.Data2.bCol)
			_X = this.private_UpdateTableRulerOnBorderMove(_X);
		else
			_Y = this.private_UpdateTableRulerOnBorderMove(_Y);

		this.Selection.Data2.X = _X;
		this.Selection.Data2.Y = _Y;

		if (MouseEvent.Type === AscCommon.g_mouse_event_type_up)
		{
			// Обрабатываем случай, когда граница не изменила своего первоначального положения
			if (Math.abs(_X - this.Selection.Data2.StartCX) < 0.001 && Math.abs(_Y - this.Selection.Data2.StartCY) < 0.001)
			{
				this.Selection.Type2 = table_Selection_Common;
				this.Selection.Data2 = null;

				return;
			}

			var LogicDocument = (editor && true !== editor.isViewMode ? editor.WordControl.m_oLogicDocument : null);
			if (LogicDocument && false === LogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_None, {
					Type      : AscCommon.changestype_2_Element_and_Type,
					Element   : this,
					CheckType : AscCommon.changestype_Table_Properties
				}))
			{
				History.Create_NewPoint(AscDFH.historydescription_Document_MoveTableBorder);

				if (true === this.Selection.Data2.bCol)
				{
					// Найдем колонку в TableGrid, с которой мы работаем
					var Index  = this.Selection.Data2.Index;
					var CurRow = this.Selection.Data2.Pos.Row;
					var Row    = this.Content[CurRow];

					var Col = 0;

					// границ на 1 больше, чем самих ячеек в строке
					if (Index === this.Markup.Cols.length)
						Col = Row.Get_CellInfo(Index - 1).StartGridCol + Row.Get_Cell(Index - 1).Get_GridSpan();
					else
						Col = Row.Get_CellInfo(Index).StartGridCol;

					var Dx = _X - (Page.X + this.TableSumGrid[Col - 1]);

					// Строим новую секту для таблицы
					var Rows_info = [];

					// Если граница, которую мы двигаем не попадает в селект, тогда работает, как будто селекта и нет
					var bBorderInSelection = false;
					if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 && !this.bPresentation)
					{
						var CellsFlag = [];
						for (CurRow = 0; CurRow < this.Content.length; CurRow++)
						{
							CellsFlag[CurRow] = [];
							Row               = this.Content[CurRow];
							var CellsCount    = Row.Get_CellsCount();
							for (var CurCell = 0; CurCell < CellsCount; CurCell++)
							{
								CellsFlag[CurRow][CurCell] = 0;
							}
						}

						var CurSelectedCell  = this.Selection.Data[0];
						var CurSelectedIndex = 0;
						for (CurRow = 0; CurRow < this.Content.length; CurRow++)
						{
							Row            = this.Content[CurRow];
							var CellsCount = Row.Get_CellsCount();
							for (var CurCell = 0; CurCell < CellsCount; CurCell++)
							{
								if (CurSelectedCell.Cell === CurCell && CurSelectedCell.Row === CurRow)
								{
									CellsFlag[CurRow][CurCell] = 1;

									var StartGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
									var GridSpan     = Row.Get_Cell(CurCell).Get_GridSpan();
									var VMergeCount  = this.Internal_GetVertMergeCount(CurRow, StartGridCol, GridSpan);

									if (CurRow === this.Selection.Data2.Pos.Row && Col >= StartGridCol && Col <= StartGridCol + GridSpan)
										bBorderInSelection = true;

									for (var TempIndex = 1; TempIndex < VMergeCount; TempIndex++)
									{
										var TempCell = this.Internal_Get_Cell_ByStartGridCol(CurRow + TempIndex, StartGridCol);
										if (-1 != TempCell)
										{
											CellsFlag[CurRow + TempIndex][TempCell] = 1;

											if (CurRow + TempIndex === this.Selection.Data2.Pos.Row && Col >= StartGridCol && Col <= StartGridCol + GridSpan)
												bBorderInSelection = true;
										}
									}

									if (CurSelectedIndex < this.Selection.Data.length - 1)
										CurSelectedCell = this.Selection.Data[++CurSelectedIndex];
									else
										CurSelectedCell = {Row : -1, Cell : -1};
								}
							}
						}

					}

					var OldTableInd = TablePr.TableInd;
					var NewTableInd = TablePr.TableInd;
					if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && true === bBorderInSelection && !this.bPresentation)
					{
						var BeforeFlag   = false;
						var BeforeSpace2 = null;
						if (0 === Col)
						{
							BeforeSpace2 = _X - Page.X;

							if (BeforeSpace2 < 0)
							{
								this.Set_TableW(tblwidth_Auto, 0);
								Page.X += BeforeSpace2;

								if (true === this.Is_Inline())
									NewTableInd = NewTableInd + BeforeSpace2;
								else
									this.Internal_UpdateFlowPosition(Page.X, Page.Y);
							}
						}

						var BeforeSpace = null;
						if (0 === Index && 0 != Col && _X < Page.X)
						{
							BeforeSpace = Page.X - _X;
							Page.X -= BeforeSpace;
							this.Set_TableW(tblwidth_Auto, 0);

							if (true === this.Is_Inline())
								NewTableInd = NewTableInd - BeforeSpace;
							else
								this.Internal_UpdateFlowPosition(Page.X, Page.Y);
						}

						if (Index === this.Markup.Cols.length)
							this.Set_TableW(tblwidth_Auto, 0);

						for (CurRow = 0; CurRow < this.Content.length; CurRow++)
						{
							Rows_info[CurRow] = [];
							Row               = this.Content[CurRow];
							var Before_Info   = Row.Get_Before();

							var WBefore = 0;

							if (null === BeforeSpace2)
							{
								if (Before_Info.GridBefore > 0 && Col === Before_Info.GridBefore && 1 === CellsFlag[CurRow][0])
									WBefore = this.TableSumGrid[Before_Info.GridBefore - 1] + Dx;
								else
								{
									if (null != BeforeSpace)
										WBefore = this.TableSumGrid[Before_Info.GridBefore - 1] + BeforeSpace;
									else
										WBefore = this.TableSumGrid[Before_Info.GridBefore - 1];
								}
							}
							else
							{
								if (BeforeSpace2 > 0)
								{
									if (0 === Before_Info.GridBefore && 1 === CellsFlag[CurRow][0])
										WBefore = BeforeSpace2;
									else if (0 != Before_Info.GridBefore)
										WBefore = this.TableSumGrid[Before_Info.GridBefore - 1];
								}
								else
								{
									if (0 === Before_Info.GridBefore && 1 != CellsFlag[CurRow][0])
										WBefore = -BeforeSpace2;
									else if (0 != Before_Info.GridBefore)
										WBefore = -BeforeSpace2 + this.TableSumGrid[Before_Info.GridBefore - 1];
								}
							}

							if (WBefore > 0.001)
								Rows_info[CurRow].push({W : WBefore, Type : -1, GridSpan : 1});


							var CellsCount = Row.Get_CellsCount();
							var TempDx     = Dx;
							for (var CurCell = 0; CurCell < CellsCount; CurCell++)
							{
								var Cell           = Row.Get_Cell(CurCell);
								var CellMargins    = Cell.Get_Margins();
								var Cur_Grid_start = Row.Get_CellInfo(CurCell).StartGridCol;
								var Cur_Grid_end   = Cur_Grid_start + Cell.Get_GridSpan() - 1;

								var W = 0;
								if (Cur_Grid_end + 1 === Col && ( 1 === CellsFlag[CurRow][CurCell] || ( CurCell + 1 < CellsCount && 1 === CellsFlag[CurRow][CurCell + 1] ) ))
									W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1] + Dx;
								else if (Cur_Grid_start === Col && ( 1 === CellsFlag[CurRow][CurCell] || ( CurCell > 0 && 1 === CellsFlag[CurRow][CurCell - 1] ) ))
									W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1] - TempDx;
								else
									W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1];

								W = Math.max(1, Math.max(W, CellMargins.Left.W + CellMargins.Right.W));
								if (Cur_Grid_end + 1 === Col && ( 1 === CellsFlag[CurRow][CurCell] || ( CurCell + 1 < CellsCount && 1 === CellsFlag[CurRow][CurCell + 1] ) ))
									TempDx = W - (this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1]);

								Rows_info[CurRow].push({W : W, Type : 0, GridSpan : 1});
							}
						}

						// Возможно, что во всех рядах RowsInfo в начале есть запись BeforeGrid
						var MinBefore = 0;
						for (CurRow = 0; CurRow < this.Content.length; CurRow++)
						{
							if (-1 != Rows_info[CurRow][0].Type)
							{
								MinBefore = 0;
								break;
							}

							if (0 === MinBefore || MinBefore > Rows_info[CurRow][0].W)
								MinBefore = Rows_info[CurRow][0].W;
						}

						if (0 != MinBefore)
						{
							for (CurRow = 0; CurRow < this.Content.length; CurRow++)
							{
								if (Math.abs(MinBefore - Rows_info[CurRow][0].W) < 0.001)
									Rows_info[CurRow].splice(0, 1);
								else // if ( MinBefore < Rows_info[CurRow][0].W )
									Rows_info[CurRow][0].W -= MinBefore;
							}

							Page.X += MinBefore;
							if (true === this.Is_Inline())
								NewTableInd = NewTableInd + MinBefore;
							else
								this.Internal_UpdateFlowPosition(Page.X, Page.Y);
						}
					}
					else
					{
						var BeforeFlag   = false;
						var BeforeSpace2 = null;
						if (0 === Col)
						{
							BeforeSpace2 = Page.X - _X;

							if (-BeforeSpace2 > this.TableSumGrid[0])
							{
								BeforeFlag = true;
								Page.X += this.TableSumGrid[0];
							}
							else
								Page.X += Dx;

							this.Set_TableW(tblwidth_Auto, 0);

							if (true === this.Is_Inline())
							{
								if (-BeforeSpace2 > this.TableSumGrid[0])
									NewTableInd = NewTableInd + this.TableSumGrid[0];
								else
									NewTableInd = NewTableInd + Dx;
							}
							else
								this.Internal_UpdateFlowPosition(Page.X, Page.Y);
						}

						if (Index === this.Markup.Cols.length)
							this.Set_TableW(tblwidth_Auto, 0);

						var BeforeSpace = null;
						if (0 === Index && 0 != Col && _X < Page.X)
						{
							BeforeSpace = Page.X - _X;
							Page.X -= BeforeSpace;
							if (true === this.Is_Inline())
								NewTableInd = NewTableInd - BeforeSpace;
							else
								this.Internal_UpdateFlowPosition(Page.X, Page.Y);
						}

						for (CurRow = 0; CurRow < this.Content.length; CurRow++)
						{
							Rows_info[CurRow] = [];
							Row               = this.Content[CurRow];
							var Before_Info   = Row.Get_Before();

							var WBefore = 0;

							if (Before_Info.GridBefore > 0 && Col === Before_Info.GridBefore)
								WBefore = this.TableSumGrid[Before_Info.GridBefore - 1] + Dx;
							else
							{
								if (null != BeforeSpace)
									WBefore = this.TableSumGrid[Before_Info.GridBefore - 1] + BeforeSpace;
								else
									WBefore = this.TableSumGrid[Before_Info.GridBefore - 1];

								if (null != BeforeSpace2)
								{
									if (Before_Info.GridBefore > 0)
									{
										if (true === BeforeFlag)
											WBefore = this.TableSumGrid[Before_Info.GridBefore - 1] - this.TableSumGrid[0];
										else
											WBefore = this.TableSumGrid[Before_Info.GridBefore - 1] + BeforeSpace2;

									}
									else if (0 === Before_Info.GridBefore && true === BeforeFlag)
										WBefore = ( -BeforeSpace2 ) - this.TableSumGrid[0];
								}
							}

							if (WBefore > 0.001)
								Rows_info[CurRow].push({W : WBefore, Type : -1, GridSpan : 1});

							var CellsCount = Row.Get_CellsCount();
							var TempDx     = Dx;
							for (var CurCell = 0; CurCell < CellsCount; CurCell++)
							{
								var Cell           = Row.Get_Cell(CurCell);
								var CellMargins    = Cell.Get_Margins();
								var Cur_Grid_start = Row.Get_CellInfo(CurCell).StartGridCol;
								var Cur_Grid_end   = Cur_Grid_start + Cell.Get_GridSpan() - 1;

								var W = 0;
								if (Cur_Grid_end + 1 === Col)
									W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1] + Dx;
								else if (Cur_Grid_start === Col)
									W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1] - TempDx;
								else
									W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1];

								W = Math.max(1, Math.max(W, CellMargins.Left.W + CellMargins.Right.W));
								if (Cur_Grid_end + 1 === Col)
									TempDx = W - (this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1]);

								Rows_info[CurRow].push({W : W, Type : 0, GridSpan : 1});
							}
						}
					}

					if (Math.abs(NewTableInd - OldTableInd) > 0.001)
						this.Set_TableInd(NewTableInd);

					if (tbllayout_AutoFit === this.Get_CompiledPr(false).TablePr.TableLayout)
						this.Set_TableLayout(tbllayout_Fixed);

					this.Internal_CreateNewGrid(Rows_info);
					this.private_RecalculateGrid();
				}
				else
				{
					var RowIndex = this.Pages[this.Selection.Data2.PageNum].FirstRow + this.Selection.Data2.Index;
					if (0 === RowIndex)
					{
						if (true === this.Is_Inline())
						{
							// Ничего не делаем
						}
						else
						{
							var Dy = _Y - this.Markup.Rows[0].Y;
							Page.Y += Dy;
							this.Internal_UpdateFlowPosition(Page.X, Page.Y);

							//var NewH = this.Markup.Rows[0].H + Dy;
							//this.Content[0].Set_Height( NewH, Asc.linerule_AtLeast );
						}
					}
					else
					{
						if (this.Selection.Data2.PageNum > 0 && 0 === this.Selection.Data2.Index)
						{
							// Ничего не делаем
						}
						else
						{
							var _Y_old = this.Markup.Rows[this.Selection.Data2.Index - 1].Y + this.Markup.Rows[this.Selection.Data2.Index - 1].H;
							var Dy     = _Y - _Y_old;
							var NewH   = this.Markup.Rows[this.Selection.Data2.Index - 1].H + Dy;
							this.Content[RowIndex - 1].Set_Height(NewH, linerule_AtLeast);
						}
					}
				}

				this.Internal_Recalculate_1();
			}

			this.Selection.Type2 = table_Selection_Common;
			this.Selection.Data2 = null;
		}

		return;
	}
	else if (table_Selection_Border_InnerTable === this.Selection.Type2)
	{
		var Cell = this.Selection.Data2;
		Cell.Content_Selection_SetEnd(X, Y, CurPage - Cell.Content.Get_StartPage_Relative(), MouseEvent);

		if (MouseEvent.Type === AscCommon.g_mouse_event_type_up)
		{
			this.Selection.Type2 = table_Selection_Common;
			this.Selection.Data2 = null;
		}

		return;
	}

	var Pos = this.Internal_GetCellByXY(X, Y, CurPage);
	this.Content[Pos.Row].Get_Cell(Pos.Cell).Content_Set_CurPosXY(X, Y);
	this.Selection.Data              = null;
	this.Selection.EndPos.Pos        = Pos;
	this.Selection.EndPos.X          = X;
	this.Selection.EndPos.Y          = Y;
	this.Selection.EndPos.PageIndex  = CurPage;
	this.Selection.EndPos.MouseEvent = MouseEvent;
	this.Selection.CurRow            = Pos.Row;

	// При селекте внутри ячейки мы селектим содержимое ячейки
	if (0 === this.Parent.Selection_Is_OneElement() && this.Selection.StartPos.Pos.Row === this.Selection.EndPos.Pos.Row && this.Selection.StartPos.Pos.Cell === this.Selection.EndPos.Pos.Cell)
	{
		this.CurCell.Content_Selection_SetStart(this.Selection.StartPos.X, this.Selection.StartPos.Y, this.Selection.StartPos.PageIndex - this.CurCell.Content.Get_StartPage_Relative(), this.Selection.StartPos.MouseEvent);

		this.Selection.Type = table_Selection_Text;

		this.CurCell.Content_Selection_SetEnd(X, Y, CurPage - this.CurCell.Content.Get_StartPage_Relative(), MouseEvent);

		if (AscCommon.g_mouse_event_type_up == MouseEvent.Type)
			this.Selection.Start = false;

		if (false === this.CurCell.Content.Selection.Use)
		{
			this.Selection.Use   = false;
			this.Selection.Start = false;
			this.Cursor_MoveAt(X, Y, false, false, CurPage);
			return;
		}
	}
	else
	{
		if (AscCommon.g_mouse_event_type_up == MouseEvent.Type)
		{
			this.Selection.Start = false;
			this.CurCell         = this.Content[Pos.Row].Get_Cell(Pos.Cell);
		}

		this.Selection.Type = table_Selection_Cell;
		this.Internal_Selection_UpdateCells();
	}
};
CTable.prototype.Selection_Stop = function(X, Y, CurPage, MouseEvent)
{
	if (true != this.Selection.Use)
		return;

	this.Selection.Start = false;
	var Cell             = this.Content[this.Selection.StartPos.Pos.Row].Get_Cell(this.Selection.StartPos.Pos.Cell);
	Cell.Content_Selection_Stop(X, Y, CurPage - Cell.Content.Get_StartPage_Relative(), MouseEvent);
};
CTable.prototype.Selection_Draw_Page = function(CurPage)
{
	if (false === this.Selection.Use)
		return;

	if (CurPage < 0 || CurPage >= this.Pages.length)
		return;

	var Page    = this.Pages[CurPage];
	var PageAbs = this.private_GetAbsolutePageIndex(CurPage);

	if (this.Parent && selectionflag_Numbering === this.Parent.Selection.Flag)
	{
		for (var CurRow = 0, RowsCount = this.Get_RowsCount(); CurRow < RowsCount; ++CurRow)
		{
			var Row = this.Get_Row(CurRow);
			for (var CurCell = 0, CellsCount = Row.Get_CellsCount(); CurCell < CellsCount; ++CurCell)
			{
				var Cell         = Row.Get_Cell(CurCell);
				var Cell_PageRel = CurPage - Cell.Content.Get_StartPage_Relative();
				Cell.Content_Selection_Draw_Page(Cell_PageRel);
			}
		}
		return;
	}

	switch (this.Selection.Type)
	{
		case table_Selection_Cell:
		{
			for (var Index = 0; Index < this.Selection.Data.length; ++Index)
			{
				var Pos      = this.Selection.Data[Index];
				var Row      = this.Content[Pos.Row];
				var Cell     = Row.Get_Cell(Pos.Cell);
				var CellInfo = Row.Get_CellInfo(Pos.Cell);
				var CellMar  = Cell.Get_Margins();

				var X_start = (0 === Pos.Cell ? Page.X + CellInfo.X_content_start : Page.X + CellInfo.X_cell_start);
				var X_end   = Page.X + CellInfo.X_cell_end;

				var Cell_Pages   = Cell.Content_Get_PagesCount();
				var Cell_PageRel = CurPage - Cell.Content.Get_StartPage_Relative();
				if (Cell_PageRel < 0 || Cell_PageRel >= Cell_Pages)
					continue;

				var Bounds   = Cell.Content_Get_PageBounds(Cell_PageRel);
				var Y_offset = Cell.Temp.Y_VAlign_offset[Cell_PageRel];

				var RowIndex = 0 != Cell_PageRel ? this.Pages[CurPage].FirstRow : Pos.Row;

				if (true === Cell.Is_VerticalText())
				{
					var X_start       = Page.X + CellInfo.X_cell_start;
					var TextDirection = Cell.Get_TextDirection();

					var MergeCount = this.private_GetVertMergeCountOnPage(CurPage, RowIndex, CellInfo.StartGridCol, Cell.Get_GridSpan());
					if (MergeCount <= 0)
						continue;

					var LastRow = Math.min(RowIndex + MergeCount - 1, this.Pages[CurPage].LastRow);
					var Y_start = this.RowsInfo[RowIndex].Y[CurPage] + this.RowsInfo[RowIndex].TopDy[CurPage] + CellMar.Top.W;
					var Y_end   = this.TableRowsBottom[LastRow][CurPage] - CellMar.Bottom.W;

					if (TextDirection === textdirection_BTLR)
					{
						var SelectionW = Math.min(X_end - X_start - CellMar.Left.W, Bounds.Bottom - Bounds.Top);
						this.DrawingDocument.AddPageSelection(PageAbs, X_start + CellMar.Left.W + Y_offset, Y_start, SelectionW, Y_end - Y_start);
					}
					else if (TextDirection === textdirection_TBRL)
					{
						var SelectionW = Math.min(X_end - X_start - CellMar.Right.W, Bounds.Bottom - Bounds.Top);
						this.DrawingDocument.AddPageSelection(PageAbs, X_end - CellMar.Right.W - Y_offset - SelectionW, Y_start, SelectionW, Y_end - Y_start);
					}
				}
				else
				{
					this.DrawingDocument.AddPageSelection(PageAbs, X_start, this.RowsInfo[RowIndex].Y[CurPage] + this.RowsInfo[RowIndex].TopDy[CurPage] + CellMar.Top.W + Y_offset, X_end - X_start, Bounds.Bottom - Bounds.Top);
				}
			}
			break;
		}
		case table_Selection_Text:
		{
			var Cell         = this.Content[this.Selection.StartPos.Pos.Row].Get_Cell(this.Selection.StartPos.Pos.Cell);
			var Cell_PageRel = CurPage - Cell.Content.Get_StartPage_Relative();
			Cell.Content_Selection_Draw_Page(Cell_PageRel);
			break;
		}
	}
};
CTable.prototype.Selection_Remove = function()
{
	if (false === this.Selection.Use)
		return;

	if (this.Content.length <= 0)
	{
		this.CurCell = null;
	}
	else
	{
		if (table_Selection_Text === this.Selection.Type)
		{
			this.CurCell = this.Content[this.Selection.StartPos.Pos.Row].Get_Cell(this.Selection.StartPos.Pos.Cell);
			this.CurCell.Content.Selection_Remove();
		}
		else if (this.Content.length > 0 && this.Content[0].Get_CellsCount() > 0)
		{
			this.CurCell = this.Content[0].Get_Cell(0);
			this.CurCell.Content.Selection_Remove();
		}
	}

	this.Selection.Use   = false;
	this.Selection.Start = false;

	this.Selection.StartPos.Pos = {Row : 0, Cell : 0};
	this.Selection.EndPos.Pos   = {Row : 0, Cell : 0};

	this.Markup.Internal.RowIndex  = 0;
	this.Markup.Internal.CellIndex = 0;
	this.Markup.Internal.PageNum   = 0;
};
CTable.prototype.Selection_Check = function(X, Y, CurPage, NearPos)
{
	if (undefined != NearPos)
	{
		if ((true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) || true === this.ApplyToAll)
		{
			var Cells_array = this.Internal_Get_SelectionArray();
			for (var Index = 0; Index < Cells_array.length; Index++)
			{
				var CurPos      = Cells_array[Index];
				var CurCell     = this.Content[CurPos.Row].Get_Cell(CurPos.Cell);
				var CellContent = CurCell.Content;

				CellContent.Set_ApplyToAll(true);

				if (true === CellContent.Selection_Check(0, 0, 0, NearPos))
				{
					CellContent.Set_ApplyToAll(false);
					return true;
				}

				CellContent.Set_ApplyToAll(false);
			}
		}
		else
			return this.CurCell.Content_Selection_Check(0, 0, 0, NearPos);

		return false;
	}
	else
	{
		if (CurPage < 0 || CurPage >= this.Pages.length)
			return false;

		var CellPos = this.Internal_GetCellByXY(X, Y, CurPage);
		if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		{
			for (var Index = 0; Index < this.Selection.Data.length; Index++)
			{
				var CurPos = this.Selection.Data[Index];

				if (CurPos.Cell === CellPos.Cell && CurPos.Row === CellPos.Row)
					return true;
			}

			return false;
		}
		else if (CellPos.Cell === this.CurCell.Index && CellPos.Row === this.CurCell.Row.Index)
			return this.CurCell.Content_Selection_Check(X, Y, CurPage - this.CurCell.Content.Get_StartPage_Relative(), undefined);

		return false;
	}
};
CTable.prototype.Selection_IsEmpty = function(bCheckHidden)
{
	if (true === this.Selection.Use)
	{
		if (table_Selection_Cell === this.Selection.Type)
			return false;
		else
			return this.CurCell.Content.Selection_IsEmpty(bCheckHidden);
	}

	return true;
};
CTable.prototype.Select_All = function(nDirection)
{
	this.Selection.Use   = true;
	this.Selection.Start = false;
	this.Selection.Type  = table_Selection_Cell;
	this.Selection.Type2 = table_Selection_Common;

	this.Selection.Data2 = null;

	if (nDirection && nDirection < 0)
	{
		this.Selection.EndPos.Pos       = {
			Row  : 0,
			Cell : 0
		};
		this.Selection.EndPos.PageIndex = 0;

		this.Selection.StartPos.Pos       = {
			Row  : this.Content.length - 1,
			Cell : this.Content[this.Content.length - 1].Get_CellsCount() - 1
		};
		this.Selection.StartPos.PageIndex = this.Pages.length - 1;
	}
	else
	{
		this.Selection.StartPos.Pos       = {
			Row  : 0,
			Cell : 0
		};
		this.Selection.StartPos.PageIndex = 0;

		this.Selection.EndPos.Pos       = {
			Row  : this.Content.length - 1,
			Cell : this.Content[this.Content.length - 1].Get_CellsCount() - 1
		};
		this.Selection.EndPos.PageIndex = this.Pages.length - 1;
	}

	this.Internal_Selection_UpdateCells();
};
/**
 * В данной функции проверяется идет ли выделение таблицы до конца таблицы.
 */
CTable.prototype.Selection_IsToEnd = function()
{
	if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		var Len         = Cells_array.length;

		if (Len < 1)
			return false;

		var Pos = Cells_array[Len - 1];
		if (Pos.Row !== this.Content.length - 1 || Pos.Cell !== this.Content[Pos.Row].Get_CellsCount() - 1)
			return false;

		return true;
	}
	else
		return false;
};
CTable.prototype.Cursor_MoveToStartPos = function(AddToSelect)
{
	if (true === AddToSelect)
	{
		var StartRow = ( true === this.Selection.Use ? this.Selection.StartPos.Pos.Row : this.CurCell.Row.Index );
		var EndRow   = 0;

		this.Selection.Use          = true;
		this.Selection.Start        = false;
		this.Selection.Type         = table_Selection_Cell;
		this.Selection.Type2        = table_Selection_Common;
		this.Selection.StartPos.Pos = {Row : StartRow, Cell : this.Content[StartRow].Get_CellsCount() - 1};
		this.Selection.EndPos.Pos   = {Row : EndRow, Cell : 0};
		this.Selection.CurRow       = EndRow;

		this.Internal_Selection_UpdateCells();
	}
	else
	{
		this.CurCell = this.Content[0].Get_Cell(0);

		this.Selection.Use          = false;
		this.Selection.Start        = false;
		this.Selection.StartPos.Pos = {Row : 0, Cell : 0};
		this.Selection.EndPos.Pos   = {Row : 0, Cell : 0};
		this.Selection.CurRow       = 0;

		this.CurCell.Content_Cursor_MoveToStartPos();
	}
};
CTable.prototype.Cursor_MoveToEndPos = function(AddToSelect)
{
	if (true === AddToSelect)
	{
		var StartRow = ( true === this.Selection.Use ? this.Selection.StartPos.Pos.Row : this.CurCell.Row.Index );
		var EndRow   = this.Content.length - 1;

		this.Selection.Use          = true;
		this.Selection.Start        = false;
		this.Selection.Type         = table_Selection_Cell;
		this.Selection.Type2        = table_Selection_Common;
		this.Selection.StartPos.Pos = {Row : StartRow, Cell : 0};
		this.Selection.EndPos.Pos   = {Row : EndRow, Cell : this.Content[EndRow].Get_CellsCount() - 1};
		this.Selection.CurRow       = EndRow;

		this.Internal_Selection_UpdateCells();
	}
	else
	{
		var Row      = this.Content[this.Content.length - 1];
		this.CurCell = Row.Get_Cell(Row.Get_CellsCount() - 1);

		this.Selection.Use          = false;
		this.Selection.Start        = false;
		this.Selection.StartPos.Pos = {Row : Row.Index, Cell : this.CurCell.Index};
		this.Selection.EndPos.Pos   = {Row : Row.Index, Cell : this.CurCell.Index};
		this.Selection.CurRow       = Row.Index;

		this.CurCell.Content_Cursor_MoveToEndPos();
	}
};
CTable.prototype.Cursor_IsStart = function(bOnlyPara)
{
	if (false === this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
	{
		if (0 === this.CurCell.Index && 0 === this.CurCell.Row.Index)
		{
			return this.CurCell.Content.Cursor_IsStart(bOnlyPara);
		}
	}

	return false;
};
//----------------------------------------------------------------------------------------------------------------------
// Работаем с содержимым таблицы
//----------------------------------------------------------------------------------------------------------------------
CTable.prototype.Add_NewParagraph = function()
{
	this.CurCell.Content.Add_NewParagraph();
};
CTable.prototype.Add_InlineImage = function(W, H, Img, Chart, bFlow)
{
	this.Selection.Use  = true;
	this.Selection.Type = table_Selection_Text;
	this.CurCell.Content.Add_InlineImage(W, H, Img, Chart, bFlow);
};
CTable.prototype.Add_OleObject = function(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId)
{
	this.Selection.Use  = true;
	this.Selection.Type = table_Selection_Text;
	this.CurCell.Content.Add_OleObject(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId);
};
CTable.prototype.Add_TextArt = function(nStyle)
{
	this.Selection.Use  = true;
	this.Selection.Type = table_Selection_Text;
	this.CurCell.Content.Add_TextArt(nStyle);
};
CTable.prototype.Add_InlineTable = function(Cols, Rows)
{
	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		return;

	this.CurCell.Content.Add_InlineTable(Cols, Rows);
};
CTable.prototype.Add = function(ParaItem, bRecalculate)
{
	this.Paragraph_Add(ParaItem, bRecalculate);
};
CTable.prototype.Paragraph_Add = function(ParaItem, bRecalculate)
{
	if (para_TextPr === ParaItem.Type && ( true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ) ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Paragraph_Add(ParaItem, bRecalculate);
			Cell_Content.Set_ApplyToAll(false);
		}

		// Если в TextPr только HighLight, тогда не надо ничего пересчитывать, только перерисовываем
		if (true === ParaItem.Value.Check_NeedRecalc())
		{
			if (Cells_array[0].Row - 1 >= 0)
				this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
			else
			{
				this.Internal_Recalculate_1();
			}
		}
		else
		{
			this.Parent.OnContentReDraw(this.Get_AbsolutePage(0), this.Get_AbsolutePage(this.Pages.length - 1));
		}
	}
	else
		this.CurCell.Content.Paragraph_Add(ParaItem, bRecalculate);
};
CTable.prototype.Paragraph_ClearFormatting = function()
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Paragraph_ClearFormatting();
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		this.CurCell.Content.Paragraph_ClearFormatting();
};
CTable.prototype.Paragraph_Format_Paste = function(TextPr, ParaPr, ApplyPara)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Paragraph_Format_Paste(TextPr, ParaPr, true);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		this.CurCell.Content.Paragraph_Format_Paste(TextPr, ParaPr, false);
};
CTable.prototype.Remove = function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();

		if (true === bOnTextAdd && Cells_array.length > 0)
		{
			// Снимаем выделением со всех ячеек, кроме первой, попавшей в выделение
			var Pos  = Cells_array[0];
			var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
			Cell.Content.Select_All();
			Cell.Content.Remove(Count, bOnlyText, bRemoveOnlySelection, true);

			this.CurCell = Cell;

			this.Selection.Use   = false;
			this.Selection.Start = false;

			this.Selection.StartPos.Pos = {Row : Cell.Row.Index, Cell : Cell.Index};
			this.Selection.EndPos.Pos   = {Row : Cell.Row.Index, Cell : Cell.Index};

			this.Document_SetThisElementCurrent(true);

			editor.WordControl.m_oLogicDocument.Recalculate();
		}
		else
		{
			var Cells_array = this.Internal_Get_SelectionArray();
			for (var Index = 0; Index < Cells_array.length; Index++)
			{
				var Pos  = Cells_array[Index];
				var Row  = this.Content[Pos.Row];
				var Cell = Row.Get_Cell(Pos.Cell);

				var Cell_Content = Cell.Content;
				Cell_Content.Set_ApplyToAll(true);
				Cell.Content.Remove(Count, bOnlyText, bRemoveOnlySelection, false);
				Cell_Content.Set_ApplyToAll(false);
			}

			// Снимаем выделение
			var Pos      = Cells_array[0];
			var Cell     = this.Content[Pos.Row].Get_Cell(Pos.Cell);
			this.CurCell = Cell;

			this.Selection.Use   = false;
			this.Selection.Start = false;

			this.Selection.StartPos.Pos = {Row : Cell.Row.Index, Cell : Cell.Index};
			this.Selection.EndPos.Pos   = {Row : Cell.Row.Index, Cell : Cell.Index};

			if (Cells_array[0].Row - 1 >= 0)
				this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
			else
			{
				this.Internal_Recalculate_1();
			}
		}
	}
	else
	{
		this.CurCell.Content.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);

		if (false === this.CurCell.Content.Is_SelectionUse())
		{
			var Cell = this.CurCell;

			this.Selection.Use   = false;
			this.Selection.Start = false;

			this.Selection.StartPos.Pos = {Row : Cell.Row.Index, Cell : Cell.Index};
			this.Selection.EndPos.Pos   = {Row : Cell.Row.Index, Cell : Cell.Index};
		}
	}
};
CTable.prototype.Cursor_GetPos = function()
{
	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		if (this.Selection.Data.length < 0)
			return {X : 0, Y : 0};

		var Pos  = this.Selection.Data[0];
		var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
		var Para = Cell.Content.Get_FirstParagraph();

		return {X : Para.X, Y : Para.Y}
	}
	else
		return this.CurCell.Content.Cursor_GetPos();
};
CTable.prototype.Cursor_MoveLeft = function(Count, AddToSelect, Word)
{
	if (true === this.Selection.Use && this.Selection.Type === table_Selection_Cell)
	{
		if (true === AddToSelect)
		{
			var StartPos = this.Selection.StartPos.Pos;
			var EndPos   = this.Selection.EndPos.Pos;

			if (StartPos.Cell == EndPos.Cell && StartPos.Row == EndPos.Row && 0 === this.Parent.Selection_Is_OneElement())
			{
				// Если была выделена одна ячейка, тогда мы убираем выделение по ячейкам
				this.Selection.Type = table_Selection_Text;
				return true;
			}
			else
			{
				// Если текущая ячейка - первая в первой строке и данная таблица - первый элемент, тогда мы ничего не
				// делаем
				if (0 == EndPos.Cell && 0 == EndPos.Row && ( null === this.Get_DocumentPrev() && true === this.Parent.Is_TopDocument() ))
					return false;

				// Если текущая ячейка - первая в первой строке (и таблица не первый элемент документа),
				// тогда мы выделаяем первую строку

				var bRet = true;
				if (0 == EndPos.Cell && 0 == EndPos.Row || ( 0 !== this.Parent.Selection_Is_OneElement() && 0 == EndPos.Row && 0 == StartPos.Row ))
				{
					this.Selection.EndPos.Pos = {Cell : 0, Row : 0};
					bRet                      = false;
				}
				//else if ( EndPos.Cell > 0 && EndPos.Cell > StartPos.Cell && 0 ===
				// this.Parent.Selection_Is_OneElement() ) this.Selection.EndPos.Pos = { Cell : EndPos.Cell - 1, Row :
				// EndPos.Row }; else if ( EndPos.Row > 0 && EndPos.Row > StartPos.Row && 0 ===
				// this.Parent.Selection_Is_OneElement() ) this.Selection.EndPos.Pos = { Cell : Math.min( EndPos.Cell,
				// this.Content[EndPos.Row - 1].Get_CellsCount() - 1 ), Row : EndPos.Row - 1 };
				else if (EndPos.Cell > 0 && 0 === this.Parent.Selection_Is_OneElement())
					this.Selection.EndPos.Pos = {Cell : EndPos.Cell - 1, Row : EndPos.Row};
				else
					this.Selection.EndPos.Pos = {Cell : 0, Row : EndPos.Row - 1};

				var bForceSelectByLines = false;
				if (false === bRet && true == this.Is_Inline())
					bForceSelectByLines = true;

				this.Internal_Selection_UpdateCells(bForceSelectByLines);

				return bRet;
			}
		}
		else
		{
			// Перемещаем курсор в начало первой выделенной ячейки
			this.Selection.Use = false;
			var Pos            = this.Selection.Data[0];
			this.CurCell       = this.Content[Pos.Row].Get_Cell(Pos.Cell);
			this.CurCell.Content_Cursor_MoveToStartPos();
			return true;
		}
	}
	else
	{
		if (false === this.CurCell.Content.Cursor_MoveLeft(AddToSelect, Word))
		{
			if (false === AddToSelect)
			{
				if (0 != this.CurCell.Index || 0 != this.CurCell.Row.Index)
				{
					if (0 != this.CurCell.Index)
					{
						this.CurCell = this.Internal_Get_StartMergedCell2(this.CurCell.Index - 1, this.Selection.CurRow);
					}
					else //if ( 0 != this.CurCell.Row.Index  )
					{
						this.Selection.CurRow = Math.max(this.Selection.CurRow - 1, 0);
						this.CurCell          = this.Internal_Get_StartMergedCell2(this.Content[this.Selection.CurRow].Get_CellsCount() - 1, this.Selection.CurRow);
					}

					this.CurCell.Content.Cursor_MoveToEndPos();
				}
				else
					return false;
			}
			else
			{
				// Если текущая ячейка - первая в первой строке и данная таблица - первый элемент, тогда мы ничего не
				// делаем
				if (0 == this.CurCell.Index && 0 == this.CurCell.Row.Index && ( null === this.Get_DocumentPrev() && true === this.Parent.Is_TopDocument() ))
					return false;

				this.Selection.Use  = true;
				this.Selection.Type = table_Selection_Cell;

				// Если текущая ячейка - первая в первой строке (и таблица не первый элемент документа),
				// тогда мы выделаяем первую строку

				var bRet                    = true;
				this.Selection.StartPos.Pos = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};

				if (0 == this.CurCell.Index && 0 == this.CurCell.Row.Index)
				{
					this.Selection.EndPos.Pos = {Cell : this.CurCell.Row.Get_CellsCount() - 1, Row : 0};
					bRet                      = false;
				}
				else if (this.CurCell.Index > 0)
					this.Selection.EndPos.Pos = {Cell : this.CurCell.Index - 1, Row : this.CurCell.Row.Index};
				else
					this.Selection.EndPos.Pos = {Cell : 0, Row : this.CurCell.Row.Index - 1};

				this.Internal_Selection_UpdateCells();

				return bRet;
			}
		}
		else
		{
			if (true === AddToSelect)
			{
				this.Selection.Use          = true;
				this.Selection.Type         = table_Selection_Text;
				this.Selection.StartPos.Pos = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};
				this.Selection.EndPos.Pos   = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};
			}

			return true;
		}
	}
};
CTable.prototype.Cursor_MoveRight = function(Count, AddToSelect, Word, FromPaste)
{
	if (true === this.Selection.Use && this.Selection.Type === table_Selection_Cell)
	{
		if (true === AddToSelect)
		{
			var StartPos = this.Selection.StartPos.Pos;
			var EndPos   = this.Selection.EndPos.Pos;

			if (StartPos.Cell == EndPos.Cell && StartPos.Row == EndPos.Row && 0 === this.Parent.Selection_Is_OneElement())
			{
				// Если была выделена одна ячейка, тогда мы убираем выделение по ячейкам
				this.Selection.Type = table_Selection_Text;
				return true;
			}
			else
			{
				// Если текущая ячейка - последняя в последней строке, тогда мы выделаяем последнюю строку
				var LastRow = this.Content[this.Content.length - 1];
				var EndRow  = this.Content[EndPos.Row];

				var bRet = true;
				if ((LastRow.Get_CellsCount() - 1 == EndPos.Cell && this.Content.length - 1 == EndPos.Row) || ( 0 !== this.Parent.Selection_Is_OneElement() && this.Content.length - 1 == EndPos.Row && this.Content.length - 1 == StartPos.Row ))
				{
					this.Selection.EndPos.Pos = {Cell : LastRow.Get_CellsCount() - 1, Row : LastRow.Index};
					bRet                      = false;
				}
				//else if ( EndPos.Cell < EndRow.Get_CellsCount() - 1 && EndPos.Cell < StartPos.Cell && 0 ===
				// this.Parent.Selection_Is_OneElement() ) this.Selection.EndPos.Pos = { Cell : EndPos.Cell + 1, Row :
				// EndPos.Row }; else if ( EndPos.Row < this.Content.length - 1 && EndPos.Row < StartPos.Row && 0 ===
				// this.Parent.Selection_Is_OneElement() ) this.Selection.EndPos.Pos = { Cell : Math.min( EndPos.Cell,
				// this.Content[EndPos.Row + 1].Get_CellsCount() - 1 ), Row : EndPos.Row + 1 };
				else if (EndPos.Cell < EndRow.Get_CellsCount() - 1 && 0 === this.Parent.Selection_Is_OneElement())
					this.Selection.EndPos.Pos = {Cell : EndPos.Cell + 1, Row : EndPos.Row};
				else
					this.Selection.EndPos.Pos = {
						Cell : this.Content[EndPos.Row + 1].Get_CellsCount() - 1,
						Row  : EndPos.Row + 1
					};

				var bForceSelectByLines = false;
				if (false === bRet && true == this.Is_Inline())
					bForceSelectByLines = true;

				this.Internal_Selection_UpdateCells(bForceSelectByLines);

				return bRet;
			}
		}
		else
		{
			// Перемещаем курсор в конец последней выделенной ячейки
			this.Selection.Use = false;
			var Pos            = this.Selection.Data[this.Selection.Data.length - 1];
			this.CurCell       = this.Content[Pos.Row].Get_Cell(Pos.Cell);
			this.CurCell.Content_Cursor_MoveToEndPos();
			return true;
		}
	}
	else
	{
		if (false === this.CurCell.Content.Cursor_MoveRight(AddToSelect, Word, FromPaste))
		{
			if (false === AddToSelect)
			{
				if (this.Content.length - 1 > this.CurCell.Row.Index || this.Content[this.CurCell.Row.Index].Get_CellsCount() - 1 > this.CurCell.Index)
				{
					if (this.Content[this.CurCell.Row.Index].Get_CellsCount() - 1 > this.CurCell.Index)
					{
						this.CurCell = this.Internal_Get_StartMergedCell2(this.CurCell.Index + 1, this.Selection.CurRow);
					}
					else //if ( this.Content.length - 1 > this.CurCell.Row.Index  )
					{
						this.Selection.CurRow = Math.min(this.Content.length - 1, this.Selection.CurRow + 1);
						this.CurCell          = this.Internal_Get_StartMergedCell2(0, this.Selection.CurRow);
					}

					this.CurCell.Content.Cursor_MoveToStartPos();
				}
				else
					return false;
			}
			else
			{
				this.Selection.Use  = true;
				this.Selection.Type = table_Selection_Cell;

				// Если текущая ячейка - последняя в последней строке, тогда мы выделаяем последнюю строку
				var LastRow = this.Content[this.Content.length - 1];
				var CurRow  = this.CurCell.Row;

				var bRet                    = true;
				this.Selection.StartPos.Pos = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};

				if (LastRow.Get_CellsCount() - 1 == this.CurCell.Index && LastRow.Index == this.CurCell.Row.Index)
				{
					this.Selection.EndPos.Pos = {Cell : LastRow.Get_CellsCount() - 1, Row : LastRow.Index};
					bRet                      = false;
				}
				else if (this.CurCell.Index < CurRow.Get_CellsCount() - 1)
					this.Selection.EndPos.Pos = {Cell : this.CurCell.Index + 1, Row : this.CurCell.Row.Index};
				else
					this.Selection.EndPos.Pos = {
						Cell : this.Content[this.CurCell.Row.Index + 1].Get_CellsCount() - 1,
						Row  : this.CurCell.Row.Index + 1
					};

				var bForceSelectByLines = false;
				if (false === bRet && true == this.Is_Inline())
					bForceSelectByLines = true;

				this.Internal_Selection_UpdateCells(bForceSelectByLines);

				return bRet;
			}
		}
		else
		{
			if (true === AddToSelect)
			{
				this.Selection.Use          = true;
				this.Selection.Type         = table_Selection_Text;
				this.Selection.StartPos.Pos = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};
				this.Selection.EndPos.Pos   = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};

			}

			return true;
		}
	}
};
CTable.prototype.Cursor_MoveUp = function(Count, AddToSelect)
{
	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		if (true === AddToSelect)
		{
			var bRetValue = true;
			var EndPos    = this.Selection.EndPos.Pos;
			if (0 === EndPos.Row)
			{
				bRetValue = false;
			}
			else
			{
				var EndCell = this.Content[EndPos.Row].Get_Cell(EndPos.Cell);

				var X = EndCell.Content_Get_CurPosXY().X;
				var Y = EndCell.Content_Get_CurPosXY().Y;

				var PrevRow = this.Content[EndPos.Row - 1];
				var Cell    = null;
				for (var CurCell = 0; CurCell < PrevRow.Get_CellsCount(); CurCell++)
				{
					Cell         = PrevRow.Get_Cell(CurCell);
					var CellInfo = PrevRow.Get_CellInfo(CurCell);
					if (X <= CellInfo.X_grid_end)
						break;
				}

				if (null === Cell)
					return true;

				Cell.Content_Set_CurPosXY(X, Y);
				this.CurCell              = Cell;
				this.Selection.EndPos.Pos = {Cell : Cell.Index, Row : Cell.Row.Index};
			}

			var bForceSelectByLines = false;
			if (false === bRetValue && true === this.Is_Inline())
				bForceSelectByLines = true;

			this.Internal_Selection_UpdateCells(bForceSelectByLines);
			return bRetValue;
		}
		else
		{
			if (this.Selection.Data.length < 0)
				return true;

			var Pos  = this.Selection.Data[0];
			var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
			var Para = Cell.Content.Get_FirstParagraph();
			var X    = Para.X;
			var Y    = Para.Y;

			this.Selection.Use = false;
			if (0 === Pos.Row)
			{
				this.CurCell = Cell;
				this.CurCell.Content.Cursor_MoveToStartPos();
				this.CurCell.Content_Set_CurPosXY(X, Y);

				return false;
			}
			else
			{
				var PrevRow  = this.Content[Pos.Row - 1];
				var PrevCell = null;
				for (var CurCell = 0; CurCell < PrevRow.Get_CellsCount(); CurCell++)
				{
					PrevCell     = PrevRow.Get_Cell(CurCell);
					var CellInfo = PrevRow.Get_CellInfo(CurCell);
					if (X <= CellInfo.X_grid_end)
						break;
				}

				if (null === PrevCell)
					return true;

				PrevCell.Content_Cursor_MoveUp_To_LastRow(X, Y, false);
				this.CurCell = PrevCell;
				return true;
			}

		}
	}
	else
	{
		if (false === this.CurCell.Content.Cursor_MoveUp(AddToSelect))
		{
			// Ничего не делаем, если это "плавающая" таблица или первый элемент документа
			if (0 === this.CurCell.Row.Index && (false === this.Is_Inline() || ( null === this.Get_DocumentPrev() && true === this.Parent.Is_TopDocument() )))
				return true;

			if (true === AddToSelect)
			{
				this.Selection.Use          = true;
				this.Selection.Type         = table_Selection_Cell;
				this.Selection.StartPos.Pos = {Row : this.CurCell.Row.Index, Cell : this.CurCell.Index};

				var bRetValue = true;
				if (0 === this.CurCell.Row.Index)
				{
					this.Selection.EndPos.Pos = {Row : 0, Cell : 0};
					bRetValue                 = false;
				}
				else
				{
					var X       = this.CurCell.Content_Get_CurPosXY().X;
					var Y       = this.CurCell.Content_Get_CurPosXY().Y;
					var PrevRow = this.Content[this.CurCell.Row.Index - 1];
					var Cell    = null;
					for (var CurCell = 0; CurCell < PrevRow.Get_CellsCount(); CurCell++)
					{
						Cell         = PrevRow.Get_Cell(CurCell);
						var CellInfo = PrevRow.Get_CellInfo(CurCell);
						if (X <= CellInfo.X_grid_end)
							break;
					}

					if (null === Cell)
						return true;

					Cell.Content_Set_CurPosXY(X, Y);
					this.CurCell              = Cell;
					this.Selection.EndPos.Pos = {Cell : Cell.Index, Row : Cell.Row.Index};
				}

				var bForceSelectByLines = false;
				if (false === bRetValue && true === this.Is_Inline())
					bForceSelectByLines = true;

				this.Internal_Selection_UpdateCells(bForceSelectByLines);
				return bRetValue;
			}
			else
			{
				if (0 === this.CurCell.Row.Index)
					return false;
				else
				{
					var X       = this.CurCell.Content_Get_CurPosXY().X;
					var Y       = this.CurCell.Content_Get_CurPosXY().Y;
					var PrevRow = this.Content[this.CurCell.Row.Index - 1];
					var Cell    = null;
					for (var CurCell = 0; CurCell < PrevRow.Get_CellsCount(); CurCell++)
					{
						Cell         = PrevRow.Get_Cell(CurCell);
						var CellInfo = PrevRow.Get_CellInfo(CurCell);
						if (X <= CellInfo.X_grid_end)
							break;
					}

					if (null === Cell)
						return true;

					Cell = this.Internal_Get_StartMergedCell2(Cell.Index, Cell.Row.Index);
					Cell.Content_Cursor_MoveUp_To_LastRow(X, Y, false);
					this.CurCell              = Cell;
					this.Selection.EndPos.Pos = {Cell : Cell.Index, Row : Cell.Row.Index};
					this.Selection.CurRow     = Cell.Row.Index;

					return true;
				}
			}
		}
		else
		{
			if (true === AddToSelect)
			{
				this.Selection.Use          = true;
				this.Selection.Type         = table_Selection_Text;
				this.Selection.StartPos.Pos = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};
				this.Selection.EndPos.Pos   = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};
			}

			return true;
		}
	}
};
CTable.prototype.Cursor_MoveDown = function(Count, AddToSelect)
{
	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		if (true === AddToSelect)
		{
			var bRetValue = true;
			var EndPos    = this.Selection.EndPos.Pos;
			if (this.Content.length - 1 === EndPos.Row)
			{
				bRetValue = false;
			}
			else
			{
				var EndCell = this.Content[EndPos.Row].Get_Cell(EndPos.Cell);

				var X = EndCell.Content_Get_CurPosXY().X;
				var Y = EndCell.Content_Get_CurPosXY().Y;

				var NextRow = this.Content[EndPos.Row + 1];
				var Cell    = null;
				for (var CurCell = 0; CurCell < NextRow.Get_CellsCount(); CurCell++)
				{
					Cell         = NextRow.Get_Cell(CurCell);
					var CellInfo = NextRow.Get_CellInfo(CurCell);
					if (X <= CellInfo.X_grid_end)
						break;
				}

				if (null === Cell)
					return true;

				Cell.Content_Set_CurPosXY(X, Y);
				this.CurCell              = Cell;
				this.Selection.EndPos.Pos = {Cell : Cell.Index, Row : Cell.Row.Index};
			}

			var bForceSelectByLines = false;
			if (false === bRetValue && true === this.Is_Inline())
				bForceSelectByLines = true;

			this.Internal_Selection_UpdateCells(bForceSelectByLines);
			return bRetValue;
		}
		else
		{
			if (this.Selection.Data.length < 0)
				return true;

			var Pos  = this.Selection.Data[this.Selection.Data.length - 1];
			var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
			var Para = Cell.Content.Get_FirstParagraph();
			var X    = Para.X;
			var Y    = Para.Y;

			this.Selection.Use = false;
			if (this.Content.length - 1 === Pos.Row)
			{
				this.CurCell = Cell;
				this.CurCell.Content.Cursor_MoveToStartPos();
				this.CurCell.Content_Set_CurPosXY(X, Y);

				return false;
			}
			else
			{
				var NextRow  = this.Content[Pos.Row + 1];
				var NextCell = null;
				for (var CurCell = 0; CurCell < NextRow.Get_CellsCount(); CurCell++)
				{
					NextCell     = NextRow.Get_Cell(CurCell);
					var CellInfo = NextRow.Get_CellInfo(CurCell);
					if (X <= CellInfo.X_grid_end)
						break;
				}

				if (null === NextCell)
					return true;

				NextCell.Content_Cursor_MoveDown_To_FirstRow(X, Y, false);
				this.CurCell = NextCell;
				return true;
			}

		}
	}
	else
	{
		if (false === this.CurCell.Content.Cursor_MoveDown(AddToSelect))
		{
			if (true === AddToSelect)
			{
				this.Selection.Use          = true;
				this.Selection.Type         = table_Selection_Cell;
				this.Selection.StartPos.Pos = {Row : this.CurCell.Row.Index, Cell : this.CurCell.Index};

				var bRetValue = true;
				if (this.Content.length - 1 === this.CurCell.Row.Index)
				{
					this.Selection.EndPos.Pos = {
						Row  : this.Content.length - 1,
						Cell : this.Content[this.Content.length - 1].Get_CellsCount() - 1
					};
					bRetValue                 = false;
				}
				else
				{
					var X       = this.CurCell.Content_Get_CurPosXY().X;
					var Y       = this.CurCell.Content_Get_CurPosXY().Y;
					var NextRow = this.Content[this.CurCell.Row.Index + 1];
					var Cell    = null;
					for (var CurCell = 0; CurCell < NextRow.Get_CellsCount(); CurCell++)
					{
						Cell         = NextRow.Get_Cell(CurCell);
						var CellInfo = NextRow.Get_CellInfo(CurCell);
						if (X <= CellInfo.X_grid_end)
							break;
					}

					if (null === Cell)
						return true;

					Cell.Content_Set_CurPosXY(X, Y);
					this.CurCell              = Cell;
					this.Selection.EndPos.Pos = {Cell : Cell.Index, Row : Cell.Row.Index};
				}

				var bForceSelectByLines = false;
				if (false === bRetValue && true === this.Is_Inline())
					bForceSelectByLines = true;

				this.Internal_Selection_UpdateCells(bForceSelectByLines);
				return bRetValue;
			}
			else
			{
				var VMerge_count = this.Internal_GetVertMergeCount(this.CurCell.Row.Index, this.CurCell.Row.Get_CellInfo(this.CurCell.Index).StartGridCol, this.CurCell.Get_GridSpan());

				if (this.Content.length - 1 === this.CurCell.Row.Index + VMerge_count - 1)
					return false;
				else
				{
					var X = this.CurCell.Content_Get_CurPosXY().X;
					var Y = this.CurCell.Content_Get_CurPosXY().Y;

					var NextRow = this.Content[this.CurCell.Row.Index + VMerge_count];
					var Cell    = null;
					for (var CurCell = 0; CurCell < NextRow.Get_CellsCount(); CurCell++)
					{
						Cell         = NextRow.Get_Cell(CurCell);
						var CellInfo = NextRow.Get_CellInfo(CurCell);
						if (X <= CellInfo.X_grid_end)
							break;
					}

					if (null === Cell)
						return true;

					Cell.Content_Cursor_MoveDown_To_FirstRow(X, Y, false);
					this.CurCell              = Cell;
					this.Selection.EndPos.Pos = {Cell : Cell.Index, Row : Cell.Row.Index};
					this.Selection.CurRow     = Cell.Row.Index;

					return true;
				}
			}
		}
		else
		{
			if (true === AddToSelect)
			{
				this.Selection.Use          = true;
				this.Selection.Type         = table_Selection_Text;
				this.Selection.StartPos.Pos = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};
				this.Selection.EndPos.Pos   = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};
			}

			return true;
		}
	}
};
CTable.prototype.Cursor_MoveEndOfLine = function(AddToSelect)
{
	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		return this.Cursor_MoveRight(1, AddToSelect, false);
	else
	{
		var bRetValue = this.CurCell.Content.Cursor_MoveEndOfLine(AddToSelect);
		if (true === this.CurCell.Content.Is_SelectionUse())
		{
			this.Selection.Use          = true;
			this.Selection.Type         = table_Selection_Text;
			this.Selection.StartPos.Pos = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};
			this.Selection.EndPos.Pos   = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};
		}
		else
		{
			this.Selection.Use = false;
		}

		return bRetValue;
	}
};
CTable.prototype.Cursor_MoveStartOfLine = function(AddToSelect)
{
	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		return this.Cursor_MoveLeft(1, AddToSelect, false);
	else
	{
		var bRetValue = this.CurCell.Content.Cursor_MoveStartOfLine(AddToSelect);
		if (true === this.CurCell.Content.Is_SelectionUse())
		{
			this.Selection.Use          = true;
			this.Selection.Type         = table_Selection_Text;
			this.Selection.StartPos.Pos = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};
			this.Selection.EndPos.Pos   = {Cell : this.CurCell.Index, Row : this.CurCell.Row.Index};
		}
		else
		{
			this.Selection.Use = false;
		}

		return bRetValue;
	}
};
CTable.prototype.Cursor_MoveUp_To_LastRow = function(X, Y, AddToSelect)
{
	if (true === AddToSelect)
	{
		if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		{
			var Row  = this.Content[this.Content.length - 1];
			var Cell = null;
			for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++)
			{
				Cell         = Row.Get_Cell(CurCell);
				var CellInfo = Row.Get_CellInfo(CurCell);
				if (X <= CellInfo.X_grid_end)
					break;
			}

			if (null === Cell)
				return true;

			Cell.Content_Set_CurPosXY(X, Y);
			this.CurCell              = Cell;
			this.Selection.EndPos.Pos = {Cell : Cell.Index, Row : Cell.Row.Index};
			this.Internal_Selection_UpdateCells();
		}
		else
		{
			this.Selection.Use          = true;
			this.Selection.Type         = table_Selection_Cell;
			this.Selection.StartPos.Pos = {
				Row  : this.Content.length - 1,
				Cell : this.Content[this.Content.length - 1].Get_CellsCount() - 1
			};
			this.Selection.EndPos.Pos   = {Row : this.Content.length - 1, Cell : 0};

			this.Internal_Selection_UpdateCells();

			// У последней ячейки у первого параграфа, мы выставим RealX, RealY
			var Cell = this.Content[this.Content.length - 1].Get_Cell(0);
			Cell.Content_Set_CurPosXY(X, Y);
		}
	}
	else
	{
		this.Selection_Remove();
		var Row  = this.Content[this.Content.length - 1];
		var Cell = null;
		for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++)
		{
			Cell         = Row.Get_Cell(CurCell);
			var CellInfo = Row.Get_CellInfo(CurCell);
			if (X <= CellInfo.X_grid_end)
				break;
		}

		if (null === Cell)
			return;
		Cell = this.Internal_Get_StartMergedCell2(Cell.Index, Cell.Row.Index);
		Cell.Content_Cursor_MoveUp_To_LastRow(X, Y, false);
		this.Selection.CurRow = Cell.Row.Index;

		this.CurCell = Cell;
	}
};
CTable.prototype.Cursor_MoveDown_To_FirstRow = function(X, Y, AddToSelect)
{
	if (true === AddToSelect)
	{
		if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		{
			var Row  = this.Content[0];
			var Cell = null;
			for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++)
			{
				Cell         = Row.Get_Cell(CurCell);
				var CellInfo = Row.Get_CellInfo(CurCell);
				if (X <= CellInfo.X_grid_end)
					break;
			}

			if (null === Cell)
				return true;

			Cell.Content_Set_CurPosXY(X, Y);
			this.CurCell              = Cell;
			this.Selection.EndPos.Pos = {Cell : Cell.Index, Row : Cell.Row.Index};
			this.Internal_Selection_UpdateCells();
		}
		else
		{
			this.Selection.Use          = true;
			this.Selection.Type         = table_Selection_Cell;
			this.Selection.StartPos.Pos = {Row : 0, Cell : 0};
			this.Selection.EndPos.Pos   = {Row : 0, Cell : this.Content[0].Get_CellsCount() - 1};

			this.Internal_Selection_UpdateCells();

			// У последней ячейки у первого параграфа, мы выставим RealX, RealY
			var Cell = this.Content[0].Get_Cell(0);
			Cell.Content_Set_CurPosXY(X, Y);
		}
	}
	else
	{
		this.Selection_Remove();
		var Row  = this.Content[0];
		var Cell = null;
		for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++)
		{
			Cell         = Row.Get_Cell(CurCell);
			var CellInfo = Row.Get_CellInfo(CurCell);
			if (X <= CellInfo.X_grid_end)
				break;
		}

		if (null === Cell)
			return;

		Cell.Content_Cursor_MoveDown_To_FirstRow(X, Y, false);
		this.Selection.CurRow = Cell.Row.Index;
		this.CurCell          = Cell;
	}
};
CTable.prototype.Cursor_MoveToCell = function(bNext)
{
	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		var Pos             = this.Selection.Data[0];
		this.Selection.Type = table_Selection_Text;
		this.CurCell        = this.Content[Pos.Row].Get_Cell(Pos.Cell);
		this.CurCell.Content.Select_All();
	}
	else
	{
		if (true === this.Is_InnerTable())
			return this.CurCell.Content.Cursor_MoveToCell(bNext);

		var CurCell = this.CurCell;
		var Pos_c   = this.CurCell.Index;
		var Pos_r   = this.CurCell.Row.Index;
		var Pos     =
				{
					Cell : Pos_c,
					Row  : Pos_r
				};

		if (true === bNext)
		{
			var TempCell = this.Internal_Get_NextCell(Pos);
			while (null != TempCell && vmerge_Restart != TempCell.Get_VMerge())
				TempCell = this.Internal_Get_NextCell(Pos);

			if (null != TempCell)
				CurCell = TempCell;
			else
			{
				if (false == editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_None, {
						Type      : AscCommon.changestype_2_Element_and_Type,
						Element   : this,
						CheckType : AscCommon.changestype_Table_Properties
					}))
				{
					History.Create_NewPoint(AscDFH.historydescription_Document_TableAddNewRowByTab);
					this.Row_Add(false);
				}
				else
					return;

				var TempCell = this.Internal_Get_NextCell(Pos);
				while (null != TempCell && vmerge_Restart != TempCell.Get_VMerge())
					TempCell = this.Internal_Get_NextCell(Pos);

				if (null != TempCell)
					CurCell = TempCell;
			}
		}
		else
		{
			var TempCell = this.Internal_Get_PrevCell(Pos);
			while (null != TempCell && vmerge_Restart != TempCell.Get_VMerge())
				TempCell = this.Internal_Get_PrevCell(Pos);

			if (null != TempCell)
				CurCell = TempCell;
		}

		// Предварительно очистим текущий селект
		editor.WordControl.m_oLogicDocument.Selection_Remove();

		this.CurCell = CurCell;
		this.CurCell.Content.Select_All();

		if (true === this.CurCell.Content.Selection_IsEmpty(false))
		{
			this.CurCell.Content.Cursor_MoveToStartPos();

			this.Selection.Use    = false;
			this.Selection.Type   = table_Selection_Text;
			this.Selection.CurRow = CurCell.Row.Index;
		}
		else
		{
			this.Selection.Use          = true;
			this.Selection.Type         = table_Selection_Text;
			this.Selection.StartPos.Pos = {Row : CurCell.Row.Index, Cell : CurCell.Index};
			this.Selection.EndPos.Pos   = {Row : CurCell.Row.Index, Cell : CurCell.Index};
			this.Selection.CurRow       = CurCell.Row.Index;
		}

		this.Document_SetThisElementCurrent(true);
	}
};
CTable.prototype.Get_CurPosXY = function()
{
	var Cell = null;
	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		Cell = this.Content[this.Selection.EndPos.Pos.Row].Get_Cell(this.Selection.EndPos.Pos.Cell);
	else
		Cell = this.CurCell;

	return Cell.Content_Get_CurPosXY();
};
CTable.prototype.Is_SelectionUse = function()
{
	if ((true == this.Selection.Use && table_Selection_Cell == this.Selection.Type) || table_Selection_Border == this.Selection.Type2 || table_Selection_Border_InnerTable == this.Selection.Type2)
		return true;
	else if (true == this.Selection.Use)
		return this.CurCell.Content.Is_SelectionUse();

	return false;
};
CTable.prototype.Is_TextSelectionUse = function()
{
	if ((true == this.Selection.Use && table_Selection_Cell == this.Selection.Type) || table_Selection_Border == this.Selection.Type2 || table_Selection_Border_InnerTable == this.Selection.Type2)
		return true;
	else if (true == this.Selection.Use)
		return this.CurCell.Content.Is_TextSelectionUse();

	return false;
};
CTable.prototype.Get_SelectedText = function(bClearText, oPr)
{
	if (true === bClearText && ( (true == this.Selection.Use && table_Selection_Text == this.Selection.Type) || false === this.Selection.Use ))
		return this.CurCell.Content.Get_SelectedText(true, oPr);
	else if (false === bClearText)
	{
		if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		{
			var Count      = this.Selection.Data.length;
			var ResultText = "";
			for (var Index = 0; Index < Count; Index++)
			{
				var Pos  = this.Selection.Data[Index];
				var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);

				Cell.Content.Set_ApplyToAll(true);
				ResultText += Cell.Content.Get_SelectedText(false, oPr);
				Cell.Content.Set_ApplyToAll(false);
			}

			return ResultText;
		}
		else
			return this.CurCell.Content.Get_SelectedText(false, oPr);
	}

	return null;
};
CTable.prototype.Get_SelectedElementsInfo = function(Info)
{
	Info.Set_Table();

	if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type))
	{
		this.CurCell.Content.Get_SelectedElementsInfo(Info);
	}
	else if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.StartPos.Pos.Row === this.Selection.EndPos.Pos.Row && this.Selection.StartPos.Pos.Cell === this.Selection.EndPos.Pos.Cell)
	{
		var Row = this.Get_Row(this.Selection.StartPos.Pos.Row);
		if (!Row)
			return;

		var Cell = Row.Get_Cell(this.Selection.StartPos.Pos.Cell);
		if (!Cell)
			return;

		Info.Set_SingleCell(Cell);
	}
};
CTable.prototype.Get_SelectedContent = function(SelectedContent)
{
	if (true !== this.Selection.Use)
		return;

	if (table_Selection_Cell === this.Selection.Type || true === this.ApplyToAll)
	{
		// Сначала проверим выделена ли таблица целиком, если да, тогда просто копируем ее.
		if (true === this.ApplyToAll)
		{
			SelectedContent.Add(new CSelectedElement(this.Copy(this.Parent), true));
			return;
		}

		var bAllSelected  = true;
		var SelectedCount = this.Selection.Data.length;

		// Собираем информацию по строкам
		var RowsInfoArray = [];

		var RowsCount = this.Content.length;
		for (var CurRow = 0; CurRow < RowsCount; CurRow++)
		{
			var Row        = this.Content[CurRow];
			var CellsCount = Row.Get_CellsCount();

			var CellsInfoArray = [];

			var bSelectedRow = false;

			CellsInfoArray.push({GridSpan : Row.Get_Before().GridBefore, Cell : null, Selected : false});

			for (var CurCell = 0; CurCell < CellsCount; CurCell++)
			{
				var Cell     = Row.Get_Cell(CurCell);
				var GridSpan = Cell.Get_GridSpan();
				var VMerge   = Cell.Get_VMerge();

				var bSelected = false;
				if (VMerge === vmerge_Restart)
				{
					// Ищем текущую ячейку среди выделенных

					for (var Index = 0; Index < SelectedCount; Index++)
					{
						var TempPos = this.Selection.Data[Index];
						if (CurCell === TempPos.Cell && CurRow === TempPos.Row)
						{
							bSelected = true;
							break;
						}
						else if (CurRow < TempPos.Row)
							break;
					}
				}
				else
				{
					// Данная ячейка попала в вертикальное объединение, находим ячейку, с которой это объединение
					// началось и проверяем была ли она выделена (эту ячейку мы уже проверяли, т.к. она находится
					// выше).

					var StartMergedCell = this.Internal_Get_StartMergedCell2(CurCell, CurRow);
					bSelected           = RowsInfoArray[StartMergedCell.Row.Index].CellsInfoArray[StartMergedCell.Index + 1].Selected;
				}

				if (false === bSelected)
					bAllSelected = false;
				else
					bSelectedRow = true;

				CellsInfoArray.push({GridSpan : GridSpan, Cell : Cell, Selected : bSelected});
			}

			CellsInfoArray.push({GridSpan : Row.Get_After().GridAfter, Cell : null, Selected : false});

			RowsInfoArray.push({CellsInfoArray : CellsInfoArray, Selected : bSelectedRow});
		}

		if (true === bAllSelected)
		{
			SelectedContent.Add(new CSelectedElement(this.Copy(this.Parent), true));
			return;
		}


		var TableGrid = this.Internal_Copy_Grid(this.TableGridCalc);

		// Посчитаем сколько слева и справа пустых спанов
		var MinBefore = -1;
		var MinAfter  = -1;
		for (var CurRow = 0; CurRow < RowsCount; CurRow++)
		{
			var CellsInfoArray = RowsInfoArray[CurRow].CellsInfoArray;

			if (true !== RowsInfoArray[CurRow].Selected)
				continue;

			var bBefore        = true;
			var BeforeGrid     = 0, AfterGrid = 0;
			var CellsInfoCount = CellsInfoArray.length;
			for (var CellIndex = 0, CurCell = 0; CellIndex < CellsInfoCount; CellIndex++)
			{
				var CellInfo = CellsInfoArray[CellIndex];
				if (true === CellInfo.Selected)
				{
					bBefore = false;
				}
				else if (true === bBefore)
				{
					BeforeGrid += CellInfo.GridSpan;
				}
				else
				{
					AfterGrid += CellInfo.GridSpan;
				}
			}

			if (MinBefore > BeforeGrid || -1 === MinBefore)
				MinBefore = BeforeGrid;

			if (MinAfter > AfterGrid || -1 === MinAfter)
				MinAfter = AfterGrid;
		}

		for (var CurRow = 0; CurRow < RowsCount; CurRow++)
		{
			var CellsInfoArray = RowsInfoArray[CurRow].CellsInfoArray;

			if (true === RowsInfoArray[CurRow].Selected)
			{
				CellsInfoArray[0].GridSpan -= MinBefore;
				CellsInfoArray[CellsInfoArray.length - 1].GridSpan -= MinAfter;
			}
		}

		if (MinAfter > 0)
			TableGrid.splice(TableGrid.length - MinAfter, MinAfter); // TableGrid.length - (MinAfter - 1) - 1

		if (MinBefore > 0)
			TableGrid.splice(0, MinBefore);

		// Формируем новую таблицу, по выделенно части.
		var Table = new CTable(this.DrawingDocument, this.Parent, this.Inline, 0, 0, 0, 0, 0, 0, 0, TableGrid);

		// Копируем настройки
		Table.Set_TableStyle(this.TableStyle);
		Table.Set_TableLook(this.TableLook.Copy());
		Table.Set_PositionH(this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value);
		Table.Set_PositionV(this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value);
		Table.Set_Distance(this.Distance.L, this.Distance.T, this.Distance.R, this.Distance.B);
		Table.Set_Pr(this.Pr.Copy());

		// Копируем строки
		for (var CurRow = 0, CurRow2 = 0; CurRow < RowsCount; CurRow++)
		{
			var RowInfo = RowsInfoArray[CurRow];
			if (true !== RowInfo.Selected)
				continue;

			var CellsInfoArray = RowInfo.CellsInfoArray;

			var Row = new CTableRow(Table, 0);

			// Копируем настройки строки
			Row.Set_Pr(this.Content[CurRow].Pr.Copy());

			var bMergedRow     = true;
			var bBefore        = true;
			var BeforeGrid     = 0, AfterGrid = 0;
			var CellsInfoCount = CellsInfoArray.length;
			for (var CellIndex = 0, CurCell = 0; CellIndex < CellsInfoCount; CellIndex++)
			{
				var CellInfo = CellsInfoArray[CellIndex];
				if (true === CellInfo.Selected)
				{
					bBefore = false;

					// Добавляем ячейку
					Row.Content[CurCell] = CellInfo.Cell.Copy(Row);
					History.Add(new CChangesTableRowAddCell(Row, CurCell, [Row.Content[CurCell]]));
					CurCell++;

					var VMerge = CellInfo.Cell.Get_VMerge();
					if (VMerge === vmerge_Restart)
						bMergedRow = false;
				}
				else if (true === bBefore)
				{
					BeforeGrid += CellInfo.GridSpan;
				}
				else
				{
					AfterGrid += CellInfo.GridSpan;
				}
			}

			// Строку, составленную полностью из вертикально объединенных ячеек не добавляем
			if (true === bMergedRow)
				continue;

			Row.Set_Before(BeforeGrid);
			Row.Set_After(AfterGrid);

			Row.Internal_ReIndexing();

			// Добавляем строку в новую таблицу
			Table.Content[CurRow2] = Row;
			History.Add(new CChangesTableAddRow(Table, CurRow2, [Table.Content[CurRow2]]));
			CurRow2++;
		}

		Table.Internal_ReIndexing(0);

		if (Table.Content.length > 0 && Table.Content[0].Get_CellsCount() > 0)
			Table.CurCell = Table.Content[0].Get_Cell(0);

		SelectedContent.Add(new CSelectedElement(Table, false));
	}
	else
	{
		this.CurCell.Content.Get_SelectedContent(SelectedContent);
	}
};
CTable.prototype.Set_ParagraphPrOnAdd = function(Para)
{
	this.ApplyToAll = true;

	// Добавляем стиль во все параграфы
	var PStyleId = Para.Style_Get();
	if (undefined !== PStyleId && null !== this.LogicDocument)
	{
		var Styles = this.LogicDocument.Get_Styles();
		this.Set_ParagraphStyle(Styles.Get_Name(PStyleId));
	}

	// Добавляем текстовые настройки во все параграфы
	var TextPr = Para.Get_TextPr();
	this.Paragraph_Add(new ParaTextPr(TextPr));

	this.ApplyToAll = false;
};
CTable.prototype.Set_ParagraphAlign = function(Align)
{
	if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphAlign(Align);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Set_ParagraphAlign(Align);
};
CTable.prototype.Set_ParagraphSpacing = function(Spacing)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphSpacing(Spacing);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Set_ParagraphSpacing(Spacing);
};
CTable.prototype.Set_ParagraphIndent = function(Ind)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphIndent(Ind);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Set_ParagraphIndent(Ind);
};
CTable.prototype.Set_ParagraphNumbering = function(NumInfo)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphNumbering(NumInfo);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Set_ParagraphNumbering(NumInfo);
};
CTable.prototype.Set_ParagraphPresentationNumbering = function(NumInfo)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphPresentationNumbering(NumInfo);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Set_ParagraphPresentationNumbering(NumInfo);
};
CTable.prototype.Increase_ParagraphLevel = function(bIncrease)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Increase_ParagraphLevel(bIncrease);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Increase_ParagraphLevel(bIncrease);
};
CTable.prototype.Set_ParagraphShd = function(Shd)
{
	if (true === this.ApplyToAll || (this.LogicDocument && true !== this.LogicDocument.UseTextShd && true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphShd(Shd);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			Cell.Set_Shd(Shd);
		}

		this.ReDraw();
	}
	else
	{
		var CellContent = this.CurCell.Content;
		if (this.LogicDocument && true === this.LogicDocument.UseTextShd && docpostype_Content === CellContent.Get_DocPosType() && true !== CellContent.Selection.Use && type_Paragraph === CellContent.Content[CellContent.CurPos.ContentPos].GetType())
		{
			this.CurCell.Set_Shd(Shd);
			this.CurCell.Content.ReDraw();
		}
		else
			return this.CurCell.Content.Set_ParagraphShd(Shd);
	}
};
CTable.prototype.Set_ParagraphStyle = function(Name)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphStyle(Name);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Set_ParagraphStyle(Name);
};
CTable.prototype.Set_ParagraphTabs = function(Tabs)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphTabs(Tabs);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Set_ParagraphTabs(Tabs);
};
CTable.prototype.Set_ParagraphContextualSpacing = function(Value)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphContextualSpacing(Value);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Set_ParagraphContextualSpacing(Value);
};
CTable.prototype.Set_ParagraphPageBreakBefore = function(Value)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphPageBreakBefore(Value);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Set_ParagraphPageBreakBefore(Value);
};
CTable.prototype.Set_ParagraphKeepLines = function(Value)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphKeepLines(Value);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Set_ParagraphKeepLines(Value);
};
CTable.prototype.Set_ParagraphKeepNext = function(Value)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphKeepNext(Value);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Set_ParagraphKeepNext(Value);
};
CTable.prototype.Set_ParagraphWidowControl = function(Value)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphWidowControl(Value);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Set_ParagraphWidowControl(Value);
};
CTable.prototype.Set_ParagraphBorders = function(Borders)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Set_ParagraphBorders(Borders);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Set_ParagraphBorders(Borders);
};
CTable.prototype.Paragraph_IncDecFontSize = function(bIncrease)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Paragraph_IncDecFontSize(bIncrease);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Paragraph_IncDecFontSize(bIncrease);
};
CTable.prototype.Paragraph_IncDecIndent = function(bIncrease)
{
	if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
	{
		var Cells_array = this.Internal_Get_SelectionArray();
		for (var Index = 0; Index < Cells_array.length; Index++)
		{
			var Pos  = Cells_array[Index];
			var Row  = this.Content[Pos.Row];
			var Cell = Row.Get_Cell(Pos.Cell);

			var Cell_Content = Cell.Content;
			Cell_Content.Set_ApplyToAll(true);
			Cell.Content.Paragraph_IncDecIndent(bIncrease);
			Cell_Content.Set_ApplyToAll(false);
		}

		if (Cells_array[0].Row - 1 >= 0)
			this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
		else
		{
			this.Internal_Recalculate_1();
		}
	}
	else
		return this.CurCell.Content.Paragraph_IncDecIndent(bIncrease);
};
CTable.prototype.Get_Paragraph_ParaPr = function()
{
	if (true === this.ApplyToAll)
	{
		var Row  = this.Content[0];
		var Cell = Row.Get_Cell(0);

		Cell.Content.Set_ApplyToAll(true);
		var Result_ParaPr = Cell.Content.Get_Paragraph_ParaPr();
		Cell.Content.Set_ApplyToAll(false);

		for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
		{
			Row            = this.Content[CurRow];
			var CellsCount = Row.Get_CellsCount();
			var StartCell  = ( CurRow === 0 ? 1 : 0 );

			for (var CurCell = StartCell; CurCell < CellsCount; CurCell++)
			{
				Cell = Row.Get_Cell(CurCell);
				Cell.Content.Set_ApplyToAll(true);
				var CurPr = Cell.Content.Get_Paragraph_ParaPr();
				Cell.Content.Set_ApplyToAll(false);

				Result_ParaPr = Result_ParaPr.Compare(CurPr);
			}
		}

		return Result_ParaPr;
	}

	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		var Pos  = this.Selection.Data[0];
		var Row  = this.Content[Pos.Row];
		var Cell = Row.Get_Cell(Pos.Cell);

		Cell.Content.Set_ApplyToAll(true);
		var Result_ParaPr = Cell.Content.Get_Paragraph_ParaPr();
		Cell.Content.Set_ApplyToAll(false);

		for (var Index = 1; Index < this.Selection.Data.length; Index++)
		{
			Pos  = this.Selection.Data[Index];
			Row  = this.Content[Pos.Row];
			Cell = Row.Get_Cell(Pos.Cell);

			Cell.Content.Set_ApplyToAll(true);
			var CurPr = Cell.Content.Get_Paragraph_ParaPr();
			Cell.Content.Set_ApplyToAll(false);

			Result_ParaPr = Result_ParaPr.Compare(CurPr);
		}

		return Result_ParaPr;
	}

	return this.CurCell.Content.Get_Paragraph_ParaPr();
};
CTable.prototype.Get_Paragraph_TextPr = function()
{
	if (true === this.ApplyToAll)
	{
		var Row  = this.Content[0];
		var Cell = Row.Get_Cell(0);

		Cell.Content.Set_ApplyToAll(true);
		var Result_TextPr = Cell.Content.Get_Paragraph_TextPr();
		Cell.Content.Set_ApplyToAll(false);

		for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
		{
			Row            = this.Content[CurRow];
			var CellsCount = Row.Get_CellsCount();
			var StartCell  = ( CurRow === 0 ? 1 : 0 );

			for (var CurCell = StartCell; CurCell < CellsCount; CurCell++)
			{
				Cell = Row.Get_Cell(CurCell);
				Cell.Content.Set_ApplyToAll(true);
				var CurPr = Cell.Content.Get_Paragraph_TextPr();
				Cell.Content.Set_ApplyToAll(false);

				Result_TextPr = Result_TextPr.Compare(CurPr);
			}
		}

		return Result_TextPr;
	}

	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		var Pos  = this.Selection.Data[0];
		var Row  = this.Content[Pos.Row];
		var Cell = Row.Get_Cell(Pos.Cell);

		Cell.Content.Set_ApplyToAll(true);
		var Result_TextPr = Cell.Content.Get_Paragraph_TextPr();
		Cell.Content.Set_ApplyToAll(false);

		for (var Index = 1; Index < this.Selection.Data.length; Index++)
		{
			Pos  = this.Selection.Data[Index];
			Row  = this.Content[Pos.Row];
			Cell = Row.Get_Cell(Pos.Cell);

			Cell.Content.Set_ApplyToAll(true);
			var CurPr = Cell.Content.Get_Paragraph_TextPr();
			Cell.Content.Set_ApplyToAll(false);

			Result_TextPr = Result_TextPr.Compare(CurPr);
		}

		return Result_TextPr;
	}

	return this.CurCell.Content.Get_Paragraph_TextPr();
};
CTable.prototype.Get_Paragraph_TextPr_Copy = function()
{
	if (true === this.ApplyToAll)
	{
		var Row  = this.Content[0];
		var Cell = Row.Get_Cell(0);

		Cell.Content.Set_ApplyToAll(true);
		var Result_TextPr = Cell.Content.Get_Paragraph_TextPr_Copy();
		Cell.Content.Set_ApplyToAll(false);

		return Result_TextPr;
	}

	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		var Pos  = this.Selection.Data[0];
		var Row  = this.Content[Pos.Row];
		var Cell = Row.Get_Cell(Pos.Cell);

		Cell.Content.Set_ApplyToAll(true);
		var Result_TextPr = Cell.Content.Get_Paragraph_TextPr_Copy();
		Cell.Content.Set_ApplyToAll(false);

		return Result_TextPr;
	}

	return this.CurCell.Content.Get_Paragraph_TextPr_Copy();
};
CTable.prototype.Get_Paragraph_ParaPr_Copy = function()
{
	if (true === this.ApplyToAll)
	{
		var Row  = this.Content[0];
		var Cell = Row.Get_Cell(0);

		Cell.Content.Set_ApplyToAll(true);
		var Result_TextPr = Cell.Content.Get_Paragraph_ParaPr_Copy();
		Cell.Content.Set_ApplyToAll(false);

		return Result_TextPr;
	}

	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		var Pos  = this.Selection.Data[0];
		var Row  = this.Content[Pos.Row];
		var Cell = Row.Get_Cell(Pos.Cell);

		Cell.Content.Set_ApplyToAll(true);
		var Result_TextPr = Cell.Content.Get_Paragraph_ParaPr_Copy();
		Cell.Content.Set_ApplyToAll(false);

		return Result_TextPr;
	}

	return this.CurCell.Content.Get_Paragraph_ParaPr_Copy();
};
CTable.prototype.Get_CurrentParagraph = function()
{
	var SelectionArray = this.Internal_Get_SelectionArray();
	if (SelectionArray.length > 0)
	{
		var CurCell = SelectionArray[0].Cell;
		var CurRow  = SelectionArray[0].Row;

		return this.Get_Row(CurRow).Get_Cell(CurCell).Content.Get_CurrentParagraph();
	}

	return null;
};
CTable.prototype.Set_ImageProps = function(Props)
{
	if ((true === this.Selection.Use && table_Selection_Text === this.Selection.Type) || false === this.Selection.Use)
	{
		return this.CurCell.Content.Set_ImageProps(Props);
	}
};
//----------------------------------------------------------------------------------------------------------------------
// Работаем со стилем таблицы
//----------------------------------------------------------------------------------------------------------------------
/**
 * Сообщаем таблице, что ей надо будет пересчитать скомпилированный стиль
 * (Такое может случится, если у данной таблицы задан стиль,
 * который меняется каким-то внешним образом)
 *
 */
CTable.prototype.Recalc_CompiledPr = function()
{
	this.CompiledPr.NeedRecalc = true;
};
CTable.prototype.Recalc_CompiledPr2 = function()
{
	this.Recalc_CompiledPr();

	var RowsCount = this.Content.length;
	for (var CurRow = 0; CurRow < RowsCount; CurRow++)
	{
		var Row = this.Content[CurRow];
		Row.Recalc_CompiledPr();

		var CellsCount = Row.Get_CellsCount();
		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			var Cell = Row.Get_Cell(CurCell);
			Cell.Recalc_CompiledPr();
		}
	}
};
/**
 * Формируем конечные свойства параграфа на основе стиля и прямых настроек.
 */
CTable.prototype.Get_CompiledPr = function(bCopy)
{
	if (true === this.CompiledPr.NeedRecalc)
	{
		if (true === AscCommon.g_oIdCounter.m_bLoad && true === AscCommon.g_oIdCounter.m_bRead)
		{
			this.CompiledPr.Pr         = {
				TextPr : g_oDocumentDefaultTextPr,
				ParaPr : g_oDocumentDefaultParaPr,

				TablePr     : g_oDocumentDefaultTablePr,
				TableRowPr  : g_oDocumentDefaultTableRowPr,
				TableCellPr : g_oDocumentDefaultTableCellPr,

				TableFirstCol   : g_oDocumentDefaultTableStylePr,
				TableFirstRow   : g_oDocumentDefaultTableStylePr,
				TableLastCol    : g_oDocumentDefaultTableStylePr,
				TableLastRow    : g_oDocumentDefaultTableStylePr,
				TableBand1Horz  : g_oDocumentDefaultTableStylePr,
				TableBand1Vert  : g_oDocumentDefaultTableStylePr,
				TableBand2Horz  : g_oDocumentDefaultTableStylePr,
				TableBand2Vert  : g_oDocumentDefaultTableStylePr,
				TableTLCell     : g_oDocumentDefaultTableStylePr,
				TableTRCell     : g_oDocumentDefaultTableStylePr,
				TableBLCell     : g_oDocumentDefaultTableStylePr,
				TableBRCell     : g_oDocumentDefaultTableStylePr,
				TableWholeTable : g_oDocumentDefaultTableStylePr
			};
			this.CompiledPr.NeedRecalc = true;
		}
		else
		{
			this.CompiledPr.Pr         = this.Internal_Compile_Pr();
			this.CompiledPr.NeedRecalc = false;
		}
	}

	if (false === bCopy)
		return this.CompiledPr.Pr;
	else
	{
		var Pr    = {};
		Pr.TextPr = this.CompiledPr.Pr.TextPr.Copy();
		Pr.ParaPr = this.CompiledPr.Pr.ParaPr.Copy();

		Pr.TablePr     = this.CompiledPr.Pr.TablePr.Copy();
		Pr.TableRowPr  = this.CompiledPr.Pr.TableRowPr.Copy();
		Pr.TableCellPr = this.CompiledPr.Pr.TableCellPr.Copy();

		Pr.TableFirstCol   = this.CompiledPr.Pr.TableFirstCol.Copy();
		Pr.TableFirstRow   = this.CompiledPr.Pr.TableFirstRow.Copy();
		Pr.TableLastCol    = this.CompiledPr.Pr.TableLastCol.Copy();
		Pr.TableLastRow    = this.CompiledPr.Pr.TableLastRow.Copy();
		Pr.TableBand1Horz  = this.CompiledPr.Pr.TableBand1Horz.Copy();
		Pr.TableBand1Vert  = this.CompiledPr.Pr.TableBand1Vert.Copy();
		Pr.TableBand2Horz  = this.CompiledPr.Pr.TableBand2Horz.Copy();
		Pr.TableBand2Vert  = this.CompiledPr.Pr.TableBand2Vert.Copy();
		Pr.TableTLCell     = this.CompiledPr.Pr.TableTLCell.Copy();
		Pr.TableTRCell     = this.CompiledPr.Pr.TableTRCell.Copy();
		Pr.TableBLCell     = this.CompiledPr.Pr.TableBLCell.Copy();
		Pr.TableBRCell     = this.CompiledPr.Pr.TableBRCell.Copy();
		Pr.TableWholeTable = this.CompiledPr.Pr.TableWholeTable.Copy();

		return Pr; // Отдаем копию объекта, чтобы никто не поменял извне настройки стиля
	}
};
CTable.prototype.Get_Style = function()
{
	if ("undefined" != typeof(this.TableStyle))
		return this.TableStyle;

	return null;
};
CTable.prototype.Set_Style = function(Id)
{
	this.Style_Remove();
	if (null === Id)
		return;

	// Если стиль является стилем по умолчанию для таблицы, тогда не надо его записывать.
	if (Id != this.Get_Styles().Get_Default_Table())
		this.TableStyle = Id;

	// Надо пересчитать конечный стиль
	this.CompiledPr.NeedRecalc = true;
};
CTable.prototype.Remove_Style = function()
{
	if ("undefined" != typeof(this.TableStyle))
		delete this.TableStyle;

	// Надо пересчитать конечный стиль
	this.CompiledPr.NeedRecalc = true;
};
CTable.prototype.Numbering_IsUse = function(NumId, NumLvl)
{
	return false;
};
/**
 * Формируем конечные свойства таблицы на основе стиля и прямых настроек.
 */
CTable.prototype.Internal_Compile_Pr = function()
{
	var Styles  = this.Get_Styles();
	var StyleId = this.Get_Style();

	// Считываем свойства для текущего стиля
	var Pr = Styles.Get_Pr(StyleId, styletype_Table);
	if (this.bPresentation)
	{
		this.Check_PresentationPr(Pr);
	}
	// Копируем прямые настройки параграфа.
	Pr.TablePr.Merge(this.Pr);

	return Pr;
};
CTable.prototype.Check_PresentationPr = function(Pr)
{
	var Theme = this.Get_Theme();
	Pr.TablePr.Check_PresentationPr(Theme);
	Pr.TextPr.Check_PresentationPr(Theme);
	Pr.TableCellPr.Check_PresentationPr(Theme);
	Pr.TableFirstCol.Check_PresentationPr(Theme);
	Pr.TableFirstRow.Check_PresentationPr(Theme);
	Pr.TableLastCol.Check_PresentationPr(Theme);
	Pr.TableLastRow.Check_PresentationPr(Theme);
	Pr.TableBand1Horz.Check_PresentationPr(Theme);
	Pr.TableBand1Vert.Check_PresentationPr(Theme);
	Pr.TableBand2Horz.Check_PresentationPr(Theme);
	Pr.TableBand2Vert.Check_PresentationPr(Theme);
	Pr.TableTLCell.Check_PresentationPr(Theme);
	Pr.TableTRCell.Check_PresentationPr(Theme);
	Pr.TableBLCell.Check_PresentationPr(Theme);
	Pr.TableBRCell.Check_PresentationPr(Theme);
};
//----------------------------------------------------------------------------------------------------------------------
// Устанавливаем прямые настройки таблицы
//----------------------------------------------------------------------------------------------------------------------
CTable.prototype.Clear_DirectFormatting = function(bClearMerge)
{
	// Очищаем все прямые настройки таблицы, всех ее строк и всех ее ячеек

	this.Set_TableStyleRowBandSize(undefined);
	this.Set_TableStyleColBandSize(undefined);
	this.Set_TableAlign(undefined);
	this.Set_TableShd(undefined);
	this.Set_TableBorder_Bottom(undefined);
	this.Set_TableBorder_Left(undefined);
	this.Set_TableBorder_Right(undefined);
	this.Set_TableBorder_Top(undefined);
	this.Set_TableBorder_InsideV(undefined);
	this.Set_TableBorder_InsideH(undefined);
	this.Set_TableCellMar(undefined, undefined, undefined, undefined);
	this.Set_TableInd(undefined);

	if (false !== bClearMerge)
		this.Set_TableW(undefined, undefined);

	var Count = this.Content.length;
	for (var Index = 0; Index < Count; Index++)
	{
		this.Content[Index].Clear_DirectFormatting(bClearMerge);
	}
};
CTable.prototype.Set_Pr = function(TablePr)
{
	History.Add(new CChangesTablePr(this, this.Pr, TablePr));
	this.Pr = TablePr;
	this.Recalc_CompiledPr2();
};
CTable.prototype.Set_TableStyle = function(StyleId, bNoClearFormatting)
{
	// Здесь мы не проверяем изменился ли стиль, потому что при выставлении стиля нужно сбрасывать
	// прямые настройки, даже если мы выставляем тот же самый стиль.

	History.Add(new CChangesTableTableStyle(this, this.TableStyle, StyleId));
	this.TableStyle = StyleId;

	// Очищаем все прямое форматирование таблицы
	if (!(bNoClearFormatting === true))
	{
		this.Clear_DirectFormatting(false);
	}
	this.Recalc_CompiledPr2();
};
CTable.prototype.Set_TableStyle2 = function(StyleId)
{
	if (this.TableStyle != StyleId)
	{
		History.Add(new CChangesTableTableStyle(this, this.TableStyle, StyleId));
		this.TableStyle = StyleId;

		this.Recalc_CompiledPr2();
	}
};
CTable.prototype.Get_TableStyle = function()
{
	return this.TableStyle;
};
CTable.prototype.Set_TableLook = function(TableLook)
{
	History.Add(new CChangesTableTableLook(this, this.TableLook, TableLook));
	this.TableLook = TableLook;
	this.Recalc_CompiledPr2();
};
CTable.prototype.Get_TableLook = function()
{
	return this.TableLook;
};
CTable.prototype.Set_AllowOverlap = function(AllowOverlap)
{
	History.Add(new CChangesTableAllowOverlap(this, this.AllowOverlap, AllowOverlap));
	this.AllowOverlap = AllowOverlap;
};
CTable.prototype.Get_AllowOverlap = function()
{
	return this.AllowOverlap;
};
CTable.prototype.Set_PositionH = function(RelativeFrom, Align, Value)
{
	History.Add(new CChangesTablePositionH(this,
		{
			RelativeFrom : this.PositionH.RelativeFrom,
			Align        : this.PositionH.Align,
			Value        : this.PositionH.Value
		},
		{
			RelativeFrom : RelativeFrom,
			Align        : Align,
			Value        : Value
		}));

	this.PositionH.RelativeFrom = RelativeFrom;
	this.PositionH.Align        = Align;
	this.PositionH.Value        = Value;
};
CTable.prototype.Set_PositionV = function(RelativeFrom, Align, Value)
{
	History.Add(new CChangesTablePositionV(this,
		{
			RelativeFrom : this.PositionV.RelativeFrom,
			Align        : this.PositionV.Align,
			Value        : this.PositionV.Value
		},
		{
			RelativeFrom : RelativeFrom,
			Align        : Align,
			Value        : Value
		}));

	this.PositionV.RelativeFrom = RelativeFrom;
	this.PositionV.Align        = Align;
	this.PositionV.Value        = Value;
};
CTable.prototype.Set_Distance = function(L, T, R, B)
{
	if (null === L || undefined === L)
		L = this.Distance.L;

	if (null === T || undefined === T)
		T = this.Distance.T;

	if (null === R || undefined === R)
		R = this.Distance.R;

	if (null === B || undefined === B)
		B = this.Distance.B;

	History.Add(new CChangesTableDistance(this, {
		Left   : this.Distance.L,
		Top    : this.Distance.T,
		Right  : this.Distance.R,
		Bottom : this.Distance.B
	}, {
		Left   : L,
		Top    : T,
		Right  : R,
		Bottom : B
	}));
	this.Distance.L = L;
	this.Distance.R = R;
	this.Distance.T = T;
	this.Distance.B = B;
};
CTable.prototype.Set_TableStyleRowBandSize = function(Value)
{
	if (this.Pr.TableStyleRowBandSize === Value)
		return;

	History.Add(new CChangesTableTableStyleRowBandSize(this, this.Pr.TableStyleRowBandSize, Value));
	this.Pr.TableStyleRowBandSize = Value;
	this.Recalc_CompiledPr();
};
CTable.prototype.Get_TableStyleRowBandSize = function()
{
	var Pr = this.Get_CompiledPr(false).TablePr;
	return Pr.TableStyleRowBandSize;
};
CTable.prototype.Set_TableStyleColBandSize = function(Value)
{
	if (this.Pr.TableStyleColBandSize === Value)
		return;

	History.Add(new CChangesTableTableStyleColBandSize(this, this.Pr.TableStyleColBandSize, Value));
	this.Pr.TableStyleColBandSize = Value;
	this.Recalc_CompiledPr();
};
CTable.prototype.Get_TableStyleColBandSize = function()
{
	var Pr = this.Get_CompiledPr(false).TablePr;
	return Pr.TableStyleColBandSize;
};
CTable.prototype.Get_ShapeStyleForPara = function()
{
	return this.Parent.Get_ShapeStyleForPara();
};
CTable.prototype.Set_TableW = function(Type, W)
{
	if (undefined === Type)
	{
		if (undefined === this.Pr.TableW)
			return;

		History.Add(new CChangesTableTableW(this, this.Pr.TableW, undefined));
		this.Pr.TableW = undefined;
		this.Recalc_CompiledPr();
	}
	else if (undefined === this.Pr.TableW)
	{
		var TableW = new CTableMeasurement(Type, W);
		History.Add(new CChangesTableTableW(this, undefined, TableW));
		this.Pr.TableW = TableW;
		this.Recalc_CompiledPr();
	}
	else if (Type != this.Pr.TableW.Type || Math.abs(this.Pr.TableW.W - W) > 0.001)
	{
		var TableW = new CTableMeasurement(Type, W);
		History.Add(new CChangesTableTableW(this, this.Pr.TableW, TableW));
		this.Pr.TableW = TableW;
		this.Recalc_CompiledPr();
	}
};
CTable.prototype.Get_TableW = function()
{
	var Pr = this.Get_CompiledPr(false).TablePr;
	return Pr.TableW;
};
CTable.prototype.Set_TableLayout = function(Value)
{
	if (this.Pr.TableLayout === Value)
		return;

	History.Add(new CChangesTableTableLayout(this, this.Pr.TableLayout, Value));
	this.Pr.TableLayout = Value;
	this.Recalc_CompiledPr();
};
CTable.prototype.Get_TableLayout = function()
{
	var Pr = this.Get_CompliedPr(false).TablePr;
	return Pr.TableLayout;
};
CTable.prototype.Set_TableCellMar = function(Left, Top, Right, Bottom)
{
	var old_Left   = ( undefined === this.Pr.TableCellMar.Left ? undefined : this.Pr.TableCellMar.Left   );
	var old_Right  = ( undefined === this.Pr.TableCellMar.Right ? undefined : this.Pr.TableCellMar.Right  );
	var old_Top    = ( undefined === this.Pr.TableCellMar.Top ? undefined : this.Pr.TableCellMar.Top    );
	var old_Bottom = ( undefined === this.Pr.TableCellMar.Bottom ? undefined : this.Pr.TableCellMar.Bottom );

	var new_Left   = ( undefined === Left ? undefined : new CTableMeasurement(tblwidth_Mm, Left) );
	var new_Right  = ( undefined === Right ? undefined : new CTableMeasurement(tblwidth_Mm, Right) );
	var new_Top    = ( undefined === Top ? undefined : new CTableMeasurement(tblwidth_Mm, Top) );
	var new_Bottom = ( undefined === Bottom ? undefined : new CTableMeasurement(tblwidth_Mm, Bottom) );

	History.Add(new CChangesTableTableCellMar(this,
		{
			Left   : old_Left,
			Right  : old_Right,
			Top    : old_Top,
			Bottom : old_Bottom
		},
		{
			Left   : new_Left,
			Right  : new_Right,
			Top    : new_Top,
			Bottom : new_Bottom
		})
	);

	this.Pr.TableCellMar.Left   = new_Left;
	this.Pr.TableCellMar.Right  = new_Right;
	this.Pr.TableCellMar.Top    = new_Top;
	this.Pr.TableCellMar.Bottom = new_Bottom;

	this.Recalc_CompiledPr();
};
CTable.prototype.Get_TableCellMar = function()
{
	var Pr = this.Get_CompiledPr(false).TablePr;
	return Pr.TableCellMar;
};
CTable.prototype.Set_TableAlign = function(Align)
{
	if (undefined === Align)
	{
		if (undefined === this.Pr.Jc)
			return;

		History.Add(new CChangesTableTableAlign(this, this.Pr.Jc, undefined));
		this.Pr.Jc = undefined;
		this.Recalc_CompiledPr();
	}
	else if (undefined === this.Pr.Jc)
	{
		History.Add(new CChangesTableTableAlign(this, undefined, Align));
		this.Pr.Jc = Align;
		this.Recalc_CompiledPr();
	}
	else if (Align != this.Pr.Jc)
	{
		History.Add(new CChangesTableTableAlign(this, this.Pr.Jc, Align));
		this.Pr.Jc = Align;
		this.Recalc_CompiledPr();
	}
};
CTable.prototype.Get_TableAlign = function()
{
	var Pr = this.Get_CompiledPr(false).TablePr;
	return Pr.Jc;
};
CTable.prototype.Set_TableInd = function(Ind)
{
	if (undefined === Ind)
	{
		if (undefined === this.Pr.TableInd)
			return;

		History.Add(new CChangesTableTableInd(this, this.Pr.TableInd, undefined));
		this.Pr.TableInd = undefined;
		this.Recalc_CompiledPr();
	}
	else if (undefined === this.Pr.TableInd)
	{
		History.Add(new CChangesTableTableInd(this, undefined, Ind));
		this.Pr.TableInd = Ind;
		this.Recalc_CompiledPr();
	}
	else if (Math.abs(this.Pr.TableInd - Ind) > 0.001)
	{
		History.Add(new CChangesTableTableInd(this, this.Pr.TableInd, Ind));
		this.Pr.TableInd = Ind;
		this.Recalc_CompiledPr();
	}
};
CTable.prototype.Get_TableInd = function()
{
	var Pr = this.Get_CompiledPr(false).TablePr;
	return Pr.TableInd;
};
CTable.prototype.Set_TableBorder_Left = function(Border)
{
	if (undefined === this.Pr.TableBorders.Left && undefined === Border)
		return;

	var _Border = Border;
	if (undefined !== _Border)
	{
		_Border = new CDocumentBorder();
		_Border.Set_FromObject(Border);
	}

	History.Add(new CChangesTableTableBorderLeft(this, this.Pr.TableBorders.Left, _Border));
	this.Pr.TableBorders.Left = _Border;
	this.Recalc_CompiledPr();
};
CTable.prototype.Set_TableBorder_Right = function(Border)
{
	if (undefined === this.Pr.TableBorders.Right && undefined === Border)
		return;

	var _Border = Border;
	if (undefined !== _Border)
	{
		_Border = new CDocumentBorder();
		_Border.Set_FromObject(Border);
	}

	History.Add(new CChangesTableTableBorderRight(this, this.Pr.TableBorders.Right, _Border));
	this.Pr.TableBorders.Right = _Border;
	this.Recalc_CompiledPr();
};
CTable.prototype.Set_TableBorder_Top = function(Border)
{
	if (undefined === this.Pr.TableBorders.Top && undefined === Border)
		return;

	var _Border = Border;
	if (undefined !== _Border)
	{
		_Border = new CDocumentBorder();
		_Border.Set_FromObject(Border);
	}

	History.Add(new CChangesTableTableBorderTop(this, this.Pr.TableBorders.Top, _Border));
	this.Pr.TableBorders.Top = _Border;
	this.Recalc_CompiledPr();
};
CTable.prototype.Set_TableBorder_Bottom = function(Border)
{
	if (undefined === this.Pr.TableBorders.Bottom && undefined === Border)
		return;

	var _Border = Border;
	if (undefined !== _Border)
	{
		_Border = new CDocumentBorder();
		_Border.Set_FromObject(Border);
	}

	History.Add(new CChangesTableTableBorderBottom(this, this.Pr.TableBorders.Bottom, _Border));
	this.Pr.TableBorders.Bottom = _Border;
	this.Recalc_CompiledPr();
};
CTable.prototype.Set_TableBorder_InsideH = function(Border)
{
	if (undefined === this.Pr.TableBorders.InsideH && undefined === Border)
		return;

	var _Border = Border;
	if (undefined !== _Border)
	{
		_Border = new CDocumentBorder();
		_Border.Set_FromObject(Border);
	}

	History.Add(new CChangesTableTableBorderInsideH(this, this.Pr.TableBorders.InsideH, _Border));
	this.Pr.TableBorders.InsideH = _Border;
	this.Recalc_CompiledPr();
};
CTable.prototype.Set_TableBorder_InsideV = function(Border)
{
	if (undefined === this.Pr.TableBorders.InsideV && undefined === Border)
		return;

	var _Border = Border;
	if (undefined !== _Border)
	{
		_Border = new CDocumentBorder();
		_Border.Set_FromObject(Border);
	}

	History.Add(new CChangesTableTableBorderInsideV(this, this.Pr.TableBorders.InsideV, _Border));
	this.Pr.TableBorders.InsideV = _Border;
	this.Recalc_CompiledPr();
};
CTable.prototype.Get_TableBorders = function()
{
	var Pr = this.Get_CompiledPr(false).TablePr;
	return Pr.TableBorders;
};
CTable.prototype.Set_TableShd = function(Value, r, g, b)
{
	if (undefined === Value && undefined === this.Pr.Shd)
		return;

	var _Shd = undefined;
	if (undefined !== Value)
	{
		_Shd       = new CDocumentShd();
		_Shd.Value = Value;
		_Shd.Color.Set(r, g, b);
	}

	History.Add(new CChangesTableTableShd(this, this.Pr.Shd, _Shd));
	this.Pr.Shd = _Shd;
	this.Recalc_CompiledPr();
};
CTable.prototype.Get_Shd = function()
{
	var Pr = this.Get_CompiledPr(false).TablePr;
	return Pr.Shd;
};
CTable.prototype.Get_Borders = function()
{
	return this.Get_TableBorders();
};
CTable.prototype.Set_TableDescription = function(sDescription)
{
	History.Add(new CChangesTableTableDescription(this, this.Pr.TableDescription, sDescription));
	this.Pr.TableDescription = sDescription;
	this.Recalc_CompiledPr();
};
CTable.prototype.Get_TableDescription = function()
{
	var Pr = this.Get_CompiledPr(false).TablePr;
	return Pr.TableDescription;
};
CTable.prototype.Set_TableCaption = function(sCaption)
{
	History.Add(new CChangesTableTableCaption(this, this.Pr.TableCaption, sCaption));
	this.Pr.TableCaption = sCaption;
	this.Recalc_CompiledPr();
};
CTable.prototype.Get_TableCaption = function()
{
	var Pr = this.Get_CompiledPr(false).TablePr;
	return Pr.TableCaption;
};
//----------------------------------------------------------------------------------------------------------------------
// Работаем с сеткой таблицы
//----------------------------------------------------------------------------------------------------------------------
CTable.prototype.Split_Table = function()
{
	// Пока данная функция используется только при добавлении секции. В этом случае мы делим таблицу на 2 части по
	// текущей строке. Если текущая строка первая, тогда не делим таблицу.

	var CurRow = this.CurCell.Row.Index;

	if (0 === CurRow)
		return null;

	var NewTable = new CTable(this.DrawingDocument, this.Parent, this.Inline, 0, 0, 0, 0, 0, 0, 0, this.private_CopyTableGrid());

	var Len = this.Content.length;
	for (var RowIndex = CurRow; RowIndex < Len; RowIndex++)
	{
		NewTable.Internal_Add_Row(RowIndex - CurRow, 0, false, this.Content[CurRow]);
		this.Internal_Remove_Row(CurRow);
	}

	NewTable.ReIndexing(0);
	this.ReIndexing(0);

	NewTable.Set_Pr(this.Pr.Copy());
	NewTable.Set_TableStyle2(this.TableStyle);
	NewTable.Set_TableLook(this.TableLook.Copy());

	// Сбросим селект и текущую позицию в таблицах
	this.Cursor_MoveToStartPos(false);
	NewTable.Cursor_MoveToStartPos(false);

	return NewTable;
};
CTable.prototype.Internal_CheckMerge = function()
{
	var bCanMerge = true;

	var Grid_start = -1;
	var Grid_end   = -1;

	var RowsInfo = [];
	var nRowMin  = -1;
	var nRowMax  = -1;

	for (var Index = 0; Index < this.Selection.Data.length; Index++)
	{
		var Pos  = this.Selection.Data[Index];
		var Row  = this.Content[Pos.Row];
		var Cell = Row.Get_Cell(Pos.Cell);

		var StartGridCol = Row.Get_CellInfo(Pos.Cell).StartGridCol;
		var EndGridCol   = StartGridCol + Cell.Get_GridSpan() - 1;

		var VMergeCount = this.Internal_GetVertMergeCount(Pos.Row, Row.Get_CellInfo(Pos.Cell).StartGridCol, Cell.Get_GridSpan());

		for (var RowIndex = Pos.Row; RowIndex <= Pos.Row + VMergeCount - 1; RowIndex++)
		{
			if ("undefined" === typeof(RowsInfo[RowIndex]))
			{
				RowsInfo[RowIndex] =
					{
						Grid_start : StartGridCol,
						Grid_end   : EndGridCol
					};

				if (-1 === nRowMax || RowIndex > nRowMax)
					nRowMax = RowIndex;

				if (-1 === nRowMin || RowIndex < nRowMin)
					nRowMin = RowIndex;
			}
			else
			{
				if (StartGridCol < RowsInfo[RowIndex].Grid_start)
					RowsInfo[RowIndex].Grid_start = StartGridCol;

				if (EndGridCol > RowsInfo[RowIndex].Grid_end)
					RowsInfo[RowIndex].Grid_end = EndGridCol;
			}
		}
	}

	// Проверим, что селект строк идет без пропусков
	for (var nRowIndex = nRowMin; nRowIndex <= nRowMax; ++nRowIndex)
	{
		if (!RowsInfo[nRowIndex])
		{
			bCanMerge = false;
			break;
		}
	}

	for (var Index in RowsInfo)
	{
		if (-1 === Grid_start)
			Grid_start = RowsInfo[Index].Grid_start;
		else if (Grid_start != RowsInfo[Index].Grid_start)
		{
			bCanMerge = false;
			break;
		}

		if (-1 === Grid_end)
			Grid_end = RowsInfo[Index].Grid_end;
		else if (Grid_end != RowsInfo[Index].Grid_end)
		{
			bCanMerge = false;
			break;
		}
	}

	if (true === bCanMerge)
	{
		// Далее, мы должны убедиться, что у выеделенных ячеек верхние и нижние поля также
		// ровные (т.е. без выступов).
		// Для этого для каждой колонки, попавшей в отрезок [Grid_start, Grid_end] находим
		// верхнюю и нижнюю ячейку и смотрим на верхнюю и нижнюю строки данных ячеек,
		// соответственно

		var TopRow = -1;
		var BotRow = -1;

		for (var GridIndex = Grid_start; GridIndex <= Grid_end; GridIndex++)
		{
			var Pos_top = null;
			var Pos_bot = null;
			for (var Index = 0; Index < this.Selection.Data.length; Index++)
			{
				var Pos  = this.Selection.Data[Index];
				var Row  = this.Content[Pos.Row];
				var Cell = Row.Get_Cell(Pos.Cell);

				var StartGridCol = Row.Get_CellInfo(Pos.Cell).StartGridCol;
				var EndGridCol   = StartGridCol + Cell.Get_GridSpan() - 1;

				if (GridIndex >= StartGridCol && GridIndex <= EndGridCol)
				{
					if (null === Pos_top || Pos_top.Row > Pos.Row)
						Pos_top = Pos;

					if (null === Pos_bot || Pos_bot.Row < Pos.Row)
						Pos_bot = Pos;
				}
			}

			if (null === Pos_top || null === Pos_bot)
			{
				bCanMerge = false;
				break;
			}

			if (-1 === TopRow)
				TopRow = Pos_top.Row;
			else if (TopRow != Pos_top.Row)
			{
				bCanMerge = false;
				break;
			}

			var Row  = this.Content[Pos_bot.Row];
			var Cell = Row.Get_Cell(Pos_bot.Cell);

			var VMergeCount = this.Internal_GetVertMergeCount(Pos_bot.Row, Row.Get_CellInfo(Pos_bot.Cell).StartGridCol, Cell.Get_GridSpan());
			var CurBotRow   = Pos_bot.Row + VMergeCount - 1;

			if (-1 === BotRow)
				BotRow = CurBotRow;
			else if (BotRow != CurBotRow)
			{
				bCanMerge = false;
				break;
			}
		}

		// Объединенные ячейки образуют прямоугольник, но возможно в нем есть вырезы,
		// т.е. выделение такое, что в него попала строка с GridBefore или GridAfter > 0
		if (true === bCanMerge)
		{
			for (var RowIndex = TopRow; RowIndex <= BotRow; RowIndex++)
			{
				var Row         = this.Content[RowIndex];
				var Grid_before = Row.Get_Before().GridBefore;
				var Grid_after  = Row.Get_After().GridAfter;

				if (Grid_after <= 0 && Grid_before <= 0)
					continue;

				if (Grid_start < Grid_before)
				{
					bCanMerge = false;
					break;
				}

				var Cell         = Row.Get_Cell(Row.Get_CellsCount() - 1);
				var Row_grid_end = Cell.Get_GridSpan() - 1 + Row.Get_CellInfo(Row.Get_CellsCount() - 1).StartGridCol;
				if (Grid_end > Row_grid_end)
				{
					bCanMerge = false;
					break;
				}
			}
		}
	}

	return {Grid_start : Grid_start, Grid_end : Grid_end, RowsInfo : RowsInfo, bCanMerge : bCanMerge};
};
/**
 * Объединяем выделенные ячейки таблицы.
 * @param isClearMerge - используем или нет рассчетные данные (true - не используем, false - default value)
 */
CTable.prototype.Cell_Merge = function(isClearMerge)
{
	var bApplyToInnerTable = false;
	if (false === this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
		bApplyToInnerTable = this.CurCell.Content.Table_MergeCells();

	if (true === bApplyToInnerTable)
		return false;

	if (true != this.Selection.Use || table_Selection_Cell != this.Selection.Type || this.Selection.Data.length <= 1)
		return false;

	// В массиве this.Selection.Data идет список ячеек по строкам (без разрывов)
	// Перед объединением мы должны проверить совпадают ли начальная и конечная колонки
	// в сетке TableGrid для каждого ряда.
	var Temp       = this.Internal_CheckMerge();
	var bCanMerge  = Temp.bCanMerge;
	var Grid_start = Temp.Grid_start;
	var Grid_end   = Temp.Grid_end;
	var RowsInfo   = Temp.RowsInfo;

	if (false === bCanMerge)
		return false;

	// Объединяем содержимое всех ячеек в левую верхнюю ячейку. (Все выделенные
	// ячейки идут у нас последовательно, начиная с левой верхней), и объединяем
	// сами ячейки.

	var Pos_tl  = this.Selection.Data[0];
	var Cell_tl = this.Content[Pos_tl.Row].Get_Cell(Pos_tl.Cell);

	for (var Index = 0; Index < this.Selection.Data.length; Index++)
	{
		var Pos  = this.Selection.Data[Index];
		var Row  = this.Content[Pos.Row];
		var Cell = Row.Get_Cell(Pos.Cell);

		// Добавляем содержимое данной ячейки к содержимому левой верхней ячейки
		if (0 != Index)
		{
			Cell_tl.Content_Merge(Cell.Content);
			Cell.Content.Clear_Content();
		}
	}

	if (true !== isClearMerge)
	{
		// Выставим ширину результируещей ячейки
		var SumW = 0;
		for (var CurGridCol = Grid_start; CurGridCol <= Grid_end; CurGridCol++)
		{
			SumW += this.TableGridCalc[CurGridCol];
		}
		Cell_tl.Set_W(new CTableMeasurement(tblwidth_Mm, SumW));
	}

	// Теперь нам надо удалить лишние ячейки и добавить ячейки с
	// вертикальным объединением.
	for (var RowIndex in RowsInfo)
	{
		var Row = this.Content[RowIndex];
		for (var CellIndex = 0; CellIndex < Row.Get_CellsCount(); CellIndex++)
		{
			var Cell_grid_start = Row.Get_CellInfo(CellIndex).StartGridCol;

			if (Grid_start === Cell_grid_start)
			{
				if (RowIndex != Pos_tl.Row)
				{
					var Cell = Row.Get_Cell(CellIndex);
					Cell.Set_GridSpan(Grid_end - Grid_start + 1);
					Cell.Set_VMerge(vmerge_Continue);
				}
				else
				{
					Cell_tl.Set_GridSpan(Grid_end - Grid_start + 1);
				}
			}
			else if (Cell_grid_start > Grid_start && Cell_grid_start <= Grid_end)
			{
				Row.Remove_Cell(CellIndex);
				CellIndex--;
			}
			else if (Cell_grid_start > Grid_end)
				break;
		}
	}

	// Удаляем лишние строки
	this.Internal_Check_TableRows(true !== isClearMerge ? true : false);
	for (var PageNum = 0; PageNum < this.Pages.length - 1; PageNum++)
	{
		if (Pos_tl.Row <= this.Pages[PageNum + 1].FirstRow)
			break;
	}

	// Выделяем полученную ячейку
	this.Selection.Use          = true;
	this.Selection.StartPos.Pos = Pos_tl;
	this.Selection.EndPos.Pos   = Pos_tl;
	this.Selection.Type         = table_Selection_Cell;
	this.Selection.Data         = [Pos_tl];

	this.CurCell = Cell_tl;

	if (true !== isClearMerge)
	{
		// Запускаем пересчет
		this.Internal_Recalculate_1();
	}

	return true;
};
/**
 * Разделяем текущую ячейку
 */
CTable.prototype.Cell_Split = function(Rows, Cols)
{
	var bApplyToInnerTable = false;
	if (false === this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
		bApplyToInnerTable = this.CurCell.Content.Table_SplitCell(Cols, Rows);

	if (true === bApplyToInnerTable)
		return true;

	// Разделение ячейки работает, только если выделена ровно одна ячейка.
	if (!( false === this.Selection.Use || ( true === this.Selection.Use && ( table_Selection_Text === this.Selection.Type || ( table_Selection_Cell === this.Selection.Type && 1 === this.Selection.Data.length  ) ) ) ))
		return false;

	var Cell_pos = null;
	var Cell     = null;

	if (false === this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
	{
		Cell     = this.CurCell;
		Cell_pos =
			{
				Cell : Cell.Index,
				Row  : Cell.Row.Index
			};
	}
	else
	{
		Cell_pos = this.Selection.Data[0];
		Cell     = this.Content[Cell_pos.Row].Get_Cell(Cell_pos.Cell);
	}

	var Row = this.Content[Cell_pos.Row];

	var Grid_start = Row.Get_CellInfo(Cell_pos.Cell).StartGridCol;
	var Grid_span  = Cell.Get_GridSpan();

	var VMerge_count = this.Internal_GetVertMergeCount(Cell_pos.Row, Grid_start, Grid_span);

	// Если данная ячейка имеет вертикальное объединение, тогда по вертикали мы
	// ее разбиваем максимально на VMerge_count частей, если значение Rows превышает
	// заданное максимально допустимое значение или Rows не является делителем
	// числа VMerge_count - выдаем ошибку.
	// Если данная ячейка не учавствует в вертикальном объединении, тогда мы спокойно
	// можем делить ячейку на любое количество строк.
	if (VMerge_count > 1)
	{
		if (Rows > VMerge_count)
		{
			// Сообщение об ошибке : "Value Rows must be between 1 and " + VMerge_count
			var ErrData = new AscCommon.CErrorData();
			ErrData.put_Value(VMerge_count);
			editor.sendEvent("asc_onError", c_oAscError.ID.SplitCellMaxRows, c_oAscError.Level.NoCritical, ErrData);
			return false;
		}
		else if (0 != VMerge_count % Rows)
		{
			// Сообщение об ошибке : "Value must be a divisor of the number " + VMerge_count
			var ErrData = new AscCommon.CErrorData();
			ErrData.put_Value(VMerge_count);
			editor.sendEvent("asc_onError", c_oAscError.ID.SplitCellRowsDivider, c_oAscError.Level.NoCritical, ErrData);
			return false;
		}
	}

	// Сделаем оценку макимального количества колонок
	if (Cols > 1)
	{
		var Sum_before = this.TableSumGrid[Grid_start - 1];
		var Sum_with   = this.TableSumGrid[Grid_start + Grid_span - 1];

		var Span_width = Sum_with - Sum_before;
		var Grid_width = Span_width / Cols;

		var CellSpacing = Row.Get_CellSpacing();
		var CellMar     = Cell.Get_Margins();

		var MinW = CellSpacing + CellMar.Right.W + CellMar.Left.W;

		if (Grid_width < MinW)
		{
			var MaxCols = Math.floor(Span_width / MinW);

			// Сообщение об ошибке : "Value Cols must be a between 1 and " + MaxCols
			var ErrData = new AscCommon.CErrorData();
			ErrData.put_Value(MaxCols);
			editor.sendEvent("asc_onError", c_oAscError.ID.SplitCellMaxCols, c_oAscError.Level.NoCritical, ErrData);
			return false;
		}
	}


	var Cells     = [];
	var Cells_pos = [];
	var Rows_     = [];

	if (Rows <= 1)
	{
		for (var Index = 0; Index < VMerge_count; Index++)
		{
			var TempRow = this.Content[Cell_pos.Row + Index];

			Rows_[Index]     = TempRow;
			Cells[Index]     = null;
			Cells_pos[Index] = null;

			// Ищем ячейку, начинающуюся с Grid_start

			var CellsCount = TempRow.Get_CellsCount();
			for (var CurCell = 0; CurCell < CellsCount; CurCell++)
			{
				var StartGridCol = TempRow.Get_CellInfo(CurCell).StartGridCol;
				if (StartGridCol === Grid_start)
				{
					Cells[Index]     = TempRow.Get_Cell(CurCell);
					Cells_pos[Index] = {Row : Cell_pos.Row + Index, Cell : CurCell};
				}
			}
		}
	}
	else
	{
		if (VMerge_count > 1)
		{
			var New_VMerge_Count = VMerge_count / Rows;

			for (var Index = 0; Index < VMerge_count; Index++)
			{
				var TempRow = this.Content[Cell_pos.Row + Index];

				Rows_[Index]     = TempRow;
				Cells[Index]     = null;
				Cells_pos[Index] = null;

				// Ищем ячейку, начинающуюся с Grid_start
				var CellsCount = TempRow.Get_CellsCount();
				for (var CurCell = 0; CurCell < CellsCount; CurCell++)
				{
					var StartGridCol = TempRow.Get_CellInfo(CurCell).StartGridCol;
					if (StartGridCol === Grid_start)
					{
						var TempCell     = TempRow.Get_Cell(CurCell);
						Cells[Index]     = TempCell;
						Cells_pos[Index] = {Row : Cell_pos.Row + Index, Cell : CurCell};

						if (0 === Index % New_VMerge_Count)
							TempCell.Set_VMerge(vmerge_Restart);
						else
							TempCell.Set_VMerge(vmerge_Continue);
					}
				}
			}
		}
		else
		{
			// Делаем разбиение по вертикали

			// Нам нужно добавить несколько точных копий текущей строки, только все ячейки,
			// кроме текущей, должны быть объединены по вертикали.

			Rows_[0]     = Row;
			Cells[0]     = Cell;
			Cells_pos[0] = Cell_pos;

			var CellsCount = Row.Get_CellsCount();
			for (var Index = 1; Index < Rows; Index++)
			{
				var NewRow = this.Internal_Add_Row(Cell_pos.Row + Index, CellsCount);
				NewRow.Copy_Pr(Row.Pr);

				Rows_[Index]     = NewRow;
				Cells[Index]     = null;
				Cells_pos[Index] = null;

				// Копируем настройки всех ячеек исходной строки в новую строку
				for (var CurCell = 0; CurCell < CellsCount; CurCell++)
				{
					var New_Cell = NewRow.Get_Cell(CurCell);
					var Old_Cell = Row.Get_Cell(CurCell);

					New_Cell.Copy_Pr(Old_Cell.Pr);

					if (CurCell === Cell_pos.Cell)
					{
						Cells[Index]     = New_Cell;
						Cells_pos[Index] = {Row : Cell_pos.Row + Index, Cell : CurCell};
					}
					else
					{
						New_Cell.Set_VMerge(vmerge_Continue);
					}
				}
			}
		}
	}

	// Сделаем разбиение по горизонтали
	if (Cols > 1)
	{
		// Найдем позиции новых колонок в сетке
		var Sum_before = this.TableSumGrid[Grid_start - 1];
		var Sum_with   = this.TableSumGrid[Grid_start + Grid_span - 1];

		var Span_width = Sum_with - Sum_before;
		var Grid_width = Span_width / Cols;

		// Данный массив содержит информацию о том сколько новых колонок
		// было добавлено после i-ой колонки
		var Grid_Info = [];
		for (var Index = 0; Index < this.TableGridCalc.length; Index++)
			Grid_Info[Index] = 0;

		// Массив содержит информацию о том сколько промежутков будет в
		// новых ячейках
		var Grid_Info_new = [];
		for (var Index = 0; Index < Cols; Index++)
			Grid_Info_new[Index] = 1;

		var Grid_Info_start = [];
		for (var Index = 0; Index < this.TableGridCalc.length; Index++)
			Grid_Info_start[Index] = this.TableGridCalc[Index];

		var NewCol_Index = 0;

		var CurWidth = Sum_before + Grid_width;
		for (var Grid_index = Grid_start; Grid_index < Grid_start + Grid_span; Grid_index++)
		{
			var bNewCol = true;

			// Если мы попали в уже имеющуюся границу не добавляем новую точку
			if (Math.abs(CurWidth - this.TableSumGrid[Grid_index]) < 0.001)
			{
				NewCol_Index++;
				CurWidth += Grid_width;
				bNewCol = false;
				continue;
			}

			while (CurWidth < this.TableSumGrid[Grid_index])
			{
				if (0 === Grid_Info[Grid_index])
					Grid_Info_start[Grid_index] = CurWidth - this.TableSumGrid[Grid_index - 1];
				Grid_Info[Grid_index] += 1;

				NewCol_Index++
				CurWidth += Grid_width;

				// Если мы попали в уже имеющуюся границу не добавляем новую точку
				if (Math.abs(CurWidth - this.TableSumGrid[Grid_index]) < 0.001)
				{
					NewCol_Index++;
					CurWidth += Grid_width;
					bNewCol = false;
					break;
				}
			}

			if (true === bNewCol)
				Grid_Info_new[NewCol_Index] += 1;
		}

		// Добавим в данной строке (Cols - 1) ячеек, с теми же настроками,
		// что и исходной. Значение GridSpan мы берем из массива Grid_Info_new

		for (var Index2 = 0; Index2 < Rows_.length; Index2++)
		{
			if (null != Cells[Index2] && null != Cells_pos[Index2])
			{
				var TempRow      = Rows_[Index2];
				var TempCell     = Cells[Index2];
				var TempCell_pos = Cells_pos[Index2];

				TempCell.Set_GridSpan(Grid_Info_new[0]);
				TempCell.Set_W(new CTableMeasurement(tblwidth_Mm, Grid_width));

				for (var Index = 1; Index < Cols; Index++)
				{
					var NewCell = TempRow.Add_Cell(TempCell_pos.Cell + Index, TempRow, null, false);
					NewCell.Copy_Pr(TempCell.Pr);
					NewCell.Set_GridSpan(Grid_Info_new[Index]);
					NewCell.Set_W(new CTableMeasurement(tblwidth_Mm, Grid_width));
				}
			}
		}

		var OldTableGridLen = this.TableGridCalc.length;
		var arrNewGrid      = this.private_CopyTableGrid();

		// Добавим новые колонки в TableGrid
		// начинаем с конца, чтобы не пересчитывать номера
		for (var Index = OldTableGridLen - 1; Index >= 0; Index--)
		{
			var Summary = this.TableGridCalc[Index];

			if (Grid_Info[Index] > 0)
			{
				arrNewGrid[Index] = Grid_Info_start[Index];
				Summary -= Grid_Info_start[Index] - Grid_width;

				for (var NewIndex = 0; NewIndex < Grid_Info[Index]; NewIndex++)
				{
					Summary -= Grid_width;

					if (NewIndex != Grid_Info[Index] - 1)
						arrNewGrid.splice(Index + NewIndex + 1, 0, Grid_width);
					else
						arrNewGrid.splice(Index + NewIndex + 1, 0, Summary);
				}
			}
		}
		this.SetTableGrid(arrNewGrid);

		// Проходим по всем строкам и изменяем у ячеек GridSpan, в
		// соответствии со значениями массива Grid_Info
		for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
		{
			if (CurRow >= Cells_pos[0].Row && CurRow <= Cells_pos[Cells_pos.length - 1].Row)
				continue;

			var TempRow = this.Content[CurRow];

			var GridBefore = TempRow.Get_Before().GridBefore;
			var GridAfter  = TempRow.Get_After().GridAfter;

			if (GridBefore > 0)
			{
				var SummaryGridSpan = GridBefore;
				for (var CurGrid = 0; CurGrid < GridBefore; CurGrid++)
					SummaryGridSpan += Grid_Info[CurGrid];

				TempRow.Set_Before(SummaryGridSpan);
			}

			var LastGrid = 0;

			for (var CurCell = 0; CurCell < TempRow.Get_CellsCount(); CurCell++)
			{
				var TempCell      = TempRow.Get_Cell(CurCell);
				var TempGridSpan  = TempCell.Get_GridSpan();
				var TempStartGrid = TempRow.Get_CellInfo(CurCell).StartGridCol;

				var SummaryGridSpan = TempGridSpan;

				LastGrid = TempStartGrid + TempGridSpan;

				for (var CurGrid = TempStartGrid; CurGrid < TempStartGrid + TempGridSpan; CurGrid++)
					SummaryGridSpan += Grid_Info[CurGrid];

				TempCell.Set_GridSpan(SummaryGridSpan);
			}

			if (GridAfter > 0)
			{
				var SummaryGridSpan = GridAfter;
				for (var CurGrid = LastGrid; CurGrid < OldTableGridLen; CurGrid++)
					SummaryGridSpan += Grid_Info[CurGrid];

				TempRow.Set_After(SummaryGridSpan);
			}
		}
	}

	this.ReIndexing();
	this.Recalc_CompiledPr2();
	this.private_RecalculateGrid();
	this.Internal_Recalculate_1();

	return true;
};
/**
 * Добавление строки.
 * @param bBefore - true - до(сверху) первой выделенной строки, false - после(снизу) последней выделенной строки.
 */
CTable.prototype.Row_Add = function(bBefore)
{
	if ("undefined" === typeof(bBefore))
		bBefore = true;

	var bApplyToInnerTable = false;
	if (false === this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
		bApplyToInnerTable = this.CurCell.Content.Table_AddRow(bBefore);

	if (true === bApplyToInnerTable)
		return;

	var Cells_pos = [];

	// Количество, вставляемых строк зависит от того сколько содержится
	// строк в выделении. Если вставляем до, тогда копируем верхнюю строку
	// выделения, а если после, тогда последнюю.
	var Count = 1;
	var RowId = 0;

	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		Cells_pos = this.Selection.Data;

		var Prev_row = -1;
		Count        = 0;
		for (var Index = 0; Index < this.Selection.Data.length; Index++)
		{
			if (Prev_row != this.Selection.Data[Index].Row)
			{
				Count++;
				Prev_row = this.Selection.Data[Index].Row;
			}
		}
	}
	else
	{
		Cells_pos[0] = {Row : this.CurCell.Row.Index, Cell : this.CurCell.Index};
		Count        = 1;
	}

	if (Cells_pos.length <= 0)
		return;

	if (true === bBefore)
		RowId = Cells_pos[0].Row;
	else
		RowId = Cells_pos[Cells_pos.length - 1].Row;

	var Row        = this.Content[RowId];
	var CellsCount = Row.Get_CellsCount();

	// Сначала пробежимся по строке, которую мы будем копировать, и получим
	// всю необходимую информацию.
	var Cells_info = [];
	for (var CurCell = 0; CurCell < CellsCount; CurCell++)
	{
		var Cell      = Row.Get_Cell(CurCell);
		var Cell_info = Row.Get_CellInfo(CurCell);

		var Cell_grid_start = Cell_info.StartGridCol;
		var Cell_grid_span  = Cell.Get_GridSpan();

		var VMerge_count_before = this.Internal_GetVertMergeCount2(RowId, Cell_grid_start, Cell_grid_span);
		var VMerge_count_after  = this.Internal_GetVertMergeCount(RowId, Cell_grid_start, Cell_grid_span);

		Cells_info[CurCell] =
			{
				VMerge_count_before : VMerge_count_before,
				VMerge_count_after  : VMerge_count_after
			};
	}

	// TODO: Пока делаем одинаковый CellSpacing
	var CellSpacing = this.Content[0].Get_CellSpacing();

	for (var Index = 0; Index < Count; Index++)
	{
		var New_Row = null;

		if (true === bBefore)
			New_Row = this.Internal_Add_Row(RowId, CellsCount, true);
		else
			New_Row = this.Internal_Add_Row(RowId + 1, CellsCount, true);

		New_Row.Copy_Pr(Row.Pr);
		New_Row.Set_CellSpacing(CellSpacing);

		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			var New_Cell = New_Row.Get_Cell(CurCell);
			var Old_Cell = Row.Get_Cell(CurCell);

			New_Cell.Copy_Pr(Old_Cell.Pr);

			// Копируем также текстовые настройки и настройки параграфа
			var FirstPara = Old_Cell.Content.Get_FirstParagraph();
			var TextPr    = FirstPara.Get_FirstRunPr();
			New_Cell.Content.Set_ApplyToAll(true);

			// Добавляем стиль во все параграфы
			var PStyleId = FirstPara.Style_Get();
			if (undefined !== PStyleId && null !== this.LogicDocument)
			{
				var Styles = this.LogicDocument.Get_Styles();
				New_Cell.Content.Set_ParagraphStyle(Styles.Get_Name(PStyleId));
			}

			New_Cell.Content.Paragraph_Add(new ParaTextPr(TextPr));
			New_Cell.Content.Set_ApplyToAll(false);

			if (true === bBefore)
			{
				if (Cells_info[CurCell].VMerge_count_before > 1)
					New_Cell.Set_VMerge(vmerge_Continue);
				else
					New_Cell.Set_VMerge(vmerge_Restart);
			}
			else
			{
				if (Cells_info[CurCell].VMerge_count_after > 1)
					New_Cell.Set_VMerge(vmerge_Continue);
				else
					New_Cell.Set_VMerge(vmerge_Restart);
			}
		}
	}

	// Выделим новые строки
	this.Selection.Use = true;

	if (null != this.Selection.Data)
		this.Selection.Data.length = 0;
	else
		this.Selection.Data = [];

	this.Selection.Use  = true;
	this.Selection.Type = table_Selection_Cell;

	var StartRow = ( true === bBefore ? RowId : RowId + 1 );
	for (var Index = 0; Index < Count; Index++)
	{
		var Row        = this.Content[StartRow + Index];
		var CellsCount = Row.Get_CellsCount();

		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			var Cell = Row.Get_Cell(CurCell);
			if (vmerge_Continue === Cell.Get_VMerge())
				continue;

			this.Selection.Data.push({Row : StartRow + Index, Cell : CurCell});
		}
	}

	this.Recalc_CompiledPr2();
	this.Internal_Recalculate_1();
};
/**
 * Удаление строки либо по номеру Ind, либо по выделению Selection, либо по текущей ячейке.
 */
CTable.prototype.Row_Remove = function(Ind)
{
	var bApplyToInnerTable = false;
	if (false === this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
		bApplyToInnerTable = this.CurCell.Content.Table_RemoveRow(Ind);

	if (true === bApplyToInnerTable)
		return true;

	var Rows_to_delete = [];

	if ("undefined" === typeof(Ind) || null === Ind)
	{
		if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		{
			var Counter = 0;
			var PrevRow = -1;
			for (var Index = 0; Index < this.Selection.Data.length; Index++)
			{
				var CurPos = this.Selection.Data[Index];
				if (CurPos.Row != PrevRow)
					Rows_to_delete[Counter++] = CurPos.Row;

				PrevRow = CurPos.Row;
			}
		}
		else
			Rows_to_delete[0] = this.CurCell.Row.Index;
	}
	else
		Rows_to_delete[0] = Ind;

	if (Rows_to_delete.length <= 0)
		return;

	// Строки мы удаляем либо по 1, либо непрервным блоком. При удалении мы
	// смотрим на следующую строку после удаляемого блока и проверяем, если
	// какая-либо из ячеек данной строки учавствует в вертикальном объединении,
	// тогда проверяем где оно началось. Если начало объединения выше
	// строк, тогда ничего не делаем, в противном случае начинаем вертикальное
	// объединение с текущей ячейки.

	var FirstRow_to_delete = Rows_to_delete[0];
	var CurRow             = Rows_to_delete[Rows_to_delete.length - 1] + 1;
	if (CurRow < this.Content.length)
	{
		var Row        = this.Content[CurRow];
		var CellsCount = Row.Get_CellsCount();

		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			var Cell   = Row.Get_Cell(CurCell);
			var VMerge = Cell.Get_VMerge();

			if (vmerge_Continue != VMerge)
				continue;

			// Данная ячейка продолжает вертикальное объединение ячеек
			// Найдем строку, с которой начинается данное объединение.
			var VMerge_count = this.Internal_GetVertMergeCount2(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
			if (CurRow - ( VMerge_count - 1 ) >= FirstRow_to_delete)
				Cell.Set_VMerge(vmerge_Restart);
		}
	}

	this.Selection_Remove();

	// Удаляем строки.
	for (var Index = Rows_to_delete.length - 1; Index >= 0; Index--)
	{
		this.Internal_Remove_Row(Rows_to_delete[Index]);
	}

	// Возвращаем курсор
	this.DrawingDocument.TargetStart();
	this.DrawingDocument.TargetShow();

	this.DrawingDocument.SelectEnabled(false);

	// При удалении последней строки, надо сообщить об этом родительскому классу
	if (this.Content.length <= 0)
		return false;

	// Перемещаем курсор в начало следующей строки
	var CurRow   = Math.min(Rows_to_delete[0], this.Content.length - 1);
	var Row      = this.Content[CurRow];
	this.CurCell = Row.Get_Cell(0);
	this.CurCell.Content.Cursor_MoveToStartPos();

	var PageNum = 0;
	for (PageNum = 0; PageNum < this.Pages.length - 1; PageNum++)
	{
		if (CurRow <= this.Pages[PageNum + 1].FirstRow)
			break;
	}

	this.Markup.Internal.RowIndex  = CurRow;
	this.Markup.Internal.CellIndex = 0;
	this.Markup.Internal.PageNum   = PageNum;

	this.Recalc_CompiledPr2();

	this.Internal_Recalculate_1();

	return true;
};
/**
 * Специальная функция для удаления строк таблицы, когда выделены одновременно параграф и таблица
 */
CTable.prototype.Row_Remove2 = function()
{
	if (false == this.Selection.Use || table_Selection_Text == this.Selection.Type)
		return true;

	var Rows_to_delete = [];
	for (var Index = 0; Index < this.Content.length; Index++)
		Rows_to_delete[Index] = 0;

	for (var Index = 0; Index < this.Selection.Data.length; Index++)
	{
		var Pos = this.Selection.Data[Index];
		if (0 == Rows_to_delete[Pos.Row]);
		Rows_to_delete[Pos.Row] = 1;
	}

	// Удаляем строки.
	for (var Index = this.Content.length - 1; Index >= 0; Index--)
	{
		if (0 != Rows_to_delete[Index])
			this.Internal_Remove_Row(Index);
	}

	// При удалении последней строки, надо сообщить об этом родительскому классу
	if (this.Content.length <= 0)
		return false;

	// Проверяем текущую ячейку
	if (this.CurCell.Row.Index >= this.Content.length)
		this.CurCell = this.Content[this.Content.length - 1].Get_Cell(0);

	this.Selection_Remove();

	return true;
};
/**
 * Удаление колонки либо по выделению Selection, либо по текущей ячейке.
 */
CTable.prototype.Col_Remove = function()
{
	var bApplyToInnerTable = false;
	if (false === this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
		bApplyToInnerTable = this.CurCell.Content.Table_RemoveCol();

	if (true === bApplyToInnerTable)
		return true;

	// Найдем правую и левую границы выделенных ячеек.
	var Cells_pos = [];

	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		Cells_pos = this.Selection.Data;
	else
		Cells_pos[0] = {Row : this.CurCell.Row.Index, Cell : this.CurCell.Index};

	if (Cells_pos.length <= 0)
		return;

	var Grid_start = -1;
	var Grid_end   = -1;
	for (var Index = 0; Index < Cells_pos.length; Index++)
	{
		var Row  = this.Content[Cells_pos[Index].Row];
		var Cell = Row.Get_Cell(Cells_pos[Index].Cell);

		var Cur_Grid_start = Row.Get_CellInfo(Cells_pos[Index].Cell).StartGridCol;
		var Cur_Grid_end   = Cur_Grid_start + Cell.Get_GridSpan() - 1;

		if (-1 === Grid_start || ( -1 != Grid_start && Grid_start > Cur_Grid_start ))
			Grid_start = Cur_Grid_start;

		if (-1 === Grid_end || ( -1 != Grid_end && Grid_end < Cur_Grid_end ))
			Grid_end = Cur_Grid_end;
	}

	// Пробегаемся по всем строкам и смотрим, если у какой либо ячейки
	// есть пересечение с отрезком [Grid_start, Grid_end], тогда удаляем
	// данную ячейку.

	var Delete_info = [];
	var Rows_info   = [];

	for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
	{
		Delete_info[CurRow] = [];
		Rows_info[CurRow]   = [];

		var Row = this.Content[CurRow];

		var Before_Info = Row.Get_Before();
		if (Before_Info.GridBefore > 0)
			Rows_info[CurRow].push({W : this.TableSumGrid[Before_Info.GridBefore - 1], Type : -1, GridSpan : 1});

		var CellsCount = Row.Get_CellsCount();
		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			var Cell           = Row.Get_Cell(CurCell);
			var Cur_Grid_start = Row.Get_CellInfo(CurCell).StartGridCol;
			var Cur_Grid_end   = Cur_Grid_start + Cell.Get_GridSpan() - 1;

			if (Cur_Grid_start <= Grid_end && Cur_Grid_end >= Grid_start)
			{
				Delete_info[CurRow].push(CurCell);
			}
			else
			{
				var W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1];
				Rows_info[CurRow].push({W : W, Type : 0, GridSpan : 1});
			}
		}
	}

	// Удалим все ячейки
	for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
	{
		var Row = this.Content[CurRow];
		for (var Index = Delete_info[CurRow].length - 1; Index >= 0; Index--)
		{
			var CurCell = Delete_info[CurRow][Index];
			Row.Remove_Cell(CurCell);
		}
	}

	// При удалении колонки возможен случай, когда удаляется строка целиком
	for (var CurRow = this.Content.length - 1; CurRow >= 0; CurRow--)
	{
		// Строка удалена целиком, если в RowsInfo нет ни одной записи
		// о ячейках (т.е. с типом равным 0)
		var bRemove = true;
		for (var Index = 0; Index < Rows_info[CurRow].length; Index++)
		{
			if (0 === Rows_info[CurRow][Index].Type)
			{
				bRemove = false;
				break;
			}
		}

		if (true === bRemove)
		{
			this.Internal_Remove_Row(CurRow);
			Rows_info.splice(CurRow, 1);
		}
	}

	// Возвращаем курсор
	this.DrawingDocument.TargetStart();
	this.DrawingDocument.TargetShow();

	this.DrawingDocument.SelectEnabled(false);

	// При удалении последней строки, надо сообщить об этом родительскому классу
	if (this.Content.length <= 0)
		return false;

	// TODO: При удалении колонки надо запоминать информацию об вертикально
	//       объединенных ячейках, и в новой сетке объединять ячейки только
	//       если они были объединены изначально. Сейчас если ячейка была
	//       объединена с какой-либо ячейков, то она может после удаления колонки
	//       объединиться с совсем другой ячейкой.

	this.Internal_CreateNewGrid(Rows_info);

	// Пробегаемся по всем ячейкам и смотрим на их вертикальное объединение, было ли оно нарушено
	this.private_CorrectVerticalMerge();

	// Возможен случай, когда у нас остались строки, полностью состоящие из объединенных вертикально ячеек
	for (var CurRow = this.Content.length - 1; CurRow >= 0; CurRow--)
	{
		var bRemove    = true;
		var Row        = this.Content[CurRow];
		var CellsCount = Row.Get_CellsCount();

		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			var Cell = Row.Get_Cell(CurCell);
			if (vmerge_Continue != Cell.Get_VMerge())
			{
				bRemove = false;
				break;
			}
		}

		if (true === bRemove)
		{
			this.Internal_Remove_Row(CurRow);
		}
	}

	// Перемещаем курсор в начало следующей колонки
	var CurRow     = 0;
	var Row        = this.Content[CurRow];
	var CellsCount = Row.Get_CellsCount();
	var CurCell    = Delete_info[0][0] === undefined ? CellsCount - 1 : Math.min(Delete_info[0][0], CellsCount - 1);

	this.CurCell = Row.Get_Cell(CurCell);
	this.CurCell.Content.Cursor_MoveToStartPos();
	var PageNum = 0;

	this.Markup.Internal.RowIndex  = CurRow;
	this.Markup.Internal.CellIndex = CurCell;
	this.Markup.Internal.PageNum   = PageNum;

	this.Selection.Use          = false;
	this.Selection.Start        = false;
	this.Selection.StartPos.Pos = {Row : CurRow, Cell : CurCell};
	this.Selection.EndPos.Pos   = {Row : CurRow, Cell : CurCell};
	this.Selection.CurRow       = CurRow;

	this.private_RecalculateGrid();
	this.Internal_Recalculate_1();

	return true;
};
/**
 * Добавление колонки.
 * @param bBefore - true - до(слева) первой выделенной колонки, false - после(справа) последней выделенной колонки.
 */
CTable.prototype.Col_Add = function(bBefore)
{
	if ("undefined" === typeof(bBefore))
		bBefore = true;

	var bApplyToInnerTable = false;
	if (false === this.Selection.Use || ( true === this.Selection.Use && table_Selection_Text === this.Selection.Type ))
		bApplyToInnerTable = this.CurCell.Content.Table_AddCol(bBefore);

	if (true === bApplyToInnerTable)
		return;

	var Cells_pos = [];

	// Количество, вставляемых столбцов зависит от того сколько содержится
	// ячеек в первой строке выделения. Ширина берется у первой ячейки, если
	// bBefore = true, и у последней, если bBefore = false.
	var Count = 1;
	var Width = 0;

	if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
	{
		Cells_pos = this.Selection.Data;

		var Prev_row = -1;
		Count        = 0;
		for (var Index = 0; Index < this.Selection.Data.length; Index++)
		{
			if (-1 != Prev_row)
			{
				if (Prev_row === this.Selection.Data[Index].Row)
					Count++;
				else
					break;
			}
			else
			{
				Count++;
				Prev_row = this.Selection.Data[Index].Row;
			}
		}
	}
	else
	{
		Cells_pos[0] = {Row : this.CurCell.Row.Index, Cell : this.CurCell.Index};
		Count        = 1;
	}

	if (Cells_pos.length <= 0)
		return;

	if (true === bBefore)
	{
		// Вычислим ширину первой ячейки
		var FirstCell_Grid_start = this.Content[Cells_pos[0].Row].Get_CellInfo(Cells_pos[0].Cell).StartGridCol;
		var FirstCell_Grid_end   = FirstCell_Grid_start + this.Content[Cells_pos[0].Row].Get_Cell(Cells_pos[0].Cell).Get_GridSpan() - 1;
		Width                    = this.TableSumGrid[FirstCell_Grid_end] - this.TableSumGrid[FirstCell_Grid_start - 1];
	}
	else
	{
		// Вычислим ширину последней ячейки
		var LastPos = Cells_pos.length - 1;

		var LastCell_Grid_start = this.Content[Cells_pos[LastPos].Row].Get_CellInfo(Cells_pos[LastPos].Cell).StartGridCol;
		var LastCell_Grid_end   = LastCell_Grid_start + this.Content[Cells_pos[LastPos].Row].Get_Cell(Cells_pos[LastPos].Cell).Get_GridSpan() - 1;
		Width                   = this.TableSumGrid[LastCell_Grid_end] - this.TableSumGrid[LastCell_Grid_start - 1];
	}

	var Rows_info = [];
	var Add_info  = [];
	if (true === bBefore)
	{
		// Ищем левую границу выделенных ячеек
		var Grid_start = -1;
		for (var Index = 0; Index < Cells_pos.length; Index++)
		{
			var Row  = this.Content[Cells_pos[Index].Row];
			var Cell = Row.Get_Cell(Cells_pos[Index].Cell);

			var Cur_Grid_start = Row.Get_CellInfo(Cells_pos[Index].Cell).StartGridCol;

			if (-1 === Grid_start || ( -1 != Grid_start && Grid_start > Cur_Grid_start ))
				Grid_start = Cur_Grid_start;
		}

		for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
		{
			var Row           = this.Content[CurRow];
			Rows_info[CurRow] = [];
			Add_info[CurRow]  = 0;

			var Before_Info = Row.Get_Before();
			if (Before_Info.GridBefore > 0)
				Rows_info[CurRow].push({W : this.TableSumGrid[Before_Info.GridBefore - 1], Type : -1, GridSpan : 1});

			var CellsCount = Row.Get_CellsCount();
			for (var CurCell = 0; CurCell < CellsCount; CurCell++)
			{
				var Cell           = Row.Get_Cell(CurCell);
				var Cur_Grid_start = Row.Get_CellInfo(CurCell).StartGridCol;
				var Cur_Grid_end   = Cur_Grid_start + Cell.Get_GridSpan() - 1;

				if (Cur_Grid_start <= Grid_start)
					Add_info[CurRow] = CurCell;

				var W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1];
				Rows_info[CurRow].push({W : W, Type : 0, GridSpan : 1});
			}

			var After_Info = Row.Get_After();
			if (After_Info.GridAfter > 0)
			{
				if (Row.Get_CellInfo(CellsCount - 1).StartGridCol + Row.Get_Cell(CellsCount - 1).Get_GridSpan() <= Grid_start)
					Add_info[CurRow] = CellsCount;
			}
		}

		// Теперь нам надо добавить ячейки в найденные позиции, и в те же позиции
		// добавить элементы в массиве Rows_info
		for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
		{
			var Row = this.Content[CurRow];

			var bBefore2 = false;
			if (Rows_info.length > 0 && Rows_info[CurRow][0].Type === -1)
				bBefore2 = true;

			for (var Index = 0; Index < Count; Index++)
			{
				var NewCell = Row.Add_Cell(Add_info[CurRow], Row, null, false);

				// Скопируем свойства следующуй ячейки в данной строке, а если мы добавляем в конец, то предыдущей
				var NextCell = ( Add_info[CurRow] >= Row.Get_CellsCount() - 1 ? Row.Get_Cell(Add_info[CurRow] - 1) : Row.Get_Cell(Add_info[CurRow] + 1) );
				NewCell.Copy_Pr(NextCell.Pr, true);

				// Скопируем текстовые настройки
				var FirstPara = NextCell.Content.Get_FirstParagraph();
				var TextPr    = FirstPara.Get_FirstRunPr();
				NewCell.Content.Set_ApplyToAll(true);

				// Добавляем стиль во все параграфы
				var PStyleId = FirstPara.Style_Get();
				if (undefined !== PStyleId && null !== this.LogicDocument)
				{
					var Styles = this.LogicDocument.Get_Styles();
					NewCell.Content.Set_ParagraphStyle(Styles.Get_Name(PStyleId));
				}

				NewCell.Content.Paragraph_Add(new ParaTextPr(TextPr));
				NewCell.Content.Set_ApplyToAll(false);

				if (false === bBefore2)
					Rows_info[CurRow].splice(Add_info[CurRow], 0, {W : Width, Type : 0, GridSpan : 1});
				else
					Rows_info[CurRow].splice(Add_info[CurRow] + 1, 0, {W : Width, Type : 0, GridSpan : 1});
			}
		}
	}
	else
	{
		// Ищем правую границу выделенных ячеек
		var Grid_end = -1;
		for (var Index = 0; Index < Cells_pos.length; Index++)
		{
			var Row  = this.Content[Cells_pos[Index].Row];
			var Cell = Row.Get_Cell(Cells_pos[Index].Cell);

			var Cur_Grid_start = Row.Get_CellInfo(Cells_pos[Index].Cell).StartGridCol;
			var Cur_Grid_end   = Cur_Grid_start + Cell.Get_GridSpan() - 1;

			if (-1 === Grid_end || ( -1 != Grid_end && Grid_end < Cur_Grid_end ))
				Grid_end = Cur_Grid_end;
		}

		for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
		{
			var Row           = this.Content[CurRow];
			Rows_info[CurRow] = [];
			Add_info[CurRow]  = -1;

			var Before_Info = Row.Get_Before();
			if (Before_Info.GridBefore > 0)
				Rows_info[CurRow].push({W : this.TableSumGrid[Before_Info.GridBefore - 1], Type : -1, GridSpan : 1});

			var CellsCount = Row.Get_CellsCount();
			for (var CurCell = 0; CurCell < CellsCount; CurCell++)
			{
				var Cell           = Row.Get_Cell(CurCell);
				var Cur_Grid_start = Row.Get_CellInfo(CurCell).StartGridCol;
				var Cur_Grid_end   = Cur_Grid_start + Cell.Get_GridSpan() - 1;

				if (Cur_Grid_end <= Grid_end)
					Add_info[CurRow] = CurCell;

				var W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1];
				Rows_info[CurRow].push({W : W, Type : 0, GridSpan : 1});
			}
		}

		// Теперь нам надо добавить ячейки в найденные позиции, и в те же позиции
		// добавить элементы в массиве Rows_info
		for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
		{
			var Row = this.Content[CurRow];

			var bBefore2 = false;
			if (Rows_info.length > 0 && Rows_info[CurRow][0].Type === -1)
				bBefore2 = true;

			for (var Index = 0; Index < Count; Index++)
			{
				var NewCell = Row.Add_Cell(Add_info[CurRow] + 1, Row, null, false);

				// Скопируем свойства следующуй ячейки в данной строке, а если мы добавляем в конец, то предыдущей
				var NextCell = ( Add_info[CurRow] + 1 >= Row.Get_CellsCount() - 1 ? Row.Get_Cell(Add_info[CurRow]) : Row.Get_Cell(Add_info[CurRow] + 2) );
				NewCell.Copy_Pr(NextCell.Pr, true);

				// Скопируем текстовые настройки
				var FirstPara = NextCell.Content.Get_FirstParagraph();
				var TextPr    = FirstPara.Get_FirstRunPr();
				NewCell.Content.Set_ApplyToAll(true);

				// Добавляем стиль во все параграфы
				var PStyleId = FirstPara.Style_Get();
				if (undefined !== PStyleId && null !== this.LogicDocument)
				{
					var Styles = this.LogicDocument.Get_Styles();
					NewCell.Content.Set_ParagraphStyle(Styles.Get_Name(PStyleId));
				}

				NewCell.Content.Paragraph_Add(new ParaTextPr(TextPr));
				NewCell.Content.Set_ApplyToAll(false);


				if (false === bBefore2)
					Rows_info[CurRow].splice(Add_info[CurRow] + 1, 0, {W : Width, Type : 0, GridSpan : 1});
				else
					Rows_info[CurRow].splice(Add_info[CurRow] + 2, 0, {W : Width, Type : 0, GridSpan : 1});
			}
		}
	}

	this.Internal_CreateNewGrid(Rows_info);

	// Выделим новые строки
	this.Selection.Use = true;

	if (null != this.Selection.Data)
		this.Selection.Data.length = 0;
	else
		this.Selection.Data = [];

	this.Selection.Use  = true;
	this.Selection.Type = table_Selection_Cell;

	for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
	{
		var StartCell = ( true === bBefore ? Add_info[CurRow] : Add_info[CurRow] + 1 );
		for (var Index = 0; Index < Count; Index++)
		{
			this.Selection.Data.push({Row : CurRow, Cell : StartCell + Index});
		}
	}

	this.private_RecalculateGrid();
	this.Internal_Recalculate_1();
};
/**
 * @param NewMarkup - новая разметка таблицы
 * @param bCol      - где произошли изменения (в колонках или строках)
 * @param Index     - номер границы колонок(строк), у которой произошли изменения
 */
CTable.prototype.Update_TableMarkupFromRuler = function(NewMarkup, bCol, Index)
{
	var TablePr = this.Get_CompiledPr(false).TablePr;
	if (true === bCol)
	{
		var RowIndex = NewMarkup.Internal.RowIndex;
		var Row      = this.Content[RowIndex];
		var Col      = 0;

		var Dx = 0;

		// границ на 1 больше, чем самих ячеек в строке
		if (Index === NewMarkup.Cols.length)
		{
			Col = Row.Get_CellInfo(Index - 1).StartGridCol + Row.Get_Cell(Index - 1).Get_GridSpan();

			Dx = NewMarkup.Cols[Index - 1] - this.Markup.Cols[Index - 1];
		}
		else
		{
			Col = Row.Get_CellInfo(Index).StartGridCol;

			if (0 != Index)
				Dx = NewMarkup.Cols[Index - 1] - this.Markup.Cols[Index - 1];
			else
				Dx = NewMarkup.X - this.Markup.X;
		}

		if (0 === Dx)
			return;

		// Пока сделаем так, в будущем надо будет менять ширину таблицы
		if (0 != Index && TablePr.TableW.Type != tblwidth_Auto)
		{
			var TableW   = TablePr.TableW.W;
			var MinWidth = this.Internal_Get_TableMinWidth();

			if (TableW < MinWidth)
				TableW = MinWidth;

			this.Set_TableW(tblwidth_Mm, TableW + Dx);
		}

		if (0 === Col)
		{
			Dx = this.Markup.X - NewMarkup.X;
			this.X -= Dx;

			if (true === this.Is_Inline())
			{
				this.Set_TableAlign(align_Left);
				this.Set_TableInd(TablePr.TableInd - Dx);
				this.private_SetTableLayoutFixedAndUpdateCellsWidth(-1);
				this.SetTableGrid(this.private_CopyTableGridCalc());
			}
			else
			{
				this.Internal_UpdateFlowPosition(this.X, this.Y);
			}
		}
		else
		{
			var GridSpan = 1;
			if (Dx > 0)
			{
				if (Index != NewMarkup.Cols.length)
				{
					var Cell = Row.Get_Cell(Index);
					GridSpan = Cell.Get_GridSpan();
				}
				else
				{
					var GridAfter = Row.Get_After().GridAfter;
					GridSpan      = GridAfter;
				}

				this.TableGridCalc[Col - 1] = this.TableGridCalc[Col - 1] + Dx;
				this.Internal_UpdateCellW(Col - 1);
				this.private_SetTableLayoutFixedAndUpdateCellsWidth(Col - 1);
				this.SetTableGrid(this.private_CopyTableGridCalc());
			}
			else
			{
				if (0 != Index)
				{
					var Cell = Row.Get_Cell(Index - 1);
					GridSpan = Cell.Get_GridSpan();
				}
				else
				{
					var GridBefore = Row.Get_Before().GridBefore;
					// Если GridBefore = 0, тогда мы попадем в случай 0 === Col
					GridSpan       = GridBefore;
				}

				if (1 === GridSpan || -Dx < this.TableSumGrid[Col - 1] - this.TableSumGrid[Col - 2])
				{
					this.TableGridCalc[Col - 1] = this.TableGridCalc[Col - 1] + Dx;
					this.Internal_UpdateCellW(Col - 1);
					this.private_SetTableLayoutFixedAndUpdateCellsWidth(Col - 1);
					this.SetTableGrid(this.private_CopyTableGridCalc());
				}
				else
				{
					var Rows_info = [];

					for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
					{
						Rows_info[CurRow] = [];

						var Row = this.Content[CurRow];

						var Before_Info = Row.Get_Before();


						if (Before_Info.GridBefore > 0)
						{
							if (Before_Info.GridBefore >= Col)
							{
								var W = Math.max(0, this.TableSumGrid[Before_Info.GridBefore - 1] + Dx);
								if (W > 0.001)
									Rows_info[CurRow].push({W : W, Type : -1, GridSpan : 1});
							}
							else
								Rows_info[CurRow].push({
									W        : this.TableSumGrid[Before_Info.GridBefore - 1],
									Type     : -1,
									GridSpan : 1
								});
						}

						var CellsCount = Row.Get_CellsCount();
						for (var CurCell = 0; CurCell < CellsCount; CurCell++)
						{
							var Cell           = Row.Get_Cell(CurCell);
							var CellMargins    = Cell.Get_Margins();
							var Cur_Grid_start = Row.Get_CellInfo(CurCell).StartGridCol;
							var Cur_Grid_end   = Cur_Grid_start + Cell.Get_GridSpan() - 1;

							if (Cur_Grid_start <= Col - 1 && Cur_Grid_end >= Col - 1)
							{
								var W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1] + Dx;

								W = Math.max(1, Math.max(W, CellMargins.Left.W + CellMargins.Right.W));
								Rows_info[CurRow].push({W : W, Type : 0, GridSpan : 1});
							}
							else
							{
								var W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1];

								W = Math.max(1, Math.max(W, CellMargins.Left.W + CellMargins.Right.W));
								Rows_info[CurRow].push({W : W, Type : 0, GridSpan : 1});
							}
						}
					}

					this.Internal_CreateNewGrid(Rows_info);
				}
			}

			this.private_RecalculateGrid();
		}
	}
	else
	{
		var RowIndex = this.Pages[NewMarkup.Internal.PageNum].FirstRow + Index;
		if (0 === RowIndex)
		{
			if (true === this.Is_Inline())
			{
				// ничего не делаем, позиция по Y в инлайновой таблице изменить нельзя таким способом
			}
			else
			{
				var Dy = this.Markup.Rows[0].Y - NewMarkup.Rows[0].Y;
				Page.Y -= Dy;
				this.Internal_UpdateFlowPosition(Page.X, Page.Y);
				var NewH = NewMarkup.Rows[0].H;
				this.Content[0].Set_Height(NewH, linerule_AtLeast);
			}
		}
		else
		{
			if (NewMarkup.Internal.PageNum > 0 && 0 === Index)
			{
				// ничего не делаем
			}
			else
			{
				var NewH = NewMarkup.Rows[Index - 1].H;
				this.Content[RowIndex - 1].Set_Height(NewH, linerule_AtLeast);
			}
		}
	}

	this.Internal_Recalculate_1();
	editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
};
//----------------------------------------------------------------------------------------------------------------------
// Внутренние функции
//----------------------------------------------------------------------------------------------------------------------
/**
 * TODO: Удалить данную функцию
 */
CTable.prototype.Internal_Recalculate_1 = function()
{
	return editor.WordControl.m_oLogicDocument.Recalculate();
};
/**
 * TODO: Удалить данную функцию
 * Данная функция вызывается после изменений внутри ячейки, а это означает, что с момента
 * последнего пересчета не изменилась ни сетка, ни границы, и ни расстояние между ячейками в таблицу.
 * Следовательно, нам надо пересчитать высоту ячейки, в которой произошли изменения,  и если
 * это приведет к изменению высоты строки, то пересчитываем все строки дальше.
 */
CTable.prototype.Internal_RecalculateFrom = function(RowIndex, CellIndex, bChange, bForceRecalc)
{
	return editor.WordControl.m_oLogicDocument.Recalculate();
};
CTable.prototype.Internal_GetCellByXY = function(X, Y, PageIndex)
{
	// Сначала определяем колонку в которую мы попали
	var CurGrid = 0;

	var CurPage   = Math.min(this.Pages.length - 1, Math.max(0, PageIndex));
	var Page      = this.Pages[CurPage];
	var ColsCount = this.TableGridCalc.length;
	if (X >= Page.X)
	{
		for (CurGrid = 0; CurGrid < ColsCount; CurGrid++)
		{
			if (X >= Page.X + this.TableSumGrid[CurGrid - 1] && X <= Page.X + this.TableSumGrid[CurGrid])
				break;
		}
	}

	if (CurGrid >= ColsCount)
		CurGrid = ColsCount - 1;

	// Найдем промежуток строк по PageIndex среди которых нам надо искать
	var PNum = PageIndex;

	var Row_start, Row_last;

	if (PNum < 0)
	{
		Row_start = 0;
		Row_last  = 0;
	}
	else if (PNum >= this.Pages.length)
	{
		Row_start = this.Content.length - 1;
		Row_last  = this.Content.length - 1;
	}
	else
	{
		Row_start = this.Pages[PNum].FirstRow;
		Row_last  = this.Pages[PNum].LastRow;
	}

	if (Row_last < Row_start)
		return {Row : 0, Cell : 0};

	for (var CurRow = Row_start; CurRow <= Row_last; CurRow++)
	{
		var Row        = this.Content[CurRow];
		var CellsCount = Row.Get_CellsCount();
		var BeforeInfo = Row.Get_Before();
		var CurGridCol = BeforeInfo.GridBefore;

		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			var Cell     = Row.Get_Cell(CurCell);
			var GridSpan = Cell.Get_GridSpan();
			var Vmerge   = Cell.Get_VMerge();

			// Обсчет такик ячеек произошел ранее
			if (vmerge_Continue === Vmerge && Row_start != CurRow)
			{
				CurGridCol += GridSpan;
				continue;
			}

			var VMergeCount = this.private_GetVertMergeCountOnPage(PNum, CurRow, CurGridCol, GridSpan);
			if (VMergeCount <= 0)
			{
				CurGridCol += GridSpan;
				continue;
			}

			// Проверяем по X
			if (CurGrid >= CurGridCol && CurGrid < CurGridCol + GridSpan)
			{
				// Проверяем по Y
				if ("undefined" != typeof(this.RowsInfo[CurRow + VMergeCount - 1].Y[PNum]) && "undefined" != typeof(this.RowsInfo[CurRow + VMergeCount - 1].H[PNum]) && (Y <= (this.RowsInfo[CurRow + VMergeCount - 1].Y[PNum] + this.RowsInfo[CurRow + VMergeCount - 1].H[PNum]) || CurRow + VMergeCount - 1 >= Row_last ))
				{
					if (vmerge_Continue === Vmerge && Row_start === CurRow)
					{
						Cell = this.Internal_Get_StartMergedCell(CurRow, CurGridCol, GridSpan);
						if (null != Cell)
							return {Row : Cell.Row.Index, Cell : Cell.Index};
						else
							return {Row : 0, Cell : 0};
					}
					else
						return {Row : CurRow, Cell : CurCell};
				}
			}

			CurGridCol += GridSpan;
		}
	}

	return {Row : 0, Cell : 0};
};
/**
 * Считаем количество соединенных вертикально ячеек
 */
CTable.prototype.Internal_GetVertMergeCount = function(StartRow, StartGridCol, GridSpan)
{
	// начинаем с 1, потому что предполагается, что соединение начинается с исходной ячейки
	var VmergeCount = 1;
	for (var Index = StartRow + 1; Index < this.Content.length; Index++)
	{
		var Row        = this.Content[Index];
		var BeforeInfo = Row.Get_Before();
		var CurGridCol = BeforeInfo.GridBefore;
		var CurCell    = 0;
		var CellsCount = Row.Get_CellsCount();

		var bWasMerged = false;
		while (CurGridCol <= StartGridCol && CurCell < CellsCount)
		{
			var Cell         = Row.Get_Cell(CurCell);
			var CellGridSpan = Cell.Get_GridSpan();
			var Vmerge       = Cell.Get_VMerge();

			if (CurGridCol === StartGridCol && GridSpan === CellGridSpan && vmerge_Continue === Vmerge)
			{
				bWasMerged = true;
				VmergeCount++;
				break;
			}
			else if (CurGridCol === StartGridCol && GridSpan === CellGridSpan && vmerge_Continue != Vmerge)
			{
				bWasMerged = true;
				return VmergeCount;
			}
			// Если данная ячейка имеет пересечение с заданным промежутком, но польностью с ним не совпадает
			else if (CurGridCol <= StartGridCol + GridSpan - 1 && CurGridCol + CellGridSpan - 1 >= StartGridCol)
				break;

			CurGridCol += CellGridSpan;
			CurCell++;
		}

		if (false === bWasMerged)
			break;
	}

	return VmergeCount;
};
/**
 * Считаем количество соединенных вертикально ячеек, но в обратную сторону (т.е. снизу вверх)
 */
CTable.prototype.Internal_GetVertMergeCount2 = function(StartRow, StartGridCol, GridSpan)
{
	// начинаем с 1, потому что предполагается, что соединение начинается с исходной ячейки
	var VmergeCount = 1;

	// сначала проверим VMerge текущей ячейки
	var Start_Row        = this.Content[StartRow];
	var Start_VMerge     = vmerge_Restart;
	var Start_CellsCount = Start_Row.Get_CellsCount();
	for (var Index = 0; Index < Start_CellsCount; Index++)
	{
		var Temp_Grid_start = Start_Row.Get_CellInfo(Index).StartGridCol;
		if (Temp_Grid_start === StartGridCol)
		{
			Start_VMerge = Start_Row.Get_Cell(Index).Get_VMerge();
			break;
		}
	}

	if (vmerge_Restart === Start_VMerge)
		return VmergeCount;

	for (var Index = StartRow - 1; Index >= 0; Index--)
	{
		var Row        = this.Content[Index];
		var BeforeInfo = Row.Get_Before();
		var CurGridCol = BeforeInfo.GridBefore;
		var CurCell    = 0;
		var CellsCount = Row.Get_CellsCount();

		var bWasMerged = false;
		while (CurGridCol <= StartGridCol && CurCell < CellsCount)
		{
			var Cell         = Row.Get_Cell(CurCell);
			var CellGridSpan = Cell.Get_GridSpan();
			var Vmerge       = Cell.Get_VMerge();

			if (CurGridCol === StartGridCol && GridSpan === CellGridSpan && vmerge_Continue === Vmerge)
			{
				bWasMerged = true;
				VmergeCount++;
				break;
			}
			else if (CurGridCol === StartGridCol && GridSpan === CellGridSpan && vmerge_Continue != Vmerge)
			{
				bWasMerged = true;
				VmergeCount++;
				return VmergeCount;
			}
			// Если данная ячейка имеет пересечение с заданным промежутком, но польностью с ним не совпадает
			else if (CurGridCol <= StartGridCol + GridSpan - 1 && CurGridCol + CellGridSpan - 1 >= StartGridCol)
				break;

			CurGridCol += CellGridSpan;
			CurCell++;
		}

		if (false === bWasMerged)
			break;
	}

	return VmergeCount;
};
/**
 * Проверяем, нужно ли удалить ненужные строки из нашей таблицы.
 * Такое может произойти после объединения ячеек или после изменения сетки
 * таблицы.
 * True  - в таблице произошли изменения
 * False - ничего не изменилось
 */
CTable.prototype.Internal_Check_TableRows = function(bSaveHeight)
{
	// Пробегаемся по всем строкам, если в какой-то строке у всех ячеек стоит
	// вертикальное объединение, тогда такую строку удаляем, а у предыдущей
	// строки выставляем минимальную высоту - сумму высот этих двух строк.
	// Кроме этого нам надо выставить минимальную высоту у строк, в которых
	// все ячейки состоят в вертикальном объединении, а у самой строки
	// параметр WBefore или WAfter ненулевой

	// Сначала пробежимся по строкам и узнаем, какие строки нужно удалить
	var Rows_to_Delete = [];
	var Rows_to_CalcH  = [];
	var Rows_to_CalcH2 = [];
	for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
	{
		var Row = this.Content[CurRow];

		var bVmerge_Restart  = false;
		var bVmerge_Continue = false;
		var bNeedDeleteRow   = true;
		var bNeedCalcHeight  = false;

		if (Row.Get_Before().GridBefore > 0 || Row.Get_After().GridAfter > 0)
			bNeedCalcHeight = true;

		for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++)
		{
			var Cell   = Row.Get_Cell(CurCell);
			var VMerge = Cell.Get_VMerge();

			if (VMerge != vmerge_Continue)
			{
				var VMergeCount = this.Internal_GetVertMergeCount(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
				if (VMergeCount > 1)
					bVmerge_Restart = true;

				bNeedDeleteRow = false;

				if (true === bNeedCalcHeight)
				{
					if (1 === VMergeCount)
						bNeedCalcHeight = false;
				}
			}
			else
				bVmerge_Continue = true;
		}

		if (true === bVmerge_Continue && true === bVmerge_Restart)
			Rows_to_CalcH2.push(CurRow);
		else if (true === bNeedCalcHeight)
			Rows_to_CalcH.push(CurRow);

		if (true === bNeedDeleteRow)
			Rows_to_Delete.push(CurRow);
	}

	// Сначала разберемся со строками, у которых надо проставить минимальную высоту
	for (var Index = 0; Index < Rows_to_CalcH2.length; Index++)
	{
		var RowIndex  = Rows_to_CalcH2[Index];
		var MinHeight = -1;

		var Row        = this.Content[RowIndex];
		var CellsCount = Row.Get_CellsCount()
		for (var CurCell = 0; CurCell < CellsCount; CurCell++)
		{
			var Cell   = Row.Get_Cell(CurCell);
			var VMerge = Cell.Get_VMerge();
			if (vmerge_Restart === VMerge)
			{
				var CurMinHeight = Cell.Content.Get_EmptyHeight();
				if (CurMinHeight < MinHeight || MinHeight === -1)
					MinHeight = CurMinHeight;
			}
		}

		var OldHeight = this.Content[RowIndex].Get_Height();

		if (undefined === OldHeight || Asc.linerule_Auto == OldHeight.HRule || ( MinHeight > OldHeight.Value ))
			this.Content[RowIndex].Set_Height(MinHeight, linerule_AtLeast);
	}

	if (Rows_to_Delete.length <= 0)
		return false;

	if (true === bSaveHeight)
	{
		// Сначала разберемся со строками, у которых надо проставить минимальную высоту
		for (var Index = 0; Index < Rows_to_CalcH.length; Index++)
		{
			var RowIndex = Rows_to_CalcH[Index];
			this.Content[RowIndex].Set_Height(this.RowsInfo[RowIndex].H, linerule_AtLeast);
		}

		// Рассчитаем высоты строк, так чтобы после удаления, общий вид таблицы не менялся
		for (var Counter = 0; Counter < Rows_to_Delete.length;)
		{
			var CurRowSpan = 1;

			var StartRow = Rows_to_Delete[Counter];
			while (Counter + CurRowSpan < Rows_to_Delete.length && Rows_to_Delete[Counter] + CurRowSpan === Rows_to_Delete[Counter + CurRowSpan])
				CurRowSpan++;

			if (this.RowsInfo[StartRow - 1 + CurRowSpan].StartPage === this.RowsInfo[StartRow - 1].StartPage)
			{
				var StartPage      = this.RowsInfo[StartRow - 1 + CurRowSpan].StartPage;
				var Summary_Height = this.RowsInfo[StartRow - 1 + CurRowSpan].H[StartPage] + this.RowsInfo[StartRow - 1 + CurRowSpan].Y[StartPage] - this.RowsInfo[StartRow - 1].Y[StartPage];
				this.Content[StartRow - 1].Set_Height(Summary_Height, linerule_AtLeast);
			}

			Counter += CurRowSpan;
		}
	}

	// Удаляем, начиная с последней строки, чтобы не пересчитывать номера строк
	for (var Index = Rows_to_Delete.length - 1; Index >= 0; Index--)
	{
		var Row_to_Delete = Rows_to_Delete[Index];
		this.Internal_Remove_Row(Row_to_Delete);
	}

	return true;
};
CTable.prototype.Internal_Remove_Row = function(Index)
{
	if (Index >= this.Content.length || Index < 0)
		return;

	this.Content[Index].PreDelete();

	History.Add(new CChangesTableRemoveRow(this, Index, [this.Content[Index]]));

	this.Rows--;
	this.Content.splice(Index, 1);
	this.TableRowsBottom.splice(Index, 1);
	this.RowsInfo.splice(Index, 1);

	this.Internal_ReIndexing(Index);
};
CTable.prototype.Internal_Add_Row = function(Index, CellsCount, bReIndexing, _NewRow)
{
	if (Index < 0)
		Index = 0;

	if (Index >= this.Content.length)
		Index = this.Content.length;

	this.Rows++;

	var NewRow = ( undefined === _NewRow ? new CTableRow(this, CellsCount) : _NewRow );

	History.Add(new CChangesTableAddRow(this, Index, [NewRow]));

	this.Content.splice(Index, 0, NewRow);
	this.TableRowsBottom.splice(Index, 0, {});
	this.RowsInfo.splice(Index, 0, {
		Pages        : 1,
		Y            : [],
		H            : [],
		TopDy        : [],
		MaxTopBorder : [],
		FirstPage    : true,
		StartPage    : 0
	});

	if (true === bReIndexing)
	{
		this.Internal_ReIndexing(Index);
	}
	else
	{
		if (Index > 0)
		{
			this.Content[Index - 1].Next = NewRow;
			NewRow.Prev                  = this.Content[Index - 1];
		}
		else
			NewRow.Prev = null;

		if (Index < this.Content.length - 1)
		{
			this.Content[Index + 1].Prev = NewRow;
			NewRow.Next                  = this.Content[Index + 1];
		}
		else
			NewRow.Next = null;
	}

	NewRow.Table = this;

	return NewRow;
};
CTable.prototype.Clear_ContentChanges = function()
{
	this.m_oContentChanges.Clear();
};
CTable.prototype.Add_ContentChanges = function(Changes)
{
	this.m_oContentChanges.Add(Changes);
};
CTable.prototype.Refresh_ContentChanges = function()
{
	this.m_oContentChanges.Refresh();
};
CTable.prototype.Internal_ReIndexing = function(StartIndex)
{
	if ("undefined" === typeof(StartIndex))
		StartIndex = 0;

	for (var Ind = StartIndex; Ind < this.Content.length; Ind++)
	{
		this.Content[Ind].Set_Index(Ind);
		this.Content[Ind].Prev  = ( Ind > 0 ? this.Content[Ind - 1] : null );
		this.Content[Ind].Next  = ( Ind < this.Content.length - 1 ? this.Content[Ind + 1] : null );
		this.Content[Ind].Table = this;
	}
};
CTable.prototype.ReIndexing = function(StartIndex)
{
	this.Internal_ReIndexing(0);

	var Count = this.Content.length;
	for (var Ind = StartIndex; Ind < Count; Ind++)
	{
		this.Content[Ind].Internal_ReIndexing(0);
	}
};
/**
 * Переделываем сетку таблицы заново, исходя из массива RowsInfo
 * В данном массиве заданы для каждой строки ширины всех ячеек (либо
 * пропусков до или после строк GridBefore/GridAfter).
 * На выходе мы отдаем новую сетку TableGrid и массив RowsInfo, в
 * котором для каждой ячейки(пропуска) указан GridSpan.
 */
CTable.prototype.Internal_CreateNewGrid = function(RowsInfo)
{
	var CurPos = [];
	var CurX   = [];
	for (var Index = 0; Index < RowsInfo.length; Index++)
	{
		CurPos[Index] = 0;
		CurX[Index]   = RowsInfo[Index][0].W;

		for (var Index2 = 0; Index2 < RowsInfo[Index].length; Index2++)
		{
			RowsInfo[Index][Index2].GridSpan = 1;

			// Последние элемент всегда должен означать GridAfter, но с
			// нулевыем начальным значением.
			if (1 != RowsInfo[Index][RowsInfo[Index].length - 1].Type)
			{
				RowsInfo[Index].push({W : 0, Type : 1, GridSpan : 0});
			}
			else
			{
				RowsInfo[Index][RowsInfo[Index].length - 1] = {W : 0, Type : 1, GridSpan : 0};
			}
		}
	}

	var TableGrid = [];
	var bEnd      = false;
	var PrevX     = 0;
	while (true != bEnd)
	{
		var MinX = -1;
		for (var Index = 0; Index < RowsInfo.length; Index++)
		{
			if ((MinX === -1 || CurX[Index] < MinX) && !( RowsInfo[Index].length - 1 === CurPos[Index] && 1 === RowsInfo[Index][CurPos[Index]].Type ))
				MinX = CurX[Index];
		}

		for (var Index = 0; Index < RowsInfo.length; Index++)
		{
			if (RowsInfo[Index].length - 1 === CurPos[Index] && 1 === RowsInfo[Index][CurPos[Index]].Type)
				RowsInfo[Index][CurPos[Index]].GridSpan++;
			else
			{
				if (Math.abs(MinX - CurX[Index]) < 0.001)
				{
					CurPos[Index]++;
					CurX[Index] += RowsInfo[Index][CurPos[Index]].W;
				}
				else
				{
					RowsInfo[Index][CurPos[Index]].GridSpan++;
				}
			}
		}

		TableGrid.push(MinX - PrevX);
		PrevX = MinX;

		bEnd = true;
		for (var Index = 0; Index < RowsInfo.length; Index++)
		{
			if (RowsInfo[Index].length - 1 != CurPos[Index])
			{
				bEnd = false;
				break;
			}
		}
	}

	for (var CurRow = 0; CurRow < RowsInfo.length; CurRow++)
	{
		var RowInfo = RowsInfo[CurRow];
		var Row     = this.Content[CurRow];

		var CurIndex = 0;
		if (-1 === RowInfo[0].Type)
		{
			if (RowInfo[0].GridSpan > 0)
			{
				Row.Set_Before(RowInfo[0].GridSpan);
			}
			CurIndex++;
		}
		else
		{
			Row.Set_Before(0);
		}

		for (var CurCell = 0; CurIndex < RowInfo.length; CurIndex++, CurCell++)
		{
			if (1 === RowInfo[CurIndex].Type)
				break;

			var Cell = Row.Get_Cell(CurCell);
			Cell.Set_GridSpan(RowInfo[CurIndex].GridSpan);
			var WType = Cell.Get_W().Type;
			if (tblwidth_Auto != WType && tblwidth_Nil != WType)
			{
				Cell.Set_W(new CTableMeasurement(tblwidth_Mm, RowInfo[CurIndex].W));
			}
		}

		CurIndex = RowInfo.length - 1;
		if (1 === RowInfo[CurIndex].Type)
		{
			Row.Set_After(RowInfo[CurIndex].GridSpan);
		}
		else
		{
			Row.Set_After(0);
		}
	}
	this.SetTableGrid(TableGrid);
	return TableGrid;
};
CTable.prototype.Internal_UpdateCellW = function(Col)
{
	for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
	{
		var Row         = this.Content[CurRow];
		var Cells_Count = Row.Get_CellsCount();
		var CurGridCol  = Row.Get_Before().GridBefore;

		for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
		{
			var Cell     = Row.Get_Cell(CurCell);
			var GridSpan = Cell.Get_GridSpan();

			if (Col >= CurGridCol && Col < CurGridCol + GridSpan)
			{
				var CellWType = Cell.Get_W().Type;
				if (tblwidth_Auto != CellWType && tblwidth_Nil != CellWType)
				{
					var W = 0;
					for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridSpan; CurSpan++)
						W += this.TableGridCalc[CurSpan];

					Cell.Set_W(new CTableMeasurement(tblwidth_Mm, W));
				}

				break;
			}

			CurGridCol += GridSpan;
		}
	}
};
/**
 * Сравниваем границы двух соседних ячеек.
 * @param Border1
 * @param Border2
 * @param bTableBorder1 - является ли граница границей всей таблицы
 * @param bTableBorder2 - является ли граница границей всей таблицы
 */
CTable.prototype.Internal_CompareBorders = function(Border1, Border2, bTableBorder1, bTableBorder2)
{
	if ("undefined" === typeof(bTableBorder1))
		bTableBorder1 = false;

	if ("undefined" === typeof(bTableBorder2))
		bTableBorder2 = false;

	// Граница ячейки всегда побеждает границу таблицы, если первая задана
	if (true === bTableBorder1)
		return Border2;

	if (true === bTableBorder2)
		return Border1;

	// Всегда побеждает непустая граница
	if (border_None === Border1.Value)
		return Border2;

	if (border_None === Border2.Value)
		return Border1;

	// TODO: Как только мы реализуем рисование не только простых границ,
	//       сделать здесь обработку. W_b = Border.Size * Border_Num,
	//       где Border_Num зависит от Border.Value

	var W_b_1 = Border1.Size;
	var W_b_2 = Border2.Size;
	if (W_b_1 > W_b_2)
		return Border1;
	else if (W_b_2 > W_b_1)
		return Border2;

	var Brightness_1_1 = Border1.Color.r + Border1.Color.b + 2 * Border1.Color.g;
	var Brightness_1_2 = Border2.Color.r + Border2.Color.b + 2 * Border2.Color.g;

	if (Brightness_1_1 < Brightness_1_2)
		return Border1;
	else if (Brightness_1_2 < Brightness_1_1)
		return Border2;

	var Brightness_2_1 = Border1.Color.b + 2 * Border1.Color.g;
	var Brightness_2_2 = Border2.Color.b + 2 * Border2.Color.g;

	if (Brightness_2_1 < Brightness_2_2)
		return Border1;
	else if (Brightness_2_2 < Brightness_2_1)
		return Border2;

	var Brightness_3_1 = Border1.Color.g;
	var Brightness_3_2 = Border2.Color.g;

	if (Brightness_3_1 < Brightness_3_2)
		return Border1;
	else if (Brightness_3_2 < Brightness_3_1)
		return Border2;

	// Две границы функционально идентичны, нам все равно какую рисовать.
	return Border1;
};
/**
 * Получаем левую верхнюю ячейку в текущем объединении
 */
CTable.prototype.Internal_Get_StartMergedCell = function(StartRow, StartGridCol, GridSpan)
{
	var Result = null;
	for (var Index = StartRow; Index >= 0; Index--)
	{
		var Row        = this.Content[Index];
		var BeforeInfo = Row.Get_Before();
		var CurGridCol = BeforeInfo.GridBefore;
		var CurCell    = 0;
		var CellsCount = Row.Get_CellsCount();

		var bWasMerged = false;
		while (CurGridCol <= StartGridCol && CurCell < CellsCount)
		{
			var Cell         = Row.Get_Cell(CurCell);
			var CellGridSpan = Cell.Get_GridSpan();
			var Vmerge       = Cell.Get_VMerge();

			if (CurGridCol === StartGridCol && GridSpan === CellGridSpan && vmerge_Continue === Vmerge)
			{
				bWasMerged = true;
				Result     = Cell;
				break;
			}
			else if (CurGridCol === StartGridCol && GridSpan === CellGridSpan && vmerge_Continue != Vmerge)
			{
				bWasMerged = true;
				Result     = Cell;
				return Result;
			}
			// Если данная ячейка имеет пересечение с заданным промежутком, но польностью с ним не совпадает
			else if (CurGridCol <= StartGridCol + GridSpan - 1 && CurGridCol + CellGridSpan - 1 >= StartGridCol)
				break;

			CurGridCol += CellGridSpan;
			CurCell++;
		}

		if (false === bWasMerged)
			break;
	}

	return Result;
};
/**
 * Получаем левую верхнюю ячейку в текущем объединении
 */
CTable.prototype.Internal_Get_EndMergedCell = function(StartRow, StartGridCol, GridSpan)
{
	var Result = null;
	for (var Index = StartRow, Count = this.Content.length; Index < Count; Index++)
	{
		var Row        = this.Content[Index];
		var BeforeInfo = Row.Get_Before();
		var CurGridCol = BeforeInfo.GridBefore;
		var CurCell    = 0;
		var CellsCount = Row.Get_CellsCount();

		var bWasMerged = false;
		while (CurGridCol <= StartGridCol && CurCell < CellsCount)
		{
			var Cell         = Row.Get_Cell(CurCell);
			var CellGridSpan = Cell.Get_GridSpan();
			var Vmerge       = Cell.Get_VMerge();

			if (CurGridCol === StartGridCol && GridSpan === CellGridSpan)
			{
				if (vmerge_Continue === Vmerge || Index === StartRow)
				{
					bWasMerged = true;
					Result     = Cell;
					break;
				}
				else
					return Result;
			}
			// Если данная ячейка имеет пересечение с заданным промежутком, но польностью с ним не совпадает
			else if (CurGridCol <= StartGridCol + GridSpan - 1 && CurGridCol + CellGridSpan - 1 >= StartGridCol)
				break;

			CurGridCol += CellGridSpan;
			CurCell++;
		}

		if (false === bWasMerged)
			break;
	}

	return Result;
};
/**
 * Получаем массив ячеек попадающих в заданное вертикальное объединение
 */
CTable.prototype.private_GetMergedCells = function(RowIndex, StartGridCol, GridSpan)
{
	// Сначала проверим данну строку
	var Row       = this.Content[RowIndex];
	var CellIndex = this.Internal_Get_Cell_ByStartGridCol(RowIndex, StartGridCol);
	if (-1 === CellIndex)
		return [];

	var Cell = Row.Get_Cell(CellIndex);
	if (GridSpan !== Cell.Get_GridSpan())
		return [];

	var CellsArray = [Cell];

	// Ищем ячейки вверх
	for (var Index = RowIndex - 1; Index >= 0; Index--)
	{
		var CellIndex = this.Internal_Get_Cell_ByStartGridCol(Index, StartGridCol);
		if (-1 === CellIndex)
			break;

		var Cell = this.Content[Index].Get_Cell(CellIndex);
		if (GridSpan !== Cell.Get_GridSpan())
			break;

		var Vmerge = Cell.Get_VMerge();
		if (vmerge_Continue !== Vmerge)
			break;

		CellsArray.splice(0, 0, Cell);
	}

	// Ищем ячейки вниз
	for (var Index = RowIndex + 1, Count = this.Content.length; Index < Count; Index++)
	{
		var CellIndex = this.Internal_Get_Cell_ByStartGridCol(Index, StartGridCol);
		if (-1 === CellIndex)
			break;

		var Cell = this.Content[Index].Get_Cell(CellIndex);
		if (GridSpan !== Cell.Get_GridSpan())
			break;

		var Vmerge = Cell.Get_VMerge();
		if (vmerge_Continue !== Vmerge)
			break;

		CellsArray.push(Cell);
	}

	return CellsArray;
};
CTable.prototype.private_GetCellsPosArrayByCellsArray = function(CellsArray)
{
	var Result = [];
	for (var Index = 0, Count = CellsArray.length; Index < Count; Index++)
	{
		var Cell = CellsArray[Index];
		Result.push({Cell : Cell.Index, Row : Cell.Row.Index});
	}

	return Result;
};
/**
 * Получаем левую верхнюю ячейку в текущем объединении
 */
CTable.prototype.Internal_Get_StartMergedCell2 = function(CellIndex, RowIndex)
{
	var Row      = this.Content[RowIndex];
	var Cell     = Row.Get_Cell(CellIndex);
	var CellInfo = Row.Get_CellInfo(CellIndex);

	return this.Internal_Get_StartMergedCell(RowIndex, CellInfo.StartGridCol, Cell.Get_GridSpan());
};
/**
 * Получаем номер ячейки в заданной строке по заданной колонке.
 */
CTable.prototype.Internal_Get_Cell_ByStartGridCol = function(RowIndex, StartGridCol)
{
	var Row = this.Content[RowIndex];

	var BeforeInfo = Row.Get_Before();
	var CurGridCol = BeforeInfo.GridBefore;
	var CellsCount = Row.Get_CellsCount();

	for (var CurCell = 0; CurCell < CellsCount; CurCell++)
	{
		var Cell     = Row.Get_Cell(CurCell);
		var GridSpan = Cell.Get_GridSpan();

		if (StartGridCol === CurGridCol)
			return CurCell;
		else if (CurGridCol > StartGridCol)
			return -1;

		CurGridCol += GridSpan;
	}

	return -1;
};
CTable.prototype.Internal_Update_TableMarkup = function(RowIndex, CellIndex, PageNum)
{
	this.Markup.Internal =
		{
			RowIndex  : RowIndex,
			CellIndex : CellIndex,
			PageNum   : PageNum
		};

	var Page      = this.Pages[PageNum];
	this.Markup.X = Page.X;

	var Row         = this.Content[RowIndex];
	var CellSpacing = ( null === Row.Get_CellSpacing() ? 0 : Row.Get_CellSpacing() );
	var CellsCount  = Row.Get_CellsCount();

	var GridBefore = Row.Get_Before().GridBefore;
	this.Markup.X += this.TableSumGrid[GridBefore - 1];

	this.Markup.Cols    = [];
	this.Markup.Margins = [];
	for (var CurCell = 0; CurCell < CellsCount; CurCell++)
	{
		var Cell         = Row.Get_Cell(CurCell);
		var StartGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
		var GridSpan     = Cell.Get_GridSpan();
		var CellMargin   = Cell.Get_Margins();

		this.Markup.Cols.push(this.TableSumGrid[StartGridCol + GridSpan - 1] - this.TableSumGrid[StartGridCol - 1]);

		var Margin_left  = CellMargin.Left.W;
		var Margin_right = CellMargin.Right.W;
		if (0 === CurCell)
			Margin_left += CellSpacing;
		else
			Margin_left += CellSpacing / 2;

		if (CellsCount - 1 === CurCell)
			Margin_right += CellSpacing;
		else
			Margin_right += CellSpacing / 2;

		this.Markup.Margins.push({Left : Margin_left, Right : Margin_right});
	}

	// Определим какие строки попадают на данную страницу
	var Row_start = this.Pages[PageNum].FirstRow;
	var Row_last  = Row_start;

	if (PageNum + 1 < this.Pages.length)
	{
		Row_last = this.Pages[PageNum + 1].FirstRow;

		// Возможно, на данной странице строку, с которой началось разбиение на стрнице,
		// не надо рисовать. (Если начальная и конечная строки совпадают, тогда это 2
		// или более страница данной строки)
		if ((Row_start != Row_last || ( 0 === Row_start && 0 === Row_last ) ) && false === this.RowsInfo[Row_last].FirstPage)
			Row_last--;
	}
	else
		Row_last = this.Content.length - 1;

	this.Markup.Rows = [];
	for (var CurRow = Row_start; CurRow <= Row_last; CurRow++)
	{
		if (this.RowsInfo[CurRow] && this.RowsInfo[CurRow].Y[PageNum] && this.RowsInfo[CurRow].H[PageNum])
			this.Markup.Rows.push({Y : this.RowsInfo[CurRow].Y[PageNum], H : this.RowsInfo[CurRow].H[PageNum]});
	}

	this.Markup.CurCol = CellIndex;
	this.Markup.CurRow = RowIndex - Row_start;

	var Transform = this.Get_ParentTextTransform();
	this.DrawingDocument.Set_RulerState_Table(this.Markup, Transform);
};
/**
 * Проверяем попалили мы в какую либо границу.
 *      0
 *    |---|
 *   3|   |1
 *    |---|
 *      2
 */
CTable.prototype.Internal_CheckBorders = function(X, Y, PageNum)
{
	var CurPage = PageNum;
	var Page    = this.Pages[CurPage];

	// Сначала определим ячейку, у которой границы мы будем проверять
	var CellPos = this.Internal_GetCellByXY(X, Y, PageNum);

	var Row      = this.Content[CellPos.Row];
	var Cell     = Row.Get_Cell(CellPos.Cell);
	var CellInfo = Row.Get_CellInfo(CellPos.Cell);

	var VMerge_count_over = this.Internal_GetVertMergeCount(CellPos.Row, CellInfo.StartGridCol, Cell.Get_GridSpan());
	var VMerge_count      = this.private_GetVertMergeCountOnPage(PageNum, CellPos.Row, CellInfo.StartGridCol, Cell.Get_GridSpan());
	if (VMerge_count <= 0)
		return {Pos : CellPos, Border : -1};

	var Row_end      = this.Content[CellPos.Row + VMerge_count - 1];
	var Cell_end     = this.Internal_Get_Cell_ByStartGridCol(CellPos.Row + VMerge_count - 1, CellInfo.StartGridCol);
	var CellInfo_end = Row_end.Get_CellInfo(Cell_end.Index);

	var X_cell_start = Page.X + CellInfo.X_grid_start;
	var X_cell_end   = Page.X + CellInfo.X_grid_end;

	var Y_cell_start = this.RowsInfo[CellPos.Row].Y[PageNum];
	var Y_cell_end   = this.RowsInfo[CellPos.Row + VMerge_count - 1].Y[PageNum] + this.RowsInfo[CellPos.Row + VMerge_count - 1].H[PageNum];

	var Radius = this.DrawingDocument.GetMMPerDot(3); // 3 px

	if (Y <= Y_cell_start + Radius && Y >= Y_cell_start - Radius)
	{
		return {Pos : CellPos, Border : 0};
	}
	else if (Y <= Y_cell_end + Radius && Y >= Y_cell_end - Radius)
	{
		if (VMerge_count != VMerge_count_over)
			return {Pos : CellPos, Border : -1}

		return {Pos : CellPos, Border : 2, Row : CellPos.Row + VMerge_count_over - 1};
	}
	else if (X <= X_cell_start + Radius && X >= X_cell_start - Radius)
	{
		return {Pos : CellPos, Border : 3};
	}
	else if (X <= X_cell_end + Radius && X >= X_cell_end - Radius)
	{
		return {Pos : CellPos, Border : 1};
	}

	return {Pos : CellPos, Border : -1};
};
CTable.prototype.Internal_OnContentRecalculate = function(bNeedDocumentRecalc, PageNum, DocumentIndex)
{
	if (false === this.TurnOffRecalcEvent)
	{
		this.Parent.OnContentRecalculate(bNeedDocumentRecalc, PageNum, DocumentIndex);
	}
};
CTable.prototype.Internal_Selection_UpdateCells = function(bForceSelectByLines)
{
	if ("undefined" == typeof(bForceSelectByLines))
		bForceSelectByLines = false;

	this.Selection.Type = table_Selection_Cell;
	this.Selection.Data = [];

	if (0 === this.Parent.Selection_Is_OneElement() && false == bForceSelectByLines)
	{
		// Определяем ячейки, которые попали в наш селект
		// Алгоритм следующий:
		//  1. Находим максимальную левую и правую границы, у начальной и конечной
		//     ячеек селекта. Границы мы находим по сетке таблицы (TableGrid).
		//  2. Бежим по строкам и добавляем все ячейки, которые имеют непустое пересечение
		//     с нашим диапазоном в сетке.

		var StartRow  = this.Selection.StartPos.Pos.Row;
		var StartCell = this.Selection.StartPos.Pos.Cell;
		var EndRow    = this.Selection.EndPos.Pos.Row;
		var EndCell   = this.Selection.EndPos.Pos.Cell;

		if (EndRow < StartRow)
		{
			var TempRow = StartRow;
			StartRow    = EndRow;
			EndRow      = TempRow;

			var TempCell = StartCell;
			StartCell    = EndCell;
			EndCell      = TempCell;
		}

		if (StartRow === EndRow)
		{
			if (EndCell < StartCell)
			{
				var TempCell = StartCell;
				StartCell    = EndCell;
				EndCell      = TempCell;
			}

			var Row = this.Content[StartRow];
			for (var CurCell = StartCell; CurCell <= EndCell; CurCell++)
			{
				var Cell     = Row.Get_Cell(CurCell);
				var GridSpan = Cell.Get_GridSpan();
				var Vmerge   = Cell.Get_VMerge();

				// Обсчет такик ячеек произошел ранее
				if (vmerge_Continue === Vmerge)
				{
					CurGridCol += GridSpan;
					continue;
				}
				this.Selection.Data.push({Row : StartRow, Cell : CurCell});
			}
		}
		else
		{
			var Cell_s = this.Content[StartRow].Get_Cell(StartCell);
			var Cell_e = this.Content[EndRow].Get_Cell(EndCell);

			var GridCol_cs_start = this.Content[StartRow].Get_StartGridCol(StartCell);
			var GridCol_cs_end   = Cell_s.Get_GridSpan() - 1 + GridCol_cs_start;
			var GridCol_ce_start = this.Content[EndRow].Get_StartGridCol(EndCell);
			var GridCol_ce_end   = Cell_e.Get_GridSpan() - 1 + GridCol_ce_start;

			var GridCol_start = GridCol_cs_start;
			if (GridCol_ce_start < GridCol_start)
				GridCol_start = GridCol_ce_start;

			var GridCol_end = GridCol_cs_end;
			if (GridCol_end < GridCol_ce_end)
				GridCol_end = GridCol_ce_end;

			for (var CurRow = StartRow; CurRow <= EndRow; CurRow++)
			{
				var Row        = this.Content[CurRow];
				var BeforeInfo = Row.Get_Before();
				var CurGridCol = BeforeInfo.GridBefore;
				var CellsCount = Row.Get_CellsCount();
				for (var CurCell = 0; CurCell < CellsCount; CurCell++)
				{
					var Cell     = Row.Get_Cell(CurCell);
					var GridSpan = Cell.Get_GridSpan();
					var Vmerge   = Cell.Get_VMerge();

					// Обсчет такик ячеек произошел ранее
					if (vmerge_Continue === Vmerge)
					{
						CurGridCol += GridSpan;
						continue;
					}

					// У первой строки мы не селектим ячейки до начальной.
					// Аналогично, у последней строки мы не селектим ничего после
					// конечной ячейки.
					if (( StartRow === CurRow /*&& CurCell >= StartCell*/ ) || ( EndRow === CurRow /*&& CurCell <= EndCell*/ ) || ( CurRow > StartRow && CurRow < EndRow ))
					{
						if (( CurGridCol >= GridCol_start && CurGridCol <= GridCol_end ) || ( CurGridCol + GridSpan - 1 >= GridCol_start && CurGridCol + GridSpan - 1 <= GridCol_end ))
							this.Selection.Data.push({Row : CurRow, Cell : CurCell});
					}

					CurGridCol += GridSpan;
				}
			}
		}
	}
	else
	{
		var RowsCount = this.Content.length;

		var StartRow = Math.min(Math.max(0, this.Selection.StartPos.Pos.Row), RowsCount - 1);
		var EndRow   = Math.min(Math.max(0, this.Selection.EndPos.Pos.Row), RowsCount - 1);

		if (EndRow < StartRow)
		{
			var TempRow = StartRow;
			StartRow    = EndRow;
			EndRow      = TempRow;
		}

		for (var CurRow = StartRow; CurRow <= EndRow; CurRow++)
		{
			var Row        = this.Content[CurRow];
			var CellsCount = Row.Get_CellsCount();
			for (var CurCell = 0; CurCell < CellsCount; CurCell++)
			{
				var Cell   = Row.Get_Cell(CurCell);
				var Vmerge = Cell.Get_VMerge();

				if (vmerge_Continue === Vmerge)
					continue;

				this.Selection.Data.push({Row : CurRow, Cell : CurCell});
			}
		}
	}

	if (this.Selection.Data.length > 1)
		this.Selection.CurRow = this.Selection.Data[this.Selection.Data.length - 1].Row;

	// В "flow" таблице обновляем значения настроек для параграфа и текста
	if (true != this.Is_Inline() && true === this.Selection.Use && false === this.Selection.Start)
	{
		var ParaPr = this.Get_Paragraph_ParaPr();
		if (null != ParaPr)
			editor.UpdateParagraphProp(ParaPr);

		var TextPr = this.Get_Paragraph_TextPr();
		if (null != TextPr)
			editor.UpdateTextPr(TextPr);
	}
};
CTable.prototype.Internal_CompareBorders2 = function(Border1, Border2)
{
	var ResultBorder = new CDocumentBorder();
	if (Border1.Value != Border2.Value)
		ResultBorder.Value = undefined;
	else
		ResultBorder.Value = Border1.Value;

	if (Border1.Size != Border2.Size)
		ResultBorder.Size = undefined;
	else
		ResultBorder.Size = Border1.Size;

	if (undefined === Border1.Color || undefined === Border2.Color || Border1.Color.r != Border2.Color.r || Border1.Color.g != Border2.Color.g || Border1.Color.b != Border2.Color.b)
		ResultBorder.Color = undefined;
	else
		ResultBorder.Color.Set(Border1.Color.r, Border1.Color.g, Border1.Color.b);

	return ResultBorder;
};
CTable.prototype.Internal_CompareBorders3 = function(Border1, Border2)
{
	if (Border1.Value != Border2.Value)
		return false;

	if (Border1.Size != Border2.Size)
		return false;

	if (Border1.Color.r != Border2.Color.r || Border1.Color.g != Border2.Color.g || Border1.Color.b != Border2.Color.b)
		return false;

	return true;
};
CTable.prototype.Internal_CheckNullBorder = function(Border)
{
	if (null === Border || undefined === Border)
		return true;

	if (null != Border.Value)
		return false;

	if (null != Border.Size)
		return false;

	if (null != Border.Color && ( null != Border.Color.r || null != Border.Color.g || null != Border.Color.b ) || Border.Unifill != null)
		return false;

	return true;
};
CTable.prototype.Internal_Get_SelectionArray = function()
{
	var SelectionArray = null;
	if (true === this.ApplyToAll)
	{
		SelectionArray = [];
		for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
		{
			var Row = this.Content[CurRow];
			for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++)
			{
				var Cell   = Row.Get_Cell(CurCell);
				var Vmerge = Cell.Get_VMerge();

				if (vmerge_Continue === Vmerge)
					continue;

				SelectionArray.push({Cell : CurCell, Row : CurRow});
			}
		}
	}
	else if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)
		SelectionArray = this.Selection.Data;
	else
		SelectionArray = [{Cell : this.CurCell.Index, Row : this.CurCell.Row.Index}];

	return SelectionArray;
};
CTable.prototype.Internal_Get_TableMinWidth = function()
{
	var MinWidth = 0;
	// Оценим минимально возможную ширину
	for (var CurRow = 0; CurRow < this.Content.length; CurRow++)
	{
		var Row         = this.Content[CurRow];
		var Cells_Count = Row.Get_CellsCount();

		var CellSpacing = Row.Get_CellSpacing();
		if (null === CellSpacing)
			CellSpacing = 0;

		var RowWidth = CellSpacing * ( Cells_Count + 1 );

		for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
		{
			var Cell         = Row.Get_Cell(CurCell);
			var Cell_Margins = Cell.Get_Margins();

			RowWidth += Cell_Margins.Left.W + Cell_Margins.Right.W;
		}

		if (MinWidth < RowWidth)
			MinWidth = RowWidth;
	}

	return MinWidth;
};
CTable.prototype.Internal_Get_MinSumGrid = function()
{
	var ColsCount = this.TableGridCalc.length;
	var SumGrid   = [];
	for (var Index = -1; Index < ColsCount; Index++)
		SumGrid[Index] = 0;

	var RowsCount = this.Content.length;
	for (var CurRow = 0; CurRow < RowsCount; CurRow++)
	{
		var Row         = this.Content[CurRow];
		var Cells_Count = Row.Get_CellsCount();

		var CellSpacing = Row.Get_CellSpacing();
		if (null === CellSpacing)
			CellSpacing = 0;

		var CurGridCol = 0;

		for (var CurCell = 0; CurCell < Cells_Count; CurCell++)
		{
			var Cell         = Row.Get_Cell(CurCell);
			var Cell_Margins = Cell.Get_Margins();
			var GridSpan     = Cell.Get_GridSpan();

			var Cell_MinWidth = Cell_Margins.Left.W + Cell_Margins.Right.W;
			if (0 === CurCell || Cells_Count - 1 === CurCell)
				Cell_MinWidth += CellSpacing * 1.5;
			else
				Cell_MinWidth += CellSpacing;

			if (SumGrid[CurGridCol + GridSpan - 1] < SumGrid[CurGridCol - 1] + Cell_MinWidth)
				SumGrid[CurGridCol + GridSpan - 1] = SumGrid[CurGridCol - 1] + Cell_MinWidth;

			CurGridCol += GridSpan;
		}
	}

	return SumGrid;
};
CTable.prototype.Internal_ScaleTableWidth = function(SumGrid, TableW)
{
	var SumGrid_min = this.Internal_Get_MinSumGrid();

	// Массив означает, какие колонки таблицы нам надо изменить
	var Grids_to_scale = [];
	for (var Index = 0; Index < SumGrid.length; Index++)
		Grids_to_scale[Index] = true;

	var Grids_to_scale_count = Grids_to_scale.length;

	var TableGrid = [];
	TableGrid[0]  = SumGrid[0];
	for (var Index = 1; Index < SumGrid.length; Index++)
		TableGrid[Index] = SumGrid[Index] - SumGrid[Index - 1];

	var TableGrid_min = [];
	TableGrid_min[0]  = SumGrid_min[0];
	for (var Index = 1; Index < SumGrid_min.length; Index++)
		TableGrid_min[Index] = SumGrid_min[Index] - SumGrid_min[Index - 1];

	var CurrentW = SumGrid[SumGrid.length - 1];
	while (Grids_to_scale_count > 0 && CurrentW > 0.001)
	{
		// Пробуем ужать колонки таблицы
		var Koef = TableW / CurrentW;

		var TableGrid_cur = [];
		for (var Index = 0; Index < TableGrid.length; Index++)
			TableGrid_cur[Index] = TableGrid[Index];

		for (var AddIndex = 0; AddIndex <= TableGrid_cur.length - 1; AddIndex++)
		{
			if (true === Grids_to_scale[AddIndex])
				TableGrid_cur[AddIndex] = TableGrid_cur[AddIndex] * Koef;
		}

		var bBreak = true;

		// Проверяем, не стали ли некоторые колонки меньше минимально возможной ширины
		for (var AddIndex = 0; AddIndex <= TableGrid_cur.length - 1; AddIndex++)
		{
			if (true === Grids_to_scale[AddIndex] && TableGrid_cur[AddIndex] - TableGrid_min[AddIndex] < 0.001)
			{
				bBreak                   = false;
				Grids_to_scale[AddIndex] = false;
				Grids_to_scale_count--;

				CurrentW -= TableGrid[AddIndex];
				TableW -= TableGrid_min[AddIndex];

				TableGrid[AddIndex] = TableGrid_min[AddIndex];
			}
		}

		if (true === bBreak)
		{
			for (var AddIndex = 0; AddIndex <= TableGrid_cur.length - 1; AddIndex++)
			{
				if (true === Grids_to_scale[AddIndex])
					TableGrid[AddIndex] = TableGrid_cur[AddIndex];
			}

			break;
		}
	}

	var SumGrid_new = [];
	SumGrid_new[-1] = 0;
	for (var Index = 0; Index < TableGrid.length; Index++)
		SumGrid_new[Index] = TableGrid[Index] + SumGrid_new[Index - 1];

	return SumGrid_new;
};
CTable.prototype.Internal_Get_NextCell = function(Pos)
{
	var Cell_Index = Pos.Cell;
	var Row_Index  = Pos.Row;

	if (Cell_Index < this.Content[Row_Index].Get_CellsCount() - 1)
	{
		Pos.Cell = Cell_Index + 1;
		return this.Content[Pos.Row].Get_Cell(Pos.Cell);
	}
	else if (Row_Index < this.Content.length - 1)
	{
		Pos.Row  = Row_Index + 1;
		Pos.Cell = 0;
		return this.Content[Pos.Row].Get_Cell(Pos.Cell);
	}
	else
		return null;
};
CTable.prototype.Internal_Get_PrevCell = function(Pos)
{
	var Cell_Index = Pos.Cell;
	var Row_Index  = Pos.Row;

	if (Cell_Index > 0)
	{
		Pos.Cell = Cell_Index - 1;
		return this.Content[Pos.Row].Get_Cell(Pos.Cell);
	}
	else if (Row_Index > 0)
	{
		Pos.Row  = Row_Index - 1;
		Pos.Cell = this.Content[Row_Index - 1].Get_CellsCount() - 1;
		return this.Content[Pos.Row].Get_Cell(Pos.Cell);
	}
	else
		return null;
};
CTable.prototype.Internal_Copy_Grid = function(Grid)
{
	if (undefined !== Grid && null !== Grid)
	{
		var Count   = Grid.length;
		var NewGrid = new Array(Count);
		var Index   = 0;
		for (; Index < Count; Index++)
			NewGrid[Index] = Grid[Index];

		return NewGrid;
	}

	return [];
};
CTable.prototype.private_UpdateTableRulerOnBorderMove = function(Pos)
{
	if (null != this.Selection.Data2.Min)
		Pos = Math.max(Pos, this.Selection.Data2.Min);

	if (null != this.Selection.Data2.Max)
		Pos = Math.min(Pos, this.Selection.Data2.Max);

	// Обновляем Markup по ячейке в которой мы двигаем границу. Так делаем, потому что мы можем находится изначально
	// на другой странице данной таблице, а там Markup может быть совершенно другим. В конце движения границы
	// произойдет обновление селекта, и Markup обновится по текущему положению курсора.
	this.Internal_Update_TableMarkup(this.Selection.Data2.Pos.Row, this.Selection.Data2.Pos.Cell, this.Selection.Data2.PageNum);
	this.DrawingDocument.UpdateTableRuler(this.Selection.Data2.bCol, this.Selection.Data2.Index, Pos);

	return Pos;
};
/**
 * Считаем количество соединенных вертикально ячеек на заданной странице
 */
CTable.prototype.private_GetVertMergeCountOnPage = function(CurPage, CurRow, StartGridCol, GridSpan)
{
	var VMergeCount = this.Internal_GetVertMergeCount(CurRow, StartGridCol, GridSpan);

	if (true !== this.Is_EmptyPage(CurPage) && CurRow + VMergeCount - 1 >= this.Pages[CurPage].LastRow)
	{
		VMergeCount = this.Pages[CurPage].LastRow + 1 - CurRow;
		if (false === this.RowsInfo[CurRow + VMergeCount - 1].FirstPage && CurPage === this.RowsInfo[CurRow + VMergeCount - 1].StartPage)
			VMergeCount--;
	}

	return VMergeCount;
};
CTable.prototype.Get_TopElement = function()
{
    if (!this.Parent)
        return null;

    if (true === this.Parent.Is_TopDocument(false))
        return this;

    return this.Parent.Get_TopElement();
};
CTable.prototype.Get_Index = function()
{
    if (!this.Parent)
        return -1;

    this.Parent.Update_ContentIndexing();

    return this.Index;
};
CTable.prototype.Get_RowsCount = function()
{
    return this.Content.length;
};
CTable.prototype.Get_Row = function(Index)
{
    return this.Content[Index];
};
CTable.prototype.Compare_DrawingsLogicPositions = function(CompareObject)
{
    for (var CurRow = 0, RowsCount = this.Get_RowsCount(); CurRow < RowsCount; CurRow++)
    {
        var Row = this.Get_Row(CurRow);
        for (var CurCell = 0, CellsCount = Row.Get_CellsCount(); CurCell < CellsCount; CurCell++)
        {
            var Cell = Row.Get_Cell(CurCell);
            Cell.Content.Compare_DrawingsLogicPositions(CompareObject);

            if (0 !== CompareObject.Result)
                return;
        }
    }
};
CTable.prototype.Start_SelectionFromCurPos = function()
{
    this.Selection.Use    = true;
    this.Selection.Type   = table_Selection_Text;
    this.Selection.CurRow = this.CurCell.Row.Index;

    this.Selection.StartPos.Pos = { Cell : this.CurCell.Index, Row : this.CurCell.Row.Index };
    this.Selection.EndPos.Pos   = { Cell : this.CurCell.Index, Row : this.CurCell.Row.Index };
    this.Internal_Selection_UpdateCells();

    this.CurCell.Content.Start_SelectionFromCurPos();
};
CTable.prototype.Get_StyleFromFormatting = function()
{
    var SelectionArray = this.Internal_Get_SelectionArray();
    if (SelectionArray.length > 0)
    {
        var Pos = SelectionArray[0];
        var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
        return Cell.Content.Get_StyleFromFormatting();
    }
    return null;
};
CTable.prototype.Set_ReviewType = function(ReviewType)
{

};
CTable.prototype.Get_ReviewType = function()
{
    return reviewtype_Common;
};
CTable.prototype.Get_SectPr = function()
{
    if (this.Parent && this.Parent.Get_SectPr)
    {
        this.Parent.Update_ContentIndexing();
        return this.Parent.Get_SectPr(this.Index);
    }

    return null;
};
CTable.prototype.Is_SelectedAll = function()
{
    if (true !== this.Selection.Use)
        return false;

    var ArrayPos = 0;
    var SelectionArray = this.Selection.Data;
    for (var CurRow = 0, RowsCount = this.Content.length; CurRow < RowsCount; CurRow++)
    {
        var Row = this.Content[CurRow];
        for (var CurCell = 0, CellsCount = Row.Get_CellsCount(); CurCell < CellsCount; CurCell++, ArrayPos++)
        {
            if (ArrayPos >= SelectionArray.length)
                return false;

            var Pos = SelectionArray[ArrayPos];
            if (Pos.Row !== CurRow || Pos.Cell !== CurCell)
                return false;
        }
    }

    return true;
};
CTable.prototype.Accept_RevisionChanges = function(Type, bAll)
{
    if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0))
    {
        var Cells_array = this.Internal_Get_SelectionArray();
        for (var Index = 0, Count = Cells_array.length; Index < Count; Index++)
        {
            var Pos = Cells_array[Index];
            var Row = this.Content[Pos.Row];
            var Cell = Row.Get_Cell(Pos.Cell);
            var Cell_Content = Cell.Content;

            Cell.Content.Accept_RevisionChanges(Type, true);
        }
    }
    else
        return this.CurCell.Content.Accept_RevisionChanges(Type, bAll);
};
CTable.prototype.Reject_RevisionChanges = function(Type, bAll)
{
    if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0))
    {
        var Cells_array = this.Internal_Get_SelectionArray();
        for (var Index = 0, Count = Cells_array.length; Index < Count; Index++)
        {
            var Pos = Cells_array[Index];
            var Row = this.Content[Pos.Row];
            var Cell = Row.Get_Cell(Pos.Cell);
            var Cell_Content = Cell.Content;

            Cell_Content.Reject_RevisionChanges(Type, true);
        }
    }
    else
        return this.CurCell.Content.Reject_RevisionChanges(Type, bAll);
};
CTable.prototype.Get_RevisionsChangeParagraph = function(SearchEngine)
{
    if (true === SearchEngine.Is_Found())
        return;

    var CurCell = 0, CurRow = 0;
    if (true !== SearchEngine.Is_CurrentFound())
    {
        var Cells_array = this.Internal_Get_SelectionArray();
        if (Cells_array.length <= 0)
            return;

        CurRow  = Cells_array[0].Row;
        CurCell = Cells_array[0].Cell;
    }
    else
    {
        if (SearchEngine.Get_Direction() > 0)
        {
            CurRow  = 0;
            CurCell = 0;
        }
        else
        {
            CurRow  = this.Get_RowsCount() - 1;
            CurCell = this.Get_Row(CurRow).Get_CellsCount() - 1;
        }
    }

    var Cell = this.Get_Row(CurRow).Get_Cell(CurCell);

    while (null != Cell && vmerge_Restart != Cell.Get_VMerge())
        Cell = this.private_GetPrevCell(CurRow, CurCell);

    Cell.Content.Get_RevisionsChangeParagraph(SearchEngine);
    while (true !== SearchEngine.Is_Found())
    {
        if (SearchEngine.Get_Direction() > 0)
        {
            Cell = this.private_GetNextCell(Cell.Row.Index, Cell.Index);
            while (null != Cell && vmerge_Restart != Cell.Get_VMerge())
                Cell = this.private_GetNextCell(Cell.Row.Index, Cell.Index);
        }
        else
        {
            Cell = this.private_GetPrevCell(Cell.Row.Index, Cell.Index);
            while (null != Cell && vmerge_Restart != Cell.Get_VMerge())
                Cell = this.private_GetPrevCell(Cell.Row.Index, Cell.Index);
        }

        if (null === Cell)
            break;

        Cell.Content.Get_RevisionsChangeParagraph(SearchEngine);
    }
};
CTable.prototype.private_GetNextCell = function(RowIndex, CellIndex)
{
    return this.Internal_Get_NextCell({Cell : CellIndex, Row : RowIndex});
};
CTable.prototype.private_GetPrevCell = function(RowIndex, CellIndex)
{
    return this.Internal_Get_PrevCell({Cell : CellIndex, Row : RowIndex});
};
CTable.prototype.Check_ChangedTableGrid = function()
{
    var TableGrid_old = this.Internal_Copy_Grid(this.TableGridCalc);
    this.private_RecalculateGrid();
    var TableGrid_new = this.TableGridCalc;
    for (var CurCol = 0, ColsCount = this.TableGridCalc.length; CurCol < ColsCount; CurCol++)
    {
        if (Math.abs(TableGrid_old[CurCol] - TableGrid_new[CurCol]) > 0.001)
        {
            this.RecalcInfo.TableBorders = true;
            return true;
        }
    }

    return false;
};
CTable.prototype.Get_ContentPosition = function(bSelection, bStart, PosArray)
{
    if (!PosArray)
        PosArray = [];

    var CurRow  = (true === bSelection ? (true === bStart ? this.Selection.StartPos.Pos.Row  : this.Selection.EndPos.Pos.Row)  : this.CurCell.Row.Index);
    var CurCell = (true === bSelection ? (true === bStart ? this.Selection.StartPos.Pos.Cell : this.Selection.EndPos.Pos.Cell) : this.CurCell.Index);

    var Row = this.Get_Row(CurRow);
    PosArray.push({Class : this, Position : CurRow});
    PosArray.push({Class : this.Get_Row(CurRow), Position : CurCell});

    if (Row && CurCell >= 0 && CurCell < Row.Get_CellsCount())
    {
        var Cell = Row.Get_Cell(CurCell);
        Cell.Content.Get_ContentPosition(bSelection, bStart, PosArray);
    }

    return PosArray;
};
CTable.prototype.Get_Index = function()
{
    if (!this.Parent)
        return -1;

    this.Parent.Update_ContentIndexing();
    return this.Index;
};
CTable.prototype.Get_DocumentPositionFromObject = function(PosArray)
{
    if (!PosArray)
        PosArray = [];

    if (this.Parent)
    {
        PosArray.splice(0, 0, {Class : this.Parent, Position : this.Get_Index()});
        this.Parent.Get_DocumentPositionFromObject(PosArray);
    }

    return PosArray;
};
CTable.prototype.Set_ContentSelection = function(StartDocPos, EndDocPos, Depth, StartFlag, EndFlag)
{
    if ((0 === StartFlag && (!StartDocPos[Depth] || this !== StartDocPos[Depth].Class)) || (0 === EndFlag && (!EndDocPos[Depth] || this !== EndDocPos[Depth].Class)))
        return;

    var IsOneElement = true;
    var StartRow = 0;
    switch (StartFlag)
    {
        case 0 : StartRow = StartDocPos[Depth].Position; break;
        case 1 : StartRow = 0; IsOneElement = false; break;
        case -1: StartRow = this.Content.length - 1; IsOneElement = false; break;
    }

    var EndRow = 0;
    switch (EndFlag)
    {
        case 0 : EndRow = EndDocPos[Depth].Position; break;
        case 1 : EndRow = 0; IsOneElement = false; break;
        case -1: EndRow = this.Content.length - 1; IsOneElement = false; break;
    }

    var _StartDocPos = StartDocPos, _StartFlag = StartFlag;
    if (null !== StartDocPos && true === StartDocPos[Depth].Deleted)
    {
        if (StartRow < this.Content.length)
        {
            _StartDocPos = null;
            _StartFlag = 1;
        }
        else if (StartRow > 0)
        {
            StartRow--;
            _StartDocPos = null;
            _StartFlag = -1;
        }
        else
        {
            // Такого не должно быть
            return;
        }
    }

    var _EndDocPos = EndDocPos, _EndFlag = EndFlag;
    if (null !== EndDocPos && true === EndDocPos[Depth].Deleted)
    {
        if (EndRow < this.Content.length)
        {
            _EndDocPos = null;
            _EndFlag = 1;
        }
        else if (EndRow > 0)
        {
            EndRow--;
            _EndDocPos = null;
            _EndFlag = -1;
        }
        else
        {
            // Такого не должно быть
            return;
        }
    }

    var StartCell = 0;
    switch (_StartFlag)
    {
        case 0 : StartCell = _StartDocPos[Depth + 1].Position; break;
        case 1 : StartCell = 0; break;
        case -1: StartCell = this.Content[StartRow].Get_CellsCount() - 1; break;
    }

    var EndCell = 0;
    switch (_EndFlag)
    {
        case 0 : EndCell = _EndDocPos[Depth + 1].Position; break;
        case 1 : EndCell = 0; break;
        case -1: EndCell = this.Content[EndRow].Get_CellsCount() - 1; break;
    }

    var __StartDocPos = _StartDocPos, __StartFlag = _StartFlag;
    if (null !== _StartDocPos && true === _StartDocPos[Depth + 1].Deleted)
    {
        if (StartCell < this.Content[StartRow].Get_CellsCount())
        {
            __StartDocPos = null;
            __StartFlag = 1;
        }
        else if (StartCell > 0)
        {
            StartCell--;
            __StartDocPos = null;
            __StartFlag = -1;
        }
        else
        {
            // Такого не должно быть
            return;
        }
    }

    var __EndDocPos = _EndDocPos, __EndFlag = _EndFlag;
    if (null !== _EndDocPos && true === _EndDocPos[Depth + 1].Deleted)
    {
        if (EndCell < this.Content[EndCell].Get_CellsCount())
        {
            __EndDocPos = null;
            __EndFlag   = 1;
        }
        else if (EndCell > 0)
        {
            EndCell--;
            __EndDocPos = null;
            __EndFlag   = -1;
        }
        else
        {
            // Такого не должно быть
            return;
        }
    }

    this.Selection.Use          = true;
    this.Selection.StartPos.Pos = {Row : StartRow, Cell : StartCell};
    this.Selection.EndPos.Pos   = {Row : EndRow, Cell : EndCell};
    this.Selection.CurRow       = EndRow;
    this.Selection.Data         = null;
    this.Selection.Type2        = table_Selection_Common;
    this.Selection.Data2        = null;

    if (StartRow === EndRow && StartCell === EndCell)
    {
        this.CurCell = this.Get_Row(StartRow).Get_Cell(StartCell);
        this.Selection.Type = table_Selection_Text;
        this.CurCell.Content.Set_ContentSelection(__StartDocPos, __EndDocPos, Depth + 2, __StartFlag, __EndFlag);
    }
    else
    {
        this.Selection.Type = table_Selection_Cell;
        this.Internal_Selection_UpdateCells(IsOneElement ? false : true);
    }
};
CTable.prototype.Set_ContentPosition = function(DocPos, Depth, Flag)
{
    if (0 === Flag && (!DocPos[Depth] || this !== DocPos[Depth].Class))
        return;

    var CurRow = 0;
    switch (Flag)
    {
        case 0 : CurRow = DocPos[Depth].Position; break;
        case 1 : CurRow = 0; break;
        case -1: CurRow = this.Content.length - 1; break;
    }

    var _DocPos = DocPos, _Flag = Flag;
    if (null !== DocPos && true === DocPos[Depth].Deleted)
    {
        if (CurRow < this.Content.length)
        {
            _DocPos = null;
            _Flag = 1;
        }
        else if (CurRow > 0)
        {
            CurRow--;
            _DocPos = null;
            _Flag = -1;
        }
        else
        {
            // Такого не должно быть
            return;
        }
    }

    var CurCell = 0;
    switch (_Flag)
    {
        case 0 : CurCell = _DocPos[Depth + 1].Position; break;
        case 1 : CurCell = 0; break;
        case -1: CurCell = this.Content[CurRow].Get_CellsCount() - 1; break;
    }

    var __DocPos = _DocPos, __Flag = _Flag;
    if (null !== _DocPos && true === _DocPos[Depth + 1].Deleted)
    {
        if (CurCell < this.Content[CurRow].Get_CellsCount())
        {
            __DocPos = null;
            __Flag = 1;
        }
        else if (CurCell > 0)
        {
            CurCell--;
            __DocPos = null;
            __Flag = -1;
        }
        else
        {
            // Такого не должно быть
            return;
        }
    }

    var Row  = this.Get_Row(CurRow);
    if (!Row)
        return;

    var Cell = Row.Get_Cell(CurCell);
    if (!Cell)
        return;

    this.CurCell = Cell;
    this.CurCell.Content.Set_ContentPosition(__DocPos, Depth + 2, __Flag);
};
CTable.prototype.Set_CurCell = function(Cell)
{
    if (!Cell || this !== Cell.Get_Table())
        return;

    this.CurCell = Cell;
};
CTable.prototype.Is_EmptyPage = function(CurPage)
{
    if (!this.Pages[CurPage]
        || (this.Pages[CurPage].LastRow < this.Pages[CurPage].FirstRow)
        || (0 === CurPage && true !== this.RowsInfo[0].FirstPage))
        return true;

    return false;
};
CTable.prototype.Check_EmptyPages = function(CurPage)
{
    for (var _CurPage = CurPage; _CurPage >= 0; --_CurPage)
    {
        if (true !== this.Is_EmptyPage(_CurPage))
            return false;
    }

    return true;
};
CTable.prototype.private_StartTrackTable = function(CurPage)
{
    if (CurPage < 0 || CurPage >= this.Pages.length)
        return;

    var Bounds     = this.Get_PageBounds(CurPage);
    var NewOutline = new AscCommon.CTableOutline(this, this.Get_AbsolutePage(CurPage), Bounds.Left, Bounds.Top, Bounds.Right - Bounds.Left, Bounds.Bottom - Bounds.Top);

    var Transform = this.Get_ParentTextTransform();
    this.DrawingDocument.StartTrackTable(NewOutline, Transform);
};
CTable.prototype.Correct_BadTable = function()
{
    // TODO: Пока оставим эту заглушку на случай загрузки плохих таблиц. В будущем надо будет
    //       сделать нормальный обсчет для случая, когда у нас есть "пустые" строки (составленные
    //       из вертикально объединенных ячеек).
    this.Internal_Check_TableRows(false);
	this.CorrectBadGrid();
};
CTable.prototype.Get_NumberingInfo = function(NumberingEngine)
{
    if (NumberingEngine.Is_Found())
        return;

    for (var CurRow = 0, RowsCount = this.Get_RowsCount(); CurRow < RowsCount; ++CurRow)
    {
        var Row = this.Get_Row(CurRow);
        for (var CurCell = 0, CellsCount = Row.Get_CellsCount(); CurCell < CellsCount; ++CurCell)
        {
            var Cell = Row.Get_Cell(CurCell);
            Cell.Content.Get_NumberingInfo(NumberingEngine);

            if (NumberingEngine.Is_Found())
                return;
        }
    }
};
CTable.prototype.Is_TableFirstRowOnNewPage = function(CurRow)
{
    for (var CurPage = 0, PagesCount = this.Pages.length; CurPage < PagesCount; ++CurPage)
    {
        if (CurRow === this.Pages[CurPage].FirstRow && CurRow <= this.Pages[CurPage].LastRow)
        {
            if (0 === CurPage && (null != this.Get_DocumentPrev() || (true === this.Parent.Is_TableCellContent() && true !== this.Parent.Is_TableFirstRowOnNewPage())))
                return false;

            return true;
        }
    }

    return false;
};
CTable.prototype.private_UpdateCellsGrid = function()
{
    for (var nCurRow = 0, nRowsCount = this.Content.length; nCurRow < nRowsCount; ++nCurRow)
    {
        var Row        = this.Content[nCurRow];
        var BeforeInfo = Row.Get_Before();
        var CurGridCol = BeforeInfo.GridBefore;

        for (var nCurCell = 0, nCellsCount = Row.Get_CellsCount(); nCurCell < nCellsCount; ++nCurCell)
        {
            var Cell = Row.Get_Cell(nCurCell);
            var GridSpan = Cell.Get_GridSpan();
            Cell.Set_Metrics(CurGridCol, 0, 0, 0, 0, 0, 0);
            Row.Update_CellInfo(nCurCell);
            CurGridCol += GridSpan;
        }
    }
};
CTable.prototype.IncDec_Indent = function(bIncrease)
{
    if (true === this.ApplyToAll || ( true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0 ))
    {
        var TablePr = this.Get_CompiledPr(false).TablePr;

        var LeftIndOld = TablePr.TableInd;
        if (undefined === LeftIndOld || null === LeftIndOld)
        {
            LeftIndOld = 0;
        }
        else if (LeftIndOld < 0)
        {
            this.Set_TableInd(0);
            return;
        }

        var LeftIndNew = 0;
        if (true === bIncrease)
        {
            if (LeftIndOld >= 0)
            {
                LeftIndOld = 12.5 * parseInt(10 * LeftIndOld / 125);
                LeftIndNew = ( (LeftIndOld - (10 * LeftIndOld) % 125 / 10) / 12.5 + 1) * 12.5;
            }

            if (LeftIndNew < 0)
                LeftIndNew = 12.5;
        }
        else
        {
            var TempValue = (125 - (10 * LeftIndOld) % 125);
            TempValue     = ( 125 === TempValue ? 0 : TempValue );
            LeftIndNew    = Math.max(( (LeftIndOld + TempValue / 10) / 12.5 - 1 ) * 12.5, 0);
        }

        this.Set_TableInd(LeftIndNew);
    }
    else
    {
        this.CurCell.Content.Paragraph_IncDecIndent(bIncrease);
    }
};
CTable.prototype.SetTableGrid = function(arrGrid)
{
	History.Add(new CChangesTableTableGrid(this, this.TableGrid, arrGrid));
	this.TableGrid = arrGrid;
};
CTable.prototype.private_CopyTableGrid = function()
{
	var arrGrid = [];
	for (var nIndex = 0, nCount = this.TableGrid.length; nIndex < nCount; ++nIndex)
	{
		arrGrid[nIndex] = this.TableGrid[nIndex];
	}
	return arrGrid;
};
CTable.prototype.private_CopyTableGridCalc = function()
{
	var arrGrid = [];
	for (var nIndex = 0, nCount = this.TableGridCalc.length; nIndex < nCount; ++nIndex)
	{
		arrGrid[nIndex] = this.TableGridCalc[nIndex];
	}
	return arrGrid;
};
CTable.prototype.CorrectBadGrid = function()
{
	// HACK: При загрузке мы запрещаем компилировать стили, но нам все-таки это здесь нужно
	var bLoad = AscCommon.g_oIdCounter.m_bLoad;
	var bRead = AscCommon.g_oIdCounter.m_bRead;
	AscCommon.g_oIdCounter.m_bLoad = false;
	AscCommon.g_oIdCounter.m_bRead = false;

	// Сначала пробежимся по всем ячейкам и посмотрим, чтобы у них были корректные GridSpan (т.е. >= 1)
	for (var Index = 0; Index < this.Content.length; Index++)
	{
		var Row        = this.Content[Index];
		var CellsCount = Row.Get_CellsCount();
		for (var CellIndex = 0; CellIndex < CellsCount; CellIndex++)
		{
			var Cell     = Row.Get_Cell(CellIndex);
			var GridSpan = Cell.Get_GridSpan();
			if (GridSpan <= 0)
				Cell.Set_GridSpan(1);
		}
	}

	var RowGrid   = [];
	var GridCount = 0;
	for (var Index = 0; Index < this.Content.length; Index++)
	{
		var Row = this.Content[Index];
		Row.Set_Index(Index);

		// Смотрим на ширину пропущенных колонок сетки в начале строки
		var BeforeInfo = Row.Get_Before();
		var CurGridCol = BeforeInfo.GridBefore;

		var CellsCount = Row.Get_CellsCount();
		for (var CellIndex = 0; CellIndex < CellsCount; CellIndex++)
		{
			var Cell     = Row.Get_Cell(CellIndex);
			var GridSpan = Cell.Get_GridSpan();
			CurGridCol += GridSpan;
		}

		// Смотрим на ширину пропущенных колонок сетки в конце строки
		var AfterInfo = Row.Get_After();
		CurGridCol += AfterInfo.GridAfter;

		if (GridCount < CurGridCol)
			GridCount = CurGridCol;

		RowGrid[Index] = CurGridCol;
	}

	for (var Index = 0; Index < this.Content.length; Index++)
	{
		var Row       = this.Content[Index];
		var AfterInfo = Row.Get_After();

		if (RowGrid[Index] < GridCount)
		{
			Row.Set_After(AfterInfo.GridAfter + GridCount - RowGrid[Index], AfterInfo.WAfter);
		}
	}

	var arrGrid = this.private_CopyTableGrid();
	if (arrGrid.length != GridCount)
	{
		if (arrGrid.length < GridCount)
		{
			for (var nIndex = 0; nIndex < GridCount; ++nIndex)
				arrGrid[nIndex] = 20;
		}
		else
		{
			arrGrid.splice(GridCount, arrGrid.length - GridCount);
		}
		this.SetTableGrid(arrGrid);
	}

	// HACK: Восстанавливаем флаги и выставляем, что стиль всей таблицы нужно пересчитать
	AscCommon.g_oIdCounter.m_bLoad = bLoad;
	AscCommon.g_oIdCounter.m_bRead = bRead;
	this.Recalc_CompiledPr2();
};
CTable.prototype.private_CorrectVerticalMerge = function()
{
	// Пробегаемся по всем ячейкам и смотрим на их вертикальное объединение, было ли оно нарушено
	for (var nCurRow = 0, nRowsCount = this.Content.length; nCurRow < nRowsCount; ++nCurRow)
	{
		var oRow     = this.Content[nCurRow];
		var nGridCol = oRow.Get_Before().GridBefore;
		for (var nCurCell = 0, nCellsCount = oRow.Get_CellsCount(); nCurCell < nCellsCount; ++nCurCell)
		{
			var oCell       = oRow.Get_Cell(nCurCell);
			var nVMergeType = oCell.Get_VMerge();
			var nGridSpan   = oCell.Get_GridSpan();

			if (vmerge_Continue === nVMergeType)
			{
				var bNeedReset = true;
				if (0 !== nCurRow)
				{
					var oPrevRow     = this.Content[nCurRow - 1];
					var nPrevGridCol = oPrevRow.Get_Before().GridBefore;
					for (var nPrevCell = 0, nPrevCellsCount = oPrevRow.Get_CellsCount(); nPrevCell < nPrevCellsCount; ++nPrevCell)
					{
						var oPrevCell     = oPrevRow.Get_Cell(nPrevCell);
						var nPrevGridSpan = oPrevCell.Get_GridSpan();

						if (nPrevGridCol === nGridCol)
						{
							if (nPrevGridSpan === nGridSpan)
								bNeedReset = false;

							break;
						}
						else if (nPrevGridCol > nGridCol)
							break;

						nPrevGridCol += nPrevGridSpan;
					}
				}

				if (true === bNeedReset)
					oCell.Set_VMerge(vmerge_Restart);
			}

			nGridCol += nGridSpan;
		}
	}
};
CTable.prototype.private_SetTableLayoutFixedAndUpdateCellsWidth = function(nExceptColNum)
{
	if (tbllayout_AutoFit === this.Get_CompiledPr(false).TablePr.TableLayout)
	{
		this.Set_TableLayout(tbllayout_Fixed);

		// Обновляем ширины ячеек
		var nColsCount = this.TableGrid.length;
		for (var nColIndex = 0; nColIndex < nColsCount; nColIndex++)
		{
			if (nColIndex != nExceptColNum)
				this.Internal_UpdateCellW(nColIndex);
		}
	}
};
CTable.prototype.GotoFootnoteRef = function(isNext, isCurrent)
{
	var nRow = 0, nCell = 0;
	if (true === isCurrent)
	{
		if (true === this.Selection.Use)
		{
			var nStartRow  = this.Selection.StartPos.Pos.Row;
			var nStartCell = this.Selection.StartPos.Pos.Cell;

			var nEndRow  = this.Selection.EndPos.Pos.Row;
			var nEndCell = this.Selection.EndPos.Pos.Cell;

			if (nStartRow < nEndRow || (nStartRow === nEndRow && nStartCell <= nEndCell))
			{
				nRow  = nStartRow;
				nCell = nStartCell;
			}
			else
			{
				nRow  = nEndRow;
				nCell = nEndCell;
			}
		}
		else
		{
			nCell = this.CurCell.Index;
			nRow  = this.CurCell.Row.Index;
		}
	}
	else
	{
		if (true === isNext)
		{
			nRow = 0;
			nCell = 0;
		}
		else
		{
			nRow  = this.Content.length - 1;
			nCell = this.Content[nRow].Get_CellsCount() - 1;
		}
	}

	if (true === isNext)
	{
		for (var nCurRow = nRow, nRowsCount = this.Content.length; nCurRow < nRowsCount; ++nCurRow)
		{
			var oRow = this.Content[nCurRow];
			var nStartCell = (nCurRow === nRow ? nCell : 0);
			for (var nCurCell = nStartCell, nCellsCount = oRow.Get_CellsCount(); nCurCell < nCellsCount; ++nCurCell)
			{
				var oCell = oRow.Get_Cell(nCurCell);
				if (oCell.Content.GotoFootnoteRef(true, true === isCurrent && nCurRow === nRow && nCurCell === nCell))
					return true;
			}
		}
	}
	else
	{
		for (var nCurRow = nRow; nCurRow >= 0; --nCurRow)
		{
			var oRow = this.Content[nCurRow];
			var nStartCell = (nCurRow === nRow ? nCell : oRow.Get_CellsCount() - 1);
			for (var nCurCell = nStartCell; nCurCell >= 0; --nCurCell)
			{
				var oCell = oRow.Get_Cell(nCurCell);
				if (oCell.Content.GotoFootnoteRef(false, true === isCurrent && nCurRow === nRow && nCurCell === nCell))
					return true;
			}
		}
	}

	return false;
};
//----------------------------------------------------------------------------------------------------------------------
// Класс  CTableLook
//----------------------------------------------------------------------------------------------------------------------
function CTableLook(bFC, bFR, bLC, bLR, bBH, bBV)
{
    this.m_bFirst_Col = ( true === bFC ? true : false );
    this.m_bFirst_Row = ( true === bFR ? true : false );
    this.m_bLast_Col  = ( true === bLC ? true : false );
    this.m_bLast_Row  = ( true === bLR ? true : false );
    this.m_bBand_Hor  = ( true === bBH ? true : false );
    this.m_bBand_Ver  = ( true === bBV ? true : false );
}
CTableLook.prototype =
{

    Set : function(bFC, bFR, bLC, bLR, bBH, bBV)
    {
        this.m_bFirst_Col = ( true === bFC ? true : false );
        this.m_bFirst_Row = ( true === bFR ? true : false );
        this.m_bLast_Col  = ( true === bLC ? true : false );
        this.m_bLast_Row  = ( true === bLR ? true : false );
        this.m_bBand_Hor  = ( true === bBH ? true : false );
        this.m_bBand_Ver  = ( true === bBV ? true : false );
    },

    Copy : function()
    {
        return new CTableLook( this.m_bFirst_Col, this.m_bFirst_Row, this.m_bLast_Col, this.m_bLast_Row, this.m_bBand_Hor, this.m_bBand_Ver );
    },

    Is_FirstCol : function()
    {
        return this.m_bFirst_Col;
    },

    Is_FirstRow : function()
    {
        return this.m_bFirst_Row;
    },

    Is_LastCol : function()
    {
        return this.m_bLast_Col;
    },

    Is_LastRow : function()
    {
        return this.m_bLast_Row;
    },

    Is_BandHor : function()
    {
        return this.m_bBand_Hor;
    },

    Is_BandVer : function()
    {
        return this.m_bBand_Ver;
    },

    Write_ToBinary : function(Writer)
    {
        // Bool : m_bFirst_Col
        // Bool : m_bFirst_Row
        // Bool : m_bLast_Col
        // Bool : m_bLast_Row
        // Bool : m_bBand_Hor
        // Bool : m_bBand_Ver

        Writer.WriteBool( this.m_bFirst_Col );
        Writer.WriteBool( this.m_bFirst_Row );
        Writer.WriteBool( this.m_bLast_Col );
        Writer.WriteBool( this.m_bLast_Row );
        Writer.WriteBool( this.m_bBand_Hor );
        Writer.WriteBool( this.m_bBand_Ver );
    },

    Read_FromBinary : function(Reader)
    {
        // Bool : m_bFirst_Col
        // Bool : m_bFirst_Row
        // Bool : m_bLast_Col
        // Bool : m_bLast_Row
        // Bool : m_bBand_Hor
        // Bool : m_bBand_Ver

        this.m_bFirst_Col = Reader.GetBool();
        this.m_bFirst_Row = Reader.GetBool();
        this.m_bLast_Col  = Reader.GetBool();
        this.m_bLast_Row  = Reader.GetBool();
        this.m_bBand_Hor  = Reader.GetBool();
        this.m_bBand_Ver  = Reader.GetBool();
    }
};
//----------------------------------------------------------------------------------------------------------------------
// Класс  CTableAnchorPosition
//----------------------------------------------------------------------------------------------------------------------
function CTableAnchorPosition()
{
    // Рассчитанные координаты
    this.CalcX         = 0;
    this.CalcY         = 0;

    // Данные для Flow-объектов
    this.W             = 0;
    this.H             = 0;
    this.X             = 0;
    this.Y             = 0;
    this.Left_Margin   = 0;
    this.Right_Margin  = 0;
    this.Top_Margin    = 0;
    this.Bottom_Margin = 0;
    this.Page_W        = 0;
    this.Page_H        = 0;

    this.Page_Top      = 0;
    this.Page_Bottom   = 0;

    this.X_min         = 0;
    this.Y_min         = 0;
    this.X_max         = 0;
    this.Y_max         = 0;
}
CTableAnchorPosition.prototype =
{
    Set_X : function(W, X, Left_Margin, Right_Margin, Page_W, X_min, X_max)
    {
        this.W             = W;
        this.X             = X;
        this.Left_Margin   = Left_Margin;
        this.Right_Margin  = Right_Margin;
        this.Page_W        = Page_W;
        this.X_min         = X_min;
        this.X_max         = X_max;
    },

    Set_Y : function(H, Y, Top_Margin, Bottom_Margin, Page_H, Y_min, Y_max, Page_Top, Page_Bottom)
    {
        this.H             = H;
        this.Y             = Y;
        this.Top_Margin    = Top_Margin;
        this.Bottom_Margin = Bottom_Margin;
        this.Page_H        = Page_H;
        this.Y_min         = Y_min;
        this.Y_max         = Y_max;
        this.Page_Top      = Page_Top;
        this.Page_Bottom   = Page_Bottom;
    },

    Calculate_X : function(RelativeFrom, bAlign, Value)
    {
        // Вычисляем координату по X
        switch(RelativeFrom)
        {
            // TODO: пока нет колонок варианты Text и Margin ничем не отличаются,
            //       когда появятся колонки доделать тут
            case c_oAscHAnchor.Text:
            case c_oAscHAnchor.Margin:
            {
                if ( true === bAlign )
                {
                    switch ( Value )
                    {
                        case c_oAscXAlign.Center:
                        {
                            this.CalcX = (this.Left_Margin + this.Right_Margin - this.W) / 2;
                            break;
                        }

                        case c_oAscXAlign.Inside:
                        case c_oAscXAlign.Outside:
                        case c_oAscXAlign.Left:
                        {
                            this.CalcX = this.Left_Margin;
                            break;
                        }

                        case c_oAscXAlign.Right:
                        {
                            this.CalcX = this.Right_Margin - this.W;
                            break;
                        }
                    }
                }
                else
                    this.CalcX = this.Left_Margin + Value;

                break;
            }

            case c_oAscHAnchor.Page:
            {
                var W = this.X_max - this.X_min;
                if ( true === bAlign )
                {
                    switch ( Value )
                    {
                        case c_oAscXAlign.Center:
                        {
                            this.CalcX = this.X_min + (W - this.W) / 2;
                            break;
                        }

                        case c_oAscXAlign.Inside:
                        case c_oAscXAlign.Outside:
                        case c_oAscXAlign.Left:
                        {
                            this.CalcX = this.X_min;
                            break;
                        }

                        case c_oAscXAlign.Right:
                        {
                            this.CalcX = this.X_max - this.W;
                            break;
                        }
                    }
                }
                else
                    this.CalcX = this.X_min + Value;

                break;
            }

            case c_oAscHAnchor.PageInternal:
            {
                if ( true === bAlign )
                {
                    switch ( Value )
                    {
                        case c_oAscXAlign.Center:
                        {
                            this.CalcX = (this.Page_W - this.W) / 2;
                            break;
                        }

                        case c_oAscXAlign.Inside:
                        case c_oAscXAlign.Outside:
                        case c_oAscXAlign.Left:
                        {
                            this.CalcX = 0;
                            break;
                        }

                        case c_oAscXAlign.Right:
                        {
                            this.CalcX = this.Page_W - this.W;
                            break;
                        }
                    }
                }
                else
                    this.CalcX = Value;

                break;
            }
        }

        return this.CalcX;
    },

    Calculate_Y : function(RelativeFrom, bAlign, Value)
    {
        // Вычисляем координату по Y
        switch(RelativeFrom)
        {
            case c_oAscVAnchor.Margin:
            {
                if ( true === bAlign )
                {
                    switch(Value)
                    {
                        case c_oAscYAlign.Bottom:
                        {
                            this.CalcY = this.Bottom_Margin - this.H;
                            break;
                        }
                        case c_oAscYAlign.Center:
                        {
                            this.CalcY = (this.Bottom_Margin + this.Top_Margin - this.H) / 2;
                            break;
                        }
                        case c_oAscYAlign.Inline:
                        case c_oAscYAlign.Inside:
                        case c_oAscYAlign.Outside:
                        case c_oAscYAlign.Top:
                        {
                            this.CalcY = this.Top_Margin;
                            break;
                        }
                    }
                }
                else
                    this.CalcY = this.Top_Margin + Value;

                break;
            }

            case c_oAscVAnchor.Page:
            {
                if ( true === bAlign )
                {
                    switch(Value)
                    {
                        case c_oAscYAlign.Bottom:
                        {
                            this.CalcY = this.Page_Bottom - this.H;
                            break;
                        }
                        case c_oAscYAlign.Center:
                        {
                            this.CalcY = (this.Page_Bottom - this.H) / 2;
                            break;
                        }
                        case c_oAscYAlign.Inline:
                        case c_oAscYAlign.Inside:
                        case c_oAscYAlign.Outside:
                        case c_oAscYAlign.Top:
                        {
                            this.CalcY = this.Page_Top;
                            break;
                        }
                    }
                }
                else
                    this.CalcY = this.Page_Top + Value;

                break;
            }

            case c_oAscVAnchor.Text:
            {
                if ( true === bAlign )
                {
                    // Word не дает делать прилегания в данном случае
                    this.CalcY = this.Y;
                }
                else
                    this.CalcY = this.Y + Value;

                break;
            }
        }

        return this.CalcY;
    },

    Correct_Values : function(X_min, Y_min, X_max, Y_max, AllowOverlap, OtherFlowTables, CurTable)
    {
        var W = this.W;
        var H = this.H;

        var CurX = this.CalcX;
        var CurY = this.CalcY;

        var bBreak = false;
        while ( true != bBreak )
        {
            bBreak = true;
            for ( var Index = 0; Index < OtherFlowTables.length; Index++ )
            {
                var FlowTable = OtherFlowTables[Index];

                if ( FlowTable.Table != CurTable && ( false === AllowOverlap || false === FlowTable.Table.Get_AllowOverlap() ) && ( CurX <= FlowTable.X + FlowTable.W && CurX + W >= FlowTable.X && CurY <= FlowTable.Y + FlowTable.H && CurY + H >= FlowTable.Y ) )
                {
                    /*
                     // Если убирается справа, размещаем справа от картинки
                     if ( FlowTable.X + FlowTable.W < X_max - W - 0.001 )
                     CurX = FlowTable.X + FlowTable.W + 0.001;
                     else
                     {
                     CurX = this.CalcX;
                     CurY = FlowTable.Y + FlowTable.H + 0.001;
                     }
                     */

                    // TODO: Пока у нас смещение по X плохо работает(смотри CTable.Shift), поэтому смещаем таблицу сразу по Y
                    CurY = FlowTable.Y + FlowTable.H + 0.001;

                    bBreak = false;
                }
            }
        }

        // TODO: Пока у нас смещение по X плохо работает(смотри CTable.Shift), поэтому смещаем таблицу сразу по Y
        /*
         // Скорректируем рассчитанную позицию, так чтобы объект не выходил за заданные пределы
         if ( CurX + W > X_max )
         CurX = X_max - W;

         if ( CurX < X_min )
         CurX = X_min;
         */

        // Скорректируем рассчитанную позицию, так чтобы объект не выходил за заданные пределы
        if ( CurY + H > Y_max )
            CurY = Y_max - H;

        if ( CurY < this.Y_min )
            CurY = this.Y_min;

        this.CalcY = CurY;
        this.CalcX = CurX;
    },

    // По значению CalcX получем Value
    Calculate_X_Value : function(RelativeFrom)
    {
        var Value = 0;

        switch(RelativeFrom)
        {
            case c_oAscHAnchor.Text:
            case c_oAscHAnchor.Margin:
            {
                Value = this.CalcX - this.Left_Margin;

                break;
            }

            case c_oAscHAnchor.Page:
            {
                Value = this.CalcX - this.X_min;

                break;
            }

            case c_oAscHAnchor.PageInternal:
            {
                Value = this.CalcX;
                break;
            }
        }

        return Value;
    },

    // По значению CalcY и заданному RelativeFrom получем Value
    Calculate_Y_Value : function(RelativeFrom)
    {
        var Value = 0;

        switch(RelativeFrom)
        {
            case c_oAscVAnchor.Margin:
            {
                Value = this.CalcY - this.Top_Margin;

                break;
            }

            case c_oAscVAnchor.Page:
            {
                Value = this.CalcY - this.Page_Top;

                break;
            }

            case c_oAscVAnchor.Text:
            {
                Value = this.CalcY - this.Y;

                break;
            }
        }

        return Value;
    }
};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CTable = CTable;
window['AscCommonWord'].type_Table = type_Table;
