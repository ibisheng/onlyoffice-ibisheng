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
 * Date: 03.05.2017
 * Time: 14:58
 */

AscDFH.changesFactory[AscDFH.historyitem_SdtPr_Alias] = CChangesSdtPrAlias;
AscDFH.changesFactory[AscDFH.historyitem_SdtPr_Id]         = CChangesSdtPrId;
AscDFH.changesFactory[AscDFH.historyitem_SdtPr_Tag]        = CChangesSdtPrTag;
AscDFH.changesFactory[AscDFH.historyitem_SdtPr_Label]      = CChangesSdtPrLabel;
AscDFH.changesFactory[AscDFH.historyitem_SdtPr_Lock]       = CChangesSdtPrLock;
AscDFH.changesFactory[AscDFH.historyitem_SdtPr_DocPartObj] = CChangesSdtPrDocPartObj;

//----------------------------------------------------------------------------------------------------------------------
// Карта зависимости изменений
//----------------------------------------------------------------------------------------------------------------------
AscDFH.changesRelationMap[AscDFH.historyitem_SdtPr_Alias] = [
	AscDFH.historyitem_SdtPr_Alias
];
AscDFH.changesRelationMap[AscDFH.historyitem_SdtPr_Id]    = [
	AscDFH.historyitem_SdtPr_Id
];
AscDFH.changesRelationMap[AscDFH.historyitem_SdtPr_Tag]   = [
	AscDFH.historyitem_SdtPr_Tag
];
AscDFH.changesRelationMap[AscDFH.historyitem_SdtPr_Label] = [
	AscDFH.historyitem_SdtPr_Label
];
AscDFH.changesRelationMap[AscDFH.historyitem_SdtPr_Lock]  = [
	AscDFH.historyitem_SdtPr_Lock
];
AscDFH.changesRelationMap[AscDFH.historyitem_SdtPr_DocPartObj] = [
	AscDFH.historyitem_SdtPr_DocPartObj
];
//----------------------------------------------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {AscDFH.CChangesBaseStringProperty}
 */
function CChangesSdtPrAlias(Class, Old, New)
{
	AscDFH.CChangesBaseStringProperty.call(this, Class, Old, New);
}
CChangesSdtPrAlias.prototype = Object.create(AscDFH.CChangesBaseStringProperty.prototype);
CChangesSdtPrAlias.prototype.constructor = CChangesSdtPrAlias;
CChangesSdtPrAlias.prototype.Type = AscDFH.historyitem_SdtPr_Alias;
CChangesSdtPrAlias.prototype.private_SetValue = function(Value)
{
	this.Class.Pr.Alias = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesSdtPrId(Class, Old, New)
{
	AscDFH.CChangesBaseLongProperty.call(this, Class, Old, New);
}
CChangesSdtPrId.prototype = Object.create(AscDFH.CChangesBaseLongProperty.prototype);
CChangesSdtPrId.prototype.constructor = CChangesSdtPrId;
CChangesSdtPrId.prototype.Type = AscDFH.historyitem_SdtPr_Id;
CChangesSdtPrId.prototype.private_SetValue = function(Value)
{
	this.Class.Pr.Id = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseStringProperty}
 */
function CChangesSdtPrTag(Class, Old, New)
{
	AscDFH.CChangesBaseStringProperty.call(this, Class, Old, New);
}
CChangesSdtPrTag.prototype = Object.create(AscDFH.CChangesBaseStringProperty.prototype);
CChangesSdtPrTag.prototype.constructor = CChangesSdtPrTag;
CChangesSdtPrTag.prototype.Type = AscDFH.historyitem_SdtPr_Tag;
CChangesSdtPrTag.prototype.private_SetValue = function(Value)
{
	this.Class.Pr.Tag = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesSdtPrLabel(Class, Old, New)
{
	AscDFH.CChangesBaseLongProperty.call(this, Class, Old, New);
}
CChangesSdtPrLabel.prototype = Object.create(AscDFH.CChangesBaseLongProperty.prototype);
CChangesSdtPrLabel.prototype.constructor = CChangesSdtPrLabel;
CChangesSdtPrLabel.prototype.Type = AscDFH.historyitem_SdtPr_Label;
CChangesSdtPrLabel.prototype.private_SetValue = function(Value)
{
	this.Class.Pr.Label = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesSdtPrLock(Class, Old, New)
{
	AscDFH.CChangesBaseLongProperty.call(this, Class, Old, New);
}
CChangesSdtPrLock.prototype = Object.create(AscDFH.CChangesBaseLongProperty.prototype);
CChangesSdtPrLock.prototype.constructor = CChangesSdtPrLock;
CChangesSdtPrLock.prototype.Type = AscDFH.historyitem_SdtPr_Lock;
CChangesSdtPrLock.prototype.private_SetValue = function(Value)
{
	this.Class.Pr.Lock = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesSdtPrDocPartObj(Class, Old, New)
{
	AscDFH.CChangesBaseProperty.call(this, Class, Old, New);

	this.Old = {
		Category : Old ? Old.Category : undefined,
		Gallery  : Old ? Old.Gallery : undefined,
		Unique   : Old ? Old.Unique : undefined
	};

	this.New = {
		Category : New ? New.Category : undefined,
		Gallery  : New ? New.Gallery : undefined,
		Unique   : New ? New.Unique : undefined
	};
}
CChangesSdtPrDocPartObj.prototype = Object.create(AscDFH.CChangesBaseProperty.prototype);
CChangesSdtPrDocPartObj.prototype.constructor = CChangesSdtPrDocPartObj;
CChangesSdtPrDocPartObj.prototype.Type = AscDFH.historyitem_SdtPr_DocPartObj;
CChangesSdtPrDocPartObj.prototype.private_SetValue = function(Value)
{
	this.Class.Pr.DocPartObj.Category = Value.Category;
	this.Class.Pr.DocPartObj.Gallery  = Value.Gallery;
	this.Class.Pr.DocPartObj.Unique   = Value.Unique;
};
CChangesSdtPrDocPartObj.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Old.Category is undefined
	// 2-bit : Old.Gallery is undefined
	// 3-bit : Old.Unique is undefined
	// 4-bit : New.Category is undefined
	// 5-bit : New.Gallery is undefined
	// 6-bit : New.Unique is undefined
	// String : Old.Category
	// String : Old.Gallery
	// Bool   : Old.Unique
	// String : New.Category
	// String : New.Gallery
	// Bool   : New.Unique

	var nFlags = 0;

	if (undefined !== this.Old.Category)
		nFlags |= 1;

	if (undefined !== this.Old.Gallery)
		nFlags |= 2;

	if (undefined !== this.Old.Unique)
		nFlags |= 4;

	if (undefined !== this.New.Category)
		nFlags |= 8;

	if (undefined !== this.New.Gallery)
		nFlags |= 16;

	if (undefined !== this.New.Unique)
		nFlags |= 32;

	Writer.WriteLong(nFlags);

	if (undefined !== this.Old.Category)
		Writer.WriteString2(this.Old.Category);

	if (undefined !== this.Old.Gallery)
		Writer.WriteString2(this.Old.Gallery);

	if (undefined !== this.Old.Unique)
		Writer.WriteBool(this.Old.Unique);

	if (undefined !== this.New.Category)
		Writer.WriteString2(this.New.Category);

	if (undefined !== this.New.Gallery)
		Writer.WriteString2(this.New.Gallery);

	if (undefined !== this.New.Unique)
		Writer.WriteBool(this.New.Unique);
};
CChangesSdtPrDocPartObj.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Old.Category is undefined
	// 2-bit : Old.Gallery is undefined
	// 3-bit : Old.Unique is undefined
	// 4-bit : New.Category is undefined
	// 5-bit : New.Gallery is undefined
	// 6-bit : New.Unique is undefined
	// String : Old.Category
	// String : Old.Gallery
	// Bool   : Old.Unique
	// String : New.Category
	// String : New.Gallery
	// Bool   : New.Unique

	var nFlags = Reader.GetLong();

	this.Old = {
		Category : undefined,
		Gallery  : undefined,
		Unique   : undefined
	};

	this.New = {
		Category : undefined,
		Gallery  : undefined,
		Unique   : undefined
	};

	if (nFlags & 1)
		this.Old.Category = Reader.GetString2();

	if (nFlags & 2)
		this.Old.Gallery = Reader.GetString2();

	if (nFlags & 4)
		this.Old.Unique = Reader.GetBool();

	if (nFlags & 8)
		this.New.Category = Reader.GetString2();

	if (nFlags & 16)
		this.New.Gallery = Reader.GetString2();

	if (nFlags & 32)
		this.New.Unique = Reader.GetBool();
};
