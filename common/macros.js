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

(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
function (window, undefined)
{
	/** @constructor */
	function CDocumentMacros()
	{
		this.Id = "_macrosGlobalId";//AscCommon.g_oIdCounter.Get_NewId();

		this.Lock = new AscCommon.CLock();

		this.Data = "";

		AscCommon.g_oTableId.Add(this, this.Id);
	}
	CDocumentMacros.prototype.SetData = function(sData)
	{
		AscCommon.History.Add(new CChangesDocumentMacrosData(this, this.Data, sData));
		this.Data = sData;
	};
	CDocumentMacros.prototype.GetData = function()
	{
		return this.Data;
	};
	CDocumentMacros.prototype.Get_Id = function()
	{
		return this.Id;
	};
	CDocumentMacros.prototype.CheckLock = function()
	{
		this.Lock.Check(this.Id);
	};
	CDocumentMacros.prototype.Write_ToBinary2 = function(Writer)
	{
		Writer.WriteLong(AscDFH.historyitem_type_DocumentMacros);

		// String2 : Id
		// String2 : Data

		Writer.WriteString2("" + this.Id);
		Writer.WriteString2(this.Data);
	};
	CDocumentMacros.prototype.Read_FromBinary2 = function(Reader)
	{
		// String2 : Id
		// String2 : Data

		this.Id   = Reader.GetString2();
		this.Data = Reader.GetString2();
	};

	CDocumentMacros.prototype.Refresh_RecalcData = function()
	{
	};

	AscDFH.changesFactory[AscDFH.historyitem_DocumentMacros_Data]     = CChangesDocumentMacrosData;
	AscDFH.changesRelationMap[AscDFH.historyitem_DocumentMacros_Data] = [AscDFH.historyitem_DocumentMacros_Data];

	/**
	 * @constructor
	 * @extends {AscDFH.CChangesBaseStringProperty}
	 */
	function CChangesDocumentMacrosData(Class, Old, New)
	{
		AscDFH.CChangesBaseStringProperty.call(this, Class, Old, New);
	}
	CChangesDocumentMacrosData.prototype = Object.create(AscDFH.CChangesBaseStringProperty.prototype);
	CChangesDocumentMacrosData.prototype.constructor = CChangesDocumentMacrosData;
	CChangesDocumentMacrosData.prototype.Type = AscDFH.historyitem_DocumentMacros_Data;
	CChangesDocumentMacrosData.prototype.private_SetValue = function(Value)
	{
		this.Class.Data = Value;
	};

	window['AscCommon'] = window['AscCommon'] || {};
	window["AscCommon"].CDocumentMacros = CDocumentMacros;
})(window);
