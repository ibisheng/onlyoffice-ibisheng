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
 * Класс представляющий нумерацию в документе
 * @constructor
 */
function CNumbering()
{
	this.AbstractNum = {};
	this.Num         = {};
}

CNumbering.prototype.Copy_All_AbstractNums = function()
{
	var Map             = {};
	var NewAbstractNums = [];

	for (var OldId in this.AbstractNum)
	{
		var OldAbsNum = this.AbstractNum[OldId];
		var NewAbsNum = new CAbstractNum();

		var NewId = NewAbsNum.Get_Id();

		NewAbsNum.Copy(OldAbsNum);

		NewAbstractNums[NewId] = NewAbsNum;
		Map[OldId]             = NewId;
	}

	return {AbstractNums : NewAbstractNums, Map : Map};
};
CNumbering.prototype.Clear = function()
{
	this.AbstractNum = {};
	this.Num         = {};
};
CNumbering.prototype.Append_AbstractNums = function(AbstractNums)
{
	for (var Id in AbstractNums)
	{
		if (undefined === this.AbstractNum[Id])
			this.AbstractNum[Id] = AbstractNums[Id];
	}
};
CNumbering.prototype.CreateAbstractNum = function()
{
	var oAbstractNum                       = new CAbstractNum();
	this.AbstractNum[oAbstractNum.GetId()] = oAbstractNum;
	return oAbstractNum;
};
CNumbering.prototype.Add_AbstractNum = function(AbstractNum)
{
	var Id               = AbstractNum.Get_Id();
	this.AbstractNum[Id] = AbstractNum;

	return Id;
};
/**
 * Доступ к абстрактной нумерации по Id
 * @param sId
 * @returns {CAbstractNum}
 */
CNumbering.prototype.GetAbstractNum = function(sId)
{
	var oAbstractNum = this.AbstractNum[sId];
	if (oAbstractNum && oAbstractNum.GetNumStyleLink())
	{
		var oStyles   = editor.WordControl.m_oLogicDocument.GetStyles();
		var oNumStyle = oStyles.Get(oAbstractNum.GetNumStyleLink());

		if (oNumStyle && oNumStyle.ParaPr.NumPr && undefined !== oNumStyle.ParaPr.NumPr.NumId)
			return this.GetAbstractNum(oNumStyle.ParaPr.NumPr.NumId);
	}

	return oAbstractNum;
};
/**
 * Создаем новую нумерацию
 * @returns {CNum}
 */
CNumbering.prototype.CreateNum = function()
{
	var oAbstractNum = new CAbstractNum();
	this.AbstractNum[oAbstractNum.GetId()] = oAbstractNum;

	var oNum = new CNum(this);
	this.Num[oNum.GetId()] = oNum;

	return oNum;
};
/**
 * @param sId
 * @returns {CNum}
 */
CNumbering.prototype.GetNum = function(sId)
{
	if (this.Num[sId])
		return this.Num[sId];

	return null;
};
/**
 * Получаем настройки параграфа для заданного уровня заданной нумерации
 * @param sNumId {string}
 * @param nLvl {number} 0..8
 * @returns {CParaPr}
 */
CNumbering.prototype.GetParaPr = function(sNumId, nLvl)
{
	var oNum = this.GetNum(sNumId);
	if (oNum)
		return oNum.GetLvl(nLvl).GetParaPr();

	return new CParaPr();
};
/**
 * Получаем формат заданного уровня заданной нумерации
 * @param sNumId
 * @param nLvl
 * @returns {c_oAscNumberingFormat}
 */
CNumbering.prototype.GetNumFormat = function(sNumId, nLvl)
{
	var oNum = this.GetNum(sNumId);
	if (!oNum)
		return c_oAscNumberingFormat.Bullet;

	var oLvl = oNum.GetLvl(nLvl);
	if (!oLvl)
		return c_oAscNumberingFormat.Bullet;

	return oLvl.Format;
};
/**
 * Проверяем по типам Numbered и Bullet
 * @param sNumId {string}
 * @param nLvl {number}
 * @param nType {c_oAscNumberingFormat}
 * @returns {boolean}
 */
CNumbering.prototype.CheckFormat = function(sNumId, nLvl, nType)
{
	var nFormat = this.GetNumFormat(sNumId, nLvl);

	if ((c_oAscNumberingFormat.BulletFlag & nFormat && c_oAscNumberingFormat.BulletFlag & nType)
		|| (c_oAscNumberingFormat.NumberedFlag & nFormat && c_oAscNumberingFormat.NumberedFlag & nType))
		return true;

	return false;
};
CNumbering.prototype.Draw = function(sNumId, nLvl, nX, nY, oContext, oNumInfo, oTextPr, oTheme)
{
	var oNum = this.GetNum(sNumId);
	return oNum.Draw(nX, nY, oContext, nLvl, oNumInfo, oTextPr, oTheme);
};
CNumbering.prototype.Measure = function(sNumId, nLvl, oContext, oNumInfo, oTextPr, oTheme)
{
	var oNum = this.GetNum(sNumId);
	return oNum.Measure(oContext, nLvl, oNumInfo, oTextPr, oTheme);
};
/**
 * Получаем список всех символов используемых в заданном уровне заданной нумерации
 * @param oFontCharMap
 * @param oNumTextPr
 * @param oNumPr
 * @param oNumInfo
 */
CNumbering.prototype.CreateFontCharMap = function(oFontCharMap, oNumTextPr, oNumPr, oNumInfo)
{
	var oNum = this.GetNum(oNumPr.NumId);
	oNum.CreateFontCharMap(oFontCharMap, oNumPr.Lvl, oNumInfo, oNumTextPr);
};
/**
 * Получаем список всех используемых шрифтов
 * @param arrAllFonts {array}
 */
CNumbering.prototype.GetAllFontNames = function(arrAllFonts)
{
	for (var sNumId in this.Num)
	{
		var oNum = this.GetNum(sNumId);
		oNum.GetAllFontNames(arrAllFonts);
	}

	arrAllFonts["Symbol"]      = true;
	arrAllFonts["Courier New"] = true;
	arrAllFonts["Wingdings"]   = true;
};
/**
 * Получаем текст нумерации для заданного уровня
 * @param sNumId {string}
 * @param nLvl {number} 0..8
 * @param oNumInfo
 * @returns {string}
 */
CNumbering.prototype.GetText = function(sNumId, nLvl, oNumInfo)
{
	var oNum = this.GetNum(sNumId);
	return oNum.GetText(nLvl, oNumInfo);
};