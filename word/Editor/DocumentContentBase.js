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
 * Базовый класс для работы с содержимым документа (параграфы и таблицы).
 * @constructor
 */
function CDocumentContentBase()
{
	this.Id = null;

	this.StartPage = 0; // Номер стартовой страницы в родительском классе
	this.CurPage   = 0; // Номер текущей страницы

	this.Content = [];

	this.ReindexStartPos = 0;
}
CDocumentContentBase.prototype.Get_Id = function()
{
	return this.GetId();
};
CDocumentContentBase.prototype.GetId = function()
{
	return this.Id;
};
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
CDocumentContentBase.prototype.GetAllDrawingObjects = function(arrDrawings)
{
	if (undefined === arrDrawings || null === arrDrawings)
		arrDrawings = [];

	if (this instanceof CDocument)
	{
		this.SectionsInfo.GetAllDrawingObjects(arrDrawings);
	}

	for (var nPos = 0, nCount = this.Content.length; nPos < nCount; ++nPos)
	{
		this.Content[nPos].GetAllDrawingObjects(arrDrawings);
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

	var arrDrawings = this.GetAllDrawingObjects();
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
	var arrDrawings = this.GetAllDrawingObjects();
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

	var arrParagraphs = this.GetAllParagraphs({OnlyMainDocument : true, All : true});
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
/**
 * Передвигаем курсор (от текущего положения) к началу ссылки на сноску
 * @param isNext двигаемся вперед или назад
 * @param isCurrent находимся ли мы в текущем объекте
 * @returns {boolean}
 * @constructor
 */
CDocumentContentBase.prototype.GotoFootnoteRef = function(isNext, isCurrent)
{
	var nCurPos = 0;

	if (true === isCurrent)
	{
		if (true === this.Selection.Use)
			nCurPos = Math.min(this.Selection.StartPos, this.Selection.EndPos);
		else
			nCurPos = this.CurPos.ContentPos;
	}
	else
	{
		if (isNext)
			nCurPos = 0;
		else
			nCurPos = this.Content.length - 1;
	}

	if (isNext)
	{
		for (var nIndex = nCurPos, nCount = this.Content.length; nIndex < nCount; ++nIndex)
		{
			var oElement = this.Content[nIndex];
			if (oElement.GotoFootnoteRef(true, true === isCurrent && nIndex === nCurPos))
				return true;
		}
	}
	else
	{
		for (var nIndex = nCurPos; nIndex >= 0; --nIndex)
		{
			var oElement = this.Content[nIndex];
			if (oElement.GotoFootnoteRef(false, true === isCurrent && nIndex === nCurPos))
				return true;
		}
	}

	return false;
};
CDocumentContentBase.prototype.MoveCursorToNearestPos = function(oNearestPos)
{
	var oPara = oNearestPos.Paragraph;
	var oParent = oPara.Parent;
	if (oParent)
	{
		var oTopDocument = oParent.Is_TopDocument(true);
		if (oTopDocument)
			oTopDocument.RemoveSelection();
	}

	oPara.Set_ParaContentPos(oNearestPos.ContentPos, true, -1, -1);
	oPara.Document_SetThisElementCurrent(true);
};
CDocumentContentBase.prototype.private_CreateNewParagraph = function()
{
	var oPara = new Paragraph(this.DrawingDocument, this, this.bPresentation === true);
	oPara.Correct_Content();
	oPara.MoveCursorToStartPos(false);
	return oPara;
};
CDocumentContentBase.prototype.StopSelection = function()
{
	if (true !== this.Selection.Use)
		return;

	this.Selection.Start = false;

	if (this.Content[this.Selection.StartPos])
		this.Content[this.Selection.StartPos].StopSelection();
};
CDocumentContentBase.prototype.GetNumberingInfo = function(NumberingEngine, ParaId, NumPr)
{
	if (undefined === NumberingEngine || null === NumberingEngine)
		NumberingEngine = new CDocumentNumberingInfoEngine(ParaId, NumPr, this.Get_Numbering());

	for (var nIndex = 0, nCount = this.Content.length; nIndex < nCount; ++nIndex)
	{
		this.Content[nIndex].GetNumberingInfo(NumberingEngine);
		if (true === NumberingEngine.Is_Found())
			break;
	}

	return NumberingEngine.Get_NumInfo();
};
CDocumentContentBase.prototype.private_Remove = function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
{
	if (this.CurPos.ContentPos < 0)
		return false;

	this.Remove_NumberingSelection();

	var bRetValue = true;
	if (true === this.Selection.Use)
	{
		var StartPos = this.Selection.StartPos;
		var EndPos   = this.Selection.EndPos;
		if (EndPos < StartPos)
		{
			var Temp = StartPos;
			StartPos = EndPos;
			EndPos   = Temp;
		}

		// Проверим, пустой ли селект в конечном элементе (для случая, когда конечный элемент параграф, и в нем
		// не заселекчен знак конца параграфа)
		if (StartPos !== EndPos && true === this.Content[EndPos].IsSelectionEmpty(true))
			EndPos--;

		if (true === this.Is_TrackRevisions())
		{
			// Если есть параграфы, которые были добавлены во время рецензирования, тогда мы их удаляем
			for (var Index = StartPos; Index <= EndPos; Index++)
			{
				this.Content[Index].Remove(1, true);
			}

			this.RemoveSelection();
			for (var Index = EndPos - 1; Index >= StartPos; Index--)
			{
				if (type_Paragraph === this.Content[Index].GetType() && reviewtype_Add === this.Content[Index].GetReviewType())
				{
					// Если параграф пустой, тогда удаляем параграф, если не пустой, тогда объединяем его со
					// следующим параграф. Если следующий элемент таблица, тогда ничего не делаем.
					if (this.Content[Index].IsEmpty())
					{
						this.Internal_Content_Remove(Index, 1);
					}
					else if (Index < this.Content.length - 1 && type_Paragraph === this.Content[Index + 1].GetType())
					{
						this.Content[Index].Concat(this.Content[Index + 1]);
						this.Internal_Content_Remove(Index + 1, 1);
					}
				}
				else
				{
					this.Content[Index].SetReviewType(reviewtype_Remove);
				}
			}

			this.CurPos.ContentPos = StartPos;
		}
		else
		{
			this.Selection.Use      = false;
			this.Selection.StartPos = 0;
			this.Selection.EndPos   = 0;

			if (StartPos !== EndPos)
			{
				var StartType = this.Content[StartPos].GetType();
				var EndType   = this.Content[EndPos].GetType();

				var bStartEmpty = false, bEndEmpty = false;
				if (type_Paragraph === StartType || type_BlockLevelSdt === StartType)
				{
					this.Content[StartPos].Remove(1, true);
					bStartEmpty = this.Content[StartPos].IsEmpty()
				}
				else if (type_Table === StartType)
				{
					bStartEmpty = !(this.Content[StartPos].Row_Remove2());
				}

				if (type_Paragraph === EndType || type_BlockLevelSdt === EndType)
				{
					this.Content[EndPos].Remove(1, true);
					bEndEmpty = this.Content[EndPos].IsEmpty()
				}
				else if (type_Table === EndType)
				{
					bEndEmpty = !(this.Content[EndPos].Row_Remove2());
				}

				if (!bStartEmpty && !bEndEmpty)
				{
					this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos - 1);
					this.CurPos.ContentPos = StartPos;

					if (type_Paragraph === StartType && type_Paragraph === EndType && true === bOnTextAdd)
					{
						// Встаем в конец параграфа и удаляем 1 элемент (чтобы соединить параграфы)
						this.Content[StartPos].MoveCursorToEndPos(false, false);
						this.Remove(1, true);
					}
					else
					{
						if (true === bOnTextAdd && type_Paragraph !== this.Content[StartPos + 1].GetType() && type_Paragraph !== this.Content[StartPos].GetType())
						{
							this.Internal_Content_Add(StartPos + 1, this.private_CreateNewParagraph());
							this.CurPos.ContentPos = StartPos + 1;
							this.Content[StartPos + 1].MoveCursorToStartPos(false);
						}
						else if (true === bOnTextAdd && type_Paragraph !== this.Content[StartPos + 1].GetType())
						{
							this.CurPos.ContentPos = StartPos;
							this.Content[StartPos].MoveCursorToEndPos(false, false);
						}
						else
						{
							this.CurPos.ContentPos = StartPos + 1;
							this.Content[StartPos + 1].MoveCursorToStartPos(false);
						}
					}
				}
				else if (!bStartEmpty)
				{
					if (true === bOnTextAdd && type_Table === StartType)
					{
						if (EndType !== type_Paragraph)
							this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos);
						else
							this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos - 1);

						if (type_Table === this.Content[StartPos + 1].GetType() && true === bOnTextAdd)
							this.Internal_Content_Add(StartPos + 1, this.private_CreateNewParagraph());

						this.CurPos.ContentPos = StartPos + 1;
						this.Content[StartPos + 1].MoveCursorToStartPos(false);
					}
					else
					{
						this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos);

						if (type_Table == StartType)
						{
							// У нас обязательно есть элемент после таблицы (либо снова таблица, либо параграф)
							// Встаем в начало следующего элемента.
							this.CurPos.ContentPos = StartPos + 1;
							this.Content[StartPos + 1].MoveCursorToStartPos(false);
						}
						else
						{
							this.CurPos.ContentPos = StartPos;
							this.Content[StartPos].MoveCursorToEndPos(false, false);
						}
					}
				}
				else if (!bEndEmpty)
				{
					this.Internal_Content_Remove(StartPos, EndPos - StartPos);

					if (type_Table === this.Content[StartPos].GetType() && true === bOnTextAdd)
						this.Internal_Content_Add(StartPos, this.private_CreateNewParagraph());

					this.CurPos.ContentPos = StartPos;
					this.Content[StartPos].MoveCursorToStartPos(false);
				}
				else
				{
					if (true === bOnTextAdd)
					{
						// Удаляем весь промежуточный контент, начальный элемент и конечный элемент, если это
						// таблица, поскольку таблица не может быть последним элементом в документе удаляем без проверок.
						if (type_Paragraph !== EndType)
							this.Internal_Content_Remove(StartPos, EndPos - StartPos + 1);
						else
							this.Internal_Content_Remove(StartPos, EndPos - StartPos);

						if (type_Table === this.Content[StartPos].GetType() && true === bOnTextAdd)
							this.Internal_Content_Add(StartPos, this.private_CreateNewParagraph());

						this.CurPos.ContentPos = StartPos;
						this.Content[StartPos].MoveCursorToStartPos();
					}
					else
					{
						// Удаляем весь промежуточный контент, начальный и конечный параграфы
						// При таком удалении надо убедиться, что в документе останется хотя бы один элемент
						if (0 === StartPos && (EndPos - StartPos + 1) >= this.Content.length)
						{
							this.Internal_Content_Add(0, this.private_CreateNewParagraph());
							this.Internal_Content_Remove(1, this.Content.length - 1);
							bRetValue = false;
						}
						else
						{
							this.Internal_Content_Remove(StartPos, EndPos - StartPos + 1);
						}

						// Выставляем текущую позицию
						if (StartPos >= this.Content.length)
						{
							this.CurPos.ContentPos = this.Content.length - 1;
							this.Content[this.CurPos.ContentPos].MoveCursorToEndPos(false, false);
						}
						else
						{
							this.CurPos.ContentPos = StartPos;
							this.Content[StartPos].MoveCursorToStartPos(false);
						}
					}
				}
			}
			else
			{
				this.CurPos.ContentPos = StartPos;
				if (Count < 0 && type_Table === this.Content[StartPos].GetType() && true === this.Content[StartPos].IsCellSelection() && true != bOnTextAdd)
				{
					this.RemoveTableRow();
				}
				else if (false === this.Content[StartPos].Remove(Count, true, bRemoveOnlySelection, bOnTextAdd))
				{
					// При добавлении текста, параграф не объединяется
					if (true !== bOnTextAdd)
					{
						// В ворде параграфы объединяются только когда у них все настройки совпадают.
						// (почему то при изменении и обратном изменении настроек параграфы перестают объединятся)
						// Пока у нас параграфы будут объединяться всегда и настройки будут браться из первого
						// параграфа, кроме случая, когда первый параграф полностью удаляется.

						if (true === this.Content[StartPos].IsEmpty() && this.Content.length > 1)
						{
							this.Internal_Content_Remove(StartPos, 1);

							// Выставляем текущую позицию
							if (StartPos >= this.Content.length)
							{
								// Документ не должен заканчиваться таблицей, поэтому здесь проверку не делаем
								this.CurPos.ContentPos = this.Content.length - 1;
								this.Content[this.CurPos.ContentPos].MoveCursorToEndPos(false, false);
							}
							else
							{
								this.CurPos.ContentPos = StartPos;
								this.Content[StartPos].MoveCursorToStartPos(false);
							}
						}
						else if (this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph === this.Content[this.CurPos.ContentPos].GetType() && type_Paragraph === this.Content[this.CurPos.ContentPos + 1].GetType())
						{
							// Соединяем текущий и предыдущий параграфы
							this.Content[StartPos].Concat(this.Content[StartPos + 1]);
							this.Internal_Content_Remove(StartPos + 1, 1);
						}
						else if (this.Content.length === 1 && true === this.Content[0].IsEmpty())
						{
							if (Count > 0)
							{
								this.Internal_Content_Add(0, this.private_CreateNewParagraph());
								this.Internal_Content_Remove(1, this.Content.length - 1);
							}

							bRetValue = false;
						}
					}
				}
			}
		}
	}
	else
	{
		if (true === bRemoveOnlySelection || true === bOnTextAdd)
			return true;

		if (type_Paragraph == this.Content[this.CurPos.ContentPos].GetType())
		{
			if (false === this.Content[this.CurPos.ContentPos].Remove(Count, bOnlyText))
			{
				if (Count < 0)
				{
					if (this.CurPos.ContentPos > 0 && type_Paragraph == this.Content[this.CurPos.ContentPos - 1].GetType())
					{
						var CurrFramePr = this.Content[this.CurPos.ContentPos].Get_FramePr();
						var PrevFramePr = this.Content[this.CurPos.ContentPos - 1].Get_FramePr();

						if ((undefined === CurrFramePr && undefined === PrevFramePr) || (undefined !== CurrFramePr && undefined !== PrevFramePr && true === CurrFramePr.Compare(PrevFramePr)))
						{
							if (true === this.Is_TrackRevisions() && reviewtype_Add !== this.Content[this.CurPos.ContentPos - 1].GetReviewType())
							{
								this.Content[this.CurPos.ContentPos - 1].SetReviewType(reviewtype_Remove);
								this.CurPos.ContentPos--;
								this.Content[this.CurPos.ContentPos].MoveCursorToEndPos(false, false);
							}
							else
							{
								if (true === this.Content[this.CurPos.ContentPos - 1].IsEmpty() && undefined === this.Content[this.CurPos.ContentPos - 1].Numbering_Get())
								{
									// Просто удаляем предыдущий параграф
									this.Internal_Content_Remove(this.CurPos.ContentPos - 1, 1);
									this.CurPos.ContentPos--;
									this.Content[this.CurPos.ContentPos].MoveCursorToStartPos(false);
								}
								else
								{
									// Соединяем текущий и предыдущий параграфы
									var Prev = this.Content[this.CurPos.ContentPos - 1];

									// Смещаемся в конец до объединения параграфов, чтобы курсор стоял в месте
									// соединения.
									Prev.MoveCursorToEndPos(false, false);

									// Запоминаем новую позицию курсора, после совмещения параграфов
									Prev.Concat(this.Content[this.CurPos.ContentPos]);
									this.Internal_Content_Remove(this.CurPos.ContentPos, 1);
									this.CurPos.ContentPos--;
								}
							}
						}
					}
				}
				else if (Count > 0)
				{
					if (this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1].GetType())
					{
						var CurrFramePr = this.Content[this.CurPos.ContentPos].Get_FramePr();
						var NextFramePr = this.Content[this.CurPos.ContentPos + 1].Get_FramePr();

						if ((undefined === CurrFramePr && undefined === NextFramePr) || ( undefined !== CurrFramePr && undefined !== NextFramePr && true === CurrFramePr.Compare(NextFramePr) ))
						{
							if (true === this.Is_TrackRevisions() && reviewtype_Add !== this.Content[this.CurPos.ContentPos].Get_ReviewType())
							{
								this.Content[this.CurPos.ContentPos].SetReviewType(reviewtype_Remove);
								this.CurPos.ContentPos++;
								this.Content[this.CurPos.ContentPos].MoveCursorToStartPos(false);
							}
							else
							{
								if (true === this.Content[this.CurPos.ContentPos].IsEmpty())
								{
									// Просто удаляем текущий параграф
									this.Internal_Content_Remove(this.CurPos.ContentPos, 1);
									this.Content[this.CurPos.ContentPos].MoveCursorToStartPos(false);
								}
								else
								{
									// Соединяем текущий и следующий параграфы
									var Cur = this.Content[this.CurPos.ContentPos];
									Cur.Concat(this.Content[this.CurPos.ContentPos + 1]);
									this.Internal_Content_Remove(this.CurPos.ContentPos + 1, 1);
								}
							}
						}
					}
					else if (true == this.Content[this.CurPos.ContentPos].IsEmpty() && this.CurPos.ContentPos == this.Content.length - 1 && this.CurPos.ContentPos != 0 && type_Paragraph === this.Content[this.CurPos.ContentPos - 1].GetType())
					{
						// Если данный параграф пустой, последний, не единственный и идущий перед
						// ним элемент не таблица, удаляем его
						this.Internal_Content_Remove(this.CurPos.ContentPos, 1);
						this.CurPos.ContentPos--;
						this.Content[this.CurPos.ContentPos].MoveCursorToEndPos(false, false);
					}
				}
			}

			var Item = this.Content[this.CurPos.ContentPos];
			if (type_Paragraph === Item.GetType())
			{
				Item.CurPos.RealX = Item.CurPos.X;
				Item.CurPos.RealY = Item.CurPos.Y;
			}
		}
		else
		{
			this.Content[this.CurPos.ContentPos].Remove(Count, bOnlyText);
		}
	}

	return bRetValue;
};
CDocumentContentBase.prototype.IsBlockLevelSdtContent = function()
{
	return false;
};
CDocumentContentBase.prototype.private_AddContentControl = function()
{
	// Селекта быть не должно при выполнении данной функции, поэтому не проверяем
	var oElement = this.Content[this.CurPos.ContentPos];

	if (type_Paragraph === oElement.GetType())
	{
		var oSdt = new CBlockLevelSdt(editor.WordControl.m_oLogicDocument, this);
		if (oElement.IsCursorAtEnd())
		{
			this.Internal_Content_Add(this.CurPos.ContentPos + 1, oSdt);
			this.CurPos.ContentPos = this.CurPos.ContentPos + 1;
		}
		else if (oElement.IsCursorAtBegin())
		{
			this.Internal_Content_Add(this.CurPos.ContentPos, oSdt);
		}
		else
		{
			var oNewParagraph = new Paragraph(this.DrawingDocument, this);
			oElement.Split(oNewParagraph);

			this.Internal_Content_Add(this.CurPos.ContentPos + 1, oSdt);
			this.Internal_Content_Add(this.CurPos.ContentPos + 2, oNewParagraph);

			this.CurPos.ContentPos = this.CurPos.ContentPos + 1;
		}
		oSdt.MoveCursorToStartPos(false);
		return oSdt;
	}
	else
	{
		return oElement.AddContentControl();
	}
};
CDocumentContentBase.prototype.RecalculateAllTables = function()
{
	for (var nPos = 0, nCount = this.Content.length; nPos < nCount; ++nPos)
	{
		var Item = this.Content[nPos];
		Item.RecalculateAllTables();
	}
};