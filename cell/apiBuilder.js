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

(function (window, builder) {
	/**
	 * @global
	 * @class
	 * @name Api
	 */
	var Api = window["Asc"]["spreadsheet_api"];

	/**
	 * Class representing a sheet.
	 * @constructor
	 */
	function ApiWorksheet(worksheet, worksheetView) {
		this.worksheet = worksheet;
		this.worksheetView = worksheetView;
	}

	/**
	 * Class representing a range.
	 * @constructor
	 */
	function ApiRange(range) {
		this.range = range;
	}


	/**
	 * Class representing a graphical object.
	 * @constructor
	 */
	function ApiDrawing(Drawing) {
		this.Drawing = Drawing;
	}


	/**
	 * This type specifies the types, create charts
	 * @typedef {("bar" | "barStacked" | "barStackedPercent" | "bar3D" | "barStacked3D" | "barStackedPercent3D" | "barStackedPercent3DPerspective" | "horizontalBar" | "horizontalBarStacked" | "horizontalBarStackedPercent" | "horizontalBar3D" | "horizontalBarStacked3D" | "horizontalBarStackedPercent3D" | "lineNormal" | "lineStacked" | "lineStackedPercent" | "line3D" | "pie" | "pie3D" | "doughnut" | "scatter" | "stock")} ChartType
	 */

	/**
	 * Class representing a Chart.
	 * @constructor
	 *
	 */
	function ApiChart(Chart) {
		ApiChart.superclass.constructor.call(this, Chart.parent);
		this.Chart = Chart;
	}

	AscCommon.extendClass(ApiChart, ApiDrawing);

	/**
	 * Returns an object that represents the active sheet
	 * @memberof Api
	 * @returns {ApiWorksheet}
	 */
	Api.prototype.GetActiveSheet = function () {
		var index = this.wbModel.getActive();
		return new ApiWorksheet(this.wbModel.getWorksheet(index), this.wb.getWorksheet(index));
	};

	/**
	 * Returns an object that represents the active cell
	 * @memberof ApiWorksheet
	 * @returns {ApiRange}
	 */
	ApiWorksheet.prototype.GetActiveCell = function () {
		var ar = this.worksheetView.activeRange;
		return new ApiRange(this.worksheet.getCell3(ar.startRow, ar.startCol));
	};

	/**
	 * Set sheet name
	 * @memberof ApiWorksheet
	 * @param {string} name
	 */
	ApiWorksheet.prototype.SetName = function (name) {
		this.worksheet.setName(name);
	};

	/**
	 * Returns an object that represents the range
	 * @memberof ApiWorksheet
	 * @param {string} sRange
	 * @returns {ApiRange}
	 */
	ApiWorksheet.prototype.GetRange = function (sRange) {
		return new ApiRange(this.worksheet.getRange2(sRange));
	};

	/**
	 * Returns an object that represents the range
	 * @memberof ApiWorksheet
	 * @param {Number} row
	 * @param {Number} col
	 * @returns {ApiRange}
	 */
	ApiWorksheet.prototype.GetRangeByNumber = function (row, col) {
		return new ApiRange(this.worksheet.getCell3(row, col));
	};

	/**
	 * Format as table
	 * @memberof ApiWorksheet
	 * @param {string} sRange
	 */
	ApiWorksheet.prototype.FormatAsTable = function (sRange) {
		this.worksheet.autoFilters.addAutoFilter('TableStyleLight9', AscCommonExcel.g_oRangeCache.getAscRange(sRange));
	};

	/**
	 * Set column width
	 * @memberof ApiWorksheet
	 * @param {number} column
	 * @param {number} width
	 */
	ApiWorksheet.prototype.SetColumnWidth = function (column, width) {
		this.worksheet.setColWidth(width, column, column);
	};

	/**
	 * Set column width
	 * @memberof ApiWorksheet
	 * @param {string} sDataRange
	 * @param {bool} bInRows
	 * @param {ChartType} sType
	 * @param {number} nStyleIndex
	 * @param {number} nFromCol
	 * @param {number} nFromRow
	 * @param {number} nToCol
	 * @param {number} nToRow
     * @returns {ApiCahrt}
	 */
	ApiWorksheet.prototype.AddChart =
		function (sDataRange, bInRows, sType, nStyleIndex, nFromCol, nFromRow, nToCol, nToRow) {

			History.Create_NewPoint();
			var settings = new AscCommon.asc_ChartSettings();
			switch (sType) {
				case "bar" :
				{
					settings.type = Asc.c_oAscChartTypeSettings.barNormal;
					break;
				}
				case "barStacked":
				{
					settings.type = Asc.c_oAscChartTypeSettings.barStacked;
					break;
				}
				case "barStackedPercent":
				{
					settings.type = Asc.c_oAscChartTypeSettings.barStackedPer;
					break;
				}
				case "bar3D":
				{
					settings.type = Asc.c_oAscChartTypeSettings.barNormal3d;
					break;
				}
				case "barStacked3D":
				{
					settings.type = Asc.c_oAscChartTypeSettings.barStacked3d;
					break;
				}
				case "barStackedPercent3D":
				{
					settings.type = Asc.c_oAscChartTypeSettings.barStackedPer3d;
					break;
				}
				case "barStackedPercent3DPerspective":
				{
					settings.type = Asc.c_oAscChartTypeSettings.barNormal3dPerspective;
					break;
				}
				case "horizontalBar":
				{
					settings.type = Asc.c_oAscChartTypeSettings.hBarNormal;
					break;
				}
				case "horizontalBarStacked":
				{
					settings.type = Asc.c_oAscChartTypeSettings.hBarStacked;
					break;
				}
				case "horizontalBarStackedPercent":
				{
					settings.type = Asc.c_oAscChartTypeSettings.hBarStackedPer;
					break;
				}
				case "horizontalBar3D":
				{
					settings.type = Asc.c_oAscChartTypeSettings.hBarNormal3d;
					break;
				}
				case "horizontalBarStacked3D":
				{
					settings.type = Asc.c_oAscChartTypeSettings.hBarStacked3d;
					break;
				}
				case "horizontalBarStackedPercent3D":
				{
					settings.type = Asc.c_oAscChartTypeSettings.hBarStackedPer3d;
					break;
				}
				case "lineNormal":
				{
					settings.type = Asc.c_oAscChartTypeSettings.lineNormal;
					break;
				}
				case "lineStacked":
				{
					settings.type = Asc.c_oAscChartTypeSettings.lineStacked;
					break;
				}
				case "lineStackedPercent":
				{
					settings.type = Asc.c_oAscChartTypeSettings.lineStackedPer;
					break;
				}
				case "line3D":
				{
					settings.type = Asc.c_oAscChartTypeSettings.line3d;
					break;
				}
				case "pie":
				{
					settings.type = Asc.c_oAscChartTypeSettings.pie;
					break;
				}
				case "pie3D":
				{
					settings.type = Asc.c_oAscChartTypeSettings.pie3d;
					break;
				}
				case "doughnut":
				{
					settings.type = Asc.c_oAscChartTypeSettings.doughnut;
					break;
				}
				case "scatter":
				{
					settings.type = Asc.c_oAscChartTypeSettings.scatter;
					break;
				}
				case "stock":
				{
					settings.type = Asc.c_oAscChartTypeSettings.stock;
					break;
				}
			}
			settings.style = nStyleIndex;
			settings.inColumns = !bInRows;
			settings.range = sDataRange;
			var oChart = AscFormat.DrawingObjectsController.prototype.getChartSpace(this.worksheet, settings);
			oChart.setWorksheet(this.worksheet);
			oChart.setBFromSerialize(true);
			oChart.addToDrawingObjects();
			oChart.setDrawingBaseCoords(nFromCol, 0, nFromRow, 0, nToCol, 0, nToRow, 0, 0, 0, 0, 0);
			if (AscFormat.isRealNumber(nStyleIndex)) {
				oChart.setStyle(nStyleIndex);
			}
            return new ApiChart(oChart);
		};

	/**
	 * Get cell row
	 * @memberof ApiRange
	 * @returns {Number}
	 */
	ApiRange.prototype.GetRow = function () {
		return this.range.bbox.r1;
	};
	/**
	 * Get cell column
	 * @memberof ApiRange
	 * @returns {Number}
	 */
	ApiRange.prototype.GetCol = function () {
		return this.range.bbox.c1;
	};

	/**
	 * Set cell value
	 * @memberof ApiRange
	 * @param {string} val
	 */
	ApiRange.prototype.SetValue = function (val) {
		this.range.setValue(val);
	};

	/**
	 * Set text color in the rgb format.
	 * @param {byte} r
	 * @param {byte} g
	 * @param {byte} b
	 */
	ApiRange.prototype.SetFontColor = function (r, g, b) {
		this.range.setFontcolor(new AscCommonExcel.RgbColor((r << 16) + (g << 8) + b));
	};

	/**
	 * Set font size
	 * @param {number} size
	 */
	ApiRange.prototype.SetFontSize = function (size) {
		this.range.setFontsize(size);
	};

	/**
	 * Set font name
	 * @param {string} name
	 */
	ApiRange.prototype.SetFontName = function (name) {
		this.range.setFontname(name);
	};

	/**
	 * Set align vertical
	 * @param {'center' | 'bottom' | 'top'} value
	 */
	ApiRange.prototype.SetAlignVertical = function (value) {
		this.range.setAlignVertical(value);
	};

	/**
	 * Set align horizontal
	 * @param {'left' | 'right' | 'center' | 'justify'} value
	 */
	ApiRange.prototype.SetAlignHorizontal = function (value) {
		this.range.setAlignHorizontal(value);
	};




    ApiChart.prototype.CreateTitle = function(sTitle, nFontSize){
        if(!this.Chart)
        {
            return null;
        }
        if(typeof sTitle === "string" && sTitle.length > 0){
            var oTitle = new AscFormat.CTitle();
            oTitle.setTx(new AscFormat.CChartText());
            oTitle.setOverlay(false);
            var oTextBody = AscFormat.CreateTextBodyFromString(sTitle, this.Chart.getDrawingDocument(), oTitle.tx);
            if(AscFormat.isRealNumber(nFontSize)){
                oTextBody.content.Set_ApplyToAll(true);
                oTextBody.content.Paragraph_Add(new ParaTextPr({ FontSize : nFontSize}));
                oTextBody.content.Set_ApplyToAll(false);
            }
            oTitle.tx.setRich(oTextBody);
            return oTitle;
        }
        return null;
    };


    /**
     *  Specifies a chart title
     *  @param {string} sTitle
     *  @param {number} nFontSize
     */
    ApiChart.prototype.SetTitle = function (sTitle, nFontSize)
    {
        if(this.Chart)
        {
            this.Chart.chart.setTitle(this.CreateTitle(sTitle, nFontSize));
        }
    };

    /**
     *  Specifies a horizontal axis title
     *  @param {string} sTitle
     *  @param {number} nFontSize
     * */
    ApiChart.prototype.SetHorAxisTitle = function (sTitle, nFontSize)
    {
        if(this.Chart)
        {
            var horAxis = this.Chart.chart.plotArea.getHorizontalAxis();
            if(horAxis)
            {
                horAxis.setTitle(this.CreateTitle(sTitle, nFontSize));
            }
        }
    };

    /**
     *  Specifies a vertical axis title
     *  @param {string} sTitle
     *  @param {number} nFontSize
     * */
    ApiChart.prototype.SetVerAxisTitle = function (sTitle, nFontSize)
    {
        if(this.Chart)
        {
            var verAxis = this.Chart.chart.plotArea.getVerticalAxis();
            if(verAxis)
            {
                if(typeof sTitle === "string" && sTitle.length > 0)
                {
                    verAxis.setTitle(this.CreateTitle(sTitle, nFontSize));
                    if(verAxis.title){
                        var _body_pr = new AscFormat.CBodyPr();
                        _body_pr.reset();
                        if(!verAxis.title.txPr)
                        {
                            verAxis.title.setTxPr(AscFormat.CreateTextBodyFromString("", this.Chart.getDrawingDocument(), verAxis.title));
                        }
                        var _text_body =  verAxis.title.txPr;
                        _text_body.setBodyPr(_body_pr);
                        verAxis.title.setOverlay(false);
                    }
                }
                else
                {
                    verAxis.setTitle(null);
                }
            }
        }
    };


    /**
     * Specifies a legend position
     * @param {"left" | "top" | "right" | "bottom" | "none"} sLegendPos
     * */
    ApiChart.prototype.SetLegendPos = function(sLegendPos)
    {
        if(this.Chart && this.Chart.chart)
        {
            if(sLegendPos === "none")
            {
                if(this.Chart.chart.legend)
                {
                    this.Chart.chart.setLegend(null);
                }
            }
            else
            {
                var nLegendPos = null;
                switch(sLegendPos)
                {
                    case "left":
                    {
                        nLegendPos = Asc.c_oAscChartLegendShowSettings.left;
                        break;
                    }
                    case "top":
                    {
                        nLegendPos = Asc.c_oAscChartLegendShowSettings.top;
                        break;
                    }
                    case "right":
                    {
                        nLegendPos = Asc.c_oAscChartLegendShowSettings.right;
                        break;
                    }
                    case "bottom":
                    {
                        nLegendPos = Asc.c_oAscChartLegendShowSettings.bottom;
                        break;
                    }
                }
                if(null !== nLegendPos)
                {
                    if(!this.Chart.chart.legend)
                    {
                        this.Chart.chart.setLegend(new AscFormat.CLegend());
                    }
                    if(this.Chart.chart.legend.legendPos !== nLegendPos)
                        this.Chart.chart.legend.setLegendPos(nLegendPos);
                    if(this.Chart.chart.legend.overlay !== false)
                    {
                        this.Chart.chart.legend.setOverlay(false);
                    }
                }
            }
        }
    };

    /**
     * Spicifies a show options for data labels
     * @param {boolean} bShowSerName
     * @param {boolean} bShowCatName
     * @param {boolean} bShowVal
     * */
    ApiChart.prototype.SetShowDataLabels = function(bShowSerName, bShowCatName, bShowVal)
    {
        if(this.Chart && this.Chart.chart && this.Chart.chart.plotArea && this.Chart.chart.plotArea.charts[0])
        {
            var oChart = this.Chart.chart.plotArea.charts[0];
            if(false == bShowSerName && false == bShowCatName && false == bShowVal)
            {
                if(oChart.dLbls)
                {
                    oChart.setDLbls(null);
                }
            }
            if(!oChart.dLbls)
            {
                oChart.setDLbls(new AscFormat.CDLbls());
            }
            oChart.dLbls.setSeparator(",");
            oChart.dLbls.setShowSerName(true == bShowSerName);
            oChart.dLbls.setShowCatName(true == bShowCatName);
            oChart.dLbls.setShowVal(true == bShowVal);
            oChart.dLbls.setShowLegendKey(false);
            //oChart.dLbls.setShowPercent(false);
            oChart.dLbls.setShowBubbleSize(false);
        }
    };
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Export
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	Api.prototype["GetActiveSheet"] = Api.prototype.GetActiveSheet;

	ApiWorksheet.prototype["GetActiveCell"] = ApiWorksheet.prototype.GetActiveCell;
	ApiWorksheet.prototype["SetName"] = ApiWorksheet.prototype.SetName;
	ApiWorksheet.prototype["GetRange"] = ApiWorksheet.prototype.GetRange;
	ApiWorksheet.prototype["GetRangeByNumber"] = ApiWorksheet.prototype.GetRangeByNumber;
	ApiWorksheet.prototype["FormatAsTable"] = ApiWorksheet.prototype.FormatAsTable;
	ApiWorksheet.prototype["SetColumnWidth"] = ApiWorksheet.prototype.SetColumnWidth;
	ApiWorksheet.prototype["AddChart"] = ApiWorksheet.prototype.AddChart;

	ApiRange.prototype["GetRow"] = ApiRange.prototype.GetRow;
	ApiRange.prototype["GetCol"] = ApiRange.prototype.GetCol;
	ApiRange.prototype["SetValue"] = ApiRange.prototype.SetValue;
	ApiRange.prototype["SetFontColor"] = ApiRange.prototype.SetFontColor;
	ApiRange.prototype["SetFontSize"] = ApiRange.prototype.SetFontSize;
	ApiRange.prototype["SetFontName"] = ApiRange.prototype.SetFontName;
	ApiRange.prototype["SetAlignVertical"] = ApiRange.prototype.SetAlignVertical;
	ApiRange.prototype["SetAlignHorizontal"] = ApiRange.prototype.SetAlignHorizontal;

    ApiChart.prototype["SetTitle"] = ApiChart.prototype.SetTitle;
    ApiChart.prototype["SetHorAxisTitle"] = ApiChart.prototype.SetHorAxisTitle;
    ApiChart.prototype["SetVerAxisTitle"] = ApiChart.prototype.SetVerAxisTitle;
    ApiChart.prototype["SetLegendPos"] = ApiChart.prototype.SetLegendPos;
    ApiChart.prototype["SetShowDataLabels"] = ApiChart.prototype.SetShowDataLabels;
}(window, null));
