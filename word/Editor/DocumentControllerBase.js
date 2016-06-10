"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 29.04.2016
 * Time: 18:09
 */

/**
 * Интерфейс для классов, которые работают с колонтитулами/автофигурами/сносками
 * @param {CDocument} LogicDocument - Ссылка на главный документ.
 * @constructor
 */
function CDocumentControllerBase(LogicDocument)
{
	this.LogicDocument   = LogicDocument;
	this.DrawingDocument = LogicDocument.Get_DrawingDocument();
}

/**
 * Получаем ссылку на CDocument.
 * @returns {CDocument}
 */
CDocumentControllerBase.prototype.Get_LogicDocument = function()
{
	return this.LogicDocument;
};
/**
 * Получаем ссылку на CDrawingDocument.
 * @returns {CDrawingDocument}
 */
CDocumentControllerBase.prototype.Get_DrawingDocument = function()
{
	return this.DrawingDocument;
};
/**
 * Является ли данный класс контроллером для колонтитулов.
 * @param {boolean} bReturnHdrFtr Если true, тогда возвращаем ссылку на колонтитул.
 * @returns {boolean | CHeaderFooter}
 */
CDocumentControllerBase.prototype.Is_HdrFtr = function(bReturnHdrFtr)
{
	if (bReturnHdrFtr)
		return null;

	return false;
};
/**
 * Является ли данный класс контроллером для автофигур.
 * @param {boolean} bReturnShape Если true, тогда возвращаем ссылку на автофигуру.
 * @returns {boolean | CShape}
 */
CDocumentControllerBase.prototype.Is_HdrFtr = function(bReturnShape)
{
	if (bReturnShape)
		return null;

	return false;
};
/**
 * Получаем абосолютный номер страницы по относительному.
 * @param {number} CurPage
 * @returns {number}
 */
CDocumentControllerBase.prototype.Get_AbsolutePage = function(CurPage)
{
	return CurPage;
};
/**
 * Получаем абосолютный номер колноки по относительному номеру страницы.
 * @param {number} CurPage
 * @returns {number}
 */
CDocumentControllerBase.prototype.Get_AbsoluteColumn = function(CurPage)
{
	return 0;
};
/**
 * Проверяем, является ли данный класс верхним, по отношению к другим классам DocumentContent, Document
 * @param {boolean} bReturnTopDocument Если true, тогда возвращаем ссылку на документ.
 * @returns {СDocument | CDocumentContent | null}
 */
CDocumentControllerBase.prototype.Is_TopDocument = function(bReturnTopDocument)
{
	if (bReturnTopDocument)
		return null;

	return false;
};
/**
 * Получаем ссылку на объект, работающий с нумерацией.
 * @returns {CNumbering}
 */
CDocumentControllerBase.prototype.Get_Numbering = function()
{
	return this.LogicDocument.Get_Numbering();
};
/**
 * Получаем ссылку на объект, работающий со стилями.
 * @returns {CStyles}
 */
CDocumentControllerBase.prototype.Get_Styles = function()
{
	return this.LogicDocument.Get_Styles();
};
/**
 * Получаем ссылку на табличный стиль для параграфа.
 * @returns {null}
 */
CDocumentControllerBase.prototype.Get_TableStyleForPara = function()
{
	return null;
};
/**
 * Получаем ссылку на стиль автофигур для параграфа.
 * @returns {null}
 */
CDocumentControllerBase.prototype.Get_ShapeStyleForPara = function()
{
	return null;
};
/**
 * Запрашиваем цвет заливки.
 * @returns {null}
 */
CDocumentControllerBase.prototype.Get_TextBackGroundColor = function()
{
	return undefined;
};
/**
 * Является ли данный класс ячейкой.
 * @returns {false}
 */
CDocumentControllerBase.prototype.Is_Cell = function()
{
	return false;
};
/**
 * Получаем настройки темы для документа.
 */
CDocumentControllerBase.prototype.Get_Theme = function()
{
	return this.LogicDocument.Get_Theme();
};
/**
 * Получаем мап цветов.
 */
CDocumentControllerBase.prototype.Get_ColorMap = function()
{
	return this.LogicDocument.Get_ColorMap();
};
/**
 * Запрашиваем информацию о конце пересчета предыдущего элемента.
 * @param CurElement
 * @returns {null}
 */
CDocumentControllerBase.prototype.Get_PrevElementEndInfo = function(CurElement)
{
	return null;
};
/**
 * Получаем текущее преобразование.
 * @returns {null}
 */
CDocumentControllerBase.prototype.Get_ParentTextTransform = function()
{
	return null;
};

//----------------------------------------------------------------------------------------------------------------------
// Чисто виртуальные функции
//----------------------------------------------------------------------------------------------------------------------
/**
 * Пересчитываем текущую позицию.
 */
CDocumentControllerBase.prototype.RecalculateCurPos = function(){};
/**
 * Смещаем курсор влево
 * @param {boolean} AddToSelect Добавлять ли к селекту смещение
 * @param {boolean} Word Осуществлять ли переход по целому слову
 * @returns {boolean} Получилось ли перемещение, или мы достигли предела.
 */
CDocumentControllerBase.prototype.Cursor_MoveLeft = function(AddToSelect, Word){return false;};
/**
 * Смещаем курсор вправо
 * @param {boolean} AddToSelect Добавлять ли к селекту смещение
 * @param {boolean} Word Осуществлять ли переход по целому слову
 * @param {boolean} FromPaste Пришла ли данная комнда после "вставки"
 * @returns {boolean} Получилось ли перемещение, или мы достигли предела.
 */
CDocumentControllerBase.prototype.Cursor_MoveRight = function(AddToSelect, Word, FromPaste){return false;};
