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

/**
 * Класс представляющий нумерацию параграфов в документах
 * @param {CNumbering} oNumbering - ссылка на главный объект нумерации в документах
 * @param {string} sAbstractNumId - идентификатор абстрактной нумерации
 * @constructor
 */
function CNum(oNumbering, sAbstractNumId)
{
	this.Id = AscCommon.g_oIdCounter.Get_NewId();

	this.Lock = new AscCommon.CLock();
	if (!AscCommon.g_oIdCounter.m_bLoad)
	{
		this.Lock.Set_Type(AscCommon.locktype_Mine, false);
		if (typeof AscCommon.CollaborativeEditing !== "undefined")
			AscCommon.CollaborativeEditing.Add_Unlock2(this);
	}

	this.AbstractNumId = sAbstractNumId ? sAbstractNumId : null;
	this.LvlOverride   = [];
	this.Numbering     = oNumbering;

	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	AscCommon.g_oTableId.Add(this, this.Id);
}
CNum.prototype.Get_Id = function()
{
	return this.Id;
};
/**
 * Идентификатор данного объекта
 * @returns {string}
 */
CNum.prototype.GetId = function()
{
	return this.Id;
};
/**
 * Создаем копию данной нумерации
 * @returns {CNum}
 */
CNum.prototype.Copy = function()
{
	var oNum = this.Numbering.CreateNum();

	var oNewAbstractNum = this.Numbering.GetAbstractNum(oNum.AbstractNumId);
	var oAbstractNum    = this.Numbering.GetAbstractNum(this.AbstractNumId);

	if (oAbstractNum && oNewAbstractNum)
		oNewAbstractNum.Copy(oAbstractNum);

	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		if (this.LvlOverride[nLvl])
			oNum.SetLvlOverride(this.LvlOverride[nLvl].GetLvl().Copy(), nLvl, this.LvlOverride[nLvl].GetStartOverride());
	}

	return oNum;
};
/**
 * Получаем заданный уровень
 * @param nLvl {number} 0..8
 * @returns {CNumberingLvl}
 */
CNum.prototype.GetLvl = function(nLvl)
{
	if (this.private_HaveLvlOverride(nLvl))
		return this.LvlOverride[nLvl].GetLvl();

	var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
	if (!oAbstractNum)
		return new CNumberingLvl();

	return oAbstractNum.GetLvl(nLvl);
};
/**
 * Создаем многоуровневый список с заданным пресетом
 * @param nType {c_oAscMultiLevelNumbering}
 */
CNum.prototype.CreateDefault = function(nType)
{
	var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
	if (!oAbstractNum)
		return;

	oAbstractNum.CreateDefault(nType);
	this.ClearAllLvlOverride();
};
/**
 * Задаем новый уровень нумерации
 * @param oNumberingLvl {CNumberingLvl}
 * @param nLvl {number} 0..8
 */
CNum.prototype.SetLvl = function(oNumberingLvl, nLvl)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		this.SetLvlOverride(oNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetLvl(nLvl, oNumberingLvl);
	}
};
/**
 * Делаем заданный уровень заданного пресета
 * @param nLvl {number} 0..8
 * @param nType {c_oAscNumberingLevel}
 * @param [sText=undefined] Используется для типа c_oAscNumberingLevel.Bullet
 * @param [oTextPr=undefined] {CTextPr} Используется для типа c_oAscNumberingLevel.Bullet
 */
CNum.prototype.SetLvlByType = function(nLvl, nType, sText, oTextPr)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl = new CNumberingLvl();
		oNumberingLvl.SetByType(nType, nLvl, sText, oTextPr);

		this.SetLvlOverride(oNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetLvlByType(nLvl, nType, sText, oTextPr);
	}
};
/**
 * Заполняем уровень по заданному формату
 * @param nLvl {number} 0..8
 * @param nType
 * @param sFormatText
 * @param nAlign
 */
CNum.prototype.SetLvlByFormat = function(nLvl, nType, sFormatText, nAlign)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl = new CNumberingLvl();
		oNumberingLvl.SetByFormat(nLvl, nType, sFormatText, nAlign);

		this.SetLvlOverride(oNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetLvlByFormat(nLvl, nType, sFormatText, nAlign);
	}
};
/**
 * Выставляем является ли данный уровень сквозным или каждый раз перестартовывать нумерацию
 * @param nLvl {number} 0..8
 * @param isRestart {boolean}
 */
CNum.prototype.SetLvlRestart = function(nLvl, isRestart)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl        = this.LvlOverride[nLvl].GetLvl();
		var oNewNumberingLvl     = oNumberingLvl.Copy();
		oNewNumberingLvl.Restart = (isRestart ? -1 : 0);
		this.SetLvlOverride(oNewNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetLvlRestart(nLvl, isRestart);
	}
};
/**
 * Задаем начальное значения для данного уровня
 * @param nLvl {number} 0..8
 * @param nStart {number}
 */
CNum.prototype.SetLvlStart = function(nLvl, nStart)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl      = this.LvlOverride[nLvl].GetLvl();
		var oNewNumberingLvl   = oNumberingLvl.Copy();
		oNewNumberingLvl.Start = nStart;
		this.SetLvlOverride(oNewNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetLvlStart(nLvl, nStart);
	}
};
/**
 * Выставляем тип разделителя между табом и последующим текстом
 * @param nLvl {number} 0..8
 * @param nSuff {number}
 */
CNum.prototype.SetLvlSuff = function(nLvl, nSuff)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl     = this.LvlOverride[nLvl].GetLvl();
		var oNewNumberingLvl  = oNumberingLvl.Copy();
		oNewNumberingLvl.Suff = nSuff;
		this.SetLvlOverride(oNewNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetLvlSuff(nLvl, nSuff);
	}
};
/**
 * Устанавливаем новый уровень
 * @param oNumberingLvl {CNumberingLvl}
 * @param nLvl {number} 0..8
 * @param [nStartOverride=-1]
 */
CNum.prototype.SetLvlOverride = function(oNumberingLvl, nLvl, nStartOverride)
{
	if (nLvl < 0 || nLvl > 8)
		return;

	if (!oNumberingLvl && !this.LvlOverride[nLvl] && (-1 === nStartOverride || undefined == nStartOverride))
		return;

	var oLvlOverrideOld = this.LvlOverride[nLvl];
	var oLvlOverrideNew = new CLvlOverride(oNumberingLvl, nLvl, nStartOverride);

	AscCommon.History.Add(new CChangesNumLvlOverrideChange(this, oLvlOverrideOld, oLvlOverrideNew, nLvl));

	this.LvlOverride[nLvl] = oLvlOverrideNew;
	this.RecalculateRelatedParagraphs(nLvl);
};
/**
 * Удаляем все записи о перекрывании уровней
 */
CNum.prototype.ClearAllLvlOverride = function()
{
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		this.SetLvlOverride(undefined, nLvl);
	}
};
/**
 * Изменяем базовую нумерацию
 * @param sId {string}
 */
CNum.prototype.SetAbstractNumId = function(sId)
{
	if (sId !== this.AbstractNumId)
	{
		AscCommon.History.Add(new CChangesNumAbstractNum(this, this.AbstractNumId, sId));
		this.AbstractNumId = sId;
		this.RecalculateRelatedParagraphs(-1);
	}
};
/**
 * Сообщаем, что параграфы связанные с заданным уровнем нужно пересчитать
 * @param nLvl {number} 0..8 - заданный уровен, если -1 то для всех уровней
 */
CNum.prototype.RecalculateRelatedParagraphs = function(nLvl)
{
	if (nLvl < 0 || nLvl > 8)
		nLvl = undefined;

	var oLogicDocument = editor.WordControl.m_oLogicDocument;
	//добавляю проверку - при чтении из бинарника oLogicDocument - это CPresentation(вставка de->pe)
	var arrParagraphs  = oLogicDocument.GetAllParagraphsByNumbering ? oLogicDocument.GetAllParagraphsByNumbering({NumId : this.Id, Lvl : nLvl}) : [];

	for (var nIndex = 0, nCount = arrParagraphs.length; nIndex < nCount; ++nIndex)
	{
		arrParagraphs[nIndex].RecalcCompiledPr();
	}
};
/**
 * Применяем новые тектовые настройки к данной нумерации на заданном уровне
 * @param nLvl {number} 0..8
 * @param oTextPr {CTextPr}
 */
CNum.prototype.ApplyTextPr = function(nLvl, oTextPr)
{
	if (nLvl < 0 || nLvl > 8)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl = this.LvlOverride[nLvl].GetLvl();
		var oNewNumberingLvl = oNumberingLvl.Copy();
		oNewNumberingLvl.TextPr.Merge(oTextPr());
		this.SetLvlOverride(oNewNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.ApplyTextPr(nLvl, oTextPr);
	}
};
/**
 * Сдвигаем все уровни на заданное значение (оно задается для нулевого уровня)
 * @param nLeftNew {number}
 */
CNum.prototype.ShiftLeftInd = function(nLeftNew)
{
	var oFirstLevel = this.GetLvl(0);
	var nLeftOld    = oFirstLevel.ParaPr.Ind.Left ? oFirstLevel.ParaPr.Ind.Left : 0;

	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvlOld = this.GetLvl(nLvl);
		var oLvlNew = this.GetLvl(nLvl).Copy();

		oLvlNew.ParaPr.Ind.Left = oLvlOld.ParaPr.Ind.Left ? oLvlOld.ParaPr.Ind.Left - nLeftOld + nLeftNew : nLeftNew - nLeftOld;

		this.SetLvl(oLvlNew, nLvl);
	}
};
/**
 * Получаем Id NumStyleLink
 * @returns {null | string}
 */
CNum.prototype.GetNumStyleLink = function()
{
	var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
	if (!oAbstractNum)
		return null;

	return oAbstractNum.GetNumStyleLink();
};
/**
 * Получаем Id StyleLink
 * @returns {null | string}
 */
CNum.prototype.GetStyleLink = function()
{
	var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
	if (!oAbstractNum)
		return null;

	return oAbstractNum.GetStyleLink();
};
/**
 * Получаем уровень списка по заданном стилю
 * @param sStyleId {string}
 * @returns {number}
 */
CNum.prototype.GetLvlByStyle = function(sStyleId)
{
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvl = this.GetLvl(nLvl);
		if (oLvl && sStyleId === oLvl.GetPStyle())
			return nLvl;
	}

	return -1;
};
/**
 * Получаем нумерованное значение для заданного уровня с учетом заданого сдвига и формата данного уровня
 * @param nLvl {number} 0..8
 * @param nNumShift {number}
 */
CNum.prototype.private_GetNumberedLvlText = function(nLvl, nNumShift)
{
	var sResult = "";

	var oLvl = this.GetLvl(nLvl);
	switch (oLvl.GetFormat())
	{
		case Asc.c_oAscNumberingFormat.Bullet:
		{
			break;
		}

		case Asc.c_oAscNumberingFormat.Decimal:
		{
			sResult = "" + nNumShift;
			break;
		}

		case Asc.c_oAscNumberingFormat.DecimalZero:
		{
			sResult = "" + nNumShift;

			if (1 === sResult.length)
				sResult = "0" + sResult;
			break;
		}

		case Asc.c_oAscNumberingFormat.LowerLetter:
		case Asc.c_oAscNumberingFormat.UpperLetter:
		{
			// Формат: a,..,z,aa,..,zz,aaa,...,zzz,...
			var Num = nNumShift - 1;

			var Count = (Num - Num % 26) / 26;
			var Ost   = Num % 26;

			var Letter;
			if (Asc.c_oAscNumberingFormat.LowerLetter === oLvl.GetFormat())
				Letter = String.fromCharCode(Ost + 97);
			else
				Letter = String.fromCharCode(Ost + 65);

			for (var nIndex = 0; nIndex < Count + 1; ++nIndex)
				sResult += Letter;

			break;
		}

		case Asc.c_oAscNumberingFormat.LowerRoman:
		case Asc.c_oAscNumberingFormat.UpperRoman:
		{
			var Num = nNumShift;

			// Переводим число Num в римскую систему исчисления
			var Rims;

			if (Asc.c_oAscNumberingFormat.LowerRoman === oLvl.GetFormat())
				Rims = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
			else
				Rims = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

			var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];

			var nIndex = 0;
			while (Num > 0)
			{
				while (Vals[nIndex] <= Num)
				{
					sResult += Rims[nIndex];
					Num -= Vals[nIndex];
				}

				nIndex++;

				if (nIndex >= Rims.length)
					break;
			}
			break;
		}
	}

	return sResult;
};
/**
 * Функция отрисовки заданного уровня нумерации в заданной позиции
 * @param nX
 * @param nY
 * @param oContext
 * @param nLvl
 * @param oNumInfo
 * @param oNumTextPr
 * @param oTheme
 */
CNum.prototype.Draw = function(nX, nY, oContext, nLvl, oNumInfo, oNumTextPr, oTheme)
{
	var oLvl    = this.GetLvl(nLvl);
	var arrText = oLvl.GetLvlText();

	oContext.SetTextPr(oNumTextPr, oTheme);
	oContext.SetFontSlot(fontslot_ASCII);
	g_oTextMeasurer.SetTextPr(oNumTextPr, oTheme);
	g_oTextMeasurer.SetFontSlot(fontslot_ASCII);

	for (var nTextIndex = 0, nTextLen = arrText.length; nTextIndex < nTextLen; ++nTextIndex)
	{
		switch (arrText[nTextIndex].Type)
		{
			case numbering_lvltext_Text:
			{
				var Hint = oNumTextPr.RFonts.Hint;
				var bCS  = oNumTextPr.CS;
				var bRTL = oNumTextPr.RTL;
				var lcid = oNumTextPr.Lang.EastAsia;

				var FontSlot = g_font_detector.Get_FontClass(arrText[nTextIndex].Value.charCodeAt(0), Hint, lcid, bCS, bRTL);

				oContext.SetFontSlot(FontSlot);
				g_oTextMeasurer.SetFontSlot(FontSlot);

				oContext.FillText(nX, nY, arrText[nTextIndex].Value);
				nX += g_oTextMeasurer.Measure(arrText[nTextIndex].Value).Width;

				break;
			}
			case numbering_lvltext_Num:
			{
				oContext.SetFontSlot(fontslot_ASCII);
				g_oTextMeasurer.SetFontSlot(fontslot_ASCII);

				var nCurLvl = arrText[nTextIndex].Value;
				var T = "";

				if (nCurLvl < oNumInfo.length)
					T = this.private_GetNumberedLvlText(nCurLvl, oNumInfo[nCurLvl]);

				for (var Index2 = 0; Index2 < T.length; Index2++)
				{
					var Char = T.charAt(Index2);
					oContext.FillText(nX, nY, Char);
					nX += g_oTextMeasurer.Measure(Char).Width;
				}

				break;
			}
		}
	}
};
/**
 * Функция пересчета заданного уровня нумерации
 * @param oContext
 * @param nLvl
 * @param oNumInfo
 * @param oNumTextPr
 * @param oTheme
 * @returns {{Width : number, Ascent : number}}
 */
CNum.prototype.Measure = function(oContext, nLvl, oNumInfo, oNumTextPr, oTheme)
{
	var nX = 0;

	var oLvl    = this.GetLvl(nLvl);
	var arrText = oLvl.GetLvlText();

	oContext.SetTextPr(oNumTextPr, oTheme);
	oContext.SetFontSlot(fontslot_ASCII);
	var nAscent = oContext.GetAscender();

	for (var nTextIndex = 0, nTextLen = arrText.length; nTextIndex < nTextLen; ++nTextIndex)
	{
		switch (arrText[nTextIndex].Type)
		{
			case numbering_lvltext_Text:
			{
				var Hint = oNumTextPr.RFonts.Hint;
				var bCS  = oNumTextPr.CS;
				var bRTL = oNumTextPr.RTL;
				var lcid = oNumTextPr.Lang.EastAsia;

				var FontSlot = g_font_detector.Get_FontClass(arrText[nTextIndex].Value.charCodeAt(0), Hint, lcid, bCS, bRTL);

				oContext.SetFontSlot(FontSlot);
				nX += oContext.Measure(arrText[nTextIndex].Value).Width;

				break;
			}
			case numbering_lvltext_Num:
			{
				oContext.SetFontSlot(fontslot_ASCII);
				var nCurLvl = arrText[nTextIndex].Value;

				var T = "";

				if (nCurLvl < oNumInfo.length)
					T = this.private_GetNumberedLvlText(nCurLvl, oNumInfo[nCurLvl]);

				for (var Index2 = 0; Index2 < T.length; Index2++)
				{
					var Char = T.charAt(Index2);
					nX += oContext.Measure(Char).Width;
				}

				break;
			}
		}
	}

	return {
		Width  : nX,
		Ascent : nAscent
	};
};
/**
 * Составляем список всех используемых символов
 * @param oFontCharMap
 * @param nLvl {number} 0..8
 * @param oNumInfo
 * @param oNumTextPr {CTextPr}
 */
CNum.prototype.CreateFontCharMap = function(oFontCharMap, nLvl, oNumInfo, oNumTextPr)
{
	oFontCharMap.StartFont(oNumTextPr.FontFamily.Name, oNumTextPr.Bold, oNumTextPr.Italic, oNumTextPr.FontSize);

	var arrText = this.GetLvl(nLvl).GetLvlText();
	for (var nIndex = 0, nCount = arrText.length; nIndex < nCount; ++nIndex)
	{
		switch (arrText[nIndex].Type)
		{
			case numbering_lvltext_Text:
			{
				oFontCharMap.AddChar(arrText[nIndex].Value);
				break;
			}
			case numbering_lvltext_Num:
			{
				var nCurLvl = arrText[nIndex].Value;

				var T = "";
				if (nCurLvl < oNumInfo.length)
					T = this.private_GetNumberedLvlText(nCurLvl, oNumInfo[nCurLvl]);

				for (var Index2 = 0; Index2 < T.length; Index2++)
				{
					var Char = T.charAt(Index2);
					oFontCharMap.AddChar(Char);
				}

				break;
			}
		}
	}
};
/**
 * Получаем список всех используемых шрифтов
 * @param arrAllFonts {array}
 */
CNum.prototype.GetAllFontNames = function(arrAllFonts)
{
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvl = this.GetLvl(nLvl);

		if (oLvl)
			oLvl.GetTextPr().GetAllFontNames(arrAllFonts);
	}
};
/**
 * Получаем текст нумерации для заданного уровня
 * @param nLvl {number} 0..8
 * @param oNumInfo
 * @returns {string}
 */
CNum.prototype.GetText = function(nLvl, oNumInfo)
{
	var oLvl    = this.GetLvl(nLvl);
	var arrText = oLvl.GetLvlText();

	var sResult = "";
	for (var Index = 0; Index < arrText.length; Index++)
	{
		switch (arrText[Index].Type)
		{
			case numbering_lvltext_Text:
			{
				sResult += arrText[Index].Value;
				break;
			}
			case numbering_lvltext_Num:
			{
				var nCurLvl = arrText[Index].Value;
				if (nCurLvl < oNumInfo.length)
					sResult += this.private_GetNumberedLvlText(nCurLvl, oNumInfo[nCurLvl]);

				break;
			}
		}
	}

	return sResult;
};
/**
 * Обрабатываем окончание загрузки изменений
 * @param oData
 */
CNum.prototype.Process_EndLoad = function(oData)
{
	if (undefined !== oData.Lvl)
		this.RecalculateRelatedParagraphs(oData.Lvl);
};
/**
 * Проверяем есть ли у нас LvlOverride с перезаписанным уровнем
 * @param nLvl {number} 0..8
 * @returns {boolean}
 */
CNum.prototype.private_HaveLvlOverride = function(nLvl)
{
	return !!(this.LvlOverride[nLvl] && this.LvlOverride[nLvl].GetLvl());
};
/**
 * Получаем связанную абстрактную нумерацию
 * @returns {CAbstractNum}
 */
CNum.prototype.GetAbstractNum = function()
{
	return this.Numbering.GetAbstractNum(this.AbstractNumId);
};
/**
 * Получаем идентификатор связанной абстрактной нумерации
 * @returns {string}
 */
CNum.prototype.GetAbstractNumId = function()
{
	return this.AbstractNumId;
};
/**
 * Получаем параметр StartOverride для заданного уровня
 * @param nLvl {number} 0..8
 * @returns {number} возвращаем -1, если данный параметр не задан
 */
CNum.prototype.GetStartOverride = function(nLvl)
{
	var oLvlOverride = this.LvlOverride[nLvl];
	if (!oLvlOverride)
		return -1;

	var nStartOverride = oLvlOverride.GetStartOverride();

	var oLvl = oLvlOverride.GetLvl();
	if (oLvl)
		nStartOverride = oLvl.GetStart();

	return nStartOverride;
};
/**
 * Проверяем есть ли у данной нумерации уровни с текстом, зависящим от других уровней
 * @returns {boolean}
 */
CNum.prototype.IsHaveRelatedLvlText = function()
{
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvl = this.GetLvl(nLvl);
		var arrLvlText = oLvl.GetLvlText();
		for (var nIndex = 0, nCount = arrLvlText.length; nIndex < nCount; ++nIndex)
		{
			var oLvlText = arrLvlText[nIndex];
			if (numbering_lvltext_Num === oLvlText.Type && nLvl !== oLvlText.Value)
				return true;
		}
	}

	return false;
};
/**
 * Выставляем текстовые настройки для заданного уровня
 * @param nLvl {number} 0..8
 * @param oTextPr {CTextPr}
 */
CNum.prototype.SetTextPr = function(nLvl, oTextPr)
{
	if (nLvl < 0 || nLvl > 8)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl = this.LvlOverride[nLvl].GetLvl();
		var oNewNumberingLvl = oNumberingLvl.Copy();
		oNewNumberingLvl.TextPr = oTextPr;
		this.SetLvlOverride(oNewNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetTextPr(nLvl, oTextPr);
	}
};
/**
 * Выставляем настройки параграфа для заданного уровня
 * @param nLvl {number} 0..8
 * @param oParaPr {CParaPr}
 */
CNum.prototype.SetParaPr = function(nLvl, oParaPr)
{
	if (nLvl < 0 || nLvl > 8)
		return;

	if (this.private_HaveLvlOverride(nLvl))
	{
		var oNumberingLvl = this.LvlOverride[nLvl].GetLvl();
		var oNewNumberingLvl = oNumberingLvl.Copy();
		oNewNumberingLvl.ParaPr = oParaPr;
		this.SetLvlOverride(oNewNumberingLvl, nLvl);
	}
	else
	{
		var oAbstractNum = this.Numbering.GetAbstractNum(this.AbstractNumId);
		if (!oAbstractNum)
			return;

		oAbstractNum.SetParaPr(nLvl, oParaPr);
	}
};
/**
 * Заполняем специальный класс для общения с интерфейсом
 * @param oAscNum {CAscNumbering}
 */
CNum.prototype.FillToAscNum = function(oAscNum)
{
	oAscNum.NumId = this.GetId();
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvl = this.GetLvl(nLvl);
		oLvl.FillToAscNumberingLvl(oAscNum.get_Lvl(nLvl));
	}
};
/**
 * Заполняем настройки нумерации из интерфейсного класса
 * @param oAscNum {CAscNumbering}
 */
CNum.prototype.FillFromAscNum = function(oAscNum)
{
	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		var oLvl = new CNumberingLvl();
		var oAscLvl = oAscNum.get_Lvl(nLvl);
		oLvl.FillFromAscNumberingLvl(oAscLvl);
		this.SetLvl(oLvl, nLvl);
	}
};
//----------------------------------------------------------------------------------------------------------------------
// Undo/Redo функции
//----------------------------------------------------------------------------------------------------------------------
CNum.prototype.Refresh_RecalcData = function(Data)
{
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//----------------------------------------------------------------------------------------------------------------------
CNum.prototype.Write_ToBinary2 = function(oWriter)
{
	oWriter.WriteLong(AscDFH.historyitem_type_Num);

	// String          : Id
	// String          : AbstractNumId
	// Variable[9 Lvl] : LvlOverride

	oWriter.WriteString2(this.Id);
	oWriter.WriteString2(this.AbstractNumId);

	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		if (this.LvlOverride[nLvl])
		{
			oWriter.WriteBool(true);
			this.LvlOverride[nLvl].WriteToBinary(oWriter);
		}
		else
		{
			oWriter.WriteBool(false);
		}
	}
};
CNum.prototype.Read_FromBinary2 = function(oReader)
{
	// String          : Id
	// String          : AbstractNumId
	// Variable[9 Lvl] : LvlOverride

	this.Id            = oReader.GetString2();
	this.AbstractNumId = oReader.GetString2();

	for (var nLvl = 0; nLvl < 9; ++nLvl)
	{
		if (oReader.GetBool())
		{
			this.LvlOverride[nLvl] = new CLvlOverride();
			this.LvlOverride[nLvl].ReadFromBinary();
		}
	}

	if (!this.Numbering)
		this.Numbering = editor.WordControl.m_oLogicDocument.GetNumbering();

	this.Numbering.AddNum(this);
};

/**
 * Класс реализующий замену уровня в нумерации CNum
 * @param oNumberingLvl {CNumberingLvl}
 * @param nLvl {number} 0..8
 * @param [nStartOverride=-1] {number}
 * @constructor
 */
function CLvlOverride(oNumberingLvl, nLvl, nStartOverride)
{
	this.NumberingLvl  = oNumberingLvl;
	this.Lvl           = nLvl;
	this.StartOverride = undefined !== nStartOverride ? nStartOverride : -1;
}
CLvlOverride.prototype.GetLvl = function()
{
	return this.NumberingLvl;
};
CLvlOverride.prototype.GetStartOverride = function()
{
	return this.StartOverride;
};
CLvlOverride.prototype.WriteToBinary = function(oWriter)
{
	// Long : Lvl
	// Long : StartOverride
	// bool : isUndefined NumberingLvl
	// false -> CNumberingLvl : NumberingLvl

	oWriter.WriteLong(this.Lvl);
	oWriter.WriteLong(this.StartOverride);

	if (this.NumberingLvl)
	{
		oWriter.WriteBool(false);
		this.NumberingLvl.WriteToBinary(oWriter);
	}
	else
	{
		oWriter.WriteBool(true);
	}
};
CLvlOverride.prototype.ReadFromBinary = function(oReader)
{
	// Long : Lvl
	// Long : StartOverride
	// bool : isUndefined NumberingLvl
	// false -> CNumberingLvl : NumberingLvl

	this.Lvl           = oReader.GetLong();
	this.StartOverride = oReader.GetLong();
	this.NumberingLvl  = undefined;

	if (!oReader.GetBool())
	{
		this.NumberingLvl = new CNumberingLvl();
		this.NumberingLvl.ReadFromBinary(oReader);
	}
};

//--------------------------------------------------------export--------------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CNum = CNum;