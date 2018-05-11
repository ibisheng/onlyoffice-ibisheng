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

function CLvlOverride(nLvl)
{
	this.Lvl           = nLvl;
	this.StartOverride = -1;
	this.NumberingLvl  = null;
}
CLvlOverride.prototype.GetLvl = function()
{
	return this.NumberingLvl;
};