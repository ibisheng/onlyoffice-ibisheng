"use strict";

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {
// Import

	var CreateNoFillLine = AscFormat.CreateNoFillLine;
	var CreateNoFillUniFill = AscFormat.CreateNoFillUniFill;
	
var c_oAscChartTypeSettings = Asc.c_oAscChartTypeSettings;
var c_oAscTickMark = Asc.c_oAscTickMark;

function ChartPreviewManager() {
	this.previewGroups = [];
	this.chartsByTypes = [];

	this.CHART_PREVIEW_WIDTH_PIX = 50;
	this.CHART_PREVIEW_HEIGHT_PIX = 50;

	this._canvas_charts = null;
}

ChartPreviewManager.prototype.getAscChartSeriesDefault = function(type) {
	function createItem(value) {
		return { numFormatStr: "General", isDateTimeFormat: false, val: value, isHidden: false };
	}

	// Set data
	var series = [], ser;
	switch(type)
	{
		case c_oAscChartTypeSettings.lineNormal:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(2), createItem(3), createItem(2), createItem(3) ];
			series.push(ser);
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(1), createItem(2), createItem(3), createItem(2) ];
			series.push(ser);
			break;
		}
        case c_oAscChartTypeSettings.line3d:
        {
            ser = new asc_CChartSeria();
            ser.Val.NumCache = [ createItem(1), createItem(2), createItem(1), createItem(2) ];
            series.push(ser);
            ser = new asc_CChartSeria();
            ser.Val.NumCache = [ createItem(3), createItem(2.5), createItem(3), createItem(3.5) ];
            series.push(ser);
            break;
        }
		case c_oAscChartTypeSettings.lineStacked:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(1), createItem(6), createItem(2), createItem(8) ];
			series.push(ser);
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(4), createItem(4), createItem(4), createItem(5) ];
			series.push(ser);
			break;
		}
		case c_oAscChartTypeSettings.lineStackedPer:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(2), createItem(4), createItem(2), createItem(4) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(2), createItem(2), createItem(2), createItem(2) ];
			series.push(ser);
			break;
		}

		case c_oAscChartTypeSettings.hBarNormal:
		case c_oAscChartTypeSettings.hBarNormal3d:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(4) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(3) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(2) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(1) ];
			series.push(ser);
			break;
		}

		case c_oAscChartTypeSettings.hBarStacked:
		case c_oAscChartTypeSettings.hBarStacked3d:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(4), createItem(3), createItem(2), createItem(1) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(5), createItem(4), createItem(3), createItem(2) ];
			series.push(ser);
			break;
		}

		case c_oAscChartTypeSettings.hBarStackedPer:
		case c_oAscChartTypeSettings.hBarStackedPer3d:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(7), createItem(5), createItem(3), createItem(1) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(7), createItem(6), createItem(5), createItem(4) ];
			series.push(ser);
			break;
		}

		case c_oAscChartTypeSettings.barNormal:
		case c_oAscChartTypeSettings.barNormal3d:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(1) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(2) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(3) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(4) ];
			series.push(ser);
			break;
		}

		case c_oAscChartTypeSettings.barStacked:
		case c_oAscChartTypeSettings.barStacked3d:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(1), createItem(2), createItem(3), createItem(4) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(2), createItem(3), createItem(4), createItem(5) ];
			series.push(ser);
			break;
		}

		case c_oAscChartTypeSettings.barStackedPer:
		case c_oAscChartTypeSettings.barStackedPer3d:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(1), createItem(3), createItem(5), createItem(7) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(4), createItem(5), createItem(6), createItem(7) ];
			series.push(ser);
			break;
		}
        case c_oAscChartTypeSettings.barNormal3dPerspective:
        {
            ser = new asc_CChartSeria();
            ser.Val.NumCache = [ createItem(1), createItem(2), createItem(3), createItem(4) ];
            series.push(ser);

            ser = new asc_CChartSeria();
            ser.Val.NumCache = [ createItem(2), createItem(3), createItem(4), createItem(5) ];
            series.push(ser);
            break;
        }
		case c_oAscChartTypeSettings.pie:
		case c_oAscChartTypeSettings.doughnut:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(3), createItem(1) ];
			series.push(ser);
			break;
		}

		case c_oAscChartTypeSettings.areaNormal:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(0), createItem(8), createItem(5), createItem(6) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(0), createItem(4), createItem(2), createItem(9) ];
			series.push(ser);
			break;
		}

		case c_oAscChartTypeSettings.areaStacked:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(0), createItem(8), createItem(5), createItem(11) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(4), createItem(4), createItem(4), createItem(4) ];
			series.push(ser);
			break;
		}

		case c_oAscChartTypeSettings.areaStackedPer:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(0), createItem(4), createItem(1), createItem(16) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(4), createItem(4), createItem(4), createItem(4) ];
			series.push(ser);
			break;
		}

		case c_oAscChartTypeSettings.scatter:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(1), createItem(5) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(2), createItem(6) ];
			series.push(ser);
			break;
		}

		default:
		{
			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(3), createItem(5), createItem(7) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(10), createItem(12), createItem(14) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(1), createItem(3), createItem(5) ];
			series.push(ser);

			ser = new asc_CChartSeria();
			ser.Val.NumCache = [ createItem(8), createItem(10), createItem(12) ];
			series.push(ser);
			break;
		}
	}
	return series;
};

ChartPreviewManager.prototype.getChartByType = function(type)
{
	return AscFormat.ExecuteNoHistory(function()
	{
		var settings = new AscCommon.asc_ChartSettings();
		settings.type = type;
		var chartSeries = {series: this.getAscChartSeriesDefault(type), parsedHeaders: {bLeft: true, bTop: true}};
		var chart_space = AscFormat.DrawingObjectsController.prototype._getChartSpace(chartSeries, settings, true);
        chart_space.bPreview = true;
		if(window["Asc"]["editor"])
		{
			var api_sheet = window["Asc"]["editor"];
			chart_space.setWorksheet(api_sheet.wb.getWorksheet().model);
		}
        else
        {
            if(editor && editor.WordControl && editor.WordControl.m_oLogicDocument.Slides && editor.WordControl.m_oLogicDocument.Slides[editor.WordControl.m_oLogicDocument.CurPage])
            {
                chart_space.setParent(editor.WordControl.m_oLogicDocument.Slides[editor.WordControl.m_oLogicDocument.CurPage]);
            }
        }
		AscFormat.CheckSpPrXfrm(chart_space);
		chart_space.spPr.xfrm.setOffX(0);
		chart_space.spPr.xfrm.setOffY(0);
		chart_space.spPr.xfrm.setExtX(50);
		chart_space.spPr.xfrm.setExtY(50);
		settings.putTitle(Asc.c_oAscChartTitleShowSettings.none);
		settings.putHorAxisLabel(Asc.c_oAscChartTitleShowSettings.none);
		settings.putVertAxisLabel(Asc.c_oAscChartTitleShowSettings.none);
		settings.putLegendPos(Asc.c_oAscChartLegendShowSettings.none);
		settings.putHorGridLines(Asc.c_oAscGridLinesSettings.none);
		settings.putVertGridLines(Asc.c_oAscGridLinesSettings.none);


		var val_ax_props = new AscCommon.asc_ValAxisSettings();
		val_ax_props.putMinValRule(Asc.c_oAscValAxisRule.auto);
		val_ax_props.putMaxValRule(Asc.c_oAscValAxisRule.auto);
		val_ax_props.putTickLabelsPos(Asc.c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE);
		val_ax_props.putInvertValOrder(false);
		val_ax_props.putDispUnitsRule(Asc.c_oAscValAxUnits.none);
		val_ax_props.putMajorTickMark(c_oAscTickMark.TICK_MARK_NONE);
		val_ax_props.putMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
		val_ax_props.putCrossesRule(Asc.c_oAscCrossesRule.auto);


		var cat_ax_props = new AscCommon.asc_CatAxisSettings();
		cat_ax_props.putIntervalBetweenLabelsRule(Asc.c_oAscBetweenLabelsRule.auto);
		cat_ax_props.putLabelsPosition(Asc.c_oAscLabelsPosition.betweenDivisions);
		cat_ax_props.putTickLabelsPos(Asc.c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE);
		cat_ax_props.putLabelsAxisDistance(100);
		cat_ax_props.putMajorTickMark(c_oAscTickMark.TICK_MARK_NONE);
		cat_ax_props.putMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
		cat_ax_props.putIntervalBetweenTick(1);
		cat_ax_props.putCrossesRule(Asc.c_oAscCrossesRule.auto);
		var vert_axis_settings, hor_axis_settings, isScatter;
		switch(type)
		{
			case c_oAscChartTypeSettings.hBarNormal:
			case c_oAscChartTypeSettings.hBarStacked:
			case c_oAscChartTypeSettings.hBarStackedPer:
			{
				vert_axis_settings = cat_ax_props;
				hor_axis_settings = val_ax_props;
				break;
			}
			case c_oAscChartTypeSettings.scatter:
			case c_oAscChartTypeSettings.scatterLine:
			case c_oAscChartTypeSettings.scatterLineMarker:
			case c_oAscChartTypeSettings.scatterMarker:
			case c_oAscChartTypeSettings.scatterNone:
			case c_oAscChartTypeSettings.scatterSmooth:
			case c_oAscChartTypeSettings.scatterSmoothMarker:
			{
				vert_axis_settings = val_ax_props;
				hor_axis_settings = val_ax_props;
				isScatter = true;
                settings.showMarker = true;
                settings.smooth = false;
                settings.bLine = false;
				break;
			}
            case c_oAscChartTypeSettings.areaNormal:
            case c_oAscChartTypeSettings.areaStacked:
            case c_oAscChartTypeSettings.areaStackedPer:
            {
                cat_ax_props.putLabelsPosition(CROSS_BETWEEN_BETWEEN);
                vert_axis_settings = val_ax_props;
                hor_axis_settings = cat_ax_props;
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

		AscFormat.DrawingObjectsController.prototype.applyPropsToChartSpace(settings, chart_space);
		chart_space.setBDeleted(false);
		chart_space.updateLinks();
		if(!(isScatter || type === c_oAscChartTypeSettings.stock))
		{
			if(chart_space.chart.plotArea.valAx)
				chart_space.chart.plotArea.valAx.setDelete(true);
			if(chart_space.chart.plotArea.catAx)
				chart_space.chart.plotArea.catAx.setDelete(true);
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
			chart_space.setSpPr(new AscFormat.CSpPr());

		var new_line = new AscFormat.CLn();
		new_line.setFill(new AscFormat.CUniFill());
		new_line.Fill.setFill(new AscFormat.CNoFill());
		chart_space.spPr.setLn(new_line);
        chart_space.recalcInfo.recalculateReferences = false;
		chart_space.recalculate();

		return chart_space;
	}, this, []);
};

ChartPreviewManager.prototype.clearPreviews = function()
{
	this.previewGroups.length = 0;
};
ChartPreviewManager.prototype.createChartPreview = function(type, styleIndex) {
    return AscFormat.ExecuteNoHistory(function(){
        if(!this.chartsByTypes[type])
            this.chartsByTypes[type] = this.getChartByType(type);
        var chart_space = this.chartsByTypes[type];
        if(chart_space.style !== styleIndex)
        {
            chart_space.style = styleIndex;
            chart_space.recalculateMarkers();
            chart_space.recalculateSeriesColors();
            chart_space.recalculatePlotAreaChartBrush();
            chart_space.recalculatePlotAreaChartPen();
            chart_space.recalculateWalls();
            chart_space.recalculateChartBrush();
            chart_space.recalculateChartPen();
            chart_space.recalculateUpDownBars();
        }
        chart_space.recalculatePenBrush();


        if (null === this._canvas_charts) {
            this._canvas_charts = document.createElement('canvas');
            this._canvas_charts.width = this.CHART_PREVIEW_WIDTH_PIX;
            this._canvas_charts.height = this.CHART_PREVIEW_HEIGHT_PIX;

            if (AscCommon.AscBrowser.isRetina) {
                this._canvas_charts.width <<= 1;
                this._canvas_charts.height <<= 1;
            }
        }

        var _canvas = this._canvas_charts;
        var ctx = _canvas.getContext('2d');
        var graphics = new CGraphics();
        graphics.init(ctx, _canvas.width, _canvas.height, 50, 50);
        graphics.m_oFontManager = g_fontManager;
        graphics.transform(1,0,0,1,0,0);
        chart_space.draw(graphics);
        return _canvas.toDataURL("image/png");
    }, this, []);

};

ChartPreviewManager.prototype.getChartPreviews = function(chartType) {
	if (AscFormat.isRealNumber(chartType)) {
		if (!this.previewGroups.hasOwnProperty(chartType)) {
			this.previewGroups[chartType] = [];
			var arr = this.previewGroups[chartType];
			for(var i = 1; i < 49; ++i)
				arr.push(this.createChartPreview(chartType, i));
		}
		var group = this.previewGroups[chartType];
		var objectGroup = [];

		for (var style = 0; style <  group.length; ++style) {
			var chartStyle = new asc_CChartStyle();
			chartStyle.asc_setStyle(style + 1);
			chartStyle.asc_setImageUrl(group[style]);
			objectGroup.push(chartStyle);
		}

		return objectGroup;
	}
	else
		return null;
};

function CreateAscColorByIndex(nIndex)
{
	var oColor = new Asc.asc_CColor();
	oColor.type = Asc.c_oAscColor.COLOR_TYPE_SCHEME;
	oColor.value = nIndex;
	return oColor;
}

function CreateAscFillByIndex(nIndex)
{
	var oAscFill = new Asc.asc_CShapeFill();
	oAscFill.type = Asc.c_oAscFill.FILL_TYPE_SOLID;
	oAscFill.fill = new Asc.asc_CFillSolid();
	oAscFill.fill.color = CreateAscColorByIndex(nIndex);
	return oAscFill;
}

function CreateAscGradFillByIndex(nIndex1, nIndex2, nAngle)
{
	var oAscFill = new Asc.asc_CShapeFill();
	oAscFill.type = Asc.c_oAscFill.FILL_TYPE_GRAD;
	oAscFill.fill = new Asc.asc_CFillGrad();
	oAscFill.fill.GradType = Asc.c_oAscFillGradType.GRAD_LINEAR;
	oAscFill.fill.LinearAngle = nAngle;
	oAscFill.fill.LinearScale = true;
	oAscFill.fill.Colors = [CreateAscColorByIndex(nIndex1), CreateAscColorByIndex(nIndex2)];
	oAscFill.fill.Positions = [0, 100000];
	oAscFill.fill.LinearAngle = nAngle;
	oAscFill.fill.LinearScale = true;
	return oAscFill;
}
function TextArtPreviewManager()
{
	this.canvas = null;
	this.canvasWidth = 50;
	this.canvasHeight = 50;
	this.shapeWidth = 50;
	this.shapeHeight = 50;
	this.TAShape = null;
	this.TextArtStyles = [];

	this.aStylesByIndex = [];
	this.aStylesByIndexToApply = [];

	this.dKoeff = 4;
	//if (AscBrowser.isRetina) {
	//	this.dKoeff <<= 1;
	//}
}
TextArtPreviewManager.prototype.initStyles = function()
{

	var oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = AscFormat.CorrectUniFill(CreateAscFillByIndex(24), new AscFormat.CUniFill(), 0);
	oTextPr.TextOutline = CreateNoFillLine();
	this.aStylesByIndex[0] = oTextPr;
	this.aStylesByIndexToApply[0] = oTextPr;

	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = AscFormat.CorrectUniFill(CreateAscGradFillByIndex(52, 24, 5400000), new AscFormat.CUniFill(), 0);
	oTextPr.TextOutline = CreateNoFillLine();
	this.aStylesByIndex[4] = oTextPr;
	this.aStylesByIndexToApply[4] = oTextPr;

	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = AscFormat.CorrectUniFill(CreateAscGradFillByIndex(44, 42, 5400000), new AscFormat.CUniFill(), 0);
	oTextPr.TextOutline = CreateNoFillLine();
	this.aStylesByIndex[8] = oTextPr;
	this.aStylesByIndexToApply[8] = oTextPr;

	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = CreateNoFillUniFill();
	oTextPr.TextOutline = CreatePenFromParams(AscFormat.CorrectUniFill(CreateAscFillByIndex(34), new AscFormat.CUniFill(), 0), undefined, undefined, undefined, undefined, (15773/36000)*this.dKoeff);
	this.aStylesByIndex[1] = oTextPr;
	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = CreateNoFillUniFill();
	oTextPr.TextOutline = CreatePenFromParams(AscFormat.CorrectUniFill(CreateAscFillByIndex(34), new AscFormat.CUniFill(), 0), undefined, undefined, undefined, undefined, (15773/36000));
	this.aStylesByIndexToApply[1] = oTextPr;

	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = CreateNoFillUniFill();
	oTextPr.TextOutline = CreatePenFromParams(AscFormat.CorrectUniFill(CreateAscFillByIndex(59), new AscFormat.CUniFill(), 0), undefined, undefined, undefined, undefined, (15773/36000)*this.dKoeff);
	this.aStylesByIndex[5] = oTextPr;
	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = CreateNoFillUniFill();
	oTextPr.TextOutline = CreatePenFromParams(AscFormat.CorrectUniFill(CreateAscFillByIndex(59), new AscFormat.CUniFill(), 0), undefined, undefined, undefined, undefined, (15773/36000));
	this.aStylesByIndexToApply[5] = oTextPr;

	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = CreateNoFillUniFill();
	oTextPr.TextOutline = CreatePenFromParams(AscFormat.CorrectUniFill(CreateAscFillByIndex(52), new AscFormat.CUniFill(), 0), undefined, undefined, undefined, undefined, (15773/36000)*this.dKoeff);
	this.aStylesByIndex[9] = oTextPr;
	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = CreateNoFillUniFill();
	oTextPr.TextOutline = CreatePenFromParams(AscFormat.CorrectUniFill(CreateAscFillByIndex(52), new AscFormat.CUniFill(), 0), undefined, undefined, undefined, undefined, (15773/36000));
	this.aStylesByIndexToApply[9] = oTextPr;

	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = AscFormat.CorrectUniFill(CreateAscFillByIndex(27), new AscFormat.CUniFill(), 0);
	oTextPr.TextOutline = CreatePenFromParams(AscFormat.CorrectUniFill(CreateAscFillByIndex(52), new AscFormat.CUniFill(), 0), undefined, undefined, undefined, undefined, (12700/36000)*this.dKoeff);
	this.aStylesByIndex[2] = oTextPr;
	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = AscFormat.CorrectUniFill(CreateAscFillByIndex(27), new AscFormat.CUniFill(), 0);
	oTextPr.TextOutline = CreatePenFromParams(AscFormat.CorrectUniFill(CreateAscFillByIndex(52), new AscFormat.CUniFill(), 0), undefined, undefined, undefined, undefined, (12700/36000));
	this.aStylesByIndexToApply[2] = oTextPr;

	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = AscFormat.CorrectUniFill(CreateAscFillByIndex(42), new AscFormat.CUniFill(), 0);
	oTextPr.TextOutline = CreatePenFromParams(AscFormat.CorrectUniFill(CreateAscFillByIndex(46), new AscFormat.CUniFill(), 0), undefined, undefined, undefined, undefined, (12700/36000)*this.dKoeff);
	this.aStylesByIndex[6] = oTextPr;
	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = AscFormat.CorrectUniFill(CreateAscFillByIndex(42), new AscFormat.CUniFill(), 0);
	oTextPr.TextOutline = CreatePenFromParams(AscFormat.CorrectUniFill(CreateAscFillByIndex(46), new AscFormat.CUniFill(), 0), undefined, undefined, undefined, undefined, (12700/36000));
	this.aStylesByIndexToApply[6] = oTextPr;

	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = AscFormat.CorrectUniFill(CreateAscFillByIndex(57), new AscFormat.CUniFill(), 0);
	oTextPr.TextOutline = CreatePenFromParams(AscFormat.CorrectUniFill(CreateAscFillByIndex(54), new AscFormat.CUniFill(), 0), undefined, undefined, undefined, undefined, (12700/36000)*this.dKoeff);
	this.aStylesByIndex[10] = oTextPr;
	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = AscFormat.CorrectUniFill(CreateAscFillByIndex(57), new AscFormat.CUniFill(), 0);
	oTextPr.TextOutline = CreatePenFromParams(AscFormat.CorrectUniFill(CreateAscFillByIndex(54), new AscFormat.CUniFill(), 0), undefined, undefined, undefined, undefined, (12700/36000));
	this.aStylesByIndexToApply[10] = oTextPr;

	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = AscFormat.CorrectUniFill(CreateAscGradFillByIndex(45, 57, 0), new AscFormat.CUniFill(), 0);
	oTextPr.TextOutline = CreateNoFillLine();
	this.aStylesByIndex[3] = oTextPr;
	this.aStylesByIndexToApply[3] = oTextPr;

	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = AscFormat.CorrectUniFill(CreateAscGradFillByIndex(52, 33, 0), new AscFormat.CUniFill(), 0);
	oTextPr.TextOutline = CreateNoFillLine();
	this.aStylesByIndex[7] = oTextPr;
	this.aStylesByIndexToApply[7] = oTextPr;

	oTextPr = new CTextPr();
	oTextPr.Bold = true;
	oTextPr.TextFill = AscFormat.CorrectUniFill(CreateAscGradFillByIndex(27, 45, 5400000), new AscFormat.CUniFill(), 0);
	oTextPr.TextOutline = CreateNoFillLine();
	this.aStylesByIndex[11] = oTextPr;
	this.aStylesByIndexToApply[11] = oTextPr;
};

TextArtPreviewManager.prototype.getStylesToApply = function()
{
	if(this.aStylesByIndex.length === 0)
	{
		this.initStyles();
	}
	return this.aStylesByIndexToApply;
};

TextArtPreviewManager.prototype.clear = function()
{
	this.TextArtStyles.length = 0;
};

TextArtPreviewManager.prototype.getWordArtStyles = function()
{
	if(this.TextArtStyles.length === 0)
	{
		this.generateTextArtStyles();
	}
	return this.TextArtStyles;
};

TextArtPreviewManager.prototype.getCanvas = function()
{
	if (null === this.canvas)
	{
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;

		if (AscCommon.AscBrowser.isRetina) {
			this.canvas.width <<= 1;
			this.canvas.height <<= 1;
		}
	}
	return this.canvas;
};

TextArtPreviewManager.prototype.getShapeByPrst = function(prst)
{
	var oShape = this.getShape();
    if(!oShape)
    {
        return null;
    }
	var oContent = oShape.getDocContent();

	var textStr = "abcde";
	var TextSpacing = undefined;
	switch(prst)
	{
		case "textButton":
		{
			TextSpacing = 4;
			textStr = "abcde";
			for(var i = 0; i < textStr.length; ++i)
			{
				oContent.Paragraph_Add(new ParaText(textStr[i]), false);
			}

			textStr = "Fghi";
			oContent.Add_NewParagraph();
			for(var i = 0; i < textStr.length; ++i)
			{
				oContent.Paragraph_Add(new ParaText(textStr[i]), false);
			}

			textStr = "Jklmn";
			oContent.Add_NewParagraph();
			for(var i = 0; i < textStr.length; ++i)
			{
				oContent.Paragraph_Add(new ParaText(textStr[i]), false);
			}
			break;
		}
		case "textArchUp":
		case "textArchDown":
		{
			TextSpacing = 4;
			textStr = "abcdefg";
			for(var i = 0; i < textStr.length; ++i)
			{
				oContent.Paragraph_Add(new ParaText(textStr[i]), false);
			}
			break;
		}

		case "textCircle":
		{
			TextSpacing = 4;
			textStr = "abcdefghijklmnop";
			for(var i = 0; i < textStr.length; ++i)
			{
				oContent.Paragraph_Add(new ParaText(textStr[i]), false);
			}
			break;
		}
        case "textButtonPour":
        {
            textStr = "abcde";
            for(var i = 0; i < textStr.length; ++i)
            {
                oContent.Paragraph_Add(new ParaText(textStr[i]), false);
            }

            oContent.Add_NewParagraph();
            textStr = "abc";
            for(var i = 0; i < textStr.length; ++i)
            {
                oContent.Paragraph_Add(new ParaText(textStr[i]), false);
            }


            oContent.Add_NewParagraph();
            textStr = "abcde";
            for(var i = 0; i < textStr.length; ++i)
            {
                oContent.Paragraph_Add(new ParaText(textStr[i]), false);
            }
            break;
        }
        case "textDeflateInflate":
        {
            textStr = "abcde";
            for(var i = 0; i < textStr.length; ++i)
            {
                oContent.Paragraph_Add(new ParaText(textStr[i]), false);
            }
            oContent.Add_NewParagraph();
            textStr = "abcde";
            for(var i = 0; i < textStr.length; ++i)
            {
                oContent.Paragraph_Add(new ParaText(textStr[i]), false);
            }
            break;
        }
        case "textDeflateInflateDeflate":
        {
            textStr = "abcde";
            for(var i = 0; i < textStr.length; ++i)
            {
                oContent.Paragraph_Add(new ParaText(textStr[i]), false);
            }
            oContent.Add_NewParagraph();
            textStr = "abcde";
            for(var i = 0; i < textStr.length; ++i)
            {
                oContent.Paragraph_Add(new ParaText(textStr[i]), false);
            }
            oContent.Add_NewParagraph();
            textStr = "abcde";
            for(var i = 0; i < textStr.length; ++i)
            {
                oContent.Paragraph_Add(new ParaText(textStr[i]), false);
            }
            break;
        }
		default:
		{
			textStr = "abcde";
			for(var i = 0; i < textStr.length; ++i)
			{
				oContent.Paragraph_Add(new ParaText(textStr[i]), false);
			}
		}
	}
	oContent.Set_ApplyToAll(true);
	oContent.Set_ParagraphAlign(AscCommon.align_Center);
	oContent.Paragraph_Add(new ParaTextPr({FontSize: 36, Spacing: TextSpacing}));
	oContent.Set_ApplyToAll(false);

	var oBodypr = oShape.getBodyPr().createDuplicate();
	oBodypr.prstTxWarp = AscFormat.ExecuteNoHistory(
		function()
		{
			return  CreatePrstTxWarpGeometry(prst)
		}, []);
	if(!oShape.bWordShape)
	{
		oShape.txBody.setBodyPr(oBodypr);
	}
	else
	{
		oShape.setBodyPr(oBodypr);
	}
	oShape.setBDeleted(false);
	oShape.recalculate();
	return oShape;
};
TextArtPreviewManager.prototype.getShape =  function()
{
	var oShape = new AscFormat.CShape();
	var oParent = null, oWorkSheet = null;
	var bWord = true;
	if(window["Asc"]["editor"])
	{
		var api_sheet = window["Asc"]["editor"];
		oShape.setWorksheet(api_sheet.wb.getWorksheet().model);
		oWorkSheet = api_sheet.wb.getWorksheet().model;
		bWord = false;
	}
	else
	{
		if(editor && editor.WordControl && Array.isArray(editor.WordControl.m_oLogicDocument.Slides))
		{
            if(editor.WordControl.m_oLogicDocument.Slides[editor.WordControl.m_oLogicDocument.CurPage])
            {
                oShape.setParent(editor.WordControl.m_oLogicDocument.Slides[editor.WordControl.m_oLogicDocument.CurPage]);
                oParent = editor.WordControl.m_oLogicDocument.Slides[editor.WordControl.m_oLogicDocument.CurPage];
                bWord = false;
            }
            else
            {
                return null;
            }
		}
	}
	var oParentObjects = oShape.getParentObjects();
	var oTrack = new NewShapeTrack("textRect", 0, 0, oParentObjects.theme, oParentObjects.master, oParentObjects.layout, oParentObjects.slide, 0);
	oTrack.track({}, oShape.convertPixToMM(this.canvasWidth), oShape.convertPixToMM(this.canvasHeight));
	oShape = oTrack.getShape(bWord, oShape.getDrawingDocument(), oShape.drawingObjects);
    oShape.setStyle(null);
    oShape.spPr.setFill(AscFormat.CreateUnfilFromRGB(255, 255, 255));
	var oBodypr = oShape.getBodyPr().createDuplicate();
	oBodypr.lIns = 0;
	oBodypr.tIns = 0;
	oBodypr.rIns = 0;
	oBodypr.bIns = 0;
	oBodypr.anchor = 1;
	if(!bWord)
	{
		oShape.txBody.setBodyPr(oBodypr);
	}
	else
	{
		oShape.setBodyPr(oBodypr);
	}
	oShape.spPr.setLn(CreatePenFromParams(CreateNoFillUniFill(), null, null, null, 2, null));
	if(oWorkSheet)
	{
		oShape.setWorksheet(oWorkSheet);
	}
	if(oParent)
	{
		oShape.setParent(oParent);
	}
	oShape.spPr.xfrm.setOffX(0);
	oShape.spPr.xfrm.setOffY(0);
	oShape.spPr.xfrm.setExtX(this.shapeWidth);
	oShape.spPr.xfrm.setExtY(this.shapeHeight);
	return oShape;
};

TextArtPreviewManager.prototype.getTAShape = function()
{
	if(!this.TAShape)
	{
		var oShape = this.getShape();
        if(!oShape)
        {
            return null;
        }
		var oContent = oShape.getDocContent();
		var sText = "Ta";
		var oParagraph = oContent.Content[0];
		for(var i = 0; i < sText.length; ++i)
		{
			oContent.Paragraph_Add(new ParaText(sText[i]), false);
		}
		oContent.Set_ApplyToAll(true);
		oContent.Paragraph_Add(new ParaTextPr({FontSize: 109, RFonts: {Ascii : {Name: "Arial", Index: -1}}}));
		oContent.Set_ParagraphAlign(AscCommon.align_Center);
		oContent.Set_ParagraphIndent({FirstLine: 0, Left: 0, Right: 0});
		oContent.Set_ApplyToAll(false);
		this.TAShape = oShape;
	}
	return this.TAShape;
};

TextArtPreviewManager.prototype.getWordArtPreview = function(prst)
{
	var _canvas = this.getCanvas();
	var ctx = _canvas.getContext('2d');
	var graphics = new CGraphics();
	var oShape = this.getShapeByPrst(prst);
    if(!oShape)
    {
        return "";
    }
	graphics.init(ctx, _canvas.width, _canvas.height, oShape.extX, oShape.extY);
	graphics.m_oFontManager = g_fontManager;
	graphics.transform(1,0,0,1,0,0);

	var oldShowParaMarks;
	if(editor)
	{
		oldShowParaMarks = editor.ShowParaMarks;
		editor.ShowParaMarks = false;
	}
	oShape.draw(graphics);

	if(editor)
	{
		editor.ShowParaMarks = oldShowParaMarks;
	}
	return _canvas.toDataURL("image/png");
};

TextArtPreviewManager.prototype.generateTextArtStyles = function()
{
    AscFormat.ExecuteNoHistory(function(){

        if(this.aStylesByIndex.length === 0)
        {
            this.initStyles();
        }
        var _canvas = this.getCanvas();
        var ctx = _canvas.getContext('2d');
        var graphics = new CGraphics();
        var oShape = this.getTAShape();
        if(!oShape)
        {
            this.TextArtStyles.length = 0;
            return;
        }
        oShape.recalculate();

        graphics.m_oFontManager = g_fontManager;

        var oldShowParaMarks;
        if(editor)
        {
            oldShowParaMarks = editor.ShowParaMarks;
            editor.ShowParaMarks = false;
        }
        var oContent = oShape.getDocContent();
        oContent.Set_ApplyToAll(true);
        for(var i = 0; i < this.aStylesByIndex.length; ++i)
        {
            oContent.Paragraph_Add(new ParaTextPr(this.aStylesByIndex[i]));
            graphics.init(ctx, _canvas.width, _canvas.height, oShape.extX, oShape.extY);
            graphics.transform(1,0,0,1,0,0);
            oShape.recalcText();
            if(!oShape.bWordShape)
            {
                oShape.recalculate();
            }
            else
            {
                oShape.recalculateText();
            }
            oShape.draw(graphics);
            this.TextArtStyles[i] = _canvas.toDataURL("image/png");
        }
        oContent.Set_ApplyToAll(false);

        if(editor)
        {
            editor.ShowParaMarks = oldShowParaMarks;
        }
    }, this, []);
};



function GenerateWordArtPrewiewCode()
{
	var oWordArtPreview = new TextArtPreviewManager();
	var i, j;
	var oRetString =  "g_PresetTxWarpTypes = \n ["
	for(i = 0; i < g_PresetTxWarpTypes.length; ++i)
	{
		var aByTypes = g_PresetTxWarpTypes[i];
		oRetString += "\n\t[";
		for(j = 0; j < aByTypes.length; ++j)
		{
			oRetString += "\n\t\t{Type: \"" + aByTypes[j].Type + "\", Image: \"" + oWordArtPreview.getWordArtPreview(aByTypes[j].Type) + "\"}" + ((j === aByTypes.length - 1) ? "" : ",");
		}
		oRetString += "\n\t]" + (i < (g_PresetTxWarpTypes.length - 1) ? "," : "");
	}
	oRetString += "\n];";
	return oRetString;
}

	//----------------------------------------------------------export----------------------------------------------------
	window['AscCommon'] = window['AscCommon'] || {};
	window['AscCommon'].ChartPreviewManager = ChartPreviewManager;
	window['AscCommon'].TextArtPreviewManager = TextArtPreviewManager;
})(window);
