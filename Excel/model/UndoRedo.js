var c_oUndoRedoSerializeType =
{
    Null:0,
    Byte:1,
	Bool:2,
    Short:3,
    Three:4,
    Long:5,
    Double:6,
    String:7,
	Object:8,
	Array:9
};
//главный обьект для пересылки изменений
function UndoRedoItemSerializable(oClass, nActionType, nSheetId, oRange, oData)
{
	this.oClass = oClass;
	this.nActionType = nActionType;
	this.nSheetId = nSheetId;
	this.oRange = oRange;
	this.oData = oData;
}
UndoRedoItemSerializable.prototype = {
	Serialize : function(oBinaryWriter, collaborativeEditing)
	{
		if(this.oData.getType)
		{
			var oThis = this;
			var oBinaryCommonWriter = new BinaryCommonWriter(oBinaryWriter);
			oBinaryCommonWriter.WriteItemWithLength(function(){oThis.SerializeInner(oBinaryWriter, collaborativeEditing);});
		}
	},
	SerializeInner : function(oBinaryWriter, collaborativeEditing)
	{
		//nClassType
		var nClassType = this.oClass.getClassType();
		oBinaryWriter.WriteByte(nClassType);
		//nActionType
		oBinaryWriter.WriteByte(this.nActionType);
		//nSheetId
		if(null != this.nSheetId)
		{
			oBinaryWriter.WriteBool(true);
			oBinaryWriter.WriteString2(this.nSheetId.toString());
		}
		else
			oBinaryWriter.WriteBool(false);
		//oRange
		if(null != this.oRange)
		{
			oBinaryWriter.WriteBool(true);
			var c1 = this.oRange.c1;
			var c2 = this.oRange.c2;
			var r1 = this.oRange.r1;
			var r2 = this.oRange.r2;
			if(null != this.nSheetId && (0 != c1 || gc_nMaxCol0 != c2))
			{
				c1 = collaborativeEditing.getLockMeColumn2(this.nSheetId, c1);
				c2 = collaborativeEditing.getLockMeColumn2(this.nSheetId, c2);
			}
			if(null != this.nSheetId && (0 != r1 || gc_nMaxRow0 != r2))
			{
				r1 = collaborativeEditing.getLockMeRow2(this.nSheetId, r1);
				r2 = collaborativeEditing.getLockMeRow2(this.nSheetId, r2);
			}
			oBinaryWriter.WriteLong(c1);
			oBinaryWriter.WriteLong(r1);
			oBinaryWriter.WriteLong(c2);
			oBinaryWriter.WriteLong(r2);
		}
		else
			oBinaryWriter.WriteBool(false);
		//oData
		this.SerializeDataObject(oBinaryWriter, this.oData, this.nSheetId, collaborativeEditing);
	},
	SerializeDataObject : function(oBinaryWriter, oData, nSheetId, collaborativeEditing)
	{
		var oThis = this;
		if(oData.getType)
		{
			var nDataType = oData.getType();
			//не далаем копию oData, а сдвигаем в ней, потому что все равно после сериализации изменения потруться
			if(null != oData.applyCollaborative)
				oData.applyCollaborative(nSheetId, collaborativeEditing);
			oBinaryWriter.WriteByte(nDataType);
			var oBinaryCommonWriter = new BinaryCommonWriter(oBinaryWriter);
			if(oData.Write_ToBinary2)
				oBinaryCommonWriter.WriteItemWithLength(function(){oData.Write_ToBinary2(oBinaryWriter)});
			else
				oBinaryCommonWriter.WriteItemWithLength(function(){oThis.SerializeDataInner(oBinaryWriter, oData, false, nSheetId, collaborativeEditing);});
		}
		else
		{
			oBinaryWriter.WriteByte(UndoRedoDataTypes.Unknown);
			oBinaryWriter.WriteLong(0);
		}
	},
	SerializeDataInner : function(oBinaryWriter, oData, bIsArray, nSheetId, collaborativeEditing)
	{
		var oThis = this;
		var oProperties;
		if(bIsArray)
			oProperties = oData;
		else
			oProperties = oData.getProperties();
		for(var i in oProperties)
		{
			var oItem;
			var nItemType;
			if(bIsArray)
			{
				nItemType = i - 0;
				oItem = oProperties[i];
			}
			else
			{
				nItemType = oProperties[i];
				oItem = oData.getProperty(nItemType);
			}
			var sTypeOf;
			if(null == oItem)
				sTypeOf = "null";
			else if(oItem instanceof Array)
				sTypeOf = "array";
			else
				sTypeOf = typeof(oItem);
			var bUnknown = false;
			switch(sTypeOf)
			{
				case "object":
					oBinaryWriter.WriteByte(nItemType);
					oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Object);
					this.SerializeDataObject(oBinaryWriter, oItem, nSheetId, collaborativeEditing);
				break;
				case "array":
					oBinaryWriter.WriteByte(nItemType);
					oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Array);
					var oBinaryCommonWriter = new BinaryCommonWriter(oBinaryWriter);
					oBinaryCommonWriter.WriteItemWithLength(function(){oThis.SerializeDataInner(oBinaryWriter, oItem, true, nSheetId, collaborativeEditing);});
				break;
				case "number":
					oBinaryWriter.WriteByte(nItemType);
					var nFlorItem = Math.floor(oItem);
					if(nFlorItem == oItem)
					{
						if(oItem >= 0 && oItem <= 255)
						{
							oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Byte);
							oBinaryWriter.WriteByte(oItem);
						}
						else if(oItem <= 0xffffffff)
						{
							oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Long);
							oBinaryWriter.WriteLong(oItem);
						}
						else
						{
							oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Double);
							oBinaryWriter.WriteDouble2(oItem);
						}
					}
					else
					{
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
				case "undefined":
					oBinaryWriter.WriteByte(nItemType);
					oBinaryWriter.WriteByte(c_oUndoRedoSerializeType.Null);
				default:
					break;
			}
		}
	},
	Deserialize : function(oBinaryReader)
	{
		var res = c_oSerConstants.ReadOk;
		res = oBinaryReader.EnterFrame(4);
		var nLength = oBinaryReader.GetULongLE();
		res = oBinaryReader.EnterFrame(nLength);
        if(c_oSerConstants.ReadOk != res)
            return res;
		var nClassType = oBinaryReader.GetUChar();
		this.oClass = UndoRedoClassTypes.Create(nClassType);
		this.nActionType = oBinaryReader.GetUChar();
		var bSheetId = oBinaryReader.GetBool();
		if(bSheetId)
			this.nSheetId = oBinaryReader.GetString2LE(oBinaryReader.GetULongLE());
		var bRange = oBinaryReader.GetBool();
		if(bRange)
		{
			var nC1 = oBinaryReader.GetULongLE();
			var nR1 = oBinaryReader.GetULongLE();
			var nC2 = oBinaryReader.GetULongLE();
			var nR2 = oBinaryReader.GetULongLE();
			this.oRange = new Asc.Range(nC1, nR1, nC2, nR2);
		}
		else
			this.oRange = null;
		this.oData = this.DeserializeData(oBinaryReader);
	},
	DeserializeData : function(oBinaryReader)
	{
		var oDataObject = null;
		var nDataClassType = oBinaryReader.GetUChar();
		var nLength = oBinaryReader.GetULongLE();
		oDataObject = UndoRedoDataTypes.Create(nDataClassType);
		if(null != oDataObject)
		{
			if(null != oDataObject.Read_FromBinary2)
				oDataObject.Read_FromBinary2(oBinaryReader);
			else if(null != oDataObject.Read_FromBinary2AndReplace)
				oDataObject = oDataObject.Read_FromBinary2AndReplace(oBinaryReader);
			else
				this.DeserializeDataInner(oBinaryReader, oDataObject, nLength, false);
		}
		else
			oBinaryReader.Skip(nLength);
		return oDataObject;
	},
	DeserializeDataInner : function(oBinaryReader, oDataObject, nLength, bIsArray)
	{
		var nStartPos = oBinaryReader.GetCurPos();
		var nCurPos = nStartPos;
		while(nCurPos - nStartPos < nLength && nCurPos < oBinaryReader.GetSize() - 1)
		{
			var nMemeberType = oBinaryReader.GetUChar();
			var nDataType = oBinaryReader.GetUChar();
			var nUnknownType = false;
			var oNewValue = null;
			switch(nDataType)
			{
				case c_oUndoRedoSerializeType.Null:
					oNewValue = null;
					break;
				case c_oUndoRedoSerializeType.Bool:
					oNewValue = oBinaryReader.GetBool();
					break;
				case c_oUndoRedoSerializeType.Byte:
					oNewValue = oBinaryReader.GetUChar();
					break;
				case c_oUndoRedoSerializeType.Long:
					oNewValue = oBinaryReader.GetULongLE();
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
					var aNewArray = new Array();
					var nNewLength = oBinaryReader.GetULongLE();
					this.DeserializeDataInner(oBinaryReader, aNewArray, nNewLength, true);
					oNewValue = aNewArray;
					break;
				default:
					nUnknownType = true;
					break;
			}
			if(false == nUnknownType)
			{
				if(bIsArray)
					oDataObject[nMemeberType] = oNewValue;
				else
					oDataObject.setProperty(nMemeberType, oNewValue);
			}
			nCurPos = oBinaryReader.GetCurPos();
		}
	}
};

//для сохранения в историю и пересылки изменений
var UndoRedoDataTypes = new function() {
	this.Unknown = -1;
	this.CellSimpleData = 0;
	this.CellValue = 1;
	this.ValueMultiTextElem = 2;
	this.CellValueData = 3;
	this.CellData = 4;
	this.FromTo = 5;
	this.FromToRowCol = 6;
	this.FromToCell = 7;
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
	this.CompositeCommentData = 22;
	this.DrawingObjectData = 23;
	this.ChartSeriesData = 24;
	this.SheetAdd = 25;
	this.SheetRemove = 26;
	this.SheetPositions = 27;
	this.ClrScheme = 28;
	this.AutoFilter = 29;
	this.AutoFiltersOptions = 30;
	this.DrawingObjectLayer = 31;
	this.AutoFiltersOptionsElements = 32;
	this.SingleProperty = 33;
	this.RgbColor = 34;
	this.ThemeColor = 35;
	this.ChartData = 36;
	this.ChartRange = 37;
	this.ChartHeader = 38;
	this.ChartAxisX = 39;
	this.ChartAxisY = 40;
	this.ChartLegend = 41;
	this.ChartFont = 42;
	
	this.Create = function(nType)
	{
		switch(nType)
		{
			case this.ValueMultiTextElem: return new CCellValueMultiText();break;
			case this.CellValue:return new CCellValue();break;
			case this.CellValueData: return new UndoRedoData_CellValueData();break;
			case this.CellData: return new UndoRedoData_CellData();break;			
			case this.CellSimpleData: return new UndoRedoData_CellSimpleData();break;
			case this.FromTo: return new UndoRedoData_FromTo();break;
			case this.FromToRowCol: return new UndoRedoData_FromToRowCol();break;
			case this.FromToCell: return new UndoRedoData_FromToCell();break;
			case this.IndexSimpleProp: return new UndoRedoData_IndexSimpleProp();break;
			case this.ColProp: return new UndoRedoData_ColProp();break;
			case this.RowProp: return new UndoRedoData_RowProp();break;
			case this.BBox: return new UndoRedoData_BBox();break;
			case this.Hyperlink: return new Hyperlink();break;
			case this.SortData: return new UndoRedoData_SortData();break;
			case this.StyleFont: return new Font();break;
			case this.StyleFill: return new Fill();break;
			case this.StyleNum: return new Num();break;
			case this.StyleBorder: return new Border();break;
			case this.StyleBorderProp: return new BorderProp();break;
			case this.StyleXfs: return new CellXfs();break;
			case this.StyleAlign: return new Align();break;
			case this.CommentData: return new asc_CCommentData();break;
			case this.CompositeCommentData: return new CompositeCommentData();break;
			case this.DrawingObjectData: return new DrawingObject();break;
			case this.DrawingObjectLayer: return new DrawingObjectLayer();break;
			case this.ChartSeriesData: return new asc_CChartSeria();break;
			case this.SheetAdd: return new UndoRedoData_SheetAdd();break;
			case this.SheetRemove: return new UndoRedoData_SheetRemove();break;
			case this.SheetPositions: return new UndoRedoData_SheetPositions();break;
			case this.ClrScheme: return new UndoRedoData_ClrScheme();break;
			case this.AutoFilter: return new UndoRedoData_AutoFilter(); break;
			case this.AutoFiltersOptions: return new Asc.AutoFiltersOptions(); break;
			case this.AutoFiltersOptionsElements: return new Asc.AutoFiltersOptionsElements(); break;
			case this.SingleProperty: return new UndoRedoData_SingleProperty(); break;
			case this.RgbColor: return new RgbColor(); break;
			case this.ThemeColor: return new ThemeColor(); break;
			case this.ChartData: return new asc_CChart(); break;
			case this.ChartRange: return new asc_CChartRange(); break;
			case this.ChartHeader: return new asc_CChartHeader(); break;
			case this.ChartAxisX: return new asc_CChartAxisX(); break;
			case this.ChartAxisY: return new asc_CChartAxisY(); break;
			case this.ChartLegend: return new asc_CChartLegend(); break;
			case this.ChartFont: return new asc_CChartFont(); break;
		}
		return null;
	};
};

function UndoRedoData_CellSimpleData(nRow, nCol, oOldVal, oNewVal){
	this.Properties = {
		Row: 0,
		Col: 1,
		NewVal: 2
	};
	this.nRow = nRow;
	this.nCol = nCol;
	this.oOldVal = oOldVal;
	this.oNewVal = oNewVal;
}
UndoRedoData_CellSimpleData.prototype = {
	getType : function()
	{
		return UndoRedoDataTypes.CellSimpleData;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.Row: return this.nRow;break;
			case this.Properties.Col: return this.nCol;break;
			case this.Properties.NewVal: return this.oNewVal;break;
		}
		return null;
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.Row: this.nRow = value;break;
			case this.Properties.Col: this.nCol = value;break;
			case this.Properties.NewVal: this.oNewVal = value;break;
		}
	},
	applyCollaborative : function(nSheetId, collaborativeEditing)
	{
		this.nRow = collaborativeEditing.getLockMeRow2(nSheetId, this.nRow);
		this.nCol = collaborativeEditing.getLockMeColumn2(nSheetId, this.nCol);
	}
};

function UndoRedoData_CellData(value, style){
	this.Properties = {
		value: 0,
		style: 1
	};
	this.value = value;
	this.style = style;
}
UndoRedoData_CellData.prototype = {
	getType : function()
	{
		return UndoRedoDataTypes.CellData;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.value: return this.value;break;
			case this.Properties.style: return this.style;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.value: this.value = value;break;
			case this.Properties.style: this.style = value;break;
		}
	}
};

function UndoRedoData_CellValueData(sFormula, oValue){
	this.Properties = {
		formula: 0,
		value: 1
	};
	this.formula = sFormula;
	this.value = oValue;
}
UndoRedoData_CellValueData.prototype = {
	isEqual : function(val)
	{
		if(null == val)
			return false;
		if(this.formula != val.formula)
			return false;
		if(this.value.isEqual(val.value))
			return true;
		return false;
	},
	getType : function()
	{
		return UndoRedoDataTypes.CellValueData;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.formula: return this.formula;break;
			case this.Properties.value: return this.value;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.formula: this.formula = value;break;
			case this.Properties.value: this.value = value;break;
		}
	}
};

function UndoRedoData_FromToRowCol(bRow, from, to){
	this.Properties = {
		from: 0,
		to: 1
	};
	this.bRow = bRow;
	this.from = from;
	this.to = to;
}
UndoRedoData_FromToRowCol.prototype = {
	getType : function()
	{
		return UndoRedoDataTypes.FromTo;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.from: return this.from;break;
			case this.Properties.to: return this.to;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.from: this.from = value;break;
			case this.Properties.to: this.to = value;break;
		}
	},
	applyCollaborative : function(nSheetId, collaborativeEditing)
	{
		if(this.bRow)
		{
			this.from = collaborativeEditing.getLockMeRow2(nSheetId, this.from);
			this.to = collaborativeEditing.getLockMeRow2(nSheetId, this.to);
		}
		else
		{
			this.from = collaborativeEditing.getLockMeColumn2(nSheetId, this.from);
			this.to = collaborativeEditing.getLockMeColumn2(nSheetId, this.to);
		}
	}
};

function UndoRedoData_FromTo(from, to){
	this.Properties = {
		from: 0,
		to: 1
	};
	this.from = from;
	this.to = to;
}
UndoRedoData_FromTo.prototype = {
	getType : function()
	{
		return UndoRedoDataTypes.FromTo;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.from: return this.from;break;
			case this.Properties.to: return this.to;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.from: this.from = value;break;
			case this.Properties.to: this.to = value;break;
		}
	}
};

function UndoRedoData_FromToCell(oBBoxFrom, oBBoxTo, arr){
	this.Properties = {
		from: 0,
		to: 1
	};
	this.from = new UndoRedoData_BBox(oBBoxFrom);
	this.to = new UndoRedoData_BBox(oBBoxTo);
	this.arr = arr;
}
UndoRedoData_FromToCell.prototype = {
	getType : function()
	{
		return UndoRedoDataTypes.FromToCell;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.from: return this.from;break;
			case this.Properties.to: return this.to;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.from: this.from = value;break;
			case this.Properties.to: this.to = value;break;
		}
	},
	applyCollaborative : function(nSheetId, collaborativeEditing)
	{
		this.from.r1 = collaborativeEditing.getLockMeRow2(nSheetId, this.from.r1);
		this.from.r2 = collaborativeEditing.getLockMeRow2(nSheetId, this.from.r2);
		this.from.c1 = collaborativeEditing.getLockMeColumn2(nSheetId, this.from.c1);
		this.from.c2 = collaborativeEditing.getLockMeColumn2(nSheetId, this.from.c2);
		
		this.to.r1 = collaborativeEditing.getLockMeRow2(nSheetId, this.to.r1);
		this.to.r2 = collaborativeEditing.getLockMeRow2(nSheetId, this.to.r2);
		this.to.c1 = collaborativeEditing.getLockMeColumn2(nSheetId, this.to.c1);
		this.to.c2 = collaborativeEditing.getLockMeColumn2(nSheetId, this.to.c2);
	}
};

function UndoRedoData_IndexSimpleProp(index, bRow, oOldVal, oNewVal){
	this.Properties = {
		index: 0,
		oNewVal: 1
	};
	this.index = index;
	this.bRow = bRow;
	this.oOldVal = oOldVal;
	this.oNewVal = oNewVal;
}
UndoRedoData_IndexSimpleProp.prototype = {
	getType : function()
	{
		return UndoRedoDataTypes.IndexSimpleProp;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.index: return this.index;break;
			case this.Properties.oNewVal: return this.oNewVal;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.index: this.index = value;break;
			case this.Properties.oNewVal: this.oNewVal = value;break;
		}
	},
	applyCollaborative : function(nSheetId, collaborativeEditing)
	{
		if(this.bRow)
			this.index = collaborativeEditing.getLockMeRow2(nSheetId, this.index);
		else
			this.index = collaborativeEditing.getLockMeColumn2(nSheetId, this.index);
	}
};

function UndoRedoData_ColProp(col){
	this.Properties = {
		width: 0,
		hd: 1,
		CustomWidth: 2,
		BestFit: 3
	};
	if(null != col)
	{
		this.width = col.width;
		this.hd = col.hd;
		this.CustomWidth = col.CustomWidth;
		this.BestFit = col.BestFit;
	}
	else
	{
		this.width = null;
		this.hd = null;
		this.CustomWidth = null;
		this.BestFit = null;
	}
}
UndoRedoData_ColProp.prototype = {
	isEqual : function(val)
	{
		var bRes = this.width == val.width && this.hd == val.hd && this.CustomWidth == val.CustomWidth;
		if(bRes)
		{
			if((null == this.BestFit || true == this.BestFit) && (null == val.BestFit || true == val.BestFit))
				bRes = true;
			else
				bRes = false;
		}
		return bRes;
	},
	getType : function()
	{
		return UndoRedoDataTypes.ColProp;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.width: return this.width;break;
			case this.Properties.hd: return this.hd;break;
			case this.Properties.CustomWidth: return this.CustomWidth;break;
			case this.Properties.BestFit: return this.BestFit;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.width: this.width = value;break;
			case this.Properties.hd: this.hd = value;break;
			case this.Properties.CustomWidth: this.CustomWidth = value;break;
			case this.Properties.BestFit: this.BestFit = value;break;
		}
	}
};

function UndoRedoData_RowProp(row){
	this.Properties = {
		h: 0,
		hd: 1,
		CustomHeight: 2
	};
	if(null != row)
	{
		this.h = row.h;
		this.hd = row.hd;
		this.CustomHeight = row.CustomHeight;
	}
	else
	{
		this.h = null;
		this.hd = null;
		this.CustomHeight = null;
	}
}
UndoRedoData_RowProp.prototype = {
	getType : function()
	{
		return UndoRedoDataTypes.RowProp;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.h: return this.h;break;
			case this.Properties.hd: return this.hd;break;
			case this.Properties.CustomHeight: return this.CustomHeight;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.h: this.h = value;break;
			case this.Properties.hd: this.hd = value;break;
			case this.Properties.CustomHeight: this.CustomHeight = value;break;
		}
	}
};

function UndoRedoData_BBox(oBBox){
	this.Properties = {
		c1: 0,
		r1: 1,
		c2: 2,
		r2: 3
	};
	if(null != oBBox)
	{
		this.c1 = oBBox.c1;
		this.r1 = oBBox.r1;
		this.c2 = oBBox.c2;
		this.r2 = oBBox.r2;
	}
	else
	{
		this.c1 = null;
		this.r1 = null;
		this.c2 = null;
		this.r2 = null;
	}
}
UndoRedoData_BBox.prototype = {
	getType : function()
	{
		return UndoRedoDataTypes.BBox;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.c1: return this.c1;break;
			case this.Properties.r1: return this.r1;break;
			case this.Properties.c2: return this.c2;break;
			case this.Properties.r2: return this.r2;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.c1: this.c1 = value;break;
			case this.Properties.r1: this.r1 = value;break;
			case this.Properties.c2: this.c2 = value;break;
			case this.Properties.r2: this.r2 = value;break;
		}
	},
	applyCollaborative : function(nSheetId, collaborativeEditing)
	{
		this.r1 = collaborativeEditing.getLockMeRow2(nSheetId, this.r1);
		this.r2 = collaborativeEditing.getLockMeRow2(nSheetId, this.r2);
		this.c1 = collaborativeEditing.getLockMeColumn2(nSheetId, this.c1);
		this.c2 = collaborativeEditing.getLockMeColumn2(nSheetId, this.c2);
	}
};

function UndoRedoData_SortData(bbox, places){
	this.Properties = {
		bbox: 0,
		places: 1
	};
	this.bbox = bbox;
	this.places = places;
}
UndoRedoData_SortData.prototype = {
	getType : function()
	{
		return UndoRedoDataTypes.SortData;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.bbox: return this.bbox;break;
			case this.Properties.places: return this.places;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.bbox: this.bbox = value;break;
			case this.Properties.places: this.places = value;break;
		}
	},
	applyCollaborative : function(nSheetId, collaborativeEditing)
	{
		this.bbox.r1 = collaborativeEditing.getLockMeRow2(nSheetId, this.bbox.r1);
		this.bbox.r2 = collaborativeEditing.getLockMeRow2(nSheetId, this.bbox.r2);
		this.bbox.c1 = collaborativeEditing.getLockMeColumn2(nSheetId, this.bbox.c1);
		this.bbox.c2 = collaborativeEditing.getLockMeColumn2(nSheetId, this.bbox.c2);
		for(var i = 0, length = this.places.length; i < length; ++i)
		{
			var place = this.places[i];
			place.from = collaborativeEditing.getLockMeRow2(nSheetId, place.from);
			place.to = collaborativeEditing.getLockMeRow2(nSheetId, place.to);
		}
	}
};

function UndoRedoData_SheetAdd(insertBefore, name, sheetidfrom, sheetid){
	this.Properties = {
		name: 0,
		sheetidfrom: 1,
		sheetid: 2
	};
	this.insertBefore= insertBefore;
	this.name = name;
	this.sheetidfrom = sheetidfrom;
	this.sheetid = sheetid;
	//Эти поля заполняются после Undo/Redo
	this.sheet = null;
	this.cwf = null;
}
UndoRedoData_SheetAdd.prototype = {
	getType : function()
	{
		return UndoRedoDataTypes.SheetAdd;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.name: return this.name;break;
			case this.Properties.sheetidfrom: return this.sheetidfrom;break;
			case this.Properties.sheetid: return this.sheetid;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.name: this.name = value;break;
			case this.Properties.sheetidfrom: this.sheetidfrom = value;break;
			case this.Properties.sheetid: this.sheetid = value;break;
		}
	}
};

function UndoRedoData_SheetRemove(index, sheetId, sheet, cwf){
	this.Properties = {
		sheetId: 0,
		sheet: 1
	};
	this.index = index;
	this.sheetId = sheetId;
	this.sheet = sheet;
	this.cwf = cwf;
}
UndoRedoData_SheetRemove.prototype = {
	getType : function()
	{
		return UndoRedoDataTypes.SheetRemove;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.sheetId: return this.sheetId;break;
			case this.Properties.sheet: return this.sheet;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.sheetId: this.sheetId = value;break;
			case this.Properties.sheet: this.sheet = value;break;
		}
	}
};

function UndoRedoData_SheetPositions(positions){
	this.Properties = {
		positions: 0
	};
	this.positions = positions;
}
UndoRedoData_SheetPositions.prototype = {
	getType : function()
	{
		return UndoRedoDataTypes.SheetPositions;
	},
	getProperties : function()
	{
		return this.Properties;
	},
	getProperty : function(nType)
	{
		switch(nType)
		{
			case this.Properties.positions: return this.positions;break;
		}
	},
	setProperty : function(nType, value)
	{
		switch(nType)
		{
			case this.Properties.positions: this.positions = value;break;
		}
	}
};

function UndoRedoData_ClrScheme(oldVal, newVal){
	this.oldVal = oldVal;
	this.newVal = newVal;
}
UndoRedoData_ClrScheme.prototype = {
	getType : function()
	{
		return UndoRedoDataTypes.ClrScheme;
	},
	Write_ToBinary2 : function(writer)
	{
		this.newVal.Write_ToBinary2(writer);
	},
	Read_FromBinary2 : function(reader)
	{
		this.newVal = new ClrScheme();
		this.newVal.Read_FromBinary2(reader);
	}
};

function UndoRedoData_AutoFilter() {
	this.Properties = {
		activeCells			: 0,
		lTable				: 1,
		type				: 2,
		cellId				: 3,
		autoFiltersObject	: 4
	};

	this.undo				= null;

	this.activeCells		= null;
	this.lTable				= null;
	this.type				= null;
	this.cellId				= null;
	this.autoFiltersObject	= null;
}
UndoRedoData_AutoFilter.prototype = {
	getType : function ()
	{
		return UndoRedoDataTypes.AutoFilter;
	},
	getProperties : function ()
	{
		return this.Properties;
	},
	getProperty : function (nType)
	{
		switch (nType)
		{
			case this.Properties.activeCells: return new UndoRedoData_BBox(this.activeCells); break;
			case this.Properties.lTable: return this.lTable; break;
			case this.Properties.type: return this.type; break;
			case this.Properties.cellId: return this.cellId; break;
			case this.Properties.autoFiltersObject: return this.autoFiltersObject; break;
		}

		return null;
	},
	setProperty : function (nType, value)
	{
		switch (nType)
		{
			case this.Properties.activeCells: this.activeCells = new Asc.Range(value.c1, value.r1, value.c2, value.r2);break;
			case this.Properties.lTable: this.lTable = value;break;
			case this.Properties.type: this.type = value;break;
			case this.Properties.cellId: this.cellId = value;break;
			case this.Properties.autoFiltersObject: this.autoFiltersObject = value;break;
		}
	},
	applyCollaborative : function (nSheetId, collaborativeEditing) {
		this.activeCells.c1 = collaborativeEditing.getLockMeColumn2(nSheetId, this.activeCells.c1);
		this.activeCells.c2 = collaborativeEditing.getLockMeColumn2(nSheetId, this.activeCells.c2);
		this.activeCells.r1 = collaborativeEditing.getLockMeRow2(nSheetId, this.activeCells.r1);
		this.activeCells.r2 = collaborativeEditing.getLockMeRow2(nSheetId, this.activeCells.r2);
	}
};

function UndoRedoData_SingleProperty(elem) {
	this.Properties = {
		elem : 0
	};
	this.elem = elem;
}
UndoRedoData_SingleProperty.prototype = {
	getType : function ()
	{
		return UndoRedoDataTypes.SingleProperty;
	},
	getProperties : function ()
	{
		return this.Properties;
	},
	getProperty : function (nType)
	{
		switch (nType)
		{
			case this.Properties.elem: return this.elem; break;
		}
		return null;
	},
	setProperty : function (nType, value)
	{
		switch (nType)
		{
			case this.Properties.elem: this.elem = value;break;
		}
	}
};

//для применения изменений
var UndoRedoClassTypes = new function(){
	this.aTypes = new Array();
	this.Add = function(fCreate)
	{
		var nRes = this.aTypes.length;
		this.aTypes.push(fCreate);
		return nRes;
	};
	this.Create = function(nType)
	{
		if(nType < this.aTypes.length)
			return this.aTypes[nType]();
		return null;
	};
};

var g_oUndoRedoWorkbook = null;
function UndoRedoWorkbook(wb)
{
	this.wb = wb;
	this.nType = UndoRedoClassTypes.Add(function(){return g_oUndoRedoWorkbook;});
}
UndoRedoWorkbook.prototype = {
	getClassType : function()
	{
		return this.nType;
	},
	Undo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, true);
	},
	Redo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, false);
	},
	UndoRedo : function(Type, Data, nSheetId, bUndo)
	{
		var bNeedTrigger = true;
		if(historyitem_Workbook_SheetAdd == Type)
		{
			if(null == Data.insertBefore)
				Data.insertBefore = 0;
			if(bUndo)
			{
				var outputParams = {sheet: null, cwf: null};
				this.wb.removeWorksheet(Data.insertBefore, outputParams);
				this.wb.handlers.trigger("removeWorksheet", Data.insertBefore);
				//сохраняем тот sheet который удалили, иначе может возникнуть ошибка, если какой-то обьект запоминал ссылку на sheet(например):
				//Добавляем лист  -> Добавляем ссылку -> undo -> undo -> redo -> redo
				Data.sheet = outputParams.sheet;
				Data.cwf = outputParams.cwf;
			}
			else
			{
				if(null != Data.sheet)
				{
					//сюда заходим только если до этого было сделано Undo
					this.wb.insertWorksheet(Data.insertBefore, Data.sheet, Data.cwf);
				}
				else
				{
					var name =Data.name;
					if(this.wb.bCollaborativeChanges)
					{
						var nIndex = this.wb.checkUniqueSheetName(name);
						if(-1 != nIndex)
						{
							var oConflictWs = this.wb.getWorksheet(nIndex);
							if(null != oConflictWs)
								oConflictWs.renameWsToCollaborate(this.wb.getUniqueSheetNameFrom(oConflictWs.getName(), true));
						}
					}
					var ws = null;
					if(null == Data.sheetidfrom)
						this.wb.createWorksheet(Data.insertBefore, Data.name, Data.sheetid);
					else
					{
						var oCurWorksheet = this.wb.getWorksheetById(Data.sheetidfrom);
						var nIndex = oCurWorksheet.getIndex();
						this.wb.copyWorksheet(nIndex, Data.insertBefore, Data.name, Data.sheetid);
					}
				}
				this.wb.handlers.trigger("spliceWorksheet", Data.insertBefore, 0, null);
			}
		}
		else if(historyitem_Workbook_SheetRemove == Type)
		{
			if(bUndo)
			{
				this.wb.insertWorksheet(Data.index, Data.sheet, Data.cwf);
				this.wb.handlers.trigger("spliceWorksheet", Data.index, 0, null);
			}
			else
			{
				var nIndex = Data.index;
				if(null == nIndex)
				{
					var oCurWorksheet = this.wb.getWorksheetById(Data.sheetId);
					nIndex = oCurWorksheet.getIndex();
				}
				if(null != nIndex)
				{
					this.wb.removeWorksheet(nIndex);
					this.wb.handlers.trigger("removeWorksheet", nIndex);
				}
			}
		}
		else if(historyitem_Workbook_SheetMove == Type)
		{
			if(bUndo)
			{
				this.wb.replaceWorksheet(Data.to, Data.from);
				this.wb.handlers.trigger("replaceWorksheet", Data.to, Data.from);
			}
			else
			{
				this.wb.replaceWorksheet(Data.from, Data.to);
				this.wb.handlers.trigger("replaceWorksheet", Data.from, Data.to);
			}
		}
		else if(historyitem_Workbook_SheetPositions == Type)
		{
			//делаем вспомогательным map из sheetid
			var oTempSheetMap = new Object();
			for(var i = 0, length = Data.positions.length; i < length; ++i)
				oTempSheetMap[Data.positions[i]] = 1;
			//находим sheet уникальные для данного пользователя и запоминаем перед каким sheetid они идут
			var oUniqueSheetId = new Object();
			var nLastId = null;
			for(var i = 0, length = this.wb.aWorksheets.length; i < length; ++i)
			{
				var ws = this.wb.aWorksheets[i];
				var id = ws.getId();
				if(null == oTempSheetMap[id])
				{
					if(i < length - 1)
						oUniqueSheetId[this.wb.aWorksheets[i + 1].getId()] = id;
					else
						nLastId = id;
				}
			}
			//расставляем в соответствии с изменениями
			this.wb.aWorksheets = new Array();
			for(var i = 0, length = Data.positions.length; i < length; ++i)
			{
				var sheetId = Data.positions[i];
				var ws = this.wb.aWorksheetsById[sheetId];
				if(null != ws)
					this.wb.aWorksheets.push(ws);
			}
			if(null != nLastId)
			{
				var ws = this.wb.aWorksheetsById[nLastId];
				if(null != ws)
					this.wb.aWorksheets.push(ws);
			}
			//не стал оптимизировать по скорости, потому что много добавленых sheet быть не может
			while(true)
			{
				for(var i = 0, length = this.wb.aWorksheets.length; i < length; ++i)
				{
					var ws = this.wb.aWorksheets[i];
					var insertId = oUniqueSheetId[ws.getId()];
					if(null != insertId)
					{
						var insertWs = this.wb.aWorksheetsById[insertId];
						if(null != insertWs)
							this.wb.aWorksheets.splice(i, 0, insertWs);
						delete oUniqueSheetId[ws.getId()];
					}
				}
				var bEmpty = true;
				for(var i in oUniqueSheetId)
				{
					bEmpty = false;
					break;
				}
				if(bEmpty)
					break;
			}
			this.wb._updateWorksheetIndexes();
		}
		else if(historyitem_Workbook_ChangeColorScheme == Type)
		{
			bNeedTrigger = false;
			if(bUndo)
				this.wb.theme.themeElements.clrScheme = Data.oldVal;
			else
				this.wb.theme.themeElements.clrScheme = Data.newVal;
			this.wb.oApi.asc_AfterChangeColorScheme();
		}
		if(bNeedTrigger)
		{
			this.wb.handlers.trigger("updateWorksheetByModel");
			this.wb.handlers.trigger("asc_onSheetsChanged");
		}
	}
};

var g_oUndoRedoCell = null;
function UndoRedoCell(wb)
{
	this.wb = wb;
	this.nType = UndoRedoClassTypes.Add(function(){return g_oUndoRedoCell;});
}
UndoRedoCell.prototype = {
	getClassType : function()
	{
		return this.nType;
	},
	Undo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, true);
	},
	Redo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, false);
	},
	UndoRedo : function(Type, Data, nSheetId, bUndo)
	{
		var ws = this.wb.getWorksheetById(nSheetId);
		if(null == ws)
			return;
		var nRow = Data.nRow;
		var nCol = Data.nCol;
		if(false != this.wb.bCollaborativeChanges)
		{
			var collaborativeEditing = this.wb.oApi.collaborativeEditing;
			nRow = collaborativeEditing.getLockOtherRow2(nSheetId, nRow);
			nCol = collaborativeEditing.getLockOtherColumn2(nSheetId, nCol);
			var oLockInfo = new Asc.asc_CLockInfo();
			oLockInfo["sheetId"] = nSheetId;
			oLockInfo["type"] = c_oAscLockTypeElem.Range;
			oLockInfo["rangeOrObjectId"] = new Asc.Range(nCol, nRow, nCol, nRow);
			this.wb.aCollaborativeChangeElements.push(oLockInfo);
		}
		var cell =  ws._getCell(nRow, nCol);
		var Val;
		if(bUndo)
			Val = Data.oOldVal;
		else
			Val = Data.oNewVal;
		if(historyitem_Cell_Fontname == Type)
			cell.setFontname(Val);
		else if(historyitem_Cell_Fontsize == Type)
			cell.setFontsize(Val);
		else if(historyitem_Cell_Fontcolor == Type)
			cell.setFontcolor(Val);
		else if(historyitem_Cell_Bold == Type)
			cell.setBold(Val);
		else if(historyitem_Cell_Italic == Type)
			cell.setItalic(Val);
		else if(historyitem_Cell_Underline == Type)
			cell.setUnderline(Val);
		else if(historyitem_Cell_Strikeout == Type)
			cell.setStrikeout(Val);
		else if(historyitem_Cell_FontAlign == Type)
			cell.setFontAlign(Val);
		else if(historyitem_Cell_AlignVertical == Type)
			cell.setAlignVertical(Val);
		else if(historyitem_Cell_AlignHorizontal == Type)
			cell.setAlignHorizontal(Val);
		else if(historyitem_Cell_Fill == Type)
			cell.setFill(Val);
		else if(historyitem_Cell_Border == Type)
		{
			if(null != Val)
				cell.setBorder(Val.clone());
			else
				cell.setBorder(null);
		}
		else if(historyitem_Cell_ShrinkToFit == Type)
			cell.setFill(Val);
		else if(historyitem_Cell_Wrap == Type)
			cell.setWrap(Val);
		else if(historyitem_Cell_Numformat == Type)
			cell.setNumFormat(Val);
        else if(historyitem_Cell_Angle == Type)
            cell.setAngle(Val);
        else if(historyitem_Cell_ChangeArrayValueFormat == Type)
		{
			cell.oValue.multiText = new Array();
			for(var i = 0, length = Val.length; i < length; ++i)
				cell.oValue.multiText.push(Val[i].clone());
		}
		else if(historyitem_Cell_ChangeValue == Type)
		{
			cell.setValueData(Val);
		}
		else if(historyitem_Cell_SetStyle == Type)
		{
            if(null != Val)
                cell.setStyle(Val);
			else
				cell.setStyle(null);
		}
		else if(historyitem_Cell_SetFont == Type)
		{
			cell.setFont(Val);
		}
		else if(historyitem_Cell_SetQuotePrefix == Type)
		{
			cell.setQuotePrefix(Val);
		}
	}
};

var g_oUndoRedoWorksheet = null;
function UndoRedoWoorksheet(wb){
	this.wb = wb;
	this.nType = UndoRedoClassTypes.Add(function(){return g_oUndoRedoWorksheet;});
}
UndoRedoWoorksheet.prototype = {
	getClassType : function()
	{
		return this.nType;
	},
	Undo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, true);
	},
	Redo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, false);
	},
	UndoRedo : function(Type, Data, nSheetId, bUndo)
	{
		var ws = this.wb.getWorksheetById(nSheetId);
		if(null == ws)
			return;
		var collaborativeEditing = this.wb.oApi.collaborativeEditing;
		if(historyitem_Worksheet_RemoveCell == Type)
		{
			var nRow = Data.nRow;
			var nCol = Data.nCol;
			if(false != this.wb.bCollaborativeChanges)
			{
				nRow = collaborativeEditing.getLockOtherRow2(nSheetId, nRow);
				nCol = collaborativeEditing.getLockOtherColumn2(nSheetId, nCol);
				var oLockInfo = new Asc.asc_CLockInfo();
				oLockInfo["sheetId"] = nSheetId;
				oLockInfo["type"] = c_oAscLockTypeElem.Range;
				oLockInfo["rangeOrObjectId"] = new Asc.Range(nCol, nRow, nCol, nRow);
				this.wb.aCollaborativeChangeElements.push(oLockInfo);
			}
			if(bUndo)
			{
				var oValue = Data.oOldVal.value;
				var oStyle = Data.oOldVal.style;
				var cell = ws._getCell(nRow, nCol);
				cell.setValueData(oValue);
				if(null != oStyle)
					cell.setStyle(oStyle);
				else
					cell.setStyle(null);
			}
			else
				ws._removeCell(nRow, nCol);
		}
		else if(historyitem_Worksheet_ColProp == Type)
		{
			var index = Data.index;
			if(false != this.wb.bCollaborativeChanges)
			{
				index = collaborativeEditing.getLockOtherColumn2(nSheetId, index);
				var oLockInfo = new Asc.asc_CLockInfo();
				oLockInfo["sheetId"] = nSheetId;
				oLockInfo["type"] = c_oAscLockTypeElem.Range;
				oLockInfo["rangeOrObjectId"] = new Asc.Range(index, 0, index, gc_nMaxRow0);
				this.wb.aCollaborativeChangeElements.push(oLockInfo);
			}
			var col = ws._getCol(index);
			if(bUndo)
				col.setWidthProp(Data.oOldVal);
			else
				col.setWidthProp(Data.oNewVal);
		}
		else if(historyitem_Worksheet_RowProp == Type)
		{
			var index = Data.index;
			if(false != this.wb.bCollaborativeChanges)
			{
				index = collaborativeEditing.getLockOtherRow2(nSheetId, index);
				var oLockInfo = new Asc.asc_CLockInfo();
				oLockInfo["sheetId"] = nSheetId;
				oLockInfo["type"] = c_oAscLockTypeElem.Range;
				oLockInfo["rangeOrObjectId"] = new Asc.Range(0, index, gc_nMaxCol0, index);
				this.wb.aCollaborativeChangeElements.push(oLockInfo);
			}
			var row = ws._getRow(index);
			if(bUndo)
				row.setHeightProp(Data.oOldVal);
			else
				row.setHeightProp(Data.oNewVal);
		}
		else if(historyitem_Worksheet_AddRows == Type || historyitem_Worksheet_RemoveRows == Type)
		{
			var from = Data.from;
			var to = Data.to;
			if(false != this.wb.bCollaborativeChanges)
			{
				from = collaborativeEditing.getLockOtherRow2(nSheetId, from);
				to = collaborativeEditing.getLockOtherRow2(nSheetId, to);
				if(false == ((true == bUndo && historyitem_Worksheet_AddRows == Type) || (false == bUndo && historyitem_Worksheet_RemoveRows == Type)))
				{
					var oLockInfo = new Asc.asc_CLockInfo();
					oLockInfo["sheetId"] = nSheetId;
					oLockInfo["type"] = c_oAscLockTypeElem.Range;
					oLockInfo["rangeOrObjectId"] = new Asc.Range(0, from, gc_nMaxCol0, to);
					this.wb.aCollaborativeChangeElements.push(oLockInfo);
				}
			}
			if((true == bUndo && historyitem_Worksheet_AddRows == Type) || (false == bUndo && historyitem_Worksheet_RemoveRows == Type))
				ws.workbook.handlers.trigger("deleteCell", nSheetId, c_oAscDeleteOptions.DeleteRows, Asc.Range(0, from, gc_nMaxCol0, to));
			else
				ws.workbook.handlers.trigger("insertCell", nSheetId, c_oAscInsertOptions.InsertRows, Asc.Range(0, from, gc_nMaxCol0, to));
		}
		else if(historyitem_Worksheet_AddCols == Type || historyitem_Worksheet_RemoveCols == Type)
		{
			var from = Data.from;
			var to = Data.to;
			if(false != this.wb.bCollaborativeChanges)
			{
				from = collaborativeEditing.getLockOtherColumn2(nSheetId, from);
				to = collaborativeEditing.getLockOtherColumn2(nSheetId, to);
				if(false == ((true == bUndo && historyitem_Worksheet_AddCols == Type) || (false == bUndo && historyitem_Worksheet_RemoveCols == Type)))
				{
					var oLockInfo = new Asc.asc_CLockInfo();
					oLockInfo["sheetId"] = nSheetId;
					oLockInfo["type"] = c_oAscLockTypeElem.Range;
					oLockInfo["rangeOrObjectId"] = new Asc.Range(from, 0, to, gc_nMaxRow0);
					this.wb.aCollaborativeChangeElements.push(oLockInfo);
				}
			}
			if((true == bUndo && historyitem_Worksheet_AddCols == Type) || (false == bUndo && historyitem_Worksheet_RemoveCols == Type))
				ws.workbook.handlers.trigger("deleteCell", nSheetId, c_oAscDeleteOptions.DeleteColumns, Asc.Range(from, 0, to, gc_nMaxRow0));
			else
				ws.workbook.handlers.trigger("insertCell", nSheetId, c_oAscInsertOptions.InsertColumns, Asc.Range(from, 0, to, gc_nMaxRow0));
		}
		else if(historyitem_Worksheet_ShiftCellsLeft == Type || historyitem_Worksheet_ShiftCellsRight == Type)
		{
			var r1 = Data.r1;
			var c1 = Data.c1;
			var r2 = Data.r2;
			var c2 = Data.c2;
			if(false != this.wb.bCollaborativeChanges)
			{
				r1 = collaborativeEditing.getLockOtherRow2(nSheetId, r1);
				c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, c1);
				r2 = collaborativeEditing.getLockOtherRow2(nSheetId, r2);
				c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, c2);
				if(false == ((true == bUndo && historyitem_Worksheet_ShiftCellsLeft == Type) || (false == bUndo && historyitem_Worksheet_ShiftCellsRight == Type)))
				{
					var oLockInfo = new Asc.asc_CLockInfo();
					oLockInfo["sheetId"] = nSheetId;
					oLockInfo["type"] = c_oAscLockTypeElem.Range;
					oLockInfo["rangeOrObjectId"] = new Asc.Range(c1, r1, c2, r2);
					this.wb.aCollaborativeChangeElements.push(oLockInfo);
				}
			}
			if((true == bUndo && historyitem_Worksheet_ShiftCellsLeft == Type) || (false == bUndo && historyitem_Worksheet_ShiftCellsRight == Type))
				ws.workbook.handlers.trigger("insertCell", nSheetId, c_oAscInsertOptions.InsertCellsAndShiftRight, Asc.Range(c1, r1, c2, r2));
			else
				ws.workbook.handlers.trigger("deleteCell", nSheetId, c_oAscDeleteOptions.DeleteCellsAndShiftLeft, Asc.Range(c1, r1, c2, r2));
		}
		else if(historyitem_Worksheet_ShiftCellsTop == Type || historyitem_Worksheet_ShiftCellsBottom == Type)
		{
			var bbox = Data;
			var r1 = Data.r1;
			var c1 = Data.c1;
			var r2 = Data.r2;
			var c2 = Data.c2;
			if(false != this.wb.bCollaborativeChanges)
			{
				r1 = collaborativeEditing.getLockOtherRow2(nSheetId, r1);
				c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, c1);
				r2 = collaborativeEditing.getLockOtherRow2(nSheetId, r2);
				c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, c2);
				if(false == ((true == bUndo && historyitem_Worksheet_ShiftCellsTop == Type) || (false == bUndo && historyitem_Worksheet_ShiftCellsBottom == Type)))
				{
					var oLockInfo = new Asc.asc_CLockInfo();
					oLockInfo["sheetId"] = nSheetId;
					oLockInfo["type"] = c_oAscLockTypeElem.Range;
					oLockInfo["rangeOrObjectId"] = new Asc.Range(c1, r1, c2, r2);
					this.wb.aCollaborativeChangeElements.push(oLockInfo);
				}
			}
			if((true == bUndo && historyitem_Worksheet_ShiftCellsTop == Type) || (false == bUndo && historyitem_Worksheet_ShiftCellsBottom == Type))
				ws.workbook.handlers.trigger("insertCell", nSheetId, c_oAscInsertOptions.InsertCellsAndShiftDown, Asc.Range(c1, r1, c2, r2));
			else
				ws.workbook.handlers.trigger("deleteCell", nSheetId, c_oAscDeleteOptions.DeleteCellsAndShiftTop, Asc.Range(c1, r1, c2, r2));
		}
		else if(historyitem_Worksheet_Sort == Type)
		{
			var bbox = Data.bbox;
			var places = Data.places;
			if(false != this.wb.bCollaborativeChanges)
			{
				bbox.r1 = collaborativeEditing.getLockOtherRow2(nSheetId, bbox.r1);
				bbox.c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, bbox.c1);
				bbox.r2 = collaborativeEditing.getLockOtherRow2(nSheetId, bbox.r2);
				bbox.c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, bbox.c2);
				for(var i = 0, length = Data.places.length; i < length; ++i)
				{
					var place = Data.places[i];
					place.from = collaborativeEditing.getLockOtherRow2(nSheetId, place.from);
					place.to = collaborativeEditing.getLockOtherRow2(nSheetId, place.to);
					var oLockInfo = new Asc.asc_CLockInfo();
					oLockInfo["sheetId"] = nSheetId;
					oLockInfo["type"] = c_oAscLockTypeElem.Range;
					oLockInfo["rangeOrObjectId"] = new Asc.Range(bbox.c1, place.from, bbox.c2, place.from);
					this.wb.aCollaborativeChangeElements.push(oLockInfo);
				}
			}
			var range = ws.getRange(new CellAddress(bbox.r1, bbox.c1, 0), new CellAddress(bbox.r2, bbox.c2, 0));
			range._sortByArray(bbox, places, bUndo);
		}
		else if(historyitem_Worksheet_MoveRange == Type)
		{
			if( bUndo ){
			
				var rec = {length:0};
				for(var ind = 0; ind < Data.arr.to.length; ind++ ){
					var nRow = Data.arr.to[ind].getCellAddress().getRow0(),
						nCol = Data.arr.to[ind].getCellAddress().getCol0();
					
					var c = ws._getCell(nRow, nCol)
					
					if( c.sFormula ){
						this.wb.cwf[ws.Id].cells[c.getName()] = null;
						delete this.wb.cwf[ws.Id].cells[ c.getName()];
					}
					
					var oTargetRow = ws._getRow(nRow);
				
					if(Data.arr.to[ind].isEmpty()){
						delete oTargetRow.c[nCol];
						continue;
					}
					else{
						var sn = ws.workbook.dependencyFormulas.getSlaveNodes(ws.Id,Data.arr.to[ind].getName())
						if( sn ){
							for( var _id in sn){
								rec[_id] = [ sn[_id].sheetId, sn[_id].cellId ];
								rec.length++;
							}
						}
						oTargetRow.c[nCol] = Data.arr.to[ind];
						if( oTargetRow.c[nCol].sFormula ){
							this.wb.cwf[ws.Id].cells[ oTargetRow.c[nCol].getName() ] = oTargetRow.c[nCol].getName();
							rec[ getVertexId(ws.Id,oTargetRow.c[nCol].getName()) ] = [ ws.Id, oTargetRow.c[nCol].getName() ];
							rec.length++;
						}
					}
				}
				
				for(var ind = 0; ind < Data.arr.from.length; ind++ ){
					var nRow = Data.arr.from[ind].getCellAddress().getRow0(),
						nCol = Data.arr.from[ind].getCellAddress().getCol0();
					
					var c = ws._getCell(nRow, nCol)
					
					if( c.sFormula ){
						this.wb.cwf[ws.Id].cells[c.getName()] = null;
						delete this.wb.cwf[ws.Id].cells[ c.getName()];
					}
					
					var oTargetRow = ws._getRow(nRow);
				
					if(Data.arr.from[ind].isEmpty()){
						delete oTargetRow.c[nCol];
						continue;
					}
					else{
						var sn = ws.workbook.dependencyFormulas.getSlaveNodes(ws.Id,Data.arr.from[ind].getName())
						if( sn ){
							for( var _id in sn){
								rec[_id] = [ sn[_id].sheetId, sn[_id].cellId ];
								rec.length++;
							}
						}
						oTargetRow.c[nCol] = Data.arr.from[ind];
						if( oTargetRow.c[nCol].sFormula ){
							this.wb.cwf[ws.Id].cells[ oTargetRow.c[nCol].getName() ] = oTargetRow.c[nCol].getName();
							rec[ getVertexId(ws.Id,oTargetRow.c[nCol].getName()) ] = [ ws.Id, oTargetRow.c[nCol].getName() ];
							rec.length++;
						}
					}
				}
				
				this.wb.buildDependency();
				this.wb.needRecalc = rec;
				recalc(this.wb);
			
			}
			else{
					
				if(false != this.wb.bCollaborativeChanges)
				{
					var collaborativeEditing = this.wb.oApi.collaborativeEditing,
						nSheetId = ws.getId(), 
						coBBoxTo 	= {r1:0,c1:0,r2:0,c2:0 },
						coBBoxFrom 	= {r1:0,c1:0,r2:0,c2:0 };

					coBBoxTo.r1 = collaborativeEditing.getLockOtherRow2(	nSheetId, Data.to.r1);
					coBBoxTo.c1 = collaborativeEditing.getLockOtherColumn2(	nSheetId, Data.to.c1);
					coBBoxTo.r2 = collaborativeEditing.getLockOtherRow2(	nSheetId, Data.to.r2);
					coBBoxTo.c2 = collaborativeEditing.getLockOtherColumn2(	nSheetId, Data.to.c2);
					
					coBBoxFrom.r1 = collaborativeEditing.getLockOtherRow2(		nSheetId, Data.from.r1);
					coBBoxFrom.c1 = collaborativeEditing.getLockOtherColumn2(	nSheetId, Data.from.c1);
					coBBoxFrom.r2 = collaborativeEditing.getLockOtherRow2(		nSheetId, Data.from.r2);
					coBBoxFrom.c2 = collaborativeEditing.getLockOtherColumn2(	nSheetId, Data.from.c2);
					
					ws._moveRange(coBBoxFrom, coBBoxTo);
				}
				else{
					ws._moveRange(Data.from, Data.to);
				}
			}
		}
		else if(historyitem_Worksheet_Merge == Type || historyitem_Worksheet_Unmerge == Type)
		{
			if(historyitem_Worksheet_Unmerge == Type)
				bUndo = !bUndo;
			var r1 = Data.r1;
			var c1 = Data.c1;
			var r2 = Data.r2;
			var c2 = Data.c2;
			if(false != this.wb.bCollaborativeChanges)
			{
				r1 = collaborativeEditing.getLockOtherRow2(nSheetId, r1);
				c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, c1);
				r2 = collaborativeEditing.getLockOtherRow2(nSheetId, r2);
				c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, c2);
			}
			var range = ws.getRange(new CellAddress(r1, c1, 0), new CellAddress(r2, c2, 0));
			if(bUndo)
				range.unmerge();
			else
				range.merge();
		}
		else if(historyitem_Worksheet_SetHyperlink == Type || historyitem_Worksheet_RemoveHyperlink == Type)
		{
			if(historyitem_Worksheet_RemoveHyperlink == Type)
				bUndo = !bUndo;
			var Ref = Data.Ref;
			if(false != this.wb.bCollaborativeChanges)
			{
				var bboxRef = Data.Ref.getBBox0();
				var r1 = collaborativeEditing.getLockOtherRow2(nSheetId, bboxRef.r1);
				var c1 = collaborativeEditing.getLockOtherColumn2(nSheetId, bboxRef.c1);
				var r2 = collaborativeEditing.getLockOtherRow2(nSheetId, bboxRef.r2);
				var c2 = collaborativeEditing.getLockOtherColumn2(nSheetId, bboxRef.c2);
				Ref.setOffsetFirst({offsetCol: c1 - bboxRef.c1, offsetRow: r1 - bboxRef.r1});
				Ref.setOffsetLast({offsetCol: c2 - bboxRef.c2, offsetRow: r2 - bboxRef.r2});
			}
			if(bUndo)
				Ref.removeHyperlink(Data);
			else
				Ref.setHyperlink(Data);
		}
		else if(historyitem_Worksheet_Rename == Type)
		{
			if(bUndo)
				ws.setName(Data.from);
			else
			{
				var name = Data.to;
				if(this.wb.bCollaborativeChanges)
				{
					var nIndex = this.wb.checkUniqueSheetName(name);
					if(-1 != nIndex)
					{
						var oConflictWs = this.wb.getWorksheet(nIndex);
						if(null != oConflictWs)
							oConflictWs.renameWsToCollaborate(this.wb.getUniqueSheetNameFrom(oConflictWs.getName(), true));
					}
				}
				ws.setName(name);
			}
			ws.workbook.handlers.trigger("asc_onSheetsChanged");
		}
		else if(historyitem_Worksheet_Hide == Type)
		{
			if(bUndo)
				ws.setHidden(Data.from);
			else
				ws.setHidden(Data.to);
			ws.workbook.handlers.trigger("asc_onSheetsChanged");
		}
		else if(historyitem_Worksheet_CreateRow == Type)
		{
			if(bUndo)
				ws._removeRow(Data.elem);
			else
				ws._getRow(Data.elem);
		}
		else if(historyitem_Worksheet_CreateCol == Type)
		{
			if(bUndo)
				ws._removeCol(Data.elem);
			else
				ws._getCol(Data.elem);
		}
		else if(historyitem_Worksheet_CreateCell == Type)
		{
			if(bUndo)
				ws._removeCell(Data.nRow, Data.nCol);
			else
				ws._getCell(Data.nRow, Data.nCol);
		}
	}
};

var g_oUndoRedoRow = null;
var g_oUndoRedoCol = null;
function UndoRedoRowCol(wb, bRow){
	this.wb = wb;
	this.bRow = bRow
	this.nTypeRow = UndoRedoClassTypes.Add(function(){return g_oUndoRedoRow;});
	this.nTypeCol = UndoRedoClassTypes.Add(function(){return g_oUndoRedoCol;});
}
UndoRedoRowCol.prototype = {
	getClassType : function()
	{
		if(this.bRow)
			return this.nTypeRow;
		else
			return this.nTypeCol;
	},
	Undo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, true);
	},
	Redo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, false);
	},
	UndoRedo : function(Type, Data, nSheetId, bUndo)
	{
		var ws = this.wb.getWorksheetById(nSheetId);
		if(null == ws)
			return;
		var nIndex = Data.index;
		if(false != this.wb.bCollaborativeChanges)
		{
			var collaborativeEditing = this.wb.oApi.collaborativeEditing;
			var oLockInfo = new Asc.asc_CLockInfo();
			oLockInfo["sheetId"] = nSheetId;
			oLockInfo["type"] = c_oAscLockTypeElem.Range;
			if(this.bRow)
			{
				nIndex = collaborativeEditing.getLockOtherRow2(nSheetId, nIndex);
				oLockInfo["rangeOrObjectId"] = new Asc.Range(0, nIndex, gc_nMaxCol0, nIndex);
			}
			else
			{
				nIndex = collaborativeEditing.getLockOtherColumn2(nSheetId, nIndex);
				oLockInfo["rangeOrObjectId"] = new Asc.Range(nIndex, 0, nIndex, gc_nMaxRow0);
			}
			this.wb.aCollaborativeChangeElements.push(oLockInfo);
		}
		var Val;
		if(bUndo)
			Val = Data.oOldVal;
		else
			Val = Data.oNewVal;
		var row;
		if(this.bRow)
			row = ws._getRow(nIndex);
		else
			row = ws._getCol(nIndex);
		if(historyitem_RowCol_SetFont == Type)
			row.setFont(Val);
		else if(historyitem_RowCol_Fontname == Type)
			row.setFontname(Val);
		else if(historyitem_RowCol_Fontsize == Type)
			row.setFontsize(Val);
		else if(historyitem_RowCol_Fontcolor == Type)
			row.setFontcolor(Val);
		else if(historyitem_RowCol_Bold == Type)
			row.setBold(Val);
		else if(historyitem_RowCol_Italic == Type)
			row.setItalic(Val);
		else if(historyitem_RowCol_Underline == Type)
			row.setUnderline(Val);
		else if(historyitem_RowCol_Strikeout == Type)
			row.setStrikeout(Val);
		else if(historyitem_RowCol_FontAlign == Type)
			row.setFontAlign(Val);
		else if(historyitem_RowCol_AlignVertical == Type)
			row.setAlignVertical(Val);
		else if(historyitem_RowCol_AlignHorizontal == Type)
			row.setAlignHorizontal(Val);
		else if(historyitem_RowCol_Fill == Type)
			row.setFill(Val);
		else if(historyitem_RowCol_Border == Type)
		{
			if(null != Val)
				row.setBorder(Val.clone());
			else
				row.setBorder(null);
		}
		else if(historyitem_RowCol_ShrinkToFit == Type)
			row.setShrinkToFit(Val);
		else if(historyitem_RowCol_Wrap == Type)
			row.setWrap(Val);
		else if(historyitem_RowCol_NumFormat == Type)
			row.setNumFormat(Val);
        else if(historyitem_RowCol_Angle == Type)
            row.setAngle(Val);
		else if(historyitem_RowCol_SetStyle == Type)
            row.setStyle(Val);
	}
}

var g_oUndoRedoComment = null;
function UndoRedoComment(wb){
	this.wb = wb;
	this.nType = UndoRedoClassTypes.Add(function(){return g_oUndoRedoComment;});
}
UndoRedoComment.prototype = {
	getClassType : function()
	{
		return this.nType;
	},
	Undo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, true);
	},
	Redo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, false);
	},
	UndoRedo : function (Type, Data, nSheetId, bUndo)
	{
		var wsModel = this.wb.getWorksheetById(nSheetId);
		if ( !wsModel.aComments )
			wsModel.aComments = [];

		var api = window["Asc"]["editor"];
		if ( !api.wb )
			return;
		var ws = api.wb.getWorksheetById(nSheetId);
		Data.worksheet = ws;

		var cellCommentator = ws.cellCommentator;
		if ( bUndo == true )
			cellCommentator.Undo(Type, Data);
		
		else {
			// CCommentData
			if ( (Data.commentBefore == undefined) && (Data.commentAfter == undefined) ) {
				if ( !Data.bDocument ) {
					if ( false != this.wb.bCollaborativeChanges ) {
						var collaborativeEditing = this.wb.oApi.collaborativeEditing;
						Data.nRow = collaborativeEditing.getLockOtherRow2(nSheetId, Data.nRow);
						Data.nCol = collaborativeEditing.getLockOtherColumn2(nSheetId, Data.nCol);
					}
				}
			}
			// CompositeCommentData
			else {
				if ( !Data.commentAfter.bDocument ) {
					if ( false != this.wb.bCollaborativeChanges ) {
						var collaborativeEditing = this.wb.oApi.collaborativeEditing;
						
						Data.commentAfter.nRow = collaborativeEditing.getLockOtherRow2(nSheetId, Data.commentAfter.nRow);
						Data.commentAfter.nCol = collaborativeEditing.getLockOtherColumn2(nSheetId, Data.commentAfter.nCol);
					}
				}
			}
			
			cellCommentator.Redo(Type, Data);
		}
	}
}

var g_oUndoRedoDrawingObject = null;
function UndoRedoDrawingObject(wb){
	this.wb = wb;
	this.nType = UndoRedoClassTypes.Add(function(){return g_oUndoRedoDrawingObject;});
}
UndoRedoDrawingObject.prototype = {
	getClassType : function()
	{
		return this.nType;
	},
	Undo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, true);
	},
	Redo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, false);
	},
	UndoRedo : function(Type, Data, nSheetId, bUndo)
	{
		var wsModel = this.wb.getWorksheetById(nSheetId);
		if ( !wsModel.Drawings )
			wsModel.Drawings = [];

		var api = window["Asc"]["editor"];
		if ( !api.wb )
			return;
		var ws = api.wb.getWorksheetById(nSheetId);
		var objectRender = ws.objectRender;
		
		Data.worksheet = ws;
		if ( Data.isChart() )
			objectRender.intervalToIntervalObject(Data.chart);

		if ( bUndo == true )
			objectRender.Undo(Type, Data);
		else
			objectRender.Redo(Type, Data);
	}
};

var g_oUndoRedoDrawingLayer = null;
function UndoRedoDrawingLayer(wb){
	this.wb = wb;
	this.nType = UndoRedoClassTypes.Add(function(){return g_oUndoRedoDrawingLayer;});
}
UndoRedoDrawingLayer.prototype = {
	getClassType : function()
	{
		return this.nType;
	},
	Undo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, true);
	},
	Redo : function(Type, Data, nSheetId)
	{
		this.UndoRedo(Type, Data, nSheetId, false);
	},
	UndoRedo : function(Type, Data, nSheetId, bUndo)
	{
		var wsModel = this.wb.getWorksheetById(nSheetId);
		if ( !wsModel.Drawings || !wsModel.Drawings.length )
			return;
		
		var api = window["Asc"]["editor"];
		if ( !api.wb )
			return;
		var ws = api.wb.getWorksheetById(nSheetId);
		
		var objectRender = ws.objectRender;
		if (bUndo == true)
			objectRender.Undo(Type, Data);
		else
			objectRender.Redo(Type, Data);
	}
};

var g_oUndoRedoAutoFilters = null;
function UndoRedoAutoFilters(wb){
	this.wb = wb;
	this.nType = UndoRedoClassTypes.Add(function(){return g_oUndoRedoAutoFilters;});
}
UndoRedoAutoFilters.prototype = {
	getClassType : function() {
		return this.nType;
	},
	Undo : function (Type, Data, nSheetId) {
		this.UndoRedo(Type, Data, nSheetId, true);
	},
	Redo : function (Type, Data, nSheetId) {
		this.UndoRedo(Type, Data, nSheetId, false);
	},
	UndoRedo : function (Type, Data, nSheetId, bUndo) {
		var api = window["Asc"]["editor"];
		if (!api.wb)
			return;
		var ws = api.wb.getWorksheetById(nSheetId);
		Data.worksheet = ws;
		var autoFilters = ws.autoFilters;
		if (bUndo == true)
			autoFilters.Undo(Type, Data);
		else
			autoFilters.Redo(Type, Data);
	}
};