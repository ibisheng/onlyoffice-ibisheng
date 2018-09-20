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
		//TODO Date не обрабатывается. в будущем нужно реализовать.
		return new AscCommonExcel.cString(value + '');
	}

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
	 * @typedef {("xlLandscape" | "xlPortrait")} PageOrientation
	 * */

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
	 * Create a sheet.
	 * @memberof Api
	 * @param {string} name
	 */
	Api.prototype.AddSheet = function (name) {
		this.asc_addWorksheet(name);
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
	 * Get the object that represents the active sheet.
	 * @memberof Api
	 * @typeofeditors ["CSE"]
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
		var ws = ('string' === typeof nameOrIndex) ? this.wbModel.getWorksheetByName(nameOrIndex) :
			this.wbModel.getWorksheet(nameOrIndex);
		return ws ? new ApiWorksheet(ws) : null;
	};

	/**
	 * Get the list of all available theme colors for the spreadsheet.
	 * @memberof Api
	 * @typeofeditors ["CSE"]
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
	 * Set the theme colors to the current spreadsheet.
	 * @memberof Api
	 * @typeofeditors ["CSE"]
	 * @param {string | number} theme - The list of theme colors that will be used to select the color scheme to be set to the current spreadsheet.
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
	 * Create an RGB color setting the appropriate values for the red, green and blue color components.
	 * @memberof Api
	 * @typeofeditors ["CSE"]
	 * @param {byte} r - Red color component value.
	 * @param {byte} g - Green color component value.
	 * @param {byte} b - Blue color component value.
	 * @returns {ApiColor}
	 */
	Api.prototype.CreateColorFromRGB = function (r, g, b) {
		return new ApiColor(AscCommonExcel.createRgbColor(r, g, b));
	};

	/**
	 * Create a color selecting it from one of the available color presets.
	 * @memberof Api
	 * @typeofeditors ["CSE"]
	 * @param {PresetColor} presetColor - A preset selected from the list of the available color preset names.
	 * @returns {ApiColor}
	 */
	Api.prototype.CreateColorByName = function (presetColor) {
		var rgb = AscFormat.mapPrstColor[presetColor];
		return new ApiColor(AscCommonExcel.createRgbColor((rgb >> 16) & 0xFF, (rgb >> 8) & 0xFF, rgb & 0xFF));
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
	 * Returns an object that represents the selection range
	 * @memberof ApiWorksheet
	 * @returns {ApiRange}
	 */
	ApiWorksheet.prototype.GetSelection = function () {
		var r = this.worksheet.selectionRange.getLast();
		return new ApiRange(this.worksheet.getRange3(r.r1, r.c1, r.r2, r.c2));
	};
	Object.defineProperty(ApiWorksheet.prototype, "Selection", {
		get: function () {
			return this.GetSelection();
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
	Object.defineProperty(ApiWorksheet.prototype, "Rows", {
		get: function () {
			return this.GetCells();
		}
	});

	/**
	 * Returns a ApiRange that represents all the cells on the rows range.
	 * @memberof ApiWorksheet
	 * @returns {ApiRange}
	 * @param {string | number} value
	 */
	ApiWorksheet.prototype.GetRows = function (value) {
		if (typeof value == "number" || value.indexOf(':') == -1) {
			value = parseInt(value);
			if (value > 0) {
				value --;
			}
			return new ApiRange(this.worksheet.getRange3(value, 0, value, AscCommon.gc_nMaxCol0));
		} else {
			value = value.split(':');
			for (var i = 0; i < value.length; ++i) {
				value[i] = parseInt(value[i]);
				if (value[i] > 0) {
					value[i] --;
				}
			}
			return new ApiRange(this.worksheet.getRange3(value[0], 0, value[1], AscCommon.gc_nMaxCol0));
		}
	};

	/**
	 * Returns a ApiRange that represents all the cells on the columns range.
	 * @memberof ApiWorksheet
	 * @returns {ApiRange}
	 * @param {string} sRange
	 */
	ApiWorksheet.prototype.GetCols = function (sRange) {
		if (sRange.indexOf(':') == -1) {
			sRange += ':' + sRange;
		}
		return new ApiRange(this.worksheet.getRange2(sRange));
	};
	Object.defineProperty(ApiWorksheet.prototype, "Cols", {
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
	 * Set a name to the current active sheet.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiWorksheet
	 * @param {string} name - The name which will be displayed for the current sheet at the sheet tab.
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
	 * Returns an object that represents the selected range of the current sheet. Can be a single cell - <b>A1</b>, or cells
	 * from a single row - <b>A1:E1</b>, or cells from a single column - <b>A1:A10</b>, or cells from several rows and columns - <b>A1:E10</b>.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiWorksheet
	 * @param {string} sRange - The range of cells from the current sheet.
	 * @returns {ApiRange}
	 */
	ApiWorksheet.prototype.GetRange = function (sRange) {
		return new ApiRange(this.worksheet.getRange2(sRange));
	};

	/**
	 * Returns an object that represents the selected range of the current sheet using the <b>row/column</b> coordinates for the cell selection.
	 * @memberof ApiWorksheet
	 * @param {Number} row - The number of the row to set the cell coordinates.
	 * @param {Number} col - The number of the column to set the cell coordinates.
	 * @returns {ApiRange}
	 */
	ApiWorksheet.prototype.GetRangeByNumber = function (row, col) {
		return new ApiRange(this.worksheet.getCell3(row, col));
	};

	/**
	 * Format the selected range of cells from the current sheet as a table (with the first row formatted as a header).
	 * <note>As the first row is always formatted as a table header, you need to select at least two rows for the table to be formed correctly.</note>
	 * @typeofeditors ["CSE"]
	 * @memberof ApiWorksheet
	 * @param {string} sRange - The range of cells from the current sheet which will be formatted as a table.
	 */
	ApiWorksheet.prototype.FormatAsTable = function (sRange) {
		this.worksheet.autoFilters.addAutoFilter('TableStyleLight9', AscCommonExcel.g_oRangeCache.getAscRange(sRange));
	};

	/**
	 * Set the width to the selected column of the current active sheet. The width is equal to the set number multiplied
	 * by 7 pixels - so if you set the width to 10 it will be equal to 70 pixels.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiWorksheet
	 * @param {number} column - The number of the column to set the width to.
	 * @param {number} width - The width of the column divided by 7 pixels.
	 */
	ApiWorksheet.prototype.SetColumnWidth = function (column, width) {
		this.worksheet.setColWidth(width, column, column);
	};

	/**
	 * Set Row height
	 * @memberof ApiWorksheet
	 * @param {number} row
	 * @param {number} height
	 */
	ApiWorksheet.prototype.SetRowHeight = function (row, height) {
		this.worksheet.setRowHeight(height, row, row, true);
	};

	/**
	 * Specifies whether the current sheet gridlines must be displayed or not.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiWorksheet
	 * @param {bool} value - Specifies whether the current sheet gridlines must be displayed or not. The default value is <b>true</b>.
	 */
	ApiWorksheet.prototype.SetDisplayGridlines = function (value) {
		this.worksheet.setDisplayGridlines(!!value);
	};

	/**
	 * Specifies whether the current sheet row/column headers must be displayed or not.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiWorksheet
	 * @param {bool} value - Specifies whether the current sheet row/column headers must be displayed or not. The default value is <b>true</b>.
	 */
	ApiWorksheet.prototype.SetDisplayHeadings = function (value) {
		this.worksheet.setDisplayHeadings(!!value);
	};

	/**
	 * Set left margin sheet
	 * @memberof ApiWorksheet
	 * @param {number} value
	 */
	ApiWorksheet.prototype.SetLeftMargin = function (value) {
		value = (typeof value !== 'number') ? 0 : value;		
		this.worksheet.PagePrintOptions.pageMargins.asc_setLeft(value);
	};
	/**
	 * Get left margin sheet
	 * @memberof ApiWorksheet
	 * @returns {number}
	 */
	ApiWorksheet.prototype.GetLeftMargin = function () {
		return this.worksheet.PagePrintOptions.pageMargins.asc_getLeft();
	};
	Object.defineProperty(ApiWorksheet.prototype, "LeftMargin", {
		get: function () {
			return this.GetLeftMargin();
		},
		set: function (value) {
			this.SetLeftMargin(value);
		}
	});

	/**
	 * Set right margin sheet
	 * @memberof ApiWorksheet
	 * @param {number} value
	 */
	ApiWorksheet.prototype.SetRightMargin = function (value) {
		value = (typeof value !== 'number') ? 0 : value;				
		this.worksheet.PagePrintOptions.pageMargins.asc_setRight(value);
	};
	/**
	 * Get right margin sheet
	 * @memberof ApiWorksheet
	 * @returns {number}
	 */
	ApiWorksheet.prototype.GetRightMargin = function () {
		return this.worksheet.PagePrintOptions.pageMargins.asc_getRight();
	};
	Object.defineProperty(ApiWorksheet.prototype, "RightMargin", {
		get: function () {
			return this.GetRightMargin();
		},
		set: function (value) {
			this.SetRightMargin(value);
		}
	});

	/**
	 * Set top margin sheet
	 * @memberof ApiWorksheet
	 * @param {number} value
	 */
	ApiWorksheet.prototype.SetTopMargin = function (value) {
		value = (typeof value !== 'number') ? 0 : value;				
		this.worksheet.PagePrintOptions.pageMargins.asc_setTop(value);
	};
	/**
	 * Get top margin sheet
	 * @memberof ApiWorksheet
	 * @returns {number}
	 */
	ApiWorksheet.prototype.GetTopMargin = function () {
		return this.worksheet.PagePrintOptions.pageMargins.asc_getTop();
	};
	Object.defineProperty(ApiWorksheet.prototype, "TopMargin", {
		get: function () {
			return this.GetTopMargin();
		},
		set: function (value) {
			this.SetTopMargin(value);
		}
	});

	/**
	 * Set bottom margin sheet
	 * @memberof ApiWorksheet
	 * @param {number} value
	 */
	ApiWorksheet.prototype.SetBottomMargin = function (value) {
		value = (typeof value !== 'number') ? 0 : value;				
		this.worksheet.PagePrintOptions.pageMargins.asc_setBottom(value);
	};
	/**
	 * Get bottom margin sheet
	 * @memberof ApiWorksheet
	 * @returns {number}
	 */
	ApiWorksheet.prototype.GetBottomMargin = function () {
		return this.worksheet.PagePrintOptions.pageMargins.asc_getBottom();
	};
	Object.defineProperty(ApiWorksheet.prototype, "BottomMargin", {
		get: function () {
			return this.GetBottomMargin();
		},
		set: function (value) {
			this.SetBottomMargin(value);
		}
	});

	/**
	 * Set page orientation
	 * @memberof ApiWorksheet
	 * @param {PageOrientation} PageOrientation
	 * */
	ApiWorksheet.prototype.SetPageOrientation = function (PageOrientation) {
		PageOrientation = (PageOrientation == 'xlPortrait') ? 0 : (PageOrientation == 'xlLandscape') ? 1 : 0;
		this.worksheet.PagePrintOptions.pageSetup.asc_setOrientation(PageOrientation);
	};

	/**
	 * Get page orientation
	 * @memberof ApiWorksheet
	 * @returns {PageOrientation}
	 * */
	ApiWorksheet.prototype.GetPageOrientation = function ()	{
		var PageOrientation = this.worksheet.PagePrintOptions.pageSetup.asc_getOrientation();
		return (PageOrientation) ? 'xlLandscape' : 'xlPortrait';
	};

	Object.defineProperty(ApiWorksheet.prototype, "PageOrientation", {
		get: function () {
			return this.GetPageOrientation();
		},
		set: function (PageOrientation) {
			this.SetPageOrientation(PageOrientation);
		}
	});

	Object.defineProperty(ApiWorksheet.prototype, "PrintHeadings", {
		get: function () {
			return this.worksheet.PagePrintOptions.asc_getHeadings();
		},
		set: function (value) {
			value = (typeof value === 'boolean') ? value : false;
			this.worksheet.PagePrintOptions.asc_setHeadings(value);
		}
	});

	Object.defineProperty(ApiWorksheet.prototype, "PrintGridlines", {
		get: function () {
			return this.worksheet.PagePrintOptions.asc_getGridLines();
		},
		set: function (value) {
			value = (typeof value === 'boolean') ? value : false;
			this.worksheet.PagePrintOptions.asc_setGridLines(value);
		}
	});

	/**
	 * Create a chart of the set type from the selected data range of the current sheet.
	 * @memberof ApiWorksheet
	 * @typeofeditors ["CSE"]
	 * <note>Please note, that the horizontal nColOffset and vertical nRowOffset offsets are calculated within the limits of the specified nFromCol column and nFromRow
	 * row cell only. If this value exceeds the cell width or height, another vertical/horizontal position will be set.</note>
	 * @param {string} sDataRange - The selected cell range which will be used to get the data for the chart, formed specifically and including the sheet name.
	 * @param {bool} bInRows - Specifies whether to take the data from the rows or from the columns. If true the data from the rows will be used.
	 * @param {ChartType} sType - The chart type used for the chart display.
	 * @param {number} nStyleIndex - The chart color style index (can be <b>1 - 48</b>, as described in OOXML specification).
	 * @param {EMU} nExtX - The chart width in English measure units
	 * @param {EMU} nExtY - The chart height in English measure units.
	 * @param {number} nFromCol - The number of the column where the beginning of the chart will be placed.
	 * @param {EMU} nColOffset - The offset from the nFromCol column to the left part of the chart measured in English measure units.
	 * @param {number} nFromRow - The number of the row where the beginning of the chart will be placed.
	 * @param {EMU} nRowOffset - The offset from the nFromRow row to the upper part of the chart measured in English measure units.
	 * @returns {ApiChart}
	 */
	ApiWorksheet.prototype.AddChart =
		function (sDataRange, bInRows, sType, nStyleIndex, nExtX, nExtY, nFromCol, nColOffset,  nFromRow, nRowOffset) {
			var settings = new Asc.asc_ChartSettings();
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
	 * Adds the shape to the current sheet with the parameters specified.
	 * <note>Please note, that the horizontal <code>nColOffset</code> and vertical <code>nRowOffset</code> offsets are
	 * calculated within the limits of the specified <code>nFromCol</code> column and <code>nFromRow</code> row cell
	 * only. If this value exceeds the cell width or height, another vertical/horizontal position will be set.</note>
	 * @typeofeditors ["CSE"]
	 * @memberof ApiWorksheet
	 * @param {ShapeType} [sType="rect"] - The shape type which specifies the preset shape geometry.
	 * @param {EMU} nWidth - The shape width in English measure units.
	 * @param {EMU} nHeight - The shape height in English measure units.
	 * @param {ApiFill} oFill - The color or pattern used to fill the shape.
	 * @param {ApiStroke} oStroke - The stroke used to create the element shadow.
	 * @param {number} nFromCol - The number of the column where the beginning of the image will be placed.
	 * @param {EMU} nColOffset - The offset from the <code>nFromCol</code> column to the left part of the shape measured in English measure units.
	 * @param {number} nFromRow - The number of the row where the beginning of the image will be placed.
	 * @param {EMU} nRowOffset - The offset from the <code>nFromRow</code> row to the upper part of the shape measured in English measure units.
	 * @returns {ApiShape}
	 * */
	ApiWorksheet.prototype.AddShape = function(sType, nWidth, nHeight, oFill, oStroke, nFromCol, nColOffset, nFromRow, nRowOffset){
		var oShape = AscFormat.builder_CreateShape(sType, nWidth/36000, nHeight/36000, oFill.UniFill, oStroke.Ln, null, this.worksheet.workbook.theme, this.worksheet.DrawingDocument, false, this.worksheet);
		private_SetCoords(oShape, this.worksheet, nWidth, nHeight, nFromCol, nColOffset,  nFromRow, nRowOffset);
		return new ApiShape(oShape);
	};


	/**
	 * Adds the image to the current sheet with the parameters specified.
	 * @memberof ApiWorksheet
	 * @param {string} sImageSrc - The image source where the image to be inserted should be taken from (currently only internet URL or Base64 encoded images are supported).
	 * @param {EMU} nWidth - The image width in English measure units.
	 * @param {EMU} nHeight - The image height in English measure units.
	 * @param {number} nFromCol - The number of the column where the beginning of the image will be placed.
	 * @param {EMU} nColOffset - The offset from the <code>nFromCol</code> column to the left part of the image measured in English measure units.
	 * @param {number} nFromRow - The number of the row where the beginning of the image will be placed.
	 * @param {EMU} nRowOffset - The offset from the <code>nFromRow</code> row to the upper part of the image measured in English measure units.
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
	 * Get the number of the row for the selected cell.
	 * @typeofeditors ["CSE"]
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
	 * Get the number of the column for the selected cell.
	 * @typeofeditors ["CSE"]
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
	 * Set cell offset
	 * @memberof ApiRange
	 * @param {Number} row
	 * @param {Number} col
	 */
	ApiRange.prototype.SetOffset = function (row, col) {
		this.range.setOffset({row: row, col: col});
	};

	/**
	 * Get cell adress
	 * @memberof ApiRange
	 * @param {boolean} RowAbs
	 * @param {boolean} ColAbs
	 * @param {string} RefStyle
	 * @param {boolean} External
	 * @param {range} RelativeTo
	 * @returns {string}
	 */
	ApiRange.prototype.GetAddress = function (RowAbs, ColAbs, RefStyle, External, RelativeTo) {
		if (this.range.isOneCell()) {
			var range = this.range.bbox;
			var ws = this.range.worksheet;
			if (RefStyle == 'xlA1') {
				(ColAbs && RowAbs) ? range.setAbs(1, 1, 1, 1) : (ColAbs) ? range.setAbs(0, 1, 0, 1) : (RowAbs) ? range.setAbs(1, 0, 1, 0) : range.setAbs(0, 0, 0, 0);
			}
			// } else if (!RelativeTo) { 
			// 	name[1] = (ColAbs) ? 'R' + (range[1] + 1) : 'R[' + range[1] + ']';
			// 	name[2] = (ColAbs) ? 'C' + (range[0] + 1) : 'C[' + range[0] + ']';
			// } else {
			// 	var relRange = [RelativeTo.range.bbox.c1, RelativeTo.range.bbox.c1];
			// 	name[1] = (ColAbs) ? 'R' + (range[1] + 1) : 'R[' + (range[1] - relRange[1]) + ']'; 
			// 	name[2] = (ColAbs) ? 'C' + (range[0] + 1) : 'C[' + (range[0] - relRange[0]) + ']';
			// }
			return (External) ? '[' + ws.workbook.oApi.DocInfo.Title + ']' + AscCommon.parserHelp.get3DRef(ws.sName, range.getName()) : range.getName();
		} else {
			return null;
		}
	};

	/**
	 * Get count rows or columns
	 * @memberof ApiRange
	 * @returns {Number}
	 */
	ApiRange.prototype.GetCount = function () {
		var range = this.range.bbox;
		var	count;
		switch (range.getType()) {
			case 1:
				count = (range.c2 - range.c1 + 1) * (range.r2 - range.r1 + 1);
				break;

			case 2:		
				count = range.c2 - range.c1 + 1;				
				break;

			case 3:
				count = range.r2 - range.r1 + 1;				
				break;

			case 4:
				count = range.r2 * range.c2;				
				break;
		}
		return count;
	};
	Object.defineProperty(ApiRange.prototype, "Count", {
		get: function () {
			return this.GetCount();
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
	 * Set the value for the current cell or a cell range.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiRange
	 * @param {string} value - The general value for the cell or cell range in string format.
	 */
	ApiRange.prototype.SetValue = function (value) {
		this.range.setValue(checkFormat(value).getValue());
		// ToDo update range in setValue
		var worksheet = this.range.worksheet;
		worksheet.workbook.handlers.trigger("cleanCellCache", worksheet.getId(), [this.range.bbox], true);
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
	 * Set the text color for the current cell range with the previously created color object.
	 * @memberof ApiRange
	 * @typeofeditors ["CSE"]
	 * @param {ApiColor} color - The color object previously created to set the color to the text in the cell/cell range.
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
	 * Get hidden value
	 * @memberof ApiRange
	 * @returns {boolean}
	 */
	ApiRange.prototype.GetHidden = function () {
		var range = this.range;
		var worksheet = range.worksheet;
		var bbox = range.bbox;
		switch (bbox.getType()) {
			case 2:		
				return worksheet.getColHidden(bbox.c1);	

			case 3:
				return worksheet.getRowHidden(bbox.r1);				

			default:
				return null;
		}
	};
	/**
	 * Set hidden value
	 * @memberof ApiRange
	 * @param {boolean} value
	 */
	ApiRange.prototype.SetHidden = function (value) {
		var range = this.range;
		var worksheet = range.worksheet;
		var bbox = range.bbox;
		switch (bbox.getType()) {
			case 2:		
				worksheet.setColHidden(value, bbox.c1, bbox.c2);	
				break;

			case 3:
				worksheet.setRowHidden(value, bbox.r1, bbox.r2);
				break;				
		}
	};
	Object.defineProperty(ApiRange.prototype, "Hidden", {
		get: function () {
			return this.GetHidden();
		},
		set: function (value) {
			this.SetHidden(value);
		}
	});

	/**
	 * Get columns width value
	 * @memberof ApiRange
	 * @returns {number}
	 */
	ApiRange.prototype.GetColumnWidth = function () {
		var ws = this.range.worksheet;
		var width = ws.getColWidth(this.range.bbox.c1);
		width = (width < 0) ? AscCommonExcel.oDefaultMetrics.ColWidthChars : width; 
		return ws.colWidthToCharCount(ws.modelColWidthToColWidth(width));
	};
	/**
	 * Set columns width value
	 * @memberof ApiRange
	 * @param {number} width
	 */
	ApiRange.prototype.SetColumnWidth = function (width) {
		this.range.worksheet.setColWidth(width, this.range.bbox.c1, this.range.bbox.c2);
	};
	Object.defineProperty(ApiRange.prototype, "ColumnWidth", {
		get: function () {
			return this.GetColumnWidth();
		},
		set: function (width) {
			this.SetColumnWidth(width);
		}
	});
	Object.defineProperty(ApiRange.prototype, "Width", {
		get: function () {
			var max = this.range.bbox.c2 - this.range.bbox.c1;
			var ws = this.range.worksheet;
			var sum = 0;
			var width;
			for (var i = 0; i <= max; i++) {
				width = ws.getColWidth(i);
				width = (width < 0) ? AscCommonExcel.oDefaultMetrics.ColWidthChars : width;
				sum += ws.modelColWidthToColWidth(width);
			}
			return sum;
		}
	});

	/**
	 * Get rows height value
	 * @memberof ApiRange
	 * @returns {number}
	 */
	ApiRange.prototype.GetRowHeight = function () {
		return this.range.worksheet.getRowHeight(this.range.bbox.r1);
	};
	/**
	* Set rows height value
	* @memberof ApiRange
	* @param {number} height
	 */
	ApiRange.prototype.SetRowHeight = function (height) {
		this.range.worksheet.setRowHeight(height, this.range.bbox.r1, this.range.bbox.r2, false);
	};
	Object.defineProperty(ApiRange.prototype, "RowHeight", {
		get: function () {
			return this.GetRowHeight();
		},
		set: function (height) {
			this.SetRowHeight(height);
		}
	});
	Object.defineProperty(ApiRange.prototype, "Height", {
		get: function () {
			var max = this.range.bbox.r2 - this.range.bbox.r1;
			var sum = 0;
			for (var i = 0; i <= max; i++) {
				sum += this.range.worksheet.getRowHeight(i);
			}
			return sum;
		}
	});

	/**
	 * Set the font size for the characters of the current cell range.
	 * @memberof ApiRange
	 * @typeofeditors ["CSE"]
	 * @param {number} size - The font size value measured in points.
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
	 * Set the specified font family as the font name for the current cell range.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiRange
	 * @param {string} name - The font family name used for the current cell range.
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
	 * Set the vertical alignment of the text in the current cell range.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiRange
	 * @param {'center' | 'bottom' | 'top'} value - The parameters will define the vertical alignment that will be applied to the cell contents.
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
	 * Set the horizontal alignment of the text in the current cell range.
	 * @typeofeditors ["CSE"]
	 * @param {'left' | 'right' | 'center' | 'justify'} value - Set the horizontal alignment of the text in the current cell range.
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
	 * Set the bold property to the text characters in the current cell or cell range.
	 * @memberof ApiRange
	 * @typeofeditors ["CSE"]
	 * @param {bool} value - Specifies that the contents of this cell/cell range are displayed bold.
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
	 * Set the italic property to the text characters in the current cell or cell range.
	 * @memberof ApiRange
	 * @typeofeditors ["CSE"]
	 * @param {bool} value - Specifies that the contents of this cell/cell range are displayed italicized.
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
	 * Specify that the contents of this cell/cell range are displayed along with a line appearing directly below the character.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiRange
	 * @param {'none' | 'single' | 'singleAccounting' | 'double' | 'doubleAccounting'} value - Specifies the type of the
	 * line displayed under the characters. The following values are available:
	 * * <b>"none"</b> - for no underlining;
	 * * <b>"single"</b> - for the single line underlining the cell contents;
	 * * <b>"singleAccounting"</b> - for the single line underlining the cell contents but not protruding beyond the cell borders;
	 * * <b>"double"</b> - for the double line underlining the cell contents;
	 * * <b>"doubleAccounting"</b> - for the double line underlining the cell contents but not protruding beyond the cell borders.
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
	 * Specify that the contents of the cell/cell range are displayed with a single horizontal line through the center of the line.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiRange
	 * @param {bool} value - Specifies that the contents of the current cell/cell range are displayed struck through.
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
	 * Specifies whether the words in the cell must be wrapped to fit the cell size or not.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiRange
	 * @param {bool} value - When set to <b>true</b> the words in the cell will be wrapped to fit the cell size.
	 */
	ApiRange.prototype.SetWrap = function (value) {
		this.range.setWrap(!!value);
	};
	ApiRange.prototype.GetWrapText = function () {
		return this.range.getAlign().getWrap();
	};
	Object.defineProperty(ApiRange.prototype, "WrapText", {
		set: function (value) {
			this.SetWrap(value);
		},
		get: function () {
			return this.GetWrapText();
		}
	});

	/**
	 * Set the background color for the current cell range with the previously created color object.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiRange
	 * @param {ApiColor} color - The color object previously created to set the color to the background in the cell/cell range.
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
	 * Specifies whether the number in the cell should be treated like number, currency, date, time, etc. or just like text.
	 * @memberof ApiRange
	 * @typeofeditors ["CSE"]
	 * @param {string} value - Specifies the mask applied to the number in the cell.
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
	 * Set the border to the cell/cell range with the parameters specified.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiRange
	 * @param {BordersIndex} bordersIndex - Specifies the cell border position.
	 * @param {LineStyle} lineStyle - Specifies the line style used to form the cell border.
	 * @param {ApiColor} color - The color object previously created to set the color to the cell border.
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
	 * Merge the selected cell range into a single cell or a cell row.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiRange
	 * @param {bool} across - When set to <b>true</b>, the cells within the selected range will be merged along the rows,
	 * but remain split in the columns. When set to <b>false</b>, the whole selected range of cells will be merged into a single cell.
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
	 * Split the selected merged cell range into single cells.
	 * @typeofeditors ["CSE"]
	 * @memberof ApiRange
	 */
	ApiRange.prototype.UnMerge = function () {
		this.range.unmerge();
	};
	
	/**
	 * Returns one cell or cells from the megre area
	 * @memberof ApiRange
	 * @returns {"ApiRange"}
	 */
	Object.defineProperty(ApiRange.prototype, "MergeArea", {
		get: function () {
			if (this.range.isOneCell()) {
				var bb = this.range.hasMerged();
				return new ApiRange((bb) ? AscCommonExcel.Range.prototype.createFromBBox(this.range.worksheet, bb) : this.range);
			} else {
				return new Error('Range must be is one cell.');
			}
		}
	});

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
	 * Get the type of the class based on this base class.
	 * @typeofeditors ["CSE"]
	 * @returns {"drawing"}
	 */
	ApiDrawing.prototype.GetClassType = function()
	{
		return "drawing";
	};

	/**
	 * Set the size of the object (image, shape, chart) bounding box.
	 * @typeofeditors ["CSE"]
	 * @param {EMU} nWidth - The object width measured in English measure units.
	 * @param {EMU} nHeight - The object height measured in English measure units.
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
	 * Change the position for the drawing object.
	 * <note>Please note, that the horizontal nColOffset and vertical nRowOffset offsets are calculated within the limits of
	 * the specified nFromCol column and nFromRow row cell only. If this value exceeds the cell width or height, another vertical/horizontal position will be set.</note>
	 * @typeofeditors ["CSE"]
	 * @param {number} nFromCol - The number of the column where the beginning of the drawing object will be placed.
	 * @param {EMU} nColOffset - The offset from the nFromCol column to the left part of the drawing object measured in English measure units.
	 * @param {number} nFromRow - The number of the row where the beginning of the drawing object will be placed.
	 * @param {EMU} nRowOffset - The offset from the nFromRow row to the upper part of the drawing object measured in English measure units.
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
	 * @typeofeditors ["CDE", "CSE"]
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
	 * @typeofeditors ["CSE"]
	 * @returns {"chart"}
	 */
	ApiChart.prototype.GetClassType = function()
	{
		return "chart";
	};

	/**
	 *  Specifies a chart title
	 *  @typeofeditors ["CSE"]
	 *  @param {string} sTitle - The title which will be displayed for the current chart.
	 *  @param {hps} nFontSize - The text size value measured in points.
	 *  @param {?bool} bIsBold
	 */
	ApiChart.prototype.SetTitle = function (sTitle, nFontSize, bIsBold)
	{
		AscFormat.builder_SetChartTitle(this.Chart, sTitle, nFontSize, bIsBold);
	};

	/**
	 *  Specify the horizontal axis chart title.
	 *  @typeofeditors ["CSE"]
	 *  @param {string} sTitle - The title which will be displayed for the horizontal axis of the current chart.
	 *  @param {hps} nFontSize - The text size value measured in points.
	 *  @param {?bool} bIsBold
	 * */
	ApiChart.prototype.SetHorAxisTitle = function (sTitle, nFontSize, bIsBold)
	{
		AscFormat.builder_SetChartHorAxisTitle(this.Chart, sTitle, nFontSize, bIsBold);
	};

	/**
	 *  Specify the vertical axis chart title.
	 *  @typeofeditors ["CSE"]
	 *  @param {string} sTitle - The title which will be displayed for the vertical axis of the current chart.
	 *  @param {hps} nFontSize - The text size value measured in points.
	 *  @param {?bool} bIsBold
	 * */
	ApiChart.prototype.SetVerAxisTitle = function (sTitle, nFontSize, bIsBold)
	{
		AscFormat.builder_SetChartVertAxisTitle(this.Chart, sTitle, nFontSize, bIsBold);
	};


	/**
	 * Specifies the direction of the data displayed on the vertical axis.
	 * @typeofeditors ["CSE"]
	 * @param {bool} bIsMinMax - The <code>true</code> value will set the normal data direction for the vertical axis (from minimum to maximum).
	 * The <code>false</code> value will set the inverted data direction for the vertical axis (from maximum to minimum).
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
	 * Specifies the direction of the data displayed on the horizontal axis.
	 * @typeofeditors ["CSE"]
	 * @param {bool} bIsMinMax - The <code>true</code> value will set the normal data direction for the horizontal axis
	 * (from minimum to maximum). The <code>false</code> value will set the inverted data direction for the horizontal axis (from maximum to minimum).
	 * */
	ApiChart.prototype.SetHorAxisOrientation = function(bIsMinMax){
		AscFormat.builder_SetChartHorAxisOrientation(this.Chart, bIsMinMax);
	};

	/**
	 * Specifies a legend position
	 * @typeofeditors ["CSE"]
	 * @param {"left" | "top" | "right" | "bottom" | "none"} sLegendPos - The position of the chart legend inside the chart window.
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
	 * Specifies which chart data labels are shown for the chart.
	 * @typeofeditors ["CSE"]
	 * @param {boolean} bShowSerName - Whether to show or hide the source table column names used for the data which the chart will be build from.
	 * @param {boolean} bShowCatName - Whether to show or hide the source table row names used for the data which the chart will be build from.
	 * @param {boolean} bShowVal - Whether to show or hide the chart data values.
	 * @param {boolean} bShowPercent - Whether to show or hide the percent for the data values (works with stacked chart types).
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
	 * Set the possible values for the position of the chart tick labels in relation to the main vertical label or the values of the chart data.
	 * @typeofeditors ["CSE"]
	 * @param {TickLabelPosition} sTickLabelPosition - Set the position of the chart vertical tick labels.
	 * */
	ApiChart.prototype.SetVertAxisTickLabelPosition = function(sTickLabelPosition)
	{
		AscFormat.builder_SetChartVertAxisTickLablePosition(this.Chart, sTickLabelPosition);
	};
	/**
	 * Set the possible values for the position of the chart tick labels in relation to the main horizontal label or the values of the chart data.
	 * @typeofeditors ["CSE"]
	 * @param {TickLabelPosition} sTickLabelPosition - Set the position of the chart horizontal tick labels.
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
			}
		}
	};


	/**
	 * Get the type of this class.
	 * @typeofeditors ["CSE"]
	 * @returns {"color"}
	 */
	ApiColor.prototype.GetClassType = function () {
		return "color";
	};


	Api.prototype["Format"] = Api.prototype.Format;
	Api.prototype["AddSheet"] = Api.prototype.AddSheet;
	Api.prototype["GetSheets"] = Api.prototype.GetSheets;
	Api.prototype["GetActiveSheet"] = Api.prototype.GetActiveSheet;
	Api.prototype["GetSheet"] = Api.prototype.GetSheet;
	Api.prototype["GetThemesColors"] = Api.prototype.GetThemesColors;
	Api.prototype["SetThemeColors"] = Api.prototype.SetThemeColors;
	Api.prototype["CreateNewHistoryPoint"] = Api.prototype.CreateNewHistoryPoint;
	Api.prototype["CreateColorFromRGB"] = Api.prototype.CreateColorFromRGB;
	Api.prototype["CreateColorByName"] = Api.prototype.CreateColorByName;

	ApiWorksheet.prototype["GetVisible"] = ApiWorksheet.prototype.GetVisible;
	ApiWorksheet.prototype["SetVisible"] = ApiWorksheet.prototype.SetVisible;
	ApiWorksheet.prototype["GetActiveCell"] = ApiWorksheet.prototype.GetActiveCell;
	ApiWorksheet.prototype["GetSelection"] = ApiWorksheet.prototype.GetSelection;
	ApiWorksheet.prototype["GetCells"] = ApiWorksheet.prototype.GetCells;
	ApiWorksheet.prototype["GetCols"] = ApiWorksheet.prototype.GetCols;
	ApiWorksheet.prototype["GetRows"] = ApiWorksheet.prototype.GetRows;
	ApiWorksheet.prototype["GetUsedRange"] = ApiWorksheet.prototype.GetUsedRange;
	ApiWorksheet.prototype["GetName"] = ApiWorksheet.prototype.GetName;
	ApiWorksheet.prototype["SetName"] = ApiWorksheet.prototype.SetName;
	ApiWorksheet.prototype["GetIndex"] = ApiWorksheet.prototype.GetIndex;
	ApiWorksheet.prototype["GetRange"] = ApiWorksheet.prototype.GetRange;
	ApiWorksheet.prototype["GetRangeByNumber"] = ApiWorksheet.prototype.GetRangeByNumber;
	ApiWorksheet.prototype["FormatAsTable"] = ApiWorksheet.prototype.FormatAsTable;
	ApiWorksheet.prototype["SetColumnWidth"] = ApiWorksheet.prototype.SetColumnWidth;
	ApiWorksheet.prototype["SetRowHeight"] = ApiWorksheet.prototype.SetRowHeight;
	ApiWorksheet.prototype["SetDisplayGridlines"] = ApiWorksheet.prototype.SetDisplayGridlines;
	ApiWorksheet.prototype["SetDisplayHeadings"] = ApiWorksheet.prototype.SetDisplayHeadings;
	ApiWorksheet.prototype["SetLeftMargin"] = ApiWorksheet.prototype.SetLeftMargin;
	ApiWorksheet.prototype["GetLeftMargin"] = ApiWorksheet.prototype.GetLeftMargin;	
	ApiWorksheet.prototype["SetRightMargin"] = ApiWorksheet.prototype.SetRightMargin;
	ApiWorksheet.prototype["GetRightMargin"] = ApiWorksheet.prototype.GetRightMargin;
	ApiWorksheet.prototype["SetTopMargin"] = ApiWorksheet.prototype.SetTopMargin;
	ApiWorksheet.prototype["GetTopMargin"] = ApiWorksheet.prototype.GetTopMargin;	
	ApiWorksheet.prototype["SetBottomMargin"] = ApiWorksheet.prototype.SetBottomMargin;
	ApiWorksheet.prototype["GetBottomMargin"] = ApiWorksheet.prototype.GetBottomMargin;		
	ApiWorksheet.prototype["SetPageOrientation"] = ApiWorksheet.prototype.SetPageOrientation;
	ApiWorksheet.prototype["GetPageOrientation"] = ApiWorksheet.prototype.GetPageOrientation;
	ApiWorksheet.prototype["AddChart"] = ApiWorksheet.prototype.AddChart;
	ApiWorksheet.prototype["AddShape"] = ApiWorksheet.prototype.AddShape;
	ApiWorksheet.prototype["AddImage"] = ApiWorksheet.prototype.AddImage;
	ApiWorksheet.prototype["ReplaceCurrentImage"] = ApiWorksheet.prototype.ReplaceCurrentImage;

	ApiRange.prototype["GetRow"] = ApiRange.prototype.GetRow;
	ApiRange.prototype["GetCol"] = ApiRange.prototype.GetCol;
	ApiRange.prototype["SetOffset"] = ApiRange.prototype.SetOffset;
	ApiRange.prototype["GetAddress"] = ApiRange.prototype.GetAddress;	
	ApiRange.prototype["GetCount"] = ApiRange.prototype.GetCount;
	ApiRange.prototype["GetValue"] = ApiRange.prototype.GetValue;
	ApiRange.prototype["SetValue"] = ApiRange.prototype.SetValue;
	ApiRange.prototype["SetFontColor"] = ApiRange.prototype.SetFontColor;
	ApiRange.prototype["GetHidden"] = ApiRange.prototype.GetHidden;
	ApiRange.prototype["SetHidden"] = ApiRange.prototype.SetHidden;	
	ApiRange.prototype["GetColumnWidth"] = ApiRange.prototype.GetColumnWidth;	
	ApiRange.prototype["SetColumnWidth"] = ApiRange.prototype.SetColumnWidth;	
	ApiRange.prototype["GetRowHeight"] = ApiRange.prototype.GetRowHeight;
	ApiRange.prototype["SetRowHeight"] = ApiRange.prototype.SetRowHeight;
	ApiRange.prototype["SetFontSize"] = ApiRange.prototype.SetFontSize;
	ApiRange.prototype["SetFontName"] = ApiRange.prototype.SetFontName;
	ApiRange.prototype["SetAlignVertical"] = ApiRange.prototype.SetAlignVertical;
	ApiRange.prototype["SetAlignHorizontal"] = ApiRange.prototype.SetAlignHorizontal;
	ApiRange.prototype["SetBold"] = ApiRange.prototype.SetBold;
	ApiRange.prototype["SetItalic"] = ApiRange.prototype.SetItalic;
	ApiRange.prototype["SetUnderline"] = ApiRange.prototype.SetUnderline;
	ApiRange.prototype["SetStrikeout"] = ApiRange.prototype.SetStrikeout;
	ApiRange.prototype["SetWrap"] = ApiRange.prototype.SetWrap;
	ApiRange.prototype["SetWrapText"] = ApiRange.prototype.SetWrap;	
	ApiRange.prototype["GetWrapText"] = ApiRange.prototype.GetWrapText;
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
