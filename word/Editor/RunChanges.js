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
 * Date: 21.10.2016
 * Time: 12:56
 */

// window['AscDFH'].historyitem_ParaRun_FontFamily        = window['AscDFH'].historyitem_type_ParaRun | 7;
// window['AscDFH'].historyitem_ParaRun_FontSize          = window['AscDFH'].historyitem_type_ParaRun | 8;
// window['AscDFH'].historyitem_ParaRun_Color             = window['AscDFH'].historyitem_type_ParaRun | 9;
// window['AscDFH'].historyitem_ParaRun_VertAlign         = window['AscDFH'].historyitem_type_ParaRun | 10;
// window['AscDFH'].historyitem_ParaRun_HighLight         = window['AscDFH'].historyitem_type_ParaRun | 11;
// window['AscDFH'].historyitem_ParaRun_RStyle            = window['AscDFH'].historyitem_type_ParaRun | 12;
// window['AscDFH'].historyitem_ParaRun_Spacing           = window['AscDFH'].historyitem_type_ParaRun | 13;
// window['AscDFH'].historyitem_ParaRun_DStrikeout        = window['AscDFH'].historyitem_type_ParaRun | 14;
// window['AscDFH'].historyitem_ParaRun_Caps              = window['AscDFH'].historyitem_type_ParaRun | 15;
// window['AscDFH'].historyitem_ParaRun_SmallCaps         = window['AscDFH'].historyitem_type_ParaRun | 16;
// window['AscDFH'].historyitem_ParaRun_Position          = window['AscDFH'].historyitem_type_ParaRun | 17;
// window['AscDFH'].historyitem_ParaRun_Value             = window['AscDFH'].historyitem_type_ParaRun | 18;
// window['AscDFH'].historyitem_ParaRun_RFonts            = window['AscDFH'].historyitem_type_ParaRun | 19;
// window['AscDFH'].historyitem_ParaRun_Lang              = window['AscDFH'].historyitem_type_ParaRun | 20;
// window['AscDFH'].historyitem_ParaRun_RFonts_Ascii      = window['AscDFH'].historyitem_type_ParaRun | 21;
// window['AscDFH'].historyitem_ParaRun_RFonts_HAnsi      = window['AscDFH'].historyitem_type_ParaRun | 22;
// window['AscDFH'].historyitem_ParaRun_RFonts_CS         = window['AscDFH'].historyitem_type_ParaRun | 23;
// window['AscDFH'].historyitem_ParaRun_RFonts_EastAsia   = window['AscDFH'].historyitem_type_ParaRun | 24;
// window['AscDFH'].historyitem_ParaRun_RFonts_Hint       = window['AscDFH'].historyitem_type_ParaRun | 25;
// window['AscDFH'].historyitem_ParaRun_Lang_Bidi         = window['AscDFH'].historyitem_type_ParaRun | 26;
// window['AscDFH'].historyitem_ParaRun_Lang_EastAsia     = window['AscDFH'].historyitem_type_ParaRun | 27;
// window['AscDFH'].historyitem_ParaRun_Lang_Val          = window['AscDFH'].historyitem_type_ParaRun | 28;
// window['AscDFH'].historyitem_ParaRun_TextPr            = window['AscDFH'].historyitem_type_ParaRun | 29;
// window['AscDFH'].historyitem_ParaRun_Unifill           = window['AscDFH'].historyitem_type_ParaRun | 30;
// window['AscDFH'].historyitem_ParaRun_Shd               = window['AscDFH'].historyitem_type_ParaRun | 31;
// window['AscDFH'].historyitem_ParaRun_MathStyle         = window['AscDFH'].historyitem_type_ParaRun | 32;
// window['AscDFH'].historyitem_ParaRun_MathPrp           = window['AscDFH'].historyitem_type_ParaRun | 33;
// window['AscDFH'].historyitem_ParaRun_ReviewType        = window['AscDFH'].historyitem_type_ParaRun | 34;
// window['AscDFH'].historyitem_ParaRun_PrChange          = window['AscDFH'].historyitem_type_ParaRun | 35;
// window['AscDFH'].historyitem_ParaRun_TextFill          = window['AscDFH'].historyitem_type_ParaRun | 36;
// window['AscDFH'].historyitem_ParaRun_TextOutline       = window['AscDFH'].historyitem_type_ParaRun | 37;
// window['AscDFH'].historyitem_ParaRun_PrReviewInfo      = window['AscDFH'].historyitem_type_ParaRun | 38;
// window['AscDFH'].historyitem_ParaRun_ContentReviewInfo = window['AscDFH'].historyitem_type_ParaRun | 39;
// window['AscDFH'].historyitem_ParaRun_OnStartSplit      = window['AscDFH'].historyitem_type_ParaRun | 40;
// window['AscDFH'].historyitem_ParaRun_OnEndSplit        = window['AscDFH'].historyitem_type_ParaRun | 41;
// window['AscDFH'].historyitem_ParaRun_MathAlnAt         = window['AscDFH'].historyitem_type_ParaRun | 42;
// window['AscDFH'].historyitem_ParaRun_MathForcedBreak   = window['AscDFH'].historyitem_type_ParaRun | 43;

/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesRunAddItem(Class, Pos, Items, EndPos)
{
	CChangesRunAddItem.superclass.constructor.call(this, Class);

	this.Pos    = Pos;
	this.Items  = Items;
	this.EndPos = EndPos;

	this.Color    = undefined;
	this.UseArray = false;
	this.PosArray = [];
}
AscCommon.extendClass(AscDFH.CChangesBase, CChangesRunAddItem);
CChangesRunAddItem.prototype.Type = AscDFH.historyitem_ParaRun_AddItem;
CChangesRunAddItem.prototype.Undo = function()
{
	var oRun = this.Class;

	oRun.Content.splice(this.Pos, this.EndPos - this.Pos + 1);

	oRun.RecalcInfo.Measure = true;
	oRun.protected_UpdateSpellChecking();
	oRun.private_UpdateTrackRevisionOnChangeContent(false);
};
CChangesRunAddItem.prototype.Redo = function()
{
	var oRun = this.Class;

	var Array_start = oRun.Content.slice(0, this.Pos);
	var Array_end   = oRun.Content.slice(this.Pos);

	oRun.Content = Array_start.concat(this.Items, Array_end);

	oRun.RecalcInfo.Measure = true;
	oRun.protected_UpdateSpellChecking();
	oRun.private_UpdateTrackRevisionOnChangeContent(false);
};
CChangesRunAddItem.prototype.WriteToBinary = function(Writer)
{
	// Bool     : Подсвечивать ли данные изменения
	// Long     : Количество элементов
	// Array of :
	//  {
	//    Long     : Позиция
	//    Variable : Элемент
	//  }

	var bArray = this.UseArray;
	var Count  = this.Items.length;

	if (false === this.Color)
		Writer.WriteBool(false);
	else
		Writer.WriteBool(true);

	Writer.WriteLong(Count);

	for (var Index = 0; Index < Count; Index++)
	{
		if (true === bArray)
			Writer.WriteLong(this.PosArray[Index]);
		else
			Writer.WriteLong(this.Pos + Index);

		this.Items[Index].Write_ToBinary(Writer);
	}
};
CChangesRunAddItem.prototype.ReadFromBinary = function(Reader)
{
	// Bool     : Подсвечивать ли данные изменения
	// Long     : Количество элементов
	// Array of :
	//  {
	//    Long     : Позиция
	//    Variable : Id Элемента
	//  }

	this.UseArray = true;
	this.PosArray = [];
	this.Items    = [];

	this.Color = Reader.GetBool();
	var Count  = Reader.GetLong();
	for (var Index = 0; Index < Count; Index++)
	{
		this.PosArray[Index] = Reader.GetLong();
		this.Items[Index]    = ParagraphContent_Read_FromBinary(Reader);
	}
};
CChangesRunAddItem.prototype.Load = function(Color)
{
	var oRun = this.Class;
	for (var Index = 0, Count = this.Items.length; Index < Count; Index++)
	{
		var Pos = oRun.m_oContentChanges.Check(AscCommon.contentchanges_Add, this.PosArray[Index]);
		var Element = this.Items[Index];
		if (null != Element)
		{
			if (true === this.Color && null !== Color)
			{
				oRun.CollaborativeMarks.Update_OnAdd(Pos);
				oRun.CollaborativeMarks.Add(Pos, Pos + 1, Color);
				AscCommon.CollaborativeEditing.Add_ChangedClass(this);
			}

			oRun.Content.splice(Pos, 0, Element);
			oRun.private_UpdatePositionsOnAdd(Pos);
			oRun.private_UpdateCompositeInputPositionsOnAdd(Pos);
			AscCommon.CollaborativeEditing.Update_DocumentPositionsOnAdd(this, Pos);
		}
	}

	oRun.RecalcInfo.Measure = true;
	oRun.protected_UpdateSpellChecking();
	oRun.private_UpdateTrackRevisionOnChangeContent(false);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesRunRemoveItem(Class, Pos, Items, EndPos)
{
	CChangesRunRemoveItem.superclass.constructor.call(this, Class);

	this.Pos    = Pos;
	this.Items  = Items;
	this.EndPos = EndPos;

	this.UseArray = false;
	this.PosArray = [];
}
AscCommon.extendClass(AscDFH.CChangesBase, CChangesRunRemoveItem);
CChangesRunRemoveItem.prototype.Type = AscDFH.historyitem_ParaRun_RemoveItem;
CChangesRunRemoveItem.prototype.Undo = function()
{
	var oRun = this.Class;

	var Array_start = oRun.Content.slice(0, this.Pos);
	var Array_end   = oRun.Content.slice(this.Pos);

	oRun.Content = Array_start.concat(this.Items, Array_end);

	oRun.RecalcInfo.Measure = true;
	oRun.protected_UpdateSpellChecking();
	oRun.private_UpdateTrackRevisionOnChangeContent(false);
};
CChangesRunRemoveItem.prototype.Redo = function()
{
	oRun.Content.splice(this.Pos, this.EndPos - this.Pos + 1);

	oRun.RecalcInfo.Measure = true;
	oRun.protected_UpdateSpellChecking();
	oRun.private_UpdateTrackRevisionOnChangeContent(false);
};
CChangesRunRemoveItem.prototype.WriteToBinary = function(Writer)
{
	// Long     : Количество элементов
	// Array of :
	//  {
	//    Long     : Позиция
	//    Variable : Элемент
	//  }

	var bArray = this.UseArray;
	var Count  = this.Items.length;

	var StartPos = Writer.GetCurPosition();
	Writer.Skip(4);

	var RealCount = Count;
	for (var Index = 0; Index < Count; Index++)
	{
		if (true === bArray)
		{
			if (false === this.PosArray[Index])
			{
				RealCount--;
			}
			else
			{
				Writer.WriteLong(this.PosArray[Index]);
				this.Items[Index].Write_ToBinary(Writer);
			}
		}
		else
		{
			Writer.WriteLong(this.Pos);
			this.Items[Index].Write_ToBinary(Writer);
		}
	}

	var EndPos = Writer.GetCurPosition();
	Writer.Seek(StartPos);
	Writer.WriteLong(RealCount);
	Writer.Seek(EndPos);
};
CChangesRunRemoveItem.prototype.ReadFromBinary = function(Reader)
{
	// Long     : Количество элементов
	// Array of :
	//  {
	//    Long     : Позиция
	//    Variable : Элемент
	//  }


	this.UseArray = true;
	this.PosArray = [];
	this.Items    = [];

	var Count  = Reader.GetLong();
	for (var Index = 0; Index < Count; Index++)
	{
		this.PosArray[Index] = Reader.GetLong();
		this.Items[Index]    = ParagraphContent_Read_FromBinary(Reader);
	}
};
CChangesRunRemoveItem.prototype.Load = function()
{
	var oRun = this.Class;

	for (var Index = 0; Index < Count; Index++)
	{
		var ChangesPos = oRun.m_oContentChanges.Check(AscCommon.contentchanges_Remove, this.PosArray[Index]);

		// действие совпало, не делаем его
		if (false === ChangesPos)
			continue;

		oRun.CollaborativeMarks.Update_OnRemove(ChangesPos, 1);
		oRun.Content.splice(ChangesPos, 1);
		oRun.private_UpdatePositionsOnRemove(ChangesPos, 1);
		oRun.private_UpdateCompositeInputPositionsOnRemove(ChangesPos, 1);
		AscCommon.CollaborativeEditing.Update_DocumentPositionsOnRemove(this, ChangesPos, 1);
	}

	oRun.RecalcInfo.Measure = true;
	oRun.protected_UpdateSpellChecking();
	oRun.private_UpdateTrackRevisionOnChangeContent(false);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesRunBold(Class, Old, New)
{
	CChangesRunBold.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(AscDFH.CChangesBaseBoolProperty, CChangesRunBold);
CChangesRunBold.Type = AscDFH.historyitem_ParaRun_Bold;
CChangesRunBold.prototype.private_SetValue = function(Value)
{
	var oRun = this.Class;
	oRun.Pr.Bold = Value;

	oRun.Recalc_CompiledPr(true);
	oRun.private_UpdateTrackRevisionOnChangeTextPr(false);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesRunItalic(Class, Old, New)
{
	CChangesRunItalic.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(AscDFH.CChangesBaseBoolProperty, CChangesRunItalic);
CChangesRunItalic.Type = AscDFH.historyitem_ParaRun_Italic;
CChangesRunItalic.prototype.private_SetValue = function(Value)
{
	var oRun = this.Class;
	oRun.Pr.Italic = Value;

	oRun.Recalc_CompiledPr(true);
	oRun.private_UpdateTrackRevisionOnChangeTextPr(false);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesRunStrikeout(Class, Old, New)
{
	CChangesRunStrikeout.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(AscDFH.CChangesBaseBoolProperty, CChangesRunStrikeout);
CChangesRunStrikeout.Type = AscDFH.historyitem_ParaRun_Strikeout;
CChangesRunStrikeout.prototype.private_SetValue = function(Value)
{
	var oRun = this.Class;
	oRun.Pr.Strikeout = Value;

	oRun.Recalc_CompiledPr(true);
	oRun.private_UpdateTrackRevisionOnChangeTextPr(false);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesRunUnderline(Class, Old, New)
{
	CChangesRunUnderline.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(AscDFH.CChangesBaseBoolProperty, CChangesRunUnderline);
CChangesRunUnderline.Type = AscDFH.historyitem_ParaRun_Underline;
CChangesRunUnderline.prototype.private_SetValue = function(Value)
{
	var oRun = this.Class;
	oRun.Pr.Underline = Value;

	oRun.Recalc_CompiledPr(true);
	oRun.private_UpdateTrackRevisionOnChangeTextPr(false);
};

