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
(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
function (window, undefined) {

// Import
	var c_oAscLockTypeElem = AscCommonExcel.c_oAscLockTypeElem;
	var c_oAscInsertOptions = Asc.c_oAscInsertOptions;
	var c_oAscDeleteOptions = Asc.c_oAscDeleteOptions;

	var gc_nMaxRow0 = AscCommon.gc_nMaxRow0;
	var gc_nMaxCol0 = AscCommon.gc_nMaxCol0;

	var c_oUndoRedoSerializeType = {
		Null: 0, Undefined: 1, SByte: 2, Byte: 3, Bool: 4, Long: 5, ULong: 6, Double: 7, String: 8, Object: 9, Array: 10
	};

	function DrawingCollaborativeData() {
		this.oClass = null;
		this.oBinaryReader = null;
		this.nPos = null;
		this.sChangedObjectId = null;
		this.isDrawingCollaborativeData = true;
	}

//главный обьект для пересылки изменений
	function UndoRedoItemSerializable(oClass, nActionType, nSheetId, oRange, oData, LocalChange) {
		this.oClass = oClass;
		this.nActionType = nActionType;
		this.nSheetId = nSheetId;
		this.oRange = oRange;
		this.oData = oData;
		this.LocalChange = LocalChange;
	}

	UndoRedoItemSerializable.prototype.Serialize = function (oBinaryWriter, collaborativeEditing) {
		if ((this.oData && this.oData.getType) || (this.oClass && (this.oClass.Save_Changes || this.oClass.WriteToBinary))) {
			var oThis = this;
			var oBinaryCommonWriter = new AscCommon.BinaryCommonWriter(oBinaryWriter);
			oBinaryCommonWriter.WriteItemWithLength(function () {
				oThis.SerializeInner(oBinaryWriter, collaborativeEditing);
			});
		}
	};
	UndoRedoItemSerializable.prototype.SerializeInner = function (oBinaryWriter, collaborativeEditing) {
		//nClassType
		if (!this.oClass.WriteToBinary) {
			oBinaryWriter.WriteBool(true);
			var nClassType = this.oClass.getClassType();
			oBinaryWriter.WriteByte(nClassType);
			//nActionType
			oBinaryWriter.WriteByte(this.nActionType);
			//nSheetId
			if (null != this.nSheetId) {
				oBinaryWriter.WriteBool(true);
				oBinaryWriter.WriteString2(this.nSheetId.toString());
			} else {
				oBinaryWriter.WriteBool(false);
			}
			//oRange
			if (null != this.oRange) {
				oBinaryWriter.WriteBool(true);
				var c1 = this.oRange.c1;
				var c2 = this.oRange.c2;
				var r1 = this.oRange.r1;
				var r2 = this.oRange.r2;
				if (null != this.nSheetId && (0 != c1 || gc_nMaxCol0 != c2)) {
					c1 = collaborativeEditing.getLockMeColumn2(this.nSheetId, c1);
					c2 = collaborativeEditing.getLockMeColumn2(this.nSheetId, c2);
				}
				if (null != this.nSheetId && (0 != r1 || gc_nMaxRow0 != r2)) {
					r1 = collaborativeEditing.getLockMeRow2(this.nSheetId, r1);
					r2 = collaborativeEditing.getLockMeRow2(this.nSheetId, r2);
				}
				oBinaryWriter.WriteLong(c1);
				oBinaryWriter.WriteLong(r1);
				oBinaryWriter.WriteLong(c2);
				oBinaryWriter.WriteLong(r2);
			} else {
				oBinaryWriter.WriteBool(false);
			}
			//oData
			this.SerializeDataObject(oBinaryWriter, this.oData, this.nSheetId, collaborativeEditing);

		} else {
			oBinaryWriter.WriteBool(false);
			var Class;
			Class = this.oClass.GetClass();
			oBinaryWriter.WriteString2(Class.Get_Id());
			oBinaryWriter.WriteLong(this.oClass.Type);
			this.oClass.WriteToBinary(oBinaryWriter);
		}
	};
	UndoRedoItemSerializable.prototype.SerializeDataObject =
		function (oBinaryWriter, oData, nSheetId, collaborativeEditing) {
			var oThis = this;
			if (oData.getType) {
				var nDataType = oData.getType();
				//не далаем копию oData, а сдвигаем в ней, потому что все равно после сериализации изменения потруться
				if (null != oData.applyCollaborative) {
					oData.applyCollaborative(nSheetId, collaborativeEditing);
				}
				oBinaryWriter.WriteByte(nDataType);
				var oBinaryCommonWriter = new AscCommon.BinaryCommonWriter(oBinaryWriter);
				if (oData.Write_ToBinary2) {
					oBinaryCommonWriter.WriteItemWithLength(function () {
						oData.Write_ToBinary2(oBinaryWriter)
					});
				} else {
					oBinaryCommonWriter.WriteItemWithLength(function () {
						oThis.SerializeDataInnerObject(oBinaryWriter, oData, nSheetId, collaborativeEditing);
					});
				}
			} else {
				oBinaryWriter.WriteByte(UndoRedoDataTypes.Unknown);
				oBinaryWriter.WriteLong(0);
			}
		};
	UndoRedoItemSerializable.prototype.SerializeDataInnerObject =
		function (oBinaryWriter, oData, nSheetId, collaborativeEditing) {
			var oProperties = oData.getProperties();
			for (var i in oProperties) {
				var nItemType = oProperties[i];
				var oItem = oData.getProperty(nItemType);
				this.SerializeDataInner(oBinaryWriter, nItemType, oItem, nSheetId, collaborativeEditing);
			}
		};
	UndoRedoItemSerializable.prototype.SerializeDataInnerArray =
		function (oBinaryWriter, oData, nSheetId, collaborativeEditing) {
			for (var i = 0; i < oData.length; ++i) {
				this.SerializeDataInner(oBinaryWriter, 0, oData[i], nSheetId, collaborativeEditing);
			}
		};
	UndoRedoItemSerializable.prototype.SerializeDataInner =
		function (oBinaryWriter, nItemType, oItem, nSheetId, collaborativeEditing) {
			var oThis = this;
			var sTypeOf;
			if (null === oItem) {
				sTypeOf = "null";
			} else if (oItem instanceof Array) {
				sTypeOf = "array";
			} else {
				sTypeOf = typeof(oItem);
			}
			switch (sTypeOf) {
				case "object":
					oBinaryWriter.WriteByte(nItemType);
					oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Object);
					this.SerializeDataObject(oBinaryWriter, oItem, nSheetId, collaborativeEditing);
					break;
				case "array":
					oBinaryWriter.WriteByte(nItemType);
					oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Array);
					var oBinaryCommonWriter = new AscCommon.BinaryCommonWriter(oBinaryWriter);
					oBinaryCommonWriter.WriteItemWithLength(function () {
						oThis.SerializeDataInnerArray(oBinaryWriter, oItem, nSheetId, collaborativeEditing);
					});
					break;
				case "number":
					oBinaryWriter.WriteByte(nItemType);
					var nFlorItem = Math.floor(oItem);
					if (nFlorItem == oItem) {
						if (-128 <= oItem && oItem <= 127) {
							oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.SByte);
							oBinaryWriter.WriteSByte(oItem);
						} else if (127 < oItem && oItem <= 255) {
							oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Byte);
							oBinaryWriter.WriteByte(oItem);
						} else if (-0x80000000 <= oItem && oItem <= 0x7FFFFFFF) {
							oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Long);
							oBinaryWriter.WriteLong(oItem);
						} else if (0x7FFFFFFF < oItem && oItem <= 0xFFFFFFFF) {
							oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.ULong);
							oBinaryWriter.WriteLong(oItem);
						} else {
							oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Double);
							oBinaryWriter.WriteDouble2(oItem);
						}
					} else {
						oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Double);
						oBinaryWriter.WriteDouble2(oItem);
					}
					break;
				case "boolean":
					oBinaryWriter.WriteByte(nItemType);
					oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Bool);
					oBinaryWriter.WriteBool(oItem);
					break;
				case "string":
					oBinaryWriter.WriteByte(nItemType);
					oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.String);
					oBinaryWriter.WriteString2(oItem);
					break;
				case "null":
					oBinaryWriter.WriteByte(nItemType);
					oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Null);
					break;
				case "undefined":
					oBinaryWriter.WriteByte(nItemType);
					oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Undefined);
					break;
				default:
					break;
			}
		};
	UndoRedoItemSerializable.prototype.Deserialize = function (oBinaryReader) {
		var res = AscCommon.c_oSerConstants.ReadOk;
		res = oBinaryReader.EnterFrame(4);
		var nLength = oBinaryReader.GetULongLE();
		res = oBinaryReader.EnterFrame(nLength);
		if (AscCommon.c_oSerConstants.ReadOk != res) {
			return res;
		}
		var bNoDrawing = oBinaryReader.GetBool();
		if (bNoDrawing) {
			var nClassType = oBinaryReader.GetUChar();
			this.oClass = UndoRedoClassTypes.Create(nClassType);
			this.nActionType = oBinaryReader.GetUChar();
			var bSheetId = oBinaryReader.GetBool();
			if (bSheetId) {
				this.nSheetId = oBinaryReader.GetString2LE(oBinaryReader.GetULongLE());
			}
			var bRange = oBinaryReader.GetBool();
			if (bRange) {
				var nC1 = oBinaryReader.GetULongLE();
				var nR1 = oBinaryReader.GetULongLE();
				var nC2 = oBinaryReader.GetULongLE();
				var nR2 = oBinaryReader.GetULongLE();
				this.oRange = new Asc.Range(nC1, nR1, nC2, nR2);
			} else {
				this.oRange = null;
			}
			this.oData = this.DeserializeData(oBinaryReader);
		} else {
			var changedObjectId = oBinaryReader.GetString2();
			this.nActionType = 1;
			this.oData = new DrawingCollaborativeData();
			this.oData.sChangedObjectId = changedObjectId;
			this.oData.oBinaryReader = oBinaryReader;
			this.oData.nPos = oBinaryReader.cur;

		}
	};
	UndoRedoItemSerializable.prototype.DeserializeData = function (oBinaryReader) {
		var nDataClassType = oBinaryReader.GetUChar();
		var nLength = oBinaryReader.GetULongLE();
		var oDataObject = UndoRedoDataTypes.Create(nDataClassType);
		if (null != oDataObject) {
			if (null != oDataObject.Read_FromBinary2) {
				oDataObject.Read_FromBinary2(oBinaryReader);
			} else if (null != oDataObject.Read_FromBinary2AndReplace) {
				oDataObject = oDataObject.Read_FromBinary2AndReplace(oBinaryReader);
			} else {
				this.DeserializeDataInner(oBinaryReader, oDataObject, nLength, false);
			}
		} else {
			oBinaryReader.Skip(nLength);
		}
		return oDataObject;
	};
	UndoRedoItemSerializable.prototype.DeserializeDataInner = function (oBinaryReader, oDataObject, nLength, bIsArray) {
		var nStartPos = oBinaryReader.GetCurPos();
		var nCurPos = nStartPos;
		while (nCurPos - nStartPos < nLength && nCurPos < oBinaryReader.GetSize() - 1) {
			var nMemeberType = oBinaryReader.GetUChar();
			var nDataType = oBinaryReader.GetUChar();
			var nUnknownType = false;
			var oNewValue = null;
			switch (nDataType) {
				case c_oUndoRedoSerializeType.Null:
					oNewValue = null;
					break;
				case c_oUndoRedoSerializeType.Undefined:
					oNewValue = undefined;
					break;
				case c_oUndoRedoSerializeType.Bool:
					oNewValue = oBinaryReader.GetBool();
					break;
				case c_oUndoRedoSerializeType.SByte:
					oNewValue = oBinaryReader.GetChar();
					break;
				case c_oUndoRedoSerializeType.Byte:
					oNewValue = oBinaryReader.GetUChar();
					break;
				case c_oUndoRedoSerializeType.Long:
					oNewValue = oBinaryReader.GetLongLE();
					break;
				case c_oUndoRedoSerializeType.ULong:
					oNewValue = AscFonts.FT_Common.IntToUInt(oBinaryReader.GetULongLE());
					break;
				case c_oUndoRedoSerializeType.Double:
					oNewValue = oBinaryReader.GetDoubleLE();
					break;
				case c_oUndoRedoSerializeType.String:
					oNewValue = oBinaryReader.GetString2LE(oBinaryReader.GetULongLE());
					break;
				case c_oUndoRedoSerializeType.Object:
					oNewValue = this.DeserializeData(oBinaryReader);
					break;
				case c_oUndoRedoSerializeType.Array:
					var aNewArray = [];
					var nNewLength = oBinaryReader.GetULongLE();
					this.DeserializeDataInner(oBinaryReader, aNewArray, nNewLength, true);
					oNewValue = aNewArray;
					break;
				default:
					nUnknownType = true;
					break;
			}
			if (false == nUnknownType) {
				if (bIsArray) {
					oDataObject.push(oNewValue);
				} else {
					oDataObject.setProperty(nMemeberType, oNewValue);
				}
			}
			nCurPos = oBinaryReader.GetCurPos();
		}
	};

//для сохранения в историю и пересылки изменений
	var UndoRedoDataTypes = new function () {
		this.Unknown = -1;
		this.CellSimpleData = 0;
		this.CellValue = 1;
		this.ValueMultiTextElem = 2;
		this.CellValueData = 3;
		this.CellData = 4;
		this.FromTo = 5;
		this.FromToRowCol = 6;
		this.FromToHyperlink = 7;
		this.IndexSimpleProp = 8;
		this.ColProp = 9;
		this.RowProp = 10;
		this.BBox = 11;
		this.StyleFont = 12;
		this.StyleFill = 13;
		this.StyleNum = 14;
		this.StyleBorder = 15;
		this.StyleBorderProp = 16;
		this.StyleXfs = 17;
		this.StyleAlign = 18;
		this.Hyperlink = 19;
		this.SortData = 20;
		this.CommentData = 21;
		this.CommentCoords = 22;
		this.ChartSeriesData = 24;
		this.SheetAdd = 25;
		this.SheetRemove = 26;
		this.ClrScheme = 28;
		this.AutoFilter = 29;
		this.AutoFiltersOptions = 30;
		this.AutoFilterObj = 31;

		this.AutoFiltersOptionsElements = 32;
		this.SingleProperty = 33;
		this.RgbColor = 34;
		this.ThemeColor = 35;

		this.CustomFilters = 36;
		this.CustomFilter = 37;
		this.ColorFilter = 38;

		this.DefinedName = 39;

		this.AdvancedTableInfoSettings = 40;

		this.AddFormatTableOptions = 63;
		this.SheetPr = 69;

		this.DynamicFilter = 75;
		this.Top10 = 76;

		this.PivotTable = 80;

		this.Create = function (nType) {
			switch (nType) {
				case this.ValueMultiTextElem:
					return new AscCommonExcel.CMultiTextElem();
					break;
				case this.CellValue:
					return new AscCommonExcel.CCellValue();
					break;
				case this.CellValueData:
					return new UndoRedoData_CellValueData();
					break;
				case this.CellData:
					return new UndoRedoData_CellData();
					break;
				case this.CellSimpleData:
					return new UndoRedoData_CellSimpleData();
					break;
				case this.FromTo:
					return new UndoRedoData_FromTo();
					break;
				case this.FromToRowCol:
					return new UndoRedoData_FromToRowCol();
					break;
				case this.FromToHyperlink:
					return new UndoRedoData_FromToHyperlink();
					break;
				case this.IndexSimpleProp:
					return new UndoRedoData_IndexSimpleProp();
					break;
				case this.ColProp:
					return new UndoRedoData_ColProp();
					break;
				case this.RowProp:
					return new UndoRedoData_RowProp();
					break;
				case this.BBox:
					return new UndoRedoData_BBox();
					break;
				case this.Hyperlink:
					return new AscCommonExcel.Hyperlink();
					break;
				case this.SortData:
					return new UndoRedoData_SortData();
					break;
				case this.StyleFont:
					return new AscCommonExcel.Font();
					break;
				case this.StyleFill:
					return new AscCommonExcel.Fill();
					break;
				case this.StyleNum:
					return new AscCommonExcel.Num();
					break;
				case this.StyleBorder:
					return new AscCommonExcel.Border();
					break;
				case this.StyleBorderProp:
					return new AscCommonExcel.BorderProp();
					break;
				case this.StyleXfs:
					return new AscCommonExcel.CellXfs();
					break;
				case this.StyleAlign:
					return new AscCommonExcel.Align();
					break;
				case this.CommentData:
					return new Asc.asc_CCommentData();
					break;
				case this.CommentCoords:
					return new AscCommonExcel.asc_CCommentCoords();
					break;
				case this.ChartSeriesData:
					return new AscFormat.asc_CChartSeria();
					break;
				case this.SheetAdd:
					return new UndoRedoData_SheetAdd();
					break;
				case this.SheetRemove:
					return new UndoRedoData_SheetRemove();
					break;
				case this.ClrScheme:
					return new UndoRedoData_ClrScheme();
					break;
				case this.AutoFilter:
					return new UndoRedoData_AutoFilter();
					break;
				case this.AutoFiltersOptions:
					return new Asc.AutoFiltersOptions();
					break;
				case this.AutoFilterObj:
					return new Asc.AutoFilterObj();
					break;
				case this.AdvancedTableInfoSettings:
					return new Asc.AdvancedTableInfoSettings();
					break;
				case this.CustomFilters:
					return new Asc.CustomFilters();
					break;
				case this.CustomFilter:
					return new Asc.CustomFilter();
					break;
				case this.ColorFilter:
					return new Asc.ColorFilter();
					break;
				case this.DynamicFilter:
					return new Asc.DynamicFilter();
					break;
				case this.Top10:
					return new Asc.Top10();
					break;
				case this.AutoFiltersOptionsElements:
					return new AscCommonExcel.AutoFiltersOptionsElements();
					break;
				case this.AddFormatTableOptions:
					return new AscCommonExcel.AddFormatTableOptions();
					break;
				case this.SingleProperty:
					return new UndoRedoData_SingleProperty();
					break;
				case this.RgbColor:
					return new AscCommonExcel.RgbColor();
					break;
				case this.ThemeColor:
					return new AscCommonExcel.ThemeColor();
					break;
				case this.DefinedName:
					return new UndoRedoData_DefinedNames();
				case this.PivotTable:
					return new UndoRedoData_PivotTable();
			}
			return null;
		};
	};

	function UndoRedoData_CellSimpleData(nRow, nCol, oOldVal, oNewVal, sFormula) {
		this.nRow = nRow;
		this.nCol = nCol;
		this.oOldVal = oOldVal;
		this.oNewVal = oNewVal;
		this.sFormula = sFormula;
	}

	UndoRedoData_CellSimpleData.prototype.Properties = {
		Row: 0, Col: 1, NewVal: 2
	};
	UndoRedoData_CellSimpleData.prototype.getType = function () {
		return UndoRedoDataTypes.CellSimpleData;
	};
	UndoRedoData_CellSimpleData.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_CellSimpleData.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.Row:
				return this.nRow;
				break;
			case this.Properties.Col:
				return this.nCol;
				break;
			case this.Properties.NewVal:
				return this.oNewVal;
				break;
		}
		return null;
	};
	UndoRedoData_CellSimpleData.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.Row:
				this.nRow = value;
				break;
			case this.Properties.Col:
				this.nCol = value;
				break;
			case this.Properties.NewVal:
				this.oNewVal = value;
				break;
		}
	};
	UndoRedoData_CellSimpleData.prototype.applyCollaborative = function (nSheetId, collaborativeEditing) {
		this.nRow = collaborativeEditing.getLockMeRow2(nSheetId, this.nRow);
		this.nCol = collaborativeEditing.getLockMeColumn2(nSheetId, this.nCol);
	};

	function UndoRedoData_CellData(value, style) {
		this.value = value;
		this.style = style;
	}

	UndoRedoData_CellData.prototype.Properties = {
		value: 0, style: 1
	};
	UndoRedoData_CellData.prototype.getType = function () {
		return UndoRedoDataTypes.CellData;
	};
	UndoRedoData_CellData.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_CellData.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.value:
				return this.value;
				break;
			case this.Properties.style:
				return this.style;
				break;
		}
		return null;
	};
	UndoRedoData_CellData.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.value:
				this.value = value;
				break;
			case this.Properties.style:
				this.style = value;
				break;
		}
	};

	function UndoRedoData_CellValueData(sFormula, oValue) {
		this.formula = sFormula;
		this.value = oValue;
	}

	UndoRedoData_CellValueData.prototype.Properties = {
		formula: 0, value: 1
	};
	UndoRedoData_CellValueData.prototype.isEqual = function (val) {
		if (null == val) {
			return false;
		}
		if (this.formula != val.formula) {
			return false;
		}
		if (this.value.isEqual(val.value)) {
			return true;
		}
		return false;
	};
	UndoRedoData_CellValueData.prototype.getType = function () {
		return UndoRedoDataTypes.CellValueData;
	};
	UndoRedoData_CellValueData.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_CellValueData.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.formula:
				return this.formula;
				break;
			case this.Properties.value:
				return this.value;
				break;
		}
		return null;
	};
	UndoRedoData_CellValueData.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.formula:
				this.formula = value;
				break;
			case this.Properties.value:
				this.value = value;
				break;
		}
	};

	function UndoRedoData_FromToRowCol(bRow, from, to) {
		this.bRow = bRow;
		this.from = from;
		this.to = to;
	}

	UndoRedoData_FromToRowCol.prototype.Properties = {
		from: 0, to: 1, bRow: 2
	};
	UndoRedoData_FromToRowCol.prototype.getType = function () {
		return UndoRedoDataTypes.FromToRowCol;
	};
	UndoRedoData_FromToRowCol.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_FromToRowCol.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.from:
				return this.from;
				break;
			case this.Properties.to:
				return this.to;
				break;
			case this.Properties.bRow:
				return this.bRow;
				break;
		}
		return null;
	};
	UndoRedoData_FromToRowCol.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.from:
				this.from = value;
				break;
			case this.Properties.to:
				this.to = value;
				break;
			case this.Properties.bRow:
				this.bRow = value;
				break;
		}
	};
	UndoRedoData_FromToRowCol.prototype.applyCollaborative = function (nSheetId, collaborativeEditing) {
		if (this.bRow) {
			this.from = collaborativeEditing.getLockMeRow2(nSheetId, this.from);
			this.to = collaborativeEditing.getLockMeRow2(nSheetId, this.to);
		} else {
			this.from = collaborativeEditing.getLockMeColumn2(nSheetId, this.from);
			this.to = collaborativeEditing.getLockMeColumn2(nSheetId, this.to);
		}
	};

	function UndoRedoData_FromTo(from, to, copyRange) {
		this.from = from;
		this.to = to;
		this.copyRange = copyRange;
	}

	UndoRedoData_FromTo.prototype.Properties = {
		from: 0, to: 1, copyRange: 2
	};
	UndoRedoData_FromTo.prototype.getType = function () {
		return UndoRedoDataTypes.FromTo;
	};
	UndoRedoData_FromTo.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_FromTo.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.from:
				return this.from;
				break;
			case this.Properties.to:
				return this.to;
				break;
			case this.Properties.copyRange:
				return this.copyRange;
				break;
		}
		return null;
	};
	UndoRedoData_FromTo.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.from:
				this.from = value;
				break;
			case this.Properties.to:
				this.to = value;
				break;
			case this.Properties.copyRange:
				this.copyRange = value;
				break;
		}
	};

	function UndoRedoData_FromToHyperlink(oBBoxFrom, oBBoxTo, hyperlink) {
		this.from = new UndoRedoData_BBox(oBBoxFrom);
		this.to = new UndoRedoData_BBox(oBBoxTo);
		this.hyperlink = hyperlink;
	}

	UndoRedoData_FromToHyperlink.prototype.Properties = {
		from: 0, to: 1, hyperlink: 2
	};
	UndoRedoData_FromToHyperlink.prototype.getType = function () {
		return UndoRedoDataTypes.FromToHyperlink;
	};
	UndoRedoData_FromToHyperlink.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_FromToHyperlink.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.from:
				return this.from;
				break;
			case this.Properties.to:
				return this.to;
				break;
			case this.Properties.hyperlink:
				return this.hyperlink;
				break;
		}
		return null;
	};
	UndoRedoData_FromToHyperlink.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.from:
				this.from = value;
				break;
			case this.Properties.to:
				this.to = value;
				break;
			case this.Properties.hyperlink:
				this.hyperlink = value;
				break;
		}
	};
	UndoRedoData_FromToHyperlink.prototype.applyCollaborative = function (nSheetId, collaborativeEditing) {
		this.from.r1 = collaborativeEditing.getLockMeRow2(nSheetId, this.from.r1);
		this.from.r2 = collaborativeEditing.getLockMeRow2(nSheetId, this.from.r2);
		this.from.c1 = collaborativeEditing.getLockMeColumn2(nSheetId, this.from.c1);
		this.from.c2 = collaborativeEditing.getLockMeColumn2(nSheetId, this.from.c2);

		this.to.r1 = collaborativeEditing.getLockMeRow2(nSheetId, this.to.r1);
		this.to.r2 = collaborativeEditing.getLockMeRow2(nSheetId, this.to.r2);
		this.to.c1 = collaborativeEditing.getLockMeColumn2(nSheetId, this.to.c1);
		this.to.c2 = collaborativeEditing.getLockMeColumn2(nSheetId, this.to.c2);
	};

	function UndoRedoData_IndexSimpleProp(index, bRow, oOldVal, oNewVal) {
		this.index = index;
		this.bRow = bRow;
		this.oOldVal = oOldVal;
		this.oNewVal = oNewVal;
	}

	UndoRedoData_IndexSimpleProp.prototype.Properties = {
		index: 0, oNewVal: 1
	};
	UndoRedoData_IndexSimpleProp.prototype.getType = function () {
		return UndoRedoDataTypes.IndexSimpleProp;
	};
	UndoRedoData_IndexSimpleProp.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_IndexSimpleProp.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.index:
				return this.index;
				break;
			case this.Properties.oNewVal:
				return this.oNewVal;
				break;
		}
		return null;
	};
	UndoRedoData_IndexSimpleProp.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.index:
				this.index = value;
				break;
			case this.Properties.oNewVal:
				this.oNewVal = value;
				break;
		}
	};
	UndoRedoData_IndexSimpleProp.prototype.applyCollaborative = function (nSheetId, collaborativeEditing) {
		if (this.bRow) {
			this.index = collaborativeEditing.getLockMeRow2(nSheetId, this.index);
		} else {
			this.index = collaborativeEditing.getLockMeColumn2(nSheetId, this.index);
		}
	};

	function UndoRedoData_ColProp(col) {
		if (null != col) {
			this.width = col.width;
			this.hd = col.hd;
			this.CustomWidth = col.CustomWidth;
			this.BestFit = col.BestFit;
		} else {
			this.width = null;
			this.hd = null;
			this.CustomWidth = null;
			this.BestFit = null;
		}
	}

	UndoRedoData_ColProp.prototype.Properties = {
		width: 0, hd: 1, CustomWidth: 2, BestFit: 3
	};
	UndoRedoData_ColProp.prototype.isEqual = function (val) {
		var defaultColWidth = AscCommonExcel.oDefaultMetrics.ColWidthChars;
		return this.hd == val.hd && this.CustomWidth == val.CustomWidth &&
			((this.BestFit == val.BestFit && this.width == val.width) ||
				((null == this.width || defaultColWidth == this.width) &&
					(null == this.BestFit || true == this.BestFit) &&
					(null == val.width || defaultColWidth == val.width) &&
					(null == val.BestFit || true == val.BestFit)));
	};
	UndoRedoData_ColProp.prototype.getType = function () {
		return UndoRedoDataTypes.ColProp;
	};
	UndoRedoData_ColProp.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_ColProp.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.width:
				return this.width;
				break;
			case this.Properties.hd:
				return this.hd;
				break;
			case this.Properties.CustomWidth:
				return this.CustomWidth;
				break;
			case this.Properties.BestFit:
				return this.BestFit;
				break;
		}
		return null;
	};
	UndoRedoData_ColProp.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.width:
				this.width = value;
				break;
			case this.Properties.hd:
				this.hd = value;
				break;
			case this.Properties.CustomWidth:
				this.CustomWidth = value;
				break;
			case this.Properties.BestFit:
				this.BestFit = value;
				break;
		}
	};

	function UndoRedoData_RowProp(row) {
		if (null != row) {
			this.h = row.getHeight();
			this.hd = row.getHidden();
			this.CustomHeight = row.getCustomHeight();
		} else {
			this.h = null;
			this.hd = null;
			this.CustomHeight = null;
		}
	}

	UndoRedoData_RowProp.prototype.Properties = {
		h: 0, hd: 1, CustomHeight: 2
	};
	UndoRedoData_RowProp.prototype.isEqual = function (val) {
		var defaultRowHeight = AscCommonExcel.oDefaultMetrics.RowHeight;
		return this.hd == val.hd && ((this.CustomHeight == val.CustomHeight && this.h == val.h) ||
			((null == this.h || defaultRowHeight == this.h) &&
				(null == this.CustomHeight || false == this.CustomHeight) &&
				(null == val.h || defaultRowHeight == val.h) &&
				(null == val.CustomHeight || false == val.CustomHeight)));
	};
	UndoRedoData_RowProp.prototype.getType = function () {
		return UndoRedoDataTypes.RowProp;
	};
	UndoRedoData_RowProp.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_RowProp.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.h:
				return this.h;
				break;
			case this.Properties.hd:
				return this.hd;
				break;
			case this.Properties.CustomHeight:
				return this.CustomHeight;
				break;
		}
		return null;
	};
	UndoRedoData_RowProp.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.h:
				this.h = value;
				break;
			case this.Properties.hd:
				this.hd = value;
				break;
			case this.Properties.CustomHeight:
				this.CustomHeight = value;
				break;
		}
	};

	function UndoRedoData_BBox(oBBox) {
		if (null != oBBox) {
			this.c1 = oBBox.c1;
			this.r1 = oBBox.r1;
			this.c2 = oBBox.c2;
			this.r2 = oBBox.r2;
		} else {
			this.c1 = null;
			this.r1 = null;
			this.c2 = null;
			this.r2 = null;
		}
	}

	UndoRedoData_BBox.prototype.Properties = {
		c1: 0, r1: 1, c2: 2, r2: 3
	};
	UndoRedoData_BBox.prototype.getType = function () {
		return UndoRedoDataTypes.BBox;
	};
	UndoRedoData_BBox.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_BBox.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.c1:
				return this.c1;
				break;
			case this.Properties.r1:
				return this.r1;
				break;
			case this.Properties.c2:
				return this.c2;
				break;
			case this.Properties.r2:
				return this.r2;
				break;
		}
		return null;
	};
	UndoRedoData_BBox.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.c1:
				this.c1 = value;
				break;
			case this.Properties.r1:
				this.r1 = value;
				break;
			case this.Properties.c2:
				this.c2 = value;
				break;
			case this.Properties.r2:
				this.r2 = value;
				break;
		}
	};
	UndoRedoData_BBox.prototype.applyCollaborative = function (nSheetId, collaborativeEditing) {
		this.r1 = collaborativeEditing.getLockMeRow2(nSheetId, this.r1);
		this.r2 = collaborativeEditing.getLockMeRow2(nSheetId, this.r2);
		this.c1 = collaborativeEditing.getLockMeColumn2(nSheetId, this.c1);
		this.c2 = collaborativeEditing.getLockMeColumn2(nSheetId, this.c2);
	};

	function UndoRedoData_SortData(bbox, places) {
		this.bbox = bbox;
		this.places = places;
	}

	UndoRedoData_SortData.prototype.Properties = {
		bbox: 0, places: 1
	};
	UndoRedoData_SortData.prototype.getType = function () {
		return UndoRedoDataTypes.SortData;
	};
	UndoRedoData_SortData.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_SortData.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.bbox:
				return this.bbox;
				break;
			case this.Properties.places:
				return this.places;
				break;
		}
		return null;
	};
	UndoRedoData_SortData.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.bbox:
				this.bbox = value;
				break;
			case this.Properties.places:
				this.places = value;
				break;
		}
	};
	UndoRedoData_SortData.prototype.applyCollaborative = function (nSheetId, collaborativeEditing) {
		this.bbox.r1 = collaborativeEditing.getLockMeRow2(nSheetId, this.bbox.r1);
		this.bbox.r2 = collaborativeEditing.getLockMeRow2(nSheetId, this.bbox.r2);
		this.bbox.c1 = collaborativeEditing.getLockMeColumn2(nSheetId, this.bbox.c1);
		this.bbox.c2 = collaborativeEditing.getLockMeColumn2(nSheetId, this.bbox.c2);
		for (var i = 0, length = this.places.length; i < length; ++i) {
			var place = this.places[i];
			place.from = collaborativeEditing.getLockMeRow2(nSheetId, place.from);
			place.to = collaborativeEditing.getLockMeRow2(nSheetId, place.to);
		}
	};

	function UndoRedoData_PivotTable(pivot, from, to) {
		this.pivot = pivot;
		this.from = from;
		this.to = to;
	}

	UndoRedoData_PivotTable.prototype.Properties = {
		pivot: 0, from: 1, to: 2
	};
	UndoRedoData_PivotTable.prototype.getType = function () {
		return UndoRedoDataTypes.PivotTable;
	};
	UndoRedoData_PivotTable.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_PivotTable.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.pivot:
				return this.pivot;
				break;
			case this.Properties.from:
				return this.from;
				break;
			case this.Properties.to:
				return this.to;
				break;
		}
		return null;
	};
	UndoRedoData_PivotTable.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.pivot:
				this.pivot = value;
				break;
			case this.Properties.from:
				this.from = value;
				break;
			case this.Properties.to:
				this.to = value;
				break;
		}
	};

	function UndoRedoData_SheetAdd(insertBefore, name, sheetidfrom, sheetid, tableNames) {
		this.insertBefore = insertBefore;
		this.name = name;
		this.sheetidfrom = sheetidfrom;
		this.sheetid = sheetid;
		//Эти поля заполняются после Undo/Redo
		this.sheet = null;

		this.tableNames = tableNames;
	}

	UndoRedoData_SheetAdd.prototype.Properties = {
		name: 0, sheetidfrom: 1, sheetid: 2, tableNames: 3, insertBefore: 4
	};
	UndoRedoData_SheetAdd.prototype.getType = function () {
		return UndoRedoDataTypes.SheetAdd;
	};
	UndoRedoData_SheetAdd.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_SheetAdd.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.name:
				return this.name;
				break;
			case this.Properties.sheetidfrom:
				return this.sheetidfrom;
				break;
			case this.Properties.sheetid:
				return this.sheetid;
				break;
			case this.Properties.tableNames:
				return this.tableNames;
				break;
			case this.Properties.insertBefore:
				return this.insertBefore;
				break;
		}
		return null;
	};
	UndoRedoData_SheetAdd.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.name:
				this.name = value;
				break;
			case this.Properties.sheetidfrom:
				this.sheetidfrom = value;
				break;
			case this.Properties.sheetid:
				this.sheetid = value;
				break;
			case this.Properties.tableNames:
				this.tableNames = value;
				break;
			case this.Properties.insertBefore:
				this.insertBefore = value;
				break;
		}
	};

	function UndoRedoData_SheetRemove(index, sheetId, sheet) {
		this.index = index;
		this.sheetId = sheetId;
		this.sheet = sheet;
	}

	UndoRedoData_SheetRemove.prototype.Properties = {
		sheetId: 0, sheet: 1
	};
	UndoRedoData_SheetRemove.prototype.getType = function () {
		return UndoRedoDataTypes.SheetRemove;
	};
	UndoRedoData_SheetRemove.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_SheetRemove.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.sheetId:
				return this.sheetId;
				break;
			case this.Properties.sheet:
				return this.sheet;
				break;
		}
		return null;
	};
	UndoRedoData_SheetRemove.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.sheetId:
				this.sheetId = value;
				break;
			case this.Properties.sheet:
				this.sheet = value;
				break;
		}
	};

	function UndoRedoData_DefinedNames(name, ref, sheetId, isTable) {
		this.name = name;
		this.ref = ref;
		this.sheetId = sheetId;
		this.isTable = isTable;
	}

	UndoRedoData_DefinedNames.prototype.Properties = {
		name: 0, ref: 1, sheetId: 2, isTable: 4
	};
	UndoRedoData_DefinedNames.prototype.getType = function () {
		return UndoRedoDataTypes.DefinedName;
	};
	UndoRedoData_DefinedNames.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_DefinedNames.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.name:
				return this.name;
				break;
			case this.Properties.ref:
				return this.ref;
				break;
			case this.Properties.sheetId:
				return this.sheetId;
				break;
			case this.Properties.isTable:
				return this.isTable;
				break;
		}
		return null;
	};
	UndoRedoData_DefinedNames.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.name:
				this.name = value;
				break;
			case this.Properties.ref:
				this.ref = value;
				break;
			case this.Properties.sheetId:
				this.sheetId = value;
				break;
			case this.Properties.isTable:
				this.isTable = value;
				break;
		}
	};

	function UndoRedoData_ClrScheme(oldVal, newVal) {
		this.oldVal = oldVal;
		this.newVal = newVal;
	}

	UndoRedoData_ClrScheme.prototype.getType = function () {
		return UndoRedoDataTypes.ClrScheme;
	};
	UndoRedoData_ClrScheme.prototype.Write_ToBinary2 = function (writer) {
		this.newVal.Write_ToBinary(writer);
	};
	UndoRedoData_ClrScheme.prototype.Read_FromBinary2 = function (reader) {
		this.newVal = new AscFormat.ClrScheme();
		this.newVal.Read_FromBinary(reader);
	};

	function UndoRedoData_AutoFilter() {

		this.undo = null;

		this.activeCells = null;
		this.styleName = null;
		this.type = null;
		this.cellId = null;
		this.autoFiltersObject = null;
		this.addFormatTableOptionsObj = null;
		this.moveFrom = null;
		this.moveTo = null;
		this.bWithoutFilter = null;
		this.displayName = null;
		this.val = null;

		this.ShowColumnStripes = null;
		this.ShowFirstColumn = null;
		this.ShowLastColumn = null;
		this.ShowRowStripes = null;

		this.HeaderRowCount = null;
		this.TotalsRowCount = null;
		this.color = null;
		this.tablePart = null;
		this.nCol = null;
		this.nRow = null;
		this.formula = null;
	}

	UndoRedoData_AutoFilter.prototype.Properties = {
		activeCells: 0,
		styleName: 1,
		type: 2,
		cellId: 3,
		autoFiltersObject: 4,
		addFormatTableOptionsObj: 5,
		moveFrom: 6,
		moveTo: 7,
		bWithoutFilter: 8,
		displayName: 9,
		val: 10,
		ShowColumnStripes: 11,
		ShowFirstColumn: 12,
		ShowLastColumn: 13,
		ShowRowStripes: 14,
		HeaderRowCount: 15,
		TotalsRowCount: 16,
		color: 17,
		tablePart: 18,
		nCol: 19,
		nRow: 20,
		formula: 21
	};
	UndoRedoData_AutoFilter.prototype.getType = function () {
		return UndoRedoDataTypes.AutoFilter;
	};
	UndoRedoData_AutoFilter.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_AutoFilter.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.activeCells:
				return new UndoRedoData_BBox(this.activeCells);
				break;
			case this.Properties.styleName:
				return this.styleName;
				break;
			case this.Properties.type:
				return this.type;
				break;
			case this.Properties.cellId:
				return this.cellId;
				break;
			case this.Properties.autoFiltersObject:
				return this.autoFiltersObject;
				break;
			case this.Properties.addFormatTableOptionsObj:
				return this.addFormatTableOptionsObj;
				break;
			case this.Properties.moveFrom:
				return new UndoRedoData_BBox(this.moveFrom);
				break;
			case this.Properties.moveTo:
				return new UndoRedoData_BBox(this.moveTo);
				break;
			case this.Properties.bWithoutFilter:
				return this.bWithoutFilter;
				break;
			case this.Properties.displayName:
				return this.displayName;
				break;
			case this.Properties.val:
				return this.val;
				break;
			case this.Properties.ShowColumnStripes:
				return this.ShowColumnStripes;
				break;
			case this.Properties.ShowFirstColumn:
				return this.ShowFirstColumn;
				break;
			case this.Properties.ShowLastColumn:
				return this.ShowLastColumn;
				break;
			case this.Properties.ShowRowStripes:
				return this.ShowRowStripes;
				break;
			case this.Properties.HeaderRowCount:
				return this.HeaderRowCount;
				break;
			case this.Properties.TotalsRowCount:
				return this.TotalsRowCount;
				break;
			case this.Properties.color:
				return this.color;
				break;
			case this.Properties.tablePart: {
				var tablePart = this.tablePart;
				if (tablePart) {
					var memory = new AscCommon.CMemory();
					var aDxfs = [];
					var oBinaryTableWriter = new AscCommonExcel.BinaryTableWriter(memory, aDxfs);
					oBinaryTableWriter.WriteTable(tablePart);
					tablePart = memory.GetBase64Memory();
				}

				return tablePart;
				break;
			}
			case this.Properties.nCol:
				return this.nCol;
				break;
			case this.Properties.nRow:
				return this.nRow;
				break;
			case this.Properties.formula:
				return this.formula;
				break;
		}

		return null;
	};
	UndoRedoData_AutoFilter.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.activeCells:
				this.activeCells = new Asc.Range(value.c1, value.r1, value.c2, value.r2);
				break;
			case this.Properties.styleName:
				this.styleName = value;
				break;
			case this.Properties.type:
				this.type = value;
				break;
			case this.Properties.cellId:
				this.cellId = value;
				break;
			case this.Properties.autoFiltersObject:
				this.autoFiltersObject = value;
				break;
			case this.Properties.addFormatTableOptionsObj:
				return this.addFormatTableOptionsObj = value;
				break;
			case this.Properties.moveFrom:
				this.moveFrom = value;
				break;
			case this.Properties.moveTo:
				this.moveTo = value;
				break;
			case this.Properties.bWithoutFilter:
				this.bWithoutFilter = value;
				break;
			case this.Properties.displayName:
				this.displayName = value;
				break;
			case this.Properties.val:
				this.val = value;
				break;
			case this.Properties.ShowColumnStripes:
				this.ShowColumnStripes = value;
				break;
			case this.Properties.ShowFirstColumn:
				this.ShowFirstColumn = value;
				break;
			case this.Properties.ShowLastColumn:
				this.ShowLastColumn = value;
				break;
			case this.Properties.ShowRowStripes:
				this.ShowRowStripes = value;
				break;
			case this.Properties.HeaderRowCount:
				this.HeaderRowCount = value;
				break;
			case this.Properties.TotalsRowCount:
				this.TotalsRowCount = value;
				break;
			case this.Properties.color:
				this.color = value;
				break;
			case this.Properties.tablePart: {
				var table;
				if (value) {
					//TODO длину скорее всего нужно записывать
					var dstLen = 0;
					dstLen += value.length;

					var pointer = g_memory.Alloc(dstLen);
					var stream = new AscCommon.FT_Stream2(pointer.data, dstLen);
					stream.obj = pointer.obj;

					var nCurOffset = 0;
					var oBinaryFileReader = new AscCommonExcel.BinaryFileReader();
					nCurOffset = oBinaryFileReader.getbase64DecodedData2(value, 0, stream, nCurOffset);

					var dxfs = [];
					var oBinaryTableReader = new AscCommonExcel.Binary_TableReader(stream, null, null, dxfs);
					oBinaryTableReader.stream = stream;
					oBinaryTableReader.oReadResult = {
						tableCustomFunc: []
					};

					var table = new AscCommonExcel.TablePart();
					var res = oBinaryTableReader.bcr.Read1(dstLen, function (t, l) {
						return oBinaryTableReader.ReadTable(t, l, table);
					});
				}

				if (table) {
					this.tablePart = table;
				}
				break;
			}
			case this.Properties.nCol:
				this.nCol = value;
				break;
			case this.Properties.nRow:
				this.nRow = value;
				break;
			case this.Properties.formula:
				this.formula = value;
				break;
		}
		return null;
	};
	UndoRedoData_AutoFilter.prototype.applyCollaborative = function (nSheetId, collaborativeEditing) {
		this.activeCells.c1 = collaborativeEditing.getLockMeColumn2(nSheetId, this.activeCells.c1);
		this.activeCells.c2 = collaborativeEditing.getLockMeColumn2(nSheetId, this.activeCells.c2);
		this.activeCells.r1 = collaborativeEditing.getLockMeRow2(nSheetId, this.activeCells.r1);
		this.activeCells.r2 = collaborativeEditing.getLockMeRow2(nSheetId, this.activeCells.r2);
	};

	function UndoRedoData_SingleProperty(elem) {
		this.elem = elem;
	}

	UndoRedoData_SingleProperty.prototype.Properties = {
		elem: 0
	};
	UndoRedoData_SingleProperty.prototype.getType = function () {
		return UndoRedoDataTypes.SingleProperty;
	};
	UndoRedoData_SingleProperty.prototype.getProperties = function () {
		return this.Properties;
	};
	UndoRedoData_SingleProperty.prototype.getProperty = function (nType) {
		switch (nType) {
			case this.Properties.elem:
				return this.elem;
				break;
		}
		return null;
	};
	UndoRedoData_SingleProperty.prototype.setProperty = function (nType, value) {
		switch (nType) {
			case this.Properties.elem:
				this.elem = value;
				break;
		}
	};

	//для применения изменений
	var UndoRedoClassTypes = new function () {
		this.aTypes = [];
		this.Add = function (fCreate) {
			var nRes = this.aTypes.length;
			this.aTypes.push(fCreate);
			return nRes;
		};
		this.Create = function (nType) {
			if (nType < this.aTypes.length) {
				return this.aTypes[nType]();
			}
			return null;
		};
	};

	function UndoRedoWorkbook(wb) {
		this.wb = wb;
		this.nType = UndoRedoClassTypes.Add(function () {
			return AscCommonExcel.g_oUndoRedoWorkbook;
		});
	}

	UndoRedoWorkbook.prototype.getClassType = function () {
		return this.nType;
	};
	UndoRedoWorkbook.prototype.Undo = function (Type, Data, nSheetId, opt_wb) {
		this.UndoRedo(Type, Data, nSheetId, true, opt_wb);
	};
	UndoRedoWorkbook.prototype.Redo = function (Type, Data, nSheetId, opt_wb) {
		this.UndoRedo(Type, Data, nSheetId, false, opt_wb);
	};
	UndoRedoWorkbook.prototype.UndoRedo = function (Type, Data, nSheetId, bUndo, opt_wb) {
		var wb = opt_wb ? opt_wb : this.wb;
		var bNeedTrigger = true;
		if (AscCH.historyitem_Workbook_SheetAdd == Type) {
			if (null == Data.insertBefore) {
				Data.insertBefore = 0;
			}
			if (bUndo) {
				var outputParams = {sheet: null};
				wb.removeWorksheet(Data.insertBefore, outputParams);
				//сохраняем тот sheet который удалили, иначе может возникнуть ошибка, если какой-то обьект запоминал ссылку на sheet(например):
				//Добавляем лист  -> Добавляем ссылку -> undo -> undo -> redo -> redo
				Data.sheet = outputParams.sheet;
			} else {
				if (null != Data.sheet) {
					//сюда заходим только если до этого было сделано Undo
					wb.insertWorksheet(Data.insertBefore, Data.sheet);
				} else {
					if (null == Data.sheetidfrom) {
						wb.createWorksheet(Data.insertBefore, Data.name, Data.sheetid);
					} else {
						var oCurWorksheet = wb.getWorksheetById(Data.sheetidfrom);
						var nIndex = oCurWorksheet.getIndex();
						wb.copyWorksheet(nIndex, Data.insertBefore, Data.name, Data.sheetid, true, Data.tableNames);
					}
				}
			}
			wb.handlers.trigger("updateWorksheetByModel");
		} else if (AscCH.historyitem_Workbook_SheetRemove == Type) {
			if (bUndo) {
				wb.insertWorksheet(Data.index, Data.sheet);
			} else {
				var nIndex = Data.index;
				if (null == nIndex) {
					var oCurWorksheet = wb.getWorksheetById(Data.sheetId);
					if (oCurWorksheet) {
						nIndex = oCurWorksheet.getIndex();
					}
				}
				if (null != nIndex) {
					wb.removeWorksheet(nIndex);
				}
			}
			wb.handlers.trigger("updateWorksheetByModel");
		} else if (AscCH.historyitem_Workbook_SheetMove == Type) {
			if (bUndo) {
				wb.replaceWorksheet(Data.to, Data.from);
			} else {
				wb.replaceWorksheet(Data.from, Data.to);
			}
			wb.handlers.trigger("updateWorksheetByModel");
		} else if (AscCH.historyitem_Workbook_ChangeColorScheme == Type) {
			bNeedTrigger = false;
			if (bUndo) {
				wb.theme.themeElements.clrScheme = Data.oldVal;
			} else {
				wb.theme.themeElements.clrScheme = Data.newVal;
			}
			wb.rebuildColors();
			wb.oApi.asc_AfterChangeColorScheme();
		} else if (AscCH.historyitem_Workbook_DefinedNamesChange === Type ||
			AscCH.historyitem_Workbook_DefinedNamesChangeUndo === Type) {
			var oldName, newName;
			if (bUndo) {
				oldName = Data.to;
				newName = Data.from;
			} else {
				if (wb.bCollaborativeChanges) {
					wb.handlers.trigger("asc_onLockDefNameManager", Asc.c_oAscDefinedNameReason.OK);
				}
				oldName = Data.from;
				newName = Data.to;
			}
			if (bUndo || AscCH.historyitem_Workbook_DefinedNamesChangeUndo !== Type) {
				if (null == newName) {
					wb.delDefinesNamesUndoRedo(oldName);
					wb.handlers.trigger("asc_onDelDefName")
				} else {
					wb.editDefinesNamesUndoRedo(oldName, newName);
					wb.handlers.trigger("asc_onEditDefName", oldName, newName);
				}
			}
		}
	};
	UndoRedoWorkbook.prototype.forwardTransformationIsAffect = function (Type) {
		return AscCH.historyitem_Workbook_SheetAdd === Type || AscCH.historyitem_Workbook_SheetRemove === Type ||
			AscCH.historyitem_Workbook_SheetMove === Type || AscCH.historyitem_Workbook_DefinedNamesChange === Type;
	};
	UndoRedoWorkbook.prototype.forwardTransformationGet = function (Type, Data, nSheetId) {
		if (AscCH.historyitem_Workbook_DefinedNamesChange === Type) {
			if (Data.newName && Data.newName.Ref) {
				return {formula: Data.newName.Ref};
			}
		} else if (AscCH.historyitem_Workbook_SheetAdd === Type) {
			return {name: Data.name};
		}
		return null;
	};
	UndoRedoWorkbook.prototype.forwardTransformationSet = function (Type, Data, nSheetId, getRes) {
		if (AscCH.historyitem_Workbook_SheetAdd === Type) {
			Data.name = getRes.name;
		} else if (AscCH.historyitem_Cell_ChangeValue === Type) {
			if (Data && Data.newName) {
				Data.newName.Ref = getRes.formula;
			}
		}
		return null;
	};

	function UndoRedoCell(wb) {
		this.wb = wb;
		this.nType = UndoRedoClassTypes.Add(function () {
			return AscCommonExcel.g_oUndoRedoCell;
		});
	}

	UndoRedoCell.prototype.getClassType = function () {
		return this.nType;
	};
	UndoRedoCell.prototype.Undo = function (Type, Data, nSheetId) {
		this.UndoRedo(Type, Data, nSheetId, true);
	};
	UndoRedoCell.prototype.Redo = function (Type, Data, nSheetId) {
		this.UndoRedo(Type, Data, nSheetId, false);
	};
	UndoRedoCell.prototype.UndoRedo = function (Type, Data, nSheetId, bUndo) {
		var ws = this.wb.getWorksheetById(nSheetId);
		if (null == ws) {
			return;
		}
		var nRow = Data.nRow;
		var nCol = Data.nCol;
		if (false != this.wb.bCollaborativeChanges) {
			var collaborativeEditing = this.wb.oApi.collaborativeEditing;
			nRow = collaborativeEditing.getLockOtherRow2(nSheetId, nRow);
			nCol = collaborativeEditing.getLockOtherColumn2(nSheetId, nCol);
			var oLockInfo = new AscCommonExcel.asc_CLockInfo();
			oLockInfo["sheetId"] = nSheetId;
			oLockInfo["type"] = c_oAscLockTypeElem.Range;
			oLockInfo["rangeOrObjectId"] = new Asc.Range(nCol, nRow, nCol, nRow);
			this.wb.aCollaborativeChangeElements.push(oLockInfo);
		}
		ws._getCell(nRow, nCol, function (cell) {
			var Val = bUndo ? Data.oOldVal : Data.oNewVal;
			if (AscCH.historyitem_Cell_Fontname == Type) {
				cell.setFontname(Val);
			} else if (AscCH.historyitem_Cell_Fontsize == Type) {
				cell.setFontsize(Val);
			} else if (AscCH.historyitem_Cell_Fontcolor == Type) {
				cell.setFontcolor(Val);
			} else if (AscCH.historyitem_Cell_Bold == Type) {
				cell.setBold(Val);
			} else if (AscCH.historyitem_Cell_Italic == Type) {
				cell.setItalic(Val);
			} else if (AscCH.historyitem_Cell_Underline == Type) {
				cell.setUnderline(Val);
			} else if (AscCH.historyitem_Cell_Strikeout == Type) {
				cell.setStrikeout(Val);
			} else if (AscCH.historyitem_Cell_FontAlign == Type) {
				cell.setFontAlign(Val);
			} else if (AscCH.historyitem_Cell_AlignVertical == Type) {
				cell.setAlignVertical(Val);
			} else if (AscCH.historyitem_Cell_AlignHorizontal == Type) {
				cell.setAlignHorizontal(Val);
			} else if (AscCH.historyitem_Cell_Fill == Type) {
				cell.setFill(Val);
			} else if (AscCH.historyitem_Cell_Border == Type) {
				if (null != Val) {
					cell.setBorder(Val.clone());
				} else {
					cell.setBorder(null);
				}
			} else if (AscCH.historyitem_Cell_ShrinkToFit == Type) {
				cell.setFill(Val);
			} else if (AscCH.historyitem_Cell_Wrap == Type) {
				cell.setWrap(Val);
			} else if (AscCH.historyitem_Cell_Num == Type) {
				cell.setNum(Val);
			} else if (AscCH.historyitem_Cell_Angle == Type) {
				cell.setAngle(Val);
			} else if (AscCH.historyitem_Cell_ChangeArrayValueFormat == Type) {
				var multiText = [];
				for (var i = 0, length = Val.length; i < length; ++i) {
					multiText.push(Val[i].clone());
				}
				cell.setValueMultiTextInternal(multiText);
			} else if (AscCH.historyitem_Cell_ChangeValue === Type || AscCH.historyitem_Cell_ChangeValueUndo === Type) {
				if (bUndo || AscCH.historyitem_Cell_ChangeValueUndo !== Type) {
					cell.setValueData(Val);
				}
			} else if (AscCH.historyitem_Cell_SetStyle == Type) {
				if (null != Val) {
					cell.setStyle(Val);
				} else {
					cell.setStyle(null);
				}
			} else if (AscCH.historyitem_Cell_SetFont == Type) {
				cell.setFont(Val);
			} else if (AscCH.historyitem_Cell_SetQuotePrefix == Type) {
				cell.setQuotePrefix(Val);
			} else if (AscCH.historyitem_Cell_SetPivotButton == Type) {
				cell.setPivotButton(Val);
			} else if (AscCH.historyitem_Cell_Style == Type) {
				cell.setCellStyle(Val);
			}
		});
	};
	UndoRedoCell.prototype.forwardTransformationGet = function (Type, Data, nSheetId) {
		if (AscCH.historyitem_Cell_ChangeValue === Type && Data.oNewVal && Data.oNewVal.formula) {
			return {formula: Data.oNewVal.formula};
		}
		return null;
	};
	UndoRedoCell.prototype.forwardTransformationSet = function (Type, Data, nSheetId, getRes) {
		if (AscCH.historyitem_Cell_ChangeValue === Type) {
			if (Data && Data.oNewVal) {
				Data.oNewVal.formula = getRes.formula;
			}
		}
		return null;
	};

	function UndoRedoWoorksheet(wb) {
		this.wb = wb;
		this.nType = UndoRedoClassTypes.Add(function () {
			return AscCommonExcel.g_oUndoRedoWorksheet;
		});
	}

	UndoRedoWoorksheet.prototype.getClassType = function () {
		return this.nType;
	};
	UndoRedoWoorksheet.prototype.Undo = function (Type, Data, nSheetId, opt_wb) {
		this.UndoRedo(Type, Data, nSheetId, true, opt_wb);
	};
	UndoRedoWoorksheet.prototype.Redo = function (Type, Data, nSheetId, opt_wb) {
		this.UndoRedo(Type, Data, nSheetId, false, opt_wb);
	};
	UndoRedoWoorksheet.prototype.UndoRedo = function (Type, Data, nSheetId, bUndo, opt_wb) {
		var wb = opt_wb ? opt_wb : this.wb;
		var worksheetView, nRow, nCol, oLockInfo, index, from, to, range, r1, c1, r2, c2, temp, i, length, data;
		var bInsert, operType; // ToDo избавиться от этого
		var ws = wb.getWorksheetById(nSheetId);
		if (null == ws) {
			return;
		}
		var collaborativeEditing = wb.oApi.collaborativeEditing;
		if (AscCH.historyitem_Worksheet_RemoveCell == Type) {
			nRow = Data.nRow;
			nCol = Data.nCol;
			if (false != wb.bCollaborativeChanges) {
				nRow = collaborativeEditing.getLockOtherRow2(nSheetId, nRow);
				nCol = collaborativeEditing.getLockOtherColumn2(nSheetId, nCol);
				oLockInfo = new AscCommonExcel.asc_CLockInfo();
				oLockInfo["sheetId"] = nSheetId;
				oLockInfo["type"] = c_oAscLockTypeElem.Range;
				oLockInfo["rangeOrObjectId"] = new Asc.Range(nCol, nRow, nCol, nRow);
				wb.aCollaborativeChangeElements.push(oLockInfo);
			}
			if (bUndo) {
				var oValue = Data.oOldVal.value;
				var oStyle = Data.oOldVal.style;
				ws._getCell(nRow, nCol, function (cell) {
					cell.setValueData(oValue);
					if (null != oStyle) {
						cell.setStyle(oStyle);
					} else {
						cell.setStyle(null);
					}
				});

			} else {
				ws._removeCell(nRow, nCol);
			}
		} else if (AscCH.historyitem_Worksheet_ColProp == Type) {
			index = Data.index;
			if (false != wb.bCollaborativeChanges) {
				if (AscCommonExcel.g_nAllColIndex == index) {
					range = new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
				} else {
					index = collaborativeEditing.getLockOtherColumn2(nSheetId, index);
					range = new Asc.Range(index, 0, index, gc_nMaxRow0);
				}
				oLockInfo = new AscCommonExcel.asc_CLockInfo();
				oLockInfo["sheetId"] = nSheetId;
				oLockInfo["type"] = c_oAscLockTypeElem.Range;
				oLockInfo["rangeOrObjectId"] = range;
				wb.aCollaborativeChangeElements.push(oLockInfo);
			}
			var col = ws._getCol(index);
			if (bUndo) {
				col.setWidthProp(Data.oOldVal);
			} else {
				col.setWidthProp(Data.oNewVal);
			}
		} else if (AscCH.historyitem_Worksheet_RowProp == Type) {
			index = Data.index;
			if (false != wb.bCollaborativeChanges) {
				index = collaborativeEditing.getLockOtherRow2(nSheetId, index);
				oLockInfo = new AscCommonExcel.asc_CLockInfo();
				oLockInfo["sheetId"] = nSheetId;
				oLockInfo["type"] = c_oAscLockTypeElem.Range;
				oLockInfo["rangeOrObjectId"] = new Asc.Range(0, index, gc_nMaxCol0, index);
				wb.aCollaborativeChangeElements.push(oLockInfo);
			}
			ws._getRow(index, function (row) {
				if (bUndo) {
					row.setHeightProp(Data.oOldVal);
				} else {
					row.setHeightProp(Data.oNewVal);
				}
			});

			//нужно для того, чтобы грамотно выставлялись цвета в ф/т при ручном скрытии строк, затрагивающих ф/т(undo/redo)
			//TODO для случая скрытия строк фильтром(undo), может два раза вызываться функция setColorStyleTable - пересмотреть
			var workSheetView = wb.oApi.wb.getWorksheetById(nSheetId);
			workSheetView.model.autoFilters.reDrawFilter(null, index);
		} else if (AscCH.historyitem_Worksheet_RowHide == Type) {
			from = Data.from;
			to = Data.to;
			nRow = Data.bRow;

			if (false != wb.bCollaborativeChanges) {
				from = collaborativeEditing.getLockOtherRow2(nSheetId, from);
				to = collaborativeEditing.getLockOtherRow2(nSheetId, to);

				oLockInfo = new AscCommonExcel.asc_CLockInfo();
				oLockInfo["sheetId"] = nSheetId;
				oLockInfo["type"] = c_oAscLockTypeElem.Range;
				oLockInfo["rangeOrObjectId"] = new Asc.Range(0, from, gc_nMaxCol0, to);
				wb.aCollaborativeChangeElements.push(oLockInfo);
			}

			if (bUndo) {
				nRow = !nRow;
			}

			ws.setRowHidden(nRow, from, to);

			var workSheetView = wb.oApi.wb.getWorksheetById(nSheetId);
			workSheetView.model.autoFilters.reDrawFilter(new Asc.Range(0, from, ws.nColsCount - 1, to));
		} else if (AscCH.historyitem_Worksheet_AddRows == Type || AscCH.historyitem_Worksheet_RemoveRows == Type) {
			from = Data.from;
			to = Data.to;
			if (false != wb.bCollaborativeChanges) {
				from = collaborativeEditing.getLockOtherRow2(nSheetId, from);
				to = collaborativeEditing.getLockOtherRow2(nSheetId, to);
				if (false == ((true == bUndo && AscCH.historyitem_Worksheet_AddRows == Type) ||
						(false == bUndo && AscCH.historyitem_Worksheet_RemoveRows == Type))) {
					oLockInfo = new AscCommonExcel.asc_CLockInfo();
					oLockInfo["sheetId"] = nSheetId;
					oLockInfo["type"] = c_oAscLockTypeElem.Range;
					oLockInfo["rangeOrObjectId"] = new Asc.Range(0, from, gc_nMaxCol0, to);
					wb.aCollaborativeChangeElements.push(oLockInfo);
				}
			}
			range = Asc.Range(0, from, gc_nMaxCol0, to);
			if ((true == bUndo && AscCH.historyitem_Worksheet_AddRows == Type) ||
				(false == bUndo && AscCH.historyitem_Worksheet_RemoveRows == Type)) {
				ws.removeRows(from, to);
				bInsert = false;
				operType = c_oAscDeleteOptions.DeleteRows;
			} else {
				ws.insertRowsBefore(from, to - from + 1);
				bInsert = true;
				operType = c_oAscInsertOptions.InsertRows;
			}

			// Нужно поменять пересчетные индексы для совместного редактирования (lock-элементы), но только если это не изменения от другого пользователя
			if (true !== wb.bCollaborativeChanges) {
				ws.workbook.handlers.trigger("undoRedoAddRemoveRowCols", nSheetId, Type, range, bUndo);
			}

			// ToDo Так делать неправильно, нужно поправить (перенести логику в model, а отрисовку отделить)
			worksheetView = wb.oApi.wb.getWorksheetById(nSheetId);
			worksheetView.cellCommentator.updateCommentsDependencies(bInsert, operType, range);
		} else if (AscCH.historyitem_Worksheet_AddCols == Type || AscCH.historyitem_Worksheet_RemoveCols == Type) {
			from = Data.from;
			to = Data.to;
			if (false != wb.bCollaborativeChanges) {
				from = collaborativeEditing.getLockOtherColumn2(nSheetId, from);
				to = collaborativeEditing.getLockOtherColumn2(nSheetId, to);
				if (false == ((true == bUndo && AscCH.historyitem_Worksheet_AddCols == Type) ||
						(false == bUndo && AscCH.historyitem_Worksheet_RemoveCols == Type))) {
					oLockInfo = new AscCommonExcel.asc_CLockInfo();
					oLockInfo["sheetId"] = nSheetId;
					oLockInfo["type"] = c_oAscLockTypeElem.Range;
					oLockInfo["rangeOrObjectId"] = new Asc.Range(from, 0, to, gc_nMaxRow0);
					wb.aCollaborativeChangeElements.push(oLockInfo);
				}
			}

			range = Asc.Range(from, 0, to, gc_nMaxRow0);
			if ((true == bUndo && AscCH.historyitem_Worksheet_AddCols == Type) ||
				(false == bUndo && AscCH.historyitem_Worksheet_RemoveCols == Type)) {
				ws.removeCols(from, to);
				bInsert = false;
				operType = c_oAscDeleteOptions.DeleteColumns;
			} else {
				ws.insertColsBefore(from, to - from + 1);
				bInsert = true;
				operType = c_oAscInsertOptions.InsertColumns;
			}

			// Нужно поменять пересчетные индексы для совместного редактирования (lock-элементы), но только если это не изменения от другого пользователя
			if (true !== wb.bCollaborativeChanges) {
				ws.workbook.handlers.trigger("undoRedoAddRemoveRowCols", nSheetId, Type, range, bUndo);
			}

			// ToDo Так делать неправильно, нужно поправить (перенести логику в model, а отрисовку отделить)
			worksheetView = wb.oApi.wb.getWorksheetById(nSheetId);
			worksheetView.cellCommentator.updateCommentsDependencies(bInsert, operType, range);
		} else if (AscCH.historyitem_Worksheet_ShiftCellsLeft == Type ||
			AscCH.historyitem_Worksheet_ShiftCellsRight == Type) {
			r1 = Data.r1;
			c1 = Data.c1;
			r2 = Data.r2;
			c2 = Data.c2;
			if (false != wb.bCollaborativeChanges) {
				r1 = collaborativeEditing.getLockOtherRow2(nSheetId, r1);
				c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, c1);
				r2 = collaborativeEditing.getLockOtherRow2(nSheetId, r2);
				c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, c2);
				if (false == ((true == bUndo && AscCH.historyitem_Worksheet_ShiftCellsLeft == Type) ||
						(false == bUndo && AscCH.historyitem_Worksheet_ShiftCellsRight == Type))) {
					oLockInfo = new AscCommonExcel.asc_CLockInfo();
					oLockInfo["sheetId"] = nSheetId;
					oLockInfo["type"] = c_oAscLockTypeElem.Range;
					oLockInfo["rangeOrObjectId"] = new Asc.Range(c1, r1, c2, r2);
					wb.aCollaborativeChangeElements.push(oLockInfo);
				}
			}

			range = ws.getRange3(r1, c1, r2, c2);
			if ((true == bUndo && AscCH.historyitem_Worksheet_ShiftCellsLeft == Type) ||
				(false == bUndo && AscCH.historyitem_Worksheet_ShiftCellsRight == Type)) {
				range.addCellsShiftRight();
				bInsert = true;
				operType = c_oAscInsertOptions.InsertCellsAndShiftRight;
			} else {
				range.deleteCellsShiftLeft();
				bInsert = false;
				operType = c_oAscDeleteOptions.DeleteCellsAndShiftLeft;
			}

			// ToDo Так делать неправильно, нужно поправить (перенести логику в model, а отрисовку отделить)
			worksheetView = wb.oApi.wb.getWorksheetById(nSheetId);
			worksheetView.cellCommentator.updateCommentsDependencies(bInsert, operType, range.bbox);
		} else if (AscCH.historyitem_Worksheet_ShiftCellsTop == Type ||
			AscCH.historyitem_Worksheet_ShiftCellsBottom == Type) {
			r1 = Data.r1;
			c1 = Data.c1;
			r2 = Data.r2;
			c2 = Data.c2;
			if (false != wb.bCollaborativeChanges) {
				r1 = collaborativeEditing.getLockOtherRow2(nSheetId, r1);
				c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, c1);
				r2 = collaborativeEditing.getLockOtherRow2(nSheetId, r2);
				c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, c2);
				if (false == ((true == bUndo && AscCH.historyitem_Worksheet_ShiftCellsTop == Type) ||
						(false == bUndo && AscCH.historyitem_Worksheet_ShiftCellsBottom == Type))) {
					oLockInfo = new AscCommonExcel.asc_CLockInfo();
					oLockInfo["sheetId"] = nSheetId;
					oLockInfo["type"] = c_oAscLockTypeElem.Range;
					oLockInfo["rangeOrObjectId"] = new Asc.Range(c1, r1, c2, r2);
					wb.aCollaborativeChangeElements.push(oLockInfo);
				}
			}

			range = ws.getRange3(r1, c1, r2, c2);
			if ((true == bUndo && AscCH.historyitem_Worksheet_ShiftCellsTop == Type) ||
				(false == bUndo && AscCH.historyitem_Worksheet_ShiftCellsBottom == Type)) {
				range.addCellsShiftBottom();
				bInsert = true;
				operType = c_oAscInsertOptions.InsertCellsAndShiftDown;
			} else {
				range.deleteCellsShiftUp();
				bInsert = false;
				operType = c_oAscDeleteOptions.DeleteCellsAndShiftTop;
			}

			// ToDo Так делать неправильно, нужно поправить (перенести логику в model, а отрисовку отделить)
			worksheetView = wb.oApi.wb.getWorksheetById(nSheetId);
			worksheetView.cellCommentator.updateCommentsDependencies(bInsert, operType, range.bbox);
		} else if (AscCH.historyitem_Worksheet_Sort == Type) {
			var bbox = Data.bbox;
			var places = Data.places;
			if (false != wb.bCollaborativeChanges) {
				bbox.r1 = collaborativeEditing.getLockOtherRow2(nSheetId, bbox.r1);
				bbox.c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, bbox.c1);
				bbox.r2 = collaborativeEditing.getLockOtherRow2(nSheetId, bbox.r2);
				bbox.c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, bbox.c2);
				for (i = 0, length = Data.places.length; i < length; ++i) {
					var place = Data.places[i];
					place.from = collaborativeEditing.getLockOtherRow2(nSheetId, place.from);
					place.to = collaborativeEditing.getLockOtherRow2(nSheetId, place.to);
					oLockInfo = new AscCommonExcel.asc_CLockInfo();
					oLockInfo["sheetId"] = nSheetId;
					oLockInfo["type"] = c_oAscLockTypeElem.Range;
					oLockInfo["rangeOrObjectId"] = new Asc.Range(bbox.c1, place.from, bbox.c2, place.from);
					wb.aCollaborativeChangeElements.push(oLockInfo);
				}
			}
			range = ws.getRange3(bbox.r1, bbox.c1, bbox.r2, bbox.c2);
			range._sortByArray(bbox, places);

			worksheetView = wb.oApi.wb.getWorksheetById(nSheetId);
			worksheetView.model.autoFilters.resetTableStyles(bbox);
		} else if (AscCH.historyitem_Worksheet_MoveRange == Type) {
			//todo worksheetView.autoFilters._moveAutoFilters(worksheetView ,null, null, g_oUndoRedoAutoFiltersMoveData);
			from = Asc.Range(Data.from.c1, Data.from.r1, Data.from.c2, Data.from.r2);
			to = Asc.Range(Data.to.c1, Data.to.r1, Data.to.c2, Data.to.r2);
			var copyRange = Data.copyRange;

			if (bUndo) {
				temp = from;
				from = to;
				to = temp;
			}
			if (false != wb.bCollaborativeChanges) {
				var coBBoxTo = Asc.Range(0, 0, 0, 0), coBBoxFrom = Asc.Range(0, 0, 0, 0);

				coBBoxTo.r1 = collaborativeEditing.getLockOtherRow2(nSheetId, to.r1);
				coBBoxTo.c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, to.c1);
				coBBoxTo.r2 = collaborativeEditing.getLockOtherRow2(nSheetId, to.r2);
				coBBoxTo.c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, to.c2);

				coBBoxFrom.r1 = collaborativeEditing.getLockOtherRow2(nSheetId, from.r1);
				coBBoxFrom.c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, from.c1);
				coBBoxFrom.r2 = collaborativeEditing.getLockOtherRow2(nSheetId, from.r2);
				coBBoxFrom.c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, from.c2);

				ws._moveRange(coBBoxFrom, coBBoxTo, copyRange);
			} else {
				ws._moveRange(from, to, copyRange);
			}
			worksheetView = wb.oApi.wb.getWorksheetById(nSheetId);
			if (bUndo)//если на Undo перемещается диапазон из форматированной таблицы - стиль форматированной таблицы не должен цепляться
			{
				worksheetView.model.autoFilters._cleanStyleTable(to);
			}

			worksheetView.model.autoFilters.reDrawFilter(to);
			worksheetView.model.autoFilters.reDrawFilter(from);
		} else if (AscCH.historyitem_Worksheet_Rename == Type) {
			if (bUndo) {
				ws.setName(Data.from, true);
			} else {
				ws.setName(Data.to, true);
			}
		} else if (AscCH.historyitem_Worksheet_Hide == Type) {
			if (bUndo) {
				ws.setHidden(Data.from);
			} else {
				ws.setHidden(Data.to);
			}
		} else if (AscCH.historyitem_Worksheet_SetDisplayGridlines === Type) {
			ws.setDisplayGridlines(bUndo ? Data.from : Data.to);
		} else if (AscCH.historyitem_Worksheet_SetDisplayHeadings === Type) {
			ws.setDisplayHeadings(bUndo ? Data.from : Data.to);
		} else if (AscCH.historyitem_Worksheet_ChangeMerge === Type) {
			from = null;
			if (null != Data.from && null != Data.from.r1 && null != Data.from.c1 && null != Data.from.r2 &&
				null != Data.from.c2) {
				from = new Asc.Range(Data.from.c1, Data.from.r1, Data.from.c2, Data.from.r2);
				if (false != wb.bCollaborativeChanges) {
					from.r1 = collaborativeEditing.getLockOtherRow2(nSheetId, from.r1);
					from.c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, from.c1);
					from.r2 = collaborativeEditing.getLockOtherRow2(nSheetId, from.r2);
					from.c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, from.c2);
				}
			}
			to = null;
			if (null != Data.to && null != Data.to.r1 && null != Data.to.c1 && null != Data.to.r2 &&
				null != Data.to.c2) {
				to = new Asc.Range(Data.to.c1, Data.to.r1, Data.to.c2, Data.to.r2);
				if (false != wb.bCollaborativeChanges) {
					to.r1 = collaborativeEditing.getLockOtherRow2(nSheetId, to.r1);
					to.c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, to.c1);
					to.r2 = collaborativeEditing.getLockOtherRow2(nSheetId, to.r2);
					to.c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, to.c2);
				}
			}
			if (bUndo) {
				temp = from;
				from = to;
				to = temp;
			}
			if (null != from) {
				var aMerged = ws.mergeManager.get(from);
				for (i in aMerged.inner) {
					var merged = aMerged.inner[i];
					if (merged.bbox.isEqual(from)) {
						ws.mergeManager.removeElement(merged);
						break;
					}
				}
			}
			data = 1;
			if (null != to) {
				ws.mergeManager.add(to, data);
			}
		} else if (AscCH.historyitem_Worksheet_ChangeHyperlink === Type) {
			from = null;
			if (null != Data.from && null != Data.from.r1 && null != Data.from.c1 && null != Data.from.r2 &&
				null != Data.from.c2) {
				from = new Asc.Range(Data.from.c1, Data.from.r1, Data.from.c2, Data.from.r2);
				if (false != wb.bCollaborativeChanges) {
					from.r1 = collaborativeEditing.getLockOtherRow2(nSheetId, from.r1);
					from.c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, from.c1);
					from.r2 = collaborativeEditing.getLockOtherRow2(nSheetId, from.r2);
					from.c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, from.c2);
				}
			}
			to = null;
			if (null != Data.to && null != Data.to.r1 && null != Data.to.c1 && null != Data.to.r2 &&
				null != Data.to.c2) {
				to = new Asc.Range(Data.to.c1, Data.to.r1, Data.to.c2, Data.to.r2);
				if (false != wb.bCollaborativeChanges) {
					to.r1 = collaborativeEditing.getLockOtherRow2(nSheetId, to.r1);
					to.c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, to.c1);
					to.r2 = collaborativeEditing.getLockOtherRow2(nSheetId, to.r2);
					to.c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, to.c2);
				}
			}
			if (bUndo) {
				temp = from;
				from = to;
				to = temp;
			}
			//не делаем clone потому что предполагаем, что здесь могут быть только операции изменения рзмеров, перемещение или удаления одной ссылки
			data = null;
			if (null != from) {
				var aHyperlinks = ws.hyperlinkManager.get(from);
				for (i in aHyperlinks.inner) {
					var hyp = aHyperlinks.inner[i];
					if (hyp.bbox.isEqual(from)) {
						data = hyp.data;
						ws.hyperlinkManager.removeElement(hyp);
						break;
					}
				}
			}
			if (null == data) {
				data = Data.hyperlink;
			}
			if (null != data && null != to) {
				data.Ref = ws.getRange3(to.r1, to.c1, to.r2, to.c2);
				ws.hyperlinkManager.add(to, data);
			}
		} else if (AscCH.historyitem_Worksheet_ChangeFrozenCell === Type) {
			worksheetView = wb.oApi.wb.getWorksheetById(nSheetId);
			var updateData = bUndo ? Data.from : Data.to;
			worksheetView._updateFreezePane(updateData.c1, updateData.r1, /*lockDraw*/true);
		} else if (AscCH.historyitem_Worksheet_SetTabColor === Type) {
			ws.setTabColor(bUndo ? Data.from : Data.to);
		}
	};
	UndoRedoWoorksheet.prototype.forwardTransformationIsAffect = function (Type) {
		return AscCH.historyitem_Worksheet_AddRows === Type || AscCH.historyitem_Worksheet_RemoveRows === Type ||
			AscCH.historyitem_Worksheet_AddCols === Type || AscCH.historyitem_Worksheet_RemoveCols === Type ||
			AscCH.historyitem_Worksheet_ShiftCellsLeft === Type || AscCH.historyitem_Worksheet_ShiftCellsRight ===
			Type || AscCH.historyitem_Worksheet_ShiftCellsTop === Type ||
			AscCH.historyitem_Worksheet_ShiftCellsBottom === Type || AscCH.historyitem_Worksheet_MoveRange === Type ||
			AscCH.historyitem_Worksheet_Rename === Type;
	};
	UndoRedoWoorksheet.prototype.forwardTransformationGet = function (Type, Data, nSheetId) {
		if (AscCH.historyitem_Worksheet_Rename === Type) {
			return {from: Data.from, name: Data.to};
		}
		return null;
	};
	UndoRedoWoorksheet.prototype.forwardTransformationSet = function (Type, Data, nSheetId, getRes) {
		if (AscCH.historyitem_Worksheet_Rename === Type) {
			Data.from = getRes.from;
			Data.to = getRes.name;
		}
		return null;
	};

	function UndoRedoRowCol(wb, bRow) {
		this.wb = wb;
		this.bRow = bRow;
		this.nTypeRow = UndoRedoClassTypes.Add(function () {
			return AscCommonExcel.g_oUndoRedoRow;
		});
		this.nTypeCol = UndoRedoClassTypes.Add(function () {
			return AscCommonExcel.g_oUndoRedoCol;
		});
	}

	UndoRedoRowCol.prototype.getClassType = function () {
		if (this.bRow) {
			return this.nTypeRow;
		} else {
			return this.nTypeCol;
		}
	};
	UndoRedoRowCol.prototype.Undo = function (Type, Data, nSheetId) {
		this.UndoRedo(Type, Data, nSheetId, true);
	};
	UndoRedoRowCol.prototype.Redo = function (Type, Data, nSheetId) {
		this.UndoRedo(Type, Data, nSheetId, false);
	};
	UndoRedoRowCol.prototype.UndoRedo = function (Type, Data, nSheetId, bUndo) {
		var ws = this.wb.getWorksheetById(nSheetId);
		if (null == ws) {
			return;
		}
		var nIndex = Data.index;
		if (false != this.wb.bCollaborativeChanges) {
			var collaborativeEditing = this.wb.oApi.collaborativeEditing;
			var oLockInfo = new AscCommonExcel.asc_CLockInfo();
			oLockInfo["sheetId"] = nSheetId;
			oLockInfo["type"] = c_oAscLockTypeElem.Range;
			if (this.bRow) {
				nIndex = collaborativeEditing.getLockOtherRow2(nSheetId, nIndex);
				oLockInfo["rangeOrObjectId"] = new Asc.Range(0, nIndex, gc_nMaxCol0, nIndex);
			} else {
				if (AscCommonExcel.g_nAllColIndex == nIndex) {
					oLockInfo["rangeOrObjectId"] = new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
				} else {
					nIndex = collaborativeEditing.getLockOtherColumn2(nSheetId, nIndex);
					oLockInfo["rangeOrObjectId"] = new Asc.Range(nIndex, 0, nIndex, gc_nMaxRow0);
				}
			}
			this.wb.aCollaborativeChangeElements.push(oLockInfo);
		}
		var Val;
		if (bUndo) {
			Val = Data.oOldVal;
		} else {
			Val = Data.oNewVal;
		}

		function fAction(row) {
			if (AscCH.historyitem_RowCol_SetFont == Type) {
				row.setFont(Val);
			} else if (AscCH.historyitem_RowCol_Fontname == Type) {
				row.setFontname(Val);
			} else if (AscCH.historyitem_RowCol_Fontsize == Type) {
				row.setFontsize(Val);
			} else if (AscCH.historyitem_RowCol_Fontcolor == Type) {
				row.setFontcolor(Val);
			} else if (AscCH.historyitem_RowCol_Bold == Type) {
				row.setBold(Val);
			} else if (AscCH.historyitem_RowCol_Italic == Type) {
				row.setItalic(Val);
			} else if (AscCH.historyitem_RowCol_Underline == Type) {
				row.setUnderline(Val);
			} else if (AscCH.historyitem_RowCol_Strikeout == Type) {
				row.setStrikeout(Val);
			} else if (AscCH.historyitem_RowCol_FontAlign == Type) {
				row.setFontAlign(Val);
			} else if (AscCH.historyitem_RowCol_AlignVertical == Type) {
				row.setAlignVertical(Val);
			} else if (AscCH.historyitem_RowCol_AlignHorizontal == Type) {
				row.setAlignHorizontal(Val);
			} else if (AscCH.historyitem_RowCol_Fill == Type) {
				row.setFill(Val);
			} else if (AscCH.historyitem_RowCol_Border == Type) {
				if (null != Val) {
					row.setBorder(Val.clone());
				} else {
					row.setBorder(null);
				}
			} else if (AscCH.historyitem_RowCol_ShrinkToFit == Type) {
				row.setShrinkToFit(Val);
			} else if (AscCH.historyitem_RowCol_Wrap == Type) {
				row.setWrap(Val);
			} else if (AscCH.historyitem_RowCol_Num == Type) {
				row.setNum(Val);
			} else if (AscCH.historyitem_RowCol_Angle == Type) {
				row.setAngle(Val);
			} else if (AscCH.historyitem_RowCol_SetStyle == Type) {
				row.setStyle(Val);
			} else if (AscCH.historyitem_RowCol_SetCellStyle == Type) {
				row.setCellStyle(Val);
			}
		}

		if (this.bRow) {
			ws._getRow(nIndex, fAction);
		} else {
			var row = ws._getCol(nIndex);
			fAction(row);
		}
	};

	function UndoRedoComment(wb) {
		this.wb = wb;
		this.nType = UndoRedoClassTypes.Add(function () {
			return AscCommonExcel.g_oUndoRedoComment;
		});
	}

	UndoRedoComment.prototype.getClassType = function () {
		return this.nType;
	};
	UndoRedoComment.prototype.Undo = function (Type, Data, nSheetId) {
		this.UndoRedo(Type, Data, nSheetId, true);
	};
	UndoRedoComment.prototype.Redo = function (Type, Data, nSheetId) {
		this.UndoRedo(Type, Data, nSheetId, false);
	};
	UndoRedoComment.prototype.UndoRedo = function (Type, Data, nSheetId, bUndo) {
		var collaborativeEditing, to;
		var oModel = (null == nSheetId) ? this.wb : this.wb.getWorksheetById(nSheetId);
		if (!oModel.aComments) {
			oModel.aComments = [];
		}

		var api = window["Asc"]["editor"];
		if (!api.wb) {
			return;
		}
		var ws = (null == nSheetId) ? api.wb : api.wb.getWorksheetById(nSheetId);
		Data.worksheet = ws;

		var cellCommentator = ws.cellCommentator;
		if (bUndo == true) {
			cellCommentator.Undo(Type, Data);
		} else {
			to = (Data.from || Data.to) ? Data.to : Data;
			if (to && !to.bDocument && false !== this.wb.bCollaborativeChanges) {
				collaborativeEditing = this.wb.oApi.collaborativeEditing;
				to.nRow = collaborativeEditing.getLockOtherRow2(nSheetId, to.nRow);
				to.nCol = collaborativeEditing.getLockOtherColumn2(nSheetId, to.nCol);
			}

			cellCommentator.Redo(Type, Data);
		}
	};

	function UndoRedoAutoFilters(wb) {
		this.wb = wb;
		this.nType = UndoRedoClassTypes.Add(function () {
			return AscCommonExcel.g_oUndoRedoAutoFilters;
		});
	}

	UndoRedoAutoFilters.prototype.getClassType = function () {
		return this.nType;
	};
	UndoRedoAutoFilters.prototype.Undo = function (Type, Data, nSheetId, opt_wb) {
		this.UndoRedo(Type, Data, nSheetId, true, opt_wb);
	};
	UndoRedoAutoFilters.prototype.Redo = function (Type, Data, nSheetId, opt_wb) {
		this.UndoRedo(Type, Data, nSheetId, false, opt_wb);
	};
	UndoRedoAutoFilters.prototype.UndoRedo = function (Type, Data, nSheetId, bUndo, opt_wb) {
		var wb = opt_wb ? opt_wb : this.wb;
		var ws = wb.getWorksheetById(nSheetId);
		if (ws) {
			var autoFilters = ws.autoFilters;
			if (bUndo === true) {
				autoFilters.Undo(Type, Data);
			} else {
				if (AscCH.historyitem_AutoFilter_ChangeColumnName === Type ||
					AscCH.historyitem_AutoFilter_ChangeTotalRow === Type) {
					if (false != this.wb.bCollaborativeChanges) {
						var collaborativeEditing = this.wb.oApi.collaborativeEditing;
						Data.nRow = collaborativeEditing.getLockOtherRow2(nSheetId, Data.nRow);
						Data.nCol = collaborativeEditing.getLockOtherColumn2(nSheetId, Data.nCol);
					}
				}
				autoFilters.Redo(Type, Data);
			}
		}
	};
	UndoRedoAutoFilters.prototype.forwardTransformationIsAffect = function (Type) {
		return AscCH.historyitem_AutoFilter_Add === Type || AscCH.historyitem_AutoFilter_ChangeTableName === Type ||
			AscCH.historyitem_AutoFilter_Empty === Type || AscCH.historyitem_AutoFilter_ChangeColumnName === Type;
	};

	function UndoRedoSparklines(wb) {
		this.wb = wb;
		this.nType = UndoRedoClassTypes.Add(function () {
			return AscCommonExcel.g_oUndoRedoSparklines;
		});
	}

	UndoRedoSparklines.prototype.getClassType = function () {
		return this.nType;
	};
	UndoRedoSparklines.prototype.Undo = function (Type, Data, nSheetId) {
		this.UndoRedo(Type, Data, nSheetId, true);
	};
	UndoRedoSparklines.prototype.Redo = function (Type, Data, nSheetId) {
		this.UndoRedo(Type, Data, nSheetId, false);
	};
	UndoRedoSparklines.prototype.UndoRedo = function (Type, Data, nSheetId, bUndo) {
	};

	function UndoRedoPivotTables(wb) {
		this.wb = wb;
		this.nType = UndoRedoClassTypes.Add(function () {
			return AscCommonExcel.g_oUndoRedoPivotTables;
		});
	}

	UndoRedoPivotTables.prototype.getClassType = function () {
		return this.nType;
	};
	UndoRedoPivotTables.prototype.Undo = function (Type, Data, nSheetId) {
		this.UndoRedo(Type, Data, nSheetId, true);
	};
	UndoRedoPivotTables.prototype.Redo = function (Type, Data, nSheetId) {
		this.UndoRedo(Type, Data, nSheetId, false);
	};
	UndoRedoPivotTables.prototype.UndoRedo = function (Type, Data, nSheetId, bUndo) {
		var ws = this.wb.getWorksheetById(nSheetId);
		if (!ws) {
			return;
		}
		var pivotTable = ws.getPivotTableByName(Data.pivot);
		if (!pivotTable) {
			return;
		}

		var value = bUndo ? Data.from : Data.to;
		switch (Type) {
			case AscCH.historyitem_PivotTable_StyleName:
				pivotTable.asc_getStyleInfo()._setName(value);
				break;
			case AscCH.historyitem_PivotTable_StyleShowRowHeaders:
				pivotTable.asc_getStyleInfo()._setShowRowHeaders(value);
				break;
			case AscCH.historyitem_PivotTable_StyleShowColHeaders:
				pivotTable.asc_getStyleInfo()._setShowColHeaders(value);
				break;
			case AscCH.historyitem_PivotTable_StyleShowRowStripes:
				pivotTable.asc_getStyleInfo()._setShowRowStripes(value);
				break;
			case AscCH.historyitem_PivotTable_StyleShowColStripes:
				pivotTable.asc_getStyleInfo()._setShowColStripes(value);
				break;
		}

		// ToDo not the best way to update
		if (pivotTable.isInit) {
			var pivotRange = pivotTable.getRange();
			ws.updatePivotTablesStyle(pivotRange);
			var api = window["Asc"]["editor"];
			api.wb.getWorksheet()._onUpdateFormatTable(pivotRange);
		}
	};

	//----------------------------------------------------------export----------------------------------------------------
	window['AscCommonExcel'] = window['AscCommonExcel'] || {};
	window['AscCommonExcel'].UndoRedoItemSerializable = UndoRedoItemSerializable;
	window['AscCommonExcel'].UndoRedoDataTypes = UndoRedoDataTypes;
	window['AscCommonExcel'].UndoRedoData_CellSimpleData = UndoRedoData_CellSimpleData;
	window['AscCommonExcel'].UndoRedoData_CellData = UndoRedoData_CellData;
	window['AscCommonExcel'].UndoRedoData_CellValueData = UndoRedoData_CellValueData;
	window['AscCommonExcel'].UndoRedoData_FromToRowCol = UndoRedoData_FromToRowCol;
	window['AscCommonExcel'].UndoRedoData_FromTo = UndoRedoData_FromTo;
	window['AscCommonExcel'].UndoRedoData_FromToHyperlink = UndoRedoData_FromToHyperlink;
	window['AscCommonExcel'].UndoRedoData_IndexSimpleProp = UndoRedoData_IndexSimpleProp;
	window['AscCommonExcel'].UndoRedoData_ColProp = UndoRedoData_ColProp;
	window['AscCommonExcel'].UndoRedoData_RowProp = UndoRedoData_RowProp;
	window['AscCommonExcel'].UndoRedoData_BBox = UndoRedoData_BBox;
	window['AscCommonExcel'].UndoRedoData_SortData = UndoRedoData_SortData;
	window['AscCommonExcel'].UndoRedoData_PivotTable = UndoRedoData_PivotTable;
	window['AscCommonExcel'].UndoRedoData_SheetAdd = UndoRedoData_SheetAdd;
	window['AscCommonExcel'].UndoRedoData_SheetRemove = UndoRedoData_SheetRemove;
	window['AscCommonExcel'].UndoRedoData_DefinedNames = UndoRedoData_DefinedNames;
	window['AscCommonExcel'].UndoRedoData_ClrScheme = UndoRedoData_ClrScheme;
	window['AscCommonExcel'].UndoRedoData_AutoFilter = UndoRedoData_AutoFilter;
	window['AscCommonExcel'].UndoRedoData_SingleProperty = UndoRedoData_SingleProperty;
	window['AscCommonExcel'].UndoRedoWorkbook = UndoRedoWorkbook;
	window['AscCommonExcel'].UndoRedoCell = UndoRedoCell;
	window['AscCommonExcel'].UndoRedoWoorksheet = UndoRedoWoorksheet;
	window['AscCommonExcel'].UndoRedoRowCol = UndoRedoRowCol;
	window['AscCommonExcel'].UndoRedoComment = UndoRedoComment;
	window['AscCommonExcel'].UndoRedoAutoFilters = UndoRedoAutoFilters;
	window['AscCommonExcel'].UndoRedoSparklines = UndoRedoSparklines;
	window['AscCommonExcel'].UndoRedoPivotTables = UndoRedoPivotTables;

	window['AscCommonExcel'].g_oUndoRedoWorkbook = null;
	window['AscCommonExcel'].g_oUndoRedoCell = null;
	window['AscCommonExcel'].g_oUndoRedoWorksheet = null;
	window['AscCommonExcel'].g_oUndoRedoRow = null;
	window['AscCommonExcel'].g_oUndoRedoCol = null;
	window['AscCommonExcel'].g_oUndoRedoComment = null;
	window['AscCommonExcel'].g_oUndoRedoAutoFilters = null;
	window['AscCommonExcel'].g_oUndoRedoSparklines = null;
	window['AscCommonExcel'].g_oUndoRedoPivotTables = null;
})(window);
