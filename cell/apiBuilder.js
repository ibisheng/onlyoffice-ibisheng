"use strict";

(function(window, builder) {
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
   * Returns an object that represents the active sheet
   * @memberof Api
   * @returns {ApiWorksheet}
   */
  Api.prototype.GetActiveSheet = function() {
    return new ApiWorksheet(this.wbModel.getWorksheet(this.wbModel.getActive()));
  };

  /**
   * Set sheet name
   * @memberof ApiWorksheet
   * @param {string} name
   */
  ApiWorksheet.prototype.setName = function(name) {
    this.worksheet.setName(name);
  };

  /**
   * Returns an object that represents the range
   * @memberof ApiWorksheet
   * @param {string} sRange
   * @returns {ApiRange}
   */
  ApiWorksheet.prototype.getRange = function(sRange) {
    return new ApiRange(this.worksheet.getRange2(sRange));
  };

  /**
   * Format as table
   * @memberof ApiWorksheet
   * @param {string} sRange
   */
  ApiWorksheet.prototype.formatAsTable = function(sRange) {
    this.worksheet.autoFilters.addAutoFilter('TableStyleLight9', AscCommonExcel.g_oRangeCache.getAscRange(sRange));
  };

  /**
   * Set column width
   * @memberof ApiWorksheet
   * @param {number} column
   * @param {number} width
   */
  ApiWorksheet.prototype.setColumnWidth = function(column, width) {
    this.worksheet.setColWidth(width, column, column);
  };

  /**
   * Set cell value
   * @memberof ApiRange
   * @param {string} val
   */
  ApiRange.prototype.setValue = function(val) {
    this.range.setValue(val);
  };

  /**
   * Set text color in the rgb format.
   * @param {byte} r
   * @param {byte} g
   * @param {byte} b
   */
  ApiRange.prototype.setFontColor = function(r, g, b) {
    this.range.setFontcolor(new AscCommonExcel.RgbColor((r << 16) +  (g << 8) +  b));
  };

  /**
   * Set font size
   * @param {number} size
   */
  ApiRange.prototype.setFontSize = function(size) {
    this.range.setFontsize(size);
  };

  /**
   * Set font name
   * @param {string} name
   */
  ApiRange.prototype.setFontName = function(name) {
    this.range.setFontname(name);
  };

  /**
   * Set align vertical
   * @param {'center' | 'bottom' | 'top'} value
   */
  ApiRange.prototype.setAlignVertical = function(value) {
    this.range.setAlignVertical(value);
  };

  /**
   * Set align horizontal
   * @param {'left' | 'right' | 'center' | 'justify'} value
   */
  ApiRange.prototype.setAlignHorizontal = function(value) {
    this.range.setAlignHorizontal(value);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Export
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  Api.prototype["GetActiveSheet"] = Api.prototype.GetActiveSheet;

  ApiWorksheet.prototype["setName"] = ApiWorksheet.prototype.setName;
  ApiWorksheet.prototype["getRange"] = ApiWorksheet.prototype.getRange;
  ApiWorksheet.prototype["formatAsTable"] = ApiWorksheet.prototype.formatAsTable;
  ApiWorksheet.prototype["setColumnWidth"] = ApiWorksheet.prototype.setColumnWidth;

  ApiRange.prototype["setValue"] = ApiRange.prototype.setValue;
  ApiRange.prototype["setFontColor"] = ApiRange.prototype.setFontColor;
  ApiRange.prototype["setFontSize"] = ApiRange.prototype.setFontSize;
  ApiRange.prototype["setFontName"] = ApiRange.prototype.setFontName;
  ApiRange.prototype["setAlignVertical"] = ApiRange.prototype.setAlignVertical;
  ApiRange.prototype["setAlignHorizontal"] = ApiRange.prototype.setAlignHorizontal;
}(window, null));
