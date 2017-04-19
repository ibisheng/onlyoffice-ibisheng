/*
 * (c) Copyright Ascensio System SIA 2010-2017
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

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
/**
 * Выставляем текущий элемент в данном классе.
 * @param bUpdateStates
 * @param PageAbs
 * @param oClass - ссылка на дочерний класс, из которого вызывалась данная функция
 */
CDocumentControllerBase.prototype.Set_CurrentElement = function(bUpdateStates, PageAbs, oClass)
{
};
//----------------------------------------------------------------------------------------------------------------------
// Чисто виртуальные функции
//----------------------------------------------------------------------------------------------------------------------
/**
 * Можно ли обновлять позицию курсора.
 * @returns {boolean}
 */
CDocumentControllerBase.prototype.CanUpdateTarget = function(){return true;};
/**
 * Пересчитываем текущую позицию.
 * @returns {{X: number, Y: number, Height: number, PageNum: number, Internal: {Line: number, Page: number, Range: number}, Transform: null}}
 */
CDocumentControllerBase.prototype.RecalculateCurPos = function(){return {X : 0, Y : 0, Height : 0, PageNum : 0, Internal : {Line : 0, Page : 0, Range : 0}, Transform : null};};
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
 * Добавляем элемент в параграф.
 * @param oItem
 * @param {boolean} bRecalculate - Пересчитывать ли после выполнения данной функции.
 */
CDocumentControllerBase.prototype.AddToParagraph = function(oItem, bRecalculate){};
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
CDocumentControllerBase.prototype.MoveCursorRight = function(AddToSelect, Word){return false;};
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
 * Уменьшаем или увеличиваем (по специальной таблице) размер шрифта в параграфе.
 * @param {boolean} bIncrease
 */
CDocumentControllerBase.prototype.IncreaseDecreaseFontSize = function(bIncrease){};
/**
 * Уменьшаем или увеличиваем (по специальной таблице) отступы в параграфе.
 * @param {boolean} bIncrease
 */
CDocumentControllerBase.prototype.IncreaseDecreaseIndent = function(bIncrease){};
/**
 * Устанавливаем настройки для изображений.
 * @param Props
 */
CDocumentControllerBase.prototype.SetImageProps = function(Props){};
/**
 * Устанавливаем настройки для таблиц.
 * @param Props
 */
CDocumentControllerBase.prototype.SetTableProps = function(Props){};
/**
 * Получаем текущие настройки параграфа.
 * @returns {CParaPr}
 */
CDocumentControllerBase.prototype.GetCalculatedParaPr = function(){var oParaPr = new CParaPr(); oParaPr.Init_Default(); return oParaPr};
/**
 * Получаем текущие настройки текста.
 * @returns {CTextPr}
 */
CDocumentControllerBase.prototype.GetCalculatedTextPr = function(){var oTextPr = new CTextPr(); oTextPr.Init_Default(); return oTextPr};
/**
 * Получаем прямые настройки параграфа.
 * @returns {CParaPr}
 */
CDocumentControllerBase.prototype.GetDirectParaPr = function(){var oParaPr = new CParaPr(); oParaPr.Init_Default(); return oParaPr};
/**
 * Получаем прямые настройки текста.
 * @returns {CTextPr}
 */
CDocumentControllerBase.prototype.GetDirectTextPr = function(){var oTextPr = new CTextPr(); oTextPr.Init_Default(); return oTextPr};
/**
 * Убираем селект.
 * @param bNoCheckDrawing
 */
CDocumentControllerBase.prototype.RemoveSelection = function(bNoCheckDrawing){};
/**
 * Проверяем пустой ли селект.
 * @returns {boolean}
 */
CDocumentControllerBase.prototype.IsEmptySelection = function(bCheckHidden){return true;};
/**
 * Рисуем селект на заданно странице.
 * @param PageAbs
 */
CDocumentControllerBase.prototype.DrawSelectionOnPage = function(PageAbs){};
/**
 * Получаем границы селекта.
 * @returns {*}
 */
CDocumentControllerBase.prototype.GetSelectionBounds = function(){return null;};
/**
 * Проверяем осуществляется ли сейчас движение таблицы.
 * @returns {boolean}
 */
CDocumentControllerBase.prototype.IsMovingTableBorder = function(){return false;};
/**
 * Проверяем попадает ли заданная позиция в селект.
 * @param X
 * @param Y
 * @param PageAbs
 * @param NearPos
 * @returns {boolean}
 */
CDocumentControllerBase.prototype.CheckPosInSelection = function(X, Y, PageAbs, NearPos){return false;};
/**
 * Выделяем все содержимое.
 */
CDocumentControllerBase.prototype.SelectAll = function(){};
/**
 * Получаем выделенный контент.
 * @param SelectedContent
 */
CDocumentControllerBase.prototype.GetSelectedContent = function(SelectedContent){};
/**
 * Обновляем вид курсора.
 */
CDocumentControllerBase.prototype.UpdateCursorType = function(X, Y, PageAbs, MouseEvent){};
/**
 * Вставляем форматирование.
 * @param TextPr
 * @param ParaPr
 */
CDocumentControllerBase.prototype.PasteFormatting = function(TextPr, ParaPr){};
/**
 * Проверяем используется ли в данный момент селект.
 * @returns {boolean}
 */
CDocumentControllerBase.prototype.IsSelectionUse = function(){return false;};
/**
 * Проверяем выделен ли именно текст сейчас.
 * @returns {boolean}
 */
CDocumentControllerBase.prototype.IsTextSelectionUse = function(){return false;};
/**
 * Получаем XY текущей позиции.
 * @returns {{X: number, Y: number}}
 */
CDocumentControllerBase.prototype.GetCurPosXY = function(){return {X : 0, Y : 0};};
/**
 * Получаем выделенный текст.
 * @param {boolean} bClearText
 * @param {object} oPr
 * @returns {String}
 */
CDocumentControllerBase.prototype.GetSelectedText = function(bClearText, oPr){return "";};
/**
 * Получаем текущий параграф.
 * @returns {?Paragraph}
 */
CDocumentControllerBase.prototype.GetCurrentParagraph = function(){return null};
/**
 * Собираем информацию о выделенной части документа.
 * @param oInfo
 */
CDocumentControllerBase.prototype.GetSelectedElementsInfo = function(oInfo){};
/**
 * Добавляем строку таблицы.
 * @param bBefore
 */
CDocumentControllerBase.prototype.AddTableRow = function(bBefore){};
/**
 * Добавляем столбец таблицы.
 * @param bBefore
 */
CDocumentControllerBase.prototype.AddTableCol = function(bBefore){};
/**
 * Удаляем строку таблицы.
 */
CDocumentControllerBase.prototype.RemoveTableRow = function(){};
/**
 * Удаляем колонку таблицы.
 */
CDocumentControllerBase.prototype.RemoveTableCol = function(){};
/**
 * Объединяем ячейки таблицы.
 */
CDocumentControllerBase.prototype.MergeTableCells = function(){};
/**
 * Разбить ячейки таблицы.
 */
CDocumentControllerBase.prototype.SplitTableCells = function(Cols, Rows){};
/**
 * Удаляем таблицу.
 */
CDocumentControllerBase.prototype.RemoveTable = function(){};
/**
 * Выделяем таблицу или ее часть.
 * @param Type тип выделения
 */
CDocumentControllerBase.prototype.SelectTable = function(Type){};
/**
 * Проверяем можем ли мы произвести объединение ячеек таблицы.
 * @returns {boolean}
 */
CDocumentControllerBase.prototype.CanMergeTableCells = function(){return false;};
/**
 * Проверяем можем ли мы произвести разделение ячеек таблицы.
 * @returns {boolean}
 */
CDocumentControllerBase.prototype.CanSplitTableCells = function(){return false;};
/**
 * Обновляем состояние интерфейса.
 */
CDocumentControllerBase.prototype.UpdateInterfaceState = function(){};
/**
 * Обновляем состояние линеек.
 */
CDocumentControllerBase.prototype.UpdateRulersState = function(){};
/**
 * Обновляем состояние селекта и курсора.
 */
CDocumentControllerBase.prototype.UpdateSelectionState = function(){};
/**
 * Получаем текущее состоянии селекта и курсора.
 */
CDocumentControllerBase.prototype.GetSelectionState = function(){return [];};
/**
 * Выставляем текущее состояние селекта и курсора.
 * @param State
 * @param StateIndex
 */
CDocumentControllerBase.prototype.SetSelectionState = function(State, StateIndex){};
/**
 * Добавляем гиперссылку.
 * @param Props
 */
CDocumentControllerBase.prototype.AddHyperlink = function(Props){};
/**
 * Изменяем гиперссылку.
 * @param Props
 */
CDocumentControllerBase.prototype.ModifyHyperlink = function(Props){};
/**
 * Удаляем гиперссылку.
 */
CDocumentControllerBase.prototype.RemoveHyperlink = function(){};
/**
 * Проверяем можно ли добавить гиперссылку.
 * @returns {boolean}
 */
CDocumentControllerBase.prototype.CanAddHyperlink = function(bCheckInHyperlink){return false;};
/**
 * Проверяем находится ли курсор сейчас в гиперссылке.
 * @returns {?ParaHyperlink}
 */
CDocumentControllerBase.prototype.IsCursorInHyperlink = function(bCheckEnd){return false;};
/**
 * Добавляем комментарий.
 * @param Comment
 */
CDocumentControllerBase.prototype.AddComment = function(Comment){};
/**
 * Проверяем, можно ли добавить комментарий.
 * @returns {boolean}
 */
CDocumentControllerBase.prototype.CanAddComment = function(){return false;};
/**
 * Получаем физическую позицию на странице для якоря по селекту.
 * @returns {{X0: number, X1: number, Y: number, Page: number}}
 */
CDocumentControllerBase.prototype.GetSelectionAnchorPos = function(){return {X0 : 0, X1 : 0, Y : 0, Page : 0};};
/**
 * Начинаем селект с текущей позиции.
 */
CDocumentControllerBase.prototype.StartSelectionFromCurPos = function(){};
/**
 * Сохраняем состояние документа изменения перед принятием чужих изменений.
 * @param State
 */
CDocumentControllerBase.prototype.SaveDocumentStateBeforeLoadChanges = function(State){};
/**
 * Восстанавливаем состояние документа после загрузки изменений.
 * @param State
 */
CDocumentControllerBase.prototype.RestoreDocumentStateAfterLoadChanges = function(State){};
/**
 * Получаем размеры текущей колонки.
 * @returns {{W: number, H: number}}
 */
CDocumentControllerBase.prototype.GetColumnSize = function(){return {W : 0, H : 0};};
/**
 * Получаем настройки текущей секции
 * @returns {CSectionPr?}
 */
CDocumentControllerBase.prototype.GetCurrentSectionPr = function(){return null;};
/**
 * Отличие от RemoveSelection в том, что сбрасываем селект с текста, но не сбрасываем с автофигур
 */
CDocumentControllerBase.prototype.RemoveTextSelection = function(){};
