"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 29.04.2016
 * Time: 18:23
 */

/**
 * Базовый класс для работы с содержимым документа (параграфы и таблицы).
 * @constructor
 */
function CDocumentContentBase()
{
	this.StartPage = 0; // Номер стартовой страницы в родительском классе
	this.CurPage   = 0; // Номер текущей страницы

	this.Content = [];

	this.ReindexStartPos = 0;
}

/**
 * Получаем тип активной части документа.
 * @returns {(docpostype_Content | docpostype_HdrFtr | docpostype_DrawingObjects | docpostype_Footnotes)}
 */
CDocumentContentBase.prototype.Get_DocPosType = function()
{
	return this.CurPos.Type;
};
/**
 * Выставляем тип активной части документа.
 * @param {(docpostype_Content | docpostype_HdrFtr | docpostype_DrawingObjects | docpostype_Footnotes)} nType
 */
CDocumentContentBase.prototype.Set_DocPosType = function(nType)
{
	this.CurPos.Type = nType;

	if (this.Controller)
	{
		if (docpostype_HdrFtr === nType)
		{
			this.Controller = this.HeaderFooterController;
		}
		else if (docpostype_DrawingObjects === nType)
		{
			this.Controller = this.DrawingsController;
		}
		else if (docpostype_Footnotes === nType)
		{
			this.Controller = this.Footnotes;
		}
		else //if (docpostype_Content === nType)
		{
			this.Controller = this.LogicDocumentController;
		}
	}
};
/**
 * Обновляем индексы элементов.
 */
CDocumentContentBase.prototype.Update_ContentIndexing = function()
{
	if (-1 !== this.ReindexStartPos)
	{
		for (var Index = this.ReindexStartPos, Count = this.Content.length; Index < Count; Index++)
		{
			this.Content[Index].Index = Index;
		}

		this.ReindexStartPos = -1;
	}
};
/**
 * Получаем массив всех автофигур.
 * @param {Array} arrDrawings - Если задан массив, тогда мы дополняем данный массив и возвращаем его.
 * @returns {Array}
 */
CDocumentContentBase.prototype.Get_AllDrawingObjects = function(arrDrawings)
{
	if (undefined === arrDrawings || null === arrDrawings)
		arrDrawings = [];

	if (this instanceof CDocument)
	{
		this.SectionsInfo.Get_AllDrawingObjects(arrDrawings);
	}

	for (var nPos = 0, nCount = this.Content.length; nPos < nCount; ++nPos)
	{
		this.Content[nPos].Get_AllDrawingObjects(arrDrawings);
	}

	return arrDrawings;
};
/**
 * Получаем массив URL всех картинок в документе.
 * @param {Array} arrUrls - Если задан массив, тогда мы дополняем данный массив и возвращаем его.
 * @returns {Array}
 */
CDocumentContentBase.prototype.Get_AllImageUrls = function(arrUrls)
{
	if (undefined === arrDrawings || null === arrDrawings)
		arrUrls = [];

	var arrDrawings = this.Get_AllDrawingObjects();
	for (var nIndex = 0, nCount = arrDrawings.length; nIndex < nCount; ++nIndex)
	{
		var oParaDrawing = arrDrawings[nIndex];
		oParaDrawing.GraphicObj.getAllRasterImages(arrUrls);
	}

	return arrUrls;
};
/**
 * Переназначаем ссылки на картинки.
 * @param {Object} mapUrls - Мап, в котором ключ - это старая ссылка, а значение - новая.
 */
CDocumentContentBase.prototype.Reassign_ImageUrls = function(mapUrls)
{
	var arrDrawings = this.Get_AllDrawingObjects();
	for (var nIndex = 0, nCount = arrDrawings.length; nIndex < nCount; ++nIndex)
	{
		var oDrawing = arrDrawings[nIndex];
		oDrawing.Reassign_ImageUrls(mapUrls);
	}
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private area
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Сообщаем, что нужно провести переиндексацию элементов начиная с заданного.
 * @param StartPos
 */
CDocumentContentBase.prototype.private_ReindexContent = function(StartPos)
{
	if (-1 === this.ReindexStartPos || this.ReindexStartPos > StartPos)
		this.ReindexStartPos = StartPos;
};
/**
 * Специальная функия для рассчета пустого параграфа с разрывом секции.
 * @param Element
 * @param PrevElement
 * @param PageIndex
 * @param ColumnIndex
 * @param ColumnsCount
 */
CDocumentContentBase.prototype.private_RecalculateEmptySectionParagraph = function(Element, PrevElement, PageIndex, ColumnIndex, ColumnsCount)
{
	var LastVisibleBounds = PrevElement.Get_LastRangeVisibleBounds();

	var ___X = LastVisibleBounds.X + LastVisibleBounds.W;
	var ___Y = LastVisibleBounds.Y;

	// Чтобы у нас знак разрыва секции рисовался красиво и где надо делаем небольшую хитрость:
	// перед пересчетом данного параграфа меняем в нем в скомпилированных настройках прилегание и
	// отступы, а после пересчета помечаем, что настройки нужно скомпилировать заново.
	var CompiledPr           = Element.Get_CompiledPr2(false).ParaPr;
	CompiledPr.Jc            = align_Left;
	CompiledPr.Ind.FirstLine = 0;
	CompiledPr.Ind.Left      = 0;
	CompiledPr.Ind.Right     = 0;

	// Делаем предел по X минимум 10 мм, чтобы всегда было видно элемент разрыва секции
	Element.Reset(___X, ___Y, Math.max(___X + 10, LastVisibleBounds.XLimit), 10000, PageIndex, ColumnIndex, ColumnsCount);
	Element.Recalculate_Page(0);

	Element.Recalc_CompiledPr();

	// Меняем насильно размер строки и страницы данного параграфа, чтобы у него границы попадания и
	// селект были ровно такие же как и у последней строки предыдущего элемента.
	Element.Pages[0].Y             = ___Y;
	Element.Lines[0].Top           = 0;
	Element.Lines[0].Y             = LastVisibleBounds.BaseLine;
	Element.Lines[0].Bottom        = LastVisibleBounds.H;
	Element.Pages[0].Bounds.Top    = ___Y;
	Element.Pages[0].Bounds.Bottom = ___Y + LastVisibleBounds.H;
};