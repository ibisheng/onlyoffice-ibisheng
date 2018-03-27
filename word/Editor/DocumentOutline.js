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
	this.CurPos        = -1;

	this.ParagraphsToUpdate = {};
}
CDocumentOutline.prototype.SetUse = function(isUse)
{
	this.Use = isUse;
	if (this.Use)
		this.UpdateAll();
};
CDocumentOutline.prototype.IsUse = function()
{
	return this.Use;
};
CDocumentOutline.prototype.UpdateAll = function()
{
	if (!this.Use)
		return;

	this.ParagraphsToUpdate = {};
	this.Elements           = [];
	this.LogicDocument.GetOutlineParagraphs(this.Elements, {SkipEmptyParagraphs : false});

	if (this.Elements.length > 0)
	{
		this.LogicDocument.UpdateContentIndexing();
		if (0 !== this.Elements[0].Paragraph.GetIndex())
		{
			this.Elements.splice(0, 0, {Paragraph : null, Lvl : 0});
		}
	}

	this.CurPos = -1;

	this.LogicDocument.GetApi().sync_OnDocumentOutlineUpdate(this);
	this.LogicDocument.UpdateDocumentOutlinePosition();
};
CDocumentOutline.prototype.CheckParagraph = function(oParagraph)
{
	if ((-1 !== this.private_FindElementByParagraph(oParagraph)
		|| undefined !== oParagraph.GetOutlineLvl())
		&& !this.ParagraphsToUpdate[oParagraph.GetId()])
	{
		this.ParagraphsToUpdate[oParagraph.GetId()] = oParagraph;
	}
};
CDocumentOutline.prototype.Update = function()
{
	// TODO: Надо проверить нумерацию

	var arrParagraphs = [];
	for (var sId in this.ParagraphsToUpdate)
	{
		arrParagraphs.push(this.ParagraphsToUpdate[sId]);
	}

	if (arrParagraphs.length > 0)
	{
		this.LogicDocument.UpdateContentIndexing();
		for (var nIndex = 0, nCount = arrParagraphs.length; nIndex < nCount; ++nIndex)
		{
			var oParagraph = arrParagraphs[nIndex];

			var nPos   = this.private_FindElementByParagraph(oParagraph);
			var nLevel = oParagraph.GetOutlineLvl();
			var isUse  = oParagraph.Is_UseInDocument();

			if (undefined !== nLevel && isUse)
			{
				if (-1 === nPos)
				{
					nPos = this.private_GetParagraphPosition(oParagraph);

					if (0 === nPos && this.Elements[0] && null === this.Elements[0].Paragraph)
					{
						this.Elements.splice(0, 1);
						this.LogicDocument.GetApi().sync_OnDocumentOutlineUpdateRemove(0);
					}

					this.Elements.splice(nPos, 0, {Paragraph : oParagraph, Lvl : nLevel});
					this.LogicDocument.GetApi().sync_OnDocumentOutlineUpdateAdd(nPos);

					if (0 === nPos)
					{
						this.LogicDocument.UpdateContentIndexing();
						if (0 !== this.Elements[0].Paragraph.GetIndex())
						{
							this.Elements.splice(0, 0, {Paragraph : null, Lvl : 0});
							this.LogicDocument.GetApi().sync_OnDocumentOutlineUpdateAdd(0);
						}
					}
				}
				else
				{
					this.Elements[nPos].Lvl = nLevel;
					this.LogicDocument.GetApi().sync_OnDocumentOutlineUpdateChange(nPos);
				}
			}
			else if (-1 !== nPos && (undefined === nLevel || !isUse))
			{
				this.Elements.splice(nPos, 1);
				this.LogicDocument.GetApi().sync_OnDocumentOutlineUpdateRemove(nPos);

				if (0 === nPos && (!this.Elements[0] || (null !== this.Elements[0].Paragraph && 0 !== this.Elements[0].Paragraph.GetIndex())))
				{
					this.Elements.splice(0, 0, {Paragraph : null, Lvl : 0});
					this.LogicDocument.GetApi().sync_OnDocumentOutlineUpdateAdd(0);
				}

				if (1 === this.Elements.length && this.Elements[0].Paragraph === null)
				{
					this.Elements.splice(0, 1);
					this.LogicDocument.GetApi().sync_OnDocumentOutlineUpdateRemove(0);
				}
			}
		}
	}

	this.ParagraphsToUpdate = {};
};
CDocumentOutline.prototype.private_FindElementByParagraph = function(oParagraph)
{
	for (var nIndex = 0, nCount = this.Elements.length; nIndex < nCount; ++nIndex)
	{
		if (this.Elements[nIndex].Paragraph === oParagraph)
			return nIndex;
	}

	return -1;
};
CDocumentOutline.prototype.private_GetParagraphPosition = function(oParagraph)
{
	var nParaIndex = oParagraph.GetIndex();
	for (var nIndex = 0, nCount = this.Elements.length; nIndex < nCount; ++nIndex)
	{
		if ((this.Elements[nIndex].Paragraph && nParaIndex <= this.Elements[nIndex].Paragraph.GetIndex())
			|| (!this.Elements[nIndex].Paragraph && nParaIndex <= 0))
			return nIndex;
	}

	return this.Elements.length;
};
CDocumentOutline.prototype.GetElementsCount = function()
{
	return this.Elements.length;
};
CDocumentOutline.prototype.GetText = function(nIndex)
{
	if (nIndex < 0 || nIndex >= this.Elements.length)
		return "";

	if (!this.Elements[nIndex].Paragraph)
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

	this.LogicDocument.RemoveSelection();

	if (!oParagraph)
	{
		this.LogicDocument.MoveCursorToStartPos(false);
	}
	else
	{
		oParagraph.MoveCursorToStartPos();
		oParagraph.Document_SetThisElementCurrent(true);
	}
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

	if (!oParagraph)
		return;

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
CDocumentOutline.prototype.InsertHeader = function(nIndex, isBefore)
{
	if (nIndex < 0 || nIndex >= this.Elements.length)
		return;

	var nPos   = this.private_GetPositionForInsertHeaderBefore(isBefore ? nIndex : this.private_GetNextSiblingOrHigher(nIndex));
	var nLevel = this.GetLevel(nIndex);

	// Локов особо проверять не нужно, т.к. мы добавляем параграф в верхний класс, но возможно есть глобальный лок,
	// так что проверка нужна все равно, но без типа изменения.
	if (false === this.LogicDocument.Document_Is_SelectionLocked(changestype_None))
	{
		this.LogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddElementToOutline);

		var oParagraph = new Paragraph(this.LogicDocument.GetDrawingDocument(), this.LogicDocument);
		oParagraph.SetParagraphStyleById(this.LogicDocument.GetStyles().GetDefaultHeading(nLevel));
		this.LogicDocument.AddToContent(nPos, oParagraph);
		this.LogicDocument.Recalculate();

		oParagraph.MoveCursorToStartPos(false);
		oParagraph.Document_SetThisElementCurrent(true);
	}
};
CDocumentOutline.prototype.InsertSubHeader = function(nIndex)
{
	if (nIndex < 0 || nIndex >= this.Elements.length)
		return;

	var nPos   = this.private_GetPositionForInsertHeaderBefore(this.private_GetNextSiblingOrHigher(nIndex));
	var nLevel = this.GetLevel(nIndex);

	if (nLevel >= 8)
		return;

	// Локов особо проверять не нужно, т.к. мы добавляем параграф в верхний класс, но возможно есть глобальный лок,
	// так что проверка нужна все равно, но без типа изменения.
	if (false === this.LogicDocument.Document_Is_SelectionLocked(changestype_None))
	{
		this.LogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddElementToOutline);

		var oParagraph = new Paragraph(this.LogicDocument.GetDrawingDocument(), this.LogicDocument);
		oParagraph.SetParagraphStyleById(this.LogicDocument.GetStyles().GetDefaultHeading(nLevel + 1));
		this.LogicDocument.AddToContent(nPos, oParagraph);
		this.LogicDocument.Recalculate();

		oParagraph.MoveCursorToStartPos(false);
		oParagraph.Document_SetThisElementCurrent(true);
	}
};
CDocumentOutline.prototype.private_GetPositionForInsertHeaderBefore = function(nIndex)
{
	if (nIndex === this.Elements.length)
		return this.LogicDocument.GetElementsCount();

	var oParagraph = this.Elements[nIndex].Paragraph;
	if (!oParagraph)
		return 0;

	this.LogicDocument.UpdateContentIndexing();
	return oParagraph.GetIndex();
};
CDocumentOutline.prototype.private_GetNextSiblingOrHigher = function(nIndex)
{
	if (nIndex < 0 || nIndex >= this.Elements.length)
		return 0;

	var nLevel = this.GetLevel(nIndex);
	var nPos = nIndex + 1;
	while (nPos < this.Elements.length)
	{
		if (nLevel >= this.GetLevel(nPos))
			return nPos;

		nPos++;
	}

	return this.Elements.length;
};
CDocumentOutline.prototype.IsFirstItemNotHeader = function()
{
	return (this.Elements.length <= 0 || !this.Elements[0].Paragraph ? true : false);
};
CDocumentOutline.prototype.SelectContent = function(nIndex)
{
	if (nIndex < 0 || nIndex >= this.Elements.length)
		return;

	var oStartParagraph = this.Elements[nIndex].Paragraph,
		oEndParagraph   = null;

	var nNextIndex = this.private_GetNextSiblingOrHigher(nIndex);
	if (nNextIndex < this.Elements.length)
		oEndParagraph = this.Elements[nNextIndex].Paragraph;

	this.LogicDocument.UpdateContentIndexing();

	var nStartPos = (oStartParagraph ? oStartParagraph.GetIndex() : 0);
	var nEndPos   = (oEndParagraph ? oEndParagraph.GetIndex() : this.LogicDocument.GetElementsCount()) - 1;

	this.LogicDocument.RemoveSelection();
	this.LogicDocument.SelectRange(nStartPos, nEndPos);
};
CDocumentOutline.prototype.UpdateCurrentPosition = function(nCurPos)
{
	if (null === nCurPos)
	{
		this.LogicDocument.GetApi().sync_OnDocumentOutlineCurrentPosition(null);
		return;
	}

	this.LogicDocument.UpdateContentIndexing();

	var nFindIndex = this.Elements.length - 1;
	for (var nIndex = 0, nCount = this.Elements.length; nIndex < nCount; ++nIndex)
	{
		var oParagraph = this.Elements[nIndex].Paragraph;
		var nPos       = oParagraph ? oParagraph.GetIndex() : 0;

		if (nPos > nCurPos)
		{
			nFindIndex = nIndex - 1;
			break;
		}
	}

	if (nFindIndex !== this.CurPos)
	{
		this.CurPos = nFindIndex;
		this.LogicDocument.GetApi().sync_OnDocumentOutlineCurrentPosition(nFindIndex);
	}
};
CDocumentOutline.prototype.IsEmptyItem = function(nIndex)
{
	if (nIndex < 0 || nIndex >= this.Elements.length || !this.Elements[nIndex].Paragraph)
		return true;

	return this.Elements[nIndex].Paragraph.IsEmpty();
};
CDocumentOutline.prototype.GetCurrentPosition = function()
{
	return this.CurPos;
};

//-------------------------------------------------------------export---------------------------------------------------
CDocumentOutline.prototype["get_ElementsCount"]    = CDocumentOutline.prototype.GetElementsCount;
CDocumentOutline.prototype["get_Text"]             = CDocumentOutline.prototype.GetText;
CDocumentOutline.prototype["get_Level"]            = CDocumentOutline.prototype.GetLevel;
CDocumentOutline.prototype["get_CurrentPosition"]  = CDocumentOutline.prototype.GetCurrentPosition;
CDocumentOutline.prototype["goto"]                 = CDocumentOutline.prototype.GoTo;
CDocumentOutline.prototype["promote"]              = CDocumentOutline.prototype.Promote;
CDocumentOutline.prototype["demote"]               = CDocumentOutline.prototype.Demote;
CDocumentOutline.prototype["insertHeader"]         = CDocumentOutline.prototype.InsertHeader;
CDocumentOutline.prototype["insertSubHeader"]      = CDocumentOutline.prototype.InsertSubHeader;
CDocumentOutline.prototype["isFirstItemNotHeader"] = CDocumentOutline.prototype.IsFirstItemNotHeader;
CDocumentOutline.prototype["selectContent"]        = CDocumentOutline.prototype.SelectContent;
CDocumentOutline.prototype["isEmptyItem"]          = CDocumentOutline.prototype.IsEmptyItem;
