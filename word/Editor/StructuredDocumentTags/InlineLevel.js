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
	CParagraphContentWithParagraphLikeContent.call(this);

	this.Pr = new CSdtPr();

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

	var X0 = PRSA.X;
	var Y0 = PRSA.Y0;
	var Y1 = PRSA.Y1;

	CParagraphContentWithParagraphLikeContent.prototype.Recalculate_Range_Spaces.apply(this, arguments);

	var X1 = PRSA.X;

	this.Bounds[((CurLine << 16) & 0xFFFF0000) | (CurRange & 0x0000FFFF)] = {
		X0        : X0,
		X1        : X1,
		Y0        : Y0,
		Y1        : Y1,
		PageIndex : _CurPage + PRSA.Paragraph.Get_StartPage_Absolute()
	};
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
CInlineLevelSdt.prototype.Get_LeftPos = function(SearchPos, ContentPos, Depth, UseContentPos)
{
	var bResult = CParagraphContentWithParagraphLikeContent.prototype.Get_LeftPos.call(this, SearchPos, ContentPos, Depth, UseContentPos);

	if (true !== bResult && this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.IsFillingFormMode())
	{
		this.Get_StartPos(SearchPos.Pos, Depth);
		SearchPos.Found = true;
		return true;
	}

	return bResult;
};
CInlineLevelSdt.prototype.Get_RightPos = function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
{
	var bResult = CParagraphContentWithParagraphLikeContent.prototype.Get_RightPos.call(this, SearchPos, ContentPos, Depth, UseContentPos, StepEnd);

	if (true !== bResult && this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.IsFillingFormMode())
	{
		this.Get_EndPos(false, SearchPos.Pos, Depth);
		SearchPos.Found = true;
		return true;
	}

	return bResult;
};
CInlineLevelSdt.prototype.Get_WordStartPos = function(SearchPos, ContentPos, Depth, UseContentPos)
{
	var bResult = CParagraphContentWithParagraphLikeContent.prototype.Get_WordStartPos.call(this, SearchPos, ContentPos, Depth, UseContentPos);

	if (true !== bResult && this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.IsFillingFormMode())
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

	if (true !== bResult && this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.IsFillingFormMode())
	{
		this.Get_EndPos(false, SearchPos.Pos, Depth);
		SearchPos.Found = true;
		return true;
	}

	return bResult;
};
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
CInlineLevelSdt.prototype.Write_ToBinary2 = function(Writer)
{
	Writer.WriteLong(AscDFH.historyitem_type_Field);

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

function TEST_ADD_SDT()
{
	var oLogicDocument = editor.WordControl.m_oLogicDocument;

	oLogicDocument.Create_NewHistoryPoint();

	//var oPara = oLogicDocument.GetCurrentParagraph();
	var oInlineContentControl = new CInlineLevelSdt();
	oInlineContentControl.Add(new ParaRun());
	oLogicDocument.AddToParagraph(oInlineContentControl);


	oLogicDocument.Recalculate();
	oLogicDocument.Document_UpdateSelectionState();
	oLogicDocument.Document_UpdateInterfaceState();
	oLogicDocument.Document_UpdateRulersState();

	return oInlineContentControl ? oInlineContentControl.GetId() : null;
}
