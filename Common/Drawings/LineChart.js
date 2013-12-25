var GROUPING_PERCENT_STACKED = 0;
var GROUPING_STACKED = 1;
var GROUPING_STANDARD = 2;
function CLineChart()
{
    this.axId       = [];
    this.dLbls      = null;
    this.dropLines  = null;
    this.grouping   = null;
    this.hiLowLines = null;
    this.marker     = null;
    this.series      = [];
    this.smooth     = null;
    this.upDownBars = null;
    this.varyColors = null;


    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CLineChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return  historyitem_type_LineChart;
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

    addAxId: function(pr)
    {
        History.Add(this, {Type: historyitem_LineChart_AddAxId, axId:pr});
        this.axId.push(pr);
    },

    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_LineChart_SetDLbls, oldPr: this.dLbls, newPr: pr});
        this.dLbls = pr;
    },

    setDropLines: function(pr)
    {
        History.Add(this, {Type: historyitem_LineChart_SetDropLines, oldPr: this.dropLines, newPr: pr});
        this.dropLines = pr;
    },
    setGrouping: function(pr)
    {
        History.Add(this, {Type: historyitem_LineChart_SetGrouping, oldPr: this.grouping, newPr: pr});
        this.grouping = pr;
    },
    setHiLowLines: function(pr)
    {
        History.Add(this, {Type: historyitem_LineChart_SetHiLowLines, oldPr: this.hiLowLines, newPr: pr});
        this.hiLowLines = pr;
    },
    setMarker: function(pr)
    {
        History.Add(this, {Type: historyitem_LineChart_SetMarker, oldPr: this.marker, newPr: pr});
        this.marker = pr;
    },
    addSer: function(ser)
    {
        History.Add(this, {Type: historyitem_LineChart_AddSer, ser: ser});
        this.series.push(ser);
    },
    setSmooth: function(pr)
    {
        History.Add(this, {Type: historyitem_LineChart_SetSmooth, oldPr: this.smooth, newPr: pr});
        this.smooth = pr;
    },
    setUpDownBars: function(pr)
    {
        History.Add(this, {Type: historyitem_LineChart_SetUpDownBars, oldPr: this.upDownBars, newPr: pr});
        this.upDownBars = pr;
    },
    setVaryColors: function(pr)
    {
        History.Add(this, {Type: historyitem_LineChart_SetVaryColors, oldPr: this.varyColors, newPr: pr});
        this.varyColors = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_LineChart_AddAxId:
            {
                for(var i = this.axId.length-1; i > -1; --i)
                {
                    if(this.axId[i] === data.axId)
                    {
                        this.axId.splice(i, 1);
                        break;
                    }
                }
                break
            }
            case historyitem_LineChart_SetDLbls:
            {
                this.dLbls = data.oldPr;
                break
            }
            case historyitem_LineChart_SetDropLines:
            {
                this.dropLines = data.oldPr;
                break
            }
            case historyitem_LineChart_SetGrouping:
            {
                this.grouping = data.oldPr;
                break
            }
            case historyitem_LineChart_SetHiLowLines:
            {
                this.hiLowLines = data.oldPr;
                break
            }
            case historyitem_LineChart_SetMarker:
            {
                this.marker = data.oldPr;
                break
            }
            case historyitem_LineChart_SetSer:
            {
                this.series = data.oldPr;
                break
            }
            case historyitem_LineChart_SetSmooth:
            {
                this.axId = data.oldPr;
                break
            }
            case historyitem_LineChart_SetUpDownBars:
            {
                this.axId = data.oldPr;
                break
            }
            case historyitem_LineChart_SetVaryColors:
            {
                this.axId = data.oldPr;
                break
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_LineChart_AddAxId:
            {
                this.axId.push(data.axId);
                break
            }
            case historyitem_LineChart_SetDLbls:
            {
                this.dLbls = data.newPr;
                break
            }
            case historyitem_LineChart_SetDropLines:
            {
                this.dropLines = data.newPr;
                break
            }
            case historyitem_LineChart_SetGrouping:
            {
                this.grouping = data.newPr;
                break
            }
            case historyitem_LineChart_SetHiLowLines:
            {
                this.hiLowLines = data.newPr;
                break
            }
            case historyitem_LineChart_SetMarker:
            {
                this.marker = data.newPr;
                break
            }
            case historyitem_LineChart_AddSer:
            {
                this.series = data.newPr;
                break
            }
            case historyitem_LineChart_SetSmooth:
            {
                this.axId = data.newPr;
                break
            }
            case historyitem_LineChart_SetUpDownBars:
            {
                this.axId = data.newPr;
                break
            }
            case historyitem_LineChart_SetVaryColors:
            {
                this.axId = data.newPr;
                break
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);

    },

    Load_Changes: function(r)
    {}
};