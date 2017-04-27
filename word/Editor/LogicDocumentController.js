"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 10.06.2016
 * Time: 15:25
 */

/**
 * Специальный класс-обработчик команд для основной части документа
 * @param {CDocument} LogicDocument - Ссылка на главный документ.
 * @constructor
 * @extends {CDocumentControllerBase}
 */
function CLogicDocumentController(LogicDocument)
{
	CDocumentControllerBase.call(this, LogicDocument);
}
CLogicDocumentController.prototype = Object.create(CDocumentControllerBase.prototype);
CLogicDocumentController.prototype.constructor = CLogicDocumentController;

CLogicDocumentController.prototype.CanUpdateTarget = function()
{
	return this.LogicDocument.controller_CanUpdateTarget();
};
CLogicDocumentController.prototype.RecalculateCurPos = function()
{
	return this.LogicDocument.controller_RecalculateCurPos();
};
CLogicDocumentController.prototype.GetCurPage = function()
{
	return this.LogicDocument.controller_GetCurPage();
};
CLogicDocumentController.prototype.AddNewParagraph = function(bRecalculate, bForceAdd)
{
	return this.LogicDocument.controller_AddNewParagraph(bRecalculate, bForceAdd);
};
CLogicDocumentController.prototype.AddInlineImage = function(nW, nH, oImage, oChart, bFlow)
{
	this.LogicDocument.controller_AddInlineImage(nW, nH, oImage, oChart, bFlow);
};
CLogicDocumentController.prototype.AddOleObject = function(nW, nH, nWidthPix, nHeightPix, oImage, oData, sApplicationId)
{
	this.LogicDocument.controller_AddOleObject(nW, nH, nWidthPix, nHeightPix, oImage, oData, sApplicationId);
};
CLogicDocumentController.prototype.AddTextArt = function(nStyle)
{
	this.LogicDocument.controller_AddTextArt(nStyle);
};
CLogicDocumentController.prototype.EditChart = function(Chart)
{
	// Ничего не делаем
};
CLogicDocumentController.prototype.AddInlineTable = function(nCols, nRows)
{
	this.LogicDocument.controller_AddInlineTable(nCols, nRows);
};
CLogicDocumentController.prototype.ClearParagraphFormatting = function()
{
	this.LogicDocument.controller_ClearParagraphFormatting();
};
CLogicDocumentController.prototype.AddToParagraph = function(oItem)
{
	this.LogicDocument.controller_AddToParagraph(oItem);
};
CLogicDocumentController.prototype.Remove = function(nDirection, bOnlyText, bRemoveOnlySelection, bOnAddText)
{
	return this.LogicDocument.controller_Remove(nDirection, bOnlyText, bRemoveOnlySelection, bOnAddText);
};
CLogicDocumentController.prototype.GetCursorPosXY = function()
{
	return this.LogicDocument.controller_GetCursorPosXY();
};
CLogicDocumentController.prototype.MoveCursorToStartPos = function(bAddToSelect)
{
	this.LogicDocument.controller_MoveCursorToStartPos(bAddToSelect);
};
CLogicDocumentController.prototype.MoveCursorToEndPos = function(AddToSelect)
{
	this.LogicDocument.controller_MoveCursorToEndPos(AddToSelect);
};
CLogicDocumentController.prototype.MoveCursorLeft = function(AddToSelect, Word)
{
	return this.LogicDocument.controller_MoveCursorLeft(AddToSelect, Word);
};
CLogicDocumentController.prototype.MoveCursorRight = function(AddToSelect, Word)
{
	return this.LogicDocument.controller_MoveCursorRight(AddToSelect, Word);
};
CLogicDocumentController.prototype.MoveCursorUp = function(AddToSelect)
{
	return this.LogicDocument.controller_MoveCursorUp(AddToSelect);
};
CLogicDocumentController.prototype.MoveCursorDown = function(AddToSelect)
{
	return this.LogicDocument.controller_MoveCursorDown(AddToSelect);
};
CLogicDocumentController.prototype.MoveCursorToEndOfLine = function(AddToSelect)
{
	return this.LogicDocument.controller_MoveCursorToEndOfLine(AddToSelect);
};
CLogicDocumentController.prototype.MoveCursorToStartOfLine = function(AddToSelect)
{
	return this.LogicDocument.controller_MoveCursorToStartOfLine(AddToSelect);
};
CLogicDocumentController.prototype.MoveCursorToXY = function(X, Y, PageAbs, AddToSelect)
{
	return this.LogicDocument.controller_MoveCursorToXY(X, Y, PageAbs, AddToSelect);
};
CLogicDocumentController.prototype.MoveCursorToCell = function(bNext)
{
	return this.LogicDocument.controller_MoveCursorToCell(bNext);
};
CLogicDocumentController.prototype.SetParagraphAlign = function(Align)
{
	this.LogicDocument.controller_SetParagraphAlign(Align);
};
CLogicDocumentController.prototype.SetParagraphSpacing = function (Spacing)
{
	this.LogicDocument.controller_SetParagraphSpacing(Spacing);
};
CLogicDocumentController.prototype.SetParagraphTabs = function(Tabs)
{
	this.LogicDocument.controller_SetParagraphTabs(Tabs);
};
CLogicDocumentController.prototype.SetParagraphIndent = function(Ind)
{
	this.LogicDocument.controller_SetParagraphIndent(Ind);
};
CLogicDocumentController.prototype.SetParagraphNumbering = function(NumInfo)
{
	this.LogicDocument.controller_SetParagraphNumbering(NumInfo);
};
CLogicDocumentController.prototype.SetParagraphShd = function(Shd)
{
	this.LogicDocument.controller_SetParagraphShd(Shd);
};
CLogicDocumentController.prototype.SetParagraphStyle = function(Name)
{
	this.LogicDocument.controller_SetParagraphStyle(Name);
};
CLogicDocumentController.prototype.SetParagraphContextualSpacing = function(Value)
{
	this.LogicDocument.controller_SetParagraphContextualSpacing(Value);
};
CLogicDocumentController.prototype.SetParagraphPageBreakBefore = function(Value)
{
	this.LogicDocument.controller_SetParagraphPageBreakBefore(Value);
};
CLogicDocumentController.prototype.SetParagraphKeepLines = function(Value)
{
	this.LogicDocument.controller_SetParagraphKeepLines(Value);
};
CLogicDocumentController.prototype.SetParagraphKeepNext = function(Value)
{
	this.LogicDocument.controller_SetParagraphKeepNext(Value);
};
CLogicDocumentController.prototype.SetParagraphWidowControl = function(Value)
{
	this.LogicDocument.controller_SetParagraphWidowControl(Value);
};
CLogicDocumentController.prototype.SetParagraphBorders = function(Borders)
{
	this.LogicDocument.controller_SetParagraphBorders(Borders);
};
CLogicDocumentController.prototype.SetParagraphFramePr = function(FramePr, bDelete)
{
	this.LogicDocument.controller_SetParagraphFramePr(FramePr, bDelete);
};
CLogicDocumentController.prototype.IncreaseDecreaseFontSize = function(bIncrease)
{
	this.LogicDocument.controller_IncreaseDecreaseFontSize(bIncrease);
};
CLogicDocumentController.prototype.IncreaseDecreaseIndent = function(bIncrease)
{
	this.LogicDocument.controller_IncreaseDecreaseIndent(bIncrease);
};
CLogicDocumentController.prototype.SetImageProps = function(Props)
{
	this.LogicDocument.controller_SetImageProps(Props);
};
CLogicDocumentController.prototype.SetTableProps = function(Props)
{
	this.LogicDocument.controller_SetTableProps(Props);
};
CLogicDocumentController.prototype.GetCalculatedParaPr = function()
{
	return this.LogicDocument.controller_GetCalculatedParaPr();
};
CLogicDocumentController.prototype.GetCalculatedTextPr = function()
{
	return this.LogicDocument.controller_GetCalculatedTextPr();
};
CLogicDocumentController.prototype.GetDirectParaPr = function()
{
	return this.LogicDocument.controller_GetDirectParaPr();
};
CLogicDocumentController.prototype.GetDirectTextPr = function()
{
	return this.LogicDocument.controller_GetDirectTextPr();
};
CLogicDocumentController.prototype.RemoveSelection = function(bNoCheckDrawing)
{
	this.LogicDocument.controller_RemoveSelection(bNoCheckDrawing);
};
CLogicDocumentController.prototype.IsSelectionEmpty = function(bCheckHidden)
{
	return this.LogicDocument.controller_IsSelectionEmpty(bCheckHidden);
};
CLogicDocumentController.prototype.DrawSelectionOnPage = function(PageAbs)
{
	this.LogicDocument.controller_DrawSelectionOnPage(PageAbs);
};
CLogicDocumentController.prototype.GetSelectionBounds = function()
{
	return this.LogicDocument.controller_GetSelectionBounds();
};
CLogicDocumentController.prototype.IsMovingTableBorder = function()
{
	return this.LogicDocument.controller_IsMovingTableBorder();
};
CLogicDocumentController.prototype.CheckPosInSelection = function(X, Y, PageAbs, NearPos)
{
	return this.LogicDocument.controller_CheckPosInSelection(X, Y, PageAbs, NearPos);
};
CLogicDocumentController.prototype.SelectAll = function()
{
	this.LogicDocument.controller_SelectAll();
};
CLogicDocumentController.prototype.GetSelectedContent = function(SelectedContent)
{
	this.LogicDocument.controller_GetSelectedContent(SelectedContent);
};
CLogicDocumentController.prototype.UpdateCursorType = function(X, Y, PageAbs, MouseEvent)
{
	this.LogicDocument.controller_UpdateCursorType(X, Y, PageAbs, MouseEvent);
};
CLogicDocumentController.prototype.PasteFormatting = function(TextPr, ParaPr)
{
	this.LogicDocument.controller_PasteFormatting(TextPr, ParaPr);
};
CLogicDocumentController.prototype.IsSelectionUse = function()
{
	return this.LogicDocument.controller_IsSelectionUse();
};
CLogicDocumentController.prototype.IsTextSelectionUse = function()
{
	return this.LogicDocument.controller_IsTextSelectionUse();
};
CLogicDocumentController.prototype.GetCurPosXY = function()
{
	return this.LogicDocument.controller_GetCurPosXY();
};
CLogicDocumentController.prototype.GetSelectedText = function(bClearText, oPr)
{
	return this.LogicDocument.controller_GetSelectedText(bClearText, oPr);
};
CLogicDocumentController.prototype.GetCurrentParagraph = function()
{
	return this.LogicDocument.controller_GetCurrentParagraph();
};
CLogicDocumentController.prototype.GetSelectedElementsInfo = function(oInfo)
{
	this.LogicDocument.controller_GetSelectedElementsInfo(oInfo);
};
CLogicDocumentController.prototype.AddTableRow = function(bBefore)
{
	this.LogicDocument.controller_AddTableRow(bBefore);
};
CLogicDocumentController.prototype.AddTableColumn = function(bBefore)
{
	this.LogicDocument.controller_AddTableColumn(bBefore);
};
CLogicDocumentController.prototype.RemoveTableRow = function()
{
	this.LogicDocument.controller_RemoveTableRow();
};
CLogicDocumentController.prototype.RemoveTableColumn = function()
{
	this.LogicDocument.controller_RemoveTableColumn();
};
CLogicDocumentController.prototype.MergeTableCells = function()
{
	this.LogicDocument.controller_MergeTableCells();
};
CLogicDocumentController.prototype.SplitTableCells = function(Cols, Rows)
{
	this.LogicDocument.controller_SplitTableCells(Cols, Rows);
};
CLogicDocumentController.prototype.RemoveTable = function()
{
	this.LogicDocument.controller_RemoveTable();
};
CLogicDocumentController.prototype.SelectTable = function(Type)
{
	this.LogicDocument.controller_SelectTable(Type);
};
CLogicDocumentController.prototype.CanMergeTableCells = function()
{
	return this.LogicDocument.controller_CanMergeTableCells();
};
CLogicDocumentController.prototype.CanSplitTableCells = function()
{
	return this.LogicDocument.controller_CanSplitTableCells();
};
CLogicDocumentController.prototype.UpdateInterfaceState = function()
{
	this.LogicDocument.controller_UpdateInterfaceState();
};
CLogicDocumentController.prototype.UpdateRulersState = function()
{
	this.LogicDocument.controller_UpdateRulersState();
};
CLogicDocumentController.prototype.UpdateSelectionState = function()
{
	this.LogicDocument.controller_UpdateSelectionState();
};
CLogicDocumentController.prototype.GetSelectionState = function()
{
	return this.LogicDocument.controller_GetSelectionState();
};
CLogicDocumentController.prototype.SetSelectionState = function(State, StateIndex)
{
	this.LogicDocument.controller_SetSelectionState(State, StateIndex);
};
CLogicDocumentController.prototype.AddHyperlink = function(Props)
{
	this.LogicDocument.controller_AddHyperlink(Props);
};
CLogicDocumentController.prototype.ModifyHyperlink = function(Props)
{
	this.LogicDocument.controller_ModifyHyperlink(Props);
};
CLogicDocumentController.prototype.RemoveHyperlink = function()
{
	this.LogicDocument.controller_RemoveHyperlink();
};
CLogicDocumentController.prototype.CanAddHyperlink = function(bCheckInHyperlink)
{
	return this.LogicDocument.controller_CanAddHyperlink(bCheckInHyperlink);
};
CLogicDocumentController.prototype.IsCursorInHyperlink = function(bCheckEnd)
{
	return this.LogicDocument.controller_IsCursorInHyperlink(bCheckEnd);
};
CLogicDocumentController.prototype.AddComment = function(Comment)
{
	this.LogicDocument.controller_AddComment(Comment);
};
CLogicDocumentController.prototype.CanAddComment = function()
{
	return this.LogicDocument.controller_CanAddComment();
};
CLogicDocumentController.prototype.GetSelectionAnchorPos = function()
{
	return this.LogicDocument.controller_GetSelectionAnchorPos();
};
CLogicDocumentController.prototype.StartSelectionFromCurPos = function()
{
	this.LogicDocument.controller_StartSelectionFromCurPos();
};
CLogicDocumentController.prototype.SaveDocumentStateBeforeLoadChanges = function(State)
{
	this.LogicDocument.controller_SaveDocumentStateBeforeLoadChanges(State);
};
CLogicDocumentController.prototype.RestoreDocumentStateAfterLoadChanges = function(State)
{
	this.LogicDocument.controller_RestoreDocumentStateAfterLoadChanges(State);
};
CLogicDocumentController.prototype.GetColumnSize = function()
{
	return this.LogicDocument.controller_GetColumnSize();
};
CLogicDocumentController.prototype.GetCurrentSectionPr = function()
{
	return this.LogicDocument.controller_GetCurrentSectionPr();
};
CLogicDocumentController.prototype.RemoveTextSelection = function()
{
	return this.RemoveSelection();
};
