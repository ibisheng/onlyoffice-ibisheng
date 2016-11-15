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
 * Date: 09.11.2016
 * Time: 15:52
 */

AscDFH.changesFactory[AscDFH.historyitem_MathContent_AddItem]      = CChangesMathContentAddItem;
AscDFH.changesFactory[AscDFH.historyitem_MathContent_RemoveItem]   = CChangesMathContentRemoveItem;
AscDFH.changesFactory[AscDFH.historyitem_MathContent_ArgSize]      = CChangesMathContentArgSize;
AscDFH.changesFactory[AscDFH.historyitem_MathPara_Jc]              = CChangesMathParaJc;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_AddItems]        = CChangesMathBaseAddItems;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_RemoveItems]     = CChangesMathBaseRemoveItems;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_FontSize]        = CChangesMathBaseFontSize;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_Shd]             = CChangesMathBaseShd;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_Color]           = CChangesMathBaseColor;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_Unifill]         = CChangesMathBaseUnifill;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_Underline]       = CChangesMathBaseUnderline;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_Strikeout]       = CChangesMathBaseStrikeout;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_DoubleStrikeout] = CChangesMathBaseDoubleStrikeout;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_Italic]          = CChangesMathBaseItalic;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_Bold]            = CChangesMathBaseBold;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_RFontsAscii]     = CChangesMathBaseRFontsAscii;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_RFontsHAnsi]     = CChangesMathBaseRFontsHAnsi;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_RFontsCS]        = CChangesMathBaseRFontsCS;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_RFontsEastAsia]  = CChangesMathBaseRFontsEastAsia;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_RFontsHint]      = CChangesMathBaseRFontsHint;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_HighLight]       = CChangesMathBaseHighLight;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_ReviewType]      = CChangesMathBaseReviewType;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_TextFill]        = CChangesMathBaseTextFill;
AscDFH.changesFactory[AscDFH.historyitem_MathBase_TextOutline]     = CChangesMathBaseTextOutline;
AscDFH.changesFactory[AscDFH.historyitem_MathBox_AlnAt]            = CChangesMathBoxAlnAt;
AscDFH.changesFactory[AscDFH.historyitem_MathBox_ForcedBreak]      = CChangesMathBoxForcedBreak;
AscDFH.changesFactory[AscDFH.historyitem_MathFraction_Type]        = CChangesMathFractionType;
AscDFH.changesFactory[AscDFH.historyitem_MathRadical_HideDegree]   = CChangesMathRadicalHideDegree;
AscDFH.changesFactory[AscDFH.historyitem_MathNary_LimLoc]          = CChangesMathNaryLimLoc;
AscDFH.changesFactory[AscDFH.historyitem_MathNary_UpperLimit]      = CChangesMathNaryUpperLimit;
AscDFH.changesFactory[AscDFH.historyitem_MathNary_LowerLimit]      = CChangesMathNaryLowerLimit;
AscDFH.changesFactory[AscDFH.historyitem_MathDelimiter_BegOper]    = CChangesMathDelimBegOper;
AscDFH.changesFactory[AscDFH.historyitem_MathDelimiter_EndOper]    = CChangesMathDelimEndOper;
AscDFH.changesFactory[AscDFH.historyitem_MathDelimiter_Grow]       = CChangesMathDelimiterGrow;
AscDFH.changesFactory[AscDFH.historyitem_MathDelimiter_Shape]      = CChangesMathDelimiterShape;
AscDFH.changesFactory[AscDFH.historyitem_MathDelimiter_SetColumn]  = CChangesMathDelimiterSetColumn;
AscDFH.changesFactory[AscDFH.historyitem_MathGroupChar_Pr]         = CChangesMathGroupCharPr;
AscDFH.changesFactory[AscDFH.historyitem_MathLimit_Type]           = CChangesMathLimitType;
AscDFH.changesFactory[AscDFH.historyitem_MathBorderBox_Top]        = CChangesMathBorderBoxTop;
AscDFH.changesFactory[AscDFH.historyitem_MathBorderBox_Bot]        = CChangesMathBorderBoxBot;
AscDFH.changesFactory[AscDFH.historyitem_MathBorderBox_Left]       = CChangesMathBorderBoxLeft;
AscDFH.changesFactory[AscDFH.historyitem_MathBorderBox_Right]      = CChangesMathBorderBoxRight;
AscDFH.changesFactory[AscDFH.historyitem_MathBorderBox_Hor]        = CChangesMathBorderBoxHor;
AscDFH.changesFactory[AscDFH.historyitem_MathBorderBox_Ver]        = CChangesMathBorderBoxVer;
AscDFH.changesFactory[AscDFH.historyitem_MathBorderBox_TopLTR]     = CChangesMathBorderBoxTopLTR;
AscDFH.changesFactory[AscDFH.historyitem_MathBorderBox_TopRTL]     = CChangesMathBorderBoxTopRTL;
AscDFH.changesFactory[AscDFH.historyitem_MathBar_LinePos]          = CChangesMathBarLinePos;
AscDFH.changesFactory[AscDFH.historyitem_MathMatrix_AddRow]        = CChangesMathMatrixAddRow;
AscDFH.changesFactory[AscDFH.historyitem_MathMatrix_RemoveRow]     = CChangesMathMatrixRemoveRow;
AscDFH.changesFactory[AscDFH.historyitem_MathMatrix_AddColumn]     = CChangesMathMatrixAddColumn;
AscDFH.changesFactory[AscDFH.historyitem_MathMatrix_RemoveColumn]  = CChangesMathMatrixRemoveColumn;
AscDFH.changesFactory[AscDFH.historyitem_MathMatrix_BaseJc]        = CChangesMathMatrixBaseJc;
AscDFH.changesFactory[AscDFH.historyitem_MathMatrix_ColumnJc]      = CChangesMathMatrixColumnJc;
AscDFH.changesFactory[AscDFH.historyitem_MathMatrix_Interval]      = CChangesMathMatrixInterval;
AscDFH.changesFactory[AscDFH.historyitem_MathMatrix_Plh]           = CChangesMathMatrixPlh;
AscDFH.changesFactory[AscDFH.historyitem_MathDegree_SubSupType]    = CChangesMathDegreeSubSupType;

/**
 * @constructor
 * @extends {AscDFH.CChangesBaseContentChange}
 */
function CChangesMathContentAddItem(Class, Pos, Items)
{
	CChangesMathContentAddItem.superclass.constructor.call(this, Class, Pos, Items, true);
}
AscCommon.extendClass(CChangesMathContentAddItem, AscDFH.CChangesBaseContentChange);
CChangesMathContentAddItem.prototype.Type = AscDFH.historyitem_MathContent_AddItem;
CChangesMathContentAddItem.prototype.Undo = function()
{
	var oMathContent = this.Class;
	oMathContent.Content.splice(this.Pos, this.Items.length);
};
CChangesMathContentAddItem.prototype.Redo = function()
{
	var oMathContent = this.Class;

	var Array_start = this.Content.slice(0, this.Pos);
	var Array_end   = this.Content.slice(this.Pos);

	oMathContent.Content = Array_start.concat(this.Items, Array_end);

	for (var nIndex = 0; nIndex < this.Items.length; ++nIndex)
		this.Items[nIndex].Recalc_RunsCompiledPr();
};
CChangesMathContentAddItem.prototype.private_WriteItem = function(Writer, Item)
{
	Writer.WriteString2(Item.Get_Id());
};
CChangesMathContentAddItem.prototype.private_ReadItem = function(Reader)
{
	return AscCommon.g_oTableId.Get_ById(Reader.GetString2());
};
CChangesMathContentAddItem.prototype.Load = function(Color)
{
	var oMathContent = this.Class;
	for (var nIndex = 0, nCount = this.Items.length; nIndex < nCount; ++nIndex)
	{
		var Pos     = oMathContent.m_oContentChanges.Check(AscCommon.contentchanges_Add, this.PosArray[nIndex]);
		var Element = this.Items[nIndex];

		if (null != Element)
		{
			oMathContent.Content.splice(Pos, 0, Element);
			Element.Recalc_RunsCompiledPr();
			AscCommon.CollaborativeEditing.Update_DocumentPositionsOnAdd(oMathContent, Pos);
		}
	}
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseContentChange}
 */
function CChangesMathContentRemoveItem(Class, Pos, Items)
{
	CChangesMathContentRemoveItem.superclass.constructor.call(this, Class, Pos, Items, false);
}
AscCommon.extendClass(CChangesMathContentRemoveItem, AscDFH.CChangesBaseContentChange);
CChangesMathContentRemoveItem.prototype.Type = AscDFH.historyitem_MathContent_RemoveItem;
CChangesMathContentRemoveItem.prototype.Undo = function()
{
	var oMathContent = this.Class;

	var Array_start = oMathContent.Content.slice(0, this.Pos);
	var Array_end   = oMathContent.Content.slice(this.Pos);

	oMathContent.Content = Array_start.concat(this.Items, Array_end);

	for (var nIndex = 0; nIndex < this.Items.length; ++nIndex)
		this.Items[nIndex].Recalc_RunsCompiledPr();
};
CChangesMathContentRemoveItem.prototype.Redo = function()
{
	var oMathContent = this.Class;
	oMathContent.Content.splice(this.Pos, this.Items.length);
};
CChangesMathContentRemoveItem.prototype.private_WriteItem = function(Writer, Item)
{
	Writer.WriteString2(Item.Get_Id());
};
CChangesMathContentRemoveItem.prototype.private_ReadItem = function(Reader)
{
	return AscCommon.g_oTableId.Get_ById(Reader.GetString2());
};
CChangesMathContentRemoveItem.prototype.Load = function(Color)
{
	var oMathContent = this.Class;
	for (var nIndex = 0, nCount = this.Items.length; nIndex < nCount; ++nIndex)
	{
		var ChangesPos = oMathContent.m_oContentChanges.Check(AscCommon.contentchanges_Remove, this.PosArray[nIndex]);

		if (false === ChangesPos)
			continue;

		oMathContent.Content.splice(ChangesPos, 1);
		AscCommon.CollaborativeEditing.Update_DocumentPositionsOnRemove(oMathContent, ChangesPos, 1);
	}
};
/**
 * Изменение настроек ArgSize в классе CMathContent
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathContentArgSize(Class, Old, New)
{
	CChangesMathContentArgSize.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathContentArgSize, AscDFH.CChangesBaseLongProperty);
CChangesMathContentArgSize.prototype.Type = AscDFH.historyitem_MathContent_ArgSize;
CChangesMathContentArgSize.prototype.private_SetValue = function(Value)
{
	var oMathContent = this.Class;
	oMathContent.ArgSize.SetValue(Value);
	oMathContent.Recalc_RunsCompiledPr();
};

/**
 * Изменение прилегания всей формулы (ParaMath)
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathParaJc(Class, Old, New)
{
	CChangesMathParaJc.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathParaJc, AscDFH.CChangesBaseLongProperty);
CChangesMathParaJc.prototype.Type = AscDFH.historyitem_MathPara_Jc;
CChangesMathParaJc.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetAlign(Value);
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBaseContentChange}
 */
function CChangesMathBaseAddItems(Class, Pos, Items)
{
	CChangesMathBaseAddItems.superclass.constructor.call(this, Class, Pos, Items, true);
}
AscCommon.extendClass(CChangesMathBaseAddItems, AscDFH.CChangesBaseContentChange);
CChangesMathBaseAddItems.prototype.Type = AscDFH.historyitem_MathBase_AddItems;
CChangesMathBaseAddItems.prototype.Undo = function()
{
	this.Class.raw_RemoveFromContent(this.Pos, this.Items.length);
};
CChangesMathBaseAddItems.prototype.Redo = function()
{
	this.Class.raw_AddToContent(this.Pos, this.Items, false);
};
CChangesMathBaseAddItems.prototype.private_WriteItem = function(Writer, Item)
{
	Writer.WriteString2(Item.Get_Id());
};
CChangesMathBaseAddItems.prototype.private_ReadItem = function(Reader)
{
	return AscCommon.g_oTableId.Get_ById(Reader.GetString2());
};
CChangesMathBaseAddItems.prototype.Load = function(Color)
{
	var oMathBase = this.Class;
	for (var nIndex = 0, nCount = this.Items.length; nIndex < nCount; ++nIndex)
	{
		var Pos     = oMathBase.m_oContentChanges.Check(AscCommon.contentchanges_Add, this.PosArray[nIndex]);
		var Element = this.Items[nIndex];

		if (null !== Element)
		{
			oMathBase.Content.splice(Pos, 0, Element);
			Element.ParentElement = oMathBase;
			AscCommon.CollaborativeEditing.Update_DocumentPositionsOnAdd(oMathBase, Pos);
		}
	}

	oMathBase.fillContent();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseContentChange}
 */
function CChangesMathBaseRemoveItems(Class, Pos, Items)
{
	CChangesMathBaseRemoveItems.superclass.constructor.call(this, Class, Pos, Items, false);
}
AscCommon.extendClass(CChangesMathBaseRemoveItems, AscDFH.CChangesBaseContentChange);
CChangesMathBaseRemoveItems.prototype.Type = AscDFH.historyitem_MathBase_RemoveItems;
CChangesMathBaseRemoveItems.prototype.Undo = function()
{
	this.Class.raw_AddToContent(this.Pos, this.Items, false);
};
CChangesMathBaseRemoveItems.prototype.Redo = function()
{
	this.Class.raw_RemoveFromContent(this.Pos, this.Items.length);
};
CChangesMathBaseRemoveItems.prototype.private_WriteItem = function(Writer, Item)
{
	Writer.WriteString2(Item.Get_Id());
};
CChangesMathBaseRemoveItems.prototype.private_ReadItem = function(Reader)
{
	return AscCommon.g_oTableId.Get_ById(Reader.GetString2());
};
CChangesMathBaseRemoveItems.prototype.Load = function()
{
	var oMathBase = this.Class;
	for (var nIndex = 0, nCount = this.Items.length; nIndex < nCount; ++nIndex)
	{
		var ChangesPos = oMathBase.m_oContentChanges.Check(AscCommon.contentchanges_Remove, this.PosArray[nIndex]);
		if (false === ChangesPos)
			continue;

		oMathBase.Content.splice(ChangesPos, 1);
		AscCommon.CollaborativeEditing.Update_DocumentPositionsOnRemove(oMathBase, ChangesPos, 1);
	}
	oMathBase.fillContent();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathBaseFontSize(Class, Old, New)
{
	CChangesMathBaseFontSize.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseFontSize, AscDFH.CChangesBaseLongProperty);
CChangesMathBaseFontSize.prototype.Type = AscDFH.historyitem_MathBase_FontSize;
CChangesMathBaseFontSize.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetFontSize(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesMathBaseShd(Class, Old, New)
{
	CChangesMathBaseShd.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseShd, AscDFH.CChangesBaseObjectProperty);
CChangesMathBaseShd.prototype.Type = AscDFH.historyitem_MathBase_Shd;
CChangesMathBaseShd.prototype.private_CreateObject = function()
{
	return new CDocumentShd();
};
CChangesMathBaseShd.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetShd(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesMathBaseColor(Class, Old, New)
{
	CChangesMathBaseColor.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseColor, AscDFH.CChangesBaseObjectProperty);
CChangesMathBaseColor.prototype.Type = AscDFH.historyitem_MathBase_Color;
CChangesMathBaseColor.prototype.private_CreateObject = function()
{
	return new CDocumentColor(0, 0, 0, false);
};
CChangesMathBaseColor.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetColor(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesMathBaseUnifill(Class, Old, New)
{
	CChangesMathBaseUnifill.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseUnifill, AscDFH.CChangesBaseObjectProperty);
CChangesMathBaseUnifill.prototype.Type = AscDFH.historyitem_MathBase_Unifill;
CChangesMathBaseUnifill.prototype.private_CreateObject = function()
{
	return new AscFormat.CUniFill();
};
CChangesMathBaseUnifill.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetUnifill(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBaseUnderline(Class, Old, New)
{
	CChangesMathBaseUnderline.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseUnderline, AscDFH.CChangesBaseBoolProperty);
CChangesMathBaseUnderline.prototype.Type = AscDFH.historyitem_MathBase_Underline;
CChangesMathBaseUnderline.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetUnderline(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBaseStrikeout(Class, Old, New)
{
	CChangesMathBaseStrikeout.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseStrikeout, AscDFH.CChangesBaseBoolProperty);
CChangesMathBaseStrikeout.prototype.Type = AscDFH.historyitem_MathBase_Strikeout;
CChangesMathBaseStrikeout.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetStrikeout(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBaseDoubleStrikeout(Class, Old, New)
{
	CChangesMathBaseDoubleStrikeout.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseDoubleStrikeout, AscDFH.CChangesBaseBoolProperty);
CChangesMathBaseDoubleStrikeout.prototype.Type = AscDFH.historyitem_MathBase_DoubleStrikeout;
CChangesMathBaseDoubleStrikeout.prototype.private_SetValue = function(Value)
{
	this.Class.raw_Set_DoubleStrikeout(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBaseItalic(Class, Old, New)
{
	CChangesMathBaseItalic.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseItalic, AscDFH.CChangesBaseBoolProperty);
CChangesMathBaseItalic.prototype.Type = AscDFH.historyitem_MathBase_Italic;
CChangesMathBaseItalic.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetItalic(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBaseBold(Class, Old, New)
{
	CChangesMathBaseBold.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseBold, AscDFH.CChangesBaseBoolProperty);
CChangesMathBaseBold.prototype.Type = AscDFH.historyitem_MathBase_Bold;
CChangesMathBaseBold.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetBold(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesMathBaseRFontsAscii(Class, Old, New)
{
	CChangesMathBaseRFontsAscii.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseRFontsAscii, AscDFH.CChangesBaseProperty);
CChangesMathBaseRFontsAscii.prototype.Type = AscDFH.historyitem_MathBase_RFontsAscii;
CChangesMathBaseRFontsAscii.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetRFontsAscii(Value);
};
CChangesMathBaseRFontsAscii.prototype.WriteToBinary = function(Writer)
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
CChangesMathBaseRFontsAscii.prototype.ReadFromBinary = function(Reader)
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
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesMathBaseRFontsHAnsi(Class, Old, New)
{
	CChangesMathBaseRFontsHAnsi.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseRFontsHAnsi, AscDFH.CChangesBaseProperty);
CChangesMathBaseRFontsHAnsi.prototype.Type = AscDFH.historyitem_MathBase_RFontsHAnsi;
CChangesMathBaseRFontsHAnsi.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetRFontsHAnsi(Value);
};
CChangesMathBaseRFontsHAnsi.prototype.WriteToBinary  = CChangesMathBaseRFontsAscii.prototype.WriteToBinary;
CChangesMathBaseRFontsHAnsi.prototype.ReadFromBinary = CChangesMathBaseRFontsAscii.prototype.ReadFromBinary;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesMathBaseRFontsCS(Class, Old, New)
{
	CChangesMathBaseRFontsCS.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseRFontsCS, AscDFH.CChangesBaseProperty);
CChangesMathBaseRFontsCS.prototype.Type = AscDFH.historyitem_MathBase_RFontsCS;
CChangesMathBaseRFontsCS.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetRFontsCS(Value);
};
CChangesMathBaseRFontsCS.prototype.WriteToBinary  = CChangesMathBaseRFontsAscii.prototype.WriteToBinary;
CChangesMathBaseRFontsCS.prototype.ReadFromBinary = CChangesMathBaseRFontsAscii.prototype.ReadFromBinary;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesMathBaseRFontsEastAsia(Class, Old, New)
{
	CChangesMathBaseRFontsEastAsia.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseRFontsEastAsia, AscDFH.CChangesBaseProperty);
CChangesMathBaseRFontsEastAsia.prototype.Type = AscDFH.historyitem_MathBase_RFontsEastAsia;
CChangesMathBaseRFontsEastAsia.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetRFontsEastAsia(Value);
};
CChangesMathBaseRFontsEastAsia.prototype.WriteToBinary  = CChangesMathBaseRFontsAscii.prototype.WriteToBinary;
CChangesMathBaseRFontsEastAsia.prototype.ReadFromBinary = CChangesMathBaseRFontsAscii.prototype.ReadFromBinary;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathBaseRFontsHint(Class, Old, New)
{
	CChangesMathBaseRFontsHint.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseRFontsHint, AscDFH.CChangesBaseLongProperty);
CChangesMathBaseRFontsHint.prototype.Type = AscDFH.historyitem_MathBase_RFontsHint;
CChangesMathBaseRFontsHint.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetRFontsHint(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesMathBaseHighLight(Class, Old, New)
{
	CChangesMathBaseHighLight.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseHighLight, AscDFH.CChangesBaseProperty);
CChangesMathBaseHighLight.prototype.Type = AscDFH.historyitem_MathBase_HighLight;
CChangesMathBaseHighLight.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetHighLight(Value);
};
CChangesMathBaseHighLight.prototype.WriteToBinary = function(Writer)
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
CChangesMathBaseHighLight.prototype.ReadFromBinary = function(Reader)
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
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesMathBaseReviewType(Class, OldType, OldInfo, NewType, NewInfo)
{
	CChangesMathBaseReviewType.superclass.constructor.call(this, Class, {Type : OldType, Info : OldInfo}, {Type : NewType, Info : NewInfo});
}
AscCommon.extendClass(CChangesMathBaseReviewType, AscDFH.CChangesBaseProperty);
CChangesMathBaseReviewType.prototype.Type = AscDFH.historyitem_MathBase_ReviewType;
CChangesMathBaseReviewType.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetReviewType(Value.Type, Value.Info);
};
CChangesMathBaseReviewType.prototype.WriteToBinary = function(Writer)
{
	// Long : Flags
	// 1-bit : New.Info is undefined?
	// 2-bit : Old.Info is undefined?
	// Long : New.Type
	// CReviewInfo: New.Info (1-bit is zero)
	// Long : Old.Type
	// CReviewInfo: Old.Info (1-bit is zero)

	var nFlags = 0;
	if (undefined === this.New.Info)
		nFlags |= 1;
	if (undefined === this.Old.Info)
		nFlags |= 2;

	Writer.WriteLong(nFlags);
	Writer.WriteLong(this.New.Type);
	if (undefined !== this.New.Info)
		this.New.Info.Write_ToBinary(Writer);
	Writer.WriteLong(this.Old.Type);
	if (undefined !== this.Old.Info)
		this.Old.Info.Write_ToBinary(Writer);
};
CChangesMathBaseReviewType.prototype.ReadFromBinary = function(Reader)
{
	// Long : Flags
	// 1-bit : New.Info is undefined?
	// 2-bit : Old.Info is undefined?
	// Long : New.Type
	// CReviewInfo: New.Info (1-bit is zero)
	// Long : Old.Type
	// CReviewInfo: Old.Info (1-bit is zero)

	var nFlags = Reader.GetLong();

	this.New = {
		Type : Reader.GetLong(),
		Info : undefined
	};

	if (!(nFlags & 1))
	{
		this.New.Info = new CReviewInfo();
		this.New.Info.Read_FromBinary(Reader);
	}

	this.Old = {
		Type : Reader.GetLong(),
		Info : undefined
	};

	if (!(nFlags & 2))
	{
		this.Old.Info = new CReviewInfo();
		this.Old.Info.Read_FromBinary(Reader);
	}
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesMathBaseTextFill(Class, Old, New)
{
	CChangesMathBaseTextFill.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseTextFill, AscDFH.CChangesBaseObjectProperty);
CChangesMathBaseTextFill.prototype.Type = AscDFH.historyitem_MathBase_TextFill;
CChangesMathBaseTextFill.prototype.private_CreateObject = function()
{
	return new AscFormat.CUniFill();
};
CChangesMathBaseTextFill.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetTextFill(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesMathBaseTextOutline(Class, Old, New)
{
	CChangesMathBaseTextOutline.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBaseTextOutline, AscDFH.CChangesBaseObjectProperty);
CChangesMathBaseTextOutline.prototype.Type = AscDFH.historyitem_MathBase_TextOutline;
CChangesMathBaseTextOutline.prototype.private_CreateObject = function()
{
	return new AscFormat.CLn();
};
CChangesMathBaseTextOutline.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetTextOutline(Value);
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathBoxAlnAt(Class, Old, New)
{
	CChangesMathBoxAlnAt.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBoxAlnAt, AscDFH.CChangesBaseLongProperty);
CChangesMathBoxAlnAt.prototype.Type = AscDFH.historyitem_MathBox_AlnAt;
CChangesMathBoxAlnAt.prototype.private_SetValue = function(Value)
{
	this.Class.raw_setAlnAt(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBoxForcedBreak(Class, Old, New)
{
	CChangesMathBoxForcedBreak.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBoxForcedBreak, AscDFH.CChangesBaseBoolProperty);
CChangesMathBoxForcedBreak.prototype.Type = AscDFH.historyitem_MathBox_ForcedBreak;
CChangesMathBoxForcedBreak.prototype.private_SetValue = function(Value)
{
	this.Class.raw_ForcedBreak(Value, this.Class.Pr.Get_AlnAt());
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathFractionType(Class, Old, New)
{
	CChangesMathFractionType.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathFractionType, AscDFH.CChangesBaseLongProperty);
CChangesMathFractionType.prototype.Type = AscDFH.historyitem_MathFraction_Type;
CChangesMathFractionType.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetFractionType(Value);
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathRadicalHideDegree(Class, Old, New)
{
	CChangesMathRadicalHideDegree.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathRadicalHideDegree, AscDFH.CChangesBaseBoolProperty);
CChangesMathRadicalHideDegree.prototype.Type = AscDFH.historyitem_MathRadical_HideDegree;
CChangesMathRadicalHideDegree.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetHideDegree(Value);
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathNaryLimLoc(Class, Old, New)
{
	CChangesMathNaryLimLoc.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathNaryLimLoc, AscDFH.CChangesBaseLongProperty);
CChangesMathNaryLimLoc.prototype.Type = AscDFH.historyitem_MathNary_LimLoc;
CChangesMathNaryLimLoc.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetLimLoc(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathNaryUpperLimit(Class, Old, New)
{
	CChangesMathNaryUpperLimit.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathNaryUpperLimit, AscDFH.CChangesBaseBoolProperty);
CChangesMathNaryUpperLimit.prototype.Type = AscDFH.historyitem_MathNary_UpperLimit;
CChangesMathNaryUpperLimit.prototype.private_SetValue = function(Value)
{
	this.Class.raw_HideUpperIterator(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathNaryLowerLimit(Class, Old, New)
{
	CChangesMathNaryLowerLimit.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathNaryLowerLimit, AscDFH.CChangesBaseBoolProperty);
CChangesMathNaryLowerLimit.prototype.Type = AscDFH.historyitem_MathNary_LowerLimit;
CChangesMathNaryLowerLimit.prototype.private_SetValue = function(Value)
{
	this.Class.raw_HideLowerIterator(Value);
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathDelimBegOper(Class, Old, New)
{
	CChangesMathDelimBegOper.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathDelimBegOper, AscDFH.CChangesBaseLongProperty);
CChangesMathDelimBegOper.prototype.Type = AscDFH.historyitem_MathDelimiter_BegOper;
CChangesMathDelimBegOper.prototype.private_SetValue = function(Value)
{
	this.Class.raw_HideBegOperator(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathDelimEndOper(Class, Old, New)
{
	CChangesMathDelimEndOper.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathDelimEndOper, AscDFH.CChangesBaseLongProperty);
CChangesMathDelimEndOper.prototype.Type = AscDFH.historyitem_MathDelimiter_EndOper;
CChangesMathDelimEndOper.prototype.private_SetValue = function(Value)
{
	this.Class.raw_HideEndOperator(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathDelimiterGrow(Class, Old, New)
{
	CChangesMathDelimiterGrow.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathDelimiterGrow, AscDFH.CChangesBaseBoolProperty);
CChangesMathDelimiterGrow.prototype.Type = AscDFH.historyitem_MathDelimiter_Grow;
CChangesMathDelimiterGrow.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetGrow(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathDelimiterShape(Class, Old, New)
{
	CChangesMathDelimiterShape.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathDelimiterShape, AscDFH.CChangesBaseLongProperty);
CChangesMathDelimiterShape.prototype.Type = AscDFH.historyitem_MathDelimiter_Shape;
CChangesMathDelimiterShape.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetShape(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathDelimiterSetColumn(Class, Old, New)
{
	CChangesMathDelimiterSetColumn.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathDelimiterSetColumn, AscDFH.CChangesBaseLongProperty);
CChangesMathDelimiterSetColumn.prototype.Type = AscDFH.historyitem_MathDelimiter_SetColumn;
CChangesMathDelimiterSetColumn.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetColumn(Value);
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesMathGroupCharPr(Class, Old, New)
{
	CChangesMathGroupCharPr.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathGroupCharPr, AscDFH.CChangesBaseObjectProperty);
CChangesMathGroupCharPr.prototype.Type = AscDFH.historyitem_MathGroupChar_Pr;
CChangesMathGroupCharPr.prototype.private_CreateObject = function()
{
	return new CMathGroupChrPr();
};
CChangesMathGroupCharPr.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetPr(Value);
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathLimitType(Class, Old, New)
{
	CChangesMathLimitType.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathLimitType, AscDFH.CChangesBaseLongProperty);
CChangesMathLimitType.prototype.Type = AscDFH.historyitem_MathLimit_Type;
CChangesMathLimitType.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetType(Value);
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBorderBoxTop(Class, Old, New)
{
	CChangesMathBorderBoxTop.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBorderBoxTop, AscDFH.CChangesBaseBoolProperty);
CChangesMathBorderBoxTop.prototype.Type = AscDFH.historyitem_MathBorderBox_Top;
CChangesMathBorderBoxTop.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetTop(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBorderBoxBot(Class, Old, New)
{
	CChangesMathBorderBoxBot.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBorderBoxBot, AscDFH.CChangesBaseBoolProperty);
CChangesMathBorderBoxBot.prototype.Type = AscDFH.historyitem_MathBorderBox_Bot;
CChangesMathBorderBoxBot.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetBot(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBorderBoxLeft(Class, Old, New)
{
	CChangesMathBorderBoxLeft.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBorderBoxLeft, AscDFH.CChangesBaseBoolProperty);
CChangesMathBorderBoxLeft.prototype.Type = AscDFH.historyitem_MathBorderBox_Left;
CChangesMathBorderBoxLeft.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetLeft(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBorderBoxRight(Class, Old, New)
{
	CChangesMathBorderBoxRight.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBorderBoxRight, AscDFH.CChangesBaseBoolProperty);
CChangesMathBorderBoxRight.prototype.Type = AscDFH.historyitem_MathBorderBox_Right;
CChangesMathBorderBoxRight.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetRight(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBorderBoxHor(Class, Old, New)
{
	CChangesMathBorderBoxHor.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBorderBoxHor, AscDFH.CChangesBaseBoolProperty);
CChangesMathBorderBoxHor.prototype.Type = AscDFH.historyitem_MathBorderBox_Hor;
CChangesMathBorderBoxHor.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetHor(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBorderBoxVer(Class, Old, New)
{
	CChangesMathBorderBoxVer.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBorderBoxVer, AscDFH.CChangesBaseBoolProperty);
CChangesMathBorderBoxVer.prototype.Type = AscDFH.historyitem_MathBorderBox_Ver;
CChangesMathBorderBoxVer.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetVer(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBorderBoxTopLTR(Class, Old, New)
{
	CChangesMathBorderBoxTopLTR.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBorderBoxTopLTR, AscDFH.CChangesBaseBoolProperty);
CChangesMathBorderBoxTopLTR.prototype.Type = AscDFH.historyitem_MathBorderBox_TopLTR;
CChangesMathBorderBoxTopLTR.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetTopLTR(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathBorderBoxTopRTL(Class, Old, New)
{
	CChangesMathBorderBoxTopRTL.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBorderBoxTopRTL, AscDFH.CChangesBaseBoolProperty);
CChangesMathBorderBoxTopRTL.prototype.Type = AscDFH.historyitem_MathBorderBox_TopRTL;
CChangesMathBorderBoxTopRTL.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetTopRTL(Value);
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathBarLinePos(Class, Old, New)
{
	CChangesMathBarLinePos.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathBarLinePos, AscDFH.CChangesBaseLongProperty);
CChangesMathBarLinePos.prototype.Type = AscDFH.historyitem_MathBar_LinePos;
CChangesMathBarLinePos.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetLinePos(Value);
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesMathMatrixAddRow(Class, Pos, Items)
{
	CChangesMathMatrixAddRow.superclass.constructor.call(this, Class);

	this.Pos    = Pos;
	this.Items  = Items;

	this.UseArray = false;
	this.PosArray = [];
}
AscCommon.extendClass(CChangesMathMatrixAddRow, AscDFH.CChangesBase);
CChangesMathMatrixAddRow.prototype.Type = AscDFH.historyitem_MathMatrix_AddRow;
CChangesMathMatrixAddRow.prototype.Undo = function()
{
	this.Class.raw_RemoveRow(this.Pos, this.Items.length);
};
CChangesMathMatrixAddRow.prototype.Redo = function()
{
	this.Class.raw_AddRow(this.Pos, this.Items);
};
CChangesMathMatrixAddRow.prototype.WriteToBinary = function(Writer)
{
	// Long     : Количество элементов
	// Array of :
	//  {
	//    Long     : Позиция
	//    Variable : Id элемента
	//  }

	var bArray = this.UseArray;
	var nCount = this.Items.length;

	Writer.WriteLong(nCount);
	for (var nIndex = 0; nIndex < nCount; ++nIndex)
	{
		if (true === bArray)
			Writer.WriteLong(this.PosArray[nIndex]);
		else
			Writer.WriteLong(this.Pos + nIndex);

		Writer.WriteString2(this.Items[nIndex].Get_Id());
	}
};
CChangesMathMatrixAddRow.prototype.ReadFromBinary = function(Reader)
{
	// Long     : Количество элементов
	// Array of :
	//  {
	//    Long     : Позиция
	//    Variable : Id Элемента
	//  }

	this.UseArray = true;
	this.Items    = [];
	this.PosArray = [];

	var nCount = Reader.GetLong();
	for (var nIndex = 0; nIndex < nCount; ++nIndex)
	{
		this.PosArray[nIndex] = Reader.GetLong();
		this.Items[nIndex]    = AscCommon.g_oTableId.Get_ById(Reader.GetString2());
	}
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesMathMatrixRemoveRow(Class, Pos, Items)
{
	CChangesMathMatrixRemoveRow.superclass.constructor.call(this, Class);

	this.Pos    = Pos;
	this.Items  = Items;

	this.UseArray = false;
	this.PosArray = [];
}
AscCommon.extendClass(CChangesMathMatrixRemoveRow, AscDFH.CChangesBase);
CChangesMathMatrixRemoveRow.prototype.Type = AscDFH.historyitem_MathMatrix_RemoveRow;
CChangesMathMatrixRemoveRow.prototype.Undo = function()
{
	this.Class.raw_AddRow(this.Pos, this.Items);
};
CChangesMathMatrixRemoveRow.prototype.Redo = function()
{
	this.Class.raw_RemoveRow(this.Pos, this.Items.length);
};
CChangesMathMatrixRemoveRow.prototype.WriteToBinary = function(Writer)
{
	// Long          : Количество удаляемых элементов
	// Array of
	// {
	//    Long : позиции удаляемых элементов
	//    String : id удаляемых элементов
	// }

	var bArray = this.UseArray;
	var nCount = this.Items.length;

	var nStartPos = Writer.GetCurPosition();
	Writer.Skip(4);
	var nRealCount = nCount;

	for (var nIndex = 0; nIndex < nCount; ++nIndex)
	{
		if (true === bArray)
		{
			if (false === this.PosArray[nIndex])
			{
				nRealCount--;
			}
			else
			{
				Writer.WriteLong(this.PosArray[nIndex]);
				Writer.WriteString2(this.Items[nIndex]);
			}
		}
		else
		{
			Writer.WriteLong(this.Pos);
			Writer.WriteString2(this.Items[nIndex]);
		}
	}

	var nEndPos = Writer.GetCurPosition();
	Writer.Seek(nStartPos);
	Writer.WriteLong(nRealCount);
	Writer.Seek(nEndPos);
};
CChangesMathMatrixRemoveRow.prototype.ReadFromBinary = function(Reader)
{
	// Long          : Количество удаляемых элементов
	// Array of
	// {
	//    Long : позиции удаляемых элементов
	//    String : id удаляемых элементов
	// }

	this.UseArray = true;
	this.Items    = [];
	this.PosArray = [];

	var nCount = Reader.GetLong();
	for (var nIndex = 0; nIndex < nCount; ++nIndex)
	{
		this.PosArray[nIndex] = Reader.GetLong();
		this.Items[nIndex]    = AscCommon.g_oTableId.Get_ById(Reader.GetString2());
	}
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesMathMatrixAddColumn(Class, Pos, Items)
{
	CChangesMathMatrixAddColumn.superclass.constructor.call(this, Class);

	this.Pos    = Pos;
	this.Items  = Items;

	this.UseArray = false;
	this.PosArray = [];
}
AscCommon.extendClass(CChangesMathMatrixAddColumn, AscDFH.CChangesBase);
CChangesMathMatrixAddColumn.prototype.Type = AscDFH.historyitem_MathMatrix_AddColumn;
CChangesMathMatrixAddColumn.prototype.Undo = function()
{
	this.Class.raw_RemoveColumn(this.Pos, this.Items.length);
};
CChangesMathMatrixAddColumn.prototype.Redo = function()
{
	this.Class.raw_AddColumn(this.Pos, this.Items);
};
CChangesMathMatrixAddColumn.prototype.WriteToBinary  = CChangesMathMatrixAddRow.prototype.WriteToBinary;
CChangesMathMatrixAddColumn.prototype.ReadFromBinary = CChangesMathMatrixAddRow.prototype.ReadFromBinary;
/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesMathMatrixRemoveColumn(Class, Pos, Items)
{
	CChangesMathMatrixRemoveColumn.superclass.constructor.call(this, Class);

	this.Pos    = Pos;
	this.Items  = Items;

	this.UseArray = false;
	this.PosArray = [];
}
AscCommon.extendClass(CChangesMathMatrixRemoveColumn, AscDFH.CChangesBase);
CChangesMathMatrixRemoveColumn.prototype.Type = AscDFH.historyitem_MathMatrix_RemoveColumn;
CChangesMathMatrixRemoveColumn.prototype.Undo = function()
{
	this.Class.raw_AddColumn(this.Pos, this.Items);
};
CChangesMathMatrixRemoveColumn.prototype.Redo = function()
{
	this.Class.raw_RemoveColumn(this.Pos, this.Items.length);
};
CChangesMathMatrixRemoveColumn.prototype.WriteToBinary  = CChangesMathMatrixRemoveRow.prototype.WriteToBinary;
CChangesMathMatrixRemoveColumn.prototype.ReadFromBinary = CChangesMathMatrixRemoveRow.prototype.ReadFromBinary;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathMatrixBaseJc(Class, Old, New)
{
	CChangesMathMatrixBaseJc.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathMatrixBaseJc, AscDFH.CChangesBaseLongProperty);
CChangesMathMatrixBaseJc.prototype.Type = AscDFH.historyitem_MathMatrix_BaseJc;
CChangesMathMatrixBaseJc.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetBaseJc(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesMathMatrixColumnJc(Class, Old, New, ColumnIndex)
{
	CChangesMathMatrixColumnJc.superclass.constructor.call(this, Class, Old, New);

	this.ColumnIndex = ColumnIndex;
}
AscCommon.extendClass(CChangesMathMatrixColumnJc, AscDFH.CChangesBaseProperty);
CChangesMathMatrixColumnJc.prototype.Type = AscDFH.historyitem_MathMatrix_ColumnJc;
CChangesMathMatrixColumnJc.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetColumnJc(Value, this.ColumnIndex);
};
CChangesMathMatrixColumnJc.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Подсвечивать ли данные изменения
	// 2-bit : IsUndefined New
	// 3-bit : IsUndefined Old
	// long : New
	// long : Old
	// long : ColumnIndex

	var nFlags = 0;

	if (false !== this.Color)
		nFlags |= 1;

	if (undefined === this.New)
		nFlags |= 2;

	if (undefined === this.Old)
		nFlags |= 4;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New)
		Writer.WriteLong(this.New);

	if (undefined !== this.Old)
		Writer.WriteLong(this.Old);

	Writer.WriteLong(this.ColumnIndex);
};
CChangesMathMatrixColumnJc.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Подсвечивать ли данные изменения
	// 2-bit : IsUndefined New
	// 3-bit : IsUndefined Old
	// long : New
	// long : Old
	// long : ColumnIndex

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.Color = true;
	else
		this.Color = false;

	if (nFlags & 2)
		this.New = undefined;
	else
		this.New = Reader.GetLong();

	if (nFlags & 4)
		this.Old = undefined;
	else
		this.Old = Reader.GetLong();

	this.ColumnIndex = Reader.GetLong();
};

/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesMathMatrixInterval(Class, ItemType, OldRule, OldGap, NewRule, NewGap)
{
	CChangesMathMatrixInterval.superclass.constructor.call(this, Class, {Rule : OldRule, Gap : OldGap}, {Rule : NewRule, Gap : NewGap});

	this.ItemType = ItemType;
}
AscCommon.extendClass(CChangesMathMatrixInterval, AscDFH.CChangesBaseProperty);
CChangesMathMatrixInterval.prototype.Type = AscDFH.historyitem_MathMatrix_Interval;
CChangesMathMatrixInterval.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetInterval(this.ItemType, Value.Rule, Value.Gap);
};
CChangesMathMatrixInterval.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Is undefined New.Rule?
	// 2-bit : Is undefined New.Gap?
	// 3-bit : Is undefined Old.Rule?
	// 4-bit : Is undefined Old.Gap?
	// long : ItemType
	// long : New.Rule (1bit is zero)
	// long : New.Gap (2bit is zero)
	// long : Old.Rule (3bit is zero)
	// long : Old.Gap (4bit is zero)

	var nFlags = 0;

	if (undefined !== this.New.Rule)
		nFlags |= 1;
	if (undefined !== this.New.Gap)
		nFlags |= 2;
	if (undefined !== this.Old.Rule)
		nFlags |= 4;
	if (undefined !== this.Old.Gap)
		nFlags |= 8;

	Writer.WriteLong(nFlags);
	Writer.WriteLong(this.ItemType);

	if (undefined !== this.New.Rule)
		Writer.WriteLong(this.New.Rule);
	if (undefined !== this.New.Gap)
		Writer.WriteLong(this.New.Gap);

	if (undefined !== this.Old.Rule)
		Writer.WriteLong(this.Old.Rule);
	if (undefined !== this.Old.Gap)
		Writer.WriteLong(this.Old.Gap);
};
CChangesMathMatrixInterval.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Is undefined New.Rule?
	// 2-bit : Is undefined New.Gap?
	// 3-bit : Is undefined Old.Rule?
	// 4-bit : Is undefined Old.Gap?
	// long : ItemType
	// long : New.Rule (1bit is zero)
	// long : New.Gap (2bit is zero)
	// long : Old.Rule (3bit is zero)
	// long : Old.Gap (4bit is zero)

	this.New = {
		Rule : undefined,
		Gap  : undefined
	};

	this.Old = {
		Rule : undefined,
		Gap  : undefined
	};

	var nFlags = Reader.GetLong();
	this.ItemType = Reader.GetLong();

	if (!(nFlags & 1))
		this.New.Rule = Reader.GetLong();

	if (!(nFlags & 2))
		this.New.Gap = Reader.GetLong();

	if (!(nFlags & 4))
		this.Old.Rule = Reader.GetLong();

	if (!(nFlags & 8))
		this.Old.Gap = Reader.GetLong();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesMathMatrixPlh(Class, Old, New)
{
	CChangesMathMatrixPlh.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathMatrixPlh, AscDFH.CChangesBaseBoolProperty);
CChangesMathMatrixPlh.prototype.Type = AscDFH.historyitem_MathMatrix_Plh;
CChangesMathMatrixPlh.prototype.private_SetValue = function(Value)
{
	this.Class.raw_HidePlh(Value);
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesMathDegreeSubSupType(Class, Old, New)
{
	CChangesMathDegreeSubSupType.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesMathDegreeSubSupType, AscDFH.CChangesBaseLongProperty);
CChangesMathDegreeSubSupType.prototype.Type = AscDFH.historyitem_MathDegree_SubSupType;
CChangesMathDegreeSubSupType.prototype.private_SetValue = function(Value)
{
	this.Class.raw_SetType(Value);
};




