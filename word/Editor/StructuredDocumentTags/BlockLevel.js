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
 * Date: 04.04.2017
 * Time: 17:00
 */

var type_BlockLevelSdt = 0x0003;

/**
 * @param oParent - родительский класс
 * @param oLogicDocument - главный класс документа
 * @constructor
 * @extends {CDocumentContentElementBase}
 */
function CBlockLevelSdt(oLogicDocument, oParent)
{
	CDocumentContentElementBase.call(this, oParent);

	this.LogicDocument = oLogicDocument;
	this.Content       = new CDocumentContent(this, oLogicDocument.Get_DrawingDocument(), 0, 0, 0, 0, true, false, false);

	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	g_oTableId.Add(this, this.Id);
}

CBlockLevelSdt.prototype = Object.create(CDocumentContentElementBase.prototype);
CBlockLevelSdt.prototype.constructor = CBlockLevelSdt;

CBlockLevelSdt.prototype.GetType = function()
{
	return type_BlockLevelSdt;
};
CBlockLevelSdt.prototype.Is_Inline = function()
{
	return true;
};
CBlockLevelSdt.prototype.Reset = function(X, Y, XLimit, YLimit, PageAbs, ColumnAbs, ColumnsCount)
{
	this.Content.Reset(X, Y, XLimit, YLimit);
	this.Content.Set_StartPage(0);

	this.X            = X;
	this.Y            = Y;
	this.XLimit       = XLimit;
	this.YLimit       = YLimit;
	this.PageNum      = PageAbs;
	this.ColumnNum    = ColumnAbs ? ColumnAbs : 0;
	this.ColumnsCount = ColumnsCount ? ColumnsCount : 1;
};
CBlockLevelSdt.prototype.Recalculate_Page = function(CurPage)
{
	var RecalcResult = this.Content.Recalculate_Page(CurPage, true);

	return RecalcResult;
};
CBlockLevelSdt.prototype.Get_PageBounds = function(CurPage)
{
	return this.Content.Get_PageBounds(CurPage);
};
CBlockLevelSdt.prototype.Is_EmptyPage = function(CurPage)
{
	// TODO: Реализовать
	return false;
};
CBlockLevelSdt.prototype.Reset_RecalculateCache = function()
{
	this.Content.Reset_RecalculateCache();
};
CBlockLevelSdt.prototype.Write_ToBinary2 = function(Writer)
{
	Writer.WriteLong(AscDFH.historyitem_type_BlockLevelSdt);
	// String : Content id
	Writer.WriteString(this.Content.GetId());
};
CBlockLevelSdt.prototype.Read_FromBinary2 = function(Reader)
{
	// String : Content id
	this.Content = this.LogicDocument.Get_TableId().Get_ById(Reader.GetString2());
};


//--------------------------------------------------------export--------------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CBlockLevelSdt = CBlockLevelSdt;
window['AscCommonWord'].type_BlockLevelSdt = type_BlockLevelSdt;


function TEST_ADD_SDT()
{
	var oLogicDocument = editor.WordControl.m_oLogicDocument;
	var oSdt = new CBlockLevelSdt(oLogicDocument, oLogicDocument);

	oLogicDocument.Internal_Content_Add(1, oSdt);
	oLogicDocument.Recalculate_FromStart();
}