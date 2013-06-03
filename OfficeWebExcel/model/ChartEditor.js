/* ChartEditor.js
 *
 * Author: Dmitry Vikulov
 * Date:   13/12/2012
 */
 
 function ChartEditor() {
 
	//-----------------------------------------------------------------------------------
	// Private
	//-----------------------------------------------------------------------------------
	
	var _iframeName = "chartEditorFrame";
	var _chartType = null;
	var _chartSubType = null;
	
	var _chartList = [];
	var _chartObject = function() {
		return {
			wbBin: null,
			imageBase64: null
		}
	}	
	
	//-----------------------------------------------------------------------------------
	// Public
	//-----------------------------------------------------------------------------------
	
	var _this = this;
	_this.api = null;
	
	//-----------------------------------------------------------------------------------
	// Public methods
	//-----------------------------------------------------------------------------------
	
	_this.setChartOptions = function(chartType, chartSubType) {
		_chartType = chartType;
		_chartSubType = chartSubType;
	}
	
	_this.getFrame = function(chartIndex) {
		
		this._chartIndex = chartIndex;
		
		var spreadsheetReady = function(type, id) {
			if (type === c_oAscAsyncActionType.BlockInteraction) {
				switch (id) {
					case c_oAscAsyncAction.Open:
					
						// Ставим фокус в окно фрейма		
						var iframe = window.frames[_iframeName];
						var inputFrame = iframe.document.getElementById(_this.api.topLineEditorName);
						inputFrame.focus();
					
						if ( _this._chartIndex == undefined )
							_this.initChartData();
						else
							_this._chartIndex = undefined;
						break;
				}
			}
		}		
		var onloadFrame = function() {
			
			var iframe = window.frames[_iframeName];
			_this.api = iframe['Asc'].editor;			
			if ( _this.api ) {
			
				_this.api.asc_registerCallback("asc_onEndAction", spreadsheetReady);
				
				if ( _this._chartIndex != undefined )
					_this.api.asc_openChartSpreadsheet(_chartList[_this._chartIndex].wbBin);
				else
					_this.api.asc_openChartSpreadsheet();
			}
		}		
		
		var iframe = document.createElement("iframe");
		iframe.onload = onloadFrame;
		iframe.setAttribute("id", _iframeName);
		iframe.setAttribute("name", _iframeName);
		iframe.setAttribute("src", "http://192.168.3.20/OfficeWebExcel/Spreadsheettestmenu.html?doctype=spreadsheet&charteditor=1");
		iframe.setAttribute("width", "100%");
		iframe.setAttribute("height", "100%");
		
		return iframe;
	}
		
	_this.removeFrame = function() {
		if (!!window.frames[_iframeName])
			delete window.frames[_iframeName];
	}
		
	_this.initChartData = function() {
	
		// Строим диаграмму
		var worksheet = _this.api.wb.wsViews[_this.api.wb.wsActive];
		var chart = _this.api.asc_getChartObject();
		chart.bChartEditor = true;
		
		chart.worksheet = worksheet;
		chart.type = _chartType;
		chart.subType = _chartSubType;
		
		chart.title = "Chart";
		chart.xAxis.title = "axis Х";
		chart.xAxis.show = true;
		
		chart.yAxis.title = "axis У";
		chart.yAxis.show = true;
		
		chart.legend.position = c_oAscChartLegend.right;
		chart.legend.show = true;
		
		chart.range.intervalObject = chart.worksheet.objectRender.formulaToRange("Sheet1!A1:C3");
		chart.range.calcInterval();
		chart.buildSeries();
		
		// Выставляем значения ячеек
		var aCells = chart.range.intervalObject.getCells();
		for ( var i = 0; i < aCells.length; i++ ) {
			aCells[i].setValue(i + 1);
		}
		worksheet._updateCellsRange(chart.range.intervalObject.getBBox0());
		worksheet.objectRender.addChartDrawingObject(chart, true);
	}
	
	_this.getChartEditorInfo = function() {
		
		var info = new _chartObject();
		var oBinaryFileWriter = _this.api.asc_getBinaryFileWriter();
		info.wbBin = oBinaryFileWriter.Write();
		info.imageBase64 = _this.api.asc_getChartEditorImg();
		
		_chartList.push(info);
		
		return info;
	}
	
	_this.getChartCount = function() {
		return _chartList.length;
	}
 }