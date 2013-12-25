function CStockChart()
{
    this.axId       = null;
    this.dLbls      = null;
    this.dropLines  = null;
    this.hiLowLines = null;
    this.series      = [];
    this.upDownBars = null;


    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CStockChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return  historyitem_type_StockChart;
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
        History.Add(this, {Type: historyitem_StockChart_SetAxId, oldPr: this.axId, newPr: pr});
        this.axId = pr;
    },

    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_StockChart_SetDLbls, oldPr: this.dLbls, newPr: pr});
        this.dLbls = pr;
    },

    setDropLines: function(pr)
    {
        History.Add(this, {Type: historyitem_StockChart_SetDropLines, oldPr: this.dropLines, newPr: pr});
        this.dropLines = pr;
    },
    setHiLowLines: function(pr)
    {
        History.Add(this, {Type: historyitem_StockChart_SetHiLowLines, oldPr: this.hiLowLines, newPr: pr});
        this.hiLowLines = pr;
    },
    addSer: function(ser)
    {
        History.Add(this, {Type: historyitem_StockChart_AddSer, ser: ser});
        this.series.push(ser);
    },
    setUpDownBars: function(pr)
    {
        History.Add(this, {Type: historyitem_StockChart_SetUpDownBars, oldPr: this.upDownBars, newPr: pr});
        this.upDownBars = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_StockChart_SetAxId:
            {
                this.axId = data.oldPr;
                break
            }
            case historyitem_StockChart_SetDLbls:
            {
                this.dLbls = data.oldPr;
                break
            }
            case historyitem_StockChart_SetDropLines:
            {
                this.dropLines = data.oldPr;
                break
            }
            case historyitem_StockChart_SetHiLowLines:
            {
                this.hiLowLines = data.oldPr;
                break
            }
            case historyitem_StockChart_AddSer:
            {
                this.series = data.oldPr;
                break
            }
            case historyitem_StockChart_SetUpDownBars:
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
            case historyitem_StockChart_SetAxId:
            {
                this.axId = data.newPr;
                break
            }
            case historyitem_StockChart_SetDLbls:
            {
                this.dLbls = data.newPr;
                break
            }
            case historyitem_StockChart_SetDropLines:
            {
                this.dropLines = data.newPr;
                break
            }
            case historyitem_StockChart_SetHiLowLines:
            {
                this.hiLowLines = data.newPr;
                break
            }
            case historyitem_StockChart_AddSer:
            {
                this.series = data.newPr;
                break
            }
            case historyitem_StockChart_SetUpDownBars:
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