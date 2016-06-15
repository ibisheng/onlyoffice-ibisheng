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
	CLogicDocumentController.superclass.constructor.call(this, LogicDocument);
}
AscCommon.extendClass(CLogicDocumentController, CDocumentControllerBase);

CLogicDocumentController.prototype.CanTargetUpdate = function()
{
	return this.LogicDocument.controller_CanTargetUpdate();
};
CLogicDocumentController.prototype.RecalculateCurPos = function()
{
	this.LogicDocument.controller_RecalculateCurPos();
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
CLogicDocumentController.prototype.MoveCursorRight = function(AddToSelect, Word, FromPaste)
{
	return this.LogicDocument.controller_MoveCursorRight(AddToSelect, Word, FromPaste);
};
CLogicDocumentController.prototype.AddToParagraph = function(oItem)
{
	this.LogicDocument.controller_AddToParagraph(oItem);
};

