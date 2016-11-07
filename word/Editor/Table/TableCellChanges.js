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
 * Date: 07.11.2016
 * Time: 16:57
 */

AscDFH.changesFactory[AscDFH.historyitem_TableCell_GridSpan]      = CChangesTableCellGridSpan;
AscDFH.changesFactory[AscDFH.historyitem_TableCell_Margins]       = CChangesTableCellMargins;
AscDFH.changesFactory[AscDFH.historyitem_TableCell_Shd]           = CChangesTableCellShd;
AscDFH.changesFactory[AscDFH.historyitem_TableCell_VMerge]        = CChangesTableCellVMerge;
AscDFH.changesFactory[AscDFH.historyitem_TableCell_Border_Left]   = CChangesTableCellBorderLeft;
AscDFH.changesFactory[AscDFH.historyitem_TableCell_Border_Right]  = CChangesTableCellBorderRight;
AscDFH.changesFactory[AscDFH.historyitem_TableCell_Border_Top]    = CChangesTableCellBorderTop;
AscDFH.changesFactory[AscDFH.historyitem_TableCell_Border_Bottom] = CChangesTableCellBorderBottom;
AscDFH.changesFactory[AscDFH.historyitem_TableCell_VAlign]        = CChangesTableCellVAlign;
AscDFH.changesFactory[AscDFH.historyitem_TableCell_W]             = CChangesTableCellW;
AscDFH.changesFactory[AscDFH.historyitem_TableCell_Pr]            = CChangesTableCellPr;
AscDFH.changesFactory[AscDFH.historyitem_TableCell_TextDirection] = CChangesTableCellTextDirection;
AscDFH.changesFactory[AscDFH.historyitem_TableCell_NoWrap]        = CChangesTableCellNoWrap;

/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesTableCellGridSpan(Class, Old, New, Color)
{
	CChangesTableCellGridSpan.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableCellGridSpan, AscDFH.CChangesBaseLongProperty);
CChangesTableCellGridSpan.prototype.Type = AscDFH.historyitem_TableCell_GridSpan;
CChangesTableCellGridSpan.prototype.private_SetValue = function(Value)
{
	var oCell = this.Class;
	oCell.Pr.GridSpan = Value;
	oCell.Recalc_CompiledPr();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesTableCellMargins(Class, Old, New, Color)
{
	CChangesTableCellMargins.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableCellMargins, AscDFH.CChangesBaseProperty);
CChangesTableCellMargins.prototype.Type = AscDFH.historyitem_TableCell_Margins;
CChangesTableCellMargins.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Is New undefined?
	// 2-bit : Is New null?
	// 3-bit : Is Old undefined?
	// 4-bit : Is Old null?

	// CTableMeasure : New.Left
	// CTableMeasure : New.Top
	// CTableMeasure : New.Right
	// CTableMeasure : New.Bottom
	// CTableMeasure : Old.Left
	// CTableMeasure : Old.Top
	// CTableMeasure : Old.Right
	// CTableMeasure : Old.Bottom

	var nFlags = 0;

	if (undefined === this.New)
		nFlags |= 1;
	if (null === this.New)
		nFlags |= 2;
	if (undefined === this.Old)
		nFlags |= 4;
	if (null === this.Old)
		nFlags |= 8;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New && null !== this.New)
	{
		this.New.Left.Write_ToBinary(Writer);
		this.New.Top.Write_ToBinary(Writer);
		this.New.Right.Write_ToBinary(Writer);
		this.New.Bottom.Write_ToBinary(Writer);
	}

	if (undefined !== this.Old && null !== this.Old)
	{
		this.Old.Left.Write_ToBinary(Writer);
		this.Old.Top.Write_ToBinary(Writer);
		this.Old.Right.Write_ToBinary(Writer);
		this.Old.Bottom.Write_ToBinary(Writer);
	}
};
CChangesTableCellMargins.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Is New undefined?
	// 2-bit : Is New null?
	// 3-bit : Is Old undefined?
	// 4-bit : Is Old null?

	// CTableMeasure : New.Left
	// CTableMeasure : New.Top
	// CTableMeasure : New.Right
	// CTableMeasure : New.Bottom
	// CTableMeasure : Old.Left
	// CTableMeasure : Old.Top
	// CTableMeasure : Old.Right
	// CTableMeasure : Old.Bottom

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
	{
		this.New = undefined;
	}
	else if (nFlags & 2)
	{
		this.New = null;
	}
	else
	{
		this.New = {
			Left   : new CTableMeasurement(tblwidth_Auto, 0),
			Top    : new CTableMeasurement(tblwidth_Auto, 0),
			Right  : new CTableMeasurement(tblwidth_Auto, 0),
			Bottom : new CTableMeasurement(tblwidth_Auto, 0)
		};

		this.New.Left.Read_FromBinary(Reader);
		this.New.Top.Read_FromBinary(Reader);
		this.New.Right.Read_FromBinary(Reader);
		this.New.Bottom.Read_FromBinary(Reader);
	}

	if (nFlags & 4)
	{
		this.Old = undefined;
	}
	else if (nFlags & 8)
	{
		this.Old = null;
	}
	else
	{
		this.Old = {
			Left   : new CTableMeasurement(tblwidth_Auto, 0),
			Top    : new CTableMeasurement(tblwidth_Auto, 0),
			Right  : new CTableMeasurement(tblwidth_Auto, 0),
			Bottom : new CTableMeasurement(tblwidth_Auto, 0)
		};

		this.Old.Left.Read_FromBinary(Reader);
		this.Old.Top.Read_FromBinary(Reader);
		this.Old.Right.Read_FromBinary(Reader);
		this.Old.Bottom.Read_FromBinary(Reader);
	}
};
CChangesTableCellMargins.prototype.private_SetValue = function(Value)
{
	var oCell = this.Class;
	oCell.Pr.TableCellMar = Value;
	oCell.Recalc_CompiledPr();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesTableCellShd(Class, Old, New, Color)
{
	CChangesTableCellShd.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableCellShd, AscDFH.CChangesBaseObjectProperty);
CChangesTableCellShd.prototype.Type = AscDFH.historyitem_TableCell_Shd;
CChangesTableCellShd.prototype.private_CreateObject = function()
{
	return new CDocumentShd();
};
CChangesTableCellShd.prototype.private_SetValue = function(Value)
{
	var oCell = this.Class;
	oCell.Pr.Shd = Value;
	oCell.Recalc_CompiledPr();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesTableCellVMerge(Class, Old, New, Color)
{
	CChangesTableCellVMerge.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableCellVMerge, AscDFH.CChangesBaseLongProperty);
CChangesTableCellVMerge.prototype.Type = AscDFH.historyitem_TableCell_VMerge;
CChangesTableCellVMerge.prototype.private_SetValue = function(Value)
{
	var oCell = this.Class;
	oCell.Pr.VMerge = Value;
	oCell.Recalc_CompiledPr();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesTableCellBorderLeft(Class, Old, New, Color)
{
	CChangesTableCellBorderLeft.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableCellBorderLeft, AscDFH.CChangesBaseProperty);
CChangesTableCellBorderLeft.prototype.Type = AscDFH.historyitem_TableCell_Border_Left;
CChangesTableCellBorderLeft.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Is New undefined?
	// 2-bit : Is New null?
	// 3-bit : Is Old undefined?
	// 4-bit : Is Old null?

	// CDocumentBorder : New
	// CDocumentBorder : Old

	var nFlags = 0;

	if (undefined === this.New)
		nFlags |= 1;
	if (null === this.New)
		nFlags |= 2;
	if (undefined === this.Old)
		nFlags |= 4;
	if (null === this.Old)
		nFlags |= 8;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New && null !== this.New)
	{
		this.New = new CDocumentBorder();
		this.New.Write_ToBinary(Writer);
	}

	if (undefined !== this.Old && null !== this.Old)
	{
		this.Old = new CDocumentBorder();
		this.Old.Write_ToBinary(Writer);
	}
};
CChangesTableCellBorderLeft.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Is New undefined?
	// 2-bit : Is New null?
	// 3-bit : Is Old undefined?
	// 4-bit : Is Old null?

	// CTableMeasure : New.Left
	// CTableMeasure : New.Top
	// CTableMeasure : New.Right
	// CTableMeasure : New.Bottom
	// CTableMeasure : Old.Left
	// CTableMeasure : Old.Top
	// CTableMeasure : Old.Right
	// CTableMeasure : Old.Bottom

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
	{
		this.New = undefined;
	}
	else if (nFlags & 2)
	{
		this.New = null;
	}
	else
	{
		this.New = {
			Left   : new CTableMeasurement(tblwidth_Auto, 0),
			Top    : new CTableMeasurement(tblwidth_Auto, 0),
			Right  : new CTableMeasurement(tblwidth_Auto, 0),
			Bottom : new CTableMeasurement(tblwidth_Auto, 0)
		};

		this.New.Left.Read_FromBinary(Reader);
		this.New.Top.Read_FromBinary(Reader);
		this.New.Right.Read_FromBinary(Reader);
		this.New.Bottom.Read_FromBinary(Reader);
	}

	if (nFlags & 4)
	{
		this.Old = undefined;
	}
	else if (nFlags & 8)
	{
		this.Old = null;
	}
	else
	{
		this.Old = {
			Left   : new CTableMeasurement(tblwidth_Auto, 0),
			Top    : new CTableMeasurement(tblwidth_Auto, 0),
			Right  : new CTableMeasurement(tblwidth_Auto, 0),
			Bottom : new CTableMeasurement(tblwidth_Auto, 0)
		};

		this.Old.Left.Read_FromBinary(Reader);
		this.Old.Top.Read_FromBinary(Reader);
		this.Old.Right.Read_FromBinary(Reader);
		this.Old.Bottom.Read_FromBinary(Reader);
	}
};
CChangesTableCellBorderLeft.prototype.private_SetValue = function(Value)
{
	var oCell = this.Class;
	oCell.Pr.TableCellBorders.Left = Value;
	oCell.Recalc_CompiledPr();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesTableCellBorderTop(Class, Old, New, Color)
{
	CChangesTableCellBorderTop.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableCellBorderTop, AscDFH.CChangesBaseProperty);
CChangesTableCellBorderTop.prototype.Type = AscDFH.historyitem_TableCell_Border_Top;
CChangesTableCellBorderTop.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Is New undefined?
	// 2-bit : Is New null?
	// 3-bit : Is Old undefined?
	// 4-bit : Is Old null?

	// CDocumentBorder : New
	// CDocumentBorder : Old

	var nFlags = 0;

	if (undefined === this.New)
		nFlags |= 1;
	if (null === this.New)
		nFlags |= 2;
	if (undefined === this.Old)
		nFlags |= 4;
	if (null === this.Old)
		nFlags |= 8;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New && null !== this.New)
	{
		this.New = new CDocumentBorder();
		this.New.Write_ToBinary(Writer);
	}

	if (undefined !== this.Old && null !== this.Old)
	{
		this.Old = new CDocumentBorder();
		this.Old.Write_ToBinary(Writer);
	}
};
CChangesTableCellBorderTop.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Is New undefined?
	// 2-bit : Is New null?
	// 3-bit : Is Old undefined?
	// 4-bit : Is Old null?

	// CTableMeasure : New.Left
	// CTableMeasure : New.Top
	// CTableMeasure : New.Right
	// CTableMeasure : New.Bottom
	// CTableMeasure : Old.Left
	// CTableMeasure : Old.Top
	// CTableMeasure : Old.Right
	// CTableMeasure : Old.Bottom

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
	{
		this.New = undefined;
	}
	else if (nFlags & 2)
	{
		this.New = null;
	}
	else
	{
		this.New = {
			Left   : new CTableMeasurement(tblwidth_Auto, 0),
			Top    : new CTableMeasurement(tblwidth_Auto, 0),
			Right  : new CTableMeasurement(tblwidth_Auto, 0),
			Bottom : new CTableMeasurement(tblwidth_Auto, 0)
		};

		this.New.Left.Read_FromBinary(Reader);
		this.New.Top.Read_FromBinary(Reader);
		this.New.Right.Read_FromBinary(Reader);
		this.New.Bottom.Read_FromBinary(Reader);
	}

	if (nFlags & 4)
	{
		this.Old = undefined;
	}
	else if (nFlags & 8)
	{
		this.Old = null;
	}
	else
	{
		this.Old = {
			Left   : new CTableMeasurement(tblwidth_Auto, 0),
			Top    : new CTableMeasurement(tblwidth_Auto, 0),
			Right  : new CTableMeasurement(tblwidth_Auto, 0),
			Bottom : new CTableMeasurement(tblwidth_Auto, 0)
		};

		this.Old.Left.Read_FromBinary(Reader);
		this.Old.Top.Read_FromBinary(Reader);
		this.Old.Right.Read_FromBinary(Reader);
		this.Old.Bottom.Read_FromBinary(Reader);
	}
};
CChangesTableCellBorderTop.prototype.private_SetValue = function(Value)
{
	var oCell = this.Class;
	oCell.Pr.TableCellBorders.Top = Value;
	oCell.Recalc_CompiledPr();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesTableCellBorderRight(Class, Old, New, Color)
{
	CChangesTableCellBorderRight.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableCellBorderRight, AscDFH.CChangesBaseProperty);
CChangesTableCellBorderRight.prototype.Type = AscDFH.historyitem_TableCell_Border_Right;
CChangesTableCellBorderRight.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Is New undefined?
	// 2-bit : Is New null?
	// 3-bit : Is Old undefined?
	// 4-bit : Is Old null?

	// CDocumentBorder : New
	// CDocumentBorder : Old

	var nFlags = 0;

	if (undefined === this.New)
		nFlags |= 1;
	if (null === this.New)
		nFlags |= 2;
	if (undefined === this.Old)
		nFlags |= 4;
	if (null === this.Old)
		nFlags |= 8;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New && null !== this.New)
	{
		this.New = new CDocumentBorder();
		this.New.Write_ToBinary(Writer);
	}

	if (undefined !== this.Old && null !== this.Old)
	{
		this.Old = new CDocumentBorder();
		this.Old.Write_ToBinary(Writer);
	}
};
CChangesTableCellBorderRight.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Is New undefined?
	// 2-bit : Is New null?
	// 3-bit : Is Old undefined?
	// 4-bit : Is Old null?

	// CTableMeasure : New.Left
	// CTableMeasure : New.Top
	// CTableMeasure : New.Right
	// CTableMeasure : New.Bottom
	// CTableMeasure : Old.Left
	// CTableMeasure : Old.Top
	// CTableMeasure : Old.Right
	// CTableMeasure : Old.Bottom

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
	{
		this.New = undefined;
	}
	else if (nFlags & 2)
	{
		this.New = null;
	}
	else
	{
		this.New = {
			Left   : new CTableMeasurement(tblwidth_Auto, 0),
			Top    : new CTableMeasurement(tblwidth_Auto, 0),
			Right  : new CTableMeasurement(tblwidth_Auto, 0),
			Bottom : new CTableMeasurement(tblwidth_Auto, 0)
		};

		this.New.Left.Read_FromBinary(Reader);
		this.New.Top.Read_FromBinary(Reader);
		this.New.Right.Read_FromBinary(Reader);
		this.New.Bottom.Read_FromBinary(Reader);
	}

	if (nFlags & 4)
	{
		this.Old = undefined;
	}
	else if (nFlags & 8)
	{
		this.Old = null;
	}
	else
	{
		this.Old = {
			Left   : new CTableMeasurement(tblwidth_Auto, 0),
			Top    : new CTableMeasurement(tblwidth_Auto, 0),
			Right  : new CTableMeasurement(tblwidth_Auto, 0),
			Bottom : new CTableMeasurement(tblwidth_Auto, 0)
		};

		this.Old.Left.Read_FromBinary(Reader);
		this.Old.Top.Read_FromBinary(Reader);
		this.Old.Right.Read_FromBinary(Reader);
		this.Old.Bottom.Read_FromBinary(Reader);
	}
};
CChangesTableCellBorderRight.prototype.private_SetValue = function(Value)
{
	var oCell = this.Class;
	oCell.Pr.TableCellBorders.Right = Value;
	oCell.Recalc_CompiledPr();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesTableCellBorderBottom(Class, Old, New, Color)
{
	CChangesTableCellBorderBottom.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableCellBorderBottom, AscDFH.CChangesBaseProperty);
CChangesTableCellBorderBottom.prototype.Type = AscDFH.historyitem_TableCell_Border_Bottom;
CChangesTableCellBorderBottom.prototype.WriteToBinary = function(Writer)
{
	// Long  : Flag
	// 1-bit : Is New undefined?
	// 2-bit : Is New null?
	// 3-bit : Is Old undefined?
	// 4-bit : Is Old null?

	// CDocumentBorder : New
	// CDocumentBorder : Old

	var nFlags = 0;

	if (undefined === this.New)
		nFlags |= 1;
	if (null === this.New)
		nFlags |= 2;
	if (undefined === this.Old)
		nFlags |= 4;
	if (null === this.Old)
		nFlags |= 8;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New && null !== this.New)
	{
		this.New = new CDocumentBorder();
		this.New.Write_ToBinary(Writer);
	}

	if (undefined !== this.Old && null !== this.Old)
	{
		this.Old = new CDocumentBorder();
		this.Old.Write_ToBinary(Writer);
	}
};
CChangesTableCellBorderBottom.prototype.ReadFromBinary = function(Reader)
{
	// Long  : Flag
	// 1-bit : Is New undefined?
	// 2-bit : Is New null?
	// 3-bit : Is Old undefined?
	// 4-bit : Is Old null?

	// CTableMeasure : New.Left
	// CTableMeasure : New.Top
	// CTableMeasure : New.Right
	// CTableMeasure : New.Bottom
	// CTableMeasure : Old.Left
	// CTableMeasure : Old.Top
	// CTableMeasure : Old.Right
	// CTableMeasure : Old.Bottom

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
	{
		this.New = undefined;
	}
	else if (nFlags & 2)
	{
		this.New = null;
	}
	else
	{
		this.New = {
			Left   : new CTableMeasurement(tblwidth_Auto, 0),
			Top    : new CTableMeasurement(tblwidth_Auto, 0),
			Right  : new CTableMeasurement(tblwidth_Auto, 0),
			Bottom : new CTableMeasurement(tblwidth_Auto, 0)
		};

		this.New.Left.Read_FromBinary(Reader);
		this.New.Top.Read_FromBinary(Reader);
		this.New.Right.Read_FromBinary(Reader);
		this.New.Bottom.Read_FromBinary(Reader);
	}

	if (nFlags & 4)
	{
		this.Old = undefined;
	}
	else if (nFlags & 8)
	{
		this.Old = null;
	}
	else
	{
		this.Old = {
			Left   : new CTableMeasurement(tblwidth_Auto, 0),
			Top    : new CTableMeasurement(tblwidth_Auto, 0),
			Right  : new CTableMeasurement(tblwidth_Auto, 0),
			Bottom : new CTableMeasurement(tblwidth_Auto, 0)
		};

		this.Old.Left.Read_FromBinary(Reader);
		this.Old.Top.Read_FromBinary(Reader);
		this.Old.Right.Read_FromBinary(Reader);
		this.Old.Bottom.Read_FromBinary(Reader);
	}
};
CChangesTableCellBorderBottom.prototype.private_SetValue = function(Value)
{
	var oCell = this.Class;
	oCell.Pr.TableCellBorders.Bottom = Value;
	oCell.Recalc_CompiledPr();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesTableCellVAlign(Class, Old, New, Color)
{
	CChangesTableCellVAlign.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableCellVAlign, AscDFH.CChangesBaseLongProperty);
CChangesTableCellVAlign.prototype.Type = AscDFH.historyitem_TableCell_VAlign;
CChangesTableCellVAlign.prototype.private_SetValue = function(Value)
{
	var oCell = this.Class;
	oCell.Pr.VAlign = Value;
	oCell.Recalc_CompiledPr();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectValue}
 */
function CChangesTableCellW(Class, Old, New, Color)
{
	CChangesTableCellW.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableCellW, AscDFH.CChangesBaseObjectValue);
CChangesTableCellW.prototype.Type = AscDFH.historyitem_TableCell_W;
CChangesTableCellW.prototype.private_CreateObject = function()
{
	return new CTableMeasurement(tblwidth_Auto, 0);
};
CChangesTableCellW.prototype.private_SetValue = function(Value)
{
	var oCell = this.Class;
	oCell.Pr.TableCellW = Value;
	oCell.Recalc_CompiledPr();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectValue}
 */
function CChangesTableCellPr(Class, Old, New, Color)
{
	CChangesTableCellPr.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableCellPr, AscDFH.CChangesBaseObjectValue);
CChangesTableCellPr.prototype.Type = AscDFH.historyitem_TableCell_Pr;
CChangesTableCellPr.prototype.private_CreateObject = function()
{
	return new CTableCellPr();
};
CChangesTableCellPr.prototype.private_SetValue = function(Value)
{
	var oCell = this.Class;
	oCell.Pr = Value;
	oCell.Recalc_CompiledPr();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongProperty}
 */
function CChangesTableCellTextDirection(Class, Old, New, Color)
{
	CChangesTableCellTextDirection.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableCellTextDirection, AscDFH.CChangesBaseLongProperty);
CChangesTableCellTextDirection.prototype.Type = AscDFH.historyitem_TableCell_TextDirection;
CChangesTableCellTextDirection.prototype.private_SetValue = function(Value)
{
	var oCell = this.Class;
	oCell.Pr.TextDirection = Value;
	oCell.Recalc_CompiledPr();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesTableCellNoWrap(Class, Old, New, Color)
{
	CChangesTableCellNoWrap.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableCellNoWrap, AscDFH.CChangesBaseBoolProperty);
CChangesTableCellNoWrap.prototype.Type = AscDFH.historyitem_TableCell_NoWrap;
CChangesTableCellNoWrap.prototype.private_SetValue = function(Value)
{
	var oCell = this.Class;
	oCell.Pr.NoWrap = Value;
	oCell.Recalc_CompiledPr();
};