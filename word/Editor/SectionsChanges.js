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
 * Date: 10.11.2016
 * Time: 14:24
 */


AscDFH.changesFactory[AscDFH.historyitem_Section_PageSize_Orient]     = CChangesSectionPageOrient;
AscDFH.changesFactory[AscDFH.historyitem_Section_PageSize_Size]       = CChangesSectionPageSize;
AscDFH.changesFactory[AscDFH.historyitem_Section_PageMargins]         = CChangesSectionPageMargins;
AscDFH.changesFactory[AscDFH.historyitem_Section_Type]                = CChangesSectionType;
AscDFH.changesFactory[AscDFH.historyitem_Section_Borders_Left]        = CChangesSectionBordersLeft;
AscDFH.changesFactory[AscDFH.historyitem_Section_Borders_Top]         = CChangesSectionBordersTop;
AscDFH.changesFactory[AscDFH.historyitem_Section_Borders_Right]       = CChangesSectionBordersRight;
AscDFH.changesFactory[AscDFH.historyitem_Section_Borders_Bottom]      = CChangesSectionBordersBottom;
AscDFH.changesFactory[AscDFH.historyitem_Section_Borders_Display]     = CChangesSectionBordersDisplay;
AscDFH.changesFactory[AscDFH.historyitem_Section_Borders_OffsetFrom]  = CChangesSectionBordersOffsetFrom;
AscDFH.changesFactory[AscDFH.historyitem_Section_Borders_ZOrder]      = CChangesSectionBordersZOrder;
AscDFH.changesFactory[AscDFH.historyitem_Section_Header_First]        = CChangesSectionHeaderFirst;
AscDFH.changesFactory[AscDFH.historyitem_Section_Header_Even]         = CChangesSectionHeaderEven;
AscDFH.changesFactory[AscDFH.historyitem_Section_Header_Default]      = CChangesSectionHeaderDefault;
AscDFH.changesFactory[AscDFH.historyitem_Section_Footer_First]        = CChangesSectionFooterFirst;
AscDFH.changesFactory[AscDFH.historyitem_Section_Footer_Even]         = CChangesSectionFooterEven;
AscDFH.changesFactory[AscDFH.historyitem_Section_Footer_Default]      = CChangesSectionFooterDefault;
AscDFH.changesFactory[AscDFH.historyitem_Section_TitlePage]           = CChangesSectionTitlePage;
AscDFH.changesFactory[AscDFH.historyitem_Section_PageMargins_Header]  = CChangesSectionPageMarginsHeader;
AscDFH.changesFactory[AscDFH.historyitem_Section_PageMargins_Footer]  = CChangesSectionPageMarginsFooter;
AscDFH.changesFactory[AscDFH.historyitem_Section_PageNumType_Start]   = CChangesSectionPageNumTypeStart;
AscDFH.changesFactory[AscDFH.historyitem_Section_Columns_EqualWidth]  = CChangesSectionColumnsEqualWidth;
AscDFH.changesFactory[AscDFH.historyitem_Section_Columns_Space]       = CChangesSectionColumnsSpace;
AscDFH.changesFactory[AscDFH.historyitem_Section_Columns_Num]         = CChangesSectionColumnsNum;
AscDFH.changesFactory[AscDFH.historyitem_Section_Columns_Sep]         = CChangesSectionColumnsSep;
AscDFH.changesFactory[AscDFH.historyitem_Section_Columns_Col]         = CChangesSectionColumnsCol;
AscDFH.changesFactory[AscDFH.historyitem_Section_Columns_SetCols]     = CChangesSectionColumnsSetCols;
AscDFH.changesFactory[AscDFH.historyitem_Section_Footnote_Pos]        = CChangesSectionFootnotePos;
AscDFH.changesFactory[AscDFH.historyitem_Section_Footnote_NumStart]   = CChangesSectionFootnoteNumStart;
AscDFH.changesFactory[AscDFH.historyitem_Section_Footnote_NumRestart] = CChangesSectionFootnoteNumRestart;
AscDFH.changesFactory[AscDFH.historyitem_Section_Footnote_NumFormat]  = CChangesSectionFootnoteNumFormat;

//----------------------------------------------------------------------------------------------------------------------
// Карта зависимости изменений
//----------------------------------------------------------------------------------------------------------------------
AscDFH.changesRelationMap[AscDFH.historyitem_Section_PageSize_Orient]     = [AscDFH.historyitem_Section_PageSize_Orient];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_PageSize_Size]       = [AscDFH.historyitem_Section_PageSize_Size];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_PageMargins]         = [AscDFH.historyitem_Section_PageMargins];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Type]                = [AscDFH.historyitem_Section_Type];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Borders_Left]        = [AscDFH.historyitem_Section_Borders_Left];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Borders_Top]         = [AscDFH.historyitem_Section_Borders_Top];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Borders_Right]       = [AscDFH.historyitem_Section_Borders_Right];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Borders_Bottom]      = [AscDFH.historyitem_Section_Borders_Bottom];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Borders_Display]     = [AscDFH.historyitem_Section_Borders_Display];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Borders_OffsetFrom]  = [AscDFH.historyitem_Section_Borders_OffsetFrom];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Borders_ZOrder]      = [AscDFH.historyitem_Section_Borders_ZOrder];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Header_First]        = [AscDFH.historyitem_Section_Header_First];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Header_Even]         = [AscDFH.historyitem_Section_Header_Even];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Header_Default]      = [AscDFH.historyitem_Section_Header_Default];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Footer_First]        = [AscDFH.historyitem_Section_Footer_First];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Footer_Even]         = [AscDFH.historyitem_Section_Footer_Even];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Footer_Default]      = [AscDFH.historyitem_Section_Footer_Default];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_TitlePage]           = [AscDFH.historyitem_Section_TitlePage];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_PageMargins_Header]  = [AscDFH.historyitem_Section_PageMargins_Header];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_PageMargins_Footer]  = [AscDFH.historyitem_Section_PageMargins_Footer];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_PageNumType_Start]   = [AscDFH.historyitem_Section_PageNumType_Start];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Columns_EqualWidth]  = [AscDFH.historyitem_Section_Columns_EqualWidth];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Columns_Space]       = [AscDFH.historyitem_Section_Columns_Space];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Columns_Num]         = [AscDFH.historyitem_Section_Columns_Num];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Columns_Sep]         = [AscDFH.historyitem_Section_Columns_Sep];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Columns_Col]         = [AscDFH.historyitem_Section_Columns_Col, AscDFH.historyitem_Section_Columns_SetCols];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Columns_SetCols]     = [AscDFH.historyitem_Section_Columns_Col, AscDFH.historyitem_Section_Columns_SetCols];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Footnote_Pos]        = [AscDFH.historyitem_Section_Footnote_Pos];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Footnote_NumStart]   = [AscDFH.historyitem_Section_Footnote_NumStart];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Footnote_NumRestart] = [AscDFH.historyitem_Section_Footnote_NumRestart];
AscDFH.changesRelationMap[AscDFH.historyitem_Section_Footnote_NumFormat]  = [AscDFH.historyitem_Section_Footnote_NumFormat];
//----------------------------------------------------------------------------------------------------------------------



/**
 * Базовый класс для изменения колонтитулов
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesSectionBaseHeaderFooter(Class, Old, New)
{
	CChangesSectionBaseHeaderFooter.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionBaseHeaderFooter, AscDFH.CChangesBaseProperty);
CChangesSectionBaseHeaderFooter.prototype.WriteToBinary = function(Writer)
{
	// Long : Flags
	// 1bit : is New null?
	// 2bit : is Old null?
	// 1bit == 0: String : New id
	// 2bit == 0: String : Old id

	var nFlags = 0;
	if (null === this.New)
		nFlags |= 1;
	if (null === this.Old)
		nFlags |= 2;

	Writer.WriteLong(nFlags);
	if (null !== this.New)
		Writer.WriteString2(this.New.Get_Id());
	if (null !== this.Old)
		Writer.WriteString2(this.Old.Get_Id());
};
CChangesSectionBaseHeaderFooter.prototype.ReadFromBinary = function(Reader)
{
	// Long : Flags
	// 1bit : is New null?
	// 2bit : is Old null?
	// 1bit == 0: String : New id
	// 2bit == 0: String : Old id

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.New = null;
	else
		this.New = AscCommon.g_oTableId.Get_ById(Reader.GetString2());

	if (nFlags & 2)
		this.Old = null;
	else
		this.Old = AscCommon.g_oTableId.Get_ById(Reader.GetString2());
};


/**
 * @constructor
 * @extends {AscDFH.CChangesBaseByteValue}
 */
function CChangesSectionPageOrient(Class, Old, New)
{
	CChangesSectionPageOrient.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionPageOrient, AscDFH.CChangesBaseByteValue);
CChangesSectionPageOrient.prototype.Type = AscDFH.historyitem_Section_PageSize_Orient;
CChangesSectionPageOrient.prototype.private_SetValue = function(Value)
{
	this.Class.PageSize.Orient = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesSectionPageSize(Class, Old, New)
{
	CChangesSectionPageSize.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionPageSize, AscDFH.CChangesBaseProperty);
CChangesSectionPageSize.prototype.Type = AscDFH.historyitem_Section_PageSize_Size;
CChangesSectionPageSize.prototype.private_SetValue = function(Value)
{
	this.Class.PageSize.W = Value.W;
	this.Class.PageSize.H = Value.H;
};
CChangesSectionPageSize.prototype.WriteToBinary = function(Writer)
{
	// Double : New.W
	// Double : New.H
	// Double : Old.W
	// Double : Old.H

	Writer.WriteDouble(this.New.W);
	Writer.WriteDouble(this.New.H);
	Writer.WriteDouble(this.Old.W);
	Writer.WriteDouble(this.Old.H);
};
CChangesSectionPageSize.prototype.ReadFromBinary = function(Reader)
{
	// Double : New.W
	// Double : New.H
	// Double : Old.W
	// Double : Old.H

	this.New = {
		W : Reader.GetDouble(),
		H : Reader.GetDouble()
	};

	this.Old = {
		W : Reader.GetDouble(),
		H : Reader.GetDouble()
	};
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesSectionPageMargins(Class, Old, New)
{
	CChangesSectionPageMargins.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionPageMargins, AscDFH.CChangesBaseProperty);
CChangesSectionPageMargins.prototype.Type = AscDFH.historyitem_Section_PageMargins;
CChangesSectionPageMargins.prototype.private_SetValue = function(Value)
{
	this.Class.PageMargins.Left   = Value.L;
	this.Class.PageMargins.Top    = Value.T;
	this.Class.PageMargins.Right  = Value.R;
	this.Class.PageMargins.Bottom = Value.B;
};
CChangesSectionPageMargins.prototype.WriteToBinary = function(Writer)
{
	// Double : New.L
	// Double : New.T
	// Double : New.R
	// Double : New.B
	// Double : Old.L
	// Double : Old.T
	// Double : Old.R
	// Double : Old.B

	Writer.WriteDouble(this.New.L);
	Writer.WriteDouble(this.New.T);
	Writer.WriteDouble(this.New.R);
	Writer.WriteDouble(this.New.B);

	Writer.WriteDouble(this.Old.L);
	Writer.WriteDouble(this.Old.T);
	Writer.WriteDouble(this.Old.R);
	Writer.WriteDouble(this.Old.B);
};
CChangesSectionPageMargins.prototype.ReadFromBinary = function(Reader)
{
	// Double : New.L
	// Double : New.T
	// Double : New.R
	// Double : New.B
	// Double : Old.L
	// Double : Old.T
	// Double : Old.R
	// Double : Old.B

	this.New = {
		L : Reader.GetDouble(),
		T : Reader.GetDouble(),
		R : Reader.GetDouble(),
		B : Reader.GetDouble()
	};

	this.Old = {
		L : Reader.GetDouble(),
		T : Reader.GetDouble(),
		R : Reader.GetDouble(),
		B : Reader.GetDouble()
	};
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseByteValue}
 */
function CChangesSectionType(Class, Old, New)
{
	CChangesSectionType.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionType, AscDFH.CChangesBaseByteValue);
CChangesSectionType.prototype.Type = AscDFH.historyitem_Section_Type;
CChangesSectionType.prototype.private_SetValue = function(Value)
{
	this.Class.Type = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectValue}
 */
function CChangesSectionBordersLeft(Class, Old, New)
{
	CChangesSectionBordersLeft.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionBordersLeft, AscDFH.CChangesBaseObjectValue);
CChangesSectionBordersLeft.prototype.Type = AscDFH.historyitem_Section_Borders_Left;
CChangesSectionBordersLeft.prototype.private_CreateObject = function()
{
	return new CDocumentBorder();
};
CChangesSectionBordersLeft.prototype.private_SetValue = function(Value)
{
	this.Class.Borders.Left = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectValue}
 */
function CChangesSectionBordersTop(Class, Old, New)
{
	CChangesSectionBordersTop.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionBordersTop, AscDFH.CChangesBaseObjectValue);
CChangesSectionBordersTop.prototype.Type = AscDFH.historyitem_Section_Borders_Top;
CChangesSectionBordersTop.prototype.private_CreateObject = function()
{
	return new CDocumentBorder();
};
CChangesSectionBordersTop.prototype.private_SetValue = function(Value)
{
	this.Class.Borders.Top = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectValue}
 */
function CChangesSectionBordersRight(Class, Old, New)
{
	CChangesSectionBordersRight.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionBordersRight, AscDFH.CChangesBaseObjectValue);
CChangesSectionBordersRight.prototype.Type = AscDFH.historyitem_Section_Borders_Right;
CChangesSectionBordersRight.prototype.private_CreateObject = function()
{
	return new CDocumentBorder();
};
CChangesSectionBordersRight.prototype.private_SetValue = function(Value)
{
	this.Class.Borders.Right = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectValue}
 */
function CChangesSectionBordersBottom(Class, Old, New)
{
	CChangesSectionBordersBottom.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionBordersBottom, AscDFH.CChangesBaseObjectValue);
CChangesSectionBordersBottom.prototype.Type = AscDFH.historyitem_Section_Borders_Bottom;
CChangesSectionBordersBottom.prototype.private_CreateObject = function()
{
	return new CDocumentBorder();
};
CChangesSectionBordersBottom.prototype.private_SetValue = function(Value)
{
	this.Class.Borders.Bottom = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseByteValue}
 */
function CChangesSectionBordersDisplay(Class, Old, New)
{
	CChangesSectionBordersDisplay.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionBordersDisplay, AscDFH.CChangesBaseByteValue);
CChangesSectionBordersDisplay.prototype.Type = AscDFH.historyitem_Section_Borders_Display;
CChangesSectionBordersDisplay.prototype.private_SetValue = function(Value)
{
	this.Class.Borders.Display = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseByteValue}
 */
function CChangesSectionBordersOffsetFrom(Class, Old, New)
{
	CChangesSectionBordersOffsetFrom.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionBordersOffsetFrom, AscDFH.CChangesBaseByteValue);
CChangesSectionBordersOffsetFrom.prototype.Type = AscDFH.historyitem_Section_Borders_OffsetFrom;
CChangesSectionBordersOffsetFrom.prototype.private_SetValue = function(Value)
{
	this.Class.Borders.OffsetFrom = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseByteValue}
 */
function CChangesSectionBordersZOrder(Class, Old, New)
{
	CChangesSectionBordersZOrder.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionBordersZOrder, AscDFH.CChangesBaseByteValue);
CChangesSectionBordersZOrder.prototype.Type = AscDFH.historyitem_Section_Borders_ZOrder;
CChangesSectionBordersZOrder.prototype.private_SetValue = function(Value)
{
	this.Class.Borders.ZOrder = Value;
};
/**
 * @constructor
 * @extends {CChangesSectionBaseHeaderFooter}
 */
function CChangesSectionHeaderFirst(Class, Old, New)
{
	CChangesSectionHeaderFirst.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionHeaderFirst, CChangesSectionBaseHeaderFooter);
CChangesSectionHeaderFirst.prototype.Type = AscDFH.historyitem_Section_Header_First;
CChangesSectionHeaderFirst.prototype.private_SetValue = function(Value)
{
	this.Class.HeaderFirst = Value;
};
/**
 * @constructor
 * @extends {CChangesSectionBaseHeaderFooter}
 */
function CChangesSectionHeaderEven(Class, Old, New)
{
	CChangesSectionHeaderEven.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionHeaderEven, CChangesSectionBaseHeaderFooter);
CChangesSectionHeaderEven.prototype.Type = AscDFH.historyitem_Section_Header_Even;
CChangesSectionHeaderEven.prototype.private_SetValue = function(Value)
{
	this.Class.HeaderEven = Value;
};
/**
 * @constructor
 * @extends {CChangesSectionBaseHeaderFooter}
 */
function CChangesSectionHeaderDefault(Class, Old, New)
{
	CChangesSectionHeaderDefault.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionHeaderDefault, CChangesSectionBaseHeaderFooter);
CChangesSectionHeaderDefault.prototype.Type = AscDFH.historyitem_Section_Header_Default;
CChangesSectionHeaderDefault.prototype.private_SetValue = function(Value)
{
	this.Class.HeaderDefault = Value;
};
/**
 * @constructor
 * @extends {CChangesSectionBaseHeaderFooter}
 */
function CChangesSectionFooterFirst(Class, Old, New)
{
	CChangesSectionFooterFirst.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionFooterFirst, CChangesSectionBaseHeaderFooter);
CChangesSectionFooterFirst.prototype.Type = AscDFH.historyitem_Section_Footer_First;
CChangesSectionFooterFirst.prototype.private_SetValue = function(Value)
{
	this.Class.FooterFirst = Value;
};
/**
 * @constructor
 * @extends {CChangesSectionBaseHeaderFooter}
 */
function CChangesSectionFooterEven(Class, Old, New)
{
	CChangesSectionFooterEven.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionFooterEven, CChangesSectionBaseHeaderFooter);
CChangesSectionFooterEven.prototype.Type = AscDFH.historyitem_Section_Footer_Even;
CChangesSectionFooterEven.prototype.private_SetValue = function(Value)
{
	this.Class.FooterEven = Value;
};
/**
 * @constructor
 * @extends {CChangesSectionBaseHeaderFooter}
 */
function CChangesSectionFooterDefault(Class, Old, New)
{
	CChangesSectionFooterDefault.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionFooterDefault, CChangesSectionBaseHeaderFooter);
CChangesSectionFooterDefault.prototype.Type = AscDFH.historyitem_Section_Footer_Default;
CChangesSectionFooterDefault.prototype.private_SetValue = function(Value)
{
	this.Class.FooterDefault = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolValue}
 */
function CChangesSectionTitlePage(Class, Old, New)
{
	CChangesSectionTitlePage.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionTitlePage, AscDFH.CChangesBaseBoolValue);
CChangesSectionTitlePage.prototype.Type = AscDFH.historyitem_Section_TitlePage;
CChangesSectionTitlePage.prototype.private_SetValue = function(Value)
{
	this.Class.TitlePage = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseDoubleValue}
 */
function CChangesSectionPageMarginsHeader(Class, Old, New)
{
	CChangesSectionPageMarginsHeader.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionPageMarginsHeader, AscDFH.CChangesBaseDoubleValue);
CChangesSectionPageMarginsHeader.prototype.Type = AscDFH.historyitem_Section_PageMargins_Header;
CChangesSectionPageMarginsHeader.prototype.private_SetValue = function(Value)
{
	this.Class.PageMargins.Header = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseDoubleValue}
 */
function CChangesSectionPageMarginsFooter(Class, Old, New)
{
	CChangesSectionPageMarginsFooter.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionPageMarginsFooter, AscDFH.CChangesBaseDoubleValue);
CChangesSectionPageMarginsFooter.prototype.Type = AscDFH.historyitem_Section_PageMargins_Footer;
CChangesSectionPageMarginsFooter.prototype.private_SetValue = function(Value)
{
	this.Class.PageMargins.Footer = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongValue}
 */
function CChangesSectionPageNumTypeStart(Class, Old, New)
{
	CChangesSectionPageNumTypeStart.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionPageNumTypeStart, AscDFH.CChangesBaseLongValue);
CChangesSectionPageNumTypeStart.prototype.Type = AscDFH.historyitem_Section_PageNumType_Start;
CChangesSectionPageNumTypeStart.prototype.private_SetValue = function(Value)
{
	this.Class.PageNumType.Start = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolValue}
 */
function CChangesSectionColumnsEqualWidth(Class, Old, New)
{
	CChangesSectionColumnsEqualWidth.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionColumnsEqualWidth, AscDFH.CChangesBaseBoolValue);
CChangesSectionColumnsEqualWidth.prototype.Type = AscDFH.historyitem_Section_Columns_EqualWidth;
CChangesSectionColumnsEqualWidth.prototype.private_SetValue = function(Value)
{
	this.Class.Columns.EqualWidth = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseDoubleValue}
 */
function CChangesSectionColumnsSpace(Class, Old, New)
{
	CChangesSectionColumnsSpace.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionColumnsSpace, AscDFH.CChangesBaseDoubleValue);
CChangesSectionColumnsSpace.prototype.Type = AscDFH.historyitem_Section_Columns_Space;
CChangesSectionColumnsSpace.prototype.private_SetValue = function(Value)
{
	this.Class.Columns.Space = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongValue}
 */
function CChangesSectionColumnsNum(Class, Old, New)
{
	CChangesSectionColumnsNum.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionColumnsNum, AscDFH.CChangesBaseLongValue);
CChangesSectionColumnsNum.prototype.Type = AscDFH.historyitem_Section_Columns_Num;
CChangesSectionColumnsNum.prototype.private_SetValue = function(Value)
{
	this.Class.Columns.Num = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolValue}
 */
function CChangesSectionColumnsSep(Class, Old, New)
{
	CChangesSectionColumnsSep.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionColumnsSep, AscDFH.CChangesBaseBoolValue);
CChangesSectionColumnsSep.prototype.Type = AscDFH.historyitem_Section_Columns_Sep;
CChangesSectionColumnsSep.prototype.private_SetValue = function(Value)
{
	this.Class.Columns.Sep = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesSectionColumnsCol(Class, Old, New, Index)
{
	CChangesSectionColumnsCol.superclass.constructor.call(this, Class, Old, New);

	this.Index = Index;
}
AscCommon.extendClass(CChangesSectionColumnsCol, AscDFH.CChangesBaseProperty);
CChangesSectionColumnsCol.prototype.Type = AscDFH.historyitem_Section_Columns_Col;
CChangesSectionColumnsCol.prototype.private_SetValue = function(Value)
{
	this.Class.Columns.Cols[this.Index] = Value;
};
CChangesSectionColumnsCol.prototype.WriteToBinary = function(Writer)
{
	// Long : ColumnIndex
	// Long : flags
	// 1bit : is new undefined?
	// 2bit : is old undefined?
	// 1bit == 0 : CSectionColumn : New
	// 2bit == 0 : CSectionColumn : Old

	Writer.WriteLong(this.Index);

	var nFlags = 0;
	if (undefined === this.New)
		nFlags |= 1;

	if (undefined === this.Old)
		nFlags |= 2;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New)
		this.New.Write_ToBinary(Writer);

	if (undefined !== this.Old)
		this.Old.Write_ToBinary(Writer);
};
CChangesSectionColumnsCol.prototype.ReadFromBinary = function(Reader)
{
	// Long : ColumnIndex
	// Long : flags
	// 1bit : is new undefined?
	// 2bit : is old undefined?
	// 1bit == 0 : CSectionColumn : New
	// 2bit == 0 : CSectionColumn : Old

	this.Index = Reader.GetLong();

	var nFlags = Reader.GetLong();
	if (nFlags & 1)
	{
		this.New = undefined;
	}
	else
	{
		this.New = new CSectionColumn();
		this.New.Read_FromBinary(Reader);
	}

	if (nFlags & 2)
	{
		this.Old = undefined;
	}
	else
	{
		this.Old = new CSectionColumn();
		this.Old.Read_FromBinary(Reader);
	}
};
CChangesSectionColumnsCol.prototype.CreateReverseChange = function()
{
	return new CChangesSectionColumnsCol(this.Class, this.New, this.Old, this.Index);
};
CChangesSectionColumnsCol.prototype.Merge = function(oChange)
{
	if (this.Class !== oChange.Class)
		return true;

	if (this.Type === oChange.Type)
	{
		if (this.Index !== oChange.Index)
			return true;
		else
			return false;
	}
	else if (AscDFH.historyitem_Section_Columns_SetCols === oChange.Type)
	{
		return false
	}

	return true;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesSectionColumnsSetCols(Class, Old, New)
{
	CChangesSectionColumnsSetCols.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionColumnsSetCols, AscDFH.CChangesBaseProperty);
CChangesSectionColumnsSetCols.prototype.Type = AscDFH.historyitem_Section_Columns_SetCols;
CChangesSectionColumnsSetCols.prototype.private_SetValue = function(Value)
{
	this.Class.Columns.Cols = Value;
};
CChangesSectionColumnsSetCols.prototype.WriteToBinary = function(Writer)
{
	// Long : Count of new column
	// Array of CSectionColumn: new columns
	// Long : Count of old column
	// Array of CSectionColumn: old columns


	var nCount = this.New.length;
	Writer.WriteLong(nCount);
	for (var nIndex = 0; nIndex < nCount; ++nIndex)
	{
		this.New[nIndex].Write_ToBinary(Writer);
	}

	nCount = this.Old.length;
	Writer.WriteLong(nCount);
	for (var nIndex = 0; nIndex < nCount; ++nIndex)
	{
		this.Old[nIndex].Write_ToBinary(Writer);
	}
};
CChangesSectionColumnsSetCols.prototype.ReadFromBinary = function(Reader)
{
	// Long : Count of new column
	// Array of CSectionColumn: new columns
	// Long : Count of old column
	// Array of CSectionColumn: old columns

	var nCount = Reader.GetLong();
	this.New = [];
	for (var nIndex = 0; nIndex < nCount; ++nIndex)
	{
		this.New[nIndex] = new CSectionColumn();
		this.New[nIndex].Read_FromBinary(Reader);
	}

	nCount = Reader.GetLong();
	this.Old = [];
	for (var nIndex = 0; nIndex < nCount; ++nIndex)
	{
		this.Old[nIndex] = new CSectionColumn();
		this.Old[nIndex].Read_FromBinary(Reader);
	}
};
CChangesSectionColumnsSetCols.prototype.Merge = function(oChange)
{
	if (this.Class !== oChange.Class)
		return true;

	if (this.Type === oChange.Type)
		return false;

	if (AscDFH.historyitem_Section_Columns_Col === oChange.Type)
	{
		if (!this.New)
			this.New = [];

		this.New[oChange.Index] = oChange.New;
	}

	return true;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesSectionFootnotePos(Class, Old, New)
{
	CChangesSectionFootnotePos.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionFootnotePos, AscDFH.CChangesBaseLongProperty);
CChangesSectionFootnotePos.prototype.Type = AscDFH.historyitem_Section_Footnote_Pos;
CChangesSectionFootnotePos.prototype.private_SetValue = function(Value)
{
	this.Class.FootnotePr.Pos = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesSectionFootnoteNumStart(Class, Old, New)
{
	CChangesSectionFootnoteNumStart.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionFootnoteNumStart, AscDFH.CChangesBaseLongProperty);
CChangesSectionFootnoteNumStart.prototype.Type = AscDFH.historyitem_Section_Footnote_NumStart;
CChangesSectionFootnoteNumStart.prototype.private_SetValue = function(Value)
{
	this.Class.FootnotePr.NumStart = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesSectionFootnoteNumRestart(Class, Old, New)
{
	CChangesSectionFootnoteNumRestart.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionFootnoteNumRestart, AscDFH.CChangesBaseLongProperty);
CChangesSectionFootnoteNumRestart.prototype.Type = AscDFH.historyitem_Section_Footnote_NumRestart;
CChangesSectionFootnoteNumRestart.prototype.private_SetValue = function(Value)
{
	this.Class.FootnotePr.NumRestart = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesSectionFootnoteNumFormat(Class, Old, New)
{
	CChangesSectionFootnoteNumFormat.superclass.constructor.call(this, Class, Old, New);
}
AscCommon.extendClass(CChangesSectionFootnoteNumFormat, AscDFH.CChangesBaseLongProperty);
CChangesSectionFootnoteNumFormat.prototype.Type = AscDFH.historyitem_Section_Footnote_NumFormat;
CChangesSectionFootnoteNumFormat.prototype.private_SetValue = function(Value)
{
	this.Class.FootnotePr.NumFormat = Value;
};