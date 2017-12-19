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
 * Date: 19.12.2017
 * Time: 14:41
 */

/**
 * Класс для работы со структурой документа
 * @param {CDocument} oLogicDocument
 */
function CDocumentOutline(oLogicDocument)
{
	this.LogicDocument = oLogicDocument;
	this.Use           = false;
	this.Elements      = [];
}
CDocumentOutline.prototype.SetUse = function(isUse)
{
	this.Use = isUse;
	if (this.Use)
		this.Update();
};
CDocumentOutline.prototype.Update = function()
{
	if (!this.Use)
		return;

	this.Elements = this.LogicDocument.GetOutlineParagraphs();

	this.LogicDocument.GetApi().sync_OnDocumentOutlineUpdate(this);
};
CDocumentOutline.prototype.GetElementsCount = function()
{
	return this.Elements.length;
};
CDocumentOutline.prototype.GetText = function(nIndex)
{
	if (nIndex < 0 || nIndex >= this.Elements.length)
		return "";

	return this.Elements.Paragraph.GetText();
};
CDocumentOutline.prototype.GetLevel = function(nIndex)
{
	if (nIndex < 0 || nIndex >= this.Elements.length)
		return -1;

	return this.Elements.Level;
};

//-------------------------------------------------------------export---------------------------------------------------
CDocumentOutline.prototype["get_ElementsCount"]  = CDocumentOutline.prototype.GetElementsCount;
CDocumentOutline.prototype["get_Text"]           = CDocumentOutline.prototype.GetText;
CDocumentOutline.prototype["get_Level"]          = CDocumentOutline.prototype.GetLevel;
