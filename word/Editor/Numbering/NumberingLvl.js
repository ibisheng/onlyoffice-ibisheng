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
/**
 * Выставляем значения по умолчанию для заданного уровня
 * @param nLvl {number} 0..8
 * @param nType {c_oAscMultiLevelNumbering}
 */
CNumberingLvl.prototype.InitDefault = function(nLvl, nType)
{
	switch (nType)
	{
		case c_oAscMultiLevelNumbering.Numbered:
			this.private_InitDefaultNumbered(nLvl);
			break;
		case c_oAscMultiLevelNumbering.Bullet:
			this.private_InitDefaultBullet(nLvl);
			break;
		case c_oAscMultiLevelNumbering.MultiLevel1:
			this.private_InitDefaultMultilevel1(nLvl);
			break;
		case c_oAscMultiLevelNumbering.MultiLevel2:
			this.private_InitDefaultMultilevel2(nLvl);
			break;
		case c_oAscMultiLevelNumbering.MultiLevel3:
			this.private_InitDefaultMultiLevel3(nLvl);
			break;
		default:
			this.private_InitDefault(nLvl);
	}
};
CNumberingLvl.prototype.private_InitDefault = function(nLvl)
{
	this.Jc      = AscCommon.align_Left;
	this.Format  = numbering_numfmt_Bullet;
	this.PStyle  = undefined;
	this.Start   = 1;
	this.Restart = -1; // -1 - делаем нумерацию сначала всегда, 0 - никогда не начинаем нумерацию заново
	this.Suff    = numbering_suff_Tab;

	this.ParaPr               = new CParaPr();
	this.ParaPr.Ind.Left      = 36 * (nLvl + 1) * g_dKoef_pt_to_mm;
	this.ParaPr.Ind.FirstLine = -18 * g_dKoef_pt_to_mm;

	this.TextPr = new CTextPr();
	this.LvlText = [];

	if (0 == nLvl % 3)
	{
		this.TextPr.RFonts.Set_All("Symbol", -1);
		this.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00B7)));
	}
	else if (1 == nLvl % 3)
	{
		this.TextPr.RFonts.Set_All("Courier New", -1);
		this.LvlText.push(new CNumberingLvlTextString("o"));
	}
	else
	{
		this.TextPr.RFonts.Set_All("Wingdings", -1);
		this.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00A7)));
	}
};
/**
 * Выставляем значения по умолчанию для заданного уровня для нумерованного списка
 * @param nLvl {number} 0..8
 */
CNumberingLvl.prototype.private_InitDefaultNumbered = function(nLvl)
{
	this.Start   = 1;
	this.Restart = -1;
	this.Suff    = numbering_suff_Tab;

	var nLeft      = 36 * (nLvl + 1) * g_dKoef_pt_to_mm;
	var nFirstLine = -18 * g_dKoef_pt_to_mm;

	if (0 == nLvl % 3)
	{
		this.Jc     = AscCommon.align_Left;
		this.Format = numbering_numfmt_Decimal;
	}
	else if (1 == nLvl % 3)
	{
		this.Jc     = AscCommon.align_Left;
		this.Format = numbering_numfmt_LowerLetter;
	}
	else
	{
		this.Jc     = AscCommon.align_Right;
		this.Format = numbering_numfmt_LowerRoman;
		nFirstLine  = -9 * g_dKoef_pt_to_mm;
	}

	this.LvlText = [];
	this.LvlText.push(new CNumberingLvlTextNum(nLvl));
	this.LvlText.push(new CNumberingLvlTextString("."));

	this.ParaPr               = new CParaPr();
	this.ParaPr.Ind.Left      = nLeft;
	this.ParaPr.Ind.FirstLine = nFirstLine;

	this.TextPr = new CTextPr();
};
/**
 * Многоуровневый символьный список
 * @param nLvl {number} 0..8
 */
CNumberingLvl.prototype.private_InitDefaultBullet = function(nLvl)
{
	this.Start   = 1;
	this.Restart = -1;
	this.Suff    = numbering_suff_Tab;
	this.Jc      = AscCommon.align_Left;
	this.Format  = numbering_numfmt_Bullet;

	this.ParaPr               = new CParaPr();
	this.ParaPr.Ind.Left      = 36 * (nLvl + 1) * g_dKoef_pt_to_mm;
	this.ParaPr.Ind.FirstLine = -18 * g_dKoef_pt_to_mm;

	this.TextPr  = new CTextPr();
	this.LvlText = [];
	if (0 == nLvl % 3)
	{
		this.TextPr.RFonts.Set_All("Symbol", -1);
		this.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00B7)));
	}
	else if (1 == nLvl % 3)
	{
		this.TextPr.RFonts.Set_All("Courier New", -1);
		this.LvlText.push(new CNumberingLvlTextString("o"));
	}
	else
	{
		this.TextPr.RFonts.Set_All("Wingdings", -1);
		this.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00A7)));
	}
};
/**
 * Многоуровневый список 1) a) i) 1) a) i) 1) a) i)
 * @param nLvl {number} 0..8
 */
CNumberingLvl.prototype.private_InitDefaultMultilevel1 = function(nLvl)
{
	this.Start   = 1;
	this.Restart = -1;
	this.Suff    = numbering_suff_Tab;
	this.Jc      = AscCommon.align_Left;

	if (0 == nLvl % 3)
	{
		this.Format = numbering_numfmt_Decimal;
	}
	else if (1 == nLvl % 3)
	{
		this.Format = numbering_numfmt_LowerLetter;
	}
	else
	{
		this.Format = numbering_numfmt_LowerRoman;
	}

	this.LvlText = [];
	this.LvlText.push(new CNumberingLvlTextNum(nLvl));
	this.LvlText.push(new CNumberingLvlTextString(")"));

	var nLeft      = 18 * (nLvl + 1) * g_dKoef_pt_to_mm;
	var nFirstLine = -18 * g_dKoef_pt_to_mm;

	this.ParaPr               = new CParaPr();
	this.ParaPr.Ind.Left      = nLeft;
	this.ParaPr.Ind.FirstLine = nFirstLine;

	this.TextPr = new CTextPr();
};
/**
 * Многоуровневый список 1. 1.1. 1.1.1. и т.д.
 * @param nLvl {number} 0..8
 */
CNumberingLvl.prototype.private_InitDefaultMultilevel2 = function(nLvl)
{
	this.Jc     = AscCommon.align_Left;
	this.Format = numbering_numfmt_Decimal;
	this.Start   = 1;
	this.Restart = -1;
	this.Suff    = numbering_suff_Tab;

	var nLeft      = 0;
	var nFirstLine = 0;

	switch (nLvl)
	{
		case 0 :
			nLeft      = 18 * g_dKoef_pt_to_mm;
			nFirstLine = -18 * g_dKoef_pt_to_mm;
			break;
		case 1 :
			nLeft      = 39.6 * g_dKoef_pt_to_mm;
			nFirstLine = -21.6 * g_dKoef_pt_to_mm;
			break;
		case 2 :
			nLeft      = 61.2 * g_dKoef_pt_to_mm;
			nFirstLine = -25.2 * g_dKoef_pt_to_mm;
			break;
		case 3 :
			nLeft      = 86.4 * g_dKoef_pt_to_mm;
			nFirstLine = -32.4 * g_dKoef_pt_to_mm;
			break;
		case 4 :
			nLeft      = 111.6 * g_dKoef_pt_to_mm;
			nFirstLine = -39.6 * g_dKoef_pt_to_mm;
			break;
		case 5 :
			nLeft      = 136.8 * g_dKoef_pt_to_mm;
			nFirstLine = -46.8 * g_dKoef_pt_to_mm;
			break;
		case 6 :
			nLeft      = 162 * g_dKoef_pt_to_mm;
			nFirstLine = -54 * g_dKoef_pt_to_mm;
			break;
		case 7 :
			nLeft      = 187.2 * g_dKoef_pt_to_mm;
			nFirstLine = -61.2 * g_dKoef_pt_to_mm;
			break;
		case 8 :
			nLeft      = 216 * g_dKoef_pt_to_mm;
			nFirstLine = -72 * g_dKoef_pt_to_mm;
			break;
	}

	this.LvlText = [];
	for (var nIndex = 0; nIndex <= nLvl; ++nIndex)
	{
		this.LvlText.push(new CNumberingLvlTextNum(nIndex));
		this.LvlText.push(new CNumberingLvlTextString("."));
	}

	this.ParaPr               = new CParaPr();
	this.ParaPr.Ind.Left      = nLeft;
	this.ParaPr.Ind.FirstLine = nFirstLine;

	this.TextPr = new CTextPr();
};
/**
 * Многоуровневый символьный список
 * @param nLvl {number} 0..8
 */
CNumberingLvl.prototype.private_InitDefaultMultiLevel3 = function(nLvl)
{
	this.Start   = 1;
	this.Restart = -1;
	this.Suff    = numbering_suff_Tab;
	this.Format  = numbering_numfmt_Bullet;
	this.Jc      = AscCommon.align_Left;
	this.LvlText = [];

	switch (nLvl)
	{
		case 0:
			this.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x0076)));
			break;
		case 1:
			this.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00D8)));
			break;
		case 2:
			this.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00A7)));
			break;
		case 3:
			this.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00B7)));
			break;
		case 4:
			this.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00A8)));
			break;
		case 5:
			this.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00D8)));
			break;
		case 6:
			this.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00A7)));
			break;
		case 7:
			this.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00B7)));
			break;
		case 8:
			this.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00A8)));
			break;
	}

	var nLeft      = 18 * (nLvl + 1) * g_dKoef_pt_to_mm;
	var nFirstLine = -18 * g_dKoef_pt_to_mm;

	this.ParaPr               = new CParaPr();
	this.ParaPr.Ind.Left      = nLeft;
	this.ParaPr.Ind.FirstLine = nFirstLine;

	this.TextPr = new CTextPr();
	if (3 === nLvl || 4 === nLvl || 7 === nLvl || 8 === nLvl)
		this.TextPr.RFonts.Set_All("Symbol", -1);
	else
		this.TextPr.RFonts.Set_All("Wingdings", -1);
};
/**
 * Создаем копию
 * @returns {CNumberingLvl}
 */
CNumberingLvl.prototype.Copy = function()
{
	var oLvl = new CNumberingLvl();

	oLvl.Jc      = this.Jc;
	oLvl.Format  = this.Format;
	oLvl.PStyle  = this.PStyle;
	oLvl.Start   = this.Start;
	oLvl.Restart = this.Restart;
	oLvl.Suff    = this.Suff;
	oLvl.LvlText = [];

	for (var nIndex = 0, nCount = this.LvlText.length; nIndex < nCount; ++nIndex)
	{
		oLvl.LvlText.push(this.LvlText[nIndex].Copy());
	}
	oLvl.TextPr = this.TextPr.Copy();
	oLvl.ParaPr = this.ParaPr.Copy();

	return oLvl;
};
/**
 * Выставляем значения по заданному пресету
 * @param nType {c_oAscNumberingLevel}
 * @param nLvl {number} 0..8
 * @param [sText=undefined] Используется для типа c_oAscNumberingLevel.Bullet
 * @param [oTextPr=undefined] {CTextPr} Используется для типа c_oAscNumberingLevel.Bullet
 */
CNumberingLvl.prototype.SetByType = function(nType, nLvl, sText, oTextPr)
{
	switch (nType)
	{
		case c_oAscNumberingLevel.None:
			this.Format  = numbering_numfmt_None;
			this.LvlText = [];
			this.TextPr  = new CTextPr();
			break;
		case c_oAscNumberingLevel.Bullet:
			this.Format  = numbering_numfmt_Bullet;
			this.TextPr  = oTextPr;
			this.LvlText = [];
			this.LvlText.push(new CNumberingLvlTextString(sText));
			break;
		case c_oAscNumberingLevel.DecimalBracket_Right:
			this.Jc      = AscCommon.align_Right;
			this.Format  = numbering_numfmt_Decimal;
			this.LvlText = [];
			this.LvlText.push(new CNumberingLvlTextNum(nLvl));
			this.LvlText.push(new CNumberingLvlTextString(")"));
			this.TextPr = new CTextPr();
			break;
		case c_oAscNumberingLevel.DecimalBracket_Left:
			this.Jc      = AscCommon.align_Left;
			this.Format  = numbering_numfmt_Decimal;
			this.LvlText = [];
			this.LvlText.push(new CNumberingLvlTextNum(nLvl));
			this.LvlText.push(new CNumberingLvlTextString(")"));
			this.TextPr = new CTextPr();
			break;
		case c_oAscNumberingLevel.DecimalDot_Right:
			this.Jc      = AscCommon.align_Right;
			this.Format  = numbering_numfmt_Decimal;
			this.LvlText = [];
			this.LvlText.push(new CNumberingLvlTextNum(nLvl));
			this.LvlText.push(new CNumberingLvlTextString("."));
			this.TextPr = new CTextPr();
			break;
		case c_oAscNumberingLevel.DecimalDot_Left:
			this.Jc      = AscCommon.align_Left;
			this.Format  = numbering_numfmt_Decimal;
			this.LvlText = [];
			this.LvlText.push(new CNumberingLvlTextNum(nLvl));
			this.LvlText.push(new CNumberingLvlTextString("."));
			this.TextPr = new CTextPr();
			break;
		case c_oAscNumberingLevel.UpperRomanDot_Right:
			this.Jc      = AscCommon.align_Right;
			this.Format  = numbering_numfmt_UpperRoman;
			this.LvlText = [];
			this.LvlText.push(new CNumberingLvlTextNum(nLvl));
			this.LvlText.push(new CNumberingLvlTextString("."));
			this.TextPr = new CTextPr();
			break;
		case c_oAscNumberingLevel.UpperLetterDot_Left:
			this.Jc      = AscCommon.align_Left;
			this.Format  = numbering_numfmt_UpperLetter;
			this.LvlText = [];
			this.LvlText.push(new CNumberingLvlTextNum(nLvl));
			this.LvlText.push(new CNumberingLvlTextString("."));
			this.TextPr = new CTextPr();
			break;
		case c_oAscNumberingLevel.LowerLetterBracket_Left:
			this.Jc      = AscCommon.align_Left;
			this.Format  = numbering_numfmt_LowerLetter;
			this.LvlText = [];
			this.LvlText.push(new CNumberingLvlTextNum(nLvl));
			this.LvlText.push(new CNumberingLvlTextString(")"));
			this.TextPr = new CTextPr();
			break;
		case c_oAscNumberingLevel.LowerLetterDot_Left:
			this.Jc      = AscCommon.align_Left;
			this.Format  = numbering_numfmt_LowerLetter;
			this.LvlText = [];
			this.LvlText.push(new CNumberingLvlTextNum(nLvl));
			this.LvlText.push(new CNumberingLvlTextString("."));
			this.TextPr = new CTextPr();
			break;
		case c_oAscNumberingLevel.LowerRomanDot_Right:
			this.Jc      = AscCommon.align_Right;
			this.Format  = numbering_numfmt_LowerRoman;
			this.LvlText = [];
			this.LvlText.push(new CNumberingLvlTextNum(nLvl));
			this.LvlText.push(new CNumberingLvlTextString("."));
			this.TextPr = new CTextPr();
			break;
	}
};
/**
 * Выставляем значения по заданному формату
 * @param nLvl {number} 0..8
 * @param nType
 * @param sFormatText
 * @param nAlign
 */
CNumberingLvl.prototype.SetByFormat = function(nLvl, nType, sFormatText, nAlign)
{
	this.Jc      = nAlign;
	this.Format  = nType;
	this.LvlText = [];

	var nLastPos = 0;
	var nPos     = 0;
	while (-1 !== (nPos = sFormatText.indexOf("%", nPos)) && nPos < sFormatText.length)
	{
		if (nPos < sFormatText.length - 1 && sFormatText.charCodeAt(nPos + 1) >= 49 && sFormatText.charCodeAt(nPos + 1) <= 49 + nLvl)
		{
			if (nPos > nLastPos)
			{
				var sSubString = sFormatText.substring(nLastPos, nPos);
				for (var nSubIndex = 0, nSubLen = sSubString.length; nSubIndex < nSubLen; ++nSubIndex)
					this.LvlText.push(new CNumberingLvlTextString(sSubString.charAt(nSubIndex)));
			}

			this.LvlText.push(new CNumberingLvlTextNum(sFormatText.charCodeAt(nPos + 1) - 49));
			nPos += 2;
			nLastPos = nPos;
		}
		else
		{
			nPos++;
		}
	}
	nPos = sFormatText.length;
	if (nPos > nLastPos)
	{
		var sSubString = sFormatText.substring(nLastPos, nPos);
		for (var nSubIndex = 0, nSubLen = sSubString.length; nSubIndex < nSubLen; ++nSubIndex)
			this.LvlText.push(new CNumberingLvlTextString(sSubString.charAt(nSubIndex)));
	}

	this.TextPr = new CTextPr();
};
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
		this.LvlText[nIndex].WriteToBinary(oWriter);
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
	if ("" === this.PStyle)
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