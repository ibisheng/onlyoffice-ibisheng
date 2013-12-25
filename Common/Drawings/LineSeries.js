function CLineSeries()
{
    this.cat           = null;
    this.dLbls         = null;
    this.dPt           = null;
    this.errBars       = null;
    this.idx           = null;
    this.marker        = null;
    this.order         = null;
    this.smooth        = null;
    this.spPr          = null;
    this.trendline     = null;
    this.tx            = null;
    this.val           = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CLineSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_LineSeries;
    },

    Write_ToBinary: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setCat: function(pr)
    {
        History.Add(this, {Type: historyitem_LineSeries_SetCat, oldPr: this.cat, newPr: pr});
        this.cat = pr;
    },
    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_LineSeries_SetDLbls, oldPr: this.dLbls, newPr: pr});
        this.dLbls = pr;
    },
    setDPt: function(pr)
    {
        History.Add(this, {Type: historyitem_LineSeries_SetDPt, oldPr: this.dPt, newPr: pr});
        this.dPt = pr;
    },
    setErrBars: function(pr)
    {
        History.Add(this, {Type: historyitem_LineSeries_SetErrBars, oldPr: this.errBars, newPr: pr});
        this.errBars = pr;
    },
    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_LineSeries_SetIdx, oldPr: this.idx, newPr: pr});
        this.idx = pr;
    },
    setMarker: function(pr)
    {
        History.Add(this, {Type: historyitem_LineSeries_SetMarker, oldPr: this.marker, newPr: pr});
        this.marker = pr;
    },
    setOrder: function(pr)
    {
        History.Add(this, {Type: historyitem_LineSeries_SetOrder, oldPr: this.order, newPr: pr});
        this.order = pr;
    },
    setSmooth: function(pr)
    {
        History.Add(this, {Type: historyitem_LineSeries_SetSmooth, oldPr: this.smooth, newPr: pr});
        this.smooth = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_LineSeries_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },
    setTrendline: function(pr)
    {
        History.Add(this, {Type: historyitem_LineSeries_SetTrendline, oldPr: this.trendline, newPr: pr});
        this.trendline = pr;
    },
    setTx: function(pr)
    {
        History.Add(this, {Type: historyitem_LineSeries_SetTx, oldPr: this.tx, newPr: pr});
        this.tx = pr;
    },
    setVal: function(pr)
    {
        History.Add(this, {Type: historyitem_LineSeries_SetVal, oldPr: this.val, newPr: pr});
        this.val = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_LineSeries_SetCat:
            {
                this.cat = data.oldPr;
                break;
            }
            case historyitem_LineSeries_SetDLbls:
            {
                this.dLbls = data.oldPr;
                break;
            }
            case historyitem_LineSeries_SetDPt:
            {
                this.dPt = data.oldPr;
                break;
            }
            case historyitem_LineSeries_SetErrBars:
            {
                this.errBars = data.oldPr;
                break;
            }
            case historyitem_LineSeries_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_LineSeries_SetMarker:
            {
                this.marker = data.oldPr;
                break;
            }
            case historyitem_LineSeries_SetOrder:
            {
                this.order = data.oldPr;
                break;
            }
            case historyitem_LineSeries_SetSmooth:
            {
                this.smooth = data.oldPr;
                break;
            }
            case historyitem_LineSeries_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_LineSeries_SetTrendline:
            {
                this.trendline = data.oldPr;
                break;
            }
            case historyitem_LineSeries_SetTx:
            {
                this.tx = data.oldPr;
                break;
            }
            case historyitem_LineSeries_SetVal:
            {
                this.val = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_LineSeries_SetCat:
            {
                this.cat = data.newPr;
                break;
            }
            case historyitem_LineSeries_SetDLbls:
            {
                this.dLbls = data.newPr;
                break;
            }
            case historyitem_LineSeries_SetDPt:
            {
                this.dPt = data.newPr;
                break;
            }
            case historyitem_LineSeries_SetErrBars:
            {
                this.errBars = data.newPr;
                break;
            }
            case historyitem_LineSeries_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_LineSeries_SetMarker:
            {
                this.marker = data.newPr;
                break;
            }
            case historyitem_LineSeries_SetOrder:
            {
                this.order = data.newPr;
                break;
            }
            case historyitem_LineSeries_SetSmooth:
            {
                this.smooth = data.newPr;
                break;
            }
            case historyitem_LineSeries_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_LineSeries_SetTrendline:
            {
                this.trendline = data.newPr;
                break;
            }
            case historyitem_LineSeries_SetTx:
            {
                this.tx = data.newPr;
                break;
            }
            case historyitem_LineSeries_SetVal:
            {
                this.val = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_LineSeries_SetCat:
            case historyitem_LineSeries_SetDLbls:
            case historyitem_LineSeries_SetDPt:
            case historyitem_LineSeries_SetErrBars:
            case historyitem_LineSeries_SetMarker:
            case historyitem_LineSeries_SetSpPr:
            case historyitem_LineSeries_SetTrendline:
            case historyitem_LineSeries_SetTx:
            case historyitem_LineSeries_SetVal:
            {
                writeObject(w, data.newPr);
                this.cat = data.newPr;
                break;
            }
            case historyitem_LineSeries_SetIdx:
            case historyitem_LineSeries_SetOrder:
            {
                writeLong(w, data.newPr);
                break;
            }
            case historyitem_LineSeries_SetSmooth:
            {
                writeBool(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_LineSeries_SetCat:
            {
                this.cat = readObject(r);
                break;
            }
            case historyitem_LineSeries_SetDLbls:
            {
                this.dLbls = readObject(r);
                break;
            }
            case historyitem_LineSeries_SetDPt:
            {
                this.dPt = readObject(r);
                break;
            }
            case historyitem_LineSeries_SetErrBars:
            {
                this.errBars = readObject(r);
                break;
            }
            case historyitem_LineSeries_SetIdx:
            {
                this.idx = readLong(r);
                break;
            }
            case historyitem_LineSeries_SetMarker:
            {
                this.marker = readObject(r);
                break;
            }
            case historyitem_LineSeries_SetOrder:
            {
                this.order = readLong(r);
                break;
            }
            case historyitem_LineSeries_SetSmooth:
            {
                this.smooth = readBool(r);
                break;
            }
            case historyitem_LineSeries_SetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_LineSeries_SetTrendline:
            {
                this.trendline = readObject(r);
                break;
            }
            case historyitem_LineSeries_SetTx:
            {
                this.tx = readObject(r);
                break;
            }
            case historyitem_LineSeries_SetVal:
            {
                this.val = readObject(r);
                break;
            }
        }
    }
};