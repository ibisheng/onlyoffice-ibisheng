function CRadarSeries()
{
    this.cat     = null;
    this.dLbls   = null;
    this.dPt     = null;
    this.idx     = null;
    this.marker  = null;
    this.order   = null;
    this.spPr    = null;
    this.tx      = null;
    this.val     = null;

    this.Id = g_oIdCouner.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CRadarSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_RadarSeries;
    },

    Write_ToBinary2: function()
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },
    setCat: function(pr)
    {
        History.Add(this, {Type: historyitem_RadarSeries_SetCat, oldPr: this.cat, newPr: pr});
        this.cat = pr;
    },
    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_RadarSeries_SetCat, oldPr: this.dLbls, newPr: pr});
        this.dLbls = pr;
    },
    setDPt: function(pr)
    {
        History.Add(this, {Type: historyitem_RadarSeries_SetCat, oldPr: this.dPt, newPr: pr});
        this.dPt = pr;
    },
    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_RadarSeries_SetCat, oldPr: this.idx, newPr: pr});
        this.idx = pr;
    },
    setMarker: function(pr)
    {
        History.Add(this, {Type: historyitem_RadarSeries_SetCat, oldPr: this.marker, newPr: pr});
        this.marker = pr;
    },
    setOrder: function(pr)
    {
        History.Add(this, {Type: historyitem_RadarSeries_SetCat, oldPr: this.order, newPr: pr});
        this.order = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_RadarSeries_SetCat, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },
    setTx: function(pr)
    {
        History.Add(this, {Type: historyitem_RadarSeries_SetCat, oldPr: this.tx, newPr: pr});
        this.tx = pr;
    },
    setVal: function(pr)
    {
        History.Add(this, {Type: historyitem_RadarSeries_SetCat, oldPr: this.val, newPr: pr});
        this.val = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_RadarSeries_SetCat:
            {
                this.cat = data.oldPr;
                break;
            }
            case historyitem_RadarSeries_SetDLbls:
            {
                this.dLbls = data.oldPr;
                break;
            }
            case historyitem_RadarSeries_SetDPt:
            {
                this.dPt = data.oldPr;
                break;
            }
            case historyitem_RadarSeries_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_RadarSeries_SetMarker:
            {
                this.marker = data.oldPr;
                break;
            }
            case historyitem_RadarSeries_SetOrder:
            {
                this.order = data.oldPr;
                break;
            }
            case historyitem_RadarSeries_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_RadarSeries_SetTx:
            {
                this.tx = data.oldPr;
                break;
            }
            case historyitem_RadarSeries_SetVal:
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
            case historyitem_RadarSeries_SetCat:
            {
                this.cat = data.newPr;
                break;
            }
            case historyitem_RadarSeries_SetDLbls:
            {
                this.dLbls = data.newPr;
                break;
            }
            case historyitem_RadarSeries_SetDPt:
            {
                this.dPt = data.newPr;
                break;
            }
            case historyitem_RadarSeries_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_RadarSeries_SetMarker:
            {
                this.marker = data.newPr;
                break;
            }
            case historyitem_RadarSeries_SetOrder:
            {
                this.order = data.newPr;
                break;
            }
            case historyitem_RadarSeries_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_RadarSeries_SetTx:
            {
                this.tx = data.newPr;
                break;
            }
            case historyitem_RadarSeries_SetVal:
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
            case historyitem_RadarSeries_SetCat:
            case historyitem_RadarSeries_SetDLbls:
            case historyitem_RadarSeries_SetDPt:
            case historyitem_RadarSeries_SetMarker:
            case historyitem_RadarSeries_SetSpPr:
            case historyitem_RadarSeries_SetTx:
            case historyitem_RadarSeries_SetVal:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_RadarSeries_SetIdx:
            case historyitem_RadarSeries_SetOrder:
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
            case historyitem_RadarSeries_SetCat:
            {
                this.cat = readObject(r);
                break;
            }
            case historyitem_RadarSeries_SetDLbls:
            {
                this.dLbls = readObject(r);
                break;
            }
            case historyitem_RadarSeries_SetDPt:
            {
                this.dPt = readObject(r);
                break;
            }
            case historyitem_RadarSeries_SetIdx:
            {
                this.idx = readLong(r);
                break;
            }
            case historyitem_RadarSeries_SetMarker:
            {
                this.marker = readObject(r);
                break;
            }
            case historyitem_RadarSeries_SetOrder:
            {
                this.order = readLong(r);
                break;
            }
            case historyitem_RadarSeries_SetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_RadarSeries_SetTx:
            {
                this.tx = readObject(r);
                break;
            }
            case historyitem_RadarSeries_SetVal:
            {
                this.val = readObject(r);
                break;
            }
        }
    }
};