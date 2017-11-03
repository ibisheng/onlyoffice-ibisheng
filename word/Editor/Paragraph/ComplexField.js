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
 * Date: 15.08.2017
 * Time: 12:52
 */

var fldchartype_Begin    = 0;
var fldchartype_Separate = 1;
var fldchartype_End      = 2;

function ParaFieldChar(Type, LogicDocument)
{
	CRunElementBase.call(this);

	this.LogicDocument = LogicDocument;
	this.Use           = true;
	this.CharType      = undefined === Type ? fldchartype_Begin : Type;
	this.ComplexField  = (this.CharType === fldchartype_Begin) ? new CComplexField(LogicDocument) : null;
	this.Run           = null;
	this.X             = 0;
	this.Y             = 0;
	this.PageAbs       = 0;
}
ParaFieldChar.prototype = Object.create(CRunElementBase.prototype);
ParaFieldChar.prototype.constructor = ParaFieldChar;
ParaFieldChar.prototype.Type = para_FieldChar;
ParaFieldChar.prototype.Measure = function(Context, TextPr)
{
};
ParaFieldChar.prototype.Draw = function(X, Y, Context)
{
};
ParaFieldChar.prototype.IsBegin = function()
{
	return (this.CharType === fldchartype_Begin ? true : false);
};
ParaFieldChar.prototype.IsEnd = function()
{
	return (this.CharType === fldchartype_End ? true : false);
};
ParaFieldChar.prototype.IsSeparate = function()
{
	return (this.CharType === fldchartype_Separate ? true : false);
};
ParaFieldChar.prototype.IsUse = function()
{
	return this.Use;
};
ParaFieldChar.prototype.SetUse = function(isUse)
{
	this.Use = isUse;
};
ParaFieldChar.prototype.GetComplexField = function()
{
	return this.ComplexField;
};
ParaFieldChar.prototype.SetComplexField = function(oComplexField)
{
	this.ComplexField = oComplexField;
};
ParaFieldChar.prototype.Write_ToBinary = function(Writer)
{
	// Long : Type
	// Long : CharType
	Writer.WriteLong(this.Type);
	Writer.WriteLong(this.CharType);
};
ParaFieldChar.prototype.Read_FromBinary = function(Reader)
{
	// Long : CharType
	this.CharType = Reader.GetLong();

	this.LogicDocument = editor.WordControl.m_oLogicDocument;
	this.ComplexField  = (this.CharType === fldchartype_Begin) ? new CComplexField(this.LogicDocument) : null;
};
ParaFieldChar.prototype.SetRun = function(oRun)
{
	this.Run = oRun;
};
ParaFieldChar.prototype.GetRun = function()
{
	return this.Run;
};
ParaFieldChar.prototype.SetXY = function(X, Y)
{
	this.X = X;
	this.Y = Y;
};
ParaFieldChar.prototype.GetXY = function()
{
	return {X : this.X, Y : this.Y};
};
ParaFieldChar.prototype.SetPage = function(nPage)
{
	this.PageAbs = nPage;
};
ParaFieldChar.prototype.GetPage = function()
{
	return this.PageAbs;
};

function ParaInstrText(value)
{
	CRunElementBase.call(this);

	this.Value        = (undefined !== value ? value.charCodeAt(0) : 0x00);
	this.Width        = 0x00000000 | 0;
	this.WidthVisible = 0x00000000 | 0;
	this.Run          = null;
}
ParaInstrText.prototype = Object.create(CRunElementBase.prototype);
ParaInstrText.prototype.constructor = ParaInstrText;
ParaInstrText.prototype.Type = para_InstrText;
ParaInstrText.prototype.Measure = function(Context, TextPr)
{
};
ParaInstrText.prototype.Draw = function(X, Y, Context)
{
};
ParaInstrText.prototype.Write_ToBinary = function(Writer)
{
	// Long : Type
	// Long : Value
	Writer.WriteLong(this.Type);
	Writer.WriteLong(this.Value);
};
ParaInstrText.prototype.Read_FromBinary = function(Reader)
{
	// Long : Value
	this.Value = Reader.GetLong();
};
ParaInstrText.prototype.SetRun = function(oRun)
{
	this.Run = oRun;
};
ParaInstrText.prototype.GetRun = function()
{
	return this.Run;
};
ParaInstrText.prototype.GetValue = function()
{
	return String.fromCharCode(this.Value);
};
ParaInstrText.prototype.Set_CharCode = function(CharCode)
{
	this.Value = CharCode;
};

function CComplexField(oLogicDocument)
{
	this.LogicDocument   = oLogicDocument;
	this.BeginChar       = null;
	this.EndChar         = null;
	this.SeparateChar    = null;
	this.InstructionLine = "";
	this.Instruction     = null;
	this.Id              = null;
}
CComplexField.prototype.SetInstruction = function(oParaInstr)
{
	this.InstructionLine += oParaInstr.GetValue();
};
CComplexField.prototype.GetBeginChar = function()
{
	return this.BeginChar;
};
CComplexField.prototype.GetEndChar = function()
{
	return this.EndChar;
};
CComplexField.prototype.GetSeparateChar = function()
{
	return this.SeparateChar;
};
CComplexField.prototype.SetBeginChar = function(oChar)
{
	oChar.SetComplexField(this);

	this.BeginChar       = oChar;
	this.SeparateChar    = null;
	this.EndChar         = null;
	this.InstructionLine = "";
};
CComplexField.prototype.SetEndChar = function(oChar)
{
	oChar.SetComplexField(this);

	this.EndChar = oChar;
};
CComplexField.prototype.SetSeparateChar = function(oChar)
{
	oChar.SetComplexField(this);

	this.SeparateChar = oChar;
	this.EndChar      = null;
};
CComplexField.prototype.Update = function()
{
	this.private_UpdateInstruction();

	if (!this.Instruction || !this.BeginChar || !this.EndChar || !this.SeparateChar)
		return;

	this.private_SelectFieldValue();

	if (true === this.LogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		return;

	var nFieldCode = this.Instruction.GetType();
	if (fieldtype_PAGENUM === nFieldCode)
	{
		var oRun       = this.BeginChar.GetRun();
		var oParagraph = oRun.GetParagraph();
		var nInRunPos = oRun.GetElementPosition(this.BeginChar);
		var nLine     = oRun.GetLineByPosition(nInRunPos);
		var nPage     = oParagraph.GetPageByLine(nLine);
		var nPageAbs  = oParagraph.Get_AbsolutePage(nPage) + 1;
		// TODO: Тут надо рассчитывать значение исходя из настроек секции

		this.LogicDocument.Create_NewHistoryPoint();

		var sValue = "" + nPageAbs;
		for (var nIndex = 0, nLen = sValue.length; nIndex < nLen; ++nIndex)
		{
			this.LogicDocument.AddToParagraph(new ParaText(sValue.charAt(nIndex)));
		}

		this.LogicDocument.Recalculate();
	}
	else if (fieldtype_TOC === nFieldCode)
	{
		this.LogicDocument.Create_NewHistoryPoint();

		this.LogicDocument.GetBookmarksManager().RemoveTOCBookmarks();

		var nTabPos = 9345 / 20 / 72 * 25.4; // Стандартное значение для A4 и обычных полей 3см и 2см
		var oSectPr = this.LogicDocument.GetCurrentSectionPr();

		if (oSectPr)
			nTabPos = Math.max(0, Math.min(oSectPr.Get_PageWidth(), oSectPr.Get_PageWidth() - oSectPr.Get_PageMargin_Left() - oSectPr.Get_PageMargin_Right()));

		var oStyles          = this.LogicDocument.Get_Styles();
		var arrOutline       = this.LogicDocument.GetOutlineParagraphs();
		var oSelectedContent = new CSelectedContent();
		for (var nIndex = 0, nCount = arrOutline.length; nIndex < nCount; ++nIndex)
		{
			var oSrcParagraph = arrOutline[nIndex].Paragraph;

			var oPara = oSrcParagraph.Copy();
			oPara.Style_Add(oStyles.GetDefaultTOC(arrOutline[nIndex].Lvl), false);
			var sBookmarkName = oSrcParagraph.AddBookmarkForTOC();

			var oTabs = new CParaTabs();
			oTabs.Add(new CParaTab(tab_Right, nTabPos, Asc.c_oAscTabLeader.Dot));
			oPara.Set_Tabs(oTabs);

			var oTabRun = new ParaRun(oPara, false);
			oTabRun.Add_ToContent(0, new ParaTab());

			// TODO: ParaEnd
			oPara.Add_ToContent(oPara.Content.length - 1, oTabRun);

			var oPageRefRun = new ParaRun(oPara, false);

			var nTempIndex = -1;
			oPageRefRun.Add_ToContent(++nTempIndex, new ParaFieldChar(fldchartype_Begin, this));
			var sInstructionLine = "PAGEREF " + sBookmarkName + " \\h";
			for (var nPos = 0, nCount2 = sInstructionLine.length; nPos < nCount2; ++nPos)
			{
				oPageRefRun.Add_ToContent(++nTempIndex, new ParaInstrText(sInstructionLine.charAt(nPos)));
			}
			oPageRefRun.Add_ToContent(++nTempIndex, new ParaFieldChar(fldchartype_Separate, this));
			var sValue = "" + (oSrcParagraph.GetFirstNonEmptyPageAbsolute() + 1);
			for (var nPos = 0, nCount2 = sValue.length; nPos < nCount2; ++nPos)
			{
				oPageRefRun.Add_ToContent(++nTempIndex, new ParaText(sValue.charAt(nPos)));
			}
			oPageRefRun.Add_ToContent(++nTempIndex, new ParaFieldChar(fldchartype_End, this));

			oPara.Add_ToContent(oPara.Content.length - 1, oPageRefRun);
			oSelectedContent.Add(new CSelectedElement(oPara, true));
		}

		this.LogicDocument.TurnOff_Recalculate();
		this.LogicDocument.TurnOff_InterfaceEvents();
		this.LogicDocument.Remove(1, false, false, false);
		this.LogicDocument.TurnOn_Recalculate(false);
		this.LogicDocument.TurnOn_InterfaceEvents(false);

		var oRun       = this.BeginChar.GetRun();
		var oParagraph = oRun.GetParagraph();
		var oNearPos   = {
			Paragraph  : oParagraph,
			ContentPos : oParagraph.Get_ParaContentPos(false, false)
		};
		oParagraph.Check_NearestPos(oNearPos);

		this.LogicDocument.Insert_Content(oSelectedContent, oNearPos);
		this.LogicDocument.Recalculate();
	}
	else if (fieldtype_PAGEREF === nFieldCode)
	{
		this.LogicDocument.Create_NewHistoryPoint();

		var oBookmarksManager = this.LogicDocument.GetBookmarksManager();
		var oBookmark = oBookmarksManager.GetBookmarkByName(this.Instruction.GetBookmarkName());

		var sValue = AscCommon.translateManager.getValue("Error! Bookmark not defined.");
		if (oBookmark)
		{
			var oStartBookmark = oBookmark[0];
			var nBookmarkPage  = oStartBookmark.GetPage() + 1;
			if (this.Instruction.IsPositionRelative())
			{
				if (oStartBookmark.GetPage() === this.SeparateChar.GetPage())
				{
					var oBookmarkXY = oStartBookmark.GetXY();
					var oFieldXY    = this.SeparateChar.GetXY();

					if (Math.abs(oBookmarkXY.Y - oFieldXY.Y) < 0.001)
						sValue = oBookmarkXY.X < oFieldXY.X ? AscCommon.translateManager.getValue("above") : AscCommon.translateManager.getValue("below");
					else if (oBookmarkXY.Y < oFieldXY.Y)
						sValue = AscCommon.translateManager.getValue("above");
					else
						sValue = AscCommon.translateManager.getValue("below");
				}
				else
				{
					sValue = AscCommon.translateManager.getValue("on page ") + nBookmarkPage;
				}
			}
			else
			{
				sValue = (oStartBookmark.GetPage() + 1) + "";
			}
		}

		for (var nIndex = 0, nLen = sValue.length; nIndex < nLen; ++nIndex)
		{
			this.LogicDocument.AddToParagraph(new ParaText(sValue.charAt(nIndex)));
		}

		this.LogicDocument.Recalculate();
	}
};
CComplexField.prototype.private_SelectFieldValue = function()
{
	var oDocument = this.LogicDocument;

	var oRun = this.SeparateChar.GetRun();
	oRun.Make_ThisElementCurrent(false);
	oRun.SetCursorPosition(oRun.GetElementPosition(this.SeparateChar) + 1);
	var oStartPos = oDocument.GetContentPosition(false);

	oRun = this.EndChar.GetRun();
	oRun.Make_ThisElementCurrent(false);
	oRun.SetCursorPosition(oRun.GetElementPosition(this.EndChar));
	var oEndPos = oDocument.GetContentPosition(false);

	oDocument.SetSelectionByContentPositions(oStartPos, oEndPos);
};
CComplexField.prototype.private_SelectFieldCode = function()
{
	var oDocument = this.LogicDocument;

	var oRun = this.BeginChar.GetRun();
	oRun.Make_ThisElementCurrent(false);
	oRun.SetCursorPosition(oRun.GetElementPosition(this.BeginChar) + 1);
	var oStartPos = oDocument.GetContentPosition(false);

	oRun = this.SeparateChar.GetRun();
	oRun.Make_ThisElementCurrent(false);
	oRun.SetCursorPosition(oRun.GetElementPosition(this.SeparateChar));
	var oEndPos = oDocument.GetContentPosition(false);

	oDocument.SetSelectionByContentPositions(oStartPos, oEndPos);
};
CComplexField.prototype.IsUse = function()
{
	if (!this.BeginChar)
		return false;

	return this.BeginChar.IsUse();
};
CComplexField.prototype.GetStartDocumentPosition = function()
{
	if (!this.BeginChar)
		return null;

	var oDocument = this.LogicDocument;
	var oState    = oDocument.SaveDocumentState();

	var oRun = this.BeginChar.GetRun();
	oRun.Make_ThisElementCurrent(false);
	oRun.SetCursorPosition(oRun.GetElementPosition(this.BeginChar));
	var oDocPos = oDocument.GetContentPosition(false);

	oDocument.LoadDocumentState(oState);

	return oDocPos;
};
CComplexField.prototype.GetEndDocumentPosition = function()
{
	if (!this.EndChar)
		return null;

	var oDocument = this.LogicDocument;
	var oState    = oDocument.SaveDocumentState();

	var oRun = this.EndChar.GetRun();
	oRun.Make_ThisElementCurrent(false);
	oRun.SetCursorPosition(oRun.GetElementPosition(this.EndChar) + 1);
	var oDocPos = oDocument.GetContentPosition(false);

	oDocument.LoadDocumentState(oState);

	return oDocPos;
};
CComplexField.prototype.IsValid = function()
{
	return this.IsUse() && this.BeginChar && this.SeparateChar && this.EndChar;
};
CComplexField.prototype.GetInstruction = function()
{
	this.private_UpdateInstruction();
	return this.Instruction;
};
CComplexField.prototype.private_UpdateInstruction = function()
{
	if (!this.Instruction && this.InstructionLine)
	{
		var oParser = new CFieldInstructionParser();
		this.Instruction = oParser.GetInstructionClass(this.InstructionLine);
	}
};

function CComplexFieldStatePos(oComplexField, isFieldCode)
{
	this.FieldCode    = undefined !== isFieldCode ? isFieldCode : true;
	this.ComplexField = oComplexField ? oComplexField : null;
}
CComplexFieldStatePos.prototype.Copy = function()
{
	return new CComplexFieldStatePos(this.ComplexField, this.FieldCode);
};
CComplexFieldStatePos.prototype.SetFieldCode = function(isFieldCode)
{
	this.FieldCode = isFieldCode;
};
CComplexFieldStatePos.prototype.IsFieldCode = function()
{
	return this.FieldCode;
};