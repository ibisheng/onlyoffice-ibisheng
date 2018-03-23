/*
 * (c) Copyright Ascensio System SIA 2010-2018
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
	function checkFormat(value) {
		var res;
		if (value instanceof Date) {
			res = new AscCommonExcel.cNumber(value.getExcelDate() +
				(value.getHours() * 60 * 60 + value.getMinutes() * 60 + value.getSeconds()) / AscCommonExcel.c_sPerDay)
		} else {
			res = new AscCommonExcel.cString(value + '');
		}
		return res;
	}

	/**
	 * @global
	 * @class
	 * @name Api
	 */
	var Api = window["Asc"]["spreadsheet_api"];

	/**
	 * Class representing a workbook.
	 * @constructor
	 */
	function ApiWorkbook(workbook) {
		this.workbook = workbook;
	}

	/**
	 * Class representing a sheet.
	 * @constructor
	 */
	function ApiWorksheet(worksheet) {
		this.worksheet = worksheet;
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
		ApiDrawing.call(this, oShape);
		this.Shape = oShape;
	}
	ApiShape.prototype = Object.create(ApiDrawing.prototype);
	ApiShape.prototype.constructor = ApiShape;

	/**
	 * Class representing a image.
	 * @constructor
	 */
	function ApiImage(oImage){
		ApiDrawing.call(this, oImage);
	}
	ApiImage.prototype = Object.create(ApiDrawing.prototype);
	ApiImage.prototype.constructor = ApiImage;

	/**
	 * Class representing a chart.
	 * @constructor
	 */
	function ApiChart(oChart){
		ApiDrawing.call(this, oChart);
		this.Chart = oChart;
	}
	ApiChart.prototype = Object.create(ApiDrawing.prototype);
	ApiChart.prototype.constructor = ApiChart;

	/**
	 * @typedef {("aliceBlue" | "antiqueWhite" | "aqua" | "aquamarine" | "azure" | "beige" | "bisque" | "black" |
     *     "blanchedAlmond" | "blue" | "blueViolet" | "brown" | "burlyWood" | "cadetBlue" | "chartreuse" | "chocolate"
     *     | "coral" | "cornflowerBlue" | "cornsilk" | "crimson" | "cyan" | "darkBlue" | "darkCyan" | "darkGoldenrod" |
     *     "darkGray" | "darkGreen" | "darkGrey" | "darkKhaki" | "darkMagenta" | "darkOliveGreen" | "darkOrange" |
     *     "darkOrchid" | "darkRed" | "darkSalmon" | "darkSeaGreen" | "darkSlateBlue" | "darkSlateGray" |
     *     "darkSlateGrey" | "darkTurquoise" | "darkViolet" | "deepPink" | "deepSkyBlue" | "dimGray" | "dimGrey" |
     *     "dkBlue" | "dkCyan" | "dkGoldenrod" | "dkGray" | "dkGreen" | "dkGrey" | "dkKhaki" | "dkMagenta" |
     *     "dkOliveGreen" | "dkOrange" | "dkOrchid" | "dkRed" | "dkSalmon" | "dkSeaGreen" | "dkSlateBlue" |
     *     "dkSlateGray" | "dkSlateGrey" | "dkTurquoise" | "dkViolet" | "dodgerBlue" | "firebrick" | "floralWhite" |
     *     "forestGreen" | "fuchsia" | "gainsboro" | "ghostWhite" | "gold" | "goldenrod" | "gray" | "green" |
     *     "greenYellow" | "grey" | "honeydew" | "hotPink" | "indianRed" | "indigo" | "ivory" | "khaki" | "lavender" |
     *     "lavenderBlush" | "lawnGreen" | "lemonChiffon" | "lightBlue" | "lightCoral" | "lightCyan" |
     *     "lightGoldenrodYellow" | "lightGray" | "lightGreen" | "lightGrey" | "lightPink" | "lightSalmon" |
     *     "lightSeaGreen" | "lightSkyBlue" | "lightSlateGray" | "lightSlateGrey" | "lightSteelBlue" | "lightYellow" |
     *     "lime" | "limeGreen" | "linen" | "ltBlue" | "ltCoral" | "ltCyan" | "ltGoldenrodYellow" | "ltGray" |
     *     "ltGreen" | "ltGrey" | "ltPink" | "ltSalmon" | "ltSeaGreen" | "ltSkyBlue" | "ltSlateGray" | "ltSlateGrey"|
     *     "ltSteelBlue" | "ltYellow" | "magenta" | "maroon" | "medAquamarine" | "medBlue" | "mediumAquamarine" |
     *     "mediumBlue" | "mediumOrchid" | "mediumPurple" | "mediumSeaGreen" | "mediumSlateBlue" |
     *     "mediumSpringGreen" | "mediumTurquoise" | "mediumVioletRed" | "medOrchid" | "medPurple" | "medSeaGreen" |
     *     "medSlateBlue" | "medSpringGreen" | "medTurquoise" | "medVioletRed" | "midnightBlue" | "mintCream" |
     *     "mistyRose" | "moccasin" | "navajoWhite" | "navy" | "oldLace" | "olive" | "oliveDrab" | "orange" |
     *     "orangeRed" | "orchid" | "paleGoldenrod" | "paleGreen" | "paleTurquoise" | "paleVioletRed" | "papayaWhip"|
     *     "peachPuff" | "peru" | "pink" | "plum" | "powderBlue" | "purple" | "red" | "rosyBrown" | "royalBlue" |
     *     "saddleBrown" | "salmon" | "sandyBrown" | "seaGreen" | "seaShell" | "sienna" | "silver" | "skyBlue" |
     *     "slateBlue" | "slateGray" | "slateGrey" | "snow" | "springGreen" | "steelBlue" | "tan" | "teal" |
     *     "thistle" | "tomato" | "turquoise" | "violet" | "wheat" | "white" | "whiteSmoke" | "yellow" |
     *     "yellowGreen")} PresetColor
	 * */

	/**
	 * @typedef {("none" | "nextTo" | "low" | "high")} TickLabelPosition
	 * **/


	/**
	 * @typedef {("cross" | "in" | "none" | "out")} TickMark
	 * */

	/**
	 * Class representing a base class for color types
	 * @constructor
	 */
	function ApiColor(color) {
		this.color = color;
	}

	/**
	 * Returns a class formatted according to instructions contained in a format expression
	 * @memberof Api
	 * @param {string} expression Any valid expression.
	 * @param {string} [format] A valid named or user-defined format expression.
	 * @returns {string}
	 */
	Api.prototype.Format = function (expression, format) {
		format = null == format ? '' : format;
		return AscCommonExcel.cTEXT.prototype.Calculate([checkFormat(expression), new AscCommonExcel.cString(format)])
			.getValue();
	};

	/**
	 * Returns a Sheets collection that represents all the sheets in the active workbook.
	 * @memberof Api
	 * @returns {Array.<ApiWorksheet>}
	 */
	Api.prototype.GetSheets = function () {
		var result = [];
		for (var i = 0; i < this.wbModel.getWorksheetCount(); ++i) {
			result.push(new ApiWorksheet(this.wbModel.getWorksheet(i)));
		}
		return result;
	};
	Object.defineProperty(Api.prototype, "Sheets", {
		get: function () {
			return this.GetSheets();
		}
	});

	/**
	 * Returns an object that represents the active workbook
	 * @memberof Api
	 * @returns {ApiWorkbook}
	 */
	Api.prototype.GetActiveWorkbook = function () {
		return new ApiWorkbook(this.wbModel);
	};
	Object.defineProperty(Api.prototype, "ActiveWorkbook", {
		get: function () {
			return this.GetActiveWorkbook();
		}
	});

	/**
	 * Returns an object that represents the active sheet
	 * @memberof Api
	 * @returns {ApiWorksheet}
	 */
	Api.prototype.GetActiveSheet = function () {
		var index = this.wbModel.getActive();
		return new ApiWorksheet(this.wbModel.getWorksheet(index));
	};
	Object.defineProperty(Api.prototype, "ActiveSheet", {
		get: function () {
			return this.GetActiveSheet();
		}
	});

	/**
	 * Returns an object that represents the sheet
	 * @memberof Api
	 * @param {string | number} nameOrIndex Sheet name or Sheet index
	 * @returns {ApiWorksheet | null}
	 */
	Api.prototype.GetSheet = function (nameOrIndex) {
		var ws = ('string' === typeof theme) ? this.wbModel.getWorksheetByName(nameOrIndex) :
			this.wbModel.getWorksheet(nameOrIndex);
		return ws ? new ApiWorksheet(ws) : null;
	};

	/**
	 * Returns an object that represents the active sheet
	 * @memberof Api
	 * @returns {array}
	 */
	Api.prototype.GetThemesColors = function () {
		var result = [];
		AscCommon.g_oUserColorScheme.forEach(function (item) {
			result.push(item.get_name());
		});

		return result;
	};

	/**
	 * Set theme colors
	 * @memberof Api
	 * @param {string | number} theme
	 */
	Api.prototype.SetThemeColors = function (theme) {
		if ('string' === typeof theme) {
			if (!AscCommon.g_oUserColorScheme.some(function (item, i) {
					if (theme === item.get_name()) {
						theme = i;
						return true;
					}
				})) {
				return;
			}
		}
		this.wbModel.changeColorScheme(theme);
	};

	Api.prototype.CreateNewHistoryPoint = function(){
		History.Create_NewPoint();
	};

	/**
	 * Create a RGB color
	 * @memberof Api
	 * @param {byte} r
	 * @param {byte} g
	 * @param {byte} b
	 * @returns {ApiColor}
	 */
	Api.prototype.CreateColorFromRGB = function (r, g, b) {
		return new ApiColor(AscCommonExcel.createRgbColor(r, g, b));
	};

	/**
	 * Create a RGB color
	 * @memberof Api
	 * @param {PresetColor} presetColor
	 * @returns {ApiColor}
	 */
	Api.prototype.CreateColorByName = function (presetColor) {
		var rgb = AscFormat.mapPrstColor[presetColor];
		return new ApiColor(AscCommonExcel.createRgbColor((rgb >> 16) & 0xFF, (rgb >> 8) & 0xFF, rgb & 0xFF));
	};

	/**
	 * Create a sheet.
	 * @memberof ApiWorkbook
	 * @param {string} name
	 */
	ApiWorkbook.prototype.AddSheet = function (name) {
		this.workbook.oApi.asc_addWorksheet(name);
	};

	/**
	 * Returns Visible of sheet
	 * @memberof ApiWorksheet
	 * @returns {bool}
	 */
	ApiWorksheet.prototype.GetVisible = function () {
		return !this.worksheet.getHidden();
	};

	/**
	 * Set Visible of sheet
	 * @param {bool} value
	 * @memberof ApiWorksheet
	 */
	ApiWorksheet.prototype.SetVisible = function (value) {
		this.worksheet.setHidden(!value);
	};
	Object.defineProperty(ApiWorksheet.prototype, "Visible", {
		get: function () {
			return this.GetVisible();
		},
		set: function (value) {
			this.SetVisible(value);
		}
	});

	/**
	 * Returns an object that represents the active cell
	 * @memberof ApiWorksheet
	 * @returns {ApiRange}
	 */
	ApiWorksheet.prototype.GetActiveCell = function () {
		var cell = this.worksheet.selectionRange.activeCell;
		return new ApiRange(this.worksheet.getCell3(cell.row, cell.col));
	};
	Object.defineProperty(ApiWorksheet.prototype, "ActiveCell", {
		get: function () {
			return this.GetActiveCell();
		}
	});

	/**
	 * Returns a ApiRange that represents all the cells on the worksheet (not just the cells that are currently in use).
	 * @memberof ApiWorksheet
	 * @returns {ApiRange}
	 */
	ApiWorksheet.prototype.GetCells = function () {
		return new ApiRange(this.worksheet.getRange3(0, 0, AscCommon.gc_nMaxRow0, AscCommon.gc_nMaxCol0));
	};
	Object.defineProperty(ApiWorksheet.prototype, "Cells", {
		get: function () {
			return this.GetCells();
		}
	});

	/**
	 * Returns a ApiRange that represents the used range on the specified worksheet.
	 * @memberof ApiWorksheet
	 * @returns {ApiRange}
	 */
	ApiWorksheet.prototype.GetUsedRange = function () {
		return new ApiRange(this.worksheet.getRange3(0, 0, this.worksheet.getRowsCount(),
			this.worksheet.getColsCount()));
	};
	Object.defineProperty(ApiWorksheet.prototype, "UsedRange", {
		get: function () {
			return this.GetUsedRange();
		}
	});

	/**
	 * Get sheet name
	 * @memberof ApiWorksheet
	 * @returns {string}
	 */
	ApiWorksheet.prototype.GetName = function () {
		return this.worksheet.getName();
	};

	/**
	 * Set sheet name
	 * @memberof ApiWorksheet
	 * @param {string} name
	 */
	ApiWorksheet.prototype.SetName = function (name) {
		this.worksheet.setName(name);
	};
	Object.defineProperty(ApiWorksheet.prototype, "Name", {
		get: function () {
			return this.GetName();
		},
		set: function (value) {
			this.SetName(value);
		}
	});

	/**
	 * Get sheet index
	 * @memberof ApiWorksheet
	 * @returns {number}
	 */
	ApiWorksheet.prototype.GetIndex = function () {
		return this.worksheet.getIndex();
	};
	Object.defineProperty(ApiWorksheet.prototype, "Index", {
		get: function () {
			return this.GetIndex();
		}
	});

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
	 * Set displayed gridlines
	 * @memberof ApiWorksheet
	 * @param {bool} value
	 */
	ApiWorksheet.prototype.SetDisplayGridlines = function (value) {
		this.worksheet.setDisplayGridlines(!!value);
	};

	/**
	 * Set displayed headings
	 * @memberof ApiWorksheet
	 * @param {bool} value
	 */
	ApiWorksheet.prototype.SetDisplayHeadings = function (value) {
		this.worksheet.setDisplayHeadings(!!value);
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
			var oChart = AscFormat.DrawingObjectsController.prototype.getChartSpace(this.worksheet, settings, true);
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
	 * @memberof ApiWorksheet
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
		var oShape = AscFormat.builder_CreateShape(sType, nWidth/36000, nHeight/36000, oFill.UniFill, oStroke.Ln, null, this.worksheet.workbook.theme, this.worksheet.DrawingDocument, false, this.worksheet);
		private_SetCoords(oShape, this.worksheet, nWidth, nHeight, nFromCol, nColOffset,  nFromRow, nRowOffset);
		return new ApiShape(oShape);
	};


	/**
	 * Create a image.
	 * @memberof ApiWorksheet
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
		return new ApiImage(oImage);
	};

	/**
	 */
	ApiWorksheet.prototype.ReplaceCurrentImage = function(sImageUrl, Width, Height){

        var oWorksheet = Asc['editor'].wb.getWorksheet();
        if(oWorksheet && oWorksheet.objectRender && oWorksheet.objectRender.controller){

            var oController = oWorksheet.objectRender.controller;
            var _w = Width/36000.0;
            var _h = Height/36000.0;
            var oImage = oController.createImage(sImageUrl, 0, 0, _w, _h);
            oImage.setWorksheet(oWorksheet.model);
            var selectedObjects, spTree;
            if(oController.selection.groupSelection){
                selectedObjects = oController.selection.groupSelection.selectedObjects;
            }
            else{
                selectedObjects = oController.selectedObjects;
            }
            if(selectedObjects.length > 0){
                if(selectedObjects[0].group){
                    spTree = selectedObjects[0].group.spTree;
                }
                else{
					spTree = oController.getDrawingArray();
                }

                for(var i = 0; i < spTree.length; ++i){
                    if(spTree[i] === selectedObjects[0]){
                    	if(spTree[i].getObjectType() === AscDFH.historyitem_type_ImageShape){
                            spTree[i].setBlipFill(AscFormat.CreateBlipFillRasterImageId(sImageUrl));
                            if(selectedObjects[0].group){
                                oController.selection.groupSelection.resetInternalSelection();
                                selectedObjects[0].group.selectObject(spTree[i], 0);
                            }
                            else{
                                oController.resetSelection();
                                oController.selectObject(spTree[i], 0);
                            }
						}
						else{
                            var _xfrm = spTree[i].spPr && spTree[i].spPr.xfrm;
                            var _xfrm2 = oImage.spPr.xfrm;
                            if(_xfrm){
                                _xfrm2.setOffX(_xfrm.offX);
                                _xfrm2.setOffY(_xfrm.offY);
                            }
                            else{
                                if(AscFormat.isRealNumber(spTree[i].x) && AscFormat.isRealNumber(spTree[i].y)){
                                    _xfrm2.setOffX(spTree[i].x);
                                    _xfrm2.setOffY(spTree[i].y);
                                }
                            }
                            if(selectedObjects[0].group){
                                var _group = selectedObjects[0].group;
                                _group.removeFromSpTreeByPos(i);
                                _group.addToSpTree(i, oImage);
                                oImage.setGroup(_group);
                                oController.selection.groupSelection.resetInternalSelection();
                                _group.selectObject(oImage, 0);
                            }
                            else{
                                var _object = spTree[i];
                                _object.deleteDrawingBase();
                                oImage.setBDeleted(false);
                                oImage.setWorksheet(oWorksheet.model);
                                oImage.setBFromSerialize(true);
                                oImage.addToDrawingObjects(i);
                                oImage.setDrawingBaseType(AscCommon.c_oAscCellAnchorType.cellanchorAbsolute);
                                oImage.setDrawingBaseCoords(0, 0, 0, 0, 0, 0, 0, 0, _object.x, _object.y, oImage.spPr.xfrm.extX, oImage.spPr.xfrm.extY);
                                oImage.setDrawingBaseExt(oImage.spPr.xfrm.extX, oImage.spPr.xfrm.extY);
                                oController.resetSelection();
                                oController.selectObject(oImage, 0);
                            }
						}
                        return;
                    }
                }
            }
            var cell = this.worksheet.selectionRange.activeCell;
            private_SetCoords(oImage, oWorksheet.model, Width, Height, cell ? cell.col : 0, 0,  cell ? cell.row : 0, 0, undefined);
            oController.resetSelection();
            oController.selectObject(oImage, 0);
			oWorksheet.isSelectOnShape = true;
        }
	};

	/**
	 * Specifies the border to be retrieved.
	 * @typedef {("DiagonalDown" | "DiagonalUp" | "Bottom" | "Left" | "Right" | "Top" | "InsideHorizontal" | "InsideVertical")} BordersIndex
	 */

	/**
	 * Specifies the line style for the border.
	 * @typedef {("None" | "Double" | "Hair" | "DashDotDot" | "DashDot" | "Dotted" | "Dashed" | "Thin" | "MediumDashDotDot" | "SlantDashDot" | "MediumDashDot" | "MediumDashed" | "Medium" | "Thick")} LineStyle
	 */

	/**
	 * Get cell row
	 * @memberof ApiRange
	 * @returns {Number}
	 */
	ApiRange.prototype.GetRow = function () {
		return this.range.bbox.r1;
	};
	Object.defineProperty(ApiRange.prototype, "Row", {
		get: function () {
			return this.GetRow();
		}
	});
	/**
	 * Get cell column
	 * @memberof ApiRange
	 * @returns {Number}
	 */
	ApiRange.prototype.GetCol = function () {
		return this.range.bbox.c1;
	};
	Object.defineProperty(ApiRange.prototype, "Col", {
		get: function () {
			return this.GetCol();
		}
	});

	/**
	 * Set cell value
	 * @memberof ApiRange
	 * @returns {string}
	 */
	ApiRange.prototype.GetValue = function () {
		return this.range.getValue();
	};
	/**
	 * Set cell value
	 * @memberof ApiRange
	 * @param {string} value
	 */
	ApiRange.prototype.SetValue = function (value) {
		this.range.setValue(checkFormat(value).getValue());
	};
	Object.defineProperty(ApiRange.prototype, "Value", {
		get: function () {
			return this.GetValue();
		},
		set: function (value) {
			this.SetValue(value);
		}
	});

	/**
	 * Set text color in the rgb format.
	 * @memberof ApiRange
	 * @param {ApiColor} color
	 */
	ApiRange.prototype.SetFontColor = function (color) {
		this.range.setFontcolor(color.color);
	};
	Object.defineProperty(ApiRange.prototype, "FontColor", {
		set: function (color) {
			return this.SetFontColor(color);
		}
	});

	/**
	 * Set font size
	 * @memberof ApiRange
	 * @param {number} size
	 */
	ApiRange.prototype.SetFontSize = function (size) {
		this.range.setFontsize(size);
	};
	Object.defineProperty(ApiRange.prototype, "FontSize", {
		set: function (size) {
			return this.SetFontSize(size);
		}
	});

	/**
	 * Set font name
	 * @memberof ApiRange
	 * @param {string} name
	 */
	ApiRange.prototype.SetFontName = function (name) {
		this.range.setFontname(name);
	};
	Object.defineProperty(ApiRange.prototype, "FontName", {
		set: function (name) {
			return this.SetFontName(name);
		}
	});

	/**
	 * Set align vertical
	 * @memberof ApiRange
	 * @param {'center' | 'bottom' | 'top'} value
	 */
	ApiRange.prototype.SetAlignVertical = function (value) {
		switch(value)
		{
			case "center":
			{
				this.range.setAlignVertical(Asc.c_oAscVAlign.Center);
				break;
			}
			case "bottom":
			{
				this.range.setAlignVertical(Asc.c_oAscVAlign.Bottom);
				break;
			}
			case "top":
			{
				this.range.setAlignVertical(Asc.c_oAscVAlign.Top);
				break;
			}
		}
	};
	Object.defineProperty(ApiRange.prototype, "AlignVertical", {
		set: function (value) {
			return this.SetAlignVertical(value);
		}
	});

	/**
	 * Set align horizontal
	 * @param {'left' | 'right' | 'center' | 'justify'} value
	 */
	ApiRange.prototype.SetAlignHorizontal = function (value) {
		switch(value)
		{
			case "left":
			{
				this.range.setAlignHorizontal(AscCommon.align_Left);
				break;
			}
			case "right":
			{
				this.range.setAlignHorizontal(AscCommon.align_Right);
				break;
			}
			case "justify":
			{
				this.range.setAlignHorizontal(AscCommon.align_Justify);
				break;
			}
			case "center":
			{
				this.range.setAlignHorizontal(AscCommon.align_Center);
				break;
			}
		}
	};
	Object.defineProperty(ApiRange.prototype, "AlignHorizontal", {
		set: function (value) {
			return this.SetAlignHorizontal(value);
		}
	});

	/**
	 * Set bold
	 * @memberof ApiRange
	 * @param {bool} value
	 */
	ApiRange.prototype.SetBold = function (value) {
		this.range.setBold(!!value);
	};
	Object.defineProperty(ApiRange.prototype, "Bold", {
		set: function (value) {
			return this.SetBold(value);
		}
	});

	/**
	 * Set italic
	 * @memberof ApiRange
	 * @param {bool} value
	 */
	ApiRange.prototype.SetItalic = function (value) {
		this.range.setItalic(!!value);
	};
	Object.defineProperty(ApiRange.prototype, "Italic", {
		set: function (value) {
			return this.SetItalic(value);
		}
	});

	/**
	 * Set underline
	 * @memberof ApiRange
	 * @param {'none' | 'single' | 'singleAccounting' | 'double' | 'doubleAccounting'} value
	 */
	ApiRange.prototype.SetUnderline = function (value) {
		var val;
		switch (value) {
			case 'single':
				val = Asc.EUnderline.underlineSingle;
				break;
			case 'singleAccounting':
				val = Asc.EUnderline.underlineSingleAccounting;
				break;
			case 'double':
				val = Asc.EUnderline.underlineDouble;
				break;
			case 'doubleAccounting':
				val = Asc.EUnderline.underlineDoubleAccounting;
				break;
			case 'none':
			default:
				val = Asc.EUnderline.underlineNone;
				break;
		}
		this.range.setUnderline(val);
	};
	Object.defineProperty(ApiRange.prototype, "Underline", {
		set: function (value) {
			return this.SetUnderline(value);
		}
	});

	/**
	 * Set strikeout
	 * @memberof ApiRange
	 * @param {bool} value
	 */
	ApiRange.prototype.SetStrikeout = function (value) {
		this.range.setStrikeout(!!value);
	};
	Object.defineProperty(ApiRange.prototype, "Strikeout", {
		set: function (value) {
			return this.SetStrikeout(value);
		}
	});

	/**
	 * Set wrap
	 * @memberof ApiRange
	 * @param {bool} value
	 */
	ApiRange.prototype.SetWrap = function (value) {
		this.range.setWrap(!!value);
	};
	Object.defineProperty(ApiRange.prototype, "Wrap", {
		set: function (value) {
			return this.SetWrap(value);
		}
	});

	/**
	 * Set fill color in the rgb format.
	 * @memberof ApiRange
	 * @param {ApiColor} color
	 */
	ApiRange.prototype.SetFillColor = function (color) {
		this.range.setFill(color.color);
	};
	Object.defineProperty(ApiRange.prototype, "FillColor", {
		set: function (color) {
			return this.SetFillColor(color);
		}
	});

	/**
	 * Set the number format.
	 * @memberof ApiRange
	 * @param {string} value
	 */
	ApiRange.prototype.SetNumberFormat = function (value) {
		this.range.setNumFormat(value);
	};
	Object.defineProperty(ApiRange.prototype, "NumberFormat", {
		set: function (value) {
			return this.SetNumberFormat(value);
		}
	});

	/**
	 * Set border properties.
	 * @memberof ApiRange
	 * @param {BordersIndex} bordersIndex
	 * @param {LineStyle} lineStyle
	 * @param {ApiColor} color
	 */
	ApiRange.prototype.SetBorders = function (bordersIndex, lineStyle, color) {
		var borders = new AscCommonExcel.Border();
		switch (bordersIndex) {
			case 'DiagonalDown':
				borders.dd = true;
				borders.d = private_MakeBorder(lineStyle, color);
				break;
			case 'DiagonalUp':
				borders.du = true;
				borders.d = private_MakeBorder(lineStyle, color);
				break;
			case 'Bottom':
				borders.b = private_MakeBorder(lineStyle, color);
				break;
			case 'Left':
				borders.l = private_MakeBorder(lineStyle, color);
				break;
			case 'Right':
				borders.r = private_MakeBorder(lineStyle, color);
				break;
			case 'Top':
				borders.t = private_MakeBorder(lineStyle, color);
				break;
			case 'InsideHorizontal':
				borders.ih = private_MakeBorder(lineStyle, color);
				break;
			case 'InsideVertical':
				borders.iv = private_MakeBorder(lineStyle, color);
				break;
		}
		this.range.setBorder(borders);
	};

	/**
	 * Creates a merged cell from the specified Range.
	 * @memberof ApiRange
	 * @param {bool} across
	 */
	ApiRange.prototype.Merge = function (across) {
		if (across) {
			var ws = this.range.worksheet;
			var bbox = this.range.getBBox0();
			for (var r = bbox.r1; r <= bbox.r2; ++r) {
				ws.getRange3(r, bbox.c1, r, bbox.c2).merge(null);
			}
		} else {
			this.range.merge(null);
		}
	};

	/**
	 * Separates a merged area into individual cells.
	 * @memberof ApiRange
	 */
	ApiRange.prototype.UnMerge = function () {
		this.range.unmerge();
	};

	/**
	 * The ForEach() method executes a provided function once for each cell
	 * @memberof ApiRange
	 */
	ApiRange.prototype.ForEach = function (callback) {
		if (callback instanceof Function) {
			var ws = this.range.getWorksheet();
			this.range._foreach(function (cell) {
				callback(new ApiRange(ws.getCell3(cell.nRow, cell.nCol)));
			});
		}
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
	 *  @param {?bool} bIsBold
	 */
	ApiChart.prototype.SetTitle = function (sTitle, nFontSize, bIsBold)
	{
		AscFormat.builder_SetChartTitle(this.Chart, sTitle, nFontSize, bIsBold);
	};

	/**
	 *  Specifies a horizontal axis title
	 *  @param {string} sTitle
	 *  @param {hps} nFontSize
     *  @param {?bool} bIsBold
	 * */
	ApiChart.prototype.SetHorAxisTitle = function (sTitle, nFontSize, bIsBold)
	{
		AscFormat.builder_SetChartHorAxisTitle(this.Chart, sTitle, nFontSize, bIsBold);
	};

	/**
	 *  Specifies a vertical axis title
	 *  @param {string} sTitle
	 *  @param {hps} nFontSize
	 *  @param {?bool} bIsBold
	 * */
	ApiChart.prototype.SetVerAxisTitle = function (sTitle, nFontSize, bIsBold)
	{
		AscFormat.builder_SetChartVertAxisTitle(this.Chart, sTitle, nFontSize, bIsBold);
	};


	/**
	 * Specifies a  vertical axis orientation
	 * @param {bool} bIsMinMax
	 * */
	ApiChart.prototype.SetVerAxisOrientation = function(bIsMinMax){
		AscFormat.builder_SetChartVertAxisOrientation(this.Chart, bIsMinMax);
	};


	/**
	 * Specifies major tick mark for horizontal axis
	 * @param {TickMark} sTickMark
	 * */

	ApiChart.prototype.SetHorAxisMajorTickMark = function(sTickMark){
        AscFormat.builder_SetChartHorAxisMajorTickMark(this.Chart, sTickMark);
	};/**
	 * Specifies minor tick mark for horizontal axis
	 * @param {TickMark} sTickMark
	 * */

	ApiChart.prototype.SetHorAxisMinorTickMark = function(sTickMark){
        AscFormat.builder_SetChartHorAxisMinorTickMark(this.Chart, sTickMark);
	};

	/**
	 * Specifies major tick mark for vertical axis
	 * @param {TickMark} sTickMark
	 * */

	ApiChart.prototype.SetVertAxisMajorTickMark = function(sTickMark){
        AscFormat.builder_SetChartVerAxisMajorTickMark(this.Chart, sTickMark);
	};

	/**
	 * Specifies minor tick mark for vertical axis
	 * @param {TickMark} sTickMark
	 * */
	ApiChart.prototype.SetVertAxisMinorTickMark = function(sTickMark){
        AscFormat.builder_SetChartVerAxisMinorTickMark(this.Chart, sTickMark);
	};

	/**
	 * Specifies a  horizontal axis orientation
	 * @param {bool} bIsMinMax
	 * */
	ApiChart.prototype.SetHorAxisOrientation = function(bIsMinMax){
		AscFormat.builder_SetChartHorAxisOrientation(this.Chart, bIsMinMax);
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
	 * Specifies a legend position
	 * @number nFontSize
	 * */
	ApiChart.prototype.SetLegendFontSize = function(nFontSize)
	{
		AscFormat.builder_SetLegendFontSize(this.Chart, nFontSize);
	};

	/**
	 * Spicifies a show options for data labels
	 * @param {boolean} bShowSerName
	 * @param {boolean} bShowCatName
	 * @param {boolean} bShowVal
	 * @param {boolean} bShowPercent
	 * */
	ApiChart.prototype.SetShowDataLabels = function(bShowSerName, bShowCatName, bShowVal, bShowPercent)
	{
		AscFormat.builder_SetShowDataLabels(this.Chart, bShowSerName, bShowCatName, bShowVal, bShowPercent);
	};

    /**
     * Spicifies a show options for data labels
	 * @param {number} nSeriesIndex
	 * @param {number} nPointIndex
     * @param {boolean} bShowSerName
     * @param {boolean} bShowCatName
     * @param {boolean} bShowVal
     * @param {boolean} bShowPercent
     * */
    ApiChart.prototype.SetShowPointDataLabel = function(nSeriesIndex, nPointIndex, bShowSerName, bShowCatName, bShowVal, bShowPercent)
    {
        AscFormat.builder_SetShowPointDataLabel(this.Chart, nSeriesIndex, nPointIndex, bShowSerName, bShowCatName, bShowVal, bShowPercent);
    };

	/**
	 * Spicifies tick labels position vertical axis
	 * @param {TickLabelPosition} sTickLabelPosition
	 * */
	ApiChart.prototype.SetVertAxisTickLabelPosition = function(sTickLabelPosition)
	{
		AscFormat.builder_SetChartVertAxisTickLablePosition(this.Chart, sTickLabelPosition);
	};
	/**
	 * Spicifies tick labels position horizontal axis
	 * @param {TickLabelPosition} sTickLabelPosition
	 * */
	ApiChart.prototype.SetHorAxisTickLabelPosition = function(sTickLabelPosition)
	{
		AscFormat.builder_SetChartHorAxisTickLablePosition(this.Chart, sTickLabelPosition);
	};

	/**
	 * Specifies major vertical gridline's visual properties
	 * @param {?ApiStroke} oStroke
	 * */
    ApiChart.prototype.SetMajorVerticalGridlines = function(oStroke)
    {
        AscFormat.builder_SetVerAxisMajorGridlines(this.Chart, oStroke ?  oStroke.Ln : null);
    };

	/**
	 * Specifies minor vertical gridline's visual properties
	 * @param {?ApiStroke} oStroke
	 * */
    ApiChart.prototype.SetMinorVerticalGridlines = function(oStroke)
    {
        AscFormat.builder_SetVerAxisMinorGridlines(this.Chart, oStroke ?  oStroke.Ln : null);
    };


	/**
	 * Specifies major horizontal gridline's visual properties
	 * @param {?ApiStroke} oStroke
	 * */
    ApiChart.prototype.SetMajorHorizontalGridlines = function(oStroke)
    {
        AscFormat.builder_SetHorAxisMajorGridlines(this.Chart, oStroke ?  oStroke.Ln : null);
    };

	/**
	 * Specifies minor vertical gridline's visual properties
	 * @param {?ApiStroke} oStroke
	 */
    ApiChart.prototype.SetMinorHorizontalGridlines = function(oStroke)
    {
        AscFormat.builder_SetHorAxisMinorGridlines(this.Chart, oStroke ?  oStroke.Ln : null);
    };


    /**
	 * Specifies font size for labels of horizontal axis
	 * @param {number} nFontSize
    */
	ApiChart.prototype.SetHorAxisLablesFontSize = function(nFontSize){
        AscFormat.builder_SetHorAxisFontSize(this.Chart, nFontSize);
	};

    /**
	 * Specifies font size for labels of vertical axis
	 * @param {number} nFontSize
    */
	ApiChart.prototype.SetVertAxisLablesFontSize = function(nFontSize){
        AscFormat.builder_SetVerAxisFontSize(this.Chart, nFontSize);
	};
    /**
	 * Apply set of visual settings for chart
	 * @param {number} nStyleIndex
    */
	ApiChart.prototype.ApplyChartStyle = function(nStyleIndex){
		if(this.Chart){
            var chart = this.Chart.chart;
            var plot_area = chart.plotArea;
            var oCurChartSettings = AscFormat.DrawingObjectsController.prototype.getPropsFromChart.call(AscFormat.DrawingObjectsController.prototype, this.Chart);
            var _cur_type = oCurChartSettings.type;
            if(AscCommon.g_oChartPresets[_cur_type] && AscCommon.g_oChartPresets[_cur_type][nStyleIndex]){
                plot_area.removeCharts(1, plot_area.charts.length - 1);
                AscFormat.ApplyPresetToChartSpace(this.Chart, AscCommon.g_oChartPresets[_cur_type][nStyleIndex], false);
                return;
            }
		}
	};


	/**
	 * Get the type of this class.
	 * @returns {"color"}
	 */
	ApiColor.prototype.GetClassType = function () {
		return "color";
	};


	Api.prototype["Format"] = Api.prototype.Format;
	Api.prototype["GetSheets"] = Api.prototype.GetSheets;
	Api.prototype["GetActiveWorkbook"] = Api.prototype.GetActiveWorkbook;
	Api.prototype["GetActiveSheet"] = Api.prototype.GetActiveSheet;
	Api.prototype["GetSheet"] = Api.prototype.GetSheet;
	Api.prototype["GetThemesColors"] = Api.prototype.GetThemesColors;
	Api.prototype["SetThemeColors"] = Api.prototype.SetThemeColors;
	Api.prototype["CreateNewHistoryPoint"] = Api.prototype.CreateNewHistoryPoint;
	Api.prototype["CreateColorFromRGB"] = Api.prototype.CreateColorFromRGB;
	Api.prototype["CreateColorByName"] = Api.prototype.CreateColorByName;

	ApiWorkbook.prototype["AddSheet"] = ApiWorkbook.prototype.AddSheet;

	ApiWorksheet.prototype["GetVisible"] = ApiWorksheet.prototype.GetVisible;
	ApiWorksheet.prototype["SetVisible"] = ApiWorksheet.prototype.SetVisible;
	ApiWorksheet.prototype["GetActiveCell"] = ApiWorksheet.prototype.GetActiveCell;
	ApiWorksheet.prototype["GetCells"] = ApiWorksheet.prototype.GetCells;
	ApiWorksheet.prototype["GetUsedRange"] = ApiWorksheet.prototype.GetUsedRange;
	ApiWorksheet.prototype["GetName"] = ApiWorksheet.prototype.GetName;
	ApiWorksheet.prototype["SetName"] = ApiWorksheet.prototype.SetName;
	ApiWorksheet.prototype["GetIndex"] = ApiWorksheet.prototype.GetIndex;
	ApiWorksheet.prototype["GetRange"] = ApiWorksheet.prototype.GetRange;
	ApiWorksheet.prototype["GetRangeByNumber"] = ApiWorksheet.prototype.GetRangeByNumber;
	ApiWorksheet.prototype["FormatAsTable"] = ApiWorksheet.prototype.FormatAsTable;
	ApiWorksheet.prototype["SetColumnWidth"] = ApiWorksheet.prototype.SetColumnWidth;
	ApiWorksheet.prototype["SetDisplayGridlines"] = ApiWorksheet.prototype.SetDisplayGridlines;
	ApiWorksheet.prototype["SetDisplayHeadings"] = ApiWorksheet.prototype.SetDisplayHeadings;
	ApiWorksheet.prototype["AddChart"] = ApiWorksheet.prototype.AddChart;
	ApiWorksheet.prototype["AddShape"] = ApiWorksheet.prototype.AddShape;
	ApiWorksheet.prototype["AddImage"] = ApiWorksheet.prototype.AddImage;
	ApiWorksheet.prototype["ReplaceCurrentImage"] = ApiWorksheet.prototype.ReplaceCurrentImage;

	ApiRange.prototype["GetRow"] = ApiRange.prototype.GetRow;
	ApiRange.prototype["GetCol"] = ApiRange.prototype.GetCol;
	ApiRange.prototype["GetValue"] = ApiRange.prototype.GetValue;
	ApiRange.prototype["SetValue"] = ApiRange.prototype.SetValue;
	ApiRange.prototype["SetFontColor"] = ApiRange.prototype.SetFontColor;
	ApiRange.prototype["SetFontSize"] = ApiRange.prototype.SetFontSize;
	ApiRange.prototype["SetFontName"] = ApiRange.prototype.SetFontName;
	ApiRange.prototype["SetAlignVertical"] = ApiRange.prototype.SetAlignVertical;
	ApiRange.prototype["SetAlignHorizontal"] = ApiRange.prototype.SetAlignHorizontal;
	ApiRange.prototype["SetBold"] = ApiRange.prototype.SetBold;
	ApiRange.prototype["SetItalic"] = ApiRange.prototype.SetItalic;
	ApiRange.prototype["SetUnderline"] = ApiRange.prototype.SetUnderline;
	ApiRange.prototype["SetStrikeout"] = ApiRange.prototype.SetStrikeout;
	ApiRange.prototype["SetWrap"] = ApiRange.prototype.SetWrap;
	ApiRange.prototype["SetFillColor"] = ApiRange.prototype.SetFillColor;
	ApiRange.prototype["SetNumberFormat"] = ApiRange.prototype.SetNumberFormat;
	ApiRange.prototype["SetBorders"] = ApiRange.prototype.SetBorders;
	ApiRange.prototype["Merge"] = ApiRange.prototype.Merge;
	ApiRange.prototype["UnMerge"] = ApiRange.prototype.UnMerge;
	ApiRange.prototype["ForEach"] = ApiRange.prototype.ForEach;


	ApiDrawing.prototype["GetClassType"]               =  ApiDrawing.prototype.GetClassType;
	ApiDrawing.prototype["SetSize"]                    =  ApiDrawing.prototype.SetSize;
	ApiDrawing.prototype["SetPosition"]                =  ApiDrawing.prototype.SetPosition;

	ApiImage.prototype["GetClassType"]                 =  ApiImage.prototype.GetClassType;

	ApiShape.prototype["GetClassType"]                 =  ApiShape.prototype.GetClassType;
	ApiShape.prototype["GetDocContent"]                =  ApiShape.prototype.GetDocContent;
	ApiShape.prototype["SetVerticalTextAlign"]         =  ApiShape.prototype.SetVerticalTextAlign;

	ApiChart.prototype["GetClassType"]                 =  ApiChart.prototype.GetClassType;
	ApiChart.prototype["SetTitle"]                     =  ApiChart.prototype.SetTitle;
	ApiChart.prototype["SetHorAxisTitle"]              =  ApiChart.prototype.SetHorAxisTitle;
	ApiChart.prototype["SetVerAxisTitle"]              =  ApiChart.prototype.SetVerAxisTitle;
	ApiChart.prototype["SetVerAxisOrientation"]        =  ApiChart.prototype.SetVerAxisOrientation;
	ApiChart.prototype["SetHorAxisOrientation"]        =  ApiChart.prototype.SetHorAxisOrientation;
	ApiChart.prototype["SetLegendPos"]                 =  ApiChart.prototype.SetLegendPos;
	ApiChart.prototype["SetLegendFontSize"]            =  ApiChart.prototype.SetLegendFontSize;
	ApiChart.prototype["SetShowDataLabels"]            =  ApiChart.prototype.SetShowDataLabels;
	ApiChart.prototype["SetShowPointDataLabel"]        =  ApiChart.prototype.SetShowPointDataLabel;
	ApiChart.prototype["SetVertAxisTickLabelPosition"] =  ApiChart.prototype.SetVertAxisTickLabelPosition;
	ApiChart.prototype["SetHorAxisTickLabelPosition"]  =  ApiChart.prototype.SetHorAxisTickLabelPosition;

	ApiChart.prototype["SetHorAxisMajorTickMark"]  =  ApiChart.prototype.SetHorAxisMajorTickMark;
	ApiChart.prototype["SetHorAxisMinorTickMark"]  =  ApiChart.prototype.SetHorAxisMinorTickMark;
	ApiChart.prototype["SetVertAxisMajorTickMark"]  =  ApiChart.prototype.SetVertAxisMajorTickMark;
	ApiChart.prototype["SetVertAxisMinorTickMark"]  =  ApiChart.prototype.SetVertAxisMinorTickMark;



    ApiChart.prototype["SetMajorVerticalGridlines"]  =  ApiChart.prototype.SetMajorVerticalGridlines;
    ApiChart.prototype["SetMinorVerticalGridlines"]  =  ApiChart.prototype.SetMinorVerticalGridlines;
    ApiChart.prototype["SetMajorHorizontalGridlines"]  =  ApiChart.prototype.SetMajorHorizontalGridlines;
    ApiChart.prototype["SetMinorHorizontalGridlines"]  =  ApiChart.prototype.SetMinorHorizontalGridlines;
    ApiChart.prototype["SetHorAxisLablesFontSize"]   =  ApiChart.prototype.SetHorAxisLablesFontSize;
    ApiChart.prototype["SetVertAxisLablesFontSize"]  =  ApiChart.prototype.SetVertAxisLablesFontSize;
    ApiChart.prototype["ApplyChartStyle"]            =  ApiChart.prototype.ApplyChartStyle;


    ApiColor.prototype["GetClassType"]                 =  ApiColor.prototype.GetClassType;


	function private_SetCoords(oDrawing, oWorksheet, nExtX, nExtY, nFromCol, nColOffset,  nFromRow, nRowOffset, pos){
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
		oDrawing.addToDrawingObjects(pos);
		oDrawing.setDrawingBaseType(AscCommon.c_oAscCellAnchorType.cellanchorOneCell);
		oDrawing.setDrawingBaseCoords(nFromCol, nColOffset/36000.0, nFromRow, nRowOffset/36000.0, 0, 0, 0, 0, 0, 0, 0, 0);
		oDrawing.setDrawingBaseExt(nExtX/36000.0, nExtY/36000.0);
	}

	function private_MakeBorder(lineStyle, color) {
		var border = new AscCommonExcel.BorderProp();
		switch (lineStyle) {
			case 'Double':
				border.setStyle(AscCommon.c_oAscBorderStyles.Double);
				break;
			case 'Hair':
				border.setStyle(AscCommon.c_oAscBorderStyles.Hair);
				break;
			case 'DashDotDot':
				border.setStyle(AscCommon.c_oAscBorderStyles.DashDotDot);
				break;
			case 'DashDot':
				border.setStyle(AscCommon.c_oAscBorderStyles.DashDot);
				break;
			case 'Dotted':
				border.setStyle(AscCommon.c_oAscBorderStyles.Dotted);
				break;
			case 'Dashed':
				border.setStyle(AscCommon.c_oAscBorderStyles.Dashed);
				break;
			case 'Thin':
				border.setStyle(AscCommon.c_oAscBorderStyles.Thin);
				break;
			case 'MediumDashDotDot':
				border.setStyle(AscCommon.c_oAscBorderStyles.MediumDashDotDot);
				break;
			case 'SlantDashDot':
				border.setStyle(AscCommon.c_oAscBorderStyles.SlantDashDot);
				break;
			case 'MediumDashDot':
				border.setStyle(AscCommon.c_oAscBorderStyles.MediumDashDot);
				break;
			case 'MediumDashed':
				border.setStyle(AscCommon.c_oAscBorderStyles.MediumDashed);
				break;
			case 'Medium':
				border.setStyle(AscCommon.c_oAscBorderStyles.Medium);
				break;
			case 'Thick':
				border.setStyle(AscCommon.c_oAscBorderStyles.Thick);
				break;
			case 'None':
			default:
				border.setStyle(AscCommon.c_oAscBorderStyles.None);
				break;
		}

		if (color) {
			border.c = color.color;
		}
		return border;
	}

}(window, null));
