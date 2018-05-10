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
 * Time: 15:41
 */

var numbering_numfmt_None        = 0x0000;
var numbering_numfmt_Bullet      = 0x1001;
var numbering_numfmt_Decimal     = 0x2002;
var numbering_numfmt_LowerRoman  = 0x2003;
var numbering_numfmt_UpperRoman  = 0x2004;
var numbering_numfmt_LowerLetter = 0x2005;
var numbering_numfmt_UpperLetter = 0x2006;
var numbering_numfmt_DecimalZero = 0x2007;

var numbering_lvltext_Text = 1;
var numbering_lvltext_Num  = 2;

var numbering_suff_Tab     = 1;
var numbering_suff_Space   = 2;
var numbering_suff_Nothing = 3;

// Преобразовываем число в буквенную строку :
//  1 -> a
//  2 -> b
//   ...
// 26 -> z
// 27 -> aa
//   ...
// 52 -> zz
// 53 -> aaa
//   ...
function Numbering_Number_To_Alpha(Num, bLowerCase)
{
	var _Num = Num - 1;
	var Count = (_Num - _Num % 26) / 26;
	var Ost   = _Num % 26;

	var T = "";

	var Letter;
	if ( true === bLowerCase )
		Letter = String.fromCharCode( Ost + 97 );
	else
		Letter = String.fromCharCode( Ost + 65 );

	for ( var Index2 = 0; Index2 < Count + 1; Index2++ )
		T += Letter;

	return T;
}

// Преобразовываем число в обычную строку :
function Numbering_Number_To_String(Num)
{
	return "" + Num;
}

// Преобразовываем число в римскую систему исчисления :
//    1 -> i
//    4 -> iv
//    5 -> v
//    9 -> ix
//   10 -> x
//   40 -> xl
//   50 -> l
//   90 -> xc
//  100 -> c
//  400 -> cd
//  500 -> d
//  900 -> cm
// 1000 -> m
function Numbering_Number_To_Roman(Num, bLowerCase)
{
	// Переводим число Num в римскую систему исчисления
	var Rims;

	if ( true === bLowerCase )
		Rims = [  'm', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
	else
		Rims = [  'M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

	var Vals = [ 1000,  900, 500,  400, 100,   90,  50,   40,  10,    9,   5,    4,   1,   0];

	var T = "";
	var Index2 = 0;
	while ( Num > 0 )
	{
		while ( Vals[Index2] <= Num )
		{
			T   += Rims[Index2];
			Num -= Vals[Index2];
		}

		Index2++;

		if ( Index2 >= Rims.length )
			break;
	}

	return T;
}

function getNumInfoLvl(Lvl)
{
	var NumType    = -1;
	var NumSubType = -1;

	var NumFormat = Lvl.Format;
	var NumText   = Lvl.LvlText;
	var TextLen;

	if (numbering_numfmt_Bullet === NumFormat)
	{
		NumType    = 0;
		NumSubType = 0;

		TextLen = NumText.length;
		if (1 === TextLen && numbering_lvltext_Text === NumText[0].Type)
		{
			var NumVal = NumText[0].Value.charCodeAt(0);

			if (0x00B7 === NumVal)
				NumSubType = 1;
			else if (0x006F === NumVal)
				NumSubType = 2;
			else if (0x00A7 === NumVal)
				NumSubType = 3;
			else if (0x0076 === NumVal)
				NumSubType = 4;
			else if (0x00D8 === NumVal)
				NumSubType = 5;
			else if (0x00FC === NumVal)
				NumSubType = 6;
			else if (0x00A8 === NumVal)
				NumSubType = 7;
			else if (0x2013 === NumVal)
				NumSubType = 8;
		}
	}
	else
	{
		NumType    = 1;
		NumSubType = 0;

		TextLen = NumText.length;
		if (2 === TextLen && numbering_lvltext_Num === NumText[0].Type && numbering_lvltext_Text === NumText[1].Type)
		{
			var NumVal2 = NumText[1].Value;

			if (numbering_numfmt_Decimal === NumFormat)
			{
				if ("." === NumVal2)
					NumSubType = 1;
				else if (")" === NumVal2)
					NumSubType = 2;
			}
			else if (numbering_numfmt_UpperRoman === NumFormat)
			{
				if ("." === NumVal2)
					NumSubType = 3;
			}
			else if (numbering_numfmt_UpperLetter === NumFormat)
			{
				if ("." === NumVal2)
					NumSubType = 4;
			}
			else if (numbering_numfmt_LowerLetter === NumFormat)
			{
				if (")" === NumVal2)
					NumSubType = 5;
				else if ("." === NumVal2)
					NumSubType = 6;
			}
			else if (numbering_numfmt_LowerRoman === NumFormat)
			{
				if ("." === NumVal2)
					NumSubType = 7;
			}
		}
	}

	return {NumType : NumType, NumSubType : NumSubType};
}

//--------------------------------------------------------export--------------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].getNumInfoLvl = getNumInfoLvl;

window['AscCommonWord']["numbering_numfmt_None"]        = numbering_numfmt_None;
window['AscCommonWord']["numbering_numfmt_Bullet"]      = numbering_numfmt_Bullet;
window['AscCommonWord']["numbering_numfmt_Decimal"]     = numbering_numfmt_Decimal;
window['AscCommonWord']["numbering_numfmt_LowerRoman"]  = numbering_numfmt_LowerRoman;
window['AscCommonWord']["numbering_numfmt_UpperRoman"]  = numbering_numfmt_UpperRoman;
window['AscCommonWord']["numbering_numfmt_LowerLetter"] = numbering_numfmt_LowerLetter;
window['AscCommonWord']["numbering_numfmt_UpperLetter"] = numbering_numfmt_UpperLetter;
window['AscCommonWord']["numbering_numfmt_DecimalZero"] = numbering_numfmt_DecimalZero;