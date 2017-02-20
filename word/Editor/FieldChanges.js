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
 * Date: 10.11.2016
 * Time: 18:59
 */

AscDFH.changesFactory[AscDFH.historyitem_Field_AddItem]              = CChangesParaFieldAddItem;
AscDFH.changesFactory[AscDFH.historyitem_Field_RemoveItem]           = CChangesParaFieldRemoveItem;
AscDFH.changesFactory[AscDFH.historyitem_Field_FormFieldName]        = CChangesParaFieldFormFieldName;
AscDFH.changesFactory[AscDFH.historyitem_Field_FormFieldDefaultText] = CChangesParaFieldFormFieldDefaultText;

//----------------------------------------------------------------------------------------------------------------------
// Карта зависимости изменений
//----------------------------------------------------------------------------------------------------------------------
AscDFH.changesRelationMap[AscDFH.historyitem_Field_AddItem]              = [AscDFH.historyitem_Field_AddItem, AscDFH.historyitem_Field_RemoveItem];
AscDFH.changesRelationMap[AscDFH.historyitem_Field_RemoveItem]           = [AscDFH.historyitem_Field_AddItem, AscDFH.historyitem_Field_RemoveItem];
AscDFH.changesRelationMap[AscDFH.historyitem_Field_FormFieldName]        = [AscDFH.historyitem_Field_FormFieldName];
AscDFH.changesRelationMap[AscDFH.historyitem_Field_FormFieldDefaultText] = [AscDFH.historyitem_Field_FormFieldDefaultText];
//----------------------------------------------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {AscDFH.CChangesBaseContentChange}
 */
function CChangesParaFieldAddItem(Class, Pos, Items)
{
	CChangesParaFieldAddItem.superclass.constructor.call(this, Class, Pos, Items, true);
}
AscCommon.extendClass(CChangesParaFieldAddItem, AscDFH.CChangesBaseContentChange);
CChangesParaFieldAddItem.prototype.Type = AscDFH.historyitem_Field_AddItem;
CChangesParaFieldAddItem.prototype.Undo = function()
{
	var oField = this.Class;
	oField.Content.splice(this.Pos, this.Items.length);
	oField.protected_UpdateSpellChecking();
	oField.private_UpdateTrackRevisions();
};
CChangesParaFieldAddItem.prototype.Redo = function()
{
	var oField = this.Class;

	var Array_start = oField.Content.slice(0, this.Pos);
	var Array_end   = oField.Content.slice(this.Pos);

	oField.Content = Array_start.concat(this.Items, Array_end);
	oField.private_UpdateTrackRevisions();
	oField.protected_UpdateSpellChecking();
};
CChangesParaFieldAddItem.prototype.private_WriteItem = function(Writer, Item)
{
	Writer.WriteString2(Item.Get_Id());
};
CChangesParaFieldAddItem.prototype.private_ReadItem = function(Reader)
{
	return AscCommon.g_oTableId.Get_ById(Reader.GetString2());
};
CChangesParaFieldAddItem.prototype.Load = function(Color)
{
	var oField = this.Class;
	for (var nIndex = 0, nCount = this.Items.length; nIndex < nCount; ++nIndex)
	{
		var Pos     = oField.m_oContentChanges.Check(AscCommon.contentchanges_Add, this.PosArray[nIndex]);
		var Element = this.Items[nIndex];

		if (null != Element)
		{
			oField.Content.splice(Pos, 0, Element);
			AscCommon.CollaborativeEditing.Update_DocumentPositionsOnAdd(oField, Pos);
		}
	}

	oField.private_UpdateTrackRevisions();
	oField.protected_UpdateSpellChecking();
};
CChangesParaFieldAddItem.prototype.IsRelated = function(oChanges)
{
	if (this.Class === oChanges.Class && (AscDFH.historyitem_Field_AddItem === oChanges.Type || AscDFH.historyitem_Field_RemoveItem === oChanges.Type))
		return true;

	return false;
};
CChangesParaFieldAddItem.prototype.CreateReverseChange = function()
{
	return this.private_CreateReverseChange(CChangesParaFieldRemoveItem);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseContentChange}
 */
function CChangesParaFieldRemoveItem(Class, Pos, Items)
{
	CChangesParaFieldRemoveItem.superclass.constructor.call(this, Class, Pos, Items, false);
}
AscCommon.extendClass(CChangesParaFieldRemoveItem, AscDFH.CChangesBaseContentChange);
CChangesParaFieldRemoveItem.prototype.Type = AscDFH.historyitem_Field_RemoveItem;
CChangesParaFieldRemoveItem.prototype.Undo = function()
{
	var oField = this.Class;

	var Array_start = oField.Content.slice(0, this.Pos);
	var Array_end   = oField.Content.slice(this.Pos);

	oField.Content = Array_start.concat(this.Items, Array_end);
	oField.protected_UpdateSpellChecking();
	oField.private_UpdateTrackRevisions();
};
CChangesParaFieldRemoveItem.prototype.Redo = function()
{
	var oField = this.Class;
	oField.Content.splice(this.Pos, this.Items.length);
	oField.private_UpdateTrackRevisions();
	oField.protected_UpdateSpellChecking();
};
CChangesParaFieldRemoveItem.prototype.private_WriteItem = function(Writer, Item)
{
	Writer.WriteString2(Item.Get_Id());
};
CChangesParaFieldRemoveItem.prototype.private_ReadItem = function(Reader)
{
	return AscCommon.g_oTableId.Get_ById(Reader.GetString2());
};
CChangesParaFieldRemoveItem.prototype.Load = function(Color)
{
	var oField = this.Class;
	for (var nIndex = 0, nCount = this.Items.length; nIndex < nCount; ++nIndex)
	{
		var ChangesPos = oField.m_oContentChanges.Check(AscCommon.contentchanges_Remove, this.PosArray[nIndex]);

		if (false === ChangesPos)
			continue;

		oField.Content.splice(ChangesPos, 1);
		AscCommon.CollaborativeEditing.Update_DocumentPositionsOnRemove(oField, ChangesPos, 1);
	}
	oField.private_UpdateTrackRevisions();
	oField.protected_UpdateSpellChecking();
};
CChangesParaFieldRemoveItem.prototype.IsRelated = function(oChanges)
{
	if (this.Class === oChanges.Class && (AscDFH.historyitem_Field_AddItem === oChanges.Type || AscDFH.historyitem_Field_RemoveItem === oChanges.Type))
		return true;

	return false;
};
CChangesParaFieldRemoveItem.prototype.CreateReverseChange = function()
{
	return this.private_CreateReverseChange(CChangesParaFieldAddItem);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseStringProperty}
 */
function CChangesParaFieldFormFieldName(Class, Old, New)
{
	CChangesParaFieldFormFieldName.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesParaFieldFormFieldName, AscDFH.CChangesBaseStringProperty);
CChangesParaFieldFormFieldName.prototype.Type = AscDFH.historyitem_Field_FormFieldName;
CChangesParaFieldFormFieldName.prototype.private_SetValue = function(Value)
{
	this.Class.FormFieldName = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseStringProperty}
 */
function CChangesParaFieldFormFieldDefaultText(Class, Old, New)
{
	CChangesParaFieldFormFieldDefaultText.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesParaFieldFormFieldDefaultText, AscDFH.CChangesBaseStringProperty);
CChangesParaFieldFormFieldDefaultText.prototype.Type = AscDFH.historyitem_Field_FormFieldDefaultText;
CChangesParaFieldFormFieldDefaultText.prototype.private_SetValue = function(Value)
{
	this.Class.FormFieldDefaultText = Value;
};