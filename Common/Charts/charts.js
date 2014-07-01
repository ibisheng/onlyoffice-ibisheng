"use strict";

function ChartPreviewManager() {
	
	var _this = this;
	var previewGroups = [];

    var chartsByTypes = [];

    var CHART_PREVIEW_WIDTH_PIX = 50;
    var CHART_PREVIEW_HEIGHT_PIX = 50;

    var  _canvas_charts = null;

    _this.createAscChart = function(type)
    {
        function createItem(value) {
            return { numFormatStr: "General", isDateTimeFormat: false, val: value, isHidden: false };
        }

        // Set data
        var chart = new asc_CChart();
        chart.data = [];
        chart.series = [];
        switch(type)
        {
            case c_oAscChartTypeSettings.lineNormal:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(2), createItem(3), createItem(2), createItem(3) ];
                chart.series.push(ser);
                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(1), createItem(2), createItem(3), createItem(2) ];
                chart.series.push(ser);
                break;
            }
            case c_oAscChartTypeSettings.lineStacked:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(1), createItem(6), createItem(2), createItem(8) ];
                chart.series.push(ser);
                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(4), createItem(4), createItem(4), createItem(5) ];
                chart.series.push(ser);
                break;
            }
            case c_oAscChartTypeSettings.lineStackedPer:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(2), createItem(4), createItem(2), createItem(4) ];
                chart.series.push(ser);

                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(2), createItem(2), createItem(2), createItem(2) ];
                chart.series.push(ser);
                break;
            }

            case c_oAscChartTypeSettings.hBarNormal:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(4) ];
                chart.series.push(ser);

                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(3) ];
                chart.series.push(ser);

                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(2) ];
                chart.series.push(ser);

                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(1) ];
                chart.series.push(ser);
                break;
            }

            case c_oAscChartTypeSettings.hBarStacked:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(4), createItem(3), createItem(2), createItem(1) ];
                chart.series.push(ser);

                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(5), createItem(4), createItem(3), createItem(2) ];
                break;
            }

            case c_oAscChartTypeSettings.hBarStackedPer:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(7), createItem(5), createItem(3), createItem(1) ];
                chart.series.push(ser);

                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(7), createItem(6), createItem(5), createItem(4) ];
                chart.series.push(ser);
                break;
            }

            case c_oAscChartTypeSettings.barNormal:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(1) ];
                chart.series.push(ser);

                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(2) ];
                chart.series.push(ser);

                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(3) ];
                chart.series.push(ser);

                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(4) ];
                chart.series.push(ser);
                break;
            }

            case c_oAscChartTypeSettings.barStacked:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(1), createItem(2), createItem(3), createItem(4) ];
                chart.series.push(ser);

                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(2), createItem(3), createItem(4), createItem(5) ];
                chart.series.push(ser);
                break;
            }

            case c_oAscChartTypeSettings.barStackedPer:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(1), createItem(3), createItem(5), createItem(7) ];
                chart.series.push(ser);

                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(4), createItem(5), createItem(6), createItem(7) ];
                chart.series.push(ser);
                break;
            }

            case c_oAscChartTypeSettings.pie:
            case c_oAscChartTypeSettings.doughnut:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(3), createItem(1) ];
                chart.series.push(ser);
                break;
            }

            case c_oAscChartTypeSettings.areaNormal:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(0), createItem(8), createItem(5), createItem(6) ];
                chart.series.push(ser);

                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(0), createItem(4), createItem(2), createItem(9) ];
                chart.series.push(ser);
                break;
            }

            case c_oAscChartTypeSettings.areaStacked:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(0), createItem(8), createItem(5), createItem(11) ];
                chart.series.push(ser);

                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(4), createItem(4), createItem(4), createItem(4) ];
                chart.series.push(ser);
                break;
            }

            case c_oAscChartTypeSettings.areaStackedPer:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(0), createItem(4), createItem(1), createItem(16) ];
                chart.series.push(ser);

                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(4), createItem(4), createItem(4), createItem(4) ];
                chart.series.push(ser);
                break;
            }

            case c_oAscChartTypeSettings.scatter:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(1), createItem(5) ];
                chart.series.push(ser);

                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(2), createItem(6) ];
                chart.series.push(ser);
                break;
            }

            default:
            {
                var ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(3), createItem(5), createItem(7) ];
                chart.series.push(ser);

                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(10), createItem(12), createItem(14) ];
                chart.series.push(ser);

                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(1), createItem(3), createItem(5) ];
                chart.series.push(ser);

                ser = new asc_CChartSeria();
                ser.Val.NumCache = [ createItem(8), createItem(10), createItem(12) ];
                chart.series.push(ser);
                break;
            }
        }
        return chart;
    };

    _this.getChartByType = function(type)
    {
       return ExecuteNoHistory(function()
        {

            var asc_chart = _this.createAscChart(type);
            var type_sub_type = TYPE_SUBTYPE_BY_TYPE[type];
            if(type_sub_type)
            {
                asc_chart.type = type_sub_type.type;
                asc_chart.subType = type_sub_type.subtype;
            }
            var chart_space = DrawingObjectsController.prototype.getChartSpace(asc_chart);

            if(window["Asc"]["editor"])
            {
                var api_sheet = window["Asc"]["editor"];
                chart_space.setWorksheet(api_sheet.wb.getWorksheet().model);
            }
            CheckSpPrXfrm(chart_space);
            chart_space.spPr.xfrm.setOffX(0);
            chart_space.spPr.xfrm.setOffY(0);
            chart_space.spPr.xfrm.setExtX(50);
            chart_space.spPr.xfrm.setExtY(50);
            var settings = new asc_ChartSettings();
            settings.putTitle(c_oAscChartTitleShowSettings.none);
            settings.putHorAxisLabel(c_oAscChartTitleShowSettings.none);
            settings.putVertAxisLabel(c_oAscChartTitleShowSettings.none);
            settings.putLegendPos(c_oAscChartLegendShowSettings.none);
            settings.putHorGridLines(c_oAscGridLinesSettings.none);
            settings.putVertGridLines(c_oAscGridLinesSettings.none);


            var val_ax_props = new asc_ValAxisSettings();
            val_ax_props.putMinValRule(c_oAscValAxisRule.auto);
            val_ax_props.putMaxValRule(c_oAscValAxisRule.auto);
            val_ax_props.putTickLabelsPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE);
            val_ax_props.putInvertValOrder(false);
            val_ax_props.putDispUnitsRule(c_oAscValAxUnits.none);
            val_ax_props.putMajorTickMark(c_oAscTickMark.TICK_MARK_NONE);
            val_ax_props.putMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
            val_ax_props.putCrossesRule(c_oAscCrossesRule.auto);


            var cat_ax_props = new asc_CatAxisSettings();
            cat_ax_props.putIntervalBetweenLabelsRule(c_oAscBetweenLabelsRule.auto);
            cat_ax_props.putLabelsPosition(c_oAscLabelsPosition.betweenDivisions);
            cat_ax_props.putTickLabelsPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE);
            cat_ax_props.putLabelsAxisDistance(100);
            cat_ax_props.putMajorTickMark(c_oAscTickMark.TICK_MARK_NONE);
            cat_ax_props.putMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
            cat_ax_props.putIntervalBetweenTick(1);
            cat_ax_props.putCrossesRule(c_oAscCrossesRule.auto);
            var vert_axis_settings, hor_axis_settings;
            switch(asc_chart.type)
            {
                case "HBar":
                {
                    vert_axis_settings = cat_ax_props;
                    hor_axis_settings = val_ax_props;
                    break;
                }
                case "Scatter":
                {
                    vert_axis_settings = val_ax_props;
                    hor_axis_settings = val_ax_props;
                    break;
                }
                default :
                {
                    vert_axis_settings = val_ax_props;
                    hor_axis_settings = cat_ax_props;
                    break;
                }
            }

            settings.putVertAxisProps(vert_axis_settings);
            settings.putHorAxisProps(hor_axis_settings);

            DrawingObjectsController.prototype.applyPropsToChartSpace(settings, chart_space);
            chart_space.setBDeleted(false);
            chart_space.updateLinks();
            if(!(asc_chart.type.toLowerCase() === "scatter" || asc_chart.type.toLowerCase() === "stock"))
            {
                if(chart_space.chart.plotArea.valAx)
                {
                    chart_space.chart.plotArea.valAx.setDelete(true);
                }
                if(chart_space.chart.plotArea.catAx)
                {
                    chart_space.chart.plotArea.catAx.setDelete(true);
                }
            }
            else
            {
                if(chart_space.chart.plotArea.valAx)
                {
                    chart_space.chart.plotArea.valAx.setTickLblPos(TICK_LABEL_POSITION_NONE);
                    chart_space.chart.plotArea.valAx.setMajorTickMark(TICK_MARK_NONE);
                    chart_space.chart.plotArea.valAx.setMinorTickMark(TICK_MARK_NONE);
                }
                if(chart_space.chart.plotArea.catAx)
                {
                    chart_space.chart.plotArea.catAx.setTickLblPos(TICK_LABEL_POSITION_NONE);
                    chart_space.chart.plotArea.catAx.setMajorTickMark(TICK_MARK_NONE);
                    chart_space.chart.plotArea.catAx.setMinorTickMark(TICK_MARK_NONE);
                }
            }
            if(!chart_space.spPr)
            {
                chart_space.setSpPr(new CSpPr());
            }
            var new_line = new CLn();
            new_line.setFill(new CUniFill());
            new_line.Fill.setFill(new CNoFill());
            chart_space.spPr.setLn(new_line);
            chart_space.recalculate();

            return chart_space;
        }, _this, []);
    };


    _this.clearPreviews = function()
    {
        previewGroups.length = 0;
    };
    _this.createChartPreview = function(type, styleIndex)
    {

        if(!chartsByTypes[type])
            chartsByTypes[type] = _this.getChartByType(type);
        var chart_space = chartsByTypes[type];
        if(chart_space.style !== styleIndex)
        {
            chart_space.style = styleIndex;
            chart_space.recalculateMarkers();
            chart_space.recalculateSeriesColors();
        }
        chart_space.recalculatePenBrush();


        if (_canvas_charts == null)
        {
            _canvas_charts = document.createElement('canvas');

            var b_retina_support = false;
            if(editor)
            {
                if(editor.m_oWordControl)
                {
                    b_retina_support = this.m_oWordControl.bIsRetinaSupport;
                }
                else if(editor.bIsRetinaSupport)
                {
                    b_retina_support = editor.bIsRetinaSupport;
                }
            }

            if (!b_retina_support)
            {
                _canvas_charts.width = CHART_PREVIEW_WIDTH_PIX;
                _canvas_charts.height = CHART_PREVIEW_HEIGHT_PIX;
            }
            else
            {
                _canvas_charts.width = (CHART_PREVIEW_WIDTH_PIX << 1);
                _canvas_charts.height = (CHART_PREVIEW_HEIGHT_PIX << 1);
            }
        }

        var _canvas = _canvas_charts;
        var ctx = _canvas.getContext('2d');
        var graphics = new CGraphics();
        graphics.init(ctx, _canvas.width, _canvas.height, 50, 50);
        graphics.m_oFontManager = g_fontManager;
        graphics.transform(1,0,0,1,0,0);
        chart_space.draw(graphics);
        var image_url = _canvas.toDataURL("image/png");
        return image_url;
    };

	_this.getChartPreviews = function(chartType) {

		if (isRealNumber(chartType)) {
            if(!Array.isArray(previewGroups[chartType]))
            {
                previewGroups[chartType] = [];
                var arr = previewGroups[chartType];
                for(var i = 1; i < 49; ++i)
                {
                    arr.push(_this.createChartPreview(chartType, i))
                }
            }
			var group = previewGroups[chartType];
			var objectGroup = [];

			for (var style = 0; style <  group.length; ++style) {
				var chartStyle = new asc_CChartStyle();
				chartStyle.asc_setStyle(style+1);
				chartStyle.asc_setImageUrl(group[style]);
				objectGroup.push(chartStyle);
			}

			return objectGroup;
		}
		else
			return null;
	};
}

//-----------------------------------------------------------------------------------
// Draw 
//-----------------------------------------------------------------------------------

function checkDataRange(type, dataRange,isRows,worksheet) {
	var columns = false;
	var rows = false;
	if(isRows)
		rows = true;
	else
		columns = true;
	
	//проверка максимального дипазона
	var maxSeries = 255; 
	var minStockVal = 4;
	var bbox = {
		c1: dataRange.first.col,
		c2: dataRange.last.col,
		r1: dataRange.first.row,
		r2: dataRange.last.row
	}
	if(((type == 'Area' || type == 'Line' || type == 'Bar' || type == 'HBar') && ((columns && ((bbox.c2 - bbox.c1 + 1) > maxSeries || (bbox.r2 - bbox.r1 + 1) > gc_nMaxRow)) || (rows && ((bbox.c2 - bbox.c1 + 1) > gc_nMaxRow || (bbox.r2 - bbox.r1 + 1) > maxSeries)))))
	{
		worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.DataRangeError, c_oAscError.Level.NoCritical)
		return false;
	}
	else if((type == 'Pie') && ((bbox.c2 - bbox.c1 + 1) > maxSeries || (bbox.r2 - bbox.r1 + 1) > maxSeries))
	{
		worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.DataRangeError, c_oAscError.Level.NoCritical)
		return false;
	}
	else if (((type == 'Scatter' || type == 'Stock') && ((columns && ((bbox.c2 - bbox.c1 ) > maxSeries || (bbox.r2 - bbox.r1) > gc_nMaxRow)) || (rows && ((bbox.c2 - bbox.c1) > gc_nMaxRow || (bbox.r2 - bbox.r1) > maxSeries)))))
	{
		worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.DataRangeError, c_oAscError.Level.NoCritical)
		return false;
	}
	else if(type == 'Stock')
	{
		if(((columns && ((bbox.c2 - bbox.c1 +1) == minStockVal && (bbox.r2 - bbox.r1 + 1) >= minStockVal)) || (rows && ((bbox.r2 - bbox.r1 + 1) == minStockVal && (bbox.c2 - bbox.c1 + 1) >= minStockVal))))
			return true;
		else
		{
			worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.StockChartError, c_oAscError.Level.NoCritical)
			return false;
		}
	}
	else
		return true;
}

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