var BAR_DIR_BAR = 0;
var BAR_DIR_COL = 1;

function CBarChart()
{
    this.axId        = null;
    this.barDir      = null;
    this.dLbls       = null;
    this.gapWidth    = null;
    this.grouping    = null;
    this.overlap     = null;
    this.series      = [];
    this.serLines    = null;
    this.varyColors  = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CBarChart.prototype =
{
    Grt_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_BarChart;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setAxId: function(pr)
    {
        History.Add(this, {Type: historyitem_BarChart_SetAxId, oldPr: this.axId, newPr:pr});
        this.axId = pr;
    },

    setBarDir: function(pr)
    {
        History.Add(this, {Type: historyitem_BarChart_SetBarDir, oldPr: this.barDir, newPr:pr});
        this.barDir = pr;
    },

    setDLbls     : function(pr)
    {
        History.Add(this, {Type: historyitem_BarChart_SetBarDir, oldPr: this.dLbls, newPr:pr});
        this.dLbls = pr;
    },
    setGapWidth: function(pr)
    {
        History.Add(this, {Type: historyitem_BarChart_SetBarDir, oldPr: this.gapWidth, newPr:pr});
        this.gapWidth = pr;
    },
    setGrouping: function(pr)
    {
        History.Add(this, {Type: historyitem_BarChart_SetBarDir, oldPr: this.grouping, newPr:pr});
        this.grouping = pr;
    },
    setOverlap: function(pr)
    {
        History.Add(this, {Type: historyitem_BarChart_SetBarDir, oldPr: this.overlap, newPr:pr});
        this.overlap = pr;
    },
    addSer: function(pr)
    {
        History.Add(this, {Type: historyitem_BarChart_SetBarDir, oldPr: this.series, newPr:pr});
        this.series = pr;
    },
    setSerLines: function(pr)
    {
        History.Add(this, {Type: historyitem_BarChart_SetBarDir, oldPr: this.serLines, newPr:pr});
        this.serLines = pr;
    },
    setVaryColors: function(pr)
    {
        History.Add(this, {Type: historyitem_BarChart_SetBarDir, oldPr: this.varyColors, newPr:pr});
        this.varyColors = pr;
    },

    Undo: function(data)
    {},

    Redo: function(data)
    {},

    Save_Changes: function()
    {},

    Load_Changes: function()
    {}
};