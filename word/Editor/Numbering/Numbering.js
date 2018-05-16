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
CNumbering.prototype.Get_AbstractNum = function(Id)
{
	var AbstractNum = this.AbstractNum[Id];
	if (undefined != AbstractNum && undefined != AbstractNum.NumStyleLink)
	{
		var Styles   = editor.WordControl.m_oLogicDocument.Get_Styles();
		var NumStyle = Styles.Style[AbstractNum.NumStyleLink];

		if (undefined != NumStyle && undefined != NumStyle.ParaPr.NumPr && undefined != NumStyle.ParaPr.NumPr.NumId)
			return this.Get_AbstractNum(NumStyle.ParaPr.NumPr.NumId);
	}

	return AbstractNum;
};
/**
 * Доступ к абстрактной нумерации по Id
 * @param sId
 * @returns {CAbstractNum}
 */
CNumbering.prototype.GetAbstractNum = function(sId)
{
	return this.Get_AbstractNum(sId);
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
CNumbering.prototype.Get_ParaPr = function(NumId, Lvl)
{
	var AbstractId = this.Get_AbstractNum(NumId);

	if (undefined != AbstractId)
		return AbstractId.Lvl[Lvl].ParaPr;

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
CNumbering.prototype.Draw = function(NumId, Lvl, X, Y, Context, NumInfo, TextPr, Theme)
{
	var AbstractId = this.Get_AbstractNum(NumId);
	return AbstractId.Draw(X, Y, Context, Lvl, NumInfo, TextPr, Theme);
};
CNumbering.prototype.Measure = function(NumId, Lvl, Context, NumInfo, TextPr, Theme)
{
	var AbstractId = this.Get_AbstractNum(NumId);
	return AbstractId.Measure(Context, Lvl, NumInfo, TextPr, Theme);
};
CNumbering.prototype.Document_CreateFontCharMap = function(FontCharMap, NumTextPr, NumPr, NumInfo)
{
	var AbstractId = this.Get_AbstractNum(NumPr.NumId);
	AbstractId.Document_CreateFontCharMap(FontCharMap, NumPr.Lvl, NumInfo, NumTextPr);
};
CNumbering.prototype.Document_Get_AllFontNames = function(AllFonts)
{
	for (var Id in this.AbstractNum)
	{
		var AbstractNum = this.Get_AbstractNum(Id);
		AbstractNum.Document_Get_AllFontNames(AllFonts);
	}

	AllFonts["Symbol"]      = true;
	AllFonts["Courier New"] = true;
	AllFonts["Wingdings"]   = true;
};
CNumbering.prototype.GetText = function(NumId, Lvl, NumInfo)
{
	var oAbstractId = this.Get_AbstractNum(NumId);
	return oAbstractId.GetText(Lvl, NumInfo);
};