
var bar;
var chartCanvas = null;
var g_bChartPreview = false;

function ChartRender() {
	
	this.insertChart = function(chart, activeWorkSheet, width, height, isNewChart, bChartPreview) {
	
		var chartBase64 = null;
		if ( bChartPreview )
			g_bChartPreview = true;
		else
			g_bChartPreview = false;
		
		chartCanvas = document.createElement('canvas');
		$(chartCanvas).css('width', width);
		$(chartCanvas).css('height', height);
		$(chartCanvas)[0].height = height;
		$(chartCanvas)[0].width = width;
		
		if ( insertChart(chart, activeWorkSheet, width, height, isNewChart) )
			chartBase64 = chartCanvas.toDataURL();
		
		return chartBase64;
	}
}

//var arrBaseColors = ["#4572A7", "#AA4643", "#89A54E", "#71588F", "#4198AF", "#DB843D"];
var arrBaseColors = [];

function ChartStyleManager() {
	
	var _this = this;
	var bReady = false;
	_this.colorMap = [];
	_this.baseColors = [];
	
	//-----------------------------------------------------------------------------------
	// Methods
	//-----------------------------------------------------------------------------------
	
	_this.init = function() {
		
		_this.colorMap = [];		
		var api_doc = window["editor"];
		var api_sheet = window["Asc"]["editor"];
		var themeColors = [];
		if ( api_sheet )
			themeColors = api_sheet.GuiControlColorsMap;
		else
			themeColors = getDocColors(api_doc);
		
		function getDocColors(api) {
			var _theme  = api.WordControl.m_oLogicDocument.theme;
			var _clrMap = api.WordControl.m_oLogicDocument.clrSchemeMap.color_map;

			var arr_colors = new Array(10);
			var rgba = {R:0, G:0, B:0, A:255};
			// bg1,tx1,bg2,tx2,accent1 - accent6
			var array_colors_types = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
			var _count = array_colors_types.length;

			var color = new CUniColor();
			color.color = new CSchemeColor();
			for (var i = 0; i < _count; ++i)
			{
				color.color.id = array_colors_types[i];
				color.Calculate(_theme, _clrMap, rgba);

				var _rgba = color.RGBA;
				arr_colors[i] = new CColor(_rgba.R, _rgba.G, _rgba.B);
			}
			return arr_colors;
		};
		
		
		_this.colorMap[1] = [ "#555555", "#9E9E9E", "#727272", "#464646", "#838383", "#C1C1C1" ];
		_this.colorMap[2] = [ themeColors[4].get_hex(), themeColors[5].get_hex(), themeColors[6].get_hex(), themeColors[7].get_hex(), themeColors[8].get_hex(), themeColors[9].get_hex() ];	
		_this.colorMap[3] = [ themeColors[4].get_hex() ];
		_this.colorMap[4] = [ themeColors[5].get_hex() ];
		_this.colorMap[5] = [ themeColors[6].get_hex() ];
		_this.colorMap[6] = [ themeColors[7].get_hex() ];
		_this.colorMap[7] = [ themeColors[8].get_hex() ];
		_this.colorMap[8] = [ themeColors[9].get_hex() ];
		
		for (var i = 0; i < themeColors.length; i++) {
			_this.baseColors.push(themeColors[i].get_hex());
		}
		
		bReady = true;
	}
	
	_this.isReady = function() {
		return bReady;
	}
	
	_this.getBaseColors = function(styleId) {
		if ( styleId && (typeof(styleId) == 'number') ) {
			if ( styleId % 8 === 0 )		
				return _this.colorMap[8];
			else
				return _this.colorMap[styleId % 8];
		}
		else
			return _this.colorMap[2];
	}
}

function ChartPreviewManager() {
	
	var _this = this;
	var bReady = false;	
	var previewGroups = [];
	
	previewGroups[c_oAscChartType.line] = [];
	previewGroups[c_oAscChartType.line][c_oAscChartSubType.normal] = [];
	previewGroups[c_oAscChartType.line][c_oAscChartSubType.stacked] = [];
	previewGroups[c_oAscChartType.line][c_oAscChartSubType.stackedPer] = [];
	
	previewGroups[c_oAscChartType.bar] = [];
	previewGroups[c_oAscChartType.bar][c_oAscChartSubType.normal] = [];
	previewGroups[c_oAscChartType.bar][c_oAscChartSubType.stacked] = [];
	previewGroups[c_oAscChartType.bar][c_oAscChartSubType.stackedPer] = [];
	
	previewGroups[c_oAscChartType.hbar] = [];
	previewGroups[c_oAscChartType.hbar][c_oAscChartSubType.normal] = [];
	previewGroups[c_oAscChartType.hbar][c_oAscChartSubType.stacked] = [];
	previewGroups[c_oAscChartType.hbar][c_oAscChartSubType.stackedPer] = [];
	
	previewGroups[c_oAscChartType.area] = [];
	previewGroups[c_oAscChartType.area][c_oAscChartSubType.normal] = [];
	previewGroups[c_oAscChartType.area][c_oAscChartSubType.stacked] = [];
	previewGroups[c_oAscChartType.area][c_oAscChartSubType.stackedPer] = [];
	
	previewGroups[c_oAscChartType.pie] = [];
	previewGroups[c_oAscChartType.pie][c_oAscChartSubType.normal] = [];
		
	previewGroups[c_oAscChartType.scatter] = [];
	previewGroups[c_oAscChartType.scatter][c_oAscChartSubType.normal] = [];
	
	previewGroups[c_oAscChartType.stock] = [];
	previewGroups[c_oAscChartType.stock][c_oAscChartSubType.normal] = [];
	
	_this.init = function() {
	
		var startTime = new Date();
	
		var api_doc = window["editor"];
		var api_sheet = window["Asc"]["editor"];
		var styleManager = api_doc ? api_doc.chartStyleManager : api_sheet.chartStyleManager;
		var chartRender = new ChartRender();
		
		var preview_w = 50, preview_h = 50;
		
		function createItem(value) {
			return { numFormatStr: "General", isDateTimeFormat: false, value: value };
		}
		
		function fillChartData(chart) {
			
			// Set data
			chart.data = [];
			
			switch (chart.type) {
			
				case c_oAscChartType.line:
					switch (chart.subType) {
						case c_oAscChartSubType.normal:
							chart.data.push( [createItem(2), createItem(1)] );
							chart.data.push( [createItem(3), createItem(2)] );
							chart.data.push( [createItem(2), createItem(3)] );
							chart.data.push( [createItem(3), createItem(2)] );
							break;
						case c_oAscChartSubType.stacked:
							chart.data.push( [createItem(1), createItem(4)] );
							chart.data.push( [createItem(6), createItem(4)] );
							chart.data.push( [createItem(2), createItem(4)] );
							chart.data.push( [createItem(8), createItem(5)] );
							break;
						case c_oAscChartSubType.stackedPer:
							chart.data.push( [createItem(2), createItem(2)] );
							chart.data.push( [createItem(4), createItem(2)] );
							chart.data.push( [createItem(2), createItem(2)] );
							chart.data.push( [createItem(4), createItem(2)] );
							break;
					}
					
					break;
					
				case c_oAscChartType.hbar:
					switch (chart.subType) {
						case c_oAscChartSubType.normal:
							chart.data.push( [createItem(4), createItem(3), createItem(2), createItem(1)] );							
							break;
						case c_oAscChartSubType.stacked:
							chart.data.push( [createItem(4), createItem(5)] );
							chart.data.push( [createItem(3), createItem(4)] );
							chart.data.push( [createItem(2), createItem(3)] );
							chart.data.push( [createItem(1), createItem(2)] );
							break;
						case c_oAscChartSubType.stackedPer:
							chart.data.push( [createItem(7), createItem(7)] );
							chart.data.push( [createItem(5), createItem(6)] );
							chart.data.push( [createItem(3), createItem(5)] );
							chart.data.push( [createItem(1), createItem(4)] );
							break;
					}
					break;
			
				case c_oAscChartType.bar:
					switch (chart.subType) {
						case c_oAscChartSubType.normal:
							chart.data.push( [createItem(1), createItem(2), createItem(3), createItem(4)] );
							break;
						case c_oAscChartSubType.stacked:
							chart.data.push( [createItem(1), createItem(2)] );
							chart.data.push( [createItem(2), createItem(3)] );
							chart.data.push( [createItem(3), createItem(4)] );
							chart.data.push( [createItem(4), createItem(5)] );
							break;
						case c_oAscChartSubType.stackedPer:
							chart.data.push( [createItem(1), createItem(4)] );
							chart.data.push( [createItem(3), createItem(5)] );
							chart.data.push( [createItem(5), createItem(6)] );
							chart.data.push( [createItem(7), createItem(7)] );
							break;
					}
					
					break;
			
				case c_oAscChartType.pie:
					chart.data.push( [createItem(3)] );
					chart.data.push( [createItem(1)] );
					break;
					
				case c_oAscChartType.area:
					switch (chart.subType) {
						case c_oAscChartSubType.normal:
							chart.data.push( [createItem(0), createItem(0)] );
							chart.data.push( [createItem(8), createItem(4)] );
							chart.data.push( [createItem(5), createItem(2)] );
							chart.data.push( [createItem(6), createItem(9)] );
							break;
						case c_oAscChartSubType.stacked:
							chart.data.push( [createItem(0), createItem(4)] );
							chart.data.push( [createItem(8), createItem(4)] );
							chart.data.push( [createItem(5), createItem(4)] );
							chart.data.push( [createItem(11), createItem(4)] );
							break;
						case c_oAscChartSubType.stackedPer:
							chart.data.push( [createItem(0), createItem(4)] );
							chart.data.push( [createItem(4), createItem(4)] );
							chart.data.push( [createItem(1), createItem(4)] );
							chart.data.push( [createItem(16), createItem(4)] );
							break;
					}
					break;
			
				default:
					for (var row = 0; row < maxRow; row++) {
						var values = [];
						for (var col = 0; col < maxCol; col++) {
			
							var item = {};
							item.numFormatStr = "General";
							item.isDateTimeFormat = false;
							item.value = row + col + 1;
							values.push(item);
						}
						chart.data.push(values);
					}
					break;
			}	
		}
		
		for (var chartType in previewGroups) {
			
			var group = [];
			var maxCol = 2, maxRow = 2;
			if (chartType == c_oAscChartType.stock) {
				maxCol = 4;
				maxRow = 3;
			}
				
			for (var style in styleManager.colorMap) {
				
				// Create and minimize properties
				var chart = new CChartData(false);
				chart.xAxis.show = chart.xAxis.grid = false;
				chart.yAxis.show = chart.yAxis.grid = false;
				chart.legend.show = false;
				
				chart.type = chartType;
				chart.styleId = parseInt(style);
				
				// Build
				switch (chartType) {
					
					case c_oAscChartType.line:
					case c_oAscChartType.bar:
					case c_oAscChartType.hbar:
					case c_oAscChartType.area:
						
						chart.subType = c_oAscChartSubType.normal;
						fillChartData(chart);
						var chartBase64 = chartRender.insertChart( chart, null, preview_w, preview_h, false, true );
						previewGroups[chartType][c_oAscChartSubType.normal][style] = chartBase64;
						
						chart.subType = c_oAscChartSubType.stacked;
						fillChartData(chart);
						var chartBase64 = chartRender.insertChart( chart, null, preview_w, preview_h, false, true );
						previewGroups[chartType][c_oAscChartSubType.stacked][style] = chartBase64;
						
						chart.subType = c_oAscChartSubType.stackedPer;
						fillChartData(chart);
						var chartBase64 = chartRender.insertChart( chart, null, preview_w, preview_h, false, true );
						previewGroups[chartType][c_oAscChartSubType.stackedPer][style] = chartBase64;
					
						break;
						
					case c_oAscChartType.pie:
					case c_oAscChartType.scatter:
					case c_oAscChartType.stock:
					
						chart.subType = c_oAscChartSubType.normal;
						fillChartData(chart);
						var chartBase64 = chartRender.insertChart( chart, null, preview_w, preview_h, false, true );
						previewGroups[chartType][c_oAscChartSubType.normal][style] = chartBase64;
						
						break;
				}				
			}
		}
		bReady = true;
		
		var endTime = new Date();
		//console.log( "ChartPreviewManager init: " + (endTime.getTime() - startTime.getTime()) );
	}
	
	_this.isReady = function() {
		return bReady;
	}
	
	_this.getChartPreviews = function(chartType, chartSubType) {
		
		if ( chartType && chartSubType && bReady ) {
			var group = previewGroups[chartType][chartSubType];
			var objectGroup = [];
			
			for (var style in group) {
				var chartStyle = new asc_CChartStyle();
				chartStyle.asc_setStyle(style);
				chartStyle.asc_setImageUrl(group[style]);
				objectGroup.push(chartStyle);
			}
			
			return objectGroup;
		}
		else
			null;
	}
}

function OnFormatText(command) {
	frames.message.document.designMode = 'On';
	frames.message.focus();
	frames.message.document.execCommand(command, 0, 0);
	alert(frames.message.document.body.innerHTML);
}

//-----------------------------------------------------------------------------------
// Calculate
//-----------------------------------------------------------------------------------

function calcGutter(axis,min,max,ymin,ymax,isSkip,isFormatCell) {
	/*if (typeof (bar.data[0]) == 'object') {
		var arrMin = [];
		var arrMax = [];
		for (var j = 0; j < bar.data.length; j++) {
			min = Math.min.apply(null, bar.data[j]);
			max = Math.max.apply(null, bar.data[j]);
			arrMin[j] = min;
			arrMax[j] = max;
		}
		var min = Math.min.apply(null, arrMin);
		var max = Math.max.apply(null, arrMax);
	}
	else {
		var min = Math.min.apply(null, bar.data);
		var max = Math.max.apply(null, bar.data);
	}
	if(isNaN(min) && isNaN(min))
	{
		min = 0;max = 0;
	}*/
	var scale = bar.scale
	if(undefined == scale)
		scale = [max, min]
	if ('scatter' == bar.type) {
		bar.scale = OfficeExcel.getScale(false, bar,min,max,ymin,ymax);
		bar.xScale = OfficeExcel.getScale(true, bar,min,max,ymin,ymax);
		if (bar._otherProps._ymax > 0 && bar._otherProps._ymin < 0) {
			bar._chartGutter._bottom = 14;
			bar._chartGutter._top = 14;
		}
		else if (bar._otherProps._ymax <= 0 && bar._otherProps._ymin < 0) {
			bar._chartGutter._bottom = 14;
			bar._chartGutter._top = 14;
		}
		else {
			bar._chartGutter._bottom = 14 + 20;
			bar._chartGutter._top = 14;
		}

		if (bar._otherProps._xmax > 0 && bar._otherProps._xmin < 0) {
			bar._chartGutter._left = 22;
			bar._chartGutter._right = 93;
		}
		else if (bar._otherProps._xmax <= 0 && bar._otherProps._xmin < 0) {
			bar._chartGutter._left = 22;
			bar._chartGutter._right = 93;
		}
		else {
			bar._chartGutter._left = bar.context.measureText(Math.max.apply(null, bar.scale)).width + 22;
			bar._chartGutter._right = 93;
		}
	}
	else if ('hbar' == bar.type || 'bar' == bar.type) {
		if ('hbar' == bar.type)
			bar._chartGutter._left = bar.context.measureText(Math.max.apply(null, [bar.data.length])).width + 20;
		else
			bar._chartGutter._left = bar.context.measureText(Math.max.apply(null, scale)).width + 20;
		bar._chartGutter._right = 72;
		bar._chartGutter._bottom = 35;
		bar._chartGutter._top = 14;
	}
	else {
		if (axis == undefined) {
			bar._chartGutter._left = bar.context.measureText(Math.max.apply(null, scale)).width + 18;
			if (bar._otherProps._filled == true)
				bar._chartGutter._right = 76;
			else
				bar._chartGutter._right = 90;
			if (min < 0 && max < 0 || min < 0 && max > 0)
				bar._chartGutter._bottom = 13;
			else
				bar._chartGutter._bottom = 34;
			bar._chartGutter._top = 13;
		}
		else if (axis == 'OX') {
			if (min < 0 && max < 0 || min < 0 && max > 0)
				bar._chartGutter._bottom = 13;
			else
				bar._chartGutter._bottom = 34;
		}
		else if (axis == 'OY') {
			bar._chartGutter._left = bar.context.measureText(Math.max.apply(null, scale)).width + 18;
		}
	}
}

function calcWidthGraph() {
	
	if ( !chartCanvas )
		return;
	
	var trueWidth = parseInt(chartCanvas.width) - bar._chartGutter._left - bar._chartGutter._right;
	var trueHeight = parseInt(chartCanvas.height) - bar._chartGutter._top - bar._chartGutter._bottom;
	
	if ('bar' == bar.type || 'hbar' == bar.type) {
		var mainKoff = 0.43;
		var data = bar.data[0];
		var lengthOfData = bar.data.length;
		if (bar._otherProps._type == 'accumulative' && 'bar' == bar.type || bar._otherProps._autoGrouping == 'stackedPer' || bar._otherProps._autoGrouping == 'stacked') {
			data = bar.data;
			//lengthOfData = 1;
			mainKoff = 0.597;
		}
		else if (1 == data.length) {
			mainKoff = 0.597;
		}
		else if (2 == data.length) {
			mainKoff = 0.43;
		}
		else {
			var tempKoff = 0.188;
			for (var j = 2; j < data.length; j++) {
				mainKoff = mainKoff - tempKoff / (j);
				if(mainKoff < 0.05)
					break;
				if(mainKoff - tempKoff / (j+1) < 0)
					tempKoff = tempKoff/10;
			}
		}


		var pointKoff = 1 - Math.abs(mainKoff);
		if ('hbar' == bar.type)
			bar._otherProps._vmargin = ((trueHeight - trueHeight * pointKoff) / 2) / (lengthOfData);
		else
			bar._otherProps._hmargin = ((trueWidth - trueWidth * pointKoff) / 2) / lengthOfData;
	}
	else if('line' == bar.type)
	{
		var lengthOfData = bar.data[0].length;
		var widthChart = (trueWidth/lengthOfData)*(lengthOfData - 1) + 5;
		
		bar._otherProps._hmargin = (trueWidth - widthChart) / 2;
	}
	else {
		var pointKoff = 1 - 1 / (bar.data[0].length)
		bar._otherProps._hmargin = (trueWidth - trueWidth * pointKoff) / 2;
	}
	if(bar._otherProps._filled == true)
		bar._otherProps._hmargin = 0;

}

function calcAllMargin(isFormatCell,isformatCellScOy,minX,maxX,minY,maxY) {
	if (typeof (bar.data[0]) == 'object') {
		var arrMin = [];
		var arrMax = [];
		for (var j = 0; j < bar.data.length; j++) {
			min = Math.min.apply(null, bar.data[j]);
			max = Math.max.apply(null, bar.data[j]);
			arrMin[j] = min;
			arrMax[j] = max;
		}
		var min = Math.min.apply(null, arrMin);
		var max = Math.max.apply(null, arrMax);
	}
	else {
		var min = Math.min.apply(null, bar.data);
		var max = Math.max.apply(null, bar.data);
	}
	
	if(isNaN(max))
		max = bar._otherProps._ymax;
	if(isNaN(min))
		min = bar._otherProps._ymin;
	
	var left = 0;
	var standartMargin = 14;
	bar.context.font = '13px Arial'
	
	if(bar.scale != undefined && bar.scale[bar.scale.length -1] != undefined && bar._otherProps._ylabels != false)
	{
		//left = bar.context.measureText(bar.scale[bar.scale.length -1]).width;
		var tempArr = [];
		for (var j = 0; j < bar.scale.length; j++) {
			if(bar.type == 'hbar')
				tempArr[j] = bar.context.measureText(bar.scale[j]).width
			else if(bar.type == 'scatter')
				tempArr[j] = bar.context.measureText(OfficeExcel.numToFormatText(bar.scale[j],isformatCellScOy)).width
			else
				tempArr[j] = bar.context.measureText(OfficeExcel.numToFormatText(bar.scale[j],isFormatCell)).width
		}
		if((bar.type == 'hbar' && min < 0 )|| ( bar.type == 'scatter' && bar._otherProps._type != 'burse2' && minX < 0))
			left = 0
		else
		{
			left = Math.max.apply(null,tempArr) + 5;
			if(bar._otherProps._autoGrouping == 'stackedPer')
				left += 12;//width '%'
		}
	}

	if(bar.type == 'pie')
	{
		var left = 0;
		var bottom = 0;
		var right = 0;
		var top = 0;
		if (bar._otherProps._key_halign == 'left')
			left += 76;
		else if (bar._otherProps._key_halign == 'right')
			right += 76;
		else if (bar._otherProps._key_halign == 'top')
			top +=32;
		else if (bar._otherProps._key_halign == 'bottom')
			bottom +=32;
		if (bar._chartTitle._text != null && bar._chartTitle._text != '')
			top += 42;
	}
	else
	{
		if (bar._otherProps._key_halign == 'left')
			left += 76;
		if (bar._yAxisTitle._align == 'rev')
			left += 28;
		else if (bar._yAxisTitle._align == 'hor')
			left += 95;
		else if (bar._yAxisTitle._align == 'ver')
			left += 0;
		//if(bar._otherProps._ylabels == false && left > 0)
			//left += -30;

		var right = 0;
		if (bar._otherProps._key_halign == 'right')
			right += 76;
		

		var top = 0;
		if (bar._otherProps._key_halign == 'top')
			top += 32;
		if (bar._chartTitle._text != null && bar._chartTitle._text != '')
			top += 42;
		

		var bottom = 0;
		if (bar._otherProps._key_halign == 'bottom')
			bottom += 32;
		if (bar._xAxisTitle._text != '')
		{
			bottom += 20;
		}
		if ((min >= 0 || bar.type == 'hbar') &&  bar._otherProps._xlabels)
		{
			bottom +=20;
		}
		if(bar._xAxisTitle._text != '' && (min >= 0 || bar.type == 'hbar') &&  bar._otherProps._xlabels)
			bottom += 7;
	}
	bar._chartGutter._left = standartMargin + left;
	bar._chartGutter._right = standartMargin + right;
	bar._chartGutter._top = standartMargin + top;
	/*if(bar._otherProps._xlabels != false && bar.type != 'pie')
		standartMargin = 0;
	if(bottom < 0)
		bottom = 0;*/
	bar._chartGutter._bottom = bottom + standartMargin;
}

//-----------------------------------------------------------------------------------
// Draw 
//-----------------------------------------------------------------------------------
function checkDataRange(type,subType,dataRange,isRows,worksheet) {
	var columns = false;
	var rows = false;
	if(isRows)
		rows = true;
	else
		columns = true;
	
	//проверка максимального дипазона
	var maxSeries = 255; 
	var minStockVal = 4;
	var bbox = {
		c1: dataRange.first.col,
		c2: dataRange.last.col,
		r1: dataRange.first.row,
		r2: dataRange.last.row
	}
	if(((type == 'Area' || type == 'Line' || type == 'Bar' || type == 'HBar') && ((columns && ((bbox.c2 - bbox.c1 + 1) > maxSeries || (bbox.r2 - bbox.r1 + 1) > gc_nMaxRow)) || (rows && ((bbox.c2 - bbox.c1 + 1) > gc_nMaxRow || (bbox.r2 - bbox.r1 + 1) > maxSeries)))))
	{
		worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.DataRangeError, c_oAscError.Level.NoCritical)
		return false;
	}
	else if((type == 'Pie') && ((bbox.c2 - bbox.c1 + 1) > maxSeries || (bbox.r2 - bbox.r1 + 1) > maxSeries))
	{
		worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.DataRangeError, c_oAscError.Level.NoCritical)
		return false;
	}
	else if (((type == 'Scatter' || type == 'Stock') && ((columns && ((bbox.c2 - bbox.c1 ) > maxSeries || (bbox.r2 - bbox.r1) > gc_nMaxRow)) || (rows && ((bbox.c2 - bbox.c1) > gc_nMaxRow || (bbox.r2 - bbox.r1) > maxSeries)))))
	{
		worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.DataRangeError, c_oAscError.Level.NoCritical)
		return false;
	}
	else if(type == 'Stock')
	{
		if(((columns && ((bbox.c2 - bbox.c1 +1) == minStockVal && (bbox.r2 - bbox.r1 + 1) >= minStockVal)) || (rows && ((bbox.r2 - bbox.r1 + 1) == minStockVal && (bbox.c2 - bbox.c1 + 1) >= minStockVal))))
			return true;
		else
		{
			worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.StockChartError, c_oAscError.Level.NoCritical)
			return false;
		}
	}
	else
		return true;
}

function formulaToRange(formula, worksheet) {
	var range = null;
	
	if ( formula && worksheet ) {
		var ref3D = parserHelp.is3DRef(formula, 0);
		if ( !ref3D[0] )
			range = worksheet.getRange2(formula.toUpperCase());
		else {
			var resultRef = parserHelp.parse3DRef(formula);
			if ( null !== resultRef ) {
				var ws = worksheet.workbook.getWorksheetByName(resultRef.sheet);
				//var ws = worksheet.workbook.getWorksheetByName(resultRef.sheet);
				if ( ws )
					range = ws.getRange2(resultRef.range);
			}
		}
	}
	return range;
}

function insertChart(chart, activeWorkSheet, width, height, isNewChart) {
	var isSeries = false;
	var formatCell = 'General';
	var formatCellScOy = 'General';
	
	var api_doc = window["editor"];
	var api_sheet = window["Asc"]["editor"];
	var styleManager = api_doc ? api_doc.chartStyleManager : api_sheet.chartStyleManager;
	
	arrBaseColors = styleManager.getBaseColors( parseInt(chart.styleId) );
	if(chart.series && chart.series.length !=0)
	{
		isSeries = true;
		var series = chart.series;
		//var ws = chart.worksheet;
		var ws = chart.range.intervalObject.worksheet;
		var arrValues = [];
		var max = 0;
		var min = 0; 
		var minY = 0;
		var maxY = 0;
		var isSkip = [];
		
		var isEn = false;
		var isEnY = false;
		
		if (chart.type == 'Scatter' && series[0].xVal.Formula != null)//в случае точечной диаграммы отдельная обработка
		{
			var isEnY = false
			for(l = 0; l < series.length; ++l)
			{
				var n = 0;
				
				arrValues[l] = [];
				var formula = formulaToRange(series[l].Val.Formula,ws);
				var xFormula = formulaToRange(series[l].xVal.Formula,ws);
				
				var firstCol = formula.first.col;
				var firstRow = formula.first.row;
				var lastCol = formula.last.col;
				var lastRow = formula.last.row;
				
				var xfirstCol = xFormula.first.col;
				var xfirstRow = xFormula.first.row;
				var xlastCol = xFormula.last.col;
				var xlastRow = xFormula.last.row;
				
				var isRow = false;
				if(xfirstCol == xlastCol)
					isRow  = true;
				
				if(!isRow)//по строкам или по столбцам будем строить
				{
					var row = xfirstRow;
					for(col = xfirstCol; col <= xlastCol; ++col)
					{
						arrValues[l][n] = [];
						var cell = ws.getCell(new CellAddress(row - 1, col - 1, 0));
						var cellY = ws.getCell(new CellAddress(firstRow - 1, firstCol + n - 1, 0));
						
						if(row == xfirstRow && col == xfirstCol && chart.subType != 'stackedPer' && chart.type != 'Stock')
						{
							formatCell = cell.getNumFormatStr();
							isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
						}
						
						if(row == firstRow && col == firstCol - 1 && chart.subType != 'stackedPer' && chart.range.rows && chart.type != 'Stock')
							formatCellScOy = cell.getNumFormatStr();
						else if(row == firstRow - 1 && col == firstCol && chart.subType != 'stackedPer' && !chart.range.rows && chart.type != 'Stock')
							formatCellScOy = cell.getNumFormatStr();
						
						var orValue = cell.getValue();
						var orValueY = cellY.getValue();
						
						var value =  parseFloat(orValue);
						var valueY = parseFloat(orValueY);
						
						if(orValue == '')
							arrValues[l][n][0] = value;
						else if (isNaN(value))
							arrValues[l][n][0] = 0;
						else
							arrValues[l][n][0] = value;
						
						if(orValueY == '')
							arrValues[l][n][1] = orValueY;
						else if (isNaN(valueY))
							arrValues[l][n][1] = 0;
						else
							arrValues[l][n][1] = valueY;
						
						if(value.toString() != '' && !isEn)
						{
							min = value;
							max = value;
							isEn = true;
						}
						if(valueY.toString() != '' && !isEnY)
						{
							minY = valueY;
							maxY = valueY;
							isEnY = true;
						}
						
						if(min > value && value != '')
							min =  value
						if(max < value && value != '')
							max = value
						if(minY > valueY && valueY != '')
							minY =  valueY
						if(maxY < valueY && valueY != '')
							maxY = valueY
						
						n++;
					}
				}
				else
				{
					var col = xfirstCol;
					for(row = xfirstRow; row <= xlastRow; ++row)
					{
						arrValues[l][n] = [];
						var cell = ws.getCell(new CellAddress(row - 1, col - 1, 0));
						var cellY = ws.getCell(new CellAddress(firstRow + n - 1, firstCol - 1, 0));
						
						if(row == xfirstRow && col == xfirstCol && chart.subType != 'stackedPer' && chart.type != 'Stock')
						{
							formatCell = cell.getNumFormatStr();
							isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
						}
						
						var orValue = cell.getValue();
						var orValueY = cellY.getValue();
						
						var value =  parseFloat(orValue);
						var valueY = parseFloat(orValueY);
						
						if(orValue == '')
							arrValues[l][n][0] = value;
						else if (isNaN(value))
							arrValues[l][n][0] = 0;
						else
							arrValues[l][n][0] = value;
						
						if(orValueY == '')
							arrValues[l][n][1] = orValueY;
						else if (isNaN(valueY))
							arrValues[l][n][1] = 0;
						else
							arrValues[l][n][1] = valueY;
						
						if(value.toString() != '' && !isEn)
						{
							min = value;
							max = value;
							isEn = true;
						}
						if(valueY.toString() != '' && !isEnY)
						{
							minY = valueY;
							maxY = valueY;
							isEnY = true;
						}
						
						if(min > value && value != '')
							min =  value
						if(max < value && value != '')
							max = value
						if(minY > valueY && valueY != '')
							minY =  valueY
						if(maxY < valueY && valueY != '')
							maxY = valueY
						
						n++;
					}
				}
			}
			
			if(minY && maxY)
			{
				chart.ymin = minY;
				chart.ymax = maxY;
			}
			var newArr = arrValues;
		}
		else//для всех остальных диаграмм при условии что данные приходят в виде серий
		{
			for(l = 0; l < series.length; ++l)
			{
				arrValues[l] = [];
				var formula = formulaToRange(series[l].Val.Formula,ws);
				var firstCol = formula.first.col;
				var firstRow = formula.first.row;
				var lastCol = formula.last.col;
				var lastRow = formula.last.row;
				
				var isRow = false;
				if(firstCol == lastCol)
					isRow  = true;
				isSkip[l] = true;
				
				if(!isRow)//по строкам или по столбцам
				{
					var row = firstRow;
					var n = 0;
					for(col = firstCol; col <= lastCol; ++col)
					{
						var cell = ws.getCell(new CellAddress(row - 1, col - 1, 0));
						
						if(l == 0 && col == firstCol && chart.subType != 'stackedPer' && chart.type != 'Stock')
						{
							formatCell = cell.getNumFormatStr();
							isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
						}
						else if(chart.type == 'Stock' && l == 0 && col == firstCol)
						{
							formatCellScOy = cell.getNumFormatStr();
							isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
						}
						
						if(chart.type == 'Scatter')
						{
							if(l == 1 && col == firstCol && chart.subType != 'stackedPer' && chart.type != 'Stock')
								formatCellScOy = cell.getNumFormatStr();
						}
						
						
						var orValue = cell.getValue();
						if('' != orValue)
							isSkip[l] = false;
						var value =  parseFloat(orValue)
						if(!isEn && !isNaN(value))
						{
							min = value;
							max = value;
							isEn = true;
						}
						if(!isNaN(value) && value > max)
							max = value
						if(!isNaN(value) && value < min)
							min = value
						if(isNaN(value) && orValue == '' && (((chart.type == 'Line' ) && chart.subType == 'normal') || (chart.type == 'Scatter' )))
						{
							value = '';
						}
						else if (isNaN(value))
							value = 0;
						if(chart.type == 'Pie')
							arrValues[l][n] = Math.abs(value);
						else
							arrValues[l][n] = value;
						n++;
					}
				}
				else
				{
					var col = firstCol;
					var n = 0;
					for(row = firstRow; row <= lastRow; ++row)
					{
						var cell = ws.getCell(new CellAddress(row - 1, col - 1, 0));
						
						if(l == 0 && row == firstRow && chart.subType != 'stackedPer' && chart.type != 'Stock')
						{
							formatCell = cell.getNumFormatStr();
							isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
						}
						else if(chart.type == 'Stock' && row == firstRow && l == 0)
						{
							formatCellScOy = cell.getNumFormatStr();
							isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
						}
						
						if(chart.type == 'Scatter')
						{
							if(l == 1 && row == firstRow && chart.subType != 'stackedPer' && chart.type != 'Stock')
								formatCellScOy = cell.getNumFormatStr();
						}
						
						var orValue = cell.getValue();
						if('' != orValue)
							isSkip[l] = false;
						var value =  parseFloat(orValue)
						if(!isEn && !isNaN(value))
						{
							min = value;
							max = value;
							isEn = true;
						}
						if(!isNaN(value) && value > max)
							max = value
						if(!isNaN(value) && value < min)
							min = value
						if(isNaN(value) && orValue == '' && (((chart.type == 'Line' ) && chart.subType == 'normal') || (chart.type == 'Scatter' )))
						{
							value = '';
						}
						else if (isNaN(value))
							value = 0;
						
						if(chart.type == 'Pie')
							arrValues[l][n] = Math.abs(value);
						else
							arrValues[l][n] = value;
						
						n++;
					}
				}
			}
		}
		
	}
	else if(chart.data)//для текстового редактора
	{
		var data = chart.data;
		var arrValues = [];
		var n = 0;
		var max = 0;
		var min = 0; 
		var isEn = false;
		var isSkip = [];
		var isSkipRev = [];
		for (row = 0; row < data.length; ++row) {
			arrValues[n] = [];
			var k = 0;
			isSkip[row] = true;
			for (col = 0; col < data[row].length; ++col) {
				
				if(row == 0 && col == 0 && chart.subType != 'stackedPer' && chart.type != 'Stock')
				{
					formatCell = data[row][col].numFormatStr;
					isDateTimeFormat = data[row][col].isDateTimeFormat;
				}
				else if(chart.type == 'Stock' && row == 0 && col == 0)
				{
					formatCellScOy = data[row][col].numFormatStr;
					isDateTimeFormat = data[row][col].isDateTimeFormat;
				}
				
				if(row ==1 && col == 0 && chart.subType != 'stackedPer' && chart.range.rows && chart.type != 'Stock')
					formatCellScOy = data[row][col].numFormatStr;
				else if(row == 0 && col == 1 && chart.subType != 'stackedPer' && !chart.range.rows && chart.type != 'Stock')
					formatCellScOy = data[row][col].numFormatStr;
				
				var orValue = data[row][col].value;
				var value = parseFloat(orValue);
				//если все значения пустые, то в дальнейшем при отрисовке пропускаем
				if(!isNaN(parseFloat(orValue)))
					isSkip[row] = false;
				if(!isEn && !isNaN(value))
				{
					min = value;
					max = value;
					isEn = true;
				}
				if(!isNaN(value) && value > max)
					max = value
				if(!isNaN(value) && value < min)
					min = value
				if(isNaN(value) && orValue == '' && (((chart.type == 'Line' ) && chart.subType == 'normal') || (chart.type == 'Scatter' )))
				{
					value = '';
				}
				else if (isNaN(value))
					value = 0;
				if(chart.type == 'Pie')
					arrValues[n][k] = Math.abs(value);
				else
					arrValues[n][k] = value;
				k++;
			}
			n++;
		}
	}
	else//в случае если серии приходят пустыми обрабатываем как и раньше
	{
		var bbox = chart.range.intervalObject.getBBox0();
		var arrValues = [];
		var n = 0;
		var max = 0;
		var min = 0; 
		var isEn = false;
		var isSkip = [];
		var isSkipRev = [];
		for (row = bbox.r1; row <= bbox.r2; ++row) {
			arrValues[n] = [];
			var k = 0;
			isSkip[row - bbox.r1] = true;
			for (col = bbox.c1; col <= bbox.c2; ++col) {
				var cell = chart.range.intervalObject.worksheet.getCell(new CellAddress(row, col, 0));
				
				if(row == bbox.r1 && col == bbox.c1 && chart.subType != 'stackedPer' && chart.type != 'Stock')
				{
					formatCell = cell.getNumFormatStr();
					isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
				}
				else if(chart.type == 'Stock' && row == bbox.r1 && col == bbox.c1)
				{
					formatCellScOy = cell.getNumFormatStr();
					isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
				}
				
				if(row == bbox.r1 + 1 && col == bbox.c1 && chart.subType != 'stackedPer' && chart.range.rows && chart.type != 'Stock')
					formatCellScOy = cell.getNumFormatStr();
				else if(row == bbox.r1 && col == bbox.c1 + 1 && chart.subType != 'stackedPer' && !chart.range.rows && chart.type != 'Stock')
					formatCellScOy = cell.getNumFormatStr();
				
				var orValue = cell.getValue();
				var value = parseFloat(orValue);
				//если все значения пустые, то в дальнейшем при отрисовке пропускаем
				if(orValue != '')
					isSkip[row - bbox.r1] = false;
				if(!isEn && !isNaN(value))
				{
					min = value;
					max = value;
					isEn = true;
				}
				if(!isNaN(value) && value > max)
					max = value
				if(!isNaN(value) && value < min)
					min = value
				if(isNaN(value) && orValue == '' && (((chart.type == 'Line' ) && chart.subType == 'normal') || (chart.type == 'Scatter' )))
				{
					value = '';
				}
				else if (isNaN(value))
					value = 0;
				if(chart.type == 'Pie')
					arrValues[n][k] = Math.abs(value);
				else
					arrValues[n][k] = value;
				k++;
			}
			n++;
		}
		var arrValuesRev = [];
		var n = 0;
		
		for (row = bbox.c1; row <= bbox.c2; ++row) {
			arrValuesRev[n] = [];
			var k = 0;
			isSkipRev[row - bbox.c1] = true;
			for (col = bbox.r1; col <= bbox.r2; ++col) {
				var cell = chart.range.intervalObject.worksheet.getCell(new CellAddress(col, row, 0));
				var orValue = cell.getValue()
				if(orValue != '')
					isSkipRev[row - bbox.c1] = false;
				var value = parseFloat(orValue);
				if(isNaN(value) && orValue == '' && (((chart.type == 'Line' ) && chart.subType == 'normal') || (chart.type == 'Scatter' )))
				{
					value = '';
				}
				else if (isNaN(value))
					value = 0;
				if(chart.type == 'Pie')
					arrValuesRev[n][k] = Math.abs(value);
				else
					arrValuesRev[n][k] = value;
				k++;
			}
			n++;
		}
	}
	
	
	/*if(chart.type == 'Stock' && isNewChart)
	{
		if((chart.range.columns && arrValues[0].length != 4) || (chart.range.rows && arrValues.length != 4))
		{
			chart.range.intervalObject.worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.StockChartError, c_oAscError.Level.NoCritical)
			return false;
		}
	}*/
	if(isSeries)
		var arrValuesRev = arrValues;
	isEn = false;
	if(chart.type == 'Scatter' && !newArr)
	{
		min = 0;
		max = 0;
		minY = 0;
		maxY = 0;
		var isEnY = false
		var scatterArr = arrValuesRev;
		if(!scatterArr)
			scatterArr = arrReverse(arrValues);
		if (chart.range.rows)
			scatterArr = arrValues;
		var newArr = [];
		if(isDateTimeFormat)
		{
			formatCellScOy = formatCell;
			formatCell = 'General';
			
			for (i = 0; i < scatterArr.length; ++i) {
				newArr[i]=[];
				for (j = 0; j < scatterArr[i].length; ++j) {
					newArr[i][j] = [];
					newArr[i][j][0] = j+1;
					newArr[i][j][1] = scatterArr[i][j];
					if(!isEn)
					{
						min = newArr[i][j][0];
						max = newArr[i][j][0];
						minY = newArr[i][j][1];
						minY = newArr[i][j][1];
						isEn = true;
					}
					if(min > newArr[i][j][0] && newArr[i][j][0] != '')
						min =  newArr[i][j][0]
					if(max < newArr[i][j][0] && newArr[i][j][0] != '')
						max = newArr[i][j][0]
					if(minY > newArr[i][j][1] && newArr[i][j][1] != '')
						minY =  newArr[i][j][1]
					if(maxY < newArr[i][j][1] && newArr[i][j][1] != '')
						maxY = newArr[i][j][1]
				}
			}
		}
		else if(scatterArr.length == 1)
		{
			newArr[0]=[];
			for (j = 0; j < scatterArr[0].length; ++j) {
				newArr[0][j] = [];
				newArr[0][j][0] = j+1;
				newArr[0][j][1] = scatterArr[0][j];
				if(!isEn)
				{
					min = newArr[0][j][0];
					max = newArr[0][j][0];
					minY = newArr[0][j][1];
					minY = newArr[0][j][1];
					isEn = true;
				}
				if(min > newArr[0][j][0] && newArr[0][j][0] != '')
					min =  newArr[0][j][0]
				if(max < newArr[0][j][0] && newArr[0][j][0] != '')
					max = newArr[0][j][0]
				if(minY > newArr[0][j][1] && newArr[0][j][1] != '')
					minY =  newArr[0][j][1]
				if(maxY < newArr[0][j][1] && newArr[0][j][1] != '')
					maxY = newArr[0][j][1]
			}
		}
		else
		{
			//принимаем первую срочку за X, остальные за y
			for (i = 1; i < scatterArr.length; ++i) {
				newArr[i-1]=[];
				for (j = 0; j < scatterArr[i].length; ++j) {
					newArr[i-1][j] = [];
					newArr[i-1][j][0] = scatterArr[0][j];
					newArr[i-1][j][1] = scatterArr[i][j];
					
					if(newArr[i-1][j][0].toString() != '' && !isEn)
					{
						min = newArr[i-1][j][0];
						max = newArr[i-1][j][0];
						isEn = true;
					}
					if(newArr[i-1][j][1].toString() != '' && !isEnY)
					{
						minY = newArr[i-1][j][1];
						maxY = newArr[i-1][j][1];
						isEnY = true;
					}
					
					if(min > newArr[i-1][j][0] && newArr[i-1][j][0] != '')
						min =  newArr[i-1][j][0]
					if(max < newArr[i-1][j][0] && newArr[i-1][j][0] != '')
						max = newArr[i-1][j][0]
					if(minY > newArr[i-1][j][1] && newArr[i-1][j][1] != '')
						minY =  newArr[i-1][j][1]
					if(maxY < newArr[i-1][j][1] && newArr[i-1][j][1] != '')
						maxY = newArr[i-1][j][1]
				}
			}
		}
		chart.ymin = minY;
		chart.ymax = maxY;
	}
	if(!arrValuesRev)
		arrValuesRev = arrReverse(arrValues)
	//if ((bbox.c2 - bbox.c1) < bbox.r2 - bbox.r1)
	chart.isFormatCell = formatCell;
	chart.isformatCellScOy = formatCellScOy;
	chart.min = min;
	chart.max = max;
	if(newArr != undefined)
		drawChart(chart, newArr, width, height);
	else
	{
		chart.isSkip = isSkip;
		if(isSeries)
		{
			if(chart.type == 'HBar' || chart.type == 'Bar' || chart.type == 'Stock')
			{
				//надо перевернуть массив
				arrValuesRev = arrReverse(arrValues);
				drawChart(chart, arrValuesRev, width, height);
			}
			else
				drawChart(chart, arrValues, width, height);
		}
		else
		{
			if (chart.range.rows)
			{
				if(chart.type == 'HBar' || chart.type == 'Bar' || chart.type == 'Stock')
				{
					//chart.isSkip = isSkipRev;
					chart.isSkip = isSkip;
					drawChart(chart, arrValuesRev, width, height);
				}
				else
				{
					chart.isSkip = isSkip;
					drawChart(chart, arrValues, width, height);
				}
			}
			else
			{
				if(chart.type == 'HBar' || chart.type == 'Bar' || chart.type == 'Stock')
				{
					chart.isSkip = isSkip;
					drawChart(chart, arrValues, width, height);
				}
				else
				{
					//chart.isSkip = isSkipRev;
					chart.isSkip = isSkip;
					drawChart(chart, arrValuesRev, width, height);
				}
			}
		}
		
	}
	return true;
}

function arrReverse(arr) {
	if(!arr)
		return;
	var newarr = [];
	for (i = 0; i < arr[0].length; ++i) {
		newarr[i] = [];
		for (j = 0; j < arr.length; ++j) {
			newarr[i][j] = arr[j][i];
		}
	}
	return newarr;
}

function drawChart(chart, arrValues, width, height) {

	var data = arrValues;
	var defaultXTitle = 'X Axis';
	var defaultYTitle = 'Y Axis';
	var defaultTitle = 'Diagram Title';

	// По типу
	switch (chart.type) {
		case c_oAscChartType.line:
			DrawLineChart(chartCanvas, chart.subType, false, data,chart);
			break;
		case c_oAscChartType.bar:
			DrawBarChart(chartCanvas, chart.subType, data,chart);
			break;
		case c_oAscChartType.hbar:
			DrawHBarChart(chartCanvas, chart.subType, data,chart);
			break;
		case c_oAscChartType.area:
			DrawLineChart(chartCanvas, chart.subType, chart.type, data,chart);
			break;
		case c_oAscChartType.pie:
			DrawPieChart(chartCanvas, chart.subType, data[0],chart);
			break;
		case c_oAscChartType.scatter:
			DrawScatterChart(chartCanvas, chart.subType, data,chart);
			break;
		case c_oAscChartType.stock:
			DrawScatterChart(chartCanvas, chart.type, data,chart);
			break;
	}
	
	if(!chart.yAxis.show)
	{
		bar._otherProps._ylabels  = false;
		bar._otherProps._noyaxis = true;
	}
	if(!chart.xAxis.show)
	{
		bar._otherProps._xlabels  = false;
		bar._otherProps._noxaxis = true;
	}
	// Цвета и шрифты
	bar._otherProps._axis_color = 'grey';
	bar._otherProps._background_grid_color = 'graytext';
	bar._otherProps._key_text_size = 10;
	bar._otherProps._key_text_font = 'Arial';
	bar._otherProps._text_font = 'Arial';
	bar._otherProps._text_font_size = 8;
	if('Line' == chart.type || 'Area' == chart.type)
		bar._otherProps._colors = generateColors(data.length, arrBaseColors, true);
	else if(chart.type == 'HBar')
			bar._otherProps._colors = OfficeExcel.array_reverse(generateColors(data[0].length, arrBaseColors, true));
	else
		bar._otherProps._colors = generateColors(data[0].length, arrBaseColors, true);

	//check default title
	if((!chart.yAxis.title || chart.yAxis.title == null || chart.yAxis.title == undefined || chart.yAxis.title == '') && chart.yAxis.bDefaultTitle)
		chart.yAxis.title = defaultYTitle;
	if((!chart.xAxis.title || chart.xAxis.title == null || chart.xAxis.title == undefined || chart.xAxis.title == '') && chart.xAxis.bDefaultTitle)
		chart.xAxis.title = defaultXTitle;
	if((!chart.title || chart.title == null || chart.title == undefined || chart.title == '') && chart.bDefaultTitle)
		chart.title = defaultTitle;
	
	if (chart.yAxis.title)
		bar._chartGutter._left = 35 + 29;
	else
		bar._chartGutter._left = 35;

	if (chart.xAxis.title)
		bar._chartGutter._bottom = 35 + 29;
	else
		bar._chartGutter._bottom = 35;
		
	calcWidthGraph();
	//bar.Draw();

	// Легенда
	if (chart.legend.show && chart.legend.position != '') {
		bar._otherProps._key_position = 'graph';
		bar._otherProps._key = [];
		bar._otherProps._key_halign = chart.legend.position;
		//setKeyPosition(chart);
				
		var legendCnt = (chart.type == "Scatter") ? data.length : data.length;
		if(chart.type == 'Pie' || chart.type == 'Bar' || chart.type == 'HBar')
			legendCnt = data[0].length
		if(chart.type == "Stock")
			legendCnt = 4;
		if(chart.series && chart.series.length != 0 && chart.series[0].Tx)
		{
			for (var j = 0; j < chart.series.length; j++) {
				bar._otherProps._key[j] = chart.series[j].Tx;
			}	
		}
		else
		{
			for (var j = 0; j < legendCnt; j++) {
				bar._otherProps._key[j] = 'Series' + (j + 1);
			}	
		}
			
		
		// без рамки
		bar._otherProps._key_rounded = null;

		if (bar._otherProps._filled != true && bar.type != 'bar' && bar.type != 'hbar' && bar.type != 'pie')
			bar._otherProps._key_color_shape = 'line';
		
		bar._otherProps._key_text_size = 9;
		
		if(chart.type == 'HBar' && chart.subType != 'stacked' && chart.subType != 'stackedPer')
		{
			bar._otherProps._key = OfficeExcel.array_reverse(bar._otherProps._key);
			bar._otherProps._colors = bar._otherProps._colors;
		}
		else if(chart.type == 'HBar')
			bar._otherProps._colors = bar._otherProps._colors;
		
		if((chart.legend.position == 'left' || chart.legend.position == 'right' ))
		{
			var heightKey = bar._otherProps._key.length*23.5;
			if(heightKey > bar.canvas.height - 50)
			{
				var lengthKey = Math.round((bar.canvas.height - 50)/23.5)
				bar._otherProps._key = bar._otherProps._key.slice(0,lengthKey);
			}
			
		}
	}
	else{
		bar._otherProps._key_halign = 'none';
		bar._otherProps._key = [];
	}
	

	// Подписи данных
	if(chart.type != 'Stock')
	{
		if (chart.showValue &&  bar.type == 'pie')
			bar._otherProps._labels = data[0];
		else if (chart.showValue)
			bar._otherProps._labels_above = true;
		else
			bar._otherProps._labels_above = false;
		bar._otherProps._labels_above_size = 10;
	}
	
	// Название
	if (chart.title) {
		bar._chartTitle._text = chart.title;
		bar._chartTitle._vpos = 32;
		bar._chartTitle._hpos = 0.5;
		bar._chartTitle._size = 18;
	}

	if (chart.xAxis.title) {
		var legendTop = 0;
		var widthXtitle =  bar.context.measureText(chart.xAxis.title).width
		if(chart.legend.position == 'bottom')
			legendTop = 30;
		bar._xAxisTitle._text = chart.xAxis.title;
		bar._xAxisTitle._size = 10;
	}

	if (chart.yAxis.title) {
		var widthYtitle =  bar.context.measureText(chart.yAxis.title).width
		bar._yAxisTitle._text = chart.yAxis.title;
		bar._yAxisTitle._align = 'rev';
		var keyLeft = 0;
		if (bar._otherProps._key_halign == 'left')
			keyLeft = 70;
		bar._yAxisTitle._angle = 'null';
		bar._yAxisTitle._size = 10;
	}

	// Основная сетка	
	bar._otherProps._background_grid_hlines = chart.xAxis.grid;
	bar._otherProps._background_grid_vlines = chart.yAxis.grid;

	var axis;
	calcGutter(axis,chart.min,chart.max,chart.ymin,chart.ymax,chart.isSkip,chart.isFormatCell);
	calcAllMargin(chart.isFormatCell,chart.isformatCellScOy,chart.min,chart.max,chart.ymin,chart.ymax);
	calcWidthGraph();
	
	if (chart.xAxis.title)
	{
		bar._xAxisTitle._vpos = bar.canvas.height - 23 - legendTop;
		bar._xAxisTitle._hpos = bar._chartGutter._left + (bar.canvas.width - bar._chartGutter._left - bar._chartGutter._right ) / 2 ;
	}
	
	if (chart.yAxis.title)
	{
		bar._yAxisTitle._vpos = bar._chartGutter._top + (bar.canvas.height - bar._chartGutter._top - bar._chartGutter._bottom) / 2 ;
		bar._yAxisTitle._hpos = 23 + keyLeft;
	}

	bar.Draw(chart.min,chart.max,chart.ymin,chart.ymax,chart.isSkip,chart.isFormatCell,chart.isformatCellScOy);
}

//
function DrawScatterChart(chartCanvas, chartSubType, data, chart) {
	
	var colors = generateColors(data.length * data[0].length, arrBaseColors);
	for (var i = 0; i < data.length; i++) {
		if(typeof(data[i][0]) == 'object')
		{
			for (var j = 0; j < data[i].length; j++) {
				data[i][j].push(colors[i]);
			}
		}
		else
			data[i].push(colors[i]);
	}
		
	var original_data = undefined;
	
	if(chartSubType == 'Stock')
	{
		//изменяем массив
		var newData = [];
		for (var i = 0; i < data.length; i++) {
			newData[i] = [];
			newData[i][0] = 0.5 + i*1;
			newData[i][1] = [];
			if(data[i].length < 4)
			{
				newData[i][1][0] = 0;
				newData[i][1][1] = 0;
				newData[i][1][2] = 0;
				newData[i][1][3] = 0;
				newData[i][1][4] = 0;
			}
			else
			{
				if(data[i][1] == undefined || isNaN(parseFloat(data[i][1])))
					newData[i][1][0] = 0;
				else
					newData[i][1][0] = data[i][1];
				if(data[i][0] == undefined || isNaN(parseFloat(data[i][0])))
					newData[i][1][1] = 0;
				else
					newData[i][1][1] = data[i][0];
				if(data[i][3] == undefined || isNaN(parseFloat(data[i][3])))
					newData[i][1][2] = 0;
				else
					newData[i][1][2] = data[i][3];
				if(data[i][3] == undefined || isNaN(parseFloat(data[i][3])))
					newData[i][1][3] = 0;
				else
					newData[i][1][3] = data[i][3];
				if(data[i][2] == undefined || isNaN(parseFloat(data[i][2])))
					newData[i][1][4] = 0;
				else
					newData[i][1][4] = data[i][2];
			}
			
			newData[i][1][5] = colors[0];
			newData[i][1][6] = colors[1];
			newData[i][2] = 'black';
		}
		data = newData;
	}
	
	bar = new OfficeExcel.Scatter(chartCanvas, data);
	if(chartSubType == 'Stock')
	{
		bar._otherProps._type = 'burse2';
		var countGraph = [];
		var keyColors = [];
		for (var j=0; j<data.length; j++) {
			countGraph[j] = (j+1);
			keyColors[j] = 'white';
		}
		bar._otherProps._xscale = countGraph;
		bar._otherProps._labels = countGraph;
		bar._otherProps._boxplot_width = 0.4;
		bar._otherProps._boxplot_capped = false;
		bar._otherProps._xmax = countGraph.length;
		bar._otherProps._key_colors = keyColors;
	}
	
	bar._chartGutter._left = 45;
	//bar._otherProps._background_grid_autofit_numvlines = data.length;
	//addOptions('chart.gutter.right',70);
	bar._chartGutter._right = 90;
	//addOptions('chart.gutter.top',50);
	bar._chartGutter._top = 13;
	//addOptions('chart.gutter.bottom',50);
	bar._chartGutter._bottom = 30;
	//для соединения линий
	bar._otherProps._line = true;
	bar._otherProps._linewidth = 2;
	bar._otherProps._background_grid_color = 'graytext';
	bar._otherProps._background_barcolor1 = 'white';
	bar._otherProps._background_barcolor2 = 'white';
	bar._otherProps._colors = colors;
	//цвет непосредственно линии
	bar._otherProps._line_colors = colors;
	bar._otherProps._linewidth = 3;
	bar._otherProps._ylabels_count = 'auto';
	//bar._otherProps._xmax = 360;
	//bar._otherProps._ymax = 1;
	bar._otherProps._scale_decimals = 1;
	bar._otherProps._xscale_decimals = 0;
	bar._otherProps._tickmarks = 'diamond';
	bar._otherProps._ticksize = 10;
	bar._otherProps._tickmarks_dot_color = 'steelblue';
	bar._otherProps._xscale = 'true';
	bar._otherProps._gutter_left = 50;
	bar._otherProps._key_text_size = 10;
	bar._otherProps._text_font = 'Arial';
	bar._otherProps._axis_color = 'grey';
	//для биржевой диаграммы
	if (original_data != undefined) {
		bar._otherProps._type = 'burse2';
		var countGraph = [];
		var keyColors = [];
		for (var j = 0; j < data.length; j++) {
			countGraph[j] = (j + 1);
			keyColors[j] = 'white';
			
		}
		bar._otherProps._xscale = countGraph;
		bar._otherProps._labels = countGraph;
		bar._otherProps._boxplot_width = 0.4;
		bar._otherProps._boxplot_capped = false;
		bar._otherProps._xmax = countGraph.length;
		bar._otherProps._key_colors = keyColors;
	}

	calcGutter(undefined,chart.min,chart.max,chart.ymin,chart.ymax,chart.isSkip,chart.isFormatCell);
	//для того, чтобы не строить рамку вокруг легенды
	bar._otherProps._key_rounded = null;
	if (bar._otherProps._filled != true)
		bar._otherProps._key_color_shape = 'line';
}

function DrawPieChart(chartCanvas, chartSubType, data, chart) {

	bar = new OfficeExcel.Pie(chartCanvas, data);

	//для кольцевой диаграммы
	//bar._otherProps._variant = 'donut';

	//для разрезанной кольцевой или разрезанной круговой
	//bar._otherProps._exploded = 15;

	bar._otherProps._ylabels_count = 'auto';
	bar._otherProps._colors = ['steelblue', 'IndianRed', 'Silver'];
	bar._chartGutter._left = 45;
	bar._chartGutter._right = 90;;
	bar._chartGutter._top = 13;
	bar._chartGutter._bottom = 30;
	bar._otherProps._key_rounded = null;

	bar.Draw(chart.min,chart.max,chart.ymin,chart.ymax,chart.isSkip,chart.isFormatCell);
}

function DrawLineChart(chartCanvas, chartType, chartSubType, data, chart) {

	var copyData = $.extend(true, [], data);

	bar = new OfficeExcel.Line(chartCanvas, data);
	bar.firstData = copyData;
	bar._otherProps._autoGrouping = chartType;
	
	if (chartSubType == c_oAscChartType.area)
		bar._otherProps._filled = true;

	//для нормированных графиков с накоплением и без него.
	//bar._otherProps._autoGrouping = 'stackedPer';
	if (bar._otherProps._autoGrouping == 'stacked') {
		for (var j = 0; j < (data.length - 1); j++) {
			for (var i = 0; i < data[j].length; i++) {
				data[j + 1][i] = data[j + 1][i] + data[j][i]
			}
		}
		bar.original_data = data;
	}
	else if (bar._otherProps._autoGrouping == 'stackedPer') {
		for (var j = 0; j < (data.length - 1); j++) {
			for (var i = 0; i < data[j].length; i++) {
				data[j + 1][i] = data[j + 1][i] + data[j][i]
			}
		}
		var tempData = data;
		var firstData = copyData;
		var summValue = [];
		for (var j = 0; j < (firstData[0].length); j++) {
			summValue[j] = 0;
			for (var i = 0; i < firstData.length; i++) {
				summValue[j] += Math.abs(firstData[i][j])
			}
		}

		for (var j = 0; j < (tempData[0].length); j++) {
			for (var i = 0; i < tempData.length; i++) {
				if(summValue[j] == 0)
					tempData[i][j] = 0;
				else
					tempData[i][j] = (100 * tempData[i][j]) / (summValue[j]);
			}
		}
		bar.data = tempData;
		bar.original_data = tempData;
	}


	bar.newData = data;
	bar.firstData = copyData;
	bar._otherProps._ylabels_count = 'auto';

	//для поверхностной диаграммы выставляем свойство
	//bar._otherProps._filled = true;
	bar._otherProps._filled_accumulative = false;


	if (bar._otherProps._filled != true) {
		bar._chartGutter._left = 35;
		bar._chartGutter._bottom = 35;
	}

	bar._otherProps._background_grid_autofit_numvlines = data.length;
	bar._otherProps._background_grid_color = 'graytext';
	bar._otherProps._background_barcolor1 = 'white';
	bar._otherProps._background_barcolor2 = 'white';
	//bar._otherProps._fillstyle = [['steelblue'],['red'],['black'],['grey']];
	bar._otherProps._colors = ['steelblue', 'IndianRed', 'green', 'grey'];
	bar._otherProps._linewidth = 3;

	//bar._otherProps._noxaxis = true;
	//bar._otherProps._noyaxis = true;
	//для подписей данных
	// bar._otherProps._labels_above = true;

	//для графика с маркерами
	//bar._otherProps._tickmarks = ['filledendsquare','filledsquare','filledarrow'];

	//bar._otherProps._fillstyle = '#fcc';
	//bar._otherProps._numxticks = data.length;
	//bar._otherProps._background_grid_autofit_numhlines = 10;
	//bar._otherProps._numyticks = 10;
	//bar._otherProps._ylabels_count = 10
	//bar._otherProps._background_grid_autofit_numhlines = 
	var tempMas = [];
	if ('object' == typeof data[0]) {
		var testMas = [];
		for (var j = 0; j < data.length; j++) {
			testMas[j] = data[j].length;
		}
		var maxNumOx = Math.max.apply({}, testMas);
		for (var i = 0; i < maxNumOx; i++) {
			tempMas[i] = i + 1;
		}
		if (bar._otherProps._filled != true)
			bar._otherProps._background_grid_autofit_numvlines = tempMas.length;
		else
			bar._otherProps._background_grid_autofit_numvlines = tempMas.length - 1;
	}
	else {
		for (var i = 0; i <= data.length; i++) {
			tempMas[i] = i;
		}
	}

	bar._otherProps._labels = tempMas;

	//отключаем вертикальную сетку
	//bar._otherProps._background_grid_vlines = false;
	//bar._otherProps._background_grid_border = false;
	//bar._otherProps._ymax = 60;
	//bar._otherProps._ymin = 50;
	if (bar._otherProps._autoGrouping == 'stackedPer')
		bar._otherProps._units_post = '%';
	bar.Draw(chart.min,chart.max,chart.ymin,chart.ymax,chart.isSkip,chart.isFormatCell);
	if (bar._otherProps._filled != true)
		bar._otherProps._hmargin = bar._otherProps._background_grid_vsize / 2;
	else
		bar._otherProps._hmargin = 0;
}

function DrawBarChart(chartCanvas, chartSubType, data, chart) {
	
	bar = new OfficeExcel.Bar(chartCanvas, data);	
	//меняем входные данные для нормированной диаграммы
	bar._otherProps._autoGrouping = chartSubType;
	//с накоплениями
	if (bar._otherProps._autoGrouping == 'stacked')
		bar._otherProps._type = 'accumulative';
	if (bar._otherProps._autoGrouping == 'stackedPer') {
		for (var j = 0; j < (data.length); j++) {
			var maxVal = 0;
			var minVal = 0;

			var summ = 0;
			for (var i = 0; i < data[j].length; i++) {
				summ += Math.abs(data[j][i]);
			}
			for (var i = 0; i < data[j].length; i++) {
				data[j][i] = (data[j][i] * 100) / summ;
				if(isNaN(data[j][i]))
					data[j][i] = 0;
			}
		}
	}

	bar._otherProps._ylabels_count = 'auto';
	bar._otherProps._variant = 'bar';
	bar._chartGutter._left = 35;
	bar._chartGutter._bottom = 35;
	bar._otherProps._background_grid_autofit_numvlines = data.length;
	bar._otherProps._background_grid_color = 'graytext';
	bar._otherProps._background_barcolor1 = 'white';
	bar._otherProps._background_barcolor2 = 'white';
	
	//bar._otherProps._background_grid_autofit_numhlines = 6;
	//bar._otherProps._linewidth = 10;
	//bar._otherProps._key = ['ряд1'];
	var tempMas = [];
	for (var i = 0; i < data.length; i++) {
		tempMas[i] = i + 1;
	}
	bar._otherProps._labels = tempMas;
	bar.Draw(chart.min,chart.max,chart.ymin,chart.ymax,chart.isSkip,chart.isFormatCell);

	//отступы меняют ширину
	if (bar._otherProps._autoGrouping == 'stacked' || bar._otherProps._autoGrouping == 'stackedPer') {
		if (bar._otherProps._autoGrouping == 'stackedPer')
			bar._otherProps._units_post = '%';
		bar._otherProps._hmargin = (((bar.canvas.width - (bar._chartGutter._right + bar._chartGutter._left)) * 0.3) / bar.data.length);
	}
	else
		bar._otherProps._hmargin = (((bar.canvas.width - (bar._chartGutter._right + bar._chartGutter._left)) * 0.3) / bar.data.length) / bar.data[0].length;
}

function DrawHBarChart(chartCanvas, chartSubType, data, chart) {
	
	if(chartSubType != 'stacked' && chartSubType != 'stackedPer')
	{
		//меняем данные в обратный порядок
		for (var j = 0; j < (data.length); j++) {
			data[j] = OfficeExcel.array_reverse(data[j]);
		}
	}
	data = OfficeExcel.array_reverse(data);
	
	bar = new OfficeExcel.HBar(chartCanvas, data);
	bar._otherProps._autoGrouping = chartSubType;
	var originalData = $.extend(true, [], data);


	if (bar._otherProps._autoGrouping == 'stacked') {
		for (var j = 0; j < (data.length); j++) {
			for (var i = 0; i < (data[j].length); i++) {
				data[j][i] = findPrevValue(originalData, j, i)
			}
			data[j] = OfficeExcel.array_reverse(data[j]);
		}
		bar.original_data = data;
	}
	else if (bar._otherProps._autoGrouping == 'stackedPer') {
		var sumMax = [];
		//находим суммы для нормированной диаграммы
		for (var j = 0; j < (data.length); j++) {
			sumMax[j] = 0;
			for (var i = 0; i < data[j].length; i++) {
				sumMax[j] += Math.abs(data[j][i]);
			}
		}


		for (var j = 0; j < (data.length); j++) {
			for (var i = 0; i < (data[j].length); i++) {
				data[j][i] = findPrevValue(originalData, j, i)
			}
		}

		var tempData = data;
		var firstData = data;

		for (var j = 0; j < (data.length); j++) {
			for (var i = 0; i < (data[j].length); i++) {
				tempData[j][i] = (100 * tempData[j][i]) / (sumMax[j]);
				if(isNaN(tempData[j][i]))
					tempData[j][i] = 0;
			}
			tempData[j] = OfficeExcel.array_reverse(tempData[j]);
		}
		bar.data = tempData;
		bar.original_data = tempData;
	}

	//bar._otherProps._labels = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
	bar._otherProps._ylabels_count = 'auto';
	bar._chartGutter._left = 35;
	bar._chartGutter._bottom = 35;
	bar._otherProps._background_grid_autofit_numvlines = data.length;
	bar._otherProps._background_grid_color = 'graytext';
	bar._otherProps._background_barcolor1 = 'white';
	bar._otherProps._background_barcolor2 = 'white';
	bar._otherProps._colors = ['steelblue', 'IndianRed', 'green'];
	var tempMas = [];
	for (var i = 0; i < data.length; i++) {
		tempMas[data.length - i - 1] = i + 1;
	}
	bar._otherProps._labels = tempMas;
	bar._otherProps._background_grid_autofit_numhlines = data.length;
	bar._otherProps._numyticks = data.length;
	bar._chartGutter._left = 45;
	//addOptions('chart.gutter.right',70);
	bar._chartGutter._right = 90;
	//addOptions('chart.gutter.top',50);
	bar._chartGutter._top = 13;
	//addOptions('chart.gutter.bottom',50);
	bar._chartGutter._bottom = 30;
	//аналогично для измения высоты(ширины)
	if (bar._otherProps._autoGrouping == 'stacked' || bar._otherProps._autoGrouping == 'stackedPer') {
		if (bar._otherProps._autoGrouping == 'stackedPer')
			bar._otherProps._units_post = '%';
		bar._otherProps._vmargin = (((bar.canvas.height - (bar._chartGutter._top + bar._chartGutter._bottom)) * 0.3) / bar.data.length) / 2;
	}
	else
		bar._otherProps._vmargin = (((bar.canvas.height - (bar._chartGutter._top + bar._chartGutter._bottom)) * 0.3) / bar.data.length) / bar.data[0].length;

	bar._otherProps._key_text_size = 10;
	bar._otherProps._text_font = 'Arial';
	//для того, чтобы не строить рамку вокруг легенды
	bar._otherProps._key_rounded = null;
	bar.Draw(chart.min,chart.max,chart.ymin,chart.ymax,chart.isSkip,chart.isFormatCell);

	bar._otherProps._background_grid_autofit_numvlines = bar.scale.length;
	bar._otherProps._background_grid_autofit_numhlines = data.length;

	//отключаем горизонтальную сетку
	//bar._otherProps._background_grid_hlines = false;
	//bar._otherProps._background_grid_border = false;
}

function findPrevValue(originalData, num, max) {
	var summ = 0;
	for (var i = 0; i <= max; i++) {
		if (originalData[num][max] >= 0) {
			if (originalData[num][i] >= 0)
				summ += originalData[num][i];
		}

		else {
			if (originalData[num][i] < 0)
				summ += originalData[num][i];
		}
	}
	return summ;
}