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

CLogicDocumentController.prototype.RecalculateCurPos = function()
{
	this.LogicDocument.controller_RecalculateCurPos();
};


