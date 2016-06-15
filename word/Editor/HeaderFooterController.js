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
CHdrFtrController.prototype.Cursor_MoveLeft = function(AddToSelect, Word)
{
	return this.HdrFtr.Cursor_MoveLeft(AddToSelect, Word);
};
CHdrFtrController.prototype.Cursor_MoveRight = function(AddToSelect, Word, FromPaste)
{
	return this.HdrFtr.Cursor_MoveRight(AddToSelect, Word, FromPaste);
};
CHdrFtrController.prototype.AddToParagraph = function(oItem, bRecalculate)
{
	if (para_NewLine === oItem.Type && true === oItem.Is_PageOrColumnBreak())
		return;

	this.HdrFtr.Paragraph_Add(oItem, bRecalculate);
	this.LogicDocument.Document_UpdateSelectionState();
	this.LogicDocument.Document_UpdateUndoRedoState();
};