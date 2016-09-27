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
 * Класс представляющий сноску в документе.
 * @param {CDocumentControllerBase} DocumentController
 * @constructor
 * @extends {CDocumentContent}
 */
function CFootEndnote(DocumentController)
{
	CFootEndnote.superclass.constructor.call(this, DocumentController, DocumentController ? DocumentController.Get_DrawingDocument() : undefined, 0, 0, 0, 0, true, false, false);

	this.Number            = 1;
	this.SectPr            = null;
	this.CurtomMarkFollows = false;
}

AscCommon.extendClass(CFootEndnote, CDocumentContent);

CFootEndnote.prototype.GetElementPageIndex = function(nPageAbs, nColumnAbs)
{
	// Функция аналогична Document.private_GetElementPageIndex
	var nStartPage    = this.StartPage;
	var nStartColumn  = this.StartColumn;
	var nColumnsCount = this.ColumnsCount;

	return Math.max(0, nColumnAbs - nStartColumn + (nPageAbs - nStartPage) * nColumnsCount);
};
CFootEndnote.prototype.Get_PageContentStartPos = function(nCurPage)
{
	var nPageAbs   = this.Get_AbsolutePage(nCurPage);
	var nColumnAbs = this.Get_AbsoluteColumn(nCurPage);
	return this.Parent.Get_PageContentStartPos(nPageAbs, nColumnAbs);
};
CFootEndnote.prototype.Refresh_RecalcData2 = function(nIndex, nCurPage)
{
	this.Parent.Refresh_RecalcData2(this.Get_AbsolutePage(nCurPage));
};
CFootEndnote.prototype.Write_ToBinary2 = function(Writer)
{
	Writer.WriteLong(AscDFH.historyitem_type_FootEndNote);
	CFootEndnote.superclass.Write_ToBinary2.call(this, Writer);
};
CFootEndnote.prototype.Read_FromBinary2 = function(Reader)
{
	Reader.GetLong(); // Должен вернуть historyitem_type_DocumentContent
	CFootEndnote.superclass.Read_FromBinary2.call(this, Reader);
};
CFootEndnote.prototype.SetNumber = function(nNumber, oSectPr, bCustomMarkFollows)
{
	this.Number            = nNumber;
	this.SectPr            = oSectPr;
	this.CurtomMarkFollows = bCustomMarkFollows;
};
CFootEndnote.prototype.GetNumber = function()
{
	return this.Number;
};
CFootEndnote.prototype.GetReferenceSectPr = function()
{
	return this.SectPr;
};
CFootEndnote.prototype.IsCustomMarkFollows = function()
{
	return this.CurtomMarkFollows;
};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CFootEndnote = CFootEndnote;