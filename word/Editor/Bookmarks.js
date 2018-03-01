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
 * Date: 11.10.2017
 * Time: 13:47
 */

/**
 *
 * @constructor
 * @extends {CParagraphContentBase}
 */
function CParagraphBookmark(isStart, sBookmarkId, sBookmarkName)
{
	CParagraphContentBase.call(this);
	this.Id = AscCommon.g_oIdCounter.Get_NewId();

	this.Type         = para_Bookmark;
	this.Start        = isStart ? true : false;
	this.BookmarkId   = sBookmarkId;
	this.BookmarkName = sBookmarkName;
	this.Use          = true;
	this.PageAbs      = 1;
	this.X            = 0;
	this.Y            = 0;

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
CParagraphBookmark.prototype.Copy = function()
{
	return new CParagraphBookmark(this.Start, this.BookmarkId, this.BookmarkName);
};
CParagraphBookmark.prototype.GetBookmarkId = function()
{
	return this.BookmarkId;
};
CParagraphBookmark.prototype.GetBookmarkName = function()
{
	return this.BookmarkName;
};
CParagraphBookmark.prototype.IsUse = function()
{
	return this.Use;
};
CParagraphBookmark.prototype.SetUse = function(isUse)
{
	this.Use = isUse;
};
CParagraphBookmark.prototype.UpdateBookmarks = function(oManager)
{
	oManager.ProcessBookmarkChar(this);
};
CParagraphBookmark.prototype.IsStart = function()
{
	return this.Start;
};
CParagraphBookmark.prototype.Recalculate_Range = function(PRS, ParaPr)
{
	this.PageAbs = PRS.Paragraph.Get_AbsolutePage(PRS.Page);

	this.X = PRS.X;
	this.Y = PRS.Y;
};
CParagraphBookmark.prototype.GetPage = function()
{
	return this.PageAbs;
};
CParagraphBookmark.prototype.GetXY = function()
{
	return {X : this.X, Y : this.Y};
};
CParagraphBookmark.prototype.GoToBookmark = function()
{
	var oParagraph = this.Paragraph;
	if (!oParagraph)
		return;

	var oLogicDocument = oParagraph.LogicDocument;
	if (!oLogicDocument)
		return;

	var oCurPos = oParagraph.Get_PosByElement(this);
	if (!oCurPos)
		return;

	oLogicDocument.RemoveSelection();
	oParagraph.Set_ParaContentPos(oCurPos, false, -1, -1, true); // Корректировать позицию нужно обязательно
	oParagraph.Document_SetThisElementCurrent(true);
};
CParagraphBookmark.prototype.RemoveBookmark = function()
{
	var oParagraph = this.Paragraph;
	if (!oParagraph)
		return;

	var oCurPos = oParagraph.Get_PosByElement(this);
	if (!oCurPos)
		return;

	var oParent      = this.GetParent();
	var nPosInParent = this.GetPosInParent(oParent);

	if (!oParent || -1 === nPosInParent)
		return;

	oParent.Remove_FromContent(nPosInParent, 1);
};
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
CParagraphBookmark.prototype.Refresh_RecalcData = function()
{
};
CParagraphBookmark.prototype.Write_ToBinary2 = function(Writer)
{
	Writer.WriteLong(AscDFH.historyitem_type_ParaBookmark);

	// String   : Id
	// String   : Id закладки
	// String   : Имя закладки
	// Bool     : Start

	Writer.WriteString2("" + this.Id);
	Writer.WriteString2("" + this.BookmarkId);
	Writer.WriteString2(this.BookmarkName);
	Writer.WriteBool(this.Start);
};
CParagraphBookmark.prototype.Read_FromBinary2 = function(Reader)
{
	this.Id           = Reader.GetString2();
	this.BookmarkId   = Reader.GetString2();
	this.BookmarkName = Reader.GetString2();
	this.Start        = Reader.GetBool();
};


function CBookmarksManager(oLogicDocument)
{
	this.LogicDocument = oLogicDocument;

	// Список всех закладок
	this.Bookmarks = [];

	// Массив с временными элементами
	this.BookmarksChars = {};

	// Нужно ли обновлять список закладок
	this.NeedUpdate = true;

	this.IdCounter    = 0;
	this.IdCounterTOC = 0;
}
CBookmarksManager.prototype.SetNeedUpdate = function(isNeed)
{
	this.NeedUpdate = isNeed;
};
CBookmarksManager.prototype.IsNeedUpdate = function()
{
	return this.NeedUpdate;
};
CBookmarksManager.prototype.BeginCollectingProcess = function()
{
	this.Bookmarks      = [];
	this.BookmarksChars = {};

	this.IdCounter    = 0;
	this.IdCounterTOC = 0;
};
CBookmarksManager.prototype.ProcessBookmarkChar = function(oParaBookmark)
{
	if (!(oParaBookmark instanceof CParagraphBookmark))
		return;

	var sBookmarkId = oParaBookmark.GetBookmarkId();
	if (undefined !== this.BookmarksChars[sBookmarkId])
	{
		if (oParaBookmark.IsStart())
		{
			oParaBookmark.SetUse(false);
		}
		else
		{
			this.BookmarksChars[sBookmarkId].SetUse(true);
			oParaBookmark.SetUse(true);
			this.Bookmarks.push([this.BookmarksChars[sBookmarkId], oParaBookmark]);
			delete this.BookmarksChars[sBookmarkId];
		}
	}
	else
	{
		if (!oParaBookmark.IsStart())
			oParaBookmark.SetUse(false);
		else
			this.BookmarksChars[sBookmarkId] = oParaBookmark;
	}

	if (oParaBookmark.IsStart())
	{
		var sBookmarkName = oParaBookmark.GetBookmarkName();
		if (sBookmarkName && 0 === sBookmarkName.indexOf("_Toc"))
		{
			var nId = parseInt(sBookmarkName.substring(4));
			if (!isNaN(nId))
				this.IdCounterTOC = Math.max(this.IdCounterTOC, nId);
		}

		var nId = parseInt(sBookmarkId);
		if (!isNaN(nId))
			this.IdCounter = Math.max(this.IdCounter, nId);
	}
};
CBookmarksManager.prototype.EndCollectingProcess = function()
{
	for (var sId in this.BookmarksChars)
	{
		this.BookmarksChars[sId].SetUse(false);
	}

	this.BookmarksChars = {};

	this.NeedUpdate = false;
};
CBookmarksManager.prototype.GetBookmarkById = function(Id)
{
	this.private_CheckValidate();

	for (var nIndex = 0, nCount = this.Bookmarks.length; nIndex < nCount; ++nIndex)
	{
		if (this.Bookmarks[nIndex].GetBookmarkId() === Id)
			return this.Bookmarks[nIndex];
	}

	return null;
};
CBookmarksManager.prototype.GetBookmarkByName = function(sName)
{
	this.private_CheckValidate();

	for (var nIndex = 0, nCount = this.Bookmarks.length; nIndex < nCount; ++nIndex)
	{
		var oStart = this.Bookmarks[nIndex][0];
		if (oStart.GetBookmarkName() === sName)
			return this.Bookmarks[nIndex];
	}

	return null;
};
CBookmarksManager.prototype.HaveBookmark = function(sName)
{
	this.private_CheckValidate();

	for (var nIndex = 0, nCount = this.Bookmarks.length; nIndex < nCount; ++nIndex)
	{
		var oStart = this.Bookmarks[nIndex][0];
		if (oStart.GetBookmarkName() === sName)
			return true;
	}

	return false;
};
CBookmarksManager.prototype.private_CheckValidate = function()
{
	if (this.NeedUpdate)
		this.LogicDocument.UpdateBookmarks();
};
CBookmarksManager.prototype.GetNewBookmarkId = function()
{
	this.private_CheckValidate();

	return ("" + ++this.IdCounter);
};
CBookmarksManager.prototype.GetNewBookmarkNameTOC = function()
{
	this.private_CheckValidate();

	return ("_Toc" + ++this.IdCounterTOC);
};
CBookmarksManager.prototype.RemoveTOCBookmarks = function()
{
	this.private_CheckValidate();

	for (var nIndex = 0, nCount = this.Bookmarks.length; nIndex < nCount; ++nIndex)
	{
		var oStart = this.Bookmarks[nIndex][0];
		var oEnd   = this.Bookmarks[nIndex][1];

		if (0 === oStart.GetBookmarkName().toLowerCase().indexOf("_toc"))
		{
			oStart.RemoveBookmark();
			oEnd.RemoveBookmark();
		}
	}
};



//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CParagraphBookmark = CParagraphBookmark;
