function CBarSeries()
{
    this.cat               = null;
    this.dLbls            = null;
    this.dPt               = null;
    this.errBars           = null;
    this.idx              = null;
    this.invertIfNegative  = null;
    this.order             = null;
    this.pictureOptions    = null;
    this.shape            = null;
    this.spPr             = null;
    this.trendline        = null;
    this.tx              = null;
    this.val             = null;
}

CBarSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_BarSeries;
    },

    Write_ToBinary2: function()
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },
    setCat: function(pr)
    {
        History.Add(this, {Type: historyitem_BarSeries_SetCat, oldPr: this.cat, newPr: pr});
        this.cat = pr;
    },
    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_BarSeries_SetDLbls, oldPr: this.dLbls, newPr: pr});
        this.dLbls = pr;
    },
    setDPt: function(pr)
    {
        History.Add(this, {Type: historyitem_BarSeries_SetDPt, oldPr: this.dPt, newPr: pr});
        this.dPt = pr;
    },
    setErrBars: function(pr)
    {
        History.Add(this, {Type: historyitem_BarSeries_SetErrBars, oldPr: this.errBars, newPr: pr});
        this.errBars = pr;
    },
    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_BarSeries_SetIdx, oldPr: this.idx, newPr: pr});
        this.idx = pr;
    },
    setInvertIfNegative: function(pr)
    {
        History.Add(this, {Type: historyitem_BarSeries_SetInvertIfNegative, oldPr: this.invertIfNegative, newPr: pr});
        this.invertIfNegative = pr;
    },
    setOrder: function(pr)
    {
        History.Add(this, {Type: historyitem_BarSeries_SetOrder, oldPr: this.order, newPr: pr});
        this.order = pr;
    },
    setPictureOptions: function(pr)
    {
        History.Add(this, {Type: historyitem_BarSeries_SetPictureOptions, oldPr: this.pictureOptions, newPr: pr});
        this.pictureOptions = pr;
    },
    setShape: function(pr)
    {
        History.Add(this, {Type: historyitem_BarSeries_SetShape, oldPr: this.shape, newPr: pr});
        this.shape = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_BarSeries_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },
    setTrendline: function(pr)
    {
        History.Add(this, {Type: historyitem_BarSeries_SetTrendline, oldPr: this.trendline, newPr: pr});
        this.trendline = pr;
    },
    setTx: function(pr)
    {
        History.Add(this, {Type: historyitem_BarSeries_SetTx, oldPr: this.tx, newPr: pr});
        this.tx = pr;
    },
    setVal: function(pr)
    {
        History.Add(this, {Type: historyitem_BarSeries_SetVal, oldPr: this.val, newPr: pr});
        this.val = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_BarSeries_SetCat:
            {
                this.cat = data.oldPr;
                break;
            }
            case historyitem_BarSeries_SetDLbls:
            {
                this.dLbls = data.oldPr;
                break;
            }
            case historyitem_BarSeries_SetDPt:
            {
                this.dPt = data.oldPr;
                break;
            }
            case historyitem_BarSeries_SetErrBars:
            {
                this.errBars = data.oldPr;
                break;
            }
            case historyitem_BarSeries_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_BarSeries_SetInvertIfNegative:
            {
                this.invertIfNegative = data.oldPr;
                break;
            }
            case historyitem_BarSeries_SetOrder:
            {
                this.order = data.oldPr;
                break;
            }
            case historyitem_BarSeries_SetPictureOptions:
            {
                this.pictureOptions = data.oldPr;
                break;
            }
            case historyitem_BarSeries_SetShape:
            {
                this.shape = data.oldPr;
                break;
            }
            case historyitem_BarSeries_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_BarSeries_SetTrendline:
            {
                this.trendline = data.oldPr;
                break;
            }
            case historyitem_BarSeries_SetTx:
            {
                this.tx = data.oldPr;
                break;
            }
            case historyitem_BarSeries_SetVal:
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
            case historyitem_BarSeries_SetCat:
            {
                this.cat = data.newPr;
                break;
            }
            case historyitem_BarSeries_SetDLbls:
            {
                this.dLbls = data.newPr;
                break;
            }
            case historyitem_BarSeries_SetDPt:
            {
                this.dPt = data.newPr;
                break;
            }
            case historyitem_BarSeries_SetErrBars:
            {
                this.errBars = data.newPr;
                break;
            }
            case historyitem_BarSeries_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_BarSeries_SetInvertIfNegative:
            {
                this.invertIfNegative = data.newPr;
                break;
            }
            case historyitem_BarSeries_SetOrder:
            {
                this.order = data.newPr;
                break;
            }
            case historyitem_BarSeries_SetPictureOptions:
            {
                this.pictureOptions = data.newPr;
                break;
            }
            case historyitem_BarSeries_SetShape:
            {
                this.shape = data.newPr;
                break;
            }
            case historyitem_BarSeries_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_BarSeries_SetTrendline:
            {
                this.trendline = data.newPr;
                break;
            }
            case historyitem_BarSeries_SetTx:
            {
                this.tx = data.newPr;
                break;
            }
            case historyitem_BarSeries_SetVal:
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
            case historyitem_BarSeries_SetCat:
            case historyitem_BarSeries_SetDLbls:
            case historyitem_BarSeries_SetDPt:
            case historyitem_BarSeries_SetErrBars:
            case historyitem_BarSeries_SetPictureOptions:
            case historyitem_BarSeries_SetShape:
            case historyitem_BarSeries_SetSpPr:
            case historyitem_BarSeries_SetTrendline:
            case historyitem_BarSeries_SetTx:
            case historyitem_BarSeries_SetVal:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_BarSeries_SetIdx:
            case historyitem_BarSeries_SetOrder:
            {
                writeLong(w, data.newPr);
                break;
            }
            case historyitem_BarSeries_SetInvertIfNegative:
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
            case historyitem_BarSeries_SetCat:
            {
                this.cat = readObject(r);
                break;
            }
            case historyitem_BarSeries_SetDLbls:
            {
                this.dLbls = readObject(r);
                break;
            }
            case historyitem_BarSeries_SetDPt:
            {
                this.dPt = readObject(r);
                break;
            }
            case historyitem_BarSeries_SetErrBars:
            {
                this.errBars = readObject(r);
                break;
            }
            case historyitem_BarSeries_SetIdx:
            {
                this.idx = readLong(r);
                break;
            }
            case historyitem_BarSeries_SetInvertIfNegative:
            {
                this.invertIfNegative = readBool(r);
                break;
            }
            case historyitem_BarSeries_SetOrder:
            {
                this.order = readLong(r);
                break;
            }
            case historyitem_BarSeries_SetPictureOptions:
            {
                this.pictureOptions = readObject(r);
                break;
            }
            case historyitem_BarSeries_SetShape:
            {
                this.shape = readObject(r);
                break;
            }
            case historyitem_BarSeries_SetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_BarSeries_SetTrendline:
            {
                this.trendline = readObject(r);
                break;
            }
            case historyitem_BarSeries_SetTx:
            {
                this.tx = readObject(r);
                break;
            }
            case historyitem_BarSeries_SetVal:
            {
                this.val = readObject(r);
                break;
            }
        }
    }
};