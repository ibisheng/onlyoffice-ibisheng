/*
 * (c) Copyright Ascensio System SIA 2010-2016
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
/**
 * Находим отрезок сносок, заданный между сносками.
 * @param {?CFootEndnote} oFirstFootnote - если null, то иещм с начала документа
 * @param {?CFootEndnote} oLastFootnote - если null, то ищем до конца документа
 */
CDocumentContentBase.prototype.Get_FootnotesList = function(oFirstFootnote, oLastFootnote)
{
	var oEngine = new CDocumentFootnotesRangeEngine();
	oEngine.Init(oFirstFootnote, oLastFootnote);

	var arrFootnotes = [];

	var arrParagraphs = this.Get_AllParagraphs({OnlyMainDocument : true, All : true});
	for (var nIndex = 0, nCount = arrParagraphs.length; nIndex < nCount; ++nIndex)
	{
		var oParagraph = arrParagraphs[nIndex];

		if (true === oParagraph.Get_FootnotesList(oEngine))
			return arrFootnotes;
	}

	return oEngine.GetRange();
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