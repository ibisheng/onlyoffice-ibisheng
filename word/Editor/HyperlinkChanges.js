/*
 * (c) Copyright Ascensio System SIA 2010-2016
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
 * Time: 18:59
 */

AscDFH.changesFactory[AscDFH.historyitem_Hyperlink_Value]      = CChangesHyperlinkValue;
AscDFH.changesFactory[AscDFH.historyitem_Hyperlink_ToolTip]    = CChangesHyperlinkToolTip;
AscDFH.changesFactory[AscDFH.historyitem_Hyperlink_AddItem]    = CChangesHyperlinkAddItem;
AscDFH.changesFactory[AscDFH.historyitem_Hyperlink_RemoveItem] = CChangesHyperlinkRemoveItem;

/**
 * @constructor
 * @extends {AscDFH.CChangesBaseStringValue}
 */
function CChangesHyperlinkValue(Class, Old, New, Color)
{
	CChangesHyperlinkValue.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesHyperlinkValue, AscDFH.CChangesBaseStringValue);
CChangesHyperlinkValue.prototype.Type = AscDFH.historyitem_Hyperlink_Value;
CChangesHyperlinkValue.prototype.private_SetValue = function(Value)
{
	this.Class.Value = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseStringValue}
 */
function CChangesHyperlinkToolTip(Class, Old, New, Color)
{
	CChangesHyperlinkToolTip.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesHyperlinkToolTip, AscDFH.CChangesBaseStringValue);
CChangesHyperlinkToolTip.prototype.Type = AscDFH.historyitem_Hyperlink_ToolTip;
CChangesHyperlinkToolTip.prototype.private_SetValue = function(Value)
{
	this.Class.ToolTip = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesHyperlinkAddItem(Class, Pos, Items)
{
	CChangesHyperlinkAddItem.superclass.constructor.call(this, Class);

	this.Pos    = Pos;
	this.Items  = Items;

	this.UseArray = false;
	this.PosArray = [];
}
AscCommon.extendClass(CChangesHyperlinkAddItem, AscDFH.CChangesBase);
CChangesHyperlinkAddItem.prototype.Type = AscDFH.historyitem_Hyperlink_AddItem;
CChangesHyperlinkAddItem.prototype.Undo = function()
{
	var oHyperlink = this.Class;
	oHyperlink.Content.splice(this.Pos, this.Items.length);
	oHyperlink.private_UpdateTrackRevisions();
	oHyperlink.protected_UpdateSpellChecking();
};
CChangesHyperlinkAddItem.prototype.Redo = function()
{
	var oHyperlink = this.Class;
	var Array_start = oHyperlink.Content.slice(0, this.Pos);
	var Array_end   = oHyperlink.Content.slice(this.Pos);

	oHyperlink.Content = Array_start.concat(this.Items, Array_end);
	oHyperlink.private_UpdateTrackRevisions();
	oHyperlink.protected_UpdateSpellChecking();
};
CChangesHyperlinkAddItem.prototype.WriteToBinary = function(Writer)
{
	// Long     : Количество элементов
	// Array of :
	//  {
	//    Long     : Позиция
	//    Variable : Id элемента
	//  }

	var bArray = this.UseArray;
	var nCount = this.Items.length;

	Writer.WriteLong(nCount);
	for (var nIndex = 0; nIndex < nCount; ++nIndex)
	{
		if (true === bArray)
			Writer.WriteLong(this.PosArray[nIndex]);
		else
			Writer.WriteLong(this.Pos + nIndex);

		Writer.WriteString2(this.Items[nIndex].Get_Id());
	}
};
CChangesHyperlinkAddItem.prototype.ReadFromBinary = function(Reader)
{
	// Long     : Количество элементов
	// Array of :
	//  {
	//    Long     : Позиция
	//    Variable : Id Элемента
	//  }

	this.UseArray = true;
	this.Items    = [];
	this.PosArray = [];

	var nCount = Reader.GetLong();
	for (var nIndex = 0; nIndex < nCount; ++nIndex)
	{
		this.PosArray[nIndex] = Reader.GetLong();
		this.Items[nIndex]    = AscCommon.g_oTableId.Get_ById(Reader.GetString2());
	}
};
CChangesHyperlinkAddItem.prototype.Load = function(Color)
{
	var oHyperlink = this.Class;
	for (var nIndex = 0, nCount = this.Items.length; nIndex < nCount; ++nIndex)
	{
		var Pos     = oHyperlink.m_oContentChanges.Check(AscCommon.contentchanges_Add, this.PosArray[nIndex]);
		var Element = this.Items[nIndex];

		if (null != Element)
		{
			oHyperlink.Content.splice(Pos, 0, Element);
			AscCommon.CollaborativeEditing.Update_DocumentPositionsOnAdd(oHyperlink, Pos);
		}
	}

	oHyperlink.private_UpdateTrackRevisions();
	oHyperlink.protected_UpdateSpellChecking();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesHyperlinkRemoveItem(Class, Pos, Items)
{
	CChangesHyperlinkRemoveItem.superclass.constructor.call(this, Class);

	this.Pos    = Pos;
	this.Items  = Items;

	this.UseArray = false;
	this.PosArray = [];
}
AscCommon.extendClass(CChangesHyperlinkRemoveItem, AscDFH.CChangesBase);
CChangesHyperlinkRemoveItem.prototype.Type = AscDFH.historyitem_Hyperlink_RemoveItem;
CChangesHyperlinkRemoveItem.prototype.Undo = function()
{
	var oHyperlink  = this.Class;
	var Array_start = oHyperlink.Content.slice(0, this.Pos);
	var Array_end   = oHyperlink.Content.slice(this.Pos);

	oHyperlink.Content = Array_start.concat(this.Items, Array_end);
	oHyperlink.private_UpdateTrackRevisions();
	oHyperlink.protected_UpdateSpellChecking();
};
CChangesHyperlinkRemoveItem.prototype.Redo = function()
{
	var oHyperlink  = this.Class;
	oHyperlink.Content.splice(this.Pos, this.Items.length);
	oHyperlink.private_UpdateTrackRevisions();
	oHyperlink.protected_UpdateSpellChecking();
};
CChangesHyperlinkRemoveItem.prototype.WriteToBinary = function(Writer)
{
	// Long          : Количество удаляемых элементов
	// Array of
	// {
	//    Long : позиции удаляемых элементов
	//    String : id удаляемых элементов
	// }

	var bArray = this.UseArray;
	var nCount = this.Items.length;

	var nStartPos = Writer.GetCurPosition();
	Writer.Skip(4);
	var nRealCount = nCount;

	for (var nIndex = 0; nIndex < nCount; ++nIndex)
	{
		if (true === bArray)
		{
			if (false === this.PosArray[nIndex])
			{
				nRealCount--;
			}
			else
			{
				Writer.WriteLong(this.PosArray[nIndex]);
				Writer.WriteString2(this.Items[nIndex]);
			}
		}
		else
		{
			Writer.WriteLong(this.Pos);
			Writer.WriteString2(this.Items[nIndex]);
		}
	}

	var nEndPos = Writer.GetCurPosition();
	Writer.Seek(nStartPos);
	Writer.WriteLong(nRealCount);
	Writer.Seek(nEndPos);
};
CChangesHyperlinkRemoveItem.prototype.ReadFromBinary = function(Reader)
{
	// Long          : Количество удаляемых элементов
	// Array of
	// {
	//    Long : позиции удаляемых элементов
	//    String : id удаляемых элементов
	// }

	this.UseArray = true;
	this.Items    = [];
	this.PosArray = [];

	var nCount = Reader.GetLong();
	for (var nIndex = 0; nIndex < nCount; ++nIndex)
	{
		this.PosArray[nIndex] = Reader.GetLong();
		this.Items[nIndex]    = AscCommon.g_oTableId.Get_ById(Reader.GetString2());
	}
};
CChangesHyperlinkRemoveItem.prototype.Load = function(Color)
{
	var oHyperlink = this.Class;
	for (var nIndex = 0, nCount = this.Items.length; nIndex < nCount; ++nIndex)
	{
		var ChangesPos = oHyperlink.m_oContentChanges.Check(AscCommon.contentchanges_Remove, this.PosArray[nIndex]);

		if (false === ChangesPos)
			continue;

		oHyperlink.Content.splice(ChangesPos, 1);
		AscCommon.CollaborativeEditing.Update_DocumentPositionsOnRemove(oHyperlink, ChangesPos, 1);
	}
	oHyperlink.private_UpdateTrackRevisions();
	oHyperlink.protected_UpdateSpellChecking();
};