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
 * Time: 16:42
 */

AscDFH.changesFactory[AscDFH.historyitem_TextPr_Bold]            = CChangesParaTextPrBold;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Italic]          = CChangesParaTextPrItalic;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Strikeout]       = CChangesParaTextPrStrikeout;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Underline]       = CChangesParaTextPrUnderline;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_FontSize]        = CChangesParaTextPrFontSize;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Color]           = CChangesParaTextPrColor;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_VertAlign]       = CChangesParaTextPrVertAlign;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_HighLight]       = CChangesParaTextPrHighLight;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_RStyle]          = CChangesParaTextPrRStyle;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Spacing]         = CChangesParaTextPrSpacing;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_DStrikeout]      = CChangesParaTextPrDStrikeout;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Caps]            = CChangesParaTextPrCaps;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_SmallCaps]       = CChangesParaTextPrSmallCaps;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Position]        = CChangesParaTextPrPosition;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Value]           = CChangesParaTextPrValue;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_RFonts]          = CChangesParaTextPrRFonts;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_RFonts_Ascii]    = CChangesParaTextPrRFontsAscii;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_RFonts_HAnsi]    = CChangesParaTextPrRFontsHAnsi;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_RFonts_CS]       = CChangesParaTextPrRFontsCS;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_RFonts_EastAsia] = CChangesParaTextPrRFontsEastAsia;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_RFonts_Hint]     = CChangesParaTextPrRFontsHint;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Lang]            = CChangesParaTextPrLang;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Lang_Bidi]       = CChangesParaTextPrLangBidi;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Lang_EastAsia]   = CChangesParaTextPrLangEastAsia;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Lang_Val]        = CChangesParaTextPrLangVal;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Unifill]         = CChangesParaTextPrUnifill;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_FontSizeCS]      = CChangesParaTextPrFontSizeCS;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Outline]         = CChangesParaTextPrTextOutline;
AscDFH.changesFactory[AscDFH.historyitem_TextPr_Fill]            = CChangesParaTextPrTextFill;

//----------------------------------------------------------------------------------------------------------------------
// Карта зависимости изменений
//----------------------------------------------------------------------------------------------------------------------
AscDFH.paratextprChangesRelationMap                                            = {};
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Bold]            = [
	AscDFH.historyitem_TextPr_Bold,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Italic]          = [
	AscDFH.historyitem_TextPr_Italic,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Strikeout]       = [
	AscDFH.historyitem_TextPr_Strikeout,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Underline]       = [
	AscDFH.historyitem_TextPr_Underline,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_FontSize]        = [
	AscDFH.historyitem_TextPr_FontSize,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Color]           = [
	AscDFH.historyitem_TextPr_Color,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_VertAlign]       = [
	AscDFH.historyitem_TextPr_VertAlign,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_HighLight]       = [
	AscDFH.historyitem_TextPr_HighLight,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_RStyle]          = [
	AscDFH.historyitem_TextPr_RStyle,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Spacing]         = [
	AscDFH.historyitem_TextPr_Spacing,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_DStrikeout]      = [
	AscDFH.historyitem_TextPr_DStrikeout,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Caps]            = [
	AscDFH.historyitem_TextPr_Caps,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_SmallCaps]       = [
	AscDFH.historyitem_TextPr_SmallCaps,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Position]        = [
	AscDFH.historyitem_TextPr_Position,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Value]           = [
	AscDFH.historyitem_TextPr_Bold,
	AscDFH.historyitem_TextPr_Italic,
	AscDFH.historyitem_TextPr_Strikeout,
	AscDFH.historyitem_TextPr_Underline,
	AscDFH.historyitem_TextPr_FontSize,
	AscDFH.historyitem_TextPr_Color,
	AscDFH.historyitem_TextPr_VertAlign,
	AscDFH.historyitem_TextPr_HighLight,
	AscDFH.historyitem_TextPr_RStyle,
	AscDFH.historyitem_TextPr_Spacing,
	AscDFH.historyitem_TextPr_DStrikeout,
	AscDFH.historyitem_TextPr_Caps,
	AscDFH.historyitem_TextPr_SmallCaps,
	AscDFH.historyitem_TextPr_Position,
	AscDFH.historyitem_TextPr_Value,
	AscDFH.historyitem_TextPr_RFonts,
	AscDFH.historyitem_TextPr_RFonts_Ascii,
	AscDFH.historyitem_TextPr_RFonts_HAnsi,
	AscDFH.historyitem_TextPr_RFonts_CS,
	AscDFH.historyitem_TextPr_RFonts_EastAsia,
	AscDFH.historyitem_TextPr_RFonts_Hint,
	AscDFH.historyitem_TextPr_Lang,
	AscDFH.historyitem_TextPr_Lang_Bidi,
	AscDFH.historyitem_TextPr_Lang_EastAsia,
	AscDFH.historyitem_TextPr_Lang_Val,
	AscDFH.historyitem_TextPr_Unifill,
	AscDFH.historyitem_TextPr_FontSizeCS,
	AscDFH.historyitem_TextPr_Outline,
	AscDFH.historyitem_TextPr_Fill
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_RFonts]          = [
	AscDFH.historyitem_TextPr_RFonts,
	AscDFH.historyitem_TextPr_RFonts_Ascii,
	AscDFH.historyitem_TextPr_RFonts_HAnsi,
	AscDFH.historyitem_TextPr_RFonts_CS,
	AscDFH.historyitem_TextPr_RFonts_EastAsia,
	AscDFH.historyitem_TextPr_RFonts_Hint,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_RFonts_Ascii]    = [
	AscDFH.historyitem_TextPr_RFonts_Ascii,
	AscDFH.historyitem_TextPr_RFonts,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_RFonts_HAnsi]    = [
	AscDFH.historyitem_TextPr_RFonts_HAnsi,
	AscDFH.historyitem_TextPr_RFonts,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_RFonts_CS]       = [
	AscDFH.historyitem_TextPr_RFonts_CS,
	AscDFH.historyitem_TextPr_RFonts,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_RFonts_EastAsia] = [
	AscDFH.historyitem_TextPr_RFonts_EastAsia,
	AscDFH.historyitem_TextPr_RFonts,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_RFonts_Hint]     = [
	AscDFH.historyitem_TextPr_RFonts_Hint,
	AscDFH.historyitem_TextPr_RFonts,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Lang]            = [
	AscDFH.historyitem_TextPr_Lang,
	AscDFH.historyitem_TextPr_Lang_Bidi,
	AscDFH.historyitem_TextPr_Lang_EastAsia,
	AscDFH.historyitem_TextPr_Lang_Val,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Lang_Bidi]       = [
	AscDFH.historyitem_TextPr_Lang_Bidi,
	AscDFH.historyitem_TextPr_Lang,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Lang_EastAsia]   = [
	AscDFH.historyitem_TextPr_Lang_EastAsia,
	AscDFH.historyitem_TextPr_Lang,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Lang_Val]        = [
	AscDFH.historyitem_TextPr_Lang_Val,
	AscDFH.historyitem_TextPr_Lang,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Unifill]         = [
	AscDFH.historyitem_TextPr_Unifill,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_FontSizeCS]      = [
	AscDFH.historyitem_TextPr_FontSizeCS,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Outline]         = [
	AscDFH.historyitem_TextPr_Outline,
	AscDFH.historyitem_TextPr_Value
];
AscDFH.paratextprChangesRelationMap[AscDFH.historyitem_TextPr_Fill]            = [
	AscDFH.historyitem_TextPr_Fill,
	AscDFH.historyitem_TextPr_Value
];

/**
 * Общая функция объединения изменений, которые зависят только от себя и AscDFH.historyitem_TextPr_Value
 * @param oChange
 * @returns {boolean}
 */
function private_ParaTextPrChangesOnMergeValue(oChange)
{
	if (oChange.Class !== this.Class)
		return true;

	if (oChange.Type === this.Type || oChange.Type === AscDFH.historyitem_TextPr_Value)
		return false;

	return true;
}
/**
 * Общая функция объединения изменений, которые зависят от себя, AscDFH.historyitem_TextPr_Value,
 * AscDFH.historyitem_TextPr_Lang
 * @param oChange
 * @returns {boolean}
 */
function private_ParaTextPrChangesOnMergeLangValue(oChange)
{
	if (oChange.Class !== this.Class)
		return true;

	if (oChange.Type === this.Type || oChange.Type === AscDFH.historyitem_TextPr_Value || oChange.Type === AscDFH.historyitem_TextPr_Lang)
		return false;

	return true;
}
/**
 * Общая функция объединения изменений, которые зависят от себя, AscDFH.historyitem_TextPr_Value,
 * AscDFH.historyitem_TextPr_RFonts
 * @param oChange
 * @returns {boolean}
 */
function private_ParaTextPrChangesOnMergeRFontsValue(oChange)
{
	if (oChange.Class !== this.Class)
		return true;

	if (oChange.Type === this.Type || oChange.Type === AscDFH.historyitem_TextPr_Value || oChange.Type === AscDFH.historyitem_TextPr_RFonts)
		return false;

	return true;
}
//----------------------------------------------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParaTextPrBold(Class, Old, New, Color)
{
	CChangesParaTextPrBold.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrBold, AscDFH.CChangesBaseBoolProperty);
CChangesParaTextPrBold.prototype.Type = AscDFH.historyitem_TextPr_Bold;
CChangesParaTextPrBold.prototype.private_SetValue = function(Value)
{
	this.Class.Value.Bold = Value;
};
CChangesParaTextPrBold.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParaTextPrItalic(Class, Old, New, Color)
{
	CChangesParaTextPrItalic.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrItalic, AscDFH.CChangesBaseBoolProperty);
CChangesParaTextPrItalic.prototype.Type = AscDFH.historyitem_TextPr_Italic;
CChangesParaTextPrItalic.prototype.private_SetValue = function(Value)
{
	this.Class.Value.Italic = Value;
};
CChangesParaTextPrItalic.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParaTextPrStrikeout(Class, Old, New, Color)
{
	CChangesParaTextPrStrikeout.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrStrikeout, AscDFH.CChangesBaseBoolProperty);
CChangesParaTextPrStrikeout.prototype.Type = AscDFH.historyitem_TextPr_Strikeout;
CChangesParaTextPrStrikeout.prototype.private_SetValue = function(Value)
{
	this.Class.Value.Strikeout = Value;
};
CChangesParaTextPrStrikeout.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParaTextPrUnderline(Class, Old, New, Color)
{
	CChangesParaTextPrUnderline.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrUnderline, AscDFH.CChangesBaseBoolProperty);
CChangesParaTextPrUnderline.prototype.Type = AscDFH.historyitem_TextPr_Underline;
CChangesParaTextPrUnderline.prototype.private_SetValue = function(Value)
{
	this.Class.Value.Underline = Value;
};
CChangesParaTextPrUnderline.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseDoubleProperty}
 */
function CChangesParaTextPrFontSize(Class, Old, New, Color)
{
	CChangesParaTextPrFontSize.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrFontSize, AscDFH.CChangesBaseDoubleProperty);
CChangesParaTextPrFontSize.prototype.Type = AscDFH.historyitem_TextPr_FontSize;
CChangesParaTextPrFontSize.prototype.private_SetValue = function(Value)
{
	this.Class.Value.FontSize = Value;
};
CChangesParaTextPrFontSize.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParaTextPrColor(Class, Old, New, Color)
{
	CChangesParaTextPrColor.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrColor, AscDFH.CChangesBaseObjectProperty);
CChangesParaTextPrColor.prototype.Type = AscDFH.historyitem_TextPr_Color;
CChangesParaTextPrColor.prototype.private_SetValue = function(Value)
{
	this.Class.Value.Color = Value;
};
CChangesParaTextPrColor.prototype.private_CreateObject = function()
{
	return new CDocumentColor(0, 0, 0, false);
};
CChangesParaTextPrColor.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesParaTextPrVertAlign(Class, Old, New, Color)
{
	CChangesParaTextPrVertAlign.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrVertAlign, AscDFH.CChangesBaseLongProperty);
CChangesParaTextPrVertAlign.prototype.Type = AscDFH.historyitem_TextPr_VertAlign;
CChangesParaTextPrVertAlign.prototype.private_SetValue = function(Value)
{
	this.Class.Value.VertAlign = Value;
};
CChangesParaTextPrVertAlign.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaTextPrHighLight(Class, Old, New, Color)
{
	CChangesParaTextPrHighLight.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrVertAlign, AscDFH.CChangesBaseProperty);
CChangesParaTextPrHighLight.prototype.Type = AscDFH.historyitem_TextPr_HighLight;
CChangesParaTextPrHighLight.prototype.private_SetValue = function(Value)
{
	this.Class.Value.HighLight = Value;
};
CChangesParaTextPrHighLight.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Подсвечивать ли данные изменения
	// 2-bit : Is undefined New ?
	// 3-bit : Is "none" New ?
	// 4-bit : Is undefined New ?
	// 5-bit : Is "none" New ?
	// Variable(?CDocumentColor) : New (если 2 и 3 биты нулевые)
	// Variable(?CDocumentColor) : Old (если 4 и 5 биты нулевые)

	var nFlags = 0;

	if (false !== this.Color)
		nFlags |= 1;

	if (undefined === this.New)
		nFlags |= 2;
	else if (highlight_None === this.New)
		nFlags |= 4;

	if (undefined === this.Old)
		nFlags |= 8;
	else if (highlight_None === this.Old)
		nFlags |= 16;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New && highlight_None !== this.New)
		this.New.Write_ToBinary(Writer);

	if (undefined !== this.Old && highlight_None !== this.Old)
		this.Old.Write_ToBinary(Writer);
};
CChangesParaTextPrHighLight.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Подсвечивать ли данные изменения
	// 2-bit : Is undefined New ?
	// 3-bit : Is "none" New ?
	// 4-bit : Is undefined New ?
	// 5-bit : Is "none" New ?
	// Variable(?CDocumentColor) : New (если 2 и 3 биты нулевые)
	// Variable(?CDocumentColor) : Old (если 4 и 5 биты нулевые)

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.Color = true;
	else
		this.Color = false;

	if (nFlags & 2)
	{
		this.New = undefined;
	}
	else if (nFlags & 4)
	{
		this.New = highlight_None;
	}
	else
	{
		this.New = new CDocumentColor(0, 0, 0);
		this.New.Read_FromBinary(Reader);
	}

	if (nFlags & 8)
	{
		this.Old = undefined;
	}
	else if (nFlags & 16)
	{
		this.Old = highlight_None;
	}
	else
	{
		this.Old = new CDocumentColor(0, 0, 0);
		this.Old.Read_FromBinary(Reader);
	}
};
CChangesParaTextPrHighLight.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseStringProperty}
 */
function CChangesParaTextPrRStyle(Class, Old, New, Color)
{
	CChangesParaTextPrRStyle.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrRStyle, AscDFH.CChangesBaseStringProperty);
CChangesParaTextPrRStyle.prototype.Type = AscDFH.historyitem_TextPr_RStyle;
CChangesParaTextPrRStyle.prototype.private_SetValue = function(Value)
{
	this.Class.Value.RStyle = Value;
};
CChangesParaTextPrRStyle.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseDoubleProperty}
 */
function CChangesParaTextPrSpacing(Class, Old, New, Color)
{
	CChangesParaTextPrSpacing.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrSpacing, AscDFH.CChangesBaseDoubleProperty);
CChangesParaTextPrSpacing.prototype.Type = AscDFH.historyitem_TextPr_Spacing;
CChangesParaTextPrSpacing.prototype.private_SetValue = function(Value)
{
	this.Class.Value.Spacing = Value;
};
CChangesParaTextPrSpacing.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParaTextPrDStrikeout(Class, Old, New, Color)
{
	CChangesParaTextPrDStrikeout.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrDStrikeout, AscDFH.CChangesBaseBoolProperty);
CChangesParaTextPrDStrikeout.prototype.Type = AscDFH.historyitem_TextPr_DStrikeout;
CChangesParaTextPrDStrikeout.prototype.private_SetValue = function(Value)
{
	this.Class.Value.DStrikeout = Value;
};
CChangesParaTextPrDStrikeout.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParaTextPrCaps(Class, Old, New, Color)
{
	CChangesParaTextPrCaps.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrCaps, AscDFH.CChangesBaseBoolProperty);
CChangesParaTextPrCaps.prototype.Type = AscDFH.historyitem_TextPr_Caps;
CChangesParaTextPrCaps.prototype.private_SetValue = function(Value)
{
	this.Class.Value.Caps = Value;
};
CChangesParaTextPrCaps.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParaTextPrSmallCaps(Class, Old, New, Color)
{
	CChangesParaTextPrSmallCaps.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrSmallCaps, AscDFH.CChangesBaseBoolProperty);
CChangesParaTextPrSmallCaps.prototype.Type = AscDFH.historyitem_TextPr_SmallCaps;
CChangesParaTextPrSmallCaps.prototype.private_SetValue = function(Value)
{
	this.Class.Value.SmallCaps = Value;
};
CChangesParaTextPrSmallCaps.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseDoubleProperty}
 */
function CChangesParaTextPrPosition(Class, Old, New, Color)
{
	CChangesParaTextPrPosition.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrPosition, AscDFH.CChangesBaseDoubleProperty);
CChangesParaTextPrPosition.prototype.Type = AscDFH.historyitem_TextPr_Position;
CChangesParaTextPrPosition.prototype.private_SetValue = function(Value)
{
	this.Class.Value.Position = Value;
};
CChangesParaTextPrPosition.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParaTextPrValue(Class, Old, New, Color)
{
	CChangesParaTextPrValue.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrValue, AscDFH.CChangesBaseObjectProperty);
CChangesParaTextPrValue.prototype.Type = AscDFH.historyitem_TextPr_Value;
CChangesParaTextPrValue.prototype.private_SetValue = function(Value)
{
	this.Class.Value = Value;
};
CChangesParaTextPrValue.prototype.private_CreateObject = function()
{
	return new CTextPr();
};
CChangesParaTextPrValue.prototype.private_IsCreateEmptyObject = function()
{
	return true;
};
CChangesParaTextPrValue.prototype.Merge = function(oChange)
{
	if (oChange.Class !== this.Class)
		return true;

	if (oChange.Type === this.Type)
		return false;

	if (!this.New)
		this.New = new CTextPr();

	switch (oChange.Type)
	{
		case AscDFH.historyitem_TextPr_Bold:
		{
			this.New.Bold = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Italic:
		{
			this.New.Italic = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Strikeout:
		{
			this.New.Strikeout = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Underline:
		{
			this.New.Underline = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_FontSize:
		{
			this.New.FontSize = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Color:
		{
			this.New.Color = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_VertAlign:
		{
			this.New.VertAlign = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_HighLight:
		{
			this.New.HighLight = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_RStyle:
		{
			this.New.RStyle = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Spacing:
		{
			this.New.Spacing = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_DStrikeout:
		{
			this.New.DStrikeout = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Caps:
		{
			this.New.Caps = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_SmallCaps:
		{
			this.New.SmallCaps = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Position:
		{
			this.New.Position = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_RFonts:
		{
			this.New.RFonts = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_RFonts_Ascii:
		{
			if (!this.New.RFonts)
				this.New.RFonts = new CRFonts();

			this.New.RFonts.Ascii = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_RFonts_HAnsi:
		{
			if (!this.New.RFonts)
				this.New.RFonts = new CRFonts();

			this.New.RFonts.HAnsi = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_RFonts_CS:
		{
			if (!this.New.RFonts)
				this.New.RFonts = new CRFonts();

			this.New.RFonts.CS = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_RFonts_EastAsia:
		{
			if (!this.New.RFonts)
				this.New.RFonts = new CRFonts();

			this.New.RFonts.EastAsia = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_RFonts_Hint:
		{
			if (!this.New.RFonts)
				this.New.RFonts = new CRFonts();

			this.New.RFonts.Hint = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Lang:
		{
			this.New.Lang = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Lang_Bidi:
		{
			if (!this.New.Lang)
				this.New.Lang = new CLang();

			this.New.Lang.Bidi = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Lang_EastAsia:
		{
			if (!this.New.Lang)
				this.New.Lang = new CLang();

			this.New.Lang.EastAsia = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Lang_Val:
		{
			if (!this.New.Lang)
				this.New.Lang = new CLang();

			this.New.Lang.Val = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Unifill:
		{
			this.New.Unifill = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_FontSizeCS:
		{
			this.New.FontSizeCS = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Outline:
		{
			this.New.TextOutline = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Fill:
		{
			this.New.TextFill = oChange.New;
			break;
		}
	}

	return true;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParaTextPrRFonts(Class, Old, New, Color)
{
	CChangesParaTextPrRFonts.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrRFonts, AscDFH.CChangesBaseObjectProperty);
CChangesParaTextPrRFonts.prototype.Type = AscDFH.historyitem_TextPr_RFonts;
CChangesParaTextPrRFonts.prototype.private_SetValue = function(Value)
{
	this.Class.Value.RFonts = Value;
};
CChangesParaTextPrRFonts.prototype.private_CreateObject = function()
{
	return new CRFonts();
};
CChangesParaTextPrRFonts.prototype.private_IsCreateEmptyObject = function()
{
	return true;
};
CChangesParaTextPrRFonts.prototype.Merge = function(oChange)
{
	if (this.Class !== oChange.Class)
		return true;

	if (this.Type === oChange.Type || oChange.Type === AscDFH.historyitem_TextPr_Value)
		return false;

	if (!this.New)
		this.New = new CRFonts();

	switch (oChange.Type)
	{
		case AscDFH.historyitem_TextPr_RFonts_Ascii:
		{
			this.New.Ascii = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_RFonts_HAnsi:
		{
			this.New.HAnsi = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_RFonts_CS:
		{
			this.New.CS = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_RFonts_EastAsia:
		{
			this.New.EastAsia = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_RFonts_Hint:
		{
			this.New.Hint = oChange.New;
			break;
		}
	}

	return true;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaTextPrRFontsAscii(Class, Old, New, Color)
{
	CChangesParaTextPrRFontsAscii.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrRFontsAscii, AscDFH.CChangesBaseProperty);
CChangesParaTextPrRFontsAscii.prototype.Type = AscDFH.historyitem_TextPr_RFonts_Ascii;
CChangesParaTextPrRFontsAscii.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Подсвечивать ли данные изменения
	// 2-bit : Is undefined New ?
	// 3-bit : Is undefined Old ?
	// String : New
	// String : Old

	var nFlags = 0;

	if (false !== this.Color)
		nFlags |= 1;

	if (undefined === this.New)
		nFlags |= 2;

	if (undefined === this.Old)
		nFlags |= 4;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New)
		Writer.WriteString2(this.New.Name);

	if (undefined !== this.Old)
		Writer.WriteString2(this.Old.Name);
};
CChangesParaTextPrRFontsAscii.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Подсвечивать ли данные изменения
	// 2-bit : Is undefined New ?
	// 3-bit : Is undefined Old ?
	// String : New
	// String : Old

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.Color = true;
	else
		this.Color = false;

	if (nFlags & 2)
	{
		this.New = undefined;
	}
	else
	{
		this.New = {
			Name  : Reader.GetString2(),
			Index : -1
		};
	}

	if (nFlags & 4)
	{
		this.Old = undefined;
	}
	else
	{
		this.Old = {
			Name  : Reader.GetString2(),
			Index : -1
		};
	}
};
CChangesParaTextPrRFontsAscii.prototype.private_SetValue = function(Value)
{
	this.Class.Value.RFonts.Ascii = Value;
};
CChangesParaTextPrRFontsAscii.prototype.Merge = private_ParaTextPrChangesOnMergeRFontsValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaTextPrRFontsHAnsi(Class, Old, New, Color)
{
	CChangesParaTextPrRFontsHAnsi.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrRFontsHAnsi, AscDFH.CChangesBaseProperty);
CChangesParaTextPrRFontsHAnsi.prototype.Type = AscDFH.historyitem_TextPr_RFonts_HAnsi;
CChangesParaTextPrRFontsHAnsi.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Подсвечивать ли данные изменения
	// 2-bit : Is undefined New ?
	// 3-bit : Is undefined Old ?
	// String : New
	// String : Old

	var nFlags = 0;

	if (false !== this.Color)
		nFlags |= 1;

	if (undefined === this.New)
		nFlags |= 2;

	if (undefined === this.Old)
		nFlags |= 4;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New)
		Writer.WriteString2(this.New.Name);

	if (undefined !== this.Old)
		Writer.WriteString2(this.Old.Name);
};
CChangesParaTextPrRFontsHAnsi.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Подсвечивать ли данные изменения
	// 2-bit : Is undefined New ?
	// 3-bit : Is undefined Old ?
	// String : New
	// String : Old

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.Color = true;
	else
		this.Color = false;

	if (nFlags & 2)
	{
		this.New = undefined;
	}
	else
	{
		this.New = {
			Name  : Reader.GetString2(),
			Index : -1
		};
	}

	if (nFlags & 4)
	{
		this.Old = undefined;
	}
	else
	{
		this.Old = {
			Name  : Reader.GetString2(),
			Index : -1
		};
	}
};
CChangesParaTextPrRFontsHAnsi.prototype.private_SetValue = function(Value)
{
	this.Class.Value.RFonts.HAnsi = Value;
};
CChangesParaTextPrRFontsHAnsi.prototype.Merge = private_ParaTextPrChangesOnMergeRFontsValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaTextPrRFontsCS(Class, Old, New, Color)
{
	CChangesParaTextPrRFontsCS.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrRFontsCS, AscDFH.CChangesBaseProperty);
CChangesParaTextPrRFontsCS.prototype.Type = AscDFH.historyitem_TextPr_RFonts_CS;
CChangesParaTextPrRFontsCS.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Подсвечивать ли данные изменения
	// 2-bit : Is undefined New ?
	// 3-bit : Is undefined Old ?
	// String : New
	// String : Old

	var nFlags = 0;

	if (false !== this.Color)
		nFlags |= 1;

	if (undefined === this.New)
		nFlags |= 2;

	if (undefined === this.Old)
		nFlags |= 4;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New)
		Writer.WriteString2(this.New.Name);

	if (undefined !== this.Old)
		Writer.WriteString2(this.Old.Name);
};
CChangesParaTextPrRFontsCS.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Подсвечивать ли данные изменения
	// 2-bit : Is undefined New ?
	// 3-bit : Is undefined Old ?
	// String : New
	// String : Old

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.Color = true;
	else
		this.Color = false;

	if (nFlags & 2)
	{
		this.New = undefined;
	}
	else
	{
		this.New = {
			Name  : Reader.GetString2(),
			Index : -1
		};
	}

	if (nFlags & 4)
	{
		this.Old = undefined;
	}
	else
	{
		this.Old = {
			Name  : Reader.GetString2(),
			Index : -1
		};
	}
};
CChangesParaTextPrRFontsCS.prototype.private_SetValue = function(Value)
{
	this.Class.Value.RFonts.CS = Value;
};
CChangesParaTextPrRFontsCS.prototype.Merge = private_ParaTextPrChangesOnMergeRFontsValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaTextPrRFontsEastAsia(Class, Old, New, Color)
{
	CChangesParaTextPrRFontsEastAsia.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrRFontsEastAsia, AscDFH.CChangesBaseProperty);
CChangesParaTextPrRFontsEastAsia.prototype.Type = AscDFH.historyitem_TextPr_RFonts_EastAsia;
CChangesParaTextPrRFontsEastAsia.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Подсвечивать ли данные изменения
	// 2-bit : Is undefined New ?
	// 3-bit : Is undefined Old ?
	// String : New
	// String : Old

	var nFlags = 0;

	if (false !== this.Color)
		nFlags |= 1;

	if (undefined === this.New)
		nFlags |= 2;

	if (undefined === this.Old)
		nFlags |= 4;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New)
		Writer.WriteString2(this.New.Name);

	if (undefined !== this.Old)
		Writer.WriteString2(this.Old.Name);
};
CChangesParaTextPrRFontsEastAsia.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Подсвечивать ли данные изменения
	// 2-bit : Is undefined New ?
	// 3-bit : Is undefined Old ?
	// String : New
	// String : Old

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.Color = true;
	else
		this.Color = false;

	if (nFlags & 2)
	{
		this.New = undefined;
	}
	else
	{
		this.New = {
			Name  : Reader.GetString2(),
			Index : -1
		};
	}

	if (nFlags & 4)
	{
		this.Old = undefined;
	}
	else
	{
		this.Old = {
			Name  : Reader.GetString2(),
			Index : -1
		};
	}
};
CChangesParaTextPrRFontsEastAsia.prototype.private_SetValue = function(Value)
{
	this.Class.Value.RFonts.EastAsia = Value;
};
CChangesParaTextPrRFontsEastAsia.prototype.Merge = private_ParaTextPrChangesOnMergeRFontsValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesParaTextPrRFontsHint(Class, Old, New, Color)
{
	CChangesParaTextPrRFontsHint.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrRFontsHint, AscDFH.CChangesBaseLongProperty);
CChangesParaTextPrRFontsHint.prototype.Type = AscDFH.historyitem_TextPr_RFonts_Hint;
CChangesParaTextPrRFontsHint.prototype.private_SetValue = function(Value)
{
	this.Class.Value.RFonts.Hint = Value;
};
CChangesParaTextPrRFontsHint.prototype.Merge = private_ParaTextPrChangesOnMergeRFontsValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParaTextPrLang(Class, Old, New, Color)
{
	CChangesParaTextPrLang.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrLang, AscDFH.CChangesBaseObjectProperty);
CChangesParaTextPrLang.prototype.Type = AscDFH.historyitem_TextPr_Lang;
CChangesParaTextPrLang.prototype.private_SetValue = function(Value)
{
	this.Class.Value.Lang = Value;
};
CChangesParaTextPrLang.prototype.private_CreateObject = function()
{
	return new CLang();
};
CChangesParaTextPrLang.prototype.private_IsCreateEmptyObject = function()
{
	return true;
};
CChangesParaTextPrLang.prototype.Merge = function(oChange)
{
	if (this.Class !== oChange.Class)
		return true;

	if (AscDFH.historyitem_TextPr_Lang === oChange.Type || AscDFH.historyitem_TextPr_Value === oChange.Type)
		return false;

	if (!this.New)
		this.New = new CLang();

	switch (oChange.Type)
	{
		case AscDFH.historyitem_TextPr_Lang_Bidi:
		{
			this.New.Bidi = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Lang_EastAsia:
		{
			this.New.EastAsia = oChange.New;
			break;
		}
		case AscDFH.historyitem_TextPr_Lang_Val:
		{
			this.New.Val = oChange.New;
			break;
		}
	}

	return true;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesParaTextPrLangBidi(Class, Old, New, Color)
{
	CChangesParaTextPrLangBidi.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrLangBidi, AscDFH.CChangesBaseLongProperty);
CChangesParaTextPrLangBidi.prototype.Type = AscDFH.historyitem_TextPr_Lang_Bidi;
CChangesParaTextPrLangBidi.prototype.private_SetValue = function(Value)
{
	this.Class.Value.Lang.Bidi = Value;
};
CChangesParaTextPrLangBidi.prototype.Merge = private_ParaTextPrChangesOnMergeLangValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesParaTextPrLangEastAsia(Class, Old, New, Color)
{
	CChangesParaTextPrLangEastAsia.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrLangEastAsia, AscDFH.CChangesBaseLongProperty);
CChangesParaTextPrLangEastAsia.prototype.Type = AscDFH.historyitem_TextPr_Lang_EastAsia;
CChangesParaTextPrLangEastAsia.prototype.private_SetValue = function(Value)
{
	this.Class.Value.Lang.EastAsia = Value;
};
CChangesParaTextPrLangEastAsia.prototype.Merge = private_ParaTextPrChangesOnMergeLangValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesParaTextPrLangVal(Class, Old, New, Color)
{
	CChangesParaTextPrLangVal.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrLangVal, AscDFH.CChangesBaseLongProperty);
CChangesParaTextPrLangVal.prototype.Type = AscDFH.historyitem_TextPr_Lang_Val;
CChangesParaTextPrLangVal.prototype.private_SetValue = function(Value)
{
	this.Class.Value.Lang.Val = Value;
};
CChangesParaTextPrLangVal.prototype.Merge = private_ParaTextPrChangesOnMergeLangValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParaTextPrUnifill(Class, Old, New, Color)
{
	CChangesParaTextPrUnifill.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrUnifill, AscDFH.CChangesBaseObjectProperty);
CChangesParaTextPrUnifill.prototype.Type = AscDFH.historyitem_TextPr_Unifill;
CChangesParaTextPrUnifill.prototype.private_SetValue = function(Value)
{
	this.Class.Value.Unifill = Value;
};
CChangesParaTextPrUnifill.prototype.private_CreateObject = function()
{
	return new AscFormat.CUniFill();
};
CChangesParaTextPrUnifill.prototype.Load = function(Color)
{
	this.Redo();

	var Unifill = this.Class.Value.Unifill;
	if (AscCommon.CollaborativeEditing
		&& Unifill
		&& Unifill.fill
		&& Unifill.fill.type === Asc.c_oAscFill.FILL_TYPE_BLIP
		&& typeof Unifill.fill.RasterImageId === "string"
		&& Unifill.fill.RasterImageId.length > 0)
	{
		AscCommon.CollaborativeEditing.Add_NewImage(AscCommon.getFullImageSrc2(Unifill.fill.RasterImageId));
	}
};
CChangesParaTextPrUnifill.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseDoubleProperty}
 */
function CChangesParaTextPrFontSizeCS(Class, Old, New, Color)
{
	CChangesParaTextPrFontSizeCS.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrFontSizeCS, AscDFH.CChangesBaseDoubleProperty);
CChangesParaTextPrFontSizeCS.prototype.Type = AscDFH.historyitem_TextPr_FontSizeCS;
CChangesParaTextPrFontSizeCS.prototype.private_SetValue = function(Value)
{
	this.Class.Value.FontSizeCS = Value;
};
CChangesParaTextPrFontSizeCS.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParaTextPrTextOutline(Class, Old, New, Color)
{
	CChangesParaTextPrTextOutline.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrTextOutline, AscDFH.CChangesBaseObjectProperty);
CChangesParaTextPrTextOutline.prototype.Type = AscDFH.historyitem_TextPr_Outline;
CChangesParaTextPrTextOutline.prototype.private_SetValue = function(Value)
{
	this.Class.Value.TextOutline = Value;
};
CChangesParaTextPrTextOutline.prototype.private_CreateObject = function()
{
	return new AscFormat.CLn();
};
CChangesParaTextPrTextOutline.prototype.Merge = private_ParaTextPrChangesOnMergeValue;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParaTextPrTextFill(Class, Old, New, Color)
{
	CChangesParaTextPrTextFill.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaTextPrTextFill, AscDFH.CChangesBaseObjectProperty);
CChangesParaTextPrTextFill.prototype.Type = AscDFH.historyitem_TextPr_Fill;
CChangesParaTextPrTextFill.prototype.private_SetValue = function(Value)
{
	this.Class.Value.TextFill = Value;
};
CChangesParaTextPrTextFill.prototype.private_CreateObject = function()
{
	return new AscFormat.CUniFill();
};
CChangesParaTextPrTextFill.prototype.Merge = private_ParaTextPrChangesOnMergeValue;