"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 10.06.2016
 * Time: 15:31
 */

/**
 * Специальный класс-обработчик команд в автофигурах
 * @param {CDocument} LogicDocument - Ссылка на главный документ.
 * @param {CDrawingsObjects} DrawingsObjects - ССылка на объект, работающий с автофигурами
 * @constructor
 * @extends {CDocumentControllerBase}
 */
function CDrawingsController(LogicDocument, DrawingsObjects)
{
	CDrawingsController.superclass.constructor.call(this, LogicDocument);

	this.DrawingObjects = DrawingsObjects;
}
AscCommon.extendClass(CDrawingsController, CDocumentControllerBase);

CDrawingsController.prototype.RecalculateCurPos = function()
{
	this.DrawingObjects.recalculateCurPos();
};
CDrawingsController.prototype.Cursor_MoveLeft = function(AddToSelect, Word)
{
	return this.DrawingObjects.cursorMoveLeft(AddToSelect, Word);
};
CDrawingsController.prototype.Cursor_MoveRight = function(AddToSelect, Word, FromPaste)
{
	return this.DrawingObjects.cursorMoveRight(AddToSelect, Word, FromPaste);
};


