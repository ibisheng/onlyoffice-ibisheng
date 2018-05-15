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
 * Time: 15:52
 */

// Import
var g_oTextMeasurer = AscCommon.g_oTextMeasurer;
var History         = AscCommon.History;

var numbering_presentationnumfrmt_None          =     0;
var numbering_presentationnumfrmt_Char          =     1;
var numbering_presentationnumfrmt_ArabicPeriod  =   100;  // 1., 2., 3., ...
var numbering_presentationnumfrmt_ArabicParenR  =   101;  // 1), 2), 3), ...
var numbering_presentationnumfrmt_RomanUcPeriod =   102;  // I., II., III., ...
var numbering_presentationnumfrmt_RomanLcPeriod =   103;  // i., ii., iii., ...
var numbering_presentationnumfrmt_AlphaLcParenR =   104;  // a), b), c), ...
var numbering_presentationnumfrmt_AlphaLcPeriod =   105;  // a., b., c.,
var numbering_presentationnumfrmt_AlphaUcParenR =   106;  // A), B), C), ...
var numbering_presentationnumfrmt_AlphaUcPeriod =   107;  // A., B., C., ...


var g_NumberingArr = [];
g_NumberingArr[0] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[1] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[2] = numbering_presentationnumfrmt_AlphaLcPeriod;
g_NumberingArr[3] = numbering_presentationnumfrmt_AlphaUcParenR;
g_NumberingArr[4] = numbering_presentationnumfrmt_AlphaUcParenR;
g_NumberingArr[5] = numbering_presentationnumfrmt_AlphaUcPeriod;
g_NumberingArr[6] = numbering_presentationnumfrmt_ArabicPeriod;
g_NumberingArr[7] = numbering_presentationnumfrmt_ArabicPeriod;
g_NumberingArr[8] = numbering_presentationnumfrmt_ArabicPeriod;
g_NumberingArr[9] = numbering_presentationnumfrmt_ArabicPeriod;
g_NumberingArr[10] = numbering_presentationnumfrmt_ArabicParenR;
g_NumberingArr[11] = numbering_presentationnumfrmt_ArabicParenR;
g_NumberingArr[12] = numbering_presentationnumfrmt_ArabicPeriod;
g_NumberingArr[13] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[14] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[15] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[16] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[17] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[18] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[19] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[20] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[21] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[22] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[23] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[24] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[25] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[26] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[27] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[28] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[29] = numbering_presentationnumfrmt_RomanLcPeriod;
g_NumberingArr[30] = numbering_presentationnumfrmt_RomanLcPeriod;
g_NumberingArr[31] = numbering_presentationnumfrmt_RomanLcPeriod;
g_NumberingArr[32] = numbering_presentationnumfrmt_RomanUcPeriod;
g_NumberingArr[33] = numbering_presentationnumfrmt_RomanUcPeriod;
g_NumberingArr[34] = numbering_presentationnumfrmt_RomanUcPeriod;
g_NumberingArr[35] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[36] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[37] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[38] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[39] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[40] = numbering_presentationnumfrmt_AlphaLcPeriod;

// Класс для работы с нумерацией в презентациях
function CPresentationBullet()
{
	this.m_nType    = numbering_presentationnumfrmt_None;  // Тип
	this.m_nStartAt = null;                                // Стартовое значение для нумерованных списков
	this.m_sChar    = null;                                // Значение для символьных списков

	this.m_oColor   = { r : 0, g : 0, b : 0, a: 255 };     // Цвет
	this.m_bColorTx = true;                                // Использовать ли цвет первого рана в параграфе
	this.Unifill    = null;

	this.m_sFont    = "Arial";                             // Шрифт
	this.m_bFontTx  = true;                                // Использовать ли шрифт первого рана в параграфе

	this.m_dSize    = 1;                                   // Размер шрифта, в пунктах или в процентах (зависит от флага m_bSizePct)
	this.m_bSizeTx  = false;                               // Использовать ли размер шрифта первого рана в параграфе
	this.m_bSizePct = true;                                // Задан ли размер шрифта в процентах

	this.m_oTextPr = null;
	this.m_nNum    = null;
	this.m_sString = null;
}

CPresentationBullet.prototype.Get_Type = function()
{
	return this.m_nType;
};
CPresentationBullet.prototype.Get_StartAt = function()
{
	return this.m_nStartAt;
};
CPresentationBullet.prototype.Measure = function(Context, FirstTextPr, _Num, Theme, ColorMap)
{
	var dFontSize = FirstTextPr.FontSize;
	if ( false === this.m_bSizeTx )
	{
		if ( true === this.m_bSizePct )
			dFontSize *= this.m_dSize;
		else
			dFontSize = this.m_dSize;
	}

	var RFonts;
	if(!this.m_bFontTx)
	{
		RFonts = {
			Ascii: {
				Name: this.m_sFont,
				Index: -1
			},
			EastAsia: {
				Name: this.m_sFont,
				Index: -1
			},
			CS: {
				Name: this.m_sFont,
				Index: -1
			},
			HAnsi: {
				Name: this.m_sFont,
				Index: -1
			}
		};
	}
	else
	{
		RFonts = FirstTextPr.RFonts;
	}


	var FirstTextPr_ = FirstTextPr.Copy();
	if(FirstTextPr_.Underline)
	{
		FirstTextPr_.Underline = false;
	}

	if ( true === this.m_bColorTx || !this.Unifill)
	{
		if(FirstTextPr.Unifill)
		{
			this.Unifill = FirstTextPr_.Unifill;
		}
		else
		{
			this.Unifill = AscFormat.CreteSolidFillRGB(FirstTextPr.Color.r, FirstTextPr.Color.g, FirstTextPr.Color.b);
		}
	}

	var TextPr_ = new CTextPr();
	TextPr_.Set_FromObject({
		RFonts: RFonts,
		Unifill: this.Unifill,
		FontSize : dFontSize,
		Bold     : ( this.m_nType >= numbering_presentationnumfrmt_ArabicPeriod ? FirstTextPr.Bold   : false ),
		Italic   : ( this.m_nType >= numbering_presentationnumfrmt_ArabicPeriod ? FirstTextPr.Italic : false )
	});
	FirstTextPr_.Merge(TextPr_);
	this.m_oTextPr = FirstTextPr_;

	var Num = _Num + this.m_nStartAt - 1;
	this.m_nNum = Num;

	var X = 0;




	var OldTextPr = Context.GetTextPr();


	var sT = "";

	switch ( this.m_nType )
	{
		case numbering_presentationnumfrmt_Char:
		{
			if ( null != this.m_sChar )
				sT = this.m_sChar;

			break;
		}

		case numbering_presentationnumfrmt_AlphaLcParenR:
		{
			sT = Numbering_Number_To_Alpha( Num, true ) + ")";
			break;
		}

		case numbering_presentationnumfrmt_AlphaLcPeriod:
		{
			sT = Numbering_Number_To_Alpha( Num, true ) + ".";
			break;
		}

		case numbering_presentationnumfrmt_AlphaUcParenR:
		{
			sT = Numbering_Number_To_Alpha( Num, false ) + ")";
			break;
		}

		case numbering_presentationnumfrmt_AlphaUcPeriod:
		{
			sT = Numbering_Number_To_Alpha( Num, false ) + ".";
			break;
		}

		case numbering_presentationnumfrmt_ArabicParenR:
		{
			sT += Numbering_Number_To_String(Num) + ")";
			break;
		}

		case numbering_presentationnumfrmt_ArabicPeriod:
		{
			sT += Numbering_Number_To_String(Num) + ".";
			break;
		}

		case numbering_presentationnumfrmt_RomanLcPeriod:
		{
			sT += Numbering_Number_To_Roman(Num, true) + ".";
			break;
		}

		case numbering_presentationnumfrmt_RomanUcPeriod:
		{
			sT += Numbering_Number_To_Roman(Num, false) + ".";
			break;
		}
	}

	this.m_sString = sT;

	var Hint =  this.m_oTextPr.RFonts.Hint;
	var bCS  =  this.m_oTextPr.CS;
	var bRTL =  this.m_oTextPr.RTL;
	var lcid =  this.m_oTextPr.Lang.EastAsia;

	var FontSlot = g_font_detector.Get_FontClass( sT.charCodeAt(0), Hint, lcid, bCS, bRTL );
	Context.SetTextPr( this.m_oTextPr, Theme );
	Context.SetFontSlot( FontSlot );
	for ( var Index2 = 0; Index2 < sT.length; Index2++ )
	{
		var Char = sT.charAt(Index2);
		X += Context.Measure( Char ).Width;
	}

	if(OldTextPr)
	{
		Context.SetTextPr( OldTextPr, Theme );
	}
	return { Width : X };
};
CPresentationBullet.prototype.Copy = function()
{
	var Bullet = new CPresentationBullet();

	Bullet.m_nType    = this.m_nType;
	Bullet.m_nStartAt = this.m_nStartAt;
	Bullet.m_sChar    = this.m_sChar;

	Bullet.m_oColor.r = this.m_oColor.r;
	Bullet.m_oColor.g = this.m_oColor.g;
	Bullet.m_oColor.b = this.m_oColor.b;
	Bullet.m_bColorTx = this.m_bColorTx;

	Bullet.m_sFont    = this.m_sFont;
	Bullet.m_bFontTx  = this.m_bFontTx;

	Bullet.m_dSize    = this.m_dSize;
	Bullet.m_bSizeTx  = this.m_bSizeTx;
	Bullet.m_bSizePct = this.m_bSizePct;

	return Bullet;
};
CPresentationBullet.prototype.Draw = function(X, Y, Context, FirstTextPr, PDSE)
{
	if ( null === this.m_oTextPr || null === this.m_nNum || null == this.m_sString || this.m_sString.length == 0)
		return;



	var OldTextPr  = Context.GetTextPr();
	var OldTextPr2 = g_oTextMeasurer.GetTextPr();

	var Hint =  this.m_oTextPr.RFonts.Hint;
	var bCS  =  this.m_oTextPr.CS;
	var bRTL =  this.m_oTextPr.RTL;
	var lcid =  this.m_oTextPr.Lang.EastAsia;

	var sT = this.m_sString;
	var FontSlot = g_font_detector.Get_FontClass( sT.charCodeAt(0), Hint, lcid, bCS, bRTL );

	if(this.m_oTextPr.Unifill){
		this.m_oTextPr.Unifill.check(PDSE.Theme, PDSE.ColorMap);
	}
	Context.SetTextPr( this.m_oTextPr, PDSE.Theme );
	Context.SetFontSlot( FontSlot );
	if(!Context.Start_Command){
		if(this.m_oTextPr.Unifill){
			var RGBA = this.m_oTextPr.Unifill.getRGBAColor();
			this.m_oColor.r = RGBA.R;
			this.m_oColor.g = RGBA.G;
			this.m_oColor.b = RGBA.B;
		}
		Context.p_color( this.m_oColor.r, this.m_oColor.g, this.m_oColor.b, 255 );
		Context.b_color1( this.m_oColor.r, this.m_oColor.g, this.m_oColor.b, 255 );
	}
	g_oTextMeasurer.SetTextPr( this.m_oTextPr, PDSE.Theme  );
	g_oTextMeasurer.SetFontSlot( FontSlot );


	for ( var Index2 = 0; Index2 < sT.length; Index2++ )
	{
		var Char = sT.charAt(Index2);
		Context.FillText( X, Y, Char );
		X += g_oTextMeasurer.Measure( Char ).Width;
	}

	if(OldTextPr)
	{
		Context.SetTextPr( OldTextPr, PDSE.Theme );
	}
	if(OldTextPr2)
	{
		g_oTextMeasurer.SetTextPr( OldTextPr2, PDSE.Theme  );
	}
};

//--------------------------------------------------------export--------------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].g_NumberingArr = g_NumberingArr;
