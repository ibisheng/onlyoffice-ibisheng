function CAreaChart()
{
    this.axId         = null;
    this.dLbls        = null;
    this.dropLines    = null;
    this.grouping     = null;
    this.series       = [];
    this.varyColors   = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CAreaChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return  historyitem_type_AreaChart;
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
        History.Add(this, {Type: historyitem_AreaChart_SetAxId, oldPr: this.axId, newPr: pr});
        this.axId = pr;
    },

    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_AreaChart_SetDLbls, oldPr: this.dLbls, newPr: pr});
        this.dLbls = pr;
    },

    setDropLines: function(pr)
    {
        History.Add(this, {Type: historyitem_AreaChart_SetDropLines, oldPr: this.dropLines, newPr: pr});
        this.dropLines = pr;
    },
    setGrouping: function(pr)
    {
        History.Add(this, {Type: historyitem_AreaChart_SetGrouping, oldPr: this.grouping, newPr: pr});
        this.grouping = pr;
    },
    addSer: function(ser)
    {
        History.Add(this, {Type: historyitem_AreaChart_AddSer, ser: ser});
        this.series.push(ser);
    },
    setVaryColors: function(pr)
    {
        History.Add(this, {Type: historyitem_AreaChart_SetVaryColors, oldPr: this.varyColors, newPr: pr});
        this.varyColors = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_AreaChart_SetAxId:
            {
                this.axId = data.oldPr;
                break
            }
            case historyitem_AreaChart_SetDLbls:
            {
                this.dLbls = data.oldPr;
                break
            }
            case historyitem_AreaChart_SetDropLines:
            {
                this.dropLines = data.oldPr;
                break
            }
            case historyitem_AreaChart_SetGrouping:
            {
                this.grouping = data.oldPr;
                break
            }
            case historyitem_AreaChart_SetVaryColors:
            {
                this.varyColors = data.oldPr;
                break
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_AreaChart_SetAxId:
            {
                this.axId = data.newPr;
                break
            }
            case historyitem_AreaChart_SetDLbls:
            {
                this.dLbls = data.newPr;
                break
            }
            case historyitem_AreaChart_SetDropLines:
            {
                this.dropLines = data.newPr;
                break
            }
            case historyitem_AreaChart_SetGrouping:
            {
                this.grouping = data.newPr;
                break
            }
            case historyitem_AreaChart_SetVaryColors:
            {
                this.varyColors = data.newPr;
                break
            }
        }
    },

    Save_Changes: function(data, w)
    {
    },

    Load_Changes: function(r)
    {}
};