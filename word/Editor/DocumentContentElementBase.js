/*
 * (c) Copyright Ascensio System SIA 2010-2018
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
/**
 * User: Ilja.Kirillov
 * Date: 05.04.2017
 * Time: 11:42
 */

var type_Unknown = 0x00;

/**
 * Базовый класс для элементов содержимого документа (Paragraph, CTable, CBlockLevelSdt)
 * @param oParent - ссылка на базовый класс
 * @constructor
 */
function CDocumentContentElementBase(oParent)
{
	this.Id = AscCommon.g_oIdCounter.Get_NewId();

	this.Parent = oParent;
	this.Prev   = null;
	this.Next   = null;
	this.Index  = -1; // перед тем как пользоваться этим параметром нужно у родительского класса вызывать this.Parent.Update_ContentIndexing();

	this.X            = 0;
	this.Y            = 0;
	this.XLimit       = 0;
	this.YLimit       = 0;
	this.PageNum      = 0;
	this.ColumnNum    = 0;
	this.ColumnsCount = 0;
}

CDocumentContentElementBase.prototype.Get_Type = function()
{
	return this.GetType();
};
CDocumentContentElementBase.prototype.GetType = function()
{
	return type_Unknown;
};
CDocumentContentElementBase.prototype.Is_Inline = function()
{
	return true;
};
CDocumentContentElementBase.prototype.Set_DocumentIndex = function(nIndex)
{
	this.Index = nIndex;
};
CDocumentContentElementBase.prototype.Set_DocumentNext = function(oElement)
{
	this.Next = oElement;
};
CDocumentContentElementBase.prototype.Set_DocumentPrev = function(oElement)
{
	this.Prev = oElement;
};
CDocumentContentElementBase.prototype.Get_DocumentNext = function()
{
	return this.Next;
};
CDocumentContentElementBase.prototype.Get_DocumentPrev = function()
{
	return this.Prev;
};
CDocumentContentElementBase.prototype.GetParent = function()
{
	return this.Parent;
};
CDocumentContentElementBase.prototype.SetParent = function(oParent)
{
	this.Parent = oParent;
};
CDocumentContentElementBase.prototype.Set_Parent = function(oParent)
{
	this.Parent = oParent;
};
CDocumentContentElementBase.prototype.Get_Parent = function()
{
	return this.Parent;
};
CDocumentContentElementBase.prototype.GetId = function()
{
	return this.Id;
};
CDocumentContentElementBase.prototype.Get_Id = function()
{
	return this.GetId();
};
CDocumentContentElementBase.prototype.Reset = function(X, Y, XLimit, YLimit, PageAbs, ColumnAbs, ColumnsCount)
{
	this.X            = X;
	this.Y            = Y;
	this.XLimit       = XLimit;
	this.YLimit       = YLimit;
	this.PageNum      = PageAbs;
	this.ColumnNum    = ColumnAbs ? ColumnAbs : 0;
	this.ColumnsCount = ColumnsCount ? ColumnsCount : 1;
};
CDocumentContentElementBase.prototype.Recalculate_Page = function(CurPage)
{
	return recalcresult_NextElement;
};
CDocumentContentElementBase.prototype.Get_PageBounds = function(CurPage)
{
	return new CDocumentBounds(this.X, this.Y, this.XLimit, this.YLimit);
};
CDocumentContentElementBase.prototype.GetContentBounds = function(CurPage)
{
	return new CDocumentBounds(this.X, this.Y, this.XLimit, this.YLimit);
};
CDocumentContentElementBase.prototype.IsEmptyPage = function(nCurPage)
{
	return false;
};
CDocumentContentElementBase.prototype.Reset_RecalculateCache = function()
{
};
CDocumentContentElementBase.prototype.Write_ToBinary2 = function(Writer)
{
	Writer.WriteLong(AscDFH.historyitem_type_Unknown);
};
CDocumentContentElementBase.prototype.Read_FromBinary2 = function(Reader)
{
};
CDocumentContentElementBase.prototype.Get_PagesCount = function()
{
	return 0;
};
CDocumentContentElementBase.prototype.Document_CreateFontMap = function(FontMap)
{
};
CDocumentContentElementBase.prototype.Document_CreateFontCharMap = function(FontCharMap)
{
};
CDocumentContentElementBase.prototype.Document_Get_AllFontNames = function(AllFonts)
{
};
CDocumentContentElementBase.prototype.IsInText = function(X, Y, CurPage)
{
	return null;
};
CDocumentContentElementBase.prototype.IsInDrawing = function(X, Y, CurPage)
{
	return false;
};
CDocumentContentElementBase.prototype.IsTableBorder = function(X, Y, CurPage)
{
	return null;
};
CDocumentContentElementBase.prototype.UpdateCursorType = function(X, Y, CurPage)
{
};
CDocumentContentElementBase.prototype.Selection_SetStart = function(X, Y, CurPage, MouseEvent, isTableBorder)
{
};
CDocumentContentElementBase.prototype.Selection_SetEnd = function(X, Y, CurPage, MouseEvent, isTableBorder)
{
};
CDocumentContentElementBase.prototype.IsSelectionEmpty = function(isCheckHidden)
{
	return true;
};
CDocumentContentElementBase.prototype.GetSelectedElementsInfo = function(oInfo)
{
};
CDocumentContentElementBase.prototype.Document_UpdateRulersState = function(CurPage)
{
	this.Content.Document_UpdateRulersState(CurPage);
};
CDocumentContentElementBase.prototype.IsSelectionUse = function()
{
	return false;
};
CDocumentContentElementBase.prototype.IsSelectionToEnd = function()
{
	return false;
};
CDocumentContentElementBase.prototype.RemoveSelection = function()
{
};
CDocumentContentElementBase.prototype.SetSelectionUse = function(isUse)
{
};
CDocumentContentElementBase.prototype.SetSelectionToBeginEnd = function(isSelectionStart, isElementStart)
{
};
CDocumentContentElementBase.prototype.SelectAll = function(nDirection)
{
};
CDocumentContentElementBase.prototype.GetCalculatedTextPr = function()
{
	var oTextPr = new CTextPr();
	oTextPr.Init_Default();
	return oTextPr;
};
CDocumentContentElementBase.prototype.GetCalculatedParaPr = function()
{
	var oParaPr = new CParaPr();
	oParaPr.Init_Default();
	return oParaPr;
};
CDocumentContentElementBase.prototype.GetDirectParaPr = function()
{
	return new CParaPr();
};
CDocumentContentElementBase.prototype.GetDirectTextPr = function()
{
	return new CTextPr();
};
CDocumentContentElementBase.prototype.DrawSelectionOnPage = function(CurPage)
{
};
CDocumentContentElementBase.prototype.StopSelection = function()
{
};
CDocumentContentElementBase.prototype.GetSelectionBounds = function()
{
	return {
		Start     : null,
		End       : null,
		Direction : 0
	};
};
CDocumentContentElementBase.prototype.RecalculateCurPos = function(bUpdateX, bUpdateY)
{
	return null;
};
CDocumentContentElementBase.prototype.Can_CopyCut = function()
{
	return false;
};
CDocumentContentElementBase.prototype.CanCopyCut = function()
{
	return this.Can_CopyCut();
};
CDocumentContentElementBase.prototype.CheckPosInSelection = function(X, Y, CurPage, NearPos)
{
	return false;
};
CDocumentContentElementBase.prototype.Get_NearestPos = function(CurPage, X, Y, bAnchor, Drawing)
{
	return {
		X          : 0,
		Y          : 0,
		Height     : 0,
		PageNum    : 0,
		Internal   : {Line : 0, Page : 0, Range : 0},
		Transform  : null,
		Paragraph  : null,
		ContentPos : null,
		SearchPos  : null
	};
};
CDocumentContentElementBase.prototype.GetNearestPos = function(CurPage, X, Y, bAnchor, Drawing)
{
	return this.Get_NearestPos(CurPage, X, Y, bAnchor, Drawing);
};
CDocumentContentElementBase.prototype.CanUpdateTarget = function(CurPage)
{
	return false;
};
CDocumentContentElementBase.prototype.MoveCursorLeftWithSelectionFromEnd = function(Word)
{
};
CDocumentContentElementBase.prototype.MoveCursorLeft = function(AddToSelect, Word)
{
	return false;
};
CDocumentContentElementBase.prototype.MoveCursorRight = function(AddToSelect, Word)
{
	return false;
};
CDocumentContentElementBase.prototype.MoveCursorRightWithSelectionFromStart = function(Word)
{

};
CDocumentContentElementBase.prototype.MoveCursorToStartPos = function(AddToSelect)
{
};
CDocumentContentElementBase.prototype.MoveCursorToEndPos = function(AddToSelect, StartSelectFromEnd)
{
};
CDocumentContentElementBase.prototype.MoveCursorUp = function(AddToSelect)
{
	return false;
};
CDocumentContentElementBase.prototype.MoveCursorUpToLastRow = function(X, Y, AddToSelect)
{
	return false;
};
CDocumentContentElementBase.prototype.MoveCursorDown = function(AddToSelect)
{
	return false;
};
CDocumentContentElementBase.prototype.MoveCursorDownToFirstRow = function(X, Y, AddToSelect)
{
	return false;
};
CDocumentContentElementBase.prototype.MoveCursorToEndOfLine = function(AddToSelect)
{
	return false;
};
CDocumentContentElementBase.prototype.MoveCursorToStartOfLine = function(AddToSelect)
{
	return false;
};
CDocumentContentElementBase.prototype.MoveCursorToXY = function(X, Y, bLine, bDontChangeRealPos, CurPage)
{
	return false;
};
CDocumentContentElementBase.prototype.MoveCursorToCell = function(bNext)
{
	return false;
};
CDocumentContentElementBase.prototype.IsCursorAtBegin = function()
{
	return true;
};
CDocumentContentElementBase.prototype.IsCursorAtEnd = function()
{
	return true;
};
CDocumentContentElementBase.prototype.GetSelectionState = function()
{
	return [];
};
CDocumentContentElementBase.prototype.SetSelectionState = function(State, StateIndex)
{

};
CDocumentContentElementBase.prototype.AddNewParagraph = function()
{

};
CDocumentContentElementBase.prototype.Get_SelectionState2 = function()
{
	return null;
};
CDocumentContentElementBase.prototype.Set_SelectionState2 = function(State)
{
};
CDocumentContentElementBase.prototype.IsStartFromNewPage = function()
{
	return false;
};
CDocumentContentElementBase.prototype.GetAllParagraphs = function(Props, ParaArray)
{
};
CDocumentContentElementBase.prototype.SetContentSelection = function(StartDocPos, EndDocPos, Depth, StartFlag, EndFlag)
{
};
CDocumentContentElementBase.prototype.GetContentPosition = function(bSelection, bStart, PosArray)
{
};
CDocumentContentElementBase.prototype.SetContentPosition = function(DocPos, Depth, Flag)
{
};
CDocumentContentElementBase.prototype.GetNumberingInfo = function(oNumberingEngine)
{
};
CDocumentContentElementBase.prototype.AddInlineImage = function(W, H, Img, Chart, bFlow)
{
};
CDocumentContentElementBase.prototype.AddImages = function(aImages)
{
};
CDocumentContentElementBase.prototype.AddOleObject = function(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId)
{
};
CDocumentContentElementBase.prototype.AddSignatureLine = function(oSignatureDrawing)
{
};
CDocumentContentElementBase.prototype.AddTextArt = function(nStyle)
{
};
CDocumentContentElementBase.prototype.AddInlineTable = function(nCols, nRows)
{
};
CDocumentContentElementBase.prototype.Remove = function(nCount, bOnlyText, bRemoveOnlySelection, bOnAddText)
{
};
CDocumentContentElementBase.prototype.Set_ReviewType = function(ReviewType)
{

};
CDocumentContentElementBase.prototype.Get_ReviewType = function()
{
	return reviewtype_Common;
};
CDocumentContentElementBase.prototype.Is_Empty = function()
{
	return true;
};
CDocumentContentElementBase.prototype.Add = function(oParaItem)
{
	// TODO: Данную функцию нужно заменить на AddToParagraph
};
CDocumentContentElementBase.prototype.PreDelete = function()
{
};
CDocumentContentElementBase.prototype.ClearParagraphFormatting = function()
{
};
CDocumentContentElementBase.prototype.GetCursorPosXY = function()
{
	return {X : 0, Y : 0};
};
CDocumentContentElementBase.prototype.StartSelectionFromCurPos = function()
{
};
CDocumentContentElementBase.prototype.SetParagraphAlign = function(Align)
{
};
CDocumentContentElementBase.prototype.SetParagraphSpacing = function(Spacing)
{
};
CDocumentContentElementBase.prototype.SetParagraphTabs = function(Tabs)
{
};
CDocumentContentElementBase.prototype.SetParagraphIndent = function(Ind)
{
};
CDocumentContentElementBase.prototype.SetParagraphNumbering = function(NumInfo)
{
};
CDocumentContentElementBase.prototype.SetParagraphShd = function(Shd)
{
};
CDocumentContentElementBase.prototype.SetParagraphStyle = function(Name)
{
};
CDocumentContentElementBase.prototype.SetParagraphContextualSpacing = function(Value)
{
};
CDocumentContentElementBase.prototype.SetParagraphPageBreakBefore = function(Value)
{
};
CDocumentContentElementBase.prototype.SetParagraphKeepLines = function(Value)
{
};
CDocumentContentElementBase.prototype.SetParagraphKeepNext = function(Value)
{
};
CDocumentContentElementBase.prototype.SetParagraphWidowControl = function(Value)
{
};
CDocumentContentElementBase.prototype.SetParagraphBorders = function(Borders)
{
};
CDocumentContentElementBase.prototype.SetParagraphFramePr = function(FramePr, bDelete)
{
};
CDocumentContentElementBase.prototype.IncreaseDecreaseFontSize = function(bIncrease)
{
};
CDocumentContentElementBase.prototype.IncreaseDecreaseIndent = function(bIncrease)
{
};
CDocumentContentElementBase.prototype.SetImageProps = function(oProps)
{
};
CDocumentContentElementBase.prototype.SetTableProps = function(oProps)
{
};
CDocumentContentElementBase.prototype.GetSelectedContent = function(oSelectedContent)
{
};
CDocumentContentElementBase.prototype.PasteFormatting = function(TextPr, ParaPr, ApplyPara)
{
};
CDocumentContentElementBase.prototype.GetCurPosXY = function()
{
	return {X : 0, Y : 0};
};
CDocumentContentElementBase.prototype.GetSelectedText = function(bClearText, oPr)
{
	return null;
};
CDocumentContentElementBase.prototype.GetCurrentParagraph = function(bIgnoreSelection, arrSelectedParagraphs)
{
	return null;
};
CDocumentContentElementBase.prototype.AddTableRow = function(bBefore)
{
	return false;
};
CDocumentContentElementBase.prototype.AddTableColumn = function(bBefore)
{
	return false;
};
CDocumentContentElementBase.prototype.RemoveTableRow = function(nRowIndex)
{
	return false;
};
CDocumentContentElementBase.prototype.RemoveTableColumn = function()
{
	return false;
};
CDocumentContentElementBase.prototype.MergeTableCells = function()
{
	return false;
};
CDocumentContentElementBase.prototype.SplitTableCells = function(nColsCount, nRowsCount)
{
	return false;
};
CDocumentContentElementBase.prototype.RemoveTable = function()
{
	return false;
};
CDocumentContentElementBase.prototype.SelectTable = function(Type)
{
};
CDocumentContentElementBase.prototype.DistributeTableCells = function(isHorizontally)
{
	return false;
};
CDocumentContentElementBase.prototype.CanMergeTableCells = function()
{
	return false;
};
CDocumentContentElementBase.prototype.CanSplitTableCells = function()
{
	return false;
};
CDocumentContentElementBase.prototype.Document_UpdateInterfaceState = function()
{
};
CDocumentContentElementBase.prototype.Document_UpdateRulersState = function()
{
};
CDocumentContentElementBase.prototype.GetTableProps = function()
{
	return null;
};
CDocumentContentElementBase.prototype.AddHyperlink = function(Props)
{
};
CDocumentContentElementBase.prototype.ModifyHyperlink = function(Props)
{
};
CDocumentContentElementBase.prototype.RemoveHyperlink = function()
{
};
CDocumentContentElementBase.prototype.CanAddHyperlink = function(bCheckInHyperlink)
{
	return false;
};
CDocumentContentElementBase.prototype.IsCursorInHyperlink = function(bCheckEnd)
{
	return null;
};
CDocumentContentElementBase.prototype.AddComment = function(Comment, bStart, bEnd)
{
};
CDocumentContentElementBase.prototype.CanAddComment = function()
{
	return false;
};
CDocumentContentElementBase.prototype.GetSelectionAnchorPos = function()
{
	return null;
};
CDocumentContentElementBase.prototype.AddContentControl = function(nContentControlType)
{
	return null;
};
CDocumentContentElementBase.prototype.RecalculateMinMaxContentWidth = function(isRotated)
{
	return {Min : 0, Max : 0};
};
CDocumentContentElementBase.prototype.Shift = function(CurPage, dX, dY)
{
};
CDocumentContentElementBase.prototype.UpdateEndInfo = function()
{
};
CDocumentContentElementBase.prototype.PrepareRecalculateObject = function()
{
};
CDocumentContentElementBase.prototype.SaveRecalculateObject = function()
{
	return null;
};
CDocumentContentElementBase.prototype.LoadRecalculateObject = function(RecalcObj)
{
};
CDocumentContentElementBase.prototype.Set_ApplyToAll = function(bValue)
{
};
CDocumentContentElementBase.prototype.RecalculateAllTables = function()
{
};
CDocumentContentElementBase.prototype.GetAllFloatElements = function(FloatObjects)
{
	if (!FloatObjects)
		return [];

	return FloatObjects;
};
CDocumentContentElementBase.prototype.Get_FirstParagraph = function()
{
	return null;
};
CDocumentContentElementBase.prototype.StartFromNewPage = function()
{
};
CDocumentContentElementBase.prototype.CollectDocumentStatistics = function(Stats)
{
};
CDocumentContentElementBase.prototype.CompareDrawingsLogicPositions = function(CompareObject)
{
	return 0;
};
CDocumentContentElementBase.prototype.GetStyleFromFormatting = function()
{
	return null;
};
CDocumentContentElementBase.prototype.GetAllContentControls = function(arrContentControls)
{
};
CDocumentContentElementBase.prototype.IsSelectedAll = function()
{
	return false;
};
CDocumentContentElementBase.prototype.CheckContentControlDeletingLock = function()
{
};
CDocumentContentElementBase.prototype.GetLastRangeVisibleBounds = function()
{
	return {
		X        : 0,
		Y        : 0,
		W        : 0,
		H        : 0,
		BaseLine : 0,
		XLimit   : 0
	};
};
CDocumentContentElementBase.prototype.FindNextFillingForm = function(isNext, isCurrent, isStart)
{
	return null;
};
CDocumentContentElementBase.prototype.GetRevisionsChangeParagraph = function(SearchEngine)
{
	return null;
};
CDocumentContentElementBase.prototype.AcceptRevisionChanges = function(Type, bAll)
{
};
CDocumentContentElementBase.prototype.RejectRevisionChanges = function(Type, bAll)
{
};
CDocumentContentElementBase.prototype.GetDocumentPositionFromObject = function(PosArray)
{
	if (!PosArray)
		PosArray = [];

	if (this.Parent)
	{
		PosArray.splice(0, 0, {Class : this.Parent, Position : this.Get_Index()});
		this.Parent.GetDocumentPositionFromObject(PosArray);
	}

	return PosArray;
};
CDocumentContentElementBase.prototype.Get_Index = function()
{
	if (!this.Parent)
		return -1;

	this.Parent.Update_ContentIndexing();

	return this.Index;
};
CDocumentContentElementBase.prototype.GetOutlineParagraphs = function(arrOutline, oPr)
{
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с номерами страниц
//----------------------------------------------------------------------------------------------------------------------
CDocumentContentElementBase.prototype.Get_StartPage_Absolute = function()
{
	return this.Get_AbsolutePage(0);
};
CDocumentContentElementBase.prototype.Get_StartPage_Relative = function()
{
	return this.PageNum;
};
CDocumentContentElementBase.prototype.Get_StartColumn = function()
{
	return this.ColumnNum;
};
CDocumentContentElementBase.prototype.Get_ColumnsCount = function()
{
	return this.ColumnsCount;
};
CDocumentContentElementBase.prototype.private_GetRelativePageIndex = function(CurPage)
{
	if (!this.ColumnsCount || 0 === this.ColumnsCount)
		return this.PageNum + CurPage;

	return this.PageNum + ((this.ColumnNum + CurPage) / this.ColumnsCount | 0);
};
CDocumentContentElementBase.prototype.private_GetAbsolutePageIndex = function(CurPage)
{
	return this.Parent.Get_AbsolutePage(this.private_GetRelativePageIndex(CurPage));
};
CDocumentContentElementBase.prototype.Get_AbsolutePage = function(CurPage)
{
	return this.private_GetAbsolutePageIndex(CurPage);
};
CDocumentContentElementBase.prototype.Get_AbsoluteColumn = function(CurPage)
{
	if (this.Parent instanceof CDocument)
		return this.private_GetColumnIndex(CurPage);

	return this.Parent.Get_AbsoluteColumn(this.private_GetRelativePageIndex(CurPage));
};
CDocumentContentElementBase.prototype.private_GetColumnIndex = function(CurPage)
{
	return (this.ColumnNum + CurPage) - (((this.ColumnNum + CurPage) / this.ColumnsCount | 0) * this.ColumnsCount);
};
CDocumentContentElementBase.prototype.Get_CurrentPage_Absolute = function()
{
	return this.private_GetAbsolutePageIndex(0);
};
CDocumentContentElementBase.prototype.Get_CurrentPage_Relative = function()
{
	return this.private_GetRelativePageIndex(0);
};
CDocumentContentElementBase.prototype.GetAbsolutePage = function(CurPage)
{
	return this.private_GetAbsolutePageIndex(CurPage);
};
//----------------------------------------------------------------------------------------------------------------------
CDocumentContentElementBase.prototype.GetPagesCount = function()
{
	return this.Get_PagesCount();
};
CDocumentContentElementBase.prototype.GetIndex = function()
{
	return this.Index;
};
CDocumentContentElementBase.prototype.GetPageBounds = function(CurPage)
{
	return this.Get_PageBounds(CurPage);
};
CDocumentContentElementBase.prototype.GetNearestPos = function(CurPage, X, Y, bAnchor, Drawing)
{
	return this.Get_NearestPos(CurPage, X, Y, bAnchor, Drawing);
};
CDocumentContentElementBase.prototype.CreateFontMap = function(oFontMap)
{
	return this.Document_CreateFontMap(oFontMap);
};
CDocumentContentElementBase.prototype.CreateFontCharMap = function(oFontCharMap)
{
	return this.Document_CreateFontCharMap(oFontCharMap);
};
CDocumentContentElementBase.prototype.GetAllFontNames = function(FontNames)
{
	return this.Document_Get_AllFontNames(FontNames);
};
CDocumentContentElementBase.prototype.GetSelectionState2 = function()
{
	return this.Get_SelectionState2();
};
CDocumentContentElementBase.prototype.SetSelectionState2 = function(State)
{
	return this.Set_SelectionState2(State);
};
CDocumentContentElementBase.prototype.SetReviewType = function(ReviewType)
{
	this.Set_ReviewType(ReviewType);
};
CDocumentContentElementBase.prototype.GetReviewType = function()
{
	return this.Get_ReviewType();
};
CDocumentContentElementBase.prototype.IsEmpty = function(oProps)
{
	return this.Is_Empty(oProps);
};
CDocumentContentElementBase.prototype.AddToParagraph = function(oItem)
{
	return this.Add(oItem);
};
CDocumentContentElementBase.prototype.GetAllDrawingObjects = function(AllDrawingObjects)
{
};
CDocumentContentElementBase.prototype.GetAllComments = function(AllComments)
{
};
CDocumentContentElementBase.prototype.GetAllMaths = function(AllMaths)
{
};
CDocumentContentElementBase.prototype.UpdateBookmarks = function(oManager)
{
};
/**
 * Получаем текущий TableOfContents, это может быть просто поле или поле вместе с оберткой Sdt
 * @param isUnique ищем с параметром Unique = true
 * @param isCheckFields Проверять ли TableOfContents, заданные через сложные поля
 * @returns {CComplexField | CBlockLevelSdt | null}
 */
CDocumentContentElementBase.prototype.GetTableOfContents = function(isUnique, isCheckFields)
{
	return null;
};
/**
 * Проверяем у родительского класса выделен ли только один элемент
 * @returns {boolean}
 */
CDocumentContentElementBase.prototype.IsSelectedSingleElement = function()
{
	if (this.Parent)
		return this.Parent.IsSelectedSingleElement();

	return false;
};
/**
 * Получаем последний параграф в данном контенте, если последний элемент не параграф, то запрашиваем у него
 * @returns {?Paragraph}
 */
CDocumentContentElementBase.prototype.GetLastParagraph = function()
{
	return null;
};
/**
 * Получаем первый параграф в данном контенте
 * @returns {?Paragraph}
 */
CDocumentContentElementBase.prototype.GetFirstParagraph = function()
{
	return this.Get_FirstParagraph();
};
/**
 * Получаем параграф, следующий за данным элементом
 * @returns {?Paragraph}
 */
CDocumentContentElementBase.prototype.GetNextParagraph = function()
{
	var oNextElement = this.Get_DocumentNext();

	if (oNextElement)
	{
		if (type_Paragraph === oNextElement.GetType())
			return oNextElement;
		else
			return oNextElement.GetFirstParagraph();
	}

	if (this.Parent && this.Parent.GetNextParagraph)
		return this.Parent.GetNextParagraph();

	return null;
};
/**
 * Получаем параграф, идущий перед данным элементом
 * @returns {?Paragraph}
 */
CDocumentContentElementBase.prototype.GetPrevParagraph = function()
{
	var oPrevElement = this.Get_DocumentPrev();

	if (oPrevElement)
	{
		if (type_Paragraph === oPrevElement.GetType())
			return oPrevElement;
		else
			return oPrevElement.GetLastParagraph();
	}

	if (this.Parent && this.Parent.GetPrevParagraph)
		return this.Parent.GetPrevParagraph();

	return null;
};
//--------------------------------------------------------export--------------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CDocumentContentElementBase = CDocumentContentElementBase;
window['AscCommonWord'].type_Unknown = type_Unknown;