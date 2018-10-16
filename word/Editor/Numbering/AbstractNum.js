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
/**
 * Выставляем является ли данный уровень сквозным или каждый раз перестартовывать нумерацию
 * @param nLvl {number} 0..8
 * @param isRestart {boolean}
 */
CAbstractNum.prototype.SetLvlRestart = function(nLvl, isRestart)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	var oLvlOld = this.Lvl[nLvl].Copy();

	this.Lvl[nLvl].Restart = (isRestart ? -1 : 0);
	History.Add(new CChangesAbstractNumLvlChange(this, oLvlOld, this.Lvl[nLvl].Copy(), nLvl));
};
/**
 * Задаем начальное значения для данного уровня
 * @param nLvl {number} 0..8
 * @param nStart {number}
 */
CAbstractNum.prototype.SetLvlStart = function(nLvl, nStart)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	var oLvlOld = this.Lvl[nLvl].Copy();

	this.Lvl[nLvl].Start = nStart;
	History.Add(new CChangesAbstractNumLvlChange(this, oLvlOld, this.Lvl[nLvl].Copy(), nLvl));
};
/**
 * Выставляем тип разделителя между табом и последующим текстом
 * @param nLvl {number} 0..8
 * @param nSuff {number}
 */
CAbstractNum.prototype.SetLvlSuff = function(nLvl, nSuff)
{
	if ("number" !== typeof(nLvl) || nLvl < 0 || nLvl >= 9)
		return;

	var oLvlOld = this.Lvl[nLvl].Copy();

	this.Lvl[nLvl].Suff = nSuff;
	History.Add(new CChangesAbstractNumLvlChange(this, oLvlOld, this.Lvl[nLvl].Copy(), nLvl));
};
/**
 * Применяем новые тектовые настройки к данной нумерации на заданном уровне
 * @param nLvl {number} 0..8
 * @param oTextPr {CTextPr}
 */
CAbstractNum.prototype.ApplyTextPr = function(nLvl, oTextPr)
{
	var oTextPrOld = this.Lvl[nLvl].TextPr.Copy();
	this.Lvl[nLvl].TextPr.Merge(oTextPr);
	History.Add(new CChangesAbstractNumTextPrChange(this, oTextPrOld, this.Lvl[nLvl].TextPr.Copy(), nLvl));
};
/**
 * Выставляем текстовые настройки для заданного уровня
 * @param nLvl {number} 0..8
 * @param oTextPr {CTextPr}
 */
CAbstractNum.prototype.SetTextPr = function(nLvl, oTextPr)
{
	History.Add(new CChangesAbstractNumTextPrChange(this, this.Lvl[nLvl].TextPr, oTextPr.Copy(), nLvl));
	this.Lvl[nLvl].TextPr = oTextPr;
};
/**
 * Выставляем настройки параграфа для заданного уровня
 * @param nLvl {number} 0..8
 * @param oParaPr {CParaPr}
 */
CAbstractNum.prototype.SetParaPr = function(nLvl, oParaPr)
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

	var oLogicDocument = editor.WordControl.m_oLogicDocument;
	if (!oLogicDocument)
		return;

	var oNumbering = oLogicDocument.GetNumbering();
	var arrNumPr   = [];

	for (var sId in oNumbering.Num)
	{
		var oNum = oNumbering.Num[sId];
		if (this.Id === oNum.GetAbstractNumId())
		{
			arrNumPr.push(new CNumPr(oNum.GetId(), Data.Index));
		}
	}

	var arrAllParagraphs = oLogicDocument.GetAllParagraphsByNumbering(arrNumPr);

	for (var nIndex = 0, nCount = arrAllParagraphs.length; nIndex < nCount; ++nIndex)
	{
		arrAllParagraphs[nIndex].Refresh_RecalcData({Type : AscDFH.historyitem_Paragraph_Numbering});
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

//--------------------------------------------------------export--------------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CAbstractNum = CAbstractNum;