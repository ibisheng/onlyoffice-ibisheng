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
	function ApiDrawing(Drawing)
	{
		this.Drawing = Drawing;
	}

	/**
	 * Class representing a shape.
	 * @constructor
	 */
	function ApiShape(oShape){
		ApiShape.superclass.constructor.call(this, oShape);
		this.Shape = oShape;
	}
	AscCommon.extendClass(ApiShape, ApiDrawing);

	/**
	 * Class representing a image.
	 * @constructor
	 */
	function ApiImage(oImage){
		ApiImage.superclass.constructor.call(this, oImage);
	}
	AscCommon.extendClass(ApiImage, ApiDrawing);

	/**
	 * Class representing a chart.
	 * @constructor
	 */
	function ApiChart(oChart){
		ApiChart.superclass.constructor.call(this, oChart);
		this.Chart = oChart;
	}
	AscCommon.extendClass(ApiChart, ApiDrawing);

	/**
	 * Returns an object that represents the active sheet
	 * @memberof Api
	 * @returns {ApiWorksheet}
	 */
	Api.prototype.GetActiveSheet = function () {
		var index = this.wbModel.getActive();
		return new ApiWorksheet(this.wbModel.getWorksheet(index), this.wb.getWorksheet(index, true));
	};

	Api.prototype.CreateNewHistoryPoint = function(){
		History.Create_NewPoint();
	};

	/**
	 * Returns an object that represents the active cell
	 * @memberof ApiWorksheet
	 * @returns {ApiRange}
	 */
	ApiWorksheet.prototype.GetActiveCell = function () {
		var cell = this.worksheetView.selectionRange.cell;
		return new ApiRange(this.worksheet.getCell3(cell.row, cell.col));
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
	 * @param {EMU} nExtX
	 * @param {EMU} nExtY
	 * @param {number} nFromCol
	 * @param {EMU} nColOffset
	 * @param {number} nFromRow
	 * @param {EMU} nRowOffset
     * @returns {ApiChart}
	 */
	ApiWorksheet.prototype.AddChart =
		function (sDataRange, bInRows, sType, nStyleIndex, nExtX, nExtY, nFromCol, nColOffset,  nFromRow, nRowOffset) {
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
				case "area":
				{
					settings.type = Asc.c_oAscChartTypeSettings.areaNormal;
					break;
				}
				case "areaStacked":
				{
					settings.type = Asc.c_oAscChartTypeSettings.areaStacked;
					break;
				}
				case "areaStackedPercent":
				{
					settings.type = Asc.c_oAscChartTypeSettings.areaStackedPer;
					break;
				}
			}
			settings.style = nStyleIndex;
			settings.inColumns = !bInRows;
			settings.range = sDataRange;
			var oChart = AscFormat.DrawingObjectsController.prototype.getChartSpace(this.worksheet, settings);
			if(arguments.length === 8){//support old variant
				oChart.setBDeleted(false);
				oChart.setWorksheet(this.worksheet);
				oChart.setBFromSerialize(true);
				oChart.addToDrawingObjects();
				oChart.setDrawingBaseCoords(arguments[4], 0, arguments[5], 0, arguments[6], 0, arguments[7], 0, 0, 0, 0, 0);
			}
			else{
				private_SetCoords(oChart, this.worksheet, nExtX, nExtY, nFromCol, nColOffset,  nFromRow, nRowOffset);
			}
			if (AscFormat.isRealNumber(nStyleIndex)) {
				oChart.setStyle(nStyleIndex);
			}
            return new ApiChart(oChart);
		};


	/**
	 * Create a shape.
	 * @memberof Api
	 * @param {ShapeType} [sType="rect"]
	 * @param {EMU} nWidth
	 * @param {EMU} nHeight
	 * @param {ApiFill} oFill
	 * @param {ApiStroke} oStroke
	 * @param {number} nFromCol
	 * @param {EMU} nColOffset
	 * @param {number} nFromRow
	 * @param {EMU} nRowOffset
	 * @returns {ApiShape}
	 * */
	ApiWorksheet.prototype.AddShape = function(sType, nWidth, nHeight, oFill, oStroke, nFromCol, nColOffset, nFromRow, nRowOffset){
		var oShape = AscFormat.builder_CreateShape(sType, nWidth/36000, nHeight/36000, oFill.UniFill, oStroke.Ln, null, this.worksheet.workbook.theme, this.worksheet.DrawingDocument, false);
		private_SetCoords(oShape, this.worksheet, nWidth, nHeight, nFromCol, nColOffset,  nFromRow, nRowOffset);
		return new ApiShape(oShape);
	};


	/**
	 * Create a image.
	 * @memberof Api
	 * @param {string} sImageSrc
	 * @param {EMU} nWidth
	 * @param {EMU} nHeight
	 * @param {number} nFromCol
	 * @param {EMU} nColOffset
	 * @param {number} nFromRow
	 * @param {EMU} nRowOffset
	 * @returns {ApiImage}
	 */
	ApiWorksheet.prototype.AddImage = function(sImageSrc, nWidth, nHeight, nFromCol, nColOffset, nFromRow, nRowOffset){
		var oImage = AscFormat.DrawingObjectsController.prototype.createImage(sImageSrc, 0, 0, nWidth/36000, nHeight/36000);
		private_SetCoords(oImage, this.worksheet, nWidth, nHeight, nFromCol, nColOffset,  nFromRow, nRowOffset);
		return new ApiImage(AscFormat.DrawingObjectsController.prototype.createImage(sImageSrc, 0, 0, nWidth/36000, nHeight/36000));
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




	//------------------------------------------------------------------------------------------------------------------
	//
	// ApiDrawing
	//
	//------------------------------------------------------------------------------------------------------------------

	/**
	 * Get the type of this class.
	 * @returns {"drawing"}
	 */
	ApiDrawing.prototype.GetClassType = function()
	{
		return "drawing";
	};

	/**
	 * Set the size of the bounding box.
	 * @param {EMU} nWidth
	 * @param {EMU} nHeight
	 */
	ApiDrawing.prototype.SetSize = function(nWidth, nHeight)
	{
		var fWidth = nWidth/36000.0;
		var fHeight = nHeight/36000.0;
		if(this.Drawing && this.Drawing.spPr && this.Drawing.spPr.xfrm)
		{
			this.Drawing.spPr.xfrm.setExtX(fWidth);
			this.Drawing.spPr.xfrm.setExtY(fHeight);
			this.Drawing.setDrawingBaseExt(fWidth, fHeight);

		}
	};

	/**
	 * Set drawing's position
	 * @param {number} nFromCol
	 * @param {EMU} nColOffset
	 * @param {number} nFromRow
	 * @param {EMU} nRowOffset
	* */
	ApiDrawing.prototype.SetPosition = function(nFromCol, nColOffset, nFromRow, nRowOffset){
		var extX = null, extY = null;
		if(this.Drawing.drawingBase){
			if(this.Drawing.drawingBase.Type === AscCommon.c_oAscCellAnchorType.cellanchorOneCell ||
				this.Drawing.drawingBase.Type === AscCommon.c_oAscCellAnchorType.cellanchorAbsolute){
				extX = this.Drawing.drawingBase.ext.cx;
				extY = this.Drawing.drawingBase.ext.cy;
			}
		}
		if(!AscFormat.isRealNumber(extX) || !AscFormat.isRealNumber(extY)){
			if(this.Drawing.spPr && this.Drawing.spPr.xfrm){
				extX = this.Drawing.spPr.xfrm.extX;
				extY = this.Drawing.spPr.xfrm.extY;
			}
			else{
				extX = 5;
				extY = 5;
			}
		}
		this.Drawing.setDrawingBaseType(AscCommon.c_oAscCellAnchorType.cellanchorOneCell);
		this.Drawing.setDrawingBaseCoords(nFromCol, nColOffset/36000.0, nFromRow, nRowOffset/36000.0, 0, 0, 0, 0, 0, 0, extX, extY);
	};


	//------------------------------------------------------------------------------------------------------------------
	//
	// ApiImage
	//
	//------------------------------------------------------------------------------------------------------------------

	/**
	 * Get the type of this class.
	 * @returns {"image"}
	 */
	ApiImage.prototype.GetClassType = function()
	{
		return "image";
	};

	//------------------------------------------------------------------------------------------------------------------
	//
	// ApiShape
	//
	//------------------------------------------------------------------------------------------------------------------

	/**
	 * Get the type of this class.
	 * @returns {"shape"}
	 */
	ApiShape.prototype.GetClassType = function()
	{
		return "shape";
	};


	/**
	 * Get content of this shape.
	 * @returns {?ApiDocumentContent}
	 */
	ApiShape.prototype.GetDocContent = function()
	{
		var oApi = Asc["editor"];
		if(oApi && this.Drawing && this.Drawing.txBody && this.Drawing.txBody.content)
		{
			return oApi.private_CreateApiDocContent(this.Drawing.txBody.content);
		}
		return null;
	};

	/**
	 * Set shape's content vertical align
	 * @param {VerticalTextAlign} VerticalAlign
	 */
	ApiShape.prototype.SetVerticalTextAlign = function(VerticalAlign)
	{
		if(this.Shape)
		{
			switch(VerticalAlign)
			{
				case "top":
				{
					this.Shape.setVerticalAlign(4);
					break;
				}
				case "center":
				{
					this.Shape.setVerticalAlign(1);
					break;
				}
				case "bottom":
				{
					this.Shape.setVerticalAlign(0);
					break;
				}
			}
		}
	};

	//------------------------------------------------------------------------------------------------------------------
	//
	// ApiChart
	//
	//------------------------------------------------------------------------------------------------------------------
	/**
	 * Get the type of this class.
	 * @returns {"chart"}
	 */
	ApiChart.prototype.GetClassType = function()
	{
		return "chart";
	};

	/**
	 *  Specifies a chart title
	 *  @param {string} sTitle
	 *  @param {hps} nFontSize
	 */
	ApiChart.prototype.SetTitle = function (sTitle, nFontSize)
	{
		AscFormat.builder_SetChartTitle(this.Chart, sTitle, nFontSize);
	};

	/**
	 *  Specifies a horizontal axis title
	 *  @param {string} sTitle
	 *  @param {hps} nFontSize
	 * */
	ApiChart.prototype.SetHorAxisTitle = function (sTitle, nFontSize)
	{
		AscFormat.builder_SetChartHorAxisTitle(this.Chart, sTitle, nFontSize);
	};

	/**
	 *  Specifies a vertical axis title
	 *  @param {string} sTitle
	 *  @param {hps} nFontSize
	 * */
	ApiChart.prototype.SetVerAxisTitle = function (sTitle, nFontSize)
	{
		AscFormat.builder_SetChartVertAxisTitle(this.Chart, sTitle, nFontSize);
	};

	/**
	 * Specifies a legend position
	 * @param {"left" | "top" | "right" | "bottom" | "none"} sLegendPos
	 * */
	ApiChart.prototype.SetLegendPos = function(sLegendPos)
	{
		AscFormat.builder_SetChartLegendPos(this.Chart, sLegendPos);
	};

	/**
	 * Spicifies a show options for data labels
	 * @param {boolean} bShowSerName
	 * @param {boolean} bShowCatName
	 * @param {boolean} bShowVal
	 * */
	ApiChart.prototype.SetShowDataLabels = function(bShowSerName, bShowCatName, bShowVal)
	{
		AscFormat.builder_SetShowDataLabels(this.Chart, bShowSerName, bShowCatName, bShowVal);
	};


	Api.prototype["GetActiveSheet"] = Api.prototype.GetActiveSheet;
	Api.prototype["CreateNewHistoryPoint"] = Api.prototype.CreateNewHistoryPoint;

	ApiWorksheet.prototype["GetActiveCell"] = ApiWorksheet.prototype.GetActiveCell;
	ApiWorksheet.prototype["SetName"] = ApiWorksheet.prototype.SetName;
	ApiWorksheet.prototype["GetRange"] = ApiWorksheet.prototype.GetRange;
	ApiWorksheet.prototype["GetRangeByNumber"] = ApiWorksheet.prototype.GetRangeByNumber;
	ApiWorksheet.prototype["FormatAsTable"] = ApiWorksheet.prototype.FormatAsTable;
	ApiWorksheet.prototype["SetColumnWidth"] = ApiWorksheet.prototype.SetColumnWidth;
	ApiWorksheet.prototype["AddChart"] = ApiWorksheet.prototype.AddChart;
	ApiWorksheet.prototype["AddShape"] = ApiWorksheet.prototype.AddShape;
	ApiWorksheet.prototype["AddImage"] = ApiWorksheet.prototype.AddImage;

	ApiRange.prototype["GetRow"] = ApiRange.prototype.GetRow;
	ApiRange.prototype["GetCol"] = ApiRange.prototype.GetCol;
	ApiRange.prototype["SetValue"] = ApiRange.prototype.SetValue;
	ApiRange.prototype["SetFontColor"] = ApiRange.prototype.SetFontColor;
	ApiRange.prototype["SetFontSize"] = ApiRange.prototype.SetFontSize;
	ApiRange.prototype["SetFontName"] = ApiRange.prototype.SetFontName;
	ApiRange.prototype["SetAlignVertical"] = ApiRange.prototype.SetAlignVertical;
	ApiRange.prototype["SetAlignHorizontal"] = ApiRange.prototype.SetAlignHorizontal;


	ApiDrawing.prototype["GetClassType"]             =  ApiDrawing.prototype.GetClassType;
	ApiDrawing.prototype["SetSize"]                  =  ApiDrawing.prototype.SetSize;
	ApiDrawing.prototype["SetPosition"]              =  ApiDrawing.prototype.SetPosition;

	ApiImage.prototype["GetClassType"]               =  ApiImage.prototype.GetClassType;

	ApiShape.prototype["GetClassType"]               =  ApiShape.prototype.GetClassType;
	ApiShape.prototype["GetDocContent"]              =  ApiShape.prototype.GetDocContent;
	ApiShape.prototype["SetVerticalTextAlign"]       =  ApiShape.prototype.SetVerticalTextAlign;

	ApiChart.prototype["GetClassType"]               =  ApiChart.prototype.GetClassType;
	ApiChart.prototype["SetTitle"]                   =  ApiChart.prototype.SetTitle;
	ApiChart.prototype["SetHorAxisTitle"]            =  ApiChart.prototype.SetHorAxisTitle;
	ApiChart.prototype["SetVerAxisTitle"]            =  ApiChart.prototype.SetVerAxisTitle;
	ApiChart.prototype["SetLegendPos"]               =  ApiChart.prototype.SetLegendPos;
	ApiChart.prototype["SetShowDataLabels"]          =  ApiChart.prototype.SetShowDataLabels;

	function private_SetCoords(oDrawing, oWorksheet, nExtX, nExtY, nFromCol, nColOffset,  nFromRow, nRowOffset){
		oDrawing.x = 0;
		oDrawing.y = 0;
		oDrawing.extX = 0;
		oDrawing.extY = 0;
		AscFormat.CheckSpPrXfrm(oDrawing);
		oDrawing.spPr.xfrm.setExtX(nExtX/36000.0);
		oDrawing.spPr.xfrm.setExtY(nExtY/36000.0);
		oDrawing.setBDeleted(false);
		oDrawing.setWorksheet(oWorksheet);
		oDrawing.setBFromSerialize(true);
		oDrawing.addToDrawingObjects();
		oDrawing.setDrawingBaseType(AscCommon.c_oAscCellAnchorType.cellanchorOneCell);
		oDrawing.setDrawingBaseCoords(nFromCol, nColOffset/36000.0, nFromRow, nRowOffset/36000.0, 0, 0, 0, 0, 0, 0, 0, 0);
		oDrawing.setDrawingBaseExt(nExtX/36000.0, nExtY/36000.0);
	}

}(window, null));
