"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 06.05.2016
 * Time: 12:24
 */

/**
 * Класс представляющий сноску в документе.
 * @param {CDocumentControllerBase} DocumentController
 * @constructor
 * @extends {CDocumentContent}
 */
function CFootEndnote(DocumentController)
{
	CFootEndnote.superclass.constructor.call(this, DocumentController, DocumentController.Get_DrawingDocument(), 0, 0, 0, 0, true, false, false);
}

AscCommon.extendClass(CFootEndnote, CDocumentContent);