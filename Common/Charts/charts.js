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
		if (chart.worksheet && !OfficeExcel.drawingCtxCharts)//выставление контекста для отрисовки
			OfficeExcel.drawingCtxCharts = chart.worksheet.getDrawingContextCharts();
		else if(window["editor"] && !OfficeExcel.drawingCtxCharts)
			OfficeExcel.drawingCtxCharts = new CDrawingContextWord();
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
				chart.xAxis.bShow = chart.xAxis.bGrid = false;
				chart.yAxis.bShow = chart.yAxis.bGrid = false;
				chart.legend.bShow = false;
				
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
		
		//var endTime = new Date();
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
	var scale = bar.scale
	if(undefined == scale)
		scale = [max, min]
	if ('scatter' == bar.type) {
		bar.scale = OfficeExcel.getScale(false, bar,min,max,ymin,ymax);
		bar.xScale = OfficeExcel.getScale(true, bar,min,max,ymin,ymax);
	}
}
//ширины самих линий графика
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

function calcAllMargin(isFormatCell,isformatCellScOy,minX,maxX,minY,maxY, chart) {
	var scale = 1;
	if(OfficeExcel && OfficeExcel.drawingCtxCharts)
		scale = OfficeExcel.drawingCtxCharts.scaleFactor;
	var context = OfficeExcel.drawingCtxCharts;
	
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
	bar.context.font = '13px Arial';
	
	//для определении ширины текста(подписи оси OY), необходимо получить scale
	var tempScale;
	if(!bar.scale && bar.type != "pie")
	{
		if(bar.type == 'hbar' && bar._otherProps._autoGrouping == 'stackedPer')
		{
			for (i=0; i<bar.data.length; ++i) {
				if (typeof(bar.data[i]) == 'object') {
					var value = Number(OfficeExcel.array_max(bar.data[i], true));
				} else {
					var value = Number(Math.abs(bar.data[i]));
				}

				bar.max = Math.max(Math.abs(bar.max), Math.abs(value));
			}

			tempScale = OfficeExcel.getScale(bar.max);
		}
		else
			tempScale = OfficeExcel.getScale(Math.abs(parseFloat(chart.max)),bar,chart.min,chart.max);
		
		if(bar.type == 'bar')
			bar.min = bar._otherProps._ymin;
		else if(bar.type == 'hbar')
		{
			bar._otherProps._background_grid_autofit_numvlines = tempScale.length;
			bar._otherProps._background_grid_autofit_numhlines = bar.data.length;
		}
	}
	else
		tempScale = bar.scale;

	if(tempScale != undefined && tempScale[tempScale.length -1] != undefined && bar._otherProps._ylabels != false)
	{
		//left = bar.context.measureText(bar.scale[bar.scale.length -1]).width;
		var tempArr = [];
		for (var j = 0; j < tempScale.length; j++) {
			if(bar.type == 'hbar')
				tempArr[j] = bar.context.measureText(tempScale[j]).width
			else if(bar.type == 'scatter')
				tempArr[j] = bar.context.measureText(OfficeExcel.numToFormatText(tempScale[j],isformatCellScOy)).width
			else
				tempArr[j] = bar.context.measureText(OfficeExcel.numToFormatText(tempScale[j],isFormatCell)).width
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
	}
	else
	{
		if (bar._yAxisTitle._align == 'rev')
		{
			var font = getFontProperties("yTitle");
			var axisTitleProp = getMaxPropertiesText(context,font, bar._yAxisTitle._text);
			var heigthText = (context.getHeightText()/0.75);
			//прибавляем высоту текста названия + стандартный маргин 
			left += heigthText + 12;
		}
		else if (bar._yAxisTitle._align == 'hor')
			left += 95;
		else if (bar._yAxisTitle._align == 'ver')
			left += 0;

		var right = 0;
		var top = 0;
		var bottom = 0;
		if (bar._xAxisTitle._text != '')
		{
			var font = getFontProperties("xTitle");
			var axisTitleProp = getMaxPropertiesText(context,font, bar._xAxisTitle._text);
			var heigthText = (context.getHeightText()/0.75);
			//прибавляем высоту текста названия + стандартный маргин 
			bottom += heigthText + 14;
		}
		if ((min >= 0 || bar.type == 'hbar') &&  bar._otherProps._xlabels)
		{
			bottom +=20;
		}
		if(bar._xAxisTitle._text == '' && (min >= 0 || bar.type == 'hbar') &&  bar._otherProps._xlabels)
			bottom += 7;
	}
	
	//+высота названия диаграммы
	if (bar._chartTitle._text != null && bar._chartTitle._text != '')
	{
		var font = getFontProperties("title");
		var axisTitleProp = getMaxPropertiesText(context,font, bar._chartTitle._text);
		var heigthText = (context.getHeightText()/0.75);
		//прибавляем высоту текста названия + стандартный маргин 
		top += heigthText + 7;
	}
	//+ высота легенды
	if(bar._otherProps._key_halign == 'top' || bar._otherProps._key_halign == 'bottom')
	{
		var font = getFontProperties("key");
		var props = getMaxPropertiesText(context,font,bar._otherProps._key);
		var heigthTextKey = (context.getHeightText()/0.75);
		var kF = 1;
		if(bar.type == 'pie')
			kF = 2;
		if(bar._otherProps._key_halign == 'top')
			top += (heigthTextKey + 7)*kF;
		else
			bottom += (heigthTextKey + 7)*kF;
	}
	//+ ширина легенды
	if (bar._otherProps._key_halign == 'left' || bar._otherProps._key_halign == 'right')
	{
		var widthLine = 28;
		//находим ширину текста легенды(то есть её максимального элемента), в дальнейшем будем возвращать ширину автофигуры
		var font = getFontProperties("key");
		var widthText = getMaxPropertiesText(context,font,bar._otherProps._key);
		var widthKey = widthText.width/scale + 2 + widthLine;
		//в MSExcel справа от легенды всегда остаётся такой маргин 
		if(bar._otherProps._key_halign == 'left')
			left += widthKey + 7;
		else
			right += widthKey + 7;
	}
	
	if(bottom == 0)
		bottom = standartMargin;
	var standartMarginTop = standartMargin;
	if(bar.type == 'pie' && bar._otherProps._key_halign == 'top')
		standartMarginTop = 0;
	bar._chartGutter._left = (left)*scale + standartMargin;
	bar._chartGutter._right = (standartMargin + right)*scale;
	bar._chartGutter._top = (standartMarginTop + top)*scale;
	bar._chartGutter._bottom = (bottom)*scale;
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
	var arrFormatAdobeLabels = [];
	if(chart.series && chart.series.length !=0 && api_sheet)
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
		var skipSeries = [];
		
		var isEn = false;
		var isEnY = false;
		
		if (chart.type == 'Scatter' && series[0].xVal.Formula != null)//в случае точечной диаграммы отдельная обработка
		{
			var isEnY = false
			for(l = 0; l < series.length; ++l)
			{
				var n = 0;
				
				arrValues[l] = [];
				arrFormatAdobeLabels[l] = [];
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
						arrFormatAdobeLabels[l][n] = [];
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
						
						arrFormatAdobeLabels[l][n][0] = cell.getNumFormatStr();
						arrFormatAdobeLabels[l][n][1] = cellY.getNumFormatStr();
						
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
						arrFormatAdobeLabels[l][n] = [];
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
						
						arrFormatAdobeLabels[l][n][0] = cell.getNumFormatStr();
						arrFormatAdobeLabels[l][n][1] = cellY.getNumFormatStr();
						
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
			var numSeries = 0;
			for(l = 0; l < series.length; ++l)
			{
				var formula = formulaToRange(series[l].Val.Formula,ws);
				var firstCol = formula.first.col;
				var firstRow = formula.first.row;
				var lastCol = formula.last.col;
				var lastRow = formula.last.row;
				skipSeries[l] = true;
				var isRow = false;
				if(firstCol == lastCol)
					isRow  = true;
				if(chart.worksheet && chart.worksheet.model._getRow && chart.worksheet.model._getRow(firstRow - 1).hd == true && !isRow)
				{
					continue;
				}
				else if(chart.worksheet && chart.worksheet.model._getCol && chart.worksheet.model._getCol(firstCol - 1).hd == true && isRow)
				{
					continue;
				}
				skipSeries[l] = false;
				arrValues[numSeries] = [];
				arrFormatAdobeLabels[numSeries] = [];
				isSkip[numSeries] = true;
				
				if(!isRow)//по строкам или по столбцам
				{
					var row = firstRow;
					var n = 0;
					for(col = firstCol; col <= lastCol; ++col)
					{
						if(chart.worksheet && chart.worksheet.model._getCol && chart.worksheet.model._getCol(col - 1).hd == true)
						{
							continue;
						}
						var cell = ws.getCell(new CellAddress(row - 1, col - 1, 0));
						
						if(numSeries == 0 && col == firstCol && chart.subType != 'stackedPer' && chart.type != 'Stock')
						{
							formatCell = cell.getNumFormatStr();
							isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
						}
						else if(chart.type == 'Stock' && numSeries == 0 && col == firstCol)
						{
							formatCellScOy = cell.getNumFormatStr();
							isDateTimeFormat = cell.getNumFormat().isDateTimeFormat();
						}
						
						if(chart.type == 'Scatter')
						{
							if(numSeries == 1 && col == firstCol && chart.subType != 'stackedPer' && chart.type != 'Stock')
								formatCellScOy = cell.getNumFormatStr();
						}
						
						formatAdobeLabel = cell.getNumFormatStr();
						
						var orValue = cell.getValue();
						if('' != orValue)
							isSkip[numSeries] = false;
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
							arrValues[numSeries][n] = Math.abs(value);
						else
							arrValues[numSeries][n] = value;
						arrFormatAdobeLabels[numSeries][n] = formatAdobeLabel;
						n++;
					}
				}
				else
				{
					var col = firstCol;
					var n = 0;
					for(row = firstRow; row <= lastRow; ++row)
					{
						if(chart.worksheet && chart.worksheet.model._getRow && chart.worksheet.model._getRow(row - 1).hd == true)
						{
							continue;
						}
						var cell = ws.getCell(new CellAddress(row - 1, col - 1, 0));
						
						if(numSeries == 0 && row == firstRow && chart.subType != 'stackedPer' && chart.type != 'Stock')
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
							if(numSeries == 1 && row == firstRow && chart.subType != 'stackedPer' && chart.type != 'Stock')
								formatCellScOy = cell.getNumFormatStr();
						}
						
						var orValue = cell.getValue();
						if('' != orValue)
							isSkip[numSeries] = false;

						formatAdobeLabel = cell.getNumFormatStr();
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
							arrValues[numSeries][n] = Math.abs(value);
						else
							arrValues[numSeries][n] = value;
						arrFormatAdobeLabels[numSeries][n] = formatAdobeLabel;
						n++;
					}
				}
				numSeries++;
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
			arrFormatAdobeLabels[n] = [];
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
				var formatAdobeLabel = 'General';
				if(data[row][col].numFormatStr)
					formatAdobeLabel = data[row][col].numFormatStr;
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
				arrFormatAdobeLabels[n][k] = formatAdobeLabel;
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
	
	if(isSeries)
	{
		var arrFormatAdobeLabelsRev = arrFormatAdobeLabels;
		var arrValuesRev = arrValues;
	}
		
	isEn = false;
	if(chart.type == 'Scatter' && !newArr)
	{
		min = 0;
		max = 0;
		minY = 0;
		maxY = 0;
		var isEnY = false
		var scatterArr = arrValuesRev;
		var scatterArrLabels = arrFormatAdobeLabelsRev;
		if(!scatterArr)
		{
			scatterArr = arrReverse(arrValues);
			scatterArrLabels = arrReverse(arrFormatAdobeLabels);
		}
		if (chart.range.rows)
		{
			scatterArr = arrValues;
			scatterArrLabels = arrFormatAdobeLabels;
		}
			
		var newArr = [];
		var newAdobeLabels = [];
		if(isDateTimeFormat)
		{
			formatCellScOy = formatCell;
			formatCell = 'General';
			
			for (i = 0; i < scatterArr.length; ++i) {
				newArr[i] = [];
				newAdobeLabels[i] = [];
				for (j = 0; j < scatterArr[i].length; ++j) {
					newArr[i][j] = [];
					newAdobeLabels[i][j] = [];
					newArr[i][j][0] = j+1;
					newArr[i][j][1] = scatterArr[i][j];
					newAdobeLabels[i][j][1] = scatterArrLabels[i][j];
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
			newAdobeLabels[0] = [];
			for (j = 0; j < scatterArr[0].length; ++j) {
				newArr[0][j] = [];
				newAdobeLabels[0][j] = [];
				newArr[0][j][0] = j+1;
				newArr[0][j][1] = scatterArr[0][j];
				newAdobeLabels[0][j][1] = scatterArrLabels[0][j];
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
				newArr[i-1] = [];
				newAdobeLabels[i-1] = [];
				for (j = 0; j < scatterArr[i].length; ++j) {
					newArr[i-1][j] = [];
					newAdobeLabels[i-1][j] = [];
					newArr[i-1][j][0] = scatterArr[0][j];
					newArr[i-1][j][1] = scatterArr[i][j];
					newAdobeLabels[i-1][j][0] = scatterArrLabels[0][j];
					newAdobeLabels[i-1][j][1] = scatterArrLabels[i][j];
					
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
		arrValuesRev = arrReverse(arrValues);
	
	if(!arrFormatAdobeLabelsRev)
		arrFormatAdobeLabelsRev = arrReverse(arrFormatAdobeLabels);
		
	//if ((bbox.c2 - bbox.c1) < bbox.r2 - bbox.r1)
	chart.isFormatCell = formatCell;
	chart.isformatCellScOy = formatCellScOy;
	chart.min = min;
	chart.max = max;
	if(skipSeries)
		chart.skipSeries = skipSeries;
		
	if(newArr != undefined)
	{
		chart.arrFormatAdobeLabels = newAdobeLabels;
		drawChart(chart, newArr, width, height);
	}	
	else
	{
		chart.isSkip = isSkip;
		if(isSeries)
		{
			if(chart.type == 'HBar' || chart.type == 'Bar' || chart.type == 'Stock' || chart.type == 'Pie')
			{
				//надо перевернуть массив
				arrValuesRev = arrReverse(arrValues);
				chart.arrFormatAdobeLabels = arrReverse(arrFormatAdobeLabels);
				drawChart(chart, arrValuesRev, width, height);
			}
			else
			{
				chart.arrFormatAdobeLabels = arrFormatAdobeLabels;
				drawChart(chart, arrValues, width, height);
			}
		}
		else
		{
			if (chart.range.rows)
			{
				if(chart.type == 'HBar' || chart.type == 'Bar' || chart.type == 'Stock')
				{
					chart.isSkip = isSkip;
					chart.arrFormatAdobeLabels = arrFormatAdobeLabelsRev;
					drawChart(chart, arrValuesRev, width, height);
				}
				else
				{
					chart.isSkip = isSkip;
					chart.arrFormatAdobeLabels = arrFormatAdobeLabels;
					drawChart(chart, arrValues, width, height);
				}
			}
			else
			{
				if(chart.type == 'HBar' || chart.type == 'Bar' || chart.type == 'Stock')
				{
					chart.isSkip = isSkip;
					chart.arrFormatAdobeLabels = arrFormatAdobeLabels;
					drawChart(chart, arrValues, width, height);
				}
				else
				{
					//chart.isSkip = isSkipRev;
					chart.isSkip = isSkip;
					chart.arrFormatAdobeLabels = arrFormatAdobeLabelsRev;
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
	if(OfficeExcel.drawingCtxCharts)
		OfficeExcel.drawingCtxCharts.setCanvas(chartCanvas);
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
	
	if(!chart.yAxis.bShow)
	{
		bar._otherProps._ylabels  = false;
		bar._otherProps._noyaxis = true;
	}
	if(!chart.xAxis.bShow)
	{
		bar._otherProps._xlabels  = false;
		bar._otherProps._noxaxis = true;
	}
	// Цвета и шрифты
	bar._otherProps._axis_color = 'grey';
	bar._otherProps._background_grid_color = 'graytext';

	
	var lengthOfSeries;
	if(chart.series && chart.series.length != 0 && window["Asc"]["editor"])
	{
			lengthOfSeries = chart.series.length;
	}
	else
	{
		if('Line' == chart.type || 'Area' == chart.type)
			lengthOfSeries = data.length;
		else if(chart.type == 'HBar')
			lengthOfSeries = data[0].length;
		else
			lengthOfSeries = data[0].length;
	}
	bar._otherProps._colors = generateColors(lengthOfSeries, arrBaseColors, true);

	//check default title
	if((!chart.yAxis.title || chart.yAxis.title == null || chart.yAxis.title == undefined || chart.yAxis.title == '') && chart.yAxis.bDefaultTitle)
		chart.yAxis.title = defaultYTitle;
	if((!chart.xAxis.title || chart.xAxis.title == null || chart.xAxis.title == undefined || chart.xAxis.title == '') && chart.xAxis.bDefaultTitle)
		chart.xAxis.title = defaultXTitle;
	if((!chart.header.title || chart.header.title == null || chart.header.title == undefined || chart.header.title == '') && chart.header.bDefaultTitle)
		chart.header.title = defaultTitle;
		
	// Легенда
	if (chart.legend.bShow && chart.legend.position != '') {
		bar._otherProps._key_position = 'graph';
		bar._otherProps._key = [];
		bar._otherProps._key_halign = chart.legend.position;
				
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
		
		
		if(chart.type == 'HBar' && chart.subType != 'stacked' && chart.subType != 'stackedPer')
		{
			bar._otherProps._key = OfficeExcel.array_reverse(bar._otherProps._key);
			bar._otherProps._colors = bar._otherProps._colors;
		}
		else if(chart.type == 'HBar')
			bar._otherProps._colors = bar._otherProps._colors;
			
		if(chart.type == 'HBar')
			bar._otherProps._colors = OfficeExcel.array_reverse(bar._otherProps._colors);
		
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
	//в случае наличия скрытых строчек или столбов(в итоге скрытых серий)
	if(chart.skipSeries)
	{
		var skipSeries = chart.skipSeries;
		if(chart.type == 'Scatter' && chart.series && chart.series[0].xVal.Formula == null)
		{
			bar._otherProps._key.splice(bar._otherProps._key.length - 1, 1);
			bar._otherProps._colors.splice(bar._otherProps._colors.length - 1, 1);
			skipSeries.splice(0, 1);
		}
		for(var i = 0; i < skipSeries.length; i++)
		{
			if(skipSeries[i])
			{
				bar._otherProps._key.splice(i, 1);
				bar._otherProps._colors.splice(i, 1);
				skipSeries.splice(i, 1);
				i--;
			}
		}
	}
	
	// Подписи данных
	if(chart.type != 'Stock')
	{
		if (chart.bShowValue &&  bar.type == 'pie')
			bar._otherProps._labels = data[0];
		else if (chart.bShowValue)
			bar._otherProps._labels_above = true;
		else
			bar._otherProps._labels_above = false;
	}
	
	// Название
	if (chart.header.title) {
		bar._chartTitle._text = chart.header.title;
		bar._chartTitle._vpos = 32;
		bar._chartTitle._hpos = 0.5;
	}

	if (chart.xAxis.title) {
		var legendTop = 0;
		var widthXtitle =  bar.context.measureText(chart.xAxis.title).width;
		if(chart.legend.position == 'bottom')
			legendTop = 30;
		bar._xAxisTitle._text = chart.xAxis.title;
	}

	if (chart.yAxis.title) {
		var widthYtitle =  bar.context.measureText(chart.yAxis.title).width;
		bar._yAxisTitle._text = chart.yAxis.title;
		bar._yAxisTitle._align = 'rev';
		var keyLeft = 0;
		if (bar._otherProps._key_halign == 'left')
			keyLeft = 70;
		bar._yAxisTitle._angle = 'null';
	}

	// Основная сетка	
	bar._otherProps._background_grid_hlines = chart.xAxis.bGrid;
	bar._otherProps._background_grid_vlines = chart.yAxis.bGrid;

	var axis;
	calcGutter(axis,chart.min,chart.max,chart.ymin,chart.ymax,chart.isSkip,chart.isFormatCell);
	
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
	bar.arrFormatAdobeLabels = chart.arrFormatAdobeLabels;
	//выставляем параметры текса
	setFontChart(chart);
	calcAllMargin(chart.isFormatCell,chart.isformatCellScOy,chart.min,chart.max,chart.ymin,chart.ymax, chart);
	calcWidthGraph();	
	bar.Draw(chart.min,chart.max,chart.ymin,chart.ymax,chart.isSkip,chart.isFormatCell,chart.isformatCellScOy);
}

//-----------------------------------------------------------------------------------
// Chart types
//-----------------------------------------------------------------------------------

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
	bar._chartGutter._right = 90;
	bar._chartGutter._top = 13;
	bar._chartGutter._bottom = 30;
	//для соединения линий
	bar._otherProps._area_border = chart.bShowBorder;
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
	bar._otherProps._scale_decimals = 1;
	bar._otherProps._xscale_decimals = 0;
	bar._otherProps._tickmarks = 'diamond';
	bar._otherProps._ticksize = 10;
	bar._otherProps._tickmarks_dot_color = 'steelblue';
	bar._otherProps._xscale = 'true';
	bar._otherProps._gutter_left = 50;
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
	bar._otherProps._area_border = chart.bShowBorder;
	bar._otherProps._ylabels_count = 'auto';
	bar._otherProps._colors = ['steelblue', 'IndianRed', 'Silver'];
	bar._chartGutter._left = 45;
	bar._chartGutter._right = 90;;
	bar._chartGutter._top = 13;
	bar._chartGutter._bottom = 30;
	bar._otherProps._key_rounded = null;
}

function DrawLineChart(chartCanvas, chartType, chartSubType, data, chart) {

	var copyData = $.extend(true, [], data);
	bar = new OfficeExcel.Line(chartCanvas, data);
	bar._otherProps._autoGrouping = chartType;
	
	//в случае поверхностной диаграммы
	if (chartSubType == c_oAscChartType.area)
		bar._otherProps._filled = true;

	//для нормированных графиков с накоплением и без него
	if (bar._otherProps._autoGrouping == 'stacked') {
		for (var j = 0; j < (data.length - 1); j++) {
			for (var i = 0; i < data[j].length; i++) {
				data[j + 1][i] = data[j + 1][i] + data[j][i]
			}
		}
		chart.max = getMaxValueArray(data);
		chart.min = getMinValueArray(data);
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
		chart.max = getMaxValueArray(tempData);
		chart.min = getMinValueArray(tempData);
		bar.data = tempData;
		bar.original_data = tempData;
	}
	
	if((bar._otherProps._autoGrouping == 'stacked' || bar._otherProps._autoGrouping == 'stackedPer') && bar._otherProps._filled)
	{
		copyData = OfficeExcel.array_reverse(copyData);
		chart.arrFormatAdobeLabels = OfficeExcel.array_reverse(chart.arrFormatAdobeLabels);
	}


	bar.newData = data;
	bar.firstData = copyData;
	bar._otherProps._ylabels_count = 'auto';

	//обводка графика для поверхностной диаграммы
	bar._otherProps._filled_accumulative = false;

	if (bar._otherProps._filled != true) {
		bar._chartGutter._left = 35;
		bar._chartGutter._bottom = 35;
	}

	bar._otherProps._area_border = chart.bShowBorder;
	bar._otherProps._background_grid_autofit_numvlines = data.length;
	bar._otherProps._background_grid_color = 'graytext';
	bar._otherProps._background_barcolor1 = 'white';
	bar._otherProps._background_barcolor2 = 'white';
	bar._otherProps._linewidth = 3;
	//для графика с маркерами
	//bar._otherProps._tickmarks = ['filledendsquare','filledsquare','filledarrow'];
	
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
	//подписи по оси OX
	if(chart && chart.series && chart.series[0] && chart.series[0].xVal && chart.series[0].xVal.NumCache && chart.series[0].xVal.Formula != null && chart.series[0].xVal.NumCache.length != 0)
		bar._otherProps._labels = chart.series[0].xVal.NumCache;
	else
		bar._otherProps._labels = tempMas;
		
	if (bar._otherProps._autoGrouping == 'stackedPer')
		bar._otherProps._units_post = '%';
	
	if (bar._otherProps._filled != true)
		bar._otherProps._hmargin = bar._otherProps._background_grid_vsize / 2;
	else
		bar._otherProps._hmargin = 0;
}

function DrawBarChart(chartCanvas, chartSubType, data, chart) {
	
	bar = new OfficeExcel.Bar(chartCanvas, data);
	var copyData = $.extend(true, [], data);
	bar.firstData = copyData;
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

	bar._otherProps._area_border = chart.bShowBorder;
	bar._otherProps._ylabels_count = 'auto';
	bar._otherProps._variant = 'bar';
	bar._chartGutter._left = 35;
	bar._chartGutter._bottom = 35;
	bar._otherProps._background_grid_autofit_numvlines = data.length;
	bar._otherProps._background_grid_color = 'graytext';
	bar._otherProps._background_barcolor1 = 'white';
	bar._otherProps._background_barcolor2 = 'white';

	var tempMas = [];
	for (var i = 0; i < data.length; i++) {
		tempMas[i] = i + 1;
	}
	//подписи по оси OX
	if(chart && chart.series && chart.series[0] && chart.series[0].xVal && chart.series[0].xVal.NumCache && chart.series[0].xVal.Formula != null && chart.series[0].xVal.NumCache.length != 0)
		bar._otherProps._labels = chart.series[0].xVal.NumCache;
	else
		bar._otherProps._labels = tempMas;

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
	
	var copyData = $.extend(true, [], data);
	
	bar = new OfficeExcel.HBar(chartCanvas, data);	
	bar._otherProps._autoGrouping = chartSubType;
	var originalData = $.extend(true, [], data);

	chart.arrFormatAdobeLabels =  OfficeExcel.array_reverse(chart.arrFormatAdobeLabels);

	if (bar._otherProps._autoGrouping == 'stacked') {
		for (var j = 0; j < (data.length); j++) {
			for (var i = 0; i < (data[j].length); i++) {
				data[j][i] = findPrevValue(originalData, j, i)
			}
			data[j] = OfficeExcel.array_reverse(data[j]);
			copyData[j] = OfficeExcel.array_reverse(copyData[j]);
			chart.arrFormatAdobeLabels[j] =  OfficeExcel.array_reverse(chart.arrFormatAdobeLabels[j]);
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
			copyData[j] = OfficeExcel.array_reverse(copyData[j]);
			chart.arrFormatAdobeLabels[j] =  OfficeExcel.array_reverse(chart.arrFormatAdobeLabels[j]);
		}
		bar.data = tempData;
		bar.original_data = tempData;
	}
	else
	{
		for (var j = 0; j < (copyData.length); j++) {
			chart.arrFormatAdobeLabels[j] =  OfficeExcel.array_reverse(chart.arrFormatAdobeLabels[j]);
		}
	}

	bar.firstData = copyData;
	
	//bar._otherProps._labels = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
	bar._otherProps._area_border = chart.bShowBorder;
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
	//подписи по оси OY
	if(chart && chart.series && chart.series[0] && chart.series[0].xVal && chart.series[0].xVal.NumCache && chart.series[0].xVal.Formula != null && chart.series[0].xVal.NumCache.length != 0)
		bar._otherProps._labels = chart.series[0].xVal.NumCache;
	else
		bar._otherProps._labels = tempMas;
	bar._otherProps._background_grid_autofit_numhlines = data.length;
	bar._otherProps._numyticks = data.length;
	bar._chartGutter._left = 45;
	bar._chartGutter._right = 90;
	bar._chartGutter._top = 13;
	bar._chartGutter._bottom = 30;
	//аналогично для измения высоты(ширины)
	if (bar._otherProps._autoGrouping == 'stacked' || bar._otherProps._autoGrouping == 'stackedPer') {
		if (bar._otherProps._autoGrouping == 'stackedPer')
			bar._otherProps._units_post = '%';
		bar._otherProps._vmargin = (((bar.canvas.height - (bar._chartGutter._top + bar._chartGutter._bottom)) * 0.3) / bar.data.length) / 2;
	}
	else
		bar._otherProps._vmargin = (((bar.canvas.height - (bar._chartGutter._top + bar._chartGutter._bottom)) * 0.3) / bar.data.length) / bar.data[0].length;

	//для того, чтобы не строить рамку вокруг легенды
	bar._otherProps._key_rounded = null;
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
function setFontChart(chart)
{
	var defaultColor = "#000000"
	var defaultFont = "Arial";
	var defaultSize = "10";
	
	if(chart.header.font)//заголовок
	{
		bar._chartTitle._bold = chart.header.font.bold ? chart.header.font.bold : true;
		bar._chartTitle._color = chart.header.font.color ? chart.header.font.color : defaultColor;
		bar._chartTitle._font = chart.header.font.name ? chart.header.font.name : defaultFont;
		bar._chartTitle._size = chart.header.font.size ? chart.header.font.size : defaultSize;
		bar._chartTitle._italic = chart.header.font.italic ? chart.header.font.italic : false;
		bar._chartTitle._underline = chart.header.font.underline ? chart.header.font.underline : false;
	}
	
	if(chart.xAxis.titleFont)//название оси OX
	{
		bar._xAxisTitle._bold = chart.xAxis.titleFont.bold ? chart.xAxis.titleFont.bold : true;
		bar._xAxisTitle._color = chart.xAxis.titleFont.color ? chart.xAxis.titleFont.color : defaultColor;
		bar._xAxisTitle._font = chart.xAxis.titleFont.name ? chart.xAxis.titleFont.name : defaultFont;
		bar._xAxisTitle._size = chart.xAxis.titleFont.size ? chart.xAxis.titleFont.size : defaultFont;
		bar._xAxisTitle._italic = chart.xAxis.titleFont.italic ? chart.xAxis.titleFont.italic : false;
		bar._xAxisTitle._underline = chart.xAxis.titleFont.underline ? chart.xAxis.titleFont.underline : false;
	}
	
	if(chart.yAxis.titleFont)//название оси OY
	{
		bar._yAxisTitle._bold = chart.yAxis.titleFont.bold ? chart.yAxis.titleFont.bold : true;
		bar._yAxisTitle._color = chart.yAxis.titleFont.color ? chart.yAxis.titleFont.color : defaultColor;
		bar._yAxisTitle._font = chart.yAxis.titleFont.name ? chart.yAxis.titleFont.name : defaultFont;
		bar._yAxisTitle._size = chart.yAxis.titleFont.size ? chart.yAxis.titleFont.size : defaultFont;
		bar._yAxisTitle._italic = chart.yAxis.titleFont.italic ? chart.yAxis.titleFont.italic : false;
		bar._yAxisTitle._underline = chart.yAxis.titleFont.underline ? chart.yAxis.titleFont.underline : false;
	}
	
	if(chart.legend.font)//подписи легенды
	{
		bar._otherProps._key_text_bold = chart.legend.font.bold ? chart.legend.font.bold : false;
		bar._otherProps._key_text_color = chart.legend.font.color ? chart.legend.font.color : defaultColor;
		bar._otherProps._key_text_font = chart.legend.font.name ? chart.legend.font.name : defaultFont;
		bar._otherProps._key_text_size = chart.legend.font.size ? chart.legend.font.size : defaultFont;
		bar._otherProps._key_text_italic = chart.legend.font.italic ? chart.legend.font.italic : false;
		bar._otherProps._key_text_underline = chart.legend.font.underline ? chart.legend.font.underline : false;
	}
	
	if(chart.xAxis.labelFont)//значения по оси OX
	{
		bar._otherProps._xlabels_bold = chart.xAxis.labelFont.bold ? chart.xAxis.labelFont.bold : false;
		bar._otherProps._xlabels_color = chart.xAxis.labelFont.color ? chart.xAxis.labelFont.color : defaultColor;
		bar._otherProps._xlabels_font = chart.xAxis.labelFont.name ? chart.xAxis.labelFont.name : defaultFont;
		bar._otherProps._xlabels_size = chart.xAxis.labelFont.size ? chart.xAxis.labelFont.size : defaultSize;
		bar._otherProps._xlabels_italic = chart.xAxis.labelFont.italic ? chart.xAxis.labelFont.italic : false;
		bar._otherProps._xlabels_underline = chart.xAxis.labelFont.underline ? chart.xAxis.labelFont.underline : false;
	}	
	
	if(chart.yAxis.labelFont)//значения по оси OY
	{
		bar._otherProps._ylabels_bold = chart.yAxis.labelFont.bold ? chart.yAxis.labelFont.bold : false;
		bar._otherProps._ylabels_color = chart.yAxis.labelFont.color ? chart.yAxis.labelFont.color : defaultColor;
		bar._otherProps._ylabels_font = chart.yAxis.labelFont.name ? chart.yAxis.labelFont.name : defaultFont;
		bar._otherProps._ylabels_size = chart.yAxis.labelFont.size ? chart.yAxis.labelFont.size : defaultSize;
		bar._otherProps._ylabels_italic = chart.yAxis.labelFont.italic ? chart.yAxis.labelFont.italic : false;
		bar._otherProps._ylabels_underline = chart.yAxis.labelFont.underline ? chart.yAxis.labelFont.underline : false;
	}	
	
	if(chart.legend.font)//подписи значений графика
	{
		bar._otherProps._labels_above_bold = chart.legend.font.bold ? chart.legend.font.bold : false;
		bar._otherProps._labels_above_color = chart.legend.font.color ? chart.legend.font.color : defaultColor;
		bar._otherProps._labels_above_font = chart.legend.font.name ? chart.legend.font.name : defaultFont;
		bar._otherProps._labels_above_size = chart.legend.font.size ? chart.legend.font.size : defaultSize;
		bar._otherProps._labels_above_italic = chart.legend.font.italic ? chart.legend.font.italic : false;
		bar._otherProps._labels_above_underline = chart.legend.font.underline ? chart.legend.font.underline : false;
	}	
	
	if(chart.xAxis.font)//остальные подписи
	{
		bar._otherProps._text_color = defaultColor;
		bar._otherProps._text_bold = false;
		bar._otherProps._text_italic = false;
		bar._otherProps._text_underline = false;
		bar._otherProps._text_font = defaultFont;
		bar._otherProps._text_size = defaultSize;
	}
}
function getFontProperties(type)
{
	var props = bar._otherProps;
	var xAxisTitle = bar._xAxisTitle;
	var yAxisTitle = bar._yAxisTitle;
	var chartTitle = bar._chartTitle;
	var fontProp = window["Asc"].FontProperties;
	if(!fontProp)
		fontProp = FontProperties;
	switch (type) {
		case "xLabels":
		{
			return new fontProp(props._xlabels_font,props._xlabels_size,props._xlabels_bold, props._xlabels_italic, props._xlabels_underline);
		}
		case "yLabels":
		{
			return new fontProp(props._ylabels_font, props._ylabels_size, props._ylabels_bold, props._ylabels_italic, props._ylabels_underline);
		}
		case "xTitle":
		{
			return new fontProp(xAxisTitle._font, xAxisTitle._size, xAxisTitle._bold, xAxisTitle._italic, xAxisTitle._underline);
		}
		case "yTitle":
		{
			return new fontProp(yAxisTitle._font, yAxisTitle._size, yAxisTitle._bold, yAxisTitle._italic, yAxisTitle._underline);
		}
		case "key":
		{
			return new fontProp(props._key_text_font,props._key_text_size,props._key_text_bold, props._key_text_italic, props._key_text_underline);
		}
		case "title":
		{
			return new fontProp(chartTitle._font, chartTitle._size, chartTitle._bold, chartTitle._italic, chartTitle._underline);
		}
		case "labelsAbove":
		{
			return new fontProp(props._ylabels_labels_above_labels_above_font, props._labels_above_size, props._labels_above_bold, props._labels_above_italic, props._labels_above_underline);
		}
	}
}
function calculatePosiitionObjects(type)
{
	var context = OfficeExcel.drawingCtxCharts;
	if(!context || !context.scaleFactor)
		return false;
	var scale = context.scaleFactor;
	switch (type) {
		case "xLabels":
		{
			//возвращаем только координату y, поскольку она зависит от величины маргина
			var marginBottom = bar._chartGutter._bottom;
			var ascFontXLabels = getFontProperties("xLabels");
			context.setFont(ascFontXLabels);
			var heigthTextLabelsOx = context.measureText((bar._otherProps._labels[0]).toString(),1);
			//если имеется название оси
			var heigthTextNameAxisOx = 0;
			if(bar._xAxisTitle._vpos)
			{
				var ascFontXTitle = getFontProperties("xTitle");
				context.setFont(ascFontXTitle);
				//в дальнейшем коэффициэнт нужно убрать и вместо него должна быть высота автофигуры с текстом
				var koff = 12*scale;
				heigthTextNameAxisOx = 10 + context.measureText((bar._xAxisTitle._text).toString(),1).height + koff;
			}
			//отступ от оси до подписи значений			
			marginOx = (marginBottom - (heigthTextLabelsOx.height + heigthTextNameAxisOx))/2;
			return marginOx;
		}
		case "yLabels":
		{
			//возвращаем только координату x
			var marginLeft = bar._chartGutter._left;
			var ascFontXLabels = getFontProperties("xLabels");
			context.setFont(ascFontXLabels);
			var propsTextLabelsOy = getMaxPropertiesText(context,ascFontXLabels,bar._otherProps._labels);
			var marginOy = bar._chartGutter._left - (12*scale);
			return marginOy;
		}
		case "key_hpos":
		{
			if(bar._otherProps._key_halign == 'right')
			{
				if(bar._otherProps._key_color_shape == 'line')
				{
					var widthLine = 28;
					//находим ширину текста легенды(то есть её максимального элемента), в дальнейшем будем возвращать ширину автофигуры
					var font = getFontProperties("key");
					var widthText = getMaxPropertiesText(context,font,bar._otherProps._key);
					var widthKey = widthText.width + 2*scale + widthLine*scale;
					//в MSExcel справа от легенды всегда остаётся такой маргин 
					var marginRightFromKey = 12*scale;
					var hpos = bar.canvas.width - widthKey - marginRightFromKey;
					return hpos;
				}
				else
				{
					var widthLine = 8;
					//находим ширину текста легенды(то есть её максимального элемента), в дальнейшем будем возвращать ширину автофигуры
					var font = getFontProperties("key");
					var widthText = getMaxPropertiesText(context,font,bar._otherProps._key);
					var widthKey = widthText.width + 5 + widthLine;
					//в MSExcel справа от легенды всегда остаётся такой маргин 
					var marginRightFromKey = 12*scale;
					var hpos = bar.canvas.width - widthKey - marginRightFromKey;
					return hpos;
				}
			}
			else if(bar._otherProps._key_halign == 'left')
			{
				//слева от легенды всегда расстояние 12px
				return 12*scale;
			}
			else if(bar._otherProps._key_halign == 'bottom')
			{
				return bar.canvas.height - 7*scale;
			}
			else if(bar._otherProps._key_halign == 'top')
			{
				var font = getFontProperties("key");
				var props = getMaxPropertiesText(context,font,bar._otherProps._key);
				var heigthTextKey = (context.getHeightText()/0.75)*scale;
				if(typeof(bar._chartTitle._text) == 'string' && bar._chartTitle._text != '')
				{
					var font = getFontProperties("title");
					var axisTitleProp = getMaxPropertiesText(context,font, bar._chartTitle._text);
					var hpos = (bar.canvas.width)/2 - axisTitleProp.width/2;
					var heigthText = (context.getHeightText()/0.75)*scale;
					return 7*scale + heigthTextKey + 7*scale + heigthText;
				}
				else
				{
					return 7*scale + heigthTextKey;
				}
			}
		}
		case "yAxisTitle":
		{
			// ***по дефолту в ms office отступ от левого края(или от легенды) 12px
			var hpos;
			var font = getFontProperties("yTitle");
			var axisTitleProp = getMaxPropertiesText(context,font, bar._yAxisTitle._text);
			var vpos = (bar.canvas.height - bar._chartGutter._bottom - bar._chartGutter._top)/2 + axisTitleProp.width/2 + bar._chartGutter._top;
			var heigthText = (context.getHeightText()/0.75)*scale;
			if(bar._otherProps._key_halign == 'left')
			{
				var widthLine = 8;
				var diff = 5;
				if(bar._otherProps._key_color_shape == 'line')
				{
					widthLine = 28;
					diff = 2;
				}
				//находим ширину текста легенды(то есть её максимального элемента), в дальнейшем будем возвращать ширину автофигуры
				var font = getFontProperties("key");
				var widthText = getMaxPropertiesText(context,font,bar._otherProps._key);
				var widthKey = widthText.width + diff*scale + widthLine*scale;
				//складываем стандартный маргин от легенды + маргин от названия + ширину легенды + высоту текста названия
				hpos = heigthText + widthKey + 6*scale + 12*scale;
				return {x: hpos,y: vpos}
			}
			else
			{
				hpos = heigthText + 12*scale;
				return {x: hpos,y: vpos}
			}
		}
		case "xAxisTitle":
		{
			// ***по дефолту в ms office отступ от нижнего края(или от легенды) 14px
			
			var hpos;
			var font = getFontProperties("xTitle");
			var axisTitleProp = getMaxPropertiesText(context,font, bar._xAxisTitle._text);
			var hpos = (bar.canvas.width - bar._chartGutter._left - bar._chartGutter._right)/2 - axisTitleProp.width/2 + bar._chartGutter._left;
			var heigthText = (context.getHeightText()/0.75)*scale;
			if(bar._otherProps._key_halign == 'bottom')
			{
				var font = getFontProperties("key");
				var heightText = getMaxPropertiesText(context,font,bar._otherProps._key);
				var heightKey = (context.getHeightText()/0.75)*scale;
				//складываем стандартный маргин от легенды + маргин от названия + ширину легенды + высоту текста названия
				vpos = bar.canvas.height - 14*scale - 7*scale - heightKey;
				return {x: hpos,y: vpos}
			}
			else
			{
				vpos = bar.canvas.height - 14*scale;
				return {x: hpos,y: vpos}
			}
		}
		case "title":
		{
			// ***по дефолту в ms office отступ от верхнего края(или от легенды) 7px
			var hpos;
			var font = getFontProperties("title");
			var axisTitleProp = getMaxPropertiesText(context,font, bar._chartTitle._text);
			var hpos = (bar.canvas.width)/2 - axisTitleProp.width/2;
			var heigthText = (context.getHeightText()/0.75)*scale;
			vpos = 7*scale + heigthText;
			return {x: hpos,y: vpos}
		}
	}
}
function getMaxPropertiesText(context, font, text)
{
	context.setFont(font);
	var result = 0;
	if(typeof text == "object")
	{	
		// в данном случае ищем максимальную ширину текста
		var maxLength = 0;
		var maxWord;
		for(var i = 0; i < text.length; i++)
		{
			var lengthText = text[i].toString().length;
			if(lengthText > maxLength)
			{
				maxLength = lengthText;
				maxWord = text[i].toString();
			}
		}
		result = context.measureText(maxWord,0);
	}
	else
	{
		if(text.toString() != '')
			result = context.measureText((text).toString(),0);
	}
	return result;
}
function getMaxValueArray(array)
{
	var max = 0;
	for(var i = 0; i < array.length; i++)
	{
		for(var j = 0; j < array[i].length; j++)
		{
			if(i == 0 && j == 0)
				max =  array[i][j];
			if(array[i][j] > max)
				max = array[i][j];
		}
	}
	return max;
}

function getMinValueArray(array)
{
	var min = 0;
	for(var i = 0; i < array.length; i++)
	{
		for(var j = 0; j < array[i].length; j++)
		{
			if(i == 0 && j == 0)
				min =  array[i][j];
			if(array[i][j] < min)
				min = array[i][j];
		}
	}
	return min;
}