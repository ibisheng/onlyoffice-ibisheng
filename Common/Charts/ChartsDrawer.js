"use strict";

//*****MAIN*****
function CChartsDrawer()
{
	this.graphics = null;
	
	this.calcProp = null;
	
	this.areaChart = null;
	this.gridChart = null;
	this.chart = null;
}

CChartsDrawer.prototype =
{
    reCalculate : function(chartProp)
    {
		this.calcProp = {};
		this._calculateProperties(chartProp);

		//создаём область
		this.areaChart = new areaChart();
		
		//создаём сетку
		this.gridChart = new gridChart();
		
		//draw chart
		var newChart;
		switch ( this.calcProp.type )
		{
			case "Bar":
			{
				newChart = new drawBarChart();
				break;
			}
			case "Line":
			{
				newChart = new drawLineChart();
				break;
			}
			
			case "HBar":
			{
				newChart = new drawHBarChart();
				break;
			}
			
			case "Pie":
			{
				newChart = new drawPieChart();
				break;
			}
			
			case "Scatter":
			{
				newChart = new drawScatterChart();
				break;
			}
			
			case "Area":
			{
				newChart = new drawAreaChart();
				break;
			}
		}
		this.chart = newChart;
		
		//делаем полный пресчёт
		this.gridChart.reCalculate(this.calcProp, null, this);
		this.areaChart.reCalculate(this.calcProp);
		this.chart.reCalculate(this, chartProp);
	},
	
	draw : function(chartProp, graphics)
    {
		var cShapeDrawer = new CShapeDrawer();
		cShapeDrawer.Graphics = graphics;
		this.calcProp.series = chartProp.chart.plotArea.chart.series;
		
		//отрисовываем без пересчёта
		this.areaChart.draw(this.calcProp, cShapeDrawer);
		this.gridChart.draw(this.calcProp, cShapeDrawer, chartProp);
		this.chart.draw(this, cShapeDrawer, chartProp);
	},
	
	reCalculatePositionText : function(type, chartSpace, ser, val)
	{
		var pos;
		switch ( type )
		{
			case "dlbl":
			{
				pos = this._calculatePositionDlbl(chartSpace, ser, val);
			}
		}
		return {x: pos.x, y : pos.y};
	},
	
	_calculatePositionDlbl: function(chartSpace, ser, val)
	{	
		return this.chart._calculateDLbl(chartSpace, ser, val);
	},
	
	_calculateProperties: function(chartProp)
	{
		this.calcProp.pxToMM = 1/chartProp.convertPixToMM(1);
		
		this.calcProp.pathH = 1000000000;
		this.calcProp.pathW = 1000000000;
		
		var typeChart = chartProp.chart.plotArea.chart.getObjectType();
		
		switch ( typeChart )
		{
			case historyitem_type_LineChart:
			{
				this.calcProp.type = "Line";
				break;
			}
			case historyitem_type_BarChart:
			{
				if(chartProp.chart.plotArea.chart.barDir == 1)
					this.calcProp.type = "Bar";
				else 
					this.calcProp.type = "HBar";
				break;
			}
			case historyitem_type_PieChart:
			{
				this.calcProp.type = "Pie";
				break;
			}
			case historyitem_type_AreaChart:
			{
				this.calcProp.type = "Area";
				break;
			}
			case historyitem_type_ScatterChart:
			{
				this.calcProp.type = "Scatter";
				break;
			}
		};
		
		var grouping = chartProp.chart.plotArea.chart.grouping;
		if(this.calcProp.type == "Line")
			this.calcProp.subType = (grouping === GROUPING_PERCENT_STACKED) ? "stackedPer" : (grouping === GROUPING_STACKED) ? "stacked" : "normal"
		else
			this.calcProp.subType = (grouping === BAR_GROUPING_PERCENT_STACKED) ? "stackedPer" : (grouping === BAR_GROUPING_STACKED) ? "stacked" : "normal"
		
		
		this.calcProp.xaxispos = null;
		this.calcProp.yaxispos = null;
		
		//рассчёт данных и ещё некоторых параметров(this.calcProp./min/max/ymax/ymin/data)
		this._calculateData(chartProp);
		
		//пересчёт данных для накопительных диаграмм
		if(this.calcProp.subType == 'stackedPer' || this.calcProp.subType == 'stacked')
			this._calculateStackedData();
			
		this.calcProp.widthCanvas = chartProp.extX*this.calcProp.pxToMM;
		this.calcProp.heightCanvas = chartProp.extY*this.calcProp.pxToMM;
		
		//считаем маргины
		this._calculateMarginsChart();
		
		this.calcProp.trueWidth = this.calcProp.widthCanvas - this.calcProp.chartGutter._left - this.calcProp.chartGutter._right;
		this.calcProp.trueHeight = this.calcProp.heightCanvas - this.calcProp.chartGutter._top - this.calcProp.chartGutter._bottom;
		
		this._calculateWidthChart();
		
		//***series***
		this.calcProp.series = chartProp.chart.plotArea.chart.series;
		
		//находим значния для осей
		this.calcProp.scale = this._getScale(false, this.calcProp, this.calcProp.min, this.calcProp.max, this.calcProp.ymin, this.calcProp.ymax);	
		if(this.calcProp.type == "Scatter")
			this.calcProp.xScale = this._getScale(true, this.calcProp, this.calcProp.min, this.calcProp.max, this.calcProp.ymin, this.calcProp.ymax);
		
		
		//count line of chart grid
		this.calcProp.numhlines = this.calcProp.scale.length - 1;
		if(this.calcProp.type == "Bar")
		{
			this.calcProp.numvlines = this.calcProp.data.length;
			
			this.calcProp.numvMinorlines = 2;
			this.calcProp.numhMinorlines = 5;
		}
		else if(this.calcProp.type == "HBar")
		{
			this.calcProp.numhlines = this.calcProp.data.length;
			this.calcProp.numvlines = this.calcProp.scale.length - 1;
			
			this.calcProp.numhMinorlines = 2;
			this.calcProp.numvMinorlines = 5;
		}
		else if(this.calcProp.type == "Line")
		{
			this.calcProp.numvlines = this.calcProp.data[0].length;
			
			this.calcProp.numvMinorlines = 2;
			this.calcProp.numhMinorlines = 5;
		}
		else if(this.calcProp.type == "Scatter")
		{
			this.calcProp.numvlines = this.calcProp.xScale.length - 1;
			
			this.calcProp.numvMinorlines = 5;
			this.calcProp.numhMinorlines = 5;
		}
		else if(this.calcProp.type == "Area")
		{
			this.calcProp.numvlines = this.calcProp.data[0].length - 1;
			
			this.calcProp.numvMinorlines = 2;
			this.calcProp.numhMinorlines = 5;
		}

		this.calcProp.nullPositionOX = this._getNullPosition();
	
		if(this.calcProp.type == "Bar")
		{
			this.calcProp.max = this.calcProp.scale[this.calcProp.scale.length -1];
			this.calcProp.min = this.calcProp.scale[0];
		}
	},
	
	_calculateStackedData: function()
	{	
		if(this.calcProp.type == "Bar")
		{
			if (this.calcProp.subType == 'stackedPer') {
				var summ
				for (var j = 0; j < (this.calcProp.data.length); j++) {
					summ = 0;
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						summ += Math.abs(this.calcProp.data[j][i]);
					}
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						this.calcProp.data[j][i] = (this.calcProp.data[j][i] * 100) / summ;
						if(isNaN(this.calcProp.data[j][i]))
							this.calcProp.data[j][i] = 0;
					}
				}
			}
		};
		
		
		if(this.calcProp.type == "Line" || this.calcProp.type == "Area")
		{
			if (this.calcProp.subType == 'stacked') {
				for (var j = 0; j < (this.calcProp.data.length - 1); j++) {
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						if(!this.calcProp.data[j + 1])
							this.calcProp.data[j + 1] = [];
						this.calcProp.data[j + 1][i] = this.calcProp.data[j + 1][i] + this.calcProp.data[j][i];
					}
				}
				this.calcProp.max = this._getMaxValueArray(this.calcProp.data);
				this.calcProp.min = this._getMinValueArray(this.calcProp.data);
			}
			else if (this.calcProp.subType == 'stackedPer') {
				var copyData = Asc.clone(this.calcProp.data);
				for (var j = 0; j < (this.calcProp.data.length - 1); j++) {
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						this.calcProp.data[j + 1][i] = this.calcProp.data[j + 1][i] + this.calcProp.data[j][i]
					}
				}
				var tempData = this.calcProp.data;
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
				this.calcProp.max = this._getMaxValueArray(tempData);
				this.calcProp.min = this._getMinValueArray(tempData);
				this.calcProp.data = tempData;
			}
		};
		
		
		if(this.calcProp.type == "HBar")
		{
			var originalData = $.extend(true, [], this.calcProp.data);
			if (this.calcProp.subType == 'stacked') {
				for (var j = 0; j < this.calcProp.data.length; j++) {
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						this.calcProp.data[j][i] = this._findPrevValue(originalData, j, i)
					}
				}
			}
			else if (this.calcProp.subType == 'stackedPer') {
				var sumMax = [];
				//находим суммы для нормированной диаграммы
				for (var j = 0; j < (this.calcProp.data.length); j++) {
					sumMax[j] = 0;
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						sumMax[j] += Math.abs(this.calcProp.data[j][i]);
					}
				}


				for (var j = 0; j < (this.calcProp.data.length); j++) {
					for (var i = 0; i < (this.calcProp.data[j].length); i++) {
						this.calcProp.data[j][i] = this._findPrevValue(originalData, j, i)
					}
				}

				var tempData = this.calcProp.data;

				for (var j = 0; j < (this.calcProp.data.length); j++) {
					for (var i = 0; i < (this.calcProp.data[j].length); i++) {
						tempData[j][i] = (100 * tempData[j][i]) / (sumMax[j]);
						if(isNaN(tempData[j][i]))
							tempData[j][i] = 0;
					}
				}
				this.calcProp.data = tempData;
			}
		};
	},
	
	_getSumArray: function (arr, isAbs)
    {
        if (typeof(arr) == 'number') {
            return arr;
        }
		else if(typeof(arr) == 'string'){
			return parseFloat(arr);
		}

        var i, sum;
        for(i = 0,sum = 0; i < arr.length; i++)
		{
			if(typeof(arr[i]) == 'object' && arr[i].val)
				sum += parseFloat(isAbs ? Math.abs(arr[i].val) : arr[i].val);
			else
				sum += isAbs ? Math.abs(arr[i]) : arr[i];
		}
        return sum;
    },
	
	_getMaxValueArray: function(array)
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
	},
	
	_getMinValueArray: function(array)
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
	},
	
	_findPrevValue: function(originalData, num, max) {
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
	},

	_getColorProps: function()
	{
		var api_doc = window["editor"];
		var api_sheet = window["Asc"]["editor"];
        var theme, colorMap, RGBA;

		if(api_sheet)
		{
			var wb = api_sheet.wbModel;
			theme = wb.theme;
			colorMap = GenerateDefaultColorMap().color_map;
			RGBA = {R: 0, G: 0, B: 0, A: 255};
		}
		else if (api_doc)
		{
			theme  = api_doc.WordControl.m_oLogicDocument.theme;
			colorMap = api_doc.WordControl.m_oLogicDocument.clrSchemeMap.color_map;
			RGBA = {R: 0, G: 0, B: 0, A: 255};
			if(colorMap==null)
				colorMap = GenerateDefaultColorMap().color_map;
		}
		return {theme : theme, colorMap: colorMap, RGBA: RGBA};
	},
	
	_calculateData: function(chart) {
		var isSeries = false;
		var formatCell = 'General';
		var formatCellScOy = 'General';
		var defaultFormat = 'General';
		var isDateTimeFormat;
		
		var api_doc = window["editor"];
		var api_sheet = window["Asc"]["editor"];
		var styleManager = api_doc ? api_doc.chartStyleManager : api_sheet.chartStyleManager;

		var arrFormatAdobeLabels = [];
		var catNameLabels = [];
		
		//просматриваем bShowValue для каждой из серий 
		//TODO позже отрисовывать значения для каждой серии индивидуально
		/*if ( !chart.bShowValue ) {
			for (var n = 0; n < chart.series.length; n++) {
				if ( chart.series[n].bShowValue ) {
					chart.bShowValue = true;
					break;
				}
			}
		}
				
		if(chart.bShowCatName)
			chart.bShowValue = true;*/
		
		
		var max = 0;
		var min = 0; 
		var minY = 0;
		var maxY = 0;
		var newArr, formatAdobeLabel;
		
		var series = chart.chart.plotArea.chart.series;
		if(series && series.length != 0 && this.calcProp.type != 'Scatter')//берём данные из NumCache
		{
			isSeries = true;
			/*chart.reSeries = chart.series;
			if(chart.type == 'Pie')
			{
				series = chart.getReverseSeries(true);
				chart.reSeries = series;
			}*/

			var arrValues = [];
			var isSkip = [];
			var skipSeries = [];
			
			var isEn = false;
			var isEnY = false;
			var numSeries = 0;
			var curSeria;
			var isNumberVal = true;
			if(series[0] && series[0].xVal && series[0].xVal.Formula != null && this.calcProp.type == 'Scatter')
			{
				var cash = series[0].xVal.NumCache;
				for(var i = 0; i < cash.length; i++)
				{
					if(!isNumber(cash.val))
						isNumberVal = false;
				}
			}
			
			for(var l = 0; l < series.length; ++l)
			{
				var firstCol = 0;
				var firstRow = 0;
				if(series[0].xVal && numSeries == 0 && this.calcProp.type == 'Scatter' && series[numSeries].xVal.numRef.numCache.pts.length)
				{
					curSeria = series[numSeries].xVal.numRef.numCache.pts;
				}
				else if(this.calcProp.type == 'Scatter')
					curSeria = series[numSeries].yVal.numRef.numCache.pts;
				else
					curSeria = series[l].val.numRef.numCache.pts;
				
				var lastCol = curSeria.length;
				skipSeries[l] = true;
				var isRow = false;
				if(firstCol == lastCol)
					isRow  = true;
			
				if(series[l].isHidden == true)
				{
					continue;
				}
				if(!curSeria.length)
				{
					continue;
				}
				if(series[0].xVal && numSeries == 0 && this.calcProp.type == 'Scatter')
					l--;
				skipSeries[l] = false;
				arrValues[numSeries] = [];
				arrFormatAdobeLabels[numSeries] = [];
				catNameLabels[numSeries] = [];
				isSkip[numSeries] = true;
		
				var row = firstRow;
				var n = 0;
				for(var col = firstCol; col < lastCol; ++col)
				{
					if(!curSeria[col])
					{
						curSeria[col] = {val:0};
					}
					else if(curSeria[col].isHidden == true)
					{
						continue;
					}
					
					//var cell = ws.getCell(new CellAddress(row - 1, col - 1, 0));
					var cell = curSeria[col];
					
					if(numSeries == 0 && col == firstCol && chart.subType != 'stackedPer' && this.calcProp.type != 'Stock')
					{
						formatCell = cell.numFormatStr ? cell.numFormatStr : defaultFormat;
						isDateTimeFormat = cell.isDateTimeFormat;
					}
					else if(this.calcProp.type == 'Stock' && numSeries == 0 && col == firstCol)
					{
						formatCellScOy = cell.numFormatStr ? cell.numFormatStr : defaultFormat;
						isDateTimeFormat = cell.isDateTimeFormat;
					}
					
					if(this.calcProp.type == 'Scatter')
					{
						if(numSeries == 1 && col == firstCol)
							formatCellScOy = cell.numFormatStr ? cell.numFormatStr : defaultFormat;
					}
					
					formatAdobeLabel = cell.numFormatStr ? cell.numFormatStr : defaultFormat;
					
					var orValue = cell.val;
					if(series[0].xVal && series[0].xVal.Formula != null && numSeries == 0 && !isNumberVal && this.calcProp.type == 'Scatter')
						orValue = col - firstCol + 1;
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
					if(isNaN(value) && orValue == '' && (((this.calcProp.type == 'Line' ) && this.calcProp.type == 'normal') || (this.calcProp.type == 'Scatter' )))
					{
						value = '';
					}
					else if (isNaN(value))
					{
						if(this.calcProp.type == "Bar" || this.calcProp.type == "HBar")
							formatAdobeLabel = null;
						value = 0;
					}
					if(this.calcProp.type == 'Pie')
						arrValues[numSeries][n] = Math.abs(value);
					else
						arrValues[numSeries][n] = value;
					arrFormatAdobeLabels[numSeries][n] = formatAdobeLabel;
					if(chart.bShowCatName && this.calcProp.type != 'Scatter')
					{
						if(series[numSeries] && series[numSeries].Cat && series[numSeries].Cat.NumCache[col] && this.calcProp.type != "Pie")
							catNameLabels[numSeries][n] = series[numSeries].Cat.NumCache[col].val;
						else if(this.calcProp.type != "Pie" && series[numSeries] && series[numSeries].TxCache)
							catNameLabels[numSeries][n] = series[numSeries].TxCache.Tx;
						else if(series[numSeries] && series[numSeries] && series[numSeries].TxCache)
							catNameLabels[numSeries][n] = series[numSeries].TxCache.Tx;
						
					}
					n++;
				}
				numSeries++;
			}
		}
		else
		{
			var yVal;
			var xVal;
			newArr = [];
			for(var l = 0; l < series.length; ++l)
			{
				newArr[l] = [];
				for(var j = 0; j < series[l].yVal.numRef.numCache.pts.length; ++j)
				{
					yVal = parseFloat(series[l].yVal.numRef.numCache.pts[j].val);
					if(series[l].xVal)
						xVal = parseFloat(series[l].xVal.numRef.numCache.pts[j].val);
					else
						xVal = j + 1;
					newArr[l][j] = [xVal, yVal];
					
					if(l == 0 && j == 0)
					{
						min = xVal;
						max = xVal;
						minY = yVal;
						maxY = yVal;
					};
					
					if(xVal < min)
						min = xVal;
					if(xVal > max)
						max = xVal;
					if(yVal < minY)
						minY = yVal;
					if(yVal > maxY)
						maxY = yVal;
				}
			}
			this.calcProp.ymin = minY;
			this.calcProp.ymax = maxY;
		}

		
		if(isSeries)
		{
			var arrFormatAdobeLabelsRev = arrFormatAdobeLabels;
			var arrValuesRev = arrValues;
		}
			
		isEn = false;
		if(this.calcProp.type == 'Scatter' && !newArr)
		{
			/*min = 0;
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
			}*/
		}
		
		if(!arrValuesRev)
			arrValuesRev = arrReverse(arrValues);
		
		if(!arrFormatAdobeLabelsRev)
			arrFormatAdobeLabelsRev = arrReverse(arrFormatAdobeLabels);
			
		this.calcProp.isFormatCell = formatCell;
		this.calcProp.isformatCellScOy = formatCellScOy;
		this.calcProp.min = min;
		this.calcProp.max = max;
		
		/*if(skipSeries)
			this.calcProp.skipSeries = skipSeries;*/
			
		this.calcProp.catNameLabels = null;	
		if(newArr != undefined)
		{
			//chart.arrFormatAdobeLabels = newAdobeLabels;
			this.calcProp.data = newArr;
		}	
		else
		{
			if(isSeries)
			{
				if(this.calcProp.type == 'HBar' || this.calcProp.type == 'Bar' || this.calcProp.type == 'Stock' || this.calcProp.type == 'Pie')
				{
					arrValuesRev = arrReverse(arrValues);
					this.calcProp.arrFormatAdobeLabels = arrReverse(arrFormatAdobeLabels);
					if(catNameLabels && catNameLabels.length)
						this.calcProp.catNameLabels = arrReverse(catNameLabels);
					this.calcProp.data = arrValuesRev;
				}
				else
				{
					this.calcProp.arrFormatAdobeLabels = arrFormatAdobeLabels;
					if(catNameLabels && catNameLabels.length)
						this.calcProp.catNameLabels = catNameLabels;
					this.calcProp.data = arrValues;
				}
			}
			else
			{
				if (chart.range.rows)
				{
					if(this.calcProp.type == 'HBar' || this.calcProp.type == 'Bar' || this.calcProp.type == 'Stock')
					{
						this.calcProp.arrFormatAdobeLabels = arrFormatAdobeLabelsRev;
						this.calcProp.data = arrValuesRev;
					}
					else
					{
						this.calcProp.arrFormatAdobeLabels = arrFormatAdobeLabels;
						this.calcProp.data = arrValues;
					}
				}
				else
				{
					if(this.calcProp.type == 'HBar' || this.calcProp.type == 'Bar' || this.calcProp.type == 'Stock')
					{
						this.calcProp.arrFormatAdobeLabels = arrFormatAdobeLabels;
						this.calcProp.data = arrValues;
					}
					else
					{
						this.calcProp.arrFormatAdobeLabels = arrFormatAdobeLabelsRev;
						this.calcProp.data = arrValuesRev;
					}
				}
			}
			
		}
	},
	
	_calculateWidthChart: function() {
		var trueWidth = this.calcProp.trueWidth;
		var trueHeight = this.calcProp.trueHeight;
		
		if ('Bar' == this.calcProp.type || 'HBar' == this.calcProp.type) {
			var mainKoff = 0.43;
			var data = this.calcProp.data[0];
			var lengthOfData = this.calcProp.data.length;
			if (this.calcProp.subType == 'stacked' && 'Bar' == this.calcProp.type || this.calcProp.subType == 'stackedPer' || this.calcProp.subType == 'stacked') {
				data = this.calcProp.data;
				mainKoff = 0.597;
			}
			else if (1 == this.calcProp.data.length) {
				mainKoff = 0.597;
			}
			else if (2 == this.calcProp.data.length) {
				mainKoff = 0.43;
			}
			else {
				var tempKoff = 0.188;
				for (var j = 2; j < this.calcProp.data.length; j++) {
					mainKoff = mainKoff - tempKoff / (j);
					if(mainKoff < 0.05)
						break;
					if(mainKoff - tempKoff / (j+1) < 0)
						tempKoff = tempKoff/10;
				}
			}


			var pointKoff = 1 - Math.abs(mainKoff);
			if ('HBar' == this.calcProp.type)
				this.calcProp.vmargin = ((trueHeight - trueHeight * pointKoff) / 2) / (lengthOfData);
			else
				this.calcProp.hmargin = ((trueWidth - trueWidth * pointKoff) / 2) / lengthOfData;
		}
		else if('Line' == this.calcProp.type)
		{
			var lengthOfData = this.calcProp.data[0].length;
			var widthChart = (trueWidth/lengthOfData)*(lengthOfData - 1) + 5;
			
			this.calcProp.hmargin = (trueWidth - widthChart) / 2;
		}
		else {
			var pointKoff = 1 - 1 / (this.calcProp.data[0].length)
			this.calcProp.hmargin = (trueWidth - trueWidth * pointKoff) / 2;
		}
		if('Area' == this.calcProp.type)
			this.calcProp.hmargin = 0;
	},
	
	_calculateMarginsChart: function() {
		this.calcProp.chartGutter = {};
		//left margin = vertical axis(if min x == 0) + vertical title + width of legend;
		this.calcProp.chartGutter._left = 13;
		//right margin = legend;
		this.calcProp.chartGutter._right = 13;
		//right margin = legend + title;
		this.calcProp.chartGutter._top = 13;
		//right margin = legend + horizontal title +  horizontal axis(if min y == 0);
		this.calcProp.chartGutter._bottom = 13;
	},
	
	_getNullPosition: function()
	{
		var numNull = this.calcProp.numhlines;
			
		var min = this.calcProp.min;
		var max = this.calcProp.max;
		
		if(min >= 0 && max >= 0)
		{
			numNull = 0;
		}
		else if(min <= 0 && max <= 0)
		{
			numNull = this.calcProp.numhlines;
			if(this.calcProp.type == "HBar")
				numNull = this.calcProp.numvlines;
		}
		else
		{
			for (var i=0; i < this.calcProp.scale.length; i++)
			{
				if(this.calcProp.scale[i] == 0)
				{
					if(this.calcProp.type == "HBar")
						numNull = i;
					else
						numNull = i;
					break;
				}
			}
		}
		
		var nullPosition;
		if(0 == numNull)
			nullPosition = 0;
		else if(this.calcProp.type == "HBar")
			nullPosition = (this.calcProp.widthCanvas - this.calcProp.chartGutter._left - this.calcProp.chartGutter._right)/(this.calcProp.numvlines)*numNull;
		else
			nullPosition = (this.calcProp.heightCanvas - this.calcProp.chartGutter._bottom - this.calcProp.chartGutter._top)/(this.calcProp.numhlines)*numNull;
		
		var result;
		if(this.calcProp.type == "HBar")
			result = nullPosition + this.calcProp.chartGutter._left;
		else
			result = this.calcProp.heightCanvas - this.calcProp.chartGutter._bottom - nullPosition;
			
		return result;
	},
	
	_getScale: function (max, obj, minVal, maxVal,yminVal,ymaxVal)
    {
        var original_max = max;

        var mainObj = obj;
        var greaterNullNum;
 
		if(( 'Bar' == mainObj.type || 'Line' == mainObj.type || 'Area' == mainObj.type) && mainObj.subType == 'stackedPer')
		{
			var arrNew =  mainObj.data;
 
			if(typeof(arrNew[0]) == 'object')
			{
				var arrMin = [];
				var arrMax = [];
				for (var j=0; j < arrNew.length; j++) {
					var newMax = 0;
					var newMin = 0;
					if('Bar' == mainObj.type)
					{
						for (var i=0; i<arrNew[j].length; i++) {
							if(arrNew[j][i] > 0)
								newMax += arrNew[j][i]
							else
								newMin += arrNew[j][i]
						}
						arrMin[j] = newMin;
						arrMax[j] = newMax;
					}
					else
					{
						min = Math.min.apply(null, arrNew[j]);
						max = Math.max.apply(null, arrNew[j]);
						arrMin[j] = min;
						arrMax[j] = max;
					}
				   
				}
				min = Math.min.apply(null, arrMin);
				max = Math.max.apply(null, arrMax);
			}
			else
			{
				min = minVal;
				max = maxVal;
			}

			var newMin = min;
			var newMax  = max;
			
			//находим максимум после преобразования
			if('Bar' != mainObj.type)
			{
				 if(typeof(arrNew[0]) == 'object')
				{
					var arrMin = [];
					var arrMax = [];
					for (var j=0; j < arrNew.length; j++) {
						newMin = Math.min.apply(null, arrNew[j]);
						newMax = Math.max.apply(null, arrNew[j]);
						arrMin[j] = newMin;
						arrMax[j] = newMax;
					}
					newMin = Math.min.apply(null, arrMin);
					newMax = Math.max.apply(null, arrMax);
				}
				else
				{
					newMin = Math.min.apply(null, arrNew);
					newMax = Math.max.apply(null, arrNew);
				}
			}
		   
			
			
			if(max <= 0 && min < 0)
			{
				var tempVal = Math.abs(newMax)
				newMax = Math.abs(newMin);
				newMin = tempVal;
			}
			var massRes = [];
			
			//шаг нужно высчитывать
			var step = 10;
			if(((newMax - newMin)/10) > 11 )
				step = 20;
			if('Bar' == mainObj.type  && max > 0 && min < 0)
				step = 20;
			var maxValue = 100;
			//находим максимум
			for (var i=0; i < 11; i++) {
				if(newMax < 100 - step*i && newMax > 100 - step*(i+1))
					maxValue = 100 - step*i;
			}
			if(maxValue > 100)
				maxValue = 100;
			//получаем массив
			if(max <= 0 && min < 0)
			{
				if('Bar' == mainObj.type)
				{
					for (var j=0; j < 11; j++) {
						massRes[j] = (maxValue - step*j);
						if(massRes[j] == 0)
						{
							break;
						}
					}
					mainObj.xaxispos = 'top';
					massRes = this._array_reverse(massRes);
					mainObj.ymax = massRes[massRes.length - 1];
					mainObj.ymin = 0;
				}
				else
				{
					for (var j=0; j < 11; j++) {
						massRes[j] = -(maxValue - step*j);
						if(massRes[j] == 0)
						{
							break;
						}
					}
					mainObj.ymax = 0;
					mainObj.ymin = this._array_exp(massRes[0] - step);
				}
				
			}
			else if(max > 0 && min > 0)
			{
				for (var j=0; j < 11; j++) {
					massRes[j] = maxValue - step*j;
					if(massRes[j] == 0)
					{
						massRes = this._array_reverse(massRes);
						break;
					}
				}
				mainObj.ymax = this._array_exp(maxValue);
				mainObj.ymin = this._array_exp(massRes[0] - step);
			}
			else
			{
				 for (var j=0; j < 11; j++) {
					massRes[j] = maxValue - step*j;
					if(massRes[j] <= newMin)
					{
						massRes = this._array_reverse(massRes);
						break;
					}
				}
				mainObj.ymax = this._array_exp(maxValue);
				mainObj.ymin = massRes[0] - step;
			}
		   

			return this._array_exp(massRes);
		}
		else if('Scatter' == mainObj.type || 'HBar' == mainObj.type)
		{
			var max1;
			var arr = [];

			//находим минимальное значение
			var min;
			var trueOX = false;
			if('HBar' == mainObj.type)
			{
				trueOX = true;
				if(typeof(mainObj.data[0]) == 'object')
				{
					var arrMin = [];
					var arrMax = [];
					for (var j=0; j < mainObj.data.length; j++) {
						min = Math.min.apply(null, mainObj.data[j]);
						max = Math.max.apply(null, mainObj.data[j]);
						arrMin[j] = min;
						arrMax[j] = max;
					}
					min = Math.min.apply(null, arrMin);
					max = Math.max.apply(null, arrMax);
				}
				else
				{
					min = Math.min.apply(null, mainObj.data);
					max = Math.max.apply(null, mainObj.data);
				}
				//min = minVal;
				//max = maxVal;
			}
			
			//в этом случае определяем значения для оси OX(max == true)
			if(mainObj.type == 'Stock')
			{
				var arrTemp = []
				var k = 0;
				for (var j=0; j < mainObj.data[0].length; j++) {
					for (var i=0; i<5; i++)
					{
						arrTemp[k] = mainObj.data[0][j][1][i];
						k++;
					}
				}
				min = Math.min.apply(null, arrTemp);
				max = Math.max.apply(null, arrTemp);
				if(min == max && max == 0)
				{
					mainObj._otherProps._ymax = 1;
					mainObj._otherProps._ymin = 0;
					return [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]
				}
				
				if((min == 0 && max == 0) ||(isNaN(min) && isNaN(max)))
					return [0,0.2,0.4,0.6,0.8,1,1.2];
			}
			if('Scatter' == mainObj.type)
			{
				if(undefined != max && true == max)
				{
					min  = minVal;
					max  =  maxVal;
					trueOX = true;
				}
				else
				{
					min = yminVal;
					max = ymaxVal;
				}
				if((min == 0 && max == 0) ||(isNaN(min) && isNaN(max)))
					return [0,0.2,0.4,0.6,0.8,1,1.2];
			}

			var degreeNum = 1;
			var maxString = max.toExponential();
			var minString = min.toExponential();
			var floatKoff = 1000000000000;
			if(maxString.search('e-') != -1 || minString.search('e-') != -1)
			{
				var partMin  = minString.split('e-');
				var partMax  = maxString.split('e-');
				if(partMin[1] != undefined)
					degreeNum = Math.pow(10, partMin[1])
				if(partMax[1] != undefined && ((parseFloat(partMin[1]) < parseFloat(partMax[1])) || partMin[1] == undefined))
					degreeNum = Math.pow(10, partMax[1])	
				max = this._round_val(max*degreeNum);
				min = this._round_val(min*degreeNum);
			}
			
			var axisXMax;
			var axisXMin;
			var stepOY;
			var checkInput = false;
			var greaterNull;
			var chackBelowNull = false;
			var checkIsMaxMin = false;
			var arrForRealDiff = [];
			if((min == 0 && max == 0) ||(isNaN(min) && isNaN(max)))
			{
				if( mainObj.subType == 'stackedPer')
					return [20,40,60,80,100];
				else
					return [0.2,0.4,0.6,0.8,1,1.2];
			}
					
			//подготовительная работы для дальнейшего вычисления шага
			if(max >= 0 && min >= 0)
			{
				 if(max == min)
				{
					checkIsMaxMin = true;
					min = 0;
				}
					
				var diffPerMaxMin = ((max - min)/max)*100;
				 axisXMax =  max + 0.05 * (max - min);
				stepOY = (max-min)/4;
				if(16.667 > diffPerMaxMin)
				{
					if(trueOX)
					{
						axisXMin = min;
						greaterNull = (max - min)/4;
						arrForRealDiff = [1.59595959,3.18181818,7.954545454];
					}
					else
					{
						axisXMin = min;
						greaterNull = (max - min)/6;
						arrForRealDiff = [1.51515151,3.03030303,7.57575757];
					}
				}
				else
				{
					if(trueOX)
					{
						greaterNull = max/4;
						arrForRealDiff = [1.66666666,3.33333333,8.33333333];
						axisXMin = 0;
					}
					else
					{
						axisXMin = 0;
					}
				}
			}
			else if(max <= 0 && min <= 0)
			{
				if(max == min)
				{
					checkIsMaxMin = true;
					max = 0;
				}
				var tempMax = max;
				if(!trueOX)
					mainObj.xaxispos = 'top';
				else
					mainObj.yaxispos = 'right';
				max = Math.abs(min);
				min = Math.abs(tempMax);
				checkInput = true;
				var diffPerMaxMin = Math.abs(((max - min)/max))*100;
				axisXMax =  max;
				stepOY = (max-min)/4;
				chackBelowNull = true;
				if(16.667 > diffPerMaxMin)
				{
					axisXMin = min;
					greaterNull = Math.abs((Math.abs(max) - Math.abs(min)))/6;
					arrForRealDiff = [1.51515151,3.03030303,7.57575757];
				}
				else
				{
					if(trueOX)
					{
						greaterNull = max/4;
						arrForRealDiff = [1.66666666,3.33333333,8.33333333];
						axisXMin = 0;
					}
					else
					{
						axisXMin = 0;
					}
				}
			}
			else if(max > 0 && min < 0)
			{
				stepOY = (max + Math.abs(min))/4;
				axisXMax = max;
				axisXMin = min;
				if(trueOX)
				{
					greaterNull = (Math.abs(max) + Math.abs(min))/4;
					arrForRealDiff = [1.59090909,3.18181818,7.954545454]
				}
				else
				{
					greaterNull = Math.abs((Math.abs(max) + Math.abs(min)))/6;
					arrForRealDiff = [1.51515151,3.03030303,7.57575757]
				}
			}
			
			
			
			
			//приводим к первому порядку для дальнейших вычислений
			var secPart = max.toString().split('.');
			var numPow = 1;
			if(secPart[1] && secPart[1].toString().search('e+') != -1 && secPart[0] && secPart[0].toString().length == 1)
			{
				var expNum = secPart[1].toString().split('e+');
				numPow = Math.pow(10, expNum[1]);
			}
			else if(0 != secPart[0])
				numPow = Math.pow(10, secPart[0].toString().length - 1)
			max = max/numPow;
			if(0 == max.toString().split('.')[0])
			{
				var tempMax = max;
				var num = -1;
				while(0 == tempMax.toString().split('.')[0])
				{
					tempMax = max;
					numPow = Math.pow(10, num);
					tempMax = tempMax/numPow;
					num--;
				}
				max = tempMax;
			}
			
			
			var stepOYPart = stepOY.toString().split('.');
			var numPowOY;
			var tempVal;
			
			if(0 != stepOYPart[0])
				numPowOY = Math.pow(10, stepOYPart[0].toString().length - 1)
			if(10 == stepOYPart[0])
				numPowOY = 1;
			if(0 == stepOYPart[0])
			{
				var tempMax = stepOY;
				var num = -1;
				while(0 == tempMax.toString().split('.')[0])
				{
					tempMax = stepOY;
					numPowOY = Math.pow(10, num);
					tempMax = tempMax/numPowOY;
					num--;
				}
			}
			
			
			//поиск шага
			if(undefined != greaterNull)
			{
				 var greaterNullTemp = greaterNull.toString().split('.');
				if(0 != greaterNullTemp[0])
					greaterNullNum = Math.pow(10, greaterNullTemp[0].toString().length - 1)
				if(0 == greaterNullTemp[0])
				{
					var tempMax = greaterNull;
					var num = -1;
					while(0 == tempMax.toString().split('.')[0])
					{
						tempMax = greaterNull;
						greaterNullNum = Math.pow(10, num);
						tempMax = tempMax/greaterNullNum;
						num--;
					}
				}
				else if(greaterNull.toString().indexOf("e+") > -1)
				{
					var splitString = greaterNull.toString().split("e+");
					if(splitString[1])
						greaterNullNum = Math.pow(10, parseFloat(splitString[1]));
				}
				
				greaterNull = greaterNull/greaterNullNum;

					 if(1 < greaterNull && arrForRealDiff[0] >= greaterNull)
						greaterNull = 1;
					else if(arrForRealDiff[0] < greaterNull && arrForRealDiff[1] >= greaterNull)
						greaterNull = 2;
					else if(arrForRealDiff[1] < greaterNull && arrForRealDiff[2] >= greaterNull)
						greaterNull = 5;
					else if(arrForRealDiff[2] < greaterNull && 10 >= greaterNull)
						greaterNull = 10;
			   
				greaterNull = greaterNull*greaterNullNum;
				stepOY = greaterNull;
			}
			
			arr[0] = 0;arr[1] = 1;arr[2] = 2;arr[3] = 5;arr[4] = 10;
			//если максимальное значение больше числа из данного массива, меняем диапазон по оси OY
			var arrMaxVal = [0,0.952380952,1.904761904,4.76190476,9.523809523]
			//массив диапазонов
			var arrDiffVal1 = [0,0.2,0.5,1,2]
			if(axisXMin == 0 && undefined == greaterNull)//если разница между min и max такая, что не нужно масштабировать
			{
				var trueDiff = 1;
				for (var i=0; i<arr.length; i++) {
					if( max >= arr[i] && max <= arr[i+1])
					{
						var max1 = arr[i+1];
						var trueMax;
						var diff = max1/10;
						trueDiff = diff;
						var maxVal;
						//проверяем есть ли переход в следующий диапазон
						if(max > arrMaxVal[i+1])
						{
							trueDiff = arrDiffVal1[i+1]
						}
					}
				}
				stepOY = trueDiff*numPow;
			}
			
			if('HBar' == mainObj.type && mainObj.subType == 'stackedPer')
			{
				if(axisXMin < 0 && axisXMax > 0)
				{
					var summVal = Math.abs(axisXMin) + Math.abs(axisXMax)
					if(summVal <= 100)
						stepOY  = 10;
					else if(summVal > 100 && summVal <= 139)
						stepOY  = 20;
					else
						stepOY  = 50;
				}
				else
				{
					stepOY  = 20;
				}
			}
			
			//находим истинные min и max
			var testDiff;
			var axisXMinTest;
			if(axisXMin == 0)
			{
				testDiff = stepOY/numPow;
				axisXMinTest = axisXMin/numPow
			}
			else
			{
				testDiff = stepOY/numPowOY;
				axisXMinTest = axisXMin/numPowOY;
			}
			var tempNum;
			var countAfterPoint = 1;
			
			if(undefined != axisXMinTest.toString().split('.')[1])
			{
				countAfterPoint = Math.pow(10, axisXMinTest.toString().split('.')[1].toString().length - 1)
			}
			
			if(1 == testDiff)
				tempNum = testDiff/4;
			else if(2 == testDiff)
				tempNum = testDiff/4;
			else if(5 == testDiff)
				tempNum = testDiff/10;
			else if(10 == testDiff)
				tempNum = testDiff/20;
			axisXMinTest = Math.floor(axisXMinTest);
			while(0 != axisXMinTest%testDiff)
			{
				axisXMinTest = axisXMinTest - tempNum;
			}

			
			
			//возвращаем массив
			var varMin = axisXMinTest*numPowOY;
			var massRes = [];
			var tempKoff = 100000000000;
			varMin = this._round_val(varMin);


			var lengthNum;
			if(!trueOX)
			{
				
				if(chackBelowNull)
				{
					if(min == varMin && !checkIsMaxMin && min != 0 )
						varMin = varMin - stepOY ;
					varMin = varMin/degreeNum;
					stepOY = stepOY/degreeNum;
					axisXMax = axisXMax/degreeNum;
					max = max/degreeNum;
					if(undefined != varMin.toString().split('.')[1])
						lengthNum = varMin.toString().split('.')[1].length;
					for (var k=0; k <= 11; k++) {
						massRes[k] = this._round_val(varMin + (k)*(stepOY));
						if(massRes[k] > axisXMax)
						{
							break;
						}
					
					}
					if(massRes[massRes.length - 1] == max && !checkIsMaxMin)
						massRes[massRes.length] = massRes[massRes.length - 1] + stepOY;
					
					mainObj.ymax = -massRes[0];
					mainObj.ymin = -massRes[massRes.length - 1];
					//mainObj.max = -massRes[0];
				}
				else
				{
					if(min == varMin && !checkIsMaxMin)
						varMin = varMin - stepOY ;
					if(undefined != varMin.toString().split('.')[1])
						lengthNum = varMin.toString().split('.')[1].length;
					
					 varMin = varMin/degreeNum;
					stepOY = stepOY/degreeNum;
					axisXMax = axisXMax/degreeNum;
					max = max/degreeNum;
					
					if(min == 0 && (mainObj.type == 'Stock' || mainObj.type == 'Scatter'))
						varMin = 0;
					if(max == 0 && mainObj.type == 'Stock')
						axisXMax = 0 + stepOY;
					for (var k=0; k <= 11; k++) {
						massRes[k] = this._round_val(varMin + (k)*(stepOY));
						if(massRes[k] > axisXMax)
						{
							break;
						}
					
					}
					if(massRes[massRes.length - 1] == max && !checkIsMaxMin)
						massRes[massRes.length] = massRes[massRes.length - 1] + stepOY;
					//mainObj.max =  massRes[massRes.length - 1];
					mainObj.ymax = massRes[massRes.length - 1];
					mainObj.ymin = massRes[0];
				}
			}
			else
			{
				if(chackBelowNull)
				{
					if(min == varMin && !checkIsMaxMin && min != 0)
						varMin = varMin - stepOY ; 
					if(undefined != varMin.toString().split('.')[1])
						lengthNum = varMin.toString().split('.')[1].length;
					varMin = varMin/degreeNum;
					stepOY = stepOY/degreeNum;
					axisXMax = axisXMax/degreeNum;	
					max = max/degreeNum;
					for (var k=0; k <= 11; k++) {
						massRes[k] = this._round_val(varMin + (k)*(stepOY));
						if('HBar' == mainObj.type && mainObj.subType == 'stackedPer')
						{
							if(massRes[k] >= axisXMax)
							{
								break;
							}
						}
						else
						{
							if(massRes[k] > axisXMax)
							{
								break;
							}
						}
					
					}
					if(massRes[massRes.length - 1] == max && !checkIsMaxMin)
						massRes[massRes.length] = massRes[massRes.length - 1] + stepOY;
					
					mainObj.xmax = -massRes[0];
					mainObj.xmin = -massRes[massRes.length - 1];
				}
				else
				{
					if(min == varMin && !checkIsMaxMin &&  'HBar' != mainObj.type && mainObj.subType != 'stackedPer')
						varMin = varMin - stepOY ;
					if(undefined != varMin.toString().split('.')[1])
						lengthNum = varMin.toString().split('.')[1].length; 
					
					 varMin = varMin/degreeNum;
					stepOY = stepOY/degreeNum;
					axisXMax = axisXMax/degreeNum;
					max = max/degreeNum;
					for (var k=0; k <= 11; k++) {
						massRes[k] = this._round_val(parseFloat(varMin + (k)*(stepOY)));
						if('HBar' == mainObj.type && mainObj.subType == 'stackedPer')
						{
							if(massRes[k] >= axisXMax || massRes[k] >= 100)
							{
								break;
							}
						}
						else
						{
							if(massRes[k] > axisXMax)
							{
								break;
							}
						}
					}
					
					if(massRes[massRes.length - 1] == max && !checkIsMaxMin && !('HBar' == mainObj.type && mainObj.subType == 'stackedPer'))
						massRes[massRes.length] = massRes[massRes.length - 1] + stepOY;
					
					mainObj.xmax = massRes[massRes.length - 1];
					mainObj.xmin = massRes[0];
					mainObj.xmax = massRes[massRes.length - 1];
				}
			}
			if('hbar' == mainObj.type)
			{
				massRes.splice(0,1);
			}
			return this._array_exp(massRes);
		}
		else
		{
			var max1;
			var arr = [];
			//находим минимальное значение
			var min;
			var max;
			if('Bar' == mainObj.type || 'HBar' == mainObj.type)
			{
				if(mainObj.subType == 'stacked')
				{
					//суммируем отрицательные и положительные значения
					if(typeof(mainObj.data[0]) == 'object')
					{
						var arrMin = [];
						var arrMax = [];
						for (var j=0; j < mainObj.data.length; j++) {
							var allHeightAbNull = 0;
							var allHeightLessNull = 0;
							for (var i=0; i < mainObj.data[j].length; i++) 
								{
									
									if(mainObj.data[j][i] > 0)
										allHeightAbNull += mainObj.data[j][i];
									else
										allHeightLessNull += mainObj.data[j][i];
								}
								arrMin[j] = allHeightLessNull;
								arrMax[j] = allHeightAbNull;
						}
						min = Math.min.apply(null, arrMin);
						max = Math.max.apply(null, arrMax);
					}
					else
					{
						min = Math.min.apply(null, mainObj.data);
						max = Math.max.apply(null, mainObj.data);
					}
				}
				else
				{
					min = minVal;
					max = maxVal;
				}
			}
			else
			{
				if(('Line' == mainObj.type && mainObj.subType == 'stacked' ) || 'Line' != mainObj.type )
				{
					var arrMin = [];
					var arrMax = [];
					for (var j=0; j<mainObj.data.length; j++) {
						min = Math.min.apply(null, mainObj.data[j]);
						max = Math.max.apply(null, mainObj.data[j]);
						arrMin[j] = min;
						arrMax[j] = max;
					}	
					min = Math.min.apply(null, arrMin);
					max = Math.max.apply(null, arrMax);
				}
				else
				{	
					min = minVal;
					max = maxVal;
				}
			}
			
			if(max == min)
			{
				if(max > 0)
					min = 0;
				else if(max < 0)
					max = 0;
			}
			
			var degreeNum = 1;
			var maxString = max.toExponential();
			var minString = min.toExponential();
			var floatKoff = 10000000000;
			if(maxString.search('e-') != -1 || minString.search('e-') != -1)
			{
				var partMin  = minString.split('e-');
				var partMax  = maxString.split('e-');
				if(partMin[1] != undefined)
					degreeNum = Math.pow(10, partMin[1])
				if(partMax[1] != undefined && (parseFloat(partMin[1]) < parseFloat(partMax[1])))
					degreeNum = Math.pow(10, partMax[1])	
				max = this._round_val(max*degreeNum);
				min = this._round_val(min*degreeNum);
			}
			
			
			var axisXMax;
			var axisXMin;
			var stepOY;
			var checkInput = false;
			var greaterNull;
			var firstMax = max;
			var firstMin = min;
			
			
			var arrForRealDiff = [];
			if(max >= 0 && min >= 0)
			{
				var diffPerMaxMin = ((max - min)/max)*100;
				 axisXMax =  max + 0.05 * (max - min);
				stepOY = (max-min)/4;
				if(16.667 > diffPerMaxMin)
				{
					axisXMin = min - ((max - min) / 2);
					greaterNull = (max - min)/4;
					arrForRealDiff = [1.5873,3.1745,7.93651]
				}
				else
				{
					axisXMin = 0;
				}
			}
			else if(max <= 0 && min <= 0)
			{
				var tempMax = max;
				mainObj.xaxispos = 'top';
				max = Math.abs(min);
				min = Math.abs(tempMax);
				checkInput = true;
				var diffPerMaxMin = ((max - min)/max)*100;
				 axisXMax =  max + 0.05 * (max - min);
				stepOY = (max-min)/4;
				if(16.667 > diffPerMaxMin)
				{
					axisXMin = min - ((max - min) / 2);
					greaterNull = (max - min)/4;
					arrForRealDiff = [1.5873,3.1745,7.93651]
				}
				else
				{
					axisXMin = 0;
				}
			}
			else if(max > 0 && min < 0)
			{
				stepOY = (max + Math.abs(min))/4;
				axisXMax = max + 0.05 * (max - min);
				axisXMin = min + 0.05 * (min - max);
				greaterNull = (Math.abs(max) + Math.abs(min))/6;
				arrForRealDiff = [1.51515151,3.03030303,7.57575757]
			}
			
			
			//приведение к первому порядку для дальнейших вычислений
			var secPart = max.toString().split('.');
			var numPow = 1;
			if(secPart[1] && secPart[1].toString().search('e+') != -1 && secPart[0] && secPart[0].toString().length == 1)
			{
				var expNum = secPart[1].toString().split('e+');
				numPow = Math.pow(10, expNum[1]);
			}
			else if(0 != secPart[0])
				numPow = Math.pow(10, secPart[0].toString().length - 1)
			max = max/numPow;
			if((min == 0 && max == 0) ||(isNaN(min) && isNaN(max)))
					return [0.2,0.4,0.6,0.8,1,1.2];
			if(0 == max.toString().split('.')[0])
			{
				var tempMax = max;
				var num = -1;
				while(0 == tempMax.toString().split('.')[0])
				{
					tempMax = max;
					numPow = Math.pow(10, num);
					tempMax = tempMax/numPow;
					num--;
				}
				max = tempMax;
			}
			
			
			var stepOYPart = stepOY.toString().split('.');
			var numPowOY;
			var tempVal;
			
			if(0 != stepOYPart[0])
				numPowOY = Math.pow(10, stepOYPart[0].toString().length - 1)
			if(10 == stepOYPart[0])
				numPowOY = 1;
			if(0 == stepOYPart[0])
			{
				var tempMax = stepOY;
				var num = -1;
				while(0 == tempMax.toString().split('.')[0])
				{
					tempMax = stepOY;
					numPowOY = Math.pow(10, num);
					tempMax = tempMax/numPowOY;
					num--;
				}
			}
			
			
			//поиск шага
			if(undefined != greaterNull)
			{
				 var greaterNullTemp = greaterNull.toString().split('.');
				if(0 != greaterNullTemp[0])
					greaterNullNum = Math.pow(10, greaterNullTemp[0].toString().length - 1)
				if(0 == greaterNullTemp[0])
				{
					var tempMax = greaterNull;
					var num = -1;
					while(0 == tempMax.toString().split('.')[0])
					{
						tempMax = greaterNull;
						greaterNullNum = Math.pow(10, num);
						tempMax = tempMax/greaterNullNum;
						num--;
					}
				}
				
				greaterNull = greaterNull/greaterNullNum;
				if(1 < greaterNull && arrForRealDiff[0] >= greaterNull)
					greaterNull = 1;
				else if(arrForRealDiff[0] < greaterNull && arrForRealDiff[1] >= greaterNull)
					greaterNull = 2;
				else if(arrForRealDiff[1] < greaterNull && arrForRealDiff[2] >= greaterNull)
					greaterNull = 5;
				else if(arrForRealDiff[2] < greaterNull && 10 >= greaterNull)
					greaterNull = 10;
				greaterNull = greaterNull*greaterNullNum;
				stepOY = greaterNull;
			}
			
			arr[0] = 0;arr[1] = 1;arr[2] = 2;arr[3] = 5;arr[4] = 10;
			//если максимальное значение больше числа из данного массива, меняем диапазон по оси OY
			var arrMaxVal = [0,0.952380952,1.904761904,4.76190476,9.523809523]
			//массив диапазонов
			var arrDiffVal1 = [0,0.2,0.5,1,2]
			if(axisXMin == 0)//если разница между min и max такая, что не нужно масштабировать
			{
				var trueDiff = 1;
				for (var i=0; i<arr.length; i++) {
					if( max >= arr[i] && max <= arr[i+1])
					{
						var max1 = arr[i+1];
						var trueMax;
						var diff = max1/10;
						trueDiff = diff;
						var maxVal;
						//проверяем есть ли переход в следующий диапазон
						if(max > arrMaxVal[i+1])
						{
							trueDiff = arrDiffVal1[i+1]
						}
					}
				}
				stepOY = trueDiff*numPow;
			}
			
			
			stepOY = this._round_val(stepOY);
			
			
			
			//находим истинные min и max
			var testDiff;
			var axisXMinTest;
			if(axisXMin == 0)
			{
				testDiff = stepOY/numPow;
				axisXMinTest = axisXMin/numPow
			}
			else
			{
				testDiff = stepOY/numPowOY;
				axisXMinTest = axisXMin/numPowOY;
			}
			var tempNum;
			var countAfterPoint = 1;
			
			if(undefined != axisXMinTest.toString().split('.')[1])
			{
				countAfterPoint = Math.pow(10, axisXMinTest.toString().split('.')[1].toString().length - 1)
			}
			var floatKoff = 10000000000;
			if(0.5 == testDiff)
				tempNum = testDiff/5;
			else if(1 == testDiff)
				tempNum = testDiff/4;
			else if(2 == testDiff)
				tempNum = testDiff/4;
			else if(5 == testDiff)
				tempNum = testDiff/10;
			else
				tempNum = testDiff/20;
			if(testDiff != 0.5)
				axisXMinTest = Math.floor(axisXMinTest);
			else
			{
				axisXMinTest = Math.round(axisXMinTest*100)/100;
				if(axisXMinTest.toString().split('.')[1] != undefined)
				{
					var lengthAfterPoint = axisXMinTest.toString().split('.')[1].length;
					var l = 0;
					while(axisXMinTest.toString().split('.')[1].length != 1)
					{
						axisXMinTest = axisXMinTest - Math.pow(10,-(lengthAfterPoint));
						if(l > 9)
						{
							axisXMinTest = Math.floor(axisXMinTest);
							break;
						}
						l++;
					}
				}
				
			}
				
			while(0 != axisXMinTest%testDiff)
			{
				axisXMinTest = axisXMinTest - tempNum;
				if(testDiff == 0.5)
				{
					axisXMinTest = this._round_val(axisXMinTest);
				}
			}

			
			
			//возвращаем массив
			var varMin = axisXMinTest*numPowOY;
			var massRes = [];
			
			var tempKoff = 100000000000000;
			varMin = this._round_val(varMin);
			if(undefined != varMin.toString().split('.')[1])
				lengthNum = varMin.toString().split('.')[1].length;

			if('Line' == mainObj.type && max > 0 && min < 0)
			{
				//varMin  = varMin + stepOY;
				varMin = varMin/degreeNum;
				stepOY = stepOY/degreeNum;
				axisXMax = axisXMax/degreeNum;
				for (var k=0; k <= 11; k++) {
					massRes[k] = this._round_val((parseFloat(varMin + (k)*(stepOY))));
					if(massRes[k] > axisXMax)
					{
						break;
					}
			
				}
			}
			else
			{
				varMin = varMin/degreeNum;
				stepOY = stepOY/degreeNum;
				axisXMax = axisXMax/degreeNum;
				 for (var k=0; k <= 11; k++) {
					massRes[k] = this._round_val((varMin + (k)*(stepOY)));
					if(massRes[k] > axisXMax)
					{
						break;
					}
			
				}
			}
			if('HBar' == mainObj.type)
			{
				 mainObj.xmin = massRes[0] - stepOY;
				 mainObj.xmax = massRes[massRes.length - 1];
			}
			else if('line' == mainObj.type && max > 0 && min < 0)
			{
				mainObj.ymax = massRes[massRes.length - 1];
				mainObj.ymin = this._round_val(this._array_exp(massRes[0] - stepOY));
			}
			else
			{
				mainObj.ymax = massRes[massRes.length - 1];
				mainObj.ymin = this._round_val(this._array_exp(massRes[0] - stepOY));
			}
			return this._array_exp(massRes);
		}
	},
	
	_round_val: function (num)
	{
		if(num.toString() && num.toString().indexOf('e+') == -1 && isNaN(parseFloat(num)))
			return num;
		var floatKoff = 100000000000;
		if(num.toString() && num.toString().indexOf('e+') > -1)
		{
			var parseVal = num.toString().split("e+");
			var roundVal = Math.round(parseFloat(parseVal[0])*floatKoff)/floatKoff;
			var changeSymbol = roundVal.toString() + "e+" + parseVal[1];
			num = parseFloat(changeSymbol);
		}
		num =  Math.round(num*floatKoff)/floatKoff ;
		return num;
	},
	
	_array_exp: function (arr)
    {
		var maxDig = 1000000000;
		var minDig = 0.000000001;
		var floatKoff = 100000000000;
		
		if(typeof(arr) == 'number')
		{
			if(arr < 0)
				maxDig = 100000000;
			if(Math.abs(arr) > maxDig)
			{
				var tmp = Math.abs(arr);
				var exp = 0;
				while (tmp > 9) {
					exp += 1;
					tmp /= 10;
				}
				if(arr < 0)
					tmp *= -1; 
				arr = tmp + "E+" + exp;
			}
		}
		else
		{
			for (var i=0; i<arr.length; ++i) {
			maxDig = 1000000000
			if(arr[i] < 0)
				maxDig = 100000000;
				if(Math.abs(arr[i]) > maxDig)
				{
					var tmp = Math.abs(arr[i]);
					var exp = 0;
					while (tmp > 9) {
						exp += 1;
						tmp /= 10;
					}
					tmp = Math.round(tmp*floatKoff)/floatKoff
					if(arr[i] < 0)
						tmp *= -1; 
					arr[i] = tmp + "E+" + exp;
				}
			}
		}
		return arr;
	},
	
	_array_reverse: function (arr)
    {
        var newarr = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            newarr.push(arr[i]);
        }
        return newarr;
    },
	
	_convert3DTo2D: function(x, y, z, p, q, r)
	{
		var convertMatrix = [[1, 0, 0, p], [0, 1, 0, q], [0, 0, 0, r], [0, 0, 0, 1]];
		
		var qC = x * convertMatrix[0][3] + y * convertMatrix[1][3] + z * convertMatrix[2][3] + 1;
		var newX = (x * convertMatrix[0][0] + y * convertMatrix[1][0] + z1 * convertMatrix[2][0] - 0)/(qC);
		var newY = (x * convertMatrix[0][1] + y * convertMatrix[1][1] + z1 * convertMatrix[2][1] - 0)/(qC);
		return {x: newX, y: newY};
	},
	
	_turnCoords: function(x, y, z, angleOX, angleOY, angleOZ)
	{
		var newX, newY, newZ;
		
		//around OY
		newX = x * Math.cos(angleOY) - z * Math.sin(angleOY);
		newY = y;
		newZ = x * Math.sin(angleOY) + z * Math.cos(angleOY);
		
		//around OX
		newX = newX;
		newY = newY * Math.cos(angleOX) + newZ * Math.sin(angleOX);
		newZ = newZ * Math.cos(angleOX) - newY * Math.sin(angleOX);
		
		//around OZ
		newX = newX * Math.cos(angleOZ) + newY * Math.sin(angleOZ);
		newY = newY * Math.cos(angleOZ) - newX * Math.sin(angleOZ);
		newZ = newZ;
		
		return {x: newX,y: newY,z: newZ};
	}
}



//*****BAR CHART*****
function drawBarChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.paths = {};
}

drawBarChart.prototype =
{
    reCalculate : function(chartProp, cShapeDrawer)
	{
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.paths = {};
		
		this._reCalculateBars();
	},
	
	draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;

		this._DrawBars();
	},
	
	_DrawBars: function()
	{
		var brush, pen, seria;
		for (i = 0; i < this.paths.series.length; i++) {
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;

			for (j=0; j < this.paths.series[i].length; ++j) {
				if(seria.val.numRef.numCache.pts[j].pen)
					pen = seria.val.numRef.numCache.pts[j].pen;
				if(seria.val.numRef.numCache.pts[j].brush)
					brush = seria.val.numRef.numCache.pts[j].brush;
					
				this._drawPaths(this.paths.series[i][j], brush, pen);
			}
		}
	},
	
	_reCalculateBars: function (/*isSkip*/)
    {
        var xaxispos      = this.chartProp.xaxispos;
		var widthGraph    = this.chartProp.widthCanvas - this.chartProp.chartGutter._left - this.chartProp.chartGutter._right;
        var width         = widthGraph / this.chartProp.series[0].val.numRef.numCache.pts.length;
        var hmargin       = this.chartProp.hmargin;
		
		var val;
		var paths;
		var individualBarWidth;
		var height;
		var startX;
		var startY;
		
		var seriesHeight = [];
		var diffYVal;
		//для диаграммы с накполениями
		var summBarVal = [];

		for (i = 0; i < this.chartProp.series.length; i++) {

			var seria = this.chartProp.series[i].val.numRef.numCache.pts;
			
			seriesHeight[i] = [];
			for (j=0; j < seria.length; ++j) {
				
				individualBarWidth = (width - (2 * hmargin)) / this.chartProp.series.length;
				if(this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer")
					individualBarWidth = width - (2 * hmargin);
					
				val = parseFloat(seria[j].val);
				if(this.chartProp.scale[0] > 0 && this.chartProp.scale[this.chartProp.scale.length - 1] > 0)
				{
					if(val > 0)
						height = ((val - this.chartProp.scale[0]) / (this.chartProp.max - this.chartProp.min)) * this.chartProp.trueHeight;
					else
						height = ((val + this.chartProp.scale[0]) / (this.chartProp.max - this.chartProp.min)) * this.chartProp.trueHeight;
				}
				else
					height = (val / (this.chartProp.max - this.chartProp.min)) * this.chartProp.trueHeight;
				
				//обработка для диаграмм с накоплениями
				if(this.chartProp.subType == "stacked")
				{
					startX = (j * width) + this.chartProp.chartGutter._left + hmargin;
					diffYVal = 0;
					for(var k = 0; k < seriesHeight.length; k++)
					{
						if(seriesHeight[k][j] && ((val > 0 && seriesHeight[k][j] > 0) || (val < 0 && seriesHeight[k][j] < 0)))
							diffYVal += seriesHeight[k][j];
					}
					startY = this.chartProp.nullPositionOX - diffYVal;
					seriesHeight[i][j] = height;
				}
				else if(this.chartProp.subType == "stackedPer")
				{
					startX = (j * width) + this.chartProp.chartGutter._left + hmargin;
					diffYVal = 0;
					for(var k = 0; k < seriesHeight.length; k++)
					{
						if(seriesHeight[k][j] && ((val > 0 && seriesHeight[k][j] > 0) || (val < 0 && seriesHeight[k][j] < 0)))
							diffYVal += seriesHeight[k][j];
					}
					
					var tempVal;
					var temp = 0;
					if(!summBarVal[j])
					{
						for(var k = 0; k < this.chartProp.series.length; k++)
						{
							tempVal = parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[j].val);
							if(tempVal)
								temp += Math.abs(tempVal);
						}
						summBarVal[j] = temp;
					}
					
					height = ((val*100/summBarVal[j]) / (this.chartProp.max - this.chartProp.min)) * this.chartProp.trueHeight;
					startY = this.chartProp.nullPositionOX - diffYVal;
					seriesHeight[i][j] = height;
				}
				else
				{
					startX = (j * width) + this.chartProp.chartGutter._left + hmargin + (i * individualBarWidth);
					startY = this.chartProp.nullPositionOX;
				}

				if(height != 0)
				{
					paths = this._calculateRect(startX, startY, individualBarWidth, height);
					
					if(!this.paths.series)
						this.paths.series = [];
					if(!this.paths.series[i])
						this.paths.series[i] = [];
					this.paths.series[i][j] = paths;
				}
			}
        }
    },
	
	
	_calculateRect : function(x, y, w, h)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		
		path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x / pxToMm * pathW, (y - h) / pxToMm * pathH);
		path.lnTo((x + w) / pxToMm * pathW, (y - h) / pxToMm * pathH);
		path.lnTo((x + w) / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.recalculate(gdLst);
		
		return path;
	}, 
	
	_drawPaths: function(paths, brush, pen)
	{
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		cGeometry.AddPath(paths);
		this.cShapeDrawer.draw(cGeometry);
	}
}



//*****LINE CHART*****
function drawLineChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.cChartSpace = null;
	this.paths = {};
}

drawLineChart.prototype =
{
    draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this._drawLines();
	},
	
	reCalculate : function(chartProp, cChartSpace)
    {
		this.paths = {};
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cChartSpace = cChartSpace;
		this._calculateLines();
	},
	
	_calculateLines: function ()
	{
		var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;
		var min = this.chartProp.scale[0];
		var max = this.chartProp.scale[this.chartProp.scale.length - 1];
			
		var digHeight = Math.abs(max - min);
		
		if(this.chartProp.min < 0 && this.chartProp.max <= 0 && this.chartProp.subType != "stackedPer")
			min = -1*max;

		var koffX = trueWidth/this.chartProp.numvlines;
		var koffY = trueHeight/digHeight;
		
		for (i = 0; i < this.chartProp.series.length; i++) {
		
			var seria = this.chartProp.series[i];
			
			var dataSeries = seria.val.numRef.numCache.pts;
			
			var y, y1, x, x1, val, nextVal, tempVal;
		
			for(var n = 0; n < dataSeries.length - 1; n++)
			{
				//рассчитываем значения				
				val = this._getYVal(n, i) - min;
				nextVal = this._getYVal(n + 1, i) - min;
				
				y  = trueHeight - (val)*koffY + this.chartProp.chartGutter._top;
				y1 = trueHeight - (nextVal)*koffY + this.chartProp.chartGutter._top;
				
				x  = this.chartProp.chartGutter._left + (n)*koffX + koffX/2; 
				x1 = this.chartProp.chartGutter._left + (n + 1)*koffX + koffX/2;
				
				if(!this.paths.series)
					this.paths.series = [];
				if(!this.paths.series[i])
					this.paths.series[i] = []
				
				this.paths.series[i][n] = this._calculateLine(x, y, x1, y1);
				
				//caclculate dataLablels
				/*posDlbl = this._calculateDLbl(dataSeries[n - 1], x, y);
				dataSeries[n - 1].compiledDlb.setPosition(posDlbl.x, posDlbl.y);
				if(n == dataSeries.length - 1)
				{
					posDlbl = this._calculateDLbl(dataSeries[n], x1, y1);
					dataSeries[n].compiledDlb.setPosition(posDlbl.x, posDlbl.y);
				}*/
			}
		}
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var point = this.chartProp.series[ser].val.numRef.numCache.pts[val];
		var path;
		
		if(val == this.chartProp.series[ser].val.numRef.numCache.pts.length - 1)
			path = this.paths.series[ser][val - 1].ArrPathCommand[1];
		else
			path = this.paths.series[ser][val].ArrPathCommand[0];
			
		var x = path.X;
		var y = path.Y;
		
		var pxToMm = this.chartProp.pxToMM;
		var constMargin = 5 / pxToMm;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX = x - width/2;
		var centerY = y - height/2;
		
		//TODO высчитать позиции, как в екселе
		switch ( point.compiledDlb.dLblPos )
		{
			case DLBL_POS_B:
			{
				centerY = centerY + height/2 + constMargin;
				break;
			}
			case DLBL_POS_BEST_FIT:
			{
				//centerY = centerY + 27 / pxToMm;
				break;
			}
			case DLBL_POS_CTR:
			{
				break;
			}
			case DLBL_POS_IN_BASE:
			{
				//centerY = centerY + 27 / pxToMm;
				break;
			}
			case DLBL_POS_IN_END:
			{
				//centerY = centerY + 27 / pxToMm;
				break;
			}
			case DLBL_POS_L:
			{
				centerX = centerX - height/2 - constMargin;
				break;
			}
			case DLBL_POS_OUT_END:
			{
				//centerY = centerY + 27 / pxToMm;
				break;
			}
			case DLBL_POS_R:
			{
				centerX = centerX + height/2 + constMargin;
				break;
			}
			case DLBL_POS_T:
			{
				centerY = centerY - height/2 - constMargin;
				break;
			}
		}
		return {x: centerX, y: centerY};
	},
	
	_drawLines: function (isRedraw/*isSkip*/)
    {
		var brush;
		var pen;
		var dataSeries;
		var seria;
		for (i = 0; i < this.chartProp.series.length; i++) {
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;
			
			dataSeries = seria.val.numRef.numCache.pts;
			for(var n = 0; n < dataSeries.length - 1; n++)
			{
				if(seria.val.numRef.numCache.pts[n].pen)
					pen = seria.val.numRef.numCache.pts[n].pen;
				if(seria.val.numRef.numCache.pts[n].brush)
					brush = seria.val.numRef.numCache.pts[n].brush;
					
				this._drawPath(this.paths.series[i][n], brush, pen);
			}
        }
    },
	
	_getYVal: function(n, i)
	{
		var tempVal;
		var val = 0;
		if(this.chartProp.subType == "stacked")
		{
			for(var k = 0; k <= i; k++)
			{
				tempVal = parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[n].val);
				if(tempVal)
					val += tempVal;
			}
		}
		else if(this.chartProp.subType == "stackedPer")
		{
			var summVal = 0;
			for(var k = 0; k < this.chartProp.series.length; k++)
			{
				tempVal = parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[n].val);
				if(tempVal)
				{
					if(k <= i)
						val += tempVal;
					summVal += Math.abs(tempVal);
				}
			}
			val = val*100/summVal;
		}
		else
		{
			val = parseFloat(this.chartProp.series[i].val.numRef.numCache.pts[n].val);
		}
		return val;
	},
	
	_calculateLine : function(x, y, x1, y1)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x1 / pxToMm * pathW, y1 / pxToMm * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawPath : function(path, brush, pen)
	{
		path.stroke = true;
		
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
}



//*****AREA CHART*****
function drawAreaChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.paths = {};
}

drawAreaChart.prototype =
{
    
	draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this._drawLines();
	},
	
	reCalculate : function(chartProp, cShapeDrawer)
    {
		this.paths = {};
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this._calculateLines(true);
	},
	
	_calculateLines: function (/*isSkip*/)
    {
        var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;
		var min = this.chartProp.scale[0];
		var max = this.chartProp.scale[this.chartProp.scale.length - 1];
			
		var digHeight = Math.abs(max - min);
		
		if(this.chartProp.min < 0 && this.chartProp.max <= 0 && this.chartProp.subType != "stackedPer")
			min = -1*max;
		
		var koffX = trueWidth/this.chartProp.numvlines;
		var koffY = trueHeight/digHeight;	
		
		var seria;
		for (i = 0; i < this.chartProp.series.length; i++) {
			
			//в случае накопительных дигарамм, рисуем в обратном порядке
			if(this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked")
				seria = this.chartProp.series[this.chartProp.series.length - 1 - i];
			else
				seria = this.chartProp.series[i];
			
			var dataSeries = seria.val.numRef.numCache.pts;
			var y, y1, x, x1, val, prevVal, tempVal;
			for(var n = 1; n < dataSeries.length; n++)
			{
				//рассчитываем значения				
				prevVal = this._getYVal(n - 1, i) - min;
				val = this._getYVal(n, i) - min;
				
				y  = trueHeight - (prevVal)*koffY + this.chartProp.chartGutter._top;
				y1 = trueHeight - (val)*koffY + this.chartProp.chartGutter._top;
				
				x  = this.chartProp.chartGutter._left + (n - 1)*koffX; 
				x1 = this.chartProp.chartGutter._left + n*koffX;
				
				if(!this.paths.series)
					this.paths.series = [];
				if(!this.paths.series[i])
					this.paths.series[i] = []
				
				this.paths.series[i][n] = this._calculateLine(x, y, x1, y1);
			}
        }
    },
	
	_drawLines: function (/*isSkip*/)
    {
		//для цветов серий
		var colorProps = this.cChartDrawer._getColorProps();
		
		//ширина линии
		var brush;
		var FillUniColor;
		var pen;
		var seria, dataSeries;
		for (i = 0; i < this.chartProp.series.length; i++) {
			
			//в случае накопительных дигарамм, рисуем в обратном порядке
			if(this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked")
				seria = this.chartProp.series[this.chartProp.series.length - 1 - i];
			else
				seria = this.chartProp.series[i];
			
			brush = seria.brush;
			pen = seria.pen;

			dataSeries = seria.val.numRef.numCache.pts;
			for(var n = 1; n < dataSeries.length; n++)
			{
				if(seria.val.numRef.numCache.pts[n].pen)
					pen = seria.val.numRef.numCache.pts[n].pen;
				if(seria.val.numRef.numCache.pts[n].brush)
					brush = seria.val.numRef.numCache.pts[n].brush;
				
				this._drawPath(this.paths.series[i][n], brush, pen);
			}
        }
    },
	
	_getYVal: function(n, i)
	{
		var tempVal;
		var val = 0;
		if(this.chartProp.subType == "stacked")
		{
			for(var k = 0; k <= (this.chartProp.series.length - i - 1); k++)
			{
				tempVal = parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[n].val);
				if(tempVal)
					val += tempVal;
			}
		}
		else if(this.chartProp.subType == "stackedPer")
		{
			var summVal = 0;
			for(var k = 0; k < this.chartProp.series.length; k++)
			{
				tempVal = parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[n].val);
				if(tempVal)
				{
					if(k <= (this.chartProp.series.length - i - 1))
						val += tempVal;
					summVal += Math.abs(tempVal);
				}
			}
			val = val*100/summVal;
		}
		else
		{
			val = parseFloat(this.chartProp.series[i].val.numRef.numCache.pts[n].val);
		}
		return val;
	},
	
	_calculateLine : function(x, y, x1, y1)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x1 / pxToMm * pathW, y1 / pxToMm * pathH);
		path.lnTo(x1 / pxToMm * pathW, this.chartProp.nullPositionOX / pxToMm * pathH);
		path.lnTo(x / pxToMm * pathW, this.chartProp.nullPositionOX / pxToMm * pathH);
		path.lnTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawPath : function(path, brush, pen)
	{
		//path.stroke = true;
		
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
}



//*****HBAR CHART*****
function drawHBarChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.paths = {};
}

drawHBarChart.prototype =
{
    reCalculate : function(chartProp, cShapeDrawer)
	{
		this.paths = {};
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this._recalculateBars();
	},
	
	draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this._drawBars();
	},
	
	_recalculateBars: function ()
    {
        var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;
		
		var seriesHeight = [];
		for (i = 0; i < this.chartProp.series.length; i++) {
			var width;
			var summBarVal = [];
			seriesHeight[i] = [];
		
			var tempMax = this.chartProp.xmax;
			var tempMin = this.chartProp.xmin;
			var height  = trueHeight / this.chartProp.data.length;
			
			var seria = this.chartProp.series[i].val.numRef.numCache.pts;
			
			for (j = 0; j < seria.length; j++) {

				var width;
				var val = parseFloat(seria[j].val);
				
				if(this.chartProp.subType == "stackedPer")
				{
					var tempVal;
					var temp = 0;
					if(!summBarVal[j])
					{
						for(var k = 0; k < this.chartProp.series.length; k++)
						{
							tempVal = parseFloat(this.chartProp.series[k].val.numRef.numCache.pts[j].val);
							if(tempVal)
								temp += Math.abs(tempVal);
						}
						summBarVal[j] = temp;
					}
					
					val = val*100/summBarVal[j];
				}
				
				if(tempMin < 0 && tempMax > 0)
					width = (val) / (tempMax - tempMin) * (trueWidth);
				else if(tempMin < 0 && tempMax < 0)
					width = ((val - tempMin) / (tempMax - tempMin)) * (trueWidth);
				else if(tempMin < 0 && tempMax == 0)
					width = trueWidth - ((val - tempMin) / (tempMax - tempMin)) * (trueWidth);
				else
					width = ((val < 0 ? (val + tempMin): val - tempMin) / (tempMax - tempMin)) * (trueWidth);
				

				var height = trueHeight / seria.length;

				var barHeight = (height - (2 * this.chartProp.vmargin)) / this.chartProp.series.length;
				if(this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer")
					barHeight = height - (2 * this.chartProp.vmargin);
				
				var startX;
				var startY;
				var diffYVal = 0;
				
				//для накопительных диаграмм
				if(this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer")
				{
					diffYVal = 0;
					for(var k = 0; k < seriesHeight.length; k++)
					{
						if(seriesHeight[k][j] && ((val > 0 && seriesHeight[k][j] > 0) || (val < 0 && seriesHeight[k][j] < 0) || (tempMax <=0 && tempMin < 0)))
							diffYVal += seriesHeight[k][j];
					}
					seriesHeight[i][j] = width;
					startY = trueHeight  + this.chartProp.chartGutter._top - this.chartProp.vmargin - (j * height);
					
					if(tempMax <=0 && tempMin < 0)
						diffYVal = -1*diffYVal;
				}
				else
					startY = trueHeight  + this.chartProp.chartGutter._top - this.chartProp.vmargin - (j * height + i * barHeight);
				
				if(tempMin < 0 && tempMax < 0)
					startX = this.chartProp.nullPositionOX - width;
				else if(0 > val && tempMin < 0 && tempMax > 0)
					startX = this.chartProp.nullPositionOX;
				else if(0 > val)
					startX = this.chartProp.nullPositionOX - width;
				else
					startX = this.chartProp.nullPositionOX;
				
				startX = startX + diffYVal;
				
				if (width < 0) {
					startX += width;
					width *= -1;
				}
				
				if(!this.paths.series)
					this.paths.series = [];
				if(!this.paths.series[i])
					this.paths.series[i] = [];
					
				if(width != 0)
					this.paths.series[i][j] = this._calculateRect(startX, startY, width, barHeight);
			}
		}
    },
	
	_drawBars: function ()
    {
		var brush;
		var pen;
		var lineWidth;
		var dataSeries;
		var seria;
		for (i = 0; i < this.chartProp.series.length; i++) {
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;
			dataSeries = this.chartProp.series[i].val.numRef.numCache.pts;
			
			for (j = 0; j < dataSeries.length; j++) {
				if(seria.val.numRef.numCache.pts[j].pen)
					pen = seria.val.numRef.numCache.pts[j].pen;
				if(seria.val.numRef.numCache.pts[j].brush)
					brush = seria.val.numRef.numCache.pts[j].brush;
			
				this._drawPath(this.paths.series[i][j], brush, pen);
			}
		}
    },
	
	_calculateRect : function(x, y, w, h)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		
		path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x / pxToMm * pathW, (y - h) / pxToMm * pathH);
		path.lnTo((x + w) / pxToMm * pathW, (y - h) / pxToMm * pathH);
		path.lnTo((x + w) / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawPath : function(path, brush, pen)
	{
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
}



//*****PIE CHART*****
function drawPieChart()
{
	this.tempAngle = null;
	this.paths = {};
}

drawPieChart.prototype =
{
    draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this._drawPie();
	},
	
	reCalculate : function(chartProp, cShapeDrawer)
	{
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.tempAngle = null;
		this.paths = {};
		this._reCalculatePie();
	},	
	
	_drawPie: function ()
    {
		var numCache = this.chartProp.series[0].val.numRef.numCache.pts;
		var brush, pen, val;
		var path;
        for (var i = 0,len = numCache.length; i < len; i++) {
			val = this.chartProp.series[0].val.numRef.numCache.pts[i];
			brush = val.brush;
			pen = val.pen;
			path = this.paths.series[i];
            this._drawPath(path, brush, pen);
        }
		
    },
	
	_reCalculatePie: function ()
    {
		var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;

		var numCache = this.chartProp.series[0].val.numRef.numCache.pts;
		var sumData = this.cChartDrawer._getSumArray(numCache, true);
		var radius = trueHeight/2;
		var xCenter = this.chartProp.chartGutter._left + trueWidth/2;
		var yCenter = this.chartProp.chartGutter._top + trueHeight/2;
		
		this.tempAngle = Math.PI/2;
		//рисуем против часовой стрелки, поэтому цикл с конца
        for (var i = numCache.length - 1; i >= 0; i--) {
            var angle = Math.abs((parseFloat(numCache[i].val / sumData)) * (Math.PI * 2));
			if(!this.paths.series)
				this.paths.series = [];
            this.paths.series[i] = this._calculateSegment(angle, radius, xCenter, yCenter);
        }
    },
	
	_calculateSegment: function (angle, radius, xCenter, yCenter)
    {
		var startAngle = (this.tempAngle);
		var endAngle   = angle;
		
		if(radius < 0)
			radius = 0;
		var path = this._calculateArc(radius, startAngle, endAngle, xCenter, yCenter);

        this.tempAngle += angle;
		
		return path;
    },
	
	_calculateArc : function(radius, stAng, swAng, xCenter, yCenter)
	{	
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		
		var x0 = xCenter + radius*Math.cos(stAng);
		var y0 = yCenter - radius*Math.sin(stAng);
		
		path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		path.lnTo(x0 / pxToMm * pathW, y0 / pxToMm * pathH);
		path.arcTo(radius / pxToMm * pathW, radius / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swAng*cToDeg);
		path.lnTo(xCenter / pxToMm * pathW, yCenter / pxToMm * pathH);

		path.recalculate(gdLst);
		return path;	
	},
	
	_drawPath : function(path, brush, pen)
	{
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
};



//*****Scatter CHART*****
function drawScatterChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.paths = {};
}

drawScatterChart.prototype =
{
    reCalculate : function(chartProp, cShapeDrawer)
	{
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.paths = {};
		
		this._recalculateScatter();
	},
	
	draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		
		this._drawScatter();
	},
	
	_recalculateScatter: function ()
    {
		var trueHeight = this.chartProp.trueHeight;
		var trueWidth  = this.chartProp.trueWidth;
		
		var minOy = this.chartProp.ymin;
		var maxOy = this.chartProp.ymax;
		var maxOx = this.chartProp.xScale[this.chartProp.xScale.length - 1];
		var minOx = this.chartProp.xScale[0];
		
		var digHeightOy = Math.abs(maxOy - minOy);
		var digHeightOx = Math.abs(maxOx - minOx);

		var koffX = trueWidth/digHeightOx;
		var koffY = trueHeight/digHeightOy;	
		
		var seria, yVal, xVal, points, x, x1, y, y1;
		for(var i = 0; i < this.chartProp.series.length; i++)
		{
			seria = this.chartProp.series[i];
			points = [];
			for(var n = 0; n < seria.yVal.numRef.numCache.pts.length; n++)
			{
				yVal = parseFloat(seria.yVal.numRef.numCache.pts[n].val);
				if(seria.xVal && seria.xVal.numRef.numCache.pts[n] && seria.xVal.numRef.numCache.pts[n].val)
				{
					if(!isNaN(parseFloat(seria.xVal.numRef.numCache.pts[n].val)))
						xVal = parseFloat(seria.xVal.numRef.numCache.pts[n].val);
					else
						xVal = n + 1;
				}
				else
					xVal = n + 1;
				
				points[n] = {x: xVal, y: yVal}
			}
			
			for(var k = 1; k < points.length; k++)
			{
				if(minOy >= 0 && maxOy > 0)
				{
					y  = trueHeight - (points[k-1].y - Math.abs(minOy))*koffY + this.chartProp.chartGutter._top;
					y1 = trueHeight - (points[k].y - Math.abs(minOy))*koffY + this.chartProp.chartGutter._top;
				}
				else
				{
					y  = trueHeight - (points[k-1].y + Math.abs(minOy))*koffY + this.chartProp.chartGutter._top;
					y1 = trueHeight - (points[k].y + Math.abs(minOy))*koffY + this.chartProp.chartGutter._top;
				}
				
				x  = (points[k-1].x + Math.abs(minOx))*koffX + this.chartProp.chartGutter._left;
				x1 = (points[k].x + Math.abs(minOx))*koffX + this.chartProp.chartGutter._left;
				
				if(!this.paths.series)
					this.paths.series = [];
				if(!this.paths.series[i])
					this.paths.series[i] = [];
				
				if(!this.paths.points)
					this.paths.points = [];
				if(!this.paths.points[i])
					this.paths.points[i] = [];
					
				this.paths.series[i][k] = this._calculateLine(x, y, x1, y1);
				if(k == 1)
					this.paths.points[i][0] = this._calculatePoint(x, y, seria.yVal.numRef.numCache.pts[0].compiledMarker.size, seria.yVal.numRef.numCache.pts[0].compiledMarker.symbol);
				this.paths.points[i][k] = this._calculatePoint(x1, y1, seria.yVal.numRef.numCache.pts[k].compiledMarker.size, seria.yVal.numRef.numCache.pts[k].compiledMarker.symbol);
			}
		}
    },
	
	_drawScatter: function ()
    {
		var seria, brush, pen, markerBrush, markerPen;
		for(var i = 0; i < this.paths.series.length; i++)
		{
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;
			
			for(var k = 1; k < this.paths.series[i].length; k++)
			{
				brush = this.chartProp.series[i].brush;
				pen = this.chartProp.series[i].pen;
				
				if(this.chartProp.series[i].yVal.numRef.numCache.pts[k].pen)
					pen = this.chartProp.series[i].yVal.numRef.numCache.pts[k].pen;
				if(this.chartProp.series[i].yVal.numRef.numCache.pts[k].brush)
					brush = this.chartProp.series[i].yVal.numRef.numCache.pts[k].brush;
					
				//draw line
				this._drawPath(this.paths.series[i][k], brush, pen, true);
				
				//draw point
				if(k == 1)
				{
					markerBrush = this.chartProp.series[i].yVal.numRef.numCache.pts[0].compiledMarker.brush;
					markerPen = this.chartProp.series[i].yVal.numRef.numCache.pts[0].compiledMarker.pen;
					
					//frame of point
					if(this.paths.points[i][0].framePaths)
						this._drawPath(this.paths.points[i][0].framePaths, markerBrush, markerPen, false);
					//point	
					this._drawPath(this.paths.points[i][0].path, markerBrush, markerPen, true);
				}
				markerBrush = this.chartProp.series[i].yVal.numRef.numCache.pts[k].compiledMarker.brush;
				markerPen = this.chartProp.series[i].yVal.numRef.numCache.pts[k].compiledMarker.pen;
				
				//frame of point
				if(this.paths.points[i][0].framePaths)
					this._drawPath(this.paths.points[i][k].framePaths, markerBrush, markerPen, false);
				//point		
				this._drawPath(this.paths.points[i][k].path, markerBrush, markerPen, true);
			}
		}
    },
	
	_calculateLine: function(x, y, x1, y1)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		path.moveTo(x / pxToMm * pathH, y / pxToMm * pathW);
		path.lnTo(x1 / pxToMm * pathH, y1 / pxToMm * pathW);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_calculatePoint: function(x, y, size, symbol)
	{
		size = size / 0.76;
		var halfSize = size/2;
		var path  = new Path();
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];

		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var framePaths = null;
		
		var pxToMm = this.chartProp.pxToMM;
		var result;

		/*
		var SYMBOL_PICTURE = 5;*/

		switch ( symbol )
		{
			case SYMBOL_DASH:
			{
				path.moveTo((x - halfSize) / pxToMm * pathW, y / pxToMm * pathW);
				path.lnTo((x + halfSize) / pxToMm * pathW, y / pxToMm * pathW);
				break;
			}
			case SYMBOL_DOT:
			{
				path.moveTo((x - halfSize / 2) / pxToMm * pathW, y / pxToMm * pathW);
				path.lnTo((x + halfSize / 2) / pxToMm * pathW, y / pxToMm * pathW);
				break;
			}
			
			case SYMBOL_PLUS:
			{
				path.moveTo(x / pxToMm * pathW, (y  + halfSize) / pxToMm * pathW);
				path.lnTo(x / pxToMm * pathW, (y  - halfSize) / pxToMm * pathW);
				path.moveTo((x - halfSize) / pxToMm * pathW, y / pxToMm * pathW);
				path.lnTo((x  + halfSize) / pxToMm * pathW, y / pxToMm * pathW);
				break;
			}
			
			case SYMBOL_CIRCLE:
			{
				path.moveTo((x + halfSize) / pxToMm * pathW, y / pxToMm * pathW);
				path.arcTo(halfSize / pxToMm * pathW, halfSize / pxToMm * pathW, 0, Math.PI * 2 * cToDeg);
				break;
			}
			
			case SYMBOL_STAR:
			{
				path.moveTo((x - halfSize) / pxToMm * pathW, (y  + halfSize) / pxToMm * pathW);
				path.lnTo((x + halfSize) / pxToMm * pathW, (y  - halfSize) / pxToMm * pathW);
				path.moveTo((x + halfSize) / pxToMm * pathW, (y  + halfSize) / pxToMm * pathW);
				path.lnTo((x  - halfSize) / pxToMm * pathW, (y  - halfSize) / pxToMm * pathW);
				path.moveTo(x / pxToMm * pathW, (y  + halfSize) / pxToMm * pathW);
				path.lnTo(x / pxToMm * pathW, (y  - halfSize) / pxToMm * pathW);
				break;
			}
			
			case SYMBOL_X:
			{
				path.moveTo((x - halfSize) / pxToMm * pathW, (y  + halfSize) / pxToMm * pathW);
				path.lnTo((x + halfSize) / pxToMm * pathW, (y  - halfSize) / pxToMm * pathW);
				path.moveTo((x + halfSize) / pxToMm * pathW, (y  + halfSize) / pxToMm * pathW);
				path.lnTo((x  - halfSize) / pxToMm * pathW, (y  - halfSize) / pxToMm * pathW);
				break;
			}
			
			case SYMBOL_TRIANGLE:
			{
				path.moveTo((x - size/Math.sqrt(3)) / pxToMm * pathW, (y  + size/3) / pxToMm * pathW);
				path.lnTo(x / pxToMm * pathW, (y  - (2/3)*size) / pxToMm * pathW);
				path.lnTo((x + size/Math.sqrt(3)) / pxToMm * pathW, (y  + size/3) / pxToMm * pathW)
				path.lnTo((x - size/Math.sqrt(3)) / pxToMm * pathW, (y  + size/3) / pxToMm * pathW);
				break;
			}
			
			case SYMBOL_SQUARE:
			{
				path.moveTo((x - halfSize) / pxToMm * pathW, (y + halfSize) / pxToMm * pathW);
				path.lnTo((x - halfSize) / pxToMm * pathW, (y - halfSize) / pxToMm * pathW);
				path.lnTo((x + halfSize) / pxToMm * pathW, (y - halfSize) / pxToMm * pathW);
				path.lnTo((x + halfSize) / pxToMm * pathW, (y + halfSize) / pxToMm * pathW);
				path.lnTo((x - halfSize) / pxToMm * pathW, (y + halfSize) / pxToMm * pathW);
			}
			
			case SYMBOL_DIAMOND:
			{
				path.moveTo((x - halfSize) / pxToMm * pathW, y / pxToMm * pathW);
				path.lnTo(x / pxToMm * pathW, (y  - halfSize) / pxToMm * pathW);
				path.lnTo((x + halfSize) / pxToMm * pathW, y / pxToMm * pathW);
				path.lnTo(x / pxToMm * pathW, (y  + halfSize) / pxToMm * pathW);
				path.lnTo((x - halfSize) / pxToMm * pathW, y / pxToMm * pathW);
				break;
			}
		}
		
		if(symbol == "Plus" || symbol == "Star" || symbol == "X")
		{
			framePaths = new Path();
			framePaths.moveTo((x - halfSize) / pxToMm * pathW, (y + halfSize) / pxToMm * pathW);
			framePaths.lnTo((x - halfSize) / pxToMm * pathW, (y - halfSize) / pxToMm * pathW);
			framePaths.lnTo((x + halfSize) / pxToMm * pathW, (y - halfSize) / pxToMm * pathW);
			framePaths.lnTo((x + halfSize) / pxToMm * pathW, (y + halfSize) / pxToMm * pathW);
			framePaths.lnTo((x - halfSize) / pxToMm * pathW, (y + halfSize) / pxToMm * pathW);
		}
		
		path.recalculate(gdLst);
		if(framePaths)
			framePaths.recalculate(gdLst);
		result = {framePaths: framePaths, path: path};
		
		return result;
	},
	
	_drawPath: function(path, brush, pen, stroke)
	{
		path.stroke = stroke;
		
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({brush: brush, pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
};



//*****GRID*****
function gridChart()
{
	this.chartProp = null;
	this.cShapeDrawer = null;
	this.chartSpace = null;
	this.paths = {};
}

gridChart.prototype =
{
    draw : function(chartProp, cShapeDrawer, chartSpace)
    {
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.chartSpace = chartSpace;
		
		this._drawHorisontalLines();
		this._drawVerticalLines();
	},
	
	reCalculate : function(chartProp, cShapeDrawer, chartSpace)
	{
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		this.chartSpace = chartSpace;
		
		this.paths = {};
		this._calculateHorisontalLines();
		this._calculateVerticalLines();
	},
	
	_calculateHorisontalLines : function()
	{
		var stepY = (this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom - this.chartProp.chartGutter._top)/(this.chartProp.numhlines);
		var minorStep = stepY/this.chartProp.numhMinorlines;
		var widthLine = this.chartProp.widthCanvas - (this.chartProp.chartGutter._left + this.chartProp.chartGutter._right);
		var posX = this.chartProp.chartGutter._left;
		var posY;
		var posMinorY;
		for(var i = 0; i <= this.chartProp.numhlines; i++)
		{
			posY = i*stepY + this.chartProp.chartGutter._top;
			if(!this.paths.horisontalLines)
				this.paths.horisontalLines = [];
			this.paths.horisontalLines[i] = this._calculateLine(posX, posY, posX + widthLine, posY);
			
			//промежуточные линии
			for(var n = 0; n < this.chartProp.numhMinorlines; n++)
			{
				posMinorY = posY + n*minorStep;
				if(!this.paths.horisontalMinorLines)
					this.paths.horisontalMinorLines = [];
				if(!this.paths.horisontalMinorLines[i])
					this.paths.horisontalMinorLines[i] = [];
				
				this.paths.horisontalMinorLines[i][n] = this._calculateLine(posX, posMinorY, posX + widthLine, posMinorY);
			}
		}
	},
	
	_calculateVerticalLines: function()
	{
		var stepX = (this.chartProp.widthCanvas - this.chartProp.chartGutter._left - this.chartProp.chartGutter._right)/(this.chartProp.numvlines);
		var minorStep = stepX/this.chartProp.numvMinorlines;
		var heightLine = this.chartProp.heightCanvas - (this.chartProp.chartGutter._bottom +this.chartProp.chartGutter._top);
		var posY = this.chartProp.chartGutter._top;
		var posX;
		var posMinorX;
		for(var i = 0; i <= this.chartProp.numvlines; i++)
		{
			posX = i*stepX + this.chartProp.chartGutter._left;
			if(!this.paths.verticalLines)
				this.paths.verticalLines = [];
			this.paths.verticalLines[i] = this._calculateLine(posX, posY, posX, posY + heightLine);
			
			//промежуточные линии
			for(var n = 0; n < this.chartProp.numvMinorlines; n++)
			{
				posMinorX = posX + n*minorStep;
				if(!this.paths.verticalMinorLines)
					this.paths.verticalMinorLines = [];
				if(!this.paths.verticalMinorLines[i])
					this.paths.verticalMinorLines[i] = [];
				
				this.paths.verticalMinorLines[i][n] = this._calculateLine(posMinorX, posY, posMinorX, posY + heightLine);
			}
		}
	},
	
	_calculateLine: function(x, y, x1, y1)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		path.stroke = true;
		var pxToMm = this.chartProp.pxToMM;
		path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x1 / pxToMm * pathW, y1 / pxToMm * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawHorisontalLines: function()
	{
		var pen;
		var path;
		for(var i = 0; i <= this.chartProp.numhlines; i++)
		{
			if(this.chartProp.type == "HBar")
				pen = this.chartSpace.chart.plotArea.catAx.compiledMajorGridLines;
			else
				pen = this.chartSpace.chart.plotArea.valAx.compiledMajorGridLines;
				
			path = this.paths.horisontalLines[i];
			this._drawPath(path, pen);
			
			//промежуточные линии
			if(i != this.chartProp.numhlines && this.paths.horisontalMinorLines)
			{
				for(var n = 0; n < this.paths.horisontalMinorLines[i].length ; n++)
				{
					path = this.paths.horisontalMinorLines[i][n];
					if(this.chartProp.type == "HBar")
						pen = this.chartSpace.chart.plotArea.catAx.compiledMinorGridLines;
					else
						pen = this.chartSpace.chart.plotArea.valAx.compiledMinorGridLines;
					this._drawPath(path, pen);
				}
			}
		}
	},
	
	_drawVerticalLines: function()
	{
		var pen, path;
		for(var i = 0; i <= this.chartProp.numvlines; i++)
		{
			if(this.chartProp.type == "HBar")
				pen = this.chartSpace.chart.plotArea.valAx.compiledMajorGridLines;
			else
				pen = this.chartSpace.chart.plotArea.catAx.compiledMajorGridLines;
				
			path = this.paths.verticalLines[i];
			this._drawPath(path, pen);
			
			//промежуточные линии
			if(i != this.chartProp.numvlines)
			{
				for(var n = 0; n < this.paths.verticalMinorLines[i].length ; n++)
				{
					path = this.paths.verticalMinorLines[i][n];
					if(this.chartProp.type == "HBar")
						pen = this.chartSpace.chart.plotArea.valAx.compiledMinorGridLines;
					else
						pen = this.chartSpace.chart.plotArea.catAx.compiledMinorGridLines;
					this._drawPath(path, pen);
				}
			}
		}	
	},
	
	_drawPath: function(path, pen)
	{	
		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();
		this.cShapeDrawer.fromShape2({pen: pen} ,this.cShapeDrawer.Graphics, cGeometry);
		
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
}	
	

	
	
//*****Area of chart*****
function areaChart()
{
	this.chartProp = null;
	this.cShapeDrawer = null;
	this.paths = null;
}

areaChart.prototype =
{
    draw : function(chartProp, cShapeDrawer)
    {
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		
		this._drawArea();
	},
	
	reCalculate: function(chartProp, cShapeDrawer)
	{
		this.chartProp = chartProp;
		this.cShapeDrawer = cShapeDrawer;
		
		this.paths = null;
		this._calculateArea();
	},
	
	_calculateArea: function()
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		
		path.moveTo(0, 0);
		path.lnTo(0 / pxToMm * pathW, this.chartProp.heightCanvas / pxToMm * pathH);
		path.lnTo(this.chartProp.widthCanvas / pxToMm * pathW, this.chartProp.heightCanvas / pxToMm * pathH);
		path.lnTo(this.chartProp.widthCanvas / pxToMm * pathW, 0 / pxToMm * pathH);
		path.lnTo(0, 0);
		
		path.recalculate(gdLst);
		this.paths = path;
	},
	
	_drawArea: function()
	{
		var StrokeUniColor = new CUniColor().RGBA;
		var FillUniColor = new CUniColor().RGBA;
		FillUniColor.R = 255;
		FillUniColor.G = 255;
		FillUniColor.B = 255;
		
		var lineWidth = 1;
		this._drawPath(this.paths, lineWidth, StrokeUniColor, FillUniColor);
	},
	
	_drawPath: function(path, lineWidth,StrokeUniColor, FillUniColor)
	{
		if(StrokeUniColor)
		{
			path.stroke = true;
			this.cShapeDrawer.StrokeWidth = lineWidth/(96/25.4);
			this.cShapeDrawer.p_width(1000 * this.cShapeDrawer.StrokeWidth);
			this.cShapeDrawer.StrokeUniColor = StrokeUniColor;
		}
		
		this.cShapeDrawer.FillUniColor = FillUniColor;
		
		var cGeometry = new CGeometry2();
		cGeometry.AddPath(path);
		this.cShapeDrawer.draw(cGeometry);
	}
}	
	
	
//****another functions and classes***
function CGeometry2()
{
    this.pathLst = [];
	this.isLine = false;
	this.gdLst = [];
}

CGeometry2.prototype =
{
    canFill: function()
    {
        if(this.preset === "line")
            return false;
        for(var i = 0; i < this.pathLst.length; ++i)
        {
            if(this.pathLst[i].fill !== "none")
                return true;
        }
        return  false;
    },

    getObjectType: function()
    {
        return CLASS_TYPE_GEOMETRY;
    },

    AddPath: function(path)
    {
        History.Add(g_oUndoRedoGraphicObjects,  historyitem_AutoShapes_Add_Path, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataAddObject(path.Id)), null);
        this.pathLst.push(path);
    },
	
    AddRect: function(l, t, r, b)
    {
        History.Add(g_oUndoRedoGraphicObjects,  historyitem_AutoShapes_Add_GeometryRect, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataAddGeometryRect(l, t, r, b)), null);
        this.rectS = {};
        this.rectS.l = l;
        this.rectS.t = t;
        this.rectS.r = r;
        this.rectS.b = b;
    },

    draw: function(shape_drawer)
    {
        for (var i=0, n=this.pathLst.length; i<n;++i)
            this.pathLst[i].draw(shape_drawer);
    }
};
