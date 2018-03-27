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
	this.Pr            = new CSdtPr();
	this.Lock          = new AscCommon.CLock();

	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	g_oTableId.Add(this, this.Id);
}

CBlockLevelSdt.prototype = Object.create(CDocumentContentElementBase.prototype);
CBlockLevelSdt.prototype.constructor = CBlockLevelSdt;

CBlockLevelSdt.prototype.Copy = function(Parent)
{
	var oNew = new CBlockLevelSdt(this.LogicDocument, Parent ? Parent : this.Parent);
	oNew.Content.Copy2(this.Content);
	oNew.SetPr(this.Pr);
	return oNew;
};
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
	this.Content.RecalcInfo = this.Parent.RecalcInfo;

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
CBlockLevelSdt.prototype.GetContentBounds = function(CurPage)
{
	return this.Content.GetContentBounds(CurPage);
};
CBlockLevelSdt.prototype.IsEmptyPage = function(nCurPage)
{
	return this.Content.IsEmptyPage(nCurPage);
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
	// String : Id
	// String : Content id
	Writer.WriteString2(this.GetId());
	Writer.WriteString2(this.Content.GetId());
};
CBlockLevelSdt.prototype.Read_FromBinary2 = function(Reader)
{
	this.LogicDocument = editor.WordControl.m_oLogicDocument;

	// String : Id
	// String : Content id
	this.Id      = Reader.GetString2();
	this.Content = this.LogicDocument.Get_TableId().Get_ById(Reader.GetString2());
};
CBlockLevelSdt.prototype.Draw = function(CurPage, oGraphics)
{
	this.Content.Draw(CurPage, oGraphics);

	if (AscCommon.locktype_None !== this.Lock.Get_Type())
	{
		var oBounds = this.GetContentBounds(CurPage);
		oGraphics.DrawLockObjectRect(this.Lock.Get_Type(), oBounds.Left, oBounds.Top, oBounds.Right - oBounds.Left, oBounds.Bottom - oBounds.Top);
	}
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
	var oBounds = this.GetContentBounds(CurPage);
	if (true === this.Lock.Is_Locked() && X < oBounds.Right && X > oBounds.Left && Y > oBounds.Top && Y < oBounds.Bottom)
	{
		var MMData              = new AscCommon.CMouseMoveData();
		var Coords              = this.LogicDocument.DrawingDocument.ConvertCoordsToCursorWR(oBounds.Left, oBounds.Top, this.Get_AbsolutePage(CurPage), this.Get_ParentTextTransform());
		MMData.X_abs            = Coords.X - 5;
		MMData.Y_abs            = Coords.Y;
		MMData.Type             = AscCommon.c_oAscMouseMoveDataTypes.LockedObject;
		MMData.UserId           = this.Lock.Get_UserId();
		MMData.HaveChanges      = this.Lock.Have_Changes();
		MMData.LockedObjectType = c_oAscMouseMoveLockedObjectType.Common;
		this.LogicDocument.Api.sync_MouseMoveCallback(MMData);
	}

	this.DrawContentControlsTrack(true);
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
	oInfo.SetBlockLevelSdt(this);
	this.Content.GetSelectedElementsInfo(oInfo);
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
CBlockLevelSdt.prototype.DrawSelectionOnPage = function(CurPage)
{
	this.Content.DrawSelectionOnPage(CurPage);
};
CBlockLevelSdt.prototype.GetSelectionBounds = function()
{
	return this.Content.GetSelectionBounds();
};
CBlockLevelSdt.prototype.RecalculateCurPos = function(bUpdateX, bUpdateY)
{
	return this.Content.RecalculateCurPos(bUpdateX, bUpdateY);
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
	return this.Content.CanUpdateTarget(CurPage);
};
CBlockLevelSdt.prototype.MoveCursorLeft = function(AddToSelect, Word)
{
	var bResult = this.Content.MoveCursorLeft(AddToSelect, Word);
	if (!bResult && this.LogicDocument.IsFillingFormMode())
		return true;

	return bResult;
};
CBlockLevelSdt.prototype.MoveCursorLeftWithSelectionFromEnd = function(Word)
{
	return this.Content.MoveCursorLeftWithSelectionFromEnd(Word);
};
CBlockLevelSdt.prototype.MoveCursorRight = function(AddToSelect, Word)
{
	var bResult = this.Content.MoveCursorRight(AddToSelect, Word, false);
	if (!bResult && this.LogicDocument.IsFillingFormMode())
		return true;

	return bResult;
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
CBlockLevelSdt.prototype.GetSelectionState = function()
{
	return this.Content.GetSelectionState();
};
CBlockLevelSdt.prototype.SetSelectionState = function(State, StateIndex)
{
	return this.Content.SetSelectionState(State, StateIndex);
};
CBlockLevelSdt.prototype.IsCursorAtBegin = function(bOnlyPara)
{
	return this.Content.IsCursorAtBegin(bOnlyPara);
};
CBlockLevelSdt.prototype.IsCursorAtEnd = function()
{
	return this.Content.IsCursorAtEnd();
};
CBlockLevelSdt.prototype.AddNewParagraph = function()
{
	return this.Content.AddNewParagraph();
};
CBlockLevelSdt.prototype.Get_SelectionState2 = function()
{
	var oState  = new CDocumentSelectionState();
	oState.Id   = this.GetId();
	oState.Data = this.Content.Get_SelectionState2();
	return oState;
};
CBlockLevelSdt.prototype.Set_SelectionState2 = function(State)
{
	if (State.Data)
		this.Content.Set_SelectionState2(State.Data);
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
CBlockLevelSdt.prototype.AddImages = function(aImages)
{
	this.Content.AddImages(aImages);
};
CBlockLevelSdt.prototype.AddSignatureLine = function(oSignatureDrawing)
{
	this.Content.AddSignatureLine(oSignatureDrawing);
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
	var Res = this.Content.Remove(nCount, bOnlyText, bRemoveOnlySelection, bOnAddText);

	if (this.Is_Empty() && !bOnAddText && this.LogicDocument && true === this.LogicDocument.IsFillingFormMode())
	{
		var oParagraph = new Paragraph(this.LogicDocument.Get_DrawingDocument(), this.Content);
		this.Content.Add_ToContent(0, oParagraph);
		this.Content.Remove_FromContent(1, this.Content.GetElementsCount() - 1);
		this.Content.MoveCursorToStartPos(false);
		return true;
	}

	return Res;
};
CBlockLevelSdt.prototype.Is_Empty = function()
{
	return this.Content.Is_Empty();
};
CBlockLevelSdt.prototype.Add = function(oParaItem)
{
	return this.Content.AddToParagraph(oParaItem);
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
	if (this.Content.IsSelectedAll())
	{
		oSelectedContent.Add(new CSelectedElement(this.Copy(this.Parent)));
	}
	else
	{
		return this.Content.GetSelectedContent(oSelectedContent);
	}
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
CBlockLevelSdt.prototype.GetCurrentParagraph = function(bIgnoreSelection, arrSelectedParagraphs)
{
	return this.Content.GetCurrentParagraph(bIgnoreSelection, arrSelectedParagraphs);
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
CBlockLevelSdt.prototype.DistributeTableCells = function(isHorizontally)
{
	return this.Content.DistributeTableCells(isHorizontally);
};
CBlockLevelSdt.prototype.Document_UpdateInterfaceState = function()
{
	this.LogicDocument.Api.sync_ContentControlCallback(this.GetContentControlPr());
	this.Content.Document_UpdateInterfaceState();
};
CBlockLevelSdt.prototype.Document_UpdateRulersState = function(CurPage)
{
	this.Content.Document_UpdateRulersState(CurPage);
};
CBlockLevelSdt.prototype.GetTableProps = function()
{
	return this.Content.GetTableProps();
};
CBlockLevelSdt.prototype.AddHyperlink = function(Props)
{
	return this.Content.AddHyperlink(Props);
};
CBlockLevelSdt.prototype.ModifyHyperlink = function(Props)
{
	this.Content.ModifyHyperlink(Props);
};
CBlockLevelSdt.prototype.RemoveHyperlink = function()
{
	this.Content.RemoveHyperlink();
};
CBlockLevelSdt.prototype.CanAddHyperlink = function(bCheckInHyperlink)
{
	return this.Content.CanAddHyperlink(bCheckInHyperlink);
};
CBlockLevelSdt.prototype.IsCursorInHyperlink = function(bCheckEnd)
{
	return this.Content.IsCursorInHyperlink(bCheckEnd);
};
CBlockLevelSdt.prototype.AddComment = function(Comment, bStart, bEnd)
{
	return this.Content.AddComment(Comment, bStart, bEnd);
};
CBlockLevelSdt.prototype.CanAddComment = function()
{
	return this.Content.CanAddComment();
};
CBlockLevelSdt.prototype.GetSelectionAnchorPos = function()
{
	return this.Content.GetSelectionAnchorPos();
};
CBlockLevelSdt.prototype.DrawContentControlsTrack = function(isHover)
{
	var oDrawingDocument = this.LogicDocument.Get_DrawingDocument();
	var arrRects = [];

	for (var nCurPage = 0, nPagesCount = this.GetPagesCount(); nCurPage < nPagesCount; ++nCurPage)
	{
		if (this.IsEmptyPage(nCurPage))
			continue;

		var nPageAbs = this.Get_AbsolutePage(nCurPage);
		var oBounds = this.Content.GetContentBounds(nCurPage);
		arrRects.push({X : oBounds.Left, Y : oBounds.Top, R : oBounds.Right, B : oBounds.Bottom, Page : nPageAbs});
	}

	var sName      = this.GetLabel();
	var isBuiltIn  = false;
	var arrButtons = [];

	if (this.IsBuiltInTableOfContents())
	{
		sName      = AscCommon.translateManager.getValue("Table of Contents");
		isBuiltIn  = true;
		arrButtons.push(1);
	}

	oDrawingDocument.OnDrawContentControl(this.GetId(), isHover ? c_oContentControlTrack.Hover : c_oContentControlTrack.In, arrRects, this.Get_ParentTextTransform(), sName, isBuiltIn, arrButtons);
};
CBlockLevelSdt.prototype.AddContentControl = function(nContentControlType)
{
	return this.Content.AddContentControl(nContentControlType);
};
CBlockLevelSdt.prototype.RecalculateMinMaxContentWidth = function(isRotated)
{
	return this.Content.RecalculateMinMaxContentWidth(isRotated);
};
CBlockLevelSdt.prototype.Shift = function(CurPage, dX, dY)
{
	this.Content.Shift(CurPage, dX, dY);
};
CBlockLevelSdt.prototype.UpdateEndInfo = function()
{
	this.Content.UpdateEndInfo();
};
CBlockLevelSdt.prototype.PrepareRecalculateObject = function()
{
	this.Content.PrepareRecalculateObject();
};
CBlockLevelSdt.prototype.SaveRecalculateObject = function()
{
	return this.Content.SaveRecalculateObject();
};
CBlockLevelSdt.prototype.LoadRecalculateObject = function(RecalcObj)
{
	return this.Content.LoadRecalculateObject(RecalcObj);
};
CBlockLevelSdt.prototype.Set_ApplyToAll = function(bValue)
{
	this.Content.Set_ApplyToAll(bValue);
};
CBlockLevelSdt.prototype.RecalculateAllTables = function()
{
	this.Content.RecalculateAllTables();
};
CBlockLevelSdt.prototype.GetAllFloatElements = function(FloatObjects)
{
	return this.Content.GetAllFloatElements(FloatObjects);
};
CBlockLevelSdt.prototype.Get_FirstParagraph = function()
{
	return this.Content.Get_FirstParagraph();
};
CBlockLevelSdt.prototype.StartFromNewPage = function()
{
	this.Content.StartFromNewPage();
};
CBlockLevelSdt.prototype.CollectDocumentStatistics = function(Stats)
{
	return this.Content.CollectDocumentStatistics(Stats);
};
CBlockLevelSdt.prototype.CompareDrawingsLogicPositions = function(CompareObject)
{
	return this.Content.CompareDrawingsLogicPositions(CompareObject);
};
CBlockLevelSdt.prototype.GetStyleFromFormatting = function()
{
	return this.Content.GetStyleFromFormatting();
};
CBlockLevelSdt.prototype.GetAllContentControls = function(arrContentControls)
{
	arrContentControls.push(this);
	this.Content.GetAllContentControls(arrContentControls);
};
CBlockLevelSdt.prototype.IsSelectedAll = function()
{
	return this.Content.IsSelectedAll();
};
CBlockLevelSdt.prototype.GetLastRangeVisibleBounds = function()
{
	return this.Content.GetLastRangeVisibleBounds();
};
CBlockLevelSdt.prototype.FindNextFillingForm = function(isNext, isCurrent, isStart)
{
	if (isCurrent && true === this.IsSelectedAll())
	{
		if (isNext)
			return this.Content.FindNextFillingForm(isNext, isCurrent, isStart);

		return null;
	}

	if (!isCurrent && isNext)
		return this;

	var oRes = this.Content.FindNextFillingForm(isNext, isCurrent, isStart);
	if (oRes)
		return oRes;

	if (!isNext)
		return this;

	return null;
};
CBlockLevelSdt.prototype.GetRevisionsChangeParagraph = function(SearchEngine)
{
	return this.Content.GetRevisionsChangeParagraph(SearchEngine);
};
CBlockLevelSdt.prototype.AcceptRevisionChanges = function(Type, bAll)
{
	this.Content.AcceptRevisionChanges(Type, bAll);
};
CBlockLevelSdt.prototype.RejectRevisionChanges = function(Type, bAll)
{
	this.Content.RejectRevisionChanges(Type, bAll);
};
CBlockLevelSdt.prototype.IsContentOnFirstPage = function()
{
	return this.Content.IsContentOnFirstPage();
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
CBlockLevelSdt.prototype.IsCell = function(isReturnCell)
{
	return this.Parent.IsTableCellContent(isReturnCell);
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
CBlockLevelSdt.prototype.GetPrevElementEndInfo = function()
{
	return this.Parent.GetPrevElementEndInfo(this);
};
CBlockLevelSdt.prototype.GetEndInfo = function()
{
	return this.Content.GetEndInfo();
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
CBlockLevelSdt.prototype.Refresh_RecalcData = function(Data)
{
};
CBlockLevelSdt.prototype.Check_AutoFit = function()
{
	return this.Parent.Check_AutoFit();
};
CBlockLevelSdt.prototype.Is_InTable = function(bReturnTopTable)
{
	return this.Parent.Is_InTable(bReturnTopTable);
};
CBlockLevelSdt.prototype.Get_PageContentStartPos = function(CurPage)
{
	var StartPage   = this.Get_AbsolutePage(0);
	var StartColumn = this.Get_AbsoluteColumn(0);

	if (this.Parent instanceof CDocumentContent)
	{
		StartPage   = this.Parent.StartPage;
		StartColumn = this.Parent.StartColumn;
	}

	return this.Parent.Get_PageContentStartPos2(StartPage, StartColumn, CurPage, this.Index);
};
CBlockLevelSdt.prototype.CheckTableCoincidence = function(Table)
{
	return this.Parent.CheckTableCoincidence(Table);
};
CBlockLevelSdt.prototype.CheckRange = function(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, CurPage, Inner, bMathWrap)
{
	if (true === Inner)
	{
		var PageRel = this.Get_AbsolutePage(CurPage) - this.Get_AbsolutePage(0) + this.Get_StartPage_Relative();
		return this.Parent.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageRel, Inner, bMathWrap);
	}
	else
	{
		return this.Content.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, CurPage, Inner, bMathWrap);
	}
};
CBlockLevelSdt.prototype.GetTopDocumentContent = function()
{
	return this.Parent.GetTopDocumentContent();
};
CBlockLevelSdt.prototype.GetAllDrawingObjects = function(AllDrawingObjects)
{
	return this.Content.GetAllDrawingObjects(AllDrawingObjects);
};
CBlockLevelSdt.prototype.GetAllComments = function(AllComments)
{
	return this.Content.GetAllComments(AllComments);
};
CBlockLevelSdt.prototype.GetAllMaths = function(AllMaths)
{
	return this.Content.GetAllMaths(AllMaths);
};
CBlockLevelSdt.prototype.Get_ParentTextTransform = function()
{
	return this.Parent.Get_ParentTextTransform();
};
CBlockLevelSdt.prototype.Get_SectPr = function()
{
	if (this.Parent && this.Parent.Get_SectPr)
	{
		this.Parent.Update_ContentIndexing();
		return this.Parent.Get_SectPr(this.Index);
	}

	return null;
};
CBlockLevelSdt.prototype.GetTopElement = function()
{
	if (true === this.Parent.Is_TopDocument(false))
		return this;

	return this.Parent.GetTopElement();
};
CBlockLevelSdt.prototype.GetMargins = function()
{
	return this.Parent.GetMargins();
};
CBlockLevelSdt.prototype.SelectContentControl = function()
{
	this.SelectAll(1);
	this.Set_CurrentElement(false, 0, this.Content);
};
CBlockLevelSdt.prototype.SetThisElementCurrent = function()
{
	this.Set_CurrentElement(false, 0, this.Content);
};
CBlockLevelSdt.prototype.RemoveContentControlWrapper = function()
{
	if (!this.Parent)
		return;

	this.Parent.Update_ContentIndexing();
	var nElementPos = this.GetIndex();

	if (this.Parent.Content[nElementPos] !== this)
		return;

	var nParentCurPos            = this.Parent.CurPos.ContentPos;
	var nParentSelectionStartPos = this.Parent.Selection.StartPos;
	var nParentSelectionEndPos   = this.Parent.Selection.EndPos;

	this.Parent.Remove_FromContent(nElementPos, 1);
	for (var nIndex = 0, nCount = this.Content.Content.length; nIndex < nCount; ++nIndex)
	{
		this.Parent.Add_ToContent(nElementPos + nIndex, this.Content.Content[nIndex]);
	}

	if (nParentCurPos === nElementPos)
		this.Parent.CurPos.ContentPos = nParentCurPos + this.Content.CurPos.ContentPos;
	else if (nParentCurPos > nElementPos)
		this.Parent.CurPos.ContentPos = nParentCurPos + nCount - 1;

	if (nParentSelectionStartPos === nElementPos)
		this.Parent.Selection.StartPos = nParentSelectionStartPos + this.Content.Selection.StartPos;
	else if (nParentSelectionStartPos > nElementPos)
		this.Parent.Selection.StartPos = nParentSelectionStartPos + nCount - 1;

	if (nParentSelectionEndPos === nElementPos)
		this.Parent.Selection.EndPos = nParentSelectionEndPos + this.Content.Selection.EndPos;
	else if (nParentSelectionEndPos > nElementPos)
		this.Parent.Selection.EndPos = nParentSelectionEndPos + nCount - 1;

	this.Content.Remove_FromContent(0, this.Content.Content.length - 1);
};
CBlockLevelSdt.prototype.IsTableFirstRowOnNewPage = function()
{
	return this.Parent.IsTableFirstRowOnNewPage();
};
CBlockLevelSdt.prototype.GetTableOfContents = function(isUnique, isCheckFields)
{
	if (this.IsBuiltInTableOfContents() && (!isUnique || this.IsBuiltInUnique()))
		return this;

	return this.Content.GetTableOfContents(isCheckFields);
};
CBlockLevelSdt.prototype.GetInnerTableOfContents = function()
{
	var oTOC = this.Content.GetTableOfContents(false, true);
	if (oTOC instanceof CBlockLevelSdt)
		return oTOC.GetInnerTableOfContents();

	return oTOC;
};
CBlockLevelSdt.prototype.IsBlockLevelSdtFirstOnNewPage = function()
{
	if (null !== this.Get_DocumentPrev()
		|| (true === this.Parent.IsTableCellContent() && true !== this.Parent.IsTableFirstRowOnNewPage())
		|| (true === this.Parent.IsBlockLevelSdtContent() && true !== this.Parent.IsBlockLevelSdtFirstOnNewPage()))
		return false;

	return true;
};
//----------------------------------------------------------------------------------------------------------------------
CBlockLevelSdt.prototype.GetContentControlType = function()
{
	return c_oAscSdtLevelType.Block;
};
CBlockLevelSdt.prototype.SetPr = function(oPr)
{
	this.SetAlias(oPr.Alias);
	this.SetTag(oPr.Tag);
	this.SetLabel(oPr.Label);
	this.SetContentControlLock(oPr.Lock);

	if (undefined !== oPr.DocPartObj)
		this.SetDocPartObj(oPr.DocPartObj.Category, oPr.DocPartObj.Gallery, oPr.DocPartObj.Unique);
};
CBlockLevelSdt.prototype.SetAlias = function(sAlias)
{
	if (sAlias !== this.Pr.Alias)
	{
		History.Add(new CChangesSdtPrAlias(this, this.Pr.Alias, sAlias));
		this.Pr.Alias = sAlias;
	}
};
CBlockLevelSdt.prototype.GetAlias = function()
{
	return (undefined !== this.Pr.Alias ? this.Pr.Alias : "");
};
CBlockLevelSdt.prototype.SetContentControlId = function(Id)
{
	if (this.Pr.Id !== Id)
	{
		History.Add(new CChangesSdtPrId(this, this.Pr.Id, Id));
		this.Pr.Id = Id;
	}
};
CBlockLevelSdt.prototype.GetContentControlId = function()
{
	return this.Pr.Id;
};
CBlockLevelSdt.prototype.SetTag = function(sTag)
{
	if (this.Pr.Tag !== sTag)
	{
		History.Add(new CChangesSdtPrTag(this, this.Pr.Tag, sTag));
		this.Pr.Tag = sTag;
	}
};
CBlockLevelSdt.prototype.GetTag = function()
{
	return (undefined !== this.Pr.Tag ? this.Pr.Tag : "");
};
CBlockLevelSdt.prototype.SetLabel = function(sLabel)
{
	if (this.Pr.Label !== sLabel)
	{
		History.Add(new CChangesSdtPrLabel(this, this.Pr.Label, sLabel));
		this.Pr.Label = sLabel;
	}
};
CBlockLevelSdt.prototype.GetLabel = function()
{
	return (undefined !== this.Pr.Label ? this.Pr.Label : "");
};
CBlockLevelSdt.prototype.SetDocPartObj = function(sCategory, sGallery, isUnique)
{
	History.Add(new CChangesSdtPrDocPartObj(this, this.Pr.DocPartObj, {Category : sCategory, Gallery : sGallery, Unique : isUnique}));
	this.Pr.DocPartObj.Category = sCategory;
	this.Pr.DocPartObj.Gallery  = sGallery;
	this.Pr.DocPartObj.Unique   = isUnique;
};
CBlockLevelSdt.prototype.IsBuiltInTableOfContents = function()
{
	return this.Pr.DocPartObj.Gallery === "Table of Contents";
};
CBlockLevelSdt.prototype.IsBuiltInUnique = function()
{
	return true === this.Pr.DocPartObj.Unique;
};
CBlockLevelSdt.prototype.SetContentControlLock = function(nLockType)
{
	if (this.Pr.Lock !== nLockType)
	{
		History.Add(new CChangesSdtPrLock(this, this.Pr.Lock, nLockType));
		this.Pr.Lock = nLockType;
	}
};
CBlockLevelSdt.prototype.GetContentControlLock = function()
{
	return (undefined !== this.Pr.Lock ? this.Pr.Lock : c_oAscSdtLockType.Unlocked);
};
CBlockLevelSdt.prototype.SetContentControlPr = function(oPr)
{
	if (!oPr)
		return;

	if (undefined !== oPr.Tag)
		this.SetTag(oPr.Tag);

	if (undefined !== oPr.Id)
		this.SetContentControlId(oPr.Id);

	if (undefined !== oPr.Lock)
		this.SetContentControlLock(oPr.Lock);

	if (undefined !== oPr.Alias)
		this.SetAlias(oPr.Alias);
};
CBlockLevelSdt.prototype.GetContentControlPr = function()
{
	var oPr = new CContentControlPr(c_oAscSdtLevelType.Block);

	oPr.Tag        = this.Pr.Tag;
	oPr.Id         = this.Pr.Id;
	oPr.Lock       = this.Pr.Lock;
	oPr.InternalId = this.GetId();
	oPr.Alias      = this.GetAlias();

	return oPr;
};
CBlockLevelSdt.prototype.Restart_CheckSpelling = function()
{
	this.Content.Restart_CheckSpelling();
};
CBlockLevelSdt.prototype.ClearContentControl = function()
{
	var oPara = new Paragraph(this.LogicDocument.Get_DrawingDocument(), this.Content);
	oPara.Correct_Content();

	this.Content.Add_ToContent(0, oPara);
	this.Content.Remove_FromContent(1, this.Content.GetElementsCount() - 1);
	this.Content.MoveCursorToStartPos(false);
};
/**
 * Получаем последний элемент содержимого
 * @returns {?CDocumentContentElementBase}
 */
CBlockLevelSdt.prototype.GetLastElement = function()
{
	var nCount = this.Content.GetElementsCount();
	if (nCount <= 0)
		return null;

	return this.Content.GetElement(nCount - 1);
};
CBlockLevelSdt.prototype.GetLastParagraph = function()
{
	return this.Content.GetLastParagraph();
};
//--------------------------------------------------------export--------------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CBlockLevelSdt = CBlockLevelSdt;
window['AscCommonWord'].type_BlockLevelSdt = type_BlockLevelSdt;