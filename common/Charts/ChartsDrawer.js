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

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {

// Import
var cToDeg = AscFormat.cToDeg;
var Path = AscFormat.Path;
var ORIENTATION_MIN_MAX = AscFormat.ORIENTATION_MIN_MAX;
var Point3D = AscFormat.Point3D;

var c_oAscTickMark = Asc.c_oAscTickMark;
var c_oAscChartDataLabelsPos = Asc.c_oAscChartDataLabelsPos;
var c_oAscChartLegendShowSettings = Asc.c_oAscChartLegendShowSettings;

var globalGapDepth = 150;
var isTurnOn3DCharts = true;
var standartMarginForCharts = 13;

function arrReverse(arr) {
	if(!arr || !arr.length)
		return;
	var newarr = [];
	for (var i = 0; i < arr[0].length; ++i) {
		newarr[i] = [];
		for (var j = 0; j < arr.length; ++j) {
			newarr[i][j] = arr[j][i];
		}
	}
	return newarr;
}

//*****MAIN*****
function CChartsDrawer()
{
	this.calcProp = {};
	
	this.allAreaChart = null;
	this.gridChart = null;
	this.chart = null;
	this.cChartSpace = null;
	this.cShapeDrawer = null;
	this.processor3D = null;
	
	this.areaChart = null;
	this.catAxisChart = null;
	this.valAxisChart = null;
}

CChartsDrawer.prototype =
{
    constructor: CChartsDrawer,
	
	//****draw and recalculate functions****
	reCalculate : function(chartSpace)
    {
		this.cChartSpace = chartSpace;
		
		this.calcProp = {};
		
		//nDimensionCount - flag for 3d/2d charts
		//TODO пока включаю только гистограммы(=== AscDFH.historyitem_type_BarChart)
		if(this._isSwitchCurrent3DChart(chartSpace))
		{
			standartMarginForCharts = 16;
			this.nDimensionCount = 3;
		}
		else
			this.nDimensionCount = 2;
		
		if(!chartSpace.bEmptySeries)
			this._calculateProperties(chartSpace);
		
		if(this.calcProp.widthCanvas == undefined && this.calcProp.pxToMM == undefined)
		{
			this.calcProp.pathH = 1000000000;
			this.calcProp.pathW = 1000000000;
			this.calcProp.pxToMM = 1 / AscCommon.g_dKoef_pix_to_mm;
			this.calcProp.widthCanvas = chartSpace.extX * this.calcProp.pxToMM;
			this.calcProp.heightCanvas = chartSpace.extY * this.calcProp.pxToMM;
		}
		
		//создаём область
		this.allAreaChart = new allAreaChart();
		
		//создаём область
		this.areaChart = new areaChart();
		
		//создаём сетку
		this.gridChart = new gridChart();
		
		//ось категорий
		this.catAxisChart = new catAxisChart();
		//ось значений
		this.valAxisChart = new valAxisChart();
		//ось серий
		this.serAxisChart = new serAxisChart();
		//Floor This element specifies the floor of a 3D chart.   
		this.floor3DChart = new floor3DChart();
		this.sideWall3DChart = new sideWall3DChart();
		this.backWall3DChart = new backWall3DChart();
		
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
			case "Stock":
			{
				newChart = new drawStockChart();
				break;
			}
			case "DoughnutChart":
			{
				newChart = new drawDoughnutChart();
				break;
			}
			case "Radar":
			{
				newChart = new drawRadarChart();
				break;
			}
			case "BubbleChart":
			{
				newChart = new drawBubbleChart();
				break;
			}
		}
		this.chart = newChart;
		
		//делаем полный пресчёт
		if(!chartSpace.bEmptySeries)
		{
			if(this.nDimensionCount === 3)
				this._calaculate3DProperties(chartSpace);
			
			this.areaChart.reCalculate(this);
			
			if(this.calcProp.type != "Pie" && this.calcProp.type != "DoughnutChart")
				this.gridChart.reCalculate(this);
		}
		
		this.allAreaChart.reCalculate(this);
		
		if(this.calcProp.type != "Pie" && this.calcProp.type != "DoughnutChart" && !chartSpace.bEmptySeries)
		{
			this.catAxisChart.reCalculate(this);
			this.valAxisChart.reCalculate(this);
			if(this.nDimensionCount === 3)
			{
				this.floor3DChart.recalculate(this);
				this.serAxisChart.reCalculate(this);
				this.sideWall3DChart.recalculate(this);
				this.backWall3DChart.recalculate(this);
			}
				
		}
		
		if(!chartSpace.bEmptySeries)
			this.chart.reCalculate(this);
	},
	
	draw : function(chartSpace, graphics)
    {
		this.cChartSpace = chartSpace;
		
		var cShapeDrawer = new AscCommon.CShapeDrawer();
		cShapeDrawer.Graphics = graphics;
		this.calcProp.series = chartSpace.chart.plotArea.chart.series;
		
		this.cShapeDrawer = cShapeDrawer;
		
		//отрисовываем без пересчёта
		this.allAreaChart.draw(this);
		
		if(!chartSpace.bEmptySeries)
		{
			this.areaChart.draw(this);
			
			if(this.calcProp.type != "Pie" && this.calcProp.type != "DoughnutChart")
			{
				if(this.nDimensionCount === 3)
				{
					this.floor3DChart.draw(this);
					this.sideWall3DChart.draw(this);
					this.backWall3DChart.draw(this);
				}
                this.gridChart.draw(this);
			}
			
			if(this.nDimensionCount === 3)
			{
				this.cShapeDrawer.bIsNoSmartAttack = true;
				this.chart.draw(this);
				this.cShapeDrawer.bIsNoSmartAttack = false;
			}
			
			if(this.calcProp.type != "Pie" && this.calcProp.type != "DoughnutChart")
			{
				this.catAxisChart.draw(this);
				this.valAxisChart.draw(this);
				this.serAxisChart.draw(this);
			}
			
			if(this.nDimensionCount !== 3)
			{
				if(this.calcProp.type === "Line" || this.calcProp.type === "Scatter")
				{
					this.cShapeDrawer.bIsNoSmartAttack = true;
					this.chart.draw(this);
					this.cShapeDrawer.bIsNoSmartAttack = false;
				}
				else
				{
					this.chart.draw(this);
		}
			}
		}
	},
	
	
	
	//****positions text labels****
	reCalculatePositionText : function(type, chartSpace, ser, val, bLayout)
	{
		var pos;
		
		if(!chartSpace.bEmptySeries)
		{
			switch ( type )
			{
				case "dlbl":
				{
					pos = this._calculatePositionDlbl(chartSpace, ser, val, bLayout);
					break;
				}
				case "title":
				{
					pos = this._calculatePositionTitle(chartSpace);
					break;
				}
				case "valAx":
				{
					pos = this._calculatePositionValAx(chartSpace);
					break;
				}
				case "catAx":
				{
					pos = this._calculatePositionCatAx(chartSpace);
					break;
				}
				case "legend":
				{
					pos = this._calculatePositionLegend(chartSpace);
					break;
				}
				default:
				{
					pos = {x: 0, y: 0};
					break;
				}
			}
		}
		
		return {x: pos ? pos.x : undefined, y : pos ? pos.y : undefined};
	},
	
	_calculatePositionDlbl: function(chartSpace, ser, val, bLayout)
	{	
		return this.chart._calculateDLbl(chartSpace, ser, val, bLayout);
	},
	
	_calculatePositionTitle: function(chartSpace)
	{	
		var widthGraph = chartSpace.extX;
		
		var widthTitle = chartSpace.chart.title.extX;
		var standartMargin = 7;
		
		var y = standartMargin / this.calcProp.pxToMM;
		var x = widthGraph / 2 - widthTitle / 2;
		
		return {x: x, y: y}
	},
	
	_calculatePositionValAx: function(chartSpace)
	{
		var heightTitle = chartSpace.chart.plotArea.valAx.title.extY;
		
		var y = (this.calcProp.chartGutter._top + this.calcProp.trueHeight / 2) / this.calcProp.pxToMM - heightTitle / 2;
		var x = standartMarginForCharts / this.calcProp.pxToMM;
		
		if(chartSpace.chart.legend && chartSpace.chart.legend.legendPos === c_oAscChartLegendShowSettings.left)
		{
			x += chartSpace.chart.legend.extX;
		}
		
		if(this.nDimensionCount === 3)
		{
			if(!this.processor3D.view3D.rAngAx && (this.calcProp.type === "Bar" || this.calcProp.type === "Line"))
			{
				var posX = chartSpace.chart.plotArea.valAx.posX;
				var widthLabels = chartSpace.chart.plotArea.valAx.labels && chartSpace.chart.plotArea.valAx.labels.extX ? chartSpace.chart.plotArea.valAx.labels.extX : 0;
				var widthTitle = chartSpace.chart.plotArea.valAx.title && chartSpace.chart.plotArea.valAx.title.extX ? chartSpace.chart.plotArea.valAx.title.extX : 0;
				var yPoints = chartSpace.chart.plotArea.valAx.yPoints;
				var upYPoint = yPoints && yPoints[0] ? yPoints[0].pos : 0;
				var downYPoint = yPoints && yPoints[yPoints.length - 1] ? yPoints[yPoints.length - 1].pos : 0;
				
				var tempX = posX - widthLabels;
				var convertResultX = this._convertAndTurnPoint(tempX * this.calcProp.pxToMM, y * this.calcProp.pxToMM, 0);
				x = convertResultX.x / this.calcProp.pxToMM - widthTitle;
				
				var convertResultY1 = this._convertAndTurnPoint(posX * this.calcProp.pxToMM, upYPoint * this.calcProp.pxToMM, 0);
				var convertResultY2 = this._convertAndTurnPoint(posX * this.calcProp.pxToMM, downYPoint * this.calcProp.pxToMM, 0);
				var heightPerspectiveChart = convertResultY1.y - convertResultY2.y;
				
				var y = (convertResultY2.y + heightPerspectiveChart / 2) / this.calcProp.pxToMM - heightTitle / 2;
			}
			else
			{
				var convertResult = this._convertAndTurnPoint(x * this.calcProp.pxToMM, y * this.calcProp.pxToMM, 0);
				y = convertResult.y / this.calcProp.pxToMM;
			}
		}
		
		return {x: x , y: y}
	},
	
	_calculatePositionCatAx: function(chartSpace)
	{	
		var widthTitle = chartSpace.chart.plotArea.catAx.title.extX;
		var heightTitle = chartSpace.chart.plotArea.catAx.title.extY;
		
		var orientationValAx = chartSpace.chart.plotArea.valAx && chartSpace.chart.plotArea.valAx.scaling.orientation == ORIENTATION_MIN_MAX ? true : false;
		
		var x, y;
		if(orientationValAx || this.calcProp.type == "HBar")
		{
			y = (this.calcProp.heightCanvas - standartMarginForCharts) / this.calcProp.pxToMM -  heightTitle;
			x = (this.calcProp.chartGutter._left + this.calcProp.trueWidth / 2) / this.calcProp.pxToMM - widthTitle / 2;
			
			if(chartSpace.chart.legend && !chartSpace.chart.legend.overlay && chartSpace.chart.legend.legendPos == c_oAscChartLegendShowSettings.bottom)
			{
				y -= chartSpace.chart.legend.extY;
			}
		}
		else
		{
			y = standartMarginForCharts / this.calcProp.pxToMM;
			x = (this.calcProp.chartGutter._left + this.calcProp.trueWidth / 2) / this.calcProp.pxToMM - widthTitle / 2;
			
			if(chartSpace.chart.title !== null && !chartSpace.chart.title.overlay)
				y += chartSpace.chart.title.extY;
			
			if(chartSpace.chart.legend && !chartSpace.chart.legend.overlay && chartSpace.chart.legend.legendPos == c_oAscChartLegendShowSettings.top)
			{
				y += chartSpace.chart.legend.extY;
			}
		}
		
		if(this.nDimensionCount === 3)
		{
			var convertResult = this._convertAndTurnPoint((x + widthTitle / 2) * this.calcProp.pxToMM, y * this.calcProp.pxToMM, this.processor3D.calculateZPositionCatAxis());
			x = convertResult.x / this.calcProp.pxToMM - widthTitle / 2;
		}
		
		return {x: x, y: y}
	},
	
	_calculatePositionLegend: function(chartSpace)
	{	
		var widthLegend = chartSpace.chart.legend.extX;
		var heightLegend = chartSpace.chart.legend.extY;
		var x, y;
		
		switch ( chartSpace.chart.legend.legendPos )
		{
			case c_oAscChartLegendShowSettings.left:
			case c_oAscChartLegendShowSettings.leftOverlay:
			{
				x = standartMarginForCharts / 2 / this.calcProp.pxToMM;
				y = this.calcProp.heightCanvas / 2 / this.calcProp.pxToMM - heightLegend / 2;
				break;
			}
			case c_oAscChartLegendShowSettings.top:
			{
				x = this.calcProp.widthCanvas / 2 / this.calcProp.pxToMM - widthLegend / 2;
				y = standartMarginForCharts / 2 / this.calcProp.pxToMM;
				
				if(chartSpace.chart.title !== null && !chartSpace.chart.title.overlay)
				{
					y += chartSpace.chart.title.extY + standartMarginForCharts / 2 / this.calcProp.pxToMM;
				}
				break;
			}
			case c_oAscChartLegendShowSettings.right:
			case c_oAscChartLegendShowSettings.rightOverlay:
			{
				x = (this.calcProp.widthCanvas - standartMarginForCharts / 2) / this.calcProp.pxToMM  - widthLegend;
				y = (this.calcProp.heightCanvas / 2) / this.calcProp.pxToMM - heightLegend / 2;
				break;
			}
			case c_oAscChartLegendShowSettings.bottom:
			{
				x = this.calcProp.widthCanvas / 2 / this.calcProp.pxToMM - widthLegend / 2;
				y = (this.calcProp.heightCanvas - standartMarginForCharts / 2) / this.calcProp.pxToMM - heightLegend;
				break;
			}
			case c_oAscChartLegendShowSettings.topRight:
			{
				x = (this.calcProp.widthCanvas - standartMarginForCharts / 2) / this.calcProp.pxToMM  - widthLegend;
				y = standartMarginForCharts / 2 / this.calcProp.pxToMM;
				
				if(chartSpace.chart.title !== null && !chartSpace.chart.title.overlay)
				{
					y += chartSpace.chart.title.extY + standartMarginForCharts / 2 / this.calcProp.pxToMM;
				}
				break;
			}
			default:
			{
				x = (this.calcProp.widthCanvas  - standartMarginForCharts / 2) / this.calcProp.pxToMM  - widthLegend;
				y = (this.calcProp.heightCanvas) / this.calcProp.pxToMM - heightLegend / 2;
				break;
			}
		}
		
		return {x: x, y: y}
	},
	
	
	
	//****calculate margins****
	_calculateMarginsChart: function(chartSpace) {
		this.calcProp.chartGutter = {};
		
		if(this._isSwitchCurrent3DChart(chartSpace))
			standartMarginForCharts = 16;
		
		if(!this.calcProp.pxToMM)
			this.calcProp.pxToMM = 1 / AscCommon.g_dKoef_pix_to_mm;
		
		var pxToMM = this.calcProp.pxToMM;
		
		var isHBar = (chartSpace.chart.plotArea.chart.getObjectType() == AscDFH.historyitem_type_BarChart && chartSpace.chart.plotArea.chart.barDir === AscFormat.BAR_DIR_BAR) ? true : false;
		
		//если точки рассчитаны - ставим маргин в зависимости от них
		var marginOnPoints = this._calculateMarginOnPoints(chartSpace, isHBar);
		var calculateLeft = marginOnPoints.calculateLeft, calculateRight = marginOnPoints.calculateRight, calculateTop = marginOnPoints.calculateTop, calculateBottom = marginOnPoints.calculateBottom;
		
		//высчитываем выходящие за пределы подписи осей
		var labelsMargin = this._calculateMarginLabels(chartSpace);
		var left = labelsMargin.left, right = labelsMargin.right, top = labelsMargin.top, bottom = labelsMargin.bottom;
		
		
		
		var leftTextLabels = 0;
		var rightTextLabels = 0;
		var topTextLabels = 0;
		var bottomTextLabels = 0;
		
		//добавляем размеры подписей осей + размеры названия
		//***left***
		if(chartSpace.chart.plotArea.valAx && chartSpace.chart.plotArea.valAx.title != null && !isHBar)
			leftTextLabels += chartSpace.chart.plotArea.valAx.title.extX;
		else if(isHBar && chartSpace.chart.plotArea.catAx && chartSpace.chart.plotArea.catAx.title != null)
			leftTextLabels += chartSpace.chart.plotArea.catAx.title.extX;

		//пока ориентацию добавляю без hbar
		var orientationValAx = chartSpace.chart.plotArea.valAx && chartSpace.chart.plotArea.valAx.scaling.orientation == ORIENTATION_MIN_MAX ? true : false;
		//***bottom***
		if(chartSpace.chart.plotArea.catAx && chartSpace.chart.plotArea.catAx.title != null && !isHBar && orientationValAx)
			bottomTextLabels += chartSpace.chart.plotArea.catAx.title.extY;
		else if(isHBar && chartSpace.chart.plotArea.valAx && chartSpace.chart.plotArea.valAx.title != null)
			bottomTextLabels += chartSpace.chart.plotArea.valAx.title.extY;

		
		
		//***top***
		var topMainTitle = 0;
		if(chartSpace.chart.title !== null && !chartSpace.chart.title.overlay)
			topMainTitle += chartSpace.chart.title.extY;
			
		if(chartSpace.chart.plotArea.catAx && chartSpace.chart.plotArea.catAx.title != null && !isHBar && !orientationValAx)
			topTextLabels += chartSpace.chart.plotArea.catAx.title.extY;
		

		var leftKey = 0, rightKey = 0, topKey = 0, bottomKey = 0;
		//KEY
		if(chartSpace.chart.legend && !chartSpace.chart.legend.overlay)
		{
			var fLegendExtX = chartSpace.chart.legend.extX;
			var fLegendExtY = chartSpace.chart.legend.extY;
			if(chartSpace.chart.legend.layout){
				if(AscFormat.isRealNumber(chartSpace.chart.legend.naturalWidth) && AscFormat.isRealNumber(chartSpace.chart.legend.naturalHeight)){
					fLegendExtX = chartSpace.chart.legend.naturalWidth;
					fLegendExtY = chartSpace.chart.legend.naturalHeight;
				}
			}
			switch ( chartSpace.chart.legend.legendPos )
			{
				case c_oAscChartLegendShowSettings.left:
				case c_oAscChartLegendShowSettings.leftOverlay:
				{
					leftKey += fLegendExtX;
					break;
				}
				case c_oAscChartLegendShowSettings.top:
				{
					topKey += fLegendExtY
					break;
				}
				case c_oAscChartLegendShowSettings.right:
				case c_oAscChartLegendShowSettings.rightOverlay:
				{
					rightKey += fLegendExtX;
					break;
				}
				case c_oAscChartLegendShowSettings.bottom:
				{
					bottomKey += fLegendExtY;
					break;
				}
				case c_oAscChartLegendShowSettings.topRight:
				{
					rightKey += fLegendExtX;
					break;
				}
			}
		}
		
		
		left   += this._getStandartMargin(left, leftKey, leftTextLabels, 0) + leftKey + leftTextLabels;
		bottom += this._getStandartMargin(bottom, bottomKey, bottomTextLabels, 0) + bottomKey + bottomTextLabels;
		top    += this._getStandartMargin(top, topKey, topTextLabels, topMainTitle) + topKey + topTextLabels + topMainTitle;
		right  += this._getStandartMargin(right, rightKey, rightTextLabels, 0) + rightKey + rightTextLabels;
		
		
		this.calcProp.chartGutter._left = calculateLeft ? calculateLeft * pxToMM : left * pxToMM;
		this.calcProp.chartGutter._right = calculateRight ? calculateRight * pxToMM : right * pxToMM;
		this.calcProp.chartGutter._top = calculateTop ? calculateTop * pxToMM : top * pxToMM;
		this.calcProp.chartGutter._bottom = calculateBottom ? calculateBottom * pxToMM : bottom * pxToMM;

        if(chartSpace.chart.plotArea.chart.getObjectType() == AscDFH.historyitem_type_PieChart){
            if(chartSpace.chart.plotArea.layout){
                var oLayout = chartSpace.chart.plotArea.layout;
                this.calcProp.chartGutter._left = chartSpace.calculatePosByLayout(this.calcProp.chartGutter._left/pxToMM, oLayout.xMode, oLayout.x,
                    (this.calcProp.chartGutter._right - this.calcProp.chartGutter._left)/pxToMM, chartSpace.extX)*pxToMM;
                this.calcProp.chartGutter._top = chartSpace.calculatePosByLayout(this.calcProp.chartGutter._top/pxToMM, oLayout.yMode, oLayout.y,
                    (this.calcProp.chartGutter._bottom - this.calcProp.chartGutter._top)/pxToMM, chartSpace.extY)*pxToMM;
                var fWidthPlotArea = chartSpace.calculateSizeByLayout(this.calcProp.chartGutter._left/pxToMM, chartSpace.extX, oLayout.w, oLayout.wMode );
                if(fWidthPlotArea > 0){
                    this.calcProp.chartGutter._right = chartSpace.extX*pxToMM - (this.calcProp.chartGutter._left + fWidthPlotArea*pxToMM);
                }
                var fHeightPlotArea = chartSpace.calculateSizeByLayout(this.calcProp.chartGutter._top/pxToMM, chartSpace.extY, oLayout.h, oLayout.hMode );
                if(fHeightPlotArea > 0){
                    this.calcProp.chartGutter._bottom = chartSpace.extY*pxToMM - (this.calcProp.chartGutter._top + fHeightPlotArea*pxToMM);
                }
            }
        }

		this._checkMargins();
	},
	
	_checkMargins: function()
	{	
		if(this.calcProp.chartGutter._left < 0)
			this.calcProp.chartGutter._left = standartMarginForCharts;
		if(this.calcProp.chartGutter._right < 0)
			this.calcProp.chartGutter._right = standartMarginForCharts;
		if(this.calcProp.chartGutter._top < 0)
			this.calcProp.chartGutter._top = standartMarginForCharts;
		if(this.calcProp.chartGutter._bottom < 0)
			this.calcProp.chartGutter._bottom = standartMarginForCharts;
			
		if((this.calcProp.chartGutter._left + this.calcProp.chartGutter._right) > this.calcProp.widthCanvas)
			this.calcProp.chartGutter._left = standartMarginForCharts;
		if(this.calcProp.chartGutter._right > this.calcProp.widthCanvas)
			this.calcProp.chartGutter._right = standartMarginForCharts;
			
		if((this.calcProp.chartGutter._top + this.calcProp.chartGutter._bottom) > this.calcProp.heightCanvas)
			this.calcProp.chartGutter._top = 0;
		if(this.calcProp.chartGutter._bottom > this.calcProp.heightCanvas)
			this.calcProp.chartGutter._bottom = 0;
	},
	
	_calculateMarginOnPoints: function(chartSpace, isHBar)
	{
		var calculateLeft = 0, calculateRight = 0, calculateTop = 0, calculateBottom = 0;
		var pxToMM = this.calcProp.pxToMM;
		
		//valAx
		var valAx = chartSpace.chart.plotArea.valAx;
		if(chartSpace.chart.plotArea.valAx && chartSpace.chart.plotArea.valAx.labels && this.calcProp.widthCanvas != undefined)
		{
			if(isHBar)
			{
				if(valAx.scaling.orientation == ORIENTATION_MIN_MAX)
				{
					calculateLeft  = valAx.xPoints[0].pos;
					calculateRight = this.calcProp.widthCanvas / pxToMM - valAx.xPoints[valAx.xPoints.length - 1].pos;
				}
				else
				{
					calculateLeft  = valAx.xPoints[valAx.xPoints.length - 1].pos;
					calculateRight = this.calcProp.widthCanvas / pxToMM - valAx.xPoints[0].pos;
				}
			}
			else if(this.calcProp.heightCanvas != undefined)
			{
				if(valAx.scaling.orientation == ORIENTATION_MIN_MAX)
				{
					calculateTop  = valAx.yPoints[valAx.yPoints.length - 1].pos;
					calculateBottom = this.calcProp.heightCanvas / pxToMM - valAx.yPoints[0].pos;
				}
				else
				{
					calculateTop  = valAx.yPoints[0].pos;
					calculateBottom = this.calcProp.heightCanvas / pxToMM - valAx.yPoints[valAx.yPoints.length - 1].pos;
				}
			}
		}
		
		
		//catAx
		var crossBetween = chartSpace.getValAxisCrossType();
		if(chartSpace.chart.plotArea.catAx /*&& chartSpace.chart.plotArea.catAx.labels*/)
		{
			var catAx = chartSpace.chart.plotArea.catAx;
			var curBetween = 0, diffPoints = 0;
			
			if(this.calcProp.type == "Scatter" && this.calcProp.widthCanvas != undefined && catAx.xPoints)
			{
				if(catAx.scaling.orientation == ORIENTATION_MIN_MAX)
				{
					calculateLeft  = catAx.xPoints[0].pos;
					calculateRight = this.calcProp.widthCanvas / pxToMM - catAx.xPoints[catAx.xPoints.length - 1].pos;
				}
				else
				{
					calculateLeft  = catAx.xPoints[catAx.xPoints.length - 1].pos;
					calculateRight = this.calcProp.widthCanvas / pxToMM - catAx.xPoints[0].pos;
				}
			}
			else if(isHBar && valAx && !isNaN(valAx.posY) && this.calcProp.heightCanvas != undefined && catAx.yPoints)
			{
				diffPoints = catAx.yPoints[1] ? Math.abs(catAx.yPoints[1].pos - catAx.yPoints[0].pos) : Math.abs(catAx.yPoints[0].pos - valAx.posY) * 2;
				
				if(catAx.scaling.orientation == ORIENTATION_MIN_MAX)
				{
					if(crossBetween == AscFormat.CROSS_BETWEEN_BETWEEN)
						curBetween = diffPoints / 2;
					
					calculateTop  = catAx.yPoints[catAx.yPoints.length - 1].pos - curBetween;
					calculateBottom = this.calcProp.heightCanvas / pxToMM - (catAx.yPoints[0].pos + curBetween);
				}
				else
				{
					if(crossBetween == AscFormat.CROSS_BETWEEN_BETWEEN)
						curBetween = diffPoints / 2;
					
					calculateTop  = catAx.yPoints[0].pos - curBetween;
					calculateBottom = this.calcProp.heightCanvas / pxToMM - (catAx.yPoints[catAx.yPoints.length - 1].pos + curBetween);
				}
			}
			else if(valAx && !isNaN(valAx.posX) && this.calcProp.widthCanvas != undefined && catAx.xPoints)
			{
				diffPoints = catAx.xPoints[1] ? Math.abs(catAx.xPoints[1].pos - catAx.xPoints[0].pos) : Math.abs(catAx.xPoints[0].pos - valAx.posX) * 2;
				
				if(catAx.scaling.orientation == ORIENTATION_MIN_MAX)
				{
					if(crossBetween == AscFormat.CROSS_BETWEEN_BETWEEN)
						curBetween = diffPoints / 2;
					
					calculateLeft  = catAx.xPoints[0].pos - curBetween;
					calculateRight = this.calcProp.widthCanvas / pxToMM - (catAx.xPoints[catAx.xPoints.length - 1].pos + curBetween);
				}
				else
				{
					if(crossBetween == AscFormat.CROSS_BETWEEN_BETWEEN)
						curBetween = diffPoints / 2;
					
					calculateLeft  = catAx.xPoints[catAx.xPoints.length - 1].pos - curBetween;
					calculateRight = this.calcProp.widthCanvas / pxToMM - (catAx.xPoints[0].pos + curBetween);
				}
			}
		}


		return {calculateLeft: calculateLeft, calculateRight : calculateRight, calculateTop: calculateTop, calculateBottom: calculateBottom};
	},
	
	_getStandartMargin: function(labelsMargin, keyMargin, textMargin, topMainTitleMargin)
	{
		var defMargin = standartMarginForCharts / this.calcProp.pxToMM;
		var result;
		
		if(labelsMargin == 0 && keyMargin == 0 && textMargin == 0 && topMainTitleMargin == 0)
			result = defMargin;
		else if(labelsMargin != 0 && keyMargin == 0 && textMargin == 0 && topMainTitleMargin == 0)
			result = defMargin / 2;
		else if(labelsMargin != 0 && keyMargin == 0 && textMargin != 0 && topMainTitleMargin == 0)
			result = defMargin;
		else if(labelsMargin != 0 && keyMargin != 0 && textMargin != 0 && topMainTitleMargin == 0)
			result = defMargin + defMargin / 2;
		else if(labelsMargin == 0 && keyMargin != 0 && textMargin == 0 && topMainTitleMargin == 0)
			result = defMargin;
		else if(labelsMargin == 0 && keyMargin == 0 && textMargin != 0 && topMainTitleMargin == 0)
			result = defMargin;
		else if(labelsMargin == 0 && keyMargin != 0 && textMargin != 0 && topMainTitleMargin == 0)
			result = defMargin + defMargin / 2;
		else if(labelsMargin != 0 && keyMargin != 0 && textMargin == 0 && topMainTitleMargin == 0)
			result = defMargin;
		else if(labelsMargin == 0 && keyMargin != 0 && textMargin != 0 && topMainTitleMargin == 0)
			result = defMargin + defMargin / 2;
		else if(labelsMargin == 0 && keyMargin == 0 && topMainTitleMargin != 0)
			result = defMargin + defMargin / 2;
		else if(labelsMargin == 0 && keyMargin != 0  && topMainTitleMargin != 0)
			result = 2 * defMargin;
		else if(labelsMargin != 0 && keyMargin == 0  && topMainTitleMargin != 0)
			result = defMargin;
		else if(labelsMargin != 0 && keyMargin != 0  && topMainTitleMargin != 0)
			result = 2 * defMargin;
		
		return result;
	},
	
	_calculateMarginLabels: function(chartSpace)
	{
		var isHBar = this.calcProp.type;
		var left = 0, right = 0, bottom = 0, top = 0;
		
		var leftDownPointX, leftDownPointY, rightUpPointX, rightUpPointY;
		
		var valAx = chartSpace.chart.plotArea.valAx;
		var catAx = chartSpace.chart.plotArea.catAx;
		
		var orientationValAx = valAx && valAx.scaling.orientation === ORIENTATION_MIN_MAX ? true : false;
		var orientationCatAx = catAx && catAx.scaling.orientation === ORIENTATION_MIN_MAX ? true : false;
		
		var crossBetween = chartSpace.getValAxisCrossType();
		if(isHBar === 'HBar' && catAx && valAx && catAx.yPoints && valAx.xPoints)
		{
			if(orientationCatAx)
			{
				if(crossBetween == AscFormat.CROSS_BETWEEN_BETWEEN)
					leftDownPointY = catAx.yPoints[0].pos + Math.abs((catAx.interval) / 2);
				else
					leftDownPointY = catAx.yPoints[0].pos;
			}
			else
			{
				if(crossBetween == AscFormat.CROSS_BETWEEN_BETWEEN)
					leftDownPointY = catAx.yPoints[catAx.yPoints.length - 1].pos + Math.abs((catAx.interval) / 2);
				else
					leftDownPointY = catAx.yPoints[catAx.yPoints.length - 1].pos;
			}

			
			if(orientationValAx)
				leftDownPointX = valAx.xPoints[0].pos;
			else
				leftDownPointX = valAx.xPoints[valAx.xPoints.length - 1].pos;
			
			
			
			if(orientationCatAx)
			{
				if(crossBetween == AscFormat.CROSS_BETWEEN_BETWEEN)
					rightUpPointY = catAx.yPoints[catAx.yPoints.length - 1].pos - Math.abs((catAx.interval) / 2);
				else
					rightUpPointY = catAx.yPoints[catAx.yPoints.length - 1].pos;
			}
			else
			{
				if(crossBetween == AscFormat.CROSS_BETWEEN_BETWEEN)
					rightUpPointY = catAx.yPoints[0].pos - Math.abs((catAx.interval) / 2);
				else
					rightUpPointY = catAx.yPoints[0].pos;
			}

			
			if(orientationValAx)
				rightUpPointX = valAx.xPoints[valAx.xPoints.length - 1].pos;
			else
				rightUpPointX = valAx.xPoints[0].pos;
			
			
			if(catAx.labels && !catAx.bDelete)
			{
				//подпись оси OY находится левее крайней левой точки
				if(leftDownPointX >= catAx.labels.x)
				{
					left = leftDownPointX - catAx.labels.x;
				}
				else if((catAx.labels.x + catAx.labels.extX) >= rightUpPointX)//правее крайней правой точки
				{
					right = catAx.labels.x + catAx.labels.extX - rightUpPointX;
				}
			}
			
			
			if(valAx.labels && !valAx.bDelete)
			{
				//подпись оси OX находится ниже крайней нижней точки
				if((valAx.labels.y + valAx.labels.extY) >= leftDownPointY)
				{
					bottom = (valAx.labels.y + valAx.labels.extY) - leftDownPointY;
				}
				else if(valAx.labels.y <= rightUpPointY)//выше верхней
				{
					top = rightUpPointY - valAx.labels.y;
				}
			}
		}
		else if(isHBar === 'Scatter' && catAx && valAx && catAx.xPoints && valAx.yPoints)
		{
			leftDownPointX = catAx.xPoints[0].pos;
			leftDownPointY = orientationValAx ? valAx.yPoints[0].pos : valAx.yPoints[valAx.yPoints.length - 1].pos;

			rightUpPointX = catAx.xPoints[catAx.xPoints.length - 1].pos;
			rightUpPointY = orientationValAx ? valAx.yPoints[valAx.yPoints.length - 1].pos : valAx.yPoints[0].pos;
			
			if(valAx.labels && !valAx.bDelete)
			{
				//подпись оси OY находится левее крайней левой точки
				if(leftDownPointX >= valAx.labels.x)
				{
					left = leftDownPointX - valAx.labels.x;
				}
				else if((valAx.labels.x + valAx.labels.extX) >= rightUpPointX)//правее крайней правой точки
				{
					right = valAx.labels.x + valAx.labels.extX - rightUpPointX;
				}
			}
			
			
			if(catAx.labels && !catAx.bDelete)
			{
				//подпись оси OX находится ниже крайней нижней точки
				if((catAx.labels.y + catAx.labels.extY) >= leftDownPointY)
				{
					bottom = (catAx.labels.y + catAx.labels.extY) - leftDownPointY;
				}
				else if(catAx.labels.y <= rightUpPointY)//выше верхней
				{
					top = rightUpPointY - catAx.labels.y;
				}
			}
		}
		else if(isHBar !== undefined && valAx && catAx && catAx.xPoints && valAx.yPoints)
		{
			if(!orientationCatAx)
			{
				leftDownPointX = catAx.xPoints[catAx.xPoints.length - 1].pos - Math.abs((catAx.interval) / 2);
			}
			else
			{
				if(crossBetween == AscFormat.CROSS_BETWEEN_BETWEEN)
					leftDownPointX = catAx.xPoints[0].pos - (catAx.interval) / 2;
				else
					leftDownPointX = catAx.xPoints[0].pos;
			}
			
			if(orientationValAx)
				leftDownPointY = valAx.yPoints[0].pos;
			else
				leftDownPointY = valAx.yPoints[valAx.yPoints.length - 1].pos;
			
			
			if(!orientationCatAx)
			{
				rightUpPointX = catAx.xPoints[0].pos;
			}
			else
			{
				if(crossBetween == AscFormat.CROSS_BETWEEN_BETWEEN)
					rightUpPointX = catAx.xPoints[catAx.xPoints.length - 1].pos + (catAx.interval) / 2;
				else
					rightUpPointX = catAx.xPoints[catAx.xPoints.length - 1].pos;
			}


			if(orientationValAx)
				rightUpPointY = valAx.yPoints[valAx.yPoints.length - 1].pos;
			else
				rightUpPointY = valAx.yPoints[0].pos;
			
			
			
			if(valAx.labels && !valAx.bDelete)
			{
				//подпись оси OY находится левее крайней левой точки
				if(leftDownPointX >= valAx.labels.x)
				{
					left = leftDownPointX - valAx.labels.x;
				}
				else if((valAx.labels.x + valAx.labels.extX) >= rightUpPointY)//правее крайней правой точки
				{
					right = valAx.labels.extX;
				}
			}
			
			
			if(catAx.labels && !catAx.bDelete)
			{
				//подпись оси OX находится ниже крайней нижней точки
				if((catAx.labels.y + catAx.labels.extY) >= leftDownPointY)
				{
					bottom = (catAx.labels.y + catAx.labels.extY) - leftDownPointY;
				}
				else if(catAx.labels.y <= rightUpPointY)//выше верхней
				{
					top = rightUpPointY - catAx.labels.y;
				}
			}
		}
		
		
		return {left: left, right: right, top: top, bottom: bottom};
	},
	
	
	
	//****calculate properties****
	_calculateProperties: function(chartProp)
	{
		if(!this.calcProp.scale)
			this.preCalculateData(chartProp);
		
		//считаем маргины
		this._calculateMarginsChart(chartProp);
		
		this.calcProp.trueWidth = this.calcProp.widthCanvas - this.calcProp.chartGutter._left - this.calcProp.chartGutter._right;
		this.calcProp.trueHeight = this.calcProp.heightCanvas - this.calcProp.chartGutter._top - this.calcProp.chartGutter._bottom;
		
		//count line of chart grid
		if((chartProp.chart.plotArea.valAx && chartProp.chart.plotArea.catAx && chartProp.chart.plotArea.valAx.yPoints && chartProp.chart.plotArea.catAx.xPoints) || (chartProp.chart.plotArea.catAx && chartProp.chart.plotArea.valAx && chartProp.chart.plotArea.catAx.yPoints && chartProp.chart.plotArea.valAx.xPoints))
		{	
			if(chartProp.chart.plotArea.valAx.yPoints)
				this.calcProp.numhlines = chartProp.chart.plotArea.valAx.yPoints.length - 1;
			if(this.calcProp.type == "Bar")
			{
				this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
				
				this.calcProp.numvMinorlines = 2;
				this.calcProp.numhMinorlines = 5;
			}
			else if(this.calcProp.type == "HBar")
			{
				this.calcProp.numhlines = chartProp.chart.plotArea.catAx.yPoints.length;
				this.calcProp.numvlines = chartProp.chart.plotArea.valAx.xPoints.length - 1;
				
				this.calcProp.numhMinorlines = 2;
				this.calcProp.numvMinorlines = 5;
			}
			else if(this.calcProp.type == "Line" || this.calcProp.type == "Stock")
			{
				this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
				
				this.calcProp.numvMinorlines = 2;
				this.calcProp.numhMinorlines = 5;
			}
			else if(this.calcProp.type == "Scatter" || this.calcProp.type == "BubbleChart")
			{
				this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
				
				this.calcProp.numvMinorlines = 5;
				this.calcProp.numhMinorlines = 5;
			}
			else if(this.calcProp.type == "Area")
			{
				this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
				
				this.calcProp.numvMinorlines = 2;
				this.calcProp.numhMinorlines = 5;
			}
		}
		
		
		if(this.calcProp.type != "Scatter")
		{
			this.calcProp.nullPositionOX = this._getNullPosition();
			this.calcProp.nullPositionOXLog = this._getNullPositionLog();
		}
			
		else
		{
			var scatterNullPos = this._getScatterNullPosition();
			this.calcProp.nullPositionOX = scatterNullPos.x;
			this.calcProp.nullPositionOY = scatterNullPos.y;
		}
	
		if(this.calcProp.type == "Bar")
		{
			this.calcProp.max = this.calcProp.scale[this.calcProp.scale.length -1];
			this.calcProp.min = this.calcProp.scale[0];
		}
	},
	
	//****new calculate data****
	_calculateStackedData2: function()
	{	
		var maxMinObj;
		if(this.calcProp.type == "Bar" || this.calcProp.type == "HBar")
		{
			if (this.calcProp.subType == 'stacked') {
				var originalData = $.extend(true, [], this.calcProp.data);
				for (var j = 0; j < this.calcProp.data.length; j++) {
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						this.calcProp.data[j][i] = this._findPrevValue(originalData, j, i)
					}
				}
				
				maxMinObj = this._getMaxMinValueArray(this.calcProp.data);
				this.calcProp.max = maxMinObj.max;
				this.calcProp.min = maxMinObj.min;
			}
			else if(this.calcProp.subType == 'stackedPer') {
				var summ;
				var originalData = $.extend(true, [], this.calcProp.data);
				for (var j = 0; j < (this.calcProp.data.length); j++) {
					summ = 0;
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						summ += Math.abs(this.calcProp.data[j][i]);
					}
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						this.calcProp.data[j][i] = (this._findPrevValue(originalData, j, i) * 100) / summ;
					}
				}
				
				maxMinObj = this._getMaxMinValueArray(this.calcProp.data);
				this.calcProp.max = maxMinObj.max;
				this.calcProp.min = maxMinObj.min;
			}
		}
		
		
		if(this.calcProp.type == "Line" || this.calcProp.type == "Area")
		{
			if (this.calcProp.subType == 'stacked') {
				for (var j = 0; j < (this.calcProp.data.length - 1); j++) {
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						if(!this.calcProp.data[j + 1])
							this.calcProp.data[j + 1] = [];
						this.calcProp.data[j + 1][i] = this.calcProp.data[j + 1][i] + this.calcProp.data[j][i];
					};
				};
				
				maxMinObj = this._getMaxMinValueArray(this.calcProp.data);
				this.calcProp.max = maxMinObj.max;
				this.calcProp.min = maxMinObj.min;
			}
			else if (this.calcProp.subType == 'stackedPer') {
				var firstData = this.calcProp.data;
				
				var summValue = [];
				for (var j = 0; j < (firstData[0].length); j++) {
					summValue[j] = 0;
					for (var i = 0; i < firstData.length; i++) {
						summValue[j] += Math.abs(firstData[i][j])
					};
				};
				
				for (var j = 0; j < (this.calcProp.data.length - 1); j++) {
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						this.calcProp.data[j + 1][i] = this.calcProp.data[j + 1][i] + this.calcProp.data[j][i]
					};
				};
				
				var tempData = this.calcProp.data;

				for (var j = 0; j < (tempData[0].length); j++) {
					for (var i = 0; i < tempData.length; i++) {
						if(summValue[j] == 0)
							tempData[i][j] = 0;
						else
							tempData[i][j] = (100 * tempData[i][j]) / (summValue[j]);
					};
				};
				
				maxMinObj = this._getMaxMinValueArray(tempData);
				this.calcProp.max = maxMinObj.max;
				this.calcProp.min = maxMinObj.min;
				this.calcProp.data = tempData;
			}
		}
	},
	
	_calculateData2: function(chart) {	
		var max = 0;
		var min = 0; 
		var minY = 0;
		var maxY = 0;
		var xNumCache, yNumCache, newArr;
		
		var series = chart.chart.plotArea.chart.series;
		if(this.calcProp.type != 'Scatter')//берём данные из NumCache
		{
			var arrValues = [];
			var isSkip = [];
			var skipSeries = [];
			
			var isEn = false;
			var isEnY = false;
			var numSeries = 0;
			var curSeria;
			var isNumberVal = true;
			
			
			for(var l = 0; l < series.length; ++l)
			{
				var firstCol = 0;
				var firstRow = 0;
				
				curSeria = series[l].val.numRef && series[l].val.numRef.numCache ? series[l].val.numRef.numCache.pts : series[l].val.numLit ? series[l].val.numLit.pts : null;
				
				skipSeries[l] = true;
			
				if(series[l].isHidden == true)
					continue;
				if(!curSeria || !curSeria.length)
					continue;
				
				skipSeries[l] = false;
				arrValues[numSeries] = [];
				isSkip[numSeries] = true;
		
				var row = firstRow;
				var n = 0;
				for(var col = firstCol; col < curSeria.length; ++col)
				{
					if(!curSeria[col])
					{
						curSeria[col] = {val:0};
					}
					else if(curSeria[col].isHidden == true)
					{
						continue;
					}
					
					var cell = curSeria[col];
					
					var orValue = cell.val;

					if('' != orValue)
						isSkip[numSeries] = false;
					var value =  parseFloat(orValue);
					if(!isEn && !isNaN(value))
					{
						min = value;
						max = value;
						isEn = true;
					}
					if(!isNaN(value) && value > max)
						max = value;
					if(!isNaN(value) && value < min)
						min = value;
					if(isNaN(value) && orValue == '' && (((this.calcProp.type == 'Line' ) && this.calcProp.type == 'normal')))
					{
						value = '';
					}
					else if (isNaN(value))
					{
						value = 0;
					}
					
					if(this.calcProp.type == 'Pie' || this.calcProp.type == "DoughnutChart")
						arrValues[numSeries][n] = Math.abs(value);
					else
						arrValues[numSeries][n] = value;

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
				yNumCache = series[l].yVal.numRef && series[l].yVal.numRef.numCache ? series[l].yVal.numRef.numCache : series[l].yVal && series[l].yVal.numLit ? series[l].yVal.numLit : null;
				
				if(!yNumCache)
					continue;
				
				for(var j = 0; j < yNumCache.pts.length; ++j)
				{
					yVal = parseFloat(yNumCache.pts[j].val);
					
					xNumCache = series[l].xVal && series[l].xVal.numRef ? series[l].xVal.numRef.numCache : series[l].xVal && series[l].xVal.numLit ? series[l].xVal.numLit : null;
					if(xNumCache && xNumCache.pts[j])
					{
						if(!isNaN(parseFloat(xNumCache.pts[j].val)))
							xVal = parseFloat(xNumCache.pts[j].val);
						else
							xVal = j + 1;
					}
					else
						xVal = j + 1;
					
					newArr[l][j] = [xVal, yVal];
					
					if(l == 0 && j == 0)
					{
						min = xVal;
						max = xVal;
						minY = yVal;
						maxY = yVal;
					}
					
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

		this.calcProp.min = min;
		this.calcProp.max = max;
		
		if(newArr)
			arrValues = newArr;
			
		if(this.calcProp.type == 'Bar' || this.calcProp.type == 'HBar')
			this.calcProp.data = arrReverse(arrValues);
		else
			this.calcProp.data = arrValues
	},
	
	_getAxisData2: function (isOx, minVal, maxVal, chartProp)
    {
		return this._getAxisValues(isOx, minVal, maxVal, chartProp);
	},
	
	_getAxisValues : function(isOx, yMin, yMax, chartProp)
	{
		//chartProp.chart.plotArea.valAx.scaling.logBase
		var axisMin, axisMax, firstDegree, step, arrayValues;

		if(!('Scatter' == this.calcProp.type && isOx)){
			if(chartProp.chart.plotArea.valAx && chartProp.chart.plotArea.valAx.scaling.logBase)
			{
				arrayValues = this._getLogArray(yMin, yMax, chartProp.chart.plotArea.valAx.scaling.logBase);
				return arrayValues;
			}
		}
		else{
			if(chartProp.chart.plotArea.catAx && chartProp.chart.plotArea.catAx.scaling && chartProp.chart.plotArea.catAx.scaling.logBase)
			{
				arrayValues = this._getLogArray(yMin, yMax, chartProp.chart.plotArea.catAx.scaling.logBase);
				return arrayValues;
			}
		}
		
		//максимальное и минимальное значение(по документации excel)
		var trueMinMax = this._getTrueMinMax(isOx, yMin, yMax);
		
		var manualMin;
		var manualMax;
		if('Scatter' == this.calcProp.type && isOx)
		{
			manualMin = chartProp.chart.plotArea.catAx && chartProp.chart.plotArea.catAx.scaling && chartProp.chart.plotArea.catAx.scaling.min !== null ? chartProp.chart.plotArea.catAx.scaling.min : null;
			manualMax = chartProp.chart.plotArea.catAx && chartProp.chart.plotArea.catAx.scaling && chartProp.chart.plotArea.catAx.scaling.max !== null ? chartProp.chart.plotArea.catAx.scaling.max : null;
		}
		else
		{
			manualMin = chartProp.chart.plotArea.valAx && chartProp.chart.plotArea.valAx.scaling && chartProp.chart.plotArea.valAx.scaling.min !== null ? chartProp.chart.plotArea.valAx.scaling.min : null;
			manualMax = chartProp.chart.plotArea.valAx && chartProp.chart.plotArea.valAx.scaling && chartProp.chart.plotArea.valAx.scaling.max !== null ? chartProp.chart.plotArea.valAx.scaling.max : null;
		}
		
		if(this.calcProp.subType == 'stackedPer' && manualMin != null)
			manualMin = manualMin * 100;
		if(this.calcProp.subType == 'stackedPer' && manualMax != null)
			manualMax = manualMax * 100;
		
		//TODO временная проверка для некорректных минимальных и максимальных значений
		if(manualMax && manualMin && manualMax < manualMin)
		{
			if(manualMax < 0)
				manualMax = 0;
			else
				manualMin = 0;
		}
		
		axisMin =  manualMin !== null && manualMin !== undefined ? manualMin : trueMinMax.min;
		axisMax =  manualMax !== null && manualMax !== undefined ? manualMax : trueMinMax.max;
		
		var percentChartMax = 100;
		if(this.calcProp.subType == 'stackedPer' && axisMax > percentChartMax)
			axisMax = percentChartMax;
		if(this.calcProp.subType == 'stackedPer' && axisMin < - percentChartMax)
			axisMin = - percentChartMax;
		
		
		if(axisMax < axisMin)
		{
			manualMax = 2 * axisMin;
			axisMax = manualMax;
		}
			
		
		//приводим к первому порядку
		firstDegree = this._getFirstDegree((Math.abs(axisMax - axisMin)) / 10);

		var axis = 'Scatter' == this.calcProp.type && isOx ? chartProp.chart.plotArea.catAx : chartProp.chart.plotArea.valAx;
		//находим шаг
		if(axis && axis.majorUnit !== null)
		{
			step = axis.majorUnit;
		}
		else
		{
			var firstStep;
			if(isOx || 'HBar' == this.calcProp.type)
				step = this._getStep(firstDegree.val + (firstDegree.val / 10) * 3);
			else
				step = this._getStep(firstDegree.val);
				
			firstStep = step;
			step = step * firstDegree.numPow;
		}
		
		if(isNaN(step) || step === 0)
		{
			if('HBar' == this.calcProp.type && this.calcProp.subType == 'stackedPer')
				arrayValues = [0, 0.2, 0.4, 0.6, 0.8, 1];
			else if(this.calcProp.subType == 'stackedPer')
				arrayValues = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
			else
				arrayValues = [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2];
		}
		else
			arrayValues = this._getArrayDataValues(step, axisMin, axisMax, manualMin, manualMax);
		
		//проверка на переход в другой диапазон из-за ограничения по высоте
		/*if(!isOx)
		{
			var trueHeight = this.calcProp.heightCanvas - this.calcProp.chartGutter._top - this.calcProp.chartGutter._bottom;
			var newStep;
			
			while(Math.round(trueHeight / arrayValues.length) < 16)
			{
				newStep = this._getNextStep(firstStep);
				arrayValues = this._getArrayDataValues(newStep, axisMin, axisMax, manualMin, manualMax);
			};	
		};*/
		
		return arrayValues;
	},
	
	_getArrayDataValues: function(step, axisMin, axisMax, manualMin, manualMax)
	{
		var arrayValues;
		//минимальное значение оси
		//TODO use axisMin
		var minUnit = 0;
		
		if(manualMin != null)
			minUnit = manualMin;
		else if(manualMin == null && axisMin != null && axisMin != 0 && axisMin > 0 && axisMax > 0)//TODO пересмотреть все значения, где-то могут быть расхождения с EXCEL
		{
			minUnit = parseInt(axisMin / step) * step;
		}
		else
		{
			if(axisMin < 0)
			{
				while(minUnit > axisMin)
				{
					minUnit -= step;
				}
			}
			else if(axisMin > 0)
			{
				while(minUnit < axisMin && minUnit > (axisMin - step))
				{
					minUnit += step;
				}	
			}
		}
		
		//массив подписей
		arrayValues = this._getArrayAxisValues(minUnit, axisMin, axisMax, step, manualMin, manualMax);
		
		return arrayValues;
	},
	
	_getLogArray: function(yMin, yMax, logBase)
	{	
		var result = [];
		
		var temp;
		var pow = 0;
		var tempPow = yMin;
		
		if(yMin < 1 && yMin > 0)
		{	
			temp = this._getFirstDegree(yMin).numPow;
			
			tempPow = temp;
			while(tempPow < 1)
			{
				pow --;
				tempPow = tempPow * 10;
			}
		}
		else	
			temp = Math.pow(logBase, 0);
			
		if(logBase < 1)
			logBase = 2;
		
		var step = 0;
		var lMax = 1;
		if(yMin < 1 && yMin > 0)
		{
			if(lMax < yMax)
				lMax = yMax;
			
			while(temp < lMax)
			{
				temp = Math.pow(logBase, pow);
				result[step] = temp;
				pow++;
				step++;
			}
		}
		else
		{
			while(temp <= yMax)
			{
				temp = Math.pow(logBase, pow);
				result[step] = temp;
				pow++;
				step++;
			}
		}
		
		return result;
	},
	
	_getArrayAxisValues: function(minUnit, axisMin, axisMax, step, manualMin, manualMax)
	{
		var arrayValues = [];
		for(var i = 0; i < 20; i++)
		{
			if(this.calcProp.subType == 'stackedPer' && (minUnit + step * i) > 100)
				break;
			
			arrayValues[i] = minUnit + step * i;
			if(axisMax == 0 && axisMin < 0 && arrayValues[i] == axisMax)
			{
				break;
			}
			else if((manualMax != null && arrayValues[i] >= axisMax) || (manualMax == null && arrayValues[i] > axisMax))
			{
				if(this.calcProp.subType == 'stackedPer')
					arrayValues[i] = arrayValues[i] / 100;
				break;
			}
			else if(this.calcProp.subType == 'stackedPer')
				arrayValues[i] = arrayValues[i] / 100;
				
		}
		
		if(this.calcProp.subType == 'stackedPer')
		{
			//TODO пересмотреть все ситуации, когда заданы фиксированные максимальные и минимальные значение выше 100%
			if(step > axisMax)
				arrayValues = [axisMin, axisMax];
		}
		
		if(!arrayValues.length)
			arrayValues = [0.2, 0.4, 0.6, 0.8, 1, 1.2];
			
		return arrayValues;
	},
	
	_getStep : function(step)
	{
		if(step > 1 && step <= 2)
			step = 2;
		else if(step > 2 && step <= 5)
			step = 5;
		else if(step > 5 && step <= 10)
			step = 10;
		else if(step > 10 && step <= 20)
			step = 20;
			
		return step;
	},
	
	_getTrueMinMax : function(isOx, yMin, yMax)
	{
		var axisMax, axisMin, diffPerMaxMin;
		if(yMin >= 0 && yMax >= 0)
		{
			axisMax = yMax + 0.05 * ( yMax - yMin );
			
			diffPerMaxMin = ((yMax - yMin) / yMax)*100;
			if(16.667 > diffPerMaxMin)
			{
				axisMin = yMin - ((yMax - yMin) / 2);
			}
			else
			{
				axisMin = 0;
			}
		}
		else if(yMin <= 0 && yMax <= 0)
		{
			diffPerMaxMin = ((yMin - yMax) / yMin) * 100;
			axisMin =  yMin + 0.05 * (yMin - yMax);
			
			if(16.667 < diffPerMaxMin)
			{
				axisMax = 0;
			}
			else
			{
				axisMax = yMax - ((yMin - yMax) / 2)
			}
		}
		else if(yMax > 0 && yMin < 0)
		{
			axisMax = yMax + 0.05 * (yMax - yMin);
			axisMin = yMin + 0.05 * (yMin - yMax);
		}
		
		if(axisMin == axisMax)
		{
			if(axisMin < 0)
				axisMax = 0;
			else
				axisMin = 0;
		}
		
		return {min: axisMin, max: axisMax};
	},
	
	
	
	//****get null position****
	_getNullPosition: function()
	{
		var numNull = this.calcProp.numhlines;
			
		var min = this.calcProp.min;
		var max = this.calcProp.max;
		
		if(this.cChartSpace.chart.plotArea.valAx && this.cChartSpace.chart.plotArea.valAx.scaling.logBase)
		{
			if(min < 0)
				min = 0;
			if(max < 0)
				max = 0;
		}

		var orientation = this.cChartSpace && this.cChartSpace.chart.plotArea.valAx ? this.cChartSpace.chart.plotArea.valAx.scaling.orientation : ORIENTATION_MIN_MAX;
		
		if(min >= 0 && max >= 0)
		{
			if(orientation == ORIENTATION_MIN_MAX)
				numNull = 0;
			else
			{
				numNull = this.calcProp.numhlines;
				if(this.calcProp.type == "HBar")
					numNull = this.calcProp.numvlines;
			}
		}
		else if(min <= 0 && max <= 0)
		{
			if(orientation == ORIENTATION_MIN_MAX)
			{
				numNull = this.calcProp.numhlines;
				if(this.calcProp.type == "HBar")
					numNull = this.calcProp.numvlines;
			}
			else
				numNull = 0;
		}
		else
		{
			var valPoints;
			if(this.cChartSpace.chart.plotArea.valAx)
			{
				if(this.calcProp.type == "HBar")
					valPoints = this.cChartSpace.chart.plotArea.valAx.xPoints;
				else
					valPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
				
					
				for (var i = 0; i < valPoints.length; i++)
				{
					if(valPoints[i].val == 0)
					{
						result =  valPoints[i].pos * this.calcProp.pxToMM;
						break;
					}
				}
			}
			
			return result;
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
	
	
	
	//****get null position****
	_getNullPositionLog: function()
	{
		var valPoints, result;
		if(this.cChartSpace.chart.plotArea.valAx)
		{
			if(this.calcProp.type == "HBar")
				valPoints = this.cChartSpace.chart.plotArea.valAx.xPoints;
			else
				valPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
			
				
			for (var i = 0; i < valPoints.length; i++)
			{
				if(valPoints[i].val == 1)
				{
					result =  valPoints[i].pos * this.calcProp.pxToMM;
					break;
				}
			}
		}		
		return result;
	},
	
	_getScatterNullPosition: function()
	{
		var x, y;
		//OY
		for(var i = 0; i < this.calcProp.xScale.length; i++)
		{
			if(this.calcProp.xScale[i] == 0)
			{
				y = this.calcProp.chartGutter._left + i * (this.calcProp.trueWidth / (this.calcProp.xScale.length - 1));
				break;
			}
		}
		//OX
		for(var i = 0; i < this.calcProp.scale.length; i++)
		{
			if(this.calcProp.scale[i] == 0)
			{
				x = this.calcProp.heightCanvas - (this.calcProp.chartGutter._bottom + i * (this.calcProp.trueHeight / (this.calcProp.scale.length - 1)));
				break;
			}
		}
		return {x: x, y: y};
	},
	
	
	
	//****functions for UP Functions****
	preCalculateData: function(chartProp)
	{
		this.calcProp.pxToMM = 1 / AscCommon.g_dKoef_pix_to_mm;
		
		this.calcProp.pathH = 1000000000;
		this.calcProp.pathW = 1000000000;
		
		var typeChart = chartProp.chart.plotArea.chart.getObjectType();
		
		switch ( typeChart )
		{
			case AscDFH.historyitem_type_LineChart:
			{
				this.calcProp.type = "Line";
				break;
			}
			case AscDFH.historyitem_type_BarChart:
			{
				if(chartProp.chart.plotArea.chart.barDir !== AscFormat.BAR_DIR_BAR)
					this.calcProp.type = "Bar";
				else 
					this.calcProp.type = "HBar";
				break;
			}
			case AscDFH.historyitem_type_PieChart:
			{
				this.calcProp.type = "Pie";
				break;
			}
			case AscDFH.historyitem_type_AreaChart:
			{
				this.calcProp.type = "Area";
				break;
			}
			case AscDFH.historyitem_type_ScatterChart:
			{
				this.calcProp.type = "Scatter";
				break;
			}
			case AscDFH.historyitem_type_StockChart:
			{
				this.calcProp.type = "Stock";
				break;
			}
			case AscDFH.historyitem_type_DoughnutChart:
			{
				this.calcProp.type = "DoughnutChart";
				break;
			}
			case AscDFH.historyitem_type_RadarChart:
			{
				this.calcProp.type = "Radar";
				break;
			}
			case AscDFH.historyitem_type_BubbleChart:
			{
				//this.calcProp.type = "BubbleChart";
				this.calcProp.type = "Scatter";
				break;
			}
		}
		
		var grouping = chartProp.chart.plotArea.chart.grouping;
		if(this.calcProp.type == "Line" || this.calcProp.type == "Area")
			this.calcProp.subType = (grouping === AscFormat.GROUPING_PERCENT_STACKED) ? "stackedPer" : (grouping === AscFormat.GROUPING_STACKED) ? "stacked" : "normal";
		else if(this.nDimensionCount === 3 && grouping === AscFormat.BAR_GROUPING_STANDARD)
			this.calcProp.subType = "standard";
		else
			this.calcProp.subType = (grouping === AscFormat.BAR_GROUPING_PERCENT_STACKED) ? "stackedPer" : (grouping === AscFormat.BAR_GROUPING_STACKED) ? "stacked" : "normal";
		
		
		this.calcProp.xaxispos = null;
		this.calcProp.yaxispos = null;
		
		//рассчёт данных и ещё некоторых параметров(this.calcProp./min/max/ymax/ymin/data)
		this._calculateData2(chartProp);
		
		//пересчёт данных для накопительных диаграмм
		if(this.calcProp.subType == 'stackedPer' || this.calcProp.subType == 'stacked')
			this._calculateStackedData2();
		
		//***series***
		this.calcProp.series = chartProp.chart.plotArea.chart.series;
		
		//отсеиваем пустые серии
		this.calcProp.seriesCount = this._calculateCountSeries(chartProp);
		
		if(this.calcProp.type == "Scatter")
		{
			this.calcProp.scale = this._roundValues(this._getAxisData2(false, this.calcProp.ymin, this.calcProp.ymax, chartProp));	
			this.calcProp.xScale = this._roundValues(this._getAxisData2(true, this.calcProp.min, this.calcProp.max, chartProp));
		}
		else
			this.calcProp.scale = this._roundValues(this._getAxisData2(false, this.calcProp.min, this.calcProp.max, chartProp));	
		
		
		this.calcProp.widthCanvas = chartProp.extX*this.calcProp.pxToMM;
		this.calcProp.heightCanvas = chartProp.extY*this.calcProp.pxToMM;
	},
	
	calculateSizePlotArea : function(chartSpace)
	{
		this._calculateMarginsChart(chartSpace);
		
		var widthCanvas = chartSpace.extX;
		var heightCanvas = chartSpace.extY;
		
		var w = widthCanvas - (this.calcProp.chartGutter._left + this.calcProp.chartGutter._right) / this.calcProp.pxToMM;
		var h = heightCanvas - (this.calcProp.chartGutter._top + this.calcProp.chartGutter._bottom) / this.calcProp.pxToMM;
		

        return {w: w , h: h , startX: this.calcProp.chartGutter._left / this.calcProp.pxToMM, startY: this.calcProp.chartGutter._top / this.calcProp.pxToMM};
	},
	
	drawPath: function(path, pen, brush)
	{	
		if(!path)
			return;
		
		if(pen)
			path.stroke = true;

		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();

        cGeometry.AddPath(path);
		this.cShapeDrawer.fromShape2(new CColorObj(pen, brush, cGeometry) ,this.cShapeDrawer.Graphics, cGeometry);

		this.cShapeDrawer.draw(cGeometry);
	},
	
	//****functions for chart classes****
	calculatePoint: function(x, y, size, symbol)
	{
		size = size / 2.69;
		var halfSize = size / 2;
		var path  = new Path();
		var pathH = this.calcProp.pathH;
		var pathW = this.calcProp.pathW;
		var gdLst = [];

		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var framePaths = null;
		
		var result;

		/*
		var AscFormat.SYMBOL_PICTURE = 5;*/
		
		path.moveTo(x * pathW, y * pathW);
		
		switch ( symbol )
		{
			case AscFormat.SYMBOL_DASH:
			{
				path.moveTo((x - halfSize) * pathW, y * pathW);
				path.lnTo((x + halfSize) * pathW, y * pathW);
				break;
			}
			case AscFormat.SYMBOL_DOT:
			{
				path.moveTo((x - halfSize / 2) * pathW, y * pathW);
				path.lnTo((x + halfSize / 2) * pathW, y * pathW);
				break;
			}
			
			case AscFormat.SYMBOL_PLUS:
			{
				path.moveTo(x * pathW, (y  + halfSize) * pathW);
				path.lnTo(x * pathW, (y  - halfSize) * pathW);
				path.moveTo((x - halfSize) * pathW, y * pathW);
				path.lnTo((x  + halfSize) * pathW, y * pathW);
				break;
			}
			
			case AscFormat.SYMBOL_CIRCLE:
			{
				path.moveTo((x + halfSize) * pathW, y * pathW);
				path.arcTo(halfSize * pathW, halfSize * pathW, 0, Math.PI * 2 * cToDeg);
				break;
			}
			
			case AscFormat.SYMBOL_STAR:
			{
				path.moveTo((x - halfSize) * pathW, (y  + halfSize) * pathW);
				path.lnTo((x + halfSize) * pathW, (y  - halfSize) * pathW);
				path.moveTo((x + halfSize) * pathW, (y  + halfSize) * pathW);
				path.lnTo((x  - halfSize) * pathW, (y  - halfSize) * pathW);
				path.moveTo(x * pathW, (y  + halfSize) * pathW);
				path.lnTo(x * pathW, (y  - halfSize) * pathW);
				break;
			}
			
			case AscFormat.SYMBOL_X:
			{
				path.moveTo((x - halfSize) * pathW, (y  + halfSize) * pathW);
				path.lnTo((x + halfSize) * pathW, (y  - halfSize) * pathW);
				path.moveTo((x + halfSize) * pathW, (y  + halfSize) * pathW);
				path.lnTo((x  - halfSize) * pathW, (y  - halfSize) * pathW);
				break;
			}
			
			case AscFormat.SYMBOL_TRIANGLE:
			{
				path.moveTo((x - size/Math.sqrt(3)) * pathW, (y  + size/3) * pathW);
				path.lnTo(x * pathW, (y  - (2/3)*size) * pathW);
				path.lnTo((x + size/Math.sqrt(3)) * pathW, (y  + size/3) * pathW);
				path.lnTo((x - size/Math.sqrt(3)) * pathW, (y  + size/3) * pathW);
				break;
			}
			
			case AscFormat.SYMBOL_SQUARE:
			{
				path.moveTo((x - halfSize) * pathW, (y + halfSize) * pathW);
				path.lnTo((x - halfSize) * pathW, (y - halfSize) * pathW);
				path.lnTo((x + halfSize) * pathW, (y - halfSize) * pathW);
				path.lnTo((x + halfSize) * pathW, (y + halfSize) * pathW);
				path.lnTo((x - halfSize) * pathW, (y + halfSize) * pathW);
				break;
			}
			
			case AscFormat.SYMBOL_DIAMOND:
			{
				path.moveTo((x - halfSize) * pathW, y * pathW);
				path.lnTo(x * pathW, (y  - halfSize) * pathW);
				path.lnTo((x + halfSize) * pathW, y * pathW);
				path.lnTo(x * pathW, (y  + halfSize) * pathW);
				path.lnTo((x - halfSize) * pathW, y  * pathW);
				break;
			}
		}
		
		if(symbol == "Plus" || symbol == "Star" || symbol == "X")
		{
			framePaths = new Path();
			framePaths.moveTo((x - halfSize) * pathW, (y + halfSize) * pathW);
			framePaths.lnTo((x - halfSize) * pathW, (y - halfSize) * pathW);
			framePaths.lnTo((x + halfSize) * pathW, (y - halfSize) * pathW);
			framePaths.lnTo((x + halfSize) * pathW, (y + halfSize) * pathW);
			framePaths.lnTo((x - halfSize) * pathW, (y + halfSize) * pathW);
		}
		
		path.recalculate(gdLst);
		if(framePaths)
			framePaths.recalculate(gdLst);
		result = {framePaths: framePaths, path: path};
		
		return result;
	},
	
	getYPosition: function(val, yPoints, isOx, logBase)
	{
		if(logBase)
		{	
			return this._getYPositionLogBase(val, yPoints, isOx, logBase);
		}
		
		//позиция в заисимости от положения точек на оси OY
		var result;
		var resPos;
		var resVal;
		var diffVal;
		var plotArea = this.cChartSpace.chart.plotArea;
		
		if(val < yPoints[0].val)
		{
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			if(isOx)
				result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
			else
				result = yPoints[0].pos + Math.abs((diffVal / resVal) * resPos);
		}
		else if(val > yPoints[yPoints.length - 1].val)
		{	
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[yPoints.length - 1].val - val);
			
			if(plotArea.valAx.scaling.orientation == ORIENTATION_MIN_MAX)
			{
				if(isOx)
					result = yPoints[yPoints.length - 1].pos + (diffVal / resVal) * resPos;
				else
					result = yPoints[yPoints.length - 1].pos - (diffVal / resVal) * resPos;
			}
			else
			{
				if(isOx)
					result = yPoints[yPoints.length - 1].pos - (diffVal / resVal) * resPos;
				else
					result = yPoints[yPoints.length - 1].pos + (diffVal / resVal) * resPos;
			}
		}
		else
		{
			for(var s = 0; s < yPoints.length; s++)
			{
				if(val >= yPoints[s].val && val <= yPoints[s + 1].val)
				{
					resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
					resVal = yPoints[s + 1].val - yPoints[s].val;
					
					var startPos = yPoints[s].pos;
					
					if(!isOx)
					{
						if(plotArea.valAx.scaling.orientation == ORIENTATION_MIN_MAX)
							result =  - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
						else
							result =  (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
					}	
					else	
					{
						if(this.calcProp.type == "Scatter" || this.calcProp.type == "Stock")
						{
							if(plotArea.catAx.scaling.orientation != ORIENTATION_MIN_MAX)
								result = - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
							else
								result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
						}
						else
						{
							if((plotArea.valAx.scaling.orientation == ORIENTATION_MIN_MAX && this.calcProp.type != "Line") || (plotArea.catAx.scaling.orientation == ORIENTATION_MIN_MAX && this.calcProp.type == "Line"))
								result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
							else
								result = - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
						}
					}
						
					break;
				}
			}
		}
		
		return result;
	},
	
	_getYPositionLogBase: function(val, yPoints, isOx, logBase)
	{
		if(val < 0)
			return 0;

		var logVal = Math.log(val) / Math.log(logBase);
		var result;
		
		if(logVal < 0)
		{
			var parseVal = logVal.toString().split(".");
			var maxVal = Math.pow(logBase, parseVal[0]);
			var minVal = Math.pow(logBase, parseFloat(parseVal[0]) - 1);
			var startPos = 0;
			var diffPos;
			for(var i = 0; i < yPoints.length; i++)
			{
				if(yPoints[i].val < maxVal && yPoints[i].val > minVal)
				{
					startPos = yPoints[i + 1].pos;
					diffPos = yPoints[i].pos - yPoints[i + 1].pos;
					break;
				}
			}
			result = startPos + parseFloat("0." + parseVal[1]) * diffPos;
		}
		else
		{
			var parseVal = logVal.toString().split(".");
			var minVal = Math.pow(logBase, parseVal[0]);
			var maxVal = Math.pow(logBase, parseFloat(parseVal[0]) + 1);
			var startPos = 0;
			var diffPos;
			for(var i = 0; i < yPoints.length; i++)
			{
				if(yPoints[i].val < maxVal && yPoints[i].val >= minVal)
				{
					startPos = yPoints[i].pos;
					diffPos = yPoints[i].pos - yPoints[i + 1].pos;
					break;
				}
			}
			result = startPos - parseFloat("0." + parseVal[1]) * diffPos;
		}
		
		return result;
	},
	
	getLogarithmicValue: function(val, logBase, yPoints)
	{
		if(val < 0)
			return 0;
			
		var logVal = Math.log(val) / Math.log(logBase);
		
		var temp = 0;
		if(logVal > 0)
		{
			for(var l = 0; l < logVal; l++)
			{
				if(l != 0)
					temp += Math.pow(logBase, l);
				if(l + 1 > logVal)
				{
					temp += (logVal - l) * Math.pow(logBase, l + 1);
					break;
				}	
			}
		}
		else
		{
			var parseTemp = logVal.toString().split(".");
			var nextTemp = Math.pow(logBase, parseFloat(parseTemp[0]) - 1);
			temp = Math.pow(logBase, parseFloat(parseTemp[0]));
			
			temp =  temp - temp * parseFloat("0." + parseTemp[1]);
		}
		
		return temp;
	},
	
	
	
	//****for 3D****
	_calaculate3DProperties: function(chartSpace)
	{
		var widthCanvas = this.calcProp.widthCanvas;
		var heightCanvas = this.calcProp.heightCanvas;
		var left = this.calcProp.chartGutter._left;
		var right = this.calcProp.chartGutter._right;
		var bottom = this.calcProp.chartGutter._bottom;
		var top = this.calcProp.chartGutter._top;
		
		standartMarginForCharts = 17;
		
		
		this.processor3D = new AscFormat.Processor3D(widthCanvas, heightCanvas, left, right, bottom, top, chartSpace, this);
		this.processor3D.calaculate3DProperties();
		this.processor3D.correctPointsPosition(chartSpace);
	},
	
	_convertAndTurnPoint: function(x, y, z)
	{
		return this.processor3D.convertAndTurnPoint(x, y, z);
	},

	//position of catAx labels(left or right) - returns false(left of axis)/true(right of axis) or null(standard position)
	calculatePositionLabelsCatAxFromAngle: function(chartSpace)
	{
		var res = null;

		var angleOy = chartSpace.chart.view3D && chartSpace.chart.view3D.rotY ? (- chartSpace.chart.view3D.rotY / 360) * (Math.PI * 2) : 0;
		if(chartSpace.chart.view3D && !chartSpace.chart.view3D.rAngAx && angleOy !== 0)
		{
			var angleOy = Math.abs(angleOy);

			if(angleOy >= Math.PI / 2 && angleOy < 3 * Math.PI / 2)
				res = true;
			else
				res = false;
		}
		
		return res;
	},
	
	
	//****accessory functions****
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
			if(typeof(arr[i]) == 'object' && arr[i].val != null && arr[i].val != undefined)
				sum += parseFloat(isAbs ? Math.abs(arr[i].val) : arr[i].val);
			else if(arr[i])
				sum += isAbs ? Math.abs(arr[i]) : arr[i];
		}
        return sum;
    },
	
	_getMaxMinValueArray: function(array)
	{
		var max = 0, min = 0;
		for(var i = 0; i < array.length; i++)
		{
			for(var j = 0; j < array[i].length; j++)
			{
				if(i == 0 && j == 0)
				{
					min =  array[i][j];
					max =  array[i][j];
				};
				
				if(array[i][j] > max)
					max = array[i][j];
					
				if(array[i][j] < min)
					min = array[i][j];
			}
		}
		return {max: max, min: min};
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
	
	_getFirstDegree: function(val)
	{
		var secPart = val.toString().split('.');
		var numPow = 1,tempMax;
		
		if(secPart[1] && secPart[1].toString().indexOf('e+') != -1 && secPart[0] && secPart[0].toString().length == 1)
		{
			var expNum = secPart[1].toString().split('e+');
			numPow = Math.pow(10, expNum[1]);
		}
		else if(secPart[1] && secPart[1].toString().indexOf('e-') != -1 && secPart[0] && secPart[0].toString().length == 1)
		{
			var expNum = secPart[1].toString().split('e');
			numPow = Math.pow(10, expNum[1]);
		}
		else if(0 != secPart[0])
			numPow = Math.pow(10, secPart[0].toString().length - 1)
		else if(0 == secPart[0] && secPart[1] != undefined)
		{
			var tempMax = val;
			var num = 0;
			while(1 > tempMax)
			{
				tempMax = tempMax * 10;
                num--;
			}
            numPow = Math.pow(10, num);
			val = tempMax;
		}

		if(tempMax == undefined)
			val = val / numPow;
		
		return {val: val, numPow: numPow};
	},
	
	getIdxPoint: function(seria, val)
	{
		var seriaVal = seria.val ? seria.val :  seria.yVal;
		
		if(!seriaVal)
			return null;
		
		var pts = seriaVal.numRef &&  seriaVal.numRef.numCache ? seriaVal.numRef.numCache.pts : seriaVal.numLit ? seriaVal.numLit.pts : null;
		
		if(pts == null)
			return null;
		
		for(var p = 0; p < pts.length; p++)
		{
			if(pts[p].idx == val)
				return pts[p];
		}
	},
	
	getPtCount: function(series)
	{
		var numCache;
		for(var i = 0; i < series.length; i++)
		{
			numCache = series[i].val.numRef ? series[i].val.numRef.numCache : series[i].val.numLit;
			if(numCache && numCache.ptCount)
				return numCache.ptCount;
		}
		
		return 0;
	},
	
	_roundValues: function(values)
	{
		var kF = 1000000000;
		if(values.length)
		{
			for(var i = 0; i < values.length; i++)
			{
				values[i] = parseInt(values[i] * kF) / kF;
			}
		}
		
		return values;
	},
	
	
	//***spline functions***
	calculate_Bezier: function(x, y, x1, y1, x2, y2, x3, y3)
	{
		var pts = [], bz = [];   

		pts[0] = {x: x, y: y};
		pts[1] = {x: x1, y: y1};
		pts[2] = {x: x2, y: y2};
		pts[3] = {x: x3, y: y3};
		
		var d01 = this.XYZDist(pts[0], pts[1]);
		var d12 = this.XYZDist(pts[1], pts[2]);
		var d23 = this.XYZDist(pts[2], pts[3]);
		var d02 = this.XYZDist(pts[0], pts[2]);
		var d13 = this.XYZDist(pts[1], pts[3]);
		
		//start point
		bz[0] = pts[1];
		
		
		//control points
		if ((d02 / 6 < d12 / 2) && (d13 / 6 < d12 / 2))
		{
			var f;
			if (x != x1)
				f = 1 / 6;
			else
				f = 1 / 3;
				
			bz[1] = this.XYZAdd(pts[1], this.XYZMult(this.XYZSub(pts[2], pts[0]), f));
			
			if (x2 != x3)
				f = 1 / 6;
			else
				f = 1 / 3;

			bz[2] = this.XYZAdd(pts[2], this.XYZMult(this.XYZSub(pts[1], pts[3]), f))
		}  
		else if ((d02 / 6 >= d12 / 2) && (d13 / 6 >= d12 / 2)) 
		{
			bz[1] = this.XYZAdd(pts[1], this.XYZMult(this.XYZSub(pts[2], pts[0]), d12 / 2 / d02));
			bz[2] = this.XYZAdd(pts[2], this.XYZMult(this.XYZSub(pts[1], pts[3]), d12 / 2 / d13));
		}
		else if((d02 / 6 >= d12 / 2))
		{
			bz[1] = this.XYZAdd(pts[1], this.XYZMult(this.XYZSub(pts[2], pts[0]), d12 / 2 / d02));
			bz[2] = this.XYZAdd(pts[2], this.XYZMult(this.XYZSub(pts[1], pts[3]), d12 / 2 / d13 * (d13 / d02)));
		}
		else
		{
			bz[1] = this.XYZAdd(pts[1], this.XYZMult(this.XYZSub(pts[2], pts[0]), d12 / 2 / d02 * (d02 / d13)));
			bz[2] = this.XYZAdd(pts[2], this.XYZMult(this.XYZSub(pts[1], pts[3]), d12 / 2 / d13));
		}
		
		//end point
		bz[3] = pts[2];
		
		return bz;
	},

	XYZAdd: function(a, b)
	{
		return {x: a.x + b.x, y: a.y + b.y};
	},

	XYZSub: function(a, b)
	{
		return {x: a.x - b.x, y: a.y - b.y};
	},

	XYZMult: function(a, b)
	{
		return {x: a.x * b, y: a.y * b};
	},

	XYZDist: function(a, b)
	{
		return Math.pow((Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)), 0.5);
	},
	
	_calculateCountSeries: function(chartSpace)
	{
		var series = chartSpace.chart.plotArea.chart.series;
		var counter = 0, numCache, seriaVal;
		for(var i = 0; i < series.length; i++)
		{
			seriaVal = series[i].val ? series[i].val : series[i].yVal;
			numCache = seriaVal && seriaVal.numRef ? seriaVal.numRef.numCache : seriaVal.numLit;
			if(numCache != null && numCache.pts && numCache.pts.length)
			{
				if(!this.calcProp.ptCount)
					this.calcProp.ptCount = numCache.ptCount;
				
				//TODO возможно нужно будет проверку добавить на isHidden
				counter++;
			}
			else if(3 === this.nDimensionCount)
			{
				counter++;
			}
		}
		
		return counter;
	},
	
	
	
	//******calculate graphic objects for 3d*******
	calculateRect3D : function(point1, point2, point3, point4, point5, point6, point7, point8, val, isNotDrawDownVerge)
	{
		var path  = new Path();
		
		var pathH = this.calcProp.pathH;
		var pathW = this.calcProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.calcProp.pxToMM;
		
		var paths = [];
		
		//front
		paths[0] = null;
		if(this._isVisibleVerge3D(point5, point1, point4, val))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
			path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
			path.lnTo(point8.x / pxToMm * pathW, point8.y / pxToMm * pathH);
			path.lnTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
			path.lnTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
			path.recalculate(gdLst);
			paths[0] = path;
		}
		
		//down
		paths[1] = null;
		if(this._isVisibleVerge3D(point4, point1, point2, val))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
			path.lnTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
			path.lnTo(point3.x / pxToMm * pathW, point3.y / pxToMm * pathH);
			path.lnTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
			path.lnTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
			path.recalculate(gdLst);
			paths[1] = path;
		}
		
		
		//left
		paths[2] = null;
		if(!isNotDrawDownVerge && this._isVisibleVerge3D(point2, point1, point5, val))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
			path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
			path.lnTo(point6.x / pxToMm * pathW, point6.y / pxToMm * pathH);
			path.lnTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
			path.lnTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
			path.recalculate(gdLst);
			paths[2] = path;
		}
		
		//right
		paths[3] = null;
		if(this._isVisibleVerge3D(point8, point4, point3, val))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			path.moveTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
			path.lnTo(point8.x / pxToMm * pathW, point8.y / pxToMm * pathH);
			path.lnTo(point7.x / pxToMm * pathW, point7.y / pxToMm * pathH);
			path.lnTo(point3.x / pxToMm * pathW, point3.y / pxToMm * pathH);
			path.lnTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
			path.recalculate(gdLst);
			paths[3] = path;
		}
		
		//up
		paths[4] = null;
		if(this._isVisibleVerge3D(point6, point5, point8, val))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			path.moveTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
			path.lnTo(point6.x / pxToMm * pathW, point6.y / pxToMm * pathH);
			path.lnTo(point7.x / pxToMm * pathW, point7.y / pxToMm * pathH);
			path.lnTo(point8.x / pxToMm * pathW, point8.y / pxToMm * pathH);
			path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
			path.recalculate(gdLst);
			paths[4] = path;
		}
		
		
		//unfront
		paths[5] = null;
		if(this._isVisibleVerge3D(point3, point2, point6, val))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			path.moveTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
			path.lnTo(point6.x / pxToMm * pathW, point6.y / pxToMm * pathH);
			path.lnTo(point7.x / pxToMm * pathW, point7.y / pxToMm * pathH);
			path.lnTo(point3.x / pxToMm * pathW, point3.y / pxToMm * pathH);
			path.lnTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
			path.recalculate(gdLst);
			paths[5] = path;
		}
			
		return paths;
	},
	
	_isVisibleVerge3D: function(k, n, m, val)
	{
		//roberts method - calculate normal
		var aX = n.x * m.y - m.x * n.y;
		var bY = - (k.x * m.y - m.x * k.y);
		var cZ = k.x * n.y - n.x * k.y;
		var visible = aX + bY + cZ;
		
		var result;
		if(this.calcProp.type == "Bar")
		{
			result = (val > 0 && visible < 0 || val < 0 && visible > 0) ? true : false;
			if(!(this.calcProp.subType == "stacked") && !(this.calcProp.subType == "stackedPer") && this.cChartSpace.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX)
				result = !result;
		}
		else if(this.calcProp.type == "Line")
		{
			result = visible < 0 ? true : false
		}
		else if(this.calcProp.type == "HBar")
		{
			result = (val < 0 && visible < 0 || val > 0 && visible > 0) ? true : false;
			
			if(!(this.calcProp.subType == "stacked") && !(this.calcProp.subType == "stackedPer") && this.cChartSpace.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX)
				result = !result;
		}
		
		return result;
	},
	
	calculatePolygon: function(array)
	{
		if(!array)
			return null;
		
		var path  = new Path();
		
		var pathH = this.calcProp.pathH;
		var pathW = this.calcProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		for(var i = 0; i < array.length; i++)
		{
			var point = array[i];
			if(i === 0)
			{
				path.moveTo(point.x * pathW, point.y * pathH);
			}
			else
			{
				path.lnTo(point.x * pathW, point.y * pathH);
			}
			
			if(i === array.length - 1)
			{
				path.lnTo(array[0].x * pathW, array[0].y * pathH);
			}
		}
		
		path.recalculate(gdLst);
		
		return path;
	},
	
	_isSwitchCurrent3DChart: function(chartSpace)
	{
		var res = false;
		
		var excelApi = window["Asc"] && window["Asc"]["editor"];
		var chart = chartSpace && chartSpace.chart ? chartSpace.chart.plotArea.chart: null;
		var typeChart = chart ? chart.getObjectType() : null;
		
		if(isTurnOn3DCharts && chartSpace && chartSpace.chart.view3D)
		{
			var isPerspective = !chartSpace.chart.view3D.rAngAx;
			
			var isBar = typeChart === AscDFH.historyitem_type_BarChart && chart && chart.barDir !== AscFormat.BAR_DIR_BAR;
			var isHBar = typeChart === AscDFH.historyitem_type_BarChart && chart && chart.barDir === AscFormat.BAR_DIR_BAR;
			var isLine = typeChart === AscDFH.historyitem_type_LineChart;
			var isPie = typeChart === AscDFH.historyitem_type_PieChart;
			var isArea = typeChart === AscDFH.historyitem_type_AreaChart;
			
			if(!isPerspective && (isBar || isLine || isHBar || isPie))
			{
				res = true;
			}
			else if(isPerspective && (isBar || isLine || isHBar))
			{
				res = true;
			}
		}
		
		return res;
	}
};



	/** @constructor */
function drawBarChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.paths = {};
	this.sortZIndexPaths = [];
	this.summBarVal = [];
}

drawBarChart.prototype =
{
    constructor: drawBarChart,
	
	reCalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this.paths = {};
		this.summBarVal = [];
		
		this.sortZIndexPaths = [];
		
		this._reCalculateBars();
	},
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			this._DrawBars3D();
		}
		else
			this._DrawBars();
		
	},
	
	_DrawBars: function()
	{
		this.cChartDrawer.cShapeDrawer.Graphics.SaveGrState();
		this.cChartDrawer.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - 1) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
		var brush, pen, seria, numCache;
		for (var i = 0; i < this.paths.series.length; i++) {
		
			if(!this.paths.series[i])
				continue;
			
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;
			
			for (var j = 0; j < this.paths.series[i].length; j++) {
				numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
				if(numCache.pts[j] && numCache.pts[j].pen)
					pen = numCache.pts[j].pen;
				if(numCache.pts[j] && numCache.pts[j].brush)
					brush = numCache.pts[j].brush;
					
				if(this.paths.series[i][j])
					this.cChartDrawer.drawPath(this.paths.series[i][j], pen, brush);
			}
		}
		this.cChartDrawer.cShapeDrawer.Graphics.RestoreGrState();
	},
	
	_reCalculateBars: function (/*isSkip*/)
    {
        //соответствует подписям оси категорий(OX)
		var xPoints     = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints     = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
		var widthGraph  = this.chartProp.widthCanvas - this.chartProp.chartGutter._left - this.chartProp.chartGutter._right;

		var defaultOverlap = (this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer" || this.chartProp.subType === "standard") ? 100 : 0;
		var overlap        = this.cChartSpace.chart.plotArea.chart.overlap ? this.cChartSpace.chart.plotArea.chart.overlap : defaultOverlap;
		var numCache       = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache : this.chartProp.series[0].val.numLit;
		var width          = widthGraph / this.chartProp.ptCount;
		if(this.cChartSpace.getValAxisCrossType())
			width = widthGraph / (numCache.ptCount - 1);
		
		var gapWidth = this.cChartSpace.chart.plotArea.chart.gapWidth ? this.cChartSpace.chart.plotArea.chart.gapWidth : 150;
		
		var individualBarWidth = width / (this.chartProp.seriesCount - (this.chartProp.seriesCount - 1) * (overlap / 100) + gapWidth / 100);
		var widthOverLap       = individualBarWidth * (overlap / 100);
		var hmargin            = (gapWidth / 100 * individualBarWidth) / 2;
		
		var height, startX, startY, diffYVal, val, paths, seriesHeight = [], tempValues = [], seria, startYColumnPosition, startXPosition, prevVal, idx, seriesCounter = 0;
	
		for (var i = 0; i < this.chartProp.series.length; i++) {
			numCache        = this.chartProp.series[i].val.numRef ? this.chartProp.series[i].val.numRef.numCache : this.chartProp.series[i].val.numLit;
			seria           = numCache ? numCache.pts : [];
			seriesHeight[i] = [];
			tempValues[i]   = [];
			
			if(numCache == null || this.chartProp.series[i].isHidden)
				continue;
			
			var isValMoreZero = false;
			var isValLessZero = 0;
			
			for (var j = 0; j < seria.length; j++) {
				
				//for 3d charts
				if(val > 0)
					isValMoreZero = true;
				else if(val < 0)
					isValLessZero++;
				
				//стартовая позиция колонки Y(+ высота с учётом поправок на накопительные диаграммы)
				val = parseFloat(seria[j].val);
				idx = seria[j].idx != null ? seria[j].idx : j;
				
				prevVal = 0;
				if(this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer")
				{	
					for(var k = 0; k < tempValues.length; k++)
					{
						if(tempValues[k][idx] && tempValues[k][idx] > 0)
							prevVal += tempValues[k][idx];
					}
				}
				
				
				tempValues[i][idx]   = val;
				
				startYColumnPosition = this._getStartYColumnPosition(seriesHeight, i, idx, val, yPoints, prevVal);
				startY = startYColumnPosition.startY;
				height = startYColumnPosition.height;

				seriesHeight[i][idx] = height;
				
				//стартовая позиция колонки X
				if(this.cChartSpace.chart.plotArea.catAx.scaling.orientation == ORIENTATION_MIN_MAX)
				{
					if(xPoints[1] && xPoints[1].pos)
						startXPosition = xPoints[idx].pos - Math.abs((xPoints[1].pos - xPoints[0].pos) / 2);
					else
						startXPosition = xPoints[idx].pos - Math.abs(xPoints[0].pos - this.cChartSpace.chart.plotArea.valAx.posX);
				}	
				else
				{
					if(xPoints[1] && xPoints[1].pos)
						startXPosition = xPoints[idx].pos + Math.abs((xPoints[1].pos - xPoints[0].pos) / 2);
					else
						startXPosition = xPoints[idx].pos + Math.abs(xPoints[0].pos - this.cChartSpace.chart.plotArea.valAx.posX);
				}
					
				
				if(this.cChartSpace.chart.plotArea.catAx.scaling.orientation == ORIENTATION_MIN_MAX)
				{
					if(seriesCounter == 0)
						startX = startXPosition * this.chartProp.pxToMM + hmargin + seriesCounter * (individualBarWidth);
					else
						startX = startXPosition * this.chartProp.pxToMM + hmargin + (seriesCounter * individualBarWidth - seriesCounter * widthOverLap);
				}
				else
				{
					if(i == 0)
						startX = startXPosition * this.chartProp.pxToMM - hmargin - seriesCounter * (individualBarWidth);
					else
						startX = startXPosition * this.chartProp.pxToMM - hmargin - (seriesCounter * individualBarWidth - seriesCounter * widthOverLap);
				}
				
				
				if(this.cChartSpace.chart.plotArea.catAx.scaling.orientation != ORIENTATION_MIN_MAX)
					startX = startX - individualBarWidth;
				
				if(this.cChartSpace.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX && (this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked"))
					startY = startY + height;
				
				//for 3d charts
				if(this.cChartDrawer.nDimensionCount === 3)
				{
					paths = this._calculateRect3D(startX, startY, individualBarWidth, height, val, isValMoreZero, isValLessZero, i);
					
					//расскомментируем, чтобы включить старую схему отрисовки(+ переименовать функции _DrawBars3D -> _DrawBars3D2)
					//this.sortZIndexPaths.push({seria: i, point: idx, paths: paths.paths, x: paths.x, y: paths.y, zIndex: paths.zIndex});
					
					for(var k = 0; k < paths.paths.length; k++)
					{
						this.sortZIndexPaths.push({seria: i, point: idx, verge: k, paths: paths.paths[k], x: paths.sortPaths[k].x, y: paths.sortPaths[k].y, zIndex: paths.sortPaths[k].z});
					}
					
					paths = paths.paths;
				}
				else
				{
					paths = this._calculateRect(startX, startY, individualBarWidth, height);
				}
					
				if(!this.paths.series)
					this.paths.series = [];
				if(!this.paths.series[i])
					this.paths.series[i] = [];
				this.paths.series[i][idx] = paths;

			}
			
			if(seria.length)
				seriesCounter++;
		}
		
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			this.sortZIndexPaths.sort (function sortArr(a, b)
			{
				if(b.zIndex == a.zIndex)
					return  b.y - a.y;
				else
					return  b.zIndex - a.zIndex;
			});
		}
    },
	
	_getStartYColumnPosition: function (seriesHeight, i, j, val, yPoints)
	{
		var startY, height, curVal, prevVal, endBlockPosition, startBlockPosition;
		var nullPositionOX = this.cChartSpace.chart.plotArea.valAx && this.cChartSpace.chart.plotArea.valAx.scaling.logBase ?  this.chartProp.nullPositionOXLog : this.cChartSpace.chart.plotArea.catAx.posY * this.chartProp.pxToMM;
		
		
		if(this.chartProp.subType == "stacked")
		{
			curVal = this._getStackedValue(this.chartProp.series, i, j, val);
			prevVal = this._getStackedValue(this.chartProp.series, i - 1, j, val);
			
			endBlockPosition = this.cChartDrawer.getYPosition((curVal), yPoints) * this.chartProp.pxToMM;
			startBlockPosition = prevVal ? this.cChartDrawer.getYPosition((prevVal), yPoints) * this.chartProp.pxToMM : nullPositionOX;
			
			startY = startBlockPosition;
			height = startBlockPosition - endBlockPosition;
			
			if(this.cChartSpace.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX)
				height = - height;	
		}
		else if(this.chartProp.subType == "stackedPer")
		{
			this._calculateSummStacked(j);
			
			curVal = this._getStackedValue(this.chartProp.series, i, j, val);
			prevVal = this._getStackedValue(this.chartProp.series, i - 1, j, val);
			
			endBlockPosition = this.cChartDrawer.getYPosition((curVal / this.summBarVal[j]), yPoints) * this.chartProp.pxToMM;
			startBlockPosition = this.summBarVal[j] ? this.cChartDrawer.getYPosition((prevVal / this.summBarVal[j]), yPoints) * this.chartProp.pxToMM : nullPositionOX;
			
			startY = startBlockPosition;
			height = startBlockPosition - endBlockPosition;
			
			if(this.cChartSpace.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX)
				height = - height;
		}
		else
		{
			startY = nullPositionOX;
			if(this.cChartSpace.chart.plotArea.valAx && this.cChartSpace.chart.plotArea.valAx.scaling.logBase)//исключение для логарифмической шкалы
			{
				height = nullPositionOX - this.cChartDrawer.getYPosition(val, yPoints, null,this.cChartSpace.chart.plotArea.valAx.scaling.logBase) * this.chartProp.pxToMM;
			}
			else
			{
				height = nullPositionOX - this.cChartDrawer.getYPosition(val, yPoints) * this.chartProp.pxToMM;
			}
		}	
		
		return {startY : startY, height: height};
	},
	
	_calculateSummStacked : function(j)
	{
		if(!this.summBarVal[j])
		{
			var curVal;
			var temp = 0;
			var idxPoint;
			for(var k = 0; k < this.chartProp.series.length; k++)
			{
				idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], j);
				curVal = idxPoint ? parseFloat(idxPoint.val) : 0;
				
				if(curVal)
					temp += Math.abs(curVal);
			}
			
			this.summBarVal[j] = temp;
		}
	},
	
	_getStackedValue: function(series, i, j, val)
	{
		var result = 0, curVal, idxPoint;
		for(var k = 0; k <= i; k++)
		{
			idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], j);
			curVal = idxPoint ? idxPoint.val : 0;
			
			if(idxPoint && val > 0 && curVal > 0)
				result += parseFloat(curVal);
			else if(idxPoint && val < 0 && curVal < 0)
				result += parseFloat(curVal);
		}
		
		return result;
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var point = this.cChartDrawer.getIdxPoint(this.chartProp.series[ser], val);
		if(!this.paths.series[ser][val])
			return;
		
		var path = this.paths.series[ser][val].ArrPathCommand;
		if(this.cChartDrawer.nDimensionCount === 3)
			path = this.paths.series[ser][val][0].ArrPathCommand;
		
		if(!path)
			return;
		
		var x = path[0].X;
		var y = path[0].Y;
		
		var h = path[0].Y - path[1].Y;
		var w = path[2].X - path[1].X;
		
		var pxToMm = this.chartProp.pxToMM;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX, centerY;
				
		switch ( point.compiledDlb.dLblPos )
		{
			case c_oAscChartDataLabelsPos.bestFit:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.ctr:
			{
				centerX = x + w/2 - width/2;
				centerY = y - h/2 - height/2;
				break;
			}
			case c_oAscChartDataLabelsPos.inBase:
			{
				centerX = x + w/2 - width/2;
				centerY = y;
				if(point.val > 0)
					centerY = y - height;
				break;
			}
			case c_oAscChartDataLabelsPos.inEnd:
			{
				centerX = x + w/2 - width/2;
				centerY = y - h;
				if(point.val < 0)
					centerY = centerY - height;	
				break;
			}
			case c_oAscChartDataLabelsPos.outEnd:
			{
				centerX = x + w/2 - width/2;
				centerY = y - h - height;
				if(point.val < 0)
					centerY = centerY + height;	
				break;
			}
		}
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
		
		return {x: centerX, y: centerY};
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
	
	
	//TODO delete after test
	_DrawBars3D2: function()
	{
		var t = this;
		var processor3D = this.cChartDrawer.processor3D;
		
		var verges = 
			{
			front: 0,
			down: 1,
			left: 2,
			right: 3,
			up: 4,
			unfront: 5
		};

		var drawVerges = function(i, j, paths, onlyLessNull, start, stop)
				{
			var brush, pen, options;
			options = t._getOptionsForDrawing(i, j, onlyLessNull);
					if(options !== null)
					{
						pen = options.pen;
						brush = options.brush;

				for(var k = start; k <= stop; k++)
					{
					t._drawBar3D(paths[k], pen, brush, k);
					}
				}
		};
		
		var draw = function(onlyLessNull, start, stop)
		{	
			for(var i = 0; i < t.sortZIndexPaths.length; i++)
			{
				drawVerges(t.sortZIndexPaths[i].seria, t.sortZIndexPaths[i].point, t.sortZIndexPaths[i].paths, onlyLessNull, start, stop);
			}
		};
		
		if(this.chartProp.subType === "standard")
		{
			draw(true, verges.front, verges.unfront);
			draw(false, verges.front, verges.unfront);
			}
			else
			{
			draw(true, verges.down, verges.up);
			draw(false, verges.down, verges.up);

			draw(true, verges.unfront, verges.unfront);
			draw(false, verges.unfront, verges.unfront);
			
			draw(true, verges.front, verges.front);
			draw(false, verges.front, verges.front);
					}
	},
	
	_DrawBars3D: function()
	{
		var t = this;
		var processor3D = this.cChartDrawer.processor3D;
		
		var drawVerges = function(i, j, paths, onlyLessNull, k)
		{
			var brush, pen, options;
			options = t._getOptionsForDrawing(i, j, onlyLessNull);
			if(paths !== null && options !== null)
			{
				pen = options.pen;
				brush = options.brush;
				
				t._drawBar3D(paths, pen, brush, k);
			}
		};
		
		for(var i = 0; i < this.sortZIndexPaths.length; i++)
		{
			drawVerges(this.sortZIndexPaths[i].seria, this.sortZIndexPaths[i].point, this.sortZIndexPaths[i].paths, true, this.sortZIndexPaths[i].verge);
		}
		
		for(var i = 0; i < this.sortZIndexPaths.length; i++)
		{
			drawVerges(this.sortZIndexPaths[i].seria, this.sortZIndexPaths[i].point, this.sortZIndexPaths[i].paths, false, this.sortZIndexPaths[i].verge);
		}
	},
	
	_getOptionsForDrawing: function(ser, point, onlyLessNull)
	{
		var seria = this.chartProp.series[ser];
		var pt = seria.val.numRef.numCache.getPtByIndex(point);

		if(!seria || !this.paths.series[ser] || !this.paths.series[ser][point] || !pt)
			return null;
		
		var brush = seria.brush;
		var pen = seria.pen;
		
		if((pt.val > 0 && onlyLessNull === true) || (pt.val < 0 && onlyLessNull === false))
			return null;
		
		if(pt.pen)
			pen = pt.pen;
		if(pt.brush)
			brush = pt.brush;
			
		return {pen: pen, brush: brush}
	},
	
	_drawBar3D: function(path, pen, brush, k)
	{
		//затемнение боковых сторон
		//в excel всегда темные боковые стороны, лицевая и задняя стороны светлые
		//pen = this.cChartSpace.chart.plotArea.valAx.compiledMajorGridLines;
		//pen.setFill(brush);
		pen = AscFormat.CreatePenFromParams(brush, undefined, undefined, undefined, undefined, 0.1);
		if(k != 5 && k != 0)
		{
			var  props = this.cChartSpace.getParentObjects();
			var duplicateBrush = brush.createDuplicate();
			var cColorMod = new AscFormat.CColorMod;
			if(k == 1 || k == 4)
				cColorMod.val = 45000;
			else
				cColorMod.val = 35000;
			cColorMod.name = "shade";
			duplicateBrush.addColorMod(cColorMod);
			duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new AscFormat.CUniColor().RGBA);
			
			pen.setFill(duplicateBrush);
			this.cChartDrawer.drawPath(path, pen, duplicateBrush);
		}
		else
			this.cChartDrawer.drawPath(path, pen, brush);
	},
	
	_calculateRect3D: function(startX, startY, individualBarWidth, height, val, isValMoreZero, isValLessZero, serNum)
	{
		//параметр r и глубина по OZ
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		
		//сдвиг по OZ в глубину
		var gapDepth = this.cChartSpace.chart.plotArea.chart.gapDepth != null ? this.cChartSpace.chart.plotArea.chart.gapDepth : globalGapDepth;
		if(this.chartProp.subType === "standard")
			perspectiveDepth = (perspectiveDepth / (gapDepth / 100 + 1)) / this.chartProp.seriesCount;
		else	
			perspectiveDepth = perspectiveDepth / (gapDepth / 100 + 1);
		var DiffGapDepth = perspectiveDepth * (gapDepth / 2) / 100;
		
		if(this.chartProp.subType === "standard")
			gapDepth = (perspectiveDepth + DiffGapDepth + DiffGapDepth) * serNum + DiffGapDepth;
		else
			gapDepth = DiffGapDepth;
		
		//рассчитываем 8 точек для каждого столбца
		var x1 = startX, y1 = startY, z1 = 0 + gapDepth;
		var x2 = startX, y2 = startY, z2 = perspectiveDepth + gapDepth;
		var x3 = startX + individualBarWidth, y3 = startY, z3 = perspectiveDepth + gapDepth;
		var x4 = startX + individualBarWidth, y4 = startY, z4 = 0 + gapDepth;
		var x5 = startX, y5 = startY - height, z5 = 0 + gapDepth;
		var x6 = startX, y6 = startY - height, z6 = perspectiveDepth + gapDepth;
		var x7 = startX + individualBarWidth, y7 = startY - height, z7 = perspectiveDepth + gapDepth;
		var x8 = startX + individualBarWidth, y8 = startY - height, z8 = 0 + gapDepth;
		
		
		//поворот относительно осей
		var point1 = this.cChartDrawer._convertAndTurnPoint(x1, y1, z1);
		var point2 = this.cChartDrawer._convertAndTurnPoint(x2, y2, z2);
		var point3 = this.cChartDrawer._convertAndTurnPoint(x3, y3, z3);
		var point4 = this.cChartDrawer._convertAndTurnPoint(x4, y4, z4);
		var point5 = this.cChartDrawer._convertAndTurnPoint(x5, y5, z5);
		var point6 = this.cChartDrawer._convertAndTurnPoint(x6, y6, z6);
		var point7 = this.cChartDrawer._convertAndTurnPoint(x7, y7, z7);
		var point8 = this.cChartDrawer._convertAndTurnPoint(x8, y8, z8);
		
		
		//down verge of minus values don't must draw(in stacked and stackedPer)
		var isNotDrawDownVerge;
		/*if((this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer") && val < 0 && (isValMoreZero || (!isValMoreZero && isValLessZero !== 1)))
			isNotDrawDownVerge = true;*/
		
		var paths = this.cChartDrawer.calculateRect3D(point1, point2, point3, point4, point5, point6, point7, point8, val, isNotDrawDownVerge);
		
		height = this.chartProp.heightCanvas - this.chartProp.chartGutter._top - this.chartProp.chartGutter._bottom;
		var controlPoint1 = this.cChartDrawer._convertAndTurnPoint(x1 + individualBarWidth / 2, y1 - height / 2, z1);
		var controlPoint2 = this.cChartDrawer._convertAndTurnPoint(x1 + individualBarWidth / 2, y1, z1 + perspectiveDepth / 2);
		var controlPoint3 = this.cChartDrawer._convertAndTurnPoint(x1, y1 - height / 2, z1 + perspectiveDepth / 2);
		var controlPoint4 = this.cChartDrawer._convertAndTurnPoint(x4, y4 - height / 2, z4 + perspectiveDepth / 2);
		var controlPoint5 = this.cChartDrawer._convertAndTurnPoint(x5 + individualBarWidth / 2 , y5, z5 + perspectiveDepth / 2);
		var controlPoint6 = this.cChartDrawer._convertAndTurnPoint(x2 + individualBarWidth / 2 , y2 - height / 2, z2);
		
		
		var sortPaths = [controlPoint1, controlPoint2, controlPoint3, controlPoint4, controlPoint5, controlPoint6];
			
		
		return {paths: paths, x: point1.x, y: point1.y, zIndex: point1.z, sortPaths: sortPaths};
	}
};



	/** @constructor */
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
    constructor: drawLineChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		if(this.cChartDrawer.nDimensionCount === 3)
			this._drawLines3D();
		else
			this._drawLines();
	},
	
	reCalculate : function(chartsDrawer)
    {
		this.paths = {};
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this._calculateLines();
	},
	
	_calculateLines: function ()
	{
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
		var points;
		
		var y, x, val, seria, dataSeries, compiledMarkerSize, compiledMarkerSymbol, idx, numCache, idxPoint;
		for (var i = 0; i < this.chartProp.series.length; i++) {
		
			seria = this.chartProp.series[i];
			
			numCache   = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
			
			if(!numCache)
				continue;
			
			dataSeries = numCache.pts;
			
			for(var n = 0; n < numCache.ptCount; n++)
			{
				idx = dataSeries[n] && dataSeries[n].idx != null ? dataSeries[n].idx : n;
				
				//рассчитываем значения				
				val = this._getYVal(n, i);
				
				x  = xPoints[n].pos;
				y  = this.cChartDrawer.getYPosition(val, yPoints);
				
				if(!this.paths.points)
					this.paths.points = [];
				if(!this.paths.points[i])
					this.paths.points[i] = [];
					
				if(!points)
					points = [];
				if(!points[i])
					points[i] = [];
				
				idxPoint = this.cChartDrawer.getIdxPoint(seria, n);
				compiledMarkerSize = idxPoint && idxPoint.compiledMarker && idxPoint.compiledMarker.size ? idxPoint.compiledMarker.size : null;
				compiledMarkerSymbol = idxPoint && idxPoint.compiledMarker && AscFormat.isRealNumber(idxPoint.compiledMarker.symbol) ? idxPoint.compiledMarker.symbol : null;
				
				if(val != null)
				{
					this.paths.points[i][n] = this.cChartDrawer.calculatePoint(x, y, compiledMarkerSize, compiledMarkerSymbol);
					points[i][n] = {x: x, y: y};
				}	
				else
				{
					this.paths.points[i][n] = null;
					points[i][n] = null;
				}
			}
		}
		
		this._calculateAllLines(points);
	},
	
	_calculateAllLines: function(points)
	{
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			//сдвиг по OZ в глубину
			var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
			var seriaDiff = perspectiveDepth / this.chartProp.seriesCount;
			var gapDepth = this.cChartSpace.chart.plotArea.chart.gapDepth != null ? this.cChartSpace.chart.plotArea.chart.gapDepth : globalGapDepth;
			var depthSeria = seriaDiff / ((gapDepth / 100) + 1);
			var DiffGapDepth = (depthSeria * (gapDepth / 100)) / 2;
			depthSeria = (perspectiveDepth / this.chartProp.seriesCount - 2 * DiffGapDepth);
		}
		
		var x, y, x1, y1, x2, y2, x3, y3, isSplineLine;
		
		for(var i = 0; i < points.length; i++)
		{	
			isSplineLine = this.chartProp.series[i].smooth !== false;
			
			if(!points[i])
				continue;
			
			for(var n = 0; n < points[i].length; n++)
			{
				if(!this.paths.series)
					this.paths.series = [];
				if(!this.paths.series[i])
					this.paths.series[i] = [];
					
				if(points[i][n] != null && points[i][n + 1] != null)
				{	
					if(this.cChartDrawer.nDimensionCount === 3)
					{
						x = points[i][n].x * this.chartProp.pxToMM;
						y = points[i][n].y * this.chartProp.pxToMM;
						
						x1 = points[i][n + 1].x * this.chartProp.pxToMM;
						y1 = points[i][n + 1].y * this.chartProp.pxToMM;
						
						if(!this.paths.series)
							this.paths.series = [];
						if(!this.paths.series[i])
							this.paths.series[i] = [];
						
						var point1, point2, point3, point4, point5, point6, point7, point8, widthLine = 0.5;
						point1 = this.cChartDrawer._convertAndTurnPoint(x, y - widthLine, DiffGapDepth + seriaDiff * i);
						point2 = this.cChartDrawer._convertAndTurnPoint(x1, y1 - widthLine, DiffGapDepth + seriaDiff * i);
						point3 = this.cChartDrawer._convertAndTurnPoint(x1, y1 - widthLine, DiffGapDepth + depthSeria + seriaDiff * i);
						point4 = this.cChartDrawer._convertAndTurnPoint(x, y - widthLine, DiffGapDepth + depthSeria + seriaDiff * i);
						
						
						point5 = this.cChartDrawer._convertAndTurnPoint(x, y + widthLine, DiffGapDepth + seriaDiff * i);
						point6 = this.cChartDrawer._convertAndTurnPoint(x1, y1 + widthLine, DiffGapDepth + seriaDiff * i);
						point7 = this.cChartDrawer._convertAndTurnPoint(x1, y1 + widthLine, DiffGapDepth + depthSeria + seriaDiff * i);
						point8 = this.cChartDrawer._convertAndTurnPoint(x, y + widthLine, DiffGapDepth + depthSeria + seriaDiff * i);

						this.paths.series[i][n] = this.cChartDrawer.calculateRect3D(point1, point2, point3, point4, point5, point6, point7, point8);
					}
					else if(isSplineLine)
					{
						x = points[i][n - 1] ? n - 1 : 0;
						y = this._getYVal(x, i);
						
						x1 = n;
						y1 = this._getYVal(x1, i);
						
						x2 = points[i][n + 1]  ? n + 1 : n;
						y2 = this._getYVal(x2, i);
						
						x3 = points[i][n + 2] ? n + 2 : points[i][n + 1] ? n + 1 : n;
						y3 = this._getYVal(x3, i);
						
						this.paths.series[i][n] = this._calculateSplineLine(x, y, x1, y1, x2, y2, x3, y3, xPoints, yPoints);
					}
					else
						this.paths.series[i][n] = this._calculateLine(points[i][n].x, points[i][n].y, points[i][n + 1].x, points[i][n + 1].y);
				}
			}
		}
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var point = this.cChartDrawer.getIdxPoint(this.chartProp.series[ser], val);
		var path;
		
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			if(val === this.paths.series[ser].length && this.paths.series[ser][val - 1] && this.paths.series[ser][val - 1][5])
			{
				path = this.paths.series[ser][val - 1][5].ArrPathCommand[0];
			}
			else if(this.paths.series[ser][val] && this.paths.series[ser][val][3])//reverse
			{
				path = this.paths.series[ser][val][3].ArrPathCommand[0];
			}
			else if(this.paths.series[ser][val] && this.paths.series[ser][val][2])
			{
				path = this.paths.series[ser][val][2].ArrPathCommand[0];
			}
		}
		else
		{
			path = this.paths.points[ser][val].path.ArrPathCommand[0];
		}
		
		if(!path)
			return;
				
		var x = path.X;
		var y = path.Y;
		
		var pxToMm = this.chartProp.pxToMM;
		var constMargin = 5 / pxToMm;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX = x - width/2;
		var centerY = y - height/2;
		
		switch ( point.compiledDlb.dLblPos )
		{
			case c_oAscChartDataLabelsPos.b:
			{
				centerY = centerY + height/2 + constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.bestFit:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.ctr:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.l:
			{
				centerX = centerX - width/2 - constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.r:
			{
				centerX = centerX + width/2 + constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.t:
			{
				centerY = centerY - height/2 - constMargin;
				break;
			}
		}
		
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
			
		return {x: centerX, y: centerY};
	},
	
	_drawLines: function (/*isSkip*/)
    {
		var brush, pen, dataSeries, seria, markerBrush, markerPen, numCache;
		
		//TODO для того, чтобы верхняя линия рисовалась. пересмотреть!
		var diffPen = 3;
		
		this.cChartDrawer.cShapeDrawer.Graphics.SaveGrState();
		this.cChartDrawer.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - diffPen) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, (this.chartProp.trueHeight + diffPen) / this.chartProp.pxToMM);
		for (var i = 0; i < this.paths.series.length; i++) {
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;
			
			numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
			dataSeries = this.paths.series[i];
			
			if(!dataSeries)
				continue;
			
			for(var n = 0; n < dataSeries.length; n++)
			{
				if(numCache.pts[n + 1] && numCache.pts[n + 1].pen)
					pen = numCache.pts[n + 1].pen;
				if(numCache.pts[n + 1] && numCache.pts[n + 1].brush)
					brush = numCache.pts[n + 1].brush;
					
				this.cChartDrawer.drawPath(this.paths.series[i][n], pen, brush);
			}
			
			//draw point
			for(var k = 0; k < this.paths.points[i].length; k++)
			{

				var numPoint = numCache.getPtByIndex(k);
				if(numPoint)
				{

					markerBrush = numPoint.compiledMarker ? numPoint.compiledMarker.brush : null;
					markerPen = numPoint.compiledMarker ? numPoint.compiledMarker.pen : null;
				}
				
				//frame of point
				if(this.paths.points[i][0] && this.paths.points[i][0].framePaths)
					this.cChartDrawer.drawPath(this.paths.points[i][k].framePaths, markerPen, markerBrush, false);
				//point	
				if(this.paths.points[i][k])
					this.cChartDrawer.drawPath(this.paths.points[i][k].path, markerPen, markerBrush, true);
			}
        }
		this.cChartDrawer.cShapeDrawer.Graphics.RestoreGrState();
    },
	
	_getYVal: function(n, i)
	{
		var tempVal;
		var val = 0;
		var idxPoint;
		
		if(this.chartProp.subType == "stacked")
		{
			for(var k = 0; k <= i; k++)
			{
				idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], n);
				tempVal = idxPoint ? parseFloat(idxPoint.val) : 0;
				if(tempVal)
					val += tempVal;
			}
		}
		else if(this.chartProp.subType == "stackedPer")
		{
			var summVal = 0;
			for(var k = 0; k < this.chartProp.series.length; k++)
			{
				idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], n);
				tempVal = idxPoint ? parseFloat(idxPoint.val) : 0;
				if(tempVal)
				{
					if(k <= i)
						val += tempVal;
					summVal += Math.abs(tempVal);
				}
			}
			val = val / summVal;
		}
		else
		{
			idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[i], n);
			val = idxPoint ? parseFloat(idxPoint.val) : null;
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
		
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_calculateSplineLine : function(x, y, x1, y1, x2, y2, x3, y3, xPoints, yPoints)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		

		var splineCoords = this.cChartDrawer.calculate_Bezier(x, y, x1, y1, x2, y2, x3, y3);
		
		x = this.cChartDrawer.getYPosition(splineCoords[0].x, xPoints, true);
		y = this.cChartDrawer.getYPosition(splineCoords[0].y, yPoints);
		
		x1 = this.cChartDrawer.getYPosition(splineCoords[1].x, xPoints, true);
		y1 = this.cChartDrawer.getYPosition(splineCoords[1].y, yPoints);
		
		x2 = this.cChartDrawer.getYPosition(splineCoords[2].x, xPoints, true);
		y2 = this.cChartDrawer.getYPosition(splineCoords[2].y, yPoints);
		
		x3 = this.cChartDrawer.getYPosition(splineCoords[3].x, xPoints, true);
		y3 = this.cChartDrawer.getYPosition(splineCoords[3].y, yPoints);
		
		path.moveTo(x * pathW, y * pathH);
		path.cubicBezTo(x1 * pathW, y1 * pathH, x2 * pathW, y2 * pathH, x3 * pathW, y3 * pathH);
		
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawLines3D: function()
	{
		var t = this;
		
		var drawVerges = function(j, i, onlyLessNull)
		{
		var brush, pen, seria;
			
			seria = t.chartProp.series[j];
				brush = seria.brush;
				pen = seria.pen;

			if(!(!t.paths.series[j] || !t.paths.series[j][i] || !seria.val.numRef.numCache.pts[i]))
			{
				if(seria.val.numRef.numCache.pts[i].pen)
					pen = seria.val.numRef.numCache.pts[i].pen;
				if(seria.val.numRef.numCache.pts[i].brush)
					brush = seria.val.numRef.numCache.pts[i].brush;
				
				for(var k = 0; k < t.paths.series[j][i].length; k++)
				{
					t._drawLine3D(t.paths.series[j][i][k], pen, brush, k);
				}
			}
		};

		
		//рисуем по сериям
		var onSeries = function(onlyLessNull)
				{
			var drawNeedVerge = function()
			{
				for (var j = 0; j < t.paths.series.length; j++)
				{	
					for (var i = 0; i < t.chartProp.ptCount; i++) 
					{	
						drawVerges(j, i, onlyLessNull);
				}
			}
			};
			
			drawNeedVerge();
		};
		
		
		var reverseSeriesOnSeries = function(onlyLessNull)
		{
			var drawNeedVerge = function()
			{
				for (var j = t.paths.series.length - 1; j >= 0; j--)
				{
					if(!t.paths.series)
						return;
					
					for (var i = 0; i < t.chartProp.ptCount; i++) 
					{
						drawVerges(j, i, onlyLessNull);
		}
				}
			};
			
			drawNeedVerge();
		};
		
		
		if(!this.cChartDrawer.processor3D.view3D.rAngAx)
		{
			var angle = Math.abs(this.cChartDrawer.processor3D.angleOy);
			if(angle > Math.PI / 2 && angle < 3 * Math.PI / 2)
				onSeries();
			else
				reverseSeriesOnSeries();
		}
		else
		{
			reverseSeriesOnSeries();
		}
	},
	
	_drawLine3D: function(path, pen, brush, k)
	{
		//затемнение боковых сторон
		//в excel всегда темные боковые стороны, лицевая и задняя стороны светлые
		
		//todo возможно стоит проверить fill.type на FILL_TYPE_NOFILL и рисовать отдельно границы, если они заданы!
		//brush = pen.Fill;
		if(brush.fill.color === undefined && brush.fill.colors === undefined)
			return;
		
		if(k !== 2)
		{
			var props = this.cChartSpace.getParentObjects();
			var duplicateBrush = brush.createDuplicate();
			var cColorMod = new AscFormat.CColorMod;
			if(k == 1 || k == 4)
				cColorMod.val = 45000;
			else
				cColorMod.val = 35000;
			cColorMod.name = "shade";
			
			this._addColorMods(cColorMod, duplicateBrush)
			
			duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new AscFormat.CUniColor().RGBA);
			pen = AscFormat.CreatePenFromParams(duplicateBrush, undefined, undefined, undefined, undefined, 0.1);
			//pen.setFill(duplicateBrush);
			this.cChartDrawer.drawPath(path, pen, duplicateBrush);
		}
		else
		{
			pen = AscFormat.CreatePenFromParams(brush, undefined, undefined, undefined, undefined, 0.1);
			this.cChartDrawer.drawPath(path, pen, brush);
		}
	},
	
	_addColorMods: function(cColorMod, duplicateBrush)
	{
		if(duplicateBrush.fill.color)
		{
			duplicateBrush.fill.color.Mods.addMod(cColorMod);
		}
		else
		{
			for(var i = 0; i < duplicateBrush.fill.colors.length; i++)
			{
				if(duplicateBrush.fill.colors[i].color.Mods === null)
				{
					duplicateBrush.fill.colors[i].color.Mods = new AscFormat.CColorModifiers();
				}	
				
				duplicateBrush.fill.colors[i].color.Mods.addMod(cColorMod);
			}
		}
	}
};



	/** @constructor */
function drawAreaChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.points = null;
	this.paths = {};
	this.usuallyCalculateSeries = [];
}

drawAreaChart.prototype =
{
    constructor: drawAreaChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		if(this.cChartDrawer.nDimensionCount === 3)
			this._DrawBars3D();
		else
			this._drawLines();
	},
	
	reCalculate : function(chartsDrawer)
    {
		this.paths = {};
		this.points = null;
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this._calculateLines();
	},
	
	_calculateLines: function ()
	{
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
		var y, x, val, seria, dataSeries, numCache;
		var pxToMm = this.chartProp.pxToMM;
		var nullPositionOX = this.chartProp.nullPositionOX / pxToMm;
		
		for (var i = 0; i < this.chartProp.series.length; i++) {
		
			seria = this.chartProp.series[i];
			
			numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
			
			if(!numCache)
				continue;
			
			dataSeries = numCache.pts;

			for(var n = 0; n < numCache.ptCount; n++)
			{
				//рассчитываем значения				
				val = this._getYVal(n, i);
				
				x  = xPoints[n].pos;
				y  = this.cChartDrawer.getYPosition(val, yPoints);
					
				if(!this.points)
					this.points = [];
				if(!this.points[i])
					this.points[i] = [];
				
				if(val != null)
				{
					this.points[i][n] = {x: x, y: y, val: val};
				}	
				else
				{
					this.points[i][n] = {x: x, y: nullPositionOX, val: val};
				}
			}
		}
		
		this._calculateAllLines();
	},
	
	_calculateAllLines: function()
	{
		var startPoint, endPoint;
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
		var points = this.points;
		var prevPoints;
		
		for(var i = 0; i < points.length; i++)
		{	
			if(!this.paths.series)
				this.paths.series = [];
			
			prevPoints = null;
			if(this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked")
				prevPoints = this._getPrevSeriesPoints(points, i);
				
			if(points[i])
			{
				if(this.cChartDrawer.nDimensionCount === 3)
				{
					if(this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked")
						this.paths.series[i] = this._calculateLine3DStacked(points[i], prevPoints, i, points);
					else
						this.paths.series[i] = this._calculateLine3D(points[i], prevPoints, i, points);
				}
				else
					this.paths.series[i] = this._calculateLine(points[i], prevPoints);
			}
		}
	},
	
	_getPrevSeriesPoints: function(points, i)
	{
		var prevPoints = null;
		
		for(var p = i - 1; p >= 0; p--)
		{
			if(points[p])
			{
				prevPoints = points[p];
				break;
			}
		}
		
		return prevPoints;
	},
	
	_calculateLine: function(points, prevPoints)
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var point;
		var pxToMm = this.chartProp.pxToMM;
		
		//точки данной серии
		for(var i = 0; i < points.length; i++)
		{
			point = points[i];
			if(i == 0)
				path.moveTo(point.x * pathW, point.y * pathH);
			else
			{
				path.lnTo(point.x * pathW, point.y * pathH);
			}
		}
		
		//точки предыдущей серии
		var nullPositionOX = this.chartProp.nullPositionOX;
		if(prevPoints != null)
		{
			for(var i = prevPoints.length - 1; i >= 0; i--)
			{
				point = prevPoints[i];
				path.lnTo(point.x * pathW, point.y * pathH);
				
				if(i == 0)
					path.lnTo(points[0].x * pathW, points[0].y * pathH);
			}
		}
		else
		{
			path.lnTo(points[points.length - 1].x * pathW, nullPositionOX / pxToMm * pathH);
			path.lnTo(points[0].x * pathW, nullPositionOX / pxToMm * pathH);
			path.lnTo(points[0].x * pathW, points[0].y * pathH);
		}
		
		path.recalculate(gdLst);
		return path;
	},
	
	_getYPosition: function(val, yPoints)
	{
		//позиция в заисимости от положения точек на оси OY
		var result;
		var resPos;
		var resVal;
		var diffVal;
		if(val < yPoints[0].val)
		{
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
		}
		else if(val > yPoints[yPoints.length - 1].val)
		{	
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val - val);
			result = yPoints[0].pos - (diffVal / resVal) * resPos;
		}
		else
		{
			for(var s = 0; s < yPoints.length; s++)
			{
				if(val >= yPoints[s].val && val <= yPoints[s + 1].val)
				{
					resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
					resVal = yPoints[s + 1].val - yPoints[s].val;
					result =  - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
					break;
				}
			}
		}
		
		return result;
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var numCache = this.chartProp.series[ser].val.numRef ? this.chartProp.series[ser].val.numRef.numCache : this.chartProp.series[ser].val.numLit;
		var point = this.cChartDrawer.getIdxPoint(this.chartProp.series[ser], val);
		var path;
		
		path = this.points[ser][val];
		
		if(!path)
			return;
				
		var x = path.x;
		var y = path.y;
		
		var pxToMm = this.chartProp.pxToMM;
		var constMargin = 5 / pxToMm;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX = x - width/2;
		var centerY = y - height/2;
		
		switch ( point.compiledDlb.dLblPos )
		{
			case c_oAscChartDataLabelsPos.b:
			{
				centerY = centerY + height/2 + constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.bestFit:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.ctr:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.l:
			{
				centerX = centerX - width/2 - constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.r:
			{
				centerX = centerX + width/2 + constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.t:
			{
				centerY = centerY - height/2 - constMargin;
				break;
			}
		}
		
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
			
		return {x: centerX, y: centerY};
	},
	
	_drawLines: function (/*isSkip*/)
    {
		//ширина линии
		var brush;
		var FillUniColor;
		var pen;
		var seria, dataSeries;
		
		this.cChartDrawer.cShapeDrawer.Graphics.SaveGrState();
		this.cChartDrawer.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - 1) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
		
		for (var i = 0; i < this.chartProp.series.length; i++) {
			
			//в случае накопительных дигарамм, рисуем в обратном порядке
			/*if(this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked")
				seria = this.chartProp.series[this.chartProp.series.length - 1 - i];
			else*/
			seria = this.chartProp.series[i];
			
			dataSeries = seria.val.numRef && seria.val.numRef.numCache ? seria.val.numRef.numCache.pts : seria.val.numLit ? seria.val.numLit.pts : null;
			
			if(!dataSeries)
				continue;
			
			if(dataSeries[0] && dataSeries[0].pen)
				pen = dataSeries[0].pen;
			if(dataSeries[0] && dataSeries[0].brush)
				brush = dataSeries[0].brush;
			
			if(this.cChartDrawer.nDimensionCount === 3)
			{
				for(var j = 0; j < this.paths.series[i].length; j++)
				{
					this.cChartDrawer.drawPath(this.paths.series[i][j], pen, brush);
				}
			}
			else
				this.cChartDrawer.drawPath(this.paths.series[i], pen, brush);
        }
		
		this.cChartDrawer.cShapeDrawer.Graphics.RestoreGrState();
    },
	
	_getYVal: function(n, i)
	{
		var tempVal;
		var val = 0;
		var numCache;
		var idxPoint;
		
		if(this.chartProp.subType == "stacked")
		{
			for(var k = 0; k <= i; k++)
			{
				numCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache :  this.chartProp.series[k].val.numLit;
				idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], n);
				tempVal = idxPoint ? parseFloat(idxPoint.val) : 0;
				if(tempVal)
					val += tempVal;
			}
		}
		else if(this.chartProp.subType == "stackedPer")
		{
			var summVal = 0;
			for(var k = 0; k < this.chartProp.series.length; k++)
			{
				numCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache :  this.chartProp.series[k].val.numLit;
				idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], n);
				tempVal = idxPoint ? parseFloat(idxPoint.val) : 0;
				if(tempVal)
				{
					if(k <= i)
						val += tempVal;
					summVal += Math.abs(tempVal);
				}
			}
			val = val / summVal;
		}
		else
		{
			numCache = this.chartProp.series[i].val.numRef ? this.chartProp.series[i].val.numRef.numCache :  this.chartProp.series[i].val.numLit;
			idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[i], n);
			val = idxPoint ? parseFloat(idxPoint.val) : null;
		}
		return val;
	},
	
	_drawLines3D: function (/*isSkip*/)
    {
		//ширина линии
		var brush;
		var FillUniColor;
		var pen;
		var seria, dataSeries;
		
		this.cChartDrawer.cShapeDrawer.Graphics.SaveGrState();
		this.cChartDrawer.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - 1) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
		
		for (var i = 0; i < this.chartProp.series.length; i++) {
			
			//в случае накопительных дигарамм, рисуем в обратном порядке
			/*if(this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked")
				seria = this.chartProp.series[this.chartProp.series.length - 1 - i];
			else*/
			seria = this.chartProp.series[i];
			
			dataSeries = seria.val.numRef && seria.val.numRef.numCache ? seria.val.numRef.numCache.pts : seria.val.numLit ? seria.val.numLit.pts : null;
			
			if(!dataSeries)
				continue;
			
			if(dataSeries[0] && dataSeries[0].pen)
				pen = dataSeries[0].pen;
			if(dataSeries[0] && dataSeries[0].brush)
				brush = dataSeries[0].brush;
			
			for(var j = 0; j < this.paths.series[i].length; j++)
			{
				this.cChartDrawer.drawPath(this.paths.series[i][j], pen, brush);
			}
        }
		
		this.cChartDrawer.cShapeDrawer.Graphics.RestoreGrState();
    },	
	
	
	_DrawBars3D: function()
	{
		var pointChangeDirection = ((this.chartProp.widthCanvas - (this.chartProp.chartGutter._left + this.chartProp.chartGutter._right)) / 2 + this.chartProp.chartGutter._left) / this.chartProp.pxToMM;
		
		var view3DProp = this.cChartSpace.chart.view3D;
		var angleOy = view3DProp && view3DProp.rotY ? (view3DProp.rotY / 360) * (Math.PI * 2) : 0;
		
		//поворот вокруг оси OY
		//if(Math.abs(angleOy) > 30)
			//pointChangeDirection = this.chartProp.chartGutter._left + this.chartProp.widthCanvas;
			
		pointChangeDirection = pointChangeDirection + (this.chartProp.widthCanvas / 2) * Math.sin(angleOy);
		
		//pointChangeDirection = pointChangeDirection * Math.cos(angleOx);
		
		/*if(this.chartProp.subType !== "standard")
		{
			var brush, pen, seria;
			for (var i = 0; i < this.chartProp.ptCount; i++) {	
				for (var j = 0; j < this.paths.series.length; ++j) {
					seria = this.chartProp.series[j];
					brush = seria.brush;
					pen = seria.pen;
					
					if(!this.paths.series[j] || !this.paths.series[j][i] || !seria.val.numRef.numCache.pts[i])
						continue;
					
					if(seria.val.numRef.numCache.pts[i].pen)
						pen = seria.val.numRef.numCache.pts[i].pen;
					if(seria.val.numRef.numCache.pts[i].brush)
						brush = seria.val.numRef.numCache.pts[i].brush;
					
					for(var k = 0; k < this.paths.series[j][i].length; k++)
					{
						if(this.paths.series[j][i][k] && this.paths.series[j][i][k].ArrPathCommand && this.paths.series[j][i][k].ArrPathCommand[0] && parseInt(this.paths.series[j][i][k].ArrPathCommand[0].X) >= parseInt(pointChangeDirection))
							continue;
						
						this._drawBar3D(this.paths.series[j][i][k], pen, brush, k);
					}
				}
			}
		}*/
		
		
		//вторую половину с конца рисуем
		var brush, pen, seria;
		if(this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked")
		{
			for (var j = 0 ; j < this.paths.series.length; j++) {
				seria = this.chartProp.series[j];
				brush = seria.brush;
				pen = seria.pen;
				
				//if(!this.paths.series[j] || !this.paths.series[j][i] || !seria.val.numRef.numCache.pts[i])
					//continue;
				
				if(seria.val.numRef.numCache.pts[0].pen)
					pen = seria.val.numRef.numCache.pts[0].pen;
				if(seria.val.numRef.numCache.pts[0].brush)
					brush = seria.val.numRef.numCache.pts[0].brush;
				
				for(var k = this.paths.series[j].length - 1; k >=0 ; k--)
				{
					/*if(this.paths.series[j][i][k] && this.paths.series[j][i][k].ArrPathCommand && this.paths.series[j][i][k].ArrPathCommand[0] && parseInt(this.paths.series[j][i][k].ArrPathCommand[0].X) < parseInt(pointChangeDirection))
						break;*/
					
					this._drawBar3D(this.paths.series[j][k], pen, brush, k);
				}
			}
		}
		else
		{
			for (var j = this.paths.series.length - 1; j >= 0; j--) {
				seria = this.chartProp.series[j];
				brush = seria.brush;
				pen = seria.pen;
				
				//if(!this.paths.series[j] || !this.paths.series[j][i] || !seria.val.numRef.numCache.pts[i])
					//continue;
				
				if(seria.val.numRef.numCache.pts[0].pen)
					pen = seria.val.numRef.numCache.pts[0].pen;
				if(seria.val.numRef.numCache.pts[0].brush)
					brush = seria.val.numRef.numCache.pts[0].brush;
				
				for(var k = this.paths.series[j].length - 1; k >=0 ; k--)
				{
					/*if(this.paths.series[j][i][k] && this.paths.series[j][i][k].ArrPathCommand && this.paths.series[j][i][k].ArrPathCommand[0] && parseInt(this.paths.series[j][i][k].ArrPathCommand[0].X) < parseInt(pointChangeDirection))
						break;*/
					
					this._drawBar3D(this.paths.series[j][k], pen, brush, k);
				}
			}
		}
				
		
	},
	
	_DrawBars3DStandart: function()
	{
		var view3DProp = this.cChartSpace.chart.view3D;
		var angleOy = view3DProp && view3DProp.rotY ? (view3DProp.rotY / 360) * (Math.PI * 2) : 0;
		
		//вторую половину с конца рисуем
		var brush, pen, seria;
		for (var i = this.paths.series.length - 1; i >= 0; i--) {
			for (var j = this.chartProp.ptCount - 1; j >= 0; j--) {
				seria = this.chartProp.series[i];
				brush = seria.brush;
				pen = seria.pen;
				
				if(!this.paths.series[i] || !this.paths.series[i][j] || !seria.val.numRef.numCache.pts[j])
					continue;
				
				if(seria.val.numRef.numCache.pts[j].pen)
					pen = seria.val.numRef.numCache.pts[j].pen;
				if(seria.val.numRef.numCache.pts[j].brush)
					brush = seria.val.numRef.numCache.pts[j].brush;
				
				for(var k = 0; k < this.paths.series[i][j].length; k++)
				{
					this._drawBar3D(this.paths.series[i][j][k], pen, brush, k);
				}
			}
		}
	},
	
	_drawBar3D: function(path, pen, brush, k)
	{
		//затемнение боковых сторон
		//в excel всегда темные боковые стороны, лицевая и задняя стороны светлые
		//pen = this.cChartSpace.chart.plotArea.valAx.compiledMajorGridLines;
		//pen.setFill(brush);
		pen = AscFormat.CreatePenFromParams(brush, undefined, undefined, undefined, undefined, 0.1);
		if(k != 5 && k != 0)
		{
			var  props = this.cChartSpace.getParentObjects();
			var duplicateBrush = brush.createDuplicate();
			var cColorMod = new AscFormat.CColorMod;
			if(k == 1 || k == 4)
				cColorMod.val = 45000;
			else
				cColorMod.val = 35000;
			cColorMod.name = "shade";
			duplicateBrush.fill.color.Mods.addMod(cColorMod);
			duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new AscFormat.CUniColor().RGBA);
			
			pen.setFill(duplicateBrush);
			if(path && path.length)
			{
				for(var i = 0; i < path.length; i++)
				{
					this.cChartDrawer.drawPath(path[i], pen, duplicateBrush);
				}
			}
			else
				this.cChartDrawer.drawPath(path, pen, duplicateBrush);
		}
		else
		{
			if(path && path.length)
			{
				for(var i = 0; i < path.length; i++)
				{
					this.cChartDrawer.drawPath(path[i], pen, brush);
				}
			}
			else
				this.cChartDrawer.drawPath(path, pen, brush);
		}
	},
	
	_calculateLine3D: function (points, prevPoints, seriaNum, allPoints)
    {
		//pointsIn3D[0] - верхняя грань ближней стороны, pointsIn3D[1] - нижняя грань ближней стороны, pointsIn3D[2] - верхняя грань дальней стороны, pointsIn3D[3] - нижняя грань дальней стороны
		var pointsIn3D = [];
		var t = this;
		var nullPositionOX = this.chartProp.nullPositionOX;
		var pxToMm = this.chartProp.pxToMM;
		
		//сдвиг по OZ в глубину
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		var gapDepth = this.cChartSpace.chart.plotArea.chart.gapDepth != null ? this.cChartSpace.chart.plotArea.chart.gapDepth : globalGapDepth;
		
		if(this.chartProp.subType === "normal")
			perspectiveDepth = (perspectiveDepth / (gapDepth / 100 + 1)) / this.chartProp.seriesCount;
		else	
			perspectiveDepth = perspectiveDepth / (gapDepth / 100 + 1);
		
		var DiffGapDepth = perspectiveDepth * (gapDepth / 2) / 100;
		
		if(this.chartProp.subType === "normal")
			gapDepth = (perspectiveDepth + DiffGapDepth + DiffGapDepth) * seriaNum + DiffGapDepth;
		else
			gapDepth = DiffGapDepth;
		
		
		
		var getProjectPoints = function(currentZ, startN)
		{
			pointsIn3D[startN] = [];			
			for(var i = 0; i < points.length; i++)
			{
				pointsIn3D[startN][i] = t.cChartDrawer._convertAndTurnPoint(points[i].x * pxToMm, points[i].y * pxToMm, currentZ + gapDepth);
			}
			
			pointsIn3D[startN + 1] = [];
			if(prevPoints != null)
			{
				for(var i = 0; i < prevPoints.length; i++)
				{
					if(i == 0)
						pointsIn3D[startN + 1][0] = t.cChartDrawer._convertAndTurnPoint(points[0].x * pxToMm, points[0].y * pxToMm, currentZ + gapDepth);
					
					pointsIn3D[startN + 1][i + 1] = t.cChartDrawer._convertAndTurnPoint(prevPoints[i].x * pxToMm, prevPoints[i].y * pxToMm, currentZ + gapDepth);
				}
			}
			else
			{
				pointsIn3D[startN + 1][0] = t.cChartDrawer._convertAndTurnPoint(points[0].x * pxToMm, nullPositionOX, currentZ + gapDepth);
				pointsIn3D[startN + 1][1] = t.cChartDrawer._convertAndTurnPoint(points[points.length - 1].x * pxToMm, nullPositionOX, currentZ + gapDepth);
			}
		};
		
		var zNear = 0;
		var zFar = perspectiveDepth;
		//рассчитываем ближние и дальние точки конкретной серии
		getProjectPoints(zNear, 0);
		getProjectPoints(zFar, 2);
		
		var res = null;
		if(this.chartProp.subType === "normal")
			res = this._calculateRect3D(pointsIn3D, gapDepth, perspectiveDepth, seriaNum, allPoints);
		else
			res = this._calculateRect3DStacked(pointsIn3D, gapDepth, perspectiveDepth, seriaNum, allPoints)
		
		return res;
    },
	
	
	_calculateLine3DStacked: function (points, prevPoints, seriaNum, allPoints)
    {
		//pointsIn3D[0] - верхняя грань ближней стороны, pointsIn3D[1] - нижняя грань ближней стороны, pointsIn3D[2] - верхняя грань дальней стороны, pointsIn3D[3] - нижняя грань дальней стороны
		var pointsIn3D = [];
		var t = this;
		var nullPositionOX = this.chartProp.nullPositionOX;
		var pxToMm = this.chartProp.pxToMM;
		var upNear1 = 0, downNear1 = 1, upFar1 = 2, downFar1 = 3;
		
		//сдвиг по OZ в глубину
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		var gapDepth = this.cChartSpace.chart.plotArea.chart.gapDepth != null ? this.cChartSpace.chart.plotArea.chart.gapDepth : globalGapDepth;
		
		if(this.chartProp.subType === "normal")
			perspectiveDepth = (perspectiveDepth / (gapDepth / 100 + 1)) / this.chartProp.seriesCount;
		else	
			perspectiveDepth = perspectiveDepth / (gapDepth / 100 + 1);
		
		var DiffGapDepth = perspectiveDepth * (gapDepth / 2) / 100;
		
		if(this.chartProp.subType === "normal")
			gapDepth = (perspectiveDepth + DiffGapDepth + DiffGapDepth) * seriaNum + DiffGapDepth;
		else
			gapDepth = DiffGapDepth;
		
		
		
		var getProjectPoints = function(currentZ, startN)
		{
			pointsIn3D[startN] = [];
			pointsIn3D[startN + 1] = [];			
			for(var i = 0; i < points.length; i++)
			{
				//нижняя точка
				pointsIn3D[startN][i] = t.cChartDrawer._convertAndTurnPoint(points[i].x * pxToMm, points[i].y * pxToMm, currentZ + gapDepth);
				
				//верхняя точка
				if(prevPoints)
					pointsIn3D[startN + 1][i] = t.cChartDrawer._convertAndTurnPoint(prevPoints[i].x * pxToMm, prevPoints[i].y * pxToMm, currentZ + gapDepth);
				else
					pointsIn3D[startN + 1][i] = t.cChartDrawer._convertAndTurnPoint(points[i].x * pxToMm, nullPositionOX, currentZ + gapDepth);
					
				/*if(i !== 0)
				{
					var upPoint = pointsIn3D[startN][i];
					var  downPoint = pointsIn3D[startN + 1][i];
					
					var upPointPrev= pointsIn3D[startN][i - 1];
					var  downPointPrev= pointsIn3D[startN + 1][i - 1];
					
					if(downPoint.y < upPoint.y && downPointPrev.y < upPointPrev.y)
					{
						pointsIn3D[startN + 1][i] = upPoint;
						pointsIn3D[startN][i] = downPoint;
						
						pointsIn3D[startN + 1][i - 1] = upPointPrev;
						pointsIn3D[startN][i - 1] = downPointPrev
					}
				}*/
			}
		};
		
		var zNear = 0;
		var zFar = perspectiveDepth;
		//рассчитываем ближние и дальние точки конкретной серии
		getProjectPoints(zNear, 0);
		getProjectPoints(zFar, 2);
		
		//если перевёрнута грань
		/*if(pointsIn3D[downNear1][0].y < pointsIn3D[upNear1][0].y && pointsIn3D[downNear1][1].y < pointsIn3D[upNear1][1].y)
		{
			var downNear = pointsIn3D[downNear1];
			var upNear = pointsIn3D[upNear1];
			var downFar = pointsIn3D[downFar1];
			var upFar = pointsIn3D[upFar1];
			
			pointsIn3D = [];
			pointsIn3D[downNear1] = upNear;
			pointsIn3D[upNear1] = downNear;
			pointsIn3D[downFar1] = upFar;
			pointsIn3D[upFar1] = downFar;
		}*/
		
		var res = this._calculateRect3DStacked(pointsIn3D, gapDepth, perspectiveDepth, seriaNum, allPoints)
		
		return res;
    },
	
	_getIntersectionLines: function(line1Point1, line1Point2, line2Point1, line2Point2)
	{
		var chartHeight = this.chartProp.trueHeight;
		var chartWidth = this.chartProp.trueWidth;
		var left = this.chartProp.chartGutter._left;
		var top = this.chartProp.chartGutter._top;
		
		var x1 = line1Point1.x;
		var x2 = line1Point2.x;
		var y1 = line1Point1.y;
		var y2 = line1Point2.y;
		
		var x3 = line2Point1.x;
		var x4 = line2Point2.x;
		var y3 = line2Point1.y;
		var y4 = line2Point2.y;
		
		var x = ((x1 * y2 - x2 * y1) * (x4 - x3) - (x3 * y4 - x4 * y3) * (x2 - x1)) / ((y1 - y2) * (x4 - x3) - (y3 - y4) * (x2 - x1));
		var y = ((y3 - y4) * x - (x3 * y4 - x4 * y3)) / (x4 - x3);
		
		x = -x;
		
		var res = null; 
		
		if(y < top + chartHeight && y > top && x > line1Point1.x && x < line1Point2.x)
			res = {x: x, y: y}
		
		return res;
	},
	
	
	_getPrevSeriesIntersection2: function(i, pointsIn3D, revertDownUp)
	{
		var upNear = 0, downNear = 1, upFar = 2, downFar = 3;
		if(revertDownUp)
		{
			upNear = 1, downNear = 0, upFar = 3, downFar = 2;
		}
		
		var t = this, prevNear, prevFar, res = null, currentNearOld, currentFarOld;
		var downNearPointOld1, downNearPointOld2, upNearPointOld1, upNearPointOld2, downFarPointOld1, downFarPointOld2, upFarPointOld1, upFarPointOld2;
		
		var downNearPoint1 = pointsIn3D[downNear][i];
		var downNearPoint2 = pointsIn3D[downNear][i + 1];
		//верхняя ближней плоскости
		var upNearPoint1 = pointsIn3D[upNear][i];
		var upNearPoint2 = pointsIn3D[upNear][i + 1];
		//нижняя дальней плоскости
		var downFarPoint1 = pointsIn3D[downFar][i];
		var downFarPoint2 = pointsIn3D[downFar][i + 1];
		//верхняя дальней плоскости
		var upFarPoint1 = pointsIn3D[upFar][i];
		var upFarPoint2 = pointsIn3D[upFar][i + 1];
		
		//точки пересечения текущей серии(её верхней и нижней грани)
		var currentNear = t._getIntersectionLines(downNearPoint1, downNearPoint2, upNearPoint1, upNearPoint2);
		var currentFar = t._getIntersectionLines(downFarPoint1, downFarPoint2, upFarPoint1, upFarPoint2);
		
		
		var prevIntersectionNear, prevIntersectionFar;
		
		var calcCurrentNearCurrentOld = function()
		{
			//в данном случае нужно найти четыре пересечения(с нижней и верхней плоскостью)
			var intersectionUpUpNear = t._getIntersectionLines(upNearPoint1, upNearPoint2, upNearPointOld1, upNearPointOld2);
			var intersectionUpUpFar = t._getIntersectionLines(upFarPoint1, upFarPoint2, upFarPointOld1, upFarPointOld2);
			
			if(intersectionUpUpNear)
			{
				prevIntersectionNear = intersectionUpUpNear;
				prevIntersectionFar = intersectionUpUpFar;
			}
				
			
			var intersectionDownUpNear = t._getIntersectionLines(downNearPoint1, downNearPoint2, upNearPointOld1, upNearPointOld2);
			var intersectionDownUpFar = t._getIntersectionLines(downFarPoint1, downFarPoint2, upFarPointOld1, upFarPointOld2);
			
			if((intersectionDownUpNear && prevIntersectionNear && intersectionDownUpNear.y < prevIntersectionNear.y) || (!prevIntersectionNear))
			{
				prevIntersectionNear = intersectionDownUpNear;
				prevIntersectionFar = intersectionDownUpFar;
			}
			
			var intersectionUpDownNear = t._getIntersectionLines(upNearPoint1, upNearPoint2, downNearPointOld1, downNearPointOld2);
			var intersectionUpDownFar = t._getIntersectionLines(upFarPoint1, upFarPoint2, downFarPointOld1, downFarPointOld2);
			
			if((intersectionUpDownNear && prevIntersectionNear && intersectionUpDownNear.y < prevIntersectionNear.y) || (!prevIntersectionNear))
			{
				prevIntersectionNear = intersectionUpDownNear;
				prevIntersectionFar = intersectionUpDownFar;
			}
			
			var intersectionDownDownNear = t._getIntersectionLines(downNearPoint1, downNearPoint2, downNearPointOld1, downNearPointOld2);
			var intersectionDownDownFar = t._getIntersectionLines(downFarPoint1, downFarPoint2, downFarPointOld1, downFarPointOld2);
			
			if((intersectionDownDownNear && prevIntersectionNear && intersectionDownDownNear.y < prevIntersectionNear.y) || (!prevIntersectionNear))
			{
				prevIntersectionNear = intersectionDownDownNear;
				prevIntersectionFar = intersectionDownDownFar;
			}
		};
		
		var calcCurrentNear = function()
		{
			//в данном случае нужно найти оба пересечения(с нижней и верхней плоскостью текущей серии)
			var intersectionUpNear = t._getIntersectionLines(upNearPoint1, upNearPoint2, upNearPointOld1, upNearPointOld2);
			var intersectionUpFar = t._getIntersectionLines(upFarPoint1, upFarPoint2, upFarPointOld1, upFarPointOld2);
			
			if((intersectionUpNear && prevIntersectionNear && intersectionUpNear.y < prevIntersectionNear.y) || (!prevIntersectionNear))
			{
				prevIntersectionNear = intersectionUpNear;
				prevIntersectionFar = intersectionUpFar;
			}
			
			var intersectionDownNear = t._getIntersectionLines(downNearPoint1, downNearPoint2, upNearPointOld1, upNearPointOld2);
			var intersectionDownFar = t._getIntersectionLines(downFarPoint1, downFarPoint2, upFarPointOld1, upFarPointOld2);
			
			if((intersectionDownNear && prevIntersectionNear && intersectionDownNear.y < prevIntersectionNear.y) || (!prevIntersectionNear))
			{
				prevIntersectionNear = intersectionDownNear;
				prevIntersectionFar = intersectionDownFar;
			}
			
			if(intersectionUpNear && intersectionUpNear.y >= currentNear.y)
			{
				prevIntersectionNear = null;
				prevIntersectionFar = null;
			}
		};
		
		
		var calcCurrentNearOld = function()
		{
			//в данном случае нужно найти оба пересечения(с нижней и верхней плоскостью предыдущей серии)
			var intersectionUpDownNear = t._getIntersectionLines(upNearPoint1, upNearPoint2, downNearPointOld1, downNearPointOld2);
			var intersectionUpDownFar = t._getIntersectionLines(upFarPoint1, upFarPoint2, downFarPointOld1, downFarPointOld2);
			
			var intersectionUpUpNear = t._getIntersectionLines(upNearPoint1, upNearPoint2, upNearPointOld1, upNearPointOld2);
			var intersectionUpUpFar = t._getIntersectionLines(upFarPoint1, upFarPoint2, upFarPointOld1, upFarPointOld2);
			
			if(intersectionUpDownNear && intersectionUpUpNear)
			{
				if(intersectionUpDownNear.y < intersectionUpUpNear.y)
				{
					prevIntersectionNear = intersectionUpDownNear;
					prevIntersectionFar = intersectionUpDownFar;
				}
				else
				{
					prevIntersectionNear = intersectionUpUpNear;
					prevIntersectionFar = intersectionUpUpFar;
				}
			}
			else if(intersectionUpDownNear)
			{
				prevIntersectionNear = intersectionUpDownNear;
				prevIntersectionFar = intersectionUpDownFar;
			}
			else if(intersectionUpUpNear)
			{
				prevIntersectionNear = intersectionUpUpNear;
				prevIntersectionFar = intersectionUpUpFar;
			}
		};
		
		var calcWithoutCurrent = function()
		{
			//в данном случае нужно найти оба пересечения(с нижней и верхней плоскостью предыдущей серии)
			var intersectionUpDownNear = t._getIntersectionLines(upNearPoint1, upNearPoint2, downNearPointOld1, downNearPointOld2);
			var intersectionUpDownFar = t._getIntersectionLines(upFarPoint1, upFarPoint2, downFarPointOld1, downFarPointOld2);
			
			var intersectionUpUpNear = t._getIntersectionLines(upNearPoint1, upNearPoint2, upNearPointOld1, upNearPointOld2);
			var intersectionUpUpFar = t._getIntersectionLines(upFarPoint1, upFarPoint2, upFarPointOld1, upFarPointOld2);
			
			if(intersectionUpDownNear && intersectionUpUpNear)
			{
				if(intersectionUpDownNear.y < intersectionUpUpNear.y)
				{
					prevIntersectionNear = intersectionUpDownNear;
					prevIntersectionFar = intersectionUpDownFar;
				}
				else
				{
					prevIntersectionNear = intersectionUpUpNear;
					prevIntersectionFar = intersectionUpUpFar;
				}
			}
			else if(intersectionUpDownNear)
			{
				prevIntersectionNear = intersectionUpDownNear;
				prevIntersectionFar = intersectionUpDownFar;
			}
			else if(intersectionUpUpNear)
			{
				prevIntersectionNear = intersectionUpUpNear;
				prevIntersectionFar = intersectionUpUpFar;
			}
		};
		
	
		
		var calculateIntersectionWithPrevSeria = function()
		{
			prevIntersectionNear = null, prevIntersectionFar = null;
			if(currentNear)
			{
				if(currentNearOld)
				{
					calcCurrentNearCurrentOld();
				}
				else
				{
					calcCurrentNear()
				}
			}
			else
			{
				if(currentNearOld)
				{
					calcCurrentNearOld();
				}
				else
				{
					calcWithoutCurrent();
				}
			}
		};
		
		var checkVergeAdd = function()
		{
			var res = true;
			
			if(upNearPointOld1.y < upNearPoint1.y && upNearPointOld2.y < upNearPoint2.y && downNearPointOld1.y < downNearPoint1.y && downNearPointOld2.y < downNearPoint2.y)
			{
				res = false;
			}
			
			return res;
		};
		
		//проходимся по всем предыдущим сериям
		for(var n = 0; n < t.usuallyCalculateSeries.length; n++)
		{
			var pointsIn3dOld = t.usuallyCalculateSeries[n];
			
			var upNear1 = 0, downNear1 = 1, upFar1 = 2, downFar1 = 3;
			if(pointsIn3dOld[downNear1][i].y < pointsIn3dOld[upNear1][i].y && pointsIn3dOld[downNear1][i + 1].y < pointsIn3dOld[upNear1][i + 1].y)
			{	
				upNear1 = 1, downNear1 = 0, upFar1 = 3, downFar1 = 2;
			}
			
			//точки предыдущей серии
			//нижняя ближней плоскости
			downNearPointOld1 = pointsIn3dOld[downNear1][i];
			downNearPointOld2 = pointsIn3dOld[downNear1][i + 1];
			//верхняя ближней плоскости
			upNearPointOld1 = pointsIn3dOld[upNear1][i];
			upNearPointOld2 = pointsIn3dOld[upNear1][i + 1];
			//нижняя дальней плоскости
			downFarPointOld1 = pointsIn3dOld[downFar1][i];
			downFarPointOld2 = pointsIn3dOld[downFar1][i + 1];
			//верхняя дальней плоскости
			upFarPointOld1 = pointsIn3dOld[upFar1][i];
			upFarPointOld2 = pointsIn3dOld[upFar1][i + 1];
			
			if(!downNearPointOld1 || !upNearPointOld1 || !downNearPointOld2 || !upNearPointOld2)
				continue;
			
			//точки пересечения предыдущей серии(её верхней и нижней грани)
			currentNearOld = t._getIntersectionLines(downNearPointOld1, downNearPointOld2, upNearPointOld1, upNearPointOld2);
			currentFarOld = t._getIntersectionLines(downFarPointOld1, downFarPointOld2, upFarPointOld1, upFarPointOld2);
			
			//проверка на то, нужно ли вообще рисовать грань
			if(checkVergeAdd() === false)
			{
				res = false;
				break;
			}
			
			calculateIntersectionWithPrevSeria();
			
			//если пересечение находится выше, выбираем его
			if(prevIntersectionNear && prevIntersectionFar && ((prevNear && prevIntersectionNear.y < prevNear.y) || !prevNear))
			{
				prevNear = prevIntersectionNear;
				prevFar = prevIntersectionFar;
			}
		}
		
		
		if((currentNear || prevNear) && res !== false)
			res = {currentNear: currentNear, currentFar: currentFar, prevNear: prevNear, prevFar: prevFar, currentNearOld: currentNearOld, currentFarOld: currentFarOld};
		
		return res;
	},
	
	_getPrevSeriesIntersection: function(i, pointsIn3D, revertDownUp)
	{	
		var upNear = 0, downNear = 1, upFar = 2, downFar = 3;
		if(revertDownUp)
		{
			var upNear = 1, downNear = 0, upFar = 3, downFar = 2;
		}
		
		var t = this;
		var res = null;
		
		var descending = true;
		if(pointsIn3D[upNear][i].y > pointsIn3D[upNear][i + 1].y)
			descending = false;
		
		if(descending)
		{
			if((pointsIn3D[upNear][i].y > pointsIn3D[downNear][i].y && pointsIn3D[upNear][i + 1].y > pointsIn3D[downNear][i + 1].y))
			{
				//нижняя ближней плоскости
				var downNearPoint1 = pointsIn3D[upNear][i];
				var downNearPoint2 = pointsIn3D[upNear][i + 1];
				//верхняя ближней плоскости
				var upNearPoint1 = pointsIn3D[downNear][i];
				var upNearPoint2 = pointsIn3D[downNear][i + 1];
				//нижняя дальней плоскости
				var downFarPoint1 = pointsIn3D[upFar][i];
				var downFarPoint2 = pointsIn3D[upFar][i + 1];
				//верхняя дальней плоскости
				var upFarPoint1 = pointsIn3D[downFar][i];
				var upFarPoint2 = pointsIn3D[downFar][i + 1];
			}
			else
			{
				//нижняя ближней плоскости
				var downNearPoint1 = pointsIn3D[downNear][i];
				var downNearPoint2 = pointsIn3D[downNear][i + 1];
				//верхняя ближней плоскости
				var upNearPoint1 = pointsIn3D[upNear][i];
				var upNearPoint2 = pointsIn3D[upNear][i + 1];
				//нижняя дальней плоскости
				var downFarPoint1 = pointsIn3D[downFar][i];
				var downFarPoint2 = pointsIn3D[downFar][i + 1];
				//верхняя дальней плоскости
				var upFarPoint1 = pointsIn3D[upFar][i];
				var upFarPoint2 = pointsIn3D[upFar][i + 1];
			}
		}
		else
		{
			if(!(pointsIn3D[upNear][i].y > pointsIn3D[downNear][i].y && pointsIn3D[upNear][i + 1].y > pointsIn3D[downNear][i + 1].y))
			{
				//нижняя ближней плоскости
				var downNearPoint1 = pointsIn3D[upNear][i];
				var downNearPoint2 = pointsIn3D[upNear][i + 1];
				//верхняя ближней плоскости
				var upNearPoint1 = pointsIn3D[downNear][i];
				var upNearPoint2 = pointsIn3D[downNear][i + 1];
				//нижняя дальней плоскости
				var downFarPoint1 = pointsIn3D[upFar][i];
				var downFarPoint2 = pointsIn3D[upFar][i + 1];
				//верхняя дальней плоскости
				var upFarPoint1 = pointsIn3D[downFar][i];
				var upFarPoint2 = pointsIn3D[downFar][i + 1];
			}
			else
			{
				//нижняя ближней плоскости
				var downNearPoint1 = pointsIn3D[downNear][i];
				var downNearPoint2 = pointsIn3D[downNear][i + 1];
				//верхняя ближней плоскости
				var upNearPoint1 = pointsIn3D[upNear][i];
				var upNearPoint2 = pointsIn3D[upNear][i + 1];
				//нижняя дальней плоскости
				var downFarPoint1 = pointsIn3D[downFar][i];
				var downFarPoint2 = pointsIn3D[downFar][i + 1];
				//верхняя дальней плоскости
				var upFarPoint1 = pointsIn3D[upFar][i];
				var upFarPoint2 = pointsIn3D[upFar][i + 1];
			}
		}
		
		
		//смотрим, есть ли точки пересечения граней	одной серии
		var currentNear = t._getIntersectionLines(downNearPoint1, downNearPoint2, upNearPoint1, upNearPoint2);
		var currentFar = t._getIntersectionLines(downFarPoint1, downFarPoint2, upFarPoint1, upFarPoint2);
		var prevNear, prevFar;
		
		//если нет предыдущих серий
		if(!t.usuallyCalculateSeries.length)
			return currentFar ? {currentNear: currentNear, currentFar: currentFar, prevNear: prevNear, prevFar: prevFar} : null;
		
		var downNearPointOld1, downNearPointOld2, upNearPointOld1, upNearPointOld2, downFarPointOld1, downFarPointOld2, upFarPointOld1, upFarPointOld2;
		var currentNearOld = null, currentFarOld = null;
		var descendingVerge = function()
		{
			var result = null;
			
			currentNearOld = t._getIntersectionLines(downNearPointOld1, downNearPointOld2, upNearPointOld1, upNearPointOld2);
			currentFarOld = t._getIntersectionLines(downFarPointOld1, downFarPointOld2, upFarPointOld1, upFarPointOld2);
			
			if(currentNear)
			{
				var intersectionWithPrevSeriaNear = t._getIntersectionLines(downNearPoint1, downNearPoint2, downNearPointOld1, downNearPointOld2);
				var intersectionWithPrevSeriaFar = t._getIntersectionLines(downFarPoint1, downFarPoint2, downFarPointOld1, downFarPointOld2);
				
				var intersectionWithPrevNearDownDown = t._getIntersectionLines(downNearPoint1, downNearPoint2, downNearPointOld1, downNearPointOld2);
				var intersectionWithPrevFarDownDown = t._getIntersectionLines(downFarPoint1, downFarPoint2, downFarPointOld1, downFarPointOld2);
				
				var intersectionWithPrevNearUpDown = t._getIntersectionLines(upNearPoint1, upNearPoint2, downNearPointOld1, downNearPointOld2);
				var intersectionWithPrevFarUpDown = t._getIntersectionLines(upFarPoint1, upFarPoint2, downFarPointOld1, downFarPointOld2);
				
				var intersectionWithPrevNearUpUp = t._getIntersectionLines(upNearPoint1, upNearPoint2, upNearPointOld1, upNearPointOld2);
				var intersectionWithPrevFarUpUp = t._getIntersectionLines(upFarPoint1, upFarPoint2, upFarPointOld1, upFarPointOld2);
				
				var intersectionWithPrevNearDownUp = t._getIntersectionLines(downNearPoint1, downNearPoint2, upNearPointOld1, upNearPointOld2);
				var intersectionWithPrevFarDownUp = t._getIntersectionLines(downFarPoint1, downFarPoint2, upFarPointOld1, upFarPointOld2);
				
				if(currentNearOld)
				{
					//если точка пересечения самой грани до пересечения с предыдущей
					if(intersectionWithPrevNearUpDown)
					{
						if(parseInt(currentNear.x) <= parseInt(intersectionWithPrevNearUpDown.x) && parseInt(currentNearOld.x) <= parseInt(intersectionWithPrevNearUpDown.x))//точки пересечения самих линий до текущего
						{
							if((!prevNear || prevNear && prevNear.y > intersectionWithPrevNearUpDown.y))
							{
								prevNear = intersectionWithPrevNearDownDown;
								prevFar = intersectionWithPrevFarDownDown;
							}
						}
						else if(parseInt(currentNear.x) <= parseInt(intersectionWithPrevNearUpDown.x) && parseInt(currentNearOld.x) >= parseInt(intersectionWithPrevNearUpDown.x))
						{
							if(intersectionWithPrevNearDownUp && (!prevNear || prevNear && prevNear.y > intersectionWithPrevNearDownUp.y))
							{
								prevNear = intersectionWithPrevNearDownUp;
								prevFar = intersectionWithPrevFarDownUp;
							}
							else if(intersectionWithPrevNearDownDown && (!prevNear || prevNear && prevNear.y > intersectionWithPrevNearDownDown.y))
							{
								prevNear = intersectionWithPrevNearDownDown;
								prevFar = intersectionWithPrevFarDownDown;
							}
						}
						else if(parseInt(currentNear.x) >= parseInt(intersectionWithPrevNearUpDown.x) && parseInt(currentNearOld.x) >= parseInt(intersectionWithPrevNearUpDown.x))
						{
							if(intersectionWithPrevNearUpUp && (!prevNear || prevNear && prevNear.y > intersectionWithPrevNearUpUp.y))
							{
								prevNear = intersectionWithPrevNearUpUp;
								prevFar = intersectionWithPrevFarUpUp;
							}
						}
						else if(parseInt(currentNear.x) >= parseInt(intersectionWithPrevNearUpDown.x) && parseInt(currentNearOld.x) <= parseInt(intersectionWithPrevNearUpDown.x))
						{
							if(intersectionWithPrevNearUpDown && (!prevNear || prevNear && prevNear.y > intersectionWithPrevNearUpDown.y))
							{
								prevNear = intersectionWithPrevNearUpDown;
								prevFar = intersectionWithPrevFarUpDown;
							}
						}
						
					}
					else if(intersectionWithPrevSeriaNear && intersectionWithPrevSeriaNear.x < currentNear.x && (!prevNear || prevNear && prevNear.y > intersectionWithPrevSeriaNear.y))
					{
						result = {};
						prevNear = intersectionWithPrevSeriaNear;
						prevFar = intersectionWithPrevSeriaFar;
					}
					else
					{
						//var intersectionWithPrevSeriaNear = t._getIntersectionLines(downNearPoint1, downNearPoint2, upNearPointOld1, upNearPointOld2);
						//var intersectionWithPrevSeriaFar = t._getIntersectionLines(downFarPoint1, downFarPoint2, upFarPointOld1, upFarPointOld2);
					}
					
					return;
				}
				else
				{
					
					
					
					
					//если точка пересечения самой грани до пересечения с предыдущей
					if(intersectionWithPrevNearUpDown)
					{
						if(parseInt(currentNear.x) <= parseInt(intersectionWithPrevNearUpDown.x))//точки пересечения самих линий до текущего
						{
							if((!prevNear || prevNear && prevNear.y > intersectionWithPrevNearUpDown.y) && intersectionWithPrevNearDownDown)
							{
								prevNear = intersectionWithPrevNearDownDown;
								prevFar = intersectionWithPrevFarDownDown;
							}
							/*else if((!prevNear || prevNear && prevNear.y > intersectionWithPrevNearUpDown.y) && intersectionWithPrevNearUpUp)
							{
								prevNear = intersectionWithPrevNearUpUp;
								prevFar = intersectionWithPrevFarUpUp;
							}*/
						}
						else if(parseInt(currentNear.x) <= parseInt(intersectionWithPrevNearUpDown.x))
						{
							if(intersectionWithPrevNearDownUp && (!prevNear || prevNear && prevNear.y > intersectionWithPrevNearDownUp.y))
							{
								prevNear = intersectionWithPrevNearDownUp;
								prevFar = intersectionWithPrevFarDownUp;
							}
							else if(intersectionWithPrevNearDownDown && (!prevNear || prevNear && prevNear.y > intersectionWithPrevNearDownDown.y))
							{
								prevNear = intersectionWithPrevNearDownDown;
								prevFar = intersectionWithPrevFarDownDown;
							}
						}
						else if(parseInt(currentNear.x) >= parseInt(intersectionWithPrevNearUpDown.x))
						{
							if(intersectionWithPrevNearUpUp && (!prevNear || prevNear && prevNear.y > intersectionWithPrevNearUpUp.y))
							{
								prevNear = intersectionWithPrevNearUpUp;
								prevFar = intersectionWithPrevFarUpUp;
							}
						}
						else if(parseInt(currentNear.x) >= parseInt(intersectionWithPrevNearUpDown.x))
						{
							if(intersectionWithPrevNearUpDown && (!prevNear || prevNear && prevNear.y > intersectionWithPrevNearUpDown.y))
							{
								prevNear = intersectionWithPrevNearUpDown;
								prevFar = intersectionWithPrevFarUpDown;
							}
						}
						
					}
					else if(intersectionWithPrevSeriaNear && intersectionWithPrevSeriaNear.x < currentNear.x && (!prevNear || prevNear && prevNear.y > intersectionWithPrevSeriaNear.y))
					{
						result = {};
						prevNear = intersectionWithPrevSeriaNear;
						prevFar = intersectionWithPrevSeriaFar;
					}
					else
					{
						//var intersectionWithPrevSeriaNear = t._getIntersectionLines(downNearPoint1, downNearPoint2, upNearPointOld1, upNearPointOld2);
						//var intersectionWithPrevSeriaFar = t._getIntersectionLines(downFarPoint1, downFarPoint2, upFarPointOld1, upFarPointOld2);
					}
					
					return;
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					if(true)
					{
						var intersectionWithPrevSeriaNear = t._getIntersectionLines(upNearPoint1, upNearPoint2, upNearPointOld1, upNearPointOld2);
						var intersectionWithPrevSeriaFar = t._getIntersectionLines(upFarPoint1, upFarPoint2, upFarPointOld1, upFarPointOld2);
					}
					else
					{
						var intersectionWithPrevSeriaNear = t._getIntersectionLines(downNearPoint1, downNearPoint2, upNearPointOld1, upNearPointOld2);
						var intersectionWithPrevSeriaFar = t._getIntersectionLines(downFarPoint1, downFarPoint2, upFarPointOld1, upFarPointOld2);
					}
				}
				
			}
			else if(currentNearOld)
			{
				var intersectionWithPrevSeriaNear = t._getIntersectionLines(upNearPoint1, upNearPoint2, downNearPointOld1, downNearPointOld2);
				var intersectionWithPrevSeriaFar = t._getIntersectionLines(upFarPoint1, upFarPoint2, downFarPointOld1, downFarPointOld2);
			}
			else
			{
				var intersectionWithPrevSeriaNear = t._getIntersectionLines(upNearPoint1, upNearPoint2, upNearPointOld1, upNearPointOld2);
				var intersectionWithPrevSeriaFar = t._getIntersectionLines(upFarPoint1, upFarPoint2, upFarPointOld1, upFarPointOld2);
			}
			
			
			if((!prevNear || intersectionWithPrevSeriaNear && intersectionWithPrevSeriaNear.y < prevNear.y) && intersectionWithPrevSeriaNear && ((currentNear && currentNear.y !== intersectionWithPrevSeriaNear.y) || !currentNear))
			{
				prevNear = intersectionWithPrevSeriaNear;
				prevFar = intersectionWithPrevSeriaFar;
			}
		};
		
		var ascendingVerge = function()
		{
			currentNearOld = t._getIntersectionLines(downNearPointOld1, downNearPointOld2, upNearPointOld1, upNearPointOld2);
			currentFarOld = t._getIntersectionLines(downFarPointOld1, downFarPointOld2, upFarPointOld1, upFarPointOld2);
			
			if(currentNear)
			{
				if(currentNearOld)
				{
					var intersectionWithPrevSeriaNear = t._getIntersectionLines(downNearPoint1, downNearPoint2, downNearPointOld1, downNearPointOld2);
					var intersectionWithPrevSeriaFar = t._getIntersectionLines(downFarPoint1, downFarPoint2, downFarPointOld1, downFarPointOld2);
					
					var intersectionWithPrevNearDownDown = t._getIntersectionLines(downNearPoint1, downNearPoint2, downNearPointOld1, downNearPointOld2);
					var intersectionWithPrevFarDownDown = t._getIntersectionLines(downFarPoint1, downFarPoint2, downFarPointOld1, downFarPointOld2);
					
					var intersectionWithPrevNearUpDown = t._getIntersectionLines(upNearPoint1, upNearPoint2, downNearPointOld1, downNearPointOld2);
					var intersectionWithPrevFarUpDown = t._getIntersectionLines(upFarPoint1, upFarPoint2, downFarPointOld1, downFarPointOld2);
					
					var intersectionWithPrevNearUpUp = t._getIntersectionLines(upNearPoint1, upNearPoint2, upNearPointOld1, upNearPointOld2);
					var intersectionWithPrevFarUpUp = t._getIntersectionLines(upFarPoint1, upFarPoint2, upFarPointOld1, upFarPointOld2);
					
					var intersectionWithPrevNearDownUp = t._getIntersectionLines(downNearPoint1, downNearPoint2, upNearPointOld1, upNearPointOld2);
					var intersectionWithPrevFarDownUp = t._getIntersectionLines(downFarPoint1, downFarPoint2, upFarPointOld1, upFarPointOld2);
					
					
					//если точка пересечения самой грани до пересечения с предыдущей
					if(intersectionWithPrevNearDownDown)
					{
						if(parseInt(currentNear.x) <= parseInt(intersectionWithPrevNearDownDown.x) && parseInt(currentNearOld.x) <= parseInt(intersectionWithPrevNearDownDown.x))//точки пересечения самих линий до текущего
						{
							if(intersectionWithPrevNearDownDown && (!prevNear || prevNear && prevNear.y > intersectionWithPrevNearDownDown.y))
							{
								prevNear = intersectionWithPrevNearDownDown;
								prevFar = intersectionWithPrevFarDownDown;
							}
						}
						else if(parseInt(currentNear.x) <= parseInt(intersectionWithPrevNearDownDown.x) && parseInt(currentNearOld.x) >= parseInt(intersectionWithPrevNearDownDown.x))
						{
							if(intersectionWithPrevNearDownDown && (!prevNear || prevNear && prevNear.y > intersectionWithPrevNearDownDown.y))
							{
								prevNear = intersectionWithPrevNearDownDown;
								prevFar = intersectionWithPrevFarDownDown;
							}
						}
						else if(parseInt(currentNear.x) >= parseInt(intersectionWithPrevNearDownDown.x) && parseInt(currentNearOld.x) >= parseInt(intersectionWithPrevNearDownDown.x))
						{
							if(intersectionWithPrevNearUpDown && (!prevNear || prevNear && prevNear.y > intersectionWithPrevNearUpDown.y))
							{
								prevNear = intersectionWithPrevNearUpDown;
								prevFar = intersectionWithPrevFarUpDown;
							}
						}
						else if(parseInt(currentNear.x) >= parseInt(intersectionWithPrevNearDownDown.x) && parseInt(currentNearOld.x) <= parseInt(intersectionWithPrevNearDownDown.x))
						{
							if(intersectionWithPrevNearUpDown && (!prevNear || prevNear && prevNear.y > intersectionWithPrevNearUpDown.y))
							{
								prevNear = intersectionWithPrevNearUpDown;
								prevFar = intersectionWithPrevFarUpDown;
							}
						}
						
					}
					else if(intersectionWithPrevSeriaNear && intersectionWithPrevSeriaNear.x < currentNear.x && (!prevNear || prevNear && prevNear.y > intersectionWithPrevSeriaNear.y))
					{
						prevNear = intersectionWithPrevSeriaNear;
						prevFar = intersectionWithPrevSeriaFar;
					}
					else
					{
						//var intersectionWithPrevSeriaNear = t._getIntersectionLines(downNearPoint1, downNearPoint2, upNearPointOld1, upNearPointOld2);
						//var intersectionWithPrevSeriaFar = t._getIntersectionLines(downFarPoint1, downFarPoint2, upFarPointOld1, upFarPointOld2);
					}
					
					return;
				}
				else
				{
					var intersectionWithPrevSeriaNear = t._getIntersectionLines(upNearPoint1, upNearPoint2, downNearPointOld1, downNearPointOld2);
					var intersectionWithPrevSeriaFar = t._getIntersectionLines(upFarPoint1, upFarPoint2, downFarPointOld1, downFarPointOld2);
				}
				
			}
			else if(currentNearOld)
			{
				var intersectionWithPrevSeriaNear = t._getIntersectionLines(downNearPoint1, downNearPoint2, downNearPointOld1, downNearPointOld2);
				var intersectionWithPrevSeriaFar = t._getIntersectionLines(downFarPoint1, downFarPoint2, downFarPointOld1, downFarPointOld2);
			}
			else
			{
				//var intersectionWithPrevSeriaNear = t._getIntersectionLines(upNearPoint1, upNearPoint2, downNearPointOld1, downNearPointOld2)
				//var intersectionWithPrevSeriaFar = t._getIntersectionLines(upFarPoint1, upFarPoint2, downFarPointOld1, downFarPointOld2)
				
				var intersectionWithPrevSeriaNear = t._getIntersectionLines(downNearPoint1, downNearPoint2, upNearPointOld1, upNearPointOld2)
				var intersectionWithPrevSeriaFar = t._getIntersectionLines(downFarPoint1, downFarPoint2, upFarPointOld1, upFarPointOld2)
			}
			
			
			if((!prevNear || intersectionWithPrevSeriaNear && intersectionWithPrevSeriaNear.y < prevNear.y) && intersectionWithPrevSeriaNear && ((currentNear && currentNear.y !== intersectionWithPrevSeriaNear.y) || !currentNear))
			{
				prevNear = intersectionWithPrevSeriaNear;
				prevFar = intersectionWithPrevSeriaFar;
			}
		};
		
		var checkVergeAdd = function()
		{
			var res = true;
			
			//если все точки предыдущей грани выше данной грани, то не рисуем данную грань
			if(upNearPointOld1.y < upNearPoint1.y && upNearPointOld2.y < upNearPoint2.y && downNearPointOld1.y >= upNearPointOld1.y && downNearPointOld2.y >= upNearPointOld2.y && downNearPoint1.y >= upNearPoint1.y && downNearPoint2.y >= upNearPoint2.y)
			{
				res = false;
			}
			else if(upNearPointOld1.y < upNearPoint1.y && upNearPointOld2.y < upNearPoint2.y && downNearPointOld1.y <= downNearPoint1.y && upNearPointOld2.y <= downNearPoint2.y)
			{
				res = false;
			}
			
			return res;
		};
		
		
		for(var n = 0; n < t.usuallyCalculateSeries.length; n++)
		{
			var pointsIn3dOld = t.usuallyCalculateSeries[n];
			
			var upNear1 = 0, downNear1 = 1, upFar1 = 2, downFar1 = 3;
			if(pointsIn3dOld[downNear1][i].y < pointsIn3dOld[upNear1][i].y && pointsIn3dOld[downNear1][i + 1].y < pointsIn3dOld[upNear1][i + 1].y)
			{	
				var upNear1 = 1, downNear1 = 0, upFar1 = 3, downFar1 = 2;
			}
			
			//нижняя ближней плоскости
			downNearPointOld1 = pointsIn3dOld[downNear1][i];
			downNearPointOld2 = pointsIn3dOld[downNear1][i + 1];
			//верхняя ближней плоскости
			upNearPointOld1 = pointsIn3dOld[upNear1][i];
			upNearPointOld2 = pointsIn3dOld[upNear1][i + 1];
			//нижняя дальней плоскости
			downFarPointOld1 = pointsIn3dOld[downFar1][i];
			downFarPointOld2 = pointsIn3dOld[downFar1][i + 1];
			//верхняя дальней плоскости
			upFarPointOld1 = pointsIn3dOld[upFar1][i];
			upFarPointOld2 = pointsIn3dOld[upFar1][i + 1];
			
			if(!downNearPointOld1 || !upNearPointOld1 || !downNearPointOld2 || !upNearPointOld2)
				continue;
			
			
			//проверка на то, нужно ли вообще рисовать грань
			if(checkVergeAdd() === false)
			{
				res = false;
				break;
			}
			
			//1) смотрим на низходящую грань
			if(downNearPoint1.y < downNearPoint2.y || upNearPoint1.y < upNearPoint2.y )
			{
				descendingVerge();
			}
			else
			{
				ascendingVerge();
			}
		}
		
		if((currentNear || prevNear) && res !== false)
			res = {currentNear: currentNear, currentFar: currentFar, prevNear: prevNear, prevFar: prevFar, currentNearOld: currentNearOld, currentFarOld: currentFarOld};
		
		return res;
	},
	
	_calculateRect3DStacked : function(pointsIn3D, gapDepth, perspectiveDepth, seriaNum, allPoints)
	{
		var path;
		var pxToMm = this.chartProp.pxToMM;
		var nullPositionOX = this.chartProp.nullPositionOX;
		var nullPositionOXProject = this.cChartDrawer._convertAndTurnPoint(0, nullPositionOX, gapDepth).y;
		var t = this;
		var chartHeight = this.chartProp.trueHeight;
		var chartWidth = this.chartProp.trueWidth;
		var left = this.chartProp.chartGutter._left;
		var top = this.chartProp.chartGutter._top;
		
		var positions_verge = {front: 0, down: 1, left: 2, right: 3, up: 4, back: 5};
		var upNear1 = 0, downNear1 = 1, upFar1 = 2, downFar1 = 3;
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		
		var calculateAnotherVerge = function(number, isReverse, isFirstPoint)
		{
			if(!isReverse)
			{
				for(var i = 0; i < pointsIn3D[number].length; i++)
				{
					if(i == 0 && isFirstPoint)
						path.moveTo(pointsIn3D[number][i].x / pxToMm * pathW, pointsIn3D[number][i].y / pxToMm * pathH);
					else
						path.lnTo(pointsIn3D[number][i].x / pxToMm * pathW, pointsIn3D[number][i].y / pxToMm * pathH);
				}
			}
			else
			{
				for(var i = pointsIn3D[number].length - 1; i >= 0; i--)
				{
					if(i == pointsIn3D[number].length - 1 && isFirstPoint)
						path.moveTo(pointsIn3D[number][i].x / pxToMm * pathW, pointsIn3D[number][i].y / pxToMm * pathH);
					else
						path.lnTo(pointsIn3D[number][i].x / pxToMm * pathW, pointsIn3D[number][i].y / pxToMm * pathH);
				}
			}
		};
				
		var drawCurrentVerge = function(point1, point2, point3, point4, path)
		{
			if(!point1 || !point2 || !point3 || !point4 || !path)
				return;
				
			path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
			path.lnTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
			path.lnTo(point3.x / pxToMm * pathW, point3.y / pxToMm * pathH);
			path.lnTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
			path.lnTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
		};
		
		//up and down verge calculate
		var calculateUpDownVerge = function(upNear, upFar, position, downNear, downFar)
		{
			var arrayPaths = [];
			for(var i = 0; i < pointsIn3D[upNear].length - 1; i++)
			{
				path  = new Path();
				path.pathH = pathH;
				path.pathW = pathW;
				
				if((position === positions_verge.down) && pointsIn3D[upNear][i].y < nullPositionOXProject && pointsIn3D[upNear][i + 1].y > nullPositionOXProject)
					continue;
				
				var parseVerge = null;
				if((position === positions_verge.up) /*&& seriaNum === allPoints.length - 1*/)
				{
					if(pointsIn3D[downNear1][i].y < pointsIn3D[upNear1][i].y && pointsIn3D[downNear1][i + 1].y < pointsIn3D[upNear1][i + 1].y)
					{
						parseVerge = t._getPrevSeriesIntersection(i, pointsIn3D, true);
						upNear = downNear1;
						upFar = downFar1;
						
						downNear = upNear1;
						downFar = upFar1;
					}
					else
					{
						parseVerge = t._getPrevSeriesIntersection(i, pointsIn3D);
					}
				}
					
				
				if(parseVerge === false)
				{
					path.recalculate(gdLst);
					arrayPaths.push(path);
					return arrayPaths;
				}
				
				if(parseVerge !== null)
				{
					//нисходящая грань
					if((parseVerge.currentNear && pointsIn3D[upNear][i].y < pointsIn3D[downNear][i].y) || (!parseVerge.currentNear && pointsIn3D[downNear][i].y < pointsIn3D[downNear][i+1].y))
					{
						if(parseVerge.currentNear && parseVerge.prevNear && parseVerge.prevFar && parseVerge.currentFarOld && parseVerge.currentNear.x < parseVerge.prevNear.x)
						{
							//рисуем параллепипеды, из которых состоит линия
							drawCurrentVerge(pointsIn3D[upNear][i], parseVerge.currentNear, parseVerge.currentFar, pointsIn3D[upFar][i], path);
							drawCurrentVerge(parseVerge.currentNear, parseVerge.currentFar, parseVerge.prevFar, parseVerge.prevNear, path);
						}
						else if(parseVerge.currentNear && parseVerge.prevNear && parseVerge.prevFar && parseVerge.currentFarOld)
						{
							//рисуем параллепипеды, из которых состоит линия
							drawCurrentVerge(pointsIn3D[upNear][i], parseVerge.prevNear, parseVerge.prevFar, pointsIn3D[upFar][i], path);
						}
						else if(parseVerge.currentNear && parseVerge.prevNear && parseVerge.prevFar)
						{
							//рисуем параллепипеды, из которых состоит линия
							if(parseVerge.prevNear.x < parseVerge.currentNear.x && parseVerge.prevNear.y < parseVerge.currentNear.y)
							{
								drawCurrentVerge(pointsIn3D[upNear][i], parseVerge.prevNear, parseVerge.prevFar, pointsIn3D[upFar][i], path);
							}
							else
							{
								drawCurrentVerge(pointsIn3D[upNear][i], parseVerge.currentNear, parseVerge.currentFar, pointsIn3D[upFar][i], path);
								drawCurrentVerge(parseVerge.currentNear, parseVerge.currentFar, parseVerge.prevFar, parseVerge.prevNear, path);
							}
							
						}
						else if(parseVerge.currentNear)
						{
							//рисуем параллепипеды, из которых состоит линия
							drawCurrentVerge(pointsIn3D[upNear][i], parseVerge.currentNear, parseVerge.currentFar, pointsIn3D[upFar][i], path);
							drawCurrentVerge(parseVerge.currentNear, parseVerge.currentFar, pointsIn3D[downFar][i+1], pointsIn3D[downNear][i+1], path);
						}
						else if(parseVerge.prevNear && parseVerge.prevFar)
						{
							
							if(point1.y < point5.y && point8.y > point4.y)
							{
								drawCurrentVerge(pointsIn3D[upNear][i], parseVerge.prevNear, parseVerge.prevFar, pointsIn3D[upFar][i], path);
							}
							else
							{
								drawCurrentVerge(pointsIn3D[upNear][i], parseVerge.prevNear, parseVerge.prevFar, pointsIn3D[upFar][i], path);
							}
						}
					}
					else//восходящая грань
					{
						/*if(parseVerge.currentNear && parseVerge.prevNear && parseVerge.currentNearOld && parseVerge.prevNear.x !== parseVerge.currentNear.x)
						{
							drawCurrentVerge(pointsIn3D[downNear][i], pointsIn3D[downFar][i], parseVerge.currentFarOld, parseVerge.currentNearOld, path);
							drawCurrentVerge(parseVerge.prevNear, parseVerge.prevFar, pointsIn3D[upFar][i+1], pointsIn3D[upNear][i+1], path);
						}
						else */if(parseVerge.currentNear && parseVerge.prevNear)
						{
							//drawCurrentVerge(parseVerge.prevNear, parseVerge.prevFar, parseVerge.currentFar, parseVerge.currentNear, path);
							//drawCurrentVerge(parseVerge.currentNear, parseVerge.currentFar, pointsIn3D[upFar][i+1], pointsIn3D[upNear][i+1], path);
							if(parseVerge.currentNear.x > parseVerge.prevNear.x)
							{
								drawCurrentVerge(parseVerge.prevNear, parseVerge.prevFar, parseVerge.currentFar, parseVerge.currentNear, path);
								drawCurrentVerge(parseVerge.currentNear, parseVerge.currentFar, pointsIn3D[upFar][i+1], pointsIn3D[upNear][i+1], path);
							}
							else
							{
								drawCurrentVerge(parseVerge.prevNear, parseVerge.prevFar, pointsIn3D[upFar][i+1], pointsIn3D[upNear][i+1], path);
							}
						}
						else if(parseVerge.currentNear)
						{
							//рисуем параллепипеды, из которых состоит линия
							drawCurrentVerge(pointsIn3D[downNear][i], parseVerge.currentNear, parseVerge.currentFar, pointsIn3D[downFar][i], path);
							drawCurrentVerge(parseVerge.currentNear, parseVerge.currentFar, pointsIn3D[upFar][i+1], pointsIn3D[upNear][i+1], path);
						}
						else if(parseVerge.prevNear)
						{
							drawCurrentVerge(parseVerge.prevNear, parseVerge.prevFar, pointsIn3D[upFar][i+1], pointsIn3D[upNear][i+1], path);
						}
					}
					
				}
				else
				{
					
					
					//разрыв параллепипеда в 0
					if(pointsIn3D[upNear][i].y < nullPositionOXProject && pointsIn3D[upNear][i + 1].y > nullPositionOXProject)//грань проходит из + в -
					{	
						if(point8.y < point4.y)//если линии идут параллельно
						{
							var y1 = t.cChartDrawer._convertAndTurnPoint(pointsIn3D[upNear][i].x * pxToMm, nullPositionOX, gapDepth).y;
					
							var a = pointsIn3D[upNear][i].y - pointsIn3D[upNear][i + 1].y;
							var b = pointsIn3D[upNear][i + 1].x - pointsIn3D[upNear][i].x;
							var c = pointsIn3D[upNear][i].x * pointsIn3D[upNear][i + 1].y - pointsIn3D[upNear][i + 1].x * pointsIn3D[upNear][i].y;
							var x1 = -(b * y1 + c) / a;
							
							var y2 = t.cChartDrawer._convertAndTurnPoint(pointsIn3D[upNear][i].x * pxToMm, nullPositionOX, perspectiveDepth + gapDepth).y;
							
							var a = pointsIn3D[upFar][i].y - pointsIn3D[upFar][i + 1].y;
							var b = pointsIn3D[upFar][i + 1].x - pointsIn3D[upFar][i].x;
							var c = pointsIn3D[upFar][i].x * pointsIn3D[upFar][i + 1].y - pointsIn3D[upFar][i + 1].x * pointsIn3D[upFar][i].y;
							var x2 = -(b * y2 + c) / a;
							
							//рисуем параллепипеды, из которых состоит линия
							drawCurrentVerge(pointsIn3D[upNear][i], x1, x2, pointsIn3D[upFar][i], path);
						}
						else if(point1.y < point5.y && point8.y > point4.y)
						{
							drawCurrentVerge(pointsIn3D[downNear][i], pointsIn3D[downNear][i + 1], pointsIn3D[downFar][i + 1], pointsIn3D[downFar][i], path);
						}
						else
						{
							var y1 = t.cChartDrawer._convertAndTurnPoint(pointsIn3D[upNear][i].x * pxToMm, nullPositionOX, gapDepth).y;
					
							var a = pointsIn3D[upNear][i].y - pointsIn3D[upNear][i + 1].y;
							var b = pointsIn3D[upNear][i + 1].x - pointsIn3D[upNear][i].x;
							var c = pointsIn3D[upNear][i].x * pointsIn3D[upNear][i + 1].y - pointsIn3D[upNear][i + 1].x * pointsIn3D[upNear][i].y;
							var x1 = -(b * y1 + c) / a;
							
							var y2 = t.cChartDrawer._convertAndTurnPoint(pointsIn3D[upNear][i].x * pxToMm, nullPositionOX, perspectiveDepth + gapDepth).y;
							
							var a = pointsIn3D[upFar][i].y - pointsIn3D[upFar][i + 1].y;
							var b = pointsIn3D[upFar][i + 1].x - pointsIn3D[upFar][i].x;
							var c = pointsIn3D[upFar][i].x * pointsIn3D[upFar][i + 1].y - pointsIn3D[upFar][i + 1].x * pointsIn3D[upFar][i].y;
							var x2 = -(b * y2 + c) / a;
							
							//рисуем параллепипеды, из которых состоит линия
							drawCurrentVerge(pointsIn3D[upNear][i], x1, x2, pointsIn3D[upFar][i], path);
						}
						
					}
					else if(pointsIn3D[upNear][i].y > nullPositionOXProject && pointsIn3D[upNear][i + 1].y < nullPositionOXProject)//грань проходит из - в +s
					{	
						
					}
					else
					{
						//рисуем параллепипеды, из которых состоит линия
						drawCurrentVerge(pointsIn3D[upNear][i], pointsIn3D[upNear][i + 1], pointsIn3D[upFar][i + 1], pointsIn3D[upFar][i], path);
					}
					
				}
				
				path.recalculate(gdLst);
				arrayPaths.push(path);
			}
			
			return arrayPaths;
		};
		
		//for define VisibleVerge, as in bar charts
		var point1 = pointsIn3D[downNear1][0];
		var point2 = pointsIn3D[downFar1][0];
		var point3 = pointsIn3D[downFar1][pointsIn3D[downFar1].length - 1];
		var	point4 = pointsIn3D[downNear1][pointsIn3D[downNear1].length - 1];
		
		var	point5 = pointsIn3D[upNear1][0];
		var	point6 = pointsIn3D[upFar1][0];
		var	point7 = pointsIn3D[upFar1][pointsIn3D[upFar1].length - 1];
		var	point8 = pointsIn3D[upNear1][pointsIn3D[upNear1].length - 1]
		
		var allVergeLessNull = false;
		if(point1.y < nullPositionOXProject && point2.y < nullPositionOXProject && point3.y < nullPositionOXProject && point4.y < nullPositionOXProject && point5.y < nullPositionOXProject && point6.y < nullPositionOXProject && point7.y < nullPositionOXProject && point8.y < nullPositionOXProject)
			allVergeLessNull = true;
		
		
		var paths = [], arrayPaths = null;
		//front
		paths[0] = null;
		if(this._isVisibleVerge3D(point5, point1, point4))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			
			calculateAnotherVerge(upNear1, false, true);
			calculateAnotherVerge(downNear1, true);
			path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
			
			path.recalculate(gdLst);
			paths[0] = path;
		}
		
		//down
		paths[1] = null;
		if(this._isVisibleVerge3D(point4, point1, point2) && false)
		{
			arrayPaths = calculateUpDownVerge(downNear1, downFar1, positions_verge.down);
			paths[1] = arrayPaths;
		}
		
		//left
		paths[2] = null;
		if(this._isVisibleVerge3D(point2, point1, point5) && false)
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			
			path.moveTo(pointsIn3D[0][0].x / pxToMm * pathW, pointsIn3D[0][0].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[1][0].x / pxToMm * pathW, pointsIn3D[1][0].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[3][0].x / pxToMm * pathW, pointsIn3D[3][0].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[2][0].x / pxToMm * pathW, pointsIn3D[2][0].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[0][0].x / pxToMm * pathW, pointsIn3D[0][0].y / pxToMm * pathH);
			
			path.recalculate(gdLst);
			paths[2] = path;
		}
		
		//right
		paths[3] = null;
		if(this._isVisibleVerge3D(point8, point4, point3))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			
			path.moveTo(pointsIn3D[0][pointsIn3D[0].length - 1].x / pxToMm * pathW, pointsIn3D[0][pointsIn3D[0].length - 1].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[1][pointsIn3D[1].length - 1].x / pxToMm * pathW, pointsIn3D[1][pointsIn3D[1].length - 1].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[3][pointsIn3D[3].length - 1].x / pxToMm * pathW, pointsIn3D[3][pointsIn3D[3].length - 1].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[2][pointsIn3D[2].length - 1].x / pxToMm * pathW, pointsIn3D[2][pointsIn3D[2].length - 1].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[0][pointsIn3D[0].length - 1].x / pxToMm * pathW, pointsIn3D[0][pointsIn3D[0].length - 1].y / pxToMm * pathH);
			
			path.recalculate(gdLst);
			paths[3] = path;
		}
		
		//up
		paths[4] = null;
		if(this._isVisibleVerge3D(point6, point5, point8))
		{
			//если перевёрнута грань
			/*if(pointsIn3D[downNear1][0].y < pointsIn3D[upNear1][0].y && pointsIn3D[downNear1][1].y < pointsIn3D[upNear1][1].y)
			{
				arrayPaths = calculateUpDownVerge(downNear1, downFar1, positions_verge.up, upNear1, upFar1);
			}
			else
			{*/
				arrayPaths = calculateUpDownVerge(upNear1, upFar1, positions_verge.up, downNear1, downFar1);
			//}
			
			paths[4] = arrayPaths;
		}
		
		
		//back
		paths[5] = null;
		if(this._isVisibleVerge3D(point3, point2, point6))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			
			path.recalculate(gdLst);
			paths[5] = path;
		}
		
		this.usuallyCalculateSeries[seriaNum] = pointsIn3D;
		
		return paths;
	}, 
	
	
	
	
	_calculateRect3D : function(pointsIn3D)
	{
		var path;
		var pxToMm = this.chartProp.pxToMM;
		
		var drawVerge = function(number, isReverse, isFirstPoint)
		{
			if(!isReverse)
			{
				for(var i = 0; i < pointsIn3D[number].length; i++)
				{
					if(i == 0 && isFirstPoint)
						path.moveTo(pointsIn3D[number][i].x / pxToMm * pathW, pointsIn3D[number][i].y / pxToMm * pathH);
					else
						path.lnTo(pointsIn3D[number][i].x / pxToMm * pathW, pointsIn3D[number][i].y / pxToMm * pathH);
				}
			}
			else
			{
				for(var i = pointsIn3D[number].length - 1; i >= 0; i--)
				{
					if(i == pointsIn3D[number].length - 1 && isFirstPoint)
						path.moveTo(pointsIn3D[number][i].x / pxToMm * pathW, pointsIn3D[number][i].y / pxToMm * pathH);
					else
						path.lnTo(pointsIn3D[number][i].x / pxToMm * pathW, pointsIn3D[number][i].y / pxToMm * pathH);
				}
			}
		};
		
		var drawVerge1 = function(number, number1)
		{
			var arrayPaths = [];
			for(var i = 0; i < pointsIn3D[number].length - 1; i++)
			{
				path  = new Path();
				path.pathH = pathH;
				path.pathW = pathW;
				//рисуем параллепипеды, из которых состоит линия
				path.moveTo(pointsIn3D[number][i].x / pxToMm * pathW, pointsIn3D[number][i].y / pxToMm * pathH);
				path.lnTo(pointsIn3D[number][i + 1].x / pxToMm * pathW, pointsIn3D[number][i + 1].y / pxToMm * pathH);
				path.lnTo(pointsIn3D[number1][i + 1].x / pxToMm * pathW, pointsIn3D[number1][i + 1].y / pxToMm * pathH);
				path.lnTo(pointsIn3D[number1][i].x / pxToMm * pathW, pointsIn3D[number1][i].y / pxToMm * pathH);
				path.lnTo(pointsIn3D[number][i].x / pxToMm * pathW, pointsIn3D[number][i].y / pxToMm * pathH);
				path.recalculate(gdLst);
				arrayPaths.push(path);
			}
			return arrayPaths;
		};
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var paths = [];
		var upNear = 0, downNear = 1, upFar = 2, downFar = 3;
		
		//for define VisibleVerge, as in bar charts
		var point1 = pointsIn3D[downNear][0];
		var point2 = pointsIn3D[downFar][0];
		var point3 = pointsIn3D[downFar][pointsIn3D[downFar].length - 1];
		var	point4 = pointsIn3D[downNear][pointsIn3D[downNear].length - 1];
		
		var	point5 = pointsIn3D[upNear][0];
		var	point6 = pointsIn3D[upFar][0];
		var	point7 = pointsIn3D[upFar][pointsIn3D[upFar].length - 1];
		var	point8 = pointsIn3D[upNear][pointsIn3D[upNear].length - 1]
		
		
		//front
		paths[0] = null;
		if(this._isVisibleVerge3D(point5, point1, point4))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			
			drawVerge(upNear, false, true);
			drawVerge(downNear, true);
			path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
			
			path.recalculate(gdLst);
			paths[0] = path;
		}
		
		//down
		paths[1] = null;
		if(this._isVisibleVerge3D(point4, point1, point2))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			
			path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
			drawVerge(downFar);
			drawVerge(downNear, true);
			
			path.recalculate(gdLst);
			paths[1] = path;
		}
		
		//left
		paths[2] = null;
		if(this._isVisibleVerge3D(point2, point1, point5))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			
			path.moveTo(pointsIn3D[0][0].x / pxToMm * pathW, pointsIn3D[0][0].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[1][0].x / pxToMm * pathW, pointsIn3D[1][0].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[3][0].x / pxToMm * pathW, pointsIn3D[3][0].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[2][0].x / pxToMm * pathW, pointsIn3D[2][0].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[0][0].x / pxToMm * pathW, pointsIn3D[0][0].y / pxToMm * pathH);
			
			path.recalculate(gdLst);
			paths[2] = path;
		}
		
		//right
		paths[3] = null;
		if(this._isVisibleVerge3D(point8, point4, point3))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			
			path.moveTo(pointsIn3D[0][pointsIn3D[0].length - 1].x / pxToMm * pathW, pointsIn3D[0][pointsIn3D[0].length - 1].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[1][pointsIn3D[1].length - 1].x / pxToMm * pathW, pointsIn3D[1][pointsIn3D[1].length - 1].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[3][pointsIn3D[3].length - 1].x / pxToMm * pathW, pointsIn3D[3][pointsIn3D[3].length - 1].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[2][pointsIn3D[2].length - 1].x / pxToMm * pathW, pointsIn3D[2][pointsIn3D[2].length - 1].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[0][pointsIn3D[0].length - 1].x / pxToMm * pathW, pointsIn3D[0][pointsIn3D[0].length - 1].y / pxToMm * pathH);
			
			path.recalculate(gdLst);
			paths[3] = path;
		}
		
		//up
		paths[4] = null;
		if(this._isVisibleVerge3D(point6, point5, point8))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			
			//path.moveTo(pointsIn3D[0][0].x / pxToMm * pathW, pointsIn3D[0][0].y / pxToMm * pathH);
			
			/*path.lnTo(pointsIn3D[1][pointsIn3D[1].length - 1].x / pxToMm * pathW, pointsIn3D[1][pointsIn3D[1].length - 1].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[3][pointsIn3D[3].length - 1].x / pxToMm * pathW, pointsIn3D[3][pointsIn3D[3].length - 1].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[2][pointsIn3D[2].length - 1].x / pxToMm * pathW, pointsIn3D[2][pointsIn3D[2].length - 1].y / pxToMm * pathH);
			path.lnTo(pointsIn3D[0][pointsIn3D[0].length - 1].x / pxToMm * pathW, pointsIn3D[0][pointsIn3D[0].length - 1].y / pxToMm * pathH);*/
			
			//drawVerge(upFar);
			//drawVerge(upNear, true);
			
			var arrayPaths = drawVerge1(upNear, upFar);
			
			//path.recalculate(gdLst);
			paths[4] = arrayPaths;
		}
		
		
		//unfront
		paths[5] = null;
		if(this._isVisibleVerge3D(point3, point2, point6))
		{
			path  = new Path();
			path.pathH = pathH;
			path.pathW = pathW;
			
			drawVerge(upFar, false, true);
			drawVerge(downFar, true);
			path.lnTo(pointsIn3D[upFar][0].x / pxToMm * pathW, pointsIn3D[upFar][0].y / pxToMm * pathH);
			
			path.recalculate(gdLst);
			paths[5] = path;
		}
		
		return paths;
	}, 
	
	_isVisibleVerge3D: function(k, n, m)
	{
		//TODO переделать!
		if(this.chartProp.subType !== "normal")
			return true;
		//roberts method - calculate normal
		var aX = n.x * m.y - m.x * n.y;
		var bY = - (k.x * m.y - m.x * k.y);
		var cZ = k.x * n.y - n.x * k.y;
		var visible = aX + bY + cZ;
		
		return visible < 0 ? true : false
	}
};



	/** @constructor */
function drawHBarChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cShapeDrawer = null;
	this.paths = {};
	this.sortZIndexPaths = [];
	
	this.summBarVal = [];
}

drawHBarChart.prototype =
{
    constructor: drawHBarChart,
	
	reCalculate : function(chartsDrawer)
	{
		this.paths = {};
		this.summBarVal = [];
		
		this.sortZIndexPaths = [];
		
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this._recalculateBars();
	},
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		if(this.cChartDrawer.nDimensionCount === 3)
			this._DrawBars3D();
		else
			this._drawBars();
	},
	
	_recalculateBars: function (/*isSkip*/)
    {
        //соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.valAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.catAx.yPoints;
		
		var xaxispos      = this.chartProp.xaxispos;
		var heightGraph    = this.chartProp.heightCanvas - this.chartProp.chartGutter._top - this.chartProp.chartGutter._bottom;
		
		var defaultOverlap = (this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer") ? 100 : 0;
		var overlap        = this.cChartSpace.chart.plotArea.chart.overlap ? this.cChartSpace.chart.plotArea.chart.overlap : defaultOverlap;
		var ptCount        = this.cChartDrawer.getPtCount(this.chartProp.series);
        var height         = heightGraph / ptCount;
		
		var gapWidth = this.cChartSpace.chart.plotArea.chart.gapWidth ? this.cChartSpace.chart.plotArea.chart.gapWidth : 150;
		
		var individualBarHeight = height / (this.chartProp.seriesCount - (this.chartProp.seriesCount - 1) * (overlap / 100) + gapWidth / 100);
		var widthOverLap = individualBarHeight * (overlap / 100);
		var hmargin = (gapWidth / 100 * individualBarHeight) / 2;
		
		var width, startX, startY, diffYVal, val, paths, seriesHeight = [], seria, startXColumnPosition, startYPosition, newStartX, newStartY, idx, seriesCounter = 0, numCache;
		
		//for 3d
		var point1, point2, point3, point4, point5, point6, point7, point8;
		var x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, x5, y5, z5, x6, y6, z6, x7, y7, z7, x8, y8, z8;
		var perspectiveDepth, gapDepth, DiffGapDepth;
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
			//сдвиг по OZ в глубину
			gapDepth = this.cChartSpace.chart.plotArea.chart.gapDepth != null ? this.cChartSpace.chart.plotArea.chart.gapDepth : globalGapDepth;
			perspectiveDepth = perspectiveDepth / (gapDepth / 100 + 1);
			DiffGapDepth = perspectiveDepth * (gapDepth / 2) / 100;
		}		
		
		for (var i = 0; i < this.chartProp.series.length; i++) 
		{
			numCache = this.chartProp.series[i].val.numRef ? this.chartProp.series[i].val.numRef.numCache : this.chartProp.series[i].val.numLit;
			
			if(!numCache || this.chartProp.series[i].isHidden)
			{
				continue;
			}
			
			seria = this.chartProp.series[i].val.numRef.numCache.pts;
			seriesHeight[i] = [];
			
			
			var isValMoreZero = false;
			var isValLessZero = 0;
			for (var j = 0; j < seria.length; j++) 
			{			
				//стартовая позиция колонки Y(+ высота с учётом поправок на накопительные диаграммы)
				val = parseFloat(seria[j].val);
				
				if(val > 0)
					isValMoreZero = true;
				else if(val < 0)
					isValLessZero++;
				
				if(this.cChartSpace.chart.plotArea.valAx && this.cChartSpace.chart.plotArea.valAx.scaling.logBase)
					val = this.cChartDrawer.getLogarithmicValue(val, this.cChartSpace.chart.plotArea.valAx.scaling.logBase, xPoints);
				idx = seria[j].idx != null ? seria[j].idx : j;	
				
				
				startXColumnPosition = this._getStartYColumnPosition(seriesHeight, idx, i, val, xPoints);
				startX = startXColumnPosition.startY / this.chartProp.pxToMM;
				width = startXColumnPosition.width / this.chartProp.pxToMM;

				seriesHeight[i][idx] = startXColumnPosition.width;
				
				
				//стартовая позиция колонки Y
				if(this.cChartSpace.chart.plotArea.catAx.scaling.orientation == ORIENTATION_MIN_MAX)
				{
					if(yPoints[1] && yPoints[1].pos)
						startYPosition = yPoints[idx].pos + Math.abs((yPoints[1].pos - yPoints[0].pos) / 2);
					else
						startYPosition = yPoints[idx].pos + Math.abs(yPoints[0].pos - this.cChartSpace.chart.plotArea.valAx.posY);
				}	
				else
				{
					if(yPoints[1] && yPoints[1].pos)
						startYPosition = yPoints[idx].pos - Math.abs((yPoints[1].pos - yPoints[0].pos) / 2);
					else
						startYPosition = yPoints[idx].pos - Math.abs(yPoints[0].pos - this.cChartSpace.chart.plotArea.valAx.posY);
				}
					
				
				if(this.cChartSpace.chart.plotArea.catAx.scaling.orientation == ORIENTATION_MIN_MAX)
				{
					if(seriesCounter == 0)
						startY = startYPosition * this.chartProp.pxToMM - hmargin - seriesCounter * (individualBarHeight);
					else
						startY = startYPosition * this.chartProp.pxToMM - hmargin - (seriesCounter * individualBarHeight - seriesCounter * widthOverLap);
				}
				else
				{
					if(i == 0)
						startY = startYPosition * this.chartProp.pxToMM + hmargin + seriesCounter * (individualBarHeight);
					else
						startY = startYPosition * this.chartProp.pxToMM + hmargin + (seriesCounter * individualBarHeight - seriesCounter * widthOverLap);
				}

				newStartY = startY;
				if(this.cChartSpace.chart.plotArea.catAx.scaling.orientation != ORIENTATION_MIN_MAX)
				{
					newStartY = startY + individualBarHeight;
				}
				
				newStartX = startX;
				if(this.cChartSpace.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX && (this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked"))
				{
					newStartX = startX - width;
				}
				
				if(this.cChartDrawer.nDimensionCount === 3)
				{
					width = width * this.chartProp.pxToMM;
					newStartX  = newStartX * this.chartProp.pxToMM;
					newStartY = newStartY - individualBarHeight;
					
					//рассчитываем 8 точек для каждого столбца
					x1 = newStartX, y1 = newStartY, z1 = DiffGapDepth;
					x2 = newStartX, y2 = newStartY, z2 = perspectiveDepth + DiffGapDepth;
					x3 = newStartX + width, y3 = newStartY, z3 = perspectiveDepth + DiffGapDepth;
					x4 = newStartX + width, y4 = newStartY, z4 = DiffGapDepth;
					x5 = newStartX, y5 = newStartY + individualBarHeight, z5 = DiffGapDepth;
					x6 = newStartX, y6 = newStartY + individualBarHeight, z6 = perspectiveDepth + DiffGapDepth;
					x7 = newStartX + width, y7 = newStartY + individualBarHeight, z7 = perspectiveDepth + DiffGapDepth;
					x8 = newStartX + width, y8 = newStartY + individualBarHeight, z8 = DiffGapDepth;
					
					
					//поворот относительно осей
					point1 = this.cChartDrawer._convertAndTurnPoint(x1, y1, z1);
					point2 = this.cChartDrawer._convertAndTurnPoint(x2, y2, z2);
					point3 = this.cChartDrawer._convertAndTurnPoint(x3, y3, z3);
					point4 = this.cChartDrawer._convertAndTurnPoint(x4, y4, z4);
					point5 = this.cChartDrawer._convertAndTurnPoint(x5, y5, z5);
					point6 = this.cChartDrawer._convertAndTurnPoint(x6, y6, z6);
					point7 = this.cChartDrawer._convertAndTurnPoint(x7, y7, z7);
					point8 = this.cChartDrawer._convertAndTurnPoint(x8, y8, z8);
					
					paths = this.cChartDrawer.calculateRect3D(point1, point2, point3, point4, point5, point6, point7, point8, val);
					
					//расскомментируем, чтобы включить старую схему отрисовки(+ переименовать функции _DrawBars3D -> _DrawBars3D2)
					//this.sortZIndexPaths.push({seria: i, point: idx, paths: paths, x: point1.x, y: point1.y, zIndex: point1.z});
					
					//width = this.chartProp.widthCanvas - this.chartProp.chartGutter._left - this.chartProp.chartGutter._right;
					
					
					//TODO delete after unused code
					var calculateDistance = function(point1, point2)
					{
						var res = Math.sqrt(Math.pow(point2.x - point1.x , 2) + Math.pow(point2.y - point1.y , 2) + Math.pow(point2.z - point1.z , 2));
						return res;
					};
					
					var getMinPoint = function(point1, point2, point3, point4)
					{
						var arrPoints = [point1, point2, point3, point4];
						
						var minPoint = null;
						for(var i = 0; i < arrPoints.length; i++)
						{
							if(null === minPoint)
							{
								minPoint = arrPoints[i];
							}
							else
							{
								if(arrPoints[i].z > minPoint.z)
								{
									minPoint = arrPoints[i];
								}
							}
						}
						
						return minPoint;
					};
					
					
					var getMidPoint = function(point1, point2, point3, point4)
					{
						var res = (point1.z + point2.z + point3.z ) / 3;
						
						return res;
					};
					
					var widthScreen = this.chartProp.widthCanvas - this.chartProp.chartGutter._right;
					var centralViewPoint = {x: widthScreen / 2, y: heightGraph + this.chartProp.chartGutter._bottom, z: 0};
					
					//уравнение плоскости
					var getPlainEquation2 = function(point1, point2, point3, point4)
					{
						var x0 = point1.x, y0 = point1.y, z0 = point1.z;
						var x1 = point2.x, y1 = point2.y, z1 = point2.z;
						var x2 = point3.x, y1 = point3.y, z1 = point3.z;
						
						
						var tempA = ((y1 - y0) * (z2 - z0) - (y2 - y0) * (z1 - z0));
						var tempB = ((x1 - x0) * (z2 - z0) - (x2 - x0) * (z1 - z0));
						var tempC = ((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0));
						
						/*(x - x0) * tempA - (y - y0) * tempB  + (z - z0) * tempC = 0;
						x * tempA - x0 * tempA - y * tempB + y0 * tempB + z * tempC - z0 * tempC = 0;
						x * tempA - y * tempB + z * tempC + (y0 * tempB - x0 * tempA - z0 * tempC)*/
						
						var a = tempA;
						var b = tempB;
						var c = tempC;
						var d = y0 * tempB - x0 * tempA - z0 * tempC;
						
						
						var test1 = a * point1.x + b * point1.y + c * point1.z + d;
						var test2 = a * point2.x + b * point2.y + c * point2.z + d
						var test3 = a * point3.x + b * point3.y + c * point3.z + d
						var test4 = a * point4.x + b * point4.y + c * point4.z + d
						
						if(!(test1 === 0 && test2 === 0 && test3 === 0 && test4 === 0))
						{
							console.log("asd");
						}
						
						return {a: a, b: b, c: c, d: d};
					};	
					
					//уравнение плоскости
					var getPlainEquation = function(point1, point2, point3, point4)
					{
						var x1 = point1.x, y1 = point1.y, z1 = point1.z;
						var x2 = point2.x, y2 = point2.y, z2 = point2.z;
						var x3 = point3.x, y3 = point3.y, z3 = point3.z;
						
						var x21 = x2 - x1;
						var y21 = y2 - y1;
						var z21 = z2 - z1;
						
						var x31 = x3 - x1;
						var y31 = y3 - y1;
						var z31 = z3 - z1;
						
						/*
							
						(x - x1)*(y21 * z31 - x21 * y31) - (y - y1)*(x21 * z31 - z21 * x31) + (z - z1)(x21 * y31 - y21 * x31) 
						
						*/
						
						var tempA = y21 * z31 - z21 * y31;
						
						var tempB = x21 * z31 - z21 * x31;
						
						var tempC = x21 * y31 - y21 * x31;
						
						/*(x - x1)*(tempA) - (y - y1)*(tempB) + (z - z1)(tempC)
						
						x * tempA - x1 * tempA - y * tempB + y1 * tempB + z * tempC - z1 * tempC*/
						
						var a = tempA;
						var b = tempB;
						var c = tempC;
						var d =  y1 * tempB - x1 * tempA - z1 * tempC;
							
						return {a: a, b: b, c: c, d: d};
					};					
						
						
					
					var plainEquation1 = getPlainEquation(point1, point4, point8, point5);
					var plainEquation2 = getPlainEquation(point1, point2, point3, point4);
					var plainEquation3 = getPlainEquation(point1, point2, point6, point5);
					var plainEquation4 = getPlainEquation(point4, point8, point7, point3);
					var plainEquation5 = getPlainEquation(point5, point6, point7, point8);
					var plainEquation6 = getPlainEquation(point6, point2, point3, point7);
					var plainEquations = [plainEquation1, plainEquation2, plainEquation3, plainEquation4, plainEquation5, plainEquation6];
					
					
					var tempWidth = width /*< 0 ? -50 : 50*/;
					var controlPoint1 = this.cChartDrawer._convertAndTurnPoint(x5 + tempWidth / 2, y5 - individualBarHeight / 2, z5);
					var controlPoint2 = this.cChartDrawer._convertAndTurnPoint(x5 + tempWidth / 2, y5, z5 + perspectiveDepth / 2);
					var controlPoint3 = this.cChartDrawer._convertAndTurnPoint(x5, y5 - individualBarHeight / 2, z5 + perspectiveDepth / 2);
					var controlPoint4 = this.cChartDrawer._convertAndTurnPoint(x8, y8 - individualBarHeight / 2, z8 + perspectiveDepth / 2);
					var controlPoint5 = this.cChartDrawer._convertAndTurnPoint(x1 + tempWidth / 2 , y1, z1 + perspectiveDepth / 2);
					var controlPoint6 = this.cChartDrawer._convertAndTurnPoint(x6 + tempWidth / 2 , y6 - individualBarHeight / 2, z6);
					
					var distance0 = calculateDistance(centralViewPoint, controlPoint1);
					var distance1 = calculateDistance(centralViewPoint, controlPoint2);
					var distance2 = calculateDistance(centralViewPoint, controlPoint3);
					var distance3 = calculateDistance(centralViewPoint, controlPoint4);
					var distance4 = calculateDistance(centralViewPoint, controlPoint5);
					var distance5 = calculateDistance(centralViewPoint, controlPoint6);
					
					
					var midPoint0 = getMidPoint(point1, point4, point8, point5);
					var midPoint1 = getMidPoint(point1, point2, point3, point4);
					var midPoint2 = getMidPoint(point1, point2, point6, point5);
					var midPoint3 = getMidPoint(point4, point8, point7, point3);
					var midPoint4 = getMidPoint(point5, point6, point7, point8);
					var midPoint5 = getMidPoint(point6, point2, point3, point7);
					var midPaths = [midPoint0, midPoint1, midPoint2, midPoint3, midPoint4, midPoint5];
						
					
					var testPoint0 = getMinPoint(point1, point4, point8, point5);
					var testPoint1 = getMinPoint(point1, point2, point3, point4);
					var testPoint2 = getMinPoint(point1, point2, point6, point5);
					var testPoint3 = getMinPoint(point4, point8, point7, point3);
					var testPoint4 = getMinPoint(point5, point6, point7, point8);
					var testPoint5 = getMinPoint(point6, point2, point3, point7);
					var testPaths = [testPoint0, testPoint1, testPoint2, testPoint3, testPoint4, testPoint5];
					
					
					
					var arrPoints = [[point1, point4, point8, point5], [point1, point2, point3, point4], [point1, point2, point6, point5], [point4, point8, point7, point3], [point5, point6, point7, point8], [point6, point2, point3, point7]];
					
					var sortPaths = [controlPoint1, controlPoint2, controlPoint3, controlPoint4, controlPoint5, controlPoint6];
					
					var distancePaths = [distance0, distance1, distance2, distance3, distance4, distance5];
					
					for(var k = 0; k < paths.length; k++)
					{
						if(null === paths[k])
							continue;
						var zIndex = midPaths[k];
						
						
						
						this.sortZIndexPaths.push({seria: i, point: idx, verge: k, paths: paths[k], x: sortPaths[k].x, y: sortPaths[k].y, zIndex: zIndex, points: arrPoints[k], plainEquation: plainEquations[k]});
					}
				}
				else
				{
					paths = this._calculateRect(newStartX, newStartY / this.chartProp.pxToMM, width, individualBarHeight / this.chartProp.pxToMM);
				}

				
				if(!this.paths.series)
					this.paths.series = [];
				if(!this.paths.series[i])
					this.paths.series[i] = [];

				if(height != 0)
					this.paths.series[i][idx] = paths;
			}
			
			if(seria.length)
				seriesCounter++;
        }
		
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			
			//уравнение плоскости
			var getLineEquation = function(point1, point2)
			{
				var x0 = point1.x, y0 = point1.y, z0 = point1.z;
				var x1 = point2.x, y1 = point2.y, z1 = point2.z;
				
				
				/*x - x0 	 =  	y - y0 	 =  	z - z0
				x1 - x0 			y1 - y0 		z1 - z0
				
					l 					m 				n
				*/
				
				var l = x1 - x0;
				var m = y1 - y0;
				var n = z1 - z0;
				
				//check line
				var x123 = (point1.x - x0) / (x1 - x0);
				var y123 = (point1.y - y0) / (y1 - y0);
				var z123 = (point1.z - z0) / (z1 - z0);
				
				var x321 = (point2.x - x0) / (x1 - x0);
				var y321 = (point2.y - y0) / (y1 - y0);
				var z321 = (point2.z - z0) / (z1 - z0);
				
				
				
				return {l: l, m: m, n: n, x1: x0, y1: y0, z1: z0};
			};
			
			//уравнение плоскости
			var isIntersectionPlainAndLine1 = function(plainEquation, lineEquation)
			{
				var A = plainEquation.a;
				var B = plainEquation.b;
				var C = plainEquation.c;
				var D = plainEquation.d;
				
				var l = lineEquation.l;
				var m = lineEquation.m;
				var n = lineEquation.n;
				var x1 = lineEquation.x1;
				var y1 = lineEquation.y1;
				var z1 = lineEquation.z1;
				
				var res = A * l + B * m + C * n;
				
				var z = null;
				if(res !== 0)
				{
					/*
					x - x1 	 =  	y - y1 	 =  	z - z1
					   l 			  m 			  n
					
					x = l * t - x1
					y = m * t - y1
					z = n * t - z1
					==>
					(l * t - x1; m * t - y1; n * t - z1)
					
					A * x + B * y + C * z + D = 0
					==>
					A * (l * t - x1) + B * (m * t - y1) + C * (n * t - z1) + D = 0
					
					==>
					
					A * l * t - A * x1 + B * m * t - B * y1 + C * n * t - C * z1 + D = 0
					A * l * t + B * m * t + C * n * t = A * x1 + B * y1 + C * z1 - D
					
					==>
					
					t = (A * x1 + B * y1 + C * z1 - D) / (A * l + B * m + C * n)
					z = n * t - z1;
					*/
					
					var t = (B * y1 + C * z1 - D + A * x1) / (A * l + B * m + C * n);
					
					var x = l * t - x1;
					var y = m * t - y1;
					z = n * t - z1;
				}
				
				return z;
			};
			
			
			//уравнение плоскости
			var isIntersectionPlainAndLine = function(plainEquation, lineEquation)
			{
				var A = plainEquation.a;
				var B = plainEquation.b;
				var C = plainEquation.c;
				var D = plainEquation.d;
				
				var l = lineEquation.l;
				var m = lineEquation.m;
				var n = lineEquation.n;
				var x1 = lineEquation.x1;
				var y1 = lineEquation.y1;
				var z1 = lineEquation.z1;
				
				
				//x - x1		y - y1		z - z1
				//			=			=			t
				//  l			  m		 	  n
				
				/*x = t * l + x1
				y = t * m + y1
				z = t * n + z1*/
				
				
				/*A * x + B * y + C * z + D = 0
				
				A * (t * l + x1) + B * (t * m + y1) + C * (t * n + z1) + D = 0;
				
				A * t * l + A * x1 + B * t * m + B * y1 + C * t * n + C * z1 + D
				
				A * t * l + B * t * m + C * t * n       + A * x1 + B * y1 + C * z1 + D*/
				
				var t = -(A * x1 + B * y1 + C * z1 + D) / (A * l + B * m + C * n); 
				
				var x = t * l + x1;
				var y = t * m + y1;
				var z = t * n + z1;
				
				return {x: x, y: y, z: z};
			};
			
			var widthScreen = this.chartProp.widthCanvas - this.chartProp.chartGutter._right;
			var centralViewPoint = {x: widthScreen / 2 - this.cChartDrawer.processor3D.cameraDiffX, y: heightGraph / 2 + this.chartProp.chartGutter._bottom, z: -this.cChartDrawer.processor3D.cameraDiffZ};
			
			
			var firstVerges = [];
			var lastVerges = [];
			
			
			var getMinMaxPoints = function(points)
			{
				var minX, maxX, minY, maxY, minZ, maxZ;
				
				for(var n = 0; n < points.length; n++)
				{
					if(0 === n)
					{
						minX = points[0].x;
						maxX = points[0].x;
						minY = points[0].y;
						maxY = points[0].y;
						minZ = points[0].z;
						maxZ = points[0].z;
					}
					else
					{
						if(points[n].x < minX)
						{
							minX = points[n].x;
						}
						
						if(points[n].x > maxX)
						{
							maxX = points[n].x;
						}
						
						if(points[n].y < minY)
						{
							minY = points[n].y;
						}
						
						if(points[n].y > maxY)
						{
							maxY = points[n].y;
						}
						
						if(points[n].z < minZ)
						{
							minZ = points[n].z;
						}
						
						if(points[n].z > maxZ)
						{
							maxZ = points[n].z;
						}
					}
				}
				
				return {minX: minX, maxX: maxX, minY : minY, maxY: maxY, minZ: minZ, maxZ: maxZ};
			};
			
			var t = this;
			var isNotIntersectionVergesAndLine = function(lineEqucation, pointFromVerge)
			{
				var res = true;
				
				for(var k = 0; k < t.sortZIndexPaths.length; k++)
				{
					var plainEqucation = t.sortZIndexPaths[k].plainEquation;
					
					var nIntersectionPlainAndLine = isIntersectionPlainAndLine(plainEqucation ,lineEqucation);
					if(null !== nIntersectionPlainAndLine && nIntersectionPlainAndLine.z < pointFromVerge.z)
					{
						var minMaxpoints = getMinMaxPoints(t.sortZIndexPaths[k].points);
						var minX = minMaxpoints.minX, maxX = minMaxpoints.maxX, minY = minMaxpoints.minY, maxY = minMaxpoints.maxY, minZ = minMaxpoints.minZ, maxZ = minMaxpoints.maxZ;
						
						
						if(nIntersectionPlainAndLine.x > minX && nIntersectionPlainAndLine.x < maxX && nIntersectionPlainAndLine.y > minY && nIntersectionPlainAndLine.y < maxY && nIntersectionPlainAndLine.z > minZ && nIntersectionPlainAndLine.z < maxZ)
						{
							res = false;
							break;
						}
						
					}
				}
				
				return res;
			};
			
			var isIntersectionVergePointsLinesWithAnotherVerges = function(plainVerge, centralViewPoint)
			{
				var res = true;
				
				for(var j = 0; j < plainVerge.points.length; j++)
				{
					var pointFromVerge = plainVerge.points[j];
					
					centralViewPoint.y = pointFromVerge.y;
					centralViewPoint.x = pointFromVerge.x;
					var lineEqucation = getLineEquation(pointFromVerge, centralViewPoint);
					
					//пересечение грани и прямой
					var isFirstVerge = isNotIntersectionVergesAndLine(lineEqucation, pointFromVerge)
					
					if(false === isFirstVerge)
					{
						res = false;
						break;
					}
				}
				
				return res;
			};
			
			
			
			//перебираем все грани
			for(var i = 0; i < this.sortZIndexPaths.length; i++)
			{
				var plainVerge = this.sortZIndexPaths[i];
				var isFirstVerge = isIntersectionVergePointsLinesWithAnotherVerges(plainVerge, centralViewPoint);
				
				//push into array
				if(isFirstVerge)
				{
					firstVerges.push(this.sortZIndexPaths[i]);
				}
				else
				{
					lastVerges.push(this.sortZIndexPaths[i]);
				}
			}

			this.sortZIndexPaths = lastVerges.concat(firstVerges);
			this.sortZIndexPaths = firstVerges;
			
			/*this.sortZIndexPaths.sort(function sortArr(a, b)
			{
				if(b.zIndex == a.zIndex)
					return  a.x - b.x;
				else
					return  b.zIndex - a.zIndex;
			});*/
		}
    },
	
	_getOptionsForDrawing: function(ser, point, onlyLessNull)
	{
		var seria = this.chartProp.series[ser];
		var pt = seria.val.numRef.numCache.getPtByIndex(point);
		if(!seria || !this.paths.series[ser] || !this.paths.series[ser][point] || !pt)
			return null;
		
		var brush = seria.brush;
		var pen = seria.pen;
		
		if((pt.val > 0 && onlyLessNull === true) || (pt.val < 0 && onlyLessNull === false))
			return null;
		
		if(pt.pen)
			pen = pt.pen;
		if(pt.brush)
			brush = pt.brush;
			
		return {pen: pen, brush: brush}
	},
	
	_getStartYColumnPosition: function (seriesHeight, j, i, val, xPoints, summBarVal)
	{
		var startY, diffYVal, width, numCache, dVal, curVal, prevVal, endBlockPosition, startBlockPosition;
		var nullPositionOX = this.cChartSpace.chart.plotArea.catAx.posX ? this.cChartSpace.chart.plotArea.catAx.posX * this.chartProp.pxToMM : this.cChartSpace.chart.plotArea.catAx.xPos * this.chartProp.pxToMM;
		if(this.chartProp.subType == "stacked")
		{
			curVal = this._getStackedValue(this.chartProp.series, i, j, val);
			prevVal = this._getStackedValue(this.chartProp.series, i - 1, j, val);
			
			endBlockPosition = this.cChartDrawer.getYPosition((curVal), xPoints, true) * this.chartProp.pxToMM;
			startBlockPosition = prevVal ? this.cChartDrawer.getYPosition((prevVal), xPoints, true) * this.chartProp.pxToMM : nullPositionOX;
			
			startY = startBlockPosition;
			width = endBlockPosition - startBlockPosition;
			
			if(this.cChartSpace.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX)
				width = - width;
		}
		else if(this.chartProp.subType == "stackedPer")
		{	
			this._calculateSummStacked(j);
			
			curVal = this._getStackedValue(this.chartProp.series, i, j, val);
			prevVal = this._getStackedValue(this.chartProp.series, i - 1, j, val);
			
			endBlockPosition = this.cChartDrawer.getYPosition((curVal / this.summBarVal[j]), xPoints, true) * this.chartProp.pxToMM;
			startBlockPosition = this.summBarVal[j] ? this.cChartDrawer.getYPosition((prevVal / this.summBarVal[j]), xPoints, true) * this.chartProp.pxToMM : nullPositionOX;
			
			startY = startBlockPosition;
			width = endBlockPosition - startBlockPosition;
			
			if(this.cChartSpace.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX)
				width = - width;
		}
		else
		{
			width = this.cChartDrawer.getYPosition(val, xPoints, true) * this.chartProp.pxToMM - nullPositionOX;
			startY = nullPositionOX;
		}	
		
		return {startY: startY, width: width};
	},
	
	_calculateSummStacked : function(j)
	{
		if(!this.summBarVal[j])
		{
			var curVal;
			var temp = 0, idxPoint;
			for(var k = 0; k < this.chartProp.series.length; k++)
			{
				idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[k], j);	
				curVal = idxPoint ? parseFloat(idxPoint.val) : 0;
					
				if(curVal)
					temp += Math.abs(curVal);
			}
			this.summBarVal[j] = temp;
		}
	},
	
	_getStackedValue: function(series, i, j, val)
	{
		var result = 0, curVal, idxPoint;
		for(var k = 0; k <= i; k++)
		{
			idxPoint = this.cChartDrawer.getIdxPoint(series[k], j);
			curVal = idxPoint ? idxPoint.val : 0;
			
			if(idxPoint && val > 0 && curVal > 0)
				result += parseFloat(curVal);
			else if(idxPoint && val < 0 && curVal < 0)
				result += parseFloat(curVal);	
		}
		
		return result;
	},
	
	_getYPosition: function(val, yPoints, isOx)
	{
		//позиция в заисимости от положения точек на оси OY
		var result;
		var resPos;
		var resVal;
		var diffVal;
		if(val < yPoints[0].val)
		{
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
		}
		else if(val > yPoints[yPoints.length - 1].val)
		{	
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val - val);
			result = yPoints[0].pos + (diffVal / resVal) * resPos;
		}
		else
		{
			for(var s = 0; s < yPoints.length; s++)
			{
				if(val >= yPoints[s].val && val <= yPoints[s + 1].val)
				{
					resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
					resVal = yPoints[s + 1].val - yPoints[s].val;
					if(!isOx)
						result =  - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
					else	
						result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
					break;
				}
			}
		}
		
		return result;
	},
	
	_drawBars: function ()
    {
		var brush;
		var pen;
		var numCache;
		var seria;
		
		this.cChartDrawer.cShapeDrawer.Graphics.SaveGrState();
		this.cChartDrawer.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - 1) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
		for (var i = 0; i < this.paths.series.length; i++) {
			
			if(!this.paths.series[i])
				continue;
			
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;
			
			for (var j = 0; j < this.paths.series[i].length; j++) {
				numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
				if(numCache.pts[j] && numCache.pts[j].pen)
					pen = numCache.pts[j].pen;
				if(numCache.pts[j] && numCache.pts[j].brush)
					brush = numCache.pts[j].brush;
					
				if(this.paths.series[i][j])
					this.cChartDrawer.drawPath(this.paths.series[i][j], pen, brush);
			}
		}
		this.cChartDrawer.cShapeDrawer.Graphics.RestoreGrState();
    },
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var point = this.cChartDrawer.getIdxPoint(this.chartProp.series[ser], val);
		var path = this.paths.series[ser][val].ArrPathCommand;
		
		if(this.cChartDrawer.nDimensionCount === 3 && this.paths.series[ser][val][0])
		{
			path = this.paths.series[ser][val][0].ArrPathCommand;
		}
		
		if(!path)
			return;
		
		var x = path[0].X;
		var y = path[0].Y;
		
		var h = path[0].Y - path[1].Y;
		var w = path[2].X - path[1].X;
		
		var pxToMm = this.chartProp.pxToMM;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX, centerY;
				
		switch ( point.compiledDlb.dLblPos )
		{
			case c_oAscChartDataLabelsPos.bestFit:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.ctr:
			{
				centerX = x + w/2 - width/2;
				centerY = y - h/2 - height/2;
				break;
			}
			case c_oAscChartDataLabelsPos.inBase:
			{
				centerX = x;
				centerY = y - h/2 - height/2;
				if( point.val < 0 )
					centerX = x - width;
				break;
			}
			case c_oAscChartDataLabelsPos.inEnd:
			{
				centerX = x + w - width;
				centerY = y - h/2 - height/2;
				if( point.val < 0 )
					centerX = x + w;
				break;
			}
			case c_oAscChartDataLabelsPos.outEnd:
			{
				centerX = x + w;
				centerY = y - h/2 - height/2;
				if( point.val < 0 )
					centerX = x + w - width;
				break;
			}
		}
		
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
			
		return {x: centerX, y: centerY};
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
		
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x * pathW, (y - h) * pathH);
		path.lnTo((x + w) * pathW, (y - h) * pathH);
		path.lnTo((x + w) * pathW, y * pathH);
		path.lnTo(x * pathW, y * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	//TODO delete after test
	_DrawBars3D2: function()
	{
		var t = this;
		var draw = function(onlyLessNull)
		{
			var brush, pen, options;
			for (var i = 0; i < t.chartProp.ptCount; i++) 
			{
				if(!t.paths.series)
					return;
				
				for (var j = 0; j < t.paths.series.length; ++j) 
				{
					options = t._getOptionsForDrawing(j, i, onlyLessNull);
					if(options !== null)
					{
						pen = options.pen;
						brush = options.brush;
					}
					else
						continue;
					
					for(var k = 0; k < t.paths.series[j][i].length; k++)
					{
						t._drawBar3D(t.paths.series[j][i][k], pen, brush, k);
					}
				}
			}
		};
		
		var drawReverse = function(onlyLessNull)
		{
			var brush, pen, options;
			for (var i = 0; i < t.chartProp.ptCount; i++) 
			{
				if(!t.paths.series)
					return;
				
				for (var j = t.paths.series.length - 1; j >= 0; --j) 
				{
					options = t._getOptionsForDrawing(j, i, onlyLessNull);
					if(options !== null)
					{
						pen = options.pen;
						brush = options.brush;
					}
					else
						continue;
					
					for(var k = 0; k < t.paths.series[j][i].length; k++)
					{
						t._drawBar3D(t.paths.series[j][i][k], pen, brush, k);
					}
				}
			}
		};
		
		if(this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer")
		{
			if(this.cChartSpace.chart.plotArea.valAx.scaling.orientation === ORIENTATION_MIN_MAX)
			{
				drawReverse(true);
				draw(false);
				
			}
			else
			{
				drawReverse(false);
				draw(true);
			}
		}
		else
		{
			if(this.cChartSpace.chart.plotArea.catAx.scaling.orientation === ORIENTATION_MIN_MAX)
				draw();
			else
				drawReverse();
		}
	},
	
	
	_DrawBars3D3: function()
	{
		var t = this;
		var processor3D = this.cChartDrawer.processor3D;
		
		var verges = 
		{
			front: 0,
			down: 1,
			left: 2,
			right: 3,
			up: 4,
			unfront: 5
		};
		
		var drawVerges = function(i, j, paths, onlyLessNull, start, stop)
		{
			var brush, pen, options;
			options = t._getOptionsForDrawing(i, j, onlyLessNull);
			if(options !== null)
			{
				pen = options.pen;
				brush = options.brush;
				
				for(var k = start; k <= stop; k++)
				{
					t._drawBar3D(paths[k], pen, brush, k);
				}
			}
		};
		
		var draw = function(onlyLessNull, start, stop)
		{
			for(var i = 0; i < t.sortZIndexPaths.length; i++)
			{
				drawVerges(t.sortZIndexPaths[i].seria, t.sortZIndexPaths[i].point, t.sortZIndexPaths[i].paths, onlyLessNull, start, stop);
			}
		};
		
		if(this.chartProp.subType === "standard")
		{
			draw(true, verges.front, verges.unfront);
			draw(false, verges.front, verges.unfront);
		}
		else
		{
			draw(true, verges.down, verges.up);
			draw(false, verges.down, verges.up);
			
			draw(true, verges.unfront, verges.unfront);
			draw(false, verges.unfront, verges.unfront);
			
			draw(true, verges.front, verges.front);
			draw(false, verges.front, verges.front);
		}
	},
	
	_DrawBars3D: function()
	{
		var t = this;
		var processor3D = this.cChartDrawer.processor3D;
		
		var drawVerges = function(i, j, paths, onlyLessNull, k)
		{
			var brush, pen, options;
			options = t._getOptionsForDrawing(i, j, onlyLessNull);
			if(paths !== null && options !== null)
			{
				pen = options.pen;
				brush = options.brush;
				
				t._drawBar3D(paths, pen, brush, k);
			}
		};
		
		for(var i = 0; i < this.sortZIndexPaths.length; i++)
		{
			drawVerges(this.sortZIndexPaths[i].seria, this.sortZIndexPaths[i].point, this.sortZIndexPaths[i].paths, null, this.sortZIndexPaths[i].verge);
		}
	},
	
	_drawBar3D: function(path, pen, brush, k)
	{
		//затемнение боковых сторон
		//в excel всегда темные боковые стороны, лицевая и задняя стороны светлые
		//pen = this.cChartSpace.chart.plotArea.valAx.compiledMajorGridLines;
		//pen.setFill(brush);
		pen = AscFormat.CreatePenFromParams(brush, undefined, undefined, undefined, undefined, 0.1);
		if(k != 5 && k != 0)
		{
			var  props = this.cChartSpace.getParentObjects();
			var duplicateBrush = brush.createDuplicate();
			var cColorMod = new AscFormat.CColorMod;
			if(k == 1 || k == 4)
				cColorMod.val = 45000;
			else
				cColorMod.val = 35000;
			cColorMod.name = "shade";
			duplicateBrush.addColorMod(cColorMod);
			duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new AscFormat.CUniColor().RGBA);
			
			pen.setFill(duplicateBrush);
			this.cChartDrawer.drawPath(path, pen, duplicateBrush);
		}
		else
			this.cChartDrawer.drawPath(path, pen, brush);
	}
};



	/** @constructor */
function drawPieChart()
{
	this.tempAngle = null;
	this.paths = {};
	this.cX = null;
	this.cY = null;
	this.angleFor3D = null;
	this.properties3d = null;
	this.usually3dPropsCalc = [];
}

drawPieChart.prototype =
{
    constructor: drawPieChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		if(this.cChartDrawer.nDimensionCount === 3)
			this._drawPie3D();
		else
			this._drawPie();
	},
	
	reCalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this.tempAngle = null;
		this.paths = {};
		
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			this.properties3d = this.cChartDrawer.processor3D.calculatePropertiesForPieCharts();
			this._reCalculatePie3D();
		}
		else
		{	
			this._reCalculatePie();
		}
	},	
	
	_drawPie: function ()
    {
		var numCache = this._getFirstRealNumCache();
		var brush, pen, val;
		var path;
        for (var i = 0,len = numCache.length; i < len; i++) {
			val = numCache[i];
			brush = val.brush;
			pen = val.pen;
			path = this.paths.series[i];
			
            this.cChartDrawer.drawPath(path, pen, brush);
        }
    },
	
	_drawPie3D: function ()
    {
		var numCache = this._getFirstRealNumCache();
		var  props = this.cChartSpace.getParentObjects();
		var brush, pen, val;
		var path;
		for(var n = 0; n < this.paths.series.length; n++)
		{
			for (var i = 0, len = numCache.length; i < len; i++) {
				val = numCache[i];
				brush = val.brush;
				
				if(n === 0 || n === this.paths.series.length - 1)
					pen = val.pen;
				else
					pen = null;
				
				path = this.paths.series[n][i];
				
				var duplicateBrush = brush;
				if(n !== this.paths.series.length - 1)
				{
					var duplicateBrush = brush.createDuplicate();
					var cColorMod = new AscFormat.CColorMod;
					
					cColorMod.val = 35000;
					cColorMod.name = "shade";
					
					if(duplicateBrush.fill.color)
						duplicateBrush.fill.color.Mods.addMod(cColorMod);	
					
					duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new AscFormat.CUniColor().RGBA);
				}
				
				this.cChartDrawer.drawPath(path, pen, duplicateBrush);
			}
		}
        
    },
	
	_reCalculatePie3D: function ()
    {
		var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;

		var numCache = this._getFirstRealNumCache();
		var sumData = this.cChartDrawer._getSumArray(numCache, true);
		
        var radius = Math.min(trueHeight, trueWidth) / 2;
		if(radius < 0)
			radius = 0;
		
		var xCenter = this.chartProp.chartGutter._left + trueWidth/2;
		var yCenter = this.chartProp.chartGutter._top + trueHeight/2;
		
		var startAngle = this.cChartDrawer.processor3D.angleOy ? this.cChartDrawer.processor3D.angleOy : 0;
		var startAngle3D = startAngle !== 0 && startAngle !== undefined ? this._changeAngle(radius, Math.PI/2, startAngle, xCenter, yCenter, this.properties3d) : 0;
		
		this.tempAngle = Math.PI/2  + startAngle;
		this.angleFor3D = Math.PI/2 - startAngle3D;
		
		//рисуем против часовой стрелки, поэтому цикл с конца
		var depth = this.properties3d.depth;
		for(var n = 0; n < depth; n++)
		{
			if(!this.paths.series)
				this.paths.series = [];
			
			for (var i = numCache.length - 1; i >= 0; i--) 
			{
				var angle = Math.abs((parseFloat(numCache[i].val / sumData)) * (Math.PI * 2));
				if(!this.paths.series[n])
					this.paths.series[n] = [];
					
				if(sumData === 0)//TODO стоит пересмотреть
					this.paths.series[n][i] = this._calculateEmptySegment(radius, xCenter, yCenter);
				else
					this.paths.series[n][i] = this._calculateSegment3D(angle, radius, xCenter, yCenter, n, i);
			}
		}
       
    },
	
	_reCalculatePie: function ()
    {
		var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;

		var numCache = this._getFirstRealNumCache();
		var sumData = this.cChartDrawer._getSumArray(numCache, true);
		
        var radius = Math.min(trueHeight, trueWidth)/2;
		var xCenter = this.chartProp.chartGutter._left + trueWidth/2;
		var yCenter = this.chartProp.chartGutter._top + trueHeight/2;
		
		var firstSliceAng = this.cChartSpace.chart.plotArea.chart &&  this.cChartSpace.chart.plotArea.chart.firstSliceAng ? this.cChartSpace.chart.plotArea.chart.firstSliceAng : 0;
		this.tempAngle = Math.PI/2 - (firstSliceAng / 180) * Math.PI ;
		//рисуем против часовой стрелки, поэтому цикл с конца
		var angle;
        for (var i = numCache.length - 1; i >= 0; i--) 
		{
			angle = Math.abs((parseFloat(numCache[i].val / sumData)) * (Math.PI * 2));
			if(!this.paths.series)
				this.paths.series = [];
			if(sumData === 0)//TODO стоит пересмотреть
				this.paths.series[i] = this._calculateEmptySegment(radius, xCenter, yCenter);
			else
				this.paths.series[i] = this._calculateSegment(angle, radius, xCenter, yCenter);
        };
    },
	
	_getFirstRealNumCache: function()
	{
		var series = this.chartProp.series;
		var numCache;
		for(var i = 0; i < series.length; i++)
		{
			numCache = this.chartProp.series[i].val.numRef ? this.chartProp.series[i].val.numRef.numCache.pts : this.chartProp.series[i].val.numLit.pts;
			if(numCache && numCache.length)
				return numCache;
		}
		
		return series[0].val.numRef ? series[0].val.numRef.numCache.pts : series[0].val.numLit.pts;
	},
	
	_calculateSegment: function (angle, radius, xCenter, yCenter)
    {
		if(isNaN(angle))
			return null;
		
		var startAngle = (this.tempAngle);
		var endAngle   = angle;
		
		if(radius < 0)
			radius = 0;
		var path = this._calculateArc(radius, startAngle, endAngle, xCenter, yCenter);

        this.tempAngle += angle;
		
		return path;
    },
	
	_calculateSegment3D: function (angle, radius, xCenter, yCenter, depth, i)
	{
		if(isNaN(angle))
			return null;
		
		var startAngle = (this.tempAngle);
		var swapAngle   = angle;
		var endAngle   = startAngle + angle;
		
		var path = this._calculateArc3D(radius, startAngle, swapAngle, xCenter, yCenter, depth, i);
			
        this.tempAngle += angle;
		
		return path;
	},
	
	_calculateEmptySegment: function(radius, xCenter, yCenter)
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
		
		var x0 = xCenter + radius*Math.cos(this.tempAngle);
		var y0 = yCenter - radius*Math.sin(this.tempAngle);
		
		path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		path.lnTo(x0 / pxToMm * pathW, y0 / pxToMm * pathH);
		path.arcTo(radius / pxToMm * pathW, radius / pxToMm * pathH, this.tempAngle, this.tempAngle);
		path.lnTo(xCenter / pxToMm * pathW, yCenter / pxToMm * pathH);

		path.recalculate(gdLst);
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
	
	_calculateArc3D : function(radius, stAng, swAng, xCenter, yCenter, depth, seriaNum)
	{	
		var radius1 = this.properties3d.radius1;
		var radius2 = this.properties3d.radius2;
		var pxToMm = this.chartProp.pxToMM;
		var t = this;
		
		var x0, y0, radiusSpec;
		var calculateProps = function()
		{
			if(t.usually3dPropsCalc && t.usually3dPropsCalc[seriaNum])
			{
				swAng = t.usually3dPropsCalc[seriaNum].swAng;
				stAng = t.usually3dPropsCalc[seriaNum].stAng;
				radiusSpec =  t.usually3dPropsCalc[seriaNum].radiusSpec;
				x0 = t.usually3dPropsCalc[seriaNum].x0;
				
				yCenter = yCenter + t.properties3d.depth / 2 - depth;
				y0 = (yCenter - radiusSpec*Math.sin(stAng));
			}
			else
			{
				swAng = t._changeAngle(radius, stAng, swAng, xCenter, yCenter, t.properties3d);
				stAng = t.angleFor3D;
				
				//корректируем центр
				yCenter = yCenter + t.properties3d.depth / 2 - depth;
					
				radiusSpec = (radius1 * radius2) /  Math.sqrt(Math.pow(radius2, 2) * Math.pow((Math.cos(stAng)), 2) + Math.pow(radius1, 2) * Math.pow(Math.sin(stAng),2));
				
				x0 = (xCenter + radiusSpec*Math.cos(stAng));
				y0 = (yCenter - radiusSpec*Math.sin(stAng));
			}
			
		};
		
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		calculateProps();
		
		path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		path.lnTo(x0  /pxToMm * pathW, y0 / pxToMm * pathH);
		path.arcTo(radius1 / pxToMm * pathW, radius2 / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swAng*cToDeg);
		path.lnTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		
		path.recalculate(gdLst);
		
		this.angleFor3D += swAng;
		if(!this.usually3dPropsCalc[seriaNum])
			this.usually3dPropsCalc[seriaNum] = {swAng: swAng, stAng: stAng, xCenter: xCenter, x0: x0, radiusSpec: radiusSpec};
		
		return path;	
	},
	
	_isVisibleVerge3D: function(k, n, m, val)
	{
		//roberts method - calculate normal
		var aX = n.x * m.y - m.x * n.y;
		var bY = - (k.x * m.y - m.x * k.y);
		var cZ = k.x * n.y - n.x * k.y;
		var visible = aX + bY + cZ;
		
		var result = (val > 0 && visible < 0 || val < 0 && visible > 0) ? true : false;
		
		
		return result;
	},
	
	_changeAngle: function(radius, stAng, swAng, xCenter, yCenter, properties)
	{
		var depth = properties.depth;
		var radius1 = properties.radius1;
		var radius2 = properties.radius2;
		
		//корректируем центр
		yCenter = yCenter - depth / 2;
		
		var x0 = xCenter + radius*Math.cos(stAng);
		var y0 = yCenter - radius*Math.sin(stAng);
		var kFX = radius / radius1;
		var kFY = radius / radius2;
		
		
		var cX;
		if(this.cX !== null)
			cX = this.cX; 
		else if(x0 < xCenter)
			cX = xCenter - (xCenter - x0) / kFX;
		else if(x0 > xCenter)
			cX = xCenter + (x0 - xCenter) / kFX;
		else
			cX = xCenter;
		
		var cY;
		if(this.cY !== null)
			cY = this.cY; 
		else if(y0 < yCenter)
			cY = yCenter - (yCenter - y0) / kFY;
		else if(y0 > yCenter)
			cY = yCenter + (y0 - yCenter) / kFY;
		else
			cY = yCenter;
		
		
		var x01 = xCenter + radius*Math.cos(stAng + swAng);
		//if(stAng + swAng > (3/2) * Math.PI)
			//x01 = xCenter - radius*Math.cos(stAng + swAng);
		
		var y01 = yCenter - radius*Math.sin(stAng + swAng);
		
		var aX;
		if(x01 < xCenter)
			aX = xCenter - (xCenter - x01) / kFX;
		else if(x01 > xCenter)
			aX = xCenter + (x01 - xCenter) / kFX;
		else
			aX = xCenter;
		
		
		var aY;
		if(y01 < yCenter)
			aY = yCenter - (yCenter - y01) / kFY;
		else if(y01 > yCenter)
			aY = yCenter + (y01 - yCenter) / kFY;
		else
			aY = yCenter;
			
		this.cX = aX;
		this.cY = aY;
		
		var a = Math.sqrt(Math.pow(cX - xCenter, 2) + Math.pow(cY - yCenter, 2));
		var b = Math.sqrt(Math.pow(aX - cX, 2) + Math.pow(aY - cY, 2));
		var c = Math.sqrt(Math.pow(aX - xCenter, 2) + Math.pow(aY - yCenter, 2));
		
		
		var cosNewAngle = (Math.pow(c, 2) + Math.pow(a, 2) - Math.pow(b, 2)) / (2 * c * a);
		
		if(cosNewAngle > 1)
			cosNewAngle = 1;
		
		if(cosNewAngle < -1)
			cosNewAngle = - 1;
		
		var res;
		if(swAng > Math.PI)
			res = 2*Math.PI - Math.acos(cosNewAngle);
		else
			res = Math.acos(cosNewAngle);
			
		return res;
	},
	
	_calculateArc3D2 : function(radius, stAng, swAng, xCenter, yCenter)
	{	
		var path  = new Path();
		
		var properties = this.cChartDrawer.processor3D.calculatePropertiesForPieCharts();
		var depth = properties.depth;
		var radius1 = properties.radius1;
		var radius2 = properties.radius2;
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		
		//корректируем центр
		yCenter = yCenter - depth / 2;
		
		var x0 = xCenter + radius*Math.cos(stAng);
		var y0 = yCenter - radius*Math.sin(stAng);
		var kFX = radius / radius1;
		var kFY = radius / radius2;
		
		var x;
		if(x0 < xCenter)
			x = xCenter - (xCenter - x0) / kFX;
		else if(x0 > xCenter)
			x = xCenter + (x0 - xCenter) / kFX;
		else
			x = xCenter;
		
		var y;
		if(y0 < yCenter)
			y = yCenter - (yCenter - y0) / kFY;
		else if(y0 > yCenter)
			y = yCenter + (y0 - yCenter) / kFY;
		else
			y = yCenter;
		
		
		var x01 = xCenter + radius*Math.cos(stAng + swAng);
		var y01 = yCenter - radius*Math.sin(stAng + swAng);
		
		var x1;
		if(x01 < xCenter)
			x1 = xCenter - (xCenter - x01) / kFX;
		else if(x0 > xCenter)
			x1 = xCenter + (x01 - xCenter) / kFX;
		else
			x1 = xCenter;
		
		
		var y1;
		if(y01 < yCenter)
			y1 = yCenter - (yCenter - y01) / kFY;
		else if(y01 > yCenter)
			y1 = yCenter + (y01 - yCenter) / kFY;
		else
			y1 = yCenter;
		
		/*path.moveTo(x  /pxToMm * pathW, y / pxToMm * pathH);
		path.arcTo(radius1 / pxToMm * pathW, radius2 / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swAng*cToDeg);
		path.lnTo(x1  /pxToMm * pathW, y1 / pxToMm * pathH);
		path.arcTo(radius1 / pxToMm * pathW, radius2 / pxToMm * pathH, -1 * stAng*cToDeg - 1 * swAng*cToDeg, 1 * swAng*cToDeg);
		path.lnTo(x / pxToMm * pathW, y / pxToMm * pathH);*/
		
		path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		path.lnTo(x0  /pxToMm * pathW, y0 / pxToMm * pathH);
		path.arcTo(radius1 / pxToMm * pathW, radius2 / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swAng*cToDeg);
		path.lnTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		
		path.recalculate(gdLst);
		var frontPath = path;

		return {frontPath: frontPath, upPath: null};		
	},
	
	_calculateArc3DWithoutZ : function(radius, stAng, swAng, xCenter, yCenter)
	{	
		var properties = this.cChartDrawer.processor3D.calculatePropertiesForPieCharts();
		var depth = properties.depth;
		var radius1 = properties.radius1;
		var radius2 = properties.radius2;
		var pxToMm = this.chartProp.pxToMM;
		
		var view3DProp = this.cChartSpace.chart.view3D;
		var angleOx = view3DProp && view3DProp.rotX ? (- view3DProp.rotX / 360) * (Math.PI * 2) : 0;
		var angleOy = view3DProp && view3DProp.rotY ? (- view3DProp.rotY / 360) * (Math.PI * 2) : 0;
		var angleOz = 0;
		
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		
		var convertResult = this.cChartDrawer.processor3D.convertAndTurnPointForPie(xCenter + radius*Math.cos(stAng), yCenter - radius*Math.sin(stAng), 0, angleOx, angleOy, angleOz);
		var x0 = convertResult.x;
		var y0 = convertResult.y;
		
		path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		path.lnTo(x0 / pxToMm * pathW, y0 / pxToMm * pathH);
		path.arcTo(radius / pxToMm * pathW, radius / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swAng*cToDeg);
		path.lnTo(xCenter / pxToMm * pathW, yCenter / pxToMm * pathH);

		path.recalculate(gdLst);
		
		var upPath = path;
		
		return {frontPath: null, upPath: upPath};	
	},

	_calculateBestFitPosition: function(fStartAngle, fSweepAngle, fRadius, fWidth, fHeight, fCenterX, fCenterY, bLayout){
		var fStartAngle_ = fStartAngle;
		var fEndAngle = fStartAngle + fSweepAngle;
        if(bLayout){
            return this._calculateBestFitPositionOuter(fStartAngle_, fEndAngle, fRadius, fWidth, fHeight, fCenterX, fCenterY);
        }
		var oRet = this._calculateBestFitPositionInner(fStartAngle_, fEndAngle, fRadius, fWidth, fHeight, fCenterX, fCenterY);
        if(!oRet.bError){
            if(AscFormat.fCheckBoxIntersectionSegment(oRet.fX, oRet.fY, fWidth, fHeight, fCenterX, fCenterY, fCenterX + fRadius*Math.cos(fStartAngle_), fCenterY + fRadius*Math.sin(fStartAngle_))
                || AscFormat.fCheckBoxIntersectionSegment(oRet.fX, oRet.fY, fWidth, fHeight, fCenterX, fCenterY, fCenterX + fRadius*Math.cos(fEndAngle), fCenterY + fRadius*Math.sin(fEndAngle))){
                oRet.bError = true;
            }
        }
		if(oRet.bError){
			return this._calculateBestFitPositionOuter(fStartAngle_, fEndAngle, fRadius, fWidth, fHeight, fCenterX, fCenterY);
		}
		return oRet;
	},

	_calculateBestFitPositionInner: function(fStartAngle, fEndAngle, fPieRadius, fLabelWidth, fLabelHeight, fCenterX, fCenterY){
		var oResult = {bError: true};
		var fBisectAngle = AscFormat.normalizeRotate((fStartAngle + fEndAngle)/2.0);
		
		if(AscFormat.fApproxEqual(fBisectAngle, 0) || AscFormat.fApproxEqual(fBisectAngle, Math.PI/2) || AscFormat.fApproxEqual(fBisectAngle, Math.PI) || AscFormat.fApproxEqual(fBisectAngle, 3*Math.PI/2)){
			return this._calculateInEndDLblPosition(fStartAngle, fStartAngle + fEndAngle, fPieRadius, fLabelWidth, fLabelHeight, fCenterX, fCenterY);
		}
		var fBisectAngle2 = AscFormat.normalizeRotate(fBisectAngle + Math.PI/4) - Math.PI/4; 
		var nIndexArea = ((fBisectAngle2 + Math.PI/4)/(Math.PI/2)) >> 0;
				
		
		var fLengthCoeff =  ((fBisectAngle2 + Math.PI/4) - (Math.PI/2)*nIndexArea)/(Math.PI/2);		
				
		var fXs = fCenterX + fPieRadius*Math.cos(fBisectAngle);
		var fYs = fCenterY + fPieRadius*Math.sin(fBisectAngle);
		var fDeltaX, fDeltaY, oSolvation;

        switch(nIndexArea){
            case 0:{
                if(fBisectAngle2 < 0){
                    fDeltaX = fLabelWidth;
                    fDeltaY = -(1 - fLengthCoeff)*fLabelHeight;
                }
                else{
                    fDeltaX = fLabelWidth;
                    fDeltaY = fLabelHeight*fLengthCoeff;
                }
                oSolvation = AscFormat.fSolveQuadraticEquation(fPieRadius*fPieRadius, 2*(fDeltaX*(fXs - fCenterX) + fDeltaY*(fYs - fCenterY)), fDeltaX*fDeltaX + fDeltaY*fDeltaY - fPieRadius*fPieRadius);
                if(!oSolvation.bError){
                    if(oSolvation.x1 > 0 && oSolvation.x1 < 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x1*(fXs - fCenterX);
                        oResult.fY = fCenterY + oSolvation.x1*(fYs - fCenterY) - (1 - fLengthCoeff)*fLabelHeight;
                    }
                    else if(oSolvation.x2 > 0 && oSolvation.x2 < 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x2*(fXs - fCenterX);
                        oResult.fY = fCenterY + oSolvation.x2*(fYs - fCenterY) - (1 - fLengthCoeff)*fLabelHeight;
                    }
                }
                break;
            }
            case 1:{
                if(fBisectAngle < Math.PI/2){
                    fDeltaX = (1 - fLengthCoeff)*fLabelWidth;
                    fDeltaY = fLabelHeight;
                }
                else{
                    fDeltaX = - fLengthCoeff*fLabelWidth;
                    fDeltaY = fLabelHeight;
                }
                oSolvation = AscFormat.fSolveQuadraticEquation(fPieRadius*fPieRadius, 2*(fDeltaX*(fXs - fCenterX) + fDeltaY*(fYs - fCenterY)), fDeltaX*fDeltaX + fDeltaY*fDeltaY - fPieRadius*fPieRadius);
                if(!oSolvation.bError){
                    if(oSolvation.x1 > 0 && oSolvation.x1 < 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x1*(fXs - fCenterX) - fLabelWidth*fLengthCoeff;
                        oResult.fY = fCenterY + oSolvation.x1*(fYs - fCenterY);
                    }
                    else if(oSolvation.x2 > 0 && oSolvation.x2 < 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x2*(fXs - fCenterX) - fLabelWidth*fLengthCoeff;
                        oResult.fY = fCenterY + oSolvation.x2*(fYs - fCenterY);
                    }
                }
                break;
            }
            case 2:{
                if(fBisectAngle < Math.PI){
                    fDeltaX = -fLabelWidth;
                    fDeltaY = (1 - fLengthCoeff)*fLabelHeight;
                }
                else{
                    fDeltaX = -fLabelWidth;
                    fDeltaY = - fLengthCoeff*fLabelHeight;
                }
                oSolvation = AscFormat.fSolveQuadraticEquation(fPieRadius*fPieRadius, 2*(fDeltaX*(fXs - fCenterX) + fDeltaY*(fYs - fCenterY)), fDeltaX*fDeltaX + fDeltaY*fDeltaY - fPieRadius*fPieRadius);
                if(!oSolvation.bError){
                    if(oSolvation.x1 > 0 && oSolvation.x1 < 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x1*(fXs - fCenterX) - fLabelWidth;
                        oResult.fY = fCenterY + oSolvation.x1*(fYs - fCenterY) - fLabelHeight*fLengthCoeff;

                    }
                    else if(oSolvation.x2 > 0 && oSolvation.x2 < 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x2*(fXs - fCenterX) - fLabelWidth;
                        oResult.fY = fCenterY + oSolvation.x2*(fYs - fCenterY) - fLabelHeight*fLengthCoeff;
                    }
                }
                break;
            }
            case 3:{
                fLengthCoeff = 1 - fLengthCoeff;
                if(fBisectAngle < 3*Math.PI/2){
                    fDeltaX = -fLabelWidth*fLengthCoeff;
                    fDeltaY = -fLabelHeight;
                }
                else{
                    fDeltaX = (1 - fLengthCoeff)*fLabelWidth;
                    fDeltaY = -fLabelHeight;
                }
                oSolvation = AscFormat.fSolveQuadraticEquation(fPieRadius*fPieRadius, 2*(fDeltaX*(fXs - fCenterX) + fDeltaY*(fYs - fCenterY)), fDeltaX*fDeltaX + fDeltaY*fDeltaY - fPieRadius*fPieRadius);
                if(!oSolvation.bError){
                    if(oSolvation.x1 > 0 && oSolvation.x1 < 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x1*(fXs - fCenterX) - fLabelWidth*fLengthCoeff;
                        oResult.fY = fCenterY + oSolvation.x1*(fYs - fCenterY) - fLabelHeight;
                    }
                    else if(oSolvation.x2 > 0 && oSolvation.x2 < 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x2*(fXs - fCenterX) - fLabelWidth*fLengthCoeff;
                        oResult.fY = fCenterY + oSolvation.x2*(fYs - fCenterY) - fLabelHeight;
                    }
                }
                break;
            }
        }
		return oResult;
	},

	_calculateBestFitPositionOuter: function(fStartAngle, fEndAngle, fPieRadius, fLabelWidth, fLabelHeight, fCenterX, fCenterY){
        var oResult = {bError: true};
        var fBisectAngle = AscFormat.normalizeRotate((fStartAngle + fEndAngle)/2.0);
        var fBisectAngle2 = AscFormat.normalizeRotate(fBisectAngle + Math.PI/4) - Math.PI/4;
        var nIndexArea = ((fBisectAngle2 + Math.PI/4)/(Math.PI/2)) >> 0;


        var fLengthCoeff =  ((fBisectAngle2 + Math.PI/4) - (Math.PI/2)*nIndexArea)/(Math.PI/2);

        var fXs = fCenterX + fPieRadius*Math.cos(fBisectAngle);
        var fYs = fCenterY + fPieRadius*Math.sin(fBisectAngle);
        var fDeltaX, fDeltaY, oSolvation;

        var fAngleApproxDelta = 1e-4;
        switch(nIndexArea){
            case 0:{
                if(AscFormat.fApproxEqual(fBisectAngle2, 0, fAngleApproxDelta)){
                    fDeltaX = 0;
                    fDeltaY = 0;
                }
                else if(fBisectAngle2 < 0){
                    fDeltaX = 0;
                    fDeltaY = fLengthCoeff*fLabelHeight;
                }
                else{
                    fDeltaX = 0;
                    fDeltaY = -(1 - fLengthCoeff)*fLabelHeight;
                }
                oSolvation = AscFormat.fSolveQuadraticEquation(fPieRadius*fPieRadius, 2*(fDeltaX*(fXs - fCenterX) + fDeltaY*(fYs - fCenterY)), fDeltaX*fDeltaX + fDeltaY*fDeltaY - fPieRadius*fPieRadius);
                if(!oSolvation.bError){
                    if(oSolvation.x1 >= 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x1*(fXs - fCenterX);
                        oResult.fY = fCenterY + oSolvation.x1*(fYs - fCenterY) - (1 - fLengthCoeff)*fLabelHeight;
                    }
                    else if(oSolvation.x2 >= 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x2*(fXs - fCenterX);
                        oResult.fY = fCenterY + oSolvation.x2*(fYs - fCenterY) - (1 - fLengthCoeff)*fLabelHeight;
                    }
                }
                break;
            }
            case 1:{
                if(AscFormat.fApproxEqual(fBisectAngle, Math.PI/2, fAngleApproxDelta)){
                    fDeltaX = 0;
                    fDeltaY = 0;
                }
                else if(fBisectAngle < Math.PI/2){
                    fDeltaX = -fLengthCoeff*fLabelWidth;
                    fDeltaY = 0;
                }
                else{
                    fDeltaX = (1 - fLengthCoeff)*fLabelWidth;
                    fDeltaY = 0;
                }
                oSolvation = AscFormat.fSolveQuadraticEquation(fPieRadius*fPieRadius, 2*(fDeltaX*(fXs - fCenterX) + fDeltaY*(fYs - fCenterY)), fDeltaX*fDeltaX + fDeltaY*fDeltaY - fPieRadius*fPieRadius);
                if(!oSolvation.bError){
                    if(oSolvation.x1 >= 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x1*(fXs - fCenterX) - fLabelWidth*fLengthCoeff;
                        oResult.fY = fCenterY + oSolvation.x1*(fYs - fCenterY);
                    }
                    else if(oSolvation.x2 >= 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x2*(fXs - fCenterX) - fLabelWidth*fLengthCoeff;
                        oResult.fY = fCenterY + oSolvation.x2*(fYs - fCenterY);
                    }
                }
                break;
            }
            case 2:{
                if(AscFormat.fApproxEqual(fBisectAngle, Math.PI, fAngleApproxDelta)){
                    fDeltaX = 0;
                    fDeltaY = 0;
                }
                else if(fBisectAngle < Math.PI){
                    fDeltaX = 0;
                    fDeltaY = -fLengthCoeff*fLabelHeight;
                }
                else{
                    fDeltaX = 0;
                    fDeltaY = (1 - fLengthCoeff)*fLabelHeight;
                }
                oSolvation = AscFormat.fSolveQuadraticEquation(fPieRadius*fPieRadius, 2*(fDeltaX*(fXs - fCenterX) + fDeltaY*(fYs - fCenterY)), fDeltaX*fDeltaX + fDeltaY*fDeltaY - fPieRadius*fPieRadius);
                if(!oSolvation.bError){
                    if(oSolvation.x1 >= 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x1*(fXs - fCenterX) - fLabelWidth;
                        oResult.fY = fCenterY + oSolvation.x1*(fYs - fCenterY) - fLabelHeight*fLengthCoeff;

                    }
                    else if(oSolvation.x2 >= 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x2*(fXs - fCenterX) - fLabelWidth;
                        oResult.fY = fCenterY + oSolvation.x2*(fYs - fCenterY) - fLabelHeight*fLengthCoeff;
                    }
                }
                break;
            }
            case 3:{
                if(fBisectAngle < 3*Math.PI/2){
                    fDeltaX = fLabelWidth*fLengthCoeff;
                    fDeltaY = 0;
                }
                else{
                    fDeltaX = -(1 - fLengthCoeff)*fLabelWidth;
                    fDeltaY = 0;
                }
                oSolvation = AscFormat.fSolveQuadraticEquation(fPieRadius*fPieRadius, 2*(fDeltaX*(fXs - fCenterX) + fDeltaY*(fYs - fCenterY)), fDeltaX*fDeltaX + fDeltaY*fDeltaY - fPieRadius*fPieRadius);
                if(!oSolvation.bError){
                    if(oSolvation.x1 >= 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x1*(fXs - fCenterX) - (1 - fLengthCoeff)*fLabelWidth;
                        oResult.fY = fCenterY + oSolvation.x1*(fYs - fCenterY) - fLabelHeight;
                    }
                    else if(oSolvation.x2 >= 1){
                        oResult.bError = false;
                        oResult.fX = fCenterX + oSolvation.x2*(fXs - fCenterX) - (1 - fLengthCoeff)*fLabelWidth;
                        oResult.fY = fCenterY + oSolvation.x2*(fYs - fCenterY) - fLabelHeight;
                    }
                }
                break;
            }
        }
        return oResult;
	},

    _calculateInEndDLblPosition: function(fStartAngle, fSweepAngle, fPieRadius, fLabelWidth, fLabelHeight, fCenterX, fCenterY){
        var fEndAngle = fStartAngle + fSweepAngle;
        var oResult = {bError: true, fX: 0.0, fY: 0.0};
        var fBisectAngle = AscFormat.normalizeRotate((fStartAngle + fEndAngle)/2);
        var nQuadrantIndex = (2.0*fBisectAngle/Math.PI) >> 0;
        var fHalfRectWidthVector = fLabelWidth/ 2, fHalfRectHeightVector = fLabelHeight/2;
        if(nQuadrantIndex === 1 || nQuadrantIndex == 2){
            fHalfRectWidthVector = -fHalfRectWidthVector;
        }
        if(nQuadrantIndex === 2 || nQuadrantIndex == 3){
            fHalfRectHeightVector = -fHalfRectHeightVector;
        }

        var fXs = fCenterX + fPieRadius*Math.cos(fBisectAngle), fYs = fCenterY + fPieRadius*Math.sin(fBisectAngle);
        var a = fPieRadius*fPieRadius, b = 2*( (fXs - fCenterX)*fHalfRectWidthVector + (fYs - fCenterY)*fHalfRectHeightVector), c = fHalfRectWidthVector*fHalfRectWidthVector + fHalfRectHeightVector*fHalfRectHeightVector - fPieRadius*fPieRadius;
        var oSolution = AscFormat.fSolveQuadraticEquation(a, b, c);
		if(oSolution.bError){
			return oResult;
		}
		var D = b*b - 4*a*c;
        if(D < 0){
            return oResult;
        }
        var t1 = oSolution.x1, t2 = oSolution.x2;
        if(t1 > 0 && t1 < 1){
            oResult.bError = false;
            oResult.fX = fCenterX + t1*(fXs - fCenterX) - fLabelWidth/2;
            oResult.fY = fCenterY + t1*(fYs - fCenterY) - fLabelHeight/2;
            return oResult
        }
        if(t2 > 0 && t2 < 1){
            oResult.bError = false;
            oResult.fX = fCenterX + t2*(fXs - fCenterX) - fLabelWidth/2;
            oResult.fY = fCenterY + t2*(fYs - fCenterY) - fLabelHeight/2;
            return oResult
        }
        return oResult;
    },

	_calculateDLbl: function(chartSpace, ser, val, bLayout)
	{
		var pxToMm = this.chartProp.pxToMM;
		
		//TODO сделать через idx как у drawDoughnutChart!!!
		if(!this.paths.series[val])
			return;
		
		var path;
		if(this.cChartDrawer.nDimensionCount === 3)
			path = this.paths.series[this.paths.series.length - 1][val].ArrPathCommand;
		else
			path = this.paths.series[val].ArrPathCommand;
		
		var getEllipseRadius = function(radius1, radius2, alpha)
		{
			var a = radius1 * radius2;
			var b = Math.sqrt(Math.pow(radius2, 2) * Math.pow(Math.cos(alpha), 2) + Math.pow(radius1, 2) * Math.pow(Math.sin(alpha), 2));
			var res = a / b;
			
			return res;
		};
		
		var centerX = path[0].X;
		var centerY = path[0].Y;
		
		var radius = path[2].hR;
		var stAng = path[2].stAng;
		var swAng = path[2].swAng;
		
		if(this.cChartDrawer.nDimensionCount === 3 && path[2].wR)
		{
			radius = getEllipseRadius(path[2].hR, path[2].wR, -1 * stAng - swAng / 2 - Math.PI / 2);
		}
		
		var point = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache.pts[val] : this.chartProp.series[0].val.numLit.pts[val];
		
		if(!point)
			return;
		
		var constMargin = 5 / pxToMm;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var tempCenterX, tempCenterY;
		
		//TODO высчитать позиции, как в екселе +  ограничения
		switch ( point.compiledDlb.dLblPos )
		{
			case c_oAscChartDataLabelsPos.bestFit:
			{
				var oPos = this._calculateBestFitPosition(stAng, swAng, radius, width, height, centerX, centerY, bLayout);
				if(!oPos.bError){
					centerX = oPos.fX;
					centerY = oPos.fY;
				}
				else{
					centerX = centerX + (radius / 2) * Math.cos(-1 * stAng - swAng / 2) - width / 2;
					centerY = centerY - (radius / 2) * Math.sin(-1 * stAng - swAng / 2) - height / 2;
				}
				break;
			}
			case c_oAscChartDataLabelsPos.ctr:
			{
				centerX = centerX + (radius / 2) * Math.cos(-1 * stAng - swAng / 2) - width / 2;
				centerY = centerY - (radius / 2) * Math.sin(-1 * stAng - swAng / 2) - height / 2;
				break;
			}
			case c_oAscChartDataLabelsPos.inBase:
			{
				centerX = centerX + (radius / 2) * Math.cos(-1 * stAng - swAng / 2) - width / 2;
				centerY = centerY - (radius / 2) * Math.sin(-1 * stAng - swAng / 2) - height / 2;
				break;
			}
			case c_oAscChartDataLabelsPos.inEnd:
			{
                var oPos = this._calculateInEndDLblPosition(stAng, swAng, radius, width, height, centerX, centerY);
                if(!oPos.bError){
                    centerX = oPos.fX;
                    centerY = oPos.fY;
                    break;
                }
				tempCenterX = centerX + (radius) * Math.cos(-1 * stAng - swAng / 2);
				tempCenterY = centerY - (radius) * Math.sin(-1 * stAng - swAng / 2);
				
				if(tempCenterX < centerX && tempCenterY < centerY)
				{
					centerX = tempCenterX;	
					centerY = tempCenterY;
				}
				else if(tempCenterX > centerX && tempCenterY < centerY)
				{
					centerX = tempCenterX - width;
					centerY = tempCenterY;
				}
				else if(tempCenterX < centerX && tempCenterY > centerY)
				{
					centerX = tempCenterX;
					centerY = tempCenterY - height;
				}
				else
				{
					centerX = tempCenterX - width;	
					centerY = tempCenterY - height;
				}
				break;
			}
			case c_oAscChartDataLabelsPos.outEnd:
			{
				tempCenterX = centerX + (radius) * Math.cos(-1 * stAng - swAng / 2);
				tempCenterY = centerY - (radius) * Math.sin(-1 * stAng - swAng / 2);
				
				if(tempCenterX < centerX && tempCenterY < centerY)
				{
					centerX = tempCenterX - width;
					centerY = tempCenterY - height;
				}
				else if(tempCenterX > centerX && tempCenterY < centerY)
				{
					centerX = tempCenterX;
					centerY = tempCenterY - height;
				}
				else if(tempCenterX < centerX && tempCenterY > centerY)
				{
					centerX = tempCenterX - width;
					centerY = tempCenterY;
				}
				else
				{
					centerX = tempCenterX;	
					centerY = tempCenterY;
				}	
				break;
			}
		}
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
		
		return {x: centerX, y: centerY};
	},
	
	
	
	
	//****fast calulate and drawing
	
	_drawPie3DNew: function ()
    {
		var numCache = this._getFirstRealNumCache();
		var brush, pen, val;
		var path;
        for (var i = 0,len = numCache.length; i < len; i++) {
			val = numCache[i];
			brush = val.brush;
			pen = val.pen;
			path = this.paths.series[i];
			
			if(path)
			{
				for(var j = path.length - 1; j >= 0; j--)
				{
					if(path[j] && path[j].frontPath)
					{
						var  props = this.cChartSpace.getParentObjects();
						var duplicateBrush = brush.createDuplicate();
						var cColorMod = new AscFormat.CColorMod;
						
						cColorMod.val = 35000;
						cColorMod.name = "shade";
						
						if(duplicateBrush.fill.color)
							duplicateBrush.fill.color.Mods.addMod(cColorMod);	
						
						duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new AscFormat.CUniColor().RGBA);
						var upPen = AscFormat.CreatePenFromParams(brush, undefined, undefined, undefined, undefined, 0);
						var frontPen = AscFormat.CreatePenFromParams(duplicateBrush, undefined, undefined, undefined, undefined, 0);
						//pen.setFill(duplicateBrush);
						//if(!(i === numCache.length - 1 && j === path.length - 1))
							this.cChartDrawer.drawPath(path[j].frontPath, frontPen, duplicateBrush);
					}
					//if(path[j] && path[j].upPath)
						//this.cChartDrawer.drawPath(path[j].upPath, upPen, brush);
				}
			}
			
			
        }
		
		for (var i = 0,len = numCache.length; i < len; i++) {
			val = numCache[i];
			brush = val.brush;
			pen = val.pen;
			path = this.paths.series[i];
			
			if(path)
			{
				for(var j = path.length - 1; j >= 0; j--)
				{
					if(path[j] && path[j].frontPath)
					{
						var  props = this.cChartSpace.getParentObjects();
						var duplicateBrush = brush.createDuplicate();
						var cColorMod = new AscFormat.CColorMod;
						
						cColorMod.val = 35000;
						cColorMod.name = "shade";
						
						if(duplicateBrush.fill.color)
							duplicateBrush.fill.color.Mods.addMod(cColorMod);	
						
						duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new AscFormat.CUniColor().RGBA);
						var upPen = AscFormat.CreatePenFromParams(brush, undefined, undefined, undefined, undefined, 0);
						var frontPen = AscFormat.CreatePenFromParams(duplicateBrush, undefined, undefined, undefined, undefined, 0);
						//pen.setFill(duplicateBrush);
						//if(!(i === numCache.length - 1 && j === path.length - 1))
							//this.cChartDrawer.drawPath(path[j].frontPath, frontPen, duplicateBrush);
					}
					if(path[j] && path[j].upPath)
						this.cChartDrawer.drawPath(path[j].upPath, upPen, brush);
				}
			}
			
			
        }
    },
	
	_reCalculatePie3DNew: function ()
    {
		var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;

		var numCache = this._getFirstRealNumCache();
		var sumData = this.cChartDrawer._getSumArray(numCache, true);
		
        var radius = Math.min(trueHeight, trueWidth)/2;
		var xCenter = this.chartProp.chartGutter._left + trueWidth/2;
		var yCenter = this.chartProp.chartGutter._top + trueHeight/2;
		
		this.tempAngle = Math.PI/2;
		this.angleFor3D = Math.PI/2;
		
		//рисуем против часовой стрелки, поэтому цикл с конца
		var angle;
        for (var i = numCache.length - 1; i >= 0; i--) {
			angle = Math.abs((parseFloat(numCache[i].val / sumData)) * (Math.PI * 2));
			if(!this.paths.series)
				this.paths.series = [];
			if(sumData === 0)//TODO стоит пересмотреть
				this.paths.series[i] = this._calculateEmptySegment(radius, xCenter, yCenter);
			else
				this.paths.series[i] = this._calculateSegment3D(angle, radius, xCenter, yCenter);
        };
    },
	
	_calculateArc3DNew : function(radius, stAng, swAng, xCenter, yCenter)
	{	
		var properties = this.cChartDrawer.processor3D.calculatePropertiesForPieCharts();
		var depth = properties.depth;
		var radius1 = properties.radius1;
		var radius2 = properties.radius2;
		var pxToMm = this.chartProp.pxToMM;
		
		
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		swAng = this._changeAngle(radius, stAng, swAng, xCenter, yCenter, properties);
		
		stAng = this.angleFor3D;
		
		console.log("swAng: " + swAng);
		
		//корректируем центр
		yCenter = yCenter - depth / 2;
			
		var radiusSpec = (radius1 * radius2) /  Math.sqrt(Math.pow(radius2, 2) * Math.pow((Math.cos(stAng)), 2) + Math.pow(radius1, 2) * Math.pow(Math.sin(stAng),2));
		var radiusSpec2 = (radius1 * radius2) /  Math.sqrt(Math.pow(radius2, 2) * Math.pow((Math.cos(stAng + swAng)), 2) + Math.pow(radius1, 2) * Math.pow(Math.sin(stAng + swAng),2));
		
		var kFY = 1;
		var kFX = 1;
		
		var x0 = (xCenter + radiusSpec*Math.cos(stAng)) * kFX;
		var y0 = (yCenter - radiusSpec*Math.sin(stAng)) * kFY;
		
		var x1 = (xCenter + radiusSpec*Math.cos(stAng)) * kFX;
		var y1 = ((yCenter + depth) - radiusSpec*Math.sin(stAng)) * kFY;
		
		var x2 = (xCenter + radiusSpec2*Math.cos(stAng + swAng)) * kFX;
		var y2 = (yCenter - radiusSpec2*Math.sin(stAng + swAng)) * kFY;
		
		var x3 = (xCenter + radiusSpec2 * Math.cos(stAng + swAng)) * kFX;
		var y3 = ((yCenter + depth) - radiusSpec2 * Math.sin(stAng + swAng)) * kFY;
		
		
		path.moveTo(x0  /pxToMm * pathW, y0 / pxToMm * pathH);
		path.arcTo(radius1 / pxToMm * pathW, radius2 / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swAng*cToDeg);
		path.lnTo(x3  /pxToMm * pathW, y3 / pxToMm * pathH);
		path.arcTo(radius1 / pxToMm * pathW, radius2 / pxToMm * pathH, -1 * stAng*cToDeg - 1 * swAng*cToDeg, 1 * swAng*cToDeg);
		path.lnTo(x0 / pxToMm * pathW, y0 / pxToMm * pathH);
		
		path.recalculate(gdLst);
		var frontPath = path;
		
		
		var path  = new Path();
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		path.lnTo(x0  /pxToMm * pathW, y0 / pxToMm * pathH);
		path.arcTo(radius1 / pxToMm * pathW, radius2 / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swAng*cToDeg);
		path.lnTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		
		path.recalculate(gdLst);
		var upPath = path;
		
		this.angleFor3D += swAng;
		
		return {frontPath: frontPath, upPath: upPath};	
	},
	
	_calculateSegment3DNew: function (angle, radius, xCenter, yCenter)
	{
		if(isNaN(angle))
			return null;
		
		var startAngle = (this.tempAngle);
		var swapAngle   = angle;
		var endAngle   = startAngle + angle;
		
		if(radius < 0)
			radius = 0;
		
		var path = [];		
		//если сегмент проходит 180 или 360 градусов, разбиваем его на два, чтобы боковая грань рисовалась корректно
		if(startAngle < Math.PI && endAngle > Math.PI)
		{
			path.push(this._calculateArc3D(radius, startAngle, Math.PI - startAngle, xCenter, yCenter));
			path.push(this._calculateArc3D(radius, Math.PI, endAngle - Math.PI, xCenter, yCenter));
		}
		else if(startAngle < 2*Math.PI && endAngle > 2*Math.PI)
		{
			path.push(this._calculateArc3D(radius, startAngle, 2*Math.PI - startAngle, xCenter, yCenter));
			path.push(this._calculateArc3D(radius, 2*Math.PI, endAngle - 2*Math.PI, xCenter, yCenter));
		}
		else
			path.push(this._calculateArc3D(radius, startAngle, swapAngle, xCenter, yCenter));
			

        this.tempAngle += angle;
		
		return path;
	}
};


	/** @constructor */
function drawDoughnutChart()
{
	this.tempAngle = null;
	this.paths = {};
}

drawDoughnutChart.prototype =
{
    constructor: drawDoughnutChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this._drawPie();
	},
	
	reCalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this.tempAngle = null;
		this.paths = {};
		this._reCalculatePie();
	},	
	
	_drawPie: function ()
    {
		var brush, pen, val;
		var path;
		var idxPoint, numCache;
		
        for(var n = 0; n < this.chartProp.series.length; n++) {
			numCache = this.chartProp.series[n].val.numRef ? this.chartProp.series[n].val.numRef.numCache : this.chartProp.series[n].val.numLit;
			
			if(!numCache)
				continue;
			
			for (var k = 0; k < numCache.ptCount; k++) {
				
				idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[n], k);
				
				brush = idxPoint ? idxPoint.brush : null;
				pen = idxPoint ? idxPoint.pen : null;
				path = this.paths.series[n][k];
				
				this.cChartDrawer.drawPath(path, pen, brush);
			}
		}
    },
	
	_reCalculatePie: function ()
    {
		var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;

		var sumData;
        var outRadius = Math.min(trueHeight,trueWidth)/2;
		
		//% from out radius  
		var defaultSize = 50;
		var holeSize = this.cChartSpace.chart.plotArea.chart.holeSize ? this.cChartSpace.chart.plotArea.chart.holeSize : defaultSize;
		
		//first ang  
		var firstSliceAng = this.cChartSpace.chart.plotArea.chart.firstSliceAng ? this.cChartSpace.chart.plotArea.chart.firstSliceAng : 0;
		firstSliceAng = (firstSliceAng / 360) * (Math.PI * 2);
		
		//inner radius
		var radius = outRadius * (holeSize / 100);
		var step = (outRadius - radius) / this.chartProp.seriesCount;
		
		var xCenter = this.chartProp.chartGutter._left + trueWidth/2;
		var yCenter = this.chartProp.chartGutter._top + trueHeight/2;
		
		var numCache, idxPoint, angle, curVal, seriesCounter = 0;
		for(var n = 0; n < this.chartProp.series.length; n++)
		{
			this.tempAngle = Math.PI/2;
			numCache = this.chartProp.series[n].val.numRef ? this.chartProp.series[n].val.numRef.numCache : this.chartProp.series[n].val.numLit;
			
			if(!numCache || this.chartProp.series[n].isHidden)
				continue;
			
			sumData = this.cChartDrawer._getSumArray(numCache.pts, true);
			
			//рисуем против часовой стрелки, поэтому цикл с конца
			for (var k = numCache.ptCount - 1; k >= 0; k--) {
				
				idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[n], k);
				curVal = idxPoint ? idxPoint.val : 0;
				angle = Math.abs((parseFloat(curVal / sumData)) * (Math.PI * 2));
				
				if(!this.paths.series)
					this.paths.series = [];
				if(!this.paths.series[n])
					this.paths.series[n] = [];
				
				if(angle)
					this.paths.series[n][k] = this._calculateSegment(angle, radius, xCenter, yCenter, radius + step * (seriesCounter + 1), radius + step * seriesCounter, firstSliceAng);
				else
					this.paths.series[n][k] = null;
			}
			
			if(numCache.pts.length)
				seriesCounter++;
			
		}
    },
	
	_calculateSegment: function (angle, radius, xCenter, yCenter, radius1, radius2, firstSliceAng)
    {
		var startAngle = this.tempAngle - firstSliceAng;
		var endAngle   = angle;
		
		if(radius < 0)
			radius = 0;
		var path = this._calculateArc(radius, startAngle, endAngle, xCenter, yCenter, radius1, radius2);

        this.tempAngle += angle;
		
		return path;
    },
	
	_calculateArc : function(radius, stAng, swAng, xCenter, yCenter, radius1, radius2)
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
		
		var x2 = xCenter + radius1*Math.cos(stAng);
		var y2 = yCenter - radius1*Math.sin(stAng);
		
		var x1 = xCenter + radius2*Math.cos(stAng);
		var y1 = yCenter - radius2*Math.sin(stAng);
		
		var x3 = xCenter + radius1*Math.cos(stAng + swAng);
		var y3 = yCenter - radius1*Math.sin(stAng + swAng);
		
		var x4 = xCenter + radius2*Math.cos(stAng + swAng);
		var y4 = yCenter - radius2*Math.sin(stAng + swAng);
		
		path.moveTo(x1  /pxToMm * pathW, y1 / pxToMm * pathH);
		path.lnTo(x2  /pxToMm * pathW, y2 / pxToMm * pathH);
		path.arcTo(radius1 / pxToMm * pathW, radius1 / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swAng*cToDeg);
		path.lnTo(x4 / pxToMm * pathW, y4 / pxToMm * pathH);
		path.arcTo(radius2 / pxToMm * pathW, radius2 / pxToMm * pathH,  -1 * stAng*cToDeg - swAng*cToDeg, swAng*cToDeg);
		path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		
		path.recalculate(gdLst);
		return path;	
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var pxToMm = this.chartProp.pxToMM;
		
		if(!this.paths.series[ser][val])
			return;
		
		var path = this.paths.series[ser][val].ArrPathCommand;
		var x1 = path[0].X;
		var y1 = path[0].Y;
		
		var x2 = path[1].X;
		var y2 = path[1].Y;
		
		var radius1 = path[2].hR;
		var stAng = path[2].stAng;
		var swAng = path[2].swAng;
		
		var radius2 = path[4].hR;
		var xCenter = path[5].X;
		var yCenter = path[5].Y;
		
		
		var newRadius = radius2 + (radius1 - radius2) / 2;
		var centerX = xCenter + newRadius * Math.cos(-1 * stAng - swAng / 2); 
		var centerY = yCenter - newRadius * Math.sin(-1 * stAng - swAng / 2); 
		
		var point = this.chartProp.series[ser].val.numRef ? this.chartProp.series[ser].val.numRef.numCache.pts[val] : this.chartProp.series[ser].val.numLit.pts[val];
		
		if(!point)
			return;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		switch ( point.compiledDlb.dLblPos )
		{
			case c_oAscChartDataLabelsPos.ctr:
			{
				centerX = centerX  - width / 2;
				centerY = centerY - height / 2;
				break;
			}
			case c_oAscChartDataLabelsPos.inBase:
			{
				centerX = centerX  - width / 2;
				centerY = centerY - height / 2;
				break;
			}
		}
		if(centerX < 0)
			centerX = 0;
		if(centerY < 0)
			centerY = 0;
		
		return {x: centerX, y: centerY};
	}
};


	/** @constructor */
function drawRadarChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cChartSpace = null;
	
	this.paths = {};
}

drawRadarChart.prototype =
{
    constructor: drawRadarChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this._drawLines();
	},
	
	reCalculate : function(chartsDrawer)
    {
		this.paths = {};
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this._calculateLines();
	},
	
	_calculateLines: function ()
	{
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
		var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;
		
		var xCenter = (this.chartProp.chartGutter._left + trueWidth/2) / this.chartProp.pxToMM;
		var yCenter = (this.chartProp.chartGutter._top + trueHeight/2) / this.chartProp.pxToMM;
		
		var y, y1, x, x1, val, nextVal, tempVal, seria, dataSeries;
		var numCache = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache.pts : this.chartProp.series[0].val.numLit.pts;
		var tempAngle = 2 * Math.PI / numCache.length;
		var xDiff = ((trueHeight / 2) / yPoints.length) / this.chartProp.pxToMM;
		var radius, radius1, xFirst, yFirst;
		
		for (var i = 0; i < this.chartProp.series.length; i++) {
		
			seria = this.chartProp.series[i];
			
			dataSeries = seria.val.numRef ? seria.val.numRef.numCache.pts : seria.val.numLit.pts;
			
			if(dataSeries.length == 1)
			{
				n = 0;
				//рассчитываем значения				
				val = this._getYVal(n, i);
				
				//точки находятся внутри диапазона
				y  = val * xDiff; 
				x  = xCenter; 
				
				radius = y;
				
				y = yCenter - radius * Math.cos(n * tempAngle);
				x = x + radius * Math.sin(n * tempAngle);
				
				if(!this.paths.points)
					this.paths.points = [];
				if(!this.paths.points[i])
					this.paths.points[i] = [];

				this.paths.points[i][n] = this.cChartDrawer.calculatePoint(x, y, dataSeries[n].compiledMarker.size, dataSeries[n].compiledMarker.symbol);
			}
			else
			{
				for(var n = 0; n < dataSeries.length - 1; n++)
				{
					//рассчитываем значения				
					val = this._getYVal(n, i);
					nextVal = this._getYVal(n + 1, i);
					
					//точки находятся внутри диапазона

					y  = val * xDiff; 
					y1 = nextVal * xDiff; 
					
					x  = xCenter; 
					x1 = xCenter;
					
					radius = y;
					radius1 = y1;
					
					y = yCenter - radius * Math.cos(n * tempAngle);
					y1 = yCenter - radius1 * Math.cos((n + 1) * tempAngle);
					
					x = x + radius * Math.sin(n * tempAngle);
					x1 = x1 + radius1 * Math.sin((n + 1) * tempAngle);
					
					
					if(!this.paths.series)
						this.paths.series = [];
					if(!this.paths.series[i])
						this.paths.series[i] = [];
					
					this.paths.series[i][n] = this._calculateLine(x, y, x1, y1);
					
					if(n == 0)
					{
						xFirst = x;
						yFirst = y;
					}
						
					
					if(n == dataSeries.length - 2)
						this.paths.series[i][n + 1] = this._calculateLine(x1, y1, xFirst, yFirst);
					
					if(!this.paths.points)
						this.paths.points = [];
					if(!this.paths.points[i])
						this.paths.points[i] = [];
					
					if(dataSeries[n].compiledMarker)
					{
						if(n == 0)
						{
							this.paths.points[i][n] = this.cChartDrawer.calculatePoint(x, y, dataSeries[n].compiledMarker.size, dataSeries[n].compiledMarker.symbol);
							this.paths.points[i][n + 1] = this.cChartDrawer.calculatePoint(x1, y1, dataSeries[n + 1].compiledMarker.size, dataSeries[n + 1].compiledMarker.symbol);
						}
						else
							this.paths.points[i][n + 1] = this.cChartDrawer.calculatePoint(x1, y1, dataSeries[n + 1].compiledMarker.size, dataSeries[n + 1].compiledMarker.symbol);
					}
				}
			}
		}
	},
	
	_getYPosition: function(val, yPoints)
	{
		//позиция в заисимости от положения точек на оси OY
		var result;
		var resPos;
		var resVal;
		var diffVal;
		if(val < yPoints[0].val)
		{
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
		}
		else if(val > yPoints[yPoints.length - 1].val)
		{	
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos + (diffVal / resVal) * resPos;
		}
		else
		{
			for(var s = 0; s < yPoints.length; s++)
			{
				if(val >= yPoints[s].val && val <= yPoints[s + 1].val)
				{
					resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
					resVal = yPoints[s + 1].val - yPoints[s].val;
					result =  - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
					break;
				}
			}
		}
		
		return result;
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var numCache = this.chartProp.series[ser].val.numRef ? this.chartProp.series[ser].val.numRef.numCache : this.chartProp.series[ser].val.numLit;
		var point = numCache.pts[val];
		var path;
		
		if(this.paths.series)
		{
			if(val == numCache.pts.length - 1)
				path = this.paths.series[ser][val - 1].ArrPathCommand[1];
			else
				path = this.paths.series[ser][val].ArrPathCommand[0];
		}
		else if(this.paths.points)
		{
			path = this.paths.points[ser][val].path.ArrPathCommand[0];
		}
		
		if(!path)
			return;
				
		var x = path.X;
		var y = path.Y;
		
		var pxToMm = this.chartProp.pxToMM;
		var constMargin = 5 / pxToMm;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX = x - width/2;
		var centerY = y - height/2;
		
		switch ( point.compiledDlb.dLblPos )
		{
			case c_oAscChartDataLabelsPos.b:
			{
				centerY = centerY + height/2 + constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.bestFit:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.ctr:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.l:
			{
				centerX = centerX - width/2 - constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.r:
			{
				centerX = centerX + width/2 + constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.t:
			{
				centerY = centerY - height/2 - constMargin;
				break;
			}
		}
		
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
			
		return {x: centerX, y: centerY};
	},
	
	_drawLines: function (isRedraw/*isSkip*/)
    {
		var brush, pen, dataSeries, seria, markerBrush, markerPen, numCache;
		
		//this.cShapeDrawer.Graphics.SaveGrState();
		//this.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, this.chartProp.chartGutter._top / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
		for (var i = 0; i < this.chartProp.series.length; i++) {
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;
			
			numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
			dataSeries = numCache.pts;
			for(var n = 0; n < dataSeries.length - 1; n++)
			{
				if(numCache.pts[n].pen)
					pen = numCache.pts[n].pen;
				if(numCache.pts[n].brush)
					brush = numCache.pts[n].brush;
					
				this.cChartDrawer.drawPath(this.paths.series[i][n], pen, brush);
				if(n == dataSeries.length - 2 && this.paths.series[i][n + 1])
					this.cChartDrawer.drawPath(this.paths.series[i][n + 1], pen, brush);
			}
			
			//draw point
			for(var k = 0; k < this.paths.points[i].length; k++)
			{	
				markerBrush = numCache.pts[k].compiledMarker.brush;
				markerPen = numCache.pts[k].compiledMarker.pen;
				
				//frame of point
				if(this.paths.points[i][0].framePaths)
					this.cChartDrawer.drawPath(this.paths.points[i][k].framePaths, markerPen, markerBrush, false);
				//point		
				this.cChartDrawer.drawPath(this.paths.points[i][k].path, markerPen, markerBrush, true);
			}
        }
		//this.cShapeDrawer.Graphics.RestoreGrState();
    },
	
	_getYVal: function(n, i)
	{
		var tempVal;
		var val = 0;
		var numCache;
		if(this.chartProp.subType == "stacked")
		{
			for(var k = 0; k <= i; k++)
			{
				numCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache :  this.chartProp.series[k].val.numLit;
				tempVal = parseFloat(numCache.pts[n].val);
				if(tempVal)
					val += tempVal;
			}
		}
		else if(this.chartProp.subType == "stackedPer")
		{
			var summVal = 0;
			for(var k = 0; k < this.chartProp.series.length; k++)
			{
				numCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache :  this.chartProp.series[k].val.numLit;
				tempVal = parseFloat(numCache.pts[n].val);
				if(tempVal)
				{
					if(k <= i)
						val += tempVal;
					summVal += Math.abs(tempVal);
				}
			}
			val = val / summVal;
		}
		else
		{
			numCache = this.chartProp.series[i].val.numRef ? this.chartProp.series[i].val.numRef.numCache :  this.chartProp.series[i].val.numLit;
			val = parseFloat(numCache.pts[n].val);
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
		
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);
		path.recalculate(gdLst);
		
		return path;
	}
};



	/** @constructor */
function drawScatterChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cChartSpace = null;
	this.paths = {};
}

drawScatterChart.prototype =
{
    constructor: drawScatterChart,
	
	reCalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.paths = {};
		
		this._recalculateScatter();
	},
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this._drawScatter();
	},
	
	_calculateLines: function ()
	{
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
		var points;
		
		var y, y1, y2, y3, x, x1, x2, x3, val, nextVal, tempVal, seria, dataSeries, compiledMarkerSize, compiledMarkerSymbol, idx, numCache;
		for (var i = 0; i < this.chartProp.series.length; i++) {
		
			seria = this.chartProp.series[i];
			
			numCache   = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
			dataSeries = numCache.pts;

			for(var n = 0; n < numCache.ptCount; n++)
			{
				idx = dataSeries[n] && dataSeries[n].idx != null ? dataSeries[n].idx : n;
				
				//рассчитываем значения				
				val = this._getYVal(n, i);
				
				x  = xPoints[n].pos;
				y  = this.cChartDrawer.getYPosition(val, yPoints);
				
				if(!this.paths.points)
					this.paths.points = [];
				if(!this.paths.points[i])
					this.paths.points[i] = [];
					
				if(!points)
					points = [];
				if(!points[i])
					points[i] = [];
				
				
				compiledMarkerSize = dataSeries[n] && dataSeries[n].compiledMarker && dataSeries[n].compiledMarker.size ? dataSeries[n].compiledMarker.size : null;
				compiledMarkerSymbol = dataSeries[n] && dataSeries[n].compiledMarker && dataSeries[n].compiledMarker.symbol ? dataSeries[n].compiledMarker.symbol : null;
				
				if(val != null)
				{
					this.paths.points[i][n] = this.cChartDrawer.calculatePoint(x, y, compiledMarkerSize, compiledMarkerSymbol);
					points[i][n] = {x: x, y: y};
				}	
				else
				{
					this.paths.points[i][n] = null;
					points[i][n] = null;
				}
			}
		}
		
		this._calculateAllLines(points);
	},
	
	_recalculateScatter: function ()
    {
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
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
		
		var nullPositionOX = this.chartProp.nullPositionOX / this.chartProp.pxToMM;
		
		var seria, yVal, xVal, points, x, x1, y, y1, yNumCache, xNumCache, compiledMarkerSize, compiledMarkerSymbol, idxPoint;
		for(var i = 0; i < this.chartProp.series.length; i++)
		{
			seria = this.chartProp.series[i];
			yNumCache = seria.yVal.numRef && seria.yVal.numRef.numCache ? seria.yVal.numRef.numCache : seria.yVal && seria.yVal.numLit ? seria.yVal.numLit : null;
			
			if(!yNumCache)
				continue;
			
			for(var n = 0; n < yNumCache.ptCount; n++)
			{
				yVal = this._getYVal(n, i);
				
				xNumCache = seria.xVal && seria.xVal.numRef ? seria.xVal.numRef.numCache : seria.xVal && seria.xVal.numLit ? seria.xVal.numLit : null;
				if(xNumCache && xNumCache.pts[n])
				{
					if(!isNaN(parseFloat(xNumCache.pts[n].val)))
						xVal = parseFloat(xNumCache.pts[n].val);
					else
						xVal = n + 1;
				}
				else
					xVal = n + 1;
					
					
				idxPoint = this.cChartDrawer.getIdxPoint(seria, n);
				compiledMarkerSize = idxPoint && idxPoint.compiledMarker ? idxPoint.compiledMarker.size : null;
				compiledMarkerSymbol = idxPoint && idxPoint.compiledMarker ? idxPoint.compiledMarker.symbol : null;
				
				
				if(!this.paths.points)
					this.paths.points = [];
				if(!this.paths.points[i])
					this.paths.points[i] = [];
					
				if(!points)
					points = [];
				if(!points[i])
					points[i] = [];
				
				if(yVal != null)
				{
					this.paths.points[i][n] = this.cChartDrawer.calculatePoint(this.cChartDrawer.getYPosition(xVal, xPoints, true), this.cChartDrawer.getYPosition(yVal, yPoints), compiledMarkerSize, compiledMarkerSymbol);
					points[i][n] = {x: xVal, y: yVal};
				}	
				else
				{
					this.paths.points[i][n] = null;
					points[i][n] = null;
				}
			}
		}
		
		this._calculateAllLines(points);
    },
	
	_calculateAllLines: function(points)
	{
		var startPoint, endPoint;
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
		var x, y, x1, y1, isSplineLine;
		
		for(var i = 0; i < points.length; i++)
		{	
			isSplineLine = this.chartProp.series[i].smooth !== false;
			
			if(!points[i])
				continue;
			
			for(var n = 0; n < points[i].length; n++)
			{
				if(!this.paths.series)
					this.paths.series = [];
				if(!this.paths.series[i])
					this.paths.series[i] = [];
					
				if(points[i][n] != null && points[i][n + 1] != null)
				{	
					if(isSplineLine)
					{
						this.paths.series[i][n] = this._calculateSplineLine(points[i], n, xPoints, yPoints);
					}
					else
					{
						x = this.cChartDrawer.getYPosition(points[i][n].x, xPoints, true);
						y = this.cChartDrawer.getYPosition(points[i][n].y, yPoints);
						
						x1 = this.cChartDrawer.getYPosition(points[i][n + 1].x, xPoints, true);
						y1 = this.cChartDrawer.getYPosition(points[i][n + 1].y, yPoints);
						
						this.paths.series[i][n] = this._calculateLine(x, y, x1, y1);
					}					
				}
			}
		}
	},
	
	_getYVal: function(n, i)
	{
		var val = 0;
		var numCache;
		var idxPoint;
		
		numCache = this.chartProp.series[i].yVal.numRef ? this.chartProp.series[i].yVal.numRef.numCache :  this.chartProp.series[i].yVal.numLit;
		idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[i], n);
		val = idxPoint ? parseFloat(idxPoint.val) : null;

		return val;
	},
	
	_drawScatter: function (isRedraw/*isSkip*/)
    {
		var brush, pen, dataSeries, seria, markerBrush, markerPen, numCache;
		
		//TODO 2 раза проходимся по сериям!
		//add clip rect
		this.cChartDrawer.cShapeDrawer.Graphics.SaveGrState();
		this.cChartDrawer.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - 2) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, (this.chartProp.trueHeight + 2) / this.chartProp.pxToMM);
		
		//draw lines
		for (var i = 0; i < this.paths.series.length; i++) {
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;
			
			numCache = seria.yVal.numRef ? seria.yVal.numRef.numCache : seria.yVal.numLit;
			dataSeries = this.paths.series[i];
			
			if(!dataSeries)
				continue;
			
			for(var n = 0; n < dataSeries.length; n++)
			{
				if(numCache.pts[n + 1] && numCache.pts[n + 1].pen)
					pen = numCache.pts[n + 1].pen;
				if(numCache.pts[n + 1] && numCache.pts[n + 1].brush)
					brush = numCache.pts[n + 1].brush;
					
				this.cChartDrawer.drawPath(this.paths.series[i][n], pen, brush);
			}
		}
		//end clip rect
		this.cChartDrawer.cShapeDrawer.Graphics.RestoreGrState();
		
		//draw points
		for (var i = 0; i < this.paths.series.length; i++) {
			//draw point
			for(var k = 0; k < this.paths.points[i].length; k++)
			{	
				seria = this.chartProp.series[i];
				
				numCache = seria.yVal.numRef ? seria.yVal.numRef.numCache : seria.yVal.numLit;
				dataSeries = this.paths.series[i];
				
				if(numCache.pts[k])
				{
					markerBrush = numCache.pts[k].compiledMarker ? numCache.pts[k].compiledMarker.brush : null;
					markerPen = numCache.pts[k].compiledMarker ? numCache.pts[k].compiledMarker.pen : null;
				}
				
				//frame of point
				if(this.paths.points[i][0] && this.paths.points[i][0].framePaths)
					this.cChartDrawer.drawPath(this.paths.points[i][k].framePaths, markerPen, markerBrush, false);
				//point	
				if(this.paths.points[i][k])
					this.cChartDrawer.drawPath(this.paths.points[i][k].path, markerPen, markerBrush, true);
			}
        }
    },
	
	_getYPosition: function(val, yPoints, isOx)
	{
		//позиция в заисимости от положения точек на оси OY
		var result;
		var resPos;
		var resVal;
		var diffVal;
		if(val < yPoints[0].val)
		{
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
		}
		else if(val > yPoints[yPoints.length - 1].val)
		{	
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos + (diffVal / resVal) * resPos;
		}
		else
		{
			for(var s = 0; s < yPoints.length; s++)
			{
				if(val >= yPoints[s].val && val <= yPoints[s + 1].val)
				{
					resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
					resVal = yPoints[s + 1].val - yPoints[s].val;
					if(!isOx)
						result =  - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
					else	
						result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
						
					break;
				}
			}
		}
		
		return result;
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
		
		path.moveTo(x * pathH, y * pathW);
		path.lnTo(x1 * pathH, y1 * pathW);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var point = this.cChartDrawer.getIdxPoint(this.chartProp.series[ser], val);
		
		var path;
		
		if(this.paths.points)
		{
			if(this.paths.points[ser] && this.paths.points[ser][val])
				path = this.paths.points[ser][val].path.ArrPathCommand[0];	
		}
	
		if(!path)
			return;
			
		var x = path.X;
		var y = path.Y;
		
		var pxToMm = this.chartProp.pxToMM;
		var constMargin = 5 / pxToMm;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX = x - width/2;
		var centerY = y - height/2;
		
		switch ( point.compiledDlb.dLblPos )
		{
			case c_oAscChartDataLabelsPos.b:
			{
				centerY = centerY + height/2 + constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.bestFit:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.ctr:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.l:
			{
				centerX = centerX - width/2 - constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.r:
			{
				centerX = centerX + width/2 + constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.t:
			{
				centerY = centerY - height/2 - constMargin;
				break;
			}
		}
		
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
		
		return {x: centerX, y: centerY};
	},
	
	
	_calculateSplineLine : function(points, k, xPoints, yPoints)
	{
		var path  = new Path();
		var splineCoords;
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var x = points[k - 1] ? points[k - 1].x : points[k].x;
		var y = points[k - 1] ? points[k - 1].y : points[k].y;
		
		var x1 = points[k].x;
		var y1 = points[k].y;
		
		var x2 = points[k + 1] ? points[k + 1].x : points[k].x;
		var y2 = points[k + 1] ? points[k + 1].y : points[k].y;
		
		var x3 = points[k + 2] ? points[k + 2].x : points[k + 1] ? points[k + 1].x : points[k].x;
		var y3 = points[k + 2] ? points[k + 2].y : points[k + 1] ? points[k + 1].y : points[k].y;
		
		
		var splineCoords = this.cChartDrawer.calculate_Bezier(x, y, x1, y1, x2, y2, x3, y3);
		
		x = this.cChartDrawer.getYPosition(splineCoords[0].x, xPoints, true);
		y = this.cChartDrawer.getYPosition(splineCoords[0].y, yPoints);
		
		x1 = this.cChartDrawer.getYPosition(splineCoords[1].x, xPoints, true);
		y1 = this.cChartDrawer.getYPosition(splineCoords[1].y, yPoints);
		
		x2 = this.cChartDrawer.getYPosition(splineCoords[2].x, xPoints, true);
		y2 = this.cChartDrawer.getYPosition(splineCoords[2].y, yPoints);
		
		x3 = this.cChartDrawer.getYPosition(splineCoords[3].x, xPoints, true);
		y3 = this.cChartDrawer.getYPosition(splineCoords[3].y, yPoints);
		
		path.moveTo(x * pathW, y * pathH);
		path.cubicBezTo(x1 * pathW, y1 * pathH, x2 * pathW, y2 * pathH, x3 * pathW, y3 * pathH);
		
		path.recalculate(gdLst);
		
		return path;
	}
};


	/** @constructor */
function drawStockChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cChartSpace = null;
	this.paths = {};
}

drawStockChart.prototype =
{
    constructor: drawStockChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this._drawLines();
	},
	
	reCalculate : function(chartsDrawer)
    {
		this.paths = {};
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this._calculateLines();
	},
	
	_calculateLines: function ()
	{	
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
		var trueWidth = this.chartProp.trueWidth;

		var numCache = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache : this.chartProp.series[0].val.numLit;
		var koffX = trueWidth / numCache.pts.length;
		
		var gapWidth = this.cChartSpace.chart.plotArea.chart.upDownBars && this.cChartSpace.chart.plotArea.chart.upDownBars.gapWidth ? this.cChartSpace.chart.plotArea.chart.upDownBars.gapWidth : 150;
		
		var widthBar = koffX / (1 + gapWidth / 100);
		
		var val1, val2, val3, val4, xVal, yVal1, yVal2, yVal3, yVal4, curNumCache, lastNamCache;
		for (var i = 0; i < numCache.pts.length; i++) {
			
			val1 = null, val2 = null, val3 = null, val4 = null;
			val1 = numCache.pts[i].val;
			
			lastNamCache = this.chartProp.series[this.chartProp.series.length - 1].val.numRef ? this.chartProp.series[this.chartProp.series.length - 1].val.numRef.numCache.pts : this.chartProp.series[this.chartProp.series.length - 1].val.pts;
			val4 = lastNamCache[i] ? lastNamCache[i].val : null;
			
			for(var k = 1; k < this.chartProp.series.length - 1; k++)
			{
				curNumCache = this.chartProp.series[k].val.numRef ? this.chartProp.series[k].val.numRef.numCache : this.chartProp.series[k].val.numLit;
				if(curNumCache.pts[i])
				{
					if(k == 1)
					{
						val2 = curNumCache.pts[i].val;
						val3 = curNumCache.pts[i].val;
					}
					else
					{
						if(parseFloat(val2) > parseFloat(curNumCache.pts[i].val))	
							val2 = curNumCache.pts[i].val;
						if(parseFloat(val3) < parseFloat(curNumCache.pts[i].val))	
							val3 = curNumCache.pts[i].val;
					}
				}
			}
			
			if(!this.paths.values)
					this.paths.values = [];
			if(!this.paths.values[i])
				this.paths.values[i] = {};
			
			xVal = this.cChartDrawer.getYPosition(i, xPoints, true);
			yVal1 = this.cChartDrawer.getYPosition(val1, yPoints);
			yVal2 = this.cChartDrawer.getYPosition(val2, yPoints);
			yVal3 = this.cChartDrawer.getYPosition(val3, yPoints);
			yVal4 = this.cChartDrawer.getYPosition(val4, yPoints);
			
			if(val2 !== null && val1 !== null)
				this.paths.values[i].lowLines = this._calculateLine(xVal, yVal2, xVal, yVal1);
			if(val3 && val4)
				this.paths.values[i].highLines = this._calculateLine(xVal, yVal4, xVal, yVal3);
			
			if(val1 !== null && val4 !== null)
			{
				if(parseFloat(val1) > parseFloat(val4))
					this.paths.values[i].downBars = this._calculateUpDownBars(xVal, yVal1, xVal, yVal4, widthBar / this.chartProp.pxToMM);
				else if(val1 && val4)
					this.paths.values[i].upBars = this._calculateUpDownBars(xVal, yVal1, xVal, yVal4, widthBar / this.chartProp.pxToMM);
			}
		}
	},
	
	_getYPosition: function(val, yPoints, isOx)
	{
		//позиция в заисимости от положения точек на оси OY
		var result;
		var resPos;
		var resVal;
		var diffVal;
		if(val < yPoints[0].val)
		{
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
		}
		else if(val > yPoints[yPoints.length - 1].val)
		{	
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos + (diffVal / resVal) * resPos;
		}
		else
		{
			for(var s = 0; s < yPoints.length; s++)
			{
				if(val >= yPoints[s].val && val <= yPoints[s + 1].val)
				{
					resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
					resVal = yPoints[s + 1].val - yPoints[s].val;
					if(!isOx)
						result =  - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
					else	
						result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
						
					break;
				}
			}
		}
		
		return result;
	},

	
	_drawLines: function (isRedraw/*isSkip*/)
    {
		var brush;
		var pen;
		var dataSeries;
		var seria;
		var numCache = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache : this.chartProp.series[0].val.numLit;
		
		for (var i = 0; i < numCache.pts.length; i++) {

			pen = this.cChartSpace.chart.plotArea.chart.calculatedHiLowLines;
				
			this.cChartDrawer.drawPath(this.paths.values[i].lowLines, pen, brush);
			
			this.cChartDrawer.drawPath(this.paths.values[i].highLines, pen, brush);
			
			if(this.paths.values[i].downBars)
			{
				brush = this.cChartSpace.chart.plotArea.chart.upDownBars ? this.cChartSpace.chart.plotArea.chart.upDownBars.downBarsBrush : null;
				pen = this.cChartSpace.chart.plotArea.chart.upDownBars ? this.cChartSpace.chart.plotArea.chart.upDownBars.downBarsPen : null;
				this.cChartDrawer.drawPath(this.paths.values[i].downBars, pen, brush);
			}
			else
			{
				brush = this.cChartSpace.chart.plotArea.chart.upDownBars ? this.cChartSpace.chart.plotArea.chart.upDownBars.upBarsBrush : null;
				pen = this.cChartSpace.chart.plotArea.chart.upDownBars ? this.cChartSpace.chart.plotArea.chart.upDownBars.upBarsPen : null;
				this.cChartDrawer.drawPath(this.paths.values[i].upBars, pen, brush);
			}
        }
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
		
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var pxToMm = this.chartProp.pxToMM;
		var min = this.chartProp.scale[0];
		var max = this.chartProp.scale[this.chartProp.scale.length - 1];

		
		var digHeight = Math.abs(max - min);
		
		if(this.chartProp.min < 0 && this.chartProp.max <= 0)
			min = -1*max;

		var numCache = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache : this.chartProp.series[0].val.numLit;
		var koffX = this.chartProp.trueWidth / numCache.pts.length;
		var koffY = this.chartProp.trueHeight / digHeight;
		
		var point = this.chartProp.series[ser].val.numRef ? this.chartProp.series[ser].val.numRef.numCache.pts[val] : this.chartProp.series[ser].val.numLit.pts[val];
		
		var x = this.chartProp.chartGutter._left + (val)*koffX + koffX/2;
		var y = this.chartProp.trueHeight - (point.val - min)*koffY + this.chartProp.chartGutter._top;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX = x / pxToMm - width/2;
		var centerY = y / pxToMm - height/2;
		var constMargin = 5 / pxToMm;
		
		switch ( point.compiledDlb.dLblPos )
		{
			case c_oAscChartDataLabelsPos.b:
			{
				centerY = centerY + height/2 + constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.bestFit:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.ctr:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.l:
			{
				centerX = centerX - width/2 - constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.r:
			{
				centerX = centerX + width/2 + constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.t:
			{
				centerY = centerY - height/2 - constMargin;
				break;
			}
		}
		
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
			
		return {x: centerX, y: centerY};
	},
	
	_calculateUpDownBars: function(x, y, x1, y1, width)
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
		path.moveTo((x - width/2) * pathW, y * pathH);
		path.lnTo((x - width/2) * pathW, y1 * pathH);
		path.lnTo((x + width/2) * pathW, y1 * pathH);
		path.lnTo((x + width/2) * pathW, y * pathH);
		path.lnTo((x - width/2) * pathW, y * pathH);
		path.recalculate(gdLst);
		
		return path;
	}
};

	/** @constructor */
function drawBubbleChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cChartSpace = null;
	this.paths = {};
}

drawBubbleChart.prototype =
{
    constructor: drawBubbleChart,
	
	reCalculate : function(chartsDrawer)
	{
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.paths = {};
		
		this._recalculateScatter();
	},
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartProp.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this._drawScatter();
	},
	
	_recalculateScatter: function ()
    {
		//соответствует подписям оси категорий(OX)
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
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
		
		var seria, yVal, xVal, points, x, x1, y, y1, yNumCache, xNumCache;
		for(var i = 0; i < this.chartProp.series.length; i++)
		{
			seria = this.chartProp.series[i];
			points = [];
			yNumCache = seria.yVal.numRef.numCache ? seria.yVal.numRef.numCache : seria.yVal.numRef.numLit;
			for(var n = 0; n < yNumCache.pts.length; n++)
			{
				yVal = parseFloat(yNumCache.pts[n].val);
				
				xNumCache = seria.xVal && seria.xVal.numRef ? seria.xVal.numRef.numCache : seria.xVal && seria.xVal.numLit ? seria.xVal.numLit : null;
				if(xNumCache && xNumCache.pts[n] && xNumCache.pts[n].val)
				{
					if(!isNaN(parseFloat(xNumCache.pts[n].val)))
						xVal = parseFloat(xNumCache.pts[n].val);
					else
						xVal = n + 1;
				}
				else
					xVal = n + 1;
				
				points[n] = {x: xVal, y: yVal}
			}
			
			for(var k = 0; k < points.length; k++)
			{
				y = this.cChartDrawer.getYPosition(points[k].y, yPoints);
				x = this.cChartDrawer.getYPosition(points[k].x, xPoints, true);
			
				
				if(!this.paths.points)
					this.paths.points = [];
				if(!this.paths.points[i])
					this.paths.points[i] = [];
				
				this.paths.points[i][k] = this._calculateBubble(x, y, seria.bubbleSize, k);
			}
		}
    },
	
	_drawScatter: function ()
    {
		var seria, brush, pen, markerBrush, markerPen, yNumCache;
		for(var i = 0; i < this.chartProp.series.length; i++)
		{
			seria = this.chartProp.series[i];
			brush = seria.brush;
			pen = seria.pen;
			
			//draw bubble
			if(this.paths.points && this.paths.points[i])
			{
				for(var k = 0; k < this.paths.points[i].length; k++)
				{	
					yNumCache = this.chartProp.series[i].yVal.numRef ? this.chartProp.series[i].yVal.numRef.numCache : this.chartProp.series[i].yVal.numLit;
					markerBrush = yNumCache.pts[k].compiledMarker.brush;
					markerPen = yNumCache.pts[k].compiledMarker.pen;
					
					//point		
					this.cChartDrawer.drawPath(this.paths.points[i][k], markerPen, markerBrush, true);
				}
			}
		}
    },
	
	_getYPosition: function(val, yPoints, isOx)
	{
		//позиция в заисимости от положения точек на оси OY
		var result;
		var resPos;
		var resVal;
		var diffVal;
		if(val < yPoints[0].val)
		{
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
		}
		else if(val > yPoints[yPoints.length - 1].val)
		{	
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			result = yPoints[0].pos + (diffVal / resVal) * resPos;
		}
		else
		{
			for(var s = 0; s < yPoints.length; s++)
			{
				if(val >= yPoints[s].val && val <= yPoints[s + 1].val)
				{
					resPos = Math.abs(yPoints[s + 1].pos - yPoints[s].pos);
					resVal = yPoints[s + 1].val - yPoints[s].val;
					if(!isOx)
						result =  - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
					else	
						result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + yPoints[s].pos;
						
					break;
				}
			}
		}
		
		return result;
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var point;
		if(this.chartProp.series[ser - 1])
			point = this.chartProp.series[ser - 1].yVal.numRef ? this.chartProp.series[ser - 1].yVal.numRef.numCache.pts[val] : this.chartProp.series[ser - 1].yVal.numLit.pts[val];
		else
			point = this.chartProp.series[ser].yVal.numRef ? this.chartProp.series[ser].yVal.numRef.numCache.pts[val] : this.chartProp.series[ser].yVal.numLit.pts[val];
		
		var path;
		
		/*if(this.paths.series && this.paths.series[ser - 1])
		{
			if(val == this.chartProp.series[ser - 1].yVal.numRef.numCache.pts.length - 1)
				path = this.paths.series[ser - 1][val - 1].ArrPathCommand[1];
			else
				path = this.paths.series[ser - 1][val].ArrPathCommand[0];
		}
		else*/ if(this.paths.points)
		{
			if(this.paths.points[ser] && this.paths.points[ser][val])
				path = this.paths.points[ser][val].path.ArrPathCommand[0];	
		}
	
		if(!path)
			return;
			
		var x = path.X;
		var y = path.Y;
		
		var pxToMm = this.chartProp.pxToMM;
		var constMargin = 5 / pxToMm;
		
		var width = point.compiledDlb.extX;
		var height = point.compiledDlb.extY;
		
		var centerX = x - width/2;
		var centerY = y - height/2;
		
		switch ( point.compiledDlb.dLblPos )
		{
			case c_oAscChartDataLabelsPos.b:
			{
				centerY = centerY + height/2 + constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.bestFit:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.ctr:
			{
				break;
			}
			case c_oAscChartDataLabelsPos.l:
			{
				centerX = centerX - width/2 - constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.r:
			{
				centerX = centerX + width/2 + constMargin;
				break;
			}
			case c_oAscChartDataLabelsPos.t:
			{
				centerY = centerY - height/2 - constMargin;
				break;
			}
		}
		
		if(centerX < 0)
			centerX = 0;
		if(centerX + width > this.chartProp.widthCanvas / pxToMm)
			centerX = this.chartProp.widthCanvas / pxToMm - width;
			
		if(centerY < 0)
			centerY = 0;
		if(centerY + height > this.chartProp.heightCanvas / pxToMm)
			centerY = this.chartProp.heightCanvas / pxToMm - height;
		
		return {x: centerX, y: centerY};
	},
	
	_calculateBubble: function(x, y, bubbleSize, k)
	{
		var defaultSize = 4;
		
		if(bubbleSize)
		{
			var maxSize, curSize, yPoints, maxDiamBubble, diffSize, maxArea;
			
			
			maxSize = this.cChartDrawer._getMaxMinValueArray(bubbleSize).max;
			curSize = bubbleSize[k].val;
			
			yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints ? this.cChartSpace.chart.plotArea.valAx.yPoints : this.cChartSpace.chart.plotArea.catAx.yPoints;
			maxDiamBubble = Math.abs(yPoints[1].pos - yPoints[0].pos) * 2;
			
			diffSize = maxSize / curSize;
			
			var isDiam = false;
			
			if(isDiam)
			{
				defaultSize = (maxDiamBubble / diffSize) / 2;
			}
			else
			{
				maxArea = 1 / 4 * (Math.PI * (maxDiamBubble * maxDiamBubble));
				defaultSize = Math.sqrt((maxArea / diffSize) / Math.PI);
			}
		}
		
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		path.moveTo((x + defaultSize) * pathW, y * pathH);
		path.arcTo(defaultSize * pathW, defaultSize * pathW, 0, Math.PI * 2 * cToDeg);

		path.recalculate(gdLst);
		return path;	
	}
};



	/** @constructor */
function gridChart()
{
	this.chartProp = null;
	this.cChartSpace = null;
	this.cChartDrawer = null;
	
	this.paths = {};
}

gridChart.prototype =
{
    constructor: gridChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this._drawHorisontalLines();
		this._drawVerticalLines();
	},
	
	reCalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this.paths = {};
		this._calculateHorisontalLines();
		this._calculateVerticalLines();
	},
	
	_calculateHorisontalLines : function()
	{	
		var stepY = (this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom - this.chartProp.chartGutter._top)/(this.chartProp.numhlines);
		var minorStep = stepY / this.chartProp.numhMinorlines;
		var widthLine = this.chartProp.widthCanvas - (this.chartProp.chartGutter._left + this.chartProp.chartGutter._right);
		
		var bottomMargin = this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom;
		
		var posX = this.chartProp.chartGutter._left;
		var posY;
		var posMinorY;
					
		var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;
		
		var xCenter = (this.chartProp.chartGutter._left + trueWidth/2) / this.chartProp.pxToMM;
		var yCenter = (this.chartProp.chartGutter._top + trueHeight/2) / this.chartProp.pxToMM;
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints ? this.cChartSpace.chart.plotArea.valAx.yPoints : this.cChartSpace.chart.plotArea.catAx.yPoints;
		
		var crossBetween = this.cChartSpace.getValAxisCrossType();
		var crossDiff;
		if(crossBetween == AscFormat.CROSS_BETWEEN_BETWEEN && this.cChartSpace.chart.plotArea.valAx.posY)
			crossDiff = yPoints[1] ? Math.abs((yPoints[1].pos - yPoints[0].pos) / 2) : Math.abs(yPoints[0].pos - this.cChartSpace.chart.plotArea.valAx.posY);
		
		if(this.chartProp.type == "Radar")
		{
			var y, x, path;
			
			//соответствует подписям оси категорий(OX)
			if(this.cChartSpace.chart.plotArea.valAx)
				var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
			
			var numCache = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache.pts : this.chartProp.series[0].val.numLit.pts;
			var tempAngle = 2 * Math.PI / numCache.length;
			var xDiff = ((trueHeight / 2) / yPoints.length) / this.chartProp.pxToMM;
			var radius, xFirst, yFirst;
		}
		
		for(var i = 0; i < yPoints.length; i++)
		{
			if(this.chartProp.type == "Radar")
			{
				path  = new Path();
				for(var k = 0; k < numCache.length; k++)
				{
					y  = i * xDiff; 
					x  = xCenter; 
					
					radius = y;
					
					y = yCenter - radius * Math.cos(k * tempAngle);
					x = x + radius * Math.sin(k * tempAngle);
					

					var pathH = this.chartProp.pathH;
					var pathW = this.chartProp.pathW;
					var gdLst = [];
					
					path.pathH = pathH;
					path.pathW = pathW;
					gdLst["w"] = 1;
					gdLst["h"] = 1;
					
					path.stroke = true;
					var pxToMm = this.chartProp.pxToMM;
					if(k == 0)
					{
						xFirst = x;
						yFirst = y;
						path.moveTo(x * pathW, y * pathH);
					}	
					else
					{
						if(k == numCache.length - 1)
						{
							path.lnTo(x * pathW, y * pathH);
							path.lnTo(xFirst * pathW, yFirst * pathH);
						}
						else
							path.lnTo(x * pathW, y * pathH);
					}
						
				}
				
				path.recalculate(gdLst);
				if(!this.paths.horisontalLines)
					this.paths.horisontalLines = [];
				this.paths.horisontalLines[i] = path;
				
			}
			else
			{
				if(crossDiff)
					posY = (yPoints[i].pos - crossDiff) * this.chartProp.pxToMM;
				else
					posY = yPoints[i].pos * this.chartProp.pxToMM;
				
				
				if(!this.paths.horisontalLines)
					this.paths.horisontalLines = [];
				this.paths.horisontalLines[i] = this._calculateLine(posX, posY, posX + widthLine, posY, i);
				
				//промежуточные линии
				for(var n = 0; n < this.chartProp.numhMinorlines; n++)
				{
					posMinorY = posY + n*minorStep;
					
					if(posMinorY < this.chartProp.chartGutter._top || posMinorY > bottomMargin)
						break;
					
					if(!this.paths.horisontalMinorLines)
						this.paths.horisontalMinorLines = [];
					if(!this.paths.horisontalMinorLines[i])
						this.paths.horisontalMinorLines[i] = [];
					
					this.paths.horisontalMinorLines[i][n] = this._calculateLine(posX, posMinorY, posX + widthLine, posMinorY);
				}
					
				
				if(crossDiff && i == yPoints.length - 1)
				{
					if(crossDiff)
						posY = (yPoints[i].pos + crossDiff) * this.chartProp.pxToMM;
					
					i++;
					if(!this.paths.horisontalLines)
						this.paths.horisontalLines = [];
					this.paths.horisontalLines[i] = this._calculateLine(posX, posY, posX + widthLine, posY);
				}
				
			}
		}
		//для того, чтобы отрисовывался один параллелепипед. необходимо верхний FOR закомментировать и раскомментировать то, что внизу. + убрать отрисовку самого chart'a
		//this.paths.horisontalLines = [];
		//this.paths.horisontalLines.push(this._calculate3DParallalepiped());
	},
	
	_calculateVerticalLines: function()
	{
		var heightLine = this.chartProp.heightCanvas - (this.chartProp.chartGutter._bottom + this.chartProp.chartGutter._top);
		
		var rightMargin = this.chartProp.widthCanvas - this.chartProp.chartGutter._right;
		
		var posY = this.chartProp.chartGutter._top;
		var posX;
		var posMinorX;
		var xPoints = this.cChartSpace.chart.plotArea.valAx.xPoints ? this.cChartSpace.chart.plotArea.valAx.xPoints : this.cChartSpace.chart.plotArea.catAx.xPoints;
		
		var stepX = xPoints[1] ? Math.abs((xPoints[1].pos - xPoints[0].pos)) : (Math.abs(xPoints[0].pos - this.cChartSpace.chart.plotArea.valAx.posX) * 2);
		
		var minorStep = (stepX * this.chartProp.pxToMM) / this.chartProp.numvMinorlines;
		
		if(!xPoints)
			return;
		
		var crossBetween = this.cChartSpace.getValAxisCrossType();
		var crossDiff;
		if(crossBetween == AscFormat.CROSS_BETWEEN_BETWEEN && this.cChartSpace.chart.plotArea.valAx.posX && this.chartProp.type != "HBar")
			crossDiff = xPoints[1] ? Math.abs((xPoints[1].pos - xPoints[0].pos) / 2) : Math.abs(xPoints[0].pos - this.cChartSpace.chart.plotArea.valAx.posX);
			
		for(var i = 0; i < xPoints.length; i++)
		{
			if(crossDiff)
				posX = (xPoints[i].pos - crossDiff) * this.chartProp.pxToMM;
			else
				posX = xPoints[i].pos * this.chartProp.pxToMM;
			
			if(!this.paths.verticalLines)
				this.paths.verticalLines = [];
			this.paths.verticalLines[i] = this._calculateLine(posX, posY, posX, posY + heightLine, i);
			
			//промежуточные линии
			for(var n = 1; n <= this.chartProp.numvMinorlines; n++)
			{
				posMinorX = posX + n*minorStep;
				
				if(posMinorX < this.chartProp.chartGutter._left || posMinorX > rightMargin)
					break;
				
				if(!this.paths.verticalMinorLines)
					this.paths.verticalMinorLines = [];
				if(!this.paths.verticalMinorLines[i])
					this.paths.verticalMinorLines[i] = [];
				
				this.paths.verticalMinorLines[i][n] = this._calculateLine(posMinorX, posY, posMinorX, posY + heightLine);
			}
			
			if(crossDiff && i == xPoints.length - 1)
			{
				if(crossDiff)
					posX = (xPoints[i].pos + crossDiff) * this.chartProp.pxToMM;
				
				i++;
				if(!this.paths.verticalLines)
					this.paths.verticalLines = [];
				this.paths.verticalLines[i] = this._calculateLine(posX, posY, posX, posY + heightLine);
			}
		}
	},
	
	_calculateLine: function(x, y, x1, y1, i)
	{
		var path;
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			var view3DProp = this.cChartSpace.chart.view3D;
			var angleOx = view3DProp && view3DProp.rotX ? (- view3DProp.rotX / 360) * (Math.PI * 2) : 0;
			var angleOy = view3DProp && view3DProp.rotY ? (- view3DProp.rotY / 360) * (Math.PI * 2) : 0;
			var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
			var angleOz = 0;
			
			var rAngAx = this.cChartDrawer.processor3D.view3D.rAngAx;
			var isVertLine = x === x1 ? true : false;
			
			var convertResult = this.cChartDrawer._convertAndTurnPoint(x, y, 0, angleOx, angleOy, angleOz);
			var x1n = convertResult.x;
			var y1n = convertResult.y;
			convertResult = this.cChartDrawer._convertAndTurnPoint(x, y, perspectiveDepth, angleOx, angleOy, angleOz);
			var x2n = convertResult.x;
			var y2n = convertResult.y;
			convertResult = this.cChartDrawer._convertAndTurnPoint(x1, y1, perspectiveDepth, angleOx, angleOy, angleOz);
			var x3n = convertResult.x;
			var y3n = convertResult.y;
			convertResult = this.cChartDrawer._convertAndTurnPoint(x1, y1, 0, angleOx, angleOy, angleOz);
			var x4n = convertResult.x;
			var y4n = convertResult.y;
			
			if(!isVertLine)
			{
				if(rAngAx)
					path = this._calculate3DLine(x1n, y1n, x2n, y2n, x3n, y3n);
				else
				{
					var angleOyAbs = Math.abs(angleOy);
					if(angleOyAbs >= 0 && angleOyAbs < Math.PI / 2)
						path = this._calculate3DLine(x1n, y1n, x2n, y2n, x3n, y3n);
					else if(angleOyAbs >= Math.PI / 2 && angleOyAbs < Math.PI)
						path = this._calculate3DLine(x4n, y4n, x1n, y1n, x2n, y2n);
					else if(angleOyAbs >= Math.PI && angleOyAbs < 3 * Math.PI / 2)
						path = this._calculate3DLine(x1n, y1n, x4n, y4n, x3n, y3n);
					else
						path = this._calculate3DLine(x2n, y2n, x3n, y3n, x4n, y4n);
				}
			}
			else
			{
				if(rAngAx)
					path = this._calculate3DLine(x2n, y2n, x3n, y3n, x4n, y4n);
				else
					path = this._calculate3DLine(x2n, y2n, x3n, y3n, x4n, y4n);
			}
				
		}
		else
			path = this._calculate2DLine(x, y, x1, y1);
		
		return path;
	},
	
	_calculate2DLine: function(x, y, x1, y1)
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
	
	_calculate3DLine: function(x, y, x1, y1, x2, y2, x3, y3)
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
		path.lnTo(x2 / pxToMm * pathW, y2 / pxToMm * pathH);
		if(x3 !== undefined && y3 !== undefined)
		{
			path.lnTo(x3 / pxToMm * pathW, y3 / pxToMm * pathH);
			path.lnTo(x / pxToMm * pathW, y / pxToMm * pathH);
		}
		path.recalculate(gdLst);
		
		return path;
	},
	
	_calculate3DParallalepiped: function()
	{
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		var left = this.chartProp.chartGutter._left;
		var right = this.chartProp.chartGutter._right;
		var top = this.chartProp.chartGutter._top;
		var bottom = this.chartProp.chartGutter._bottom;
		var height = this.chartProp.heightCanvas - (top + bottom);
		var width = this.chartProp.widthCanvas - (left + right);
		
		
		var point0 = this.cChartDrawer._convertAndTurnPoint(left, top, perspectiveDepth);
		var x0 = point0.x;
		var y0 = point0.y;
		
		var point1 = this.cChartDrawer._convertAndTurnPoint(left, top + height, perspectiveDepth);
		var x1 = point1.x;
		var y1 = point1.y;
		
		var point2 = this.cChartDrawer._convertAndTurnPoint(left + width, top + height, perspectiveDepth);
		var x2 = point2.x;
		var y2 = point2.y;
		
		var point3 = this.cChartDrawer._convertAndTurnPoint(left + width, top, perspectiveDepth);
		var x3 = point3.x;
		var y3 = point3.y;
		
		var point4 = this.cChartDrawer._convertAndTurnPoint(left + width, top, 0);
		var x4 = point4.x;
		var y4 = point4.y;
		
		var point5 = this.cChartDrawer._convertAndTurnPoint(left + width, top + height, 0);
		var x5 = point5.x;
		var y5 = point5.y;
		
		var point6 = this.cChartDrawer._convertAndTurnPoint(left, top + height, 0);
		var x6 = point6.x;
		var y6 = point6.y;
		
		var point7 = this.cChartDrawer._convertAndTurnPoint(left, top, 0);
		var x7 = point7.x;
		var y7 = point7.y;
		
		
		
		
		path.stroke = true;
		var pxToMm = this.chartProp.pxToMM;
		
		path.moveTo(x0 / pxToMm * pathW, y0 / pxToMm * pathH);
		path.lnTo(x1 / pxToMm * pathW, y1 / pxToMm * pathH);
		path.lnTo(x2 / pxToMm * pathW, y2 / pxToMm * pathH);
		path.lnTo(x3 / pxToMm * pathW, y3 / pxToMm * pathH);
		path.lnTo(x4 / pxToMm * pathW, y4 / pxToMm * pathH);
		path.lnTo(x5 / pxToMm * pathW, y5 / pxToMm * pathH);
		path.lnTo(x6 / pxToMm * pathW, y6 / pxToMm * pathH);
		path.lnTo(x7 / pxToMm * pathW, y7 / pxToMm * pathH);
		path.lnTo(x0 / pxToMm * pathW, y0 / pxToMm * pathH);
		path.lnTo(x1 / pxToMm * pathW, y1 / pxToMm * pathH);
		path.lnTo(x6 / pxToMm * pathW, y6 / pxToMm * pathH);
		path.lnTo(x5 / pxToMm * pathW, y5 / pxToMm * pathH);
		path.lnTo(x2 / pxToMm * pathW, y2 / pxToMm * pathH);
		path.lnTo(x3 / pxToMm * pathW, y3 / pxToMm * pathH);
		path.lnTo(x0 / pxToMm * pathW, y0 / pxToMm * pathH);
		path.lnTo(x7 / pxToMm * pathW, y7 / pxToMm * pathH);
		path.lnTo(x4 / pxToMm * pathW, y4 / pxToMm * pathH);
		
		
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawHorisontalLines: function()
	{
		var pen;
		var path;
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints ? this.cChartSpace.chart.plotArea.valAx.yPoints : this.cChartSpace.chart.plotArea.catAx.yPoints;
		
		for(var i = 0; i < this.paths.horisontalLines.length; i++)
		{
			if(this.chartProp.type == "HBar")
				pen = this.cChartSpace.chart.plotArea.catAx.compiledMajorGridLines;
			else
				pen = this.cChartSpace.chart.plotArea.valAx.compiledMajorGridLines;
				
			path = this.paths.horisontalLines[i];
			this.cChartDrawer.drawPath(path, pen);
			
			//промежуточные линии
			if(this.paths.horisontalMinorLines && this.paths.horisontalMinorLines[i])
			{
				for(var n = 0; n < this.paths.horisontalMinorLines[i].length ; n++)
				{
					path = this.paths.horisontalMinorLines[i][n];
					if(this.chartProp.type == "HBar")
						pen = this.cChartSpace.chart.plotArea.catAx.compiledMinorGridLines;
					else
						pen = this.cChartSpace.chart.plotArea.valAx.compiledMinorGridLines;
					this.cChartDrawer.drawPath(path, pen);
				}
			}
		}
	},
	
	_drawVerticalLines: function()
	{
		var pen, path;
		var xPoints = this.cChartSpace.chart.plotArea.valAx.xPoints ? this.cChartSpace.chart.plotArea.valAx.xPoints : this.cChartSpace.chart.plotArea.catAx.xPoints;
		
		for(var i = 0; i < this.paths.verticalLines.length; i++)
		{
			if(this.chartProp.type == "HBar")
				pen = this.cChartSpace.chart.plotArea.valAx.compiledMajorGridLines;
			else
				pen = this.cChartSpace.chart.plotArea.catAx.compiledMajorGridLines;
				
			path = this.paths.verticalLines[i];
			this.cChartDrawer.drawPath(path, pen);
			
			//промежуточные линии
			if(this.paths.verticalMinorLines && this.paths.verticalMinorLines[i])
			{
				for(var n = 0; n < this.paths.verticalMinorLines[i].length ; n++)
				{
					path = this.paths.verticalMinorLines[i][n];
					if(this.chartProp.type == "HBar")
						pen = this.cChartSpace.chart.plotArea.valAx.compiledMinorGridLines;
					else
						pen = this.cChartSpace.chart.plotArea.catAx.compiledMinorGridLines;
					this.cChartDrawer.drawPath(path, pen);
				}
			}
		}	
	}
};


	/** @constructor */
function catAxisChart()
{
	this.chartProp = null;
	this.cChartSpace = null;
	this.cChartDrawer = null;
	
	this.paths = {};
}

catAxisChart.prototype =
{
    constructor: catAxisChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this._drawAxis();
		this._drawTickMark();
	},
	
	reCalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this.paths = {};
		if(this.cChartSpace.chart.plotArea.catAx.bDelete != true)
		{
			this._calculateAxis();
			this._calculateTickMark();
		}
	},
	
	_calculateAxis : function()
	{
		var nullPoisition = this.chartProp.nullPositionOX;
		var axisPos;
		if(this.chartProp.type == "HBar")
		{	
			axisPos = this.cChartSpace.chart.plotArea.catAx.posX ? this.cChartSpace.chart.plotArea.catAx.posX : this.cChartSpace.chart.plotArea.catAx.xPos;
			this.paths.axisLine = this._calculateLine( axisPos, this.chartProp.chartGutter._top / this.chartProp.pxToMM, axisPos, (this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom) / this.chartProp.pxToMM);
		}
		else
		{
			//TODO сделать по аналогии с HBAR
			axisPos = this.cChartSpace.chart.plotArea.catAx.posY ? this.cChartSpace.chart.plotArea.catAx.posY : this.cChartSpace.chart.plotArea.catAx.yPos;
			this.paths.axisLine = this._calculateLine( this.chartProp.chartGutter._left / this.chartProp.pxToMM, axisPos, (this.chartProp.widthCanvas - this.chartProp.chartGutter._right) / this.chartProp.pxToMM, axisPos);
		}
	},
	
	_calculateTickMark : function()
	{
		var widthLine = 0, widthMinorLine = 0;
		var crossMajorStep = 0, crossMinorStep = 0;
		
		switch ( this.cChartSpace.chart.plotArea.catAx.majorTickMark )
		{
			case c_oAscTickMark.TICK_MARK_CROSS:
			{
				widthLine = 5;
				crossMajorStep = 5;
				break;
			}
			case c_oAscTickMark.TICK_MARK_IN:
			{
				widthLine = -5;
				break;
			}
			case c_oAscTickMark.TICK_MARK_NONE:
			{
				widthLine = 0;
				break;
			}
			case c_oAscTickMark.TICK_MARK_OUT:
			{
				widthLine = 5;
				break;
			}
		}
		
		switch ( this.cChartSpace.chart.plotArea.catAx.minorTickMark )
		{
			case c_oAscTickMark.TICK_MARK_CROSS:
			{
				widthMinorLine = 3;
				crossMinorStep = 3;
				break;
			}
			case c_oAscTickMark.TICK_MARK_IN:
			{
				widthMinorLine = -3;
				break;
			}
			case c_oAscTickMark.TICK_MARK_NONE:
			{
				widthMinorLine = 0;
				break;
			}
			case c_oAscTickMark.TICK_MARK_OUT:
			{
				widthMinorLine = 3;
				break;
			}
		}
		
		if(this.chartProp.type == "HBar")
		{
			widthMinorLine = - widthMinorLine;
			widthLine = - widthLine;
			crossMajorStep = - crossMajorStep;
			crossMinorStep = - crossMinorStep;
		}
		
		var orientation = this.cChartSpace && this.cChartSpace.chart.plotArea.valAx ? this.cChartSpace.chart.plotArea.valAx.scaling.orientation : ORIENTATION_MIN_MAX;
		if(orientation !== ORIENTATION_MIN_MAX)
		{
			widthMinorLine = - widthMinorLine;
			widthLine = - widthLine;
			crossMajorStep = - crossMajorStep;
			crossMinorStep = - crossMinorStep;
		}
		
		if(!(widthLine === 0 && widthMinorLine === 0))
		{	
			//исчключение для вертикальной оси
			if(this.chartProp.type == "HBar")
			{
				this._calculateVerticalTickMarks(widthLine, widthMinorLine, crossMajorStep, crossMinorStep);
				
			}
			else//для горизонтальной оси
			{
				this._calculateHorisontalTickMarks(widthLine, widthMinorLine, crossMajorStep, crossMinorStep);
			}
		}
	},
	
	_calculateVerticalTickMarks: function(widthLine, widthMinorLine, crossMajorStep, crossMinorStep)
	{
		var orientation = this.cChartSpace && this.cChartSpace.chart.plotArea.catAx ? this.cChartSpace.chart.plotArea.catAx.scaling.orientation : ORIENTATION_MIN_MAX;
		var yPoints = this.cChartSpace.chart.plotArea.catAx.yPoints;

		var stepY = yPoints[1] ? Math.abs(yPoints[1].pos - yPoints[0].pos) : Math.abs(yPoints[0].pos - this.chartProp.chartGutter._bottom / this.chartProp.pxToMM);
		var minorStep = stepY / this.chartProp.numhMinorlines;
		
		var posX = this.cChartSpace.chart.plotArea.catAx.posX ? this.cChartSpace.chart.plotArea.catAx.posX : this.cChartSpace.chart.plotArea.catAx.xPos;

		var posY, posMinorY, k;
		
		//сдвиг, если положение оси - между делениями
		var firstDiff = 0, posYtemp;
		if(this.cChartSpace.getValAxisCrossType() == AscFormat.CROSS_BETWEEN_BETWEEN)
			firstDiff = yPoints[1] ? Math.abs(yPoints[1].pos - yPoints[0].pos) : Math.abs(yPoints[0].pos - this.cChartSpace.chart.plotArea.valAx.posY) * 2;
			
		var tickMarkSkip = this.cChartSpace.chart.plotArea.catAx.tickMarkSkip ? this.cChartSpace.chart.plotArea.catAx.tickMarkSkip : 1;
		
		if(orientation !== ORIENTATION_MIN_MAX)
		{
			minorStep = - minorStep;
			firstDiff = - firstDiff;
		}
		
		for(var i = 0; i < yPoints.length; i++)
		{
			k = i * tickMarkSkip;
			if(k >= yPoints.length)
				break;
			
			//основные линии
			posY = yPoints[k].pos + firstDiff / 2;
			
			if(!this.paths.tickMarks)
				this.paths.tickMarks = [];
			this.paths.tickMarks[i] = this._calculateLine(posX, posY, posX + widthLine / this.chartProp.pxToMM, posY);
			
			if(((i + 1) * tickMarkSkip) === yPoints.length)//если последняя основная линия, то рисуем её
			{
				posYtemp = yPoints[yPoints.length - 1].pos - firstDiff / 2;
				this.paths.tickMarks[i + 1] = this._calculateLine(posX - crossMajorStep / this.chartProp.pxToMM, posYtemp, posX + widthLine / this.chartProp.pxToMM, posYtemp);
			}
				
			
			//промежуточные линии
			if(widthMinorLine !== 0)
			{
				for(var n = 1; n < this.chartProp.numhMinorlines; n++)
				{
					posMinorY = posY - n * minorStep * tickMarkSkip;
					
					if(((posMinorY < yPoints[yPoints.length - 1].pos - firstDiff / 2) && orientation == ORIENTATION_MIN_MAX) || ((posMinorY > yPoints[yPoints.length - 1].pos - firstDiff / 2) && orientation !== ORIENTATION_MIN_MAX))
						break;
					
					if(!this.paths.minorTickMarks)
						this.paths.minorTickMarks = [];
					if(!this.paths.minorTickMarks[i])
						this.paths.minorTickMarks[i] = [];
					
					this.paths.minorTickMarks[i][n] = this._calculateLine(posX - crossMinorStep / this.chartProp.pxToMM, posMinorY, posX + widthMinorLine / this.chartProp.pxToMM, posMinorY);
				}
			}
		}
	},
	
	_calculateHorisontalTickMarks: function(widthLine, widthMinorLine, crossMajorStep, crossMinorStep)
	{
		var orientation = this.cChartSpace && this.cChartSpace.chart.plotArea.catAx ? this.cChartSpace.chart.plotArea.catAx.scaling.orientation : ORIENTATION_MIN_MAX;
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
				
		var stepX = xPoints[1] ? Math.abs(xPoints[1].pos - xPoints[0].pos) : Math.abs(xPoints[0].pos - this.cChartSpace.chart.plotArea.catAx.posX) * 2;
		var minorStep = stepX / this.chartProp.numvMinorlines;
		
		var posY = this.cChartSpace.chart.plotArea.catAx.posY ? this.cChartSpace.chart.plotArea.catAx.posY : this.cChartSpace.chart.plotArea.catAx.yPos;
		var posX, posMinorX, k;
		
		var firstDiff = 0, posXtemp;
		if(this.cChartSpace.getValAxisCrossType() == AscFormat.CROSS_BETWEEN_BETWEEN && this.chartProp.type != "Scatter")
		{
			if(xPoints[1])
				firstDiff = Math.abs(xPoints[1].pos - xPoints[0].pos);
			else if(this.cChartSpace.chart.plotArea.valAx.posX)
				firstDiff = Math.abs(this.cChartSpace.chart.plotArea.valAx.posX - xPoints[0].pos) * 2;
		}
		
		var tickMarkSkip = this.cChartSpace.chart.plotArea.catAx.tickMarkSkip ? this.cChartSpace.chart.plotArea.catAx.tickMarkSkip : 1;
		
		if(orientation !== ORIENTATION_MIN_MAX)
		{
			minorStep = - minorStep;
			firstDiff = - firstDiff;
		}
		
		//сам рассчёт основных и промежуточных линий
		for(var i = 0; i < xPoints.length; i++)
		{				
			k = i * tickMarkSkip;
			if(k >= xPoints.length)
				break;
			
			posX = xPoints[k].pos - firstDiff / 2;
			if(!this.paths.tickMarks)
				this.paths.tickMarks = [];
			this.paths.tickMarks[i] = this._calculateLine(posX, posY - crossMajorStep / this.chartProp.pxToMM, posX, posY + widthLine / this.chartProp.pxToMM);
			
			if(((i + 1) * tickMarkSkip) === xPoints.length)//если последняя основная линия, то рисуем её
			{
				posXtemp = xPoints[xPoints.length - 1].pos + firstDiff / 2;
				this.paths.tickMarks[i + 1] = this._calculateLine(posXtemp, posY - crossMajorStep / this.chartProp.pxToMM, posXtemp, posY + widthLine / this.chartProp.pxToMM);
			}
			
			//промежуточные линии
			if(widthMinorLine !== 0)
			{
				for(var n = 1; n < this.chartProp.numvMinorlines; n++)
				{
					posMinorX = posX + n * minorStep * tickMarkSkip;
					
					if(((posMinorX > xPoints[xPoints.length - 1].pos + firstDiff / 2) && orientation == ORIENTATION_MIN_MAX) || ((posMinorX < xPoints[xPoints.length - 1].pos + firstDiff / 2) && orientation !== ORIENTATION_MIN_MAX))
						break;
					
					if(!this.paths.minorTickMarks)
						this.paths.minorTickMarks = [];
					if(!this.paths.minorTickMarks[i])
						this.paths.minorTickMarks[i] = [];
					
					this.paths.minorTickMarks[i][n] = this._calculateLine(posMinorX, posY - crossMinorStep / this.chartProp.pxToMM, posMinorX, posY + widthMinorLine / this.chartProp.pxToMM);
				}
			}
		}
	},
	
	_calculateLine: function(x, y, x1, y1)
	{
	
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			var view3DProp = this.cChartSpace.chart.view3D;
			var angleOx = view3DProp && view3DProp.rotX ? (- view3DProp.rotX / 360) * (Math.PI * 2) : 0;
			var angleOy = view3DProp && view3DProp.rotY ? (- view3DProp.rotY / 360) * (Math.PI * 2) : 0;
			var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
			var angleOz = 0;
			
			var z = this.cChartDrawer.processor3D.calculateZPositionCatAxis();
			
			var convertResult = this.cChartDrawer._convertAndTurnPoint(x * this.chartProp.pxToMM, y * this.chartProp.pxToMM, z, angleOx, angleOy, angleOz);
			x = convertResult.x / this.chartProp.pxToMM;
			y = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(x1 * this.chartProp.pxToMM, y1 * this.chartProp.pxToMM, z, angleOx, angleOy, angleOz);
			x1 = convertResult.x / this.chartProp.pxToMM;
			y1 = convertResult.y / this.chartProp.pxToMM;
		}

		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawAxis: function()
	{
		var pen;
		var path;
	
		pen = this.cChartSpace.chart.plotArea.catAx.compiledLn;	
		path = this.paths.axisLine;
		
		this.cChartDrawer.drawPath(path, pen);
	},
	
	_drawTickMark: function()
	{
		var pen, path;
		if(this.paths.tickMarks)
		{
			for(var i = 0; i < this.paths.tickMarks.length; i++)
			{
				pen = this.cChartSpace.chart.plotArea.catAx.compiledTickMarkLn;
					
				path = this.paths.tickMarks[i];
				this.cChartDrawer.drawPath(path, pen);
				
				//промежуточные линии
				if(this.paths.minorTickMarks && this.paths.minorTickMarks[i])
				{
					for(var n = 0; n < this.paths.minorTickMarks[i].length ; n++)
					{
						path = this.paths.minorTickMarks[i][n];
						this.cChartDrawer.drawPath(path, pen);
					}
				}
			}	
		}
	}
};


	/** @constructor */
function valAxisChart()
{
	this.chartProp = null;
	this.cChartSpace = null;
	this.cChartDrawer = null;
	
	this.paths = {};
}

valAxisChart.prototype =
{
    constructor: valAxisChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this._drawAxis();
		this._drawTickMark();
	},
	
	reCalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this.paths = {};
		if(this.cChartSpace.chart.plotArea.valAx.bDelete != true)
		{
			this._calculateAxis();
			this._calculateTickMark();
		}
	},
	
	_calculateAxis : function()
	{
		var nullPoisition = this.cChartSpace.chart.plotArea.valAx.posX != undefined ? this.cChartSpace.chart.plotArea.valAx.posX : this.cChartSpace.chart.plotArea.valAx.xPos;

		if(this.chartProp.type == "HBar")
		{	
			nullPoisition = this.cChartSpace.chart.plotArea.valAx.posY;
			this.paths.axisLine = this._calculateLine( this.chartProp.chartGutter._left / this.chartProp.pxToMM, nullPoisition, (this.chartProp.widthCanvas - this.chartProp.chartGutter._right) / this.chartProp.pxToMM, nullPoisition );
		}
		else
		{
			this.paths.axisLine = this._calculateLine( nullPoisition, this.chartProp.chartGutter._top / this.chartProp.pxToMM, nullPoisition, (this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom) / this.chartProp.pxToMM );
		}
	},
	
	_calculateTickMark : function()
	{
		var widthLine = 0, widthMinorLine = 0;
		var crossMajorStep = 0;
		var crossMinorStep = 0;
		switch ( this.cChartSpace.chart.plotArea.valAx.majorTickMark )
		{
			case c_oAscTickMark.TICK_MARK_CROSS:
			{
				widthLine = 5;
				crossMajorStep = 5;
				break;
			}
			case c_oAscTickMark.TICK_MARK_IN:
			{
				widthLine = 5;
				break;
			}
			case c_oAscTickMark.TICK_MARK_NONE:
			{
				widthLine = 0;
				break;
			}
			case c_oAscTickMark.TICK_MARK_OUT:
			{
				widthLine = -5;
				break;
			}
		}
		
		switch ( this.cChartSpace.chart.plotArea.valAx.minorTickMark )
		{
			case c_oAscTickMark.TICK_MARK_CROSS:
			{
				widthMinorLine = 3;
				crossMinorStep = 3;
				break;
			}
			case c_oAscTickMark.TICK_MARK_IN:
			{
				widthMinorLine = 3;
				break;
			}
			case c_oAscTickMark.TICK_MARK_NONE:
			{
				widthMinorLine = 0;
				break;
			}
			case c_oAscTickMark.TICK_MARK_OUT:
			{
				widthMinorLine = -3;
				break;
			}
		}
		
		if(this.chartProp.type == "HBar")
		{
			widthMinorLine = - widthMinorLine;
			widthLine = - widthLine;
			crossMajorStep = - crossMajorStep;
			crossMinorStep = - crossMinorStep;
		}
		
		var orientation = this.cChartSpace && this.cChartSpace.chart.plotArea.catAx ? this.cChartSpace.chart.plotArea.catAx.scaling.orientation : ORIENTATION_MIN_MAX;
		if(orientation !== ORIENTATION_MIN_MAX)
		{
			widthMinorLine = - widthMinorLine;
			widthLine = - widthLine;
			crossMajorStep = - crossMajorStep;
			crossMinorStep = - crossMinorStep;
		}
		
		if(!(widthLine === 0 && widthMinorLine === 0))
		{
			if(this.chartProp.type == "HBar")
			{
				var yPoints = this.cChartSpace.chart.plotArea.valAx.xPoints;
				
				var stepX = yPoints[1] ? Math.abs(yPoints[1].pos - yPoints[0].pos) : Math.abs(yPoints[1].pos - this.chartProp.chartGutter._bottom / this.chartProp.pxToMM);
				var minorStep = stepX / this.chartProp.numvMinorlines;
				
				var posY = this.cChartSpace.chart.plotArea.valAx.posY;
				var posX;
				var posMinorX;
				for(var i = 0; i < yPoints.length; i++)
				{
					posX = yPoints[i].pos;
					if(!this.paths.tickMarks)
						this.paths.tickMarks = [];
					this.paths.tickMarks[i] = this._calculateLine(posX, posY - crossMajorStep / this.chartProp.pxToMM, posX, posY + widthLine / this.chartProp.pxToMM);
					
					//промежуточные линии
					if(widthMinorLine !== 0)
					{
						for(var n = 0; n < this.chartProp.numvMinorlines; n++)
						{
							posMinorX = posX + n * minorStep;
							if(!this.paths.minorTickMarks)
								this.paths.minorTickMarks = [];
							if(!this.paths.minorTickMarks[i])
								this.paths.minorTickMarks[i] = [];
							
							this.paths.minorTickMarks[i][n] = this._calculateLine(posMinorX, posY - crossMinorStep / this.chartProp.pxToMM, posMinorX, posY + widthMinorLine / this.chartProp.pxToMM);
						}
					}
				}
			}
			else
			{
				var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;

				var stepY = yPoints[1] ? Math.abs(yPoints[1].pos - yPoints[0].pos) : Math.abs(yPoints[0].pos - this.chartProp.chartGutter._bottom / this.chartProp.pxToMM);
				var minorStep = stepY / this.chartProp.numhMinorlines;
				
				var posX = this.cChartSpace.chart.plotArea.valAx.posX ? this.cChartSpace.chart.plotArea.valAx.posX : this.cChartSpace.chart.plotArea.valAx.xPos;

				var posY;
				var posMinorY;
				for(var i = 0; i < yPoints.length; i++)
				{
					//основные линии
					posY = yPoints[i].pos;
					
					if(!this.paths.tickMarks)
						this.paths.tickMarks = [];
					this.paths.tickMarks[i] = this._calculateLine(posX - crossMajorStep / this.chartProp.pxToMM, posY, posX + widthLine / this.chartProp.pxToMM, posY);
					
					//промежуточные линии
					if(widthMinorLine !== 0)
					{
						for(var n = 0; n < this.chartProp.numhMinorlines; n++)
						{
							posMinorY = posY - n * minorStep;
							if(!this.paths.minorTickMarks)
								this.paths.minorTickMarks = [];
							if(!this.paths.minorTickMarks[i])
								this.paths.minorTickMarks[i] = [];
							
							this.paths.minorTickMarks[i][n] = this._calculateLine(posX - crossMinorStep / this.chartProp.pxToMM, posMinorY, posX + widthMinorLine / this.chartProp.pxToMM, posMinorY);
						}
					}
				}
			}
		}
	},
	
	_calculateLine: function(x, y, x1, y1)
	{
		
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			var z = this.cChartDrawer.processor3D.calculateZPositionValAxis();
			
			var convertResult = this.cChartDrawer._convertAndTurnPoint(x * this.chartProp.pxToMM, y * this.chartProp.pxToMM, z);
			x = convertResult.x / this.chartProp.pxToMM;
			y = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(x1 * this.chartProp.pxToMM, y1 * this.chartProp.pxToMM, z);
			x1 = convertResult.x / this.chartProp.pxToMM;
			y1 = convertResult.y / this.chartProp.pxToMM;
		}
		
		var path  = new Path();
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawAxis: function()
	{
		var pen;
		var path;
	
		pen = this.cChartSpace.chart.plotArea.valAx.compiledLn;
		path = this.paths.axisLine;
		this.cChartDrawer.drawPath(path, pen);
	},
	
	_drawTickMark: function()
	{
		var pen, path;
		if(!this.paths.tickMarks)
			return;
		
		for(var i = 0; i < this.paths.tickMarks.length; i++)
		{
			pen = this.cChartSpace.chart.plotArea.valAx.compiledTickMarkLn;
				
			path = this.paths.tickMarks[i];
			this.cChartDrawer.drawPath(path, pen);
			
			//промежуточные линии
			if(i != (this.paths.tickMarks.length - 1) && this.paths.minorTickMarks)
			{
				for(var n = 0; n < this.paths.minorTickMarks[i].length ; n++)
				{
					path = this.paths.minorTickMarks[i][n];
					this.cChartDrawer.drawPath(path, pen);
				}
			}
		}	
	}
};

	/** @constructor */
function serAxisChart()
{
	this.chartProp = null;
	this.cChartSpace = null;
	this.cChartDrawer = null;
	
	this.paths = {};
}

serAxisChart.prototype =
{
    constructor: serAxisChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this._drawAxis();
		this._drawTickMark();
	},
	
	reCalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this.paths = {};
		if(this.cChartSpace.chart.plotArea.serAx && this.cChartSpace.chart.plotArea.serAx.bDelete != true)
		{
			this._calculateAxis();
			this._calculateTickMark();
		}
	},
	
	_calculateAxis : function()
	{
		var nullPoisition = this.cChartSpace.chart.plotArea.valAx.posX != undefined ? this.cChartSpace.chart.plotArea.valAx.posX : this.cChartSpace.chart.plotArea.valAx.xPos;
		var nullPositionOx = this.chartProp.nullPositionOX;
		
		var view3DProp = this.cChartSpace.chart.view3D;
		var angleOx = view3DProp && view3DProp.rotX ? (- view3DProp.rotX / 360) * (Math.PI * 2) : 0;
		var angleOy = view3DProp && view3DProp.rotY ? (- view3DProp.rotY / 360) * (Math.PI * 2) : 0;
		var angleOz = 0;
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		
		//var z = this.cChartDrawer.processor3D.calculateZPositionValAxis();
		
		var x = this.chartProp.widthCanvas - this.chartProp.chartGutter._right;
		var y = nullPositionOx;
		var convertResult = this.cChartDrawer._convertAndTurnPoint(x, y, 0, angleOx, angleOy, angleOz);
		x = convertResult.x / this.chartProp.pxToMM;
		y = convertResult.y / this.chartProp.pxToMM;
		
		var x1 = this.chartProp.widthCanvas - this.chartProp.chartGutter._right;
		var y1 = nullPositionOx;
		convertResult = this.cChartDrawer._convertAndTurnPoint(x1, y1, perspectiveDepth, angleOx, angleOy, angleOz);
		x1 = convertResult.x / this.chartProp.pxToMM;
		y1 = convertResult.y / this.chartProp.pxToMM;

		
		this.paths.axisLine = this._calculateLine(x, y, x1, y1);
	},
	
	_calculateTickMark : function()
	{
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		
		var tickmarksProps = this._getTickmarksProps();
		
		var widthLine = tickmarksProps.widthLine;
		var crossMajorStep = tickmarksProps.crossMajorStep;
		
		if(widthLine !== 0)
		{
			var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;

			var stepY = perspectiveDepth / this.chartProp.seriesCount;
			var minorStep = stepY / this.chartProp.numhMinorlines;
			
			var posY;
			var posMinorY;
			
			var startX = this.chartProp.widthCanvas - this.chartProp.chartGutter._right;
			var startY = this.chartProp.nullPositionOX;
			
			for(var i = 0; i <= this.chartProp.seriesCount; i++)
			{
				//основные линии
				if(!this.paths.tickMarks)
					this.paths.tickMarks = [];
				
				var convertResult = this.cChartDrawer._convertAndTurnPoint(startX, startY, i * stepY);
				var x = convertResult.x / this.chartProp.pxToMM;
				var y = convertResult.y / this.chartProp.pxToMM;
				
				this.paths.tickMarks[i] = this._calculateLine(x, y, x + widthLine / this.chartProp.pxToMM, y);
			}
		}
	},
	
	_getTickmarksProps: function()
	{
		var widthLine = 0;
		var crossMajorStep = 0;

		switch ( this.cChartSpace.chart.plotArea.valAx.majorTickMark )
		{
			case c_oAscTickMark.TICK_MARK_CROSS:
			{
				widthLine = -5;
				crossMajorStep = 5;
				break;
			}
			case c_oAscTickMark.TICK_MARK_IN:
			{
				widthLine = -5;
				break;
			}
			case c_oAscTickMark.TICK_MARK_NONE:
			{
				widthLine = 0;
				break;
			}
			case c_oAscTickMark.TICK_MARK_OUT:
			{
				widthLine = 5;
				break;
			}
		}
		
		var orientation = this.cChartSpace && this.cChartSpace.chart.plotArea.catAx ? this.cChartSpace.chart.plotArea.catAx.scaling.orientation : ORIENTATION_MIN_MAX;
		if(orientation !== ORIENTATION_MIN_MAX)
		{
			widthLine = - widthLine;
			crossMajorStep = - crossMajorStep;
		}
		
		return {widthLine: widthLine, crossMajorStep: crossMajorStep};
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
		
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);
		path.recalculate(gdLst);
		
		return path;
	},
	
	_drawAxis: function()
	{
		//TODO добавлять compiledLn, как в случае с другими осями
		var pen = this.cChartSpace.chart.plotArea.serAx ? this.cChartSpace.chart.plotArea.serAx.compiledLn : null;	
		var path = this.paths.axisLine;
		
		this.cChartDrawer.drawPath(path, pen);
	},
	
	_drawTickMark: function()
	{
		var pen, path;
		if(!this.paths.tickMarks)
			return;
		
		for(var i = 0; i < this.paths.tickMarks.length; i++)
		{
			pen = this.cChartSpace.chart.plotArea.serAx ? this.cChartSpace.chart.plotArea.serAx.compiledTickMarkLn : null;
				
			path = this.paths.tickMarks[i];
			this.cChartDrawer.drawPath(path, pen);
		}	
	}
};

	/** @constructor */
function floor3DChart()
{
	this.chartProp = null;
	this.cChartSpace = null;
	this.cChartDrawer = null;
	
	this.paths = {};
}

floor3DChart.prototype =
{
    constructor: floor3DChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this._draw();
	},
	
	recalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this.paths = {};
		this._calculate();
	},
	
	_calculate : function()
	{
		var nullPositionOy = this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom;	
		var maxPositionOy = this.chartProp.chartGutter._top;
		var yPoints = this.cChartSpace.chart.plotArea.valAx ? this.cChartSpace.chart.plotArea.valAx.yPoints : null;
		if(yPoints && yPoints[0] && yPoints[yPoints.length - 1])
		{
			nullPositionOy = yPoints[0].pos > yPoints[yPoints.length - 1].pos ? yPoints[0].pos * this.chartProp.pxToMM : yPoints[yPoints.length - 1].pos * this.chartProp.pxToMM;
			maxPositionOy = yPoints[0].pos < yPoints[yPoints.length - 1].pos ? yPoints[0].pos * this.chartProp.pxToMM : yPoints[yPoints.length - 1].pos * this.chartProp.pxToMM;
		}
		
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		var convertResult, x1n, y1n, x2n, y2n, x3n, y3n, x4n, y4n;
		if(this.chartProp.type == "HBar")
		{
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, 0);
			x1n = convertResult.x / this.chartProp.pxToMM;
			y1n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, maxPositionOy, 0);
			x2n = convertResult.x / this.chartProp.pxToMM;
			y2n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, maxPositionOy, perspectiveDepth);
			x3n = convertResult.x / this.chartProp.pxToMM;
			y3n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, perspectiveDepth);
			x4n = convertResult.x / this.chartProp.pxToMM;
			y4n = convertResult.y / this.chartProp.pxToMM;
		}
		else
		{
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, 0);
			x1n = convertResult.x / this.chartProp.pxToMM;
			y1n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, perspectiveDepth);
			x2n = convertResult.x / this.chartProp.pxToMM;
			y2n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, nullPositionOy, perspectiveDepth);
			x3n = convertResult.x / this.chartProp.pxToMM;
			y3n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, nullPositionOy, 0);
			x4n = convertResult.x / this.chartProp.pxToMM;
			y4n = convertResult.y / this.chartProp.pxToMM;
		}
		
		this.paths.chartFloor = this.cChartDrawer.calculatePolygon([{x: x1n, y: y1n}, {x: x2n, y: y2n}, {x: x3n, y: y3n}, {x: x4n, y: y4n}]);
	},
		
	_draw: function()
	{
		//TODO цвет заливки неправильно выставляется при чтении. поэтому использую пока цвет сетки
		var brush = this.cChartSpace.chart.floor ? this.cChartSpace.chart.floor.brush : null;
		var pen = this.cChartSpace.chart.floor ? this.cChartSpace.chart.floor.pen : null;
		var path = this.paths.chartFloor;
		
		this.cChartDrawer.drawPath(path, pen, brush);
	}

};

	/** @constructor */
function sideWall3DChart()
{
	this.chartProp = null;
	this.cChartSpace = null;
	this.cChartDrawer = null;
	
	this.paths = {};
}

sideWall3DChart.prototype =
{
	constructor: sideWall3DChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this._draw();
	},
	
	recalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this.paths = {};
		this._calculate();
	},
	
	_calculate : function()
	{
		var nullPositionOy = this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom;	
		var maxPositionOy = this.chartProp.chartGutter._top;
		var yPoints = this.cChartSpace.chart.plotArea.valAx ? this.cChartSpace.chart.plotArea.valAx.yPoints : null;
		if(yPoints && yPoints[0] && yPoints[yPoints.length - 1])
		{
			nullPositionOy = yPoints[0].pos > yPoints[yPoints.length - 1].pos ? yPoints[0].pos * this.chartProp.pxToMM : yPoints[yPoints.length - 1].pos * this.chartProp.pxToMM;
			maxPositionOy = yPoints[0].pos < yPoints[yPoints.length - 1].pos ? yPoints[0].pos * this.chartProp.pxToMM : yPoints[yPoints.length - 1].pos * this.chartProp.pxToMM;
		}
		
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		var convertResult, x1n, y1n, x2n, y2n, x3n, y3n, x4n, y4n;
		if(this.chartProp.type == "HBar")
		{
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, 0);
			x1n = convertResult.x / this.chartProp.pxToMM;
			y1n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, perspectiveDepth);
			x2n = convertResult.x / this.chartProp.pxToMM;
			y2n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, nullPositionOy, perspectiveDepth);
			x3n = convertResult.x / this.chartProp.pxToMM;
			y3n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, nullPositionOy, 0);
			x4n = convertResult.x / this.chartProp.pxToMM;
			y4n = convertResult.y / this.chartProp.pxToMM;
		}
		else
		{
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, 0);
			x1n = convertResult.x / this.chartProp.pxToMM;
			y1n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, this.chartProp.chartGutter._top, 0);
			x2n = convertResult.x / this.chartProp.pxToMM;
			y2n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, this.chartProp.chartGutter._top, perspectiveDepth);
			x3n = convertResult.x / this.chartProp.pxToMM;
			y3n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, perspectiveDepth);
			x4n = convertResult.x / this.chartProp.pxToMM;
			y4n = convertResult.y / this.chartProp.pxToMM;
		}
		
		this.paths = this.cChartDrawer.calculatePolygon([{x: x1n, y: y1n}, {x: x2n, y: y2n}, {x: x3n, y: y3n}, {x: x4n, y: y4n}]);
	},
		
	_draw: function()
	{
		//TODO цвет заливки неправильно выставляется при чтении. поэтому использую пока цвет сетки
		var brush = this.cChartSpace.chart.sideWall ? this.cChartSpace.chart.sideWall.brush : null;
		var pen = this.cChartSpace.chart.sideWall ? this.cChartSpace.chart.sideWall.pen : null;
		var path = this.paths;
		
		this.cChartDrawer.drawPath(path, pen, brush);
	}
};

	/** @constructor */
function backWall3DChart()
{
	this.chartProp = null;
	this.cChartSpace = null;
	this.cChartDrawer = null;
	
	this.paths = {};
}

backWall3DChart.prototype =
{
	constructor: backWall3DChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this._draw();
	},
	
	recalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this.paths = {};
		this._calculate();
	},
	
	_calculate : function()
	{
		var nullPositionOy = this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom;	
		var maxPositionOy = this.chartProp.chartGutter._top;
		var yPoints = this.cChartSpace.chart.plotArea.valAx ? this.cChartSpace.chart.plotArea.valAx.yPoints : null;
		if(yPoints && yPoints[0] && yPoints[yPoints.length - 1])
		{
			nullPositionOy = yPoints[0].pos > yPoints[yPoints.length - 1].pos ? yPoints[0].pos * this.chartProp.pxToMM : yPoints[yPoints.length - 1].pos * this.chartProp.pxToMM;
			maxPositionOy = yPoints[0].pos < yPoints[yPoints.length - 1].pos ? yPoints[0].pos * this.chartProp.pxToMM : yPoints[yPoints.length - 1].pos * this.chartProp.pxToMM;
		}
		
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		var convertResult, x1n, y1n, x2n, y2n, x3n, y3n, x4n, y4n;
		if(this.chartProp.type == "HBar")
		{
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, perspectiveDepth);
			x1n = convertResult.x / this.chartProp.pxToMM;
			y1n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, this.chartProp.chartGutter._top, perspectiveDepth);
			x2n = convertResult.x / this.chartProp.pxToMM;
			y2n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, this.chartProp.chartGutter._top, perspectiveDepth);
			x3n = convertResult.x / this.chartProp.pxToMM;
			y3n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, nullPositionOy, perspectiveDepth);
			x4n = convertResult.x / this.chartProp.pxToMM;
			y4n = convertResult.y / this.chartProp.pxToMM;
		}
		else
		{
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, perspectiveDepth);
			x1n = convertResult.x / this.chartProp.pxToMM;
			y1n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, this.chartProp.chartGutter._top, perspectiveDepth);
			x2n = convertResult.x / this.chartProp.pxToMM;
			y2n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, this.chartProp.chartGutter._top, perspectiveDepth);
			x3n = convertResult.x / this.chartProp.pxToMM;
			y3n = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, nullPositionOy, perspectiveDepth);
			x4n = convertResult.x / this.chartProp.pxToMM;
			y4n = convertResult.y / this.chartProp.pxToMM;
		}
		
		this.paths = this.cChartDrawer.calculatePolygon([{x: x1n, y: y1n}, {x: x2n, y: y2n}, {x: x3n, y: y3n}, {x: x4n, y: y4n}]);
	},
		
	_draw: function()
	{
		//TODO цвет заливки неправильно выставляется при чтении. поэтому использую пока цвет сетки
		var brush = this.cChartSpace.chart.backWall ? this.cChartSpace.chart.backWall.brush : null;
		var pen = this.cChartSpace.chart.backWall ? this.cChartSpace.chart.backWall.pen : null;
		var path = this.paths;
		
		this.cChartDrawer.drawPath(path, pen, brush);
	}
};


	/** @constructor */
function allAreaChart()
{
	this.chartProp = null;
	this.cChartSpace = null;
	this.cChartDrawer = null;
	
	this.paths = null;
}

allAreaChart.prototype =
{
    constructor: allAreaChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this._drawArea();
	},
	
	reCalculate: function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
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
		var pen = this.cChartSpace.pen;
		var brush = this.cChartSpace.brush;
		this.cChartDrawer.drawPath(this.paths, pen, brush);
	}
};

	/** @constructor */
function areaChart()
{
	this.chartProp = null;
	this.cChartSpace = null;
	this.cChartDrawer = null;
	
	this.paths = null;
}

areaChart.prototype =
{
    constructor: areaChart,
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this._drawArea();
	},
	
	reCalculate: function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this.paths = null;
		
		if(this.cChartDrawer.nDimensionCount === 3 && this.chartProp.type != "Pie")
			this._calculateArea3D();
		else
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
		
		var widthGraph = this.chartProp.widthCanvas;
		var heightGraph = this.chartProp.heightCanvas;
		var leftMargin = this.chartProp.chartGutter._left;
		var rightMargin = this.chartProp.chartGutter._right;
		var topMargin = this.chartProp.chartGutter._top;
		var bottomMargin = this.chartProp.chartGutter._bottom;
		
		
		path.moveTo(leftMargin / pxToMm * pathW, (heightGraph - bottomMargin) / pxToMm * pathH);
		path.lnTo((widthGraph - rightMargin)  / pxToMm * pathW, (heightGraph - bottomMargin) / pxToMm * pathH);
		path.lnTo((widthGraph - rightMargin) / pxToMm * pathW, topMargin / pxToMm * pathH);
		path.lnTo(leftMargin / pxToMm * pathW, topMargin / pxToMm * pathH);
		path.moveTo(leftMargin / pxToMm * pathW, (heightGraph - bottomMargin) / pxToMm * pathH);
		
		path.recalculate(gdLst);
		this.paths = path;
	},
	
	_calculateArea3D: function()
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
		
		var widthGraph = this.chartProp.widthCanvas;
		var heightGraph = this.chartProp.heightCanvas;
		var leftMargin = this.chartProp.chartGutter._left;
		var rightMargin = this.chartProp.chartGutter._right;
		var topMargin = this.chartProp.chartGutter._top;
		var bottomMargin = this.chartProp.chartGutter._bottom;
		
		var view3DProp = this.cChartSpace.chart.view3D;
		var angleOx = view3DProp && view3DProp.rotX ? (- view3DProp.rotX / 360) * (Math.PI * 2) : 0;
		var angleOy = view3DProp && view3DProp.rotY ? (- view3DProp.rotY / 360) * (Math.PI * 2) : 0;
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		var angleOz = 0;
		
		
		var convertResult = this.cChartDrawer._convertAndTurnPoint(leftMargin, heightGraph - bottomMargin, perspectiveDepth, angleOx, angleOy, angleOz);
		var x1n = convertResult.x;
		var y1n = convertResult.y;
		convertResult = this.cChartDrawer._convertAndTurnPoint(widthGraph - rightMargin, heightGraph - bottomMargin, perspectiveDepth, angleOx, angleOy, angleOz);
		var x2n = convertResult.x;
		var y2n = convertResult.y;
		convertResult = this.cChartDrawer._convertAndTurnPoint(widthGraph - rightMargin, topMargin, perspectiveDepth, angleOx, angleOy, angleOz);
		var x3n = convertResult.x;
		var y3n = convertResult.y;
		convertResult = this.cChartDrawer._convertAndTurnPoint(leftMargin, topMargin, perspectiveDepth, angleOx, angleOy, angleOz);
		var x4n = convertResult.x;
		var y4n = convertResult.y;
		convertResult = this.cChartDrawer._convertAndTurnPoint(leftMargin, heightGraph - bottomMargin, perspectiveDepth, angleOx, angleOy, angleOz);
		var x5n = convertResult.x;
		var y5n = convertResult.y;

		
		path.moveTo(x1n / pxToMm * pathW, y1n / pxToMm * pathH);
		path.lnTo(x2n  / pxToMm * pathW, y2n / pxToMm * pathH);
		path.lnTo(x3n / pxToMm * pathW, y3n / pxToMm * pathH);
		path.lnTo(x4n / pxToMm * pathW, y4n / pxToMm * pathH);
		path.moveTo(x5n / pxToMm * pathW, y5n / pxToMm * pathH);
		
		path.recalculate(gdLst);
		this.paths = path;
	},
	
	_drawArea: function()
	{
		var pen = this.cChartSpace.chart.plotArea.pen;
		var brush = this.cChartSpace.chart.plotArea.brush;
		this.cChartDrawer.drawPath(this.paths, pen, brush);
	}
};

	/** @constructor */
function CGeometry2()
{
    this.pathLst = [];
	this.isLine = false;
	this.gdLst = [];
}

CGeometry2.prototype =
{
    constructor: CGeometry2,
	
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
        this.pathLst.push(path);
    },
	
    AddRect: function(l, t, r, b)
    {
        this.rectS = {};
        this.rectS.l = l;
        this.rectS.t = t;
        this.rectS.r = r;
        this.rectS.b = b;
    },

    draw: function(shape_drawer)
    {
        for (var i=0, n=this.pathLst.length; i<n;++i)
            this.pathLst[i].drawSmart(shape_drawer);
    },
	
	check_bounds: function(checker)
    {

        for(var i=0, n=this.pathLst.length; i<n;++i)

            this.pathLst[i].check_bounds(checker);

    }
};

	/** @constructor */
function CColorObj(pen, brush, geometry)
{
    this.pen = pen;
	this.brush = brush;
	this.geometry = geometry;
}

CColorObj.prototype =
{
	constructor: CColorObj,
	
	check_bounds: function (checker) {
		if (this.geometry) {
			this.geometry.check_bounds(checker);
		}
	}
};
	
//TEST primitive parallalepiped
function TEST3D2()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cChartSpace = null;
	this.summBarVal = [];
	
	this.paths = {};
}

TEST3D2.prototype =
{
    constructor: TEST3D,
	
	reCalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this.paths = {};
		
		this._recalculate();
	},
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;

		this._Draw();
	},
	
	_Draw: function(cubePoints)
	{
		var seria = this.chartProp.series[0];
		var brush = seria.brush;
		var pen = seria.pen;
		
		var numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
		if(numCache.pts[0] && numCache.pts[0].pen)
			pen = numCache.pts[0].pen;
		if(numCache.pts[0] && numCache.pts[0].brush)
			brush = null;
		
		/*pen = this.cChartSpace.chart.plotArea.catAx.compiledMajorGridLines;
			else*/
		pen = this.cChartSpace.chart.plotArea.valAx.compiledMajorGridLines;
		
		for(var i = 0; i < this.paths.length; i++)
		{
			for(var j = 0; j < this.paths[i].length; j++)
			{
				for(var n = 0; n < this.paths[i][j].length; n++)
				{
					this.cChartDrawer.drawPath(this.paths[i][j][n], pen, brush);
				}
			}
		}
	},
	
	
	_recalculate: function (/*isSkip*/)
    {	
		var view3DProp = this.cChartSpace.chart.view3D;
		var angleOx = view3DProp && view3DProp.rotX ? (- view3DProp.rotX / 360) * (Math.PI * 2) : 0;
		var angleOy = view3DProp && view3DProp.rotY ? (- view3DProp.rotY / 360) * (Math.PI * 2) : 0;
		var angleOz = 0;
		
		var widthGraph    = this.chartProp.widthCanvas - this.chartProp.chartGutter._left - this.chartProp.chartGutter._right;
		//widthGraph = widthGraph - widthGraph * Math.sin(-angleOy);
		
		//параметр r и глубина по OZ
		var rPerspective = this.chartProp.rPerspective;
		var perspectiveDepth = this.chartProp.depthPerspective;
		
		
		
		var top = this.chartProp.chartGutter._top;
		var bottom = this.chartProp.chartGutter._bottom;
		
		var widthCanvas = this.chartProp.widthCanvas;
		var heightCanvas = this.chartProp.heightCanvas;
		var heightChart = heightCanvas - top - bottom;
		
		//this.chartProp.chartGutter._left = this.chartProp.chartGutter._right = (widthCanvas - heightChart) / 2;
		var left = this.chartProp.chartGutter._left;
		var right = this.chartProp.chartGutter._right;
		
		var widthChart = widthCanvas - left - right;
		
		
		var depthChart = this.chartProp.depthPerspective;
		
		
		//calculate 8 point of 3d parallelepiped
		//Left area
		var point1 = new Point3D(left, heightChart + top, 0, this.cChartDrawer);
		var point2 = new Point3D(left, heightChart + top, depthChart, this.cChartDrawer);
		var point3 = new Point3D(left, top, depthChart, this.cChartDrawer);
		var point4 = new Point3D(left, top, 0, this.cChartDrawer);
		
		//right area
		var point5 = new Point3D(left + widthChart, heightChart + top, 0, this.cChartDrawer);
		var point6 = new Point3D(left + widthChart, heightChart + top, depthChart, this.cChartDrawer);
		var point7 = new Point3D(left + widthChart, top, depthChart, this.cChartDrawer);
		var point8 = new Point3D(left + widthChart, top, 0, this.cChartDrawer);


			// ToDo а нужна ли global3DPersperctive в ChartsDrawer ?
		var perspective = this.cChartSpace.chart.view3D && this.cChartSpace.chart.view3D.perspective ? this.cChartSpace.chart.view3D.perspective : AscFormat.global3DPersperctive;
		var alpha = perspective / 2;
		
		var halfHeight  = heightChart / 2;
		var PI_OVER_360 = Math.PI / 180;
		var halfAlpha = (alpha / 2) * PI_OVER_360;
		
		var rPerspective = halfHeight / Math.tan(halfAlpha); 
		var diffToObserverZ = rPerspective;
		
		var pointProj = [];
		pointProj[0] = point1.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
		pointProj[1] = point2.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
		pointProj[2] = point3.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
		pointProj[3] = point4.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
		
		//right area
		pointProj[4] = point5.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
		pointProj[5] = point6.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
		pointProj[6] = point7.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
		pointProj[7] = point8.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
		
		var pointProjRotate = [];
		pointProjRotate[0] = point1.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ);
		pointProjRotate[1] = point2.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ);
		pointProjRotate[2] = point3.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ);
		pointProjRotate[3] = point4.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ);
		

		//right area
		pointProjRotate[4] = point5.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ);
		pointProjRotate[5] = point6.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ);
		pointProjRotate[6] = point7.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ);
		pointProjRotate[7] = point8.convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ);
		
		var rotatePoint = [];
		rotatePoint[0] = point1.rotate(angleOx, angleOy, angleOz);
		rotatePoint[1] = point2.rotate(angleOx, angleOy, angleOz, diffToObserverZ, true);
		rotatePoint[2] = point3.rotate(angleOx, angleOy, angleOz, diffToObserverZ, true);
		rotatePoint[3] = point4.rotate(angleOx, angleOy, angleOz, diffToObserverZ, true);
		
		//right area
		rotatePoint[4] = point5.rotate(angleOx, angleOy, angleOz, diffToObserverZ, true);
		rotatePoint[5] = point6.rotate(angleOx, angleOy, angleOz, diffToObserverZ, true);
		rotatePoint[6] = point7.rotate(angleOx, angleOy, angleOz, diffToObserverZ, true);
		rotatePoint[7] = point8.rotate(angleOx, angleOy, angleOz, diffToObserverZ, true);
		
		//correct projection
		if(false)
		{
			pointProjRotate[0].x = pointProjRotate[0].x < pointProj[0].x ? pointProj[0].x : pointProjRotate[0].x;
			pointProjRotate[0].y = pointProjRotate[0].y > pointProj[0].y ? pointProj[0].y : pointProjRotate[0].y;

			pointProjRotate[1].x = pointProjRotate[1].x < pointProj[1].x ? pointProj[1].x : pointProjRotate[1].x;
			pointProjRotate[1].y = pointProjRotate[1].y > pointProj[1].y ? pointProj[1].y : pointProjRotate[1].y;
			
			pointProjRotate[2].x = pointProjRotate[2].x < pointProj[2].x ? pointProj[2].x : pointProjRotate[2].x;
			pointProjRotate[2].y = pointProjRotate[2].y < pointProj[2].y ? pointProj[2].y : pointProjRotate[2].y;
			
			pointProjRotate[3].x = pointProjRotate[3].x < pointProj[3].x ? pointProj[3].x : pointProjRotate[3].x;
			pointProjRotate[3].y = pointProjRotate[3].y < pointProj[3].y ? pointProj[3].y : pointProjRotate[3].y;
			
			pointProjRotate[4].x = pointProjRotate[4].x > pointProj[4].x ? pointProj[4].x : pointProjRotate[4].x;
			pointProjRotate[4].y = pointProjRotate[4].y > pointProj[4].y ? pointProj[4].y : pointProjRotate[4].y;
			
			pointProjRotate[5].x = pointProjRotate[5].x > pointProj[5].x ? pointProj[5].x : pointProjRotate[5].x;
			pointProjRotate[5].y = pointProjRotate[5].y > pointProj[5].y ? pointProj[5].y : pointProjRotate[5].y;
			
			pointProjRotate[6].x = pointProjRotate[6].x > pointProj[6].x ? pointProj[6].x : pointProjRotate[6].x;
			pointProjRotate[6].y = pointProjRotate[6].y < pointProj[6].y ? pointProj[6].y : pointProjRotate[6].y;
			
			pointProjRotate[7].x = pointProjRotate[7].x > pointProj[7].x ? pointProj[7].x : pointProjRotate[7].x;
			pointProjRotate[7].y = pointProjRotate[7].y < pointProj[7].y ? pointProj[7].y : pointProjRotate[7].y;
		}
		
		//correct points
		if(true)
		{
			rotatePoint[0].x = rotatePoint[0].x < point1.x ? rotatePoint[0].x : point1.x;
			rotatePoint[0].y = rotatePoint[0].y > point1.y ? rotatePoint[0].y : point1.y;
			rotatePoint[0].z = (rotatePoint[0].z >= 0 && rotatePoint[0].z <= depthChart) ? rotatePoint[0].z : point1.z;
			
			rotatePoint[1].x = rotatePoint[1].x < point2.x ? rotatePoint[1].x : point2.x;
			rotatePoint[1].y = rotatePoint[1].y > point2.y ? rotatePoint[1].y : point2.y;
			rotatePoint[1].z = rotatePoint[1].z >= 0 && rotatePoint[1].z <= depthChart ? rotatePoint[1].z : point2.z;
			
			rotatePoint[2].x = rotatePoint[2].x < point3.x ? point3.x : rotatePoint[2].x;
			rotatePoint[2].y = rotatePoint[2].y < point3.y ? point3.y : rotatePoint[2].y;
			rotatePoint[2].z = rotatePoint[2].z >= 0 && rotatePoint[2].z <= depthChart ? rotatePoint[2].z : point3.z;
			
			rotatePoint[3].x = rotatePoint[3].x < point4.x ? point4.x : rotatePoint[3].x;
			rotatePoint[3].y = rotatePoint[3].y < point4.y ? point4.y : rotatePoint[3].y;
			rotatePoint[3].z = rotatePoint[3].z >= 0 && rotatePoint[3].z <= depthChart ? rotatePoint[3].z : point4.z;
			
			rotatePoint[4].x = rotatePoint[4].x > point5.x ? point5.x : rotatePoint[4].x;
			rotatePoint[4].y = rotatePoint[4].y > point5.y ? point5.y : rotatePoint[4].y;
			rotatePoint[4].z = rotatePoint[4].z >= 0 && rotatePoint[4].z <= depthChart ? rotatePoint[4].z : point5.z;
			
			rotatePoint[5].x = rotatePoint[5].x > point6.x ? point6.x : rotatePoint[5].x;
			rotatePoint[5].y = rotatePoint[5].y > point6.y ? point6.y : rotatePoint[5].y;
			rotatePoint[5].z = rotatePoint[5].z >= 0 && rotatePoint[5].z <= depthChart ? rotatePoint[5].z : point6.z;
			
			rotatePoint[6].x = rotatePoint[6].x > point7.x ? point7.x : rotatePoint[6].x;
			rotatePoint[6].y = rotatePoint[6].y < point7.y ? point7.y : rotatePoint[6].y;
			rotatePoint[6].z = rotatePoint[6].z >= 0 && rotatePoint[6].z <= depthChart ? rotatePoint[6].z : point7.z;
			
			rotatePoint[7].x = rotatePoint[7].x > point8.x ? point8.x : rotatePoint[7].x;
			rotatePoint[7].y = rotatePoint[7].y < point8.y ? point8.y : rotatePoint[7].y;
			rotatePoint[7].z = rotatePoint[7].z >= 0 && rotatePoint[7].z <= depthChart ? rotatePoint[7].z : point8.z;
			
			var pointProj1 = [];
			pointProj1[0] = rotatePoint[0].convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
			pointProj1[1] = rotatePoint[1].convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
			pointProj1[2] = rotatePoint[2].convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
			pointProj1[3] = rotatePoint[3].convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
			
			//right area
			pointProj1[4] = rotatePoint[4].convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
			pointProj1[5] = rotatePoint[5].convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
			pointProj1[6] = rotatePoint[6].convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
			pointProj1[7] = rotatePoint[7].convertAndTurnPoint(angleOx, angleOy, angleOz, diffToObserverZ, true);
		
		}
		
		
		var aspectRatioX = [];
		var aspectRatioY = [];
		var aspectRatioZ = [];
		var point1Test = [];
		for(var i = 0; i < pointProj.length; i++)
		{
			aspectRatioX[i] = pointProj[i].x - pointProjRotate[i].x;
			aspectRatioY[i] = pointProjRotate[i].y - pointProj[i].y;
			aspectRatioZ[i] = pointProjRotate[i].z - pointProj[i].z;
			
			var newX = aspectRatioX[i] < 0 ? pointProjRotate[i].x - aspectRatioX[i] : pointProjRotate[i].x;
			var newY = pointProjRotate[i].y;
			var newZ = pointProjRotate[i].z;
			point1Test[i] = new Point3D(newX, newY, newZ, this.cChartDrawer);
		}
		
		
		this.paths = [];
		this.paths[0] = [];
		//this.paths[0][0] = this._calculateRect(pointProj1[0], pointProj1[1], pointProj1[2], pointProj1[3], pointProj1[4], pointProj1[5], pointProj1[6], pointProj1[7]);
		//this.paths[0][0] = this._calculateRect(pointProj[0], pointProj[1], pointProj[2], pointProj[3], pointProj[4], pointProj[5], pointProj[6], pointProj[7]);
		this.paths[0][0] = this._calculateRect(pointProjRotate[0], pointProjRotate[1], pointProjRotate[2], pointProjRotate[3], pointProjRotate[4], pointProjRotate[5], pointProjRotate[6], pointProjRotate[7]);
		
		//this.paths[0][0] = this._calculateRect(point1Test[0], point1Test[1], point1Test[2], point1Test[3], point1Test[4], point1Test[5], point1Test[6], point1Test[7]);
		
    },
	
	_calculateRect : function(point1, point2, point3, point4, point5, point6, point7, point8)
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
		
		var paths = [];
		
		//unfront
		path  = new Path();
		path.pathH = pathH;
		path.pathW = pathW;
		path.moveTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
		path.lnTo(point6.x / pxToMm * pathW, point6.y / pxToMm * pathH);
		path.lnTo(point7.x / pxToMm * pathW, point7.y / pxToMm * pathH);
		path.lnTo(point3.x / pxToMm * pathW, point3.y / pxToMm * pathH);
		path.lnTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
		path.recalculate(gdLst);
		paths[0] = path;
		
		//down
		path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
		path.lnTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
		path.lnTo(point3.x / pxToMm * pathW, point3.y / pxToMm * pathH);
		path.lnTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
		path.lnTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
		path.recalculate(gdLst);
		paths[1] = path;
		
		
		//left
		path  = new Path();
		path.pathH = pathH;
		path.pathW = pathW;
		path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
		path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
		path.lnTo(point6.x / pxToMm * pathW, point6.y / pxToMm * pathH);
		path.lnTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
		path.lnTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
		path.recalculate(gdLst);
		paths[2] = path;
		
		//right
		path  = new Path();
		path.pathH = pathH;
		path.pathW = pathW;
		path.moveTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
		path.lnTo(point8.x / pxToMm * pathW, point8.y / pxToMm * pathH);
		path.lnTo(point7.x / pxToMm * pathW, point7.y / pxToMm * pathH);
		path.lnTo(point3.x / pxToMm * pathW, point3.y / pxToMm * pathH);
		path.lnTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
		path.recalculate(gdLst);
		paths[3] = path;
		
		//up
		path  = new Path();
		path.pathH = pathH;
		path.pathW = pathW;
		path.moveTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
		path.lnTo(point6.x / pxToMm * pathW, point6.y / pxToMm * pathH);
		path.lnTo(point7.x / pxToMm * pathW, point7.y / pxToMm * pathH);
		path.lnTo(point8.x / pxToMm * pathW, point8.y / pxToMm * pathH);
		path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
		path.recalculate(gdLst);
		paths[4] = path;
		
		//front
		path  = new Path();
		path.pathH = pathH;
		path.pathW = pathW;
		path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
		path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
		path.lnTo(point8.x / pxToMm * pathW, point8.y / pxToMm * pathH);
		path.lnTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
		path.lnTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
		path.recalculate(gdLst);
		paths[5] = path;
		
		return paths;
	}
};



//TEST primitive parallalepiped
function TEST3D()
{
	this.points = []; //array storing all existing 3D points
	this.faces = []; //array storing 4 point groups which make up a face
	this.fov = 170; //field of view - best not to touch this

	//rotation speed about x,y,z axis - changing this will make the cube rotate in
	//different directions at different speeds
	this.rx = 0;
	this.ry = 30;
	this.rz = 0;
}

TEST3D.prototype =
{
    constructor: TEST3D,
	
	reCalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this.paths = [];
		
		this._recalculate();
	},
	
	draw : function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;

		this._Draw();
	},
	
	_Draw: function(cubePoints)
	{
		var seria = this.chartProp.series[0];
		var brush = seria.brush;
		var pen = seria.pen;
		
		var numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
		if(numCache.pts[0] && numCache.pts[0].pen)
			pen = numCache.pts[0].pen;
		if(numCache.pts[0] && numCache.pts[0].brush)
			brush = null;
		
		/*pen = this.cChartSpace.chart.plotArea.catAx.compiledMajorGridLines;
			else*/
		pen = this.cChartSpace.chart.plotArea.valAx.compiledMajorGridLines;
		
		for(var i = 0; i < this.paths.length; i++)
		{
			this.cChartDrawer.drawPath(this.paths[i], pen, brush);
		}
	},
	
	
	_recalculate: function (/*isSkip*/)
    {	
		var view3DProp = this.cChartSpace.chart.view3D;
		var angleOx = view3DProp && view3DProp.rotX ? (- view3DProp.rotX / 360) * (Math.PI * 2) : 0;
		var angleOy = view3DProp && view3DProp.rotY ? (- view3DProp.rotY / 360) * (Math.PI * 2) : 0;
		var angleOz = 0;
		
		//параметр r и глубина по OZ
		var rPerspective = this.cChartDrawer.processor3D.rPerspective;
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		
		var top = this.chartProp.chartGutter._top;
		var bottom = this.chartProp.chartGutter._bottom;
		
		var widthCanvas = this.chartProp.widthCanvas;
		var heightCanvas = this.chartProp.heightCanvas;
		var heightChart = heightCanvas - top - bottom;
		
		var left = this.chartProp.chartGutter._left;
		var right = this.chartProp.chartGutter._right;
		
		var widthChart = heightChart;
		

		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		var pxToMm = this.chartProp.pxToMM;
		
		
		var points = [];
		var faces = [];
		points.push(new Point3D(0, 0, perspectiveDepth,this.cChartDrawer));
		points.push(new Point3D(0, heightChart, perspectiveDepth,this.cChartDrawer));
		points.push(new Point3D(widthChart, heightChart, perspectiveDepth,this.cChartDrawer));
		points.push(new Point3D(widthChart, 0, perspectiveDepth,this.cChartDrawer));
		points.push(new Point3D(widthChart, 0, 0,this.cChartDrawer));
		points.push(new Point3D(widthChart, heightChart, 0,this.cChartDrawer));
		points.push(new Point3D(0, heightChart, 0,this.cChartDrawer));
		points.push(new Point3D(0, 0, 0,this.cChartDrawer));

		faces.push([0,1,2,3]);
		faces.push([2,5,4,3]);
		faces.push([1,6,7,0]);
		faces.push([6,5,4,7]);
		faces.push([7,4,3,0]);
		faces.push([1,6,2,5]);
		
		
		for(var i = 0; i < points.length; i++)
		{
			//diff
			points[i].offset(- widthChart / 2, -heightChart / 2, -perspectiveDepth / 2);
			//rotate
			points[i] = points[i].rotY(-angleOy, points[i]);
			points[i] = points[i].rotX(-angleOx, points[i]);
		}
				
		var fov = 1 / rPerspective; //field of view - best not to touch this
		for(var i = 0; i < faces.length - 1; i++){
			for(var k = 0; k < 3; k++){

				var path  = new Path();
				path.pathH = pathH;
				path.pathW = pathW;
				
				var diff = 0;
				var x = points[faces[i][k]].x + diff;
				var y = points[faces[i][k]].y;
				var z = points[faces[i][k]].z + this.cChartDrawer.processor3D.cameraDiffZ;
				var x1 = points[faces[i][k]].projectX(x, z, 0, fov, widthCanvas / 2);
				var y1 = points[faces[i][k]].projectY(y, z, 0, fov, heightCanvas / 2);
				
				var x = points[faces[i][k + 1]].x + diff;
				var y = points[faces[i][k + 1]].y;
				var z = points[faces[i][k + 1]].z + this.cChartDrawer.processor3D.cameraDiffZ;
				var x2 = points[faces[i][k]].projectX(x, z, 0, fov, widthCanvas / 2);
				var y2 = points[faces[i][k]].projectY(y, z, 0, fov, heightCanvas / 2);
				
				path.moveTo(x1 / pxToMm * pathW,  y1 / pxToMm * pathH);
				path.lnTo(x2 / pxToMm * pathW, y2 / pxToMm * pathH);
				path.recalculate(gdLst);
				this.paths.push(path);
			}
		}
		
		
		
    }
};

	//----------------------------------------------------------export----------------------------------------------------
	window['AscFormat'] = window['AscFormat'] || {};
	window['AscFormat'].CChartsDrawer = CChartsDrawer;
})(window);
