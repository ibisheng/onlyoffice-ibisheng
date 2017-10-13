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
 * Date: 11.10.2017
 * Time: 13:47
 */

/**
 *
 * @constructor
 * @extends {CParagraphContentBase}
 */
function CParagraphBookmark(isStart, sBookmarkId)
{
	CParagraphContentBase.call(this);
	this.Id = AscCommon.g_oIdCounter.Get_NewId();

	this.Start      = isStart ? true : false;
	this.BookmarkId = sBookmarkId;

	AscCommon.g_oTableId.Add(this, this.Id);
}

CParagraphBookmark.prototype = Object.create(CParagraphContentBase.prototype);
CParagraphBookmark.prototype.constructor = CParagraphBookmark;

CParagraphBookmark.prototype.Get_Id = function()
{
	return this.Id;
};
CParagraphBookmark.prototype.GetId = function()
{
	return this.Id;
};
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
CParagraphBookmark.Refresh_RecalcData = function()
{
};
CParagraphBookmark.Write_ToBinary2 = function(Writer)
{
	Writer.WriteLong(AscDFH.historyitem_type_ParaBookmark);

	// String   : Id
	// String   : Id комментария
	// Bool     : Start

	Writer.WriteString2("" + this.Id);
	Writer.WriteString2("" + this.BookmarkId);
	Writer.WriteBool(this.Start);
};
CParagraphBookmark.Read_FromBinary2 = function(Reader)
{
	this.Id         = Reader.GetString2();
	this.BookmarkId = Reader.GetString2();
	this.Start      = Reader.GetBool();
};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommon'] = window['AscCommon'] || {};
window['AscCommon'].CParagraphBookmark = CParagraphBookmark;
