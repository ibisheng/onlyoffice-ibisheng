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
   * Class representing a graphical object.
   * @constructor
   */
  function ApiDrawing(Drawing)
  {
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
  function ApiChart(Chart)
  {
    ApiChart.superclass.constructor.call(this, Chart.parent);
    this.Chart = Chart;
  }
  AscCommon.extendClass(ApiChart, ApiDrawing);

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
   * Set column width
   * @memberof ApiWorksheet
   * @param {string} sDataRange
   * @param {bool} bInRows
   * @param {ChartType} sType
   * @param {number} nStyleIndex
   * @param {string} sFromRange
   * @param {string} sToRange
   * @param {}
   */
  ApiWorksheet.prototype.addChart = function(sDataRange, bInRows, sType, nStyleIndex, nFromCol, nFromRow, nToCol, nToRow) {

    History.Create_NewPoint();
    var settings = new AscCommon.asc_ChartSettings();
    switch (sType)
    {
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
    if(AscFormat.isRealNumber(nStyleIndex))
    {
      oChart.setStyle(nStyleIndex);
    }
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
  ApiWorksheet.prototype["addChart"] = ApiWorksheet.prototype.addChart;

  ApiRange.prototype["setValue"] = ApiRange.prototype.setValue;
  ApiRange.prototype["setFontColor"] = ApiRange.prototype.setFontColor;
  ApiRange.prototype["setFontSize"] = ApiRange.prototype.setFontSize;
  ApiRange.prototype["setFontName"] = ApiRange.prototype.setFontName;
  ApiRange.prototype["setAlignVertical"] = ApiRange.prototype.setAlignVertical;
  ApiRange.prototype["setAlignHorizontal"] = ApiRange.prototype.setAlignHorizontal;
}(window, null));
