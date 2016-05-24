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
   * Returns an object that represents the range
   * @memberof ApiWorksheet
   * @param {string} sRange
   * @returns {ApiRange}
   */
  ApiWorksheet.prototype.getRange = function(sRange) {
    return new ApiRange(this.worksheet.getRange2(sRange));
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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Export
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  Api.prototype["GetActiveSheet"] = Api.prototype.GetActiveSheet;

  ApiWorksheet.prototype["getRange"] = ApiWorksheet.prototype.getRange;
  ApiWorksheet.prototype["setColumnWidth"] = ApiWorksheet.prototype.setColumnWidth;

  ApiRange.prototype["setValue"] = ApiRange.prototype.setValue;
}(window, null));
