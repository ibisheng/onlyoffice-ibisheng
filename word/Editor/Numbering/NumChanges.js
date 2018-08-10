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
 * Date: 14.05.2018
 * Time: 14:32
 */

AscDFH.changesFactory[AscDFH.historyitem_Num_LvlOverrideChange] = CChangesNumLvlOverrideChange;
AscDFH.changesFactory[AscDFH.historyitem_Num_AbstractNum]       = CChangesNumAbstractNum;

//----------------------------------------------------------------------------------------------------------------------
// Карта зависимости изменений
//----------------------------------------------------------------------------------------------------------------------
AscDFH.changesRelationMap[AscDFH.historyitem_Num_LvlOverrideChange] = [
	AscDFH.historyitem_Num_LvlOverrideChange
];

AscDFH.changesRelationMap[AscDFH.historyitem_Num_AbstractNum] = [
	AscDFH.historyitem_Num_AbstractNum
];
//----------------------------------------------------------------------------------------------------------------------

/**
 *
 * @param Class {CNum}
 * @param Old {CLvlOverride}
 * @param New {CLvlOverride}
 * @param nLvl {number} 0..8
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesNumLvlOverrideChange(Class, Old, New, nLvl)
{
	AscDFH.CChangesBaseProperty.call(this, Class, Old, New);

	this.Lvl = nLvl;
}
CChangesNumLvlOverrideChange.prototype = Object.create(AscDFH.CChangesBaseProperty.prototype);
CChangesNumLvlOverrideChange.prototype.constructor = CChangesNumLvlOverrideChange;
CChangesNumLvlOverrideChange.prototype.Type = AscDFH.historyitem_Num_LvlOverrideChange;
CChangesNumLvlOverrideChange.prototype.WriteToBinary = function(oWriter)
{
	// Long         : Lvl index
	// CLvlOverride : New
	// CLvlOverride : Old

	oWriter.WriteLong(this.Lvl);
	this.New.WriteToBinary(oWriter);
	this.Old.WriteToBinary(oWriter);
};
CChangesNumLvlOverrideChange.prototype.ReadFromBinary = function(oReader)
{
	// Long         : Lvl index
	// CLvlOverride : New
	// CLvlOverride : Old

	this.New = new CLvlOverride();
	this.Old = new CLvlOverride();

	this.Lvl = oReader.GetLong();
	this.New.ReadFromBinary(oReader);
	this.Old.ReadFromBinary(oReader);
};
CChangesNumLvlOverrideChange.prototype.private_SetValue = function(Value)
{
	var oNum = this.Class;
	oNum.LvlOverride[this.Lvl] = Value;
	oAbstractNum.RecalculateRelatedParagraphs(this.Lvl);
};
CChangesNumLvlOverrideChange.prototype.Load = function(Color)
{
	var oNum = this.Class;
	oNum.LvlOverride[this.Lvl] = this.New;

	// Сразу нельзя запускать пересчет, т.к. возможно еще не все ссылки проставлены
	AscCommon.CollaborativeEditing.Add_EndActions(this.Class, {Lvl : this.Lvl});
};
CChangesNumLvlOverrideChange.prototype.CreateReverseChange = function()
{
	return new CChangesNumLvlOverrideChange(this.Class, this.New, this.Old, this.Lvl);
};
CChangesNumLvlOverrideChange.prototype.Merge = function(oChange)
{
	if (this.Class !== oChange.Class)
		return true;

	if (this.Type === oChange.Type)
		return false;

	return true;
};

/**
 * @constructor
 * @extends {AscDFH.CChangesBaseStringProperty}
 */
function CChangesNumAbstractNum(Class, Old, New, Color)
{
	AscDFH.CChangesBaseStringProperty.call(this, Class, Old, New, Color);
}
CChangesNumAbstractNum.prototype = Object.create(AscDFH.CChangesBaseStringProperty.prototype);
CChangesNumAbstractNum.prototype.constructor = CChangesNumAbstractNum;
CChangesNumAbstractNum.prototype.Type = AscDFH.historyitem_Num_AbstractNum;
CChangesNumAbstractNum.prototype.private_SetValue = function(Value)
{
	this.Class.AbstractNumId = Value;
};