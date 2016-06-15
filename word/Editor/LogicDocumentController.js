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
CLogicDocumentController.prototype.Cursor_MoveLeft = function(AddToSelect, Word)
{
	return this.LogicDocument.controller_CursorMoveLeft(AddToSelect, Word);
};
CLogicDocumentController.prototype.Cursor_MoveRight = function(AddToSelect, Word, FromPaste)
{
	return this.LogicDocument.controller_CursorMoveRight(AddToSelect, Word, FromPaste);
};
CLogicDocumentController.prototype.AddToParagraph = function(oItem)
{
	this.LogicDocument.controller_AddToParagraph(oItem);
};

