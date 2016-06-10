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

CHdrFtrController.prototype.RecalculateCurPos = function()
{
	this.HdrFtr.RecalculateCurPos();
};