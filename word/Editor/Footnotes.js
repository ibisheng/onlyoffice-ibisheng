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

	this.Selection = {
		Use      : false,
		Start    : null,
		End      : null,
		Footnotes : {},
		Direction : 0
	};

	this.CurFootnote = null;

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
		this.SeparatorFootnote.Prepare_RecalculateObject();
		this.SeparatorFootnote.Reset(X, CurY, XLimit, 10000);
		this.SeparatorFootnote.Set_StartPage(nPageIndex);
		this.SeparatorFootnote.Recalculate_Page(0, true);
		this.Pages[nPageIndex].SeparatorRecalculateObject = this.SeparatorFootnote.Save_RecalculateObject();

		var Bounds = this.SeparatorFootnote.Get_PageBounds(0);
		CurY += Bounds.Bottom - Bounds.Top;
	}

	for (var nIndex = 0; nIndex < this.Pages[nPageIndex].Elements.length; ++nIndex)
	{
		var Footnote = this.Pages[nPageIndex].Elements[nIndex];
		Footnote.Reset(X, CurY, XLimit, 10000);
		Footnote.Set_StartPage(nPageIndex);

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
		this.SeparatorFootnote.Draw(nPageIndex, pGraphics);
	}

	for (var nIndex = 0; nIndex < this.Pages[nPageIndex].Elements.length; ++nIndex)
	{
		var Footnote = this.Pages[nPageIndex].Elements[nIndex];
		Footnote.Draw(nPageIndex, pGraphics);
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

CFootnotesController.prototype.Refresh_RecalcData2 = function(nRelPageIndex)
{
	var nAbsPageIndex = nRelPageIndex;
	if (this.LogicDocument.Pages[nAbsPageIndex])
	{
		var nIndex = this.LogicDocument.Pages[nAbsPageIndex].Pos;
		this.LogicDocument.Refresh_RecalcData2(nIndex, nAbsPageIndex);
	}
};
CFootnotesController.prototype.Get_PageContentStartPos = function(PageAbs)
{
	//TODO: Реализовать
	return {X : 0, Y : 0, XLimit : 0, YLimit : 0};
};
/**
 * Проверяем попадание в сноски на заданной странице.
 * @param X
 * @param Y
 * @param PageAbs
 * @returns {boolean}
 */
CFootnotesController.prototype.CheckHitInFootnote = function(X, Y, PageAbs)
{
	if (true === this.Is_EmptyPage(PageAbs))
		return false;

	var Page = this.Pages[PageAbs];
	for (var nIndex = 0; nIndex < Page.Elements.length; ++nIndex)
	{
		var Footnote = Page.Elements[nIndex];
		var Bounds   = Footnote.Get_PageBounds(0);

		if (Bounds.Top <= Y)
			return true;
	}


	return false;
};
CFootnotesController.prototype.StartSelection = function(X, Y, PageAbs, MouseEvent)
{
	var oResult = this.private_GetFootnoteByXY(X, Y, PageAbs);
	if (null === oResult)
	{
		// BAD
		this.Selection.Use = false;
		return;
	}

	this.Selection.Use   = true;
	this.Selection.Start = oResult;
	this.Selection.End   = oResult;

	this.Selection.Start.Footnote.Selection_SetStart(X, Y, 0, MouseEvent);

	this.Selection.Start.Pos = {
		X          : X,
		Y          : Y,
		PageAbs    : PageAbs,
		MouseEvent : MouseEvent
	};

	this.Selection.End.Pos = {
		X          : X,
		Y          : Y,
		PageAbs    : PageAbs,
		MouseEvent : MouseEvent
	};

	this.CurFootnote = this.Selection.Start.Footnote;

	this.Selection.Footnotes = {};
	this.Selection.Footnotes[this.Selection.Start.Footnote.Get_Id()] = this.Selection.Start.Footnote;
};
CFootnotesController.prototype.EndSelection = function(X, Y, PageAbs, MouseEvent)
{
	var oResult = this.private_GetFootnoteByXY(X, Y, PageAbs);
	if (null === oResult)
	{
		// BAD
		this.Selection.Use = false;
		return;
	}

	this.Selection.End = oResult;
	this.Selection.End.Pos = {
		X          : X,
		Y          : Y,
		PageAbs    : PageAbs,
		MouseEvent : MouseEvent
	};
	this.CurFootnote = this.Selection.End.Footnote;

	var sStartId = this.Selection.Start.Footnote.Get_Id();
	var sEndId   = this.Selection.End.Footnote.Get_Id();

	// Очищаем старый селект везде кроме начальной сноски
	for (var sFootnoteId in this.Selection.Footnotes)
	{
		if (sFootnoteId !== sStartId)
			this.Selection.Footnotes[sFootnoteId].Selection_Remove();
	}

	// Новый селект
	if (this.Selection.Start.Footnote !== this.Selection.End.Footnote)
	{
		if (this.Selection.Start.Page > this.Selection.EndPage || this.Selection.Start.Index > this.Selection.End.Index)
		{
			this.Selection.Start.Footnote.Selection_SetEnd(-MEASUREMENT_MAX_MM_VALUE, -MEASUREMENT_MAX_MM_VALUE, 0, MouseEvent);
			this.Selection.End.Footnote.Selection_SetStart(MEASUREMENT_MAX_MM_VALUE, MEASUREMENT_MAX_MM_VALUE, 0, this.Selection.Start.Pos.MouseEvent);
		}
		else
		{
			this.Selection.Start.Footnote.Selection_SetEnd(MEASUREMENT_MAX_MM_VALUE, MEASUREMENT_MAX_MM_VALUE, 0, MouseEvent);
			this.Selection.End.Footnote.Selection_SetStart(-MEASUREMENT_MAX_MM_VALUE, -MEASUREMENT_MAX_MM_VALUE, 0, this.Selection.Start.Pos.MouseEvent);
		}
		this.Selection.End.Footnote.Selection_SetEnd(X, Y, 0, MouseEvent);

		var oRange = this.private_GetFootnotesRange(this.Selection.Start, this.Selection.End);
		for (var sFootnoteId in oRange)
		{
			if (sFootnoteId !== sStartId && sFootnoteId !== sEndId)
			{
				var oFootnote = oRange[sFootnoteId];
				oFootnote.Select_All();
			}
		}
		this.Selection.Footnotes = oRange;
	}
	else
	{
		this.Selection.End.Footnote.Selection_SetEnd(X, Y, 0, MouseEvent);
		this.Selection.Footnotes = {};
		this.Selection.Footnotes[this.Selection.Start.Footnote.Get_Id()] = this.Selection.Start.Footnote;
	}
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private area
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
CFootnotesController.prototype.private_GetFootnoteOnPageByXY = function(X, Y, PageAbs)
{
	if (true === this.Is_EmptyPage(PageAbs))
		return null;

	var Page = this.Pages[PageAbs];
	for (var nIndex = Page.Elements.length - 1; nIndex >= 0; --nIndex)
	{
		var Footnote = Page.Elements[nIndex];
		var Bounds   = Footnote.Get_PageBounds(0);

		if (Bounds.Top <= Y || 0 === nIndex)
			return {
				Footnote : Footnote,
				Index    : nIndex,
				Page     : PageAbs
			};
	}



	return null;
};
CFootnotesController.prototype.private_GetFootnoteByXY = function(X, Y, PageAbs)
{
	var oResult = this.private_GetFootnoteOnPageByXY(X, Y, PageAbs);
	if (null !== oResult)
		return oResult;

	var nCurPage = PageAbs - 1;
	while (nCurPage >= 0)
	{
		oResult = this.private_GetFootnoteOnPageByXY(MEASUREMENT_MAX_MM_VALUE, MEASUREMENT_MAX_MM_VALUE, nCurPage);
		if (null !== oResult)
			return oResult;

		nCurPage--;
	}

	nCurPage = PageAbs + 1;
	while (nCurPage < this.Pages.length)
	{
		oResult = this.private_GetFootnoteOnPageByXY(-MEASUREMENT_MAX_MM_VALUE, -MEASUREMENT_MAX_MM_VALUE, nCurPage);
		if (null !== oResult)
			return oResult;

		nCurPage++;
	}

	return null;
};
CFootnotesController.prototype.private_GetFootnotesRange = function(Start, End)
{
	var oResult = [];
	if (Start.Page > End.Page)
	{
		var Temp = Start;
		Start    = End;
		End      = Temp;
	}

	if (Start.Page === End.Page)
	{
		if (Start.Index <= End.Index)
			this.private_GetFootnotesOnPage(Start.Page, Start.Index, End.Index, oResult);
		else
			this.private_GetFootnotesOnPage(Start.Page, End.Index, Start.Index, oResult);
	}
	else
	{
		this.private_GetFootnotesOnPage(Start.Page, Start.Index, -1, oResult);

		for (var CurPage = Start.Page + 1; CurPage <= End.Page - 1; ++CurPage)
		{
			this.private_GetFootnotesOnPage(CurPage, -1, -1, oResult);
		}

		this.private_GetFootnotesOnPage(End.Page, -1, End.Index, oResult);
	}

	return oResult;
};
CFootnotesController.prototype.private_GetFootnotesOnPage = function(PageAbs, StartIndex, EndIndex, oFootnotes)
{
	var Page = this.Pages[PageAbs];
	var _StartIndex = -1 === StartIndex ? 0 : StartIndex;
	var _EndIndex   = -1 === EndIndex ? Page.Elements.length - 1 : EndIndex;
	for (var nIndex = _StartIndex; nIndex <= _EndIndex; ++nIndex)
	{
		var oFootnote = Page.Elements[nIndex];
		oFootnotes[oFootnote.Get_Id()] = oFootnote;
	}
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Controller area
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
CFootnotesController.prototype.CanTargetUpdate = function()
{
	return true;
};
CFootnotesController.prototype.RecalculateCurPos = function()
{
	// TODO: Доделать селект и курсор
	if (null !== this.CurFootnote)
		return this.CurFootnote.RecalculateCurPos();

	return {X : 0, Y : 0, Height : 0, PageNum : 0, Internal : {Line : 0, Page : 0, Range : 0}, Transform : null};
};
CFootnotesController.prototype.GetCurPage = function()
{
	// TODO: Доделать селект и курсор

	if (true === this.Selection.Use)
	{

	}
	else
	{
		if (null !== this.CurFootnote)
			return this.CurFootnote.Get_StartPage_Absolute();
	}

	return -1;
};
CFootnotesController.prototype.AddNewParagraph = function(bRecalculate, bForceAdd)
{
	var bRetValue = false;

	// TODO: Доделать селект и курсор

	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			bRetValue = this.CurFootnote.Add_NewParagraph(bRecalculate, bForceAdd);
	}

	return bRetValue;
};
CFootnotesController.prototype.AddInlineImage = function(nW, nH, oImage, oChart, bFlow)
{
	var bRetValue = false;

	// TODO: Доделать селект и курсор

	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			bRetValue = this.CurFootnote.Add_InlineImage(nW, nH, oImage, oChart, bFlow);
	}

	return bRetValue;
};
CFootnotesController.prototype.AddOleObject = function(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId)
{
	var bRetValue = false;

	// TODO: Доделать селект и курсор

	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			bRetValue = this.CurFootnote.Add_OleObject(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId);
	}

	return bRetValue;
};
CFootnotesController.prototype.AddTextArt = function(nStyle)
{
	var bRetValue = false;

	// TODO: Доделать селект и курсор

	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			bRetValue = this.CurFootnote.Add_TextArt(nStyle);
	}

	return bRetValue;
};
CFootnotesController.prototype.EditChart = function(Chart)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.AddInlineTable = function(Cols, Rows)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Add_InlineTable(Cols, Rows);
	}
};
CFootnotesController.prototype.ClearParagraphFormatting = function()
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Paragraph_ClearFormatting();
	}
};
CFootnotesController.prototype.AddToParagraph = function(oItem, bRecalculate)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Paragraph_Add(oItem, bRecalculate);
	}
};
CFootnotesController.prototype.Remove = function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
	}
};
CFootnotesController.prototype.GetCursorPosXY = function()
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			return this.CurFootnote.Cursor_GetPos();
	}

	return {X : 0, Y : 0}
};
CFootnotesController.prototype.MoveCursorToStartPos = function(AddToSelect)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.MoveCursorToEndPos = function(AddToSelect)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.MoveCursorLeft = function(AddToSelect, Word)
{
	var bRetValue = false;

	// TODO: Доделать селект и курсор

	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			bRetValue = this.CurFootnote.Cursor_MoveLeft(AddToSelect, Word);
	}

	return bRetValue;
};
CFootnotesController.prototype.MoveCursorRight = function(AddToSelect, Word, FromPaste)
{
	var bRetValue = false;

	// TODO: Доделать селект и курсор

	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			bRetValue = this.CurFootnote.Cursor_MoveRight(AddToSelect, Word, FromPaste);
	}

	return bRetValue;
};
CFootnotesController.prototype.MoveCursorUp = function(AddToSelect)
{
	var bRetValue = false;

	// TODO: Доделать селект и курсор

	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			bRetValue = this.CurFootnote.Cursor_MoveUp(AddToSelect);
	}

	return bRetValue;
};
CFootnotesController.prototype.MoveCursorDown = function(AddToSelect)
{
	var bRetValue = false;

	// TODO: Доделать селект и курсор

	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			bRetValue = this.CurFootnote.Cursor_MoveDown(AddToSelect);
	}

	return bRetValue;
};
CFootnotesController.prototype.MoveCursorToEndOfLine = function(AddToSelect)
{
	var bRetValue = false;

	// TODO: Доделать селект и курсор

	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			bRetValue = this.CurFootnote.Cursor_MoveEndOfLine(AddToSelect);
	}

	return bRetValue;
};
CFootnotesController.prototype.MoveCursorToStartOfLine = function(AddToSelect)
{
	var bRetValue = false;

	// TODO: Доделать селект и курсор

	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			bRetValue = this.CurFootnote.Cursor_MoveStartOfLine(AddToSelect);
	}

	return bRetValue;
};
CFootnotesController.prototype.MoveCursorToXY = function(X, Y, PageAbs, AddToSelect)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.MoveCursorToCell = function(bNext)
{
	var bRetValue = false;

	// TODO: Доделать селект и курсор

	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			bRetValue = this.CurFootnote.Cursor_MoveToCell(bNext);
	}

	return bRetValue;
};
CFootnotesController.prototype.SetParagraphAlign = function(Align)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ParagraphAlign(Align);
	}
};
CFootnotesController.prototype.SetParagraphSpacing = function(Spacing)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ParagraphSpacing(Spacing);
	}
};
CFootnotesController.prototype.SetParagraphTabs = function(Tabs)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ParagraphTabs(Tabs);
	}
};
CFootnotesController.prototype.SetParagraphIndent = function(Ind)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ParagraphIndent(Ind);
	}
};
CFootnotesController.prototype.SetParagraphNumbering = function(NumInfo)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ParagraphNumbering(NumInfo);
	}
};
CFootnotesController.prototype.SetParagraphShd = function(Shd)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ParagraphShd(Shd);
	}

};
CFootnotesController.prototype.SetParagraphStyle = function(Name)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ParagraphStyle(Name);
	}
};
CFootnotesController.prototype.SetParagraphContextualSpacing = function(Value)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ParagraphContextualSpacing(Value);
	}
};
CFootnotesController.prototype.SetParagraphPageBreakBefore = function(Value)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ParagraphPageBreakBefore(Value);
	}
};
CFootnotesController.prototype.SetParagraphKeepLines = function(Value)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ParagraphKeepLines(Value);
	}
};
CFootnotesController.prototype.SetParagraphKeepNext = function(Value)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ParagraphKeepNext(Value);
	}
};
CFootnotesController.prototype.SetParagraphWidowControl = function(Value)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ParagraphWidowControl(Value);
	}
};
CFootnotesController.prototype.SetParagraphBorders = function(Borders)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ParagraphBorders(Borders);
	}
};
CFootnotesController.prototype.SetParagraphFramePr = function(FramePr, bDelete)
{
	// TODO: Реализовать, скорее всего ничего тут не надо делать
};
CFootnotesController.prototype.IncreaseOrDecreaseParagraphFontSize = function(bIncrease)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Paragraph_IncDecFontSize(bIncrease);
	}
};
CFootnotesController.prototype.IncreaseOrDecreaseParagraphIndent = function(bIncrease)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Paragraph_IncDecIndent(bIncrease);
	}
};
CFootnotesController.prototype.SetImageProps = function(Props)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_ImageProps(Props);
	}
};
CFootnotesController.prototype.SetTableProps = function(Props)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Set_TableProps(Props);
	}
};
CFootnotesController.prototype.GetCurrentParaPr = function()
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			return this.CurFootnote.Get_Paragraph_ParaPr();
	}

	return null;
};
CFootnotesController.prototype.GetCurrentTextPr = function()
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			return this.CurFootnote.Get_Paragraph_TextPr();
	}

	return null;
};
CFootnotesController.prototype.GetDirectParaPr = function()
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			return this.CurFootnote.Get_Paragraph_ParaPr_Copy();
	}

	return null;
};
CFootnotesController.prototype.GetDirectTextPr = function()
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			return this.CurFootnote.Get_Paragraph_TextPr_Copy();
	}

	return null;
};
CFootnotesController.prototype.RemoveSelection = function(bNoCheckDrawing)
{
	if (true === this.Selection.Use)
	{
		for (var sId in this.Selection.Footnotes)
		{
			this.Selection.Footnotes[sId].Selection_Remove(bNoCheckDrawing);
		}

		this.Selection.Use = false;
	}

	this.Selection.Footnotes = {};
	if (this.CurFootnote)
		this.Selection.Footnotes[this.CurFootnote.Get_Id()] = this.CurFootnote;
};
CFootnotesController.prototype.IsEmptySelection = function(bCheckHidden)
{
	if (true !== this.IsSelectionUse())
		return true;

	var oFootnote = null;
	for (var sId in this.Selection.Footnotes)
	{
		if (null === oFootnote)
			oFootnote = this.Selection.Footnotes[sId];
		else if (oFootnote !== this.Selection.Footnotes[sId])
			return false;
	}

	if (null === oFootnote)
		return true;

	return oFootnote.Selection_IsEmpty(bCheckHidden);
};
CFootnotesController.prototype.DrawSelectionOnPage = function(PageAbs)
{
	if (true !== this.Selection.Use || true === this.Is_EmptyPage(PageAbs))
		return;

	var Page = this.Pages[PageAbs];
	for (var nIndex = 0, nCount = Page.Elements.length; nIndex < nCount; ++nIndex)
	{
		var oFootnote = Page.Elements[nIndex];
		if (oFootnote === this.Selection.Footnotes[oFootnote.Get_Id()])
		{
			var PageRel = oFootnote.GetRelaitivePageIndex(PageAbs);
			oFootnote.Selection_Draw_Page(PageRel);
		}
	}
};
CFootnotesController.prototype.GetSelectionBounds = function()
{
	// TODO: Доделать селект и курсор
	return null;
};
CFootnotesController.prototype.IsMovingTableBorder = function()
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			return this.CurFootnote.Selection_Is_TableBorderMove();
	}

	return false;
};
CFootnotesController.prototype.CheckPosInSelection = function(X, Y, PageAbs, NearPos)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			return this.CurFootnote.Selection_Check(X, Y, PageAbs, NearPos);
	}

	return false;
};
CFootnotesController.prototype.SelectAll = function()
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Select_All();
	}
};
CFootnotesController.prototype.GetSelectedContent = function(SelectedContent)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Get_SelectedContent(SelectedContent);
	}
};
CFootnotesController.prototype.UpdateCursorType = function(X, Y, PageAbs, MouseEvent)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Update_CursorType(X, Y, PageAbs, MouseEvent);
	}
};
CFootnotesController.prototype.PasteFormatting = function(TextPr, ParaPr)
{
	// TODO: Доделать селект и курсор
	if (true === this.Selection.Use)
	{
	}
	else
	{
		if (null !== this.CurFootnote)
			this.CurFootnote.Paragraph_Format_Paste(TextPr, ParaPr, true);
	}
};
CFootnotesController.prototype.IsSelectionUse = function()
{
	return this.Selection.Use;
};
CFootnotesController.prototype.IsTextSelectionUse = function()
{
	// TODO: Реализовать
	return false;
};
CFootnotesController.prototype.GetCurPosXY = function()
{
	// TODO: Реализовать
	return {X : 0, Y : 0};
};
CFootnotesController.prototype.GetSelectedText = function(bClearText)
{
	// TODO: Реализовать
	return "";
};
CFootnotesController.prototype.GetCurrentParagraph = function()
{
	// TODO: Реализовать
	return null;
};
CFootnotesController.prototype.GetSelectedElementsInfo = function(oInfo)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.AddTableRow = function(bBefore)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.AddTableCol = function(bBefore)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.RemoveTableRow = function()
{
	// TODO: Реализовать
};
CFootnotesController.prototype.RemoveTableCol = function()
{
	// TODO: Реализовать
};
CFootnotesController.prototype.MergeTableCells = function()
{
	// TODO: Реализовать
};
CFootnotesController.prototype.SplitTableCells = function(Cols, Rows)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.RemoveTable = function()
{
	// TODO: Реализовать
};
CFootnotesController.prototype.SelectTable = function(Type)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.CanMergeTableCells = function()
{
	// TODO: Реализовать
	return false;
};
CFootnotesController.prototype.CanSplitTableCells = function()
{
	// TODO: Реализовать
	return false;
};
CFootnotesController.prototype.UpdateInterfaceState = function()
{
	// TODO: Реализовать
};
CFootnotesController.prototype.UpdateRulersState = function()
{
	// TODO: Реализовать
};
CFootnotesController.prototype.UpdateSelectionState = function()
{
	// TODO: Надо подумать как это вынести в верхнюю функцию
	if (true === this.Selection.Use)
	{
		// TODO: Обработать движения границ таблицы
		if (false === this.IsEmptySelection())
		{
			if (true !== this.LogicDocument.Selection.Start)
			{
				this.LogicDocument.Internal_CheckCurPage();
				this.RecalculateCurPos();
			}

			this.LogicDocument.private_UpdateTracks(true, false);

			this.DrawingDocument.TargetEnd();
			this.DrawingDocument.SelectEnabled(true);
			this.DrawingDocument.SelectShow();
		}
		else
		{
			if (true !== this.LogicDocument.Selection.Start)
				this.LogicDocument.Selection_Remove();

			this.LogicDocument.Internal_CheckCurPage();
			this.RecalculateCurPos();
			this.LogicDocument.private_UpdateTracks(true, true);

			this.DrawingDocument.SelectEnabled(false);
			this.DrawingDocument.TargetStart();
			this.DrawingDocument.TargetShow();
		}
	}
	else
	{
		this.LogicDocument.Selection_Remove();
		this.LogicDocument.Internal_CheckCurPage();
		this.RecalculateCurPos();
		this.LogicDocument.private_UpdateTracks(false, false);

		this.DrawingDocument.SelectEnabled(false);
		this.DrawingDocument.TargetShow();
	}

};
CFootnotesController.prototype.GetSelectionState = function()
{
	// TODO: Реализовать
	return [];
};
CFootnotesController.prototype.SetSelectionState = function(State, StateIndex)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.AddHyperlink = function(Props)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.ModifyHyperlink = function(Props)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.RemoveHyperlink = function()
{
	// TODO: Реализовать
};
CFootnotesController.prototype.CanAddHyperlink = function(bCheckInHyperlink)
{
	// TODO: Реализовать
	return false;
};
CFootnotesController.prototype.IsCursorInHyperlink = function(bCheckEnd)
{
	// TODO: Реализовать
	return null;
};
CFootnotesController.prototype.AddComment = function(Comment)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.CanAddComment = function()
{
	// TODO: Реализовать
};
CFootnotesController.prototype.GetSelectionAnchorPos = function()
{
	// TODO: Реализовать
	return {
		X0   : 0,
		Y    : 0,
		X1   : 0,
		Page : 0
	};
};
CFootnotesController.prototype.StartSelectionFromCurPos = function()
{
	// TODO: Реализовать
};
CFootnotesController.prototype.SaveDocumentStateBeforeLoadChanges = function(State)
{
	// TODO: Реализовать
};
CFootnotesController.prototype.RestoreDocumentStateAfterLoadChanges = function(State)
{
	// TODO: Реализовать
};



function CFootEndnotePage()
{
	this.X      = 0;
	this.Y      = 0;
	this.XLimit = 0;
	this.YLimit = 0;

	this.Elements = [];

	this.SeparatorRecalculateObject             = null;
	this.ContinuationSeparatorRecalculateObject = null;
	this.ContinuationNoticeRecalculateObject    = null;
}
CFootEndnotePage.prototype.Reset = function()
{
	this.X      = 0;
	this.Y      = 0;
	this.XLimit = 0;
	this.YLimit = 0;

	this.Elements = [];

	this.SeparatorRecalculateObject             = null;
	this.ContinuationSeparatorRecalculateObject = null;
	this.ContinuationNoticeRecalculateObject    = null;
};





