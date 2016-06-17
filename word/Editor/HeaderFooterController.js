"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 10.06.2016
 * Time: 15:33
 */


// TODO: На самом деле этот класс не нужен. Его нужно совместить с классом CHeaderFooterController, пока он будет сделан
// как оберточный класс над CHeaderFooterController

/**
 * Специальный класс-обработчик команд в колонтитулах
 * @param {CDocument} LogicDocument - Ссылка на главный документ.
 * @param {CHeaderFooterController} HdrFtr - ССылка на объект, управляющий колонтитулами
 * @constructor
 * @extends {CDocumentControllerBase}
 */
function CHdrFtrController(LogicDocument, HdrFtr)
{
	CHdrFtrController.superclass.constructor.call(this, LogicDocument);
	this.HdrFtr = HdrFtr;
}
AscCommon.extendClass(CHdrFtrController, CDocumentControllerBase);

CHdrFtrController.prototype.CanTargetUpdate = function()
{
	return true;
};
CHdrFtrController.prototype.RecalculateCurPos = function()
{
	this.HdrFtr.RecalculateCurPos();
};
CHdrFtrController.prototype.GetCurPage = function()
{
	var CurHdrFtr = this.HdrFtr.CurHdrFtr;
	if (null !== CurHdrFtr && -1 !== CurHdrFtr.RecalcInfo.CurPage)
		return CurHdrFtr.RecalcInfo.CurPage;

	return -1;
};
CHdrFtrController.prototype.AddNewParagraph = function(bRecalculate, bForceAdd)
{
	return this.HdrFtr.Add_NewParagraph(bRecalculate, bForceAdd);
};
CHdrFtrController.prototype.AddInlineImage = function(nW, nH, oImage, oChart, bFlow)
{
	this.HdrFtr.Add_InlineImage(nW, nH, oImage, oChart, bFlow);
};
CHdrFtrController.prototype.AddOleObject = function(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId)
{
	this.HdrFtr.Add_OleObject(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId);
};
CHdrFtrController.prototype.AddTextArt = function(nStyle)
{
	this.HdrFtr.Add_TextArt(nStyle);
};
CHdrFtrController.prototype.EditChart = function(Chart)
{
	this.HdrFtr.Edit_Chart(Chart);
};
CHdrFtrController.prototype.AddInlineTable = function(Cols, Rows)
{
	this.HdrFtr.Add_InlineTable(Cols, Rows);
};
CHdrFtrController.prototype.ClearParagraphFormatting = function()
{
	this.HdrFtr.Paragraph_ClearFormatting();
};
CHdrFtrController.prototype.Remove = function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
{
	var nResult = this.HdrFtr.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);

	if (null !== this.HdrFtr.CurHdtr && docpostype_DrawingObjects !== this.HdrFtr.CurHdrFtr.Content.CurPos.Type)
	{
		this.Selection_Remove();
		this.Selection.Use = false;
	}

	return nResult;
};
CHdrFtrController.prototype.GetCursorPosXY = function()
{
	return this.HdrFtr.Cursor_GetPos();
};
CHdrFtrController.prototype.MoveCursorToStartPos = function(AddToSelect)
{
	this.HdrFtr.Cursor_MoveToStartPos(AddToSelect);
};
CHdrFtrController.prototype.MoveCursorToEndPos = function(AddToSelect)
{
	this.HdrFtr.Cursor_MoveToEndPos(AddToSelect);
};
CHdrFtrController.prototype.MoveCursorLeft = function(AddToSelect, Word)
{
	return this.HdrFtr.Cursor_MoveLeft(AddToSelect, Word);
};
CHdrFtrController.prototype.MoveCursorRight = function(AddToSelect, Word, FromPaste)
{
	return this.HdrFtr.Cursor_MoveRight(AddToSelect, Word, FromPaste);
};
CHdrFtrController.prototype.MoveCursorUp = function(AddToSelect)
{
	var RetValue = this.HdrFtr.Cursor_MoveUp(AddToSelect);
	this.LogicDocument.Document_UpdateInterfaceState();
	this.LogicDocument.Document_UpdateSelectionState();
	return RetValue;
};
CHdrFtrController.prototype.MoveCursorDown = function(AddToSelect)
{
	var RetValue = this.HdrFtr.Cursor_MoveDown(AddToSelect);
	this.LogicDocument.Document_UpdateInterfaceState();
	this.LogicDocument.Document_UpdateSelectionState();
	return RetValue;
};
CHdrFtrController.prototype.MoveCursorToEndOfLine = function(AddToSelect)
{
	return this.HdrFtr.Cursor_MoveEndOfLine(AddToSelect);
};
CHdrFtrController.prototype.MoveCursorToStartOfLine = function(AddToSelect)
{
	return this.HdrFtr.Cursor_MoveStartOfLine(AddToSelect);
};
CHdrFtrController.prototype.MoveCursorToXY = function(X, Y, PageAbs, AddToSelect)
{
	return this.HdrFtr.Cursor_MoveAt(X, Y, PageAbs, AddToSelect);
};
CHdrFtrController.prototype.MoveCursorToCell = function(bNext)
{
	return this.HdrFtr.Cursor_MoveToCell(bNext);
};
CHdrFtrController.prototype.SetParagraphAlign = function(Align)
{
	this.HdrFtr.Set_ParagraphAlign(Align);
};
CHdrFtrController.prototype.SetParagraphSpacing = function (Spacing)
{
	this.HdrFtr.Set_ParagraphSpacing(Spacing);
};
CHdrFtrController.prototype.SetParagraphTabs = function(Tabs)
{
	this.HdrFtr.Set_ParagraphTabs(Tabs);
};
CHdrFtrController.prototype.SetParagraphIndent = function(Ind)
{
	this.HdrFtr.Set_ParagraphIndent(Ind);
};
CHdrFtrController.prototype.SetParagraphNumbering = function(NumInfo)
{
	this.HdrFtr.Set_ParagraphNumbering(NumInfo);
};
CHdrFtrController.prototype.SetParagraphShd = function(Shd)
{
	this.HdrFtr.Set_ParagraphShd(Shd);
};
CHdrFtrController.prototype.SetParagraphStyle = function(Name)
{
	this.HdrFtr.Set_ParagraphStyle(Name);
};
CHdrFtrController.prototype.SetParagraphContextualSpacing = function(Value)
{
	this.HdrFtr.Set_ParagraphContextualSpacing(Value);
};
CHdrFtrController.prototype.SetParagraphPageBreakBefore = function(Value)
{
	this.HdrFtr.Set_ParagraphPageBreakBefore(Value);
};
CHdrFtrController.prototype.SetParagraphKeepLines = function(Value)
{
	this.HdrFtr.Set_ParagraphKeepLines(Value);
};
CHdrFtrController.prototype.SetParagraphKeepNext = function(Value)
{
	this.HdrFtr.Set_ParagraphKeepNext(Value);
};
CHdrFtrController.prototype.SetParagraphWidowControl = function(Value)
{
	this.HdrFtr.Set_ParagraphWidowControl(Value);
};
CHdrFtrController.prototype.SetParagraphBorders = function(Borders)
{
	this.HdrFtr.Set_ParagraphBorders(Borders);
};
CHdrFtrController.prototype.SetParagraphFramePr = function(FramePr, bDelete)
{
	this.HdrFtr.Set_ParagraphFramePr(FramePr, bDelete);
};
CHdrFtrController.prototype.IncreaseOrDecreaseParagraphFontSize = function(bIncrease)
{
	this.HdrFtr.Paragraph_IncDecFontSize(bIncrease);
};
CHdrFtrController.prototype.IncreaseOrDecreaseParagraphIndent = function(bIncrease)
{
	this.HdrFtr.Paragraph_IncDecIndent(bIncrease);
};


CHdrFtrController.prototype.AddToParagraph = function(oItem, bRecalculate)
{
	if (para_NewLine === oItem.Type && true === oItem.Is_PageOrColumnBreak())
		return;

	this.HdrFtr.Paragraph_Add(oItem, bRecalculate);
	this.LogicDocument.Document_UpdateSelectionState();
	this.LogicDocument.Document_UpdateUndoRedoState();
};