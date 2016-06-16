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
/**
 * Данная функция приходит из таблицы. Проверяет рассчитывается ли таблица по содержимому.
 * @returns {boolean}
 */
CDocumentControllerBase.prototype.Check_AutoFit = function()
{
	return false;
};
/**
 * Данная функция нужна для обновления информации о предстоящем пересчете.
 */
CDocumentControllerBase.prototype.Refresh_RecalcData2 = function()
{
};
/**
 * Проверяем находимся ли мы в таблице.
 * @param {boolean} bReturnTopTable - Возвращается объект или true/false
 * @returns {boolean | CTable}
 */
CDocumentControllerBase.prototype.Is_InTable = function(bReturnTopTable)
{
	if (true === bReturnTopTable)
		return null;

	return false;
};
/**
 * Проверяем находимся ли мы в автофигуре.
 * @param {boolean} bRetShape - возвращается объект или true/false
 * @returns {boolean | ParaDrawing}
 */
CDocumentControllerBase.prototype.Is_DrawingShape = function(bRetShape)
{
	if (bRetShape === true)
	{
		return null;
	}
	return false;
};
/**
 * Событие о том, что контент изменился и пересчитался.
 * @param bChange
 * @param bForceRecalc
 * @constructor
 */
CDocumentControllerBase.prototype.OnContentRecalculate = function(bChange, bForceRecalc)
{
	return;
};
/**
 * Получаем стартовую позицию для заданной страницы.
 * @returns {{X: number, Y: number, XLimit: number, YLimit: number}}
 */
CDocumentControllerBase.prototype.Get_PageContentStartPos = function(PageAbs)
{
	return {X : 0, Y : 0, XLimit : 0, YLimit : 0};
};
//----------------------------------------------------------------------------------------------------------------------
// Чисто виртуальные функции
//----------------------------------------------------------------------------------------------------------------------
/**
 * Можно ли обновлять позицию курсора.
 * @returns {boolean}
 */
CDocumentControllerBase.prototype.CanTargetUpdate = function(){return true;};
/**
 * Пересчитываем текущую позицию.
 */
CDocumentControllerBase.prototype.RecalculateCurPos = function(){};
/**
 * Получаем текущий номер страницы.
 * @returns {number} -1 - значит, номер страницы определеить невозможно
 */
CDocumentControllerBase.prototype.GetCurPage = function(){return -1;};
/**
 * Добавляем новый параграф.
 * @param {boolean} bRecalculate - Пересчитывать или нет.
 * @param {boolean} bForceAdd    - Добавляем параграф, пропуская всякие проверки типа пустого параграфа с нумерацией.
 */
CDocumentControllerBase.prototype.AddNewParagraph = function(bRecalculate, bForceAdd){return false;};
/**
 * Добавляем встроенное изображение
 * @param {number} nW - ширина
 * @param {number} nH - высота
 * @param oImage - ссылка на объект изображения
 * @param oChart - ссылка на объект диаграммы
 * @param {boolean} bFlow - инлайн объект или "плавающий"
 */
CDocumentControllerBase.prototype.AddInlineImage = function(nW, nH, oImage, oChart, bFlow){};
/**
 * Добавляем OLE-объект.
 * @param nW
 * @param nH
 * @param nWidthPix
 * @param nHeightPix
 * @param oImage
 * @param oData
 * @param sApplicationId
 */
CDocumentControllerBase.prototype.AddOleObject = function(nW, nH, nWidthPix, nHeightPix, oImage, oData, sApplicationId){};
/**
 * Добавляем графический объект TextArt.
 * @param nStyle
 */
CDocumentControllerBase.prototype.AddTextArt = function(nStyle){};
/**
 * Редактируем диаграмму.
 * @param Chart
 */
CDocumentControllerBase.prototype.EditChart = function(Chart){};
/**
 * Добавляем инлайн таблицу.
 * @param nCols
 * @param nRows
 */
CDocumentControllerBase.prototype.AddInlineTable = function(nCols, nRows){};
/**
 * Очищаем настройки параграфа.
 */
CDocumentControllerBase.prototype.ClearParagraphFormatting = function(){};
/**
 * Производим удаление выделенной части документа или исходя из позиции курсора.
 * @param {number} nDirection направление удаления
 * @param {boolean} bOnlyText - удаляем только текст
 * @param {boolean} bRemoveOnlySelection - удаляем только по селекту
 * @param {boolean} bOnAddText - удаление происходит во время добавления текста (особый тип удаления)
 * @returns {boolean} Выполнилось ли удаление.
 */
CDocumentControllerBase.prototype.Remove = function(nDirection, bOnlyText, bRemoveOnlySelection, bOnAddText){return true;};
/**
 * Получаем физическую позицию курсора на странице.
 */
CDocumentControllerBase.prototype.GetCursorPosXY = function(){return {X : 0, Y : 0};};
/**
 * Перемещаем курсор в начало.
 * @param {boolean} AddToSelect - добавляем ли все промежуточное к селекту
 */
CDocumentControllerBase.prototype.MoveCursorToStartPos = function(AddToSelect){};
/**
 * Перемещаем курсор в конец.
 * @param {boolean} AddToSelect - добавляем ли все промежуточное к селекту
 */
CDocumentControllerBase.prototype.MoveCursorToEndPos = function(AddToSelect){};
/**
 * Смещаем курсор влево
 * @param {boolean} AddToSelect Добавлять ли к селекту смещение
 * @param {boolean} Word Осуществлять ли переход по целому слову
 * @returns {boolean} Получилось ли перемещение, или мы достигли предела.
 */
CDocumentControllerBase.prototype.MoveCursorLeft = function(AddToSelect, Word){return false;};
/**
 * Смещаем курсор вправо
 * @param {boolean} AddToSelect Добавлять ли к селекту смещение
 * @param {boolean} Word Осуществлять ли переход по целому слову
 * @param {boolean} FromPaste Пришла ли данная комнда после "вставки"
 * @returns {boolean} Получилось ли перемещение, или мы достигли предела.
 */
CDocumentControllerBase.prototype.MoveCursorRight = function(AddToSelect, Word, FromPaste){return false;};
/**
 * Смещаем курсор вверх.
 * @param AddToSelect Добавлять ли к селекту смещение
 * @returns {boolean} Получилось ли перемещение, или мы достигли предела.
 */
CDocumentControllerBase.prototype.MoveCursorUp = function(AddToSelect){return false;};
/**
 * Смещаем курсор вниз.
 * @param AddToSelect Добавлять ли к селекту смещение
 * @returns {boolean} Получилось ли перемещение, или мы достигли предела.
 */
CDocumentControllerBase.prototype.MoveCursorDown = function(AddToSelect){return false;};
/**
 * Смещаем курсор в конец строки.
 * @param AddToSelect Добавлять ли к селекту смещение
 * @returns {boolean} Получилось ли перемещение, или мы достигли предела.
 */
CDocumentControllerBase.prototype.MoveCursorToEndOfLine = function(AddToSelect){return false;};
/**
 * Смещаем курсор в начало строки.
 * @param AddToSelect Добавлять ли к селекту смещение
 * @returns {boolean} Получилось ли перемещение, или мы достигли предела.
 */
CDocumentControllerBase.prototype.MoveCursorToStartOfLine = function(AddToSelect){return false;};
/**
 * Перемещаем курсор в заданную позицию на странице.
 * @param X
 * @param Y
 * @param PageAbs - абсолютный номер страницы
 * @param AddToSelect Добавлять ли к селекту смещение
 */
CDocumentControllerBase.prototype.MoveCursorToXY = function(X, Y, PageAbs, AddToSelect){};
/**
 * Перемещаем курсор в следующую или предыдущую ячейку.
 * @param {boolean} bNext
 */
CDocumentControllerBase.prototype.MoveCursorToCell = function(bNext){};
/**
 * Устанавливаем прилегание параграфа.
 * @param Align - тип прилегания
 */
CDocumentControllerBase.prototype.SetParagraphAlign = function(Align){};
/**
 * Установить межстрочные расстояния для параграфа.
 * @param Spacing
 */
CDocumentControllerBase.prototype.SetParagraphSpacing = function (Spacing){};
/**
 * Установить табы параграфа.
 * @param Tabs
 */
CDocumentControllerBase.prototype.SetParagraphTabs = function(Tabs){};
/**
 * Установить отступы параграфа.
 * @param Ind
 */
CDocumentControllerBase.prototype.SetParagraphIndent = function(Ind){};
/**
 * Установить тип нумерации параграфа.
 * @param NumInfo
 */
CDocumentControllerBase.prototype.SetParagraphNumbering = function(NumInfo){};
/**
 * Установить заливку параграфа.
 * @param Shd
 */
CDocumentControllerBase.prototype.SetParagraphShd = function(Shd){};
/**
 * Установить стиль параграфа.
 * @param Name - название стиля
 */
CDocumentControllerBase.prototype.SetParagraphStyle = function(Name){};
/**
 * Устанавливаем применять или нет расстояние между парграфами одного стиля.
 * @param {boolean} Value
 */
CDocumentControllerBase.prototype.SetParagraphContextualSpacing = function(Value){};
/**
 * Устанавливаем разрыв пере параграфом.
 * @param {boolean} Value
 */
CDocumentControllerBase.prototype.SetParagraphPageBreakBefore = function(Value){};
/**
 * Устанавливаем является ли параграф неразрывным.
 * @param {boolean} Value
 */
CDocumentControllerBase.prototype.SetParagraphKeepLines = function(Value){};
/**
 * Устанавливаем отрывать ли данный параграф от следующего.
 * @param {boolean} Value
 */
CDocumentControllerBase.prototype.SetParagraphKeepNext = function(Value){};
/**
 * Устанавливаем обработку висячих строк в парагрфе.
 * @param {boolean} Value
 */
CDocumentControllerBase.prototype.SetParagraphWidowControl = function(Value){};
/**
 * Устанавливаем границы параграфа
 * @param Borders
 */
CDocumentControllerBase.prototype.SetParagraphBorders = function(Borders){};
/**
 * Превращаем параграф в рамку (плавающий параграф).
 * @param FramePr
 * @param bDelete
 */
CDocumentControllerBase.prototype.SetParagraphFramePr = function(FramePr, bDelete){};

/**
 * Добавляем элемент в параграф.
 * @param oItem
 * @param {boolean} bRecalculate - Пересчитывать ли после выполнения данной функции.
 */
CDocumentControllerBase.prototype.AddToParagraph = function(oItem, bRecalculate){};
