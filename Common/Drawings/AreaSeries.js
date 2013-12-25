
function CAreaSeries()
{
    this.cat            = null;
    this.dLbls          = null;
    this.dPt            = null;
    this.errBars        = null;
    this.idx            = null;
    this.order          = null;
    this.pictureOptions = null;
    this.spPr           = null;
    this.trendline      = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CAreaSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_AreaSeries;
    },

    Write_ToBinary2: function()
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    setCat: function(pr)
    {
        History.Add(this, {Type: historyitem_AreaSeries_SetCat, oldPr: this.cat, newPr: pr});
        this.cat = pr;
    },
    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_AreaSeries_SetDLbls, oldPr: this.dLbls, newPr: pr});
        this.dLbls = pr;
    },
    setDPt: function(pr)
    {
        History.Add(this, {Type: historyitem_AreaSeries_SetDPt, oldPr: this.dPt, newPr: pr});
        this.dPt = pr;
    },
    setErrBars: function(pr)
    {
        History.Add(this, {Type: historyitem_AreaSeries_SetErrBars, oldPr: this.errBars, newPr: pr});
        this.errBars = pr;
    },
    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_AreaSeries_SetIdx, oldPr: this.idx, newPr: pr});
        this.idx = pr;
    },
    setOrder: function(pr)
    {
        History.Add(this, {Type: historyitem_AreaSeries_SetOrder, oldPr: this.order, newPr: pr});
        this.order = pr;
    },
    setPictureOptions: function(pr)
    {
        History.Add(this, {Type: historyitem_AreaSeries_SetPictureOptions, oldPr: this.pictureOptions, newPr: pr});
        this.pictureOptions = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_AreaSeries_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },
    setTrendline: function(pr)
    {
        History.Add(this, {Type: historyitem_AreaSeries_SetTrendline, oldPr: this.trendline, newPr: pr});
        this.trendline = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_AreaSeries_SetCat:
            {
                this.cat = data.oldPr;
                break;
            }
            case historyitem_AreaSeries_SetDLbls:
            {
                this.dLbls = data.oldPr;
                break;
            }
            case historyitem_AreaSeries_SetDPt:
            {
                this.dPt = data.oldPr;
                break;
            }
            case historyitem_AreaSeries_SetErrBars:
            {
                this.errBars = data.oldPr;
                break;
            }
            case historyitem_AreaSeries_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_AreaSeries_SetOrder:
            {
                this.order = data.oldPr;
                break;
            }
            case historyitem_AreaSeries_SetPictureOptions:
            {
                this.pictureOptions = data.oldPr;
                break;
            }
            case historyitem_AreaSeries_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_AreaSeries_SetTrendline:
            {
                this.trendline = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_AreaSeries_SetCat:
            {
                this.cat = data.newPr;
                break;
            }
            case historyitem_AreaSeries_SetDLbls:
            {
                this.dLbls = data.newPr;
                break;
            }
            case historyitem_AreaSeries_SetDPt:
            {
                this.dPt = data.newPr;
                break;
            }
            case historyitem_AreaSeries_SetErrBars:
            {
                this.errBars = data.newPr;
                break;
            }
            case historyitem_AreaSeries_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_AreaSeries_SetOrder:
            {
                this.order = data.newPr;
                break;
            }
            case historyitem_AreaSeries_SetPictureOptions:
            {
                this.pictureOptions = data.newPr;
                break;
            }
            case historyitem_AreaSeries_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_AreaSeries_SetTrendline:
            {
                this.trendline = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_AreaSeries_SetCat:
            case historyitem_AreaSeries_SetDLbls:
            case historyitem_AreaSeries_SetDPt:
            case historyitem_AreaSeries_SetErrBars:
            case historyitem_AreaSeries_SetPictureOptions:
            case historyitem_AreaSeries_SetSpPr:
            case historyitem_AreaSeries_SetTrendline:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_AreaSeries_SetIdx:
            case historyitem_AreaSeries_SetOrder:
            {
                writeLong(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_AreaSeries_SetCat:
            {
                this.cat = readObject(r);
                break;
            }
            case historyitem_AreaSeries_SetDLbls:
            {
                this.dLbls = readObject(r);
                break;
            }
            case historyitem_AreaSeries_SetDPt:
            {
                this.dPt = readObject(r);
                break;
            }
            case historyitem_AreaSeries_SetErrBars:
            {
                this.errBars = readObject(r);
                break;
            }
            case historyitem_AreaSeries_SetIdx:
            {
                this.idx = readLong(r);
                break;
            }
            case historyitem_AreaSeries_SetOrder:
            {
                this.order = readLong(r);
                break;
            }
            case historyitem_AreaSeries_SetPictureOptions:
            {
                this.pictureOptions = readObject(r);
                break;
            }
            case historyitem_AreaSeries_SetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_AreaSeries_SetTrendline:
            {
                this.trendline = readObject(r);
                break;
            }
        }
    }
};
