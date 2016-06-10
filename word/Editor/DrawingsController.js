"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 10.06.2016
 * Time: 15:31
 */

/**
 * Специальный класс-обработчик команд в автофигурах
 * @param {CDocument} LogicDocument - Ссылка на главный документ.
 * @constructor
 * @extends {CDocumentControllerBase}
 */
function CDrawingsController(LogicDocument)
{
	CDrawingsController.superclass.constructor.call(this, LogicDocument);
}
AscCommon.extendClass(CDrawingsController, CDocumentControllerBase);


