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

function ParaFieldChar(Type)
{
	CRunElementBase.call(this);

	this.Use          = true;
	this.CharType     = undefined === Type ? fldchartype_Begin : Type;
	this.ComplexField = null;
	this.Run          = null;
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
};
ParaFieldChar.prototype.SetRun = function(oRun)
{
	this.Run = oRun;
};
ParaFieldChar.prototype.GetRun = function()
{
	return this.Run;
};

function ParaInstrText(nType, nFlags)
{
	CRunElementBase.call(this);

	this.FieldCode = nType;
	this.Flags     = nFlags;
	this.Run       = null;
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
	// Long : FieldCode
	Writer.WriteLong(this.Type);
	Writer.WriteLong(this.FieldCode);
};
ParaInstrText.prototype.Read_FromBinary = function(Reader)
{
	// Long : FieldCode
	this.FieldCode = Reader.GetLong();
};
ParaInstrText.prototype.GetFieldCode = function()
{
	return this.FieldCode;
};
ParaInstrText.prototype.SetRun = function(oRun)
{
	this.Run = oRun;
};
ParaInstrText.prototype.GetRun = function()
{
	return this.Run;
};

function CComplexField(oLogicDocument)
{
	this.LogicDocument = oLogicDocument;
	this.BeginChar     = null;
	this.EndChar       = null;
	this.SeparateChar  = null;
	this.Instruction   = null;
}
CComplexField.prototype.SetInstruction = function(oParaInstr)
{
	this.Instruction = oParaInstr;
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
	this.BeginChar = oChar;
	oChar.SetComplexField(this);
};
CComplexField.prototype.SetEndChar = function(oChar)
{
	this.EndChar = oChar;
	oChar.SetComplexField(this);
};
CComplexField.prototype.SetSeparateChar = function(oChar)
{
	this.SeparateChar = oChar;
	oChar.SetComplexField(this);
};
CComplexField.prototype.Update = function()
{
	if (!this.Instruction || !this.BeginChar || !this.EndChar || !this.SeparateChar)
		return;

	this.private_SelectFieldValue();

	var nFieldCode = this.Instruction.GetFieldCode();
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

/*
 * Данный класс предназаначен для объединения символов начала/конца/разделения в
 * общий класс CComplexField.
 */
function CComplexFieldsRegroupManager(oFieldsManager, oLogicDocument)
{
	this.LogicDocument = oLogicDocument;
	this.FieldsManager = oFieldsManager;
	this.BeginChar     = [];
}
CComplexFieldsRegroupManager.prototype.ProcessChar = function(oChar)
{
	if (!oChar || !(oChar instanceof ParaFieldChar))
		return;

	oChar.SetUse(true);
	if (oChar.IsBegin())
	{
		var oComplexField = new CComplexField(this.LogicDocument);
		oComplexField.SetBeginChar(oChar);
		this.BeginChar.push(oChar);
	}
	else if (oChar.IsSeparate())
	{
		if (this.BeginChar.length <= 0)
		{
			oChar.SetUse(false);
		}
		else
		{
			var oBeginChar    = this.BeginChar[this.BeginChar.length - 1];
			var oComplexField = oBeginChar.GetComplexField();
			oComplexField.SetSeparateChar(oChar);
		}
	}
	else if (oChar.IsEnd())
	{
		if (this.BeginChar.length <= 0)
		{
			oChar.SetUse(false);
		}
		else
		{
			var oBeginChar = this.BeginChar[this.BeginChar.length - 1];
			var oComplexField = oBeginChar.GetComplexField();
			oComplexField.SetEndChar(oChar);

			this.BeginChar.splice(this.BeginChar.length - 1, 1);
			this.FieldsManager.RegisterComplexField(oComplexField);
		}
	}

};
CComplexFieldsRegroupManager.prototype.ProcessInstruction = function(oParaInstruction)
{
	if (!oParaInstruction || !(oParaInstruction instanceof ParaInstrText) || this.BeginChar.length <= 0)
		return;

	var oComplexField = this.BeginChar[this.BeginChar.length - 1].GetComplexField();
	if (!oComplexField)
		return;

	oComplexField.SetInstruction(oParaInstruction);
};