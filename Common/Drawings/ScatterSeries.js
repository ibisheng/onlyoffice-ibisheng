function CScatterSeries()
{
    this.dLbls     = null;
    this.dPt       = null;
    this.errBars   = null;
    this.idx       = null;
    this.marker    = null;
    this.order     = null;
    this.smooth    = null;
    this.spPr      = null;
    this.trendline = null;
    this.tx        = null;
    this.xVal      = null;
    this.yVal      = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CScatterSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_ScatterSer;
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

    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_ScatterSer_SetDLbls, oldPr: this.dLbls, newPr:pr});
        this.dLbls = pr;
    },
    setDPt: function(pr)
    {
        History.Add(this, {Type: historyitem_ScatterSer_SetDPt, oldPr: this.dPt, newPr:pr});
        this.dPt = pr;
    },
    setErrBars: function(pr)
    {
        History.Add(this, {Type: historyitem_ScatterSer_SetErrBars, oldPr: this.errBars, newPr:pr});
        this.errBars = pr;
    },
    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_ScatterSer_SetIdx, oldPr: this.idx, newPr:pr});
        this.idx = pr;
    },
    setMarker: function(pr)
    {
        History.Add(this, {Type: historyitem_ScatterSer_SetMarker, oldPr: this.marker, newPr:pr});
        this.marker = pr;
    },
    setOrder: function(pr)
    {
        History.Add(this, {Type: historyitem_ScatterSer_SetOrder, oldPr: this.order, newPr:pr});
        this.order = pr;
    },
    setSmooth: function(pr)
    {
        History.Add(this, {Type: historyitem_ScatterSer_SetSmooth, oldPr: this.smooth, newPr:pr});
        this.smooth = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_ScatterSer_SetSpPr, oldPr: this.spPr, newPr:pr});
        this.spPr = pr;
    },
    setTrendline: function(pr)
    {
        History.Add(this, {Type: historyitem_ScatterSer_SetTrendline, oldPr: this.trendline, newPr:pr});
        this.trendline = pr;
    },
    setTx: function(pr)
    {
        History.Add(this, {Type: historyitem_ScatterSer_SetTx, oldPr: this.tx, newPr:pr});
        this.tx = pr;
    },
    setXVal: function(pr)
    {
        History.Add(this, {Type: historyitem_ScatterSer_SetXVal, oldPr: this.xVal, newPr:pr});
        this.xVal = pr;
    },
    setYVal: function(pr)
    {
        History.Add(this, {Type: historyitem_ScatterSer_SetYVal, oldPr: this.yVal, newPr:pr});
        this.yVal = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ScatterSer_SetDLbls:
            {
                this.dLbls = data.oldPr;
                break;
            }
            case historyitem_ScatterSer_SetDPt:
            {
                this.dPt = data.oldPr;
                break;
            }
            case historyitem_ScatterSer_SetErrBars:
            {
                this.errBars = data.oldPr;
                break;
            }
            case historyitem_ScatterSer_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_ScatterSer_SetMarker:
            {
                this.marker = data.oldPr;
                break;
            }
            case historyitem_ScatterSer_SetOrder:
            {
                this.order = data.oldPr;
                break;
            }
            case historyitem_ScatterSer_SetSmooth:
            {
                this.smooth = data.oldPr;
                break;
            }
            case historyitem_ScatterSer_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_ScatterSer_SetTrendline:
            {
                this.trendline = data.oldPr;
                break;
            }
            case historyitem_ScatterSer_SetTx:
            {
                this.tx = data.oldPr;
                break;
            }
            case historyitem_ScatterSer_SetXVal:
            {
                this.xVal = data.oldPr;
                break;
            }
            case historyitem_ScatterSer_SetYVal:
            {
                this.yVal = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ScatterSer_SetDLbls:
            {
                this.dLbls = data.newPr;
                break;
            }
            case historyitem_ScatterSer_SetDPt:
            {
                this.dPt = data.newPr;
                break;
            }
            case historyitem_ScatterSer_SetErrBars:
            {
                this.errBars = data.newPr;
                break;
            }
            case historyitem_ScatterSer_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_ScatterSer_SetMarker:
            {
                this.marker = data.newPr;
                break;
            }
            case historyitem_ScatterSer_SetOrder:
            {
                this.order = data.newPr;
                break;
            }
            case historyitem_ScatterSer_SetSmooth:
            {
                this.smooth = data.newPr;
                break;
            }
            case historyitem_ScatterSer_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_ScatterSer_SetTrendline:
            {
                this.trendline = data.newPr;
                break;
            }
            case historyitem_ScatterSer_SetTx:
            {
                this.tx = data.newPr;
                break;
            }
            case historyitem_ScatterSer_SetXVal:
            {
                this.xVal = data.newPr;
                break;
            }
            case historyitem_ScatterSer_SetYVal:
            {
                this.yVal = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_ScatterSer_SetDLbls:
            case historyitem_ScatterSer_SetDPt:
            case historyitem_ScatterSer_SetErrBars:
            case historyitem_ScatterSer_SetMarker:
            case historyitem_ScatterSer_SetSpPr:
            case historyitem_ScatterSer_SetTrendline:
            case historyitem_ScatterSer_SetTx:
            case historyitem_ScatterSer_SetXVal:
            case historyitem_ScatterSer_SetYVal:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.Get_Id());
                }
                break;
            }
            case historyitem_ScatterSer_SetIdx:
            case historyitem_ScatterSer_SetOrder:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
            case historyitem_ScatterSer_SetSmooth:
            {
                w.WriteBool(isRealBool(data.newPr));
                if(isRealBool(data.newPr))
                {
                    w.WriteBool(data.newPr);
                }
                break;
            }
        }
    },

    Load_Changes: function()
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_ScatterSer_SetDLbls:
            {
                if(r.GetBool())
                {
                    this.dLbls = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.dLbls = null;
                }
                break;
            }
            case historyitem_ScatterSer_SetDPt:
            {
                if(r.GetBool())
                {
                    this.dPt = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.dPt = null;
                }
                break;
            }
            case historyitem_ScatterSer_SetErrBars:
            {
                if(r.GetBool())
                {
                    this.errBars = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.errBars = null;
                }
                break;
            }
            case historyitem_ScatterSer_SetIdx:
            {
                if(r.GetBool())
                {
                    this.idx = r.GetLong();
                }
                else
                {
                    this.idx = null;
                }
                break;
            }
            case historyitem_ScatterSer_SetMarker:
            {
                if(r.GetBool())
                {
                    this.marker = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.marker = null;
                }
                break;
            }
            case historyitem_ScatterSer_SetOrder:
            {
                if(r.GetBool())
                {
                    this.order = r.GetLong();
                }
                else
                {
                    this.order = null;
                }
                break;
            }
            case historyitem_ScatterSer_SetSmooth:
            {
                if(r.GetBool())
                {
                    this.smooth = r.GetBool();
                }
                else
                {
                    this.smooth = null;
                }
                break;
            }
            case historyitem_ScatterSer_SetSpPr:
            {
                if(r.GetBool())
                {
                    this.spPr = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.spPr = null;
                }
                break;
            }
            case historyitem_ScatterSer_SetTrendline:
            {
                if(r.GetBool())
                {
                    this.trendline = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.trendline = null;
                }
                break;
            }
            case historyitem_ScatterSer_SetTx:
            {
                if(r.GetBool())
                {
                    this.tx = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.tx = null;
                }
                break;
            }
            case historyitem_ScatterSer_SetXVal:
            {
                if(r.GetBool())
                {
                    this.xVal = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.xVal = null;
                }
                break;
            }
            case historyitem_ScatterSer_SetYVal:
            {
                if(r.GetBool())
                {
                    this.yVal = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.yVal = null;
                }
                break;
            }
        }
    }
};