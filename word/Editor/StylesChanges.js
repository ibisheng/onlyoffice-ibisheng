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
 * User: Ilja.Kirillov
 * Date: 08.11.2016
 * Time: 19:48
 */

AscDFH.changesFactory[AscDFH.historyitem_Style_TextPr]          = CChangesStyleTextPr;
AscDFH.changesFactory[AscDFH.historyitem_Style_ParaPr]          = CChangesStyleParaPr;
AscDFH.changesFactory[AscDFH.historyitem_Style_TablePr]         = CChangesStyleTablePr;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableRowPr]      = CChangesStyleTableRowPr;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableCellPr]     = CChangesStyleTableCellPr;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableBand1Horz]  = CChangesStyleTableBand1Horz;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableBand1Vert]  = CChangesStyleTableBand1Vert;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableBand2Horz]  = CChangesStyleTableBand2Horz;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableBand2Vert]  = CChangesStyleTableBand2Vert;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableFirstCol]   = CChangesStyleTableFirstCol;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableFirstRow]   = CChangesStyleTableFirstRow;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableLastCol]    = CChangesStyleTableLastCol;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableLastRow]    = CChangesStyleTableLastRow;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableTLCell]     = CChangesStyleTableTLCell;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableTRCell]     = CChangesStyleTableTRCell;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableBLCell]     = CChangesStyleTableBLCell;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableBRCell]     = CChangesStyleTableBRCell;
AscDFH.changesFactory[AscDFH.historyitem_Style_TableWholeTable] = CChangesStyleTableWholeTable;
AscDFH.changesFactory[AscDFH.historyitem_Style_Name]            = CChangesStyleName;
AscDFH.changesFactory[AscDFH.historyitem_Style_BasedOn]         = CChangesStyleBasedOn;
AscDFH.changesFactory[AscDFH.historyitem_Style_Next]            = CChangesStyleNext;
AscDFH.changesFactory[AscDFH.historyitem_Style_Type]            = CChangesStyleType;
AscDFH.changesFactory[AscDFH.historyitem_Style_QFormat]         = CChangesStyleQFormat;
AscDFH.changesFactory[AscDFH.historyitem_Style_UiPriority]      = CChangesStyleUiPriority;
AscDFH.changesFactory[AscDFH.historyitem_Style_Hidden]          = CChangesStyleHidden;
AscDFH.changesFactory[AscDFH.historyitem_Style_SemiHidden]      = CChangesStyleSemiHidden;
AscDFH.changesFactory[AscDFH.historyitem_Style_UnhideWhenUsed]  = CChangesStyleUnhideWhenUsed;
AscDFH.changesFactory[AscDFH.historyitem_Style_Link]            = CChangesStyleLink;

AscDFH.changesFactory[AscDFH.historyitem_Styles_Add]                              = CChangesStylesAdd;
AscDFH.changesFactory[AscDFH.historyitem_Styles_Remove]                           = CChangesStylesRemove;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultTextPr]              = CChangesStylesChangeDefaultTextPr;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultParaPr]              = CChangesStylesChangeDefaultParaPr;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultParagraphId]         = CChangesStylesChangeDefaultParagraphId;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultCharacterId]         = CChangesStylesChangeDefaultCharacterId;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultNumberingId]         = CChangesStylesChangeDefaultNumberingId;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultTableId]             = CChangesStylesChangeDefaultTableId;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultTableGridId]         = CChangesStylesChangeDefaultTableGridId;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultHeadingsId]          = CChangesStylesChangeDefaultHeadingsId;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultParaListId]          = CChangesStylesChangeDefaultParaListId;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultHeaderId]            = CChangesStylesChangeDefaultHeaderId;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultFooterId]            = CChangesStylesChangeDefaultFooterId;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultHyperlinkId]         = CChangesStylesChangeDefaultHyperlinkId;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultFootnoteTextId]      = CChangesStylesChangeDefaultFootnoteTextId;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultFootnoteTextCharId]  = CChangesStylesChangeDefaultFootnoteTextCharId;
AscDFH.changesFactory[AscDFH.historyitem_Styles_ChangeDefaultFootnoteReferenceId] = CChangesStylesChangeDefaultFootnoteReferenceId;

//----------------------------------------------------------------------------------------------------------------------
// Карта зависимости изменений
//----------------------------------------------------------------------------------------------------------------------
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TextPr]          = [AscDFH.historyitem_Style_TextPr];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_ParaPr]          = [AscDFH.historyitem_Style_ParaPr];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TablePr]         = [AscDFH.historyitem_Style_TablePr];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableRowPr]      = [AscDFH.historyitem_Style_TableRowPr];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableCellPr]     = [AscDFH.historyitem_Style_TableCellPr];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableBand1Horz]  = [AscDFH.historyitem_Style_TableBand1Horz];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableBand1Vert]  = [AscDFH.historyitem_Style_TableBand1Vert];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableBand2Horz]  = [AscDFH.historyitem_Style_TableBand2Horz];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableBand2Vert]  = [AscDFH.historyitem_Style_TableBand2Vert];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableFirstCol]   = [AscDFH.historyitem_Style_TableFirstCol];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableFirstRow]   = [AscDFH.historyitem_Style_TableFirstRow];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableLastCol]    = [AscDFH.historyitem_Style_TableLastCol];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableLastRow]    = [AscDFH.historyitem_Style_TableLastRow];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableTLCell]     = [AscDFH.historyitem_Style_TableTLCell];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableTRCell]     = [AscDFH.historyitem_Style_TableTRCell];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableBLCell]     = [AscDFH.historyitem_Style_TableBLCell];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableBRCell]     = [AscDFH.historyitem_Style_TableBRCell];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_TableWholeTable] = [AscDFH.historyitem_Style_TableWholeTable];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_Name]            = [AscDFH.historyitem_Style_Name];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_BasedOn]         = [AscDFH.historyitem_Style_BasedOn];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_Next]            = [AscDFH.historyitem_Style_Next];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_Type]            = [AscDFH.historyitem_Style_Type];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_QFormat]         = [AscDFH.historyitem_Style_QFormat];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_UiPriority]      = [AscDFH.historyitem_Style_UiPriority];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_Hidden]          = [AscDFH.historyitem_Style_Hidden];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_SemiHidden]      = [AscDFH.historyitem_Style_SemiHidden];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_UnhideWhenUsed]  = [AscDFH.historyitem_Style_UnhideWhenUsed];
AscDFH.changesRelationMap[AscDFH.historyitem_Style_Link]            = [AscDFH.historyitem_Style_Link];

AscDFH.changesRelationMap[AscDFH.historyitem_Styles_Add]                 = [
	AscDFH.historyitem_Styles_Add,
	AscDFH.historyitem_Styles_Remove
];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_Remove]              = [
	AscDFH.historyitem_Styles_Add,
	AscDFH.historyitem_Styles_Remove
];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultTextPr]              = [AscDFH.historyitem_Styles_ChangeDefaultTextPr];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultParaPr]              = [AscDFH.historyitem_Styles_ChangeDefaultParaPr];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultParagraphId]         = [AscDFH.historyitem_Styles_ChangeDefaultParagraphId];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultCharacterId]         = [AscDFH.historyitem_Styles_ChangeDefaultCharacterId];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultNumberingId]         = [AscDFH.historyitem_Styles_ChangeDefaultNumberingId];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultTableId]             = [AscDFH.historyitem_Styles_ChangeDefaultTableId];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultTableGridId]         = [AscDFH.historyitem_Styles_ChangeDefaultTableGridId];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultHeadingsId]          = [AscDFH.historyitem_Styles_ChangeDefaultHeadingsId];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultParaListId]          = [AscDFH.historyitem_Styles_ChangeDefaultParaListId];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultHeaderId]            = [AscDFH.historyitem_Styles_ChangeDefaultHeaderId];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultFooterId]            = [AscDFH.historyitem_Styles_ChangeDefaultFooterId];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultHyperlinkId]         = [AscDFH.historyitem_Styles_ChangeDefaultHyperlinkId];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultFootnoteTextId]      = [AscDFH.historyitem_Styles_ChangeDefaultFootnoteTextId];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultFootnoteTextCharId]  = [AscDFH.historyitem_Styles_ChangeDefaultFootnoteTextCharId];
AscDFH.changesRelationMap[AscDFH.historyitem_Styles_ChangeDefaultFootnoteReferenceId] = [AscDFH.historyitem_Styles_ChangeDefaultFootnoteReferenceId];
//----------------------------------------------------------------------------------------------------------------------


/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectValue}
 */
function CChangesStyleBaseObjectProperty(Class, Old, New)
{
	CChangesStyleBaseObjectProperty.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleBaseObjectProperty, AscDFH.CChangesBaseObjectValue);
CChangesStyleBaseObjectProperty.prototype.Load = function()
{
	this.Redo();
	AscCommon.CollaborativeEditing.Add_LinkData(this.Class, {StyleUpdate : true});
};
/**
 * Базовый класс для строковых параметров у стиля.
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesStyleBaseStringProperty(Class, Old, New)
{
	CChangesStyleBaseStringProperty.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleBaseStringProperty, AscDFH.CChangesBaseProperty);
CChangesStyleBaseStringProperty.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Is undefined new
	// 2-bit : Is null new
	// 3-bit : Is undefined old
	// 4-bit : Is null old
	// String : New (1,2 - bits are zero)
	// String : Old (3,4 - bits are zero)

	var nFlags = 0;

	if (undefined === this.New)
		nFlags |= 1;
	else if (null === this.New)
		nFlags |= 2;

	if (undefined === this.Old)
		nFlags |= 4;
	else if (null === this.Old)
		nFlags |= 8;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New && null !== this.New)
		Writer.WriteString2(this.New);

	if (undefined !== this.Old && null !== this.Old)
		Writer.WriteString2(this.Old);
};
CChangesStyleBaseStringProperty.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Is undefined new
	// 2-bit : Is null new
	// 3-bit : Is undefined old
	// 4-bit : Is null old
	// String : New (1,2 - bits are zero)
	// String : Old (3,4 - bits are zero)

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.New = undefined;
	else if (nFlags & 2)
		this.New = null;
	else
		this.New = Reader.GetString2();

	if (nFlags & 4)
		this.Old = undefined;
	else if (nFlags & 8)
		this.Old = null;
	else
		this.Old = Reader.GetString2();
};
CChangesStyleBaseStringProperty.prototype.Load = function()
{
	this.Redo();
	AscCommon.CollaborativeEditing.Add_LinkData(this.Class, {StyleUpdate : true});
};
/**
 * Базовый класс для строковых параметров у стиля.
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesStyleBaseBoolProperty(Class, Old, New)
{
	CChangesStyleBaseBoolProperty.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleBaseBoolProperty, AscDFH.CChangesBaseProperty);
CChangesStyleBaseBoolProperty.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Is undefined new
	// 2-bit : Is null new
	// 3-bit : Is undefined old
	// 4-bit : Is null old
	// Bool : New (1,2 - bits are zero)
	// Bool : Old (3,4 - bits are zero)

	var nFlags = 0;

	if (undefined === this.New)
		nFlags |= 1;
	else if (null === this.New)
		nFlags |= 2;

	if (undefined === this.Old)
		nFlags |= 4;
	else if (null === this.Old)
		nFlags |= 8;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New && null !== this.New)
		Writer.WriteBool(this.New);

	if (undefined !== this.Old && null !== this.Old)
		Writer.WriteBool(this.Old);
};
CChangesStyleBaseBoolProperty.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Is undefined new
	// 2-bit : Is null new
	// 3-bit : Is undefined old
	// 4-bit : Is null old
	// Bool : New (1,2 - bits are zero)
	// Bool : Old (3,4 - bits are zero)

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.New = undefined;
	else if (nFlags & 2)
		this.New = null;
	else
		this.New = Reader.GetBool();

	if (nFlags & 4)
		this.Old = undefined;
	else if (nFlags & 8)
		this.Old = null;
	else
		this.Old = Reader.GetBool();
};
CChangesStyleBaseBoolProperty.prototype.Load = function()
{
	this.Redo();
	AscCommon.CollaborativeEditing.Add_LinkData(this.Class, {StyleUpdate : true});
};
/**
 * Базовый класс для строковых параметров у стиля.
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesStyleBaseLongProperty(Class, Old, New)
{
	CChangesStyleBaseLongProperty.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleBaseLongProperty, AscDFH.CChangesBaseProperty);
CChangesStyleBaseLongProperty.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Is undefined new
	// 2-bit : Is null new
	// 3-bit : Is undefined old
	// 4-bit : Is null old
	// Long : New (1,2 - bits are zero)
	// Long : Old (3,4 - bits are zero)

	var nFlags = 0;

	if (undefined === this.New)
		nFlags |= 1;
	else if (null === this.New)
		nFlags |= 2;

	if (undefined === this.Old)
		nFlags |= 4;
	else if (null === this.Old)
		nFlags |= 8;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New && null !== this.New)
		Writer.WriteLong(this.New);

	if (undefined !== this.Old && null !== this.Old)
		Writer.WriteLong(this.Old);
};
CChangesStyleBaseLongProperty.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Is undefined new
	// 2-bit : Is null new
	// 3-bit : Is undefined old
	// 4-bit : Is null old
	// Long : New (1,2 - bits are zero)
	// Long : Old (3,4 - bits are zero)

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.New = undefined;
	else if (nFlags & 2)
		this.New = null;
	else
		this.New = Reader.GetLong();

	if (nFlags & 4)
		this.Old = undefined;
	else if (nFlags & 8)
		this.Old = null;
	else
		this.Old = Reader.GetLong();
};
CChangesStyleBaseLongProperty.prototype.Load = function()
{
	this.Redo();
	AscCommon.CollaborativeEditing.Add_LinkData(this.Class, {StyleUpdate : true});
};


/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTextPr(Class, Old, New, Color)
{
	CChangesStyleTextPr.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTextPr, CChangesStyleBaseObjectProperty);
CChangesStyleTextPr.prototype.Type = AscDFH.historyitem_Style_TextPr;
CChangesStyleTextPr.prototype.private_CreateObject = function()
{
	return new CTextPr();
};
CChangesStyleTextPr.prototype.private_SetValue = function(Value)
{
	this.Class.TextPr = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleParaPr(Class, Old, New, Color)
{
	CChangesStyleParaPr.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleParaPr, CChangesStyleBaseObjectProperty);
CChangesStyleParaPr.prototype.Type = AscDFH.historyitem_Style_ParaPr;
CChangesStyleParaPr.prototype.private_CreateObject = function()
{
	return new CParaPr();
};
CChangesStyleParaPr.prototype.private_SetValue = function(Value)
{
	this.Class.ParaPr = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTablePr(Class, Old, New, Color)
{
	CChangesStyleTablePr.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTablePr, CChangesStyleBaseObjectProperty);
CChangesStyleTablePr.prototype.Type = AscDFH.historyitem_Style_TablePr;
CChangesStyleTablePr.prototype.private_CreateObject = function()
{
	return new CTablePr();
};
CChangesStyleTablePr.prototype.private_SetValue = function(Value)
{
	this.Class.TablePr = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableRowPr(Class, Old, New, Color)
{
	CChangesStyleTableRowPr.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableRowPr, CChangesStyleBaseObjectProperty);
CChangesStyleTableRowPr.prototype.Type = AscDFH.historyitem_Style_TableRowPr;
CChangesStyleTableRowPr.prototype.private_CreateObject = function()
{
	return new CTableRowPr();
};
CChangesStyleTableRowPr.prototype.private_SetValue = function(Value)
{
	this.Class.TableRowPr = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableCellPr(Class, Old, New, Color)
{
	CChangesStyleTableCellPr.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableCellPr, CChangesStyleBaseObjectProperty);
CChangesStyleTableCellPr.prototype.Type = AscDFH.historyitem_Style_TableCellPr;
CChangesStyleTableCellPr.prototype.private_CreateObject = function()
{
	return new CTableCellPr();
};
CChangesStyleTableCellPr.prototype.private_SetValue = function(Value)
{
	this.Class.TableCellPr = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableBand1Horz(Class, Old, New, Color)
{
	CChangesStyleTableBand1Horz.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableBand1Horz, CChangesStyleBaseObjectProperty);
CChangesStyleTableBand1Horz.prototype.Type = AscDFH.historyitem_Style_TableBand1Horz;
CChangesStyleTableBand1Horz.prototype.private_CreateObject = function()
{
	return new CTableStylePr();
};
CChangesStyleTableBand1Horz.prototype.private_SetValue = function(Value)
{
	this.Class.TableBand1Horz = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableBand1Vert(Class, Old, New, Color)
{
	CChangesStyleTableBand1Vert.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableBand1Vert, CChangesStyleBaseObjectProperty);
CChangesStyleTableBand1Vert.prototype.Type = AscDFH.historyitem_Style_TableBand1Vert;
CChangesStyleTableBand1Vert.prototype.private_CreateObject = function()
{
	return new CTableStylePr();
};
CChangesStyleTableBand1Vert.prototype.private_SetValue = function(Value)
{
	this.Class.TableBand1Vert = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableBand2Horz(Class, Old, New, Color)
{
	CChangesStyleTableBand2Horz.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableBand2Horz, CChangesStyleBaseObjectProperty);
CChangesStyleTableBand2Horz.prototype.Type = AscDFH.historyitem_Style_TableBand2Horz;
CChangesStyleTableBand2Horz.prototype.private_CreateObject = function()
{
	return new CTableStylePr();
};
CChangesStyleTableBand2Horz.prototype.private_SetValue = function(Value)
{
	this.Class.TableBand2Horz = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableBand2Vert(Class, Old, New, Color)
{
	CChangesStyleTableBand2Vert.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableBand2Vert, CChangesStyleBaseObjectProperty);
CChangesStyleTableBand2Vert.prototype.Type = AscDFH.historyitem_Style_TableBand2Vert;
CChangesStyleTableBand2Vert.prototype.private_CreateObject = function()
{
	return new CTableStylePr();
};
CChangesStyleTableBand2Vert.prototype.private_SetValue = function(Value)
{
	this.Class.TableBand2Vert = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableFirstCol(Class, Old, New, Color)
{
	CChangesStyleTableFirstCol.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableFirstCol, CChangesStyleBaseObjectProperty);
CChangesStyleTableFirstCol.prototype.Type = AscDFH.historyitem_Style_TableFirstCol;
CChangesStyleTableFirstCol.prototype.private_CreateObject = function()
{
	return new CTableStylePr();
};
CChangesStyleTableFirstCol.prototype.private_SetValue = function(Value)
{
	this.Class.TableFirstCol = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableFirstRow(Class, Old, New, Color)
{
	CChangesStyleTableFirstRow.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableFirstRow, CChangesStyleBaseObjectProperty);
CChangesStyleTableFirstRow.prototype.Type = AscDFH.historyitem_Style_TableFirstRow;
CChangesStyleTableFirstRow.prototype.private_CreateObject = function()
{
	return new CTableStylePr();
};
CChangesStyleTableFirstRow.prototype.private_SetValue = function(Value)
{
	this.Class.TableFirstRow = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableLastCol(Class, Old, New, Color)
{
	CChangesStyleTableLastCol.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableLastCol, CChangesStyleBaseObjectProperty);
CChangesStyleTableLastCol.prototype.Type = AscDFH.historyitem_Style_TableLastCol;
CChangesStyleTableLastCol.prototype.private_CreateObject = function()
{
	return new CTableStylePr();
};
CChangesStyleTableLastCol.prototype.private_SetValue = function(Value)
{
	this.Class.TableLastCol = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableLastRow(Class, Old, New, Color)
{
	CChangesStyleTableLastRow.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableLastRow, CChangesStyleBaseObjectProperty);
CChangesStyleTableLastRow.prototype.Type = AscDFH.historyitem_Style_TableLastRow;
CChangesStyleTableLastRow.prototype.private_CreateObject = function()
{
	return new CTableStylePr();
};
CChangesStyleTableLastRow.prototype.private_SetValue = function(Value)
{
	this.Class.TableLastRow = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableTLCell(Class, Old, New, Color)
{
	CChangesStyleTableTLCell.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableTLCell, CChangesStyleBaseObjectProperty);
CChangesStyleTableTLCell.prototype.Type = AscDFH.historyitem_Style_TableTLCell;
CChangesStyleTableTLCell.prototype.private_CreateObject = function()
{
	return new CTableStylePr();
};
CChangesStyleTableTLCell.prototype.private_SetValue = function(Value)
{
	this.Class.TableTLCell = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableTRCell(Class, Old, New, Color)
{
	CChangesStyleTableTRCell.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableTRCell, CChangesStyleBaseObjectProperty);
CChangesStyleTableTRCell.prototype.Type = AscDFH.historyitem_Style_TableTRCell;
CChangesStyleTableTRCell.prototype.private_CreateObject = function()
{
	return new CTableStylePr();
};
CChangesStyleTableTRCell.prototype.private_SetValue = function(Value)
{
	this.Class.TableTRCell = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableBLCell(Class, Old, New, Color)
{
	CChangesStyleTableBLCell.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableBLCell, CChangesStyleBaseObjectProperty);
CChangesStyleTableBLCell.prototype.Type = AscDFH.historyitem_Style_TableBLCell;
CChangesStyleTableBLCell.prototype.private_CreateObject = function()
{
	return new CTableStylePr();
};
CChangesStyleTableBLCell.prototype.private_SetValue = function(Value)
{
	this.Class.TableBLCell = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableBRCell(Class, Old, New, Color)
{
	CChangesStyleTableBRCell.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableBRCell, CChangesStyleBaseObjectProperty);
CChangesStyleTableBRCell.prototype.Type = AscDFH.historyitem_Style_TableBRCell;
CChangesStyleTableBRCell.prototype.private_CreateObject = function()
{
	return new CTableStylePr();
};
CChangesStyleTableBRCell.prototype.private_SetValue = function(Value)
{
	this.Class.TableBRCell = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseObjectProperty}
 */
function CChangesStyleTableWholeTable(Class, Old, New, Color)
{
	CChangesStyleTableWholeTable.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesStyleTableWholeTable, CChangesStyleBaseObjectProperty);
CChangesStyleTableWholeTable.prototype.Type = AscDFH.historyitem_Style_TableWholeTable;
CChangesStyleTableWholeTable.prototype.private_CreateObject = function()
{
	return new CTableStylePr();
};
CChangesStyleTableWholeTable.prototype.private_SetValue = function(Value)
{
	this.Class.TableWholeTable = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStyleName(Class, Old, New)
{
	CChangesStyleName.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleName, CChangesStyleBaseStringProperty);
CChangesStyleName.prototype.Type = AscDFH.historyitem_Style_Name;
CChangesStyleName.prototype.private_SetValue = function(Value)
{
	this.Class.Name = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStyleBasedOn(Class, Old, New)
{
	CChangesStyleBasedOn.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleBasedOn, CChangesStyleBaseStringProperty);
CChangesStyleBasedOn.prototype.Type = AscDFH.historyitem_Style_BasedOn;
CChangesStyleBasedOn.prototype.private_SetValue = function(Value)
{
	this.Class.BasedOn = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStyleNext(Class, Old, New)
{
	CChangesStyleNext.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleNext, CChangesStyleBaseStringProperty);
CChangesStyleNext.prototype.Type = AscDFH.historyitem_Style_Next;
CChangesStyleNext.prototype.private_SetValue = function(Value)
{
	this.Class.Next = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongValue}
 */
function CChangesStyleType(Class, Old, New)
{
	CChangesStyleType.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleType, AscDFH.CChangesBaseLongValue);
CChangesStyleType.prototype.Type = AscDFH.historyitem_Style_Type;
CChangesStyleType.prototype.private_SetValue = function(Value)
{
	this.Class.Type = Value;
};
CChangesStyleType.prototype.Load = function()
{
	this.Redo();
	AscCommon.CollaborativeEditing.Add_LinkData(this.Class, {StyleUpdate : true});
};
/**
 * @constructor
 * @extends {CChangesStyleBaseBoolProperty}
 */
function CChangesStyleQFormat(Class, Old, New)
{
	CChangesStyleQFormat.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleQFormat, CChangesStyleBaseBoolProperty);
CChangesStyleQFormat.prototype.Type = AscDFH.historyitem_Style_QFormat;
CChangesStyleQFormat.prototype.private_SetValue = function(Value)
{
	this.Class.qFormat = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseLongProperty}
 */
function CChangesStyleUiPriority(Class, Old, New)
{
	CChangesStyleUiPriority.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleUiPriority, CChangesStyleBaseLongProperty);
CChangesStyleUiPriority.prototype.Type = AscDFH.historyitem_Style_UiPriority;
CChangesStyleUiPriority.prototype.private_SetValue = function(Value)
{
	this.Class.uiPriority = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseBoolProperty}
 */
function CChangesStyleHidden(Class, Old, New)
{
	CChangesStyleHidden.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleHidden, CChangesStyleBaseBoolProperty);
CChangesStyleHidden.prototype.Type = AscDFH.historyitem_Style_Hidden;
CChangesStyleHidden.prototype.private_SetValue = function(Value)
{
	this.Class.hidden = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseBoolProperty}
 */
function CChangesStyleSemiHidden(Class, Old, New)
{
	CChangesStyleSemiHidden.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleSemiHidden, CChangesStyleBaseBoolProperty);
CChangesStyleSemiHidden.prototype.Type = AscDFH.historyitem_Style_SemiHidden;
CChangesStyleSemiHidden.prototype.private_SetValue = function(Value)
{
	this.Class.semiHidden = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseBoolProperty}
 */
function CChangesStyleUnhideWhenUsed(Class, Old, New)
{
	CChangesStyleUnhideWhenUsed.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleUnhideWhenUsed, CChangesStyleBaseBoolProperty);
CChangesStyleUnhideWhenUsed.prototype.Type = AscDFH.historyitem_Style_UnhideWhenUsed;
CChangesStyleUnhideWhenUsed.prototype.private_SetValue = function(Value)
{
	this.Class.unhideWhenUsed = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStyleLink(Class, Old, New)
{
	CChangesStyleLink.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStyleLink, CChangesStyleBaseStringProperty);
CChangesStyleLink.prototype.Type = AscDFH.historyitem_Style_Link;
CChangesStyleLink.prototype.private_SetValue = function(Value)
{
	this.Class.Link = Value;
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesStylesAdd(Class, Id, Style)
{
	CChangesStylesAdd.superclass.constructor.call(this, Class);

	this.Id    = Id;
	this.Style = Style;
}
AscCommon.extendClass(CChangesStylesAdd, AscDFH.CChangesBase);
CChangesStylesAdd.prototype.Type = AscDFH.historyitem_Styles_Add;
CChangesStylesAdd.prototype.Undo = function()
{
	delete this.Class.Style[this.Id];
	this.Class.Update_Interface(this.Id);
};
CChangesStylesAdd.prototype.Redo = function()
{
	this.Class.Style[this.Id] = this.Style;
	this.Class.Update_Interface(this.Id);
};
CChangesStylesAdd.prototype.WriteToBinary = function(Writer)
{
	// String : Id
	Writer.WriteString2(this.Id);
};
CChangesStylesAdd.prototype.ReadFromBinary = function(Reader)
{
	// String : Id
	this.Id    = Reader.GetString2();
	this.Style = AscCommon.g_oTableId.Get_ById(this.Id);
};
CChangesStylesAdd.prototype.Load = function()
{
	this.Redo();
	AscCommon.CollaborativeEditing.Add_LinkData(this.Class, {UpdateStyleId : this.Id});
};
CChangesStylesAdd.prototype.CreateReverseChange = function()
{
	return new CChangesStylesRemove(this.Class, this.Id, this.Style);
};
CChangesStylesAdd.prototype.Merge = function(oChange)
{
	if (this.Class !== oChange.Class)
		return true;

	if ((AscDFH.historyitem_Styles_Add === oChange.Type || AscDFH.historyitem_Styles_Remove === oChange.Type) && this.Id === oChange.Id)
		return false;

	return true;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesStylesRemove(Class, Id, Style)
{
	CChangesStylesRemove.superclass.constructor.call(this, Class);

	this.Id    = Id;
	this.Style = Style;
}
AscCommon.extendClass(CChangesStylesRemove, AscDFH.CChangesBase);
CChangesStylesRemove.prototype.Type = AscDFH.historyitem_Styles_Remove;
CChangesStylesRemove.prototype.Undo = function()
{
	this.Class.Style[this.Id] = this.Style;
	this.Class.Update_Interface(this.Id);
};
CChangesStylesRemove.prototype.Redo = function()
{
	delete this.Class.Style[this.Id];
	this.Class.Update_Interface(this.Id);
};
CChangesStylesRemove.prototype.WriteToBinary = function(Writer)
{
	// String : Id
	Writer.WriteString2(this.Id);
};
CChangesStylesRemove.prototype.ReadFromBinary = function(Reader)
{
	// String : Id
	this.Id    = Reader.GetString2();
	this.Style = AscCommon.g_oTableId.Get_ById(this.Id);
};
CChangesStylesRemove.prototype.Load = function()
{
	this.Redo();
	AscCommon.CollaborativeEditing.Add_LinkData(this.Class, {UpdateStyleId : this.Id});
};
CChangesStylesRemove.prototype.CreateReverseChange = function()
{
	return new CChangesStylesAdd(this.Class, this.Id, this.Style);
};
CChangesStylesRemove.prototype.Merge = function(oChange)
{
	if (this.Class !== oChange.Class)
		return true;

	if ((AscDFH.historyitem_Styles_Add === oChange.Type || AscDFH.historyitem_Styles_Remove === oChange.Type) && this.Id === oChange.Id)
		return false;

	return true;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectValue}
 */
function CChangesStylesChangeDefaultTextPr(Class, Old, New)
{
	CChangesStylesChangeDefaultTextPr.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultTextPr, AscDFH.CChangesBaseObjectValue);
CChangesStylesChangeDefaultTextPr.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultTextPr;
CChangesStylesChangeDefaultTextPr.prototype.private_CreateObject = function()
{
	return new CTextPr();
};
CChangesStylesChangeDefaultTextPr.prototype.private_SetValue = function(Value)
{
	this.Class.Default.TextPr = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectValue}
 */
function CChangesStylesChangeDefaultParaPr(Class, Old, New)
{
	CChangesStylesChangeDefaultParaPr.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultParaPr, AscDFH.CChangesBaseObjectValue);
CChangesStylesChangeDefaultParaPr.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultParaPr;
CChangesStylesChangeDefaultParaPr.prototype.private_CreateObject = function()
{
	return new CParaPr();
};
CChangesStylesChangeDefaultParaPr.prototype.private_SetValue = function(Value)
{
	this.Class.Default.ParaPr = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStylesChangeDefaultParagraphId(Class, Old, New)
{
	CChangesStylesChangeDefaultParagraphId.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultParagraphId, CChangesStyleBaseStringProperty);
CChangesStylesChangeDefaultParagraphId.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultParagraphId;
CChangesStylesChangeDefaultParagraphId.prototype.private_SetValue = function(Value)
{
	this.Class.Default.Paragraph = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStylesChangeDefaultCharacterId(Class, Old, New)
{
	CChangesStylesChangeDefaultCharacterId.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultCharacterId, CChangesStyleBaseStringProperty);
CChangesStylesChangeDefaultCharacterId.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultCharacterId;
CChangesStylesChangeDefaultCharacterId.prototype.private_SetValue = function(Value)
{
	this.Class.Default.Character = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStylesChangeDefaultNumberingId(Class, Old, New)
{
	CChangesStylesChangeDefaultNumberingId.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultNumberingId, CChangesStyleBaseStringProperty);
CChangesStylesChangeDefaultNumberingId.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultNumberingId;
CChangesStylesChangeDefaultNumberingId.prototype.private_SetValue = function(Value)
{
	this.Class.Default.Numbering = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStylesChangeDefaultTableId(Class, Old, New)
{
	CChangesStylesChangeDefaultTableId.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultTableId, CChangesStyleBaseStringProperty);
CChangesStylesChangeDefaultTableId.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultTableId;
CChangesStylesChangeDefaultTableId.prototype.private_SetValue = function(Value)
{
	this.Class.Default.Table = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStylesChangeDefaultTableGridId(Class, Old, New)
{
	CChangesStylesChangeDefaultTableGridId.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultTableGridId, CChangesStyleBaseStringProperty);
CChangesStylesChangeDefaultTableGridId.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultTableGridId;
CChangesStylesChangeDefaultTableGridId.prototype.private_SetValue = function(Value)
{
	this.Class.Default.TableGrid = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesStylesChangeDefaultHeadingsId(Class, Old, New, Lvl)
{
	CChangesStylesChangeDefaultHeadingsId.superclass.constructor.call(this, Class, Old, New);
	this.Lvl = Lvl;
}
AscCommon.extendClass(CChangesStylesChangeDefaultHeadingsId, AscDFH.CChangesBaseProperty);
CChangesStylesChangeDefaultHeadingsId.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultHeadingsId;
CChangesStylesChangeDefaultHeadingsId.prototype.private_SetValue = function(Value)
{
	this.Class.Default.Headings[this.Lvl] = Value;
};
CChangesStylesChangeDefaultHeadingsId.prototype.WriteToBinary = function(Writer)
{
	// Long  : Lvl
	// Long  : Flag
	// 1-bit : Is undefined new
	// 2-bit : Is null new
	// 3-bit : Is undefined old
	// 4-bit : Is null old
	// String : New (1,2 - bits are zero)
	// String : Old (3,4 - bits are zero)


	Writer.WriteLong(this.Lvl);

	var nFlags = 0;
	if (undefined === this.New)
		nFlags |= 1;
	else if (null === this.New)
		nFlags |= 2;

	if (undefined === this.Old)
		nFlags |= 4;
	else if (null === this.Old)
		nFlags |= 8;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New && null !== this.New)
		Writer.WriteString2(this.New);

	if (undefined !== this.Old && null !== this.Old)
		Writer.WriteString2(this.Old);
};
CChangesStylesChangeDefaultHeadingsId.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Lvl
	// Long  : Flag
	// 1-bit : Is undefined new
	// 2-bit : Is null new
	// 3-bit : Is undefined old
	// 4-bit : Is null old
	// String : New (1,2 - bits are zero)
	// String : Old (3,4 - bits are zero)

	this.Lvl = Reader.GetLong();

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.New = undefined;
	else if (nFlags & 2)
		this.New = null;
	else
		this.New = Reader.GetString2();

	if (nFlags & 4)
		this.Old = undefined;
	else if (nFlags & 8)
		this.Old = null;
	else
		this.Old = Reader.GetString2();
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStylesChangeDefaultParaListId(Class, Old, New)
{
	CChangesStylesChangeDefaultParaListId.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultParaListId, CChangesStyleBaseStringProperty);
CChangesStylesChangeDefaultParaListId.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultParaListId;
CChangesStylesChangeDefaultParaListId.prototype.private_SetValue = function(Value)
{
	this.Class.Default.ParaList = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStylesChangeDefaultHeaderId(Class, Old, New)
{
	CChangesStylesChangeDefaultHeaderId.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultHeaderId, CChangesStyleBaseStringProperty);
CChangesStylesChangeDefaultHeaderId.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultHeaderId;
CChangesStylesChangeDefaultHeaderId.prototype.private_SetValue = function(Value)
{
	this.Class.Default.Header = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStylesChangeDefaultFooterId(Class, Old, New)
{
	CChangesStylesChangeDefaultFooterId.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultFooterId, CChangesStyleBaseStringProperty);
CChangesStylesChangeDefaultFooterId.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultFooterId;
CChangesStylesChangeDefaultFooterId.prototype.private_SetValue = function(Value)
{
	this.Class.Default.Footer = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStylesChangeDefaultHyperlinkId(Class, Old, New)
{
	CChangesStylesChangeDefaultHyperlinkId.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultHyperlinkId, CChangesStyleBaseStringProperty);
CChangesStylesChangeDefaultHyperlinkId.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultHyperlinkId;
CChangesStylesChangeDefaultHyperlinkId.prototype.private_SetValue = function(Value)
{
	this.Class.Default.Header = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStylesChangeDefaultFootnoteTextId(Class, Old, New)
{
	CChangesStylesChangeDefaultFootnoteTextId.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultFootnoteTextId, CChangesStyleBaseStringProperty);
CChangesStylesChangeDefaultFootnoteTextId.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultFootnoteTextId;
CChangesStylesChangeDefaultFootnoteTextId.prototype.private_SetValue = function(Value)
{
	this.Class.Default.FootnoteText = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStylesChangeDefaultFootnoteTextCharId(Class, Old, New)
{
	CChangesStylesChangeDefaultFootnoteTextCharId.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultFootnoteTextCharId, CChangesStyleBaseStringProperty);
CChangesStylesChangeDefaultFootnoteTextCharId.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultFootnoteTextCharId;
CChangesStylesChangeDefaultFootnoteTextCharId.prototype.private_SetValue = function(Value)
{
	this.Class.Default.FootnoteTextChar = Value;
};
/**
 * @constructor
 * @extends {CChangesStyleBaseStringProperty}
 */
function CChangesStylesChangeDefaultFootnoteReferenceId(Class, Old, New)
{
	CChangesStylesChangeDefaultFootnoteReferenceId.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesStylesChangeDefaultFootnoteReferenceId, CChangesStyleBaseStringProperty);
CChangesStylesChangeDefaultFootnoteReferenceId.prototype.Type = AscDFH.historyitem_Styles_ChangeDefaultFootnoteReferenceId;
CChangesStylesChangeDefaultFootnoteReferenceId.prototype.private_SetValue = function(Value)
{
	this.Class.Default.FootnoteReference = Value;
};