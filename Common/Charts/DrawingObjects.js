
/* DrawingObjects.js
*
* Author: Dmitry Vikulov
* Date:   13/08/2012
*/

//-----------------------------------------------------------------------------------
// Global drawing pointers
//-----------------------------------------------------------------------------------

var DrawingObject = null;
var DrawingObjectLayer = null;

if ( !window["Asc"] ) {		// Для вставки диаграмм в Word
	window["Asc"] = {};
}

function isObject(what) {
	return ( (what != null) && (typeof(what) == "object") );
}

function convertFormula(formula, ws) {
	var range = null;

	if (formula && ws) {
		var ref3D = parserHelp.is3DRef(formula, 0);
		if (!ref3D[0])
			range = ws.model.getRange2(formula.toUpperCase());
		else {
			var resultRef = parserHelp.parse3DRef(formula);
			if (null !== resultRef) {
				var ws = ws.model.workbook.getWorksheetByName(resultRef.sheet);
				if (ws)
					range = ws.getRange2(resultRef.range);
			}
		}
	}
	return range;
}

function getFullImageSrc(src) {
	var start = src.substring(0, 6);
    if ( 0 != src.indexOf("http:") && 0 != src.indexOf("data:") && 0 != src.indexOf("https:") && 0 != src.indexOf("ftp:") && 0 != src.indexOf("file:") ) {
		var api = window["Asc"]["editor"];
        if ( 0 == src.indexOf(g_sResourceServiceLocalUrl + api.documentId) )
            return src;
        return g_sResourceServiceLocalUrl + api.documentId + "/media/" + src;
    }
	else
		return src;
};

//-----------------------------------------------------------------------------------
// Интерфейс < Excel - Word >
//-----------------------------------------------------------------------------------

function CChartData(bWordContext, chart) {

	var _this = this;
	
	_this.Id = bWordContext ? g_oIdCounter.Get_NewId() : "";
	_this.img = chart ? chart.img : "";
	_this.width = chart ? chart.width : c_oAscChartDefines.defaultChartWidth;
	_this.height = chart ? chart.height : c_oAscChartDefines.defaultChartHeight;
	_this.bChartEditor = chart ? chart.bChartEditor : true;
	
	_this.type = chart ? chart.type : "";
	_this.subType = chart ? chart.subType : c_oAscChartSubType.normal;

	if ( chart ) {
		_this.header = {
			title: chart.header.title,
			subTitle: chart.header.subTitle,
			bDefaultTitle: chart.header.bDefaultTitle,
			font: {
				name: chart.header.font.name,
				size: chart.header.font.size,
				color: chart.header.font.color,
				bold: chart.header.font.bold,
				italic: chart.header.font.italic,
				underline: chart.header.font.underline
			}
		};
		_this.range = {
			interval: chart.range.interval,
			rows: chart.range.rows,
			columns: chart.range.columns
		};
		_this.xAxis = {
			title: chart.xAxis.title,
			bDefaultTitle: chart.xAxis.bDefaultTitle,
			bShow: chart.xAxis.bShow,
			bGrid: chart.xAxis.bGrid,
			titleFont: {
				name: chart.xAxis.titleFont.name,
				size: chart.xAxis.titleFont.size,
				color: chart.xAxis.titleFont.color,
				bold: chart.xAxis.titleFont.bold,
				italic: chart.xAxis.titleFont.italic,
				underline: chart.xAxis.titleFont.underline
			},
			labelFont: {
				name: chart.xAxis.labelFont.name,
				size: chart.xAxis.labelFont.size,
				color: chart.xAxis.labelFont.color,
				bold: chart.xAxis.labelFont.bold,
				italic: chart.xAxis.labelFont.italic,
				underline: chart.xAxis.labelFont.underline
			}
		};
		_this.yAxis = {
			title: chart.yAxis.title,
			bDefaultTitle: chart.yAxis.bDefaultTitle,
			bShow: chart.yAxis.bShow,
			bGrid: chart.yAxis.bGrid,
			titleFont: {
				name: chart.yAxis.titleFont.name,
				size: chart.yAxis.titleFont.size,
				color: chart.yAxis.titleFont.color,
				bold: chart.yAxis.titleFont.bold,
				italic: chart.yAxis.titleFont.italic,
				underline: chart.yAxis.titleFont.underline
			},
			labelFont: {
				name: chart.xAxis.labelFont.name,
				size: chart.xAxis.labelFont.size,
				color: chart.xAxis.labelFont.color,
				bold: chart.xAxis.labelFont.bold,
				italic: chart.xAxis.labelFont.italic,
				underline: chart.xAxis.labelFont.underline
			}
		};
		_this.legend = {
			position: chart.legend.position,
			bShow: chart.legend.bShow,
			bOverlay: chart.legend.bOverlay,
			font: {
				name: chart.legend.font.name,
				size: chart.legend.font.size,
				color: chart.legend.font.color,
				bold: chart.legend.font.bold,
				italic: chart.legend.font.italic,
				underline: chart.legend.font.underline
			}
		};
	}
	else {
		_this.header = {
			title: "",
			subTitle: "",
			bDefaultTitle: false,
			font: {
				name: "Calibri",
				size: 18,
				color: "#000000",
				bold: 1,
				italic: 0,
				underline: 0
			}
		};
		_this.range = {
			interval: bWordContext ? "" : "Sheet1!A1:C3",
			rows: false,
			columns: true
		};
		_this.xAxis = {
			title: "",
			bDefaultTitle: false,
			bShow: true,
			bGrid: true,
			titleFont: {
				name: "Calibri",
				size: 10,
				color: "#000000",
				bold: 1,
				italic: 0,
				underline: 0
			},
			labelFont: {
				name: "Calibri",
				size: 10,
				color: "#000000",
				bold: 0,
				italic: 0,
				underline: 0
			}
		};
		_this.yAxis = {
			title: "",
			bDefaultTitle: false,
			bShow: true,
			bGrid: true,
			titleFont: {
				name: "Calibri",
				size: 10,
				color: "#000000",
				bold: 1,
				italic: 0,
				underline: 0
			},
			labelFont: {
				name: "Calibri",
				size: 10,
				color: "#000000",
				bold: 0,
				italic: 0,
				underline: 0
			}
		};
		_this.legend = {
			position: c_oAscChartLegend.right,
			bShow: true,
			bOverlay: false,
			font: {
				name: "Calibri",
				size: 10,
				color: "#000000",
				bold: 0,
				italic: 0,
				underline: 0
			}
		};
	}			
	
	_this.bShowValue = chart ? chart.bShowValue : false;
	_this.bShowBorder = chart ? chart.bShowBorder : true;
	_this.styleId = chart ? chart.styleId : c_oAscChartStyle.Standart;
	
	_this.data = [];
	_this.themeColors = [];
	_this.series = [];
	
	if ( chart ) {
		for (var row = 0; row < chart.data.length; row++) {
		
			var values = [];
			for (var col = 0; col < chart.data[row].length; col++) {
		
				var item = {};
				item.numFormatStr = chart.data[row][col].numFormatStr;
				item.isDateTimeFormat = chart.data[row][col].isDateTimeFormat;
				item.value = chart.data[row][col].value;
				values.push(item);
			}
			_this.data.push(values);
		}
		
		for (var i = 0; i < chart.themeColors.length; i++) {
			_this.themeColors.push(chart.themeColors[i]);
		}
	}
		
	
	//-----------------------------------------------------------------------------------
	// Methods
	//-----------------------------------------------------------------------------------
	
	_this.clone = function() {
	
		function clone(o) {
			if ( !o || "object" !== typeof o )  {
				return o;
			}
			var c = "function" === typeof o.pop ? [] : {};
			var p, v;
			for ( p in o ) {
				if ( o.hasOwnProperty(p) ) {
					v = o[p];
					if ( v && "object" === typeof v ) {
						c[p] = clone(v);
					}
				else c[p] = v;
				}
			}
			return c;
		}
	
		return clone(_this);
	}
	
	_this.serializeChart = function() {
	
		var chart = {};
		
		chart["img"] = _this.img;
		chart["width"] = _this.width;
		chart["height"] = _this.height;
		chart["type"] = _this.type;
		chart["subType"] = _this.subType;
		chart["bShowValue"] = _this.bShowValue;
		chart["bShowBorder"] = _this.bShowBorder;
		chart["styleId"] = _this.styleId;
		chart["bChartEditor"] = _this.bChartEditor;
		
		// Header
		chart["header"] = {};
		chart["header"]["title"] = _this.header.title;
		chart["header"]["subTitle"] = _this.header.subTitle;
		chart["header"]["bDefaultTitle"] = _this.header.bDefaultTitle;
		
		chart["header"]["font"] = {};
		chart["header"]["font"]["name"] = _this.header.font.name;
		chart["header"]["font"]["size"] = _this.header.font.size;
		chart["header"]["font"]["color"] = _this.header.font.color;
		chart["header"]["font"]["bold"] = _this.header.font.bold;
		chart["header"]["font"]["italic"] = _this.header.font.italic;
		chart["header"]["font"]["underline"] = _this.header.font.underline;

		// Range
		chart["range"] = {};
		chart["range"]["interval"] = _this.range.interval;
		chart["range"]["rows"] = _this.range.rows;
		chart["range"]["columns"] = _this.range.columns;

		// Axis X
		chart["xAxis"] = {};
		chart["xAxis"]["title"] = _this.xAxis.title;
		chart["xAxis"]["bDefaultTitle"] = _this.xAxis.bDefaultTitle;
		chart["xAxis"]["bShow"] = _this.xAxis.bShow;
		chart["xAxis"]["bGrid"] = _this.xAxis.bGrid;
		
		chart["xAxis"]["titleFont"] = {};
		chart["xAxis"]["titleFont"]["name"] = _this.xAxis.titleFont.name;
		chart["xAxis"]["titleFont"]["size"] = _this.xAxis.titleFont.size;
		chart["xAxis"]["titleFont"]["color"] = _this.xAxis.titleFont.color;
		chart["xAxis"]["titleFont"]["bold"] = _this.xAxis.titleFont.bold;
		chart["xAxis"]["titleFont"]["italic"] = _this.xAxis.titleFont.italic;
		chart["xAxis"]["titleFont"]["underline"] = _this.xAxis.titleFont.underline;
		
		chart["xAxis"]["labelFont"] = {};
		chart["xAxis"]["labelFont"]["name"] = _this.xAxis.labelFont.name;
		chart["xAxis"]["labelFont"]["size"] = _this.xAxis.labelFont.size;
		chart["xAxis"]["labelFont"]["color"] = _this.xAxis.labelFont.color;
		chart["xAxis"]["labelFont"]["bold"] = _this.xAxis.labelFont.bold;
		chart["xAxis"]["labelFont"]["italic"] = _this.xAxis.labelFont.italic;
		chart["xAxis"]["labelFont"]["underline"] = _this.xAxis.labelFont.underline;

		// Axis Y
		chart["yAxis"] = {};
		chart["yAxis"]["title"] = _this.yAxis.title;
		chart["yAxis"]["bDefaultTitle"] = _this.yAxis.bDefaultTitle;
		chart["yAxis"]["bShow"] = _this.yAxis.bShow;
		chart["yAxis"]["bGrid"] = _this.yAxis.bGrid;
		
		chart["yAxis"]["titleFont"] = {};
		chart["yAxis"]["titleFont"]["name"] = _this.yAxis.titleFont.name;
		chart["yAxis"]["titleFont"]["size"] = _this.yAxis.titleFont.size;
		chart["yAxis"]["titleFont"]["color"] = _this.yAxis.titleFont.color;
		chart["yAxis"]["titleFont"]["bold"] = _this.yAxis.titleFont.bold;
		chart["yAxis"]["titleFont"]["italic"] = _this.yAxis.titleFont.italic;
		chart["yAxis"]["titleFont"]["underline"] = _this.yAxis.titleFont.underline;
		
		chart["yAxis"]["labelFont"] = {};
		chart["yAxis"]["labelFont"]["name"] = _this.yAxis.labelFont.name;
		chart["yAxis"]["labelFont"]["size"] = _this.yAxis.labelFont.size;
		chart["yAxis"]["labelFont"]["color"] = _this.yAxis.labelFont.color;
		chart["yAxis"]["labelFont"]["bold"] = _this.yAxis.labelFont.bold;
		chart["yAxis"]["labelFont"]["italic"] = _this.yAxis.labelFont.italic;
		chart["yAxis"]["labelFont"]["underline"] = _this.yAxis.labelFont.underline;

		// Legeng
		chart["legend"] = {};
		chart["legend"]["position"] = _this.legend.position;
		chart["legend"]["bShow"] = _this.legend.bShow;
		chart["legend"]["bOverlay"] = _this.legend.bOverlay;
		
		chart["legend"]["font"] = {};
		chart["legend"]["font"]["name"] = _this.legend.font.name;
		chart["legend"]["font"]["size"] = _this.legend.font.size;
		chart["legend"]["font"]["color"] = _this.legend.font.color;
		chart["legend"]["font"]["bold"] = _this.legend.font.bold;
		chart["legend"]["font"]["italic"] = _this.legend.font.italic;
		chart["legend"]["font"]["underline"] = _this.legend.font.underline;
			
		if ( _this.data ) {
			chart["data"] = [];
			
			for (var row = 0; row < _this.data.length; row++) {
					
				var values = [];
				for (var col = 0; col < _this.data[row].length; col++) {
										
					var item = {};
					item["numFormatStr"] = _this.data[row][col].numFormatStr;
					item["isDateTimeFormat"] = _this.data[row][col].isDateTimeFormat;
					item["value"] = _this.data[row][col].value;
					values.push(item);
				}
				chart["data"].push(values);
			}
		}
		
		if ( _this.themeColors ) {
			chart["themeColors"] = [];
			
			for (var i = 0; i < _this.themeColors.length; i++) {
				chart["themeColors"].push(_this.themeColors[i]);
			}
		}
		
		return chart;
	}
	
	_this.deserializeChart = function(chart) {
		
		_this.img = chart["img"];
		_this.width = chart["width"];
		_this.height = chart["height"];
		
		_this.type = chart["type"];
		_this.subType = chart["subType"];
		_this.bShowValue = chart["bShowValue"];
		_this.bShowBorder = chart["bShowBorder"];
		_this.styleId = chart["styleId"];
		_this.bChartEditor = chart["bChartEditor"];
		
		// Header
		_this.header.title = chart["header"]["title"];
		_this.header.subTitle = chart["header"]["subTitle"];
		_this.header.bDefaultTitle = chart["header"]["bDefaultTitle"];
		
		_this.header.font = {};
		_this.header.font.name = chart["header"]["font"]["name"];
		_this.header.font.size = chart["header"]["font"]["size"];
		_this.header.font.color = chart["header"]["font"]["color"];
		_this.header.font.bold = chart["header"]["font"]["bold"];
		_this.header.font.italic = chart["header"]["font"]["italic"];
		_this.header.font.underline = chart["header"]["font"]["underline"];
		
		// Range
		_this.range.interval = chart["range"]["interval"];
		_this.range.rows = chart["range"]["rows"];
		_this.range.columns = chart["range"]["columns"];
			
		// Axis X
		_this.xAxis.title = chart["xAxis"]["title"];
		_this.xAxis.bDefaultTitle = chart["xAxis"]["bDefaultTitle"];
		_this.xAxis.bShow = chart["xAxis"]["bShow"];
		_this.xAxis.bGrid = chart["xAxis"]["bGrid"];
		
		_this.xAxis.titleFont = {};
		_this.xAxis.titleFont.name = chart["xAxis"]["titleFont"]["name"];
		_this.xAxis.titleFont.size = chart["xAxis"]["titleFont"]["size"];
		_this.xAxis.titleFont.color = chart["xAxis"]["titleFont"]["color"];
		_this.xAxis.titleFont.bold = chart["xAxis"]["titleFont"]["bold"];
		_this.xAxis.titleFont.italic = chart["xAxis"]["titleFont"]["italic"];
		_this.xAxis.titleFont.underline = chart["xAxis"]["titleFont"]["underline"];
		
		_this.xAxis.labelFont = {};
		_this.xAxis.labelFont.name = chart["xAxis"]["labelFont"]["name"];
		_this.xAxis.labelFont.size = chart["xAxis"]["labelFont"]["size"];
		_this.xAxis.labelFont.color = chart["xAxis"]["labelFont"]["color"];
		_this.xAxis.labelFont.bold = chart["xAxis"]["labelFont"]["bold"];
		_this.xAxis.labelFont.italic = chart["xAxis"]["labelFont"]["italic"];
		_this.xAxis.labelFont.underline = chart["xAxis"]["labelFont"]["underline"];
			
		// Axis Y
		_this.yAxis.title = chart["yAxis"]["title"];
		_this.yAxis.bDefaultTitle = chart["yAxis"]["bDefaultTitle"];
		_this.yAxis.bShow = chart["yAxis"]["bShow"];
		_this.yAxis.bGrid = chart["yAxis"]["bGrid"];
		
		_this.yAxis.titleFont = {};
		_this.yAxis.titleFont.name = chart["yAxis"]["titleFont"]["name"];
		_this.yAxis.titleFont.size = chart["yAxis"]["titleFont"]["size"];
		_this.yAxis.titleFont.color = chart["yAxis"]["titleFont"]["color"];
		_this.yAxis.titleFont.bold = chart["yAxis"]["titleFont"]["bold"];
		_this.yAxis.titleFont.italic = chart["yAxis"]["titleFont"]["italic"];
		_this.yAxis.titleFont.underline = chart["yAxis"]["titleFont"]["underline"];
		
		_this.yAxis.labelFont = {};
		_this.yAxis.labelFont.name = chart["yAxis"]["labelFont"]["name"];
		_this.yAxis.labelFont.size = chart["yAxis"]["labelFont"]["size"];
		_this.yAxis.labelFont.color = chart["yAxis"]["labelFont"]["color"];
		_this.yAxis.labelFont.bold = chart["yAxis"]["labelFont"]["bold"];
		_this.yAxis.labelFont.italic = chart["yAxis"]["labelFont"]["italic"];
		_this.yAxis.labelFont.underline = chart["yAxis"]["labelFont"]["underline"];
			
		// Legend
		_this.legend.position = chart["legend"]["position"];
		_this.legend.bShow = chart["legend"]["bShow"];
		_this.legend.bOverlay = chart["legend"]["bOverlay"];
		
		_this.legend.font = {};
		_this.legend.font.name = chart["legend"]["font"]["name"];
		_this.legend.font.size = chart["legend"]["font"]["size"];
		_this.legend.font.color = chart["legend"]["font"]["color"];
		_this.legend.font.bold = chart["legend"]["font"]["bold"];
		_this.legend.font.italic = chart["legend"]["font"]["italic"];
		_this.legend.font.underline = chart["legend"]["font"]["underline"];
		
		if ( chart["data"] ) {
			_this.data = [];
			
			for (var row = 0; row < chart["data"].length; row++) {
					
				var values = [];
				for (var col = 0; col < chart["data"][row].length; col++) {
										
					var item = {};
					item.numFormatStr = chart["data"][row][col]["numFormatStr"];
					item.isDateTimeFormat = chart["data"][row][col]["isDateTimeFormat"];
					item.value = chart["data"][row][col]["value"];
					values.push(item);
				}
				_this.data.push(values);
			}
		}
		
		if ( chart["themeColors"] ) {
			_this.themeColors = [];
			
			for (var i = 0; i < chart["themeColors"].length; i++) {
				_this.themeColors.push(chart["themeColors"][i]);
			}
		}
	}

	_this.readFromDrawingObject = function(object) {
		
		if ( object && object.isChart() ) {
			
			// Доп. параметры
			_this.img = object.image.src;
			_this.width = object.image.width;
			_this.height = object.image.height;;
			
			_this.type = object.chart.type;
			_this.subType = object.chart.subType;
			_this.bShowValue = object.chart.bShowValue;
			_this.bShowBorder = object.chart.bShowBorder;
			_this.styleId = object.chart.styleId;
			_this.bChartEditor = object.chart.bChartEditor;
			
			// Header
			_this.header.title = object.chart.header.title;
			_this.header.subTitle = object.chart.header.subTitle;
			_this.header.bDefaultTitle = object.chart.header.bDefaultTitle;
			
			_this.header.font = {};
			_this.header.font.name = object.chart.header.font.name;
			_this.header.font.size = object.chart.header.font.size;
			_this.header.font.color = object.chart.header.font.color;
			_this.header.font.bold = object.chart.header.font.bold;
			_this.header.font.italic = object.chart.header.font.italic;
			_this.header.font.underline = object.chart.header.font.underline;
				
			// Range
			_this.range.interval = object.chart.range.interval;
			_this.range.rows = object.chart.range.rows;
			_this.range.columns = object.chart.range.columns;
				
			// Axis X
			_this.xAxis.title = object.chart.xAxis.title;
			_this.xAxis.bDefaultTitle = object.chart.xAxis.bDefaultTitle;
			_this.xAxis.bShow = object.chart.xAxis.bShow;
			_this.xAxis.bGrid = object.chart.xAxis.bGrid;
			
			_this.xAxis.titleFont = {};
			_this.xAxis.titleFont.name = object.chart.xAxis.titleFont.name;
			_this.xAxis.titleFont.size = object.chart.xAxis.titleFont.size;
			_this.xAxis.titleFont.color = object.chart.xAxis.titleFont.color;
			_this.xAxis.titleFont.bold = object.chart.xAxis.titleFont.bold;
			_this.xAxis.titleFont.italic = object.chart.xAxis.titleFont.italic;
			_this.xAxis.titleFont.underline = object.chart.xAxis.titleFont.underline;
			
			_this.xAxis.labelFont = {};
			_this.xAxis.labelFont.name = object.chart.xAxis.labelFont.name;
			_this.xAxis.labelFont.size = object.chart.xAxis.labelFont.size;
			_this.xAxis.labelFont.color = object.chart.xAxis.labelFont.color;
			_this.xAxis.labelFont.bold = object.chart.xAxis.labelFont.bold;
			_this.xAxis.labelFont.italic = object.chart.xAxis.labelFont.italic;
			_this.xAxis.labelFont.underline = object.chart.xAxis.labelFont.underline;
				
			// Axis Y
			_this.yAxis.title = object.chart.yAxis.title;
			_this.yAxis.bDefaultTitle = object.chart.yAxis.bDefaultTitle;
			_this.yAxis.bShow = object.chart.yAxis.bShow;
			_this.yAxis.bGrid = object.chart.yAxis.bGrid;
			
			_this.yAxis.titleFont = {};
			_this.yAxis.titleFont.name = object.chart.yAxis.titleFont.name;
			_this.yAxis.titleFont.size = object.chart.yAxis.titleFont.size;
			_this.yAxis.titleFont.color = object.chart.yAxis.titleFont.color;
			_this.yAxis.titleFont.bold = object.chart.yAxis.titleFont.bold;
			_this.yAxis.titleFont.italic = object.chart.yAxis.titleFont.italic;
			_this.yAxis.titleFont.underline = object.chart.yAxis.titleFont.underline;
			
			_this.yAxis.labelFont = {};
			_this.yAxis.labelFont.name = object.chart.yAxis.labelFont.name;
			_this.yAxis.labelFont.size = object.chart.yAxis.labelFont.size;
			_this.yAxis.labelFont.color = object.chart.yAxis.labelFont.color;
			_this.yAxis.labelFont.bold = object.chart.yAxis.labelFont.bold;
			_this.yAxis.labelFont.italic = object.chart.yAxis.labelFont.italic;
			_this.yAxis.labelFont.underline = object.chart.yAxis.labelFont.underline;
				
			// Legend
			_this.legend.position = object.chart.legend.position;
			_this.legend.bShow = object.chart.legend.bShow;
			_this.legend.bOverlay = object.chart.legend.bOverlay;
			
			_this.legend.font = {};
			_this.legend.font.name = object.chart.legend.font.name;
			_this.legend.font.size = object.chart.legend.font.size;
			_this.legend.font.color = object.chart.legend.font.color;
			_this.legend.font.bold = object.chart.legend.font.bold;
			_this.legend.font.italic = object.chart.legend.font.italic;
			_this.legend.font.underline = object.chart.legend.font.underline;
			
			_this.data = [];
			if ( object.chart.range.intervalObject ) {
				var bbox = object.chart.range.intervalObject.getBBox0();
					
				for (var row = bbox.r1; row <= bbox.r2; row++) {
						
					var values = [];
					for (var col = bbox.c1; col <= bbox.c2; col++) {
						
						var cell = object.chart.range.intervalObject.worksheet.getCell(new CellAddress(row, col, 0));
						var item = {};
						item.numFormatStr = cell.getNumFormatStr();
						item.isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
						item.value = cell.getValue();
						values.push(item);
					}
					_this.data.push(values);
				}
			}
		}
	}
		
	_this.Get_Id = function() {
		return this.Id;
	}
	
	_this.Write_ToBinary2 = function(Writer) {
			
		var _this = this;
		Writer.WriteLong(historyitem_type_Chart);
		Writer.WriteString2( _this.Id );
		Writer.WriteString2( _this.img );
		Writer.WriteLong( _this.width );
		Writer.WriteLong( _this.height );
		Writer.WriteString2( _this.type );
		Writer.WriteString2( _this.subType );
		Writer.WriteBool( _this.bShowValue );
		Writer.WriteBool( _this.bShowBorder );
		Writer.WriteLong( _this.styleId );
		Writer.WriteBool( _this.bChartEditor );
		
		// Header
		Writer.WriteString2( _this.header.title );
		Writer.WriteString2( _this.header.subTitle );
		Writer.WriteBool( _this.header.bDefaultTitle );
		
		Writer.WriteString2( _this.header.font.name );
		Writer.WriteLong( _this.header.font.size );
		Writer.WriteString2( _this.header.font.color );
		Writer.WriteLong( _this.header.font.bold );
		Writer.WriteLong( _this.header.font.italic );
		Writer.WriteLong( _this.header.font.underline );
			
		// Range
		Writer.WriteString2( _this.range.interval );
		Writer.WriteBool( _this.range.rows );
		Writer.WriteBool( _this.range.columns );
			
		// Axis X
		Writer.WriteString2( _this.xAxis.title );
		Writer.WriteBool( _this.xAxis.bDefaultTitle );
		Writer.WriteBool( _this.xAxis.bShow );
		Writer.WriteBool( _this.xAxis.bGrid );
		
		Writer.WriteString2( _this.xAxis.titleFont.name );
		Writer.WriteLong( _this.xAxis.titleFont.size );
		Writer.WriteString2( _this.xAxis.titleFont.color );
		Writer.WriteLong( _this.xAxis.titleFont.bold );
		Writer.WriteLong( _this.xAxis.titleFont.italic );
		Writer.WriteLong( _this.xAxis.titleFont.underline );
		
		Writer.WriteString2( _this.xAxis.labelFont.name );
		Writer.WriteLong( _this.xAxis.labelFont.size );
		Writer.WriteString2( _this.xAxis.labelFont.color );
		Writer.WriteLong( _this.xAxis.labelFont.bold );
		Writer.WriteLong( _this.xAxis.labelFont.italic );
		Writer.WriteLong( _this.xAxis.labelFont.underline );
			
		// Axis Y
		Writer.WriteString2( _this.yAxis.title );
		Writer.WriteBool( _this.yAxis.bDefaultTitle );
		Writer.WriteBool( _this.yAxis.bShow );
		Writer.WriteBool( _this.yAxis.bGrid );
		
		Writer.WriteString2( _this.yAxis.titleFont.name );
		Writer.WriteLong( _this.yAxis.titleFont.size );
		Writer.WriteString2( _this.yAxis.titleFont.color );
		Writer.WriteLong( _this.yAxis.titleFont.bold );
		Writer.WriteLong( _this.yAxis.titleFont.italic );
		Writer.WriteLong( _this.yAxis.titleFont.underline );
		
		Writer.WriteString2( _this.yAxis.labelFont.name );
		Writer.WriteLong( _this.yAxis.labelFont.size );
		Writer.WriteString2( _this.yAxis.labelFont.color );
		Writer.WriteLong( _this.yAxis.labelFont.bold );
		Writer.WriteLong( _this.yAxis.labelFont.italic );
		Writer.WriteLong( _this.yAxis.labelFont.underline );
			
		// Legend
		Writer.WriteString2( _this.legend.position );
		Writer.WriteBool( _this.legend.bShow );
		Writer.WriteBool( _this.legend.bOverlay );
		
		Writer.WriteString2( _this.legend.font.name );
		Writer.WriteLong( _this.legend.font.size );
		Writer.WriteString2( _this.legend.font.color );
		Writer.WriteLong( _this.legend.font.bold );
		Writer.WriteLong( _this.legend.font.italic );
		Writer.WriteLong( _this.legend.font.underline );
		
		/*
		* numFormatStr
		* isDateTimeFormat
		* value
		*/
		
		var rowsCount = _this.data.length;
		Writer.WriteLong( rowsCount );
		
		for (var i = 0; i < rowsCount; i++) {
		
			var colsCount = _this.data[i].length;
			Writer.WriteLong( colsCount );
			
			for (var j = 0; j < colsCount; j++) {
			
				Writer.WriteString2( _this.data[i][j].numFormatStr );
				Writer.WriteBool( _this.data[i][j].isDateTimeFormat );
				Writer.WriteString2( _this.data[i][j].value );
			}
		}
	}

	_this.Read_FromBinary2 = function(Reader) {
		
		var _this = this;
		_this.Id = Reader.GetString2();
		_this.img = Reader.GetString2();
		_this.width = Reader.GetLong();
		_this.height = Reader.GetLong();
		_this.type = Reader.GetString2();
		_this.subType = Reader.GetString2();
		_this.bShowValue = Reader.GetBool();
		_this.bShowBorder = Reader.GetBool();
		_this.styleId = Reader.GetLong();
		_this.bChartEditor = Reader.GetBool();
		
		// Header
		_this.header.title = Reader.GetString2();
		_this.header.subTitle = Reader.GetString2();
		_this.header.bDefaultTitle = Reader.GetBool();
		
		_this.header.font.name = Reader.GetString2();
		_this.header.font.size = Reader.GetLong();
		_this.header.font.color = Reader.GetString2();
		_this.header.font.bold = Reader.GetLong();
		_this.header.font.italic = Reader.GetLong();
		_this.header.font.underline = Reader.GetLong();
			
		// Range
		_this.range.interval = Reader.GetString2();
		_this.range.rows = Reader.GetBool();
		_this.range.columns = Reader.GetBool();
			
		// Axis X
		_this.xAxis.title = Reader.GetString2();
		_this.xAxis.bDefaultTitle = Reader.GetBool();
		_this.xAxis.bShow = Reader.GetBool();
		_this.xAxis.bGrid = Reader.GetBool();
		
		_this.xAxis.titleFont.name = Reader.GetString2();
		_this.xAxis.titleFont.size = Reader.GetLong();
		_this.xAxis.titleFont.color = Reader.GetString2();
		_this.xAxis.titleFont.bold = Reader.GetLong();
		_this.xAxis.titleFont.italic = Reader.GetLong();
		_this.xAxis.titleFont.underline = Reader.GetLong();
		
		_this.xAxis.labelFont.name = Reader.GetString2();
		_this.xAxis.labelFont.size = Reader.GetLong();
		_this.xAxis.labelFont.color = Reader.GetString2();
		_this.xAxis.labelFont.bold = Reader.GetLong();
		_this.xAxis.labelFont.italic = Reader.GetLong();
		_this.xAxis.labelFont.underline = Reader.GetLong();
			
		// Axis Y
		_this.yAxis.title = Reader.GetString2();
		_this.yAxis.bDefaultTitle = Reader.GetBool();
		_this.yAxis.bShow = Reader.GetBool();
		_this.yAxis.bGrid = Reader.GetBool();
		
		_this.yAxis.titleFont.name = Reader.GetString2();
		_this.yAxis.titleFont.size = Reader.GetLong();
		_this.yAxis.titleFont.color = Reader.GetString2();
		_this.yAxis.titleFont.bold = Reader.GetLong();
		_this.yAxis.titleFont.italic = Reader.GetLong();
		_this.yAxis.titleFont.underline = Reader.GetLong();
		
		_this.yAxis.labelFont.name = Reader.GetString2();
		_this.yAxis.labelFont.size = Reader.GetLong();
		_this.yAxis.labelFont.color = Reader.GetString2();
		_this.yAxis.labelFont.bold = Reader.GetLong();
		_this.yAxis.labelFont.italic = Reader.GetLong();
		_this.yAxis.labelFont.underline = Reader.GetLong();
			
		// Legend
		_this.legend.position = Reader.GetString2();
		_this.legend.bShow = Reader.GetBool();
		_this.legend.bOverlay = Reader.GetBool();
		
		_this.legend.font.name = Reader.GetString2();
		_this.legend.font.size = Reader.GetLong();
		_this.legend.font.color = Reader.GetString2();
		_this.legend.font.bold = Reader.GetLong();
		_this.legend.font.italic = Reader.GetLong();
		_this.legend.font.underline = Reader.GetLong();
		
		/*
		* numFormatStr
		* isDateTimeFormat
		* value
		*/
		
		_this.data = [];
		var rowsCount = Reader.GetLong();
					
		for (var i = 0; i < rowsCount; i++) {
		
			var values = [];
			var colsCount = Reader.GetLong();
							
			for (var j = 0; j < colsCount; j++) {
			
				var item = {};
				item.numFormatStr = Reader.GetString2();
				item.isDateTimeFormat = Reader.GetBool();
				item.value = Reader.GetString2();
				values.push(item);					
			}
			_this.data.push(values);
		}
		CollaborativeEditing.Add_NewObject( _this );
	}
	
	_this.Save_Changes = function(data, Writer) {
		_this.Write_ToBinary2(Writer);
	}
	
	_this.Load_Changes = function(Reader) {
		Reader.GetLong();	// historyitem_type_Chart
		_this.Read_FromBinary2(Reader);
	}
	
	_this.Refresh_RecalcData = function(data) {
	}
	
	_this.Undo = function(data) {
	}
	
	_this.Redo = function(data) {
	}
	
	_this.putToHistory = function() {
		var cloneChart = _this.clone();
		History.Add( _this, { chart: cloneChart } );
	}
	
	_this.documentGetAllFontNames = function(AllFonts) {
		this.documentGetAllFontNames_ExecuteFont(AllFonts, this.header.font);
		this.documentGetAllFontNames_ExecuteFont(AllFonts, this.xAxis.titleFont);
		this.documentGetAllFontNames_ExecuteFont(AllFonts, this.xAxis.labelFont);
		this.documentGetAllFontNames_ExecuteFont(AllFonts, this.yAxis.titleFont);
		this.documentGetAllFontNames_ExecuteFont(AllFonts, this.yAxis.labelFont);
		this.documentGetAllFontNames_ExecuteFont(AllFonts, this.legend.font);
		this.documentGetAllFontNames_ExecuteFont(AllFonts, this.legend.font);
		for(var i = 0, length = this.series.length; i < length; ++i)
		{
			var seria = this.series[i];
			if(null != seria)
			{
				this.documentGetAllFontNames_ExecuteFont(AllFonts, seria.titleFont);
				this.documentGetAllFontNames_ExecuteFont(AllFonts, seria.labelFont);
			}
		}
	}
	_this.documentGetAllFontNames_ExecuteFont = function(AllFonts, font) {
		if(null != font && null != font.name)
			AllFonts[font.name] = true;
	}
	
	if ( bWordContext )
		g_oTableId.Add( _this, _this.Id );
}

//-----------------------------------------------------------------------------------
// Chart style
//-----------------------------------------------------------------------------------

function asc_CChartStyle() {
	this.style = null;
	this.imageUrl = null;
}

asc_CChartStyle.prototype = {
	asc_getStyle: function() { return this.style; },
	asc_setStyle: function(style) { this.style = style; },

	asc_getImageUrl: function() { return this.imageUrl; },
	asc_setImageUrl: function(imageUrl) { this.imageUrl = imageUrl; }
}

//{ asc_CChartStyle export
window["Asc"].asc_CChartStyle = asc_CChartStyle;
window["Asc"]["asc_CChartStyle"] = asc_CChartStyle;
prot = asc_CChartStyle.prototype;

prot["asc_getStyle"] = prot.asc_getStyle;
prot["asc_setStyle"] = prot.asc_setStyle;

prot["asc_getImageUrl"] = prot.asc_getImageUrl;
prot["asc_setImageUrl"] = prot.asc_setImageUrl;
//}

//-----------------------------------------------------------------------------------
// Chart
//-----------------------------------------------------------------------------------

function asc_CChart(object) {

	var bCopy = isObject(object);

	this.bChartEditor = bCopy ? object.bChartEditor : false;
	this.type = bCopy ? object.type : null;
	this.subType = bCopy ? object.subType : c_oAscChartSubType.normal;
	
	this.bShowValue = bCopy ? object.bShowValue : false;
	this.bShowBorder = bCopy ? object.bShowBorder : true;
	this.styleId = bCopy ? object.styleId : c_oAscChartStyle.Standart;

	this.header = bCopy ? new asc_CChartHeader(object.header) : new asc_CChartHeader();
	this.range = bCopy ? new asc_CChartRange(object.range) : new asc_CChartRange();
	
	this.xAxis = bCopy ? new asc_CChartAxisX(object.xAxis) : new asc_CChartAxisX();
	this.yAxis = bCopy ? new asc_CChartAxisY(object.yAxis) : new asc_CChartAxisY();
	
	this.legend = bCopy ? new asc_CChartLegend(object.legend) : new asc_CChartLegend();

	this.series = [];
	if ( bCopy && object.series ) {
		for (var i = 0; i < object.series.length; i++) {
			var ser = new asc_CChartSeria();

			ser.asc_setTitle(object.series[i].Tx);
			if (object.series[i].Val && object.series[i].Val.Formula)
				ser.asc_setValFormula(object.series[i].Val.Formula);
			if (object.series[i].xVal && object.series[i].xVal.Formula)
				ser.asc_setxValFormula(object.series[i].xVal.Formula);
			if (object.series[i].Marker) {
				ser.asc_setMarkerSize(object.series[i].Marker.Size);
				ser.asc_setMarkerSymbol(object.series[i].Marker.Symbol);
			}
			ser.asc_setOutlineColor(object.series[i].OutlineColor);
			ser.asc_setFormatCode(object.series[i].FormatCode);

			this.series.push(ser);
		}
	}
	
	this.Properties = {
		bChartEditor: 0,
		type: 1,
		subType: 2,
		bShowValue: 3,
		bShowBorder: 4,
		styleId: 5,
		header: 6,
		range: 7,
		xAxis: 8,
		yAxis: 9,
		legend: 10,
		series: 11
	};
}

asc_CChart.prototype = {
	asc_getType: function() { return this.type; },
	asc_setType: function(type) { this.type = type; },

	asc_getSubType: function() { return this.subType; },
	asc_setSubType: function(subType) { this.subType = subType; },

	asc_getStyleId: function() { return this.styleId; },
	asc_setStyleId: function(styleId) { this.styleId = styleId; },

	asc_getShowValueFlag: function() { return this.bShowValue; },
	asc_setShowValueFlag: function(show) { this.bShowValue = show; },
	
	asc_getShowBorderFlag: function() { return this.bShowBorder; },
	asc_setShowBorderFlag: function(show) { this.bShowBorder = show; },
	
	asc_getHeader: function() { return this.header; },
	asc_setHeader: function(headerObj) { this.header = headerObj; },

	asc_getRange: function() { return this.range; },
	asc_setRange: function(rangeObj) { this.range = rangeObj; },

	asc_getXAxis: function() { return this.xAxis; },
	asc_setXAxis: function(axisObj) { this.xAxis = axisObj; },

	asc_getYAxis: function() { return this.yAxis; },
	asc_setYAxis: function(axisObj) { this.yAxis = axisObj; },

	asc_getLegend: function() { return this.legend; },
	asc_setLegend: function(legendObj) { this.legend = legendObj; },

	asc_getSeria: function(index) { return (index < this.series.length) ? this.series[index] : null; },
	asc_setSeria: function(seriaObj) { if (seriaObj) this.series.push(seriaObj); },
	asc_removeSeries: function() { this.series = []; },
	
	asc_getChartEditorFlag: function() { return this.bChartEditor; },
	asc_setChartEditorFlag: function(value) { this.bChartEditor = value; },
	
	generateFontMap: function(oFontMap) {
		var font;
		font = this.header.asc_getFont();
		if(null != font)
			oFontMap[font.asc_getName()] = 1;
		font = this.xAxis.asc_getTitleFont();
		if(null != font)
			oFontMap[font.asc_getName()] = 1;
		font = this.xAxis.asc_getLabelFont();
		if(null != font)
			oFontMap[font.asc_getName()] = 1;
		font = this.yAxis.asc_getTitleFont();
		if(null != font)
			oFontMap[font.asc_getName()] = 1;
		font = this.yAxis.asc_getLabelFont();
		if(null != font)
			oFontMap[font.asc_getName()] = 1;
		font = this.legend.asc_getFont();
		if(null != font)
			oFontMap[font.asc_getName()] = 1;
		for(var i = 0, length = this.series.length; i < length; ++i)
		{
			var seria = this.series[i];
			if(null != seria)
			{
				font = seria.asc_getTitleFont();
				if(null != font)
					oFontMap[font.asc_getName()] = 1;
				font = seria.asc_getLabelFont();
				if(null != font)
					oFontMap[font.asc_getName()] = 1;
			}
		}
	},
	
	rebuildSeries: function() {
		var _t = this;
		var bbox = _t.range.intervalObject.getBBox0();
		_t.series = [];
		var nameIndex = 1;
		
		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
		
		function getNumCache(c1, c2, r1, r2) {
			
			// (c1 == c2) || (r1 == r2)
			var cache = [];
			
			if ( c1 == c2 ) {		// vertical cache
				for (var row = r1; row <= r2; row++) {
					var cell = _t.range.intervalObject.worksheet.getCell( new CellAddress(row, c1, 0) );
					cache.push(cell.getValue());
				}
			}
			else /*r1 == r2*/ {		// horizontal cache
				for (var col = c1; col <= c2; col++) {
					var cell = _t.range.intervalObject.worksheet.getCell( new CellAddress(r1, col, 0) );
					cache.push(cell.getValue());
				}
			}
			
			return cache;
		}
		
		function parseSeriesHeaders() {
			
			var cntLeft = 0, cntTop = 0;
			var headers = { bLeft: false, bTop: false };
			
			for (var i = bbox.r1; i <= bbox.r2; i++) {
				
				var cell = _t.range.intervalObject.worksheet.getCell( new CellAddress(i, bbox.c1, 0) );
				var value = cell.getValue();
				if ( !isNumber(value) && (value != "") )
					cntLeft++;
			}
			if ( (cntLeft > 0) && (cntLeft >= bbox.r2 - bbox.r1) )
				headers.bLeft = true;
			
			for (var i = bbox.c1; i <= bbox.c2; i++) {
				
				var cell = _t.range.intervalObject.worksheet.getCell( new CellAddress(bbox.r1, i, 0) );
				var value = cell.getValue();
				if ( !isNumber(value) && (value != "") )
					cntTop++;
			}
			if ( (cntTop > 0) && (cntTop >= bbox.c2 - bbox.c1) )
				headers.bTop = true;
			
			return headers;
		}
		
		var parsedHeaders = parseSeriesHeaders();
		
		if (_t.range.rows) {
			for (var i = bbox.r1 + (parsedHeaders.bTop ? 1 : 0); i <= bbox.r2; i++) {
				
				var ser = new asc_CChartSeria();
				var startCell = new CellAddress(i, bbox.c1 + (parsedHeaders.bLeft ? 1 : 0), 0);
				var endCell = new CellAddress(i, bbox.c2, 0);

				// Val
				if (startCell && endCell) {
					if (startCell.getID() == endCell.getID())
						ser.Val.Formula = startCell.getID();
					else {
						ser.Val.Formula = ( !rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" +_t.range.intervalObject.worksheet.sName+ "'" : _t.range.intervalObject.worksheet.sName )
											+ "!" + startCell.getID() + ":" + endCell.getID();
					}
				}
				ser.Val.NumCache = getNumCache(bbox.c1 + (parsedHeaders.bLeft ? 1 : 0), bbox.c2, i, i);
				
				// xVal
				if ( parsedHeaders.bTop ) {
					
					var start = new CellAddress(bbox.r1, bbox.c1 + (parsedHeaders.bLeft ? 1 : 0), 0);
					var end = new CellAddress(bbox.r1, bbox.c2, 0);
					
					ser.xVal.Formula = ( !rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" +_t.range.intervalObject.worksheet.sName+ "'" : _t.range.intervalObject.worksheet.sName )
										+ "!" + start.getID() + ":" + end.getID();
					ser.xVal.NumCache = getNumCache( bbox.c1 + (parsedHeaders.bLeft ? 1 : 0), bbox.c2, bbox.r1, bbox.r1 );
				}
				
				var seriaName = parsedHeaders.bLeft ? ( _t.range.intervalObject.worksheet.getCell(new CellAddress(i, bbox.c1, 0)).getValue() ) : ("Series" + nameIndex);
				ser.Tx = seriaName;
				_t.series.push(ser);
				nameIndex++;
			}
		}
		else {
			for (var i = bbox.c1 + (parsedHeaders.bLeft ? 1 : 0); i <= bbox.c2; i++) {
				
				var ser = new asc_CChartSeria();
				var startCell = new CellAddress(bbox.r1 + (parsedHeaders.bTop ? 1 : 0), i, 0);
				var endCell = new CellAddress(bbox.r2, i, 0);

				// Val
				if (startCell && endCell) {
					if (startCell.getID() == endCell.getID())
						ser.Val.Formula = startCell.getID();
					else {
						ser.Val.Formula = ( !rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" +_t.range.intervalObject.worksheet.sName+ "'" : _t.range.intervalObject.worksheet.sName )
											+ "!" + startCell.getID() + ":" + endCell.getID();
					}
				}
				ser.Val.NumCache = getNumCache(i, i, bbox.r1 + (parsedHeaders.bTop ? 1 : 0), bbox.r2);
				
				// xVal
				if ( parsedHeaders.bLeft ) {
					
					var start = new CellAddress(bbox.r1 + (parsedHeaders.bTop ? 1 : 0), bbox.c1, 0);
					var end = new CellAddress(bbox.r2, bbox.c1, 0);
					
					ser.xVal.Formula = ( !rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" +_t.range.intervalObject.worksheet.sName+ "'" : _t.range.intervalObject.worksheet.sName )
										+ "!" + start.getID() + ":" + end.getID();
					ser.xVal.NumCache = getNumCache( bbox.c1, bbox.c1, bbox.r1 + (parsedHeaders.bTop ? 1 : 0), bbox.r2 );
				}
				
				var seriaName = parsedHeaders.bTop ? ( _t.range.intervalObject.worksheet.getCell(new CellAddress(bbox.r1, i, 0)).getValue() ) : ("Series" + nameIndex);
				ser.Tx = seriaName;
				_t.series.push(ser);
				nameIndex++;
			}
		}
	},
	
	getLegendInfo: function() {
		
		var aInfo = [];
		function legendInfo() { return { text: null, color: null, marker: null } };
		var aColors = generateColors(this.series.length, arrBaseColors, true);
		
		for ( var i = 0; i < this.series.length; i++ ) {
		
			var info = new legendInfo();
			info.text = this.series[i].asc_getTitle();
			info.color = aColors[i];
			info.marker = c_oAscLegendMarkerType.Line;
			aInfo.push(info);
		}
		return aInfo;
	},
	
	//	For collaborative editing
	getType: function() {
		return UndoRedoDataTypes.ChartData;
	},

	getProperties: function() {
		return this.Properties;
	},

	getProperty: function(nType) {
		switch (nType) {
			case this.Properties.bChartEditor: return this.bChartEditor; break;
			case this.Properties.type: return this.type; break;
			case this.Properties.subType: return this.subType; break;
			case this.Properties.bShowValue: return this.bShowValue; break;
			case this.Properties.bShowBorder: return this.bShowBorder; break;
			case this.Properties.styleId: return this.styleId; break;
			case this.Properties.header: return this.header; break;
			case this.Properties.range: return this.range; break;
			case this.Properties.xAxis: return this.xAxis; break;
			case this.Properties.yAxis: return this.yAxis; break;
			case this.Properties.legend: return this.legend; break;
			case this.Properties.series: return this.series; break;
		}
	},

	setProperty: function(nType, value) {
		switch (nType) {
			case this.Properties.bChartEditor: this.bChartEditor = value; break;
			case this.Properties.type: this.type = value; break;
			case this.Properties.subType: this.subType = value; break;
			case this.Properties.bShowValue: this.bShowValue = value; break;
			case this.Properties.bShowBorder: this.bShowBorder = value; break;
			case this.Properties.styleId: this.styleId = value; break;
			case this.Properties.header: this.header = value; break;
			case this.Properties.range: this.range = value; break;
			case this.Properties.xAxis: this.xAxis = value; break;
			case this.Properties.yAxis: this.yAxis = value; break;
			case this.Properties.legend: this.legend = value; break;
			case this.Properties.series: this.series = value; break;
		}
	}
}

//{ asc_CChart export
window["Asc"].asc_CChart = asc_CChart;
window["Asc"]["asc_CChart"] = asc_CChart;
prot = asc_CChart.prototype;

prot["asc_getType"] = prot.asc_getType;
prot["asc_setType"] = prot.asc_setType;

prot["asc_getSubType"] = prot.asc_getSubType;
prot["asc_setSubType"] = prot.asc_setSubType;

prot["asc_getStyleId"] = prot.asc_getStyleId;
prot["asc_setStyleId"] = prot.asc_setStyleId;

prot["asc_getShowValueFlag"] = prot.asc_getShowValueFlag;
prot["asc_setShowValueFlag"] = prot.asc_setShowValueFlag;

prot["asc_getShowBorderFlag"] = prot.asc_getShowBorderFlag;
prot["asc_setShowBorderFlag"] = prot.asc_setShowBorderFlag;

prot["asc_getHeader"] = prot.asc_getHeader;
prot["asc_setHeader"] = prot.asc_setHeader;

prot["asc_getRange"] = prot.asc_getRange;
prot["asc_setRange"] = prot.asc_setRange;

prot["asc_getXAxis"] = prot.asc_getXAxis;
prot["asc_setXAxis"] = prot.asc_setXAxis;

prot["asc_getYAxis"] = prot.asc_getYAxis;
prot["asc_setYAxis"] = prot.asc_setYAxis;

prot["asc_getLegend"] = prot.asc_getLegend;
prot["asc_setLegend"] = prot.asc_setLegend;

prot["asc_getSeria"] = prot.asc_getSeria;
prot["asc_setSeria"] = prot.asc_setSeria;
prot["asc_removeSeries"] = prot.asc_removeSeries;

prot["asc_getChartEditorFlag"] = prot.asc_getChartEditorFlag;
prot["asc_setChartEditorFlag"] = prot.asc_setChartEditorFlag;
//}

//-----------------------------------------------------------------------------------
// Chart range
//-----------------------------------------------------------------------------------

function asc_CChartRange(object) {
	
	var bCopy = isObject(object);
	
	this.interval = bCopy ? object.interval : "";
	this.intervalObject = bCopy ? object.intervalObject : null;
	this.rows = bCopy ? object.rows : false;
	this.columns = bCopy ? object.columns : true;
	
	this.Properties = {
		interval: 0,
		rows: 1,
		columns: 2
	};
}

asc_CChartRange.prototype = {

	asc_getInterval: function() { return this.interval; },
	asc_setInterval: function(interval) { this.interval = interval; },

	asc_getRowsFlag: function() { return this.rows; },
	asc_setRowsFlag: function(value) {
		this.rows = value;
		this.columns = !value;
	},
	
	asc_getColumnsFlag: function() { return this.columns; },
	asc_setColumnsFlag: function(value) {
		this.rows = !value;
		this.columns = value;
	},
	
	//	For collaborative editing
	getType: function() {
		return UndoRedoDataTypes.ChartRange;
	},

	getProperties: function() {
		return this.Properties;
	},

	getProperty: function(nType) {
		switch (nType) {
			case this.Properties.interval: return this.interval; break;
			case this.Properties.rows: return this.rows; break;
			case this.Properties.columns: return this.columns; break;
		}
	},

	setProperty: function(nType, value) {
		switch (nType) {
			case this.Properties.interval: this.interval = value; break;
			case this.Properties.rows: this.rows = value; break;
			case this.Properties.columns: this.columns = value; break;
		}
	}
}

//{ asc_CChartRange export
window["Asc"].asc_CChartRange = asc_CChartRange;
window["Asc"]["asc_CChartRange"] = asc_CChartRange;
prot = asc_CChartRange.prototype;

prot["asc_getInterval"] = prot.asc_getInterval;
prot["asc_setInterval"] = prot.asc_setInterval;
	
prot["asc_getRowsFlag"] = prot.asc_getRowsFlag;
prot["asc_setRowsFlag"] = prot.asc_setRowsFlag;

prot["asc_getColumnsFlag"] = prot.asc_getColumnsFlag;
prot["asc_setColumnsFlag"] = prot.asc_setColumnsFlag;
//}

//-----------------------------------------------------------------------------------
// Chart title
//-----------------------------------------------------------------------------------

function asc_CChartHeader(object) {

	var bCopy = isObject(object);
	
	this.title = bCopy ? object.title : "";
	this.subTitle = bCopy ? object.subTitle : "";
	this.bDefaultTitle = bCopy ? object.bDefaultTitle : false;
	this.font = bCopy ? new asc_CChartFont(object.font) : new asc_CChartFont();
	
	if ( !bCopy ) {
		this.font.asc_setSize(18);
		this.font.asc_setBold(1);
	}
	
	this.Properties = {
		title: 0,
		subTitle: 1,
		bDefaultTitle: 2,
		font: 3
	};
}

asc_CChartHeader.prototype = {
	asc_getTitle: function() { return this.title; },
	asc_setTitle: function(title) { this.title = title; },
	
	asc_getSubTitle: function() { return this.subTitle; },
	asc_setSubTitle: function(subTitle) { this.subTitle = subTitle; },

	asc_getDefaultTitleFlag: function() { return this.bDefaultTitle; },
	asc_setDefaultTitleFlag: function(defaultTitleFlag) { this.bDefaultTitle = defaultTitleFlag; },
	
	asc_getFont: function() { return this.font; },
	asc_setFont: function(fontObj) { this.font = fontObj; },
	
	//	For collaborative editing
	getType: function() {
		return UndoRedoDataTypes.ChartHeader;
	},

	getProperties: function() {
		return this.Properties;
	},

	getProperty: function(nType) {
		switch (nType) {
			case this.Properties.title: return this.title; break;
			case this.Properties.subTitle: return this.subTitle; break;
			case this.Properties.bDefaultTitle: return this.bDefaultTitle; break;
			case this.Properties.font: return this.font; break;
		}
	},

	setProperty: function(nType, value) {
		switch (nType) {
			case this.Properties.title: this.title = value; break;
			case this.Properties.subTitle: this.subTitle = value; break;
			case this.Properties.bDefaultTitle: this.bDefaultTitle = value; break;
			case this.Properties.font: this.font = value; break;
		}
	}
}

//{ asc_CChartHeader export
window["Asc"].asc_CChartHeader = asc_CChartHeader;
window["Asc"]["asc_CChartHeader"] = asc_CChartHeader;
prot = asc_CChartHeader.prototype;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getSubTitle"] = prot.asc_getSubTitle;
prot["asc_setSubTitle"] = prot.asc_setSubTitle;

prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;

prot["asc_getFont"] = prot.asc_getFont;
prot["asc_setFont"] = prot.asc_setFont;
//}

//-----------------------------------------------------------------------------------
// Chart axis X
//-----------------------------------------------------------------------------------

function asc_CChartAxisX(object) {

	var bCopy = isObject(object);
	
	this.title = bCopy ? object.title : "";
	this.bDefaultTitle = bCopy ? object.bDefaultTitle : false;
	this.bShow = bCopy ? object.bShow : true;
	this.bGrid = bCopy ? object.bGrid : true;
	
	this.titleFont = bCopy ? new asc_CChartFont(object.titleFont) : new asc_CChartFont();
	this.labelFont = bCopy ? new asc_CChartFont(object.labelFont) : new asc_CChartFont();
	
	if ( !bCopy ) {
		this.titleFont.asc_setBold(1);
	}
	
	this.Properties = {
		title: 0,
		bDefaultTitle: 1,
		bShow: 2,
		bGrid: 3,
		titleFont: 4,
		labelFont: 5
	};
}

asc_CChartAxisX.prototype = {
	asc_getTitle: function() { return this.title; },
	asc_setTitle: function(title) { this.title = title; },

	asc_getDefaultTitleFlag: function() { return this.bDefaultTitle; },
	asc_setDefaultTitleFlag: function(defaultTitleFlag) { this.bDefaultTitle = defaultTitleFlag; },

	asc_getShowFlag: function() { return this.bShow; },
	asc_setShowFlag: function(showFlag) { this.bShow = showFlag; },

	asc_getGridFlag: function() { return this.bGrid; },
	asc_setGridFlag: function(gridFlag) { this.bGrid = gridFlag; },
	
	asc_getTitleFont: function() { return this.titleFont; },
	asc_setTitleFont: function(fontObj) { this.titleFont = fontObj; },
	
	asc_getLabelFont: function() { return this.labelFont; },
	asc_setLabelFont: function(fontObj) { this.labelFont = fontObj; },
	
	//	For collaborative editing
	getType: function() {
		return UndoRedoDataTypes.ChartAxisX;
	},

	getProperties: function() {
		return this.Properties;
	},

	getProperty: function(nType) {
		switch (nType) {
			case this.Properties.title: return this.title; break;
			case this.Properties.bDefaultTitle: return this.bDefaultTitle; break;
			case this.Properties.bShow: return this.bShow; break;
			case this.Properties.bGrid: return this.bGrid; break;
			case this.Properties.titleFont: return this.titleFont; break;
			case this.Properties.labelFont: return this.labelFont; break;
		}
	},

	setProperty: function(nType, value) {
		switch (nType) {
			case this.Properties.title: this.title = value; break;
			case this.Properties.bDefaultTitle: this.bDefaultTitle = value; break;
			case this.Properties.bShow: this.bShow = value; break;
			case this.Properties.bGrid: this.bGrid = value; break;
			case this.Properties.titleFont: this.titleFont = value; break;
			case this.Properties.labelFont: this.labelFont = value; break;
		}
	}
}

//{ asc_CChartAxisX export
window["Asc"].asc_CChartAxisX = asc_CChartAxisX;
window["Asc"]["asc_CChartAxisX"] = asc_CChartAxisX;
prot = asc_CChartAxisX.prototype;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;

prot["asc_getShowFlag"] = prot.asc_getShowFlag;
prot["asc_setShowFlag"] = prot.asc_setShowFlag;

prot["asc_getGridFlag"] = prot.asc_getGridFlag;
prot["asc_setGridFlag"] = prot.asc_setGridFlag;

prot["asc_getTitleFont"] = prot.asc_getTitleFont;
prot["asc_setTitleFont"] = prot.asc_setTitleFont;

prot["asc_getLabelFont"] = prot.asc_getLabelFont;
prot["asc_setLabelFont"] = prot.asc_setLabelFont;
//}

//-----------------------------------------------------------------------------------
// Chart axis Y
//-----------------------------------------------------------------------------------

function asc_CChartAxisY(object) {

	var bCopy = isObject(object);
	
	this.title = bCopy ? object.title : "";
	this.bDefaultTitle = bCopy ? object.bDefaultTitle : false;
	this.bShow = bCopy ? object.bShow : true;
	this.bGrid = bCopy ? object.bGrid : true;
	
	this.titleFont = bCopy ? new asc_CChartFont(object.titleFont) : new asc_CChartFont();
	this.labelFont = bCopy ? new asc_CChartFont(object.labelFont) : new asc_CChartFont();
	
	if ( !bCopy ) {
		this.titleFont.asc_setBold(1);
	}
	
	this.Properties = {
		title: 0,
		bDefaultTitle: 1,
		bShow: 2,
		bGrid: 3,
		titleFont: 4,
		labelFont: 5
	};
}

asc_CChartAxisY.prototype = {
	asc_getTitle: function() { return this.title; },
	asc_setTitle: function(title) { this.title = title; },

	asc_getDefaultTitleFlag: function() { return this.bDefaultTitle; },
	asc_setDefaultTitleFlag: function(defaultTitleFlag) { this.bDefaultTitle = defaultTitleFlag; },

	asc_getShowFlag: function() { return this.bShow; },
	asc_setShowFlag: function(showFlag) { this.bShow = showFlag; },

	asc_getGridFlag: function() { return this.bGrid; },
	asc_setGridFlag: function(gridFlag) { this.bGrid = gridFlag; },
	
	asc_getTitleFont: function() { return this.titleFont; },
	asc_setTitleFont: function(fontObj) { this.titleFont = fontObj; },
	
	asc_getLabelFont: function() { return this.labelFont; },
	asc_setLabelFont: function(fontObj) { this.labelFont = fontObj; },
	
	//	For collaborative editing
	getType: function() {
		return UndoRedoDataTypes.ChartAxisY;
	},

	getProperties: function() {
		return this.Properties;
	},

	getProperty: function(nType) {
		switch (nType) {
			case this.Properties.title: return this.title; break;
			case this.Properties.bDefaultTitle: return this.bDefaultTitle; break;
			case this.Properties.bShow: return this.bShow; break;
			case this.Properties.bGrid: return this.bGrid; break;
			case this.Properties.titleFont: return this.titleFont; break;
			case this.Properties.labelFont: return this.labelFont; break;
		}
	},

	setProperty: function(nType, value) {
		switch (nType) {
			case this.Properties.title: this.title = value; break;
			case this.Properties.bDefaultTitle: this.bDefaultTitle = value; break;
			case this.Properties.bShow: this.bShow = value; break;
			case this.Properties.bGrid: this.bGrid = value; break;
			case this.Properties.titleFont: this.titleFont = value; break;
			case this.Properties.labelFont: this.labelFont = value; break;
		}
	}
}

//{ asc_CChartAxisY export
window["Asc"].asc_CChartAxisY = asc_CChartAxisY;
window["Asc"]["asc_CChartAxisY"] = asc_CChartAxisY;
prot = asc_CChartAxisY.prototype;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;

prot["asc_getShowFlag"] = prot.asc_getShowFlag;
prot["asc_setShowFlag"] = prot.asc_setShowFlag;

prot["asc_getGridFlag"] = prot.asc_getGridFlag;
prot["asc_setGridFlag"] = prot.asc_setGridFlag;

prot["asc_getTitleFont"] = prot.asc_getTitleFont;
prot["asc_setTitleFont"] = prot.asc_setTitleFont;

prot["asc_getLabelFont"] = prot.asc_getLabelFont;
prot["asc_setLabelFont"] = prot.asc_setLabelFont;
//}

//-----------------------------------------------------------------------------------
// Chart legend
//-----------------------------------------------------------------------------------	

function asc_CChartLegend(object) {

	var bCopy = isObject(object);
	
	this.position = bCopy ? object.position : c_oAscChartLegend.right;
	this.bShow = bCopy ? object.bShow : true;
	this.bOverlay = bCopy ? object.bOverlay : false;
	this.font = bCopy ? new asc_CChartFont(object.font) : new asc_CChartFont();
	
	this.Properties = {
		position: 0,
		bShow: 1,
		bOverlay: 2,
		font: 3
	};
}

asc_CChartLegend.prototype = {
	asc_getPosition: function() { return this.position; },
	asc_setPosition: function(pos) { this.position = pos; },

	asc_getShowFlag: function() { return this.bShow; },
	asc_setShowFlag: function(showFlag) { this.bShow = showFlag; },

	asc_getOverlayFlag: function() { return this.bOverlay; },
	asc_setOverlayFlag: function(overlayFlag) { this.bOverlay = overlayFlag; },
	
	asc_getFont: function() { return this.font; },
	asc_setFont: function(fontObj) { this.font = fontObj; },
	
	//	For collaborative editing
	getType: function() {
		return UndoRedoDataTypes.ChartLegend;
	},

	getProperties: function() {
		return this.Properties;
	},

	getProperty: function(nType) {
		switch (nType) {
			case this.Properties.position: return this.position; break;
			case this.Properties.bShow: return this.bShow; break;
			case this.Properties.bOverlay: return this.bOverlay; break;
			case this.Properties.font: return this.font; break;
		}
	},

	setProperty: function(nType, value) {
		switch (nType) {
			case this.Properties.position: this.position = value; break;
			case this.Properties.bShow: this.bShow = value; break;
			case this.Properties.bOverlay: this.bOverlay = value; break;
			case this.Properties.font: this.font = value; break;
		}
	}
}

//{ asc_CChartLegend export
window["Asc"].asc_CChartLegend = asc_CChartLegend;
window["Asc"]["asc_CChartLegend"] = asc_CChartLegend;
prot = asc_CChartLegend.prototype;

prot["asc_getPosition"] = prot.asc_getPosition;
prot["asc_setPosition"] = prot.asc_setPosition;

prot["asc_getShowFlag"] = prot.asc_getShowFlag;
prot["asc_setShowFlag"] = prot.asc_setShowFlag;

prot["asc_getOverlayFlag"] = prot.asc_getOverlayFlag;
prot["asc_setOverlayFlag"] = prot.asc_setOverlayFlag;

prot["asc_getFont"] = prot.asc_getFont;
prot["asc_setFont"] = prot.asc_setFont;
//}

//-----------------------------------------------------------------------------------
// Chart series
//-----------------------------------------------------------------------------------

function asc_CChartSeria() {
	this.Val = { Formula: null, NumCache: [] };
	this.xVal = { Formula: null, NumCache: [] };
	this.Tx = null;
	this.TxFont = new asc_CChartFont();
	this.Marker = { Size: null, Symbol: null };
	this.OutlineColor = null;
	this.FormatCode = "";
	this.LabelFont = new asc_CChartFont();

	this.Properties = {
		ValFormula: 0,
		ValNumCache: 1,
		XValFormula: 2,
		XValNumCache: 3,
		Tx: 4,
		MarkerSize: 5,
		MarkerSymbol: 6,
		OutlineColor: 7,
		FormatCode: 8,
		LabelFont: 9,
		TxFont: 10
	};
}

asc_CChartSeria.prototype = {

	asc_getValFormula: function() { return this.Val.Formula; },
	asc_setValFormula: function(formula) { this.Val.Formula = formula; },

	asc_getxValFormula: function() { return this.xVal.Formula; },
	asc_setxValFormula: function(formula) { this.xVal.Formula = formula; },

	asc_getTitle: function() { return this.Tx; },
	asc_setTitle: function(title) { this.Tx = title; },
	
	asc_getTitleFont: function() { return this.TxFont; },
	asc_setTitleFont: function(title) { this.TxFont = title; },

	asc_getMarkerSize: function() { return this.Marker.Size; },
	asc_setMarkerSize: function(size) { this.Marker.Size = size; },

	asc_getMarkerSymbol: function() { return this.Marker.Symbol; },
	asc_setMarkerSymbol: function(symbol) { this.Marker.Symbol = symbol; },

	asc_getOutlineColor: function() { return this.OutlineColor; },
	asc_setOutlineColor: function(color) { this.OutlineColor = color; },
	
	asc_getFormatCode: function() { return this.FormatCode; },
	asc_setFormatCode: function(format) { this.FormatCode = format; },

	asc_getLabelFont: function() { return this.LabelFont; },
	asc_setLabelFont: function(format) { this.LabelFont = format; },
	
	//	For collaborative editing
	getType: function() {
		return UndoRedoDataTypes.ChartSeriesData;
	},

	getProperties: function() {
		return this.Properties;
	},

	getProperty: function(nType) {
		switch (nType) {
			case this.Properties.ValFormula: return this.Val.Formula; break;
			case this.Properties.ValNumCache: return this.Val.NumCache; break;
			case this.Properties.XValFormula: return this.xVal.Formula; break;
			case this.Properties.XValNumCache: return this.xVal.NumCache; break;
			case this.Properties.Tx: return this.Tx; break;
			case this.Properties.TxFont: return this.TxFont; break;
			case this.Properties.MarkerSize: return this.Marker.Size; break;
			case this.Properties.MarkerSymbol: return this.Marker.Symbol; break;
			case this.Properties.OutlineColor: return this.OutlineColor; break;
			case this.Properties.FormatCode: return this.FormatCode; break;
			case this.Properties.LabelFont: return this.LabelFont; break;
		}
	},

	setProperty: function(nType, value) {
		switch (nType) {
			case this.Properties.ValFormula: this.Val.Formula = value; break;
			case this.Properties.ValNumCache: this.Val.NumCache = value; break;
			case this.Properties.XValFormula: this.xVal.Formula = value; break;
			case this.Properties.XValNumCache: this.xVal.NumCache = value; break;
			case this.Properties.Tx: this.Tx = value; break;
			case this.Properties.TxFont: this.TxFont = value; break;
			case this.Properties.MarkerSize: this.Marker.Size = value; break;
			case this.Properties.MarkerSymbol: this.Marker.Symbol = value; break;
			case this.Properties.OutlineColor: this.OutlineColor = value; break;
			case this.Properties.FormatCode: this.FormatCode = value; break;
			case this.Properties.LabelFont: this.LabelFont = value; break;
		}
	}
}

//{ asc_CChartSeria export
window["Asc"].asc_CChartSeria = asc_CChartSeria;
window["Asc"]["asc_CChartSeria"] = asc_CChartSeria;
prot = asc_CChartSeria.prototype;

prot["asc_getValFormula"] = prot.asc_getValFormula;
prot["asc_setValFormula"] = prot.asc_setValFormula;

prot["asc_getxValFormula"] = prot.asc_getxValFormula;
prot["asc_setxValFormula"] = prot.asc_setxValFormula;

prot["asc_getTitle"] = prot.asc_getTitle;
prot["asc_setTitle"] = prot.asc_setTitle;

prot["asc_getMarkerSize"] = prot.asc_getMarkerSize;
prot["asc_setMarkerSize"] = prot.asc_setMarkerSize;

prot["asc_getMarkerSymbol"] = prot.asc_getMarkerSymbol;
prot["asc_setMarkerSymbol"] = prot.asc_setMarkerSymbol;

prot["asc_getOutlineColor"] = prot.asc_getOutlineColor;
prot["asc_setOutlineColor"] = prot.asc_setOutlineColor;

prot["asc_getFormatCode"] = prot.asc_getFormatCode;
prot["asc_setFormatCode"] = prot.asc_setFormatCode;
//}

//-----------------------------------------------------------------------------------
// Chart font
//-----------------------------------------------------------------------------------

function asc_CChartFont(object) {

	var bCopy = isObject(object);

	this.name = bCopy ? object.name : "Calibri";
	this.size = bCopy ? object.size : 10;
	this.color = bCopy ? object.color : "#000000";
	
	this.bold = bCopy ? object.bold : 0;
	this.italic = bCopy ? object.italic : 0;
	this.underline = bCopy ? object.underline : 0;
	
	this.Properties = {
		name: 0,
		size: 1,
		color: 2,
		bold: 3,
		italic: 4,
		underline: 5
	}
}

asc_CChartFont.prototype = {
	asc_getName: function() { return this.name; },
	asc_setName: function(val) { this.name = val; },

	asc_getSize: function() { return this.size; },
	asc_setSize: function(val) { this.size = val; },

	asc_getColor: function() { return this.color; },
	asc_setColor: function(val) { this.color = val; },
	
	asc_getBold: function() { return this.bold; },
	asc_setBold: function(val) { this.bold = val; },
	
	asc_getItalic: function() { return this.italic; },
	asc_setItalic: function(val) { this.italic = val; },
	
	asc_getUnderline: function() { return this.underline; },
	asc_setUnderline: function(val) { this.underline = val; },
	
	//	For collaborative editing
	getType: function() {
		return UndoRedoDataTypes.ChartFont;
	},

	getProperties: function() {
		return this.Properties;
	},

	getProperty: function(nType) {
		switch (nType) {
			case this.Properties.name: return this.name; break;
			case this.Properties.size: return this.size; break;
			case this.Properties.color: return this.color; break;
			
			case this.Properties.bold: return this.bold; break;
			case this.Properties.italic: return this.italic; break;
			case this.Properties.underline: return this.underline; break;
		}
	},

	setProperty: function(nType, value) {
		switch (nType) {
			case this.Properties.name: this.name = value; break;
			case this.Properties.size: this.size = value; break;
			case this.Properties.color: this.color = value; break;
			
			case this.Properties.bold: this.bold = value; break;
			case this.Properties.italic: this.italic = value; break;
			case this.Properties.underline: this.underline = value; break;
		}
	}
}

//{ asc_CChartFont export
window["Asc"].asc_CChartFont = asc_CChartFont;
window["Asc"]["asc_CChartFont"] = asc_CChartFont;
prot = asc_CChartFont.prototype;

prot["asc_getName"] = prot.asc_getName;
prot["asc_setName"] = prot.asc_setName;

prot["asc_getSize"] = prot.asc_getSize;
prot["asc_setSize"] = prot.asc_setSize;

prot["asc_getColor"] = prot.asc_getColor;
prot["asc_setColor"] = prot.asc_setColor;

prot["asc_getBold"] = prot.asc_getBold;
prot["asc_setBold"] = prot.asc_setBold;

prot["asc_getItalic"] = prot.asc_getItalic;
prot["asc_setItalic"] = prot.asc_setItalic;

prot["asc_getUnderline"] = prot.asc_getUnderline;
prot["asc_setUnderline"] = prot.asc_setUnderline;
//}

//-----------------------------------------------------------------------------------
// Selected graphic object(properties)
//-----------------------------------------------------------------------------------	

function asc_CSelectedObject( type, val ) {
	this.Type = (undefined != type) ? type : null;
	this.Value = (undefined != val) ? val : null;
}

asc_CSelectedObject.prototype = {
	asc_getObjectType: function() { return this.Type; },
	asc_getObjectValue: function() { return this.Value; }
}

//{ asc_CSelectedObject export
window["Asc"].asc_CSelectedObject = asc_CSelectedObject;
window["Asc"]["asc_CSelectedObject"] = asc_CSelectedObject;
prot = asc_CSelectedObject.prototype;

prot["asc_getObjectType"] = prot.asc_getObjectType;
prot["asc_getObjectValue"] = prot.asc_getObjectValue;
//}

//-----------------------------------------------------------------------------------
// CImgProperty
//-----------------------------------------------------------------------------------
	
function asc_CImgProperty( obj ) {
	
	if( obj ) {
        this.CanBeFlow = (undefined != obj.CanBeFlow) ? obj.CanBeFlow : true;

		this.Width         = (undefined != obj.Width        ) ? obj.Width                          : undefined;
		this.Height        = (undefined != obj.Height       ) ? obj.Height                         : undefined;
		this.WrappingStyle = (undefined != obj.WrappingStyle) ? obj.WrappingStyle                  : undefined;
		this.Paddings      = (undefined != obj.Paddings     ) ? new CPaddings (obj.Paddings)       : undefined;
		this.Position      = (undefined != obj.Position     ) ? new CPosition (obj.Position)       : undefined;
        this.AllowOverlap  = (undefined != obj.AllowOverlap ) ? obj.AllowOverlap                   : undefined;
        this.PositionH     = (undefined != obj.PositionH    ) ? new CImagePositionH(obj.PositionH) : undefined;
        this.PositionV     = (undefined != obj.PositionV    ) ? new CImagePositionV(obj.PositionV) : undefined;

        this.Internal_Position = (undefined != obj.Internal_Position) ? obj.Internal_Position : null;

		this.ImageUrl = (undefined != obj.ImageUrl) ? obj.ImageUrl : null;
        this.Locked   = (undefined != obj.Locked) ? obj.Locked : false;


        this.ChartProperties = (undefined != obj.ChartProperties) ? obj.ChartProperties : null;
        this.ShapeProperties = (undefined != obj.ShapeProperties) ? /*CreateAscShapePropFromProp*/(obj.ShapeProperties) : null;

        this.ChangeLevel = (undefined != obj.ChangeLevel) ? obj.ChangeLevel : null;
        this.Group = (obj.Group != undefined) ? obj.Group : null;

        this.fromGroup = obj.fromGroup != undefined ? obj.fromGroup : null;
        this.severalCharts = obj.severalCharts != undefined ? obj.severalCharts : false;
        this.severalChartTypes = obj.severalChartTypes != undefined ? obj.severalChartTypes : undefined;
        this.severalChartStyles = obj.severalChartStyles != undefined ? obj.severalChartStyles : undefined;
        this.verticalTextAlign = obj.verticalTextAlign != undefined ? obj.verticalTextAlign : undefined;
	}
	else {
        this.CanBeFlow = true;
		this.Width         = undefined;
		this.Height        = undefined;
		this.WrappingStyle = undefined;
		this.Paddings      = undefined;
		this.Position      = undefined;
        this.PositionH     = undefined;
        this.PositionV     = undefined;
        this.Internal_Position = null;
        this.ImageUrl = null;
        this.Locked   = false;

        this.ChartProperties = null;
        this.ShapeProperties = null;
        this.ImageProperties = null;

        this.ChangeLevel = null;
        this.Group = null;
        this.fromGroup = null;
        this.severalCharts = false;
        this.severalChartTypes = undefined;
        this.severalChartStyles = undefined;
        this.verticalTextAlign = undefined;
	}
}
	
asc_CImgProperty.prototype = {
	
	asc_getChangeLevel: function() { return this.ChangeLevel; },
	asc_putChangeLevel: function(v) { this.ChangeLevel = v; },

	asc_getCanBeFlow: function() { return this.CanBeFlow; },
	asc_getWidth: function() { return this.Width; },
	asc_putWidth: function(v) { this.Width = v; },
	asc_getHeight: function() { return this.Height; },
	asc_putHeight: function(v) { this.Height = v; },
	asc_getWrappingStyle: function() { return this.WrappingStyle; },
	asc_putWrappingStyle: function(v) { this.WrappingStyle = v; },
	
	// Возвращается объект класса CPaddings
	asc_getPaddings: function() { return this.Paddings; },
	// Аргумент объект класса CPaddings
	asc_putPaddings: function(v) { this.Paddings = v; },
	asc_getAllowOverlap: function() {return this.AllowOverlap;},
	asc_putAllowOverlap: function(v) {this.AllowOverlap = v;},
	// Возвращается объект класса CPosition
	asc_getPosition: function() { return this.Position; },
	// Аргумент объект класса CPosition
	asc_putPosition: function(v) { this.Position = v; },
	asc_getPositionH: function()  { return this.PositionH; },
	asc_putPositionH: function(v) { this.PositionH = v; },
	asc_getPositionV: function()  { return this.PositionV; },
	asc_putPositionV: function(v) { this.PositionV = v; },
	asc_getValue_X: function(RelativeFrom) { if ( null != this.Internal_Position ) return this.Internal_Position.Calculate_X_Value(RelativeFrom);  return 0; },
	asc_getValue_Y: function(RelativeFrom) { if ( null != this.Internal_Position ) return this.Internal_Position.Calculate_Y_Value(RelativeFrom);  return 0; },

	asc_getImageUrl: function() { return this.ImageUrl; },
	asc_putImageUrl: function(v) { this.ImageUrl = v; },
	asc_getGroup: function() { return this.Group; },
	asc_putGroup: function(v) { this.Group = v; },
	asc_getFromGroup: function() { return this.fromGroup; },
	asc_putFromGroup: function(v) { this.fromGroup = v; },
	
	asc_getisChartProps: function() { return this.isChartProps; },
	asc_putisChartPross: function(v) { this.isChartProps = v; },

	asc_getSeveralCharts: function() { return this.severalCharts; },
	asc_putSeveralCharts: function(v) { this.severalCharts = v; },
	asc_getSeveralChartTypes: function() { return this.severalChartTypes; },
	asc_putSeveralChartTypes: function(v) { this.severalChartTypes = v; },

	asc_getSeveralChartStyles: function() { return this.severalChartStyles; },
	asc_putSeveralChartStyles: function(v) { this.severalChartStyles = v; },

	asc_getVerticalTextAlign: function() { return this.verticalTextAlign; },
	asc_putVerticalTextAlign: function(v) { this.verticalTextAlign = v; },
	
	asc_getLocked: function() { return this.Locked; },
	asc_getChartProperties: function() { return this.ChartProperties; },
	asc_putChartProperties: function(v) { this.ChartProperties = v; },
	asc_getShapeProperties: function() { return this.ShapeProperties; },
	asc_putShapeProperties: function(v) { this.ShapeProperties = v; }
}

//{ asc_CImgProperty export
window["Asc"].asc_CImgProperty = asc_CImgProperty;
window["Asc"]["asc_CImgProperty"] = asc_CImgProperty;
prot = asc_CImgProperty.prototype;

prot["asc_getChangeLevel"] = prot.asc_getChangeLevel;
prot["asc_putChangeLevel"] = prot.asc_putChangeLevel;

prot["asc_getCanBeFlow"] = prot.asc_getCanBeFlow;
prot["asc_getWidth"] = prot.asc_getWidth;
prot["asc_putWidth"] = prot.asc_putWidth;
prot["asc_getHeight"] = prot.asc_getHeight;
prot["asc_putHeight"] = prot.asc_putHeight;
prot["asc_getWrappingStyle"] = prot.asc_getWrappingStyle;
prot["asc_putWrappingStyle"] = prot.asc_putWrappingStyle;

prot["asc_getPaddings"] = prot.asc_getPaddings;
prot["asc_putPaddings"] = prot.asc_putPaddings;
prot["asc_getAllowOverlap"] = prot.asc_getAllowOverlap;
prot["asc_putAllowOverlap"] = prot.asc_putAllowOverlap;
prot["asc_getPosition"] = prot.asc_getPosition;
prot["asc_putPosition"] = prot.asc_putPosition;
prot["asc_getPositionH"] = prot.asc_getPositionH;
prot["asc_putPositionH"] = prot.asc_putPositionH;
prot["asc_getPositionV"] = prot.asc_getPositionV;
prot["asc_putPositionV"] = prot.asc_putPositionV;
prot["asc_getValue_X"] = prot.asc_getValue_X;
prot["asc_getValue_Y"] = prot.asc_getValue_Y;

prot["asc_getImageUrl"] = prot.asc_getImageUrl;
prot["asc_putImageUrl"] = prot.asc_putImageUrl;
prot["asc_getGroup"] = prot.asc_getGroup;
prot["asc_putGroup"] = prot.asc_putGroup;
prot["asc_getFromGroup"] = prot.asc_getFromGroup;
prot["asc_putFromGroup"] = prot.asc_putFromGroup;
prot["asc_getisChartProps"] = prot.asc_getisChartProps;
prot["asc_putisChartPross"] = prot.asc_putisChartPross;
	
prot["asc_getSeveralCharts"] = prot.asc_getSeveralCharts;
prot["asc_putSeveralCharts"] = prot.asc_putSeveralCharts;
prot["asc_getSeveralChartTypes"] = prot.asc_getSeveralChartTypes;
prot["asc_putSeveralChartTypes"] = prot.asc_putSeveralChartTypes;
prot["asc_getSeveralChartStyles"] = prot.asc_getSeveralChartStyles;
prot["asc_putSeveralChartStyles"] = prot.asc_putSeveralChartStyles;
prot["asc_getVerticalTextAlign"] = prot.asc_getVerticalTextAlign;
prot["asc_putVerticalTextAlign"] = prot.asc_putVerticalTextAlign;
prot["asc_getLocked"] = prot.asc_getLocked;
prot["asc_getChartProperties"] = prot.asc_getChartProperties;
prot["asc_putChartProperties"] = prot.asc_putChartProperties;
prot["asc_getShapeProperties"] = prot.asc_getShapeProperties;
prot["asc_putShapeProperties"] = prot.asc_putShapeProperties;
//}

//-----------------------------------------------------------------------------------
// CShapeProperty
//-----------------------------------------------------------------------------------

function asc_CShapeProperty() {
    this.type = null; // custom
    this.fill = null;
    this.stroke = null;
}

asc_CShapeProperty.prototype = {
	
	asc_getType: function() { return this.type; },
	asc_putType: function(v) { this.type = v; },
	asc_getFill: function() { return this.fill; },
	asc_putFill: function(v) { this.fill = v; },
	asc_getStroke: function() { return this.stroke; },
	asc_putStroke: function(v) { this.stroke = v; }
}

//{ asc_CShapeProperty export
window["Asc"].asc_CShapeProperty = asc_CShapeProperty;
window["Asc"]["asc_CShapeProperty"] = asc_CShapeProperty;
prot = asc_CShapeProperty.prototype;

prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;
prot["asc_getFill"] = prot.asc_getFill;
prot["asc_putFill"] = prot.asc_putFill;
prot["asc_getStroke"] = prot.asc_getStroke;
prot["asc_putStroke"] = prot.asc_putStroke;
//}

//-----------------------------------------------------------------------------------
// CImageSize
//-----------------------------------------------------------------------------------

function asc_CImageSize( width, height, isCorrect ) {
	this.Width = (undefined == width) ? 0.0 : width;
	this.Height = (undefined == height) ? 0.0 : height;
    this.IsCorrect = isCorrect;
}

asc_CImageSize.prototype = {
	
	asc_getImageWidth: function() { return this.Width; },
	asc_getImageHeight: function() { return this.Height; },
	asc_getIsCorrect: function() { return this.IsCorrect; }
}

//{ asc_CImageSize export
window["Asc"].asc_CImageSize = asc_CImageSize;
window["Asc"]["asc_CImageSize"] = asc_CImageSize;
prot = asc_CImageSize.prototype;

prot["asc_getImageWidth"] = prot.asc_getImageWidth;
prot["asc_getImageHeight"] = prot.asc_getImageHeight;
prot["asc_getIsCorrect"] = prot.asc_getIsCorrect;
//}

//-----------------------------------------------------------------------------------
// CTexture
//-----------------------------------------------------------------------------------

function asc_CTexture() {
    this.Id = 0;
    this.Image = "";
}

asc_CTexture.prototype = {
	asc_getId: function() { return this.Id; },
	asc_getImage: function() { return this.Image; }
}

//{ asc_CTexture export
window["Asc"].asc_CTexture = asc_CTexture;
window["Asc"]["asc_CTexture"] = asc_CTexture;
prot = asc_CTexture.prototype;

prot["asc_getId"] = prot.asc_getId;
prot["asc_getImage"] = prot.asc_getImage;
//}

//-----------------------------------------------------------------------------------
// Undo/Redo
//-----------------------------------------------------------------------------------
	
DrawingObjects.prototype = {

	Undo: function(type, data) {

		switch (type) {

			case historyitem_DrawingObject_Add:
				this.deleteDrawingObject(data);
				break;

			case historyitem_DrawingObject_Remove:
				this.addDrawingObject(data);
				break;

			case historyitem_DrawingObject_Edit:
				if ((data.flags.transactionState == c_oAscTransactionState.No) || (data.flags.transactionState == c_oAscTransactionState.Start)) {
					this.deleteDrawingObject(data);
					this.addDrawingObject(data);
				}
				break;
			
			case historyitem_DrawingLayer:
				if ( data.aLayerBefore.length && data.aLayerAfter.length ) {
					var aStorage = [];
					for (var i = 0; i < data.aLayerBefore.length; i++) {
						var obj = this.getDrawingObject(data.aLayerBefore[i]);
						if ( obj )
							aStorage.push(obj);
					}
					this.changeObjectStorage(aStorage);
					this.showDrawingObjects(true, null, false);
				}
				break;
		}
	},

	Redo: function(type, data) {

		switch (type) {

			case historyitem_DrawingObject_Add:
				this.addDrawingObject(data);
				break;

			case historyitem_DrawingObject_Remove:
				this.deleteDrawingObject(data);
				break;

			case historyitem_DrawingObject_Edit:
				if ((data.flags.transactionState == c_oAscTransactionState.No) || (data.flags.transactionState == c_oAscTransactionState.Stop)) {
					this.deleteDrawingObject(data);
					this.addDrawingObject(data);
				}
				break;
			
			case historyitem_DrawingLayer:
				if ( data.aLayerBefore.length && data.aLayerAfter.length ) {
					var aStorage = [];
					for (var i = 0; i < data.aLayerAfter.length; i++) {
						var obj = this.getDrawingObject(data.aLayerAfter[i]);
						if ( obj )
							aStorage.push(obj);
					}
					this.changeObjectStorage(aStorage);
					this.showDrawingObjects(true, null, false);
				}
				break;
		}
	}
}

function DrawingObjects() {

	//-----------------------------------------------------------------------------------
	// Private
	//-----------------------------------------------------------------------------------
	
	var _this = this;
	var asc = window["Asc"];
	var api = asc["editor"];
	var chartRender = new ChartRender();
	var worksheet = null;
	var isViewerMode = null;	
	
	var drawingCtx = null;
	var overlayCtx = null;
	var shapeCtx = null;
	var shapeOverlayCtx = null;
	
	var trackOverlay = null;
	var autoShapeTrack = null;
	var scrollOffset = { x: 0, y: 0 };
	
	var aObjects = null;
	var minImageWidth = 20;
	var minImageHeight = 20;
	var minChartWidth = 160;
	var minChartHeight = 160;
	var undoRedoObject = null;
	
	var userId = null;
	var documentId = null;
	var lastObjectIndex = null;
	
	var imageLoader = new ImageLoader();	
	
	_this.drawingDocument = null;
	_this.asyncImageEndLoaded = null;
	_this.asyncImagesDocumentEndLoaded = null;
	
	//-----------------------------------------------------------------------------------
	// Create drawing
	//-----------------------------------------------------------------------------------
	
	var DrawingBase = function(ws) {
		
		var _t = this;
		_t.worksheet = ws;
		
		_t.Properties = {
			Id: 1,
			Type: 2,
			PosX: 3,
			PosY: 4,
			ExtCx: 5,
			ExtCy: 6,
			ImageSrc: 7,
			FlagCurrentCursor: 8,
			FlagsTransactionState: 9,
			ImageUrl: 10,
			FromCol: 11,
			FromColOff: 12,
			FromRow: 13,
			FromRowOff: 14,
			ToCol: 15,
			ToColOff: 16,
			ToRow: 17,
			ToRowOff: 18,
			MoveX: 19,
			MoveY: 20,
			SizeCoeff: 21,
			ChartData: 22,
			GraphicObject: 23
		};

		_t.id = g_oIdCounter ? g_oIdCounter.Get_NewId() : null;
		_t.image = new Image();
		_t.imageUrl = "";
		_t.Type = c_oAscCellAnchorType.cellanchorTwoCell;
		_t.Pos = { X: 0, Y: 0 };

		_t.from = { col: 0, colOff: 0, row: 0, rowOff: 0 };
		_t.to = { col: 0, colOff: 0, row: 0, rowOff: 0 };
		_t.ext = { cx: 0, cy: 0 };
		_t.size = { width: 0, height: 0, coeff: 1 };
		_t.move = { x: 0, y: 0, inAction: false };

		_t.chart = new asc_CChart();
		_t.graphicObject = null; // CShape or GroupShape

		_t.flags = {
			selected: false,
			anchorUpdated: false,
			lockState: c_oAscObjectLockState.No,
			currentCursor: null,
			transactionState: c_oAscTransactionState.No,
			redrawChart: false
		};

		// Свойства
		_t.isImage = function() {
			return !_t.isChart();
		}
		
		_t.isChart = function() {
			return _t.chart.type ? true : false;
		}
		
		_t.isGraphicObject = function() {
			return _t.graphicObject != null;
		}
		
		_t.getWorkbook = function() {
			return (_t.worksheet ? _t.worksheet.model.workbook : null);
		}

        _t.getCanvasContext = function() {
            return _this.drawingDocument.CanvasHitContext;
        }

		// GraphicObject: x, y, extX, extY
		_t.getGraphicObjectMetrics = function() {
			
			return { x: pxToMm(_t.getRealLeftOffset()),
					 y: pxToMm(_t.getRealTopOffset()),
					 extX: pxToMm(_t.getWidthFromTo()),
					 extY: pxToMm(_t.getHeightFromTo()) };
		}
		
		// Считаем From/To исходя из graphicObject
		_t.setGraphicObjectCoords = function() {
			if ( _t.isGraphicObject() ) {
			
				if ( (_t.graphicObject.x < 0) || (_t.graphicObject.y < 0) || (_t.graphicObject.extX <= 0) || (_t.graphicObject.extY <= 0) )
					return;
				
				var foundCol = _t.worksheet._findColUnderCursor( mmToPt(_t.graphicObject.x), true);
				if ( !foundCol ) return;
				_t.from.col = foundCol.col;
				_t.from.colOff = _t.graphicObject.x - _t.worksheet.getCellLeft(_t.from.col, 3);

				var foundRow = _t.worksheet._findRowUnderCursor( mmToPt(_t.graphicObject.y), true);
				if ( !foundRow ) return;
				_t.from.row = foundRow.row;
				_t.from.rowOff = _t.graphicObject.y - _t.worksheet.getCellTop(_t.from.row, 3);

				var _left = _t.getRealLeftOffset();
				var _top = _t.getRealTopOffset();

				var foundCol = _t.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(_t.graphicObject.extX)), true);
				while (foundCol == null) {
					_t.worksheet.expandColsOnScroll(true);
					_t.worksheet._trigger("reinitializeScrollX");
					foundCol = _t.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(_t.graphicObject.extX)), true);
				}
				_t.to.col = foundCol.col;
				_t.to.colOff = pxToMm(_left + mmToPx(_t.graphicObject.extX) - _t.worksheet.getCellLeft(_t.to.col, 0));

				var foundRow = _t.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(_t.graphicObject.extY)), true);
				while (foundRow == null) {
					_t.worksheet.expandRowsOnScroll(true);
					_t.worksheet._trigger("reinitializeScrollY");
					foundRow = _t.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(_t.graphicObject.extY)), true);
				}
				_t.to.row = foundRow.row;
				_t.to.rowOff = pxToMm(_top + mmToPx(_t.graphicObject.extY) - _t.worksheet.getCellTop(_t.to.row, 0));
			}
		}
		
		// Проверяет выход за границы
		_t.canDraw = function() {
			var result = true;

			if ( (_t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(), 0) > _t.worksheet.getCellLeft(_t.to.col, 0) + mmToPx(_t.to.colOff)) ||
				 (_t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(), 0) > _t.worksheet.getCellTop(_t.to.row, 0) + mmToPx(_t.to.rowOff)))
			{ result = false; }

			return result;
		}

		_t.canResize = function(width, height) {
			var result = true;

			if (_t.flags.currentCursor != "move") {
				if (_t.isChart()) {
					if (width == minChartWidth) {
						switch (_t.flags.currentCursor) {
							case "w-resize": case "e-resize": case "ne-resize":
							case "nw-resize": case "se-resize": case "sw-resize":
								result = false;
						}
					}
					else if (height == minChartHeight) {
						switch (_t.flags.currentCursor) {
							case "n-resize": case "s-resize": case "ne-resize":
							case "nw-resize": case "se-resize": case "sw-resize":
								result = false;
						}
					}
				}
				else {		// Image
					if (width == minImageWidth) {
						switch (_t.flags.currentCursor) {
							case "w-resize": case "e-resize": case "ne-resize":
							case "nw-resize": case "se-resize": case "sw-resize":
								result = false;
						}
					}
					else if (height == minImageHeight) {
						switch (_t.flags.currentCursor) {
							case "n-resize": case "s-resize": case "ne-resize":
							case "nw-resize": case "se-resize": case "sw-resize":
								result = false;
						}
					}
				}
			}

			return result;
		}

		_t.updateAnchorPosition = function() {

			switch (_t.Type) {
				case c_oAscCellAnchorType.cellanchorOneCell: 
					{
						var _left = _t.getRealLeftOffset();
						var _top = _t.getRealTopOffset();

						var foundCol = _t.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(_t.ext.cx)), true);
						while (foundCol == null) {
							_t.worksheet.expandColsOnScroll(true);
							_t.worksheet._trigger("reinitializeScrollX");
							foundCol = _t.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(_t.ext.cx)), true);
						}
						_t.to.col = foundCol.col;
						_t.to.colOff = pxToMm(_left + mmToPx(_t.ext.cx) - _t.worksheet.getCellLeft(_t.to.col, 0));

						var foundRow = _t.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(_t.ext.cy)), true);
						while (foundRow == null) {
							_t.worksheet.expandRowsOnScroll(true);
							_t.worksheet._trigger("reinitializeScrollY");
							foundRow = _t.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(_t.ext.cy)), true);
						}
						_t.to.row = foundRow.row;
						_t.to.rowOff = pxToMm(_top + mmToPx(_t.ext.cy) - _t.worksheet.getCellTop(_t.to.row, 0));
					}
					break;

				case c_oAscCellAnchorType.cellanchorAbsolute: 
					{
						if ( _t.Pos.X < 0 )
							_t.Pos.X = 0;
						if ( _t.Pos.Y < 0 )
							_t.Pos.Y = 0;
					
						_t.from.col = _t.worksheet._findColUnderCursor(pxToPt(mmToPx(_t.Pos.X) + _t.worksheet.getCellLeft(0, 0)), true).col;
						_t.from.colOff = pxToMm(mmToPx(_t.Pos.X) + _t.worksheet.getCellLeft(0, 0) - _t.worksheet.getCellLeft(_t.from.col, 0));

						_t.from.row = _t.worksheet._findRowUnderCursor(pxToPt(mmToPx(_t.Pos.Y) + _t.worksheet.getCellTop(0, 0)), true).row;
						_t.from.rowOff = pxToMm(mmToPx(_t.Pos.Y) + _t.worksheet.getCellTop(0, 0) - _t.worksheet.getCellTop(_t.from.row, 0));

						var _left = _t.getRealLeftOffset();
						var _top = _t.getRealTopOffset();

						var foundCol = _t.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(_t.ext.cx)), true);
						while (foundCol == null) {
							_t.worksheet.expandColsOnScroll(true);
							_t.worksheet._trigger("reinitializeScrollX");
							foundCol = _t.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(_t.ext.cx)), true);
						}
						_t.to.col = foundCol.col;
						_t.to.colOff = pxToMm(_left + mmToPx(_t.ext.cx) - _t.worksheet.getCellLeft(_t.to.col, 0));

						var foundRow = _t.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(_t.ext.cy)), true);
						while (foundRow == null) {
							_t.worksheet.expandRowsOnScroll(true);
							_t.worksheet._trigger("reinitializeScrollY");
							foundRow = _t.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(_t.ext.cy)), true);
						}
						_t.to.row = foundRow.row;
						_t.to.rowOff = pxToMm(_top + mmToPx(_t.ext.cy) - _t.worksheet.getCellTop(_t.to.row, 0));
					}
					break;
			}
			_t.flags.anchorUpdated = true;
		}

		_t.normalizeMetrics = function() {
			var width = _t.getWidthFromTo();
			var height = _t.getHeightFromTo();
			if ( width < 2 )
				_t.to.colOff = _t.from.colOff + 4;
			if ( height < 2 )
				_t.to.rowOff = _t.from.rowOff + 4;
		}
		
		// Реальное смещение по высоте
		_t.getRealTopOffset = function() {
			var val = _t.worksheet.getCellTop(_t.from.row, 0) + mmToPx(_t.from.rowOff);
			return asc.round(val);
		}

		// Реальное смещение по ширине
		_t.getRealLeftOffset = function() {
			var val = _t.worksheet.getCellLeft(_t.from.col, 0) + mmToPx(_t.from.colOff);
			return asc.round(val);
		}

		// Ширина по координатам
		_t.getWidthFromTo = function(withoutRound) {
			var val = _t.worksheet.getCellLeft(_t.to.col, 0) + mmToPx(_t.to.colOff) - _t.worksheet.getCellLeft(_t.from.col, 0) - mmToPx(_t.from.colOff);
			return withoutRound ? val : asc.round(val);
		}

		// Высота по координатам
		_t.getHeightFromTo = function(withoutRound) {
			var val = _t.worksheet.getCellTop(_t.to.row, 0) + mmToPx(_t.to.rowOff) - _t.worksheet.getCellTop(_t.from.row, 0) - mmToPx(_t.from.rowOff);
			return withoutRound ? val : asc.round(val);
		}

		// Видимая ширина при скролах
		_t.getVisibleWidth = function() {
			var fvc = _t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(), 0);
			var off = _t.getRealLeftOffset() - fvc;
			off = (off >= 0) ? 0 : Math.abs(off);
			return _t.getWidthFromTo() - off;
		}

		// Видимая высота при скролах
		_t.getVisibleHeight = function() {
			var fvr = _t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(), 0);
			var off = _t.getRealTopOffset() - fvr;
			off = (off >= 0) ? 0 : Math.abs(off);
			return _t.getHeightFromTo() - off;
		}

		// Видимое смещение объекта от первой видимой строки
		_t.getVisibleTopOffset = function(withHeader) {
			var headerRowOff = _t.worksheet.getCellTop(0, 0);
			var fvr = _t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(), 0);
			var off = _t.getRealTopOffset() - fvr;
			var off = (off > 0) ? off : 0;
			return withHeader ? headerRowOff + off : off;
		}

		// Видимое смещение объекта от первой видимой колонки
		_t.getVisibleLeftOffset = function(withHeader) {
			var headerColOff = _t.worksheet.getCellLeft(0, 0);
			var fvc = _t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(), 0);
			var off = _t.getRealLeftOffset() - fvc;
			var off = (off > 0) ? off : 0;
			return withHeader ? headerColOff + off : off;
		}

		// смещение по высоте внутри объекта
		_t.getInnerOffsetTop = function() {
			var fvr = _t.worksheet.getCellTop(_t.worksheet.getFirstVisibleRow(), 0);
			var off = _t.getRealTopOffset() - fvr;
			return (off > 0) ? 0 : asc.round(Math.abs(off) * _t.getHeightCoeff());
		}

		// смещение по ширине внутри объекта
		_t.getInnerOffsetLeft = function() {
			var fvc = _t.worksheet.getCellLeft(_t.worksheet.getFirstVisibleCol(), 0);
			var off = _t.getRealLeftOffset() - fvc;
			return (off > 0) ? 0 : asc.round(Math.abs(off) * _t.getWidthCoeff());
		}

		// коэффициент по ширине если несоответствие с реальным размером
		_t.getWidthCoeff = function() {
			return _t.image.width / _t.getWidthFromTo();
		}

		// коэффициент по высоте если несоответствие с реальным размером
		_t.getHeightCoeff = function() {
			return _t.image.height / _t.getHeightFromTo();
		}
		
		_t.getDrawingObjects = function() {	
			return _this;
		}
	}
	
	DrawingBase.prototype = {

		getObjectType: function() {
			return CLASS_TYPE_DRAWING_BASE;
		},
	
		getType: function() {
			return UndoRedoDataTypes.DrawingObjectData;
		},

		getProperties: function() {
			return this.Properties;
		},

		getProperty: function(nType) {
			switch (nType) {
				case this.Properties.Id: return this.id; break;
				case this.Properties.Type: return this.Type; break;
				case this.Properties.PosX: return this.Pos.X; break;
				case this.Properties.PosY: return this.Pos.Y; break;
				case this.Properties.ExtCx: return this.ext.cx; break;
				case this.Properties.ExtCy: return this.ext.cy; break;

				case this.Properties.ImageSrc: return this.image.src; break;

				case this.Properties.FlagCurrentCursor: return this.flags.currentCursor; break;
				case this.Properties.FlagsTransactionState: return this.flags.transactionState; break;

				case this.Properties.ImageUrl: return this.imageUrl; break;

				case this.Properties.FromCol: return this.from.col; break;
				case this.Properties.FromColOff: return this.from.colOff; break;
				case this.Properties.FromRow: return this.from.row; break;
				case this.Properties.FromRowOff: return this.from.rowOff; break;

				case this.Properties.ToCol: return this.to.col; break;
				case this.Properties.ToColOff: return this.to.colOff; break;
				case this.Properties.ToRow: return this.to.row; break;
				case this.Properties.ToRowOff: return this.to.rowOff; break;

				case this.Properties.MoveX: return this.move.x; break;
				case this.Properties.MoveY: return this.move.y; break;

				case this.Properties.SizeCoeff: return this.size.coeff; break;
				case this.Properties.ChartData: return this.chart; break;
				case this.Properties.GraphicObject: return this.graphicObject; break;
			}
		},

		setProperty: function(nType, value) {
			switch (nType) {
				case this.Properties.Id: this.id = value; break;
				case this.Properties.Type: this.Type = value; break;
				case this.Properties.PosX: this.Pos.X = value; break;
				case this.Properties.PosY: this.Pos.Y = value; break;
				case this.Properties.ExtCx: this.ext.cx = value; break;
				case this.Properties.ExtCy: this.ext.cy = value; break;

				case this.Properties.ImageSrc: this.image.src = value; break;

				case this.Properties.FlagCurrentCursor: this.flags.currentCursor = value; break;
				case this.Properties.FlagsTransactionState: this.flags.transactionState = value; break;

				case this.Properties.ImageUrl: this.imageUrl = value; break;

				case this.Properties.FromCol: this.from.col = value; break;
				case this.Properties.FromColOff: this.from.colOff = value; break;
				case this.Properties.FromRow: this.from.row = value; break;
				case this.Properties.FromRowOff: this.from.rowOff = value; break;

				case this.Properties.ToCol: this.to.col = value; break;
				case this.Properties.ToColOff: this.to.colOff = value; break;
				case this.Properties.ToRow: this.to.row = value; break;
				case this.Properties.ToRowOff: this.to.rowOff = value; break;

				case this.Properties.MoveX: this.move.x = value; break;
				case this.Properties.MoveY: this.move.y = value; break;

				case this.Properties.SizeCoeff: this.size.coeff = value; break;
				case this.Properties.ChartData: this.chart = value; break;
				case this.Properties.GraphicObject: this.graphicObject = value; break;
			}
		}
	}
	
	//-----------------------------------------------------------------------------------
	// Create drawing layer
	//-----------------------------------------------------------------------------------
	
	var DrawingLayer = function() {
	
		this.Properties = {
			aLayerBefore: 1,
			aLayerAfter: 2
		}
		
		this.aLayerBefore = [];
		this.aLayerAfter = [];
	}

	DrawingLayer.prototype = {
	
		getType: function() {
			return UndoRedoDataTypes.DrawingObjectLayer;
		},

		getProperties: function() {
			return this.Properties;
		},

		getProperty: function(nType) {
			switch (nType) {
				case this.Properties.aLayerBefore: return this.aLayerBefore; break;
				case this.Properties.aLayerAfter: return this.aLayerAfter; break;
			}
		},
		
		setProperty: function(nType, value) {
			switch (nType) {
				case this.Properties.aLayerBefore: this.aLayerBefore = value; break;
				case this.Properties.aLayerAfter: this.aLayerAfter = value; break;
			}
		}
	}
	
	//-----------------------------------------------------------------------------------
	// Constructor
	//-----------------------------------------------------------------------------------
	
	_this.createDrawingObject = function() {
	
		var drawing = new DrawingBase(worksheet);
		
		drawing.chart.range.interval = function() {
			var result = "";
			if (worksheet) {
				var selectedRange = worksheet.getSelectedRange();
				if (selectedRange) {
					var box = selectedRange.getBBox0();
					var startCell = new CellAddress(box.r1, box.c1, 0);
					var endCell = new CellAddress(box.r2, box.c2, 0);

					if (startCell && endCell) {
						var wsName = worksheet.model.sName;								
						if ( !rx_test_ws_name.test(wsName) )
							wsName = "'" + wsName + "'";
						
						if (startCell.getID() == endCell.getID())
							result = wsName + "!" + startCell.getID();
						else
							result = wsName + "!" + startCell.getID() + ":" + endCell.getID();
					}
				}
			}
			return result;
		}();

		drawing.chart.range.intervalObject = function() {
			return worksheet ? worksheet.getSelectedRange() : null;
		}();
				
		return drawing;
	}

	_this.cloneDrawingObject = function(obj) {

		var copyObject = _this.createDrawingObject();
		
		copyObject.worksheet = obj.worksheet;
		copyObject.id = obj.id;

		copyObject.Type = obj.Type;
		copyObject.Pos.X = obj.Pos.X;
		copyObject.Pos.Y = obj.Pos.Y;
		copyObject.ext.cx = obj.ext.cx;
		copyObject.ext.cy = obj.ext.cy;

		var img = new Image();
		img.src = obj.image.src;
		copyObject.image = img;

		copyObject.flags.currentCursor = obj.flags.currentCursor;
		copyObject.flags.transactionState = obj.flags.transactionState;
		copyObject.flags.redrawChart = obj.flags.redrawChart;

		copyObject.imageUrl = obj.imageUrl;

		copyObject.from.col = obj.from.col;
		copyObject.from.colOff = obj.from.colOff;
		copyObject.from.row = obj.from.row;
		copyObject.from.rowOff = obj.from.rowOff;

		copyObject.to.col = obj.to.col;
		copyObject.to.colOff = obj.to.colOff;
		copyObject.to.row = obj.to.row;
		copyObject.to.rowOff = obj.to.rowOff;

		copyObject.move.x = obj.move.x;
		copyObject.move.y = obj.move.y;
		copyObject.size.coeff = obj.size.coeff;
		
		copyObject.chart = new asc_CChart(obj.chart);
		copyObject.graphicObject = obj.graphicObject;
		copyObject.chart.worksheet = obj.chart.worksheet;

		return copyObject;
	}

	//-----------------------------------------------------------------------------------
	// Public methods
	//-----------------------------------------------------------------------------------
	
	_this.init = function(currentSheet) {

		userId = api.User.asc_getId();
		documentId = api.documentId;
		worksheet = currentSheet;
		
		drawingCtx = currentSheet.drawingCtx;
		overlayCtx = currentSheet.overlayCtx;
		shapeCtx = currentSheet.shapeCtx;
		shapeOverlayCtx = currentSheet.shapeOverlayCtx;
		
		trackOverlay = new COverlay();
		trackOverlay.init( shapeOverlayCtx.m_oContext, "ws-canvas-overlay", 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );
		
		autoShapeTrack = new CAutoshapeTrack();
		autoShapeTrack.init( trackOverlay, 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );
		
		_this.drawingDocument = new CDrawingDocument(this);
		_this.drawingDocument.AutoShapesTrack = autoShapeTrack;
		_this.drawingDocument.TargetHtmlElement = document.getElementById('id_target_cursor');
		_this.drawingDocument.InitGuiCanvasShape(api.shapeElementId);
				
		isViewerMode =  function() { return worksheet._trigger("getViewerMode"); };

		aObjects = [];
		aImagesSync = [];
		aObjectsSync = [];
		
		for (var i = 0; currentSheet.model.Drawings && (i < currentSheet.model.Drawings.length); i++) {

			currentSheet.model.Drawings[i].worksheet = worksheet;
			var clone = _this.cloneDrawingObject(currentSheet.model.Drawings[i]);
		
			if ( currentSheet.model.Drawings[i].isChart() ) {
				
				_this.calcChartInterval(clone.chart);
				clone.chart.worksheet = worksheet;
				aObjects.push( clone );
			}
				
			if ( currentSheet.model.Drawings[i].isImage() ) {
				
				aObjectsSync[aObjectsSync.length] = clone;
				aImagesSync[aImagesSync.length] = clone.imageUrl;
			}
		}
		
		// Загружаем все картинки листа
		_this.asyncImagesDocumentEndLoaded = function() {
			
			for (var i = 0; i < aObjectsSync.length; i++) {
			
				var clone = aObjectsSync[i];
				var image = api.ImageLoader.LoadImage(aImagesSync[i], 1);	// Должна быть в мапе
				
				if ( image != null ) {
				
					var headerTop = worksheet.getCellTop(0, 0);
					var headerLeft = worksheet.getCellLeft(0, 0);
									
					var x = pxToMm(clone.getVisibleLeftOffset() + headerLeft);
					var y = pxToMm(clone.getVisibleTopOffset() + headerTop);
					var w = pxToMm(clone.getWidthFromTo());
					var h = pxToMm(clone.getHeightFromTo());
					
					// CImage
					clone.graphicObject = new CImage(clone, _this);
					clone.graphicObject.initDefault( x, y, w, h, image.src );
					clone.setGraphicObjectCoords();
					clone.graphicObject.draw(shapeCtx);
					aObjects.push(clone);
				}
			}
		}	
		
		api.ImageLoader.LoadDocumentImages(aImagesSync);
		lastObjectIndex = aObjects.length;

		// Upload event
		if (window.addEventListener) {
			window.addEventListener("message", this._uploadMessage, false);
		}
		else {
			if (window.attachEvent) {
				window.attachEvent("onmessage", this._uploadMessage);
			}
		}
	}

    _this.getOverlay = function() {
        return trackOverlay;
    };

    _this.OnUpdateOverlay = function() {
        /*if (this.IsUpdateOverlayOnlyEnd)
        {
            this.IsUpdateOverlayOnEndCheck = true;
            return false;
        }  */
        //console.log("update_overlay");
        var overlay = trackOverlay;
        //if (!overlay.m_bIsShow)
        //    return;

        overlay.Clear();
        var ctx = overlay.m_oContext;

        var drDoc = this.drawingDocument;

       /* if (drDoc.m_bIsSearching)
        {
            ctx.fillStyle = "rgba(255,200,0,1)";
            ctx.beginPath();

            var drDoc = this.drawingDocument;
            for (var i = drDoc.m_lDrawingFirst; i <= drDoc.m_lDrawingEnd; i++)
            {
                var drawPage = drDoc.m_arrPages[i].drawingPage;
                drDoc.m_arrPages[i].pageIndex = i;
                drDoc.m_arrPages[i].DrawSearch(overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top, drDoc);
            }

            ctx.globalAlpha = 0.5;
            ctx.fill();
            ctx.beginPath();
            ctx.globalAlpha = 1.0;

            if (null != drDoc.CurrentSearchNavi)
            {
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = "rgba(51,102,204,255)";

                var places = drDoc.CurrentSearchNavi.Place;

                switch ((drDoc.CurrentSearchNavi.Type & 0xFF))
                {
                    case search_HdrFtr_All:
                    case search_HdrFtr_All_no_First:
                    case search_HdrFtr_First:
                    case search_HdrFtr_Even:
                    case search_HdrFtr_Odd:
                    case search_HdrFtr_Odd_no_First:
                    {
                        var _page_num = drDoc.CurrentSearchNavi.PageNum;
                        for (var i = 0; i < places.length; i++)
                        {
                            var place = places[i];
                            if (drDoc.m_lDrawingFirst <= _page_num && _page_num <= drDoc.m_lDrawingEnd)
                            {
                                var drawPage = drDoc.m_arrPages[_page_num].drawingPage;
                                drDoc.m_arrPages[place.PageNum].DrawSearchCur1(overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top, place);
                            }
                        }
                        break;
                    }
                    default:
                    {
                        for (var i = 0; i < places.length; i++)
                        {
                            var place = places[i];
                            if (drDoc.m_lDrawingFirst <= place.PageNum && place.PageNum <= drDoc.m_lDrawingEnd)
                            {
                                var drawPage = drDoc.m_arrPages[place.PageNum].drawingPage;
                                drDoc.m_arrPages[place.PageNum].DrawSearchCur1(overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top, place);
                            }
                        }
                        break;
                    }
                }

                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }   */

        if (null == drDoc.m_oDocumentRenderer)
        {
            if (drDoc.m_bIsSelection)
            {
                if (drDoc.m_bIsSelection )
                {

                    overlay.m_oControl.HtmlElement.style.display = "block";

                    if (null == overlay.m_oContext)
                        overlay.m_oContext = overlay.m_oControl.HtmlElement.getContext('2d');
                }
                drDoc.private_StartDrawSelection(overlay);


                this.controller.drawTextSelection();
                drDoc.private_EndDrawSelection();

            }

            ctx.globalAlpha = 1.0;

            this.controller.drawSelection(drDoc);
            if (_this.controller.needUpdateOverlay())
            {
                overlay.Show();
                this.drawingDocument.AutoShapesTrack.PageIndex = -1;
                this.controller.drawTracks(this.m_oDrawingDocument.AutoShapesTrack);
                this.drawingDocument.AutoShapesTrack.CorrectOverlayBounds();
            }

        }
        else
        {
            ctx.fillStyle = "rgba(51,102,204,255)";
            ctx.beginPath();

            for (var i = drDoc.m_lDrawingFirst; i <= drDoc.m_lDrawingEnd; i++)
            {
                var drawPage = drDoc.m_arrPages[i].drawingPage;
                drDoc.m_oDocumentRenderer.DrawSelection(i, overlay, drawPage.left, drawPage.top, drawPage.right - drawPage.left, drawPage.bottom - drawPage.top);
            }

            ctx.globalAlpha = 0.2;
            ctx.fill();
            ctx.beginPath();
            ctx.globalAlpha = 1.0;
        }

        return true;
    };

	_this.changeZoom = function(factor) {
		
		shapeCtx.init( drawingCtx.ctx, drawingCtx.getWidth(0), drawingCtx.getHeight(0), drawingCtx.getWidth(3), drawingCtx.getHeight(3) );
		shapeCtx.CalculateFullTransform();
		
		shapeOverlayCtx.init( overlayCtx.ctx, overlayCtx.getWidth(0), overlayCtx.getHeight(0), overlayCtx.getWidth(3), overlayCtx.getHeight(3) );
		shapeOverlayCtx.CalculateFullTransform();
		
		trackOverlay.init( shapeOverlayCtx.m_oContext, "ws-canvas-overlay", 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );
		autoShapeTrack.init( trackOverlay, 0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix, shapeOverlayCtx.m_dWidthMM, shapeOverlayCtx.m_dHeightMM );		
		autoShapeTrack.Graphics.CalculateFullTransform();
		
		_this.showDrawingObjects(true);
	}
	
	_this.getWorkbook = function() {
		return (worksheet ? worksheet.model.workbook : null);
	}
	
	_this.getCanvasContext = function() {
        return _this.drawingDocument.CanvasHitContext;
    }
	
	_this.getDrawingObjects = function() {
		return aObjects;
	}
	
	_this.getWorksheet = function() {
		return worksheet;
	}

	_this.initGlobalDrawingPointer = function() {
		DrawingObject = DrawingBase;
		DrawingObjectLayer = DrawingLayer;
	}

	_this._uploadMessage = function(event) {
		if ( null != event && null != event.data ) {

			var data = JSON.parse(event.data);
			if ((null != data) && (null != data["type"]))
			{
				if (PostMessageType.UploadImage == data["type"]) {
					if (c_oAscServerError.NoError == data["error"]) {
						var sheetId = null;
						if (null != data["input"])
							sheetId = data["input"]["sheetId"];
						var url = data["url"];
						
						if (sheetId == worksheet.model.getId()) {
							if ( api.isImageChangeUrl ) {
								_this.editImageDrawingObject(url);
								api.isImageChangeUrl = false;
							}
							else
								_this.addImageDrawingObject(url, false, null);
						}
						else
							worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
					}
					else {
						worksheet.model.workbook.handlers.trigger("asc_onError", _mapAscServerErrorToAscError(data.error), c_oAscError.Level.NoCritical);
						worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
					}
				}
			}
		}
	}

	_this.clearDrawingObjects = function() {
		worksheet._clean();
		worksheet._drawCorner();
		worksheet._drawColumnHeaders();
		worksheet._drawRowHeaders();
		worksheet._drawGrid();
		worksheet._drawCells();
		worksheet._drawCellsBorders();
		worksheet.cellCommentator.drawCommentCells(false);
		worksheet.autoFilters.drawAutoF(worksheet);
	}

	_this.raiseLayerDrawingObjects = function(bSelect) {
		
		// слой c объектами должен быть выше селекта
		var range = worksheet.getSelectedRange().bbox;
		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			
			var obj = aObjects[i];
			
			/*var width = obj.getVisibleWidth();
			var height = obj.getVisibleHeight();
			if ( (width > 0) && (height > 0) ) {
			
				overlayCtx.clearRect(pxToPt(obj.getVisibleLeftOffset(true)), pxToPt(obj.getVisibleTopOffset(true)),
									pxToPt(obj.getVisibleWidth()), pxToPt(obj.getVisibleHeight()));
				
				if ( bSelect ) {
					if (obj.flags.selected)
						_this.selectDrawingObject(i);
					
					if (obj.flags.lockState != c_oAscObjectLockState.No)
						_this.selectLockedDrawingObject(obj.id, obj.flags.lockState);
				}
			}*/
			
			/*if ( (range.c1 >= obj.from.col) && (range.c1 <= obj.to.col) && (range.r1 >= obj.from.row) && (range.r1 <= obj.to.row) ) {
				obj.graphicObject.draw(shapeCtx);
			}*/
		}
	}

	_this.countDrawingObjects = function() {
		return aObjects ? aObjects.length : 0;
	}

	_this.checkDrawingObjectIndex = function(index) {
		if (_this.countDrawingObjects() && (index >= 0) && (index < _this.countDrawingObjects()))
			return true;
		else
			return false;
	}

	//-----------------------------------------------------------------------------------
	// Optimization of drawing
	//-----------------------------------------------------------------------------------

	_this.needDrawingObjects = function() {
		var result = false;
		var fvr = worksheet.getFirstVisibleRow();
		var fvc = worksheet.getFirstVisibleCol();
		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			if ((fvr < aObjects[i].to.row + 1) && (fvc < aObjects[i].to.col + 1)) {
				result = true;
				break;
			}
		}
		return result;
	}

	_this.showOverlayDrawingObject = function(index) {
		if (_this.checkDrawingObjectIndex(index)) {
			var obj = aObjects[index];
			if ( !obj.image.complete )		// complete - дополнительная проверка в случае base64
				return;

			if (obj.image.width && obj.image.height) {
				var sWidth = obj.image.width - obj.getInnerOffsetLeft();
				var sHeight = obj.image.height - obj.getInnerOffsetTop();

				// Проверка для IE
				var dWidth = obj.getVisibleWidth();
				var dHeight = obj.getVisibleHeight();
				if ((dWidth <= 0) || (dHeight <= 0))
					return;

				overlayCtx.drawImage(obj.image,
				// обрезаем
									pxToPt(obj.getInnerOffsetLeft()), pxToPt(obj.getInnerOffsetTop()),
									pxToPt(sWidth), pxToPt(sHeight),
				// вставляем
									pxToPt(obj.getVisibleLeftOffset(true)), pxToPt(obj.getVisibleTopOffset(true)),
									pxToPt(dWidth), pxToPt(dHeight));
			}
		}
	}

	_this.showDrawingObjects = function(clearCanvas, printOptions, bUpdateCharts) {

		/*********** Print Options ***************
		printOptions : {
		ctx,
		margin : {
		left: 0,	// pt
		right: 0,	// pt
		top: 0,		// pt
		button: 0	// pt
		}
		}
		*****************************************/

		if (!_this.countDrawingObjects())
			return;

		worksheet.model.Drawings = aObjects;

		if ( drawingCtx ) {

			// всё чистим
			if (clearCanvas) {
				_this.clearDrawingObjects();
			}
				
			if ( !imageLoader.isReady() ) {
				//console.log("imageLoader - False");
				imageLoader.setReadyCallback(_this.showDrawingObjects);
			}
			else {
				//console.log("imageLoader - Ok");
				imageLoader.removeReadyCallback();
			}

			for (var i = 0; i < _this.countDrawingObjects(); i++) {

					var index = i;
					var obj = aObjects[i];
					if ( !obj.canDraw() )
						continue;
					
					// Shape render
					if ( obj.isGraphicObject() ) {
						obj.graphicObject.draw(shapeCtx);
						continue;
					}
					
					obj.normalizeMetrics();
					
					obj.size.coeff = obj.getHeightFromTo(true) / obj.getWidthFromTo(true);

					if (!obj.flags.anchorUpdated)
						obj.updateAnchorPosition();

					// History
					if (obj.move.inAction && undoRedoObject && (undoRedoObject.id == obj.id)) {

						History.Create_NewPoint();
						History.StartTransaction();

						undoRedoObject.flags.transactionState = c_oAscTransactionState.Start;
						History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Edit, worksheet.model.getId(), null, undoRedoObject);
						undoRedoObject = null;

						History.Create_NewPoint();
						var urObj = _this.cloneDrawingObject(obj);
						urObj.flags.transactionState = c_oAscTransactionState.Stop;
						History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Edit, worksheet.model.getId(), null, urObj);

						History.EndTransaction();
					}

					var srcForPrint;

					// Выход за границы
					while (worksheet.nColsCount < obj.to.col + 1) {
						worksheet.expandColsOnScroll(true);
					}
					while (worksheet.nRowsCount < obj.to.row + 1) {
						worksheet.expandRowsOnScroll(true);
					}

					if ( obj.isChart() && (obj.flags.redrawChart || bUpdateCharts) ) {
						if ( !obj.chart.range.intervalObject )
							_this.intervalToIntervalObject(obj.chart);
							
						obj.chart.rebuildSeries();
						obj.chart.worksheet = worksheet;
						var chartBase64 = chartRender.insertChart(obj.chart, null, obj.getWidthFromTo(), obj.getHeightFromTo());
						if ( !chartBase64 )
							continue;
							
						imageLoader.addImage(chartBase64);
						imageLoader.setReadyCallback(_this.showDrawingObjects);

						obj.image.onload = function() {
							obj.flags.currentCursor = null;
						}
						
						obj.image.src = chartBase64;
						obj.flags.redrawChart = false;
						continue;
					}

					var sWidth = obj.image.width - obj.getInnerOffsetLeft();
					var sHeight = obj.image.height - obj.getInnerOffsetTop();

					if ( printOptions ) {
						if ( obj.isChart() ) {
							srcForPrint = obj.image.src; // base64
						}
						else {
							srcForPrint = obj.imageUrl;
						}

						var marginRight = 0;
						if (worksheet.getCellLeft(worksheet.getLastVisibleCol(), 0) + worksheet.getColumnWidth(worksheet.getLastVisibleCol()) < obj.getRealLeftOffset() + obj.getVisibleWidth())
							marginRight = printOptions.margin.right;

						printOptions.ctx.drawImage(srcForPrint,
						// обрезаем
													pxToPt(obj.getInnerOffsetLeft()), pxToPt(obj.getInnerOffsetTop()),
													pxToPt(sWidth) - marginRight, pxToPt(sHeight),
						// вставляем
													pxToPt(obj.getVisibleLeftOffset(true)) + printOptions.margin.left, pxToPt(obj.getVisibleTopOffset(true)) + printOptions.margin.top,
													pxToPt(obj.getVisibleWidth()), pxToPt(obj.getVisibleHeight()),
													pxToPt(obj.image.width), pxToPt(obj.image.height));
					}
					else {
						if ( !obj.image.width || !obj.image.height )
							continue;

						// Проверка для IE
						var dWidth = obj.getVisibleWidth();
						var dHeight = obj.getVisibleHeight();
						if ( (dWidth <= 0) || (dHeight <= 0) )
							continue;

						drawingCtx.drawImage(obj.image,
						// обрезаем
											pxToPt(obj.getInnerOffsetLeft()), pxToPt(obj.getInnerOffsetTop()),
											pxToPt(sWidth), pxToPt(sHeight),
						// вставляем
											pxToPt(obj.getVisibleLeftOffset(true)), pxToPt(obj.getVisibleTopOffset(true)),
											pxToPt(dWidth), pxToPt(dHeight));
					}

					if ( obj.flags.selected && !printOptions )
						_this.selectDrawingObject(index);
					if ( obj.flags.lockState != c_oAscObjectLockState.No )
						_this.selectLockedDrawingObject(obj.id, obj.flags.lockState);

					obj.move.inAction = false;
			}
		}
		if ( !printOptions ) {
			worksheet._drawCollaborativeElements();
		
			if ( _this.getSelectedDrawingObjectIndex() < 0 ) {
				worksheet.cleanSelection();
				worksheet._drawSelectionRange();
				_this.raiseLayerDrawingObjects(true);
			}
		}
		_this.drawWorksheetHeaders();
	}

	_this.showOverlayGraphicObjects = function() {
		shapeOverlayCtx.put_GlobalAlpha(true, 0.5);
		shapeOverlayCtx.m_oContext.clearRect(0, 0, shapeOverlayCtx.m_lWidthPix, shapeOverlayCtx.m_lHeightPix);
		_this.controller.drawTracks(shapeOverlayCtx);
		shapeOverlayCtx.put_GlobalAlpha(true, 1);
	}
	
	_this.showOverlayDrawingObjects = function() {

		if (overlayCtx) {

			overlayCtx.clear();
			var index = _this.getSelectedDrawingObjectIndex();
			var obj = aObjects[index];
			if (!obj.flags.currentCursor)
				return;

			// выход за границы
			if (!obj.canDraw())
				return;

			var sWidth = obj.image.width - obj.getInnerOffsetLeft();
			var sHeight = obj.image.height - obj.getInnerOffsetTop();
			
			setCanvasZIndex(overlayCtx.ctx, 0.5);

			if (obj.isImage()) {

				// Проверка для IE
				var dWidth = obj.getVisibleWidth();
				var dHeight = obj.getVisibleHeight();
				if ((dWidth <= 0) || (dHeight <= 0))
					return;

				overlayCtx.drawImage(obj.image,
				/* обрезаем */pxToPt(obj.getInnerOffsetLeft()), pxToPt(obj.getInnerOffsetTop()),
									pxToPt(sWidth), pxToPt(sHeight),

				/* вставляем */pxToPt(obj.getVisibleLeftOffset(true)), pxToPt(obj.getVisibleTopOffset(true)),
									pxToPt(dWidth), pxToPt(dHeight));
			}
			else {
				overlayCtx.beginPath();
				overlayCtx.rect(pxToPt(obj.getVisibleLeftOffset(true)), pxToPt(obj.getVisibleTopOffset(true)), pxToPt(obj.getVisibleWidth()), pxToPt(obj.getVisibleHeight()));
				overlayCtx.setLineWidth(1);
				overlayCtx.setStrokeStyle("#000000");
				overlayCtx.setFillStyle("#ffffff");
				overlayCtx.fillRect(pxToPt(obj.getVisibleLeftOffset(true)), pxToPt(obj.getVisibleTopOffset(true)), pxToPt(obj.getVisibleWidth()), pxToPt(obj.getVisibleHeight()));
				overlayCtx.stroke();
			}
		}
	}

	_this.getDrawingAreaMetrics = function() {

		/*
		*	Объект, определяющий max колонку и строчку для отрисовки объектов листа
		*/

		var metrics = {
			maxCol: 0,
			maxRow: 0
		}

		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			if (aObjects[i].to.col >= metrics.maxCol)
				metrics.maxCol = aObjects[i].to.col + 1; // учитываем colOff
			if (aObjects[i].to.row >= metrics.maxRow)
				metrics.maxRow = aObjects[i].to.row + 1; // учитываем rowOff
		}

		return metrics;
	}

	_this.drawWorksheetHeaders = function() {
		worksheet._drawColumnHeaders();
		worksheet._drawRowHeaders();
	}
	
	//-----------------------------------------------------------------------------------
	// Common operation for Undo/Redo
	//-----------------------------------------------------------------------------------
	
	_this.changeObjectStorage = function(storage) {
		aObjects = storage;
	}

	_this.addDrawingObject = function(object) {

		if (object) {
			var urObj = _this.cloneDrawingObject(object);
			aObjects.push(urObj);
		}
	}

	_this.deleteDrawingObject = function(object) {

		var bResult = false;
		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			if (aObjects[i].id == object.id) {
				aObjects.splice(i, 1);
				_this.unselectDrawingObjects();
				bResult = true;
				break;
			}
		}
		return bResult;
	}

	_this.saveUndoRedoDrawingObject = function(index) {
		var selectedIndex = _this.getSelectedDrawingObjectIndex();
		if ( (selectedIndex >= 0) && (undoRedoObject == null) )
			undoRedoObject = _this.cloneDrawingObject(aObjects[selectedIndex]);
	}

	_this.clearUndoRedoDrawingObject = function() {
		undoRedoObject = null;
	}
	
	//-----------------------------------------------------------------------------------
	// For object type
	//-----------------------------------------------------------------------------------
	
	_this.addImageDrawingObject = function(imageUrl, bPackage, options) {

		if (imageUrl && !isViewerMode()) {
						
			var _image = api.ImageLoader.LoadImage(imageUrl, 1);
			var isOption = options && options.cell;
			
			if (null != _image) {
				addImageObject(_image);
			}
			else {
				_this.asyncImageEndLoaded = function(_image) {
					addImageObject(_image);
				}
			}
			
			function addImageObject(_image) {
			
				if ( !_image.Image ) {
					worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
				}
				else {
					var obj = _this.createDrawingObject();
					obj.worksheet = worksheet;
					
					obj.from.col = isOption ? options.cell.col : worksheet.getSelectedColumnIndex();
					obj.from.row = isOption ? options.cell.row : worksheet.getSelectedRowIndex();
					
					var headerTop = worksheet.getCellTop(0, 0);
					var headerLeft = worksheet.getCellLeft(0, 0);
					
					// Проверяем начальные координаты при вставке
					while ( !worksheet.cols[obj.from.col] ) {
						worksheet.expandColsOnScroll(true);
					}
					worksheet.expandColsOnScroll(true); 	// для colOff
					
					while ( !worksheet.rows[obj.from.row] ) {
						worksheet.expandRowsOnScroll(true);
					}
					worksheet.expandRowsOnScroll(true); 	// для rowOff
					
					calculateObjectMetrics(obj, isOption ? options.width : _image.Image.width, isOption ? options.height : _image.Image.height);
					
					var x = pxToMm(obj.getRealLeftOffset());
					var y = pxToMm(obj.getRealTopOffset());
					var w = pxToMm(obj.getWidthFromTo());
					var h = pxToMm(obj.getHeightFromTo());
					
					// CImage
					obj.graphicObject = new CImage(obj, _this);
					obj.graphicObject.initDefault( x, y, w, h, _image.src );
					obj.graphicObject.select(_this.controller);
					obj.setGraphicObjectCoords();
					aObjects.push(obj);
					
					worksheet.autoFilters.drawAutoF(worksheet);
					worksheet.cellCommentator.drawCommentCells(false);
					
					_this.showDrawingObjects(false);
					_this.lockDrawingObject(obj.id, bPackage ? false : true, bPackage ? false : true);
				}
				
				worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
			}
			
			function calculateObjectMetrics(object, width, height) {
				// Обработка картинок большого разрешения
				var metricCoeff = 1;
				
				var realTopOffset = object.getRealTopOffset();
				var realLeftOffset = object.getRealLeftOffset();
				
				var areaWidth = worksheet.getCellLeft(worksheet.getLastVisibleCol(), 0) - worksheet.getCellLeft(worksheet.getFirstVisibleCol(), 0); 	// по ширине
				if (areaWidth < width) {
					metricCoeff = width / areaWidth;

					width = areaWidth;
					height /= metricCoeff;
				}

				var areaHeight = worksheet.getCellTop(worksheet.getLastVisibleRow(), 0) - worksheet.getCellTop(worksheet.getFirstVisibleRow(), 0); 	// по высоте
				if (areaHeight < height) {
					metricCoeff = height / areaHeight;

					height = areaHeight;
					width /= metricCoeff;
				}

				var endPoint = worksheet._findColUnderCursor(pxToPt(realLeftOffset + width), true);
				while (endPoint == null) {
					worksheet.expandColsOnScroll(true);
					endPoint = worksheet._findColUnderCursor(pxToPt(realLeftOffset + width), true);
				}
				worksheet.expandColsOnScroll(true); 	// для colOff

				object.to.col = worksheet._findColUnderCursor(pxToPt(realLeftOffset + width), true).col;
				object.to.colOff = pxToMm(realLeftOffset + width - worksheet.getCellLeft(object.to.col, 0));

				endPoint = worksheet._findRowUnderCursor(pxToPt(realTopOffset + height), true);
				while (endPoint == null) {
					worksheet.expandRowsOnScroll(true);
					endPoint = worksheet._findRowUnderCursor(pxToPt(realTopOffset + height), true);
				}
				worksheet.expandRowsOnScroll(true); 	// для rowOff

				object.to.row = worksheet._findRowUnderCursor(pxToPt(realTopOffset + height), true).row;
				object.to.rowOff = pxToMm(realTopOffset + height - worksheet.getCellTop(object.to.row, 0));
				
				worksheet._trigger("reinitializeScroll");
			}
		}
	}

	_this.editImageDrawingObject = function(imageUrl) {
		
		if ( imageUrl && (_this.controller.selectedObjects.length == 1) ) {
			var drawingObject = _this.controller.selectedObjects[0].drawingBase;
			if ( drawingObject.graphicObject.isImage() ) {
				
				var _image = api.ImageLoader.LoadImage(imageUrl, 1);
				
				if (null != _image) {
					addImageObject(_image);
				}
				else {
					_this.asyncImageEndLoaded = function(_image) {
						addImageObject(_image);
					}
				}
				
				function addImageObject(_image) {
				
					if ( !_image.Image ) {
						worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
					}
					else {
						drawingObject.graphicObject.setRasterImage(_image.src);
						_this.showDrawingObjects(true);
						_this.selectGraphicObject();
					}
					worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
				}
			}
		}
	}
	
	_this.addChartDrawingObject = function(chart, bWithoutHistory, options) {

		if (isViewerMode())
			return;
		
		var wordChart = null;
		var bWordChart = chart["bChartEditor"];
		if ( bWordChart ) {
			
			// Заполняем объект
			wordChart = new CChartData(false);
			wordChart.deserializeChart(chart);
			
			// Инжектим тему и перестраиваем превью диаграмм
			if ( wordChart.themeColors ) {
				
				api.GuiControlColorsMap = [];
				for (var i = 0; i < wordChart.themeColors.length; i++) {
					
					var color = new RGBColor( wordChart.themeColors[i] );
					api.GuiControlColorsMap.push(new CColor(color.r, color.g, color.b));
				}
				api.chartStyleManager.init();
				api.chartPreviewManager.init();
			}
			
			var copyChart = _this.createDrawingObject();
			copyChart.chart = new asc_CChart(wordChart);
			
			copyChart.chart.data = wordChart.data ? wordChart.data : [];
			
			chart = copyChart.chart;
			_this.intervalToIntervalObject(chart);
			
			// Заполняем таблицу
			
			if ( chart.data.length ) {
				var bbox = chart.range.intervalObject.getBBox0();
				var r = bbox.r1, c = bbox.c1;
				
				for (var row = bbox.r1; row <= bbox.r2; row++) {
					
					for (var col = bbox.c1; col <= bbox.c2; col++) {
					
						var cell = chart.range.intervalObject.worksheet.getCell(new CellAddress(row, col, 0));
						cell.setNumFormat(chart.data[row - r][col - c].numFormatStr);
						cell.setValue(chart.data[row - r][col - c].value);
					}
				}
			}
			else {
				var aCells = chart.range.intervalObject.getCells();
				for ( var i = 0; i < aCells.length; i++ ) {
					aCells[i].setValue( (i + 1).toString() );
				}
			}
			worksheet._updateCellsRange(chart.range.intervalObject.getBBox0());
			_this.showDrawingObjects(false);
		}

		var _range = convertFormula(chart.range.interval, worksheet);
		if (_range)
			chart.range.intervalObject = _range;

		chart.rebuildSeries();

		var isNewChart = true;
		chart.worksheet = worksheet; 	// Для формул серий
		var chartBase64 = chartRender.insertChart(chart, null, bWordChart ? wordChart.width : c_oAscChartDefines.defaultChartWidth, bWordChart ? wordChart.height : c_oAscChartDefines.defaultChartHeight, isNewChart);
		if ( !chartBase64 )
			return false;
			
		imageLoader.addImage(chartBase64);

		// draw
		var obj = _this.createDrawingObject();
		obj.chart = chart;
		obj.flags.redrawChart = true;

		// center
		var chartLeft = options && options.left ? ptToPx(options.left) : (parseInt($("#ws-canvas").css('width')) / 2) - c_oAscChartDefines.defaultChartWidth / 2;
		var chartTop = options && options.top ? ptToPx(options.top) : (parseInt($("#ws-canvas").css('height')) / 2) - c_oAscChartDefines.defaultChartHeight / 2;

		obj.from.col = worksheet._findColUnderCursor(pxToPt(chartLeft), true).col;
		obj.from.row = worksheet._findRowUnderCursor(pxToPt(chartTop), true).row;

		var realTopOffset = obj.getRealTopOffset();
		var realLeftOffset = obj.getRealLeftOffset();

		obj.image.onload = function() {

			var objWidth = options && options.width ? options.width : obj.image.width;
			var objHeight = options && options.height ? options.height : obj.image.height;

			var endPoint = worksheet._findColUnderCursor(pxToPt(realLeftOffset + objWidth), true);
			while (endPoint == null) {
				worksheet.expandColsOnScroll(true);
				endPoint = worksheet._findColUnderCursor(pxToPt(realLeftOffset + objWidth), true);
			}
			worksheet.expandColsOnScroll(true); 	// для colOff

			obj.to.col = worksheet._findColUnderCursor(pxToPt(realLeftOffset + objWidth), true).col;
			obj.to.colOff = pxToMm(realLeftOffset + objWidth - worksheet.getCellLeft(obj.to.col, 0));

			endPoint = worksheet._findRowUnderCursor(pxToPt(realTopOffset + objHeight), true);
			while (endPoint == null) {
				worksheet.expandRowsOnScroll(true);
				endPoint = worksheet._findRowUnderCursor(pxToPt(realTopOffset + objHeight), true);
			}
			worksheet.expandRowsOnScroll(true); 	// для rowOff

			obj.to.row = worksheet._findRowUnderCursor(pxToPt(realTopOffset + objHeight), true).row;
			obj.to.rowOff = pxToMm(realTopOffset + objHeight - worksheet.getCellTop(obj.to.row, 0));

			aObjects.push(obj);

			if ( !bWithoutHistory ) {
				_this.selectDrawingObject(aObjects.length - 1);
				History.Create_NewPoint();
				var copyObject = _this.cloneDrawingObject(obj);
				History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Add, worksheet.model.getId(), null, copyObject);
			}

			_this.showDrawingObjects(false);
			
			worksheet._trigger("reinitializeScroll");
			worksheet.autoFilters.drawAutoF(worksheet);
			worksheet.cellCommentator.drawCommentCells(false);
		}
		
		obj.image.src = chartBase64;
		_this.lockDrawingObject(obj.id, true, true);
	}

	_this.editChartDrawingObject = function(chart) {

		var index = _this.getSelectedDrawingObjectIndex();
		
		// Check iframe chart editor
		if ( index < 0 ) {
			for (var i = 0; i < _this.countDrawingObjects(); i++) {
				if ( aObjects[i].isChart() && aObjects[i].chart.bChartEditor ) {
					index = i;
					break;
				}
			}
		}
		
		if ((index >= 0) && !isViewerMode()) {
			if (aObjects[index].isChart()) {
				var obj = aObjects[index];
				
				function callbackFunc(result) {
					if ( result ) {
					
						// Перед редактированием
						History.Create_NewPoint();
						History.StartTransaction();

						var copyObject = _this.cloneDrawingObject(obj);
						copyObject.flags.transactionState = c_oAscTransactionState.Start;
						History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Edit, worksheet.model.getId(), null, copyObject);

						// asc to self
						var bRebuidSeries = false;
						if ((obj.chart.range.rows != chart.range.rows) || (obj.chart.range.interval != chart.range.interval))		// Требуется перестроение серий
							bRebuidSeries = true;
						
						obj.chart = new asc_CChart(chart);
						var _range = convertFormula(obj.chart.range.interval, worksheet);
						if (_range)
							obj.chart.range.intervalObject = _range;

						if ( bRebuidSeries )
							obj.chart.rebuildSeries();

						var copyObject = _this.cloneDrawingObject(obj);
						copyObject.flags.transactionState = c_oAscTransactionState.Stop;
						History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Edit, worksheet.model.getId(), null, copyObject);
						History.EndTransaction();

						_this.selectDrawingObject(index);
						_this.selectDrawingObjectRange(index);
						obj.flags.redrawChart = true;
						_this.showDrawingObjects(false);
					}
				}
				
				// Блокируем				
				_this.lockDrawingObject(obj.id, true, true, callbackFunc);
			}
		}
	}

	_this.deleteSelectedDrawingObject = function() {

		var bResult = false;
		
		if ( !isViewerMode() ) {
		
			var index = _this.getSelectedDrawingObjectIndex();
			if ( index < 0 ) {	// try find shape
				if ( _this.controller.selectedObjects.length ) {
					var firstObjectId = _this.controller.selectedObjects[0].drawingBase.id;
					for ( var i = 0; i < aObjects.length; i++ ) {
						if ( aObjects[i].id == firstObjectId ) {
							index = i;
							break;
						}
					}
				}
			}
		
			if ( aObjects[index].isChart() && aObjects[index].chart.bChartEditor )
				return bResult;
				
			function callbackFunc(result) {
				if ( result ) {
				
					// History.Create_NewPoint();
					// var copyObject = _this.cloneDrawingObject(aObjects[index]);
					// History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Remove, worksheet.model.getId(), null, copyObject);

					aObjects.splice(index, 1);
					_this.clearDrawingObjects();
					_this.showDrawingObjects(true);
				}
			}
				
			_this.lockDrawingObject(aObjects[index].id, true, true, callbackFunc);
			bResult = true;
		}
		return bResult;
	}

	_this.updateDrawingObject = function(bInsert, operType, updateRange) {

		// !!! Не вызывается сверху если Undo/Redo

		var changedRange = null;
		var metrics = null;

		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			var obj = aObjects[i];
			var bbox = obj.isChart() ? obj.chart.range.intervalObject.getBBox0() : null;

			if (obj.isChart() || obj.isImage()) {

				History.StartTransaction();
				metrics = { from: {}, to: {} };

				metrics.from.col = obj.from.col; metrics.to.col = obj.to.col;
				metrics.from.colOff = obj.from.colOff; metrics.to.colOff = obj.to.colOff;
				metrics.from.row = obj.from.row; metrics.to.row = obj.to.row;
				metrics.from.rowOff = obj.from.rowOff; metrics.to.rowOff = obj.to.rowOff;


				if (bInsert) {	// Insert
					switch (operType) {
						case c_oAscInsertOptions.InsertColumns: 
							{

								var count = updateRange.c2 - updateRange.c1 + 1;

								// Position
								if (updateRange.c1 <= obj.from.col) {
									metrics.from.col += count;
									metrics.to.col += count;
								}
								else if ((updateRange.c1 > obj.from.col) && (updateRange.c1 <= obj.to.col)) {
									metrics.to.col += count;
								}
								else
									metrics = null;

								// Range
								if (obj.isChart()) {
									if (updateRange.c1 <= bbox.c1)
										changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 + count , bbox.r2 , bbox.c2 + count );

									else if (updateRange.c1 <= bbox.c2)
										changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , bbox.r2 , bbox.c2 + count );
								}
							}
							break;
						case c_oAscInsertOptions.InsertRows: 
							{

								// Position
								var count = updateRange.r2 - updateRange.r1 + 1;

								if (updateRange.r1 <= obj.from.row) {
									metrics.from.row += count;
									metrics.to.row += count;
								}
								else if ((updateRange.r1 > obj.from.row) && (updateRange.r1 <= obj.to.row)) {
									metrics.to.row += count;
								}
								else
									metrics = null;

								// Range
								if (obj.isChart()) {
									if (updateRange.r1 <= bbox.r1)
										changedRange = new Range(worksheet.model, bbox.r1 + count , bbox.c1 , bbox.r2 + count , bbox.c2 );

									else if (updateRange.r1 <= bbox.r2)
										changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , bbox.r2 + count , bbox.c2 );
								}
							}
							break;
					}
				}
				else {				// Delete
					switch (operType) {
						case c_oAscDeleteOptions.DeleteColumns: 
							{

								// Position
								var count = updateRange.c2 - updateRange.c1 + 1;

								if (updateRange.c1 <= obj.from.col) {

									// outside
									if (updateRange.c2 < obj.from.col) {
										metrics.from.col -= count;
										metrics.to.col -= count;
									}
									// inside
									else {
										metrics.from.col = updateRange.c1;
										metrics.from.colOff = 0;

										var offset = 0;
										if (obj.to.col - updateRange.c2 - 1 > 0)
											offset = obj.to.col - updateRange.c2 - 1;
										else {
											offset = 1;
											metrics.to.colOff = 0;
										}
										metrics.to.col = metrics.from.col + offset;
									}
								}

								else if ((updateRange.c1 > obj.from.col) && (updateRange.c1 <= obj.to.col)) {

									// outside
									if (updateRange.c2 >= obj.to.col) {
										metrics.to.col = updateRange.c1;
										metrics.to.colOff = 0;
									}
									else
										metrics.to.col -= count;
								}
								else
									metrics = null;

								// Range
								if (obj.isChart()) {
									var count = updateRange.c2 - updateRange.c1 + 1;

									if (updateRange.c1 < bbox.c1) {

										if (updateRange.c2 < bbox.c1)
											changedRange = new Range(worksheet.model, bbox.r1, bbox.c1 - count , bbox.r2 , bbox.c2 - count );
										else {

											// outside
											if (updateRange.c2 > bbox.c2)
												changedRange = new Range(worksheet.model, bbox.r1 , updateRange.c1 , bbox.r2 , updateRange.c1);

											// inside
											else {
												var offset = bbox.c2 - updateRange.c2;
												changedRange = new Range(worksheet.model, bbox.r1 , updateRange.c1 , bbox.r2 , updateRange.c1 + offset - 1);
											}
										}
									}

									else if ((updateRange.c1 >= bbox.c1) && (updateRange.c1 <= bbox.c2)) {

										// outside
										if (updateRange.c2 > bbox.c2) {
											var offset = (bbox.c1 + 1 > updateRange.c1) ? 1 : 0;
											changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , bbox.r2 , updateRange.c1 + offset - 1);
										}

										// inside
										else {
											var offset = bbox.c2 + 1 - bbox.c1 - count;
											if (offset <= 0)
												offset = 1;
											changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , bbox.r2 , bbox.c1 + offset - 1);
										}
									}
								}
							}
							break;

						case c_oAscDeleteOptions.DeleteRows: 
							{

								// Position
								var count = updateRange.r2 - updateRange.r1 + 1;

								if (updateRange.r1 <= obj.from.row) {

									// outside
									if (updateRange.r2 < obj.from.row) {
										metrics.from.row -= count;
										metrics.to.row -= count;
									}
									// inside
									else {
										metrics.from.row = updateRange.r1;
										metrics.from.colOff = 0;

										var offset = 0;
										if (obj.to.row - updateRange.r2 - 1 > 0)
											offset = obj.to.row - updateRange.r2 - 1;
										else {
											offset = 1;
											metrics.to.colOff = 0;
										}
										metrics.to.row = metrics.from.row + offset;
									}
								}

								else if ((updateRange.r1 > obj.from.row) && (updateRange.r1 <= obj.to.row)) {

									// outside
									if (updateRange.r2 >= obj.to.row) {
										metrics.to.row = updateRange.r1;
										metrics.to.colOff = 0;
									}
									else
										metrics.to.row -= count;
								}
								else
									metrics = null;

								// range
								if (obj.isChart()) {
									var count = updateRange.r2 - updateRange.r1 + 1;

									if (updateRange.r1 < bbox.r1) {

										if (updateRange.r2 < bbox.r1)
											changedRange = new Range(worksheet.model, bbox.r1 - count, bbox.c1 , bbox.r2 - count , bbox.c2 );
										else {

											// outside
											if (updateRange.r2 >= bbox.r2)
												changedRange = new Range(worksheet.model, updateRange.r1 , bbox.c1 , updateRange.r1 , bbox.c2);

											// inside
											else {
												var offset = bbox.r1 + 1 - updateRange.r2;
												changedRange = new Range(worksheet.model, updateRange.r1 , bbox.c1 , updateRange.r1 + offset, bbox.c2);
											}
										}
									}

									else if ((updateRange.r1 >= bbox.r1) && (updateRange.r1 <= bbox.r2)) {

										// outside
										if (updateRange.r2 > bbox.r2) {
											var offset = (bbox.r1 + 1 > updateRange.r1) ? 1 : 0;
											changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , updateRange.r1 + offset - 1, bbox.c2 );
										}

										// inside
										else {
											var offset = bbox.r2 + 1 - bbox.r1 - count;
											if (offset <= 0) offset = 1;
											changedRange = new Range(worksheet.model, bbox.r1 , bbox.c1 , bbox.r1 + offset - 1, bbox.c2 );
										}
									}
								}
							}
							break;
					}
				}

				// Normalize position
				if (metrics) {
					if (metrics.from.col < 0) {
						metrics.from.col = 0;
						metrics.from.colOff = 0;
					}

					if (metrics.to.col <= 0) {
						metrics.to.col = 1;
						metrics.to.colOff = 0;
					}

					if (metrics.from.row < 0) {
						metrics.from.row = 0;
						metrics.from.rowOff = 0;
					}

					if (metrics.to.row <= 0) {
						metrics.to.row = 1;
						metrics.to.rowOff = 0;
					}

					if (metrics.from.col == metrics.to.col) {
						metrics.to.col++;
						metrics.to.colOff = 0;
					}
					if (metrics.from.row == metrics.to.row) {
						metrics.to.row++;
						metrics.to.rowOff = 0;
					}
				}

				// Normalize range
				if (changedRange) {
					var bbox = changedRange.getBBox0();

					var tmp;
					if (bbox.c1 > bbox.c2) {
						tmp = bbox.c1;
						bbox.c1 = bbox.c2;
						bbox.c2 = tmp;
					}
					if (bbox.r1 > bbox.r2) {
						tmp = bbox.r1;
						bbox.r1 = bbox.r2;
						bbox.r2 = tmp;
					}
					changedRange = new Range(worksheet.model, bbox.r1, bbox.c1, bbox.r2, bbox.c2);
				}

				if (changedRange || metrics) {

					var copyObject = _this.cloneDrawingObject(obj);
					copyObject.flags.transactionState = c_oAscTransactionState.Start;
					History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Edit, worksheet.model.getId(), null, copyObject);

					if (changedRange) {
						obj.chart.range.intervalObject = changedRange;
						_this.calcChartInterval(obj.chart);
					}
					if (metrics) {
						obj.from.col = metrics.from.col;
						obj.from.colOff = metrics.from.colOff;
						obj.from.row = metrics.from.row;
						obj.from.rowOff = metrics.from.rowOff;

						obj.to.col = metrics.to.col;
						obj.to.colOff = metrics.to.colOff;
						obj.to.row = metrics.to.row;
						obj.to.rowOff = metrics.to.rowOff;
					}

					var copyObject = _this.cloneDrawingObject(obj);
					copyObject.flags.transactionState = c_oAscTransactionState.Stop;
					History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Edit, worksheet.model.getId(), null, copyObject);
				}

				History.EndTransaction();
			}
		}
	}
	
	_this.moveRangeDrawingObject = function(oBBoxFrom, oBBoxTo, bResize) {
		
		if ( oBBoxFrom && oBBoxTo ) {
						
			function editChart(chartObject) {
				var copyObject = _this.cloneDrawingObject(chartObject);
				
				copyObject.chart.range.intervalObject = worksheet._getRange(oBBoxTo.c1, oBBoxTo.r1, oBBoxTo.c2, oBBoxTo.r2);
				_this.calcChartInterval(copyObject.chart);
				copyObject.chart.rebuildSeries();
				
				_this.unselectDrawingObjects();
				chartObject.flags.selected = true;
				_this.editChartDrawingObject(copyObject.chart);
			}
			
			for (var i = 0; i < _this.countDrawingObjects(); i++) {
								
				var obj = aObjects[i];
				if (obj.isChart() ) {
					var bbox = obj.chart.range.intervalObject.getBBox0();
					if ( oBBoxFrom.isEqual(bbox) ) {
				
						if ( bResize == true ) {
							if ( obj.flags.selected == true ) {
								editChart(obj);
								return;
							}
						}
						else
							editChart(obj);
					}
				}
			}
		}
	}

	//-----------------------------------------------------------------------------------
	// Chart
	//-----------------------------------------------------------------------------------
	
	_this.checkChartInterval = function(type, subtype, interval, isRows) {
		var result = false;
		if (interval && worksheet) {
			var _range = convertFormula(interval, worksheet);
			if (_range && checkDataRange(type, subtype, _range, isRows, worksheet))
				result = true;
		}
		return result;
	}

	_this.calcChartInterval = function(chart) {
		if (chart.range.intervalObject) {
			var box = chart.range.intervalObject.getBBox0();
			var startCell = new CellAddress(box.r1, box.c1, 0);
			var endCell = new CellAddress(box.r2, box.c2, 0);

			if (startCell && endCell) {
				
				if (startCell.getID() == endCell.getID())
					chart.range.interval = startCell.getID();
				else {
					var wsName = chart.range.intervalObject.worksheet.sName;								
					if ( !rx_test_ws_name.test(wsName) )
						wsName = "'" + wsName + "'";
						
					chart.range.interval = wsName + "!" + startCell.getID() + ":" + endCell.getID();
				}
			}
		}
	}

	_this.intervalToIntervalObject = function(chart) {
		if (chart.range.interval && worksheet) {
			var _range = convertFormula(chart.range.interval, worksheet);
			if (_range)
				chart.range.intervalObject = _range;
		}
	}

	//-----------------------------------------------------------------------------------
	// Graphic object
	//-----------------------------------------------------------------------------------
	
	_this.addGraphicObject = function(graphic) {
		
		var obj = _this.createDrawingObject();
		obj.graphicObject = graphic;
        graphic.setDrawingBase(obj);
				
		obj.graphicObject.select(_this.controller);
		obj.setGraphicObjectCoords();
		aObjects.push(obj);
		_this.showDrawingObjects(false);
		worksheet.model.workbook.handlers.trigger("asc_onEndAddShape");
		_this.lockDrawingObject(obj.id, true, true);
	}
	
	_this.groupGraphicObjects = function() {
	
		if ( _this.controller.canGroup() ) {
			
			var obj = _this.createDrawingObject();
			var group = _this.controller.createGroup(obj);
			if ( group ) {
				obj.graphicObject = group;
				obj.setGraphicObjectCoords();
				aObjects.push(obj);
				_this.showDrawingObjects(false);
                _this.selectGraphicObject();
			}
		}
	}
	
	_this.unGroupGraphicObjects = function() {
	
		if ( _this.controller.canUnGroup() ) {
			_this.controller.unGroup();
			api.isStartAddShape = false;
		}
	}
	
	_this.insertUngroupedObjects = function(idGroup, aGraphics) {
		
		if ( idGroup && aGraphics.length ) {
			
			var aSingleObjects = [];
			for (var i = 0; i < aGraphics.length; i++) {
			
				var obj = _this.createDrawingObject();
				obj.graphicObject = aGraphics[i];
                aGraphics[i].setDrawingBase(obj);
				obj.graphicObject.select(_this.controller);
				obj.setGraphicObjectCoords();
				aSingleObjects.push(obj);
			}
			
			for (var i = 0; i < aObjects.length; i++) {
			
				if ( idGroup == aObjects[i].id ) {
					
					aObjects.splice(i, 1);
					
					for (var j = aSingleObjects.length - 1; j > -1; j--) {
						aObjects.splice(i, 0, aSingleObjects[j]);
					}					
					_this.showDrawingObjects(true);
					break;
				}
			}
		}
	}
	
	_this.deleteDrawingBase = function(graphicId) {
		
		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			if ( aObjects[i].graphicObject.Id == graphicId ) {
				aObjects.splice(i, 1);
				break;
			}
		}
	}
	
	_this.checkGraphicObjectPosition = function(x, y, w, h) {
	
		/*	Принцип:
			true - если перемещение в области или требуется увеличить лист вправо/вниз
			false - наезд на хидеры
		*/
		
		var response = { result: true, x: 0, y: 0 };
		
		var top = worksheet.getCellTop(0, 3) + pxToMm(1);
		var left = worksheet.getCellLeft(0, 3) + pxToMm(1);
		
		// выход за границу слева или сверху
		if ( y < top ) {
			response.result = false;
			response.y = top - y;
		}
		if ( x < left ) {
			response.result = false;
			response.x = left - x;
		}
		
		// выход за границу справа
		var foundCol = worksheet._findColUnderCursor(mmToPt(x + w), true);
		while ( foundCol == null ) {
			worksheet.expandColsOnScroll(true);
			worksheet._trigger("reinitializeScrollX");
			foundCol = worksheet._findColUnderCursor(mmToPt(x + w), true);
		}

		// выход за границу снизу
		var foundRow = worksheet._findRowUnderCursor(mmToPt(y + h), true);
		while ( foundRow == null ) {
			worksheet.expandRowsOnScroll(true);
			worksheet._trigger("reinitializeScrollY");
			foundRow = worksheet._findRowUnderCursor(mmToPt(y + h), true);
		}
		
		return response;
	}
	
	_this.selectGraphicObject = function() {
		if ( _this.drawingDocument ) {
			_this.controller.drawSelection(_this.drawingDocument);
			_this.drawWorksheetHeaders();
		}
	}
	
	_this.setScrollOffset = function(x_px, y_px) {
		
		if ( shapeCtx || shapeOverlayCtx ) {
		
			scrollOffset.x -= x_px;
			scrollOffset.y -= y_px;
			
			shapeCtx.m_oCoordTransform.tx -= x_px;
			shapeCtx.m_oCoordTransform.ty -= y_px;
			shapeCtx.CalculateFullTransform();
			
			shapeOverlayCtx.m_oCoordTransform.tx -= x_px;
			shapeOverlayCtx.m_oCoordTransform.ty -= y_px;
			shapeOverlayCtx.CalculateFullTransform();
			
			autoShapeTrack.Graphics.m_oCoordTransform.tx -= x_px;
			autoShapeTrack.Graphics.m_oCoordTransform.ty -= y_px;
			autoShapeTrack.Graphics.CalculateFullTransform();
		}
	}
	
	_this.convertMetric = function(val, from, to) {
		/* Параметры конвертирования (from/to)
			0 - px, 1 - pt, 2 - in, 3 - mm
		*/
		return val * ascCvtRatio(from, to);
	}
	
	_this.getSelectedGraphicObjects = function() {
		var selArray = [];
		for (var i = 0; i < aObjects.length; i++) {
			if ( aObjects[i].isGraphicObject() && aObjects[i].graphicObject.selected )
				selArray.push(aObjects[i]);
		}
		return selArray;
	}
	
	_this.getSelectedObjectsStack = function() {
	}
	
	_this.loadImageRedraw = function(imageUrl) {
		
		var _image = api.ImageLoader.LoadImage(imageUrl, 1);
				
		if (null != _image) {
			imageLoaded(_image);
		}
		else {
			_this.asyncImageEndLoaded = function(_image) {
				imageLoaded(_image);
			}
		}
		
		function imageLoaded(_image) {
			if ( !_image.Image ) {
				worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
			}
			else 
				_this.showDrawingObjects(true);
		}
	}
	
	_this.getOriginalImageSize = function() {
		
		var selectedObjects = _this.controller.selectedObjects;
		if ( (selectedObjects.length == 1) && selectedObjects[0].isImage() ) {
		
			var imageUrl = selectedObjects[0].getImageUrl();
			
			var _image = api.ImageLoader.map_image_index[getFullImageSrc(imageUrl)];
			if (_image != undefined && _image.Image != null && _image.Status == ImageLoadStatus.Complete) {
				
				var _w = 1, _h = 1;
				var bIsCorrect = false;
				if (_image.Image != null) {
				
					bIsCorrect = true;
					_w = Math.max( pxToMm(_image.Image.width), 1 );
					_h = Math.max( pxToMm(_image.Image.height), 1 );					
				}

				return new asc_CImageSize( _w, _h, bIsCorrect);
			}
		}
		return new asc_CImageSize( 50, 50, false );
	}
	
	_this.sendSelectionChanged = function() {
		if ( worksheet )
			worksheet._trigger("selectionChanged", worksheet.getSelectionInfo());
	}
	
	//-----------------------------------------------------------------------------------
	// Graphic object mouse events
	//-----------------------------------------------------------------------------------
	
	_this.graphicObjectMouseDown = function(e, x, y) {
		_this.controller.onMouseDown( e, pxToMm(x - scrollOffset.x), pxToMm(y - scrollOffset.y) );
	}
	
	_this.graphicObjectMouseMove = function(e, x, y) {
		_this.controller.onMouseMove( e, pxToMm(x - scrollOffset.x), pxToMm(y - scrollOffset.y) );
	}
	
	_this.graphicObjectMouseUp = function(e, x, y) {
		_this.controller.onMouseUp( e, pxToMm(x - scrollOffset.x), pxToMm(y - scrollOffset.y) );
	}
	
	//-----------------------------------------------------------------------------------
	// Asc
	//-----------------------------------------------------------------------------------
	
	_this.cleanWorksheet = function() {
		aObjects = [];
		worksheet._clean();			
		var listRange = new Range(worksheet.model, 0, 0, worksheet.nRowsCount - 1, worksheet.nColsCount - 1);
		listRange.cleanAll();
		History.Clear();
	}

	_this.getWordChartObject = function() {
		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			var obj = aObjects[i];
			if (obj.isChart() && obj.chart.bChartEditor) {				
				
				var chart = new CChartData(false);
				chart.readFromDrawingObject(obj);
				chart = chart.serializeChart();				
				_this.cleanWorksheet();
				return chart;
			}
		}
		return null;
	}

	_this.getAscChartObject = function() {		// Return new or existing chart. For image return null
		var index = _this.getSelectedDrawingObjectIndex();
		if (index >= 0) {
			if (aObjects[index].isChart())
				return new asc.asc_CChart(aObjects[index].chart);
			else null;
		}
		else {
			// Check iframe chart editor
			for (var i = 0; i < _this.countDrawingObjects(); i++) {
				if ( aObjects[i].isChart() && aObjects[i].chart.bChartEditor )
					return new asc.asc_CChart(aObjects[i].chart);
			}
		
			// New chart object
			var chart = new asc.asc_CChart(_this.createDrawingObject().chart);
			return chart;
		}
	}
	
	//-----------------------------------------------------------------------------------
	// Selection
	//-----------------------------------------------------------------------------------

	_this.selectDrawingObject = function(index, lockState, bWithoutRange) {

		// locked - флаг для совместного редактирования
		var bResult = false;

		if (_this.checkDrawingObjectIndex(index)) {

			var obj = aObjects[index];
			if (!obj.canDraw())
				return bResult;
				
			if ( obj.isGraphicObject() ) {
				_this.selectGraphicObject();
				return;
			}

			if ( !lockState ) {
				obj.flags.selected = true;
			}
			
			if ( obj.flags.selected && !bWithoutRange )
				_this.selectDrawingObjectRange(index);

			var r = 4;
			var d = 8;
			var lineWidth = 1;
			var extraSelectOffset = 8;
			var top, left;

			var commonColor = "#4D7399";
			var fillColor = "#CAEAED";
			var extraColor = "";

			var topArea = worksheet.getCellTop(0, 0);
			var leftArea = worksheet.getCellLeft(0, 0);

			var realWidth = obj.getWidthFromTo();
			var realHeight = obj.getHeightFromTo();
			var visibleWidth = obj.getVisibleWidth();
			var visibleHeight = obj.getVisibleHeight();

			var visibleLeftOffset = obj.getVisibleLeftOffset(true);
			var visibleTopOffset = obj.getVisibleTopOffset(true);

			if ((visibleWidth <= 2) || (visibleHeight <= 2))
				return true;

			// common rect
			overlayCtx.setLineWidth(lineWidth);
			overlayCtx.setStrokeStyle(commonColor);

			if (lockState) {
				switch (lockState) {
					case c_oAscObjectLockState.On:
						extraColor = c_oAscCoAuthoringOtherBorderColor;
						break;

					case c_oAscObjectLockState.Off:
						extraColor = c_oAscCoAuthoringMeBorderColor;
						break;

					default:
						return true;
				}
			}

			// top line
			if (obj.getVisibleTopOffset(false)) {

				if (!lockState) {
					left = pxToPt(visibleLeftOffset - lineWidth);
					top = pxToPt(visibleTopOffset);

					overlayCtx.beginPath();
					overlayCtx.moveTo(left, top, 0, -.5);
					overlayCtx.lineTo(left + pxToPt(visibleWidth + lineWidth * 2), top, 0, -.5);
					overlayCtx.stroke();
				}
				// extra
				else {
					if (obj.getVisibleTopOffset(false) - extraSelectOffset > 0) {
						var extraCoeff = 1;
						if (visibleLeftOffset - lineWidth - extraSelectOffset > leftArea) {
							left = pxToPt(visibleLeftOffset - lineWidth - extraSelectOffset);
							extraCoeff = 2;
						}
						else
							left = pxToPt(leftArea);

						top = pxToPt(visibleTopOffset - extraSelectOffset);

						overlayCtx.beginPath();
						overlayCtx.setStrokeStyle(extraColor);
						overlayCtx.dashLine(left, top, left + pxToPt(visibleWidth + lineWidth * extraCoeff + extraSelectOffset * extraCoeff), top, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
						overlayCtx.stroke();
					}
				}
			}

			// bottom line
			if (!lockState) {
				overlayCtx.setStrokeStyle(commonColor);
				left = pxToPt(visibleLeftOffset - lineWidth);
				top = pxToPt(visibleTopOffset + visibleHeight);

				overlayCtx.beginPath();
				overlayCtx.moveTo(left, top, 0, .5);
				overlayCtx.lineTo(left + pxToPt(visibleWidth + lineWidth * 2), top, 0, .5);
				overlayCtx.stroke();
			}
			else {
				overlayCtx.setStrokeStyle(extraColor);
				var extraCoeff = 1;
				if (visibleLeftOffset - lineWidth - extraSelectOffset > leftArea) {
					left = pxToPt(visibleLeftOffset - lineWidth - extraSelectOffset);
					extraCoeff = 2;
				}
				else
					left = pxToPt(leftArea);

				top = pxToPt(visibleTopOffset + visibleHeight + extraSelectOffset);

				overlayCtx.beginPath();
				overlayCtx.dashLine(left, top, left + pxToPt(visibleWidth + lineWidth * extraCoeff + extraSelectOffset * extraCoeff), top, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
				overlayCtx.stroke();
			}

			// left line
			overlayCtx.setStrokeStyle(commonColor);
			if (obj.getVisibleLeftOffset(false)) {

				if (!lockState) {
					left = pxToPt(visibleLeftOffset);
					top = pxToPt(visibleTopOffset);

					overlayCtx.beginPath();
					overlayCtx.moveTo(left, top, -.5, 0);
					overlayCtx.lineTo(left, top + pxToPt(visibleHeight), -.5, 0);
					overlayCtx.stroke();
				}
				else {
					if (obj.getVisibleLeftOffset(false) - extraSelectOffset > 0) {
						left = pxToPt(visibleLeftOffset - extraSelectOffset);

						var extraCoeff = 1;
						if (visibleTopOffset - extraSelectOffset > topArea) {
							top = pxToPt(visibleTopOffset - extraSelectOffset);
							extraCoeff = 2;
						}
						else
							top = pxToPt(topArea);

						overlayCtx.beginPath();
						overlayCtx.setStrokeStyle(extraColor);
						overlayCtx.dashLine(left, top, left, top + pxToPt(visibleHeight + extraSelectOffset * extraCoeff), c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
						overlayCtx.stroke();
					}
				}
			}

			// right line
			if (!lockState) {
				overlayCtx.setStrokeStyle(commonColor);
				left = pxToPt(visibleLeftOffset + visibleWidth);
				top = pxToPt(visibleTopOffset);

				overlayCtx.beginPath();
				overlayCtx.moveTo(left, top, .5, 0);
				overlayCtx.lineTo(left, top + pxToPt(visibleHeight), .5, 0);
				overlayCtx.stroke();
			}
			else {
				overlayCtx.setStrokeStyle(extraColor);
				left = pxToPt(visibleLeftOffset + visibleWidth + extraSelectOffset);

				var extraCoeff = 1;
				if (visibleTopOffset - extraSelectOffset > topArea) {
					top = pxToPt(visibleTopOffset - extraSelectOffset);
					extraCoeff = 2;
				}
				else
					top = pxToPt(topArea);

				overlayCtx.beginPath();
				overlayCtx.dashLine(left, top, left, top + pxToPt(visibleHeight + extraSelectOffset * extraCoeff), c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);
				overlayCtx.stroke();
			}


			// Rects
			if (!lockState) {
				overlayCtx.beginPath();

				// top rect
				if (obj.getVisibleTopOffset(false)) {
					left = obj.getVisibleLeftOffset(false) ? pxToPt(visibleLeftOffset + visibleWidth / 2 - d / 2) : pxToPt(visibleWidth - realWidth / 2 - d / 2);
					top = pxToPt(visibleTopOffset - d / 2 - 1);
					if (leftArea < left)
						overlayCtx.rect(left, top, pxToPt(d), pxToPt(d), .5, .5);
				}

				// right rect
				left = pxToPt(visibleLeftOffset + visibleWidth - d / 2 + 1);
				top = obj.getVisibleTopOffset(false) ? pxToPt(visibleTopOffset + visibleHeight / 2 - d / 2) : pxToPt(visibleHeight - realHeight / 2 - d / 2);
				if (topArea < top)
					overlayCtx.rect(left, top, pxToPt(d), pxToPt(d), .5, .5);

				// bottom rect
				left = obj.getVisibleLeftOffset(false) ? pxToPt(visibleLeftOffset + visibleWidth / 2 - d / 2) : pxToPt(visibleWidth - realWidth / 2 - d / 2);
				top = pxToPt(visibleTopOffset + visibleHeight - d / 2 + 1);
				if (leftArea < left)
					overlayCtx.rect(left, top, pxToPt(d), pxToPt(d), .5, .5);

				// left rect
				if (obj.getVisibleLeftOffset(false)) {
					left = pxToPt(visibleLeftOffset - d / 2 - 1);
					top = obj.getVisibleTopOffset(false) ? pxToPt(visibleTopOffset + visibleHeight / 2 - d / 2) : pxToPt(visibleHeight - realHeight / 2 - d / 2);
					if (topArea < top)
						overlayCtx.rect(left, top, pxToPt(d), pxToPt(d), .5, .5);
				}

				//Arcs

				// top left
				if (obj.getVisibleTopOffset(false) && obj.getVisibleLeftOffset(false)) {
					overlayCtx.moveTo(pxToPt(visibleLeftOffset + r - 1), pxToPt(visibleTopOffset - 1));
					overlayCtx.arc(pxToPt(visibleLeftOffset - 1), pxToPt(visibleTopOffset - 1), r, 0, Math.PI * 2, false, .5, .5);
				}

				// top right
				if (obj.getVisibleTopOffset(false)) {
					overlayCtx.moveTo(pxToPt(visibleLeftOffset + visibleWidth + r), pxToPt(visibleTopOffset - 1));
					overlayCtx.arc(pxToPt(visibleLeftOffset + visibleWidth), pxToPt(visibleTopOffset - 1), r, 0, Math.PI * 2, false, .5, .5);
				}

				// bottom left
				if (obj.getVisibleLeftOffset(false)) {
					overlayCtx.moveTo(pxToPt(visibleLeftOffset + r - 1), pxToPt(visibleTopOffset + visibleHeight));
					overlayCtx.arc(pxToPt(visibleLeftOffset - 1), pxToPt(visibleTopOffset + visibleHeight), r, 0, Math.PI * 2, false, .5, .5);
				}

				// bottom right
				overlayCtx.moveTo(pxToPt(visibleLeftOffset + visibleWidth + r), pxToPt(visibleTopOffset + visibleHeight));
				overlayCtx.arc(pxToPt(visibleLeftOffset + visibleWidth), pxToPt(visibleTopOffset + visibleHeight), r, 0, Math.PI * 2, false, .5, .5);

				overlayCtx.setLineWidth(lineWidth);
				overlayCtx.setStrokeStyle(commonColor);
				overlayCtx.setFillStyle(fillColor);
				overlayCtx.fill();
				overlayCtx.stroke();
			}

			worksheet._drawCollaborativeElements();
			bResult = true;
		}
		return bResult;
	}

	_this.selectDrawingObjectEx = function(index, bNext) {

		if (_this.checkDrawingObjectIndex(index)) {
			var toIndex = index;
			_this.unselectDrawingObjects();

			if (bNext) {
				if (index + 1 < _this.countDrawingObjects())
					_this.selectDrawingObject(index + 1);
				else
					_this.selectDrawingObject(0);
			}
			else {
				if ((index - 1 >= 0) && (index - 1 < _this.countDrawingObjects()))
					_this.selectDrawingObject(index - 1);
				else
					_this.selectDrawingObject(_this.countDrawingObjects() - 1);
			}
		}
	}

	_this.selectDrawingObjectRange = function(index) {

		worksheet.arrActiveChartsRanges = [];
	
		if (_this.checkDrawingObjectIndex(index)) {

			var obj = aObjects[index];
			if (obj.canDraw() && obj.isChart()) {

				if ( !obj.chart.range.intervalObject )
					_this.intervalToIntervalObject(obj.chart);
				
				// Проверка для id листа				
				if (obj.chart.range.intervalObject.worksheet.Id != worksheet.model.Id)
					return;
					
				var BB = obj.chart.range.intervalObject.getBBox0(),
					range = asc.Range(BB.c1,BB.r1,BB.c2,BB.r2,true);
					
				worksheet.arrActiveChartsRanges.push(range);
				worksheet.isChartAreaEditMode = true;
				
				worksheet.overlayCtx.save()
						.beginPath()
						.rect(worksheet.cellsLeft, worksheet.cellsTop, worksheet.overlayCtx.getWidth() - worksheet.cellsLeft, worksheet.overlayCtx.getHeight() - worksheet.cellsTop)
						.clip();
				worksheet.overlayCtx.clear();
				worksheet._drawFormulaRange(worksheet.arrActiveChartsRanges)
				worksheet.overlayCtx.restore();
				
				// слой c объектами должен быть выше селекта
				_this.raiseLayerDrawingObjects(false);
			}
		}
	}

	_this.unselectDrawingObjects = function() {
	
		if ( worksheet.isChartAreaEditMode ) {
			worksheet.isChartAreaEditMode = false;
			worksheet.arrActiveChartsRanges = [];
		}
		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			aObjects[i].flags.selected = false;
		}
		if (overlayCtx)
			overlayCtx.clear();
	}

	_this.getDrawingObject = function(id) {

		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			if (aObjects[i].id == id)
				return aObjects[i];
		}
		return null;
	}
	
	_this.inSelectionDrawingObjectIndex = function(x, y, useEps) {

		/* Алгоритм поиска объекта
		* Если есть заселекченный объект, то возвращаем его, иначе c наибольшим слоем
		*/

		var list = [];
		var index = -1;
		var selectedIndex = -1;

		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			var obj = aObjects[i];

			//var offset = useEps ? 6 : 0;
			var offset = obj.flags.selected ? 6 : 0;
			var leftOffset = obj.getVisibleLeftOffset(true);
			var topOffset = obj.getVisibleTopOffset(true);

			var visibleWidth = obj.getVisibleWidth();
			var visibleHeight = obj.getVisibleHeight();

			if ((x + offset >= leftOffset) && (x - offset <= leftOffset + visibleWidth) &&
				 (y + offset >= topOffset) && (y - offset <= topOffset + visibleHeight)) {
				if (obj.flags.selected)
					selectedIndex = i;
				list.push(i);
			}
		}

		index = Math.max.apply(Math, list); 	// max layer

		if (selectedIndex >= 0) {
			if (selectedIndex == index)
				return index;
			if (objectInsideObject(index, selectedIndex))
				return index;
			else
				return selectedIndex;
		}

		function objectInsideObject(firstIndex, secondIndex) {

			var result = false;
			if (_this.checkDrawingObjectIndex(firstIndex) && _this.checkDrawingObjectIndex(secondIndex)) {

				var rtFirst = aObjects[firstIndex].getRealTopOffset();
				var rlFirst = aObjects[firstIndex].getRealLeftOffset();
				var wFirst = aObjects[firstIndex].getWidthFromTo();
				var hFirst = aObjects[firstIndex].getHeightFromTo();

				var rtSecond = aObjects[secondIndex].getRealTopOffset();
				var rlSecond = aObjects[secondIndex].getRealLeftOffset();
				var wSecond = aObjects[secondIndex].getWidthFromTo();
				var hSecond = aObjects[secondIndex].getHeightFromTo();

				if ((rtFirst > rtSecond) && (rlFirst > rlSecond) && (rlFirst + wFirst < rlSecond + wSecond) && (rtFirst + hFirst < rtSecond + hSecond))
					result = true;
			}
			return result;
		}

		return index;
	}

	_this.getSelectedDrawingObjectIndex = function() {

		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			if (aObjects[i].flags.selected || (aObjects[i].graphicObject && aObjects[i].graphicObject.selected) )
				return i;
		}
		return -1;
	}
	
	_this.getGraphicSelectionType = function(index) {
				
		if (_this.checkDrawingObjectIndex(index)) {
			var obj = aObjects[index];
			
			if (obj.isChart())
				return c_oAscSelectionType.RangeChart;
				
			if (obj.graphicObject.isImage())
				return c_oAscSelectionType.RangeImage;
				
			if (obj.graphicObject.isShape() || obj.graphicObject.isGroup())
				return c_oAscSelectionType.RangeShape;
		}
		return undefined;
	}
	
	_this.getDrawingObjectByCoords = function(x, y) {
		var index = _this.inSelectionDrawingObjectIndex(x, y, false);
		if ( index >= 0 )
			return aObjects[index];
		else
			return null;
	}

	//-----------------------------------------------------------------------------------
	// Multiple editing
	//-----------------------------------------------------------------------------------
	
	_this.lockDrawingObject = function(id, bStart, bEnd, callbackFunc) {
	
		var sheetId = worksheet.model.getId();
		var callbackFunc = callbackFunc ? callbackFunc : function(res) {
			if (res)
				worksheet._drawCollaborativeElements(true);
		}
		
		if (false === worksheet.collaborativeEditing.isCoAuthoringExcellEnable()) {
			// Запрещено совместное редактирование
			callbackFunc(true);
			return;
		}
		
		if ( bStart )
			worksheet.collaborativeEditing.onStartCheckLock();
			
		var lockInfo = worksheet.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, /*subType*/null, sheetId, id);

		if (worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine)) {
			// Редактируем сами
			callbackFunc(true);
			return;
		}
		else if (worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther)) {
			// Уже ячейку кто-то редактирует
			callbackFunc(false);
			return;
		}

		worksheet.collaborativeEditing.addCheckLock(lockInfo);		
		if ( bEnd ) {
			worksheet.collaborativeEditing.onEndCheckLock(callbackFunc);
		}
	}
	
	_this.isLockedDrawingObject = function(id, callbackFunc) {
	
		var sheetId = worksheet.model.getId();
		
		if (false === worksheet.collaborativeEditing.isCoAuthoringExcellEnable()) {
			// Запрещено совместное редактирование
			callbackFunc(true);
			return;
		}
				
		worksheet.collaborativeEditing.onStartCheckLock();
		var lockInfo = worksheet.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, /*subType*/null, sheetId, id);

		if (worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine)) {
			// Редактируем сами
			callbackFunc(true);
			return;
		}
		else if (worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther)) {
			// Уже ячейку кто-то редактирует
			callbackFunc(false);
			return;
		}
		else {
			// Редактируем сами
			callbackFunc(true);
		}
	}

	_this.isChangedDrawingObject = function(id) {
	
		var obj = null;
		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			if ( aObjects[i].id == id ) {
				obj = aObjects[i];
				break;
			}
		}
	
		if ( undoRedoObject && obj && (undoRedoObject.id == obj.id) && ( (undoRedoObject.getRealTopOffset() != obj.getRealTopOffset()) || 
																		(undoRedoObject.getRealLeftOffset() != obj.getRealLeftOffset()) ||
																		(undoRedoObject.getWidthFromTo() != obj.getWidthFromTo()) ||
																		(undoRedoObject.getHeightFromTo() != obj.getHeightFromTo()) ) )
			return true;
		else
			return false;
	}

	_this.getSelectedDrawingObjectId = function() {

		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			if (aObjects[i].flags.selected || (aObjects[i].graphicObject && aObjects[i].graphicObject.selected) )
				return aObjects[i].id;
		}
		return null;
	}

	_this.restoreLockedDrawingObject = function() {
		// для восстановления первоначального состояния объекта при совместном редактировании

		var result = false;
		var index = _this.getSelectedDrawingObjectIndex();
		if ((index >= 0) && undoRedoObject) {
			_this.deleteDrawingObject(undoRedoObject);
			_this.addDrawingObject(undoRedoObject);
			aObjects[aObjects.length - 1].flags.selected = true;
			
			overlayCtx.clear();
			worksheet._drawCollaborativeElements();
			undoRedoObject = null;
			result = true;
		}
		return result;
	}

	_this.selectLockedDrawingObject = function(id, lockState) {

		var result = false;

		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			if (aObjects[i].id === id) {
				aObjects[i].flags.lockState = lockState;
				_this.selectDrawingObject(i, lockState, true);
				result = true;
			}
		}		

		return result;
	}

	_this.resetLockedDrawingObject = function(id) {

		var result = false;
		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			if (aObjects[i].id === id) {
				aObjects[i].flags.lockState = c_oAscObjectLockState.No;
				result = true;
			}
		}
		return result;
	}

	_this.resetLockedDrawingObjects = function() {

		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			aObjects[i].flags.lockState = c_oAscObjectLockState.No;
		}
	}

	_this.showDrawingObjectsLocks = function() {

		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			if (aObjects[i].flags.lockState != c_oAscObjectLockState.No)
				_this.selectLockedDrawingObject(aObjects[i].id, aObjects[i].flags.lockState);
		}
	}

	//-----------------------------------------------------------------------------------
	// Position
	//-----------------------------------------------------------------------------------

	_this.setSelectedDrawingObjectLayer = function(layerType) {

		var index = _this.getSelectedDrawingObjectIndex();
		if (index >= 0) {
		
			var undoRedoLayer = new DrawingLayer();
			for (var i = 0; i < _this.countDrawingObjects(); i++) {
				undoRedoLayer.aLayerBefore[i] = aObjects[i].id;
			}

			switch (layerType) {
				case c_oAscDrawingLayerType.BringToFront: 
					{
						var removedObj = aObjects.splice(index, 1);
						aObjects.push(removedObj[0]);
					}
					break;
				case c_oAscDrawingLayerType.SendToBack: 
					{
						var removedObj = aObjects.splice(index, 1);
						aObjects.unshift(removedObj[0]);
					}
					break;
				case c_oAscDrawingLayerType.BringForward: 
					{
						if (_this.checkDrawingObjectIndex(index + 1)) {
							var removedObj = aObjects.splice(index, 1);
							aObjects.splice(index + 1, 0, removedObj[0]);
						}
					}
					break;
				case c_oAscDrawingLayerType.SendBackward: 
					{
						if (_this.checkDrawingObjectIndex(index - 1)) {
							var removedObj = aObjects.splice(index, 1);
							aObjects.splice(index - 1, 0, removedObj[0]);
						}
					}
					break;
			}
			
			for (var i = 0; i < _this.countDrawingObjects(); i++) {
				undoRedoLayer.aLayerAfter[i] = aObjects[i].id;
			}
			
			History.Create_NewPoint();
			History.Add(g_oUndoRedoDrawingLayer, historyitem_DrawingLayer, worksheet.model.getId(), null, undoRedoLayer);
			
			_this.showDrawingObjects(true);
		}
	}

	_this.saveSizeDrawingObjects = function() {

		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			var obj = aObjects[i];

			obj.size.width = obj.getWidthFromTo();
			obj.size.height = obj.getHeightFromTo();
		}
	}

	_this.updateSizeDrawingObjects = function() {

		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			var obj = aObjects[i];

			var left = obj.getRealLeftOffset();
			var top = obj.getRealTopOffset();

			var foundCol = worksheet._findColUnderCursor(pxToPt(left + obj.size.width), true);
			while (foundCol == null) {
				worksheet.expandColsOnScroll(true);
				worksheet._trigger("reinitializeScrollX");
				foundCol = worksheet._findColUnderCursor(pxToPt(left + obj.size.width), true);
			}
			obj.to.col = foundCol.col;
			obj.to.colOff = pxToMm(left + obj.size.width - worksheet.getCellLeft(obj.to.col, 0));

			var foundRow = worksheet._findRowUnderCursor(pxToPt(top + obj.size.height), true);
			while (foundRow == null) {
				worksheet.expandRowsOnScroll(true);
				worksheet._trigger("reinitializeScrollY");
				foundRow = worksheet._findRowUnderCursor(pxToPt(top + obj.size.height), true);
			}
			obj.to.row = foundRow.row;
			obj.to.rowOff = pxToMm(top + obj.size.height - worksheet.getCellTop(obj.to.row, 0));
		}
	}

	_this.checkCursorDrawingObject = function(x, y) {
	
		if ( !aObjects.length )
			return null;

		var index = _this.inSelectionDrawingObjectIndex(x, y, true);
		var objectInfo = { cursor: null, data: null, isGraphicObject: false };
		var graphicObjectInfo = _this.controller.isPointInDrawingObjects( pxToMm(x - scrollOffset.x), pxToMm(y - scrollOffset.y) );
		
		if ( graphicObjectInfo ) {
			objectInfo.data = graphicObjectInfo.objectId;
			objectInfo.cursor = graphicObjectInfo.cursorType;
			objectInfo.isGraphicObject = true;
			return objectInfo;
		}

		if (index >= 0) {
			var eps = 6;
			var top, left;
			var obj = aObjects[index];
			objectInfo.data = obj;

			index = _this.inSelectionDrawingObjectIndex(x, y);
			if ( !obj.flags.selected ) {
				if (index >= 0) {
					objectInfo.cursor = "move";
					return objectInfo;
				}
				else {
					objectInfo.cursor = null;
					return objectInfo;
				}
			}

			var visibleLeftOffset = obj.getVisibleLeftOffset(true);
			var visibleTopOffset = obj.getVisibleTopOffset(true);

			var realWidth = obj.getWidthFromTo();
			var realHeight = obj.getHeightFromTo();

			var visibleWidth = obj.getVisibleWidth();
			var visibleHeight = obj.getVisibleHeight();

			// top
			left = obj.getVisibleLeftOffset(false) ? visibleLeftOffset + visibleWidth / 2 : visibleWidth - realWidth / 2;
			if ((visibleTopOffset - eps <= y) && (left - eps <= x) &&
				 (visibleTopOffset + eps >= y) && (left + eps >= x)) {
				objectInfo.cursor = "n-resize";
				return objectInfo;
			}

			// left
			top = obj.getVisibleTopOffset(false) ? visibleTopOffset + visibleHeight / 2 : visibleHeight - realHeight / 2;
			if ((top - eps <= y) && (visibleLeftOffset - eps <= x) &&
				 (top + eps >= y) && (visibleLeftOffset + eps >= x)) {
				objectInfo.cursor = "w-resize";
				return objectInfo;
			}
			// bottom
			left = obj.getVisibleLeftOffset(false) ? visibleLeftOffset + visibleWidth / 2 : visibleWidth - realWidth / 2;
			if ((visibleTopOffset + visibleHeight - eps <= y) && (left - eps <= x) &&
				 (visibleTopOffset + visibleHeight + eps >= y) && (left + eps >= x)) {
				objectInfo.cursor = "s-resize";
				return objectInfo;
			}
			// right
			top = obj.getVisibleTopOffset(false) ? visibleTopOffset + visibleHeight / 2 : visibleHeight - realHeight / 2;
			if ((top - eps <= y) && (visibleLeftOffset + visibleWidth - eps <= x) &&
				 (top + eps >= y) && (visibleLeftOffset + visibleWidth + eps >= x)) {
				objectInfo.cursor = "e-resize";
				return objectInfo;
			}

			// left-top
			if ((visibleTopOffset - eps <= y) && (visibleLeftOffset - eps <= x) &&
				 (visibleTopOffset + eps >= y) && (visibleLeftOffset + eps >= x)) {
				objectInfo.cursor = "nw-resize";
				return objectInfo;
			}
			// left-bottom
			if ((visibleTopOffset + visibleHeight - eps <= y) && (visibleLeftOffset - eps <= x) &&
				 (visibleTopOffset + visibleHeight + eps >= y) && (visibleLeftOffset + eps >= x)) {
				objectInfo.cursor = "sw-resize";
				return objectInfo;
			}
			// right-bottom
			if ((visibleTopOffset + visibleHeight - eps <= y) && (visibleLeftOffset + visibleWidth - eps <= x) &&
				 (visibleTopOffset + visibleHeight + eps >= y) && (visibleLeftOffset + visibleWidth + eps >= x)) {
				objectInfo.cursor = "se-resize";
				return objectInfo;
			}
			// right-top
			if ((visibleTopOffset - eps <= y) && (visibleLeftOffset + visibleWidth - eps <= x) &&
				 (visibleTopOffset + eps >= y) && (visibleLeftOffset + visibleWidth + eps >= x)) {
				objectInfo.cursor = "ne-resize";
				return objectInfo;
			}

			if (index >= 0) {
				objectInfo.cursor = "move";
				return objectInfo;
			}
			else {
				objectInfo.cursor = null;
				return objectInfo;
			}
		}
		return null;
	}

	_this.setStartPointDrawingObject = function(index, x, y) {

		if (_this.checkDrawingObjectIndex(index) && !isViewerMode()) {
			var obj = aObjects[index];

			obj.move.x = x;
			obj.move.y = y;

			var drawingInfo = _this.checkCursorDrawingObject(x, y);
			obj.flags.currentCursor = drawingInfo ? drawingInfo.cursor : null;
		}
	}

	_this.getPositionInfo = function(x, y) {

		var info = { col: 0, colOff: 0, row: 0, rowOff: 0 };

		var tmp = worksheet._findColUnderCursor(pxToPt(x), true);
		if (tmp) {
			info.col = tmp.col;
			info.colOff = pxToMm(x - worksheet.getCellLeft(info.col, 0));
		}
		tmp = worksheet._findRowUnderCursor(pxToPt(y), true);
		if (tmp) {
			info.row = tmp.row;
			info.rowOff = pxToMm(y - worksheet.getCellTop(info.row, 0));
		}

		return info;
	}

	_this.moveDrawingObject = function(index, x, y) {

		if (_this.checkDrawingObjectIndex(index) && !isViewerMode()) {

			var obj = aObjects[index];
			obj.move.inAction = true;
			var realTopOffset = obj.getRealTopOffset();
			var realLeftOffset = obj.getRealLeftOffset();

			var widthFromTo = obj.getWidthFromTo();
			var heightFromTo = obj.getHeightFromTo();

			if ((widthFromTo == 0) || (heightFromTo == 0)) {
				widthFromTo -= 0.9;
				heightFromTo -= 0.9 * obj.size.coeff;
			}

			// зеркальное отображение
			if ((widthFromTo < 0) || (heightFromTo < 0)) {

				switch (obj.flags.currentCursor) {

					case "w-resize":
						obj.flags.currentCursor = "e-resize";

						realLeftOffset += widthFromTo;
						widthFromTo = Math.abs(widthFromTo);
						break;
					case "e-resize":
						obj.flags.currentCursor = "w-resize";

						realLeftOffset += widthFromTo;
						widthFromTo = Math.abs(widthFromTo);
						break;
					case "n-resize":
						obj.flags.currentCursor = "s-resize";

						realTopOffset += heightFromTo;
						heightFromTo = Math.abs(heightFromTo);
						break;
					case "s-resize":
						obj.flags.currentCursor = "n-resize";

						realTopOffset += heightFromTo;
						heightFromTo = Math.abs(heightFromTo);
						break;

					case "ne-resize": // сверху справа
						obj.flags.currentCursor = "sw-resize";

						realTopOffset += heightFromTo;
						realLeftOffset += widthFromTo;
						heightFromTo = Math.abs(heightFromTo);
						widthFromTo = Math.abs(widthFromTo);

						break;
					case "nw-resize": // сверху слева
						obj.flags.currentCursor = "se-resize";

						realTopOffset += heightFromTo;
						realLeftOffset += widthFromTo;
						heightFromTo = Math.abs(heightFromTo);
						widthFromTo = Math.abs(widthFromTo);
						break;
					case "sw-resize": // снизу слева
						obj.flags.currentCursor = "ne-resize";

						realTopOffset += heightFromTo;
						realLeftOffset += widthFromTo;
						heightFromTo = Math.abs(heightFromTo);
						widthFromTo = Math.abs(widthFromTo);
						break;
					case "se-resize": // снизу справа
						obj.flags.currentCursor = "nw-resize";

						realTopOffset += heightFromTo;
						realLeftOffset += widthFromTo;
						heightFromTo = Math.abs(heightFromTo);
						widthFromTo = Math.abs(widthFromTo);
						break;
				}				
			}

			var xMove = x - obj.move.x;
			var yMove = y - obj.move.y;

			// определяем перемещение или ресайз
			switch (obj.flags.currentCursor) {
				case "e-resize":
					widthFromTo += xMove;
					break;
				case "w-resize":
					realLeftOffset += xMove;
					widthFromTo -= xMove;
					break;
				case "s-resize":
					heightFromTo += yMove;
					break;
				case "n-resize":
					realTopOffset += yMove;
					heightFromTo -= yMove;
					break;

				case "se-resize":
					widthFromTo += xMove;
					heightFromTo += xMove * obj.size.coeff;
					break;
				case "ne-resize":
					widthFromTo += xMove;
					heightFromTo += xMove * obj.size.coeff;
					realTopOffset -= xMove * obj.size.coeff;
					break;
				case "nw-resize":
					realTopOffset += xMove * obj.size.coeff;
					realLeftOffset += xMove;
					widthFromTo -= xMove;
					heightFromTo -= xMove * obj.size.coeff;
					break;
				case "sw-resize":
					realLeftOffset += xMove;
					widthFromTo -= xMove;
					heightFromTo -= xMove * obj.size.coeff;
					break;

				//default: 
				case "move":
					realTopOffset = realTopOffset + yMove;
					realLeftOffset = realLeftOffset + xMove;
					break;
			}

			// выход за границу слева
			if ( realLeftOffset <= worksheet.getCellLeft(0, 0) )
				realLeftOffset = worksheet.getCellLeft(0, 0);

			// выход за границу справа
			var foundCol = worksheet._findColUnderCursor(pxToPt(realLeftOffset + widthFromTo), true);
			while ( foundCol == null ) {
				worksheet.expandColsOnScroll(true);
				worksheet._trigger("reinitializeScrollX");
				foundCol = worksheet._findColUnderCursor(pxToPt(realLeftOffset + widthFromTo), true);
			}
			obj.move.x = x;

			// выход за границу сверху
			if (realTopOffset <= worksheet.getCellTop(0, 0))
				realTopOffset = worksheet.getCellTop(0, 0);

			// выход за границу снизу
			if ( heightFromTo < 0 )
				heightFromTo = 0;
			var foundRow = worksheet._findRowUnderCursor(pxToPt(realTopOffset + heightFromTo), true);
			while ( foundRow == null ) {
				worksheet.expandRowsOnScroll(true);
				worksheet._trigger("reinitializeScrollY");
				foundRow = worksheet._findRowUnderCursor(pxToPt(realTopOffset + heightFromTo), true);
			}
			obj.move.y = y;

			var firstCol = worksheet._findColUnderCursor(pxToPt(realLeftOffset), true);
			obj.from.col = firstCol ? firstCol.col : 0;
			obj.from.colOff = pxToMm(realLeftOffset - worksheet.getCellLeft(obj.from.col, 0));

			obj.to.col = foundCol.col;
			obj.to.colOff = pxToMm(realLeftOffset + widthFromTo - worksheet.getCellLeft(obj.to.col, 0));

			var firstRow = worksheet._findRowUnderCursor(pxToPt(realTopOffset), true);
			obj.from.row = firstRow ? firstRow.row : 0;
			obj.from.rowOff = pxToMm(realTopOffset - worksheet.getCellTop(obj.from.row, 0));

			obj.to.row = foundRow.row;
			obj.to.rowOff = pxToMm(realTopOffset + heightFromTo - worksheet.getCellTop(obj.to.row, 0));
			
			if ( obj.flags.currentCursor && (obj.flags.currentCursor != "move") )
				obj.flags.redrawChart = true;
		}
	}

	//-----------------------------------------------------------------------------------
	// File Dialog
	//-----------------------------------------------------------------------------------

	_this.showImageFileDialog = function(documentId, documentFormat) {

		if (isViewerMode())
			return;

		var oImageUploader = document.getElementById("apiImageUpload");
		if (!oImageUploader) {
			var frame = document.createElement("iframe");
			frame.name = "apiImageUpload";
			frame.id = "apiImageUpload";
			frame.setAttribute("style", "position:absolute;left:-2px;top:-2px;width:1px;height:1px;z-index:-1000;");
			document.body.appendChild(frame);
		}
		var frameWindow = window.frames["apiImageUpload"];
		var content = '<html><head></head><body><form action="' + g_sUploadServiceLocalUrl + '?sheetId=' + worksheet.model.getId() + '&key=' + documentId + '" method="POST" enctype="multipart/form-data"><input id="apiiuFile" name="apiiuFile" type="file" size="1"><input id="apiiuSubmit" name="apiiuSubmit" type="submit" style="display:none;"></form></body></html>';
		frameWindow.document.open();
		frameWindow.document.write(content);
		frameWindow.document.close();

		var fileName = frameWindow.document.getElementById("apiiuFile");
		var fileSubmit = frameWindow.document.getElementById("apiiuSubmit");

		fileName.onchange = function(e) {
			fileSubmit.click();
			worksheet.model.workbook.handlers.trigger("asc_onStartAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
		}

		if (window.opera != undefined)
			setTimeout(function() { fileName.click(); }, 0);
		else
			fileName.click();
	}

	//-----------------------------------------------------------------------------------
	// Shapes controller
	//-----------------------------------------------------------------------------------
	
	_this.controller = new DrawingObjectsController(_this);
	
	//-----------------------------------------------------------------------------------
	// Private Misc Methods
	//-----------------------------------------------------------------------------------

	function guid() {
		function S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	}

	function generateId() {
		lastObjectIndex++;
		return userId + "_" + worksheet.model.getId() + "_" + lastObjectIndex;
	}

	function ascCvtRatio(fromUnits, toUnits) {
		return asc.getCvtRatio( fromUnits, toUnits, drawingCtx.getPPIX() );
	}

	function setCanvasZIndex(canvas, value) {
		if (canvas && (value >= 0) && (value <= 1))
			canvas.globalAlpha = value;
	}

	function emuToPx(emu) {
		var tmp = emu * 20 * 96 / 2.54 / 72 / 100 / 1000;
		return Math.floor(tmp);
	}

	function pxToEmu(px) {
		var tmp = px * 2.54 * 72 * 100 * 1000 / 20 / 96;
		return Math.floor(tmp);
	}

	function pxToPt(val) {
		var tmp = asc.round(val) * ascCvtRatio(0, 1);
		return tmp > 0 ? tmp : 0;
	}

	function ptToPx(val) {
		var tmp = val * ascCvtRatio(1, 0);
		return tmp;
	}

	function mmToPx(val) {
		var tmp = val * ascCvtRatio(3, 0);
		return tmp;
	}
	
	function mmToPt(val) {
		var tmp = val * ascCvtRatio(3, 1);
		return tmp;
	}

	function pxToMm(val) {
		var tmp = val * ascCvtRatio(0, 3);
		return tmp;
	}
}

//-----------------------------------------------------------------------------------
// Image loader
//-----------------------------------------------------------------------------------

function ImageLoader() {
	
	var _this = this;
	var readyCallback = null;
	
	var ImageObject = function() {
		var _t = this;
		_t.bReady = false;
		_t.image = new Image();
		_t.image.onload = function() {
			_t.bReady = true;
			if ( _this.isReady() && readyCallback )
				readyCallback(false, null, false);
		}
	};
	
	var container = [];		// array of ImageObject
	
	_this.isReady = function() {
		for (var i = 0; i < container.length; i++) {
			if ( !container[i].bReady )
				return false;
		}
		return true;
	}
		
	_this.addImage = function(imageSrc) {
		if ( imageSrc ) {
			var imageObject = new ImageObject();
			imageObject.image.src = imageSrc;
			container.push(imageObject);
		}
	}
	
	_this.setReadyCallback = function(callback) {
		if ( callback && (typeof(callback) == "function") )
			readyCallback = callback;
	}
	
	_this.removeReadyCallback = function(callback) {
		readyCallback = null;
		container = [];
	}
}