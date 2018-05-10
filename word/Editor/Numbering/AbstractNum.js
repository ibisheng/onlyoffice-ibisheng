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
 * Time: 15:08
 */

// Import
var g_oTextMeasurer = AscCommon.g_oTextMeasurer;
var History         = AscCommon.History;

/**
 * Класс реализующий w:abstractNum
 * @param Type - тип нумерации
 * @constructor
 */
function CAbstractNum(Type)
{
	this.Id = AscCommon.g_oIdCounter.Get_NewId();

	if ( "undefined" == typeof(Type) )
		Type = numbering_numfmt_Bullet;

	this.Lock = new AscCommon.CLock();
	if ( false === AscCommon.g_oIdCounter.m_bLoad )
	{
		this.Lock.Set_Type(AscCommon.locktype_Mine, false);
		if (typeof AscCommon.CollaborativeEditing !== "undefined")
			AscCommon.CollaborativeEditing.Add_Unlock2( this );
	}

	this.NumStyleLink = undefined;
	this.StyleLink    = undefined;

	this.Lvl = [];
	for ( var Index = 0; Index < 9; Index++ )
	{
		this.Lvl[Index] = {};
		var Lvl = this.Lvl[Index];

		Lvl.PStyle  = undefined;
		Lvl.Start   = 1;
		Lvl.Restart = -1;        // -1 - делаем нумерацию сначала всегда, 0 - никогда не начинаем нумерацию заново
		Lvl.Suff    = numbering_suff_Tab;

		var Left      =  36 * (Index + 1) * g_dKoef_pt_to_mm;
		var FirstLine = -18 * g_dKoef_pt_to_mm;

		Lvl.Jc     = AscCommon.align_Left;
		Lvl.Format = numbering_numfmt_Bullet;

		Lvl.LvlText = [];

		Lvl.ParaPr = new CParaPr();
		Lvl.ParaPr.Ind.Left      = Left;
		Lvl.ParaPr.Ind.FirstLine = FirstLine;

		var TextPr = new CTextPr();
		if ( 0 == Index % 3 )
		{
			TextPr.RFonts.Set_All( "Symbol", -1 );
			Lvl.LvlText.push( new CNumberingLvlTextString( String.fromCharCode( 0x00B7 ) ) );
		}
		else if ( 1 == Index % 3 )
		{
			TextPr.RFonts.Set_All( "Courier New", -1 );
			Lvl.LvlText.push( new CNumberingLvlTextString( "o" ) );
		}
		else
		{
			TextPr.RFonts.Set_All( "Wingdings", -1 );
			Lvl.LvlText.push( new CNumberingLvlTextString( String.fromCharCode( 0x00A7 ) ) );
		}

		Lvl.TextPr = TextPr;
	}

	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	AscCommon.g_oTableId.Add( this, this.Id );
}

CAbstractNum.prototype.Get_Id = function()
{
	return this.Id;
};
CAbstractNum.prototype.Copy = function(AbstractNum)
{
	//TODO: Сделать функциями для совместного редактирования
	this.StyleLink    = AbstractNum.StyleLink;
	this.NumStyleLink = AbstractNum.NumStyleLink;

	for (var Index = 0; Index < 9; Index++)
	{
		var Lvl_new = this.Internal_CopyLvl(AbstractNum.Lvl[Index]);
		var Lvl_old = this.Lvl[Index];
		History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, Index));
		this.Lvl[Index] = Lvl_new;
	}
};
/**
 * Сдвигаем все уровни на заданное значение
 * @param NewLeft
 */
CAbstractNum.prototype.Change_LeftInd = function(NewLeft)
{
	var OldLeft = this.Lvl[0].ParaPr.Ind.Left;
	for (var Index = 0; Index < 9; Index++)
	{
		var Lvl_new             = this.Internal_CopyLvl(this.Lvl[Index]);
		var Lvl_old             = this.Internal_CopyLvl(this.Lvl[Index]);
		Lvl_new.ParaPr.Ind.Left = Lvl_old.ParaPr.Ind.Left - OldLeft + NewLeft;

		this.Internal_SetLvl(Index, Lvl_new);

		History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, Index));
	}

	var LogicDocument = editor.WordControl.m_oLogicDocument;
	var AllParagraphs = LogicDocument.GetAllParagraphsByNumbering({NumId : this.Id, Lvl : undefined});

	var Count = AllParagraphs.length;
	for (var Index = 0; Index < Count; Index++)
	{
		var Para                   = AllParagraphs[Index];
		Para.CompiledPr.NeedRecalc = true;
	}
};
/**
 * Получаем уровень списка по заданном стилю
 * @param StyleId
 * @returns {number}
 */
CAbstractNum.prototype.Get_LvlByStyle = function(StyleId)
{
	for (var Index = 0; Index < 9; Index++)
	{
		var Lvl = this.Lvl[Index];

		if (StyleId === Lvl.PStyle)
			return Index;
	}

	return -1;
};
CAbstractNum.prototype.Get_Lvl = function(Lvl)
{
	if (undefined === this.Lvl[Lvl])
		return this.Lvl[0];

	return this.Lvl[Lvl];
};
CAbstractNum.prototype.Set_Lvl = function(iLvl, Lvl_new)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl_old    = this.Lvl[iLvl];
	this.Lvl[iLvl] = Lvl_new;
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
CAbstractNum.prototype.Create_Default_Numbered = function()
{
	for (var Index = 0; Index < 9; Index++)
	{
		var Lvl_old = this.Internal_CopyLvl(this.Lvl[Index]);

		this.Lvl[Index] = {};
		var Lvl         = this.Lvl[Index];

		Lvl.Start   = 1;
		Lvl.Restart = -1;        // -1 - делаем нумерацию сначала всегда, 0 - никогда не начинаем нумерацию заново
		Lvl.Suff    = numbering_suff_Tab;

		var Left      = 36 * (Index + 1) * g_dKoef_pt_to_mm;
		var FirstLine = -18 * g_dKoef_pt_to_mm;

		if (0 == Index % 3)
		{
			Lvl.Jc     = AscCommon.align_Left;
			Lvl.Format = numbering_numfmt_Decimal;
		}
		else if (1 == Index % 3)
		{
			Lvl.Jc     = AscCommon.align_Left;
			Lvl.Format = numbering_numfmt_LowerLetter;
		}
		else
		{
			Lvl.Jc     = AscCommon.align_Right;
			Lvl.Format = numbering_numfmt_LowerRoman;
			FirstLine  = -9 * g_dKoef_pt_to_mm;
		}

		Lvl.LvlText = [];
		Lvl.LvlText.push(new CNumberingLvlTextNum(Index));
		Lvl.LvlText.push(new CNumberingLvlTextString("."));

		Lvl.ParaPr               = new CParaPr();
		Lvl.ParaPr.Ind.Left      = Left;
		Lvl.ParaPr.Ind.FirstLine = FirstLine;

		Lvl.TextPr = new CTextPr();

		var Lvl_new = this.Internal_CopyLvl(Lvl);
		History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, Index));
	}
};
CAbstractNum.prototype.Create_Default_Multilevel_1 = function()
{
	for (var Index = 0; Index < 9; Index++)
	{
		var Lvl_old = this.Internal_CopyLvl(this.Lvl[Index]);

		this.Lvl[Index] = {};
		var Lvl         = this.Lvl[Index];

		Lvl.Start   = 1;
		Lvl.Restart = -1;
		Lvl.Suff    = numbering_suff_Tab;

		var Left      = 18 * (Index + 1) * g_dKoef_pt_to_mm;
		var FirstLine = -18 * g_dKoef_pt_to_mm;

		Lvl.Jc = AscCommon.align_Left;

		if (0 == Index % 3)
		{
			Lvl.Format = numbering_numfmt_Decimal;
		}
		else if (1 == Index % 3)
		{
			Lvl.Format = numbering_numfmt_LowerLetter;
		}
		else
		{
			Lvl.Format = numbering_numfmt_LowerRoman;
		}

		Lvl.LvlText = [];
		Lvl.LvlText.push(new CNumberingLvlTextNum(Index));
		Lvl.LvlText.push(new CNumberingLvlTextString(")"));

		Lvl.ParaPr               = new CParaPr();
		Lvl.ParaPr.Ind.Left      = Left;
		Lvl.ParaPr.Ind.FirstLine = FirstLine;

		var TextPr = new CTextPr();
		Lvl.TextPr = TextPr;

		var Lvl_new = this.Internal_CopyLvl(Lvl);
		History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, Index));
	}
};
CAbstractNum.prototype.Create_Default_Multilevel_2 = function()
{
	for (var Index = 0; Index < 9; Index++)
	{
		var Lvl_old = this.Internal_CopyLvl(this.Lvl[Index]);

		this.Lvl[Index] = {};
		var Lvl         = this.Lvl[Index];

		Lvl.Start   = 1;
		Lvl.Restart = -1;        // -1 - делаем нумерацию сначала всегда, 0 - никогда не начинаем нумерацию заново
		Lvl.Suff    = numbering_suff_Tab;

		var Left      = 0;
		var FirstLine = 0;

		switch (Index)
		{
			case 0 :
				Left      = 18 * g_dKoef_pt_to_mm;
				FirstLine = -18 * g_dKoef_pt_to_mm;
				break;
			case 1 :
				Left      = 39.6 * g_dKoef_pt_to_mm;
				FirstLine = -21.6 * g_dKoef_pt_to_mm;
				break;
			case 2 :
				Left      = 61.2 * g_dKoef_pt_to_mm;
				FirstLine = -25.2 * g_dKoef_pt_to_mm;
				break;
			case 3 :
				Left      = 86.4 * g_dKoef_pt_to_mm;
				FirstLine = -32.4 * g_dKoef_pt_to_mm;
				break;
			case 4 :
				Left      = 111.6 * g_dKoef_pt_to_mm;
				FirstLine = -39.6 * g_dKoef_pt_to_mm;
				break;
			case 5 :
				Left      = 136.8 * g_dKoef_pt_to_mm;
				FirstLine = -46.8 * g_dKoef_pt_to_mm;
				break;
			case 6 :
				Left      = 162 * g_dKoef_pt_to_mm;
				FirstLine = -54 * g_dKoef_pt_to_mm;
				break;
			case 7 :
				Left      = 187.2 * g_dKoef_pt_to_mm;
				FirstLine = -61.2 * g_dKoef_pt_to_mm;
				break;
			case 8 :
				Left      = 216 * g_dKoef_pt_to_mm;
				FirstLine = -72 * g_dKoef_pt_to_mm;
				break;
		}

		Lvl.Jc     = AscCommon.align_Left;
		Lvl.Format = numbering_numfmt_Decimal;

		Lvl.LvlText = [];
		for (var Index2 = 0; Index2 <= Index; Index2++)
		{
			Lvl.LvlText.push(new CNumberingLvlTextNum(Index2));
			Lvl.LvlText.push(new CNumberingLvlTextString("."));
		}

		Lvl.ParaPr               = new CParaPr();
		Lvl.ParaPr.Ind.Left      = Left;
		Lvl.ParaPr.Ind.FirstLine = FirstLine;

		var TextPr = new CTextPr();
		Lvl.TextPr = TextPr;

		var Lvl_new = this.Internal_CopyLvl(Lvl);
		History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, Index));
	}
};
CAbstractNum.prototype.Create_Default_Multilevel_3 = function()
{
	for (var Index = 0; Index < 9; Index++)
	{
		var Lvl_old = this.Internal_CopyLvl(this.Lvl[Index]);

		this.Lvl[Index] = {};
		var Lvl         = this.Lvl[Index];

		Lvl.Start   = 1;
		Lvl.Restart = -1;        // -1 - делаем нумерацию сначала всегда, 0 - никогда не начинаем нумерацию заново
		Lvl.Suff    = numbering_suff_Tab;

		var Left      = 18 * (Index + 1) * g_dKoef_pt_to_mm;
		var FirstLine = -18 * g_dKoef_pt_to_mm;
		Lvl.Format    = numbering_numfmt_Bullet;
		Lvl.Jc        = AscCommon.align_Left;

		Lvl.LvlText = [];
		switch (Index)
		{
			case 0:
				Lvl.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x0076)));
				break;
			case 1:
				Lvl.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00D8)));
				break;
			case 2:
				Lvl.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00A7)));
				break;
			case 3:
				Lvl.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00B7)));
				break;
			case 4:
				Lvl.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00A8)));
				break;
			case 5:
				Lvl.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00D8)));
				break;
			case 6:
				Lvl.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00A7)));
				break;
			case 7:
				Lvl.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00B7)));
				break;
			case 8:
				Lvl.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00A8)));
				break;
		}

		Lvl.ParaPr               = new CParaPr();
		Lvl.ParaPr.Ind.Left      = Left;
		Lvl.ParaPr.Ind.FirstLine = FirstLine;

		var TextPr = new CTextPr();
		if (3 === Index || 4 === Index || 7 === Index || 8 === Index)
			TextPr.RFonts.Set_All("Symbol", -1);
		else
			TextPr.RFonts.Set_All("Wingdings", -1);

		Lvl.TextPr = TextPr;

		var Lvl_new = this.Internal_CopyLvl(Lvl);
		History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, Index));
	}
};
CAbstractNum.prototype.Create_Default_Bullet = function()
{
	for (var Index = 0; Index < 9; Index++)
	{
		var Lvl_old = this.Internal_CopyLvl(this.Lvl[Index]);

		this.Lvl[Index] = {};
		var Lvl         = this.Lvl[Index];

		Lvl.Start   = 1;
		Lvl.Restart = -1;        // -1 - делаем нумерацию сначала всегда, 0 - никогда не начинаем нумерацию заново
		Lvl.Suff    = numbering_suff_Tab;

		var Left      = 36 * (Index + 1) * g_dKoef_pt_to_mm;
		var FirstLine = -18 * g_dKoef_pt_to_mm;

		Lvl.Jc     = AscCommon.align_Left;
		Lvl.Format = numbering_numfmt_Bullet;

		Lvl.LvlText = [];

		Lvl.ParaPr               = new CParaPr();
		Lvl.ParaPr.Ind.Left      = Left;
		Lvl.ParaPr.Ind.FirstLine = FirstLine;

		var TextPr = new CTextPr();
		if (0 == Index % 3)
		{
			TextPr.RFonts.Set_All("Symbol", -1);
			Lvl.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00B7)));
		}
		else if (1 == Index % 3)
		{
			TextPr.RFonts.Set_All("Courier New", -1);
			Lvl.LvlText.push(new CNumberingLvlTextString("o"));
		}
		else
		{
			TextPr.RFonts.Set_All("Wingdings", -1);
			Lvl.LvlText.push(new CNumberingLvlTextString(String.fromCharCode(0x00A7)));
		}

		Lvl.TextPr = TextPr;

		var Lvl_new = this.Internal_CopyLvl(Lvl);
		History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, Index));
	}
};
CAbstractNum.prototype.Set_Lvl_None = function(iLvl)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl     = this.Lvl[iLvl];
	var Lvl_old = this.Internal_CopyLvl(Lvl);

	Lvl.Format  = numbering_numfmt_None;
	Lvl.LvlText = [];
	Lvl.TextPr  = new CTextPr();
	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
CAbstractNum.prototype.Set_Lvl_Bullet = function(iLvl, LvlText, TextPr)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl = this.Lvl[iLvl];

	var Lvl_old = this.Internal_CopyLvl(Lvl);

	Lvl.Format  = numbering_numfmt_Bullet;
	Lvl.LvlText = [];
	Lvl.LvlText.push(new CNumberingLvlTextString(LvlText));
	Lvl.TextPr = TextPr;

	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
/**
 * 1) right
 * @param iLvl
 */
CAbstractNum.prototype.Set_Lvl_Numbered_1 = function(iLvl)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl = this.Lvl[iLvl];

	var Lvl_old = this.Internal_CopyLvl(Lvl);

	Lvl.Jc      = AscCommon.align_Right;
	Lvl.Format  = numbering_numfmt_Decimal;
	Lvl.LvlText = [];
	Lvl.LvlText.push(new CNumberingLvlTextNum(iLvl));
	Lvl.LvlText.push(new CNumberingLvlTextString(")"));
	Lvl.TextPr = new CTextPr();

	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
/**
 * 1. right
 * @param iLvl
 */
CAbstractNum.prototype.Set_Lvl_Numbered_2 = function(iLvl)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl = this.Lvl[iLvl];

	var Lvl_old = this.Internal_CopyLvl(Lvl);

	Lvl.Jc      = AscCommon.align_Right;
	Lvl.Format  = numbering_numfmt_Decimal;
	Lvl.LvlText = [];
	Lvl.LvlText.push(new CNumberingLvlTextNum(iLvl));
	Lvl.LvlText.push(new CNumberingLvlTextString("."));
	Lvl.TextPr = new CTextPr();

	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
/**
 * 1. left
 * @param iLvl
 */
CAbstractNum.prototype.Set_Lvl_Numbered_3 = function(iLvl)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl = this.Lvl[iLvl];

	var Lvl_old = this.Internal_CopyLvl(Lvl);

	Lvl.Jc      = AscCommon.align_Left;
	Lvl.Format  = numbering_numfmt_Decimal;
	Lvl.LvlText = [];
	Lvl.LvlText.push(new CNumberingLvlTextNum(iLvl));
	Lvl.LvlText.push(new CNumberingLvlTextString("."));
	Lvl.TextPr = new CTextPr();

	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
/**
 * 1) left
 * @param iLvl
 */
CAbstractNum.prototype.Set_Lvl_Numbered_4 = function(iLvl)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl = this.Lvl[iLvl];

	var Lvl_old = this.Internal_CopyLvl(Lvl);

	Lvl.Jc      = AscCommon.align_Left;
	Lvl.Format  = numbering_numfmt_Decimal;
	Lvl.LvlText = [];
	Lvl.LvlText.push(new CNumberingLvlTextNum(iLvl));
	Lvl.LvlText.push(new CNumberingLvlTextString(")"));
	Lvl.TextPr = new CTextPr();

	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
/**
 * I. right
 * @param iLvl
 */
CAbstractNum.prototype.Set_Lvl_Numbered_5 = function(iLvl)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl = this.Lvl[iLvl];

	var Lvl_old = this.Internal_CopyLvl(Lvl);

	Lvl.Jc      = AscCommon.align_Right;
	Lvl.Format  = numbering_numfmt_UpperRoman;
	Lvl.LvlText = [];
	Lvl.LvlText.push(new CNumberingLvlTextNum(iLvl));
	Lvl.LvlText.push(new CNumberingLvlTextString("."));
	Lvl.TextPr = new CTextPr();

	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
/**
 * A. left
 * @param iLvl
 */
CAbstractNum.prototype.Set_Lvl_Numbered_6 = function(iLvl)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl = this.Lvl[iLvl];

	var Lvl_old = this.Internal_CopyLvl(Lvl);

	Lvl.Jc      = AscCommon.align_Left;
	Lvl.Format  = numbering_numfmt_UpperLetter;
	Lvl.LvlText = [];
	Lvl.LvlText.push(new CNumberingLvlTextNum(iLvl));
	Lvl.LvlText.push(new CNumberingLvlTextString("."));
	Lvl.TextPr = new CTextPr();

	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
/**
 * a) left
 * @param iLvl
 */
CAbstractNum.prototype.Set_Lvl_Numbered_7 = function(iLvl)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl = this.Lvl[iLvl];

	var Lvl_old = this.Internal_CopyLvl(Lvl);

	Lvl.Jc      = AscCommon.align_Left;
	Lvl.Format  = numbering_numfmt_LowerLetter;
	Lvl.LvlText = [];
	Lvl.LvlText.push(new CNumberingLvlTextNum(iLvl));
	Lvl.LvlText.push(new CNumberingLvlTextString(")"));
	Lvl.TextPr = new CTextPr();

	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
/**
 * a. left
 * @param iLvl
 */
CAbstractNum.prototype.Set_Lvl_Numbered_8 = function(iLvl)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl = this.Lvl[iLvl];

	var Lvl_old = this.Internal_CopyLvl(Lvl);

	Lvl.Jc      = AscCommon.align_Left;
	Lvl.Format  = numbering_numfmt_LowerLetter;
	Lvl.LvlText = [];
	Lvl.LvlText.push(new CNumberingLvlTextNum(iLvl));
	Lvl.LvlText.push(new CNumberingLvlTextString("."));
	Lvl.TextPr = new CTextPr();

	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
/**
 * i. left
 * @param iLvl
 */
CAbstractNum.prototype.Set_Lvl_Numbered_9 = function(iLvl)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl = this.Lvl[iLvl];

	var Lvl_old = this.Internal_CopyLvl(Lvl);

	Lvl.Jc      = AscCommon.align_Right;
	Lvl.Format  = numbering_numfmt_LowerRoman;
	Lvl.LvlText = [];
	Lvl.LvlText.push(new CNumberingLvlTextNum(iLvl));
	Lvl.LvlText.push(new CNumberingLvlTextString("."));
	Lvl.TextPr = new CTextPr();

	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
CAbstractNum.prototype.Set_Lvl_ByFormat = function(iLvl, nType, sFormatText, nAlign)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl     = this.Lvl[iLvl];
	var Lvl_old = this.Internal_CopyLvl(Lvl);

	Lvl.Jc      = nAlign;
	Lvl.Format  = nType;
	Lvl.LvlText = [];

	var nLastPos = 0;
	var nPos     = 0;
	while (-1 !== (nPos = sFormatText.indexOf("%", nPos)) && nPos < sFormatText.length)
	{
		if (nPos < sFormatText.length - 1 && sFormatText.charCodeAt(nPos + 1) >= 49 && sFormatText.charCodeAt(nPos + 1) <= 49 + iLvl)
		{
			if (nPos > nLastPos)
			{
				var sSubString = sFormatText.substring(nLastPos, nPos);
				for (var nSubIndex = 0, nSubLen = sSubString.length; nSubIndex < nSubLen; ++nSubIndex)
					Lvl.LvlText.push(new CNumberingLvlTextString(sSubString.charAt(nSubIndex)));
			}

			Lvl.LvlText.push(new CNumberingLvlTextNum(sFormatText.charCodeAt(nPos + 1) - 49));
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
			Lvl.LvlText.push(new CNumberingLvlTextString(sSubString.charAt(nSubIndex)));
	}

	Lvl.TextPr = new CTextPr();

	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
CAbstractNum.prototype.Set_Lvl_Restart = function(iLvl, isRestart)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl     = this.Lvl[iLvl];
	var Lvl_old = this.Internal_CopyLvl(Lvl);
	Lvl.Restart = (isRestart ? -1 : 0);
	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
CAbstractNum.prototype.Set_Lvl_Start = function(iLvl, nStart)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl     = this.Lvl[iLvl];
	var Lvl_old = this.Internal_CopyLvl(Lvl);
	Lvl.Start   = nStart;
	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
CAbstractNum.prototype.Set_Lvl_Suff = function(iLvl, nSuff)
{
	if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9)
		return;

	var Lvl     = this.Lvl[iLvl];
	var Lvl_old = this.Internal_CopyLvl(Lvl);
	Lvl.Suff    = nSuff;
	var Lvl_new = this.Internal_CopyLvl(Lvl);
	History.Add(new CChangesAbstractNumLvlChange(this, Lvl_old, Lvl_new, iLvl));
};
/**
 *
 * @param X
 * @param Y
 * @param Context
 * @param Lvl - уровень, с которого мы берем текст и настройки для текста
 * @param NumInfo - информация о номере данного элемента в списке (массив из Lvl элементов)
 * @param NumTextPr - рассчитанные настройки для символов нумерации (уже с учетом настроек текущего уровня)
 * @param Theme
 */
CAbstractNum.prototype.Draw = function(X,Y, Context, Lvl, NumInfo, NumTextPr, Theme)
{
	var Text = this.Lvl[Lvl].LvlText;

	Context.SetTextPr(NumTextPr, Theme);
	Context.SetFontSlot(fontslot_ASCII);
	g_oTextMeasurer.SetTextPr(NumTextPr, Theme);
	g_oTextMeasurer.SetFontSlot(fontslot_ASCII);

	for (var Index = 0; Index < Text.length; Index++)
	{
		switch (Text[Index].Type)
		{
			case numbering_lvltext_Text:
			{
				var Hint = NumTextPr.RFonts.Hint;
				var bCS  = NumTextPr.CS;
				var bRTL = NumTextPr.RTL;
				var lcid = NumTextPr.Lang.EastAsia;

				var FontSlot = g_font_detector.Get_FontClass(Text[Index].Value.charCodeAt(0), Hint, lcid, bCS, bRTL);

				Context.SetFontSlot(FontSlot);
				g_oTextMeasurer.SetFontSlot(FontSlot);

				Context.FillText(X, Y, Text[Index].Value);
				X += g_oTextMeasurer.Measure(Text[Index].Value).Width;

				break;
			}
			case numbering_lvltext_Num:
			{
				Context.SetFontSlot(fontslot_ASCII);
				g_oTextMeasurer.SetFontSlot(fontslot_ASCII);

				var CurLvl = Text[Index].Value;
				switch (this.Lvl[CurLvl].Format)
				{
					case numbering_numfmt_Bullet:
					{
						break;
					}

					case numbering_numfmt_Decimal:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );
							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								Context.FillText(X, Y, Char);
								X += g_oTextMeasurer.Measure(Char).Width;
							}
						}
						break;
					}

					case numbering_numfmt_DecimalZero:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );

							if (1 === T.length)
							{
								Context.FillText(X, Y, '0');
								X += g_oTextMeasurer.Measure('0').Width;

								var Char = T.charAt(0);
								Context.FillText(X, Y, Char);
								X += g_oTextMeasurer.Measure(Char).Width;
							}
							else
							{
								for (var Index2 = 0; Index2 < T.length; Index2++)
								{
									var Char = T.charAt(Index2);
									Context.FillText(X, Y, Char);
									X += g_oTextMeasurer.Measure(Char).Width;
								}
							}
						}
						break;
					}

					case numbering_numfmt_LowerLetter:
					case numbering_numfmt_UpperLetter:
					{
						if (CurLvl < NumInfo.length)
						{
							// Формат: a,..,z,aa,..,zz,aaa,...,zzz,...
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] - 1;

							var Count = (Num - Num % 26) / 26;
							var Ost   = Num % 26;

							var T = "";

							var Letter;
							if (numbering_numfmt_LowerLetter === this.Lvl[CurLvl].Format)
								Letter = String.fromCharCode(Ost + 97);
							else
								Letter = String.fromCharCode(Ost + 65);

							for (var Index2 = 0; Index2 < Count + 1; Index2++)
								T += Letter;

							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								Context.FillText(X, Y, Char);
								X += g_oTextMeasurer.Measure(Char).Width;
							}
						}
						break;
					}

					case numbering_numfmt_LowerRoman:
					case numbering_numfmt_UpperRoman:
					{
						if (CurLvl < NumInfo.length)
						{
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl];

							// Переводим число Num в римскую систему исчисления
							var Rims;

							if (numbering_numfmt_LowerRoman === this.Lvl[CurLvl].Format)
								Rims = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
							else
								Rims = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

							var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];

							var T      = "";
							var Index2 = 0;
							while (Num > 0)
							{
								while (Vals[Index2] <= Num)
								{
									T += Rims[Index2];
									Num -= Vals[Index2];
								}

								Index2++;

								if (Index2 >= Rims.length)
									break;
							}

							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								Context.FillText(X, Y, Char);
								X += g_oTextMeasurer.Measure(T.charAt(Index2)).Width;
							}
						}
						break;
					}
				}

				break;
			}
		}
	}
};
CAbstractNum.prototype.Measure = function(Context, Lvl, NumInfo, NumTextPr, Theme)
{
	var X    = 0;
	var Text = this.Lvl[Lvl].LvlText;

	Context.SetTextPr(NumTextPr, Theme);
	Context.SetFontSlot(fontslot_ASCII);
	var Ascent = Context.GetAscender();

	for (var Index = 0; Index < Text.length; Index++)
	{
		switch (Text[Index].Type)
		{
			case numbering_lvltext_Text:
			{
				var Hint = NumTextPr.RFonts.Hint;
				var bCS  = NumTextPr.CS;
				var bRTL = NumTextPr.RTL;
				var lcid = NumTextPr.Lang.EastAsia;

				var FontSlot = g_font_detector.Get_FontClass(Text[Index].Value.charCodeAt(0), Hint, lcid, bCS, bRTL);

				Context.SetFontSlot(FontSlot);
				X += Context.Measure(Text[Index].Value).Width;

				break;
			}
			case numbering_lvltext_Num:
			{
				Context.SetFontSlot(fontslot_ASCII);
				var CurLvl = Text[Index].Value;
				switch (this.Lvl[CurLvl].Format)
				{
					case numbering_numfmt_Bullet:
					{
						break;
					}

					case numbering_numfmt_Decimal:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );
							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								X += Context.Measure(Char).Width;
							}
						}
						break;
					}

					case numbering_numfmt_DecimalZero:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );

							if (1 === T.length)
							{
								X += Context.Measure('0').Width;

								var Char = T.charAt(0);
								X += Context.Measure(Char).Width;
							}
							else
							{
								for (var Index2 = 0; Index2 < T.length; Index2++)
								{
									var Char = T.charAt(Index2);
									X += Context.Measure(Char).Width;
								}
							}
						}
						break;
					}

					case numbering_numfmt_LowerLetter:
					case numbering_numfmt_UpperLetter:
					{
						if (CurLvl < NumInfo.length)
						{
							// Формат: a,..,z,aa,..,zz,aaa,...,zzz,...
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] - 1;

							var Count = (Num - Num % 26) / 26;
							var Ost   = Num % 26;

							var T = "";

							var Letter;
							if (numbering_numfmt_LowerLetter === this.Lvl[CurLvl].Format)
								Letter = String.fromCharCode(Ost + 97);
							else
								Letter = String.fromCharCode(Ost + 65);

							for (var Index2 = 0; Index2 < Count + 1; Index2++)
								T += Letter;

							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								X += Context.Measure(Char).Width;
							}
						}
						break;
					}

					case numbering_numfmt_LowerRoman:
					case numbering_numfmt_UpperRoman:
					{
						if (CurLvl < NumInfo.length)
						{
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl];

							// Переводим число Num в римскую систему исчисления
							var Rims;

							if (numbering_numfmt_LowerRoman === this.Lvl[CurLvl].Format)
								Rims = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
							else
								Rims = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

							var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];

							var T      = "";
							var Index2 = 0;
							while (Num > 0)
							{
								while (Vals[Index2] <= Num)
								{
									T += Rims[Index2];
									Num -= Vals[Index2];
								}

								Index2++;

								if (Index2 >= Rims.length)
									break;
							}

							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								X += Context.Measure(T.charAt(Index2)).Width;
							}
						}
						break;
					}
				}

				break;
			}
		}
	}

	return {Width : X, Ascent : Ascent};
};
CAbstractNum.prototype.Document_CreateFontCharMap = function(FontCharMap, Lvl, NumInfo, NumTextPr)
{
	FontCharMap.StartFont(NumTextPr.FontFamily.Name, NumTextPr.Bold, NumTextPr.Italic, NumTextPr.FontSize);
	var Text = this.Lvl[Lvl].LvlText;

	for (var Index = 0; Index < Text.length; Index++)
	{
		switch (Text[Index].Type)
		{
			case numbering_lvltext_Text:
			{
				FontCharMap.AddChar(Text[Index].Value);
				break;
			}
			case numbering_lvltext_Num:
			{
				var CurLvl = Text[Index].Value;
				switch (this.Lvl[CurLvl].Format)
				{
					case numbering_numfmt_Bullet:
					{
						break;
					}

					case numbering_numfmt_Decimal:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );
							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								FontCharMap.AddChar(Char);
							}
						}
						break;
					}

					case numbering_numfmt_DecimalZero:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );

							if (1 === T.length)
							{
								FontCharMap.AddChar('0');

								var Char = T.charAt(0);
								FontCharMap.AddChar(Char);
							}
							else
							{
								for (var Index2 = 0; Index2 < T.length; Index2++)
								{
									var Char = T.charAt(Index2);
									FontCharMap.AddChar(Char);
								}
							}
						}
						break;
					}

					case numbering_numfmt_LowerLetter:
					case numbering_numfmt_UpperLetter:
					{
						if (CurLvl < NumInfo.length)
						{
							// Формат: a,..,z,aa,..,zz,aaa,...,zzz,...
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] - 1;

							var Count = (Num - Num % 26) / 26;
							var Ost   = Num % 26;

							var T = "";

							var Letter;
							if (numbering_numfmt_LowerLetter === this.Lvl[CurLvl].Format)
								Letter = String.fromCharCode(Ost + 97);
							else
								Letter = String.fromCharCode(Ost + 65);

							for (var Index2 = 0; Index2 < Count + 1; Index2++)
								T += Letter;

							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								FontCharMap.AddChar(Char);
							}
						}
						break;
					}

					case numbering_numfmt_LowerRoman:
					case numbering_numfmt_UpperRoman:
					{
						if (CurLvl < NumInfo.length)
						{
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl];

							// Переводим число Num в римскую систему исчисления
							var Rims;

							if (numbering_numfmt_LowerRoman === this.Lvl[CurLvl].Format)
								Rims = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
							else
								Rims = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

							var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];

							var T      = "";
							var Index2 = 0;
							while (Num > 0)
							{
								while (Vals[Index2] <= Num)
								{
									T += Rims[Index2];
									Num -= Vals[Index2];
								}

								Index2++;

								if (Index2 >= Rims.length)
									break;
							}

							for (var Index2 = 0; Index2 < T.length; Index2++)
							{
								var Char = T.charAt(Index2);
								FontCharMap.AddChar(Char);
							}
						}
						break;
					}
				}

				break;
			}
		}
	}
};
CAbstractNum.prototype.Document_Get_AllFontNames = function(AllFonts)
{
	var Count = this.Lvl.length;
	for (var Index = 0; Index < Count; Index++)
	{
		var Lvl = this.Lvl[Index];

		if (undefined !== Lvl.TextPr && Lvl.TextPr.Document_Get_AllFontNames)
			Lvl.TextPr.Document_Get_AllFontNames(AllFonts);
	}
};
CAbstractNum.prototype.CollectDocumentStatistics = function(Lvl, Stats)
{
	var Text = this.Lvl[Lvl].LvlText;

	var bWord = false;
	for (var Index = 0; Index < Text.length; Index++)
	{
		var bSymbol  = false;
		var bSpace   = false;
		var bNewWord = false;

		if (numbering_lvltext_Text === Text[Index].Type && ( sp_string === Text[Index].Value || nbsp_string === Text[Index].Value ))
		{
			bWord   = false;
			bSymbol = true;
			bSpace  = true;
		}
		else
		{
			if (false === bWord)
				bNewWord = true;

			bWord   = true;
			bSymbol = true;
			bSpace  = false;
		}

		if (true === bSymbol)
			Stats.Add_Symbol(bSpace);

		if (true === bNewWord)
			Stats.Add_Word();
	}

	if (numbering_suff_Tab === this.Lvl[Lvl].Suff || numbering_suff_Space === this.Lvl[Lvl].Suff)
		Stats.Add_Symbol(true);
};
/**
 * Применяем новые тектовые настройки к данной нумерации на заданном уровне
 */
CAbstractNum.prototype.Apply_TextPr = function(Lvl, TextPr)
{
	var CurTextPr = this.Lvl[Lvl].TextPr;

	var TextPr_old = CurTextPr.Copy();
	CurTextPr.Merge(TextPr);
	var TextPr_new = CurTextPr.Copy();

	History.Add(new CChangesAbstractNumTextPrChange(this, TextPr_old, TextPr_new, Lvl));
};
CAbstractNum.prototype.Set_TextPr = function(Lvl, TextPr)
{
	History.Add(new CChangesAbstractNumTextPrChange(this, this.Lvl[Lvl].TextPr, TextPr, Lvl));
	this.Lvl[Lvl].TextPr = TextPr;
};
CAbstractNum.prototype.Set_ParaPr = function(Lvl, ParaPr)
{
	History.Add(new CChangesAbstractNumParaPrChange(this, this.Lvl[Lvl].ParaPr, ParaPr, Lvl));
	this.Lvl[Lvl].ParaPr = ParaPr;
};
//----------------------------------------------------------------------------------------------------------------------
// Undo/Redo функции
//----------------------------------------------------------------------------------------------------------------------
CAbstractNum.prototype.Internal_CopyLvl = function(Lvl)
{
	var Lvl_new = {};

	Lvl_new.Start   = Lvl.Start;
	Lvl_new.Restart = Lvl.Restart;
	Lvl_new.Suff    = Lvl.Suff;

	Lvl_new.Jc     = Lvl.Jc;
	Lvl_new.Format = Lvl.Format;

	Lvl_new.PStyle = Lvl.PStyle;

	Lvl_new.LvlText = [];
	for (var Index = 0; Index < Lvl.LvlText.length; Index++)
	{
		var Item = Lvl.LvlText[Index];
		Lvl_new.LvlText.push(Item.Copy());
	}
	Lvl_new.TextPr = Lvl.TextPr.Copy();
	Lvl_new.ParaPr = Lvl.ParaPr.Copy();

	return Lvl_new;
};
CAbstractNum.prototype.Internal_SetLvl = function(iLvl, Lvl_new)
{
	var Lvl = this.Lvl[iLvl];

	Lvl.Jc      = Lvl_new.Jc;
	Lvl.Format  = Lvl_new.Format;
	Lvl.LvlText = Lvl_new.LvlText;
	Lvl.TextPr  = Lvl_new.TextPr;
	Lvl.ParaPr  = Lvl_new.ParaPr;
	Lvl.PStyle  = Lvl_new.PStyle;
};
CAbstractNum.prototype.Write_Lvl_ToBinary = function(Lvl, Writer)
{
	// Long               : Jc
	// Long               : Format
	// String             : PStyle
	// Variable           : TextPr
	// Variable           : ParaPr
	// Long               : количество элементов в LvlText
	// Array of variables : массив LvlText

	Writer.WriteLong(Lvl.Jc);
	Writer.WriteLong(Lvl.Format);

	Writer.WriteString2(Lvl.PStyle ? Lvl.PStyle : "");

	Lvl.TextPr.Write_ToBinary(Writer);
	Lvl.ParaPr.Write_ToBinary(Writer);

	var Count = Lvl.LvlText.length;
	Writer.WriteLong(Count);

	for (var Index = 0; Index < Count; Index++)
		Lvl.LvlText[Index].Write_ToBinary(Writer);
};
CAbstractNum.prototype.Read_Lvl_FromBinary = function(Lvl, Reader)
{
	// Long               : Jc
	// Long               : Format
	// String             : PStyle
	// Variable           : TextPr
	// Variable           : ParaPr
	// Long               : количество элементов в LvlText
	// Array of variables : массив LvlText

	Lvl.Jc     = Reader.GetLong();
	Lvl.Format = Reader.GetLong();

	Lvl.PStyle = Reader.GetString2();
	if ("" === Lvl.PStyle)
		Lvl.PStyle = undefined;

	Lvl.TextPr = new CTextPr();
	Lvl.ParaPr = new CParaPr();
	Lvl.TextPr.Read_FromBinary(Reader);
	Lvl.ParaPr.Read_FromBinary(Reader);

	var Count   = Reader.GetLong();
	Lvl.LvlText = [];
	for (var Index = 0; Index < Count; Index++)
	{
		var Element = LvlText_Read_FromBinary(Reader);
		Lvl.LvlText.push(Element);
	}
};
CAbstractNum.prototype.Refresh_RecalcData = function(Data)
{
	var oHistory = History;
	if (!oHistory)
		return;

	if (!oHistory.AddChangedNumberingToRecalculateData(this.Get_Id(), Data.Index, this))
		return;

	var NumPr   = new CNumPr();
	NumPr.NumId = this.Id;
	NumPr.Lvl   = Data.Index;

	var AllParagraphs = oHistory.GetAllParagraphsForRecalcData({Numbering : true, NumPr : NumPr});

	var Count = AllParagraphs.length;
	for (var Index = 0; Index < Count; Index++)
	{
		var Para = AllParagraphs[Index];
		Para.Refresh_RecalcData({Type : AscDFH.historyitem_Paragraph_Numbering});
	}
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//----------------------------------------------------------------------------------------------------------------------
CAbstractNum.prototype.Write_ToBinary2 = function(Writer)
{
	Writer.WriteLong(AscDFH.historyitem_type_AbstractNum);

	// String          : Id
	// Variable[9 Lvl] : 9 уровней

	Writer.WriteString2(this.Id);
	for (var Index = 0; Index < 9; Index++)
		this.Write_Lvl_ToBinary(this.Lvl[Index], Writer);
};
CAbstractNum.prototype.Read_FromBinary2 = function(Reader)
{
	// String          : Id
	// Variable[9 Lvl] : 9 уровней

	this.Id = Reader.GetString2();

	for (var Index = 0; Index < 9; Index++)
		this.Read_Lvl_FromBinary(this.Lvl[Index], Reader);

	// Добавим данный список в нумерацию
	var Numbering                  = editor.WordControl.m_oLogicDocument.Get_Numbering();
	Numbering.AbstractNum[this.Id] = this;
};
CAbstractNum.prototype.Process_EndLoad = function(Data)
{
	var iLvl = Data.iLvl;
	if (undefined !== iLvl)
	{
		// Пересчитываем стили у все параграфов с данной нумерацией
		this.Recalc_CompiledPr(iLvl);
	}
};
CAbstractNum.prototype.Recalc_CompiledPr = function(iLvl)
{
	// Ищем все параграфы, который используют данную нумерацию и проставляем у них, то что их стиль
	// нужно перекомпилировать.

	var NumPr   = new CNumPr();
	NumPr.NumId = this.Id;
	NumPr.Lvl   = iLvl;

	var LogicDocument = editor.WordControl.m_oLogicDocument;
	var AllParagraphs = LogicDocument.GetAllParagraphsByNumbering(NumPr);

	var Count = AllParagraphs.length;
	for (var Index = 0; Index < Count; Index++)
	{
		var Para = AllParagraphs[Index];
		Para.Recalc_CompiledPr();
	}
};
CAbstractNum.prototype.isEqual = function(abstractNum)
{
	var lvlUsuallyAdd = this.Lvl;
	var lvlNew        = abstractNum.Lvl;
	for (var lvl = 0; lvl < lvlUsuallyAdd.length; lvl++)
	{
		var LvlTextEqual = null;
		var ParaPrEqual  = null;
		var TextPrEqual  = null;
		if (lvlUsuallyAdd[lvl].Format == lvlNew[lvl].Format && lvlUsuallyAdd[lvl].Jc == lvlNew[lvl].Jc && lvlUsuallyAdd[lvl].PStyle == lvlNew[lvl].PStyle && lvlUsuallyAdd[lvl].Restart == lvlNew[lvl].Restart && lvlUsuallyAdd[lvl].Start == lvlNew[lvl].Start && lvlUsuallyAdd[lvl].Suff == lvlNew[lvl].Suff)
		{
			LvlTextEqual = this._isEqualLvlText(lvlUsuallyAdd[lvl].LvlText, lvlNew[lvl].LvlText);
			ParaPrEqual  = lvlUsuallyAdd[lvl].ParaPr.isEqual(lvlUsuallyAdd[lvl].ParaPr, lvlNew[lvl].ParaPr);
			TextPrEqual  = lvlUsuallyAdd[lvl].TextPr.isEqual(lvlUsuallyAdd[lvl].TextPr, lvlNew[lvl].TextPr);
		}
		if (!LvlTextEqual || !ParaPrEqual || !TextPrEqual)
			return false;
	}
	return true;
};
CAbstractNum.prototype._isEqualLvlText = function(LvlTextOld, LvlTextNew)
{
	if (LvlTextOld.length !== LvlTextNew.length)
		return false;

	for (var LvlText = 0; LvlText < LvlTextOld.length; LvlText++)
	{
		if (LvlTextOld[LvlText].Type != LvlTextNew[LvlText].Type || LvlTextOld[LvlText].Value != LvlTextNew[LvlText].Value)
			return false;
	}
	return true;
};
CAbstractNum.prototype.GetText = function(Lvl, NumInfo)
{
	var Text = this.Lvl[Lvl].LvlText;

	var sResult = "";
	for ( var Index = 0; Index < Text.length; Index++ )
	{
		switch( Text[Index].Type )
		{
			case numbering_lvltext_Text:
			{
				sResult += Text[Index].Value;
				break;
			}
			case numbering_lvltext_Num:
			{
				var CurLvl = Text[Index].Value;
				switch( this.Lvl[CurLvl].Format )
				{
					case numbering_numfmt_Bullet:
					{
						break;
					}
					case numbering_numfmt_Decimal:
					{
						if (CurLvl < NumInfo.length)
						{
							sResult += "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );
						}
						break;
					}
					case numbering_numfmt_DecimalZero:
					{
						if (CurLvl < NumInfo.length)
						{
							var T = "" + ( this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] );
							if (1 === T.length)
							{
								sResult += '0' + T.charAt(0);
							}
							else
							{
								for (var Index2 = 0; Index2 < T.length; Index2++)
								{
									sResult += T.charAt(Index2);
								}
							}
						}
						break;
					}
					case numbering_numfmt_LowerLetter:
					case numbering_numfmt_UpperLetter:
					{
						if (CurLvl < NumInfo.length)
						{
							// Формат: a,..,z,aa,..,zz,aaa,...,zzz,...
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] - 1;

							var Count = (Num - Num % 26) / 26;
							var Ost   = Num % 26;

							var Letter;
							if (numbering_numfmt_LowerLetter === this.Lvl[CurLvl].Format)
								Letter = String.fromCharCode(Ost + 97);
							else
								Letter = String.fromCharCode(Ost + 65);

							for (var Index2 = 0; Index2 < Count + 1; Index2++)
								sResult += Letter;
						}
						break;
					}
					case numbering_numfmt_LowerRoman:
					case numbering_numfmt_UpperRoman:
					{
						if (CurLvl < NumInfo.length)
						{
							var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl];

							// Переводим число Num в римскую систему исчисления
							var Rims;

							if (numbering_numfmt_LowerRoman === this.Lvl[CurLvl].Format)
								Rims = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
							else
								Rims = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

							var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];

							var Index2 = 0;
							while (Num > 0)
							{
								while (Vals[Index2] <= Num)
								{
									sResult += Rims[Index2];
									Num -= Vals[Index2];
								}

								Index2++;

								if (Index2 >= Rims.length)
									break;
							}
						}
						break;
					}
				}

				break;
			}
		}
	}

	return sResult;
};

//--------------------------------------------------------export--------------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CAbstractNum = CAbstractNum;