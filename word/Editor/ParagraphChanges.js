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
 * Date: 27.10.2016
 * Time: 18:01
 */

AscDFH.changesFactory[AscDFH.historyitem_Paragraph_AddItem]                   = CChangesParagraphAddItem;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_RemoveItem]                = CChangesParagraphRemoveItem;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Numbering]                 = CChangesParagraphNumbering;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Align]                     = CChangesParagraphAlign;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Ind_First]                 = CChangesParagraphIndFirst;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Ind_Right]                 = CChangesParagraphIndRight;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Ind_Left]                  = CChangesParagraphIndLeft;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_ContextualSpacing]         = CChangesParagraphContextualSpacing;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_KeepLines]                 = CChangesParagraphKeepLines;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_KeepNext]                  = CChangesParagraphKeepNext;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_PageBreakBefore]           = CChangesParagraphPageBreakBefore;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Spacing_Line]              = CChangesParagraphSpacingLine;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Spacing_LineRule]          = CChangesParagraphSpacingLineRule;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Spacing_Before]            = CChangesParagraphSpacingBefore;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Spacing_After]             = CChangesParagraphSpacingAfter;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Spacing_AfterAutoSpacing]  = CChangesParagraphSpacingAfterAutoSpacing;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Spacing_BeforeAutoSpacing] = CChangesParagraphSpacingBeforeAutoSpacing;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Shd_Value]                 = CChangesParagraphShdValue;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Shd_Color]                 = CChangesParagraphShdColor;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Shd_Unifill]               = CChangesParagraphShdUnifill;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Shd]                       = CChangesParagraphShd;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_WidowControl]              = CChangesParagraphWidowControl;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Tabs]                      = CChangesParagraphTabs;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_PStyle]                    = CChangesParagraphPStyle;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Borders_Between]           = CChangesParagraphBordersBetween;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Borders_Bottom]            = CChangesParagraphBordersBottom;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Borders_Left]              = CChangesParagraphBordersLeft;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Borders_Right]             = CChangesParagraphBordersRight;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Borders_Top]               = CChangesParagraphBordersTop;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_Pr]                        = CChangesParagraphPr;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_PresentationPr_Bullet]     = CChangesParagraphPresentationPrBullet;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_PresentationPr_Level]      = CChangesParagraphPresentationPrLevel;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_FramePr]                   = CChangesParagraphFramePr;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_SectionPr]                 = CChangesParagraphSectPr;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_PrChange]                  = CChangesParagraphPrChange;
AscDFH.changesFactory[AscDFH.historyitem_Paragraph_PrReviewInfo]              = CChangesParagraphPrReviewInfo;

function private_ParagraphChangesOnLoadPr(oColor)
{
	this.Redo();

	if (oColor)
		this.Class.private_AddCollPrChange(oColor);
}

function private_ParagraphChangesOnSetValue(oParagraph)
{
	oParagraph.RecalcInfo.Set_Type_0(pararecalc_0_All);
	oParagraph.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
}

/**
 * @constructor
 * @extends {AscDFH.CChangesBaseContentChange}
 */
function CChangesParagraphAddItem(Class, Pos, Items)
{
	CChangesParagraphAddItem.superclass.constructor.call(this, Class, Pos, Items, true);
}
AscCommon.extendClass(CChangesParagraphAddItem, AscDFH.CChangesBaseContentChange);
CChangesParagraphAddItem.prototype.Type = AscDFH.historyitem_Paragraph_AddItem;
CChangesParagraphAddItem.prototype.Undo = function()
{
	var oParagraph = this.Class;
	oParagraph.Content.splice(this.Pos, this.Items.length);
	oParagraph.private_UpdateTrackRevisions();
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphAddItem.prototype.Redo = function()
{
	var oParagraph  = this.Class;
	var Array_start = oParagraph.Content.slice(0, this.Pos);
	var Array_end   = oParagraph.Content.slice(this.Pos);

	oParagraph.Content = Array_start.concat(this.Items, Array_end);
	oParagraph.private_UpdateTrackRevisions();
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphAddItem.prototype.private_WriteItem = function(Writer, Item)
{
	Writer.WriteString2(Item.Get_Id());
};
CChangesParagraphAddItem.prototype.private_ReadItem = function(Reader)
{
	return AscCommon.g_oTableId.Get_ById(Reader.GetString2());
};
CChangesParagraphAddItem.prototype.Load = function(Color)
{
	var oParagraph = this.Class;
	for (var nIndex = 0, nCount = this.Items.length; nIndex < nCount; ++nIndex)
	{
		var Pos     = oParagraph.m_oContentChanges.Check(AscCommon.contentchanges_Add, this.PosArray[nIndex]);
		var Element = this.Items[nIndex];

		if (null != Element)
		{
			if (para_Comment === Element.Type)
			{
				var Comment = AscCommon.g_oTableId.Get_ById(Element.CommentId);

				// При копировании не всегда сразу заполняется правильно CommentId
				if (null != Comment && Comment instanceof CComment)
				{
					if (true === Element.Start)
						Comment.Set_StartId(oParagraph.Get_Id());
					else
						Comment.Set_EndId(oParagraph.Get_Id());
				}
			}

			if (Element.Set_Paragraph)
				Element.Set_Paragraph(oParagraph);

			oParagraph.Content.splice(Pos, 0, Element);
			AscCommon.CollaborativeEditing.Update_DocumentPositionsOnAdd(oParagraph, Pos);

			if (Element.Recalc_RunsCompiledPr)
				Element.Recalc_RunsCompiledPr();
		}
	}

	oParagraph.private_ResetSelection();
	oParagraph.private_UpdateTrackRevisions();

	private_ParagraphChangesOnSetValue(this.Class);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseContentChange}
 */
function CChangesParagraphRemoveItem(Class, Pos, Items)
{
	CChangesParagraphRemoveItem.superclass.constructor.call(this, Class, Pos, Items, false);
}
AscCommon.extendClass(CChangesParagraphRemoveItem, AscDFH.CChangesBaseContentChange);
CChangesParagraphRemoveItem.prototype.Type = AscDFH.historyitem_Paragraph_RemoveItem;
CChangesParagraphRemoveItem.prototype.Undo = function()
{
	var oParagraph  = this.Class;
	var Array_start = oParagraph.Content.slice(0, this.Pos);
	var Array_end   = oParagraph.Content.slice(this.Pos);

	oParagraph.Content = Array_start.concat(this.Items, Array_end);
	oParagraph.private_UpdateTrackRevisions();
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphRemoveItem.prototype.Redo = function()
{
	var oParagraph  = this.Class;
	oParagraph.Content.splice(this.Pos, this.Items.length);
	oParagraph.private_UpdateTrackRevisions();
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphRemoveItem.prototype.private_WriteItem = function(Writer, Item)
{
	Writer.WriteString2(Item.Get_Id());
};
CChangesParagraphRemoveItem.prototype.private_ReadItem = function(Reader)
{
	return AscCommon.g_oTableId.Get_ById(Reader.GetString2());
};
CChangesParagraphRemoveItem.prototype.Load = function(Color)
{
	var oParagraph = this.Class;
	for (var nIndex = 0, nCount = this.Items.length; nIndex < nCount; ++nIndex)
	{
		var ChangesPos = oParagraph.m_oContentChanges.Check(AscCommon.contentchanges_Remove, this.PosArray[nIndex]);

		if (false === ChangesPos)
			continue;

		oParagraph.Content.splice(ChangesPos, 1);
		AscCommon.CollaborativeEditing.Update_DocumentPositionsOnRemove(oParagraph, ChangesPos, 1);
	}
	oParagraph.private_ResetSelection();
	oParagraph.private_UpdateTrackRevisions();

	private_ParagraphChangesOnSetValue(this.Class);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphNumbering(Class, Old, New, Color)
{
	CChangesParagraphNumbering.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphNumbering, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphNumbering.prototype.Type = AscDFH.historyitem_Paragraph_Numbering;
CChangesParagraphNumbering.prototype.private_CreateObject = function()
{
	return new CNumPr();
};
CChangesParagraphNumbering.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.NumPr = Value;

	oParagraph.private_RefreshNumbering(oParagraph.Pr.NumPr);
	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);

	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphNumbering.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesParagraphAlign(Class, Old, New, Color)
{
	CChangesParagraphAlign.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphAlign, AscDFH.CChangesBaseLongProperty);
CChangesParagraphAlign.prototype.Type = AscDFH.historyitem_Paragraph_Align;
CChangesParagraphAlign.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.Jc = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphAlign.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseDoubleProperty}
 */
function CChangesParagraphIndFirst(Class, Old, New, Color)
{
	CChangesParagraphIndFirst.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphIndFirst, AscDFH.CChangesBaseDoubleProperty);
CChangesParagraphIndFirst.prototype.Type = AscDFH.historyitem_Paragraph_Ind_First;
CChangesParagraphIndFirst.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;

	if (undefined === oParagraph.Pr.Ind)
		oParagraph.Pr.Ind = new CParaInd();

	oParagraph.Pr.Ind.FirstLine = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphIndFirst.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseDoubleProperty}
 */
function CChangesParagraphIndLeft(Class, Old, New, Color)
{
	CChangesParagraphIndLeft.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphIndLeft, AscDFH.CChangesBaseDoubleProperty);
CChangesParagraphIndLeft.prototype.Type = AscDFH.historyitem_Paragraph_Ind_Left;
CChangesParagraphIndLeft.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;

	if (undefined === oParagraph.Pr.Ind)
		oParagraph.Pr.Ind = new CParaInd();

	oParagraph.Pr.Ind.Left = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphIndLeft.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseDoubleProperty}
 */
function CChangesParagraphIndRight(Class, Old, New, Color)
{
	CChangesParagraphIndRight.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphIndRight, AscDFH.CChangesBaseDoubleProperty);
CChangesParagraphIndRight.prototype.Type = AscDFH.historyitem_Paragraph_Ind_Right;
CChangesParagraphIndRight.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;

	if (undefined === oParagraph.Pr.Ind)
		oParagraph.Pr.Ind = new CParaInd();

	oParagraph.Pr.Ind.Right = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphIndRight.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParagraphContextualSpacing(Class, Old, New, Color)
{
	CChangesParagraphContextualSpacing.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphContextualSpacing, AscDFH.CChangesBaseBoolProperty);
CChangesParagraphContextualSpacing.prototype.Type = AscDFH.historyitem_Paragraph_ContextualSpacing;
CChangesParagraphContextualSpacing.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.ContextualSpacing = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphContextualSpacing.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParagraphKeepLines(Class, Old, New, Color)
{
	CChangesParagraphKeepLines.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphKeepLines, AscDFH.CChangesBaseBoolProperty);
CChangesParagraphKeepLines.prototype.Type = AscDFH.historyitem_Paragraph_KeepLines;
CChangesParagraphKeepLines.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.KeepLines = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphKeepLines.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParagraphKeepNext(Class, Old, New, Color)
{
	CChangesParagraphKeepNext.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphKeepNext, AscDFH.CChangesBaseBoolProperty);
CChangesParagraphKeepNext.prototype.Type = AscDFH.historyitem_Paragraph_KeepNext;
CChangesParagraphKeepNext.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.KeepNext = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphKeepNext.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParagraphPageBreakBefore(Class, Old, New, Color)
{
	CChangesParagraphPageBreakBefore.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphPageBreakBefore, AscDFH.CChangesBaseBoolProperty);
CChangesParagraphPageBreakBefore.prototype.Type = AscDFH.historyitem_Paragraph_PageBreakBefore;
CChangesParagraphPageBreakBefore.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.PageBreakBefore = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphPageBreakBefore.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseDoubleProperty}
 */
function CChangesParagraphSpacingLine(Class, Old, New, Color)
{
	CChangesParagraphSpacingLine.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphSpacingLine, AscDFH.CChangesBaseDoubleProperty);
CChangesParagraphSpacingLine.prototype.Type = AscDFH.historyitem_Paragraph_Spacing_Line;
CChangesParagraphSpacingLine.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;

	if (undefined === oParagraph.Pr.Spacing)
		oParagraph.Pr.Spacing = new CParaSpacing();

	oParagraph.Pr.Spacing.Line = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphSpacingLine.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesParagraphSpacingLineRule(Class, Old, New, Color)
{
	CChangesParagraphSpacingLineRule.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphSpacingLineRule, AscDFH.CChangesBaseLongProperty);
CChangesParagraphSpacingLineRule.prototype.Type = AscDFH.historyitem_Paragraph_Spacing_LineRule;
CChangesParagraphSpacingLineRule.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;

	if (undefined === oParagraph.Pr.Spacing)
		oParagraph.Pr.Spacing = new CParaSpacing();

	oParagraph.Pr.Spacing.LineRule = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphSpacingLineRule.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseDoubleProperty}
 */
function CChangesParagraphSpacingBefore(Class, Old, New, Color)
{
	CChangesParagraphSpacingBefore.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphSpacingBefore, AscDFH.CChangesBaseDoubleProperty);
CChangesParagraphSpacingBefore.prototype.Type = AscDFH.historyitem_Paragraph_Spacing_Before;
CChangesParagraphSpacingBefore.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;

	if (undefined === oParagraph.Pr.Spacing)
		oParagraph.Pr.Spacing = new CParaSpacing();

	oParagraph.Pr.Spacing.Before = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphSpacingBefore.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseDoubleProperty}
 */
function CChangesParagraphSpacingAfter(Class, Old, New, Color)
{
	CChangesParagraphSpacingAfter.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphSpacingAfter, AscDFH.CChangesBaseDoubleProperty);
CChangesParagraphSpacingAfter.prototype.Type = AscDFH.historyitem_Paragraph_Spacing_After;
CChangesParagraphSpacingAfter.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;

	if (undefined === oParagraph.Pr.Spacing)
		oParagraph.Pr.Spacing = new CParaSpacing();

	oParagraph.Pr.Spacing.After = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphSpacingAfter.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParagraphSpacingAfterAutoSpacing(Class, Old, New, Color)
{
	CChangesParagraphSpacingAfterAutoSpacing.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphSpacingAfterAutoSpacing, AscDFH.CChangesBaseBoolProperty);
CChangesParagraphSpacingAfterAutoSpacing.prototype.Type = AscDFH.historyitem_Paragraph_Spacing_AfterAutoSpacing;
CChangesParagraphSpacingAfterAutoSpacing.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;

	if (undefined === oParagraph.Pr.Spacing)
		oParagraph.Pr.Spacing = new CParaSpacing();

	oParagraph.Pr.Spacing.AfterAutoSpacing = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphSpacingAfterAutoSpacing.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParagraphSpacingBeforeAutoSpacing(Class, Old, New, Color)
{
	CChangesParagraphSpacingBeforeAutoSpacing.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphSpacingBeforeAutoSpacing, AscDFH.CChangesBaseBoolProperty);
CChangesParagraphSpacingBeforeAutoSpacing.prototype.Type = AscDFH.historyitem_Paragraph_Spacing_BeforeAutoSpacing;
CChangesParagraphSpacingBeforeAutoSpacing.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;

	if (undefined === oParagraph.Pr.Spacing)
		oParagraph.Pr.Spacing = new CParaSpacing();

	oParagraph.Pr.Spacing.BeforeAutoSpacing = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphSpacingBeforeAutoSpacing.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseByteProperty}
 */
function CChangesParagraphShdValue(Class, Old, New, Color)
{
	CChangesParagraphShdValue.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphShdValue, AscDFH.CChangesBaseByteProperty);
CChangesParagraphShdValue.prototype.Type = AscDFH.historyitem_Paragraph_Shd_Value;
CChangesParagraphShdValue.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;

	if (undefined === oParagraph.Pr.Shd)
		oParagraph.Pr.Shd = new CDocumentShd();

	oParagraph.Pr.Shd.Value = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphShdValue.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphShdColor(Class, Old, New, Color)
{
	CChangesParagraphShdColor.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphShdColor, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphShdColor.prototype.Type = AscDFH.historyitem_Paragraph_Shd_Color;
CChangesParagraphShdColor.prototype.private_CreateObject = function()
{
	return new CDocumentColor(0, 0, 0);
};
CChangesParagraphShdColor.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;

	if (undefined === oParagraph.Pr.Shd)
		oParagraph.Pr.Shd = new CDocumentShd();

	oParagraph.Pr.Shd.Color = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphShdColor.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphShdUnifill(Class, Old, New, Color)
{
	CChangesParagraphShdUnifill.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphShdUnifill, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphShdUnifill.prototype.Type = AscDFH.historyitem_Paragraph_Shd_Unifill;
CChangesParagraphShdUnifill.prototype.private_CreateObject = function()
{
	return new AscFormat.CUniFill();
};
CChangesParagraphShdUnifill.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;

	if (undefined === oParagraph.Pr.Shd)
		oParagraph.Pr.Shd = new CDocumentShd();

	oParagraph.Pr.Shd.Unifill = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphShdUnifill.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphShd(Class, Old, New, Color)
{
	CChangesParagraphShd.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphShd, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphShd.prototype.Type = AscDFH.historyitem_Paragraph_Shd;
CChangesParagraphShd.prototype.private_CreateObject = function()
{
	return new CDocumentShd();
};
CChangesParagraphShd.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.Shd = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphShd.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesParagraphWidowControl(Class, Old, New, Color)
{
	CChangesParagraphWidowControl.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphWidowControl, AscDFH.CChangesBaseBoolProperty);
CChangesParagraphWidowControl.prototype.Type = AscDFH.historyitem_Paragraph_WidowControl;
CChangesParagraphWidowControl.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.WidowControl = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphWidowControl.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphTabs(Class, Old, New, Color)
{
	CChangesParagraphTabs.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphTabs, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphTabs.prototype.Type = AscDFH.historyitem_Paragraph_Tabs;
CChangesParagraphTabs.prototype.private_CreateObject = function()
{
	return new CParaTabs();
};
CChangesParagraphTabs.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.Tabs = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphTabs.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseStringProperty}
 */
function CChangesParagraphPStyle(Class, Old, New, Color)
{
	CChangesParagraphPStyle.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphPStyle, AscDFH.CChangesBaseStringProperty);
CChangesParagraphPStyle.prototype.Type = AscDFH.historyitem_Paragraph_PStyle;
CChangesParagraphPStyle.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.PStyle = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphPStyle.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphBordersBetween(Class, Old, New, Color)
{
	CChangesParagraphBordersBetween.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphBordersBetween, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphBordersBetween.prototype.Type = AscDFH.historyitem_Paragraph_Borders_Between;
CChangesParagraphBordersBetween.prototype.private_CreateObject = function()
{
	return new CDocumentBorder();
};
CChangesParagraphBordersBetween.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.Brd.Between = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphBordersBetween.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphBordersBottom(Class, Old, New, Color)
{
	CChangesParagraphBordersBottom.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphBordersBottom, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphBordersBottom.prototype.Type = AscDFH.historyitem_Paragraph_Borders_Bottom;
CChangesParagraphBordersBottom.prototype.private_CreateObject = function()
{
	return new CDocumentBorder();
};
CChangesParagraphBordersBottom.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.Brd.Bottom = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphBordersBottom.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphBordersLeft(Class, Old, New, Color)
{
	CChangesParagraphBordersLeft.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphBordersLeft, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphBordersLeft.prototype.Type = AscDFH.historyitem_Paragraph_Borders_Left;
CChangesParagraphBordersLeft.prototype.private_CreateObject = function()
{
	return new CDocumentBorder();
};
CChangesParagraphBordersLeft.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.Brd.Left = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphBordersLeft.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphBordersRight(Class, Old, New, Color)
{
	CChangesParagraphBordersRight.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphBordersRight, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphBordersRight.prototype.Type = AscDFH.historyitem_Paragraph_Borders_Right;
CChangesParagraphBordersRight.prototype.private_CreateObject = function()
{
	return new CDocumentBorder();
};
CChangesParagraphBordersRight.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.Brd.Right = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphBordersRight.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphBordersTop(Class, Old, New, Color)
{
	CChangesParagraphBordersTop.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphBordersTop, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphBordersTop.prototype.Type = AscDFH.historyitem_Paragraph_Borders_Top;
CChangesParagraphBordersTop.prototype.private_CreateObject = function()
{
	return new CDocumentBorder();
};
CChangesParagraphBordersTop.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.Brd.Top = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphBordersTop.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphPr(Class, Old, New, Color)
{
	CChangesParagraphPr.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphPr, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphPr.prototype.Type = AscDFH.historyitem_Paragraph_Pr;
CChangesParagraphPr.prototype.private_CreateObject = function()
{
	return new CParaPr();
};
CChangesParagraphPr.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr = Value;

	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphPr.prototype.private_IsCreateEmptyObject = function()
{
	return true;
};
CChangesParagraphPr.prototype.Load = private_ParagraphChangesOnLoadPr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphPresentationPrBullet(Class, Old, New, Color)
{
	CChangesParagraphPresentationPrBullet.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphPresentationPrLevel, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphPresentationPrBullet.prototype.Type = AscDFH.historyitem_Paragraph_PresentationPr_Bullet;
CChangesParagraphPresentationPrBullet.prototype.private_CreateObject = function()
{
	return new AscFormat.CBullet();
};
CChangesParagraphPresentationPrBullet.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.Bullet = Value;
	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.Recalc_RunsCompiledPr();
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesParagraphPresentationPrLevel(Class, Old, New, Color)
{
	CChangesParagraphPresentationPrLevel.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphPresentationPrLevel, AscDFH.CChangesBaseLongProperty);
CChangesParagraphPresentationPrLevel.prototype.Type = AscDFH.historyitem_Paragraph_PresentationPr_Level;
CChangesParagraphPresentationPrLevel.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.Lvl = Value;
	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.Recalc_RunsCompiledPr();
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphFramePr(Class, Old, New, Color)
{
	CChangesParagraphFramePr.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphFramePr, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphFramePr.prototype.Type = AscDFH.historyitem_Paragraph_FramePr;
CChangesParagraphFramePr.prototype.private_CreateObject = function()
{
	return new CFramePr();
};
CChangesParagraphFramePr.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.FramePr = Value;
	oParagraph.CompiledPr.NeedRecalc = true;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesParagraphSectPr(Class, Old, New)
{
	CChangesParagraphSectPr.superclass.constructor.call(this, Class);

	this.Old = Old;
	this.New = New;
}
AscCommon.extendClass(CChangesParagraphSectPr, AscDFH.CChangesBase);
CChangesParagraphSectPr.prototype.Type = AscDFH.historyitem_Paragraph_SectionPr;
CChangesParagraphSectPr.prototype.Undo = function()
{
	var oParagraph = this.Class;
	oParagraph.SectPr = this.Old;
	oParagraph.LogicDocument.Update_SectionsInfo();
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphSectPr.prototype.Redo = function()
{
	var oParagraph = this.Class;
	oParagraph.SectPr = this.New;
	oParagraph.LogicDocument.Update_SectionsInfo();
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphSectPr.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : IsUndefined New
	// 2-bit : IsUndefined Old
	// String : Id of New
	// String : Id of Old

	var nFlags = 0;

	if (undefined === this.New)
		nFlags |= 1;

	if (undefined === this.Old)
		nFlags |= 2;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New)
		Writer.WriteString2(this.New.Get_Id());

	if (undefined !== this.Old)
		Writer.WriteString2(this.Old.Get_Id());
};
CChangesParagraphSectPr.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : IsUndefined New
	// 2-bit : IsUndefined Old
	// String : Id of New
	// String : Id of Old

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.New = AscCommon.g_oTableId.Get_ById(Reader.GetString2());
	else
		this.New = undefined;

	if (nFlags & 2)
		this.Old = AscCommon.g_oTableId.Get_ById(Reader.GetString2());
	else
		this.Old = undefined;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBase}
 */
function CChangesParagraphPrChange(Class, Old, New)
{
	CChangesParagraphPrChange.superclass.constructor.call(this, Class);

	this.Old = Old;
	this.New = New;
}
AscCommon.extendClass(CChangesParagraphPrChange, AscDFH.CChangesBase);
CChangesParagraphPrChange.prototype.Type = AscDFH.historyitem_Paragraph_PrChange;
CChangesParagraphPrChange.prototype.Undo = function()
{
	var oParagraph = this.Class;
	oParagraph.Pr.PrChange   = this.Old.PrChange;
	oParagraph.Pr.ReviewInfo = this.Old.ReviewInfo;
	oParagraph.private_UpdateTrackRevisions();
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphPrChange.prototype.Redo = function()
{
	var oParagraph = this.Class;
	oParagraph.Pr.PrChange   = this.New.PrChange;
	oParagraph.Pr.ReviewInfo = this.New.ReviewInfo;
	oParagraph.private_UpdateTrackRevisions();
	private_ParagraphChangesOnSetValue(this.Class);
};
CChangesParagraphPrChange.prototype.WriteToBinary = function(Writer)
{
	// Long : Flags
	// 1-bit : is New.PrChange undefined ?
	// 2-bit : is New.ReviewInfo undefined ?
	// 3-bit : is Old.PrChange undefined ?
	// 4-bit : is Old.ReviewInfo undefined ?
	// Variable(CParaPr)     : New.PrChange   (1bit = 0)
	// Variable(CReviewInfo) : New.ReviewInfo (2bit = 0)
	// Variable(CParaPr)     : Old.PrChange   (3bit = 0)
	// Variable(CReviewInfo) : Old.ReviewInfo (4bit = 0)
	var nFlags = 0;
	if (undefined === this.New.PrChange)
		nFlags |= 1;

	if (undefined === this.New.ReviewInfo)
		nFlags |= 2;

	if (undefined === this.Old.PrChange)
		nFlags |= 4;

	if (undefined === this.Old.ReviewInfo)
		nFlags |= 8;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New.PrChange)
		this.New.PrChange.Write_ToBinary(Writer);

	if (undefined !== this.New.ReviewInfo)
		this.New.ReviewInfo.Write_ToBinary(Writer);

	if (undefined !== this.Old.PrChange)
		this.Old.PrChange.Write_ToBinary(Writer);

	if (undefined !== this.Old.ReviewInfo)
		this.Old.ReviewInfo.Write_ToBinary(Writer);
};
CChangesParagraphPrChange.prototype.ReadFromBinary = function(Reader)
{
	// Long : Flags
	// 1-bit : is New.PrChange undefined ?
	// 2-bit : is New.ReviewInfo undefined ?
	// 3-bit : is Old.PrChange undefined ?
	// 4-bit : is Old.ReviewInfo undefined ?
	// Variable(CParaPr)     : New.PrChange   (1bit = 0)
	// Variable(CReviewInfo) : New.ReviewInfo (2bit = 0)
	// Variable(CParaPr)     : Old.PrChange   (3bit = 0)
	// Variable(CReviewInfo) : Old.ReviewInfo (4bit = 0)
	var nFlags = Reader.GetLong();

	if (nFlags & 1)
	{
		this.New.PrChange = undefined;
	}
	else
	{
		this.New.PrChange = new CParaPr();
		this.New.PrChange.Read_FromBinary(Reader);
	}

	if (nFlags & 2)
	{
		this.New.ReviewInfo = undefined;
	}
	else
	{
		this.New.ReviewInfo = new CReviewInfo();
		this.New.ReviewInfo.Read_FromBinary(Reader);
	}

	if (nFlags & 4)
	{
		this.Old.PrChange = undefined;
	}
	else
	{
		this.Old.PrChange = new CParaPr();
		this.Old.PrChange.Read_FromBinary(Reader);
	}

	if (nFlags & 8)
	{
		this.Old.ReviewInfo = undefined;
	}
	else
	{
		this.Old.ReviewInfo = new CReviewInfo();
		this.Old.ReviewInfo.Read_FromBinary(Reader);
	}
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesParagraphPrReviewInfo(Class, Old, New, Color)
{
	CChangesParagraphPrReviewInfo.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParagraphPrReviewInfo, AscDFH.CChangesBaseObjectProperty);
CChangesParagraphPrReviewInfo.prototype.Type = AscDFH.historyitem_Paragraph_PrReviewInfo;
CChangesParagraphPrReviewInfo.prototype.private_CreateObject = function()
{
	return new CReviewInfo();
};
CChangesParagraphPrReviewInfo.prototype.private_SetValue = function(Value)
{
	var oParagraph = this.Class;
	oParagraph.Pr.ReviewInfo = Value;
	oParagraph.private_UpdateTrackRevisionOnChangeParaPr(false);
	private_ParagraphChangesOnSetValue(this.Class);
};