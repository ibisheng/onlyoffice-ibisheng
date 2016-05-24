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
   * Remove element by specified position.
   * @memberof ApiWorksheet
   * @param {string} sRange
   * @returns {ApiRange}
   */
  ApiWorksheet.prototype.getRange = function(sRange) {
    return new ApiRange(this.worksheet.getRange2(sRange));
  };

  /**
   * Remove element by specified position.
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

  ApiRange.prototype["setValue"] = ApiRange.prototype.setValue;
}(window, null));
