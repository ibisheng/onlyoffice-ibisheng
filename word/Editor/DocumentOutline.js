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

	return this.Elements[nIndex].Paragraph.GetText();
};
CDocumentOutline.prototype.GetLevel = function(nIndex)
{
	if (nIndex < 0 || nIndex >= this.Elements.length)
		return -1;

	return this.Elements[nIndex].Lvl;
};
CDocumentOutline.prototype.GoTo = function(nIndex)
{
	if (nIndex < 0 || nIndex >= this.Elements.length)
		return -1;

	var oParagraph = this.Elements[nIndex].Paragraph;
	oParagraph.MoveCursorToStartPos();
	oParagraph.Document_SetThisElementCurrent(true);
};
CDocumentOutline.prototype.Demote = function(nIndex)
{
	this.private_PromoteDemote(nIndex, false);
};
CDocumentOutline.prototype.Promote = function(nIndex)
{
	this.private_PromoteDemote(nIndex, true);
};
CDocumentOutline.prototype.private_PromoteDemote = function(nIndex, isPromote)
{
	if (nIndex < 0 || nIndex >= this.Elements.length)
		return;

	var nLevel     = this.Elements[nIndex].Lvl;
	var oParagraph = this.Elements[nIndex].Paragraph;

	if (isPromote && (nLevel <= 0 || nLevel > 8) || (!isPromote && (nLevel >= 8 || nLevel < 0)))
		return;

	var arrParagraphs = [oParagraph];
	var arrLevels     = [nLevel];

	nIndex++;
	while (nIndex < this.Elements.length)
	{
		var nCurLevel     = this.Elements[nIndex].Lvl;
		var oCurParagraph = this.Elements[nIndex].Paragraph;

		if (nCurLevel <= nLevel)
			break;

		arrParagraphs.push(oCurParagraph);
		arrLevels.push(nCurLevel);

		nIndex++;
	}

	if (false === this.LogicDocument.Document_Is_SelectionLocked(changestype_None, {
			Type      : AscCommon.changestype_2_ElementsArray_and_Type,
			Elements  : arrParagraphs,
			CheckType : AscCommon.changestype_Paragraph_Properties
		}))
	{
		AscCommon.History.Create_NewPoint(AscDFH.historydescription_Document_ChangeOutlineLevel);

		for (var nPos = 0, nCount = arrParagraphs.length; nPos < nCount; ++nPos)
		{
			var nCurLevel = arrLevels[nPos];
			if (isPromote && nCurLevel > 0 && nCurLevel <= 8)
				nCurLevel--;
			else if (!isPromote && nCurLevel < 8 && nCurLevel >= 0)
				nCurLevel++;
			else
				continue;

			var sStyleId = this.LogicDocument.GetStyles().GetDefaultHeading(nCurLevel);
			arrParagraphs[nPos].SetParagraphStyleById(sStyleId);
		}

		this.LogicDocument.Recalculate();
		this.LogicDocument.Document_UpdateInterfaceState();
	}
};

//-------------------------------------------------------------export---------------------------------------------------
CDocumentOutline.prototype["get_ElementsCount"]  = CDocumentOutline.prototype.GetElementsCount;
CDocumentOutline.prototype["get_Text"]           = CDocumentOutline.prototype.GetText;
CDocumentOutline.prototype["get_Level"]          = CDocumentOutline.prototype.GetLevel;
CDocumentOutline.prototype["goto"]               = CDocumentOutline.prototype.GoTo;
CDocumentOutline.prototype["promote"]            = CDocumentOutline.prototype.Promote;
CDocumentOutline.prototype["demote"]             = CDocumentOutline.prototype.Demote;
