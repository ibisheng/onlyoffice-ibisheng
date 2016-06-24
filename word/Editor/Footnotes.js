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
 * Класс, работающий со сносками документа.
 * @param {CDocument} LogicDocument - Ссылка на главный документ.
 * @constructor
 * @extends {CDocumentControllerBase}
 */
function CFootnotesController(LogicDocument)
{
	CFootnotesController.superclass.constructor.call(this, LogicDocument);

	this.Id = LogicDocument.Get_IdCounter().Get_NewId();

	this.Footnote = {}; // Список всех сносок с ключом - Id.
	this.Pages    = [];

	// Специальные сноски
	this.ContinuationNoticeFootnote    = null;
	this.ContinuationSeparatorFootnote = null;
	this.SeparatorFootnote             = null;

	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	LogicDocument.Get_TableId().Add(this, this.Id);
}

AscCommon.extendClass(CFootnotesController, CDocumentControllerBase);

/**
 * Получаем Id данного класса.
 */
CFootnotesController.prototype.Get_Id = function()
{
	return this.Id;
};
/**
 * Начальная инициализация после загрузки всех файлов.
 */
CFootnotesController.prototype.Init = function()
{
	this.SeparatorFootnote = new CFootEndnote(this);
	this.SeparatorFootnote.Paragraph_Add(new ParaSeparator(), false);
	var oParagraph = this.SeparatorFootnote.Get_ElementByIndex(0);
	oParagraph.Set_Spacing({After : 0, Line : 1, LineRule : Asc.linerule_Auto}, false);
};
/**
 * Создаем новую сноску.
 * @returns {CFootEndnote}
 */
CFootnotesController.prototype.Create_Footnote = function()
{
	var NewFootnote                     = new CFootEndnote(this);
	this.Footnote[NewFootnote.Get_Id()] = NewFootnote;
	return NewFootnote;
};
/**
 * Сбрасываем рассчетные данный для заданной страницы.
 * @param {number} nPageIndex
 */
CFootnotesController.prototype.Reset = function(nPageIndex)
{
	if (!this.Pages[nPageIndex])
		this.Pages[nPageIndex] = new CFootEndnotePage();

	this.Pages[nPageIndex].Reset();
};
/**
 * Пересчитываем сноски на заданной странице.
 */
CFootnotesController.prototype.Recalculate = function(nPageIndex, X, XLimit, Y, YLimit)
{
	if (!this.Pages[nPageIndex])
		this.Pages[nPageIndex] = new CFootEndnotePage();

	if (true === this.Is_EmptyPage(nPageIndex))
		return;

	// Мы пересчет начинаем с 0, потом просто делаем сдвиг, через функцию Shift.

	var CurY = Y;

	if (null !== this.SeparatorFootnote)
	{
		this.SeparatorFootnote.Reset(X, CurY, XLimit, 10000);
		this.SeparatorFootnote.Recalculate_Page(0, true);
		this.Pages[nPageIndex].SeparatorRecalculateObject = this.SeparatorFootnote.Save_RecalculateObject();

		var Bounds = this.SeparatorFootnote.Get_PageBounds(0);
		CurY += Bounds.Bottom - Bounds.Top;
	}

	for (var nIndex = 0; nIndex < this.Pages[nPageIndex].Elements.length; ++nIndex)
	{
		var Footnote = this.Pages[nPageIndex].Elements[nIndex];
		Footnote.Reset(X, CurY, XLimit, 10000);

		var CurPage      = 0;
		var RecalcResult = recalcresult2_NextPage;
		while (recalcresult2_End != RecalcResult)
			RecalcResult = Footnote.Recalculate_Page(CurPage++, true);

		var Bounds = Footnote.Get_PageBounds(0);
		CurY += Bounds.Bottom - Bounds.Top;
	}
};
/**
 * Получаем суммарную высоту, занимаемую сносками на заданной странице.
 * @param {number} nPageIndex
 * @returns {number}
 */
CFootnotesController.prototype.Get_Height = function(nPageIndex)
{
	if (true === this.Is_EmptyPage(nPageIndex))
		return 0;

	var nHeight = 0;

	if (null !== this.SeparatorFootnote)
	{
		var Bounds = this.SeparatorFootnote.Get_PageBounds(0);
		nHeight += Bounds.Bottom - Bounds.Top;
	}

	for (var nIndex = 0; nIndex < this.Pages[nPageIndex].Elements.length; ++nIndex)
	{
		var Footnote = this.Pages[nPageIndex].Elements[nIndex];
		var Bounds   = Footnote.Get_PageBounds(0);
		nHeight += Bounds.Bottom - Bounds.Top;
	}

	return nHeight;
};
/**
 * Отрисовываем сноски на заданной странице.
 * @param {number} nPageIndex
 * @param {CGraphics} pGraphics
 */
CFootnotesController.prototype.Draw = function(nPageIndex, pGraphics)
{
	if (true === this.Is_EmptyPage(nPageIndex))
		return;

	if (null !== this.SeparatorFootnote && null !== this.Pages[nPageIndex].SeparatorRecalculateObject)
	{
		this.SeparatorFootnote.Load_RecalculateObject(this.Pages[nPageIndex].SeparatorRecalculateObject);
		this.SeparatorFootnote.Draw(0, pGraphics);
	}

	for (var nIndex = 0; nIndex < this.Pages[nPageIndex].Elements.length; ++nIndex)
	{
		var Footnote = this.Pages[nPageIndex].Elements[nIndex];
		Footnote.Draw(0, pGraphics);
	}
};
/**
 * Сдвигаем все рассчитанные позиции на заданной странице.
 * @param {number} nPageIndex
 * @param {number} dX
 * @param {number} dY
 */
CFootnotesController.prototype.Shift = function(nPageIndex, dX, dY)
{
	if (true === this.Is_EmptyPage(nPageIndex))
		return;

	if (null !== this.SeparatorFootnote && null !== this.Pages[nPageIndex].SeparatorRecalculateObject)
	{
		this.SeparatorFootnote.Load_RecalculateObject(this.Pages[nPageIndex].SeparatorRecalculateObject);
		this.SeparatorFootnote.Shift(0, dX, dY);
		this.Pages[nPageIndex].SeparatorRecalculateObject = this.SeparatorFootnote.Save_RecalculateObject();
	}

	for (var nIndex = 0; nIndex < this.Pages[nPageIndex].Elements.length; ++nIndex)
	{
		var Footnote = this.Pages[nPageIndex].Elements[nIndex];
		Footnote.Shift(0, dX, dY);
	}
};
/**
 * Добавляем заданную сноску на страницу для пересчета.
 * @param {number} nPageIndex
 * @param {CFootEndnote} oFootnote
 */
CFootnotesController.prototype.Add_FootnoteOnPage = function(nPageIndex, oFootnote)
{
	if (!this.Pages[nPageIndex])
		this.Pages[nPageIndex] = new CFootEndnotePage();

	this.Pages[nPageIndex].Elements.push(oFootnote);
};
/**
 * Проверяем, используется заданная сноска в документе.
 * @param {string} sFootnoteId
 * @returns {boolean}
 */
CFootnotesController.prototype.Is_UseInDocument = function(sFootnoteId)
{
	// TODO: Надо бы еще проверить, если ли в документе ссылка на данную сноску.
	for (var sId in this.Footnote)
	{
		if (sId === sFootnoteId)
			return true;
	}

	return false;
};
/**
 * Проверяем пустая ли страница.
 * @param {number} nPageIndex
 * @returns {boolean}
 */
CFootnotesController.prototype.Is_EmptyPage = function(nPageIndex)
{
	if (!this.Pages[nPageIndex] || this.Pages[nPageIndex].Elements.length <= 0)
		return true;

	return false;
};

function CFootEndnotePage()
{
	this.X      = 0;
	this.Y      = 0;
	this.XLimit = 0;
	this.YLimit = 0;

	this.Elements = [];

	this.SeparatorRecalcObject             = null;
	this.ContinuationSeparatorRecalcObject = null;
	this.ContinuationNoticeRecalcObject    = null;
}
CFootEndnotePage.prototype.Reset = function()
{
	this.X      = 0;
	this.Y      = 0;
	this.XLimit = 0;
	this.YLimit = 0;

	this.Elements = [];

	this.SeparatorRecalcObject             = null;
	this.ContinuationSeparatorRecalcObject = null;
	this.ContinuationNoticeRecalcObject    = null;
};





