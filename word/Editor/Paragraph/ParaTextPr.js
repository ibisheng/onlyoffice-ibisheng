/*
 * (c) Copyright Ascensio System SIA 2010-2016
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
 * Date: 02.11.2016
 * Time: 16:36
 */

/**
 * Класс представляющий собой настройки текста (сейчас используется как настройка текста для конца параграфа)
 * @constructor
 * @extends {CRunElementBase}
 */
function ParaTextPr(Props)
{
	ParaTextPr.superclass.constructor.call(this);

	this.Id = AscCommon.g_oIdCounter.Get_NewId();

	this.Type      = para_TextPr;
	this.Value     = new CTextPr();
	this.Parent    = null;
	this.CalcValue = this.Value;

	this.Width        = 0;
	this.Height       = 0;
	this.WidthVisible = 0;

	if ("object" == typeof(Props))
	{
		this.Value.Set_FromObject(Props);
	}

	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	g_oTableId.Add(this, this.Id);
}
AscCommon.extendClass(ParaTextPr, CRunElementBase);

ParaTextPr.prototype.Type = para_TextPr;
ParaTextPr.prototype.Get_Type = function()
{
	return this.Type;
};
ParaTextPr.prototype.Copy = function()
{
	var ParaTextPr_new = new ParaTextPr();
	ParaTextPr_new.Set_Value(this.Value);
	return ParaTextPr_new;
};
ParaTextPr.prototype.Is_RealContent = function()
{
	return true;
};
ParaTextPr.prototype.Can_AddNumbering = function()
{
	return false;
};
ParaTextPr.prototype.Set_Id = function(newId)
{
	g_oTableId.Reset_Id(this, newId, this.Id);
	this.Id = newId;
};
ParaTextPr.prototype.Get_Id = function()
{
	return this.Id;
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для изменения свойств
//----------------------------------------------------------------------------------------------------------------------
ParaTextPr.prototype.Apply_TextPr = function(TextPr)
{
	if (undefined != TextPr.Bold)
		this.Set_Bold(TextPr.Bold);

	if (undefined != TextPr.Italic)
		this.Set_Italic(TextPr.Italic);

	if (undefined != TextPr.Strikeout)
		this.Set_Strikeout(TextPr.Strikeout);

	if (undefined != TextPr.Underline)
		this.Set_Underline(TextPr.Underline);

	if (undefined != TextPr.FontSize)
		this.Set_FontSize(TextPr.FontSize);

	if (undefined != TextPr.FontSizeCS)
		this.Set_FontSizeCS(TextPr.FontSizeCS);

	if (undefined != TextPr.Color)
	{
		this.Set_Color(TextPr.Color);
		if (undefined != this.Value.Unifill)
		{
			this.Set_Unifill(undefined);
		}
		if (undefined != this.Value.TextFill)
		{
			this.Set_TextFill(undefined);
		}
	}

	if (undefined != TextPr.VertAlign)
		this.Set_VertAlign(TextPr.VertAlign);

	if (undefined != TextPr.HighLight)
		this.Set_HighLight(TextPr.HighLight);

	if (undefined != TextPr.RStyle)
		this.Set_RStyle(TextPr.RStyle);

	if (undefined != TextPr.Spacing)
		this.Set_Spacing(TextPr.Spacing);

	if (undefined != TextPr.DStrikeout)
		this.Set_DStrikeout(TextPr.DStrikeout);

	if (undefined != TextPr.Caps)
		this.Set_Caps(TextPr.Caps);

	if (undefined != TextPr.SmallCaps)
		this.Set_SmallCaps(TextPr.SmallCaps);

	if (undefined != TextPr.Position)
		this.Set_Position(TextPr.Position);

	if (undefined != TextPr.RFonts)
		this.Set_RFonts2(TextPr.RFonts);

	if (undefined != TextPr.Lang)
		this.Set_Lang(TextPr.Lang);

	if (undefined != TextPr.Unifill)
	{
		this.Set_Unifill(TextPr.Unifill.createDuplicate());
		if (undefined != this.Value.Color)
		{
			this.Set_Color(undefined);
		}
		if (undefined != this.Value.TextFill)
		{
			this.Set_TextFill(undefined);
		}
	}
	if (undefined != TextPr.TextOutline)
	{
		this.Set_TextOutline(TextPr.TextOutline);
	}
	if (undefined != TextPr.TextFill)
	{
		this.Set_TextFill(TextPr.TextFill);
		if (undefined != this.Value.Color)
		{
			this.Set_Color(undefined);
		}
		if (undefined != this.Value.Unifill)
		{
			this.Set_Unifill(undefined);
		}
	}
};
ParaTextPr.prototype.Clear_Style = function()
{
	// Пока удаляем все кроме настроек языка
	if (undefined != this.Value.Bold)
		this.Set_Bold(undefined);

	if (undefined != this.Value.Italic)
		this.Set_Italic(undefined);

	if (undefined != this.Value.Strikeout)
		this.Set_Strikeout(undefined);

	if (undefined != this.Value.Underline)
		this.Set_Underline(undefined);

	if (undefined != this.Value.FontSize)
		this.Set_FontSize(undefined);

	if (undefined != this.Value.Color)
		this.Set_Color(undefined);

	if (undefined != this.Value.Unifill)
		this.Set_Unifill(undefined);

	if (undefined != this.Value.VertAlign)
		this.Set_VertAlign(undefined);

	if (undefined != this.Value.HighLight)
		this.Set_HighLight(undefined);

	if (undefined != this.Value.RStyle)
		this.Set_RStyle(undefined);

	if (undefined != this.Value.Spacing)
		this.Set_Spacing(undefined);

	if (undefined != this.Value.DStrikeout)
		this.Set_DStrikeout(undefined);

	if (undefined != this.Value.Caps)
		this.Set_Caps(undefined);

	if (undefined != this.Value.SmallCaps)
		this.Set_SmallCaps(undefined);

	if (undefined != this.Value.Position)
		this.Set_Position(undefined);

	if (undefined != this.Value.RFonts.Ascii)
		this.Set_RFonts_Ascii(undefined);

	if (undefined != this.Value.RFonts.HAnsi)
		this.Set_RFonts_HAnsi(undefined);

	if (undefined != this.Value.RFonts.CS)
		this.Set_RFonts_CS(undefined);

	if (undefined != this.Value.RFonts.EastAsia)
		this.Set_RFonts_EastAsia(undefined);

	if (undefined != this.Value.RFonts.Hint)
		this.Set_RFonts_Hint(undefined);

	if (undefined != this.Value.TextFill)
		this.Set_TextFill(undefined);

	if (undefined != this.Value.TextOutline)
		this.Set_TextOutline(undefined);
};
ParaTextPr.prototype.Set_Bold = function(Value)
{
	if (this.Value.Bold === Value)
		return;

	History.Add(new CChangesParaTextPrBold(this, this.Value.Bold, Value));
	this.Value.Bold = Value;
};
ParaTextPr.prototype.Set_Italic = function(Value)
{
	if (this.Value.Italic === Value)
		return;

	History.Add(new CChangesParaTextPrItalic(this, this.Value.Italic, Value));
	this.Value.Italic = Value;
};
ParaTextPr.prototype.Set_Strikeout = function(Value)
{
	if (this.Value.Strikeout === Value)
		return;

	History.Add(new CChangesParaTextPrStrikeout(this, this.Value.Strikeout, Value));
	this.Value.Strikeout = Value;
};
ParaTextPr.prototype.Set_Underline = function(Value)
{
	if (this.Value.Underline === Value)
		return;

	History.Add(new CChangesParaTextPrUnderline(this, this.Value.Underline, Value));
	this.Value.Underline = Value;
};
ParaTextPr.prototype.Set_FontSize = function(Value)
{
	if (this.Value.FontSize === Value)
		return;

	History.Add(new CChangesParaTextPrFontSize(this, this.Value.FontSize, Value));
	this.Value.FontSize = Value;
};
ParaTextPr.prototype.Set_Color = function(Value)
{
	History.Add(new CChangesParaTextPrColor(this, this.Value.Color, Value));
	this.Value.Color = Value;
};
ParaTextPr.prototype.Set_VertAlign = function(Value)
{
	if (this.Value.VertAlign === Value)
		return;

	History.Add(new CChangesParaTextPrVertAlign(this, this.Value.VertAlign, Value));
	this.Value.VertAlign = Value;
};
ParaTextPr.prototype.Set_HighLight = function(Value)
{
	History.Add(new CChangesParaTextPrHighLight(this, this.Value.HighLight, Value));
	this.Value.HighLight = Value;
};
ParaTextPr.prototype.Set_RStyle = function(Value)
{
	if (this.Value.RStyle === Value)
		return;

	History.Add(new CChangesParaTextPrRStyle(this, this.Value.RStyle, Value));
	this.Value.RStyle = Value;
};
ParaTextPr.prototype.Set_Spacing = function(Value)
{
	if (this.Value.Spacing === Value)
		return;

	History.Add(new CChangesParaTextPrSpacing(this, this.Value.Spacing, Value));
	this.Value.Spacing = Value;
};
ParaTextPr.prototype.Set_DStrikeout = function(Value)
{
	if (this.Value.DStrikeout === Value)
		return;

	History.Add(new CChangesParaTextPrDStrikeout(this, this.Value.DStrikeout, Value));
	this.Value.DStrikeout = Value;
};
ParaTextPr.prototype.Set_Caps = function(Value)
{
	if (this.Value.Caps === Value)
		return;

	History.Add(new CChangesParaTextPrCaps(this, this.Value.Caps, Value));
	this.Value.Caps = Value;
};
ParaTextPr.prototype.Set_SmallCaps = function(Value)
{
	if (this.Value.SmallCaps === Value)
		return;

	History.Add(new CChangesParaTextPrSmallCaps(this, this.Value.SmallCaps, Value));
	this.Value.SmallCaps = Value;
};
ParaTextPr.prototype.Set_Position = function(Value)
{
	if (this.Value.Position === Value)
		return;

	History.Add(new CChangesParaTextPrPosition(this, this.Value.Position, Value));
	this.Value.Position = Value;
};
ParaTextPr.prototype.Set_Value = function(Value)
{
	if (!Value || !(Value instanceof CTextPr) || true === this.Value.Is_Equal(Value))
		return;

	History.Add(new CChangesParaTextPrValue(this, this.Value, Value));
	this.Value = Value;
};
ParaTextPr.prototype.Set_RFonts = function(Value)
{
	var _Value = Value ? Value : new CRFonts();
	History.Add(new CChangesParaTextPrRFonts(this, this.Value.RFonts, _Value));
	this.Value.RFonts = _Value;
};
ParaTextPr.prototype.Set_RFonts2 = function(RFonts)
{
	if (undefined != RFonts)
	{
		if (undefined != RFonts.Ascii)
			this.Set_RFonts_Ascii(RFonts.Ascii);

		if (undefined != RFonts.HAnsi)
			this.Set_RFonts_HAnsi(RFonts.HAnsi);

		if (undefined != RFonts.CS)
			this.Set_RFonts_CS(RFonts.CS);

		if (undefined != RFonts.EastAsia)
			this.Set_RFonts_EastAsia(RFonts.EastAsia);

		if (undefined != RFonts.Hint)
			this.Set_RFonts_Hint(RFonts.Hint);
	}
};
ParaTextPr.prototype.Set_RFonts_Ascii = function(Value)
{
	History.Add(new CChangesParaTextPrRFontsAscii(this, this.Value.RFonts.Ascii, Value));
	this.Value.RFonts.Ascii = Value;
};
ParaTextPr.prototype.Set_RFonts_HAnsi = function(Value)
{
	History.Add(new CChangesParaTextPrRFontsHAnsi(this, this.Value.RFonts.HAnsi, Value));
	this.Value.RFonts.HAnsi = Value;
};
ParaTextPr.prototype.Set_RFonts_CS = function(Value)
{
	History.Add(new CChangesParaTextPrRFontsCS(this, this.Value.RFonts.CS, Value));
	this.Value.RFonts.CS = Value;
};
ParaTextPr.prototype.Set_RFonts_EastAsia = function(Value)
{
	History.Add(new CChangesParaTextPrRFontsEastAsia(this, this.Value.RFonts.EastAsia, Value));
	this.Value.RFonts.EastAsia = Value;
};
ParaTextPr.prototype.Set_RFonts_Hint = function(Value)
{
	History.Add(new CChangesParaTextPrRFontsHint(this, this.Value.RFonts.Hint, Value));
	this.Value.RFonts.Hint = Value;
};
ParaTextPr.prototype.Set_Lang = function(Value)
{
	var _Value = new CLang();
	if (Value)
		_Value.Set_FromObject(Value);

	History.Add(new CChangesParaTextPrLang(this, this.Value.Lang, Value));
	this.Value.Lang = _Value;
};
ParaTextPr.prototype.Set_Lang_Bidi = function(Value)
{
	History.Add(new CChangesParaTextPrLangBidi(this, this.Value.Lang.Bidi, Value));
	this.Value.Lang.Bidi = Value;
};
ParaTextPr.prototype.Set_Lang_EastAsia = function(Value)
{
	History.Add(new CChangesParaTextPrLangEastAsia(this, this.Value.Lang.EastAsia, Value));
	this.Value.Lang.EastAsia = Value;
};
ParaTextPr.prototype.Set_Lang_Val = function(Value)
{
	History.Add(new CChangesParaTextPrLangVal(this, this.Value.Lang.Val, Value));
	this.Value.Lang.Val = Value;
};
ParaTextPr.prototype.Set_Unifill = function(Value)
{
	History.Add(new CChangesParaTextPrUnifill(this, this.Value.Unifill, Value));
	this.Value.Unifill = Value;
};
ParaTextPr.prototype.Set_FontSizeCS = function(Value)
{
	if (this.Value.FontSizeCS === Value)
		return;

	History.Add(new CChangesParaTextPrFontSizeCS(this, this.Value.FontSizeCS, Value));
	this.Value.FontSizeCS = Value;
};
ParaTextPr.prototype.Set_TextOutline = function(Value)
{
	History.Add(new CChangesParaTextPrTextOutline(this, this.Value.TextOutline, Value));
	this.Value.TextOutline = Value;
};
ParaTextPr.prototype.Set_TextFill = function(Value)
{
	History.Add(new CChangesParaTextPrTextFill(this, this.Value.TextFill, Value));
	this.Value.TextFill = Value;
};
//----------------------------------------------------------------------------------------------------------------------
// Undo/Redo функции
//----------------------------------------------------------------------------------------------------------------------
ParaTextPr.prototype.Get_ParentObject_or_DocumentPos = function()
{
	if (null != this.Parent)
		return this.Parent.Get_ParentObject_or_DocumentPos();
};
ParaTextPr.prototype.Refresh_RecalcData = function(Data)
{
	if (undefined !== this.Parent && null !== this.Parent)
		this.Parent.Refresh_RecalcData2();
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//----------------------------------------------------------------------------------------------------------------------
ParaTextPr.prototype.Write_ToBinary = function(Writer)
{
	// Long   : Type
	// String : Id

	Writer.WriteLong(this.Type);
	Writer.WriteString2(this.Id);
};
ParaTextPr.prototype.Write_ToBinary2 = function(Writer)
{
	Writer.WriteLong(AscDFH.historyitem_type_TextPr);

	// Long   : Type
	// String : Id
	// Long   : Value

	Writer.WriteLong(this.Type);
	Writer.WriteString2(this.Id);
	this.Value.Write_ToBinary(Writer);
};
ParaTextPr.prototype.Read_FromBinary2 = function(Reader)
{
	this.Type = Reader.GetLong();
	this.Id   = Reader.GetString2();

	this.Value.Clear();
	this.Value.Read_FromBinary(Reader);
};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].ParaTextPr = ParaTextPr;
