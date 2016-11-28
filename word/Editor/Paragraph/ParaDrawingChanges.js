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
 * Date: 03.11.2016
 * Time: 11:56
 */

AscDFH.changesFactory[AscDFH.historyitem_Drawing_DrawingType]       = CChangesParaDrawingDrawingType;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_WrappingType]      = CChangesParaDrawingWrappingType;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_Distance]          = CChangesParaDrawingDistance;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_AllowOverlap]      = CChangesParaDrawingAllowOverlap;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_PositionH]         = CChangesParaDrawingPositionH;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_PositionV]         = CChangesParaDrawingPositionV;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_BehindDoc]         = CChangesParaDrawingBehindDoc;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_SetGraphicObject]  = CChangesParaDrawingGraphicObject;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_SetSimplePos]      = CChangesParaDrawingSimplePos;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_SetExtent]         = CChangesParaDrawingExtent;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_SetWrapPolygon]    = CChangesParaDrawingWrapPolygon;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_SetLocked]         = CChangesParaDrawingLocked;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_SetRelativeHeight] = CChangesParaDrawingRelativeHeight;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_SetEffectExtent]   = CChangesParaDrawingEffectExtent;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_SetParent]         = CChangesParaDrawingParent;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_SetParaMath]       = CChangesParaDrawingParaMath;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_LayoutInCell]      = CChangesParaDrawingLayoutInCell;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_SetSizeRelH]       = CChangesParaDrawingSizeRelH;
AscDFH.changesFactory[AscDFH.historyitem_Drawing_SetSizeRelV]       = CChangesParaDrawingSizeRelV;

//----------------------------------------------------------------------------------------------------------------------
// Карта зависимости изменений
//----------------------------------------------------------------------------------------------------------------------
AscDFH.paradrawingChangesRelationMap                                               = {};
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_DrawingType]       = [AscDFH.historyitem_Drawing_DrawingType];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_WrappingType]      = [AscDFH.historyitem_Drawing_WrappingType];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_Distance]          = [AscDFH.historyitem_Drawing_Distance];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_AllowOverlap]      = [AscDFH.historyitem_Drawing_AllowOverlap];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_PositionH]         = [AscDFH.historyitem_Drawing_PositionH];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_PositionV]         = [AscDFH.historyitem_Drawing_PositionV];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_BehindDoc]         = [AscDFH.historyitem_Drawing_BehindDoc];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_SetGraphicObject]  = [AscDFH.historyitem_Drawing_SetGraphicObject];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_SetSimplePos]      = [AscDFH.historyitem_Drawing_SetSimplePos];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_SetExtent]         = [AscDFH.historyitem_Drawing_SetExtent];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_SetWrapPolygon]    = [AscDFH.historyitem_Drawing_SetWrapPolygon];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_SetLocked]         = [AscDFH.historyitem_Drawing_SetLocked];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_SetRelativeHeight] = [AscDFH.historyitem_Drawing_SetRelativeHeight];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_SetEffectExtent]   = [AscDFH.historyitem_Drawing_SetEffectExtent];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_SetParent]         = [AscDFH.historyitem_Drawing_SetParent];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_SetParaMath]       = [AscDFH.historyitem_Drawing_SetParaMath];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_LayoutInCell]      = [AscDFH.historyitem_Drawing_LayoutInCell];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_SetSizeRelH]       = [AscDFH.historyitem_Drawing_SetSizeRelH];
AscDFH.paradrawingChangesRelationMap[AscDFH.historyitem_Drawing_SetSizeRelV]       = [AscDFH.historyitem_Drawing_SetSizeRelV];
//----------------------------------------------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongValue}
 */
function CChangesParaDrawingDrawingType(Class, Old, New, Color)
{
	CChangesParaDrawingDrawingType.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingDrawingType, AscDFH.CChangesBaseLongValue);
CChangesParaDrawingDrawingType.prototype.Type = AscDFH.historyitem_Drawing_DrawingType;
CChangesParaDrawingDrawingType.prototype.private_SetValue = function(Value)
{
	this.Class.DrawingType = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongValue}
 */
function CChangesParaDrawingWrappingType(Class, Old, New, Color)
{
	CChangesParaDrawingWrappingType.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingWrappingType, AscDFH.CChangesBaseLongValue);
CChangesParaDrawingWrappingType.prototype.Type = AscDFH.historyitem_Drawing_WrappingType;
CChangesParaDrawingWrappingType.prototype.private_SetValue = function(Value)
{
	this.Class.wrappingType = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaDrawingDistance(Class, Old, New, Color)
{
	CChangesParaDrawingDistance.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingDistance, AscDFH.CChangesBaseProperty);
CChangesParaDrawingDistance.prototype.Type = AscDFH.historyitem_Drawing_Distance;
CChangesParaDrawingDistance.prototype.private_SetValue = function(Value)
{
	var oDrawing = this.Class;

	oDrawing.Distance.L = Value.Left;
	oDrawing.Distance.T = Value.Top;
	oDrawing.Distance.R = Value.Right;
	oDrawing.Distance.B = Value.Bottom;

	if (oDrawing.GraphicObj && oDrawing.GraphicObj.recalcWrapPolygon)
		oDrawing.GraphicObj.recalcWrapPolygon();
};
CChangesParaDrawingDistance.prototype.WriteToBinary = function(Writer)
{
	// Double : New.Left
	// Double : New.Top
	// Double : New.Right
	// Double : New.Bottom
	// Double : Old.Left
	// Double : Old.Top
	// Double : Old.Right
	// Double : Old.Bottom

	Writer.WriteDouble(this.New.Left);
	Writer.WriteDouble(this.New.Top);
	Writer.WriteDouble(this.New.Right);
	Writer.WriteDouble(this.New.Bottom);
	Writer.WriteDouble(this.Old.Left);
	Writer.WriteDouble(this.Old.Top);
	Writer.WriteDouble(this.Old.Right);
	Writer.WriteDouble(this.Old.Bottom);
};
CChangesParaDrawingDistance.prototype.ReadFromBinary = function(Reader)
{
	// Double : New.Left
	// Double : New.Top
	// Double : New.Right
	// Double : New.Bottom
	// Double : Old.Left
	// Double : Old.Top
	// Double : Old.Right
	// Double : Old.Bottom

	this.New = {
		Left   : 0,
		Top    : 0,
		Right  : 0,
		Bottom : 0
	};

	this.Old = {
		Left   : 0,
		Top    : 0,
		Right  : 0,
		Bottom : 0
	};

	this.New.Left   = Reader.GetDouble();
	this.New.Top    = Reader.GetDouble();
	this.New.Right  = Reader.GetDouble();
	this.New.Bottom = Reader.GetDouble();
	this.Old.Left   = Reader.GetDouble();
	this.Old.Top    = Reader.GetDouble();
	this.Old.Right  = Reader.GetDouble();
	this.Old.Bottom = Reader.GetDouble();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolValue}
 */
function CChangesParaDrawingAllowOverlap(Class, Old, New, Color)
{
	CChangesParaDrawingAllowOverlap.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingAllowOverlap, AscDFH.CChangesBaseBoolValue);
CChangesParaDrawingAllowOverlap.prototype.Type = AscDFH.historyitem_Drawing_AllowOverlap;
CChangesParaDrawingAllowOverlap.prototype.private_SetValue = function(Value)
{
	this.Class.AllowOverlap = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaDrawingPositionH(Class, Old, New, Color)
{
	CChangesParaDrawingPositionH.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingPositionH, AscDFH.CChangesBaseProperty);
CChangesParaDrawingPositionH.prototype.Type = AscDFH.historyitem_Drawing_PositionH;
CChangesParaDrawingPositionH.prototype.private_SetValue = function(Value)
{
	var oDrawing = this.Class;
	oDrawing.PositionH.RelativeFrom = Value.RelativeFrom;
	oDrawing.PositionH.Align        = Value.Align;
	oDrawing.PositionH.Value        = Value.Value;
	oDrawing.PositionH.Percent      = Value.Percent;
};
CChangesParaDrawingPositionH.prototype.WriteToBinary = function(Writer)
{
	// Long : New.RelativeFrom
	// Bool : New.Align
	//   true  -> Long   : New.Value
	//   false -> Double : New.Value
	// Bool : New.Percent
	// Long : Old.RelativeFrom
	// Bool : Old.Align
	//   true  -> Long   : Old.Value
	//   false -> Double : Old.Value
	// Bool : Old.Percent

	Writer.WriteLong(this.New.RelativeFrom);
	Writer.WriteBool(this.New.Align);
	if (true === this.New.Align)
		Writer.WriteLong(this.New.Value);
	else
		Writer.WriteDouble(this.New.Value);
	Writer.WriteBool(this.New.Percent === true);

	Writer.WriteLong(this.Old.RelativeFrom);
	Writer.WriteBool(this.Old.Align);
	if (true === this.Old.Align)
		Writer.WriteLong(this.Old.Value);
	else
		Writer.WriteDouble(this.Old.Value);
	Writer.WriteBool(this.Old.Percent === true);
};
CChangesParaDrawingPositionH.prototype.ReadFromBinary = function(Reader)
{
	// Long : New.RelativeFrom
	// Bool : New.Align
	//   true  -> Long   : New.Value
	//   false -> Double : New.Value
	// Bool : New.Percent
	// Long : Old.RelativeFrom
	// Bool : Old.Align
	//   true  -> Long   : Old.Value
	//   false -> Double : Old.Value
	// Bool : Old.Percent

	// Long : RelativeFrom
	// Bool : Align
	//   true  -> Long   : Value
	//   false -> Double : Value

	this.New = {};
	this.Old = {};

	this.New.RelativeFrom = Reader.GetLong();
	this.New.Align        = Reader.GetBool();

	if (true === this.New.Align)
		this.New.Value = Reader.GetLong();
	else
		this.New.Value = Reader.GetDouble();

	this.New.Percent = Reader.GetBool();

	this.Old.RelativeFrom = Reader.GetLong();
	this.Old.Align        = Reader.GetBool();

	if (true === this.Old.Align)
		this.Old.Value = Reader.GetLong();
	else
		this.Old.Value = Reader.GetDouble();

	this.Old.Percent = Reader.GetBool();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaDrawingPositionV(Class, Old, New, Color)
{
	CChangesParaDrawingPositionV.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingPositionV, AscDFH.CChangesBaseProperty);
CChangesParaDrawingPositionV.prototype.Type = AscDFH.historyitem_Drawing_PositionV;
CChangesParaDrawingPositionV.prototype.private_SetValue = function(Value)
{
	var oDrawing = this.Class;
	oDrawing.PositionV.RelativeFrom = Value.RelativeFrom;
	oDrawing.PositionV.Align        = Value.Align;
	oDrawing.PositionV.Value        = Value.Value;
	oDrawing.PositionV.Percent      = Value.Percent;
};
CChangesParaDrawingPositionV.prototype.WriteToBinary = function(Writer)
{
	// Long : New.RelativeFrom
	// Bool : New.Align
	//   true  -> Long   : New.Value
	//   false -> Double : New.Value
	// Bool : New.Percent
	// Long : Old.RelativeFrom
	// Bool : Old.Align
	//   true  -> Long   : Old.Value
	//   false -> Double : Old.Value
	// Bool : Old.Percent

	Writer.WriteLong(this.New.RelativeFrom);
	Writer.WriteBool(this.New.Align);
	if (true === this.New.Align)
		Writer.WriteLong(this.New.Value);
	else
		Writer.WriteDouble(this.New.Value);
	Writer.WriteBool(this.New.Percent === true);

	Writer.WriteLong(this.Old.RelativeFrom);
	Writer.WriteBool(this.Old.Align);
	if (true === this.Old.Align)
		Writer.WriteLong(this.Old.Value);
	else
		Writer.WriteDouble(this.Old.Value);
	Writer.WriteBool(this.Old.Percent === true);
};
CChangesParaDrawingPositionV.prototype.ReadFromBinary = function(Reader)
{
	// Long : New.RelativeFrom
	// Bool : New.Align
	//   true  -> Long   : New.Value
	//   false -> Double : New.Value
	// Bool : New.Percent
	// Long : Old.RelativeFrom
	// Bool : Old.Align
	//   true  -> Long   : Old.Value
	//   false -> Double : Old.Value
	// Bool : Old.Percent

	// Long : RelativeFrom
	// Bool : Align
	//   true  -> Long   : Value
	//   false -> Double : Value

	this.New = {};
	this.Old = {};

	this.New.RelativeFrom = Reader.GetLong();
	this.New.Align        = Reader.GetBool();

	if (true === this.New.Align)
		this.New.Value = Reader.GetLong();
	else
		this.New.Value = Reader.GetDouble();

	this.New.Percent = Reader.GetBool();

	this.Old.RelativeFrom = Reader.GetLong();
	this.Old.Align        = Reader.GetBool();

	if (true === this.Old.Align)
		this.Old.Value = Reader.GetLong();
	else
		this.Old.Value = Reader.GetDouble();

	this.Old.Percent = Reader.GetBool();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolValue}
 */
function CChangesParaDrawingBehindDoc(Class, Old, New, Color)
{
	CChangesParaDrawingBehindDoc.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingBehindDoc, AscDFH.CChangesBaseBoolValue);
CChangesParaDrawingBehindDoc.prototype.Type = AscDFH.historyitem_Drawing_BehindDoc;
CChangesParaDrawingBehindDoc.prototype.private_SetValue = function(Value)
{
	this.Class.behindDoc = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaDrawingGraphicObject(Class, Old, New, Color)
{
	CChangesParaDrawingGraphicObject.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingGraphicObject, AscDFH.CChangesBaseProperty);
CChangesParaDrawingGraphicObject.prototype.Type = AscDFH.historyitem_Drawing_SetGraphicObject;
CChangesParaDrawingGraphicObject.prototype.private_SetValue = function(Value)
{
	var oDrawing = this.Class;
	if(Value)
		oDrawing.GraphicObj = g_oTableId.Get_ById(Value);
	else
		oDrawing.GraphicObj = null;

	if(isRealObject(oDrawing.GraphicObj) && oDrawing.GraphicObj.handleUpdateExtents)
		oDrawing.GraphicObj.handleUpdateExtents();
};
CChangesParaDrawingGraphicObject.prototype.WriteToBinary = function(Writer)
{
	// Long : Flags
	// 1bit : is null New
	// 2bit : is null Old

	var nFlags = 0;

	if (!this.New)
		nFlags |= 1;

	if (!this.Old)
		nFlags |= 2;

	Writer.WriteLong(nFlags);

	if (this.New)
		Writer.WriteString2(this.New);

	if (this.Old)
		Writer.WriteString2(this.Old);
};
CChangesParaDrawingGraphicObject.prototype.ReadFromBinary = function(Reader)
{
	// Long : Flags
	// 1bit : is null New
	// 2bit : is null Old

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.New = null;
	else
		this.New = Reader.GetString2();

	if (nFlags & 2)
		this.Old = null;
	else
		this.Old = Reader.GetString2();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaDrawingSimplePos(Class, Old, New, Color)
{
	CChangesParaDrawingSimplePos.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingSimplePos, AscDFH.CChangesBaseProperty);
CChangesParaDrawingSimplePos.prototype.Type = AscDFH.historyitem_Drawing_SetSimplePos;
CChangesParaDrawingSimplePos.prototype.private_SetValue = function(Value)
{
	var oDrawing = this.Class;
	oDrawing.SimplePos.Use = Value.Use;
	oDrawing.SimplePos.X   = Value.X;
	oDrawing.SimplePos.Y   = Value.Y;
};
CChangesParaDrawingSimplePos.prototype.WriteToBinary = function(Writer)
{
	// Bool   : New.Use
	// Double : New.X
	// Double : New.Y
	// Bool   : Old.Use
	// Double : Old.X
	// Double : Old.Y

	Writer.WriteBool(this.New.Use);
	Writer.WriteDouble(this.New.X);
	Writer.WriteDouble(this.New.Y);
	Writer.WriteBool(this.Old.Use);
	Writer.WriteDouble(this.Old.X);
	Writer.WriteDouble(this.Old.Y);
};
CChangesParaDrawingSimplePos.prototype.ReadFromBinary = function(Reader)
{
	// Bool   : New.Use
	// Double : New.X
	// Double : New.Y
	// Bool   : Old.Use
	// Double : Old.X
	// Double : Old.Y

	this.New = {};
	this.Old = {};

	this.New.Use = Reader.GetBool();
	this.New.X   = Reader.GetDouble();
	this.New.Y   = Reader.GetDouble();
	this.Old.Use = Reader.GetBool();
	this.Old.X   = Reader.GetDouble();
	this.Old.Y   = Reader.GetDouble();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaDrawingExtent(Class, Old, New, Color)
{
	CChangesParaDrawingExtent.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingExtent, AscDFH.CChangesBaseProperty);
CChangesParaDrawingExtent.prototype.Type = AscDFH.historyitem_Drawing_SetExtent;
CChangesParaDrawingExtent.prototype.private_SetValue = function(Value)
{
	var oDrawing = this.Class;
	oDrawing.Extent.W = Value.W;
	oDrawing.Extent.H = Value.H;
};
CChangesParaDrawingExtent.prototype.WriteToBinary = function(Writer)
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
CChangesParaDrawingExtent.prototype.ReadFromBinary = function(Reader)
{
	// Double : New.W
	// Double : New.H
	// Double : Old.W
	// Double : Old.H

	this.New = {};
	this.Old = {};

	this.New.W = Reader.GetDouble();
	this.New.H = Reader.GetDouble();
	this.Old.W = Reader.GetDouble();
	this.Old.H = Reader.GetDouble();
};
CChangesParaDrawingExtent.prototype.Load = function()
{
	this.Redo();

	var oDrawing = this.Class;
	if(oDrawing.Parent)
	{
		var oRun = oDrawing.Parent.Get_DrawingObjectRun(oDrawing.Get_Id());
		if (oRun)
			oRun.RecalcInfo.Measure = true;
	}
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaDrawingWrapPolygon(Class, Old, New, Color)
{
	CChangesParaDrawingWrapPolygon.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingWrapPolygon, AscDFH.CChangesBaseProperty);
CChangesParaDrawingWrapPolygon.prototype.Type = AscDFH.historyitem_Drawing_SetWrapPolygon;
CChangesParaDrawingWrapPolygon.prototype.private_SetValue = function(Value)
{
	var oDrawing = this.Class;
	oDrawing.wrappingPolygon = Value;
};
CChangesParaDrawingWrapPolygon.prototype.WriteToBinary = function(Writer)
{
	AscFormat.writeObject(Writer, this.New);
	AscFormat.writeObject(Writer, this.Old);
};
CChangesParaDrawingWrapPolygon.prototype.ReadFromBinary = function(Reader)
{
	this.New = AscFormat.readObject(Reader);
	this.Old = AscFormat.readObject(Reader);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolValue}
 */
function CChangesParaDrawingLocked(Class, Old, New, Color)
{
	CChangesParaDrawingLocked.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingLocked, AscDFH.CChangesBaseBoolValue);
CChangesParaDrawingLocked.prototype.Type = AscDFH.historyitem_Drawing_SetLocked;
CChangesParaDrawingLocked.prototype.private_SetValue = function(Value)
{
	this.Class.Locked = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseLongValue}
 */
function CChangesParaDrawingRelativeHeight(Class, Old, New, Color)
{
	CChangesParaDrawingRelativeHeight.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingRelativeHeight, AscDFH.CChangesBaseLongValue);
CChangesParaDrawingRelativeHeight.prototype.Type = AscDFH.historyitem_Drawing_SetRelativeHeight;
CChangesParaDrawingRelativeHeight.prototype.private_SetValue = function(Value)
{
	this.Class.Set_RelativeHeight2(Value);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaDrawingEffectExtent(Class, Old, New, Color)
{
	CChangesParaDrawingEffectExtent.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingEffectExtent, AscDFH.CChangesBaseProperty);
CChangesParaDrawingEffectExtent.prototype.Type = AscDFH.historyitem_Drawing_SetEffectExtent;
CChangesParaDrawingEffectExtent.prototype.private_SetValue = function(Value)
{
	var oDrawing = this.Class;
	oDrawing.EffectExtent.L = Value.L;
	oDrawing.EffectExtent.T = Value.T;
	oDrawing.EffectExtent.R = Value.R;
	oDrawing.EffectExtent.B = Value.B;
};
CChangesParaDrawingEffectExtent.prototype.WriteToBinary = function(Writer)
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
CChangesParaDrawingEffectExtent.prototype.ReadFromBinary = function(Reader)
{
	// Double : New.L
	// Double : New.T
	// Double : New.R
	// Double : New.B
	// Double : Old.L
	// Double : Old.T
	// Double : Old.R
	// Double : Old.B

	this.New = {};
	this.Old = {};

	this.New.L = Reader.GetDouble();
	this.New.T = Reader.GetDouble();
	this.New.R = Reader.GetDouble();
	this.New.B = Reader.GetDouble();
	this.Old.L = Reader.GetDouble();
	this.Old.T = Reader.GetDouble();
	this.Old.R = Reader.GetDouble();
	this.Old.B = Reader.GetDouble();
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaDrawingParent(Class, Old, New, Color)
{
	CChangesParaDrawingParent.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingParent, AscDFH.CChangesBaseProperty);
CChangesParaDrawingParent.prototype.Type = AscDFH.historyitem_Drawing_SetParent;
CChangesParaDrawingParent.prototype.private_SetValue = function(Value)
{
	var oDrawing = this.Class;
	oDrawing.Parent = Value;
};
CChangesParaDrawingParent.prototype.WriteToBinary = function(Writer)
{
	AscFormat.writeObject(Writer, this.New);
	AscFormat.writeObject(Writer, this.Old);
};
CChangesParaDrawingParent.prototype.ReadFromBinary = function(Reader)
{
	this.New = AscFormat.readObject(Reader);
	this.Old = AscFormat.readObject(Reader);
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaDrawingParaMath(Class, Old, New, Color)
{
	CChangesParaDrawingParaMath.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingParaMath, AscDFH.CChangesBaseProperty);
CChangesParaDrawingParaMath.prototype.Type = AscDFH.historyitem_Drawing_SetParaMath;
CChangesParaDrawingParaMath.prototype.private_SetValue = function(Value)
{
	this.Class.ParaMath = Value;
};
CChangesParaDrawingParaMath.prototype.WriteToBinary = function(Writer)
{
	// Long   : Flags
	// 1-bit  : is undefined New
	// 2-bit  : is undefined Old
	// String : New
	// String : Old

	var nFlags = 0;
	if (!(this.New instanceof ParaMath))
		nFlags |= 1;

	if (!(this.Old instanceof ParaMath))
		nFlags |= 2;

	Writer.WriteLong(nFlags);

	if (this.New instanceof ParaMath)
		Writer.WriteString2(this.New.Get_Id());

	if (this.Old instanceof ParaMath)
		Writer.WriteString2(this.Old.Get_Id());
};
CChangesParaDrawingParaMath.prototype.ReadFromBinary = function(Reader)
{
	// Long   : Flags
	// 1-bit  : is undefined New
	// 2-bit  : is undefined Old
	// String : New
	// String : Old

	var nFlags = Reader.GetLong();

	if (nFlags & 1)
		this.New = null;
	else
		this.New = g_oTableId.Get_ById(Reader.GetString2());

	if (nFlags & 2)
		this.Old = null;
	else
		this.Old = g_oTableId.Get_ById(Reader.GetString2());
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseBoolValue}
 */
function CChangesParaDrawingLayoutInCell(Class, Old, New, Color)
{
	CChangesParaDrawingLayoutInCell.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingLayoutInCell, AscDFH.CChangesBaseBoolValue);
CChangesParaDrawingLayoutInCell.prototype.Type = AscDFH.historyitem_Drawing_LayoutInCell;
CChangesParaDrawingLayoutInCell.prototype.private_SetValue = function(Value)
{
	this.Class.LayoutInCell = Value;
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaDrawingSizeRelH(Class, Old, New, Color)
{
	CChangesParaDrawingSizeRelH.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingSizeRelH, AscDFH.CChangesBaseProperty);
CChangesParaDrawingSizeRelH.prototype.Type = AscDFH.historyitem_Drawing_SetSizeRelH;
CChangesParaDrawingSizeRelH.prototype.private_SetValue = function(Value)
{
	this.Class.SizeRelH = Value;
};
CChangesParaDrawingSizeRelH.prototype.WriteToBinary = function(Writer)
{
	// Bool  : New is undefined
	// false->
	//       Long   : New.RelativeFrom
	//       Double : New.Percent
	// Bool  : Old is undefined
	// false->
	//       Long   : Old.RelativeFrom
	//       Double : Old.Percent

	if (this.New)
	{
		Writer.WriteBool(false);
		Writer.WriteLong(this.New.RelativeFrom);
		Writer.WriteDouble(this.New.Percent);
	}
	else
	{
		Writer.WriteBool(true);
	}

	if (this.Old)
	{
		Writer.WriteBool(false);
		Writer.WriteLong(this.Old.RelativeFrom);
		Writer.WriteDouble(this.Old.Percent);
	}
	else
	{
		Writer.WriteBool(true);
	}
};
CChangesParaDrawingSizeRelH.prototype.ReadFromBinary = function(Reader)
{
	// Bool  : New is undefined
	// false->
	//       Long   : New.RelativeFrom
	//       Double : New.Percent
	// Bool  : Old is undefined
	// false->
	//       Long   : Old.RelativeFrom
	//       Double : Old.Percent

	if (true === Reader.GetBool())
	{
		this.New = undefined;
	}
	else
	{
		this.New = {};
		this.New.RelativeFrom = Reader.GetLong();
		this.New.Percent      = Reader.GetDouble();
	}

	if (true === Reader.GetBool())
	{
		this.Old = undefined;
	}
	else
	{
		this.Old = {};
		this.Old.RelativeFrom = Reader.GetLong();
		this.Old.Percent      = Reader.GetDouble();
	}
};
/**
 * @constructor
 * @extends {AscDFH.CChangesBaseProperty}
 */
function CChangesParaDrawingSizeRelV(Class, Old, New, Color)
{
	CChangesParaDrawingSizeRelV.superclass.constructor.call(this, Class, Old, New, Color);
}
AscCommon.extendClass(CChangesParaDrawingSizeRelV, AscDFH.CChangesBaseProperty);
CChangesParaDrawingSizeRelV.prototype.Type = AscDFH.historyitem_Drawing_SetSizeRelV;
CChangesParaDrawingSizeRelV.prototype.private_SetValue = function(Value)
{
	this.Class.SizeRelV = Value;
};
CChangesParaDrawingSizeRelV.prototype.WriteToBinary = function(Writer)
{
	// Bool  : New is undefined
	// false->
	//       Long   : New.RelativeFrom
	//       Double : New.Percent
	// Bool  : Old is undefined
	// false->
	//       Long   : Old.RelativeFrom
	//       Double : Old.Percent

	if (this.New)
	{
		Writer.WriteBool(false);
		Writer.WriteLong(this.New.RelativeFrom);
		Writer.WriteDouble(this.New.Percent);
	}
	else
	{
		Writer.WriteBool(true);
	}

	if (this.Old)
	{
		Writer.WriteBool(false);
		Writer.WriteLong(this.Old.RelativeFrom);
		Writer.WriteDouble(this.Old.Percent);
	}
	else
	{
		Writer.WriteBool(true);
	}
};
CChangesParaDrawingSizeRelV.prototype.ReadFromBinary = function(Reader)
{
	// Bool  : New is undefined
	// false->
	//       Long   : New.RelativeFrom
	//       Double : New.Percent
	// Bool  : Old is undefined
	// false->
	//       Long   : Old.RelativeFrom
	//       Double : Old.Percent

	if (true === Reader.GetBool())
	{
		this.New = undefined;
	}
	else
	{
		this.New = {};
		this.New.RelativeFrom = Reader.GetLong();
		this.New.Percent      = Reader.GetDouble();
	}

	if (true === Reader.GetBool())
	{
		this.Old = undefined;
	}
	else
	{
		this.Old = {};
		this.Old.RelativeFrom = Reader.GetLong();
		this.Old.Percent      = Reader.GetDouble();
	}
};