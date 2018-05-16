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
 * @constructor
 */
function CNum(oNumbering)
{
	this.Id = AscCommon.g_oIdCounter.Get_NewId();

	this.Lock = new AscCommon.CLock();
	if (!AscCommon.g_oIdCounter.m_bLoad)
	{
		this.Lock.Set_Type(AscCommon.locktype_Mine, false);
		if (typeof AscCommon.CollaborativeEditing !== "undefined")
			AscCommon.CollaborativeEditing.Add_Unlock2(this);
	}

	this.AbstractNumId = null;
	this.LvlOverride   = [];
	this.Numbering     = oNumbering;

	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	AscCommon.g_oTableId.Add(this, this.Id);
}
CNum.prototype.Get_Id = function()
{
	return this.Id;
};
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

	for (var nLvl = 0; nLvl < 8; ++nLvl)
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
	if (this.LvlOverride[nLvl] && this.LvlOverride[nLvl].GetLvl())
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

	if (this.LvlOverride[nLvl])
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

	if (this.LvlOverride[nLvl])
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

	if (this.LvlOverride[nLvl])
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

	if (this.LvlOverride[nLvl])
	{
		var oNumberingLvl = this.LvlOverride[nLvl].GetLvl();
		if (oNumberingLvl)
		{
			var oNewNumberingLvl = oNumberingLvl.Copy();
			oNewNumberingLvl.Restart = (isRestart ? -1 : 0);
			this.SetLvlOverride(oNewNumberingLvl, nLvl);
		}
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

	if (this.LvlOverride[nLvl])
	{
		var oNumberingLvl = this.LvlOverride[nLvl].GetLvl();
		if (oNumberingLvl)
		{
			var oNewNumberingLvl = oNumberingLvl.Copy();
			oNewNumberingLvl.Start = nStart;
			this.SetLvlOverride(oNewNumberingLvl, nLvl);
		}
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

	if (this.LvlOverride[nLvl])
	{
		var oNumberingLvl = this.LvlOverride[nLvl].GetLvl();
		if (oNumberingLvl)
		{
			var oNewNumberingLvl = oNumberingLvl.Copy();
			oNewNumberingLvl.Suff = nSuff;
			this.SetLvlOverride(oNewNumberingLvl, nLvl);
		}
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

	if (!oNumberingLvl && !this.LvlOverride[nLvl])
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
 * Сообщаем, что параграфы связанные с заданным уровнем нужно пересчитать
 * @param nLvl {number} 0..8 - заданный уровен, если -1 то для всех уровней
 */
CNum.prototype.RecalculateRelatedParagraphs = function(nLvl)
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
 * Применяем новые тектовые настройки к данной нумерации на заданном уровне
 * @param nLvl {number} 0..8
 * @param oTextPr {CTextPr}
 */
CNum.prototype.ApplyTextPr = function(nLvl, oTextPr)
{
	if (nLvl < 0 || nLvl > 8)
		return;

	if (this.LvlOverride[nLvl])
	{
		var oNumberingLvl = this.LvlOverride[nLvl].GetLvl();
		if (oNumberingLvl)
		{
			var oNewNumberingLvl = oNumberingLvl.Copy();
			oNewNumberingLvl.TextPr.Merge(oTextPr());
			this.SetLvlOverride(oNewNumberingLvl, nLvl);
		}
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
 * Обрабатываем окончание загрузки изменений
 * @param oData
 */
CNum.prototype.Process_EndLoad = function(oData)
{
	if (undefined !== oData.Lvl)
		this.RecalculateRelatedParagraphs(oData.Lvl);
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