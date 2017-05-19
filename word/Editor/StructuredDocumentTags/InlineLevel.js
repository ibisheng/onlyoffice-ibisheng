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
 * Date: 11.05.2017
 * Time: 16:48
 */

/**
 * @constructor
 * @extends {CParagraphContentWithParagraphLikeContent}
 */
function CInlineLevelSdt()
{
	this.Id = AscCommon.g_oIdCounter.Get_NewId();

	CParagraphContentWithParagraphLikeContent.call(this);

	this.Pr   = new CSdtPr();
	this.Type = para_InlineLevelSdt;

	this.BoundsPaths = null;

	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	g_oTableId.Add(this, this.Id);
}

CInlineLevelSdt.prototype = Object.create(CParagraphContentWithParagraphLikeContent.prototype);
CInlineLevelSdt.prototype.constructor = CInlineLevelSdt;


CInlineLevelSdt.prototype.Get_Id = function()
{
	return this.Id;
};
CInlineLevelSdt.prototype.GetId = function()
{
	return this.Get_Id();
};
CInlineLevelSdt.prototype.Copy = function(Selected)
{
	var ContentControl = CParagraphContentWithParagraphLikeContent.prototype.Copy.apply(this, arguments);

	// TODO: Сделать копирование настроек

	return ContentControl;
};
CInlineLevelSdt.prototype.GetSelectedElementsInfo = function(Info)
{
	Info.SetInlineLevelSdt(this);
	CParagraphContentWithParagraphLikeContent.prototype.GetSelectedElementsInfo.apply(this, arguments);
};
CInlineLevelSdt.prototype.Add_ToContent = function(Pos, Item, UpdatePosition)
{
	History.Add(new CChangesParaFieldAddItem(this, Pos, [Item]));
	CParagraphContentWithParagraphLikeContent.prototype.Add_ToContent.apply(this, arguments);
};
CInlineLevelSdt.prototype.Remove_FromContent = function(Pos, Count, UpdatePosition)
{
	// Получим массив удаляемых элементов
	var DeletedItems = this.Content.slice(Pos, Pos + Count);
	History.Add(new CChangesParaFieldRemoveItem(this, Pos, DeletedItems));

	CParagraphContentWithParagraphLikeContent.prototype.Remove_FromContent.apply(this, arguments);
};
CInlineLevelSdt.prototype.Add = function(Item)
{
	switch (Item.Type)
	{
		case para_Run      :
		case para_Hyperlink:
		{
			var TextPr = this.Get_FirstTextPr();
			Item.SelectAll();
			Item.Apply_TextPr(TextPr);
			Item.RemoveSelection();

			var CurPos = this.State.ContentPos;
			var CurItem = this.Content[CurPos];
			if (para_Run === CurItem.Type)
			{
				var NewRun = CurItem.Split2(CurItem.State.ContentPos);
				this.Add_ToContent(CurPos + 1, Item);
				this.Add_ToContent(CurPos + 2, NewRun);

				this.State.ContentPos = CurPos + 2;
				this.Content[this.State.ContentPos].MoveCursorToStartPos();
			}
			else
				CurItem.Add(Item);

			break;
		}
		case para_Math :
		{
			var ContentPos = new CParagraphContentPos();
			this.Get_ParaContentPos(false, false, ContentPos);
			var CurPos = ContentPos.Get(0);

			// Ран формула делит на части, а в остальные элементы добавляется целиком
			if (para_Run === this.Content[CurPos].Type)
			{
				// Разделяем текущий элемент (возвращается правая часть)
				var NewElement = this.Content[CurPos].Split(ContentPos, 1);

				if (null !== NewElement)
					this.Add_ToContent(CurPos + 1, NewElement, true);

				var Elem = new ParaMath();
				Elem.Root.Load_FromMenu(Item.Menu, this.Get_Paragraph());
				Elem.Root.Correct_Content(true);
				this.Add_ToContent(CurPos + 1, Elem, true);

				// Перемещаем кусор в конец формулы
				this.State.ContentPos = CurPos + 1;
				this.Content[this.State.ContentPos].MoveCursorToEndPos(false);
			}
			else
				this.Content[CurPos].Add(Item);

			break;
		}
		case para_Field:
		{
			// Вместо добавления самого элемента добавляем его содержимое
			var Count = Item.Content.length;

			if (Count > 0)
			{
				var CurPos  = this.State.ContentPos;
				var CurItem = this.Content[CurPos];

				var CurContentPos = new CParagraphContentPos();
				CurItem.Get_ParaContentPos(false, false, CurContentPos);

				var NewItem = CurItem.Split(CurContentPos, 0);
				for (var Index = 0; Index < Count; Index++)
				{
					this.Add_ToContent(CurPos + Index + 1, Item.Content[Index], false);
				}
				this.Add_ToContent(CurPos + Count + 1, NewItem, false);
				this.State.ContentPos = CurPos + Count;
				this.Content[this.State.ContentPos].MoveCursorToEndPos();
			}

			break;
		}
		default :
		{
			this.Content[this.State.ContentPos].Add(Item);
			break;
		}
	}
};
CInlineLevelSdt.prototype.Split = function (ContentPos, Depth)
{
	// Не даем разделять
	return null;
};
CInlineLevelSdt.prototype.CanSplit = function()
{
	return false;
};
CInlineLevelSdt.prototype.Recalculate_Range_Spaces = function(PRSA, _CurLine, _CurRange, _CurPage)
{
	var CurLine  = _CurLine - this.StartLine;
	var CurRange = (0 === _CurLine ? _CurRange - this.StartRange : _CurRange);

	if (0 === CurLine && 0 === CurRange && true !== PRSA.RecalcFast)
		this.Bounds = {};

	var oParagraph = PRSA.Paragraph;
	var Y0         = oParagraph.Lines[_CurLine].Top + oParagraph.Pages[_CurPage].Y;
	var Y1         = oParagraph.Lines[_CurLine].Bottom + oParagraph.Pages[_CurPage].Y;
	var X0         = PRSA.X;

	CParagraphContentWithParagraphLikeContent.prototype.Recalculate_Range_Spaces.apply(this, arguments);

	var X1 = PRSA.X;

	this.Bounds[((CurLine << 16) & 0xFFFF0000) | (CurRange & 0x0000FFFF)] = {
		X            : X0,
		W            : X1 - X0,
		Y            : Y0,
		H            : Y1 - Y0,
		Page         : PRSA.Paragraph.Get_AbsolutePage(_CurPage),
		PageInternal : _CurPage
	};

	this.BoundsPaths = null;
};
CInlineLevelSdt.prototype.Get_LeftPos = function(SearchPos, ContentPos, Depth, UseContentPos)
{
	if (false === UseContentPos && this.Content.length > 0)
	{
		// При переходе в новый контент встаем в его конец
		var CurPos = this.Content.length - 1;
		this.Content[CurPos].Get_EndPos(false, SearchPos.Pos, Depth + 1);
		SearchPos.Pos.Update(CurPos, Depth);
		SearchPos.Found = true;
		return true;
	}

	CParagraphContentWithParagraphLikeContent.prototype.Get_LeftPos.call(this, SearchPos, ContentPos, Depth, UseContentPos);
};
CInlineLevelSdt.prototype.Get_RightPos = function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
{
	if (false === UseContentPos && this.Content.length > 0)
	{
		// При переходе в новый контент встаем в его начало
		this.Content[0].Get_StartPos(SearchPos.Pos, Depth + 1);
		SearchPos.Pos.Update(0, Depth);
		SearchPos.Found = true;
		return true;
	}

	CParagraphContentWithParagraphLikeContent.prototype.Get_RightPos.call(this, SearchPos, ContentPos, Depth, UseContentPos, StepEnd);
};
CInlineLevelSdt.prototype.Remove = function(nDirection, bOnAddText)
{
	CParagraphContentWithParagraphLikeContent.prototype.Remove.call(this, nDirection, bOnAddText);

	if (this.Is_Empty() && !bOnAddText && this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.IsFillingFormMode())
	{
		var sDefaultText = "     ";
		this.SetValue(sDefaultText);
	}
};
CInlineLevelSdt.prototype.Shift_Range = function(Dx, Dy, _CurLine, _CurRange)
{
	CParagraphContentWithParagraphLikeContent.prototype.Shift_Range.call(this, Dx, Dy, _CurLine, _CurRange);

	var CurLine = _CurLine - this.StartLine;
	var CurRange = ( 0 === CurLine ? _CurRange - this.StartRange : _CurRange );

	var oRangeBounds = this.Bounds[((CurLine << 16) & 0xFFFF0000) | (CurRange & 0x0000FFFF)];
	if (oRangeBounds)
	{
		oRangeBounds.X0 += Dx;
		oRangeBounds.X1 += Dx;
		oRangeBounds.Y0 += Dy;
		oRangeBounds.Y1 += Dy;
	}
};
CInlineLevelSdt.prototype.Get_WordStartPos = function(SearchPos, ContentPos, Depth, UseContentPos)
{
	var bResult = CParagraphContentWithParagraphLikeContent.prototype.Get_WordStartPos.call(this, SearchPos, ContentPos, Depth, UseContentPos);

	if (true !== bResult && this.Paragraph && this.Paragraph.LogicDocument)
	{
		this.Get_StartPos(SearchPos.Pos, Depth);
		SearchPos.Found = true;
		return true;
	}

	return bResult;
};
CInlineLevelSdt.prototype.Get_WordEndPos = function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
{
	var bResult = CParagraphContentWithParagraphLikeContent.prototype.Get_WordEndPos.call(this, SearchPos, ContentPos, Depth, UseContentPos, StepEnd);

	if (true !== bResult && this.Paragraph && this.Paragraph.LogicDocument)
	{
		this.Get_EndPos(false, SearchPos.Pos, Depth);
		SearchPos.Found = true;
		return true;
	}

	return bResult;
};
CInlineLevelSdt.prototype.GetBoundingPolygon = function()
{
	if (null === this.BoundsPaths)
	{
		var arrBounds = [], arrRects = [], CurPage = -1;
		for (var Key in this.Bounds)
		{
			if (CurPage !== this.Bounds[Key].PageInternal)
			{
				arrRects = [];
				arrBounds.push(arrRects);
				CurPage  = this.Bounds[Key].PageInternal;
			}

			arrRects.push(this.Bounds[Key]);
		}

		this.BoundsPaths = [];
		for (var nIndex = 0, nCount = arrBounds.length; nIndex < nCount; ++nIndex)
		{
			var oPolygon = new CPolygon();
			oPolygon.fill([arrBounds[nIndex]]);
			this.BoundsPaths = this.BoundsPaths.concat(oPolygon.GetPaths(0));
		}
	}

	return this.BoundsPaths;
};
CInlineLevelSdt.prototype.DrawContentControlsTrack = function(isHover)
{
	if (!this.Paragraph && this.Paragraph.LogicDocument)
		return;

	var oDrawingDocument = this.Paragraph.LogicDocument.Get_DrawingDocument();
	oDrawingDocument.OnDrawContentControl(this.GetId(), isHover ? c_oContentControlTrack.Hover : c_oContentControlTrack.In, this.GetBoundingPolygon(), this.Paragraph.Get_ParentTextTransform());
};
CInlineLevelSdt.prototype.SelectContentControl = function()
{
	this.SelectThisElement(1);
};
//----------------------------------------------------------------------------------------------------------------------
// Выставление настроек
//----------------------------------------------------------------------------------------------------------------------
CInlineLevelSdt.prototype.SetPr = function(oPr)
{
	this.SetAlias(oPr.Alias);
	this.SetTag(oPr.Tag);
	this.SetLabel(oPr.Label);
	this.SetContentControlLock(oPr.Lock);
};
CInlineLevelSdt.prototype.SetAlias = function(sAlias)
{
	if (sAlias !== this.Pr.Alias)
	{
		History.Add(new CChangesSdtPrAlias(this, this.Pr.Alias, sAlias));
		this.Pr.Alias = sAlias;
	}
};
CInlineLevelSdt.prototype.GetAlias = function()
{
	return (undefined !== this.Pr.Alias ? this.Pr.Alias : "");
};
CInlineLevelSdt.prototype.SetContentControlId = function(Id)
{
	if (this.Pr.Id !== Id)
	{
		History.Add(new CChangesSdtPrId(this, this.Pr.Id, Id));
		this.Pr.Id = Id;
	}
};
CInlineLevelSdt.prototype.GetContentControlId = function()
{
	return this.Pr.Id;
};
CInlineLevelSdt.prototype.SetTag = function(sTag)
{
	if (this.Pr.Tag !== sTag)
	{
		History.Add(new CChangesSdtPrTag(this, this.Pr.Tag, sTag));
		this.Pr.Tag = sTag;
	}
};
CInlineLevelSdt.prototype.GetTag = function()
{
	return (undefined !== this.Pr.Tag ? this.Pr.Tag : "");
};
CInlineLevelSdt.prototype.SetLabel = function(sLabel)
{
	if (this.Pr.Label !== sLabel)
	{
		History.Add(new CChangesSdtPrLabel(this, this.Pr.Label, sLabel));
		this.Pr.Label = sLabel;
	}
};
CInlineLevelSdt.prototype.GetLabel = function()
{
	return (undefined !== this.Pr.Label ? this.Pr.Label : "");
};
CInlineLevelSdt.prototype.SetContentControlLock = function(nLockType)
{
	if (this.Pr.Lock !== nLockType)
	{
		History.Add(new CChangesSdtPrLock(this, this.Pr.Lock, nLockType));
		this.Pr.Lock = nLockType;
	}
};
CInlineLevelSdt.prototype.GetContentControlLock = function()
{
	return sdtlock_SdtContentLocked;
	return (undefined !== this.Pr.Lock ? this.Pr.Lock : sdtlock_Unlocked);
};
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
CInlineLevelSdt.prototype.Write_ToBinary2 = function(Writer)
{
	Writer.WriteLong(AscDFH.historyitem_type_InlineLevelSdt);

	// String : Id
	// Long   : Количество элементов
	// Array of Strings : массив с Id элементов

	Writer.WriteString2(this.Id);

	var Count = this.Content.length;
	Writer.WriteLong(Count);
	for (var Index = 0; Index < Count; Index++)
		Writer.WriteString2(this.Content[Index].Get_Id());
};
CInlineLevelSdt.prototype.Read_FromBinary2 = function(Reader)
{
	// String : Id
	// Long   : Количество элементов
	// Array of Strings : массив с Id элементов

	this.Id = Reader.GetString2();

	var Count = Reader.GetLong();
	this.Content = [];
	for (var Index = 0; Index < Count; Index++)
	{
		var Element = AscCommon.g_oTableId.Get_ById(Reader.GetString2());
		if (null !== Element)
			this.Content.push(Element);
	}
};
CInlineLevelSdt.prototype.Write_ToBinary = function(Writer)
{
	// Long   : Type
	// String : Id

	Writer.WriteLong(this.Type);
	Writer.WriteString2(this.Id);
};
//----------------------------------------------------------------------------------------------------------------------
CInlineLevelSdt.prototype.IsStopCursorOnEntryExit = function()
{
	return true;
};
CInlineLevelSdt.prototype.GetSelectedContentControls = function(arrContentControls)
{
	arrContentControls.push(this);
	CParagraphContentWithParagraphLikeContent.prototype.GetSelectedContentControls.call(this, arrContentControls);
};
//--------------------------------------------------------export--------------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CInlineLevelSdt = CInlineLevelSdt;

function TEST_ADD_SDT()
{
	var oLogicDocument = editor.WordControl.m_oLogicDocument;

	oLogicDocument.Create_NewHistoryPoint();

	var oRun = new ParaRun();
	oRun.Add(new ParaText("S"));
	oRun.Add(new ParaText("d"));
	oRun.Add(new ParaText("t"));

	var oInlineContentControl = new CInlineLevelSdt();
	oInlineContentControl.Add_ToContent(0, oRun);

	var oPara = oLogicDocument.GetCurrentParagraph();
	oPara.Add_ToContent(0, new ParaRun());
	oPara.Add_ToContent(1, oInlineContentControl);


	oLogicDocument.Recalculate();
	oLogicDocument.Document_UpdateSelectionState();
	oLogicDocument.Document_UpdateInterfaceState();
	oLogicDocument.Document_UpdateRulersState();

	return oInlineContentControl ? oInlineContentControl.GetId() : null;
}

function TEST_ADD_SDT2()
{
	var oLogicDocument = editor.WordControl.m_oLogicDocument;

	oLogicDocument.Create_NewHistoryPoint();


	var oSdt = oLogicDocument.AddContentControl();
	oSdt.AddToParagraph(new ParaText("S"));
	oSdt.AddToParagraph(new ParaText("d"));
	oSdt.AddToParagraph(new ParaText("t"));


	oLogicDocument.Recalculate();
	oLogicDocument.Document_UpdateSelectionState();
	oLogicDocument.Document_UpdateInterfaceState();
	oLogicDocument.Document_UpdateRulersState();

	return oSdt;
}
