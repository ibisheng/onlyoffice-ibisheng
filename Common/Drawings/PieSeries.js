function CPieSeries()
{
    this.cat       = null;
    this.dLbls     = null;
    this.dPt       = null;
    this.explosion = null;
    this.idx       = null;
    this.order     = null;
    this.spPr      = null;
    this.tx        = null;
    this.val       = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPieSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_PieSeries;
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
        History.Add(this, {Type: historyitem_PieSeries_SetCat, oldPr: this.cat, newPr:pr});
        this.cat = pr;
    },
    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_PieSeries_SetCat, oldPr: this.cat, newPr:pr});
        this.cat = pr;
    },
    setDPt: function(pr)
    {
        History.Add(this, {Type: historyitem_PieSeries_SetCat, oldPr: this.cat, newPr:pr});
        this.cat = pr;
    },
    setExplosion: function(pr)
    {
        History.Add(this, {Type: historyitem_PieSeries_SetCat, oldPr: this.cat, newPr:pr});
        this.cat = pr;
    },
    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_PieSeries_SetCat, oldPr: this.cat, newPr:pr});
        this.cat = pr;
    },
    setOrder: function(pr)
    {
        History.Add(this, {Type: historyitem_PieSeries_SetCat, oldPr: this.cat, newPr:pr});
        this.cat = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_PieSeries_SetCat, oldPr: this.cat, newPr:pr});
        this.cat = pr;
    },
    setTx: function(pr)
    {
        History.Add(this, {Type: historyitem_PieSeries_SetCat, oldPr: this.cat, newPr:pr});
        this.cat = pr;
    },
    setVal: function(pr)
    {
        History.Add(this, {Type: historyitem_PieSeries_SetCat, oldPr: this.cat, newPr:pr});
        this.cat = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_PieSeries_SetCat:
            {
                this.cat = data.oldPr;
                break;
            }
            case historyitem_PieSeries_SetDLbls:
            {
                this.dLbls = data.oldPr;
                break;
            }
            case historyitem_PieSeries_SetDPt:
            {
                this.dPt = data.oldPr;
                break;
            }
            case historyitem_PieSeries_SetExplosion:
            {
                this.explosion = data.oldPr;
                break;
            }
            case historyitem_PieSeries_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_PieSeries_SetOrder:
            {
                this.order = data.oldPr;
                break;
            }
            case historyitem_PieSeries_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_PieSeries_SetTx:
            {
                this.tx = data.oldPr;
                break;
            }
            case historyitem_PieSeries_SetVal:
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
            case historyitem_PieSeries_SetCat:
            {
                this.cat = data.newPr;
                break;
            }
            case historyitem_PieSeries_SetDLbls:
            {
                this.dLbls = data.newPr;
                break;
            }
            case historyitem_PieSeries_SetDPt:
            {
                this.dPt = data.newPr;
                break;
            }
            case historyitem_PieSeries_SetExplosion:
            {
                this.explosion = data.newPr;
                break;
            }
            case historyitem_PieSeries_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_PieSeries_SetOrder:
            {
                this.order = data.newPr;
                break;
            }
            case historyitem_PieSeries_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_PieSeries_SetTx:
            {
                this.tx = data.newPr;
                break;
            }
            case historyitem_PieSeries_SetVal:
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
            case historyitem_PieSeries_SetCat:
            case historyitem_PieSeries_SetDLbls:
            case historyitem_PieSeries_SetDPt:
            case historyitem_PieSeries_SetSpPr:
            case historyitem_PieSeries_SetTx:
            case historyitem_PieSeries_SetVal:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_PieSeries_SetExplosion:
            case historyitem_PieSeries_SetIdx:
            case historyitem_PieSeries_SetOrder:
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
            case historyitem_PieSeries_SetCat:
            {
                this.cat = readObject(r);
                break;
            }
            case historyitem_PieSeries_SetDLbls:
            {
                this.dLbls = readObject(r);
                break;
            }
            case historyitem_PieSeries_SetDPt:
            {
                this.dPt = readObject(r);
                break;
            }
            case historyitem_PieSeries_SetExplosion:
            {
                this.explosion = readLong(r);
                break;
            }
            case historyitem_PieSeries_SetIdx:
            {
                this.idx = readLong(r);
                break;
            }
            case historyitem_PieSeries_SetOrder:
            {
                this.order = readLong(r);
                break;
            }
            case historyitem_PieSeries_SetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_PieSeries_SetTx:
            {
                this.tx = readObject(r);
                break;
            }
            case historyitem_PieSeries_SetVal:
            {
                this.val = readObject(r);
                break;
            }
        }
    }
};