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

function ParaFieldChar(Type, ComplexField)
{
	CRunElementBase.call(this);

	this.CharType     = undefined === Type ? fldchartype_Begin : Type;
	this.ComplexField = ComplexField;
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
ParaFieldChar.prototype.GetComplexField = function()
{
	return this.ComplexField;
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

function ParaInstrText(nType, nFlags)
{
	CRunElementBase.call(this);

	this.FieldCode = nType;
	this.Flags     = nFlags;
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

function CComplexField()
{
	this.BeginChar    = new ParaFieldChar(fldchartype_Begin, this);
	this.EndChar      = new ParaFieldChar(fldchartype_End, this);
	this.SeparateChar = new ParaFieldChar(fldchartype_Separate, this);
	this.Instruction  = "";
}
CComplexField.prototype.ResetInstruction = function()
{
	this.Instruction = "";
};
CComplexField.prototype.AddInstruction = function(sInstr)
{
	this.Instruction += sInstr;
};
CComplexField.prototype.ParseInstruction = function()
{
	// TODO:
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