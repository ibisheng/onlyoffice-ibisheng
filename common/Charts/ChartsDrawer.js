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

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {

// Import
var cToDeg = AscFormat.cToDeg;
var Path = AscFormat.Path2;
var ORIENTATION_MIN_MAX = AscFormat.ORIENTATION_MIN_MAX;
var Point3D = AscFormat.Point3D;

var c_oAscTickMark = Asc.c_oAscTickMark;
var c_oAscChartDataLabelsPos = Asc.c_oAscChartDataLabelsPos;
var c_oAscChartLegendShowSettings = Asc.c_oAscChartLegendShowSettings;

var c_oChartTypes =
{
	Bar: 0,
	Line: 1,
	HBar: 2,
	Pie: 3,
	Scatter: 4,
	Area: 5,
	Stock: 6,
	DoughnutChart: 7,
	Radar: 8,
	BubbleChart: 9,
	Surface: 10
};

var c_oChartBar3dFaces =
{
	front: 0,
	up: 1,
	left: 2,
	right: 3,
	down: 4,
	back: 5
};


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
			case c_oChartTypes.Bar:
			{
				newChart = new drawBarChart();
				break;
			}
			case c_oChartTypes.Line:
			{
				newChart = new drawLineChart();
				break;
			}
			case c_oChartTypes.HBar:
			{
				newChart = new drawHBarChart();
				break;
			}
			case c_oChartTypes.Pie:
			{
				newChart = new drawPieChart();
				break;
			}
			case c_oChartTypes.Scatter:
			{
				newChart = new drawScatterChart();
				break;
			}
			case c_oChartTypes.Area:
			{
				newChart = new drawAreaChart();
				break;
			}
			case c_oChartTypes.Stock:
			{
				newChart = new drawStockChart();
				break;
			}
			case c_oChartTypes.DoughnutChart:
			{
				newChart = new drawDoughnutChart();
				break;
			}
			case c_oChartTypes.Radar:
			{
				newChart = new drawRadarChart();
				break;
			}
			case c_oChartTypes.BubbleChart:
			{
				newChart = new drawBubbleChart();
				break;
			}
			case c_oChartTypes.Surface:
			{
				newChart = new drawSurfaceChart();
				break;
			}
		}
		this.chart = newChart;
		
		//делаем полный пресчёт
		if(!chartSpace.bEmptySeries)
		{
			if(this.nDimensionCount === 3)
				this._calaculate3DProperties(chartSpace);
			
			this.areaChart.recalculate(this);
			
			if(this.calcProp.type != c_oChartTypes.Pie && this.calcProp.type != c_oChartTypes.DoughnutChart)
				this.gridChart.recalculate(this);
		}
		
		this.allAreaChart.recalculate(this);
		
		if(this.calcProp.type != c_oChartTypes.Pie && this.calcProp.type != c_oChartTypes.DoughnutChart && !chartSpace.bEmptySeries)
		{
			this.catAxisChart.recalculate(this);
			this.valAxisChart.recalculate(this);
			if(this.nDimensionCount === 3)
			{
				this.floor3DChart.recalculate(this);
				this.serAxisChart.recalculate(this);
				this.sideWall3DChart.recalculate(this);
				this.backWall3DChart.recalculate(this);
			}
				
		}
		
		if(!chartSpace.bEmptySeries)
			this.chart.recalculate(this);
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
			
			if(this.calcProp.type != c_oChartTypes.Pie && this.calcProp.type != c_oChartTypes.DoughnutChart)
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
			
			if(this.calcProp.type != c_oChartTypes.Pie && this.calcProp.type != c_oChartTypes.DoughnutChart)
			{
				this.catAxisChart.draw(this);
				this.valAxisChart.draw(this);
				this.serAxisChart.draw(this);
			}
			
			if(this.nDimensionCount !== 3)
			{
				if(this.calcProp.type === c_oChartTypes.Line || this.calcProp.type === c_oChartTypes.Scatter)
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
	
	recalculateOnly3dProps: function(chartSpace)
	{
		//this.cChartSpace = chartSpace;
		this.calcProp = {};
		
		if(this._isSwitchCurrent3DChart(chartSpace))
		{
			standartMarginForCharts = 16;
			this.nDimensionCount = 3;
			
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
			
			if(!chartSpace.bEmptySeries)
			{
				if(this.nDimensionCount === 3)
					this._calaculate3DProperties(chartSpace);
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
			if(!this.processor3D.view3D.getRAngAx() && (this.calcProp.type === c_oChartTypes.Bar || this.calcProp.type === c_oChartTypes.Line))
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
				
				y = (convertResultY2.y + heightPerspectiveChart / 2) / this.calcProp.pxToMM - heightTitle / 2;
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
		if(orientationValAx || this.calcProp.type == c_oChartTypes.HBar)
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

		var nLegendPos = chartSpace.chart.legend.legendPos !== null ? chartSpace.chart.legend.legendPos : c_oAscChartLegendShowSettings.right;
		switch ( nLegendPos )
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
		
		var isHBar = !!(chartSpace.chart.plotArea.chart.getObjectType() == AscDFH.historyitem_type_BarChart && chartSpace.chart.plotArea.chart.barDir === AscFormat.BAR_DIR_BAR);
		
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
            var nLegendPos = chartSpace.chart.legend.legendPos !== null ? chartSpace.chart.legend.legendPos : c_oAscChartLegendShowSettings.right;
			switch ( nLegendPos )
			{
				case c_oAscChartLegendShowSettings.left:
				case c_oAscChartLegendShowSettings.leftOverlay:
				{
					leftKey += fLegendExtX;
					break;
				}
				case c_oAscChartLegendShowSettings.top:
				{
					topKey += fLegendExtY;
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

        if(chartSpace.chart.plotArea.chart.getObjectType() == AscDFH.historyitem_type_PieChart || chartSpace.chart.plotArea.chart.getObjectType() == AscDFH.historyitem_type_DoughnutChart){
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
			
			if(this.calcProp.type == c_oChartTypes.Scatter && this.calcProp.widthCanvas != undefined && catAx.xPoints)
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
		if(isHBar === c_oChartTypes.HBar && catAx && valAx && catAx.yPoints && valAx.xPoints)
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
			if(this.calcProp.type == c_oChartTypes.Bar)
			{
				this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
				
				this.calcProp.numvMinorlines = 2;
				this.calcProp.numhMinorlines = 5;
			}
			else if(this.calcProp.type == c_oChartTypes.HBar)
			{
				this.calcProp.numhlines = chartProp.chart.plotArea.catAx.yPoints.length;
				this.calcProp.numvlines = chartProp.chart.plotArea.valAx.xPoints.length - 1;
				
				this.calcProp.numhMinorlines = 2;
				this.calcProp.numvMinorlines = 5;
			}
			else if(this.calcProp.type == c_oChartTypes.Line || this.calcProp.type == c_oChartTypes.Stock)
			{
				this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
				
				this.calcProp.numvMinorlines = 2;
				this.calcProp.numhMinorlines = 5;
			}
			else if(this.calcProp.type == c_oChartTypes.Scatter || this.calcProp.type == c_oChartTypes.BubbleChart)
			{
				this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
				
				this.calcProp.numvMinorlines = 5;
				this.calcProp.numhMinorlines = 5;
			}
			else if(this.calcProp.type == c_oChartTypes.Area)
			{
				this.calcProp.numvlines = chartProp.chart.plotArea.catAx.xPoints.length;
				
				this.calcProp.numvMinorlines = 2;
				this.calcProp.numhMinorlines = 5;
			}
		}
		
		
		if(this.calcProp.type != c_oChartTypes.Scatter)
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
	
		if(this.calcProp.type == c_oChartTypes.Bar)
		{
			this.calcProp.max = this.calcProp.scale[this.calcProp.scale.length -1];
			this.calcProp.min = this.calcProp.scale[0];
		}
		
		
		this.calcProp.axisMin = this.calcProp.scale[0] < this.calcProp.scale[this.calcProp.scale.length - 1] ? this.calcProp.scale[0] : this.calcProp.scale[this.calcProp.scale.length - 1];
		this.calcProp.axisMax = this.calcProp.scale[0] < this.calcProp.scale[this.calcProp.scale.length - 1] ? this.calcProp.scale[this.calcProp.scale.length - 1] : this.calcProp.scale[0];
	},
	
	//****new calculate data****
	_calculateStackedData2: function()
	{	
		var maxMinObj;
		if(this.calcProp.type == c_oChartTypes.Bar || this.calcProp.type == c_oChartTypes.HBar)
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
		
		
		if(this.calcProp.type == c_oChartTypes.Line || this.calcProp.type == c_oChartTypes.Area)
		{
			if (this.calcProp.subType == 'stacked') {
				for (var j = 0; j < (this.calcProp.data.length - 1); j++) {
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						if(!this.calcProp.data[j + 1])
							this.calcProp.data[j + 1] = [];
						this.calcProp.data[j + 1][i] = this.calcProp.data[j + 1][i] + this.calcProp.data[j][i];
					}
				}
				
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
					}
				}
				
				for (var j = 0; j < (this.calcProp.data.length - 1); j++) {
					for (var i = 0; i < this.calcProp.data[j].length; i++) {
						this.calcProp.data[j + 1][i] = this.calcProp.data[j + 1][i] + this.calcProp.data[j][i]
					}
				}
				
				var tempData = this.calcProp.data;

				for (var j = 0; j < (tempData[0].length); j++) {
					for (var i = 0; i < tempData.length; i++) {
						if(summValue[j] == 0)
							tempData[i][j] = 0;
						else
							tempData[i][j] = (100 * tempData[i][j]) / (summValue[j]);
					}
				}
				
				maxMinObj = this._getMaxMinValueArray(tempData);
				this.calcProp.max = maxMinObj.max;
				this.calcProp.min = maxMinObj.min;
				this.calcProp.data = tempData;
			}
		}
	},
	
	_calculateData2: function(chart) 
	{	
		var xNumCache, yNumCache, newArr, arrValues = [], max = 0, min = 0, minY = 0, maxY = 0;
		var series = chart.chart.plotArea.chart.series;
		var t = this;
		
		var generateArrValues = function()
		{	
			var isEn = false;
			var numSeries = 0;
			for(var l = 0; l < series.length; l++)
			{
				var seria = series[l];
				var numCache = seria.val.numRef && seria.val.numRef.numCache ? seria.val.numRef.numCache : seria.val.numLit ? seria.val.numLit : null;
				var pts = numCache ? numCache.pts : null;
				
				if( !pts || !pts.length || seria.isHidden == true)
				{
					continue;
				}
		
				var n = 0;
				arrValues[numSeries] = [];
				for(var col = 0; col < numCache.ptCount; col++)
				{
					var curPoint = t.getIdxPoint(seria, col);
					
					if(!curPoint)
					{
						curPoint = {val: 0};
					}
					else if(curPoint.isHidden == true)
					{
						continue;
					}
					
					var val = curPoint.val;
					var value =  parseFloat(val);
					
					if(!isEn && !isNaN(value))
					{
						min = value;
						max = value;
						isEn = true;
					}
					if(!isNaN(value) && value > max)
					{
						max = value;
					}
					if(!isNaN(value) && value < min)
					{
						min = value;
					}
						
					if(isNaN(value) && val == '' && (((t.calcProp.type == c_oChartTypes.Line ) && t.calcProp.type == 'normal')))
					{
						value = '';
					}
					else if (isNaN(value))
					{
						value = 0;
					}
					
					if(t.calcProp.type == c_oChartTypes.Pie || t.calcProp.type == c_oChartTypes.DoughnutChart)
					{
						value = Math.abs(value);
					}
					
					arrValues[numSeries][n] = value;
					n++;
				}
				numSeries++;
			}
		};
		
		var generateArrValuesScatter = function()
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
				
				for(var j = 0; j < yNumCache.ptCount; ++j)
				{
					if(yNumCache.pts[j])
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
					else
					{
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
						
						if(l == 0 && j == 0)
						{
							min = xVal;
							max = xVal;
							
						}
						
						if(xVal < min)
							min = xVal;
						if(xVal > max)
							max = xVal;
					}
					
				}
			}
			t.calcProp.ymin = minY;
			t.calcProp.ymax = maxY;
		};
		
		if(this.calcProp.type != c_oChartTypes.Scatter)//берём данные из NumCache
		{
			generateArrValues();
		}
		else //point(scatter) chart
		{
			generateArrValuesScatter();
		}

		this.calcProp.min = min;
		this.calcProp.max = max;
		
		if(newArr)
			arrValues = newArr;
			
		if(this.calcProp.type == c_oChartTypes.Bar || this.calcProp.type == c_oChartTypes.HBar)
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

		if(!(c_oChartTypes.Scatter == this.calcProp.type && isOx)){
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
		if(c_oChartTypes.Scatter == this.calcProp.type && isOx)
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
		if(this.calcProp.subType == 'stackedPer' && axisMax > percentChartMax && manualMax === null)
			axisMax = percentChartMax;
		if(this.calcProp.subType == 'stackedPer' && axisMin < - percentChartMax && manualMin === null)
			axisMin = - percentChartMax;
		
		
		if(axisMax < axisMin)
		{
			manualMax = 2 * axisMin;
			axisMax = manualMax;
		}
			
		
		//приводим к первому порядку
		firstDegree = this._getFirstDegree((Math.abs(axisMax - axisMin)) / 10);

		var axis = c_oChartTypes.Scatter == this.calcProp.type && isOx ? chartProp.chart.plotArea.catAx : chartProp.chart.plotArea.valAx;
		//находим шаг
		if(axis && axis.majorUnit !== null)
		{
			step = axis.majorUnit;
			if(this.calcProp.subType == 'stackedPer')
			{
				step = step * 100;
			}
		}
		else
		{
			var firstStep;
			if(isOx || c_oChartTypes.HBar == this.calcProp.type)
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
		var stackedPerMax = null !== manualMax ? manualMax : 100;
		
		if(this.calcProp.subType === 'stackedPer' && step > stackedPerMax)
		{
			stackedPerMax = step;
		}
		
		for(var i = 0; i < 20; i++)
		{
			if(this.calcProp.subType == 'stackedPer' && (minUnit + step * i) > stackedPerMax)
			{
				break;
			}
			
			arrayValues[i] = minUnit + step * i;
			
			if(axisMax == 0 && axisMin < 0 && arrayValues[i] == axisMax)
			{
				break;
			}
			else if((manualMax != null && arrayValues[i] >= axisMax) || (manualMax == null && arrayValues[i] > axisMax))
			{
				if(this.calcProp.subType == 'stackedPer')
				{
					arrayValues[i] = arrayValues[i] / 100;
				}
				
				break;
			}
			else if(this.calcProp.subType == 'stackedPer')
			{
				arrayValues[i] = arrayValues[i] / 100;
			}	
		}
		
		/*if(this.calcProp.subType == 'stackedPer')
		{
			//TODO пересмотреть все ситуации, когда заданы фиксированные максимальные и минимальные значение выше 100%
			if(step > axisMax)
				arrayValues = [axisMin, axisMax];
		}*/
		
		if(!arrayValues.length)
		{
			arrayValues = [0.2, 0.4, 0.6, 0.8, 1, 1.2];
		}
			
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
				if(this.calcProp.type == c_oChartTypes.HBar)
					numNull = this.calcProp.numvlines;
			}
		}
		else if(min <= 0 && max <= 0)
		{
			if(orientation == ORIENTATION_MIN_MAX)
			{
				numNull = this.calcProp.numhlines;
				if(this.calcProp.type == c_oChartTypes.HBar)
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
				if(this.calcProp.type == c_oChartTypes.HBar)
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
					else if(i !== 0 && valPoints[i - 1].val < 0 && valPoints[i].val > 0)
					{
						var val1 = valPoints[i - 1].val;
						var val2 = valPoints[i].val;
						var pos1 = valPoints[i - 1].pos * this.calcProp.pxToMM;
						var pos2 = valPoints[i].pos * this.calcProp.pxToMM;
						
						result = pos2 - val2 * (pos2 - pos1) / (val2 - val1);
						
						break;
					}
				}
			}
			
			return result;
		}
		
		var nullPosition;
		if(0 == numNull)
			nullPosition = 0;
		else if(this.calcProp.type == c_oChartTypes.HBar)
			nullPosition = (this.calcProp.widthCanvas - this.calcProp.chartGutter._left - this.calcProp.chartGutter._right)/(this.calcProp.numvlines)*numNull;
		else
			nullPosition = (this.calcProp.heightCanvas - this.calcProp.chartGutter._bottom - this.calcProp.chartGutter._top)/(this.calcProp.numhlines)*numNull;
		
		var result;
		if(this.calcProp.type == c_oChartTypes.HBar)
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
			if(this.calcProp.type == c_oChartTypes.HBar)
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
				this.calcProp.type = c_oChartTypes.Line;
				break;
			}
			case AscDFH.historyitem_type_BarChart:
			{
				if(chartProp.chart.plotArea.chart.barDir !== AscFormat.BAR_DIR_BAR)
					this.calcProp.type = c_oChartTypes.Bar;
				else 
					this.calcProp.type = c_oChartTypes.HBar;
				break;
			}
			case AscDFH.historyitem_type_PieChart:
			{
				this.calcProp.type = c_oChartTypes.Pie;
				break;
			}
			case AscDFH.historyitem_type_AreaChart:
			{
				this.calcProp.type = c_oChartTypes.Area;
				break;
			}
			case AscDFH.historyitem_type_ScatterChart:
			{
				this.calcProp.type = c_oChartTypes.Scatter;
				break;
			}
			case AscDFH.historyitem_type_StockChart:
			{
				this.calcProp.type = c_oChartTypes.Stock;
				break;
			}
			case AscDFH.historyitem_type_DoughnutChart:
			{
				this.calcProp.type = c_oChartTypes.DoughnutChart;
				break;
			}
			case AscDFH.historyitem_type_RadarChart:
			{
				this.calcProp.type = c_oChartTypes.Radar;
				break;
			}
			case AscDFH.historyitem_type_BubbleChart:
			{
				this.calcProp.type = c_oChartTypes.BubbleChart;
				break;
			}
			case AscDFH.historyitem_type_SurfaceChart:
			{
				this.calcProp.type = c_oChartTypes.Surface;
				break;
			}
		}
		
		var grouping = chartProp.chart.plotArea.chart.grouping;
		if(this.calcProp.type == c_oChartTypes.Line || this.calcProp.type == c_oChartTypes.Area)
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
		
		if(this.calcProp.type == c_oChartTypes.Scatter)
		{
			this.calcProp.scale = this._roundValues(this._getAxisData2(false, this.calcProp.ymin, this.calcProp.ymax, chartProp));	
			this.calcProp.xScale = this._roundValues(this._getAxisData2(true, this.calcProp.min, this.calcProp.max, chartProp));
		}
		else
			this.calcProp.scale = this._roundValues(this._getAxisData2(false, this.calcProp.min, this.calcProp.max, chartProp));	
		
		if(this.calcProp.scale && this.calcProp.scale.length >= 2)
		{
			this.calcProp.axisStep = Math.abs(this.calcProp.scale[1] - this.calcProp.scale[0]);
		}
		
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
		if(!AscFormat.isRealNumber(path)){
			return;
		}
		var oPath = this.cChartSpace.GetPath(path);
		if(!oPath)
			return;
		
		if(pen)
            oPath.stroke = true;

		var cGeometry = new CGeometry2();
		this.cShapeDrawer.Clear();

        cGeometry.AddPath(oPath);
		this.cShapeDrawer.fromShape2(new CColorObj(pen, brush, cGeometry) ,this.cShapeDrawer.Graphics, cGeometry);

		this.cShapeDrawer.draw(cGeometry);
	},
	
	//****functions for chart classes****
	calculatePoint: function(x, y, size, symbol)
	{
		size = size / 2.69;
		var halfSize = size / 2;
		var pathId = this.cChartSpace.AllocPath();
		var path  = this.cChartSpace.GetPath(pathId);
		var pathH = this.calcProp.pathH;
		var pathW = this.calcProp.pathW;

		var framePaths = null, framePathsId = null;
		
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
			framePathsId = this.cChartSpace.AllocPath();
            framePaths = this.cChartSpace.GetPath(framePathsId);
			framePaths.moveTo((x - halfSize) * pathW, (y + halfSize) * pathW);
			framePaths.lnTo((x - halfSize) * pathW, (y - halfSize) * pathW);
			framePaths.lnTo((x + halfSize) * pathW, (y - halfSize) * pathW);
			framePaths.lnTo((x + halfSize) * pathW, (y + halfSize) * pathW);
			framePaths.lnTo((x - halfSize) * pathW, (y + halfSize) * pathW);
		}
		

		result = {framePaths: framePaths, path: pathId};
		
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
		
		if(!yPoints[1] && val === yPoints[0].val)
		{
			result = yPoints[0].pos;
		}
		else if(val < yPoints[0].val)
		{
			resPos = Math.abs(yPoints[1].pos - yPoints[0].pos);
			resVal = yPoints[1].val - yPoints[0].val;
			diffVal = Math.abs(yPoints[0].val) - Math.abs(val);
			if(isOx)
				result = yPoints[0].pos - Math.abs((diffVal / resVal) * resPos);
			else
				result = yPoints[0].pos + Math.abs((diffVal / resVal) * resPos);
			
			if(result > yPoints[yPoints.length - 1].pos || result < yPoints[0].pos)
			{
				result = yPoints[0].pos;
			}
		}
		else if(val > yPoints[yPoints.length - 1].val)
		{	
			var test = yPoints[1] ? yPoints[1] : yPoints[0];
			resPos = Math.abs(test.pos - yPoints[0].pos);
			resVal = test.val - yPoints[0].val;
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
			
			if(result > yPoints[yPoints.length - 1].pos || result < yPoints[0].pos)
			{
				result = yPoints[yPoints.length - 1].pos;
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
						if(this.calcProp.type == c_oChartTypes.Scatter || this.calcProp.type == c_oChartTypes.Stock)
						{
							if(plotArea.catAx.scaling.orientation != ORIENTATION_MIN_MAX)
								result = - (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
							else
								result = (resPos / resVal) * (Math.abs(val - yPoints[s].val)) + startPos;
						}
						else
						{
							if((plotArea.valAx.scaling.orientation == ORIENTATION_MIN_MAX && this.calcProp.type != c_oChartTypes.Line) || (plotArea.catAx.scaling.orientation == ORIENTATION_MIN_MAX && this.calcProp.type == c_oChartTypes.Line))
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
	
	getLogarithmicValue: function(val, logBase)
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
	
	_convertAndTurnPoint: function(x, y, z, isNScale, isNRotate, isNProject)
	{
		return this.processor3D.convertAndTurnPoint(x, y, z, isNScale, isNRotate, isNProject);
	},

	//position of catAx labels(left or right) - returns false(left of axis)/true(right of axis) or null(standard position)
	calculatePositionLabelsCatAxFromAngle: function(chartSpace)
	{
		var res = null;

		var angleOy = chartSpace.chart.view3D && chartSpace.chart.view3D.rotY ? (- chartSpace.chart.view3D.rotY / 360) * (Math.PI * 2) : 0;
		if(chartSpace.chart.view3D && !chartSpace.chart.view3D.getRAngAx() && angleOy !== 0)
		{
			angleOy = Math.abs(angleOy);

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
				}
				
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
		var numPow = 1, tempMax;
		
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
			numPow = Math.pow(10, secPart[0].toString().length - 1);
		else if(0 == secPart[0] && secPart[1] != undefined)
		{
			tempMax = val;
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
		//ToDo пересмотреть округление. на числа << 0 могут быть проблемы!
		var kF = 1000000000;
		if(values.length)
		{
			for(var i = 0; i < values.length; i++)
			{
				values[i] = Math.round(values[i] * kF) / kF;
			}
		}
		
		return values;
	},
	
	
	//***spline functions***
	//TODO пока включаю calculate_Bezier. проверить корретность calculate_Bezier2!
	calculate_Bezier2: function(x, y, x1, y1, x2, y2, x3, y3)
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

	//***spline functions***
	calculate_Bezier: function(x, y, x1, y1, x2, y2, x3, y3, t)
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

		bz[0] = pts[1];

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
			bz[1] = this.XYZAdd(pts[1], this.XYZMult(this.XYZSub(pts[2], pts[0]), d12 / 2 / d02))
			bz[2] = this.XYZAdd(pts[2], this.XYZMult(this.XYZSub(pts[1], pts[3]), d12 / 2 / d13))
		}
		else if((d02 / 6 >= d12 / 2))
		{
			bz[1] = this.XYZAdd(pts[1], this.XYZMult(this.XYZSub(pts[2], pts[0]), d12 / 2 / d02))
			bz[2] = this.XYZAdd(pts[2], this.XYZMult(this.XYZSub(pts[1], pts[3]), d12 / 2 / d13 * (d13 / d02)))
		}
		else
		{
			bz[1] = this.XYZAdd(pts[1], this.XYZMult(this.XYZSub(pts[2], pts[0]), d12 / 2 / d02 * (d02 / d13)))
			bz[2] = this.XYZAdd(pts[2], this.XYZMult(this.XYZSub(pts[1], pts[3]), d12 / 2 / d13))
		}

		bz[3] = pts[2];

		var pt = this._bezier4(bz[0], bz[1], bz[2], bz[3], t);

		return [pt.x, pt.y];
	},

	_bezier4: function(p1, p2, p3, p4, t)
	{
		var mum1, mum13, t3, mum12, t2;
		var p = {};

		mum1 = 1 - t;
		mum13 = mum1 * mum1 * mum1;
		mum12 = mum1 * mum1;
		t2 = t * t
		t3 = t * t * t;

		p.x = mum13 * p1.x + 3 * t * mum12 * p2.x + 3 * t2 * mum1 * p3.x + t3 * p4.x;
		p.y = mum13 * p1.y + 3 * t * mum12 * p2.y + 3 * t2 * mum1 * p3.y + t3 * p4.y;

		return p;
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
				{
					if(AscFormat.c_oChartTypes.Pie === this.calcProp.type)
					{
						this.calcProp.ptCount = 1;
					}
					else
					{
						this.calcProp.ptCount = numCache.ptCount;
					}
				}
				
				//TODO возможно нужно будет проверку добавить на isHidden
				counter++;
			}
			else if(3 === this.nDimensionCount)
			{
				counter++;
			}
		}
		
		if(AscFormat.c_oChartTypes.Pie === this.calcProp.type)
		{
			counter = 1;
		}
		
		return counter;
	},
	
	//вспомогательные функции работающие с тремя координатами
	//получаем к-ты уравнения прямой по 2 точкам
	getLineEquation: function(point1, point2)
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
		/*var x123 = (point1.x - x0) / (x1 - x0);
		var y123 = (point1.y - y0) / (y1 - y0);
		var z123 = (point1.z - z0) / (z1 - z0);
		
		var x321 = (point2.x - x0) / (x1 - x0);
		var y321 = (point2.y - y0) / (y1 - y0);
		var z321 = (point2.z - z0) / (z1 - z0);*/
		
		return {l: l, m: m, n: n, x1: x0, y1: y0, z1: z0};
	},
	
	getLineEquation2d: function(point1, point2)
	{
		var x1 = point1.x, y1 = point1.y;
		var x2 = point2.x, y2 = point2.y;
		
		//y = kx + b
		var k = (y2 - y1) / (x2 - x1);
		var b = y1 - k * x1;
		
		return {k: k, b: b};
	},
	
	isIntersectionLineAndLine: function(equation1, equation2)
	{
		var x10 = equation1.x1;
		var y10 = equation1.y1;
		var z10 = equation1.z1;
		var l0 = equation1.l;
		var m0 = equation1.m;
		var n0 = equation1.n;
		
		var x11 = equation2.x1;
		var y11 = equation2.y1;
		var z11 = equation2.z1;
		var l1 = equation2.l;
		var m1 = equation2.m;
		var n1 = equation2.n;
		
		var x = (x10 * m0 * l1 - x11 * m1 * l0 - y10 * l0 * l1 + y11 * l0 * l1) / (m0 * l1 - m1 * l0);
		var y = (y10 * l0 *m1 - y11 * l1 * m0 - x10 * m0 * m1 + x11 * m0 * m1) / (l0 * m1 - l1 * m0);
		var z = (z10 * m0 * n1 - z11 * m1 * n0 - y10 * n0 * n1 + y11 * n0 * n1) / (m0 * n1 - m1 * n0);
		
		
		var xo = equation1.x1;
		var yo = equation1.y1;
		var zo = equation1.z1;
		var p = equation1.l;
		var q = equation1.m;
		var r = equation1.n;
		
		var x1 = equation2.x1;
		var y1 = equation2.y1;
		var z1 = equation2.z1;
		var p1 = equation2.l;
		var q1 = equation2.m;
		var r1 = equation2.n;
		
		var x = (xo*q*p1-x1*q1*p-yo*p*p1+y1*p*p1) / (q*p1-q1*p);
		var y = (yo*p*q1-y1*p1*q-xo*q*q1+x1*q*q1) / (p*q1-p1*q);
		var z = (zo*q*r1-z1*q1*r-yo*r*r1+y1*r*r1) / (q*r1-q1*r);
		
		return {x: x, y: y, z: z};
	},
	
	//поиск точки пересечения плоскости и прямой
	isIntersectionPlainAndLine: function(plainEquation, lineEquation)
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
	},
	
	isIntersectionPlainAndLineSegment: function(plainEquation, point1, point2, projPoint1, projPoint2)
	{
		var res = null;
		var lineEquation = this.getLineEquation(point1, point2);
		
		var intersection = this.isIntersectionPlainAndLine(plainEquation, lineEquation);
		var convertResult = this._convertAndTurnPoint(intersection.x, intersection.y, intersection.z);
		var isBetweenX = (convertResult.x >= projPoint1.x && convertResult.x <= projPoint2.x) || (convertResult.x <= projPoint1.x && convertResult.x >= projPoint2.x);
		var isBetweenY = (convertResult.y >= projPoint1.y && convertResult.y <= projPoint2.y) || (convertResult.y <= projPoint1.y && convertResult.y >= projPoint2.y);
		
		//принадлежит ли даная точка отрезку
		if(isBetweenX && isBetweenY)
		{
			var vectorMultiplication = ((convertResult.x - projPoint1.x) * (projPoint2.y - projPoint1.y)) - ((convertResult.y - projPoint1.y) * (projPoint2.x - projPoint1.x));
			if(Math.round(vectorMultiplication) === 0)
			{
				res = convertResult;
			}
		}
		
		return res;
	},
	
	isPoint2DLieOnLine: function(lineEquation, point)
	{
		var bRes = false;
		
		bRes = !!(Math.round(point.y * 1000) / 1000 === Math.round((lineEquation.k * point.x + lineEquation.b) * 1000) / 1000);
		
		return bRes;
	},
	
	isPointLieIntoPlane: function(planeEquation, point)
	{
		var bRes = false;
		
		var resEquation = planeEquation.a * point.x + planeEquation.b * point.y + planeEquation.c * point.z + planeEquation.d; 
		bRes = !!(Math.round(resEquation) == 0);
		
		return bRes;
	},
	
	isPointsLieIntoOnePlane2: function(point1, point2, point3, point4)
	{
		var bRes = false;
		
		var plain1 = this.getPlainEquation(point1, point2, point3);
		var plain2 = this.getPlainEquation(point3, point4, point1);
		
		//todo пересмотреть округление
		if(Math.round(plain1.a) === Math.round(plain2.a) && Math.round(plain1.b) === Math.round(plain2.b) && Math.round(plain1.c) === Math.round(plain2.c) && Math.round(plain1.d) === Math.round(plain2.d))
		{
			bRes = true;
		}
		
		return bRes;
	},
	
	isPointsLieIntoOnePlane: function(point1, point2, point3, point4)
	{
		var bRes = false;
		
		var plain1 = this.getPlainEquation(point1, point2, point3);
		
		if(this.isPointLieIntoPlane(plain1, point4))
		{
			bRes = true;
		}
		
		return bRes;
	},
	
	isPointsLieIntoOnePlane3: function(point1, point2, point3, point4)
	{
		/*var vector1 = Math.sqrt(Math.pow(point4.x - point1.x, 2) + Math.pow(point4.y - point1.y, 2) + Math.pow(point4.z - point1.z, 2));//DA
		var vector2 = Math.sqrt(Math.pow(point4.x - point2.x, 2) + Math.pow(point4.y - point2.y, 2) + Math.pow(point4.z - point2.z, 2));//DB
		var vector2 = Math.sqrt(Math.pow(point4.x - point3.x, 2) + Math.pow(point4.y - point3.y, 2) + Math.pow(point4.z - point3.z, 2));//DC*/
		
		var vector1 = {x: point4.x - point1.x, y: point4.y - point1.y, z: point4.z - point1.z};//DA
		var vector2 = {x: point4.x - point2.x, y: point4.y - point2.y, z: point4.z - point2.z};//DB
		var vector3 = {x: point4.x - point3.x, y: point4.y - point3.y, z: point4.z - point3.z};//DC
		
		var a1 = vector1.x;
		var b1 = vector1.y;
		var c1 = vector1.z;
		var a2 = vector2.x;
		var b2 = vector2.y;
		var c2 = vector2.z;
		var a3 = vector3.x;
		var b3 = vector3.y;
		var c3 = vector3.z;
		
		var res = a1 * b2 * c3 + a3 * b1 * c2 + a2 * b3 * c1 - a3 * b2 * c1 - a1 * b3 * c2 - a2 * b1 * c3;
		
		return res;
	},
	
	//получаем площадь произвольного выпуклого четырехугольника
	getAreaQuadrilateral: function(point0, point1, point2, point3)
	{
		//длины сторон
		var a = Math.sqrt(Math.pow(point3.x - point0.x, 2) + Math.pow(point3.y - point0.y, 2));
		var b = Math.sqrt(Math.pow(point1.x - point0.x, 2) + Math.pow(point1.y - point0.y, 2));
		var c = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
		var d = Math.sqrt(Math.pow(point3.x - point2.x, 2) + Math.pow(point3.y - point2.y, 2));
		
		//длины диагоналей
		var e = Math.sqrt(Math.pow(point3.x - point1.x, 2) + Math.pow(point3.y - point1.y, 2));
		var f = Math.sqrt(Math.pow(point0.x - point2.x, 2) + Math.pow(point0.y - point2.y, 2));
		
		//полупериметр
		var p = (a + b + c + d) / 2;
		
		
		var res = Math.sqrt((p - a) * (p - b) * (p - c) * (p - d) + (1/4) * ((e * f + a * c + b * d) * (e * f - a * c - b * d)));
		
		return res;
	},
	
	//получаем площадь произвольного трехугольника
	getAreaTriangle: function(point0, point1, point2)
	{
		//длины сторон
		var a = Math.sqrt(Math.pow(point1.x - point0.x, 2) + Math.pow(point1.y - point0.y, 2));
		var b = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
		var c = Math.sqrt(Math.pow(point2.x - point0.x, 2) + Math.pow(point2.y - point0.y, 2));
		
		//полупериметр
		var p = (a + b + c ) / 2;

		var res = Math.sqrt(p * (p - a) * (p - b) * (p - c));
		
		return res;
	},
	
	//из массива точек получаем минимальные/максимальные x,y,z
	getMinMaxPoints: function(points)
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
	},
	
	//TODO временная функция для теста результата значений
	getPlainEquation3: function(point1, point2, point3)
	{
		var a1 = point1.x, b1 = point1.y, c1 = point1.z, a2 = point2.x, b2 = point2.y, c2 = point2.z, a3 = point3.x, b3 = point3.y, c3 = point3.z;
		
		var subMatrix = function(oldmat, row, col) 
		{
			var i;
			var j;
			var m = 0;
			var k = 0;
			var len = oldmat.length;
			var retmat = [];

			if ((len <= row) || (len <= col)) return 0;

			for (j = 0; j < len; j++) {
				if (j != row) {
					retmat[k] = [];
					for (i = 0; i < len; i++) {
						if (i != col) {
							retmat[k][m] = oldmat[j][i];
							m++;
						}
					}
					k++;
				}
				m = 0;
			}
			return retmat;
		};
		
		var determinant = function(mat) 
		{
			var i;
			var tmpVal = 0;
			var row = mat.length;
			var newDet = [];
			newDet[0] = [];

			switch (row) {
				case 1:
					return mat[0][0];
				case 2:
					return (mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0]);
				default:
					for (i = 0; i < row; i++) {
						if (mat[0][i] == 0) i++;
						if (i < row) {
							newDet = subMatrix(mat, 0, i);
							if (!isNaN(mat[0][i]))
								tmpVal += parseFloat(mat[0][i]) * Math.pow(-1, i) * determinant(newDet);
						}
					}
					return tmpVal;
			}
		};
		
		var replaceCol = function(mat, col, vec) 
		{
			var i = 0;
			var j = 0;
			var tmp = [];

			for (i = 0; i < mat.length; i++) {
				tmp[i] = [];

				for (j = 0; j < mat.length; j++) {
					if (col == j)
						tmp[i][col] = vec[i];
					else
						tmp[i][j] = mat[i][j]; 

				}
			}
			return tmp;
		};

		
		var mat = [];
		mat[0] = []; mat[1] = []; mat[2] = [];
		mat[0][0] = a1; mat[0][1] = b1; mat[0][2] = c1;
		mat[1][0] = a2; mat[1][1] = b2; mat[1][2] = c2;
		mat[2][0] = a3; mat[2][1] = b3; mat[2][2] = c3;

		var det = determinant(mat);
		
		var vec = [-1, -1, -1];
		var factor;

		var a = determinant(replaceCol(mat, 0, vec));
		if (a < 0) 
		{
			factor = -1;
		}
		else 
		{
			factor = 1;
		}
		a *= factor;
		
		var b = determinant(replaceCol(mat, 1, vec)) * factor;
		var c = determinant(replaceCol(mat, 2, vec)) * factor;
		var d = det * factor;
		
		var res1 = {a: a, b: b, c: c, d: d};
		/*var t = this.getPlainEquation(point1, point2, point3)
		
		if(!(Math.sign(res1.a) === Math.sign(t.a) && Math.sign(res1.b) === Math.sign(t.b) && Math.sign(res1.c) === Math.sign(t.c) && Math.sign(res1.d) === Math.sign(t.d)))
		{
			console.log("palundra");
		}*/
		
		return res1;
	},
	
	//TODO если будет проблема при отрисовке граней(перекрытие друг другом), вернуть протестированную функцию  - getPlainEquation3
	getPlainEquation: function(point1, point2, point3)
	{
		var x1 = point1.x, y1 = point1.y, z1 = point1.z;
		var x2 = point2.x, y2 = point2.y, z2 = point2.z;
		var x3 = point3.x, y3 = point3.y, z3 = point3.z;
		
		var a = x2 - x1;
		var b = y2 - y1;
		var c = z2 - z1;
		var d = x3 - x1;
		var e = y3 - y1;
		var f = z3 - z1;
		
		var xK = b*f - e*c;
		var yK = -(a*f - d*c);
		var zK = a*e - d*b;
		
		var a1 = -xK;
		var b1 = -yK;
		var c1 = -zK;
		var d1 = -(-y1 * yK - x1*xK - z1 * zK);
		
		return {a: a1, b: b1, c: c1, d: d1};
	},
	
	//уравнение плоскости
	getPlainEquation2: function(point1, point2, point3)
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
			
		//(x - x1)*(y21 * z31 - x21 * y31) - (y - y1)*(x21 * z31 - z21 * x31) + (z - z1)(x21 * y31 - y21 * x31) 
		
		var tempA = y21 * z31 - z21 * y31;
		
		var tempB = x21 * z31 - z21 * x31;
		
		var tempC = x21 * y31 - y21 * x31;
		
		//(x - x1)*(tempA) - (y - y1)*(tempB) + (z - z1)(tempC)
		
		//x * tempA - x1 * tempA - y * tempB + y1 * tempB + z * tempC - z1 * tempC
		
		var a = tempA;
		var b = tempB;
		var c = tempC;
		var d =  y1 * tempB - x1 * tempA - z1 * tempC;
			
		return {a: a, b: b, c: c, d: d};
	},		
	
	
	//******calculate graphic objects for 3d*******
	calculateRect3D : function(point1, point2, point3, point4, point5, point6, point7, point8, val, isNotDrawDownVerge, isNotOnlyFrontFaces)
	{
		var res;
		
		var frontPaths = [];
		var darkPaths = [];
		
		var addPathToArr = function(isFront, face, index)
		{
			frontPaths[index] = null;
			darkPaths[index] = null;
			
			if(isFront)
			{
				frontPaths[index] = face;
			}
			else
			{
				darkPaths[index] = face;
			}
		};
		
		var face;
		//front
		face = this._calculatePathFace(point1, point5, point8, point4, true);
		addPathToArr(this._isVisibleVerge3D(point5, point1, point4, val), face, 0);
		
		//down
		face = this._calculatePathFace(point1, point2, point3, point4, true);
		addPathToArr(this._isVisibleVerge3D(point4, point1, point2, val), face, 1);
		
		//left
		face = this._calculatePathFace(point1, point5, point6, point2, true);
		addPathToArr((!isNotDrawDownVerge && this._isVisibleVerge3D(point2, point1, point5, val)), face, 2);
		
		//right
		face = this._calculatePathFace(point4, point8, point7, point3, true);
		addPathToArr(this._isVisibleVerge3D(point8, point4, point3, val), face, 3);
		
		//up
		face = this._calculatePathFace(point5, point6, point7, point8, true);
		addPathToArr(this._isVisibleVerge3D(point6, point5, point8, val), face, 4);
		
		//unfront
		face = this._calculatePathFace(point2, point6, point7, point3, true);
		addPathToArr(this._isVisibleVerge3D(point3, point2, point6, val), face, 5);
		
		if(!isNotOnlyFrontFaces)
		{
			res = frontPaths;
		}
		else
		{
			res = {frontPaths: frontPaths, darkPaths: darkPaths};
		}
		
		return res;
	},
	
	_calculatePathFace: function(point1, point2, point3, point4, isConvertPxToMM)
	{
		var pxToMm = 1;
		if(isConvertPxToMM)
		{
			pxToMm = this.calcProp.pxToMM;
		} 

		var pathId = this.cChartSpace.AllocPath();
		var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.calcProp.pathH;
		var pathW = this.calcProp.pathW;

		path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
		path.lnTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
		path.lnTo(point3.x / pxToMm * pathW, point3.y / pxToMm * pathH);
		path.lnTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
		path.lnTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);

		return pathId;
	},
	
	calculatePathFacesArray: function(faceArr, isConvertPxToMM)
	{
		var pxToMm = 1;
		if(isConvertPxToMM)
		{
			pxToMm = this.calcProp.pxToMM;
		} 

		var pathId = this.cChartSpace.AllocPath();
		var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.calcProp.pathH;
		var pathW = this.calcProp.pathW;
		
		var firstPoint = null;
		for(var i = 0; i < faceArr.length; i++)
		{
			if(faceArr[i] && faceArr[i].point)
			{
				if(null === firstPoint)
				{
					path.moveTo(faceArr[i].point.x / pxToMm * pathW, faceArr[i].point.y / pxToMm * pathH);
					firstPoint = faceArr[i].point;
				}
				else
				{
					path.lnTo(faceArr[i].point.x / pxToMm * pathW, faceArr[i].point.y / pxToMm * pathH);
				}
			}
		}
		
		if(null !== firstPoint)
		{
			path.lnTo(firstPoint.x / pxToMm * pathW, firstPoint.y / pxToMm * pathH);
		}

		return pathId;
	},
	
	_isVisibleVerge3D: function(k, n, m, val)
	{
		//roberts method - calculate normal
		var aX = n.x * m.y - m.x * n.y;
		var bY = - (k.x * m.y - m.x * k.y);
		var cZ = k.x * n.y - n.x * k.y;
		var visible = aX + bY + cZ;
		
		var result;
		if(this.calcProp.type == c_oChartTypes.Bar)
		{
			result = !!(val > 0 && visible < 0 || val < 0 && visible > 0);
			if(!(this.calcProp.subType == "stacked") && !(this.calcProp.subType == "stackedPer") && this.cChartSpace.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX)
				result = !result;
		}
		else if(this.calcProp.type == c_oChartTypes.Line)
		{
			result = visible < 0;
		}
		else if(this.calcProp.type == c_oChartTypes.HBar)
		{
			result = !!(val < 0 && visible < 0 || val > 0 && visible > 0);
			
			if(!(this.calcProp.subType == "stacked") && !(this.calcProp.subType == "stackedPer") && this.cChartSpace.chart.plotArea.valAx.scaling.orientation != ORIENTATION_MIN_MAX)
				result = !result;
		}
		
		return result;
	},
	
	calculatePolygon: function(array)
	{
		if(!array)
			return null;

		var pathId = this.cChartSpace.AllocPath();
		var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.calcProp.pathH;
		var pathW = this.calcProp.pathW;

		
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
		

		return pathId;
	},
	
	_isSwitchCurrent3DChart: function(chartSpace)
	{
		var res = false;

		var chart = chartSpace && chartSpace.chart ? chartSpace.chart.plotArea.charts[0]: null;
		var typeChart = chart ? chart.getObjectType() : null;
		
		if(isTurnOn3DCharts && chartSpace && chartSpace.chart.view3D)
		{
			var isPerspective = !chartSpace.chart.view3D.getRAngAx();
			
			var isBar = typeChart === AscDFH.historyitem_type_BarChart && chart && chart.barDir !== AscFormat.BAR_DIR_BAR;
			var isHBar = typeChart === AscDFH.historyitem_type_BarChart && chart && chart.barDir === AscFormat.BAR_DIR_BAR;
			var isLine = typeChart === AscDFH.historyitem_type_LineChart;
			var isPie = typeChart === AscDFH.historyitem_type_PieChart;
			var isArea = typeChart === AscDFH.historyitem_type_AreaChart;
			var isSurface = typeChart === AscDFH.historyitem_type_SurfaceChart;
			
			if(!isPerspective && (isBar || isLine || isHBar || isPie || isArea || isSurface))
			{
				res = true;
			}
			else if(isPerspective && (isBar || isLine|| isHBar || isArea || isPie || isSurface))
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
	
	this.temp = [];
	this.temp2 = [];
}

drawBarChart.prototype =
{
    constructor: drawBarChart,
	
	recalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this.paths = {};
		this.summBarVal = [];
		
		this.sortZIndexPaths = [];
		
		this._recalculateBars();
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
		{
			this._DrawBars();
		}
	},
	
	_DrawBars: function()
	{
		this.cChartDrawer.cShapeDrawer.Graphics.SaveGrState();
		this.cChartDrawer.cShapeDrawer.Graphics.AddClipRect((this.chartProp.chartGutter._left - 1) / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - 1) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
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
	
	_recalculateBars: function (/*isSkip*/)
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
		
		var nullPositionOX = this.cChartSpace.chart.plotArea.valAx && this.cChartSpace.chart.plotArea.valAx.scaling.logBase ? this.chartProp.nullPositionOXLog : this.chartProp.nullPositionOX;
		
		var height, startX, startY, val, paths, seriesHeight = [], tempValues = [], seria, startYColumnPosition, startXPosition, prevVal, idx, seriesCounter = 0;
		var cubeCount = 0;
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
					
					var testHeight;
					if((this.cChartDrawer.calcProp.axisMax > 0 && this.cChartDrawer.calcProp.axisMin > 0) || (this.cChartDrawer.calcProp.axisMax < 0 && this.cChartDrawer.calcProp.axisMin < 0))
					{
						testHeight = Math.abs(yPoints[0].pos - yPoints[yPoints.length - 1].pos) * this.chartProp.pxToMM;
					}
					else
					{
						if(val > 0)
						{
							var endBlockPosition = this.cChartDrawer.getYPosition((this.cChartDrawer.calcProp.axisMax), yPoints) * this.chartProp.pxToMM;
							var startBlockPosition = prevVal ? this.cChartDrawer.getYPosition((0), yPoints) * this.chartProp.pxToMM : nullPositionOX;
							testHeight = startBlockPosition - endBlockPosition;
						}
						else
						{
							var endBlockPosition = this.cChartDrawer.getYPosition((this.cChartDrawer.calcProp.axisMin), yPoints) * this.chartProp.pxToMM;
							var startBlockPosition = prevVal ? this.cChartDrawer.getYPosition((0), yPoints) * this.chartProp.pxToMM : nullPositionOX;
							testHeight = startBlockPosition - endBlockPosition;
						}
					}
					
					this.calculateParallalepiped(startX, startY, individualBarWidth, testHeight, val, isValMoreZero, isValLessZero, i, idx, cubeCount, this.temp2);
					this.calculateParallalepiped(startX, startY, individualBarWidth, height, val, isValMoreZero, isValLessZero, i, idx, cubeCount, this.temp);
					
					cubeCount++;
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
			if(this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer")
			{
				//если будут найдены проблемы при отрисовке stacked rAngAx - раскомментировать ветку
				/*if(this.cChartDrawer.processor3D.view3D.rAngAx)
				{
					var angle = this.cChartDrawer.processor3D.angleOx;
					this.temp.sort (function sortArr(a, b)
					{
						if(angle > 0)
						{
							if(Math.abs(angle) < Math.PI)
							{
								return  a.y - b.y;
							}
							else
							{
								return  b.y - a.y;
							}
						}
						else
						{
							if(Math.abs(angle) < Math.PI)
							{
								return  b.y - a.y;
							}
							else
							{
								return  a.y - b.y;
							}
						}
					})
				}*/
				
				var cSortFaces = new CSortFaces(this.cChartDrawer);
				this.sortParallelepipeds = cSortFaces.sortParallelepipeds(this.temp);
			}
			else if("normal" === this.chartProp.subType)
			{
				var cSortFaces = new CSortFaces(this.cChartDrawer);
				this.sortParallelepipeds = cSortFaces.sortParallelepipeds(this.temp2);
			}
			else
			{
				this.sortZIndexPaths.sort (function sortArr(a, b)
				{
					if(b.zIndex == a.zIndex)
						return  b.y - a.y;
					else
						return  b.zIndex - a.zIndex;
				});
			}
		}
    },
	
	_getStartYColumnPosition: function (seriesHeight, i, j, val, yPoints)
	{
		var startY, height, curVal, prevVal, endBlockPosition, startBlockPosition;
		var nullPositionOX = this.cChartSpace.chart.plotArea.valAx && this.cChartSpace.chart.plotArea.valAx.scaling.logBase ? this.chartProp.nullPositionOXLog : this.chartProp.nullPositionOX;
		
		
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
	
	calculateParallalepiped: function(startX, startY, individualBarWidth, height, val, isValMoreZero, isValLessZero, i, idx, cubeCount, arr)
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
			gapDepth = (perspectiveDepth + DiffGapDepth + DiffGapDepth) * i + DiffGapDepth;
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
		
		var paths = this.cChartDrawer.calculateRect3D(point1, point2, point3, point4, point5, point6, point7, point8, val, null, true);
		
			
		//не проецируем на плоскость
		var point11 = this.cChartDrawer._convertAndTurnPoint(x1, y1, z1, null, null, true);
		var point22 = this.cChartDrawer._convertAndTurnPoint(x2, y2, z2, null, null, true);
		var point33 = this.cChartDrawer._convertAndTurnPoint(x3, y3, z3, null, null, true);
		var point44 = this.cChartDrawer._convertAndTurnPoint(x4, y4, z4, null, null, true);
		var point55 = this.cChartDrawer._convertAndTurnPoint(x5, y5, z5, null, null, true);
		var point66 = this.cChartDrawer._convertAndTurnPoint(x6, y6, z6, null, null, true);
		var point77 = this.cChartDrawer._convertAndTurnPoint(x7, y7, z7, null, null, true);
		var point88 = this.cChartDrawer._convertAndTurnPoint(x8, y8, z8, null, null, true);
		
		
		var arrPoints = [[point1, point4, point8, point5], [point1, point2, point3, point4], [point1, point2, point6, point5], [point4, point8, point7, point3], [point5, point6, point7, point8], [point6, point2, point3, point7]];
		
		var arrPoints2 = [[point11, point44, point88, point55], [point11, point22, point33, point44], [point11, point22, point66, point55], [point44, point88, point77, point33], [point55, point66, point77, point88], [point66, point22, point33, point77]];
		
	
		if(!arr)
		{
			arr = [];
		}
		if(!arr[cubeCount])
		{
			arr[cubeCount] = {};
		}
		if(!arr[cubeCount].faces)
		{
			arr[cubeCount].faces = [];
			arr[cubeCount].arrPoints = [point11, point22, point33, point44, point55, point66, point77, point88];
			arr[cubeCount].z = point11.z;
			arr[cubeCount].y = point11.y;
		}
		
		for(var k = 0; k < paths.frontPaths.length; k++)
		{
			if(null === paths.frontPaths[k] && null === paths.darkPaths[k])
				continue;
			
			//this.sortZIndexPaths.push({seria: i, point: idx, verge: k, paths: paths[k], points: arrPoints2[k], points2: arrPoints[k], plainEquation: plainEquation});
			
			var plainEquation = this.cChartDrawer.getPlainEquation(arrPoints2[k][0], arrPoints2[k][1], arrPoints2[k][2], arrPoints2[k][3]);
			var plainArea = this.cChartDrawer.getAreaQuadrilateral(arrPoints[k][0], arrPoints[k][1], arrPoints[k][2], arrPoints[k][3]);
			arr[cubeCount].faces.push({seria: i, point: idx, verge: k, frontPaths: paths.frontPaths[k], darkPaths: paths.darkPaths[k], points: arrPoints2[k], points2: arrPoints[k], plainEquation: plainEquation, plainArea: plainArea});
		}
		
		return paths;
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
		
		var path = this.paths.series[ser][val];
		//ToDo пересмотреть для 3d диаграмм
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			if(AscFormat.isRealNumber(this.paths.series[ser][val][0]))
			{
				path = this.paths.series[ser][val][0];
			}
			else if(AscFormat.isRealNumber(this.paths.series[ser][val][5]))
			{
				path = this.paths.series[ser][val][5];
			}
			else if(AscFormat.isRealNumber(this.paths.series[ser][val][2]))
			{
				path = this.paths.series[ser][val][2];
			}
			else if(AscFormat.isRealNumber(this.paths.series[ser][val][3]))
			{
				path = this.paths.series[ser][val][3];
			}
		}
		
		if(!AscFormat.isRealNumber(path))
			return;
		var oPath = this.cChartSpace.GetPath(path);
		var oCommand0 = oPath.getCommandByIndex(0);
		var oCommand1 = oPath.getCommandByIndex(1);
		var oCommand2 = oPath.getCommandByIndex(2);

		var x = oCommand0.X;
		var y = oCommand0.Y;
		
		var h = oCommand0.Y - oCommand1.Y;
		var w = oCommand2.X - oCommand1.X;
		
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
        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		
		var pxToMm = this.chartProp.pxToMM;
		
		path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x / pxToMm * pathW, (y - h) / pxToMm * pathH);
		path.lnTo((x + w) / pxToMm * pathW, (y - h) / pxToMm * pathH);
		path.lnTo((x + w) / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x / pxToMm * pathW, y / pxToMm * pathH);
		
		return pathId;
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
		
		var drawVerges = function(i, j, paths, onlyLessNull, k, isNotPen, isNotBrush)
		{
			var brush = null, pen = null, options;
			options = t._getOptionsForDrawing(i, j, onlyLessNull);
			if(paths !== null && options !== null)
			{
				if(!isNotPen)
				{
					pen = options.pen;
				}
				if(!isNotBrush)
				{
					brush = options.brush;
				}
				
				t._drawBar3D(paths, pen, brush, k, options.val);
			}
		};
		
		if(this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer")
		{
			//если будут найдены проблемы при отрисовке stacked rAngAx - раскомментировать ветку
			/*if(this.cChartDrawer.processor3D.view3D.rAngAx)
			{
				for(var i = 0; i < this.temp.length; i++)
				{
					var faces = this.temp[i].faces;
					for(var j = 0; j < faces.length; j++)
					{
						var face = faces[j];
						drawVerges(face.seria, face.point, face.paths, null, face.verge);
					}	
				}
			}*/
			
			for(var i = 0; i < this.sortParallelepipeds.length; i++)
			{
				var index = this.sortParallelepipeds[i].nextIndex;
				var faces = this.temp[index].faces;
				for(var j = 0; j < faces.length; j++)
				{
					var face = faces[j];
					drawVerges(face.seria, face.point, face.darkPaths, null, face.verge, null, true);
				}	
			}
			
			for(var i = 0; i < this.sortParallelepipeds.length; i++)
			{
				var index = this.sortParallelepipeds[i].nextIndex;
				var faces = this.temp[index].faces;
				for(var j = 0; j < faces.length; j++)
				{
					var face = faces[j];
					drawVerges(face.seria, face.point, face.frontPaths, null, face.verge);
				}	
			}
		}
		else if("normal" === this.chartProp.subType)
		{
			for(var i = 0; i < this.sortParallelepipeds.length; i++)
			{
				var index = this.sortParallelepipeds[i].nextIndex;
				var faces = this.temp[index].faces;
				for(var j = 0; j < faces.length; j++)
				{
					var face = faces[j];
					drawVerges(face.seria, face.point, face.darkPaths, null, face.verge, null, true);
				}	
			}
			
			for(var i = 0; i < this.sortParallelepipeds.length; i++)
			{
				var index = this.sortParallelepipeds[i].nextIndex;
				var faces = this.temp[index].faces;
				for(var j = 0; j < faces.length; j++)
				{
					var face = faces[j];
					drawVerges(face.seria, face.point, face.frontPaths, null, face.verge);
				}	
			}
		}
		else
		{
			for(var i = 0; i < this.sortZIndexPaths.length; i++)
			{
				drawVerges(this.sortZIndexPaths[i].seria, this.sortZIndexPaths[i].point, this.sortZIndexPaths[i].paths, true, this.sortZIndexPaths[i].verge);
			}
			
			for(var i = 0; i < this.sortZIndexPaths.length; i++)
			{
				drawVerges(this.sortZIndexPaths[i].seria, this.sortZIndexPaths[i].point, this.sortZIndexPaths[i].paths, false, this.sortZIndexPaths[i].verge);
			}
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
			
		return {pen: pen, brush: brush, val: pt.val}
	},
	
	_drawBar3D: function(path, pen, brush, k, val)
	{
		//затемнение боковых сторон
		//в excel всегда темные боковые стороны, лицевая и задняя стороны светлые
		//TODO пересмотреть получения pen
		if(null === pen || (null !== pen && null === pen.Fill) || (null !== pen && null !== pen.Fill && null === pen.Fill.fill))
		{
			pen = AscFormat.CreatePenFromParams(brush, undefined, undefined, undefined, undefined, 0.1);
		}
		
		if(k !== 5 && k !== 0)
		{
			var  props = this.cChartSpace.getParentObjects();
			var duplicateBrush = brush;
			if(null !== brush)
			{
				duplicateBrush = brush.createDuplicate();
				var cColorMod = new AscFormat.CColorMod;
				
				if(k === 1 || k === 4)
				{
					//для градиентной заливки верхнюю и нижнюю грань закрашиываем первым и последним цветом соотвенственно
					if(duplicateBrush.fill && AscDFH.historyitem_type_GradFill === duplicateBrush.fill.getObjectType())
					{
						var colors = duplicateBrush.fill.colors;
						//ToDo проверить stacked charts!
						var color;
						var valAxOrientation = this.cChartSpace.chart.plotArea.valAx.scaling.orientation;
						if((val > 0 && valAxOrientation === ORIENTATION_MIN_MAX) || (val < 0 && valAxOrientation !== ORIENTATION_MIN_MAX))
						{
							if(k === 4 && colors && colors[0] && colors[0].color)
							{
								color = colors[0].color;
							}
							else if(k === 1 && colors[colors.length - 1] && colors[colors.length - 1].color)
							{
								color = colors[colors.length - 1].color;
							}
						}
						else
						{
							if(k === 4 && colors && colors[0] && colors[0].color)
							{
								color = colors[colors.length - 1].color;
							}
							else if(k === 1 && colors[colors.length - 1] && colors[colors.length - 1].color)
							{
								color = colors[0].color;
							}
						}
						
						var tempColor = new AscFormat.CUniFill();
						tempColor.setFill(new AscFormat.CSolidFill());
						tempColor.fill.setColor(color);
						duplicateBrush = tempColor;
					}

					cColorMod.val = 45000;
				}	
				else
				{
					cColorMod.val = 35000;
				}
				
				cColorMod.name = "shade";
				duplicateBrush.addColorMod(cColorMod);
				duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new AscFormat.CUniColor().RGBA);
				
				if(null === pen)
				{
					pen.setFill(duplicateBrush);
				}
			}

			this.cChartDrawer.drawPath(path, pen, duplicateBrush);
		}
		else
		{
			this.cChartDrawer.drawPath(path, pen, brush);
		}
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
	
	recalculate: function(chartsDrawer)
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
			if(val === this.paths.series[ser].length && this.paths.series[ser][val - 1] && AscFormat.isRealNumber(this.paths.series[ser][val - 1][5]))
			{
				path = this.paths.series[ser][val - 1][5];
			}
			else if(this.paths.series[ser][val] && AscFormat.isRealNumber(this.paths.series[ser][val][3]))//reverse
			{
				path = this.paths.series[ser][val][3];
			}
			else if(this.paths.series[ser][val] && AscFormat.isRealNumber(this.paths.series[ser][val][2]))
			{
				path = this.paths.series[ser][val][2];
			}
		}
		else
		{
			path = this.paths.points[ser][val].path;
		}
		
		if(!AscFormat.isRealNumber(path))
			return;

		var oPath = this.cChartSpace.GetPath(path);
		var oCommand0 = oPath.getCommandByIndex(0);
		var x = oCommand0.X;
		var y = oCommand0.Y;
		
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
        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);

		
		return pathId;
	},

	//TODO пока включаю функцию _calculateSplineLine. с _calculateSplineLine2 отрисовается неверно. проверить!
	_calculateSplineLine2 : function(x, y, x1, y1, x2, y2, x3, y3, xPoints, yPoints)
	{
        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		

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
		

		
		return pathId;
	},

	_calculateSplineLine : function(x, y, x1, y1, x2, y2, x3, y3, xPoints, yPoints)
	{
		var pathId = this.cChartSpace.AllocPath();
		var path  = this.cChartSpace.GetPath(pathId);

		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		var startCoords;
		var endCoords;

		for(var i = 0; i <= 1;)
		{
			var splineCoords = this.cChartDrawer.calculate_Bezier(x, y, x1, y1, x2, y2, x3, y3, i);

			if(i == 0)
			{
				startCoords = {x: this.cChartDrawer.getYPosition(splineCoords[0], xPoints, true), y: this.cChartDrawer.getYPosition(splineCoords[1], yPoints)};
			}

			endCoords = {x: this.cChartDrawer.getYPosition(splineCoords[0], xPoints, true), y: this.cChartDrawer.getYPosition(splineCoords[1], yPoints)};

			if(i == 0)
			{
				path.moveTo(startCoords.x * pathW, startCoords.y * pathH);
			}
			path.lnTo(endCoords.x * pathW, endCoords.y * pathH);

			i = i + 0.1;
		}

		return pathId;
	},

	_drawLines3D: function()
	{
		var t = this;
		
		var drawVerges = function(j, i)
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
		
		
		if(!this.cChartDrawer.processor3D.view3D.getRAngAx())
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
		
		if(k !== 2)
		{
			var props = this.cChartSpace.getParentObjects();
			var duplicateBrush = brush.createDuplicate();
			var cColorMod = new AscFormat.CColorMod;
			
			cColorMod.name = "shade";
			if(k == 1 || k == 4)
			{
				cColorMod.val = 45000;
			}
			else
			{
				cColorMod.val = 35000;
			}
			
			this._addColorMods(cColorMod, duplicateBrush);
			
			duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new AscFormat.CUniColor().RGBA);
			pen = AscFormat.CreatePenFromParams(duplicateBrush, undefined, undefined, undefined, undefined, 0.1);
			
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
		if(duplicateBrush)
		{
			duplicateBrush.addColorMod(cColorMod);
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
	this.upFaces = [];
	this.downFaces = [];
	
	this.sortZIndexPaths = [];
	this.sortZIndexPathsFront = [];
	this.sortZIndexPathsBack = [];
	this.sortZIndexPathsRight = [];
	this.sortZIndexPathsLeft = [];
	
	this.intersections = [];
	this.intersectionsFar = [];
	
	this.xPoints = null;
	this.yPoints = null;
	
	//for 3d
	this.darkFaces = null;
	this.gapDepth = null;
	this.perspectiveDepth = null;
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
		{
			this._drawBars3D();
		}	
		else
		{
			this._drawLines();
		}
	},
	
	recalculate : function(chartsDrawer)
    {
		this.paths = {};
		this.points = null;
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this._calculateProps();
		
		this._calculate();
	},
	
	_calculateProps: function()
	{
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			var gapDepth = this.cChartSpace.chart.plotArea.chart.gapDepth != null ? this.cChartSpace.chart.plotArea.chart.gapDepth : globalGapDepth;
			var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
			var perspectiveDepth = this.chartProp.subType === "normal" ? (perspectiveDepth / (gapDepth / 100 + 1)) / this.chartProp.seriesCount : perspectiveDepth / (gapDepth / 100 + 1);
			var DiffGapDepth = perspectiveDepth * (gapDepth / 2) / 100;
			
			this.perspectiveDepth = perspectiveDepth;
			if(this.chartProp.subType === "normal")
			{
				this.gapDepth = [];
				
				for(var i = 0; i < this.chartProp.seriesCount; i++)
				{
					this.gapDepth[i] = (this.perspectiveDepth + DiffGapDepth + DiffGapDepth) * i + DiffGapDepth;
				}
			}
			else
			{
				this.gapDepth = DiffGapDepth;
			}
		}
		
		this.xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		this.yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
	},
	
	_calculate: function ()
	{
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
				
				x  = this.xPoints[n].pos;
				y  = this.cChartDrawer.getYPosition(val, this.yPoints);
					
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
			
			if(this.cChartDrawer.nDimensionCount === 3)
			{
				//для normal рассчитываем видимые/невидимые грани для каждой серии
				if(this.chartProp.subType === "normal")
				{
					this._calculateDarkSideOfTheFace(i);
				}
				else if(this.darkFaces === null)
				{
					this._calculateDarkSideOfTheFace(null);
				}
			}
		}
		
		
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			this._calculatePaths3D();
			
			//var cSortFaces = new CSortFaces(this.cChartDrawer);
			//this.upFaces = cSortFaces.sortFaces(this.upFaces);
			
			var upDownFaces = this.upFaces.concat(this.downFaces);
			
			//более быстрая сортировка
			var angle = this.cChartDrawer.processor3D.angleOx;			
			if(angle < 0)
			{
				upDownFaces.sort (function sortArr(a, b)
				{
					if(b.midY === a.midY)
						return  a.seria - b.seria;
					else
						return  b.midY - a.midY;
				});
			}
			else
			{
				upDownFaces.sort (function sortArr(a, b)
				{
					if(b.midY === a.midY)
						return  a.seria - b.seria;
					else
						return  a.midY - b.midY;
				});
			}
			
			var anotherFaces = this.sortZIndexPathsFront.concat(this.sortZIndexPathsBack).concat(this.sortZIndexPathsLeft).concat(this.sortZIndexPathsRight);
			this.sortZIndexPaths = upDownFaces.concat(anotherFaces);
			
			//медленная, но более качественный сортировка
			//var anotherFaces = this.sortZIndexPathsFront.concat(this.sortZIndexPathsBack).concat(this.sortZIndexPathsLeft).concat(this.sortZIndexPathsRight);
			//this.sortZIndexPaths = this.upFaces.concat(anotherFaces);
			//this.sortZIndexPaths = this.downFaces.concat(this.sortZIndexPaths)
			//this.sortZIndexPaths = cSortFaces.sortFaces(this.sortZIndexPaths);
		}
		else
		{
			this._calculatePaths();
		}
	},
	
	_calculatePaths: function()
	{
		var points = this.points;
		var prevPoints;
		var isStacked = !!(this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked");
		
		for(var i = 0; i < points.length; i++)
		{	
			if(!this.paths.series)
				this.paths.series = [];
			
			prevPoints = isStacked ? this._getPrevSeriesPoints(points, i) : null;
				
			if(points[i])
			{
				this.paths.series[i] = this._calculateLine(points[i], prevPoints);
			}
		}
	},
	
	_calculatePaths3D: function()
	{
		var points = this.points;
		var prevPoints;
		var isStacked = !!(this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked");
		
		if(isStacked)
		{
			this._calculateAllIntersection();
		}
		
		for(var i = 0; i < points.length; i++)
		{	
			if(!this.paths.series)
				this.paths.series = [];
			
			prevPoints = isStacked ? this._getPrevSeriesPoints(points, i) : null;
				
			if(points[i])
			{
				if(isStacked)
				{
					this.paths.series[i] = this._calculateStacked3D(prevPoints, i, points);
				}
				else
				{
					this.paths.series[i] = this._calculateLine3D(points[i], i, points);
				}
			}
		}
	},
	
	_calculateLine: function(points, prevPoints)
	{
        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		
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

		return pathId;
	},
	
	_calculateLine3D: function (points, seriaNum)
    {
		//pointsIn3D[0] - верхняя кривая ближней стороны, pointsIn3D[1] - нижняя кривая ближней стороны, pointsIn3D[2] - верхняя кривая дальней стороны, pointsIn3D[3] - нижняя кривая дальней стороны
		var pointsIn3D = [], t = this, pxToMm = this.chartProp.pxToMM;
		
		//сдвиг по OZ в глубину
		var gapDepth = this.gapDepth[seriaNum];

		var getProjectPoints = function(currentZ, startN)
		{
			pointsIn3D[startN] = [];
			pointsIn3D[startN + 1] = [];			
			for(var i = 0; i < points.length; i++)
			{
				pointsIn3D[startN][i] = t.cChartDrawer._convertAndTurnPoint(points[i].x * pxToMm, points[i].y * pxToMm, currentZ + gapDepth);
				pointsIn3D[startN + 1][i] = t.cChartDrawer._convertAndTurnPoint(points[i].x * pxToMm, t.chartProp.nullPositionOX, currentZ + gapDepth);
			}
		};
		
		var zNear = 0;
		var zFar = this.perspectiveDepth;
		//рассчитываем ближние и дальние точки конкретной серии
		getProjectPoints(zNear, 0);
		getProjectPoints(zFar, 2);
		
		var res = this._calculateRect3D(pointsIn3D, seriaNum);
		
		return res;
    },
	
	_calculateStacked3D: function (prevPoints, seria, allPoints)
    {
		var points = allPoints[seria];
		var t = this, nullPositionOX = this.chartProp.nullPositionOX, pxToMm = this.chartProp.pxToMM, res = [];
		
		for(var i = 0; i < points.length - 1; i++)
		{
			var x = points[i].x * pxToMm;
			var y = points[i].y * pxToMm;
			var x1 = points[i + 1].x * pxToMm;
			var y1 = points[i + 1].y * pxToMm;
			
			//рассчитываем 8 точек для каждого ректа
			var prevX = prevPoints ? prevPoints[i].x * pxToMm : x;
			var prevY = prevPoints ? prevPoints[i].y * pxToMm : nullPositionOX;
			var prevX1 = prevPoints ? prevPoints[i + 1].x * pxToMm : x1;
			var prevY1 = prevPoints ? prevPoints[i + 1].y * pxToMm : nullPositionOX;
			
			
			if(prevY < y && prevY1 < y1)
			{
				var temp = y;
				y = prevY;
				prevY = temp;
				
				var temp1 = y1;
				y1 = prevY1;
				prevY1 = temp1;
				
				var temp = x;
				x = prevX;
				prevX = temp;
				
				var temp1 = x1;
				x1 = prevX1;
				prevX1 = temp1;
			}
			
			if(!this.prevPoints)
				this.prevPoints = [];
			
			if(!this.prevPoints[i])
				this.prevPoints[i] = [];
			

			//начальные точки, без проекции и без поворота
			var p1 = {x: x, y: y, z: this.gapDepth};
			var p2 = {x: x, y: y, z: this.gapDepth + this.perspectiveDepth};
			var p3 = {x: x1, y: y1, z: this.gapDepth + this.perspectiveDepth};
			var p4 = {x: x1, y: y1, z: this.gapDepth};
			var p5 = {x: prevX, y: prevY, z: this.gapDepth};
			var p6 = {x: prevX, y: prevY, z: this.gapDepth + this.perspectiveDepth};
			var p7 = {x: prevX1, y: prevY1, z: this.gapDepth + this.perspectiveDepth};
			var p8 = {x: prevX1, y: prevY1, z: this.gapDepth};
			var arrNotRotatePoints = [p1, p2, p3, p4, p5, p6, p7, p8];
			
			//повернутые, но без проекции
			var point11 = t.cChartDrawer._convertAndTurnPoint(p1.x, p1.y, p1.z, null, null, true);
			var point22 = t.cChartDrawer._convertAndTurnPoint(p2.x, p2.y, p2.z, null, null, true);
			var point33 = t.cChartDrawer._convertAndTurnPoint(p3.x, p3.y, p3.z, null, null, true);
			var point44 = t.cChartDrawer._convertAndTurnPoint(p4.x, p4.y, p4.z, null, null, true);
			var point55 = t.cChartDrawer._convertAndTurnPoint(p5.x, p5.y, p5.z, null, null, true);
			var point66 = t.cChartDrawer._convertAndTurnPoint(p6.x, p6.y, p6.z, null, null, true);
			var point77 = t.cChartDrawer._convertAndTurnPoint(p7.x, p7.y, p7.z, null, null, true);
			var point88 = t.cChartDrawer._convertAndTurnPoint(p8.x, p8.y, p8.z, null, null, true);
			var arrPoints = [point11, point22, point33, point44, point55, point66, point77, point88];
			
			//спроецированные и повернутые точки
			var point1 = t.cChartDrawer._convertAndTurnPoint(p1.x, p1.y, p1.z);
			var point2 = t.cChartDrawer._convertAndTurnPoint(p2.x, p2.y, p2.z);
			var point3 = t.cChartDrawer._convertAndTurnPoint(p3.x, p3.y, p3.z);
			var point4 = t.cChartDrawer._convertAndTurnPoint(p4.x, p4.y, p4.z);
			var point5 = t.cChartDrawer._convertAndTurnPoint(p5.x, p5.y, p5.z);
			var point6 = t.cChartDrawer._convertAndTurnPoint(p6.x, p6.y, p6.z);
			var point7 = t.cChartDrawer._convertAndTurnPoint(p7.x, p7.y, p7.z);
			var point8 = t.cChartDrawer._convertAndTurnPoint(p8.x, p8.y, p8.z);
			var arrPointsProject = [point1, point2, point3, point4, point5, point6, point7, point8];
			
			var paths = this._calculateRect3DStacked(arrPoints, arrPointsProject, arrNotRotatePoints, i, seria);
			res.push(paths);
		}
		
		return res;
    },
	
	_calculateDarkSideOfTheFace: function(seria)
	{
		var pxToMm = this.chartProp.pxToMM;	
		
		var minX = this.xPoints[0].pos < this.xPoints[this.xPoints.length - 1].pos ? this.xPoints[0].pos * pxToMm : this.xPoints[this.xPoints.length - 1].pos * pxToMm;
		var maxX = this.xPoints[0].pos < this.xPoints[this.xPoints.length - 1].pos ? this.xPoints[this.xPoints.length - 1].pos * pxToMm : this.xPoints[0].pos * pxToMm;
		
		var minValue = this.cChartDrawer.calcProp.min;
		var maxValue = this.cChartDrawer.calcProp.max; 
		if(this.chartProp.subType == "stackedPer")
		{
			minValue = minValue / 100;
			maxValue = maxValue / 100;
		}
		
		var maxY = this.cChartDrawer.getYPosition(minValue, this.yPoints) * pxToMm;
		var minY = this.cChartDrawer.getYPosition(maxValue, this.yPoints) * pxToMm;
		
		var gapDepth = seria === null ? this.gapDepth : this.gapDepth[seria];
		
		var point1 = this.cChartDrawer._convertAndTurnPoint(minX, maxY, gapDepth);
		var point2 = this.cChartDrawer._convertAndTurnPoint(minX, maxY, gapDepth + this.perspectiveDepth);
		var point3 = this.cChartDrawer._convertAndTurnPoint(maxX, maxY, gapDepth + this.perspectiveDepth);
		var point4 = this.cChartDrawer._convertAndTurnPoint(maxX, maxY, gapDepth);
		
		var point5 = this.cChartDrawer._convertAndTurnPoint(minX, minY, gapDepth);
		var point6 = this.cChartDrawer._convertAndTurnPoint(minX, minY, gapDepth + this.perspectiveDepth);
		var point7 = this.cChartDrawer._convertAndTurnPoint(maxX, minY, gapDepth + this.perspectiveDepth);
		var point8 = this.cChartDrawer._convertAndTurnPoint(maxX, minY, gapDepth);
		
		var darkFaces;
		if(seria === null)
		{
			this.darkFaces = {};
			darkFaces = this.darkFaces;
		}
		else
		{
			if(null === this.darkFaces)
			{
				this.darkFaces = [];
			}
			this.darkFaces[seria] = {};
			darkFaces = this.darkFaces[seria];
		}
		
		
		//front
		darkFaces["front"] = null;
		if(this._isVisibleVerge3D(point5, point1, point4))
		{
			darkFaces["front"] = 1;
		}
		
		//down
		darkFaces["down"] = null;
		if(this._isVisibleVerge3D(point4, point1, point2))
		{
			darkFaces["down"] = 1;
		}
		
		//left
		darkFaces["left"] = null;
		if(this._isVisibleVerge3D(point2, point1, point5))
		{
			darkFaces["left"] = 1;
		}
		
		//right
		darkFaces["right"] = null;
		if(this._isVisibleVerge3D(point8, point4, point3))
		{
			darkFaces["right"] = 1;
		}
		
		//up
		darkFaces["up"] = null;
		if(this._isVisibleVerge3D(point6, point5, point8))
		{
			darkFaces["up"] = 1;
		}
		
		//unfront
		darkFaces["unfront"] = null;
		if(this._isVisibleVerge3D(point3, point2, point6))
		{
			darkFaces["unfront"] = 1;
		}
	},
	
	_calculateRect3D : function(pointsIn3D, seriaNum)
	{
		var path, pathId;
		var pxToMm = this.chartProp.pxToMM;
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		var oThis = this;
		
		var calculateFace = function(number, isReverse, isFirstPoint)
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
		
		var calculateRect = function(p1, p2, p3, p4)
		{
			var pathId  = oThis.cChartSpace.AllocPath()
			var path = oThis.cChartSpace.GetPath(pathId);

			path.moveTo(p1.x / pxToMm * pathW, p1.y / pxToMm * pathH);
			path.lnTo(p2.x / pxToMm * pathW, p2.y / pxToMm * pathH);
			path.lnTo(p3.x / pxToMm * pathW, p3.y / pxToMm * pathH);
			path.lnTo(p4.x / pxToMm * pathW, p4.y / pxToMm * pathH);
			path.lnTo(p1.x / pxToMm * pathW, p1.y / pxToMm * pathH);

			return pathId;
		};
		
		var calculateUpDownFace = function(isDown)
		{
			var arrayPaths = [];
			for(var i = 0; i < pointsIn3D[0].length - 1; i++)
			{
				var point1Up = pointsIn3D[0][i];
				var point2Up = pointsIn3D[0][i + 1];
				
				var point1UpFar = pointsIn3D[2][i];
				var point2UpFar = pointsIn3D[2][i + 1];
				
				var point1Down = pointsIn3D[1][i];
				var point2Down = pointsIn3D[1][i + 1];
				
				var point1DownFar = pointsIn3D[3][i];
				var point2DownFar = pointsIn3D[3][i + 1];
				
				var path = null;
				
				if(!isDown)
				{
					if(point1Up.y > point1Down.y && point2Up.y < point2Down.y)
					{
						path = calculateRect(point1Up, point1UpFar, point2UpFar, point2Up);
						arrayPaths.push(path);
						path = calculateRect(point1Down, point1DownFar, point2DownFar, point2Down);
						arrayPaths.push(path);
					}
					else if(point1Up.y < point1Down.y && point2Up.y > point2Down.y)
					{
						path = calculateRect(point1Down, point1DownFar, point2DownFar, point2Down);
						arrayPaths.push(path);
						path = calculateRect(point1Up, point1UpFar, point2UpFar, point2Up);
						arrayPaths.push(path);
					}
					else
					{
						path = calculateRect(point1Up, point1UpFar, point2UpFar, point2Up);
						arrayPaths.push(path);
					}
				}
				else
				{
					if(point1Up.y > point1Down.y && point2Up.y < point2Down.y)
					{
						path = calculateRect(point1Up, point1UpFar, point2UpFar, point2Up);
						arrayPaths.push(path);
						path = calculateRect(point1Down, point1DownFar, point2DownFar, point2Down);
						arrayPaths.push(path);
					}
					else if(point1Up.y < point1Down.y && point2Up.y > point2Down.y)
					{
						path = calculateRect(point1Up, point1UpFar, point2UpFar, point2Up);
						arrayPaths.push(path);
						path = calculateRect(point1Down, point1DownFar, point2DownFar, point2Down);
						arrayPaths.push(path);
					}
					else
					{
						path = calculateRect(point1Down, point1DownFar, point2DownFar, point2Down);
						arrayPaths.push(path);
					}
				}
			}
			
			return arrayPaths;
		};
		
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
		var	point8 = pointsIn3D[upNear][pointsIn3D[upNear].length - 1];
		
		
		//front
		paths[0] = null;
		if(this.darkFaces[seriaNum]["front"])
		{
			pathId = this.cChartSpace.AllocPath();
			path  = this.cChartSpace.GetPath(pathId);

			
			calculateFace(upNear, false, true);
			calculateFace(downNear, true);
			path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);

			paths[0] = pathId;
		}
		
		//down
		paths[1] = null;
		//if(this.darkFaces[seriaNum]["down"])
		//{
			var arrayPaths = calculateUpDownFace(true);
			paths[1] = arrayPaths;
		//}
		
		//left
		paths[2] = null;
		if(this.darkFaces[seriaNum]["left"])
		{
			var arrayPaths = calculateRect(pointsIn3D[0][0], pointsIn3D[1][0], pointsIn3D[3][0], pointsIn3D[2][0]);
			paths[2] = arrayPaths;
		}
		
		//right
		paths[3] = null;
		if(this.darkFaces[seriaNum]["right"])
		{
			var arrayPaths = calculateRect(pointsIn3D[0][pointsIn3D[0].length - 1], pointsIn3D[1][pointsIn3D[1].length - 1], pointsIn3D[3][pointsIn3D[3].length - 1], pointsIn3D[2][pointsIn3D[2].length - 1]);
			paths[3] = arrayPaths;
		}
		
		//up
		paths[4] = null;
		//if(this.darkFaces[seriaNum]["up"])
		//{
			var arrayPaths = calculateUpDownFace();	
			paths[4] = arrayPaths;
		//}
		
		//unfront
		paths[5] = null;
		if(this.darkFaces[seriaNum]["unfront"])
		{
			pathId = this.cChartSpace.AllocPath();
			path  = this.cChartSpace.GetPath(pathId);
			calculateFace(upFar, false, true);
			calculateFace(downFar, true);
			path.lnTo(pointsIn3D[upFar][0].x / pxToMm * pathW, pointsIn3D[upFar][0].y / pxToMm * pathH);
			paths[5] = pathId;
		}
		
		return paths;
	}, 
	
	_calculateRect3DStacked: function(arrPoints, arrPointsProject, arrNotRotatePoints, point, seria)
	{	
		var pxToMm = this.chartProp.pxToMM, t = this;
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		//for define VisibleVerge, as in bar charts
		var p1 = arrNotRotatePoints[0];
		var p2 = arrNotRotatePoints[1];
		var p3 = arrNotRotatePoints[2];
		var	p4 = arrNotRotatePoints[3];
		var	p5 = arrNotRotatePoints[4];
		var	p6 = arrNotRotatePoints[5];
		var	p7 = arrNotRotatePoints[6];
		var	p8 = arrNotRotatePoints[7];
		
		var point1 = arrPointsProject[0];
		var point2 = arrPointsProject[1];
		var point3 = arrPointsProject[2];
		var	point4 = arrPointsProject[3];
		var	point5 = arrPointsProject[4];
		var	point6 = arrPointsProject[5];
		var	point7 = arrPointsProject[6];
		var	point8 = arrPointsProject[7];
		
		var point11 = arrPoints[0];
		var point22 = arrPoints[1];
		var point33 = arrPoints[2];
		var	point44 = arrPoints[3];
		var	point55 = arrPoints[4];
		var	point66 = arrPoints[5];
		var	point77 = arrPoints[6];
		var	point88 = arrPoints[7];

		var oThis = this;
		var generateFace = function(p11, p22, p33, p44, p111, p222, p333, p444, p1111, p2222, p3333, p4444, faceIndex, ser)
		{
			if(ser === undefined)
			{
				ser = seria;
			}

			var pathId = oThis.cChartSpace.AllocPath();
			var path  = oThis.cChartSpace.GetPath(pathId);

			path.moveTo(p11.x / pxToMm * pathW, p11.y / pxToMm * pathH);
			path.lnTo(p22.x / pxToMm * pathW, p22.y / pxToMm * pathH);
			path.lnTo(p33.x / pxToMm * pathW, p33.y / pxToMm * pathH);
			path.lnTo(p44.x / pxToMm * pathW, p44.y / pxToMm * pathH);
			path.lnTo(p11.x / pxToMm * pathW, p11.y / pxToMm * pathH);

			var arrPoints = [p11, p22, p33, p44];
			var arrPoints2 = [p111, p222, p333, p444];
			var plainEquation = t.cChartDrawer.getPlainEquation(p111, p222, p333);
			var plainArea = t.cChartDrawer.getAreaQuadrilateral(p11, p22, p33, p44);
			
			var arrPointsNotRotate = [p1111, p2222, p3333, p4444];
			var midY = (p1111.y + p2222.y + p3333.y + p4444.y) / 4;
			
			return {seria: ser, point: 0, verge: faceIndex, paths: pathId, points: arrPoints2, points2: arrPoints, plainEquation: plainEquation, plainArea: plainArea, arrPointsNotRotate: arrPointsNotRotate, midY: midY};
		};
		
		//рассчитываем все грани, кроме верхних и нижних
		this._calculateSimpleRect(arrPoints, arrPointsProject, point, seria);
		
		//находим пересечение грани с предыдущими гранями. если есть, то делим грани	
		var breakFaces = this.intersections[point] && this.intersections[point][seria] ? this.intersections[point][seria] : null;
		if(breakFaces && breakFaces.up && breakFaces.up.length)
		{
			//сортируем грани одной точки
			breakFaces.up = breakFaces.up.sort (function sortArr(a, b)
			{
				return  a.x - b.x;
			});
			
			for(var i = 0; i < breakFaces.up.length - 1; i++)
			{
				var prevNear, prevFar, prevNearProject, prevFarProject, prevNotRotateNear, prevNotRotateFar;
				
				var prevPoint = breakFaces.up[i];
				prevNearProject = t.cChartDrawer._convertAndTurnPoint(prevPoint.x, prevPoint.y, this.gapDepth /*+ DiffGapDepth*/);
				prevFarProject = t.cChartDrawer._convertAndTurnPoint(prevPoint.x, prevPoint.y, this.gapDepth + this.perspectiveDepth);
				
				prevNear = t.cChartDrawer._convertAndTurnPoint(prevPoint.x, prevPoint.y, this.gapDepth /*+ DiffGapDepth*/, null, null, true);
				prevFar = t.cChartDrawer._convertAndTurnPoint(prevPoint.x, prevPoint.y, this.gapDepth + this.perspectiveDepth, null, null, true);
				
				prevNotRotateNear = {x: prevPoint.x, y: prevPoint.y, z: this.gapDepth};
				prevNotRotateFar = {x: prevPoint.x, y: prevPoint.y, z: this.gapDepth + this.perspectiveDepth};

				var near, far, nearProject, farProject, notRotateNear, notRotateFar;
			
				var point = breakFaces.up[i + 1];
				nearProject = t.cChartDrawer._convertAndTurnPoint(point.x, point.y, this.gapDepth /*+ DiffGapDepth*/);
				farProject = t.cChartDrawer._convertAndTurnPoint(point.x, point.y, this.gapDepth + this.perspectiveDepth);
				
				near = t.cChartDrawer._convertAndTurnPoint(point.x, point.y, this.gapDepth /*+ DiffGapDepth*/, null, null, true);
				far = t.cChartDrawer._convertAndTurnPoint(point.x, point.y, this.gapDepth + this.perspectiveDepth, null, null, true);
				
				notRotateNear = {x: point.x, y: point.y, z: this.gapDepth};
				notRotateFar = {x: point.x, y: point.y, z: this.gapDepth + this.perspectiveDepth};
				
				
				var face = generateFace(prevNearProject, prevFarProject, farProject, nearProject, prevNear, prevFar, far, near, prevNotRotateNear, prevNotRotateFar, notRotateNear, notRotateFar, 1);
				this.upFaces.push(face);
			}
		}
		
		if(breakFaces && breakFaces.down && breakFaces.down.length)
		{
			//сортируем грани одной точки
			breakFaces.down = breakFaces.down.sort (function sortArr(a, b)
			{
				return  a.x - b.x;
			});
			
			for(var i = 0; i < breakFaces.down.length - 1; i++)
			{
				var prevNear, prevFar, prevNearProject, prevFarProject, prevNotRotateNear, prevNotRotateFar;
				
				var prevPoint = breakFaces.down[i];
				prevNearProject = t.cChartDrawer._convertAndTurnPoint(prevPoint.x, prevPoint.y, this.gapDepth /*+ DiffGapDepth*/);
				prevFarProject = t.cChartDrawer._convertAndTurnPoint(prevPoint.x, prevPoint.y, this.gapDepth + this.perspectiveDepth);
				
				prevNear = t.cChartDrawer._convertAndTurnPoint(prevPoint.x, prevPoint.y, this.gapDepth /*+ DiffGapDepth*/, null, null, true);
				prevFar = t.cChartDrawer._convertAndTurnPoint(prevPoint.x, prevPoint.y, this.gapDepth + this.perspectiveDepth, null, null, true);
				
				prevNotRotateNear = {x: prevPoint.x, y: prevPoint.y, z: this.gapDepth};
				prevNotRotateFar = {x: prevPoint.x, y: prevPoint.y, z: this.gapDepth + this.perspectiveDepth};

				var near, far, nearProject, farProject, notRotateNear, notRotateFar;
			
				var point = breakFaces.down[i + 1];
				nearProject = t.cChartDrawer._convertAndTurnPoint(point.x, point.y, this.gapDepth /*+ DiffGapDepth*/);
				farProject = t.cChartDrawer._convertAndTurnPoint(point.x, point.y, this.gapDepth + this.perspectiveDepth);
				
				near = t.cChartDrawer._convertAndTurnPoint(point.x, point.y, this.gapDepth /*+ DiffGapDepth*/, null, null, true);
				far = t.cChartDrawer._convertAndTurnPoint(point.x, point.y, this.gapDepth + this.perspectiveDepth, null, null, true);
				
				notRotateNear = {x: point.x, y: point.y, z: this.gapDepth};
				notRotateFar = {x: point.x, y: point.y, z: this.gapDepth + this.perspectiveDepth};
				
				
				var face = generateFace(prevNearProject, prevFarProject, farProject, nearProject, prevNear, prevFar, far, near, prevNotRotateNear, prevNotRotateFar, notRotateNear, notRotateFar, 1);
				this.downFaces.push(face);
			}
		}
		else
		{
			//TODO проверить и убрать
			var face = generateFace(point1, point2, point3, point4, point11, point22, point33, point44, p1, p2, p3, p4, 1);
			this.downFaces.push(face);
		}
		
		return [];
	}, 
	
	_calculateAllIntersection: function()
	{
		var allPoints = this.points;
		var prevPoints;
		var nullPositionOX = this.chartProp.nullPositionOX;
		var pxToMm = this.chartProp.pxToMM;
		
		for(var seria = 0; seria < allPoints.length; seria++)
		{
			var points = allPoints[seria];
			for(var i = 0; i < points.length - 1; i++)
			{
				var x = points[i].x * pxToMm;
				var y = points[i].y * pxToMm;
				var x1 = points[i + 1].x * pxToMm;
				var y1 = points[i + 1].y * pxToMm;
				
				prevPoints = this._getPrevSeriesPoints(allPoints, seria);
				
				//рассчитываем 8 точек для каждого ректа
				var prevX = prevPoints ? prevPoints[i].x * pxToMm : x;
				var prevY = prevPoints ? prevPoints[i].y * pxToMm : nullPositionOX;
				var prevX1 = prevPoints ? prevPoints[i + 1].x * pxToMm : x1;
				var prevY1 = prevPoints ? prevPoints[i + 1].y * pxToMm : nullPositionOX;
				
				if(!this.prevPoints)
					this.prevPoints = [];
				
				if(!this.prevPoints[i])
					this.prevPoints[i] = [];
				
				
				var curRect = {point1: {x: x, y: y, z: this.gapDepth} , point2: {x: x1, y: y1, z: this.gapDepth} , prevPoint1: {x: prevX, y: prevY, z: this.gapDepth}, prevPoint2: {x: prevX1, y: prevY1, z: this.gapDepth}};
				
				this._checkIntersection(curRect, i, seria);
				this.prevPoints[i][seria] = curRect;
			}
		}
	},
		
	_checkIntersection: function(curRect, pointIndex, seriaIndex)
	{
		var t = this;
		
		var curPoint1 = curRect.point1;
		var curPoint2 = curRect.point2;
		var curPoint3 = curRect.prevPoint1;
		var curPoint4 = curRect.prevPoint2;
		
		if(curPoint1.y > curPoint3.y)
		{
			curPoint1 = curRect.prevPoint1;
			curPoint2 = curRect.prevPoint2;
			curPoint3 = curRect.point1;
			curPoint4 = curRect.point2;
		}
		
		var addToArr = function(point, seria, isDown, elem)
		{
			if(!t.intersections[point])
			{
				t.intersections[point] = [];
			}
			
			if(!t.intersections[point][seria])
			{
				t.intersections[point][seria] = {};
			}
			
			if(isDown && !t.intersections[point][seria].down)
			{
				t.intersections[point][seria].down = [];
			}
			if(!isDown && !t.intersections[point][seria].up)
			{
				t.intersections[point][seria].up = [];
			}
			
			var arr = isDown ? t.intersections[point][seria].down : t.intersections[point][seria].up;
			arr.push(elem);
		};
		
		//текущая верхняя и нижняя прямая и их пересечение
		var curLine1 = this.cChartDrawer.getLineEquation(curPoint1, curPoint2);
		var curLine2 = this.cChartDrawer.getLineEquation(curPoint3, curPoint4);
		var curTempIntersection = this.cChartDrawer.isIntersectionLineAndLine(curLine1, curLine2);
		
		var curDown = [{start: curPoint3, end: curPoint4, eq: curLine2}];
		//если пересечения текущих прямых вписывается в границы диаграммы
		var curIntersection = null;
		if(curTempIntersection && curTempIntersection.x > curPoint3.x && curTempIntersection.x < curPoint4.x)
		{
			curIntersection = curTempIntersection;
			
			curDown[0] = {start: curPoint3, end: curIntersection, eq: curLine2};
			curDown[1] = {start: curIntersection, end: curPoint4, eq: curLine1};
		}
		
		var curUp = [{start: curPoint1, end: curPoint2, eq: curLine1}];
		//если пересечения текущих прямых вписывается в границы диаграммы
		var curIntersection = null;
		if(curTempIntersection && curTempIntersection.x > curPoint1.x && curTempIntersection.x < curPoint2.x)
		{
			curIntersection = curTempIntersection;
			
			curUp[0] = {start: curPoint1, end: curIntersection, eq: curLine1};
			curUp[1] = {start: curIntersection, end: curPoint2, eq: curLine2};
		}
		
		
		//первая/последняя точка текущей грани, пересечение текущей грани
		if(!this.prevPoints[pointIndex].length || (this.prevPoints[pointIndex].length && !this.prevPoints[pointIndex][seriaIndex]))
		{
			//заносим первую точку грани - ПЕРЕПРОВеРИТЬ
			addToArr(pointIndex, seriaIndex, true, curPoint3);
			addToArr(pointIndex, seriaIndex, null, curPoint1);
			
			//заносим текущее пересечение
			if(curIntersection)
			{
				addToArr(pointIndex, seriaIndex, true, curIntersection);
				addToArr(pointIndex, seriaIndex, null, curIntersection);
				
				//сразу заносим последнюю точку грани
				addToArr(pointIndex, seriaIndex, true, curPoint2);
				addToArr(pointIndex, seriaIndex, null, curPoint4);
			}
			else
			{
				//сразу заносим последнюю точку грани
				addToArr(pointIndex, seriaIndex, true, curPoint4);
				addToArr(pointIndex, seriaIndex, null, curPoint2);
			}
		}
		
		//пересечения с прямыми предыдущих серий
		if(this.prevDown && this.prevDown[pointIndex])
		{
			for(var i = 0; i < this.prevDown[pointIndex].length; i++)
			{
				var prevDown = this.prevDown[pointIndex][i];
				
				for(var j = 0; j < this.prevDown[pointIndex][i].length; j++)
				{
					for(var k = 0; k < curDown.length; k++)
					{
						var line1 = this.prevDown[pointIndex][i][j];
						var line2 = curDown[k];
						var intersection = this.cChartDrawer.isIntersectionLineAndLine(line1.eq, line2.eq);
						
						if(intersection)
						{
							//предыдущая - i
							if(intersection.x > line1.start.x && intersection.x < line1.end.x)
							{
								addToArr(pointIndex, i, true, intersection);
							}
							
							//текущая серия
							if(intersection.x > line2.start.x && intersection.x < line2.end.x)
							{
								addToArr(pointIndex, seriaIndex, true, intersection);
							}
						}
						
					}
				}
			}
		}
		
		//пересечения с прямыми предыдущих серий
		if(this.prevUp && this.prevUp[pointIndex])
		{
			for(var i = 0; i < this.prevUp[pointIndex].length; i++)
			{
				var prevUp = this.prevUp[pointIndex][i];
				
				for(var j = 0; j < this.prevUp[pointIndex][i].length; j++)
				{
					for(var k = 0; k < curUp.length; k++)
					{
						var line1 = this.prevUp[pointIndex][i][j];
						var line2 = curUp[k];
						var intersection = this.cChartDrawer.isIntersectionLineAndLine(line1.eq, line2.eq);
						
						if(intersection)
						{
							//предыдущая - i
							if(intersection.x > line1.start.x && intersection.x < line1.end.x)
							{
								addToArr(pointIndex, i, null, intersection);
							}
							
							//текущая серия
							if(intersection.x > line2.start.x && intersection.x < line2.end.x)
							{
								addToArr(pointIndex, seriaIndex, null, intersection);
							}
						}
						
					}
				}
			}
		}
		
		if(!this.prevDown)
		{
			this.prevDown = [];
		}
		if(!this.prevDown[pointIndex])
		{
			this.prevDown[pointIndex] = [];
		}
		
		this.prevDown[pointIndex][seriaIndex] = curDown;
		
		if(!this.prevUp)
		{
			this.prevUp = [];
		}
		if(!this.prevUp[pointIndex])
		{
			this.prevUp[pointIndex] = [];
		}
		
		this.prevUp[pointIndex][seriaIndex] = curUp;
	},
	
	_calculateSimpleRect: function(arrPoints, arrPointsProject, point, seria)
	{
		var pxToMm = this.chartProp.pxToMM, t = this, paths = [];
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		
		var point1 = arrPointsProject[0];
		var point2 = arrPointsProject[1];
		var point3 = arrPointsProject[2];
		var	point4 = arrPointsProject[3];
		var	point5 = arrPointsProject[4];
		var	point6 = arrPointsProject[5];
		var	point7 = arrPointsProject[6];
		var	point8 = arrPointsProject[7];
		
		var point11 = arrPoints[0];
		var point22 = arrPoints[1];
		var point33 = arrPoints[2];
		var	point44 = arrPoints[3];
		var	point55 = arrPoints[4];
		var	point66 = arrPoints[5];
		var	point77 = arrPoints[6];
		var	point88 = arrPoints[7];
		
		var insidePoint = {};
		insidePoint.x = (point11.x + point22.x + point33.x + point44.x + point55.x + point66.x + point77.x + point88.x) / 8;
		insidePoint.y = (point11.y + point22.y + point33.y + point44.y + point55.y + point66.y + point77.y + point88.y) / 8;
		insidePoint.z = (point11.z + point22.z + point33.z + point44.z + point55.z + point66.z + point77.z + point88.z) / 8;
		
		var oThis = this;
		var calculateSimpleFace = function(p1, p2, p3, p4, p11, p22, p33, p44, faceIndex)
		{
			var pathId = oThis.cChartSpace.AllocPath();
			var path  = oThis.cChartSpace.GetPath(pathId);
			
			path.pathH = pathH;
			path.pathW = pathW;
			
			path.moveTo(p1.x / pxToMm * pathW, p1.y / pxToMm * pathH);
			path.lnTo(p2.x / pxToMm * pathW, p2.y / pxToMm * pathH);
			path.lnTo(p3.x / pxToMm * pathW, p3.y / pxToMm * pathH);
			path.lnTo(p4.x / pxToMm * pathW, p4.y / pxToMm * pathH);
			path.lnTo(p1.x / pxToMm * pathW, p1.y / pxToMm * pathH);
			

			var arrPoints = [p1, p2, p3, p4];
			var arrPoints2 = [p11, p22, p33, p44];
			var plainEquation = t.cChartDrawer.getPlainEquation(p11, p22, p33);
			var plainArea = t.cChartDrawer.getAreaQuadrilateral(p1, p2, p3, p4);
			
			if(faceIndex === 0)
			{
				t.sortZIndexPathsFront.push({seria: seria, point: 0, verge: faceIndex, paths: pathId, points: arrPoints2, points2: arrPoints, plainEquation: plainEquation, plainArea: plainArea, z: insidePoint.z});
			}
			else if(faceIndex === 5)
			{
				t.sortZIndexPathsBack.push({seria: seria, point: 0, verge: faceIndex, paths: pathId, points: arrPoints2, points2: arrPoints, plainEquation: plainEquation, plainArea: plainArea, z: insidePoint.z});
			}
			else if(faceIndex === 2)
			{
				t.sortZIndexPathsLeft.push({seria: seria, point: 0, verge: faceIndex, paths: pathId, points: arrPoints2, points2: arrPoints, plainEquation: plainEquation, plainArea: plainArea, z: insidePoint.z});
			}
			else if(faceIndex === 3)
			{
				t.sortZIndexPathsRight.push({seria: seria, point: 0, verge: faceIndex, paths: pathId, points: arrPoints2, points2: arrPoints, plainEquation: plainEquation, plainArea: plainArea, z: insidePoint.z});
			}
			
			return pathId;
		};
		
		//left
		paths[2] = null;
		if(this.darkFaces["left"] && point === 0)
		{
			paths[2] = calculateSimpleFace(point1, point2, point6, point5, point11, point22, point66, point55, 2);
		}
		
		//right
		paths[3] = null;
		if(this.darkFaces["right"] && point === t.cChartDrawer.calcProp.ptCount - 2)
		{
			paths[3] = calculateSimpleFace(point4, point8, point7, point3, point44, point88, point77, point33, 3);
		}
		
		//front
		if(this.darkFaces["front"])
		{
			paths[0] = calculateSimpleFace(point1, point5, point8, point4, point11, point55, point88, point44, 0);
		}
		
		if(this.darkFaces["unfront"])
		{
			paths[5] = calculateSimpleFace(point2, point6, point7, point3, point22, point66, point77, point33, 5);
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
		var pxToMm = this.chartProp.pxToMM;

		var point = this.cChartDrawer.getIdxPoint(this.chartProp.series[ser], val);
		var path;
		
		path = this.points[ser][val];
		
		if(!path)
			return;
				
		var x = path.x;
		var y = path.y;
		
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			var gapDepth = this.gapDepth;
			if(this.chartProp.subType === "normal")
			{
				gapDepth = this.gapDepth[ser];
			}
			
			var turnPoint = this.cChartDrawer._convertAndTurnPoint(x * pxToMm, y * pxToMm, gapDepth);
			x = turnPoint.x / pxToMm;
			y = turnPoint.y / pxToMm;
		}
		
		
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
		var pen;
		var seria, dataSeries;
		
		this.cChartDrawer.cShapeDrawer.Graphics.SaveGrState();
		this.cChartDrawer.cShapeDrawer.Graphics.AddClipRect(this.chartProp.chartGutter._left / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - 1) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
		
		for (var i = 0; i < this.chartProp.series.length; i++) 
		{	
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
			idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[i], n);
			val = idxPoint ? parseFloat(idxPoint.val) : null;
		}
		return val;
	},
	
	_drawLines3D: function (/*isSkip*/)
    {
		//ширина линии
		var brush;
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
	
	_drawBar3D: function(path, pen, brush, k)
	{
		//затемнение боковых сторон
		//в excel всегда темные боковые стороны, лицевая и задняя стороны светлые
		//pen = this.cChartSpace.chart.plotArea.valAx.compiledMajorGridLines;
		//pen.setFill(brush);
		pen = AscFormat.CreatePenFromParams(brush, undefined, undefined, undefined, undefined, 0.2);
		if(k != 5 && k != 0)
		{
			var  props = this.cChartSpace.getParentObjects();
			
			if(brush.fill.type === Asc.c_oAscFill.FILL_TYPE_NOFILL)
			{
				return;
			}
			
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
	
	_drawBars3D: function()
	{
		var t = this;
		var isStacked = !!(this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked");
		
		if(!isStacked)
		{
			var angle = Math.abs(this.cChartDrawer.processor3D.angleOy);
			if(!this.cChartDrawer.processor3D.view3D.getRAngAx() && angle > Math.PI / 2 && angle < 3 * Math.PI / 2)
			{
				for (var j = 0; j < this.paths.series.length; j++) 
				{
					var seria = this.chartProp.series[j];
					var brush = seria.brush;
					var pen = seria.pen;
					
					if(seria.val.numRef.numCache.pts[0].pen)
						pen = seria.val.numRef.numCache.pts[0].pen;
					if(seria.val.numRef.numCache.pts[0].brush)
						brush = seria.val.numRef.numCache.pts[0].brush;
					
					this._drawBar3D(this.paths.series[j][1], pen, brush, 1);
					this._drawBar3D(this.paths.series[j][4], pen, brush, 4);
					this._drawBar3D(this.paths.series[j][2], pen, brush, 2);
					this._drawBar3D(this.paths.series[j][3], pen, brush, 3);
					this._drawBar3D(this.paths.series[j][5], pen, brush, 5);
					this._drawBar3D(this.paths.series[j][0], pen, brush, 0);	
				}
			}
			else
			{
				for (var j = this.paths.series.length - 1; j >= 0; j--) 
				{
					var seria = this.chartProp.series[j];
					var brush = seria.brush;
					var pen = seria.pen;
					
					if(seria.val.numRef.numCache.pts[0].pen)
						pen = seria.val.numRef.numCache.pts[0].pen;
					if(seria.val.numRef.numCache.pts[0].brush)
						brush = seria.val.numRef.numCache.pts[0].brush;
					
					this._drawBar3D(this.paths.series[j][1], pen, brush, 1);
					this._drawBar3D(this.paths.series[j][4], pen, brush, 4);
					this._drawBar3D(this.paths.series[j][2], pen, brush, 2);
					this._drawBar3D(this.paths.series[j][3], pen, brush, 3);
					this._drawBar3D(this.paths.series[j][5], pen, brush, 5);
					this._drawBar3D(this.paths.series[j][0], pen, brush, 0);	
				}
			}
			
			
		}
		else
		{
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
			
			//if(this.cChartDrawer.processor3D.view3D.rAngAx)
			//{
				for(var i = 0; i < this.sortZIndexPaths.length; i++)
				{
					drawVerges(this.sortZIndexPaths[i].seria, this.sortZIndexPaths[i].point, this.sortZIndexPaths[i].paths, null, this.sortZIndexPaths[i].verge);
				}
			//}
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
	
	_isVisibleVerge3D: function(k, n, m)
	{
		//roberts method - calculate normal
		var aX = n.x * m.y - m.x * n.y;
		var bY = - (k.x * m.y - m.x * k.y);
		var cZ = k.x * n.y - n.x * k.y;
		var visible = aX + bY + cZ;
		
		return visible < 0;
	},
	
	_getIntersectionLines: function(line1Point1, line1Point2, line2Point1, line2Point2)
	{
		var chartHeight = this.chartProp.trueHeight;
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
			res = {x: x, y: y};
		
		return res;
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
	
	recalculate : function(chartsDrawer)
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
		var yPoints = this.cChartSpace.chart.plotArea.catAx.yPoints;

		var heightGraph    = this.chartProp.heightCanvas - this.chartProp.chartGutter._top - this.chartProp.chartGutter._bottom;
		
		var defaultOverlap = (this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer") ? 100 : 0;
		var overlap        = this.cChartSpace.chart.plotArea.chart.overlap ? this.cChartSpace.chart.plotArea.chart.overlap : defaultOverlap;
		var ptCount        = this.cChartDrawer.getPtCount(this.chartProp.series);
        var height         = heightGraph / ptCount;
		var crossBetween   = this.cChartSpace.getValAxisCrossType();
		if(crossBetween)
		{
			height = heightGraph / (ptCount - 1);
		}
		
		var gapWidth = this.cChartSpace.chart.plotArea.chart.gapWidth ? this.cChartSpace.chart.plotArea.chart.gapWidth : 150;
		
		var individualBarHeight = height / (this.chartProp.seriesCount - (this.chartProp.seriesCount - 1) * (overlap / 100) + gapWidth / 100);
		var widthOverLap = individualBarHeight * (overlap / 100);
		var hmargin = (gapWidth / 100 * individualBarHeight) / 2;
		
		var width, startX, startY, val, paths, seriesHeight = [], seria, startXColumnPosition, startYPosition, newStartX, newStartY, idx, seriesCounter = 0, numCache;
		
		//for 3d
		var perspectiveDepth, gapDepth, DiffGapDepth;
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
			//сдвиг по OZ в глубину
			gapDepth = this.cChartSpace.chart.plotArea.chart.gapDepth != null ? this.cChartSpace.chart.plotArea.chart.gapDepth : globalGapDepth;
			perspectiveDepth = perspectiveDepth / (gapDepth / 100 + 1);
			DiffGapDepth = perspectiveDepth * (gapDepth / 2) / 100;
		}		
		
		var cubeCount = 0;
		for (var i = 0; i < this.chartProp.series.length; i++) 
		{
			numCache = this.chartProp.series[i].val.numRef ? this.chartProp.series[i].val.numRef.numCache : this.chartProp.series[i].val.numLit;
			
			if(!numCache || this.chartProp.series[i].isHidden)
			{
				continue;
			}
			
			seria = numCache.pts;
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
					paths = this.calculateParallalepiped(newStartX, newStartY, val, width, DiffGapDepth, perspectiveDepth, individualBarHeight, seriesHeight, i, idx, cubeCount);
					cubeCount++;
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
			if(this.cChartDrawer.processor3D.view3D.getRAngAx())
			{
				var angle = Math.abs(this.cChartDrawer.processor3D.angleOy);
				this.sortZIndexPaths.sort (function sortArr(a, b)
				{
					if(b.zIndex == a.zIndex)
					{
						if(angle < Math.PI)
						{
							return  a.x - b.x;
						}
						else
						{
							return  b.x - a.x;
						}
					}
					else
						return  b.zIndex - a.zIndex;
				});
			}
			else
			{
				var cSortFaces = new CSortFaces(this.cChartDrawer);
				//this.sortZIndexPaths = cSortFaces.sortFaces(this.sortZIndexPaths);
				this.sortParallelepipeds = cSortFaces.sortParallelepipeds(this.temp, this.sortZIndexPaths);
			}
		}
    },
	
	_calculateLine : function(x, y, x1, y1)
	{
		var pxToMm = this.chartProp.pxToMM;

		var pathId = this.cChartSpace.AllocPath();
		var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x1 / pxToMm * pathW, y1 / pxToMm * pathH);

		return pathId;
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
	
	_getStartYColumnPosition: function (seriesHeight, j, i, val, xPoints)
	{
		var startY, width, curVal, prevVal, endBlockPosition, startBlockPosition;
		var catAx = this.cChartSpace.chart.plotArea.catAx;
		var nullPositionOX = this.chartProp.nullPositionOX/*catAx.posX !== null ? catAx.posX * this.chartProp.pxToMM : 0*/;
		
		if(this.chartProp.subType == "stacked" || this.chartProp.subType == "stackedPer")
		{
			curVal = this._getStackedValue(this.chartProp.series, i, j, val);
			prevVal = this._getStackedValue(this.chartProp.series, i - 1, j, val);
			
			if(this.chartProp.subType == "stacked")
			{
				//если максимальное значение задано вручную, и присутвуют точки, которые больше этого значения
				if(curVal > this.cChartDrawer.calcProp.axisMax)
				{
					curVal = this.cChartDrawer.calcProp.axisMax;
				}
				if(curVal < this.cChartDrawer.calcProp.axisMin)
				{
					curVal = this.cChartDrawer.calcProp.axisMin;
				}
				
				endBlockPosition = this.cChartDrawer.getYPosition((curVal), xPoints, true) * this.chartProp.pxToMM;
				startBlockPosition = prevVal ? this.cChartDrawer.getYPosition((prevVal), xPoints, true) * this.chartProp.pxToMM : nullPositionOX;
			}
			else
			{	
				this._calculateSummStacked(j);
				
				var test = this.summBarVal[j];
				
				//если максимальное значение задано вручную, и присутвуют точки, которые больше этого значения
				if(curVal / test > this.cChartDrawer.calcProp.axisMax)
				{
					curVal = this.cChartDrawer.calcProp.axisMax * test;
				}
				if(curVal / test < this.cChartDrawer.calcProp.axisMin)
				{
					curVal = this.cChartDrawer.calcProp.axisMin * test;
				}
				
				if(prevVal / test > this.cChartDrawer.calcProp.axisMax)
				{
					prevVal = this.cChartDrawer.calcProp.axisMax * test;
				}
				if(prevVal / test < this.cChartDrawer.calcProp.axisMin)
				{
					prevVal = this.cChartDrawer.calcProp.axisMin * test;
				}
				
				endBlockPosition = this.cChartDrawer.getYPosition((curVal / test), xPoints, true) * this.chartProp.pxToMM;
				startBlockPosition = test ? this.cChartDrawer.getYPosition((prevVal / test), xPoints, true) * this.chartProp.pxToMM : nullPositionOX;
			}
			
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
		this.cChartDrawer.cShapeDrawer.Graphics.AddClipRect((this.chartProp.chartGutter._left - 1) / this.chartProp.pxToMM, (this.chartProp.chartGutter._top - 1) / this.chartProp.pxToMM, this.chartProp.trueWidth / this.chartProp.pxToMM, this.chartProp.trueHeight / this.chartProp.pxToMM);
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
		var path = this.paths.series[ser][val];
		
		if(this.cChartDrawer.nDimensionCount === 3 && this.paths.series[ser][val].frontPaths)
		{
			var frontPaths = this.paths.series[ser][val].frontPaths;
			if(this.cChartDrawer.nDimensionCount === 3)
			{
				if(AscFormat.isRealNumber(frontPaths[0]))
				{
					path = frontPaths[0];
				}
				else if(AscFormat.isRealNumber(frontPaths[5]))
				{
					path = frontPaths[5];
				}
				else if(AscFormat.isRealNumber(frontPaths[2]))
				{
					path = frontPaths[2];
				}
				else if(AscFormat.isRealNumber(frontPaths[3]))
				{
					path = frontPaths[3];
				}
			}
		}
		
		if(!AscFormat.isRealNumber(path))
			return;
		var oPath = this.cChartSpace.GetPath(path);
		var oCommand0 = oPath.getCommandByIndex(0);
		var oCommand1 = oPath.getCommandByIndex(1);
		var oCommand2 = oPath.getCommandByIndex(2);


		var x = oCommand0.X;
		var y = oCommand0.Y;
		
		var h = oCommand0.Y - oCommand1.Y;
		var w = oCommand2.X - oCommand1.X;
		
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
		var pathId = this.cChartSpace.AllocPath();
		var path = this.cChartSpace.GetPath(pathId);

		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x * pathW, (y - h) * pathH);
		path.lnTo((x + w) * pathW, (y - h) * pathH);
		path.lnTo((x + w) * pathW, y * pathH);
		path.lnTo(x * pathW, y * pathH);
		return pathId;
	},
	
	calculateParallalepiped: function(newStartX, newStartY, val, width, DiffGapDepth, perspectiveDepth, individualBarHeight, seriesHeight, i, idx, cubeCount)
	{
		var paths;
		var point1, point2, point3, point4, point5, point6, point7, point8;
		var x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, x5, y5, z5, x6, y6, z6, x7, y7, z7, x8, y8, z8;
		var xPoints = this.cChartSpace.chart.plotArea.valAx.xPoints;
		
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
		
		paths = this.cChartDrawer.calculateRect3D(point1, point2, point3, point4, point5, point6, point7, point8, val, null, true);
		
		if(this.cChartDrawer.processor3D.view3D.getRAngAx())
		{
			var controlPoint1 = this.cChartDrawer._convertAndTurnPoint(x5 + width / 2, y5 - individualBarHeight / 2, z5);
			var controlPoint2 = this.cChartDrawer._convertAndTurnPoint(x5 + width / 2, y5, z5 + perspectiveDepth / 2);
			var controlPoint3 = this.cChartDrawer._convertAndTurnPoint(x5, y5 - individualBarHeight / 2, z5 + perspectiveDepth / 2);
			var controlPoint4 = this.cChartDrawer._convertAndTurnPoint(x8, y8 - individualBarHeight / 2, z8 + perspectiveDepth / 2);
			var controlPoint5 = this.cChartDrawer._convertAndTurnPoint(x1 + width / 2 , y1, z1 + perspectiveDepth / 2);
			var controlPoint6 = this.cChartDrawer._convertAndTurnPoint(x6 + width / 2 , y6 - individualBarHeight / 2, z6);
			
			var sortPaths = [controlPoint1, controlPoint2, controlPoint3, controlPoint4, controlPoint5, controlPoint6];
			
			for(var k = 0; k < paths.frontPaths.length; k++)
			{
				this.sortZIndexPaths.push({seria: i, point: idx, verge: k, frontPaths: paths.frontPaths[k], darkPaths: paths.darkPaths[k], x: sortPaths[k].x, y: sortPaths[k].y, zIndex: sortPaths[k].z});
			}
		}
		else
		{
			//рассчитываем 8 точек для каждого столбца одинакового размера для рассчета положения столбцов
			if(this.chartProp.subType === "normal")
			{
				var startXColumnPosition = this._getStartYColumnPosition(seriesHeight, idx, i, this.cChartDrawer.calcProp.max, xPoints);
				width = startXColumnPosition.width / this.chartProp.pxToMM;
				
				x3 = newStartX + width, y3 = newStartY, z3 = perspectiveDepth + DiffGapDepth;
				x4 = newStartX + width, y4 = newStartY, z4 = DiffGapDepth;
				x7 = newStartX + width, y7 = newStartY + individualBarHeight, z7 = perspectiveDepth + DiffGapDepth;
				x8 = newStartX + width, y8 = newStartY + individualBarHeight, z8 = DiffGapDepth;
				
				point3 = this.cChartDrawer._convertAndTurnPoint(x3, y3, z3);
				point4 = this.cChartDrawer._convertAndTurnPoint(x4, y4, z4);
				point7 = this.cChartDrawer._convertAndTurnPoint(x7, y7, z7);
				point8 = this.cChartDrawer._convertAndTurnPoint(x8, y8, z8);
			}
			
			//не проецируем на плоскость
			var point11 = this.cChartDrawer._convertAndTurnPoint(x1, y1, z1, null, null, true);
			var point22 = this.cChartDrawer._convertAndTurnPoint(x2, y2, z2, null, null, true);
			var point33 = this.cChartDrawer._convertAndTurnPoint(x3, y3, z3, null, null, true);
			var point44 = this.cChartDrawer._convertAndTurnPoint(x4, y4, z4, null, null, true);
			var point55 = this.cChartDrawer._convertAndTurnPoint(x5, y5, z5, null, null, true);
			var point66 = this.cChartDrawer._convertAndTurnPoint(x6, y6, z6, null, null, true);
			var point77 = this.cChartDrawer._convertAndTurnPoint(x7, y7, z7, null, null, true);
			var point88 = this.cChartDrawer._convertAndTurnPoint(x8, y8, z8, null, null, true);
			
			
			var arrPoints = [[point1, point4, point8, point5], [point1, point2, point3, point4], [point1, point2, point6, point5], [point4, point8, point7, point3], [point5, point6, point7, point8], [point6, point2, point3, point7]];
			
			var arrPoints2 = [[point11, point44, point88, point55], [point11, point22, point33, point44], [point11, point22, point66, point55], [point44, point88, point77, point33], [point55, point66, point77, point88], [point66, point22, point33, point77]];
			
		
			if(!this.temp)
			{
				this.temp = [];
			}
			if(!this.temp[cubeCount])
			{
				this.temp[cubeCount] = {};
			}
			if(!this.temp[cubeCount].faces)
			{
				this.temp[cubeCount].faces = [];
				this.temp[cubeCount].arrPoints = [point11, point22, point33, point44, point55, point66, point77, point88];
				this.temp[cubeCount].z = point11.z;
			}
			
			for(var k = 0; k < paths.frontPaths.length; k++)
			{
				if(null === paths.frontPaths[k] && null === paths.darkPaths[k])
					continue;
				
				//this.sortZIndexPaths.push({seria: i, point: idx, verge: k, paths: paths[k], points: arrPoints2[k], points2: arrPoints[k], plainEquation: plainEquation});
				
				var plainEquation = this.cChartDrawer.getPlainEquation(arrPoints2[k][0], arrPoints2[k][1], arrPoints2[k][2], arrPoints2[k][3]);
				var plainArea = this.cChartDrawer.getAreaQuadrilateral(arrPoints[k][0], arrPoints[k][1], arrPoints[k][2], arrPoints[k][3]);
				this.temp[cubeCount].faces.push({seria: i, point: idx, verge: k, frontPaths: paths.frontPaths[k], darkPaths: paths.darkPaths[k], points: arrPoints2[k], points2: arrPoints[k], plainEquation: plainEquation, plainArea: plainArea});
			}
		}
		
		return paths;
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
	
	_DrawBars3D1: function()
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
			if(this.sortZIndexPaths[i].seria !== undefined)
			{
				drawVerges(this.sortZIndexPaths[i].seria, this.sortZIndexPaths[i].point, this.sortZIndexPaths[i].paths, null, this.sortZIndexPaths[i].verge);
			}
			else
			{		
				//if(options !== null)
				//{
					var pen = t.cChartSpace.chart.plotArea.valAx.compiledMajorGridLines;
					var brush = null;
					
					this.cChartDrawer.drawPath(this.sortZIndexPaths[i].paths, pen, brush);
				//}
			}
			
		}
	},
	
	_DrawBars3D: function()
	{
		var t = this;
		
		var drawVerges = function(i, j, paths, onlyLessNull, k, isNotPen, isNotBrush)
		{
			var brush, pen, options;
			options = t._getOptionsForDrawing(i, j, onlyLessNull);
			if(paths !== null && options !== null)
			{
				if(!isNotPen)
				{
					pen = options.pen;
				}
				if(!isNotBrush)
				{
					brush = options.brush;
				}
				
				t._drawBar3D(paths, pen, brush, k);
			}
		};
		
		if(this.cChartDrawer.processor3D.view3D.getRAngAx())
		{
			for(var i = 0; i < this.sortZIndexPaths.length; i++)
			{
				drawVerges(this.sortZIndexPaths[i].seria, this.sortZIndexPaths[i].point, this.sortZIndexPaths[i].darkPaths, null, this.sortZIndexPaths[i].verge, null, true);
			}
			
			for(var i = 0; i < this.sortZIndexPaths.length; i++)
			{
				drawVerges(this.sortZIndexPaths[i].seria, this.sortZIndexPaths[i].point, this.sortZIndexPaths[i].frontPaths, null, this.sortZIndexPaths[i].verge);
			}
		}
		else
		{
			for(var i = 0; i < this.sortParallelepipeds.length; i++)
			{
				var index = this.sortParallelepipeds[i].nextIndex;
				var faces = this.temp[index].faces;
				for(var j = 0; j < faces.length; j++)
				{
					var face = faces[j];
					drawVerges(face.seria, face.point, face.darkPaths, null, face.verge, null, true);
				}	
			}
			
			for(var i = 0; i < this.sortParallelepipeds.length; i++)
			{
				var index = this.sortParallelepipeds[i].nextIndex;
				var faces = this.temp[index].faces;
				for(var j = 0; j < faces.length; j++)
				{
					var face = faces[j];
					drawVerges(face.seria, face.point, face.frontPaths, null, face.verge);
				}	
			}
		}
	},
	
	_drawBar3D: function(path, pen, brush, k)
	{
		//затемнение боковых сторон
		var fill = this._getFill(pen, brush, k);
		var newBrush = fill.brush;
		var newPen = fill.pen;
		this.cChartDrawer.drawPath(path, newPen, newBrush);
	},
	
	_getFill: function(pen, brush, face)
	{
		//k: 0 - передняя, 1 - верхняя, 2 - левая, 3 - правая, 4 - нижняя, 5 - задняя
		var shade = "shade";
		var shadeValue1 = 35000;
		var shadeValue2 = 45000;
		
		var newBrush = brush;
		var newPen = pen;
		var t = this;
		
		/*if(null === pen || (null !== pen && null === pen.Fill) || (null !== pen && null !== pen.Fill && null === pen.Fill.fill))
		{
			pen = AscFormat.CreatePenFromParams(brush, undefined, undefined, undefined, undefined, 0.1);
		}*/
		
		//TODO будет время - сделать градиентную заливку в зависимости от угла!!!!
		if(brush && brush.fill && AscDFH.historyitem_type_GradFill === brush.fill.getObjectType())
		{
			switch ( face )
			{
				case c_oChartBar3dFaces.front:
				case c_oChartBar3dFaces.back:
				{
					break;
				}
				case c_oChartBar3dFaces.up:
				{
					var color = this._getGradFill(brush, pen, c_oChartBar3dFaces.up);
					newBrush = color.brush;
					newPen = color.pen;
					
					break;
				}
				case c_oChartBar3dFaces.left:
				{
					var color = this._getGradFill(brush, pen, c_oChartBar3dFaces.left);
					newBrush = color.brush;
					newPen = color.pen;
					
					break;
				}
				case c_oChartBar3dFaces.right:
				{
					var color = this._getGradFill(brush, pen, c_oChartBar3dFaces.right);
					newBrush = color.brush;
					newPen = color.pen;
					
					break;
				}
				case c_oChartBar3dFaces.down:
				{
					var color = this._getGradFill(brush, pen, c_oChartBar3dFaces.down);
					newBrush = color.brush;
					newPen = color.pen;
					
					break;
				}
			}
		}
		else if(brush && brush.fill)
		{
			switch ( face )
			{
				case c_oChartBar3dFaces.front:
				case c_oChartBar3dFaces.back:
				{
					break;
				}
				case c_oChartBar3dFaces.up:
				case c_oChartBar3dFaces.down:
				{	
					newBrush = this._applyColorModeByBrush(brush, shadeValue1);
					if(null === pen)
					{
						newPen = pen.setFill(newBrush);
					}
					break;
				}
				case c_oChartBar3dFaces.left:
				case c_oChartBar3dFaces.right:
				{
					newBrush = this._applyColorModeByBrush(brush, shadeValue2);
					if(null === pen)
					{
						newPen = pen.setFill(newBrush);
					}
					break;
				}
			}
		}
		
		return {brush: newBrush, pen: newPen};
	},
	
	_getGradFill: function(brushFill, penFill, faceIndex)
	{
		var gradientPen = penFill;
		var gradientBrush = brushFill;
		
		var angleKf = 60000;
		var shade = "shade";
		var shadeValue1 = 35000;
		var shadeValue2 = 45000;
		var t = this;
		
		if(brushFill.fill.lin && null !== brushFill.fill.lin.angle)
		{
			var getCSolidColor = function(color, colorMod)
			{
				var duplicateBrush = brushFill.createDuplicate();
				var tempColor = new AscFormat.CUniFill();
				tempColor.setFill(new AscFormat.CSolidFill());
				tempColor.fill.setColor(color);
				if(colorMod)
				{
					tempColor = t._applyColorModeByBrush(tempColor, colorMod);
				}
				
				return tempColor;
			};
			
			var angle = brushFill.fill.lin.angle / angleKf;
			var colors = brushFill.fill.colors;
			
			if(angle >= 0 && angle < 45)
			{
				if(faceIndex === c_oChartBar3dFaces.up || faceIndex === c_oChartBar3dFaces.down)
				{
					gradientBrush = this._applyColorModeByBrush(brushFill, shadeValue1);
					if(null === gradientPen)
					{
						gradientPen = gradientPen.setFill(newBrush);
					}
				}
				else if(faceIndex === c_oChartBar3dFaces.left)
				{
					gradientBrush = getCSolidColor(colors[0].color);
				}
				else if(faceIndex === c_oChartBar3dFaces.right)
				{
					gradientBrush = getCSolidColor(colors[colors.length - 1].color);
				}
			}
			else if(angle >= 45 && angle < 90)
			{
				if(faceIndex === c_oChartBar3dFaces.up || faceIndex === c_oChartBar3dFaces.left)
				{
					gradientBrush = getCSolidColor(colors[0].color, shadeValue1);
				}
				else if(faceIndex === c_oChartBar3dFaces.right)
				{
					gradientBrush = this._applyColorModeByBrush(brushFill, shadeValue1);
					if(null === gradientPen)
					{
						gradientPen = gradientPen.setFill(newBrush);
					}
				}
				else if(faceIndex === c_oChartBar3dFaces.down)
				{
					gradientBrush = getCSolidColor(colors[colors.length - 1].color);
				}
			}
			else if(angle >= 90 && angle < 135)
			{
				if(faceIndex === c_oChartBar3dFaces.up || faceIndex === c_oChartBar3dFaces.left)
				{
					gradientBrush = getCSolidColor(colors[0].color, shadeValue1);
				}
				else if(faceIndex === c_oChartBar3dFaces.right)
				{
					gradientBrush = this._applyColorModeByBrush(brushFill, shadeValue1);
					if(null === gradientPen)
					{
						gradientPen = gradientPen.setFill(newBrush);
					}
				}
				else if(faceIndex === c_oChartBar3dFaces.down)
				{
					gradientBrush = getCSolidColor(colors[colors.length - 1].color);
				}
			}
			else if(angle >= 135 && angle < 180)
			{
				if(faceIndex === c_oChartBar3dFaces.up || faceIndex === c_oChartBar3dFaces.left || faceIndex === c_oChartBar3dFaces.right)
				{
					gradientBrush = getCSolidColor(colors[0].color, shadeValue1);
				}
				else if(faceIndex === c_oChartBar3dFaces.down)
				{
					gradientBrush = this._applyColorModeByBrush(brushFill, shadeValue1);
					if(null === gradientPen)
					{
						gradientPen = gradientPen.setFill(newBrush);
					}
				}
			}
			else if(angle >= 180 && angle < 225)
			{
				if(faceIndex === c_oChartBar3dFaces.up || faceIndex === c_oChartBar3dFaces.down)
				{
					gradientBrush = this._applyColorModeByBrush(brushFill, shadeValue1);
					if(null === gradientPen)
					{
						gradientPen = gradientPen.setFill(newBrush);
					}
				}
				else if(faceIndex === c_oChartBar3dFaces.right)
				{
					gradientBrush = getCSolidColor(colors[0].color, shadeValue1);
				}
				else if(faceIndex === c_oChartBar3dFaces.left)
				{
					gradientBrush = getCSolidColor(colors[colors.length - 1].color, shadeValue1);
				}
			}
			else if(angle >= 225 && angle < 270)
			{
				if(faceIndex === c_oChartBar3dFaces.up)
				{
					gradientBrush = this._applyColorModeByBrush(brushFill, shadeValue1);
					if(null === gradientPen)
					{
						gradientPen = gradientPen.setFill(newBrush);
					}
				}
				else if(faceIndex === c_oChartBar3dFaces.left || faceIndex === c_oChartBar3dFaces.down || faceIndex === c_oChartBar3dFaces.right)
				{
					gradientBrush = getCSolidColor(colors[0].color, shadeValue1);
				}
			}
			else if(angle >= 270 && angle < 315)
			{
				if(faceIndex === c_oChartBar3dFaces.up)
				{
					gradientBrush = getCSolidColor(colors[colors.length - 1].color);
				}
				else if(faceIndex === c_oChartBar3dFaces.left || faceIndex === c_oChartBar3dFaces.down)
				{
					gradientBrush = getCSolidColor(colors[0].color, shadeValue1);
				}
				else if(faceIndex === c_oChartBar3dFaces.right)
				{
					gradientBrush = this._applyColorModeByBrush(brushFill, shadeValue1);
					if(null === gradientPen)
					{
						gradientPen = gradientPen.setFill(newBrush);
					}
				}
			}
			else if(angle >= 315 && angle <= 360)
			{
				if(faceIndex === c_oChartBar3dFaces.up || faceIndex === c_oChartBar3dFaces.right)
				{
					gradientBrush = this._applyColorModeByBrush(brushFill, shadeValue1);
					if(null === gradientPen)
					{
						gradientPen = gradientPen.setFill(newBrush);
					}
				}
				else if(faceIndex === c_oChartBar3dFaces.left || faceIndex === c_oChartBar3dFaces.down)
				{
					gradientBrush = getCSolidColor(colors[0].color, shadeValue1);
				}
			}
		}
		
		return {pen: gradientPen, brush: gradientBrush};
	},
	
	_applyColorModeByBrush: function(brushFill, val)
	{
		var props = this.cChartSpace.getParentObjects();
		var duplicateBrush = brushFill.createDuplicate();
		var cColorMod = new AscFormat.CColorMod;
		cColorMod.val = val;
		
		cColorMod.name = "shade";
		duplicateBrush.addColorMod(cColorMod);
		duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new AscFormat.CUniColor().RGBA);
		
		return duplicateBrush;
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
	
	this.tempDrawOrder = null;
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
		{
			this._drawPie3D();
		}
		else
		{
			this._drawPie();
		}
	},
	
	recalculate : function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this.tempAngle = null;
		this.paths = {};
		
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			if(this.cChartDrawer.processor3D.view3D.getRAngAx())
			{
				this.properties3d = this.cChartDrawer.processor3D.calculatePropertiesForPieCharts();
				this._recalculatePie3D();
			}
			else
			{
				this._recalculatePie3DPerspective();
			}
		}
		else
		{
			this._recalculatePie();
		}
	},	
	
	_drawPie: function ()
    {
		var numCache = this._getFirstRealNumCache();
		var brush, pen, val;
		var path;
        for (var i = 0,len = numCache.length; i < len; i++) 
		{
			val = numCache[i];
			brush = val.brush;
			pen = val.pen;
			path = this.paths.series[i];
			
            this.cChartDrawer.drawPath(path, pen, brush);
        }
    },
	
	_recalculatePie: function ()
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
        }
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
	
	_calculateEmptySegment: function(radius, xCenter, yCenter)
	{

        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		var pxToMm = this.chartProp.pxToMM;
		
		var x0 = xCenter + radius*Math.cos(this.tempAngle);
		var y0 = yCenter - radius*Math.sin(this.tempAngle);
		
		path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		path.lnTo(x0 / pxToMm * pathW, y0 / pxToMm * pathH);
		path.arcTo(radius / pxToMm * pathW, radius / pxToMm * pathH, this.tempAngle, this.tempAngle);
		path.lnTo(xCenter / pxToMm * pathW, yCenter / pxToMm * pathH);

		return pathId;
	},
	
	_calculateArc : function(radius, stAng, swAng, xCenter, yCenter)
	{

        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		
		var pxToMm = this.chartProp.pxToMM;
		
		var x0 = xCenter + radius*Math.cos(stAng);
		var y0 = yCenter - radius*Math.sin(stAng);
		
		path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		path.lnTo(x0 / pxToMm * pathW, y0 / pxToMm * pathH);
		path.arcTo(radius / pxToMm * pathW, radius / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swAng*cToDeg);
		path.lnTo(xCenter / pxToMm * pathW, yCenter / pxToMm * pathH);

		return pathId;
	},
	
	_changeAngle: function(radius, stAng, swAng, xCenter, yCenter, depth, radius1, radius2)
	{
		//корректируем центр
		yCenter = yCenter - depth / 2;
		
		var x0 = xCenter + radius*Math.cos(stAng);
		var y0 = yCenter - radius*Math.sin(stAng);
		var kFX = radius / radius1;
		var kFY = radius / radius2;
		
		var cX;
		//if(this.cX !== null)
			//cX = this.cX; 
		if(x0 < xCenter)
			cX = xCenter - (xCenter - x0) / kFX;
		else if(x0 > xCenter)
			cX = xCenter + (x0 - xCenter) / kFX;
		else
			cX = xCenter;
		
		var cY;
		//if(this.cY !== null)
			//cY = this.cY; 
		if(y0 < yCenter)
			cY = yCenter - (yCenter - y0) / kFY;
		else if(y0 > yCenter)
			cY = yCenter + (y0 - yCenter) / kFY;
		else
			cY = yCenter;
		
		
		var x01 = xCenter + radius*Math.cos(stAng + swAng);
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
		if(Math.abs(swAng) > Math.PI)
			res = 2*Math.PI - Math.acos(cosNewAngle);
		else
			res = Math.acos(cosNewAngle);
			
		return res;
	},

	_calculateDLbl: function(chartSpace, ser, val, bLayout)
	{
		var pxToMm = this.chartProp.pxToMM;
		
		//TODO сделать через idx как у drawDoughnutChart!!!
		if(!this.paths.series[val])
			return;
		
		var path;
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			if(this.paths.series[val][ser] && this.paths.series[val][ser].upPath)
			{
				path = this.paths.series[val][ser].upPath;
			}
		}	
		else
		{
			path = this.paths.series[val];
		}
		
		if(!AscFormat.isRealNumber(path))
		{
			return;
		}
		
		var getEllipseRadius = function(radius1, radius2, alpha)
		{
			var a = radius1 * radius2;
			var b = Math.sqrt(Math.pow(radius2, 2) * Math.pow(Math.cos(alpha), 2) + Math.pow(radius1, 2) * Math.pow(Math.sin(alpha), 2));
			var res = a / b;
			
			return res;
		};

		var oPath = this.cChartSpace.GetPath(path);
		var oCommand0 = oPath.getCommandByIndex(0);
		var oCommand1 = oPath.getCommandByIndex(1);
		var oCommand2 = oPath.getCommandByIndex(2);

		var centerX = oCommand0.X;
		var centerY = oCommand0.Y;
		
		var radius = oCommand2.hR;
		var stAng =  oCommand2.stAng;
		var swAng =  oCommand2.swAng;
		
		if(this.cChartDrawer.nDimensionCount === 3 && oCommand2.wR)
		{
			radius = getEllipseRadius(oCommand2.hR, oCommand2.wR, -1 * stAng - swAng / 2 - Math.PI / 2);
		}
		
		var point = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache.pts[val] : this.chartProp.series[0].val.numLit.pts[val];
		
		if(!point)
			return;
		
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
	
	//****fast calulate and drawing(for switch on slow drawing: change name function _Slow)
	_recalculatePie3D: function ()
    {
		var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;

		var numCache = this._getFirstRealNumCache();
		var sumData = this.cChartDrawer._getSumArray(numCache, true);
		
        var radius = Math.min(trueHeight, trueWidth) / 2;
		if(radius < 0)
		{
			radius = 0;
		}
		
		var xCenter = this.chartProp.chartGutter._left + trueWidth/2;
		var yCenter = this.chartProp.chartGutter._top + trueHeight/2;
		
		var startAngle = this.cChartDrawer.processor3D.angleOy ? this.cChartDrawer.processor3D.angleOy : 0;
		var startAngle3D = startAngle !== 0 && startAngle !== undefined ? this._changeAngle(radius, Math.PI/2, startAngle, xCenter, yCenter, this.properties3d.depth, this.properties3d.radius1, this.properties3d.radius2) : 0;
		
		this.angleFor3D = Math.PI/2 - startAngle3D;
		startAngle = startAngle + Math.PI / 2;
		
		for (var i = numCache.length - 1; i >= 0; i--) 
		{
			var partOfSum = numCache[i].val / sumData;
			var swapAngle = Math.abs((parseFloat(partOfSum)) * (Math.PI * 2));
			
			if(!this.paths.series)
			{
				this.paths.series = [];
			}
		
			this.paths.series[i] = this._calculateSegment3D(startAngle, swapAngle, radius, xCenter, yCenter);
			
			startAngle += swapAngle;
        }
    },
	
	_recalculatePie3DPerspective: function ()
    {
		var left = this.chartProp.chartGutter._left;
		var right = this.chartProp.chartGutter._right;
		var top = this.chartProp.chartGutter._top;
		var bottom = this.chartProp.chartGutter._bottom;
		
		var trueWidth = this.chartProp.trueWidth;
		
		var widthCanvas = this.chartProp.widthCanvas;
		var heightCanvas = this.chartProp.heightCanvas;
		
		var height = heightCanvas - (top + bottom);
		var width = widthCanvas - (left + right);

		var tempDepth = this.cChartDrawer.processor3D.depthPerspective;
		
		var x1 = left, y1 = top + height, z1 = 0;
		var x2 = left, y2 = top, z2 = 0;
		var x3 = left + width, y3 = top, z3 = 0;
		var x4 = left + width, y4 = top + height, z4 = 0;
		
		var x5 = left, y5 = top + height, z5 = tempDepth;
		var x6 = left, y6 = top, z6 = tempDepth;
		var x7 = left + width, y7 = top, z7 = tempDepth;
		var x8 = left + width, y8 = top + height, z8 = tempDepth;
		
		var point1 = this.cChartDrawer._convertAndTurnPoint(x1, y1, z1);
		var point2 = this.cChartDrawer._convertAndTurnPoint(x2, y2, z2);
		//var point3 = this.cChartDrawer._convertAndTurnPoint(x3, y3, z3);
		//var point4 = this.cChartDrawer._convertAndTurnPoint(x4, y4, z4);
		
		var point5 = this.cChartDrawer._convertAndTurnPoint(x5, y5, z5);
		var point6 = this.cChartDrawer._convertAndTurnPoint(x6, y6, z6);
		//var point7 = this.cChartDrawer._convertAndTurnPoint(x7, y7, z7);
		//var point8 = this.cChartDrawer._convertAndTurnPoint(x8, y8, z8);
		
		
		var radius3D1 = (z6 - z2) / 2;
		var radius3D2 = (z5 - z1) / 2;
		
		var center3D1 = new Point3D(x2 + ((x3 - x2) / 2), y2, z2 + (radius3D1));
		var center3D2 = new Point3D(x1 + ((x4 - x1) / 2), y1, z1 + (radius3D2));
		
		var pointCenter1 = this.cChartDrawer._convertAndTurnPoint(center3D1.x, center3D1.y, center3D1.z);
		var pointCenter2 = this.cChartDrawer._convertAndTurnPoint(center3D2.x, center3D2.y, center3D2.z);
		
		//TEST DRAW FRAME
		//this._calculateTestFrame(point1, point2, point3, point4, point5, point6, point7, point8);
		
		var test1 = this.cChartDrawer._convertAndTurnPoint(x2, y2, center3D1.z);
		var test2 = this.cChartDrawer._convertAndTurnPoint(x3, y3, center3D1.z);
		
		var test11 = this.cChartDrawer._convertAndTurnPoint(x4, y4, center3D2.z);
		var test22 = this.cChartDrawer._convertAndTurnPoint(x1, y1, center3D2.z);
		
		var radius11 = Math.abs((test2.x - test1.x) / 2);
		var radius12 = Math.abs((point6.y - point2.y) / 2);
		var radius21 = Math.abs((test22.x - test11.x) / 2);
		var radius22 = Math.abs((point5.y - point1.y) / 2);
		
		var center1 = {x: this.chartProp.chartGutter._left + trueWidth/2, y: (point2.y - point6.y) / 2 + point6.y};
		var center2 = {x: this.chartProp.chartGutter._left + trueWidth/2, y: (point1.y - point5.y) / 2 + point5.y};
		
		var angles1 = this._calculateAngles3DPerspective(center1.x, center1.y, radius11, radius12, radius3D1, center3D1);
		var angles2 = this._calculateAngles3DPerspective(center2.x, center2.y, radius21, radius22, radius3D2, center3D2);
		
		if(!this.paths.series)
		{
			this.paths.series = [];
		}
		
		for(var i = 0; i < angles1.length; i++)
		{
			var start = angles1[i].start;
			var start1 = angles2[i].start;
			
			if(i === angles1.length - 1)
			{
				var end = angles1[0].start + 2 * Math.PI;
				angles1[i].swap = end - start;
				
				var end1 = angles2[0].start + 2 * Math.PI;
				angles2[i].swap = end1 - start1;
			}
			
			var paths = this._calculateSegment3DPerspective(radius11, radius12, radius21, radius22, angles1[i], angles2[i], center1, center2, pointCenter1, pointCenter2, Math.sign(point2.y - point6.y));
			
			if(null === this.tempDrawOrder)
			{
				this.tempDrawOrder = Math.sign(point2.y - point6.y) < 0 ? true : null;
			}
			
			if(!this.paths.series[angles1.length - i - 1])
			{
				this.paths.series[angles1.length - i - 1] = [];
			}
			
			this.paths.series[angles1.length - i - 1].push(paths);
		}
    },
	
	_calculateAngles3DPerspective: function(xCenter, yCenter, radius1, radius2, radius3D1, center3D1)
	{
		var t = this;
		var widthCanvas = this.chartProp.widthCanvas;
		
		var numCache = this._getFirstRealNumCache();
		var sumData = this.cChartDrawer._getSumArray(numCache, true);
		
		var startAngle = Math.PI / 2;
		var newStartAngle = startAngle;
		
		var firstAngle = this.cChartSpace.chart.view3D && this.cChartSpace.chart.view3D.rotY ? (- this.cChartSpace.chart.view3D.rotY / 360) * (Math.PI * 2) : 0;
		
		
		var getAngleByCoordsSidesTriangle = function(aC, bC, cC)
		{
			var res;
			
			var a = Math.sqrt(Math.pow(aC.x, 2) + Math.pow(aC.y, 2));
			var b = Math.sqrt(Math.pow(bC.x, 2) + Math.pow(bC.y, 2));
			var c = Math.sqrt(Math.pow(cC.x, 2) + Math.pow(cC.y, 2));
			res = Math.acos((Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c));
			
			return res;
		};
		
		var getPointsByAngle = function(angle)
		{
			var point1 = t.cChartDrawer._convertAndTurnPoint(center3D1.x + radius3D1 * Math.cos(angle), center3D1.y, center3D1.z + radius3D1 * Math.sin(angle));
			
			var y11 = point1.y;
			var x11 = Math.sqrt(Math.abs(Math.pow(radius1, 2)*(1 - (Math.pow(y11 - (yCenter), 2) / Math.pow(radius2, 2)))));
			
			var x111;
			if((angle <= 3*Math.PI/2 && angle >= Math.PI/2) || (angle >= -3*Math.PI/2 && angle <= -Math.PI/2))
			{
				x111 = xCenter - x11;
			}
			else
			{
				x111 = widthCanvas - (xCenter - x11)
			}
			
			return {x: x111, y: y11};
		};
		
		var angles = [];
		for (var i = numCache.length; i >= 0; i--) 
		{
			//рассчитываем угол
			if(i === numCache.length)
			{
				var swapAngle = firstAngle
			}
			else
			{
				var partOfSum = numCache[i].val / sumData;
				var swapAngle = Math.abs((parseFloat(partOfSum)) * (Math.PI * 2));
			}
			
			
			var tempSwapAngle = 0, newSwapAngle = 0, tempStartAngle = startAngle;
			while(true)
			{
				if(i === numCache.length && swapAngle < 0)
				{
					if(tempStartAngle - Math.PI / 2 > startAngle + swapAngle)
					{
						tempSwapAngle = -Math.PI / 2;
					}
					else
					{
						tempSwapAngle = (startAngle + swapAngle) - tempStartAngle;
					}
				}
				else
				{
					if(tempStartAngle + Math.PI / 2 < startAngle + swapAngle)
					{
						tempSwapAngle = Math.PI / 2;
					}
					else
					{
						tempSwapAngle = (startAngle + swapAngle) - tempStartAngle;
					}
				}
				
				
				var p1 = getPointsByAngle(tempStartAngle);
				var p2 = getPointsByAngle(tempStartAngle + tempSwapAngle);
				newSwapAngle += getAngleByCoordsSidesTriangle({x: p2.x - p1.x, y: p2.y - p1.y}, {x: xCenter - p1.x, y: yCenter - p1.y}, {x: xCenter - p2.x, y: yCenter - p2.y});
				
				
				if(i === numCache.length && swapAngle < 0)
				{
					if(tempStartAngle - Math.PI / 2 > startAngle + swapAngle)
					{					
						tempStartAngle -= Math.PI / 2;
					}
					else
					{
						if(i !== numCache.length)
							angles.push({start: newStartAngle, swap: newSwapAngle, end: newStartAngle + newSwapAngle});
						
						break;
					}
				}
				else
				{
					if(tempStartAngle + Math.PI / 2 < startAngle + swapAngle)
					{					
						tempStartAngle += Math.PI / 2;
					}
					else
					{
						if(i !== numCache.length)
							angles.push({start: newStartAngle, swap: newSwapAngle, end: newStartAngle + newSwapAngle});
						
						break;
					}
				}
				
			}
			
			startAngle += swapAngle;
			if(i === numCache.length)
			{
				if(swapAngle < 0)
				{
					newStartAngle -= newSwapAngle;
				}
				else
				{
					newStartAngle += newSwapAngle;
				}
				
			}
			else
			{
				newStartAngle += newSwapAngle;
			}
        }
		
		return angles;
	},
	
	_calculateArc3D : function(radius, stAng, swAng, xCenter, yCenter, bIsNotDrawFrontFace, depth, radius1, radius2)
	{	
		var properties = this.cChartDrawer.processor3D.calculatePropertiesForPieCharts();
		var oChartSpace = this.cChartSpace;

		depth = !depth ? properties.depth : depth;
		radius1 = !radius1 ? properties.radius1 : radius1;
		radius2 = !radius2 ? properties.radius2 : radius2;
		
		
		
		var pxToMm = this.chartProp.pxToMM;
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		

		swAng = this._changeAngle(radius, stAng, swAng, xCenter, yCenter, depth, radius1, radius2);
		stAng = this.angleFor3D;
		//корректируем центр
		yCenter = yCenter - depth / 2;
		

		
		var getSegmentPoints = function(startAng, endAng)
		{
			var radiusSpec = (radius1 * radius2) /  Math.sqrt(Math.pow(radius2, 2) * Math.pow((Math.cos(startAng)), 2) + Math.pow(radius1, 2) * Math.pow(Math.sin(startAng),2));
			var radiusSpec2 = (radius1 * radius2) /  Math.sqrt(Math.pow(radius2, 2) * Math.pow((Math.cos(endAng)), 2) + Math.pow(radius1, 2) * Math.pow(Math.sin(endAng),2));
			
			var x0 = (xCenter + radiusSpec*Math.cos(startAng));
			var y0 = (yCenter - radiusSpec*Math.sin(startAng));
			
			var x1 = (xCenter + radiusSpec*Math.cos(startAng));
			var y1 = ((yCenter + depth) - radiusSpec*Math.sin(startAng));
			
			var x2 = (xCenter + radiusSpec2*Math.cos(endAng));
			var y2 = (yCenter - radiusSpec2*Math.sin(endAng));
			
			var x3 = (xCenter + radiusSpec2 * Math.cos(endAng));
			var y3 = ((yCenter + depth) - radiusSpec2 * Math.sin(endAng));
			
			return {x0: x0, y0: y0, x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3};
		};
		
		var breakAng = function(startAng, swapAng)
		{
			var res = [];
			var endAng = startAng + swapAng;
			
			res.push({angle: startAng});
			if(startAng < -2*Math.PI && endAng > -2*Math.PI)
			{
				res.push({angle: -2*Math.PI});
			}
			/*if(startAng < -3/2*Math.PI && endAng > -3/2*Math.PI)
			{
				res.push({angle: -3/2*Math.PI});
			}*/
			if(startAng < -Math.PI && endAng > -Math.PI)
			{
				res.push({angle: -Math.PI});
			}
			/*if(startAng < -Math.PI/2 && endAng > -Math.PI/2)
			{
				res.push({angle: -Math.PI/2});
			}*/
			if(startAng < 0 && endAng > 0)
			{
				res.push({angle: 0});
			}
			/*if(startAng < Math.PI/2 && endAng > Math.PI/2)
			{
				res.push({angle: Math.PI/2});
			}*/
			if(startAng < Math.PI && endAng > Math.PI)
			{
				res.push({angle: Math.PI});
			}
			/*if(startAng < 3/2*Math.PI && endAng > 3/2*Math.PI)
			{
				res.push({angle: 3/2*Math.PI});
			}*/
			if(startAng < 2*Math.PI && endAng > 2*Math.PI)
			{
				res.push({angle: 2*Math.PI});
			}
			res.push({angle: endAng});
			
			return res;
		};
		
		var calculateInsideFaces = function(startAng, swapAng)
		{

            var pathId = oChartSpace.AllocPath();
            var path  = oChartSpace.GetPath(pathId);
			
			var endAng = startAng + swapAng;
			var p = getSegmentPoints(startAng, endAng);
			
			path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
			path.lnTo(p.x0  /pxToMm * pathW, p.y0 / pxToMm * pathH);
			path.lnTo(p.x1  /pxToMm * pathW, p.y1 / pxToMm * pathH);
			path.lnTo(xCenter / pxToMm * pathW, (yCenter + depth) / pxToMm * pathH);
			
			path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
			path.lnTo(p.x2 / pxToMm * pathW, p.y2 / pxToMm * pathH);
			path.lnTo(p.x3 / pxToMm * pathW, p.y3 / pxToMm * pathH);
			path.lnTo(xCenter / pxToMm * pathW, (yCenter + depth) / pxToMm * pathH);
			

			
			return pathId;
		};
		
		var calculateFrontFace = function(startAng, swapAng)
		{

            var pathId = oChartSpace.AllocPath();
            var path  = oChartSpace.GetPath(pathId);
			
			var endAng = startAng + swapAng;
			var p = getSegmentPoints(startAng, endAng);
			
			path.moveTo(p.x0  /pxToMm * pathW, p.y0 / pxToMm * pathH);
			path.arcTo(radius1 / pxToMm * pathW, radius2 / pxToMm * pathH, -1 * startAng*cToDeg, -1 * swapAng*cToDeg);
			path.lnTo(p.x3  /pxToMm * pathW, p.y3 / pxToMm * pathH);
			path.arcTo(radius1 / pxToMm * pathW, radius2 / pxToMm * pathH, -1 * startAng*cToDeg - 1 * swapAng*cToDeg, 1 * swapAng*cToDeg);
			path.lnTo(p.x0 / pxToMm * pathW, p.y0 / pxToMm * pathH);

			
			return pathId;
		};
		
		var calculateUpFace = function(startAng, swapAng)
		{

            var pathId = oChartSpace.AllocPath();
            var path  = oChartSpace.GetPath(pathId);
			
			var endAng = startAng + swapAng;
			var p = getSegmentPoints(startAng, endAng);
			
			path.moveTo(xCenter  / pxToMm * pathW, yCenter / pxToMm * pathH);
			path.lnTo(p.x0 / pxToMm * pathW, p.y0 / pxToMm * pathH);
			path.arcTo(radius1 / pxToMm * pathW, radius2 / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swapAng*cToDeg);
			path.lnTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);

			return pathId;
		};
		
		var calculateDownFace = function(startAng, swapAng)
		{
            var pathId = oChartSpace.AllocPath();
            var path  = oChartSpace.GetPath(pathId);
			
			var endAng = startAng + swapAng;
			var p = getSegmentPoints(startAng, endAng);
			
			path.moveTo(xCenter  / pxToMm * pathW, (yCenter + depth) / pxToMm * pathH);
			path.lnTo(p.x0 / pxToMm * pathW, (p.y0 + depth) / pxToMm * pathH);
			path.arcTo(radius1 / pxToMm * pathW, radius2 / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swapAng*cToDeg);
			path.lnTo(xCenter  /pxToMm * pathW, (yCenter + depth) / pxToMm * pathH);
			

			return pathId;
		};
		
		//FRONT FACES
		//break front faces
		var arrAngles = breakAng(stAng, swAng);
		var frontPath = [];
		for(var i = 1; i < arrAngles.length; i++)
		{
			var start = arrAngles[i - 1].angle;
			var end = arrAngles[i].angle;
			var swap = end - start;
			
			if((start >= 0 && start >= Math.PI && start <= 2 * Math.PI) || (start < 0 && start >= -Math.PI && start <= 0))
			{
				frontPath.push(calculateFrontFace(start, swap));
			}
		}
		
		//INSIDE FACES
		var insidePath = calculateInsideFaces(stAng, swAng);
		
		//UP FACE
		var upPath = calculateUpFace(stAng, swAng);
		
		//DOWN FACE
		var downPath = calculateDownFace(stAng, swAng);
		
		this.angleFor3D += swAng;
		
		return {frontPath: frontPath, upPath: upPath, insidePath: insidePath, downPath: downPath};	
	},
	
	_calculateSegment3D: function (startAngle, swapAngle, radius, xCenter, yCenter)
	{
		if(isNaN(swapAngle))
		{
			return null;
		}
		
		if(radius < 0)
		{
			radius = 0;
		}
		
		var path = [];
		path.push(this._calculateArc3D(radius, startAngle, swapAngle, xCenter, yCenter));
		
		return path;
	},
	
	_calculateSegment3DPerspective: function(radiusUp1, radiusUp2, radiusDown1, radiusDown2, angles1, angles2, center1, center2, pointCenter1, pointCenter2, upFaceSign)
	{	
		var xCenter = center1.x, yCenter = center1.y, xCenter1 = center2.x, yCenter1 = center2.y;
		var startAngle1 = angles1.start, swapAngle1 = angles1.swap, startAngle2 = angles2.start, swapAngle2 = angles2.swap;
		
		var pxToMm = this.chartProp.pxToMM;
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		

		var oThis = this;

		
		var getSegmentPoints = function(startAng, endAng, startAng2, endAng2)
		{
			var radiusSpec = (radiusUp1 * radiusUp2) /  Math.sqrt(Math.pow(radiusUp2, 2) * Math.pow((Math.cos(startAng)), 2) + Math.pow(radiusUp1, 2) * Math.pow(Math.sin(startAng),2));
			var radiusSpec2 = (radiusUp1 * radiusUp2) /  Math.sqrt(Math.pow(radiusUp2, 2) * Math.pow((Math.cos(endAng)), 2) + Math.pow(radiusUp1, 2) * Math.pow(Math.sin(endAng),2));
			
			var radiusSpec11 = (radiusDown1 * radiusDown2) /  Math.sqrt(Math.pow(radiusDown2, 2) * Math.pow((Math.cos(startAng2)), 2) + Math.pow(radiusDown1, 2) * Math.pow(Math.sin(startAng2),2));
			var radiusSpec12 = (radiusDown1 * radiusDown2) /  Math.sqrt(Math.pow(radiusDown2, 2) * Math.pow((Math.cos(endAng2)), 2) + Math.pow(radiusDown1, 2) * Math.pow(Math.sin(endAng2),2));
			
			var x0 = (xCenter + radiusSpec*Math.cos(startAng));
			var y0 = (yCenter - radiusSpec*Math.sin(startAng));
			
			var x1 = (xCenter1 + radiusSpec11*Math.cos(startAng2));
			var y1 = ((yCenter1) - radiusSpec11*Math.sin(startAng2));
			
			var x2 = (xCenter + radiusSpec2*Math.cos(endAng));
			var y2 = (yCenter - radiusSpec2*Math.sin(endAng));
			
			var x3 = (xCenter1 + radiusSpec12 * Math.cos(endAng2));
			var y3 = ((yCenter1) - radiusSpec12 * Math.sin(endAng2));
			
			return {x0: x0, y0: y0, x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3};
		};
		
		var breakAng = function(startAng, swapAng)
		{
			var res = [];
			var endAng = startAng + swapAng;
			
			res.push({angle: startAng});
			
			var tempStartAng = startAng;
			var tempEndAng = endAng;
			var tempPI = Math.PI;
			
			if(tempStartAng <= -2*tempPI && tempEndAng > -2*tempPI)
			{
				res.push({angle: -2*Math.PI});
			}
			if(tempStartAng <= -tempPI && tempEndAng > -tempPI)
			{
				res.push({angle: -Math.PI});
			}
			if(tempStartAng <= 0 && tempEndAng > 0)
			{
				res.push({angle: 0});
			}
			if(tempStartAng <= tempPI && tempEndAng > tempPI)
			{
				res.push({angle: Math.PI});
			}
			if(tempStartAng <= 2*tempPI && tempEndAng > 2*tempPI)
			{
				res.push({angle: 2*Math.PI});
			}
			res.push({angle: endAng});
			
			return res;
		};

		var oThis = this;
		var calculateInsideFaces = function(startAng1, swapAng1, startAng2, swapAng2)
		{

            var pathId = oThis.cChartSpace.AllocPath();
            var path  = oThis.cChartSpace.GetPath(pathId);
			
			var endAng1 = startAng1 + swapAng1;
			var endAng2 = startAng2 + swapAng2;
			var p = getSegmentPoints(startAng1, endAng1, startAng2, endAng2);
			
			path.moveTo(pointCenter1.x  /pxToMm * pathW, pointCenter1.y / pxToMm * pathH);
			path.lnTo(p.x0  /pxToMm * pathW, p.y0 / pxToMm * pathH);
			path.lnTo(p.x1  /pxToMm * pathW, p.y1 / pxToMm * pathH);
			path.lnTo(pointCenter2.x / pxToMm * pathW, (pointCenter2.y) / pxToMm * pathH);
			
			path.moveTo(pointCenter1.x  /pxToMm * pathW, pointCenter1.y / pxToMm * pathH);
			path.lnTo(p.x2 / pxToMm * pathW, p.y2 / pxToMm * pathH);
			path.lnTo(p.x3 / pxToMm * pathW, p.y3 / pxToMm * pathH);
			path.lnTo(pointCenter2.x / pxToMm * pathW, (pointCenter2.y) / pxToMm * pathH);
			

			
			return pathId;
		};
		
		var calculateFrontFace = function(startAng, swapAng, startAng2, swapAng2)
		{

            var pathId = oThis.cChartSpace.AllocPath();
            var path  = oThis.cChartSpace.GetPath(pathId);
			
			var endAng = startAng + swapAng;
			var endAng2 = startAng2 + swapAng2;
			
			var p = getSegmentPoints(startAng, endAng, startAng2, endAng2);
			//var p2 = getSegmentPoints(startAng2, endAng2);
			
			path.moveTo(p.x0  /pxToMm * pathW, p.y0 / pxToMm * pathH);
			path.arcTo(radiusUp1 / pxToMm * pathW, radiusUp2 / pxToMm * pathH, -1 * startAng*cToDeg, -1 * swapAng*cToDeg);
			path.lnTo(p.x3  /pxToMm * pathW, p.y3 / pxToMm * pathH);
			path.arcTo(radiusDown1 / pxToMm * pathW, radiusDown2 / pxToMm * pathH, -1 * startAng2*cToDeg - 1 * swapAng2*cToDeg, 1 * swapAng2*cToDeg);
			path.lnTo(p.x0 / pxToMm * pathW, p.y0 / pxToMm * pathH);

			
			return pathId;
		};
		
		var calculateUpFace = function(startAng, swapAng)
		{

            var pathId = oThis.cChartSpace.AllocPath();
            var path  = oThis.cChartSpace.GetPath(pathId);
			
			var radiusSpec = (radiusUp1 * radiusUp2) /  Math.sqrt(Math.pow(radiusUp2, 2) * Math.pow((Math.cos(startAng)), 2) + Math.pow(radiusUp1, 2) * Math.pow(Math.sin(startAng),2));
			
			var x0 = (xCenter + radiusSpec*Math.cos(startAng));
			var y0 = (yCenter - radiusSpec*Math.sin(startAng));
			
			path.moveTo(pointCenter1.x  / pxToMm * pathW, pointCenter1.y / pxToMm * pathH);
			path.lnTo(x0 / pxToMm * pathW, y0 / pxToMm * pathH);
			path.arcTo(radiusUp1 / pxToMm * pathW, radiusUp2 / pxToMm * pathH, -1 * startAng*cToDeg, -1 * swapAng*cToDeg);
			path.lnTo(pointCenter1.x  /pxToMm * pathW, pointCenter1.y / pxToMm * pathH);
			

			
			return pathId;
		};
		
		var calculateDownFace = function(startAng, swapAng)
		{

            var pathId = oThis.cChartSpace.AllocPath();
            var path  = oThis.cChartSpace.GetPath(pathId);

			var radiusSpec = (radiusDown1 * radiusDown2) /  Math.sqrt(Math.pow(radiusDown2, 2) * Math.pow((Math.cos(startAng)), 2) + Math.pow(radiusDown1, 2) * Math.pow(Math.sin(startAng),2));
			//var radiusSpec2 = (radius11 * radius2) /  Math.sqrt(Math.pow(radius2, 2) * Math.pow((Math.cos(endAng)), 2) + Math.pow(radius11, 2) * Math.pow(Math.sin(endAng),2))
			
			var x = (xCenter1 + radiusSpec*Math.cos(startAng));
			var y = (yCenter1 - radiusSpec*Math.sin(startAng));
			
			path.moveTo(pointCenter2.x  / pxToMm * pathW, (pointCenter2.y) / pxToMm * pathH);
			path.lnTo(x / pxToMm * pathW, y / pxToMm * pathH);
			path.arcTo(radiusDown1 / pxToMm * pathW, radiusDown2 / pxToMm * pathH, -1 * startAng*cToDeg, -1 * swapAng*cToDeg);
			path.lnTo(pointCenter2.x  /pxToMm * pathW, (pointCenter2.y) / pxToMm * pathH);
			

			return pathId;
		};
		
		//FRONT FACES
		//break front faces
		var arrAngles = breakAng(startAngle1, swapAngle1);
		var arrAngles2 = breakAng(startAngle2, swapAngle2);
		var frontPath = [];
		for(var i = 1; i < arrAngles.length; i++)
		{
			var start = arrAngles[i - 1].angle;
			var end = arrAngles[i].angle;
			var swap = end - start;
			
			var start2 = arrAngles2[i - 1].angle;
			var end2;
			if(!arrAngles2[i])
			{
				end2 = arrAngles2[i - 1].angle;
			}
			else
			{
				end2 = arrAngles2[i].angle;
			}
			
			var swap2 = end2 - start2;
			
			if((start >= 0 && start >= Math.PI && start <= 2 * Math.PI) || (start < 0 && start >= -Math.PI && start <= 0))
			{
				frontPath.push(calculateFrontFace(upFaceSign*start, upFaceSign*swap, start2, swap2));
			}
		}
		
		//INSIDE FACES
		var insidePath = calculateInsideFaces(upFaceSign*startAngle1, upFaceSign*swapAngle1, startAngle2, swapAngle2);
		
		//UP FACE
		var upPath = calculateUpFace(upFaceSign*startAngle1, upFaceSign*swapAngle1);
		
		//DOWN FACE
		var downPath = calculateDownFace(startAngle2, swapAngle2);
		
		
		return {frontPath: frontPath, upPath: upPath, insidePath: insidePath, downPath: downPath};
	},
	
	
	_drawPie3D: function ()
    {
		var numCache = this._getFirstRealNumCache();
		var t = this;
		var shade = "shade";
		var shadeValue = 35000;
		
		var drawPath = function(path, pen, brush, isShadePen, isShadeBrush)
		{
			if(path)
			{
				if(brush)
				{
					var  props = t.cChartSpace.getParentObjects();
					var duplicateBrush = brush.createDuplicate();
					var cColorMod = new AscFormat.CColorMod;
					
					cColorMod.val = shadeValue;
					cColorMod.name = shade;
					
					if(duplicateBrush)
					{
						duplicateBrush.addColorMod(cColorMod);
						duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new AscFormat.CUniColor().RGBA);
					}
					if(isShadePen)
					{
						pen = AscFormat.CreatePenFromParams(duplicateBrush, undefined, undefined, undefined, undefined, 0);
					}
					if(isShadeBrush)
					{
						brush = duplicateBrush;
					}
				}
				
				t.cChartDrawer.drawPath(path, pen, brush);
			}

		};
		
		var pen = numCache[0].pen;
		drawPath(this.paths.test, pen, null);
		
		var sides = {down: 0, inside: 1, up: 2, front: 3};
		var drawPaths = function(side)
		{
			for (var i = 0,len = numCache.length; i < len; i++) 
			{
				var val = numCache[i];
				var brush = val.brush;
				var pen = val.pen;
				var path = t.paths.series[i];
				
				if(path)
				{
					for(var j = path.length - 1; j >= 0; j--)
					{
						if(side === sides.down)
						{
							drawPath(path[j].downPath, pen, null);
						}
						else if(side === sides.inside)
						{
							//выставляю закругленные соединения
							if(pen && pen.Join)
							{
								pen = pen.createDuplicate();
								pen.Join.type = Asc['c_oAscLineJoinType'].Round;
							}
							
							drawPath(path[j].insidePath, pen, brush, null, true);
						}
						else if(side === sides.up)
						{
							drawPath(path[j].upPath, pen, brush);
						}
						else if(side === sides.frontPath)
						{
							for(var k = 0; k < path[j].frontPath.length;k++)
							{
								drawPath(path[j].frontPath[k], pen, brush, true, true);
							}
						}
					}
				}
			}
		};
		
		drawPaths(sides.down);
		drawPaths(sides.inside);
		if(this.tempDrawOrder !== null)
		{
			drawPaths(sides.up);
			drawPaths(sides.frontPath);
		}
		else
		{
			drawPaths(sides.frontPath);
			drawPaths(sides.up);
		}
    },
	
	//best fit DLbl
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
                    else if(oSolvation.x1 >= 0){
						oResult.bError = false;
						oResult.fX = fCenterX + oSolvation.x1*(fXs - fCenterX);
						oResult.fY = fCenterY + oSolvation.x1*(fYs - fCenterY) - (1 - fLengthCoeff)*fLabelHeight;
					}
					else if(oSolvation.x2 >= 0){
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
                    else if(oSolvation.x1 >= 0){
						oResult.bError = false;
						oResult.fX = fCenterX + oSolvation.x1*(fXs - fCenterX) - fLabelWidth*fLengthCoeff;
						oResult.fY = fCenterY + oSolvation.x1*(fYs - fCenterY);
					}
					else if(oSolvation.x2 >= 0){
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
                    else if(oSolvation.x1 >= 0){
						oResult.bError = false;
						oResult.fX = fCenterX + oSolvation.x1*(fXs - fCenterX) - fLabelWidth;
						oResult.fY = fCenterY + oSolvation.x1*(fYs - fCenterY) - fLabelHeight*fLengthCoeff;

					}
					else if(oSolvation.x2 >= 0){
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
					else if(oSolvation.x1 >= 0){
						oResult.bError = false;
						oResult.fX = fCenterX + oSolvation.x1*(fXs - fCenterX) - (1 - fLengthCoeff)*fLabelWidth;
						oResult.fY = fCenterY + oSolvation.x1*(fYs - fCenterY) - fLabelHeight;
					}
					else if(oSolvation.x2 >= 0){
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
	
	//For test
	_calculateTestFrame: function(point1, point2, point3, point4, point5, point6, point7, point8)
	{
		var pxToMm = this.chartProp.pxToMM;
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
		path.lnTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
		path.lnTo(point3.x / pxToMm * pathW, point3.y / pxToMm * pathH);
		path.lnTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
		path.lnTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
		
		path.moveTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
		path.lnTo(point6.x / pxToMm * pathW, point6.y / pxToMm * pathH);
		path.lnTo(point7.x / pxToMm * pathW, point7.y / pxToMm * pathH);
		path.lnTo(point8.x / pxToMm * pathW, point8.y / pxToMm * pathH);
		path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
		
		path.moveTo(point1.x / pxToMm * pathW, point1.y / pxToMm * pathH);
		path.lnTo(point5.x / pxToMm * pathW, point5.y / pxToMm * pathH);
		
		path.moveTo(point2.x / pxToMm * pathW, point2.y / pxToMm * pathH);
		path.lnTo(point6.x / pxToMm * pathW, point6.y / pxToMm * pathH);
		
		path.moveTo(point3.x / pxToMm * pathW, point3.y / pxToMm * pathH);
		path.lnTo(point7.x / pxToMm * pathW, point7.y / pxToMm * pathH);
		
		path.moveTo(point4.x / pxToMm * pathW, point4.y / pxToMm * pathH);
		path.lnTo(point8.x / pxToMm * pathW, point8.y / pxToMm * pathH);
		

		
		this.paths.test = pathId;
	},
	
	//TODO delete after test
	_recalculatePie3D_Slow: function ()
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
	
	_calculateSegment3D_Slow: function (angle, radius, xCenter, yCenter, depth, i)
	{
		if(isNaN(angle))
			return null;
		
		var startAngle = (this.tempAngle);
		var swapAngle   = angle;
		
		var path = this._calculateArc3D(radius, startAngle, swapAngle, xCenter, yCenter, depth, i);
			
        this.tempAngle += angle;
		
		return path;
	},
	
	_calculateArc3D_Slow : function(radius, stAng, swAng, xCenter, yCenter, depth, seriaNum)
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


        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		
		calculateProps();
		
		path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		path.lnTo(x0  /pxToMm * pathW, y0 / pxToMm * pathH);
		path.arcTo(radius1 / pxToMm * pathW, radius2 / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swAng*cToDeg);
		path.lnTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		

		
		this.angleFor3D += swAng;
		if(!this.usually3dPropsCalc[seriaNum])
			this.usually3dPropsCalc[seriaNum] = {swAng: swAng, stAng: stAng, xCenter: xCenter, x0: x0, radiusSpec: radiusSpec};
		
		return pathId;
	},
	
	_drawPie3D_Slow: function ()
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
				{
					pen = val.pen;
				}
				else
				{
					pen = null;
				}
				
				path = this.paths.series[n][i];
				
				var duplicateBrush = brush;
				if(n !== this.paths.series.length - 1)
				{
					duplicateBrush = brush.createDuplicate();
					var cColorMod = new AscFormat.CColorMod;
					
					cColorMod.val = 35000;
					cColorMod.name = "shade";
					
					duplicateBrush.addColorMod(cColorMod);
					duplicateBrush.calculate(props.theme, props.slide, props.layout, props.master, new AscFormat.CUniColor().RGBA);
				}
				
				this.cChartDrawer.drawPath(path, pen, duplicateBrush);
			}
		}
        
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
	
	recalculate : function(chartsDrawer)
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
		var brush, pen;
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

        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		
		var pxToMm = this.chartProp.pxToMM;
		
		var x2 = xCenter + radius1*Math.cos(stAng);
		var y2 = yCenter - radius1*Math.sin(stAng);
		
		var x1 = xCenter + radius2*Math.cos(stAng);
		var y1 = yCenter - radius2*Math.sin(stAng);
		
		//var x3 = xCenter + radius1*Math.cos(stAng + swAng);
		//var y3 = yCenter - radius1*Math.sin(stAng + swAng);
		
		var x4 = xCenter + radius2*Math.cos(stAng + swAng);
		var y4 = yCenter - radius2*Math.sin(stAng + swAng);
		
		path.moveTo(x1  /pxToMm * pathW, y1 / pxToMm * pathH);
		path.lnTo(x2  /pxToMm * pathW, y2 / pxToMm * pathH);
		path.arcTo(radius1 / pxToMm * pathW, radius1 / pxToMm * pathH, -1 * stAng*cToDeg, -1 * swAng*cToDeg);
		path.lnTo(x4 / pxToMm * pathW, y4 / pxToMm * pathH);
		path.arcTo(radius2 / pxToMm * pathW, radius2 / pxToMm * pathH,  -1 * stAng*cToDeg - swAng*cToDeg, swAng*cToDeg);
		path.moveTo(xCenter  /pxToMm * pathW, yCenter / pxToMm * pathH);
		

		return pathId;
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		if(!AscFormat.isRealNumber(this.paths.series[ser][val]))
			return;
		
		var path = this.paths.series[ser][val];
		var oPath = this.cChartSpace.GetPath(path);

		var oCommand2 = oPath.getCommandByIndex(2);
		var oCommand4 = oPath.getCommandByIndex(4);
		var oCommand5 = oPath.getCommandByIndex(5);

		var radius1 = oCommand2.hR;
		var stAng = oCommand2.stAng;
		var swAng = oCommand2.swAng;
		
		var radius2 = oCommand4.hR;
		var xCenter = oCommand5.X;
		var yCenter = oCommand5.Y;
		
		
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
	
	recalculate : function(chartsDrawer)
    {
		this.paths = {};
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this._calculateLines();
	},
	
	_calculateLines: function ()
	{
		//соответствует подписям оси значений(OY)
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		
		var trueWidth = this.chartProp.trueWidth;
		var trueHeight = this.chartProp.trueHeight;
		
		var xCenter = (this.chartProp.chartGutter._left + trueWidth/2) / this.chartProp.pxToMM;
		var yCenter = (this.chartProp.chartGutter._top + trueHeight/2) / this.chartProp.pxToMM;
		
		var y, y1, x, x1, val, nextVal, seria, dataSeries;
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

		var oCommand, oPath;
		if(this.paths.series)
		{
			if(val == numCache.pts.length - 1)
			{
				oPath = this.cChartSpace.GetPath(this.paths.series[ser][val - 1]);
				oCommand = oPath.getCommandByIndex(1);
			}
			else
			{
                oPath = this.cChartSpace.GetPath(this.paths.series[ser][val]);
                oCommand = oPath.getCommandByIndex(0);
			}
		}
		else if(this.paths.points)
		{
            oPath = this.cChartSpace.GetPath(this.paths.points[ser][val].path);
            oCommand = oPath.getCommandByIndex(0);
		}
		
		if(!oCommand)
			return;
				
		var x = oCommand.X;
		var y = oCommand.Y;
		
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
	
	_drawLines: function ()
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

        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);

		
		return pathId;
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
	
	recalculate : function(chartsDrawer)
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
		
		var y, y1, y2, y3, x, val, seria, dataSeries, compiledMarkerSize, compiledMarkerSymbol, idx, numCache;
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
		
		var seria, yVal, xVal, points, yNumCache, xNumCache, compiledMarkerSize, compiledMarkerSymbol, idxPoint;
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
	
	_drawScatter: function ()
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

        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		path.moveTo(x * pathH, y * pathW);
		path.lnTo(x1 * pathH, y1 * pathW);

		
		return pathId;
	},
	
	_calculateDLbl: function(chartSpace, ser, val)
	{
		var point = this.cChartDrawer.getIdxPoint(this.chartProp.series[ser], val);
		
		var path;
		
		if(this.paths.points)
		{
			if(this.paths.points[ser] && this.paths.points[ser][val])
			{
				var oPath = this.cChartSpace.GetPath(this.paths.points[ser][val].path);
                path = oPath.getCommandByIndex(0);
			}

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

	//TODO пока включаю функцию _calculateSplineLine. с _calculateSplineLine2 отрисовается неверно. проверить!
	_calculateSplineLine2 : function(points, k, xPoints, yPoints)
	{

        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		var splineCoords;
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

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
		

		
		return pathId;
	},

	_calculateSplineLine : function(points, k, xPoints, yPoints)
	{
		var pathId = this.cChartSpace.AllocPath();
		var path  = this.cChartSpace.GetPath(pathId);

		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		var x = points[k - 1] ? points[k - 1].x : points[k].x;
		var y = points[k - 1] ? points[k - 1].y : points[k].y;

		var x1 = points[k].x;
		var y1 = points[k].y;

		var x2 = points[k + 1] ? points[k + 1].x : points[k].x;
		var y2 = points[k + 1] ? points[k + 1].y : points[k].y;

		var x3 = points[k + 2] ? points[k + 2].x : points[k + 1] ? points[k + 1].x : points[k].x;
		var y3 = points[k + 2] ? points[k + 2].y : points[k + 1] ? points[k + 1].y : points[k].y;

		var startCoords;
		var endCoords;

		for(var i = 0; i <= 1;)
		{
			var splineCoords = this.cChartDrawer.calculate_Bezier(x, y, x1, y1, x2, y2, x3, y3, i);

			if(i == 0)
			{
				startCoords = {x: this.cChartDrawer.getYPosition(splineCoords[0], xPoints, true), y: this.cChartDrawer.getYPosition(splineCoords[1], yPoints)};
			}

			endCoords = {x: this.cChartDrawer.getYPosition(splineCoords[0], xPoints, true), y: this.cChartDrawer.getYPosition(splineCoords[1], yPoints)};

			if(i == 0)
			{
				path.moveTo(startCoords.x * pathW, startCoords.y * pathH);
			}
			path.lnTo(endCoords.x * pathW, endCoords.y * pathH);

			i = i + 0.1;
		}

		return pathId;
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
	
	recalculate : function(chartsDrawer)
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

	
	_drawLines: function ()
    {
		var brush;
		var pen;
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

        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		
		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);

		return pathId;
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

        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		var pxToMm = this.chartProp.pxToMM;
		path.moveTo((x - width/2) * pathW, y * pathH);
		path.lnTo((x - width/2) * pathW, y1 * pathH);
		path.lnTo((x + width/2) * pathW, y1 * pathH);
		path.lnTo((x + width/2) * pathW, y * pathH);
		path.lnTo((x - width/2) * pathW, y * pathH);

		
		return pathId;
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
	
	recalculate : function(chartsDrawer)
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
		
		var seria, yVal, xVal, points, x, y, yNumCache, xNumCache;
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
			if(this.paths.points[ser] && this.paths.points[ser][val]){
				var oPath = this.cChartSpace.GetPath(this.paths.points[ser][val].path);
                path = oPath.getCommandByIndex(0);
			}

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


        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		path.moveTo((x + defaultSize) * pathW, y * pathH);
		path.arcTo(defaultSize * pathW, defaultSize * pathW, 0, Math.PI * 2 * cToDeg);

		return pathId;
	}
};


/** @constructor */
function drawSurfaceChart()
{
	this.chartProp = null;
	this.cChartDrawer = null;
	this.cChartSpace = null;
	this.paths = {};
}

drawSurfaceChart.prototype =
{
	constructor: drawSurfaceChart,
	
	recalculate: function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.paths = {};
		
		this._recalculate();
	},
	
	draw: function(chartsDrawer)
    {
		this.chartProp = chartsDrawer.calcProp;
		this.cChartDrawer = chartsDrawer;
		this.cChartSpace = chartsDrawer.cChartSpace;
		
		this._draw();
	},
	
	_recalculate: function()
	{
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		
		var roundInt = 1;
		if(this.chartProp.axisStep)
		{
			var roundProps = this.cChartDrawer._getFirstDegree(this.chartProp.axisStep);
			var roundProp = roundProps.numPow.toString().split('.');
			var roundCount = roundProp && roundProp[1] ? roundProp[1].length : 0;
			roundInt = Math.pow(10, roundCount + 1);
		}
		
		//var roundKF = this.chartProp.axisStep;
		var y, x, z, val, seria, dataSeries, compiledMarkerSize, compiledMarkerSymbol, idx, numCache, idxPoint, points = [], points3d = [];
		for (var i = 0; i < this.chartProp.series.length; i++) {
			seria = this.chartProp.series[i];
			numCache = seria.val.numRef ? seria.val.numRef.numCache : seria.val.numLit;
			
			if(!numCache)
			{
				continue;
			}
			
			dataSeries = numCache.pts;
			for(var n = 0; n < this.chartProp.ptCount; n++)
			{	
				//рассчитываем значения
				idx = dataSeries[n] && dataSeries[n].idx != null ? dataSeries[n].idx : n;
				//TODO временно заменил idx на n. позже нужно использовать idx
				val = Math.round(this._getYVal(n, i) * roundInt) / roundInt;
				//val = this._getYVal(idx, i);
				
				x  = xPoints[n].pos * this.chartProp.pxToMM;
				y  = this.cChartDrawer.getYPosition(val, yPoints) * this.chartProp.pxToMM;
				z = (perspectiveDepth / (this.chartProp.series.length - 1)) * (i);
				
				//рассчитываем значения
				var idx2 = dataSeries[n + 1] && dataSeries[n + 1].idx != null ? dataSeries[n + 1].idx : null;
				//TODO временно заменил idx на n. позже нужно использовать idx
				var val2 = Math.round(this._getYVal(n + 1, i) * roundInt) / roundInt;
				
				if(idx2 !== null)
				{	
					var x2  = xPoints[n + 1].pos * this.chartProp.pxToMM;
					var y2  = this.cChartDrawer.getYPosition(val2, yPoints) * this.chartProp.pxToMM;
					var z2 = (perspectiveDepth / (this.chartProp.series.length - 1)) * (i);
				}
				
				
				if(!points)
					points = [];
				if(!points[i])
					points[i] = [];
					
				if(!points3d)
					points3d = [];
				if(!points3d[i])
					points3d[i] = [];
				
				if(val != null)
				{
					points3d[i][n] = {x: x, y: y, z: z, val: val};
					var convertResult = this.cChartDrawer._convertAndTurnPoint(x, y, z);
					var x1 = convertResult.x;
					var y1 = convertResult.y;
					points[i][n] = {x: x1, y: y1, val: val};
				}
				else
				{
					points[i][n] = null;
				}
			}
		}
		
		this._calculateAllFaces(points, points3d);
	},
	
	
	
	_calculateAllFaces: function(points, points3d)
	{		
		if(!this.paths.test)
		{
			this.paths.test = [];
		}
		if(!this.paths.test2)
		{
			this.paths.test2 = [];
		}
		
		for (var i = 0; i < points.length - 1; i++) 
		{
			for(var j = 0; j < points[i].length - 1; j++)
			{
				var p1 = points[i][j];
				var p2 = points[i + 1][j];
				var p3 = points[i][j + 1];
				var p4 = points[i + 1][j + 1];
				
				this.paths.test.push(this.cChartDrawer._calculatePathFace(p1, p3, p4, p2, true));
				
				var p13d = points3d[i][j];
				var p23d = points3d[i + 1][j];
				var p33d = points3d[i][j + 1];
				var p43d = points3d[i + 1][j + 1];	
				
				//рассчитываем отдельный сегмент - смотрим, может ли он располагаться в одной плоскости + делим его плоскостями сетки
				//p, p2, p21, p1 - точки данного сегмента
				//  p1-----p21
				//  |       |
				//  |       |
				//  p-------p2
				this._calculateFace(p1, p2, p3, p4, p13d, p23d, p33d, p43d);
			}
		}
	},

	_calculateFace: function(p, p1, p2, p21, p3d, p13d, p23d, p213d)
	{
		var t = this;
		
		//все стороны сегмента
		var lines = [];
		lines[0] = {p1: p3d, p2: p23d, p111: p, p222: p2};
		lines[1] = {p1: p13d, p2: p213d, p111: p1, p222: p21};
		lines[2] = {p1: p3d, p2: p13d, p111: p, p222: p1};
		lines[3] = {p1: p23d, p2: p213d, p111: p2, p222: p21};
		
		
		var pointsValue = [p1, p2, p21, p];
		var res = this.cChartDrawer.isPointsLieIntoOnePlane3(p3d, p13d, p213d, p23d);
		if(this.cChartDrawer.isPointsLieIntoOnePlane(p3d, p13d, p213d, p23d))//не делим диагональю данный сегмент
		{
			var pointsFace = this._getIntersectionPlanesAndLines(lines, pointsValue, true);
		}
		else//делим диагональю данный сегмент
		{
			var max = p.val;
			var maxIndex = 0;
			var arrVal = [p, p1, p2, p21];
			for(var m = 0; m < arrVal.length; m++)
			{
				if(arrVal[m].val > max)
				{	
					max = arrVal[m].val;
					maxIndex = m;
				}
			}
			
			//разбиваем диагональю данный сегмент на два сегмента
			if(p1.val + p2.val < p21.val + p.val)
			{	
				//добавляем диагональ
				lines.push({p1: p213d, p2: p3d, p111: p21, p222: p});
				//this.paths.test.push(this._calculatePath(p21.x, p21.y, p.x, p.y));
				
				var lines1 = [lines[0], lines[3], lines[4]];
				var pointsValue1 = [p, p21, p2];
				var lines2 = [lines[2], lines[1], lines[4]];
				var pointsValue2 = [p, p1, p21];
			}
			else
			{
				//добавляем диагональ
				lines.push({p1: p13d, p2: p23d, p111: p1, p222: p2});
				//this.paths.test.push(this._calculatePath(p2.x, p2.y, p1.x, p1.y));
				
				var lines1 = [lines[2], lines[0], lines[4]];
				var pointsValue1 = [p, p1, p2];
				var lines2 = [lines[4], lines[1], lines[3]];
				var pointsValue2 = [p2, p1, p21];
			}
			
			//для поверхностных диаграмм без заливки
			var bIsWireframeChart = false;
			
			//находим пересечение двух сегментов с плоскостями сетки
			var pointsFace1 = this._getIntersectionPlanesAndLines(lines1, pointsValue1, !bIsWireframeChart);
			var pointsFace2 = this._getIntersectionPlanesAndLines(lines2, pointsValue2, !bIsWireframeChart);
			
			if(bIsWireframeChart)
			{
				var lengthFaces = Math.max(pointsFace1.length, pointsFace2.length);
				for(var l = 0; l < lengthFaces; l++)
				{
					var newPath = null;
					if(pointsFace1[l] && pointsFace2[l])
					{	
						var cleanPoints1 = this._getArrayWithoutRepeatePoints(pointsFace1[l]);
						var cleanPoints2 = this._getArrayWithoutRepeatePoints(pointsFace2[l]);
						
						if(cleanPoints1.length >= 3 && cleanPoints2.length >= 3)
						{
							newPath = cleanPoints1.concat(cleanPoints2);
						}
					}
					else if(pointsFace1[l])
					{
						newPath = pointsFace1[l];
					}
					else if(pointsFace2[l])
					{
						newPath = pointsFace2[l];
					}
					
					
					if(newPath)
					{
						if(!t.paths.test2[l])
						{
							t.paths.test2[l] = [];
						}
						
						var path2 = t._calculateTempFace(newPath);
						t.paths.test2[l].push(path2);
					}
				}
			}
			
			//TODO временно убираю. если будут проблемы в отрисовке - раскомментировать!
			/*var lengthFaces = Math.max(pointsFace1.length, pointsFace2.length);
			for(var l = 0; l < lengthFaces; l++)
			{
				if(pointsFace1[l] && pointsFace2[l])
				{	
					//находим две точки, принадлежащие диагональной прямой. у обоих сегментов они должны быть
					var lineEquation = t.cChartDrawer.getLineEquation2d(lines[4].p111, lines[4].p222);
					
					var points1 = [];
					for(var s = 0; s < pointsFace1[l].length; s++)
					{
						if(null === this._isEqualPoints(points1, pointsFace1[l][s]) && t.cChartDrawer.isPoint2DLieOnLine(lineEquation, pointsFace1[l][s]))
						{
							points1.push(pointsFace1[l][s]);
						}
					}
					
					var points2 = []
					for(var s = 0; s < pointsFace2[l].length; s++)
					{
						if(null === this._isEqualPoints(points2, pointsFace2[l][s]) && t.cChartDrawer.isPoint2DLieOnLine(lineEquation, pointsFace2[l][s]))
						{
							points2.push(pointsFace2[l][s]);
						}
					}
					
					if(points1.length < 2 && points2.length === 2)
					{
						pointsFace1[l].push(points2[0]);
						pointsFace1[l].push(points2[1]);
					}
					else if(points2.length < 2 && points1.length === 2)
					{
						pointsFace2[l].push(points1[0]);
						pointsFace2[l].push(points1[1]);
					}
				}
				
				
				if(!t.paths.test2[l])
				{
					t.paths.test2[l] = [];
				}
				if(pointsFace1[l])
				{	
					var path1 = t._calculateTempFace(pointsFace1[l]);
					t.paths.test2[l].push(path1);
				}
				if(pointsFace2[l])
				{
					var path2 = t._calculateTempFace(pointsFace2[l]);
					t.paths.test2[l].push(path2);
				}
			}*/
		}
	},
	
	
	_getIntersectionPlanesAndLines: function(lines, pointsValue, bIsAddIntoPaths)
	{
		var t = this;
		var yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
		var xPoints = this.cChartSpace.chart.plotArea.catAx.xPoints;
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		
		var getGridPlain = function(index)
		{
			var gridX1 = xPoints[0].pos * t.chartProp.pxToMM;
			var gridX2 = xPoints[xPoints.length - 1].pos * t.chartProp.pxToMM;
			
			var gridY1 = yPoints[index].pos * t.chartProp.pxToMM;
			var gridY2 = yPoints[index].pos * t.chartProp.pxToMM;
			var gridPlain = t.cChartDrawer.getPlainEquation({x: gridX1,y: gridY1, z: 0}, {x: gridX2, y: gridY2, z: 0}, {x: gridX2, y: gridY2, z: perspectiveDepth});
			
			return gridPlain;
		};
		
		var getMinMaxValArray = function(pointsValue)
		{
			var min, max;
			if(pointsValue.length === 4)
			{
				min = Math.min(pointsValue[0].val, pointsValue[1].val, pointsValue[2].val, pointsValue[3].val);
				max = Math.max(pointsValue[0].val, pointsValue[1].val, pointsValue[2].val, pointsValue[3].val);
			}
			else
			{
				min = Math.min(pointsValue[0].val, pointsValue[1].val, pointsValue[2].val);
				max = Math.max(pointsValue[0].val, pointsValue[1].val, pointsValue[2].val);
			}
			return {min: min, max: max}
		};
		
		var calculateFaceBetween2GridLines = function(minVal, maxVal, k, pointsValue, res)
		{
			var result = false;
			
			if(yPoints[k - 1] && minVal >= yPoints[k - 1].val && maxVal <= yPoints[k].val)
			{
				var p1 = pointsValue[0];
				var p2 = pointsValue[1];
				var p3 = pointsValue[2];
				var p4 = pointsValue[3] ? pointsValue[3] : pointsValue[2];
				
				var path = t._calculateTempFace([p1, p2, p3, p4]);
				
				var addIndex = k;
				if(minVal === maxVal && yPoints[k] && minVal === yPoints[k].val)
				{
					addIndex = k + 1;
				}
				
				if(bIsAddIntoPaths)
				{
					if(!t.paths.test2[addIndex])
					{
						t.paths.test2[addIndex] = [];
					}
					t.paths.test2[addIndex].push(path);
				}
				
				res[k] = [p1, p2, p3, p4];
				result = true;
			}
			
			return result;
		};
		
		var minMaxVal = getMinMaxValArray(pointsValue);
		var minVal = minMaxVal.min;
		var maxVal = minMaxVal.max;
		
		var res = [];
		
		var prevPoints = null;
		for(var k = 0; k < yPoints.length; k++)
		{
			//если сегмент весь находится между двумя соседними плоскостями сетки, то есть ни с одной из них не имеет пересечений
			if(calculateFaceBetween2GridLines(minVal, maxVal, k, pointsValue, res))
			{
				break;
			}
			//если значение сетки больше максимального значения сегмента
			if(yPoints[k - 1] && yPoints[k].val > maxVal && yPoints[k - 1].val >= maxVal)
			{
				break;
			}
			
			//точки, которые находятся между данными плоскостями сетки(или лежат на них), обязательно должны войти в сегмент
			var pointNeedAddIntoFace = null;
			if(yPoints[k - 1])
			{
				for(var i = 0; i < pointsValue.length; i++)
				{
					if(yPoints[k - 1].val <= pointsValue[i].val && yPoints[k].val >= pointsValue[i].val)
					{
						if(null === pointNeedAddIntoFace)
						{
							pointNeedAddIntoFace = [];
						}
						
						pointNeedAddIntoFace.push(pointsValue[i]);
					}
				}
			}
			
			
			var isCalculatePrevPoints = false;
			if(null === prevPoints)
			{
				for(var j = 0; j < pointsValue.length; j++)
				{
					if(pointsValue[j].val <= yPoints[k].val)
					{
						if(!prevPoints)
						{
							prevPoints = [];
						}
						prevPoints.push(pointsValue[j]);
						isCalculatePrevPoints = true;
					}	
				}
			}
			
			//находим точки пересечения с текущей плоскостью сетки
			var gridPlane = getGridPlain(k);
			var points = this._getIntersectionPlaneAndLines(gridPlane, lines, pointsValue);
			
			if(!isCalculatePrevPoints && null === points && prevPoints)
			{
				for(var j = 0; j < pointsValue.length; j++)
				{
					if(pointsValue[j].val >= yPoints[k - 1].val)
					{
						if(!points)
						{
							points = [];
						}
						points.push(pointsValue[j]);
						isCalculatePrevPoints = true;
					}	
				}
			}
			
			var arrPoints = null;
			if(null !== points && prevPoints)
			{
				var p1 = prevPoints[0];
				var p2 = prevPoints[1] ? prevPoints[1] : prevPoints[0];
				var p3 = points[0];
				var p4 = points[1] ? points[1] : points[0];
				
				arrPoints = [p1, p2, p3, p4];
				if(points[2])
				{
					arrPoints.push(points[2]);
				}
				res[k] = arrPoints;
			}
			else if(prevPoints && prevPoints.length === 3 && !points && isCalculatePrevPoints)
			{
				var p1 = prevPoints[0];
				var p2 = prevPoints[1];
				var p3 = prevPoints[2];
				var p4 = prevPoints[3] ? prevPoints[3] : prevPoints[2];
				
				arrPoints = [p1, p2, p3, p4];
				res[k] = arrPoints;
			}
			
			//добавляем точки, которые обязательно должны присутвовать в сегменте
			if(arrPoints && null !== pointNeedAddIntoFace)
			{
				for(var i = 0; i < pointNeedAddIntoFace.length; i++)
				{
					arrPoints.push(pointNeedAddIntoFace[i]);
				}
			}
			
			//add to path array
			if(arrPoints && bIsAddIntoPaths)
			{
				var path = t._calculateTempFace(arrPoints);
				if(!t.paths.test2[k])
				{
					t.paths.test2[k] = [];
				}
				t.paths.test2[k].push(path);
			}
			
			if(points !== null)
			{
				prevPoints = points;
			}
		}
		
		return res;
	},
	
	_getIntersectionPlaneAndLines: function(gridPlain, lines, pointsValue)
	{
		var res = null;
		
		var clearIntersectionPoints = [];
		var segmentIntersectionPoints = [];
	
		//n --> lines --> 0 - down, 1 - up, 2 - left, 3 - right, 4 - diagonal
		for(var n = 0; n < lines.length; n++)
		{
			var convertResult = this.cChartDrawer.isIntersectionPlainAndLineSegment(gridPlain, lines[n].p1, lines[n].p2, lines[n].p111, lines[n].p222);
			if(!convertResult)
				continue;
			
			if(null === this._isEqualPoints(pointsValue, convertResult))
			{
				clearIntersectionPoints.push(convertResult);
			}
			else
			{
				if(null === this._isEqualPoints(segmentIntersectionPoints, convertResult))
				{
					segmentIntersectionPoints.push(convertResult);
				}
			}
		}
		
		if(!segmentIntersectionPoints.length)
		{
			if(clearIntersectionPoints.length === 2)//две точки, не равняющиеся ни одной точке сегмента
			{
				var p1 = clearIntersectionPoints[0];
				var p2 = clearIntersectionPoints[1];
				
				res = [p1, p2];
			}
			else if(clearIntersectionPoints.length === 1)//одна точка, не равняющиеся ни одной точке сегмента
			{
				var p1 = clearIntersectionPoints[0];
				
				res = [p1];
			}
		}
		else if(segmentIntersectionPoints.length && clearIntersectionPoints.length)
		{
			if(1 === segmentIntersectionPoints.length && 1 === clearIntersectionPoints.length)
			{
				var p1 = segmentIntersectionPoints[0];
				var p2 = clearIntersectionPoints[0];
				
				res = [p1, p2];
			}
		}
		else if(segmentIntersectionPoints.length)
		{
			if(2 === segmentIntersectionPoints.length)
			{
				var p1 = segmentIntersectionPoints[0];
				var p2 = segmentIntersectionPoints[1];
				
				res = [p1, p2];
			}
			else if(1 === segmentIntersectionPoints.length)
			{
				var p1 = segmentIntersectionPoints[0];
				
				res = [p1];
			}
		}
		
		return res;
	},
	
	_isEqualPoints: function(arr, point)
	{
		var res = null;
		
		for(var p = 0; p < arr.length; p++)
		{
			if(arr[p] && parseInt(point.x) === parseInt(arr[p].x) && parseInt(point.y) === parseInt(arr[p].y))
			{
				res = p;
				break;
			}
		}
		
		return res;
	},
	
	_getArrayWithoutRepeatePoints: function(arr)
	{
		var newArray = [];
		
		for(var i = 0; i < arr.length; i++)
		{
			if(null === this._isEqualPoints(newArray, arr[i]))
			{
				newArray.push(arr[i]);
			}
		}
		
		return newArray;
	},
	
	_calculateTempFace: function(points)
	{	
		var summX = 0;
		var summY = 0;
		for(var i = 0; i < points.length; i++)
		{
			summX += points[i].x;
			summY += points[i].y;
		}
		var x = 1/(points.length)*(summX); 
		var y = 1/(points.length)*(summY);
		
		var sortArray = [];
		var repeatePoint = [];
		var nIndividualPoints = 0;
		for(var i = 0; i < points.length; i++)
		{
			var tan = Math.atan2(points[i].x - x, points[i].y - y);
			if(!repeatePoint[tan])
			{
				sortArray[i] = {tan: tan, point: points[i]};
				repeatePoint[tan] = 1;
				nIndividualPoints++;
			}
		}
		
		var path = null
		if(nIndividualPoints > 2)
		{
			sortArray.sort (function sortArr(a, b)
			{
				return  b.tan - a.tan;
			});
		
			path = this.cChartDrawer.calculatePathFacesArray(sortArray, true);
		}
		
		return path
	},
	
	
	_getYVal: function(n, i)
	{
		var idxPoint = this.cChartDrawer.getIdxPoint(this.chartProp.series[i], n);
		var val = idxPoint ? parseFloat(idxPoint.val) : null;
		
		return val;
	},
	
	_calculatePath: function(x, y, x1, y1)
	{
		var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pxToMm = this.chartProp.pxToMM;
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		var gdLst = [];
		
		path.pathH = pathH;
		path.pathW = pathW;
		gdLst["w"] = 1;
		gdLst["h"] = 1;
		
		path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x1 / pxToMm * pathW, y1 / pxToMm * pathH);
		
		return pathId;
	},
	
	_draw: function()
	{
		for(var i = 0; i < this.paths.test.length; i++)
		{
			var pen = this.cChartSpace.chart.plotArea.catAx.compiledLn;
			//pen.w = 20000;
			
			//this.cChartDrawer.drawPath(this.paths.test[i], pen, null, false);
		}
		
		var style = AscFormat.CHART_STYLE_MANAGER.getStyleByIndex(this.cChartSpace.style);
		var base_fills = AscFormat.getArrayFillsFromBase(style.fill2, 20);    
	
		for(var i = 0; i < this.paths.test2.length; i++)
		{
			if(!this.paths.test2[i])
				continue;
				
			for(var j = 0; j < this.paths.test2[i].length; j++)
			{
				var style = this.cChartSpace.chart.plotArea.chart.compiledBandFormats[i - 1];
				var brush = style && style.spPr ? style.spPr.Fill : null;
				var pen = style && style.spPr ? style.spPr.ln : null;
				
				//линии пока делаю по цвету как и заливку
				if(!pen)
				{
					pen = AscFormat.CreatePenFromParams(brush, undefined, undefined, undefined, undefined, 0.13);
				}
				
				this.cChartDrawer.drawPath(this.paths.test2[i][j], pen, brush);
			}
		}
	}
}


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
	
	recalculate: function(chartsDrawer)
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
		
		if(this.chartProp.type == c_oChartTypes.Radar)
		{
			var y, x, path;
			
			//соответствует подписям оси категорий(OX)
			if(this.cChartSpace.chart.plotArea.valAx)
				yPoints = this.cChartSpace.chart.plotArea.valAx.yPoints;
			
			var numCache = this.chartProp.series[0].val.numRef ? this.chartProp.series[0].val.numRef.numCache.pts : this.chartProp.series[0].val.numLit.pts;
			var tempAngle = 2 * Math.PI / numCache.length;
			var xDiff = ((trueHeight / 2) / yPoints.length) / this.chartProp.pxToMM;
			var radius, xFirst, yFirst;
		}
		
		for(var i = 0; i < yPoints.length; i++)
		{
			if(this.chartProp.type == c_oChartTypes.Radar)
			{

                var pathId = this.cChartSpace.AllocPath();
                var path  = this.cChartSpace.GetPath(pathId);
				for(var k = 0; k < numCache.length; k++)
				{
					y  = i * xDiff; 
					x  = xCenter; 
					
					radius = y;
					
					y = yCenter - radius * Math.cos(k * tempAngle);
					x = x + radius * Math.sin(k * tempAngle);
					

					var pathH = this.chartProp.pathH;
					var pathW = this.chartProp.pathW;

					
					path.stroke = true;
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
				

				if(!this.paths.horisontalLines)
					this.paths.horisontalLines = [];
				this.paths.horisontalLines[i] = pathId;
				
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
		if(crossBetween == AscFormat.CROSS_BETWEEN_BETWEEN && this.cChartSpace.chart.plotArea.valAx.posX && this.chartProp.type != c_oChartTypes.HBar)
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
	
	_calculateLine: function(x, y, x1, y1)
	{
		var path;
		if(this.cChartDrawer.nDimensionCount === 3)
		{
			var view3DProp = this.cChartSpace.chart.view3D;
			var angleOx = view3DProp && view3DProp.rotX ? (- view3DProp.rotX / 360) * (Math.PI * 2) : 0;
			var angleOy = view3DProp && view3DProp.rotY ? (- view3DProp.rotY / 360) * (Math.PI * 2) : 0;
			var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
			var angleOz = 0;
			
			var rAngAx = this.cChartDrawer.processor3D.view3D.getRAngAx();
			var isVertLine = x === x1;
			
			var convertResult = this.cChartDrawer._convertAndTurnPoint(x, y, 0);
			var x1n = convertResult.x;
			var y1n = convertResult.y;
			convertResult = this.cChartDrawer._convertAndTurnPoint(x, y, perspectiveDepth);
			var x2n = convertResult.x;
			var y2n = convertResult.y;
			convertResult = this.cChartDrawer._convertAndTurnPoint(x1, y1, perspectiveDepth);
			var x3n = convertResult.x;
			var y3n = convertResult.y;
			convertResult = this.cChartDrawer._convertAndTurnPoint(x1, y1, 0);
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

        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		
		path.stroke = true;
		var pxToMm = this.chartProp.pxToMM;
		path.moveTo(x / pxToMm * pathW, y / pxToMm * pathH);
		path.lnTo(x1 / pxToMm * pathW, y1 / pxToMm * pathH);

		
		return pathId;
	},
	
	_calculate3DLine: function(x, y, x1, y1, x2, y2, x3, y3)
	{

        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		
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

		
		return pathId;
	},
	
	_calculate3DParallalepiped: function()
	{

        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		
		
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
		
		return pathId;
	},
	
	_drawHorisontalLines: function()
	{
		var pen;
		var path;
		
		for(var i = 0; i < this.paths.horisontalLines.length; i++)
		{
			if(this.chartProp.type == c_oChartTypes.HBar)
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
					if(this.chartProp.type == c_oChartTypes.HBar)
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
		
		for(var i = 0; i < this.paths.verticalLines.length; i++)
		{
			if(this.chartProp.type == c_oChartTypes.HBar)
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
					if(this.chartProp.type == c_oChartTypes.HBar)
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
	
	recalculate: function(chartsDrawer)
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
		var axisPos;
		if(this.chartProp.type == c_oChartTypes.HBar)
		{	
			axisPos = this.cChartSpace.chart.plotArea.catAx.posX;
			this.paths.axisLine = this._calculateLine( axisPos, this.chartProp.chartGutter._top / this.chartProp.pxToMM, axisPos, (this.chartProp.heightCanvas - this.chartProp.chartGutter._bottom) / this.chartProp.pxToMM);
		}
		else
		{
			//TODO сделать по аналогии с HBAR
			axisPos = this.cChartSpace.chart.plotArea.catAx.posY;
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
		
		if(this.chartProp.type == c_oChartTypes.HBar)
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
			if(this.chartProp.type == c_oChartTypes.HBar)
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
		
		var posX = this.cChartSpace.chart.plotArea.catAx.posX;

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
		
		var posY = this.cChartSpace.chart.plotArea.catAx.posY;
		var posX, posMinorX, k;
		
		var firstDiff = 0, posXtemp;
		if(this.cChartSpace.getValAxisCrossType() == AscFormat.CROSS_BETWEEN_BETWEEN && this.chartProp.type !== c_oChartTypes.Scatter)
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
			
			var z = this.cChartDrawer.processor3D.calculateZPositionCatAxis();
			
			var convertResult = this.cChartDrawer._convertAndTurnPoint(x * this.chartProp.pxToMM, y * this.chartProp.pxToMM, z);
			x = convertResult.x / this.chartProp.pxToMM;
			y = convertResult.y / this.chartProp.pxToMM;
			convertResult = this.cChartDrawer._convertAndTurnPoint(x1 * this.chartProp.pxToMM, y1 * this.chartProp.pxToMM, z);
			x1 = convertResult.x / this.chartProp.pxToMM;
			y1 = convertResult.y / this.chartProp.pxToMM;
		}

        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		

		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);

		
		return pathId;
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
	
	recalculate: function(chartsDrawer)
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
		var nullPoisition = this.cChartSpace.chart.plotArea.valAx.posX;

		if(this.chartProp.type == c_oChartTypes.HBar)
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
		
		if(this.chartProp.type == c_oChartTypes.HBar)
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
			if(this.chartProp.type == c_oChartTypes.HBar)
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
				
				var posX = this.cChartSpace.chart.plotArea.valAx.posX;

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

		var pathId = this.cChartSpace.AllocPath();
		var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);

		return pathId;
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
	
	recalculate: function(chartsDrawer)
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
		var nullPositionOx = this.chartProp.nullPositionOX;
		
		var view3DProp = this.cChartSpace.chart.view3D;
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		
		//var z = this.cChartDrawer.processor3D.calculateZPositionValAxis();
		
		var x = this.chartProp.widthCanvas - this.chartProp.chartGutter._right;
		var y = nullPositionOx;
		var convertResult = this.cChartDrawer._convertAndTurnPoint(x, y, 0);
		x = convertResult.x / this.chartProp.pxToMM;
		y = convertResult.y / this.chartProp.pxToMM;
		
		var x1 = this.chartProp.widthCanvas - this.chartProp.chartGutter._right;
		var y1 = nullPositionOx;
		convertResult = this.cChartDrawer._convertAndTurnPoint(x1, y1, perspectiveDepth);
		x1 = convertResult.x / this.chartProp.pxToMM;
		y1 = convertResult.y / this.chartProp.pxToMM;

		
		this.paths.axisLine = this._calculateLine(x, y, x1, y1);
	},
	
	_calculateTickMark : function()
	{
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		var tickmarksProps = this._getTickmarksProps();
		var widthLine = tickmarksProps.widthLine;
		
		if(widthLine !== 0)
		{
			var stepY = perspectiveDepth / this.chartProp.seriesCount;
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
        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;


		path.moveTo(x * pathW, y * pathH);
		path.lnTo(x1 * pathW, y1 * pathH);

		return pathId;
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
		
		var pxToMm = this.chartProp.pxToMM;
		var poisition = this.cChartDrawer.processor3D.calculateFloorPosition();
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		var point1, point2, point3, point4;
		
		switch(poisition)
		{
			case AscCommon.c_oChartFloorPosition.Left:
			{
				point1 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, 0);
				point2 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, maxPositionOy, 0);
				point3 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, maxPositionOy, perspectiveDepth);
				point4 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, perspectiveDepth);

				break;
			}
			case AscCommon.c_oChartFloorPosition.Right:
			{
				point1 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, nullPositionOy, 0);
				point2 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, maxPositionOy, 0);
				point3 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, maxPositionOy, perspectiveDepth);
				point4 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, nullPositionOy, perspectiveDepth);
				
				break;
			}
			case AscCommon.c_oChartFloorPosition.Bottom:
			{
				point1 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, 0);
				point2 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, nullPositionOy, perspectiveDepth);
				point3 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, nullPositionOy, perspectiveDepth);
				point4 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, nullPositionOy, 0);
			
				break;
			}
			case AscCommon.c_oChartFloorPosition.Top:
			{
				point1 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, maxPositionOy, 0);
				point2 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.chartGutter._left, maxPositionOy, perspectiveDepth);
				point3 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, maxPositionOy, perspectiveDepth);
				point4 = this.cChartDrawer._convertAndTurnPoint(this.chartProp.widthCanvas - this.chartProp.chartGutter._right, maxPositionOy, 0);
				
				break;
			}
		}
		
		if(point1)
		{
			this.paths.chartFloor = this.cChartDrawer.calculatePolygon([{x: point1.x / pxToMm, y: point1.y / pxToMm}, {x: point2.x / pxToMm, y: point2.y / pxToMm}, {x: point3.x / pxToMm, y: point3.y / pxToMm}, {x: point4.x / pxToMm, y: point4.y / pxToMm}]);
		}
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
		if(this.chartProp.type == c_oChartTypes.HBar)
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
		if(this.chartProp.type == c_oChartTypes.HBar)
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
	
	recalculate: function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this.paths = null;
		this._calculateArea();
	},
	
	_calculateArea: function()
	{
        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

		var pxToMm = this.chartProp.pxToMM;
		
		path.moveTo(0, 0);
		path.lnTo(0 / pxToMm * pathW, this.chartProp.heightCanvas / pxToMm * pathH);
		path.lnTo(this.chartProp.widthCanvas / pxToMm * pathW, this.chartProp.heightCanvas / pxToMm * pathH);
		path.lnTo(this.chartProp.widthCanvas / pxToMm * pathW, 0 / pxToMm * pathH);
		path.lnTo(0, 0);

		this.paths = pathId;
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
	
	recalculate: function(chartsDrawer)
	{
		this.chartProp = chartsDrawer.calcProp;
		this.cChartSpace = chartsDrawer.cChartSpace;
		this.cChartDrawer = chartsDrawer;
		
		this.paths = null;
		
		if(this.cChartDrawer.nDimensionCount === 3 && this.chartProp.type !== c_oChartTypes.Pie)
			this._calculateArea3D();
		else
			this._calculateArea();
	},
	
	_calculateArea: function()
	{
        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;

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
		path.lnTo(leftMargin / pxToMm * pathW, (heightGraph - bottomMargin) / pxToMm * pathH);
		

		this.paths = pathId;
	},
	
	_calculateArea3D: function()
	{
        var pathId = this.cChartSpace.AllocPath();
        var path  = this.cChartSpace.GetPath(pathId);
		
		var pathH = this.chartProp.pathH;
		var pathW = this.chartProp.pathW;
		
		var pxToMm = this.chartProp.pxToMM;
		
		var widthGraph = this.chartProp.widthCanvas;
		var heightGraph = this.chartProp.heightCanvas;
		var leftMargin = this.chartProp.chartGutter._left;
		var rightMargin = this.chartProp.chartGutter._right;
		var topMargin = this.chartProp.chartGutter._top;
		var bottomMargin = this.chartProp.chartGutter._bottom;
		
		var view3DProp = this.cChartSpace.chart.view3D;
		var perspectiveDepth = this.cChartDrawer.processor3D.depthPerspective;
		
		var convertResult = this.cChartDrawer._convertAndTurnPoint(leftMargin, heightGraph - bottomMargin, perspectiveDepth);
		var x1n = convertResult.x;
		var y1n = convertResult.y;
		convertResult = this.cChartDrawer._convertAndTurnPoint(widthGraph - rightMargin, heightGraph - bottomMargin, perspectiveDepth);
		var x2n = convertResult.x;
		var y2n = convertResult.y;
		convertResult = this.cChartDrawer._convertAndTurnPoint(widthGraph - rightMargin, topMargin, perspectiveDepth);
		var x3n = convertResult.x;
		var y3n = convertResult.y;
		convertResult = this.cChartDrawer._convertAndTurnPoint(leftMargin, topMargin, perspectiveDepth);
		var x4n = convertResult.x;
		var y4n = convertResult.y;
		convertResult = this.cChartDrawer._convertAndTurnPoint(leftMargin, heightGraph - bottomMargin, perspectiveDepth);
		var x5n = convertResult.x;
		var y5n = convertResult.y;

		
		path.moveTo(x1n / pxToMm * pathW, y1n / pxToMm * pathH);
		path.lnTo(x2n  / pxToMm * pathW, y2n / pxToMm * pathH);
		path.lnTo(x3n / pxToMm * pathW, y3n / pxToMm * pathH);
		path.lnTo(x4n / pxToMm * pathW, y4n / pxToMm * pathH);
		path.moveTo(x5n / pxToMm * pathW, y5n / pxToMm * pathH);

		this.paths = pathId;
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

//sort parallalepiped faces
function CSortFaces(cChartDrawer, centralViewPoint)
{
	this.cChartDrawer = cChartDrawer;
	this.chartProp = cChartDrawer.calcProp;
	this.centralViewPoint = null;
	this._initProperties(centralViewPoint)
}

CSortFaces.prototype =
{
	constructor: CSortFaces,
	
	_initProperties: function(centralViewPoint)
	{
		if(!centralViewPoint)
		{
			var top = this.chartProp.chartGutter._top;
			var bottom = this.chartProp.chartGutter._bottom;
			var left = this.chartProp.chartGutter._left;
			var right = this.chartProp.chartGutter._right;
			
			var widthCanvas = this.chartProp.widthCanvas;
			var heightCanvas = this.chartProp.heightCanvas;
			var heightChart = heightCanvas - top - bottom;
			var widthChart = widthCanvas - left - right;
			
			var centerChartY = top + heightChart / 2;
			var centerChartX = left + widthChart / 2;
			
			var diffX = centerChartX;
			var diffY = centerChartY;
			var diffZ = -1 / this.cChartDrawer.processor3D.rPerspective;
			//TODO протестировать на bar и затем сделать для всех перспективных диаграмм данный сдвиг
			if(!this.cChartDrawer.processor3D.view3D.getRAngAx() && this.chartProp.type === AscFormat.c_oChartTypes.Bar)
			{	
				diffX -= this.cChartDrawer.processor3D.cameraDiffX;
				diffY -= this.cChartDrawer.processor3D.cameraDiffY;
				diffZ -= this.cChartDrawer.processor3D.cameraDiffZ;
			}
			
			//TODO пересмотреть правку!
			if(diffZ > 0 && this.chartProp.type === AscFormat.c_oChartTypes.Bar && this.cChartDrawer.processor3D.view3D.getRAngAx() && (this.chartProp.subType == "stackedPer" || this.chartProp.subType == "stacked"))
			{
				diffZ -= 500;
			}
			
			this.centralViewPoint = {x: diffX, y: diffY, z: diffZ};
		}
		else
		{
			this.centralViewPoint = centralViewPoint;
		}
	},
	
	sortParallelepipeds: function(parallelepipeds)
	{
		var intersectionsParallelepipeds = this._getIntersectionsParallelepipeds(parallelepipeds);
		var revIntersections = intersectionsParallelepipeds.reverseIntersections;
		var countIntersection = intersectionsParallelepipeds.countIntersection;
		
		var startIndexes = [];
		for(var i = 0; i < countIntersection.length; i++)
		{
			if(countIntersection[i] === 0)
			{
				startIndexes.push({index: parseInt(i)});
			}
		}
		
		if(startIndexes.length === 0)
		{
			//TODO сделано для графиков типа stacked, когда пересечения найдены всех параллалеп.
			var minZ = parallelepipeds[0].z;
			var minZArray = [];
			for(var i = 0; i < parallelepipeds.length; i++)
			{
				if(parallelepipeds[i].z < minZ)
				{
					minZ = parallelepipeds[i].z;
					minZArray = [];
				}
				
				if(minZ === parallelepipeds[i].z)
				{
					minZArray.push({index: parseInt(i)});
				}
			}
			
			startIndexes = minZArray.reverse();
		}
		
		var g = revIntersections;
		var color = {}; // цвет вершины (0, 1, или 2)
		var time_in = {}, time_out = {}; // "времена" захода и выхода из вершины
		var dfs_timer = 0;

		var dfs = function(v) 
		{
			time_in[v] = dfs_timer++;
			color[v] = 1;
			
			for (var i in g[v])
			{
				if (!color[i])
				{
					dfs (i);
				}
			}
				
			color[v] = 2;
			time_out[v] = dfs_timer++;
		};
		var getMax = function()
		{
			var max = 0;
			var res = null;
			for(var i in time_out)
			{
				if(!addIndexes[i] && time_out[i] > max)
				{
					max = time_out[i];
					res = i;
				}
			}
			return res;
		};
		
		for(var i = 0; i < startIndexes.length; i++)
		{
			dfs(startIndexes[i].index);
		}
		
		var addIndexes = {};
		var res = [];
		while(true)
		{
			var index = getMax();
			
			if(null === index)
			{
				break;
			}
			
			res.push({nextIndex: index});
			addIndexes[index] = 1;
		}
		
		return res.reverse();
	},
	
	_getIntersectionsParallelepipeds: function(parallelepipeds)
	{
		//TODO нужно по максимуму оптимизировать, при большом количестве значений работает медленно
		var usuallyIntersect = {};
		var usuallyIntersectRev = {};
		
		var intersections = [];
		var reverseIntersections = [];
		var countIntersection = [];
		for(var i = 0; i < parallelepipeds.length; i++)
		{
			//из каждой точки данного параллалепипеда строим прямые до точки наблюдателя
			var fromParallalepiped = parallelepipeds[i];
			countIntersection[i] = 0;
			
			for(var m = 0; m < parallelepipeds.length; m++)
			{
				if(m === i || usuallyIntersect[i] === m || usuallyIntersectRev[i] === m)
				{
					continue;
				}
				
				for(var l = 0; l < fromParallalepiped.arrPoints.length; l++)
				{
					//перебираем точки параллалепипеда FROM
					var point = fromParallalepiped.arrPoints[l];
					
					//перебираем грани параллалепипеда TO и проверяем на пересечения с прямыми из параллалепипеда FROM
					var toParallalepiped = parallelepipeds[m];
					for(var n = 0; n < toParallalepiped.faces.length; n++)
					{
						var toVerge = toParallalepiped.faces[n];
						var lineEqucation = this.cChartDrawer.getLineEquation(point, this.centralViewPoint);
						var intersection = this._isIntersectionFaceAndLine(toVerge, lineEqucation, point);
						if(intersection)
						{
							usuallyIntersect[i] = m;
							usuallyIntersectRev[m] = i;
							
							if(!intersections[i])
							{
								intersections[i] = [];
							}
							
							if(!reverseIntersections[m])
							{
								reverseIntersections[m] = [];
							}
							
							countIntersection[i]++;
							
							intersections[i][m] = 1;
							reverseIntersections[m][i] = 1;
							
							l = point.length;
							//console.log("fromParallalepiped: " + i + " toParallalepiped " + m + " x: " + intersection.x  + " y: " + intersection.y  + " z: " + intersection.z);
							
							break;
						}
					}			
				}
			}
		}
		
		return {intersections: intersections, reverseIntersections: reverseIntersections, countIntersection: countIntersection};
	},
	
	sortFaces: function(faces)
	{
		var t = this;
		
		var iterCount = 0;
		var newArr = [];
		var lastFaces = faces;
		
		while(lastFaces.length !== 0)
		{
			var firstFaces1 = [], lastFaces1 = [];
			t._getFirstLastFaces(lastFaces, firstFaces1, lastFaces1);
			newArr = firstFaces1.concat(newArr);
			lastFaces = lastFaces1;
			iterCount++;
			
			if(iterCount > 50)
			{
				newArr = lastFaces.concat(newArr);
				break;
			}
		}
		
		return newArr;
	},
	
	_getFirstLastFaces: function(sortZIndexPaths, first, last)
	{
		//перебираем все грани
		for(var i = 0; i < all.length; i++)
		{
			var plainVerge = all[i];
			
			var isFirstVerge = this._isIntersectionFacesPointLines(plainVerge, i, all);
			//push into array
			if(!isFirstVerge)
			{
				first.push(plainVerge);
			}
			else
			{
				last.push(plainVerge);
			}
		}
	},
	
	//смотрим есть ли пересечения точек, выходящих из вершин данной грани, с другими гранями
	_isIntersectionFacesPointLines: function(plainVerge, i, sortZIndexPaths)
	{
		var res = false;
		var t = this;

		for(var j = 0; j < plainVerge.points.length; j++)
		{
			var pointFromVerge = plainVerge.points[j];
			var lineEqucation = t.cChartDrawer.getLineEquation(pointFromVerge, this.centralViewPoint);
			
			//пересечение грани и прямой
			if(t._isIntersectionFacesAndLine(lineEqucation, pointFromVerge, i, j, sortZIndexPaths))
			{
				res = true;
				break;
			}
		}
		
		return res;
	},
	
	//пересечение прямой с другими гранями
	_isIntersectionFacesAndLine: function(lineEqucation, pointFromVerge, i, j, sortZIndexPaths)
	{
		var res = false;
		
		for(var k = 0; k < sortZIndexPaths.length; k++)
		{
			if(k === i)
				continue;

			if(this._isIntersectionFaceAndLine(sortZIndexPaths[k], lineEqucation, pointFromVerge, i, j, k))
			{
				res = true;
				break;
			}
		}
		
		return res;
	},
	
	//пересечение прямой гранью
	_isIntersectionFaceAndLine: function(plain, lineEquation, pointFromVerge)
	{
		var res = false;
		var t = this;
		
		//get intersection
		var nIntersectionPlainAndLine = t.cChartDrawer.isIntersectionPlainAndLine(plain.plainEquation ,lineEquation);
		
		if(null === nIntersectionPlainAndLine)
		{
			return res;
		}
		
		var iSX = nIntersectionPlainAndLine.x;
		var iSY = nIntersectionPlainAndLine.y;
		var iSZ = nIntersectionPlainAndLine.z;
		
		if(Math.round(iSZ * 1000) / 1000 < Math.round(pointFromVerge.z * 1000) / 1000)
		{
			var minMaxpoints = t.cChartDrawer.getMinMaxPoints(plain.points);
			var minX = minMaxpoints.minX, maxX = minMaxpoints.maxX, minY = minMaxpoints.minY, maxY = minMaxpoints.maxY, minZ = minMaxpoints.minZ, maxZ = minMaxpoints.maxZ;
			
			var isBeetwenX = t._isBetweenPoint(iSX, minX, maxX);
			var isBeetwenY = t._isBetweenPoint(iSY, minY, maxY);
			var isBeetwenZ = t._isBetweenPoint(iSZ, minZ, maxZ);
			
			if(isBeetwenX && isBeetwenY && isBeetwenZ)
			{
				var point0 = plain.points2[0];
				var point1 = plain.points2[1];
				var point2 = plain.points2[2];
				var point3 = plain.points2[3];
				
				var projectIntersection = nIntersectionPlainAndLine;
				if(!this.cChartDrawer.processor3D.view3D.getRAngAx())
				{
					projectIntersection = t.cChartDrawer._convertAndTurnPoint(nIntersectionPlainAndLine.x, nIntersectionPlainAndLine.y, nIntersectionPlainAndLine.z, true, true);
				}
				
				var areaQuadrilateral = plain.plainArea;
				var areaTriangle1 = t.cChartDrawer.getAreaTriangle(point0, projectIntersection, point1);
				var areaTriangle2 = t.cChartDrawer.getAreaTriangle(point1, projectIntersection, point2);
				var areaTriangle3 = t.cChartDrawer.getAreaTriangle(point2, projectIntersection, point3);
				var areaTriangle4 = t.cChartDrawer.getAreaTriangle(point3, projectIntersection, point0);
				
				if(parseInt(areaQuadrilateral) === parseInt(areaTriangle1 + areaTriangle2 + areaTriangle3 + areaTriangle4))
				{
					//var pointFromVergeProject = t.cChartDrawer._convertAndTurnPoint(pointFromVerge.x, pointFromVerge.y, pointFromVerge.z, true, true);
					//console.log("x: " + projectIntersection.x + " ;y: " + projectIntersection.y + " ;fromX:" + pointFromVergeProject.x + " ;fromY:" + pointFromVergeProject.y);
					
					res = nIntersectionPlainAndLine;
				}
			}
		}
		
		return res;
	},
	
	_isBetweenPoint: function(point, start, end)
	{
		//TODO округление пересмотреть
		var res = false;
		point = Math.round(point * 100) / 100;
		start = Math.round(start * 100) / 100;
		end = Math.round(end * 100) / 100;
		
		if(point >= start && point <= end)
		{
			res = true;
		}
		
		return res;
	},
	
	_isEqualPoints: function(point1, point2)
	{
		//TODO округление пересмотреть
		var res = false;
		
		if(parseInt(point1.x) === parseInt(point2.x) && parseInt(point1.y) === parseInt(point2.y) && parseInt(point1.y) === parseInt(point2.y))
		{
			res = true;
		}
		
		return res;
	}
};

	//----------------------------------------------------------export----------------------------------------------------
	window['AscFormat'] = window['AscFormat'] || {};
	window['AscFormat'].CChartsDrawer = CChartsDrawer;
	window["AscFormat"].c_oChartTypes = c_oChartTypes;
})(window);
