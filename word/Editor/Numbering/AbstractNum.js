/*
 * (c) Copyright Ascensio System SIA 2010-2018
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
 * User: Ilja.Kirillov
 * Date: 08.05.2018
 * Time: 15:08
 */

// Import
var g_oTextMeasurer = AscCommon.g_oTextMeasurer;
var History         = AscCommon.History;

/**
 * Класс реализующий w:abstractNum
 * @constructor
 */
function CAbstractNum()
{
	this.Id = AscCommon.g_oIdCounter.Get_NewId();

	this.Lock = new AscCommon.CLock();
	if (false === AscCommon.g_oIdCounter.m_bLoad)
	{
		this.Lock.Set_Type(AscCommon.locktype_Mine, false);
		if (typeof AscCommon.CollaborativeEditing !== "undefined")
			AscCommon.CollaborativeEditing.Add_Unlock2(this);
	}

	this.NumStyleLink = undefined;
	this.StyleLink    = undefined;

	this.Lvl = [];
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		this.Lvl[nLvl] = new CNumberingLvl();
		this.Lvl[nLvl].InitDefault(nLvl);
	}

	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	AscCommon.g_oTableId.Add(this, this.Id);
}

CAbstractNum.prototype.Get_Id = function()
{
	return this.Id;
};
CAbstractNum.prototype.GetId = function()
{
	return this.Id;
};
CAbstractNum.prototype.Copy = function(oAbstractNum)
{
	this.SetStyleLink(oAbstractNum.StyleLink);
	this.SetNumStyleLink(oAbstractNum.NumStyleLink);

	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvlNew = oAbstractNum.Lvl[nLvl].Copy();
		var oLvlOld = this.Lvl[nLvl];

		History.Add(new CChangesAbstractNumLvlChange(this, oLvlOld, oLvlNew, nLvl));
		this.Lvl[nLvl] = oLvlNew;
	}
};
CAbstractNum.prototype.SetStyleLink = function(sValue)
{
	if (sValue !== this.StyleLink)
	{
		History.Add(new CChangesAbstractNumStyleLink(this, this.StyleLink, sValue));
		this.StyleLink = sValue;
	}
};
CAbstractNum.prototype.GetStyleLink = function()
{
	return this.StyleLink;
};
CAbstractNum.prototype.SetNumStyleLink = function(sValue)
{
	if (sValue !== this.NumStyleLink)
	{
		History.Add(new CChangesAbstractNumNumStyleLink(this, this.NumStyleLink, sValue));
		this.NumStyleLink = sValue;
	}
};
CAbstractNum.prototype.GetNumStyleLink = function()
{
	return this.NumStyleLink;
};
/**
 * Сдвигаем все уровни на заданное значение (оно задается для нулевого уровня)
 * @param nLeftNew {number}
 */
CAbstractNum.prototype.ShiftLeftInd = function(nLeftNew)
{
	var nLeftOld = this.Lvl[0].ParaPr.Ind.Left ? this.Lvl[0].ParaPr.Ind.Left : 0;
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvlNew = this.Lvl[nLvl];
		var oLvlOld = this.Lvl[nLvl].Copy();

		oLvlNew.ParaPr.Ind.Left = oLvlOld.ParaPr.Ind.Left ? oLvlOld.ParaPr.Ind.Left - nLeftOld + nLeftNew : nLeftNew - nLeftOld;
		History.Add(new CChangesAbstractNumLvlChange(this, oLvlOld, oLvlNew, nLvl));
	}

	this.private_RecalculateRelatedParagraphs(-1);
};
CAbstractNum.prototype.private_RecalculateRelatedParagraphs = function(nLvl)
{
	if (nLvl < 0 || nLvl > 8)
		nLvl = undefined;

	var oLogicDocument = editor.WordControl.m_oLogicDocument;
	var arrParagraphs  = oLogicDocument.GetAllParagraphsByNumbering({NumId : this.Id, Lvl : nLvl});

	for (var nIndex = 0, nCount = arrParagraphs.length; nIndex < nCount; ++nIndex)
	{
		arrParagraphs[nIndex].RecalcCompiledPr();
	}
};
/**
 * Получаем уровень списка по заданном стилю
 * @param sStyleId {string}
 * @returns {number}
 */
CAbstractNum.prototype.GetLvlByStyle = function(sStyleId)
{
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		if (sStyleId === this.Lvl[nLvl].PStyle)
			return nLvl;
	}

	return -1;
};
/**
 * Получаем заданный уровень
 * @param nLvl {number}
 * @returns {CNumberingLvl}
 */
CAbstractNum.prototype.GetLvl = function(nLvl)
{
	if (!this.Lvl[nLvl])
		return this.Lvl[0];

	return this.Lvl[nLvl];
};
/**
 * Задаем уровень
 * @param nLvl {number}
 * @param oLvlNew {CNumberingLvl}
 */
CAbstractNum.prototype.SetLvl = function(nLvl, oLvlNew)
{
	if ("number" != typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	var oLvlOld    = this.Lvl[nLvl];
	this.Lvl[nLvl] = oLvlNew;
	History.Add(new CChangesAbstractNumLvlChange(this, oLvlOld, oLvlNew, nLvl));
};
/**
 * Создаем многоуровневый список с заданным пресетом
 * @param nType {c_oAscMultiLevelNumbering}
 */
CAbstractNum.prototype.CreateDefault = function(nType)
{
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvlNew = new CNumberingLvl();
		oLvlNew.InitDefault(nLvl, nType);

		var oLvlOld = this.Lvl[nLvl].Copy();
		History.Add(new CChangesAbstractNumLvlChange(this, oLvlOld, oLvlNew.Copy(), nLvl));
		this.Lvl[nLvl] = oLvlNew;
	}
};
/**
 * Делаем заданный уровень заданного пресета
 * @param nLvl {number} 0..8
 * @param nType {c_oAscNumberingLevel}
 * @param [sText=undefined] Используется для типа c_oAscNumberingLevel.Bullet
 * @param [oTextPr=undefined] {CTextPr} Используется для типа c_oAscNumberingLevel.Bullet
 */
CAbstractNum.prototype.SetLvlByType = function(nLvl, nType, sText, oTextPr)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	var oLvlOld = this.Lvl[nLvl].Copy();
	this.Lvl[nLvl].SetByType(nType, nLvl, sText, oTextPr);
	History.Add(new CChangesAbstractNumLvlChange(this, oLvlOld, this.Lvl[nLvl].Copy(), nLvl));
};
/**
 * Заполняем уровень по заданному формату
 * @param nLvl {number} 0..8
 * @param nType
 * @param sFormatText
 * @param nAlign
 */
CAbstractNum.prototype.SetLvlByFormat = function(nLvl, nType, sFormatText, nAlign)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	var oLvlOld = this.Lvl[nLvl].Copy();
	this.Lvl[nLvl].SetByFormat(nLvl, nType, sFormatText, nAlign);

	History.Add(new CChangesAbstractNumLvlChange(this, oLvlOld, this.Lvl[nLvl].Copy(), nLvl));
};
CAbstractNum.prototype.SetLvlRestart = function(nLvl, isRestart)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	var oLvlOld = this.Lvl[nLvl].Copy();

	this.Lvl[nLvl].Restart = (isRestart ? -1 : 0);
	History.Add(new CChangesAbstractNumLvlChange(this, oLvlOld, this.Lvl[nLvl].Copy(), nLvl));
};
CAbstractNum.prototype.SetLvlStart = function(nLvl, nStart)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	var oLvlOld = this.Lvl[nLvl].Copy();

	this.Lvl[nLvl].Start = nStart;
	History.Add(new CChangesAbstractNumLvlChange(this, oLvlOld, this.Lvl[nLvl].Copy(), nLvl));
};
CAbstractNum.prototype.SetLvlSuff = function(nLvl, nSuff)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	var oLvlOld = this.Lvl[nLvl].Copy();

	this.Lvl[nLvl].Suff = nSuff;
	History.Add(new CChangesAbstractNumLvlChange(this, oLvlOld, this.Lvl[nLvl].Copy(), nLvl));
};
/**
 *
 * @param X
 * @param Y
 * @param Context
 * @param Lvl - уровень, с которого мы берем текст и настройки для текста
 * @param NumInfo - информация о номере данного элемента в списке (массив из Lvl элементов)
 * @param NumTextPr - рассчитанные настройки для символов нумерации (уже с учетом настроек текущего уровня)
 * @param Theme
 */
CAbstractNum.prototype.Draw = function(X, Y, Context, Lvl, NumInfo, NumTextPr, Theme)
{
	var Text = this.Lvl[Lvl].LvlText;

	Context.SetTextPr(NumTextPr, Theme);
	Context.SetFontSlot(fontslot_ASCII);
	g_oTextMeasurer.SetTextPr(NumTextPr, Theme);
	g_oTextMeasurer.SetFontSlot(fontslot_ASCII);

	for (var Index = 0; Index < Text.length; Index++)
	{
		switch (Text[Index].Type)
		{
			case numbering_lvltext_Text:
			{
				var Hint = NumTextPr.RFonts.Hint;
				var bCS  = NumTextPr.CS;
				var bRTL = NumTextPr.RTL;
				var lcid = NumTextPr.Lang.EastAsia;

				var FontSlot = g_font_detector.Get_FontClass(Text[Index].Value.charCodeAt(0), Hint, lcid, bCS, bRTL);

				Context.SetFontSlot(FontSlot);
				g_oTextMeasurer.SetFontSlot(FontSlot);

				Context.FillText(X, Y, Text[Index].Value);
				X += g_oTextMeasurer.Measure(Text[Index].Value).Width;

				break;
			}
			case numbering_lvltext_Num:
			{
				Context.SetFontSlot(fontslot_ASCII);
				g_oTextMeasurer.SetFontSlot(fontslot_ASCII);

				var CurLvl = Text[Index].Value;
				switch (this.Lvl[CurLvl].Format)
				{
					case numbering_numfmt_Bullet:
					{
						break;
					}

					case numbering_numfmt_Decimal:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );
							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								Context.FillText(X, Y, Char);
								X += g_oTextMeasurer.Measure(Char).Width;
							}
						}
						break;
					}

					case numbering_numfmt_DecimalZero:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );

							if (1 === T.length)
							{
								Context.FillText(X, Y, '0');
								X += g_oTextMeasurer.Measure('0').Width;

								var Char = T.charAt(0);
								Context.FillText(X, Y, Char);
								X += g_oTextMeasurer.Measure(Char).Width;
							}
							else
							{
								for (var Index2 = 0; Index2 < T.length; Index2++)
								{
									var Char = T.charAt(Index2);
									Context.FillText(X, Y, Char);
									X += g_oTextMeasurer.Measure(Char).Width;
								}
							}
						}
						break;
					}

					case numbering_numfmt_LowerLetter:
					case numbering_numfmt_UpperLetter:
					{
						if (CurLvl < NumInfo.length)
						{
							// Формат: a,..,z,aa,..,zz,aaa,...,zzz,...
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] - 1;

							var Count = (Num - Num % 26) / 26;
							var Ost   = Num % 26;

							var T = "";

							var Letter;
							if (numbering_numfmt_LowerLetter === this.Lvl[CurLvl].Format)
								Letter = String.fromCharCode(Ost + 97);
							else
								Letter = String.fromCharCode(Ost + 65);

							for (var Index2 = 0; Index2 < Count + 1; Index2++)
								T += Letter;

							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								Context.FillText(X, Y, Char);
								X += g_oTextMeasurer.Measure(Char).Width;
							}
						}
						break;
					}

					case numbering_numfmt_LowerRoman:
					case numbering_numfmt_UpperRoman:
					{
						if (CurLvl < NumInfo.length)
						{
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl];

							// Переводим число Num в римскую систему исчисления
							var Rims;

							if (numbering_numfmt_LowerRoman === this.Lvl[CurLvl].Format)
								Rims = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
							else
								Rims = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

							var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];

							var T      = "";
							var Index2 = 0;
							while (Num > 0)
							{
								while (Vals[Index2] <= Num)
								{
									T += Rims[Index2];
									Num -= Vals[Index2];
								}

								Index2++;

								if (Index2 >= Rims.length)
									break;
							}

							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								Context.FillText(X, Y, Char);
								X += g_oTextMeasurer.Measure(T.charAt(Index2)).Width;
							}
						}
						break;
					}
				}

				break;
			}
		}
	}
};
CAbstractNum.prototype.Measure = function(Context, Lvl, NumInfo, NumTextPr, Theme)
{
	var X    = 0;
	var Text = this.Lvl[Lvl].LvlText;

	Context.SetTextPr(NumTextPr, Theme);
	Context.SetFontSlot(fontslot_ASCII);
	var Ascent = Context.GetAscender();

	for (var Index = 0; Index < Text.length; Index++)
	{
		switch (Text[Index].Type)
		{
			case numbering_lvltext_Text:
			{
				var Hint = NumTextPr.RFonts.Hint;
				var bCS  = NumTextPr.CS;
				var bRTL = NumTextPr.RTL;
				var lcid = NumTextPr.Lang.EastAsia;

				var FontSlot = g_font_detector.Get_FontClass(Text[Index].Value.charCodeAt(0), Hint, lcid, bCS, bRTL);

				Context.SetFontSlot(FontSlot);
				X += Context.Measure(Text[Index].Value).Width;

				break;
			}
			case numbering_lvltext_Num:
			{
				Context.SetFontSlot(fontslot_ASCII);
				var CurLvl = Text[Index].Value;
				switch (this.Lvl[CurLvl].Format)
				{
					case numbering_numfmt_Bullet:
					{
						break;
					}

					case numbering_numfmt_Decimal:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );
							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								X += Context.Measure(Char).Width;
							}
						}
						break;
					}

					case numbering_numfmt_DecimalZero:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );

							if (1 === T.length)
							{
								X += Context.Measure('0').Width;

								var Char = T.charAt(0);
								X += Context.Measure(Char).Width;
							}
							else
							{
								for (var Index2 = 0; Index2 < T.length; Index2++)
								{
									var Char = T.charAt(Index2);
									X += Context.Measure(Char).Width;
								}
							}
						}
						break;
					}

					case numbering_numfmt_LowerLetter:
					case numbering_numfmt_UpperLetter:
					{
						if (CurLvl < NumInfo.length)
						{
							// Формат: a,..,z,aa,..,zz,aaa,...,zzz,...
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] - 1;

							var Count = (Num - Num % 26) / 26;
							var Ost   = Num % 26;

							var T = "";

							var Letter;
							if (numbering_numfmt_LowerLetter === this.Lvl[CurLvl].Format)
								Letter = String.fromCharCode(Ost + 97);
							else
								Letter = String.fromCharCode(Ost + 65);

							for (var Index2 = 0; Index2 < Count + 1; Index2++)
								T += Letter;

							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								X += Context.Measure(Char).Width;
							}
						}
						break;
					}

					case numbering_numfmt_LowerRoman:
					case numbering_numfmt_UpperRoman:
					{
						if (CurLvl < NumInfo.length)
						{
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl];

							// Переводим число Num в римскую систему исчисления
							var Rims;

							if (numbering_numfmt_LowerRoman === this.Lvl[CurLvl].Format)
								Rims = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
							else
								Rims = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

							var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];

							var T      = "";
							var Index2 = 0;
							while (Num > 0)
							{
								while (Vals[Index2] <= Num)
								{
									T += Rims[Index2];
									Num -= Vals[Index2];
								}

								Index2++;

								if (Index2 >= Rims.length)
									break;
							}

							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								X += Context.Measure(T.charAt(Index2)).Width;
							}
						}
						break;
					}
				}

				break;
			}
		}
	}

	return {Width : X, Ascent : Ascent};
};
CAbstractNum.prototype.Document_CreateFontCharMap = function(FontCharMap, Lvl, NumInfo, NumTextPr)
{
	FontCharMap.StartFont(NumTextPr.FontFamily.Name, NumTextPr.Bold, NumTextPr.Italic, NumTextPr.FontSize);
	var Text = this.Lvl[Lvl].LvlText;

	for (var Index = 0; Index < Text.length; Index++)
	{
		switch (Text[Index].Type)
		{
			case numbering_lvltext_Text:
			{
				FontCharMap.AddChar(Text[Index].Value);
				break;
			}
			case numbering_lvltext_Num:
			{
				var CurLvl = Text[Index].Value;
				switch (this.Lvl[CurLvl].Format)
				{
					case numbering_numfmt_Bullet:
					{
						break;
					}

					case numbering_numfmt_Decimal:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );
							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								FontCharMap.AddChar(Char);
							}
						}
						break;
					}

					case numbering_numfmt_DecimalZero:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );

							if (1 === T.length)
							{
								FontCharMap.AddChar('0');

								var Char = T.charAt(0);
								FontCharMap.AddChar(Char);
							}
							else
							{
								for (var Index2 = 0; Index2 < T.length; Index2++)
								{
									var Char = T.charAt(Index2);
									FontCharMap.AddChar(Char);
								}
							}
						}
						break;
					}

					case numbering_numfmt_LowerLetter:
					case numbering_numfmt_UpperLetter:
					{
						if (CurLvl < NumInfo.length)
						{
							// Формат: a,..,z,aa,..,zz,aaa,...,zzz,...
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] - 1;

							var Count = (Num - Num % 26) / 26;
							var Ost   = Num % 26;

							var T = "";

							var Letter;
							if (numbering_numfmt_LowerLetter === this.Lvl[CurLvl].Format)
								Letter = String.fromCharCode(Ost + 97);
							else
								Letter = String.fromCharCode(Ost + 65);

							for (var Index2 = 0; Index2 < Count + 1; Index2++)
								T += Letter;

							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								FontCharMap.AddChar(Char);
							}
						}
						break;
					}

					case numbering_numfmt_LowerRoman:
					case numbering_numfmt_UpperRoman:
					{
						if (CurLvl < NumInfo.length)
						{
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl];

							// Переводим число Num в римскую систему исчисления
							var Rims;

							if (numbering_numfmt_LowerRoman === this.Lvl[CurLvl].Format)
								Rims = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
							else
								Rims = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

							var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];

							var T      = "";
							var Index2 = 0;
							while (Num > 0)
							{
								while (Vals[Index2] <= Num)
								{
									T += Rims[Index2];
									Num -= Vals[Index2];
								}

								Index2++;

								if (Index2 >= Rims.length)
									break;
							}

							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								FontCharMap.AddChar(Char);
							}
						}
						break;
					}
				}

				break;
			}
		}
	}
};
CAbstractNum.prototype.Document_Get_AllFontNames = function(AllFonts)
{
	var Count = this.Lvl.length;
	for (var Index = 0; Index < Count; Index++)
	{
		var Lvl = this.Lvl[Index];

		if (undefined !== Lvl.TextPr && Lvl.TextPr.Document_Get_AllFontNames)
			Lvl.TextPr.Document_Get_AllFontNames(AllFonts);
	}
};
CAbstractNum.prototype.CollectDocumentStatistics = function(Lvl, Stats)
{
	var Text = this.Lvl[Lvl].LvlText;

	var bWord = false;
	for (var Index = 0; Index < Text.length; Index++)
	{
		var bSymbol  = false;
		var bSpace   = false;
		var bNewWord = false;

		if (numbering_lvltext_Text === Text[Index].Type && ( sp_string === Text[Index].Value || nbsp_string === Text[Index].Value ))
		{
			bWord   = false;
			bSymbol = true;
			bSpace  = true;
		}
		else
		{
			if (false === bWord)
				bNewWord = true;

			bWord   = true;
			bSymbol = true;
			bSpace  = false;
		}

		if (true === bSymbol)
			Stats.Add_Symbol(bSpace);

		if (true === bNewWord)
			Stats.Add_Word();
	}

	if (numbering_suff_Tab === this.Lvl[Lvl].Suff || numbering_suff_Space === this.Lvl[Lvl].Suff)
		Stats.Add_Symbol(true);
};
/**
 * Применяем новые тектовые настройки к данной нумерации на заданном уровне
 */
CAbstractNum.prototype.Apply_TextPr = function(nLvl, oTextPr)
{
	var oTextPrOld = CurTextPr.Copy();
	this.Lvl[nLvl].TextPr.Merge(oTextPr);
	History.Add(new CChangesAbstractNumTextPrChange(this, oTextPrOld, this.Lvl[nLvl].TextPr.Copy(), nLvl));
};
CAbstractNum.prototype.Set_TextPr = function(nLvl, oTextPr)
{
	History.Add(new CChangesAbstractNumTextPrChange(this, this.Lvl[nLvl].TextPr, oTextPr.Copy(), nLvl));
	this.Lvl[nLvl].TextPr = oTextPr;
};
CAbstractNum.prototype.Set_ParaPr = function(nLvl, oParaPr)
{
	History.Add(new CChangesAbstractNumParaPrChange(this, this.Lvl[nLvl].ParaPr, oParaPr.Copy(), nLvl));
	this.Lvl[nLvl].ParaPr = oParaPr;
};
//----------------------------------------------------------------------------------------------------------------------
// Undo/Redo функции
//----------------------------------------------------------------------------------------------------------------------
CAbstractNum.prototype.Refresh_RecalcData = function(Data)
{
	var oHistory = History;
	if (!oHistory)
		return;

	if (!oHistory.AddChangedNumberingToRecalculateData(this.Get_Id(), Data.Index, this))
		return;

	var NumPr   = new CNumPr();
	NumPr.NumId = this.Id;
	NumPr.Lvl   = Data.Index;

	var AllParagraphs = oHistory.GetAllParagraphsForRecalcData({Numbering : true, NumPr : NumPr});

	var Count = AllParagraphs.length;
	for (var Index = 0; Index < Count; Index++)
	{
		var Para = AllParagraphs[Index];
		Para.Refresh_RecalcData({Type : AscDFH.historyitem_Paragraph_Numbering});
	}
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//----------------------------------------------------------------------------------------------------------------------
CAbstractNum.prototype.Write_ToBinary2 = function(Writer)
{
	Writer.WriteLong(AscDFH.historyitem_type_AbstractNum);

	// String          : Id
	// String          : StyleLink
	// String          : NumStyleLink
	// Variable[9 Lvl] : 9 уровней

	Writer.WriteString2(this.Id);

	Writer.WriteString2(this.StyleLink ? this.StyleLink : "");
	Writer.WriteString2(this.NumStyleLink ? this.NumStyleLink : "");

	for (var nLvl = 0; nLvl < 9; ++nLvl)
		this.Lvl[nLvl].WriteToBinary(Writer);
};
CAbstractNum.prototype.Read_FromBinary2 = function(Reader)
{
	// String          : Id
	// String          : StyleLink
	// String          : NumStyleLink
	// Variable[9 Lvl] : 9 уровней

	this.Id           = Reader.GetString2();

	this.StyleLink    = Reader.GetString2();
	this.NumStyleLink = Reader.GetString2();

	if ("" === this.StyleLink)
		this.StyleLink = undefined;

	if ("" === this.NumStyleLink)
		this.NumStyleLink = undefined;

	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		this.Lvl[nLvl] = new CNumberingLvl();
		this.Lvl[nLvl].ReadFromBinary(Reader);
	}

	// Добавим данный список в нумерацию
	var Numbering                  = editor.WordControl.m_oLogicDocument.Get_Numbering();
	Numbering.AbstractNum[this.Id] = this;
};
CAbstractNum.prototype.Process_EndLoad = function(Data)
{
	var iLvl = Data.iLvl;
	if (undefined !== iLvl)
	{
		// Пересчитываем стили у все параграфов с данной нумерацией
		this.Recalc_CompiledPr(iLvl);
	}
};
CAbstractNum.prototype.Recalc_CompiledPr = function(nLvl)
{
	// Ищем все параграфы, который используют данную нумерацию и проставляем у них, то что их стиль
	// нужно перекомпилировать.

	this.private_RecalculateRelatedParagraphs(nLvl);
};
CAbstractNum.prototype.isEqual = function(abstractNum)
{
	var lvlUsuallyAdd = this.Lvl;
	var lvlNew        = abstractNum.Lvl;
	for (var lvl = 0; lvl < lvlUsuallyAdd.length; lvl++)
	{
		var LvlTextEqual = null;
		var ParaPrEqual  = null;
		var TextPrEqual  = null;
		if (lvlUsuallyAdd[lvl].Format == lvlNew[lvl].Format && lvlUsuallyAdd[lvl].Jc == lvlNew[lvl].Jc && lvlUsuallyAdd[lvl].PStyle == lvlNew[lvl].PStyle && lvlUsuallyAdd[lvl].Restart == lvlNew[lvl].Restart && lvlUsuallyAdd[lvl].Start == lvlNew[lvl].Start && lvlUsuallyAdd[lvl].Suff == lvlNew[lvl].Suff)
		{
			LvlTextEqual = this._isEqualLvlText(lvlUsuallyAdd[lvl].LvlText, lvlNew[lvl].LvlText);
			ParaPrEqual  = lvlUsuallyAdd[lvl].ParaPr.isEqual(lvlUsuallyAdd[lvl].ParaPr, lvlNew[lvl].ParaPr);
			TextPrEqual  = lvlUsuallyAdd[lvl].TextPr.isEqual(lvlUsuallyAdd[lvl].TextPr, lvlNew[lvl].TextPr);
		}
		if (!LvlTextEqual || !ParaPrEqual || !TextPrEqual)
			return false;
	}
	return true;
};
CAbstractNum.prototype._isEqualLvlText = function(LvlTextOld, LvlTextNew)
{
	if (LvlTextOld.length !== LvlTextNew.length)
		return false;

	for (var LvlText = 0; LvlText < LvlTextOld.length; LvlText++)
	{
		if (LvlTextOld[LvlText].Type != LvlTextNew[LvlText].Type || LvlTextOld[LvlText].Value != LvlTextNew[LvlText].Value)
			return false;
	}
	return true;
};
CAbstractNum.prototype.GetText = function(Lvl, NumInfo)
{
	var Text = this.Lvl[Lvl].LvlText;

	var sResult = "";
	for (var Index = 0; Index < Text.length; Index++)
	{
		switch (Text[Index].Type)
		{
			case numbering_lvltext_Text:
			{
				sResult += Text[Index].Value;
				break;
			}
			case numbering_lvltext_Num:
			{
				var CurLvl = Text[Index].Value;
				switch (this.Lvl[CurLvl].Format)
				{
					case numbering_numfmt_Bullet:
					{
						break;
					}
					case numbering_numfmt_Decimal:
					{
						if (CurLvl < NumInfo.length)
						{
							sResult += "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );
						}
						break;
					}
					case numbering_numfmt_DecimalZero:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );
							if (1 === T.length)
							{
								sResult += '0' + T.charAt(0);
							}
							else
							{
								for (var Index2 = 0; Index2 < T.length; Index2++)
								{
									sResult += T.charAt(Index2);
								}
							}
						}
						break;
					}
					case numbering_numfmt_LowerLetter:
					case numbering_numfmt_UpperLetter:
					{
						if (CurLvl < NumInfo.length)
						{
							// Формат: a,..,z,aa,..,zz,aaa,...,zzz,...
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] - 1;

							var Count = (Num - Num % 26) / 26;
							var Ost   = Num % 26;

							var Letter;
							if (numbering_numfmt_LowerLetter === this.Lvl[CurLvl].Format)
								Letter = String.fromCharCode(Ost + 97);
							else
								Letter = String.fromCharCode(Ost + 65);

							for (var Index2 = 0; Index2 < Count + 1; Index2++)
								sResult += Letter;
						}
						break;
					}
					case numbering_numfmt_LowerRoman:
					case numbering_numfmt_UpperRoman:
					{
						if (CurLvl < NumInfo.length)
						{
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl];

							// Переводим число Num в римскую систему исчисления
							var Rims;

							if (numbering_numfmt_LowerRoman === this.Lvl[CurLvl].Format)
								Rims = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
							else
								Rims = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

							var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];

							var Index2 = 0;
							while (Num > 0)
							{
								while (Vals[Index2] <= Num)
								{
									sResult += Rims[Index2];
									Num -= Vals[Index2];
								}

								Index2++;

								if (Index2 >= Rims.length)
									break;
							}
						}
						break;
					}
				}

				break;
			}
		}
	}

	return sResult;
};

//--------------------------------------------------------export--------------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CAbstractNum = CAbstractNum;