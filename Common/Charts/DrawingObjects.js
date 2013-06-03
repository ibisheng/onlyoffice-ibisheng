
/* DrawingObjects.js
*
* Author: Dmitry Vikulov
* Date:   13/08/2012
*/

	//-----------------------------------------------------------------------------------
	// Chart interface
	//-----------------------------------------------------------------------------------
	
	// Global drawing pointer
	var DrawingObject = null;
	var DrawingObjectLayer = null;
	if ( !window["Asc"] ) 
		{window["Asc"] = {};}		// Для вставки диаграмм в Word
		
	// Defines
	var	TransactionState = { 
		No: -1,
		Start: 0,
		Stop: 1
	};
							
	var ECellAnchorType = {
		cellanchorAbsolute:  0,
		cellanchorOneCell:  1,
		cellanchorTwoCell:  2
	};

	var ChartDefines = {
		defaultChartWidth: 478,
		defaultChartHeight: 286
	};

	// Интерфейс < Excel - Word >
	function CChartData(bWordContext, chart) {
	
		var _this = this;
		
		_this.Id = bWordContext ? g_oIdCounter.Get_NewId() : "";
		_this.img = chart ? chart.img : "";
		_this.width = chart ? chart.width : ChartDefines.defaultChartWidth;
		_this.height = chart ? chart.height : ChartDefines.defaultChartHeight;
		_this.bChartEditor = chart ? chart.bChartEditor : true;
		
		_this.type = chart ? chart.type : "";
		_this.subType = chart ? chart.subType : c_oAscChartSubType.normal;
		_this.title = chart ? chart.title : "";
		_this.bDefaultTitle = chart ? chart.bDefaultTitle : false;
		_this.subTitle = chart ? chart.subTitle : "";

		if ( chart ) {
			_this.range = { interval: chart.range.interval, rows: chart.range.rows, columns: chart.range.columns };
			_this.xAxis = { title: chart.xAxis.title, bDefaultTitle: chart.xAxis.bDefaultTitle, show: chart.xAxis.show, grid: chart.xAxis.grid };
			_this.yAxis = { title: chart.yAxis.title, bDefaultTitle: chart.yAxis.bDefaultTitle, show: chart.yAxis.show, grid: chart.yAxis.grid };
			_this.legend = { position: chart.legend.position, show: chart.legend.show, overlay: chart.legend.overlay };
		}
		else {
			_this.range = { interval: bWordContext ? "" : "Sheet1!A1:C3", rows: false, columns: true };
			_this.xAxis = { title: "", bDefaultTitle: false, show: true, grid: true };
			_this.yAxis = { title: "", bDefaultTitle: false, show: true, grid: true };
			_this.legend = { position: c_oAscChartLegend.right, show: true, overlay: false };
		}			
		
		_this.showValue = chart ? chart.showValue : false;
		_this.styleId = chart ? chart.styleId : c_oAscChartStyle.Standart;
		
		_this.data = [];
		_this.themeColors = [];
		
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
			chart["title"] = _this.title;
			chart["bDefaultTitle"] = _this.bDefaultTitle;
			chart["subTitle"] = _this.subTitle;
			chart["showValue"] = _this.showValue;
			chart["styleId"] = _this.styleId;
			chart["bChartEditor"] = _this.bChartEditor;

			chart["range"] = {};
			chart["range"]["interval"] = _this.range.interval;
			chart["range"]["rows"] = _this.range.rows;
			chart["range"]["columns"] = _this.range.columns;

			chart["xAxis"] = {};
			chart["xAxis"]["title"] = _this.xAxis.title;
			chart["xAxis"]["bDefaultTitle"] = _this.xAxis.bDefaultTitle;
			chart["xAxis"]["show"] = _this.xAxis.show;
			chart["xAxis"]["grid"] = _this.xAxis.grid;

			chart["yAxis"] = {};
			chart["yAxis"]["title"] = _this.yAxis.title;
			chart["yAxis"]["bDefaultTitle"] = _this.yAxis.bDefaultTitle;
			chart["yAxis"]["show"] = _this.yAxis.show;
			chart["yAxis"]["grid"] = _this.yAxis.grid;

			chart["legend"] = {};
			chart["legend"]["position"] = _this.legend.position;
			chart["legend"]["show"] = _this.legend.show;
			chart["legend"]["overlay"] = _this.legend.overlay;
				
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
			_this.title = chart["title"];
			_this.bDefaultTitle = chart["bDefaultTitle"];
			_this.subTitle = chart["subTitle"];
			_this.showValue = chart["showValue"];
			_this.styleId = chart["styleId"];
			_this.bChartEditor = chart["bChartEditor"];
				
			_this.range.interval = chart["range"]["interval"];
			_this.range.rows = chart["range"]["rows"];
			_this.range.columns = chart["range"]["columns"];
				
			_this.xAxis.title = chart["xAxis"]["title"];
			_this.xAxis.bDefaultTitle = chart["xAxis"]["bDefaultTitle"];
			_this.xAxis.show = chart["xAxis"]["show"];
			_this.xAxis.grid = chart["xAxis"]["grid"];
				
			_this.yAxis.title = chart["yAxis"]["title"];
			_this.yAxis.bDefaultTitle = chart["yAxis"]["bDefaultTitle"];
			_this.yAxis.show = chart["yAxis"]["show"];
			_this.yAxis.grid = chart["yAxis"]["grid"];
				
			_this.legend.position = chart["legend"]["position"];
			_this.legend.show = chart["legend"]["show"];
			_this.legend.overlay = chart["legend"]["overlay"];
			
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
				_this.title = object.chart.title;
				_this.bDefaultTitle = object.chart.bDefaultTitle;
				_this.subTitle = object.chart.subTitle;
				_this.showValue = object.chart.showValue;
				_this.styleId = object.chart.styleId;
				_this.bChartEditor = object.chart.bChartEditor;
					
				_this.range.interval = object.chart.range.interval;
				_this.range.rows = object.chart.range.rows;
				_this.range.columns = object.chart.range.columns;
					
				_this.xAxis.title = object.chart.xAxis.title;
				_this.xAxis.bDefaultTitle = object.chart.xAxis.bDefaultTitle;
				_this.xAxis.show = object.chart.xAxis.show;
				_this.xAxis.grid = object.chart.xAxis.grid;
					
				_this.yAxis.title = object.chart.yAxis.title;
				_this.yAxis.bDefaultTitle = object.chart.yAxis.bDefaultTitle;
				_this.yAxis.show = object.chart.yAxis.show;
				_this.yAxis.grid = object.chart.yAxis.grid;
					
				_this.legend.position = object.chart.legend.position;
				_this.legend.show = object.chart.legend.show;
				_this.legend.overlay = object.chart.legend.overlay;
				
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
			Writer.WriteString2( _this.title );
			Writer.WriteBool( _this.bDefaultTitle );
			Writer.WriteString2( _this.subTitle );
			Writer.WriteBool( _this.showValue );
			Writer.WriteLong( _this.styleId );
			Writer.WriteBool( _this.bChartEditor );
				
			Writer.WriteString2( _this.range.interval );
			Writer.WriteBool( _this.range.rows );
			Writer.WriteBool( _this.range.columns );
				
			Writer.WriteString2( _this.xAxis.title );
			Writer.WriteBool( _this.xAxis.bDefaultTitle );
			Writer.WriteBool( _this.xAxis.show );
			Writer.WriteBool( _this.xAxis.grid );
				
			Writer.WriteString2( _this.yAxis.title );
			Writer.WriteBool( _this.yAxis.bDefaultTitle );
			Writer.WriteBool( _this.yAxis.show );
			Writer.WriteBool( _this.yAxis.grid );
				
			Writer.WriteString2( _this.legend.position );
			Writer.WriteBool( _this.legend.show );
			Writer.WriteBool( _this.legend.overlay );
			
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
			_this.title = Reader.GetString2();
			_this.bDefaultTitle = Reader.GetBool();
			_this.subTitle = Reader.GetString2();
			_this.showValue = Reader.GetBool();
			_this.styleId = Reader.GetLong();
			_this.bChartEditor = Reader.GetBool();
				
			_this.range.interval = Reader.GetString2();
			_this.range.rows = Reader.GetBool();
			_this.range.columns = Reader.GetBool();
				
			_this.xAxis.title = Reader.GetString2();
			_this.xAxis.bDefaultTitle = Reader.GetBool();
			_this.xAxis.show = Reader.GetBool();
			_this.xAxis.grid = Reader.GetBool();
				
			_this.yAxis.title = Reader.GetString2();
			_this.yAxis.bDefaultTitle = Reader.GetBool();
			_this.yAxis.show = Reader.GetBool();
			_this.yAxis.grid = Reader.GetBool();
				
			_this.legend.position = Reader.GetString2();
			_this.legend.show = Reader.GetBool();
			_this.legend.overlay = Reader.GetBool();
			
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
		
		if ( bWordContext )
			g_oTableId.Add( _this, _this.Id );
	}

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
	
	window["Asc"].asc_CChartStyle = asc_CChartStyle;
	window["Asc"]["asc_CChartStyle"] = asc_CChartStyle;
	prot = asc_CChartStyle.prototype;

	prot["asc_getStyle"] = prot.asc_getStyle;
	prot["asc_setStyle"] = prot.asc_setStyle;

	prot["asc_getImageUrl"] = prot.asc_getImageUrl;
	prot["asc_setImageUrl"] = prot.asc_setImageUrl;
	
	function asc_CChart(o) {

		this.bChartEditor = o.bChartEditor;
		this.type = o.type;
		this.subType = o.subType;
		this.title = o.title;
		this.bDefaultTitle = o.bDefaultTitle;
		this.subTitle = o.subTitle;
		this.showValue = o.showValue;
		this.styleId = o.styleId;

		this.range = new asc_CChartRange(o.range);
		this.xAxis = new asc_CChartAxis(o.xAxis);
		this.yAxis = new asc_CChartAxis(o.yAxis);
		this.legend = new asc_CChartLegend(o.legend);

		this.series = [];
		for (var i = 0; i < o.series.length; i++) {
			var ser = new asc_CChartSeria();

			ser.asc_setTitle(o.series[i].Tx);
			if (o.series[i].Val && o.series[i].Val.Formula)
				ser.asc_setValFormula(o.series[i].Val.Formula);
			if (o.series[i].xVal && o.series[i].xVal.Formula)
				ser.asc_setxValFormula(o.series[i].xVal.Formula);
			if (o.series[i].Marker) {
				ser.asc_setMarkerSize(o.series[i].Marker.Size);
				ser.asc_setMarkerSymbol(o.series[i].Marker.Symbol);
			}
			ser.asc_setOutlineColor(o.series[i].OutlineColor);

			this.series.push(ser);
		}
		this.buildSeries = o.buildSeries;
	}

	asc_CChart.prototype = {
		asc_getType: function() { return this.type; },
		asc_setType: function(type) { this.type = type; },

		asc_getSubType: function() { return this.subType; },
		asc_setSubType: function(subType) { this.subType = subType; },

		asc_getTitle: function() { return this.title; },
		asc_setTitle: function(title) { this.title = title; },

		asc_getDefaultTitleFlag: function() { return this.bDefaultTitle; },
		asc_setDefaultTitleFlag: function(defaultTitleFlag) { this.bDefaultTitle = defaultTitleFlag; },

		asc_getSubTitle: function() { return this.subTitle; },
		asc_setSubTitle: function(subTitle) { this.subTitle = subTitle; },

		asc_getStyleId: function() { return this.styleId; },
		asc_setStyleId: function(styleId) { this.styleId = styleId; },

		asc_getShowValueFlag: function() { return this.showValue; },
		asc_setShowValueFlag: function(show) { this.showValue = show; },

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
		asc_setChartEditorFlag: function(value) { this.bChartEditor = value; }
	}

	window["Asc"].asc_CChart = asc_CChart;
	window["Asc"]["asc_CChart"] = asc_CChart;
	prot = asc_CChart.prototype;

	prot["asc_getType"] = prot.asc_getType;
	prot["asc_setType"] = prot.asc_setType;

	prot["asc_getSubType"] = prot.asc_getSubType;
	prot["asc_setSubType"] = prot.asc_setSubType;

	prot["asc_getTitle"] = prot.asc_getTitle;
	prot["asc_setTitle"] = prot.asc_setTitle;

	prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
	prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;

	prot["asc_getSubTitle"] = prot.asc_getSubTitle;
	prot["asc_setSubTitle"] = prot.asc_setSubTitle;

	prot["asc_getStyleId"] = prot.asc_getStyleId;
	prot["asc_setStyleId"] = prot.asc_setStyleId;

	prot["asc_getShowValueFlag"] = prot.asc_getShowValueFlag;
	prot["asc_setShowValueFlag"] = prot.asc_setShowValueFlag;

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

	// Chart range
	function asc_CChartRange(o) {
		this.calcInterval = o.calcInterval;
		this.checkInterval = o.checkInterval;
		this.intervalToIntervalObject = o.intervalToIntervalObject;
		this.interval = o.interval;
		this.intervalObject = o.intervalObject;
		this.rows = o.rows;
		this.columns = o.columns;
	}

	asc_CChartRange.prototype = {

		asc_getInterval: function() { return this.interval; },
		asc_setInterval: function(interval) { this.interval = interval; },
		asc_checkInterval: function(type, subtype, interval, isRows) {
			return this.checkInterval(type, subtype, interval, isRows);
		},
		asc_calcInterval: function() {
			return this.calcInterval();
		},

		asc_getIntervalObject: function() { return this.intervalObject; },
		asc_setIntervalObject: function(intervalObject) { this.intervalObject = intervalObject; },
		intervalToIntervalObject: function() { return this.intervalToIntervalObject(); },

		asc_getRowsFlag: function() { return this.rows; },

		asc_setRowsFlag: function(rowsFlag) {
			this.rows = rowsFlag;
			this.columns = !rowsFlag;
		},
		asc_getColumnsFlag: function() { return this.columns; },

		asc_setColumnsFlag: function(columnsFlag) {
			this.rows = !columnsFlag;
			this.columns = columnsFlag;
		}
	}

	window["Asc"].asc_CChartRange = asc_CChartRange;
	window["Asc"]["asc_CChartRange"] = asc_CChartRange;
	prot = asc_CChartRange.prototype;

	prot["asc_getInterval"] = prot.asc_getInterval;
	prot["asc_setInterval"] = prot.asc_setInterval;
	prot["asc_calcInterval"] = prot.asc_calcInterval;
	prot["asc_checkInterval"] = prot.asc_checkInterval;

	prot["asc_getIntervalObject"] = prot.asc_getIntervalObject;
	prot["asc_setIntervalObject"] = prot.asc_setIntervalObject;

	prot["asc_getRowsFlag"] = prot.asc_getRowsFlag;
	prot["asc_setRowsFlag"] = prot.asc_setRowsFlag;

	prot["asc_getColumnsFlag"] = prot.asc_getColumnsFlag;
	prot["asc_setColumnsFlag"] = prot.asc_setColumnsFlag;

	// Chart axis
	function asc_CChartAxis(o) {
		this.title = o.title;
		this.bDefaultTitle = o.bDefaultTitle;
		this.show = o.show;
		this.grid = o.grid;
	}

	asc_CChartAxis.prototype = {
		asc_getTitle: function() { return this.title; },
		asc_setTitle: function(title) { this.title = title; },

		asc_getDefaultTitleFlag: function() { return this.bDefaultTitle; },
		asc_setDefaultTitleFlag: function(defaultTitleFlag) { this.bDefaultTitle = defaultTitleFlag; },

		asc_getShowFlag: function() { return this.show; },
		asc_setShowFlag: function(showFlag) { this.show = showFlag; },

		asc_getGridFlag: function() { return this.grid; },
		asc_setGridFlag: function(gridFlag) { this.grid = gridFlag; }
	}

	window["Asc"].asc_CChartAxis = asc_CChartAxis;
	window["Asc"]["asc_CChartAxis"] = asc_CChartAxis;
	prot = asc_CChartAxis.prototype;

	prot["asc_getTitle"] = prot.asc_getTitle;
	prot["asc_setTitle"] = prot.asc_setTitle;

	prot["asc_getDefaultTitleFlag"] = prot.asc_getDefaultTitleFlag;
	prot["asc_setDefaultTitleFlag"] = prot.asc_setDefaultTitleFlag;

	prot["asc_getShowFlag"] = prot.asc_getShowFlag;
	prot["asc_setShowFlag"] = prot.asc_setShowFlag;

	prot["asc_getGridFlag"] = prot.asc_getGridFlag;
	prot["asc_setGridFlag"] = prot.asc_setGridFlag;

	// Chart legend
	function asc_CChartLegend(o) {
		this.position = o.position;
		this.show = o.show;
		this.overlay = o.overlay;
	}

	asc_CChartLegend.prototype = {
		asc_getPosition: function() { return this.position; },
		asc_setPosition: function(pos) { this.position = pos; },

		asc_getShowFlag: function() { return this.show; },
		asc_setShowFlag: function(showFlag) { this.show = showFlag; },

		asc_getOverlayFlag: function() { return this.overlay; },
		asc_setOverlayFlag: function(overlayFlag) { this.overlay = overlayFlag; }
	}

	window["Asc"].asc_CChartLegend = asc_CChartLegend;
	window["Asc"]["asc_CChartLegend"] = asc_CChartLegend;
	prot = asc_CChartLegend.prototype;

	prot["asc_getPosition"] = prot.asc_getPosition;
	prot["asc_setPosition"] = prot.asc_setPosition;

	prot["asc_getShowFlag"] = prot.asc_getShowFlag;
	prot["asc_setShowFlag"] = prot.asc_setShowFlag;

	prot["asc_getOverlayFlag"] = prot.asc_getOverlayFlag;
	prot["asc_setOverlayFlag"] = prot.asc_setOverlayFlag;

	// Chart series
	function asc_CChartSeria() {
		this.Val = { Formula: null, NumCache: [] };
		this.xVal = { Formula: null, NumCache: [] };
		this.Tx = null;
		this.Marker = { Size: null, Symbol: null };
		this.OutlineColor = null;

		this.Properties = {
			ValFormula: 0,
			ValNumCache: 1,
			XValFormula: 2,
			XValNumCache: 3,
			Tx: 4,
			MarkerSize: 5,
			MarkerSymbol: 6,
			OutlineColor: 7
		};
	}

	asc_CChartSeria.prototype = {

		asc_getValFormula: function() { return this.Val.Formula; },
		asc_setValFormula: function(formula) { this.Val.Formula = formula; },

		asc_getxValFormula: function() { return this.xVal.Formula; },
		asc_setxValFormula: function(formula) { this.xVal.Formula = formula; },

		asc_getTitle: function() { return this.Tx; },
		asc_setTitle: function(title) { this.Tx = title; },

		asc_getMarkerSize: function() { return this.Marker.Size; },
		asc_setMarkerSize: function(size) { this.Marker.Size = size; },

		asc_getMarkerSymbol: function() { return this.Marker.Symbol; },
		asc_setMarkerSymbol: function(symbol) { this.Marker.Symbol = symbol; },

		asc_getOutlineColor: function() { return this.OutlineColor; },
		asc_setOutlineColor: function(color) { this.OutlineColor = color; },

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
				case this.Properties.MarkerSize: return this.Marker.Size; break;
				case this.Properties.MarkerSymbol: return this.Marker.Symbol; break;
				case this.Properties.OutlineColor: return this.OutlineColor; break;
			}
		},

		setProperty: function(nType, value) {
			switch (nType) {
				case this.Properties.ValFormula: this.Val.Formula = value; break;
				case this.Properties.ValNumCache: this.Val.NumCache = value; break;
				case this.Properties.XValFormula: this.xVal.Formula = value; break;
				case this.Properties.XValNumCache: this.xVal.NumCache = value; break;
				case this.Properties.Tx: this.Tx = value; break;
				case this.Properties.MarkerSize: this.Marker.Size = value; break;
				case this.Properties.MarkerSymbol: this.Marker.Symbol = value; break;
				case this.Properties.OutlineColor: this.OutlineColor = value; break;
			}
		}
	}

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

// Undo / Redo
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
				if ((data.flags.transactionState == TransactionState.No) || (data.flags.transactionState == TransactionState.Start)) {
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
					this.showDrawingObjects(true, null, false, false);
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
				if ((data.flags.transactionState == TransactionState.No) || (data.flags.transactionState == TransactionState.Stop)) {
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
					this.showDrawingObjects(true, null, false, false);
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
	var chartRender = new ChartRender();
	var worksheet = null;
	var isViewerMode = null;	
	var drawingCtx = null;
	var overlayCtx = null;
	var aObjects = null;
	var minImageWidth = 20;
	var minImageHeight = 20;
	var minChartWidth = 160;
	var minChartHeight = 160;
	var undoRedoObject = null;
	var shiftKey = false;
	var userId = null;
	var documentId = null;
	var lastObjectIndex = null;

	//-----------------------------------------------------------------------------------
	// Public methods
	//-----------------------------------------------------------------------------------

	_this.setShiftKey = function(bShiftKey) {
		shiftKey = bShiftKey;
	}

	_this.getWorksheet = function() {
		return worksheet;
	}

	_this.init = function(currentSheet) {

		var api = window["Asc"]["editor"];
		userId = api.User.asc_getId();
		documentId = api.documentId;
		worksheet = currentSheet;
		
		drawingCtx = currentSheet.drawingCtx;
		overlayCtx = currentSheet.overlayCtx;
		isViewerMode =  function() { return worksheet._trigger("getViewerMode"); };

		// в currentSheet.model.Drawings содержатся объекты с worksheet == null. Для каждого вызываем cloneDrawingObject
		aObjects = [];
		for (var i = 0; currentSheet.model.Drawings && (i < currentSheet.model.Drawings.length); i++) {

			aObjects[i] = _this.cloneDrawingObject(currentSheet.model.Drawings[i]);
			aObjects[i].worksheet = worksheet;
			aObjects[i].flags.loaded = currentSheet.model.Drawings[i].flags.loaded;

			if (aObjects[i].isChart())
				aObjects[i].chart.range.calcInterval();
		}
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
	
	_this.initGlobalDrawingPointer = function() {
		DrawingObject = DrawingBase;
		DrawingObjectLayer = DrawingLayer;
	}

	_this._uploadMessage = function(event) {
		if (null != event && null != event.data) {

			var data = JSON.parse(event.data);
			if(null != data && null != data.type)
			{
				if(PostMessageType.UploadImage == data.type)
				{
					if(c_oAscServerError.NoError == data.error)
					{
						var sheetId = null;
						if(null != data.input)
							sheetId = data.input.sheetId;
						var url = data.url;
						
						if (sheetId == worksheet.model.getId())
							_this.addImageDrawingObject(url, false, null);
						else
							worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
					}
					else
					{
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
		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			var obj = aObjects[i];
			var width = obj.getVisibleWidth();
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
			}
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

	_this.formulaToRange = function(formula, ws) {
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
			if (!obj.flags.loaded || !obj.image.complete)		// complete - дополнительная проверка в случае base64
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

	_this.showDrawingObjects = function(clearCanvas, printOptions, bMouseUp, bUpdateCharts) {

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

		if (drawingCtx && _this.needDrawingObjects()) {

			// всё чистим
			if (clearCanvas)
				_this.clearDrawingObjects();

			for (var i = 0; i < _this.countDrawingObjects(); i++) {

					var index = i;
					var obj = aObjects[i];
					obj.normalizeMetrics();
					
					obj.size.coeff = obj.getHeightFromTo(true) / obj.getWidthFromTo(true);

					if (!obj.flags.anchorUpdated)
						obj.updateAnchorPosition();

					if (obj.move.inAction && undoRedoObject && (undoRedoObject.id == obj.id)) {

						History.Create_NewPoint();
						History.StartTransaction();

						undoRedoObject.flags.transactionState = TransactionState.Start;
						History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Edit, worksheet.model.getId(), null, undoRedoObject);
						undoRedoObject = null;

						History.Create_NewPoint();
						var urObj = _this.cloneDrawingObject(obj);
						urObj.flags.transactionState = TransactionState.Stop;
						History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Edit, worksheet.model.getId(), null, urObj);

						History.EndTransaction();
					}

					var srcForPrint;

					// выход за границы
					while (worksheet.nColsCount < obj.to.col + 1) {
						worksheet.expandColsOnScroll(true);
					}
					while (worksheet.nRowsCount < obj.to.row + 1) {
						worksheet.expandRowsOnScroll(true);
					}

					var bOnload = false;
					if ( obj.isChart() && bUpdateCharts ) {
						if (!obj.chart.range.intervalObject)
							obj.chart.range.intervalToIntervalObject();
						
						var chartBase64 = chartRender.insertChart(obj.chart, null, obj.getWidthFromTo(), obj.getHeightFromTo());
						if ( !chartBase64 )
							continue;

						obj.image.onload = function() {
							obj.flags.loaded = true;
							obj.flags.currentCursor = null;
							_this.showDrawingObjects(true, printOptions, true, false);
						}

						obj.image.src = chartBase64;
						obj.flags.loaded = false;
						bOnload = true;
					}

					if ( !obj.canDraw() )
						continue;
						
					if ( !bOnload ) {
						obj.image.onload = function() {

							// Пересчёт нужен при смене src(ресайз диаграммы)
							var sWidth = obj.image.width - obj.getInnerOffsetLeft();
							var sHeight = obj.image.height - obj.getInnerOffsetTop();

							// Проверка для IE
							var dWidth = obj.getVisibleWidth();
							var dHeight = obj.getVisibleHeight();
							if ((dWidth <= 0) || (dHeight <= 0))
								return;

							drawingCtx.drawImage(obj.image,
							// обрезаем
												pxToPt(obj.getInnerOffsetLeft()), pxToPt(obj.getInnerOffsetTop()),
												pxToPt(sWidth), pxToPt(sHeight),
							// вставляем
												pxToPt(obj.getVisibleLeftOffset(true)), pxToPt(obj.getVisibleTopOffset(true)),
												pxToPt(dWidth), pxToPt(dHeight));

							if (obj.flags.selected && !printOptions)
								_this.selectDrawingObject(index);

							obj.flags.loaded = true;
						}
					}

					var sWidth = obj.image.width - obj.getInnerOffsetLeft();
					var sHeight = obj.image.height - obj.getInnerOffsetTop();

					if (printOptions) {
						if (obj.isChart()) {
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
						if (!obj.image.width || !obj.image.height)
							//return;
							continue;

						if (!obj.move.inAction || bMouseUp) {

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
					}

					if (obj.flags.selected && !printOptions)
						_this.selectDrawingObject(index);
					if (obj.flags.lockState != c_oAscObjectLockState.No)
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
		*	Объект, определяющий max колонку и строчку для отрисовки объектов листа. Если объектов нет, то null
		*/

		if (!_this.countDrawingObjects())
			return null;

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

	//-----------------------------------------------------------------------------------
	// Create drawing
	//-----------------------------------------------------------------------------------
	
	var DrawingBase = function(ws) {
		
		var _th = this;
		_th.worksheet = ws;		
		_th.Properties = {
			id: 1,			
			Type: 2,
			PosX: 3,
			PosY: 4,
			ExtCx: 5,
			ExtCy: 6,
			ImageSrc: 7,
			FlagCurrentCursor: 8,
			FlagsTransactionState: 9,
			imageUrl: 10,
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
			ChartType: 22,
			ChartSubType: 23,
			ChartTitle: 24,
			ChartDefaultTitle: 25,
			ChartSubTitle: 26,
			ChartShowValue: 27,
			ChartRangeInterval: 28,
			ChartRangeRows: 29,
			ChartRangeColumns: 30,
			ChartxAxisTitle: 31,
			ChartxAxisDefaultTitle: 32,
			ChartxAxisShow: 33,
			ChartxAxisGrid: 34,
			ChartyAxisTitle: 35,
			ChartyAxisDefaultTitle: 36,
			ChartyAxisShow: 37,
			ChartyAxisGrid: 38,
			ChartLegendPosition: 39,
			ChartLegendShow: 40,
			ChartLegendOverlay: 41,
			ChartSeries: 42,
			ChartStyleId: 43
		};

		_th.id = null;
		_th.image = new Image();
		_th.imageUrl = "";
		_th.Type = ECellAnchorType.cellanchorTwoCell;
		_th.Pos = { X: 0, Y: 0 };

		_th.from = { col: 0, colOff: 0, row: 0, rowOff: 0 };
		_th.to = { col: 0, colOff: 0, row: 0, rowOff: 0 };
		_th.ext = { cx: 0, cy: 0 };
		_th.size = { width: 0, height: 0, coeff: 1 };
		_th.move = { x: 0, y: 0, inAction: false };

		this.chart = {
			bChartEditor: false,
			range: {
				interval: function() {
					var result = "";
					if (_th.worksheet) {
						var selectedRange = _th.worksheet.getSelectedRange();
						if (selectedRange) {
							var box = selectedRange.getBBox0();
							var startCell = new CellAddress(box.r1, box.c1, 0);
							var endCell = new CellAddress(box.r2, box.c2, 0);

							if (startCell && endCell) {
								var wsName = _th.worksheet.model.sName;								
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
				} (),

				intervalObject: function() {
					return _th.worksheet ? _th.worksheet.getSelectedRange() : null;
				} (),

				checkInterval: function(type, subtype, interval, isRows) {
					var result = false;
					if (interval && _th.worksheet) {
						var _range = _this.formulaToRange(interval, _th.worksheet);
						if (_range && checkDataRange(type, subtype, _range, isRows, _th.worksheet))
							result = true;
					}
					return result;
				},

				calcInterval: function() {
					if (this.intervalObject) {
						var box = this.intervalObject.getBBox0();
						var startCell = new CellAddress(box.r1, box.c1, 0);
						var endCell = new CellAddress(box.r2, box.c2, 0);

						if (startCell && endCell) {
							
							if (startCell.getID() == endCell.getID())
								this.interval = startCell.getID();
							else {
								var wsName = this.intervalObject.worksheet.sName;								
								if ( !rx_test_ws_name.test(wsName) )
									wsName = "'" + wsName + "'";
									
								this.interval = wsName + "!" + startCell.getID() + ":" + endCell.getID();
							}
						}
					}
				},

				intervalToIntervalObject: function() {
					if (this.interval && _th.worksheet) {
						var _range = _this.formulaToRange(this.interval, _th.worksheet);
						if (_range)
							this.intervalObject = _range;
					}
				},

				rows: false,
				columns: true
			},

			type: null,
			subType: null,
			title: "",
			bDefaultTitle: false,
			subTitle: "",

			xAxis: { title: "", bDefaultTitle: false, show: true, grid: true },

			yAxis: { title: "", bDefaultTitle: false, show: true, grid: true },

			legend: { position: c_oAscChartLegend.right, show: true, overlay: false },

			showValue: false,
			styleId: c_oAscChartStyle.Standart,

			series: [], 	// Массив объектов типа asc_CChartSeria,

			buildSeries: function() {
				var _t = this;
				var bbox = _t.range.intervalObject.getBBox0();
				_t.series = [];
				var nameIndex = 1;
				if (_t.range.rows) {
					for (var i = bbox.r1; i <= bbox.r2; i++) {
						var ser = new window["Asc"]["asc_CChartSeria"];

						var startCell = new CellAddress(i, bbox.c1, 0);
						var endCell = new CellAddress(i, bbox.c2, 0);

						if (startCell && endCell) {
							if (startCell.getID() == endCell.getID())
								ser.Val.Formula = startCell.getID();
							else {
								ser.Val.Formula = ( !rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" +_t.range.intervalObject.worksheet.sName+ "'" : _t.range.intervalObject.worksheet.sName )
													+ "!" + startCell.getID() + ":" + endCell.getID();
						}
						}
						ser.Tx = "Series" + nameIndex;
						_t.series.push(ser);
						nameIndex++;
					}
				}
				else {
					for (var i = bbox.c1; i <= bbox.c2; i++) {
						var ser = new window["Asc"]["asc_CChartSeria"];

						var startCell = new CellAddress(bbox.r1, i, 0);
						var endCell = new CellAddress(bbox.r2, i, 0);

						if (startCell && endCell) {
							if (startCell.getID() == endCell.getID())
								ser.Val.Formula = startCell.getID();
							else {
								ser.Val.Formula = ( !rx_test_ws_name.test(_t.range.intervalObject.worksheet.sName) ? "'" +_t.range.intervalObject.worksheet.sName+ "'" : _t.range.intervalObject.worksheet.sName )
													+ "!" + startCell.getID() + ":" + endCell.getID();
						}
						}
						ser.Tx = "Series" + nameIndex;
						_t.series.push(ser);
						nameIndex++;
					}
				}
			}
		};

		this.flags = {
			loaded: false,
			selected: false,
			anchorUpdated: false,
			lockState: c_oAscObjectLockState.No,
			currentCursor: null,
			transactionState: TransactionState.No
		};

		// Свойства
		this.isImage = function() {
			return !this.isChart();
		}
		
		this.isChart = function() {
			return this.chart.type ? true : false;
		}

		// Проверяет выход за границы
		this.canDraw = function() {
			var result = true;

			if (!this.image.src ||
					 (_th.worksheet.getCellLeft(_th.worksheet.getFirstVisibleCol(), 0) > _th.worksheet.getCellLeft(this.to.col, 0) + mmToPx(this.to.colOff)) ||
					 (_th.worksheet.getCellTop(_th.worksheet.getFirstVisibleRow(), 0) > _th.worksheet.getCellTop(this.to.row, 0) + mmToPx(this.to.rowOff)))
			{ result = false; }

			return result;
		}

		this.canResize = function(width, height) {
			var result = true;

			if (this.flags.currentCursor != "move") {
				if (this.isChart()) {
					if (width == minChartWidth) {
						switch (this.flags.currentCursor) {
							case "w-resize": case "e-resize": case "ne-resize":
							case "nw-resize": case "se-resize": case "sw-resize":
								result = false;
						}
					}
					else if (height == minChartHeight) {
						switch (this.flags.currentCursor) {
							case "n-resize": case "s-resize": case "ne-resize":
							case "nw-resize": case "se-resize": case "sw-resize":
								result = false;
						}
					}
				}
				else {		// Image
					if (width == minImageWidth) {
						switch (this.flags.currentCursor) {
							case "w-resize": case "e-resize": case "ne-resize":
							case "nw-resize": case "se-resize": case "sw-resize":
								result = false;
						}
					}
					else if (height == minImageHeight) {
						switch (this.flags.currentCursor) {
							case "n-resize": case "s-resize": case "ne-resize":
							case "nw-resize": case "se-resize": case "sw-resize":
								result = false;
						}
					}
				}
			}

			return result;
		}

		this.updateAnchorPosition = function() {

			switch (this.Type) {
				case ECellAnchorType.cellanchorOneCell: 
					{
						var _left = this.getRealLeftOffset();
						var _top = this.getRealTopOffset();

						var foundCol = _th.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(this.ext.cx)), true);
						while (foundCol == null) {
							_th.worksheet.expandColsOnScroll(true);
							_th.worksheet._trigger("reinitializeScrollX");
							foundCol = _th.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(this.ext.cx)), true);
						}
						this.to.col = foundCol.col;
						this.to.colOff = pxToMm(_left + mmToPx(this.ext.cx) - _th.worksheet.getCellLeft(this.to.col, 0));

						var foundRow = _th.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(this.ext.cy)), true);
						while (foundRow == null) {
							_th.worksheet.expandRowsOnScroll(true);
							_th.worksheet._trigger("reinitializeScrollY");
							foundRow = _th.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(this.ext.cy)), true);
						}
						this.to.row = foundRow.row;
						this.to.rowOff = pxToMm(_top + mmToPx(this.ext.cy) - _th.worksheet.getCellTop(this.to.row, 0));
					}
					break;

				case ECellAnchorType.cellanchorAbsolute: 
					{
						if ( this.Pos.X < 0 )
							this.Pos.X = 0;
						if ( this.Pos.Y < 0 )
							this.Pos.Y = 0;
					
						this.from.col = _th.worksheet._findColUnderCursor(pxToPt(mmToPx(this.Pos.X) + _th.worksheet.getCellLeft(0, 0)), true).col;
						this.from.colOff = pxToMm(mmToPx(this.Pos.X) + _th.worksheet.getCellLeft(0, 0) - _th.worksheet.getCellLeft(this.from.col, 0));

						this.from.row = _th.worksheet._findRowUnderCursor(pxToPt(mmToPx(this.Pos.Y) + _th.worksheet.getCellTop(0, 0)), true).row;
						this.from.rowOff = pxToMm(mmToPx(this.Pos.Y) + _th.worksheet.getCellTop(0, 0) - _th.worksheet.getCellTop(this.from.row, 0));

						var _left = this.getRealLeftOffset();
						var _top = this.getRealTopOffset();

						var foundCol = _th.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(this.ext.cx)), true);
						while (foundCol == null) {
							_th.worksheet.expandColsOnScroll(true);
							_th.worksheet._trigger("reinitializeScrollX");
							foundCol = _th.worksheet._findColUnderCursor(pxToPt(_left + mmToPx(this.ext.cx)), true);
						}
						this.to.col = foundCol.col;
						this.to.colOff = pxToMm(_left + mmToPx(this.ext.cx) - _th.worksheet.getCellLeft(this.to.col, 0));

						var foundRow = _th.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(this.ext.cy)), true);
						while (foundRow == null) {
							_th.worksheet.expandRowsOnScroll(true);
							_th.worksheet._trigger("reinitializeScrollY");
							foundRow = _th.worksheet._findRowUnderCursor(pxToPt(_top + mmToPx(this.ext.cy)), true);
						}
						this.to.row = foundRow.row;
						this.to.rowOff = pxToMm(_top + mmToPx(this.ext.cy) - _th.worksheet.getCellTop(this.to.row, 0));
					}
					break;
			}
			this.flags.anchorUpdated = true;
		}

		this.normalizeMetrics = function() {
			var width = this.getWidthFromTo();
			var height = this.getHeightFromTo();
			if ( width < 2 )
				this.to.colOff = this.from.colOff + 4;
			if ( height < 2 )
				this.to.rowOff = this.from.rowOff + 4;
		}
		
		// Реальное смещение по высоте
		this.getRealTopOffset = function() {
			var val = _th.worksheet.getCellTop(this.from.row, 0) + mmToPx(this.from.rowOff);
			return Asc.round(val);
		}

		// Реальное смещение по ширине
		this.getRealLeftOffset = function() {
			var val = _th.worksheet.getCellLeft(this.from.col, 0) + mmToPx(this.from.colOff);
			return Asc.round(val);
		}

		// Ширина по координатам
		this.getWidthFromTo = function(withoutRound) {
			var val = _th.worksheet.getCellLeft(this.to.col, 0) + mmToPx(this.to.colOff) - _th.worksheet.getCellLeft(this.from.col, 0) - mmToPx(this.from.colOff);
			return withoutRound ? val : Asc.round(val);
		}

		// Высота по координатам
		this.getHeightFromTo = function(withoutRound) {
			var val = _th.worksheet.getCellTop(this.to.row, 0) + mmToPx(this.to.rowOff) - _th.worksheet.getCellTop(this.from.row, 0) - mmToPx(this.from.rowOff);
			return withoutRound ? val : Asc.round(val);
		}

		// Видимая ширина при скролах
		this.getVisibleWidth = function() {
			var fvc = _th.worksheet.getCellLeft(_th.worksheet.getFirstVisibleCol(), 0);
			var off = this.getRealLeftOffset() - fvc;
			off = (off >= 0) ? 0 : Math.abs(off);
			return this.getWidthFromTo() - off;
		}

		// Видимая высота при скролах
		this.getVisibleHeight = function() {
			var fvr = _th.worksheet.getCellTop(_th.worksheet.getFirstVisibleRow(), 0);
			var off = this.getRealTopOffset() - fvr;
			off = (off >= 0) ? 0 : Math.abs(off);
			return this.getHeightFromTo() - off;
		}

		// Видимое смещение объекта от первой видимой строки
		this.getVisibleTopOffset = function(withHeader) {
			var headerRowOff = _th.worksheet.getCellTop(0, 0);
			var fvr = _th.worksheet.getCellTop(_th.worksheet.getFirstVisibleRow(), 0);
			var off = this.getRealTopOffset() - fvr;
			var off = (off > 0) ? off : 0;
			return withHeader ? headerRowOff + off : off;
		}

		// Видимое смещение объекта от первой видимой колонки
		this.getVisibleLeftOffset = function(withHeader) {
			var headerColOff = _th.worksheet.getCellLeft(0, 0);
			var fvc = _th.worksheet.getCellLeft(_th.worksheet.getFirstVisibleCol(), 0);
			var off = this.getRealLeftOffset() - fvc;
			var off = (off > 0) ? off : 0;
			return withHeader ? headerColOff + off : off;
		}

		// смещение по высоте внутри объекта
		this.getInnerOffsetTop = function() {
			var fvr = _th.worksheet.getCellTop(_th.worksheet.getFirstVisibleRow(), 0);
			var off = this.getRealTopOffset() - fvr;
			return (off > 0) ? 0 : Asc.round(Math.abs(off) * this.getHeightCoeff());
		}

		// смещение по ширине внутри объекта
		this.getInnerOffsetLeft = function() {
			var fvc = _th.worksheet.getCellLeft(_th.worksheet.getFirstVisibleCol(), 0);
			var off = this.getRealLeftOffset() - fvc;
			return (off > 0) ? 0 : Asc.round(Math.abs(off) * this.getWidthCoeff());
		}

		// коэффициент по ширине если несоответствие с реальным размером
		this.getWidthCoeff = function() {
			return this.image.width / this.getWidthFromTo();
		}

		// коэффициент по высоте если несоответствие с реальным размером
		this.getHeightCoeff = function() {
			return this.image.height / this.getHeightFromTo();
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
	
	//-----------------------------------------------------------------------------------
	// For collaborative editing
	//-----------------------------------------------------------------------------------
	
	DrawingBase.prototype = {

		getType: function() {
			return UndoRedoDataTypes.DrawingObjectData;
		},

		getProperties: function() {
			return this.Properties;
		},

		getProperty: function(nType) {
			switch (nType) {
				case this.Properties.id: return this.id; break;
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

				case this.Properties.ChartType: return this.chart.type; break;
				case this.Properties.ChartSubType: return this.chart.subType; break;
				case this.Properties.ChartTitle: return this.chart.title; break;
				case this.Properties.ChartDefaultTitle: return this.chart.bDefaultTitle; break;
				case this.Properties.ChartSubTitle: return this.chart.subTitle; break;
				case this.Properties.ChartShowValue: return this.chart.showValue; break;
				case this.Properties.ChartStyleId: return this.chart.styleId; break;

				case this.Properties.ChartRangeInterval: return this.chart.range.interval; break;
				case this.Properties.ChartRangeRows: return this.chart.range.rows; break;
				case this.Properties.ChartRangeColumns: return this.chart.range.columns; break;

				case this.Properties.ChartxAxisTitle: return this.chart.xAxis.title; break;
				case this.Properties.ChartxAxisDefaultTitle: return this.chart.xAxis.bDefaultTitle; break;
				case this.Properties.ChartxAxisShow: return this.chart.xAxis.show; break;
				case this.Properties.ChartxAxisGrid: return this.chart.xAxis.grid; break;

				case this.Properties.ChartyAxisTitle: return this.chart.yAxis.title; break;
				case this.Properties.ChartyAxisDefaultTitle: return this.chart.yAxis.bDefaultTitle; break;
				case this.Properties.ChartyAxisShow: return this.chart.yAxis.show; break;
				case this.Properties.ChartyAxisGrid: return this.chart.yAxis.grid; break;

				case this.Properties.ChartLegendPosition: return this.chart.legend.position; break;
				case this.Properties.ChartLegendShow: return this.chart.legend.show; break;
				case this.Properties.ChartLegendOverlay: return this.chart.legend.overlay; break;

				case this.Properties.ChartSeries: return this.chart.series; break;
			}
		},

		setProperty: function(nType, value) {
			switch (nType) {
				case this.Properties.id: this.id = value; break;
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

				case this.Properties.ChartType: this.chart.type = value; break;
				case this.Properties.ChartSubType: this.chart.subType = value; break;
				case this.Properties.ChartTitle: this.chart.title = value; break;
				case this.Properties.ChartDefaultTitle: this.chart.bDefaultTitle = value; break;
				case this.Properties.ChartSubTitle: this.chart.subTitle = value; break;
				case this.Properties.ChartShowValue: this.chart.showValue = value; break;
				case this.Properties.ChartStyleId: this.chart.styleId = value; break;

				case this.Properties.ChartRangeInterval: this.chart.range.interval = value; break;
				case this.Properties.ChartRangeRows: this.chart.range.rows = value; break;
				case this.Properties.ChartRangeColumns: this.chart.range.columns = value; break;

				case this.Properties.ChartxAxisTitle: this.chart.xAxis.title = value; break;
				case this.Properties.ChartxAxisDefaultTitle: this.chart.xAxis.bDefaultTitle = value; break;
				case this.Properties.ChartxAxisShow: this.chart.xAxis.show = value; break;
				case this.Properties.ChartxAxisGrid: this.chart.xAxis.grid = value; break;

				case this.Properties.ChartyAxisTitle: this.chart.yAxis.title = value; break;
				case this.Properties.ChartyAxisDefaultTitle: this.chart.yAxis.bDefaultTitle = value; break;
				case this.Properties.ChartyAxisShow: this.chart.yAxis.show = value; break;
				case this.Properties.ChartyAxisGrid: this.chart.yAxis.grid = value; break;

				case this.Properties.ChartLegendPosition: this.chart.legend.position = value; break;
				case this.Properties.ChartLegendShow: this.chart.legend.show = value; break;
				case this.Properties.ChartLegendOverlay: this.chart.legend.overlay = value; break;

				case this.Properties.ChartSeries: this.chart.series = value; break;
			}
		}
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

	_this.createDrawingObject = function() {
		return new DrawingBase(worksheet);
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

		copyObject.chart.bChartEditor = obj.chart.bChartEditor;
		copyObject.chart.worksheet = obj.chart.worksheet;
		copyObject.chart.type = obj.chart.type;
		copyObject.chart.subType = obj.chart.subType ? obj.chart.subType : c_oAscChartSubType.normal;
		copyObject.chart.title = obj.chart.title;
		copyObject.chart.bDefaultTitle = obj.chart.bDefaultTitle;
		copyObject.chart.subTitle = obj.chart.subTitle;
		copyObject.chart.showValue = obj.chart.showValue;
		copyObject.chart.styleId = obj.chart.styleId;

		copyObject.chart.range.interval = obj.chart.range.interval;
		copyObject.chart.range.intervalObject = obj.chart.range.intervalObject;
		copyObject.chart.range.rows = obj.chart.range.rows;
		copyObject.chart.range.columns = obj.chart.range.columns;

		copyObject.chart.xAxis.title = obj.chart.xAxis.title;
		copyObject.chart.xAxis.bDefaultTitle = obj.chart.xAxis.bDefaultTitle;
		copyObject.chart.xAxis.show = obj.chart.xAxis.show;
		copyObject.chart.xAxis.grid = obj.chart.xAxis.grid;

		copyObject.chart.yAxis.title = obj.chart.yAxis.title;
		copyObject.chart.yAxis.bDefaultTitle = obj.chart.yAxis.bDefaultTitle;
		copyObject.chart.yAxis.show = obj.chart.yAxis.show;
		copyObject.chart.yAxis.grid = obj.chart.yAxis.grid;

		copyObject.chart.legend.position = obj.chart.legend.position;
		copyObject.chart.legend.show = obj.chart.legend.show;
		copyObject.chart.legend.overlay = obj.chart.legend.overlay;

		copyObject.chart.series = [];
		for (var i = 0; i < obj.chart.series.length; i++) {

			var ser = new window["Asc"].asc_CChartSeria;
			ser.asc_setTitle(obj.chart.series[i].Tx);

			if (obj.chart.series[i].Val && obj.chart.series[i].Val.Formula) {
				ser.asc_setValFormula(obj.chart.series[i].Val.Formula);
			}

			if (obj.chart.series[i].xVal && obj.chart.series[i].xVal.Formula) {
				ser.asc_setxValFormula(obj.chart.series[i].xVal.Formula);
			}

			if (obj.chart.series[i].Marker) {
				ser.asc_setMarkerSize(obj.chart.series[i].Marker.Size);
				ser.asc_setMarkerSymbol(obj.chart.series[i].Marker.Symbol);
			}
			ser.asc_setOutlineColor(obj.chart.series[i].OutlineColor);
			copyObject.chart.series.push(ser);
		}

		return copyObject;
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

			var obj = _this.createDrawingObject();
			obj.id = generateId();
			obj.worksheet = worksheet;
			
			obj.from.col = (options && options.cell) ? options.cell.col : worksheet.getSelectedColumnIndex();
			obj.from.row = (options && options.cell) ? options.cell.row : worksheet.getSelectedRowIndex();;
			
			// Проверяем начальные координаты при вставке
			while ( !worksheet.cols[obj.from.col] ) {
				worksheet.expandColsOnScroll(true);
			}
			worksheet.expandColsOnScroll(true); 	// для colOff
			
			while ( !worksheet.rows[obj.from.row] ) {
				worksheet.expandRowsOnScroll(true);
			}
			worksheet.expandRowsOnScroll(true); 	// для rowOff
			
			var realTopOffset = obj.getRealTopOffset();
			var realLeftOffset = obj.getRealLeftOffset();
			
			function calculateObjectMetrics(object, width, height) {
				// Обработка картинок большого разрешения
				var metricCoeff = 1;
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

			// Copy/Paste
			if ( options && options.width && options.height ) {
				
				calculateObjectMetrics(obj, options.width, options.height);
				obj.image.src = imageUrl;
				obj.imageUrl = imageUrl;
				aObjects.push(obj);
				
				History.Create_NewPoint();
				var copyObject = _this.cloneDrawingObject(obj);
				History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Add, worksheet.model.getId(), null, copyObject);
				
				_this.showDrawingObjects(true);
				worksheet.autoFilters.drawAutoF(worksheet);
				worksheet.cellCommentator.drawCommentCells(false);
			}
			else {			
				// Теперь знаем реальную высоту и ширину
				obj.image.onload = function() {
				
					obj.flags.loaded = true;					
					calculateObjectMetrics(obj, obj.image.width, obj.image.height);

					aObjects.push(obj);
					_this.selectDrawingObject(aObjects.length - 1);

					History.Create_NewPoint();
					var copyObject = _this.cloneDrawingObject(obj);
					History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Add, worksheet.model.getId(), null, copyObject);

					_this.showDrawingObjects(true);
					worksheet.model.workbook.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
					worksheet.autoFilters.drawAutoF(worksheet);
					worksheet.cellCommentator.drawCommentCells(false);
				}
				
				obj.image.onerror = function() {
					worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
				}
				
				obj.image.src = imageUrl;
				obj.imageUrl = imageUrl;
			}
			
			_this.lockDrawingObject(obj.id, bPackage ? false : true, bPackage ? false : true);
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
				var api = window["Asc"]["editor"];
				
				api.GuiControlColorsMap = [];
				for (var i = 0; i < wordChart.themeColors.length; i++) {
					
					var color = new RGBColor( wordChart.themeColors[i] );
					api.GuiControlColorsMap.push(new CColor(color.r, color.g, color.b));
				}
				api.chartStyleManager.init();
				api.chartPreviewManager.init();
			}
			
			var copyChart = _this.createDrawingObject();
			
			copyChart.chart.type = wordChart.type;
			copyChart.chart.subType = wordChart.subType;
			copyChart.chart.title = wordChart.title;
			copyChart.chart.bDefaultTitle = wordChart.bDefaultTitle;
			copyChart.chart.subTitle = wordChart.subTitle;
			copyChart.chart.showValue = wordChart.showValue;
			copyChart.chart.styleId = wordChart.styleId;
			copyChart.chart.bChartEditor = wordChart.bChartEditor;
			
			copyChart.chart.range.rows = wordChart.range.rows;
			copyChart.chart.range.columns = wordChart.range.columns;
			copyChart.chart.range.interval = wordChart.range.interval;
			
			copyChart.chart.xAxis.title = wordChart.xAxis.title;
			copyChart.chart.xAxis.bDefaultTitle = wordChart.xAxis.bDefaultTitle;
			copyChart.chart.xAxis.show = wordChart.xAxis.show;
			copyChart.chart.xAxis.grid = wordChart.xAxis.grid;
			
			copyChart.chart.yAxis.title = wordChart.yAxis.title;
			copyChart.chart.yAxis.bDefaultTitle = wordChart.yAxis.bDefaultTitle;
			copyChart.chart.yAxis.show = wordChart.yAxis.show;
			copyChart.chart.yAxis.grid = wordChart.yAxis.grid;
						
			copyChart.chart.legend.position = wordChart.legend.position;
			copyChart.chart.legend.show = wordChart.legend.show;
			copyChart.chart.legend.overlay = wordChart.legend.overlay;
			
			copyChart.chart.data = wordChart.data ? wordChart.data : [];
			
			chart = copyChart.chart;
			chart.range.intervalToIntervalObject();
			
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

		var _range = _this.formulaToRange(chart.range.interval, worksheet);
		if (_range)
			chart.range.intervalObject = _range;

		chart.buildSeries();

		var isNewChart = true;
		chart.worksheet = worksheet; 	// Для формул серий
		var chartBase64 = chartRender.insertChart(chart, null, bWordChart ? wordChart.width : ChartDefines.defaultChartWidth, bWordChart ? wordChart.height : ChartDefines.defaultChartHeight, isNewChart);
		if ( !chartBase64 )
			return false;

		// draw
		var obj = _this.createDrawingObject();
		obj.id = generateId();
		obj.chart = chart;

		// center
		var chartLeft = options && options.left ? ptToPx(options.left) : (parseInt($("#ws-canvas").css('width')) / 2) - ChartDefines.defaultChartWidth / 2;
		var chartTop = options && options.top ? ptToPx(options.top) : (parseInt($("#ws-canvas").css('height')) / 2) - ChartDefines.defaultChartHeight / 2;

		obj.from.col = worksheet._findColUnderCursor(pxToPt(chartLeft), true).col;
		obj.from.row = worksheet._findRowUnderCursor(pxToPt(chartTop), true).row;

		var realTopOffset = obj.getRealTopOffset();
		var realLeftOffset = obj.getRealLeftOffset();

		obj.image.onload = function() {
		
			obj.flags.loaded = true;

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

			if(options)
				_this.showDrawingObjects(true, null/*printOptions*/, false/*bMouseUp*/, true/*bUpdateCharts*/);
			else
				_this.showDrawingObjects(true);
			
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
						copyObject.flags.transactionState = TransactionState.Start;
						History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Edit, worksheet.model.getId(), null, copyObject);

						// asc to self
						var bRebuidSeries = false;
						if ((obj.chart.range.rows != chart.range.rows) || (obj.chart.range.interval != chart.range.interval))		// Требуется перестроение серий
							bRebuidSeries = true;

						obj.chart.range = chart.range;
						var _range = _this.formulaToRange(obj.chart.range.interval, worksheet);
						if (_range)
							obj.chart.range.intervalObject = _range;

						obj.chart.type = chart.type;
						obj.chart.subType = chart.subType;
						obj.chart.title = chart.title;
						obj.chart.subTitle = chart.subTitle;
						obj.chart.xAxis = chart.xAxis;
						obj.chart.yAxis = chart.yAxis;
						obj.chart.showValue = chart.showValue;
						obj.chart.styleId = chart.styleId;
						obj.chart.legend = chart.legend;

						if ( bRebuidSeries )
							obj.chart.buildSeries();

						var copyObject = _this.cloneDrawingObject(obj);
						copyObject.flags.transactionState = TransactionState.Stop;
						History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Edit, worksheet.model.getId(), null, copyObject);
						History.EndTransaction();

						_this.selectDrawingObject(index);
						_this.selectDrawingObjectRange(index);
						_this.showDrawingObjects(false, null/*printOptions*/, false/*bMouseUp*/, true/*bUpdateCharts*/);
					}
				}
				
				// Блокируем				
				_this.lockDrawingObject(obj.id, true, true, callbackFunc);
			}
		}
	}

	_this.reloadChartDrawingObjects = function(chart) {
		for (var i = 0; i < _this.countDrawingObjects(); i++) {
			var obj = aObjects[i];
			if (obj.isChart())
				obj.flags.loaded = false;
		}
	}

	_this.deleteSelectedDrawingObject = function() {

		var bResult = false;
		var index = _this.getSelectedDrawingObjectIndex();
		if (_this.checkDrawingObjectIndex(index) && !isViewerMode()) {
		
			if ( aObjects[index].isChart() && aObjects[index].chart.bChartEditor )
				return bResult;
				
			function callbackFunc(result) {
				if ( result ) {
					History.Create_NewPoint();
					var copyObject = _this.cloneDrawingObject(aObjects[index]);
					History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Remove, worksheet.model.getId(), null, copyObject);

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
					copyObject.flags.transactionState = TransactionState.Start;
					History.Add(g_oUndoRedoDrawingObject, historyitem_DrawingObject_Edit, worksheet.model.getId(), null, copyObject);

					if (changedRange) {
						obj.chart.range.intervalObject = changedRange;
						obj.chart.range.calcInterval();
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
					copyObject.flags.transactionState = TransactionState.Stop;
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
				copyObject.chart.range.calcInterval();
				copyObject.chart.buildSeries();
				
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
				return new Asc.asc_CChart(aObjects[index].chart);
			else null;
		}
		else {
			// Check iframe chart editor
			for (var i = 0; i < _this.countDrawingObjects(); i++) {
				if ( aObjects[i].isChart() && aObjects[i].chart.bChartEditor )
					return new Asc.asc_CChart(aObjects[i].chart);
			}
		
			// New chart object
			var chart = new Asc.asc_CChart(_this.createDrawingObject().chart);
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
					obj.chart.range.intervalToIntervalObject();
				
				// Проверка для id листа				
				if (obj.chart.range.intervalObject.worksheet.Id != worksheet.model.Id)
					return;
					
				var BB = obj.chart.range.intervalObject.getBBox0(),
					range = Asc.Range(BB.c1,BB.r1,BB.c2,BB.r2,true);
					
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

		for (var i = 0; (i < _this.countDrawingObjects()) && !shiftKey; i++) {
			if (aObjects[i].flags.selected == true)
				return i;
		}
		return -1;
	}

	_this.isChartDrawingObject = function(index) {

		var result = false;
		if (_this.checkDrawingObjectIndex(index)) {

			var obj = aObjects[index];
			if (obj.isChart())
				result = true;
		}
		return result;
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
			if (aObjects[i].flags.selected == true)
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
		//_this.showDrawingObjects(true, null, false, true);
	}

	_this.checkCursorDrawingObject = function(x, y) {

		var index = _this.inSelectionDrawingObjectIndex(x, y, true);
		var objectInfo = { cursor: null, data: null };

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
			if (realLeftOffset <= worksheet.getCellLeft(0, 0))
				realLeftOffset = worksheet.getCellLeft(0, 0);

			// выход за границу справа
			var foundCol = worksheet._findColUnderCursor(pxToPt(realLeftOffset + widthFromTo), true);
			while (foundCol == null) {
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
			while (foundRow == null) {
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
		return Asc.getCvtRatio( fromUnits, toUnits, drawingCtx.getPPIX() );
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
		var tmp = Asc.round(val) * ascCvtRatio(0, 1);
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

	function pxToMm(val) {
		var tmp = val * ascCvtRatio(0, 3);
		return tmp;
	}
}