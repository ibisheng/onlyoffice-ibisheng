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
 * Date: 08.05.2018
 * Time: 17:06
 */

function CNumberingLvl()
{
	this.Jc      = AscCommon.align_Left;
	this.Format  = numbering_numfmt_Bullet;
	this.PStyle  = undefined;
	this.Start   = 1;
	this.Restart = -1; // -1 - делаем нумерацию сначала всегда, 0 - никогда не начинаем нумерацию заново
	this.Suff    = numbering_suff_Tab;
	this.TextPr  = new CTextPr();
	this.ParaPr  = new CParaPr();
	this.LvlText = [];
}
CNumberingLvl.prototype.WriteToBinary = function(oWriter)
{
	// Long               : Jc
	// Long               : Format
	// String             : PStyle
	// Long               : Start
	// Long               : Restart
	// Long               : Suff
	// Variable           : TextPr
	// Variable           : ParaPr
	// Long               : количество элементов в LvlText
	// Array of variables : массив LvlText

	oWriter.WriteLong(this.Jc);
	oWriter.WriteLong(this.Format);

	oWriter.WriteString2(this.PStyle ? this.PStyle : "");

	oWriter.WriteLong(this.Start);
	oWriter.WriteLong(this.Restart);
	oWriter.WriteLong(this.Suff);

	this.TextPr.WriteToBinary(oWriter);
	this.ParaPr.WriteToBinary(oWriter);

	var nCount = this.LvlText.length;
	oWriter.WriteLong(nCount);

	for (var nIndex = 0; nIndex < nCount; ++nIndex)
		this.LvlText[Index].WriteToBinary(oWriter);
};
CNumberingLvl.prototype.ReadFromBinary = function(oReader)
{
	// Long               : Jc
	// Long               : Format
	// String             : PStyle
	// Long               : Start
	// Long               : Restart
	// Long               : Suff
	// Variable           : TextPr
	// Variable           : ParaPr
	// Long               : количество элементов в LvlText
	// Array of variables : массив LvlText

	this.Jc     = oReader.GetLong();
	this.Format = oReader.GetLong();

	this.PStyle = oReader.GetString2();
	if ("" === Lvl.PStyle)
		this.PStyle = undefined;

	this.Start   = oReader.GetLong();
	this.Restart = oReader.GetLong();
	this.Suff    = oReader.GetLong();

	this.TextPr = new CTextPr();
	this.ParaPr = new CParaPr();
	this.TextPr.ReadFromBinary(oReader);
	this.ParaPr.ReadFromBinary(oReader);

	var nCount = oReader.GetLong();
	this.LvlText = [];
	for (var nIndex = 0; nIndex < nCount; ++nIndex)
	{
		var oElement = this.private_ReadLvlTextFromBinary(oReader);
		if (oElement)
			this.LvlText.push(oElement);
	}
};
CNumberingLvl.prototype.private_ReadLvlTextFromBinary = function(oReader)
{
	var nType = oReader.GetLong();

	var oElement = null;
	if (numbering_lvltext_Num === nType)
		oElement = new CNumberingLvlTextNum();
	else if (numbering_lvltext_Text === nType)
		oElement = new CNumberingLvlTextString();

	oElement.ReadFromBinary(oReader);
	return oElement;
};


function CNumberingLvlTextString(Val)
{
	if ("string" == typeof(Val))
		this.Value = Val;
	else
		this.Value = "";

	this.Type = numbering_lvltext_Text;
}
CNumberingLvlTextString.prototype.Copy = function()
{
	return new CNumberingLvlTextString(this.Value);
};
CNumberingLvlTextString.prototype.WriteToBinary = function(Writer)
{
	// Long   : numbering_lvltext_Text
	// String : Value

	Writer.WriteLong(numbering_lvltext_Text);
	Writer.WriteString2(this.Value);
};
CNumberingLvlTextString.prototype.ReadFromBinary = function(Reader)
{
	this.Value = Reader.GetString2();
};

function CNumberingLvlTextNum(Lvl)
{
	if ("number" == typeof(Lvl))
		this.Value = Lvl;
	else
		this.Value = 0;

	this.Type = numbering_lvltext_Num;
}
CNumberingLvlTextNum.prototype.Copy = function()
{
	return new CNumberingLvlTextNum(this.Value);
};
CNumberingLvlTextNum.prototype.WriteToBinary = function(Writer)
{
	// Long : numbering_lvltext_Text
	// Long : Value

	Writer.WriteLong(numbering_lvltext_Num);
	Writer.WriteLong(this.Value);
};
CNumberingLvlTextNum.prototype.ReadFromBinary = function(Reader)
{
	this.Value = Reader.GetLong();
};