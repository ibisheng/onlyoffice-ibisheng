/*
 * (c) Copyright Ascensio System SIA 2010-2017
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
 * Time: 14:21
 */

AscDFH.changesFactory[AscDFH.historyitem_TableRow_Before]      = CChangesTableRowBefore;
AscDFH.changesFactory[AscDFH.historyitem_TableRow_After]       = CChangesTableRowAfter;
AscDFH.changesFactory[AscDFH.historyitem_TableRow_CellSpacing] = CChangesTableRowCellSpacing;
AscDFH.changesFactory[AscDFH.historyitem_TableRow_Height]      = CChangesTableRowHeight;
AscDFH.changesFactory[AscDFH.historyitem_TableRow_AddCell]     = CChangesTableRowAddCell;
AscDFH.changesFactory[AscDFH.historyitem_TableRow_RemoveCell]  = CChangesTableRowRemoveCell;
AscDFH.changesFactory[AscDFH.historyitem_TableRow_TableHeader] = CChangesTableRowTableHeader;
AscDFH.changesFactory[AscDFH.historyitem_TableRow_Pr]          = CChangesTableRowPr;

//----------------------------------------------------------------------------------------------------------------------
// Карта зависимости изменений
//----------------------------------------------------------------------------------------------------------------------
AscDFH.changesRelationMap[AscDFH.historyitem_TableRow_Before]      = [
	AscDFH.historyitem_TableRow_Before,
	AscDFH.historyitem_TableRow_Pr
];
AscDFH.changesRelationMap[AscDFH.historyitem_TableRow_After]       = [
	AscDFH.historyitem_TableRow_After,
	AscDFH.historyitem_TableRow_Pr
];
AscDFH.changesRelationMap[AscDFH.historyitem_TableRow_CellSpacing] = [
	AscDFH.historyitem_TableRow_CellSpacing,
	AscDFH.historyitem_TableRow_Pr
];
AscDFH.changesRelationMap[AscDFH.historyitem_TableRow_Height]      = [
	AscDFH.historyitem_TableRow_Height,
	AscDFH.historyitem_TableRow_Pr
];
AscDFH.changesRelationMap[AscDFH.historyitem_TableRow_AddCell]     = [
	AscDFH.historyitem_TableRow_AddCell,
	AscDFH.historyitem_TableRow_RemoveCell
];
AscDFH.changesRelationMap[AscDFH.historyitem_TableRow_RemoveCell]  = [
	AscDFH.historyitem_TableRow_AddCell,
	AscDFH.historyitem_TableRow_RemoveCell
];
AscDFH.changesRelationMap[AscDFH.historyitem_TableRow_TableHeader] = [
	AscDFH.historyitem_TableRow_TableHeader,
	AscDFH.historyitem_TableRow_Pr
];
AscDFH.changesRelationMap[AscDFH.historyitem_TableRow_Pr]          = [
	AscDFH.historyitem_TableRow_Before,
	AscDFH.historyitem_TableRow_After,
	AscDFH.historyitem_TableRow_CellSpacing,
	AscDFH.historyitem_TableRow_Height,
	AscDFH.historyitem_TableRow_TableHeader,
	AscDFH.historyitem_TableRow_Pr
];
/**
 * Общая функция объединения изменений, которые зависят только от себя и AscDFH.historyitem_TableRow_Pr
 * @param oChange
 * @returns {boolean}
 */
function private_TableRowChangesOnMergePr(oChange)
{
	if (oChange.Class !== this.Class)
		return true;

	if (oChange.Type === this.Type || oChange.Type === AscDFH.historyitem_TableRow_Pr)
		return false;

	return true;
}
//----------------------------------------------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesTableRowBefore(Class, Old, New, Color)
{
	CChangesTableRowBefore.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableRowBefore, AscDFH.CChangesBaseProperty);
CChangesTableRowBefore.prototype.Type = AscDFH.historyitem_TableRow_Before;
CChangesTableRowBefore.prototype.WriteToBinary = function(Writer)
{
	// Long : Flags
	// 1-bit : is New.GridBefore undefined?
	// 2-bit : is New.WBefore undefined?
	// 3-bit : is Old.GridBefore undefined?
	// 4-bit : is Old.WBefore undefined?
	// Long : New.GridBefore
	// CTableMeasurement : New.WBefore
	// Long : Old.GridBefore
	// CTableMeasurement : Old.WBefore

	var nFlags = 0;
	if (undefined === this.New.GridBefore)
		nFlags |= 1;
	if (undefined === this.New.WBefore)
		nFlags |= 2;
	if (undefined === this.Old.GridBefore)
		nFlags |= 4;
	if (undefined === this.Old.WBefore)
		nFlags |= 8;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New.GridBefore)
		Writer.WriteLong(this.New.GridBefore);
	if (undefined !== this.New.WBefore)
		this.New.WBefore.Write_ToBinary(Writer);
	if (undefined !== this.Old.GridBefore)
		Writer.WriteLong(this.Old.GridBefore);
	if (undefined !== this.Old.WBefore)
		this.Old.WBefore.Write_ToBinary(Writer);
};
CChangesTableRowBefore.prototype.ReadFromBinary = function(Reader)
{
	// Long : Flags
	// 1-bit : is New.GridBefore undefined?
	// 2-bit : is New.WBefore undefined?
	// 3-bit : is Old.GridBefore undefined?
	// 4-bit : is Old.WBefore undefined?
	// Long : New.GridBefore
	// CTableMeasurement : New.WBefore
	// Long : Old.GridBefore
	// CTableMeasurement : Old.WBefore

	var nFlags = Reader.GetLong();

	this.New = {
		GridBefore : undefined,
		WBefore    : undefined
	};

	this.Old = {
		GridBefore : undefined,
		WBefore    : undefined
	};

	if (nFlags & 1)
		this.New.GridBefore = undefined;
	else
		this.New.GridBefore = Reader.GetLong();

	if (nFlags & 2)
	{
		this.New.WBefore = undefined;
	}
	else
	{
		this.New.WBefore = new CTableMeasurement(tblwidth_Auto, 0);
		this.New.WBefore.Read_FromBinary(Reader);
	}

	if (nFlags & 4)
		this.Old.GridBefore = undefined;
	else
		this.Old.GridBefore = Reader.GetLong();

	if (nFlags & 8)
	{
		this.Old.WBefore = undefined;
	}
	else
	{
		this.Old.WBefore = new CTableMeasurement(tblwidth_Auto, 0);
		this.Old.WBefore.Read_FromBinary(Reader);
	}
};
CChangesTableRowBefore.prototype.private_SetValue = function(Value)
{
	var oTableRow = this.Class;

	oTableRow.Pr.GridBefore = Value.GridBefore;
	oTableRow.Pr.WBefore    = Value.WBefore;
	oTableRow.Recalc_CompiledPr();
};
CChangesTableRowBefore.prototype.Merge = private_TableRowChangesOnMergePr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesTableRowAfter(Class, Old, New, Color)
{
	CChangesTableRowAfter.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableRowAfter, AscDFH.CChangesBaseProperty);
CChangesTableRowAfter.prototype.Type = AscDFH.historyitem_TableRow_After;
CChangesTableRowAfter.prototype.WriteToBinary = function(Writer)
{
	// Long : Flags
	// 1-bit : is New.GridAfter undefined?
	// 2-bit : is New.WAfter undefined?
	// 3-bit : is Old.GridAfter undefined?
	// 4-bit : is Old.WAfter undefined?
	// Long : New.GridBefore
	// CTableMeasurement : New.WBefore
	// Long : Old.GridBefore
	// CTableMeasurement : Old.WBefore

	var nFlags = 0;
	if (undefined === this.New.GridAfter)
		nFlags |= 1;
	if (undefined === this.New.WAfter)
		nFlags |= 2;
	if (undefined === this.Old.GridAfter)
		nFlags |= 4;
	if (undefined === this.Old.WAfter)
		nFlags |= 8;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New.GridAfter)
		Writer.WriteLong(this.New.GridAfter);
	if (undefined !== this.New.WAfter)
		this.New.WAfter.Write_ToBinary(Writer);
	if (undefined !== this.Old.GridAfter)
		Writer.WriteLong(this.Old.GridAfter);
	if (undefined !== this.Old.WAfter)
		this.Old.WAfter.Write_ToBinary(Writer);
};
CChangesTableRowAfter.prototype.ReadFromBinary = function(Reader)
{
	// Long : Flags
	// 1-bit : is New.GridAfter undefined?
	// 2-bit : is New.WAfter undefined?
	// 3-bit : is Old.GridAfter undefined?
	// 4-bit : is Old.WAfter undefined?
	// Long : New.GridAfter
	// CTableMeasurement : New.WAfter
	// Long : Old.GridAfter
	// CTableMeasurement : Old.WAfter

	var nFlags = Reader.GetLong();

	this.New = {
		GridAfter : undefined,
		WAfter    : undefined
	};

	this.Old = {
		GridAfter : undefined,
		WAfter    : undefined
	};

	if (nFlags & 1)
		this.New.GridAfter = undefined;
	else
		this.New.GridAfter = Reader.GetLong();

	if (nFlags & 2)
	{
		this.New.WAfter = undefined;
	}
	else
	{
		this.New.WAfter = new CTableMeasurement(tblwidth_Auto, 0);
		this.New.WAfter.Read_FromBinary(Reader);
	}

	if (nFlags & 4)
		this.Old.GridAfter = undefined;
	else
		this.Old.GridAfter = Reader.GetLong();

	if (nFlags & 8)
	{
		this.Old.WAfter = undefined;
	}
	else
	{
		this.Old.WAfter = new CTableMeasurement(tblwidth_Auto, 0);
		this.Old.WAfter.Read_FromBinary(Reader);
	}
};
CChangesTableRowAfter.prototype.private_SetValue = function(Value)
{
	var oTableRow = this.Class;

	oTableRow.Pr.GridAfter = Value.GridBefore;
	oTableRow.Pr.WAfter    = Value.WBefore;
	oTableRow.Recalc_CompiledPr();
};
CChangesTableRowAfter.prototype.Merge = private_TableRowChangesOnMergePr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesTableRowCellSpacing(Class, Old, New, Color)
{
	CChangesTableRowCellSpacing.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableRowCellSpacing, AscDFH.CChangesBaseProperty);
CChangesTableRowCellSpacing.prototype.Type = AscDFH.historyitem_TableRow_CellSpacing;
CChangesTableRowCellSpacing.prototype.WriteToBinary = function(Writer)
{
	// Long : Flags
	// 1-bit : is New undefined?
	// 2-bit : is New null?
	// 3-bit : is Old undefined?
	// 4-bit : is Old null?
	// Double : New (1,2 bits are clear)
	// Double : Old (3,4 bits are clear)

	var nFlags = 0;
	if (undefined === this.New)
		nFlags |= 1;
	else if (null === this.New)
		nFlags |= 2;

	if (undefined === this.Old)
		nFlags |= 4;
	else if (null === this.Old)
		nFlags |= 8;

	Writer.WriteLong(nFlags);

	if (undefined !== this.New && null !== this.New)
		Writer.WriteDouble(this.New);
	if (undefined !== this.Old && null !== this.Old)
		Writer.WriteDouble(this.Old);
};
CChangesTableRowCellSpacing.prototype.ReadFromBinary = function(Reader)
{
	// Long : Flags
	// 1-bit : is New undefined?
	// 2-bit : is New null?
	// 3-bit : is Old undefined?
	// 4-bit : is Old null?
	// Double : New (1,2 bits are clear)
	// Double : Old (3,4 bits are clear)

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.New = undefined;
	else if (nFlags & 2)
		this.New = null;
	else
		this.New = Reader.GetDouble();

	if (nFlags & 4)
		this.Old = undefined;
	else if (nFlags & 8)
		this.Old = null;
	else
		this.Old = Reader.GetDouble();
};
CChangesTableRowCellSpacing.prototype.private_SetValue = function(Value)
{
	var oTableRow = this.Class;
	oTableRow.Pr.TableCellSpacing = Value;
	oTableRow.Recalc_CompiledPr();
};
CChangesTableRowCellSpacing.prototype.Merge = private_TableRowChangesOnMergePr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectProperty}
 */
function CChangesTableRowHeight(Class, Old, New, Color)
{
	CChangesTableRowHeight.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableRowHeight, AscDFH.CChangesBaseObjectProperty);
CChangesTableRowHeight.prototype.Type = AscDFH.historyitem_TableRow_Height;
CChangesTableRowHeight.prototype.private_CreateObject = function()
{
	return new CTableRowHeight(0, Asc.linerule_Auto);
};
CChangesTableRowHeight.prototype.private_SetValue = function(Value)
{
	var oTable = this.Class;
	oTable.Pr.Height = Value;
	oTable.Recalc_CompiledPr();
};
CChangesTableRowHeight.prototype.Merge = private_TableRowChangesOnMergePr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseContentChange}
 */
function CChangesTableRowAddCell(Class, Pos, Cells)
{
	CChangesTableRowAddCell.superclass.constructor.call(this, Class, Pos, Cells, true);
}
AscCommon.extendClass(CChangesTableRowAddCell, AscDFH.CChangesBaseContentChange);
CChangesTableRowAddCell.prototype.Type = AscDFH.historyitem_TableRow_AddCell;
CChangesTableRowAddCell.prototype.Undo = function()
{
	if (this.Items.length <= 0)
		return;

	var oRow = this.Class;
	oRow.Content.splice(this.Pos, 1);
	oRow.CellsInfo.splice(this.Pos, 1);
	oRow.Internal_ReIndexing(this.Pos);
};
CChangesTableRowAddCell.prototype.Redo = function()
{
	if (this.Items.length <= 0)
		return;

	var oRow = this.Class;
	oRow.Content.splice(this.Pos, 0, this.Items[0]);
	oRow.CellsInfo.splice(this.Pos, 0, {});
	oRow.Internal_ReIndexing(this.Pos);
};
CChangesTableRowAddCell.prototype.private_WriteItem = function(Writer, Item)
{
	Writer.WriteString2(Item.Get_Id());
};
CChangesTableRowAddCell.prototype.private_ReadItem = function(Reader)
{
	return AscCommon.g_oTableId.Get_ById(Reader.GetString2());
};
CChangesTableRowAddCell.prototype.Load = function(Color)
{
	if (this.Items.length <= 0 || this.PosArray.length <= 0)
		return;

	var oRow = this.Class;

	var Pos     = oRow.m_oContentChanges.Check(AscCommon.contentchanges_Add, this.PosArray[0]);
	var Element = this.Items[0];

	if (null != Element)
	{
		oRow.Content.splice(Pos, 0, Element);
		AscCommon.CollaborativeEditing.Update_DocumentPositionsOnAdd(oRow, Pos);
	}

	oRow.Internal_ReIndexing();
};
CChangesTableRowAddCell.prototype.IsRelated = function(oChanges)
{
	if (this.Class === oChanges.Class && (AscDFH.historyitem_TableRow_AddCell === oChanges.Type || AscDFH.historyitem_TableRow_RemoveCell === oChanges.Type))
		return true;

	return false;
};
CChangesTableRowAddCell.prototype.CreateReverseChange = function()
{
	return this.private_CreateReverseChange(CChangesTableRowRemoveCell);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseContentChange}
 */
function CChangesTableRowRemoveCell(Class, Pos, Cells)
{
	CChangesTableRowRemoveCell.superclass.constructor.call(this, Class, Pos, Cells, false);
}
AscCommon.extendClass(CChangesTableRowRemoveCell, AscDFH.CChangesBaseContentChange);
CChangesTableRowRemoveCell.prototype.Type = AscDFH.historyitem_TableRow_RemoveCell;
CChangesTableRowRemoveCell.prototype.Undo = function()
{
	if (this.Items.length <= 0)
		return;

	var oRow = this.Class;
	oRow.Content.splice(this.Pos, 0, this.Items[0]);
	oRow.CellsInfo.splice(this.Pos, 0, {});
	oRow.Internal_ReIndexing(this.Pos);
};
CChangesTableRowRemoveCell.prototype.Redo = function()
{
	if (this.Items.length <= 0)
		return;

	var oRow = this.Class;
	oRow.Content.splice(this.Pos, 1);
	oRow.CellsInfo.splice(this.Pos, 1);
	oRow.Internal_ReIndexing(this.Pos);
};
CChangesTableRowRemoveCell.prototype.private_WriteItem = function(Writer, Item)
{
	Writer.WriteString2(Item.Get_Id());
};
CChangesTableRowRemoveCell.prototype.private_ReadItem = function(Reader)
{
	return AscCommon.g_oTableId.Get_ById(Reader.GetString2());
};
CChangesTableRowRemoveCell.prototype.Load = function(Color)
{
	if (this.Items.length <= 0 || this.PosArray.length <= 0)
		return;

	var oRow = this.Class;

	var Pos = oRow.m_oContentChanges.Check(AscCommon.contentchanges_Remove, this.PosArray[0]);
	if (false === Pos)
		return;

	oRow.Content.splice(Pos, 1);
	AscCommon.CollaborativeEditing.Update_DocumentPositionsOnRemove(oRow, Pos, 1);

	oRow.Internal_ReIndexing();
};
CChangesTableRowRemoveCell.prototype.IsRelated = function(oChanges)
{
	if (this.Class === oChanges.Class && (AscDFH.historyitem_TableRow_AddCell === oChanges.Type || AscDFH.historyitem_TableRow_RemoveCell === oChanges.Type))
		return true;

	return false;
};
CChangesTableRowRemoveCell.prototype.CreateReverseChange = function()
{
	return this.private_CreateReverseChange(CChangesTableRowAddCell);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolProperty}
 */
function CChangesTableRowTableHeader(Class, Old, New, Color)
{
	CChangesTableRowTableHeader.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableRowTableHeader, AscDFH.CChangesBaseBoolProperty);
CChangesTableRowTableHeader.prototype.Type = AscDFH.historyitem_TableRow_TableHeader;
CChangesTableRowTableHeader.prototype.private_SetValue = function(Value)
{
	var oRow = this.Class;
	oRow.Pr.TableHeader = Value;
	oRow.Recalc_CompiledPr();
};
CChangesTableRowTableHeader.prototype.Merge = private_TableRowChangesOnMergePr;
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseObjectValue}
 */
function CChangesTableRowPr(Class, Old, New, Color)
{
	CChangesTableRowPr.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesTableRowPr, AscDFH.CChangesBaseObjectValue);
CChangesTableRowPr.prototype.Type = AscDFH.historyitem_TableRow_Pr;
CChangesTableRowPr.prototype.private_CreateObject = function()
{
	return new CTableRowPr()
};
CChangesTableRowPr.prototype.private_SetValue = function(Value)
{
	var oRow = this.Class;
	oRow.Pr = Value;
	oRow.Recalc_CompiledPr();
};
CChangesTableRowPr.prototype.Merge = function(oChange)
{
	if (this.Class !== oChange.Class)
		return true;

	if (this.Type === oChange.Type)
		return false;

	if (!this.New)
		this.New = new CTableRowPr();

	switch (oChange.Type)
	{
		case AscDFH.historyitem_TableRow_Before:
		{
			this.New.GridBefore = oChange.New.GridBefore;
			this.New.WBefore    = oChange.New.WBefore;
			break;
		}
		case AscDFH.historyitem_TableRow_After:
		{
			this.New.GridAfter = oChange.New.GridAfter;
			this.New.WAfter    = oChange.New.WAfter;
			break;
		}
		case AscDFH.historyitem_TableRow_CellSpacing:
		{
			this.New.TableCellSpacing = oChange.New;
			break;
		}
		case AscDFH.historyitem_TableRow_Height:
		{
			this.New.Height = oChange.New;
			break;
		}
		case AscDFH.historyitem_TableRow_TableHeader:
		{
			this.New.TableHeader = oChange.New;
			break;
		}
	}

	return true;
};