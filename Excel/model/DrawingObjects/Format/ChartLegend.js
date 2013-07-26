var LEGEND_ELEMENT_TYPE_RECT = 0x00;
var LEGEND_ELEMENT_TYPE_LINE = 0x01;



function CLegendEntry()
{
    this.bDelete = null;
    this.idx = null;
    this.txPr = null;
}

function CChartLegend()
{
    this.chartGroup = null;
    this.layout = null;
    this.legendEntries = [];
    this.legendPos = null;
    this.overlay = false;
    this.spPr = new CSpPr();
    this.txPr = null;

    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;

    this.calculatedEntry = [];
}

CChartLegend.prototype =
{
    getStyles: function(level)
    {
        var styles = new CStyles();
        var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);
        default_legend_style.TextPr.FontSize = 10;
        default_legend_style.TextPr.themeFont = "Calibri";
        //TODO:ParaPr: default_legend_style.ParaPr.Ind
        var tx_pr;
        if(isRealObject(this.txPr))
        {
            //TODO
        }
        styles.Style[styles.Id] = default_legend_style;
        ++styles.Id;
        return styles;
    },

    init: function()
    {
        var chart = this.chartGroup.chart;
        var chart_legend = chart.getLegendInfo();
        if(chart_legend.length > 0)
        {
            var shape_type = chart_legend[0].marker === c_oAscLegendMarkerType.Line ? "line" : "rect";
            for(var i = 0; i < chart_legend.length; ++i)
            {
                var legend_entry_obj = chart_legend[i];
                var entry_string = legend_entry_obj.text;
                var cur_legend_entry =  new CLegendEntryGroup();
                cur_legend_entry.marker = chart_legend[0].marker;
                cur_legend_entry.drawingObjects = this.chartGroup.drawingObjects;
                cur_legend_entry.textBody = new CTextBody(cur_legend_entry);

                cur_legend_entry.idx = i;
                for(var key in entry_string)
                {
                    cur_legend_entry.textBody.paragraphAdd(new ParaText(entry_string[key]), false);
                }
                cur_legend_entry.textBody.content.Reset(0, 0, 30, 30);
                cur_legend_entry.textBody.content.Recalculate_Page(0, true);
                cur_legend_entry.geometry = CreateGeometry(shape_type);
                cur_legend_entry.geometry.Init(5, 5);
                cur_legend_entry.brush = new CUniFill();
                cur_legend_entry.brush.fill = new CSolidFill();
                cur_legend_entry.brush.fill.color.color = new CRGBColor();
                cur_legend_entry.brush.fill.color.color.RGBA = {R:legend_entry_obj.color.R, G:legend_entry_obj.color.G, B:legend_entry_obj.color.B, A:255}
            }
        }

    },

    setChartGroup: function(chartGroup)
    {
        this.chartGroup = chartGroup;
    },

    recalculateExtents: function()
    {
        this.extX = null;
        this.extY = null;
        if(isRealObject(this.layout) && isRealNumber(this.layout.w) && isRealNumber(this.layout.h))
        {
            this.extX = this.chartGroup.extX*this.layout.w;
            this.extY = this.chartGroup.extY*this.layout.h;

        }
        else
        {
            switch (this.legendPos)
            {
                case c_oAscChartLegend.right:
                case c_oAscChartLegend.left:
                {
                    for(var i = 0; i < this.calculatedEntry.length; ++i)
                    {
                        var cur_legend_entry = this.calculatedEntry[i];

                    }
                    break;
                }
            }
        }
    },

    recalculateWithoutLayout: function()
    {}
};

function CLegendEntryGroup()
{
    this.x = null;
    this.y = null;
    this.legendGroup = null;
    this.drawingDocument = null;
    this.idx = null;
    this.spX = null;
    this.spY = null;
    this.markerType = null;

    this.spExtX = null;
    this.spExtY = null;
    this.spTransform = null;
    this.spBrush = null;
    this.spPen = null;
    this.geometry = null;

    this.textX = null;
    this.textY = null;
    this.textExtX = null;
    this.textExtY = null;

    this.transform = null;
    this.transformText = null;
    this.textBody = null;
}

CLegendEntryGroup.prototype =
{
    setLegendGroup: function(legendGroup)
    {
        this.legendGroup = legendGroup;
    },

    getStyles: function()
    {
        var styles = new CStyles();
        var default_style = new CStyle("defaultEntryStyle", null, null, styletype_Paragraph);
        default_style.TextPr.themeFont = "Calibri";
        default_style.TextPr.FontSize = 10;

        //default_style.ParaPr  TODO
        styles.Style[styles.Id] = default_style;
        ++styles.Id;

        var legend_style = new CStyle("legend_style", styles.Id-1, null, styletype_Paragraph);
        /*TODO*/
        styles.Style[styles.Id] = legend_style;
        ++styles.Id;
        var entry_style = new CStyle("entry_style", styles.Id - 1, null, styletype_Paragraph);
        if(isRealObject(this.legendGroup.legendEntries[this.idx]) && isRealObject(this.legendGroup.legendEntries[this.idx].txPr))
        {
            //TODO
        }
        styles.Style[styles.Id] = entry_style;
        ++styles.Id;
        return styles;
    },

    recalculateInternalPosition: function()
    {

    }
};

