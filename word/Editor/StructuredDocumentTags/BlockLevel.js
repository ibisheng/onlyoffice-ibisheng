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
/**
 * User: Ilja.Kirillov
 * Date: 04.04.2017
 * Time: 17:00
 */

var type_BlockLevelSdt = 0x0003;

/**
 * @param oParent - родительский класс
 * @param oLogicDocument - главный класс документа
 * @constructor
 * @extends {CDocumentContentElementBase}
 */
function CBlockLevelSdt(oLogicDocument, oParent)
{
	CDocumentContentElementBase.call(this, oParent);

	this.LogicDocument = oLogicDocument;
	this.Content       = new CDocumentContent(this, oLogicDocument ? oLogicDocument.Get_DrawingDocument() : null, 0, 0, 0, 0, true, false, false);

	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	g_oTableId.Add(this, this.Id);
}

CBlockLevelSdt.prototype = Object.create(CDocumentContentElementBase.prototype);
CBlockLevelSdt.prototype.constructor = CBlockLevelSdt;

CBlockLevelSdt.prototype.GetType = function()
{
	return type_BlockLevelSdt;
};
CBlockLevelSdt.prototype.Is_Inline = function()
{
	return true;
};
CBlockLevelSdt.prototype.Reset = function(X, Y, XLimit, YLimit, PageAbs, ColumnAbs, ColumnsCount)
{
	this.Content.Reset(X, Y, XLimit, YLimit);
	this.Content.Set_StartPage(0);

	this.X            = X;
	this.Y            = Y;
	this.XLimit       = XLimit;
	this.YLimit       = YLimit;
	this.PageNum      = PageAbs;
	this.ColumnNum    = ColumnAbs ? ColumnAbs : 0;
	this.ColumnsCount = ColumnsCount ? ColumnsCount : 1;
};
CBlockLevelSdt.prototype.Recalculate_Page = function(CurPage)
{
	var RecalcResult = this.Content.Recalculate_Page(CurPage, true);

	if (recalcresult2_End === RecalcResult)
		return recalcresult_NextElement;
	else if (recalcresult2_NextPage === RecalcResult)
		return recalcresult_NextPage;
	else if (recalcresult2_CurPage === RecalcResult)
		return recalcresult_CurPage;
};
CBlockLevelSdt.prototype.Get_PageBounds = function(CurPage)
{
	return this.Content.Get_PageBounds(CurPage);
};
CBlockLevelSdt.prototype.Is_EmptyPage = function(CurPage)
{
	// TODO: Реализовать
	return false;
};
CBlockLevelSdt.prototype.Get_PagesCount = function()
{
	return this.Content.Get_PagesCount();
};
CBlockLevelSdt.prototype.Reset_RecalculateCache = function()
{
	this.Content.Reset_RecalculateCache();
};
CBlockLevelSdt.prototype.Write_ToBinary2 = function(Writer)
{
	Writer.WriteLong(AscDFH.historyitem_type_BlockLevelSdt);
	// String : Content id
	Writer.WriteString2(this.Content.GetId());
};
CBlockLevelSdt.prototype.Read_FromBinary2 = function(Reader)
{
	this.LogicDocument = editor.WordControl.m_oLogicDocument;

	// String : Content id
	this.Content = this.LogicDocument.Get_TableId().Get_ById(Reader.GetString2());
};
CBlockLevelSdt.prototype.Draw = function(CurPage, oGraphics)
{
	this.Content.Draw(CurPage, oGraphics);

	var oPageBounds = this.GetPageBounds(CurPage);

	oGraphics.p_color(0, 0, 255, 255);
	oGraphics.drawVerLine(0, oPageBounds.Left, oPageBounds.Top, oPageBounds.Bottom, 0);
	oGraphics.drawVerLine(0, oPageBounds.Right, oPageBounds.Top, oPageBounds.Bottom, 0);
	oGraphics.drawHorLine(0, oPageBounds.Top, oPageBounds.Left, oPageBounds.Right, 0);
	oGraphics.drawHorLine(0, oPageBounds.Bottom, oPageBounds.Left, oPageBounds.Right, 0);
};
CBlockLevelSdt.prototype.Get_CurrentPage_Absolute = function()
{
	return this.Content.Get_CurrentPage_Absolute();
};
CBlockLevelSdt.prototype.Get_CurrentPage_Relative = function()
{
	return this.Content.Get_CurrentPage_Relative();
};
CBlockLevelSdt.prototype.IsInText = function(X, Y, CurPage)
{
	return this.Content.IsInText(X, Y, CurPage);
};
CBlockLevelSdt.prototype.IsInDrawing = function(X, Y, CurPage)
{
	return this.Content.IsInDrawing(X, Y, CurPage);
};
CBlockLevelSdt.prototype.IsTableBorder = function(X, Y, CurPage)
{
	return this.Content.IsTableBorder(X, Y, CurPage);
};
CBlockLevelSdt.prototype.UpdateCursorType = function(X, Y, CurPage)
{
	return this.Content.UpdateCursorType(X, Y, CurPage);
};
CBlockLevelSdt.prototype.Selection_SetStart = function(X, Y, CurPage, MouseEvent, isTableBorder)
{
	this.Content.Selection_SetStart(X, Y, CurPage, MouseEvent, isTableBorder);
};
CBlockLevelSdt.prototype.Selection_SetEnd = function(X, Y, CurPage, MouseEvent, isTableBorder)
{
	this.Content.Selection_SetEnd(X, Y, CurPage, MouseEvent, isTableBorder);
};
CBlockLevelSdt.prototype.IsSelectionEmpty = function(isCheckHidden)
{
	return this.Content.IsSelectionEmpty(isCheckHidden);
};
CBlockLevelSdt.prototype.GetSelectedElementsInfo = function(oInfo)
{
	this.Content.GetSelectedElementsInfo(oInfo);
};
CBlockLevelSdt.prototype.Document_UpdateRulersState = function(CurPage)
{
	this.Content.Document_UpdateRulersState(CurPage);
};
CBlockLevelSdt.prototype.IsSelectionUse = function()
{
	return this.Content.IsSelectionUse();
};
CBlockLevelSdt.prototype.IsSelectionToEnd = function()
{
	return this.Content.IsSelectionToEnd();
};
CBlockLevelSdt.prototype.RemoveSelection = function()
{
	this.Content.RemoveSelection();
};
CBlockLevelSdt.prototype.SetSelectionUse = function(isUse)
{
	this.Content.SetSelectionUse(isUse);
};
CBlockLevelSdt.prototype.SetSelectionToBeginEnd = function(isSelectionStart, isElementStart)
{
	this.Content.SetSelectionToBeginEnd(isSelectionStart, isElementStart);
};
CBlockLevelSdt.prototype.SelectAll = function(nDirection)
{
	this.Content.SelectAll(nDirection);
};
CBlockLevelSdt.prototype.GetCalculatedTextPr = function()
{
	return this.Content.GetCalculatedTextPr();
};
CBlockLevelSdt.prototype.GetCalculatedParaPr = function()
{
	return this.Content.GetCalculatedParaPr();
};
CBlockLevelSdt.prototype.GetDirectParaPr = function()
{
	return this.Content.GetDirectParaPr();
};
CBlockLevelSdt.prototype.GetDirectTextPr = function()
{
	return this.Content.GetDirectTextPr();
};
CBlockLevelSdt.prototype.Hyperlink_CanAdd = function(bCheckInHyperlink)
{
	return this.Content.Hyperlink_CanAdd(bCheckInHyperlink);
};
CBlockLevelSdt.prototype.DrawSelectionOnPage = function(CurPage)
{
	this.Content.DrawSelectionOnPage(CurPage);
};
CBlockLevelSdt.prototype.GetSelectionBounds = function()
{
	return this.Content.GetSelectionBounds();
};
CBlockLevelSdt.prototype.RecalculateCurPos = function()
{
	return this.Content.RecalculateCurPos();
};
CBlockLevelSdt.prototype.Can_CopyCut = function()
{
	return this.Content.Can_CopyCut();
};
CBlockLevelSdt.prototype.CheckPosInSelection = function(X, Y, CurPage, NearPos)
{
	return this.Content.CheckPosInSelection(X, Y, CurPage, NearPos);
};
CBlockLevelSdt.prototype.Get_NearestPos = function(CurPage, X, Y, bAnchor, Drawing)
{
	return this.Content.Get_NearestPos(CurPage, X, Y, bAnchor, Drawing);
};
CBlockLevelSdt.prototype.CanUpdateTarget = function(CurPage)
{
	return this.Content.CanUpdateTatget(CurPage);
};
CBlockLevelSdt.prototype.MoveCursorLeft = function(AddToSelect, Word)
{
	return this.Content.MoveCursorLeft(AddToSelect, Word);
};
CBlockLevelSdt.prototype.MoveCursorLeftWithSelectionFromEnd = function(Word)
{
	return this.Content.MoveCursorLeftWithSelectionFromEnd(Word);
};
CBlockLevelSdt.prototype.MoveCursorRight = function(AddToSelect, Word)
{
	return this.Content.MoveCursorRight(AddToSelect, Word, false);
};
CBlockLevelSdt.prototype.MoveCursorRightWithSelectionFromStart = function(Word)
{
	return this.Content.MoveCursorRightWithSelectionFromStart(Word);
};
CBlockLevelSdt.prototype.MoveCursorToStartPos = function(AddToSelect)
{
	return this.Content.MoveCursorToStartPos(AddToSelect);
};
CBlockLevelSdt.prototype.MoveCursorToEndPos = function(AddToSelect, StartSelectFromEnd)
{
	return this.Content.MoveCursorToEndPos(AddToSelect, StartSelectFromEnd);
};
CBlockLevelSdt.prototype.MoveCursorUp = function(AddToSelect)
{
	return this.Content.MoveCursorUp(AddToSelect);
};
CBlockLevelSdt.prototype.MoveCursorUpToLastRow = function(X, Y, AddToSelect)
{
	return this.Content.MoveCursorUpToLastRow(X, Y, AddToSelect);
};
CBlockLevelSdt.prototype.MoveCursorDown = function(AddToSelect)
{
	return this.Content.MoveCursorDown(AddToSelect);
};
CBlockLevelSdt.prototype.MoveCursorDownToFirstRow = function(X, Y, AddToSelect)
{
	return this.Content.MoveCursorDownToFirstRow(X, Y, AddToSelect);
};
CBlockLevelSdt.prototype.MoveCursorToEndOfLine = function(AddToSelect)
{
	return this.Content.MoveCursorToEndOfLine(AddToSelect);
};
CBlockLevelSdt.prototype.MoveCursorToStartOfLine = function(AddToSelect)
{
	return this.Content.MoveCursorToStartOfLine(AddToSelect);
};
CBlockLevelSdt.prototype.MoveCursorToXY = function(X, Y, bLine, bDontChangeRealPos, CurPage)
{
	return this.Content.MoveCursorToXY(X, Y, bLine, bDontChangeRealPos, CurPage);
};
CBlockLevelSdt.prototype.MoveCursorToCell = function(bNext)
{
	return this.Content.MoveCursorToCell(bNext);
};
CBlockLevelSdt.prototype.Get_SelectionState = function()
{
	return this.Content.Get_SelectionState();
};
CBlockLevelSdt.prototype.Set_SelectionState = function(State, StateIndex)
{
	return this.Content.Set_SelectionState(State, StateIndex);
};
CBlockLevelSdt.prototype.IsCursorAtBegin = function(bOnlyPara)
{
	return this.Content.IsCursorAtBegin(bOnlyPara);
};
CBlockLevelSdt.prototype.IsCursorAtEnd = function()
{
	return this.Content.IsCursorAtEnd();
};
CBlockLevelSdt.prototype.Add_NewParagraph = function()
{
	return this.Content.Add_NewParagraph();
};
CBlockLevelSdt.prototype.Hyperlink_Check = function(bCheckEnd)
{
	return this.Content.Hyperlink_Check(bCheckEnd);
};
CBlockLevelSdt.prototype.Get_SelectionState2 = function()
{
	return this.Content.Get_SelectionState2();
};
CBlockLevelSdt.prototype.Set_SelectionState2 = function(State)
{
	this.Content.Set_SelectionState2(State);
};
CBlockLevelSdt.prototype.IsStartFromNewPage = function()
{
	this.Content.IsStartFromNewPage();
};
CBlockLevelSdt.prototype.GetAllParagraphs = function(Props, ParaArray)
{
	return this.Content.GetAllParagraphs(Props, ParaArray);
};
CBlockLevelSdt.prototype.SetContentSelection = function(StartDocPos, EndDocPos, Depth, StartFlag, EndFlag)
{
	this.Content.SetContentSelection(StartDocPos, EndDocPos, Depth, StartFlag, EndFlag);
};
CBlockLevelSdt.prototype.GetContentPosition = function(bSelection, bStart, PosArray)
{
	return this.Content.GetContentPosition(bSelection, bStart, PosArray);
};
CBlockLevelSdt.prototype.SetContentPosition = function(DocPos, Depth, Flag)
{
	this.Content.SetContentPosition(DocPos, Depth, Flag);
};
CBlockLevelSdt.prototype.GetNumberingInfo = function(oNumberingEngine)
{
	return this.Content.GetNumberingInfo(oNumberingEngine);
};
CBlockLevelSdt.prototype.AddInlineImage = function(W, H, Img, Chart, bFlow)
{
	this.Content.AddInlineImage(W, H, Img, Chart, bFlow);
};
CBlockLevelSdt.prototype.AddOleObject = function(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId)
{
	this.Content.AddOleObject(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId);
};
CBlockLevelSdt.prototype.AddTextArt = function(nStyle)
{
	this.Content.AddTextArt(nStyle);
};
CBlockLevelSdt.prototype.AddInlineTable = function(nCols, nRows)
{
	this.Content.AddInlineTable(nCols, nRows);
};
CBlockLevelSdt.prototype.Remove = function(nCount, bOnlyText, bRemoveOnlySelection, bOnAddText)
{
	return this.Content.Remove(nCount, bOnlyText, bRemoveOnlySelection, bOnAddText);
};
CBlockLevelSdt.prototype.Is_Empty = function()
{
	return this.Content.Is_Empty();
};
CBlockLevelSdt.prototype.Add = function(oParaItem)
{
	return this.Content.Paragraph_Add(oParaItem);
};
CBlockLevelSdt.prototype.PreDelete = function()
{
	this.Content.PreDelete();
};
CBlockLevelSdt.prototype.ClearParagraphFormatting = function()
{
	this.Content.ClearParagraphFormatting();
};
CBlockLevelSdt.prototype.GetCursorPosXY = function()
{
	return this.Content.GetCursorPosXY();
};
CBlockLevelSdt.prototype.StartSelectionFromCurPos = function()
{
	this.Content.StartSelectionFromCurPos();
};
CBlockLevelSdt.prototype.SetParagraphAlign = function(Align)
{
	return this.Content.SetParagraphAlign(Align);
};
CBlockLevelSdt.prototype.SetParagraphSpacing = function(Spacing)
{
	return this.Content.SetParagraphSpacing(Spacing);
};
CBlockLevelSdt.prototype.SetParagraphTabs = function(Tabs)
{
	return this.Content.SetParagraphTabs(Tabs);
};
CBlockLevelSdt.prototype.SetParagraphIndent = function(Ind)
{
	return this.Content.SetParagraphIndent(Ind);
};
CBlockLevelSdt.prototype.SetParagraphNumbering = function(NumInfo)
{
	return this.Content.SetParagraphNumbering(NumInfo);
};
CBlockLevelSdt.prototype.SetParagraphShd = function(Shd)
{
	return this.Content.SetParagraphShd(Shd);
};
CBlockLevelSdt.prototype.SetParagraphStyle = function(Name)
{
	return this.Content.SetParagraphStyle(Name);
};
CBlockLevelSdt.prototype.SetParagraphContextualSpacing = function(Value)
{
	return this.Content.SetParagraphContextualSpacing(Value);
};
CBlockLevelSdt.prototype.SetParagraphPageBreakBefore = function(Value)
{
	return this.Content.SetParagraphPageBreakBefore(Value);
};
CBlockLevelSdt.prototype.SetParagraphKeepLines = function(Value)
{
	return this.Content.SetParagraphKeepLines(Value);
};
CBlockLevelSdt.prototype.SetParagraphKeepNext = function(Value)
{
	return this.Content.SetParagraphKeepNext(Value);
};
CBlockLevelSdt.prototype.SetParagraphWidowControl = function(Value)
{
	return this.Content.SetParagraphWidowControl(Value);
};
CBlockLevelSdt.prototype.SetParagraphBorders = function(Borders)
{
	return this.Content.SetParagraphBorders(Borders);
};
CBlockLevelSdt.prototype.SetParagraphFramePr = function(FramePr, bDelete)
{
	return this.Content.SetParagraphFramePr(FramePr, bDelete);
};
CBlockLevelSdt.prototype.IncreaseDecreaseFontSize = function(bIncrease)
{
	return this.Content.IncreaseDecreaseFontSize(bIncrease);
};
CBlockLevelSdt.prototype.IncreaseDecreaseIndent = function(bIncrease)
{
	return this.Content.IncreaseDecreaseIndent(bIncrease);
};
CBlockLevelSdt.prototype.SetImageProps = function(oProps)
{
	return this.Content.SetImageProps(oProps);
};
CBlockLevelSdt.prototype.SetTableProps = function(oProps)
{
	return this.Content.SetTableProps(oProps);
};
CBlockLevelSdt.prototype.GetSelectedContent = function(oSelectedContent)
{
	return this.Content.GetSelectedContent(oSelectedContent);
};
CBlockLevelSdt.prototype.PasteFormatting = function(TextPr, ParaPr, ApplyPara)
{
	return this.Content.PasteFormatting(TextPr, ParaPr, ApplyPara);
};
CBlockLevelSdt.prototype.GetCurPosXY = function()
{
	return this.Content.GetCurPosXY();
};
CBlockLevelSdt.prototype.GetSelectedText = function(bClearText, oPr)
{
	return this.Content.GetSelectedText(bClearText, oPr);
};
CBlockLevelSdt.prototype.GetCurrentParagraph = function()
{
	return this.Content.GetCurrentParagraph();
};
CBlockLevelSdt.prototype.AddTableRow = function(bBefore)
{
	return this.Content.AddTableRow(bBefore);
};
CBlockLevelSdt.prototype.AddTableColumn = function(bBefore)
{
	return this.Content.AddTableColumn(bBefore);
};
CBlockLevelSdt.prototype.RemoveTableRow = function(nRowIndex)
{
	return this.Content.RemoveTableRow(nRowIndex);
};
CBlockLevelSdt.prototype.RemoveTableColumn = function()
{
	return this.Content.RemoveTableColumn();
};
CBlockLevelSdt.prototype.MergeTableCells = function()
{
	return this.Content.MergeTableCells();
};
CBlockLevelSdt.prototype.SplitTableCells = function(nColsCount, nRowsCount)
{
	return this.Content.SplitTableCells(nColsCount, nRowsCount);
};
CBlockLevelSdt.prototype.RemoveTable = function()
{
	return this.Content.RemoveTable();
};
CBlockLevelSdt.prototype.SelectTable = function(Type)
{
	return this.Content.SelectTable(Type);
};
CBlockLevelSdt.prototype.CanMergeTableCells = function()
{
	return this.Content.CanMergeTableCells();
};
CBlockLevelSdt.prototype.CanSplitTableCells = function()
{
	return this.Content.CanSplitTableCells();
};

CBlockLevelSdt.prototype.CanAddComment = function()
{
	return this.Content.CanAddComment();
};
//----------------------------------------------------------------------------------------------------------------------
CBlockLevelSdt.prototype.Is_HdrFtr = function(bReturnHdrFtr)
{
	return this.Parent.Is_HdrFtr(bReturnHdrFtr);
};
CBlockLevelSdt.prototype.Is_TopDocument = function(bReturnTopDocument)
{
	return this.Parent.Is_TopDocument(bReturnTopDocument);
};
CBlockLevelSdt.prototype.Is_Cell = function()
{
	return this.Parent.Is_TableCellContent();
};
CBlockLevelSdt.prototype.Is_DrawingShape = function()
{
	return this.Parent.Is_DrawingShape();
};
CBlockLevelSdt.prototype.Get_Numbering = function()
{
	return this.LogicDocument.Get_Numbering();
};
CBlockLevelSdt.prototype.Get_Styles = function()
{
	return this.LogicDocument.Get_Styles();
};
CBlockLevelSdt.prototype.Get_TableStyleForPara = function()
{
	return this.Parent.Get_TableStyleForPara();
};
CBlockLevelSdt.prototype.Get_ShapeStyleForPara = function()
{
	return this.Parent.Get_ShapeStyleForPara();
};
CBlockLevelSdt.prototype.Get_Theme = function()
{
	return this.Parent.Get_Theme();
};
CBlockLevelSdt.prototype.Get_PrevElementEndInfo = function()
{
	return this.Parent.Get_PrevElementEndInfo(this);
};
CBlockLevelSdt.prototype.Get_EndInfo = function()
{
	return this.Content.Get_EndInfo();
};
CBlockLevelSdt.prototype.Is_UseInDocument = function(Id)
{
	if (Id === this.Content.GetId())
		return this.Parent.Is_UseInDocument(this.GetId());

	return false;
};
CBlockLevelSdt.prototype.Get_ColorMap = function()
{
	return this.Parent.Get_ColorMap();
};
CBlockLevelSdt.prototype.Get_TextBackGroundColor = function()
{
	return this.Parent.Get_TextBackGroundColor();
};
CBlockLevelSdt.prototype.Is_ThisElementCurrent = function(oElement)
{
	if (oElement === this.Content)
		return this.Parent.Is_ThisElementCurrent();

	return false;
};
CBlockLevelSdt.prototype.OnContentReDraw = function(StartPageAbs, EndPageAbs)
{
	this.Parent.OnContentReDraw(StartPageAbs, EndPageAbs);
};
CBlockLevelSdt.prototype.Document_CreateFontMap = function(FontMap)
{
	this.Content.Document_CreateFontMap(FontMap);
};
CBlockLevelSdt.prototype.Document_CreateFontCharMap = function(FontCharMap)
{
	this.Content.Document_CreateFontCharMap(FontCharMap);
};
CBlockLevelSdt.prototype.Document_Get_AllFontNames = function(AllFonts)
{
	this.Content.Document_Get_AllFontNames(AllFonts);
};
CBlockLevelSdt.prototype.Get_ParentTextTransform = function()
{
	return this.Parent.Get_ParentTextTransform();
};
CBlockLevelSdt.prototype.Set_CurrentElement = function(bUpdateStates, PageAbs, oDocContent)
{
	if (oDocContent === this.Content)
	{
		this.Parent.Update_ContentIndexing();
		this.Parent.Set_CurrentElement(this.Index, bUpdateStates);
	}
};
CBlockLevelSdt.prototype.Refresh_RecalcData2 = function(CurPage)
{
	this.Parent.Refresh_RecalcData2(this.Index, CurPage);
};
CBlockLevelSdt.prototype.Check_AutoFit = function()
{
	return this.Parent.Check_AutoFit();
};
CBlockLevelSdt.prototype.Is_InTable = function(bReturnTopTable)
{
	return this.Parent.Is_InTable(bReturnTopTable);
};
CBlockLevelSdt.prototype.Get_PageContentStartPos = function(PageIndex, ElementIndex)
{
	return this.Parent.Get_PageContentStartPos(PageIndex, ElementIndex);
};
CBlockLevelSdt.prototype.CheckTableCoincidence = function(Table)
{
	return this.Parent.CheckTableCoincidence(Table);
};
//--------------------------------------------------------export--------------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CBlockLevelSdt = CBlockLevelSdt;
window['AscCommonWord'].type_BlockLevelSdt = type_BlockLevelSdt;


function TEST_ADD_SDT()
{
	var oLogicDocument = editor.WordControl.m_oLogicDocument;

	oLogicDocument.Create_NewHistoryPoint();

	var oSdt = new CBlockLevelSdt(oLogicDocument, oLogicDocument);
	oSdt.Content.Paragraph_Add(new ParaText("S"));
	oSdt.Content.Paragraph_Add(new ParaText("d"));
	oSdt.Content.Paragraph_Add(new ParaText("t"));

	oLogicDocument.Internal_Content_Add(1, oSdt);
	oLogicDocument.Recalculate_FromStart();
}